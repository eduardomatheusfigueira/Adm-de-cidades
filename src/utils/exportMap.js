/**
 * Generates a standalone HTML file containing a Mapbox GL map
 * with municipality geometries, color legend, and annotations.
 */
export function generateExportHtml({
  annotations,
  vizName,
  mapCenter,
  mapZoom,
  mapStyle,
  mapboxToken,
  municipalityGeoJson,
  municipalityColorExpression,
  colorLegend,
  renderMode,
  fillOpacity,
  borderWidth,
}) {
  const DEFAULT_FILL = '#FFFFFF';
  const DEFAULT_BORDER = '#000000';

  // Build annotation GeoJSON features
  const features = [];
  const labelFeatures = [];

  (annotations || []).forEach(ann => {
    const annColor = ann.color || DEFAULT_FILL;
    const borderColor = (annColor === '#FFFFFF' || annColor === '#ffffff') ? DEFAULT_BORDER : '#000000';
    let geometry = null;
    let centroid = null;

    if (ann.type === 'point') {
      geometry = { type: 'Point', coordinates: ann.coordinates };
      centroid = ann.coordinates;
    } else if (ann.type === 'line') {
      geometry = { type: 'LineString', coordinates: ann.coordinates };
      const mid = Math.floor(ann.coordinates.length / 2);
      centroid = ann.coordinates[mid] || ann.coordinates[0];
    } else if (ann.type === 'polygon') {
      geometry = { type: 'Polygon', coordinates: [ann.coordinates] };
      const coords = ann.coordinates.slice(0, -1);
      const avgLng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
      const avgLat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
      centroid = [avgLng, avgLat];
    }

    if (geometry) {
      features.push({
        type: 'Feature',
        properties: {
          id: ann.id,
          numberStr: String(ann.number),
          annType: ann.type,
          color: annColor,
          borderColor,
          description: ann.description,
        },
        geometry,
      });
    }

    if (centroid) {
      labelFeatures.push({
        type: 'Feature',
        properties: {
          number: String(ann.number),
          annType: ann.type,
          color: annColor,
          borderColor,
        },
        geometry: { type: 'Point', coordinates: centroid },
      });
    }
  });

  const annotationsGeoJson = JSON.stringify({ type: 'FeatureCollection', features });
  const labelsGeoJson = JSON.stringify({ type: 'FeatureCollection', features: labelFeatures });
  const munGeoJson = municipalityGeoJson ? JSON.stringify(municipalityGeoJson) : 'null';
  const colorExpr = municipalityColorExpression ? JSON.stringify(municipalityColorExpression) : '"#cccccc"';

  // Build annotation legend
  const annotationLegendItems = (annotations || []).map(ann => {
    const color = ann.color || DEFAULT_FILL;
    const border = (color === '#FFFFFF' || color === '#ffffff') ? DEFAULT_BORDER : color;
    const desc = ann.description || `${ann.type === 'point' ? 'Ponto' : ann.type === 'line' ? 'Linha' : 'Polígono'} ${ann.number}`;
    return `<div class="legend-item">
      <span class="legend-num" style="background:${color};border-color:${border}">${ann.number}</span>
      <span class="legend-desc">${esc(desc)}</span>
    </div>`;
  }).join('\n');

  // Build color legend
  const colorLegendHtml = (colorLegend && colorLegend.items && colorLegend.items.length > 0) ? `
  <div class="color-legend">
    <div class="legend-title">${esc(colorLegend.title || 'Legenda')}</div>
    ${colorLegend.items.map(item => `<div class="legend-item">
      <span class="legend-color" style="background:${item.color}"></span>
      <span class="legend-desc">${esc(item.value)}</span>
    </div>`).join('\n')}
  </div>` : '';

  const title = vizName || 'Mapa de Informações';
  const sc = '<' + '/script>';
  const hasAnnotations = annotations && annotations.length > 0;
  const hasMunicipalities = !!municipalityGeoJson;
  const effectiveRenderMode = renderMode || 'filled';
  const effectiveFillOpacity = fillOpacity ?? 0.6;
  const effectiveBorderWidth = borderWidth || 2;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(title)}</title>
