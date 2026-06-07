/* FeatureBarChart — each submitted feature plotted on its full sensor range,
   with the "normal" band shaded and a marker for the submitted value.
   Real build: recharts BarChart with ReferenceArea bands. */
const FEATURE_LABELS = {
  rotational_speed: 'Скорость вращения',
  torque: 'Крутящий момент',
  tool_wear: 'Износ инструмента',
  air_temperature: 'Темп. воздуха',
  process_temperature: 'Темп. процесса',
};

function FeatureBarChart({ values }) {
  const R = window.PM_RANGES;
  const order = window.PM_FIELD_ORDER;
  return (
    <div className="fbars">
      {order.map(f => {
        const r = R[f];
        const v = Number(values[f]);
        const has = values[f] !== '' && !Number.isNaN(v);
        const span = r.max - r.min;
        const pos = has ? Math.max(0, Math.min(1, (v - r.min) / span)) : 0;
        const nLeft = ((r.normal[0] - r.min) / span) * 100;
        const nWidth = ((r.normal[1] - r.normal[0]) / span) * 100;
        const inNormal = has && v >= r.normal[0] && v <= r.normal[1];
        const fillColor = !has ? 'transparent' : inNormal ? 'var(--healthy-600)' : 'var(--warning-600)';
        return (
          <div className="fbar" key={f}>
            <div className="fbar__top">
              <span className="fbar__name">{FEATURE_LABELS[f]}</span>
              <span className="fbar__val">{has ? v : '—'}<span className="u">{r.unit}</span></span>
            </div>
            <div className="fbar__track">
              <div className="fbar__norm" style={{ left: nLeft + '%', width: nWidth + '%' }} />
              <div className="fbar__fill" style={{ width: (pos*100) + '%', background: fillColor, opacity: has ? 0.55 : 0 }} />
              {has && <div className="fbar__marker" style={{ left: `calc(${pos*100}% - 1px)` }} />}
            </div>
          </div>
        );
      })}
      <div className="fbar__legend">
        <span><i style={{ background: 'color-mix(in srgb, var(--healthy-600) 35%, transparent)' }}></i>Нормальный диапазон</span>
        <span><i style={{ background: 'var(--fg1)', width: '2px', height: '12px' }}></i>Введённое значение</span>
      </div>
    </div>
  );
}
window.FeatureBarChart = FeatureBarChart;
