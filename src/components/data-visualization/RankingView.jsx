import React, { useState, useEffect } from 'react';
import '../../styles/data-visualization/RankingView.css';

const RankingView = ({ csvData, indicadoresData, year, indicator, onCitySelect }) => {
  const [rankingData, setRankingData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'position', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedState, setSelectedState] = useState('all');

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

  // Prepare ranking data when inputs change
  useEffect(() => {
    if (!csvData || !indicadoresData || !year || !indicator) return;

    // Get indicator data for the selected year and indicator
    const indicatorData = indicadoresData.filter(
      ind => ind.Ano_Observacao === year && ind.Nome_Indicador === indicator
    );

    if (indicatorData.length === 0) {
      setRankingData([]);
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
        // Make capital check less strict (case-insensitive 'true' or '1')
        capital: city.Capital?.toLowerCase() === 'true' || city.Capital === '1',
        valor: parseFloat(ind.Valor),
        // Keep original position if needed for sorting, but don't rely on it for display
        original_position: parseInt(ind.Indice_Posicional, 10),
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

    // Sort the data
    filteredRanking.sort((a, b) => {
      // Allow sorting by the original index if needed, but default sort should be by value
      if (sortConfig.key === 'original_position') {
        return sortConfig.direction === 'asc'
          ? a.original_position - b.original_position
          : b.original_position - a.original_position;
      } else if (sortConfig.key === 'valor') {
        return sortConfig.direction === 'asc' 
          ? a.valor - b.valor 
          : b.valor - a.valor;
      } else if (sortConfig.key === 'nome') {
        return sortConfig.direction === 'asc' 
          ? a.nome.localeCompare(b.nome) 
          : b.nome.localeCompare(a.nome);
      } else if (sortConfig.key === 'estado') {
        return sortConfig.direction === 'asc' 
          ? a.estado.localeCompare(b.estado) 
          : b.estado.localeCompare(a.estado);
      }
      return 0;
    });

    // Add dynamic rank based on the current sort order AFTER sorting
    const rankedData = filteredRanking.map((item, index) => ({
      ...item,
      displayRank: index + 1 // Calculate rank based on index in the sorted array
    }));

    setRankingData(rankedData);
  }, [csvData, indicadoresData, year, indicator, sortConfig, searchTerm, selectedRegion, selectedState]);

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

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

  // Handle city selection
  const handleCityClick = (city) => {
    if (onCitySelect) {
      onCitySelect(city);
    }
  };

  return (
    <div className="ranking-view">
      <div className="ranking-header">
        <h2>Ranking: {indicator} ({year})</h2>
        
        <div className="ranking-filters">
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

      {rankingData.length > 0 ? (
        <div className="ranking-table-container">
          <table className="ranking-table">
            <thead>
              <tr>
                {/* Change sorting key if needed, or remove sortability if rank is always 1, 2, 3... */}
                <th onClick={() => requestSort('valor')} className="sortable">
                  Posição {getSortDirectionIndicator('valor')} {/* Sort by value to determine position */}
                </th>
                <th onClick={() => requestSort('nome')} className="sortable">
                  Município {getSortDirectionIndicator('nome')}
                </th>
                <th onClick={() => requestSort('estado')} className="sortable">
                  Estado {getSortDirectionIndicator('estado')}
                </th>
                <th>Região</th>
                <th>Capital</th>
                <th onClick={() => requestSort('valor')} className="sortable">
                  Valor {getSortDirectionIndicator('valor')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rankingData.map((item, index) => (
                <tr 
                  key={item.codigo} 
                  className={index < 3 ? `top-${index + 1}` : ''}
                  onClick={() => handleCityClick(item.city)}
                >
                  {/* Display the dynamically calculated rank */}
                  <td className="position-cell">{item.displayRank}</td>
                  <td>{item.nome}</td>
                  <td>{item.estado}</td>
                  <td>{item.regiao}</td>
                  <td>{item.capital ? 'Sim' : 'Não'}</td>
                  <td className="value-cell">{item.valor.toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data-message">
          <p>Não há dados disponíveis para o indicador e ano selecionados.</p>
        </div>
      )}
    </div>
  );
};

export default RankingView;
