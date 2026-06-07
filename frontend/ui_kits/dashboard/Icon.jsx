/* Icon — renders icons from the Lucide set (MIT). 24×24 grid, 2px stroke.
   Path data is lifted verbatim from lucide.dev so the kit matches the
   documented iconography without a network dependency. */
const LUCIDE = {
  activity:    'M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2',
  gauge:       'M12 14l4-4|M3.34 19a10 10 0 1 1 17.32 0',
  cpu:         'M12 20v2|M12 2v2|M17 20v2|M17 2v2|M2 12h2|M2 17h2|M2 7h2|M20 12h2|M20 17h2|M20 7h2|M7 20v2|M7 2v2|@rect:4,4,16,16,2|@rect:8,8,8,8,1',
  thermometer: 'M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z',
  zap:         'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z',
  wrench:      'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  history:     'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8|M3 3v5h5|M12 7v5l4 2',
  sun:         'M12 2v2|M12 20v2|M4.93 4.93l1.41 1.41|M17.66 17.66l1.41 1.41|M2 12h2|M20 12h2|M6.34 17.66l-1.41 1.41|M19.07 4.93l-1.41 1.41|@circle:12,12,4',
  moon:        'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
  check:       'M20 6L9 17l-5-5',
  'check-circle': 'M21.801 10A10 10 0 1 1 17 3.335|M9 11l3 3L22 4',
  x:           'M18 6L6 18|M6 6l12 12',
  'alert-triangle': 'M21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z|M12 9v4|@dot:12,17',
  'alert-circle': '@circle:12,12,10|M12 8v4|@dot:12,16',
  'rotate-cw':  'M21 12a9 9 0 1 1-2.64-6.36L21 8|M21 3v5h-5',
  sliders:     'M4 21v-7|M4 10V3|M12 21v-9|M12 8V3|M20 21v-5|M20 12V3|M2 14h4|M10 8h4|M18 16h4',
  thermo2:     'M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z',
  database:    'M5 12a7 3 0 0 0 14 0|M5 5a7 3 0 0 0 14 0|@ellipse:12,5,7,3|M5 5v14a7 3 0 0 0 14 0V5',
  server:      '@rect:2,2,20,8,2|@rect:2,14,20,8,2|M6 6h.01|M6 18h.01',
  download:    'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M7 10l5 5 5-5|M12 15V3',
  inbox:       'M22 12h-6l-2 3h-4l-2-3H2|M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  flame:       'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
};

function Icon({ name, size = 18, stroke = 2, className = '', style = {} }) {
  const raw = LUCIDE[name];
  if (!raw) return null;
  const parts = raw.split('|');
  const els = [];
  parts.forEach((p, i) => {
    if (p.startsWith('@rect:')) {
      const [x, y, w, h, r] = p.slice(6).split(',').map(Number);
      els.push(<rect key={i} x={x} y={y} width={w} height={h} rx={r} />);
    } else if (p.startsWith('@circle:')) {
      const [cx, cy, r] = p.slice(8).split(',').map(Number);
      els.push(<circle key={i} cx={cx} cy={cy} r={r} />);
    } else if (p.startsWith('@ellipse:')) {
      const [cx, cy, rx, ry] = p.slice(9).split(',').map(Number);
      els.push(<ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} />);
    } else if (p.startsWith('@dot:')) {
      const [cx, cy] = p.slice(5).split(',').map(Number);
      els.push(<circle key={i} cx={cx} cy={cy} r={0.6} fill="currentColor" stroke="none" />);
    } else {
      els.push(<path key={i} d={p} />);
    }
  });
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      {els}
    </svg>
  );
}

window.Icon = Icon;
