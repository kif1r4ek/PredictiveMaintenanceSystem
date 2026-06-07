"""ORM-модели."""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Prediction(Base):
    """Одно предсказание: сырые входы + производные признаки + результат."""

    __tablename__ = "predictions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # ── Сырые входные признаки ──────────────────────────────────────────────
    rotational_speed: Mapped[float] = mapped_column(Float)
    torque: Mapped[float] = mapped_column(Float)
    tool_wear: Mapped[float] = mapped_column(Float)
    air_temperature: Mapped[float] = mapped_column(Float)
    process_temperature: Mapped[float] = mapped_column(Float)
    product_type: Mapped[str] = mapped_column(String(1))  # L | M | H

    # ── Производные признаки (для воспроизводимости при дообучении) ──────────
    temp_diff: Mapped[float] = mapped_column(Float)
    power: Mapped[float] = mapped_column(Float)
    tool_wear_torque: Mapped[float] = mapped_column(Float)

    # ── Результат ───────────────────────────────────────────────────────────
    is_failure: Mapped[bool] = mapped_column(Boolean)
    failure_probability: Mapped[float] = mapped_column(Float)
    failure_type: Mapped[str | None] = mapped_column(String(64), nullable=True)

    # ── Мета ────────────────────────────────────────────────────────────────
    inference_time_ms: Mapped[float] = mapped_column(Float)
