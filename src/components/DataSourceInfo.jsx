import React, { useState, useMemo } from 'react';
import '../styles/DataSourceInfo.css'; // Styles will be applied
import TransformacaoMunicipios from './ETL/TransformacaoMunicipios'; // Import the transformation component
import TransformacaoSNIS from './ETL/TransformacaoSNIS'; // Import the SNIS transformation component
import TransformacaoIndicePosicional from './ETL/TransformacaoIndicePosicional'; // Import the Positional Index component
import TransformacaoIPEADATA from './ETL/TransformacaoIPEADATA'; // Import the IPEADATA transformation component
import TransformacaoDATASUS from './ETL/TransformacaoDATASUS'; // Import the DATASUS transformation component
import TransformacaoFINBRA from './ETL/TransformacaoFINBRA'; // Import the FINBRA transformation component
import TransformacaoIBGE from './ETL/TransformacaoIBGE'; // Import the IBGE transformation component
import TransformacaoCodigoMunicipio from './ETL/TransformacaoCodigoMunicipio'; // Import the Code Correction component
import catalogData from '../data/catalog.json';

// --- Catalog Component ---
const CatalogView = () => {
  const [activeTab, setActiveTab] = useState('brazil'); // 'brazil' or 'international'
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to group array by key
  const groupByKey = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  };

  // Process and filter data
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let data = {};

    if (activeTab === 'brazil') {
      // Brazilian data is already grouped by category object
      Object.keys(catalogData.brazilian_databases).forEach(category => {
        const items = catalogData.brazilian_databases[category].filter(item =>
          (item.name && item.name.toLowerCase().includes(term)) ||
          (item.description && item.description.toLowerCase().includes(term)) ||
          (item.type && item.type.toLowerCase().includes(term))
        );
        if (items.length > 0) {
          data[category] = items;
        }
      });
    } else {
      // International data is an array
      const items = catalogData.international_databases.filter(item =>
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.institution && item.institution.toLowerCase().includes(term)) ||
        (item.category && item.category.toLowerCase().includes(term))
      );
      // Group international items by category for display consistency
      data = groupByKey(items, 'category');
    }
    return data;
  }, [activeTab, searchTerm, catalogData]);

  // Helper to render details list
  const renderDetailList = (items) => {
    if (!items || items.length === 0) return null;
    return (
      <ul className="details-list">
        {items.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    );
  };

  const sections = Object.keys(filteredData).sort();

  return (
    <div className="catalog-view">
      {/* Search and Filter Header */}
      <div className="catalog-controls">
        <div className="tabs">
          <button
            className={`sub-view-button ${activeTab === 'brazil' ? 'active' : ''}`}
            onClick={() => setActiveTab('brazil')}
          >
            🇧🇷 Bases Nacionais
          </button>
          <button
            className={`sub-view-button ${activeTab === 'international' ? 'active' : ''}`}
            onClick={() => setActiveTab('international')}
          >
            🌍 Bases Internacionais
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar por nome, descrição, tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search search-icon"></i>
        </div>
      </div>

      {/* Content */}
      {sections.length === 0 ? (
        <div className="no-results">
          <h3>Nenhum resultado encontrado</h3>
          <p>Tente outros termos de pesquisa.</p>
        </div>
      ) : (
        sections.map(category => (
          <section key={category} className="data-source-section">
            <div className="section-header">
              <h2 className="section-title">{category}</h2>
            </div>
            <div className="cards-grid">
              {filteredData[category].map((source, index) => (
                <div key={index} className="base-card">
                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="card-title">{source.name}</h3>
                      {source.type && <span className="card-type bg-blue-100 text-blue-800">{source.type}</span>}
                      {source.institution && <span className="card-type bg-indigo-100 text-indigo-800">{source.institution}</span>}
                    </div>

                    <p className="card-description">{source.description}</p>

                    {/* Additional Details for Brazilian items */}
                    {activeTab === 'brazil' && (
                      <>
                        {source.info_available && source.info_available.length > 0 && (
                          <div className="card-details">
                            <h4 className="details-title">Informações disponíveis:</h4>
                            {renderDetailList(source.info_available)}
                          </div>
                        )}
                        {source.how_to_use && source.how_to_use.length > 0 && (
                          <div className="card-details">
                            <h4 className="details-title">Como utilizar:</h4>
                            {renderDetailList(source.how_to_use)}
                          </div>
                        )}
                      </>
                    )}

                    {/* Additional Details for International items */}
                    {activeTab === 'international' && (
                      <>
                        <div className="card-details card-details-text">
                          <div className="card-details-row"><strong>Cobertura:</strong> {source.geographic_coverage}</div>
                          <div className="card-details-row"><strong>Período:</strong> {source.temporal_coverage}</div>
                          {source.update_frequency && <div className="card-details-row"><strong>Atualização:</strong> {source.update_frequency}</div>}
                          {source.quality_score && <div className="card-details-row"><strong>Índice de Qualidade:</strong> {source.quality_score}/10</div>}
                        </div>

                        {source.data_types && source.data_types.length > 0 && (
                          <div className="card-details">
                            <h4 className="details-title">Tipos de Dados:</h4>
                            <div className="data-types-container">
                              {source.data_types.map((type, idx) => (
                                <span key={idx} className="data-type-tag">{type}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <div className="card-footer">
                      {source.url ? (
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="card-link-button">
                          <i className="fas fa-external-link-alt link-icon"></i>
                          Acessar {source.access_type ? `(${source.access_type})` : 'Base'}
                        </a>
                      ) : (
                        <span className="link-unavailable">Link não disponível</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      {/* Footer */}
      <footer className="data-source-footer">
        <p>Última atualização: {catalogData.metadata?.date || 'Novembro 2025'} • Versão {catalogData.metadata?.version || '2.0'}</p>
        <p>Total de bases catalogadas: {catalogData.metadata?.total_databases || '80+'}</p>
      </footer>
    </div>
  );
};

// --- Import Formats Component ---
const ImportFormatsView = () => {
  return (
    <div className="import-formats-view">
      <h2>Formatos de Arquivo para Importação</h2>
      <p>Para garantir a importação correta dos dados para o aplicativo, siga os formatos descritos abaixo.</p>

      <section className="format-section">
        <h3>1. Indicadores (CSV)</h3>
        <p>Arquivo CSV separado por ponto e vírgula (`;`) com as seguintes colunas obrigatórias:</p>
        <ul className="column-list">
          <li><code>Codigo_Municipio</code>: Código IBGE do município (7 dígitos).</li>
          <li><code>Nome_Indicador</code>: Nome exato do indicador.</li>
          <li><code>Ano_Observacao</code>: Ano a que o dado se refere (formato YYYY).</li>
          <li><code>Valor</code>: Valor numérico do indicador (usar ponto `.` como separador decimal).</li>
          <li><code>Indice_Posicional</code>: Valor numérico do índice posicional (usar ponto `.` como separador decimal).</li>
        </ul>
        <pre>
          <code>
{`Codigo_Municipio;Nome_Indicador;Ano_Observacao;Valor;Indice_Posicional
4106902;Taxa de Mortalidade Infantil;2020;10.5;0.75
4106902;IDH Municipal;2010;0.762;0.81
3550308;Taxa de Mortalidade Infantil;2020;8.2;0.92
...`}
          </code>
        </pre>
      </section>

      <section className="format-section">
        <h3>2. Municípios (CSV)</h3>
        <p>Arquivo CSV separado por ponto e vírgula (`;`) com as seguintes colunas obrigatórias:</p>
        <ul className="column-list">
          <li><code>Codigo_Municipio</code>: Código IBGE do município (7 dígitos).</li>
          <li><code>Nome_Municipio</code>: Nome do município.</li>
          <li><code>Sigla_Estado</code>: Sigla da Unidade da Federação (ex: PR, SP).</li>
          <li><code>Sigla_Regiao</code>: Sigla da Região (ex: S, SE).</li>
          <li><code>Area_Municipio</code>: Área do município em km² (usar ponto `.` como separador decimal).</li>
          <li><code>Capital</code>: Indicar se é capital (`true` ou `false`).</li>
          <li><code>Longitude_Municipio</code>: Longitude da sede municipal (graus decimais, usar ponto `.` como separador decimal).</li>
          <li><code>Latitude_Municipio</code>: Latitude da sede municipal (graus decimais, usar ponto `.` como separador decimal).</li>
          <li><code>Altitude_Municipio</code>: Altitude da sede municipal em metros (usar ponto `.` como separador decimal).</li>
        </ul>
        <pre>
          <code>
{`Codigo_Municipio;Nome_Municipio;Sigla_Estado;Sigla_Regiao;Area_Municipio;Capital;Longitude_Municipio;Latitude_Municipio;Altitude_Municipio
4106902;Curitiba;PR;S;434.892;true;-49.2776;-25.4296;934
3550308;São Paulo;SP;SE;1521.11;true;-46.6333;-23.5505;760
...`}
          </code>
        </pre>
         <p><strong>Observação:</strong> Colunas adicionais podem estar presentes no CSV e serão incluídas nas propriedades do município.</p>
      </section>

      <section className="format-section">
        <h3>3. Geometrias (GeoJSON)</h3>
        <p>Arquivo GeoJSON (`.json` ou `.geojson`) contendo uma `FeatureCollection`. Cada `Feature` deve ter:</p>
        <ul className="column-list">
          <li><code>type</code>: "Feature"</li>
          <li><code>properties</code>: Um objeto que <strong>obrigatoriamente</strong> contém um campo com o código IBGE do município (7 dígitos). O nome exato deste campo será solicitado no momento da importação. Outras propriedades são opcionais.</li>
          <li><code>geometry</code>: Um objeto GeoJSON válido do tipo `Polygon` ou `MultiPolygon`.</li>
        </ul>
        <pre>
          <code>
{`{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "CD_MUN": "4106902", // Ou o nome do campo que contém o código
        "NM_MUN": "Curitiba",
        "SIGLA_UF": "PR"
        // ... outras propriedades
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [ [-49.2, -25.4], [-49.3, -25.5], ... ]
        ]
      }
    },
    // ... outras features
  ]
}`}
          </code>
        </pre>
         <p><strong>Observação:</strong> Se um município já existir (baseado no código), sua geometria será atualizada. Se não existir, será adicionado como um ponto baseado nas coordenadas do CSV de municípios (se disponíveis).</p>
      </section>

      <section className="format-section">
        <h3>4. Perfil (JSON)</h3>
        <p>Arquivo JSON (`.json`) contendo um objeto com duas chaves principais:</p>
        <ul className="column-list">
          <li><code>municipios</code>: Um array de objetos, onde cada objeto representa um município e segue <strong>exatamente</strong> a mesma estrutura de colunas do CSV de Municípios (ver item 2).</li>
          <li><code>indicadores</code>: Um array de objetos, onde cada objeto representa um registro de indicador e segue <strong>exatamente</strong> a mesma estrutura de colunas do CSV de Indicadores (ver item 1).</li>
        </ul>
        <pre>
          <code>
{`{
  "municipios": [
    {
      "Codigo_Municipio": "4106902",
      "Nome_Municipio": "Curitiba",
      "Sigla_Estado": "PR",
      "Sigla_Regiao": "S",
      "Area_Municipio": "434.892",
      "Capital": "true",
      "Longitude_Municipio": "-49.2776",
      "Latitude_Municipio": "-25.4296",
      "Altitude_Municipio": "934"
      // ... outras colunas do CSV de municípios
    },
    // ... outros municípios
  ],
  "indicadores": [
    {
      "Codigo_Municipio": "4106902",
      "Nome_Indicador": "Taxa de Mortalidade Infantil",
      "Ano_Observacao": "2020",
      "Valor": "10.5",
      "Indice_Posicional": "0.75"
    },
    {
      "Codigo_Municipio": "4106902",
      "Nome_Indicador": "IDH Municipal",
      "Ano_Observacao": "2010",
      "Valor": "0.762",
      "Indice_Posicional": "0.81"
    },
    // ... outros indicadores
  ]
}`}
          </code>
        </pre>
        <p><strong>Observação:</strong> Carregar um perfil substituirá completamente os dados de municípios e indicadores existentes no aplicativo.</p>
      </section>
    </div>
  );
};

// --- Transformation Process View Component ---
const TransformationView = () => {
  const [selectedTransformation, setSelectedTransformation] = useState('municipios'); // 'municipios', 'snis', 'ipeadata', 'datasus', 'finbra', 'ibge', 'codigomun', 'indice'

  return (
    <div className="transformation-process-section"> {/* Reuse styles from ETLEnvironment.css or add specific ones */}
      <div className="transformation-sidebar">
        <h3>Processos</h3>
        <button
          className={`sub-nav-button ${selectedTransformation === 'municipios' ? 'active' : ''}`}
          onClick={() => setSelectedTransformation('municipios')}
        >
          Municípios
        </button>
        <button
          className={`sub-nav-button ${selectedTransformation === 'snis' ? 'active' : ''}`}
          onClick={() => setSelectedTransformation('snis')}
        >
          Indicadores SNIS
        </button>
        <button
          className={`sub-nav-button ${selectedTransformation === 'ipeadata' ? 'active' : ''}`}
          onClick={() => setSelectedTransformation('ipeadata')}
        >
          Indicadores IPEADATA
        </button>
        <button
          className={`sub-nav-button ${selectedTransformation === 'datasus' ? 'active' : ''}`}
          onClick={() => setSelectedTransformation('datasus')}
        >
          Indicadores DATASUS
        </button>
        <button
          className={`sub-nav-button ${selectedTransformation === 'finbra' ? 'active' : ''}`}
          onClick={() => setSelectedTransformation('finbra')}
        >
          Indicadores FINBRA
        </button>
        <button
          className={`sub-nav-button ${selectedTransformation === 'ibge' ? 'active' : ''}`}
          onClick={() => setSelectedTransformation('ibge')}
        >
          Indicadores IBGE/SIDRA
        </button>
         <button
          className={`sub-nav-button ${selectedTransformation === 'codigomun' ? 'active' : ''}`}
          onClick={() => setSelectedTransformation('codigomun')}
        >
          Correção Código Município (6{'->'}7)
        </button>
        <button
          className={`sub-nav-button ${selectedTransformation === 'indice' ? 'active' : ''}`}
          onClick={() => setSelectedTransformation('indice')}
        >
          Índice Posicional
        </button>
        {/* Add more buttons here for other transformation processes */}
      </div>
      <div className="transformation-content">
        {selectedTransformation === 'municipios' && <TransformacaoMunicipios />}
        {selectedTransformation === 'snis' && <TransformacaoSNIS />}
        {selectedTransformation === 'ipeadata' && <TransformacaoIPEADATA />}
        {selectedTransformation === 'datasus' && <TransformacaoDATASUS />}
        {selectedTransformation === 'finbra' && <TransformacaoFINBRA />}
        {selectedTransformation === 'ibge' && <TransformacaoIBGE />}
        {selectedTransformation === 'codigomun' && <TransformacaoCodigoMunicipio />}
        {selectedTransformation === 'indice' && <TransformacaoIndicePosicional />}
        {/* Add conditional rendering for other transformation components */}
      </div>
    </div>
  );
};


// --- Main Component ---
const DataSourceInfo = () => {
  const [activeSubView, setActiveSubView] = useState('welcome'); // default to welcome tab

  return (
    <div className="data-source-info-environment">
      {/* Header */}
      <div className="data-source-info-header">
        <h1>Sistema de Informações de Municípios</h1>
        {/* Sub-view Selector Buttons */}
        <div className="sub-view-selector">
          <button
            className={`sub-view-button ${activeSubView === 'welcome' ? 'active' : ''}`}
            onClick={() => setActiveSubView('welcome')}
          >
            Boas-vindas
          </button>
          <button
            className={`sub-view-button ${activeSubView === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveSubView('catalog')}
          >
            Catálogo de Bases
          </button>
          <button
            className={`sub-view-button ${activeSubView === 'importFormats' ? 'active' : ''}`}
            onClick={() => setActiveSubView('importFormats')}
          >
            Formatos de Importação
          </button>
          <button
            className={`sub-view-button ${activeSubView === 'transformation' ? 'active' : ''}`}
            onClick={() => setActiveSubView('transformation')}
          >
            Processos de Transformação
          </button>
        </div>
      </div>

      {/* Main Content Area - Renders based on activeSubView */}
      <div className="data-source-info-content">
        {activeSubView === 'welcome' && (
          <div className="data-source-info-content">
            <h2>Sistema de Informações de Municípios</h2>
            <p>
              Esta plataforma foi desenvolvida para facilitar a análise, visualização e gestão de dados municipais brasileiros.
              Ela permite importar dados, explorar indicadores, visualizar mapas temáticos e preparar dados para apoiar estudos, planejamento e gestão pública.
            </p>

            <h3>O que você pode fazer com esta ferramenta?</h3>
            <ul>
              <li><strong>Importar dados municipais e indicadores</strong> em formato CSV ou GeoJSON.</li>
              <li><strong>Visualizar mapas temáticos</strong> com dados municipais e indicadores.</li>
              <li><strong>Explorar tabelas e gráficos</strong> com indicadores sociais, econômicos, ambientais e outros.</li>
              <li><strong>Calcular indicadores específicos</strong> (Calculadora BSE - <em>em construção</em>).</li>
              <li><strong>Salvar e carregar perfis</strong> com seus dados para continuar o trabalho depois.</li>
            </ul>

            <h3>Onde encontrar dados para usar no sistema?</h3>
            <p>
              A aba <strong>Catálogo de Bases</strong> reúne links para portais oficiais como IBGE, IPEADATA, DATASUS, Portal da Transparência, entre outros.
              Além disso, há um link para uma <strong>pasta no Google Drive</strong> com dados prontos para uso no sistema.
              Você pode baixar dados dessas fontes para importar aqui.
            </p>

            <h3>Como importar e carregar seus dados</h3>
            <p>
              Para importar arquivos, clique no <strong>botão superior esquerdo</strong> (ícone de pastinha):
            </p>
            <ul>
              <li>Importe arquivos CSV com dados de municípios e indicadores.</li>
              <li>Importe arquivos GeoJSON com geometrias municipais.</li>
              <li>Carregue um perfil completo em JSON (municípios + indicadores).</li>
              <li>Salve ou carregue seus perfis de dados.</li>
            </ul>
            <p>
              Consulte a aba <strong>Formatos de Importação</strong> para preparar seus arquivos corretamente.
            </p>

            <h3>Como navegar, visualizar e filtrar dados</h3>
            <p>
              Use o <strong>botão superior direito</strong> (ícone de gráfico) para:
            </p>
            <ul>
              <li>Alternar entre os ambientes: <strong>Mapa</strong>, <strong>Indicadores</strong> e <strong>Início</strong>.</li>
              <li>Aplicar filtros por região, estado, município, capitais, atributos e indicadores.</li>
              <li>Alterar o estilo do mapa.</li>
              <li>Acessar a Calculadora BSE (<em>em construção</em>).</li>
            </ul>

            <h3>Ambientes de visualização disponíveis</h3>
            <ul>
              <li><strong>Mapa:</strong> Visualize municípios e indicadores em um mapa interativo.</li>
              <li><strong>Indicadores:</strong> Explore tabelas e gráficos detalhados.</li>
              <li><strong>Calculadora BSE:</strong> (em construção) Ferramenta para cálculos específicos.</li>
            </ul>

            <h3>Dicas para usar o sistema</h3>
            <ul>
              <li>Comece importando seus dados ou usando os dados do Drive.</li>
              <li>Navegue entre os ambientes para explorar diferentes visualizações.</li>
              <li>Use os filtros para focar em regiões, municípios ou indicadores específicos.</li>
              <li>Consulte o catálogo para encontrar mais dados públicos.</li>
              <li>Salve seus perfis para continuar o trabalho depois.</li>
            </ul>

            <h3>Comece agora!</h3>
            <p>
              Navegue pelas abas acima para explorar dados, importar suas bases e visualizar informações municipais.
              Esta página serve como guia para aproveitar ao máximo o sistema.
            </p>
          </div>
        )}
        {activeSubView === 'catalog' && <CatalogView />}
        {activeSubView === 'importFormats' && <ImportFormatsView />}
        {activeSubView === 'transformation' && <TransformationView />}
      </div>
    </div>
  );
};

export default DataSourceInfo;
