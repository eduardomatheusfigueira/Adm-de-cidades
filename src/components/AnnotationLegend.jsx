import React, { useContext, useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import '../styles/AnnotationLegend.css';
import { AnnotationContext } from '../contexts/AnnotationContext';
import { UIContext } from '../contexts/UIContext';

const TYPE_ICONS = { point: '📍', line: '📏', polygon: '⬡' };
const TYPE_LABELS = { point: 'Ponto', line: 'Linha', polygon: 'Polígono' };
const STYLE_OPTIONS = [
  { value: 'solid', label: 'Contínuo' },
  { value: 'dashed', label: 'Tracejado' },
  { value: 'dotted', label: 'Pontilhado' },
];

// Small SVG line sample for view mode legend
const LineSample = ({ color, width, style, type, fillColor, fillOpacity }) => {
  const w = 30;
  const h = 12;
  const strokeW = Math.min(width || 2.5, 5);
  let dashArray = 'none';
  if (style === 'dashed') dashArray = '6,3';
  else if (style === 'dotted') dashArray = '2,2';

  if (type === 'polygon') {
    // Small rectangle outline to represent polygon border, with fill opacity
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="annotation-line-sample">
        <rect x={1} y={1} width={w - 2} height={h - 2}
          fill={fillColor || '#ccc'} fillOpacity={fillOpacity ?? 0.15}
          stroke={color || '#000'} strokeWidth={strokeW} strokeDasharray={dashArray} />
      </svg>
    );
  }
  // Line
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="annotation-line-sample">
      <line x1={0} y1={h / 2} x2={w} y2={h / 2}
        stroke={color || '#000'} strokeWidth={strokeW} strokeDasharray={dashArray} strokeLinecap="round" />
    </svg>
  );
};

