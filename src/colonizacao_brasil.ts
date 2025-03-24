import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';

export const colonizacaoBrasilSource: SourceInfo = {
  id: "colonizacao_brasil",
  name: "A Coroa, a cruz e a espada",
  author: "Eduardo Bueno",
  color: "#A0CED9",
  description: "Cronologia dos primeiros anos turbulentos da colonização portuguesa no Brasil, focando na Bahia e na criação de Salvador. Conflitos, administração, jesuítas, tensões e desafios econômicos são explorados."
};

export const colonizacaoBrasilEvents: TimelineEvent[] = [
  {
    id: 40001,
    year: 1521,
    title: "D. João III Ascende ao Trono de Portugal",
    description: "D. João III ascende ao trono de Portugal após a morte de D. Manuel I.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40002,
    year: 1527,
    title: "Numeramentos em Portugal (1527 e 1532)",
    description: "Realização de 'numeramentos' (recenseamentos populacionais) em Portugal, parte do esforço do Estado para aumentar o controle sobre seus súditos.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil",
    endYear: 1532
  },
  {
    id: 40003,
    year: 1534,
    month: 4,
    title: "Duarte Pereira Recebe Capitania da Bahia",
    description: "Duarte Pereira recebe a capitania da Bahia, mas nunca toma posse.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40004,
    year: 1535,
    title: "Bahia Ignorada e Piratas Franceses",
    description: "A Bahia permanece ignorada pela Coroa Portuguesa, tornando-se refúgio de piratas franceses.",
    category: EventCategory.COLONIZATION,
    source: "colonizacao_brasil"
  },
  {
    id: 40005,
    year: 1536,
    title: "Pero de Góis Desembarca em Porto Seguro",
    description: "Pero de Góis desembarca em Porto Seguro, na capitania de Duarte Coelho, e tenta, sem sucesso, tomar posse da Bahia.",
    category: EventCategory.EXPLORATION,
    source: "colonizacao_brasil"
  },
  {
    id: 40006,
    year: 1549,
    month: 3,
    day: 29,
    title: "Tomé de Sousa Recebe Instruções e Parte para o Brasil",
    description: "Tomé de Sousa recebe o 'Regimento' (instruções) de D. João III e parte de Lisboa rumo ao Brasil com seis navios.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40007,
    year: 1549,
    month: 4,
    title: "Salvador: Centro Administrativo e Eclesiástico",
    description: "Salvador é planejada para ser o centro administrativo, militar, judicial e eclesiástico da colônia, refletindo a centralização do poder real.",
    category: EventCategory.COLONIZATION,
    source: "colonizacao_brasil"
  },
  {
    id: 40008,
    year: 1549,
    month: 4,
    title: "Diversidade na Expedição de Tomé de Sousa",
    description: "A expedição de Tomé de Sousa inclui burocratas, militares, degredados, jesuítas e trabalhadores especializados, refletindo a complexidade da empresa colonizadora.",
    category: EventCategory.SOCIAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40009,
    year: 1549,
    month: 4,
    title: "Jesuítas na Expedição",
    description: "Seis jesuítas, liderados por Manuel da Nóbrega, acompanham Tomé de Sousa, marcando o início da atuação da Companhia de Jesus no Brasil.",
    category: EventCategory.SOCIAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40010,
    year: 1549,
    month: 4,
    title: "Instruções para Tomé de Sousa",
    description: "Tomé de Sousa recebe instruções detalhadas sobre defesa, fiscalização, justiça, sesmarias, aldeamentos indígenas e expansão da fé cristã.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40011,
    year: 1549,
    month: 7,
    day: 2,
    title: "Chegada de Tomé de Sousa à Bahia",
    description: "A frota de Tomé de Sousa chega à Baía de Todos os Santos.",
    category: EventCategory.COLONIZATION,
    source: "colonizacao_brasil"
  },
  {
    id: 40012,
    year: 1549,
    month: 8,
    day: 12,
    title: "Fundação Oficial de Salvador",
    description: "Fundação oficial da cidade de Salvador por Tomé de Sousa.",
    category: EventCategory.COLONIZATION,
    source: "colonizacao_brasil"
  },
  {
    id: 40013,
    year: 1549,
    month: 8,
    title: "Primeiras Construções em Salvador",
    description: "Início da construção do núcleo urbano de Salvador, incluindo a Casa do Governador, a igreja e o Colégio dos Jesuítas, e o pelourinho.",
    category: EventCategory.URBANIZATION,
    source: "colonizacao_brasil"
  },
  {
    id: 40014,
    year: 1549,
    month: 9,
    title: "Primeira Câmara Municipal do Brasil",
    description: "Instalação da primeira Câmara Municipal do Brasil em Salvador, com seis 'homens-bons' eleitos.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40015,
    year: 1549,
    month: 10,
    title: "Chegada de Gado e Escravos Africanos",
    description: "Chegam a Salvador os primeiros lotes de gado e escravos africanos, impulsionando a economia colonial.",
    category: EventCategory.ECONOMIC,
    source: "colonizacao_brasil"
  },
  {
    id: 40016,
    year: 1549,
    month: 12,
    title: "Carta de Nóbrega ao Padre Simão Rodrigues",
    description: "Carta de Manuel da Nóbrega ao Padre Simão Rodrigues em Coimbra, descrevendo os desafios e a beleza da missão no Brasil.",
    category: EventCategory.CULTURAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40017,
    year: 1550,
    title: "Salvador como Centro Dinâmico",
    description: "Salvador se consolida como centro dinâmico da colônia, atraindo moradores e desenvolvendo atividades econômicas e sociais.",
    category: EventCategory.COLONIZATION,
    source: "colonizacao_brasil"
  },
  {
    id: 40018,
    year: 1550,
    title: "Conflitos e Doenças em Salvador",
    description: "Salvador enfrenta epidemias e conflitos com indígenas, refletindo os desafios da colonização.",
    category: EventCategory.SOCIAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40019,
    year: 1550,
    title: "Engenho de Açúcar em Salvador",
    description: "Construção do primeiro engenho de açúcar em Salvador, marcando o início da agroindústria açucareira na região.",
    category: EventCategory.ECONOMIC,
    source: "colonizacao_brasil"
  },
  {
    id: 40020,
    year: 1551,
    title: "Bula 'Licet Prudentia' e Bispado do Brasil",
    description: "Criação do Bispado do Brasil pela bula 'Licet Prudentia' do Papa Júlio III, subordinado a Tomar, Portugal.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40021,
    year: 1551,
    title: "D. Pero Fernandes Sardinha Primeiro Bispo",
    description: "D. Pero Fernandes Sardinha é nomeado primeiro bispo do Brasil, consolidando a estrutura eclesiástica.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40022,
    year: 1552,
    month: 6,
    day: 22,
    title: "Chegada do Bispo Sardinha a Salvador",
    description: "Chegada do bispo D. Pero Fernandes Sardinha a Salvador, tomando posse do bispado.",
    category: EventCategory.SOCIAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40023,
    year: 1553,
    title: "Carta Régia e Governo-Geral Centralizado",
    description: "Carta régia de D. João III confirma Salvador como sede do Governo-Geral, centralizando a administração da colônia.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40024,
    year: 1553,
    title: "Dificuldades de Tomé de Sousa e Substituição",
    description: "Tomé de Sousa enfrenta dificuldades administrativas e é substituído por D. Duarte da Costa como governador-geral.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40025,
    year: 1553,
    month: 5,
    day: 8,
    title: "Partida de Tomé de Sousa para Portugal",
    description: "Tomé de Sousa parte de Salvador de volta para Portugal.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40026,
    year: 1556,
    month: 8,
    day: 13,
    title: "Chegada de D. Duarte da Costa e D. Álvaro",
    description: "Chegada do segundo governador-geral, D. Duarte da Costa, acompanhado de seu filho D. Álvaro e novos jesuítas.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40027,
    year: 1556,
    title: "Novos Jesuítas e Padre Anchieta",
    description: "Chegam mais jesuítas com D. Duarte da Costa, incluindo o jovem José de Anchieta, que se destacaria na catequese e nos estudos da língua tupi.",
    category: EventCategory.SOCIAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40028,
    year: 1556,
    title: "Tensões entre Bispo e D. Duarte da Costa",
    description: "Início de tensões entre o bispo Sardinha e D. Duarte da Costa, marcadas por desentendimentos e conflitos de autoridade.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40029,
    year: 1557,
    title: "Carta de Anchieta sobre a Terra e os Indígenas",
    description: "José de Anchieta escreve a primeira carta de notícias para a Companhia de Jesus, descrevendo a terra e os costumes dos indígenas.",
    category: EventCategory.CULTURAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40030,
    year: 1557,
    title: "Rebelião de D. Álvaro e Assassinato de Índios",
    description: "Rebelião de D. Álvaro da Costa e seus companheiros, resultando no assassinato de diversos indígenas tupinambás.",
    category: EventCategory.REPRESSION,
    source: "colonizacao_brasil"
  },
  {
    id: 40031,
    year: 1557,
    title: "Excomunhão de D. Álvaro e Agravamento das Tensões",
    description: "O bispo Sardinha excomunga D. Álvaro, agravando as tensões com D. Duarte da Costa e a administração colonial.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40032,
    year: 1558,
    title: "Críticas de Nóbrega ao Governo de D. Duarte",
    description: "Manuel da Nóbrega critica o governo de D. Duarte da Costa em cartas ao rei e a Portugal, denunciando a violência e a corrupção.",
    category: EventCategory.INTELLECTUAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40033,
    year: 1558,
    title: "Primeiro Sínodo Diocesano do Brasil",
    description: "Realização do primeiro sínodo diocesano do Brasil em Salvador, buscando organizar a Igreja e definir normas para a colônia.",
    category: EventCategory.SOCIAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40034,
    year: 1558,
    title: "Conflitos entre Colonos e Jesuítas",
    description: "Aumentam os conflitos entre colonos e jesuítas devido à defesa dos indígenas pelos religiosos e à resistência à escravização.",
    category: EventCategory.SOCIAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40035,
    year: 1558,
    title: "Crise Econômica e Financeira na Colônia",
    description: "A colônia enfrenta uma crise econômica e financeira, com dificuldades na produção de açúcar e na arrecadação de tributos.",
    category: EventCategory.ECONOMIC,
    source: "colonizacao_brasil"
  },
  {
    id: 40036,
    year: 1558,
    title: "D. Duarte da Costa é Chamado de Volta",
    description: "D. Duarte da Costa é chamado de volta a Portugal devido às crescentes tensões e à crise na colônia.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40037,
    year: 1558,
    month: 6,
    day: 29,
    title: "Partida de D. Duarte da Costa para Portugal",
    description: "D. Duarte da Costa parte de Salvador rumo a Portugal.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40038,
    year: 1559,
    month: 6,
    day: 16,
    title: "Naufrágio e Morte do Bispo Sardinha",
    description: "O bispo Sardinha morre tragicamente em um naufrágio na costa de Alagoas, após ser expulso pelos indígenas Caetés.",
    category: EventCategory.SOCIAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40039,
    year: 1562,
    title: "Carta de Nóbrega sobre a Morte do Bispo",
    description: "Nóbrega escreve uma carta lamentando a morte trágica do bispo Sardinha e refletindo sobre os desafios da evangelização.",
    category: EventCategory.CULTURAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40040,
    year: 1562,
    title: "D. Estácio de Sá e a Nova Expedição",
    description: "D. Estácio de Sá lidera uma nova expedição ao Brasil, com o objetivo de consolidar a presença portuguesa e combater os franceses.",
    category: EventCategory.EXPLORATION,
    source: "colonizacao_brasil"
  },
  {
    id: 40041,
    year: 1565,
    month: 3,
    day: 1,
    title: "Fundação do Rio de Janeiro",
    description: "Fundação da cidade do Rio de Janeiro por Estácio de Sá, marcando um ponto estratégico na defesa da costa.",
    category: EventCategory.COLONIZATION,
    source: "colonizacao_brasil"
  },
  {
    id: 40042,
    year: 1567,
    title: "Expulsão dos Franceses do Rio de Janeiro",
    description: "Os portugueses, liderados por Mem de Sá, expulsam definitivamente os franceses da Baía de Guanabara.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40043,
    year: 1572,
    title: "Divisão do Brasil em Dois Governos",
    description: "O Brasil é dividido em dois governos-gerais: Governo do Norte, com sede em Salvador, e Governo do Sul, com sede no Rio de Janeiro.",
    category: EventCategory.POLITICAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40044,
    year: 1578,
    title: "Desastre de Alcácer-Quibir e Crise Dinástica",
    description: "O desastre militar de Alcácer-Quibir, no Marrocos, resulta na morte do rei D. Sebastião e inicia a crise dinástica em Portugal.",
    category: EventCategory.INTERNATIONAL,
    source: "colonizacao_brasil"
  },
  {
    id: 40045,
    year: 1580,
    title: "União Ibérica e Domínio Espanhol",
    description: "Filipe II da Espanha torna-se rei de Portugal, dando início à União Ibérica e ao domínio espanhol sobre o Brasil.",
    category: EventCategory.INTERNATIONAL,
    source: "colonizacao_brasil"
  }
];

export const colonizacaoBrasilPeriods: TimelinePeriod[] = [
  {
    id: 50001,
    startYear: 1549,
    endYear: 1580,
    title: "Consolidação da Colonização e Desafios",
    description: "Período de consolidação da colonização portuguesa no Brasil, marcado pela fundação de Salvador, a atuação dos jesuítas, tensões administrativas e eclesiásticas, e a crise da União Ibérica.",
    source: "colonizacao_brasil"
  }
];

export const colonizacaoBrasilCharacters: Character[] = [];
