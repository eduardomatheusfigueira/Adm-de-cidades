import { describe, it, expect } from 'vitest';
import { hatchImage } from '../hatch';
import { noDataHatchFilter, withNoDataColor, NO_DATA_COLOR } from '../colorUtils';

describe('hachura "Sem dados"', () => {
  it('gera um padrão RGBA quadrado, com traços e transparência', () => {
    const img = hatchImage(2);
    expect(img.width).toBe(16);
    expect(img.height).toBe(16);
    expect(img.data.length).toBe(16 * 16 * 4);
    const alphas = [];
    for (let i = 3; i < img.data.length; i += 4) alphas.push(img.data[i]);
    expect(alphas.some(a => a === 255)).toBe(true); // traço
    expect(alphas.some(a => a === 0)).toBe(true); // fundo transparente
  });

  it('o padrão se repete sem emenda (bordas opostas iguais)', () => {
    const { width: n, data } = hatchImage(2);
    const a = (x, y) => data[(y * n + x) * 4 + 3];
    for (let y = 0; y < n; y++) expect(Math.abs(a(0, y) - a(n - 1, (y + 1) % n))).toBeLessThan(2);
  });

  it('filtro só existe em escalas numéricas e usa a mesma condição da cor', () => {
    const step = ['step', ['to-number', ['get', 'v']], '#a', 10, '#b'];
    const f = noDataHatchFilter('v', step);
    expect(Array.isArray(f)).toBe(true);
    expect(withNoDataColor('v', step)).toEqual(['case', f, NO_DATA_COLOR, step]);
    expect(noDataHatchFilter('v', ['match', ['get', 'v'], 'x', '#a', '#b'])).toBe(false);
  });
});
