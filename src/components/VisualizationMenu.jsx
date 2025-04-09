import React, { useState, useEffect, useRef } from 'react';
    import '../styles/VisualizationMenu.css';

    const VisualizationMenu = ({
      csvData,
      indicadoresData,
      onVisualizationChange,
      csvHeaders,
      onFiltersApplied,
      onEnvironmentChange,
      mapStyle, // Receive current map style
      onMapStyleChange // Receive handler for style change
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
      const [activeVisualization, setActiveVisualization] = useState('map');
      const [selectedMunicipalities, setSelectedMunicipalities] = useState(new Set()); // State for multi-select
      // const [isMunicipalitySelectorOpen, setIsMunicipalitySelectorOpen] = useState(false); // REMOVED
      const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Reintroduce state for dropdown visibility
      const [dropdownSearchTerm, setDropdownSearchTerm] = useState(''); // State for dropdown search
      const dropdownRef = useRef(null); // Reintroduce ref for the dropdown panel
      const triggerRef = useRef(null); // Reintroduce ref for the trigger button
 
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

      // Remove handleSearchChange as the text input is being replaced
      // const handleSearchChange = (event) => {
      //   setSearchTerm(event.target.value);
      // };
 
      const handleMunicipalitySelectionChange = (event) => {
        const { value, checked } = event.target;
        setSelectedMunicipalities(prevSelected => {
          const newSelected = new Set(prevSelected);
          if (checked) {
            newSelected.add(value);
          } else {
            newSelected.delete(value);
          }
          return newSelected;
        });
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

        // Filter by selected municipalities instead of search term
        if (selectedMunicipalities.size > 0) {
          tempData = tempData.filter(city => selectedMunicipalities.has(city.Codigo_Municipio));
          console.log("Após filtro por municípios selecionados:", tempData.length);
        }

        Object.keys(currentFilters).forEach(filterKey => {
          const filterValue = currentFilters[filterKey];
          if (filterValue && filterValue !== 'all') {
            tempData = tempData.filter(city => city[filterKey] === filterValue);
          }
        });

        console.log("Dados filtrados finais:", tempData.length);
        // Use selectedAttribute for coloring when visualization type is 'attribute'
        const attributeForColoring = visualizationType === 'attribute' ? selectedAttribute : 'Sigla_Regiao'; // Fallback or decide based on viz type
        console.log("Atributo de cor selecionado para aplicar:", attributeForColoring);
        onFiltersApplied(tempData, attributeForColoring);
      };

      const handleResetFilters = () => {
        setCityFilter('all');
        setCurrentFilters({});
        setSearchTerm(''); // Keep resetting searchTerm state even if input is removed for now
        setSelectedRegion('all');
        setSelectedState('all');
        setSelectedMunicipalities(new Set()); // Reset selected municipalities
        // Reset selectedAttribute as well, which controls the dropdown
        setSelectedAttribute('Sigla_Regiao');
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

      const handleMapStyleSelectChange = (e) => {
        onMapStyleChange(e.target.value); // Call the handler passed from App.jsx
        // No need to close the menu here, let the user decide
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

      const handleShowDataSourceInfo = () => {
        console.log("Changing to data source info environment");
        onEnvironmentChange('dataSourceInfo');
        setIsOpen(false);
      };

      const handleShowCalculadoraBSE = () => {
        console.log("Changing to Calculadora BSE environment");
        onEnvironmentChange('calculadora-bse'); // Use 'calculadora-bse' as the identifier
        setIsOpen(false);
      };
      // Close main menu if clicking outside
      useEffect(() => {
        function handleClickOutside(event) {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, [menuRef]); // Removed isOpen/setIsOpen dependency as it's handled internally now? Check if needed.
 
      // Reintroduce useEffect for closing dropdown
      useEffect(() => {
        function handleClickOutsideDropdown(event) {
          if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            triggerRef.current && // Also check if the click was on the button itself
            !triggerRef.current.contains(event.target)
          ) {
            setIsDropdownOpen(false);
          }
        }
        if (isDropdownOpen) {
          document.addEventListener("mousedown", handleClickOutsideDropdown);
        }
        return () => {
          document.removeEventListener("mousedown", handleClickOutsideDropdown);
        };
      }, [isDropdownOpen]);
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

                {/* Replace text input with a placeholder button for multi-select */}
                {/* Reintroduce Dropdown Trigger and Panel */}
                <div className="filter-group" style={{ position: 'relative' }}>
                  <label>Municípios:</label>
                  <button
                    ref={triggerRef} // Assign ref to trigger
                    className="select-municipalities-button" // Use a specific class if needed
                    onClick={() => setIsDropdownOpen(prev => !prev)} // Toggle dropdown
                  >
                    Selecionar Municípios ({selectedMunicipalities.size})
                  </button>
                  {isDropdownOpen && (
                    <div ref={dropdownRef} style={dropdownStyles.dropdownContainer}>
                      <input
                        type="text"
                        placeholder="Buscar município..."
                        value={dropdownSearchTerm}
                        onChange={(e) => setDropdownSearchTerm(e.target.value)}
                        style={dropdownStyles.searchInput}
                        autoFocus
                      />
                      <div style={dropdownStyles.listContainer}>
                        {(csvData || [])
                          .filter(city => {
                            // Corrected filter logic for dropdown search
                            const normalizedSearch = dropdownSearchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const normalizedCityName = (city.Nome_Municipio || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            if (dropdownSearchTerm.trim() === '') {
                              return true; // Show all if dropdown search is empty
                            } else {
                              return normalizedCityName.includes(normalizedSearch); // Filter otherwise
                            }
                          })
                          .sort((a, b) => a.Nome_Municipio.localeCompare(b.Nome_Municipio))
                          .map(city => (
                            <div key={city.Codigo_Municipio} style={dropdownStyles.listItem}>
                              <input
                                type="checkbox"
                                id={`city-dd-${city.Codigo_Municipio}`} // Unique ID for dropdown
                                value={city.Codigo_Municipio}
                                checked={selectedMunicipalities.has(city.Codigo_Municipio)}
                                onChange={handleMunicipalitySelectionChange}
                                style={{ marginRight: '8px' }}
                              />
                              <label htmlFor={`city-dd-${city.Codigo_Municipio}`}>
                                {city.Nome_Municipio} ({city.Sigla_Estado})
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
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

                {/* Map Style Selection */}
                <div className="visualization-group">
                  <label>Estilo do Mapa:</label>
                  <select
                    className="visualization-dropdown"
                    value={mapStyle}
                    onChange={handleMapStyleSelectChange}
                  >
                    <option value="mapbox://styles/mapbox/light-v11">Claro</option>
                    <option value="mapbox://styles/mapbox/dark-v11">Escuro</option>
                    <option value="mapbox://styles/mapbox/streets-v12">Ruas</option>
                    <option value="mapbox://styles/mapbox/outdoors-v12">Exterior</option>
                    <option value="mapbox://styles/mapbox/satellite-streets-v12">Satélite com Ruas</option>
                  </select>
                </div>
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
                  className="show-data-source-info-button" // Add a class for potential styling
                  onClick={handleShowDataSourceInfo}
                >
                  Início
                </button>
                <button
                  className="show-map-visualization-button"
                  onClick={handleShowMapVisualization}
                >
                  Mostrar Visualização de Municípios
                </button>
                <button
                  className="show-data-visualization-button"
                  onClick={handleShowDataVisualization}
                >
                  Mostrar Visualização de Indicadores
                </button>

                <button
                  className="show-calculadora-bse-button menu-button" // Added menu-button for base styling
                  onClick={handleShowCalculadoraBSE}
                  style={{ // Inline style for contrast
                    backgroundColor: '#343a40', // Dark grey
                    color: 'white',
                    borderColor: '#343a40',
                    marginTop: '5px' // Add some spacing
                  }}
                >
                  Calculadora BSE
                </button>
                {/* Removed duplicate button */}
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

    // Reintroduce dropdown styles
    const dropdownStyles = {
      dropdownContainer: {
        position: 'absolute',
        top: '100%', // Position below the button
        left: 0,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
        zIndex: 1001, // Ensure it's above map controls etc.
        width: '300px', // Adjust width as needed
        maxHeight: '300px', // Limit height
        display: 'flex',
        flexDirection: 'column',
        color: '#333',
      },
      searchInput: {
        padding: '8px 10px',
        margin: '5px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      },
      listContainer: {
        overflowY: 'auto',
        flexGrow: 1,
        padding: '0 5px 5px 5px',
      },
      listItem: {
        padding: '5px 5px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.9em',
        // cursor: 'pointer', // Optional: makes the whole item look clickable
      },
    };

    export default VisualizationMenu;
