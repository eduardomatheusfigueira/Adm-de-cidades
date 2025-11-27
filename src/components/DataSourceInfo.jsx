import React, { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import '../styles/DataSourceInfo.css';
import catalogData from '../data/catalog.json';

// --- Sub-components ---

const WelcomeSection = ({ onNavigate }) => (
  <div className="welcome-section fade-in">
    <div className="welcome-hero">
      <h1>Bem-vindo ao SisInfo</h1>
      <p>
        O SisInfo é uma ferramenta de administração e inteligência municipal projetada para integrar,
        processar e visualizar dados complexos de forma simples e intuitiva.
      </p>
    </div>

    <div className="how-it-works">
      <h2>Como Funciona</h2>
      <div className="steps-grid">
        <div className="step-card">
          <div className="step-number">1</div>
          <h3>Dados</h3>
          <p>
            Tudo começa com os dados. O sistema aceita arquivos CSV (Indicadores e Municípios)
            e GeoJSON (Geometrias) padronizados.
          </p>
        </div>
        <div className="step-card">
          <div className="step-number">2</div>
          <h3>Processamento (ETL)</h3>
          <p>
            Utilize o módulo de ETL para transformar dados brutos de fontes oficiais (IBGE, FINBRA)
            no formato padrão do sistema.
          </p>
        </div>
        <div className="step-card">
          <div className="step-number">3</div>
          <h3>Visualização</h3>
          <p>
            Explore os dados através de mapas interativos, rankings dinâmicos e perfis detalhados
            de cada município.
          </p>
        </div>
      </div>
    </div>

    <div className="modules-overview">
      <h2>Módulos do Sistema</h2>
      <div className="quick-actions-grid">
        <div className="action-card" onClick={() => onNavigate('catalog')}>
          <div className="icon-wrapper"><i className="fas fa-book"></i></div>
          <h3>Catálogo e Formatos</h3>
          <p>Consulte as bases disponíveis e veja como formatar seus arquivos para importação.</p>
        </div>
        <div className="action-card" onClick={() => onNavigate('transformation')}>
          <div className="icon-wrapper"><i className="fas fa-database"></i></div>
          <h3>ETL & Dados</h3>
          <p>Ferramentas para limpeza, transformação e carga de dados no sistema.</p>
        </div>
        <div className="action-card" onClick={() => window.location.hash = '#map'}> {/* Assuming hash routing or similar for main nav */}
          <div className="icon-wrapper"><i className="fas fa-map-marked-alt"></i></div>
          <h3>Mapa Interativo</h3>
          <p>Visualize indicadores georreferenciados e navegue pelo território.</p>
        </div>
      </div>
    </div>
  </div>
);

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
    const term = searchTerm.toLowerCase();
    let data = {};

    if (activeTab === 'brazil') {
      Object.keys(catalogData.brazilian_databases).forEach(category => {
        if (selectedCategory !== 'Todas' && category !== selectedCategory) return;
        const items = catalogData.brazilian_databases[category].filter(item =>
          (item.name && item.name.toLowerCase().includes(term)) ||
          (item.description && item.description.toLowerCase().includes(term))
        );
        if (items.length > 0) data[category] = items;
      });
    } else {
      const items = catalogData.international_databases.filter(item => {
        if (selectedCategory !== 'Todas' && item.category !== selectedCategory) return false;
        return (
          (item.name && item.name.toLowerCase().includes(term)) ||
          (item.description && item.description.toLowerCase().includes(term))
        );
      });
      data = items.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
      }, {});
    }
    return data;
  }, [activeTab, searchTerm, selectedCategory]);

  return (
    <div className="catalog-section fade-in">
      <div className="section-header-controls">
        <div className="tabs">
          <button className={`tab-btn ${activeTab === 'brazil' ? 'active' : ''}`} onClick={() => setActiveTab('brazil')}>
            🇧🇷 Bases Nacionais
          </button>
          <button className={`tab-btn ${activeTab === 'international' ? 'active' : ''}`} onClick={() => setActiveTab('international')}>
            🌍 Bases Internacionais
          </button>
        </div>
        <div className="search-controls">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="category-select">
            {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="catalog-grid">
        {Object.keys(filteredData).map(category => (
          <div key={category} className="category-group">
            <h3 className="category-title">{category}</h3>
            <div className="cards-wrapper">
              {filteredData[category].map((source, idx) => (
                <div key={idx} className="data-card">
                  <h4>{source.name}</h4>
                  <p>{source.description}</p>
                  <div className="card-footer">
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                      Acessar <i className="fas fa-external-link-alt"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FormatsSection = () => (
  <div className="formats-section fade-in">
    <h2>Formatos de Importação</h2>
    <p className="section-intro">
      Para garantir a correta integração dos dados no sistema, os arquivos devem seguir rigorosamente as especificações abaixo.
      Recomendamos o uso de codificação <strong>UTF-8</strong> para todos os arquivos de texto.
    </p>

    <div className="format-block">
      <h3><i className="fas fa-table"></i> 1. Indicadores (CSV)</h3>
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
      <h3><i className="fas fa-map-marker-alt"></i> 2. Municípios (CSV)</h3>
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
      <h3><i className="fas fa-draw-polygon"></i> 3. Geometrias (GeoJSON)</h3>
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

const DataSourceInfo = () => {
  const [activeView, setActiveView] = useState('welcome');

  const sidebarItems = [
    { id: 'welcome', label: 'Boas-vindas', icon: 'fa-door-open' },
    { id: 'catalog', label: 'Catálogo de Bases', icon: 'fa-book' },
    { id: 'importFormats', label: 'Formatos de Importação', icon: 'fa-file-csv' },
    // Transformation moved to ETL Environment conceptually, but keeping link here if needed or redirect
  ];

  return (
    <div className="data-source-info-container">
      <Sidebar
        title="Início"
        items={sidebarItems}
        activeItem={activeView}
        onItemClick={setActiveView}
      />
      <div className="content-area">
        {activeView === 'welcome' && <WelcomeSection onNavigate={setActiveView} />}
        {activeView === 'catalog' && <CatalogSection />}
        {activeView === 'importFormats' && <FormatsSection />}
      </div>
    </div>
  );
};

export default DataSourceInfo;
