import React, { useContext, useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import '../styles/NorthArrow.css';
import { MapContext } from '../contexts/MapContext';
import { UIContext } from '../contexts/UIContext';

const NorthArrow = () => {
  const { map, mapLoaded } = useContext(MapContext);
  const { showNorthArrow, setShowNorthArrow, northArrowStyle } = useContext(UIContext);
  const [bearing, setBearing] = useState(0);
  const [arrowSize, setArrowSize] = useState(90);

  useEffect(() => {
    if (!map?.current || !mapLoaded) return;
    const updateBearing = () => setBearing(map.current.getBearing());
    updateBearing();
    map.current.on('rotate', updateBearing);
    return () => {
      if (map.current) map.current.off('rotate', updateBearing);
    };
  }, [map, mapLoaded]);

  if (!mapLoaded || !showNorthArrow) return null;

  const rotation = -bearing;
  const styleType = northArrowStyle?.type || 'noun';
  const showBg = northArrowStyle?.showBg ?? true;
  const color = northArrowStyle?.color || '#1e293b';

  return (
    <Rnd
      default={{
        x: 10,
        y: 80,
        width: arrowSize,
        height: arrowSize,
      }}
      minWidth={60}
      minHeight={60}
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
        <div
          className="north-arrow-container"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundColor: showBg ? 'var(--surface-color, #ffffff)' : 'transparent',
            borderRadius: showBg ? '12px' : '0',
            border: showBg ? '1px solid var(--border-color, #e2e8f0)' : 'none',
            boxShadow: showBg ? '0 4px 16px rgba(0,0,0,0.12)' : 'none',
            padding: showBg ? '10px' : '2px',
            boxSizing: 'border-box',
          }}
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
              width: '100%',
              height: '100%',
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.15s ease-out',
              filter: showBg ? 'none' : 'drop-shadow(0px 2px 5px rgba(0,0,0,0.6))',
              overflow: 'visible',
            }}
          >
            {styleType === 'noun' && (
              <g color={color}>
                <text
                  x="100"
                  y="18"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="currentColor"
                  fontSize="22"
                  fontWeight="800"
                  fontFamily="Inter, system-ui, sans-serif"
                  letterSpacing="1"
                >
                  N
                </text>
                <circle cx="100" cy="115" r="38" fill="none" stroke="currentColor" strokeWidth="2.2" />
                <circle cx="100" cy="115" r="30" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <line x1="45" y1="115" x2="155" y2="115" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="100" y1="102" x2="100" y2="175" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="77" y1="92" x2="62" y2="77" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="123" y1="92" x2="138" y2="77" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="77" y1="138" x2="62" y2="153" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="123" y1="138" x2="138" y2="153" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <polygon points="100,46 76,115 100,102" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="miter" />
                <polygon points="100,46 124,115 100,102" fill={showBg ? '#ffffff' : 'rgba(255,255,255,0.75)'} stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
              </g>
            )}

            {styleType === 'classic' && (
              <g color={color}>
                <circle cx="100" cy="114" r="70" fill="none" stroke="currentColor" strokeWidth="2.2" />
                <circle cx="100" cy="114" r="63" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => {
                  const rad = (angle * Math.PI) / 180;
                  const isMain = angle % 90 === 0;
                  const r1 = (isMain ? 58 : 63);
                  const r2 = 70;
                  const x1 = 100 + Math.sin(rad) * r1;
                  const y1 = 114 - Math.cos(rad) * r1;
                  const x2 = 100 + Math.sin(rad) * r2;
                  const y2 = 114 - Math.cos(rad) * r2;
                  return (
                    <line
                      key={angle}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="currentColor"
                      strokeWidth={isMain ? 2.2 : 1}
                    />
                  );
                })}
                <polygon points="100,46 91,114 100,106" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                <polygon points="100,46 109,114 100,106" fill={showBg ? '#cbd5e1' : 'rgba(255,255,255,0.75)'} stroke="currentColor" strokeWidth="1" />
                <polygon points="100,182 91,114 100,122" fill={showBg ? '#94a3b8' : 'rgba(255,255,255,0.4)'} stroke="currentColor" strokeWidth="1" />
                <polygon points="100,182 109,114 100,122" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1" />
                <circle cx="100" cy="114" r="4.5" fill="currentColor" stroke="#ffffff" strokeWidth="1.2" />
                <circle cx="100" cy="16" r="13" fill="currentColor" />
                <text x="100" y="17" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="12" fontWeight="900" fontFamily="Inter, sans-serif">N</text>
              </g>
            )}

            {styleType === 'minimal' && (
              <g color={color}>
                <text x="100" y="18" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="18" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="1">N</text>
                <line x1="100" y1="46" x2="100" y2="175" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="76" y1="110" x2="124" y2="110" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <polygon points="100,46 74,115 100,100" fill="currentColor" />
                <polygon points="100,46 126,115 100,100" fill={showBg ? '#ffffff' : 'rgba(255,255,255,0.85)'} stroke="currentColor" strokeWidth="2" />
              </g>
            )}

            {styleType === 'compass' && (
              <g color={color}>
                <text x="100" y="16" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="18" fontWeight="900" fontFamily="Inter, sans-serif">N</text>
                <g opacity="0.6">
                  <polygon points="100,112 134,78 100,98" fill="currentColor" />
                  <polygon points="100,112 134,78 112,112" fill={showBg ? '#cbd5e1' : 'rgba(255,255,255,0.6)'} />
                  <polygon points="100,112 66,78 100,98" fill={showBg ? '#cbd5e1' : 'rgba(255,255,255,0.6)'} />
                  <polygon points="100,112 66,78 88,112" fill="currentColor" />
                  <polygon points="100,112 134,146 100,126" fill={showBg ? '#cbd5e1' : 'rgba(255,255,255,0.6)'} />
                  <polygon points="100,112 134,146 112,112" fill="currentColor" />
                  <polygon points="100,112 66,146 100,126" fill="currentColor" />
                  <polygon points="100,112 66,146 88,112" fill={showBg ? '#cbd5e1' : 'rgba(255,255,255,0.6)'} />
                </g>
                <polygon points="100,42 100,112 84,112" fill="currentColor" />
                <polygon points="100,42 100,112 116,112" fill={showBg ? '#ffffff' : 'rgba(255,255,255,0.85)'} stroke="currentColor" strokeWidth="1" />
                <polygon points="100,182 100,112 84,112" fill={showBg ? '#94a3b8' : 'rgba(255,255,255,0.5)'} stroke="currentColor" strokeWidth="1" />
                <polygon points="100,182 100,112 116,112" fill="currentColor" />
                <polygon points="170,112 100,112 100,96" fill="currentColor" />
                <polygon points="170,112 100,112 100,128" fill={showBg ? '#ffffff' : 'rgba(255,255,255,0.85)'} stroke="currentColor" strokeWidth="1" />
                <polygon points="30,112 100,112 100,96" fill={showBg ? '#ffffff' : 'rgba(255,255,255,0.85)'} stroke="currentColor" strokeWidth="1" />
                <polygon points="30,112 100,112 100,128" fill="currentColor" />
                <circle cx="100" cy="112" r="7" fill="currentColor" stroke="#ffffff" strokeWidth="1.8" />
              </g>
            )}
          </svg>
        </div>
      </div>
    </Rnd>
  );
};

export default NorthArrow;
