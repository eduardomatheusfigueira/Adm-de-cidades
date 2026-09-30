import { describe, it, expect } from 'vitest';
import { generateExportHtml } from '../exportMap';

const refLayer = {
  id: 'abc', cor: '#BD5223', rotulo: 'nome', visivel: true,
  data: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { nome: '</script><script>alert(1)</script>' }, geometry: { type: 'Point', coordinates: [-46.6, -23.5] } }] },
};

const gerar = (extra = {}) => generateExportHtml({
  annotations: [], vizName: 'Teste', mapCenter: [-46.6, -23.5], mapZoom: 8, mapBearing: 0,
  mapStyle: { version: 8, sources: {}, layers: [] }, municipalityGeoJson: null, municipalityColorExpression: null,
  colorLegend: null, renderMode: 'filled', fillOpacity: 0.85, borderWidth: 2, ...extra,
});

describe('generateExportHtml', () => {
  it('inclui as camadas de referência visíveis sem permitir fechar a tag <script>', () => {
    const html = gerar({ referenceLayers: [refLayer, { ...refLayer, id: 'oculta', visivel: false }] });
    expect(html).toContain("'ref-' + l.id");
    expect(html).toContain('"id":"abc"');
    expect(html).not.toContain('"id":"oculta"');
    expect(html).not.toMatch(/<\/script><script>alert/);
  });

  it('os scripts inline são JavaScript válido', () => {
    const html = gerar({ referenceLayers: [refLayer] });
    const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
    expect(inline.length).toBeGreaterThan(0);
    inline.forEach(code => expect(() => new Function(code)).not.toThrow());
  });
});
