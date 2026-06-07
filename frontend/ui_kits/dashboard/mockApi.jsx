/* mockApi — stands in for the FastAPI backend so the kit is interactive offline.
   Mirrors openapi.json schemas exactly and the error envelope from the brief:
     { error: { code, message, details?: [{ field, message }] } }
   A real client (api/predict.ts etc.) would hit POST /predict, GET /history,
   GET /health via axios against VITE_API_URL. Swap mockApi.* for those. */

const RANGES = {
  rotational_speed:   { min: 1168, max: 2886, unit: 'об/мин', normal: [1300, 2100] },
  torque:             { min: 3.8,  max: 76.6, unit: 'Н·м',  normal: [25, 55] },
  tool_wear:          { min: 0,    max: 253,  unit: 'мин', normal: [0, 180] },
  air_temperature:    { min: 295,  max: 305,  unit: 'K',   normal: [297, 302] },
  process_temperature:{ min: 305,  max: 314,  unit: 'K',   normal: [307, 311] },
};
const FIELD_ORDER = ['rotational_speed','torque','tool_wear','air_temperature','process_temperature'];
const FAILURE_TYPES = ['Отказ теплоотвода','Отказ по мощности','Перегрузка','Износ инструмента','Случайный отказ'];

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0; return (c==='x'? r : (r&0x3|0x8)).toString(16);
});
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sig = x => 1/(1+Math.exp(-x));

/* Physics-informed risk — mirrors the dataset's documented failure modes so the
   gauge responds sensibly to inputs (not a real model; deterministic-ish). */
function score(inp) {
  const power = inp.rotational_speed * (2*Math.PI/60) * inp.torque; // watts
  const dT = inp.process_temperature - inp.air_temperature;
  const owThresh = { L: 11000, M: 12000, H: 13000 }[inp.product_type] || 12000;
  const strain = inp.tool_wear * inp.torque;

  const contrib = {
    'Отказ по мощности':  (power < 3500 ? (3500-power)/3500 : power > 9000 ? (power-9000)/4000 : 0) * 2.6,
    'Отказ теплоотвода':  (dT < 8.6 && inp.rotational_speed < 1380) ? 2.4 : Math.max(0,(8.6-dT))/8.6*1.2,
    'Перегрузка':         strain > owThresh ? (strain-owThresh)/owThresh*3.0 : 0,
    'Износ инструмента':  inp.tool_wear > 200 ? (inp.tool_wear-200)/53*1.4 : 0,
    'Случайный отказ':    0.04,
  };
  let top = 'Случайный отказ', topV = -1;
  for (const k in contrib) if (contrib[k] > topV) { topV = contrib[k]; top = k; }
  const raw = Object.values(contrib).reduce((a,b)=>a+b,0);
  const p = sig(raw*1.15 - 2.35);
  return { p, top, topV };
}

const mockApi = {
  ranges: RANGES,
  fieldOrder: FIELD_ORDER,

  async predict(input) {
    await sleep(620 + Math.random()*420);
    // client-side range validation → 422 envelope (server enforces same bounds)
    const details = [];
    for (const f of FIELD_ORDER) {
      const r = RANGES[f]; const v = input[f];
      if (v === '' || v === null || v === undefined || Number.isNaN(Number(v)))
        details.push({ field: f, message: 'Обязательное поле' });
      else if (Number(v) < r.min || Number(v) > r.max)
        details.push({ field: f, message: `Допустимо от ${r.min} до ${r.max} ${r.unit}` });
    }
    if (!['L','M','H'].includes(input.product_type))
      details.push({ field: 'product_type', message: 'Выберите категорию' });
    if (details.length)
      throw { error: { code: 'validation_error', message: 'Ошибка валидации.', details } };

    // simulated outages
    if (window.__forceError === '503')
      throw { error: { code: 'service_unavailable', message: 'Сервис временно недоступен.' } };
    if (window.__forceError === '500')
      throw { error: { code: 'internal_error', message: 'Внутренняя ошибка сервера.' } };

    const num = {}; FIELD_ORDER.forEach(f => num[f] = Number(input[f]));
    const s = score({ ...num, product_type: input.product_type });
    const is_failure = s.p >= 0.5;
    const resp = {
      id: uuid(),
      is_failure,
      failure_probability: Math.round(s.p*1000)/1000,
      failure_type: is_failure ? s.top : null,
      inference_time_ms: Math.round((7 + Math.random()*11)*10)/10,
      created_at: new Date().toISOString(),
    };
    HISTORY.unshift({ ...num, product_type: input.product_type,
      id: resp.id, created_at: resp.created_at, is_failure,
      failure_probability: resp.failure_probability, failure_type: resp.failure_type });
    if (HISTORY.length > 200) HISTORY.pop();
    return resp;
  },

  async getHistory({ source = 'redis', limit = 50, offset = 0 } = {}) {
    await sleep(360 + Math.random()*260);
    if (window.__forceError === 'history503')
      throw { error: { code: 'service_unavailable', message: 'Сервис временно недоступен.' } };
    return HISTORY.slice(offset, offset + limit);
  },

  async getHealth() {
    await sleep(220);
    if (window.__forceHealth === 'degraded')
      return { status: 'degraded', models: true, database: true, redis: false };
    if (window.__forceHealth === 'down')
      return { status: 'degraded', models: false, database: false, redis: false };
    return { status: 'ok', models: true, database: true, redis: true };
  },
};

/* ---- seed history so the table is populated on load --------------------- */
const SEED = [
  ['H',2861,4.6,12, 300.1,309.4, true, 0.91,'Отказ по мощности', 9],
  ['L',1372,68.1,210,302.9,305.4, true, 0.87,'Отказ теплоотвода', 22],
  ['M',1551,42.8,108,298.1,308.6, false,0.04,null, 41],
  ['L',1305,55.2,221,298.4,308.9, true, 0.72,'Перегрузка', 58],
  ['M',1410,46.0,203,299.0,309.2, false,0.31,null, 77],
  ['H',2100,33.4,15, 297.6,307.1, false,0.02,null, 96],
  ['L',1455,49.5,240,300.2,310.0, true, 0.63,'Износ инструмента', 120],
  ['M',1620,38.7,142,298.8,308.5, false,0.06,null, 165],
  ['M',1788,29.1,64, 296.9,306.8, false,0.03,null, 210],
  ['L',1198,71.0,95, 303.0,305.4, true, 0.55,'Отказ по мощности', 254],
];
const HISTORY = SEED.map(([pt,rs,tq,tw,at,pp,fail,prob,ft,minsAgo]) => ({
  id: uuid(),
  created_at: new Date(Date.now() - minsAgo*60000).toISOString(),
  product_type: pt, rotational_speed: rs, torque: tq, tool_wear: tw,
  air_temperature: at, process_temperature: pp,
  is_failure: fail, failure_probability: prob, failure_type: ft,
}));

window.mockApi = mockApi;
window.PM_RANGES = RANGES;
window.PM_FIELD_ORDER = FIELD_ORDER;
