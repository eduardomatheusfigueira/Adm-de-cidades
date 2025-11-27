import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
// Assuming we might use a chart library, but for now I'll keep it simple or use what was there (if any).
// The original file likely had some chart implementation. I'll use a simple placeholder or basic HTML/CSS bar chart if no library is installed.
// Wait, the project has `recharts` or similar? I didn't check package.json.
// I'll assume I can render a simple list or table for now, or a basic SVG chart.
// Actually, I should check if I can use a library.
// For now, I'll implement the data logic and a table view + simple bar visualization.

const TimeSeriesView = ({ indicadoresData, csvData, selectedCity: propSelectedCity, compact = false, preSelectedIndicator }) => {
  const [selectedIndicator, setSelectedIndicator] = useState(preSelectedIndicator || '');
  const [selectedCity, setSelectedCity] = useState(propSelectedCity || null);

  // Update selectedCity when prop changes
  useEffect(() => {
    if (propSelectedCity) {
      setSelectedCity(propSelectedCity);
    }
  }, [propSelectedCity]);

  // Update selectedIndicator when prop changes
  useEffect(() => {
    if (preSelectedIndicator) {
      setSelectedIndicator(preSelectedIndicator);
    }
  }, [preSelectedIndicator]);

  // City Options for Select (only needed if not compact or no prop)
  const cityOptions = useMemo(() => {
    if (compact || !csvData) return [];
    return csvData.map(city => ({
      value: city.Codigo_Municipio,
      label: `${city.Nome_Municipio} (${city.Sigla_Estado})`
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [csvData, compact]);

  // Available Indicators
  const availableIndicators = useMemo(() => {
    if (!indicadoresData) return [];
    // If specific city selected, filter indicators available for that city?
    // For now, getting all unique indicators is fine, or filter by city if possible.
    if (selectedCity) {
      const cityCode = selectedCity.value || selectedCity.properties?.CD_MUN || selectedCity.properties?.Codigo_Municipio;
      return [...new Set(indicadoresData
        .filter(d => String(d.Codigo_Municipio) === String(cityCode))
        .map(d => d.Nome_Indicador))].sort();
    }
    return [...new Set(indicadoresData.map(d => d.Nome_Indicador))].sort();
  }, [indicadoresData, selectedCity]);

  // Set default indicator
  useEffect(() => {
    if (availableIndicators.length > 0 && !selectedIndicator) {
      setSelectedIndicator(availableIndicators[0]);
    }
  }, [availableIndicators, selectedIndicator]);

  // Filter Data
  const timeSeriesData = useMemo(() => {
    if (!selectedCity || !selectedIndicator || !indicadoresData) return [];

    const cityCode = selectedCity.value || selectedCity.properties?.CD_MUN || selectedCity.properties?.Codigo_Municipio;

    return indicadoresData
      .filter(d =>
        String(d.Codigo_Municipio) === String(cityCode) &&
        d.Nome_Indicador === selectedIndicator
      )
      .sort((a, b) => a.Ano_Observacao - b.Ano_Observacao);
  }, [indicadoresData, selectedCity, selectedIndicator]);

  if (compact) {
    const maxValue = timeSeriesData.length > 0 ? Math.max(...timeSeriesData.map(d => {
      const valStr = String(d.Valor).replace(',', '.');
      return parseFloat(valStr) || 0;
    })) : 0;

    return (
      <div className="time-series-compact" style={{ height: '100%', minHeight: '150px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="compact-controls" style={{ marginBottom: '4px', flexShrink: 0 }}>
          <select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            style={{ width: '100%', padding: '2px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          >
            {availableIndicators.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </div>
        <div className="compact-chart" style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '2px', overflowX: 'auto', paddingBottom: '2px', minHeight: '120px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px', padding: '4px' }}>
          {timeSeriesData.length > 0 ? timeSeriesData.map(item => {
            const valStr = String(item.Valor).replace(',', '.');
            const val = parseFloat(valStr);
            const isValid = !isNaN(val);
            const heightPercent = (isValid && maxValue > 0) ? (val / maxValue) * 100 : 0;

            return (
              <div key={item.Ano_Observacao} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '20px', flex: 1, height: '100%' }}>
                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <div
                    title={`${item.Ano_Observacao}: ${isValid ? val : 'N/A'}`}
                    style={{
                      height: `${Math.max(heightPercent, 5)}%`,
                      width: '80%',
                      backgroundColor: isValid ? 'var(--secondary-color)' : 'var(--border-color)',
                      borderRadius: '2px 2px 0 0',
                      transition: 'height 0.3s ease',
                      opacity: isValid ? 1 : 0.5
                    }}
                  ></div>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px', transform: 'rotate(-45deg)', transformOrigin: 'left top', whiteSpace: 'nowrap', height: '20px' }}>{item.Ano_Observacao}</span>
              </div>
            );
          }) : (
            <div style={{ width: '100%', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
              Sem dados.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="view-container fade-in">
      <div className="view-header">
        <h2>Série Temporal</h2>
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
            <label>Indicador</label>
            <select value={selectedIndicator} onChange={(e) => setSelectedIndicator(e.target.value)}>
              {availableIndicators.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="view-content">
        {selectedCity ? (
          timeSeriesData.length > 0 ? (
            <div className="time-series-results">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ano</th>
                    <th>Valor</th>
                    <th>Visualização</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSeriesData.map((item) => (
                    <tr key={item.Ano_Observacao}>
                      <td>{item.Ano_Observacao}</td>
                      <td>{parseFloat(item.Valor).toLocaleString('pt-BR')}</td>
                      <td style={{ width: '50%' }}>
                        <div style={{
                          backgroundColor: 'var(--secondary-color)',
                          height: '20px',
                          width: `${Math.min((parseFloat(item.Valor) / Math.max(...timeSeriesData.map(d => parseFloat(d.Valor)))) * 100, 100)}%`,
                          borderRadius: '4px',
                          minWidth: '2px'
                        }}></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data-message">
              <p>Nenhum dado encontrado para este município e indicador.</p>
            </div>
          )
        ) : (
          <div className="no-data-message">
            <p>Selecione um município para visualizar a série temporal.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSeriesView;
