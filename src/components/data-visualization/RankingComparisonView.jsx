import React, { useState, useMemo, useEffect } from 'react';

const RankingComparisonView = ({ indicadoresData, csvData }) => {
  const [leftConfig, setLeftConfig] = useState({ year: '', indicator: '' });
  const [rightConfig, setRightConfig] = useState({ year: '', indicator: '' });

  // Extract unique years and indicators
  const availableYears = useMemo(() => {
    if (!indicadoresData) return [];
    return [...new Set(indicadoresData.map(d => d.Ano_Observacao))].sort((a, b) => b - a);
  }, [indicadoresData]);

  const availableIndicators = useMemo(() => {
    if (!indicadoresData) return [];
    return [...new Set(indicadoresData.map(d => d.Nome_Indicador))].sort();
  }, [indicadoresData]);

  // Set defaults
  useEffect(() => {
    if (availableYears.length > 0 && availableIndicators.length > 0) {
      if (!leftConfig.year) setLeftConfig(prev => ({ ...prev, year: availableYears[0], indicator: availableIndicators[0] }));
      if (!rightConfig.year) setRightConfig(prev => ({ ...prev, year: availableYears[0], indicator: availableIndicators[0] }));
    }
  }, [availableYears, availableIndicators, leftConfig.year, rightConfig.year]);

  const getData = (config) => {
    if (!config.year || !config.indicator || !indicadoresData) return [];
    const filtered = indicadoresData.filter(d =>
      d.Ano_Observacao === config.year &&
      d.Nome_Indicador === config.indicator
    );

    return filtered.map(item => {
      const cityInfo = csvData?.find(c => c.Codigo_Municipio === item.Codigo_Municipio);
      return {
        ...item,
        Nome_Municipio: cityInfo?.Nome_Municipio || item.Nome_Municipio || item.Codigo_Municipio,
        Sigla_Estado: cityInfo?.Sigla_Estado || item.Sigla_Estado || ''
      };
    }).sort((a, b) => parseFloat(b.Valor) - parseFloat(a.Valor));
  };

  const leftData = useMemo(() => getData(leftConfig), [leftConfig, indicadoresData, csvData]);
  const rightData = useMemo(() => getData(rightConfig), [rightConfig, indicadoresData, csvData]);

  return (
    <div className="view-container fade-in">
      <div className="view-header">
        <h2>Comparação de Rankings</h2>
      </div>

      <div className="comparison-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '100%', overflow: 'hidden' }}>
        {/* Left Panel */}
        <div className="comparison-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <div className="panel-controls" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--background-color)', borderRadius: 'var(--radius-md)' }}>
            <h3>Ranking 1</h3>
            <div className="control-group">
              <label>Ano</label>
              <select value={leftConfig.year} onChange={(e) => setLeftConfig({ ...leftConfig, year: e.target.value })}>
                {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <div className="control-group">
              <label>Indicador</label>
              <select value={leftConfig.indicator} onChange={(e) => setLeftConfig({ ...leftConfig, indicator: e.target.value })}>
                {availableIndicators.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
          </div>
          <div className="panel-content" style={{ flex: 1, overflow: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Município</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {leftData.map((item, index) => (
                  <tr key={item.Codigo_Municipio}>
                    <td>{index + 1}º</td>
                    <td>{item.Nome_Municipio}</td>
                    <td>{parseFloat(item.Valor).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="comparison-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <div className="panel-controls" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--background-color)', borderRadius: 'var(--radius-md)' }}>
            <h3>Ranking 2</h3>
            <div className="control-group">
              <label>Ano</label>
              <select value={rightConfig.year} onChange={(e) => setRightConfig({ ...rightConfig, year: e.target.value })}>
                {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <div className="control-group">
              <label>Indicador</label>
              <select value={rightConfig.indicator} onChange={(e) => setRightConfig({ ...rightConfig, indicator: e.target.value })}>
                {availableIndicators.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
          </div>
          <div className="panel-content" style={{ flex: 1, overflow: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Município</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {rightData.map((item, index) => (
                  <tr key={item.Codigo_Municipio}>
                    <td>{index + 1}º</td>
                    <td>{item.Nome_Municipio}</td>
                    <td>{parseFloat(item.Valor).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingComparisonView;
