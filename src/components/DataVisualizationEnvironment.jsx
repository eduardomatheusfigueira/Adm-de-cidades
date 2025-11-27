import React, { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import RankingView from './data-visualization/RankingView';
import TimeSeriesView from './data-visualization/TimeSeriesView';
import ComparisonView from './data-visualization/RankingComparisonView';
import CityProfileView from './data-visualization/CityProfileView';
import { DataContext } from '../contexts/DataContext';
import '../styles/DataVisualizationEnvironment.css';

const DataVisualizationEnvironment = () => {
  const [activeView, setActiveView] = useState('ranking');
  const { indicadoresData, csvData } = useContext(DataContext);

  const sidebarItems = [
    { id: 'ranking', label: 'Ranking', icon: 'fa-list-ol' },
    { id: 'timeSeries', label: 'Série Temporal', icon: 'fa-chart-line' },
    { id: 'comparison', label: 'Comparação', icon: 'fa-exchange-alt' },
    { id: 'profile', label: 'Perfil do Município', icon: 'fa-city' },
  ];

  return (
    <div className="data-visualization-container">
      <Sidebar
        title="Indicadores"
        items={sidebarItems}
        activeItem={activeView}
        onItemClick={setActiveView}
      />

      <div className="visualization-content-area">
        {activeView === 'ranking' && <RankingView indicadoresData={indicadoresData} csvData={csvData} />}
        {activeView === 'timeSeries' && <TimeSeriesView indicadoresData={indicadoresData} csvData={csvData} />}
        {activeView === 'comparison' && <ComparisonView indicadoresData={indicadoresData} csvData={csvData} />}
        {activeView === 'profile' && <CityProfileView indicadoresData={indicadoresData} csvData={csvData} />}
      </div>
    </div>
  );
};

export default DataVisualizationEnvironment;
