"""Конфигурация приложения.

Все настройки читаются из переменных окружения (в Docker — через `env_file`
в docker-compose, локально — из `.env` в корне проекта). Доступ к настройкам
только через синглтон `get_settings()`.
"""

from functools import lru_cache
from typing import Annotated, Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    """Типизированные настройки сервиса. Имя поля = имя переменной окружения."""

    model_config = SettingsConfigDict(
        # Локальный запуск: ".env" (из папки backend) или "../.env" (из корня).
        # В контейнере переменные приходят из окружения, файлов может не быть.
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ─────────────────────────────────────────────────────────
    APP_ENV: Literal["development", "production"] = "development"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    LOG_LEVEL: str = "INFO"

    # ── Models ──────────────────────────────────────────────────────────────
    BINARY_MODEL_PATH: str = "models/binary_model.pkl"
    MULTICLASS_MODEL_PATH: str = "models/multiclass_model.pkl"

    # ── PostgreSQL ──────────────────────────────────────────────────────────
    # Дефолты совпадают с .env для dev. DSN не задаётся отдельно — собирается
    # из этих компонент в свойстве DATABASE_URL ниже.
    POSTGRES_USER: str = "mluser"
    POSTGRES_PASSWORD: str = "mlproject"
    POSTGRES_DB: str = "predictive_maintenance"
    POSTGRES_HOST: str = "postgres"
    POSTGRES_PORT: int = 5432

    # ── Redis ───────────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://redis:6379/0"
    REDIS_HISTORY_KEY: str = "pm:recent_inputs"
    REDIS_HISTORY_LIMIT: int = 100
    REDIS_HISTORY_TTL: int = 604800  # sliding TTL ключа истории, сек (0 = выключено)

    # ── Monitoring ──────────────────────────────────────────────────────────
    LOKI_URL: str = "http://loki:3100/loki/api/v1/push"
    PROMETHEUS_ENABLED: bool = True

    # ── CORS ────────────────────────────────────────────────────────────────
    # В .env (CORS_ORIGINS) хранится строкой через запятую: "http://a,http://b".
    # NoDecode отключает попытку pydantic распарсить значение как JSON —
    # разбором занимается валидатор ниже.
    CORS_ORIGINS: Annotated[list[str], NoDecode] = ["http://localhost:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def _split_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @field_validator("LOG_LEVEL", mode="before")
    @classmethod
    def _normalize_log_level(cls, value: object) -> object:
        if isinstance(value, str):
            return value.upper()
        return value

    @property
    def DATABASE_URL(self) -> str:  # noqa: N802 — имя как у env-переменной
        """Async-DSN для SQLAlchemy, собранный из компонент POSTGRES_*."""
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


@lru_cache
def get_settings() -> Settings:
    """Синглтон настроек. `lru_cache` гарантирует единственный экземпляр."""
    return Settings()
