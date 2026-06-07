#!/bin/sh
# Точка входа контейнера: сначала миграции (один раз, до форка воркеров),
# затем основная команда (gunicorn) через exec.
set -e

# Каталог для multiprocess-метрик Prometheus: чистим от прошлого запуска.
if [ -n "$PROMETHEUS_MULTIPROC_DIR" ]; then
  rm -rf "$PROMETHEUS_MULTIPROC_DIR"
  mkdir -p "$PROMETHEUS_MULTIPROC_DIR"
fi

echo "[entrypoint] applying database migrations..."
alembic upgrade head

echo "[entrypoint] starting application..."
exec "$@"
