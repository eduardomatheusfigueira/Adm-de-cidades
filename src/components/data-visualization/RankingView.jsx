import React, { useState, useMemo, useEffect } from 'react';

const RankingView = ({ indicadoresData, csvData }) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique years and indicators
  const availableYears = useMemo(() => {
    if (!indicadoresData) return [];
    return [...new Set(indicadoresData.map(d => d.Ano_Observacao))].sort((a, b) => b - a);
  }, [indicadoresData]);

  const availableIndicators = useMemo(() => {
    if (!indicadoresData) return [];
    // Filter indicators available for the selected year if one is selected
    const dataToUse = selectedYear
      ? indicadoresData.filter(d => d.Ano_Observacao === selectedYear)
      : indicadoresData;
    return [...new Set(dataToUse.map(d => d.Nome_Indicador))].sort();
  }, [indicadoresData, selectedYear]);

  // Set defaults
  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  useEffect(() => {
    if (availableIndicators.length > 0 && !selectedIndicator) {
      setSelectedIndicator(availableIndicators[0]);
    } else if (availableIndicators.length > 0 && !availableIndicators.includes(selectedIndicator)) {
      setSelectedIndicator(availableIndicators[0]);
    }
  }, [availableIndicators, selectedIndicator]);

  // Filter and Sort Data
  const rankingData = useMemo(() => {
    if (!selectedYear || !selectedIndicator || !indicadoresData) return [];

    const filtered = indicadoresData.filter(d =>
      d.Ano_Observacao === selectedYear &&
      d.Nome_Indicador === selectedIndicator
    );

    // Join with municipality data for names if needed
    const withNames = filtered.map(item => {
      const cityInfo = csvData?.find(c => c.Codigo_Municipio === item.Codigo_Municipio);
      return {
        ...item,
        Nome_Municipio: cityInfo?.Nome_Municipio || item.Nome_Municipio || item.Codigo_Municipio,
        Sigla_Estado: cityInfo?.Sigla_Estado || item.Sigla_Estado || ''
      };
    });

    // Sort by Value descending
    return withNames.sort((a, b) => parseFloat(b.Valor) - parseFloat(a.Valor));
  }, [indicadoresData, csvData, selectedYear, selectedIndicator]);

  // Filter by search term
  const displayedData = useMemo(() => {
    if (!searchTerm) return rankingData;
    const term = searchTerm.toLowerCase();
    return rankingData.filter(item =>
      item.Nome_Municipio.toLowerCase().includes(term) ||
      item.Codigo_Municipio.toString().includes(term)
    );
  }, [rankingData, searchTerm]);

  return (
    <div className="view-container fade-in">
      <div className="view-header">
        <h2>Ranking de Municípios</h2>
        <div className="view-controls">
          <div className="control-group">
            <label>Ano</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Indicador</label>
            <select value={selectedIndicator} onChange={(e) => setSelectedIndicator(e.target.value)}>
              {availableIndicators.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Pesquisar Município</label>
            <input
              type="text"
              placeholder="Nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="view-content">
        {displayedData.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Posição</th>
                <th>Município</th>
                <th>UF</th>
                <th>Valor</th>
                <th>Índice Posicional</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item, index) => (
                <tr key={`${item.Codigo_Municipio}-${index}`}>
                  <td>{index + 1}º</td>
                  <td>{item.Nome_Municipio}</td>
                  <td>{item.Sigla_Estado}</td>
                  <td>{parseFloat(item.Valor).toLocaleString('pt-BR')}</td>
                  <td>{item.Indice_Posicional ? parseFloat(item.Indice_Posicional).toFixed(4) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data-message">
            <p>Nenhum dado encontrado para os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingView;
