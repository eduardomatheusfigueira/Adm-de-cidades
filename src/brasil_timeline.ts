import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';

export const brasilTimelineSources: SourceInfo[] = [
  {
    id: "reinaldo_jose_lopes",
    name: "Reinaldo Jose Lopes",
    author: "Reinaldo Jose Lopes",
    color: "#A21CAF", // Example color
    description: "Fonte: Reinaldo Jose Lopes"
  },
  {
    id: "eduardo_bueno",
    name: "Eduardo Bueno",
    author: "Eduardo Bueno",
    color: "#059669", // Example color
    description: "Fonte: Eduardo Bueno"
  },
  {
    id: "darcy_ribeiro",
    name: "Darcy Ribeiro",
    author: "Darcy Ribeiro",
    color: "#EA580C", // Example color
    description: "Fonte: Darcy Ribeiro"
  },
  {
    id: "sergio_buarque",
    name: "Sérgio Buarque de Holanda",
    author: "Sérgio Buarque de Holanda",
    color: "#06B6D4", // Example color
    description: "Fonte: Sérgio Buarque de Holanda"
  }
];

export const brasilTimelineEvents: TimelineEvent[] = [
  {
    id: 10001,
    year: -6000,
    title: "Início da construção dos sambaquis no litoral brasileiro",
    description: "Início da construção dos sambaquis no litoral brasileiro, com os mais antigos possivelmente submersos pelo aumento do nível do mar",
    category: EventCategory.SOCIAL,
    source: "Reinaldo Jose Lopes"
  },
  {
    id: 10002,
    year: -8000,
    title: "Possível início da agricultura no Brasil",
    description: "Possível início da agricultura no Brasil, com indícios de manejo intenso de plantas em Rondônia",
    category: EventCategory.ECONOMIC,
    source: "Reinaldo Jose Lopes"
  },
  {
    id: 10003,
    year: -8000,
    title: "Domesticação da pupunha e desenvolvimento de tecnologias agrícolas na Amazônia",
    description: "Domesticação da pupunha e desenvolvimento de tecnologias agrícolas na Amazônia",
    category: EventCategory.ECONOMIC,
    source: "Reinaldo Jose Lopes"
  },
  {
    id: 10004,
    year: -5000,
    title: "Diversificação do tronco linguístico Tupi",
    description: "Diversificação do tronco linguístico Tupi, com cinco subfamílias concentradas em Rondônia",
    category: EventCategory.CULTURAL,
    source: "Reinaldo Jose Lopes"
  },
  {
    id: 10005,
    year: -3000,
    title: "Expansão dos Tupi-Guarani pelo litoral",
    description: "Evidências de expansão dos Tupi-Guarani pelo litoral, com datações de urnas funerárias em Araruama, Rio de Janeiro",
    category: EventCategory.SOCIAL,
    source: "Reinaldo Jose Lopes"
  },
  {
    id: 10006,
    year: 1000,
    title: "Cerâmica Paredão é substituída pela fase Guarita na Amazônia",
    description: "Na Amazônia, a cerâmica Paredão é substituída pela fase Guarita, com indícios de conflitos e construção de fortificações",
    category: EventCategory.CULTURAL,
    source: "Reinaldo Jose Lopes"
  },
  {
    id: 10007,
    year: 1000,
    title: "Aumento da complexidade social na ilha de Marajó",
    description: "Aumento da complexidade social na ilha de Marajó, com a construção de tesos para lidar com as cheias e desenvolvimento de cerâmica elaborada",
    category: EventCategory.SOCIAL,
    source: "Reinaldo Jose Lopes"
  },
  {
    id: 10008,
    year: 1000,
    title: "Intensificação da ocupação da Amazônia Central",
    description: "Intensificação da ocupação da Amazônia Central, com o surgimento de grandes aldeias e desenvolvimento da cerâmica Santarém",
    category: EventCategory.SOCIAL,
    source: "Reinaldo Jose Lopes"
  },
  {
    id: 10009,
    startYear: 1000,
    endYear: 1500,
    title: "Construção dos geoglifos no Acre",
    description: "Construção dos geoglifos no Acre, indicando um sistema social complexo e uso planejado do território",
    category: EventCategory.CULTURAL,
    source: "Reinaldo Jose Lopes"
  },
  {
    id: 10010,
    century: "Século XII",
    title: "Comercialização do pau-brasil na Europa",
    description: "O pau-brasil ('bersil' em francês) já era comercializado na Europa, especialmente na França e Itália, utilizado como corante para tecidos",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 10011,
    year: 1398,
    title: "Criação do Real português",
    description: "Criação do Real português pelo rei D. João I",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 10012,
    year: 1438,
    title: "Auxílio português na construção naval na França",
    description: "Mestres e carpinteiros portugueses auxiliam na construção naval na Normandia e Bretanha, França",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 10013,
    year: 1448,
    title: "Portugal funda entreposto comercial em Arguim, África",
    description: "Portugal funda o primeiro entreposto comercial na ilha de Arguim, África, marcando o início da expansão ultramarina",
    category: EventCategory.INTERNATIONAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10014,
    year: 1489,
    title: "Criação do Cruzado português",
    description: "Criação do Cruzado português pelo rei Afonso V",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 10015,
    year: 1492,
    title: "Colombo chega à América",
    description: "Cristóvão Colombo chega à América, acreditando ter alcançado a Ásia",
    category: EventCategory.INTERNATIONAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10016,
    year: 1494,
    title: "Tratado de Tordesilhas",
    description: "Assinatura do Tratado de Tordesilhas, dividindo o mundo entre Portugal e Espanha",
    category: EventCategory.INTERNATIONAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10017,
    year: 1497,
    title: "Expedição de Vasco da Gama para a Índia",
    description: "Vasco da Gama inicia sua expedição que culminaria na descoberta do caminho marítimo para a Índia",
    category: EventCategory.INTERNATIONAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10018,
    year: 1497,
    title: "Início das conversões forçadas de judeus em Portugal",
    description: "Início das conversões forçadas de judeus ao cristianismo em Portugal, dando origem aos 'cristãos-novos'",
    category: EventCategory.SOCIAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10019,
    year: 1498,
    month: 5,
    title: "Vasco da Gama chega a Calicute, Índia",
    description: "Vasco da Gama chega a Calicute, Índia, consolidando a rota marítima para o comércio de especiarias",
    category: EventCategory.INTERNATIONAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10020,
    year: 1499,
    month: 6,
    title: "Retorno de Vasco da Gama a Lisboa",
    description: "Vasco da Gama retorna a Lisboa com a notícia da rota para a Índia.",
    category: EventCategory.INTERNATIONAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10021,
    year: 1499,
    month: 6,
    title: "Exploração da costa da América do Sul por Hojeda e Vespúcio",
    description: "Alonso de Hojeda e Américo Vespúcio exploram a costa da América do Sul, chegando à Guiana, Venezuela e Caribe, mas não ao Brasil, como defendido posteriormente por alguns historiadores.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10022,
    century: "Milênios antes do século XVI",
    title: "Ocupação indígena do território brasileiro",
    description: "Povos indígenas ocupam o território brasileiro, desenvolvendo culturas e sistemas sociais complexos, com destaque para o sistema de parentesco e a sabedoria sobre a natureza",
    category: EventCategory.CULTURAL,
    source: "Darcy Ribeiro"
  },
  {
    id: 10023,
    year: 1500,
    title: "Chegada dos europeus ao Brasil",
    description: "Chegada dos europeus ao Brasil, marcando o fim da pré-história e o início de um novo período de transformações profundas.",
    category: EventCategory.COLONIZATION,
    source: "Reinaldo Jose Lopes"
  },
  {
    id: 10024,
    year: 1500,
    title: "Chegada dos portugueses ao Brasil",
    description: "Chegada dos portugueses ao Brasil, marcando o início da colonização. Primeiros contatos com os índios Tupinambá",
    category: EventCategory.COLONIZATION,
    source: "Darcy Ribeiro"
  },
  {
    id: 10025,
    year: 1500,
    month: 3,
    day: 9,
    title: "Partida de Cabral de Lisboa",
    description: "Partida de Pedro Álvares Cabral de Lisboa, com uma frota de 13 navios, com o objetivo de estabelecer uma feitoria em Calicute, Índia.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10026,
    year: 1500,
    month: 1,
    day: 26,
    title: "Chegada de Cabral ao Brasil",
    description: "Pedro Álvares Cabral chega ao Brasil, no local hoje conhecido como Porto Seguro, Bahia.",
    category: EventCategory.COLONIZATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10027,
    year: 1500,
    month: 6,
    title: "Retorno de Gaspar de Lemos a Lisboa com notícias do Brasil",
    description: "Gaspar de Lemos, comandante de um dos navios da frota de Cabral, retorna a Lisboa com a notícia da descoberta e amostras do Brasil, incluindo o primeiro indígena brasileiro a pisar em Portugal.",
    category: EventCategory.COLONIZATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10028,
    century: "Décadas iniciais",
    title: "Exploração do pau-brasil e tráfico de indígenas",
    description: "Exploração do pau-brasil com a ajuda dos índios. Início do tráfico de indígenas para a Europa",
    category: EventCategory.ECONOMIC,
    source: "Darcy Ribeiro"
  },
  {
    id: 10029,
    year: 1501,
    month: 3,
    day: 10,
    title: "Partida de Gonçalo Coelho para explorar o litoral brasileiro",
    description: "Partida de Gonçalo Coelho, com Américo Vespúcio como cosmógrafo ou piloto, para explorar o litoral brasileiro.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10030,
    year: 1501,
    month: 4,
    title: "Escala no Brasil da frota de João da Nova",
    description: "Escala no Brasil da frota de João da Nova, a caminho da Índia, evidenciando a importância estratégica da nova terra como ponto de parada na rota para o Oriente.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10031,
    startYear: 1501,
    endYear: 1501,
    month: 5,
    title: "Vespúcio explora o litoral brasileiro",
    description: "Vespúcio, a bordo da expedição de Gonçalo Coelho, percorre o litoral brasileiro, explorando desde o Rio Grande do Norte até o Cabo Frio, consolidando a ideia da existência de um novo continente.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10032,
    year: 1501,
    month: 6,
    day: 2,
    title: "Encontro de frotas em Bezeguiche",
    description: "Encontro em Bezeguiche, África, entre as frotas de Gonçalo Coelho, Diogo Dias (irmão de Bartolomeu Dias) e dois navios da esquadra de Cabral, que retornavam da Índia. Esse encontro possibilita a troca de informações cruciais sobre a Índia e o Brasil.",
    category: EventCategory.INTERNATIONAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10033,
    year: 1502,
    month: 5,
    day: 10,
    title: "Expedição de Gonçalo Coelho chega a Serra Leoa",
    description: "Após explorar a costa brasileira, a expedição de Gonçalo Coelho chega a Serra Leoa, África.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10034,
    year: 1502,
    month: 7,
    day: 22,
    title: "Retorno da expedição de Gonçalo Coelho a Lisboa",
    description: "Retorno da expedição de Gonçalo Coelho a Lisboa, trazendo consigo a confirmação de que o Brasil não oferecia ouro ou especiarias, como a Índia.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10035,
    year: 1503,
    month: 5,
    day: 20,
    title: "Depoimento de Afonso Ribeiro sobre os indígenas",
    description: "Afonso Ribeiro, degredado deixado no Brasil por Vespúcio em 1502, presta depoimento em Portugal sobre os costumes dos indígenas. Esse depoimento, juntamente com as cartas de Vespúcio, ajuda a construir a imagem do Brasil na Europa.",
    category: EventCategory.SOCIAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10036,
    year: 1503,
    month: 6,
    day: 10,
    title: "Segunda expedição de Gonçalo Coelho ao Brasil",
    description: "Partida da segunda expedição de Gonçalo Coelho ao Brasil, acompanhado novamente por Américo Vespúcio, com o objetivo de explorar o litoral e estabelecer uma feitoria.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10037,
    year: 1504,
    month: 2,
    title: "Vespúcio retorna a Portugal",
    description: "Vespúcio, após desentendimentos com Gonçalo Coelho, retorna a Portugal a bordo de um navio espanhol, levando consigo a certeza de que o Brasil é parte de um novo continente e a convicção da existência de um estreito que levaria às Índias.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10038,
    year: 1504,
    month: 4,
    day: 24,
    title: "Vespúcio naturaliza-se espanhol",
    description: "Américo Vespúcio naturaliza-se espanhol.",
    category: EventCategory.SOCIAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10039,
    year: 1505,
    title: "Início do comércio sistemático de pau-brasil",
    description: "Início do comércio sistemático de pau-brasil, com o estabelecimento de feitorias no litoral brasileiro, marcando o início da exploração econômica da nova terra.",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 10040,
    year: 1505,
    title: "Brasil conhecido como 'Terra dos Papagaios'",
    description: "O Brasil passa a ser conhecido como 'Terra dos Papagaios', devido ao grande número dessas aves levadas para a Europa.",
    category: EventCategory.CULTURAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10041,
    year: 1506,
    month: 4,
    day: 5,
    title: "Partida frustrada da frota de Tristão da Cunha",
    description: "Partida frustrada da frota de Tristão da Cunha para a Índia devido ao desaparecimento do piloto Juan Díaz de Solís, que se aventurava em busca do lendário estreito para o Oriente.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10042,
    year: 1510,
    title: "Brasil consolida-se como 'Terra do Brasil'",
    description: "O Brasil consolida-se como 'Terra do Brasil', devido à intensificação do comércio de pau-brasil.",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 10043,
    year: 1511,
    title: "Aumento da presença francesa no litoral brasileiro",
    description: "Aumento da presença francesa no litoral brasileiro, com navios normandos e bretões buscando pau-brasil, desafiando o monopólio português e estabelecendo relações com tribos indígenas",
    category: EventCategory.INTERNATIONAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10044,
    year: 1511,
    month: 2,
    day: 22,
    title: "Partida da nau Bretoa para o Brasil",
    description: "Partida da nau Bretoa, financiada por Fernando de Noronha e Bartolomeu Marchioni, com o objetivo de comercializar pau-brasil no Brasil",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 10045,
    year: 1511,
    month: 5,
    day: 12,
    title: "Bretoa deixa a Bahia com carga de pau-brasil",
    description: "A Bretoa deixa a Bahia com uma carga de pau-brasil e animais, após um incidente envolvendo o roubo de ferramentas da embarcação, provavelmente para comércio ilegal com os indígenas.",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 10046,
    year: 1511,
    month: 10,
    title: "Retorno da nau Bretoa a Lisboa",
    description: "Retorno da nau Bretoa a Lisboa com lucro de quatro mil ducados, evidenciando a lucratividade do comércio de pau-brasil, apesar das dificuldades e da rígida regulamentação.",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 10047,
    year: 1514,
    month: 4,
    title: "Exploração do Rio da Prata por João de Lisboa e Estevão Fróis",
    description: "João de Lisboa e Estevão Fróis, a serviço da Coroa portuguesa, exploram o Rio da Prata, buscando o caminho para as Molucas e consolidando a presença portuguesa na região.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10048,
    year: 1516,
    month: 1,
    title: "Morte de Juan Díaz de Solís no Rio da Prata",
    description: "Tragédia no Rio da Prata: Juan Díaz de Solís é morto por índios Charruas, marcando o fracasso da expedição espanhola em busca do estreito para o Oriente e o início da saga dos náufragos da expedição.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10049,
    year: 1516,
    month: 9,
    title: "Resgate de náufragos de Solís por Cristóvão Jaques",
    description: "Cristóvão Jaques, a bordo da expedição portuguesa liderada por Duarte Coelho, chega à Ilha de Santa Catarina e resgata alguns náufragos da expedição de Solís, incluindo Francisco del Puerto, obtendo informações valiosas sobre o Rio da Prata.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10050,
    year: 1519,
    month: 9,
    day: 20,
    title: "Partida de Fernão de Magalhães para circum-navegação",
    description: "Partida de Fernão de Magalhães de Sanlúcar de Barrameda, Espanha, com o objetivo de encontrar uma nova rota para as Índias, contornando a América pelo sul.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10051,
    year: 1520,
    month: 11,
    title: "Magalhães atravessa o Estreito de Magalhães",
    description: "Magalhães atravessa o estreito que leva seu nome, na extremidade sul da América do Sul, abrindo caminho para o Oceano Pacífico.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10052,
    year: 1521,
    month: 11,
    title: "Segunda expedição de Cristóvão Jaques ao Brasil",
    description: "Cristóvão Jaques inicia sua segunda expedição ao Brasil, com o objetivo de explorar o Rio da Prata, tendo como guia Melchior Ramires, um dos náufragos de Solís, que vivia entre os índios Carijó em Santa Catarina.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10053,
    year: 1521,
    month: 12,
    title: "Expedição de Magalhães chega às Molucas",
    description: "A expedição de Magalhães, após a morte do navegador nas Filipinas, chega às Ilhas Molucas, comprovando a possibilidade de alcançar as 'Ilhas das Especiarias' navegando para oeste.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10054,
    year: 1522,
    month: 4,
    title: "Retorno de Cristóvão Jaques a Portugal",
    description: "Cristóvão Jaques retorna a Portugal, abandonando Melchior Ramires em Santa Catarina e Jorge Gomes em Itamaracá, demonstrando o pouco caso com o destino daqueles que se aventuravam na nova terra.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10055,
    year: 1525,
    month: 7,
    title: "Partida de Jofre de Loyasa para as Molucas",
    description: "Partida de Jofre de Loyasa de Sevilha, com a missão de reivindicar as Ilhas Molucas para a Espanha, utilizando a rota descoberta por Magalhães.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10056,
    year: 1526,
    title: "Verrazzano chegam ao Brasil em busca de pau-brasil",
    description: "Os irmãos Verrazzano, navegando sob bandeira francesa, chegam ao Brasil em busca de pau-brasil, consolidando a rota entre a Normandia e o litoral brasileiro",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 10057,
    year: 1526,
    month: 8,
    title: "Naufrágio de D. Rodrigo Acuña em Santa Catarina",
    description: "D. Rodrigo Acuña, capitão de um dos navios da expedição de Loyasa, naufraga no litoral de Santa Catarina e encontra os náufragos de Solís, vivendo 'como selvagens' e alimentando o mito de uma terra de riquezas e vida fácil.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10058,
    year: 1527,
    month: 8,
    title: "Partida de Diego Garcia para prender amotinados",
    description: "Diego Garcia parte de Palos, Espanha, com a missão de encontrar e prender os amotinados da expedição de Loyasa, incluindo Sebastião Caboto, que se aventurava pelo Rio da Prata.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10059,
    year: 1528,
    month: 2,
    title: "Diego Garcia chega ao Rio da Prata",
    description: "Diego Garcia chega ao Rio da Prata e inicia a exploração da região, utilizando o bergantim comprado de Gonçalo da Costa, genro do enigmático Bacharel de Cananéia.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10060,
    year: 1528,
    month: 5,
    day: 7,
    title: "Encontro de Garcia e Caboto no Rio da Prata",
    description: "Encontro no Rio da Prata entre as expedições de Diego Garcia e Sebastião Caboto, representando os interesses da Espanha e evidenciando a disputa pela região.",
    category: EventCategory.INTERNATIONAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10061,
    year: 1529,
    month: 4,
    day: 22,
    title: "Tratado de Saragoça",
    description: "Assinatura do Tratado de Saragoça, no qual a Espanha cede à Portugal o direito de explorar as Ilhas Molucas, em troca de 350 mil ducados, marcando um momento decisivo na partilha do mundo entre as duas potências.",
    category: EventCategory.INTERNATIONAL,
    source: "Eduardo Bueno"
  },
  {
    id: 10062,
    year: 1530,
    title: "Implantação das capitanias hereditárias e fundação de São Vicente",
    description: "Implantação do sistema de capitanias hereditárias, com a vinda de Martim Afonso de Souza, que traz gado e cana-de-açúcar. Fundação de São Vicente, primeira vila, e início da ocupação do litoral.",
    category: EventCategory.COLONIZATION,
    source: "Darcy Ribeiro"
  },
  {
    id: 10063,
    year: 1530,
    month: 12,
    day: 3,
    title: "Partida de Martim Afonso de Sousa para o Brasil",
    description: "Partida de Martim Afonso de Sousa de Lisboa com a missão de explorar o litoral brasileiro, expulsar os franceses e buscar o lendário Rei Branco e suas riquezas. A expedição conta com a participação de Henrique Montes, antigo náufrago de Solís.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10064,
    year: 1531,
    month: 3,
    title: "Martim Afonso funda vila fortificada no Rio de Janeiro",
    description: "Martim Afonso de Sousa funda uma pequena vila fortificada no Rio de Janeiro, preparando-se para a expedição ao Rio da Prata.",
    category: EventCategory.COLONIZATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10065,
    year: 1531,
    month: 10,
    day: 21,
    title: "Naufrágio de Martim Afonso de Sousa no Rio da Prata",
    description: "Naufrágio de Martim Afonso de Sousa na foz do Rio da Prata, forçando o adiamento da busca pelo Rei Branco e evidenciando os perigos da navegação na região.",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10066,
    year: 1532,
    month: 1,
    title: "Retorno de Martim Afonso a São Vicente",
    description: "Martim Afonso de Sousa retorna a São Vicente, encontrando João Ramalho, português que vivia entre os índios há décadas, consolidando o domínio português na região.",
    category: EventCategory.COLONIZATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10067,
    year: 1532,
    title: "Feitiço do Peru desvia atenções de Portugal",
    description: "O 'feitiço do Peru', com a descoberta de imensas jazidas de prata em Potosí, desvia as atenções de Portugal para a América Espanhola, impactando a colonização do Brasil.",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 10068,
    year: 1532,
    title: "Implantação do sistema de Capitanias Hereditárias",
    description: "D. João III inicia a implantação do sistema de Capitanias Hereditárias no Brasil, marcando o início da ocupação sistemática do território.",
    category: EventCategory.COLONIZATION,
    source: "Eduardo Bueno"
  },
  {
    id: 10069,
    year: 1550,
    title: "Crescimento da escravidão africana e cunhadismo",
    description: "Crescimento da escravidão africana. Os portugueses se chocam com o cunhadismo, prática indígena que incorporava estrangeiros através do casamento e que desafiava a ordem social colonial",
    category: EventCategory.SOCIAL,
    source: "Darcy Ribeiro"
  },
  {
    id: 10070,
    year: 1553,
    title: "Jesuítas denunciam o cunhadismo",
    description: "Denúncia dos jesuítas contra o cunhadismo, considerado um obstáculo à catequização",
    category: EventCategory.SOCIAL,
    source: "Darcy Ribeiro"
  },
  {
    id: 10071,
    startYear: 1550,
    endYear: 1600,
    title: "Descrições detalhadas sobre o Brasil",
    description: "Surgimento de descrições detalhadas sobre a fauna, flora e povos do Brasil, com destaque para o trabalho do padre José de Anchieta",
    category: EventCategory.CULTURAL,
    source: "Darcy Ribeiro"
  },
  {
    id: 10072,
    endYear: 1600,
    title: "Expansão da colonização e conflitos com indígenas",
    description: "Expansão da colonização com a criação de vilas e cidades, impulsionada pela exploração da cana-de-açúcar. Conflitos entre portugueses e indígenas se intensificam",
    category: EventCategory.COLONIZATION,
    source: "Darcy Ribeiro"
  },
  {
    id: 10073,
    century: "Século XVII",
    title: "Expansão da cana-de-açúcar e escravidão africana",
    description: "Expansão das lavouras de cana-de-açúcar e consolidação da escravidão africana",
    category: EventCategory.ECONOMIC,
    source: "Darcy Ribeiro"
  },
  {
    id: 10074,
    century: "Século XVII",
    title: "Bandeirantes paulistas",
    description: "Expedições de paulistas (bandeirantes) pelo interior do Brasil em busca de ouro e indígenas para escravizar",
    category: EventCategory.EXPLORATION,
    source: "Darcy Ribeiro"
  },
  {
    id: 10075,
    year: 1640,
    title: "Fim da União Ibérica",
    description: "Fim da União Ibérica e retomada da autonomia portuguesa",
    category: EventCategory.POLITICAL,
    source: "Darcy Ribeiro"
  },
  {
    id: 10076,
    endYear: 1700,
    title: "Descoberta de ouro em Minas Gerais",
    description: "Descoberta de ouro em Minas Gerais, intensificando as bandeiras e o tráfico de escravos africanos",
    category: EventCategory.ECONOMIC,
    source: "Darcy Ribeiro"
  },
  {
    id: 10077,
    startYear: 1700,
    endYear: 1701,
    title: "Auge da mineração em Minas Gerais",
    description: "Início do século XVIII: Auge da mineração em Minas Gerais e desenvolvimento de um estilo de vida urbano mais complexo na região",
    category: EventCategory.ECONOMIC,
    source: "Darcy Ribeiro"
  },
  {
    id: 10078,
    startYear: 1710,
    endYear: 1711,
    title: "Guerra dos Emboabas",
    description: "Guerra dos Emboabas, conflito entre paulistas e forasteiros pelo controle das minas de ouro",
    category: EventCategory.POLITICAL,
    source: "Darcy Ribeiro"
  },
  {
    id: 10079,
    year: 1720,
    title: "Revolta de Vila Rica",
    description: "Revolta de Vila Rica, em protesto contra a exploração da Coroa Portuguesa sobre as minas de ouro",
    category: EventCategory.POLITICAL,
    source: "Darcy Ribeiro"
  },
  {
    id: 10080,
    year: 1789,
    title: "Inconfidência Mineira",
    description: "Inconfidência Mineira, movimento de contestação à Coroa Portuguesa, influenciado pelas ideias iluministas",
    category: EventCategory.POLITICAL,
    source: "Darcy Ribeiro"
  },
  {
    id: 10081,
    endYear: 1800,
    title: "Decadência da mineração e expansão do café",
    description: "Fins do século XVIII: Decadência da mineração e início da expansão da cultura de café no Rio de Janeiro. Intensificação do tráfico de escravos",
    category: EventCategory.ECONOMIC,
    source: "Darcy Ribeiro"
  },
  {
    id: 10082,
    startYear: 1800,
    endYear: 1801,
    title: "Consolidação da cultura de café",
    description: "Início do século XIX: Consolidação da cultura de café como principal atividade econômica do Brasil",
    category: EventCategory.ECONOMIC,
    source: "Darcy Ribeiro"
  },
  {
    id: 10083,
    year: 1822,
    title: "Independência do Brasil",
    description: "Independência do Brasil",
    category: EventCategory.POLITICAL,
    source: "Darcy Ribeiro"
  },
  {
    id: 10084,
    year: 1850,
    title: "Fim do tráfico de escravos africanos",
    description: "Fim do tráfico de escravos africanos",
    category: EventCategory.LEGISLATION,
    source: "Darcy Ribeiro"
  },
  {
    id: 10085,
    year: 1888,
    title: "Abolição da escravidão no Brasil",
    description: "Abolição da escravidão no Brasil. Crise no sistema de fazendas e início da imigração europeia para suprir a mão de obra",
    category: EventCategory.LEGISLATION,
    source: "Darcy Ribeiro"
  },
  {
    id: 10086,
    endYear: 1900,
    title: "Expansão da cafeicultura e imigração europeia",
    description: "Fins do século XIX: Expansão da cafeicultura para o interior de São Paulo. Surgimento de novas cidades e intensificação da imigração europeia, principalmente italiana",
    category: EventCategory.ECONOMIC,
    source: "Darcy Ribeiro"
  },
  {
    id: 10087,
    startYear: 1900,
    endYear: 1901,
    title: "Auge da cafeicultura e urbanização",
    description: "Início do século XX: Auge da cafeicultura e crescimento da urbanização e da industrialização, principalmente em São Paulo",
    category: EventCategory.ECONOMIC,
    source: "Darcy Ribeiro"
  },
  {
    id: 10088,
    year: 1929,
    title: "Crise de 1929 e impacto no café",
    description: "Crise da Bolsa de Valores de Nova York, impactando a economia cafeeira brasileira. O governo intervém para sustentar os preços do café",
    category: EventCategory.ECONOMIC,
    source: "Darcy Ribeiro"
  },
  {
    id: 10089,
    year: 1930,
    title: "Fim da República Velha e Getúlio Vargas no poder",
    description: "Fim da República Velha. Getúlio Vargas assume o poder",
    category: EventCategory.POLITICAL,
    source: "Darcy Ribeiro"
  },
  {
    id: 10090,
    title: "Industrialização e migração nordestina",
    description: "Continuação: Processo de industrialização se intensifica, principalmente após a Segunda Guerra Mundial. Migração de nordestinos para as grandes cidades do Sudeste",
    category: EventCategory.ECONOMIC,
    source: "Darcy Ribeiro"
  },
  {
    id: 10091,
    year: 1964,
    title: "Golpe militar no Brasil",
    description: "Golpe militar no Brasil",
    category: EventCategory.POLITICAL,
    source: "Darcy Ribeiro"
  },
  {
    id: 10092,
    title: "Ditadura militar e industrialização",
    description: "Continuação: Ditadura militar (1964-1985) e intensificação da industrialização",
    category: EventCategory.POLITICAL,
    source: "Darcy Ribeiro"
  },
  {
    id: 10093,
    title: "Brasil país em desenvolvimento",
    description: "Atualmente: Brasil como país em desenvolvimento, com desigualdades sociais e raciais persistentes",
    category: EventCategory.SOCIAL,
    source: "Darcy Ribeiro"
  },
  // Timeline Detalhada Events
  {
    id: 20001,
    year: 1500,
    month: 4,
    day: 22,
    title: "Chegada de Pedro Álvares Cabral ao Brasil",
    description: "Chegada de Pedro Álvares Cabral ao Brasil",
    category: EventCategory.COLONIZATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20002,
    year: 1514,
    title: "Expedição de João de Lisboa descobre o Rio da Prata",
    description: "Expedição comandada por João de Lisboa descobre o Rio da Prata",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20003,
    year: 1526,
    title: "Possível primeiro contato de Caramuru com os Tupinambá",
    description: "Possível primeiro contato de Diogo Álvares Correia (Caramuru) com os Tupinambá na Bahia",
    category: EventCategory.COLONIZATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20004,
    year: 1529,
    title: "Comércio ilegal de pau-brasil por normandos",
    description: "Marinheiros normandos, financiados por Jean Ango, intensificam o comércio ilegal de pau-brasil no Brasil",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 20005,
    year: 1530,
    month: 6,
    title: "Gonçalo da Costa parte de Cananéia para a Europa",
    description: "Gonçalo da Costa parte de Cananéia para a Europa",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20006,
    year: 1530,
    month: 10,
    title: "Gonçalo da Costa revela planos portugueses para o Brasil",
    description: "Gonçalo da Costa se reúne com D. João III em Lisboa e revela os planos portugueses para o Brasil",
    category: EventCategory.POLITICAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20007,
    year: 1530,
    month: 11,
    title: "Partida de Martim Afonso de Sousa para o Brasil",
    description: "Martim Afonso de Sousa parte de Portugal liderando uma expedição ao Brasil",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20008,
    startYear: 1531,
    endYear: 1531,
    month: 2,
    title: "Martim Afonso expulsa franceses de Pernambuco",
    description: "Martim Afonso de Sousa expulsa franceses de Pernambuco e inicia a construção de uma feitoria em Igaraçu",
    category: EventCategory.POLITICAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20009,
    year: 1531,
    month: 3,
    title: "Chegada de Martim Afonso à Baía de Todos os Santos",
    description: "Chegada de Martim Afonso de Sousa à Baía de Todos os Santos",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20010,
    year: 1531,
    month: 6,
    title: "Retorno de João de Sousa a Portugal",
    description: "João de Sousa retorna a Portugal levando pau-brasil e traficantes franceses capturados",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 20011,
    year: 1531,
    month: 7,
    title: "Gonçalo da Costa nomeado 'capitão no serviço das Índias'",
    description: "D. Isabel nomeia Gonçalo da Costa 'capitão no serviço das Índias'",
    category: EventCategory.POLITICAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20012,
    year: 1531,
    month: 12,
    title: "Naufrágio de Martim Afonso no Rio da Prata",
    description: "Naufrágio do bergantim de Martim Afonso de Sousa nas 'Pedras de Afiar' no Rio da Prata",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20013,
    year: 1532,
    month: 1,
    title: "Fundação de São Vicente",
    description: "Fundação de São Vicente por Martim Afonso de Sousa",
    category: EventCategory.COLONIZATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20014,
    year: 1532,
    month: 5,
    day: 22,
    title: "Pero Lopes parte de São Vicente para Portugal",
    description: "Pero Lopes, irmão de Martim Afonso, parte de São Vicente para Portugal",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20015,
    year: 1532,
    month: 9,
    title: "D. João III decide dividir o Brasil em capitanias",
    description: "D. João III decide dividir o Brasil em capitanias hereditárias e informa Martim Afonso de Sousa por carta",
    category: EventCategory.POLITICAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20016,
    year: 1532,
    month: 10,
    title: "João de Sousa parte para o Brasil com carta do rei",
    description: "João de Sousa parte para o Brasil com a misão de entregar a carta do rei a Martim Afonso",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20017,
    year: 1533,
    title: "Naufrágio de naus de Martim Afonso",
    description: "Naufrágio de três das naus de Martim Afonso de Sousa durante a viagem de volta a Portugal",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20018,
    year: 1533,
    title: "Notícia da derrota de D. Nuno da Cunha em Diu",
    description: "D. João III recebe a notícia da derrota de D. Nuno da Cunha em Diu, Índia",
    category: EventCategory.INTERNATIONAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20019,
    year: 1533,
    title: "Notícias da expedição de Mendoza ao Rio da Prata",
    description: "Notícias sobre a expedição de Pedro de Mendoza ao Rio da Prata chegam a Portugal",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20020,
    year: 1534,
    month: 3,
    title: "Pero Lopes e Tomé de Sousa partem para o Marrocos",
    description: "Pero Lopes e Tomé de Sousa partem de Lisboa para o Marrocos",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20021,
    year: 1534,
    month: 3,
    day: 10,
    title: "Alvará de lembrança para Pero de Góis",
    description: "D. João III assina um 'alvará de lembrança' incluindo o nome de Pero de Góis entre os futuros donatários",
    category: EventCategory.POLITICAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20022,
    startYear: 1534,
    endYear: 1534,
    month: 4,
    title: "Pero Lopes retorna a Lisboa com Tibiriçá",
    description: "Chegada de Pero Lopes de volta a Lisboa, trazendo consigo o índio Tibiriçá",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20023,
    year: 1534,
    title: "Inquisição em Portugal (início)",
    description: "Início do funcionamento da Inquisição em Portugal (suspensa em 1534 e retomada em 1536)",
    category: EventCategory.SOCIAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20024,
    year: 1534,
    title: "Fundação do Engenho dos Adornos",
    description: "Fundação do Engenho dos Adornos em São Vicente pelos irmãos genoveses",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 20025,
    year: 1535,
    month: 5,
    title: "Capitanias do Brasil 'território de couto e homizio'",
    description: "D. João III declara as capitanias do Brasil 'território de couto e homizio'",
    category: EventCategory.POLITICAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20026,
    year: 1535,
    month: 6,
    title: "Alvará para minas de ouro e prata no Maranhão",
    description: "Assinatura do alvará concedendo as minas de ouro e prata encontradas no Maranhão aos donatários João de Barros, Fernão d’Álvares de Andrade e Aires da Cunha",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 20027,
    year: 1535,
    month: 9,
    title: "Partida da expedição de Aires da Cunha para o Maranhão",
    description: "Partida da expedição de Aires da Cunha para o Maranhão",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20028,
    year: 1535,
    month: 9,
    day: 27,
    title: "Fundação da vila de Cosme e Damião (Igaraçu)",
    description: "Fundação da vila de Cosme e Damião (Igaraçu) por Duarte Coelho",
    category: EventCategory.COLONIZATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20029,
    year: 1535,
    month: 10,
    title: "Degredados enviados para o Brasil",
    description: "D. João III determina que os degredados passem a ser enviados para o Brasil",
    category: EventCategory.SOCIAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20030,
    year: 1535,
    month: 12,
    title: "Possível chegada de Francisco Romero à Bahia",
    description: "Possível chegada da expedição de Francisco Romero à Bahia",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20031,
    year: 1536,
    title: "Inquisição em Portugal (definitiva)",
    description: "Instalação definitiva da Inquisição em Portugal",
    category: EventCategory.SOCIAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20032,
    year: 1536,
    title: "Naufrágio da nau de Aires da Cunha no Maranhão",
    description: "Naufrágio da nau capitânia da expedição de Aires da Cunha no Maranhão",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20033,
    year: 1536,
    title: "Retorno de navios de Aires da Cunha a Portugal",
    description: "Retorno dos navios sobreviventes da expedição de Aires da Cunha a Portugal",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20034,
    year: 1536,
    month: 12,
    day: 20,
    title: "Sesmarias para Caramuru na Bahia",
    description: "Francisco Pereira Coutinho doa uma sesmaria para Caramuru na Bahia",
    category: EventCategory.POLITICAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20035,
    year: 1537,
    title: "Massacre da expedição de Aires da Cunha",
    description: "Massacre da expedição de Aires da Cunha pelos Tupinambá no Maranhão",
    category: EventCategory.REPRESSION,
    source: "Eduardo Bueno"
  },
  {
    id: 20036,
    year: 1537,
    title: "Encontro Coutinho e Góis no rio Itapemirim",
    description: "Encontro entre Vasco Fernandes Coutinho e Pero de Góis na foz do rio Itapemirim",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20037,
    year: 1538,
    title: "Pero Lopes enviado para prender João de Melo",
    description: "D. João III envia Pero Lopes de volta ao Brasil com a missão de encontrar e prender João de Melo da Câmara",
    category: EventCategory.POLITICAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20038,
    year: 1538,
    title: "Morte de Pero Lopes em naufrágio",
    description: "Naufrágio e morte de Pero Lopes durante a viagem de volta da Bahia para Portugal",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20039,
    year: 1541,
    month: 4,
    day: 7,
    title: "Partida de Martim Afonso para a Índia",
    description: "Martim Afonso de Sousa parte de Lisboa para a Índia",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20040,
    year: 1541,
    title: "Contrato para engenho de açúcar em São Vicente",
    description: "Contrato firmado entre Martim Afonso de Sousa e Johann van Hielst para a construção de um engenho de açúcar em São Vicente",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 20041,
    year: 1542,
    title: "Início da construção do Engenho do Governador",
    description: "Início da construção do Engenho do Governador (futuro Engenho de São Jorge dos Erasmos) em São Vicente",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 20042,
    year: 1545,
    title: "Assassinato de Francisco Pereira Coutinho",
    description: "Assassinato de Francisco Pereira Coutinho pelos Tupinambá na Bahia",
    category: EventCategory.REPRESSION,
    source: "Eduardo Bueno"
  },
  {
    id: 20043,
    year: 1545,
    title: "Descoberta da mina de prata de Potosí",
    description: "Descoberta da mina de prata de Potosí pelos espanhóis",
    category: EventCategory.ECONOMIC,
    source: "Eduardo Bueno"
  },
  {
    id: 20044,
    year: 1545,
    title: "Início de 'As Décadas da Ásia' por João de Barros",
    description: "Início da redação de 'As Décadas da Ásia' por João de Barros",
    category: EventCategory.INTELLECTUAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20045,
    year: 1548,
    month: 5,
    day: 12,
    title: "Carta de Luís de Góis pedindo ajuda para São Vicente",
    description: "Luís de Góis escreve uma carta ao rei D. João III pedindo ajuda para combater os franceses e os indígenas em São Vicente",
    category: EventCategory.POLITICAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20046,
    year: 1548,
    title: "Retorno de Pero de Góis a Portugal",
    description: "Retorno de Pero de Góis a Portugal",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20047,
    year: 1548,
    title: "Partida da expedição de Tomé de Sousa para o Brasil",
    description: "Partida da expedição de Tomé de Sousa para o Brasil",
    category: EventCategory.COLONIZATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20048,
    year: 1549,
    title: "Chegada de Tomé de Sousa e fundação de Salvador",
    description: "Chegada de Tomé de Sousa ao Brasil e fundação de Salvador",
    category: EventCategory.COLONIZATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20049,
    year: 1553,
    month: 7,
    title: "Ulrich Schmidel passa por Piratininga e São Vicente",
    description: "Ulrich Schmidel passa por Piratininga e São Vicente durante sua viagem de volta para a Alemanha",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20050,
    year: 1555,
    title: "Retorno de Vasco Fernandes Coutinho a Portugal",
    description: "Vasco Fernandes Coutinho retorna a Portugal 'velho, pobre e cansado'",
    category: EventCategory.EXPLORATION,
    source: "Eduardo Bueno"
  },
  {
    id: 20051,
    year: 1561,
    title: "Morte de Vasco Fernandes Coutinho",
    description: "Morte de Vasco Fernandes Coutinho em Portugal",
    category: EventCategory.SOCIAL,
    source: "Eduardo Bueno"
  },
  {
    id: 20052,
    century: "Século XIII",
    title: "Portugal consolida sua unidade política",
    description: "Portugal consolida sua unidade política antes de outros Estados europeus modernos.",
    category: EventCategory.POLITICAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20053,
    century: "Século XIII",
    title: "Expansão Ultramarina Portuguesa (início)",
    description: "Expansão Ultramarina Portuguesa: Tem início a expansão ultramarina portuguesa, com a conquista de Ceuta e a exploração da costa africana.",
    category: EventCategory.EXPLORATION,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20054,
    century: "Século XIII",
    title: "Grandes Descobrimentos (protagonismo)",
    description: "Grandes Descobrimentos: Portugal e Espanha assumem protagonismo nos descobrimentos marítimos, ingressando tardiamente no cenário europeu.",
    category: EventCategory.EXPLORATION,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20055,
    century: "Século XVI",
    title: "Início da Colonização do Brasil",
    description: "Início da Colonização do Brasil: Implantação do sistema de capitanias hereditárias e início da exploração da cana-de-açúcar com mão de obra escrava africana.",
    category: EventCategory.COLONIZATION,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20056,
    century: "Século XVI",
    title: "Fundação de São Paulo",
    description: "Fundação de São Paulo: Fundação de São Paulo pelos jesuítas e início da expansão bandeirante pelo interior do Brasil.",
    category: EventCategory.COLONIZATION,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20057,
    century: "Século XVI",
    title: "Conflitos com Indígenas (Século XVI)",
    description: "Conflitos com Indígenas: Conflitos entre colonos e indígenas se intensificam com a expansão da colonização para o interior.",
    category: EventCategory.REPRESSION,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20058,
    century: "Século XVI",
    title: "Contrastes entre Portugal e Brasil",
    description: "Contrastes entre Portugal e Brasil: Observações de viajantes e cronistas como Gabriel Soares, frei Vicente do Salvador e padre Manuel da Nóbrega revelam os contrastes entre a cultura portuguesa e a realidade da colônia brasileira.",
    category: EventCategory.CULTURAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20059,
    century: "Século XVII",
    title: "Domínio Holandês no Brasil",
    description: "Domínio Holandês no Brasil: Invasão holandesa no Nordeste do Brasil e estabelecimento do governo de Maurício de Nassau.",
    category: EventCategory.INTERNATIONAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20060,
    century: "Século XVII",
    title: "Expulsão dos Holandeses",
    description: "Expulsão dos Holandeses: Derrota e expulsão dos holandeses, marcando o fim da ameaça à hegemonia portuguesa no Brasil.",
    category: EventCategory.INTERNATIONAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20061,
    century: "Século XVII",
    title: "Ciclo do Ouro",
    description: "Ciclo do Ouro: Descoberta de ouro em Minas Gerais e consequente deslocamento do eixo econômico para a região Sudeste.",
    category: EventCategory.ECONOMIC,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20062,
    century: "Século XVIII",
    title: "Descoberta de Diamantes",
    description: "Descoberta de Diamantes: Descoberta de diamantes em Minas Gerais, intensificando o controle e a exploração da região pela Coroa Portuguesa.",
    category: EventCategory.ECONOMIC,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20063,
    century: "Século XVIII",
    title: "Críticas ao Sistema Colonial",
    description: "Críticas ao Sistema Colonial: Ilustrados como Luís dos Santos Vilhena criticam o modelo de urbanização e a exploração colonial portuguesa no Brasil.",
    category: EventCategory.INTELLECTUAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20064,
    century: "Século XVIII",
    title: "Influência Iluminista",
    description: "Influência Iluminista: Ideias iluministas penetram no Brasil, questionando o absolutismo e defendendo reformas sociais e políticas.",
    category: EventCategory.INTELLECTUAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20065,
    century: "Século XVIII",
    title: "Inconfidência Mineira (Sérgio Buarque)",
    description: "Inconfidência Mineira: Inspirada pelas ideias iluministas, a Inconfidência Mineira representa um movimento pela independência do Brasil, mas é reprimida pela Coroa Portuguesa.",
    category: EventCategory.POLITICAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20066,
    century: "Século XIX",
    title: "Vinda da Família Real Portuguesa",
    description: "Vinda da Família Real Portuguesa: Diante da invasão napoleônica a Portugal, a família real portuguesa se transfere para o Brasil.",
    category: EventCategory.POLITICAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20067,
    century: "Século XIX",
    title: "Abertura dos Portos",
    description: "Abertura dos Portos: D. João VI decreta a abertura dos portos às nações amigas, rompendo o pacto colonial e impulsionando a economia brasileira.",
    category: EventCategory.ECONOMIC,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20068,
    century: "Século XIX",
    title: "Elevação do Brasil a Reino Unido",
    description: "Elevação do Brasil a Reino Unido: Brasil é elevado à condição de Reino Unido a Portugal e Algarves, ganhando status de igualdade com a metrópole.",
    category: EventCategory.POLITICAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20069,
    century: "Século XIX",
    title: "Independência do Brasil (Sérgio Buarque)",
    description: "Independência do Brasil: Proclamação da independência do Brasil por D. Pedro I.",
    category: EventCategory.POLITICAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20070,
    century: "Século XIX",
    title: "Período Regencial",
    description: "Período Regencial: Período de instabilidade política e revoltas após a abdicação de D. Pedro I.",
    category: EventCategory.POLITICAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20071,
    century: "Século XIX",
    title: "Segundo Reinado",
    description: "Segundo Reinado: Período marcado pela estabilidade política sob o governo de D. Pedro II, expansão da cafeicultura e debates sobre a escravidão.",
    category: EventCategory.POLITICAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20072,
    century: "Século XIX",
    title: "Fim do Tráfico Negreiro (Sérgio Buarque)",
    description: "Fim do Tráfico Negreiro: Aprovação da Lei Eusébio de Queirós, extinguindo o tráfico negreiro.",
    category: EventCategory.LEGISLATION,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20073,
    century: "Século XIX",
    title: "Imigração Européia (Sérgio Buarque)",
    description: "Imigração Européia: Início da imigração europeia em larga escala para suprir a mão de obra nas lavouras de café.",
    category: EventCategory.SOCIAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20074,
    century: "Século XIX",
    title: "Crescimento Urbano (Sérgio Buarque)",
    description: "Crescimento Urbano: Expansão da cafeicultura impulsiona o crescimento urbano e transformações sociais no Brasil.",
    category: EventCategory.URBANIZATION,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20075,
    century: "Século XIX",
    title: "Abolição da Escravidão (Sérgio Buarque)",
    description: "Abolição da Escravidão: Assinatura da Lei Áurea, abolindo a escravidão no Brasil.",
    category: EventCategory.LEGISLATION,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20076,
    century: "Século XIX",
    title: "Proclamação da República",
    description: "Proclamação da República: Golpe militar depõe D. Pedro II e instaura a República no Brasil.",
    category: EventCategory.POLITICAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20077,
    startYear: 1890, // Approximation for "Final do Século XIX e Início do Século XX"
    endYear: 1910,
    title: "República Velha",
    description: "República Velha: Período marcado por conflitos políticos, oligarquias regionais e crises sociais.",
    category: EventCategory.POLITICAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20078,
    startYear: 1890, // Approximation for "Final do Século XIX e Início do Século XX"
    endYear: 1910,
    title: "Ascensão do Positivismo",
    description: "Ascensão do Positivismo: Positivismo ganha força entre intelectuais e militares, influenciando o movimento republicano.",
    category: EventCategory.INTELLECTUAL,
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 20079,
    startYear: 1890, // Approximation for "Final do Século XIX e Início do Século XX"
    endYear: 1920,
    title: "Industrialização (Início Século XX)",
    description: "Industrialização: Industrialização se intensifica no Brasil, impulsionando o crescimento das cidades.",
    category: EventCategory.ECONOMIC,
    source: "Sérgio Buarque de Holanda"
  },
];

export const brasilTimelinePeriods: TimelinePeriod[] = [
  {
    id: 30001,
    startYear: 1890, // Approximation for "Final do Século XIX e Início do Século XX"
    endYear: 1920, // Approximation for "Final do Século XIX e Início do Século XX"
    title: "Final do Século XIX e Início do Século XX",
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 30002,
    startYear: 1800,
    endYear: 1900,
    title: "Século XIX",
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 30003,
    startYear: 1700,
    endYear: 1800,
    title: "Século XVIII",
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 30004,
    startYear: 1600,
    endYear: 1700,
    title: "Século XVII",
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 30005,
    startYear: 1500,
    endYear: 1600,
    title: "Século XVI",
    source: "Sérgio Buarque de Holanda"
  },
  {
    id: 30006,
    startYear: 1200,
    endYear: 1300,
    title: "Século XIII",
    source: "Sérgio Buarque de Holanda"
  },
];

export const brasilTimelineCharacters: Character[] = [];
