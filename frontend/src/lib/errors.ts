// Нормализация ошибок бэкенда (конверт { error: { code, message, details } })
// и сетевых сбоев в единый вид для UI.

export interface ApiError {
  code: string;
  message: string;
  fieldErrors: Record<string, string>;
}

export function parseApiError(err: unknown): ApiError {
  const anyErr = err as {
    code?: string;
    response?: { data?: { error?: { code?: string; message?: string; details?: { field: string; message: string }[] } } };
  };

  const envelope = anyErr?.response?.data?.error;
  if (envelope) {
    const fieldErrors: Record<string, string> = {};
    (envelope.details ?? []).forEach((d) => {
      if (d.field) fieldErrors[d.field] = d.message;
    });
    return {
      code: envelope.code ?? "internal_error",
      message: envelope.message ?? "Ошибка",
      fieldErrors,
    };
  }

  if (anyErr?.code === "ERR_NETWORK") {
    return { code: "network_error", message: "Нет связи с сервером", fieldErrors: {} };
  }
  return { code: "internal_error", message: "Непредвиденная ошибка", fieldErrors: {} };
}
