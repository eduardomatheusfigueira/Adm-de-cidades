import React, { useContext } from 'react';
import '../styles/AnnotationToolbar.css';
import { AnnotationContext } from '../contexts/AnnotationContext';
import { getLineLengthMeters, getPolygonAreaSqMeters, formatDistance, formatArea } from '../utils/geoUtils';

const TOOLS = [
  { type: 'point', icon: '📍', label: 'Ponto' },
  { type: 'line', icon: '✏️', label: 'Linha Livre' },
  { type: 'polygon', icon: '⬡', label: 'Polígono Livre' },
  { type: 'measure_line', icon: '📐', label: 'Medir Distância' },
  { type: 'measure_polygon', icon: '📐', label: 'Medir Área' },
];

const AnnotationToolbar = () => {
  const {
    drawingMode,
    isDrawing,
    cancelDrawing,
    tempCoordinates,
    cursorPosition,
    currentColor,
    setCurrentColor,
    isViewMode,
  } = useContext(AnnotationContext);

  if (!drawingMode || isViewMode) return null;

  const activeTool = TOOLS.find(t => t.type === drawingMode);

  // Compute live measurement during drawing
  const isPolyType = drawingMode === 'polygon' || drawingMode === 'measure_polygon';
  const liveCoords = cursorPosition ? [...tempCoordinates, [cursorPosition.lng, cursorPosition.lat]] : tempCoordinates;
  const liveDistance = isDrawing ? formatDistance(getLineLengthMeters(liveCoords)) : '';
  const liveArea = isDrawing && isPolyType && liveCoords.length >= 3 ? formatArea(getPolygonAreaSqMeters(liveCoords)) : '';
  const livePerimeter = isDrawing && isPolyType && liveCoords.length >= 3 ? formatDistance(getLineLengthMeters([...liveCoords, liveCoords[0]])) : '';

  return (
    <div className="annotation-toolbar">
      <div className="annotation-toolbar-status">
        <label className="status-color-picker" title="Alterar cor">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="color-picker-input"
          />
          <span className="status-color-swatch" style={{ backgroundColor: currentColor }}></span>
        </label>
        <span className="status-icon">{activeTool?.icon}</span>
        <span className="status-text">
          {drawingMode === 'point' && 'Clique no mapa para inserir ponto'}
          {drawingMode === 'line' && (
            isDrawing
              ? `Desenhando linha (${tempCoordinates.length} vértices) — duplo-clique para finalizar`
              : 'Clique no mapa para iniciar a linha'
          )}
          {drawingMode === 'polygon' && (
            isDrawing
              ? `Desenhando polígono (${tempCoordinates.length} vértices) — duplo-clique para fechar`
              : 'Clique no mapa para iniciar o polígono'
          )}
          {drawingMode === 'measure_line' && (
            isDrawing
              ? `Medindo distância (${tempCoordinates.length} vértices) — Comprimento: ${liveDistance} — duplo-clique para finalizar`
              : 'Clique no mapa para iniciar a medição de distância'
          )}
          {drawingMode === 'measure_polygon' && (
            isDrawing
              ? `Medindo área (${tempCoordinates.length} vértices) ${liveArea ? `— Área: ${liveArea} (Perímetro: ${livePerimeter})` : `— Comprimento: ${liveDistance}`} — duplo-clique para fechar`
              : 'Clique no mapa para iniciar a medição de área'
          )}
        </span>
        <button
          className="status-cancel-btn"
          onClick={cancelDrawing}
          title="Cancelar desenho"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AnnotationToolbar;
