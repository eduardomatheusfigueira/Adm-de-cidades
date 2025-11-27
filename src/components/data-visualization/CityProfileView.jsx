import React, { useState, useMemo } from 'react';
import Select from 'react-select';

import '../../styles/CityProfileView.css';

const CityProfileView = ({ indicadoresData, csvData }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');

  // City Options
  const cityOptions = useMemo(() => {
    if (!csvData) return [];
    return csvData.map(city => ({
      value: city.Codigo_Municipio,
      label: `${city.Nome_Municipio} (${city.Sigla_Estado})`,
      data: city
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [csvData]);

  // Available Years
  const availableYears = useMemo(() => {
    if (!indicadoresData) return [];
    return [...new Set(indicadoresData.map(d => d.Ano_Observacao))].sort((a, b) => b - a);
  }, [indicadoresData]);

  // Default Year
  React.useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // City Data
  const cityIndicators = useMemo(() => {
    if (!selectedCity || !selectedYear || !indicadoresData) return [];
    return indicadoresData.filter(d =>
      d.Codigo_Municipio === selectedCity.value &&
      d.Ano_Observacao === selectedYear
    ).sort((a, b) => a.Nome_Indicador.localeCompare(b.Nome_Indicador));
  }, [indicadoresData, selectedCity, selectedYear]);

  return (
    <div className="view-container fade-in">
      <div className="view-header">
        <h2>Perfil do Município</h2>
        <div className="view-controls">
          <div className="control-group">
            <label>Município</label>
            <Select
              options={cityOptions}
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder="Selecione um município..."
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div className="control-group">
            <label>Ano</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="view-content">
        {selectedCity ? (
          <div className="profile-content">
            <div className="city-header-card">
              <div className="city-header-content">
                <h1>{selectedCity.data.Nome_Municipio}</h1>
                <p className="city-subtitle">{selectedCity.data.Sigla_Estado} - {selectedCity.data.Sigla_Regiao}</p>
              </div>
              <div className="city-stats">
                <div className="stat-item">
                  <small>Código IBGE</small>
                  <strong>{selectedCity.value}</strong>
                </div>
                <div className="stat-item">
                  <small>Capital</small>
                  <strong>{selectedCity.data.Capital === 'true' ? 'Sim' : 'Não'}</strong>
                </div>
                <div className="stat-item">
                  <small>Área</small>
                  <strong>{selectedCity.data.Area_Municipio} km²</strong>
                </div>
              </div>
            </div>

            <div className="indicators-grid">
              {cityIndicators.map((ind, idx) => (
                <div key={idx} className="indicator-card">
                  <h4>{ind.Nome_Indicador}</h4>
                  <div className="indicator-value">
                    {parseFloat(ind.Valor).toLocaleString('pt-BR')}
                  </div>
                  {ind.Indice_Posicional && (
                    <div className="indicator-meta">
                      <span>Índice:</span>
                      <strong>{parseFloat(ind.Indice_Posicional).toFixed(4)}</strong>
                    </div>
                  )}
                </div>
              ))}
              {cityIndicators.length === 0 && (
                <div className="no-data-message">
                  <p>Nenhum indicador encontrado para este ano.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-data-message">
            <p>Selecione um município para visualizar o perfil.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityProfileView;
