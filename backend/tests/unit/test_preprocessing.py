from app.ml.preprocessing import FEATURE_COLUMNS, engineer_features

RAW = {
    "rotational_speed": 1500,
    "torque": 40,
    "tool_wear": 10,
    "air_temperature": 300,
    "process_temperature": 310,
    "product_type": "M",
}


def test_columns_and_order():
    df = engineer_features(RAW)
    assert list(df.columns) == FEATURE_COLUMNS
    assert len(df) == 1


def test_derived_features():
    row = engineer_features(RAW).iloc[0]
    assert row["temp_diff"] == 10  # 310 - 300
    assert row["power"] == 1500 * 40
    assert row["tool_wear_torque"] == 10 * 40


def test_one_hot_M():
    row = engineer_features(RAW).iloc[0]
    assert row["Type_M"] == 1
    assert row["Type_L"] == 0


def test_one_hot_H_is_baseline():
    row = engineer_features({**RAW, "product_type": "H"}).iloc[0]
    assert row["Type_L"] == 0
    assert row["Type_M"] == 0
