"""Схема ответа на предсказание."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class PredictionResponse(BaseModel):
    """Результат POST /predict. Строится прямо из ORM-объекта Prediction."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    is_failure: bool
    failure_probability: float
    failure_type: str | None
    inference_time_ms: float
    created_at: datetime
