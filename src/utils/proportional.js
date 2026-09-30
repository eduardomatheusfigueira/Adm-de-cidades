// Símbolos proporcionais: círculos com ÁREA proporcional ao valor (raio ∝ √valor),
// o modo correto de mapear contagens absolutas (população, casos, matrículas...).

export const SYMBOL_MAX_RADIUS = 28; // px na tela (e na prancha de design do Estúdio)
export const SYMBOL_COLOR = '#d95f02';
export const NEUTRAL_FILL = '#e5e7eb';

export const symbolRadius = (value, max, maxR = SYMBOL_MAX_RADIUS) =>
  max > 0 && value > 0 ? maxR * Math.sqrt(value / max) : 0;

// Expressão do MapLibre para o raio (propriedade __sym = valor)
export const symbolRadiusExpression = (max, maxR = SYMBOL_MAX_RADIUS) => [
  '*', maxR, ['sqrt', ['/', ['max', ['to-number', ['get', '__sym'], 0], 0], Math.max(max, 1e-12)]],
];

// Número "redondo" próximo (1, 2, 2,5 ou 5 × 10^n) para os círculos da legenda
const niceRound = (v) => {
  if (!(v > 0)) return 0;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / pow;
  const nice = m >= 5 ? 5 : m >= 2.5 ? 2.5 : m >= 2 ? 2 : 1;
  return nice * pow;
};

// Três círculos de referência (grande, médio, pequeno) com valores redondos
export function symbolLegendCircles(max, maxR = SYMBOL_MAX_RADIUS) {
  if (!(max > 0)) return [];
  const values = [niceRound(max), niceRound(max / 4), niceRound(max / 16)]
    .filter((v, i, arr) => v > 0 && arr.indexOf(v) === i);
  return values.map(v => ({ value: v, r: symbolRadius(v, max, maxR) }));
}
