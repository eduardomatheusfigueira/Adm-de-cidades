// Mapas base gratuitos para o MapLibre GL — sem token, sem conta, sem cobrança.
//
// Todos os estilos compartilham o mesmo servidor de fontes (glyphs) do OpenFreeMap,
// para que as camadas de texto do app (rótulos, gratícula, anotações) funcionem
// em qualquer mapa base. As fontes disponíveis são as da família Noto Sans.

const OFM = 'https://tiles.openfreemap.org';
export const GLYPHS_URL = `${OFM}/fonts/{fontstack}/{range}.pbf`;

export const FONT_REGULAR = 'Noto Sans Regular';
export const FONT_BOLD = 'Noto Sans Bold';
export const FONT_ITALIC = 'Noto Sans Italic';

// O servidor só tem Regular, Bold e Italic (não há Bold Italic nem Medium).
export const getFontStack = (weight = 'Regular', italic = false) => {
  if (italic) return [FONT_ITALIC];
  if (weight === 'Bold') return [FONT_BOLD];
  return [FONT_REGULAR];
};

const OSM_ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> ' +
  '<a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">© OpenMapTiles</a> ' +
  'Dados de <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a>';

// Fundo de uma cor só, 100% local: funciona mesmo sem internet para os mapas base.
const plainStyle = (color, name) => ({
  version: 8,
  name,
  glyphs: GLYPHS_URL,
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': color } }],
});

// Mapa base mínimo para mapas temáticos: só água e limites de países/estados, sem rótulos.
// Se os tiles não carregarem, sobra o fundo liso e o mapa continua utilizável.
const minimalStyle = () => ({
  version: 8,
  name: 'Mínimo',
  glyphs: GLYPHS_URL,
  sources: {
    openmaptiles: { type: 'vector', url: `${OFM}/planet`, attribution: OSM_ATTRIBUTION },
  },
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': '#f4f1ea' } },
    {
      id: 'water', type: 'fill', source: 'openmaptiles', 'source-layer': 'water',
      paint: { 'fill-color': '#cfe0ea' },
    },
    {
      id: 'boundary-state', type: 'line', source: 'openmaptiles', 'source-layer': 'boundary',
      filter: ['all', ['==', ['get', 'admin_level'], 4], ['!=', ['get', 'maritime'], 1]],
      paint: { 'line-color': '#b9b2a6', 'line-width': 0.6, 'line-dasharray': [3, 2] },
    },
    {
      id: 'boundary-country', type: 'line', source: 'openmaptiles', 'source-layer': 'boundary',
      filter: ['all', ['==', ['get', 'admin_level'], 2], ['!=', ['get', 'maritime'], 1]],
      paint: { 'line-color': '#8f877a', 'line-width': 1.1 },
    },
  ],
});

const satelliteStyle = () => ({
  version: 8,
  name: 'Satélite',
  glyphs: GLYPHS_URL,
  sources: {
    esri: {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      maxzoom: 19,
      attribution: 'Imagens © Esri, Maxar, Earthstar Geographics',
    },
  },
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': '#1d2a33' } },
    { id: 'satellite', type: 'raster', source: 'esri' },
  ],
});

export const DEFAULT_BASEMAP = 'minimo';
// Estilo 100% local usado quando um mapa base remoto não carrega.
export const FALLBACK_BASEMAP = 'liso';

export const BASEMAPS = [
  { id: 'minimo', label: 'Mínimo (recomendado p/ mapas temáticos)', style: minimalStyle },
  { id: 'liso', label: 'Fundo liso (funciona offline)', style: () => plainStyle('#f4f1ea', 'Fundo liso') },
  { id: 'branco', label: 'Fundo branco (funciona offline)', style: () => plainStyle('#ffffff', 'Fundo branco') },
  { id: 'claro', label: 'Claro', style: `${OFM}/styles/positron` },
  { id: 'ruas', label: 'Ruas', style: `${OFM}/styles/liberty` },
  { id: 'colorido', label: 'Colorido', style: `${OFM}/styles/bright` },
  { id: 'escuro', label: 'Escuro', style: `${OFM}/styles/dark` },
  { id: 'satelite', label: 'Satélite', style: satelliteStyle },
];

