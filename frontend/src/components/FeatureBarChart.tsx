import { BarChart, Bar, XAxis, YAxis, ReferenceArea, Cell, ResponsiveContainer } from "recharts";
import { RANGES, FEATURE_LABELS, FIELD_ORDER } from "../lib/constants";
import type { FormValues } from "../lib/constants";

// Каждый признак — мини горизонтальный bar (recharts) на своей шкале [min,max]
// с затенённой «нормальной» полосой (ReferenceArea).
function FeatureRow({ fkey, value }: { fkey: string; value: number | string }) {
  const r = RANGES[fkey];
  const num = Number(value);
  const has = value !== "" && value !== null && value !== undefined && !Number.isNaN(num);
  const inNormal = has && num >= r.normal[0] && num <= r.normal[1];
  const color = !has ? "transparent" : inNormal ? "var(--healthy-600)" : "var(--warning-600)";
  const data = [{ name: FEATURE_LABELS[fkey], value: has ? num : r.min }];

  return (
    <div className="fbar">
      <div className="fbar__top">
        <span className="fbar__name">{FEATURE_LABELS[fkey]}</span>
        <span className="fbar__val">
          {has ? num : "—"}<span className="u">{r.unit}</span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={16}>
        <BarChart layout="vertical" data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis type="number" domain={[r.min, r.max]} hide />
          <YAxis type="category" dataKey="name" hide />
          <ReferenceArea x1={r.normal[0]} x2={r.normal[1]} fill="var(--healthy-600)" fillOpacity={0.2} />
          <Bar dataKey="value" radius={4} background={{ fill: "var(--bg-inset)" }} isAnimationActive>
            <Cell fill={color} fillOpacity={0.7} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FeatureBarChart({ values }: { values: FormValues }) {
  return (
    <div className="fbars">
      {FIELD_ORDER.map((f) => (
        <FeatureRow key={f} fkey={f} value={values[f as keyof FormValues] as number | string} />
      ))}
      <div className="fbar__legend">
        <span>
          <i style={{ background: "color-mix(in srgb, var(--healthy-600) 35%, transparent)" }} />
          Нормальный диапазон
        </span>
        <span>
          <i style={{ background: "var(--warning-600)" }} />
          Вне нормы
        </span>
      </div>
    </div>
  );
}
