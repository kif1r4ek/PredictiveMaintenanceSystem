import { useState } from "react";
import { Icon } from "./Icon";
import type { HealthResponse } from "../api/types";
import type { View } from "../lib/constants";

type RequestState = "loading" | "done" | "error";

function dep(ok: boolean) {
  return (
    <span className="v" style={{ color: ok ? "var(--healthy-600)" : "var(--critical-600)" }}>
      <Icon name={ok ? "check-circle" : "alert-circle"} size={13} />
      {ok ? "норма" : "сбой"}
    </span>
  );
}

function HealthBadge({ health, state }: { health: HealthResponse | null; state: RequestState }) {
  const [open, setOpen] = useState(false);
  let cls = "health--ok";
  let label = "Работает";
  let dot = "";

  if (state === "loading") {
    label = "Проверка…";
  } else if (state === "error") {
    cls = "health--down";
    label = "Недоступен";
  } else if (health) {
    if (health.status === "degraded") {
      cls = "health--degraded";
      label = "Деградация";
    } else {
      label = "Работает";
      dot = "pulse";
    }
  }

  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div className={"health " + cls}>
        <span className={"health__dot " + dot} />
        {label}
      </div>
      {open && health && state === "done" && (
        <div
          className="card"
          style={{ position: "absolute", right: 0, top: 38, zIndex: 20, padding: 12, boxShadow: "var(--shadow-lg)", minWidth: 180 }}
        >
          <div className="eyebrow" style={{ marginBottom: 9 }}>Зависимости</div>
          <div className="health-pop">
            <div className="health-pop__row"><span className="k gap2"><Icon name="cpu" size={13} />Модели</span>{dep(health.models)}</div>
            <div className="health-pop__row"><span className="k gap2"><Icon name="database" size={13} />База данных</span>{dep(health.database)}</div>
            <div className="health-pop__row"><span className="k gap2"><Icon name="server" size={13} />Redis</span>{dep(health.redis)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  return (
    <button className="iconbtn" onClick={onToggle} title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}>
      <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
    </button>
  );
}

interface HeaderProps {
  health: HealthResponse | null;
  healthState: RequestState;
  theme: string;
  onToggleTheme: () => void;
  view: View;
  onNavigate: (v: View) => void;
}

const NAV_ITEMS: [View, string][] = [
  ["predict", "Прогноз"],
  ["history", "История"],
  ["models", "Модели"],
];

export function Header({ health, healthState, theme, onToggleTheme, view, onNavigate }: HeaderProps) {
  return (
    <header className="appbar">
      <div className="appbar__brand">
        <img className="appbar__logo" src="/logo-mark.svg" alt="" />
        <div className="appbar__title">
          Предиктивное обслуживание
          <small>Прогноз отказов</small>
        </div>
      </div>
      <nav className="appbar__nav" style={{ marginLeft: 18 }}>
        {NAV_ITEMS.map(([key, label]) => (
          <a key={key} className={view === key ? "is-active" : ""} onClick={() => onNavigate(key)}>
            {label}
          </a>
        ))}
      </nav>
      <div className="appbar__spacer" />
      <HealthBadge health={health} state={healthState} />
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  );
}
