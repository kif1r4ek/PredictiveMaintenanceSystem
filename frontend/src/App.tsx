import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { InputForm } from "./components/InputForm";
import { ResultCard } from "./components/ResultCard";
import { ProbabilityGauge } from "./components/ProbabilityGauge";
import { FeatureBarChart } from "./components/FeatureBarChart";
import { HistoryTable } from "./components/HistoryTable";
import { ModelsPanel } from "./components/ModelsPanel";
import { Icon } from "./components/Icon";

import { predict } from "./api/predict";
import { getHistory, type HistorySource } from "./api/history";
import { getHealth } from "./api/health";
import type { HealthResponse, HistoryItem, PredictionRequest, PredictionResponse } from "./api/types";
import { parseApiError, type ApiError } from "./lib/errors";
import { DEFAULT_INPUT, FIELD_ORDER, type FormValues, type View } from "./lib/constants";
import { validateInput } from "./lib/validation";

type PredState = "empty" | "loading" | "error" | "done";
type RequestState = "loading" | "done" | "error";

function toRequest(values: FormValues): PredictionRequest {
  const numeric = Object.fromEntries(
    FIELD_ORDER.map((f) => [f, Number(values[f as keyof FormValues])])
  ) as Omit<PredictionRequest, "product_type">;
  return { ...numeric, product_type: values.product_type };
}

export default function App() {
  const [view, setView] = useState<View>("predict");
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("pm-theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pm-theme", theme);
  }, [theme]);

  // prediction
  const [predState, setPredState] = useState<PredState>("empty");
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [predError, setPredError] = useState<ApiError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [lastInput, setLastInput] = useState<FormValues>(DEFAULT_INPUT);

  // history
  const [histState, setHistState] = useState<RequestState>("loading");
  const [rows, setRows] = useState<HistoryItem[]>([]);
  const [source, setSource] = useState<HistorySource>("redis");

  // health
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthState, setHealthState] = useState<RequestState>("loading");

  const loadHistory = (src: HistorySource = source) => {
    setHistState("loading");
    getHistory({ source: src, limit: 50 })
      .then((r) => { setRows(r); setHistState("done"); })
      .catch(() => setHistState("error"));
  };

  const loadHealth = () => {
    setHealthState("loading");
    getHealth()
      .then((h) => { setHealth(h); setHealthState("done"); })
      .catch(() => setHealthState("error"));
  };

  useEffect(() => {
    loadHistory("redis");
    loadHealth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runPredict = (input: FormValues) => {
    setLastInput(input);

    // Клиентская валидация до запроса — понятные сообщения, без «0 вместо букв».
    const errs = validateInput(input);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setPredState("empty");
      return;
    }

    setPredState("loading");
    setPredError(null);
    setFieldErrors({});
    predict(toRequest(input))
      .then((res) => {
        setResult(res);
        setPredState("done");
        loadHistory();
      })
      .catch((e) => {
        const p = parseApiError(e);
        setFieldErrors(p.fieldErrors);
        if (p.code === "validation_error") {
          setPredState("empty");
        } else {
          setPredError(p);
          setPredState("error");
        }
      });
  };

  const changeSource = (src: HistorySource) => {
    setSource(src);
    loadHistory(src);
  };

  return (
    <div className="app">
      <Header
        health={health}
        healthState={healthState}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        view={view}
        onNavigate={setView}
      />

      <main className="main">
        {view === "predict" && (
          <>
            <div className="grid">
              <div className="col-left">
                <InputForm onSubmit={runPredict} loading={predState === "loading"} fieldErrors={fieldErrors} />
                {Object.keys(fieldErrors).length > 0 && (
                  <div className="banner banner--warn" style={{ marginTop: 12 }}>
                    <Icon name="alert-triangle" size={16} />
                    <div>
                      <b>Ошибка валидации.</b> Некоторые значения вне допустимого диапазона — см. подсвеченные поля.
                    </div>
                  </div>
                )}
              </div>

              <div className="col-right">
                <ResultCard state={predState} result={result} error={predError} />

                <div className="duo">
                  <div className="card">
                    <div className="card__head">
                      <div className="card__title">Шкала риска</div>
                    </div>
                    <div className="card__body" style={{ display: "grid", placeItems: "center", minHeight: 200 }}>
                      <ProbabilityGauge value={predState === "done" && result ? result.failure_probability : 0} />
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
              <HistoryTable
                rows={rows}
                state={histState}
                source={source}
                onSource={changeSource}
                onRefresh={() => loadHistory()}
                loading={histState === "loading"}
              />
            </div>
          </>
        )}

        {view === "history" && (
          <HistoryTable
            rows={rows}
            state={histState}
            source={source}
            onSource={changeSource}
            onRefresh={() => loadHistory()}
            loading={histState === "loading"}
          />
        )}

        {view === "models" && <ModelsPanel health={health} />}
      </main>
    </div>
  );
}
