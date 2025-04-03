import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select'; // Import react-select
import '../styles/DataVisualizationEnvironment.css';
import RankingView from './data-visualization/RankingView';
import TimeSeriesView from './data-visualization/TimeSeriesView';
import RankingComparisonView from './data-visualization/RankingComparisonView';
import CityProfileView from './data-visualization/CityProfileView';
import Legend from './Legend';
import { getColorScale } from '../utils/colorUtils';

const DataVisualizationEnvironment = ({ csvData, geoJson, indicadoresData, visualizationConfig, onVisualizationChange, onEnvironmentChange }) => {
  const [activeView, setActiveView] = useState('ranking');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [selectedCity, setSelectedCity] = useState(null); // Holds the full city object
  const [availableYears, setAvailableYears] = useState([]);
  const [availableIndicators, setAvailableIndicators] = useState([]); // For Ranking/TimeSeries/Profile Radar Selection
  const [availableIndicatorsLeft, setAvailableIndicatorsLeft] = useState([]); // For Comparison Left
  const [availableIndicatorsRight, setAvailableIndicatorsRight] = useState([]); // For Comparison Right
  const [comparisonConfig, setComparisonConfig] = useState({
    leftYear: '',
    leftIndicator: '',
    rightYear: '',
    rightIndicator: ''
  });
  // Removed mapData, tooltipContent, selectedFeature, colorScale as they seemed unused here
  const [indicatorSearchTerm, setIndicatorSearchTerm] = useState('');
  const [selectedRadarIndicators, setSelectedRadarIndicators] = useState([]); // State for selected radar indicators for the primary city
  const [selectedCitiesCompare, setSelectedCitiesCompare] = useState([]); // State for MULTIPLE comparison city objects

  // Memoize city options for react-select performance
  const cityOptions = useMemo(() => {
    if (!csvData || !Array.isArray(csvData) || csvData.length === 0) return [];
    try {
      const validData = csvData.filter(city => city && city.Nome_Municipio && city.Codigo_Municipio && city.Sigla_Estado);
      const sortedCsvData = [...validData].sort((a, b) => a.Nome_Municipio.localeCompare(b.Nome_Municipio));
      return sortedCsvData.map(city => ({
        value: city.Codigo_Municipio,
        label: `${city.Nome_Municipio} (${city.Sigla_Estado})`
      }));
    } catch (error) {
      console.error("Error creating cityOptions:", error); return [];
    }
  }, [csvData]);

  // Extract available years from indicators data
  useEffect(() => {
    if (indicadoresData && indicadoresData.length > 0) {
      const years = [...new Set(indicadoresData.map(ind => ind.Ano_Observacao))].sort((a, b) => b - a); // Sort descending
      setAvailableYears(years);
      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[0]);
      }
    }
  }, [indicadoresData]);

  // Update available indicators for Ranking/TimeSeries/Profile Radar Selection when selectedYear or search term changes
  useEffect(() => {
    if (selectedYear && indicadoresData && indicadoresData.length > 0) {
      let indicatorsForYear = [...new Set(
        indicadoresData
          .filter(ind => ind.Ano_Observacao === selectedYear)
          .map(ind => ind.Nome_Indicador)
      )].sort();
      if (indicatorSearchTerm) {
        const searchTermLower = indicatorSearchTerm.toLowerCase();
        indicatorsForYear = indicatorsForYear.filter(indicator =>
          indicator.toLowerCase().includes(searchTermLower)
        );
      }
      setAvailableIndicators(indicatorsForYear);
      // Update main selected indicator only if needed
      if (indicatorsForYear.length > 0 && (!selectedIndicator || !indicatorsForYear.includes(selectedIndicator))) {
        setSelectedIndicator(indicatorsForYear[0]);
      } else if (indicatorsForYear.length === 0) {
         setSelectedIndicator('');
      }
      // Also update selected radar indicators if they become unavailable
      setSelectedRadarIndicators(prev => prev.filter(ind => indicatorsForYear.includes(ind)));

    } else {
       setAvailableIndicators([]);
       setSelectedIndicator('');
       setSelectedRadarIndicators([]); // Clear radar selection if no year/data
    }
  }, [selectedYear, indicadoresData, indicatorSearchTerm]); // Removed selectedIndicator dependency to avoid loops

   // Common function to get indicators for a specific year
   const getIndicatorsForYear = (year) => {
    if (!year || !indicadoresData || indicadoresData.length === 0) return [];
    return [...new Set(
      indicadoresData
        .filter(ind => ind.Ano_Observacao === year)
        .map(ind => ind.Nome_Indicador)
    )].sort();
  };

  // Update available indicators for Comparison Left when leftYear changes
  useEffect(() => {
    const indicators = getIndicatorsForYear(comparisonConfig.leftYear);
    setAvailableIndicatorsLeft(indicators);
    if (!comparisonConfig.leftYear || !indicators.includes(comparisonConfig.leftIndicator)) {
      handleComparisonConfigChange('leftIndicator', indicators.length > 0 ? indicators[0] : '');
    }
  }, [comparisonConfig.leftYear, indicadoresData]);

  // Update available indicators for Comparison Right when rightYear changes
  useEffect(() => {
    const indicators = getIndicatorsForYear(comparisonConfig.rightYear);
    setAvailableIndicatorsRight(indicators);
    if (!comparisonConfig.rightYear || !indicators.includes(comparisonConfig.rightIndicator)) {
      handleComparisonConfigChange('rightIndicator', indicators.length > 0 ? indicators[0] : '');
    }
  }, [comparisonConfig.rightYear, indicadoresData]);

  // Handle view changes
  const handleViewChange = (view) => setActiveView(view);

  // Handle year selection for Ranking/TimeSeries/Profile
  const handleYearChange = (e) => setSelectedYear(e.target.value);

  // Handle indicator selection for Ranking/TimeSeries (from list click)
  const handleIndicatorClick = (indicatorName) => setSelectedIndicator(indicatorName);

  // Handle city selection for profile view using react-select
  const handleCitySelectForProfile = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      const city = csvData?.find(c => c.Codigo_Municipio === selectedOption.value);
      setSelectedCity(city || null);
    } else {
      setSelectedCity(null);
    }
  };

  // Handle city selection from table clicks (Ranking/Comparison)
  const handleCitySelectFromTable = (city) => {
    setSelectedCity(city);
    setActiveView('profile'); // Switch to profile view on table click
  };

  // Handle comparison configuration changes
  const handleComparisonConfigChange = (field, value) => {
    setComparisonConfig(prevConfig => ({
      ...prevConfig,
      [field]: value
    }));
  };

  // Handle checkbox change for radar indicators
  const handleRadarIndicatorChange = (indicatorName) => {
    setSelectedRadarIndicators(prevSelected => {
      if (prevSelected.includes(indicatorName)) {
        return prevSelected.filter(name => name !== indicatorName);
      } else {
        return [...prevSelected, indicatorName];
      }
    });
  };

  // Handle city selection for MULTI comparison dropdown
  const handleCitySelectForCompare = (selectedOptions) => {
     if (!csvData) {
       setSelectedCitiesCompare([]);
       return;
     }
     const cityObjects = (selectedOptions || []).map(option => {
         if (option && option.value) {
             return csvData.find(c => c.Codigo_Municipio === option.value);
         }
         return null;
       }
     ).filter(Boolean);
     setSelectedCitiesCompare(cityObjects);
  };


  // --- Render Logic ---
  return (
    <div className="data-visualization-environment">
      <div className="data-visualization-header">
        <h1>Ambiente de Visualização de Indicadores</h1>
        <div className="view-selector">
          <button className={`view-button ${activeView === 'ranking' ? 'active' : ''}`} onClick={() => handleViewChange('ranking')}>Rankings</button>
          <button className={`view-button ${activeView === 'timeSeries' ? 'active' : ''}`} onClick={() => handleViewChange('timeSeries')}>Séries Temporais</button>
          <button className={`view-button ${activeView === 'comparison' ? 'active' : ''}`} onClick={() => handleViewChange('comparison')}>Comparação de Rankings</button>
          <button className={`view-button ${activeView === 'profile' ? 'active' : ''}`} onClick={() => handleViewChange('profile')}>Perfil de Município</button>
        </div>
      </div>

      <div className="data-visualization-container">
        {/* Sidebar */}
        <div className="data-visualization-sidebar">
          {/* Ranking Controls */}
          {activeView === 'ranking' && (
            <div className="view-controls">
              <h3 className="control-section-title">Configurações do Ranking</h3>
              <div className="control-group">
                <label>Pesquisar Indicador:</label>
                <input type="text" placeholder="Buscar indicador..." value={indicatorSearchTerm} onChange={(e) => setIndicatorSearchTerm(e.target.value)} className="indicator-search-input"/>
              </div>
              <div className="control-group">
                <label>Ano:</label>
                <select value={selectedYear} onChange={handleYearChange}>
                  {availableYears.map(year => (<option key={year} value={year}>{year}</option>))}
                </select>
              </div>
              <div className="control-group">
                <label>Indicador:</label>
                <div className="indicator-list">
                  {availableIndicators.map(indicator => (
                    <p key={indicator} className={`indicator-item ${selectedIndicator === indicator ? 'selected' : ''}`} onClick={() => handleIndicatorClick(indicator)}>
                      {indicator}
                    </p>
                  ))}
                   {availableIndicators.length === 0 && <p className="no-indicators-message">Nenhum indicador encontrado para o ano/busca.</p>}
                </div>
              </div>
            </div>
          )}

          {/* TimeSeries Controls */}
          {activeView === 'timeSeries' && (
             <div className="view-controls">
               <h3 className="control-section-title">Configurações da Série Temporal</h3>
               <div className="control-group">
                 <label>Pesquisar Indicador:</label>
                 <input type="text" placeholder="Buscar indicador..." value={indicatorSearchTerm} onChange={(e) => setIndicatorSearchTerm(e.target.value)} className="indicator-search-input"/>
               </div>
               <div className="control-group">
                 <label>Indicador:</label>
                 <div className="indicator-list">
                   {availableIndicators.map(indicator => (
                     <p key={indicator} className={`indicator-item ${selectedIndicator === indicator ? 'selected' : ''}`} onClick={() => handleIndicatorClick(indicator)}>
                       {indicator}
                     </p>
                   ))}
                   {availableIndicators.length === 0 && <p className="no-indicators-message">Nenhum indicador encontrado para o ano/busca.</p>}
                 </div>
               </div>
               <div className="control-group">
                 <label>Município:</label>
                 <Select
                   options={cityOptions}
                   value={cityOptions.find(option => option.value === selectedCity?.Codigo_Municipio) || null}
                   onChange={handleCitySelectForProfile} // Re-use profile selector logic
                   isClearable
                   isSearchable
                   placeholder="Selecione ou digite..."
                   styles={{ menu: (provided) => ({ ...provided, zIndex: 5 }) }}
                 />
               </div>
             </div>
          )}

          {/* Comparison Controls */}
          {activeView === 'comparison' && (
            <div className="view-controls comparison-controls">
              <h3 className="control-section-title">Configurações de Comparação</h3>
              <div className="control-group">
                <label>Ano Ranking 1:</label>
                <select value={comparisonConfig.leftYear} onChange={(e) => handleComparisonConfigChange('leftYear', e.target.value)}>
                  <option value="">Selecione um ano</option>
                  {availableYears.map(year => (<option key={year} value={year}>{year}</option>))}
                </select>
              </div>
              <div className="control-group">
                <label>Indicador Ranking 1:</label>
                <select value={comparisonConfig.leftIndicator} onChange={(e) => handleComparisonConfigChange('leftIndicator', e.target.value)} disabled={!comparisonConfig.leftYear}>
                  <option value="">Selecione um indicador</option>
                  {availableIndicatorsLeft.map(indicator => (<option key={indicator} value={indicator}>{indicator}</option>))}
                </select>
              </div>
              <div className="control-group">
                <label>Ano Ranking 2:</label>
                <select value={comparisonConfig.rightYear} onChange={(e) => handleComparisonConfigChange('rightYear', e.target.value)}>
                   <option value="">Selecione um ano</option>
                  {availableYears.map(year => (<option key={year} value={year}>{year}</option>))}
                </select>
              </div>
              <div className="control-group">
                <label>Indicador Ranking 2:</label>
                <select value={comparisonConfig.rightIndicator} onChange={(e) => handleComparisonConfigChange('rightIndicator', e.target.value)} disabled={!comparisonConfig.rightYear}>
                   <option value="">Selecione um indicador</option>
                  {availableIndicatorsRight.map(indicator => (<option key={indicator} value={indicator}>{indicator}</option>))}
                </select>
              </div>
            </div>
          )}

          {/* Profile Controls */}
          {activeView === 'profile' && (
            <div className="view-controls">
              <h3 className="control-section-title">Perfil do Município</h3>
              <div className="control-group">
                <label>Selecione um município:</label>
                <Select
                  options={cityOptions}
                  value={cityOptions.find(option => option.value === selectedCity?.Codigo_Municipio) || null}
                  onChange={handleCitySelectForProfile}
                  isClearable
                  isSearchable
                  placeholder="Selecione ou digite..."
                  styles={{
                     control: (provided) => ({ ...provided, borderColor: '#ced4da' }),
                     menu: (provided) => ({ ...provided, zIndex: 5 }),
                     option: (provided, state) => ({
                       ...provided,
                       backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#e9ecef' : 'white',
                       color: state.isSelected ? 'white' : '#343a40',
                     }),
                   }}
                />
              </div>
              {/* Multi-select comparison dropdown */}
              <div className="control-group">
                <label>Comparar com Municípios:</label>
                <Select
                  isMulti // Enable multi-select
                  options={cityOptions.filter(option => option.value !== selectedCity?.Codigo_Municipio)} // Exclude primary selected city
                  value={selectedCitiesCompare.map(city => ({ value: city.Codigo_Municipio, label: `${city.Nome_Municipio} (${city.Sigla_Estado})` }))}
                  onChange={handleCitySelectForCompare}
                  isClearable
                  isSearchable
                  placeholder="Selecione para comparar..."
                  closeMenuOnSelect={false} // Keep menu open for multi-select
                  styles={{
                     control: (provided) => ({ ...provided, borderColor: '#ced4da', marginTop: '5px' }),
                     menu: (provided) => ({ ...provided, zIndex: 4 }),
                     option: (provided, state) => ({
                       ...provided,
                       backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#e9ecef' : 'white',
                       color: state.isSelected ? 'white' : '#343a40',
                     }),
                     multiValue: (provided) => ({ ...provided, backgroundColor: '#e0e7ff' }),
                     multiValueLabel: (provided) => ({ ...provided, color: '#333' }),
                     multiValueRemove: (provided) => ({ ...provided, color: '#555', ':hover': { backgroundColor: '#ffb3b3', color: 'white' } }),
                   }}
                />
              </div>
               {/* Year Selector for Profile */}
               <div className="control-group">
                 <label>Ano:</label>
                 <select value={selectedYear} onChange={handleYearChange}>
                   {availableYears.map(year => (<option key={year} value={year}>{year}</option>))}
                 </select>
               </div>
               {/* Indicator Search for Radar */}
               <div className="control-group">
                 <label>Pesquisar Indicador (Radar):</label>
                 <input
                   type="text"
                   placeholder="Buscar indicador..."
                   value={indicatorSearchTerm} // Reuse same search term state
                   onChange={(e) => setIndicatorSearchTerm(e.target.value)}
                   className="indicator-search-input"
                 />
               </div>
               {/* Checkbox list for Radar Indicators */}
               <div className="control-group">
                  <label>Indicadores para Radar:</label>
                  <div className="indicator-list checkbox-list">
                    {availableIndicators.map(indicator => (
                      <div key={`radar-${indicator}`} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`radar-${indicator}`}
                          value={indicator}
                          checked={selectedRadarIndicators.includes(indicator)}
                          onChange={() => handleRadarIndicatorChange(indicator)}
                        />
                        <label htmlFor={`radar-${indicator}`}>{indicator}</label>
                      </div>
                    ))}
                    {availableIndicators.length === 0 && <p className="no-indicators-message">Nenhum indicador encontrado para o ano/busca.</p>}
                  </div>
               </div>
            </div>
          )}
        </div> {/* End Sidebar */}

        {/* Main Content Area */}
        <div className="data-visualization-content">
          {activeView === 'ranking' && (
            <RankingView csvData={csvData} indicadoresData={indicadoresData} year={selectedYear} indicator={selectedIndicator} onCitySelect={handleCitySelectFromTable} />
          )}
          {activeView === 'timeSeries' && (
            <TimeSeriesView csvData={csvData} indicadoresData={indicadoresData} indicator={selectedIndicator} selectedCity={selectedCity} onCitySelect={handleCitySelectFromTable} />
          )}
          {activeView === 'comparison' && (
            <RankingComparisonView csvData={csvData} indicadoresData={indicadoresData} leftYear={comparisonConfig.leftYear} leftIndicator={comparisonConfig.leftIndicator} rightYear={comparisonConfig.rightYear} rightIndicator={comparisonConfig.rightIndicator} onCitySelect={handleCitySelectFromTable} cities={csvData} />
          )}
          {/* Ensure selectedCity is truthy before rendering CityProfileView */}
          {activeView === 'profile' && selectedCity ? (
            <CityProfileView
              city={selectedCity}
              indicadoresData={indicadoresData}
              selectedRadarIndicatorNames={selectedRadarIndicators}
              selectedYearForProfile={selectedYear}
              citiesCompare={selectedCitiesCompare} // Pass array of comparison city objects
            />
          ) : activeView === 'profile' ? ( // Show message only if profile view is active but no city selected
            <div className="no-data-message full-width"><p>Selecione um município na barra lateral para ver o perfil.</p></div>
          ) : null /* Render nothing if not profile view */}
        </div> {/* End Content */}

      </div> {/* End Container */}
    </div> // End Environment
  );
};

export default DataVisualizationEnvironment;
