import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import Papa from 'papaparse';

// Importa dados CSV como strings raw
import municipiosCsvDataRaw from '../../data/municipios.csv?raw';
import indicadoresCsvDataRaw from '../../data/indicadores.csv?raw';

export const DataContext = createContext();

// Função de parsing de CSV (movida de App.jsx)
function parseCSVData(csvText) {
  if (!csvText || typeof csvText !== 'string') {
    console.warn("parseCSVData: input não é uma string válida ou está vazio.");
    return { headers: [], data: [] };
  }
  const lines = csvText.split('\n');
  if (lines.length === 0) {
    return { headers: [], data: [] };
  }
  const headers = lines[0].split(';');
  const trimmedHeaders = headers.map(header => header.trim());
  return {
    headers: trimmedHeaders,
    data: lines.slice(1).map(line => {
      const values = line.split(';');
      return trimmedHeaders.reduce((obj, header, index) => {
        obj[header] = values[index] ? values[index].trim() : '';
        return obj;
      }, {});
    }).filter(obj => obj[trimmedHeaders[0]] !== '') // Filtra linhas vazias baseadas na primeira coluna
  };
}

export const DataProvider = ({ children }) => {
  // Estados para os dados principais
  const { headers: initialCsvHeaders, data: initialCsvData } = useMemo(() => {
    console.log("[DataContext] Parsing initial municipios CSV...");
    return parseCSVData(municipiosCsvDataRaw);
  }, []);

  const [csvHeaders, setCsvHeaders] = useState(initialCsvHeaders);
  const [csvData, setCsvData] = useState(initialCsvData);
  const [filteredCsvData, setFilteredCsvData] = useState(initialCsvData); // Adicionado

  const [indicatorsHeaders, setIndicatorsHeaders] = useState([]);
  const [indicadoresData, setIndicadoresData] = useState([]);

  const [geojsonData, setGeojsonData] = useState({ type: 'FeatureCollection', features: [] });

  // Parsing inicial dos dados de indicadores
  useEffect(() => {
    console.log("[DataContext] Parsing initial indicadores CSV via useEffect...");
    try {
      if (!indicadoresCsvDataRaw) {
        console.warn("[DataContext] indicadoresCsvDataRaw não está disponível para parsing.");
        setIndicatorsHeaders([]);
        setIndicadoresData([]);
        return;
      }
      const result = parseCSVData(indicadoresCsvDataRaw);
      setIndicatorsHeaders(result?.headers || []);
      setIndicadoresData(result?.data || []);
      console.log("[DataContext] Finished parsing initial indicadores CSV.");
    } catch (error) {
      console.error("[DataContext] Error parsing initial indicadores CSV:", error);
      setIndicatorsHeaders([]);
      setIndicadoresData([]);
    }
  }, []);

  // Funções de importação/exportação e manipulação de dados (movidas e adaptadas de App.jsx)

  const handleImportIndicators = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.multiple = true;

    input.onchange = (event) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      let allNewIndicators = [];
      let filesProcessed = 0;
      let errors = [];

      Array.from(files).forEach(file => {
        Papa.parse(file, {
          header: true,
          delimiter: ';',
          skipEmptyLines: true,
          complete: (results) => {
            filesProcessed++;
            if (results.data && results.data.length > 0) {
              const validIndicators = results.data.filter(row =>
                row.Codigo_Municipio && row.Nome_Indicador && row.Ano_Observacao && row.Valor
              );
              allNewIndicators = allNewIndicators.concat(validIndicators);
            } else {
              console.warn(`[DataContext] Nenhum dado encontrado no arquivo: ${file.name}`);
            }

            if (filesProcessed === files.length) {
              if (allNewIndicators.length > 0) {
                setIndicadoresData(prevIndicadores => [...prevIndicadores, ...allNewIndicators]);
                alert(`${allNewIndicators.length} indicadores importados de ${files.length} arquivo(s). ${errors.length > 0 ? `Erros: ${errors.join(', ')}` : ''}`);
              } else {
                alert(`Nenhum indicador válido encontrado nos arquivos selecionados. ${errors.length > 0 ? `Erros: ${errors.join(', ')}` : ''}`);
              }
              if (errors.length > 0) console.error("[DataContext] Erros durante a importação de indicadores:", errors);
            }
          },
          error: (error) => {
            filesProcessed++;
            const errorMsg = `Erro ao processar ${file.name}: ${error.message}`;
            console.error(errorMsg);
            errors.push(errorMsg);
            if (filesProcessed === files.length) {
              alert(`Processamento concluído com erros. ${allNewIndicators.length} indicadores importados. Erros: ${errors.join(', ')}`);
              if (allNewIndicators.length > 0) {
                setIndicadoresData(prevIndicadores => [...prevIndicadores, ...allNewIndicators]);
              }
            }
          }
        });
      });
    };
    input.click();
  }, []);

  const handleImportMunicipios = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        Papa.parse(file, {
          header: true,
          delimiter: ';',
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              const newMunicipios = results.data.filter(row =>
                row.Codigo_Municipio && row.Nome_Municipio && row.Sigla_Estado &&
                row.Sigla_Regiao && row.Area_Municipio && row.Capital !== undefined &&
                row.Longitude_Municipio && row.Latitude_Municipio
              );
              if (newMunicipios.length > 0) {
                setCsvData(prevCsvData => {
                    const updated = [...prevCsvData, ...newMunicipios];
                    setFilteredCsvData(updated); // Atualiza filteredCsvData também
                    return updated;
                });
                alert(`${newMunicipios.length} municípios importados com sucesso!`);
                // Nota: A chamada loadMapData que estava aqui será tratada pelo MapContext/App.jsx
                // ao observar mudanças em filteredCsvData ou csvData.
              } else {
                alert('Nenhum município válido encontrado no arquivo CSV.');
              }
            } else {
              alert('Nenhum dado encontrado no arquivo CSV.');
            }
          },
          error: (error) => {
            console.error('[DataContext] Erro ao processar CSV de municípios:', error);
            alert('Erro ao processar o arquivo CSV de municípios.');
          }
        });
      }
    };
    input.click();
  }, []);

  const processGeometryImportInternal = useCallback((importedGeojsonData, municipalityCodeFieldForImport) => {
    // Esta função é chamada por handleImportGeometry após o modal.
    // A lógica de UI do modal (showGeometryImportModal, etc.) ficará no UIContext.
    if (!importedGeojsonData || !municipalityCodeFieldForImport) {
      alert('Dados de geometria ou campo de código do município ausentes.');
      return;
    }
    let features;
    if (importedGeojsonData.type === 'FeatureCollection') {
      features = importedGeojsonData.features;
    } else if (Array.isArray(importedGeojsonData)) {
      features = importedGeojsonData;
    } else {
      alert('Formato de dados de geometria inválido. Esperado um GeoJSON FeatureCollection ou array de Features.');
      return;
    }

    const processedFeatures = features.map(feature => {
      const properties = feature.properties;
      const geometry = feature.geometry;
      const cdMun = properties?.[municipalityCodeFieldForImport];
      if (!cdMun || !geometry) {
        console.warn('[DataContext] Feature sem código de município ou geometria encontrada:', feature);
        return null;
      }
      return {
        type: 'Feature',
        properties: { ...properties, CD_MUN: String(cdMun) },
        geometry: geometry
      };
    }).filter(Boolean);

    setGeojsonData(prevGeojsonData => {
      const existingFeaturesMap = new Map(prevGeojsonData.features.map(f => [String(f.properties.CD_MUN), f]));
      const updatedFeatures = [...prevGeojsonData.features];
      let updatedCount = 0;
      let newCount = 0;

      processedFeatures.forEach(newFeature => {
        const cdMun = String(newFeature.properties.CD_MUN);
        if (existingFeaturesMap.has(cdMun)) {
          const existingFeatureIndex = updatedFeatures.findIndex(f => String(f.properties.CD_MUN) === cdMun);
          if (existingFeatureIndex !== -1) {
            updatedFeatures[existingFeatureIndex] = {
              ...updatedFeatures[existingFeatureIndex],
              geometry: newFeature.geometry,
              properties: { ...updatedFeatures[existingFeatureIndex].properties, ...newFeature.properties }
            };
            updatedCount++;
          }
        } else {
          updatedFeatures.push(newFeature);
          newCount++;
        }
      });
      alert(`Geometria importada!
${updatedCount} municípios atualizados.
${newCount} novos adicionados.`);
      return { type: 'FeatureCollection', features: updatedFeatures };
    });
    // A chamada a loadMapData será feita em App.jsx/MapContext ao observar geojsonData.
  }, []);


  const handleSaveProfile = useCallback(() => {
    const profileData = {
      municipios: csvData,
      indicadores: indicadoresData,
      geometrias: geojsonData // Opcional: salvar geometrias também
    };
    const jsonProfile = JSON.stringify(profileData);
    const blob = new Blob([jsonProfile], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const filename = prompt('Salvar perfil como:', 'city_profile.json');
    if (filename) {
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    } else {
      URL.revokeObjectURL(url);
    }
  }, [csvData, indicadoresData, geojsonData]);

  const handleLoadProfile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const profile = JSON.parse(e.target.result);
            if (profile.municipios) {
              setCsvData(profile.municipios);
              setFilteredCsvData(profile.municipios); // Reset filtered data
            }
            if (profile.indicadores) {
              setIndicadoresData(profile.indicadores);
            }
            if (profile.geometrias) { // Carregar geometrias se existirem no perfil
              setGeojsonData(profile.geometrias);
            }
            alert('Perfil carregado com sucesso!');
            // A chamada loadMapData será feita em App.jsx/MapContext.
          } catch (error) {
            console.error('[DataContext] Erro ao carregar o perfil:', error);
            alert('Erro ao carregar o arquivo de perfil.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  // Função para atualizar filteredCsvData, antes parte de handleFiltersApplied em App.jsx
  // O segundo argumento (selectedColorAttribute) será gerenciado pelo UIContext.
  const applyFiltersToCsvData = useCallback((newFilteredData) => {
    console.log("[DataContext] Aplicando filtros, novo filteredCsvData:", newFilteredData.length);
    setFilteredCsvData(newFilteredData);
    // A lógica de setVisualizationConfig(null) que estava em App.jsx será chamada no UIContext
    // ou no componente que origina a ação de filtro.
  }, []);


  const value = {
    csvHeaders,
    csvData,
    setCsvData, // Para handleCityDelete, por exemplo
    filteredCsvData,
    setFilteredCsvData, // Para handleCityDelete ou diretamente
    applyFiltersToCsvData, // Nova função para ser chamada por UIContext/VisualizationMenu
    indicadoresHeaders,
    indicadoresData,
    setIndicadoresData, // Para handleCityUpdate, por exemplo
    geojsonData,
    setGeojsonData, // Para handleCityUpdate, por exemplo
    handleImportIndicators,
    handleImportMunicipios,
    processGeometryImportInternal, // A ser chamada por UIContext após modal
    handleSaveProfile,
    handleLoadProfile,
    parseCSVData // Exportar se App.jsx ainda precisar dela para algo temporário
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
