import {
  color as d3color, interpolateCividis, interpolateMagma, interpolateTurbo, interpolateViridis, quantize, schemeBlues, schemeBrBG, schemeCategory10, schemeDark2, schemeGreens, schemeGreys, schemeOranges, schemePaired, schemePiYG, schemePuBuGn, schemePuOr, schemePurples, schemeRdBu, schemeRdYlGn, schemeReds, schemeSet2, schemeTableau10, schemeYlGn, schemeYlGnBu, schemeYlOrRd,
} from 'd3';

// Paletas para mapas temáticos.
// - Sequenciais: para quantidades que vão de "pouco" a "muito" (ColorBrewer + Viridis).
// - Divergentes: quando há um ponto central com significado (média, zero, 50%).
// - Qualitativas: para categorias (sem ordem). Okabe-Ito é segura para daltônicos.

const brewer = (scheme) => (n) => scheme[Math.max(3, Math.min(n, scheme.length - 1))].slice(0, n);
const interp = (fn, lo = 0, hi = 1) => (n) => quantize(t => d3color(fn(lo + t * (hi - lo))).formatHex(), n);

export const SEQUENTIAL = [
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
  { id: 'RdBu', label: 'Vermelho ↔ Azul', colors: brewer(schemeRdBu) },
  { id: 'RdYlGn', label: 'Vermelho ↔ Verde', colors: brewer(schemeRdYlGn) },
  { id: 'BrBG', label: 'Marrom ↔ Verde-azulado', colors: brewer(schemeBrBG) },
  { id: 'PuOr', label: 'Laranja ↔ Roxo (daltônicos)', colors: brewer(schemePuOr) },
  { id: 'PiYG', label: 'Rosa ↔ Verde', colors: brewer(schemePiYG) },
];

const OKABE_ITO = ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#999999'];

export const CATEGORICAL = [
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

// Cores para n categorias; paletas curtas são estendidas com Turbo
export function categoricalColors(id, n) {
  const p = CATEGORICAL.find(x => x.id === id) || CATEGORICAL[0];
  if (n <= p.colors.length) return p.colors.slice(0, n);
  return quantize(t => d3color(interpolateTurbo(t * 0.8 + 0.1)).formatHex(), n);
}

export const CLASSIFICATION_METHODS = [
  { id: 'quantile', label: 'Quantis (mesmo nº de municípios por classe)' },
  { id: 'jenks', label: 'Quebras naturais (Jenks)' },
  { id: 'equal', label: 'Intervalos iguais' },
  { id: 'manual', label: 'Manual (eu defino os limites)' },
];

export const DEFAULT_SYMBOLOGY = { method: 'quantile', classes: 5, palette: 'Reds', reverse: false, breaks: [], categoricalPalette: 'Category10' };
