"""Pydantic-схемы API. Реэкспорт для удобных импортов `from app.schemas import ...`."""

from app.schemas.health import HealthResponse
from app.schemas.history import HistoryItem
from app.schemas.inputs import MachineInput, PredictionRequest
from app.schemas.responses import PredictionResponse

__all__ = [
    "MachineInput",
    "PredictionRequest",
    "PredictionResponse",
    "HistoryItem",
    "HealthResponse",
]
