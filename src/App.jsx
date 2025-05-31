import React, { useContext, useEffect } from 'react'; // Removido useState, useRef
// import mapboxgl from 'mapbox-gl'; // Movido para MapContext
import FilterMenu from './components/FilterMenu';
import VisualizationMenu from './components/VisualizationMenu';
import Legend from './components/Legend';
import './index.css';

import DataVisualizationEnvironment from './components/DataVisualizationEnvironment';
import CityInfoBottomBar from './components/CityInfoBottomBar';
import ETLEnvironment from './components/ETLEnvironment';
import CitySearch from './components/CitySearch';
import DataSourceInfo from './components/DataSourceInfo';

import { DataProvider, DataContext } from './contexts/DataContext';
import { MapProvider, MapContext } from './contexts/MapContext';
import { UIProvider, UIContext } from './contexts/UIContext';

// AppContent agora é o componente principal que consome os contextos
function AppContent() {
  // Consumindo contextos
  const {
    applyFiltersToCsvData,
    processGeometryImportInternal, // Para handleImportGeometryInApp
    setIndicadoresData, // Para handleCityUpdateInApp
    setGeojsonData,     // Para handleCityUpdateInApp e handleCityDeleteInApp
    setCsvData,         // Para handleCityDeleteInApp
    setFilteredCsvData, // Para handleCityDeleteInApp
    csvData,            // Para handleCityDeleteInApp (para ler antes de filtrar)
    // geojsonData: currentGeojsonData, // Para ler antes de modificar, se necessário (opcional, setGeojsonData pode usar callback)
    // indicadoresData: currentIndicadoresData // Para ler antes de modificar, se necessário
  } = useContext(DataContext);

  const {
    mapContainer: contextMapContainerRef,
    mapLoaded,
    isMapLoading,
    lng, lat, zoom,
    flyToCity
  } = useContext(MapContext);

  const {
    activeEnvironment, // setActiveEnvironment é usado por VisualizationMenu
    showGeometryImportModal, setShowGeometryImportModal,
    municipalityCodeField, setMunicipalityCodeField,
    submitGeometryImport,
    openGeometryImportModal,
    selectedCityInfo, setSelectedCityInfo,
    // colorAttribute, // Usado por Legend diretamente do UIContext
    // visualizationConfig, // Usado por Legend diretamente do UIContext
    handleFilterSettingsChange,
  } = useContext(UIContext);

  // --- Handlers que coordenam ações entre contextos ---

  const handleFiltersAppliedInApp = (filteredDataFromMenu, selectedColorAttributeFromMenu) => {
    applyFiltersToCsvData(filteredDataFromMenu);
    handleFilterSettingsChange(selectedColorAttributeFromMenu);
  };

  const handleImportGeometryInApp = () => {
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
          openGeometryImportModal(jsonData);
        } catch (error) {
          console.error('Erro ao processar arquivo JSON:', error);
          alert('Erro ao processar o arquivo JSON: ' + error.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleCityUpdateInApp = (updatedCity) => {
    if (!updatedCity || !updatedCity.properties) {
      console.error("handleCityUpdateInApp: updatedCity ou suas propriedades são indefinidas.");
      return;
    }

    // Atualiza indicadoresData
    // Esta lógica de atualização de array pode ser complexa e idealmente viveria dentro do DataContext
    // como uma função de atualização mais específica se as modificações fossem mais granulares.
    // Por enquanto, estamos passando o array inteiro.
    setIndicadoresData(prevIndicadores => {
        let tempIndicadores = [...prevIndicadores];
        if (updatedCity.newIndicator) {
            tempIndicadores = [...tempIndicadores, updatedCity.newIndicator];
        }
        if (updatedCity.deletedIndicator) {
            tempIndicadores = tempIndicadores.filter(indicator =>
                !(indicator.Nome_Indicador === updatedCity.deletedIndicator.Nome_Indicador &&
                  indicator.Ano_Observacao === updatedCity.deletedIndicator.Ano_Observacao &&
                  indicator.Codigo_Municipio === updatedCity.deletedIndicator.Codigo_Municipio)
            );
        }
        // Limpa as propriedades temporárias do objeto updatedCity
        // É importante que o objeto `updatedCity` não contenha mais `newIndicator` ou `deletedIndicator`
        // quando for usado para atualizar `geojsonData` para evitar poluir as propriedades do GeoJSON.
        delete updatedCity.newIndicator;
        delete updatedCity.deletedIndicator;
        return tempIndicadores;
    });

    // Atualiza geojsonData
    setGeojsonData(prevGeojsonData => {
        const updatedFeatures = prevGeojsonData.features.map(feature =>
          (feature.properties.CD_MUN || feature.properties.Codigo_Municipio) === updatedCity.properties.CD_MUN
            ? updatedCity // Assume que updatedCity é uma feature GeoJSON completa e correta
            : feature
        );
        return { ...prevGeojsonData, features: updatedFeatures };
    });

    setSelectedCityInfo(null); // Fecha o CityInfoBottomBar
  };

  const handleCityDeleteInApp = (cityToDelete) => {
    if (!cityToDelete || !cityToDelete.properties) {
      console.error("handleCityDeleteInApp: cityToDelete ou suas propriedades são indefinidas.");
      return;
    }
    const cityCodeToDelete = cityToDelete.properties.CD_MUN || cityToDelete.properties.Codigo_Municipio;

    // Atualiza geojsonData
    setGeojsonData(prevGeojsonData => ({
      ...prevGeojsonData,
      features: prevGeojsonData.features.filter(feature =>
        (feature.properties.CD_MUN || feature.properties.Codigo_Municipio) !== cityCodeToDelete
      )
    }));

    // Atualiza csvData e filteredCsvData
    // É importante que setFilteredCsvData seja chamado após setCsvData se houver dependência
    // ou, idealmente, que DataContext gerencie essa sincronia.
    const updatedCsv = csvData.filter(city => city.Codigo_Municipio !== cityCodeToDelete);
    setCsvData(updatedCsv);
    setFilteredCsvData(updatedCsv); // Garante que os dados filtrados reflitam a exclusão

    setSelectedCityInfo(null); // Fecha o CityInfoBottomBar
    alert(`Cidade ${cityToDelete.properties.NAME || cityToDelete.properties.Nome_Municipio} excluída com sucesso!`);
    // loadMapData no MapContext será acionado reativamente devido à mudança em filteredCsvData.
  };

  const handleCitySelectBottomBarInApp = (selectedCityData) => {
    if (selectedCityData) {
        const cityCoords = {
            lat: parseFloat(selectedCityData.Latitude_Municipio || selectedCityData.properties?.LATITUDE),
            lng: parseFloat(selectedCityData.Longitude_Municipio || selectedCityData.properties?.LONGITUDE)
        };
        if (!isNaN(cityCoords.lat) && !isNaN(cityCoords.lng)) {
            flyToCity(cityCoords);
        }
        // Assegura que selectedCityInfo tenha a estrutura {properties: ...}
        const cityInfoForBar = selectedCityData.properties ? selectedCityData : { properties: selectedCityData };
        setSelectedCityInfo(cityInfoForBar);
    }
  };

  const handleCitySearchSelectInApp = (city) => {
    flyToCity(city);
  };

  // useEffect para clique fora do CityInfoBottomBar
  useEffect(() => {
    const handleClickOutsideBar = (event) => {
      if (selectedCityInfo && !event.target.closest('.city-info-bottom-bar')) {
        setSelectedCityInfo(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideBar);
    return () => document.removeEventListener('mousedown', handleClickOutsideBar);
  }, [selectedCityInfo, setSelectedCityInfo]);

  // --- Renderização ---
  return (
      <div className="app-container">
        <div className="main-content">
          <div className="top-left-controls">
            <FilterMenu onImportGeometry={handleImportGeometryInApp} />
          </div>

          <div className="top-right-controls">
            <VisualizationMenu onFiltersApplied={handleFiltersAppliedInApp} />
          </div>

          {activeEnvironment === 'map' && (
            <CitySearch onCitySelect={handleCitySearchSelectInApp} />
          )}

          <div className="main-content-area">
            {activeEnvironment === 'map' ? (
              <div ref={contextMapContainerRef} className="map-container">
                {isMapLoading && (
                  <div className="map-loading">
                    <div className="loading-spinner"></div><p>Carregando mapa...</p>
                  </div>
                )}
                {mapLoaded && <Legend />}
              </div>
            ) : activeEnvironment === 'data' ? (
              <DataVisualizationEnvironment />
            ) : activeEnvironment === 'dataSourceInfo' ? (
              <DataSourceInfo />
            ) : activeEnvironment === 'etl' ? (
               <ETLEnvironment />
            ) : null}
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
                    {/* TODO: Popular esta lista dinamicamente com base nas chaves do geometryImportData.features[0].properties
                        Este estado (geometryImportData) está no UIContext. O modal, se fosse um componente separado,
                        poderia acessá-lo diretamente. Como está em AppContent, precisaria de acesso a geometryImportData do UIContext.
                        Por simplicidade neste passo, o select pode ficar vazio ou com placeholders se a lógica de popular não for trivial aqui.
                        A lógica principal de `submitGeometryImport` já está no UIContext.
                    */}
                  </select>
                </div>
                <div className="button-group">
                  <button className="import-button" onClick={submitGeometryImport}>Importar</button>
                  <button className="cancel-button" onClick={() => setShowGeometryImportModal(false) }>Cancelar</button>
                </div>
              </div>
            </div>
          )}
          {selectedCityInfo && (
            <CityInfoBottomBar
                onCitySelect={handleCitySelectBottomBarInApp}
                // As props cityInfo e onClose são gerenciadas internamente pelo CityInfoBottomBar via UIContext
                // Adicionado handleCityUpdateInApp e handleCityDeleteInApp como props
                // Estas funções precisam ser passadas se CityInfoBottomBar (ou seus filhos como CityEditor) as chamarem.
                // No entanto, o ideal seria que CityEditor consumisse os setters dos contextos diretamente.
                // Para este passo, vamos assumir que CityInfoBottomBar NÃO chama diretamente update/delete.
                // Se chamasse, teríamos que passá-las:
                // onCityUpdate={handleCityUpdateInApp}
                // onCityDelete={handleCityDeleteInApp}
            />
          )}
        </div>

        <div className="app-footer">
          <div className="footer-info">
            <div className="coordinates">Longitude: {lng.toFixed(4)} | Latitude: {lat.toFixed(4)} | Zoom: {zoom.toFixed(2)}</div>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} Sistema de Informações de Muicípios por Eduardo Matheus Figueira
          </div>
        </div>
      </div>
  );
}

// Componente App agora só configura os providers
function App() {
  return (
    <DataProvider>
      <UIProvider>
        <MapProvider>
          <AppContent />
        </MapProvider>
      </UIProvider>
    </DataProvider>
  );
}

export default App;
