"""История последних вводов в Redis (быстрый кэш для фронтенда).

Список хранится под ключом REDIS_HISTORY_KEY: новые записи добавляются слева
(LPUSH), длина ограничивается LTRIM до REDIS_HISTORY_LIMIT. Каждая запись —
JSON-строка с входными параметрами, результатом и timestamp.
"""

import json
from datetime import datetime, timezone

from redis.asyncio import Redis

from app.core.config import get_settings


async def push_to_history(redis: Redis, record: dict) -> None:
    """Добавить запись в начало истории и обрезать список до лимита."""
    settings = get_settings()

    # Не мутируем переданный словарь; гарантируем наличие timestamp.
    payload = {**record}
    payload.setdefault("timestamp", datetime.now(timezone.utc).isoformat())

    serialized = json.dumps(payload, default=str)

    # LPUSH + LTRIM (+ скользящий EXPIRE) одним атомарным конвейером.
    async with redis.pipeline(transaction=True) as pipe:
        pipe.lpush(settings.REDIS_HISTORY_KEY, serialized)
        pipe.ltrim(settings.REDIS_HISTORY_KEY, 0, settings.REDIS_HISTORY_LIMIT - 1)
        # TTL обновляется на каждый push: история живёт, пока есть активность.
        if settings.REDIS_HISTORY_TTL > 0:
            pipe.expire(settings.REDIS_HISTORY_KEY, settings.REDIS_HISTORY_TTL)
        await pipe.execute()


async def get_history(redis: Redis) -> list[dict]:
    """Вернуть всю историю (новые сверху) как список словарей."""
    settings = get_settings()
    items = await redis.lrange(settings.REDIS_HISTORY_KEY, 0, -1)
    return [json.loads(item) for item in items]
