import * as d3 from 'd3';

export const getLegendKey = (visualizationConfig, colorAttribute) => {
  if (visualizationConfig?.type === 'indicator') {
    return `indicator:${visualizationConfig.indicator}:${visualizationConfig.year}:${visualizationConfig.valueType || 'value'}`;
  }
  if (visualizationConfig?.type === 'attribute' && visualizationConfig.attribute) {
    return `attribute:${visualizationConfig.attribute}`;
  }
  return colorAttribute ? `attribute:${colorAttribute}` : null;
};

// Cor dos municípios sem dado (célula vazia, "-", "...", texto inválido).
export const NO_DATA_COLOR = '#d9d9d9';
export const NO_DATA_LABEL = 'Sem dados';

// Marcadores comuns de "sem informação" em planilhas do IBGE/DATASUS.
const NO_DATA_MARKERS = new Set(['', '-', '--', '...', '..', 'x', 'X', 'NA', 'N/A', 'n/a', 'n/d', 'N/D', 'nd', 'ND', 'null', 'NULL', 'NaN', 'sem dados', 'Sem dados']);

export const isNoDataMarker = (value) =>
  value === undefined || value === null || (typeof value === 'string' && NO_DATA_MARKERS.has(value.trim()));

// Lê números no formato brasileiro e internacional:
// "1.234,56" → 1234.56 · "590,3" → 590.3 · "1234.5" → 1234.5 · "1.234.567" → 1234567.
// Com `decimalComma` (coluna no formato brasileiro), "22.516" → 22516.
// Devolve NaN para vazio, marcadores de "sem dado" e texto que não é número.
export const parseNumberBR = (value, decimalComma = false) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (typeof value !== 'string' || isNoDataMarker(value)) return NaN;
  let t = value.trim().replace(/\s|\u00a0/g, '').replace(/^R\$/, '').replace(/%$/, '');
  if (!/^[-+]?[\d.,]+$/.test(t)) return NaN;
  const hasComma = t.includes(',');
  const dots = (t.match(/\./g) || []).length;
  if (hasComma) {
    t = t.replace(/\./g, '').replace(',', '.');         // vírgula decimal, pontos de milhar
    if (t.includes(',')) return NaN;                    // mais de uma vírgula
  } else if (dots > 1 || (decimalComma && dots === 1)) {
    t = t.replace(/\./g, '');                          // só pontos de milhar
  }
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
};

// A coluna usa vírgula decimal? (então pontos são separadores de milhar em toda a coluna)
export const usesDecimalComma = (values) =>
  (values || []).some(v => typeof v === 'string' && /^\s*[-+]?[\d.]*,\d+\s*$/.test(v));

// Parser de números para uma coluna inteira, com o formato decidido pelo conjunto de valores.
export const makeNumberParser = (values) => {
  const decimalComma = usesDecimalComma(values);
  return (v) => parseNumberBR(v, decimalComma);
};

// Um conjunto de valores é numérico quando todos os valores preenchidos
// (ignorando marcadores de "sem dado") podem ser lidos como número.
export const isNumericValues = (values) => {
  const filled = (values || []).filter(v => !isNoDataMarker(v));
  return filled.length > 0 && filled.every(v => !Number.isNaN(parseNumberBR(v)));
};

// Envolve a expressão de cor para pintar municípios sem valor numérico com a cor "Sem dados"
// (sem isso, to-number(null) = 0 e a falta de dado apareceria como "menor classe";
// e um texto não numérico faria o polígono sair preto).
const NOT_A_NUMBER = -1e300;
export const withNoDataColor = (attribute, expression) => {
  if (!Array.isArray(expression) || expression[0] !== 'step') return expression;
  const value = ['get', attribute];
  return ['case',
    ['any',
      ['!', ['has', attribute]],
      ['==', value, null],
      ['==', value, ''],
      ['==', ['to-number', value, NOT_A_NUMBER], NOT_A_NUMBER]],
    NO_DATA_COLOR,
    expression];
};

// Paleta sequencial com exatamente n cores (1 a 9).
const sequentialColors = (n, scheme) => {
  if (Array.isArray(scheme) && scheme.length === n) return scheme;
  if (n >= 3) return d3.schemeReds[Math.min(n, 9)];
  const base = d3.schemeReds[3];
  return n === 2 ? [base[0], base[2]] : [base[1]];
};

// Default schemes
const defaultNumericScheme = d3.schemeReds[5]; // Default to 5 categories for Reds
const defaultCategoricalScheme = d3.schemeCategory10;

// Número usado como limiar "inalcançável" quando só há um valor distinto
// (a expressão 'step' exige pelo menos um par limiar/cor).
export const STEP_SENTINEL = 1e300;

