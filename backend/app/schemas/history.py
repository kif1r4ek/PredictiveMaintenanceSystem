"""Схема записи истории для GET /history.

Самостоятельная модель (намеренно с дублированием входных полей) — строится
как из ORM-объекта Prediction (source=db), так и из dict в Redis
(source=redis). Поля без жёстких границ: это уже сохранённые, ранее
провалидированные данные, а не пользовательский ввод.
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class HistoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID | None = None
    created_at: datetime
    product_type: str
    rotational_speed: float
    torque: float
    tool_wear: float
    air_temperature: float
    process_temperature: float
    is_failure: bool
    failure_probability: float
    failure_type: str | None
