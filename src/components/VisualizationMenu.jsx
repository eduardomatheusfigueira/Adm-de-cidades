import React, { useState, useEffect, useRef } from 'react';
    import '../styles/VisualizationMenu.css';

    const VisualizationMenu = ({
      csvData,
      indicadoresData,
      onVisualizationChange,
      csvHeaders,
      onFiltersApplied,
      onEnvironmentChange
    }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [visualizationType, setVisualizationType] = useState('attribute');
      const [selectedAttribute, setSelectedAttribute] = useState('Sigla_Regiao');
      const [selectedYear, setSelectedYear] = useState('');
      const [selectedIndicator, setSelectedIndicator] = useState('');
      const [indicatorValueType, setIndicatorValueType] = useState('value');
      const [availableYears, setAvailableYears] = useState([]);
      const [availableIndicators, setAvailableIndicators] = useState([]);
      const menuRef = useRef(null);
      const [cityFilter, setCityFilter] = useState('all');
      const [currentFilters, setCurrentFilters] = useState({});
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedRegion, setSelectedRegion] = useState('all');
      const [selectedState, setSelectedState] = useState('all');
      const [colorAttribute, setColorAttribute] = useState('Sigla_Regiao');
      const [activeVisualization, setActiveVisualization] = useState('map');

      const uniqueRegions = csvData ? [...new Set(csvData.map(city => city.Sigla_Regiao))].filter(Boolean).sort() : [];
      const uniqueStates = csvData ? [...new Set(csvData.map(city => city.Sigla_Estado))].filter(Boolean).sort() : [];

      useEffect(() => {
        if (selectedRegion !== 'all') {
          const statesInRegion = csvData ? [...new Set(
            csvData
              .filter(city => city.Sigla_Regiao === selectedRegion)
              .map(city => city.Sigla_Estado)
          )] : [];

          if (selectedState !== 'all' && statesInRegion.includes(selectedState)) {
            setSelectedState('all');
          }
        }
      }, [selectedRegion, csvData, selectedState]);

      const handleFilterChange = (event) => {
        setCityFilter(event.target.value);
      };

      const handleRegionChange = (event) => {
        setSelectedRegion(event.target.value);
      };

      const handleStateChange = (event) => {
        setSelectedState(event.target.value);
      };

      const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
      };

      const handleColorAttributeChange = (event) => {
        setColorAttribute(event.target.value);
      };

      const handleApplyFilters = () => {
        console.log("Aplicando filtros...");
        let tempData = [...csvData];
        console.log("Dados originais:", tempData.length);

        if (cityFilter === 'capital') {
          tempData = tempData.filter(city => city.Capital === 'true');
          console.log("Após filtro de capitais:", tempData.length);
        } else if (cityFilter === 'non-capital') {
          tempData = tempData.filter(city => city.Capital !== 'true');
          console.log("Após filtro de não-capitais:", tempData.length);
        }

        if (selectedRegion !== 'all') {
          tempData = tempData.filter(city => city.Sigla_Regiao === selectedRegion);
          console.log("Após filtro de região:", tempData.length);
        }

        if (selectedState !== 'all') {
          tempData = tempData.filter(city => city.Sigla_Estado === selectedState);
          console.log("Após filtro de estado:", tempData.length);
        }

        if (searchTerm.trim() !== '') {
          const normalizedSearchTerm = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          tempData = tempData.filter(city => {
            const normalizedCityName = (city.Nome_Municipio || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return normalizedCityName.includes(normalizedSearchTerm);
          });
          console.log("Após filtro de busca:", tempData.length);
        }

        Object.keys(currentFilters).forEach(filterKey => {
          const filterValue = currentFilters[filterKey];
          if (filterValue && filterValue !== 'all') {
            tempData = tempData.filter(city => city[filterKey] === filterValue);
          }
        });

        console.log("Dados filtrados finais:", tempData.length);
        console.log("Atributo de cor selecionado:", colorAttribute);

        onFiltersApplied(tempData, colorAttribute);
      };

      const handleResetFilters = () => {
        setCityFilter('all');
        setCurrentFilters({});
        setSearchTerm('');
        setSelectedRegion('all');
        setSelectedState('all');
        setColorAttribute('Sigla_Regiao');

        onFiltersApplied(csvData, 'Sigla_Regiao');
      };

      const handleCurrentFilterChange = (filterHeader, event) => {
        const value = event.target.value;
        setCurrentFilters({
          ...currentFilters,
          [filterHeader]: value
        });
      };

      const numericAttributes = ['Altitude_Municipio', 'Area_Municipio'];
      const categoricalAttributes = csvData ? [...new Set(
        Object.keys(csvData[0] || {}).filter(key =>
          !numericAttributes.includes(key) &&
          key !== 'Longitude_Municipio' &&
          key !== 'Latitude_Municipio'
        )
      )].sort() : [];

      // Load all available indicators on component mount
      useEffect(() => {
        if (indicadoresData && indicadoresData.length > 0) {
          const indicators = [...new Set(indicadoresData.map(ind => ind.Nome_Indicador))].sort();
          setAvailableIndicators(indicators);
        }
      }, [indicadoresData]);

      // Update available years when indicator changes
      useEffect(() => {
        if (selectedIndicator && indicadoresData && indicadoresData.length > 0) {
          const years = [...new Set(
            indicadoresData
              .filter(ind => ind.Nome_Indicador === selectedIndicator)
              .map(ind => ind.Ano_Observacao)
          )].sort();
          setAvailableYears(years);

          // Set default year to most recent if available
          if (years.length > 0) {
            setSelectedYear(years[years.length - 1]);
          } else {
            setSelectedYear(''); // No years available for this indicator
          }
        } else {
          setAvailableYears([]);
          setSelectedYear('');
        }
      }, [selectedIndicator, indicadoresData]);


      const toggleMenu = () => {
        setIsOpen(!isOpen);
      };

      const handleVisualizationTypeChange = (e) => {
        setVisualizationType(e.target.value);
      };

      const handleAttributeChange = (e) => {
        setSelectedAttribute(e.target.value);
      };

      const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
      };

      const handleIndicatorChange = (e) => {
        setSelectedIndicator(e.target.value);
      };

      const handleValueTypeChange = (e) => {
        setIndicatorValueType(e.target.value);
      };

      const handleApplyVisualization = () => {
        let visualizationConfig = {
          type: visualizationType,
        };

        if (visualizationType === 'attribute') {
          visualizationConfig.attribute = selectedAttribute;
        } else if (visualizationType === 'indicator') {
          visualizationConfig.year = selectedYear;
          visualizationConfig.indicator = selectedIndicator;
          visualizationConfig.valueType = indicatorValueType;
        }

        onVisualizationChange(visualizationConfig);
        setActiveVisualization('map');
        onEnvironmentChange('map');
        setIsOpen(false);
      };

      const handleShowDataVisualization = () => {
        console.log("Changing to data visualization environment");
        setActiveVisualization('data');
        onEnvironmentChange('data');
        setIsOpen(false);
      };

      const handleShowMapVisualization = () => {
        console.log("Changing to map visualization environment");
        setActiveVisualization('map');
        onEnvironmentChange('map');
        setIsOpen(false);
      };

      const handleShowETLEnvironment = () => {
        onEnvironmentChange('etl');
        setIsOpen(false);
      }

      useEffect(() => {
        function handleClickOutside(event) {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [menuRef, isOpen, setIsOpen]);

      const availableStates = selectedRegion === 'all'
        ? uniqueStates
        : csvData ? [...new Set(csvData
          .filter(city => city.Sigla_Regiao === selectedRegion)
          .map(city => city.Sigla_Estado)
        )].sort() : [];

      return (
        <div className="visualization-menu" ref={menuRef}>
          <button
            className="visualization-menu-toggle-icon"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Ocultar Menu de Visualização' : 'Mostrar Menu de Visualização'}
          >
            <i className="visualization-icon"></i>
          </button>

          <div className={`visualization-menu-content ${isOpen ? 'open' : ''}`}>
            <div className="visualization-section">
              <h3>Visualização e Filtro</h3>

              <div className="filter-section">
                <h4>Filtros</h4>

                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Buscar por nome de município..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                </div>

                <div className="filter-group">
                  <label>Tipo de Município:</label>
                  <select
                    className="filter-dropdown"
                    value={cityFilter}
                    onChange={handleFilterChange}
                  >
                    <option value="all">Todos os Municípios</option>
                    <option value="capital">Apenas Capitais</option>
                    <option value="non-capital">Apenas Não Capitais</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Região:</label>
                  <select
                    className="filter-dropdown"
                    value={selectedRegion}
                    onChange={handleRegionChange}
                  >
                    <option value="all">Todas as Regiões</option>
                    {uniqueRegions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Estado:</label>
                  <select
                    className="filter-dropdown"
                    value={selectedState}
                    onChange={handleStateChange}
                    disabled={availableStates.length === 0}
                  >
                    <option value="all">Todos os Estados</option>
                    {availableStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-actions filter-buttons">
                  <button className="apply-filters-button" onClick={handleApplyFilters}>
                    Aplicar Filtros
                  </button>
                  <button className="reset-filters-button" onClick={handleResetFilters}>
                    Limpar Filtros
                  </button>
                </div>
              </div>

              <div className="visualization-section">
                <h4>Visualização de Mapa</h4>

                <div className="visualization-group">
                  <label>Tipo de Visualização:</label>
                  <select
                    className="visualization-dropdown"
                    value={visualizationType}
                    onChange={handleVisualizationTypeChange}
                  >
                    <option value="attribute">Atributo do Município</option>
                    <option value="indicator">Indicador</option>
                  </select>
                </div>

                {visualizationType === 'attribute' ? (
                  <div className="visualization-group">
                    <label>Atributo para Visualização:</label>
                    <select
                      className="visualization-dropdown"
                      value={selectedAttribute}
                      onChange={handleAttributeChange}
                    >
                      {categoricalAttributes.map(attr => (
                        <option key={attr} value={attr}>{attr}</option>
                      ))}
                      {numericAttributes.map(attr => (
                        <option key={attr} value={attr}>{attr}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div className="visualization-group">
                      <label>Indicador:</label>
                      <select
                        className="visualization-dropdown"
                        value={selectedIndicator}
                        onChange={handleIndicatorChange}
                        disabled={availableIndicators.length === 0}
                      >
                        <option value="">Selecione o Indicador</option>
                        {availableIndicators.map(indicator => (
                          <option key={indicator} value={indicator}>{indicator}</option>
                        ))}
                      </select>
                    </div>

                    <div className="visualization-group">
                      <label>Ano:</label>
                      <select
                        className="visualization-dropdown"
                        value={selectedYear}
                        onChange={handleYearChange}
                        disabled={!selectedIndicator || availableYears.length === 0}
                      >
                        <option value="">Selecione o Ano</option>
                        {availableYears.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    <div className="visualization-group">
                      <label>Tipo de Valor:</label>
                      <select
                        className="visualization-dropdown"
                        value={indicatorValueType}
                        onChange={handleValueTypeChange}
                      >
                        <option value="value">Valor do Indicador</option>
                        <option value="position">Índice Posicional</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="visualization-actions">
                  <button
                    className="apply-visualization-button"
                    onClick={handleApplyVisualization}
                  >
                    Aplicar Visualização de Mapa
                  </button>
                </div>
              </div>
            </div>

            <div className="visualization-section environment-section">
              <h3>Ambiente de Visualização</h3>
              <div className="visualization-actions">
                <button
                  className="show-data-visualization-button"
                  onClick={handleShowDataVisualization}
                >
                  Mostrar Visualização de Indicadores
                </button>
                <button
                  className="show-map-visualization-button"
                  onClick={handleShowMapVisualization}
                >
                  Mostrar Visualização de Municípios
                </button>
                {/* New ETL Environment Button */}
                <button
                  className="show-etl-environment-button"
                  onClick={handleShowETLEnvironment}
                >
                  Mostrar Ambiente de ETL
                </button>
              </div>
            </div>

            <div className="filter-results">
              <p className="results-count">
                {csvData ? csvData.length : 0} municípios disponíveis
              </p>
            </div>
          </div>
        </div>
      );
    };

    export default VisualizationMenu;
