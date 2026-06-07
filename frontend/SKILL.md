---
name: predictive-maintenance-design
description: Use this skill to generate well-branded interfaces and assets for the Predictive Maintenance platform (an ML system that predicts industrial-equipment failures from sensor telemetry), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and a dashboard UI kit for prototyping against the real backend contract (openapi.json).
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy
assets out and create static HTML files for the user to view. If working on
production code, you can copy assets and read the rules here to become an expert
in designing with this brand.

Key files:
- `README.md` — product context, content fundamentals, visual foundations, iconography.
- `colors_and_type.css` / `styles.css` — design tokens (color, type, spacing, radii, shadow, motion).
- `openapi.json` — the backend contract; build any data UI against these exact schemas.
- `assets/` — logo mark & wordmark.
- `ui_kits/dashboard/` — interactive, high-fidelity operator dashboard (InputForm,
  ResultCard, ProbabilityGauge, FeatureBarChart, HistoryTable, health badge).
  Copy these components as the visual source of truth.
- `preview/` — design-system specimen cards.

Design direction is **"Industrial Telemetry"**: IBM Plex Sans + Mono, cool
graphite neutrals, one signal-blue for action, a green/amber/red equipment-health
ramp, hairline borders, small radii, restrained shadows, quiet motion. Status is
the only saturated color; numbers are always mono with units. No emoji, no
gradients, no decorative loops.

If the user invokes this skill without any other guidance, ask them what they
want to build or design, ask some questions, and act as an expert designer who
outputs HTML artifacts _or_ production code, depending on the need.
