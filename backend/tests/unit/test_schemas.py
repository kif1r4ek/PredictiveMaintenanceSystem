import pytest
from pydantic import ValidationError

from app.schemas import PredictionRequest

VALID = {
    "rotational_speed": 1551,
    "torque": 42.8,
    "tool_wear": 108,
    "air_temperature": 298.1,
    "process_temperature": 308.6,
    "product_type": "M",
}


def test_valid_request():
    m = PredictionRequest(**VALID)
    assert m.product_type == "M"
    assert m.torque == 42.8


def test_out_of_range_rejected():
    with pytest.raises(ValidationError):
        PredictionRequest(**{**VALID, "torque": 999})


def test_below_min_rejected():
    with pytest.raises(ValidationError):
        PredictionRequest(**{**VALID, "rotational_speed": 100})


def test_bad_product_type_rejected():
    with pytest.raises(ValidationError):
        PredictionRequest(**{**VALID, "product_type": "X"})


def test_non_numeric_rejected():
    with pytest.raises(ValidationError):
        PredictionRequest(**{**VALID, "rotational_speed": "abc"})
