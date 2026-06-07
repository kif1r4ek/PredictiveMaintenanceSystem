"""POST /predict — контроллер (HTTP-обвязка, логика в сервисе)."""

from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_model_bundle
from app.core.redis import get_redis
from app.db.session import get_session
from app.ml.inference import ModelBundle
from app.schemas import PredictionRequest, PredictionResponse
from app.services import prediction as prediction_service

router = APIRouter(tags=["prediction"])


@router.post("/predict", response_model=PredictionResponse)
async def create_prediction(
    payload: PredictionRequest,
    session: AsyncSession = Depends(get_session),
    redis: Redis = Depends(get_redis),
    bundle: ModelBundle = Depends(get_model_bundle),
) -> PredictionResponse:
    prediction = await prediction_service.create_prediction(
        payload, bundle, session, redis
    )
    return PredictionResponse.model_validate(prediction)
