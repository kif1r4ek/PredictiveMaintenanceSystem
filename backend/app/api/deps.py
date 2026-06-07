"""Зависимости FastAPI, специфичные для API-слоя."""

from fastapi import Request

from app.core.exceptions import ModelsNotLoadedError
from app.ml.inference import ModelBundle


def get_model_bundle(request: Request) -> ModelBundle:
    """Вернуть загруженный в lifespan ML-bundle (хранится в app.state)."""
    bundle: ModelBundle | None = getattr(request.app.state, "model_bundle", None)
    if bundle is None:
        raise ModelsNotLoadedError("ML-модели не загружены — проверьте инициализацию в lifespan.")
    return bundle
