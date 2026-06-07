/* app — composes the operator dashboard and owns all request state.
   Each request has its own loading + error state, per the brief. */
const { useEffect } = React;

function parseErr(e) {
  // accepts the brief's envelope: { error: { code, message, details } }
  if (e && e.error) {
    const fe = {};
    (e.error.details || []).forEach(d => { fe[d.field] = d.message; });
    return { code: e.error.code, message: e.error.message, fieldErrors: fe };
  }
  return { code: 'internal_error', message: 'Unexpected error.', fieldErrors: {} };
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('pm-theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pm-theme', theme);
  }, [theme]);

  // prediction
  const [predState, setPredState] = useState('empty'); // empty|loading|error|done
  const [result, setResult] = useState(null);
  const [predError, setPredError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [lastInput, setLastInput] = useState({
    rotational_speed: 1551, torque: 42.8, tool_wear: 108,
    air_temperature: 298.1, process_temperature: 308.6, product_type: 'M',
  });

  // history
  const [histState, setHistState] = useState('loading');
  const [rows, setRows] = useState([]);
  const [source, setSource] = useState('redis');

  // health
  const [health, setHealth] = useState(null);
  const [healthState, setHealthState] = useState('loading');

  const loadHistory = (src = source) => {
    setHistState('loading');
    window.mockApi.getHistory({ source: src, limit: 50 })
      .then(r => { setRows(r); setHistState('done'); })
      .catch(() => setHistState('error'));
  };
  const loadHealth = () => {
    setHealthState('loading');
    window.mockApi.getHealth()
      .then(h => { setHealth(h); setHealthState('done'); })
      .catch(() => setHealthState('error'));
  };

  useEffect(() => { loadHistory('redis'); loadHealth(); }, []);

  const runPredict = (input) => {
    setLastInput(input);
    setPredState('loading');
    setPredError(null);
    setFieldErrors({});
    window.mockApi.predict(input)
      .then(res => { setResult(res); setPredState('done'); loadHistory(); })
      .catch(e => {
        const p = parseErr(e);
        setFieldErrors(p.fieldErrors);
        if (p.code === 'validation_error') { setPredState('empty'); }
        else { setPredError(p); setPredState('error'); }
      });
  };

  const changeSource = (src) => { setSource(src); loadHistory(src); };

  return (
    <div className="app">
      <Header health={health} healthState={healthState} theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />

      <main className="main">
        <div className="grid">
          <div className="col-left">
            <InputForm onSubmit={runPredict} loading={predState === 'loading'} fieldErrors={fieldErrors} />
            {Object.keys(fieldErrors).length > 0 && (
              <div className="banner banner--warn" style={{ marginTop: 12 }}>
                <Icon name="alert-triangle" size={16} />
                <div><b>Ошибка валидации.</b> Некоторые значения вне допустимого диапазона — см. подсвеченные поля.</div>
              </div>
            )}
          </div>

          <div className="col-right">
            <ResultCard state={predState} result={result} error={predError} input={lastInput} />

            <div className="duo">
              <div className="card">
                <div className="card__head">
                  <div className="card__title">Шкала риска</div>
                </div>
                <div className="card__body" style={{ display: 'grid', placeItems: 'center', minHeight: 200 }}>
                  <ProbabilityGauge value={predState === 'done' && result ? result.failure_probability : 0} />
                </div>
              </div>

              <div className="card">
                <div className="card__head">
                  <div className="card__title">Введённые признаки</div>
                  <div className="card__sub">относительно нормы</div>
                </div>
                <div className="card__body">
                  <FeatureBarChart values={lastInput} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <HistoryTable rows={rows} state={histState} source={source}
            onSource={changeSource} onRefresh={() => loadHistory()} loading={histState === 'loading'} />
        </div>

        <DevBar onHealth={loadHealth} reloadHistory={loadHistory} />
      </main>
    </div>
  );
}

/* Small dev strip to demo the error/health states the brief asks for. */
function DevBar({ onHealth, reloadHistory }) {
  const [open, setOpen] = useState(false);
  const setErr = (v) => { window.__forceError = v; };
  const setHealth = (v) => { window.__forceHealth = v; onHealth(); };
  return (
    <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button className="iconbtn" onClick={() => setOpen(o => !o)} title="Демо-состояния"><Icon name="sliders" size={15} /></button>
        <span className="eyebrow">Демо-состояния</span>
        {open && <>
          <span className="muted" style={{ fontSize: 12 }}>След. прогноз →</span>
          <button className="btn btn--ghost" style={{ height: 28, fontSize: 12, padding: '0 10px' }} onClick={() => setErr(null)}>OK</button>
          <button className="btn btn--ghost" style={{ height: 28, fontSize: 12, padding: '0 10px' }} onClick={() => setErr('503')}>503</button>
          <button className="btn btn--ghost" style={{ height: 28, fontSize: 12, padding: '0 10px' }} onClick={() => setErr('500')}>500</button>
          <span style={{ width: 1, height: 18, background: 'var(--border)' }} />
          <span className="muted" style={{ fontSize: 12 }}>Сервис</span>
          <button className="btn btn--ghost" style={{ height: 28, fontSize: 12, padding: '0 10px' }} onClick={() => setHealth(null)}>ok</button>
          <button className="btn btn--ghost" style={{ height: 28, fontSize: 12, padding: '0 10px' }} onClick={() => setHealth('degraded')}>degraded</button>
        </>}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
