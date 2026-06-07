import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Фронт обращается к бэкенду напрямую по VITE_API_URL (CORS на бэкенде разрешает
// http://localhost:3000). Поэтому dev-сервер держим строго на порту 3000.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    // Проект на /mnt/d (Windows FS через WSL2) — inotify не срабатывает,
    // поэтому HMR не видит изменения. Включаем polling watcher.
    watch: { usePolling: true, interval: 300 },
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
});
