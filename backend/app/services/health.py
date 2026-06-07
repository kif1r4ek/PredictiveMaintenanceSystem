"""Бизнес-логика healthcheck: проверка зависимостей сервиса."""

import structlog
from redis.asyncio import Redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import HealthResponse

log = structlog.get_logger()


async def check_health(
    models_loaded: bool, session: AsyncSession, redis: Redis
) -> HealthResponse:
    """Проверить модели, PostgreSQL и Redis; вернуть агрегированный статус."""
    try:
        await session.execute(text("SELECT 1"))
        database_ok = True
    except Exception as exc:  # noqa: BLE001
        log.warning("health_db_failed", error=str(exc))
        database_ok = False

    try:
        redis_ok = bool(await redis.ping())
    except Exception as exc:  # noqa: BLE001
        log.warning("health_redis_failed", error=str(exc))
        redis_ok = False

    status = "ok" if (models_loaded and database_ok and redis_ok) else "degraded"
    return HealthResponse(
        status=status, models=models_loaded, database=database_ok, redis=redis_ok
    )
