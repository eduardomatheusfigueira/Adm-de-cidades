import { TimelineEvent, TimelinePeriod, Character, EventCategory } from './types';

export const invencaoEvents: TimelineEvent[] = [
  {
    id: 1,
    year: 1890,
    title: "Início da luta operária",
    description: "Publicação de artigo no Echo Popular demarcando o início da luta operária por reconhecimento como cidadãos com direitos.",
    category: EventCategory.LABOR_MOVEMENT,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 2,
    year: 1890,
    title: "Apostolado Positivista",
    description: "Tentativa do Apostolado Positivista de apresentar pauta de direitos sociais ao ministro Benjamin Constant, com visão de cidadania restrita a direitos civis e sociais.",
    category: EventCategory.POLITICAL,
    characters: ["Benjamin Constant"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 3,
    year: 1890,
    title: "Fundação do Centro do Partido Operário",
    description: "Fundação do Centro do Partido Operário (CPO) no Rio de Janeiro, atuando como partido político e central sindical, lançando candidatos à Constituinte (eleição de Vinhaes) e eleições municipais.",
    category: EventCategory.LABOR_MOVEMENT,
    characters: ["Vinhaes"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 4,
    year: 1890,
    title: "Facções no movimento operário",
    description: "Formação de facções dentro do movimento operário, lideradas por Vinhaes e França e Silva, com diferentes propostas de organização e atuação política.",
    category: EventCategory.LABOR_MOVEMENT,
    characters: ["Vinhaes", "França e Silva"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 5,
    year: 1890,
    title: "Greve em Santos",
    description: "Vinhaes se envolve em episódio grevista em Santos, defendendo a justiça das reivindicações, mas recomendando a manutenção da ordem.",
    category: EventCategory.LABOR_MOVEMENT,
    characters: ["Vinhaes"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 6,
    year: 1890,
    title: "Alterações no Código Penal",
    description: "O CPO é o principal responsável por alterações no Código Penal de 1890 relativas ao direito de greve.",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 7,
    year: 1890,
    title: "Banco dos Operários",
    description: "Formação do Banco dos Operários por iniciativa do grupo de Vinhaes, com o objetivo de tornar o trabalhador proprietário.",
    category: EventCategory.LABOR_MOVEMENT,
    characters: ["Vinhaes"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 8,
    year: 1892,
    title: "Eleições municipais",
    description: "Candidatos do CPO participam das eleições municipais.",
    category: EventCategory.POLITICAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 9,
    year: 1892,
    endYear: 1904,
    title: "Disputas republicanas",
    description: "Período marcado pela disputa entre partidários de um governo republicano forte e centralizador (inspirado pelo positivismo e pelo movimento jacobino) e outras correntes.",
    category: EventCategory.POLITICAL,
    characters: ["Alcindo Guanabara", "Barbosa Lima", "Lauro Sodré"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 10,
    year: 1892,
    endYear: 1904,
    title: "Articulação patronal",
    description: "Comerciantes e industriais do Rio de Janeiro começam a se articular em associações para proteger seus interesses diante das mobilizações operárias.",
    category: EventCategory.SOCIAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 11,
    year: 1892,
    endYear: 1904,
    title: "Reforma policial",
    description: "Reforma e modernização da organização policial no Rio de Janeiro, culminando na formação da Força Policial do Distrito Federal (1905), com crescente repressão aos movimentos sociais.",
    category: EventCategory.REPRESSION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 12,
    year: 1892,
    endYear: 1904,
    title: "Denúncias de repressão",
    description: "Crescimento das denúncias de ação conjunta entre polícia e patronato contra trabalhadores.",
    category: EventCategory.REPRESSION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 13,
    year: 1903,
    title: "Gazeta Operária",
    description: "Criação do jornal Gazeta Operária, ligado a correntes socialistas que defendem a organização partidária dos trabalhadores.",
    category: EventCategory.LABOR_MOVEMENT,
    characters: ["Mariano Garcia", "Vicente de Souza"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 14,
    year: 1903,
    title: "Greve na fábrica Corcovado",
    description: "Greve dos operários da fábrica de tecidos Corcovado, com forte repressão policial.",
    category: EventCategory.LABOR_MOVEMENT,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 15,
    year: 1903,
    title: "Centro dos Industriais de Calçado",
    description: "Criação do Centro dos Industriais de Calçado, visando controle sobre os operários.",
    category: EventCategory.SOCIAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 16,
    year: 1906,
    endYear: 1916,
    title: "Ascensão sindical",
    description: "Período de grande experiência de ascensão da organização sindical, com debates internos sobre a melhor forma de atuação (sindicalismo vs. partido político).",
    category: EventCategory.LABOR_MOVEMENT,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 17,
    year: 1906,
    endYear: 1916,
    title: "Questionamento anarquista",
    description: "Anarquistas questionam a priorização da ação sindical como o principal instrumento de transformação social.",
    category: EventCategory.LABOR_MOVEMENT,
    characters: ["Neno Vasco", "Carlos Dias", "Manuel Moscoso", "João Arzua"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 18,
    year: 1906,
    endYear: 1908,
    title: "Greves portuárias",
    description: "Greves no porto do Rio de Janeiro, levando a acordos entre trabalhadores e patronato.",
    category: EventCategory.LABOR_MOVEMENT,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 19,
    year: 1909,
    title: "Jornais operários",
    description: "Publicação de O Operário e Tribuna do Povo, jornais ligados a diferentes tendências do movimento operário.",
    category: EventCategory.LABOR_MOVEMENT,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 20,
    year: 1915,
    title: "Campanha nacionalista",
    description: "Olavo Bilac inicia campanha nacionalista, resultando na formação da Liga da Defesa Nacional (1916) e da Liga Nacionalista (1917), vinculando nacionalismo a militarismo.",
    category: EventCategory.POLITICAL,
    characters: ["Olavo Bilac"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 21,
    year: 1915,
    title: "Posição anarquista",
    description: "Anarquistas se posicionam contra o patriotismo e o militarismo, defendendo uma noção de pátria como comunidade humana universal baseada em valores éticos.",
    category: EventCategory.LABOR_MOVEMENT,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 22,
    year: 1915,
    title: "Associação Gráfica do Rio de Janeiro",
    description: "Criação da Associação Gráfica do Rio de Janeiro, sindicato com forte presença de militantes anarquistas, mas sem definição doutrinária oficial.",
    category: EventCategory.LABOR_MOVEMENT,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 23,
    year: 1916,
    title: "Federação Marítima Brasileira",
    description: "Fundação da Federação Marítima Brasileira, reunindo associações de trabalhadores do porto do Rio, com comportamento político distinto do sindicalismo cooperativista e dos operários estatais.",
    category: EventCategory.LABOR_MOVEMENT,
    characters: ["Müller dos Reis"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 24,
    year: 1917,
    month: 6,
    title: "Greve geral no Rio",
    description: "Grande greve geral no Rio de Janeiro, com forte repressão policial e condenação por parte da Federação Marítima Brasileira e setores cooperativistas.",
    category: EventCategory.LABOR_MOVEMENT,
    characters: ["Müller dos Reis", "Saddock de Sá"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 25,
    year: 1917,
    endYear: 1920,
    title: "Greves portuárias",
    description: "Novo surto grevista no porto do Rio de Janeiro, com reação organizada do patronato.",
    category: EventCategory.LABOR_MOVEMENT,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 26,
    year: 1919,
    title: "Otávio Brandão no Rio",
    description: "Otávio Brandão chega ao Rio de Janeiro e adere ao anarquismo.",
    category: EventCategory.LABOR_MOVEMENT,
    characters: ["Otávio Brandão"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 27,
    year: 1919,
    title: "Lei de acidentes de trabalho",
    description: "Aprovada a lei de acidentes de trabalho.",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 28,
    year: 1920,
    title: "Conferência Internacional de Polícia",
    description: "Conferência Internacional Sul-Americana de Polícia em Buenos Aires, com participação do Brasil, demonstrando preocupação com a repressão ao movimento operário.",
    category: EventCategory.REPRESSION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 29,
    year: 1922,
    title: "Fundação do PCB",
    description: "Fundação do Partido Comunista do Brasil (PCB).",
    category: EventCategory.POLITICAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 30,
    year: 1922,
    title: "Debate anarquistas vs. comunistas",
    description: "Início do debate explícito entre anarquistas e comunistas, marcado pela publicação da revista Movimento Comunista.",
    category: EventCategory.LABOR_MOVEMENT,
    characters: ["Astrogildo Pereira"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 31,
    year: 1923,
    title: "CAPs e CNT",
    description: "Aprovados os projetos que criam as Caixas de Aposentadorias e Pensões (CAPs) para ferroviários e o Conselho Nacional do Trabalho (CNT), mas permanecem sem implementação efetiva.",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 32,
    year: 1926,
    title: "Leis de férias e código de menores",
    description: "Aprovadas as leis de férias para comerciários e operários industriais e o código de menores, também sem implementação efetiva.",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 33,
    year: 1928,
    title: "BOC nas eleições municipais",
    description: "O Bloco Operário (BOC), já como Operário e Camponês, lança candidatos ao Conselho Municipal do Rio de Janeiro, obtendo relativo sucesso.",
    category: EventCategory.POLITICAL,
    characters: ["Minervino de Oliveira", "Otávio Brandão"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 34,
    year: 1929,
    title: "Repressão aos sindicatos",
    description: "Intensificação da repressão aos sindicatos no final do Governo Washington Luís.",
    category: EventCategory.REPRESSION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 35,
    year: 1930,
    title: "Revolução de 1930",
    description: "Revolução de 1930, com grande violência em relação ao movimento sindical no período da Junta Governativa.",
    category: EventCategory.POLITICAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 36,
    year: 1930,
    title: "Posse de Getúlio Vargas",
    description: "Posse de Getúlio Vargas como chefe do Governo Provisório.",
    category: EventCategory.POLITICAL,
    characters: ["Getúlio Vargas"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 37,
    year: 1930,
    title: "Reabertura de sindicatos",
    description: "Reabertura de alguns sindicatos fechados.",
    category: EventCategory.LABOR_MOVEMENT,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 38,
    year: 1930,
    month: 11,
    title: "Ministério do Trabalho",
    description: "Criação do Ministério do Trabalho, Indústria e Comércio.",
    category: EventCategory.POLITICAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 39,
    year: 1931,
    title: "Decreto de sindicalização",
    description: "Decreto nº 19.770 estabelece novas normas de sindicalização, com correlação entre sindicalização reconhecida pelo ministério e recebimento de direitos sociais.",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 40,
    year: 1931,
    title: "Idort",
    description: "Criação do Instituto de Organização Racional do Trabalho de São Paulo (Idort).",
    category: EventCategory.SOCIAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 41,
    year: 1933,
    title: "ELSP",
    description: "Criação da Escola Livre de Sociologia de São Paulo (ELSP).",
    category: EventCategory.SOCIAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 42,
    year: 1933,
    title: "Carteiras de trabalho",
    description: "Instituição das carteiras de trabalho, fortalecendo o controle sobre a massa trabalhadora e incentivando a sindicalização oficial para acesso à Justiça do Trabalho.",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 43,
    year: 1934,
    title: "Eleições para a Constituinte",
    description: "Eleições para a Constituinte, com discussões sobre a organização partidária.",
    category: EventCategory.POLITICAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 44,
    year: 1934,
    title: "ANL e AIB",
    description: "Criação da Aliança Nacional Libertadora (ANL) e da Ação Integralista Brasileira (AIB).",
    category: EventCategory.POLITICAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 45,
    year: 1934,
    title: "Constituição de 1934",
    description: "Constituição de 1934 consagra a pluralidade sindical (posteriormente desrespeitada).",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 46,
    year: 1934,
    month: 5,
    title: "Restrição a estrangeiros",
    description: "Decretos de maio restringem a entrada de estrangeiros no país.",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 47,
    year: 1935,
    title: "Lei de Segurança Nacional",
    description: "Lei de Segurança Nacional intensifica a repressão política.",
    category: EventCategory.REPRESSION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 48,
    year: 1935,
    title: "Pesquisa sindical",
    description: "Primeira pesquisa do Ministério do Trabalho sobre a massa sindicalizada no país.",
    category: EventCategory.SOCIAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 49,
    year: 1937,
    title: "Golpe do Estado Novo",
    description: "Golpe de 1937 instaura o Estado Novo.",
    category: EventCategory.POLITICAL,
    characters: ["Getúlio Vargas"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 50,
    year: 1937,
    title: "Constituição de 1937",
    description: "Constituição de 1937 adota o critério de que o trabalho é um dever de todos e a desocupação um crime contra o Estado.",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 51,
    year: 1938,
    title: "Propaganda política",
    description: "A máquina política do Estado, liderada pelo DIP, inicia intensa campanha de propaganda política centrada na figura de Getúlio Vargas.",
    category: EventCategory.POLITICAL,
    characters: ["Getúlio Vargas"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 52,
    year: 1938,
    title: "Imposto Sindical",
    description: "Criação do Imposto Sindical, visando dotar os sindicatos oficiais de recursos, mas com efeito colateral de desincentivar a filiação.",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 53,
    year: 1938,
    title: "Restrições à imigração",
    description: "Promulgação de leis restringindo a imigração e a naturalização.",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 54,
    year: 1938,
    endYear: 1945,
    title: "Discursos radiofônicos",
    description: "Discursos radiofônicos de Getúlio Vargas e, principalmente, do ministro Alexandre Marcondes Filho, como estratégia de comunicação direta com os trabalhadores, divulgando a legislação social e construindo a imagem de Vargas como 'pai dos pobres'.",
    category: EventCategory.POLITICAL,
    characters: ["Getúlio Vargas", "Alexandre Marcondes Filho"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 55,
    year: 1938,
    endYear: 1945,
    title: "Órgãos sociais",
    description: "Criação de órgãos e serviços sociais como refeitórios populares, SAPS e Serviço Nacional de Recreação.",
    category: EventCategory.SOCIAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 56,
    year: 1938,
    endYear: 1945,
    title: "Legislação social",
    description: "Implementação de legislação social na área do trabalho (salário mínimo, Justiça do Trabalho, CLT, etc.), associada a uma retórica de dádiva e necessidade de retribuição (obediência política).",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 57,
    year: 1938,
    endYear: 1945,
    title: "Nacionalização",
    description: "Ênfase na nacionalização do trabalho e da propriedade.",
    category: EventCategory.POLITICAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 58,
    year: 1938,
    endYear: 1945,
    title: "Medicina social",
    description: "Incorporação do conceito de medicina social, com preocupação do Estado com a saúde física e psíquica do trabalhador.",
    category: EventCategory.SOCIAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 59,
    year: 1938,
    endYear: 1945,
    title: "CTOS",
    description: "Criação da Comissão Tripartite de Orientação Sindical (CTOS) para promover a sindicalização oficial.",
    category: EventCategory.LABOR_MOVEMENT,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 60,
    year: 1938,
    endYear: 1945,
    title: "Reorganização das DRTs",
    description: "Tentativas de reorganização das Delegacias Regionais do Trabalho para estender a orientação política do ministério.",
    category: EventCategory.POLITICAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 61,
    year: 1938,
    endYear: 1945,
    title: "Plano B",
    description: "Elaboração do 'Plano B' pelo Ministério do Trabalho, visando a organização política dos trabalhadores via sindicatos e institutos de previdência.",
    category: EventCategory.POLITICAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 62,
    year: 1938,
    endYear: 1945,
    title: "Partidos políticos",
    description: "Discussão sobre a formação de partidos políticos para a transição do autoritarismo, com a decisão de criar partidos nacionais (PSD e PTB).",
    category: EventCategory.POLITICAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 63,
    year: 1941,
    title: "Marcondes Filho no Ministério",
    description: "Alexandre Marcondes Filho assume o Ministério do Trabalho, dando forte impulso à propaganda e à organização do trabalho sob a égide do Estado Novo.",
    category: EventCategory.POLITICAL,
    characters: ["Alexandre Marcondes Filho"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 64,
    year: 1941,
    month: 12,
    title: "Alinhamento com EUA",
    description: "Discurso de Vargas em dezembro sinaliza o alinhamento do Brasil com os Estados Unidos.",
    category: EventCategory.INTERNATIONAL,
    characters: ["Getúlio Vargas"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 65,
    year: 1942,
    title: "Conferência do Rio",
    description: "Conferência do Rio de Janeiro define o rompimento de relações diplomáticas do Brasil com Alemanha, Itália e Japão.",
    category: EventCategory.INTERNATIONAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 66,
    year: 1942,
    title: "Tropas americanas",
    description: "Brasil permite o desembarque de tropas americanas no Nordeste.",
    category: EventCategory.INTERNATIONAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 67,
    year: 1942,
    title: "Propaganda ufanista",
    description: "Intensificação da propaganda ufanista e da vinculação da figura de Vargas aos direitos trabalhistas.",
    category: EventCategory.POLITICAL,
    characters: ["Getúlio Vargas"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 68,
    year: 1943,
    title: "Saída de Rêgo Monteiro",
    description: "Luiz Augusto do Rêgo Monteiro deixa o Ministério do Trabalho.",
    category: EventCategory.POLITICAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 69,
    year: 1943,
    title: "Agamenon no Ministério da Justiça",
    description: "Agamenon Magalhães assume o Ministério da Justiça, envolvido na discussão sobre a formação de partidos.",
    category: EventCategory.POLITICAL,
    characters: ["Agamenon Magalhães"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 70,
    year: 1943,
    title: "CLT",
    description: "Criação da Consolidação das Leis do Trabalho (CLT).",
    category: EventCategory.LEGISLATION,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 71,
    year: 1944,
    title: "Campanha eleitoral de Vargas",
    description: "O ano é caracterizado como de 'campanha eleitoral' de Vargas, com o Ministério do Trabalho articulando a organização política dos trabalhadores.",
    category: EventCategory.POLITICAL,
    characters: ["Getúlio Vargas"],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 72,
    year: 1944,
    title: "Instituto de Direito, Medicina e Seguro Social",
    description: "Criação do Instituto de Direito, Medicina e Seguro Social.",
    category: EventCategory.SOCIAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 73,
    year: 1944,
    title: "Definição dos partidos situacionistas",
    description: "Discussão e definição do formato dos partidos situacionistas PSD e PTB.",
    category: EventCategory.POLITICAL,
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 74,
    year: 1945,
    title: "Dutra candidato",
    description: "Definição de Eurico Gaspar Dutra como candidato à presidência pelo PSD, com o PTB reunindo as novas lideranças sindicais ligadas a Vargas.",
    category: EventCategory.POLITICAL,
    characters: ["Eurico Gaspar Dutra", "Getúlio Vargas"],
    source: "A Invenção do Trabalhismo"
  }
];

export const invencaoPeriods: TimelinePeriod[] = [
  {
    id: 1,
    startYear: 1890,
    endYear: 1904,
    title: "Final do Século XIX e Início da República",
    description: "Período marcado pelo início da luta operária e formação das primeiras organizações de trabalhadores.",
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 2,
    startYear: 1900,
    endYear: 1910,
    title: "Primeira Década do Século XX",
    description: "Crescimento das organizações sindicais e primeiras grandes greves.",
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 3,
    startYear: 1910,
    endYear: 1920,
    title: "Década de 1910",
    description: "Intensificação das greves e surgimento de movimentos nacionalistas.",
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 4,
    startYear: 1920,
    endYear: 1930,
    title: "Década de 1920",
    description: "Fundação do PCB e intensificação da repressão ao movimento operário.",
    source: "A Invenção do Trabalhismo"
  },
  {
    id: 5,
    startYear: 1930,
    endYear: 1945,
    title: "Era Vargas",
    description: "Criação da legislação trabalhista e incorporação dos sindicatos ao Estado.",
    source: "A Invenção do Trabalhismo"
  }
];

export const invencaoCharacters: Character[] = [
  {
    id: "angela_gomes",
    name: "Angela Maria de Castro Gomes",
    description: "Autora do livro 'A invenção do trabalhismo', cuja perspectiva orienta a análise sobre a construção da identidade política da classe trabalhadora no Brasil.",
    relatedEvents: [],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "getulio_vargas",
    name: "Getúlio Vargas",
    description: "Presidente do Brasil durante a Revolução de 1930 e o Estado Novo (1937-1945). Figura central na construção do trabalhismo como ideologia política e na implementação da legislação social. Apresentado como o 'pai dos pobres' e líder clarividente.",
    relatedEvents: [36, 49, 51, 54, 64, 67, 71, 74],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "marcondes_filho",
    name: "Alexandre Marcondes Filho",
    description: "Ministro do Trabalho, Indústria e Comércio durante o Estado Novo. Desempenhou papel crucial na divulgação da legislação social através de programas radiofônicos ('Falando aos Trabalhadores Brasileiros') e na organização do trabalho sob a égide do Estado, buscando a adesão da classe trabalhadora ao regime. Foi um dos artífices da estratégia política continuísta do governo.",
    relatedEvents: [54, 63],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "benjamin_constant",
    name: "Benjamin Constant",
    description: "Ministro da Guerra nos primeiros anos da República, a quem o Apostolado Positivista tentou apresentar uma pauta de direitos sociais.",
    relatedEvents: [2],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "vinhaes",
    name: "Vinhaes",
    description: "Líder operário e figura proeminente no Centro do Partido Operário (CPO) no Rio de Janeiro nos primeiros anos da República. Eleito à Constituinte em 1890. Defendia a organização política dos trabalhadores e a busca por direitos através da participação institucional.",
    relatedEvents: [3, 4, 5, 7],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "franca_silva",
    name: "França e Silva",
    description: "Outro líder operário que liderou uma facção rival à de Vinhaes dentro do movimento operário nos primeiros anos da República.",
    relatedEvents: [4],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "evaristo_moraes",
    name: "Evaristo de Moraes",
    description: "Advogado que atuou como propagandista da facção de França e Silva e posteriormente se tornou uma importante voz na discussão da questão social, inclusive colaborando com jornais operários.",
    relatedEvents: [],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "alcindo_guanabara",
    name: "Alcindo Guanabara",
    description: "Figura do movimento jacobino no Rio de Janeiro, defensor de um governo republicano forte e centralizador, preso em 1897.",
    relatedEvents: [9],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "barbosa_lima",
    name: "Barbosa Lima",
    description: "Figura do movimento jacobino no Rio de Janeiro, defensor de um governo republicano forte e centralizador, preso em 1897.",
    relatedEvents: [9],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "lauro_sodre",
    name: "Lauro Sodré",
    description: "Figura do movimento jacobino no Rio de Janeiro, defensor de um governo republicano forte e centralizador, preso em 1897.",
    relatedEvents: [9],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "mariano_garcia",
    name: "Mariano Garcia",
    description: "Jornalista e líder socialista que atuou no início do século XX, fundando a Gazeta Operária.",
    relatedEvents: [13],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "vicente_souza",
    name: "Vicente de Souza",
    description: "Outro líder socialista e colaborador da Gazeta Operária, defensor da organização política dos trabalhadores.",
    relatedEvents: [13],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "neno_vasco",
    name: "Neno Vasco",
    description: "Pensador anarquista português cujos textos foram importantes na divulgação da doutrina no Brasil, defendendo o 'socialismo anarquista' como a abolição da propriedade privada e do Estado.",
    relatedEvents: [17],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "carlos_dias",
    name: "Carlos Dias",
    description: "Militante anarquista que participou do debate sobre a conduta e a moral dos militantes e o significado da 'ação direta'.",
    relatedEvents: [17],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "manuel_moscoso",
    name: "Manuel Moscoso",
    description: "Militante anarquista que participou do debate sobre a conduta e a moral dos militantes e o significado da 'ação direta'.",
    relatedEvents: [17],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "joao_arzua",
    name: "João Arzua",
    description: "Militante anarquista que participou do debate sobre a conduta e a moral dos militantes e o significado da 'ação direta'. Foi editor de Guerra Social.",
    relatedEvents: [17],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "muller_reis",
    name: "Müller dos Reis",
    description: "Comandante do Lloyd Brasileiro e presidente da Federação Marítima Brasileira, entidade que representava trabalhadores do porto do Rio e possuía uma orientação política mais pragmática.",
    relatedEvents: [23, 24],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "saddock_sa",
    name: "Saddock de Sá",
    description: "Dirigente do Centro do Partido Operário (CPO) e figura ligada a setores cooperativistas do movimento operário.",
    relatedEvents: [24],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "otavio_brandao",
    name: "Otávio Brandão",
    description: "Militante que chegou ao Rio em 1919 e inicialmente aderiu ao anarquismo, ilustrando o dilema enfrentado por muitos trabalhadores entre o apoio ao governo e a adesão ao anarquismo.",
    relatedEvents: [26, 33],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "astrogildo_pereira",
    name: "Astrogildo Pereira",
    description: "Militante que escreveu artigos com inspiração 'bolchevista' criticando os métodos anarquistas em 1921.",
    relatedEvents: [30],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "minervino_oliveira",
    name: "Minervino de Oliveira",
    description: "Candidato do Bloco Operário (posteriormente BOC) ao Conselho Municipal do Rio de Janeiro em 1928, ao lado de Otávio Brandão.",
    relatedEvents: [33],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "olavo_bilac",
    name: "Olavo Bilac",
    description: "Escritor e figura pública que iniciou campanha nacionalista a partir de 1915, defendendo o serviço militar obrigatório como forma de educação cívica e solidariedade nacional.",
    relatedEvents: [20],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "agamenon_magalhaes",
    name: "Agamenon Magalhães",
    description: "Ministro da Justiça no final do Estado Novo, responsável por conduzir a elaboração do Código Eleitoral e a discussão sobre a formação de partidos políticos para a redemocratização.",
    relatedEvents: [69],
    source: "A Invenção do Trabalhismo"
  },
  {
    id: "eurico_dutra",
    name: "Eurico Gaspar Dutra",
    description: "Candidato à presidência da República apoiado pelo Partido Social Democrático (PSD), cuja candidatura foi definida no início de 1945.",
    relatedEvents: [74],
    source: "A Invenção do Trabalhismo"
  }
];
