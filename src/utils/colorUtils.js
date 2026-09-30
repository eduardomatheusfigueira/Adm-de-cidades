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

// ── Escalas do guia de identidade (seção 06 · Dados e mapas) ───────────────
// Rampas de 11 tons (50 → 950); as classes são tiradas de forma equidistante entre 100 e 900.
const RAMPA_PETROLEO = ['#EDF7FB', '#D6ECF3', '#B8DBE6', '#93C4D2', '#67A6B8', '#3D899D', '#1D6E82', '#015668', '#004554', '#003440', '#00242D'];
const RAMPA_TERRACOTA = ['#FFF2ED', '#FEE1D6', '#FBC7B3', '#F2A588', '#E5845E', '#D5683B', '#BD5223', '#A04318', '#823513', '#65280D', '#471D0C'];
// Divergente: dois braços iguais e um centro neutro (Papel 200), sem julgamento de "bom" ou "ruim".
const ANCORAS_DIVERGENTE = ['#015668', '#3D899D', '#93C4D2', '#F0ECE5', '#F2A588', '#D5683B', '#A04318'];

export const ESCALAS_NUMERICAS = {
  petroleo: { nome: 'Petróleo', descricao: 'Sequencial · quantidade' },
  terracota: { nome: 'Terracota', descricao: 'Sequencial · segunda medida' },
  divergente: { nome: 'Divergente', descricao: 'Desvio em torno do centro' },
};

const daRampa = (rampa, n) => {
  if (n <= 1) return [rampa[5]];
  return Array.from({ length: n }, (_, i) => rampa[Math.round(1 + (i * 8) / (n - 1))]);
};

// Paleta com exatamente n cores (1 a 9) para a escala escolhida.
export const sequentialColors = (n, scheme = 'petroleo') => {
  if (Array.isArray(scheme)) {
    if (scheme.length === n) return scheme;
    scheme = 'petroleo';
  }
  if (scheme === 'terracota') return daRampa(RAMPA_TERRACOTA, n);
  if (scheme === 'divergente') {
    if (n <= 1) return [ANCORAS_DIVERGENTE[3]];
    const interp = d3.piecewise(d3.interpolateLab, ANCORAS_DIVERGENTE);
    return Array.from({ length: n }, (_, i) => d3.color(interp(i / (n - 1))).formatHex().toUpperCase());
  }
  return daRampa(RAMPA_PETROLEO, n);
};

// Categórica: ordem fixa (validada para daltonismo nas cinco primeiras). As regiões têm cor própria.
export const CORES_REGIOES = { N: '#3E5D1B', NE: '#DBAD36', CO: '#CC6349', SE: '#1288A1', S: '#A87EEB' };
export const NOMES_REGIOES = { N: 'Norte', NE: 'Nordeste', CO: 'Centro-Oeste', SE: 'Sudeste', S: 'Sul' };
const CATEGORICA_SISINFO = ['#1288A1', '#CC6349', '#3E5D1B', '#DBAD36', '#A87EEB', '#6B8FD6', '#8C6D46', '#D77FA1', '#5E9E7E', '#A39E93'];

const ehRegiao = (valores) => valores.length > 0 && valores.every(v => Object.prototype.hasOwnProperty.call(CORES_REGIOES, v));

// Muitas categorias: tons de mesma luminosidade média espalhados no círculo cromático
// (mais sóbrio que o arco-íris "turbo" e sem cores fluorescentes).
const coresCategoricasExtras = (n) => Array.from({ length: n }, (_, i) =>
  d3.hcl((200 + (i * 360) / n) % 360, 42, i % 2 ? 52 : 66).formatHex());

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

// Opções de cor que acompanham a configuração de visualização (escala e número de classes).
export const scaleOptionsFromConfig = (config) => ({
  classes: Math.min(9, Math.max(2, parseInt(config?.classes, 10) || 5)),
  scheme: ESCALAS_NUMERICAS[config?.scheme] ? config.scheme : 'petroleo',
});

// Default schemes
const defaultNumericScheme = 'petroleo';
const defaultCategoricalScheme = CATEGORICA_SISINFO;

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
    let colorScale;
    if (ehRegiao(uniqueValues)) {
      // Na ordem do IBGE: Norte, Nordeste, Centro-Oeste, Sudeste, Sul
      const ordem = Object.keys(CORES_REGIOES);
      uniqueValues.sort((a, b) => ordem.indexOf(a) - ordem.indexOf(b));
      // Regiões: sempre as mesmas cores, em qualquer recorte
      colorScale = (value) => CORES_REGIOES[value];
    } else {
      const colorRange = uniqueValues.length > categoricalScheme.length
        ? coresCategoricasExtras(uniqueValues.length)
        : categoricalScheme;
      colorScale = d3.scaleOrdinal().domain(uniqueValues).range(colorRange);
    }

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
