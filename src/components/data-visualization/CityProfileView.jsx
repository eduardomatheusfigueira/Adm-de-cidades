import React, { useState, useEffect } from 'react';
import '../../styles/data-visualization/CityProfileView.css';

const CityProfileView = ({ city, indicadoresData }) => {
  const [cityIndicators, setCityIndicators] = useState([]);
  const [recentIndicators, setRecentIndicators] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  // Extract city indicators and available years
  useEffect(() => {
    if (!city || !indicadoresData) return;

    // Filter indicators for this city
    const indicators = indicadoresData.filter(
      ind => ind.Codigo_Municipio === city.Codigo_Municipio
    );

    // Get unique years
    const years = [...new Set(indicators.map(ind => ind.Ano_Observacao))].sort();
    
    // Set most recent year as default
    const mostRecentYear = years.length > 0 ? years[years.length - 1] : '';
    
    setCityIndicators(indicators);
    setAvailableYears(years);
    setSelectedYear(mostRecentYear);
  }, [city, indicadoresData]);

  // Filter indicators for selected year
  useEffect(() => {
    if (!cityIndicators.length || !selectedYear) {
      setRecentIndicators([]);
      return;
    }

    // Get indicators for selected year
    const yearIndicators = cityIndicators.filter(
      ind => ind.Ano_Observacao === selectedYear
    );

    // Sort by indicator name
    yearIndicators.sort((a, b) => a.Nome_Indicador.localeCompare(b.Nome_Indicador));

    setRecentIndicators(yearIndicators);
  }, [cityIndicators, selectedYear]);

  // Handle year selection change
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  if (!city) {
    return (
      <div className="no-city-selected">
        <p>Selecione um município para visualizar seu perfil.</p>
      </div>
    );
  }

  return (
    <div className="city-profile-view">
      <div className="city-profile-header">
        <div className="city-basic-info">
          <h2>{city.Nome_Municipio}</h2>
          <div className="city-location">
            <span className="state">{city.Sigla_Estado}</span>
            <span className="region">{city.Sigla_Regiao}</span>
            {city.Capital === 'true' && <span className="capital-badge">Capital</span>}
          </div>
        </div>
        
        {availableYears.length > 0 && (
          <div className="year-selector">
            <label>Ano de Referência:</label>
            <select value={selectedYear} onChange={handleYearChange}>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="city-details">
        <div className="city-card">
          <h3>Informações Gerais</h3>
          <div className="city-info-grid">
            <div className="info-item">
              <span className="info-label">Código IBGE</span>
              <span className="info-value">{city.Codigo_Municipio}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Área</span>
              <span className="info-value">{parseFloat(city.Area_Municipio).toLocaleString('pt-BR')} km²</span>
            </div>
            <div className="info-item">
              <span className="info-label">Altitude</span>
              <span className="info-value">{parseFloat(city.Altitude_Municipio).toLocaleString('pt-BR')} m</span>
            </div>
            <div className="info-item">
              <span className="info-label">Coordenadas</span>
              <span className="info-value">
                {parseFloat(city.Latitude_Municipio).toFixed(4)}, {parseFloat(city.Longitude_Municipio).toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {recentIndicators.length > 0 ? (
          <div className="indicators-section">
            <h3>Indicadores ({selectedYear})</h3>
            <div className="indicators-grid">
              {recentIndicators.map(indicator => (
                <div key={indicator.Nome_Indicador} className="indicator-card">
                  <h4>{indicator.Nome_Indicador}</h4>
                  <div className="indicator-values">
                    <div className="indicator-value">
                      <span className="value-label">Valor</span>
                      <span className="value-number">{parseFloat(indicator.Valor).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="indicator-position">
                      <span className="position-label">Posição</span>
                      <span className="position-number">{indicator.Indice_Posicional}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-indicators">
            <p>Não há indicadores disponíveis para este município{selectedYear ? ` no ano ${selectedYear}` : ''}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityProfileView;
