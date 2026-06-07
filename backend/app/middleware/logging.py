"""Middleware логирования запросов.

На каждый запрос генерирует request_id (UUID) и кладёт его в contextvars
structlog — тогда он автоматически попадает во все логи в рамках запроса.
Логирует метод/путь/статус/время; шумные `/metrics` и `/health` пропускает.
"""

import time
import uuid

import structlog
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

log = structlog.get_logger()

# Пути, для которых не пишем строку доступа (постоянный шум от мониторинга).
_SKIP_PATHS = frozenset({"/metrics", "/health"})


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        structlog.contextvars.bind_contextvars(request_id=request_id)

        start = time.perf_counter()
        try:
            response = await call_next(request)
            duration_ms = (time.perf_counter() - start) * 1000.0
            if request.url.path not in _SKIP_PATHS:
                log.info(
                    "request",
                    method=request.method,
                    path=request.url.path,
                    status_code=response.status_code,
                    duration_ms=round(duration_ms, 2),
                )
            response.headers["X-Request-ID"] = request_id
            return response
        finally:
            structlog.contextvars.clear_contextvars()
