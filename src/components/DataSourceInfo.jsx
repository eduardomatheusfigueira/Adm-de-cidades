import React, { useState, useMemo, useContext } from 'react';
import { Map as MapIcon, Upload, BookOpen, Database, ChartColumn, ChevronRight, ExternalLink, Check, Search, Table, MapPin, Hexagon } from 'lucide-react';
import { UIContext } from '../contexts/UIContext';
import exemploMapa from '../assets/exemplo-pernambuco-area.svg';
import '../styles/DataSourceInfo.css';
import catalogData from '../data/catalog.json';

const ESCALA_PETROLEO = ['#D6ECF3', '#93C4D2', '#3D899D', '#015668', '#003440'];

// --- Sub-components ---

const MODULOS = [
  { etapa: '1 · Dados', titulo: 'Catálogo e formatos', texto: 'Bases públicas por tema e o formato certo para importar CSV e GeoJSON.', acao: 'Ver catálogo', Icon: BookOpen, destino: { view: 'catalog' } },
  { etapa: '2 · Processamento', titulo: 'ETL e dados', texto: 'Limpe e padronize planilhas do SNIS, IPEADATA, DATASUS, FINBRA e SIDRA.', acao: 'Abrir ETL', Icon: Database, destino: { env: 'etl' } },
  { etapa: '3 · Visualização', titulo: 'Mapa interativo', texto: 'Pinte os municípios por atributo ou indicador, desenhe, meça e exporte em até 4K.', acao: 'Abrir mapa', Icon: MapIcon, destino: { env: 'map' } },
  { etapa: '3 · Visualização', titulo: 'Indicadores', texto: 'Ranking, série temporal, comparação e perfil de cada município.', acao: 'Abrir indicadores', Icon: ChartColumn, destino: { env: 'data' } },
];

const WelcomeSection = ({ onNavigate, onEnvironment, onOpenWizard }) => (
  <div className="inicio-visao fade-in">
    <section className="inicio-hero">
      <div className="inicio-hero-texto">
        <p className="inicio-sobretitulo">Inteligência de dados municipais</p>
        <h1>Os dados de cada município, num só mapa.</h1>
        <p className="inicio-lead">
          Junte tabelas do IBGE, FINBRA, DATASUS e SNIS à malha dos municípios brasileiros, compare indicadores
          e exporte mapas prontos para relatório.
        </p>
        <div className="inicio-acoes">
          <button type="button" className="btn btn-primary btn-lg" onClick={() => onEnvironment('map')}>
            <MapIcon size={20} strokeWidth={1.75} aria-hidden="true" /> Abrir o mapa
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => onOpenWizard('tabela')}>
            <Upload size={20} strokeWidth={1.75} aria-hidden="true" /> Juntar minha tabela (Excel ou CSV)
          </button>
        </div>
        <p className="inicio-nota">
          <Check size={16} strokeWidth={2} aria-hidden="true" />
          A malha municipal do IBGE já vem no app — não é preciso baixar geometria.
        </p>
      </div>

      <figure className="inicio-exemplo">
        <div className="inicio-exemplo-topo">
          <div>
            <p className="inicio-exemplo-titulo">Pernambuco · área territorial</p>
            <p className="inicio-exemplo-sub">185 municípios · Recife em destaque</p>
          </div>
          <span className="selo selo-neutro">Exemplo</span>
        </div>
        <img src={exemploMapa} alt="Mapa de Pernambuco com os municípios coloridos pela área territorial, em cinco tons de petróleo; Recife contornado em terracota." className="inicio-exemplo-mapa" width="600" height="280" />
        <figcaption>
          <div className="inicio-exemplo-escala" aria-hidden="true">
            {ESCALA_PETROLEO.map(c => <span key={c} style={{ background: c }} />)}
          </div>
          <div className="inicio-exemplo-rotulos">
            <span>18 km²</span>
            <span>Área territorial (km²) · 5 classes por quantil</span>
            <span>4.585 km²</span>
          </div>
        </figcaption>
      </figure>
    </section>

    <section className="inicio-modulos" aria-label="Módulos do sistema">
      {MODULOS.map(({ etapa, titulo, texto, acao, Icon, destino }) => (
        <article key={titulo} className="inicio-modulo">
          <div className="inicio-modulo-topo">
            <span className="inicio-modulo-icone"><Icon size={22} strokeWidth={1.75} aria-hidden="true" /></span>
            <span className="inicio-modulo-etapa">{etapa}</span>
          </div>
          <h2>{titulo}</h2>
          <p>{texto}</p>
          <button
            type="button"
            className="inicio-modulo-link"
            onClick={() => destino.view ? onNavigate(destino.view) : onEnvironment(destino.env)}
          >
            {acao} <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </article>
      ))}
    </section>
  </div>
);

