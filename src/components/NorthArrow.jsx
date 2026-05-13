import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import '../styles/NorthArrow.css';
import { MapContext } from '../contexts/MapContext';
import { UIContext } from '../contexts/UIContext';

const NorthArrow = () => {
  const { map, mapLoaded } = useContext(MapContext);
  const { showNorthArrow, setShowNorthArrow } = useContext(UIContext);
  const [bearing, setBearing] = useState(0);
  const [arrowSize, setArrowSize] = useState(80);

  // Listen to map rotation to update bearing
  useEffect(() => {
    if (!map?.current || !mapLoaded) return;

    const updateBearing = () => {
      setBearing(map.current.getBearing());
    };

    // Set initial bearing
    updateBearing();

    map.current.on('rotate', updateBearing);
    return () => {
      if (map.current) {
        map.current.off('rotate', updateBearing);
      }
    };
  }, [map, mapLoaded]);

  if (!mapLoaded || !showNorthArrow) return null;

  // The SVG arrow rotates opposite to the map bearing
  const rotation = -bearing;

  return (
    <Rnd
      default={{
        x: 10,
        y: 80,
        width: arrowSize,
        height: arrowSize,
      }}
      minWidth={50}
      minHeight={50}
      lockAspectRatio={true}
      bounds="parent"
      enableResizing={{
        bottomRight: true,
        topLeft: true,
        topRight: true,
        bottomLeft: true,
      }}
      style={{ zIndex: 10 }}
      onResizeStop={(e, direction, ref) => {
        setArrowSize(parseInt(ref.style.width));
      }}
    >
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {/* "N" badge — orbits around the compass following north */}
        {(() => {
          const angleRad = (rotation * Math.PI) / 180;
          // Orbit center is 50%,50% of container; radius is 55% of half-width to sit just outside the circle
          const offsetX = Math.sin(angleRad) * 55;
          const offsetY = -Math.cos(angleRad) * 55;
          return (
            <div
              className="north-arrow-n-badge"
              style={{
                top: `calc(50% + ${offsetY}% - 13px)`,
                left: `calc(50% + ${offsetX}% - 13px)`,
              }}
            >
              N
            </div>
          );
        })()}

        {/* Compass circle with its own tight background */}
        <div
          className="north-arrow-container"
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          <button
            className="north-arrow-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowNorthArrow(false);
            }}
            title="Ocultar indicador de norte"
          >
            ✕
          </button>
          <svg
            viewBox="0 0 200 200"
            style={{
              width: '90%',
              height: '90%',
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            {/* Outer circle */}
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="var(--text-primary)"
              strokeWidth="4"
            />

            {/* Tick marks at cardinal directions */}
            {/* N */}
            <line x1="100" y1="12" x2="100" y2="24" stroke="var(--text-primary)" strokeWidth="3" />
            {/* E */}
            <line x1="176" y1="100" x2="188" y2="100" stroke="var(--text-primary)" strokeWidth="2" />
            {/* S */}
            <line x1="100" y1="176" x2="100" y2="188" stroke="var(--text-primary)" strokeWidth="2" />
            {/* W */}
            <line x1="12" y1="100" x2="24" y2="100" stroke="var(--text-primary)" strokeWidth="2" />

            {/* Inner crosshair circle */}
            <circle
              cx="100"
              cy="100"
              r="6"
              fill="var(--text-primary)"
            />

            {/* North arrow — dark/filled half (left) */}
            <polygon
              points="100,22 88,100 100,90"
              fill="var(--text-primary)"
              stroke="var(--text-primary)"
              strokeWidth="1"
            />

            {/* North arrow — light/outline half (right) */}
            <polygon
              points="100,22 112,100 100,90"
              fill="none"
              stroke="var(--text-primary)"
              strokeWidth="2"
            />

            {/* South arrow — light half (left) */}
            <polygon
              points="100,178 88,100 100,110"
              fill="none"
              stroke="var(--text-primary)"
              strokeWidth="1.5"
              opacity="0.4"
            />

            {/* South arrow — light half (right) */}
            <polygon
              points="100,178 112,100 100,110"
              fill="none"
              stroke="var(--text-primary)"
              strokeWidth="1.5"
              opacity="0.4"
            />
          </svg>
        </div>
      </div>
    </Rnd>
  );
};

export default NorthArrow;
