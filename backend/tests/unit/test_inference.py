from app.ml.inference import ModelBundle, PredictionResult, predict
from app.ml.preprocessing import engineer_features

NORMAL = {
    "rotational_speed": 1551,
    "torque": 42.8,
    "tool_wear": 0,
    "air_temperature": 298.1,
    "process_temperature": 308.6,
    "product_type": "M",
}
FAILURE = {
    "rotational_speed": 2861,
    "torque": 4.6,
    "tool_wear": 143,
    "air_temperature": 298.9,
    "process_temperature": 309.1,
    "product_type": "L",
}


def test_bundle_loaded(model_bundle):
    assert isinstance(model_bundle, ModelBundle)
    assert 0 < model_bundle.threshold < 1
    assert len(model_bundle.binary_features) == 8
    assert len(model_bundle.label_encoder.classes_) == 4


def test_predict_normal(model_bundle):
    res = predict(model_bundle, engineer_features(NORMAL))
    assert isinstance(res, PredictionResult)
    assert res.is_failure is False
    assert res.failure_type is None
    assert 0.0 <= res.failure_probability <= 1.0
    assert res.inference_time_ms >= 0.0


def test_predict_failure(model_bundle):
    res = predict(model_bundle, engineer_features(FAILURE))
    assert res.is_failure is True
    assert res.failure_type is not None
