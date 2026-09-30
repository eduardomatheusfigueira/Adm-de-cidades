import {
  color as d3color, hcl, interpolateLab, piecewise, interpolateCividis, interpolateMagma, interpolateTurbo, interpolateViridis, quantize, schemeBlues, schemeBrBG, schemeCategory10, schemeDark2, schemeGreens, schemeGreys, schemeOranges, schemePaired, schemePiYG, schemePuBuGn, schemePuOr, schemePurples, schemeRdBu, schemeRdYlGn, schemeReds, schemeSet2, schemeTableau10, schemeYlGn, schemeYlGnBu, schemeYlOrRd,
} from 'd3';

// Paletas para mapas temáticos.
// - Sequenciais: para quantidades que vão de "pouco" a "muito" (ColorBrewer + Viridis).
// - Divergentes: quando há um ponto central com significado (média, zero, 50%).
// - Qualitativas: para categorias (sem ordem). Okabe-Ito é segura para daltônicos.

const brewer = (scheme) => (n) => scheme[Math.max(3, Math.min(n, scheme.length - 1))].slice(0, n);
const interp = (fn, lo = 0, hi = 1) => (n) => quantize(t => d3color(fn(lo + t * (hi - lo))).formatHex(), n);

// ── Escalas do guia de identidade do SisInfo (seção 06 · Dados e mapas) ──
// Rampas de 11 tons (50 → 950); as classes são tiradas de forma equidistante entre 100 e 900.
export const RAMPA_PETROLEO = ['#EDF7FB', '#D6ECF3', '#B8DBE6', '#93C4D2', '#67A6B8', '#3D899D', '#1D6E82', '#015668', '#004554', '#003440', '#00242D'];
export const RAMPA_TERRACOTA = ['#FFF2ED', '#FEE1D6', '#FBC7B3', '#F2A588', '#E5845E', '#D5683B', '#BD5223', '#A04318', '#823513', '#65280D', '#471D0C'];
// Divergente: dois braços iguais e um centro neutro (Papel 200), sem julgamento de "bom" ou "ruim".
const ANCORAS_DIVERGENTE = ['#015668', '#3D899D', '#93C4D2', '#F0ECE5', '#F2A588', '#D5683B', '#A04318'];
// Categórica: ordem fixa (validada para daltonismo nas cinco primeiras).
export const CATEGORICA_SISINFO = ['#1288A1', '#CC6349', '#3E5D1B', '#DBAD36', '#A87EEB', '#6B8FD6', '#8C6D46', '#D77FA1', '#5E9E7E', '#A39E93'];

const daRampa = (rampa) => (n) => {
  if (n <= 1) return [rampa[5]];
  return Array.from({ length: n }, (_, i) => rampa[Math.round(1 + (i * 8) / (n - 1))]);
};
const divergenteSisInfo = (n) => {
  if (n <= 1) return [ANCORAS_DIVERGENTE[3]];
  const f = piecewise(interpolateLab, ANCORAS_DIVERGENTE);
  return Array.from({ length: n }, (_, i) => d3color(f(i / (n - 1))).formatHex());
};

export const SEQUENTIAL = [
  { id: 'Petroleo', label: 'Petróleo (SisInfo)', colors: daRampa(RAMPA_PETROLEO) },
  { id: 'Terracota', label: 'Terracota (SisInfo)', colors: daRampa(RAMPA_TERRACOTA) },
  { id: 'Reds', label: 'Vermelhos', colors: brewer(schemeReds) },
  { id: 'Blues', label: 'Azuis', colors: brewer(schemeBlues) },
  { id: 'Greens', label: 'Verdes', colors: brewer(schemeGreens) },
  { id: 'Oranges', label: 'Laranjas', colors: brewer(schemeOranges) },
  { id: 'Purples', label: 'Roxos', colors: brewer(schemePurples) },
  { id: 'Greys', label: 'Cinzas', colors: brewer(schemeGreys) },
  { id: 'YlOrRd', label: 'Amarelo → Vermelho', colors: brewer(schemeYlOrRd) },
  { id: 'YlGnBu', label: 'Amarelo → Azul', colors: brewer(schemeYlGnBu) },
  { id: 'YlGn', label: 'Amarelo → Verde', colors: brewer(schemeYlGn) },
  { id: 'PuBuGn', label: 'Lilás → Verde', colors: brewer(schemePuBuGn) },
  { id: 'Viridis', label: 'Viridis (daltônicos)', colors: interp(interpolateViridis, 0.05, 0.95) },
  { id: 'Cividis', label: 'Cividis (daltônicos)', colors: interp(interpolateCividis, 0.05, 0.95) },
  { id: 'Magma', label: 'Magma', colors: interp(interpolateMagma, 0.1, 0.95) },
];

