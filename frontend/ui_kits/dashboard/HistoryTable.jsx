/* HistoryTable — last predictions from GET /history?source=redis|db.
   Columns: time, product type, status, probability, failure type. */

function timeAgo(iso) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return 'только что';
  if (d < 3600) return Math.floor(d/60) + ' мин назад';
  if (d < 86400) return Math.floor(d/3600) + ' ч назад';
  return Math.floor(d/86400) + ' дн назад';
}
function clock(iso) {
  const dt = new Date(iso);
  return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function HistoryTable({ rows, state, source, onSource, onRefresh, loading }) {
  return (
    <div className="card">
      <div className="card__head">
        <div>
          <div className="card__title gap2"><Icon name="history" size={16} style={{ color: 'var(--fg4)' }} /> Последние прогнозы</div>
          <div className="card__sub">GET /history?source={source}</div>
        </div>
        <div className="toolbar">
          <div className="src-toggle">
            <button className={source === 'redis' ? 'is-on' : ''} onClick={() => onSource('redis')}>Redis</button>
            <button className={source === 'db' ? 'is-on' : ''} onClick={() => onSource('db')}>Postgres</button>
          </div>
          <button className="iconbtn" title="Обновить" onClick={onRefresh}>
            <Icon name="rotate-cw" size={15} className={loading ? 'pulse' : ''} />
          </button>
        </div>
      </div>

      <div className="tablewrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 92 }}>Время</th>
              <th style={{ width: 64 }}>Тип</th>
              <th>Статус</th>
              <th style={{ width: 150 }}>Вероятность</th>
              <th>Тип отказа</th>
              <th style={{ width: 120, textAlign: 'right' }}>Обороты / Момент</th>
            </tr>
          </thead>
          <tbody>
            {state === 'loading' && Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <td key={j}><div className="sk" style={{ height: 14, width: j === 4 ? '70%' : '55%' }} /></td>
                ))}
              </tr>
            ))}

            {state === 'error' && (
              <tr><td colSpan={6}>
                <div className="placeholder" style={{ padding: '32px 16px' }}>
                  <Icon name="server" size={26} stroke={1.6} style={{ color: 'var(--warning-600)' }} />
                  <div className="t">Не удалось загрузить историю</div>
                  <div className="d">Сервис временно недоступен. Попробуйте обновить.</div>
                </div>
              </td></tr>
            )}

            {state === 'done' && rows.length === 0 && (
              <tr><td colSpan={6}>
                <div className="placeholder" style={{ padding: '32px 16px' }}>
                  <Icon name="inbox" size={26} stroke={1.6} />
                  <div className="t">Прогнозов пока нет</div>
                </div>
              </td></tr>
            )}

            {state === 'done' && rows.map(r => {
              const pct = Math.round(r.failure_probability * 100);
              const barColor = r.failure_probability < 0.3 ? 'var(--healthy-600)'
                : r.failure_probability < 0.6 ? 'var(--warning-600)' : 'var(--critical-600)';
              return (
                <tr key={r.id}>
                  <td className="t-time" title={new Date(r.created_at).toLocaleString()}>
                    <div style={{ color: 'var(--fg1)', fontWeight: 500 }}>{clock(r.created_at)}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg4)' }}>{timeAgo(r.created_at)}</div>
                  </td>
                  <td><span className="ptype">{r.product_type}</span></td>
                  <td>
                    <span className={'statuscell ' + (r.is_failure ? 'statuscell--fail' : 'statuscell--ok')}>
                      <span className="d" />{r.is_failure ? 'Отказ' : 'Норма'}
                    </span>
                  </td>
                  <td>
                    <div className="probcell">
                      <span className="mono" style={{ width: 38 }}>{pct}%</span>
                      <span className="bar"><i style={{ width: pct + '%', background: barColor }} /></span>
                    </div>
                  </td>
                  <td>{r.failure_type
                    ? <span style={{ color: 'var(--fg2)' }}>{r.failure_type}</span>
                    : <span className="dash">—</span>}</td>
                  <td style={{ textAlign: 'right' }} className="mono">
                    {Math.round(r.rotational_speed)} <span className="muted">/</span> {r.torque}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
window.HistoryTable = HistoryTable;
