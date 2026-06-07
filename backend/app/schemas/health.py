"""Схема ответа healthcheck."""

from typing import Literal

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Статус сервиса и его зависимостей."""

    status: Literal["ok", "degraded"]
    models: bool
    database: bool
    redis: bool
