import React, { Suspense, lazy, useContext, useEffect, useState } from 'react';
import { Image as ImageIcon, SlidersHorizontal } from 'lucide-react';
import MapPanel from './components/MapPanel';
import Legend from './components/Legend';
import AnnotationToolbar from './components/AnnotationToolbar';
import AnnotationLegend from './components/AnnotationLegend';
import NorthArrow from './components/NorthArrow';
import ScaleBar from './components/ScaleBar';
import Graticule from './components/Graticule';
import './index.css';

import DataWizard from './components/DataWizard';
import DataSourceInfo from './components/DataSourceInfo';
import MainLayout from './components/MainLayout';
import AutoSave from './components/AutoSave';
import InAppBrowserNotice from './components/InAppBrowserNotice';

// Carregados só quando usados (o app abre mais rápido, principalmente no celular)
const ImageExportStudio = lazy(() => import('./components/ImageExportStudio'));
const DataVisualizationEnvironment = lazy(() => import('./components/DataVisualizationEnvironment'));
const ETLEnvironment = lazy(() => import('./components/ETLEnvironment'));
const CityInfoBottomBar = lazy(() => import('./components/CityInfoBottomBar'));

const LazyFallback = () => (
  <div className="map-loading" style={{ position: 'fixed', zIndex: 3000 }}>
    <div className="loading-spinner"></div><p>Carregando…</p>
  </div>
);

import { DataProvider, DataContext } from './contexts/DataContext';
import { MapProvider, MapContext } from './contexts/MapContext';
import { UIProvider, UIContext } from './contexts/UIContext';
import { AnnotationProvider } from './contexts/AnnotationContext';

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
    flyToCity,
    mapNotice, setMapNotice,
  } = useContext(MapContext);

  const {
    activeEnvironment,
    setActiveEnvironment,
    dataWizardMode,
    setDataWizardMode,
    showGeometryImportModal, setShowGeometryImportModal,
    municipalityCodeField, setMunicipalityCodeField,
    submitGeometryImport,
    openGeometryImportModal,
    selectedCityInfo, setSelectedCityInfo,
    handleFilterSettingsChange,
    geometryPropertyKeys, // Get keys from context
    showImageStudio, setShowImageStudio,
  } = useContext(UIContext);

  // Painel do mapa: aberto no desktop, recolhido no celular (lá ele é uma folha que sobe de baixo)
  const [painelAberto, setPainelAberto] = useState(() => typeof window === 'undefined' || window.innerWidth > 768);

  // Os elementos arrastáveis (legenda, norte, escala…) só montam depois da primeira visita ao mapa:
  // montados com o mapa escondido, o react-rnd mede posição zero e dobra o deslocamento inicial.
  const [mapaVisitado, setMapaVisitado] = useState(false);
  useEffect(() => { if (activeEnvironment === 'map') setMapaVisitado(true); }, [activeEnvironment]);
  const mostrarElementosDoMapa = mapLoaded && mapaVisitado;

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
      if (file.size > 50 * 1024 * 1024) {
        alert(`O arquivo ${file.name} excede o limite máximo permitido de 50MB.`);
        return;
      }
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

  // Busca do cabeçalho: leva ao mapa, voa até o município e abre o perfil dele
  const handleHeaderCitySearch = (city) => {
    const row = (csvData || []).find(c => String(c.Codigo_Municipio) === String(city.code));
    setActiveEnvironment('map');
    // espera o mapa voltar a ficar visível (e redimensionar) antes de voar
    setTimeout(() => {
      if (row) handleCitySelectBottomBarInApp(row);
      else flyToCity(city);
    }, 80);
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
    <MainLayout onSearchCity={handleHeaderCitySearch}>
      {/* Mapa: sempre montado, escondido quando outra tela está ativa */}
      <div
        className={`mapa-area ${painelAberto ? 'com-painel' : ''}`}
        style={{ display: activeEnvironment === 'map' ? 'block' : 'none' }}
      >
        <MapPanel
          aberto={painelAberto}
          onFechar={() => setPainelAberto(false)}
          onFiltersApplied={handleFiltersAppliedInApp}
          onImportGeometry={handleImportGeometryInApp}
        />
        <div ref={contextMapContainerRef} className="map-container">
          {isMapLoading && (
            <div className="map-loading">
              <div className="loading-spinner"></div><p>Carregando mapa…</p>
            </div>
          )}
          {mapNotice && (
            <div className="map-notice" role="status">
              <span>{mapNotice}</span>
              <button type="button" onClick={() => setMapNotice(null)} aria-label="Fechar aviso">✕</button>
            </div>
          )}
          {mostrarElementosDoMapa && <AnnotationToolbar />}
          {mostrarElementosDoMapa && <Legend />}
          {mostrarElementosDoMapa && <AnnotationLegend />}
          {mostrarElementosDoMapa && <NorthArrow />}
          {mostrarElementosDoMapa && <ScaleBar />}
          {mostrarElementosDoMapa && <Graticule />}
          {mostrarElementosDoMapa && showImageStudio && (
            <Suspense fallback={<LazyFallback />}><ImageExportStudio /></Suspense>
          )}
        </div>

        {!painelAberto && (
          <button type="button" className="mapa-abrir-painel" onClick={() => setPainelAberto(true)} aria-label="Dados e visualização">
            <SlidersHorizontal size={18} strokeWidth={1.75} aria-hidden="true" />
            <span className="rotulo-longo">Dados e visualização</span>
            <span className="rotulo-curto" aria-hidden="true">Visualização</span>
          </button>
        )}
        {mapLoaded && (
          <button type="button" className="btn btn-destaque mapa-exportar" onClick={() => setShowImageStudio(true)} aria-label="Exportar imagem">
            <ImageIcon size={18} strokeWidth={1.75} aria-hidden="true" />
            <span className="rotulo-longo">Exportar imagem</span>
            <span className="rotulo-curto" aria-hidden="true">Exportar</span>
          </button>
        )}

        {selectedCityInfo && (
          <Suspense fallback={null}>
            <CityInfoBottomBar
              cityInfo={selectedCityInfo}
              onClose={() => setSelectedCityInfo(null)}
              indicadoresData={indicadoresData}
            />
          </Suspense>
        )}
      </div>

      {/* Other Environments */}
      {activeEnvironment === 'data' && <Suspense fallback={<LazyFallback />}><DataVisualizationEnvironment /></Suspense>}
      {activeEnvironment === 'dataSourceInfo' && <DataSourceInfo />}
      {activeEnvironment === 'etl' && <Suspense fallback={<LazyFallback />}><ETLEnvironment /></Suspense>}

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

      {dataWizardMode && <DataWizard mode={dataWizardMode} onClose={() => setDataWizardMode(null)} />}

      <AutoSave />
      <InAppBrowserNotice />

    </MainLayout>
  );
}

function App() {
  return (
    <DataProvider>
      <UIProvider>
        <AnnotationProvider>
          <MapProvider>
            <AppContent />
          </MapProvider>
        </AnnotationProvider>
      </UIProvider>
    </DataProvider>
  );
}

export default App;
