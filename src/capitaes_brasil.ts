import { TimelineEvent, TimelinePeriod, Character, EventCategory } from './types';

export const capitaesBrasilEvents: TimelineEvent[] = [
  {
    id: 75,
    year: 1500,
    month: 4,
    day: 22,
    title: "Chegada de Cabral ao Brasil",
    description: "Pedro Álvares Cabral chega ao Brasil.",
    category: EventCategory.COLONIZATION,
    source: "Capitães do Brasil"
  },
  {
    id: 76,
    year: 1514,
    title: "Descoberta do Rio da Prata",
    description: "Expedição comandada por João de Lisboa descobre o Rio da Prata.",
    category: EventCategory.EXPLORATION,
    source: "Capitães do Brasil"
  },
  {
    id: 77,
    year: 1526,
    title: "Contato de Caramuru com Tupinambá",
    description: "Possível primeiro contato de Diogo Álvares Correia (Caramuru) com os Tupinambá na Bahia.",
    category: EventCategory.COLONIZATION,
    characters: ["Diogo Álvares Correia (Caramuru)"],
    source: "Capitães do Brasil"
  },
  {
    id: 78,
    year: 1529,
    title: "Comércio ilegal de pau-brasil",
    description: "Marinheiros normandos, financiados por Jean Ango, intensificam o comércio ilegal de pau-brasil no Brasil.",
    category: EventCategory.ECONOMIC,
    characters: ["Jean Ango"],
    source: "Capitães do Brasil"
  },
  {
    id: 79,
    year: 1530,
    month: 6,
    title: "Partida de Gonçalo da Costa para Europa",
    description: "Junho: Gonçalo da Costa parte de Cananéia para a Europa.",
    category: EventCategory.COLONIZATION,
    characters: ["Gonçalo da Costa"],
    source: "Capitães do Brasil"
  },
  {
    id: 80,
    year: 1530,
    month: 10,
    title: "Gonçalo da Costa e D. João III",
    description: "Outubro: Gonçalo da Costa se reúne com D. João III em Lisboa e revela os planos portugueses para o Brasil.",
    category: EventCategory.POLITICAL,
    characters: ["Gonçalo da Costa", "D. João III"],
    source: "Capitães do Brasil"
  },
  {
    id: 81,
    year: 1530,
    month: 11,
    title: "Expedição de Martim Afonso de Sousa",
    description: "Novembro: Martim Afonso de Sousa parte de Portugal liderando uma expedição ao Brasil.",
    category: EventCategory.COLONIZATION,
    characters: ["Martim Afonso de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 82,
    year: 1531,
    title: "Franceses expulsos de Pernambuco",
    description: "Fevereiro/Março: Martim Afonso de Sousa expulsa franceses de Pernambuco e inicia a construção de uma feitoria em Igaraçu.",
    category: EventCategory.COLONIZATION,
    characters: ["Martim Afonso de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 83,
    year: 1531,
    month: 3,
    title: "Chegada à Baía de Todos os Santos",
    description: "Março: Chegada de Martim Afonso de Sousa à Baía de Todos os Santos.",
    category: EventCategory.COLONIZATION,
    characters: ["Martim Afonso de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 84,
    year: 1531,
    month: 6,
    title: "Retorno de João de Sousa a Portugal",
    description: "Junho: João de Sousa retorna a Portugal levando pau-brasil e traficantes franceses capturados.",
    category: EventCategory.COLONIZATION,
    characters: ["João de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 85,
    year: 1531,
    month: 7,
    title: "Gonçalo da Costa 'capitão'",
    description: "Julho: D. Isabel nomeia Gonçalo da Costa 'capitão no serviço das Índias'.",
    category: EventCategory.POLITICAL,
    characters: ["Gonçalo da Costa", "D. Isabel"],
    source: "Capitães do Brasil"
  },
  {
    id: 86,
    year: 1531,
    month: 12,
    title: "Naufrágio no Rio da Prata",
    description: "Dezembro: Naufrágio do bergantim de Martim Afonso de Sousa nas 'Pedras de Afiar' no Rio da Prata.",
    category: EventCategory.COLONIZATION,
    characters: ["Martim Afonso de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 87,
    year: 1532,
    month: 1,
    title: "Fundação de São Vicente",
    description: "Janeiro: Fundação de São Vicente por Martim Afonso de Sousa.",
    category: EventCategory.URBANIZATION,
    characters: ["Martim Afonso de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 88,
    year: 1532,
    month: 5,
    day: 22,
    title: "Pero Lopes parte para Portugal",
    description: "22 de Maio: Pero Lopes, irmão de Martim Afonso, parte de São Vicente para Portugal.",
    category: EventCategory.COLONIZATION,
    characters: ["Pero Lopes de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 89,
    year: 1532,
    month: 9,
    title: "Divisão em Capitanias Hereditárias",
    description: "Setembro: D. João III decide dividir o Brasil em capitanias hereditárias e informa Martim Afonso de Sousa por carta.",
    category: EventCategory.POLITICAL,
    characters: ["D. João III", "Martim Afonso de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 90,
    year: 1532,
    month: 10,
    title: "João de Sousa volta ao Brasil",
    description: "Outubro: João de Sousa parte para o Brasil com a missão de entregar a carta do rei a Martim Afonso.",
    category: EventCategory.COLONIZATION,
    characters: ["João de Sousa", "Martim Afonso de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 91,
    year: 1533,
    title: "Naufrágio na volta de Martim Afonso",
    description: "Naufrágio de três das naus de Martim Afonso de Sousa durante a viagem de volta a Portugal.",
    category: EventCategory.COLONIZATION,
    characters: ["Martim Afonso de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 92,
    year: 1533,
    title: "Derrota de D. Nuno da Cunha em Diu",
    description: "D. João III recebe a notícia da derrota de D. Nuno da Cunha em Diu, Índia.",
    category: EventCategory.INTERNATIONAL,
    characters: ["D. João III"],
    source: "Capitães do Brasil"
  },
  {
    id: 93,
    year: 1533,
    title: "Expedição de Mendoza ao Rio da Prata",
    description: "Notícias sobre a expedição de Pedro de Mendoza ao Rio da Prata chegam a Portugal.",
    category: EventCategory.COLONIZATION,
    characters: ["Pedro de Mendoza"],
    source: "Capitães do Brasil"
  },
  {
    id: 94,
    year: 1534,
    month: 3,
    title: "Pero Lopes e Tomé de Sousa no Marrocos",
    description: "Março: Pero Lopes e Tomé de Sousa partem de Lisboa para o Marrocos.",
    category: EventCategory.COLONIZATION,
    characters: ["Pero Lopes de Sousa", "Tomé de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 95,
    year: 1534,
    month: 3,
    day: 10,
    title: "Pero de Góis donatário",
    description: "10 de março: D. João III assina um 'alvará de lembrança' incluindo o nome de Pero de Góis entre os futuros donatários.",
    category: EventCategory.POLITICAL,
    characters: ["D. João III", "Pero de Góis"],
    source: "Capitães do Brasil"
  },
  {
    id: 96,
    year: 1534,
    month: "4/5",
    title: "Pero Lopes volta a Lisboa com Tibiriçá",
    description: "Abril/Maio: Chegada de Pero Lopes de volta a Lisboa, trazendo consigo o índio Tibiriçá.",
    category: EventCategory.COLONIZATION,
    characters: ["Pero Lopes de Sousa", "Tibiriçá"],
    source: "Capitães do Brasil"
  },
  {
    id: 97,
    year: 1534,
    title: "Inquisição em Portugal (início)",
    description: "Início do funcionamento da Inquisição em Portugal (suspensa em 1534 e retomada em 1536).",
    category: EventCategory.POLITICAL,
    source: "Capitães do Brasil"
  },
  {
    id: 98,
    year: 1534,
    title: "Engenho dos Adornos em São Vicente",
    description: "Fundação do Engenho dos Adornos em São Vicente pelos irmãos genoveses.",
    category: EventCategory.ECONOMIC,
    source: "Capitães do Brasil"
  },
  {
    id: 99,
    year: 1535,
    month: 5,
    title: "Capitanias 'couto e homizio'",
    description: "Maio: D. João III declara as capitanias do Brasil 'território de couto e homizio'.",
    category: EventCategory.LEGISLATION,
    characters: ["D. João III"],
    source: "Capitães do Brasil"
  },
  {
    id: 100,
    year: 1535,
    month: 6,
    title: "Minas de ouro e prata no Maranhão",
    description: "Junho: Assinatura do alvará concedendo as minas de ouro e prata encontradas no Maranhão aos donatários João de Barros, Fernão d’Álvares de Andrade e Aires da Cunha.",
    category: EventCategory.ECONOMIC,
    characters: ["D. João III", "João de Barros", "Fernão d’Álvares de Andrade", "Aires da Cunha"],
    source: "Capitães do Brasil"
  },
  {
    id: 101,
    year: 1535,
    month: 9,
    title: "Expedição de Aires da Cunha ao Maranhão",
    description: "Setembro: Partida da expedição de Aires da Cunha para o Maranhão.",
    category: EventCategory.COLONIZATION,
    characters: ["Aires da Cunha"],
    source: "Capitães do Brasil"
  },
  {
    id: 102,
    year: 1535,
    month: 9,
    day: 27,
    title: "Fundação de Igaraçu",
    description: "27 de setembro: Fundação da vila de Cosme e Damião (Igaraçu) por Duarte Coelho.",
    category: EventCategory.URBANIZATION,
    characters: ["Duarte Coelho"],
    source: "Capitães do Brasil"
  },
  {
    id: 103,
    year: 1535,
    month: 10,
    title: "Degredados para o Brasil",
    description: "Outubro: D. João III determina que os degredados passem a ser enviados para o Brasil.",
    category: EventCategory.POLITICAL,
    characters: ["D. João III"],
    source: "Capitães do Brasil"
  },
  {
    id: 104,
    year: 1535,
    month: 12,
    title: "Expedição de Romero à Bahia (possível)",
    description: "Dezembro: Possível chegada da expedição de Francisco Romero à Bahia.",
    category: EventCategory.COLONIZATION,
    characters: ["Francisco Pereira Coutinho"],
    source: "Capitães do Brasil"
  },
  {
    id: 105,
    year: 1536,
    title: "Naufrágio de Aires da Cunha no Maranhão",
    description: "Naufrágio da nau capitânia da expedição de Aires da Cunha no Maranhão.",
    category: EventCategory.COLONIZATION,
    characters: ["Aires da Cunha"],
    source: "Capitães do Brasil"
  },
  {
    id: 106,
    year: 1536,
    title: "Retorno da expedição de Aires da Cunha",
    description: "Retorno dos navios sobreviventes da expedição de Aires da Cunha a Portugal.",
    category: EventCategory.COLONIZATION,
    characters: ["Aires da Cunha"],
    source: "Capitães do Brasil"
  },
  {
    id: 107,
    year: 1536,
    month: 12,
    day: 20,
    title: "Sesmaria para Caramuru",
    description: "20 de dezembro: Francisco Pereira Coutinho doa uma sesmaria para Caramuru na Bahia.",
    category: EventCategory.POLITICAL,
    characters: ["Francisco Pereira Coutinho", "Diogo Álvares Correia (Caramuru)"],
    source: "Capitães do Brasil"
  },
  {
    id: 108,
    year: 1536,
    title: "Inquisição instalada",
    description: "Instalação definitiva da Inquisição em Portugal.",
    category: EventCategory.POLITICAL,
    source: "Capitães do Brasil"
  },
  {
    id: 109,
    year: 1537,
    title: "Massacre de Aires da Cunha",
    description: "Massacre da expedição de Aires da Cunha pelos Tupinambá no Maranhão.",
    category: EventCategory.REPRESSION,
    characters: ["Aires da Cunha", "Tupinambá"],
    source: "Capitães do Brasil"
  },
  {
    id: 110,
    year: 1537,
    title: "Encontro Coutinho e Góis",
    description: "Encontro entre Vasco Fernandes Coutinho e Pero de Góis na foz do rio Itapemirim.",
    category: EventCategory.COLONIZATION,
    characters: ["Vasco Fernandes Coutinho", "Pero de Góis"],
    source: "Capitães do Brasil"
  },
  {
    id: 111,
    year: 1538,
    title: "Pero Lopes volta ao Brasil (missão)",
    description: "D. João III envia Pero Lopes de volta ao Brasil com a missão de encontrar e prender João de Melo da Câmara.",
    category: EventCategory.POLITICAL,
    characters: ["D. João III", "Pero Lopes de Sousa", "João de Melo da Câmara"],
    source: "Capitães do Brasil"
  },
  {
    id: 112,
    year: 1538,
    title: "Morte de Pero Lopes",
    description: "Naufrágio e morte de Pero Lopes durante a viagem de volta da Bahia para Portugal.",
    category: EventCategory.COLONIZATION,
    characters: ["Pero Lopes de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 113,
    year: 1541,
    month: 4,
    day: 7,
    title: "Martim Afonso parte para a Índia",
    description: "7 de abril: Martim Afonso de Sousa parte de Lisboa para a Índia.",
    category: EventCategory.COLONIZATION,
    characters: ["Martim Afonso de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 114,
    year: 1541,
    title: "Engenho de açúcar em São Vicente",
    description: "Contrato firmado entre Martim Afonso de Sousa e Johann van Hielst para a construção de um engenho de açúcar em São Vicente.",
    category: EventCategory.ECONOMIC,
    characters: ["Martim Afonso de Sousa", "Johann van Hielst"],
    source: "Capitães do Brasil"
  },
  {
    id: 115,
    year: 1542,
    title: "Engenho do Governador (São Vicente)",
    description: "Início da construção do Engenho do Governador (futuro Engenho de São Jorge dos Erasmos) em São Vicente.",
    category: EventCategory.ECONOMIC,
    source: "Capitães do Brasil"
  },
  {
    id: 116,
    year: 1545,
    title: "Morte de Coutinho",
    description: "Assassinato de Francisco Pereira Coutinho pelos Tupinambá na Bahia.",
    category: EventCategory.REPRESSION,
    characters: ["Francisco Pereira Coutinho", "Tupinambá"],
    source: "Capitães do Brasil"
  },
  {
    id: 117,
    year: 1545,
    title: "Mina de Potosí",
    description: "Descoberta da mina de prata de Potosí pelos espanhóis.",
    category: EventCategory.ECONOMIC,
    source: "Capitães do Brasil"
  },
  {
    id: 118,
    year: 1545,
    title: "Décadas da Ásia (início)",
    description: "Início da redação de As Décadas da Ásia por João de Barros.",
    category: EventCategory.INTELLECTUAL,
    characters: ["João de Barros"],
    source: "Capitães do Brasil"
  },
  {
    id: 119,
    year: 1548,
    month: 5,
    day: 12,
    title: "Carta de Luís de Góis ao rei",
    description: "12 de maio: Luís de Góis escreve uma carta ao rei D. João III pedindo ajuda para combater os franceses e os indígenas em São Vicente.",
    category: EventCategory.POLITICAL,
    characters: ["Luís de Góis", "D. João III"],
    source: "Capitães do Brasil"
  },
  {
    id: 120,
    year: 1548,
    title: "Retorno de Pero de Góis a Portugal",
    description: "Retorno de Pero de Góis a Portugal.",
    category: EventCategory.COLONIZATION,
    characters: ["Pero de Góis"],
    source: "Capitães do Brasil"
  },
  {
    id: 121,
    year: 1548,
    title: "Expedição de Tomé de Sousa",
    description: "Partida da expedição de Tomé de Sousa para o Brasil.",
    category: EventCategory.COLONIZATION,
    characters: ["Tomé de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 122,
    year: 1549,
    title: "Chegada de Tomé de Sousa e fundação de Salvador",
    description: "Chegada de Tomé de Sousa ao Brasil e fundação de Salvador.",
    category: EventCategory.URBANIZATION,
    characters: ["Tomé de Sousa"],
    source: "Capitães do Brasil"
  },
  {
    id: 123,
    year: 1553,
    month: 7,
    title: "Schmidel em São Vicente e Piratininga",
    description: "Julho: Ulrich Schmidel passa por Piratininga e São Vicente durante sua viagem de volta para a Alemanha.",
    category: EventCategory.COLONIZATION,
    characters: ["Ulrich Schmidel"],
    source: "Capitães do Brasil"
  },
  {
    id: 124,
    year: 1555,
    title: "Retorno de Coutinho a Portugal",
    description: "Vasco Fernandes Coutinho retorna a Portugal 'velho, pobre e cansado'.",
    category: EventCategory.COLONIZATION,
    characters: ["Vasco Fernandes Coutinho"],
    source: "Capitães do Brasil"
  },
  {
    id: 125,
    year: 1561,
    title: "Morte de Vasco Coutinho",
    description: "Morte de Vasco Fernandes Coutinho em Portugal.",
    category: EventCategory.COLONIZATION,
    characters: ["Vasco Fernandes Coutinho"],
    source: "Capitães do Brasil"
  }
];

export const capitaesBrasilPeriods: TimelinePeriod[] = [
  {
    id: 6,
    startYear: 1500,
    endYear: 1530,
    title: "Primeiros Contatos e Expedições",
    description: "Período inicial de chegada dos portugueses, reconhecimento da costa e exploração do pau-brasil.",
    source: "Capitães do Brasil"
  },
  {
    id: 7,
    startYear: 1530,
    endYear: 1549,
    title: "Implementação das Capitanias Hereditárias",
    description: "Sistema de capitanias hereditárias, fundação das primeiras vilas e engenhos, e desafios da colonização.",
    source: "Capitães do Brasil"
  }
];

export const capitaesBrasilCharacters: Character[] = [
  {
    id: "d_joao_iii",
    name: "D. João III",
    description: "Rei de Portugal de 1521 a 1557. Enfrentou dificuldades financeiras, guerras no exterior e a ameaça francesa no Brasil. Dividiu o Brasil em capitanias hereditárias e enviou Tomé de Sousa para fundar Salvador.",
    relatedEvents: [80, 89, 92, 95, 99, 103, 111, 119],
    source: "Capitães do Brasil"
  },
  {
    id: "d_antonio_de_ataide",
    name: "D. Antônio de Ataíde",
    description: "Conde da Castanheira, poderoso ministro de D. João III. Influenciou a decisão de dividir o Brasil em capitanias e teve papel fundamental na organização da expedição de Tomé de Sousa.",
    relatedEvents: [],
    source: "Capitães do Brasil"
  },
  {
    id: "martim_afonso_de_sousa",
    name: "Martim Afonso de Sousa",
    description: "Fundou São Vicente e Piratininga. Combateu franceses no Brasil e na Índia. Governou a Índia entre 1542 e 1545. Recebeu as capitanias de São Vicente e do Maranhão.",
    relatedEvents: [81, 82, 83, 86, 87, 88, 89, 90, 91, 113, 114],
    source: "Capitães do Brasil"
  },
  {
    id: "pero_lopes_de_sousa",
    name: "Pero Lopes de Sousa",
    description: "Irmão de Martim Afonso. Participou da expedição de 1530 e da fundação de São Vicente. Recebeu as capitanias de Santo Amaro e Itamaracá.",
    relatedEvents: [88, 94, 96, 111, 112],
    source: "Capitães do Brasil"
  },
  {
    id: "pero_de_gois",
    name: "Pero de Góis",
    description: "Donatário de São Tomé. Fundou a Vila da Rainha e construiu o primeiro engenho de açúcar em sua capitania. Sofreu com ataques indígenas e com a invasão de piratas franceses.",
    relatedEvents: [95, 110, 120],
    source: "Capitães do Brasil"
  },
  {
    id: "vasco_fernandes_coutinho",
    name: "Vasco Fernandes Coutinho",
    description: "Donatário do Espírito Santo. Fundou Vila Velha e enfrentou rebeliões de colonos e ataques indígenas. Morreu na miséria em Portugal.",
    relatedEvents: [110, 124, 125],
    source: "Capitães do Brasil"
  },
  {
    id: "duarte_coelho",
    name: "Duarte Coelho",
    description: "Donatário de Pernambuco. Fundou Igaraçu e lutou contra traficantes franceses e indígenas. Implementou com sucesso a cultura da cana-de-açúcar em sua capitania.",
    relatedEvents: [102],
    source: "Capitães do Brasil"
  },
  {
    id: "jorge_de_figueiredo_correia",
    name: "Jorge de Figueiredo Correia",
    description: "Donatário de Ilhéus. Morreu antes de tomar posse de sua capitania.",
    relatedEvents: [],
    source: "Capitães do Brasil"
  },
  {
    id: "francisco_pereira_coutinho",
    name: "Francisco Pereira Coutinho",
    description: "Donatário da Bahia de Todos os Santos. Enfrentou rebeliões de colonos e foi morto pelos Tupinambá.",
    relatedEvents: [104, 107, 116],
    source: "Capitães do Brasil"
  },
  {
    id: "pero_do_campo_tourinho",
    name: "Pero do Campo Tourinho",
    description: "Donatário de Porto Seguro. Enfrentou dificuldades para colonizar sua capitania devido à resistência indígena.",
    relatedEvents: [],
    source: "Capitães do Brasil"
  },
  {
    id: "joao_de_barros",
    name: "João de Barros",
    description: "Famoso historiador e linguista português. Recebeu as capitanias do Maranhão (em conjunto com Fernão d’Álvares de Andrade e Aires da Cunha) e do Rio Grande.",
    relatedEvents: [100, 118],
    source: "Capitães do Brasil"
  },
  {
    id: "fernao_d_alvares_de_andrade",
    name: "Fernão d’Álvares de Andrade",
    description: "Tesoureiro-mor de D. João III. Recebeu as capitanias do Maranhão (em conjunto com João de Barros e Aires da Cunha) e de Pernambuco.",
    relatedEvents: [100],
    source: "Capitães do Brasil"
  },
  {
    id: "aires_da_cunha",
    name: "Aires da Cunha",
    description: "Militar e navegador português. Recebeu a capitania do Maranhão (em conjunto com João de Barros e Fernão d’Álvares de Andrade).",
    relatedEvents: [101, 105, 106, 109, 100],
    source: "Capitães do Brasil"
  },
  {
    id: "diogo_alvares_correia_caramuru",
    name: "Diogo Álvares Correia (Caramuru)",
    description: "Náufrago português que viveu entre os Tupinambá na Bahia. Serviu como intermediário entre os indígenas e os portugueses.",
    relatedEvents: [77, 107],
    source: "Capitães do Brasil"
  },
  {
    id: "goncalo_da_costa",
    name: "Gonçalo da Costa",
    description: "Navegador português a serviço da Espanha. Participou da expedição de Sebastián Caboto ao Rio da Prata.",
    relatedEvents: [79, 80, 85],
    source: "Capitães do Brasil"
  },
  {
    id: "ulrich_schmidel",
    name: "Ulrich Schmidel",
    description: "Mercenário alemão que participou da expedição de Pedro de Mendoza ao Rio da Prata. Deixou um relato detalhado sobre a expedição e sobre a cultura indígena.",
    relatedEvents: [123],
    source: "Capitães do Brasil"
  },
  {
    id: "hans_staden",
    name: "Hans Staden",
    description: "Aventureiro alemão que viveu entre os Tupinambá no Brasil. Foi feito prisioneiro e quase devorado pelos indígenas.",
    relatedEvents: [],
    source: "Capitães do Brasil"
  },
  {
    id: "jean_ango",
    name: "Jean Ango",
    description: "Mercador e corsário francês. Financiou expedições ao Brasil para o comércio ilegal de pau-brasil.",
    relatedEvents: [78],
    source: "Capitães do Brasil"
  },
  {
    id: "johann_van_hielst",
    name: "Johann van Hielst",
    description: "Mercador holandês. Construiu o Engenho do Governador em São Vicente, um dos primeiros engenhos de açúcar do Brasil.",
    relatedEvents: [114],
    source: "Capitães do Brasil"
  },
  {
    id: "d_pedro_de_mendoza",
    name: "D. Pedro de Mendoza",
    description: "Conquistador espanhol. Liderou a expedição que fundou Buenos Aires.",
    relatedEvents: [93],
    source: "Capitães do Brasil"
  },
  {
    id: "tome_de_sousa",
    name: "Tomé de Sousa",
    description: "Primeiro governador-geral do Brasil. Fundou Salvador.",
    relatedEvents: [94, 121, 122],
    source: "Capitães do Brasil"
  },
  {
    id: "pero_lopes",
    name: "Pero Lopes",
    description: "Irmão de Martim Afonso de Sousa, participou das primeiras expedições ao Brasil.",
    relatedEvents: [88, 94, 96, 111, 112],
    source: "Capitães do Brasil"
  },
  {
    id: "d_isabel",
    name: "D. Isabel",
    description: "Rainha de Portugal durante o período das grandes navegações.",
    relatedEvents: [85],
    source: "Capitães do Brasil"
  },
  {
    id: "tibiriça",
    name: "Tibiriçá",
    description: "Líder indígena tupiniquim que se aliou aos portugueses.",
    relatedEvents: [96],
    source: "Capitães do Brasil"
  },
  {
    id: "joao_de_lisboa",
    name: "João de Lisboa",
    description: "Navegador português que descobriu o Rio da Prata.",
    relatedEvents: [76],
    source: "Capitães do Brasil"
  },
  {
    id: "d_nuno_da_cunha",
    name: "D. Nuno da Cunha",
    description: "Governador da Índia Portuguesa que sofreu uma derrota em Diu.",
    relatedEvents: [92],
    source: "Capitães do Brasil"
  },
  {
    id: "joao_de_sousa",
    name: "João de Sousa",
    description: "Navegador português que retornou a Portugal com pau-brasil e traficantes franceses.",
    relatedEvents: [84, 90],
    source: "Capitães do Brasil"
  },
  {
    id: "francisco_romero",
    name: "Francisco Romero",
    description: "Líder de uma expedição à Bahia.",
    relatedEvents: [104],
    source: "Capitães do Brasil"
  },
  {
    id: "joao_de_melo_da_camara",
    name: "João de Melo da Câmara",
    description: "Figura a ser presa por ordem de D. João III.",
    relatedEvents: [111],
    source: "Capitães do Brasil"
  },
  {
    id: "luis_de_gois",
    name: "Luís de Góis",
    description: "Residente em São Vicente que pediu ajuda ao rei contra franceses e indígenas.",
    relatedEvents: [119],
    source: "Capitães do Brasil"
  },
  {
    id: "fernao_alvares_de_andrade",
    name: "Fernão Álvares de Andrade",
    description: "Donatário do Maranhão e Pernambuco.",
    relatedEvents: [100],
    source: "Capitães do Brasil"
  }
];
