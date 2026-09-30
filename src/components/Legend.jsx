import React, { useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import '../styles/Legend.css';
import { UIContext } from '../contexts/UIContext';
import { DataContext } from '../contexts/DataContext';
import { Pencil, X } from 'lucide-react';
import { getColorScale, getLegendKey, isNoDataMarker, buildLegendItems, countMissing, toNumericIfPossible, scaleOptionsFromConfig, rotuloAtributo } from '../utils/colorUtils';

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
    let title = rotuloAtributo(colorAttribute);

    if (visualizationConfig?.type === 'indicator') {
      attribute = 'visualization_value';
      title = `${visualizationConfig.indicator} (${visualizationConfig.year})${visualizationConfig.valueType === 'position' ? ' · índice posicional' : ''}`;
    } else if (visualizationConfig?.type === 'attribute' && visualizationConfig.attribute) {
      attribute = visualizationConfig.attribute;
      title = rotuloAtributo(visualizationConfig.attribute);
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
    const { classes, scheme } = scaleOptionsFromConfig(visualizationConfig);
    const scaleExpression = getColorScale(attribute, values, classes, scheme);
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
        // Ao lado do painel lateral no desktop; no celular, no canto superior esquerdo
        const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
        return w <= 768
          ? { x: 8, y: 8, width: Math.min(210, w - 80), height: 'auto' }
          : { x: 372, y: 16, width: 230, height: 'auto' };
      })()}
      minWidth={150}
      bounds="parent"
      dragHandleClassName="legend-drag-handle"
      style={{ zIndex: 5, position: 'absolute' }}
      disableDragging={isEditing}
    >
      <section className="legend" aria-label="Legenda do mapa">
        <div className={`legend-drag-handle ${isEditing ? '' : 'arrastavel'}`}>
          <div className="legend-title">{displayedTitle}</div>
          <div className="legend-header-actions">
            {!isEditing && (
              <button
                type="button"
                className="legend-icon-btn"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={() => setIsEditing(true)}
                aria-label="Editar legenda"
                title="Editar legenda"
              >
                <Pencil size={15} strokeWidth={1.75} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              className="legend-icon-btn"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={() => setShowAttributeLegend(false)}
              aria-label="Ocultar legenda"
              title="Ocultar legenda"
            >
              <X size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>

        {!isEditing ? (
          <>
            {displayedItems.length === 0 && (
              <p className="legend-vazia">Escala de cores dinâmica</p>
            )}
            <ul className="legend-list">
              {displayedItems.map((item, index) => (
                <li key={`${item.value}-${index}`} className="legend-item">
                  <span className={`legend-color ${item.noData ? 'legend-color-sem-dados' : ''}`} style={{ backgroundColor: item.color }}></span>
                  <span className="legend-value">{item.value}</span>
                </li>
              ))}
            </ul>
            {customLegend && (
              <div className="legend-actions">
                <span className="legend-custom-note">Legenda editada</span>
                <button type="button" className="legend-action-btn" onClick={onReset}>Restaurar padrão</button>
              </div>
            )}
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
      </section>
    </Rnd>
  );
};

export default Legend;
