import axios from "axios";

// Бэкенд напрямую (CORS разрешает http://localhost:3000). Переопределяется
// переменной окружения VITE_API_URL на сборке.
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
