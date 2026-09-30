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
import GeoImportDialog from './components/GeoImportDialog';
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
    selectedCityInfo, setSelectedCityInfo,
    handleFilterSettingsChange,
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

  // Importar arquivo geográfico (GeoJSON, KML, Shapefile…): camada de referência ou limites
  const [showGeoImport, setShowGeoImport] = useState(false);
  const handleImportGeometryInApp = () => setShowGeoImport(true);

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
      {showGeoImport && <GeoImportDialog onClose={() => setShowGeoImport(false)} />}

      {dataWizardMode && <DataWizard mode={dataWizardMode} onClose={() => setDataWizardMode(null)}
        onShowMap={() => { if (window.innerWidth <= 768) setPainelAberto(false); }} />}

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
