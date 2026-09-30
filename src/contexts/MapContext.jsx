import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { DataContext } from './DataContext';
import { UIContext } from './UIContext';
import { AnnotationContext } from './AnnotationContext';
import { getColorScale, getLegendKey, withNoDataColor, noDataHatchFilter, applyCustomLegendColors, makeVizValueGetter, makeNumberParser } from '../utils/colorUtils';
import { HATCH_ID, HATCH_LAYER, ensureHatchPattern } from '../utils/hatch';
import { SYMBOL_COLOR, NEUTRAL_FILL, symbolRadiusExpression } from '../utils/proportional';
import { getAnnotationMeasurement, getLineSegmentDetails } from '../utils/geoUtils';
import { DEFAULT_BASEMAP, FALLBACK_BASEMAP, BASEMAPS, FONT_BOLD, getFontStack, isLocalBasemap, normalizeBasemap, resolveBasemapStyle, isStyleReady } from '../utils/basemaps';

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-54.57);
  const [lat, setLat] = useState(-25.53);
  const [zoom, setZoom] = useState(12);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  // mapStyle é gerenciado localmente aqui, mas pode ser movido para UIContext se necessário globalmente
  const [mapStyle, setMapStyle] = useState(DEFAULT_BASEMAP);
  // Aviso exibido sobre o mapa (ex.: mapa base remoto indisponível e troca automática para o fundo liso)
  const [mapNotice, setMapNotice] = useState(null);
  // Incrementa a cada 'style.load'. Um estilo local carrega tão rápido que mapLoaded
  // false→true cai no mesmo render do React; este contador garante que as camadas do app
  // (municípios, anotações, gratícula) sejam recriadas após toda troca de mapa base.
  const [styleVersion, setStyleVersion] = useState(0);

  const { geojsonData, indicadoresData, filteredCsvData, csvData } = useContext(DataContext);
  // Consumindo diretamente do UIContext, sem valores padrão aqui
  const { colorAttribute, visualizationConfig, activeEnvironment, selectedCityInfo, setSelectedCityInfo, legendConfigByKey, showGraticule, graticuleStyle, showMeasurements } = useContext(UIContext);

  // Annotation context
  const {
    drawingMode,
    isDrawing,
    tempCoordinates,
    cursorPosition,
    handleMapClick: annotationHandleMapClick,
    handleMapDoubleClick: annotationHandleDoubleClick,
    finishDrawing: annotationFinishDrawing,
    setCursorPosition,
    getActiveAnnotations,
    activeVisualizationId,
    annotations: allAnnotations,
  } = useContext(AnnotationContext);

  const currentStyleUrl = useRef(mapStyle);
  const sectorHandlersBoundRef = useRef(false);
  const lastFittedDataRef = useRef({ csv: null, geo: null });
  const drawingModeRef = useRef(drawingMode);
  const styleLoadedRef = useRef(false);
  const styleWatchdogRef = useRef(null);

  // Se um mapa base remoto não carregar (sem internet, rede da escola bloqueando o servidor),
  // troca para um fundo 100% local em vez de deixar o spinner girando para sempre.
  const fallbackToLocalStyle = useCallback(() => {
    clearTimeout(styleWatchdogRef.current);
    if (isLocalBasemap(currentStyleUrl.current)) return;
    const failed = BASEMAPS.find(b => b.id === normalizeBasemap(currentStyleUrl.current));
    setMapNotice(`Não foi possível carregar o mapa base "${failed ? failed.label : 'personalizado'}" (sem internet ou bloqueado pela rede). Usando o fundo liso.`);
    setMapStyle(FALLBACK_BASEMAP);
  }, []);

  const armStyleWatchdog = useCallback((styleValue) => {
    styleLoadedRef.current = false;
    clearTimeout(styleWatchdogRef.current);
    if (isLocalBasemap(styleValue)) return;
    styleWatchdogRef.current = setTimeout(() => {
      if (!styleLoadedRef.current) fallbackToLocalStyle();
    }, 12000);
  }, [fallbackToLocalStyle]);

  useEffect(() => () => clearTimeout(styleWatchdogRef.current), []);

  useEffect(() => {
    // Initialize map if container is present and map doesn't exist
    if (mapContainer.current && !map.current) {
      console.log("[MapContext] Initializing MapLibre map...");
      setIsMapLoading(true);
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: resolveBasemapStyle(mapStyle),
        center: [lng, lat],
        zoom: zoom,
        // Necessário para exportação de imagens (canvas.toDataURL)
        canvasContextAttributes: { preserveDrawingBuffer: true },
        attributionControl: { compact: true },
      });
      currentStyleUrl.current = mapStyle; // Sync ref
      armStyleWatchdog(mapStyle);

      map.current.on('move', () => {
        setLng(map.current.getCenter().lng);
        setLat(map.current.getCenter().lat);
        setZoom(map.current.getZoom());
      });
      map.current.on('style.load', () => {
        console.log("[MapContext] Map style loaded.");
        styleLoadedRef.current = true;
        setStyleVersion(v => v + 1);
        clearTimeout(styleWatchdogRef.current);
        setMapLoaded(true);
        setIsMapLoading(false);
      });
      map.current.on('error', (e) => {
        console.warn('[MapContext] Erro no mapa:', e?.error?.message || e);
        // Erro antes do estilo carregar = o mapa base não pôde ser obtido.
        if (!styleLoadedRef.current) fallbackToLocalStyle();
      });
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // --- Annotation drawing: click handler ---
      map.current.on('click', (e) => {
        // This is handled via a ref-based check in the annotation effect
      });
      map.current.on('dblclick', (e) => {
        // This is handled via a ref-based check in the annotation effect
      });
      map.current.on('mousemove', (e) => {
        // This is handled via a ref-based check in the annotation effect
      });
    }

    return () => {
      // Only remove map if component unmounts completely (e.g. app reload)
      // We no longer remove it just because activeEnvironment changed
      if (map.current && !mapContainer.current) {
        // This check is a bit tricky since mapContainer.current might still exist in memory.
        // Better to rely on the fact that we want persistence.
        // If we really need to cleanup, we might need a separate 'destroy' flag or just let it be.
        // For now, let's NOT destroy it here to allow persistence.
      }
    };
  }, [lng, lat, zoom]); // Removed activeEnvironment from dependency to avoid re-run

  useEffect(() => {
    // Resize map when it becomes visible
    if (activeEnvironment === 'map' && map.current) {
      // Small delay to ensure DOM has updated style to display: block
      setTimeout(() => {
        map.current.resize();
      }, 100);
    }
  }, [activeEnvironment]);

  useEffect(() => {
    // Only update style if it changed and map is ready
    if (map.current && mapStyle !== currentStyleUrl.current) {
      console.log(`[MapContext] Changing map style to: ${mapStyle}`);
      setMapLoaded(false);
      currentStyleUrl.current = mapStyle;
      armStyleWatchdog(mapStyle);
      // diff: false força a recarga completa e o evento 'style.load', que recria as camadas do app
      map.current.setStyle(resolveBasemapStyle(mapStyle), { diff: false });
    }
  }, [mapStyle]);


  const loadMapData = useCallback(() => {
    console.log("[MapContext] loadMapData called", { filteredCsvDataLength: filteredCsvData?.length, colorAttribute, visualizationConfig });

    if (!map.current || !mapLoaded || !isStyleReady(map.current)) {
      console.log("[MapContext] Map not ready for data loading (style not loaded).");
      return;
    }
    const currentMapData = filteredCsvData;
    if (!currentMapData || currentMapData.length === 0) {
      if (map.current.getSource('sectors')) {
        map.current.getSource('sectors').setData({ type: 'FeatureCollection', features: [] });
      }
      console.warn("[MapContext] No filteredCsvData to display.");
      return;
    }

    let currentAttributeForColoring = colorAttribute;
    if (visualizationConfig) {
      if (visualizationConfig.type === 'indicator') currentAttributeForColoring = 'visualization_value';
      else if (visualizationConfig.type === 'attribute') currentAttributeForColoring = visualizationConfig.attribute;
    }

    const csvDataMap = new Map(currentMapData.map(city => [String(city.Codigo_Municipio), city]));

    // Formato numérico (vírgula ou ponto decimal) decidido pela coluna inteira do indicador
    const indicatorRows = visualizationConfig?.type === 'indicator'
      ? (indicadoresData || []).filter(r => r.Nome_Indicador === visualizationConfig.indicator && r.Ano_Observacao === visualizationConfig.year)
      : [];
    const toNullable = (parse) => (v) => { const n = parse(v); return Number.isNaN(n) ? null : n; };
    const parseIndicatorValue = toNullable(makeNumberParser(indicatorRows.map(r => r.Valor)));
    const parseIndicatorPosition = toNullable(makeNumberParser(indicatorRows.map(r => r.Indice_Posicional)));
    const finalFeatures = [];
    const polygonCodes = new Set();

    console.log(`[MapContext] Processing ${currentMapData.length} cities from CSV.`);

    // Helper to parse coordinates robustly (handles comma and dot)
    const parseCoord = (val) => {
      if (!val) return NaN;
      if (typeof val === 'number') return val;
      return parseFloat(val.replace(',', '.'));
    };

    const bounds = new maplibregl.LngLatBounds();
    const pontosEnquadramento = [];
    let hasValidBounds = false;

    if (geojsonData && geojsonData.features) {
      geojsonData.features.forEach(feature => {
        if (!feature.properties || feature.properties.CD_MUN === undefined) return;
        const cdMun = String(feature.properties.CD_MUN);
        const cityData = csvDataMap.get(cdMun);
        if (cityData) {
          const lon = parseCoord(cityData.Longitude_Municipio);
          const lat = parseCoord(cityData.Latitude_Municipio);

          const properties = {
            ...feature.properties, ...cityData, CD_MUN: cdMun, NAME: cityData.Nome_Municipio,
            LEVEL: 'Municípios', AREA: parseFloat(cityData.Area_Municipio),
            CAPITAL: String(cityData.Capital).trim().toLowerCase() === 'true', ESTADO: cityData.Sigla_Estado,
            ALTITUDE: parseFloat(cityData.Altitude_Municipio), LONGITUDE: lon, LATITUDE: lat,
            REGIAO: cityData.Sigla_Regiao,
            custom_description: `Dados CSV: ${cityData.Nome_Municipio}, Estado: ${cityData.Sigla_Estado}`
          };

          if (visualizationConfig && visualizationConfig.type === 'indicator' && indicadoresData) {
            const { year, indicator, valueType } = visualizationConfig;
            const cityIndicator = indicadoresData.find(ind =>
              String(ind.Codigo_Municipio) === cdMun && ind.Ano_Observacao === year && ind.Nome_Indicador === indicator);
            if (cityIndicator) {
              properties.indicator_value = parseIndicatorValue(cityIndicator.Valor);
              properties.indicator_position = parseIndicatorPosition(cityIndicator.Indice_Posicional);
              properties.indicator_name = indicator; properties.indicator_year = year;
              properties.visualization_value = valueType === 'value' ? properties.indicator_value : properties.indicator_position;
            } else properties.visualization_value = null;
          } else if (currentAttributeForColoring !== 'visualization_value') delete properties.visualization_value;

          finalFeatures.push({ ...feature, properties });
          polygonCodes.add(cdMun);
          // csvDataMap.delete(cdMun); // Keep to generate point
        }
      });
    }

    let pointsGenerated = 0;
    csvDataMap.forEach(cityData => {
      const lon = parseCoord(cityData.Longitude_Municipio);
      const lat = parseCoord(cityData.Latitude_Municipio);

      if (isNaN(lon) || isNaN(lat) || lon === 0 || lat === 0) {
        // console.warn(`[MapContext] Invalid coordinates for ${cityData.Nome_Municipio}`);
        return;
      }

      pontosEnquadramento.push([lon, lat]);
      hasValidBounds = true;
      // Municípios com polígono não ganham um ponto por cima (poluía o mapa temático);
      // o ponto só aparece para quem não tem limite carregado
      if (polygonCodes.has(String(cityData.Codigo_Municipio))) return;

      const properties = {
        CD_MUN: String(cityData.Codigo_Municipio), NAME: cityData.Nome_Municipio, LEVEL: 'Municípios',
        AREA: parseFloat(cityData.Area_Municipio), CAPITAL: String(cityData.Capital).trim().toLowerCase() === 'true',
        ESTADO: cityData.Sigla_Estado, ALTITUDE: parseFloat(cityData.Altitude_Municipio),
        LONGITUDE: lon, LATITUDE: lat, REGIAO: cityData.Sigla_Regiao, ...cityData,
        custom_description: `Dados CSV: ${cityData.Nome_Municipio}, Estado: ${cityData.Sigla_Estado}`
      };

      if (visualizationConfig && visualizationConfig.type === 'indicator' && indicadoresData) {
        const { year, indicator, valueType } = visualizationConfig;
        const cityIndicator = indicadoresData.find(ind =>
          String(ind.Codigo_Municipio) === properties.CD_MUN && ind.Ano_Observacao === year && ind.Nome_Indicador === indicator);
        if (cityIndicator) {
          properties.indicator_value = parseIndicatorValue(cityIndicator.Valor);
          properties.indicator_position = parseIndicatorPosition(cityIndicator.Indice_Posicional);
          properties.indicator_name = indicator; properties.indicator_year = year;
          properties.visualization_value = valueType === 'value' ? properties.indicator_value : properties.indicator_position;
        } else properties.visualization_value = null;
      }
      finalFeatures.push({ type: 'Feature', properties, geometry: { type: 'Point', coordinates: [lon, lat] } });
      pointsGenerated++;
    });

    console.log(`[MapContext] Generated ${finalFeatures.length} features (${pointsGenerated} points).`);

    // Fit bounds if we have valid data and it's the first load or explicit update
    // Reenquadrar só quando o conjunto de municípios/geometrias muda — não ao trocar cores,
    // opacidade ou mapa base (o aluno perderia o enquadramento que escolheu).
    const dataChanged = lastFittedDataRef.current.csv !== currentMapData || lastFittedDataRef.current.geo !== geojsonData;
    if (hasValidBounds) {
      // Enquadra pela massa dos municípios: ilhas muito afastadas (ex.: Fernando de Noronha em PE)
      // ficam fora do cálculo para não empurrar o estado para um canto da tela.
      const quartis = (vals) => { const v = [...vals].sort((a, b) => a - b); const q = (p) => v[Math.floor(p * (v.length - 1))]; return [q(0.25), q(0.75)]; };
      let pontos = pontosEnquadramento;
      if (pontos.length >= 20) {
        const [lo1, lo3] = quartis(pontos.map(p => p[0]));
        const [la1, la3] = quartis(pontos.map(p => p[1]));
        const folgaLo = 3 * Math.max(lo3 - lo1, 0.5);
        const folgaLa = 3 * Math.max(la3 - la1, 0.5);
        const dentro = pontos.filter(([lo, la]) => lo >= lo1 - folgaLo && lo <= lo3 + folgaLo && la >= la1 - folgaLa && la <= la3 + folgaLa);
        if (dentro.length >= pontos.length * 0.9) pontos = dentro;
      }
      pontos.forEach(p => bounds.extend(p));
    }
    if (hasValidBounds && map.current && dataChanged) {
      // Garante que o canvas tem o tamanho atual do contêiner (o mapa pode ter sido criado escondido)
      map.current.resize();
      // Folga para o que flutua sobre o mapa: painel lateral (se aberto), botões e legenda
      const largura = map.current.getContainer().clientWidth;
      const painelAberto = !!document.querySelector('.painel-mapa.aberto');
      const padding = largura > 768
        ? { top: 90, bottom: 60, left: painelAberto ? 400 : 60, right: 90 }
        : { top: 60, bottom: 90, left: 24, right: 24 };
      map.current.fitBounds(bounds, { padding, maxZoom: 14 });
      lastFittedDataRef.current = { csv: currentMapData, geo: geojsonData };
    }

    const combinedGeoJson = { type: 'FeatureCollection', features: finalFeatures };
    // Valor exibido: número lido no formato da coluna inteira ("590,3" → 590.3, "22.516" → 22516)
    // ou, com normalização, atributo ÷ referência × fator; o que não é número vira null = "Sem dados"
    const symbology = visualizationConfig?.symbology;
    const allRows = currentAttributeForColoring === 'visualization_value' ? finalFeatures.map(f => f.properties) : (csvData || []);
    const vizGetter = makeVizValueGetter(allRows, currentAttributeForColoring, symbology);
    const colorProp = vizGetter.normalized ? '__viz_value' : currentAttributeForColoring;
    if (vizGetter.numeric) finalFeatures.forEach(f => { f.properties[colorProp] = vizGetter.get(f.properties); });
    const attributeValues = finalFeatures.map(f => f.properties[colorProp]).filter(v => v !== undefined && v !== null);
    const baseScaleExpression = getColorScale(colorProp, attributeValues, symbology);
    let colorRenderScaleExpression = baseScaleExpression;

    const legendKey = getLegendKey(visualizationConfig, colorAttribute);
    const customLegend = legendKey ? legendConfigByKey[legendKey] : null;

    colorRenderScaleExpression = applyCustomLegendColors(baseScaleExpression, customLegend);

    colorRenderScaleExpression = withNoDataColor(colorProp, colorRenderScaleExpression);

    if (map.current.getSource('sectors')) {
      map.current.getSource('sectors').setData(combinedGeoJson);
    } else {
      map.current.addSource('sectors', { type: 'geojson', data: combinedGeoJson });
      map.current.addLayer({
        id: 'sectors-fill-layer', type: 'fill', source: 'sectors',
        filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
        paint: { 'fill-color': colorRenderScaleExpression, 'fill-opacity': 0.85, 'fill-outline-color': 'rgba(255, 255, 255, 0.85)' }
      });
      map.current.addLayer({
        id: 'sectors-line-layer', type: 'line', source: 'sectors',
        filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
        paint: {
          'line-color': colorRenderScaleExpression,
          'line-width': 0,
          'line-opacity': 0,
          'line-offset': 0
        }
      });
      map.current.addLayer({
        id: 'sectors-point-layer', type: 'circle', source: 'sectors',
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          'circle-radius': 6,
          'circle-color': colorRenderScaleExpression,
          'circle-opacity': 0.9,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff'
        }
      });
      // Município selecionado: contorno Terracota 600 com halo branco (o mesmo gesto da célula do logotipo)
      map.current.addLayer({
        id: 'sectors-selected-halo', type: 'line', source: 'sectors',
        filter: ['==', ['get', 'CD_MUN'], '__nenhum__'],
        paint: { 'line-color': '#FFFFFF', 'line-width': 6, 'line-opacity': 0.95 }
      });
      map.current.addLayer({
        id: 'sectors-selected-line', type: 'line', source: 'sectors',
        filter: ['==', ['get', 'CD_MUN'], '__nenhum__'],
        paint: { 'line-color': '#BD5223', 'line-width': 3 }
      });

      // Os listeners por camada sobrevivem à troca de mapa base; registrar só uma vez
      if (!sectorHandlersBoundRef.current) {
      sectorHandlersBoundRef.current = true;
      const layers = ['sectors-fill-layer', 'sectors-point-layer', 'sectors-line-layer'];
      layers.forEach(layerId => {
        map.current.on('mouseenter', layerId, () => { map.current.getCanvas().style.cursor = 'pointer'; });
        map.current.on('mouseleave', layerId, () => { map.current.getCanvas().style.cursor = ''; });
        map.current.on('click', layerId, (e) => {
          // Durante o desenho, o toque/clique adiciona vértices — não abrir o painel da cidade
          if (drawingModeRef.current) return;
          e.preventDefault();
          const features = map.current.queryRenderedFeatures(e.point, { layers: [layerId] });
          if (!features.length) return;
          const feature = features[0];
          if (setSelectedCityInfo) {
            setSelectedCityInfo(feature);
          }
        });
      });
      }
    }

    // Rótulos com o nome dos municípios (ligados no menu de Visualização)
    if (!map.current.getLayer('sectors-label-layer')) {
      map.current.addLayer({
        id: 'sectors-label-layer', type: 'symbol', source: 'sectors',
        layout: {
          'text-field': ['coalesce', ['get', 'NAME'], ['get', 'Nome_Municipio'], ''],
          'text-font': [FONT_BOLD],
          'text-size': ['interpolate', ['linear'], ['zoom'], 5, 9, 9, 12, 12, 14],
          'text-max-width': 8,
          'text-padding': 2,
          'symbol-sort-key': ['*', -1, ['coalesce', ['to-number', ['get', 'AREA']], 0]],
          visibility: visualizationConfig?.labels ? 'visible' : 'none',
        },
        paint: { 'text-color': '#1A1814', 'text-halo-color': 'rgba(255,255,255,0.9)', 'text-halo-width': 1.4 },
      });
    } else {
      map.current.setLayoutProperty('sectors-label-layer', 'visibility', visualizationConfig?.labels ? 'visible' : 'none');
    }

    // Hachura "Sem dados" (guia de identidade) sobre os municípios sem valor numérico
    ensureHatchPattern(map.current);
    const polyOnly = ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']];
    const hatchFilter = ['all', polyOnly, noDataHatchFilter(colorProp, baseScaleExpression)];
    if (!map.current.getLayer(HATCH_LAYER)) {
      map.current.addLayer({
        id: HATCH_LAYER, type: 'fill', source: 'sectors', filter: hatchFilter,
        paint: { 'fill-pattern': HATCH_ID },
      }, map.current.getLayer('sectors-line-layer') ? 'sectors-line-layer' : undefined);
    } else {
      map.current.setFilter(HATCH_LAYER, hatchFilter);
    }
    const hatchVisible = (visualizationConfig?.renderMode || 'filled') === 'filled';
    map.current.setLayoutProperty(HATCH_LAYER, 'visibility', hatchVisible ? 'visible' : 'none');

    // Determine render mode from visualizationConfig
    const renderMode = visualizationConfig?.renderMode || 'filled';
    const borderWidth = visualizationConfig?.borderWidth || 2;
    const fillOpacity = visualizationConfig?.fillOpacity ?? 0.85;

    // Símbolos proporcionais: um círculo na sede de cada município, com área ∝ valor ORIGINAL
    // (sem normalização), sobre os polígonos em cinza neutro
    const symbolsOn = renderMode === 'symbols';
    let symbolFeatures = [];
    let symbolMax = 0;
    if (symbolsOn) {
      const rawGetter = makeVizValueGetter(allRows, currentAttributeForColoring, null);
      if (rawGetter.numeric) {
        currentMapData.forEach(row => {
          const props = currentAttributeForColoring === 'visualization_value'
            ? finalFeatures.find(f => String(f.properties.CD_MUN) === String(row.Codigo_Municipio))?.properties || {}
            : row;
          const v = rawGetter.get(props);
          const lon = parseCoord(row.Longitude_Municipio), lat = parseCoord(row.Latitude_Municipio);
          if (!(v > 0) || !Number.isFinite(lon) || !Number.isFinite(lat)) return;
          symbolMax = Math.max(symbolMax, v);
          symbolFeatures.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [lon, lat] }, properties: { __sym: v, NAME: row.Nome_Municipio, CD_MUN: String(row.Codigo_Municipio) } });
        });
        symbolFeatures.sort((a, b) => b.properties.__sym - a.properties.__sym); // grandes por baixo
      }
    }
    const symbolsData = { type: 'FeatureCollection', features: symbolFeatures };
    if (map.current.getSource('sectors-symbols')) map.current.getSource('sectors-symbols').setData(symbolsData);
    else map.current.addSource('sectors-symbols', { type: 'geojson', data: symbolsData });
    if (!map.current.getLayer('sectors-symbols-layer')) {
      map.current.addLayer({
        id: 'sectors-symbols-layer', type: 'circle', source: 'sectors-symbols',
        paint: { 'circle-color': SYMBOL_COLOR, 'circle-opacity': 0.72, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 1 },
      }, map.current.getLayer('sectors-label-layer') ? 'sectors-label-layer' : undefined);
    }
    map.current.setPaintProperty('sectors-symbols-layer', 'circle-radius', symbolRadiusExpression(symbolMax || 1));
    map.current.setLayoutProperty('sectors-symbols-layer', 'visibility', symbolsOn ? 'visible' : 'none');

    if (symbolsOn) {
      if (map.current.getLayer('sectors-fill-layer')) {
        map.current.setPaintProperty('sectors-fill-layer', 'fill-color', NEUTRAL_FILL);
        map.current.setPaintProperty('sectors-fill-layer', 'fill-opacity', 0.8);
        map.current.setPaintProperty('sectors-fill-layer', 'fill-outline-color', '#CCC7BC');
      }
      if (map.current.getLayer('sectors-line-layer')) {
        map.current.setPaintProperty('sectors-line-layer', 'line-opacity', 0);
        map.current.setPaintProperty('sectors-line-layer', 'line-width', 0);
      }
      if (map.current.getLayer('sectors-point-layer')) {
        map.current.setPaintProperty('sectors-point-layer', 'circle-color', NEUTRAL_FILL);
      }
    } else if (renderMode === 'border') {
      // Border mode: transparent fill, colored inward border
      if (map.current.getLayer('sectors-fill-layer')) {
        map.current.setPaintProperty('sectors-fill-layer', 'fill-color', colorRenderScaleExpression);
        map.current.setPaintProperty('sectors-fill-layer', 'fill-opacity', 0);
        map.current.setPaintProperty('sectors-fill-layer', 'fill-outline-color', 'transparent');
      }
      if (map.current.getLayer('sectors-line-layer')) {
        map.current.setPaintProperty('sectors-line-layer', 'line-color', colorRenderScaleExpression);
        map.current.setPaintProperty('sectors-line-layer', 'line-width', borderWidth);
        map.current.setPaintProperty('sectors-line-layer', 'line-opacity', 1);
        // Positive offset pushes line inward so border grows toward center
        map.current.setPaintProperty('sectors-line-layer', 'line-offset', (borderWidth / 2));
      }
      if (map.current.getLayer('sectors-point-layer')) {
        map.current.setPaintProperty('sectors-point-layer', 'circle-color', colorRenderScaleExpression);
      }
    } else {
      // Filled mode (default): colored fill, no visible line layer
      if (map.current.getLayer('sectors-fill-layer')) {
        map.current.setPaintProperty('sectors-fill-layer', 'fill-color', colorRenderScaleExpression);
        map.current.setPaintProperty('sectors-fill-layer', 'fill-opacity', fillOpacity);
        map.current.setPaintProperty('sectors-fill-layer', 'fill-outline-color', 'rgba(255, 255, 255, 0.85)');
      }
      if (map.current.getLayer('sectors-line-layer')) {
        map.current.setPaintProperty('sectors-line-layer', 'line-opacity', 0);
        map.current.setPaintProperty('sectors-line-layer', 'line-width', 0);
      }
      if (map.current.getLayer('sectors-point-layer')) {
        map.current.setPaintProperty('sectors-point-layer', 'circle-color', colorRenderScaleExpression);
      }
    }
  }, [mapLoaded, styleVersion, filteredCsvData, geojsonData, indicadoresData, colorAttribute, visualizationConfig, map, setSelectedCityInfo, legendConfigByKey]);


  useEffect(() => {
    if (mapLoaded && activeEnvironment === 'map') {
      loadMapData();
    }
  }, [mapLoaded, styleVersion, loadMapData, activeEnvironment]);

  // Destaca o município selecionado (contorno terracota); limpa quando nada está selecionado
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    const props = selectedCityInfo?.properties || {};
    const code = props.CD_MUN || props.Codigo_Municipio;
    const filter = ['==', ['to-string', ['get', 'CD_MUN']], code ? String(code) : '__nenhum__'];
    ['sectors-selected-halo', 'sectors-selected-line'].forEach(id => {
      if (map.current.getLayer(id)) map.current.setFilter(id, filter);
    });
  }, [selectedCityInfo, mapLoaded, styleVersion, filteredCsvData, geojsonData]);


  // =============================================
  // ANNOTATION RENDERING & DRAWING INTERACTION
  // =============================================

  const annotationClickRef = useRef(annotationHandleMapClick);
  const annotationDblClickRef = useRef(annotationHandleDoubleClick);
  const setCursorRef = useRef(setCursorPosition);
  const tempCoordsRef = useRef(tempCoordinates);
  const finishDrawingRef = useRef(annotationFinishDrawing);
  useEffect(() => { tempCoordsRef.current = tempCoordinates; }, [tempCoordinates]);
  useEffect(() => { finishDrawingRef.current = annotationFinishDrawing; }, [annotationFinishDrawing]);

  useEffect(() => { drawingModeRef.current = drawingMode; }, [drawingMode]);
  useEffect(() => { annotationClickRef.current = annotationHandleMapClick; }, [annotationHandleMapClick]);
  useEffect(() => { annotationDblClickRef.current = annotationHandleDoubleClick; }, [annotationHandleDoubleClick]);
  useEffect(() => { setCursorRef.current = setCursorPosition; }, [setCursorPosition]);

  // Set up drawing event handlers (once, using refs)
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const onMapClick = (e) => {
      if (drawingModeRef.current) {
        e.preventDefault();
        e.originalEvent?.stopPropagation?.();
        // Tocar perto do 1º vértice fecha o polígono; perto do último, conclui a linha
        // (no celular não há duplo clique confiável).
        const mode = drawingModeRef.current;
        const coords = tempCoordsRef.current || [];
        const near = (c) => { const p = map.current.project(c); return Math.hypot(p.x - e.point.x, p.y - e.point.y) < 22; };
        const isPoly = mode === 'polygon' || mode === 'measure_polygon';
        const isLine = mode === 'line' || mode === 'measure_line';
        if ((isPoly && coords.length >= 3 && near(coords[0])) || (isLine && coords.length >= 2 && near(coords[coords.length - 1]))) {
          finishDrawingRef.current();
          return;
        }
        annotationClickRef.current(e.lngLat);
      }
    };

    const onMapDblClick = (e) => {
      if (drawingModeRef.current && drawingModeRef.current !== 'point') {
        e.preventDefault();
        e.originalEvent?.stopPropagation?.();
        annotationDblClickRef.current(e.lngLat);
      }
    };

    const onMouseMove = (e) => {
      if (drawingModeRef.current) {
        setCursorRef.current([e.lngLat.lng, e.lngLat.lat]);
      }
    };

    // Use 'on' with a high-priority approach: annotation clicks are first
    map.current.on('click', onMapClick);
    map.current.on('dblclick', onMapDblClick);
    map.current.on('mousemove', onMouseMove);

    return () => {
      if (map.current) {
        map.current.off('click', onMapClick);
        map.current.off('dblclick', onMapDblClick);
        map.current.off('mousemove', onMouseMove);
      }
    };
  }, [mapLoaded, styleVersion]);

  // Change cursor style when in drawing mode; o zoom por duplo clique/toque atrapalha o desenho
  useEffect(() => {
    if (!map.current) return;
    if (drawingMode) {
      map.current.getCanvas().style.cursor = 'crosshair';
      map.current.doubleClickZoom.disable();
    } else {
      map.current.getCanvas().style.cursor = '';
      map.current.doubleClickZoom.enable();
    }
  }, [drawingMode]);

  // Block city selection clicks when drawing
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const blockCityClick = (e) => {
      if (drawingModeRef.current) {
        e.preventDefault();
        e.originalEvent?.stopImmediatePropagation?.();
      }
    };

    const layers = ['sectors-fill-layer', 'sectors-point-layer', 'sectors-line-layer'];
    layers.forEach(layerId => {
      if (map.current.getLayer(layerId)) {
        map.current.on('click', layerId, blockCityClick);
      }
    });

    return () => {
      if (map.current) {
        layers.forEach(layerId => {
          if (map.current.getLayer(layerId)) {
            map.current.off('click', layerId, blockCityClick);
          }
        });
      }
    };
  }, [mapLoaded, styleVersion]);

  // Render annotation features on map
  useEffect(() => {
    if (!map.current || !mapLoaded || !isStyleReady(map.current)) return;

    const DEFAULT_FILL = '#FFFFFF';
    const DEFAULT_BORDER = '#000000';

    const activeAnnotations = getActiveAnnotations();

    // Build GeoJSON features from annotations
    const features = [];

    activeAnnotations.forEach(ann => {
      let geometry = null;
      let centroid = null;
      const annColor = ann.color || DEFAULT_FILL;

      // Type-specific colors with backward-compatible fallbacks
      let renderColor = annColor; // color used for the shape itself
      let renderBorderColor = (annColor === '#FFFFFF' || annColor === '#ffffff') ? DEFAULT_BORDER : '#000000';
      let renderFillColor = annColor;
      let renderLineWidth = 2.5;
      let renderLineStyle = 'solid';

      if (ann.type === 'point') {
        geometry = { type: 'Point', coordinates: ann.coordinates };
        centroid = ann.coordinates;
        // Points: color = circle background
      } else if (ann.type === 'line') {
        geometry = { type: 'LineString', coordinates: ann.coordinates };
        const mid = Math.floor(ann.coordinates.length / 2);
        centroid = ann.coordinates[mid] || ann.coordinates[0];
        // Lines: lineColor determines line color on map
        renderColor = ann.lineColor || annColor;
        renderBorderColor = renderColor; // line border = line color
        renderLineWidth = ann.lineWidth ?? 2.5;
        renderLineStyle = ann.lineStyle || 'solid';
      } else if (ann.type === 'polygon') {
        geometry = { type: 'Polygon', coordinates: [ann.coordinates] };
        const coords = ann.coordinates.slice(0, -1);
        const avgLng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
        const avgLat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
        centroid = [avgLng, avgLat];
        // Polygons: fillColor for area, strokeColor for border lines
        renderFillColor = ann.fillColor || annColor;
        renderColor = renderFillColor;
        renderBorderColor = ann.strokeColor || DEFAULT_BORDER;
        renderLineWidth = ann.strokeWidth ?? 2.5;
        renderLineStyle = ann.strokeStyle || 'solid';
        var renderFillOpacity = ann.fillOpacity ?? 0.15;
      }

      const measurement = ann.measurement || getAnnotationMeasurement(ann);

      if (geometry) {
        features.push({
          type: 'Feature',
          properties: {
            id: ann.id,
            number: ann.number,
            numberStr: String(ann.number),
            annType: ann.type,
            color: renderFillColor,
            borderColor: renderBorderColor,
            lineColor: renderColor,
            lineWidth: renderLineWidth,
            lineStyle: renderLineStyle,
            fillOpacity: typeof renderFillOpacity !== 'undefined' ? renderFillOpacity : 0.15,
            description: ann.description,
            measurementText: measurement,
          },
          geometry,
        });

        // Add callout label feature for lines (segment distances + total) and polygons
        if (showMeasurements) {
          if (ann.type === 'line' && ann.coordinates && ann.coordinates.length >= 2) {
            const details = getLineSegmentDetails(ann.coordinates);

            // 1. Point feature at seg.midPoint for EXACTLY ONE label per segment
            details.segments.forEach(seg => {
              features.push({
                type: 'Feature',
                properties: {
                  id: `${ann.id}-seg-${seg.index}`,
                  annType: 'segment-label',
                  measurementText: `${seg.distanceStr}`,
                  textAngle: seg.textAngle,
                },
                geometry: { type: 'Point', coordinates: seg.midPoint },
              });

              // Inward arrows at start and end of segment (pointing toward segment midpoint)
              features.push({
                type: 'Feature',
                properties: { id: `${ann.id}-arrow-start-${seg.index}`, annType: 'meas-arrow', bearing: seg.bearing },
                geometry: { type: 'Point', coordinates: seg.p1 },
              });

              features.push({
                type: 'Feature',
                properties: { id: `${ann.id}-arrow-end-${seg.index}`, annType: 'meas-arrow', bearing: (seg.bearing + 180) % 360 },
                geometry: { type: 'Point', coordinates: seg.p2 },
              });
            });

            // Total distance callout label at line end if multiple segments
            if (details.segments.length > 1) {
              const lastCoord = ann.coordinates[ann.coordinates.length - 1];
              features.push({
                type: 'Feature',
                properties: {
                  id: `${ann.id}-total`,
                  annType: 'total-label',
                  measurementText: `Total: ${details.totalStr}`,
                },
                geometry: { type: 'Point', coordinates: lastCoord },
              });
            }
          } else if (ann.type === 'polygon' && measurement && centroid) {
            features.push({
              type: 'Feature',
              properties: {
                id: `${ann.id}-area`,
                annType: 'area-label',
                measurementText: `⬡ Área: ${measurement}`,
              },
              geometry: { type: 'Point', coordinates: centroid },
            });
          }
        }
      }
    });

    // Add temp drawing preview
    if (drawingMode && tempCoordinates.length > 0 && cursorPosition) {
      const previewCoords = [...tempCoordinates, cursorPosition];
      if ((drawingMode === 'line' || drawingMode === 'measure_line') && previewCoords.length >= 2) {
        features.push({
          type: 'Feature',
          properties: { id: 'preview', annType: 'preview', color: '#015668', borderColor: '#015668', lineStyle: 'dashed' },
          geometry: { type: 'LineString', coordinates: previewCoords },
        });

        const details = getLineSegmentDetails(previewCoords);
        details.segments.forEach(s => {
          features.push({
            type: 'Feature',
            properties: { id: `prev-seg-${s.index}`, annType: 'segment-label', measurementText: `${s.distanceStr}` },
            geometry: { type: 'LineString', coordinates: [s.p1, s.p2] },
          });
        });

        features.push({
          type: 'Feature',
          properties: { id: 'prev-total', annType: 'total-label', measurementText: `Total: ${details.totalStr}` },
          geometry: { type: 'Point', coordinates: previewCoords[previewCoords.length - 1] },
        });
      } else if ((drawingMode === 'polygon' || drawingMode === 'measure_polygon') && previewCoords.length >= 3) {
        const closedPreview = [...previewCoords, previewCoords[0]];
        features.push({
          type: 'Feature',
          properties: { id: 'preview', annType: 'preview', color: '#2B7A4B', borderColor: '#1F5C38', lineStyle: 'dashed' },
          geometry: { type: 'Polygon', coordinates: [closedPreview] },
        });
      }
      if (previewCoords.length >= 2) {
        features.push({
          type: 'Feature',
          properties: { id: 'preview-line', annType: 'preview', color: '#A39E93', borderColor: '#67635A' },
          geometry: { type: 'LineString', coordinates: previewCoords },
        });
      }
    }

    // Temp vertex markers
    if (drawingMode && tempCoordinates.length > 0) {
      tempCoordinates.forEach((coord, i) => {
        features.push({
          type: 'Feature',
          properties: { id: `temp-vertex-${i}`, annType: 'vertex', color: '#67635A', borderColor: '#ffffff' },
          geometry: { type: 'Point', coordinates: coord },
        });
      });
    }

    const geojsonData = { type: 'FeatureCollection', features };

    // --- Update or create annotation source & layers ---
    if (map.current.getSource('annotations-source')) {
      map.current.getSource('annotations-source').setData(geojsonData);
    } else {
      map.current.addSource('annotations-source', { type: 'geojson', data: geojsonData });

      // Polygon fill
      map.current.addLayer({
        id: 'annotations-fill-layer',
        type: 'fill',
        source: 'annotations-source',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': ['case', ['has', 'fillOpacity'], ['get', 'fillOpacity'], 0.15],
        },
      });

      // Lines — SOLID (including polygon borders)
      map.current.addLayer({
        id: 'annotations-line-solid',
        type: 'line',
        source: 'annotations-source',
        filter: ['all',
          ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'Polygon']],
          ['any', ['==', ['get', 'lineStyle'], 'solid'], ['!', ['has', 'lineStyle']]],
        ],
        paint: {
          'line-color': ['get', 'borderColor'],
          'line-width': ['case', ['==', ['get', 'annType'], 'preview'], 2, ['get', 'lineWidth']],
        },
      });

      // Lines — DASHED
      map.current.addLayer({
        id: 'annotations-line-dashed',
        type: 'line',
        source: 'annotations-source',
        filter: ['all',
          ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'Polygon']],
          ['==', ['get', 'lineStyle'], 'dashed'],
        ],
        paint: {
          'line-color': ['get', 'borderColor'],
          'line-width': ['get', 'lineWidth'],
          'line-dasharray': [6, 3],
        },
      });

      // Lines — DOTTED
      map.current.addLayer({
        id: 'annotations-line-dotted',
        type: 'line',
        source: 'annotations-source',
        filter: ['all',
          ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'Polygon']],
          ['==', ['get', 'lineStyle'], 'dotted'],
        ],
        paint: {
          'line-color': ['get', 'borderColor'],
          'line-width': ['get', 'lineWidth'],
          'line-dasharray': [1.5, 2],
        },
      });

      // Points — larger circle to hold number inside (only for actual point annotations)
      map.current.addLayer({
        id: 'annotations-point-layer',
        type: 'circle',
        source: 'annotations-source',
        filter: ['all', ['==', ['geometry-type'], 'Point'], ['==', ['get', 'annType'], 'point']],
        paint: {
          'circle-radius': 14,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': ['get', 'borderColor'],
        },
      });

      // Number text inside point markers
      map.current.addLayer({
        id: 'annotations-point-labels',
        type: 'symbol',
        source: 'annotations-source',
        filter: ['all', ['==', ['geometry-type'], 'Point'], ['==', ['get', 'annType'], 'point'], ['has', 'numberStr']],
        layout: {
          'text-field': ['get', 'numberStr'],
          'text-size': 11,
          'text-font': [FONT_BOLD],
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#000000',
        },
      });

      // --- Inward Arrow markers for segment ends (open side towards segment center) ---
      map.current.addLayer({
        id: 'annotations-meas-arrows',
        type: 'symbol',
        source: 'annotations-source',
        filter: ['==', ['get', 'annType'], 'meas-arrow'],
        layout: {
          'text-field': '▶',
          'text-size': 10,
          'text-font': [FONT_BOLD],
          'text-rotate': ['get', 'bearing'],
          'text-rotation-alignment': 'map',
          'text-allow-overlap': true,
          'text-keep-upright': false,
        },
        paint: {
          'text-color': '#015668',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5,
        },
      });

      map.current.addLayer({
        id: 'annotations-meas-mid-node',
        type: 'circle',
        source: 'annotations-source',
        filter: ['==', ['get', 'annType'], 'meas-mid-node'],
        paint: {
          'circle-radius': 3.5,
          'circle-color': '#015668',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.current.addLayer({
        id: 'annotations-meas-end-node',
        type: 'circle',
        source: 'annotations-source',
        filter: ['==', ['get', 'annType'], 'meas-end-node'],
        paint: {
          'circle-radius': 5.5,
          'circle-color': '#B3261E',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      // --- Segment distance labels (Centered ONCE per segment at midpoint) ---
      map.current.addLayer({
        id: 'annotations-segment-labels',
        type: 'symbol',
        source: 'annotations-source',
        filter: ['==', ['get', 'annType'], 'segment-label'],
        layout: {
          'symbol-placement': 'point',
          'text-field': ['get', 'measurementText'],
          'text-size': 12,
          'text-font': [FONT_BOLD],
          'text-rotate': ['get', 'textAngle'],
          'text-rotation-alignment': 'map',
          'text-offset': [0, -0.75],
          'text-allow-overlap': true,
          'text-keep-upright': true,
        },
        paint: {
          'text-color': '#00242D',
          'text-halo-color': '#ffffff',
          'text-halo-width': 3.5,
        },
      });

      // --- Total distance callout label at line end ---
      map.current.addLayer({
        id: 'annotations-total-label',
        type: 'symbol',
        source: 'annotations-source',
        filter: ['==', ['get', 'annType'], 'total-label'],
        layout: {
          'symbol-placement': 'point',
          'text-field': ['get', 'measurementText'],
          'text-size': 12,
          'text-font': [FONT_BOLD],
          'text-variable-anchor': ['top-left', 'bottom-left', 'top-right', 'bottom-right', 'top', 'bottom'],
          'text-radial-offset': 0.8,
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#00242D',
          'text-halo-color': '#ffffff',
          'text-halo-width': 3.5,
        },
      });

      // --- Polygon Area label ---
      map.current.addLayer({
        id: 'annotations-area-label',
        type: 'symbol',
        source: 'annotations-source',
        filter: ['==', ['get', 'annType'], 'area-label'],
        layout: {
          'symbol-placement': 'point',
          'text-field': ['get', 'measurementText'],
          'text-size': 12,
          'text-font': [FONT_BOLD],
          'text-anchor': 'center',
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#00242D',
          'text-halo-color': '#ffffff',
          'text-halo-width': 3.5,
        },
      });

      // Temp vertex markers (smaller)
      map.current.addLayer({
        id: 'annotations-vertex-layer',
        type: 'circle',
        source: 'annotations-source',
        filter: ['==', ['get', 'annType'], 'vertex'],
        paint: {
          'circle-radius': 4,
          'circle-color': '#67635A',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
        },
      });
    }


  }, [mapLoaded, styleVersion, allAnnotations, activeVisualizationId, drawingMode, tempCoordinates, cursorPosition, getActiveAnnotations, showMeasurements]);


  // =============================================
  // GRATICULE (Parallels & Meridians)
  // =============================================

  // Helper: build graticule GeoJSON at the given zoom level
  const buildGraticuleGeoJson = useCallback((currentZoom) => {
    let interval;
    if (currentZoom >= 8) interval = 0.5;
    else if (currentZoom >= 6) interval = 1;
    else if (currentZoom >= 4) interval = 2;
    else if (currentZoom >= 2) interval = 5;
    else interval = 10;

    const features = [];

    for (let lat = -90; lat <= 90; lat += interval) {
      const coords = [];
      for (let lng = -180; lng <= 180; lng += 2) {
        coords.push([lng, lat]);
      }
      features.push({
        type: 'Feature',
        properties: { label: `${Math.abs(lat)}° ${lat >= 0 ? 'N' : 'S'}`, axis: 'lat' },
        geometry: { type: 'LineString', coordinates: coords },
      });
    }

    for (let lng = -180; lng <= 180; lng += interval) {
      const coords = [];
      for (let lat = -85; lat <= 85; lat += 2) {
        coords.push([lng, lat]);
      }
      features.push({
        type: 'Feature',
        properties: { label: `${Math.abs(lng)}° ${lng >= 0 ? 'L' : 'O'}`, axis: 'lng' },
        geometry: { type: 'LineString', coordinates: coords },
      });
    }

    return { type: 'FeatureCollection', features };
  }, []);

  // Fonte da gratícula a partir das opções de estilo (Noto Sans: Regular, Bold ou Italic)
  const getGraticuleFonts = useCallback((style) => getFontStack(style.bold ? 'Bold' : 'Regular', !!style.italic), []);

  // Effect 1: Create / Remove graticule layers when toggled
  useEffect(() => {
    if (!map.current || !mapLoaded || !isStyleReady(map.current)) return;

    const GRATICULE_SOURCE = 'graticule-source';
    const GRATICULE_LINE_LAYER = 'graticule-lines';
    const GRATICULE_LABEL_LAYER = 'graticule-labels';

    if (!showGraticule) {
      if (map.current.getLayer(GRATICULE_LABEL_LAYER)) map.current.removeLayer(GRATICULE_LABEL_LAYER);
      if (map.current.getLayer(GRATICULE_LINE_LAYER)) map.current.removeLayer(GRATICULE_LINE_LAYER);
      if (map.current.getSource(GRATICULE_SOURCE)) map.current.removeSource(GRATICULE_SOURCE);
      return;
    }

    const geoJson = buildGraticuleGeoJson(map.current.getZoom());

    if (!map.current.getSource(GRATICULE_SOURCE)) {
      map.current.addSource(GRATICULE_SOURCE, { type: 'geojson', data: geoJson });

      map.current.addLayer({
        id: GRATICULE_LINE_LAYER,
        type: 'line',
        source: GRATICULE_SOURCE,
        paint: {
          'line-color': graticuleStyle.lineColor,
          'line-width': graticuleStyle.lineWidth,
          'line-dasharray': [4, 4],
        },
      });

      map.current.addLayer({
        id: GRATICULE_LABEL_LAYER,
        type: 'symbol',
        source: GRATICULE_SOURCE,
        layout: {
          'symbol-placement': 'line',
          'text-field': ['get', 'label'],
          'text-size': graticuleStyle.fontSize,
          'text-font': getGraticuleFonts(graticuleStyle),
          'text-max-angle': 30,
          'text-allow-overlap': false,
          'symbol-spacing': 300,
          'text-keep-upright': true,
          'text-letter-spacing': 0.05,
        },
        paint: {
          'text-color': graticuleStyle.textColor,
          'text-halo-color': graticuleStyle.showHalo ? graticuleStyle.haloColor : 'transparent',
          'text-halo-width': graticuleStyle.showHalo ? graticuleStyle.haloWidth : 0,
          'text-halo-blur': 0.2,
        },
      });
    } else {
      map.current.getSource(GRATICULE_SOURCE).setData(geoJson);
    }
  }, [mapLoaded, styleVersion, showGraticule, buildGraticuleGeoJson, getGraticuleFonts]); // eslint-disable-line

  // Effect 2: Live-update paint & layout properties when graticuleStyle changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !showGraticule) return;
    if (!map.current.getLayer('graticule-lines') || !map.current.getLayer('graticule-labels')) return;

    // Line properties
    map.current.setPaintProperty('graticule-lines', 'line-color', graticuleStyle.lineColor);
    map.current.setPaintProperty('graticule-lines', 'line-width', graticuleStyle.lineWidth);

    // Text layout
    map.current.setLayoutProperty('graticule-labels', 'text-size', graticuleStyle.fontSize);
    map.current.setLayoutProperty('graticule-labels', 'text-font', getGraticuleFonts(graticuleStyle));

    // Text paint
    map.current.setPaintProperty('graticule-labels', 'text-color', graticuleStyle.textColor);
    map.current.setPaintProperty('graticule-labels', 'text-halo-color', graticuleStyle.showHalo ? graticuleStyle.haloColor : 'transparent');
    map.current.setPaintProperty('graticule-labels', 'text-halo-width', graticuleStyle.showHalo ? graticuleStyle.haloWidth : 0);
  }, [mapLoaded, styleVersion, showGraticule, graticuleStyle, getGraticuleFonts]);

  // Effect 3: Regenerate GeoJSON data when zoom changes (interval adapts)
  useEffect(() => {
    if (!map.current || !mapLoaded || !showGraticule) return;

    const updateGraticuleData = () => {
      if (!map.current || !map.current.getSource('graticule-source')) return;
      const geoJson = buildGraticuleGeoJson(map.current.getZoom());
      map.current.getSource('graticule-source').setData(geoJson);
    };

    map.current.on('zoomend', updateGraticuleData);
    return () => {
      if (map.current) {
        map.current.off('zoomend', updateGraticuleData);
      }
    };
  }, [mapLoaded, styleVersion, showGraticule, buildGraticuleGeoJson]);


  const handleMapStyleChange = useCallback((newStyle) => {
    setMapNotice(null);
    setMapStyle(normalizeBasemap(newStyle)); // Aceita ids, URLs do OpenFreeMap e URLs mapbox:// de perfis antigos
  }, []);

  const flyToCity = useCallback((city) => {
    if (map.current && city.lat && city.lng) {
      // Deixa o município visível acima do cartão e ao lado do painel lateral
      const largura = map.current.getContainer().clientWidth;
      const painelAberto = !!document.querySelector('.painel-mapa.aberto');
      // offset (e não padding): o deslocamento vale só para este voo, não fica gravado no mapa
      const offset = largura > 768 ? [painelAberto ? 150 : -40, -120] : [0, -110];
      map.current.flyTo({
        center: [city.lng, city.lat],
        zoom: Math.max(map.current.getZoom(), 9.5),
        offset,
        essential: true
      });
    }
  }, [map]);


  const value = {
    map, mapContainer, mapLoaded, isMapLoading, lng, lat, zoom,
    mapStyle, // Exporta o estado local do estilo
    handleMapStyleChange, // Exporta a função para mudar o estilo
    mapNotice, setMapNotice,
    flyToCity,
    setLng, setLat, setZoom // Expor se AppContent ou outros precisarem
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
