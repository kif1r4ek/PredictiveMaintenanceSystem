/* InputForm — 6 fields per PredictionRequest. Inline range hints, min/max,
   per-field errors mapped from a 422 envelope's details[].field. */
const { useState } = React;

const NUM_FIELDS = [
  { key: 'rotational_speed',    label: 'Скорость вращения', icon: 'rotate-cw',    step: 1 },
  { key: 'torque',              label: 'Крутящий момент',           icon: 'wrench',       step: 0.1 },
  { key: 'tool_wear',           label: 'Износ инструмента',        icon: 'history',      step: 1 },
  { key: 'air_temperature',     label: 'Темп. воздуха',  icon: 'thermometer',  step: 0.1 },
  { key: 'process_temperature', label: 'Темп. процесса',    icon: 'flame',        step: 0.1 },
];

function InputForm({ onSubmit, loading, fieldErrors, onClear }) {
  const R = window.PM_RANGES;
  const [vals, setVals] = useState({
    rotational_speed: 1551, torque: 42.8, tool_wear: 108,
    air_temperature: 298.1, process_temperature: 308.6, product_type: 'M',
  });
  const set = (k, v) => setVals(s => ({ ...s, [k]: v }));

  const submit = (e) => { e.preventDefault(); onSubmit(vals); };
  const loadExample = () => setVals({
    rotational_speed: 1372, torque: 68.1, tool_wear: 210,
    air_temperature: 302.9, process_temperature: 305.4, product_type: 'L',
  });

  return (
    <form className="card" onSubmit={submit} noValidate>
      <div className="card__head">
        <div>
          <div className="card__title">Новый прогноз</div>
          <div className="card__sub">POST /predict · PredictionRequest</div>
        </div>
        <button type="button" className="iconbtn" title="Загрузить пример" onClick={loadExample}>
          <Icon name="inbox" size={16} />
        </button>
      </div>
      <div className="card__body">
        {NUM_FIELDS.map(f => {
          const r = R[f.key];
          const err = fieldErrors && fieldErrors[f.key];
          return (
            <div className="field" key={f.key}>
              <div className="field__label">
                <span className="lab gap2"><Icon name={f.icon} size={14} style={{ color: 'var(--fg4)' }} />{f.label}</span>
                <span className="field__range">{r.min}–{r.max} {r.unit}</span>
              </div>
              <input
                className={'input' + (err ? ' is-error' : '')}
                type="number" inputMode="decimal" step={f.step}
                min={r.min} max={r.max}
                value={vals[f.key]}
                onChange={e => set(f.key, e.target.value)}
                aria-invalid={!!err}
              />
              {err && <div className="field__err"><Icon name="alert-circle" size={13} />{err}</div>}
            </div>
          );
        })}

        <div className="field">
          <div className="field__label">
            <span className="lab gap2"><Icon name="cpu" size={14} style={{ color: 'var(--fg4)' }} />Категория продукта</span>
            <span className="field__range">вариант качества</span>
          </div>
          <div className="seg" role="tablist">
            {[['L','Низкий'],['M','Средний'],['H','Высокий']].map(([t, name]) => (
              <button type="button" key={t} role="tab"
                className={vals.product_type === t ? 'is-on' : ''}
                onClick={() => set('product_type', t)}>
                <span className="tag">{t}</span> {name}
              </button>
            ))}
          </div>
          {fieldErrors && fieldErrors.product_type &&
            <div className="field__err"><Icon name="alert-circle" size={13} />{fieldErrors.product_type}</div>}
        </div>

        <button className="btn btn--primary btn--block" type="submit" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? <><span className="spin" /> Прогнозирование…</> : <><Icon name="activity" size={16} /> Спрогнозировать отказ</>}
        </button>
      </div>
    </form>
  );
}
window.InputForm = InputForm;
