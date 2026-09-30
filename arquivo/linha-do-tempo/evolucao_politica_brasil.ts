import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';

export const evolucaoPoliticaBrasilSource: SourceInfo = {
  id: 'evolucao_politica_brasil',
  name: 'Evolução Política do Brasil',
  author: 'Boris Fausto',
  color: '#FF7043', // Deep Orange 500
  description: 'Análise da evolução política do Brasil por Boris Fausto, desde a colônia até a república.'
};

export const evolucaoPoliticaBrasilSources: SourceInfo[] = [
  evolucaoPoliticaBrasilSource,
];

export const evolucaoPoliticaBrasilEvents: TimelineEvent[] = [
  {
    id: 60001,
    year: 1500,
    month: 4,
    day: 22,
    title: 'Chegada de Cabral',
    description: 'Chegada da esquadra de Cabral a Porto Seguro; primeiro contato dos portugueses com os nativos.',
    category: EventCategory.COLONIZATION,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Pedro Álvares Cabral']
  } as TimelineEvent,
  {
    id: 60002,
    year: 1501,
    title: 'Expedição de Gaspar de Lemos',
    description: 'Expedição de reconhecimento da costa brasileira, comandada por Gaspar de Lemos; batismo da terra como Brasil.',
    category: EventCategory.EXPLORATION,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Gaspar de Lemos']
  } as TimelineEvent,
  {
    id: 60003,
    year: 1503,
    title: 'Primeira Feitoria',
    description: 'Construção da primeira feitoria portuguesa no Brasil, em Cabo Frio.',
    category: EventCategory.ECONOMIC,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60004,
    startYear: 1534,
    endYear: 1536,
    title: 'Capitanias Hereditárias',
    description: 'Implantação do sistema de capitanias hereditárias, divisão do Brasil em quatorze faixas entregues a donatários.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60005,
    year: 1549,
    title: 'Governo-Geral',
    description: 'Criação do Governo-Geral, com Tomé de Sousa como primeiro governador, para centralizar a administração da colônia.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Tomé de Sousa']
  } as TimelineEvent,
  {
    id: 60006,
    year: 1551,
    title: 'Criação do Bispado',
    description: 'Criação do primeiro bispado no Brasil, com sede em Salvador.',
    category: EventCategory.SOCIAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60007,
    year: 1553,
    title: 'Duarte da Costa Governador-Geral',
    description: 'Duarte da Costa assume como segundo governador-geral do Brasil.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Duarte da Costa']
  } as TimelineEvent,
  {
    id: 60008,
    year: 1555,
    title: 'Invasão Francesa no Rio',
    description: 'Franceses invadem a Baía de Guanabara, liderados por Nicolas Durand de Villegagnon, e fundam a França Antártica.',
    category: EventCategory.INTERNATIONAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Nicolas Durand de Villegagnon']
  } as TimelineEvent,
  {
    id: 60009,
    year: 1558,
    title: 'Mem de Sá Governador-Geral',
    description: 'Mem de Sá é nomeado terceiro governador-geral do Brasil.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Mem de Sá']
  } as TimelineEvent,
  {
    id: 60010,
    startYear: 1565,
    endYear: 1567,
    title: 'Expulsão dos Franceses',
    description: 'Expulsão dos franceses do Rio de Janeiro, com a ajuda de reforços militares e indígenas.',
    category: EventCategory.INTERNATIONAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60011,
    year: 1567,
    title: 'Fundação do Rio de Janeiro',
    description: 'Fundação da cidade do Rio de Janeiro por Estácio de Sá, consolidando a presença portuguesa.',
    category: EventCategory.URBANIZATION,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Estácio de Sá']
  } as TimelineEvent,
  {
    id: 60012,
    year: 1572,
    title: 'Divisão do Governo-Geral',
    description: 'Divisão do Governo-Geral em dois: Governo do Norte, com sede em Salvador, e Governo do Sul, com sede no Rio de Janeiro.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60013,
    year: 1578,
    title: 'Desastre de Alcácer-Quibir',
    description: 'Morte de D. Sebastião na batalha de Alcácer-Quibir e crise dinástica em Portugal.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['D. Sebastião']
  } as TimelineEvent,
  {
    id: 60014,
    year: 1580,
    title: 'União Ibérica',
    description: 'Filipe II da Espanha torna-se rei de Portugal, unindo as coroas e o Brasil à Espanha.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Filipe II de Espanha']
  } as TimelineEvent,
  {
    id: 60015,
    year: 1621,
    title: 'Criação do Estado do Brasil',
    description: 'Criação do Estado do Brasil e do Estado do Maranhão, dividindo administrativamente a colônia.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60016,
    startYear: 1624,
    endYear: 1625,
    title: 'Primeira Invasão Holandesa',
    description: 'Holandeses invadem Salvador, Bahia, mas são expulsos pela reação luso-espanhola.',
    category: EventCategory.INTERNATIONAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60017,
    startYear: 1630,
    endYear: 1654,
    title: 'Segunda Invasão Holandesa',
    description: 'Holandeses conquistam Pernambuco e expandem domínio sobre o Nordeste, estabelecendo o Brasil Holandês.',
    category: EventCategory.INTERNATIONAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60018,
    year: 1640,
    title: 'Restauração Portuguesa',
    description: 'Revolta em Portugal restaura a independência portuguesa e D. João IV torna-se rei.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['D. João IV']
  } as TimelineEvent,
  {
    id: 60019,
    year: 1641,
    title: 'Revolta de Beckman',
    description: 'Revolta dos colonos liderada por irmãos Beckman no Maranhão contra a Companhia de Comércio do Maranhão.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Irmãos Beckman']
  } as TimelineEvent,
  {
    id: 60020,
    year: 1654,
    title: 'Capitulação Holandesa',
    description: 'Holandeses capitulam e são expulsos do Brasil, restaurando o domínio português.',
    category: EventCategory.INTERNATIONAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60021,
    year: 1661,
    title: 'Entrega de Pernambuco',
    description: 'Portugal entrega oficialmente Pernambuco e o Brasil Holandês à Holanda em troca de indenização.',
    category: EventCategory.INTERNATIONAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60022,
    startYear: 1710,
    endYear: 1711,
    title: 'Guerra dos Emboabas',
    description: 'Conflito entre paulistas e "emboabas" (forasteiros) pela exploração do ouro em Minas Gerais.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60023,
    year: 1720,
    title: 'Criação da Capitania de Minas',
    description: 'Criação da Capitania de Minas Gerais, separando-a de São Paulo e Rio de Janeiro, para melhor controle da região aurífera.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60024,
    year: 1750,
    title: 'Tratado de Madri',
    description: 'Tratado de Madri define novas fronteiras entre Brasil e colônias espanholas, baseado no princípio do "uti possidetis".',
    category: EventCategory.INTERNATIONAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60025,
    year: 1751,
    title: 'Fim do Estado do Maranhão',
    description: 'Extinção do Estado do Maranhão e sua reincorporação ao Estado do Brasil.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60026,
    year: 1759,
    title: 'Expulsão dos Jesuítas',
    description: 'Expulsão dos jesuítas do Brasil e de Portugal por ordem do Marquês de Pombal.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Marquês de Pombal']
  } as TimelineEvent,
  {
    id: 60027,
    startYear: 1763,
    endYear: 1765,
    title: 'Transferência da Capital',
    description: 'Transferência da capital do Brasil de Salvador para o Rio de Janeiro, refletindo a importância econômica do Sudeste.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60028,
    year: 1789,
    title: 'Inconfidência Mineira',
    description: 'Conjuração Mineira, revolta separatista em Minas Gerais, liderada por Tiradentes.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Tiradentes']
  } as TimelineEvent,
  {
    id: 60029,
    year: 1798,
    title: 'Conjuração Baiana',
    description: 'Conjuração Baiana, revolta popular em Salvador com caráter social e influências da Revolução Francesa.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60030,
    year: 1808,
    title: 'Chegada da Família Real',
    description: 'Chegada da família real portuguesa ao Rio de Janeiro, fugindo das tropas napoleônicas.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['D. João VI']
  } as TimelineEvent,
  {
    id: 60031,
    year: 1815,
    title: 'Elevação a Reino Unido',
    description: 'Elevação do Brasil a Reino Unido de Portugal, Brasil e Algarves, durante o Congresso de Viena.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60032,
    year: 1817,
    title: 'Revolução Pernambucana',
    description: 'Revolução Pernambucana, movimento separatista e republicano em Pernambuco.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60033,
    year: 1820,
    title: 'Revolução Liberal do Porto',
    description: 'Revolução Liberal do Porto, em Portugal, exige o retorno da família real e o fim do absolutismo.',
    category: EventCategory.INTERNATIONAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60034,
    year: 1821,
    title: 'Retorno de D. João VI',
    description: 'Retorno de D. João VI a Portugal, pressionado pela Revolução Liberal do Porto.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['D. João VI']
  } as TimelineEvent,
  {
    id: 60035,
    year: 1822,
    month: 9,
    day: 7,
    title: 'Independência do Brasil',
    description: 'D. Pedro proclama a Independência do Brasil, rompendo com Portugal.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['D. Pedro I']
  } as TimelineEvent,
  {
    id: 60036,
    year: 1823,
    title: 'Constituinte e Confederação do Equador',
    description: 'Dissolução da Assembleia Constituinte e eclosão da Confederação do Equador, revolta republicana no Nordeste.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60037,
    year: 1824,
    title: 'Primeira Constituição',
    description: 'Outorga da primeira Constituição do Império, de caráter autoritário e centralizador.',
    category: EventCategory.LEGISLATION,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60038,
    startYear: 1825,
    endYear: 1828,
    title: 'Guerra da Cisplatina',
    description: 'Guerra da Cisplatina, conflito com a Argentina pela posse da Província Cisplatina (futuro Uruguai).',
    category: EventCategory.INTERNATIONAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60039,
    year: 1831,
    title: 'Abdicação de D. Pedro I',
    description: 'Abdicação de D. Pedro I em favor de seu filho D. Pedro II, início do Período Regencial.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['D. Pedro I']
  } as TimelineEvent,
  {
    id: 60040,
    startYear: 1831,
    endYear: 1840,
    title: 'Período Regencial',
    description: 'Período Regencial, fase de instabilidade política e revoltas internas, como a Cabanagem, Farroupilha, Sabinada e Balaiada.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60041,
    year: 1840,
    title: 'Golpe da Maioridade',
    description: 'Golpe da Maioridade antecipa a maioridade de D. Pedro II, que assume o trono aos 14 anos.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['D. Pedro II']
  } as TimelineEvent,
  {
    id: 60042,
    year: 1847,
    title: 'Parlamentarismo às Avessas',
    description: 'Criação do Parlamentarismo às Avessas, no qual o Imperador controlava o gabinete ministerial.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60043,
    startYear: 1850,
    endYear: 1852,
    title: 'Revolução Praieira',
    description: 'Revolução Praieira, última grande revolta regencial, em Pernambuco, com caráter liberal e social.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60044,
    startYear: 1864,
    endYear: 1870,
    title: 'Guerra do Paraguai',
    description: 'Guerra do Paraguai, maior conflito militar da história do Brasil, contra o Paraguai de Solano López.',
    category: EventCategory.INTERNATIONAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60045,
    year: 1888,
    month: 5,
    day: 13,
    title: 'Abolição da Escravidão',
    description: 'Abolição da escravidão no Brasil com a Lei Áurea.',
    category: EventCategory.LEGISLATION,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60046,
    year: 1889,
    month: 11,
    day: 15,
    title: 'Proclamação da República',
    description: 'Proclamação da República, golpe militar que derruba a monarquia e instaura a República Velha.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60047,
    startYear: 1889,
    endYear: 1894,
    title: 'República da Espada',
    description: 'República da Espada, primeira fase da República Velha, marcada pelo governo de militares.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60048,
    startYear: 1894,
    endYear: 1930,
    title: 'República Oligárquica',
    description: 'República Oligárquica, fase da República Velha dominada pelas elites agrárias e políticas de São Paulo e Minas Gerais.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60049,
    startYear: 1896,
    endYear: 1897,
    title: 'Guerra de Canudos',
    description: 'Guerra de Canudos, revolta popular liderada por Antônio Conselheiro no sertão da Bahia.',
    category: EventCategory.SOCIAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60050,
    year: 1922,
    title: 'Revolta Tenentista',
    description: 'Primeira revolta tenentista, levante de jovens oficiais do Exército no Rio de Janeiro.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60051,
    year: 1924,
    title: 'Coluna Prestes',
    description: 'Coluna Prestes, marcha tenentista liderada por Luís Carlos Prestes pelo interior do Brasil.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Luís Carlos Prestes']
  } as TimelineEvent,
  {
    id: 60052,
    year: 1930,
    title: 'Revolução de 1930',
    description: 'Revolução de 1930, golpe que depõe o presidente Washington Luís e leva Getúlio Vargas ao poder.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Getúlio Vargas']
  } as TimelineEvent,
  {
    id: 60053,
    startYear: 1930,
    endYear: 1937,
    title: 'Governo Provisório e Constitucional',
    description: 'Governo Provisório e Governo Constitucional de Getúlio Vargas, marcados por reformas e tensões políticas.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Getúlio Vargas']
  } as TimelineEvent,
  {
    id: 60054,
    year: 1932,
    title: 'Revolução Constitucionalista',
    description: 'Revolução Constitucionalista de 1932, em São Paulo, exige a convocação de uma Assembleia Constituinte.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60055,
    year: 1934,
    title: 'Segunda Constituição Republicana',
    description: 'Promulgação da segunda Constituição Republicana, durante o governo Vargas.',
    category: EventCategory.LEGISLATION,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60056,
    year: 1935,
    title: 'Intentona Comunista',
    description: 'Intentona Comunista, tentativa de golpe liderada por comunistas e tenentes.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60057,
    year: 1937,
    title: 'Estado Novo',
    description: 'Golpe do Estado Novo instaura a ditadura varguista, com a outorga de uma nova Constituição autoritária.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name,
    characters: ['Getúlio Vargas']
  } as TimelineEvent,
  {
    id: 60058,
    startYear: 1937,
    endYear: 1945,
    title: 'Ditadura do Estado Novo',
    description: 'Ditadura do Estado Novo, período de repressão política, propaganda e desenvolvimento econômico.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
  {
    id: 60059,
    year: 1945,
    title: 'Fim do Estado Novo',
    description: 'Fim do Estado Novo, com a deposição de Getúlio Vargas e redemocratização do país.',
    category: EventCategory.POLITICAL,
    source: evolucaoPoliticaBrasilSource.name
  } as TimelineEvent,
];

