"""Асинхронный движок и сессии SQLAlchemy.

Движок и фабрика сессий создаются один раз при старте через `init_db()`
(вызывается из lifespan в main.py) и закрываются через `close_db()`.
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import get_settings

# Глобальные синглтоны движка и фабрики сессий. Заполняются в init_db().
_engine: AsyncEngine | None = None
_sessionmaker: async_sessionmaker[AsyncSession] | None = None


def init_db(url: str | None = None) -> AsyncEngine:
    """Создать async-движок и фабрику сессий. Вызывается при старте приложения."""
    global _engine, _sessionmaker

    dsn = url or get_settings().DATABASE_URL
    _engine = create_async_engine(
        dsn,
        echo=False,            # SQL в логи не дублируем — за это отвечает LOG_LEVEL
        pool_pre_ping=True,    # проверять соединение перед выдачей из пула
    )
    _sessionmaker = async_sessionmaker(_engine, expire_on_commit=False)
    return _engine


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Зависимость FastAPI: выдаёт сессию на время запроса и закрывает её."""
    if _sessionmaker is None:
        raise RuntimeError("БД не инициализирована — сначала вызовите init_db().")

    async with _sessionmaker() as session:
        yield session


async def close_db() -> None:
    """Закрыть пул соединений при остановке приложения."""
    global _engine
    if _engine is not None:
        await _engine.dispose()
        _engine = None
