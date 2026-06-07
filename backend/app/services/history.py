"""Бизнес-логика истории предсказаний (Redis или PostgreSQL)."""

from enum import Enum

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import cache, crud
from app.schemas import HistoryItem


class HistorySource(str, Enum):
    redis = "redis"
    db = "db"


async def get_history(
    source: HistorySource,
    limit: int,
    offset: int,
    session: AsyncSession,
    redis: Redis,
) -> list[HistoryItem]:
    """Вернуть историю из выбранного источника как список HistoryItem."""
    if source is HistorySource.redis:
        # Быстрый путь: последние вводы из кэша (offset к Redis не применяем).
        items = await cache.get_history(redis)
        return [HistoryItem.model_validate(item) for item in items[:limit]]

    # Полный путь: из PostgreSQL с пагинацией.
    rows = await crud.get_predictions(session, limit=limit, offset=offset)
    return [HistoryItem.model_validate(row) for row in rows]
