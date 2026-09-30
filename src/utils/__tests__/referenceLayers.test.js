import { describe, it, expect } from 'vitest';
import { sanitizeReferenceLayers, newReferenceLayer, REF_COLORS } from '../referenceLayers';

describe('camadas de referência', () => {
  it('cria com cor da identidade e dados em FeatureCollection', () => {
    const l = newReferenceLayer({ nome: 'Rios', features: [], formato: 'KML' }, 1);
    expect(l.cor).toBe(REF_COLORS[1]);
    expect(l.data).toEqual({ type: 'FeatureCollection', features: [] });
    expect(l.id).toMatch(/^[a-z0-9]+$/);
  });

  it('perfil externo: descarta o que não é camada e limpa id, cor e nome', () => {
    const out = sanitizeReferenceLayers([
      { id: 'a"-x);alert(1)', nome: 'x'.repeat(200), cor: 'red; background:url(x)', data: { type: 'FeatureCollection', features: [{ geometry: null }, { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] } }] } },
      { id: 'b', data: { type: 'Feature' } },
      null,
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('axalert1');
    expect(out[0].nome).toHaveLength(80);
    expect(out[0].cor).toBe(REF_COLORS[0]);
    expect(out[0].data.features).toHaveLength(1);
    expect(sanitizeReferenceLayers(undefined)).toEqual([]);
  });
});
