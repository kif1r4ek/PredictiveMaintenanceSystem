// Типы API — производные от сгенерированного из openapi.json schema.d.ts.
import type { components } from "./schema";

export type PredictionRequest = components["schemas"]["PredictionRequest"];
export type PredictionResponse = components["schemas"]["PredictionResponse"];
export type HistoryItem = components["schemas"]["HistoryItem"];
export type HealthResponse = components["schemas"]["HealthResponse"];
export type ProductType = PredictionRequest["product_type"];
