import React, { useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import '../styles/Legend.css';
import { UIContext } from '../contexts/UIContext';
import { DataContext } from '../contexts/DataContext';
import { getColorScale, getLegendKey, isNoDataMarker, buildLegendItems, countMissing, toNumericIfPossible } from '../utils/colorUtils';

const isValidColor = (value) => /^#([0-9A-F]{3}){1,2}$/i.test(value);

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
  const { filteredCsvData, csvData, indicadoresData } = useContext(DataContext);

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
        // Valores brutos: getColorScale/buildLegendItems decidem o formato numérico da coluna inteira
        .map((row) => (valueType === 'position' ? row.Indice_Posicional : row.Valor))
        .filter((value) => !isNoDataMarker(value));
    } else {
      values = (filteredCsvData || [])
        .map((row) => row[attribute])
        .filter((value) => value !== undefined && value !== null && `${value}`.trim() !== '');
    }

    // Números lidos com o formato decidido pela coluna completa (não só os filtrados)
    if (visualizationConfig?.type !== 'indicator') {
      values = toNumericIfPossible(values, (csvData || []).map((row) => row[attribute]).filter((v) => !isNoDataMarker(v)));
    }
    const scaleExpression = getColorScale(attribute, values);
    // Indicadores sem linha para o município também são "sem dados", mas a contagem
    // aqui considera só os registros existentes do atributo/indicador.
    const missing = visualizationConfig?.type === 'indicator'
      ? 0
      : countMissing(filteredCsvData, attribute, scaleExpression?.[0] === 'step');
    const { type, items } = buildLegendItems(scaleExpression, values, missing);
    return { title, items, type };
  }, [legendKey, colorAttribute, visualizationConfig, filteredCsvData, csvData, indicadoresData]);

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
    <Rnd
      default={(() => {
        // No celular a legenda começa menor e mais alta, sem cobrir a barra de escala
        const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
        return w < 600
          ? { x: 8, y: 150, width: Math.min(220, w - 72), height: 'auto' }
          : { x: 10, y: 300, width: 250, height: 'auto' };
      })()}
      minWidth={150}
      bounds="parent"
      dragHandleClassName="legend-drag-handle"
      style={{ zIndex: 5, position: 'absolute' }}
      disableDragging={isEditing}
    >
      <div className="legend" style={{ position: 'relative', width: '100%', height: '100%', bottom: 'auto', right: 'auto', margin: 0 }}>
        <div
          className="legend-drag-handle"
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
            onMouseDown={(e) => e.stopPropagation()}
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
    </Rnd>
  );
};

export default Legend;
