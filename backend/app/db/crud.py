"""CRUD-операции над таблицей predictions."""

import uuid
from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Prediction


async def create_prediction(session: AsyncSession, data: dict) -> Prediction:
    """Записать предсказание в БД и вернуть сохранённую строку (с id, created_at)."""
    prediction = Prediction(**data)
    session.add(prediction)
    await session.commit()
    await session.refresh(prediction)
    return prediction


async def get_predictions(
    session: AsyncSession, limit: int = 50, offset: int = 0
) -> Sequence[Prediction]:
    """История предсказаний с пагинацией, новые сверху."""
    result = await session.execute(
        select(Prediction)
        .order_by(Prediction.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


async def get_prediction_by_id(
    session: AsyncSession, prediction_id: uuid.UUID
) -> Prediction | None:
    """Одно предсказание по id или None."""
    return await session.get(Prediction, prediction_id)
