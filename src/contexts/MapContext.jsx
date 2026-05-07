import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { DataContext } from './DataContext';
import { UIContext } from './UIContext';
import { AnnotationContext } from './AnnotationContext';
import { getColorScale, getLegendKey } from '../utils/colorUtils';

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
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/outdoors-v12');

  const { geojsonData, indicadoresData, filteredCsvData } = useContext(DataContext);
  // Consumindo diretamente do UIContext, sem valores padrão aqui
  const { colorAttribute, visualizationConfig, activeEnvironment, setSelectedCityInfo, legendConfigByKey } = useContext(UIContext);

  // Annotation context
  const {
    drawingMode,
    isDrawing,
    tempCoordinates,
    cursorPosition,
    handleMapClick: annotationHandleMapClick,
    handleMapDoubleClick: annotationHandleDoubleClick,
    setCursorPosition,
    getActiveAnnotations,
    activeVisualizationId,
    annotations: allAnnotations,
  } = useContext(AnnotationContext);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWR1YXJkb21hdGhldXNmaWd1ZWlyYSIsImEiOiJjbTgwd2tqbzYwemRrMmpwdGVka2FrMG5nIn0.NfOWy2a0J-YHP4mdKs_TAQ';
  }, []);

  const currentStyleUrl = useRef(mapStyle);

  useEffect(() => {
    // Initialize map if container is present and map doesn't exist
    if (mapContainer.current && !map.current) {
      console.log("[MapContext] Initializing Mapbox map...");
      setIsMapLoading(true);
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle, // Usa o estado local mapStyle
        center: [lng, lat],
        zoom: zoom
      });
      currentStyleUrl.current = mapStyle; // Sync ref

      map.current.on('move', () => {
        setLng(map.current.getCenter().lng);
        setLat(map.current.getCenter().lat);
        setZoom(map.current.getZoom());
      });
      map.current.on('style.load', () => {
        console.log("[MapContext] Map style loaded.");
        setMapLoaded(true);
        setIsMapLoading(false);
      });
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

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
      map.current.setStyle(mapStyle);
      currentStyleUrl.current = mapStyle;
    }
  }, [mapStyle]);


  const loadMapData = useCallback(() => {
    console.log("[MapContext] loadMapData called", { filteredCsvDataLength: filteredCsvData?.length, colorAttribute, visualizationConfig });

    if (!map.current || !mapLoaded || !map.current.isStyleLoaded()) {
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
    const finalFeatures = [];

    console.log(`[MapContext] Processing ${currentMapData.length} cities from CSV.`);

    // Helper to parse coordinates robustly (handles comma and dot)
    const parseCoord = (val) => {
      if (!val) return NaN;
      if (typeof val === 'number') return val;
      return parseFloat(val.replace(',', '.'));
    };

    const bounds = new mapboxgl.LngLatBounds();
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
            CAPITAL: cityData.Capital === 'true', ESTADO: cityData.Sigla_Estado,
            ALTITUDE: parseFloat(cityData.Altitude_Municipio), LONGITUDE: lon, LATITUDE: lat,
            REGIAO: cityData.Sigla_Regiao,
            custom_description: `Dados CSV: ${cityData.Nome_Municipio}, Estado: ${cityData.Sigla_Estado}`
          };

          if (visualizationConfig && visualizationConfig.type === 'indicator' && indicadoresData) {
            const { year, indicator, valueType } = visualizationConfig;
            const cityIndicator = indicadoresData.find(ind =>
              String(ind.Codigo_Municipio) === cdMun && ind.Ano_Observacao === year && ind.Nome_Indicador === indicator);
            if (cityIndicator) {
              properties.indicator_value = parseFloat(cityIndicator.Valor);
              properties.indicator_position = parseFloat(cityIndicator.Indice_Posicional);
              properties.indicator_name = indicator; properties.indicator_year = year;
              properties.visualization_value = valueType === 'value' ? properties.indicator_value : properties.indicator_position;
            } else properties.visualization_value = null;
          } else if (currentAttributeForColoring !== 'visualization_value') delete properties.visualization_value;

          finalFeatures.push({ ...feature, properties });
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

      bounds.extend([lon, lat]);
      hasValidBounds = true;

      const properties = {
        CD_MUN: String(cityData.Codigo_Municipio), NAME: cityData.Nome_Municipio, LEVEL: 'Municípios',
        AREA: parseFloat(cityData.Area_Municipio), CAPITAL: cityData.Capital === 'true',
        ESTADO: cityData.Sigla_Estado, ALTITUDE: parseFloat(cityData.Altitude_Municipio),
        LONGITUDE: lon, LATITUDE: lat, REGIAO: cityData.Sigla_Regiao, ...cityData,
        custom_description: `Dados CSV: ${cityData.Nome_Municipio}, Estado: ${cityData.Sigla_Estado}`
      };

      if (visualizationConfig && visualizationConfig.type === 'indicator' && indicadoresData) {
        const { year, indicator, valueType } = visualizationConfig;
        const cityIndicator = indicadoresData.find(ind =>
          String(ind.Codigo_Municipio) === properties.CD_MUN && ind.Ano_Observacao === year && ind.Nome_Indicador === indicator);
        if (cityIndicator) {
          properties.indicator_value = parseFloat(cityIndicator.Valor);
          properties.indicator_position = parseFloat(cityIndicator.Indice_Posicional);
          properties.indicator_name = indicator; properties.indicator_year = year;
          properties.visualization_value = valueType === 'value' ? properties.indicator_value : properties.indicator_position;
        } else properties.visualization_value = null;
      }
      finalFeatures.push({ type: 'Feature', properties, geometry: { type: 'Point', coordinates: [lon, lat] } });
      pointsGenerated++;
    });

    console.log(`[MapContext] Generated ${finalFeatures.length} features (${pointsGenerated} points).`);

    // Fit bounds if we have valid data and it's the first load or explicit update
    if (hasValidBounds && map.current) {
      // Only fit bounds if we haven't manually moved significantly? 
      // For now, let's fit bounds on data load to ensure visibility as requested.
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }

    const combinedGeoJson = { type: 'FeatureCollection', features: finalFeatures };
    const attributeValues = finalFeatures.map(f => f.properties[currentAttributeForColoring]).filter(v => v !== undefined && v !== null);
    const baseScaleExpression = getColorScale(currentAttributeForColoring, attributeValues);
    let colorRenderScaleExpression = baseScaleExpression;

    const legendKey = getLegendKey(visualizationConfig, colorAttribute);
    const customLegend = legendKey ? legendConfigByKey[legendKey] : null;

    if (customLegend && customLegend.items && customLegend.items.length > 0) {
      colorRenderScaleExpression = [...baseScaleExpression]; // shallow copy
      const expressionType = colorRenderScaleExpression[0];
      
      if (expressionType === 'match') {
        // items correspond to indices 3, 5, 7...
        for (let i = 0; i < customLegend.items.length; i++) {
          const colorIndex = 3 + i * 2;
          if (colorIndex < colorRenderScaleExpression.length) {
            colorRenderScaleExpression[colorIndex] = customLegend.items[i].color;
          }
        }
      } else if (expressionType === 'step') {
        // items correspond to index 2, then 4, 6, 8...
        if (customLegend.items.length > 0) {
          colorRenderScaleExpression[2] = customLegend.items[0].color;
        }
        for (let i = 1; i < customLegend.items.length; i++) {
          const colorIndex = 4 + (i - 1) * 2;
          if (colorIndex < colorRenderScaleExpression.length) {
            colorRenderScaleExpression[colorIndex] = customLegend.items[i].color;
          }
        }
      }
    }

    if (map.current.getSource('sectors')) {
      map.current.getSource('sectors').setData(combinedGeoJson);
    } else {
      map.current.addSource('sectors', { type: 'geojson', data: combinedGeoJson });
      map.current.addLayer({
        id: 'sectors-fill-layer', type: 'fill', source: 'sectors',
        filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
        paint: { 'fill-color': colorRenderScaleExpression, 'fill-opacity': 0.6, 'fill-outline-color': '#000' }
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

      const layers = ['sectors-fill-layer', 'sectors-point-layer', 'sectors-line-layer'];
      layers.forEach(layerId => {
        map.current.on('mouseenter', layerId, () => { map.current.getCanvas().style.cursor = 'pointer'; });
        map.current.on('mouseleave', layerId, () => { map.current.getCanvas().style.cursor = ''; });
        map.current.on('click', layerId, (e) => {
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

    // Determine render mode from visualizationConfig
    const renderMode = visualizationConfig?.renderMode || 'filled';
    const borderWidth = visualizationConfig?.borderWidth || 2;
    const fillOpacity = visualizationConfig?.fillOpacity ?? 0.6;

    if (renderMode === 'border') {
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
        map.current.setPaintProperty('sectors-fill-layer', 'fill-outline-color', '#000');
      }
      if (map.current.getLayer('sectors-line-layer')) {
        map.current.setPaintProperty('sectors-line-layer', 'line-opacity', 0);
        map.current.setPaintProperty('sectors-line-layer', 'line-width', 0);
      }
      if (map.current.getLayer('sectors-point-layer')) {
        map.current.setPaintProperty('sectors-point-layer', 'circle-color', colorRenderScaleExpression);
      }
    }
  }, [mapLoaded, filteredCsvData, geojsonData, indicadoresData, colorAttribute, visualizationConfig, map, setSelectedCityInfo, legendConfigByKey]);


  useEffect(() => {
    if (mapLoaded && activeEnvironment === 'map') {
      loadMapData();
    }
  }, [mapLoaded, loadMapData, activeEnvironment]);


  // =============================================
  // ANNOTATION RENDERING & DRAWING INTERACTION
  // =============================================

  const drawingModeRef = useRef(drawingMode);
  const annotationClickRef = useRef(annotationHandleMapClick);
  const annotationDblClickRef = useRef(annotationHandleDoubleClick);
  const setCursorRef = useRef(setCursorPosition);

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
  }, [mapLoaded]);

  // Change cursor style when in drawing mode
  useEffect(() => {
    if (!map.current) return;
    if (drawingMode) {
      map.current.getCanvas().style.cursor = 'crosshair';
    } else {
      map.current.getCanvas().style.cursor = '';
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
  }, [mapLoaded]);

  // Render annotation features on map
  useEffect(() => {
    if (!map.current || !mapLoaded || !map.current.isStyleLoaded()) return;

    const DEFAULT_FILL = '#FFFFFF';
    const DEFAULT_BORDER = '#000000';

    const activeAnnotations = getActiveAnnotations();

    // Build GeoJSON features from annotations
    const features = [];
    const labelFeatures = [];

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
          },
          geometry,
        });
      }

      // Label at centroid for ALL types (number inside marker circle)
      if (centroid) {
        labelFeatures.push({
          type: 'Feature',
          properties: {
            number: String(ann.number),
            annType: ann.type,
            color: annColor,
            borderColor: (annColor === '#FFFFFF' || annColor === '#ffffff') ? DEFAULT_BORDER : '#000000',
          },
          geometry: { type: 'Point', coordinates: centroid },
        });
      }
    });

    // Add temp drawing preview
    if (drawingMode && tempCoordinates.length > 0 && cursorPosition) {
      const previewCoords = [...tempCoordinates, cursorPosition];
      if (drawingMode === 'line' && previewCoords.length >= 2) {
        features.push({
          type: 'Feature',
          properties: { id: 'preview', annType: 'preview', color: '#94A3B8', borderColor: '#64748B' },
          geometry: { type: 'LineString', coordinates: previewCoords },
        });
      } else if (drawingMode === 'polygon' && previewCoords.length >= 3) {
        const closedPreview = [...previewCoords, previewCoords[0]];
        features.push({
          type: 'Feature',
          properties: { id: 'preview', annType: 'preview', color: '#94A3B8', borderColor: '#64748B' },
          geometry: { type: 'Polygon', coordinates: [closedPreview] },
        });
      }
      if (previewCoords.length >= 2) {
        features.push({
          type: 'Feature',
          properties: { id: 'preview-line', annType: 'preview', color: '#94A3B8', borderColor: '#64748B' },
          geometry: { type: 'LineString', coordinates: previewCoords },
        });
      }
    }

    // Temp vertex markers
    if (drawingMode && tempCoordinates.length > 0) {
      tempCoordinates.forEach((coord, i) => {
        features.push({
          type: 'Feature',
          properties: { id: `temp-vertex-${i}`, annType: 'vertex', color: '#64748B', borderColor: '#ffffff' },
          geometry: { type: 'Point', coordinates: coord },
        });
      });
    }

    const geojsonData = { type: 'FeatureCollection', features };
    const labelsGeojson = { type: 'FeatureCollection', features: labelFeatures };

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

      // Points — larger circle to hold number inside
      map.current.addLayer({
        id: 'annotations-point-layer',
        type: 'circle',
        source: 'annotations-source',
        filter: ['all', ['==', ['geometry-type'], 'Point'], ['!=', ['get', 'annType'], 'vertex']],
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
        filter: ['all', ['==', ['geometry-type'], 'Point'], ['!=', ['get', 'annType'], 'vertex'], ['has', 'numberStr']],
        layout: {
          'text-field': ['get', 'numberStr'],
          'text-size': 11,
          'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#000000',
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
          'circle-color': '#64748B',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
        },
      });
    }

    // Labels source & layer — for line/polygon centroids (number inside a circle marker)
    if (map.current.getSource('annotations-labels-source')) {
      map.current.getSource('annotations-labels-source').setData(labelsGeojson);
    } else {
      map.current.addSource('annotations-labels-source', { type: 'geojson', data: labelsGeojson });

      // Background circle for centroid labels
      map.current.addLayer({
        id: 'annotations-centroid-circles',
        type: 'circle',
        source: 'annotations-labels-source',
        filter: ['any', ['==', ['get', 'annType'], 'line'], ['==', ['get', 'annType'], 'polygon']],
        paint: {
          'circle-radius': 14,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': ['get', 'borderColor'],
        },
      });

      // Number text at centroid
      map.current.addLayer({
        id: 'annotations-labels-layer',
        type: 'symbol',
        source: 'annotations-labels-source',
        layout: {
          'text-field': ['get', 'number'],
          'text-size': 11,
          'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#000000',
        },
      });
    }
  }, [mapLoaded, allAnnotations, activeVisualizationId, drawingMode, tempCoordinates, cursorPosition, getActiveAnnotations]);


  const handleMapStyleChange = useCallback((newStyle) => {
    setMapStyle(newStyle); // Atualiza o estado local do estilo do mapa
  }, []);

  const flyToCity = useCallback((city) => {
    if (map.current && city.lat && city.lng) {
      map.current.flyTo({
        center: [city.lng, city.lat],
        zoom: 12,
        essential: true
      });
    }
  }, [map]);


  const value = {
    map, mapContainer, mapLoaded, isMapLoading, lng, lat, zoom,
    mapStyle, // Exporta o estado local do estilo
    handleMapStyleChange, // Exporta a função para mudar o estilo
    flyToCity,
    setLng, setLat, setZoom // Expor se AppContent ou outros precisarem
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
