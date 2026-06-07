#!/bin/sh
# Точка входа контейнера: сначала миграции (один раз, до форка воркеров),
# затем основная команда (gunicorn) через exec.
set -e

echo "[entrypoint] applying database migrations..."
alembic upgrade head

echo "[entrypoint] starting application..."
exec "$@"
