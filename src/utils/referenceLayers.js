// Camadas de referência: geometrias do aluno (bairros, rios, escolas…) desenhadas por cima
// do mapa temático, com uma cor cada. Ficam no estilo do mapa, então a prévia e a exportação
// do Estúdio (que copiam o estilo) as levam junto.
import { FONT_REGULAR, enforceAppLayerOrder } from './basemaps';

export const REF_PREFIX = 'ref-';
// Cores da identidade (bem distintas do azul-petróleo das escalas de dados)
export const REF_COLORS = ['#BD5223', '#3E5D1B', '#6B3FA0', '#8A5A00', '#1A1814', '#1288A1'];

export const newReferenceLayer = ({ nome, features, formato }, index = 0) => ({
  id: `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
  nome: nome || 'Camada',
  formato,
  cor: REF_COLORS[index % REF_COLORS.length],
  visivel: true,
  rotulo: '', // propriedade usada como rótulo ('' = sem rótulo)
  data: { type: 'FeatureCollection', features },
});

const ids = (id) => ({
  source: `${REF_PREFIX}${id}`,
  fill: `${REF_PREFIX}${id}-fill`,
  line: `${REF_PREFIX}${id}-line`,
  point: `${REF_PREFIX}${id}-point`,
  label: `${REF_PREFIX}${id}-label`,
});

const POLY = ['match', ['geometry-type'], ['Polygon', 'MultiPolygon'], true, false];
const LINE_OR_POLY = ['match', ['geometry-type'], ['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'], true, false];
const POINT = ['match', ['geometry-type'], ['Point', 'MultiPoint'], true, false];

// Ordem das camadas sem serializar o estilo (getStyle copiaria os dados de todas as fontes)
const layerOrder = (map) => (map.getLayersOrder ? map.getLayersOrder() : (map.getStyle()?.layers || []).map(l => l.id));

// Primeira camada que deve ficar ACIMA das de referência (rótulos e anotações)
const beforeId = (map) => layerOrder(map).find(id => id === 'sectors-label-layer' || id.startsWith('annotations-'));

// Deixa o mapa com exatamente as camadas de `layers` (cria, atualiza, remove)
export function syncReferenceLayers(map, layers) {
  if (!map) return;
  const wanted = new Set((layers || []).map(l => `${REF_PREFIX}${l.id}`));
  // Remove as que saíram
  layerOrder(map).filter(id => id.startsWith(REF_PREFIX) && !wanted.has(map.getLayer(id)?.source)).forEach(id => map.removeLayer(id));
  const criadas = map.__refSources || (map.__refSources = new Set());
  [...criadas].filter(s => !wanted.has(s)).forEach(s => { if (map.getSource(s)) map.removeSource(s); criadas.delete(s); });

  (layers || []).forEach(layer => {
    const n = ids(layer.id);
    const vis = layer.visivel === false ? 'none' : 'visible';
    const src = map.getSource(n.source);
    if (!src) { map.addSource(n.source, { type: 'geojson', data: layer.data }); criadas.add(n.source); }
    else if (src.__refData !== layer.data) src.setData(layer.data);
    map.getSource(n.source).__refData = layer.data;

    const before = beforeId(map);
    if (!map.getLayer(n.fill)) map.addLayer({ id: n.fill, type: 'fill', source: n.source, filter: POLY, paint: { 'fill-opacity': 0.18 } }, before);
    if (!map.getLayer(n.line)) map.addLayer({ id: n.line, type: 'line', source: n.source, filter: LINE_OR_POLY, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-width': 2 } }, before);
    if (!map.getLayer(n.point)) map.addLayer({ id: n.point, type: 'circle', source: n.source, filter: POINT, paint: { 'circle-radius': 5, 'circle-stroke-width': 1.5, 'circle-stroke-color': '#FFFFFF' } }, before);
    if (!map.getLayer(n.label)) {
      map.addLayer({
        id: n.label, type: 'symbol', source: n.source,
        layout: { 'text-font': [FONT_REGULAR], 'text-size': 12, 'text-max-width': 10, 'text-offset': [0, 0.9], 'text-anchor': 'top', 'text-optional': true },
        paint: { 'text-color': '#1A1814', 'text-halo-color': 'rgba(255,255,255,0.92)', 'text-halo-width': 1.4 },
      }, before);
    }
    map.setPaintProperty(n.fill, 'fill-color', layer.cor);
    map.setPaintProperty(n.line, 'line-color', layer.cor);
    map.setPaintProperty(n.point, 'circle-color', layer.cor);
    map.setLayoutProperty(n.label, 'text-field', layer.rotulo ? ['to-string', ['coalesce', ['get', layer.rotulo], '']] : '');
    [n.fill, n.line, n.point].forEach(id => map.setLayoutProperty(id, 'visibility', vis));
    map.setLayoutProperty(n.label, 'visibility', layer.rotulo ? vis : 'none');
  });
  // Acima do mapa temático e abaixo de rótulos e anotações (ver enforceAppLayerOrder)
  enforceAppLayerOrder(map);
}

// Propriedades disponíveis para rótulo (as das primeiras feições)
export const referenceLayerFields = (layer) => {
  const keys = new Set();
  (layer?.data?.features || []).slice(0, 50).forEach(f => Object.keys(f.properties || {}).forEach(k => keys.add(k)));
  return [...keys];
};

// Camadas vindas de um perfil/modelo (arquivo externo): só o formato esperado
export function sanitizeReferenceLayers(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(l => l && l.data?.type === 'FeatureCollection' && Array.isArray(l.data.features)).map((l, i) => ({
    id: String(l.id || '').replace(/[^a-z0-9]/gi, '').slice(0, 24) || `c${i}`,
    nome: String(l.nome || 'Camada').slice(0, 80),
    formato: typeof l.formato === 'string' ? l.formato.slice(0, 30) : undefined,
    cor: /^#[0-9a-f]{6}$/i.test(l.cor) ? l.cor : REF_COLORS[i % REF_COLORS.length],
    visivel: l.visivel !== false,
    rotulo: typeof l.rotulo === 'string' ? l.rotulo : '',
    data: { type: 'FeatureCollection', features: l.data.features.filter(f => f && f.geometry) },
  }));
}
