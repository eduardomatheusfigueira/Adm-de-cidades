import React, { useState, useMemo, useContext } from 'react';
import { Building2, X } from 'lucide-react';
import '../styles/CityInfoBottomBar.css';
import OverviewTab from './CityInfo/OverviewTab';
import IndicatorsTab from './CityInfo/IndicatorsTab';
import TimeSeriesTab from './CityInfo/TimeSeriesTab';
import ComparisonTab from './CityInfo/ComparisonTab';
import ExportTab from './CityInfo/ExportTab';
import { DataContext } from '../contexts/DataContext';
import { NOMES_REGIOES } from '../utils/colorUtils';

const ABAS = [
  { id: 'overview', rotulo: 'Visão geral' },
  { id: 'indicators', rotulo: 'Indicadores' },
  { id: 'timeSeries', rotulo: 'Série temporal' },
  { id: 'comparison', rotulo: 'Comparação' },
  { id: 'export', rotulo: 'Exportar dados' },
];

// Cartão do município selecionado no mapa (folha inferior no celular)
const CityInfoBottomBar = ({ cityInfo, onClose, indicadoresData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { csvData } = useContext(DataContext);

  // Junta as propriedades da feição clicada com a linha do cadastro (inclui colunas juntadas pelo usuário)
  const cidade = useMemo(() => {
    const props = cityInfo?.properties || {};
    const code = String(props.CD_MUN ?? props.Codigo_Municipio ?? '');
    const row = (csvData || []).find(c => String(c.Codigo_Municipio) === code);
    return { ...props, ...(row || {}), Codigo_Municipio: row?.Codigo_Municipio ?? code };
  }, [cityInfo, csvData]);

  const cityIndicators = useMemo(() => (indicadoresData || [])
    .filter(ind => String(ind.Codigo_Municipio) === String(cidade.Codigo_Municipio)), [indicadoresData, cidade]);

  if (!cityInfo) return null;

  const nome = cidade.Nome_Municipio || cidade.NAME || cidade.NM_MUN || 'Município';
  const uf = cidade.Sigla_Estado || cidade.SIGLA_UF || '';
  const regiao = NOMES_REGIOES[cidade.Sigla_Regiao] || cidade.Sigla_Regiao || '';
  const capital = String(cidade.Capital).trim().toLowerCase() === 'true';

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab cityData={cidade} indicators={cityIndicators} />;
      case 'indicators': return <IndicatorsTab indicators={cityIndicators} />;
      case 'timeSeries': return <TimeSeriesTab indicators={cityIndicators} />;
      case 'comparison': return <ComparisonTab indicators={cityIndicators} />;
      case 'export': return <ExportTab cityData={cidade} indicators={cityIndicators} />;
      default: return null;
    }
  };

  return (
    <section className="city-info-bottom-bar" aria-label={`Município selecionado: ${nome}`}>
      <div className="cib-alca" aria-hidden="true" />
      <header className="cib-topo">
        <div className="cib-id">
          <span className="cib-icone"><Building2 size={22} strokeWidth={1.75} aria-hidden="true" /></span>
          <div className="cib-id-texto">
            <div className="cib-nome">
              <h2>{nome}</h2>
              {capital && <span className="selo selo-capital">Capital</span>}
            </div>
            <p className="cib-meta">
              IBGE {cidade.Codigo_Municipio}{uf && ` · ${uf}`}{regiao && ` · ${regiao}`}
            </p>
          </div>
        </div>
        <button type="button" className="cib-fechar" onClick={onClose} aria-label="Fechar">
          <X size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </header>

      <div className="abas cib-abas" role="tablist" aria-label="Seções do município">
        {ABAS.map(a => (
          <button key={a.id} type="button" role="tab" aria-selected={activeTab === a.id} onClick={() => setActiveTab(a.id)}>
            {a.rotulo}
          </button>
        ))}
      </div>

      <div className="bar-content" role="tabpanel">
        {renderContent()}
      </div>
    </section>
  );
};

export default CityInfoBottomBar;
