import React from 'react';
import '../styles/DataSourceInfo.css'; // We will update this CSS file next

const DataSourceInfo = () => {
  // Helper function to create list items
  const renderList = (items) => items.map((item, index) => <li key={index}>{item}</li>);

  // Data source definitions (extracted and structured from HTML example)
  const dataSources = {
    geral: [
      {
        id: "dados-abertos",
        title: "Portal Brasileiro de Dados Abertos",
        type: "Principal",
        typeClass: "bg-blue-100 text-blue-800",
        description: "O Portal Brasileiro de Dados Abertos é o portal central que reúne dados públicos de diversas instituições governamentais brasileiras. É o ponto de partida para explorar a maioria das bases de dados disponíveis.",
        info: [
          "Catálogo de conjuntos de dados de diversos órgãos",
          "Dados estatísticos, geográficos, financeiros e orçamentários",
          "Informações sobre programas e políticas públicas",
          "Dados de todos os setores da administração pública"
        ],
        usage: [
          "Acesse o portal e use a barra de pesquisa para encontrar conjuntos de dados",
          "Filtre por organizações, temas ou formatos de dados",
          "Baixe os dados em formatos como CSV, JSON, XML",
          "Leia a documentação específica de cada conjunto de dados"
        ],
        link: "https://dados.gov.br/"
      },
      {
        id: "sidra",
        title: "IBGE - SIDRA (Sistema IBGE de Recuperação Automática)",
        type: "Estatísticas",
        typeClass: "bg-green-100 text-green-800",
        description: "O SIDRA é o principal sistema de dados estatísticos do IBGE, oferecendo acesso a tabelas de dados de diversas pesquisas e censos realizados pelo instituto.",
        info: [
          "Dados demográficos (Censo Demográfico, PNAD)",
          "Indicadores econômicos (PIB, inflação, emprego)",
          "Dados agropecuários (Censo Agropecuário)",
          "Informações geográficas e cartográficas",
          "Estatísticas sociais (educação, saúde, trabalho)"
        ],
        usage: [
          "Acesse o SIDRA e navegue pelas pesquisas disponíveis",
          "Selecione variáveis, períodos e localidades de interesse",
          "Gere tabelas personalizadas para análise",
          "Exporte os dados em formatos como XLS, CSV ou HTML"
        ],
        link: "https://sidra.ibge.gov.br/"
      },
      {
        id: "ipardes",
        title: "IPARDES - BDEweb (Base de Dados do Estado)",
        type: "Regional",
        typeClass: "bg-purple-100 text-purple-800",
        description: "O BDEweb do Instituto Paranaense de Desenvolvimento Econômico e Social (IPARDES) é um sistema de informações estatísticas com mais de 15 milhões de dados classificados por grandes temas e assuntos, focado no estado do Paraná.",
        info: [
          "Produto Interno Bruto (PIB) municipal e estadual",
          "Índice de Desenvolvimento Humano (IDH)",
          "Índice Ipardes de Desempenho Municipal (IPDM)",
          "Indicadores sociais, econômicos e demográficos",
          "Dados sobre municípios do Paraná"
        ],
        usage: [
          "Acesse o BDEweb e selecione o tipo de consulta (variáveis ou localidades)",
          "Escolha os temas, subtemas e variáveis de interesse",
          "Selecione o período e as localidades para análise",
          "Exporte os dados em formatos como XLS ou PDF"
        ],
        link: "https://www.ipardes.pr.gov.br/Pagina/Base-de-Dados-do-Estado-BDEweb" // Updated link from HTML
      },
      {
        id: "base-dos-dados",
        title: "Base dos Dados",
        type: "Geral",
        typeClass: "bg-yellow-100 text-yellow-800",
        description: "A Base dos Dados é uma plataforma que centraliza e padroniza dados públicos brasileiros, tornando-os mais acessíveis e utilizáveis. Embora não seja governamental, reúne dados de fontes oficiais de forma organizada.",
        info: [
          "Dados socioeconômicos de diversas fontes governamentais",
          "Informações sobre eleições, educação, saúde e economia",
          "Dados tratados e padronizados para análise",
          "Bases de dados integradas de diferentes órgãos"
        ],
        usage: [
          "Acesse a plataforma e explore os conjuntos de dados disponíveis",
          "Utilize os filtros para encontrar dados por tema ou fonte",
          "Faça o download direto ou use a API via Python ou R",
          "Consulte a documentação para entender a estrutura dos dados"
        ],
        link: "https://basedosdados.org/"
      }
    ],
    economia: [
      {
        id: "ipeadata",
        title: "IPEADATA",
        type: "Economia",
        typeClass: "bg-green-100 text-green-800",
        description: "O IPEADATA é uma base de dados macroeconômicos, financeiros e regionais do Brasil mantida pelo Instituto de Pesquisa Econômica Aplicada (IPEA).",
        info: [
          "Dados macroeconômicos (inflação, PIB, câmbio, juros)",
          "Séries históricas financeiras e econômicas",
          "Indicadores sociais e regionais",
          "Dados demográficos e geográficos",
          "Informações sobre mercado de trabalho"
        ],
        usage: [
          "Acesse o IPEADATA e escolha entre as bases macro, regional ou social",
          "Use a busca para encontrar séries específicas",
          "Visualize gráficos ou tabelas das séries temporais",
          "Exporte os dados em formatos como XLS, CSV ou HTML"
        ],
        link: "http://www.ipeadata.gov.br/"
      },
      {
        id: "portal-transparencia",
        title: "Portal da Transparência",
        type: "Orçamento",
        typeClass: "bg-yellow-100 text-yellow-800",
        description: "O Portal da Transparência do Governo Federal permite o acompanhamento da execução orçamentária e financeira do governo, oferecendo informações sobre receitas, despesas e transferências de recursos.",
        info: [
          "Despesas e receitas do governo federal",
          "Transferências de recursos para estados e municípios",
          "Dados sobre programas sociais e beneficiários",
          "Informações sobre servidores públicos",
          "Contratos, convênios e licitações"
        ],
        usage: [
          "Acesse o portal e navegue pelos menus temáticos",
          "Use os filtros para refinar as consultas por órgão, período e tipo",
          "Explore os dados através dos painéis interativos",
          "Faça download dos dados em formatos abertos (CSV, JSON)"
        ],
        link: "https://portaldatransparencia.gov.br/"
      },
      {
        id: "siconfi",
        title: "SICONFI - Sistema de Informações Contábeis e Fiscais",
        type: "Finanças",
        typeClass: "bg-orange-100 text-orange-800",
        description: "O SICONFI é um sistema do Tesouro Nacional que coleta, armazena e disponibiliza dados contábeis e fiscais de estados, municípios e do Distrito Federal.",
        info: [
          "Relatórios fiscais de estados e municípios",
          "Balanços orçamentários, financeiros e patrimoniais",
          "Demonstrações contábeis de entes públicos",
          "Indicadores fiscais e financeiros",
          "Matriz de saldos contábeis"
        ],
        usage: [
          "Acesse o SICONFI e navegue pelas opções de consulta",
          "Selecione o tipo de relatório (DCA, RGF, RREO)",
          "Escolha o ente federativo, o período e os dados desejados",
          "Visualize ou exporte os dados em formatos como XLS ou PDF"
        ],
        link: "https://siconfi.tesouro.gov.br/"
      },
      {
        id: "bcb-estatisticas",
        title: "Banco Central - Estatísticas",
        type: "Financeiro",
        typeClass: "bg-blue-100 text-blue-800",
        description: "O portal de estatísticas do Banco Central do Brasil disponibiliza dados sobre o sistema financeiro, câmbio, crédito, balanço de pagamentos e outros indicadores econômicos.",
        info: [
          "Séries temporais de indicadores econômicos",
          "Taxas de juros e de câmbio",
          "Dados sobre crédito e mercado financeiro",
          "Estatísticas monetárias e de balanço de pagamentos",
          "Indicadores de inflação e atividade econômica"
        ],
        usage: [
          "Acesse o Sistema Gerenciador de Séries Temporais (SGS)",
          "Pesquise por código ou nome da série de interesse",
          "Defina o período de consulta e visualize os dados",
          "Exporte os dados em diversos formatos (CSV, XLS, JSON)"
        ],
        link: "https://www.bcb.gov.br/estatisticas"
      },
      {
        id: "comex-stat",
        title: "Comex Stat - Estatísticas de Comércio Exterior",
        type: "Comércio",
        typeClass: "bg-indigo-100 text-indigo-800",
        description: "O Comex Stat é o sistema oficial para consulta e extração de dados do comércio exterior brasileiro, desenvolvido pelo Ministério do Desenvolvimento, Indústria, Comércio e Serviços (MDIC).",
        info: [
          "Dados de exportações e importações brasileiras",
          "Balança comercial por período, produto e país",
          "Estatísticas por Unidade da Federação",
          "Informações sobre produtos por Nomenclatura Comum do Mercosul (NCM)",
          "Séries históricas do comércio exterior"
        ],
        usage: [
          "Acesse o Comex Stat e escolha entre exportação ou importação",
          "Defina os filtros (período, produto, país, UF)",
          "Selecione as variáveis para análise",
          "Visualize os resultados e exporte em CSV, XLS ou PDF"
        ],
        link: "https://comexstat.mdic.gov.br/" // Updated link from HTML
      }
    ],
    emprego: [
      {
        id: "caged",
        title: "CAGED - Cadastro Geral de Empregados e Desempregados",
        type: "Emprego",
        typeClass: "bg-blue-100 text-blue-800",
        description: "O CAGED é um registro administrativo que monitora a evolução do mercado de trabalho formal brasileiro, registrando mensalmente as admissões e demissões de empregados sob o regime da CLT. Desde 2020, o Novo CAGED passou a utilizar dados do eSocial e outros sistemas.",
        info: [
          "Admissões e desligamentos por setor econômico",
          "Saldo de empregos por região, estado e município",
          "Dados por gênero, faixa etária e escolaridade",
          "Estatísticas sobre salários e ocupações",
          "Séries históricas do mercado de trabalho formal"
        ],
        usage: [
          "Acesse o painel do Novo CAGED no site do Ministério do Trabalho",
          "Filtre por período, região, setor econômico ou outras variáveis",
          "Visualize gráficos e tabelas com os resultados da consulta",
          "Faça download dos microdados para análises mais detalhadas"
        ],
        link: "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/novo-caged"
      },
      {
        id: "rais",
        title: "RAIS - Relação Anual de Informações Sociais",
        type: "Trabalho",
        typeClass: "bg-green-100 text-green-800",
        description: "A RAIS é um registro administrativo anual que fornece informações sobre o mercado de trabalho formal brasileiro, abrangendo todos os tipos de vínculos empregatícios: estatutários, celetistas, temporários e avulsos.",
        info: [
          "Informações completas sobre todos os vínculos empregatícios formais",
          "Dados sobre estabelecimentos empregadores",
          "Estatísticas detalhadas por setor, ocupação, escolaridade e remuneração",
          "Informações sobre rotatividade e tempo de emprego",
          "Séries históricas anuais do mercado de trabalho"
        ],
        usage: [
          "Acesse a plataforma RAIS no site do Ministério do Trabalho",
          "Selecione o ano-base e as variáveis de interesse",
          "Gere tabelas personalizadas com os dados de vínculos e estabelecimentos",
          "Faça download dos microdados para análises estatísticas mais avançadas"
        ],
        link: "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet/o-que-e-rais"
      },
      {
        id: "pdet",
        title: "PDET - Programa de Disseminação das Estatísticas do Trabalho",
        type: "Estatísticas",
        typeClass: "bg-yellow-100 text-yellow-800",
        description: "O PDET é um programa do Ministério do Trabalho e Emprego que visa divulgar informações oriundas da RAIS e do CAGED, disponibilizando ferramentas para acesso e análise desses dados.",
        info: [
          "Microdados não identificados da RAIS e do CAGED",
          "Séries históricas de emprego formal",
          "Tabelas predefinidas com estatísticas do mercado de trabalho",
          "Informações sobre perfil de empresas e trabalhadores",
          "Dados georreferenciados do mercado de trabalho"
        ],
        usage: [
          "Acesse o portal do PDET",
          "Escolha entre as ferramentas disponíveis (tabulador, base estatística, microdados)",
          "Selecione as variáveis e filtros desejados",
          "Visualize ou faça download dos resultados em diferentes formatos"
        ],
        link: "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho"
      },
      {
        id: "proger",
        title: "PROGER - Programa de Geração de Emprego e Renda",
        type: "Financiamento",
        typeClass: "bg-purple-100 text-purple-800",
        description: "O PROGER é um programa que disponibiliza linhas de crédito com recursos do Fundo de Amparo ao Trabalhador (FAT) para financiar empreendimentos que visem a geração de emprego e renda.",
        info: [
          "Dados sobre linhas de crédito disponíveis",
          "Informações sobre recursos aplicados por setor e região",
          "Estatísticas de empregos gerados pelos financiamentos",
          "Documentos e relatórios de avaliação do programa",
          "Histórico de contratações e beneficiários"
        ],
        usage: [
          "Acesse o portal do PROGER no site do Ministério do Trabalho",
          "Consulte os relatórios estatísticos disponíveis",
          "Acesse informações sobre as linhas de crédito e condições",
          "Consulte os agentes financeiros e requisitos para solicitação"
        ],
        link: "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/empreendedorismo/proger"
      }
    ],
    saude: [
      {
        id: "datasus",
        title: "DATASUS - Informações de Saúde (TABNET)",
        type: "Saúde",
        typeClass: "bg-red-100 text-red-800",
        description: "O DATASUS é o departamento de informática do Sistema Único de Saúde que disponibiliza informações sobre saúde no Brasil. O TABNET é sua principal ferramenta para tabulação de dados.",
        info: [
          "Estatísticas vitais (nascimentos, óbitos, mortalidade)",
          "Epidemiologia e morbidade (doenças, agravos)",
          "Rede assistencial e produção de serviços de saúde",
          "Indicadores de saúde",
          "Informações demográficas e socioeconômicas"
        ],
        usage: [
          "Acesse o TABNET e escolha a base de dados de interesse",
          "Selecione as variáveis de linha, coluna e conteúdo",
          "Defina os filtros e períodos desejados",
          "Execute a tabulação e exporte os dados (CSV, XLS)"
        ],
        link: "https://datasus.saude.gov.br/informacoes-de-saude-tabnet/" // Updated link from HTML
      },
      {
        id: "ans-dados",
        title: "Portal de Dados Abertos da ANS",
        type: "Saúde Suplementar",
        typeClass: "bg-pink-100 text-pink-800",
        description: "O Portal de Dados Abertos da Agência Nacional de Saúde Suplementar (ANS) disponibiliza informações sobre planos de saúde, beneficiários, operadoras e outros aspectos da saúde suplementar no Brasil.",
        info: [
          "Dados de beneficiários de planos de saúde",
          "Informações sobre operadoras de planos de saúde",
          "Dados de ressarcimento ao SUS",
          "Indicadores do setor de saúde suplementar",
          "Informações sobre coberturas e procedimentos"
        ],
        usage: [
          "Acesse o portal e explore os conjuntos de dados disponíveis",
          "Use a função de busca para encontrar dados específicos",
          "Consulte a documentação para entender os metadados",
          "Baixe os dados em formatos abertos (CSV, JSON, XML)"
        ],
        link: "https://dadosabertos.ans.gov.br/" // Updated link from HTML
      },
      {
        id: "opendatasus",
        title: "OpenDataSUS",
        type: "COVID-19",
        typeClass: "bg-green-100 text-green-800",
        description: "O OpenDataSUS é uma plataforma de dados abertos do Ministério da Saúde que disponibiliza informações relacionadas à COVID-19 e outros dados de saúde pública.",
        info: [
          "Registros de casos e óbitos por COVID-19",
          "Dados de vacinação contra COVID-19",
          "Informações sobre a Síndrome Respiratória Aguda Grave (SRAG)",
          "Dados de outros agravos e doenças",
          "Microdados de sistemas de informação em saúde"
        ],
        usage: [
          "Acesse o OpenDataSUS e navegue pelos repositórios",
          "Escolha o conjunto de dados de interesse",
          "Consulte a documentação para entender a estrutura dos dados",
          "Faça o download dos arquivos disponíveis"
        ],
        link: "https://opendatasus.saude.gov.br/"
      }
    ],
    educacao: [
      {
        id: "inep-dados",
        title: "INEP - Dados Abertos",
        type: "Educação",
        typeClass: "bg-yellow-100 text-yellow-800",
        description: "O Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP) disponibiliza dados sobre todos os níveis educacionais do Brasil, desde a educação básica até o ensino superior.",
        info: [
          "Microdados do Censo Escolar da Educação Básica",
          "Microdados do Censo da Educação Superior",
          "Resultados do Enem, Saeb, Ideb e outros exames",
          "Indicadores Educacionais",
          "Dados sobre escolas, professores e alunos"
        ],
        usage: [
          "Acesse o portal de dados abertos do INEP",
          "Navegue pelos conjuntos de dados disponíveis",
          "Faça download dos microdados ou das sinopses estatísticas",
          "Consulte os dicionários de variáveis para interpretar os dados"
        ],
        link: "https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos"
      },
      {
        id: "fnde-dados",
        title: "FNDE - Dados Abertos",
        type: "Financiamento",
        typeClass: "bg-green-100 text-green-800",
        description: "O Fundo Nacional de Desenvolvimento da Educação (FNDE) disponibiliza dados sobre os programas de financiamento da educação pública brasileira.",
        info: [
          "Dados do FUNDEB (Fundo de Manutenção da Educação Básica)",
          "Informações sobre o Programa Nacional de Alimentação Escolar (PNAE)",
          "Dados do Programa Nacional do Livro Didático (PNLD)",
          "Informações sobre o Programa Dinheiro Direto na Escola (PDDE)",
          "Dados sobre o transporte escolar e outras transferências"
        ],
        usage: [
          "Acesse o portal de dados abertos do FNDE",
          "Navegue pelos conjuntos de dados disponíveis",
          "Faça download dos dados em formato aberto",
          "Consulte os sistemas específicos para cada programa"
        ],
        link: "https://www.gov.br/fnde/pt-br/acesso-a-informacao/dados-abertos"
      }
    ],
    infraestrutura: [
      {
        id: "snis",
        title: "SNIS - Sistema Nacional de Informações sobre Saneamento",
        type: "Saneamento",
        typeClass: "bg-blue-100 text-blue-800",
        description: "O SNIS é o maior e mais importante sistema de informações do setor saneamento no Brasil, reunindo dados sobre água, esgotos, resíduos sólidos e águas pluviais.",
        info: [
          "Dados sobre abastecimento de água",
          "Informações sobre coleta e tratamento de esgoto",
          "Dados sobre manejo de resíduos sólidos",
          "Informações sobre drenagem e manejo de águas pluviais",
          "Indicadores operacionais, econômicos e de qualidade"
        ],
        usage: [
          "Acesse a Série Histórica do SNIS",
          "Escolha o componente de interesse (Água e Esgotos, Resíduos Sólidos ou Águas Pluviais)",
          "Selecione os indicadores, períodos e localidades desejados",
          "Gere consultas e exporte os dados em diversos formatos"
        ],
        link: "https://app4.mdr.gov.br/serieHistorica/" // Updated link from HTML
      },
      {
        id: "antt-dados",
        title: "ANTT - Dados Abertos",
        type: "Transporte",
        typeClass: "bg-gray-100 text-gray-800",
        description: "A Agência Nacional de Transportes Terrestres (ANTT) disponibiliza dados sobre o transporte terrestre no Brasil, incluindo rodovias, ferrovias e transporte de passageiros.",
        info: [
          "Dados sobre transporte rodoviário de cargas e passageiros",
          "Informações sobre concessões rodoviárias",
          "Dados sobre o transporte ferroviário",
          "Estatísticas de acidentes e fiscalização",
          "Informações sobre tarifas e fluxos de transporte"
        ],
        usage: [
          "Acesse o portal de dados abertos da ANTT",
          "Navegue pelos conjuntos de dados disponíveis",
          "Faça download dos dados em formatos abertos",
          "Consulte a documentação para entender a estrutura dos dados"
        ],
        link: "https://dados.antt.gov.br/"
      }
    ],
    ambiental: [
      {
        id: "ibama-dados",
        title: "IBAMA - Dados Abertos",
        type: "Ambiental",
        typeClass: "bg-green-100 text-green-800",
        description: "O Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis (IBAMA) disponibiliza dados sobre licenciamento ambiental, fiscalização, qualidade ambiental e biodiversidade.",
        info: [
          "Dados sobre autos de infração e embargos ambientais",
          "Informações sobre licenciamento ambiental",
          "Dados sobre acidentes ambientais",
          "Informações sobre a fauna e flora brasileiras",
          "Dados sobre queimadas e desmatamento"
        ],
        usage: [
          "Acesse o portal de dados abertos do IBAMA",
          "Navegue pelos conjuntos de dados disponíveis",
          "Faça download dos dados em formatos abertos",
          "Consulte os sistemas específicos como o SISCOM para dados geoespaciais"
        ],
        link: "https://dadosabertos.ibama.gov.br/" // Updated link from HTML
      },
      {
        id: "ana-dados",
        title: "ANA - Dados Abertos",
        type: "Recursos Hídricos",
        typeClass: "bg-blue-100 text-blue-800",
        description: "A Agência Nacional de Águas e Saneamento Básico (ANA) disponibiliza dados sobre recursos hídricos, bacias hidrográficas, qualidade da água e eventos hidrológicos.",
        info: [
          "Dados hidrológicos (vazão, precipitação, nível d'água)",
          "Informações sobre qualidade da água",
          "Dados sobre outorgas e usos da água",
          "Informações sobre bacias hidrográficas",
          "Dados sobre reservatórios e sistemas hídricos"
        ],
        usage: [
          "Acesse o portal de dados abertos da ANA",
          "Navegue pelos conjuntos de dados disponíveis",
          "Faça download dos dados em formatos abertos",
          "Consulte o Portal HidroWeb para dados hidrometeorológicos"
        ],
        link: "https://dadosabertos.ana.gov.br/"
      }
    ],
    seguranca: [
      {
        id: "atlas-violencia",
        title: "Atlas da Violência",
        type: "Violência",
        typeClass: "bg-red-100 text-red-800",
        description: "O Atlas da Violência é uma plataforma desenvolvida pelo IPEA e pelo Fórum Brasileiro de Segurança Pública que reúne dados sobre homicídios e outros tipos de violência no Brasil.",
        info: [
          "Dados sobre homicídios por município, estado e região",
          "Informações sobre mortes violentas por causa indeterminada",
          "Dados sobre violência por raça e gênero",
          "Estatísticas sobre juventude e violência",
          "Dados sobre óbitos por armas de fogo"
        ],
        usage: [
          "Acesse o Atlas da Violência",
          "Navegue pelos diferentes temas disponíveis",
          "Selecione os filtros de interesse (estados, municípios, período)",
          "Visualize os dados em mapas, gráficos ou tabelas"
        ],
        link: "https://www.ipea.gov.br/atlasviolencia/"
      },
      {
        id: "cnj-dados",
        title: "CNJ - Dados Abertos",
        type: "Judiciário",
        typeClass: "bg-purple-100 text-purple-800",
        description: "O Conselho Nacional de Justiça (CNJ) disponibiliza dados sobre o funcionamento do Poder Judiciário brasileiro, processos judiciais e outros indicadores da Justiça.",
        info: [
          "Estatísticas processuais por tribunal e vara",
          "Dados sobre produtividade de magistrados e servidores",
          "Informações sobre execução fiscal e tempos de tramitação",
          "Dados sobre processos em diferentes áreas do Direito",
          "Estatísticas do Sistema Carcerário e Sistema Prisional"
        ],
        usage: [
          "Acesse o portal de dados abertos do CNJ",
          "Consulte o painel Justiça em Números",
          "Explore o Datajud e outros sistemas específicos",
          "Faça download dos relatórios e bases de dados disponíveis"
        ],
        link: "https://www.cnj.jus.br/transparencia-cnj/dados-abertos/" // Updated link from HTML
      }
    ],
    agricultura: [
      {
        id: "embrapa-bdpa",
        title: "EMBRAPA - Bases de Dados da Pesquisa Agropecuária",
        type: "Agrícola",
        typeClass: "bg-green-100 text-green-800",
        description: "A Empresa Brasileira de Pesquisa Agropecuária (EMBRAPA) mantém a Base de Dados da Pesquisa Agropecuária (BDPA), que reúne informações técnico-científicas sobre agricultura, pecuária e áreas correlatas.",
        info: [
          "Dados sobre produção agrícola e pecuária",
          "Informações sobre tecnologias e sistemas de produção",
          "Dados sobre solos, clima e recursos naturais",
          "Resultados de pesquisas científicas agropecuárias",
          "Informações georreferenciadas sobre o agronegócio"
        ],
        usage: [
          "Acesse a BDPA da EMBRAPA",
          "Use a busca para encontrar documentos e dados específicos",
          "Consulte os sistemas temáticos como o Agritempo e o SOMABRASIL",
          "Baixe publicações e datasets disponíveis"
        ],
        link: "https://www.bdpa.cnptia.embrapa.br/" // Updated link from HTML
      },
      {
        id: "censo-agro",
        title: "IBGE - Censo Agropecuário",
        type: "Agropecuária",
        typeClass: "bg-yellow-100 text-yellow-800",
        description: "O Censo Agropecuário do IBGE é a principal fonte de dados sobre a estrutura e a produção da agricultura e da pecuária brasileiras, oferecendo um panorama detalhado do setor.",
        info: [
          "Dados sobre estabelecimentos agropecuários",
          "Informações sobre produção vegetal e animal",
          "Características dos produtores e das propriedades",
          "Dados sobre uso da terra, maquinário e insumos",
          "Informações sobre agricultura familiar e não familiar"
        ],
        usage: [
          "Acesse o SIDRA e selecione as tabelas do Censo Agropecuário",
          "Defina as variáveis, períodos e localidades de interesse",
          "Gere tabelas personalizadas para análise",
          "Exporte os dados em diversos formatos"
        ],
        link: "https://sidra.ibge.gov.br/pesquisa/censo-agropecuario/censo-agropecuario-2017"
      }
    ],
    energia: [
      {
        id: "aneel-dados",
        title: "ANEEL - Dados Abertos",
        type: "Energia Elétrica",
        typeClass: "bg-yellow-100 text-yellow-800",
        description: "A Agência Nacional de Energia Elétrica (ANEEL) disponibiliza dados sobre o setor elétrico brasileiro, incluindo geração, transmissão, distribuição e comercialização de energia.",
        info: [
          "Dados sobre usinas e geração de energia",
          "Informações sobre linhas de transmissão e subestações",
          "Dados sobre tarifas e consumo de energia",
          "Informações sobre concessões e contratos",
          "Dados sobre qualidade do serviço e fiscalização"
        ],
        usage: [
          "Acesse o portal de dados abertos da ANEEL",
          "Navegue pelos conjuntos de dados disponíveis",
          "Faça download dos dados em formatos abertos",
          "Consulte o SIGA (Sistema de Informações de Geração da ANEEL) para dados específicos"
        ],
        link: "https://dadosabertos.aneel.gov.br/"
      },
      {
        id: "epe-dados",
        title: "EPE - Publicações e Dados Abertos",
        type: "Planejamento",
        typeClass: "bg-blue-100 text-blue-800",
        description: "A Empresa de Pesquisa Energética (EPE) disponibiliza dados e estudos sobre o planejamento energético brasileiro, abrangendo diversos setores como petróleo, gás natural, biocombustíveis e energia elétrica.",
        info: [
          "Dados do Balanço Energético Nacional (BEN)",
          "Informações sobre demanda e oferta de energia",
          "Estatísticas sobre consumo de energia por setor",
          "Dados sobre preços e custos de energia",
          "Informações sobre emissões de gases de efeito estufa"
        ],
        usage: [
          "Acesse a seção de publicações e dados abertos da EPE",
          "Navegue pelos estudos e dados disponíveis",
          "Consulte o BEN para estatísticas energéticas detalhadas",
          "Faça download dos relatórios e planilhas em diferentes formatos"
        ],
        link: "https://www.epe.gov.br/pt/publicacoes-dados-abertos/publicacoes" // Updated link from HTML
      },
      {
        id: "ons-dados",
        title: "ONS - Dados Abertos",
        type: "Operação",
        typeClass: "bg-purple-100 text-purple-800",
        description: "O Operador Nacional do Sistema Elétrico (ONS) disponibiliza dados sobre a operação do sistema elétrico brasileiro, incluindo geração, carga, intercâmbios e reservatórios.",
        info: [
          "Dados de geração de energia por fonte",
          "Informações sobre carga de energia do sistema",
          "Dados de reservatórios e vazões",
          "Informações sobre intercâmbios de energia entre subsistemas",
          "Dados históricos e em tempo real da operação"
        ],
        usage: [
          "Acesse o portal de dados abertos do ONS",
          "Navegue pelos conjuntos de dados disponíveis",
          "Use as APIs disponíveis para acesso programático",
          "Faça download dos dados em formatos como CSV e JSON"
        ],
        link: "https://dados.ons.org.br/"
      }
    ],
    pesquisasIbge: [
      {
        id: "pnad",
        title: "PNAD e PNAD Contínua",
        type: "Pesquisa",
        typeClass: "bg-blue-100 text-blue-800",
        description: "A Pesquisa Nacional por Amostra de Domicílios (PNAD) e sua versão contínua (PNAD-C) são pesquisas realizadas pelo IBGE para produzir informações sobre características demográficas e socioeconômicas da população brasileira.",
        info: [
          "Dados sobre mercado de trabalho e desemprego",
          "Informações sobre educação e distribuição de renda",
          "Estatísticas sobre habitação e acesso a serviços básicos",
          "Dados demográficos da população brasileira",
          "Séries históricas de indicadores socioeconômicos"
        ],
        usage: [
          "Acesse os microdados da PNAD no site do IBGE",
          "Use o SIDRA para tabelas agregadas da PNAD Contínua",
          "Baixe os microdados para análises estatísticas detalhadas",
          "Consulte a documentação e os dicionários de variáveis"
        ],
        link: "https://www.ibge.gov.br/estatisticas/sociais/trabalho/9171-pesquisa-nacional-por-amostra-de-domicilios-continua-mensal.html"
      },
      {
        id: "pof",
        title: "POF - Pesquisa de Orçamentos Familiares",
        type: "Consumo",
        typeClass: "bg-green-100 text-green-800",
        description: "A Pesquisa de Orçamentos Familiares (POF) é realizada pelo IBGE para investigar a composição dos gastos e do consumo das famílias brasileiras, além de outros aspectos das condições de vida da população.",
        info: [
          "Estrutura de gastos e consumo das famílias",
          "Dados sobre alimentação e segurança alimentar",
          "Informações sobre despesas com habitação, saúde e educação",
          "Avaliação subjetiva das condições de vida",
          "Dados para cálculo da cesta básica e índices de preços"
        ],
        usage: [
          "Acesse os resultados da POF no site do IBGE",
          "Consulte as tabelas e publicações disponíveis",
          "Baixe os microdados para análises específicas",
          "Use a documentação para entender a metodologia da pesquisa"
        ],
        link: "https://www.ibge.gov.br/estatisticas/sociais/saude/24786-pesquisa-de-orcamentos-familiares-2.html"
      },
      {
        id: "munic-estadic",
        title: "MUNIC e ESTADIC - Pesquisas de Informações Básicas",
        type: "Administração",
        typeClass: "bg-yellow-100 text-yellow-800",
        description: "A Pesquisa de Informações Básicas Municipais (MUNIC) e a Pesquisa de Informações Básicas Estaduais (ESTADIC) fornecem informações sobre a estrutura, dinâmica e funcionamento das instituições públicas municipais e estaduais.",
        info: [
          "Perfil dos municípios e estados brasileiros",
          "Dados sobre gestão pública local e estadual",
          "Informações sobre políticas setoriais implementadas",
          "Estrutura administrativa e legislação municipal/estadual",
          "Recursos humanos e institucionais das administrações"
        ],
        usage: [
          "Acesse as pesquisas MUNIC e ESTADIC no site do IBGE",
          "Consulte as tabelas e publicações por tema",
          "Baixe as bases de dados completas para análises específicas",
          "Use os suplementos temáticos para informações detalhadas"
        ],
        link: "https://www.ibge.gov.br/estatisticas/sociais/educacao/10586-pesquisa-de-informacoes-basicas-municipais.html"
      },
      {
        id: "pnsb",
        title: "PNSB - Pesquisa Nacional de Saneamento Básico",
        type: "Saneamento",
        typeClass: "bg-blue-100 text-blue-800",
        description: "A Pesquisa Nacional de Saneamento Básico (PNSB) investiga as condições do saneamento básico do país junto às prefeituras municipais e empresas contratadas para a prestação desses serviços.",
        info: [
          "Dados sobre abastecimento de água e esgotamento sanitário",
          "Informações sobre manejo de resíduos sólidos",
          "Dados sobre drenagem urbana e manejo de águas pluviais",
          "Características operacionais dos serviços de saneamento",
          "Tarifas, receitas e investimentos no setor"
        ],
        usage: [
          "Acesse a PNSB no site do IBGE",
          "Consulte as tabelas por tema e região",
          "Baixe os resultados em formato de planilha",
          "Use o Atlas de Saneamento para visualização geográfica"
        ],
        link: "https://www.ibge.gov.br/estatisticas/multidominio/meio-ambiente/9073-pesquisa-nacional-de-saneamento-basico.html"
      },
      {
        id: "cnefe",
        title: "CNEFE - Cadastro Nacional de Endereços para Fins Estatísticos",
        type: "Territorial",
        typeClass: "bg-purple-100 text-purple-800",
        description: "O CNEFE é um banco de dados com interface espacial implementado pelo IBGE para uso nas pesquisas domiciliares, contendo os endereços de todos os domicílios e estabelecimentos do país.",
        info: [
          "Endereços georreferenciados de domicílios e estabelecimentos",
          "Localização de equipamentos urbanos e rurais",
          "Informações sobre setores censitários",
          "Coordenadas geográficas de endereços",
          "Classificação de estabelecimentos por tipo"
        ],
        usage: [
          "Acesse o CNEFE através do site do IBGE",
          "Selecione a área geográfica de interesse",
          "Baixe os arquivos por Unidade da Federação",
          "Use em sistemas de informações geográficas (SIG)"
        ],
        link: "https://www.ibge.gov.br/estatisticas/downloads-estatisticas.html"
      }
    ],
    social: [
      {
        id: "cadunico",
        title: "Cadastro Único para Programas Sociais",
        type: "Social",
        typeClass: "bg-blue-100 text-blue-800",
        description: "O Cadastro Único é um instrumento de identificação e caracterização socioeconômica das famílias brasileiras de baixa renda, utilizado para seleção de beneficiários e integração de programas sociais.",
        info: [
          "Perfil socioeconômico das famílias cadastradas",
          "Dados sobre composição familiar e características dos domicílios",
          "Informações sobre escolaridade, trabalho e renda",
          "Estatísticas sobre acesso a serviços públicos",
          "Distribuição geográfica das famílias em vulnerabilidade"
        ],
        usage: [
          "Acesse o portal de dados abertos do Ministério do Desenvolvimento Social",
          "Utilize o CECAD para consultas agregadas e relatórios",
          "Solicite acesso aos dados identificados via procedimento formal",
          "Consulte relatórios e tabulações disponíveis publicamente"
        ],
        link: "https://dados.gov.br/dados/conjuntos-dados/pessoas-inscritas-no-cadastro-unico"
      },
      {
        id: "cecad",
        title: "CECAD - Consulta, Seleção e Extração de Informações do CadÚnico",
        type: "Consulta",
        typeClass: "bg-green-100 text-green-800",
        description: "O CECAD é uma ferramenta que permite conhecer as características socioeconômicas das famílias e pessoas incluídas no Cadastro Único, bem como realizar consultas e extrações de dados para análises específicas.",
        info: [
          "Tabulações por faixa de renda, escolaridade, grupos populacionais",
          "Consultas por município, região e estado",
          "Informações sobre famílias beneficiárias de programas sociais",
          "Dados sobre populações específicas (quilombolas, indígenas, etc.)",
          "Estatísticas sobre condições de habitação e acesso a serviços"
        ],
        usage: [
          "Acesse o CECAD com seu login e senha (necessita credenciamento)",
          "Selecione o tipo de consulta (Tabulador, Frequência, Extrato)",
          "Defina os filtros e parâmetros para a consulta",
          "Exporte os resultados em formato de tabela ou gráfico"
        ],
        link: "https://cecad.cidadania.gov.br/"
      },
      {
        id: "sagi",
        title: "SAGI - Secretaria de Avaliação e Gestão da Informação",
        type: "Monitoramento",
        typeClass: "bg-yellow-100 text-yellow-800",
        description: "A SAGI/SAGICAD é responsável pelo desenvolvimento de ferramentas informacionais e produção de dados para o monitoramento e avaliação de programas e políticas do Ministério do Desenvolvimento Social.",
        info: [
          "Indicadores de programas sociais e políticas públicas",
          "Painéis de monitoramento de programas como Bolsa Família",
          "Dados sobre equipamentos e serviços socioassistenciais",
          "Mapas temáticos e ferramentas de georreferenciamento",
          "Relatórios de pesquisas e avaliações de programas"
        ],
        usage: [
          "Acesse o portal da SAGI",
          "Navegue pelas ferramentas disponíveis (MI Social, MOPS, IDV, etc.)",
          "Selecione indicadores, regiões e períodos de interesse",
          "Exporte os dados ou visualizações geradas"
        ],
        link: "https://www.gov.br/mds/pt-br/orgaos/SAGICAD"
      },
      {
        id: "dataprev",
        title: "DATAPREV - Empresa de Tecnologia e Informações da Previdência",
        type: "Previdência",
        typeClass: "bg-red-100 text-red-800",
        description: "A DATAPREV é a empresa pública responsável pela gestão da base de dados sociais brasileira, principalmente a do Instituto Nacional do Seguro Social (INSS), processando o pagamento mensal de mais de 36 milhões de benefícios.",
        info: [
          "Dados sobre benefícios previdenciários e assistenciais",
          "Informações sobre segurados e contribuintes da Previdência",
          "Estatísticas sobre beneficiários do Bolsa Família e outros programas",
          "Dados do Cadastro Nacional de Informações Sociais (CNIS)",
          "Informações sobre recolhimentos e arrecadação previdenciária"
        ],
        usage: [
          "Acesse o portal de dados abertos da DATAPREV",
          "Consulte os Anuários Estatísticos da Previdência Social",
          "Utilize o portal Meu INSS para dados individuais (com autenticação)",
          "Acesse painéis e relatórios estatísticos disponíveis"
        ],
        link: "https://www.dataprev.gov.br/"
      }
    ],
    transparencia: [
      {
        id: "cgu",
        title: "CGU - Controladoria-Geral da União",
        type: "Transparência",
        typeClass: "bg-blue-100 text-blue-800",
        description: "A Controladoria-Geral da União (CGU) é o órgão de controle interno do Governo Federal responsável por atividades relacionadas à defesa do patrimônio público, transparência e combate à corrupção.",
        info: [
          "Dados sobre gastos públicos e transferências de recursos",
          "Informações sobre acordos de leniência e processos disciplinares",
          "Registros de empresas inidôneas e punidas",
          "Relatórios de auditorias e fiscalizações",
          "Dados sobre servidores públicos federais"
        ],
        usage: [
          "Acesse o portal de dados abertos da CGU",
          "Navegue pelos conjuntos de dados disponíveis",
          "Utilize ferramentas específicas como o Portal da Transparência",
          "Faça download dos dados em formatos abertos (CSV, JSON, XML)"
        ],
        link: "https://www.gov.br/cgu/pt-br"
      },
      {
        id: "falabr",
        title: "Fala.BR - Plataforma Integrada de Ouvidoria e Acesso à Informação",
        type: "Participação",
        typeClass: "bg-green-100 text-green-800",
        description: "O Fala.BR é uma plataforma que integra os canais de atendimento ao cidadão, permitindo o registro de manifestações de ouvidoria e pedidos de acesso à informação a órgãos e entidades do poder público.",
        info: [
          "Dados sobre manifestações de ouvidoria (denúncias, reclamações, etc.)",
          "Estatísticas de pedidos de acesso à informação",
          "Informações sobre tempo médio de resposta de órgãos públicos",
          "Consulta pública a pedidos e respostas de LAI",
          "Relatórios de transparência dos órgãos públicos"
        ],
        usage: [
          "Acesse a plataforma Fala.BR",
          "Registre manifestações ou pedidos de acesso à informação",
          "Consulte dados estatísticos disponíveis",
          "Acompanhe o andamento das manifestações registradas"
        ],
        link: "https://falabr.cgu.gov.br/"
      },
      {
        id: "tcu",
        title: "TCU - Tribunal de Contas da União",
        type: "Controle",
        typeClass: "bg-yellow-100 text-yellow-800",
        description: "O Tribunal de Contas da União (TCU) é o órgão de controle externo do governo federal que auxilia o Congresso Nacional na fiscalização contábil, financeira, orçamentária, operacional e patrimonial da União.",
        info: [
          "Dados sobre fiscalizações, auditorias e julgamentos de contas",
          "Informações sobre licitações e contratos públicos",
          "Acórdãos e jurisprudência do TCU",
          "Relatórios de gestão fiscal e execução orçamentária",
          "Dados sobre obras públicas e transferências governamentais"
        ],
        usage: [
          "Acesse o portal do TCU e navegue pelos sistemas disponíveis",
          "Utilize ferramentas como o e-TCU para consulta de processos",
          "Consulte a jurisprudência e acórdãos no sistema Pesquisa Jurisprudencial",
          "Acesse painéis e relatórios específicos disponibilizados"
        ],
        link: "https://portal.tcu.gov.br/"
      }
    ]
    // Note: Financeiro section from HTML example seems covered by Economia/BCB/SICONFI
  };

  const sections = [
    { id: "geral", title: "Portais de Dados Gerais", icon: "fas fa-database", color: "blue", data: dataSources.geral },
    { id: "economia", title: "Economia e Finanças", icon: "fas fa-chart-line", color: "green", data: dataSources.economia },
    { id: "emprego", title: "Emprego e Mercado de Trabalho", icon: "fas fa-briefcase", color: "blue", data: dataSources.emprego },
    { id: "saude", title: "Saúde", icon: "fas fa-heartbeat", color: "red", data: dataSources.saude },
    { id: "educacao", title: "Educação", icon: "fas fa-graduation-cap", color: "yellow", data: dataSources.educacao },
    { id: "infraestrutura", title: "Infraestrutura e Saneamento", icon: "fas fa-building", color: "gray", data: dataSources.infraestrutura },
    { id: "ambiental", title: "Meio Ambiente", icon: "fas fa-leaf", color: "green", data: dataSources.ambiental },
    { id: "seguranca", title: "Segurança e Justiça", icon: "fas fa-shield-alt", color: "red", data: dataSources.seguranca },
    { id: "agricultura", title: "Agricultura e Pecuária", icon: "fas fa-tractor", color: "yellow", data: dataSources.agricultura },
    { id: "energia", title: "Energia", icon: "fas fa-bolt", color: "yellow", data: dataSources.energia },
    { id: "pesquisas-ibge", title: "Pesquisas e Censos do IBGE", icon: "fas fa-chart-bar", color: "indigo", data: dataSources.pesquisasIbge },
    { id: "social", title: "Programas Sociais", icon: "fas fa-hands-helping", color: "red", data: dataSources.social },
    { id: "transparencia", title: "Transparência e Controle", icon: "fas fa-eye", color: "purple", data: dataSources.transparencia },
    // { id: "financeiro", title: "Sistemas Financeiros", icon: "fas fa-money-bill-wave", color: "blue", data: [] }, // Covered elsewhere
  ];

  return (
    <div className="data-source-info-environment">
      {/* Header similar to DataVisualizationEnvironment */}
      <div className="data-source-info-header">
        <h1>Catálogo de Bases de Dados Governamentais Brasileiras</h1>
        <p>
          Este catálogo reúne as principais fontes de dados abertos e sistemas de informação do governo brasileiro,
          organizados por áreas temáticas para facilitar a busca e o acesso.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="data-source-info-content">
        {/* Index */}
        <nav className="data-source-index">
          <h2>Índice de Conteúdo</h2>
          <ul className="index-grid">
            {sections.map(section => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="index-link">
                  <i className={`${section.icon} index-icon`}></i> {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sections */}
        {sections.map(section => (
          <section key={section.id} id={section.id} className="data-source-section">
            <div className="section-header">
              <div className={`section-icon-wrapper bg-${section.color}-100 text-${section.color}-500`}>
                <i className={section.icon}></i>
              </div>
              <h2 className="section-title">{section.title}</h2>
            </div>

            <div className="cards-grid">
              {section.data.map(source => (
                <div key={source.id} className="base-card">
                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="card-title">{source.title}</h3>
                      <span className={`card-type ${source.typeClass}`}>{source.type}</span>
                    </div>
                    <p className="card-description">{source.description}</p>
                    <div className="card-details">
                      <h4 className="details-title">Informações disponíveis:</h4>
                      <ul className="details-list">{renderList(source.info)}</ul>
                    </div>
                    <div className="card-details">
                      <h4 className="details-title">Como utilizar:</h4>
                      <ol className="details-list ordered">{renderList(source.usage)}</ol>
                    </div>
                    <a href={source.link} target="_blank" rel="noopener noreferrer" className="card-link-button">
                      <i className="fas fa-external-link-alt link-icon"></i>Acessar {source.type}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Footer */}
        <footer className="data-source-footer">
          <p>Última atualização: Abril de 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default DataSourceInfo;
