import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';

export const viagemDescobrimentoSource: SourceInfo = {
  id: "viagem_descobrimento",
  name: "A Viagem do Descobrimento",
  author: "Eduardo Bueno",
  color: "#64B5F6", // Example color, you can change it
  description: "Análise da expedição de Pedro Álvares Cabral por Eduardo Bueno, conectando o evento ao contexto mundial dos séculos XV e XVI."
};

export const viagemDescobrimentoEvents: TimelineEvent[] = [
  {
    id: 50001,
    year: 1385,
    title: "Batalha de Aljubarrota",
    description: "D. João, mestre da Ordem de Avis, derrota o exército de Castela, consolidando a independência de Portugal. Álvaro Gil Cabral, trisavô de Pedro Álvares Cabral, participa.",
    category: EventCategory.POLITICAL,
    source: "A Viagem do Descobrimento",
    characters: ["Álvaro Gil Cabral", "D. João I"]
  },
  {
    id: 50002,
    year: 1387,
    month: 2,
    title: "Casamento de D. João I com Filipa de Lancaster",
    description: "D. João casa-se com Filipa de Lancaster, selando a aliança com a Inglaterra.",
    category: EventCategory.POLITICAL,
    source: "A Viagem do Descobrimento",
    characters: ["D. João I", "Filipa de Lancaster"]
  },
  {
    id: 50003,
    century: "Início do Século XV",
    title: "Início da Expansão Marítima Portuguesa",
    description: "Portugal inicia a sua expansão marítima, impulsionada por fatores econômicos, religiosos e pela ambição da nobreza.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento"
  },
  {
    id: 50004,
    year: 1415,
    title: "Conquista de Ceuta",
    description: "Conquista de Ceuta no norte da África por Portugal, um marco inicial da expansão ultramarina.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento"
  },
  {
    id: 50005,
    year: 1419,
    century: "c. 1419",
    title: "Infante D. Henrique em Lagos",
    description: "Infante D. Henrique instala-se em Lagos, no Algarve, e torna-se governador da região.",
    category: EventCategory.POLITICAL,
    source: "A Viagem do Descobrimento",
    characters: ["Infante D. Henrique"]
  },
  {
    id: 50006,
    year: 1420,
    month: 5,
    title: "D. Henrique Administrador da Ordem de Cristo",
    description: "D. João I nomeia o Infante D. Henrique administrador da Ordem dos Cavaleiros de Cristo, que financiará muitas das futuras expedições.",
    category: EventCategory.POLITICAL,
    source: "A Viagem do Descobrimento",
    characters: ["Infante D. Henrique", "D. João I"]
  },
  {
    id: 50007,
    century: "Décadas de 1430 e 1440",
    title: "Avanço das Expedições de D. Henrique na África",
    description: "As expedições lideradas por D. Henrique avançam pela costa africana, ultrapassando o Cabo Não e o Cabo Bojador. Início do tráfico de escravos africanos.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Infante D. Henrique"]
  },
  {
    id: 50008,
    year: 1441,
    title: "Antão Gonçalves Captura Africanos",
    description: "Antão Gonçalves captura os primeiros nativos africanos e os leva para Portugal.",
    category: EventCategory.SOCIAL,
    source: "A Viagem do Descobrimento",
    characters: ["Antão Gonçalves"]
  },
  {
    id: 50009,
    year: 1444,
    title: "Nuno Tristão Atinge o Rio do Ouro",
    description: "Nuno Tristão atinge o 'Rio do Ouro' (Rio Senegal) e intensifica-se o tráfico de escravos na Guiné.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Nuno Tristão"]
  },
  {
    id: 50010,
    year: 1445,
    title: "Dinis Dias Atinge o Cabo Verde",
    description: "Dinis Dias atinge o Cabo Verde.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Dinis Dias"]
  },
  {
    id: 50011,
    year: 1453,
    title: "Queda de Constantinopla",
    description: "Queda de Constantinopla para os turcos otomanos, afetando rotas de comércio e incentivando rotas marítimas alternativas.",
    category: EventCategory.INTERNATIONAL,
    source: "A Viagem do Descobrimento"
  },
  {
    id: 50012,
    year: 1469,
    title: "Fernão Gomes Explora a Costa Africana",
    description: "D. Afonso V concede a Fernão Gomes o direito de explorar a costa africana, com a obrigação de descobrir 100 léguas por ano.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Fernão Gomes", "D. Afonso V"]
  },
  {
    id: 50013,
    year: 1471,
    century: "c. 1471",
    title: "Cruzamento da Linha do Equador",
    description: "Navegadores a serviço de Fernão Gomes cruzam a linha do Equador, chegando à Ponta de Santa Catarina (Gabão).",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Fernão Gomes"]
  },
  {
    id: 50014,
    year: 1481,
    title: "D. João II Ascende ao Trono",
    description: "D. João II ascende ao trono e decide retomar e intensificar o projeto de alcançar a Índia contornando a África.",
    category: EventCategory.POLITICAL,
    source: "A Viagem do Descobrimento",
    characters: ["D. João II"]
  },
  {
    id: 50015,
    year: 1488,
    month: 1,
    title: "Bartolomeu Dias Dobra o Cabo das Tormentas",
    description: "Bartolomeu Dias dobra o Cabo das Tormentas (futuro Cabo da Boa Esperança), abrindo caminho para o Oceano Índico.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Bartolomeu Dias"]
  },
  {
    id: 50016,
    year: 1492,
    century: "c. 1492",
    title: "Colombo Chega à América e Globo de Behaim",
    description: "Cristóvão Colombo chega à América. Martim Behaim conclui o primeiro globo terrestre.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Cristóvão Colombo", "Martim Behaim"]
  },
  {
    id: 50017,
    year: 1494,
    month: 6,
    day: 7,
    title: "Tratado de Tordesilhas",
    description: "Assinatura do Tratado de Tordesilhas entre Portugal e Espanha, dividindo o mundo.",
    category: EventCategory.INTERNATIONAL,
    source: "A Viagem do Descobrimento"
  },
  {
    id: 50018,
    year: 1495,
    title: "D. Manuel I Ascende ao Trono",
    description: "Morte de D. João II e ascensão de D. Manuel I ao trono de Portugal. D. Manuel decide continuar o projeto da Índia.",
    category: EventCategory.POLITICAL,
    source: "A Viagem do Descobrimento",
    characters: ["D. Manuel I", "D. João II"]
  },
  {
    id: 50019,
    startYear: 1497,
    endYear: 1498,
    title: "Primeira Viagem de Vasco da Gama à Índia",
    description: "Primeira viagem de Vasco da Gama à Índia, contornando a África e chegando a Calicute.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Vasco da Gama", "Bartolomeu Dias"]
  },
  {
    id: 50020,
    year: 1499,
    month: 8,
    title: "Retorno de Vasco da Gama a Lisboa",
    description: "Retorno triunfal de Vasco da Gama a Lisboa, trazendo a notícia da rota marítima para a Índia.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Vasco da Gama", "D. Manuel I"]
  },
  {
    id: 50021,
    year: 1500,
    month: 3,
    day: 8,
    title: "Partida da Armada de Cabral",
    description: "Partida da armada de Pedro Álvares Cabral de Lisboa, com destino à Índia. A frota é composta por 10 naus e 3 caravelas.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Pedro Álvares Cabral"]
  },
  {
    id: 50022,
    year: 1500,
    month: 4,
    title: "Avistamento de Sinais de Terra",
    description: "Avistamento de sinais de terra (algas, aves) no Atlântico pela armada de Cabral.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Pedro Álvares Cabral"]
  },
  {
    id: 50023,
    year: 1500,
    month: 4,
    day: 23,
    title: "Armada de Cabral Ancora no Brasil",
    description: "A armada de Cabral ancora na costa do atual Brasil, em Porto Seguro, avistando o Monte Pascoal.",
    category: EventCategory.COLONIZATION,
    source: "A Viagem do Descobrimento",
    characters: ["Pedro Álvares Cabral"]
  },
  {
    id: 50024,
    startYear: 1500,
    endYear: 1500,
    month: 4,
    day: 24,
    title: "Contato Inicial com Nativos Tupiniquim",
    description: "Contato inicial com os nativos Tupiniquim, reconhecimento da costa, coleta de água e madeira, realização da primeira missa.",
    category: EventCategory.COLONIZATION,
    source: "A Viagem do Descobrimento",
    characters: ["Pedro Álvares Cabral"]
  },
  {
    id: 50025,
    year: 1500,
    month: 4,
    day: 26,
    title: "Diogo Dias Interage com Nativos",
    description: "Diogo Dias interage com os nativos, dançando e tocando gaita.",
    category: EventCategory.SOCIAL,
    source: "A Viagem do Descobrimento",
    characters: ["Diogo Dias"]
  },
  {
    id: 50026,
    year: 1500,
    month: 5,
    day: 1,
    title: "Envio da Nau de Mantimentos para Portugal",
    description: "A nau de mantimentos sob o comando de Gaspar de Lemos é enviada de volta a Portugal com a notícia do 'achamento' do Brasil e amostras da terra.",
    category: EventCategory.COLONIZATION,
    source: "A Viagem do Descobrimento",
    characters: ["Gaspar de Lemos", "Pedro Álvares Cabral"]
  },
  {
    id: 50027,
    year: 1500,
    month: 5,
    day: 2,
    title: "Armada de Cabral Segue para a Índia e Naufrágio de Bartolomeu Dias",
    description: "A armada de Cabral segue viagem rumo ao leste, para a Índia. Bartolomeu Dias e sua nau naufragam no Cabo da Boa Esperança.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Pedro Álvares Cabral", "Bartolomeu Dias"]
  },
  {
    id: 50028,
    year: 1500,
    month: 7,
    title: "Encontro em Quiloa e Separação de Diogo Dias",
    description: "Encontro dos navios remanescentes da frota de Cabral na ilha de Quiloa, após tempestade. Nau de Diogo Dias se separa e segue para Mogadíscio.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Pedro Álvares Cabral", "Diogo Dias"]
  },
  {
    id: 50029,
    startYear: 1500,
    endYear: 1501,
    month: 12,
    title: "Feitoria em Cochim",
    description: "Cabral estabelece uma feitoria em Cochim, obtendo especiarias.",
    category: EventCategory.ECONOMIC,
    source: "A Viagem do Descobrimento",
    characters: ["Pedro Álvares Cabral"]
  },
  {
    id: 50030,
    year: 1501,
    month: 1,
    day: 16,
    title: "Partida de Cabral de Cochim",
    description: "Cabral parte de Cochim de volta para Lisboa.",
    category: EventCategory.EXPLORATION,
    source: "A Viagem do Descobrimento",
    characters: ["Pedro Álvares Cabral"]
  },
  {
    id: 50031,
    year: 1501,
    month: 6,
    day: 23,
    title: "Chegada a Lisboa e Confirmação da Descoberta",
    description: "Chegada do primeiro navio da frota de Cabral a Lisboa, confirmando a descoberta do Brasil e o sucesso comercial na Índia.",
    category: EventCategory.COLONIZATION,
    source: "A Viagem do Descobrimento",
    characters: ["Pedro Álvares Cabral"]
  },
  {
    id: 50032,
    year: 1501,
    month: 7,
    title: "Notícia da 'Terra dos Papagaios'",
    description: "Domenico Piasani, embaixador veneziano na Espanha, escreve sobre a descoberta da 'Terra dos Papagaios' por Portugal.",
    category: EventCategory.CULTURAL,
    source: "A Viagem do Descobrimento",
    characters: ["Domenico Piasani"]
  },
  {
    id: 50033,
    year: 1501,
    month: 6,
    title: "Chegada de 'Aves Maravilhosas'",
    description: "Bartolomeu Marchioni escreve sobre a chegada de 'aves maravilhosas' desconhecidas a Portugal, trazidas pela caravela Anunciada.",
    category: EventCategory.CULTURAL,
    source: "A Viagem do Descobrimento",
    characters: ["Bartolomeu Marchioni"]
  }
];

