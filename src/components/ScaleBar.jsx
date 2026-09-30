import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import '../styles/ScaleBar.css';
import { pickScaleDistance } from '../utils/scale';
import { MapContext } from '../contexts/MapContext';
import { UIContext } from '../contexts/UIContext';



const formatDistance = (meters, short = false) => {
  if (meters >= 1000) {
    const km = meters / 1000;
    const str = km % 1 === 0 ? `${km}` : `${km.toFixed(1)}`;
    return short ? str : `${str} km`;
  }
  return short ? `${meters}` : `${meters} m`;
};

const ScaleBar = () => {
  const { map, mapLoaded } = useContext(MapContext);
  const { showScaleBar, setShowScaleBar } = useContext(UIContext);
  const [scaleInfo, setScaleInfo] = useState({ width: 150, totalDistance: 100, unit: 'm' });

  // Drag via direct DOM
  const elRef = useRef(null);
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Pointer Events: o mesmo código arrasta com mouse, dedo ou caneta
  const onDragStart = useCallback((e) => {
    if (!elRef.current || e.button > 0) return;
    if (e.target.closest('button')) return;
    e.preventDefault();
    isDraggingRef.current = true;
    const rect = elRef.current.getBoundingClientRect();
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    const onMove = (ev) => {
      if (!isDraggingRef.current || !elRef.current) return;
      const parent = elRef.current.parentElement;
      if (!parent) return;
      const pr = parent.getBoundingClientRect();
      let x = ev.clientX - pr.left - offsetRef.current.x;
      let y = ev.clientY - pr.top - offsetRef.current.y;
      const w = elRef.current.offsetWidth;
      const h = elRef.current.offsetHeight;
      x = Math.max(0, Math.min(x, pr.width - w));
      y = Math.max(0, Math.min(y, pr.height - h));
      elRef.current.style.left = x + 'px';
      elRef.current.style.top = y + 'px';
      elRef.current.style.bottom = 'auto';
      elRef.current.style.right = 'auto';
      elRef.current.style.transform = 'none';
    };

    const onUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }, []);

  // Calculate scale from map state
  useEffect(() => {
    if (!map?.current || !mapLoaded) return;

    const updateScale = () => {
      const m = map.current;
      const center = m.getCenter();
      const zoom = m.getZoom();

      // Barra com o comprimento exato da distância representada (sem forçar largura mínima/máxima,
      // o que distorcia a escala); no celular a barra é menor para caber na tela.
      const containerW = m.getContainer()?.clientWidth || 1024;
      const maxBarPx = Math.min(300, Math.max(120, containerW * 0.5));
      const { meters: bestStep, barPx } = pickScaleDistance(maxBarPx, zoom, center.lat);
      const clampedWidth = Math.round(barPx);
      const unit = bestStep >= 1000 ? 'km' : 'm';

      setScaleInfo({
        width: clampedWidth,
        totalDistance: bestStep,
        unit,
      });
    };

    updateScale();
    map.current.on('zoom', updateScale);
    map.current.on('move', updateScale);

    const mapRef = map.current;
    return () => {
      if (mapRef) {
        mapRef.off('zoom', updateScale);
        mapRef.off('move', updateScale);
      }
    };
  }, [map, mapLoaded]);

  if (!mapLoaded || !showScaleBar) return null;

  // Build segment data
  // Menos divisões em barras curtas (celular), para os rótulos não se sobreporem
  const NUM_SEGMENTS = scaleInfo.width < 170 ? 2 : scaleInfo.width < 240 ? 4 : 5;
  const segmentWidth = scaleInfo.width / NUM_SEGMENTS;
  const distPerSegment = scaleInfo.totalDistance / NUM_SEGMENTS;

  // Labels at each division: 0, seg, 2*seg, ... totalDistance + unit
  const labels = [];
  for (let i = 0; i <= NUM_SEGMENTS; i++) {
    const dist = distPerSegment * i;
    const displayDist = scaleInfo.unit === 'km' ? dist / 1000 : dist;
    // Last label includes the unit
    const text = i === NUM_SEGMENTS
      ? `${Number.isInteger(displayDist) ? displayDist : displayDist.toFixed(1)} ${scaleInfo.unit}`
      : `${Number.isInteger(displayDist) ? displayDist : displayDist.toFixed(1)}`;
    labels.push(text);
  }

  return (
    <div
      ref={elRef}
      className="scale-bar-container"
      onPointerDown={onDragStart}
      style={{ cursor: 'move', touchAction: 'none' }}
    >
      <button
        className="scale-bar-close"
        onClick={(e) => { e.stopPropagation(); setShowScaleBar(false); }}
        title="Ocultar escala"
      >
        ✕
      </button>

      {/* Labels row */}
      <div className="scale-bar-labels" style={{ width: scaleInfo.width + 'px' }}>
        {labels.map((label, i) => (
          <span
            key={i}
            className="scale-bar-tick-label"
            style={{
              left: `${(i / NUM_SEGMENTS) * 100}%`,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Alternating segments bar */}
      <div className="scale-bar-segments" style={{ width: scaleInfo.width + 'px' }}>
        {Array.from({ length: NUM_SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className={`scale-bar-segment ${i % 2 === 0 ? 'filled' : 'empty'}`}
            style={{ width: segmentWidth + 'px' }}
          />
        ))}
      </div>

      {/* Projection */}
      <div className="scale-bar-footer">
        <span className="scale-bar-projection">Projeção: Web Mercator (EPSG:3857)</span>
      </div>
    </div>
  );
};

export default ScaleBar;
