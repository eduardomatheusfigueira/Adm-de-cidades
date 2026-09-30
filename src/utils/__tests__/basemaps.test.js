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

import { enforceAppLayerOrder } from '../basemaps';

// Mapa falso com getLayersOrder/moveLayer (moveLayer sem "before" leva ao topo)
const fakeMap = (ids) => {
  const order = [...ids];
  return {
    style: { _loaded: true },
    moves: 0,
    getLayersOrder: () => [...order],
    moveLayer(id) { this.moves++; order.splice(order.indexOf(id), 1); order.push(id); },
  };
};

describe('enforceAppLayerOrder', () => {
  it('põe anotações acima do mapa temático recriado e referências entre eles', () => {
    const m = fakeMap(['background', 'water', 'annotations-fill-layer', 'annotations-point-layer', 'ref-a-fill', 'ref-a-label',
      'sectors-fill-layer', 'sectors-nodata-hatch', 'sectors-selected-line', 'sectors-label-layer']);
    expect(enforceAppLayerOrder(m)).toBe(true);
    expect(m.getLayersOrder()).toEqual(['background', 'water', 'sectors-fill-layer', 'sectors-nodata-hatch', 'ref-a-fill',
      'sectors-selected-line', 'sectors-label-layer', 'ref-a-label', 'annotations-fill-layer', 'annotations-point-layer']);
  });
  it('não mexe quando a ordem já está certa', () => {
    const m = fakeMap(['background', 'sectors-fill-layer', 'ref-a-line', 'sectors-label-layer', 'annotations-point-layer']);
    expect(enforceAppLayerOrder(m)).toBe(false);
    expect(m.moves).toBe(0);
  });
  it('camada do mapa base acima das do app é corrigida', () => {
    const m = fakeMap(['sectors-fill-layer', 'place-labels']);
    expect(enforceAppLayerOrder(m)).toBe(true);
    expect(m.getLayersOrder()).toEqual(['place-labels', 'sectors-fill-layer']);
  });
});
