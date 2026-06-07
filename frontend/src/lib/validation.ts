import { RANGES, FIELD_ORDER, type FormValues } from "./constants";

// Клиентская валидация (на русском) — повторяет границы бэкенда, но даёт
// понятные сообщения и отличает «не число» от «вне диапазона».
export function validateInput(values: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of FIELD_ORDER) {
    const raw = values[f as keyof FormValues];
    const v = Number(raw);
    const r = RANGES[f];
    if (raw === "" || raw === null || raw === undefined || Number.isNaN(v)) {
      errors[f] = "Введите число";
    } else if (v < r.min || v > r.max) {
      errors[f] = `Допустимо от ${r.min} до ${r.max} ${r.unit}`;
    }
  }
  return errors;
}
