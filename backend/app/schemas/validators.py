"""Переиспользуемые проверки для схем (кросс-полевые и доменные)."""


def ensure_process_ge_air(air_temperature: float, process_temperature: float) -> None:
    """Температура процесса не может быть ниже температуры воздуха.

    Иначе производный признак temp_diff станет отрицательным — физически
    бессмысленно и вне распределения обучающих данных.
    """
    if process_temperature < air_temperature:
        raise ValueError(
            "process_temperature должна быть ≥ air_temperature "
            "(temp_diff не может быть отрицательным)"
        )
