import React, { useState, useEffect, useRef, useContext } from 'react';
import '../styles/FilterMenu.css';
import { DataContext } from '../contexts/DataContext';
import { AnnotationContext } from '../contexts/AnnotationContext';
import { MapContext } from '../contexts/MapContext';
import { UIContext } from '../contexts/UIContext';
import { generateExportHtml } from '../utils/exportMap';
import { getColorScale, getLegendKey } from '../utils/colorUtils';

const isValidColor = (value) => /^#([0-9A-F]{3}){1,2}$/i.test(value);
const normalizeToHex = (color) => {
  if (!color) return '#cccccc';
  if (isValidColor(color)) return color;
  try { const ctx = document.createElement('canvas').getContext('2d'); ctx.fillStyle = color; return ctx.fillStyle; }
  catch { return '#cccccc'; }
};

const FilterMenu = ({ onImportGeometry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDrawTools, setShowDrawTools] = useState(false);
  const menuRef = useRef(null);

  // --- Data Context ---
  const {
    handleImportIndicators,
    handleImportMunicipios,
    csvData,
    setCsvData,
    filteredCsvData,
    setFilteredCsvData,
    indicadoresData,
    setIndicadoresData,
    geojsonData,
    setGeojsonData,
    csvHeaders,
    setCsvHeaders,
  } = useContext(DataContext);

  // --- Annotation Context ---
  const {
    startDrawing,
    drawingMode,
    activeVisualizationId,
    createVisualization,
    getActiveAnnotations,
    visualizations,
    annotations,
    setAnnotations,
    setVisualizations,
    isViewMode,
    setIsViewMode,
    currentColor,
    setCurrentColor,
    setActiveVisualizationId,
  } = useContext(AnnotationContext);

  // --- Map Context ---
  const { map, mapStyle, lng, lat, zoom } = useContext(MapContext);

  // --- UI Context ---
  const {
    colorAttribute,
    setColorAttribute,
    visualizationConfig,
    setVisualizationConfig,
    legendConfigByKey,
    updateLegendConfig,
  } = useContext(UIContext);

  const activeViz = visualizations.find(v => v.id === activeVisualizationId);
  const activeAnnotations = getActiveAnnotations();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleStartAnnotation = (type) => {
    if (!activeVisualizationId) createVisualization();
    startDrawing(type);
    setIsOpen(false);
    setShowDrawTools(false);
  };

  // ============================
  // SAVE PROFILE (all state)
  // ============================
  const handleSaveProfile = async () => {
    const profileData = {
      version: 2,
      // Data
      municipios: csvData,
      csvHeaders: csvHeaders,
      indicadores: indicadoresData,
      geometrias: geojsonData,
      // UI / Visualization
      colorAttribute: colorAttribute,
      visualizationConfig: visualizationConfig,
      legendConfigByKey: legendConfigByKey,
      // Annotations
      annotations: annotations,
      visualizationsAnnot: visualizations,
    };
    const json = JSON.stringify(profileData);
    const defaultName = 'perfil_completo.json';

    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: defaultName,
          types: [{ description: 'Perfil JSON', accept: { 'application/json': ['.json'] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();
        setIsOpen(false);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }
    // Fallback
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    setIsOpen(false);
  };

  // ============================
  // LOAD PROFILE (all state)
  // ============================
  const handleLoadProfile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const profile = JSON.parse(e.target.result);

          // Data
          if (profile.municipios) {
            setCsvData(profile.municipios);
            setFilteredCsvData(profile.municipios);
            if (profile.csvHeaders) {
              setCsvHeaders(profile.csvHeaders);
            } else {
              const profileHeaders = Object.keys(profile.municipios[0] || {});
              setCsvHeaders(profileHeaders);
            }
          }
          if (profile.indicadores) {
            setIndicadoresData(profile.indicadores);
          }
          if (profile.geometrias) {
            setGeojsonData(profile.geometrias);
          }

          // UI / Visualization (version 2+)
          if (profile.version >= 2) {
            if (profile.colorAttribute) {
              setColorAttribute(profile.colorAttribute);
            }
            if (profile.visualizationConfig !== undefined) {
              setVisualizationConfig(profile.visualizationConfig);
            }
            if (profile.legendConfigByKey) {
              // Restore all legend configs
              Object.entries(profile.legendConfigByKey).forEach(([key, config]) => {
                updateLegendConfig(key, config);
              });
            }
            // Annotations — REPLACE entirely (deduplicate by id)
            if (profile.annotations) {
              const uniqueAnns = [...new Map(profile.annotations.map(a => [a.id, a])).values()];
              setAnnotations(uniqueAnns);
            } else {
              setAnnotations([]);
            }
            if (profile.visualizationsAnnot) {
              const uniqueViz = [...new Map(profile.visualizationsAnnot.map(v => [v.id, v])).values()];
              setVisualizations(uniqueViz);
              if (uniqueViz.length > 0) {
                setActiveVisualizationId(uniqueViz[0].id);
              }
            } else {
              setVisualizations([]);
            }
          }

          alert('Perfil carregado com sucesso!');
        } catch (error) {
          console.error('[FilterMenu] Erro ao carregar o perfil:', error);
          alert('Erro ao carregar o arquivo de perfil.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // ============================
  // BUILD COLOR LEGEND FOR EXPORT
  // ============================
  const buildColorLegend = () => {
    const legendKey = getLegendKey(visualizationConfig, colorAttribute);
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
        .filter(row => row.Nome_Indicador === indicator && row.Ano_Observacao === year)
        .map(row => { const p = parseFloat(valueType === 'position' ? row.Indice_Posicional : row.Valor); return Number.isNaN(p) ? null : p; })
        .filter(v => v !== null);
    } else {
      values = (filteredCsvData || []).map(row => row[attribute]).filter(v => v !== undefined && v !== null && `${v}`.trim() !== '');
    }

    const scaleExpression = getColorScale(attribute, values);
    const expressionType = scaleExpression?.[0];
    const customLegend = legendKey ? legendConfigByKey[legendKey] : null;
    let items = [];

    if (expressionType === 'match') {
      for (let i = 2; i < scaleExpression.length - 1; i += 2) {
        items.push({ value: `${scaleExpression[i]}`, color: normalizeToHex(scaleExpression[i + 1]) });
      }
    } else if (expressionType === 'step') {
      const numericValues = values.map(v => parseFloat(v)).filter(v => !Number.isNaN(v)).sort((a, b) => a - b);
      if (numericValues.length) {
        const minVal = numericValues[0], maxVal = numericValues[numericValues.length - 1];
        let prev = minVal;
        items.push({ value: `${minVal.toLocaleString('pt-BR')} - ${maxVal.toLocaleString('pt-BR')}`, color: normalizeToHex(scaleExpression[2]) });
        for (let i = 3; i < scaleExpression.length; i += 2) {
          const th = Number(scaleExpression[i]), col = scaleExpression[i + 1];
          if (Number.isNaN(th) || !col) continue;
          items[items.length - 1].value = `${prev.toLocaleString('pt-BR')} - ${th.toLocaleString('pt-BR')}`;
          items.push({ value: `${th.toLocaleString('pt-BR')} - ${maxVal.toLocaleString('pt-BR')}`, color: normalizeToHex(col) });
          prev = th;
        }
      }
    }

    if (customLegend && customLegend.items && customLegend.items.length > 0) {
      title = customLegend.title || title;
      items = customLegend.items;
    }
    return { title, items };
  };

  // ============================
  // EXPORT MAP HTML
  // ============================
  const handleExport = async () => {
    const mapInstance = map.current;
    let center = [lng, lat];
    let currentZoom = zoom;
    if (mapInstance) {
      const c = mapInstance.getCenter();
      center = [c.lng, c.lat];
      currentZoom = mapInstance.getZoom();
    }

    let munGeoJson = null;
    let colorExpr = null;
    if (mapInstance && mapInstance.getSource('sectors')) {
      const srcData = mapInstance.getSource('sectors')._data;
      if (srcData && srcData.features && srcData.features.length > 0) munGeoJson = srcData;
      if (mapInstance.getLayer('sectors-fill-layer')) colorExpr = mapInstance.getPaintProperty('sectors-fill-layer', 'fill-color');
    }

    const html = generateExportHtml({
      annotations: activeAnnotations,
      vizName: activeViz?.name || 'Mapa de Informações',
      mapCenter: center,
      mapZoom: currentZoom,
      mapBearing: mapInstance ? mapInstance.getBearing() : 0,
      mapStyle,
      mapboxToken: 'pk.eyJ1IjoiZWR1YXJkb21hdGhldXNmaWd1ZWlyYSIsImEiOiJjbTgwd2tqbzYwemRrMmpwdGVka2FrMG5nIn0.NfOWy2a0J-YHP4mdKs_TAQ',
      municipalityGeoJson: munGeoJson,
      municipalityColorExpression: colorExpr,
      colorLegend: buildColorLegend(),
      renderMode: visualizationConfig?.renderMode || 'filled',
      fillOpacity: visualizationConfig?.fillOpacity ?? 0.6,
      borderWidth: visualizationConfig?.borderWidth || 2,
    });

    const safeName = (activeViz?.name || 'mapa').replace(/[^a-zA-Z0-9_ -]/g, '_');
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: safeName + '.html',
          types: [{ description: 'Arquivo HTML', accept: { 'text/html': ['.html'] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(html);
        await writable.close();
        setIsOpen(false);
        return;
      } catch (err) { if (err.name === 'AbortError') return; }
    }
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = safeName + '.html';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    setIsOpen(false);
  };

  // ============================
  // RENDER
  // ============================
  return (
    <div className="filter-menu top-right" ref={menuRef}>
      <button className="filter-menu-toggle-icon" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Ocultar Menu' : 'Mostrar Menu'}>
        <i className="menu-icon"></i>
      </button>

      <div className={`filter-menu-content ${isOpen ? 'open' : ''}`}>
        <div className="filter-section">
          <h3>Dados</h3>
          <div className="filter-actions import-export-buttons">
            <button className="control-button import-button" onClick={handleImportIndicators}>Importar Indicadores</button>
            <button className="control-button import-button" onClick={handleImportMunicipios}>Importar Municípios</button>
            <button className="control-button import-geometry-button" onClick={onImportGeometry}>Importar Geometria</button>
          </div>
        </div>

        <div className="filter-section">
          <h3>Informações do Mapa</h3>
          <div className="filter-actions import-export-buttons">
            <div className="draw-tools-group">
              <button
                className={`control-button annotation-button ${showDrawTools ? 'active' : ''}`}
                onClick={() => setShowDrawTools(!showDrawTools)}
              >
                ✏️ Inserir Informação
              </button>
              {showDrawTools && (
                <div className="draw-tool-options">
                  <div className="draw-color-row">
                    <label className="draw-color-label">
                      Cor:
                      <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} className="draw-color-input" />
                    </label>
                  </div>
                  <button className="draw-tool-btn" onClick={() => handleStartAnnotation('point')}>📍 Ponto</button>
                  <button className="draw-tool-btn" onClick={() => handleStartAnnotation('line')}>📏 Linha</button>
                  <button className="draw-tool-btn" onClick={() => handleStartAnnotation('polygon')}>⬡ Polígono</button>
                </div>
              )}
            </div>
            <button className="control-button export-map-button" onClick={handleExport}>📤 Exportar Mapa HTML</button>
          </div>
        </div>

        <div className="filter-section">
          <h3>Perfil</h3>
          <div className="filter-actions import-export-buttons">
            <button className="control-button save-profile-button" onClick={handleSaveProfile}>💾 Salvar Perfil</button>
            <button className="control-button load-profile-button" onClick={handleLoadProfile}>📂 Carregar Perfil</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;
