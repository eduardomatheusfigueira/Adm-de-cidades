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
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40002,
    year: 1527,
    title: "Numeramentos em Portugal (1527 e 1532)",
    description: "Realização de 'numeramentos' (recenseamentos populacionais) em Portugal, parte do esforço do Estado para aumentar o controle sobre seus súditos.",
    category: EventCategory.POLITICAL,
    source: "A Coroa, a cruz e a espada",
    endYear: 1532
  },
  {
    id: 40003,
    year: 1534,
    month: 4,
    title: "Duarte Pereira Recebe Capitania da Bahia",
    description: "Duarte Pereira recebe a capitania da Bahia para colonização.",
    category: EventCategory.COLONIZATION,
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40004,
    year: 1540,
    century: "Por volta de 1540",
    title: "Estado Português Aumenta Controle",
    description: "O Estado português começa a estabelecer mecanismos para aumentar o controle, a coerção e o domínio sobre seus súditos, incluindo alistamento militar obrigatório, definição de fronteiras e um sistema judicial mais poderoso. Essa política seria posteriormente exportada para os territórios ultramarinos.",
    category: EventCategory.POLITICAL,
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40005,
    year: 1546,
    month: 4,
    day: 29,
    title: "Pero de Góis Alerta sobre Perda do Brasil",
    description: "Pero de Góis, donatário da capitania de São Tomé, escreve ao rei D. João III alertando sobre a possibilidade de perda do Brasil devido à falta de justiça e temor a Deus e à Coroa.",
    category: EventCategory.POLITICAL,
    characters: ["Pero de Góis"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40006,
    year: 1549,
    month: 3,
    title: "Chegada de Manuel da Nóbrega e Primeiros Jesuítas",
    description: "Manuel da Nóbrega chega ao Brasil com os primeiros jesuítas, desembarcando na Vila Velha (Bahia).",
    category: EventCategory.SOCIAL,
    characters: ["Manuel da Nóbrega"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40007,
    year: 1549,
    month: 3,
    day: 29,
    title: "Chegada de Tomé de Sousa, Primeiro Governador-Geral",
    description: "A frota do primeiro governador-geral, Tomé de Sousa, chega à baía de Todos os Santos, na Bahia.",
    category: EventCategory.POLITICAL,
    characters: ["Tomé de Sousa"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40008,
    year: 1549,
    month: 5,
    century: "Maio de 1549 (possivelmente dia 1º)",
    title: "Início da Construção de Salvador",
    description: "Iniciam-se as obras de construção da cidade de Salvador, capital do Brasil.",
    category: EventCategory.URBANIZATION,
    characters: ["Tomé de Sousa"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40009,
    year: 1549,
    century: "Fins de 1549",
    title: "Notícias de Lavras de Ouro em Porto Seguro",
    description: "Começam a circular notícias em Porto Seguro sobre a existência de ricas lavras de ouro.",
    category: EventCategory.ECONOMIC,
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40010,
    year: 1550,
    title: "Expedição de Miguel Henriques ao Peru (Desaparece)",
    description: "Tomé de Sousa envia uma expedição sob o comando de Miguel Henriques para vistoriar o Peru, acreditando que Brasil e Peru eram 'uma mesma coisa'. A expedição desaparece.",
    category: EventCategory.EXPLORATION,
    characters: ["Tomé de Sousa", "Miguel Henriques"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40011,
    year: 1550,
    title: "Primeira Armada de Socorro Chega a Salvador",
    description: "Chega a Salvador a primeira armada de socorro enviada de Portugal.",
    category: EventCategory.POLITICAL,
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40012,
    year: 1550,
    title: "D. João III Solicita Bispado no Brasil",
    description: "Atendendo a um pedido do mestre Simão Rodrigues, o rei D. João III solicita ao Papa Júlio III a criação de um bispado no Brasil.",
    category: EventCategory.POLITICAL,
    characters: ["D. João III", "Simão Rodrigues"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40013,
    year: 1551,
    month: 2,
    day: 25,
    title: "Criação da Diocese do Brasil e Nomeação de Pero Fernandes Sardinha",
    description: "É criada a Diocese do Brasil, e Pero Fernandes Sardinha é nomeado o primeiro bispo.",
    category: EventCategory.POLITICAL,
    characters: ["Pero Fernandes Sardinha"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40014,
    year: 1551,
    month: 7,
    day: 18,
    title: "Tomé de Sousa Pede Retorno a Portugal",
    description: "Tomé de Sousa escreve ao rei D. João III pedindo para retornar a Portugal, pois seus três anos de governo estão se completando em janeiro de 1552.",
    category: EventCategory.POLITICAL,
    characters: ["Tomé de Sousa", "D. João III"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40015,
    year: 1551,
    month: 8,
    title: "Luís Dias Deseja Retornar a Portugal",
    description: "Agosto de 1551: Luís Dias, oficial régio, escreve ao rei expressando seu desejo de retornar a Portugal com Tomé de Sousa, devido à sua idade e saúde debilitada, e por não ver mais necessidade de seus serviços.",
    category: EventCategory.SOCIAL,
    characters: ["Luís Dias", "Tomé de Sousa"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40016,
    year: 1552,
    month: 6,
    title: "Chegada do Primeiro Bispo, D. Pero Fernandes Sardinha",
    description: "Chega a Salvador o primeiro bispo do Brasil, D. Pero Fernandes Sardinha, demonstrando choque com a excessiva devoção dos jesuítas liderados por Nóbrega.",
    category: EventCategory.SOCIAL,
    characters: ["Pero Fernandes Sardinha", "Manuel da Nóbrega"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40017,
    year: 1552,
    month: 6,
    title: "Libertação de Hans Staden",
    description: "O mercenário alemão Hans Staden, capturado pelos Tamoio em Bertioga (fins de janeiro), é libertado e retorna para a Europa.",
    category: EventCategory.SOCIAL,
    characters: ["Hans Staden"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40018,
    year: 1552,
    title: "Guerras Civis entre Bispo Sardinha e Governador Duarte da Costa",
    description: "Auge das 'guerras civis' entre o bispo Sardinha e o governador Duarte da Costa.",
    category: EventCategory.POLITICAL,
    characters: ["Pero Fernandes Sardinha", "Duarte da Costa"],
    source: "A Coroa, a cruz e a espada",
    endYear: 1552,
    month: 10
  },
  {
    id: 40019,
    year: 1552,
    month: 11,
    title: "Tomé de Sousa Navega para o Sul",
    description: "Tomé de Sousa, impedido de visitar Pernambuco e ciente dos perigos marítimos, decide navegar para o Sul.",
    category: EventCategory.EXPLORATION,
    characters: ["Tomé de Sousa"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40020,
    year: 1553,
    month: 6,
    day: 15,
    title: "Nóbrega Critica João Ramalho em Piratininga",
    description: "Manuel da Nóbrega menciona pela primeira vez a presença de João Ramalho nos campos de Piratininga, criticando seu modo de vida semelhante ao dos indígenas.",
    category: EventCategory.SOCIAL,
    characters: ["Manuel da Nóbrega", "João Ramalho"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40021,
    year: 1553,
    month: 6,
    title: "Pero de Góis Sugere Povoamento no Rio de Janeiro",
    description: "Pero de Góis escreve ao rei relatando sua entrada no Rio de Janeiro e sugerindo a necessidade de povoamento na região para evitar a presença francesa.",
    category: EventCategory.COLONIZATION,
    characters: ["Pero de Góis"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40022,
    year: 1554,
    month: 6,
    title: "Hans Staden Encontra Juan Sanches de Biscaia no Cativeiro",
    description: "Hans Staden, prisioneiro dos Tamoio em Ubatuba, encontra seu antigo companheiro Juan Sanches de Biscaia, que não consegue libertá-lo.",
    category: EventCategory.SOCIAL,
    characters: ["Hans Staden", "Juan Sanches de Biscaia"],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: 40023,
    year: 1557,
    title: "Fim do Reinado de D. João III",
    description: "Fim do reinado de D. João III.",
    category: EventCategory.POLITICAL,
    characters: ["D. João III"],
    source: "A Coroa, a cruz e a espada"
  }
];

export const colonizacaoBrasilPeriods: TimelinePeriod[] = [];

export const colonizacaoBrasilCharacters: Character[] = [
  {
    id: "d_joao_iii_cb",
    name: "D. João III",
    description: "Rei de Portugal de 1521 a 1557. Considerado 'o colonizador do Brasil', transferiu para a iniciativa particular a responsabilidade de ocupar o Brasil inicialmente, e depois estabeleceu o Governo-Geral. Governou por conselho e enfrentou desafios financeiros e a ameaça de outros reinos europeus.",
    relatedEvents: [40001, 40005, 40012, 40014, 40023],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "manuel_da_nobrega_cb",
    name: "Manuel da Nóbrega",
    description: "Padre jesuíta que liderou o primeiro grupo de missionários para o Brasil em 1549. Fundou o Colégio de São Paulo em Piratininga e desempenhou um papel crucial na catequização dos indígenas e na organização da colônia. Teve desavenças com o primeiro bispo, Sardinha.",
    relatedEvents: [40006, 40016, 40020],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "tome_de_sousa_cb",
    name: "Tomé de Sousa",
    description: "Primeiro governador-geral do Brasil (chegou em 1549). Encarregado de estabelecer a ordem, construir a capital (Salvador) e impulsionar o desenvolvimento da colônia. Enfrentou desafios como a falta de recursos, conflitos com o bispo e a saudade de sua família.",
    relatedEvents: [40007, 40008, 40010, 40014, 40019],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "duarte_da_costa_cb",
    name: "Duarte da Costa",
    description: "Segundo governador-geral do Brasil (sucedeu Tomé de Sousa). Seu governo foi marcado por conflitos, especialmente com o bispo Sardinha ('guerras civis').",
    relatedEvents: [40018],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "pero_fernandes_sardinha_cb",
    name: "Pero Fernandes Sardinha",
    description: "Primeiro bispo do Brasil (chegou em 1552). Entrou em conflito com os jesuítas liderados por Nóbrega devido a divergências sobre a conduta dos colonos e a abordagem da catequização. Também teve sérios desentendimentos com o governador Duarte da Costa. Morreu ao naufragar na costa brasileira, sendo posteriormente devorado por indígenas.",
    relatedEvents: [40013, 40016, 40018],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "hans_staden_cb",
    name: "Hans Staden",
    description: "Mercenário alemão que chegou ao Brasil em 1552 com a expedição de Juan de Salazar. Foi capturado pelos Tamoio em Bertioga e permaneceu prisioneiro por alguns meses antes de ser libertado. Sua experiência foi registrada em um livro que o tornou famoso na Europa.",
    relatedEvents: [40017, 40022],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "pero_de_gois_cb",
    name: "Pero de Góis",
    description: "Donatário da capitania de São Tomé. Em 1546, alertou o rei sobre a possibilidade de perda do Brasil. Sua capitania enfrentou dificuldades e ataques indígenas.",
    relatedEvents: [40005, 40021],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "duarte_coelho_cb",
    name: "Duarte Coelho",
    description: "Donatário da capitania de Pernambuco. Correspondia-se com o rei e mencionou a condição 'velha e doente' de Duarte Pereira ao chegar ao Brasil.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "francisco_pereira_cb",
    name: "Francisco Pereira",
    description: "Donatário da capitania da Bahia (anterior a Duarte Pereira). Faleceu antes da chegada de Tomé de Sousa.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "diogo_alvares_caramuru_cb",
    name: "Diogo Álvares (Caramuru)",
    description: "Português que vivia no Brasil antes da chegada dos colonizadores. Casado com uma indígena, tinha grande influência sobre os nativos e serviu de intermediário e provedor de mantimentos para Tomé de Sousa, por ordem do rei.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "paulo_dias_adorno_cb",
    name: "Paulo Dias Adorno",
    description: "Genro de Caramuru. Auxiliou o sogro a manter a paz com os indígenas e assessorou o governador Tomé de Sousa. Era um dos irmãos Adorno, fidalgos genoveses envolvidos na produção de açúcar em São Vicente.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "antonio_de_ataide_cb",
    name: "Antônio de Ataíde",
    description: "Conselheiro de D. João III que alertou sobre a situação financeira da Coroa e a necessidade de restringir gastos antes de investir no Brasil.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "fernao_alvares_cb",
    name: "Fernão d’Álvares",
    description: "Outro conselheiro de D. João III que participou das discussões sobre os destinos do Brasil, especialmente após a morte do donatário da Bahia. Financiou dois navios mercantes que acompanharam a frota de Tomé de Sousa.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "joao_de_sousa_cb",
    name: "João de Sousa",
    description: "Prior de um mosteiro e 'senhor de juro e herdade'. Teve seus rendimentos confiscados pela Coroa para financiar recompensas a quem servisse na guerra contra os mouros.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "pero_de_gois_capitao_mor_da_costa_cb",
    name: "Pero de Góis (Capitão-Mor da Costa)",
    description: "Supervisionou a construção da zona portuária da cidade de Salvador.",
    relatedEvents: [40008],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "luis_dias_cb",
    name: "Luís Dias",
    description: "Oficial régio no Brasil que expressou sua insatisfação com a pobreza da terra e o desejo de retornar a Portugal.",
    relatedEvents: [40015],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "simao_rodrigues_cb",
    name: "Simão Rodrigues",
    description: "Superior de Manuel da Nóbrega na Companhia de Jesus.",
    relatedEvents: [40012],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "inacio_de_loyola_cb",
    name: "Inácio de Loyola",
    description: "Fundador da Companhia de Jesus (Ordem dos Jesuítas).",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "juan_de_azpilcueta_navarro_cb",
    name: "Juan de Azpilcueta Navarro",
    description: "Padre jesuíta que acompanhou Nóbrega na primeira missão ao Brasil.",
    relatedEvents: [40006],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "pero_correia_cb",
    name: "Pero Correia",
    description: "Membro da comitiva de Tomé de Sousa e aliado dos jesuítas, cujos depoimentos eram usados contra o bispo Sardinha.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "miguel_henriques_cb",
    name: "Miguel Henriques",
    description: "Comandou a expedição enviada por Tomé de Sousa para o Peru em 1550, que desapareceu.",
    relatedEvents: [40010],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "luis_de_gois_cb",
    name: "Luís de Góis",
    description: "Temia que os franceses se estabelecessem na capitania de São Tomé.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "martim_afonso_de_sousa_cb",
    name: "Martim Afonso de Sousa",
    description: "Liderou uma expedição colonizadora anterior à de Tomé de Sousa. A capitania do Rio de Janeiro estava dentro de sua jurisdição.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "joao_sanches_de_biscaia_cb",
    name: "João Sanches de Biscaia",
    description: "Piloto-mor e antigo companheiro de viagem de Hans Staden. Encontrou Staden prisioneiro, mas não conseguiu libertá-lo.",
    relatedEvents: [40022],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "felipe_de_guillen_cb",
    name: "Felipe de Guillen",
    description: "Inventor espanhol que viveu exilado no Brasil após ser desmascarado em Portugal por fraude com um astrolábio.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "joao_ramalho_cb",
    name: "João Ramalho",
    description: "Português que vivia em Piratininga antes da chegada dos colonizadores. Tinha muitos filhos com indígenas e um modo de vida similar ao deles, sendo criticado pelos jesuítas. Fundador da Vila de Santo André.",
    relatedEvents: [40020],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "leonardo_nunes_cb",
    name: "Leonardo Nunes",
    description: "Padre que fundou um lugarejo no topo do planalto acima de São Vicente, que foi transformado em Vila de Santo André por Tomé de Sousa.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "carlos_v_cb",
    name: "Carlos V",
    description: "Imperador do Sacro Império Romano-Germânico e rei da Espanha, cujos marcos de posse foram encontrados por Tomé de Sousa na costa sul do Brasil.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "juan_de_salazar_cb",
    name: "Juan de Salazar",
    description: "Líder da expedição espanhola com a qual Hans Staden chegou inicialmente ao Brasil.",
    relatedEvents: [40017],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "mem_de_sa_cb",
    name: "Mem de Sá",
    description: "Nomeado terceiro governador-geral do Brasil após os turbulentos governos de Duarte da Costa e Mem de Sá (mencionado brevemente no final).",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "pero_borges_cb",
    name: "Pero Borges",
    description: "Oficial régio envolvido em conflitos com Duarte da Costa e seu filho, D. Álvaro.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "antonio_cardoso_cb",
    name: "Antônio Cardoso",
    description: "Oficial régio que se desentendeu com Duarte da Costa e seu filho.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "jorge_fernandes_cb",
    name: "Jorge Fernandes",
    description: "Médico que se queixou do tratamento recebido e da conduta do bispo Sardinha.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "rodrigo_de_freitas_cb",
    name: "Rodrigo de Freitas",
    description: "Escrivão do armazém de Salvador que foi preso sob o governo de Duarte da Costa por irregularidades nas contas.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  },
  {
    id: "d_alvaro_da_costa_cb",
    name: "D. Álvaro da Costa",
    description: "Filho do governador Duarte da Costa, também envolvido em conflitos.",
    relatedEvents: [],
    source: "A Coroa, a cruz e a espada"
  }
];
