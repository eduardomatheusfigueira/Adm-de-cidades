import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { DataContext } from './DataContext';
import { UIContext } from './UIContext';
import { getColorScale } from '../utils/colorUtils';

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
  const { colorAttribute, visualizationConfig, activeEnvironment, setSelectedCityInfo } = useContext(UIContext);

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
    const colorRenderScaleExpression = getColorScale(currentAttributeForColoring, attributeValues);

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

      const layers = ['sectors-fill-layer', 'sectors-point-layer'];
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
    if (map.current.getLayer('sectors-fill-layer')) {
      map.current.setPaintProperty('sectors-fill-layer', 'fill-color', colorRenderScaleExpression);
    }
    if (map.current.getLayer('sectors-point-layer')) {
      map.current.setPaintProperty('sectors-point-layer', 'circle-color', colorRenderScaleExpression);
    }
  }, [mapLoaded, filteredCsvData, geojsonData, indicadoresData, colorAttribute, visualizationConfig, map, setSelectedCityInfo]);


  useEffect(() => {
    if (mapLoaded && activeEnvironment === 'map') {
      loadMapData();
    }
  }, [mapLoaded, loadMapData, activeEnvironment]);


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
