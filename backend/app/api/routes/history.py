"""GET /history — контроллер (HTTP-обвязка, логика в сервисе)."""

from fastapi import APIRouter, Depends, Query
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.redis import get_redis
from app.db.session import get_session
from app.schemas import HistoryItem
from app.services import history as history_service
from app.services.history import HistorySource

router = APIRouter(tags=["history"])


@router.get("/history", response_model=list[HistoryItem])
async def get_history(
    source: HistorySource = HistorySource.redis,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    session: AsyncSession = Depends(get_session),
    redis: Redis = Depends(get_redis),
) -> list[HistoryItem]:
    return await history_service.get_history(source, limit, offset, session, redis)
