import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';

export const capitaesBrasilSource: SourceInfo = {
  id: "capitaes_brasil",
  name: "Capitães do Brasil",
  author: "Eduardo Bueno",
  color: "#C6797E",
  description: "Explora os primeiros anos da colonização portuguesa no Brasil, sistema de capitanias, interação com indígenas e economia colonial."
};

export const capitaesBrasilEvents: TimelineEvent[] = [
  {
    id: 60001,
    year: 1530,
    title: "Expedição de Martim Afonso de Sousa",
    description: "Martim Afonso de Sousa lidera expedição exploradora e colonizadora ao Brasil.",
    category: EventCategory.EXPLORATION,
    source: "capitaes_brasil"
  },
  {
    id: 60002,
    year: 1532,
    title: "Fundação de São Vicente",
    description: "Martim Afonso de Sousa funda a vila de São Vicente, primeiro núcleo de povoamento português no Brasil.",
    category: EventCategory.COLONIZATION,
    source: "capitaes_brasil"
  },
  {
    id: 60003,
    year: 1534,
    title: "Início do Sistema de Capitanias Hereditárias",
    description: "D. João III divide o Brasil em capitanias hereditárias, visando a colonização e defesa do território.",
    category: EventCategory.POLITICAL,
    source: "capitaes_brasil"
  },
  {
    id: 60004,
    year: 1535,
    title: "Chegada dos Primeiros Donatários",
    description: "Chegam ao Brasil os primeiros donatários, como Duarte Coelho (Pernambuco) e Martim Afonso de Sousa (São Vicente).",
    category: EventCategory.COLONIZATION,
    source: "capitaes_brasil"
  },
  {
    id: 60005,
    year: 1536,
    title: "Fundação de Olinda",
    description: "Duarte Coelho funda a vila de Olinda, centro da capitania de Pernambuco.",
    category: EventCategory.COLONIZATION,
    source: "capitaes_brasil"
  },
  {
    id: 60006,
    year: 1549,
    title: "Instituição do Governo-Geral",
    description: "D. João III institui o Governo-Geral, centralizando a administração da colônia e extinguindo o sistema de capitanias hereditárias.",
    category: EventCategory.POLITICAL,
    source: "capitaes_brasil"
  },
  {
    id: 60007,
    year: 1549,
    title: "Tomé de Sousa Primeiro Governador-Geral",
    description: "Tomé de Sousa é nomeado primeiro governador-geral do Brasil, com a missão de implementar o governo centralizado.",
    category: EventCategory.POLITICAL,
    source: "capitaes_brasil"
  },
  {
    id: 60008,
    year: 1551,
    title: "Criação do Bispado do Brasil",
    description: "Criação do Bispado do Brasil, subordinado à diocese de Lisboa, com sede em Salvador.",
    category: EventCategory.POLITICAL,
    source: "capitaes_brasil"
  },
  {
    id: 60009,
    year: 1557,
    title: "Segundo Governador-Geral: Duarte da Costa",
    description: "Duarte da Costa assume como segundo governador-geral, enfrentando conflitos com o bispo e jesuítas.",
    category: EventCategory.POLITICAL,
    source: "capitaes_brasil"
  },
  {
    id: 60010,
    year: 1558,
    title: "Chegada de Mem de Sá",
    description: "Mem de Sá chega ao Brasil para ser o terceiro governador-geral, buscando restaurar a ordem e o desenvolvimento da colônia.",
    category: EventCategory.POLITICAL,
    source: "capitaes_brasil"
  },
  {
    id: 60011,
    year: 1565,
    title: "Fundação do Rio de Janeiro",
    description: "Fundação da cidade do Rio de Janeiro por Estácio de Sá, sobrinho de Mem de Sá, para combater franceses e consolidar o domínio português.",
    category: EventCategory.COLONIZATION,
    source: "capitaes_brasil"
  },
  {
    id: 60012,
    year: 1567,
    title: "Expulsão dos Franceses da Baía de Guanabara",
    description: "Mem de Sá e Estácio de Sá lideram a expulsão definitiva dos franceses da Baía de Guanabara.",
    category: EventCategory.POLITICAL,
    source: "capitaes_brasil"
  },
  {
    id: 60013,
    year: 1572,
    title: "Divisão do Governo-Geral",
    description: "O Governo-Geral é dividido em Governo do Norte e Governo do Sul, com o objetivo de melhorar a administração da vasta colônia.",
    category: EventCategory.POLITICAL,
    source: "capitaes_brasil"
  }
];

export const capitaesBrasilPeriods: TimelinePeriod[] = [
  {
    id: 70001,
    startYear: 1530,
    endYear: 1549,
    title: "Sistema de Capitanias Hereditárias",
    description: "Implementação do sistema de capitanias hereditárias como primeira forma de colonização do Brasil.",
    source: "capitaes_brasil"
  },
  {
    id: 70002,
    startYear: 1549,
    endYear: 1572,
    title: "Governo-Geral Centralizado",
    description: "Período do Governo-Geral centralizado, buscando unificar a administração colonial.",
    source: "capitaes_brasil"
  }
];

export const capitaesBrasilCharacters: Character[] = [];
