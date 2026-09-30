import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';

export const historiaConstitucionalSource: SourceInfo = {
  id: "historia_constitucional",
  name: "História Constitucional do Brasil",
  author: "Aurelino Leal e Diários da Assembleia Constituinte",
  color: "#81E6D9",
  description: "Análise da história constitucional do Brasil, desde as ideias constitucionais de 1820 até a Constituição de 1891, baseada na obra de Aurelino Leal e nos diários da Assembleia Constituinte."
};

export const historiaConstitucionalEvents: TimelineEvent[] = [
  {
    id: 30001,
    year: 1815,
    title: "Tentativas de Maler de Inspirar D. João VI",
    description: "Tentativas de Maler de inspirar D. João VI com ideias menos desfavoráveis à participação da nação no governo são repelidas pelo rei.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30002,
    year: 1820,
    month: 9,
    title: "Levante Constitucionalista em Portugal",
    description: "Levante constitucionalista em Portugal serve como marco para a história constitucional brasileira.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30003,
    year: 1821,
    month: 1,
    day: 1,
    title: "Pará Adere a Portugal e às Cortes",
    description: "O Pará adere a Portugal e às Cortes, jurando a Constituição Portuguesa.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30004,
    year: 1821,
    month: 2,
    title: "Bahia Jura Pacto Constitucional Português",
    description: "Na Bahia, jura-se 'interinamente' o pacto constitucional português.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30005,
    year: 1821,
    title: "Decreto Real Vigorar Constituição Portuguesa (Revogado)",
    description: "No Rio de Janeiro, um decreto real manda vigorar a Constituição Portuguesa por 24 horas antes de ser revogado.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30006,
    year: 1821,
    title: "Resistência de D. João VI à Constituição Brasileira",
    description: "D. João VI, influenciado por Tomás Antônio, resiste à ideia de uma Constituição política para o Brasil, mesmo após a partida de D. Pedro.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30007,
    year: 1821,
    title: "Borges Carneiro Defende Envio de Tropas para Bahia",
    description: "Borges Carneiro, nas Cortes Portuguesas, defende o envio de tropas para a Bahia sob o comando de Bernardo da Silveira e a retirada do governador Madeira e Manuel Pedro.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30008,
    year: 1821,
    title: "São Paulo Instrui Deputados nas Cortes",
    description: "O governo de São Paulo instrui seus deputados nas Cortes a agirem segundo seus princípios.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30009,
    year: 1821,
    month: 12,
    title: "Paulistas Propõem Deputação Brasileira",
    description: "Paulistas lançam a ideia de uma 'deputação brasileira' para tomar medidas urgentes para o Brasil, dada a distância de Portugal.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30010,
    year: 1822,
    title: "Cortes Portuguesas como Palco da Constitucionalização",
    description: "As tentativas de constitucionalização do Brasil têm como palco as Cortes Portuguesas.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30011,
    year: 1822,
    month: 6,
    day: 15,
    title: "Primeiro Projeto de Artigos Adicionais nas Cortes",
    description: "Primeiro projeto de artigos adicionais nas Cortes Portuguesas propõe um Poder Legislativo duplo em Portugal e no Brasil e a sanção das leis brasileiras pelo regente, com revisão posterior pelas Cortes.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30012,
    year: 1822,
    month: 6,
    day: 3,
    title: "Decreto Instruções Eleitorais para Assembleia no Brasil",
    description: "Decreto de 3 de Junho estabelece instruções eleitorais com disposições constitucionais para a formação de uma Assembleia no Brasil.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30013,
    year: 1822,
    title: "José Bonifácio Defende Conselho Repentino",
    description: "José Bonifácio acredita que a 'salvação da pátria' depende da instalação repentina de um Conselho, devido à atuação do partido português e à falta de coesão no país.",
    category: EventCategory.POLITICAL,
    characters: ["José Bonifácio de Andrada e Silva"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30014,
    year: 1822,
    title: "Ministros Representam a D. Pedro sobre Independência",
    description: "Uma representação dos ministros a D. Pedro enfatiza o direito inalienável do Brasil de estabelecer seu governo e independência, defendendo a permanência do príncipe regente.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro I"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30015,
    year: 1822,
    title: "Instruções Eleitorais Excluem Grupos do Voto",
    description: "As instruções eleitorais para a futura Assembleia Constituinte brasileira excluem religiosos regulares, estrangeiros não naturalizados e criminosos do direito de voto.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30016,
    year: 1822,
    month: 5,
    day: 2,
    title: "Discussão sobre Entrada de D. Pedro na Constituinte",
    description: "Discussão na futura Constituinte sobre a forma como D. Pedro I deveria entrar no salão, com a decisão de que ele entraria descoberto.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro I"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30017,
    year: 1822,
    title: "Debate sobre Frase do Trono",
    description: "Debate sobre a frase do trono: 'com a minha espada defenderei a pátria, a nação e a Constituição, se for digna do Brasil e de mim', com o Congresso expressando sua expectativa de uma Constituição digna.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro I"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30018,
    year: 1823,
    title: "Funcionamento da Assembleia Constituinte Brasileira",
    description: "Funcionamento da Assembleia Constituinte brasileira, que demonstra ser ciosa de seu poder e busca substituir o regime absoluto por um legal e representativo.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30019,
    year: 1823,
    title: "Requerimento por Demissão de Ministros Nocivos",
    description: "Requerimento da Câmara dos Deputados ao imperador pela demissão de ministros considerados nocivos, embora o imperador pudesse não deferir o pedido.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30020,
    year: 1823,
    title: "Aprovação de Artigos Constitucionais",
    description: "Discussão e aprovação de artigos da Constituição, como os relativos à liberdade individual (com exceções), ao Poder Legislativo (protegendo seus membros) e ao Poder Judiciário (organização incompleta com juízes vitalícios e jurados).",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30021,
    year: 1823,
    title: "Fundamentos de Humanidade para Regime Prisional",
    description: "Fundamentos de alta humanidade são estabelecidos para o regime das prisões, proibindo tortura e penas cruéis.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30022,
    year: 1823,
    title: "Cidadania de Origem com Restrições",
    description: "A Constituição reconhece a cidadania de origem, mas impõe restrições jurídico-políticas a brasileiros nascidos em Portugal.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30023,
    year: 1823,
    month: 5,
    title: "Suspeita de Missão de Vilela Barbosa",
    description: "Maio: Suspeita de que Vilela Barbosa foi enviado de Lisboa ao Rio de Janeiro para tratar da união e da dissolução da Constituinte, com supostas cartas mencionando encontros com o imperador e outros.",
    category: EventCategory.POLITICAL,
    characters: ["Vilela Barbosa"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30024,
    year: 1823,
    title: "Influência de Domitila (Marquesa de Santos)",
    description: "A amante de D. Pedro I, Domitila, a Marquesa de Santos, exerce influência sobre o imperador.",
    category: EventCategory.SOCIAL,
    characters: ["Marquesa de Santos"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30025,
    year: 1823,
    title: "Irritação de José Bonifácio com Domitila",
    description: "José Bonifácio expressa irritação com a crescente influência de Domitila.",
    category: EventCategory.SOCIAL,
    characters: ["José Bonifácio de Andrada e Silva", "Marquesa de Santos"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30026,
    year: 1823,
    title: "Discurso Anti-Portugal de D. Pedro I",
    description: "D. Pedro I, sob a influência dos Andradas, adota um discurso anti-Portugal.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro I", "Andradas"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30027,
    year: 1823,
    title: "Imprensa Nativista 'O Tamoio'",
    description: "Após a saída dos Andradas do ministério, a imprensa nativista ganha força com 'O Tamoio', fundado por Vasconcelos de Drummond e França Miranda, e orientado pelos Andradas.",
    category: EventCategory.CULTURAL,
    characters: ["Andradas"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30028,
    year: 1823,
    title: "Discurso Inflamado de Antônio Carlos na Constituinte",
    description: "Antônio Carlos profere um discurso inflamado na Constituinte em resposta a eventos envolvendo tropas portuguesas, defendendo a honra brasileira e propondo a expulsão de 'quem poluiu' o Império.",
    category: EventCategory.POLITICAL,
    characters: ["Antônio Carlos Ribeiro de Andrada Machado e Silva"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30029,
    year: 1823,
    title: "Manifestação de Martim Francisco contra Tropas Portuguesas",
    description: "Martim Francisco também se manifesta contra as tropas portuguesas.",
    category: EventCategory.POLITICAL,
    characters: ["Martim Francisco Ribeiro de Andrada"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30030,
    year: 1823,
    month: 11,
    day: 12,
    title: "Dissolução da Assembleia Constituinte por D. Pedro I",
    description: "Dissolução da Assembleia Constituinte por D. Pedro I.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro I"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30031,
    year: 1823,
    title: "Festa de D. Pedro I pela Dissolução da Constituinte",
    description: "Festa organizada por D. Pedro I para celebrar a dissolução da Constituinte, com a participação de Vilela Barbosa, Clemente Ferreira França e Domitila.",
    category: EventCategory.SOCIAL,
    characters: ["D. Pedro I", "Vilela Barbosa", "Clemente Ferreira França", "Marquesa de Santos"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30032,
    year: 1823,
    title: "Reação da Bahia à Dissolução",
    description: "Bahia reage à dissolução, manifestando 'profunda mágoa' e esperando que o imperador cumpra suas promessas de apresentar um projeto de Constituição mais liberal.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30033,
    year: 1823,
    title: "Adesão ao Golpe de Estado no Sul",
    description: "No Sul, a adesão ao golpe de estado é geral, com São Paulo tomando a dianteira ao enviar mensagem a D. Pedro I agradecendo pela dissolução.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30034,
    year: 1823,
    title: "Adesão de Minas Gerais, SC, RS e Cisplatina",
    description: "Minas Gerais, Santa Catarina, Rio Grande do Sul e a Cisplatina também aderem.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30035,
    year: 1823,
    title: "Governo Imperial Busca Presidentes de Província Prudentes",
    description: "O governo imperial busca pessoas de tato e prudência para reger as províncias como presidentes, temendo a separação devido à desconfiança.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30036,
    year: 1823,
    month: 10,
    day: 23,
    title: "Lei Estabelece Conformidade de Presidentes de Província",
    description: "Lei estabelecendo a conformidade dos presidentes de província com a lei.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30037,
    year: 1823,
    title: "Apostolado Discute Poder Monárquico contra Leis Injustas",
    description: "Membros do Apostolado discutem a necessidade de dar ao monarca o poder de se opor a leis injustas e desarrazoadas.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30038,
    year: 1824,
    title: "Carta Outorgada Define Poder Legislativo com Monarca",
    description: "A Carta Constitucional outorgada por D. Pedro I estabelece um Poder Legislativo com a participação do monarca (proposição, oposição e aprovação).",
    category: EventCategory.LEGISLATION,
    characters: ["D. Pedro I"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30039,
    year: 1824,
    title: "Questões Constitucionais e Anualidade Tributária",
    description: "Questões constitucionais ligadas à anualidade tributária são definidas, com a dívida pública assegurada.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30040,
    year: 1824,
    title: "Carta Imperial e Elemento Federal",
    description: "A Carta Imperial, no que tange ao elemento federal, nomeia as unidades territoriais como províncias e estabelece conselhos gerais de província com poder para propor, discutir e deliberar sobre assuntos de interesse local.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30041,
    year: 1824,
    title: "Sítio como Corretivo Político",
    description: "O sítio é utilizado como corretivo de embaraços políticos, embora a lei o preveja como último recurso.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30042,
    year: 1824,
    title: "Rio de Janeiro Vota Contra Projeto da Constituição",
    description: "A província do Rio de Janeiro vota contra o projeto da Constituição, mas D. Pedro I prefere aguardar outras manifestações.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro I"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30043,
    year: 1824,
    title: "Constituição Define Milícias, Juízes e Polícia",
    description: "A Constituição estabelece que as milícias só sairiam de seus quartéis em caso de guerra ou rebelião, institui juízes e jurados no cível e no crime, e delega o governo policial aos juízes de paz.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30044,
    year: 1824,
    title: "Constitucionalistas de Itu e Liberdade de Pensamento Restrita",
    description: "Os constitucionalistas de Itu propõem uma visão mais restritiva da liberdade de pensamento, estabelecendo censura em certos casos, e estendem a fiança a quase todos os crimes.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30045,
    year: 1824,
    title: "Vergueiro Discursa a Favor do Juramento da Carta de 1824",
    description: "Vergueiro, preso e solto durante a dissolução da Constituinte, pronuncia um discurso favorável ao juramento da Carta de 1824.",
    category: EventCategory.POLITICAL,
    characters: ["Vergueiro"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30046,
    year: 1824,
    title: "Decretos de Sítio sem Duração Definida",
    description: "Decretos de sítio em Pernambuco, Ceará, Bahia, Cisplatina e Rio Grande do Sul não especificam o tempo de duração, contrariando a Carta.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30047,
    year: 1824,
    title: "Comissões Militares sem Formalidades Legais",
    description: "Comissões militares estabelecidas durante o estado de sítio funcionam sem seguir as formalidades legais, sendo consideradas por Bernardo de Vasconcelos como 'um invento infernal'.",
    category: EventCategory.REPRESSION,
    characters: ["Bernardo de Vasconcelos"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30048,
    year: 1824,
    title: "Evaristo da Veiga Defende Reforma Constitucional",
    description: "Evaristo da Veiga defende a reforma constitucional na 'Aurora Fluminense', buscando a federação e a adaptação às necessidades das províncias, mas mantendo a união do Brasil e evitando a revolução.",
    category: EventCategory.INTELLECTUAL,
    characters: ["Evaristo da Veiga"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30049,
    year: 1824,
    month: 10,
    day: 5,
    title: "Decreto Estabelecendo Sítio no Ceará",
    description: "Decreto estabelecendo o sítio no Ceará.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30050,
    year: 1825,
    month: 5,
    day: 18,
    title: "Decreto Estabelecendo Sítio na Cisplatina",
    description: "Decreto estabelecendo o sítio na Cisplatina.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30051,
    year: 1830,
    month: 7,
    day: 30,
    title: "Atuação de Honório Hermeto em Agitação Política",
    description: "Atuação de Honório Hermeto durante um período de agitação política, defendendo o interesse comum acima da disciplina partidária, demonstrando a importância de uma palavra calma e ponderada.",
    category: EventCategory.POLITICAL,
    characters: ["Honório Hermeto Carneiro Leão"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30052,
    year: 1834,
    title: "Reforma Constitucional (Ato Adicional)",
    description: "Reforma constitucional (Ato Adicional) estabelece o Poder Legislativo local nas províncias, com autonomia sobre diversas áreas, e a regência una e eletiva. O Conselho de Estado é suprimido.",
    category: EventCategory.LEGISLATION,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30053,
    year: 1834,
    title: "Preocupações com o Ato Adicional",
    description: "Justiniano da Rocha e outros expressam preocupações com o Ato Adicional, vendo nele o 'gérmen da anarquia e da ruína da unidade brasileira' devido à ampliação das atribuições das assembleias provinciais.",
    category: EventCategory.POLITICAL,
    characters: ["Justiniano José da Rocha"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30054,
    year: 1834,
    title: "Incursões Provinciais nos Direitos do Império",
    description: "Visconde de Uruguai registra inúmeros casos de incursões provinciais nos direitos do Império após o Ato Adicional.",
    category: EventCategory.POLITICAL,
    characters: ["Visconde de Uruguai"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30055,
    year: 1840,
    title: "Debate sobre Atribuições do Monarca no Legislativo",
    description: "Anais da Câmara dos Deputados registram discussões sobre as atribuições do monarca no corpo legislativo, defendendo seu direito de proposição, oposição e aprovação de leis para evitar o despotismo.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30056,
    year: 1889,
    month: 6,
    day: 11,
    title: "Sessão da Câmara sobre Forma Política e Descentralização",
    description: "Sessão da Câmara dos Deputados mencionada no contexto da discussão sobre a forma política e a descentralização.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30057,
    year: 1889,
    month: 11,
    day: 15,
    title: "Proclamação da República",
    description: "Proclamação da República (15 de Novembro), deixando sem resposta a questão se Ouro Preto conseguiria implementar as reformas que anunciara.",
    category: EventCategory.POLITICAL,
    characters: ["Ouro Preto"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30058,
    year: 1889,
    title: "Conspiração Republicana contra a Monarquia",
    description: "Republicanos da propaganda conspiram contra a monarquia, o que é considerado um recurso legítimo em política.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30059,
    year: 1889,
    title: "Força Armada Recorrente na Política",
    description: "A força armada é apontada como um fator recorrente e problemático na história política brasileira.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30060,
    year: 1889,
    title: "Exemplos da Força na Política",
    description: "D. João VI e D. Pedro I juram as bases da Constituição Portuguesa, a dispersão da junta dos procuradores gerais, a dissolução da Constituinte, o 7 de Abril e a maioridade são citados como exemplos da participação da força na política.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30061,
    year: 1889,
    month: 11,
    day: 20,
    title: "Governo Provisório Adota Medidas Centralizadoras",
    description: "O Governo Provisório, após a Proclamação da República, adota medidas centralizadoras, subordinando a força federal e dissolvendo as assembleias provinciais (Decreto nº 7, de 20 de Novembro).",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30062,
    year: 1889,
    title: "Governadores Nomeados com Amplos Poderes",
    description: "Governadores nomeados pelo Governo Provisório exercem amplos poderes executivos e legislativos.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30063,
    year: 1889,
    title: "Rui Barbosa Revisa Projeto da Nova Constituição",
    description: "Rui Barbosa é o principal revisor do projeto da nova Constituição republicana.",
    category: EventCategory.LEGISLATION,
    characters: ["Rui Barbosa"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30064,
    year: 1889,
    title: "Resistência Inicial de Diodoro à Assinatura da Constituição",
    description: "General Diodoro da Fonseca inicialmente resiste a assinar o projeto da Constituição, gerando uma crise ministerial.",
    category: EventCategory.POLITICAL,
    characters: ["Diodoro da Fonseca"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30065,
    year: 1889,
    title: "Rui Barbosa Convence Diodoro a Ouvir Ministério",
    description: "Rui Barbosa convence Diodoro a ouvir o Ministério antes de tomar decisões sobre o projeto.",
    category: EventCategory.POLITICAL,
    characters: ["Rui Barbosa", "Diodoro da Fonseca"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30066,
    year: 1889,
    title: "Anotações e Exigências de Diodoro ao Projeto",
    description: "Diodoro faz diversas anotações e exigências no projeto da Constituição, demonstrando preocupações com o poder federal, a autonomia dos estados e o papel do judiciário.",
    category: EventCategory.POLITICAL,
    characters: ["Diodoro da Fonseca"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30067,
    year: 1889,
    month: 12,
    day: 31,
    title: "Criação de Vice-Chefes do Governo Provisório",
    description: "Criação dos cargos de 1º e 2º vice-chefes do Governo Provisório (Decreto nº 113-b, de 31 de Dezembro) para imprimir legalidade ao governo.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30068,
    year: 1890,
    title: "Prudente de Morais Preside Congresso Constituinte",
    description: "Prudente de Morais preside os trabalhos do Congresso Constituinte, buscando manter a ordem e o rigor nos debates.",
    category: EventCategory.POLITICAL,
    characters: ["Prudente de Morais"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30069,
    year: 1890,
    title: "Discussões Acaloradas sobre Sistema de Rendas",
    description: "Discussões acaloradas sobre questões como o sistema de rendas entre a União e os estados, com representantes de diferentes regiões defendendo seus interesses.",
    category: EventCategory.ECONOMIC,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30070,
    year: 1890,
    title: "Rui Barbosa Defende União Federal Independente",
    description: "Rui Barbosa defende a necessidade de assegurar a existência independente da União Federal como ponto de partida para o sistema federativo.",
    category: EventCategory.POLITICAL,
    characters: ["Rui Barbosa"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30071,
    year: 1890,
    title: "Debate sobre Sufrágio Feminino",
    description: "Debate sobre o sufrágio feminino, com opiniões divergentes sobre a inclusão das mulheres no processo eleitoral.",
    category: EventCategory.SOCIAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30072,
    year: 1890,
    title: "Discussão sobre Distribuição de Terras e Minas",
    description: "Discussão sobre a distribuição de terras devolutas e minas, com críticas à decisão de 'despojar' a União dessas propriedades.",
    category: EventCategory.ECONOMIC,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30073,
    year: 1890,
    title: "Votação do Substitutivo Julio de Castilhos",
    description: "Votação nominal do substitutivo Julio de Castilhos sobre o sistema de rendas, com divisões regionais, sendo o substitutivo rejeitado.",
    category: EventCategory.POLITICAL,
    characters: ["Julio de Castilhos"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30074,
    year: 1890,
    title: "Influência do Positivismo e Pena de Morte",
    description: "O positivismo influencia debates na Constituinte, defendendo a não intervenção em questões puramente morais, mas mantendo a pena de morte.",
    category: EventCategory.INTELLECTUAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30075,
    year: 1890,
    title: "Emendas do Apostolado sobre Taxas",
    description: "Propostas de emendas do Apostolado, representadas por Barbosa Lima, incluem a distinção entre taxas de selo e correios/telégrafos federais e estaduais.",
    category: EventCategory.LEGISLATION,
    characters: ["Barbosa Lima"],
    source: "História Constitucional do Brasil"
  },
  {
    id: 30076,
    year: 1890,
    title: "Discussão sobre Revisão da Constituição",
    description: "Discussão sobre a necessidade de revisão da Constituição após sua promulgação, com diferentes visões sobre o momento e a forma de fazê-lo.",
    category: EventCategory.POLITICAL,
    source: "História Constitucional do Brasil"
  },
  {
    id: 30077,
    year: 1890,
    title: "Visão de Rui Barbosa sobre Constituições Rígidas",
    description: "Rui Barbosa expressa sua visão sobre as 'Constituições rígidas' e a necessidade de um exame de consciência prévio a qualquer reforma constitucional, idealizando a figura de um grande estadista para liderar esse processo.",
    category: EventCategory.INTELLECTUAL,
    characters: ["Rui Barbosa"],
    source: "História Constitucional do Brasil"
  }
];

export const historiaConstitucionalPeriods: TimelinePeriod[] = [];

export const historiaConstitucionalCharacters: Character[] = [
  {
    id: "aurelino_leal",
    name: "Aurelino Leal",
    description: "Autor da obra 'História constitucional do Brasil'. Formado em Direito, atuou na área criminal, dirigiu a Penitenciária do Estado da Bahia e foi secretário-geral do governo baiano. Lecionou Direito Constitucional, foi deputado federal, procurador-geral junto ao Tribunal de Contas da União e interventor federal no Rio de Janeiro. Sua obra 'Teoria e prática da Constituição Federal Brasileira' ficou incompleta devido à sua morte.",
    relatedEvents: [],
    source: "História Constitucional do Brasil"
  },
  {
    id: "d_joao_vi_hc",
    name: "D. João VI",
    description: "Príncipe Regente e posteriormente Rei de Portugal, Brasil e Algarves. Sua natureza indecisa e sua resistência ao constitucionalismo são destacadas. Teve seu ânimo perturbado pelos acontecimentos na Europa e resistiu à participação da nação no governo, influenciado por Tomás Antônio.",
    relatedEvents: [30001, 30006, 30060],
    source: "História Constitucional do Brasil"
  },
  {
    id: "oliveira_lima_hc",
    name: "Oliveira Lima",
    description: "Historiador e diplomata brasileiro, autor citado na fonte. Fornece insights sobre a psicologia de D. João VI e a importância do levante de 1820 em Pernambuco para a gênese do constitucionalismo brasileiro.",
    relatedEvents: [30002],
    source: "História Constitucional do Brasil"
  },
  {
    id: "tomas_antonio",
    name: "Tomás Antônio",
    description: "Ministro de D. João VI que 'abominava' a ideia de uma Constituição política e influenciou a resistência do rei a essa ideia, mesmo após a partida de D. Pedro.",
    relatedEvents: [30006],
    source: "História Constitucional do Brasil"
  },
  {
    id: "d_pedro_i_hc",
    name: "D. Pedro I",
    description: "Príncipe Regente do Brasil e posteriormente Imperador do Brasil. Inicialmente influenciado pela ideia de governar sozinho, mesmo como regente. Teve um papel crucial nos eventos que levaram à independência. Sua personalidade versátil, impulsiva e orgulhosa é mencionada, assim como sua relação com os Andradas e a Marquesa de Santos. Dissolveu a Assembleia Constituinte de 1823 e outorgou a Constituição de 1824.",
    relatedEvents: [30014, 30016, 30017, 30030, 30031, 30033, 30038, 30042, 30060],
    source: "História Constitucional do Brasil"
  },
  {
    id: "silvestre_pinheiro_ferreira",
    name: "Silvestre Pinheiro Ferreira",
    description: "Político e filósofo português. Tentou ponderar sobre a aplicação da Constituição Espanhola no Brasil e registrou a ânsia em satisfazer os 'chefes de partido' no Rio de Janeiro em 1821.",
    relatedEvents: [],
    source: "História Constitucional do Brasil"
  },
  {
    id: "melo_morais",
    name: "Melo Morais",
    description: "Autor citado na fonte, fornece informações sobre eventos como as manifestações constitucionais, a dissolução das Cortes de Lisboa planejada por D. Pedro I e a reação à dissolução da Constituinte de 1823.",
    relatedEvents: [30033],
    source: "História Constitucional do Brasil"
  },
  {
    id: "joao_severiano_maciel_da_costa",
    name: "João Severiano Maciel da Costa",
    description: "Político brasileiro. Melo Morais afirma que D. Pedro I pensou em dissolver as Cortes de Lisboa valendo-se dele.",
    relatedEvents: [],
    source: "História Constitucional do Brasil"
  },
  {
    id: "visconde_do_rio_seco",
    name: "Visconde do Rio Seco",
    description: "Pessoa que possuía cofres aos quais D. Pedro I",
    relatedEvents: [],
    source: "História Constitucional do Brasil"
  },
  {
    id: "borges_carneiro",
    name: "Borges Carneiro",
    description: "Político português. Nas Cortes Portuguesas, defendeu o envio de tropas para a Bahia e a retirada de certas autoridades.",
    relatedEvents: [30007],
    source: "História Constitucional do Brasil"
  },
  {
    id: "bernardo_da_silveira",
    name: "Bernardo da Silveira",
    description: "Militar português. Comandou as tropas enviadas para a Bahia por sugestão de Borges Carneiro.",
    relatedEvents: [30007],
    source: "História Constitucional do Brasil"
  },
  {
    id: "governador_madeira",
    name: "Governador Madeira",
    description: "Governador da Bahia cuja retirada foi defendida por Borges Carneiro nas Cortes Portuguesas.",
    relatedEvents: [30007],
    source: "História Constitucional do Brasil"
  },
  {
    id: "manuel_pedro",
    name: "Manuel Pedro",
    description: "Autoridade na Bahia cuja retirada foi defendida por Borges Carneiro nas Cortes Portuguesas.",
    relatedEvents: [30007],
    source: "História Constitucional do Brasil"
  },
  {
    id: "jose_bonifacio_de_andrada_e_silva_hc",
    name: "José Bonifácio de Andrada e Silva",
    description: "Figura política influente no início do Brasil independente. Defendeu a instalação de um Conselho repentino e expressou irritação com a influência de Domitila.",
    relatedEvents: [30013, 30025],
    source: "História Constitucional do Brasil"
  },
  {
    id: "andradas_hc",
    name: "Andradas",
    description: "Família de políticos influentes, incluindo José Bonifácio e seus irmãos. D. Pedro I adotou um discurso anti-Portugal sob sua influência. 'O Tamoio' foi orientado por eles.",
    relatedEvents: [30026, 30027],
    source: "História Constitucional do Brasil"
  },
  {
    id: "vasconcelos_de_drummond",
    name: "Vasconcelos de Drummond",
    description: "Fundador, junto com França Miranda, do jornal nativista 'O Tamoio'.",
    relatedEvents: [30027],
    source: "História Constitucional do Brasil"
  },
  {
    id: "franca_miranda",
    name: "França Miranda",
    description: "Fundador, junto com Vasconcelos de Drummond, do jornal nativista 'O Tamoio'.",
    relatedEvents: [30027],
    source: "História Constitucional do Brasil"
  },
  {
    id: "antonio_carlos_ribeiro_de_andrada_machado_e_silva",
    name: "Antônio Carlos Ribeiro de Andrada Machado e Silva",
    description: "Político brasileiro. Irmão de José Bonifácio, proferiu um discurso inflamado na Constituinte de 1823.",
    relatedEvents: [30028],
    source: "História Constitucional do Brasil"
  },
  {
    id: "martim_francisco_ribeiro_de_andrada",
    name: "Martim Francisco Ribeiro de Andrada",
    description: "Político brasileiro. Irmão de José Bonifácio, manifestou-se contra tropas portuguesas.",
    relatedEvents: [30029],
    source: "História Constitucional do Brasil"
  },
  {
    id: "vilela_barbosa_hc",
    name: "Vilela Barbosa",
    description: "Figura política controversa. Suspeito de missão de Lisboa para tratar da união e dissolução da Constituinte. Participou da festa de D. Pedro I pela dissolução.",
    relatedEvents: [30023, 30031],
    source: "História Constitucional do Brasil"
  },
  {
    id: "clemente_ferreira_franca",
    name: "Clemente Ferreira França",
    description: "Participante da festa de D. Pedro I pela dissolução da Constituinte.",
    relatedEvents: [30031],
    source: "História Constitucional do Brasil"
  },
  {
    id: "domitila_marquesa_de_santos_hc",
    name: "Marquesa de Santos",
    description: "Amante de D. Pedro I, Domitila de Castro Canto e Melo, exerceu influência sobre o imperador e irritou José Bonifácio. Participou da festa pela dissolução da Constituinte.",
    relatedEvents: [30024, 30025, 30031],
    source: "História Constitucional do Brasil"
  },
  {
    id: "bernardo_de_vasconcelos_hc",
    name: "Bernardo de Vasconcelos",
    description: "Figura política que considerou as comissões militares durante o estado de sítio como 'um invento infernal'.",
    relatedEvents: [30047],
    source: "História Constitucional do Brasil"
  },
  {
    id: "evaristo_da_veiga_hc",
    name: "Evaristo da Veiga",
    description: "Defensor da reforma constitucional e da federação na 'Aurora Fluminense'.",
    relatedEvents: [30048],
    source: "História Constitucional do Brasil"
  },
  {
    id: "honorio_hermeto_carneiro_leao",
    name: "Honório Hermeto Carneiro Leão",
    description: "Atuou em período de agitação política, defendendo o interesse comum.",
    relatedEvents: [30051],
    source: "História Constitucional do Brasil"
  },
  {
    id: "justiniano_jose_da_rocha",
    name: "Justiniano José da Rocha",
    description: "Expressou preocupações sobre o Ato Adicional de 1834, temendo pela unidade brasileira.",
    relatedEvents: [30053],
    source: "História Constitucional do Brasil"
  },
  {
    id: "visconde_de_uruguai_hc",
    name: "Visconde de Uruguai",
    description: "Registrou casos de incursões provinciais nos direitos do Império após o Ato Adicional.",
    relatedEvents: [30054],
    source: "História Constitucional do Brasil"
  },
  {
    id: "ouro_preto",
    name: "Ouro Preto",
    description: "Figura política cujas reformas foram interrompidas pela Proclamação da República.",
    relatedEvents: [30057],
    source: "História Constitucional do Brasil"
  },
  {
    id: "rui_barbosa_hc",
    name: "Rui Barbosa",
    description: "Principal revisor do projeto da Constituição republicana. Convenceu Diodoro a ouvir o Ministério e defendeu a união federal independente. Tinha uma visão sobre 'Constituições rígidas'.",
    relatedEvents: [30063, 30065, 30070, 30077],
    source: "História Constitucional do Brasil"
  },
  {
    id: "diodoro_da_fonseca",
    name: "Diodoro da Fonseca",
    description: "General que inicialmente resistiu a assinar o projeto da Constituição republicana, mas foi convencido por Rui Barbosa. Demonstrou preocupações com o poder federal e outros aspectos da Constituição.",
    relatedEvents: [30064, 30065, 30066],
    source: "História Constitucional do Brasil"
  },
  {
    id: "prudente_de_morais",
    name: "Prudente de Morais",
    description: "Presidente do Congresso Constituinte, buscou manter a ordem nos debates.",
    relatedEvents: [30068],
    source: "História Constitucional do Brasil"
  },
  {
    id: "julio_de_castilhos",
    name: "Julio de Castilhos",
    description: "Autor de um substitutivo sobre o sistema de rendas que foi rejeitado na Constituinte.",
    relatedEvents: [30073],
    source: "História Constitucional do Brasil"
  },
  {
    id: "barbosa_lima",
    name: "Barbosa Lima",
    description: "Representante do Apostolado, propôs emendas sobre taxas na Constituinte.",
    relatedEvents: [30075],
    source: "História Constitucional do Brasil"
  },
  {
    id: "verguerio",
    name: "Vergueiro",
    description: "Preso e solto durante a dissolução da Constituinte, discursou a favor da Carta de 1824.",
    relatedEvents: [30045],
    source: "História Constitucional do Brasil"
  }
];
