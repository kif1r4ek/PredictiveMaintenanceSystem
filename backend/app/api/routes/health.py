"""GET /health — контроллер (HTTP-обвязка, логика в сервисе)."""

from fastapi import APIRouter, Depends, Request
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.redis import get_redis
from app.db.session import get_session
from app.schemas import HealthResponse
from app.services import health as health_service

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health(
    request: Request,
    session: AsyncSession = Depends(get_session),
    redis: Redis = Depends(get_redis),
) -> HealthResponse:
    models_loaded = getattr(request.app.state, "model_bundle", None) is not None
    return await health_service.check_health(models_loaded, session, redis)
