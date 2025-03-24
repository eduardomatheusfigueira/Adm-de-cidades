import React from 'react';
import '../styles/Legend.css';

const Legend = ({ colorAttribute, colorStops }) => {
  if (!colorAttribute || !colorStops || colorStops.length === 0) {
    return null;
  }

  const isScale = typeof colorStops[0] !== 'string' && colorStops[0].length === 3; // Check if colorStops is a scale

  return (
    <div className="legend">
      <div className="legend-title">Legenda: {colorAttribute}</div>
      {isScale ? (
        <div className="legend-scale">
          <div className="gradient" style={{ background: `linear-gradient(to right, ${colorStops[0][2]}, ${colorStops[1][2]})` }}></div>
          <div className="scale-labels">
            <span>{colorStops[0][0]}</span>
            <span>{colorStops[1][0]}</span>
          </div>
        </div>
      ) : (
        colorStops.map(([value, color]) => (
          <div key={value} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: color }}></span>
            <span className="legend-value">{value}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Legend;
