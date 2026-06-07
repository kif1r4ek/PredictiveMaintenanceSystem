/* ProbabilityGauge — semicircular failure-probability gauge.
   Hand-built SVG arc (real build: recharts RadialBar). value in 0..1. */
function ProbabilityGauge({ value = 0, size = 220 }) {
  const v = Math.max(0, Math.min(1, value));
  const w = size, h = size * 0.62;
  const cx = w / 2, cy = h - 6, R = w / 2 - 16, sw = 16;
  const polar = (frac) => {
    const a = Math.PI * (1 - frac); // 180°→0°
    return [cx + R * Math.cos(a), cy - R * Math.sin(a)];
  };
  const arc = (f0, f1) => {
    const [x0, y0] = polar(f0), [x1, y1] = polar(f1);
    const large = (f1 - f0) > 0.5 ? 1 : 0;
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`;
  };
  // color by zone
  const zoneColor = v < 0.3 ? 'var(--healthy-600)' : v < 0.6 ? 'var(--warning-600)' : 'var(--critical-600)';
  const [nx, ny] = polar(v);
  const pct = Math.round(v * 100);

  return (
    <div className="gauge">
      <svg width={w} height={h + 10} viewBox={`0 0 ${w} ${h + 10}`}>
        {/* zone track */}
        <path d={arc(0, 0.3)} stroke="var(--healthy-600)" strokeOpacity="0.18" strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d={arc(0.3, 0.6)} stroke="var(--warning-600)" strokeOpacity="0.18" strokeWidth={sw} fill="none" />
        <path d={arc(0.6, 1)} stroke="var(--critical-600)" strokeOpacity="0.18" strokeWidth={sw} fill="none" strokeLinecap="round" />
        {/* value arc */}
        {v > 0.001 && (
          <path d={arc(0, v)} stroke={zoneColor} strokeWidth={sw} fill="none" strokeLinecap="round"
            style={{ transition: 'stroke 200ms' }} />
        )}
        {/* needle dot */}
        <circle cx={nx} cy={ny} r={6.5} fill="var(--bg-surface)" stroke={zoneColor} strokeWidth="3.5" />
        {/* threshold tick at 0.5 */}
        {(() => { const [tx,ty]=polar(0.5); const [ix,iy]=[cx+(R-sw/2-3)*Math.cos(Math.PI*0.5),cy-(R-sw/2-3)*Math.sin(Math.PI*0.5)]; return (
          <line x1={ix} y1={iy} x2={tx + (tx-cx)*0.04} y2={ty + (ty-cy)*0.04} stroke="var(--fg4)" strokeWidth="2" />
        ); })()}
      </svg>
      <div style={{ marginTop: -size * 0.18 }}>
        <div className="gauge__readout" style={{ color: zoneColor }}>{pct}<span className="gauge__pct">%</span></div>
        <div className="gauge__cap">Вероятность отказа</div>
      </div>
    </div>
  );
}
window.ProbabilityGauge = ProbabilityGauge;
