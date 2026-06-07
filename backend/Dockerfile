# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM python:3.13-slim AS builder

WORKDIR /build

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM python:3.13-slim AS runtime

WORKDIR /app

COPY --from=builder /install /usr/local

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 8000

# entrypoint прогоняет миграции, затем exec "$@" (CMD ниже)
ENTRYPOINT ["./entrypoint.sh"]
CMD ["gunicorn", "main:app", "-c", "gunicorn_conf.py", "-k", "uvicorn.workers.UvicornWorker", \
     "-w", "4", "-b", "0.0.0.0:8000", "--access-logfile", "-"]
