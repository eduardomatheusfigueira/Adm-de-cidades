import { TimelineEvent, TimelinePeriod, Character, EventCategory } from './types';

export const raizesEvents: TimelineEvent[] = [
  {
    id: 75,
    year: 1200,
    endYear: 1300,
    title: "Consolidação política portuguesa",
    description: "Portugal consolida sua unidade política antes de outros Estados europeus modernos.",
    category: EventCategory.POLITICAL,
    source: "Raízes do Brasil"
  },
  {
    id: 76,
    year: 1415,
    title: "Conquista de Ceuta",
    description: "Início da expansão ultramarina portuguesa com a conquista de Ceuta.",
    category: EventCategory.COLONIZATION,
    source: "Raízes do Brasil"
  },
  {
    id: 77,
    year: 1450,
    endYear: 1500,
    title: "Grandes Descobrimentos",
    description: "Portugal e Espanha assumem protagonismo nos descobrimentos marítimos, ingressando tardiamente no cenário europeu.",
    category: EventCategory.COLONIZATION,
    source: "Raízes do Brasil"
  },
  {
    id: 78,
    year: 1530,
    endYear: 1550,
    title: "Capitanias Hereditárias",
    description: "Implantação do sistema de capitanias hereditárias e início da exploração da cana-de-açúcar com mão de obra escrava africana.",
    category: EventCategory.COLONIZATION,
    characters: ["D. João III"],
    source: "Raízes do Brasil"
  },
  {
    id: 79,
    year: 1554,
    title: "Fundação de São Paulo",
    description: "Fundação de São Paulo pelos jesuítas e início da expansão bandeirante pelo interior do Brasil.",
    category: EventCategory.COLONIZATION,
    characters: ["Padre Manuel da Nóbrega"],
    source: "Raízes do Brasil"
  },
  {
    id: 80,
    year: 1550,
    endYear: 1600,
    title: "Conflitos com Indígenas",
    description: "Conflitos entre colonos e indígenas se intensificam com a expansão da colonização para o interior.",
    category: EventCategory.SOCIAL,
    source: "Raízes do Brasil"
  },
  {
    id: 81,
    year: 1580,
    endYear: 1600,
    title: "Observações de cronistas",
    description: "Observações de viajantes e cronistas como Gabriel Soares, frei Vicente do Salvador e padre Manuel da Nóbrega revelam os contrastes entre a cultura portuguesa e a realidade da colônia brasileira.",
    category: EventCategory.CULTURAL,
    characters: ["Gabriel Soares de Sousa", "Frei Vicente do Salvador", "Padre Manuel da Nóbrega"],
    source: "Raízes do Brasil"
  },
  {
    id: 82,
    year: 1630,
    endYear: 1654,
    title: "Domínio Holandês no Brasil",
    description: "Invasão holandesa no Nordeste do Brasil e estabelecimento do governo de Maurício de Nassau.",
    category: EventCategory.POLITICAL,
    characters: ["Maurício de Nassau"],
    source: "Raízes do Brasil"
  },
  {
    id: 83,
    year: 1654,
    title: "Expulsão dos Holandeses",
    description: "Derrota e expulsão dos holandeses, marcando o fim da ameaça à hegemonia portuguesa no Brasil.",
    category: EventCategory.POLITICAL,
    source: "Raízes do Brasil"
  },
  {
    id: 84,
    year: 1695,
    endYear: 1750,
    title: "Ciclo do Ouro",
    description: "Descoberta de ouro em Minas Gerais e consequente deslocamento do eixo econômico para a região Sudeste.",
    category: EventCategory.ECONOMIC,
    source: "Raízes do Brasil"
  },
  {
    id: 85,
    year: 1729,
    title: "Descoberta de Diamantes",
    description: "Descoberta de diamantes em Minas Gerais, intensificando o controle e a exploração da região pela Coroa Portuguesa.",
    category: EventCategory.ECONOMIC,
    source: "Raízes do Brasil"
  },
  {
    id: 86,
    year: 1750,
    endYear: 1800,
    title: "Críticas ao Sistema Colonial",
    description: "Ilustrados como Luís dos Santos Vilhena criticam o modelo de urbanização e a exploração colonial portuguesa no Brasil.",
    category: EventCategory.INTELLECTUAL,
    characters: ["Luís dos Santos Vilhena"],
    source: "Raízes do Brasil"
  },
  {
    id: 87,
    year: 1750,
    endYear: 1800,
    title: "Influência Iluminista",
    description: "Ideias iluministas penetram no Brasil, questionando o absolutismo e defendendo reformas sociais e políticas.",
    category: EventCategory.INTELLECTUAL,
    source: "Raízes do Brasil"
  },
  {
    id: 88,
    year: 1789,
    title: "Inconfidência Mineira",
    description: "Inspirada pelas ideias iluministas, a Inconfidência Mineira representa um movimento pela independência do Brasil, mas é reprimida pela Coroa Portuguesa.",
    category: EventCategory.POLITICAL,
    source: "Raízes do Brasil"
  },
  {
    id: 89,
    year: 1808,
    title: "Vinda da Família Real Portuguesa",
    description: "Diante da invasão napoleônica a Portugal, a família real portuguesa se transfere para o Brasil.",
    category: EventCategory.POLITICAL,
    characters: ["D. João VI"],
    source: "Raízes do Brasil"
  },
  {
    id: 90,
    year: 1808,
    title: "Abertura dos Portos",
    description: "D. João VI decreta a abertura dos portos às nações amigas, rompendo o pacto colonial e impulsionando a economia brasileira.",
    category: EventCategory.ECONOMIC,
    characters: ["D. João VI"],
    source: "Raízes do Brasil"
  },
  {
    id: 91,
    year: 1815,
    title: "Elevação do Brasil a Reino Unido",
    description: "Brasil é elevado à condição de Reino Unido a Portugal e Algarves, ganhando status de igualdade com a metrópole.",
    category: EventCategory.POLITICAL,
    characters: ["D. João VI"],
    source: "Raízes do Brasil"
  },
  {
    id: 92,
    year: 1822,
    title: "Independência do Brasil",
    description: "Proclamação da independência do Brasil por D. Pedro I.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro I"],
    source: "Raízes do Brasil"
  },
  {
    id: 93,
    year: 1831,
    endYear: 1840,
    title: "Período Regencial",
    description: "Período de instabilidade política e revoltas após a abdicação de D. Pedro I.",
    category: EventCategory.POLITICAL,
    source: "Raízes do Brasil"
  },
  {
    id: 94,
    year: 1840,
    endYear: 1889,
    title: "Segundo Reinado",
    description: "Período marcado pela estabilidade política sob o governo de D. Pedro II, expansão da cafeicultura e debates sobre a escravidão.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro II"],
    source: "Raízes do Brasil"
  },
  {
    id: 95,
    year: 1850,
    title: "Fim do Tráfico Negreiro",
    description: "Aprovação da Lei Eusébio de Queirós, extinguindo o tráfico negreiro.",
    category: EventCategory.LEGISLATION,
    characters: ["Eusébio de Queirós"],
    source: "Raízes do Brasil"
  },
  {
    id: 96,
    year: 1850,
    endYear: 1900,
    title: "Imigração Europeia",
    description: "Início da imigração europeia em larga escala para suprir a mão de obra nas lavouras de café.",
    category: EventCategory.SOCIAL,
    source: "Raízes do Brasil"
  },
  {
    id: 97,
    year: 1850,
    endYear: 1900,
    title: "Crescimento Urbano",
    description: "Expansão da cafeicultura impulsiona o crescimento urbano e transformações sociais no Brasil.",
    category: EventCategory.URBANIZATION,
    source: "Raízes do Brasil"
  },
  {
    id: 98,
    year: 1888,
    title: "Abolição da Escravidão",
    description: "Assinatura da Lei Áurea, abolindo a escravidão no Brasil.",
    category: EventCategory.LEGISLATION,
    source: "Raízes do Brasil"
  },
  {
    id: 99,
    year: 1889,
    title: "Proclamação da República",
    description: "Golpe militar depõe D. Pedro II e instaura a República no Brasil.",
    category: EventCategory.POLITICAL,
    characters: ["Benjamin Constant"],
    source: "Raízes do Brasil"
  },
  {
    id: 100,
    year: 1889,
    endYear: 1930,
    title: "República Velha",
    description: "Período marcado por conflitos políticos, oligarquias regionais e crises sociais.",
    category: EventCategory.POLITICAL,
    source: "Raízes do Brasil"
  },
  {
    id: 101,
    year: 1889,
    endYear: 1930,
    title: "Ascensão do Positivismo",
    description: "Positivismo ganha força entre intelectuais e militares, influenciando o movimento republicano.",
    category: EventCategory.INTELLECTUAL,
    characters: ["Benjamin Constant", "Augusto Comte"],
    source: "Raízes do Brasil"
  },
  {
    id: 102,
    year: 1900,
    endYear: 1930,
    title: "Industrialização",
    description: "Industrialização se intensifica no Brasil, impulsionando o crescimento das cidades.",
    category: EventCategory.ECONOMIC,
    source: "Raízes do Brasil"
  }
];

