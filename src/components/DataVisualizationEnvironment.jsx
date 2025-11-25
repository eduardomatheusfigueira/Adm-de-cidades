import React, { useState, useEffect, useMemo, useContext } from 'react'; // Adicionado useContext
import Select from 'react-select';
import '../styles/DataVisualizationEnvironment.css';
import RankingView from './data-visualization/RankingView';
import TimeSeriesView from './data-visualization/TimeSeriesView';
import RankingComparisonView from './data-visualization/RankingComparisonView';
import CityProfileView from './data-visualization/CityProfileView';
// import Legend from './Legend'; // Não parece ser usado aqui
// import { getColorScale } from '../utils/colorUtils'; // Não parece ser usado aqui
import { DataContext } from '../contexts/DataContext'; // Importado DataContext

const DataVisualizationEnvironment = ({
  // csvData, // Removido - virá do context
  // geoJson, // Removido - não parece ser usado diretamente aqui
  // indicadoresData, // Removido - virá do context
  // visualizationConfig, // Removido - não parece ser usado diretamente aqui
  // onVisualizationChange, // Removido - não parece ser usado diretamente aqui
  // onEnvironmentChange // Removido - não parece ser usado diretamente aqui
}) => {
  const {
    csvData,
    indicadoresData
  } = useContext(DataContext); // Obtendo dados do DataContext

  const [activeView, setActiveView] = useState('ranking');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableIndicators, setAvailableIndicators] = useState([]);
  const [availableIndicatorsLeft, setAvailableIndicatorsLeft] = useState([]);
  const [availableIndicatorsRight, setAvailableIndicatorsRight] = useState([]);
  const [comparisonConfig, setComparisonConfig] = useState({
    leftYear: '',
    leftIndicator: '',
    rightYear: '',
    rightIndicator: ''
  });
  const [indicatorSearchTerm, setIndicatorSearchTerm] = useState('');
  const [selectedRadarIndicators, setSelectedRadarIndicators] = useState([]);
  const [selectedCitiesCompare, setSelectedCitiesCompare] = useState([]);

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

  useEffect(() => {
    if (indicadoresData && indicadoresData.length > 0) {
      const years = [...new Set(indicadoresData.map(ind => ind.Ano_Observacao))].sort((a, b) => b - a);
      setAvailableYears(years);
      if (years.length > 0 && !selectedYear) { // Define o ano mais recente como padrão
        setSelectedYear(years[0]);
        // Define também para comparisonConfig se estiverem vazios
        if (!comparisonConfig.leftYear) handleComparisonConfigChange('leftYear', years[0]);
        if (!comparisonConfig.rightYear) handleComparisonConfigChange('rightYear', years[0]);
      }
    }
  }, [indicadoresData, selectedYear]); // Adicionado selectedYear para garantir que não sobrescreva uma seleção

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
      if (indicatorsForYear.length > 0 && (!selectedIndicator || !indicatorsForYear.includes(selectedIndicator))) {
        setSelectedIndicator(indicatorsForYear[0]);
      } else if (indicatorsForYear.length === 0) {
         setSelectedIndicator('');
      }
      setSelectedRadarIndicators(prev => prev.filter(ind => indicatorsForYear.includes(ind)));
    } else {
       setAvailableIndicators([]);
       setSelectedIndicator('');
       setSelectedRadarIndicators([]);
    }
  }, [selectedYear, indicadoresData, indicatorSearchTerm, selectedIndicator]);

   const getIndicatorsForYear = (year) => {
    if (!year || !indicadoresData || indicadoresData.length === 0) return [];
    return [...new Set(
      indicadoresData
        .filter(ind => ind.Ano_Observacao === year)
        .map(ind => ind.Nome_Indicador)
    )].sort();
  };

  useEffect(() => {
    const indicators = getIndicatorsForYear(comparisonConfig.leftYear);
    setAvailableIndicatorsLeft(indicators);
    if (comparisonConfig.leftYear && (!indicators.includes(comparisonConfig.leftIndicator) || !comparisonConfig.leftIndicator)) {
      handleComparisonConfigChange('leftIndicator', indicators.length > 0 ? indicators[0] : '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparisonConfig.leftYear, indicadoresData]);

  useEffect(() => {
    const indicators = getIndicatorsForYear(comparisonConfig.rightYear);
    setAvailableIndicatorsRight(indicators);
    if (comparisonConfig.rightYear && (!indicators.includes(comparisonConfig.rightIndicator) || !comparisonConfig.rightIndicator)) {
      handleComparisonConfigChange('rightIndicator', indicators.length > 0 ? indicators[0] : '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparisonConfig.rightYear, indicadoresData]);

  const handleViewChange = (view) => setActiveView(view);
  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleIndicatorClick = (indicatorName) => setSelectedIndicator(indicatorName);

  const handleCitySelectForProfile = (selectedOption) => {
    if (selectedOption && selectedOption.value && csvData) {
      const city = csvData.find(c => c.Codigo_Municipio === selectedOption.value);
      setSelectedCity(city || null);
    } else {
      setSelectedCity(null);
    }
  };

  const handleCitySelectFromTable = (city) => {
    setSelectedCity(city);
    setActiveView('profile');
  };

  const handleComparisonConfigChange = (field, value) => {
    setComparisonConfig(prevConfig => ({ ...prevConfig, [field]: value }));
  };

  const handleRadarIndicatorChange = (indicatorName) => {
    setSelectedRadarIndicators(prevSelected =>
      prevSelected.includes(indicatorName)
        ? prevSelected.filter(name => name !== indicatorName)
        : [...prevSelected, indicatorName]
    );
  };

  const handleCitySelectForCompare = (selectedOptions) => {
     if (!csvData) {
       setSelectedCitiesCompare([]);
       return;
     }
     const cityObjects = (selectedOptions || []).map(option =>
         option && option.value ? csvData.find(c => c.Codigo_Municipio === option.value) : null
       ).filter(Boolean);
     setSelectedCitiesCompare(cityObjects);
  };

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
        <div className="data-visualization-sidebar">
          {activeView === 'ranking' && (
            <div className="view-controls">
              <h3 className="control-section-title">Configurações do Ranking</h3>
              <div className="control-group">
                <label>Pesquisar Indicador:</label>
                <input type="text" placeholder="Buscar indicador..." value={indicatorSearchTerm} onChange={(e) => setIndicatorSearchTerm(e.target.value)} className="indicator-search-input"/>
              </div>
              <div className="control-group">
                <label>Ano:</label>
                <select value={selectedYear} onChange={handleYearChange} disabled={!availableYears || availableYears.length === 0}>
                  <option value="">Selecione um ano</option>
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
                   {availableIndicators.length === 0 && <p className="no-indicators-message">Nenhum indicador encontrado.</p>}
                </div>
              </div>
            </div>
          )}

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
                   {availableIndicators.length === 0 && <p className="no-indicators-message">Nenhum indicador encontrado.</p>}
                 </div>
               </div>
               <div className="control-group">
                 <label>Município:</label>
                 <Select
                   options={cityOptions}
                   value={cityOptions.find(option => option.value === selectedCity?.Codigo_Municipio) || null}
                   onChange={handleCitySelectForProfile}
                   isClearable isSearchable placeholder="Selecione ou digite..."
                   styles={{ menu: (provided) => ({ ...provided, zIndex: 5 }) }}
                 />
               </div>
             </div>
          )}

          {activeView === 'comparison' && (
            <div className="view-controls comparison-controls">
              <h3 className="control-section-title">Configurações de Comparação</h3>
              <div className="control-group">
                <label>Ano Ranking 1:</label>
                <select value={comparisonConfig.leftYear} onChange={(e) => handleComparisonConfigChange('leftYear', e.target.value)} disabled={!availableYears || availableYears.length === 0}>
                  <option value="">Selecione um ano</option>
                  {availableYears.map(year => (<option key={`left-${year}`} value={year}>{year}</option>))}
                </select>
              </div>
              <div className="control-group">
                <label>Indicador Ranking 1:</label>
                <select value={comparisonConfig.leftIndicator} onChange={(e) => handleComparisonConfigChange('leftIndicator', e.target.value)} disabled={!comparisonConfig.leftYear || !availableIndicatorsLeft || availableIndicatorsLeft.length === 0}>
                  <option value="">Selecione um indicador</option>
                  {availableIndicatorsLeft.map(indicator => (<option key={`left-${indicator}`} value={indicator}>{indicator}</option>))}
                </select>
              </div>
              <div className="control-group">
                <label>Ano Ranking 2:</label>
                <select value={comparisonConfig.rightYear} onChange={(e) => handleComparisonConfigChange('rightYear', e.target.value)} disabled={!availableYears || availableYears.length === 0}>
                   <option value="">Selecione um ano</option>
                  {availableYears.map(year => (<option key={`right-${year}`} value={year}>{year}</option>))}
                </select>
              </div>
              <div className="control-group">
                <label>Indicador Ranking 2:</label>
                <select value={comparisonConfig.rightIndicator} onChange={(e) => handleComparisonConfigChange('rightIndicator', e.target.value)} disabled={!comparisonConfig.rightYear || !availableIndicatorsRight || availableIndicatorsRight.length === 0}>
                   <option value="">Selecione um indicador</option>
                  {availableIndicatorsRight.map(indicator => (<option key={`right-${indicator}`} value={indicator}>{indicator}</option>))}
                </select>
              </div>
            </div>
          )}

          {activeView === 'profile' && (
            <div className="view-controls">
              <h3 className="control-section-title">Perfil do Município</h3>
              <div className="control-group">
                <label>Selecione um município:</label>
                <Select
                  options={cityOptions}
                  value={cityOptions.find(option => option.value === selectedCity?.Codigo_Municipio) || null}
                  onChange={handleCitySelectForProfile}
                  isClearable isSearchable placeholder="Selecione ou digite..."
                  styles={{ menu: (provided) => ({ ...provided, zIndex: 5 }) }}
                />
              </div>
              <div className="control-group">
                <label>Comparar com Municípios:</label>
                <Select
                  isMulti options={cityOptions.filter(option => option.value !== selectedCity?.Codigo_Municipio)}
                  value={selectedCitiesCompare.map(city => ({ value: city.Codigo_Municipio, label: `${city.Nome_Municipio} (${city.Sigla_Estado})` }))}
                  onChange={handleCitySelectForCompare}
                  isClearable isSearchable placeholder="Selecione para comparar..." closeMenuOnSelect={false}
                  styles={{ menu: (provided) => ({ ...provided, zIndex: 4 }) }}
                />
              </div>
               <div className="control-group">
                 <label>Ano para Indicadores do Radar:</label>
                 <select value={selectedYear} onChange={handleYearChange} disabled={!availableYears || availableYears.length === 0}>
                   <option value="">Selecione um ano</option>
                   {availableYears.map(year => (<option key={`radar-year-${year}`} value={year}>{year}</option>))}
                 </select>
               </div>
               <div className="control-group">
                 <label>Pesquisar Indicador (Radar):</label>
                 <input type="text" placeholder="Buscar indicador..." value={indicatorSearchTerm}
                   onChange={(e) => setIndicatorSearchTerm(e.target.value)} className="indicator-search-input"
                 />
               </div>
               <div className="control-group">
                  <label>Indicadores para Radar:</label>
                  <div className="indicator-list checkbox-list">
                    {availableIndicators.map(indicator => (
                      <div key={`radar-${indicator}`} className="checkbox-item">
                        <input type="checkbox" id={`radar-${indicator}`} value={indicator}
                          checked={selectedRadarIndicators.includes(indicator)} onChange={() => handleRadarIndicatorChange(indicator)}
                        />
                        <label htmlFor={`radar-${indicator}`}>{indicator}</label>
                      </div>
                    ))}
                    {availableIndicators.length === 0 && <p className="no-indicators-message">Nenhum indicador encontrado.</p>}
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="data-visualization-content">
          {activeView === 'ranking' && (
            <RankingView csvData={csvData} indicadoresData={indicadoresData} year={selectedYear} indicator={selectedIndicator} onCitySelect={handleCitySelectFromTable} />
          )}
          {activeView === 'timeSeries' && (
            <TimeSeriesView csvData={csvData} indicadoresData={indicadoresData} indicator={selectedIndicator} selectedCity={selectedCity} onCitySelect={handleCitySelectFromTable} />
          )}
          {activeView === 'comparison' && (
            <RankingComparisonView csvData={csvData} indicadoresData={indicadoresData} leftYear={comparisonConfig.leftYear} leftIndicator={comparisonConfig.leftIndicator} rightYear={comparisonConfig.rightYear} rightIndicator={comparisonConfig.rightIndicator} onCitySelect={handleCitySelectFromTable} />
          )}
          {activeView === 'profile' && selectedCity ? (
            <CityProfileView
              city={selectedCity}
              indicadoresData={indicadoresData}
              selectedRadarIndicatorNames={selectedRadarIndicators}
              selectedYearForProfile={selectedYear} // Passando o ano selecionado para o perfil
              citiesCompare={selectedCitiesCompare}
            />
          ) : activeView === 'profile' ? (
            <div className="no-data-message full-width"><p>Selecione um município na barra lateral para ver o perfil.</p></div>
          ) : null }
        </div>
      </div>
    </div>
  );
};

export default DataVisualizationEnvironment;
