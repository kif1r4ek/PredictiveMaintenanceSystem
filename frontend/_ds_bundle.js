/* @ds-bundle: {"format":3,"namespace":"PredictiveMaintenanceDesignSystem_9bbbd7","components":[],"sourceHashes":{"ui_kits/dashboard/FeatureBarChart.jsx":"4d6dd503b4bf","ui_kits/dashboard/Header.jsx":"27c52aa4ab25","ui_kits/dashboard/HistoryTable.jsx":"fd567cb45fd0","ui_kits/dashboard/Icon.jsx":"ebc6a7fcd3e6","ui_kits/dashboard/InputForm.jsx":"d0becb43620c","ui_kits/dashboard/ProbabilityGauge.jsx":"41018c10e46a","ui_kits/dashboard/ResultCard.jsx":"5423c1b39240","ui_kits/dashboard/app.jsx":"2aea5638c9ab","ui_kits/dashboard/mockApi.jsx":"a3092bc3f25a"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PredictiveMaintenanceDesignSystem_9bbbd7 = window.PredictiveMaintenanceDesignSystem_9bbbd7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/dashboard/FeatureBarChart.jsx
try { (() => {
/* FeatureBarChart — each submitted feature plotted on its full sensor range,
   with the "normal" band shaded and a marker for the submitted value.
   Real build: recharts BarChart with ReferenceArea bands. */
const FEATURE_LABELS = {
  rotational_speed: 'Скорость вращения',
  torque: 'Крутящий момент',
  tool_wear: 'Износ инструмента',
  air_temperature: 'Темп. воздуха',
  process_temperature: 'Темп. процесса'
};
function FeatureBarChart({
  values
}) {
  const R = window.PM_RANGES;
  const order = window.PM_FIELD_ORDER;
  return /*#__PURE__*/React.createElement("div", {
    className: "fbars"
  }, order.map(f => {
    const r = R[f];
    const v = Number(values[f]);
    const has = values[f] !== '' && !Number.isNaN(v);
    const span = r.max - r.min;
    const pos = has ? Math.max(0, Math.min(1, (v - r.min) / span)) : 0;
    const nLeft = (r.normal[0] - r.min) / span * 100;
    const nWidth = (r.normal[1] - r.normal[0]) / span * 100;
    const inNormal = has && v >= r.normal[0] && v <= r.normal[1];
    const fillColor = !has ? 'transparent' : inNormal ? 'var(--healthy-600)' : 'var(--warning-600)';
    return /*#__PURE__*/React.createElement("div", {
      className: "fbar",
      key: f
    }, /*#__PURE__*/React.createElement("div", {
      className: "fbar__top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fbar__name"
    }, FEATURE_LABELS[f]), /*#__PURE__*/React.createElement("span", {
      className: "fbar__val"
    }, has ? v : '—', /*#__PURE__*/React.createElement("span", {
      className: "u"
    }, r.unit))), /*#__PURE__*/React.createElement("div", {
      className: "fbar__track"
    }, /*#__PURE__*/React.createElement("div", {
      className: "fbar__norm",
      style: {
        left: nLeft + '%',
        width: nWidth + '%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "fbar__fill",
      style: {
        width: pos * 100 + '%',
        background: fillColor,
        opacity: has ? 0.55 : 0
      }
    }), has && /*#__PURE__*/React.createElement("div", {
      className: "fbar__marker",
      style: {
        left: `calc(${pos * 100}% - 1px)`
      }
    })));
  }), /*#__PURE__*/React.createElement("div", {
    className: "fbar__legend"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: 'color-mix(in srgb, var(--healthy-600) 35%, transparent)'
    }
  }), "\u041D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: 'var(--fg1)',
      width: '2px',
      height: '12px'
    }
  }), "\u0412\u0432\u0435\u0434\u0451\u043D\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435")));
}
window.FeatureBarChart = FeatureBarChart;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/FeatureBarChart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Header.jsx
try { (() => {
/* Header — brand, health badge (GET /health), theme toggle. */
const {
  useState: useStateH
} = React;
function HealthBadge({
  health,
  state
}) {
  const [open, setOpen] = useState(false);
  let cls = 'health--ok',
    label = 'Работает',
    dot = '';
  if (state === 'loading') {
    label = 'Проверка…';
    cls = 'health--ok';
  } else if (state === 'error') {
    cls = 'health--down';
    label = 'Недоступен';
  } else if (health) {
    if (health.status === 'degraded') {
      cls = 'health--degraded';
      label = 'Деградация';
    } else {
      cls = 'health--ok';
      label = 'Работает';
      dot = 'pulse';
    }
  }
  const dep = ok => /*#__PURE__*/React.createElement("span", {
    className: "v",
    style: {
      color: ok ? 'var(--healthy-600)' : 'var(--critical-600)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ok ? 'check-circle' : 'alert-circle',
    size: 13
  }), ok ? 'норма' : 'сбой');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: 'health ' + cls
  }, /*#__PURE__*/React.createElement("span", {
    className: 'health__dot ' + dot
  }), label), open && health && state === 'done' && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      position: 'absolute',
      right: 0,
      top: 38,
      zIndex: 20,
      padding: 12,
      boxShadow: 'var(--shadow-lg)',
      minWidth: 180
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 9
    }
  }, "\u0417\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438"), /*#__PURE__*/React.createElement("div", {
    className: "health-pop"
  }, /*#__PURE__*/React.createElement("div", {
    className: "health-pop__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k gap2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cpu",
    size: 13
  }), "\u041C\u043E\u0434\u0435\u043B\u0438"), dep(health.models)), /*#__PURE__*/React.createElement("div", {
    className: "health-pop__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k gap2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "database",
    size: 13
  }), "\u0411\u0430\u0437\u0430 \u0434\u0430\u043D\u043D\u044B\u0445"), dep(health.database)), /*#__PURE__*/React.createElement("div", {
    className: "health-pop__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k gap2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "server",
    size: 13
  }), "Redis"), dep(health.redis)))));
}
function ThemeToggle({
  theme,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "iconbtn",
    onClick: onToggle,
    title: theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: theme === 'dark' ? 'sun' : 'moon',
    size: 16
  }));
}
function Header({
  health,
  healthState,
  theme,
  onToggleTheme
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "appbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "appbar__brand"
  }, /*#__PURE__*/React.createElement("img", {
    className: "appbar__logo",
    src: "logo-mark.svg",
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "appbar__title"
  }, "\u041F\u0440\u0435\u0434\u0438\u043A\u0442\u0438\u0432\u043D\u043E\u0435 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435", /*#__PURE__*/React.createElement("small", null, "\u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u043E\u0442\u043A\u0430\u0437\u043E\u0432"))), /*#__PURE__*/React.createElement("nav", {
    className: "appbar__nav",
    style: {
      marginLeft: 18
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "is-active"
  }, "\u041F\u0440\u043E\u0433\u043D\u043E\u0437"), /*#__PURE__*/React.createElement("a", null, "\u0418\u0441\u0442\u043E\u0440\u0438\u044F"), /*#__PURE__*/React.createElement("a", null, "\u041C\u043E\u0434\u0435\u043B\u0438")), /*#__PURE__*/React.createElement("div", {
    className: "appbar__spacer"
  }), /*#__PURE__*/React.createElement(HealthBadge, {
    health: health,
    state: healthState
  }), /*#__PURE__*/React.createElement(ThemeToggle, {
    theme: theme,
    onToggle: onToggleTheme
  }));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/HistoryTable.jsx
