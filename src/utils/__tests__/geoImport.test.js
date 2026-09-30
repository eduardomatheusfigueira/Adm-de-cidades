import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { readGeoFiles, toFeatures, coordStats } from '../geoImport';

const FIX = path.join(__dirname, 'fixtures');
const file = (rel) => new File([fs.readFileSync(path.join(FIX, rel))], path.basename(rel));

describe('readGeoFiles', () => {
  it('GeoJSON de pontos', async () => {
    const r = await readGeoFiles([file('escolas.geojson')]);
    expect(r.formato).toBe('GeoJSON');
    expect(r.nome).toBe('escolas');
    expect(r.features).toHaveLength(3);
    expect(r.tipos).toEqual({ poligonos: 0, linhas: 0, pontos: 3 });
    expect(r.features[2].properties.nome).toBe('Escola Ç');
  });

  it('TopoJSON vira feições', async () => {
    const r = await readGeoFiles([file('rio.topojson')]);
    expect(r.formato).toBe('TopoJSON');
    expect(r.tipos).toEqual({ poligonos: 1, linhas: 1, pontos: 0 });
  });

  it('Shapefile em UTM (.zip com duas camadas) é reprojetado para lon/lat pelo .prj', async () => {
    const r = await readGeoFiles([file('rio-utm.zip')]);
    expect(r.formato).toBe('Shapefile (.zip)');
    expect(r.features).toHaveLength(2);
    const [x1, y1, x2, y2] = r.bbox;
    expect(x1).toBeCloseTo(-46.75, 2);
    expect(x2).toBeCloseTo(-46.60, 2);
    expect(y1).toBeCloseTo(-23.56, 2);
    expect(y2).toBeCloseTo(-23.50, 2);
    expect(r.features.map(f => f.properties.nome).sort()).toEqual(['Bairro X', 'Rio Tietê (trecho)']);
  });

  it('Shapefile com os arquivos soltos (.shp + .dbf + .prj + .cpg)', async () => {
    const parts = ['shp', 'dbf', 'prj', 'cpg', 'shx'].map(e => file(`shp-solto/rio_utm1.${e}`));
    const r = await readGeoFiles(parts);
    expect(r.formato).toBe('Shapefile');
    expect(r.features).toHaveLength(1);
    expect(r.bbox[0]).toBeGreaterThan(-47);
    expect(r.bbox[0]).toBeLessThan(-46);
  });

  it('.dbf sozinho pede o .shp; formato desconhecido e JSON inválido dão mensagem clara', async () => {
    await expect(readGeoFiles([file('shp-solto/rio_utm1.dbf')])).rejects.toThrow(/Falta o arquivo \.shp/);
    await expect(readGeoFiles([new File(['x'], 'mapa.gpx')])).rejects.toThrow(/não reconhecido/);
    await expect(readGeoFiles([new File(['{oops'], 'a.geojson')])).rejects.toThrow(/JSON válido/);
  });

  it('coordenadas projetadas sem .prj são recusadas', async () => {
    const utm = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [333000, 7395000] } }] };
    await expect(readGeoFiles([new File([JSON.stringify(utm)], 'utm.geojson')])).rejects.toThrow(/não estão em graus/);
  });
});

describe('utilitários', () => {
  it('toFeatures aceita geometria solta, Feature e listas', () => {
    expect(toFeatures({ type: 'Point', coordinates: [0, 0] })).toHaveLength(1);
    expect(toFeatures([{ type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] } }, { type: 'Feature', geometry: null }])).toHaveLength(1);
  });
  it('coordStats detecta projeção', () => {
    expect(coordStats(toFeatures({ type: 'Point', coordinates: [-46, -23] })).projetado).toBe(false);
    expect(coordStats(toFeatures({ type: 'Point', coordinates: [333000, 7395000] })).projetado).toBe(true);
  });
});
