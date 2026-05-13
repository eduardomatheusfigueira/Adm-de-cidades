import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import '../styles/ScaleBar.css';
import { MapContext } from '../contexts/MapContext';
import { UIContext } from '../contexts/UIContext';

// Nice round numbers for scale labels
const SCALE_STEPS = [
  1, 2, 5, 10, 20, 50, 100, 200, 500,
  1000, 2000, 5000, 10000, 20000, 50000,
  100000, 200000, 500000, 1000000
];

const formatDistance = (meters) => {
  if (meters >= 1000) {
    const km = meters / 1000;
    return km % 1 === 0 ? `${km} km` : `${km.toFixed(1)} km`;
  }
  return `${meters} m`;
};

const ScaleBar = () => {
  const { map, mapLoaded } = useContext(MapContext);
  const { showScaleBar, setShowScaleBar } = useContext(UIContext);
  const [scaleInfo, setScaleInfo] = useState({ width: 100, label: '100 m' });

  // Drag via direct DOM
  const elRef = useRef(null);
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const onDragStart = useCallback((e) => {
    if (!elRef.current) return;
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
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  // Calculate scale from map state
  useEffect(() => {
    if (!map?.current || !mapLoaded) return;

    const updateScale = () => {
      const m = map.current;
      const center = m.getCenter();
      const zoom = m.getZoom();

      // Calculate meters per pixel at current zoom and latitude
      // Formula: metersPerPixel = 156543.03392 * cos(lat * PI / 180) / (2 ^ zoom)
      const metersPerPixel = 156543.03392 * Math.cos(center.lat * Math.PI / 180) / Math.pow(2, zoom);

      // Target bar width: 80-150 pixels
      const targetMinPx = 60;
      const targetMaxPx = 150;

      // Find the best round number that fits in our pixel range
      let bestStep = SCALE_STEPS[0];
      for (const step of SCALE_STEPS) {
        const px = step / metersPerPixel;
        if (px >= targetMinPx && px <= targetMaxPx) {
          bestStep = step;
          break;
        }
        if (px > targetMaxPx) break;
        bestStep = step;
      }

      const barWidth = Math.round(bestStep / metersPerPixel);
      const clampedWidth = Math.max(40, Math.min(200, barWidth));

      setScaleInfo({
        width: clampedWidth,
        label: formatDistance(bestStep),
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

  return (
    <div
      ref={elRef}
      className="scale-bar-container"
      onMouseDown={onDragStart}
      style={{ cursor: 'move' }}
    >
      <div className="scale-bar-header">
        <span className="scale-bar-label">{scaleInfo.label}</span>
        <button
          className="scale-bar-close"
          onClick={(e) => { e.stopPropagation(); setShowScaleBar(false); }}
          title="Ocultar escala"
        >
          ✕
        </button>
      </div>
      <div className="scale-bar-graphic">
        <div className="scale-bar-line" style={{ width: scaleInfo.width + 'px' }}></div>
      </div>
      <div className="scale-bar-projection">Projeção: Web Mercator (EPSG:3857)</div>
    </div>
  );
};

export default ScaleBar;
