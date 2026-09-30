import { describe, it, expect } from 'vitest';
import { expression } from '@maplibre/maplibre-gl-style-spec';
import {
  getColorScale, withNoDataColor, buildLegendItems, parseNumberBR, makeNumberParser,
  usesDecimalComma, applyCustomLegendColors, NO_DATA_COLOR,
} from '../colorUtils';

// Compila a expressão com o validador do próprio MapLibre e avalia para um valor
const compile = (expr) => {
  const r = expression.createExpression(expr, { type: 'color' });
  if (r.result !== 'success') throw new Error(r.value.map(e => e.message).join('; '));
  return r.value;
};
const colorOf = (expr, props) => compile(expr).evaluate({ zoom: 0 }, { properties: props, type: 'Polygon' }).toString();
const thresholds = (e) => e.filter((_, i) => i >= 3 && i % 2 === 1);

describe('parseNumberBR', () => {
  it('lê formatos brasileiro e internacional', () => {
    expect(parseNumberBR('1.234,56')).toBe(1234.56);
    expect(parseNumberBR('590,3')).toBe(590.3);
    expect(parseNumberBR('1234.5')).toBe(1234.5);
    expect(parseNumberBR('1.234.567')).toBe(1234567);
    expect(parseNumberBR('-3,5')).toBe(-3.5);
    expect(parseNumberBR(' 42 ')).toBe(42);
  });
  it('trata marcadores de "sem dado" e texto como NaN', () => {
    ['-', '', '...', 'abc', null, undefined].forEach(v => expect(Number.isNaN(parseNumberBR(v))).toBe(true));
  });
  it('decide o formato pela coluna inteira', () => {
    expect(usesDecimalComma(['22.516', '1.000,5'])).toBe(true);
    expect(usesDecimalComma(['845', '22.516', '1.234.567'])).toBe(true);
    expect(usesDecimalComma(['0.125', '3'])).toBe(false);
    expect(usesDecimalComma(['3.14', '2.5'])).toBe(false);
    expect(makeNumberParser(['22.516', '1.000,5'])('22.516')).toBe(22516);
  });
});