export const getColorScale = (
  attribute,
  values,
  numericCategories = 5, // Default number of numeric categories
  numericScheme = defaultNumericScheme, // Default numeric color scheme
  categoricalScheme = defaultCategoricalScheme // Default categorical color scheme
) => {
  const filled = (values || []).filter(v => !isNoDataMarker(v));
  if (filled.length === 0) {
    return ['case', ['==', ['get', attribute], null], NO_DATA_COLOR, NO_DATA_COLOR];
  }

  if (attribute !== 'Nome_Municipio' && isNumericValues(filled)) {
    const numericValues = filled.map(makeNumberParser(filled)).sort(d3.ascending);
    const min = numericValues[0];

    // Limiares por quantis, sem repetição e sempre acima do mínimo: com poucos municípios
    // ou muitos empates o número de classes diminui, em vez de gerar uma expressão inválida.
    const thresholds = [];
    for (let i = 1; i < numericCategories; i++) {
      const t = numericValues[Math.floor(numericValues.length / numericCategories * i)];
      if (t > min && (thresholds.length === 0 || t > thresholds[thresholds.length - 1])) thresholds.push(t);
    }

    const colorRange = sequentialColors(thresholds.length + 1, numericScheme);
    const input = ['to-number', ['get', attribute]];
    if (thresholds.length === 0) {
      // Um único valor distinto: uma classe só.
      return ['step', input, colorRange[0], STEP_SENTINEL, colorRange[0]];
    }
    return [
      'step',
      input,
      colorRange[0], // default color
      ...thresholds.flatMap((threshold, index) => [threshold, colorRange[index + 1]])
    ];
  } else {
    // Categorical Data Handling
    const uniqueValues = [...new Set(filled.map(v => `${v}`))].sort(); // Sort for consistent color assignment
    let colorRange;

    // Use a more diverse scheme if the number of categories exceeds the default scheme's length
    if (uniqueValues.length > categoricalScheme.length) {
      console.log(`Generating ${uniqueValues.length} distinct colors using interpolateTurbo.`);
      // Generate distinct colors using interpolateTurbo, avoiding the very ends (0 and 1)
      colorRange = d3.quantize(t => d3.interpolateTurbo(t * 0.8 + 0.1), uniqueValues.length);
    } else {
      // Use the provided categorical scheme if it has enough colors
      colorRange = categoricalScheme;
    }

    const colorScale = d3.scaleOrdinal()
      .domain(uniqueValues) // Use sorted domain
      .range(colorRange); // Use the determined color range

    // Build the Mapbox match expression
    const matchExpression = ['match', ['to-string', ['get', attribute]]];
    uniqueValues.forEach(value => {
      matchExpression.push(value, colorScale(value));
    });
    matchExpression.push(NO_DATA_COLOR); // Sem dados / valores não listados
    return matchExpression;
  }
};

const toHex = (color) => {
  const c = d3.color(color);
  return c ? c.formatHex() : color;
};

// Itens da legenda correspondentes exatamente à expressão gerada por getColorScale.
// `missingCount` = quantidade de municípios sem dado (gera o item "Sem dados (n)").
export const buildLegendItems = (scaleExpression, values, missingCount = 0) => {
  const type = scaleExpression?.[0];
  const items = [];
  if (type === 'match') {
    for (let i = 2; i < scaleExpression.length - 1; i += 2) {
      items.push({ value: `${scaleExpression[i]}`, color: toHex(scaleExpression[i + 1]) });
    }
  } else if (type === 'step') {
    const numericValues = (values || []).map(makeNumberParser(values)).filter((v) => !Number.isNaN(v)).sort((a, b) => a - b);
    if (!numericValues.length) return { type: 'dynamic', items: [] };
    const fmt = (v) => v.toLocaleString('pt-BR');
    const minValue = numericValues[0];
    const maxValue = numericValues[numericValues.length - 1];
    const bounds = [minValue];
    const colors = [scaleExpression[2]];
    for (let i = 3; i < scaleExpression.length; i += 2) {
      const threshold = Number(scaleExpression[i]);
      if (Number.isNaN(threshold) || threshold >= STEP_SENTINEL || !scaleExpression[i + 1]) continue;
      bounds.push(threshold);
      colors.push(scaleExpression[i + 1]);
    }
    // Faixas: [mín, t1), [t1, t2), ..., [tn, máx]
    bounds.forEach((lower, i) => {
      const isLast = i === bounds.length - 1;
      const label = isLast
        ? (lower === maxValue ? fmt(lower) : `${fmt(lower)} a ${fmt(maxValue)}`)
        : `${fmt(lower)} a menos de ${fmt(bounds[i + 1])}`;
      items.push({ value: label, color: toHex(colors[i]) });
    });
  } else {
    return { type: 'dynamic', items: [] };
  }
  if (missingCount > 0) items.push({ value: `${NO_DATA_LABEL} (${missingCount})`, color: NO_DATA_COLOR, noData: true });
  return { type: type === 'match' ? 'categorical' : 'numeric', items };
};

// Quantos registros não têm valor utilizável para o atributo.
export const countMissing = (rows, attribute, numeric) =>
  (rows || []).filter((row) => {
    const v = row?.[attribute];
    if (isNoDataMarker(v)) return true;
    return numeric && Number.isNaN(parseNumberBR(v));
  }).length;
