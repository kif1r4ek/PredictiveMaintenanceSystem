"""Prometheus-метрики.

Стандартные HTTP-метрики добавляет prometheus-fastapi-instrumentator
(`setup_metrics`). Поверх — кастомные доменные метрики предсказаний,
обновляемые из сервиса через `record_prediction`.
"""

from fastapi import FastAPI
from prometheus_client import Counter, Gauge, Histogram
from prometheus_fastapi_instrumentator import Instrumentator

# ── Кастомные доменные метрики ───────────────────────────────────────────────
PREDICTIONS_TOTAL = Counter(
    "pm_predictions_total",
    "Количество предсказаний",
    labelnames=("is_failure", "failure_type"),
)
INFERENCE_DURATION = Histogram(
    "pm_inference_duration_seconds",
    "Время каскадного inference, сек",
)
FAILURE_PROBABILITY = Gauge(
    "pm_failure_probability",
    "Вероятность отказа последнего предсказания",
)


def setup_metrics(app: FastAPI) -> None:
    """Подключить инструментатор и эндпоинт /metrics. Вызывается в main.py."""
    Instrumentator().instrument(app).expose(
        app, endpoint="/metrics", include_in_schema=False
    )


def record_prediction(
    is_failure: bool,
    failure_type: str | None,
    failure_probability: float,
    inference_time_ms: float,
) -> None:
    """Обновить доменные метрики по результату предсказания."""
    PREDICTIONS_TOTAL.labels(
        is_failure=str(is_failure).lower(),
        failure_type=failure_type or "none",
    ).inc()
    INFERENCE_DURATION.observe(inference_time_ms / 1000.0)
    FAILURE_PROBABILITY.set(failure_probability)
