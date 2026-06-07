import { apiClient } from "./client";
import type { PredictionRequest, PredictionResponse } from "./types";

export async function predict(body: PredictionRequest): Promise<PredictionResponse> {
  const { data } = await apiClient.post<PredictionResponse>("/predict", body);
  return data;
}
