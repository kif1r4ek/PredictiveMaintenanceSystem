import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

// Полукруглый gauge вероятности отказа на recharts (RadialBar + PolarAngleAxis).
export function ProbabilityGauge({ value = 0 }: { value?: number }) {
  const v = Math.max(0, Math.min(1, value));
  const pct = Math.round(v * 100);
  const color = v < 0.3 ? "var(--healthy-600)" : v < 0.6 ? "var(--warning-600)" : "var(--critical-600)";
  const data = [{ name: "risk", value: pct, fill: color }];

  return (
    <div className="gauge">
      <RadialBarChart
        width={220}
        height={132}
        cx="50%"
        cy="100%"
        innerRadius={84}
        outerRadius={112}
        startAngle={180}
        endAngle={0}
        barSize={18}
        data={data}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          background={{ fill: "var(--bg-inset)" }}
          dataKey="value"
          cornerRadius={9}
          angleAxisId={0}
          isAnimationActive
        />
      </RadialBarChart>
      <div style={{ marginTop: -46 }}>
        <div className="gauge__readout" style={{ color }}>
          {pct}<span className="gauge__pct">%</span>
        </div>
        <div className="gauge__cap">Вероятность отказа</div>
      </div>
    </div>
  );
}