export const DIVERGING = [
  { id: 'SisInfo', label: 'Petróleo ↔ Terracota (SisInfo)', colors: divergenteSisInfo },
  { id: 'RdBu', label: 'Vermelho ↔ Azul', colors: brewer(schemeRdBu) },
  { id: 'RdYlGn', label: 'Vermelho ↔ Verde', colors: brewer(schemeRdYlGn) },
  { id: 'BrBG', label: 'Marrom ↔ Verde-azulado', colors: brewer(schemeBrBG) },
  { id: 'PuOr', label: 'Laranja ↔ Roxo (daltônicos)', colors: brewer(schemePuOr) },
  { id: 'PiYG', label: 'Rosa ↔ Verde', colors: brewer(schemePiYG) },
];

const OKABE_ITO = ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#999999'];

export const CATEGORICAL = [
  { id: 'SisInfo', label: 'SisInfo', colors: CATEGORICA_SISINFO },
  { id: 'Category10', label: 'Padrão', colors: schemeCategory10 },
  { id: 'OkabeIto', label: 'Okabe-Ito (daltônicos)', colors: OKABE_ITO },
  { id: 'Set2', label: 'Pastel (Set2)', colors: schemeSet2 },
  { id: 'Dark2', label: 'Escuro (Dark2)', colors: schemeDark2 },
  { id: 'Paired', label: 'Pares (Paired)', colors: schemePaired },
  { id: 'Tableau10', label: 'Tableau', colors: schemeTableau10 },
];

export const NUMERIC_PALETTES = [...SEQUENTIAL, ...DIVERGING];

// n cores de uma paleta numérica (sequencial ou divergente)
export function numericColors(id, n, reverse = false) {
  const p = NUMERIC_PALETTES.find(x => x.id === id) || SEQUENTIAL[0];
  let colors;
  if (n >= 3) colors = p.colors(n);
  else {
    const three = p.colors(3);
    colors = n === 2 ? [three[0], three[2]] : [three[1]];
  }
  colors = colors.map(c => d3color(c).formatHex());
  return reverse ? [...colors].reverse() : colors;
}

// Cores para n categorias. Paletas curtas são estendidas: a do SisInfo com tons de mesma
// luminosidade espalhados no círculo cromático (sem cores fluorescentes); as demais com Turbo.
export function categoricalColors(id, n) {
  const p = CATEGORICAL.find(x => x.id === id) || CATEGORICAL[0];
  if (n <= p.colors.length) return p.colors.slice(0, n);
  if (p.id === 'SisInfo') {
    return Array.from({ length: n }, (_, i) => hcl((200 + (i * 360) / n) % 360, 42, i % 2 ? 52 : 66).formatHex());
  }
  return quantize(t => d3color(interpolateTurbo(t * 0.8 + 0.1)).formatHex(), n);
}

export const CLASSIFICATION_METHODS = [
  { id: 'quantile', label: 'Quantis (mesmo nº de municípios por classe)' },
  { id: 'jenks', label: 'Quebras naturais (Jenks)' },
  { id: 'equal', label: 'Intervalos iguais' },
  { id: 'manual', label: 'Manual (eu defino os limites)' },
];

export const DEFAULT_SYMBOLOGY = { method: 'quantile', classes: 5, palette: 'Petroleo', reverse: false, breaks: [], categoricalPalette: 'SisInfo' };
