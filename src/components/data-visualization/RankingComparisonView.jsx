import React, { useState, useEffect } from 'react';
import '../../styles/data-visualization/RankingComparisonView.css';

const RankingComparisonView = ({
  csvData,
  indicadoresData,
  leftYear,
  leftIndicator,
  rightYear,
  rightIndicator,
  onCitySelect,
  cities // ADD CITIES PROP
}) => {
  const [leftRanking, setLeftRanking] = useState([]);
  const [rightRanking, setRightRanking] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [highlightedCities, setHighlightedCities] = useState([]);
  const [selectedCityLeft, setSelectedCityLeft] = useState(''); // State for left city selector
  const [selectedCityRight, setSelectedCityRight] = useState(''); // State for right city selector

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

  // Prepare left ranking data
  useEffect(() => {
    if (!csvData || !indicadoresData || !leftYear || !leftIndicator) {
      setLeftRanking([]);
      return;
    }

    // Get indicator data for the selected year and indicator
    const indicatorData = indicadoresData.filter(
      ind => ind.Ano_Observacao === leftYear && ind.Nome_Indicador === leftIndicator
    );

    if (indicatorData.length === 0) {
      setLeftRanking([]);
      return;
    }

    // Join indicator data with city data
    const ranking = indicatorData.map(ind => {
      const city = csvData.find(c => c.Codigo_Municipio === ind.Codigo_Municipio);
      if (!city) return null;

      return {
        codigo: ind.Codigo_Municipio,
        nome: city.Nome_Municipio,
        estado: city.Sigla_Estado,
        regiao: city.Sigla_Regiao,
        capital: city.Capital === 'true',
        valor: parseFloat(ind.Valor),
        position: parseInt(ind.Indice_Posicional, 10),
        city: city // Store the full city object for reference
      };
    }).filter(Boolean);

    // Apply filters
    let filteredRanking = [...ranking];

    // Filter by region
    if (selectedRegion !== 'all') {
      filteredRanking = filteredRanking.filter(item => item.regiao === selectedRegion);
    }

    // Filter by state
    if (selectedState !== 'all') {
      filteredRanking = filteredRanking.filter(item => item.estado === selectedState);
    }

    // Filter by search term
    if (searchTerm) {
      const normalizedSearchTerm = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      filteredRanking = filteredRanking.filter(item => {
        const normalizedName = item.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normalizedName.includes(normalizedSearchTerm);
      });
    }

    // Sort by position
    filteredRanking.sort((a, b) => a.position - b.position);

    setLeftRanking(filteredRanking);
  }, [csvData, indicadoresData, leftYear, leftIndicator, searchTerm, selectedRegion, selectedState]);

  // Prepare right ranking data
  useEffect(() => {
    if (!csvData || !indicadoresData || !rightYear || !rightIndicator) {
      setRightRanking([]);
      return;
    }

    // Get indicator data for the selected year and indicator
    const indicatorData = indicadoresData.filter(
      ind => ind.Ano_Observacao === rightYear && ind.Nome_Indicador === rightIndicator
    );

    if (indicatorData.length === 0) {
      setRightRanking([]);
      return;
    }

    // Join indicator data with city data
    const ranking = indicatorData.map(ind => {
      const city = csvData.find(c => c.Codigo_Municipio === ind.Codigo_Municipio);
      if (!city) return null;

      return {
        codigo: ind.Codigo_Municipio,
        nome: city.Nome_Municipio,
        estado: city.Sigla_Estado,
        regiao: city.Sigla_Regiao,
        capital: city.Capital === 'true',
        valor: parseFloat(ind.Valor),
        position: parseInt(ind.Indice_Posicional, 10),
        city: city // Store the full city object for reference
      };
    }).filter(Boolean);

    // Apply filters
    let filteredRanking = [...ranking];

    // Filter by region
    if (selectedRegion !== 'all') {
      filteredRanking = filteredRanking.filter(item => item.regiao === selectedRegion);
    }

    // Filter by state
    if (selectedState !== 'all') {
      filteredRanking = filteredRanking.filter(item => item.estado === selectedState);
    }

    // Filter by search term
    if (searchTerm) {
      const normalizedSearchTerm = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      filteredRanking = filteredRanking.filter(item => {
        const normalizedName = item.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normalizedName.includes(normalizedSearchTerm);
      });
    }

    // Sort by position
    filteredRanking.sort((a, b) => a.position - b.position);

    setRightRanking(filteredRanking);
  }, [csvData, indicadoresData, rightYear, rightIndicator, searchTerm, selectedRegion, selectedState]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle region selection change
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedState('all'); // Reset state when region changes
  };

  // Handle state selection change
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  // Handle city hover
  const handleCityHover = (cityCode) => {
    setHighlightedCities([cityCode]);
  };

  // Handle city click
  const handleCityClick = (city) => {
    if (onCitySelect) {
      onCitySelect(city);
    }
  };

  // Check if both rankings have data
  const hasData = leftRanking.length > 0 && rightRanking.length > 0;

  // Find common cities in both rankings
  const commonCities = hasData
    ? leftRanking
        .filter(leftCity => rightRanking.some(rightCity => rightCity.codigo === leftCity.codigo))
        .map(city => city.codigo)
    : [];

  // Handle city selection for left selector
  const handleCitySelectLeft = (event) => {
    setSelectedCityLeft(event.target.value);
  };

  // Handle city selection for right selector
  const handleCitySelectRight = (event) => {
    setSelectedCityRight(event.target.value);
  };

  useEffect(() => { // ADDED useEffect to log cities prop
    console.log("RankingComparisonView cities prop:", cities);
  }, [cities]);

  // LOG 3: Verificar props recebidas e hasData
  console.log("RankingComparisonView props:", {
    leftYear,
    leftIndicator,
    rightYear,
    rightIndicator,
  });
  console.log("RankingComparisonView hasData:", hasData);

  return (
    <div className="ranking-comparison-view">
      <div className="comparison-header">
        <h2>Comparação de Rankings</h2>

        <div className="comparison-filters">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Buscar município..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="region-filter">
            <select value={selectedRegion} onChange={handleRegionChange}>
              <option value="all">Todas as Regiões</option>
              {uniqueRegions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="state-filter">
            <select
              value={selectedState}
              onChange={handleStateChange}
              disabled={selectedRegion === 'all' && availableStates.length === 0}
            >
              <option value="all">Todos os Estados</option>
              {availableStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="city-selection-container"> {/* Container for city selectors */}
        <div className="city-selector left-city-selector">
          <label htmlFor="city-select-left">Selecionar Cidade 1:</label>
          <select
            id="city-select-left"
            value={selectedCityLeft}
            onChange={handleCitySelectLeft}
          >
            <option value="">Selecione uma cidade</option>
            {cities && cities.map(city => ( // Populate options from cities prop
              <option key={city.Codigo_Municipio} value={city.Codigo_Municipio}>
                {city.Nome_Municipio}
              </option>
            ))}
          </select>
        </div>

        <div className="city-selector right-city-selector">
          <label htmlFor="city-select-right">Selecionar Cidade 2:</label>
          <select
            id="city-select-right"
            value={selectedCityRight}
            onChange={handleCitySelectRight}
          >
            <option value="">Selecione outra cidade</option>
            {cities && cities.map(city => ( // Populate options from cities prop
              <option key={city.Codigo_Municipio} value={city.Codigo_Municipio}>
                {city.Nome_Municipio}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasData ? (
        <div className="rankings-container">
          <div className="ranking-column left-ranking">
            <h3>{leftIndicator} ({leftYear})</h3>
            <div className="ranking-table-container">
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th>Pos.</th>
                    <th>Município</th>
                    <th>UF</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {leftRanking.map((item) => (
                    <tr
                      key={item.codigo}
                      className={`
                        ${highlightedCities.includes(item.codigo) ? 'highlighted' : ''}
                        ${commonCities.includes(item.codigo) ? 'common-city' : ''}
                      `}
                      onMouseEnter={() => handleCityHover(item.codigo)}
                      onMouseLeave={() => setHighlightedCities([])}
                      onClick={() => handleCityClick(item.city)}
                    >
                      <td className="position-cell">{item.position}</td>
                      <td>{item.nome}</td>
                      <td>{item.estado}</td>
                      <td className="value-cell">{item.valor.toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ranking-column right-ranking">
            <h3>{rightIndicator} ({rightYear})</h3>
            <div className="ranking-table-container">
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th>Pos.</th>
                    <th>Município</th>
                    <th>UF</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {rightRanking.map((item) => (
                    <tr
                      key={item.codigo}
                      className={`
                        ${highlightedCities.includes(item.codigo) ? 'highlighted' : ''}
                        ${commonCities.includes(item.codigo) ? 'common-city' : ''}
                      `}
                      onMouseEnter={() => handleCityHover(item.codigo)}
                      onMouseLeave={() => setHighlightedCities([])}
                      onClick={() => handleCityClick(item.city)}
                    >
                      <td className="position-cell">{item.position}</td>
                      <td>{item.nome}</td>
                      <td>{item.estado}</td>
                      <td className="value-cell">{item.valor.toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data-message">
          <p>Selecione indicadores e anos para ambos os rankings para visualizar a comparação.</p>
        </div>
      )}

      <div className="selected-cities-display"> {/* Display selected cities */}
        {selectedCityLeft && selectedCityRight && (
          <p>
            Comparando cidades: {selectedCityLeft} e {selectedCityRight}
          </p>
        )}
      </div>
    </div>
  );
};

export default RankingComparisonView;
