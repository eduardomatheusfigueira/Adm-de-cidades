import {
  ascending, color as d3color, scaleOrdinal,
} from 'd3';
import * as ss from 'simple-statistics';
import { numericColors, categoricalColors, DEFAULT_SYMBOLOGY } from './palettes';

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
// Papel 300 do guia de identidade: um neutro que nunca é confundido com uma classe da escala.
export const NO_DATA_COLOR = '#E4DFD5';
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

// Na coluna, o ponto é separador de milhar (formato brasileiro)? Sim quando algum valor usa
// vírgula decimal ("1.000,5"), tem mais de um ponto ("1.234.567") ou quando todos os valores
// com ponto têm exatamente 3 dígitos depois dele e não começam com 0 ("22.516", "845.300").
export const usesDecimalComma = (values) => {
  const strs = (values || []).filter(v => typeof v === 'string').map(v => v.trim());
  if (strs.some(v => /^[-+]?[\d.]*,\d+$/.test(v))) return true;
  if (strs.some(v => /^[-+]?\d{1,3}(\.\d{3}){2,}$/.test(v))) return true;
  const dotted = strs.filter(v => /^[-+]?\d+\.\d+$/.test(v));
  return dotted.length > 0 && dotted.every(v => /^[-+]?[1-9]\d{0,2}\.\d{3}$/.test(v));
};

// Parser de números para uma coluna inteira, com o formato decidido pelo conjunto de valores.
// Passe a coluna completa (não só os municípios filtrados) para decidir com mais evidência.
export const makeNumberParser = (values) => {
  const decimalComma = usesDecimalComma(values);
  return (v) => parseNumberBR(v, decimalComma);
};

