import { useState } from "react";
import { Icon } from "./Icon";
import {
  RANGES,
  NUM_FIELDS,
  DEFAULT_INPUT,
  EXAMPLE_INPUT,
  type FormValues,
} from "../lib/constants";
import type { ProductType } from "../api/types";

interface InputFormProps {
  onSubmit: (values: FormValues) => void;
  loading: boolean;
  fieldErrors: Record<string, string>;
}

const PRODUCT_TYPES: [ProductType, string][] = [
  ["L", "Низкий"],
  ["M", "Средний"],
  ["H", "Высокий"],
];

export function InputForm({ onSubmit, loading, fieldErrors }: InputFormProps) {
  const [vals, setVals] = useState<FormValues>(DEFAULT_INPUT);

  const set = (k: keyof FormValues, v: string | ProductType) =>
    setVals((s) => ({ ...s, [k]: v }));

  // Шаг по кнопкам степпера: от текущего (или min, если пусто), с клампом и
  // округлением под десятичность шага.
  const stepBy = (key: keyof FormValues, dir: 1 | -1, step: number) => {
    const r = RANGES[key as string];
    const cur = Number(vals[key]);
    const base = Number.isNaN(cur) ? r.min : cur;
    const decimals = step < 1 ? 1 : 0;
    const next = Math.min(r.max, Math.max(r.min, base + dir * step));
    set(key, String(Number(next.toFixed(decimals))));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(vals);
  };

  return (
    <form className="card" onSubmit={submit} noValidate>
      <div className="card__head">
        <div>
          <div className="card__title">Новый прогноз</div>
          <div className="card__sub">Текущие показания датчиков</div>
        </div>
        <button type="button" className="iconbtn" title="Загрузить пример" onClick={() => setVals(EXAMPLE_INPUT)}>
          <Icon name="inbox" size={16} />
        </button>
      </div>
      <div className="card__body">
        {NUM_FIELDS.map((f) => {
          const r = RANGES[f.key];
          const err = fieldErrors[f.key];
          return (
            <div className="field" key={f.key}>
              <div className="field__label">
                <span className="lab gap2">
                  <Icon name={f.icon} size={14} style={{ color: "var(--fg4)" }} />
                  {f.label}
                </span>
                <span className="field__range">{r.min}–{r.max} {r.unit}</span>
              </div>
              <div className="numwrap">
                <input
                  className={"input" + (err ? " is-error" : "")}
                  type="number"
                  inputMode="decimal"
                  step={f.step}
                  min={r.min}
                  max={r.max}
                  value={vals[f.key as keyof FormValues] as number | string}
                  onChange={(e) => set(f.key as keyof FormValues, e.target.value)}
                  aria-invalid={!!err}
                />
                <div className="stepper">
                  <button type="button" tabIndex={-1} aria-label="Увеличить" onClick={() => stepBy(f.key as keyof FormValues, 1, f.step)}>
                    <Icon name="chevron-up" size={13} />
                  </button>
                  <button type="button" tabIndex={-1} aria-label="Уменьшить" onClick={() => stepBy(f.key as keyof FormValues, -1, f.step)}>
                    <Icon name="chevron-down" size={13} />
                  </button>
                </div>
              </div>
              {err && (
                <div className="field__err">
                  <Icon name="alert-circle" size={13} />
                  {err}
                </div>
              )}
            </div>
          );
        })}

        <div className="field">
          <div className="field__label">
            <span className="lab gap2">
              <Icon name="cpu" size={14} style={{ color: "var(--fg4)" }} />
              Категория продукта
            </span>
            <span className="field__range">вариант качества</span>
          </div>
          <div className="seg" role="tablist">
            {PRODUCT_TYPES.map(([t, name]) => (
              <button
                type="button"
                key={t}
                role="tab"
                className={vals.product_type === t ? "is-on" : ""}
                onClick={() => set("product_type", t)}
              >
                <span className="tag">{t}</span> {name}
              </button>
            ))}
          </div>
          {fieldErrors.product_type && (
            <div className="field__err">
              <Icon name="alert-circle" size={13} />
              {fieldErrors.product_type}
            </div>
          )}
        </div>

        <button className="btn btn--primary btn--block" type="submit" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? (
            <><span className="spin" /> Прогнозирование…</>
          ) : (
            <><Icon name="activity" size={16} /> Спрогнозировать отказ</>
          )}
        </button>
      </div>
    </form>
  );
}