<link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet"/>
<script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js">${sc}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; }
  #map { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
  .legends-container {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 5;
    max-height: 80vh;
    overflow-y: auto;
  }
  .annotation-legend, .color-legend {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border: 1px solid #e2e8f0;
    padding: 12px 14px;
    font-size: 0.82rem;
    max-width: 280px;
    min-width: 160px;
  }
  .legend-title {
    font-weight: 700;
    font-size: 0.85rem;
    color: #0f172a;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid #e2e8f0;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 3px 0;
  }
  .legend-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid #000;
    font-size: 0.7rem;
    font-weight: 700;
    color: #000;
    flex-shrink: 0;
  }
  .legend-color {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid rgba(0,0,0,0.15);
    flex-shrink: 0;
  }
  .legend-desc {
    color: #1e293b;
    line-height: 1.3;
  }
  .title-bar {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 23, 42, 0.9);
    color: #fff;
    padding: 8px 20px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
    z-index: 5;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    white-space: nowrap;
  }
</style>
</head>
<body>
<div id="map"></div>
<div class="title-bar">${esc(title)}</div>
<div class="legends-container">
  ${colorLegendHtml}
  ${hasAnnotations ? `<div class="annotation-legend">
    <div class="legend-title">Informações</div>
    ${annotationLegendItems}
  </div>` : ''}
</div>
<script>
mapboxgl.accessToken = '${mapboxToken}';
var map = new mapboxgl.Map({
  container: 'map',
  style: '${mapStyle}',
  center: [${mapCenter[0]}, ${mapCenter[1]}],
  zoom: ${mapZoom}
});
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

var munData = ${munGeoJson};
var colorExpr = ${colorExpr};
var annData = ${annotationsGeoJson};
var labelData = ${labelsGeoJson};

map.on('load', function() {
  ${hasMunicipalities ? `
  // Municipality layers
  map.addSource('sectors', { type: 'geojson', data: munData });
  ${effectiveRenderMode === 'border' ? `
  map.addLayer({
    id: 'sectors-fill', type: 'fill', source: 'sectors',
    filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
    paint: { 'fill-color': colorExpr, 'fill-opacity': 0, 'fill-outline-color': 'transparent' }
  });
  map.addLayer({
    id: 'sectors-line', type: 'line', source: 'sectors',
    filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
    paint: { 'line-color': colorExpr, 'line-width': ${effectiveBorderWidth}, 'line-opacity': 1, 'line-offset': ${effectiveBorderWidth / 2} }
  });` : `
  map.addLayer({
    id: 'sectors-fill', type: 'fill', source: 'sectors',
    filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
    paint: { 'fill-color': colorExpr, 'fill-opacity': ${effectiveFillOpacity}, 'fill-outline-color': '#000' }
  });`}
  map.addLayer({
    id: 'sectors-point', type: 'circle', source: 'sectors',
    filter: ['==', ['geometry-type'], 'Point'],
    paint: { 'circle-radius': 6, 'circle-color': colorExpr, 'circle-opacity': 0.9, 'circle-stroke-width': 1, 'circle-stroke-color': '#fff' }
  });
  ` : ''}

  ${hasAnnotations ? `
  // Annotation layers
  map.addSource('annotations', { type: 'geojson', data: annData });
  map.addSource('labels', { type: 'geojson', data: labelData });
  map.addLayer({ id: 'ann-fill', type: 'fill', source: 'annotations', filter: ['==', ['geometry-type'], 'Polygon'], paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.15 } });
  map.addLayer({ id: 'ann-line', type: 'line', source: 'annotations', filter: ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'Polygon']], paint: { 'line-color': ['get', 'borderColor'], 'line-width': 2.5 } });
  map.addLayer({ id: 'ann-point', type: 'circle', source: 'annotations', filter: ['==', ['geometry-type'], 'Point'], paint: { 'circle-radius': 14, 'circle-color': ['get', 'color'], 'circle-stroke-width': 2, 'circle-stroke-color': ['get', 'borderColor'] } });
  map.addLayer({ id: 'ann-text', type: 'symbol', source: 'annotations', filter: ['all', ['==', ['geometry-type'], 'Point'], ['has', 'numberStr']], layout: { 'text-field': ['get', 'numberStr'], 'text-size': 11, 'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'], 'text-allow-overlap': true }, paint: { 'text-color': '#000' } });
  map.addLayer({ id: 'lbl-circle', type: 'circle', source: 'labels', filter: ['any', ['==', ['get', 'annType'], 'line'], ['==', ['get', 'annType'], 'polygon']], paint: { 'circle-radius': 14, 'circle-color': ['get', 'color'], 'circle-stroke-width': 2, 'circle-stroke-color': ['get', 'borderColor'] } });
  map.addLayer({ id: 'lbl-text', type: 'symbol', source: 'labels', layout: { 'text-field': ['get', 'number'], 'text-size': 11, 'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'], 'text-allow-overlap': true }, paint: { 'text-color': '#000' } });
  ` : ''}
});
${sc}
</body>
</html>`;
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
