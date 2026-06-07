"""Настройка логирования на structlog.

dev  → цветной человекочитаемый вывод в консоль;
prod → JSON (одна строка на событие) для Promtail → Loki.

Логи stdlib (uvicorn, gunicorn, sqlalchemy, alembic) пропускаются через тот же
рендерер, поэтому формат вывода всего сервиса единый.
"""

import logging
import sys

import structlog

# Логгеры сторонних библиотек, которые направляем в общий обработчик root.
_FOREIGN_LOGGERS = (
    "uvicorn",
    "uvicorn.error",
    "uvicorn.access",
    "gunicorn",
    "gunicorn.error",
    "gunicorn.access",
    "sqlalchemy.engine",
    "alembic",
)


def setup_logging(level: str = "INFO", json_logs: bool = False) -> None:
    """Сконфигурировать structlog + stdlib logging. Вызывается один раз при старте."""

    # Процессоры, общие для «родных» structlog-логов и «чужих» stdlib-логов.
    shared_processors = [
        structlog.contextvars.merge_contextvars,  # подмешать bound-контекст (request_id и пр.)
        structlog.stdlib.add_log_level,           # event_dict["level"]
        structlog.stdlib.add_logger_name,         # event_dict["logger"]
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),  # для stack_info=True
    ]

    # structlog: прогоняем shared-процессоры и передаём событие в stdlib-форматтер.
    structlog.configure(
        processors=[
            *shared_processors,
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # Финальный рендерер: JSON для prod, цветная консоль для dev.
    renderer = (
        structlog.processors.JSONRenderer()
        if json_logs
        else structlog.dev.ConsoleRenderer(colors=True)
    )

    formatter = structlog.stdlib.ProcessorFormatter(
        # foreign_pre_chain — для записей из stdlib logging (uvicorn и пр.),
        # которые не проходили через structlog-процессоры.
        foreign_pre_chain=shared_processors,
        processors=[
            structlog.stdlib.ProcessorFormatter.remove_processors_meta,
            structlog.processors.format_exc_info,  # развернуть traceback в текст
            renderer,
        ],
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(level.upper())

    # Чужие логгеры лишаем собственных хендлеров и направляем в root —
    # чтобы их вывод шёл в том же формате.
    for name in _FOREIGN_LOGGERS:
        lg = logging.getLogger(name)
        lg.handlers.clear()
        lg.propagate = True