describe('getColorScale', () => {
  const fib = [1, 2, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

  it.each([
    ['um valor', ['164']],
    ['dois valores', ['1', '2']],
    ['empates', ['1', '2', '2', '2', '3']],
    ['zeros', ['0', '0', '0', '0', '5']],
    ['vírgula e sem dado', ['590,3', '1.234,5', '10', '-', '']],
  ])('gera expressão válida com %s', (_, vals) => {
    const e = withNoDataColor('a', getColorScale('a', vals));
    expect(() => compile(e)).not.toThrow();
  });

  it('pinta nulo, ausente e texto com a cor "Sem dados"', () => {
    const e = withNoDataColor('a', getColorScale('a', fib));
    const noData = compile(['literal', NO_DATA_COLOR]).evaluate({ zoom: 0 }).toString();
    [{ a: null }, {}, { a: 'abc' }, { a: '' }].forEach(p => expect(colorOf(e, p)).toBe(noData));
    expect(colorOf(e, { a: 0 })).not.toBe(noData);
  });

  it.each(['quantile', 'jenks', 'equal'])('método %s: limiares crescentes e dentro dos dados', (method) => {
    const e = getColorScale('a', fib, { method, classes: 5 });
    const t = thresholds(e);
    expect(t.length).toBeGreaterThan(0);
    expect(t.length).toBeLessThanOrEqual(4);
    t.forEach((v, i) => { expect(v).toBeGreaterThan(1); expect(v).toBeLessThanOrEqual(987); if (i) expect(v).toBeGreaterThan(t[i - 1]); });
    expect(() => compile(withNoDataColor('a', e))).not.toThrow();
  });

  it('intervalos iguais dividem a amplitude em partes iguais', () => {
    expect(thresholds(getColorScale('a', [0, 100], { method: 'equal', classes: 4 }))).toEqual([25, 50, 75]);
  });

  it('quebras manuais aceitam vírgula decimal e ignoram limites fora dos dados', () => {
    expect(thresholds(getColorScale('a', fib, { method: 'manual', breaks: ['10', '100,5', '5000'] }))).toEqual([10, 100.5]);
  });

  it('respeita o número de classes e inverte a paleta', () => {
    const e = getColorScale('a', fib, { method: 'jenks', classes: 7, palette: 'Viridis' });
    const r = getColorScale('a', fib, { method: 'jenks', classes: 7, palette: 'Viridis', reverse: true });
    expect(thresholds(e).length).toBe(6);
    expect(r[2]).toBe(e[e.length - 1]);
  });

  it('categorias usam a paleta escolhida e cinza para o resto', () => {
    const e = getColorScale('r', ['N', 'S', '-', 'N'], { categoricalPalette: 'OkabeIto' });
    expect(e.slice(2, 6)).toEqual(['N', '#E69F00', 'S', '#56B4E9']);
    expect(e[e.length - 1]).toBe(NO_DATA_COLOR);
  });
});

describe('legenda', () => {
  it('rótulos em pt-BR e item "Sem dados"', () => {
    const vals = ['22.516', '1.000,5', '90000'];
    const e = getColorScale('p', vals);
    const { items } = buildLegendItems(e, vals, 2);
    expect(items.map(i => i.value)).toEqual(['1.000,5 a menos de 22.516', '22.516 a menos de 90.000', '90.000', 'Sem dados (2)']);
  });
  it('cores editadas pelo usuário substituem as da classificação', () => {
    const e = getColorScale('a', ['1', '2', '3']);
    const custom = applyCustomLegendColors(e, { items: [{ color: '#000000' }, { color: '#111111' }, { color: '#222222' }] });
    expect(custom[2]).toBe('#000000');
    expect(custom[4]).toBe('#111111');
  });
});

import { makeVizValueGetter, looksLikeAbsoluteCount, normalizedLabel } from '../colorUtils';

describe('normalização', () => {
  const rows = [
    { pop: '1.000', area: '10,5', uf: 'SP' },
    { pop: '22.516', area: '100', uf: 'RJ' },
    { pop: '-', area: '50', uf: 'MG' },
    { pop: '500', area: '0', uf: 'ES' },
  ];
  it('sem normalização: número no formato da coluna', () => {
    const g = makeVizValueGetter(rows, 'pop', null);
    expect(g.numeric).toBe(true);
    expect(rows.map(g.get)).toEqual([1000, 22516, null, 500]);
  });
  it('divide pela coluna de referência e multiplica pelo fator; divisão por zero vira "sem dados"', () => {
    const g = makeVizValueGetter(rows, 'pop', { normalizeBy: 'area', factor: 1 });
    expect(g.normalized).toBe(true);
    const v = rows.map(g.get);
    expect(v[0]).toBeCloseTo(1000 / 10.5);
    expect(v[1]).toBeCloseTo(225.16);
    expect(v[2]).toBeNull();
    expect(v[3]).toBeNull();
    expect(makeVizValueGetter(rows, 'pop', { normalizeBy: 'area', factor: 100000 }).get(rows[1])).toBeCloseTo(22516000);
  });
  it('categorias não são normalizadas', () => {
    const g = makeVizValueGetter(rows, 'uf', { normalizeBy: 'area' });
    expect(g.numeric).toBe(false);
    expect(g.get(rows[0])).toBe('SP');
  });
  it('reconhece contagens absolutas e monta o rótulo', () => {
    expect(looksLikeAbsoluteCount('populacao')).toBe(true);
    expect(looksLikeAbsoluteCount('Total de casos')).toBe(true);
    expect(looksLikeAbsoluteCount('taxa_alfabetizacao')).toBe(false);
    expect(normalizedLabel('casos', { normalizeBy: 'populacao', factor: 100000 })).toBe('casos ÷ populacao × 100.000');
  });
});
