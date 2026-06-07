# Predictive Maintenance — Design System

A design system for **PredictiveMaintenanceSystem**, an ML platform that predicts
failures of industrial equipment from live sensor telemetry. An operator (or an
automated pipeline) submits a machine's current readings — air & process
temperature, rotational speed, torque, tool wear, and the product quality tier —
and the system returns two predictions:

1. **Binary** — will this machine fail? (failure / no failure)
2. **Multiclass** — *which* failure mode? (Heat Dissipation, Power, Overstrain,
   Tool Wear, Random, or No Failure)

The platform is built for plant-floor reliability engineers and maintenance
planners: people who live in control rooms and need to read equipment state at a
glance, trust a number, and act before a machine goes down.

---

## Product & technical context

| Layer | Technology |
|---|---|
| Frontend | React + Vite, served as static files (`serve`) on :3000 |
| API | FastAPI (`Predictive Maintenance API`) on :8000, Swagger/ReDoc docs |
| Models | Two scikit-learn / imbalanced-learn pipelines: `binary_model.pkl`, `multiclass_model.pkl` |
| Data store | PostgreSQL (predictions log) + Redis (recent-inputs history, last 100) |
| Observability | Prometheus + Grafana (metrics), Loki + Promtail (logs), structlog |

**Domain dataset.** The models train on the Kaggle *Machine Predictive
Maintenance Classification* dataset (`shivamb/machine-predictive-maintenance-classification`).
Its feature schema drives every input form and readout in the product:

| Field | Unit / values | Role |
|---|---|---|
| Type | `L` / `M` / `H` (low / medium / high quality variant) | categorical input |
| Air temperature | Kelvin (~295–305 K) | sensor input |
| Process temperature | Kelvin (~305–315 K) | sensor input |
| Rotational speed | rpm (~1150–2900) | sensor input |
| Torque | Nm (~3–80) | sensor input |
| Tool wear | minutes (0–260) | sensor input |
| Target | 0 / 1 | binary prediction |
| Failure Type | No Failure · Heat Dissipation · Power · Overstrain · Tool Wear · Random | multiclass prediction |

> **Language note.** The codebase is authored in Russian (API description, code
> comments, env docs). This design system is documented in English for
> portability; the UI kit ships English labels but the product is intended to be
> localizable (RU primary). Flag if you need RU-first specimens.

---

## Sources

This system was reverse-engineered from one repository. There is **no committed
frontend source, no logo, and no prior design system** — only a backend, ML
notebooks, and a frontend Dockerfile (Vite build → static serve). The visual
direction here is therefore **newly designed** for the product domain, not lifted
from existing UI. Explore the repo to design more accurately:

- **GitHub:** https://github.com/kif1r4ek/PredictiveMaintenanceSystem
  - `backend/main.py` — FastAPI app & product description
  - `.env.example`, `docker-compose.yml` — full service topology
  - `*.ipynb` — EDA, model training & multiclass pipeline (feature engineering, thresholds)
  - `load_dataset.py` — Kaggle dataset source

---

## Design direction — "Industrial Telemetry"

The product is an instrument. The interface should feel like a precise,
trustworthy control panel — not a consumer SaaS dashboard.

- **Engineered type.** IBM Plex Sans for UI, IBM Plex Mono for every number a
  human reads as data (sensor values, predictions, IDs). Mono signals "this is a
  measured quantity," which is the whole product.
- **Status-first color.** A calm graphite/slate canvas so the only saturated
  color on screen is *meaning*: signal-blue for action, and a green / amber / red
  scale for equipment health. If something is red, it is the loudest thing on the
  page — by design.
- **Hairline precision.** Thin borders and restrained shadows over soft, floaty
  cards. Tight 4px spacing grid, small (4–6px) radii.
- **Quiet motion.** Quick fades and state changes, no bounce — an alarm should
  never feel playful.

---

## Index — what's in this system

| File / folder | What it is |
|---|---|
| `colors_and_type.css` | All design tokens — color, type scale, spacing, radii, shadow, motion. Import this first. |
| `styles.css` | Single entry point — `@import`s the tokens + Google Fonts. Consumers link this. |
| `openapi.json` | The live backend contract the dashboard UI kit is built against. |
| `README.md` | This file — product context, content & visual foundations, iconography. |
| `SKILL.md` | Agent Skills manifest for using this system in Claude Code. |
| `assets/` | Brand mark (logo), favicon. |
| `preview/` | Design-system cards rendered in the Design System tab (colors, type, components, etc.). |
| `ui_kits/dashboard/` | The operator web-app UI kit — interactive, high-fidelity React recreation. |

Content & visual foundations are documented in the sections below.

<!-- CONTENT_FUNDAMENTALS -->
## Content fundamentals

The product talks like an **instrument readout**, not a marketing site. Copy is
terse, technical, and bilingual-aware (the source product is Russian-first).

- **Verdicts are single words, in Russian:** `Норма` (nominal) / `Отказ`
  (failure). These are the loudest words in the UI — never soften them into
  sentences.
- **Field & action labels are English, sentence-equivalent and short:**
  "Rotational speed", "Tool wear", "Predict failure", "Recent predictions",
  "Load example". No marketing verbs.
- **Units always accompany numbers, in mono:** `1372 rpm`, `42.8 Nm`, `210 min`,
  `298.1 K`, `12.8 ms`. Never print a bare sensor number.
