import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import '../styles/ImageStudio.css';
import { MapContext } from '../contexts/MapContext';
import { UIContext } from '../contexts/UIContext';
import { AnnotationContext } from '../contexts/AnnotationContext';

const PRESETS = [
  { label: 'HD', w: 1920, h: 1080 },
  { label: '2K', w: 2560, h: 1440 },
  { label: '4K', w: 3840, h: 2160 },
];

// ── Canvas drawing helpers ──
function drawNorth(ctx,x,y,size,bearing){const rot=(-bearing*Math.PI)/180,cx=x+size/2,cy=y+size/2,r=size*0.42;ctx.save();ctx.translate(cx,cy);ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=Math.max(2,size*0.025);ctx.stroke();const nX=Math.sin(rot)*r*1.3,nY=-Math.cos(rot)*r*1.3;ctx.font=`bold ${Math.round(size*0.2)}px Inter,sans-serif`;ctx.fillStyle='#000';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('N',nX,nY);ctx.rotate(rot);ctx.beginPath();ctx.moveTo(0,-r*0.85);ctx.lineTo(-r*0.18,0);ctx.lineTo(0,r*0.1);ctx.closePath();ctx.fillStyle='#000';ctx.fill();ctx.beginPath();ctx.moveTo(0,-r*0.85);ctx.lineTo(r*0.18,0);ctx.lineTo(0,r*0.1);ctx.closePath();ctx.strokeStyle='#000';ctx.lineWidth=Math.max(1,size*0.018);ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*0.06,0,Math.PI*2);ctx.fillStyle='#000';ctx.fill();[0,Math.PI/2,Math.PI,Math.PI*1.5].forEach((a,i)=>{ctx.beginPath();ctx.moveTo(Math.sin(a)*r*0.85,-Math.cos(a)*r*0.85);ctx.lineTo(Math.sin(a)*r*0.95,-Math.cos(a)*r*0.95);ctx.strokeStyle='#000';ctx.lineWidth=i===0?size*0.025:size*0.015;ctx.stroke();});ctx.restore();}

function drawScale(ctx,x,y,w,h,zoom,lat){const STEPS=[1,2,5,10,20,50,100,200,500,1000,2000,5000,10000,20000,50000,100000,200000,500000,1000000],NS=5;const mpp=156543.03392*Math.cos(lat*Math.PI/180)/Math.pow(2,zoom);let best=STEPS[0];for(const s of STEPS){const px=s/mpp;if(px>=200&&px<=300){best=s;break;}if(px>300){best=s;break;}best=s;}const bW=w*0.85,sW=bW/NS,bH=h*0.2,unit=best>=1000?'km':'m',pad=w*0.075;ctx.fillStyle='rgba(255,255,255,0.92)';ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(x,y,w,h,6);ctx.fill();ctx.stroke();const bX=x+pad,bY=y+h*0.5;ctx.font=`${Math.max(8,Math.round(h*0.16))}px Inter,sans-serif`;ctx.fillStyle='#1e293b';ctx.textAlign='center';ctx.textBaseline='bottom';for(let i=0;i<=NS;i++){const d=(best/NS)*i,v=unit==='km'?d/1000:d;ctx.fillText(i===NS?`${Number.isInteger(v)?v:v.toFixed(1)} ${unit}`:`${Number.isInteger(v)?v:v.toFixed(1)}`,bX+sW*i,bY-3);}for(let i=0;i<NS;i++){ctx.fillStyle=i%2===0?'#1e293b':'#fff';ctx.fillRect(bX+sW*i,bY,sW,bH);}ctx.strokeStyle='#1e293b';ctx.lineWidth=1;ctx.strokeRect(bX,bY,bW,bH);ctx.font=`italic ${Math.max(7,Math.round(h*0.13))}px Inter,sans-serif`;ctx.fillStyle='#64748b';ctx.textAlign='center';ctx.fillText('Projeção: Web Mercator (EPSG:3857)',x+w/2,bY+bH+h*0.2);}

function drawLegend(ctx,x,y,w,title,items){const p=w*0.06,iH=w*0.1,tH=w*0.14,ss=w*0.07,totH=tH+items.length*iH+p*2;ctx.fillStyle='rgba(255,255,255,0.95)';ctx.strokeStyle='rgba(0,0,0,0.08)';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(x,y,w,totH,4);ctx.fill();ctx.stroke();ctx.font=`bold ${Math.max(8,Math.round(w*0.07))}px Inter,sans-serif`;ctx.fillStyle='#0f172a';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(title,x+p,y+p);ctx.strokeStyle='#e2e8f0';ctx.beginPath();ctx.moveTo(x+p,y+tH);ctx.lineTo(x+w-p,y+tH);ctx.stroke();items.forEach((it,i)=>{const iy=y+tH+p/2+i*iH;ctx.fillStyle=it.color||'#ccc';ctx.fillRect(x+p,iy,ss,ss);ctx.strokeStyle='rgba(0,0,0,0.1)';ctx.strokeRect(x+p,iy,ss,ss);ctx.fillStyle='#1e293b';ctx.font=`${Math.max(7,Math.round(w*0.06))}px Inter,sans-serif`;ctx.textBaseline='middle';ctx.fillText(it.value||'',x+p+ss+p/2,iy+ss/2);});}

