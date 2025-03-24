import React, { useRef, useEffect, useState } from 'react';
    import mapboxgl from 'mapbox-gl';
    import FilterMenu from './components/FilterMenu';
    import VisualizationMenu from './components/VisualizationMenu';
    import Legend from './components/Legend';
    import './index.css';
    import Papa from 'papaparse';
    import * as d3 from 'd3'; // Import d3 library
    import { getColorScale } from './utils/colorUtils'; // Import color scale utility

    import municipiosGeoJson from '../data/municipios-geo.json';

    // Importa dados CSV
    import municipiosCsvData from '../data/municipios.csv?raw';
    import indicadoresCsvData from '../data/indicadores.csv?raw';
    import DataVisualizationEnvironment from './components/DataVisualizationEnvironment'; // Import do novo ambiente
    import CityInfoBottomBar from './components/CityInfoBottomBar'; // Import CityInfoBottomBar
    import CityProfileSummary from './components/CityProfileSummary';
    import ETLEnvironment from './components/ETLEnvironment'; // Import the new ETL environment

    function parseCSVData(csvText) {
      const lines = csvText.split('\n');
      const headers = lines[0].split(';');
      const trimmedHeaders = headers.map(header => header.trim()); // Trim headers
      return {
        headers: trimmedHeaders,
        data: lines.slice(1).map(line => {
          const values = line.split(';');
          return trimmedHeaders.reduce((obj, header, index) => {
            obj[header] = values[index] ? values[index].trim() : ''; // Use trimmed header
            return obj;
          }, {});
        })
      };
    }

    const csvDataResult = parseCSVData(municipiosCsvData);
    const initialCsvData = csvDataResult.data;
    const csvHeaders = csvDataResult.headers;
    const initialIndicadoresData = parseCSVData(indicadoresCsvData).data;

    function App() {
      const mapContainer = useRef(null);
      const map = useRef(null);
      const [lng, setLng] = useState(-54.57);
      const [lat, setLat] = useState(-25.53);
      const [zoom, setZoom] = useState(12);
      const [geojsonData, setGeojsonData] = useState(municipiosGeoJson);
      const [selectedCityInfo, setSelectedCityInfo] = useState(null); // Use selectedCityInfo instead of selectedCity and isEditorOpen
      const [csvData, setCsvData] = useState(initialCsvData);
      const [filteredCsvData, setFilteredCsvData] = useState(initialCsvData);
      const [indicadoresData, setIndicadoresData] = useState(initialIndicadoresData);
      const [mapLoaded, setMapLoaded] = useState(false);
      const [isMapLoading, setIsMapLoading] = useState(true);
      const [colorAttribute, setColorAttribute] = useState('Sigla_Regiao'); // Default color attribute
      const [legendColorStops, setLegendColorStops] = useState([]);
      const [showGeometryImportModal, setShowGeometryImportModal] = useState(false);
      const [geometryImportData, setGeometryImportData] = useState(null);
      const [municipalityCodeField, setMunicipalityCodeField] = useState('');
      const [geometryField, setGeometryField] = useState('');
      const [visualizationConfig, setVisualizationConfig] = useState(null);
      const [activeEnvironment, setActiveEnvironment] = useState('map'); // 'map', 'data', or 'etl'


      // Function to update the map when geojsonData changes
      const updateMapData = () => {
        if (map.current && map.current.getSource('sectors')) {
          map.current.getSource('sectors').setData(geojsonData);
        }
      };

      // Update map when geojsonData changes
      useEffect(() => {
        updateMapData();
      }, [geojsonData]);

      useEffect(() => {
        // Set the access token
        mapboxgl.accessToken = 'pk.eyJ1IjoiZWR1YXJkb21hdGhldXNmaWd1ZWlyYSIsImEiOiJjbTgwd2tqbzYwemRrMmpwdGVka2FrMG5nIn0.NfOWy2a0J-YHP4mdKs_TAQ';

        if (map.current) return; // Initialize map only once

        setIsMapLoading(true);

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11', // Updated to a lighter style
          center: [lng, lat],
          zoom: zoom
        });

        map.current.on('move', () => {
          setLng(map.current.getCenter().lng.toFixed(4));
          setLat(map.current.getCenter().lat.toFixed(4));
          setZoom(map.current.getZoom().toFixed(2));
        });

        // Use 'style.load' event to ensure style is fully loaded
        map.current.on('style.load', () => {
          setMapLoaded(true);
          setIsMapLoading(false);
          loadMapData(filteredCsvData, colorAttribute);
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      }, []);

      useEffect(() => {
        // Only load data when the map and style are fully loaded
        if (mapLoaded) {
          console.log("useEffect [mapLoaded, filteredCsvData, colorAttribute, visualizationConfig] triggered");
          const currentAttribute = visualizationConfig && visualizationConfig.type === 'indicator'
            ? 'visualization_value'
            : colorAttribute;
          loadMapData(filteredCsvData, currentAttribute);
        }
      }, [mapLoaded, filteredCsvData, colorAttribute, visualizationConfig]);


      const loadMapData = (currentCsvData, currentAttribute) => {
        console.log("loadMapData called", { currentCsvDataLength: currentCsvData.length, currentAttribute });
        if (!map.current || !mapLoaded) {
          console.log("Mapa não está pronto para carregar dados");
          return;
        }

        // Verificar se há dados válidos
        if (!currentCsvData || currentCsvData.length === 0) {
          console.warn("Nenhum dado de cidade para exibir no mapa");
          return;
        }

        // Verificar se as coordenadas são válidas
        const validCities = currentCsvData.filter(city => {
          const lon = parseFloat(city.Longitude_Municipio);
          const lat = parseFloat(city.Latitude_Municipio);
          return !isNaN(lon) && !isNaN(lat) && lon !== 0 && lat !== 0;
        });

        // Convert CSV data to GeoJSON Features
        const csvFeatures = validCities.map(city => {
          const lon = parseFloat(city.Longitude_Municipio);
          const lat = parseFloat(city.Latitude_Municipio);

          // Prepare properties object
          const properties = {
            NAME: city.Nome_Municipio,
            LEVEL: 'Municípios',
            AREA: parseFloat(city.Area_Municipio),
            CAPITAL: city.Capital === 'true',
            ESTADO: city.Sigla_Estado,
            ALTITUDE: parseFloat(city.Altitude_Municipio),
            LONGITUDE: lon,
            LATITUDE: lat,
            REGIAO: city.Sigla_Regiao,
            CD_MUN: city.Codigo_Municipio,
            ...city,
            custom_description: `Dados CSV: ${city.Nome_Municipio}, Estado: ${city.Sigla_Estado}`
          };

          // Add indicator data if visualization config is for indicators
          if (visualizationConfig && visualizationConfig.type === 'indicator') {
            const { year, indicator, valueType } = visualizationConfig;

            // Find matching indicator for this city
            const cityIndicator = indicadoresData.find(ind =>
              ind.Codigo_Municipio === city.Codigo_Municipio &&
              ind.Ano_Observacao === year &&
              ind.Nome_Indicador === indicator
            );

            if (cityIndicator) {
              properties.indicator_value = parseFloat(cityIndicator.Valor);
              properties.indicator_position = parseFloat(cityIndicator.Indice_Posicional);
              properties.indicator_name = indicator;
              properties.indicator_year = year;

              // Set the visualization value based on valueType
              properties.visualization_value = valueType === 'value'
                ? properties.indicator_value
                : properties.indicator_position;
            } else {
              properties.visualization_value = null;
            }
          }

          return {
            type: 'Feature',
            properties,
            geometry: {
              type: 'Point',
              coordinates: [lon, lat]
            }
          };
        });

        // Combine CSV features with existing GeoJSON features
        const combinedGeoJson = {
          type: 'FeatureCollection',
          features: csvFeatures
        };

        setGeojsonData(combinedGeoJson);

        const attributeValues = csvFeatures.map(feature => feature.properties[currentAttribute]).filter(value => value !== undefined);
        const colorScale = getColorScale(currentAttribute, attributeValues);

        if (map.current.getSource('sectors')) {
          map.current.getSource('sectors').setData(combinedGeoJson);
          map.current.setPaintProperty('sectors-layer', 'circle-color', colorScale);
        } else {
          map.current.addSource('sectors', {
            type: 'geojson',
            data: combinedGeoJson
          });

          // Add a circle layer for cities - simplified paint properties
          map.current.addLayer({
            id: 'sectors-layer',
            type: 'circle',
            source: 'sectors',
            layout: {},
            paint: {
              'circle-radius': 5,
              'circle-color': colorScale, // Apply color scale here
              'circle-opacity': 0.7
            }
          });

          map.current.on('mouseenter', 'sectors-layer', () => {
            map.current.getCanvas().style.cursor = 'pointer';
          });

          map.current.on('mouseleave', 'sectors-layer', () => {
            map.current.getCanvas().style.cursor = '';
          });

          map.current.on('click', 'sectors-layer', (e) => {
            const features = map.current.queryRenderedFeatures(e.point, {
              layers: ['sectors-layer']
            });
            if (!features.length) return;

            const feature = features[0];
            setSelectedCityInfo(feature); // Set selectedCityInfo instead of selectedCity and setIsEditorOpen
          });
        }
      };


      const handleCityUpdate = (updatedCity) => {
        // Debug log to see what's being passed
        console.log("Received updatedCity:", updatedCity);

        // Check if updatedCity and its properties exist
        if (!updatedCity || !updatedCity.properties) {
          console.error("updatedCity or its properties are undefined");
          return;
        }

        let updatedIndicadoresData = [...indicadoresData]; // Start with current indicators data

        if (updatedCity.newIndicator) {
          // Add new indicator
          updatedIndicadoresData = [...updatedIndicadoresData, updatedCity.newIndicator];
          delete updatedCity.newIndicator; // Clean up updatedCity object
        }

        if (updatedCity.deletedIndicator) {
          // Delete indicator
          updatedIndicadoresData = updatedIndicadoresData.filter(indicator =>
            !(
              indicator.Nome_Indicador === updatedCity.deletedIndicator.Nome_Indicador &&
              indicator.Ano_Observacao === updatedCity.deletedIndicator.Ano_Observacao &&
              indicator.Codigo_Municipio === updatedCity.deletedIndicator.Codigo_Municipio
            )
          );
          delete updatedCity.deletedIndicator; // Clean up updatedCity object
        }

        // Update GeoJSON features
        let updatedFeatures = geojsonData.features.map(feature => {
          if (!feature.properties) {
            console.error("Feature properties are undefined:", feature);
            return feature;
          }
          return feature.properties.CD_MUN === updatedCity.properties.CD_MUN ? updatedCity : feature;
        });

        setGeojsonData({ ...geojsonData, features: updatedFeatures });
        setIndicadoresData(updatedIndicadoresData); // Update indicadoresData state
        setSelectedCityInfo(null); // Close bottom bar after update - changed from setIsEditorOpen(false) and setSelectedCity(null)
      };

      const handleCityDelete = (cityToDelete) => {
        if (!cityToDelete || !cityToDelete.properties) {
          console.error("City to delete or its properties are undefined");
          return;
        }

        const cityCodeToDelete = cityToDelete.properties.CD_MUN || cityToDelete.properties.Codigo_Municipio || cityToDelete.properties.SETOR;

        // Filter out the deleted city from geojsonData.features
        const updatedGeojsonFeatures = geojsonData.features.filter(feature => {
          const featureCityCode = feature.properties.CD_MUN || feature.properties.Codigo_Municipio || feature.properties.SETOR;
          return featureCityCode !== cityCodeToDelete;
        });

        // Filter out the deleted city from csvData
        const updatedCsvData = csvData.filter(city => {
          return city.Codigo_Municipio !== cityCodeToDelete;
        });

        setGeojsonData({ ...geojsonData, features: updatedGeojsonFeatures });
        setCsvData(updatedCsvData);
        setFilteredCsvData(updatedCsvData); // Update filtered CSV data to reflect deletion
        setSelectedCityInfo(null); // Close bottom bar after delete - changed from setIsEditorOpen(false) and setSelectedCity(null)
        alert(`Cidade ${cityToDelete.properties.NAME || cityToDelete.properties.Nome_Municipio} excluída com sucesso!`);

        // Re-render map data with updated data
        loadMapData(updatedCsvData, colorAttribute);
      };


      const handleImportIndicators = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            Papa.parse(file, {
              header: true,
              delimiter: ';',
              complete: (results) => {
                if (results.data && results.data.length > 0) {
                  const newIndicators = results.data.filter(row => row.Codigo_Municipio && row.Nome_Indicador && row.Ano_Observacao && row.Valor && row.Indice_Posicional);

                  if (newIndicators.length > 0) {
                    const updatedIndicadoresData = [...indicadoresData, ...newIndicators];
                    setIndicadoresData(updatedIndicadoresData);

                    // No need to save to CSV file here, profile file will handle persistence
                    alert(`${newIndicators.length} indicadores importados com sucesso!`);
                  } else {
                    alert('Nenhum indicador válido encontrado no arquivo CSV.');
                  }
                } else {
                  alert('Nenhum dado encontrado no arquivo CSV.');
                }
              },
              error: (error) => {
                console.error('Erro ao processar CSV:', error);
                alert('Erro ao processar o arquivo CSV.');
              }
            });
          }
        };
        input.click();
      };

      const handleImportMunicipios = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            Papa.parse(file, {
              header: true,
              delimiter: ';',
              complete: (results) => {
                console.log("Resultados do Papa.parse:", results);

                if (results.data && results.data.length > 0) {
                  // Filtrar apenas municípios com dados completos
                  const newMunicipios = results.data.filter(row =>
                    row.Codigo_Municipio &&
                    row.Nome_Municipio &&
                    row.Sigla_Estado &&
                    row.Sigla_Regiao &&
                    row.Area_Municipio &&
                    row.Capital !== undefined &&
                    row.Longitude_Municipio &&
                    row.Latitude_Municipio
                  );

                  console.log("Municípios válidos encontrados:", newMunicipios.length);

                  if (newMunicipios.length > 0) {
                    // Criar uma nova cópia dos dados atuais e adicionar os novos
                    const updatedCsvData = [...csvData, ...newMunicipios];

                    // Atualizar os estados
                    setCsvData(updatedCsvData);
                    setFilteredCsvData(updatedCsvData);

                    console.log("Dados atualizados, total de municípios:", updatedCsvData.length);

                    // Carregar os dados no mapa diretamente com os dados atualizados
                    if (mapLoaded) {
                      console.log("Chamando loadMapData com os novos dados");
                      loadMapData(updatedCsvData, colorAttribute);
                    } else {
                      console.log("Mapa ainda não carregado");
                    }

                    alert(`${newMunicipios.length} municípios importados com sucesso!`);
                  } else {
                    alert('Nenhum município válido encontrado no arquivo CSV.');
                  }
                } else {
                  alert('Nenhum dado encontrado no arquivo CSV.');
                }
              },
              error: (error) => {
                console.error('Erro ao processar CSV:', error);
                alert('Erro ao processar o arquivo CSV.');
              }
            });
          }
        };
        input.click();
      };

      const handleSaveProfile = () => {
        const profileData = {
          municipios: csvData,
          indicadores: indicadoresData
        };
        const jsonProfile = JSON.stringify(profileData);
        const blob = new Blob([jsonProfile], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Solicita ao usuário para inserir o nome do arquivo
        const filename = prompt('Salvar perfil como:', 'city_profile.json');
        if (filename) {
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = filename; // Usa o nome de arquivo fornecido pelo usuário
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(url);
        } else {
          // Usuário cancelou ou não forneceu um nome de arquivo
          URL.revokeObjectURL(url); // Limpa a URL do objeto para evitar vazamentos de memória
        }
      };

      const handleLoadProfile = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json'; // Aceita apenas arquivos JSON
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const profile = JSON.parse(e.target.result);
                if (profile.municipios && profile.indicadores) {
                  setCsvData(profile.municipios);
                  setFilteredCsvData(profile.municipios);
                  setIndicadoresData(profile.indicadores);
                  if (mapLoaded) { // Only load map data if map is loaded
                    loadMapData(profile.municipios, colorAttribute);
                  }
                  alert('Perfil carregado com sucesso!');
                } else {
                  alert('Arquivo de perfil inválido.');
                }
              } catch (error) {
                console.error('Erro ao carregar o perfil:', error);
                alert('Erro ao carregar o arquivo de perfil.');
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
      };

      const handleFiltersApplied = (filteredData, selectedColorAttribute) => {
        console.log("Filtros aplicados no App:", filteredData.length, "cidades");
        console.log("Novo atributo de cor:", selectedColorAttribute);

        setFilteredCsvData(filteredData);
        setColorAttribute(selectedColorAttribute);

        // Reset visualization config when filters are applied
        setVisualizationConfig(null);
      };

      const handleVisualizationChange = (config) => {
        console.log("Configuração de visualização aplicada:", config);
        setVisualizationConfig(config);

        // Reload map data with the new visualization config
        if (mapLoaded) {
          loadMapData(filteredCsvData, config.type === 'attribute' ? config.attribute : 'visualization_value');
        }
      };

      useEffect(() => {
        if (mapLoaded) {
          loadMapData(filteredCsvData, colorAttribute);
        }
      }, [mapLoaded, filteredCsvData, colorAttribute]);

      const handleImportGeometry = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.geojson';
        input.onchange = async (event) => {
          const file = event.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const jsonData = JSON.parse(e.target.result);
              setGeometryImportData(jsonData); // Store the imported data
              setShowGeometryImportModal(true); // Show the modal
            } catch (error) {
              console.error('Erro ao processar arquivo JSON:', error);
              alert('Erro ao processar o arquivo JSON: ' + error.message);
            }
          };
          reader.readAsText(file);
        };
        input.click();
      };

      const processGeometryImport = () => {
        if (!geometryImportData || !municipalityCodeField || !geometryField) {
          alert('Por favor, selecione os campos de código do município e geometria.');
          return;
        }

        let features;

        // Check if the data is a FeatureCollection or a simple array
        if (geometryImportData.type === 'FeatureCollection') {
          features = geometryImportData.features;
        } else if (Array.isArray(geometryImportData)) {
          features = geometryImportData;
        } else {
          alert('Formato de dados inválido. Esperado um FeatureCollection ou um array.');
          return;
        }

        const processedFeatures = features.map(feature => {
          let cdMun = '';
          let geometry = null;

          // Check if it's a feature or a simple object
          if (feature.type === 'Feature') {
            cdMun = feature.properties?.[municipalityCodeField];
            geometry = feature.geometry;
          } else {
            cdMun = feature[municipalityCodeField];
            geometry = feature[geometryField];
          }

          console.log("Feature processing:", feature); // LOG: Inspect feature
          console.log("Extracted Geometry:", geometry); // LOG: Inspect geometry
          if (geometry) {
            console.log("Geometry Type:", geometry.type); // LOG: Geometry Type
            console.log("Geometry Coordinates:", geometry.coordinates); // LOG: Geometry Coordinates
          }


          if (!cdMun || !geometry) {
            console.warn('Feature sem código de município ou geometria encontrada:', feature);
            return null;
          }

          return {
            type: 'Feature',
            properties: {
              CD_MUN: cdMun,
              NAME: feature.properties?.NM_MUN || feature.properties?.NAME || `Município ${cdMun}`
            },
            geometry: geometry
          };
        }).filter(Boolean);

        const existingFeaturesMap = new Map(geojsonData.features.map(f => [f.properties.CD_MUN, f]));
        const updatedFeatures = [...geojsonData.features];
        let updatedCount = 0;
        let newCount = 0;

        processedFeatures.forEach(newFeature => {
          const cdMun = newFeature.properties.CD_MUN;
          if (existingFeaturesMap.has(cdMun)) {
            const existingFeatureIndex = updatedFeatures.findIndex(f => f.properties.CD_MUN === cdMun);
            updatedFeatures[existingFeatureIndex] = {
              ...updatedFeatures[existingFeatureIndex],
              geometry: newFeature.geometry
            };
            updatedCount++;
          } else {
            updatedFeatures.push(newFeature);
            newCount++;
          }
        });

        setGeojsonData({ type: 'FeatureCollection', features: updatedFeatures });
        setShowGeometryImportModal(false);
        setGeometryImportData(null);
        setMunicipalityCodeField('');
        setGeometryField('');
        alert(`Geometria dos municípios importada com sucesso!\n\n${updatedCount} municípios atualizados\n${newCount} novos municípios adicionados`);
      };

      const getGeometryFields = () => {
        if (!geometryImportData) return [];

        // Check if it's a FeatureCollection or a simple array
        if (geometryImportData.type === 'FeatureCollection') {
          const firstFeature = geometryImportData.features[0];
          if (firstFeature && firstFeature.geometry) {
            return ['geometry']; // If it's a standard GeoJSON, geometry is at the root
          }
        } else if (Array.isArray(geometryImportData)) {
          const firstObject = geometryImportData[0];
          if (firstObject) {
            return Object.keys(firstObject); // Return all keys from the first object
          }
        }
        return [];
      };

      const getPopupCoordinates = (feature) => {
        if (!feature || !feature.geometry) return [0, 0];

        const geometryType = feature.geometry.type;

        if (geometryType === 'Point') {
          return feature.geometry.coordinates;
        } else if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
          // For Polygons and MultiPolygons, return the centroid coordinates
          const centroid = d3.geoCentroid(feature.geometry);
          return centroid;
        } else {
          // Default to [0, 0] or handle other geometry types as needed
          console.warn(`Geometria não suportada para popup: ${geometryType}`);
          return [0, 0];
        }
      };

      const handleEnvironmentChange = (env) => {
        setActiveEnvironment(() => env); // Use functional update form
      };

      const handleCitySelectBottomBar = (selectedCity) => {
        if (selectedCity) {
          // Fly to the selected city's coordinates
          map.current.flyTo({
            center: [parseFloat(selectedCity.Longitude_Municipio), parseFloat(selectedCity.Latitude_Municipio)],
            zoom: 10, // You can adjust the zoom level
            duration: 2000 // Animation duration in milliseconds
          });
          setSelectedCityInfo({ properties: selectedCity }); // Update selected city info
        }
      };

      // Effect to handle clicks outside the bottom bar
      useEffect(() => {
        const handleClickOutsideBar = (event) => {
          if (selectedCityInfo && !event.target.closest('.city-info-bottom-bar')) {
            setSelectedCityInfo(null);
          }
        };

        document.addEventListener('mousedown', handleClickOutsideBar);
        return () => {
          document.removeEventListener('mousedown', handleClickOutsideBar);
        };
      }, [selectedCityInfo]);


      return (
        <div className="app-container">
          <div className="main-content">
            <div className="top-left-controls">
              <FilterMenu
                onImportIndicators={handleImportIndicators}
                onImportMunicipios={handleImportMunicipios}
                onImportGeometry={handleImportGeometry}
                onSaveProfile={handleSaveProfile}
                onLoadProfile={handleLoadProfile}
              />
            </div>

            <div className="top-right-controls">
              <VisualizationMenu
                csvData={csvData}
                indicadoresData={indicadoresData}
                onVisualizationChange={handleVisualizationChange}
                csvHeaders={csvHeaders}
                onFiltersApplied={handleFiltersApplied}
                onEnvironmentChange={handleEnvironmentChange} // Passa a função para mudar o ambiente
              />
            </div>


            <div ref={mapContainer} className="map-container">
              {isMapLoading && (
                <div className="map-loading">
                  <div className="loading-spinner"></div>
                  <p>Carregando mapa...</p>
                </div>
              )}
              {activeEnvironment === 'map' && ( // Renderiza o mapa apenas se o ambiente ativo for 'map'
                <Legend
                  colorAttribute={
                    visualizationConfig && visualizationConfig.type === 'indicator'
                      ? `${visualizationConfig.indicator} (${visualizationConfig.year}) - ${visualizationConfig.valueType === 'value' ? 'Valor' : 'Posição'}`
                      : colorAttribute
                  }
                  colorStops={legendColorStops}
                />
              )}
              {activeEnvironment === 'data' && (
                <DataVisualizationEnvironment
                  csvData={csvData}
                  indicadoresData={indicadoresData}
                />
              )}
              {activeEnvironment === 'etl' && (
                <ETLEnvironment />
              )}
            </div>

            {showGeometryImportModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Importar Geometria</h3>
                  <p>Selecione os campos correspondentes:</p>
                  <div className="form-group">
                    <label htmlFor="municipality-code-field">Campo do Código do Município:</label>
                    <select
                      id="municipality-code-field"
                      value={municipalityCodeField}
                      onChange={(e) => setMunicipalityCodeField(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {geometryImportData && geometryImportData.type === 'FeatureCollection' && geometryImportData.features[0] && Object.keys(geometryImportData.features[0].properties).map(key => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                      {geometryImportData && Array.isArray(geometryImportData) && Object.keys(geometryImportData[0]).map(key => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="geometry-field">Campo da Geometria:</label>
                    <select
                      id="geometry-field"
                      value={geometryField}
                      onChange={(e) => setGeometryField(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {getGeometryFields().map(key => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                    </select>
                  </div>
                  <div className="button-group">
                    <button className="import-button" onClick={processGeometryImport}>Importar</button>
                    <button className="cancel-button" onClick={() => {
                      setShowGeometryImportModal(false);
                      setGeometryImportData(null); // Clear data on cancel
                    }}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}
            <CityInfoBottomBar
              cityInfo={selectedCityInfo}
              onClose={() => setSelectedCityInfo(null)} // Function to close bottom bar
              cities={csvData} // Pass cities data to CityInfoBottomBar
              onCitySelect={handleCitySelectBottomBar} // Handler to select city from dropdown
              indicadoresData={indicadoresData} // Pass indicadoresData to CityInfoBottomBar
            />
          </div>

          <div className="app-footer">
            <div className="footer-info">
              <div className="coordinates">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
              </div>
            </div>
            <div className="footer-copyright">
              © {new Date().getFullYear()} Sistema de Informações de Muicípios
            </div>
          </div>
        </div>
      );
    }

    export default App;