- **API truth is surfaced, not hidden.** Cards show their endpoint as a subtitle
  (`POST /predict · PredictionRequest`, `GET /history?source=redis`). The product
  is for engineers; exposing the contract builds trust.
- **Errors are plain and actionable.** Validation: "Must be between 305 and 314 K".
  Outage: "Сервис временно недоступен." No apologies, no exclamation marks, no
  personality. State what's wrong and the bound that was violated.
- **Voice:** third-person and impersonal about the machine ("Failure predicted —
  schedule maintenance"). Never "you", never "we". The system reports; it does
  not converse.
- **Casing:** Sentence case for labels and buttons. `UPPERCASE` + 0.08em tracking
  reserved exclusively for micro section-labels (FAILURE PROBABILITY, INFERENCE
  TIME). No Title Case.
- **No emoji, ever.** Status is carried by color + a dot/icon, not 🔴.
- **Numbers are facts.** Probabilities as whole-percent (`91%`), timings to one
  decimal (`12.8 ms`), IDs truncated to 8 chars (`#0d29b264`).

<!-- VISUAL_FOUNDATIONS -->
## Visual foundations

The aesthetic is **"Industrial Telemetry"** — a precise instrument panel.

- **Backgrounds:** flat, cool, near-white (`--canvas #F4F6F8`) in light; true
  control-room near-black (`#0B0E13`) in dark. **No gradients**, no imagery, no
  texture, no patterns. The canvas is deliberately quiet so saturated color only
  ever means *status*.
- **Color vibe:** cool graphite/slate neutrals; one signal-blue for action; a
  green→amber→red ramp for equipment health. Saturated color is rationed — if
  something is red it is the most important thing on screen.
- **Type:** IBM Plex Sans for UI, IBM Plex Mono for every measured quantity.
  `font-variant-numeric: tabular-nums` everywhere numbers can change, so digits
  don't jitter.
- **Spacing:** strict 4px grid (`--sp-1..12`). Dense but not cramped; 20–24px
  card padding.
- **Corners:** small and technical — 6px default, 8px on cards, 3–4px on chips.
  Pills only for status badges and track fills. Nothing is pill-shaped "for fun".
- **Borders:** 1px hairline (`--slate-200`) is the primary separator. Structure
  comes from borders first, shadow second.
- **Elevation:** restrained. Cards use a 1px border + `--shadow-sm` (barely
  there). Only popovers/overlays lift (`--shadow-md/lg`). No floating, no glow.
- **Cards:** white surface, 1px border, 8px radius, `--shadow-sm`. A header row
  (title + endpoint subtitle) separated by a hairline, then a 20px-padded body.
- **Focus:** 3px alpha-blue ring (`--shadow-focus`) + solid blue border. Always
  visible, never removed.
- **Hover:** borders darken one step (`--slate-200 → --slate-300`); blue button
  lightens (`600 → 500`); table rows take a faint raised fill. No scale, no lift.
- **Press:** blue button darkens (`600 → 700`) and nudges 0.5px down. No bounce.
- **Motion:** quick and linear-ish (`--ease-out`, 120–180ms). Fades and width/color
  transitions only. The single looping animation is the health-dot pulse and a
  refresh spinner — nothing decorative loops. An alarm must never feel playful.
- **Transparency/blur:** used sparingly — `color-mix` alpha tints for status
  surfaces and the normal-range band; no glassmorphism, no backdrop-blur.
- **Charts:** instrument-style. The gauge is a zoned semicircular arc (green /
  amber / red) with a mono numeral readout; feature bars plot the value against a
  shaded "normal range". Grids and axes are hairline-light.
- **Dark mode** is a first-class control-room theme, not an inversion: deep
  blue-black surfaces, slightly brighter status colors for legibility on dark.

<!-- ICONOGRAPHY -->
## Iconography

There was **no icon set in the repo** (no committed frontend). This system
standardizes on **[Lucide](https://lucide.dev)** (MIT) — the natural match for a
shadcn/ui + Tailwind stack, which is the brief's chosen frontend.

- **Style:** 24×24 grid, **2px stroke**, round caps/joins, outline (never filled).
  Stroke icons read as "instrument" and sit well next to mono type.
- **Color:** icons inherit `currentColor` and default to `--fg4` (muted); they
  take status color only when paired with a status (e.g. red alert-triangle).
- **Size:** 13–16px inline with text/labels; 24px for verdict glyphs; 32–34px for
  empty/error placeholders.
- **Implementation:** `ui_kits/dashboard/Icon.jsx` embeds Lucide path data
  verbatim so the kit renders offline with no network dependency. In production,
  use the `lucide-react` package directly. Icons in use: `activity`, `gauge`,
  `cpu`, `thermometer`, `flame`, `wrench`, `rotate-cw`, `history`, `database`,
  `server`, `alert-triangle`, `alert-circle`, `check`, `check-circle`, `x`,
  `sun`, `moon`, `sliders`, `inbox`, `download`, `zap`.
- **No emoji and no unicode glyphs as icons.** Status uses a colored dot + a
  Lucide icon, never an emoji.
- **Logo:** the mark is a **signal trace with a peak anomaly** (a sensor waveform
  spiking into an amber alert point) — see `assets/`. ⚠️ Newly designed for this
  system; the repo had no logo. Treat as a starting proposal, not a final brand.
