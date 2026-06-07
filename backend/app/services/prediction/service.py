"""Оркестрация предсказания: связывает инференс, персист и кэш."""

import structlog
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import cache, crud
from app.db.models import Prediction
from app.ml.inference import ModelBundle
from app.ml.inference import predict as run_inference
from app.ml.preprocessing import engineer_features
from app.middleware.metrics import record_prediction
from app.schemas import PredictionRequest
from app.services.prediction.builders import build_db_record, build_history_record

log = structlog.get_logger()


async def create_prediction(
    payload: PredictionRequest,
    bundle: ModelBundle,
    session: AsyncSession,
    redis: Redis,
) -> Prediction:
    """Каскад → запись в PostgreSQL (истина) → запись в Redis-историю (кэш)."""
    raw = payload.model_dump()
    features_df = engineer_features(raw)
    result = run_inference(bundle, features_df)

    prediction = await crud.create_prediction(
        session, build_db_record(raw, features_df, result)
    )
    await _save_to_history(redis, prediction, raw, result)

    record_prediction(
        is_failure=result.is_failure,
        failure_type=result.failure_type,
        failure_probability=result.failure_probability,
        inference_time_ms=result.inference_time_ms,
    )

    log.info(
        "prediction_done",
        id=str(prediction.id),
        is_failure=result.is_failure,
        failure_type=result.failure_type,
        proba=round(result.failure_probability, 4),
        inference_time_ms=result.inference_time_ms,
    )
    return prediction


async def _save_to_history(
    redis: Redis, prediction: Prediction, raw: dict, result
) -> None:
    """Положить запись в Redis-историю. Некритично: сбой не роняет запрос."""
    record = build_history_record(prediction.id, prediction.created_at, raw, result)
    try:
        await cache.push_to_history(redis, record)
    except Exception as exc:  # noqa: BLE001 — кэш не критичен
        log.warning("history_push_failed", error=str(exc))
