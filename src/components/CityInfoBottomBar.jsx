import React, { useState, useEffect, useCallback } from 'react';
import CityProfileSummary from './CityProfileSummary';
import '../styles/CityInfoBottomBar.css';
import TimeSeriesView from './data-visualization/TimeSeriesView';
import IndicatorComparisonBarChart from './data-visualization/IndicatorComparisonBarChart'; // Import IndicatorComparisonBarChart

const CityInfoBottomBar = ({ cityInfo, onClose, cities, onCitySelect, indicadoresData }) => {
  if (!cityInfo) {
    return null;
  }

  const cityCode = cityInfo.properties.CD_MUN;

  // State to manage selected year and active page
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [activePage, setActivePage] = useState('overview'); // State for active page, default to 'overview'
  // const [selectedCityName, setSelectedCityName] = useState(''); // Removed city name state

  // Use useCallback to ensure handlePageChange is not re-created on every render
  const handlePageChange = useCallback((page) => {
    setActivePage(page); // Update activePage state in CityInfoBottomBar
  }, []);

  useEffect(() => {
    if (indicadoresData && cityCode) {
      // Extract available years for the current city
      const years = [...new Set(indicadoresData
        .filter(indicator => indicator.Codigo_Municipio === cityCode)
        .map(indicator => indicator.Ano_Observacao))]
        .sort((a, b) => b - a); // Sort years in descending order (most recent first)
      setAvailableYears(years);
      // Set initial selected year to the most recent year available or default to the first year
      setSelectedYear(years[0] || '');
    }
  }, [indicadoresData, cityCode]);

  useEffect(() => {
    // Update selectedCityName when cityInfo changes - Removed city name update
    // if (cityInfo && cityInfo.properties && cityInfo.properties.NM_MUN) {
    //   const cityName = cityInfo.properties.NM_MUN.split(' - ')[0]; // Split and take first part
    //   setSelectedCityName(cityName);
    // } else {
    //   setSelectedCityName(''); // or some default value if appropriate
    // }
  }, [cityInfo]);

  useEffect(() => {
    // Determine the range of cities to display
    if (cities && cityInfo) {
      const selectedIndex = cities.findIndex(city => city.Codigo_Municipio === cityCode);
      const startIndex = Math.max(0, selectedIndex - 2);
      const endIndex = Math.min(cities.length - 1, selectedIndex + 2);
      const slicedCities = cities.slice(startIndex, endIndex + 1);
      // setDisplayedCities(slicedCities); // displayedCities is not used anymore
    }
  }, [cities, cityInfo, cityCode]);

  const cityIndicators = indicadoresData.filter(indicator =>
    indicator.Codigo_Municipio === cityCode && indicator.Ano_Observacao === selectedYear
  );

  // Function to sort indicators by Indice_Posicional
  const sortByPosicionalIndex = (indicators, ascending = false) => {
    return [...indicators].sort((a, b) => {
      const indexA = parseFloat(a.Indice_Posicional);
      const indexB = parseFloat(b.Indice_Posicional);
      return ascending ? indexA - indexB : indexB - indexA;
    });
  };

  // Get top 3 and bottom 3 indicators
  const topIndicators = sortByPosicionalIndex(cityIndicators).slice(0, 3);
  const bottomIndicators = sortByPosicionalIndex(cityIndicators, true).slice(0, 3);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // const handleCityNameChange = (event) => { // Removed city name change handler
  //   setSelectedCityName(event.target.value);
  //   const selectedCity = cities.find(city => city.Nome_Municipio === event.target.value);
  //   if (selectedCity) {
  //     onCitySelect(selectedCity); // Use onCitySelect to update the selected city
  //   }
  // };


  // Render different content based on active page
  const renderPageContent = () => {
    console.log("renderPageContent called, activePage:", activePage);
    switch (activePage) {
      case 'overview':
        // Overview page shows city info and indicators
        return (
          <>
            <div className="city-info-column">
              <div className="city-selector">
                {/* City selector removed */}
              </div>
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
                <select
                  id="indicator-year-select"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );
      case 'indicators':
        return (
          <div className="page-content-container">
            <h3>Lista de Indicadores</h3>
            <div className="indicators-list">
              {cityIndicators.map((indicator, index) => (
                <div key={`indicator-${index}`} className="indicator-item">
                  <span className="indicator-name">{indicator.Nome_Indicador}</span>
                  <span className="indicator-value">Índice: {indicator.Indice_Posicional}</span>
                </div>
              ))}
            </div>
            <div className="year-selector">
              <label htmlFor="indicator-year-select-page">Ano:</label>
              <select
                id="indicator-year-select-page"
                value={selectedYear}
                onChange={handleYearChange}
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
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
              selectedYear={selectedYear}
            />
          </div>
        );
      case 'indicatorComparison': // Renamed page to indicatorComparison
        return (
          <div className="page-content-container">
            <h3>Comparação de Indicadores</h3>
            <div className="comparison-controls">
              <div className="selector-group">
                <label htmlFor="indicator-year-comparison">Ano:</label>
                <select
                  id="indicator-year-comparison"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {availableYears.map(year => (
                    <option key={`comparison-year-${year}`} value={year}>{year}</option>
                  ))}
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
            <p>Acesse os dados brutos do município {cityInfo.properties.NM_MUN}.</p>
            <button className="download-button">Download CSV</button>
          </div>
        );
      default:
        return <p>Página não encontrada</p>;
    }
  };

  return (
    <div className="city-info-bottom-bar">
      <div className="bar-header"> {/* Header for city selection */}
        <div className="city-selector">
          {/* City selector removed */}
        </div>
      </div>
      {/* Content area - shows different content based on active page */}
      <div className="bar-content">
        {renderPageContent()}
      </div>

      {/* Navigation menu - always at the bottom */}
      <div className="navigation-area">
        <div className="pages-navigation">
          <button
            className={`page-button ${activePage === 'overview' ? 'active' : ''}`}
            onClick={() => handlePageChange('overview')}
          >
            Visão Geral
          </button>
          <button
            className={`page-button ${activePage === 'indicators' ? 'active' : ''}`}
            onClick={() => handlePageChange('indicators')}
          >
            Indicadores
          </button>
          <button
            className={`page-button ${activePage === 'timeSeries' ? 'active' : ''}`}
            onClick={() => handlePageChange('timeSeries')}
          >
            Série Temporal
          </button>
          <button
            className={`page-button ${activePage === 'indicatorComparison' ? 'active' : ''}`}
            onClick={() => handlePageChange('indicatorComparison')} // Updated page name
          >
            Comparação de Indicadores
          </button>
          <button
            className={`page-button ${activePage === 'rawData' ? 'active' : ''}`}
            onClick={() => handlePageChange('rawData')}
          >
            Dados Brutos
          </button>
        </div>
      </div>
    </div>
  );
};

export default CityInfoBottomBar;
