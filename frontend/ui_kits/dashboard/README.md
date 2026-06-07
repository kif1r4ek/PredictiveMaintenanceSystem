# Dashboard UI kit — Operator Dashboard

A high-fidelity, interactive recreation of the **Predictive Maintenance operator
dashboard**, built directly against the backend contract in `openapi.json`. It is
the visual source of truth for the production frontend (React + TS + Vite +
Tailwind + shadcn/ui + recharts).

> **This is a design prototype, not the production app.** It uses inline Babel/JSX
> and a `mockApi` instead of a real Vite build + axios. Predictions come from a
> small physics-informed stub, not the ML model. Charts are hand-built SVG, not
> recharts. Translate components 1:1 when wiring the real API.

## Run
Open `index.html` — no build step. Toggle light/dark from the header. The
**Demo states** strip at the bottom forces the `503` / `500` / `degraded` paths
the brief requires.

## Files
| File | Role |
|---|---|
| `index.html` | Loads fonts, tokens, React/Babel, all components in order. |
| `tokens.css` | Copy of the root design tokens. |
| `kit.css` | Component styling + light/dark theme. |
| `Icon.jsx` | Lucide icon set (path data, offline). |
| `mockApi.jsx` | Stand-in for `/predict`, `/history`, `/health`; exact schemas + error envelope. |
| `InputForm.jsx` | 6-field `PredictionRequest` form with range hints + per-field 422 errors. |
| `ResultCard.jsx` | Verdict (Норма / Отказ), failure type, probability, inference time + empty/loading/error states. |
| `ProbabilityGauge.jsx` | Semicircular failure-probability gauge (→ recharts RadialBar). |
| `FeatureBarChart.jsx` | Submitted features vs. normal sensor ranges (→ recharts BarChart). |
| `HistoryTable.jsx` | Last predictions, `source=redis|db` toggle. |
| `Header.jsx` | Brand, health badge with dependency popover, theme toggle. |
| `app.jsx` | Composition + per-request loading/error state. |

## Mapping to the production brief
- `InputForm` ↔ `api/predict.ts` → `POST /predict`
- `HistoryTable` ↔ `api/history.ts` → `GET /history?source=redis`
- `HealthBadge` (in `Header.jsx`) ↔ `api/health.ts` → `GET /health`
- Error envelope handled in `app.jsx → parseErr`: `validation_error` (422) maps to
  per-field highlights; `service_unavailable` (503) and `internal_error` (500)
  surface as banners / placeholder states.
- Run the real app on **port 3000** (backend CORS allows only `http://localhost:3000`).
