from fastapi import FastAPI

app = FastAPI(
    title="Predictive Maintenance API",
    description="ML-система предсказания отказов промышленного оборудования",
    version="0.1.0",
)


@app.get("/")
async def hello_world():
    return {"message": "Hello from Predictive Maintenance API"}


# ──────────────────────────────────────────────────────────────────────────────
# Запуск локально (без Docker):
#
#   1. Активировать окружение:
#      source .venv/bin/activate
#
#   2. Перейти в папку backend:
#      cd backend
#
#   3. Запустить сервер:
#      uvicorn main:app --reload --host 0.0.0.0 --port 8000
#
#   Swagger UI:  http://localhost:8000/docs
#   ReDoc:       http://localhost:8000/redoc
#   OpenAPI JSON: http://localhost:8000/openapi.json
# ──────────────────────────────────────────────────────────────────────────────