export const viagemDescobrimentoPeriods: TimelinePeriod[] = [];

export const viagemDescobrimentoCharacters: Character[] = [
  {
    id: "pedro_alvares_cabral_vd",
    name: "Pedro Álvares Cabral",
    description: "Fidalgo português, comandante-chefe da armada de 1500 à Índia. Liderou a expedição que avistou o Brasil.",
    relatedEvents: [50001, 50021, 50022, 50023, 50024, 50026, 50027, 50028, 50029, 50030, 50031],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "vasco_da_gama_vd",
    name: "Vasco da Gama",
    description: "Navegador português que liderou a primeira expedição marítima à Índia (1497-1498).",
    relatedEvents: [50019, 50020],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "d_manuel_i_vd",
    name: "D. Manuel I",
    description: "Rei de Portugal durante as grandes descobertas, financiou as viagens de Vasco da Gama e Cabral.",
    relatedEvents: [50018, 50020],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "infante_d_henrique_vd",
    name: "Infante D. Henrique",
    description: "Figura central no início da expansão marítima portuguesa no século XV. Patrocinou expedições e reuniu conhecimento náutico.",
    relatedEvents: [50005, 50006, 50007],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "bartolomeu_dias_vd",
    name: "Bartolomeu Dias",
    description: "Navegador português, primeiro europeu a dobrar o Cabo da Boa Esperança em 1488. Naufragou em 1500.",
    relatedEvents: [50015, 50019, 50027],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "nicolau_coelho_vd",
    name: "Nicolau Coelho",
    description: "Navegador que capitaneou a caravela Bérrio na primeira viagem de Vasco da Gama e participou do desembarque no Brasil.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "pero_vaz_de_caminha_vd",
    name: "Pero Vaz de Caminha",
    description: "Escrivão da frota de Cabral, autor da carta ao rei D. Manuel I sobre o primeiro contato com o Brasil.",
    relatedEvents: [50024], // While not directly in events list, related to first contact event
    source: "A Viagem do Descobrimento"
  },
  {
    id: "gaspar_de_lemos_vd",
    name: "Gaspar de Lemos",
    description: "Capitão da naveta de mantimentos, enviado de volta a Portugal com a notícia do descobrimento do Brasil.",
    relatedEvents: [50026],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "sancho_de_tovar_vd",
    name: "Sancho de Tovar",
    description: "Vice-comandante da armada de Cabral, nobre castelhano exilado em Portugal.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "simão_de_miranda_de_azevedo_vd",
    name: "Simão de Miranda de Azevedo",
    description: "Capitão de nau da frota de Cabral, membro de família nobre portuguesa.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "aires_gomes_da_silva_vd",
    name: "Aires Gomes da Silva",
    description: "Capitão de nau da frota de Cabral, de família portuguesa e castelhana.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "simão_de_pina_vd",
    name: "Simão de Pina",
    description: "Capitão de nau da frota de Cabral, de origem nobre e parente do cronista Rui de Pina.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "pero_de_ataide_inferno_vd",
    name: "Pero de Ataíde ('Inferno')",
    description: "Capitão da caravela São Pedro na frota de Cabral, herói no ataque à feitoria de Calicute.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "diogo_dias_vd",
    name: "Diogo Dias",
    description: "Capitão de nau da frota de Cabral, irmão de Bartolomeu Dias. Nau separou-se da frota e foi para Mogadíscio.",
    relatedEvents: [50025, 50028],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "afonso_ribeiro_vd",
    name: "Afonso Ribeiro",
    description: "Um dos degredados deixados na costa do Brasil por Cabral.",
    relatedEvents: [50026], // While not directly in events list, related to nau de mantimentos event
    source: "A Viagem do Descobrimento"
  },
  {
    id: "mestre_joao_vd",
    name: "Mestre João",
    description: "Físico, astrônomo e astrólogo a bordo da frota de Cabral, realizou medições astronômicas no Brasil.",
    relatedEvents: [50024], // Related to reconhecimento da costa event
    source: "A Viagem do Descobrimento"
  },
  {
    id: "joao_de_barros_vd",
    name: "João de Barros",
    description: "Cronista real português, autor de 'Décadas da Ásia', descreveu a partida da armada de Cabral.",
    relatedEvents: [50021], // Related to partida da armada event
    source: "A Viagem do Descobrimento"
  },
  {
    id: "gomes_eanes_de_zurara_vd",
    name: "Gomes Eanes de Zurara",
    description: "Cronista oficial do Infante D. Henrique, autor de 'Crônica dos Feitos da Guiné'.",
    relatedEvents: [50007], // Related to expedições de D. Henrique
    source: "A Viagem do Descobrimento"
  },
  {
    id: "paolo_toscanelli_vd",
    name: "Paolo Toscanelli",
    description: "Médico e astrônomo florentino, defendia rota mais curta para a Índia pelo oeste, influenciou Colombo.",
    relatedEvents: [50016], // Related to Colombo event
    source: "A Viagem do Descobrimento"
  },
  {
    id: "cristovao_colombo_vd",
    name: "Cristóvão Colombo",
    description: "Navegador genovês que chegou à América em 1492 a serviço da Espanha, buscando rota ocidental para a Índia.",
    relatedEvents: [50016],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "martim_behaim_vd",
    name: "Martim Behaim",
    description: "Geógrafo que acompanhou Diogo Cão e concluiu o primeiro globo terrestre em 1492.",
    relatedEvents: [50016],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "bartolomeu_marchioni_vd",
    name: "Bartolomeu Marchioni",
    description: "Banqueiro florentino residente em Lisboa, financiou expedições portuguesas, incluindo a caravela Anunciada.",
    relatedEvents: [50033],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "girolamo_sernige_vd",
    name: "Girolamo Sernige",
    description: "Banqueiro florentino associado a Marchioni e à Coroa portuguesa no financiamento de expedições.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "antonio_salvago_vd",
    name: "Antonio Salvago",
    description: "Genovês associado a Marchioni e Sernige no financiamento de expedições.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "domenico_piasani_vd",
    name: "Domenico Piasani",
    description: "Embaixador veneziano na corte espanhola, relatou a descoberta do Brasil.",
    relatedEvents: [50032],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "pyrard_de_laval_vd",
    name: "Pyrard de Laval",
    description: "Navegador cujo testemunho posterior descreve condições a bordo de navios portugueses e função dos grumetes.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "alvaro_gil_cabral_vd",
    name: "Álvaro Gil Cabral",
    description: "Trisavô de Pedro Álvares Cabral, participou da Batalha de Aljubarrota.",
    relatedEvents: [50001],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "d_joao_telo_vd",
    name: "D. João Telo",
    description: "Senhor de Afonso Ribeiro, o degredado deixado no Brasil.",
    relatedEvents: [50026], // Related to Afonso Ribeiro
    source: "A Viagem do Descobrimento"
  },
  {
    id: "d_joao_i_vd",
    name: "D. João I",
    description: "Primeiro rei da dinastia de Avis, consolidou a independência de Portugal e iniciou a expansão marítima.",
    relatedEvents: [50001, 50002, 50006],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "filipa_de_lancaster_vd",
    name: "Filipa de Lancaster",
    description: "Rainha de Portugal, esposa de D. João I, de origem inglesa.",
    relatedEvents: [50002],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "d_pedro_i_vd",
    name: "D. Pedro I",
    description: "Pai de D. Fernando e avô de D. João I (filho bastardo).",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "d_fernando_vd",
    name: "D. Fernando",
    description: "Irmão do rei Afonso V, pai de D. Manuel I.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "d_beatriz_vd",
    name: "D. Beatriz",
    description: "Neta de D. João I, mãe de D. Manuel I.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "d_joao_ii_vd",
    name: "D. João II",
    description: "Filho de D. Afonso V, retomou e intensificou a exploração marítima, planejando chegar à Índia.",
    relatedEvents: [50014, 50018],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "diogo_azambuja_vd",
    name: "Diogo Azambuja",
    description: "Participou da construção da fortaleza da Mina, onde Colombo esteve.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "diogo_ortiz_vd",
    name: "Diogo Ortiz",
    description: "Bispo astrônomo, avaliou e rejeitou o projeto de Colombo para D. João II.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "afonso_v_vd",
    name: "Afonso V",
    description: "Pai de D. João II.",
    relatedEvents: [50012],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "fernando_e_isabel_vd",
    name: "Fernando e Isabel",
    description: "Reis Católicos da Espanha, financiadores da viagem de Colombo e signatários de Tordesilhas.",
    relatedEvents: [50017],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "estevao_da_gama_vd",
    name: "Estêvão da Gama",
    description: "Governador de Sines e pai de Vasco da Gama.",
    relatedEvents: [],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "paulo_da_gama_vd",
    name: "Paulo da Gama",
    description: "Irmão de Vasco da Gama, capitão de nau na primeira viagem à Índia.",
    relatedEvents: [50019],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "pero_de_alenquer_vd",
    name: "Pero de Alenquer",
    description: "Piloto experiente, acompanhou Bartolomeu Dias ao Cabo e serviu nas viagens de Gama e Cabral.",
    relatedEvents: [50015, 50019, 50021],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "pero_escolar_vd",
    name: "Pero Escolar",
    description: "Piloto renomado, pilotou navio de Coelho na viagem de Gama e serviu na expedição de Cabral.",
    relatedEvents: [50019, 50021],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "afonso_furtado_vd",
    name: "Afonso Furtado",
    description: "Escrivão e notário a bordo da frota de Cabral, responsável pelos interesses do rei e contabilidade.",
    relatedEvents: [50021], // Related to partida da armada event
    source: "A Viagem do Descobrimento"
  },
  {
    id: "duarte_pacheco_pereira_vd",
    name: "Duarte Pacheco Pereira",
    description: "Navegador português, considerado por alguns como o verdadeiro descobridor do Brasil.",
    relatedEvents: [50023], // Related to chegada ao Brasil event
    source: "A Viagem do Descobrimento"
  },
  {
    id: "fernao_gomes_vd",
    name: "Fernão Gomes",
    description: "Rico mercador de Lisboa, recebeu direito de explorar a costa africana por D. Afonso V.",
    relatedEvents: [50012, 50013],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "diogo_cao_vd",
    name: "Diogo Cão",
    description: "Navegador a serviço de D. João II, explorou a costa africana e acreditou ter chegado ao fim do continente.",
    relatedEvents: [50016], // Related to Behaim's globe event
    source: "A Viagem do Descobrimento"
  },
  {
    id: "abraao_zacuto_vd",
    name: "Abraão Zacuto",
    description: "Astrônomo e matemático judeu, trabalhou com D. Henrique e desenvolveu tabelas astronômicas.",
    relatedEvents: [50007], // Related to expedições de D. Henrique
    source: "A Viagem do Descobrimento"
  },
  {
    id: "jose_vizinho_vd",
    name: "José Vizinho",
    description: "Astrônomo e matemático judeu, trabalhou com D. Henrique e desenvolveu instrumentos de navegação.",
    relatedEvents: [50007], // Related to expedições de D. Henrique
    source: "A Viagem do Descobrimento"
  },
  {
    id: "antao_goncalves_vd",
    name: "Antão Gonçalves",
    description: "Um dos primeiros navegadores a serviço de D. Henrique a trazer cativos africanos para Portugal.",
    relatedEvents: [50008],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "nuno_tristao_vd",
    name: "Nuno Tristão",
    description: "Navegador que serviu sob D. Henrique e alcançou o 'Rio do Ouro'.",
    relatedEvents: [50009],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "alvise_cadamosto_vd",
    name: "Alvise Cadamosto",
    description: "Mercador veneziano a serviço de Portugal, viajou pela costa africana e deixou relatos detalhados.",
    relatedEvents: [50007], // Related to expedições de D. Henrique
    source: "A Viagem do Descobrimento"
  },
  {
    id: "dinis_dias_vd",
    name: "Dinis Dias",
    description: "Navegador português que atingiu o Cabo Verde.",
    relatedEvents: [50010],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "papa_eugenio_iv_vd",
    name: "Papa Eugênio IV",
    description: "Papa que concedeu bulas a Portugal garantindo monopólio do comércio e autorização para escravizar 'infiéis' na África.",
    relatedEvents: [50007], // Related to tráfico de escravos event
    source: "A Viagem do Descobrimento"
  },
  {
    id: "papa_nicolau_v_vd",
    name: "Papa Nicolau V",
    description: "Papa que concedeu bulas a Portugal garantindo monopólio do comércio e autorização para escravizar 'infiéis' na África.",
    relatedEvents: [50007], // Related to tráfico de escravos event
    source: "A Viagem do Descobrimento"
  },
  {
    id: "samorim_de_calicute_vd",
    name: "Samorim de Calicute",
    description: "Governante de Calicute, com quem os portugueses buscaram estabelecer relações comerciais na Índia.",
    relatedEvents: [50019], // Related to viagem de Vasco da Gama
    source: "A Viagem do Descobrimento"
  },
  {
    id: "raja_de_cochim_vd",
    name: "Rajá de Cochim",
    description: "Governante de Cochim, rival de Calicute, permitiu que Cabral carregasse navios de especiarias.",
    relatedEvents: [50029],
    source: "A Viagem do Descobrimento"
  },
  {
    id: "martin_waldssemuler_vd",
    name: "Martin Waldssemuler",
    description: "Geógrafo alemão que propôs o nome 'América' para o novo continente.",
    relatedEvents: [50016], // Related to Colombo event
    source: "A Viagem do Descobrimento"
  },
  {
    id: "bernardino_jose_de_sousa_vd",
    name: "Bernardino José de Sousa",
    description: "Autor do livro 'O Pau-Brasil na História Nacional'.",
    relatedEvents: [50032, 50033], // Related to events about Brazil discovery news
    source: "A Viagem do Descobrimento"
  },
  {
    id: "ptolomeu_vd",
    name: "Ptolomeu",
    description: "Geógrafo grego antigo, obra influente na cartografia europeia, representações questionadas pela expansão marítima.",
    relatedEvents: [50003], // Related to expansão marítima portuguesa
    source: "A Viagem do Descobrimento"
  },
  {
    id: "fra_mauro_vd",
    name: "Fra Mauro",
    description: "Cartógrafo italiano, produziu mapas-múndi a pedido de D. João II, mostrando a África como península contornável.",
    relatedEvents: [50014], // Related to D. João II plans
    source: "A Viagem do Descobrimento"
  },
  {
    id: "andre_bianco_vd",
    name: "André Bianco",
    description: "Cartógrafo italiano, produziu mapas-múndi a pedido de D. João II, mostrando a África como península contornável.",
    relatedEvents: [50014], // Related to D. João II plans
    source: "A Viagem do Descobrimento"
  },
  {
    id: "pierre_d_ally_vd",
    name: "Pierre d'Ally",
    description: "Autor do 'Imago Mundi', obra lida por Cristóvão Colombo.",
    relatedEvents: [50016], // Related to Colombo event
    source: "A Viagem do Descobrimento"
  },
  {
    id: "pomponio_mela_vd",
    name: "Pompônio Mela",
    description: "Geógrafo romano antigo, autor de 'De Situ Orbis', traduzido para castelhano por Mestre João.",
    relatedEvents: [50024, 50026], // Related to Mestre João and early Brazil events
    source: "A Viagem do Descobrimento"
  },
  {
    id: "hippalus_vd",
    name: "Hippalus",
    description: "Geógrafo grego, estudou as monções no Oceano Índico.",
    relatedEvents: [50019], // Related to viagem de Vasco da Gama to India
    source: "A Viagem do Descobrimento"
  },
  {
    id: "pessanha_vd",
    name: "Pessanha",
    description: "Almirante genovês, introduziu o hábito das toucas vermelhas entre marinheiros em Portugal.",
    relatedEvents: [50021], // Related to armada de Cabral departure - naval context
    source: "A Viagem do Descobrimento"
  },
  {
    id: "sao_brandao_vd",
    name: "São Brandão",
    description: "Monge irlandês lendário, associado à ilha mítica de Hy Brazil.",
    relatedEvents: [50023], // Related to Brazil 'achamento'
    source: "A Viagem do Descobrimento"
  },
  {
    id: "adahu_vd",
    name: "Adahú",
    description: "Nobre azenegue (berbere islamizado) capturado por Antão Gonçalves, forneceu informações sobre a África aos portugueses.",
    relatedEvents: [50008],
    source: "A Viagem do Descobrimento"
  }
];
