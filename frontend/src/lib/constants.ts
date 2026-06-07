import type { ProductType } from "../api/types";

export type View = "predict" | "history" | "models";

export interface Range {
  min: number;
  max: number;
  unit: string;
  normal: [number, number];
}

// Диапазоны датчиков (из тренировочных данных) + «нормальные» полосы для графика.
export const RANGES: Record<string, Range> = {
  rotational_speed: { min: 1168, max: 2886, unit: "об/мин", normal: [1300, 2100] },
  torque: { min: 3.8, max: 76.6, unit: "Н·м", normal: [25, 55] },
  tool_wear: { min: 0, max: 253, unit: "мин", normal: [0, 180] },
  air_temperature: { min: 295, max: 305, unit: "K", normal: [297, 302] },
  process_temperature: { min: 305, max: 314, unit: "K", normal: [307, 311] },
};

export const FIELD_ORDER = [
  "rotational_speed",
  "torque",
  "tool_wear",
  "air_temperature",
  "process_temperature",
] as const;

export const NUM_FIELDS: { key: string; label: string; icon: string; step: number }[] = [
  { key: "rotational_speed", label: "Скорость вращения", icon: "rotate-cw", step: 1 },
  { key: "torque", label: "Крутящий момент", icon: "wrench", step: 0.1 },
  { key: "tool_wear", label: "Износ инструмента", icon: "history", step: 1 },
  { key: "air_temperature", label: "Темп. воздуха", icon: "thermometer", step: 0.1 },
  { key: "process_temperature", label: "Темп. процесса", icon: "flame", step: 0.1 },
];

export const FEATURE_LABELS: Record<string, string> = {
  rotational_speed: "Скорость вращения",
  torque: "Крутящий момент",
  tool_wear: "Износ инструмента",
  air_temperature: "Темп. воздуха",
  process_temperature: "Темп. процесса",
};

export interface FormValues {
  rotational_speed: number | string;
  torque: number | string;
  tool_wear: number | string;
  air_temperature: number | string;
  process_temperature: number | string;
  product_type: ProductType;
}

export const DEFAULT_INPUT: FormValues = {
  rotational_speed: 1551,
  torque: 42.8,
  tool_wear: 108,
  air_temperature: 298.1,
  process_temperature: 308.6,
  product_type: "M",
};

export const EXAMPLE_INPUT: FormValues = {
  rotational_speed: 1372,
  torque: 68.1,
  tool_wear: 210,
  air_temperature: 302.9,
  process_temperature: 305.4,
  product_type: "L",
};

// Бэкенд отдаёт типы отказа по-английски — маппим на русские подписи.
export const FAILURE_TYPE_LABELS: Record<string, string> = {
  "Heat Dissipation Failure": "Отказ теплоотвода",
  "Power Failure": "Отказ по мощности",
  "Overstrain Failure": "Перегрузка",
  "Tool Wear Failure": "Износ инструмента",
  "Random Failures": "Случайный отказ",
};

export function failureLabel(t: string | null | undefined): string | null {
  if (!t) return null;
  return FAILURE_TYPE_LABELS[t] ?? t;
}
