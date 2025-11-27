import React, { useState, useEffect } from 'react';
import '../styles/CityInfoBottomBar.css';
import OverviewTab from './CityInfo/OverviewTab';
import IndicatorsTab from './CityInfo/IndicatorsTab';
import TimeSeriesTab from './CityInfo/TimeSeriesTab';
import ComparisonTab from './CityInfo/ComparisonTab';
import ExportTab from './CityInfo/ExportTab';

const CityInfoBottomBar = ({ cityInfo, onClose, indicadoresData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [cityIndicators, setCityIndicators] = useState([]);

  useEffect(() => {
    if (cityInfo && indicadoresData) {
      const cityCode = cityInfo.properties.CD_MUN;
      const filtered = indicadoresData.filter(ind => String(ind.Codigo_Municipio) === String(cityCode));
      setCityIndicators(filtered);
    }
  }, [cityInfo, indicadoresData]);

  if (!cityInfo) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab cityData={cityInfo.properties} />;
      case 'indicators':
        return <IndicatorsTab indicators={cityIndicators} />;
      case 'timeSeries':
        return <TimeSeriesTab indicators={cityIndicators} />;
      case 'comparison':
        return <ComparisonTab indicators={cityIndicators} />;
      case 'export':
        return <ExportTab cityData={cityInfo.properties} indicators={cityIndicators} />;
      default:
        return null;
    }
  };

  return (
    <div className="city-info-bottom-bar">
      <div className="bar-header-compact">
        <div className="header-left">
          <div className="city-title">
            <h3>{cityInfo.properties.NAME || cityInfo.properties.Nome_Municipio || cityInfo.properties.NM_MUN}</h3>
            <span className="state-badge">{cityInfo.properties.Sigla_Estado}</span>
          </div>
          <div className="vertical-divider"></div>
          <div className="bar-tabs">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Visão Geral
            </button>
            <button
              className={`tab-button ${activeTab === 'indicators' ? 'active' : ''}`}
              onClick={() => setActiveTab('indicators')}
            >
              Indicadores
            </button>
            <button
              className={`tab-button ${activeTab === 'timeSeries' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeSeries')}
            >
              Série Temporal
            </button>
            <button
              className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
              onClick={() => setActiveTab('comparison')}
            >
              Comparação
            </button>
            <button
              className={`tab-button ${activeTab === 'export' ? 'active' : ''}`}
              onClick={() => setActiveTab('export')}
            >
              Dados Brutos
            </button>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>

      <div className="bar-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default CityInfoBottomBar;
