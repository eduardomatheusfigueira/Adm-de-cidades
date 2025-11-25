import React, { useState, useEffect, useCallback, useContext } from 'react';
import CityProfileSummary from './CityProfileSummary';
import '../styles/CityInfoBottomBar.css';
import TimeSeriesView from './data-visualization/TimeSeriesView';
import IndicatorComparisonBarChart from './data-visualization/IndicatorComparisonBarChart';
import { DataContext } from '../contexts/DataContext';
import { UIContext } from '../contexts/UIContext'; // Importado UIContext

const CityInfoBottomBar = ({
  // cityInfo, // Removido -> virá do UIContext
  // onClose, // Removido -> virá do UIContext
  onCitySelect // Mantido, pois AppContent ainda lida com a lógica de flyTo e seleção
}) => {
  const {
    // csvData: cities, // Já obtido em DataContext, não precisa ser renomeado aqui se não houver conflito
    indicadoresData
  } = useContext(DataContext);

  const {
    selectedCityInfo: cityInfo, // Obtido do UIContext
    setSelectedCityInfo // Para o botão de fechar
  } = useContext(UIContext);

  if (!cityInfo) {
    return null;
  }

  const cityCode = cityInfo.properties.CD_MUN;

  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [activePage, setActivePage] = useState('overview');

  const handlePageChange = useCallback((page) => {
    setActivePage(page);
  }, []);

  useEffect(() => {
    if (indicadoresData && cityCode) {
      const years = [...new Set(indicadoresData
        .filter(indicator => indicator.Codigo_Municipio === cityCode)
        .map(indicator => indicator.Ano_Observacao))]
        .sort((a, b) => b - a);
      setAvailableYears(years);
      setSelectedYear(years[0] || '');
    }
  }, [indicadoresData, cityCode]);

  const cityIndicators = indicadoresData ? indicadoresData.filter(indicator =>
    indicator.Codigo_Municipio === cityCode && indicator.Ano_Observacao === selectedYear
  ) : [];

  const sortByPosicionalIndex = (indicators, ascending = false) => {
    return [...indicators].sort((a, b) => {
      const indexA = parseFloat(a.Indice_Posicional);
      const indexB = parseFloat(b.Indice_Posicional);
      return ascending ? indexA - indexB : indexB - indexA;
    });
  };

  const topIndicators = sortByPosicionalIndex(cityIndicators).slice(0, 3);
  const bottomIndicators = sortByPosicionalIndex(cityIndicators, true).slice(0, 3);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleClose = () => {
    setSelectedCityInfo(null); // Usa o setter do UIContext
  };

  const renderPageContent = () => {
    switch (activePage) {
      case 'overview':
        return (
          <>
            <div className="city-info-column">
              <div className="city-profile">
                <CityProfileSummary cityData={cityInfo.properties} />
              </div>
            </div>
            <div className="indicator-columns">
              <div className="indicator-column">
                <div className="column-title">Top 3 Indicadores (Maiores Índices)</div>
                {topIndicators.map((indicator, index) => (
                  <div key={`top-${index}`} className="indicator-card">
                    <div className="indicator-name">{indicator.Nome_Indicador}</div>
                    <div className="indicator-value" style={{ color: 'green' }}>Índice: {indicator.Indice_Posicional}</div>
                  </div>
                ))}
              </div>
              <div className="indicator-column">
                <div className="column-title">Bottom 3 Indicadores (Menores Índices)</div>
                {bottomIndicators.map((indicator, index) => (
                  <div key={`bottom-${index}`} className="indicator-card">
                    <div className="indicator-name">{indicator.Nome_Indicador}</div>
                    <div className="indicator-value" style={{ color: 'red' }}>Índice: {indicator.Indice_Posicional}</div>
                  </div>
                ))}
              </div>
              <div className="year-selector-indicators">
                <label htmlFor="indicator-year-select">Ano:</label>
                <select id="indicator-year-select" value={selectedYear} onChange={handleYearChange} disabled={!availableYears || availableYears.length === 0}>
                  <option value="">Selecione um ano</option>
                  {availableYears.map(year => (<option key={year} value={year}>{year}</option>))}
                </select>
              </div>
            </div>
          </>
        );
      case 'indicators':
        return (
          <div className="page-content-container">
            <h3>Lista de Indicadores ({selectedYear})</h3>
            <div className="indicators-list">
              {cityIndicators.length > 0 ? cityIndicators.map((indicator, index) => (
                <div key={`indicator-${index}`} className="indicator-item">
                  <span className="indicator-name">{indicator.Nome_Indicador}</span>
                  <span className="indicator-value">Índice: {indicator.Indice_Posicional} | Valor: {indicator.Valor}</span>
                </div>
              )) : <p>Nenhum indicador disponível para este ano.</p>}
            </div>
            <div className="year-selector">
              <label htmlFor="indicator-year-select-page">Ano:</label>
              <select id="indicator-year-select-page" value={selectedYear} onChange={handleYearChange} disabled={!availableYears || availableYears.length === 0}>
                <option value="">Selecione um ano</option>
                {availableYears.map(year => (<option key={year} value={year}>{year}</option>))}
              </select>
            </div>
          </div>
        );
      case 'timeSeries':
        return (
          <div className="page-content-container">
            <TimeSeriesView
              indicadoresData={indicadoresData}
              selectedCity={cityInfo}
            />
          </div>
        );
      case 'indicatorComparison':
        return (
          <div className="page-content-container">
            <h3>Comparação de Indicadores ({selectedYear})</h3>
            <div className="comparison-controls">
              <div className="selector-group">
                <label htmlFor="indicator-year-comparison">Ano:</label>
                <select id="indicator-year-comparison" value={selectedYear} onChange={handleYearChange} disabled={!availableYears || availableYears.length === 0}>
                  <option value="">Selecione um ano</option>
                  {availableYears.map(year => (<option key={`comparison-year-${year}`} value={year}>{year}</option>))}
                </select>
              </div>
            </div>
            <IndicatorComparisonBarChart
              indicadoresData={indicadoresData}
              cityCode={cityCode}
              selectedYear={selectedYear}
            />
          </div>
        );
      case 'rawData':
        return (
          <div className="page-content-container">
            <h3>Dados Brutos</h3>
            <p>Acesse os dados brutos do município {cityInfo.properties.NM_MUN || cityInfo.properties.NAME}.</p>
            <button className="download-button" onClick={() => alert('Funcionalidade de download a ser implementada.')}>Download CSV (placeholder)</button>
          </div>
        );
      default:
        return <p>Página não encontrada</p>;
    }
  };

  return (
    <div className="city-info-bottom-bar">
      <button onClick={handleClose} className="close-button" aria-label="Fechar barra de informações">X</button> {/* Usando handleClose */}
      <div className="bar-header">
        <h2>{cityInfo.properties.NM_MUN || cityInfo.properties.NAME}</h2>
      </div>
      <div className="bar-content">
        {renderPageContent()}
      </div>
      <div className="navigation-area">
        <div className="pages-navigation">
          <button className={`page-button ${activePage === 'overview' ? 'active' : ''}`} onClick={() => handlePageChange('overview')}>Visão Geral</button>
          <button className={`page-button ${activePage === 'indicators' ? 'active' : ''}`} onClick={() => handlePageChange('indicators')}>Indicadores</button>
          <button className={`page-button ${activePage === 'timeSeries' ? 'active' : ''}`} onClick={() => handlePageChange('timeSeries')}>Série Temporal</button>
          <button className={`page-button ${activePage === 'indicatorComparison' ? 'active' : ''}`} onClick={() => handlePageChange('indicatorComparison')}>Comparação</button>
          <button className={`page-button ${activePage === 'rawData' ? 'active' : ''}`} onClick={() => handlePageChange('rawData')}>Dados Brutos</button>
        </div>
      </div>
    </div>
  );
};

export default CityInfoBottomBar;
