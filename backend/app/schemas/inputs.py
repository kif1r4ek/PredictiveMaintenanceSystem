"""Входные схемы: базовый MachineInput и запрос предсказания."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.schemas.validators import ensure_process_ge_air


class MachineInput(BaseModel):
    """6 сырых параметров станка. Диапазоны — из тренировочных данных (жёсткий reject)."""

    rotational_speed: float = Field(ge=1168, le=2886, description="Скорость вращения, об/мин")
    torque: float = Field(ge=3.8, le=76.6, description="Крутящий момент, Нм")
    tool_wear: float = Field(ge=0, le=253, description="Износ инструмента, мин")
    air_temperature: float = Field(ge=295, le=305, description="Температура воздуха, K")
    process_temperature: float = Field(ge=305, le=314, description="Температура процесса, K")
    product_type: Literal["L", "M", "H"] = Field(description="Категория продукта")

    @model_validator(mode="after")
    def _check_temperature_order(self) -> "MachineInput":
        ensure_process_ge_air(self.air_temperature, self.process_temperature)
        return self


class PredictionRequest(MachineInput):
    """Тело POST /predict. Наследует поля и валидацию MachineInput."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "rotational_speed": 1551,
                "torque": 42.8,
                "tool_wear": 108,
                "air_temperature": 298.1,
                "process_temperature": 308.6,
                "product_type": "M",
            }
        }
    )
