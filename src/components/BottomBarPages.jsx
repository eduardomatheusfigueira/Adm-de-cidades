import React, { useState } from 'react';
import '../styles/BottomBarPages.css';

const BottomBarPages = ({ activePage, handlePageChange }) => { // Receive activePage and handlePageChange as props

  let pageContent;
  switch (activePage) {
    case 'overview':
      pageContent = <p>Conteúdo da Visão Geral</p>;
      break;
    case 'indicators':
      pageContent = <p>Conteúdo dos Indicadores</p>;
      break;
    case 'timeSeries':
      pageContent = <p>Conteúdo da Série Temporal</p>;
      break;
    case 'indicatorComparison': // Updated page name
      pageContent = <p>Conteúdo de Comparação de Indicadores</p>; // Updated content description
      break;
    case 'rawData':
      pageContent = <p>Conteúdo dos Dados Brutos</p>;
      break;
    default:
      pageContent = <p>Página não encontrada</p>;
  }

  return (
    <div className="bottom-bar-pages">
      <div className="pages-navigation">
        <button
          className={`page-button ${activePage === 'overview' ? 'active' : ''}`}
          onClick={() => handlePageChange('overview')}
        >
          Visão Geral
        </button>
        <button
          className={`page-button ${activePage === 'indicators' ? 'active' : ''}`}
          onClick={() => handlePageChange('indicators')}
        >
          Indicadores
        </button>
        <button
          className={`page-button ${activePage === 'timeSeries' ? 'active' : ''}`}
          onClick={() => handlePageChange('timeSeries')}
        >
          Série Temporal
        </button>
        <button
          className={`page-button ${activePage === 'indicatorComparison' ? 'active' : ''}`} // Updated page name
          onClick={() => handlePageChange('indicatorComparison')} // Updated page name
        >
          Comparação de Indicadores
        </button>
        <button
          className={`page-button ${activePage === 'rawData' ? 'active' : ''}`}
          onClick={() => handlePageChange('rawData')}
        >
          Dados Brutos
        </button>
      </div>
      <div className="page-content">
        {pageContent}
      </div>
    </div>
  );
};

export default BottomBarPages;
