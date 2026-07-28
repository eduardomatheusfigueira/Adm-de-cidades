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
            padding: showBg ? '6px' : '0',
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
                  y="24"
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
                <circle cx="100" cy="115" r="42" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="100" cy="115" r="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="42" y1="115" x2="158" y2="115" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="100" y1="102" x2="100" y2="178" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="74" y1="89" x2="60" y2="75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="126" y1="89" x2="140" y2="75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="74" y1="141" x2="60" y2="155" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="126" y1="141" x2="140" y2="155" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <polygon points="100,38 74,115 100,102" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="miter" />
                <polygon points="100,38 126,115 100,102" fill={showBg ? '#ffffff' : 'rgba(255,255,255,0.7)'} stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
              </g>
            )}

            {styleType === 'classic' && (
              <g color={color}>
                <circle cx="100" cy="108" r="80" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="100" cy="108" r="72" fill="none" stroke="currentColor" strokeWidth="1.2" />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => {
                  const rad = (angle * Math.PI) / 180;
                  const isMain = angle % 90 === 0;
                  const r1 = isMain ? 68 : 72;
                  const r2 = 80;
                  const x1 = 100 + Math.sin(rad) * r1;
                  const y1 = 108 - Math.cos(rad) * r1;
                  const x2 = 100 + Math.sin(rad) * r2;
                  const y2 = 108 - Math.cos(rad) * r2;
                  return (
                    <line
                      key={angle}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="currentColor"
                      strokeWidth={isMain ? 2.5 : 1}
                    />
                  );
                })}
                <polygon points="100,34 90,108 100,100" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                <polygon points="100,34 110,108 100,100" fill={showBg ? '#cbd5e1' : 'rgba(255,255,255,0.7)'} stroke="currentColor" strokeWidth="1" />
                <polygon points="100,182 90,108 100,116" fill={showBg ? '#94a3b8' : 'rgba(255,255,255,0.4)'} stroke="currentColor" strokeWidth="1" />
                <polygon points="100,182 110,108 100,116" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1" />
                <circle cx="100" cy="108" r="5" fill="currentColor" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="100" cy="18" r="14" fill="currentColor" />
                <text x="100" y="19" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="Inter, sans-serif">N</text>
              </g>
            )}

            {styleType === 'minimal' && (
              <g color={color}>
                <text x="100" y="20" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="18" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="1">N</text>
                <line x1="100" y1="32" x2="100" y2="175" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="75" y1="100" x2="125" y2="100" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <polygon points="100,32 72,110 100,94" fill="currentColor" />
                <polygon points="100,32 128,110 100,94" fill={showBg ? '#ffffff' : 'rgba(255,255,255,0.8)'} stroke="currentColor" strokeWidth="2" />
              </g>
            )}

            {styleType === 'compass' && (
              <g color={color}>
                <text x="100" y="16" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="18" fontWeight="900" fontFamily="Inter, sans-serif">N</text>
                <g opacity="0.6">
                  <polygon points="100,105 138,67 100,90" fill="currentColor" />
                  <polygon points="100,105 138,67 115,105" fill={showBg ? '#cbd5e1' : 'rgba(255,255,255,0.6)'} />
                  <polygon points="100,105 62,67 100,90" fill={showBg ? '#cbd5e1' : 'rgba(255,255,255,0.6)'} />
                  <polygon points="100,105 62,67 85,105" fill="currentColor" />
                  <polygon points="100,105 138,143 100,120" fill={showBg ? '#cbd5e1' : 'rgba(255,255,255,0.6)'} />
                  <polygon points="100,105 138,143 115,105" fill="currentColor" />
                  <polygon points="100,105 62,143 100,120" fill="currentColor" />
                  <polygon points="100,105 62,143 85,105" fill={showBg ? '#cbd5e1' : 'rgba(255,255,255,0.6)'} />
                </g>
                <polygon points="100,28 100,105 82,105" fill="currentColor" />
                <polygon points="100,28 100,105 118,105" fill={showBg ? '#ffffff' : 'rgba(255,255,255,0.85)'} stroke="currentColor" strokeWidth="1" />
                <polygon points="100,182 100,105 82,105" fill={showBg ? '#94a3b8' : 'rgba(255,255,255,0.5)'} stroke="currentColor" strokeWidth="1" />
                <polygon points="100,182 100,105 118,105" fill="currentColor" />
                <polygon points="177,105 100,105 100,87" fill="currentColor" />
                <polygon points="177,105 100,105 100,123" fill={showBg ? '#ffffff' : 'rgba(255,255,255,0.85)'} stroke="currentColor" strokeWidth="1" />
                <polygon points="23,105 100,105 100,87" fill={showBg ? '#ffffff' : 'rgba(255,255,255,0.85)'} stroke="currentColor" strokeWidth="1" />
                <polygon points="23,105 100,105 100,123" fill="currentColor" />
                <circle cx="100" cy="105" r="8" fill="currentColor" stroke="#ffffff" strokeWidth="2" />
              </g>
            )}
          </svg>
        </div>
      </div>
    </Rnd>
  );
};

export default NorthArrow;
