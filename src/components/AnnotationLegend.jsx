import React, { useContext, useState, useEffect } from 'react';
import '../styles/AnnotationLegend.css';
import { AnnotationContext } from '../contexts/AnnotationContext';

const TYPE_ICONS = {
  point: '📍',
  line: '📏',
  polygon: '⬡',
};

const TYPE_LABELS = {
  point: 'Ponto',
  line: 'Linha',
  polygon: 'Polígono',
};

const AnnotationLegend = () => {
  const {
    visualizations,
    activeVisualizationId,
    getActiveAnnotations,
    updateAnnotationDescription,
    updateAnnotationColor,
    removeAnnotation,
    saveVisualization,
    loadVisualization,
    deleteVisualization,
    createVisualization,
    closeAnnotationPanel,
    drawingMode,
    isViewMode,
    setIsViewMode,
  } = useContext(AnnotationContext);

  const activeAnnotations = getActiveAnnotations();
  const activeViz = visualizations.find(v => v.id === activeVisualizationId);

  const [vizName, setVizName] = useState('');
  const [showVizSelector, setShowVizSelector] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Sync name when switching visualizations
  useEffect(() => {
    setVizName(activeViz?.name || '');
  }, [activeViz?.name, activeVisualizationId]);

  if (!activeVisualizationId) return null;

  const handleSave = () => {
    saveVisualization(vizName);
    setIsViewMode(true); // Switch to view mode after saving
  };

  const handleSelectViz = (id) => {
    loadVisualization(id);
    setShowVizSelector(false);
  };

  const handleNewViz = () => {
    createVisualization();
    setShowVizSelector(false);
    setIsViewMode(false); // New viz starts in edit mode
  };

  const handleDeleteViz = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirmDeleteId === id) {
      // Second click — actually delete
      setConfirmDeleteId(null);
      deleteVisualization(id);
    } else {
      // First click — ask for confirmation
      setConfirmDeleteId(id);
      // Auto-cancel after 3 seconds
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
    }
  };

  // ==================
  // VIEW MODE (clean, for screenshots)
  // ==================
  if (isViewMode) {
    return (
      <div className="annotation-legend annotation-legend-view">
        <div className="annotation-legend-header">
          <h3 className="annotation-legend-title">
            {activeViz?.name || 'Informações do Mapa'}
          </h3>
          <div className="annotation-legend-header-actions">
            <button
              className="annotation-legend-edit-btn"
              onClick={() => setIsViewMode(false)}
              title="Editar"
            >
              ✏️
            </button>
          </div>
        </div>
        <div className="annotation-legend-list">
          {activeAnnotations.map(ann => (
            <div key={ann.id} className="annotation-view-item">
              <span
                className="annotation-view-number"
                style={{ backgroundColor: ann.color || '#FFFFFF', borderColor: (ann.color === '#FFFFFF' || ann.color === '#ffffff' || !ann.color) ? '#000000' : ann.color }}
              >
                {ann.number}
              </span>
              <span className="annotation-view-description">
                {ann.description || `${TYPE_LABELS[ann.type]} ${ann.number}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==================
  // EDIT MODE (full controls)
  // ==================
  return (
    <div className="annotation-legend">
      {/* Header */}
      <div className="annotation-legend-header">
        <h3 className="annotation-legend-title">Informações do Mapa</h3>
        <div className="annotation-legend-header-actions">
          {activeAnnotations.length > 0 && (
            <button
              className="annotation-legend-view-btn"
              onClick={() => setIsViewMode(true)}
              title="Modo visualização (limpo)"
            >
              👁
            </button>
          )}
          <button
            className="annotation-legend-close"
            onClick={closeAnnotationPanel}
            title="Fechar painel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Visualization name */}
      <div className="annotation-legend-viz-name">
        <input
          type="text"
          className="viz-name-input"
          value={vizName}
          onChange={(e) => setVizName(e.target.value)}
          placeholder="Nome da visualização..."
        />
        <button className="viz-save-btn" onClick={handleSave} title="Salvar visualização">
          💾
        </button>
      </div>

      {/* Visualization selector */}
      <div className="annotation-legend-viz-selector">
        <button
          className="viz-selector-toggle"
          onClick={() => setShowVizSelector(!showVizSelector)}
        >
          <span>Visualizações ({visualizations.length})</span>
          <span className={`viz-chevron ${showVizSelector ? 'open' : ''}`}>▾</span>
        </button>

        {showVizSelector && (
          <div className="viz-selector-dropdown">
            {visualizations.map(viz => (
              <div
                key={viz.id}
                className={`viz-selector-item ${viz.id === activeVisualizationId ? 'active' : ''}`}
                onClick={() => handleSelectViz(viz.id)}
              >
                <span className="viz-item-name">
                  {viz.name || 'Sem nome'}
                </span>
                <button
                  className={`viz-item-delete ${confirmDeleteId === viz.id ? 'confirming' : ''}`}
                  onClick={(e) => handleDeleteViz(e, viz.id)}
                  title={confirmDeleteId === viz.id ? 'Clique novamente para confirmar' : 'Excluir'}
                >
                  {confirmDeleteId === viz.id ? '✕?' : '🗑'}
                </button>
              </div>
            ))}
            <button className="viz-selector-new" onClick={handleNewViz}>
              + Nova visualização
            </button>
          </div>
        )}
      </div>

      {/* Annotations list */}
      <div className="annotation-legend-list">
        {activeAnnotations.length === 0 && (
          <p className="annotation-legend-empty">
            {drawingMode
              ? 'Clique no mapa para adicionar anotações...'
              : 'Nenhuma anotação. Use o botão "Inserir informação" para começar.'}
          </p>
        )}
        {activeAnnotations.map(ann => (
          <div key={ann.id} className="annotation-legend-item" style={{ borderLeftColor: ann.color || '#FFFFFF' === '#FFFFFF' ? '#000000' : ann.color }}>
            <div className="annotation-item-header">
              <span className="annotation-number" style={{ backgroundColor: ann.color || '#FFFFFF', color: (ann.color === '#FFFFFF' || ann.color === '#ffffff' || !ann.color) ? '#000000' : '#000000', borderColor: (ann.color === '#FFFFFF' || ann.color === '#ffffff' || !ann.color) ? '#000000' : ann.color }}>{ann.number}</span>
              <label className="annotation-color-picker" title="Alterar cor">
                <input
                  type="color"
                  value={ann.color || '#FFFFFF'}
                  onChange={(e) => updateAnnotationColor(ann.id, e.target.value)}
                  className="annotation-color-input"
                />
                <span className="annotation-color-swatch" style={{ backgroundColor: ann.color || '#FFFFFF', borderColor: (ann.color === '#FFFFFF' || ann.color === '#ffffff' || !ann.color) ? '#000000' : 'rgba(0,0,0,0.15)' }}></span>
              </label>
              <span className="annotation-type-icon" title={TYPE_LABELS[ann.type]}>
                {TYPE_ICONS[ann.type]}
              </span>
              <span className="annotation-type-label">{TYPE_LABELS[ann.type]}</span>
              <button
                className="annotation-remove-btn"
                onClick={() => removeAnnotation(ann.id)}
                title="Remover anotação"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              className="annotation-description-input"
              value={ann.description}
              onChange={(e) => updateAnnotationDescription(ann.id, e.target.value)}
              placeholder="Descreva o que este ponto significa..."
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnotationLegend;
