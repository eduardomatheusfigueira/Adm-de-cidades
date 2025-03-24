import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';

export const povoBrasileiroSource: SourceInfo = {
  id: "o_povo_brasileiro",
  name: "O Povo Brasileiro",
  author: "Darcy Ribeiro",
  color: "#2F4F4F",
  description: "Exploração da formação histórica e cultural do Brasil, examinando a interação entre indígenas, africanos e europeus."
};

export const povoBrasileiroEvents: TimelineEvent[] = [
  {
    id: 103,
    century: "XV",
    year: 1441,
    title: "Bula Papal de Afonso V",
    description: "Bula papal concede ao rei Afonso V de Portugal o direito de invadir, conquistar e subjugar sarracenos e pagãos, incluindo a redução à servidão.",
    category: EventCategory.POLITICAL,
    source: "O Povo Brasileiro"
  },
  {
    id: 104,
    year: 1493,
    month: 5,
    day: 4,
    title: "Bula Papal Inter Coetera",
    description: "Publicação da bula papal Inter Coetera, que legitima a posse do Novo Mundo por Espanha e Portugal e a escravização de seus povos.",
    category: EventCategory.POLITICAL,
    source: "O Povo Brasileiro"
  },
  {
    id: 105,
    century: "Início do XVI",
    title: "Descrições das Novas Terras",
    description: "Surgimento de descrições detalhadas das novas terras, permitindo sua apropriação pelo invasor através do conhecimento da natureza, povos, etc.",
    category: EventCategory.COLONIZATION,
    source: "O Povo Brasileiro"
  },
  {
    id: 106,
    century: "Início do XVI",
    title: "Absorção do Conhecimento Indígena",
    description: "Absorção inicial do conhecimento indígena sobre a natureza local, seguida por redefinições e renomeações pelos invasores.",
    category: EventCategory.CULTURAL,
    source: "O Povo Brasileiro"
  },
  {
    id: 107,
    century: "Início do XVI",
    title: "Exploração do Pau-Brasil",
    description: "Intensa exploração do pau-brasil pelos franceses e portugueses, levando a um diálogo registrado por Léry sobre a motivação europeia pela riqueza.",
    category: EventCategory.ECONOMIC,
    characters: ["Jean de Léry", "Ancião Tupinambá"],
    source: "O Povo Brasileiro"
  },
  {
    id: 108,
    century: "Início do XVI",
    title: "Sistema de Donatarias e Vilas",
    description: "Implementação mais vigorosa do sistema de donatarias por Martim Afonso de Sousa, com a introdução de gado e cana. Fundação de São Vicente e Piratininga.",
    category: EventCategory.COLONIZATION,
    characters: ["Martim Afonso de Sousa", "Pero Lopes"],
    source: "O Povo Brasileiro"
  },
  {
    id: 109,
    century: "Meados do XVI",
    year: 1553,
    title: "Carta ao Padre Luís Gonçalves",
    description: "Carta de 1553 ao padre Luís Gonçalves da Câmara descrevendo indivíduo ligado aos índios, com muitas mulheres indígenas e costumes nativos, visto como obstáculo.",
    category: EventCategory.SOCIAL,
    characters: ["Padre Luís Gonçalves da Câmara"],
    source: "O Povo Brasileiro"
  },
  {
    id: 110,
    century: "XVII",
    title: "Consolidação da Classe Dirigente Exógena",
    description: "Consolidação de uma classe dirigente exógena no Brasil, voltada para o lucro e exploração dos recursos naturais e da população.",
    category: EventCategory.POLITICAL,
    source: "O Povo Brasileiro"
  },
  {
    id: 111,
    century: "XVII",
    title: "Crescimento da Escravidão Africana",
    description: "Crescimento da escravidão de africanos, submetidos a um sistema de violência extrema e desumanização.",
    category: EventCategory.SOCIAL,
    source: "O Povo Brasileiro"
  },
  {
    id: 112,
    century: "XVII",
    title: "Fundação e Crescimento do Rio de Janeiro",
    description: "Fundação e crescimento do Rio de Janeiro como porto de escoamento da produção das minas.",
    category: EventCategory.URBANIZATION,
    source: "O Povo Brasileiro"
  },
  {
    id: 113,
    century: "XVIII",
    title: "Descoberta de Ouro e Diamantes",
    description: "Descoberta de ouro e diamantes nos sertões, levando a Coroa a legalizar a posse das minas e instituir taxação e monopólio real sobre diamantes.",
    category: EventCategory.ECONOMIC,
    source: "O Povo Brasileiro"
  },
  {
    id: 114,
    century: "XVIII",
    title: "Desenvolvimento de Minas Gerais",
    description: "Desenvolvimento de Minas Gerais como nó central para a integração do Brasil, ligando regiões economicamente.",
    category: EventCategory.ECONOMIC,
    source: "O Povo Brasileiro"
  },
  {
    id: 115,
    century: "XVIII",
    title: "\"Nababos Negros\" em Minas Gerais",
    description: "Surgimento de \"nababos negros\" em Minas Gerais devido à possibilidade de escravos produzirem excedentes e comprarem sua liberdade.",
    category: EventCategory.SOCIAL,
    source: "O Povo Brasileiro"
  },
  {
    id: 116,
    century: "XIX",
    title: "Expansão do Cultivo de Café",
    description: "Expansão do cultivo do café, inicialmente próximo ao Rio de Janeiro, tornando-se principal atividade econômica do Brasil.",
    category: EventCategory.ECONOMIC,
    source: "O Povo Brasileiro"
  },
  {
    id: 117,
    century: "XIX",
    title: "Políticas de \"Valorização\" do Café",
    description: "Adoção de políticas de \"valorização\" do café, com o governo comprando e estocando safras, e queimando café para manter preços, socializando prejuízos.",
    category: EventCategory.ECONOMIC,
    source: "O Povo Brasileiro"
  },
  {
    id: 118,
    century: "XIX",
    title: "Disputa por Terras e Desalojamento",
    description: "Crescimento das lavouras de algodão, tabaco e café, levando à disputa por terras de melhor qualidade e ao desalojamento de posseiros.",
    category: EventCategory.ECONOMIC,
    source: "O Povo Brasileiro"
  },
  {
    id: 119,
    century: "XIX",
    title: "Quebra do Isolamento dos Sertões",
    description: "Quebra do isolamento dos sertões com atuação do governo central, estradas, rádio e cinemas, enfraquecendo coronéis e transformando tensões sociais.",
    category: EventCategory.SOCIAL,
    source: "O Povo Brasileiro"
  },
  {
    id: 120,
    century: "XX",
    title: "Secas Nordestinas e Ajuda Governamental",
    description: "Secas nordestinas tornam-se problema nacional, mas ajuda governamental é controlada e apropriada pela elite dos coronéis.",
    category: EventCategory.SOCIAL,
    characters: ["Coronéis do Nordeste"],
    source: "O Povo Brasileiro"
  },
  {
    id: 121,
    century: "XX",
    title: "Modernização no Nordeste",
    description: "Tentativas de modernização no Nordeste com investimentos técnicos, mas com impacto social limitado devido à concentração da propriedade da terra.",
    category: EventCategory.ECONOMIC,
    source: "O Povo Brasileiro"
  },
  {
    id: 122,
    century: "XX",
    title: "Diversidade Cultural do Sul",
    description: "Menção à diversidade cultural do sul do Brasil, com gaúchos, \"matutos\" e imigrantes (\"gringos\"), diferenciando-se de áreas influenciadas pelos paulistas.",
    category: EventCategory.CULTURAL,
    source: "O Povo Brasileiro"
  },
  {
    id: 123,
    century: "XX",
    title: "Movimentos Messiânicos no Sul",
    description: "Breve menção a movimentos messiânicos no sul, com caráter monarquista em oposição à ordem republicana latifundiária.",
    category: EventCategory.SOCIAL,
    source: "O Povo Brasileiro"
  },
  {
    id: 124,
    title: "Formação da Etnia Nacional Brasileira",
    description: "O Brasil é apresentado como uma \"etnia nacional\" com uma língua comum, apesar das microetnias tribais.",
    category: EventCategory.CULTURAL,
    source: "O Povo Brasileiro"
  },
  {
    id: 125,
    title: "Crítica à Classe Dirigente Exógena e Infiel",
    description: "Crítica à classe dirigente \"exógena e infiel\" que explora os recursos e a população ao longo da história.",
    category: EventCategory.POLITICAL,
    source: "O Povo Brasileiro"
  },
  {
    id: 126,
    title: "Mestiçagem na Formação Populacional",
    description: "A mestiçagem é mencionada como um processo importante na formação da população brasileira.",
    category: EventCategory.SOCIAL,
    source: "O Povo Brasileiro"
  },
  {
    id: 127,
    title: "Homogeneidade Linguística e Cultural",
    description: "Apesar da diversidade de origens, o povo brasileiro é considerado linguisticamente e culturalmente homogêneo e socialmente integrado.",
    category: EventCategory.CULTURAL,
    source: "O Povo Brasileiro"
  }
];

