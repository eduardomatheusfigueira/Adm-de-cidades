import { describe, it, expect } from 'vitest';
import { formatDMS, graticuleInterval, buildGraticule } from '../graticule';

describe('formatDMS', () => {
  it('graus inteiros, minutos e segundos com hemisfério em português', () => {
    expect(formatDMS(-23.5, 'lat')).toBe('23°30′ S');
    expect(formatDMS(-46.25, 'lng')).toBe('46°15′ O');
    expect(formatDMS(10, 'lat')).toBe('10° N');
    expect(formatDMS(35, 'lng')).toBe('35° L');
    expect(formatDMS(0, 'lat')).toBe('0°');
    expect(formatDMS(-(23 + 1 / 60 + 30 / 3600), 'lat')).toBe('23°01′30″ S');
  });
  it('não gera 59,999″ por erro de ponto flutuante', () => {
    expect(formatDMS(-(1 / 6) * 139, 'lat')).toBe('23°10′ S');
  });
});

describe('buildGraticule', () => {
  it('espaçamento diminui com o zoom', () => {
    expect(graticuleInterval(3)).toBe(5);
    expect(graticuleInterval(7)).toBe(1);
    expect(graticuleInterval(14)).toBeCloseTo(1 / 60);
  });
  it('zoom baixo cobre o mundo; zoom alto só a área visível, com poucas linhas', () => {
    const mundo = buildGraticule(3, [-80, -40, -30, 10]);
    expect(mundo.features.some(f => f.properties.value === -180)).toBe(true);
    const bairro = buildGraticule(14, [-46.66, -23.57, -46.62, -23.54]);
    expect(bairro.features.length).toBeLessThan(40);
    expect(bairro.features.find(f => f.properties.axis === 'lat' && Math.abs(f.properties.value + 23.55) < 1e-9).properties.label).toBe('23°33′ S');
  });
});

import { frameTickValues } from '../graticule';

describe('frameTickValues', () => {
  it('escolhe o passo mais fino que cabe no limite de marcas', () => {
    expect(frameTickValues(-53.1, -44.2, 6)).toEqual([-52, -50, -48, -46]);
    expect(frameTickValues(-25.3, -19.8, 6)).toEqual([-25, -24, -23, -22, -21, -20]);
    const bairro = frameTickValues(-46.66, -46.62, 6);
    expect(bairro.length).toBeGreaterThan(1);
    expect(bairro.length).toBeLessThanOrEqual(6);
  });
});
