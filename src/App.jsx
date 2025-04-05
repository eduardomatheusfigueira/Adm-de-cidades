import React, { useRef, useEffect, useState, useMemo } from 'react'; // Import useMemo
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
    import CitySearch from './components/CitySearch'; // Import the new CitySearch component

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

    // Remove initial parsing from outside the component

    function App() {
      // Calculate headers and initial data inside the component using useMemo
      const { headers: csvHeaders, data: initialCsvData } = useMemo(() => {
        console.log("Parsing initial municipios CSV...");
        return parseCSVData(municipiosCsvData);
      }, []); // Empty dependency array ensures this runs only once

      const { headers: indicadoresHeaders = [], data: initialIndicadoresData = [] } = useMemo(() => {
        console.log("Parsing initial indicadores CSV...");
        const result = parseCSVData(indicadoresCsvData);
        // Ensure result and headers exist before returning, provide defaults
        return { headers: result?.headers || [], data: result?.data || [] };
      }, []); // Empty dependency array ensures this runs only once

      // Log initial parsed data (now inside the component)
      useEffect(() => {
        console.log("App.jsx Initial Parse: csvHeaders", csvHeaders);
        console.log("App.jsx Initial Parse: initialCsvData", initialCsvData?.length); // Log length only initially
        console.log("App.jsx Initial Parse: indicadoresHeaders", indicadoresHeaders);
        console.log("App.jsx Initial Parse: initialIndicadoresData", initialIndicadoresData?.length); // Log length only initially
      }, [csvHeaders, initialCsvData, indicadoresHeaders, initialIndicadoresData]); // Run log when these values are calculated
      const mapContainer = useRef(null);
      const map = useRef(null);
      const [lng, setLng] = useState(-54.57);
      const [lat, setLat] = useState(-25.53);
      const [zoom, setZoom] = useState(12);
      const [geojsonData, setGeojsonData] = useState({ type: 'FeatureCollection', features: [] }); // Initialize empty
      const [selectedCityInfo, setSelectedCityInfo] = useState(null); // Use selectedCityInfo instead of selectedCity and isEditorOpen
      const [csvData, setCsvData] = useState(initialCsvData);
      const [filteredCsvData, setFilteredCsvData] = useState(initialCsvData);
      const [indicadoresData, setIndicadoresData] = useState(initialIndicadoresData || []); // Initialize state with parsed data
      const [mapLoaded, setMapLoaded] = useState(false);
      const [isMapLoading, setIsMapLoading] = useState(true);
      const [colorAttribute, setColorAttribute] = useState('Sigla_Regiao'); // Default color attribute
      const [legendColorStops, setLegendColorStops] = useState([]);
      const [showGeometryImportModal, setShowGeometryImportModal] = useState(false);
      const [geometryImportData, setGeometryImportData] = useState(null);
      const [municipalityCodeField, setMunicipalityCodeField] = useState('');
      // const [geometryField, setGeometryField] = useState(''); // Removed: Unnecessary for standard GeoJSON
      const [visualizationConfig, setVisualizationConfig] = useState(null);
      const [activeEnvironment, setActiveEnvironment] = useState('map'); // 'map', 'data', or 'etl'


      // Function to update the map when geojsonData changes
      const updateMapData = () => {
        if (map.current && map.current.getSource('sectors')) {
          map.current.getSource('sectors').setData(geojsonData);
        }
      };

      // Update map when geojsonData changes - REMOVED - Let loadMapData handle updates
      // useEffect(() => {
      //   updateMapData();
      // }, [geojsonData]);

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
        if (mapLoaded && filteredCsvData) { // Ensure filteredCsvData is also available
          console.log("[App.jsx] useEffect [mapLoaded, filteredCsvData, colorAttribute, visualizationConfig] triggered"); // Log trigger
          let currentAttribute = colorAttribute; // Default to the state set by filters
          console.log(`[App.jsx] Initial currentAttribute (from state): ${currentAttribute}`);

          if (visualizationConfig) {
            console.log("[App.jsx] visualizationConfig exists:", visualizationConfig); // Log visualizationConfig content
            if (visualizationConfig.type === 'indicator') {
              currentAttribute = 'visualization_value'; // Use special value for indicators
              console.log(`[App.jsx] Changed currentAttribute to 'visualization_value' for indicator`);
            } else if (visualizationConfig.type === 'attribute') {
              currentAttribute = visualizationConfig.attribute; // Use the attribute from the visualization config
              console.log(`[App.jsx] Changed currentAttribute to '${currentAttribute}' from visualizationConfig`);
            }
          } else {
            console.log("[App.jsx] visualizationConfig is null, using colorAttribute from state.");
          }
          console.log("[App.jsx] Final currentAttribute for loadMapData:", currentAttribute); // Log final attribute before calling loadMapData
          loadMapData(filteredCsvData, currentAttribute);
        }
      }, [mapLoaded, filteredCsvData, colorAttribute, visualizationConfig]); // Dependencies remain the same


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

        // Create a map of current CSV data for efficient lookup
        const csvDataMap = new Map(currentCsvData.map(city => [String(city.Codigo_Municipio), city]));

        // Filter existing features based on currentCsvData and update properties
        let polygonCount = 0;
        let pointCount = 0;
        const updatedExistingFeatures = geojsonData.features
          .map(feature => {
            // Ensure properties and CD_MUN exist
            if (!feature.properties || feature.properties.CD_MUN === undefined || feature.properties.CD_MUN === null) {
              console.warn("Feature missing properties or CD_MUN:", feature);
              return null; // Skip features without a code
            }
            // Ensure geometry exists
            if (!feature.geometry) {
              console.warn("Feature missing geometry:", feature);
              return null; // Skip features without geometry
            }
            const cdMun = String(feature.properties.CD_MUN);
            const cityData = csvDataMap.get(cdMun);

            if (!cityData) {
              // console.log(`Feature ${cdMun} not in current CSV data, removing.`);
              return null; // Remove feature if not in current CSV data (filtered out)
            }

            // Update properties from CSV, keeping existing geometry
            const lon = parseFloat(cityData.Longitude_Municipio);
            const lat = parseFloat(cityData.Latitude_Municipio);

            const properties = {
              ...feature.properties, // Keep existing properties (like NAME from GeoJSON if needed)
              ...cityData, // Overwrite with potentially updated CSV data
              CD_MUN: cdMun, // Ensure consistent key
              NAME: cityData.Nome_Municipio, // Prioritize CSV name
              LEVEL: 'Municípios',
              AREA: parseFloat(cityData.Area_Municipio),
              CAPITAL: cityData.Capital === 'true',
              ESTADO: cityData.Sigla_Estado,
              ALTITUDE: parseFloat(cityData.Altitude_Municipio),
              LONGITUDE: lon,
              LATITUDE: lat,
              REGIAO: cityData.Sigla_Regiao,
              custom_description: `Dados CSV: ${cityData.Nome_Municipio}, Estado: ${cityData.Sigla_Estado}`
            };

            // Add indicator data if visualization config is for indicators
            if (visualizationConfig && visualizationConfig.type === 'indicator') {
              const { year, indicator, valueType } = visualizationConfig;
              const cityIndicator = indicadoresData.find(ind =>
                String(ind.Codigo_Municipio) === cdMun && // Use cdMun (string) for matching
                ind.Ano_Observacao === year &&
                ind.Nome_Indicador === indicator
              );

              if (cityIndicator) {
                properties.indicator_value = parseFloat(cityIndicator.Valor);
                properties.indicator_position = parseFloat(cityIndicator.Indice_Posicional);
                properties.indicator_name = indicator;
                properties.indicator_year = year;
                properties.visualization_value = valueType === 'value'
                  ? properties.indicator_value
                  : properties.indicator_position;
              } else {
                properties.visualization_value = null; // Ensure reset if indicator not found
              }
            } else if (currentAttribute !== 'visualization_value') {
               // Ensure visualization_value is cleared if not visualizing indicators
               delete properties.visualization_value;
            }

            // Log geometry type for debugging
            if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
              polygonCount++;
            } else if (feature.geometry.type === 'Point') {
              pointCount++;
            }

            return {
              ...feature, // Keep existing feature structure (including geometry)
              properties: properties
            };
          })
          .filter(Boolean); // Remove null entries (features not in currentCsvData or missing code)

        // Identify new cities from CSV data that are not in existing features
        const existingFeatureCodes = new Set(updatedExistingFeatures.map(f => String(f.properties.CD_MUN)));
        const newCitiesFeatures = currentCsvData
          .filter(city => {
            const cdMun = String(city.Codigo_Municipio);
            return !existingFeatureCodes.has(cdMun); // Filter cities already processed
          })
          .map(city => {
            const lon = parseFloat(city.Longitude_Municipio);
            const lat = parseFloat(city.Latitude_Municipio);

            if (isNaN(lon) || isNaN(lat) || lon === 0 || lat === 0) {
              return null; // Skip cities with invalid coordinates
            }

            const properties = {
              CD_MUN: String(city.Codigo_Municipio),
              NAME: city.Nome_Municipio,
              LEVEL: 'Municípios',
              AREA: parseFloat(city.Area_Municipio),
              CAPITAL: city.Capital === 'true',
              ESTADO: city.Sigla_Estado,
              ALTITUDE: parseFloat(city.Altitude_Municipio),
              LONGITUDE: lon,
              LATITUDE: lat,
              REGIAO: city.Sigla_Regiao,
              ...city, // Include other CSV properties
              custom_description: `Dados CSV: ${city.Nome_Municipio}, Estado: ${city.Sigla_Estado}`
            };

            // Add indicator data for new cities as well
            if (visualizationConfig && visualizationConfig.type === 'indicator') {
              const { year, indicator, valueType } = visualizationConfig;
              const cityIndicator = indicadoresData.find(ind =>
                ind.Codigo_Municipio === properties.CD_MUN &&
                ind.Ano_Observacao === year &&
                ind.Nome_Indicador === indicator
              );
              if (cityIndicator) {
                properties.indicator_value = parseFloat(cityIndicator.Valor);
                properties.indicator_position = parseFloat(cityIndicator.Indice_Posicional);
                properties.indicator_name = indicator;
                properties.indicator_year = year;
                properties.visualization_value = valueType === 'value' ? properties.indicator_value : properties.indicator_position;
              } else {
                properties.visualization_value = null;
              }
            }

            return {
              type: 'Feature',
              properties,
              geometry: {
                type: 'Point', // New cities are always points initially
                coordinates: [lon, lat]
              }
            };
          })
          .filter(Boolean); // Remove null entries (invalid coordinates)

        // Combine updated existing features and new features
        console.log(`Processed existing features - Polygons: ${polygonCount}, Points: ${pointCount}`);
        const finalFeatures = [...updatedExistingFeatures, ...newCitiesFeatures];
        console.log("Final features count for map:", finalFeatures.length);

        // Convert CSV data to GeoJSON Features (OLD LOGIC - REMOVED)
        /*
        });

        */

        const combinedGeoJson = {
          type: 'FeatureCollection',
          features: finalFeatures // Use the merged features list
        };

        // setGeojsonData(combinedGeoJson); // State update should happen before calling loadMapData - NO, state is updated elsewhere (on import, on filter)
        // This function just PREPARES the data for the map source based on current state

        const attributeValues = finalFeatures.map(feature => feature.properties[currentAttribute]).filter(value => value !== undefined && value !== null);
        const colorScale = getColorScale(currentAttribute, attributeValues);

        if (map.current.getSource('sectors')) {
          // Source exists, update its data and paint properties
          map.current.getSource('sectors').setData(combinedGeoJson); // ALWAYS update data

          // Update paint property for the fill layer
          if (map.current.getLayer('sectors-fill-layer')) {
            map.current.setPaintProperty('sectors-fill-layer', 'fill-color', colorScale);
          }
          // Also update the point layer if it exists (for fallback)
          if (map.current.getLayer('sectors-point-layer')) {
            map.current.setPaintProperty('sectors-point-layer', 'circle-color', colorScale);
          }
        } else {
          map.current.addSource('sectors', {
            type: 'geojson',
            data: combinedGeoJson
          });

          // Add a fill layer for polygons/multipolygons
          map.current.addLayer({
            id: 'sectors-fill-layer',
            type: 'fill',
            source: 'sectors',
            filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']], // Only apply to polygons
            layout: {},
            paint: {
              'fill-color': colorScale, // Apply color scale here
              'fill-opacity': 0.6,
              'fill-outline-color': '#000', // Add an outline
            }
          });

          // Add a circle layer as fallback for points (cities without imported geometry)
          map.current.addLayer({
            id: 'sectors-point-layer',
            type: 'circle',
            source: 'sectors',
            filter: ['==', ['geometry-type'], 'Point'], // Only apply to points
            layout: {},
            paint: {
              'circle-radius': 5,
              'circle-color': colorScale, // Apply color scale here
              'circle-opacity': 0.7
            }
          });

          // Event listeners for both layers
          const layers = ['sectors-fill-layer', 'sectors-point-layer'];

          layers.forEach(layerId => {
            map.current.on('mouseenter', layerId, () => {
              map.current.getCanvas().style.cursor = 'pointer';
            });

            map.current.on('mouseleave', layerId, () => {
              map.current.getCanvas().style.cursor = '';
            });

            map.current.on('click', layerId, (e) => {
              // Prevent click event from firing multiple times if layers overlap
              e.preventDefault();

              const features = map.current.queryRenderedFeatures(e.point, {
                layers: [layerId]
              });
              if (!features.length) return;

              const feature = features[0];
              setSelectedCityInfo(feature);
            });
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
        if (!geometryImportData || !municipalityCodeField) {
          alert('Por favor, selecione o campo de código do município.');
          return;
        }
        let features;
    
        // Check if the data is a FeatureCollection or a simple array
        if (geometryImportData.type === 'FeatureCollection') {
          features = geometryImportData.features;
        } else if (Array.isArray(geometryImportData)) {
          features = geometryImportData;
        } else { // Assume FeatureCollection as primary format
          alert('Formato de dados inválido. Esperado um GeoJSON FeatureCollection.');
          return;
        }
    
        const processedFeatures = features.map(feature => {
          // Standard GeoJSON structure assumed
          const properties = feature.properties;
          const geometry = feature.geometry;
          const cdMun = properties?.[municipalityCodeField];
    
          // Original logic for non-standard features (kept for potential fallback, but less likely needed)
          /*
    
          // Check if it's a feature or a simple object
          if (feature.type === 'Feature') {
            cdMun = feature.properties?.[municipalityCodeField];
            geometry = feature.geometry;
          } else {
            cdMun = feature[municipalityCodeField];
            geometry = feature[geometryField];
          }
          */
    
          // console.log("Feature processing:", feature); // LOG: Inspect feature
          // console.log("Extracted Geometry:", geometry); // LOG: Inspect geometry
          if (!cdMun || !geometry) {
            console.warn('Feature sem código de município ou geometria encontrada:', feature);
            return null;
          }
    
          return {
            type: 'Feature',
            properties: {
              CD_MUN: String(cdMun), // Ensure code is string for consistent matching
              // Keep original properties, but ensure CD_MUN is present
              ...properties
            },
            geometry: geometry
          };
        }).filter(Boolean);

        // Ensure existing feature codes are also strings for matching
        const existingFeaturesMap = new Map(geojsonData.features.map(f => [String(f.properties.CD_MUN), f]));
        const updatedFeatures = [...geojsonData.features];
        let updatedCount = 0;
        let newCount = 0;
    
        processedFeatures.forEach(newFeature => {
          const cdMun = String(newFeature.properties.CD_MUN); // Ensure string for matching
          if (existingFeaturesMap.has(cdMun)) {
            const existingFeatureIndex = updatedFeatures.findIndex(f => String(f.properties.CD_MUN) === cdMun);
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

        const newGeoJsonData = { type: 'FeatureCollection', features: updatedFeatures };
        setGeojsonData(newGeoJsonData); // Update state first
        setShowGeometryImportModal(false);
        setGeometryImportData(null);
        setMunicipalityCodeField(''); // Reset code field
        // setGeometryField(''); // Removed
        alert(`Geometria importada!\n${updatedCount} municípios atualizados.\n${newCount} novos adicionados (como pontos).`);

        // Trigger map update via state change. The useEffect watching geojsonData will handle it.
        // Removing explicit call: loadMapData(filteredCsvData, colorAttribute);
      };

      // Removed getGeometryFields function as it's no longer needed

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

      // Handler for when a city is selected in the search box
      const handleCitySearchSelect = (city) => {
        console.log("City selected via search:", city);
        if (map.current && city.lat && city.lng) {
          map.current.flyTo({
            center: [city.lng, city.lat],
            zoom: 12, // Zoom level after flying to the city
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
          });
          // Optionally, select the city to show its info (using existing handler)
          // Find the full feature if needed, or create a minimal one
          const minimalFeature = {
            properties: {
              CD_MUN: city.code,
              NAME: city.name,
              // Add other properties if CityInfoBottomBar expects them
            },
            geometry: {
              type: 'Point',
              coordinates: [city.lng, city.lat]
            }
          };
          // setSelectedCityInfo(minimalFeature); // Uncomment if you want the bottom bar to open
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

            {/* City Search Component - Rendered only when map is active */}
            {activeEnvironment === 'map' && (
              <CitySearch
                cities={csvData} // Pass all cities for searching (or filteredCsvData if preferred)
                onCitySelect={handleCitySearchSelect} // Use the new handler
              />
            )}

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
                <ETLEnvironment
                  initialMunicipalitiesData={filteredCsvData} // Pass filtered data
                  initialIndicatorsData={indicadoresData}     // Pass indicator data
                  municipalitiesHeaders={csvHeaders}          // Pass municipality headers
                  indicatorsHeaders={indicatorsHeaders}      // Pass indicator headers
                />
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
                  {/* Geometry field selection removed */}
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