export const raizesPeriods: TimelinePeriod[] = [
  {
    id: 6,
    startYear: 1200,
    endYear: 1500,
    title: "Formação de Portugal e Expansão Ultramarina",
    description: "Período de consolidação da unidade política portuguesa e início da expansão marítima.",
    source: "Raízes do Brasil"
  },
  {
    id: 7,
    startYear: 1500,
    endYear: 1600,
    title: "Século XVI - Início da Colonização",
    description: "Implantação do sistema colonial português no Brasil, com as capitanias hereditárias e o início da exploração da cana-de-açúcar.",
    source: "Raízes do Brasil"
  },
  {
    id: 8,
    startYear: 1600,
    endYear: 1700,
    title: "Século XVII - Consolidação Colonial",
    description: "Período marcado pelo domínio holandês no Nordeste e pelo início do ciclo do ouro em Minas Gerais.",
    source: "Raízes do Brasil"
  },
  {
    id: 9,
    startYear: 1700,
    endYear: 1800,
    title: "Século XVIII - Auge da Exploração Colonial",
    description: "Descoberta de diamantes em Minas Gerais e penetração das ideias iluministas no Brasil.",
    source: "Raízes do Brasil"
  },
  {
    id: 10,
    startYear: 1800,
    endYear: 1900,
    title: "Século XIX - Independência e Império",
    description: "Vinda da família real portuguesa, independência do Brasil, período imperial e abolição da escravidão.",
    source: "Raízes do Brasil"
  },
  {
    id: 11,
    startYear: 1889,
    endYear: 1930,
    title: "República Velha",
    description: "Período marcado por conflitos políticos, oligarquias regionais e crises sociais após a proclamação da República.",
    source: "Raízes do Brasil"
  }
];

