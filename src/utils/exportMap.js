/**
 * Generates a standalone HTML file containing a Mapbox GL map
 * with municipality geometries, color legend, annotations,
 * north arrow, and scale bar — all independently draggable, resizable and toggle-able.
 */
export function generateExportHtml({
  annotations,
  vizName,
  mapCenter,
  mapZoom,
  mapBearing,
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

  (annotations || []).forEach(ann => {
    const annColor = ann.color || DEFAULT_FILL;
    const borderColor = (annColor === '#FFFFFF' || annColor === '#ffffff') ? DEFAULT_BORDER : '#000000';
    let geometry = null;

    if (ann.type === 'point') {
      geometry = { type: 'Point', coordinates: ann.coordinates };
    } else if (ann.type === 'line') {
      geometry = { type: 'LineString', coordinates: ann.coordinates };
    } else if (ann.type === 'polygon') {
      geometry = { type: 'Polygon', coordinates: [ann.coordinates] };
    }

    if (geometry) {
      features.push({
        type: 'Feature',
        properties: { id: ann.id, numberStr: String(ann.number), annType: ann.type, color: annColor, borderColor, description: ann.description },
        geometry,
      });
    }
  });

  const annotationsGeoJson = JSON.stringify({ type: 'FeatureCollection', features });
  const munGeoJson = municipalityGeoJson ? JSON.stringify(municipalityGeoJson) : 'null';
  const colorExpr = municipalityColorExpression ? JSON.stringify(municipalityColorExpression) : '"#cccccc"';

  // Build annotation legend items HTML
  const annotationLegendItems = (annotations || []).map(ann => {
    const color = ann.color || DEFAULT_FILL;
    const border = (color === '#FFFFFF' || color === '#ffffff') ? DEFAULT_BORDER : color;
    const desc = ann.description || `${ann.type === 'point' ? 'Ponto' : ann.type === 'line' ? 'Linha' : 'Polígono'} ${ann.number}`;
    if (ann.type === 'point') {
      return `<div class="legend-item">
        <span class="legend-num" style="background:${color};border-color:${border}">${ann.number}</span>
        <span class="legend-desc">${esc(desc)}</span>
      </div>`;
    }
    // Line or polygon: show SVG sample instead of numbered circle
    const isLine = ann.type === 'line';
    const strokeColor = isLine ? (ann.lineColor || ann.color || '#000') : (ann.strokeColor || '#000');
    const strokeWidth = Math.min(isLine ? (ann.lineWidth ?? 2.5) : (ann.strokeWidth ?? 2.5), 5);
    const strokeStyle = isLine ? (ann.lineStyle || 'solid') : (ann.strokeStyle || 'solid');
    let dashArray = 'none';
    if (strokeStyle === 'dashed') dashArray = '6,3';
    else if (strokeStyle === 'dotted') dashArray = '2,2';
    if (ann.type === 'polygon') {
      const fillColor = ann.fillColor || ann.color || '#ccc';
      const fillOpacity = ann.fillOpacity ?? 0.15;
      return `<div class="legend-item">
        <svg width="30" height="12" viewBox="0 0 30 12" style="flex-shrink:0"><rect x="1" y="1" width="28" height="10" fill="${fillColor}" fill-opacity="${fillOpacity}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-dasharray="${dashArray}"/></svg>
        <span class="legend-desc">${esc(desc)}</span>
      </div>`;
    }
    return `<div class="legend-item">
      <svg width="30" height="12" viewBox="0 0 30 12" style="flex-shrink:0"><line x1="0" y1="6" x2="30" y2="6" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-dasharray="${dashArray}" stroke-linecap="round"/></svg>
      <span class="legend-desc">${esc(desc)}</span>
    </div>`;
  }).join('\n');

  // Build color legend items HTML
  const hasColorLegend = colorLegend && colorLegend.items && colorLegend.items.length > 0;
  const colorLegendItemsHtml = hasColorLegend ? colorLegend.items.map(item =>
    `<div class="legend-item">
      <span class="legend-color" style="background:${item.color}"></span>
      <span class="legend-desc">${esc(item.value)}</span>
    </div>`
  ).join('\n') : '';

  const title = vizName || 'Mapa de Informações';
  const sc = '<' + '/script>';
  const hasAnnotations = annotations && annotations.length > 0;
  const hasMunicipalities = !!municipalityGeoJson;
  const effectiveRenderMode = renderMode || 'filled';
  const effectiveFillOpacity = fillOpacity ?? 0.6;
  const effectiveBorderWidth = borderWidth || 2;
  const initialBearing = mapBearing || 0;

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

  /* Shared widget styles */
  .widget {
    position: absolute;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border: 1px solid #e2e8f0;
    z-index: 5;
    overflow: visible;
  }

  /* Legend panels */
  .legend-panel {
    padding: 12px 14px;
    font-size: 0.82rem;
    min-width: 160px;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    resize: both;
  }
  .legend-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 6px;
    margin-bottom: 8px;
    cursor: move;
    user-select: none;
  }
  .legend-title {
    font-weight: 700;
    font-size: 0.85rem;
    color: #0f172a;
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

  /* Close button on widgets */
  .widget-close {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
    color: #94a3b8;
    line-height: 1;
    padding: 2px 4px;
    border-radius: 3px;
    transition: color 0.15s;
  }
  .widget-close:hover { color: #ef4444; }

  /* Title bar */
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

  /* North Arrow */
  .north-arrow {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    user-select: none;
    padding: 0;
  }
  .north-close {
    position: absolute; top: -4px; right: -4px;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 50%;
    width: 18px; height: 18px; display: flex; align-items: center;
    justify-content: center; cursor: pointer; font-size: 0.6rem;
    color: #94a3b8; line-height: 1; opacity: 0; transition: opacity 0.15s;
  }
  .north-arrow:hover .north-close { opacity: 1; }
  .north-close:hover { color: #ef4444; }

  /* Scale Bar */
  .scale-bar {
    border-radius: 6px;
    padding: 6px 12px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    cursor: move;
    user-select: none;
  }
  .scale-close {
    position: absolute; top: 2px; right: 4px;
    background: none; border: none; cursor: pointer;
    font-size: 0.6rem; color: #94a3b8; opacity: 0;
    transition: opacity 0.15s;
  }
  .scale-bar:hover .scale-close { opacity: 1; }
  .scale-close:hover { color: #ef4444; }
  .scale-label { font-size: 0.7rem; font-weight: 600; color: #1e293b; }
  .scale-line { height: 8px; border-left: 2px solid #1e293b; border-right: 2px solid #1e293b; border-bottom: 2px solid #1e293b; }

  /* Toggle buttons */
  .toggle-btns {
    position: absolute;
    bottom: 120px;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    z-index: 10;
  }
  .toggle-btn {
    background: #fff;
    width: 30px; height: 30px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    display: none; /* hidden by default, shown via JS */
    align-items: center; justify-content: center;
    font-size: 0.9rem; padding: 0; opacity: 0.7;
    transition: opacity 0.2s;
  }
  .toggle-btn:hover { opacity: 1; }
  .toggle-btn.visible { display: flex; }
</style>
</head>
<body>
<div id="map"></div>
<div class="title-bar">${esc(title)}</div>

<!-- Color Legend -->
${hasColorLegend ? `<div class="widget legend-panel" id="colorLegend" style="bottom:16px;right:16px;width:250px;">
  <div class="legend-header" id="colorLegendHandle">
    <span class="legend-title">${esc(colorLegend.title || 'Legenda')}</span>
    <button class="widget-close" onclick="hideWidget('colorLegend','btnColor')">\u2715</button>
  </div>
  ${colorLegendItemsHtml}
</div>` : ''}

<!-- Annotation Legend -->
${hasAnnotations ? `<div class="widget legend-panel" id="annotLegend" style="bottom:16px;right:280px;width:260px;">
  <div class="legend-header" id="annotLegendHandle">
    <span class="legend-title">Informações</span>
    <button class="widget-close" onclick="hideWidget('annotLegend','btnAnnot')">\u2715</button>
  </div>
  ${annotationLegendItems}
</div>` : ''}

<!-- North Arrow -->
<div class="widget north-arrow" id="northArrow" style="top:80px;left:16px;">
  <span class="north-close" onclick="hideWidget('northArrow','btnNorth')">\u2715</span>
  <svg id="northSvg" viewBox="0 0 200 200" style="width:90%;height:90%;transition:transform 0.15s ease-out">
    <circle cx="100" cy="100" r="92" fill="none" stroke="#1e293b" stroke-width="4"/>
    <line x1="100" y1="12" x2="100" y2="24" stroke="#1e293b" stroke-width="3"/>
    <line x1="176" y1="100" x2="188" y2="100" stroke="#1e293b" stroke-width="2"/>
    <line x1="100" y1="176" x2="100" y2="188" stroke="#1e293b" stroke-width="2"/>
    <line x1="12" y1="100" x2="24" y2="100" stroke="#1e293b" stroke-width="2"/>
    <circle cx="100" cy="100" r="6" fill="#1e293b"/>
    <polygon points="100,22 88,100 100,90" fill="#1e293b" stroke="#1e293b" stroke-width="1"/>
    <polygon points="100,22 112,100 100,90" fill="none" stroke="#1e293b" stroke-width="2"/>
    <polygon points="100,178 88,100 100,110" fill="none" stroke="#1e293b" stroke-width="1.5" opacity="0.4"/>
    <polygon points="100,178 112,100 100,110" fill="none" stroke="#1e293b" stroke-width="1.5" opacity="0.4"/>
    <text x="100" y="48" text-anchor="middle" dominant-baseline="middle" fill="#1e293b" font-size="18" font-weight="900" font-family="Inter,Arial,sans-serif">N</text>
  </svg>
</div>

<!-- Scale Bar -->
<div class="widget scale-bar" id="scaleBar" style="bottom:16px;left:50%;transform:translateX(-50%);">
  <span class="scale-close" onclick="hideWidget('scaleBar','btnScale')">\u2715</span>
  <span class="scale-label" id="scaleLabel">100 m</span>
  <div class="scale-line" id="scaleLine" style="width:100px"></div>
</div>

<!-- Toggle restore buttons -->
<div class="toggle-btns" id="toggleBtns">
  ${hasColorLegend ? '<button class="toggle-btn" id="btnColor" onclick="showWidget(\'colorLegend\',\'btnColor\')" title="Mostrar Legenda de Cores">\ud83c\udfa8</button>' : ''}
  ${hasAnnotations ? '<button class="toggle-btn" id="btnAnnot" onclick="showWidget(\'annotLegend\',\'btnAnnot\')" title="Mostrar Informações">\u2139\ufe0f</button>' : ''}
  <button class="toggle-btn" id="btnNorth" onclick="showWidget('northArrow','btnNorth')" title="Mostrar Norte">\ud83e\udded</button>
  <button class="toggle-btn" id="btnScale" onclick="showWidget('scaleBar','btnScale')" title="Mostrar Escala">\ud83d\udccf</button>
</div>

<script>
mapboxgl.accessToken = '${mapboxToken}';
var map = new mapboxgl.Map({
  container: 'map',
  style: '${mapStyle}',
  center: [${mapCenter[0]}, ${mapCenter[1]}],
  zoom: ${mapZoom},
  bearing: ${initialBearing}
});
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

var munData = ${munGeoJson};
var colorExpr = ${colorExpr};
var annData = ${annotationsGeoJson};

// ====== Show / Hide widgets ======
function hideWidget(id, btnId) {
  document.getElementById(id).style.display = 'none';
  document.getElementById(btnId).classList.add('visible');
}
function showWidget(id, btnId) {
  document.getElementById(id).style.display = '';
  document.getElementById(btnId).classList.remove('visible');
}

// ====== Draggable by handle ======
function makeDraggable(el, handleId) {
  var handle = handleId ? document.getElementById(handleId) : el;
  if (!handle) return;
  var isDragging = false, ox = 0, oy = 0;
  handle.addEventListener('mousedown', function(e) {
    if (e.target.tagName === 'BUTTON') return; // don't drag on buttons
    isDragging = true;
    var r = el.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    e.preventDefault();
  });
  window.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    el.style.left = (e.clientX - ox) + 'px';
    el.style.top = (e.clientY - oy) + 'px';
    el.style.bottom = 'auto';
    el.style.right = 'auto';
    el.style.transform = 'none';
  });
  window.addEventListener('mouseup', function() { isDragging = false; });
}

// Setup draggable widgets
${hasColorLegend ? "makeDraggable(document.getElementById('colorLegend'), 'colorLegendHandle');" : ''}
${hasAnnotations ? "makeDraggable(document.getElementById('annotLegend'), 'annotLegendHandle');" : ''}
makeDraggable(document.getElementById('northArrow'));
makeDraggable(document.getElementById('scaleBar'));

// ====== North Arrow rotation ======
function updateNorth() {
  var bearing = map.getBearing();
  document.getElementById('northSvg').style.transform = 'rotate(' + (-bearing) + 'deg)';
}
map.on('rotate', updateNorth);
updateNorth();

// ====== Scale Bar ======
var STEPS = [1,2,5,10,20,50,100,200,500,1000,2000,5000,10000,20000,50000,100000,200000,500000,1000000];
function formatDist(m) { return m >= 1000 ? ((m/1000) % 1 === 0 ? (m/1000)+' km' : (m/1000).toFixed(1)+' km') : m+' m'; }
function updateScale() {
  var c = map.getCenter();
  var z = map.getZoom();
  var mpp = 156543.03392 * Math.cos(c.lat * Math.PI / 180) / Math.pow(2, z);
  var best = STEPS[0];
  for (var i = 0; i < STEPS.length; i++) {
    var px = STEPS[i] / mpp;
    if (px >= 60 && px <= 150) { best = STEPS[i]; break; }
    if (px > 150) break;
    best = STEPS[i];
  }
  var w = Math.max(40, Math.min(200, Math.round(best / mpp)));
  document.getElementById('scaleLine').style.width = w + 'px';
  document.getElementById('scaleLabel').textContent = formatDist(best);
}
map.on('zoom', updateScale);
map.on('move', updateScale);

map.on('load', function() {
  updateScale();

  ${hasMunicipalities ? `
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
  map.addSource('annotations', { type: 'geojson', data: annData });
  map.addSource('labels', { type: 'geojson', data: labelData });
  map.addLayer({ id: 'ann-fill', type: 'fill', source: 'annotations', filter: ['==', ['geometry-type'], 'Polygon'], paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.15 } });
  map.addLayer({ id: 'ann-line', type: 'line', source: 'annotations', filter: ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'Polygon']], paint: { 'line-color': ['get', 'borderColor'], 'line-width': 2.5 } });
  map.addLayer({ id: 'ann-point', type: 'circle', source: 'annotations', filter: ['==', ['geometry-type'], 'Point'], paint: { 'circle-radius': 14, 'circle-color': ['get', 'color'], 'circle-stroke-width': 2, 'circle-stroke-color': ['get', 'borderColor'] } });
  map.addLayer({ id: 'ann-text', type: 'symbol', source: 'annotations', filter: ['all', ['==', ['geometry-type'], 'Point'], ['has', 'numberStr']], layout: { 'text-field': ['get', 'numberStr'], 'text-size': 11, 'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'], 'text-allow-overlap': true }, paint: { 'text-color': '#000' } });
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
