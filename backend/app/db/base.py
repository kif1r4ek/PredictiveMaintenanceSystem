"""Базовый класс для всех ORM-моделей."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Общий DeclarativeBase. От него наследуются все таблицы (см. models.py)."""