export const povoBrasileiroPeriods: TimelinePeriod[] = [];

export const povoBrasileiroCharacters: Character[] = [
  {
    id: "afonso_v",
    name: "Afonso V",
    description: "Monarca português que recebeu direito de conquistar e subjugar povos não-cristãos no século XV.",
    relatedEvents: [103],
    source: "O Povo Brasileiro"
  },
  {
    id: "papa_nicolau_v",
    name: "Papa Nicolau V",
    description: "Papa que concedeu a bula papal autorizando as conquistas portuguesas.",
    relatedEvents: [103],
    source: "O Povo Brasileiro"
  },
  {
    id: "martim_afonso_de_sousa_pb",
    name: "Martim Afonso de Sousa",
    description: "Responsável pela implementação do sistema de donatarias e fundação das primeiras vilas no Brasil.",
    relatedEvents: [108],
    source: "O Povo Brasileiro"
  },
  {
    id: "pero_lopes",
    name: "Pero Lopes",
    description: "Cronista que registrou a obra de Martim Afonso de Sousa na colonização inicial.",
    relatedEvents: [108],
    source: "O Povo Brasileiro"
  },
  {
    id: "luis_goncalves_da_camara",
    name: "Padre Luís Gonçalves da Câmara",
    description: "Destinatário de carta de 1553 que menciona indivíduo ligado aos indígenas e costumes nativos.",
    relatedEvents: [109],
    source: "O Povo Brasileiro"
  },
  {
    id: "mem_de_sa",
    name: "Mem de Sá",
    description: "Governador-geral do Brasil, atuou contra indígenas e morreu \"gozoso\" de suas vitórias.",
    relatedEvents: [],
    source: "O Povo Brasileiro"
  },
  {
    id: "duarte_coelho",
    name: "Duarte Coelho",
    description: "Donatário de Pernambuco, considerado o único eficiente. Descontente com a recepção real em Portugal.",
    relatedEvents: [],
    source: "O Povo Brasileiro"
  },
  {
    id: "tome_de_sousa_pb",
    name: "Tomé de Sousa",
    description: "Primeiro governador-geral do Brasil, esperou anos para retornar a Portugal com sentimentos ambivalentes.",
    relatedEvents: [],
    source: "O Povo Brasileiro"
  },
  {
    id: "frei_vicente_do_salvador_pb",
    name: "Frei Vicente do Salvador",
    description: "Cronista colonial que viveu meio século no Brasil e registrou observações sobre povoadores, terra e indígenas.",
    relatedEvents: [],
    source: "O Povo Brasileiro"
  },
  {
    id: "jean_de_lery",
    name: "Jean de Léry",
    description: "Viajante e escritor francês com relatos incluindo diálogo com tupinambá sobre exploração do pau-brasil.",
    relatedEvents: [107],
    source: "O Povo Brasileiro"
  },
  {
    id: "anciao_tupinamba",
    name: "Ancião Tupinambá",
    description: "Indígena que questiona europeus sobre busca por riquezas e falta de preocupação com sustentabilidade.",
    relatedEvents: [107],
    source: "O Povo Brasileiro"
  },
  {
    id: "tiradentes_pb",
    name: "Tiradentes",
    description: "Inconfidente mineiro, execução e furto do crânio simbolizam luta pela liberdade.",
    relatedEvents: [],
    source: "O Povo Brasileiro"
  },
  {
    id: "mineiro_anonimo",
    name: "Mineiro Anônimo",
    description: "Furtou crânio de Tiradentes, rezou por sua alma e o sepultou, representando piedade e respeito popular.",
    relatedEvents: [],
    source: "O Povo Brasileiro"
  },
  {
    id: "coroneis_nordeste",
    name: "Coronéis do Nordeste",
    description: "Poderosos líderes regionais do sertão nordestino que controlavam a vida local e ajuda governamental.",
    relatedEvents: [120],
    source: "O Povo Brasileiro"
  },
  {
    id: "politico_paulista",
    name: "Politicão Paulista",
    description: "Representante de visão minoritária em SP com preconceito contra nordestinos.",
    relatedEvents: [],
    source: "O Povo Brasileiro"
  }
];
