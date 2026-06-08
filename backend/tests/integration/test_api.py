"""Интеграционные тесты API (нужны Postgres + Redis). Маркер: integration."""

import pytest

pytestmark = pytest.mark.integration

VALID = {
    "rotational_speed": 1551,
    "torque": 42.8,
    "tool_wear": 108,
    "air_temperature": 298.1,
    "process_temperature": 308.6,
    "product_type": "M",
}


async def test_health_ok(client):
    r = await client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["models"] is True
    assert body["database"] is True
    assert body["redis"] is True


async def test_predict_returns_response(client):
    r = await client.post("/predict", json=VALID)
    assert r.status_code == 200
    body = r.json()
    assert set(body) >= {
        "id",
        "is_failure",
        "failure_probability",
        "failure_type",
        "inference_time_ms",
        "created_at",
    }
    assert isinstance(body["is_failure"], bool)
    assert 0.0 <= body["failure_probability"] <= 1.0


async def test_predict_persists_to_db_and_redis(client):
    created = (await client.post("/predict", json=VALID)).json()

    db = await client.get("/history", params={"source": "db", "limit": 10})
    assert db.status_code == 200
    assert any(item["id"] == created["id"] for item in db.json())

    redis = await client.get("/history", params={"source": "redis"})
    assert redis.status_code == 200
    assert len(redis.json()) >= 1


async def test_predict_validation_envelope(client):
    r = await client.post("/predict", json={**VALID, "torque": 999})
    assert r.status_code == 422
    err = r.json()["error"]
    assert err["code"] == "validation_error"
    assert any(d["field"] == "torque" for d in err["details"])
