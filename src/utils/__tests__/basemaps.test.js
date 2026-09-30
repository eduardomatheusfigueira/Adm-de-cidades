import { describe, it, expect } from 'vitest';
import { normalizeBasemap, isTrustedStyleUrl, DEFAULT_BASEMAP } from '../basemaps';

describe('normalizeBasemap', () => {
  it('aceita ids conhecidos e traduz URLs mapbox:// antigas', () => {
    expect(normalizeBasemap('satelite')).toBe('satelite');
    expect(normalizeBasemap('mapbox://styles/mapbox/dark-v11')).toBe('escuro');
  });

  it('aceita estilos do OpenFreeMap por URL', () => {
    const url = 'https://tiles.openfreemap.org/styles/liberty';
    expect(isTrustedStyleUrl(url)).toBe(true);
    expect(normalizeBasemap(url)).toBe(url);
  });

  it('recusa estilos de outros servidores (perfil ou ?modelo= malicioso)', () => {
    for (const v of ['https://evil.example/style.json', 'http://tiles.openfreemap.org/styles/liberty',
      'https://tiles.openfreemap.org.evil.example/s', 'javascript:alert(1)', 'data:application/json,{}']) {
      expect(isTrustedStyleUrl(v)).toBe(false);
      expect(normalizeBasemap(v)).toBe(DEFAULT_BASEMAP);
    }
  });
});
