import React, { useContext, useEffect } from 'react';
import FilterMenu from './components/FilterMenu';
import VisualizationMenu from './components/VisualizationMenu';
import Legend from './components/Legend';
import './index.css';

import DataVisualizationEnvironment from './components/DataVisualizationEnvironment';
import CityInfoBottomBar from './components/CityInfoBottomBar';
import ETLEnvironment from './components/ETLEnvironment';
import CitySearch from './components/CitySearch';
import DataSourceInfo from './components/DataSourceInfo';
import MainLayout from './components/MainLayout';

import { DataProvider, DataContext } from './contexts/DataContext';
import { MapProvider, MapContext } from './contexts/MapContext';
import { UIProvider, UIContext } from './contexts/UIContext';

function AppContent() {
  const {
    applyFiltersToCsvData,
    setIndicadoresData,
    setGeojsonData,
    setCsvData,
    setFilteredCsvData,
    csvData,
    indicadoresData,
  } = useContext(DataContext);

  const {
    mapContainer: contextMapContainerRef,
    mapLoaded,
    isMapLoading,
    lng, lat, zoom,
    flyToCity
  } = useContext(MapContext);

  const {
    activeEnvironment,
    showGeometryImportModal, setShowGeometryImportModal,
    municipalityCodeField, setMunicipalityCodeField,
    submitGeometryImport,
    openGeometryImportModal,
    selectedCityInfo, setSelectedCityInfo,
    handleFilterSettingsChange,
    geometryPropertyKeys, // Get keys from context
  } = useContext(UIContext);

  // --- Handlers ---
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
    if (!updatedCity || !updatedCity.properties) return;

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
      delete updatedCity.newIndicator;
      delete updatedCity.deletedIndicator;
      return tempIndicadores;
    });

    setGeojsonData(prevGeojsonData => {
      const updatedFeatures = prevGeojsonData.features.map(feature =>
        (feature.properties.CD_MUN || feature.properties.Codigo_Municipio) === updatedCity.properties.CD_MUN
          ? updatedCity
          : feature
      );
      return { ...prevGeojsonData, features: updatedFeatures };
    });

    setSelectedCityInfo(null);
  };

  const handleCityDeleteInApp = (cityToDelete) => {
    if (!cityToDelete || !cityToDelete.properties) return;
    const cityCodeToDelete = cityToDelete.properties.CD_MUN || cityToDelete.properties.Codigo_Municipio;

    setGeojsonData(prevGeojsonData => ({
      ...prevGeojsonData,
      features: prevGeojsonData.features.filter(feature =>
        (feature.properties.CD_MUN || feature.properties.Codigo_Municipio) !== cityCodeToDelete
      )
    }));

    const updatedCsv = csvData.filter(city => city.Codigo_Municipio !== cityCodeToDelete);
    setCsvData(updatedCsv);
    setFilteredCsvData(updatedCsv);

    setSelectedCityInfo(null);
    alert(`Cidade ${cityToDelete.properties.NAME || cityToDelete.properties.Nome_Municipio} excluída com sucesso!`);
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
      const cityInfoForBar = selectedCityData.properties ? selectedCityData : { properties: selectedCityData };
      setSelectedCityInfo(cityInfoForBar);
    }
  };

  const handleCitySearchSelectInApp = (city) => {
    flyToCity(city);
  };

  useEffect(() => {
    const handleClickOutsideBar = (event) => {
      if (selectedCityInfo && !event.target.closest('.city-info-bottom-bar')) {
        setSelectedCityInfo(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideBar);
    return () => document.removeEventListener('mousedown', handleClickOutsideBar);
  }, [selectedCityInfo, setSelectedCityInfo]);

  return (
    <MainLayout>
      {/* Map Environment Specifics */}
      {/* Map Environment Specifics - ALWAYS MOUNTED, HIDDEN WHEN INACTIVE */}
      <div style={{ display: activeEnvironment === 'map' ? 'block' : 'none', height: '100%', width: '100%', position: 'relative' }}>
        <div className="top-left-controls">
          <FilterMenu onImportGeometry={handleImportGeometryInApp} />
        </div>
        <div className="top-right-controls">
          <VisualizationMenu onFiltersApplied={handleFiltersAppliedInApp} />
        </div>
        <CitySearch onCitySelect={handleCitySearchSelectInApp} />
        <div ref={contextMapContainerRef} className="map-container">
          {isMapLoading && (
            <div className="map-loading">
              <div className="loading-spinner"></div><p>Carregando mapa...</p>
            </div>
          )}
          {mapLoaded && <Legend />}
        </div>
      </div>

      {/* Other Environments */}
      {activeEnvironment === 'data' && <DataVisualizationEnvironment />}
      {activeEnvironment === 'dataSourceInfo' && <DataSourceInfo />}
      {activeEnvironment === 'etl' && <ETLEnvironment />}

      {/* Modals and Overlays */}
      {showGeometryImportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Importar Geometria</h3>
            <div className="form-group">
              <label htmlFor="municipality-code-field">Campo do Código do Município:</label>
              <select
                id="municipality-code-field"
                value={municipalityCodeField}
                onChange={(e) => setMunicipalityCodeField(e.target.value)}
              >
                <option value="">Selecione...</option>
                {geometryPropertyKeys && geometryPropertyKeys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <div className="button-group">
              <button className="import-button" onClick={submitGeometryImport}>Importar</button>
              <button className="cancel-button" onClick={() => setShowGeometryImportModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {selectedCityInfo && (
        <CityInfoBottomBar
          cityInfo={selectedCityInfo}
          onClose={() => setSelectedCityInfo(null)}
          cities={csvData}
          onCitySelect={handleCitySelectBottomBarInApp}
          indicadoresData={indicadoresData}
        />
      )}
    </MainLayout>
  );
}

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
