"""Точка входа FastAPI-приложения.

Миграции применяются ОТДЕЛЬНЫМ шагом (entrypoint.sh → `alembic upgrade head`)
до запуска воркеров, поэтому в lifespan их нет — только инициализация ресурсов.
"""

from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.core.errors import register_exception_handlers
from app.core.logging import setup_logging
from app.core.redis import close_redis, init_redis
from app.db.session import close_db, init_db
from app.middleware.logging import LoggingMiddleware
from app.middleware.metrics import setup_metrics
from app.ml.inference import load_models

settings = get_settings()
log = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging(level=settings.LOG_LEVEL, json_logs=settings.is_production)
    log.info("startup_begin", app_env=settings.APP_ENV)

    # PostgreSQL: движок и фабрика сессий (коннект ленивый).
    init_db()

    # ML-модели в память. Сбой загрузки не валит старт — /health покажет degraded,
    # /predict вернёт 503 (см. get_model_bundle → ModelsNotLoadedError).
    app.state.model_bundle = None
    try:
        app.state.model_bundle = load_models(
            settings.BINARY_MODEL_PATH, settings.MULTICLASS_MODEL_PATH
        )
    except Exception as exc:  # noqa: BLE001
        log.critical("models_load_failed", error=str(exc), exc_info=True)

    # Redis: клиент (коннект ленивый).
    init_redis()

    log.info("startup_complete")
    yield

    # Shutdown: аккуратно закрываем ресурсы.
    await close_redis()
    await close_db()
    log.info("shutdown_complete")


app = FastAPI(
    title="Predictive Maintenance API",
    description="ML-система предсказания отказов промышленного оборудования",
    version="0.1.0",
    lifespan=lifespan,
)

# Middleware: LoggingMiddleware добавляем первым → CORS оказывается внешним
# (обрабатывает preflight и добавляет заголовки даже к ответам с ошибками).
app.add_middleware(LoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Единый формат ошибок.
register_exception_handlers(app)

# Prometheus /metrics.
setup_metrics(app)

# Бизнес-роуты.
app.include_router(api_router)


@app.get("/", tags=["meta"])
async def root():
    return {"message": "Predictive Maintenance API", "docs": "/docs"}
