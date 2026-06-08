from app.core.config import Settings


def _settings(**kwargs):
    # _env_file=None — игнорируем .env, чтобы тест был детерминирован.
    return Settings(_env_file=None, **kwargs)


def test_database_url_assembled():
    s = _settings(
        POSTGRES_USER="u",
        POSTGRES_PASSWORD="p",
        POSTGRES_DB="d",
        POSTGRES_HOST="h",
        POSTGRES_PORT=5433,
    )
    assert s.DATABASE_URL == "postgresql+asyncpg://u:p@h:5433/d"


def test_cors_origins_split_from_string():
    s = _settings(CORS_ORIGINS="http://a:3000, http://b:5173")
    assert s.CORS_ORIGINS == ["http://a:3000", "http://b:5173"]


def test_log_level_uppercased():
    assert _settings(LOG_LEVEL="debug").LOG_LEVEL == "DEBUG"


def test_is_production():
    assert _settings(APP_ENV="production").is_production is True
    assert _settings(APP_ENV="development").is_production is False
