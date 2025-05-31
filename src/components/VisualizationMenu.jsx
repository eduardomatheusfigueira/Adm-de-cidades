import React, { useState, useEffect, useRef, useContext } from 'react';
import '../styles/VisualizationMenu.css';
import { DataContext } from '../contexts/DataContext';
import { MapContext } from '../contexts/MapContext';
import { UIContext } from '../contexts/UIContext'; // Importado UIContext

const VisualizationMenu = ({
  onFiltersApplied // Esta prop ainda é passada por AppContent para coordenar DataContext e UIContext
  // onVisualizationChange, // Removido -> handleVisualizationConfigChange do UIContext
  // onEnvironmentChange, // Removido -> setActiveEnvironment do UIContext
}) => {
  const {
    csvData,
    indicadoresData,
    csvHeaders,
    applyFiltersToCsvData // Usado em handleApplyFilters
  } = useContext(DataContext);

  const {
    mapStyle,
    handleMapStyleChange
  } = useContext(MapContext);

  const {
    // activeEnvironment, // Não é mais necessário controlar aqui se os botões chamam setActiveEnvironment
    setActiveEnvironment,
    // colorAttribute, // Usaremos o estado local selectedAttribute para o seletor, UIContext.colorAttribute será atualizado por handleFilterSettingsChange
    // visualizationConfig, // Usaremos estados locais (visualizationType, etc.) para o seletor, UIContext.visualizationConfig será atualizado por handleVisualizationConfigChange
    handleFilterSettingsChange,
    handleVisualizationConfigChange
  } = useContext(UIContext);

  // Estados locais para os seletores do menu
  const [isOpen, setIsOpen] = useState(false);
  const [currentVisualizationType, setCurrentVisualizationType] = useState('attribute'); // Estado local para o tipo
  const [currentSelectedAttribute, setCurrentSelectedAttribute] = useState('Sigla_Regiao'); // Estado local para o atributo
  const [currentSelectedYear, setCurrentSelectedYear] = useState('');
  const [currentSelectedIndicator, setCurrentSelectedIndicator] = useState('');
  const [currentIndicatorValueType, setCurrentIndicatorValueType] = useState('value');

  const [availableYears, setAvailableYears] = useState([]);
  const [availableIndicators, setAvailableIndicators] = useState([]);
  const menuRef = useRef(null);
  const [cityFilter, setCityFilter] = useState('all');
  // const [currentFilters, setCurrentFilters] = useState({}); // Não parece estar em uso, considerar remover
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedMunicipalities, setSelectedMunicipalities] = useState(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearchTerm, setDropdownSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const uniqueRegions = csvData ? [...new Set(csvData.map(city => city.Sigla_Regiao))].filter(Boolean).sort() : [];
  const uniqueStates = csvData ? [...new Set(csvData.map(city => city.Sigla_Estado))].filter(Boolean).sort() : [];

  useEffect(() => {
    if (selectedRegion !== 'all' && csvData) {
      const statesInRegion = [...new Set(
        csvData
          .filter(city => city.Sigla_Regiao === selectedRegion)
          .map(city => city.Sigla_Estado)
      )];
      if (selectedState !== 'all' && !statesInRegion.includes(selectedState)) {
        setSelectedState('all');
      }
    }
  }, [selectedRegion, csvData, selectedState]);

  const handleFilterChange = (event) => setCityFilter(event.target.value);
  const handleRegionChange = (event) => setSelectedRegion(event.target.value);
  const handleStateChange = (event) => setSelectedState(event.target.value);

  const handleMunicipalitySelectionChange = (event) => {
    const { value, checked } = event.target;
    setSelectedMunicipalities(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (checked) newSelected.add(value);
      else newSelected.delete(value);
      return newSelected;
    });
  };

  const handleApplyFiltersLocal = () => { // Renomeado para evitar conflito de nome com prop
    if (!csvData) return;
    let tempData = [...csvData];
    if (cityFilter === 'capital') tempData = tempData.filter(city => city.Capital === 'true');
    else if (cityFilter === 'non-capital') tempData = tempData.filter(city => city.Capital !== 'true');
    if (selectedRegion !== 'all') tempData = tempData.filter(city => city.Sigla_Regiao === selectedRegion);
    if (selectedState !== 'all') tempData = tempData.filter(city => city.Sigla_Estado === selectedState);
    if (selectedMunicipalities.size > 0) {
      tempData = tempData.filter(city => selectedMunicipalities.has(city.Codigo_Municipio));
    }
    // A prop onFiltersApplied (de AppContent) agora só precisa dos dados filtrados e do atributo de cor
    onFiltersApplied(tempData, currentSelectedAttribute);
  };

  const handleResetFiltersLocal = () => { // Renomeado
    if (!csvData) return;
    setCityFilter('all');
    // setCurrentFilters({});
    setSelectedRegion('all');
    setSelectedState('all');
    setSelectedMunicipalities(new Set());
    setCurrentSelectedAttribute('Sigla_Regiao');
    onFiltersApplied(csvData, 'Sigla_Regiao'); // Chama a prop de AppContent
  };

  const numericAttributes = csvHeaders ? csvHeaders.filter(header => header.match(/^(Altitude_Municipio|Area_Municipio)$/)) : [];
  const categoricalAttributes = csvHeaders ? csvHeaders.filter(key =>
    !key.match(/^(Longitude_Municipio|Latitude_Municipio|Altitude_Municipio|Area_Municipio|Codigo_Municipio|Nome_Municipio)$/)
  ).sort() : [];

  useEffect(() => {
    if (indicadoresData && indicadoresData.length > 0) {
      const indicators = [...new Set(indicadoresData.map(ind => ind.Nome_Indicador))].sort();
      setAvailableIndicators(indicators);
    }
  }, [indicadoresData]);

  useEffect(() => {
    if (currentSelectedIndicator && indicadoresData && indicadoresData.length > 0) {
      const years = [...new Set(
        indicadoresData
          .filter(ind => ind.Nome_Indicador === currentSelectedIndicator)
          .map(ind => ind.Ano_Observacao)
      )].sort((a, b) => b - a);
      setAvailableYears(years);
      if (years.length > 0) setCurrentSelectedYear(years[0]);
      else setCurrentSelectedYear('');
    } else {
      setAvailableYears([]);
      setCurrentSelectedYear('');
    }
  }, [currentSelectedIndicator, indicadoresData]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleApplyVisualizationLocal = () => { // Renomeado
    let config = { type: currentVisualizationType };
    if (currentVisualizationType === 'attribute') {
      config.attribute = currentSelectedAttribute;
    } else if (currentVisualizationType === 'indicator') {
      config.year = currentSelectedYear;
      config.indicator = currentSelectedIndicator;
      config.valueType = currentIndicatorValueType;
    }
    handleVisualizationConfigChange(config); // Chama a função do UIContext
    setActiveEnvironment('map'); // Chama a função do UIContext
    setIsOpen(false);
  };

  // Handlers para os botões de ambiente
  const handleShowDataSourceInfo = () => { setActiveEnvironment('dataSourceInfo'); setIsOpen(false); };
  const handleShowMapVisualization = () => { setActiveEnvironment('map'); setIsOpen(false); };
  const handleShowDataVisualization = () => { setActiveEnvironment('data'); setIsOpen(false); };
  const handleShowETLEnvironment = () => { setActiveEnvironment('etl'); setIsOpen(false); };


  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  useEffect(() => {
    function handleClickOutsideDropdown(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
  }, [isDropdownOpen]);

  const availableStates = selectedRegion === 'all' || !csvData
    ? uniqueStates
    : [...new Set(csvData.filter(city => city.Sigla_Regiao === selectedRegion).map(city => city.Sigla_Estado))].sort();

  return (
    <div className="visualization-menu" ref={menuRef}>
      <button className="visualization-menu-toggle-icon" onClick={toggleMenu} aria-label={isOpen ? 'Ocultar Menu' : 'Mostrar Menu'}>
        <i className="visualization-icon"></i>
      </button>
      <div className={`visualization-menu-content ${isOpen ? 'open' : ''}`}>
        <div className="visualization-section">
          <h3>Visualização e Filtro</h3>
          <div className="filter-section">
            <h4>Filtros</h4>
            <div className="filter-group" style={{ position: 'relative' }}>
              <label>Municípios:</label>
              <button ref={triggerRef} className="select-municipalities-button" onClick={() => setIsDropdownOpen(prev => !prev)}>
                Selecionar Municípios ({selectedMunicipalities.size})
              </button>
              {isDropdownOpen && csvData && (
                <div ref={dropdownRef} style={dropdownStyles.dropdownContainer}>
                  <input
                    type="text" placeholder="Buscar município..." value={dropdownSearchTerm}
                    onChange={(e) => setDropdownSearchTerm(e.target.value)} style={dropdownStyles.searchInput} autoFocus
                  />
                  <div style={dropdownStyles.listContainer}>
                    {csvData
                      .filter(city => {
                        const normalizedSearch = dropdownSearchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        const normalizedCityName = (city.Nome_Municipio || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        return dropdownSearchTerm.trim() === '' || normalizedCityName.includes(normalizedSearch);
                      })
                      .sort((a, b) => a.Nome_Municipio.localeCompare(b.Nome_Municipio))
                      .map(city => (
                        <div key={city.Codigo_Municipio} style={dropdownStyles.listItem}>
                          <input type="checkbox" id={`city-dd-${city.Codigo_Municipio}`} value={city.Codigo_Municipio}
                            checked={selectedMunicipalities.has(city.Codigo_Municipio)} onChange={handleMunicipalitySelectionChange}
                            style={{ marginRight: '8px' }}
                          />
                          <label htmlFor={`city-dd-${city.Codigo_Municipio}`}>{city.Nome_Municipio} ({city.Sigla_Estado})</label>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div className="filter-group">
              <label>Tipo de Município:</label>
              <select className="filter-dropdown" value={cityFilter} onChange={handleFilterChange}>
                <option value="all">Todos os Municípios</option>
                <option value="capital">Apenas Capitais</option>
                <option value="non-capital">Apenas Não Capitais</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Região:</label>
              <select className="filter-dropdown" value={selectedRegion} onChange={handleRegionChange} disabled={!uniqueRegions || uniqueRegions.length === 0}>
                <option value="all">Todas as Regiões</option>
                {uniqueRegions.map(region => (<option key={region} value={region}>{region}</option>))}
              </select>
            </div>
            <div className="filter-group">
              <label>Estado:</label>
              <select className="filter-dropdown" value={selectedState} onChange={handleStateChange} disabled={!availableStates || availableStates.length === 0}>
                <option value="all">Todos os Estados</option>
                {availableStates.map(state => (<option key={state} value={state}>{state}</option>))}
              </select>
            </div>
            <div className="filter-actions filter-buttons">
              <button className="apply-filters-button" onClick={handleApplyFiltersLocal}>Aplicar Filtros</button>
              <button className="reset-filters-button" onClick={handleResetFiltersLocal}>Limpar Filtros</button>
            </div>
          </div>
          <div className="visualization-section">
            <h4>Visualização de Mapa</h4>
            <div className="visualization-group">
              <label>Tipo de Visualização:</label>
              <select className="visualization-dropdown" value={currentVisualizationType} onChange={(e) => setCurrentVisualizationType(e.target.value)}>
                <option value="attribute">Atributo do Município</option>
                <option value="indicator">Indicador</option>
              </select>
            </div>
            {currentVisualizationType === 'attribute' ? (
              <div className="visualization-group">
                <label>Atributo para Visualização:</label>
                <select className="visualization-dropdown" value={currentSelectedAttribute} onChange={(e) => setCurrentSelectedAttribute(e.target.value)} disabled={!categoricalAttributes || categoricalAttributes.length === 0}>
                  {categoricalAttributes.map(attr => (<option key={attr} value={attr}>{attr}</option>))}
                  {numericAttributes.map(attr => (<option key={attr} value={attr}>{attr}</option>))}
                </select>
              </div>
            ) : (
              <>
                <div className="visualization-group">
                  <label>Indicador:</label>
                  <select className="visualization-dropdown" value={currentSelectedIndicator} onChange={(e) => setCurrentSelectedIndicator(e.target.value)} disabled={!availableIndicators || availableIndicators.length === 0}>
                    <option value="">Selecione o Indicador</option>
                    {availableIndicators.map(indicator => (<option key={indicator} value={indicator}>{indicator}</option>))}
                  </select>
                </div>
                <div className="visualization-group">
                  <label>Ano:</label>
                  <select className="visualization-dropdown" value={currentSelectedYear} onChange={(e) => setCurrentSelectedYear(e.target.value)} disabled={!currentSelectedIndicator || !availableYears || availableYears.length === 0}>
                    <option value="">Selecione o Ano</option>
                    {availableYears.map(year => (<option key={year} value={year}>{year}</option>))}
                  </select>
                </div>
                <div className="visualization-group">
                  <label>Tipo de Valor:</label>
                  <select className="visualization-dropdown" value={currentIndicatorValueType} onChange={(e) => setCurrentIndicatorValueType(e.target.value)}>
                    <option value="value">Valor do Indicador</option>
                    <option value="position">Índice Posicional</option>
                  </select>
                </div>
              </>
            )}
            <div className="visualization-group">
              <label>Estilo do Mapa:</label>
              <select className="visualization-dropdown" value={mapStyle} onChange={(e) => handleMapStyleChange(e.target.value)}>
                <option value="mapbox://styles/mapbox/light-v11">Claro</option>
                <option value="mapbox://styles/mapbox/dark-v11">Escuro</option>
                <option value="mapbox://styles/mapbox/streets-v12">Ruas</option>
                <option value="mapbox://styles/mapbox/outdoors-v12">Exterior</option>
                <option value="mapbox://styles/mapbox/satellite-streets-v12">Satélite com Ruas</option>
              </select>
            </div>
            <div className="visualization-actions">
              <button className="apply-visualization-button" onClick={handleApplyVisualizationLocal}>Aplicar Visualização de Mapa</button>
            </div>
          </div>
        </div>
        <div className="visualization-section environment-section">
          <h3>Ambiente de Visualização</h3>
          <div className="visualization-actions">
            <button className="show-data-source-info-button" onClick={handleShowDataSourceInfo}>Início</button>
            <button className="show-map-visualization-button" onClick={handleShowMapVisualization}>Visualização de Municípios</button>
            <button className="show-data-visualization-button" onClick={handleShowDataVisualization}>Visualização de Indicadores</button>
          </div>
        </div>
        <div className="filter-results">
          <p className="results-count">{csvData ? csvData.length : 0} municípios disponíveis</p>
        </div>
      </div>
    </div>
  );
};

const dropdownStyles = {
  dropdownContainer: {
    position: 'absolute', top: '100%', left: 0, backgroundColor: '#fff',
    border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
    zIndex: 1001, width: '300px', maxHeight: '300px', display: 'flex',
    flexDirection: 'column', color: '#333',
  },
  searchInput: { padding: '8px 10px', margin: '5px', border: '1px solid #ccc', borderRadius: '4px' },
  listContainer: { overflowY: 'auto', flexGrow: 1, padding: '0 5px 5px 5px' },
  listItem: { padding: '5px 5px', display: 'flex', alignItems: 'center', fontSize: '0.9em' },
};

export default VisualizationMenu;
