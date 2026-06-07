"""Доменные исключения приложения."""


class AppError(Exception):
    """Базовое исключение приложения."""


class ModelsNotLoadedError(AppError):
    """ML-модели не загружены в app.state (сбой загрузки на старте)."""
