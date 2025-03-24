import { TimelineEvent, TimelinePeriod, Character, EventCategory } from './types';

export const urbanizacaoEvents: TimelineEvent[] = [
  {
    id: 126,
    century: "XVI",
    endYear: 1720,
    title: "Formação da rede urbana brasileira",
    description: "Período de formação da rede urbana brasileira.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 127,
    startYear: 1530,
    endYear: 1570,
    title: "Primeira fase de organização do território",
    description: "Primeira fase de organização do território, com ênfase na fundação de cidades costeiras.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 128,
    startYear: 1530,
    endYear: 1540,
    title: "Pico de fundações de cidades",
    description: "Pico de fundações de cidades.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 129,
    year: 1567,
    title: "Fundação do Rio de Janeiro",
    description: "Fundação do Rio de Janeiro.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 130,
    startYear: 1580,
    endYear: 1640,
    title: "Dominação Espanhola e Urbanização Sistemática",
    description: "Dominação Espanhola. Urbanização sistemática na costa norte, em direção à Amazônia.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 131,
    startYear: 1610,
    endYear: 1620,
    title: "Fundação de vila e cidades",
    description: "Fundação de uma vila e três cidades.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 132,
    startYear: 1630,
    endYear: 1640,
    title: "Fundação de nove vilas",
    description: "Fundação de nove vilas.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 133,
    startYear: 1650,
    endYear: 1720,
    title: "Fundação de trinta e cinco vilas",
    description: "Fundação de trinta e cinco vilas. Elevação de Olinda e São Paulo à categoria de cidade.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 134,
    century: "XVIII",
    title: "Expansão urbana ligada à agricultura e mineração",
    description: "Expansão da agricultura comercial (cana-de-açúcar) e exploração mineral. Surgimento de cidades no litoral e no interior.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 135,
    century: "XIX",
    title: "São Paulo como pólo dinâmico",
    description: "Segunda metade do século XIX: São Paulo se torna pólo dinâmico com a produção de café. Implantação de ferrovias, melhoria dos portos e meios de comunicação. Influxo do comércio internacional e instalação de formas capitalistas de produção. Crescimento regional limitado ao Sul e Sudeste.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 136,
    startYear: 1900,
    endYear: 1930,
    title: "Crescimento lento das capitais",
    description: "Início do Século XX - Década de 1930: Crescimento lento das capitais.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 137,
    startYear: 1930,
    endYear: 1940,
    title: "Nova fase de industrialização",
    description: "Década de 1930: Nova fase de industrialização impulsionada pelo poder público.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 138,
    startYear: 1940,
    endYear: 1950,
    title: "Industrialização e urbanização nacional",
    description: "1940-1950: A industrialização e a formação de um mercado nacional impulsionam a urbanização em todo o território. Crescimento demográfico das cidades médias e maiores. Urbanização mais abrangente.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 139,
    year: 1940,
    title: "Urbanização similar na Amazônia e Sul",
    description: "1940: Índices de urbanização similares entre a Amazônia e o Sul, mas com causas distintas. Amazônia: herança da exploração da borracha e macrocefalia urbana. Sul e Sudeste: Rede urbana mais desenvolvida e interação entre as cidades.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 140,
    startYear: 1960,
    endYear: 1964,
    title: "Integração à economia internacional",
    description: "1960-1964: Integração do Brasil à internacionalização da economia. Expansão industrial e modernização agrícola. Fim da importância das economias de subsistência. Intensificação e qualificação da urbanização. Difusão da modernização e do meio técnico-científico.",
    category: EventCategory.ECONOMIC,
    source: "A Urbanização Brasileira"
  },
  {
    id: 141,
    year: 1964,
    title: "Golpe militar e aceleração da internacionalização",
    description: "Após 1964: O golpe militar acelera a internacionalização da economia. Concentração das atividades modernas. Expansão do capitalismo e da classe média. Surgimento de uma demanda de consumo diversificada.",
    category: EventCategory.POLITICAL,
    source: "A Urbanização Brasileira"
  },
  {
    id: 142,
    startYear: 1975, // Último quartel do século XX = 1975-2000
    endYear: 2000,
    title: "Ruptura no uso do território",
    description: "Último quartel do século XX: Ruptura na forma de utilizar o território. Maciça adição de capital fixo ao território. Domínio do capital sobre o trabalho. Diferenças sociais se tornam mais importantes que as naturais. Critérios para uma divisão regional: estrutura fundiária, relações de trabalho, densidade do capital e dos sistemas técnicos.",
    category: EventCategory.ECONOMIC,
    source: "A Urbanização Brasileira"
  },
  {
    id: 143,
    endYear: 2000, // Final do Século XX = 2000
    title: "Consolidação do mercado segmentado",
    description: "Final do Século XX: Consolidação do Brasil como mercado único, porém segmentado e hierarquizado. São Paulo se consolida como metrópole nacional, centralizando atividades intelectuais e produção de ponta. Presença constante e instantânea da metrópole em todo o território graças à informatização. Especulação imobiliária e crescimento das periferias.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  },
  {
    id: 144,
    startYear: 1970,
    endYear: 1990, // Anos 1970-1980 + Anos 1990
    title: "Intensificação e complexificação da urbanização",
    description: "Anos 1970-1980: Intensificação da urbanização em todo o país, em níveis e formas diferentes. Crescimento das cidades médias. Adaptação das cidades preexistentes às demandas do mundo rural. Tendência de transformação de cidades dependentes do espaço agrícola em regiões urbanas. Diferenciação e complexificação da rede urbana. Anos 1990: Projeção de intensificação da urbanização, especialmente no Nordeste. Superação das dicotomias tradicionais (dois Brasis, urbano-rural). Emergência de um Brasil urbano (meio técnico-científico) e um Brasil agrícola. Crescimento das metrópoles regionais e intensificação das relações interurbanas. Processos de metropolização e desmetropolização. 'Involução' das grandes metrópoles e melhoria da qualidade de vida nas cidades médias. São Paulo como metrópole relacional, centralizando a informação.",
    category: EventCategory.URBANIZATION,
    source: "A Urbanização Brasileira"
  }
];

export const urbanizacaoPeriods: TimelinePeriod[] = [
  {
    id: 8,
    startYear: 1500,
    endYear: 1822,
    title: "Período Colonial",
    description: "Período Colonial (1500-1822)",
    source: "A Urbanização Brasileira"
  },
  {
    id: 9,
    startYear: 1800,
    endYear: 1900,
    title: "Século XIX",
    description: "Século XIX",
    source: "A Urbanização Brasileira"
  },
  {
    id: 10,
    startYear: 1900,
    endYear: 2000,
    title: "Século XX",
    description: "Século XX",
    source: "A Urbanização Brasileira"
  }
];

export const urbanizacaoCharacters: Character[] = [
  {
    id: "milton_santos",
    name: "Milton Santos",
    description: "Geógrafo brasileiro, autor do livro 'A Urbanização Brasileira' (1993). Defensor do conceito de 'meio técnico-científico-informacional'.",
    relatedEvents: [],
    source: "A Urbanização Brasileira"
  },
  {
    id: "nestor_goulart_reis",
    name: "Nestor Goulart Reis",
    description: "Historiador brasileiro, estudou a organização do território brasileiro entre 1500 e 1720.",
    relatedEvents: [126, 127],
    source: "A Urbanização Brasileira"
  },
  {
    id: "aroldo_de_azevedo",
    name: "Aroldo de Azevedo",
    description: "Geógrafo e historiador brasileiro, reconstruiu a genealogia das cidades e vilas do Brasil Colonial.",
    relatedEvents: [126, 127],
    source: "A Urbanização Brasileira"
  },
  {
    id: "darcy_ribeiro",
    name: "Darcy Ribeiro",
    description: "Antropólogo, escritor e político brasileiro, convidou Milton Santos para colaborar em um projeto sobre a urbanização brasileira no INEP.",
    relatedEvents: [],
    source: "A Urbanização Brasileira"
  },
  {
    id: "marcos_formiga",
    name: "Marcos Formiga",
    description: "Diretor do INEP durante o projeto sobre urbanização liderado por Darcy Ribeiro.",
    relatedEvents: [],
    source: "A Urbanização Brasileira"
  },
  {
    id: "denise_s_elias",
    name: "Denise S. Elias",
    description: "Geógrafa, colaborou com Milton Santos no estudo da urbanização brasileira entre 1872 e 1980.",
    relatedEvents: [],
    source: "A Urbanização Brasileira"
  },
  {
    id: "cilene_gomes",
    name: "Cilene Gomes",
    description: "Arquiteta, realizou estudo sobre o setor de serviços na economia brasileira, utilizando dados estatísticos.",
    relatedEvents: [],
    source: "A Urbanização Brasileira"
  },
  {
    id: "jr_amaral_lapa",
    name: "J. R. Amaral Lapa",
    description: "Autor citado por Milton Santos, defendia uma visão multidisciplinar para a compreensão da realidade social.",
    relatedEvents: [],
    source: "A Urbanização Brasileira"
  },
  {
    id: "roberto_lobato_correa",
    name: "Roberto Lobato Corrêa",
    description: "Geógrafo brasileiro, estudou o fenômeno da macrocefalia urbana na Amazônia e a dinâmica das grandes empresas no território.",
    relatedEvents: [139],
    source: "A Urbanização Brasileira"
  },
  {
    id: "jean_hebette",
    name: "Jean Hébette",
    description: "Pesquisador que estudou o impacto do crédito rural na Amazônia.",
    relatedEvents: [139],
    source: "A Urbanização Brasileira"
  },
  {
    id: "maria_celia_nunes_coelho",
    name: "Maria Célia Nunes Coelho",
    description: "Autora de um estudo sobre a função dos núcleos urbanos na Amazônia.",
    relatedEvents: [139],
    source: "A Urbanização Brasileira"
  },
  {
    id: "raymundo_garcia",
    name: "Raymundo Garcia",
    description: "Autor de um estudo sobre a função dos núcleos urbanos na Amazônia.",
    relatedEvents: [139],
    source: "A Urbanização Brasileira"
  },
  {
    id: "aldo_paviani",
    name: "Aldo Paviani",
    description: "Estudou as cidades satélites de Brasília.",
    relatedEvents: [],
    source: "A Urbanização Brasileira"
  },
  {
    id: "maria_adelia_de_souza",
    name: "Maria Adélia de Souza",
    description: "Geógrafa brasileira, utilizou o termo 'macrometrópole paulista'.",
    relatedEvents: [143, 144],
    source: "A Urbanização Brasileira"
  },
  {
    id: "mc_linardi",
    name: "M. C. Linardi",
    description: "Estudou as cidades do norte do Paraná e suas funções interdependentes.",
    relatedEvents: [],
    source: "A Urbanização Brasileira"
  },
  {
    id: "jr_langenbuch",
    name: "J. R. Langenbuch",
    description: "Autor que definiu a metrópole como um tipo especial de cidade.",
    relatedEvents: [143, 144],
    source: "A Urbanização Brasileira"
  },
  {
    id: "ph_aydalot",
    name: "Ph. Aydalot",
    description: "Autor que estudou a dinâmica das grandes empresas e a expansão do espaço por elas controlado.",
    relatedEvents: [142],
    source: "A Urbanização Brasileira"
  },
  {
    id: "rainer_randolph",
    name: "Rainer Randolph",
    description: "Autor que observou a relação entre o crescimento das empresas e a necessidade de ampliação de suas áreas de atuação.",
    relatedEvents: [142],
    source: "A Urbanização Brasileira"
  },
  {
    id: "s_gertel",
    name: "S. Gertel",
    description: "Autor que analisou a presença de São Paulo em todo o território brasileiro através da informatização.",
    relatedEvents: [143, 144],
    source: "A Urbanização Brasileira"
  },
  {
    id: "jacques_lambert",
    name: "Jacques Lambert",
    description: "Autor que propôs a dicotomia dos 'dois Brasis'.",
    relatedEvents: [144],
    source: "A Urbanização Brasileira"
  },
  {
    id: "helio_jaguaribe",
    name: "Hélio Jaguaribe",
    description: "Cientista político brasileiro, autor de 'Reforma ou Caos', utilizou a dicotomia entre Brasil urbano e Brasil rural.",
    relatedEvents: [144],
    source: "A Urbanização Brasileira"
  }
];
