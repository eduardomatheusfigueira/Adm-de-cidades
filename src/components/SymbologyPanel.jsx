import React, { useMemo } from 'react';
import { getColorScale, buildLegendItems, isNumericValues, makeNumberParser, isNoDataMarker, STEP_SENTINEL } from '../utils/colorUtils';
import { SEQUENTIAL, DIVERGING, CATEGORICAL, CLASSIFICATION_METHODS, numericColors, categoricalColors } from '../utils/palettes';
import '../styles/SymbologyPanel.css';

const Swatches = ({ colors }) => (
  <span className="symb-swatches" aria-hidden="true">
    {colors.map((c, i) => <span key={i} style={{ background: c }} />)}
  </span>
);

// Histograma dos valores com as quebras de classe (ajuda a escolher o método)
function Histogram({ values, thresholds, colors }) {
  const W = 260, H = 64, BINS = 24;
  const min = values[0], max = values[values.length - 1];
  if (!(max > min)) return null;
  const counts = new Array(BINS).fill(0);
  values.forEach(v => { counts[Math.min(BINS - 1, Math.floor((v - min) / (max - min) * BINS))]++; });
  const top = Math.max(...counts);
  const x = (v) => ((v - min) / (max - min)) * W;
  const colorAt = (v) => { let c = colors[0]; thresholds.forEach((t, i) => { if (v >= t) c = colors[i + 1]; }); return c; };
  return (
    <svg className="symb-histogram" viewBox={`0 0 ${W} ${H + 12}`} role="img" aria-label="Histograma dos valores com as quebras das classes">
      {counts.map((c, i) => {
        const h = top ? (c / top) * H : 0;
        const v0 = min + (max - min) * (i + 0.5) / BINS;
        return <rect key={i} x={(i * W) / BINS + 0.5} y={H - h} width={W / BINS - 1} height={h} fill={colorAt(v0)} />;
      })}
      {thresholds.map((t, i) => <line key={i} x1={x(t)} x2={x(t)} y1={0} y2={H} stroke="#111827" strokeWidth="1" strokeDasharray="3 2" />)}
      <line x1="0" x2={W} y1={H} y2={H} stroke="#94a3b8" />
      <text x="0" y={H + 11} fontSize="9" fill="#64748b">{min.toLocaleString('pt-BR')}</text>
      <text x={W} y={H + 11} fontSize="9" fill="#64748b" textAnchor="end">{max.toLocaleString('pt-BR')}</text>
    </svg>
  );
}

// Painel de simbologia: método de classificação, nº de classes, paleta e prévia.
// `rawValues` são os valores da variável escolhida (como estão na tabela).
export default function SymbologyPanel({ rawValues, symbology, onChange }) {
  const filled = useMemo(() => (rawValues || []).filter(v => !isNoDataMarker(v)), [rawValues]);
  const numeric = useMemo(() => isNumericValues(filled), [filled]);
  const sorted = useMemo(() => {
    if (!numeric) return [];
    const parse = makeNumberParser(filled);
    return filled.map(parse).filter(Number.isFinite).sort((a, b) => a - b);
  }, [filled, numeric]);

  const set = (patch) => onChange({ ...symbology, ...patch });

  const preview = useMemo(() => {
    if (!filled.length) return null;
    const expr = getColorScale('v', numeric ? sorted : filled, symbology);
    const { items } = buildLegendItems(expr, numeric ? sorted : filled, 0);
    const thresholds = expr[0] === 'step' ? expr.filter((_, i) => i >= 3 && i % 2 === 1 && expr[i] < STEP_SENTINEL) : [];
    const colors = expr[0] === 'step' ? [expr[2], ...expr.filter((_, i) => i >= 4 && i % 2 === 0)] : [];
    return { items, thresholds, colors };
  }, [filled, sorted, numeric, symbology]);

  if (!filled.length) return null;

  if (!numeric) {
    return (
      <div className="symb-panel">
        <label className="symb-label">Cores das categorias</label>
        <div className="symb-palettes">
          {CATEGORICAL.map(p => (
            <button type="button" key={p.id} className={`symb-palette ${symbology.categoricalPalette === p.id ? 'active' : ''}`}
              onClick={() => set({ categoricalPalette: p.id })} title={p.label}>
              <Swatches colors={categoricalColors(p.id, 6)} /><span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const requested = symbology.classes || 5;
  const obtained = preview?.items?.length || 0;
  return (
    <div className="symb-panel">
      <label className="symb-label" htmlFor="symb-method">Classificação</label>
      <select id="symb-method" className="visualization-dropdown" value={symbology.method} onChange={e => set({ method: e.target.value })}>
        {CLASSIFICATION_METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
      </select>

      {symbology.method === 'manual' ? (
        <>
          <label className="symb-label" htmlFor="symb-breaks">Limites entre as classes (separados por ;)</label>
          <input id="symb-breaks" className="symb-input" type="text" inputMode="decimal"
            placeholder="ex.: 10; 50; 100; 500"
            defaultValue={(symbology.breaks || []).map(b => `${b}`.replace('.', ',')).join('; ')}
            onBlur={e => set({ breaks: e.target.value.split(';').map(t => t.trim()).filter(Boolean) })} />
        </>
      ) : (
        <>
          <label className="symb-label" htmlFor="symb-classes">Número de classes: {requested}</label>
          <input id="symb-classes" type="range" min="2" max="9" step="1" value={requested}
            onChange={e => set({ classes: Number(e.target.value) })} />
        </>
      )}
      {symbology.method !== 'manual' && obtained && obtained < requested && (
        <p className="symb-note">Os dados só permitem {obtained} classe(s) com este método (poucos valores diferentes).</p>
      )}

      <label className="symb-label">Paleta</label>
      <div className="symb-palettes">
        {[{ title: 'Sequenciais (pouco → muito)', list: SEQUENTIAL }, { title: 'Divergentes (abaixo ↔ acima de um centro)', list: DIVERGING }].map(g => (
          <React.Fragment key={g.title}>
            <span className="symb-group-title">{g.title}</span>
            {g.list.map(p => (
              <button type="button" key={p.id} className={`symb-palette ${symbology.palette === p.id ? 'active' : ''}`}
                onClick={() => set({ palette: p.id })} title={p.label}>
                <Swatches colors={numericColors(p.id, 5, symbology.reverse)} /><span>{p.label}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
      <label className="symb-check">
        <input type="checkbox" checked={!!symbology.reverse} onChange={e => set({ reverse: e.target.checked })} />
        Inverter as cores
      </label>

      {preview && (
        <div className="symb-preview">
          <Histogram values={sorted} thresholds={preview.thresholds} colors={preview.colors} />
          <ul>
            {preview.items.map((it, i) => (
              <li key={i}><span style={{ background: it.color }} />{it.value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
