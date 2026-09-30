// Leitura de arquivos geográficos enviados pelos alunos → GeoJSON (FeatureCollection em WGS84).
// Formatos: GeoJSON, TopoJSON, KML (Google Earth/My Maps), KMZ, Shapefile em .zip ou os
// arquivos soltos (.shp + .dbf + .prj + .cpg). As bibliotecas são carregadas sob demanda.
import { feature as topoFeature } from 'topojson-client';

export const GEO_ACCEPT = '.geojson,.json,.topojson,.kml,.kmz,.zip,.shp,.dbf,.prj,.cpg,.shx';
const MAX_BYTES = 50 * 1024 * 1024;

const ext = (name) => (name.match(/\.([a-z0-9]+)$/i)?.[1] || '').toLowerCase();

// Qualquer objeto GeoJSON/TopoJSON → lista de Features
export function toFeatures(obj) {
  if (!obj || typeof obj !== 'object') return [];
  if (obj.type === 'Topology' && obj.objects) {
    return Object.values(obj.objects).flatMap(o => toFeatures(topoFeature(obj, o)));
  }
  if (obj.type === 'FeatureCollection') return (obj.features || []).filter(f => f && f.geometry);
  if (obj.type === 'Feature') return obj.geometry ? [obj] : [];
  if (Array.isArray(obj)) return obj.flatMap(toFeatures);
  if (obj.type && obj.coordinates) return [{ type: 'Feature', properties: {}, geometry: obj }];
  if (obj.type === 'GeometryCollection') return [{ type: 'Feature', properties: {}, geometry: obj }];
  return [];
}

// Limites (lon/lat) de todas as coordenadas; `projetado` indica valores fora de graus (ex.: UTM)
export function coordStats(features) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, n = 0;
  const visit = (c) => {
    if (typeof c[0] === 'number') {
      n++;
      if (c[0] < minX) minX = c[0]; if (c[0] > maxX) maxX = c[0];
      if (c[1] < minY) minY = c[1]; if (c[1] > maxY) maxY = c[1];
    } else c.forEach(visit);
  };
  const walk = (g) => {
    if (!g) return;
    if (g.type === 'GeometryCollection') g.geometries.forEach(walk);
    else if (g.coordinates) visit(g.coordinates);
  };
  features.forEach(f => walk(f.geometry));
  const projetado = n > 0 && (minX < -180 || maxX > 180 || minY < -90 || maxY > 90);
  return { bbox: n ? [minX, minY, maxX, maxY] : null, pontos: n, projetado };
}

// Tipos de geometria presentes: { poligonos, linhas, pontos }
export function geometryKinds(features) {
  const k = { poligonos: 0, linhas: 0, pontos: 0 };
  const walk = (g) => {
    if (!g) return;
    if (g.type === 'GeometryCollection') return g.geometries.forEach(walk);
    if (/Polygon/.test(g.type)) k.poligonos++;
    else if (/LineString/.test(g.type)) k.linhas++;
    else if (/Point/.test(g.type)) k.pontos++;
  };
  features.forEach(f => walk(f.geometry));
  return k;
}

const decode = (bytes) => {
  try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
  catch (e) { return new TextDecoder('windows-1252').decode(bytes); }
};

async function kmlTextToFeatures(text) {
  const { kml } = await import('@tmcw/togeojson');
  const doc = new DOMParser().parseFromString(text, 'text/xml');
  if (doc.getElementsByTagName('parsererror').length) throw new Error('O arquivo KML está corrompido ou não é um KML.');
  return toFeatures(kml(doc));
}

async function readShapefile(input) {
  const { default: shp } = await import('shpjs');
  try { return toFeatures(await shp(input)); }
  catch (e) { throw new Error(`Não consegui ler o shapefile (${e.message || e}). Confira se o .zip tem os arquivos .shp e .dbf.`); }
}

// Lê um ou mais arquivos (o shapefile solto vem em vários) → { features, formato, nome, avisos }
export async function readGeoFiles(fileList) {
  const files = [...(fileList || [])];
  if (!files.length) throw new Error('Nenhum arquivo escolhido.');
  const grandes = files.filter(f => f.size > MAX_BYTES);
  if (grandes.length) throw new Error(`O arquivo ${grandes[0].name} passa de 50 MB. Simplifique a geometria (ex.: mapshaper.org) e tente de novo.`);

  const byExt = Object.fromEntries(files.map(f => [ext(f.name), f]));
  const base = (files.find(f => ext(f.name) !== 'prj') || files[0]).name.replace(/\.[^.]+$/, '');
  let features, formato;

  if (byExt.shp || byExt.dbf) {
    if (!byExt.shp) throw new Error('Falta o arquivo .shp. Escolha juntos o .shp, o .dbf e o .prj (ou envie tudo num .zip).');
    const obj = { shp: await byExt.shp.arrayBuffer() };
    if (byExt.dbf) obj.dbf = await byExt.dbf.arrayBuffer();
    if (byExt.prj) obj.prj = decode(new Uint8Array(await byExt.prj.arrayBuffer()));
    if (byExt.cpg) obj.cpg = decode(new Uint8Array(await byExt.cpg.arrayBuffer()));
    features = await readShapefile(obj);
    formato = 'Shapefile';
  } else if (files.length > 1) {
    throw new Error('Escolha um arquivo por vez (vários arquivos só para as partes de um shapefile).');
  } else {
    const file = files[0];
    const e = ext(file.name);
    if (e === 'zip') {
      features = await readShapefile(await file.arrayBuffer());
      formato = 'Shapefile (.zip)';
    } else if (e === 'kmz') {
      const { unzipSync } = await import('fflate');
      const entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
      const kmlName = Object.keys(entries).find(n => /\.kml$/i.test(n));
      if (!kmlName) throw new Error('O KMZ não tem um arquivo .kml dentro.');
      features = await kmlTextToFeatures(decode(entries[kmlName]));
      formato = 'KMZ';
    } else if (e === 'kml') {
      features = await kmlTextToFeatures(decode(new Uint8Array(await file.arrayBuffer())));
      formato = 'KML';
    } else if (['geojson', 'json', 'topojson'].includes(e)) {
      let obj;
      try { obj = JSON.parse(decode(new Uint8Array(await file.arrayBuffer()))); }
      catch (err) { throw new Error('O arquivo não é um JSON válido.'); }
      features = toFeatures(obj);
      formato = obj?.type === 'Topology' ? 'TopoJSON' : 'GeoJSON';
    } else {
      throw new Error(`Formato .${e || '?'} não reconhecido. Use GeoJSON, TopoJSON, KML, KMZ ou Shapefile (.zip).`);
    }
  }

  if (!features.length) throw new Error('Não encontrei nenhuma geometria no arquivo.');
  // Propriedades sempre como objeto (KML e shapefiles sem .dbf podem vir sem)
  features = features.map(f => ({ type: 'Feature', properties: { ...(f.properties || {}) }, geometry: f.geometry }));

  const stats = coordStats(features);
  if (stats.projetado) {
    throw new Error('As coordenadas não estão em graus (latitude/longitude): o arquivo parece estar em UTM ou outra projeção. '
      + 'Envie o shapefile junto com o arquivo .prj, ou reprojete para WGS 84/SIRGAS 2000 (EPSG:4326/4674) antes.');
  }
  return { features, formato, nome: base, bbox: stats.bbox, tipos: geometryKinds(features) };
}
