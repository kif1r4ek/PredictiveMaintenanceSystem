# Predictive Maintenance System

Система предиктивного обслуживания промышленного оборудования: по показаниям датчиков
станка предсказывает, произойдёт ли отказ, и если да — определяет его тип. Полноценный
ML-сервис с обученными моделями, REST API на FastAPI, React-фронтендом, хранением истории
в PostgreSQL + Redis и стеком мониторинга (Prometheus + Grafana + Loki).

---

## Содержание

- [Что это за проект](#что-это-за-проект)
- [Машинное обучение](#машинное-обучение)
- [Архитектура](#архитектура)
- [Технологический стек](#технологический-стек)
- [Структура репозитория](#структура-репозитория)
- [Быстрый запуск (Docker)](#быстрый-запуск-docker)
- [Локальный запуск без Docker](#локальный-запуск-без-docker)
- [API](#api)
- [Конфигурация (.env)](#конфигурация-env)
- [Тесты и CI](#тесты-и-ci)
- [Мониторинг](#мониторинг)

---

## Что это за проект

Отказ промышленного станка стоит дорого: простой линии, брак, аварийный ремонт. Задача
системы — заранее предупредить оператора. На вход подаются 6 параметров станка, на выходе —
вердикт **«Норма»** или **«Отказ»** с указанием **типа отказа** и **вероятности**.

Основан на датасете **AI4I 2020 Predictive Maintenance** (`dataset/predictive_maintenance_clean.csv`):
9 973 строки, сильный дисбаланс классов — 96.7 % норма / 3.3 % отказы (330 отказов).

### Типы отказов

| Тип | Кол-во в датасете |
|-----|-------------------|
| Heat Dissipation Failure (перегрев) | 112 |
| Power Failure (отказ по мощности) | 95 |
| Overstrain Failure (перегрузка) | 78 |
| Tool Wear Failure (износ инструмента) | 45 |

---

## Машинное обучение

Используется **каскад из двух моделей**. Сначала бинарная модель решает, есть ли отказ
вообще; только при положительном вердикте включается мультиклассовая, определяющая тип.

```
Входные данные (8 признаков)
        │
        ▼
binary_model.pkl ── predict_proba()[:, 1]
        │
   proba ≥ 0.451 ?
   ┌────┴─────┐
  Нет         Да
   │           │
"Норма"   multiclass_model.pkl ── predict() ── inverse_transform()
                          │
                     Тип отказа
```

### Feature Engineering

Из 6 сырых входов получаются **8 признаков** (одинаково в ноутбуках обучения и в API —
см. [preprocessing.py](backend/app/ml/preprocessing.py)):

| Признак | Формула | Смысл |
|---------|---------|-------|
| `temp_diff` | Process temp − Air temp | Тепловой баланс станка |
| `power` | Rotational speed × Torque | Реальная механическая нагрузка |
| `tool_wear_torque` | Tool wear × Torque | Накопленная усталость под нагрузкой |

Плюс сырые `Rotational speed`, `Torque`, `Tool wear` и One-Hot по типу продукта
(`Type_L`, `Type_M`; `Type_H` — базовая категория).

### Модель 1 — бинарная классификация

`models/binary_model.pkl` · обучение в [model_training_pipeline.ipynb](model_training_pipeline.ipynb)

- **Pipeline:** `StandardScaler → Borderline-SMOTE 2 → SVM (RBF, C=100, γ=0.1, class_weight='balanced')`
- Borderline-SMOTE генерирует синтетику в зоне смешения классов; применяется только при `fit`.
- Подбор гиперпараметров через **GridSearchCV с F2-scorer** (Recall важнее Precision —
  пропустить отказ дороже ложной тревоги).
- **Порог 0.451** вместо 0.5 — найден по Precision-Recall кривой при условии Recall ≥ 0.85.

**Метрики на test:** Recall 0.82 · Precision 0.60 · F1 0.69 · ROC-AUC 0.978

### Модель 2 — мультиклассовая классификация

`models/multiclass_model.pkl` · обучение в [multiclass_pipeline.ipynb](multiclass_pipeline.ipynb)

- **Pipeline:** `StandardScaler → RandomForest (n_estimators=300, class_weight='balanced')`
- Обучена только на строках с отказом (работает после бинарной в каскаде).
- Метрика подбора — **F1 macro** (все 4 типа отказа равнозначны).

**Метрики на test:** F1 macro **0.971** (Heat/Power — 1.00, Overstrain — 0.96, Tool Wear — 0.92)

> Аналитика и эксперименты: [exploratory_data_analysis.ipynb](exploratory_data_analysis.ipynb),
> [predictive_maintenance_full_pipeline.ipynb](predictive_maintenance_full_pipeline.ipynb),
> обзор предметной области — [industry_overview.md](industry_overview.md).

---

## Архитектура

```
┌──────────┐      ┌─────────────────────────────┐      ┌────────────┐
│ Frontend │──────│  Backend (FastAPI/gunicorn) │──────│ PostgreSQL │
│  React   │ HTTP │  • каскад ML-моделей        │      │  история   │
│  :3000   │      │  • валидация входов         │      └────────────┘
└──────────┘      │  • /predict /history /health │      ┌────────────┐
                  │  :8000                       │──────│   Redis    │
                  └──────────────┬──────────────┘      │ кеш истории│
                                 │ /metrics, логи       └────────────┘
                  ┌──────────────┴──────────────────────────────┐
                  │  Prometheus · Loki · Promtail · Grafana       │
                  └───────────────────────────────────────────────┘
```

**Backend** (`backend/app`) построен слоями:

- `api/routes` — HTTP-контроллеры (тонкая обвязка), `api/deps.py` — зависимости (модели и т.п.).
- `services` — бизнес-логика (`prediction`, `history`, `health`).
- `ml` — загрузка моделей в память при старте (`inference.py`) и feature engineering (`preprocessing.py`).
- `schemas` — Pydantic-схемы запросов/ответов с жёсткой валидацией диапазонов датчиков.
- `db` — SQLAlchemy (async) + CRUD + Redis-кеш; миграции в `alembic`.
- `core` — конфиг (pydantic-settings), structlog-логирование, обработчики ошибок, Redis-клиент.
- `middleware` — структурное логирование запросов и Prometheus-метрики.

Каждое предсказание сохраняется в PostgreSQL (сырые входы + производные признаки + результат,
см. [models.py](backend/app/db/models.py)) и кешируется в Redis для быстрой выдачи истории.

---

## Технологический стек

| Слой | Технологии |
|------|-----------|
| ML | scikit-learn 1.8, imbalanced-learn, pandas, numpy, joblib |
| Backend | Python 3.13, FastAPI, Pydantic v2, SQLAlchemy 2 (async), Alembic, gunicorn + uvicorn |
| Хранилища | PostgreSQL 17, Redis 7 |
| Frontend | React 18, TypeScript, Vite, Recharts, axios |
| Мониторинг | Prometheus, Grafana, Loki, Promtail, structlog |
| Инфраструктура | Docker, docker-compose, GitHub Actions (CI) |

---

## Структура репозитория

```
PredictiveMaintenanceSystem/
├── backend/                # FastAPI-приложение
│   ├── app/
│   │   ├── api/            # роуты + зависимости
│   │   ├── services/       # бизнес-логика (prediction, history, health)
│   │   ├── ml/             # inference + feature engineering
│   │   ├── schemas/        # Pydantic-схемы и валидаторы
│   │   ├── db/             # ORM, CRUD, сессии, Redis-кеш
│   │   ├── core/           # конфиг, логирование, ошибки
│   │   └── middleware/     # логирование запросов, метрики
│   ├── alembic/            # миграции БД
│   ├── tests/              # unit + integration (pytest)
│   ├── Dockerfile · entrypoint.sh · gunicorn_conf.py
│   └── requirements.txt
├── frontend/               # React + Vite SPA
│   └── src/                # api/, components/, lib/, styles/
├── models/                 # обученные .pkl (binary + multiclass)
├── dataset/                # CSV-датасеты (raw + clean)
├── monitoring/             # конфиги Prometheus / Grafana / Loki / Promtail
├── *.ipynb                 # ноутбуки EDA и обучения моделей
├── docker-compose.yml      # вся система одной командой
├── .env.example            # шаблон переменных окружения
└── PROJECT_SUMMARY.md      # подробные итоги по ML
```

---

## Быстрый запуск (Docker)

Требуется Docker + docker-compose. Поднимает всю систему: БД, кеш, бэкенд, фронт и мониторинг.

```bash
# 1. Скопировать шаблон окружения и при желании поправить пароли
cp .env.example .env

# 2. Собрать и запустить все сервисы
docker compose up --build
```

Миграции БД (`alembic upgrade head`) применяются автоматически в `entrypoint.sh` до старта
воркеров. После запуска доступны:

| Сервис | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger UI (документация) | http://localhost:8000/docs |
| Prometheus | http://localhost:9090 |
| Grafana (admin / admin) | http://localhost:3001 |
| Loki | http://localhost:3100 |
| PostgreSQL | localhost:**5433** (внутри сети — 5432) |
| Redis | localhost:6379 |

> Порт Postgres на хосте — **5433**, чтобы не конфликтовать с локально установленным
> Postgres на 5432. Внутри docker-сети контейнер по-прежнему слушает 5432.

Остановить: `docker compose down` (с томами — `docker compose down -v`).

---

## Локальный запуск без Docker

Нужны Python 3.13, Node 20, запущенные локально PostgreSQL и Redis.

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# .env в корне; для локали выставьте POSTGRES_HOST=localhost и REDIS_URL=redis://localhost:6379/0
alembic upgrade head                         # применить миграции
uvicorn main:app --reload --port 8000        # dev-сервер
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_URL=http://localhost:8000
npm run dev                   # http://localhost:3000
```

Прод-сборка фронта: `npm run build` (TypeScript-проверка + бандл в `dist/`).

---

## API

Базовый URL: `http://localhost:8000`. Интерактивная документация — `/docs`.

### `POST /predict` — предсказание

**Тело запроса** (6 параметров; диапазоны валидируются жёстко по тренировочным данным):

```json
{
  "rotational_speed": 1551,      // об/мин, 1168–2886
  "torque": 42.8,                // Нм, 3.8–76.6
  "tool_wear": 108,              // мин, 0–253
  "air_temperature": 298.1,      // K, 295–305
  "process_temperature": 308.6,  // K, 305–314  (должна быть ≥ air_temperature)
  "product_type": "M"            // L | M | H
}
```

**Ответ:**

```json
{
  "id": "0c1f…",
  "is_failure": false,
  "failure_probability": 0.12,
  "failure_type": null,          // строка-тип при is_failure=true
  "inference_time_ms": 4.3,
  "created_at": "2026-06-08T12:00:00Z"
}
```

При не загруженных моделях `/predict` отвечает **503**.

### `GET /history` — история предсказаний

Параметры: `source` (`redis` | `postgres`, по умолч. `redis`), `limit` (1–500, по умолч. 50),
`offset` (≥0). Возвращает список последних предсказаний.

### `GET /health` — состояние сервиса

Проверяет загрузку моделей, доступность PostgreSQL и Redis. Возвращает статус
`ok` / `degraded`.

### `GET /metrics` — метрики Prometheus

Агрегированные по всем воркерам gunicorn (multiprocess mode).

---

## Конфигурация (.env)

Полный список — в [.env.example](.env.example). Ключевые переменные:

| Переменная | Назначение |
|-----------|-----------|
| `APP_ENV` | `development` \| `production` (в prod — JSON-логи) |
| `BINARY_MODEL_PATH` / `MULTICLASS_MODEL_PATH` | пути к `.pkl`-моделям |
| `POSTGRES_*` | подключение к БД (`DATABASE_URL` собирается в `config.py`) |
| `REDIS_URL`, `REDIS_HISTORY_*` | кеш и параметры истории (лимит, TTL) |
| `LOG_LEVEL` | `DEBUG` … `CRITICAL` |
| `CORS_ORIGINS` | разрешённые источники фронтенда |
| `PROMETHEUS_ENABLED`, `LOKI_URL` | мониторинг |

---

## Тесты и CI

Тесты бэкенда — pytest (unit + integration):

```bash
cd backend
pytest -v
```

- `tests/unit` — конфиг, схемы, препроцессинг, инференс, билдеры.
- `tests/integration` — эндпоинты API.

**CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)) на каждый push в `main` и PR:

- **Backend** — поднимает Postgres + Redis как сервисы, прогоняет `pytest`.
- **Frontend** — `npm ci` + `npm run build` (typecheck + сборка).

---

## Мониторинг

Стек наблюдаемости разворачивается вместе со всем остальным в `docker compose`:

- **Prometheus** — собирает метрики с `/metrics` (multiprocess-агрегация по воркерам).
- **Grafana** — дашборды (`monitoring/grafana/dashboards/pm-overview.json`), datasources и
  дашборды провижинятся автоматически. Вход: `admin` / `admin`.
- **Loki + Promtail** — централизованный сбор логов контейнеров; бэкенд пишет структурные
  логи через structlog.
