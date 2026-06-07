"""Обработчики ошибок и единый формат ответа.

Формат: {"error": {"code": str, "message": str, "details": [...]?}}.
Детали внутренних сбоев (500/503) клиенту не отдаём — только в логи.
"""

import structlog
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import ModelsNotLoadedError

log = structlog.get_logger()

# Машино-читаемые коды для типовых HTTP-статусов.
_HTTP_CODES = {
    400: "bad_request",
    401: "unauthorized",
    403: "forbidden",
    404: "not_found",
    405: "method_not_allowed",
    409: "conflict",
    429: "too_many_requests",
}


def _error_response(
    status_code: int, code: str, message: str, details: list | None = None
) -> JSONResponse:
    payload: dict = {"error": {"code": code, "message": message}}
    if details is not None:
        payload["error"]["details"] = details
    return JSONResponse(status_code=status_code, content=payload)


async def _validation_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    details = [
        {
            # loc вида ("body", "torque") → "torque"; служебный "body" убираем.
            "field": ".".join(str(p) for p in err["loc"] if p != "body"),
            "message": err["msg"],
        }
        for err in exc.errors()
    ]
    return _error_response(422, "validation_error", "Ошибка валидации входных данных", details)


async def _http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    code = _HTTP_CODES.get(exc.status_code, "http_error")
    return _error_response(exc.status_code, code, str(exc.detail))


async def _models_not_loaded_handler(
    request: Request, exc: ModelsNotLoadedError
) -> JSONResponse:
    log.error("models_not_loaded", error=str(exc))
    return _error_response(503, "service_unavailable", "ML-модели недоступны, попробуйте позже")


async def _database_error_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    log.error("database_error", error=str(exc), exc_info=True)
    return _error_response(503, "service_unavailable", "База данных временно недоступна")


async def _unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    log.error("unhandled_exception", error=str(exc), exc_info=True)
    return _error_response(500, "internal_error", "Внутренняя ошибка сервера")


def register_exception_handlers(app: FastAPI) -> None:
    """Зарегистрировать все обработчики. Вызывается в main.py."""
    app.add_exception_handler(RequestValidationError, _validation_handler)
    app.add_exception_handler(ModelsNotLoadedError, _models_not_loaded_handler)
    app.add_exception_handler(SQLAlchemyError, _database_error_handler)
    app.add_exception_handler(StarletteHTTPException, _http_exception_handler)
    app.add_exception_handler(Exception, _unhandled_exception_handler)
