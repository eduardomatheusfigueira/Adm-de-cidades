import React, { useState } from 'react';
import { Building2, Workflow, Hash, TrendingUp, PencilLine, BookOpen, Play } from 'lucide-react';
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
      <div className="etl-cabecalho">
        <p className="etl-trilha">ETL e dados › Municípios</p>
        <h1>ETL de municípios</h1>
        <p className="description-text">
          Unifica os dados cadastrais dos municípios a partir de várias fontes (CSV e GeoJSON).
        </p>
      </div>

      <div className="etl-grid">
        <div className="etl-etapas">
          <section className="etl-etapa">
            <h2><span className="etl-num">1</span>Arquivos de entrada</h2>
            <div className="file-inputs">
              {[['populacao', 'População'], ['altitude', 'Altitude'], ['longitude', 'Longitude'], ['latitude', 'Latitude'], ['geometria', 'Geometria (GeoJSON)'], ['snis', 'SNIS']].map(([key, rotulo]) => (
                <div key={key} className="file-input-group">
                  <label htmlFor={`etl-mun-${key}`}>{rotulo}</label>
                  <div className="custom-file-input">
                    <input id={`etl-mun-${key}`} type="file" onChange={(e) => handleFileChange(key, e)} />
                    <span className={`status-indicator ${inputFiles[key] ? 'success' : ''}`}>
                      {inputFiles[key] ? '✓ Escolhido' : 'Obrigatório'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="etl-etapa">
            <h2><span className="etl-num">2</span>Saída</h2>
            <div className="output-config">
              <div className="campo">
                <label htmlFor="etl-mun-pasta">Pasta de saída</label>
                <input id="etl-mun-pasta" className="entrada" type="text" value={outputFolder} onChange={(e) => setOutputFolder(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="etl-mun-nome">Nome do arquivo</label>
                <input id="etl-mun-nome" className="entrada etl-mono" type="text" value={outputFilename} onChange={(e) => setOutputFilename(e.target.value)} />
              </div>
            </div>
          </section>
        </div>

        <div className="etl-lateral">
          <div className="etl-log-panel">
            <div className="etl-log-topo">
              <h2>Log de execução</h2>
              <span>{etlStatus === 'running' ? 'Executando' : etlStatus === 'completed' ? 'Concluído' : 'Parado'}</span>
            </div>
            <div className="log-window" role="log" aria-live="polite">
              {logMessages.length === 0 ? (
                <p className="empty-log">Aguardando início do processo…</p>
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
          <button type="button" className="btn btn-primary btn-lg" onClick={runETL} disabled={etlStatus === 'running'}>
            <Play size={18} strokeWidth={1.75} aria-hidden="true" /> {etlStatus === 'running' ? 'Processando…' : 'Executar ETL'}
          </button>
        </div>
      </div>
    </div>
  );
};

const GUIAS = {
  snis: { rotulo: 'SNIS', Componente: TransformacaoSNIS },
  ipeadata: { rotulo: 'IPEADATA', Componente: TransformacaoIPEADATA },
  datasus: { rotulo: 'DATASUS', Componente: TransformacaoDATASUS },
  finbra: { rotulo: 'FINBRA', Componente: TransformacaoFINBRA },
  ibge: { rotulo: 'IBGE / SIDRA', Componente: TransformacaoIBGE },
  guiamun: { rotulo: 'Cadastro de municípios', Componente: TransformacaoMunicipios },
  codigomun: { rotulo: 'Código do município', Componente: TransformacaoCodigoMunicipio },
  indice: { rotulo: 'Índice posicional', Componente: TransformacaoIndicePosicional },
};

const ITENS = [
  { id: 'municipios', label: 'ETL de municípios', Icon: Building2, grupo: 'Municípios' },
  { id: 'guiamun', label: 'Guia do cadastro', Icon: BookOpen, grupo: 'Municípios' },
  { id: 'indicadores', label: 'Processar arquivos', Icon: Workflow, grupo: 'Indicadores por fonte' },
  { id: 'snis', label: 'SNIS', hint: 'Saneamento', grupo: 'Indicadores por fonte' },
  { id: 'ipeadata', label: 'IPEADATA', hint: 'Séries', grupo: 'Indicadores por fonte' },
  { id: 'datasus', label: 'DATASUS', hint: 'Saúde', grupo: 'Indicadores por fonte' },
  { id: 'finbra', label: 'FINBRA', hint: 'Finanças', grupo: 'Indicadores por fonte' },
  { id: 'ibge', label: 'IBGE / SIDRA', hint: 'Censos', grupo: 'Indicadores por fonte' },
  { id: 'codigomun', label: 'Código do município', Icon: Hash, grupo: 'Utilitários' },
  { id: 'indice', label: 'Índice posicional', Icon: TrendingUp, grupo: 'Utilitários' },
  { id: 'editar', label: 'Editar dados', Icon: PencilLine, grupo: 'Utilitários' },
];

const Guia = ({ id }) => {
  const { rotulo, Componente } = GUIAS[id];
  const grupo = ITENS.find(i => i.id === id)?.grupo;
  return (
    <div className="etl-view-container etl-guia fade-in">
      <p className="etl-trilha">ETL e dados › {grupo} › {rotulo}</p>
      <Componente />
    </div>
  );
};

const ETLEnvironment = ({ initialMunicipalitiesData, initialIndicatorsData, municipalitiesHeaders, indicatorsHeaders }) => {
  const [activeView, setActiveView] = useState('municipios');

  return (
    <div className="etl-environment-container">
      <Sidebar
        items={ITENS}
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
        {GUIAS[activeView] && <Guia id={activeView} />}
      </div>
    </div>
  );
};

export default ETLEnvironment;