// Perfis e páginas salvos antes da migração guardam URLs mapbox://; traduz para o equivalente.
const LEGACY_MAPBOX = {
  'light-v11': 'claro',
  'dark-v11': 'escuro',
  'streets-v12': 'ruas',
  'outdoors-v12': 'ruas',
  'satellite-v9': 'satelite',
  'satellite-streets-v12': 'satelite',
};

// Normaliza qualquer valor salvo (id, URL mapbox:// antiga, URL de estilo personalizada).
export const normalizeBasemap = (value) => {
  if (!value || typeof value !== 'string') return DEFAULT_BASEMAP;
  if (BASEMAPS.some(b => b.id === value)) return value;
  if (value.startsWith('mapbox://')) {
    const key = value.split('/').pop();
    return LEGACY_MAPBOX[key] || DEFAULT_BASEMAP;
  }
  if (/^https?:\/\//.test(value)) return value; // estilo personalizado (URL de style.json)
  return DEFAULT_BASEMAP;
};

// Devolve o que o MapLibre aceita em `style`: objeto de estilo (sempre um novo) ou URL.
export const resolveBasemapStyle = (value) => {
  const id = normalizeBasemap(value);
  const entry = BASEMAPS.find(b => b.id === id);
  if (!entry) return id; // URL personalizada
  return typeof entry.style === 'function' ? entry.style() : entry.style;
};

export const isLocalBasemap = (value) => ['liso', 'branco'].includes(normalizeBasemap(value));

// Categorias de camadas do mapa base que o usuário pode ligar/desligar.
// Os estilos do OpenFreeMap seguem o esquema OpenMapTiles, então a classificação usa
// o 'source-layer' de cada camada (e o id como reserva para estilos personalizados).
const sourceLayer = (layer) => layer['source-layer'] || '';
const isSymbol = (layer) => layer.type === 'symbol';

export const BASEMAP_LAYER_CATEGORIES = [
  {
    key: 'labels', label: 'Rótulos / Textos', emoji: '🏷️',
    match: (l) => isSymbol(l) && sourceLayer(l) !== 'poi',
  },
  {
    key: 'roads', label: 'Ruas e Estradas', emoji: '🛣️',
    match: (l) => !isSymbol(l) && (['transportation', 'aeroway'].includes(sourceLayer(l)) || /^(road|highway|bridge|tunnel|railway)/.test(l.id)),
  },
  {
    key: 'buildings', label: 'Construções', emoji: '🏢',
    match: (l) => !isSymbol(l) && (sourceLayer(l) === 'building' || l.id.includes('building')),
  },
  {
    key: 'admin', label: 'Limites Administrativos', emoji: '🗺️',
    match: (l) => !isSymbol(l) && (sourceLayer(l) === 'boundary' || l.id.includes('boundary') || l.id.includes('admin')),
  },
  {
    key: 'pois', label: 'Pontos de Interesse', emoji: '📍',
    match: (l) => sourceLayer(l) === 'poi',
  },
  {
    key: 'water', label: 'Água', emoji: '💧',
    match: (l) => !isSymbol(l) && (['water', 'waterway'].includes(sourceLayer(l)) || /water|river/.test(l.id)),
  },
  {
    key: 'landuse', label: 'Uso do Solo / Vegetação', emoji: '🌿',
    match: (l) => !isSymbol(l) && (['landuse', 'landcover', 'park'].includes(sourceLayer(l)) || /landuse|landcover|park/.test(l.id)),
  },
];

// Lê de forma síncrona os dados atuais de uma fonte GeoJSON do MapLibre (sem acessar campos privados).
export const getGeoJSONSourceData = (source) => {
  try { return source?.serialize?.().data; } catch (e) { return undefined; }
};

// O estilo já foi carregado e aceita addSource/addLayer?
// (map.isStyleLoaded() do MapLibre também espera todos os tiles do mapa base carregarem,
// o que atrasaria — ou impediria, com rede lenta — o desenho das camadas do app.)
export const isStyleReady = (map) => !!(map && map.style && map.style._loaded);

// Camadas criadas pelo app (e não pelo mapa base): municípios, anotações, medidas,
// gratícula e pré-visualização do desenho. Identificadas por prefixo para não esquecer nenhuma.
const APP_LAYER_PREFIXES = ['sectors-', 'annotations-', 'graticule-', 'preview', 'prev-'];
export const isAppLayer = (id) => APP_LAYER_PREFIXES.some(p => String(id).startsWith(p));
