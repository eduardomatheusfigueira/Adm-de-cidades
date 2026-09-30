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
    finishDrawing,
    undoLastVertex,
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
  // cursorPosition é gravado como [lng, lat] (MapContext); aceitar também {lng, lat}
  const cursor = Array.isArray(cursorPosition) ? cursorPosition : (cursorPosition ? [cursorPosition.lng, cursorPosition.lat] : null);
  const liveCoords = cursor ? [...tempCoordinates, cursor] : tempCoordinates;
  const minVertices = isPolyType ? 3 : 2;
  const canFinish = drawingMode !== 'point' && tempCoordinates.length >= minVertices;
  const finishHint = isPolyType ? 'toque no 1º ponto ou em Concluir para fechar' : 'toque no último ponto ou em Concluir para terminar';
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
          {drawingMode === 'point' && 'Toque/clique no mapa para inserir pontos'}
          {drawingMode === 'line' && (
            isDrawing ? `Linha: ${tempCoordinates.length} ponto(s) — ${finishHint}` : 'Toque/clique no mapa para começar a linha'
          )}
          {drawingMode === 'polygon' && (
            isDrawing ? `Polígono: ${tempCoordinates.length} ponto(s) — ${finishHint}` : 'Toque/clique no mapa para começar o polígono'
          )}
          {drawingMode === 'measure_line' && (
            isDrawing ? `Distância: ${liveDistance} (${tempCoordinates.length} ponto(s)) — ${finishHint}` : 'Toque/clique no mapa para começar a medir a distância'
          )}
          {drawingMode === 'measure_polygon' && (
            isDrawing
              ? `${liveArea ? `Área: ${liveArea} · Perímetro: ${livePerimeter}` : `Comprimento: ${liveDistance}`} (${tempCoordinates.length} ponto(s)) — ${finishHint}`
              : 'Toque/clique no mapa para começar a medir a área'
          )}
        </span>
      </div>
      <div className="annotation-toolbar-actions">
        {drawingMode !== 'point' && (
          <>
            <button type="button" className="draw-action-btn primary" onClick={finishDrawing} disabled={!canFinish}
              title={canFinish ? 'Concluir o desenho' : `Marque pelo menos ${minVertices} pontos`}>
              ✓ Concluir
            </button>
            <button type="button" className="draw-action-btn" onClick={undoLastVertex} disabled={tempCoordinates.length === 0} title="Remover o último ponto">
              ↶ Desfazer ponto
            </button>
          </>
        )}
        <button type="button" className="draw-action-btn" onClick={cancelDrawing} title="Sair do modo de desenho">
          ✕ {drawingMode === 'point' ? 'Terminar' : 'Cancelar'}
        </button>
      </div>
    </div>
  );
};

export default AnnotationToolbar;
