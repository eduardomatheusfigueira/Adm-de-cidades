import React, { useState, useEffect, useMemo } from 'react';
import RadarChart from './RadarChart'; // Import RadarChart
import '../../styles/data-visualization/CityProfileView.css';

const CityProfileView = ({
  city,                         // Primary city object
  indicadoresData,              // All indicator data
  selectedRadarIndicatorNames,  // Array of indicator names selected in sidebar
  selectedYearForProfile,       // Year selected in sidebar
  citiesCompare = []            // Array of comparison city objects (default to empty)
}) => {
  // State Declarations
  const [cityIndicators, setCityIndicators] = useState([]); // All indicators for the primary city
  const [recentIndicators, setRecentIndicators] = useState([]); // Indicators for the selected year (for grid display)
  const [radarChartDataPrimary, setRadarChartDataPrimary] = useState([]); // Data for the primary city radar chart
  const [radarChartIndicators, setRadarChartIndicators] = useState([]); // Labels for the radar chart (based on primary selection)
  // Store comparison data as an array of objects { label, color, data }
  const [compareRadarDatasets, setCompareRadarDatasets] = useState([]); // For radar chart comparison lines
  const [comparisonIndicatorDetails, setComparisonIndicatorDetails] = useState({}); // { indicatorName: { cityCode: { value, position, cityName }, ... }, ... }

  // Effect 1: Filter all indicators just for the primary city
  useEffect(() => {
    if (!city || !city.Codigo_Municipio || !indicadoresData) {
      setCityIndicators([]);
      return;
    }
    try {
      const indicators = indicadoresData.filter(
        ind => ind.Codigo_Municipio === city.Codigo_Municipio
      );
      setCityIndicators(indicators);
    } catch (error) {
        console.error("Error in CityProfileView Effect 1:", error);
        setCityIndicators([]); // Reset on error
    }
  }, [city, indicadoresData]);

  // Effect 2: Filter indicators for selected year and prepare primary radar data
  useEffect(() => {
    if (!cityIndicators.length || !selectedYearForProfile) {
      setRecentIndicators([]); setRadarChartDataPrimary([]); setRadarChartIndicators([]); return;
    }
    const yearIndicators = cityIndicators.filter(ind => ind.Ano_Observacao === selectedYearForProfile);
    yearIndicators.sort((a, b) => a.Nome_Indicador.localeCompare(b.Nome_Indicador));
    setRecentIndicators(yearIndicators);

    if (!selectedRadarIndicatorNames || selectedRadarIndicatorNames.length < 3) {
      setRadarChartDataPrimary([]); setRadarChartIndicators([]); return;
    }
    const keyIndicatorsData = yearIndicators.filter(ind => selectedRadarIndicatorNames.includes(ind.Nome_Indicador));

    if (keyIndicatorsData.length >= 3) {
      keyIndicatorsData.sort((a, b) => a.Nome_Indicador.localeCompare(b.Nome_Indicador));
      const chartIndicators = keyIndicatorsData.map(ind => ind.Nome_Indicador);
      const chartData = keyIndicatorsData.map(ind => parseFloat(ind.Indice_Posicional) || 0);
      setRadarChartDataPrimary(chartData);
      setRadarChartIndicators(chartIndicators);
    } else {
      setRadarChartDataPrimary([]); setRadarChartIndicators([]);
    }
  }, [cityIndicators, selectedYearForProfile, selectedRadarIndicatorNames]);

  // Effect 3: Prepare comparison data (Radar + Detailed Indicators)
  useEffect(() => {
    if (!citiesCompare || citiesCompare.length === 0 || !selectedYearForProfile || !indicadoresData) {
      setCompareRadarDatasets([]);
      setComparisonIndicatorDetails({}); // Reset detailed comparison data
      return;
    }

    const newComparisonDetails = {}; // To store { indicatorName: { cityCode: { value, position, cityName }, ... } }
    const newRadarDatasets = [];
    const colors = ['#ff6347', '#4682b4', '#32cd32', '#ffc400', '#9370db']; // Example palette

    citiesCompare.forEach((compareCity, index) => {
      const compareYearIndicators = indicadoresData.filter(ind =>
        ind.Codigo_Municipio === compareCity.Codigo_Municipio &&
        ind.Ano_Observacao === selectedYearForProfile
      );

      // Populate detailed comparison data
      compareYearIndicators.forEach(ind => {
        if (!newComparisonDetails[ind.Nome_Indicador]) {
          newComparisonDetails[ind.Nome_Indicador] = {};
        }
        newComparisonDetails[ind.Nome_Indicador][compareCity.Codigo_Municipio] = {
          value: !isNaN(parseFloat(ind.Valor)) ? parseFloat(ind.Valor) : null,
          position: !isNaN(parseFloat(ind.Indice_Posicional)) ? parseFloat(ind.Indice_Posicional) : null,
          cityName: compareCity.Nome_Municipio // Store city name for display
        };
      });

      // Prepare radar data (only if primary radar indicators are set)
      if (radarChartIndicators && radarChartIndicators.length > 0) {
        const chartDataCompare = radarChartIndicators.map(indicatorName => {
          const compareIndicatorData = compareYearIndicators.find(ind => ind.Nome_Indicador === indicatorName);
          return compareIndicatorData ? (parseFloat(compareIndicatorData.Indice_Posicional) || 0) : 0;
        });

        newRadarDatasets.push({
          label: compareCity.Nome_Municipio,
          color: colors[index % colors.length],
          data: chartDataCompare
        });
      }
    });

    setCompareRadarDatasets(newRadarDatasets);
    setComparisonIndicatorDetails(newComparisonDetails);

  }, [citiesCompare, selectedYearForProfile, indicadoresData, radarChartIndicators]); // Dependencies

  // Prepare combined datasets array for RadarChart component using useMemo
  const radarDatasets = useMemo(() => {
    const datasets = [];
    // Ensure primary data and indicators are valid before adding
    if (city && radarChartDataPrimary && radarChartIndicators && radarChartDataPrimary.length === radarChartIndicators.length && radarChartIndicators.length > 0) {
      datasets.push({
        label: city.Nome_Municipio,
        color: '#0d6efd', // Primary color
        data: radarChartDataPrimary
      });
    }
    // Ensure comparison datasets and primary indicators are valid before adding
    if (compareRadarDatasets && radarChartIndicators && radarChartIndicators.length > 0) {
      compareRadarDatasets.forEach(compDs => {
        // Double-check data length consistency
        if (compDs && compDs.data && compDs.data.length === radarChartIndicators.length) {
          datasets.push(compDs);
        }
      });
    }
    return datasets;
  }, [city, radarChartDataPrimary, radarChartIndicators, compareRadarDatasets]);


  // --- Render Logic ---
  if (!city || !city.Codigo_Municipio) {
    return <div className="no-city-selected"><p>Selecione um município na barra lateral.</p></div>;
  }

  return (
    <div className="city-profile-view">
      {/* Header */}
      <div className="city-profile-header">
        <div className="city-basic-info">
          <h2>{city.Nome_Municipio}</h2>
          <div className="city-location">
            <span className="state">{city.Sigla_Estado}</span>
            <span className="region">{city.Sigla_Regiao}</span>
            {(city.Capital?.toLowerCase() === 'true' || city.Capital === '1') && <span className="capital-badge">Capital</span>}
          </div>
        </div>
        <div className="year-display">
          <span>Ano de Referência: {selectedYearForProfile || 'N/A'}</span>
        </div>
      </div>

      <div className="city-details">
        {/* General Info Card */}
        <div className="city-card">
          <h3>Informações Gerais</h3>
          <div className="city-info-grid">
             <div className="info-item"><span className="info-label">Código IBGE</span><span className="info-value">{city.Codigo_Municipio}</span></div>
             <div className="info-item"><span className="info-label">Área</span><span className="info-value">{city.Area_Municipio ? parseFloat(city.Area_Municipio).toLocaleString('pt-BR') : '-'} km²</span></div>
             <div className="info-item"><span className="info-label">Altitude</span><span className="info-value">{city.Altitude_Municipio ? parseFloat(city.Altitude_Municipio).toLocaleString('pt-BR') : '-'} m</span></div>
             <div className="info-item"><span className="info-label">Coordenadas</span><span className="info-value">{city.Latitude_Municipio && city.Longitude_Municipio ? `${parseFloat(city.Latitude_Municipio).toFixed(4)}, ${parseFloat(city.Longitude_Municipio).toFixed(4)}` : '-'}</span></div>
          </div>
        </div>

        {/* Radar Chart Visualization */}
        <div className="radar-chart-section city-card">
          <h3>Perfil de Indicadores (Radar)</h3>
          {radarDatasets.length > 0 ? (
            <RadarChart datasets={radarDatasets} indicators={radarChartIndicators} />
          ) : (
            <p className="no-data-message">Selecione um município e pelo menos 3 indicadores na barra lateral.</p>
          )}
        </div>

        {/* Indicators Comparison Section */}
        {recentIndicators.length > 0 ? (
          <div className="indicators-comparison-section city-card">
            <h3>Comparativo de Indicadores ({selectedYearForProfile})</h3>
            <div className="table-container"> {/* Added container for potential horizontal scroll */}
              <table className="indicators-comparison-table">
                <thead>
                  <tr className="header-row">
                    <th className="indicator-name-header">Indicador</th>
                    {/* Primary City Header */}
                    <th className="city-data-header primary-city-header">
                      <div>{city.Nome_Municipio}</div>
                      <div className="value-position-headers">
                        <span>Valor</span>
                        <span>Posição</span>
                      </div>
                    </th>
                    {/* Comparison Cities Headers */}
                    {citiesCompare.map(compCity => (
                      <th key={compCity.Codigo_Municipio} className="city-data-header">
                        <div>{compCity.Nome_Municipio}</div>
                        <div className="value-position-headers">
                          <span>Valor</span>
                          <span>Posição</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentIndicators.map(primaryIndicator => {
                    const indicatorName = primaryIndicator.Nome_Indicador;
                    const comparisonDataForIndicator = comparisonIndicatorDetails[indicatorName] || {};

                    return (
                      <tr key={indicatorName} className="data-row">
                        {/* Indicator Name */}
                        <td className="indicator-name-cell">{indicatorName}</td>

                        {/* Primary City Data */}
                        <td className="city-data-cell primary-city-data">
                          {/* Render both spans within the same TD */}
                          <span className="value-number">{!isNaN(parseFloat(primaryIndicator.Valor)) ? parseFloat(primaryIndicator.Valor).toLocaleString('pt-BR') : '-'}</span>
                          <span className="position-number">{!isNaN(parseFloat(primaryIndicator.Indice_Posicional)) ? parseFloat(primaryIndicator.Indice_Posicional).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '-'}</span>
                        </td>

                        {/* Comparison Cities Data */}
                        {citiesCompare.map(compCity => {
                          const compData = comparisonDataForIndicator[compCity.Codigo_Municipio];
                          return (
                            <td key={compCity.Codigo_Municipio} className="city-data-cell">
                              {/* Render both spans within the same TD */}
                              <span className="value-number">{compData && compData.value !== null ? compData.value.toLocaleString('pt-BR') : '-'}</span>
                              <span className="position-number">{compData && compData.position !== null ? compData.position.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '-'}</span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="no-indicators city-card">
            <p>Não há indicadores disponíveis para este município{selectedYearForProfile ? ` no ano ${selectedYearForProfile}` : ''}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityProfileView;