export const raizesCharacters: Character[] = [
  {
    id: "sergio_buarque",
    name: "Sérgio Buarque de Holanda",
    description: "Historiador e sociólogo brasileiro, autor de 'Raízes do Brasil'. Sua obra é considerada fundamental para a compreensão da formação da sociedade brasileira.",
    relatedEvents: [],
    source: "Raízes do Brasil"
  },
  {
    id: "d_joao_iii",
    name: "D. João III",
    description: "Rei de Portugal durante a fase inicial da colonização do Brasil. Implementou o sistema de capitanias hereditárias.",
    relatedEvents: [78],
    source: "Raízes do Brasil"
  },
  {
    id: "tome_sousa",
    name: "Tomé de Sousa",
    description: "Primeiro governador-geral do Brasil, responsável por fundar a cidade de Salvador e organizar a administração colonial.",
    relatedEvents: [],
    source: "Raízes do Brasil"
  },
  {
    id: "manuel_nobrega",
    name: "Padre Manuel da Nóbrega",
    description: "Jesuíta português que teve papel fundamental na catequização dos índios e na organização da Igreja Católica no Brasil colonial.",
    relatedEvents: [79, 81],
    source: "Raízes do Brasil"
  },
  {
    id: "vicente_salvador",
    name: "Frei Vicente do Salvador",
    description: "Cronista e religioso português, autor de 'História do Brasil', uma das principais fontes sobre o período colonial.",
    relatedEvents: [81],
    source: "Raízes do Brasil"
  },
  {
    id: "gabriel_soares",
    name: "Gabriel Soares de Sousa",
    description: "Cronista e administrador colonial português, autor de 'Tratado Descritivo do Brasil', obra que descreve a geografia, a flora, a fauna e os costumes dos indígenas do Brasil.",
    relatedEvents: [81],
    source: "Raízes do Brasil"
  },
  {
    id: "mauricio_nassau",
    name: "Maurício de Nassau",
    description: "Administrador holandês que governou o Nordeste do Brasil durante o período da ocupação holandesa no século XVII.",
    relatedEvents: [82],
    source: "Raízes do Brasil"
  },
  {
    id: "luis_vilhena",
    name: "Luís dos Santos Vilhena",
    description: "Militar e administrador colonial português que criticou o modelo de urbanização e a exploração colonial no Brasil.",
    relatedEvents: [86],
    source: "Raízes do Brasil"
  },
  {
    id: "d_joao_vi",
    name: "D. João VI",
    description: "Rei de Portugal que se refugiou no Brasil durante a invasão napoleônica. Decretou a abertura dos portos e elevou o Brasil a Reino Unido.",
    relatedEvents: [89, 90, 91],
    source: "Raízes do Brasil"
  },
  {
    id: "d_pedro_i",
    name: "D. Pedro I",
    description: "Filho de D. João VI, proclamou a independência do Brasil.",
    relatedEvents: [92],
    source: "Raízes do Brasil"
  },
  {
    id: "d_pedro_ii",
    name: "D. Pedro II",
    description: "Filho de D. Pedro I, governou o Brasil durante o Segundo Reinado, período marcado por relativa estabilidade política e desenvolvimento econômico.",
    relatedEvents: [94],
    source: "Raízes do Brasil"
  },
  {
    id: "eusebio_queiros",
    name: "Eusébio de Queirós",
    description: "Político brasileiro responsável pela Lei Eusébio de Queirós, que extinguiu o tráfico negreiro.",
    relatedEvents: [95],
    source: "Raízes do Brasil"
  },
  {
    id: "augusto_comte",
    name: "Augusto Comte",
    description: "Filósofo francês, fundador do Positivismo. Suas ideias influenciaram intelectuais e militares brasileiros no final do século XIX.",
    relatedEvents: [101],
    source: "Raízes do Brasil"
  },
  {
    id: "benjamin_constant_rb",
    name: "Benjamin Constant",
    description: "Militar e positivista brasileiro, considerado um dos líderes do movimento republicano.",
    relatedEvents: [99, 101],
    source: "Raízes do Brasil"
  }
];
