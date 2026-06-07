"""Feature engineering — те же преобразования, что в обучающих ноутбуках.

Из 6 сырых входов получаем 8 признаков в том же порядке и с теми же именами
колонок, что видели модели при обучении (см. bundle['features']).
"""

import pandas as pd

# Имена и порядок признаков строго как при обучении. Имена сырых датчиков —
# с единицами измерения, иначе sklearn ругнётся на несовпадение feature names.
FEATURE_COLUMNS = [
    "Rotational speed [rpm]",
    "Torque [Nm]",
    "Tool wear [min]",
    "temp_diff",
    "power",
    "tool_wear_torque",
    "Type_L",
    "Type_M",
]


def engineer_features(raw: dict) -> pd.DataFrame:
    """Собрать DataFrame из 8 признаков (одна строка) для подачи в модели.

    Производные признаки (`temp_diff`, `power`, `tool_wear_torque`) при
    необходимости читаются вызывающим кодом прямо из результата —
    это единственный источник их вычисления.
    """
    rotational_speed = raw["rotational_speed"]
    torque = raw["torque"]
    tool_wear = raw["tool_wear"]
    air_temperature = raw["air_temperature"]
    process_temperature = raw["process_temperature"]
    product_type = raw["product_type"]

    features = {
        "Rotational speed [rpm]": rotational_speed,
        "Torque [Nm]": torque,
        "Tool wear [min]": tool_wear,
        "temp_diff": process_temperature - air_temperature,
        "power": rotational_speed * torque,
        "tool_wear_torque": tool_wear * torque,
        # One-Hot по типу продукта; Type_H — базовая категория (обе = 0).
        "Type_L": 1 if product_type == "L" else 0,
        "Type_M": 1 if product_type == "M" else 0,
    }
    return pd.DataFrame([features], columns=FEATURE_COLUMNS)
