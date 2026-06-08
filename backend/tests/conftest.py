"""Общие фикстуры тестов.

Юнит-тесты не требуют внешних сервисов. Интеграционные (`@pytest.mark.integration`)
поднимают движок БД + Redis-клиент из глобалей приложения и работают через
httpx ASGITransport (без сети). Запуск только юнитов: `pytest -m "not integration"`.
"""

import os
from pathlib import Path

# Для локального/CI запуска адресуем сервисы на localhost (перекрывает .env,
# где хост = имя docker-сервиса). Делаем до импорта настроек приложения.
os.environ.setdefault("POSTGRES_HOST", "localhost")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")

import pytest  # noqa: E402
import pytest_asyncio  # noqa: E402
from fastapi import FastAPI  # noqa: E402
from httpx import ASGITransport, AsyncClient  # noqa: E402

from app.api.router import api_router  # noqa: E402
from app.core.errors import register_exception_handlers  # noqa: E402
from app.ml.inference import load_models  # noqa: E402

_REPO_ROOT = Path(__file__).resolve().parents[2]
_MODELS_DIR = _REPO_ROOT / "models"


@pytest.fixture(scope="session")
def model_bundle():
    """Реальные модели из models/ (загружаются один раз на сессию)."""
    return load_models(
        str(_MODELS_DIR / "binary_model.pkl"),
        str(_MODELS_DIR / "multiclass_model.pkl"),
    )


@pytest_asyncio.fixture
async def client(model_bundle):
    """HTTP-клиент к тестовому приложению с живыми БД и Redis.

    Перед каждым тестом пересоздаёт таблицы и чистит ключ истории в Redis.
    """
    from app.core.config import get_settings
    from app.core.redis import close_redis, get_redis, init_redis
    from app.db.base import Base
    from app.db.session import close_db, init_db
    import app.db.models  # noqa: F401 — регистрирует таблицы в Base.metadata

    engine = init_db()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    init_redis()
    await get_redis().delete(get_settings().REDIS_HISTORY_KEY)

    app = FastAPI()
    register_exception_handlers(app)
    app.include_router(api_router)
    app.state.model_bundle = model_bundle

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await close_redis()
    await close_db()
