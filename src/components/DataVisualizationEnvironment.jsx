import React, { useState, useContext } from 'react';
import { ListOrdered, ChartLine, ArrowLeftRight, Building2, Upload, FileSpreadsheet } from 'lucide-react';
import Sidebar from './Sidebar';
import RankingView from './data-visualization/RankingView';
import TimeSeriesView from './data-visualization/TimeSeriesView';
import ComparisonView from './data-visualization/RankingComparisonView';
import CityProfileView from './data-visualization/CityProfileView';
import { DataContext } from '../contexts/DataContext';
import { UIContext } from '../contexts/UIContext';
import '../styles/DataVisualizationEnvironment.css';

const VISOES = [
  { id: 'ranking', label: 'Ranking', Icon: ListOrdered },
  { id: 'timeSeries', label: 'Série temporal', Icon: ChartLine },
  { id: 'comparison', label: 'Comparação', Icon: ArrowLeftRight },
  { id: 'profile', label: 'Perfil do município', Icon: Building2 },
];

// Série temporal, comparação e perfil dependem de indicadores importados
const SemIndicadores = ({ visao, onJuntar, onImportar }) => (
  <div className="indicadores-vazio fade-in">
    <span className="indicadores-vazio-icone"><FileSpreadsheet size={28} strokeWidth={1.5} aria-hidden="true" /></span>
    <h1>{visao}</h1>
    <p>Esta visão usa indicadores (valores por município e ano). Ainda não há nenhum carregado.</p>
    <div className="indicadores-vazio-acoes">
      <button type="button" className="btn btn-primary" onClick={onJuntar}>
        <Upload size={17} strokeWidth={1.75} aria-hidden="true" /> Juntar minha tabela (Excel ou CSV)
      </button>
      <button type="button" className="btn btn-secondary" onClick={onImportar}>Importar arquivo de indicadores</button>
    </div>
    <p className="indicadores-vazio-nota">O ranking já funciona com os atributos do cadastro, como a área territorial.</p>
  </div>
);

const DataVisualizationEnvironment = () => {
  const [activeView, setActiveView] = useState('ranking');
  const { indicadoresData, csvData, handleImportIndicators } = useContext(DataContext);
  const { setDataWizardMode } = useContext(UIContext);
  const temIndicadores = (indicadoresData || []).length > 0;
  const nIndicadores = new Set((indicadoresData || []).map(d => d.Nome_Indicador)).size;

  const rodape = (
    <div className="bases-carregadas">
      <span className="rotulo">Bases carregadas</span>
      <div><strong>Municípios</strong><span>{(csvData || []).length.toLocaleString('pt-BR')} registros</span></div>
      <div><strong>Indicadores</strong><span>{temIndicadores ? `${nIndicadores} ${nIndicadores === 1 ? 'indicador' : 'indicadores'}` : 'Nenhum importado'}</span></div>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDataWizardMode('tabela')}>
        <Upload size={15} strokeWidth={1.75} aria-hidden="true" /> Juntar minha tabela
      </button>
    </div>
  );

  const visaoAtual = VISOES.find(v => v.id === activeView);

  return (
    <div className="data-visualization-container">
      <Sidebar
        title="Visões"
        items={VISOES}
        activeItem={activeView}
        onItemClick={setActiveView}
        footer={rodape}
      />

      <div className="visualization-content-area">
        {activeView === 'ranking' && <RankingView indicadoresData={indicadoresData} csvData={csvData} />}
        {activeView !== 'ranking' && !temIndicadores && (
          <SemIndicadores visao={visaoAtual.label} onJuntar={() => setDataWizardMode('tabela')} onImportar={handleImportIndicators} />
        )}
        {activeView === 'timeSeries' && temIndicadores && <TimeSeriesView indicadoresData={indicadoresData} csvData={csvData} />}
        {activeView === 'comparison' && temIndicadores && <ComparisonView indicadoresData={indicadoresData} csvData={csvData} />}
        {activeView === 'profile' && temIndicadores && <CityProfileView indicadoresData={indicadoresData} csvData={csvData} />}
      </div>
    </div>
  );
};

export default DataVisualizationEnvironment;
