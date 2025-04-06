import React from 'react';
import '../styles/DataSourceInfo.css'; // We'll create this file next

const DataSourceInfo = () => {
  return (
    <div className="data-source-info-container">
      <h1>Catálogo de Bases de Dados Governamentais Brasileiras</h1>
      <p>Este catálogo reúne as principais fontes de dados abertos e sistemas de informação do governo brasileiro, organizados por áreas temáticas para facilitar a busca e o acesso.</p>

      {/* Section: Portais de Dados Gerais */}
      <section>
        <h2>Portais de Dados Gerais</h2>

        <article>
          <h3>Portal Brasileiro de Dados Abertos</h3>
          <h4>Principal</h4>
          <p>O Portal Brasileiro de Dados Abertos é o portal central que reúne dados públicos de diversas instituições governamentais brasileiras. É o ponto de partida para explorar a maioria das bases de dados disponíveis.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Catálogo de conjuntos de dados de diversos órgãos</li>
            <li>Dados estatísticos, geográficos, financeiros e orçamentários</li>
            <li>Informações sobre programas e políticas públicas</li>
            <li>Dados de todos os setores da administração pública</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o portal e use a barra de pesquisa para encontrar conjuntos de dados</li>
            <li>Filtre por organizações, temas ou formatos de dados</li>
            <li>Baixe os dados em formatos como CSV, JSON, XML</li>
            <li>Leia a documentação específica de cada conjunto de dados</li>
          </ol>
          <a href="https://dados.gov.br/" target="_blank" rel="noopener noreferrer">Acessar Portal</a>
        </article>

        <article>
          <h3>IBGE - SIDRA (Sistema IBGE de Recuperação Automática)</h3>
          <h4>Estatísticas</h4>
          <p>O SIDRA é o principal sistema de dados estatísticos do IBGE, oferecendo acesso a tabelas de dados de diversas pesquisas e censos realizados pelo instituto.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados demográficos (Censo Demográfico, PNAD)</li>
            <li>Indicadores econômicos (PIB, inflação, emprego)</li>
            <li>Dados agropecuários (Censo Agropecuário)</li>
            <li>Informações geográficas e cartográficas</li>
            <li>Estatísticas sociais (educação, saúde, trabalho)</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o SIDRA e navegue pelas pesquisas disponíveis</li>
            <li>Selecione variáveis, períodos e localidades de interesse</li>
            <li>Gere tabelas personalizadas para análise</li>
            <li>Exporte os dados em formatos como XLS, CSV ou HTML</li>
          </ol>
          <a href="https://sidra.ibge.gov.br/" target="_blank" rel="noopener noreferrer">Acessar SIDRA</a>
        </article>

        <article>
          <h3>IPARDES - BDEweb (Base de Dados do Estado)</h3>
          <h4>Regional</h4>
          <p>O BDEweb do Instituto Paranaense de Desenvolvimento Econômico e Social (IPARDES) é um sistema de informações estatísticas com mais de 15 milhões de dados classificados por grandes temas e assuntos, focado no estado do Paraná.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Produto Interno Bruto (PIB) municipal e estadual</li>
            <li>Índice de Desenvolvimento Humano (IDH)</li>
            <li>Índice Ipardes de Desempenho Municipal (IPDM)</li>
            <li>Indicadores sociais, econômicos e demográficos</li>
            <li>Dados sobre municípios do Paraná</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o BDEweb e selecione o tipo de consulta (variáveis ou localidades)</li>
            <li>Escolha os temas, subtemas e variáveis de interesse</li>
            <li>Selecione o período e as localidades para análise</li>
            <li>Exporte os dados em formatos como XLS ou PDF</li>
          </ol>
          <a href="http://www.ipardes.gov.br/bdeweb/" target="_blank" rel="noopener noreferrer">Acessar BDEweb</a>
        </article>

        <article>
          <h3>Base dos Dados</h3>
          <h4>Geral</h4>
          <p>A Base dos Dados é uma plataforma que centraliza e padroniza dados públicos brasileiros, tornando-os mais acessíveis e utilizáveis. Embora não seja governamental, reúne dados de fontes oficiais de forma organizada.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados socioeconômicos de diversas fontes governamentais</li>
            <li>Informações sobre eleições, educação, saúde e economia</li>
            <li>Dados tratados e padronizados para análise</li>
            <li>Bases de dados integradas de diferentes órgãos</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse a plataforma e explore os conjuntos de dados disponíveis</li>
            <li>Utilize os filtros para encontrar dados por tema ou fonte</li>
            <li>Faça o download direto ou use a API via Python ou R</li>
            <li>Consulte a documentação para entender a estrutura dos dados</li>
          </ol>
          <a href="https://basedosdados.org/" target="_blank" rel="noopener noreferrer">Acessar Base dos Dados</a>
        </article>
      </section>

      {/* Section: Economia e Finanças */}
      <section>
        <h2>Economia e Finanças</h2>
        <article>
          <h3>IPEADATA</h3>
          <h4>Economia</h4>
          <p>O IPEADATA é uma base de dados macroeconômicos, financeiros e regionais do Brasil mantida pelo Instituto de Pesquisa Econômica Aplicada (IPEA).</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados macroeconômicos (inflação, PIB, câmbio, juros)</li>
            <li>Séries históricas financeiras e econômicas</li>
            <li>Indicadores sociais e regionais</li>
            <li>Dados demográficos e geográficos</li>
            <li>Informações sobre mercado de trabalho</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o IPEADATA e escolha entre as bases macro, regional ou social</li>
            <li>Use a busca para encontrar séries específicas</li>
            <li>Visualize gráficos ou tabelas das séries temporais</li>
            <li>Exporte os dados em formatos como XLS, CSV ou HTML</li>
          </ol>
          <a href="http://www.ipeadata.gov.br/" target="_blank" rel="noopener noreferrer">Acessar IPEADATA</a>
        </article>

        <article>
          <h3>Portal da Transparência</h3>
          <h4>Orçamento</h4>
          <p>O Portal da Transparência do Governo Federal permite o acompanhamento da execução orçamentária e financeira do governo, oferecendo informações sobre receitas, despesas e transferências de recursos.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Despesas e receitas do governo federal</li>
            <li>Transferências de recursos para estados e municípios</li>
            <li>Dados sobre programas sociais e beneficiários</li>
            <li>Informações sobre servidores públicos</li>
            <li>Contratos, convênios e licitações</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o portal e navegue pelos menus temáticos</li>
            <li>Use os filtros para refinar as consultas por órgão, período e tipo</li>
            <li>Explore os dados através dos painéis interativos</li>
            <li>Faça download dos dados em formatos abertos (CSV, JSON)</li>
          </ol>
          <a href="https://portaldatransparencia.gov.br/" target="_blank" rel="noopener noreferrer">Acessar Portal da Transparência</a>
        </article>

        <article>
          <h3>SICONFI - Sistema de Informações Contábeis e Fiscais</h3>
          <h4>Finanças</h4>
          <p>O SICONFI é um sistema do Tesouro Nacional que coleta, armazena e disponibiliza dados contábeis e fiscais de estados, municípios e do Distrito Federal.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Relatórios fiscais de estados e municípios</li>
            <li>Balanços orçamentários, financeiros e patrimoniais</li>
            <li>Demonstrações contábeis de entes públicos</li>
            <li>Indicadores fiscais e financeiros</li>
            <li>Matriz de saldos contábeis</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o SICONFI e navegue pelas opções de consulta</li>
            <li>Selecione o tipo de relatório (DCA, RGF, RREO)</li>
            <li>Escolha o ente federativo, o período e os dados desejados</li>
            <li>Visualize ou exporte os dados em formatos como XLS ou PDF</li>
          </ol>
          <a href="https://siconfi.tesouro.gov.br/" target="_blank" rel="noopener noreferrer">Acessar SICONFI</a>
        </article>

        <article>
          <h3>Banco Central - Estatísticas</h3>
          <h4>Financeiro</h4>
          <p>O portal de estatísticas do Banco Central do Brasil disponibiliza dados sobre o sistema financeiro, câmbio, crédito, balanço de pagamentos e outros indicadores econômicos.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Séries temporais de indicadores econômicos</li>
            <li>Taxas de juros e de câmbio</li>
            <li>Dados sobre crédito e mercado financeiro</li>
            <li>Estatísticas monetárias e de balanço de pagamentos</li>
            <li>Indicadores de inflação e atividade econômica</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o Sistema Gerenciador de Séries Temporais (SGS)</li>
            <li>Pesquise por código ou nome da série de interesse</li>
            <li>Defina o período de consulta e visualize os dados</li>
            <li>Exporte os dados em diversos formatos (CSV, XLS, JSON)</li>
          </ol>
          <a href="https://www.bcb.gov.br/estatisticas" target="_blank" rel="noopener noreferrer">Acessar Estatísticas do BCB</a>
        </article>

        <article>
          <h3>Comex Stat - Estatísticas de Comércio Exterior</h3>
          <h4>Comércio</h4>
          <p>O Comex Stat é o sistema oficial para consulta e extração de dados do comércio exterior brasileiro, desenvolvido pelo Ministério do Desenvolvimento, Indústria, Comércio e Serviços (MDIC).</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados de exportações e importações brasileiras</li>
            <li>Balança comercial por período, produto e país</li>
            <li>Estatísticas por Unidade da Federação</li>
            <li>Informações sobre produtos por Nomenclatura Comum do Mercosul (NCM)</li>
            <li>Séries históricas do comércio exterior</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o Comex Stat e escolha entre exportação ou importação</li>
            <li>Defina os filtros (período, produto, país, UF)</li>
            <li>Selecione as variáveis para análise</li>
            <li>Visualize os resultados e exporte em CSV, XLS ou PDF</li>
          </ol>
          <a href="http://comexstat.mdic.gov.br/" target="_blank" rel="noopener noreferrer">Acessar Comex Stat</a>
        </article>
      </section>

      {/* Section: Saúde */}
      <section>
        <h2>Saúde</h2>
        <article>
          <h3>DATASUS - Informações de Saúde (TABNET)</h3>
          <h4>Saúde</h4>
          <p>O DATASUS é o departamento de informática do Sistema Único de Saúde que disponibiliza informações sobre saúde no Brasil. O TABNET é sua principal ferramenta para tabulação de dados.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Estatísticas vitais (nascimentos, óbitos, mortalidade)</li>
            <li>Epidemiologia e morbidade (doenças, agravos)</li>
            <li>Rede assistencial e produção de serviços de saúde</li>
            <li>Indicadores de saúde</li>
            <li>Informações demográficas e socioeconômicas</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o TABNET e escolha a base de dados de interesse</li>
            <li>Selecione as variáveis de linha, coluna e conteúdo</li>
            <li>Defina os filtros e períodos desejados</li>
            <li>Execute a tabulação e exporte os dados (CSV, XLS)</li>
          </ol>
          <a href="http://www2.datasus.gov.br/DATASUS/index.php?area=02" target="_blank" rel="noopener noreferrer">Acessar DATASUS</a>
        </article>

        <article>
          <h3>Portal de Dados Abertos da ANS</h3>
          <h4>Saúde Suplementar</h4>
          <p>O Portal de Dados Abertos da Agência Nacional de Saúde Suplementar (ANS) disponibiliza informações sobre planos de saúde, beneficiários, operadoras e outros aspectos da saúde suplementar no Brasil.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados de beneficiários de planos de saúde</li>
            <li>Informações sobre operadoras de planos de saúde</li>
            <li>Dados de ressarcimento ao SUS</li>
            <li>Indicadores do setor de saúde suplementar</li>
            <li>Informações sobre coberturas e procedimentos</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o portal e explore os conjuntos de dados disponíveis</li>
            <li>Use a função de busca para encontrar dados específicos</li>
            <li>Consulte a documentação para entender os metadados</li>
            <li>Baixe os dados em formatos abertos (CSV, JSON, XML)</li>
          </ol>
          <a href="https://dados.ans.gov.br/" target="_blank" rel="noopener noreferrer">Acessar Portal da ANS</a>
        </article>

        <article>
          <h3>OpenDataSUS</h3>
          <h4>COVID-19</h4>
          <p>O OpenDataSUS é uma plataforma de dados abertos do Ministério da Saúde que disponibiliza informações relacionadas à COVID-19 e outros dados de saúde pública.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Registros de casos e óbitos por COVID-19</li>
            <li>Dados de vacinação contra COVID-19</li>
            <li>Informações sobre a Síndrome Respiratória Aguda Grave (SRAG)</li>
            <li>Dados de outros agravos e doenças</li>
            <li>Microdados de sistemas de informação em saúde</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o OpenDataSUS e navegue pelos repositórios</li>
            <li>Escolha o conjunto de dados de interesse</li>
            <li>Consulte a documentação para entender a estrutura dos dados</li>
            <li>Faça o download dos arquivos disponíveis</li>
          </ol>
          <a href="https://opendatasus.saude.gov.br/" target="_blank" rel="noopener noreferrer">Acessar OpenDataSUS</a>
        </article>
      </section>

      {/* Section: Educação */}
      <section>
        <h2>Educação</h2>
        <article>
          <h3>INEP - Dados Abertos</h3>
          <h4>Educação</h4>
          <p>O Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP) disponibiliza dados sobre todos os níveis educacionais do Brasil, desde a educação básica até o ensino superior.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Microdados do Censo Escolar da Educação Básica</li>
            <li>Microdados do Censo da Educação Superior</li>
            <li>Resultados do Enem, Saeb, Ideb e outros exames</li>
            <li>Indicadores Educacionais</li>
            <li>Dados sobre escolas, professores e alunos</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o portal de dados abertos do INEP</li>
            <li>Navegue pelos conjuntos de dados disponíveis</li>
            <li>Faça download dos microdados ou das sinopses estatísticas</li>
            <li>Consulte os dicionários de variáveis para interpretar os dados</li>
          </ol>
          <a href="https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos" target="_blank" rel="noopener noreferrer">Acessar INEP Dados Abertos</a>
        </article>

        <article>
          <h3>FNDE - Dados Abertos</h3>
          <h4>Financiamento</h4>
          <p>O Fundo Nacional de Desenvolvimento da Educação (FNDE) disponibiliza dados sobre os programas de financiamento da educação pública brasileira.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados do FUNDEB (Fundo de Manutenção da Educação Básica)</li>
            <li>Informações sobre o Programa Nacional de Alimentação Escolar (PNAE)</li>
            <li>Dados do Programa Nacional do Livro Didático (PNLD)</li>
            <li>Informações sobre o Programa Dinheiro Direto na Escola (PDDE)</li>
            <li>Dados sobre o transporte escolar e outras transferências</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o portal de dados abertos do FNDE</li>
            <li>Navegue pelos conjuntos de dados disponíveis</li>
            <li>Faça download dos dados em formato aberto</li>
            <li>Consulte os sistemas específicos para cada programa</li>
          </ol>
          <a href="https://www.gov.br/fnde/pt-br/acesso-a-informacao/dados-abertos" target="_blank" rel="noopener noreferrer">Acessar FNDE Dados Abertos</a>
        </article>
      </section>

      {/* Section: Infraestrutura e Saneamento */}
      <section>
        <h2>Infraestrutura e Saneamento</h2>
        <article>
          <h3>SNIS - Sistema Nacional de Informações sobre Saneamento</h3>
          <h4>Saneamento</h4>
          <p>O SNIS é o maior e mais importante sistema de informações do setor saneamento no Brasil, reunindo dados sobre água, esgotos, resíduos sólidos e águas pluviais.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados sobre abastecimento de água</li>
            <li>Informações sobre coleta e tratamento de esgoto</li>
            <li>Dados sobre manejo de resíduos sólidos</li>
            <li>Informações sobre drenagem e manejo de águas pluviais</li>
            <li>Indicadores operacionais, econômicos e de qualidade</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse a Série Histórica do SNIS</li>
            <li>Escolha o componente de interesse (Água e Esgotos, Resíduos Sólidos ou Águas Pluviais)</li>
            <li>Selecione os indicadores, períodos e localidades desejados</li>
            <li>Gere consultas e exporte os dados em diversos formatos</li>
          </ol>
          <a href="http://www.snis.gov.br/" target="_blank" rel="noopener noreferrer">Acessar SNIS</a>
        </article>

        <article>
          <h3>ANTT - Dados Abertos</h3>
          <h4>Transporte</h4>
          <p>A Agência Nacional de Transportes Terrestres (ANTT) disponibiliza dados sobre o transporte terrestre no Brasil, incluindo rodovias, ferrovias e transporte de passageiros.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados sobre transporte rodoviário de cargas e passageiros</li>
            <li>Informações sobre concessões rodoviárias</li>
            <li>Dados sobre o transporte ferroviário</li>
            <li>Estatísticas de acidentes e fiscalização</li>
            <li>Informações sobre tarifas e fluxos de transporte</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o portal de dados abertos da ANTT</li>
            <li>Navegue pelos conjuntos de dados disponíveis</li>
            <li>Faça download dos dados em formatos abertos</li>
            <li>Consulte a documentação para entender a estrutura dos dados</li>
          </ol>
          <a href="https://dados.antt.gov.br/" target="_blank" rel="noopener noreferrer">Acessar ANTT Dados Abertos</a>
        </article>
      </section>

      {/* Section: Meio Ambiente */}
      <section>
        <h2>Meio Ambiente</h2>
        <article>
          <h3>IBAMA - Dados Abertos</h3>
          <h4>Ambiental</h4>
          <p>O Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis (IBAMA) disponibiliza dados sobre licenciamento ambiental, fiscalização, qualidade ambiental e biodiversidade.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados sobre autos de infração e embargos ambientais</li>
            <li>Informações sobre licenciamento ambiental</li>
            <li>Dados sobre acidentes ambientais</li>
            <li>Informações sobre a fauna e flora brasileiras</li>
            <li>Dados sobre queimadas e desmatamento</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o portal de dados abertos do IBAMA</li>
            <li>Navegue pelos conjuntos de dados disponíveis</li>
            <li>Faça download dos dados em formatos abertos</li>
            <li>Consulte os sistemas específicos como o SISCOM para dados geoespaciais</li>
          </ol>
          <a href="https://dados.ibama.gov.br/" target="_blank" rel="noopener noreferrer">Acessar IBAMA Dados Abertos</a>
        </article>

        <article>
          <h3>ANA - Dados Abertos</h3>
          <h4>Recursos Hídricos</h4>
          <p>A Agência Nacional de Águas e Saneamento Básico (ANA) disponibiliza dados sobre recursos hídricos, bacias hidrográficas, qualidade da água e eventos hidrológicos.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados hidrológicos (vazão, precipitação, nível d'água)</li>
            <li>Informações sobre qualidade da água</li>
            <li>Dados sobre outorgas e usos da água</li>
            <li>Informações sobre bacias hidrográficas</li>
            <li>Dados sobre reservatórios e sistemas hídricos</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o portal de dados abertos da ANA</li>
            <li>Navegue pelos conjuntos de dados disponíveis</li>
            <li>Faça download dos dados em formatos abertos</li>
            <li>Consulte o Portal HidroWeb para dados hidrometeorológicos</li>
          </ol>
          <a href="https://dadosabertos.ana.gov.br/" target="_blank" rel="noopener noreferrer">Acessar ANA Dados Abertos</a>
        </article>
      </section>

      {/* Section: Segurança e Justiça */}
      <section>
        <h2>Segurança e Justiça</h2>
        <article>
          <h3>Atlas da Violência</h3>
          <h4>Violência</h4>
          <p>O Atlas da Violência é uma plataforma desenvolvida pelo IPEA e pelo Fórum Brasileiro de Segurança Pública que reúne dados sobre homicídios e outros tipos de violência no Brasil.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados sobre homicídios por município, estado e região</li>
            <li>Informações sobre mortes violentas por causa indeterminada</li>
            <li>Dados sobre violência por raça e gênero</li>
            <li>Estatísticas sobre juventude e violência</li>
            <li>Dados sobre óbitos por armas de fogo</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o Atlas da Violência</li>
            <li>Navegue pelos diferentes temas disponíveis</li>
            <li>Selecione os filtros de interesse (estados, municípios, período)</li>
            <li>Visualize os dados em mapas, gráficos ou tabelas</li>
          </ol>
          <a href="https://www.ipea.gov.br/atlasviolencia/" target="_blank" rel="noopener noreferrer">Acessar Atlas da Violência</a>
        </article>

        <article>
          <h3>CNJ - Dados Abertos</h3>
          <h4>Judiciário</h4>
          <p>O Conselho Nacional de Justiça (CNJ) disponibiliza dados sobre o funcionamento do Poder Judiciário brasileiro, processos judiciais e outros indicadores da Justiça.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Estatísticas processuais por tribunal e vara</li>
            <li>Dados sobre produtividade de magistrados e servidores</li>
            <li>Informações sobre execução fiscal e tempos de tramitação</li>
            <li>Dados sobre processos em diferentes áreas do Direito</li>
            <li>Estatísticas do Sistema Carcerário e Sistema Prisional</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o portal de dados abertos do CNJ</li>
            <li>Consulte o painel Justiça em Números</li>
            <li>Explore o Datajud e outros sistemas específicos</li>
            <li>Faça download dos relatórios e bases de dados disponíveis</li>
          </ol>
          <a href="https://dadosabertos.cnj.jus.br/" target="_blank" rel="noopener noreferrer">Acessar CNJ Dados Abertos</a>
        </article>
      </section>

      {/* Section: Agricultura e Pecuária */}
      <section>
        <h2>Agricultura e Pecuária</h2>
        <article>
          <h3>EMBRAPA - Bases de Dados da Pesquisa Agropecuária</h3>
          <h4>Agrícola</h4>
          <p>A Empresa Brasileira de Pesquisa Agropecuária (EMBRAPA) mantém a Base de Dados da Pesquisa Agropecuária (BDPA), que reúne informações técnico-científicas sobre agricultura, pecuária e áreas correlatas.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados sobre produção agrícola e pecuária</li>
            <li>Informações sobre tecnologias e sistemas de produção</li>
            <li>Dados sobre solos, clima e recursos naturais</li>
            <li>Resultados de pesquisas científicas agropecuárias</li>
            <li>Informações georreferenciadas sobre o agronegócio</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse a BDPA da EMBRAPA</li>
            <li>Use a busca para encontrar documentos e dados específicos</li>
            <li>Consulte os sistemas temáticos como o Agritempo e o SOMABRASIL</li>
            <li>Baixe publicações e datasets disponíveis</li>
          </ol>
          <a href="https://www.embrapa.br/bdpa" target="_blank" rel="noopener noreferrer">Acessar BDPA EMBRAPA</a>
        </article>

        <article>
          <h3>IBGE - Censo Agropecuário</h3>
          <h4>Agropecuária</h4>
          <p>O Censo Agropecuário do IBGE é a principal fonte de dados sobre a estrutura e a produção da agricultura e da pecuária brasileiras, oferecendo um panorama detalhado do setor.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados sobre estabelecimentos agropecuários</li>
            <li>Informações sobre produção vegetal e animal</li>
            <li>Características dos produtores e das propriedades</li>
            <li>Dados sobre uso da terra, maquinário e insumos</li>
            <li>Informações sobre agricultura familiar e não familiar</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o SIDRA e selecione as tabelas do Censo Agropecuário</li>
            <li>Defina as variáveis, períodos e localidades de interesse</li>
            <li>Gere tabelas personalizadas para análise</li>
            <li>Exporte os dados em diversos formatos</li>
          </ol>
          <a href="https://sidra.ibge.gov.br/pesquisa/censo-agropecuario/censo-agropecuario-2017" target="_blank" rel="noopener noreferrer">Acessar Censo Agropecuário</a>
        </article>
      </section>

      {/* Section: Energia */}
      <section>
        <h2>Energia</h2>
        <article>
          <h3>ANEEL - Dados Abertos</h3>
          <h4>Energia Elétrica</h4>
          <p>A Agência Nacional de Energia Elétrica (ANEEL) disponibiliza dados sobre o setor elétrico brasileiro, incluindo geração, transmissão, distribuição e comercialização de energia.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados sobre usinas e geração de energia</li>
            <li>Informações sobre linhas de transmissão e subestações</li>
            <li>Dados sobre tarifas e consumo de energia</li>
            <li>Informações sobre concessões e contratos</li>
            <li>Dados sobre qualidade do serviço e fiscalização</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o portal de dados abertos da ANEEL</li>
            <li>Navegue pelos conjuntos de dados disponíveis</li>
            <li>Faça download dos dados em formatos abertos</li>
            <li>Consulte o SIGA (Sistema de Informações de Geração da ANEEL) para dados específicos</li>
          </ol>
          <a href="https://dadosabertos.aneel.gov.br/" target="_blank" rel="noopener noreferrer">Acessar ANEEL Dados Abertos</a>
        </article>

        <article>
          <h3>EPE - Publicações e Dados Abertos</h3>
          <h4>Planejamento</h4>
          <p>A Empresa de Pesquisa Energética (EPE) disponibiliza dados e estudos sobre o planejamento energético brasileiro, abrangendo diversos setores como petróleo, gás natural, biocombustíveis e energia elétrica.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados do Balanço Energético Nacional (BEN)</li>
            <li>Informações sobre demanda e oferta de energia</li>
            <li>Estatísticas sobre consumo de energia por setor</li>
            <li>Dados sobre preços e custos de energia</li>
            <li>Informações sobre emissões de gases de efeito estufa</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse a seção de publicações e dados abertos da EPE</li>
            <li>Navegue pelos estudos e dados disponíveis</li>
            <li>Consulte o BEN para estatísticas energéticas detalhadas</li>
            <li>Faça download dos relatórios e planilhas em diferentes formatos</li>
          </ol>
          <a href="https://www.epe.gov.br/pt/publicacoes-dados-abertos" target="_blank" rel="noopener noreferrer">Acessar EPE Publicações</a>
        </article>

        <article>
          <h3>ONS - Dados Abertos</h3>
          <h4>Operação</h4>
          <p>O Operador Nacional do Sistema Elétrico (ONS) disponibiliza dados sobre a operação do sistema elétrico brasileiro, incluindo geração, carga, intercâmbios e reservatórios.</p>
          <h5>Informações disponíveis:</h5>
          <ul>
            <li>Dados de geração de energia por fonte</li>
            <li>Informações sobre carga de energia do sistema</li>
            <li>Dados de reservatórios e vazões</li>
            <li>Informações sobre intercâmbios de energia entre subsistemas</li>
            <li>Dados históricos e em tempo real da operação</li>
          </ul>
          <h5>Como utilizar:</h5>
          <ol>
            <li>Acesse o portal de dados abertos do ONS</li>
            <li>Navegue pelos conjuntos de dados disponíveis</li>
            <li>Use as APIs disponíveis para acesso programático</li>
            <li>Faça download dos dados em formatos como CSV e JSON</li>
          </ol>
          <a href="https://dados.ons.org.br/" target="_blank" rel="noopener noreferrer">Acessar ONS Dados Abertos</a>
        </article>
      </section>

      <footer>
        <p>Última atualização: Abril de 2025</p>
      </footer>
    </div>
  );
};

export default DataSourceInfo;