function drawAnnLegend(ctx,x,y,w,anns,vizName){const p=w*0.05,iH=w*0.1,tH=w*0.12,totH=tH+anns.length*iH+p*2;ctx.fillStyle='rgba(255,255,255,0.95)';ctx.strokeStyle='rgba(0,0,0,0.08)';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(x,y,w,totH,4);ctx.fill();ctx.stroke();ctx.font=`bold ${Math.max(8,Math.round(w*0.06))}px Inter,sans-serif`;ctx.fillStyle='#0f172a';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(vizName||'Informações do Mapa',x+p,y+p);ctx.strokeStyle='#e2e8f0';ctx.beginPath();ctx.moveTo(x+p,y+tH);ctx.lineTo(x+w-p,y+tH);ctx.stroke();anns.forEach((a,i)=>{const iy=y+tH+p/2+i*iH;if(a.type==='point'){const cr=w*0.04,cx2=x+p+cr,cy2=iy+cr;ctx.beginPath();ctx.arc(cx2,cy2,cr,0,Math.PI*2);ctx.fillStyle=a.color||'#fff';ctx.fill();ctx.strokeStyle=(!a.color||a.color==='#FFFFFF'||a.color==='#ffffff')?'#000':a.color;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#000';ctx.font=`bold ${Math.max(7,Math.round(cr*0.9))}px Inter,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(a.number),cx2,cy2);ctx.textAlign='left';ctx.fillStyle='#1e293b';ctx.font=`${Math.max(7,Math.round(w*0.055))}px Inter,sans-serif`;ctx.fillText(a.description||`Ponto ${a.number}`,x+p+cr*2+p,cy2);}else{const lx=x+p,ly=iy+iH/2;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+w*0.12,ly);ctx.strokeStyle=a.type==='line'?(a.lineColor||a.color||'#000'):(a.strokeColor||'#000');ctx.lineWidth=Math.min((a.type==='line'?(a.lineWidth??2.5):(a.strokeWidth??2.5)),4);ctx.stroke();ctx.fillStyle='#1e293b';ctx.font=`${Math.max(7,Math.round(w*0.055))}px Inter,sans-serif`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(a.description||`${a.type==='line'?'Linha':'Polígono'} ${a.number}`,lx+w*0.15,ly);}});}

function drawTitle(ctx, x, y, cfg) {
  const { title, subtitle, fontFamily, titleSize, subtitleSize, titleWeight, subtitleWeight, titleStyle, subtitleStyle, titleColor, subtitleColor, showBg, bgColor, bgOpacity, align } = cfg;
  const ff = fontFamily || 'Inter, sans-serif';
  const ts = titleSize || 32, ss = subtitleSize || 18;
  const pad = 16, gap = 6;
  // Measure text
  ctx.font = `${titleStyle||''} ${titleWeight||'bold'} ${ts}px ${ff}`.trim();
  const tw = ctx.measureText(title || '').width;
  ctx.font = `${subtitleStyle||''} ${subtitleWeight||'normal'} ${ss}px ${ff}`.trim();
  const sw = subtitle ? ctx.measureText(subtitle).width : 0;
  const boxW = Math.max(tw, sw) + pad * 2;
  const boxH = pad + ts + (subtitle ? gap + ss : 0) + pad;
  // Background
  if (showBg) {
    const r = parseInt((bgColor||'#000000').slice(1,3),16), g = parseInt((bgColor||'#000000').slice(3,5),16), b = parseInt((bgColor||'#000000').slice(5,7),16);
    ctx.fillStyle = `rgba(${r},${g},${b},${bgOpacity??0.7})`;
    ctx.beginPath(); ctx.roundRect(x, y, boxW, boxH, 6); ctx.fill();
  }
  // Title
  const ta = align || 'left';
  ctx.textAlign = ta;
  const tx = ta === 'center' ? x + boxW/2 : ta === 'right' ? x + boxW - pad : x + pad;
  ctx.font = `${titleStyle||''} ${titleWeight||'bold'} ${ts}px ${ff}`.trim();
  ctx.fillStyle = titleColor || '#ffffff';
  ctx.textBaseline = 'top';
  ctx.fillText(title || '', tx, y + pad);
  // Subtitle
  if (subtitle) {
    ctx.font = `${subtitleStyle||''} ${subtitleWeight||'normal'} ${ss}px ${ff}`.trim();
    ctx.fillStyle = subtitleColor || '#cccccc';
    ctx.fillText(subtitle, tx, y + pad + ts + gap);
  }
}

// Fixed overlay sizes in pixels (designed for readable output)
const OVL = { NORTH: 120, SCALE_W: 400, SCALE_H: 80, LEG_W: 280, ANN_W: 340, TITLE_W: 500 };

function drawOverlays(ctx, W, H, opts) {
  const { incNorth, incScale, incLegend, incAnnLegend, incTitle, overlayPos, bearing, zoom, lat, legendData, annData, vizName, scale, titleCfg } = opts;
  const s = scale || 1;
  if (incTitle && titleCfg) drawTitle(ctx, overlayPos.title.x*W, overlayPos.title.y*H, { ...titleCfg, titleSize: (titleCfg.titleSize||32)*s, subtitleSize: (titleCfg.subtitleSize||18)*s });
  if (incNorth) drawNorth(ctx, overlayPos.north.x*W, overlayPos.north.y*H, OVL.NORTH*s, bearing);
  if (incScale) drawScale(ctx, overlayPos.scale.x*W, overlayPos.scale.y*H, OVL.SCALE_W*s, OVL.SCALE_H*s, zoom, lat);
  if (incLegend && legendData?.items?.length) drawLegend(ctx, overlayPos.legend.x*W, overlayPos.legend.y*H, OVL.LEG_W*s, legendData.title, legendData.items);
  if (incAnnLegend && annData?.length) drawAnnLegend(ctx, overlayPos.annLegend.x*W, overlayPos.annLegend.y*H, OVL.ANN_W*s, annData, vizName);
}

// Draggable overlay (invisible drag handle)
const DragHandle = ({ id, pos, onMove, visible, size }) => {
  const ref = useRef(null);
  const onDown = useCallback((e) => {
    if (!ref.current) return;
    e.preventDefault(); e.stopPropagation();
    const rect = ref.current.getBoundingClientRect();
    const ox = e.clientX - rect.left, oy = e.clientY - rect.top;
    const onMv = (ev) => {
      const pr = ref.current.parentElement.getBoundingClientRect();
      onMove(id, Math.max(0, Math.min((ev.clientX - pr.left - ox) / pr.width, 0.95)),
                  Math.max(0, Math.min((ev.clientY - pr.top - oy) / pr.height, 0.95)));
    };
    const onUp = () => { window.removeEventListener('mousemove', onMv); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMv); window.addEventListener('mouseup', onUp);
  }, [id, onMove]);
  if (!visible) return null;
  return <div ref={ref} onMouseDown={onDown} style={{
    position: 'absolute', left: `${pos.x*100}%`, top: `${pos.y*100}%`,
    width: size?.w || 40, height: size?.h || 40, cursor: 'move', zIndex: 20,
    border: '2px dashed rgba(0,150,255,0.5)', borderRadius: 3, background: 'rgba(0,150,255,0.05)',
  }} title="Arraste para reposicionar" />;
};

const MAP_STYLES = [
  { value: 'mapbox://styles/mapbox/light-v11', label: 'Claro' },
  { value: 'mapbox://styles/mapbox/dark-v11', label: 'Escuro' },
  { value: 'mapbox://styles/mapbox/streets-v12', label: 'Ruas' },
  { value: 'mapbox://styles/mapbox/outdoors-v12', label: 'Exterior' },
  { value: 'mapbox://styles/mapbox/satellite-streets-v12', label: 'Satélite' },
];

const LAYER_CATEGORIES = [
  { key: 'labels', label: 'Rótulos', emoji: '🏷️', match: (id) => id.includes('label') },
  { key: 'roads', label: 'Ruas', emoji: '🛣️', match: (id) => (id.startsWith('road') || id.startsWith('bridge') || id.startsWith('tunnel')) && !id.includes('label') },
  { key: 'buildings', label: 'Construções', emoji: '🏢', match: (id) => id.includes('building') },
  { key: 'admin', label: 'Limites', emoji: '🗺️', match: (id) => id.includes('admin') || id.includes('boundary') },
  { key: 'water', label: 'Água', emoji: '💧', match: (id) => (id.includes('water') || id.includes('river')) && !id.includes('label') },
  { key: 'landuse', label: 'Vegetação', emoji: '🌿', match: (id) => id.includes('landuse') || id.includes('landcover') || id.includes('national-park') },
];

const OWN_LAYERS = new Set(['sectors-fill-layer','sectors-line-layer','sectors-point-layer','annotations-fill-layer','annotations-line-solid','annotations-line-dashed','annotations-line-dotted','annotations-point-layer','annotations-point-labels','annotations-vertex-layer','graticule-lines','graticule-labels']);

const ImageExportStudio = () => {
  const { map, mapLoaded, mapStyle } = useContext(MapContext);
  const { showImageStudio, setShowImageStudio, showAttributeLegend, showAnnotationLegend, showNorthArrow, showScaleBar, exportPages, setExportPages } = useContext(UIContext);
  const { getActiveAnnotations, visualizations, activeVisualizationId } = useContext(AnnotationContext);

  const [preset, setPreset] = useState(0);
  const [customW, setCustomW] = useState(3840);
  const [customH, setCustomH] = useState(2160);
  const [useCustom, setUseCustom] = useState(false);
  const [orientation, setOrientation] = useState('landscape'); // 'landscape' or 'portrait'
  const [format, setFormat] = useState('png');
  const [jpegQuality, setJpegQuality] = useState(0.92);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState('');
  const [openSections, setOpenSections] = useState({ res: true, fmt: false, elem: true, title: false, mapCfg: false });

  // Map config for preview
  const [previewStyle, setPreviewStyle] = useState('');
  const [layerVis, setLayerVis] = useState({ labels: true, roads: true, buildings: true, admin: true, water: true, landuse: true });
  const [prvRenderMode, setPrvRenderMode] = useState('filled');
  const [prvFillOpacity, setPrvFillOpacity] = useState(0.6);
  const [prvBorderWidth, setPrvBorderWidth] = useState(2);

  const [incNorth, setIncNorth] = useState(true);
  const [incScale, setIncScale] = useState(true);
  const [incLegend, setIncLegend] = useState(true);
  const [incAnnLegend, setIncAnnLegend] = useState(true);
  const [incTitle, setIncTitle] = useState(true);

  const [titleCfg, setTitleCfg] = useState({
    title: 'Título do Mapa', subtitle: '', fontFamily: 'Inter, sans-serif',
    titleSize: 32, subtitleSize: 18, titleWeight: 'bold', subtitleWeight: 'normal',
    titleStyle: '', subtitleStyle: 'italic', titleColor: '#ffffff', subtitleColor: '#cccccc',
    showBg: true, bgColor: '#000000', bgOpacity: 0.6, align: 'left',
  });

  const [overlayPos, setOverlayPos] = useState({
    north: { x: 0.02, y: 0.05 }, scale: { x: 0.02, y: 0.82 },
    legend: { x: 0.82, y: 0.05 }, annLegend: { x: 0.80, y: 0.35 },
    title: { x: 0.02, y: 0.02 },
  });

  const [legendData, setLegendData] = useState(null);
  const [annData, setAnnData] = useState([]);
  const [vizName, setVizName] = useState('');

  const previewMapRef = useRef(null);
  const previewContainerRef = useRef(null);
  const previewFrameRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const [frameSize, setFrameSize] = useState({ w: 800, h: 450 });

  // Viewport zoom/pan (workspace navigation)
  const [viewZoom, setViewZoom] = useState(1);
  const [viewPan, setViewPan] = useState({ x: 0, y: 0 });

  // ---- Pages system ----
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const pageIdxRef = useRef(0);
  const isLoadingPageRef = useRef(false);

  // Keep ref in sync
  useEffect(() => { pageIdxRef.current = currentPageIdx; }, [currentPageIdx]);

  const serializeCurrentPage = useCallback((name) => ({
    name: name || `Página ${pageIdxRef.current + 1}`,
    preset, customW, customH, useCustom, orientation, format, jpegQuality,
    previewStyle,
    layerVis: { ...layerVis },
    prvRenderMode, prvFillOpacity, prvBorderWidth,
    incNorth, incScale, incLegend, incAnnLegend, incTitle,
    titleCfg: { ...titleCfg },
    overlayPos: JSON.parse(JSON.stringify(overlayPos)),
    mapCamera: (() => {
      const pm = previewMapRef.current;
      if (pm) { const c = pm.getCenter(); return { center: [c.lng, c.lat], zoom: pm.getZoom(), bearing: pm.getBearing(), pitch: pm.getPitch() }; }
      return null;
    })(),
  }), [preset, customW, customH, useCustom, orientation, format, jpegQuality,
    previewStyle, layerVis, prvRenderMode, prvFillOpacity, prvBorderWidth,
    incNorth, incScale, incLegend, incAnnLegend, incTitle, titleCfg, overlayPos]);

  const loadPage = useCallback((pg) => {
    if (!pg) return;
    isLoadingPageRef.current = true;
    setPreset(pg.preset ?? 0); setCustomW(pg.customW ?? 3840); setCustomH(pg.customH ?? 2160);
    setUseCustom(pg.useCustom ?? false); setOrientation(pg.orientation ?? 'landscape');
    setFormat(pg.format ?? 'png'); setJpegQuality(pg.jpegQuality ?? 0.92);
    const newStyle = pg.previewStyle || '';
    setPreviewStyle(newStyle);
    const newLayerVis = pg.layerVis ? { ...pg.layerVis } : { labels:true,roads:true,buildings:true,admin:true,water:true,landuse:true };
    setLayerVis(newLayerVis);
    const newRenderMode = pg.prvRenderMode ?? 'filled';
    const newFillOpacity = pg.prvFillOpacity ?? 0.6;
    const newBorderWidth = pg.prvBorderWidth ?? 2;
    setPrvRenderMode(newRenderMode); setPrvFillOpacity(newFillOpacity); setPrvBorderWidth(newBorderWidth);
    setIncNorth(pg.incNorth ?? true); setIncScale(pg.incScale ?? true);
    setIncLegend(pg.incLegend ?? true); setIncAnnLegend(pg.incAnnLegend ?? true);
    setIncTitle(pg.incTitle ?? true);
    if (pg.titleCfg) setTitleCfg({ ...pg.titleCfg });
    if (pg.overlayPos) setOverlayPos(JSON.parse(JSON.stringify(pg.overlayPos)));

    // Apply visual changes to the actual preview map instance
    const pm = previewMapRef.current;
    const cam = pg.mapCamera;
    if (pm && newStyle) {
      const center = cam ? cam.center : pm.getCenter();
      const z = cam ? cam.zoom : pm.getZoom();
      const bearing = cam ? cam.bearing : pm.getBearing();
      const pitch = cam ? cam.pitch : pm.getPitch();
      pm.setStyle(newStyle);
      pm.once('style.load', () => {
        pm.jumpTo({ center, zoom: z, bearing, pitch });
        // Re-apply layer visibility
        setTimeout(() => {
          const allLayers = pm.getStyle().layers || [];
          LAYER_CATEGORIES.forEach(cat => {
            if (!newLayerVis[cat.key]) {
              allLayers.forEach(l => {
                if (!OWN_LAYERS.has(l.id) && cat.match(l.id)) {
                  try { pm.setLayoutProperty(l.id, 'visibility', 'none'); } catch(e) {}
                }
              });
            }
          });
          // Re-apply render mode
          try {
            if (pm.getLayer('sectors-fill-layer')) {
              pm.setPaintProperty('sectors-fill-layer', 'fill-opacity', newRenderMode === 'filled' ? newFillOpacity : 0);
            }
            if (pm.getLayer('sectors-line-layer')) {
              pm.setPaintProperty('sectors-line-layer', 'line-width', newRenderMode === 'border' ? newBorderWidth : 1);
            }
          } catch(e) {}
          isLoadingPageRef.current = false;
        }, 200);
      });
    } else {
      // No style change, just apply layers and render
      if (pm && pm.isStyleLoaded()) {
        if (cam) pm.jumpTo({ center: cam.center, zoom: cam.zoom, bearing: cam.bearing, pitch: cam.pitch });
        const allLayers = pm.getStyle().layers || [];
        LAYER_CATEGORIES.forEach(cat => {
          const vis = newLayerVis[cat.key] ? 'visible' : 'none';
          allLayers.forEach(l => {
            if (!OWN_LAYERS.has(l.id) && cat.match(l.id)) {
              try { pm.setLayoutProperty(l.id, 'visibility', vis); } catch(e) {}
            }
          });
        });
        try {
          if (pm.getLayer('sectors-fill-layer')) pm.setPaintProperty('sectors-fill-layer', 'fill-opacity', newRenderMode === 'filled' ? newFillOpacity : 0);
          if (pm.getLayer('sectors-line-layer')) pm.setPaintProperty('sectors-line-layer', 'line-width', newRenderMode === 'border' ? newBorderWidth : 1);
        } catch(e) {}
      }
      setTimeout(() => { isLoadingPageRef.current = false; }, 300);
    }
  }, []);

  const saveCurrentPage = useCallback(() => {
    if (isLoadingPageRef.current) return;
    const idx = pageIdxRef.current;
    setExportPages(prev => {
      if (idx >= prev.length) return prev;
      const next = [...prev];
      next[idx] = serializeCurrentPage(prev[idx]?.name);
      return next;
    });
  }, [serializeCurrentPage, setExportPages]);

  const switchPage = useCallback((idx) => {
    if (idx === pageIdxRef.current) return;
    // Save current page
    const curIdx = pageIdxRef.current;
    setExportPages(prev => {
      const next = [...prev];
      next[curIdx] = serializeCurrentPage(prev[curIdx]?.name);
      return next;
    });
    // Switch and load
    setCurrentPageIdx(idx);
    pageIdxRef.current = idx;
    setExportPages(prev => {
      const pg = prev[idx];
      if (pg) loadPage(pg);
      return prev;
    });
  }, [serializeCurrentPage, setExportPages, loadPage]);

  const addPage = useCallback(() => {
    saveCurrentPage();
    const defaultPage = {
      name: `Página ${exportPages.length + 1}`,
      preset: 0, customW: 3840, customH: 2160, useCustom: false,
      orientation: 'landscape', format: 'png', jpegQuality: 0.92,
      previewStyle: mapStyle || '',
      layerVis: { labels:true,roads:true,buildings:true,admin:true,water:true,landuse:true },
      prvRenderMode: 'filled', prvFillOpacity: 0.6, prvBorderWidth: 2,
      incNorth: true, incScale: true, incLegend: true, incAnnLegend: true, incTitle: true,
      titleCfg: { title: 'Título do Mapa', subtitle: '', fontFamily: 'Inter, sans-serif', titleSize: 32, subtitleSize: 18, titleWeight: 'bold', subtitleWeight: 'normal', titleStyle: '', subtitleStyle: 'italic', titleColor: '#ffffff', subtitleColor: '#cccccc', showBg: true, bgColor: '#000000', bgOpacity: 0.6, align: 'left' },
      overlayPos: { north:{x:0.02,y:0.05}, scale:{x:0.02,y:0.82}, legend:{x:0.82,y:0.05}, annLegend:{x:0.80,y:0.35}, title:{x:0.02,y:0.02} },
    };
    setExportPages(prev => {
      const newIdx = prev.length;
      setCurrentPageIdx(newIdx);
      pageIdxRef.current = newIdx;
      return [...prev, defaultPage];
    });
    loadPage(defaultPage);
  }, [saveCurrentPage, setExportPages, loadPage, exportPages.length, mapStyle]);

  const deletePage = useCallback((idx) => {
    if (exportPages.length <= 1) return;
    isLoadingPageRef.current = true;
    setExportPages(prev => {
      const next = prev.filter((_, i) => i !== idx);
      const newIdx = Math.min(idx, next.length - 1);
      setCurrentPageIdx(newIdx);
      pageIdxRef.current = newIdx;
      loadPage(next[newIdx]);
      return next;
    });
  }, [exportPages.length, setExportPages, loadPage]);

  // Auto-save current page on config change (guarded)
  useEffect(() => {
    if (!showImageStudio || exportPages.length === 0 || isLoadingPageRef.current) return;
    const t = setTimeout(() => saveCurrentPage(), 600);
    return () => clearTimeout(t);
  }, [preset, customW, customH, useCustom, orientation, format, jpegQuality,
    previewStyle, layerVis, prvRenderMode, prvFillOpacity, prvBorderWidth,
    incNorth, incScale, incLegend, incAnnLegend, incTitle, titleCfg, overlayPos]);

  const baseW = useCustom ? customW : PRESETS[preset].w;
  const baseH = useCustom ? customH : PRESETS[preset].h;
  const targetW = (!useCustom && orientation === 'portrait') ? baseH : baseW;
  const targetH = (!useCustom && orientation === 'portrait') ? baseW : baseH;

  // Fit frame to view
  const fitToView = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ww = wrapper.clientWidth - 40, wh = wrapper.clientHeight - 40;
    const frameW = targetW, frameH = targetH;
    const scale = Math.min(ww / frameW, wh / frameH, 1);
    setViewZoom(scale);
    setViewPan({ x: 0, y: 0 });
  }, [targetW, targetH]);

  // Auto-fit when resolution changes or studio opens
  useEffect(() => {
    if (showImageStudio) setTimeout(fitToView, 300);
  }, [targetW, targetH, showImageStudio, fitToView]);

  // Viewport scroll zoom (only when scrolling OUTSIDE the map frame)
  const handleWheel = useCallback((e) => {
    // If scrolling inside the map frame, let Mapbox handle it
    if (previewFrameRef.current && previewFrameRef.current.contains(e.target)) {
      return; // Mapbox handles its own scroll zoom
    }
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setViewZoom(z => Math.max(0.05, Math.min(z * delta, 3)));
  }, []);

  // Viewport pan (middle-click or Ctrl+click)
  const handleWrapperMouseDown = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      const startX = e.clientX, startY = e.clientY;
      const startPan = { ...viewPan };
      const onMove = (ev) => {
        setViewPan({ x: startPan.x + ev.clientX - startX, y: startPan.y + ev.clientY - startY });
      };
      const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
      window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
    }
  }, [viewPan]);

  // Track frame size
  useEffect(() => {
    const el = previewFrameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setFrameSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [showImageStudio]);

  // Change preview map style
  const handlePreviewStyleChange = useCallback((newStyle) => {
    setPreviewStyle(newStyle);
    const pm = previewMapRef.current;
    if (pm) {
      const center = pm.getCenter(), zoom = pm.getZoom(), bearing = pm.getBearing(), pitch = pm.getPitch();
      pm.setStyle(newStyle);
      pm.once('style.load', () => {
        pm.jumpTo({ center, zoom, bearing, pitch });
        // Re-apply layer visibility
        setTimeout(() => {
          const allLayers = pm.getStyle().layers || [];
          LAYER_CATEGORIES.forEach(cat => {
            if (!layerVis[cat.key]) {
              allLayers.forEach(l => {
                if (!OWN_LAYERS.has(l.id) && cat.match(l.id)) {
                  try { pm.setLayoutProperty(l.id, 'visibility', 'none'); } catch(e) {}
                }
              });
            }
          });
        }, 200);
      });
    }
  }, [layerVis]);

  // Toggle layer visibility in preview map
  const togglePreviewLayer = useCallback((catKey) => {
    const pm = previewMapRef.current;
    if (!pm || !pm.isStyleLoaded()) return;
    const cat = LAYER_CATEGORIES.find(c => c.key === catKey);
    if (!cat) return;
    const newVis = !layerVis[catKey];
    const visibility = newVis ? 'visible' : 'none';
    const allLayers = pm.getStyle().layers || [];
    allLayers.forEach(l => {
      if (!OWN_LAYERS.has(l.id) && cat.match(l.id)) {
        try { pm.setLayoutProperty(l.id, 'visibility', visibility); } catch(e) {}
      }
    });
    setLayerVis(prev => ({ ...prev, [catKey]: newVis }));
  }, [layerVis]);

  // Apply render mode / opacity / border to preview map
  const applyPreviewRender = useCallback(() => {
    const pm = previewMapRef.current;
    if (!pm || !pm.isStyleLoaded()) return;
    try {
      if (pm.getLayer('sectors-fill-layer')) {
        pm.setPaintProperty('sectors-fill-layer', 'fill-opacity', prvRenderMode === 'filled' ? prvFillOpacity : 0);
      }
      if (pm.getLayer('sectors-line-layer')) {
        pm.setPaintProperty('sectors-line-layer', 'line-width', prvRenderMode === 'border' ? prvBorderWidth : 1);
        pm.setPaintProperty('sectors-line-layer', 'line-opacity', 1);
      }
    } catch(e) {}
  }, [prvRenderMode, prvFillOpacity, prvBorderWidth]);

  useEffect(() => { applyPreviewRender(); }, [applyPreviewRender]);

  // Resize map when frame changes
  useEffect(() => {
    if (previewMapRef.current) setTimeout(() => previewMapRef.current?.resize(), 50);
  }, [frameSize]);

  // Init on open
  useEffect(() => {
    if (!showImageStudio || !mapLoaded || !map?.current || !previewContainerRef.current) return;
    setIncNorth(showNorthArrow); setIncScale(showScaleBar);
    setIncLegend(showAttributeLegend); setIncAnnLegend(showAnnotationLegend);
    setPreviewStyle(mapStyle || 'mapbox://styles/mapbox/light-v11');
    setLayerVis({ labels: true, roads: true, buildings: true, admin: true, water: true, landuse: true });

    // Init pages: load saved page or create first one
    if (exportPages.length > 0) {
      loadPage(exportPages[currentPageIdx] || exportPages[0]);
    } else {
      setExportPages([{ name: 'Página 1', preset: 0, customW: 3840, customH: 2160, useCustom: false,
        orientation: 'landscape', format: 'png', jpegQuality: 0.92, previewStyle: mapStyle || '',
        layerVis: { labels:true,roads:true,buildings:true,admin:true,water:true,landuse:true },
        prvRenderMode: 'filled', prvFillOpacity: 0.6, prvBorderWidth: 2,
        incNorth: showNorthArrow, incScale: showScaleBar, incLegend: showAttributeLegend, incAnnLegend: showAnnotationLegend, incTitle: true,
        titleCfg: { title: 'Título do Mapa', subtitle: '', fontFamily: 'Inter, sans-serif', titleSize: 32, subtitleSize: 18, titleWeight: 'bold', subtitleWeight: 'normal', titleStyle: '', subtitleStyle: 'italic', titleColor: '#ffffff', subtitleColor: '#cccccc', showBg: true, bgColor: '#000000', bgOpacity: 0.6, align: 'left' },
        overlayPos: { north:{x:0.02,y:0.05}, scale:{x:0.02,y:0.82}, legend:{x:0.82,y:0.05}, annLegend:{x:0.80,y:0.35}, title:{x:0.02,y:0.02} },
      }]);
      setCurrentPageIdx(0);
    }

    // Read legend
    const legEl = document.querySelector('.map-container .legend');
    if (legEl) {
      const title = legEl.querySelector('.legend-title')?.textContent || 'Legenda';
      const items = [];
      legEl.querySelectorAll('.legend-item').forEach(el => {
        const cEl = el.querySelector('.legend-color');
        const c = cEl ? getComputedStyle(cEl).backgroundColor : '#ccc';
        const v = el.querySelector('.legend-value')?.textContent || '';
        const m = c.match(/\d+/g);
        items.push({ color: (m?.length>=3)?'#'+m.slice(0,3).map(x=>parseInt(x).toString(16).padStart(2,'0')).join(''):'#ccc', value: v });
      });
      setLegendData({ title, items });
    }
    setAnnData(getActiveAnnotations());
    const viz = visualizations.find(v => v.id === activeVisualizationId);
    setVizName(viz?.name || 'Informações do Mapa');

    // Create preview map
    const mainMap = map.current;
    const timer = setTimeout(() => {
      if (previewMapRef.current) { previewMapRef.current.remove(); previewMapRef.current = null; }
      if (!previewContainerRef.current) return;
      const pm = new mapboxgl.Map({
        container: previewContainerRef.current,
        style: mainMap.getStyle(), center: mainMap.getCenter(),
        zoom: mainMap.getZoom(), bearing: mainMap.getBearing(), pitch: mainMap.getPitch(),
        preserveDrawingBuffer: true, attributionControl: false,
      });
      pm.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      previewMapRef.current = pm;
      // Redraw overlay canvas whenever map moves
      pm.on('moveend', () => redrawOverlayCanvas());
      pm.on('idle', () => redrawOverlayCanvas());
    }, 200);
    return () => { clearTimeout(timer); if (previewMapRef.current) { previewMapRef.current.remove(); previewMapRef.current = null; } };
  }, [showImageStudio, mapLoaded]);

  // Redraw overlay canvas (called on any change)
  const redrawOverlayCanvas = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    const frame = previewFrameRef.current;
    const pm = previewMapRef.current;
    if (!canvas || !frame || !pm) return;
    const w = frame.clientWidth, h = frame.clientHeight;
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, w, h);
    const center = pm.getCenter();
    // Frame is at actual target resolution, so scale=1 (fixed pixel sizes)
    drawOverlays(ctx, w, h, {
      incNorth, incScale, incLegend, incAnnLegend, incTitle, overlayPos,
      bearing: pm.getBearing(), zoom: pm.getZoom(), lat: center.lat,
      legendData, annData, vizName, scale: 1, titleCfg,
    });
  }, [incNorth, incScale, incLegend, incAnnLegend, incTitle, overlayPos, legendData, annData, vizName, targetW, titleCfg]);

  // Redraw on any overlay change
  useEffect(() => { redrawOverlayCanvas(); }, [redrawOverlayCanvas, frameSize]);

  const moveOverlay = useCallback((id, x, y) => {
    setOverlayPos(prev => ({ ...prev, [id]: { x, y } }));
  }, []);

  const handleExport = useCallback(async () => {
    const pm = previewMapRef.current;
    if (!pm) return;
    setExporting(true); setProgress('Preparando...');
    try {
      const style = pm.getStyle(), center = pm.getCenter(), bearing = pm.getBearing(), pitch = pm.getPitch();
      // Frame is already at targetW dimensions, so use zoom directly
      const exportZoom = pm.getZoom();

      const hiddenDiv = document.createElement('div');
      hiddenDiv.style.cssText = `position:fixed;left:-99999px;top:-99999px;width:${targetW}px;height:${targetH}px;overflow:hidden;`;
      document.body.appendChild(hiddenDiv);
      setProgress('Renderizando mapa em alta resolução...');

      const hm = new mapboxgl.Map({ container: hiddenDiv, style, center: [center.lng, center.lat], zoom: exportZoom, bearing, pitch, preserveDrawingBuffer: true, interactive: false, fadeDuration: 0, attributionControl: false });
      await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error('Timeout')), 30000); hm.once('idle', () => { clearTimeout(t); setTimeout(res, 2000); }); });

      setProgress('Capturando imagem...');
      const out = document.createElement('canvas'); out.width = targetW; out.height = targetH;
      const ctx = out.getContext('2d');
      ctx.drawImage(hm.getCanvas(), 0, 0, targetW, targetH);

      setProgress('Desenhando elementos...');
      drawOverlays(ctx, targetW, targetH, {
        incNorth, incScale, incLegend, incAnnLegend, incTitle, overlayPos,
        bearing, zoom: exportZoom, lat: center.lat,
        legendData, annData, vizName, scale: 1, titleCfg,
      });

      setProgress('Gerando arquivo...');
      const mime = format==='jpeg'?'image/jpeg':'image/png';
      out.toBlob((blob) => {
        if (!blob) { setProgress('Erro.'); setExporting(false); return; }
        const url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = `mapa_export_${targetW}x${targetH}.${format}`; a.click();
        URL.revokeObjectURL(url); hm.remove(); document.body.removeChild(hiddenDiv);
        setExporting(false); setProgress('✅ Imagem exportada com sucesso!');
        setTimeout(() => setProgress(''), 3000);
      }, mime, format==='jpeg'?jpegQuality:undefined);
    } catch (err) { console.error('Export error:', err); setProgress(`Erro: ${err.message}`); setExporting(false); }
  }, [targetW, targetH, format, jpegQuality, incNorth, incScale, incLegend, incAnnLegend, overlayPos, legendData, annData, vizName, setShowImageStudio]);

  if (!showImageStudio || !mapLoaded) return null;

  return (
    <div className="image-studio-overlay">
      <div className="image-studio">
        <div className="studio-sidebar">
          <div className="studio-sidebar-header">
            <h2><span className="studio-icon">📷</span> Exportar Imagem</h2>
            <button className="studio-close-btn" onClick={() => setShowImageStudio(false)}>✕</button>
          </div>
          <div className="studio-sidebar-body">
            <div className="studio-section">
              <div className="studio-section-title studio-collapsible" onClick={() => setOpenSections(s => ({...s, res: !s.res}))}>
                <span>📐 Resolução</span><span className={`studio-chevron ${openSections.res ? 'open' : ''}`}>▸</span>
              </div>
              {openSections.res && (<>
              <div className="studio-presets">
                {PRESETS.map((p, i) => (
                  <button key={p.label} className={`studio-preset-btn ${!useCustom && preset === i ? 'active' : ''}`}
                    onClick={() => { setPreset(i); setUseCustom(false); }}>
                    {p.label}<br /><span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{p.w}×{p.h}</span>
                  </button>
                ))}
                <button className={`studio-preset-btn ${useCustom ? 'active' : ''}`} onClick={() => setUseCustom(true)}>Custom</button>
              </div>
              {!useCustom && (
                <div className="studio-orientation-row">
                  <button className={`studio-orient-btn ${orientation === 'landscape' ? 'active' : ''}`}
                    onClick={() => setOrientation('landscape')} title="Paisagem">
                    <span style={{ fontSize: '1rem' }}>▬</span> Paisagem
                  </button>
                  <button className={`studio-orient-btn ${orientation === 'portrait' ? 'active' : ''}`}
                    onClick={() => setOrientation('portrait')} title="Retrato">
                    <span style={{ fontSize: '1rem' }}>▮</span> Retrato
                  </button>
                </div>
              )}
              {useCustom && (
                <div className="studio-resolution-custom">
                  <input type="number" value={customW} onChange={e => setCustomW(Number(e.target.value))} min={800} max={8000} />
                  <span>×</span>
                  <input type="number" value={customH} onChange={e => setCustomH(Number(e.target.value))} min={600} max={6000} />
                  <span>px</span>
                </div>
              )}
              <div className="studio-dpi-info">Saída: {targetW} × {targetH} px ({(targetW*targetH/1e6).toFixed(1)} MP) — {targetW > targetH ? 'Paisagem' : 'Retrato'}</div>
              </>)}
            </div>

            <div className="studio-section">
              <div className="studio-section-title studio-collapsible" onClick={() => setOpenSections(s => ({...s, fmt: !s.fmt}))}>
                <span>💾 Formato</span><span className={`studio-chevron ${openSections.fmt ? 'open' : ''}`}>▸</span>
              </div>
              {openSections.fmt && (<>
              <div className="studio-input-row">
                <label>Tipo</label>
                <select className="studio-select" value={format} onChange={e => setFormat(e.target.value)}>
                  <option value="png">PNG (sem perda)</option>
                  <option value="jpeg">JPEG (menor)</option>
                </select>
              </div>
              {format === 'jpeg' && (
                <div className="studio-range-row">
                  <label>Qualidade</label>
                  <input type="range" className="studio-range" min={0.5} max={1} step={0.01} value={jpegQuality} onChange={e => setJpegQuality(Number(e.target.value))} />
                  <span className="studio-range-value">{Math.round(jpegQuality*100)}%</span>
                </div>
              )}
              </>)}
            </div>

            <div className="studio-section">
              <div className="studio-section-title studio-collapsible" onClick={() => setOpenSections(s => ({...s, elem: !s.elem}))}>
                <span>🗂️ Elementos</span><span className={`studio-chevron ${openSections.elem ? 'open' : ''}`}>▸</span>
              </div>
              {openSections.elem && (<>
              <label className="studio-check-row"><input type="checkbox" checked={incNorth} onChange={e => setIncNorth(e.target.checked)} /><span className="studio-check-label">🧭 Indicador de Norte</span></label>
              <label className="studio-check-row"><input type="checkbox" checked={incScale} onChange={e => setIncScale(e.target.checked)} /><span className="studio-check-label">📏 Barra de Escala</span></label>
              <label className="studio-check-row"><input type="checkbox" checked={incLegend} onChange={e => setIncLegend(e.target.checked)} /><span className="studio-check-label">🎨 Legenda de Cores</span></label>
              <label className="studio-check-row"><input type="checkbox" checked={incAnnLegend} onChange={e => setIncAnnLegend(e.target.checked)} /><span className="studio-check-label">ℹ️ Informações do Mapa</span></label>
              <label className="studio-check-row"><input type="checkbox" checked={incTitle} onChange={e => setIncTitle(e.target.checked)} /><span className="studio-check-label">🏷️ Título</span></label>
              <p style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 4, fontStyle: 'italic' }}>
                Arraste as bordas azuis no preview para reposicionar.
              </p>
              </>)}
            </div>

            {incTitle && (
              <div className="studio-section">
                <div className="studio-section-title studio-collapsible" onClick={() => setOpenSections(s => ({...s, title: !s.title}))}>
                  <span>🏷️ Título do Mapa</span><span className={`studio-chevron ${openSections.title ? 'open' : ''}`}>▸</span>
                </div>
                {openSections.title && (<>
                <div className="studio-input-row">
                  <label>Título</label>
                  <input className="studio-text-input" type="text" value={titleCfg.title} onChange={e => setTitleCfg(c => ({...c, title: e.target.value}))} placeholder="Título" />
                </div>
                <div className="studio-input-row">
                  <label>Subtítulo</label>
                  <input className="studio-text-input" type="text" value={titleCfg.subtitle} onChange={e => setTitleCfg(c => ({...c, subtitle: e.target.value}))} placeholder="Subtítulo (opcional)" />
                </div>
                <div className="studio-input-row">
                  <label>Fonte</label>
                  <select className="studio-select" value={titleCfg.fontFamily} onChange={e => setTitleCfg(c => ({...c, fontFamily: e.target.value}))}>
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Times New Roman, serif">Times New Roman</option>
                    <option value="Courier New, monospace">Courier New</option>
                  </select>
                </div>
                <div className="studio-input-row">
                  <label>Tamanho tít.</label>
                  <input type="number" className="studio-num-input" value={titleCfg.titleSize} onChange={e => setTitleCfg(c => ({...c, titleSize: Number(e.target.value)}))} min={12} max={80} />
                  <label>Sub.</label>
                  <input type="number" className="studio-num-input" value={titleCfg.subtitleSize} onChange={e => setTitleCfg(c => ({...c, subtitleSize: Number(e.target.value)}))} min={8} max={60} />
                </div>
                <div className="studio-input-row">
                  <label>Estilo tít.</label>
                  <select className="studio-select" value={titleCfg.titleWeight} onChange={e => setTitleCfg(c => ({...c, titleWeight: e.target.value}))}>
                    <option value="bold">Negrito</option>
                    <option value="normal">Normal</option>
                  </select>
                  <select className="studio-select" value={titleCfg.titleStyle} onChange={e => setTitleCfg(c => ({...c, titleStyle: e.target.value}))}>
                    <option value="">Normal</option>
                    <option value="italic">Itálico</option>
                  </select>
                </div>
                <div className="studio-input-row">
                  <label>Cor tít.</label>
                  <input type="color" value={titleCfg.titleColor} onChange={e => setTitleCfg(c => ({...c, titleColor: e.target.value}))} />
                  <label>Sub.</label>
                  <input type="color" value={titleCfg.subtitleColor} onChange={e => setTitleCfg(c => ({...c, subtitleColor: e.target.value}))} />
                </div>
                <div className="studio-input-row">
                  <label>Alinhamento</label>
                  <select className="studio-select" value={titleCfg.align} onChange={e => setTitleCfg(c => ({...c, align: e.target.value}))}>
                    <option value="left">Esquerda</option>
                    <option value="center">Centro</option>
                    <option value="right">Direita</option>
                  </select>
                </div>
                <label className="studio-check-row">
                  <input type="checkbox" checked={titleCfg.showBg} onChange={e => setTitleCfg(c => ({...c, showBg: e.target.checked}))} />
                  <span className="studio-check-label">Fundo</span>
                  {titleCfg.showBg && (<>
                    <input type="color" value={titleCfg.bgColor} onChange={e => setTitleCfg(c => ({...c, bgColor: e.target.value}))} style={{ marginLeft: 6 }} />
                    <input type="range" min={0} max={1} step={0.05} value={titleCfg.bgOpacity} onChange={e => setTitleCfg(c => ({...c, bgOpacity: Number(e.target.value)}))} style={{ width: 60, marginLeft: 4 }} />
                  </>)}
                </label>
                </>)}
              </div>
            )}

            {/* Configuração do Mapa */}
            <div className="studio-section">
              <div className="studio-section-title studio-collapsible" onClick={() => setOpenSections(s => ({...s, mapCfg: !s.mapCfg}))}>
                <span>🗺️ Configuração do Mapa</span><span className={`studio-chevron ${openSections.mapCfg ? 'open' : ''}`}>▸</span>
              </div>
              {openSections.mapCfg && (<>
                <div className="studio-input-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                  <label>Estilo Personalizado</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <input className="studio-text-input" type="text" placeholder="mapbox://styles/user/id"
                      onKeyDown={e => { if (e.key === 'Enter' && e.target.value.trim()) handlePreviewStyleChange(e.target.value.trim()); }}
                      id="studio-custom-style-input" />
                    <button className="studio-toolbar-btn" style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                      onClick={() => { const v = document.getElementById('studio-custom-style-input')?.value?.trim(); if (v) handlePreviewStyleChange(v); }}>
                      Aplicar
                    </button>
                  </div>
                </div>
                <div className="studio-input-row">
                  <label>Estilo</label>
                  <select className="studio-select" value={previewStyle} onChange={e => handlePreviewStyleChange(e.target.value)}>
                    {MAP_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div style={{ marginTop: 6 }}>
                  <label style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Camadas</label>
                  <div className="studio-layer-toggles">
                    {LAYER_CATEGORIES.map(cat => (
                      <label key={cat.key} className="studio-layer-item">
                        <input type="checkbox" checked={layerVis[cat.key]} onChange={() => togglePreviewLayer(cat.key)} />
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <label style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Renderização</label>
                  <div className="studio-input-row" style={{ marginTop: 4 }}>
                    <label>Modo</label>
                    <select className="studio-select" value={prvRenderMode} onChange={e => setPrvRenderMode(e.target.value)}>
                      <option value="filled">Preenchido</option>
                      <option value="border">Borda</option>
                    </select>
                  </div>
                  {prvRenderMode === 'filled' && (
                    <div className="studio-range-row">
                      <label>Opacidade</label>
                      <input type="range" className="studio-range" min={0.05} max={1} step={0.05} value={prvFillOpacity} onChange={e => setPrvFillOpacity(Number(e.target.value))} />
                      <span className="studio-range-value">{Math.round(prvFillOpacity*100)}%</span>
                    </div>
                  )}
                  {prvRenderMode === 'border' && (
                    <div className="studio-range-row">
                      <label>Espessura</label>
                      <input type="range" className="studio-range" min={1} max={10} step={0.5} value={prvBorderWidth} onChange={e => setPrvBorderWidth(Number(e.target.value))} />
                      <span className="studio-range-value">{prvBorderWidth}px</span>
                    </div>
                  )}
                </div>
              </>)}
            </div>
          </div>
        </div>

        <div className="studio-preview-area">
          <div className="studio-preview-toolbar">
            <span className="studio-preview-info">Resolução: <strong>{targetW}×{targetH}</strong> | Formato: <strong>{format.toUpperCase()}</strong> | Viewport: <strong>{Math.round(viewZoom*100)}%</strong></span>
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
              <button className="studio-toolbar-btn" onClick={() => setViewZoom(z => Math.min(z * 1.3, 3))} title="Zoom in">🔍+</button>
              <button className="studio-toolbar-btn" onClick={() => setViewZoom(z => Math.max(z * 0.7, 0.05))} title="Zoom out">🔍−</button>
              <button className="studio-toolbar-btn" onClick={fitToView} title="Ajustar à tela">⊞ Fit</button>
            </div>
          </div>
          <div ref={wrapperRef} className="studio-preview-wrapper"
            onWheel={handleWheel} onMouseDown={handleWrapperMouseDown}
            style={{ cursor: 'grab', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) translate(${viewPan.x}px, ${viewPan.y}px) scale(${viewZoom})`, transformOrigin: 'center center' }}>
              <div ref={previewFrameRef} className="studio-preview-frame" style={{ width: targetW, height: targetH, position: 'relative', overflow: 'hidden' }}>
                {/* Live Mapbox map */}
                <div ref={previewContainerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
                {/* Canvas overlay */}
                <canvas ref={overlayCanvasRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 10 }} />
                {/* Drag handles */}
                {(() => {
                  return (<>
                    <DragHandle id="title" pos={overlayPos.title} onMove={moveOverlay} visible={incTitle} size={{ w: OVL.TITLE_W, h: (titleCfg.titleSize||32) + (titleCfg.subtitle ? (titleCfg.subtitleSize||18) + 6 : 0) + 32 }} />
                    <DragHandle id="north" pos={overlayPos.north} onMove={moveOverlay} visible={incNorth} size={{ w: OVL.NORTH, h: OVL.NORTH }} />
                    <DragHandle id="scale" pos={overlayPos.scale} onMove={moveOverlay} visible={incScale} size={{ w: OVL.SCALE_W, h: OVL.SCALE_H }} />
                    <DragHandle id="legend" pos={overlayPos.legend} onMove={moveOverlay} visible={incLegend && legendData?.items?.length > 0} size={{ w: OVL.LEG_W, h: Math.max(30, (legendData?.items?.length||1)*OVL.LEG_W*0.1+OVL.LEG_W*0.2) }} />
                    <DragHandle id="annLegend" pos={overlayPos.annLegend} onMove={moveOverlay} visible={incAnnLegend && annData.length > 0} size={{ w: OVL.ANN_W, h: Math.max(30, annData.length*OVL.ANN_W*0.1+OVL.ANN_W*0.15) }} />
                  </>);
                })()}
              </div>
            </div>
          </div>
          {/* Page bar */}
          <div className="studio-page-bar">
            <div className="studio-pages-list">
              {exportPages.map((pg, i) => (
                <div key={i} className={`studio-page-tab ${i === currentPageIdx ? 'active' : ''}`}>
                  <button className="studio-page-tab-btn" onClick={() => i !== currentPageIdx && switchPage(i)}
                    onDoubleClick={() => {
                      const name = prompt('Nome da página:', pg.name || `Página ${i+1}`);
                      if (name !== null) setExportPages(prev => { const n=[...prev]; n[i]={...n[i],name}; return n; });
                    }}>
                    {pg.name || `Pág. ${i+1}`}
                  </button>
                  {exportPages.length > 1 && (
                    <button className="studio-page-close" onClick={(e) => { e.stopPropagation(); deletePage(i); }} title="Remover página">×</button>
                  )}
                </div>
              ))}
              <button className="studio-page-add" onClick={addPage} title="Adicionar página">＋</button>
            </div>
            <span className="studio-page-info">{currentPageIdx + 1} / {exportPages.length}</span>
          </div>
          <div className="studio-actions">
            {exporting ? (
              <div className="studio-progress"><div className="studio-progress-spinner" /><span>{progress}</span></div>
            ) : (
              <>
                {progress && <span style={{ fontSize: '0.75rem', color: '#4ade80', marginRight: 'auto' }}>{progress}</span>}
                <button className="studio-cancel-btn" onClick={() => setShowImageStudio(false)}>Fechar</button>
                <button className="studio-export-btn" onClick={handleExport}>📷 Exportar Imagem</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageExportStudio;
