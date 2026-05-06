import React, { useContext } from 'react';
import '../styles/AnnotationToolbar.css';
import { AnnotationContext } from '../contexts/AnnotationContext';

const TOOLS = [
  { type: 'point', icon: '📍', label: 'Ponto' },
  { type: 'line', icon: '📏', label: 'Linha' },
  { type: 'polygon', icon: '⬡', label: 'Polígono' },
];

const AnnotationToolbar = () => {
  const {
    drawingMode,
    isDrawing,
    cancelDrawing,
    tempCoordinates,
    currentColor,
    setCurrentColor,
    isViewMode,
  } = useContext(AnnotationContext);

  // Only show when actively drawing — the main button is now in FilterMenu
  if (!drawingMode || isViewMode) return null;

  const activeTool = TOOLS.find(t => t.type === drawingMode);

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
