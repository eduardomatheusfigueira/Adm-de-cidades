import React, { useState, useEffect } from 'react';
import RadarChart from './RadarChart'; // Import RadarChart
import '../../styles/data-visualization/RankingComparisonView.css';

const RankingComparisonView = ({
  csvData,
  indicadoresData,
  leftYear,
  leftIndicator,
  rightYear,
  rightIndicator,
  onCitySelect,
  cities // Prop for city selectors (assuming this comes from parent)
}) => {
  // State for rankings
  const [leftRanking, setLeftRanking] = useState([]);
  const [rightRanking, setRightRanking] = useState([]);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedState, setSelectedState] = useState('all');

  // State for UI interactions
  const [highlightedCities, setHighlightedCities] = useState([]);
  const [selectedCityLeft, setSelectedCityLeft] = useState(''); // State for left city selector (stores Codigo_Municipio)
  const [selectedCityRight, setSelectedCityRight] = useState(''); // State for right city selector (stores Codigo_Municipio)

  // State for Radar Charts
  const [leftRadarData, setLeftRadarData] = useState([]);
  const [leftRadarIndicators, setLeftRadarIndicators] = useState([]);
  const [rightRadarData, setRightRadarData] = useState([]);
  const [rightRadarIndicators, setRightRadarIndicators] = useState([]);

  // --- Data Processing ---

  // Extract unique regions and states for filter dropdowns
  const uniqueRegions = csvData ? [...new Set(csvData.map(city => city.Sigla_Regiao))].filter(Boolean).sort() : [];
  const uniqueStates = csvData ? [...new Set(csvData.map(city => city.Sigla_Estado))].filter(Boolean).sort() : [];

  // Get available states based on selected region
  const availableStates = selectedRegion === 'all'
    ? uniqueStates
    : csvData ? [...new Set(csvData
      .filter(city => city.Sigla_Regiao === selectedRegion)
      .map(city => city.Sigla_Estado)
    )].sort() : [];

  // Prepare ranking data (common function)
  const prepareRankingData = (year, indicator) => {
    if (!csvData || !indicadoresData || !year || !indicator) {
      return [];
    }
    const indicatorData = indicadoresData.filter(
      ind => ind.Ano_Observacao === year && ind.Nome_Indicador === indicator
    );
    if (indicatorData.length === 0) return [];

    const ranking = indicatorData.map(ind => {
      const city = csvData.find(c => c.Codigo_Municipio === ind.Codigo_Municipio);
      if (!city) return null;
      return {
        codigo: ind.Codigo_Municipio,
        nome: city.Nome_Municipio,
        estado: city.Sigla_Estado,
        regiao: city.Sigla_Regiao,
        capital: city.Capital?.toLowerCase() === 'true' || city.Capital === '1',
        valor: parseFloat(ind.Valor),
        original_position: parseInt(ind.Indice_Posicional, 10),
        city: city
      };
    }).filter(Boolean);

    let filteredRanking = [...ranking];
    if (selectedRegion !== 'all') filteredRanking = filteredRanking.filter(item => item.regiao === selectedRegion);
    if (selectedState !== 'all') filteredRanking = filteredRanking.filter(item => item.estado === selectedState);
    if (searchTerm) {
      const normalizedSearchTerm = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      filteredRanking = filteredRanking.filter(item => item.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearchTerm));
    }
    filteredRanking.sort((a, b) => b.valor - a.valor); // Sort by value desc
    return filteredRanking.map((item, index) => ({ ...item, displayRank: index + 1 }));
  };

  // Prepare left ranking data
  useEffect(() => {
    const data = prepareRankingData(leftYear, leftIndicator);
    setLeftRanking(data);
  }, [csvData, indicadoresData, leftYear, leftIndicator, searchTerm, selectedRegion, selectedState]);

  // Prepare right ranking data
  useEffect(() => {
    const data = prepareRankingData(rightYear, rightIndicator);
    setRightRanking(data);
  }, [csvData, indicadoresData, rightYear, rightIndicator, searchTerm, selectedRegion, selectedState]);

  // Define key indicators for Radar Chart
  const keyIndicatorNamesForRadar = [
    'POP_TOT - População total do município do ano de referência (Fonte: IBGE)',
    'PIB_CAP - PIB per capita a preços correntes (Fonte: IBGE)',
    'IDHM - Índice de Desenvolvimento Humano Municipal (Fonte: PNUD)',
    'Despesas Empenhadas em Educação e Cultura',
    'Despesas Empenhadas em Saúde e Saneamento',
    'Receita Tributária'
  ];

  // Prepare Left Radar Data
  useEffect(() => {
    if (!selectedCityLeft || !leftYear || !indicadoresData) {
      setLeftRadarData([]); setLeftRadarIndicators([]); return;
    }
    const cityData = indicadoresData.filter(ind =>
      ind.Codigo_Municipio === selectedCityLeft &&
      ind.Ano_Observacao === leftYear &&
      keyIndicatorNamesForRadar.includes(ind.Nome_Indicador)
    );
    if (cityData.length >= 3) {
      cityData.sort((a, b) => a.Nome_Indicador.localeCompare(b.Nome_Indicador));
      setLeftRadarIndicators(cityData.map(ind => ind.Nome_Indicador));
      setLeftRadarData(cityData.map(ind => parseFloat(ind.Indice_Posicional) || 0));
    } else {
      setLeftRadarData([]); setLeftRadarIndicators([]);
    }
  }, [selectedCityLeft, leftYear, indicadoresData]); // Removed keyIndicatorNamesForRadar dependency

  // Prepare Right Radar Data
  useEffect(() => {
    if (!selectedCityRight || !rightYear || !indicadoresData) {
      setRightRadarData([]); setRightRadarIndicators([]); return;
    }
     const cityData = indicadoresData.filter(ind =>
      ind.Codigo_Municipio === selectedCityRight &&
      ind.Ano_Observacao === rightYear &&
      keyIndicatorNamesForRadar.includes(ind.Nome_Indicador)
    );
    if (cityData.length >= 3) {
      cityData.sort((a, b) => a.Nome_Indicador.localeCompare(b.Nome_Indicador));
      setRightRadarIndicators(cityData.map(ind => ind.Nome_Indicador));
      setRightRadarData(cityData.map(ind => parseFloat(ind.Indice_Posicional) || 0));
    } else {
      setRightRadarData([]); setRightRadarIndicators([]);
    }
  }, [selectedCityRight, rightYear, indicadoresData]); // Removed keyIndicatorNamesForRadar dependency


  // --- Event Handlers ---
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleRegionChange = (e) => { setSelectedRegion(e.target.value); setSelectedState('all'); };
  const handleStateChange = (e) => setSelectedState(e.target.value);
  const handleCityHover = (cityCode) => setHighlightedCities([cityCode]);
  const handleCityClick = (city) => { if (onCitySelect) onCitySelect(city); };
  const handleCitySelectLeft = (event) => setSelectedCityLeft(event.target.value);
  const handleCitySelectRight = (event) => setSelectedCityRight(event.target.value);

  // Find common cities for highlighting (optional)
  const commonCities = (leftRanking.length > 0 && rightRanking.length > 0)
    ? leftRanking.filter(lc => rightRanking.some(rc => rc.codigo === lc.codigo)).map(c => c.codigo)
    : [];

  // Get city names for display
  const leftCityName = csvData?.find(c => c.Codigo_Municipio === selectedCityLeft)?.Nome_Municipio || selectedCityLeft;
  const rightCityName = csvData?.find(c => c.Codigo_Municipio === selectedCityRight)?.Nome_Municipio || selectedCityRight;

  // --- Render Logic ---
  return (
    <div className="ranking-comparison-view">
      <div className="comparison-header">
        <h2>Comparação de Rankings</h2>
        {/* Filters */}
        <div className="comparison-filters">
          <div className="search-filter"> <input type="text" placeholder="Buscar município..." value={searchTerm} onChange={handleSearchChange} className="search-input"/> </div>
          <div className="region-filter"> <select value={selectedRegion} onChange={handleRegionChange}> <option value="all">Todas as Regiões</option> {uniqueRegions.map(region => (<option key={region} value={region}>{region}</option>))} </select> </div>
          <div className="state-filter"> <select value={selectedState} onChange={handleStateChange} disabled={selectedRegion === 'all' && availableStates.length === 0}> <option value="all">Todos os Estados</option> {availableStates.map(state => (<option key={state} value={state}>{state}</option>))} </select> </div>
        </div>
      </div>

      {/* City Selectors */}
      <div className="city-selection-container">
        <div className="city-selector left-city-selector">
          <label htmlFor="city-select-left">Selecionar Cidade 1:</label>
          <select id="city-select-left" value={selectedCityLeft} onChange={handleCitySelectLeft}>
            <option value="">Selecione uma cidade</option>
            {csvData && csvData.map(city => (
              <option key={city.Codigo_Municipio} value={city.Codigo_Municipio}>
                {city.Nome_Municipio} ({city.Sigla_Estado})
              </option>
            ))}
          </select>
        </div>
        <div className="city-selector right-city-selector">
          <label htmlFor="city-select-right">Selecionar Cidade 2:</label>
          <select id="city-select-right" value={selectedCityRight} onChange={handleCitySelectRight}>
            <option value="">Selecione outra cidade</option>
             {csvData && csvData.map(city => (
              <option key={city.Codigo_Municipio} value={city.Codigo_Municipio}>
                {city.Nome_Municipio} ({city.Sigla_Estado})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rankings Container */}
      {(leftRanking.length > 0 || rightRanking.length > 0) ? (
        <div className="rankings-container">
          {/* Left Ranking Column */}
          {leftRanking.length > 0 ? (
            <div className="ranking-column left-ranking">
              <h3>{leftIndicator || 'Ranking 1'} ({leftYear || 'Ano'})</h3>
              {/* Render Left Radar Chart */}
              {selectedCityLeft && leftRadarData.length > 0 && (
                <div className="radar-chart-container">
                  <h4>Perfil Radar: {leftCityName}</h4>
                  <RadarChart data={leftRadarData} indicators={leftRadarIndicators} />
                </div>
              )}
              <div className="ranking-table-container">
                <table className="ranking-table">
                  <thead><tr><th>Posição</th><th>Município</th><th>UF</th><th>Valor</th></tr></thead>
                  <tbody>
                    {leftRanking.map((item) => (
                      <tr key={item.codigo} className={`${highlightedCities.includes(item.codigo) ? 'highlighted' : ''} ${commonCities.includes(item.codigo) ? 'common-city' : ''}`} onMouseEnter={() => handleCityHover(item.codigo)} onMouseLeave={() => setHighlightedCities([])} onClick={() => handleCityClick(item.city)}>
                        <td className="position-cell">{item.displayRank}</td>
                        <td>{item.nome}</td>
                        <td>{item.estado}</td>
                        <td className="value-cell">{item.valor?.toLocaleString('pt-BR') ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : ( <div className="ranking-column no-data-message"> <p>Não há dados para {leftIndicator || 'Ranking 1'} em {leftYear || 'Ano'}.</p> </div> )}

          {/* Right Ranking Column */}
          {rightRanking.length > 0 ? (
            <div className="ranking-column right-ranking">
              <h3>{rightIndicator || 'Ranking 2'} ({rightYear || 'Ano'})</h3>
              {/* Render Right Radar Chart */}
              {selectedCityRight && rightRadarData.length > 0 && (
                <div className="radar-chart-container">
                   <h4>Perfil Radar: {rightCityName}</h4>
                  <RadarChart data={rightRadarData} indicators={rightRadarIndicators} />
                </div>
              )}
              <div className="ranking-table-container">
                <table className="ranking-table">
                   <thead><tr><th>Posição</th><th>Município</th><th>UF</th><th>Valor</th></tr></thead>
                   <tbody>
                    {rightRanking.map((item) => (
                      <tr key={item.codigo} className={`${highlightedCities.includes(item.codigo) ? 'highlighted' : ''} ${commonCities.includes(item.codigo) ? 'common-city' : ''}`} onMouseEnter={() => handleCityHover(item.codigo)} onMouseLeave={() => setHighlightedCities([])} onClick={() => handleCityClick(item.city)}>
                        <td className="position-cell">{item.displayRank}</td>
                        <td>{item.nome}</td>
                        <td>{item.estado}</td>
                        <td className="value-cell">{item.valor?.toLocaleString('pt-BR') ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
           ) : ( <div className="ranking-column no-data-message"> <p>Não há dados para {rightIndicator || 'Ranking 2'} em {rightYear || 'Ano'}.</p> </div> )}
        </div>
      ) : (
        <div className="no-data-message full-width"> <p>Selecione indicadores e anos válidos para ambos os rankings para visualizar a comparação.</p> </div>
      )}

      {/* Selected Cities Display (Placeholder) */}
      {/* <div className="selected-cities-display">
        {selectedCityLeft && selectedCityRight && ( <p> Comparando cidades (IDs): {selectedCityLeft} e {selectedCityRight} </p> )}
      </div> */}
    </div>
  );
};

export default RankingComparisonView;
