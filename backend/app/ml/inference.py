"""Загрузка моделей и каскадный inference.

Каскад: бинарная модель оценивает вероятность отказа; если она ≥ threshold,
запускается мультиклассовая модель и определяет тип отказа.
"""

import time
from dataclasses import dataclass
from typing import Any

import joblib
import pandas as pd
import structlog

log = structlog.get_logger()


@dataclass
class ModelBundle:
    """Загруженные в память модели и их метаданные."""

    binary_pipeline: Any
    threshold: float
    binary_features: list[str]
    multiclass_pipeline: Any
    label_encoder: Any
    multiclass_features: list[str]


@dataclass
class PredictionResult:
    """Результат каскада для одной строки."""

    is_failure: bool
    failure_probability: float
    failure_type: str | None
    inference_time_ms: float


def load_models(binary_path: str, multiclass_path: str) -> ModelBundle:
    """Загрузить оба .pkl в память. Вызывается один раз при старте."""
    binary = joblib.load(binary_path)
    multiclass = joblib.load(multiclass_path)

    bundle = ModelBundle(
        binary_pipeline=binary["pipeline"],
        threshold=float(binary["threshold"]),
        binary_features=list(binary["features"]),
        multiclass_pipeline=multiclass["pipeline"],
        label_encoder=multiclass["label_encoder"],
        multiclass_features=list(multiclass["features"]),
    )
    log.info(
        "models_loaded",
        binary_path=binary_path,
        multiclass_path=multiclass_path,
        threshold=bundle.threshold,
        failure_types=list(bundle.label_encoder.classes_),
    )
    return bundle


def predict(bundle: ModelBundle, features_df: pd.DataFrame) -> PredictionResult:
    """Прогнать одну строку признаков через каскад."""
    start = time.perf_counter()

    # Переупорядочиваем колонки строго под модель (защита от случайного порядка).
    x_binary = features_df[bundle.binary_features]
    proba = float(bundle.binary_pipeline.predict_proba(x_binary)[:, 1][0])
    is_failure = proba >= bundle.threshold

    failure_type: str | None = None
    if is_failure:
        x_multi = features_df[bundle.multiclass_features]
        encoded = bundle.multiclass_pipeline.predict(x_multi)
        failure_type = str(bundle.label_encoder.inverse_transform(encoded)[0])

    elapsed_ms = (time.perf_counter() - start) * 1000.0
    return PredictionResult(
        is_failure=bool(is_failure),
        failure_probability=proba,
        failure_type=failure_type,
        inference_time_ms=round(elapsed_ms, 3),
    )
