import React, { useState, useEffect, useRef } from 'react';
import '../styles/DataVisualizationEnvironment.css';
import RankingView from './data-visualization/RankingView';
import TimeSeriesView from './data-visualization/TimeSeriesView';
import RankingComparisonView from './data-visualization/RankingComparisonView';
import CityProfileView from './data-visualization/CityProfileView';
import Legend from './Legend';
import { getColorScale } from '../utils/colorUtils';

const DataVisualizationEnvironment = ({ csvData, geoJson, indicadoresData, visualizationConfig, onVisualizationChange, onEnvironmentChange }) => {
  const [activeView, setActiveView] = useState('ranking');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableIndicators, setAvailableIndicators] = useState([]);
  const [comparisonConfig, setComparisonConfig] = useState({
    leftYear: '',
    leftIndicator: '',
    rightYear: '',
    rightIndicator: ''
  });
  const [mapData, setMapData] = useState(geoJson);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [colorScale, setColorScale] = useState(null);
  const [indicatorSearchTerm, setIndicatorSearchTerm] = useState(''); // Estado para termo de pesquisa de indicador

  // Extract available years from indicators data
  useEffect(() => {
    if (indicadoresData && indicadoresData.length > 0) {
      const years = [...new Set(indicadoresData.map(ind => ind.Ano_Observacao))].sort();
      setAvailableYears(years);

      // Set default year to most recent
      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[years.length - 1]);
      }
    }
  }, [indicadoresData]);

  // Update available indicators when year changes
  useEffect(() => {
    if (selectedYear && indicadoresData && indicadoresData.length > 0) {
      let indicators = [...new Set(
        indicadoresData
          .filter(ind => ind.Ano_Observacao === selectedYear)
          .map(ind => ind.Nome_Indicador)
      )].sort();

      // Filtrar indicadores com base no termo de pesquisa
      if (indicatorSearchTerm) {
        const searchTerm = indicatorSearchTerm.toLowerCase();
        indicators = indicators.filter(indicator =>
          indicator.toLowerCase().includes(searchTerm)
        );
      }

      setAvailableIndicators(indicators);

      // Set default indicator if available
      if (indicators.length > 0 && !selectedIndicator) {
        setSelectedIndicator(indicators[0]);
      }
    }
  }, [selectedYear, indicadoresData, indicatorSearchTerm]); // Dependência para indicatorSearchTerm

  // Handle view changes
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  // Handle year selection
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Handle indicator selection
  const handleIndicatorChange = (e) => {
    setSelectedIndicator(e.target.value);
  };

  // Handle city selection for profile view and TimeSeriesView
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setActiveView('profile');
  };

  // Handle comparison configuration changes
  const handleComparisonConfigChange = (field, value) => {
    setComparisonConfig({
      ...comparisonConfig,
      [field]: value
    });
  };

  // Function to handle feature hover
  const handleFeatureHover = (event) => {
    const feature = event.target.feature;
    if (feature && feature.properties) {
      setTooltipContent({
        name: feature.properties.NAME || feature.properties.Nome_Municipio,
        attributeValue: feature.properties[visualizationConfig.attribute],
        indicatorValue: feature.properties[selectedIndicator]
      });
    } else {
      setTooltipContent(null);
    }
  };

  // Function to handle feature click
  const handleFeatureClick = (event) => {
    const feature = event.target.feature;
    if (feature) {
      setSelectedFeature(feature);
      console.log("Município selecionado:", feature.properties.NAME || feature.properties.Nome_Municipio);
    }
  };

  // Atualizar cores do mapa com base na visualizationConfig e csvData
  useEffect(() => {
    if (visualizationConfig && visualizationConfig.type === 'attribute' && visualizationConfig.attribute && csvData && geoJson) {
      const attribute = visualizationConfig.attribute;
      const attributeValues = csvData.map(city => city[attribute]).filter(value => value !== undefined && value !== null);
      const currentMapData = { ...geoJson };

      if (attributeValues.length > 0) {
        const newColorScale = getColorScale(attribute, attributeValues);
        setColorScale(newColorScale);

        currentMapData.features = currentMapData.features.map(feature => {
          const cityCode = feature.properties.CD_MUN;
          const cityData = csvData.find(city => city.Codigo_Municipio === cityCode);
          let color = '#CCCCCC';

          if (cityData) {
            const value = cityData[attribute];
            if (value !== undefined && value !== null) {
              color = newColorScale(value);
            }
          }

          return {
            ...feature,
            properties: {
              ...feature.properties,
              fillColor: color
            }
          };
        });
        setMapData(currentMapData);
      }
    } else if (visualizationConfig && visualizationConfig.type === 'indicator' && visualizationConfig.indicator && selectedYear && indicadoresData && geoJson) {
      const indicator = visualizationConfig.indicator;
      const year = selectedYear;

      // Filtrar dados do indicador para o ano selecionado
      const indicatorDataForYear = indicadoresData.filter(item =>
        item.Nome_Indicador === indicator && item.Ano_Observacao === year
      );

      if (indicatorDataForYear.length > 0 && geoJson) {
        const indicatorValues = indicatorDataForYear.map(item => parseFloat(item.Valor)).filter(value => !isNaN(value));
        const newColorScale = getColorScale(indicatorValues);
        setColorScale(newColorScale);

        const currentMapData = { ...geoJson };
        currentMapData.features = currentMapData.features.map(feature => {
          const cityCode = feature.properties.CD_MUN;
          const indicatorEntry = indicatorDataForYear.find(item => item.Codigo_Municipio === cityCode);
          let color = '#CCCCCC';

          if (indicatorEntry) {
            const value = parseFloat(indicatorEntry.Valor);
            if (!isNaN(value)) {
              color = newColorScale(value);
            }
          }

          return {
            ...feature,
            properties: {
              ...feature.properties,
              fillColor: color
            }
          };
        });
        setMapData(currentMapData);
      }
    }
  }, [visualizationConfig, csvData, geoJson, indicadoresData, selectedYear, selectedIndicator]);

  const handleIndicatorClick = (indicatorName) => {
    setSelectedIndicator(indicatorName); // Define o indicador selecionado
    onVisualizationChange({ // Notifica o App.jsx para mudar a visualização
      type: 'indicator',
      indicator: indicatorName,
      year: selectedYear, // Mantém o ano selecionado ou usa o padrão
      valueType: 'value' // Tipo de valor padrão
    });
    onEnvironmentChange('map'); // Muda para o ambiente de mapa se necessário
    setActiveView('ranking'); // Opcional: manter a visualização de ranking ou mudar para outro modo
  };


  return (
    <div className="data-visualization-environment">
      <div className="data-visualization-header">
        <h1>Ambiente de Visualização de Indicadores</h1>

        <div className="view-selector">
          <button
            className={`view-button ${activeView === 'ranking' ? 'active' : ''}`}
            onClick={() => handleViewChange('ranking')}
          >
            Rankings
          </button>
          <button
            className={`view-button ${activeView === 'timeSeries' ? 'active' : ''}`}
            onClick={() => handleViewChange('timeSeries')}
          >
            Séries Temporais
          </button>
          <button
            className={`view-button ${activeView === 'comparison' ? 'active' : ''}`}
            onClick={() => handleViewChange('comparison')}
          >
            Comparação de Rankings
          </button>
          <button
            className={`view-button ${activeView === 'profile' ? 'active' : ''}`}
            onClick={() => handleViewChange('profile')}
          >
            Perfil de Município
          </button>
        </div>
      </div>

      <div className="data-visualization-container">
        <div className="data-visualization-sidebar">
          {activeView === 'ranking' && (
            <div className="view-controls">
              <h3 className="control-section-title">Configurações do Ranking</h3>

              <div className="control-group">
                <label>Pesquisar Indicador:</label>
                <input
                  type="text"
                  placeholder="Buscar indicador..."
                  value={indicatorSearchTerm}
                  onChange={(e) => setIndicatorSearchTerm(e.target.value)}
                  className="indicator-search-input"
                />
              </div>

              <div className="control-group">
                <label>Ano:</label>
                <select value={selectedYear} onChange={handleYearChange}>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label>Indicador:</label>
                <div className="indicator-list">
                  {availableIndicators.map(indicator => (
                    <p
                      key={indicator}
                      className={`indicator-item ${selectedIndicator === indicator ? 'selected' : ''}`}
                      onClick={() => handleIndicatorClick(indicator)}
                      style={{ cursor: 'pointer', padding: '5px 0' }} // Adicionado estilo para cursor e padding
                    >
                      {indicator}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'timeSeries' && (
            <div className="view-controls">
              <h3 className="control-section-title">Configurações da Série Temporal</h3>

              <div className="control-group">
                <label>Pesquisar Indicador:</label>
                <input
                  type="text"
                  placeholder="Buscar indicador..."
                  value={indicatorSearchTerm}
                  onChange={(e) => setIndicatorSearchTerm(e.target.value)}
                  className="indicator-search-input"
                />
              </div>

              <div className="control-group">
                <label>Indicador:</label>
                <div className="indicator-list">
                  {availableIndicators.map(indicator => (
                    <p
                      key={indicator}
                      className={`indicator-item ${selectedIndicator === indicator ? 'selected' : ''}`}
                      onClick={() => handleIndicatorClick(indicator)}
                      style={{ cursor: 'pointer', padding: '5px 0' }} // Adicionado estilo para cursor e padding
                    >
                      {indicator}
                    </p>
                  ))}
                </div>
              </div>
              <div className="control-group">
                <label>Município:</label>
                <select
                  value={selectedCity ? selectedCity.Codigo_Municipio : ''}
                  onChange={(e) => {
                    const cityCode = e.target.value;
                    const city = csvData.find(c => c.Codigo_Municipio === cityCode);
                    setSelectedCity(city);
                  }}
                >
                  <option value="">Selecione um município</option>
                  {csvData && csvData.map(city => (
                    <option key={city.Codigo_Municipio} value={city.Codigo_Municipio}>
                      {city.Nome_Municipio} ({city.Sigla_Estado})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeView === 'comparison' && (
            <div className="view-controls comparison-controls">
              <h3 className="control-section-title">Configurações de Comparação</h3>

              <div className="control-group">
                <label>Ano Ranking 1:</label>
                <select
                  value={comparisonConfig.leftYear}
                  onChange={(e) => handleComparisonConfigChange('leftYear', e.target.value)}
                >
                  <option value="">Selecione um ano</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label>Indicador Ranking 1:</label>
                <select
                  value={comparisonConfig.leftIndicator}
                  onChange={(e) => handleComparisonConfigChange('leftIndicator', e.target.value)}
                >
                  <option value="">Selecione um indicador</option>
                  {availableIndicators.map(indicator => (
                    <option key={indicator} value={indicator}>{indicator}</option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label>Ano Ranking 2:</label>
                <select
                  value={comparisonConfig.rightYear}
                  onChange={(e) => handleComparisonConfigChange('rightYear', e.target.value)}
                >
                  <option value="">Selecione um ano</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label>Indicador Ranking 2:</label>
                <select
                  value={comparisonConfig.rightIndicator}
                  onChange={(e) => handleComparisonConfigChange('rightIndicator', e.target.value)}
                >
                  <option value="">Selecione um indicador</option>
                  {availableIndicators.map(indicator => (
                    <option key={indicator} value={indicator}>{indicator}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeView === 'profile' && (
            <div className="view-controls">
              <h3 className="control-section-title">Perfil do Município</h3>
              <div className="control-group">
                <label>Selecione um município:</label>
                <select
                  value={selectedCity ? selectedCity.Codigo_Municipio : ''}
                  onChange={(e) => {
                    const cityCode = e.target.value;
                    const city = csvData.find(c => c.Codigo_Municipio === cityCode);
                    setSelectedCity(city);
                  }}
                >
                  <option value="">Selecione um município</option>
                  {csvData && csvData.map(city => (
                    <option key={city.Codigo_Municipio} value={city.Codigo_Municipio}>
                      {city.Nome_Municipio} ({city.Sigla_Estado})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Legend */}
          {colorScale && (
            <div className="legend-container">
              <Legend colorScale={colorScale} attributeName={visualizationConfig.attribute || selectedIndicator} />
            </div>
          )}
        </div>

        <div className="data-visualization-content">
          {activeView === 'ranking' && (
            <RankingView
              csvData={csvData}
              indicadoresData={indicadoresData}
              year={selectedYear}
              indicator={selectedIndicator}
              onCitySelect={handleCitySelect}
            />
          )}

          {activeView === 'timeSeries' && (
            <TimeSeriesView
              csvData={csvData}
              indicadoresData={indicadoresData}
              indicator={selectedIndicator}
              selectedCity={selectedCity}
              onCitySelect={handleCitySelect}
            />
          )}

          {activeView === 'comparison' && (
            <RankingComparisonView
              csvData={csvData}
              indicadoresData={indicadoresData}
              leftYear={comparisonConfig.leftYear}
              leftIndicator={comparisonConfig.leftIndicator}
              rightYear={comparisonConfig.rightYear}
              rightIndicator={comparisonConfig.rightIndicator}
              onCitySelect={handleCitySelect}
            />
          )}

          {activeView === 'profile' && selectedCity && (
            <CityProfileView
              city={selectedCity}
              indicadoresData={indicadoresData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataVisualizationEnvironment;
