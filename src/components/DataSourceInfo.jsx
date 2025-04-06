import React, { useState } from 'react';
import '../styles/DataSourceInfo.css'; // Styles will be applied
import TransformacaoMunicipios from './ETL/TransformacaoMunicipios'; // Import the transformation component
import TransformacaoSNIS from './ETL/TransformacaoSNIS'; // Import the SNIS transformation component
import TransformacaoIndicePosicional from './ETL/TransformacaoIndicePosicional'; // Import the Positional Index component
import TransformacaoIPEADATA from './ETL/TransformacaoIPEADATA'; // Import the IPEADATA transformation component
import TransformacaoDATASUS from './ETL/TransformacaoDATASUS'; // Import the DATASUS transformation component
import TransformacaoFINBRA from './ETL/TransformacaoFINBRA'; // Import the FINBRA transformation component
import TransformacaoIBGE from './ETL/TransformacaoIBGE'; // Import the IBGE transformation component
import TransformacaoCodigoMunicipio from './ETL/TransformacaoCodigoMunicipio'; // Import the Code Correction component

// --- Catalog Component ---
const CatalogView = () => {
  // Helper function to create list items
  const renderList = (items) => items.map((item, index) => <li key={index}>{item}</li>);

  // Data source definitions (Merged from original PDF and new HTML)
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
            link: "https://www.ipardes.pr.gov.br/Pagina/Base-de-Dados-do-Estado-BDEweb"
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
            "Bases de dados integradas de diferentes órgãos",
            "Bases preparadas para integrações via SQL e Python"
            ],
            usage: [
            "Acesse a plataforma e explore os conjuntos de dados disponíveis",
            "Utilize os filtros para encontrar dados por tema ou fonte",
            "Faça o download direto ou use a API via Python ou R",
            "Consulte a documentação para entender a estrutura dos dados",
            "Consulte diretamente via BigQuery"
            ],
            link: "https://basedosdados.org/"
        }
    ],
    economia: [ // Renamed from 'economia' to 'economia e mercado'
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
            id: "portal-transparencia", // Already exists, kept here
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
            id: "siconfi", // Already exists, kept here
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
            id: "bcb-estatisticas", // Already exists, kept here
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
            id: "comex-stat", // Already exists, kept here
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
            link: "https://comexstat.mdic.gov.br/"
        },
        { // New from HTML
            id: "cvm-dados",
            title: "Portal de Dados Abertos da CVM",
            type: "Financeiro",
            typeClass: "bg-green-100 text-green-800",
            description: "Plataforma que disponibiliza dados de empresas de capital aberto, fundos de investimento e outros participantes do mercado de capitais brasileiro, permitindo acompanhar a evolução e desempenho das companhias listadas.",
            info: [
                "Demonstrações financeiras de companhias abertas",
                "Dados cadastrais de empresas registradas",
                "Informações sobre fundos de investimento",
                "Dados de operações e transações no mercado",
                "Documentos e fatos relevantes de empresas de capital aberto"
            ],
            usage: [
                "Acesse o portal e navegue pelos conjuntos de dados",
                "Filtre por empresa, período ou tipo de documento",
                "Baixe os dados em formato aberto (CSV, JSON)",
                "Utilize as APIs disponíveis para integração com sistemas"
            ],
            link: "https://dados.cvm.gov.br/"
        },
        { // New from HTML
            id: "b3-empresas",
            title: "B3 - Empresas Listadas",
            type: "Bolsa",
            typeClass: "bg-blue-100 text-blue-800",
            description: "Portal com informações sobre todas as empresas listadas na B3 (Brasil, Bolsa, Balcão), principal bolsa de valores brasileira, incluindo dados financeiros, documentos oficiais e informações de governança corporativa.",
            info: [
                "Dados cadastrais de empresas listadas",
                "Demonstrações financeiras e documentos corporativos",
                "Informações sobre governança corporativa",
                "Dados de cotações e negociações",
                "Histórico de dividendos e eventos corporativos"
            ],
            usage: [
                "Acesse o portal e pesquise por empresa",
                "Consulte relatórios e demonstrações financeiras",
                "Baixe dados históricos de negociação",
                "Acompanhe fatos relevantes e comunicados ao mercado"
            ],
            link: "https://www.b3.com.br/pt_br/produtos-e-servicos/negociacao/renda-variavel/empresas-listadas.htm"
        },
        { // New from HTML - Duplicate of bcb-estatisticas, but keeping as per HTML structure
            id: "bcb-dados-abertos",
            title: "Banco Central - Dados Abertos",
            type: "Monetário",
            typeClass: "bg-yellow-100 text-yellow-800",
            description: "Portal de dados abertos do Banco Central do Brasil que disponibiliza informações sobre o sistema financeiro, política monetária, cambial e de crédito, permitindo análises econômicas e financeiras do país.",
            info: [
                "Séries temporais de indicadores econômicos e financeiros",
                "Dados sobre instituições financeiras e suas operações",
                "Informações sobre câmbio, inflação e juros",
                "Estatísticas de crédito e endividamento",
                "Indicadores do sistema de pagamentos brasileiro"
            ],
            usage: [
                "Acesse o portal de dados abertos ou o Sistema Gerenciador de Séries Temporais (SGS)",
                "Busque os indicadores de interesse por tema ou código",
                "Selecione o período e formato de visualização",
                "Exporte os dados em diversos formatos (CSV, JSON, Excel)"
            ],
            link: "https://dadosabertos.bcb.gov.br/"
        },
        { // New from HTML
            id: "mapa-industria",
            title: "Mapa da Indústria - CNI",
            type: "Industrial",
            typeClass: "bg-red-100 text-red-800",
            description: "Plataforma da Confederação Nacional da Indústria (CNI) que reúne dados e indicadores industriais do Brasil, com informações sobre produção, emprego, investimentos e comércio exterior do setor industrial.",
            info: [
                "Indicadores de produção industrial por setor",
                "Dados sobre emprego e salários na indústria",
                "Informações sobre investimentos e utilização da capacidade",
                "Estatísticas de comércio exterior industrial",
                "Pesquisas de confiança e expectativas do empresariado"
            ],
            usage: [
                "Acesse a plataforma e selecione o tipo de informação desejada",
                "Filtre por período, setor industrial ou região",
                "Visualize gráficos e tabelas comparativas",
                "Exporte os dados em formatos como Excel e PDF"
            ],
            link: "https://www.portaldaindustria.com.br/estatisticas/"
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
    saude: [ // Renamed from 'saude' to 'saude e epidemiologia'
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
            link: "https://datasus.saude.gov.br/informacoes-de-saude-tabnet/"
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
            link: "https://dadosabertos.ans.gov.br/"
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
        },
        { // New from HTML
            id: "vigitel",
            title: "Vigitel - Vigilância de Fatores de Risco",
            type: "Comportamental",
            typeClass: "bg-yellow-100 text-yellow-800",
            description: "Sistema de monitoramento de fatores de risco e proteção para doenças crônicas por inquérito telefônico do Ministério da Saúde, que coleta dados sobre hábitos alimentares, atividade física, tabagismo, entre outros.",
            info: [
                "Dados sobre hábitos alimentares da população",
                "Informações sobre sedentarismo e atividade física",
                "Estatísticas sobre tabagismo e consumo de álcool",
                "Prevalência de doenças crônicas não transmissíveis",
                "Séries históricas de fatores de risco à saúde"
            ],
            usage: [
                "Acesse os relatórios anuais do Vigitel",
                "Consulte as bases de dados no site do DATASUS",
                "Analise as tendências temporais dos indicadores",
                "Utilize os microdados para análises específicas"
            ],
            link: "https://datasus.saude.gov.br/vigitel-vigilancia-de-fatores-de-risco-e-protecao-para-doencas-cronicas-por-inquerito-telefonico/"
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
    infraestrutura: [ // Renamed from 'infraestrutura' to 'infraestrutura, transportes e mobilidade'
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
            link: "https://app4.mdr.gov.br/serieHistorica/"
        },
        {
            id: "antt-dados",
            title: "ANTT - Dados Abertos",
            type: "Transporte Terrestre", // More specific type
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
        },
        { // New from HTML (Transportes)
            id: "onsv",
            title: "Observatório Nacional de Segurança Viária",
            type: "Segurança Viária",
            typeClass: "bg-red-100 text-red-800",
            description: "Organização que compila e disponibiliza dados e estatísticas sobre acidentes de trânsito no Brasil, produzindo análises sobre segurança viária e fatores de risco, contribuindo para políticas públicas mais eficazes.",
            info: [
                "Estatísticas de acidentes de trânsito",
                "Dados sobre mortalidade e morbidade no trânsito",
                "Estudos sobre fatores de risco e comportamento",
                "Indicadores de segurança viária por região",
                "Análises de custo social e econômico dos acidentes"
            ],
            usage: [
                "Acesse o portal e consulte os relatórios disponíveis",
                "Navegue pelos dashboards e visualizações interativas",
                "Filtre os dados por região, tipo de veículo ou período",
                "Faça download de estatísticas e indicadores em formato aberto"
            ],
            link: "https://www.onsv.org.br/"
        },
        { // New from HTML (Transportes)
            id: "anac-dados",
            title: "Portal de Dados Abertos da ANAC",
            type: "Transporte Aéreo",
            typeClass: "bg-blue-100 text-blue-800",
            description: "Plataforma da Agência Nacional de Aviação Civil que disponibiliza dados sobre o transporte aéreo brasileiro, incluindo voos, aeronaves, aeroportos e empresas aéreas, permitindo análises sobre o setor.",
            info: [
                "Dados estatísticos de voos e operações aéreas",
                "Informações sobre tarifas e demanda do setor",
                "Cadastro de aeronaves e aeródromos",
                "Estatísticas de acidentes e incidentes",
                "Dados de empresas aéreas e suas operações"
            ],
            usage: [
                "Acesse o portal e utilize o catálogo de dados",
                "Filtre por categoria, formato ou palavra-chave",
                "Faça download dos conjuntos de dados",
                "Consulte os metadados para entender a estrutura das informações"
            ],
            link: "https://dados.gov.br/organization/agencia-nacional-de-aviacao-civil-anac"
        },
        { // New from HTML (Transportes)
            id: "denatran-dados",
            title: "DENATRAN - Dados Abertos",
            type: "Frota Veicular",
            typeClass: "bg-green-100 text-green-800",
            description: "Portal de dados do Departamento Nacional de Trânsito com informações sobre a frota de veículos, condutores habilitados, multas e infrações em todo o Brasil, permitindo análises sobre o sistema nacional de trânsito.",
            info: [
                "Estatísticas da frota de veículos por tipo e localidade",
                "Dados sobre habilitação de condutores",
                "Informações sobre infrações e penalidades",
                "Estatísticas de acidentes de trânsito",
                "Dados sobre veículos por idade e categoria"
            ],
            usage: [
                "Acesse o portal e selecione a categoria de dados",
                "Filtre por estado, período ou tipo de veículo",
                "Visualize relatórios estatísticos ou dados brutos",
                "Faça download das informações em formato aberto"
            ],
            link: "https://dados.gov.br/organization/departamento-nacional-de-transito-denatran"
        }
    ],
    ambiental: [ // Renamed from 'ambiental' to 'Meio Ambiente e Dados Geográficos'
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
            link: "https://dadosabertos.ibama.gov.br/"
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
        },
        { // New from HTML (Geográficos)
            id: "inde",
            title: "INDE - Infraestrutura Nacional de Dados Espaciais",
            type: "Geoespacial",
            typeClass: "bg-blue-100 text-blue-800",
            description: "Portal que integra dados geoespaciais produzidos por instituições governamentais brasileiras em um único ambiente de acesso, facilitando a descoberta, o uso e o compartilhamento de informações geográficas.",
            info: [
                "Mapas temáticos de diversas instituições públicas",
                "Dados de limites territoriais e administrativos",
                "Informações sobre recursos naturais, infraestrutura e urbanização",
                "Geosserviços padronizados para integração com sistemas externos",
                "Bases cartográficas oficiais do Brasil"
            ],
            usage: [
                "Acesse o visualizador de mapas para combinação e análise de camadas",
                "Consulte o catálogo de geosserviços para acesso via WMS, WFS ou WCS",
                "Baixe dados em formatos geoespaciais (Shapefile, GeoJSON)",
                "Integre os serviços em aplicações próprias de geoprocessamento"
            ],
            link: "https://inde.gov.br/"
        },
        { // New from HTML (Ambiental)
            id: "seeg",
            title: "SEEG - Sistema de Estimativas de Emissões de Gases",
            type: "Climático",
            typeClass: "bg-green-100 text-green-800",
            description: "Principal plataforma de monitoramento de emissões de gases de efeito estufa na América Latina, mantida pelo Observatório do Clima, sendo uma das maiores bases de dados nacionais de emissões do mundo.",
            info: [
                "Dados de emissões por setor econômico",
                "Séries históricas de emissões desde 1970",
                "Informações em nível nacional, estadual e municipal",
                "Dados setoriais (energia, indústria, agropecuária, resíduos e mudança de uso da terra)",
                "Indicadores comparativos de desempenho climático"
            ],
            usage: [
                "Acesse as plataformas de visualização de dados",
                "Filtre por período, setor ou região geográfica",
                "Exporte os dados em formato aberto para análises complementares",
                "Consulte relatórios e análises disponíveis sobre as tendências de emissões"
            ],
            link: "https://seeg.eco.br/"
        },
        { // New from HTML (Ambiental)
            id: "mapbiomas",
            title: "MapBiomas Brasil",
            type: "Uso do Solo",
            typeClass: "bg-yellow-100 text-yellow-800",
            description: "Projeto que mapeia anualmente a cobertura e uso do solo no Brasil, oferecendo informações sobre mudanças na paisagem e uso da terra em todo o território nacional desde 1985, com base em sensoriamento remoto.",
            info: [
                "Mapas anuais de cobertura e uso do solo desde 1985",
                "Dados sobre áreas de floresta, agricultura, pastagens e áreas urbanas",
                "Informações sobre transições de uso do solo ao longo do tempo",
                "Alertas de desmatamento e monitoramento ambiental",
                "Mapeamentos específicos para cada bioma brasileiro"
            ],
            usage: [
                "Acesse a plataforma e navegue pelos mapas interativos",
                "Filtre por região, bioma ou tipo de cobertura",
                "Baixe os dados geoespaciais para análises específicas",
                "Consulte relatórios e estatísticas sobre as mudanças territoriais"
            ],
            link: "https://brasil.mapbiomas.org/"
        },
        { // New from HTML (Ambiental)
            id: "terrabrasilis",
            title: "TerraBrasilis - INPE",
            type: "Monitoramento Ambiental", // More specific
            typeClass: "bg-red-100 text-red-800",
            description: "Plataforma desenvolvida pelo INPE para organização, acesso e uso dos dados geográficos de monitoramento ambiental, permitindo acompanhar as mudanças na cobertura florestal e uso da terra nos biomas brasileiros.",
            info: [
                "Dados de desmatamento da Amazônia (PRODES) e demais biomas",
                "Sistema de detecção de desmatamento em tempo real (DETER)",
                "Informações sobre queimadas e incêndios florestais",
                "Mapas de uso e cobertura da terra",
                "Séries históricas de desmatamento e degradação florestal"
            ],
            usage: [
                "Acesse a plataforma e selecione o conjunto de dados de interesse",
                "Utilize as ferramentas de visualização e análise espacial",
                "Baixe dados em formatos geoespaciais para uso em SIG",
                "Consulte painéis e dashboards com estatísticas atualizadas"
            ],
            link: "http://terrabrasilis.dpi.inpe.br/"
        }
    ],
    seguranca: [ // Renamed from 'seguranca' to 'Segurança e Justiça'
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
            link: "https://www.cnj.jus.br/transparencia-cnj/dados-abertos/"
        },
        { // New from HTML (Judiciais)
            id: "datajud",
            title: "DATAJUD - Base Nacional de Dados do Poder Judiciário",
            type: "Processual",
            typeClass: "bg-blue-100 text-blue-800",
            description: "Sistema oficial do CNJ que centraliza informações processuais de todos os tribunais brasileiros e serve como fonte primária para estatísticas judiciais, permitindo acompanhar o desempenho do Judiciário.",
            info: [
                "Dados sobre processos judiciais de todos os tribunais",
                "Estatísticas sobre tempo de tramitação e produtividade",
                "Informações sobre a movimentação processual",
                "Painéis analíticos sobre a atividade jurisdicional",
                "Indicadores de desempenho do sistema judiciário"
            ],
            usage: [
                "Acesse o portal do CNJ e consulte os painéis estatísticos",
                "Visualize dados agregados por tribunal, comarca ou assunto",
                "Baixe relatórios e extratos estatísticos em diversos formatos",
                "Para pesquisadores, solicite acesso às APIs e bases de dados"
            ],
            link: "https://www.cnj.jus.br/sistemas/datajud/"
        },
        { // New from HTML (Judiciais)
            id: "corpus927",
            title: "Corpus 927 - ENFAM",
            type: "Precedentes",
            typeClass: "bg-indigo-100 text-indigo-800",
            description: "Plataforma desenvolvida pela Escola Nacional de Formação e Aperfeiçoamento de Magistrados (ENFAM) que reúne decisões vinculantes previstas no art. 927 do CPC, organizando os precedentes judiciais de forma sistematizada.",
            info: [
                "Precedentes judiciais vinculantes do STF e STJ",
                "Jurisprudência qualificada e sistematizada",
                "Súmulas vinculantes e orientações jurisprudenciais",
                "Decisões em incidentes de resolução de demandas repetitivas",
                "Teses jurídicas firmadas em julgamentos de recursos repetitivos"
            ],
            usage: [
                "Acesse a plataforma e utilize os filtros de pesquisa",
                "Selecione o tema jurídico ou tribunal de interesse",
                "Consulte a íntegra das decisões e seus fundamentos",
                "Utilize os resultados para fundamentação jurídica e pesquisa"
            ],
            link: "https://corpus927.enfam.jus.br/"
        },
        { // New from HTML (Judiciais)
            id: "jusbrasil-juris",
            title: "Consulta Unificada de Jurisprudência - Jusbrasil",
            type: "Jurisprudência",
            typeClass: "bg-yellow-100 text-yellow-800",
            description: "Ferramenta que unifica a busca por jurisprudência de diversos tribunais brasileiros, facilitando o acesso às decisões judiciais em uma interface intuitiva e com recursos avançados de pesquisa.",
            info: [
                "Acórdãos e decisões de tribunais de todo o Brasil",
                "Jurisprudência unificada de diversos tribunais",
                "Decisões organizadas por tema e relevância",
                "Estatísticas sobre tendências decisórias",
                "Conexões com legislação relacionada"
            ],
            usage: [
                "Acesse o portal e utilize a busca unificada",
                "Filtre por tribunal, período ou tipo de decisão",
                "Leia os acórdãos na íntegra ou resumos",
                "Compare decisões sobre o mesmo tema em diferentes tribunais"
            ],
            link: "https://www.jusbrasil.com.br/jurisprudencia/"
        },
        { // New from HTML (Judiciais)
            id: "stj-juris",
            title: "Pesquisa de Jurisprudência - STJ",
            type: "Superior",
            typeClass: "bg-purple-100 text-purple-800",
            description: "Sistema de busca oficial do Superior Tribunal de Justiça que permite acesso à jurisprudência do STJ, incluindo acórdãos, súmulas, decisões monocráticas e informativos jurisprudenciais.",
            info: [
                "Acórdãos e decisões do STJ",
                "Súmulas e orientações jurisprudenciais",
                "Informativos de jurisprudência",
                "Decisões em recursos repetitivos",
                "Pesquisa temática de julgados"
            ],
            usage: [
                "Acesse o sistema de pesquisa jurisprudencial",
                "Utilize operadores de busca para refinar pesquisas",
                "Filtre por tipo de decisão, órgão julgador ou relator",
                "Consulte a íntegra dos acórdãos e repositórios oficiais"
            ],
            link: "https://scon.stj.jus.br/"
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
            link: "https://www.bdpa.cnptia.embrapa.br/"
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
            type: "Planejamento Energético", // More specific
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
            link: "https://www.epe.gov.br/pt/publicacoes-dados-abertos/publicacoes"
        },
        {
            id: "ons-dados",
            title: "ONS - Dados Abertos",
            type: "Operação Elétrica", // More specific
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
            type: "Pesquisa Domiciliar", // More specific
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
            type: "Consumo Familiar", // More specific
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
            type: "Administração Pública", // More specific
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
            type: "Saneamento Básico", // More specific
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
            type: "Cadastro Territorial", // More specific
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
            type: "Cadastro Social", // More specific
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
            type: "Consulta CadÚnico", // More specific
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
            type: "Monitoramento Social", // More specific
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
            type: "Previdência Social", // More specific
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
    transparencia: [ // Renamed from 'transparencia' to 'Transparência, Controle e Administração Pública'
        {
            id: "cgu",
            title: "CGU - Controladoria-Geral da União",
            type: "Controle Interno", // More specific
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
            type: "Participação Cidadã", // More specific
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
            type: "Controle Externo", // More specific
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
        },
        { // New from HTML (Administração)
            id: "painel-resolveu",
            title: "Painel Resolveu? - CGU",
            type: "Ouvidoria",
            typeClass: "bg-green-100 text-green-800",
            description: "Ferramenta desenvolvida pela Controladoria-Geral da União que apresenta informações sobre manifestações de ouvidoria (denúncias, reclamações, solicitações, sugestões e elogios) recebidas por órgãos federais.",
            info: [
                "Dados estatísticos sobre manifestações de ouvidoria",
                "Informações sobre satisfação dos usuários",
                "Indicadores de prazo de atendimento",
                "Estatísticas por órgão, assunto e região",
                "Séries históricas sobre participação social"
            ],
            usage: [
                "Acesse o painel e navegue pelos dashboards disponíveis",
                "Filtre por órgão, tipo de manifestação ou período",
                "Visualize gráficos e estatísticas de desempenho",
                "Exporte os dados em formato aberto para análises específicas"
            ],
            link: "https://paineis.cgu.gov.br/resolveu/index.htm"
        },
        { // New from HTML (Transparência)
            id: "painel-compras",
            title: "Painel de Compras - Governo Federal",
            type: "Contratações Públicas", // More specific
            typeClass: "bg-yellow-100 text-yellow-800",
            description: "Ferramenta que apresenta os dados de compras públicas realizadas pelo Governo Federal, oferecendo informações sobre licitações, contratos, fornecedores e preços praticados na administração pública federal.",
            info: [
                "Dados sobre processos de compras governamentais",
                "Informações sobre fornecedores e contratos",
                "Estatísticas sobre modalidades de licitação",
                "Indicadores de economia e eficiência nas contratações",
                "Séries históricas de preços e valores contratados"
            ],
            usage: [
                "Acesse o painel e navegue pelos diferentes módulos",
                "Filtre por órgão, período ou tipo de contratação",
                "Visualize gráficos comparativos e estatísticas",
                "Exporte os dados em formato aberto para análises detalhadas"
            ],
            link: "https://paineldecompras.economia.gov.br/"
        },
        { // New from HTML (Transparência)
            id: "portais-subnacionais",
            title: "Portal da Transparência - Estados e Municípios",
            type: "Transparência Subnacional", // More specific
            typeClass: "bg-red-100 text-red-800",
            description: "Plataforma que reúne links para os portais de transparência dos estados e municípios brasileiros, permitindo acesso centralizado às informações sobre orçamento, despesas, receitas e contratos dessas entidades federativas.",
            info: [
                "Links para portais de transparência estaduais e municipais",
                "Dados sobre execução orçamentária e financeira",
                "Informações sobre servidores e folha de pagamento",
                "Detalhes sobre convênios e transferências",
                "Dados sobre licitações e contratos subnacionais"
            ],
            usage: [
                "Acesse o portal e selecione o estado ou município de interesse",
                "Navegue pelo portal de transparência específico da localidade",
                "Consulte dados sobre receitas, despesas e contratos",
                "Utilize as ferramentas de busca para informações específicas"
            ],
            link: "https://www.gov.br/governodigital/pt-br/dados-abertos/portais-de-transparencia-estaduais-e-municipais"
        }
    ],
    desenvolvimento: [ // New Section
        {
            id: "atlas-brasil",
            title: "Atlas Brasil - Desenvolvimento Humano",
            type: "Indicadores Sociais", // More specific
            typeClass: "bg-green-100 text-green-800",
            description: "Plataforma que disponibiliza o Índice de Desenvolvimento Humano Municipal (IDHM) e mais de 330 indicadores socioeconômicos para municípios, UFs e regiões metropolitanas brasileiras, desenvolvida pelo PNUD, IPEA e FJP.",
            info: [
                "Indicadores de desenvolvimento humano (longevidade, educação e renda)",
                "Dados sobre vulnerabilidade social e desigualdade",
                "Séries históricas e comparativos entre regiões",
                "Mapas interativos e relatórios personalizáveis",
                "Perfis completos de municípios e regiões metropolitanas"
            ],
            usage: [
                "Acesse a plataforma e selecione o município ou região de interesse",
                "Visualize dados e indicadores específicos por tema",
                "Compare diferentes localidades e períodos",
                "Exporte os dados em diversos formatos para análises próprias"
            ],
            link: "http://www.atlasbrasil.org.br/"
        },
        {
            id: "ivs",
            title: "IVS - Índice de Vulnerabilidade Social",
            type: "Vulnerabilidade Social", // More specific
            typeClass: "bg-yellow-100 text-yellow-800",
            description: "Ferramenta que identifica falhas de oferta de serviços públicos básicos e situações de vulnerabilidade social, desenvolvida pelo IPEA como complemento ao IDHM, permitindo avaliar realidades municipais, estaduais e regionais.",
            info: [
                "Indicadores de infraestrutura urbana",
                "Dados sobre capital humano (saúde e educação)",
                "Informações sobre renda e trabalho",
                "Séries históricas de vulnerabilidade social",
                "Mapas temáticos de desigualdades territoriais"
            ],
            usage: [
                "Acesse o portal e navegue pelos mapas interativos",
                "Selecione a região e os indicadores de interesse",
                "Compare dados entre diferentes períodos e localidades",
                "Baixe os relatórios completos ou dados específicos em diversos formatos"
            ],
            link: "https://www.ipea.gov.br/portal/index.php?option=com_content&id=29765"
        }
    ],
    pesquisas: [ // New Section (Non-IBGE)
        {
            id: "cesop",
            title: "CESOP - Centro de Estudos de Opinião Pública",
            type: "Opinião Pública", // More specific
            typeClass: "bg-blue-100 text-blue-800",
            description: "Banco de dados de pesquisas de opinião pública da Unicamp, que resgata, organiza e armazena pesquisas por amostragem realizadas no Brasil desde a década de 1990, incluindo pesquisas eleitorais e comportamentais.",
            info: [
                "Pesquisas eleitorais históricas (desde a década de 1990)",
                "Estudos sobre comportamento social e político",
                "Pesquisas de institutos como IBOPE, Datafolha e outros",
                "Microdados de surveys e questionários aplicados",
                "Séries históricas de tendências de opinião"
            ],
            usage: [
                "Acesse o portal do CESOP",
                "Consulte o catálogo de pesquisas disponíveis",
                "Solicite acesso aos dados brutos para pesquisa acadêmica",
                "Utilize as informações em análises longitudinais de opinião pública"
            ],
            link: "https://www.cesop.unicamp.br/por/"
        },
        {
            id: "seade",
            title: "SEADE Repositório",
            type: "Estatísticas Estaduais (SP)", // More specific
            typeClass: "bg-green-100 text-green-800",
            description: "Plataforma de dados estatísticos da Fundação SEADE (Sistema Estadual de Análise de Dados) de São Paulo, com foco em informações socioeconômicas paulistas, disponibilizando indicadores e estatísticas para municípios e regiões.",
            info: [
                "Dados demográficos e populacionais de São Paulo",
                "Informações econômicas setoriais",
                "Indicadores sociais e de qualidade de vida",
                "Séries históricas e projeções estatísticas",
                "Dados sobre COVID-19 e outras estatísticas específicas"
            ],
            usage: [
                "Acesse o repositório e explore as bases temáticas",
                "Selecione os indicadores de interesse",
                "Filtre por município ou região",
                "Exporte os dados em formatos abertos para análise"
            ],
            link: "https://repositorio.seade.gov.br/"
        },
        {
            id: "obs-metropoles",
            title: "Observatório das Metrópoles",
            type: "Estudos Urbanos", // More specific
            typeClass: "bg-yellow-100 text-yellow-800",
            description: "Rede de pesquisa que produz estudos e informações sobre as regiões metropolitanas brasileiras, com análises sobre governança, desigualdades e políticas urbanas, oferecendo indicadores e comparativos entre metrópoles.",
            info: [
                "Dados sobre desigualdades socioespaciais",
                "Indicadores de desenvolvimento urbano",
                "Informações sobre mobilidade e habitação",
                "Análises comparativas entre metrópoles",
                "Estudos sobre governança metropolitana"
            ],
            usage: [
                "Acesse o portal e consulte os estudos disponíveis",
                "Navegue pelos indicadores metropolitanos",
                "Faça download de relatórios e análises específicas",
                "Utilize os mapas temáticos para visualização de dados"
            ],
            link: "https://www.observatoriodasmetropoles.net.br/"
        }
    ],
    academico: [ // New Section
        {
            id: "repo-usp",
            title: "Repositório Institucional da USP",
            type: "Repositório Universitário", // More specific
            typeClass: "bg-blue-100 text-blue-800",
            description: "Plataforma que reúne a produção científica e intelectual da Universidade de São Paulo, incluindo teses, dissertações e artigos, disponibilizando em acesso aberto a pesquisa desenvolvida na maior universidade do país.",
            info: [
                "Teses e dissertações defendidas na USP",
                "Artigos científicos publicados por pesquisadores da universidade",
                "Trabalhos apresentados em eventos acadêmicos",
                "Produção intelectual e material didático",
                "Dados de pesquisa e conjuntos de dados científicos"
            ],
            usage: [
                "Acesse o portal e utilize a busca por tema ou autor",
                "Filtre por unidade, programa ou ano",
                "Baixe os documentos em formato digital",
                "Explore as coleções temáticas disponíveis"
            ],
            link: "https://www.acessoaberto.usp.br/repositorio-institucional-da-usp/"
        },
        {
            id: "repo-unicamp",
            title: "Repositório da Produção Científica e Intelectual da Unicamp",
            type: "Repositório Universitário", // More specific
            typeClass: "bg-green-100 text-green-800",
            description: "Plataforma que reúne e preserva a produção científica e acadêmica da Universidade Estadual de Campinas, disponibilizando pesquisas e trabalhos para acesso público e gratuito, contribuindo para a disseminação do conhecimento.",
            info: [
                "Teses e dissertações da Unicamp",
                "Artigos científicos e publicações",
                "Trabalhos apresentados em congressos",
                "Material audiovisual e multimídia",
                "Produções técnicas e patentes desenvolvidas na universidade"
            ],
            usage: [
                "Acesse o repositório e utilize os filtros de busca",
                "Explore por faculdade, instituto ou departamento",
                "Faça download dos documentos completos",
                "Visualize estatísticas de acesso e citação"
            ],
            link: "https://www.sbu.unicamp.br/sbu/repositorio-institucional-da-unicamp-2/"
        },
        {
            id: "bdtd",
            title: "BDTD - Biblioteca Digital Brasileira de Teses e Dissertações",
            type: "Teses e Dissertações", // More specific
            typeClass: "bg-yellow-100 text-yellow-800",
            description: "Plataforma que integra os sistemas de informação de teses e dissertações de instituições de ensino e pesquisa do Brasil, permitindo o acesso a textos completos da produção acadêmica nacional de pós-graduação.",
            info: [
                "Teses de doutorado de universidades brasileiras",
                "Dissertações de mestrado de diversas instituições",
                "Produções acadêmicas de pós-graduação stricto sensu",
                "Resumos e textos completos das pesquisas",
                "Referências bibliográficas e dados de autoridade"
            ],
            usage: [
                "Acesse a plataforma e utilize a busca avançada",
                "Filtre por instituição, área do conhecimento ou data",
                "Visualize os metadados e resumos das pesquisas",
                "Faça download dos textos completos em formato PDF"
            ],
            link: "https://bdtd.ibict.br/"
        },
        {
            id: "scielo",
            title: "SciELO - Scientific Electronic Library Online",
            type: "Periódicos Científicos", // More specific
            typeClass: "bg-red-100 text-red-800",
            description: "Biblioteca eletrônica que abrange uma coleção selecionada de periódicos científicos brasileiros e latino-americanos, disponibilizando artigos científicos em texto completo e de acesso aberto em diversas áreas do conhecimento.",
            info: [
                "Artigos científicos em texto completo",
                "Publicações acadêmicas de diversas áreas do conhecimento",
                "Métricas de citação e impacto dos periódicos",
                "Coleções temáticas e por área de conhecimento",
                "Dados bibliométricos de publicações brasileiras"
            ],
            usage: [
                "Acesse o portal e navegue pelas coleções de periódicos",
                "Utilize a busca avançada por autor, título ou assunto",
                "Filtre por área de conhecimento ou data de publicação",
                "Faça download dos artigos em PDF ou visualize online"
            ],
            link: "https://www.scielo.br/"
        },
        { // New from HTML (Acadêmico)
            id: "lattes",
            title: "CNPq - Plataforma Lattes",
            type: "Currículos Acadêmicos", // More specific
            typeClass: "bg-yellow-100 text-yellow-800",
            description: "Base de dados de currículos e instituições de pesquisa do Brasil, mantida pelo CNPq, sendo um padrão nacional para registro da vida acadêmica e profissional de pesquisadores e estudantes.",
            info: [
                "Currículos de pesquisadores, estudantes e profissionais",
                "Informações sobre produção científica e tecnológica",
                "Dados sobre participação em projetos e eventos",
                "Histórico acadêmico e profissional",
                "Redes de colaboração científica"
            ],
            usage: [
                "Acesse a plataforma e utilize a busca por nome ou CPF",
                "Consulte currículos individuais para informações detalhadas",
                "Utilize ferramentas de análise de produção científica",
                "Extraia dados para relatórios e avaliações institucionais"
            ],
            link: "https://lattes.cnpq.br/"
        }
    ],
    cultura: [ // New Section
        {
            id: "minc-dados",
            title: "Dados Abertos do Ministério da Cultura",
            type: "Políticas Culturais", // More specific
            typeClass: "bg-purple-100 text-purple-800",
            description: "Portal de dados abertos do MinC que disponibiliza informações sobre políticas culturais, projetos incentivados e equipamentos culturais, oferecendo transparência sobre investimentos e ações no setor cultural brasileiro.",
            info: [
                "Dados sobre projetos culturais da Lei Rouanet",
                "Informações sobre equipamentos culturais no Brasil",
                "Estatísticas de investimentos no setor cultural",
                "Dados sobre patrimônio histórico e artístico",
                "Informações sobre políticas públicas para a cultura"
            ],
            usage: [
                "Acesse o portal e explore os conjuntos de dados disponíveis",
                "Filtre por área cultural, região ou período",
                "Baixe os dados em formatos abertos",
                "Utilize as APIs para integração com aplicações"
            ],
            link: "https://www.gov.br/cultura/pt-br/acesso-a-informacao/dados-abertos"
        },
        {
            id: "sniic",
            title: "SNIIC - Sistema Nacional de Informações e Indicadores Culturais",
            type: "Indicadores Culturais", // More specific
            typeClass: "bg-blue-100 text-blue-800",
            description: "Plataforma que integra dados e indicadores culturais de diversas fontes, proporcionando um panorama do setor cultural brasileiro e subsidiando a formulação, implementação e avaliação de políticas culturais.",
            info: [
                "Mapas culturais e equipamentos por região",
                "Dados sobre agentes e instituições culturais",
                "Indicadores de consumo e produção cultural",
                "Informações sobre financiamento à cultura",
                "Estatísticas de emprego e economia criativa"
            ],
            usage: [
                "Acesse a plataforma e selecione o tipo de informação desejada",
                "Utilize os filtros por região, setor cultural ou período",
                "Visualize mapas interativos e dashboards",
                "Exporte os dados em formatos abertos para análise"
            ],
            link: "http://sniic.cultura.gov.br/"
        },
        {
            id: "mapa-cultural",
            title: "Mapa Cultural - Plataforma Colaborativa",
            type: "Mapeamento Cultural", // More specific
            typeClass: "bg-green-100 text-green-800",
            description: "Plataforma colaborativa que reúne informações sobre eventos, agentes, espaços e projetos culturais, permitindo a gestão cultural compartilhada entre poder público e sociedade civil, com mapeamento georreferenciado.",
            info: [
                "Dados georreferenciados de equipamentos culturais",
                "Informações sobre agentes e coletivos culturais",
                "Calendário de eventos e programação cultural",
                "Dados sobre projetos e iniciativas culturais",
                "Estatísticas sobre a distribuição cultural por território"
            ],
            usage: [
                "Acesse a plataforma e navegue pelo mapa interativo",
                "Filtre por tipo de espaço, evento ou agente cultural",
                "Consulte informações detalhadas sobre cada ponto no mapa",
                "Exporte dados em formato aberto ou utilize as APIs disponíveis"
            ],
            link: "https://mapas.cultura.gov.br/"
        },
        {
            id: "funarte-dados",
            title: "Base de Dados da FUNARTE",
            type: "Fomento às Artes", // More specific
            typeClass: "bg-yellow-100 text-yellow-800",
            description: "Repositório de dados da Fundação Nacional de Artes que reúne informações sobre as artes no Brasil, incluindo dados sobre fomento, produção artística, patrimônio e circulação de espetáculos em diversas linguagens.",
            info: [
                "Dados sobre editais e programas de fomento às artes",
                "Informações sobre espetáculos e exposições",
                "Acervo histórico de artes cênicas, música e artes visuais",
                "Registros de artistas e grupos artísticos",
                "Estatísticas de ocupação dos espaços culturais da Funarte"
            ],
            usage: [
                "Acesse o portal da Funarte e navegue pelos dados disponíveis",
                "Selecione a área artística ou tipo de informação desejada",
                "Consulte relatórios e estudos sobre as artes no Brasil",
                "Baixe documentos e publicações para referência"
            ],
            link: "https://www.gov.br/funarte/pt-br"
        }
    ],
    tecnologia: [ // New Section
        {
            id: "prodesp-dados",
            title: "Portal de Dados Abertos da PRODESP",
            type: "Governo Digital (SP)", // More specific
            typeClass: "bg-blue-100 text-blue-800",
            description: "Plataforma da empresa de tecnologia do Estado de São Paulo que disponibiliza dados sobre serviços digitais e tecnologia pública, oferecendo informações sobre transformação digital da gestão governamental.",
            info: [
                "Dados sobre serviços digitais governamentais",
                "Informações sobre infraestrutura tecnológica",
                "Estatísticas de atendimento e uso de plataformas",
                "Dados sobre documentos e certificações digitais",
                "Indicadores de transformação digital do setor público"
            ],
            usage: [
                "Acesse o portal e navegue pelos conjuntos de dados",
                "Filtre por área de serviço ou período",
                "Baixe os dados em formatos abertos",
                "Utilize as informações para análises de transformação digital"
            ],
            link: "https://www.prodesp.sp.gov.br/transparencia/dados-abertos"
        },
        {
            id: "oisp",
            title: "OISP - Observatório de Inovação no Setor Público",
            type: "Inovação Pública", // More specific
            typeClass: "bg-purple-100 text-purple-800",
            description: "Plataforma que mapeia e divulga iniciativas inovadoras na administração pública brasileira, compartilhando práticas, ferramentas e métodos que contribuem para transformar o serviço público e melhorar o atendimento ao cidadão.",
            info: [
                "Dados sobre iniciativas inovadoras no setor público",
                "Informações sobre laboratórios de inovação",
                "Estatísticas sobre impacto de projetos inovadores",
                "Ferramentas e metodologias para inovação pública",
                "Dados sobre desafios e soluções governamentais"
            ],
            usage: [
                "Acesse a plataforma e navegue pelo mapa de inovações",
                "Filtre por tema, região ou tipo de iniciativa",
                "Explore casos práticos e lições aprendidas",
                "Faça download de metodologias e ferramentas disponíveis"
            ],
            link: "https://www.gov.br/inova/pt-br"
        },
        {
            id: "dcti",
            title: "DCTI - Dados de Ciência, Tecnologia e Inovação",
            type: "Indicadores CT&I", // More specific
            typeClass: "bg-green-100 text-green-800",
            description: "Plataforma do Ministério da Ciência, Tecnologia e Inovações que disponibiliza dados sobre investimentos, produção científica, patentes e indicadores de CT&I no Brasil, oferecendo um panorama do sistema nacional de ciência e tecnologia.",
            info: [
                "Dados sobre investimentos em pesquisa e desenvolvimento",
                "Estatísticas de produção científica brasileira",
                "Informações sobre patentes e propriedade intelectual",
                "Indicadores de formação de recursos humanos em CT&I",
                "Dados sobre projetos financiados com recursos públicos"
            ],
            usage: [
                "Acesse a plataforma e selecione o tema de interesse",
                "Utilize os filtros disponíveis para refinar a busca",
                "Visualize gráficos e tabelas interativas",
                "Faça download dos dados em formato aberto para análises específicas"
            ],
            link: "https://antigo.mctic.gov.br/mctic/opencms/indicadores/indicadores_cti.html"
        }
    ],
    fundacoes: [ // New Section
        {
            id: "fapesp",
            title: "FAPESP - Fundação de Amparo à Pesquisa do Estado de São Paulo",
            type: "Fomento (SP)", // More specific
            typeClass: "bg-blue-100 text-blue-800",
            description: "Principal agência de fomento à pesquisa científica e tecnológica de São Paulo, disponibiliza dados sobre projetos financiados, bolsas concedidas e resultados de pesquisas apoiadas pela fundação.",
            info: [
                "Dados sobre projetos de pesquisa financiados",
                "Informações sobre bolsas de estudo e pesquisa",
                "Resultados e publicações de projetos apoiados",
                "Indicadores de investimento em CT&I em São Paulo",
                "Dados sobre acordos de cooperação e parcerias"
            ],
            usage: [
                "Acesse a Biblioteca Virtual da FAPESP",
                "Consulte dados sobre auxílios e bolsas concedidas",
                "Explore relatórios de atividades e indicadores",
                "Utilize a busca por área do conhecimento ou pesquisador"
            ],
            link: "https://fapesp.br/bv"
        },
        {
            id: "faperj",
            title: "FAPERJ - Fundação de Amparo à Pesquisa do Estado do Rio de Janeiro",
            type: "Fomento (RJ)", // More specific
            typeClass: "bg-green-100 text-green-800",
            description: "Agência de fomento à pesquisa do Rio de Janeiro, oferece dados sobre projetos, bolsas e programas de apoio à ciência, tecnologia e inovação no estado, promovendo o desenvolvimento científico fluminense.",
            info: [
                "Dados sobre editais e chamadas públicas",
                "Informações sobre projetos e pesquisadores apoiados",
                "Resultados de pesquisas financiadas",
                "Indicadores de CT&I no Rio de Janeiro",
                "Relatórios de gestão e prestação de contas"
            ],
            usage: [
                "Acesse o portal da FAPERJ e navegue pelos programas",
                "Consulte resultados de editais e projetos aprovados",
                "Busque por área de conhecimento ou instituição",
                "Acesse relatórios e publicações institucionais"
            ],
            link: "https://www.faperj.br/"
        },
        {
            id: "fapemig",
            title: "FAPEMIG - Fundação de Amparo à Pesquisa do Estado de Minas Gerais",
            type: "Fomento (MG)", // More specific
            typeClass: "bg-yellow-100 text-yellow-800",
            description: "Fundação de apoio à pesquisa em Minas Gerais, disponibiliza informações sobre programas de fomento, projetos financiados, bolsas e resultados de pesquisas científicas e tecnológicas no estado.",
            info: [
                "Dados sobre programas e editais de fomento",
                "Informações sobre projetos e bolsas concedidas",
                "Resultados e publicações de pesquisas apoiadas",
                "Indicadores de ciência e tecnologia em Minas Gerais",
                "Relatórios de atividades e investimentos"
            ],
            usage: [
                "Acesse o site da FAPEMIG e explore os programas",
                "Consulte a lista de projetos e bolsistas apoiados",
                "Busque por área do conhecimento ou palavra-chave",
                "Acesse publicações e relatórios institucionais"
            ],
            link: "https://fapemig.br/"
        }
    ],
    eleitorais: [ // New Section
        {
            id: "tse-dados",
            title: "TSE - Repositório de Dados Eleitorais",
            type: "Eleições",
            typeClass: "bg-purple-100 text-purple-800",
            description: "Portal do Tribunal Superior Eleitoral que centraliza dados sobre eleições, eleitorado, candidaturas e resultados eleitorais no Brasil, permitindo análises sobre o processo democrático brasileiro.",
            info: [
                "Resultados de eleições (votação por seção, município, etc.)",
                "Dados sobre o eleitorado (perfil, distribuição geográfica)",
                "Informações sobre candidaturas e prestação de contas",
                "Estatísticas eleitorais históricas",
                "Dados sobre partidos políticos e filiação partidária"
            ],
            usage: [
                "Acesse o repositório e selecione o tipo de dado desejado",
                "Filtre por ano da eleição, cargo ou localidade",
                "Baixe os dados em formato aberto (CSV, TXT)",
                "Consulte as estatísticas e relatórios disponíveis"
            ],
            link: "https://dadosabertos.tse.jus.br/"
        }
    ]
  };

  const sections = [
    { id: "geral", title: "Portais de Dados Gerais", icon: "fas fa-database", color: "blue", data: dataSources.geral },
    { id: "economia", title: "Economia e Mercado", icon: "fas fa-money-bill-wave", color: "green", data: dataSources.economia },
    { id: "emprego", title: "Emprego e Mercado de Trabalho", icon: "fas fa-briefcase", color: "blue", data: dataSources.emprego },
    { id: "saude", title: "Saúde e Epidemiologia", icon: "fas fa-heartbeat", color: "red", data: dataSources.saude },
    { id: "educacao", title: "Educação", icon: "fas fa-graduation-cap", color: "yellow", data: dataSources.educacao },
    { id: "infraestrutura", title: "Infraestrutura, Transportes e Mobilidade", icon: "fas fa-bus", color: "gray", data: dataSources.infraestrutura },
    { id: "ambiental", title: "Meio Ambiente e Dados Geográficos", icon: "fas fa-map-marked-alt", color: "green", data: dataSources.ambiental },
    { id: "seguranca", title: "Segurança e Justiça", icon: "fas fa-balance-scale", color: "red", data: dataSources.seguranca },
    { id: "agricultura", title: "Agricultura e Pecuária", icon: "fas fa-tractor", color: "yellow", data: dataSources.agricultura },
    { id: "energia", title: "Energia", icon: "fas fa-bolt", color: "yellow", data: dataSources.energia },
    { id: "pesquisas-ibge", title: "Pesquisas e Censos do IBGE", icon: "fas fa-chart-bar", color: "indigo", data: dataSources.pesquisasIbge },
    { id: "social", title: "Programas Sociais", icon: "fas fa-hands-helping", color: "red", data: dataSources.social },
    { id: "transparencia", title: "Transparência, Controle e Administração Pública", icon: "fas fa-building", color: "purple", data: dataSources.transparencia },
    { id: "desenvolvimento", title: "Desenvolvimento Humano e Social", icon: "fas fa-chart-line", color: "blue", data: dataSources.desenvolvimento },
    { id: "pesquisas", title: "Pesquisas e Estatísticas (Outros)", icon: "fas fa-poll", color: "blue", data: dataSources.pesquisas },
    { id: "academico", title: "Pesquisa Científica e Acadêmica", icon: "fas fa-graduation-cap", color: "blue", data: dataSources.academico },
    { id: "cultura", title: "Cultura e Artes", icon: "fas fa-theater-masks", color: "purple", data: dataSources.cultura },
    { id: "tecnologia", title: "Tecnologia e Inovação", icon: "fas fa-microchip", color: "indigo", data: dataSources.tecnologia },
    { id: "fundacoes", title: "Fundações de Amparo à Pesquisa", icon: "fas fa-flask", color: "blue", data: dataSources.fundacoes },
    { id: "eleitorais", title: "Dados Eleitorais", icon: "fas fa-vote-yea", color: "purple", data: dataSources.eleitorais }
  ].sort((a, b) => a.title.localeCompare(b.title)); // Sort sections alphabetically by title

  return (
    <>
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
                  {source.info && source.info.length > 0 && (
                    <div className="card-details">
                      <h4 className="details-title">Informações disponíveis:</h4>
                      <ul className="details-list">{renderList(source.info)}</ul>
                    </div>
                  )}
                  {source.usage && source.usage.length > 0 && (
                    <div className="card-details">
                      <h4 className="details-title">Como utilizar:</h4>
                      <ol className="details-list ordered">{renderList(source.usage)}</ol>
                    </div>
                  )}
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
    </>
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
  const [activeSubView, setActiveSubView] = useState('catalog'); // 'catalog', 'importFormats', or 'transformation'

  return (
    <div className="data-source-info-environment">
      {/* Header */}
      <div className="data-source-info-header">
        <h1>Onde Encontrar Dados & Formatos</h1>
        {/* Sub-view Selector Buttons */}
        <div className="sub-view-selector">
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
        {activeSubView === 'catalog' && <CatalogView />}
        {activeSubView === 'importFormats' && <ImportFormatsView />}
        {activeSubView === 'transformation' && <TransformationView />}
      </div>
    </div>
  );
};

export default DataSourceInfo;
