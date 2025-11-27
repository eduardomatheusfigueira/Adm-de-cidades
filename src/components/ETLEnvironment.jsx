import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ETLEditData from './ETLEditData';
import ETLProcessor from './ETL/ETLProcessor';
import TransformacaoMunicipios from './ETL/TransformacaoMunicipios';
import TransformacaoSNIS from './ETL/TransformacaoSNIS';
import TransformacaoIndicePosicional from './ETL/TransformacaoIndicePosicional';
import TransformacaoIPEADATA from './ETL/TransformacaoIPEADATA';
import TransformacaoDATASUS from './ETL/TransformacaoDATASUS';
import TransformacaoFINBRA from './ETL/TransformacaoFINBRA';
import TransformacaoIBGE from './ETL/TransformacaoIBGE';
import TransformacaoCodigoMunicipio from './ETL/TransformacaoCodigoMunicipio';
import '../styles/ETLEnvironment.css';

const ETLMunicipiosView = () => {
  const [logMessages, setLogMessages] = useState([]);
  const [etlStatus, setEtlStatus] = useState('idle');
  const [inputFiles, setInputFiles] = useState({});
  const [outputFolder, setOutputFolder] = useState('./data');
  const [outputFilename, setOutputFilename] = useState('municipios');

  const addLogMessage = (message) => {
    setLogMessages(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  };

  const handleFileChange = (key, e) => {
    if (e.target.files[0]) {
      setInputFiles(prev => ({ ...prev, [key]: e.target.files[0] }));
      addLogMessage(`Arquivo selecionado para ${key}: ${e.target.files[0].name}`);
    }
  };

  const simulateStep = async (message, delay) => {
    addLogMessage(message);
    return new Promise(resolve => setTimeout(resolve, delay));
  };

  const runETL = async () => {
    setEtlStatus('running');
    addLogMessage('Iniciando ETL de Municípios...');
    await simulateStep('Lendo arquivos de entrada...', 1000);
    await simulateStep('Processando dados populacionais...', 1500);
    await simulateStep('Unificando geometrias...', 2000);
    await simulateStep('Exportando resultados...', 1000);
    addLogMessage('ETL concluído com sucesso!');
    setEtlStatus('completed');
  };

  return (
    <div className="etl-view-container fade-in">
      <h2>ETL de Municípios</h2>
      <p className="description-text">
        Processamento e unificação de dados municipais a partir de múltiplas fontes (CSV, GeoJSON).
      </p>

      <div className="etl-grid">
        <div className="etl-config-panel">
          <h3>Configuração</h3>
          <div className="file-inputs">
            {['populacao', 'altitude', 'longitude', 'latitude', 'geometria', 'snis'].map(key => (
              <div key={key} className="file-input-group">
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <div className="custom-file-input">
                  <input type="file" onChange={(e) => handleFileChange(key, e)} />
                  <span className={`status-indicator ${inputFiles[key] ? 'success' : ''}`}>
                    {inputFiles[key] ? '✓' : 'Obrigatório'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="output-config">
            <div className="input-group">
              <label>Pasta de Saída</label>
              <input type="text" value={outputFolder} onChange={(e) => setOutputFolder(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Nome do Arquivo</label>
              <input type="text" value={outputFilename} onChange={(e) => setOutputFilename(e.target.value)} />
            </div>
          </div>
          <button
            className="btn btn-primary run-btn"
            onClick={runETL}
            disabled={etlStatus === 'running'}
          >
            {etlStatus === 'running' ? 'Processando...' : 'Executar ETL'}
          </button>
        </div>

        <div className="etl-log-panel">
          <h3>Log de Execução</h3>
          <div className="log-window">
            {logMessages.length === 0 ? (
              <p className="empty-log">Aguardando início do processo...</p>
            ) : (
              logMessages.map((msg, idx) => (
                <div key={idx} className="log-entry">
                  <span className="log-time">[{msg.time}]</span>
                  <span className="log-msg">{msg.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TransformationView = () => {
  const [activeTab, setActiveTab] = useState('municipios');

  const tabs = [
    { id: 'municipios', label: 'Municípios' },
    { id: 'snis', label: 'SNIS' },
    { id: 'ipeadata', label: 'IPEADATA' },
    { id: 'datasus', label: 'DATASUS' },
    { id: 'finbra', label: 'FINBRA' },
    { id: 'ibge', label: 'IBGE/SIDRA' },
    { id: 'codigomun', label: 'Cód. Município' },
    { id: 'indice', label: 'Índice Pos.' },
  ];

  return (
    <div className="transformation-view-container fade-in">
      <h2>Processos de Transformação</h2>
      <div className="tabs-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {activeTab === 'municipios' && <TransformacaoMunicipios />}
        {activeTab === 'snis' && <TransformacaoSNIS />}
        {activeTab === 'ipeadata' && <TransformacaoIPEADATA />}
        {activeTab === 'datasus' && <TransformacaoDATASUS />}
        {activeTab === 'finbra' && <TransformacaoFINBRA />}
        {activeTab === 'ibge' && <TransformacaoIBGE />}
        {activeTab === 'codigomun' && <TransformacaoCodigoMunicipio />}
        {activeTab === 'indice' && <TransformacaoIndicePosicional />}
      </div>
    </div>
  );
};

const ETLEnvironment = ({ initialMunicipalitiesData, initialIndicatorsData, municipalitiesHeaders, indicatorsHeaders }) => {
  const [activeView, setActiveView] = useState('municipios');

  const sidebarItems = [
    { id: 'municipios', label: 'ETL Municípios', icon: 'fa-map' },
    { id: 'indicadores', label: 'ETL Indicadores', icon: 'fa-chart-bar' },
    { id: 'editar', label: 'Editar Dados', icon: 'fa-edit' },
    { id: 'transformacao', label: 'Transformação', icon: 'fa-cogs' },
  ];

  return (
    <div className="etl-environment-container">
      <Sidebar
        title="ETL & Dados"
        items={sidebarItems}
        activeItem={activeView}
        onItemClick={setActiveView}
      />

      <div className="etl-content-area">
        {activeView === 'municipios' && <ETLMunicipiosView />}
        {activeView === 'indicadores' && <ETLProcessor />}
        {activeView === 'editar' && (
          <ETLEditData
            initialMunicipalitiesData={initialMunicipalitiesData}
            initialIndicatorsData={initialIndicatorsData}
            municipalitiesHeaders={municipalitiesHeaders}
            indicatorsHeaders={indicatorsHeaders}
          />
        )}
        {activeView === 'transformacao' && <TransformationView />}
      </div>
    </div>
  );
};

export default ETLEnvironment;
