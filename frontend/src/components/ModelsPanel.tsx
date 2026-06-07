import { Icon } from "./Icon";
import type { HealthResponse } from "../api/types";

// Информационная панель о каскаде моделей. Статус загрузки — из /health.
const FAILURE_TYPES = [
  "Отказ теплоотвода",
  "Отказ по мощности",
  "Перегрузка",
  "Износ инструмента",
];

function Metric({ k, v }: { k: string; v: string }) {
  return (
    <div className="stat">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
    </div>
  );
}

export function ModelsPanel({ health }: { health: HealthResponse | null }) {
  const loaded = health?.models ?? false;
  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <div className="card">
        <div className="card__head">
          <div>
            <div className="card__title gap2">
              <Icon name="activity" size={16} style={{ color: "var(--fg4)" }} /> Бинарная модель
            </div>
            <div className="card__sub">Будет ли отказ?</div>
          </div>
          <span className={"health " + (loaded ? "health--ok" : "health--down")}>
            <span className="health__dot" />
            {loaded ? "Загружена" : "Не загружена"}
          </span>
        </div>
        <div className="card__body">
          <p className="ds-small" style={{ marginTop: 0 }}>
            SVM (RBF) с Borderline-SMOTE и масштабированием. Решение по порогу
            вероятности.
          </p>
          <div className="stat-row">
            <Metric k="Порог" v="0.451" />
            <Metric k="Recall" v="0.82" />
            <Metric k="ROC-AUC" v="0.98" />
            <Metric k="F1" v="0.69" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__head">
          <div>
            <div className="card__title gap2">
              <Icon name="cpu" size={16} style={{ color: "var(--fg4)" }} /> Мультиклассовая модель
            </div>
            <div className="card__sub">Какой тип отказа?</div>
          </div>
          <span className={"health " + (loaded ? "health--ok" : "health--down")}>
            <span className="health__dot" />
            {loaded ? "Загружена" : "Не загружена"}
          </span>
        </div>
        <div className="card__body">
          <p className="ds-small" style={{ marginTop: 0 }}>
            Random Forest. Запускается каскадом — только если бинарная модель
            спрогнозировала отказ.
          </p>
          <div className="stat-row" style={{ gridTemplateColumns: "1fr" }}>
            <Metric k="F1 macro" v="0.97" />
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Типы отказа</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {FAILURE_TYPES.map((t) => (
                <span key={t} className="ftype ftype--fail">
                  <span className="d" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
