"""Чистые функции сборки записей предсказания для хранилищ.

Без побочных эффектов и без I/O — только преобразование данных, поэтому
легко тестируются изолированно.
"""

from datetime import datetime
from uuid import UUID

import pandas as pd

from app.ml.inference import PredictionResult


def build_db_record(
    raw: dict, features_df: pd.DataFrame, result: PredictionResult
) -> dict:
    """Полная запись для PostgreSQL: сырые входы + производные + результат."""
    row = features_df.iloc[0]
    return {
        **raw,
        "temp_diff": float(row["temp_diff"]),
        "power": float(row["power"]),
        "tool_wear_torque": float(row["tool_wear_torque"]),
        "is_failure": result.is_failure,
        "failure_probability": result.failure_probability,
        "failure_type": result.failure_type,
        "inference_time_ms": result.inference_time_ms,
    }


def build_history_record(
    prediction_id: UUID, created_at: datetime, raw: dict, result: PredictionResult
) -> dict:
    """Облегчённая запись для Redis-истории (подмножество для фронтенда)."""
    return {
        "id": str(prediction_id),
        "created_at": created_at.isoformat(),
        **raw,
        "is_failure": result.is_failure,
        "failure_probability": result.failure_probability,
        "failure_type": result.failure_type,
    }
