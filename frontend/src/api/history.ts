import { apiClient } from "./client";
import type { HistoryItem } from "./types";

export type HistorySource = "redis" | "db";

export async function getHistory(
  params: { source?: HistorySource; limit?: number; offset?: number } = {}
): Promise<HistoryItem[]> {
  const { source = "redis", limit = 50, offset = 0 } = params;
  const { data } = await apiClient.get<HistoryItem[]>("/history", {
    params: { source, limit, offset },
  });
  return data;
}
