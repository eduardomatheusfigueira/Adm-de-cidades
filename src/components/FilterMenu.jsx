import React, { useState, useEffect, useRef, useContext } from 'react';
import '../styles/FilterMenu.css';
import { DataContext } from '../contexts/DataContext';
import { AnnotationContext } from '../contexts/AnnotationContext';
import { MapContext } from '../contexts/MapContext';
import { UIContext } from '../contexts/UIContext';
import { generateExportHtml } from '../utils/exportMap';
import { getColorScale, getLegendKey, isNoDataMarker, buildLegendItems, countMissing, toNumericIfPossible } from '../utils/colorUtils';
import { getGeoJSONSourceData, resolveBasemapStyle } from '../utils/basemaps';
import { useProjectState } from '../hooks/useProjectState';

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

  const { buildProfile, applyProfile } = useProjectState();

  // --- Map Context ---
  const { map, mapStyle, lng, lat, zoom } = useContext(MapContext);

  const {
    colorAttribute,
    setColorAttribute,
    visualizationConfig,
    setVisualizationConfig,
    legendConfigByKey,
    updateLegendConfig,
    exportPages,
    setExportPages,
    showMeasurements,
    setShowMeasurements,
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
    // startDrawing já cria uma visualização quando não há nenhuma ativa
    // (criar aqui também gerava uma visualização vazia duplicada).
    startDrawing(type);
    setIsOpen(false);
    setShowDrawTools(false);
  };

  // ============================
  // SAVE PROFILE (all state)
  // ============================
  const handleSaveProfile = async () => {
    const profileData = buildProfile();
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
          applyProfile(profile);

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
        .map(row => (valueType === 'position' ? row.Indice_Posicional : row.Valor))
        .filter(v => !isNoDataMarker(v));
    } else {
      values = (filteredCsvData || []).map(row => row[attribute]).filter(v => v !== undefined && v !== null && `${v}`.trim() !== '');
    }

    if (visualizationConfig?.type !== 'indicator') {
      values = toNumericIfPossible(values, (csvData || []).map(row => row[attribute]).filter(v => !isNoDataMarker(v)));
    }
    const scaleExpression = getColorScale(attribute, values);
    const expressionType = scaleExpression?.[0];
    const customLegend = legendKey ? legendConfigByKey[legendKey] : null;
    let items = [];

    const missing = visualizationConfig?.type === 'indicator' ? 0 : countMissing(filteredCsvData, attribute, expressionType === 'step');
    items = buildLegendItems(scaleExpression, values, missing).items;

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
      const srcData = getGeoJSONSourceData(mapInstance.getSource('sectors'));
      if (srcData && srcData.features && srcData.features.length > 0) munGeoJson = srcData;
      if (mapInstance.getLayer('sectors-fill-layer')) colorExpr = mapInstance.getPaintProperty('sectors-fill-layer', 'fill-color');
    }

    const html = generateExportHtml({
      annotations: activeAnnotations,
      vizName: activeViz?.name || 'Mapa de Informações',
      mapCenter: center,
      mapZoom: currentZoom,
      mapBearing: mapInstance ? mapInstance.getBearing() : 0,
      mapStyle: resolveBasemapStyle(mapStyle),
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
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4, marginBottom: 2 }}>Formas</div>
                  <button className="draw-tool-btn" onClick={() => handleStartAnnotation('point')}>📍 Ponto</button>
                  <button className="draw-tool-btn" onClick={() => handleStartAnnotation('line')}>✏️ Linha Livre</button>
                  <button className="draw-tool-btn" onClick={() => handleStartAnnotation('polygon')}>⬡ Polígono Livre</button>
                  
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 8, marginBottom: 2 }}>Medição</div>
                  <button className="draw-tool-btn" onClick={() => handleStartAnnotation('measure_line')}>📐 Medir Distância</button>
                  <button className="draw-tool-btn" onClick={() => handleStartAnnotation('measure_polygon')}>📐 Medir Área Poligonal</button>

                  <div style={{ borderTop: '1px solid #334155', marginTop: 8, paddingTop: 6 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#cbd5e1', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={showMeasurements}
                        onChange={(e) => setShowMeasurements(e.target.checked)}
                      />
                      <span>Exibir Medidas no Mapa</span>
                    </label>
                  </div>
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
