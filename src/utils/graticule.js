// Gratícula (paralelos e meridianos) com rótulos em graus, minutos e segundos (23°30′ S).
// Um só gerador para o mapa principal, a prévia e a exportação do Estúdio.

// Espaçamento (em graus) conforme o zoom: de 10° no mundo a 1′ na escala de bairro
const STEPS = [
  [2, 10], [4, 5], [6, 2], [8, 1], [9, 0.5], [10, 0.25], [11, 1 / 6], [12, 1 / 12], [13, 1 / 30],
];
export function graticuleInterval(zoom) {
  const s = STEPS.find(([z]) => zoom < z);
  return s ? s[1] : 1 / 60;
}

// 23.5 → "23°30′ S"; -46.25 (lng) → "46°15′ O"; 0 → "0°"
export function formatDMS(value, axis) {
  const total = Math.round(Math.abs(value) * 3600); // segundos inteiros (evita 29′59,999″)
  const d = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  let txt = `${d}°`;
  if (m || s) txt += `${String(m).padStart(2, '0')}′`;
  if (s) txt += `${String(s).padStart(2, '0')}″`;
  if (total === 0) return txt;
  const hemi = axis === 'lat' ? (value > 0 ? 'N' : 'S') : (value > 0 ? 'L' : 'O');
  return `${txt} ${hemi}`;
}

const range = (a, b, step) => {
  const out = [];
  // Múltiplos inteiros do passo (somar o passo acumularia erro de ponto flutuante)
  for (let k = Math.ceil(a / step - 1e-9); k * step <= b + 1e-9; k++) out.push(+(k * step).toFixed(10));
  return out;
};

// bounds = [oeste, sul, leste, norte]. Espaçamentos finos só cobrem a área visível (com folga),
// para não gerar milhares de linhas; os grossos cobrem o mundo inteiro.
export function buildGraticule(zoom, bounds) {
  const step = graticuleInterval(zoom);
  let [w, s, e, n] = [-180, -85, 180, 85];
  if (step < 1 && bounds) {
    const padX = Math.max(step * 2, (bounds[2] - bounds[0]) * 0.5);
    const padY = Math.max(step * 2, (bounds[3] - bounds[1]) * 0.5);
    w = Math.max(-180, bounds[0] - padX); e = Math.min(180, bounds[2] + padX);
    s = Math.max(-85, bounds[1] - padY); n = Math.min(85, bounds[3] + padY);
  }
  // Pontos intermediários: a linha precisa acompanhar a curvatura do Mercator só nos meridianos
  const densify = (a, b, pts = 60) => Array.from({ length: pts + 1 }, (_, i) => a + (b - a) * i / pts);
  const features = [];
  range(s, n, step).forEach(lat => {
    features.push({
      type: 'Feature',
      properties: { label: formatDMS(lat, 'lat'), axis: 'lat', value: lat },
      geometry: { type: 'LineString', coordinates: densify(w, e).map(x => [x, lat]) },
    });
  });
  range(w, e, step).forEach(lng => {
    features.push({
      type: 'Feature',
      properties: { label: formatDMS(lng, 'lng'), axis: 'lng', value: lng },
      geometry: { type: 'LineString', coordinates: densify(s, n).map(y => [lng, y]) },
    });
  });
  return { type: 'FeatureCollection', features, step };
}

export const mapBoundsArray = (map) => {
  try { const b = map.getBounds(); return [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]; }
  catch (e) { return null; }
};

// Valores "redondos" para rotular a moldura: o maior número de marcas até `maxCount`
const FRAME_STEPS = [30, 20, 10, 5, 2, 1, 0.5, 0.25, 1 / 6, 1 / 12, 1 / 30, 1 / 60, 1 / 120, 1 / 240];
export function frameTickValues(min, max, maxCount = 6) {
  if (!(max > min)) return [];
  let best = [];
  for (const step of FRAME_STEPS) {
    const vals = range(min, max, step);
    if (vals.length > maxCount) break;
    best = vals;
  }
  return best;
}

// Marcas da moldura para o enquadramento de um mapa MapLibre: posições em fração da largura
// (meridianos) e da altura (paralelos). Só com o mapa sem rotação e sem inclinação — com
// rotação as linhas não cortam a moldura na vertical/horizontal.
export function computeFrameTicks(map, maxCount = 6) {
  try {
    if (Math.abs(map.getBearing()) > 0.5 || map.getPitch() > 0.5) return null;
    const el = map.getContainer();
    const W = el.clientWidth, H = el.clientHeight;
    const b = mapBoundsArray(map);
    if (!b || !W || !H) return null;
    const c = map.getCenter();
    const lat = frameTickValues(b[1], b[3], maxCount).map(v => ({ f: map.project([c.lng, v]).y / H, label: formatDMS(v, 'lat') }));
    const lng = frameTickValues(b[0], b[2], maxCount).map(v => ({ f: map.project([v, c.lat]).x / W, label: formatDMS(v, 'lng') }));
    return { lat, lng };
  } catch (e) { return null; }
}