export const evolucaoPoliticaBrasilPeriods: TimelinePeriod[] = [
  {
    id: 70001,
    startYear: 1500,
    endYear: 1822,
    title: 'Brasil Colônia',
    description: 'Período colonial, desde a chegada dos portugueses até a Independência.',
    source: evolucaoPoliticaBrasilSource.name
  } as TimelinePeriod,
  {
    id: 70002,
    startYear: 1822,
    endYear: 1889,
    title: 'Brasil Império',
    description: 'Período imperial, desde a Independência até a Proclamação da República.',
    source: evolucaoPoliticaBrasilSource.name
  } as TimelinePeriod,
  {
    id: 70003,
    startYear: 1889,
    endYear: 1930,
    title: 'República Velha',
    description: 'República Velha, primeira fase republicana, marcada pelo domínio oligárquico.',
    source: evolucaoPoliticaBrasilSource.name
  } as TimelinePeriod,
  {
    id: 70004,
    startYear: 1930,
    endYear: 1945,
    title: 'Era Vargas',
    description: 'Era Vargas, período da história brasileira dominado pela figura de Getúlio Vargas.',
    source: evolucaoPoliticaBrasilSource.name
  } as TimelinePeriod,
];

export const evolucaoPoliticaBrasilCharacters: Character[] = [
  {
    id: 'pedro_alvares_cabral_epb',
    name: 'Pedro Álvares Cabral',
    description: 'Comandante da expedição portuguesa que chegou ao Brasil em 1500.',
    relatedEvents: [60001],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'gaspar_de_lemos_epb',
    name: 'Gaspar de Lemos',
    description: 'Comandante da expedição de reconhecimento da costa brasileira em 1501.',
    relatedEvents: [60002],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'tome_de_sousa_epb',
    name: 'Tomé de Sousa',
    description: 'Primeiro governador-geral do Brasil.',
    relatedEvents: [60005],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'duarte_da_costa_epb',
    name: 'Duarte da Costa',
    description: 'Segundo governador-geral do Brasil.',
    relatedEvents: [60007],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'mem_de_sa_epb',
    name: 'Mem de Sá',
    description: 'Terceiro governador-geral do Brasil.',
    relatedEvents: [60009],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'estacio_de_sa_epb',
    name: 'Estácio de Sá',
    description: 'Fundador da cidade do Rio de Janeiro.',
    relatedEvents: [60011],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'd_sebastiao_epb',
    name: 'D. Sebastião',
    description: 'Rei de Portugal morto na batalha de Alcácer-Quibir, causando a crise dinástica.',
    relatedEvents: [60013],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'filipe_ii_espanha_epb',
    name: 'Filipe II da Espanha',
    description: 'Rei da Espanha que se tornou rei de Portugal durante a União Ibérica.',
    relatedEvents: [60014],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'd_joao_iv_epb',
    name: 'D. João IV',
    description: 'Primeiro rei da dinastia de Bragança, restaurou a independência de Portugal.',
    relatedEvents: [60018],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'irmaos_beckman_epb',
    name: 'Irmãos Beckman',
    description: 'Líderes da revolta de colonos no Maranhão contra a Companhia de Comércio.',
    relatedEvents: [60019],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'marques_de_pombal_epb',
    name: 'Marquês de Pombal',
    description: 'Ministro português que implementou reformas e expulsou os jesuítas.',
    relatedEvents: [60026],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'tiradentes_epb',
    name: 'Tiradentes',
    description: 'Líder da Inconfidência Mineira, mártir da independência.',
    relatedEvents: [60028],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'd_joao_vi_epb',
    name: 'D. João VI',
    description: 'Príncipe Regente e Rei de Portugal que transferiu a corte para o Brasil.',
    relatedEvents: [60030, 60034],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'd_pedro_i_epb',
    name: 'D. Pedro I',
    description: 'Primeiro Imperador do Brasil, proclamou a independência.',
    relatedEvents: [60035, 60039],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'd_pedro_ii_epb',
    name: 'D. Pedro II',
    description: 'Segundo e último Imperador do Brasil.',
    relatedEvents: [60041],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'luis_carlos_prestes_epb',
    name: 'Luís Carlos Prestes',
    description: 'Líder da Coluna Prestes e importante figura comunista no Brasil.',
    relatedEvents: [60051],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'getulio_vargas_epb',
    name: 'Getúlio Vargas',
    description: 'Presidente do Brasil em dois períodos, liderou a Revolução de 1930 e o Estado Novo.',
    relatedEvents: [60052, 60057],
    source: evolucaoPoliticaBrasilSource.name
  },
  {
    id: 'nicolas_durand_de_villegagnon_epb',
    name: 'Nicolas Durand de Villegagnon',
    description: 'Líder Huguenote francês que fundou a França Antártica no Rio de Janeiro.',
    relatedEvents: [60008],
    source: evolucaoPoliticaBrasilSource.name
  }
];
