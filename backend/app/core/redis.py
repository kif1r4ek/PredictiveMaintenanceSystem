"""Асинхронный клиент Redis.

Клиент создаётся один раз при старте через `init_redis()` (вызывается из
lifespan в main.py) и закрывается через `close_redis()`. В отличие от сессии
БД, клиент Redis — это пул соединений, который можно безопасно шарить между
запросами, поэтому `get_redis()` возвращает сам клиент, а не генератор.
"""

from redis.asyncio import Redis

from app.core.config import get_settings

# Глобальный синглтон клиента. Заполняется в init_redis().
_redis: Redis | None = None


def init_redis(url: str | None = None) -> Redis:
    """Создать async-клиент Redis. Вызывается при старте приложения."""
    global _redis

    dsn = url or get_settings().REDIS_URL
    # decode_responses=True → из Redis приходят str, а не bytes (удобно для JSON).
    _redis = Redis.from_url(dsn, encoding="utf-8", decode_responses=True)
    return _redis


def get_redis() -> Redis:
    """Зависимость FastAPI: возвращает общий клиент Redis."""
    if _redis is None:
        raise RuntimeError("Redis не инициализирован — сначала вызовите init_redis().")
    return _redis


async def close_redis() -> None:
    """Закрыть пул соединений при остановке приложения."""
    global _redis
    if _redis is not None:
        await _redis.aclose()
        _redis = None
