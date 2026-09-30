import * as d3 from 'd3';

// Paletas para mapas temáticos.
// - Sequenciais: para quantidades que vão de "pouco" a "muito" (ColorBrewer + Viridis).
// - Divergentes: quando há um ponto central com significado (média, zero, 50%).
// - Qualitativas: para categorias (sem ordem). Okabe-Ito é segura para daltônicos.

const brewer = (scheme) => (n) => scheme[Math.max(3, Math.min(n, scheme.length - 1))].slice(0, n);
const interp = (fn, lo = 0, hi = 1) => (n) => d3.quantize(t => d3.color(fn(lo + t * (hi - lo))).formatHex(), n);

export const SEQUENTIAL = [
  { id: 'Reds', label: 'Vermelhos', colors: brewer(d3.schemeReds) },
  { id: 'Blues', label: 'Azuis', colors: brewer(d3.schemeBlues) },
  { id: 'Greens', label: 'Verdes', colors: brewer(d3.schemeGreens) },
  { id: 'Oranges', label: 'Laranjas', colors: brewer(d3.schemeOranges) },
  { id: 'Purples', label: 'Roxos', colors: brewer(d3.schemePurples) },
  { id: 'Greys', label: 'Cinzas', colors: brewer(d3.schemeGreys) },
  { id: 'YlOrRd', label: 'Amarelo → Vermelho', colors: brewer(d3.schemeYlOrRd) },
  { id: 'YlGnBu', label: 'Amarelo → Azul', colors: brewer(d3.schemeYlGnBu) },
  { id: 'YlGn', label: 'Amarelo → Verde', colors: brewer(d3.schemeYlGn) },
  { id: 'PuBuGn', label: 'Lilás → Verde', colors: brewer(d3.schemePuBuGn) },
  { id: 'Viridis', label: 'Viridis (daltônicos)', colors: interp(d3.interpolateViridis, 0.05, 0.95) },
  { id: 'Cividis', label: 'Cividis (daltônicos)', colors: interp(d3.interpolateCividis, 0.05, 0.95) },
  { id: 'Magma', label: 'Magma', colors: interp(d3.interpolateMagma, 0.1, 0.95) },
];

export const DIVERGING = [
  { id: 'RdBu', label: 'Vermelho ↔ Azul', colors: brewer(d3.schemeRdBu) },
  { id: 'RdYlGn', label: 'Vermelho ↔ Verde', colors: brewer(d3.schemeRdYlGn) },
  { id: 'BrBG', label: 'Marrom ↔ Verde-azulado', colors: brewer(d3.schemeBrBG) },
  { id: 'PuOr', label: 'Laranja ↔ Roxo (daltônicos)', colors: brewer(d3.schemePuOr) },
  { id: 'PiYG', label: 'Rosa ↔ Verde', colors: brewer(d3.schemePiYG) },
];

const OKABE_ITO = ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#999999'];

export const CATEGORICAL = [
  { id: 'Category10', label: 'Padrão', colors: d3.schemeCategory10 },
  { id: 'OkabeIto', label: 'Okabe-Ito (daltônicos)', colors: OKABE_ITO },
  { id: 'Set2', label: 'Pastel (Set2)', colors: d3.schemeSet2 },
  { id: 'Dark2', label: 'Escuro (Dark2)', colors: d3.schemeDark2 },
  { id: 'Paired', label: 'Pares (Paired)', colors: d3.schemePaired },
  { id: 'Tableau10', label: 'Tableau', colors: d3.schemeTableau10 },
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
  colors = colors.map(c => d3.color(c).formatHex());
  return reverse ? [...colors].reverse() : colors;
}

// Cores para n categorias; paletas curtas são estendidas com Turbo
export function categoricalColors(id, n) {
  const p = CATEGORICAL.find(x => x.id === id) || CATEGORICAL[0];
  if (n <= p.colors.length) return p.colors.slice(0, n);
  return d3.quantize(t => d3.color(d3.interpolateTurbo(t * 0.8 + 0.1)).formatHex(), n);
}

export const CLASSIFICATION_METHODS = [
  { id: 'quantile', label: 'Quantis (mesmo nº de municípios por classe)' },
  { id: 'jenks', label: 'Quebras naturais (Jenks)' },
  { id: 'equal', label: 'Intervalos iguais' },
  { id: 'manual', label: 'Manual (eu defino os limites)' },
];

export const DEFAULT_SYMBOLOGY = { method: 'quantile', classes: 5, palette: 'Reds', reverse: false, breaks: [], categoricalPalette: 'Category10' };
