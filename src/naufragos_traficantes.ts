import { TimelineEvent, TimelinePeriod, Character, EventCategory } from './types';

export const naufragosEvents: TimelineEvent[] = [
  {
    id: 1000,
    century: "Século XII",
    year: 1100,
    title: "Comércio de pau-brasil na Europa",
    description: "O pau-brasil ('bersil' em francês) já era comercializado na Europa, especialmente na França e Itália, utilizado como corante para tecidos.",
    category: EventCategory.ECONOMIC,
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1001,
    year: 1398,
    title: "Criação do Real português",
    description: "Criação do Real português pelo rei D. João I.",
    category: EventCategory.ECONOMIC,
    characters: ["D. João I"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1002,
    year: 1438,
    title: "Auxílio português na construção naval francesa",
    description: "Mestres e carpinteiros portugueses auxiliam na construção naval na Normandia e Bretanha, França.",
    category: EventCategory.ECONOMIC,
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1003,
    year: 1448,
    title: "Fundação do entreposto comercial em Arguim",
    description: "Portugal funda o primeiro entreposto comercial na ilha de Arguim, África, marcando o início da expansão ultramarina.",
    category: EventCategory.ECONOMIC,
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1004,
    year: 1489,
    title: "Criação do Cruzado português",
    description: "Criação do Cruzado português pelo rei Afonso V.",
    category: EventCategory.ECONOMIC,
    characters: ["Afonso V"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1005,
    year: 1492,
    title: "Colombo chega à América",
    description: "Cristóvão Colombo chega à América, acreditando ter alcançado a Ásia.",
    category: EventCategory.EXPLORATION,
    characters: ["Cristóvão Colombo"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1006,
    year: 1494,
    title: "Tratado de Tordesilhas",
    description: "Assinatura do Tratado de Tordesilhas, dividindo o mundo entre Portugal e Espanha.",
    category: EventCategory.INTERNATIONAL,
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1007,
    year: 1497,
    title: "Expedição de Vasco da Gama e conversões forçadas de judeus",
    description: "Vasco da Gama inicia sua expedição que culminaria na descoberta do caminho marítimo para a Índia.\nInício das conversões forçadas de judeus ao cristianismo em Portugal, dando origem aos 'cristãos-novos'.",
    category: EventCategory.EXPLORATION,
    characters: ["Vasco da Gama"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1008,
    year: 1498,
    month: 5,
    day: 27,
    title: "Vasco da Gama chega a Calicute",
    description: "Vasco da Gama chega a Calicute, Índia, consolidando a rota marítima para o comércio de especiarias.",
    category: EventCategory.EXPLORATION,
    characters: ["Vasco da Gama"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1009,
    year: 1499,
    month: 6,
    title: "Retorno de Vasco da Gama e exploração de Hojeda e Vespúcio",
    description: "Vasco da Gama retorna a Lisboa com a notícia da rota para a Índia.\nAlonso de Hojeda e Américo Vespúcio exploram a costa da América do Sul, chegando à Guiana, Venezuela e Caribe, mas não ao Brasil, como defendido posteriormente por alguns historiadores.",
    category: EventCategory.EXPLORATION,
    characters: ["Vasco da Gama", "Alonso de Hojeda", "Américo Vespúcio"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1010,
    year: 1500,
    month: 3,
    day: 9,
    title: "Partida de Cabral para a Índia",
    description: "Partida de Pedro Álvares Cabral de Lisboa, com uma frota de 13 navios, com o objetivo de estabelecer uma feitoria em Calicute, Índia.",
    category: EventCategory.EXPLORATION,
    characters: ["Pedro Álvares Cabral"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1011,
    year: 1500,
    month: 1,
    day: 26,
    title: "Chegada de Cabral ao Brasil",
    description: "Pedro Álvares Cabral chega ao Brasil, no local hoje conhecido como Porto Seguro, Bahia.",
    category: EventCategory.EXPLORATION,
    characters: ["Pedro Álvares Cabral"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1012,
    year: 1500,
    month: 6,
    title: "Retorno de Gaspar de Lemos a Lisboa",
    description: "Gaspar de Lemos, comandante de um dos navios da frota de Cabral, retorna a Lisboa com a notícia da descoberta e amostras do Brasil, incluindo o primeiro indígena brasileiro a pisar em Portugal.",
    category: EventCategory.EXPLORATION,
    characters: ["Gaspar de Lemos"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1013,
    year: 1501,
    month: 3,
    day: 10,
    title: "Partida de Gonçalo Coelho e Vespúcio",
    description: "Partida de Gonçalo Coelho, com Américo Vespúcio como cosmógrafo ou piloto, para explorar o litoral brasileiro.",
    category: EventCategory.EXPLORATION,
    characters: ["Gonçalo Coelho", "Américo Vespúcio"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1014,
    year: 1501,
    month: 4,
    title: "Escala de João da Nova no Brasil",
    description: "Escala no Brasil da frota de João da Nova, a caminho da Índia, evidenciando a importância estratégica da nova terra como ponto de parada na rota para o Oriente.",
    category: EventCategory.EXPLORATION,
    characters: ["João da Nova"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1015,
    year: 1501,
    month: 5,
    endMonth: 7,
    title: "Exploração do litoral brasileiro por Vespúcio",
    description: "Vespúcio, a bordo da expedição de Gonçalo Coelho, percorre o litoral brasileiro, explorando desde o Rio Grande do Norte até o Cabo Frio, consolidando a ideia da existência de um novo continente.",
    category: EventCategory.EXPLORATION,
    characters: ["Américo Vespúcio", "Gonçalo Coelho"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1016,
    year: 1501,
    month: 6,
    day: 2,
    title: "Encontro em Bezeguiche",
    description: "Encontro em Bezeguiche, África, entre as frotas de Gonçalo Coelho, Diogo Dias (irmão de Bartolomeu Dias) e dois navios da esquadra de Cabral, que retornavam da Índia. Esse encontro possibilita a troca de informações cruciais sobre a Índia e o Brasil.",
    category: EventCategory.INTERNATIONAL,
    characters: ["Gonçalo Coelho", "Diogo Dias", "Pedro Álvares Cabral"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1017,
    year: 1502,
    month: 5,
    day: 10,
    title: "Expedição de Coelho chega a Serra Leoa",
    description: "Após explorar a costa brasileira, a expedição de Gonçalo Coelho chega a Serra Leoa, África.",
    category: EventCategory.EXPLORATION,
    characters: ["Gonçalo Coelho"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1018,
    year: 1502,
    month: 7,
    day: 22,
    title: "Retorno da expedição de Gonçalo Coelho",
    description: "Retorno da expedição de Gonçalo Coelho a Lisboa, trazendo consigo a confirmação de que o Brasil não oferecia ouro ou especiarias, como a Índia.",
    category: EventCategory.EXPLORATION,
    characters: ["Gonçalo Coelho"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1019,
    year: 1503,
    month: 5,
    day: 20,
    title: "Depoimento de Afonso Ribeiro",
    description: "Afonso Ribeiro, degredado deixado no Brasil por Vespúcio em 1502, presta depoimento em Portugal sobre os costumes dos indígenas. Esse depoimento, juntamente com as cartas de Vespúcio, ajuda a construir a imagem do Brasil na Europa.",
    category: EventCategory.CULTURAL,
    characters: ["Afonso Ribeiro", "Américo Vespúcio"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1020,
    year: 1503,
    month: 6,
    day: 10,
    title: "Segunda expedição de Gonçalo Coelho e Vespúcio",
    description: "Partida da segunda expedição de Gonçalo Coelho ao Brasil, acompanhado novamente por Américo Vespúcio, com o objetivo de explorar o litoral e estabelecer uma feitoria.",
    category: EventCategory.EXPLORATION,
    characters: ["Gonçalo Coelho", "Américo Vespúcio"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1021,
    year: 1504,
    month: 2,
    title: "Retorno de Vespúcio a Portugal",
    description: "Vespúcio, após desentendimentos com Gonçalo Coelho, retorna a Portugal a bordo de um navio espanhol, levando consigo a certeza de que o Brasil é parte de um novo continente e a convicção da existência de um estreito que levaria às Índias.",
    category: EventCategory.EXPLORATION,
    characters: ["Américo Vespúcio", "Gonçalo Coelho"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1022,
    year: 1504,
    month: 4,
    day: 24,
    title: "Vespúcio naturaliza-se espanhol",
    description: "Américo Vespúcio naturaliza-se espanhol.",
    category: EventCategory.POLITICAL,
    characters: ["Américo Vespúcio"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1023,
    year: 1505,
    title: "Início do comércio sistemático de pau-brasil",
    description: "Início do comércio sistemático de pau-brasil, com o estabelecimento de feitorias no litoral brasileiro, marcando o início da exploração econômica da nova terra.\nO Brasil passa a ser conhecido como 'Terra dos Papagaios', devido ao grande número dessas aves levadas para a Europa.",
    category: EventCategory.ECONOMIC,
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1024,
    year: 1506,
    month: 4,
    day: 5,
    title: "Partida frustrada de Tristão da Cunha",
    description: "Partida frustrada da frota de Tristão da Cunha para a Índia devido ao desaparecimento do piloto Juan Díaz de Solís, que se aventurava em busca do lendário estreito para o Oriente.",
    category: EventCategory.EXPLORATION,
    characters: ["Tristão da Cunha", "Juan Díaz de Solís"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1025,
    year: 1510,
    title: "Brasil - Terra do Brasil",
    description: "O Brasil consolida-se como 'Terra do Brasil', devido à intensificação do comércio de pau-brasil.",
    category: EventCategory.ECONOMIC,
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1026,
    year: 1511,
    month: 2,
    day: 22,
    title: "Partida da nau Bretoa",
    description: "Partida da nau Bretoa, financiada por Fernando de Noronha e Bartolomeu Marchioni, com o objetivo de comercializar pau-brasil no Brasil.",
    category: EventCategory.ECONOMIC,
    characters: ["Fernando de Noronha", "Bartolomeu Marchioni"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1027,
    year: 1511,
    month: 5,
    day: 12,
    title: "Bretoa deixa a Bahia carregada",
    description: "A Bretoa deixa a Bahia com uma carga de pau-brasil e animais, após um incidente envolvendo o roubo de ferramentas da embarcação, provavelmente para comércio ilegal com os indígenas.",
    category: EventCategory.ECONOMIC,
    characters: ["Duarte Fernandes", "Cristóvão Pires"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1028,
    year: 1511,
    month: 10,
    title: "Retorno da Bretoa a Lisboa",
    description: "Retorno da nau Bretoa a Lisboa com lucro de quatro mil ducados, evidenciando a lucratividade do comércio de pau-brasil, apesar das dificuldades e da rígida regulamentação.",
    category: EventCategory.ECONOMIC,
    characters: ["Duarte Fernandes", "Cristóvão Pires"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1029,
    year: 1511,
    title: "Aumento da presença francesa",
    description: "Aumento da presença francesa no litoral brasileiro, com navios normandos e bretões buscando pau-brasil, desafiando o monopólio português e estabelecendo relações com tribos indígenas.",
    category: EventCategory.INTERNATIONAL,
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1030,
    year: 1514,
    month: 4,
    title: "Exploração do Rio da Prata por Lisboa e Fróis",
    description: "João de Lisboa e Estevão Fróis, a serviço da Coroa portuguesa, exploram o Rio da Prata, buscando o caminho para as Molucas e consolidando a presença portuguesa na região.",
    category: EventCategory.EXPLORATION,
    characters: ["João de Lisboa", "Estevão Fróis"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1031,
    year: 1516,
    month: 1,
    title: "Morte de Solís no Rio da Prata",
    description: "Tragédia no Rio da Prata: Juan Díaz de Solís é morto por índios Charruas, marcando o fracasso da expedição espanhola em busca do estreito para o Oriente e o início da saga dos náufragos da expedição.",
    category: EventCategory.EXPLORATION,
    characters: ["Juan Díaz de Solís"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1032,
    year: 1516,
    month: 9,
    title: "Jaques resgata náufragos de Solís",
    description: "Cristóvão Jaques, a bordo da expedição portuguesa liderada por Duarte Coelho, chega à Ilha de Santa Catarina e resgata alguns náufragos da expedição de Solís, incluindo Francisco del Puerto, obtendo informações valiosas sobre o Rio da Prata.",
    category: EventCategory.EXPLORATION,
    characters: ["Cristóvão Jaques", "Duarte Coelho", "Francisco del Puerto"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1033,
    year: 1519,
    month: 9,
    day: 20,
    title: "Partida de Magalhães",
    description: "Partida de Fernão de Magalhães de Sanlúcar de Barrameda, Espanha, com o objetivo de encontrar uma nova rota para as Índias, contornando a América pelo sul.",
    category: EventCategory.EXPLORATION,
    characters: ["Fernão de Magalhães"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1034,
    year: 1520,
    month: 11,
    title: "Magalhães atravessa o estreito",
    description: "Magalhães atravessa o estreito que leva seu nome, na extremidade sul da América do Sul, abrindo caminho para o Oceano Pacífico.",
    category: EventCategory.EXPLORATION,
    characters: ["Fernão de Magalhães"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1035,
    year: 1521,
    month: 11,
    title: "Segunda expedição de Jaques ao Rio da Prata",
    description: "Cristóvão Jaques inicia sua segunda expedição ao Brasil, com o objetivo de explorar o Rio da Prata, tendo como guia Melchior Ramires, um dos náufragos de Solís, que vivia entre os índios Carijó em Santa Catarina.",
    category: EventCategory.EXPLORATION,
    characters: ["Cristóvão Jaques", "Melchior Ramires"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1036,
    year: 1521,
    month: 12,
    title: "Expedição de Magalhães chega às Molucas",
    description: "A expedição de Magalhães, após a morte do navegador nas Filipinas, chega às Ilhas Molucas, comprovando a possibilidade de alcançar as 'Ilhas das Especiarias' navegando para oeste.",
    category: EventCategory.EXPLORATION,
    characters: ["Fernão de Magalhães"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1037,
    year: 1522,
    month: 4,
    title: "Retorno de Jaques e abandono de náufragos",
    description: "Cristóvão Jaques retorna a Portugal, abandonando Melchior Ramires em Santa Catarina e Jorge Gomes em Itamaracá, demonstrando o pouco caso com o destino daqueles que se aventuravam na nova terra.",
    category: EventCategory.EXPLORATION,
    characters: ["Cristóvão Jaques", "Melchior Ramires"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1038,
    year: 1525,
    month: 7,
    title: "Partida de Loyasa para as Molucas",
    description: "Partida de Jofre de Loyasa de Sevilha, com a missão de reivindicar as Ilhas Molucas para a Espanha, utilizando a rota descoberta por Magalhães.",
    category: EventCategory.EXPLORATION,
    characters: ["Jofre de Loyasa"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1039,
    year: 1526,
    month: 8,
    title: "Naufrágio de Acuña em Santa Catarina",
    description: "D. Rodrigo Acuña, capitão de um dos navios da expedição de Loyasa, naufraga no litoral de Santa Catarina e encontra os náufragos de Solís, vivendo 'como selvagens' e alimentando o mito de uma terra de riquezas e vida fácil.",
    category: EventCategory.EXPLORATION,
    characters: ["D. Rodrigo de Acuña", "Jofre de Loyasa"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1040,
    year: 1526,
    title: "Verrazzano no Brasil",
    description: "Os irmãos Verrazzano, navegando sob bandeira francesa, chegam ao Brasil em busca de pau-brasil, consolidando a rota entre a Normandia e o litoral brasileiro.",
    category: EventCategory.EXPLORATION,
    characters: ["Giovanni da Verrazzano", "Girolamo da Verrazzano"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1041,
    year: 1527,
    month: 8,
    title: "Partida de Diego Garcia",
    description: "Diego Garcia parte de Palos, Espanha, com a missão de encontrar e prender os amotinados da expedição de Loyasa, incluindo Sebastião Caboto, que se aventurava pelo Rio da Prata.",
    category: EventCategory.EXPLORATION,
    characters: ["Diego Garcia", "Jofre de Loyasa", "Sebastião Caboto"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1042,
    year: 1528,
    month: 2,
    title: "Garcia chega ao Rio da Prata",
    description: "Diego Garcia chega ao Rio da Prata e inicia a exploração da região, utilizando o bergantim comprado de Gonçalo da Costa, genro do enigmático Bacharel de Cananéia.",
    category: EventCategory.EXPLORATION,
    characters: ["Diego Garcia", "Gonçalo da Costa", "Bacharel de Cananéia"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1043,
    year: 1528,
    month: 5,
    day: 7,
    title: "Encontro Garcia e Caboto",
    description: "Encontro no Rio da Prata entre as expedições de Diego Garcia e Sebastião Caboto, representando os interesses da Espanha e evidenciando a disputa pela região.",
    category: EventCategory.EXPLORATION,
    characters: ["Diego Garcia", "Sebastião Caboto"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1044,
    year: 1529,
    month: 4,
    day: 22,
    title: "Tratado de Saragoça",
    description: "Assinatura do Tratado de Saragoça, no qual a Espanha cede à Portugal o direito de explorar as Ilhas Molucas, em troca de 350 mil ducados, marcando um momento decisivo na partilha do mundo entre as duas potências.",
    category: EventCategory.INTERNATIONAL,
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1045,
    year: 1530,
    month: 12,
    day: 3,
    title: "Partida de Martim Afonso de Sousa",
    description: "Partida de Martim Afonso de Sousa de Lisboa com a missão de explorar o litoral brasileiro, expulsar os franceses e buscar o lendário Rei Branco e suas riquezas. A expedição conta com a participação de Henrique Montes, antigo náufrago de Solís.",
    category: EventCategory.EXPLORATION,
    characters: ["Martim Afonso de Sousa", "Henrique Montes"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1046,
    year: 1531,
    month: 3,
    title: "Fundação da vila no Rio de Janeiro",
    description: "Martim Afonso de Sousa funda uma pequena vila fortificada no Rio de Janeiro, preparando-se para a expedição ao Rio da Prata.",
    category: EventCategory.COLONIZATION,
    characters: ["Martim Afonso de Sousa"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1047,
    year: 1531,
    month: 10,
    day: 21,
    title: "Naufrágio de Martim Afonso de Sousa",
    description: "Naufrágio de Martim Afonso de Sousa na foz do Rio da Prata, forçando o adiamento da busca pelo Rei Branco e evidenciando os perigos da navegação na região.",
    category: EventCategory.EXPLORATION,
    characters: ["Martim Afonso de Sousa"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1048,
    year: 1532,
    month: 1,
    title: "Retorno de Martim Afonso a São Vicente",
    description: "Martim Afonso de Sousa retorna a São Vicente, encontrando João Ramalho, português que vivia entre os índios há décadas, consolidando o domínio português na região.",
    category: EventCategory.COLONIZATION,
    characters: ["Martim Afonso de Sousa", "João Ramalho"],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: 1049,
    year: 1532,
    title: "Feitiço do Peru e Capitanias Hereditárias",
    description: "O 'feitiço do Peru', com a descoberta de imensas jazidas de prata em Potosí, desvia as atenções de Portugal para a América Espanhola, impactando a colonização do Brasil.\nD. João III inicia a implantação do sistema de Capitanias Hereditárias no Brasil, marcando o início da ocupação sistemática do território.",
    category: EventCategory.COLONIZATION,
    characters: ["D. João III"],
    source: "Náufragos, traficantes e degredados"
  },
];

export const naufragosPeriods: TimelinePeriod[] = [];

export const naufragosCharacters: Character[] = [
  {
    id: "d_joao_ii",
    name: "D. João II",
    description: "Rei de Portugal de 1481 até sua morte. Visionário, impulsionou a expansão marítima portuguesa, financiando expedições como a de Diogo Cão e Bartolomeu Dias. Acreditava na viabilidade de alcançar a Índia por mar.",
    relatedEvents: [1001],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "d_manuel_i",
    name: "D. Manoel I",
    description: "Rei de Portugal de 1495 a 1521. Conhecido como 'O Venturoso', seu reinado marcou o auge do Império Português, com a descoberta do Brasil e a consolidação das rotas para o Oriente.",
    relatedEvents: [1007],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "d_joao_iii",
    name: "D. João III",
    description: "Rei de Portugal de 1521 a 1557. Enfrentou os desafios da consolidação do Império Português, implementando o sistema de capitanias hereditárias no Brasil e combatendo a pirataria francesa.",
    relatedEvents: [1049],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "pedro_alvares_cabral",
    name: "Pedro Álvares Cabral",
    description: "Comandante da expedição que oficialmente descobriu o Brasil em 1500. Nobre experiente, já havia realizado outras missões navais importantes para a Coroa Portuguesa.",
    relatedEvents: [1010, 1011, 1016],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "gaspar_de_lemos",
    name: "Gaspar de Lemos",
    description: "Capitão de um dos navios da frota de Cabral, encarregado de retornar a Lisboa com a notícia da descoberta do Brasil, levando consigo as primeiras amostras da terra e um indígena.",
    relatedEvents: [1012],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "goncalo_coelho",
    name: "Gonçalo Coelho",
    description: "Navegador experiente, comandou duas expedições ao Brasil (1501-1502 e 1503-1504), acompanhado por Américo Vespúcio. Explorou o litoral brasileiro, contribuindo para a compreensão de sua extensão e características.",
    relatedEvents: [1013, 1015, 1016, 1017, 1018, 1020, 1021],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "afonso_ribeiro",
    name: "Afonso Ribeiro",
    description: "Degredado deixado no Brasil por Américo Vespúcio em 1502 e resgatado em 1503. Seu depoimento sobre os costumes indígenas, registrado em cartório, contribuiu para a construção da imagem do Brasil na Europa.",
    relatedEvents: [1019],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "fernando_de_noronha",
    name: "Fernando de Noronha",
    description: "Rico comerciante e armador português de origem judaica. Obteve o monopólio da exploração do pau-brasil por dez anos, financiando expedições e lucrando com o comércio da madeira.",
    relatedEvents: [1026],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "duarte_fernandes",
    name: "Duarte Fernandes",
    description: "Escrivão da nau Bretoa, responsável pelo detalhado registro da viagem e do regimento da embarcação em 1511. Seu meticuloso trabalho fornece informações valiosas sobre o cotidiano da exploração do pau-brasil.",
    relatedEvents: [1027, 1028, 1032],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "cristovao_pires",
    name: "Cristóvão Pires",
    description: "Capitão da nau Bretoa, comandando a expedição comercial ao Brasil em 1511.",
    relatedEvents: [1027, 1028],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "joao_de_lisboa",
    name: "João de Lisboa",
    description: "Piloto e navegador português, participou de diversas expedições, incluindo a exploração do Rio da Prata em 1514, abrindo caminho para a expansão territorial portuguesa.",
    relatedEvents: [1030],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "estevao_frois",
    name: "Estevão Fróis",
    description: "Navegador português, co-comandou com João de Lisboa a expedição que explorou o Rio da Prata em 1514.",
    relatedEvents: [1030],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "tristao_da_cunha",
    name: "Tristão da Cunha",
    description: "Experiente almirante português, liderou uma expedição à Índia em 1506, frustrada pela deserção do piloto Juan Díaz de Solís.",
    relatedEvents: [1024],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "cristovao_jaques",
    name: "Cristóvão Jaques",
    description: "Navegador português que realizou duas viagens ao Brasil (1516 e 1521-1522), a segunda com o objetivo de explorar o Rio da Prata. Resgatou e abandonou náufragos da expedição de Solís, demonstrando o caráter pragmático e cruel da exploração colonial.",
    relatedEvents: [1032, 1035, 1037],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "melchior_ramires",
    name: "Melchior Ramires",
    description: "Piloto português, sobrevivente da expedição de Solís que naufragou no Rio da Prata. Viveu por cinco anos entre os índios Carijó em Santa Catarina, tornando-se guia e intérprete para expedições portuguesas e espanholas, incluindo as de Cristóvão Jaques e Sebastião Caboto.",
    relatedEvents: [1035, 1037],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "francisco_del_puerto",
    name: "Francisco del Puerto",
    description: "Marinheiro espanhol, sobrevivente da expedição de Solís. Passou anos vivendo entre os índios Charruas no Rio da Prata, sendo resgatado por Cristóvão Jaques em 1516 e abandonado por ele na ilha de São Gabriel em 1522.",
    relatedEvents: [1032],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "martim_afonso_de_sousa",
    name: "Martim Afonso de Sousa",
    description: "Fidalgo e militar português, liderou importante expedição ao Brasil (1530-1532) com o objetivo de expulsar franceses, buscar metais preciosos e iniciar a colonização. Fundou a vila de São Vicente, primeiro núcleo de povoamento permanente no Brasil.",
    relatedEvents: [1045, 1046, 1047, 1048],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "pero_lopes_de_sousa",
    name: "Pero Lopes de Sousa",
    description: "Irmão de Martim Afonso de Sousa, participou da expedição de 1530-1532, liderando a exploração do Rio da Prata e afastando espanhóis e franceses da região.",
    relatedEvents: [1047], // Assuming participation in the same events
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "joao_ramalho",
    name: "João Ramalho",
    description: "Figura lendária, náufrago português que viveu por décadas entre os índios Tupinambás na região de São Vicente. Conhecedor da língua e costumes indígenas, tornou-se intermediário entre portugueses e nativos.",
    relatedEvents: [1048],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "cristovao_colombo",
    name: "Cristóvão Colombo",
    description: "Navegador genovês a serviço da Coroa Espanhola. Chegou à América em 1492, acreditando ter alcançado as Índias. Suas viagens marcaram o início da expansão europeia no continente americano.",
    relatedEvents: [1005],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "vicente_yanez_pinzon",
    name: "Vicente Yáñez Pinzón",
    description: "Navegador espanhol, comandante de uma das caravelas na primeira expedição de Colombo. Em 1500, liderou expedição que explorou o litoral da América do Sul, possivelmente chegando à foz do rio Amazonas.",
    source: "Náufragos, traficantes e degredados",
    relatedEvents: [] // No direct events from the provided chronology
  },
  {
    id: "juan_de_la_cosa",
    name: "Juan de la Cosa",
    description: "Cartógrafo e navegador espanhol, participou da primeira viagem de Colombo. Confeccionou o primeiro mapa a representar parte do litoral do Brasil.",
    relatedEvents: [1005],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "alonso_de_hojeda",
    name: "Alonso de Hojeda",
    description: "Navegador espanhol, realizou diversas viagens à América do Sul. Em 1499, liderou expedição que explorou a costa da Venezuela e Guiana, acompanhado por Américo Vespúcio.",
    relatedEvents: [1009],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "juan_diaz_de_solis",
    name: "Juan Díaz de Solís",
    description: "Navegador espanhol de origem portuguesa. Em 1516, liderou expedição enviada para encontrar uma passagem para o Oriente, explorando o Rio da Prata, onde encontrou a morte em um combate com os índios Charruas.",
    relatedEvents: [1024, 1031],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "jofre_de_loyasa",
    name: "Jofre de Loyasa",
    description: "Explorador espanhol, comandou expedição às Ilhas Molucas em 1525, com o objetivo de reafirmar a soberania espanhola. Morreu durante a viagem.",
    relatedEvents: [1038, 1039, 1041],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "d_rodrigo_de_acuna",
    name: "D. Rodrigo de Acuña",
    description: "Capitão espanhol, comandante de um dos navios da expedição de Loyasa. Naufragou no litoral de Santa Catarina em 1526, encontrando os náufragos de Solís.",
    relatedEvents: [1039],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "diego_garcia_de_moguer",
    name: "Diego Garcia de Moguer",
    description: "Navegador espanhol, enviado ao Rio da Prata para prender os amotinados da expedição de Loyasa. Em 1528, encontrou Sebastião Caboto na região, gerando conflito entre os dois representantes da Coroa Espanhola.",
    relatedEvents: [1041, 1042, 1043],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "americo_vespuccio",
    name: "Américo Vespúcio",
    description: "Navegador e cosmógrafo florentino a serviço de Portugal e, posteriormente, da Espanha. Participou de importantes expedições que exploram a costa leste da América do Sul, contribuindo decisivamente para a compreensão de que se tratava de um novo continente. Suas cartas e relatos foram fundamentais para a difusão da ideia do 'Novo Mundo' e influenciaram a escolha do nome 'América' em sua homenagem.",
    relatedEvents: [1009, 1013, 1015, 1019, 1020, 1021, 1022],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "giovanni_da_verrazzano",
    name: "Giovanni da Verrazzano",
    description: "Irmãos e navegadores italianos a serviço da França. Realizaram viagens à América do Norte e ao Brasil, contribuindo para a expansão do conhecimento geográfico e para o comércio de pau-brasil.",
    relatedEvents: [1040],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "girolamo_da_verrazzano",
    name: "Girolamo da Verrazzano",
    description: "Irmãos e navegadores italianos a serviço da França. Realizaram viagens à América do Norte e ao Brasil, contribuindo para a expansão do conhecimento geográfico e para o comércio de pau-brasil.",
    relatedEvents: [1040], // Assuming same event as brother
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "bartolomeu_marchioni",
    name: "Bartolomeu Marchioni",
    description: "Banqueiro florentino residente em Lisboa, financiador de expedições marítimas portuguesas, incluindo a de Pedro Álvares Cabral e a da nau Bretoa.",
    relatedEvents: [1026],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "johannes_schoner",
    name: "Johannes Schöner",
    description: "Geógrafo, astrônomo e cartógrafo alemão. Em 1515, confeccionou um globo terrestre que já representava a América do Sul e sugeria a existência de um oceano a oeste, influenciando navegadores como Fernão de Magalhães.",
    source: "Náufragos, traficantes e degredados",
    relatedEvents: [] // No direct events from the provided chronology
  },
  {
    id: "jakob_fugger",
    name: "Jakob Fugger",
    description: "Banqueiro e comerciante alemão, considerado o homem mais rico da Europa em sua época. Financiou diversas expedições, incluindo a de Fernão de Magalhães.",
    relatedEvents: [1033],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "sebastiao_caboto",
    name: "Sebastião Caboto",
    description: "Navegador e explorador de origem italiana a serviço da Inglaterra e, posteriormente, da Espanha. Em 1526, liderou expedição espanhola ao Rio da Prata, fundando o forte Sancti Spiritus e explorando a região.",
    relatedEvents: [1041, 1043],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "fernao_de_magalhaes",
    name: "Fernão de Magalhães",
    description: "Navegador português a serviço da Coroa Espanhola. Liderou a primeira expedição marítima a circunavegar o globo terrestre (1519-1522), demonstrando a esfericidade da Terra. Descobriu o estreito que hoje leva seu nome e abriu caminho para a exploração do Oceano Pacífico.",
    relatedEvents: [1033, 1034, 1036, 1038],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "bacharel_de_cananeia",
    name: "Bacharel de Cananéia",
    description: "Personagem misterioso, degredado português que se tornou um dos primeiros grandes traficantes de escravos indígenas no Brasil. Exerceu grande influência na região de Cananéia.",
    relatedEvents: [1042],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "d_joao_i",
    name: "D. João I",
    description: "Rei de Portugal responsável pela criação do Real português.",
    relatedEvents: [1001],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "afonso_v",
    name: "Afonso V",
    description: "Rei de Portugal que criou o Cruzado português.",
    relatedEvents: [1004],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "diogo_dias",
    name: "Diogo Dias",
    description: "Navegador português, irmão de Bartolomeu Dias, participou de expedições à Índia e ao Brasil.",
    relatedEvents: [1016],
    source: "Náufragos, traficantes e degredados"
  },
  {
    id: "henrique_montes",
    name: "Henrique Montes",
    description: "Náufrago da expedição de Solís, juntou-se à expedição de Martim Afonso de Sousa.",
    relatedEvents: [1045],
    source: "Náufragos, traficantes e degredados"
  }
];
