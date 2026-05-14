import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import '../styles/ScaleBar.css';
import { MapContext } from '../contexts/MapContext';
import { UIContext } from '../contexts/UIContext';

// Nice round numbers for scale labels
const SCALE_STEPS = [
  1, 2, 5, 10, 20, 50, 100, 200, 500,
  1000, 2000, 5000, 10000, 20000, 50000,
  100000, 200000, 500000, 1000000,
  2000000, 5000000, 10000000, 20000000
];

const NUM_SEGMENTS = 5;

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

      // Mapbox GL JS uses 512px tiles; the correct constant is 40075016.686 / 512 = 78271.5168
      const metersPerPixel = 78271.5168 * Math.cos(center.lat * Math.PI / 180) / Math.pow(2, zoom);

      // Target total bar width: 200-300 pixels (wide enough to avoid label overlap)
      const targetMinPx = 200;
      const targetMaxPx = 300;

      let bestStep = SCALE_STEPS[0];
      for (let i = 0; i < SCALE_STEPS.length; i++) {
        const step = SCALE_STEPS[i];
        const px = step / metersPerPixel;
        if (px >= targetMinPx && px <= targetMaxPx) {
          bestStep = step;
          break;
        }
        if (px > targetMaxPx) {
          // Prefer this wider step over the previous too-narrow one
          bestStep = step;
          break;
        }
        bestStep = step;
      }

      const barWidth = Math.round(bestStep / metersPerPixel);
      const clampedWidth = Math.max(180, Math.min(400, barWidth));
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
      onMouseDown={onDragStart}
      style={{ cursor: 'move' }}
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