const AnnotationLegend = () => {
  const {
    visualizations, activeVisualizationId, getActiveAnnotations,
    updateAnnotationDescription, updateAnnotationColor, updateAnnotationColors, removeAnnotation,
    saveVisualization, loadVisualization, deleteVisualization,
    createVisualization, closeAnnotationPanel, drawingMode,
    isViewMode, setIsViewMode,
  } = useContext(AnnotationContext);

  const { showAnnotationLegend, setShowAnnotationLegend } = useContext(UIContext);

  const activeAnnotations = getActiveAnnotations();
  const activeViz = visualizations.find(v => v.id === activeVisualizationId);

  const [vizName, setVizName] = useState('');
  const [showVizSelector, setShowVizSelector] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    setVizName(activeViz?.name || '');
  }, [activeViz?.name, activeVisualizationId]);

  if (!activeVisualizationId || !showAnnotationLegend) return null;

  const handleSave = () => { saveVisualization(vizName); setIsViewMode(true); };
  const handleSelectViz = (id) => { loadVisualization(id); setShowVizSelector(false); };
  const handleNewViz = () => { createVisualization(); setShowVizSelector(false); setIsViewMode(false); };

  const handleDeleteViz = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirmDeleteId === id) {
      setConfirmDeleteId(null);
      deleteVisualization(id);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  // VIEW MODE
  if (isViewMode) {
    return (
      <Rnd
        default={{ x: 280, y: 300, width: 280, height: 'auto' }}
        minWidth={180}
        bounds="parent"
        dragHandleClassName="annotation-legend-drag-handle"
        style={{ zIndex: 5, position: 'absolute' }}
      >
        <div className="annotation-legend annotation-legend-view" style={{ position: 'relative', width: '100%', height: '100%', bottom: 'auto', right: 'auto', margin: 0 }}>
          <div className="annotation-legend-header annotation-legend-drag-handle" style={{ cursor: 'move', userSelect: 'none' }}>
            <h3 className="annotation-legend-title">{activeViz?.name || 'Informações do Mapa'}</h3>
            <div className="annotation-legend-header-actions">
              <button className="annotation-legend-edit-btn" onMouseDown={(e) => e.stopPropagation()} onClick={() => setIsViewMode(false)} title="Editar">✏️</button>
              <button className="annotation-legend-close" onMouseDown={(e) => e.stopPropagation()} onClick={() => setShowAnnotationLegend(false)} title="Ocultar painel">✕</button>
            </div>
          </div>
          <div className="annotation-legend-list">
            {activeAnnotations.map(ann => (
              <div key={ann.id} className="annotation-view-item">
                <span className="annotation-view-number" style={{ backgroundColor: ann.color || '#FFFFFF', borderColor: (ann.color === '#FFFFFF' || ann.color === '#ffffff' || !ann.color) ? '#000000' : ann.color }}>
                  {ann.number}
                </span>
                {(ann.type === 'line' || ann.type === 'polygon') && (
                  <LineSample
                    color={ann.type === 'line' ? (ann.lineColor || ann.color || '#000') : (ann.strokeColor || '#000')}
                    width={ann.type === 'line' ? (ann.lineWidth ?? 2.5) : (ann.strokeWidth ?? 2.5)}
                    style={ann.type === 'line' ? (ann.lineStyle || 'solid') : (ann.strokeStyle || 'solid')}
                    type={ann.type}
                    fillColor={ann.type === 'polygon' ? (ann.fillColor || ann.color) : undefined}
                    fillOpacity={ann.type === 'polygon' ? (ann.fillOpacity ?? 0.15) : undefined}
                  />
                )}
                <span className="annotation-view-description">{ann.description || `${TYPE_LABELS[ann.type]} ${ann.number}`}</span>
              </div>
            ))}
          </div>
        </div>
      </Rnd>
    );
  }

  // EDIT MODE
  return (
    <Rnd
      default={{ x: 280, y: 300, width: 280, height: 'auto' }}
      minWidth={180}
      bounds="parent"
      dragHandleClassName="annotation-legend-drag-handle"
      style={{ zIndex: 5, position: 'absolute' }}
    >
      <div className="annotation-legend" style={{ position: 'relative', width: '100%', height: '100%', bottom: 'auto', right: 'auto', margin: 0 }}>
        <div className="annotation-legend-header annotation-legend-drag-handle" style={{ cursor: 'move', userSelect: 'none' }}>
          <h3 className="annotation-legend-title">Informações do Mapa</h3>
          <div className="annotation-legend-header-actions">
            {activeAnnotations.length > 0 && (
              <button className="annotation-legend-view-btn" onMouseDown={(e) => e.stopPropagation()} onClick={() => setIsViewMode(true)} title="Modo visualização (limpo)">👁</button>
            )}
            <button className="annotation-legend-close" onMouseDown={(e) => e.stopPropagation()} onClick={() => setShowAnnotationLegend(false)} title="Ocultar painel">✕</button>
          </div>
        </div>

        <div className="annotation-legend-viz-name">
          <input type="text" className="viz-name-input" value={vizName} onChange={(e) => setVizName(e.target.value)} placeholder="Nome da visualização..." />
          <button className="viz-save-btn" onClick={handleSave} title="Salvar visualização">💾</button>
        </div>

        <div className="annotation-legend-viz-selector">
          <button className="viz-selector-toggle" onClick={() => setShowVizSelector(!showVizSelector)}>
            <span>Visualizações ({visualizations.length})</span>
            <span className={`viz-chevron ${showVizSelector ? 'open' : ''}`}>▾</span>
          </button>
          {showVizSelector && (
            <div className="viz-selector-dropdown">
              {visualizations.map(viz => (
                <div key={viz.id} className={`viz-selector-item ${viz.id === activeVisualizationId ? 'active' : ''}`} onClick={() => handleSelectViz(viz.id)}>
                  <span className="viz-item-name">{viz.name || 'Sem nome'}</span>
                  <button className={`viz-item-delete ${confirmDeleteId === viz.id ? 'confirming' : ''}`} onClick={(e) => handleDeleteViz(e, viz.id)} title={confirmDeleteId === viz.id ? 'Clique novamente para confirmar' : 'Excluir'}>
                    {confirmDeleteId === viz.id ? '✕?' : '🗑'}
                  </button>
                </div>
              ))}
              <button className="viz-selector-new" onClick={handleNewViz}>+ Nova visualização</button>
            </div>
          )}
        </div>

        <div className="annotation-legend-list">
          {activeAnnotations.length === 0 && (
            <p className="annotation-legend-empty">
              {drawingMode ? 'Clique no mapa para adicionar anotações...' : 'Nenhuma anotação. Use o botão "Inserir informação" para começar.'}
            </p>
          )}
          {activeAnnotations.map(ann => (
            <div key={ann.id} className="annotation-legend-item" style={{ borderLeftColor: ann.color || '#FFFFFF' === '#FFFFFF' ? '#000000' : ann.color }}>
              <div className="annotation-item-header">
                <span className="annotation-number" style={{ backgroundColor: ann.color || '#FFFFFF', color: '#000000', borderColor: (ann.color === '#FFFFFF' || ann.color === '#ffffff' || !ann.color) ? '#000000' : ann.color }}>{ann.number}</span>
                {/* Circle fill color picker (all types) */}
                <label className="annotation-color-picker" title="Cor do marcador (círculo)">
                  <input type="color" value={ann.color || '#FFFFFF'} onChange={(e) => updateAnnotationColor(ann.id, e.target.value)} className="annotation-color-input" />
                  <span className="annotation-color-swatch" style={{ backgroundColor: ann.color || '#FFFFFF', borderColor: (ann.color === '#FFFFFF' || ann.color === '#ffffff' || !ann.color) ? '#000000' : 'rgba(0,0,0,0.15)' }}></span>
                </label>
                <span className="annotation-type-icon" title={TYPE_LABELS[ann.type]}>{TYPE_ICONS[ann.type]}</span>
                <span className="annotation-type-label">{TYPE_LABELS[ann.type]}</span>
                <button className="annotation-remove-btn" onClick={() => removeAnnotation(ann.id)} title="Remover anotação">✕</button>
              </div>
              {/* Type-specific color pickers + line style */}
              {ann.type === 'line' && (
                <div className="annotation-extra-colors">
                  <label className="annotation-color-picker-row" title="Cor da linha">
                    <span className="annotation-color-label">Cor</span>
                    <input type="color" value={ann.lineColor || ann.color || '#FFFFFF'} onChange={(e) => updateAnnotationColors(ann.id, { lineColor: e.target.value })} className="annotation-color-input" />
                    <span className="annotation-color-swatch-rect" style={{ backgroundColor: ann.lineColor || ann.color || '#FFFFFF', borderColor: 'rgba(0,0,0,0.2)' }}></span>
                  </label>
                  <label className="annotation-style-control" title="Espessura da linha">
                    <span className="annotation-color-label">Espess.</span>
                    <input type="range" min="1" max="8" step="0.5" value={ann.lineWidth ?? 2.5}
                      onChange={(e) => updateAnnotationColors(ann.id, { lineWidth: parseFloat(e.target.value) })}
                      className="annotation-width-slider" />
                    <span className="annotation-width-value">{ann.lineWidth ?? 2.5}px</span>
                  </label>
                  <label className="annotation-style-control" title="Estilo da linha">
                    <span className="annotation-color-label">Estilo</span>
                    <select value={ann.lineStyle || 'solid'}
                      onChange={(e) => updateAnnotationColors(ann.id, { lineStyle: e.target.value })}
                      className="annotation-style-select">
                      {STYLE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </label>
                  <LineSample color={ann.lineColor || ann.color || '#000'} width={ann.lineWidth ?? 2.5} style={ann.lineStyle || 'solid'} type="line" />
                </div>
              )}
              {ann.type === 'polygon' && (
                <div className="annotation-extra-colors">
                  <label className="annotation-color-picker-row" title="Cor de preenchimento do polígono">
                    <span className="annotation-color-label">Preench.</span>
                    <input type="color" value={ann.fillColor || ann.color || '#FFFFFF'} onChange={(e) => updateAnnotationColors(ann.id, { fillColor: e.target.value })} className="annotation-color-input" />
                    <span className="annotation-color-swatch-rect" style={{ backgroundColor: ann.fillColor || ann.color || '#FFFFFF', borderColor: 'rgba(0,0,0,0.2)' }}></span>
                  </label>
                  <label className="annotation-style-control" title="Opacidade do preenchimento">
                    <span className="annotation-color-label">Opacid.</span>
                    <input type="range" min="0" max="1" step="0.05" value={ann.fillOpacity ?? 0.15}
                      onChange={(e) => updateAnnotationColors(ann.id, { fillOpacity: parseFloat(e.target.value) })}
                      className="annotation-width-slider" />
                    <span className="annotation-width-value">{Math.round((ann.fillOpacity ?? 0.15) * 100)}%</span>
                  </label>
                  <label className="annotation-color-picker-row" title="Cor da borda do polígono">
                    <span className="annotation-color-label">Borda</span>
                    <input type="color" value={ann.strokeColor || '#000000'} onChange={(e) => updateAnnotationColors(ann.id, { strokeColor: e.target.value })} className="annotation-color-input" />
                    <span className="annotation-color-swatch-rect" style={{ backgroundColor: ann.strokeColor || '#000000', borderColor: 'rgba(0,0,0,0.2)' }}></span>
                  </label>
                  <label className="annotation-style-control" title="Espessura da borda">
                    <span className="annotation-color-label">Espess.</span>
                    <input type="range" min="1" max="8" step="0.5" value={ann.strokeWidth ?? 2.5}
                      onChange={(e) => updateAnnotationColors(ann.id, { strokeWidth: parseFloat(e.target.value) })}
                      className="annotation-width-slider" />
                    <span className="annotation-width-value">{ann.strokeWidth ?? 2.5}px</span>
                  </label>
                  <label className="annotation-style-control" title="Estilo da borda">
                    <span className="annotation-color-label">Estilo</span>
                    <select value={ann.strokeStyle || 'solid'}
                      onChange={(e) => updateAnnotationColors(ann.id, { strokeStyle: e.target.value })}
                      className="annotation-style-select">
                      {STYLE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </label>
                  <LineSample color={ann.strokeColor || '#000'} width={ann.strokeWidth ?? 2.5} style={ann.strokeStyle || 'solid'} type="polygon" fillColor={ann.fillColor || ann.color} fillOpacity={ann.fillOpacity ?? 0.15} />
                </div>
              )}
              <input type="text" className="annotation-description-input" value={ann.description} onChange={(e) => updateAnnotationDescription(ann.id, e.target.value)} placeholder="Descreva o que este ponto significa..." />
            </div>
          ))}
        </div>
      </div>
    </Rnd>
  );
};

export default AnnotationLegend;
