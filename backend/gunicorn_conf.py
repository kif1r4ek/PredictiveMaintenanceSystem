"""Конфиг gunicorn.

Хук child_exit нужен для корректной агрегации Prometheus-метрик в
multiprocess-режиме: при завершении воркера помечаем его процесс «мёртвым»,
чтобы его mmap-файлы в PROMETHEUS_MULTIPROC_DIR учитывались правильно.
"""

from prometheus_client import multiprocess


def child_exit(server, worker):  # noqa: ANN001, ARG001 — сигнатура хука gunicorn
    multiprocess.mark_process_dead(worker.pid)
