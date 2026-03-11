import React, { useContext, useMemo, useState, useEffect } from 'react';
import '../styles/Legend.css';
import { UIContext } from '../contexts/UIContext';
import { DataContext } from '../contexts/DataContext';
import { getColorScale, getLegendKey } from '../utils/colorUtils';

const isValidColor = (value) => /^#([0-9A-F]{3}){1,2}$/i.test(value);

const Legend = () => {
  const {
    colorAttribute,
    visualizationConfig,
    legendConfigByKey,
    updateLegendConfig,
    clearLegendConfig
  } = useContext(UIContext);
  const { filteredCsvData, indicadoresData } = useContext(DataContext);

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
        .filter(
          (row) => row.Nome_Indicador === indicator && row.Ano_Observacao === year
        )
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
        items.push({ value: `${scaleExpression[i]}`, color: scaleExpression[i + 1] });
      }
      return {
        title,
        items,
        type: 'categorical',
      };
    }

    if (expressionType === 'step') {
      const numericValues = values
        .map((value) => parseFloat(value))
        .filter((value) => !Number.isNaN(value))
        .sort((a, b) => a - b);

      if (!numericValues.length) {
        return {
          title,
          items: [],
          type: 'dynamic',
        };
      }

      const steps = [];
      const minValue = numericValues[0];
      const maxValue = numericValues[numericValues.length - 1];
      let previousThreshold = minValue;
      let firstColor = scaleExpression[2];
      steps.push({
        value: `${minValue.toLocaleString('pt-BR')} - ${maxValue.toLocaleString('pt-BR')}`,
        color: firstColor
      });

      for (let i = 3; i < scaleExpression.length; i += 2) {
        const threshold = Number(scaleExpression[i]);
        const color = scaleExpression[i + 1];
        if (Number.isNaN(threshold) || !color) continue;

        steps[steps.length - 1].value = `${previousThreshold.toLocaleString('pt-BR')} - ${threshold.toLocaleString('pt-BR')}`;
        steps.push({
          value: `${threshold.toLocaleString('pt-BR')} - ${maxValue.toLocaleString('pt-BR')}`,
          color
        });
        previousThreshold = threshold;
      }

      return {
        title,
        items: steps,
        type: 'numeric',
      };
    }

    return {
      title,
      items: [],
      type: 'dynamic',
    };
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

  if (!baseLegend) {
    return null;
  }

  const onChangeItem = (index, field, value) => {
    setDraftItems((previous) => {
      const next = [...previous];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const onAddItem = () => {
    setDraftItems((previous) => [...previous, { value: '', color: '#cccccc' }]);
  };

  const onRemoveItem = (index) => {
    setDraftItems((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  const onSave = () => {
    if (!draftTitle.trim()) {
      setErrorMessage('O título da legenda não pode ficar vazio.');
      return;
    }

    const hasInvalidItem = draftItems.some((item) => !item.value?.trim() || !isValidColor(item.color || ''));
    if (hasInvalidItem) {
      setErrorMessage('Preencha todos os itens e use cores válidas no formato hexadecimal (#RRGGBB).');
      return;
    }

    setErrorMessage('');
    updateLegendConfig(legendKey, {
      title: draftTitle.trim(),
      items: draftItems,
    });
    setIsEditing(false);
  };

  const onCancel = () => {
    setErrorMessage('');
    setIsEditing(false);
  };

  const onReset = () => {
    clearLegendConfig(legendKey);
    setErrorMessage('');
    setIsEditing(false);
  };

  return (
    <div className="legend">
      {!isEditing ? (
        <>
          <div className="legend-title">{displayedTitle}</div>
          {displayedItems.length === 0 && (
            <p style={{ fontSize: '0.8em', color: '#555', marginTop: '5px', fontStyle: 'italic' }}>
              (Escala de cores dinâmica)
            </p>
          )}
          {displayedItems.map((item, index) => (
            <div key={`${item.value}-${index}`} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: item.color }}></span>
              <span className="legend-value">{item.value}</span>
            </div>
          ))}
          <div className="legend-actions">
            <button type="button" className="legend-action-btn" onClick={() => setIsEditing(true)}>
              Editar legenda
            </button>
            {customLegend && (
              <button type="button" className="legend-action-btn legend-reset-btn" onClick={onReset}>
                Restaurar padrão
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="legend-editor">
          <label className="legend-editor-label" htmlFor="legend-title-input">Título</label>
          <input
            id="legend-title-input"
            type="text"
            className="legend-editor-input"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
          />

          <div className="legend-editor-list">
            {draftItems.map((item, index) => (
              <div key={`draft-item-${index}`} className="legend-editor-row">
                <input
                  type="color"
                  value={isValidColor(item.color || '') ? item.color : '#cccccc'}
                  onChange={(event) => onChangeItem(index, 'color', event.target.value)}
                  title="Cor"
                />
                <input
                  type="text"
                  className="legend-editor-input legend-editor-value"
                  value={item.value}
                  placeholder="Descrição"
                  onChange={(event) => onChangeItem(index, 'value', event.target.value)}
                />
                <button
                  type="button"
                  className="legend-action-btn legend-remove-btn"
                  onClick={() => onRemoveItem(index)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className="legend-actions">
            <button type="button" className="legend-action-btn" onClick={onAddItem}>
              Adicionar item
            </button>
            <button type="button" className="legend-action-btn" onClick={onSave}>
              Salvar
            </button>
            <button type="button" className="legend-action-btn legend-cancel-btn" onClick={onCancel}>
              Cancelar
            </button>
          </div>

          {errorMessage && <p className="legend-error-message">{errorMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default Legend;
