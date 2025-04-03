import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';

export const brasilTimelineSource: SourceInfo = {
  id: 'brasil_timeline',
  name: 'Brasil Timeline',
  author: 'Your Name', // Replace with the actual author
  color: '#26A69A', // Teal 500
  description: 'A comprehensive timeline of Brazilian history, covering major events and periods.'
};

export const brasilTimelineSources: SourceInfo[] = [
  brasilTimelineSource,
];

export const brasilTimelineEvents: TimelineEvent[] = [
  {
    id: 10001,
    year: 1500,
    month: 4,
    day: 22,
    title: 'Chegada dos Portugueses ao Brasil',
    description: 'A frota de Pedro Álvares Cabral chega à costa do Brasil, marcando o início da colonização portuguesa.',
    category: EventCategory.COLONIZATION,
    source: brasilTimelineSource.name,
    characters: ['Pedro Álvares Cabral']
  } as TimelineEvent,
  {
    id: 10002,
    year: 1532,
    title: 'Início da Colonização Portuguesa',
    description: 'Martim Afonso de Sousa funda a primeira vila portuguesa no Brasil, São Vicente, e inicia a exploração da colônia.',
    category: EventCategory.COLONIZATION,
    source: brasilTimelineSource.name,
    characters: ['Martim Afonso de Sousa']
  } as TimelineEvent,
  {
    id: 10003,
    year: 1549,
    title: 'Governo-Geral do Brasil',
    description: 'Tomé de Sousa é nomeado o primeiro Governador-Geral do Brasil, centralizando a administração da colônia.',
    category: EventCategory.POLITICAL,
    source: brasilTimelineSource.name,
    characters: ['Tomé de Sousa']
  } as TimelineEvent,
  {
    id: 10004,
    year: 1580,
    title: 'União Ibérica',
    description: 'A Coroa Portuguesa é unida à Coroa Espanhola, e o Brasil passa a ser administrado pela Espanha.',
    category: EventCategory.POLITICAL,
    source: brasilTimelineSource.name,
    characters: ['Filipe II de Espanha']
  } as TimelineEvent,
  {
    id: 10005,
    year: 1624,
    title: 'Invasão Holandesa',
    description: 'A Companhia Holandesa das Índias Ocidentais invade o Brasil e ocupa parte do Nordeste, estabelecendo o Brasil Holandês.',
    category: EventCategory.INTERNATIONAL,
    source: brasilTimelineSource.name,
    characters: ['João Maurício de Nassau']
  } as TimelineEvent,
  {
    id: 10006,
    year: 1654,
    title: 'Expulsão dos Holandeses',
    description: 'Os portugueses expulsam os holandeses do Brasil, restaurando o controle português sobre todo o território.',
    category: EventCategory.INTERNATIONAL,
    source: brasilTimelineSource.name
  } as TimelineEvent,
  {
    id: 10007,
    year: 1759,
    title: 'Expulsão dos Jesuítas',
    description: 'O Marquês de Pombal expulsa os jesuítas do Brasil e de Portugal, confiscando seus bens e reformando a educação.',
    category: EventCategory.POLITICAL,
    source: brasilTimelineSource.name,
    characters: ['Marquês de Pombal']
  } as TimelineEvent,
  {
    id: 10008,
    year: 1789,
    title: 'Inconfidência Mineira',
    description: 'Conjuração liderada por Tiradentes em Minas Gerais, buscando a independência do Brasil. Fracassa e Tiradentes é executado.',
    category: EventCategory.POLITICAL,
    source: brasilTimelineSource.name,
    characters: ['Tiradentes']
  } as TimelineEvent,
  {
    id: 10009,
    year: 1808,
    title: 'Chegada da Família Real',
    description: 'A Família Real Portuguesa, liderada por D. João VI, foge de Portugal para o Brasil devido à invasão napoleônica.',
    category: EventCategory.POLITICAL,
    source: brasilTimelineSource.name,
    characters: ['D. João VI']
  } as TimelineEvent,
  {
    id: 10010,
    year: 1822,
    month: 9,
    day: 7,
    title: 'Independência do Brasil',
    description: 'D. Pedro I declara a Independência do Brasil, tornando-se o primeiro Imperador do Brasil.',
    category: EventCategory.POLITICAL,
    source: brasilTimelineSource.name,
    characters: ['D. Pedro I']
  } as TimelineEvent,
  {
    id: 10011,
    year: 1824,
    title: 'Primeira Constituição',
    description: 'D. Pedro I outorga a Primeira Constituição do Brasil, estabelecendo uma monarquia constitucional.',
    category: EventCategory.LEGISLATION,
    source: brasilTimelineSource.name,
    characters: ['D. Pedro I']
  } as TimelineEvent,
  {
    id: 10012,
    year: 1831,
    title: 'Abdicação de D. Pedro I',
    description: 'D. Pedro I abdica do trono brasileiro e retorna a Portugal.',
    category: EventCategory.POLITICAL,
    source: brasilTimelineSource.name,
    characters: ['D. Pedro I']
  } as TimelineEvent,
  {
    id: 10013,
    year: 1840,
    title: 'Golpe da Maioridade',
    description: 'D. Pedro II é declarado maior de idade e assume o trono, pondo fim ao Período Regencial.',
    category: EventCategory.POLITICAL,
    source: brasilTimelineSource.name,
    characters: ['D. Pedro II']
  } as TimelineEvent,
  {
    id: 10014,
    year: 1888,
    month: 5,
    day: 13,
    title: 'Abolição da Escravidão',
    description: 'A Lei Áurea é promulgada, abolindo a escravidão no Brasil.',
    category: EventCategory.LEGISLATION,
    source: brasilTimelineSource.name,
    characters: ['Princesa Isabel']
  } as TimelineEvent,
  {
    id: 10015,
    year: 1889,
    month: 11,
    day: 15,
    title: 'Proclamação da República',
    description: 'A República é proclamada no Brasil, pondo fim à monarquia e instaurando um regime republicano.',
    category: EventCategory.POLITICAL,
    source: brasilTimelineSource.name,
    characters: ['Marechal Deodoro da Fonseca']
  } as TimelineEvent,
  {
    id: 10016,
    year: 1891,
    title: 'Constituição Republicana',
    description: 'Promulgada a primeira Constituição Republicana do Brasil.',
    category: EventCategory.LEGISLATION,
    source: brasilTimelineSource.name
  } as TimelineEvent,
  {
    id: 10017,
    year: 1930,
    title: 'Revolução de 1930',
    description: 'Getúlio Vargas lidera a Revolução de 1930, que depõe o presidente Washington Luís e instaura um novo regime político.',
    category: EventCategory.POLITICAL,
    source: brasilTimelineSource.name,
    characters: ['Getúlio Vargas']
  } as TimelineEvent,
  {
    id: 10018,
    year: 1937,
    title: 'Estado Novo',
    description: 'Getúlio Vargas instaura o Estado Novo, um regime ditatorial que duraria até 1945.',
    category: EventCategory.POLITICAL,
    source: brasilTimelineSource.name,
    characters: ['Getúlio Vargas']
  } as TimelineEvent,
  {
    id: 10019,
    year: 1942,
    title: 'Brasil na II Guerra Mundial',
    description: 'O Brasil declara guerra à Alemanha e Itália e envia tropas para lutar na II Guerra Mundial.',
    category: EventCategory.INTERNATIONAL,
    source: brasilTimelineSource.name
  } as TimelineEvent,
  {
    id: 10020,
    year: 1945,
    title: 'Fim do Estado Novo',
    description: 'Com o fim da II Guerra Mundial, o Estado Novo chega ao fim e o Brasil retorna à democracia.',
    category: EventCategory.POLITICAL,
    source: brasilTimelineSource.name
  } as TimelineEvent,
];

