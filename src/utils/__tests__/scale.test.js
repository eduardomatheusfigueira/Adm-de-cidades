import { describe, it, expect } from 'vitest';
import { pickScaleDistance, metersPerPixel } from '../scale';

describe('escala gráfica', () => {
  it.each([[3, -3], [5.12, -15], [10, -23.5], [15, -30]])('zoom %s, lat %s: barra = distância / m-por-pixel', (zoom, lat) => {
    const { meters, barPx, mpp } = pickScaleDistance(300, zoom, lat);
    expect(mpp).toBeCloseTo(metersPerPixel(zoom, lat));
    expect(barPx * mpp).toBeCloseTo(meters, 6);
    expect(barPx).toBeLessThanOrEqual(300);
    expect(barPx).toBeGreaterThan(300 / 5 - 1); // 1-2-5: nunca menos que ~1/2,5 do espaço
    expect([1, 2, 5]).toContain(Math.round(meters / Math.pow(10, Math.floor(Math.log10(meters)))));
  });
});

import { symbolLegendCircles, symbolRadius, SYMBOL_MAX_RADIUS } from '../proportional';

describe('símbolos proporcionais', () => {
  it('área proporcional ao valor (raio ∝ √valor)', () => {
    expect(symbolRadius(100, 100)).toBe(SYMBOL_MAX_RADIUS);
    expect(symbolRadius(25, 100)).toBeCloseTo(SYMBOL_MAX_RADIUS / 2);
    expect(symbolRadius(0, 100)).toBe(0);
  });
  it('legenda com valores redondos e decrescentes', () => {
    const c = symbolLegendCircles(128127);
    expect(c.map(x => x.value)).toEqual([100000, 25000, 5000]);
    c.forEach((x, i) => { if (i) expect(x.r).toBeLessThan(c[i - 1].r); });
  });
});
