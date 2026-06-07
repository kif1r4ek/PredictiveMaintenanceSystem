"""Сборка всех роутеров в единый api_router (подключается в main.py)."""

from fastapi import APIRouter

from app.api.routes import health, history, predict

api_router = APIRouter()
api_router.include_router(predict.router)
api_router.include_router(history.router)
api_router.include_router(health.router)