export const brasilTimelinePeriods: TimelinePeriod[] = [
  {
    id: 20001,
    startYear: 1500,
    endYear: 1822,
    title: 'Brasil Colonial',
    description: 'Período da história do Brasil que se estende da chegada dos portugueses em 1500 até a Independência em 1822.',
    source: brasilTimelineSource.name
  } as TimelinePeriod,
  {
    id: 20002,
    startYear: 1822,
    endYear: 1889,
    title: 'Brasil Imperial',
    description: 'Período da história do Brasil que se estende da Independência em 1822 até a Proclamação da República em 1889.',
    source: brasilTimelineSource.name
  } as TimelinePeriod,
  {
    id: 20003,
    startYear: 1889,
    endYear: 1945,
    title: 'República Velha e Era Vargas',
    description: 'Período da história republicana brasileira, desde a Proclamação da República em 1889 até o fim do Estado Novo em 1945, incluindo a República Velha e a Era Vargas.',
    source: brasilTimelineSource.name
  } as TimelinePeriod,
];

export const brasilTimelineCharacters: Character[] = [
  {
    id: 'pedro_alvares_cabral',
    name: 'Pedro Álvares Cabral',
    description: 'Comandante da expedição portuguesa que chegou ao Brasil em 1500.',
    relatedEvents: [10001],
    source: brasilTimelineSource.name
  },
  {
    id: 'martim_afonso_de_sousa',
    name: 'Martim Afonso de Sousa',
    description: 'Fundador da primeira vila portuguesa no Brasil, São Vicente.',
    relatedEvents: [10002],
    source: brasilTimelineSource.name
  },
  {
    id: 'tome_de_sousa',
    name: 'Tomé de Sousa',
    description: 'Primeiro Governador-Geral do Brasil.',
    relatedEvents: [10003],
    source: brasilTimelineSource.name
  },
  {
    id: 'filipe_ii_espanha',
    name: 'Filipe II de Espanha',
    description: 'Rei da Espanha que se tornou também Rei de Portugal durante a União Ibérica.',
    relatedEvents: [10004],
    source: brasilTimelineSource.name
  },
  {
    id: 'joao_mauricio_de_nassau',
    name: 'João Maurício de Nassau',
    description: 'Administrador do Brasil Holandês.',
    relatedEvents: [10005],
    source: brasilTimelineSource.name
  },
  {
    id: 'marques_de_pombal',
    name: 'Marquês de Pombal',
    description: 'Ministro português que reformou a administração e expulsou os jesuítas.',
    relatedEvents: [10007],
    source: brasilTimelineSource.name
  },
  {
    id: 'tiradentes',
    name: 'Tiradentes',
    description: 'Líder da Inconfidência Mineira, mártir da independência do Brasil.',
    relatedEvents: [10008],
    source: brasilTimelineSource.name
  },
  {
    id: 'd_joao_vi',
    name: 'D. João VI',
    description: 'Príncipe Regente e depois Rei de Portugal que transferiu a corte para o Brasil.',
    relatedEvents: [10009],
    source: brasilTimelineSource.name
  },
  {
    id: 'd_pedro_i',
    name: 'D. Pedro I',
    description: 'Primeiro Imperador do Brasil, declarou a independência.',
    relatedEvents: [10010, 10011, 10012],
    source: brasilTimelineSource.name
  },
  {
    id: 'd_pedro_ii',
    name: 'D. Pedro II',
    description: 'Segundo e último Imperador do Brasil.',
    relatedEvents: [10013],
    source: brasilTimelineSource.name
  },
  {
    id: 'princesa_isabel',
    name: 'Princesa Isabel',
    description: 'Princesa Imperial do Brasil que assinou a Lei Áurea.',
    relatedEvents: [10014],
    source: brasilTimelineSource.name
  },
  {
    id: 'marechal_deodoro_da_fonseca',
    name: 'Marechal Deodoro da Fonseca',
    description: 'Primeiro Presidente do Brasil, proclamou a República.',
    relatedEvents: [10015],
    source: brasilTimelineSource.name
  },
  {
    id: 'getulio_vargas',
    name: 'Getúlio Vargas',
    description: 'Presidente do Brasil em dois períodos, liderou a Revolução de 1930 e instaurou o Estado Novo.',
    relatedEvents: [10017, 10018],
    source: brasilTimelineSource.name
  }
];