// Converte uma coluna em números quando ela é numérica (formato decidido pela coluna completa
// `allValues`); caso contrário devolve os valores como estão.
export const toNumericIfPossible = (values, allValues = values) => {
  if (!isNumericValues(allValues)) return values;
  const parse = makeNumberParser(allValues);
  return values.map(v => { const n = parse(v); return Number.isNaN(n) ? null : n; }).filter(v => v !== null);
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
// Condição (expressão MapLibre) "este município não tem valor numérico no atributo"
export const noDataCondition = (attribute) => {
  const value = ['get', attribute];
  return ['any',
    ['!', ['has', attribute]],
    ['==', value, null],
    ['==', value, ''],
    ['==', ['to-number', value, NOT_A_NUMBER], NOT_A_NUMBER]];
};
export const withNoDataColor = (attribute, expression) => {
  if (!Array.isArray(expression) || expression[0] !== 'step') return expression;
  return ['case', noDataCondition(attribute), NO_DATA_COLOR, expression];
};
// Filtro da camada de hachura "Sem dados": só existe em escalas numéricas (step)
export const noDataHatchFilter = (attribute, expression) =>
  (Array.isArray(expression) && expression[0] === 'step') ? noDataCondition(attribute) : false;

// Regiões: sempre as mesmas cores (guia de identidade), em qualquer recorte
export const CORES_REGIOES = { N: '#3E5D1B', NE: '#DBAD36', CO: '#CC6349', SE: '#1288A1', S: '#A87EEB' };
export const NOMES_REGIOES = { N: 'Norte', NE: 'Nordeste', CO: 'Centro-Oeste', SE: 'Sudeste', S: 'Sul' };
const ehRegiao = (valores) => valores.length > 0 && valores.every(v => Object.prototype.hasOwnProperty.call(CORES_REGIOES, v));

// Nomes legíveis dos atributos do cadastro de municípios
const ROTULOS_ATRIBUTOS = {
  Area_Municipio: 'Área territorial (km²)',
  Sigla_Regiao: 'Região',
  Sigla_Estado: 'Estado (UF)',
  Nome_Municipio: 'Município',
  Capital: 'Capital',
  Altitude_Municipio: 'Altitude (m)',
  Codigo_Municipio: 'Código IBGE',
  Latitude_Municipio: 'Latitude',
  Longitude_Municipio: 'Longitude',
};
export const rotuloAtributo = (atributo) => ROTULOS_ATRIBUTOS[atributo] || (atributo || '').replace(/_/g, ' ');

// Número usado como limiar "inalcançável" quando só há um valor distinto
// (a expressão 'step' exige pelo menos um par limiar/cor).
export const STEP_SENTINEL = 1e300;

// Limiares candidatos (k-1 valores) para cada método de classificação
export function classBreaks(sortedValues, method = 'quantile', k = 5, manualBreaks = []) {
  const n = sortedValues.length;
  const min = sortedValues[0], max = sortedValues[n - 1];
  if (method === 'equal') {
    return Array.from({ length: k - 1 }, (_, i) => min + (max - min) * (i + 1) / k);
  }
  if (method === 'jenks') {
    const distinct = new Set(sortedValues).size;
    const kk = Math.min(k, distinct);
    if (kk < 2) return [];
    // ckmeans: agrupamento ótimo em 1 dimensão (quebras naturais de Jenks)
    return ss.ckmeans(sortedValues, kk).slice(1).map(cluster => cluster[0]);
  }
  if (method === 'manual') {
    return (manualBreaks || []).map(v => (typeof v === 'number' ? v : parseNumberBR(`${v}`))).filter(Number.isFinite).sort((a, b) => a - b);
  }
  // quantis
  return Array.from({ length: k - 1 }, (_, i) => sortedValues[Math.floor(n / k * (i + 1))]);
}

// Opções de simbologia aceitas por getColorScale (ver DEFAULT_SYMBOLOGY em palettes.js).
// Compatibilidade: o 3º argumento também pode ser só o número de classes.
export const getColorScale = (attribute, values, options = {}) => {
  const opts = { ...DEFAULT_SYMBOLOGY, ...(typeof options === 'number' ? { classes: options } : (options || {})) };
  const method = opts.method || 'quantile';
  const k = Math.max(2, Math.min(9, Number(opts.classes) || 5));

  const filled = (values || []).filter(v => !isNoDataMarker(v));
  if (filled.length === 0) {
    return ['case', ['==', ['get', attribute], null], NO_DATA_COLOR, NO_DATA_COLOR];
  }

  if (attribute !== 'Nome_Municipio' && isNumericValues(filled)) {
    const numericValues = filled.map(makeNumberParser(filled)).sort(ascending);
    const min = numericValues[0], max = numericValues[numericValues.length - 1];

    // Limiares sem repetição e dentro do intervalo dos dados: com poucos municípios ou muitos
    // empates o número de classes diminui, em vez de gerar uma expressão inválida.
    const thresholds = [];
    classBreaks(numericValues, method, k, opts.breaks).forEach(t => {
      if (t > min && t <= max && (thresholds.length === 0 || t > thresholds[thresholds.length - 1])) thresholds.push(t);
    });

    const colorRange = numericColors(opts.palette, thresholds.length + 1, !!opts.reverse);
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
    const uniqueValues = [...new Set(filled.map(v => `${v}`))].sort(); // ordem estável das cores
    let colorScale;
    if (opts.categoricalPalette === 'SisInfo' && ehRegiao(uniqueValues)) {
      // Na ordem do IBGE (Norte, Nordeste, Centro-Oeste, Sudeste, Sul), com as cores fixas das regiões
      const ordem = Object.keys(CORES_REGIOES);
      uniqueValues.sort((x, y) => ordem.indexOf(x) - ordem.indexOf(y));
      colorScale = (value) => CORES_REGIOES[value];
    } else {
      const colorRange = categoricalColors(opts.categoricalPalette, uniqueValues.length);
      colorScale = scaleOrdinal().domain(uniqueValues).range(colorRange);
    }

    const matchExpression = ['match', ['to-string', ['get', attribute]]];
    uniqueValues.forEach(value => {
      matchExpression.push(value, colorScale(value));
    });
    matchExpression.push(NO_DATA_COLOR); // Sem dados / valores não listados
    return matchExpression;
  }
};

const toHex = (value) => {
  const c = d3color(value);
  return c ? c.formatHex() : value;
};

// Itens da legenda correspondentes exatamente à expressão gerada por getColorScale.
// `missingCount` = quantidade de municípios sem dado (gera o item "Sem dados (n)").
export const buildLegendItems = (scaleExpression, values, missingCount = 0) => {
  const type = scaleExpression?.[0];
  const items = [];
  if (type === 'match') {
    const valores = [];
    for (let i = 2; i < scaleExpression.length - 1; i += 2) valores.push(`${scaleExpression[i]}`);
    const regioes = ehRegiao(valores);
    for (let i = 2; i < scaleExpression.length - 1; i += 2) {
      const v = `${scaleExpression[i]}`;
      items.push({ value: regioes ? NOMES_REGIOES[v] : v, color: toHex(scaleExpression[i + 1]) });
    }
  } else if (type === 'step') {
    const numericValues = (values || []).map(makeNumberParser(values)).filter((v) => !Number.isNaN(v)).sort((a, b) => a - b);
    if (!numericValues.length) return { type: 'dynamic', items: [] };
    // Casas decimais conforme a grandeza (valores de normalização/intervalos iguais têm muitas)
    const fmt = (v) => v.toLocaleString('pt-BR', { maximumFractionDigits: Math.abs(v) >= 100 ? 1 : Math.abs(v) >= 1 ? 2 : 3 });
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

// Aplica as cores de uma legenda editada pelo usuário à expressão gerada por getColorScale.
// A ordem dos itens corresponde à ordem das classes; o item "Sem dados" (último) é ignorado.
export const applyCustomLegendColors = (expression, customLegend) => {
  const items = customLegend?.items;
  if (!Array.isArray(expression) || !items?.length) return expression;
  const out = [...expression];
  if (out[0] === 'match') {
    // cores nos índices 3, 5, 7... (o último elemento é a cor padrão)
    items.forEach((item, i) => {
      const idx = 3 + i * 2;
      if (idx < out.length - 1 && !item.noData) out[idx] = item.color;
    });
  } else if (out[0] === 'step') {
    // cor inicial no índice 2, depois 4, 6, 8...
    items.forEach((item, i) => {
      if (item.noData) return;
      const idx = i === 0 ? 2 : 4 + (i - 1) * 2;
      if (idx < out.length) out[idx] = item.color;
    });
    // classe única: o limiar sentinela repete a cor da classe
    if (out.length === 5 && out[3] === STEP_SENTINEL) out[4] = out[2];
  }
  return out;
};

// Valor exibido no mapa para cada linha: o próprio atributo ou, com normalização,
// atributo ÷ coluna de referência × fator (ex.: casos ÷ população × 100.000).
// O formato numérico de cada coluna é decidido pela coluna inteira (`allRows`).
export function makeVizValueGetter(allRows, attribute, symbology) {
  const column = (name) => (allRows || []).map(r => r?.[name]).filter(v => !isNoDataMarker(v));
  const col = column(attribute);
  const numeric = attribute !== 'Nome_Municipio' && isNumericValues(col);
  const parseNum = makeNumberParser(col);
  const toNum = (parse, v) => {
    if (typeof v === 'number') return Number.isFinite(v) ? v : NaN;
    return isNoDataMarker(v) ? NaN : parse(v);
  };
  const by = symbology?.normalizeBy;
  if (!by || !numeric) {
    return {
      numeric,
      normalized: false,
      get: (row) => {
        const v = row?.[attribute];
        if (isNoDataMarker(v)) return null;
        if (!numeric) return `${v}`;
        const n = toNum(parseNum, v);
        return Number.isNaN(n) ? null : n;
      },
    };
  }
  const parseDen = makeNumberParser(column(by));
  const factor = Number(symbology.factor) || 1;
  return {
    numeric: true,
    normalized: true,
    get: (row) => {
      const n = toNum(parseNum, row?.[attribute]);
      const d = toNum(parseDen, row?.[by]);
      return Number.isFinite(n) && Number.isFinite(d) && d !== 0 ? (n / d) * factor : null;
    },
  };
}

// Título legível de uma variável normalizada: "casos por 100.000 População"
export const normalizedLabel = (attribute, symbology) => {
  if (!symbology?.normalizeBy) return rotuloAtributo(attribute);
  const f = Number(symbology.factor) || 1;
  return `${rotuloAtributo(attribute)} ÷ ${rotuloAtributo(symbology.normalizeBy)}${f !== 1 ? ` × ${f.toLocaleString('pt-BR')}` : ''}`;
};

// Nomes típicos de contagens absolutas (mapa coroplético de totais engana: municípios
// grandes/populosos sempre aparecem com as cores mais fortes)
export const looksLikeAbsoluteCount = (attribute) =>
  /popula|habitantes|^total|_total|quantidade|^qtd|^n[ºo°]?_|numero|número|casos|obitos|óbitos|nascidos|matr[ií]culas|eleitores|domic[ií]lios|empregos|estabelecimentos/i.test(attribute || '');
