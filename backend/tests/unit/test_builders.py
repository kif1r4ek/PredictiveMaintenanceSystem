from datetime import datetime, timezone
from uuid import uuid4

from app.ml.inference import PredictionResult
from app.ml.preprocessing import engineer_features
from app.services.prediction.builders import build_db_record, build_history_record

RAW = {
    "rotational_speed": 1500,
    "torque": 40,
    "tool_wear": 10,
    "air_temperature": 300,
    "process_temperature": 310,
    "product_type": "L",
}
RESULT = PredictionResult(
    is_failure=True,
    failure_probability=0.9,
    failure_type="Power Failure",
    inference_time_ms=5.0,
)


def test_build_db_record_has_all_columns():
    rec = build_db_record(RAW, engineer_features(RAW), RESULT)
    # сырые + производные + результат
    assert rec["temp_diff"] == 10
    assert rec["power"] == 60000
    assert rec["tool_wear_torque"] == 400
    assert rec["is_failure"] is True
    assert rec["failure_type"] == "Power Failure"
    assert rec["product_type"] == "L"
    assert rec["inference_time_ms"] == 5.0


def test_build_history_record_serializable():
    pid = uuid4()
    ts = datetime.now(timezone.utc)
    rec = build_history_record(pid, ts, RAW, RESULT)
    assert rec["id"] == str(pid)
    assert rec["created_at"] == ts.isoformat()
    assert rec["is_failure"] is True
    assert rec["failure_type"] == "Power Failure"
    # производных признаков в истории нет — только вход + результат
    assert "temp_diff" not in rec
