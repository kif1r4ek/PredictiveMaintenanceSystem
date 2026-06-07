import { Icon } from "./Icon";
import { failureLabel } from "../lib/constants";
import type { PredictionResponse } from "../api/types";
import type { ApiError } from "../lib/errors";

type PredState = "empty" | "loading" | "error" | "done";

function Verdict({ result }: { result: PredictionResponse }) {
  const fail = result.is_failure;
  const pct = Math.round(result.failure_probability * 100);
  const label = failureLabel(result.failure_type);
  return (
    <div className="result">
      <div className={"verdict " + (fail ? "verdict--fail" : "verdict--ok")}>
        <div className="verdict__icon">
          <Icon name={fail ? "alert-triangle" : "check"} size={24} stroke={2.4} style={{ color: "#fff" }} />
        </div>
        <div className="verdict__main">
          <div className="verdict__status">{fail ? "Отказ" : "Норма"}</div>
          <div className="verdict__sub">
            {fail ? "Прогнозируется отказ — запланируйте обслуживание" : "Отказ не прогнозируется — оборудование в норме"}
          </div>
        </div>
        <div className={"ftype " + (fail ? "ftype--fail" : "ftype--none")}>
          <span className="d" />
          {label || "Без отказа"}
        </div>
      </div>

      <div className="stat-row">
        <div className="stat">
          <div className="k">Вероятность отказа</div>
          <div className="v" style={{ color: fail ? "var(--critical-600)" : "var(--healthy-600)" }}>
            {pct}<small>%</small>
          </div>
        </div>
        <div className="stat">
          <div className="k">Время инференса</div>
          <div className="v">{result.inference_time_ms}<small>мс</small></div>
        </div>
      </div>
    </div>
  );
}

interface ResultCardProps {
  state: PredState;
  result: PredictionResponse | null;
  error: ApiError | null;
}

export function ResultCard({ state, result, error }: ResultCardProps) {
  return (
    <div className="card">
      <div className="card__head">
        <div>
          <div className="card__title">Результат прогноза</div>
          <div className="card__sub">Оценка состояния оборудования</div>
        </div>
      </div>
      <div className="card__body">
        {state === "empty" && (
          <div className="placeholder">
            <Icon name="activity" size={34} stroke={1.6} />
            <div className="t">Прогноз ещё не выполнен</div>
            <div className="d">Введите текущие показания датчиков и запустите прогноз, чтобы увидеть риск отказа оборудования.</div>
          </div>
        )}

        {state === "loading" && (
          <div className="result">
            <div className="sk" style={{ height: 86 }} />
            <div className="stat-row">
              <div className="sk" style={{ height: 78 }} />
              <div className="sk" style={{ height: 78 }} />
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="placeholder">
            <Icon
              name={error?.code === "service_unavailable" ? "server" : "alert-triangle"}
              size={32}
              stroke={1.6}
              style={{ color: "var(--critical-600)" }}
            />
            <div className="t" style={{ color: "var(--fg2)" }}>
              {error?.code === "service_unavailable"
                ? "Сервис временно недоступен"
                : error?.code === "validation_error"
                ? "Проверьте введённые значения"
                : "Не удалось получить прогноз"}
            </div>
            <div className="d">{error?.message}</div>
          </div>
        )}

        {state === "done" && result && <Verdict result={result} />}
      </div>
    </div>
  );
}