const semAcento = (t) => (t || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const matches = (item, term) => !term || [item.name, item.description, item.institution, item.category]
  .some(campo => semAcento(campo).includes(term));

const CatalogSection = () => {
  const [activeTab, setActiveTab] = useState('brazil');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const availableCategories = useMemo(() => {
    if (activeTab === 'brazil') {
      return ['Todas', ...Object.keys(catalogData.brazilian_databases).sort()];
    } else {
      const categories = new Set(catalogData.international_databases.map(item => item.category).filter(Boolean));
      return ['Todas', ...Array.from(categories).sort()];
    }
  }, [activeTab]);

  const filteredData = useMemo(() => {
    const term = semAcento(searchTerm.trim());
    let data = {};

    if (activeTab === 'brazil') {
      Object.keys(catalogData.brazilian_databases).forEach(category => {
        if (selectedCategory !== 'Todas' && category !== selectedCategory) return;
        const items = catalogData.brazilian_databases[category].filter(item => matches(item, term));
        if (items.length > 0) data[category] = items;
      });
    } else {
      const items = catalogData.international_databases.filter(item => {
        if (selectedCategory !== 'Todas' && item.category !== selectedCategory) return false;
        return matches(item, term);
      });
      data = items.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
      }, {});
    }
    return data;
  }, [activeTab, searchTerm, selectedCategory]);

  const total = Object.values(filteredData).reduce((n, items) => n + items.length, 0);

  return (
    <div className="catalog-section fade-in">
      <div className="secao-cabecalho">
        <div>
          <h1>Catálogo de bases</h1>
          <p>Onde encontrar os dados públicos para levar ao mapa. Os links abrem o site oficial de cada base.</p>
        </div>
      </div>

      <div className="catalog-controles">
        <div className="segmentado" role="group" aria-label="Abrangência">
          <button type="button" aria-pressed={activeTab === 'brazil'} onClick={() => { setActiveTab('brazil'); setSelectedCategory('Todas'); }}>Bases nacionais</button>
          <button type="button" aria-pressed={activeTab === 'international'} onClick={() => { setActiveTab('international'); setSelectedCategory('Todas'); }}>Bases internacionais</button>
        </div>
        <label className="catalog-busca">
          <Search size={18} strokeWidth={1.75} aria-hidden="true" />
          <input
            type="search"
            className="entrada"
            placeholder="Buscar base, tema ou instituição"
            aria-label="Buscar base, tema ou instituição"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="selecao catalog-categoria" aria-label="Tema">
          {availableCategories.map(cat => <option key={cat} value={cat}>{cat === 'Todas' ? 'Todos os temas' : cat}</option>)}
        </select>
        <span className="catalog-total" role="status">{total} {total === 1 ? 'base' : 'bases'}</span>
      </div>

      {total === 0 && (
        <p className="catalog-vazio">Nenhuma base encontrada. Tente outro termo ou escolha “Todos os temas”.</p>
      )}

      <div className="catalog-grid">
        {Object.keys(filteredData).map(category => (
          <section key={category} className="category-group">
            <h2 className="category-title">{category} <span>{filteredData[category].length}</span></h2>
            <div className="cards-wrapper">
              {filteredData[category].map((source, idx) => (
                <article key={idx} className="data-card">
                  <div className="data-card-topo">
                    <h3>{source.name}</h3>
                    {source.access_type && <span className={`selo ${/aberto|livre|p[uú]blico/i.test(source.access_type) ? 'selo-oficial' : 'selo-neutro'}`}>{source.access_type}</span>}
                  </div>
                  {source.institution && <p className="data-card-inst">{source.institution}</p>}
                  <p className="data-card-desc">{source.description}</p>
                  <div className="card-footer">
                    {source.temporal_coverage && <span className="data-card-meta">{source.temporal_coverage}</span>}
                    {source.url && (
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                        Acessar <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

const FormatsSection = () => (
  <div className="formats-section fade-in">
    <div className="secao-cabecalho">
      <div>
        <h1>Formatos de importação</h1>
        <p>Para a maioria dos casos, use <strong>Juntar minha tabela</strong>: basta uma coluna com o código IBGE. Os formatos abaixo são para a importação avançada.</p>
      </div>
    </div>
    <p className="section-intro">
      Para garantir a correta integração dos dados no sistema, os arquivos devem seguir rigorosamente as especificações abaixo.
      Recomendamos o uso de codificação <strong>UTF-8</strong> para todos os arquivos de texto.
    </p>

    <div className="format-block">
      <h2><Table size={20} strokeWidth={1.75} aria-hidden="true" /> 1. Indicadores (CSV)</h2>
      <p>
        Este arquivo contém os dados estatísticos dos municípios. O separador deve ser <strong>ponto e vírgula (;)</strong>.
      </p>

      <h4>Estrutura de Colunas</h4>
      <div className="table-responsive">
        <table className="format-table">
          <thead>
            <tr>
              <th>Nome da Coluna</th>
              <th>Tipo</th>
              <th>Obrigatório</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Codigo_Municipio</code></td>
              <td>Texto/Número</td>
              <td>Sim</td>
              <td>Código IBGE de 7 dígitos do município.</td>
            </tr>
            <tr>
              <td><code>Nome_Indicador</code></td>
              <td>Texto</td>
              <td>Sim</td>
              <td>Nome descritivo do indicador (ex: "PIB per Capita").</td>
            </tr>
            <tr>
              <td><code>Ano_Observacao</code></td>
              <td>Número</td>
              <td>Sim</td>
              <td>Ano de referência do dado (ex: 2020).</td>
            </tr>
            <tr>
              <td><code>Valor</code></td>
              <td>Número (Decimal)</td>
              <td>Sim</td>
              <td>Valor numérico do indicador. Use ponto (.) para decimais.</td>
            </tr>
            <tr>
              <td><code>Indice_Posicional</code></td>
              <td>Número (0-1)</td>
              <td>Não</td>
              <td>Valor normalizado entre 0 e 1 para rankings e mapas de calor.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>Exemplo de Arquivo</h4>
      <pre>Codigo_Municipio;Nome_Indicador;Ano_Observacao;Valor;Indice_Posicional
        4106902;PIB per Capita;2020;45000.50;0.75
        4106902;IDH;2010;0.78;0.82
        3550308;PIB per Capita;2020;55000.00;0.90</pre>
    </div>

    <div className="format-block">
      <h2><MapPin size={20} strokeWidth={1.75} aria-hidden="true" /> 2. Municípios (CSV)</h2>
      <p>
        Arquivo base com informações cadastrais e geográficas dos municípios. Separador: <strong>ponto e vírgula (;)</strong>.
      </p>

      <h4>Estrutura de Colunas</h4>
      <div className="table-responsive">
        <table className="format-table">
          <thead>
            <tr>
              <th>Nome da Coluna</th>
              <th>Tipo</th>
              <th>Obrigatório</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Codigo_Municipio</code></td>
              <td>Texto/Número</td>
              <td>Sim</td>
              <td>Código IBGE de 7 dígitos (Chave Primária).</td>
            </tr>
            <tr>
              <td><code>Nome_Municipio</code></td>
              <td>Texto</td>
              <td>Sim</td>
              <td>Nome oficial do município.</td>
            </tr>
            <tr>
              <td><code>Sigla_Estado</code></td>
              <td>Texto (2 chars)</td>
              <td>Sim</td>
              <td>Sigla da Unidade Federativa (ex: PR, SP).</td>
            </tr>
            <tr>
              <td><code>Latitude_Municipio</code></td>
              <td>Número</td>
              <td>Sim</td>
              <td>Coordenada de latitude do centroide (graus decimais).</td>
            </tr>
            <tr>
              <td><code>Longitude_Municipio</code></td>
              <td>Número</td>
              <td>Sim</td>
              <td>Coordenada de longitude do centroide (graus decimais).</td>
            </tr>
            <tr>
              <td><code>Sigla_Regiao</code></td>
              <td>Texto</td>
              <td>Não</td>
              <td>Região do país (ex: Sul, Sudeste).</td>
            </tr>
            <tr>
              <td><code>Area_Municipio</code></td>
              <td>Número</td>
              <td>Não</td>
              <td>Área territorial em km².</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>Exemplo de Arquivo</h4>
      <pre>Codigo_Municipio;Nome_Municipio;Sigla_Estado;Latitude_Municipio;Longitude_Municipio;Sigla_Regiao
        4106902;Curitiba;PR;-25.4284;-49.2733;Sul
        3550308;São Paulo;SP;-23.5505;-46.6333;Sudeste</pre>
    </div>

    <div className="format-block">
      <h2><Hexagon size={20} strokeWidth={1.75} aria-hidden="true" /> 3. Geometrias (GeoJSON)</h2>
      <p>
        Arquivo padrão GeoJSON contendo as fronteiras dos municípios. O sistema utiliza a propriedade <code>CD_MUN</code> (ou similar) para vincular com os dados CSV.
      </p>

      <h4>Requisitos</h4>
      <ul className="requirements-list">
        <li>O arquivo deve ser um objeto do tipo <code>FeatureCollection</code>.</li>
        <li>Cada <code>Feature</code> deve ser do tipo <code>Polygon</code> ou <code>MultiPolygon</code>.</li>
        <li>
          O objeto <code>properties</code> de cada feature <strong>DEVE</strong> conter um campo com o código do município (ex: <code>CD_MUN</code>, <code>cod_ibge</code>) para permitir a junção com os dados tabulares.
        </li>
        <li>As coordenadas devem estar no sistema de referência <strong>WGS84 (EPSG:4326)</strong>.</li>
      </ul>

      <h4>Exemplo de Estrutura</h4>
      <pre>{`{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "CD_MUN": "4106902",
        "NM_MUN": "Curitiba",
        "SIGLA_UF": "PR"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [ ... ]
      }
    }
  ]
}`}</pre>
    </div>
  </div>
);

// --- Main Component ---

const VISOES = [
  { id: 'welcome', label: 'Visão geral' },
  { id: 'catalog', label: 'Catálogo de bases' },
  { id: 'importFormats', label: 'Formatos de importação' },
];

const DataSourceInfo = () => {
  const [activeView, setActiveView] = useState('welcome');
  const { setActiveEnvironment, setDataWizardMode } = useContext(UIContext);

  return (
    <div className="inicio">
      <div className="inicio-subnav">
        <div className="abas" role="tablist" aria-label="Início">
          {VISOES.map(v => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={activeView === v.id}
              onClick={() => setActiveView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div className="inicio-conteudo" role="tabpanel">
        {activeView === 'welcome' && (
          <WelcomeSection
            onNavigate={setActiveView}
            onEnvironment={setActiveEnvironment}
            onOpenWizard={setDataWizardMode}
          />
        )}
        {activeView === 'catalog' && <CatalogSection />}
        {activeView === 'importFormats' && <FormatsSection />}
      </div>
    </div>
  );
};

export default DataSourceInfo;
