import React, { useContext, useMemo, useState, useEffect, useRef, useCallback } from 'react';
import '../styles/Legend.css';
import { UIContext } from '../contexts/UIContext';
import { DataContext } from '../contexts/DataContext';
import { getColorScale, getLegendKey } from '../utils/colorUtils';

const isValidColor = (value) => /^#([0-9A-F]{3}){1,2}$/i.test(value);

// Converts any CSS color (rgb, hex, named) to #RRGGBB format
const normalizeToHex = (color) => {
  if (!color) return '#cccccc';
  if (isValidColor(color)) return color;
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = color;
    return ctx.fillStyle;
  } catch {
    return '#cccccc';
  }
};

const Legend = () => {
  const {
    colorAttribute,
    visualizationConfig,
    legendConfigByKey,
    updateLegendConfig,
    clearLegendConfig,
    showAttributeLegend,
    setShowAttributeLegend
  } = useContext(UIContext);
  const { filteredCsvData, indicadoresData } = useContext(DataContext);

  // Drag via direct DOM manipulation (no React re-renders)
  const elRef = useRef(null);
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const onDragStart = useCallback((e) => {
    if (!elRef.current) return;
    e.preventDefault();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    const rect = elRef.current.getBoundingClientRect();
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    const onMove = (ev) => {
      if (!isDraggingRef.current || !elRef.current) return;
      hasDraggedRef.current = true;
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
    };

    const onUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  const legendKey = useMemo(
    () => getLegendKey(visualizationConfig, colorAttribute),
    [visualizationConfig, colorAttribute]
  );

  const baseLegend = useMemo(() => {
    if (!legendKey) return null;

    let attribute = colorAttribute;
    let title = `Atributo: ${colorAttribute}`;

    if (visualizationConfig?.type === 'indicator') {
      attribute = 'visualization_value';
      title = `Indicador: ${visualizationConfig.indicator} (${visualizationConfig.year})`;
    } else if (visualizationConfig?.type === 'attribute' && visualizationConfig.attribute) {
      attribute = visualizationConfig.attribute;
      title = `Atributo: ${visualizationConfig.attribute}`;
    }

    if (!attribute) return null;

    let values = [];

    if (visualizationConfig?.type === 'indicator') {
      const { indicator, year, valueType } = visualizationConfig;
      values = (indicadoresData || [])
        .filter((row) => row.Nome_Indicador === indicator && row.Ano_Observacao === year)
        .map((row) => {
          const raw = valueType === 'position' ? row.Indice_Posicional : row.Valor;
          const parsed = parseFloat(raw);
          return Number.isNaN(parsed) ? null : parsed;
        })
        .filter((value) => value !== null);
    } else {
      values = (filteredCsvData || [])
        .map((row) => row[attribute])
        .filter((value) => value !== undefined && value !== null && `${value}`.trim() !== '');
    }

    const scaleExpression = getColorScale(attribute, values);
    const expressionType = scaleExpression?.[0];

    if (expressionType === 'match') {
      const items = [];
      for (let i = 2; i < scaleExpression.length - 1; i += 2) {
        items.push({ value: `${scaleExpression[i]}`, color: normalizeToHex(scaleExpression[i + 1]) });
      }
      return { title, items, type: 'categorical' };
    }

    if (expressionType === 'step') {
      const numericValues = values.map((v) => parseFloat(v)).filter((v) => !Number.isNaN(v)).sort((a, b) => a - b);
      if (!numericValues.length) return { title, items: [], type: 'dynamic' };

      const steps = [];
      const minValue = numericValues[0];
      const maxValue = numericValues[numericValues.length - 1];
      let previousThreshold = minValue;
      steps.push({ value: `${minValue.toLocaleString('pt-BR')} - ${maxValue.toLocaleString('pt-BR')}`, color: normalizeToHex(scaleExpression[2]) });

      for (let i = 3; i < scaleExpression.length; i += 2) {
        const threshold = Number(scaleExpression[i]);
        const color = scaleExpression[i + 1];
        if (Number.isNaN(threshold) || !color) continue;
        steps[steps.length - 1].value = `${previousThreshold.toLocaleString('pt-BR')} - ${threshold.toLocaleString('pt-BR')}`;
        steps.push({ value: `${threshold.toLocaleString('pt-BR')} - ${maxValue.toLocaleString('pt-BR')}`, color: normalizeToHex(color) });
        previousThreshold = threshold;
      }
      return { title, items: steps, type: 'numeric' };
    }

    return { title, items: [], type: 'dynamic' };
  }, [legendKey, colorAttribute, visualizationConfig, filteredCsvData, indicadoresData]);

  const customLegend = legendKey ? legendConfigByKey[legendKey] : null;

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftItems, setDraftItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const displayedTitle = customLegend?.title ?? baseLegend?.title ?? 'Legenda';
  const displayedItems = customLegend?.items ?? baseLegend?.items ?? [];

  useEffect(() => {
    if (!isEditing) return;
    setDraftTitle(displayedTitle);
    setDraftItems(displayedItems);
  }, [isEditing, displayedTitle, displayedItems]);

  if (!baseLegend || !showAttributeLegend) return null;

  const onChangeItem = (index, field, value) => {
    setDraftItems((prev) => { const next = [...prev]; next[index] = { ...next[index], [field]: value }; return next; });
  };
  const onAddItem = () => setDraftItems((prev) => [...prev, { value: '', color: '#cccccc' }]);
  const onRemoveItem = (index) => setDraftItems((prev) => prev.filter((_, i) => i !== index));

  const onSave = () => {
    if (!draftTitle.trim()) { setErrorMessage('O título da legenda não pode ficar vazio.'); return; }
    const hasInvalid = draftItems.some((item) => !item.value?.trim() || !isValidColor(item.color || ''));
    if (hasInvalid) { setErrorMessage('Preencha todos os itens e use cores válidas (#RRGGBB).'); return; }
    setErrorMessage('');
    updateLegendConfig(legendKey, { title: draftTitle.trim(), items: draftItems });
    setIsEditing(false);
  };

  const onCancel = () => { setErrorMessage(''); setIsEditing(false); };
  const onReset = () => { clearLegendConfig(legendKey); setErrorMessage(''); setIsEditing(false); };

  return (
    <div ref={elRef} className="legend">
      <div
        onMouseDown={isEditing ? undefined : onDragStart}
        style={{
          cursor: isEditing ? 'default' : 'move',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)',
          userSelect: 'none',
        }}
      >
        <div className="legend-title" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>{displayedTitle}</div>
        <button
          onClick={() => setShowAttributeLegend(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-light)', lineHeight: 1, padding: '2px 4px' }}
          title="Ocultar legenda"
        >✕</button>
      </div>

      {!isEditing ? (
        <>
          {displayedItems.length === 0 && (
            <p style={{ fontSize: '0.8em', color: '#555', marginTop: '5px', fontStyle: 'italic' }}>(Escala de cores dinâmica)</p>
          )}
          {displayedItems.map((item, index) => (
            <div key={`${item.value}-${index}`} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: item.color }}></span>
              <span className="legend-value">{item.value}</span>
            </div>
          ))}
          <div className="legend-actions">
            <button type="button" className="legend-action-btn" onClick={() => setIsEditing(true)}>Editar legenda</button>
            {customLegend && (
              <button type="button" className="legend-action-btn legend-reset-btn" onClick={onReset}>Restaurar padrão</button>
            )}
          </div>
        </>
      ) : (
        <div className="legend-editor">
          <label className="legend-editor-label" htmlFor="legend-title-input">Título</label>
          <input id="legend-title-input" type="text" className="legend-editor-input" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
          <div className="legend-editor-list">
            {draftItems.map((item, index) => (
              <div key={`draft-item-${index}`} className="legend-editor-row">
                <input type="color" value={isValidColor(item.color || '') ? item.color : '#cccccc'} onChange={(e) => onChangeItem(index, 'color', e.target.value)} title="Cor" />
                <input type="text" className="legend-editor-input legend-editor-value" value={item.value} placeholder="Descrição" onChange={(e) => onChangeItem(index, 'value', e.target.value)} />
                <button type="button" className="legend-action-btn legend-remove-btn" onClick={() => onRemoveItem(index)}>Remover</button>
              </div>
            ))}
          </div>
          <div className="legend-actions">
            <button type="button" className="legend-action-btn" onClick={onAddItem}>Adicionar item</button>
            <button type="button" className="legend-action-btn" onClick={onSave}>Salvar</button>
            <button type="button" className="legend-action-btn legend-cancel-btn" onClick={onCancel}>Cancelar</button>
          </div>
          {errorMessage && <p className="legend-error-message">{errorMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default Legend;