try { (() => {
/* HistoryTable — last predictions from GET /history?source=redis|db.
   Columns: time, product type, status, probability, failure type. */

function timeAgo(iso) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return 'только что';
  if (d < 3600) return Math.floor(d / 60) + ' мин назад';
  if (d < 86400) return Math.floor(d / 3600) + ' ч назад';
  return Math.floor(d / 86400) + ' дн назад';
}
function clock(iso) {
  const dt = new Date(iso);
  return dt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}
function HistoryTable({
  rows,
  state,
  source,
  onSource,
  onRefresh,
  loading
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card__title gap2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "history",
    size: 16,
    style: {
      color: 'var(--fg4)'
    }
  }), " \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u043F\u0440\u043E\u0433\u043D\u043E\u0437\u044B"), /*#__PURE__*/React.createElement("div", {
    className: "card__sub"
  }, "GET /history?source=", source)), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "src-toggle"
  }, /*#__PURE__*/React.createElement("button", {
    className: source === 'redis' ? 'is-on' : '',
    onClick: () => onSource('redis')
  }, "Redis"), /*#__PURE__*/React.createElement("button", {
    className: source === 'db' ? 'is-on' : '',
    onClick: () => onSource('db')
  }, "Postgres")), /*#__PURE__*/React.createElement("button", {
    className: "iconbtn",
    title: "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C",
    onClick: onRefresh
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "rotate-cw",
    size: 15,
    className: loading ? 'pulse' : ''
  })))), /*#__PURE__*/React.createElement("div", {
    className: "tablewrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 92
    }
  }, "\u0412\u0440\u0435\u043C\u044F"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 64
    }
  }, "\u0422\u0438\u043F"), /*#__PURE__*/React.createElement("th", null, "\u0421\u0442\u0430\u0442\u0443\u0441"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 150
    }
  }, "\u0412\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044C"), /*#__PURE__*/React.createElement("th", null, "\u0422\u0438\u043F \u043E\u0442\u043A\u0430\u0437\u0430"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 120,
      textAlign: 'right'
    }
  }, "\u041E\u0431\u043E\u0440\u043E\u0442\u044B / \u041C\u043E\u043C\u0435\u043D\u0442"))), /*#__PURE__*/React.createElement("tbody", null, state === 'loading' && Array.from({
    length: 5
  }).map((_, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, Array.from({
    length: 6
  }).map((__, j) => /*#__PURE__*/React.createElement("td", {
    key: j
  }, /*#__PURE__*/React.createElement("div", {
    className: "sk",
    style: {
      height: 14,
      width: j === 4 ? '70%' : '55%'
    }
  }))))), state === 'error' && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 6
  }, /*#__PURE__*/React.createElement("div", {
    className: "placeholder",
    style: {
      padding: '32px 16px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "server",
    size: 26,
    stroke: 1.6,
    style: {
      color: 'var(--warning-600)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u044E"), /*#__PURE__*/React.createElement("div", {
    className: "d"
  }, "\u0421\u0435\u0440\u0432\u0438\u0441 \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C.")))), state === 'done' && rows.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 6
  }, /*#__PURE__*/React.createElement("div", {
    className: "placeholder",
    style: {
      padding: '32px 16px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "inbox",
    size: 26,
    stroke: 1.6
  }), /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, "\u041F\u0440\u043E\u0433\u043D\u043E\u0437\u043E\u0432 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442")))), state === 'done' && rows.map(r => {
    const pct = Math.round(r.failure_probability * 100);
    const barColor = r.failure_probability < 0.3 ? 'var(--healthy-600)' : r.failure_probability < 0.6 ? 'var(--warning-600)' : 'var(--critical-600)';
    return /*#__PURE__*/React.createElement("tr", {
      key: r.id
    }, /*#__PURE__*/React.createElement("td", {
      className: "t-time",
      title: new Date(r.created_at).toLocaleString()
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--fg1)',
        fontWeight: 500
      }
    }, clock(r.created_at)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--fg4)'
      }
    }, timeAgo(r.created_at))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "ptype"
    }, r.product_type)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: 'statuscell ' + (r.is_failure ? 'statuscell--fail' : 'statuscell--ok')
    }, /*#__PURE__*/React.createElement("span", {
      className: "d"
    }), r.is_failure ? 'Отказ' : 'Норма')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "probcell"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono",
      style: {
        width: 38
      }
    }, pct, "%"), /*#__PURE__*/React.createElement("span", {
      className: "bar"
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: pct + '%',
        background: barColor
      }
    })))), /*#__PURE__*/React.createElement("td", null, r.failure_type ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--fg2)'
      }
    }, r.failure_type) : /*#__PURE__*/React.createElement("span", {
      className: "dash"
    }, "\u2014")), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right'
      },
      className: "mono"
    }, Math.round(r.rotational_speed), " ", /*#__PURE__*/React.createElement("span", {
      className: "muted"
    }, "/"), " ", r.torque));
  })))));
}
window.HistoryTable = HistoryTable;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/HistoryTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Icon.jsx
try { (() => {
/* Icon — renders icons from the Lucide set (MIT). 24×24 grid, 2px stroke.
   Path data is lifted verbatim from lucide.dev so the kit matches the
   documented iconography without a network dependency. */
const LUCIDE = {
  activity: 'M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2',
  gauge: 'M12 14l4-4|M3.34 19a10 10 0 1 1 17.32 0',
  cpu: 'M12 20v2|M12 2v2|M17 20v2|M17 2v2|M2 12h2|M2 17h2|M2 7h2|M20 12h2|M20 17h2|M20 7h2|M7 20v2|M7 2v2|@rect:4,4,16,16,2|@rect:8,8,8,8,1',
  thermometer: 'M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z',
  zap: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z',
  wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  history: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8|M3 3v5h5|M12 7v5l4 2',
  sun: 'M12 2v2|M12 20v2|M4.93 4.93l1.41 1.41|M17.66 17.66l1.41 1.41|M2 12h2|M20 12h2|M6.34 17.66l-1.41 1.41|M19.07 4.93l-1.41 1.41|@circle:12,12,4',
  moon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
  check: 'M20 6L9 17l-5-5',
  'check-circle': 'M21.801 10A10 10 0 1 1 17 3.335|M9 11l3 3L22 4',
  x: 'M18 6L6 18|M6 6l12 12',
  'alert-triangle': 'M21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z|M12 9v4|@dot:12,17',
  'alert-circle': '@circle:12,12,10|M12 8v4|@dot:12,16',
  'rotate-cw': 'M21 12a9 9 0 1 1-2.64-6.36L21 8|M21 3v5h-5',
  sliders: 'M4 21v-7|M4 10V3|M12 21v-9|M12 8V3|M20 21v-5|M20 12V3|M2 14h4|M10 8h4|M18 16h4',
  thermo2: 'M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z',
  database: 'M5 12a7 3 0 0 0 14 0|M5 5a7 3 0 0 0 14 0|@ellipse:12,5,7,3|M5 5v14a7 3 0 0 0 14 0V5',
  server: '@rect:2,2,20,8,2|@rect:2,14,20,8,2|M6 6h.01|M6 18h.01',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M7 10l5 5 5-5|M12 15V3',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2|M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  flame: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'
};
function Icon({
  name,
  size = 18,
  stroke = 2,
  className = '',
  style = {}
}) {
  const raw = LUCIDE[name];
  if (!raw) return null;
  const parts = raw.split('|');
  const els = [];
  parts.forEach((p, i) => {
    if (p.startsWith('@rect:')) {
      const [x, y, w, h, r] = p.slice(6).split(',').map(Number);
      els.push(/*#__PURE__*/React.createElement("rect", {
        key: i,
        x: x,
        y: y,
        width: w,
        height: h,
        rx: r
      }));
    } else if (p.startsWith('@circle:')) {
      const [cx, cy, r] = p.slice(8).split(',').map(Number);
      els.push(/*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: cx,
        cy: cy,
        r: r
      }));
    } else if (p.startsWith('@ellipse:')) {
      const [cx, cy, rx, ry] = p.slice(9).split(',').map(Number);
      els.push(/*#__PURE__*/React.createElement("ellipse", {
        key: i,
        cx: cx,
        cy: cy,
        rx: rx,
        ry: ry
      }));
    } else if (p.startsWith('@dot:')) {
      const [cx, cy] = p.slice(5).split(',').map(Number);
      els.push(/*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: cx,
        cy: cy,
        r: 0.6,
        fill: "currentColor",
        stroke: "none"
      }));
    } else {
      els.push(/*#__PURE__*/React.createElement("path", {
        key: i,
        d: p
      }));
    }
  });
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: style,
    "aria-hidden": "true"
  }, els);
}
window.Icon = Icon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Icon.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/InputForm.jsx
try { (() => {
/* InputForm — 6 fields per PredictionRequest. Inline range hints, min/max,
   per-field errors mapped from a 422 envelope's details[].field. */
const {
  useState
} = React;
const NUM_FIELDS = [{
  key: 'rotational_speed',
  label: 'Скорость вращения',
  icon: 'rotate-cw',
  step: 1
}, {
  key: 'torque',
  label: 'Крутящий момент',
  icon: 'wrench',
  step: 0.1
}, {
  key: 'tool_wear',
  label: 'Износ инструмента',
  icon: 'history',
  step: 1
}, {
  key: 'air_temperature',
  label: 'Темп. воздуха',
  icon: 'thermometer',
  step: 0.1
}, {
  key: 'process_temperature',
  label: 'Темп. процесса',
  icon: 'flame',
  step: 0.1
}];
function InputForm({
  onSubmit,
  loading,
  fieldErrors,
  onClear
}) {
  const R = window.PM_RANGES;
  const [vals, setVals] = useState({
    rotational_speed: 1551,
    torque: 42.8,
    tool_wear: 108,
    air_temperature: 298.1,
    process_temperature: 308.6,
    product_type: 'M'
  });
  const set = (k, v) => setVals(s => ({
    ...s,
    [k]: v
  }));
  const submit = e => {
    e.preventDefault();
    onSubmit(vals);
  };
  const loadExample = () => setVals({
    rotational_speed: 1372,
    torque: 68.1,
    tool_wear: 210,
    air_temperature: 302.9,
    process_temperature: 305.4,
    product_type: 'L'
  });
  return /*#__PURE__*/React.createElement("form", {
    className: "card",
    onSubmit: submit,
    noValidate: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "\u041D\u043E\u0432\u044B\u0439 \u043F\u0440\u043E\u0433\u043D\u043E\u0437"), /*#__PURE__*/React.createElement("div", {
    className: "card__sub"
  }, "POST /predict \xB7 PredictionRequest")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "iconbtn",
    title: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043F\u0440\u0438\u043C\u0435\u0440",
    onClick: loadExample
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "inbox",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, NUM_FIELDS.map(f => {
    const r = R[f.key];
    const err = fieldErrors && fieldErrors[f.key];
    return /*#__PURE__*/React.createElement("div", {
      className: "field",
      key: f.key
    }, /*#__PURE__*/React.createElement("div", {
      className: "field__label"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lab gap2"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: f.icon,
      size: 14,
      style: {
        color: 'var(--fg4)'
      }
    }), f.label), /*#__PURE__*/React.createElement("span", {
      className: "field__range"
    }, r.min, "\u2013", r.max, " ", r.unit)), /*#__PURE__*/React.createElement("input", {
      className: 'input' + (err ? ' is-error' : ''),
      type: "number",
      inputMode: "decimal",
      step: f.step,
      min: r.min,
      max: r.max,
      value: vals[f.key],
      onChange: e => set(f.key, e.target.value),
      "aria-invalid": !!err
    }), err && /*#__PURE__*/React.createElement("div", {
      className: "field__err"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "alert-circle",
      size: 13
    }), err));
  }), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab gap2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cpu",
    size: 14,
    style: {
      color: 'var(--fg4)'
    }
  }), "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430"), /*#__PURE__*/React.createElement("span", {
    className: "field__range"
  }, "\u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430")), /*#__PURE__*/React.createElement("div", {
    className: "seg",
    role: "tablist"
  }, [['L', 'Низкий'], ['M', 'Средний'], ['H', 'Высокий']].map(([t, name]) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: t,
    role: "tab",
    className: vals.product_type === t ? 'is-on' : '',
    onClick: () => set('product_type', t)
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, t), " ", name))), fieldErrors && fieldErrors.product_type && /*#__PURE__*/React.createElement("div", {
    className: "field__err"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-circle",
    size: 13
  }), fieldErrors.product_type)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary btn--block",
    type: "submit",
    disabled: loading,
    style: {
      marginTop: 4
    }
  }, loading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "spin"
  }), " \u041F\u0440\u043E\u0433\u043D\u043E\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435\u2026") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "activity",
    size: 16
  }), " \u0421\u043F\u0440\u043E\u0433\u043D\u043E\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043E\u0442\u043A\u0430\u0437"))));
}
window.InputForm = InputForm;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/InputForm.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/ProbabilityGauge.jsx
try { (() => {
/* ProbabilityGauge — semicircular failure-probability gauge.
   Hand-built SVG arc (real build: recharts RadialBar). value in 0..1. */
function ProbabilityGauge({
  value = 0,
  size = 220
}) {
  const v = Math.max(0, Math.min(1, value));
  const w = size,
    h = size * 0.62;
  const cx = w / 2,
    cy = h - 6,
    R = w / 2 - 16,
    sw = 16;
  const polar = frac => {
    const a = Math.PI * (1 - frac); // 180°→0°
    return [cx + R * Math.cos(a), cy - R * Math.sin(a)];
  };
  const arc = (f0, f1) => {
    const [x0, y0] = polar(f0),
      [x1, y1] = polar(f1);
    const large = f1 - f0 > 0.5 ? 1 : 0;
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`;
  };
  // color by zone
  const zoneColor = v < 0.3 ? 'var(--healthy-600)' : v < 0.6 ? 'var(--warning-600)' : 'var(--critical-600)';
  const [nx, ny] = polar(v);
  const pct = Math.round(v * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "gauge"
  }, /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h + 10,
    viewBox: `0 0 ${w} ${h + 10}`
  }, /*#__PURE__*/React.createElement("path", {
    d: arc(0, 0.3),
    stroke: "var(--healthy-600)",
    strokeOpacity: "0.18",
    strokeWidth: sw,
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: arc(0.3, 0.6),
    stroke: "var(--warning-600)",
    strokeOpacity: "0.18",
    strokeWidth: sw,
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: arc(0.6, 1),
    stroke: "var(--critical-600)",
    strokeOpacity: "0.18",
    strokeWidth: sw,
    fill: "none",
    strokeLinecap: "round"
  }), v > 0.001 && /*#__PURE__*/React.createElement("path", {
    d: arc(0, v),
    stroke: zoneColor,
    strokeWidth: sw,
    fill: "none",
    strokeLinecap: "round",
    style: {
      transition: 'stroke 200ms'
    }
  }), /*#__PURE__*/React.createElement("circle", {
    cx: nx,
    cy: ny,
    r: 6.5,
    fill: "var(--bg-surface)",
    stroke: zoneColor,
    strokeWidth: "3.5"
  }), (() => {
    const [tx, ty] = polar(0.5);
    const [ix, iy] = [cx + (R - sw / 2 - 3) * Math.cos(Math.PI * 0.5), cy - (R - sw / 2 - 3) * Math.sin(Math.PI * 0.5)];
    return /*#__PURE__*/React.createElement("line", {
      x1: ix,
      y1: iy,
      x2: tx + (tx - cx) * 0.04,
      y2: ty + (ty - cy) * 0.04,
      stroke: "var(--fg4)",
      strokeWidth: "2"
    });
  })()), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: -size * 0.18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gauge__readout",
    style: {
      color: zoneColor
    }
  }, pct, /*#__PURE__*/React.createElement("span", {
    className: "gauge__pct"
  }, "%")), /*#__PURE__*/React.createElement("div", {
    className: "gauge__cap"
  }, "\u0412\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044C \u043E\u0442\u043A\u0430\u0437\u0430")));
}
window.ProbabilityGauge = ProbabilityGauge;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/ProbabilityGauge.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/ResultCard.jsx
try { (() => {
/* ResultCard — verdict (Норма/Отказ), failure type, probability, inference time.
   Plus empty / loading / error states. */

function ResultCard({
  state,
  result,
  error,
  input
}) {
  // state: 'empty' | 'loading' | 'error' | 'done'
  return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043F\u0440\u043E\u0433\u043D\u043E\u0437\u0430"), /*#__PURE__*/React.createElement("div", {
    className: "card__sub"
  }, "PredictionResponse")), state === 'done' && result && /*#__PURE__*/React.createElement("span", {
    className: "ds-code",
    style: {
      color: 'var(--fg4)'
    }
  }, "#", result.id.slice(0, 8))), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, state === 'empty' && /*#__PURE__*/React.createElement("div", {
    className: "placeholder"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "activity",
    size: 34,
    stroke: 1.6
  }), /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, "\u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u0435\u0449\u0451 \u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D"), /*#__PURE__*/React.createElement("div", {
    className: "d"
  }, "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043A\u0443\u0449\u0438\u0435 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0438\u044F \u0434\u0430\u0442\u0447\u0438\u043A\u043E\u0432 \u0438 \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u043F\u0440\u043E\u0433\u043D\u043E\u0437, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0440\u0438\u0441\u043A \u043E\u0442\u043A\u0430\u0437\u0430 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F.")), state === 'loading' && /*#__PURE__*/React.createElement("div", {
    className: "result"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sk",
    style: {
      height: 86
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "stat-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sk",
    style: {
      height: 78
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk",
    style: {
      height: 78
    }
  }))), state === 'error' && /*#__PURE__*/React.createElement("div", {
    className: "placeholder"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: error?.code === 'service_unavailable' ? 'server' : 'alert-triangle',
    size: 32,
    stroke: 1.6,
    style: {
      color: 'var(--critical-600)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "t",
    style: {
      color: 'var(--fg2)'
    }
  }, error?.code === 'service_unavailable' ? 'Сервис временно недоступен' : error?.code === 'validation_error' ? 'Проверьте введённые значения' : 'Не удалось получить прогноз'), /*#__PURE__*/React.createElement("div", {
    className: "d"
  }, error?.message)), state === 'done' && result && /*#__PURE__*/React.createElement(Verdict, {
    result: result
  })));
}
function Verdict({
  result
}) {
  const fail = result.is_failure;
  const pct = Math.round(result.failure_probability * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "result"
  }, /*#__PURE__*/React.createElement("div", {
    className: 'verdict ' + (fail ? 'verdict--fail' : 'verdict--ok')
  }, /*#__PURE__*/React.createElement("div", {
    className: "verdict__icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: fail ? 'alert-triangle' : 'check',
    size: 24,
    stroke: 2.4,
    style: {
      color: '#fff'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "verdict__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "verdict__status"
  }, fail ? 'Отказ' : 'Норма'), /*#__PURE__*/React.createElement("div", {
    className: "verdict__sub"
  }, fail ? 'Прогнозируется отказ — запланируйте обслуживание' : 'Отказ не прогнозируется — оборудование в норме')), /*#__PURE__*/React.createElement("div", {
    className: 'ftype ' + (fail ? 'ftype--fail' : 'ftype--none')
  }, /*#__PURE__*/React.createElement("span", {
    className: "d"
  }), result.failure_type || 'Без отказа')), /*#__PURE__*/React.createElement("div", {
    className: "stat-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "\u0412\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044C \u043E\u0442\u043A\u0430\u0437\u0430"), /*#__PURE__*/React.createElement("div", {
    className: "v",
    style: {
      color: fail ? 'var(--critical-600)' : 'var(--healthy-600)'
    }
  }, pct, /*#__PURE__*/React.createElement("small", null, "%"))), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "\u0412\u0440\u0435\u043C\u044F \u0438\u043D\u0444\u0435\u0440\u0435\u043D\u0441\u0430"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, result.inference_time_ms, /*#__PURE__*/React.createElement("small", null, "\u043C\u0441")))));
}
window.ResultCard = ResultCard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/ResultCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/app.jsx
try { (() => {
/* app — composes the operator dashboard and owns all request state.
   Each request has its own loading + error state, per the brief. */
const {
  useEffect
} = React;
function parseErr(e) {
  // accepts the brief's envelope: { error: { code, message, details } }
  if (e && e.error) {
    const fe = {};
    (e.error.details || []).forEach(d => {
      fe[d.field] = d.message;
    });
    return {
      code: e.error.code,
      message: e.error.message,
      fieldErrors: fe
    };
  }
  return {
    code: 'internal_error',
    message: 'Unexpected error.',
    fieldErrors: {}
  };
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
    rotational_speed: 1551,
    torque: 42.8,
    tool_wear: 108,
    air_temperature: 298.1,
    process_temperature: 308.6,
    product_type: 'M'
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
    window.mockApi.getHistory({
      source: src,
      limit: 50
    }).then(r => {
      setRows(r);
      setHistState('done');
    }).catch(() => setHistState('error'));
  };
  const loadHealth = () => {
    setHealthState('loading');
    window.mockApi.getHealth().then(h => {
      setHealth(h);
      setHealthState('done');
    }).catch(() => setHealthState('error'));
  };
  useEffect(() => {
    loadHistory('redis');
    loadHealth();
  }, []);
  const runPredict = input => {
    setLastInput(input);
    setPredState('loading');
    setPredError(null);
    setFieldErrors({});
    window.mockApi.predict(input).then(res => {
      setResult(res);
      setPredState('done');
      loadHistory();
    }).catch(e => {
      const p = parseErr(e);
      setFieldErrors(p.fieldErrors);
      if (p.code === 'validation_error') {
        setPredState('empty');
      } else {
        setPredError(p);
        setPredState('error');
      }
    });
  };
  const changeSource = src => {
    setSource(src);
    loadHistory(src);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(Header, {
    health: health,
    healthState: healthState,
    theme: theme,
    onToggleTheme: () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  }), /*#__PURE__*/React.createElement("main", {
    className: "main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-left"
  }, /*#__PURE__*/React.createElement(InputForm, {
    onSubmit: runPredict,
    loading: predState === 'loading',
    fieldErrors: fieldErrors
  }), Object.keys(fieldErrors).length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "banner banner--warn",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle",
    size: 16
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u0438."), " \u041D\u0435\u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u0432\u043D\u0435 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0433\u043E \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0430 \u2014 \u0441\u043C. \u043F\u043E\u0434\u0441\u0432\u0435\u0447\u0435\u043D\u043D\u044B\u0435 \u043F\u043E\u043B\u044F."))), /*#__PURE__*/React.createElement("div", {
    className: "col-right"
  }, /*#__PURE__*/React.createElement(ResultCard, {
    state: predState,
    result: result,
    error: predError,
    input: lastInput
  }), /*#__PURE__*/React.createElement("div", {
    className: "duo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "\u0428\u043A\u0430\u043B\u0430 \u0440\u0438\u0441\u043A\u0430")), /*#__PURE__*/React.createElement("div", {
    className: "card__body",
    style: {
      display: 'grid',
      placeItems: 'center',
      minHeight: 200
    }
  }, /*#__PURE__*/React.createElement(ProbabilityGauge, {
    value: predState === 'done' && result ? result.failure_probability : 0
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__title"
  }, "\u0412\u0432\u0435\u0434\u0451\u043D\u043D\u044B\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u043A\u0438"), /*#__PURE__*/React.createElement("div", {
    className: "card__sub"
  }, "\u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u043D\u043E\u0440\u043C\u044B")), /*#__PURE__*/React.createElement("div", {
    className: "card__body"
  }, /*#__PURE__*/React.createElement(FeatureBarChart, {
    values: lastInput
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(HistoryTable, {
    rows: rows,
    state: histState,
    source: source,
    onSource: changeSource,
    onRefresh: () => loadHistory(),
    loading: histState === 'loading'
  })), /*#__PURE__*/React.createElement(DevBar, {
    onHealth: loadHealth,
    reloadHistory: loadHistory
  })));
}

/* Small dev strip to demo the error/health states the brief asks for. */
function DevBar({
  onHealth,
  reloadHistory
}) {
  const [open, setOpen] = useState(false);
  const setErr = v => {
    window.__forceError = v;
  };
  const setHealth = v => {
    window.__forceHealth = v;
    onHealth();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "iconbtn",
    onClick: () => setOpen(o => !o),
    title: "\u0414\u0435\u043C\u043E-\u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sliders",
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "\u0414\u0435\u043C\u043E-\u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F"), open && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "\u0421\u043B\u0435\u0434. \u043F\u0440\u043E\u0433\u043D\u043E\u0437 \u2192"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    style: {
      height: 28,
      fontSize: 12,
      padding: '0 10px'
    },
    onClick: () => setErr(null)
  }, "OK"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    style: {
      height: 28,
      fontSize: 12,
      padding: '0 10px'
    },
    onClick: () => setErr('503')
  }, "503"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    style: {
      height: 28,
      fontSize: 12,
      padding: '0 10px'
    },
    onClick: () => setErr('500')
  }, "500"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 18,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "\u0421\u0435\u0440\u0432\u0438\u0441"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    style: {
      height: 28,
      fontSize: 12,
      padding: '0 10px'
    },
    onClick: () => setHealth(null)
  }, "ok"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost",
    style: {
      height: 28,
      fontSize: 12,
      padding: '0 10px'
    },
    onClick: () => setHealth('degraded')
  }, "degraded"))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/mockApi.jsx
try { (() => {
/* mockApi — stands in for the FastAPI backend so the kit is interactive offline.
   Mirrors openapi.json schemas exactly and the error envelope from the brief:
     { error: { code, message, details?: [{ field, message }] } }
   A real client (api/predict.ts etc.) would hit POST /predict, GET /history,
   GET /health via axios against VITE_API_URL. Swap mockApi.* for those. */

const RANGES = {
  rotational_speed: {
    min: 1168,
    max: 2886,
    unit: 'об/мин',
    normal: [1300, 2100]
  },
  torque: {
    min: 3.8,
    max: 76.6,
    unit: 'Н·м',
    normal: [25, 55]
  },
  tool_wear: {
    min: 0,
    max: 253,
    unit: 'мин',
    normal: [0, 180]
  },
  air_temperature: {
    min: 295,
    max: 305,
    unit: 'K',
    normal: [297, 302]
  },
  process_temperature: {
    min: 305,
    max: 314,
    unit: 'K',
    normal: [307, 311]
  }
};
const FIELD_ORDER = ['rotational_speed', 'torque', 'tool_wear', 'air_temperature', 'process_temperature'];
const FAILURE_TYPES = ['Отказ теплоотвода', 'Отказ по мощности', 'Перегрузка', 'Износ инструмента', 'Случайный отказ'];
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
});
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sig = x => 1 / (1 + Math.exp(-x));

/* Physics-informed risk — mirrors the dataset's documented failure modes so the
   gauge responds sensibly to inputs (not a real model; deterministic-ish). */
function score(inp) {
  const power = inp.rotational_speed * (2 * Math.PI / 60) * inp.torque; // watts
  const dT = inp.process_temperature - inp.air_temperature;
  const owThresh = {
    L: 11000,
    M: 12000,
    H: 13000
  }[inp.product_type] || 12000;
  const strain = inp.tool_wear * inp.torque;
  const contrib = {
    'Отказ по мощности': (power < 3500 ? (3500 - power) / 3500 : power > 9000 ? (power - 9000) / 4000 : 0) * 2.6,
    'Отказ теплоотвода': dT < 8.6 && inp.rotational_speed < 1380 ? 2.4 : Math.max(0, 8.6 - dT) / 8.6 * 1.2,
    'Перегрузка': strain > owThresh ? (strain - owThresh) / owThresh * 3.0 : 0,
    'Износ инструмента': inp.tool_wear > 200 ? (inp.tool_wear - 200) / 53 * 1.4 : 0,
    'Случайный отказ': 0.04
  };
  let top = 'Случайный отказ',
    topV = -1;
  for (const k in contrib) if (contrib[k] > topV) {
    topV = contrib[k];
    top = k;
  }
  const raw = Object.values(contrib).reduce((a, b) => a + b, 0);
  const p = sig(raw * 1.15 - 2.35);
  return {
    p,
    top,
    topV
  };
}
const mockApi = {
  ranges: RANGES,
  fieldOrder: FIELD_ORDER,
  async predict(input) {
    await sleep(620 + Math.random() * 420);
    // client-side range validation → 422 envelope (server enforces same bounds)
    const details = [];
    for (const f of FIELD_ORDER) {
      const r = RANGES[f];
      const v = input[f];
      if (v === '' || v === null || v === undefined || Number.isNaN(Number(v))) details.push({
        field: f,
        message: 'Обязательное поле'
      });else if (Number(v) < r.min || Number(v) > r.max) details.push({
        field: f,
        message: `Допустимо от ${r.min} до ${r.max} ${r.unit}`
      });
    }
    if (!['L', 'M', 'H'].includes(input.product_type)) details.push({
      field: 'product_type',
      message: 'Выберите категорию'
    });
    if (details.length) throw {
      error: {
        code: 'validation_error',
        message: 'Ошибка валидации.',
        details
      }
    };

    // simulated outages
    if (window.__forceError === '503') throw {
      error: {
        code: 'service_unavailable',
        message: 'Сервис временно недоступен.'
      }
    };
    if (window.__forceError === '500') throw {
      error: {
        code: 'internal_error',
        message: 'Внутренняя ошибка сервера.'
      }
    };
    const num = {};
    FIELD_ORDER.forEach(f => num[f] = Number(input[f]));
    const s = score({
      ...num,
      product_type: input.product_type
    });
    const is_failure = s.p >= 0.5;
    const resp = {
      id: uuid(),
      is_failure,
      failure_probability: Math.round(s.p * 1000) / 1000,
      failure_type: is_failure ? s.top : null,
      inference_time_ms: Math.round((7 + Math.random() * 11) * 10) / 10,
      created_at: new Date().toISOString()
    };
    HISTORY.unshift({
      ...num,
      product_type: input.product_type,
      id: resp.id,
      created_at: resp.created_at,
      is_failure,
      failure_probability: resp.failure_probability,
      failure_type: resp.failure_type
    });
    if (HISTORY.length > 200) HISTORY.pop();
    return resp;
  },
  async getHistory({
    source = 'redis',
    limit = 50,
    offset = 0
  } = {}) {
    await sleep(360 + Math.random() * 260);
    if (window.__forceError === 'history503') throw {
      error: {
        code: 'service_unavailable',
        message: 'Сервис временно недоступен.'
      }
    };
    return HISTORY.slice(offset, offset + limit);
  },
  async getHealth() {
    await sleep(220);
    if (window.__forceHealth === 'degraded') return {
      status: 'degraded',
      models: true,
      database: true,
      redis: false
    };
    if (window.__forceHealth === 'down') return {
      status: 'degraded',
      models: false,
      database: false,
      redis: false
    };
    return {
      status: 'ok',
      models: true,
      database: true,
      redis: true
    };
  }
};

/* ---- seed history so the table is populated on load --------------------- */
const SEED = [['H', 2861, 4.6, 12, 300.1, 309.4, true, 0.91, 'Отказ по мощности', 9], ['L', 1372, 68.1, 210, 302.9, 305.4, true, 0.87, 'Отказ теплоотвода', 22], ['M', 1551, 42.8, 108, 298.1, 308.6, false, 0.04, null, 41], ['L', 1305, 55.2, 221, 298.4, 308.9, true, 0.72, 'Перегрузка', 58], ['M', 1410, 46.0, 203, 299.0, 309.2, false, 0.31, null, 77], ['H', 2100, 33.4, 15, 297.6, 307.1, false, 0.02, null, 96], ['L', 1455, 49.5, 240, 300.2, 310.0, true, 0.63, 'Износ инструмента', 120], ['M', 1620, 38.7, 142, 298.8, 308.5, false, 0.06, null, 165], ['M', 1788, 29.1, 64, 296.9, 306.8, false, 0.03, null, 210], ['L', 1198, 71.0, 95, 303.0, 305.4, true, 0.55, 'Отказ по мощности', 254]];
const HISTORY = SEED.map(([pt, rs, tq, tw, at, pp, fail, prob, ft, minsAgo]) => ({
  id: uuid(),
  created_at: new Date(Date.now() - minsAgo * 60000).toISOString(),
  product_type: pt,
  rotational_speed: rs,
  torque: tq,
  tool_wear: tw,
  air_temperature: at,
  process_temperature: pp,
  is_failure: fail,
  failure_probability: prob,
  failure_type: ft
}));
window.mockApi = mockApi;
window.PM_RANGES = RANGES;
window.PM_FIELD_ORDER = FIELD_ORDER;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/mockApi.jsx", error: String((e && e.message) || e) }); }

})();
