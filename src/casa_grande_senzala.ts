import { TimelineEvent, TimelinePeriod, Character, EventCategory } from './types';

export const casaGrandeEvents: TimelineEvent[] = [
  {
    id: 126,
    century: "Início do século XV",
    title: "Critério da jurisprudência criminal portuguesa",
    description: "Menção à estreiteza do critério da jurisprudência criminal portuguesa, influenciada pelo misticismo e ódios de guerra contra os mouros.",
    category: EventCategory.LEGISLATION,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 127,
    year: 1453,
    month: 1,
    day: 7,
    title: "Lei de 7 de janeiro de 1453 (D. Dinis)",
    description: "Determina punições severas (arrancar a língua e queimar vivos) para quem descresse de Deus ou ofendesse o sagrado, e degredo perpétuo para o Brasil por feitiçarias e outros crimes 'místicos ou imaginários'.",
    category: EventCategory.LEGISLATION,
    characters: ["D. Dinis"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 128,
    century: "Meados do século XV",
    title: "Luxúria entre homens de armas portugueses",
    description: "Desenvolvimento de várias formas de luxúria entre os homens de armas portugueses, possivelmente devido às longas viagens marítimas e contatos com o Oriente.",
    category: EventCategory.SOCIAL,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 129,
    century: "Fim do século XV",
    title: "Lisboa celebrada e mania de 'Senhor'",
    description: "Em Portugal, os embaixadores venezianos Trom e Lippomani descrevem Lisboa sendo celebrada com grande exagero e mencionam a mania da pequena gente de ser tratada por 'Senhor', hábito comum em toda a Espanha.",
    category: EventCategory.SOCIAL,
    characters: ["Trom", "Lippomani"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 130,
    century: "Início do século XVI",
    title: "Colonização do Brasil e sífilis",
    description: "Colonização do Brasil e início da penetração da sífilis, possivelmente de origem extra-americana.",
    category: EventCategory.SOCIAL,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 131,
    century: "Início do século XVI",
    title: "Luxúria dos Tupinambá e poligamia indígena",
    description: "Afirmação de Gabriel Soares de Sousa sobre a luxúria dos Tupinambá e Padre Nóbrega alarmado com a poligamia e a facilidade com que abandonavam as mulheres entre os indígenas.",
    category: EventCategory.SOCIAL,
    characters: ["Gabriel Soares de Sousa", "Padre Nóbrega"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 132,
    century: "Início do século XVI",
    title: "Costumes sexuais permissivos indígenas",
    description: "Carta de Vespúcio a Lorenzo dei Mediei descrevendo costumes sexuais permissivos entre os indígenas.",
    category: EventCategory.SOCIAL,
    characters: ["Américo Vespúcio", "Lorenzo dei Mediei"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 133,
    century: "Início do século XVI",
    title: "Naturalização de cristãos-novos",
    description: "D. Manuel I facilita a naturalização e a aristocratização dos nomes de família dos cristãos-novos, permitindo-lhes usar apelidos da nobreza portuguesa.",
    category: EventCategory.POLITICAL,
    characters: ["D. Manuel I"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 134,
    century: "Meados do século XVI",
    title: "\"Índio sarará\"",
    description: "Gabriel Soares de Sousa descreve o 'índio sarará', um tipo de indígena de pele mais clara.",
    category: EventCategory.SOCIAL,
    characters: ["Gabriel Soares de Sousa"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 135,
    century: "Meados do século XVI",
    title: "Vestuário moralizador europeu X costumes indígenas",
    description: "Tentativas frustradas dos europeus (calvinistas franceses) de impor vestuário moralizador e anti-higiênico às mulheres indígenas, que preferiam a liberdade de se banhar frequentemente nos rios.",
    category: EventCategory.CULTURAL,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 136,
    century: "Meados do século XVI",
    title: "Lisboa centro de produtos exóticos",
    description: "Lisboa se torna um importante centro de introdução de produtos exóticos e animais da Ásia, África e América, transformando-se no 'primeiro jardim de aclimatação, o primeiro jardim zoológico e o primeiro mercado da Europa'.",
    category: EventCategory.ECONOMIC,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 137,
    century: "Fim do século XVI",
    title: "Mística do 'Portugal opulento de D. Sebastião vivo'",
    description: "Observadores venezianos notam que os portugueses ainda se supõem o 'Portugal opulento de D. Sebastião vivo', alimentando uma mística imperialista sem base real após Alcácer-Quebir.",
    category: EventCategory.POLITICAL,
    characters: ["D. Sebastião"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 138,
    century: "Fim do século XVI",
    title: "Rei despachando em armazéns",
    description: "Em Portugal, o próprio rei dá despachos em armazéns à beira do rio, indicando uma economia cada vez mais mercantil e menos agrária.",
    category: EventCategory.ECONOMIC,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 139,
    century: "Fim do século XVI",
    title: "\"Herronia e idolatria gentílica\" na Bahia",
    description: "Relato de uma 'herronia e idolatria gentílica' surgida na Bahia, misturando elementos indígenas, cristãos e de escravos fugidos, com um ídolo de pedra e promessas de libertação do cativeiro.",
    category: EventCategory.CULTURAL,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 140,
    century: "Fim do século XVI",
    title: "Palavras tupi no português do Brasil",
    description: "Teodoro Sampaio menciona diversas palavras de origem tupi que se tornaram de uso corrente no Brasil.",
    category: EventCategory.CULTURAL,
    characters: ["Teodoro Sampaio"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 141,
    century: "Fim do século XVI",
    title: "Superioridade da colonização no Brasil (açúcar e algodão)",
    description: "Já havia em Portugal quem reconhecesse a superioridade do método de colonização no Brasil (focado em açúcar e algodão) sobre o da Índia e Mina (ouro).",
    category: EventCategory.ECONOMIC,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 142,
    century: "Fim do século XVI",
    title: "Trabalho das mulheres indígenas",
    description: "O cronista Gabriel Soares de Sousa detalha o trabalho das mulheres indígenas, incluindo a produção de farinha de mandioca e cerâmica.",
    category: EventCategory.ECONOMIC,
    characters: ["Gabriel Soares de Sousa"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 143,
    century: "Início do século XVII",
    title: "Inquisição e denúncias por 'sortilégios' na Bahia",
    description: "Expansão da influência da Igreja Católica e da Inquisição, com registros de denúncias por 'sortilégios' na Bahia, sendo a maioria dos denunciados portugueses, e poucos negros ou mulatos.",
    category: EventCategory.REPRESSION,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 144,
    century: "Meados do século XVII",
    title: "Desequilíbrio no suprimento de víveres em Pernambuco",
    description: "Conde de Nassau tenta, sem sucesso, resolver o desequilíbrio no suprimento de víveres em Pernambuco, uma capitania essencialmente açucareira e latifundiária.",
    category: EventCategory.ECONOMIC,
    characters: ["Conde de Nassau"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 145,
    century: "Meados do século XVII",
    title: "Mulheres sentadas no Brasil colonial",
    description: "Um cronista holandês observa que as mulheres no Brasil colonial viviam tanto tempo sentadas que cambaleavam ao se levantar.",
    category: EventCategory.SOCIAL,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 146,
    year: 1686,
    month: 11,
    day: 20,
    title: "Carta régia de 20 de novembro de 1686",
    description: "Carta régia de 20 de novembro de 1686 enfatiza que 'as escolas de sciencias devem ser igualmente comuns a todo o gênero de pessoas sem excepção alguma', contradizendo visões de um tratamento discriminatório do Brasil por Portugal.",
    category: EventCategory.LEGISLATION,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 147,
    century: "Fim do século XVII",
    title: "Reduções Jesuíticas e cultura indígena",
    description: "Fundação e expansão das Reduções Jesuíticas, especialmente no Sul com os Guarani, que impunham um regime de vida sedentário, uniforme e sob estrita vigilância, considerado por alguns como destruidor da espontaneidade e potencial cultural indígena.",
    category: EventCategory.CULTURAL,
    characters: ["Guarani"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 148,
    year: 1694,
    title: "\"Trattado único da constituiçam pestilencial de Pernambuco\"",
    description: "Publicação do 'Trattado único da constituiçam pestilencial de Pernambuco' por Joam Ferreyra da Rosa (1694), indicando preocupações com a saúde e doenças na colônia.",
    category: EventCategory.SOCIAL,
    characters: ["Joam Ferreyra da Rosa"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 149,
    century: "Ao longo do século XVIII",
    title: "Concentração de terras na Bahia",
    description: "A Bahia, com sua agricultura latifundiária e pecuária extensiva, chega a ter grande parte de suas terras pertencente a apenas duas famílias (Senhor da Torre e Antônio Guedes de Brito).",
    category: EventCategory.ECONOMIC,
    characters: ["Senhor da Torre", "Antônio Guedes de Brito"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 150,
    century: "Ao longo do século XVIII",
    title: "Escassez de víveres frescos",
    description: "Escassez de víveres frescos (animais e vegetais) é um fenômeno comum no Brasil colonial, com destaque para Pernambuco.",
    category: EventCategory.ECONOMIC,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 151,
    century: "Ao longo do século XVIII",
    title: "União de brancos e negras 'Minas' em Minas Gerais",
    description: "Em Minas Gerais, durante o ciclo do ouro, a união de brancos com negras 'Minas' (africanas de pele mais clara) é comum, com estas sendo elevadas à condição de 'amigas', 'mancebas' e 'donas de casa'.",
    category: EventCategory.SOCIAL,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 152,
    century: "Ao longo do século XVIII",
    title: "Calor X 'desordenada paixão sexual'",
    description: "Vilhena, professor régio na Bahia, rebate a ideia de que o 'calor' seria a principal causa dos vícios e doenças de sensualidade na colônia, atribuindo-a à 'desordenada paixão sexual' influenciada pelas relações entre senhores e escravos.",
    category: EventCategory.SOCIAL,
    characters: ["Vilhena"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 153,
    century: "Ao longo do século XVIII",
    title: "Negras de tabuleiro em São Paulo",
    description: "Em São Paulo, que se torna a grande terra do café no final do século XVIII, negras de fogareiro vendem diversos quitutes e bebidas de origem africana e indígena.",
    category: EventCategory.ECONOMIC,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 154,
    century: "Final do século XVIII",
    title: "Obrigatoriedade de plantar mandioca na Bahia",
    description: "Governadores da capitania da Bahia determinam a inclusão em datas de terra da obrigação de plantar mandioca por cada escravo possuído, devido à falta de farinha.",
    category: EventCategory.ECONOMIC,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 155,
    century: "Final do século XVIII",
    title: "Pouca importância a 'moléstias cutâneas' no Rio de Janeiro",
    description: "Observação de Manuel Vieira da Silva (futuro Barão de Alvaesar) sobre a pouca importância dada às 'moléstias cutâneas' no Rio de Janeiro, sugerindo uma possível ligação com a sífilis e o desprezo pelo tratamento.",
    category: EventCategory.SOCIAL,
    characters: ["Barão de Alvaesar"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 156,
    century: "Início do século XIX",
    title: "Comércio de escravos Bahia-África",
    description: "Informações de Sir Harry Johnston sobre o ativo comércio de escravos entre a Bahia e cidades africanas como Lagos e Daomé, conduzido por Fulos e Mandingos (geralmente escravos).",
    category: EventCategory.ECONOMIC,
    characters: ["Harry Johnston"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 157,
    year: 1808,
    title: "\"Reflexões sobre alguns dos meios ... para melhorar o clima no Rio de Janeiro\"",
    description: "Manuel Vieira da Silva (Barão de Alvaesar) publica suas 'Reflexões sobre alguns dos meios propostos por mais conducentes para melhorar o clima na cidade do Rio de Janeiro' (1808).",
    category: EventCategory.INTELLECTUAL,
    characters: ["Barão de Alvaesar"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 158,
    year: 1832,
    title: "\"O Carapuceiro\"",
    description: "O padre Miguel do Sacramento Lopes Gama escreve 'O Carapuceiro' (a partir de 1832), abordando a deturpação da língua portuguesa no Brasil patriarcal pela influência africana.",
    category: EventCategory.INTELLECTUAL,
    characters: ["Padre Miguel do Sacramento Lopes Gama"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 159,
    century: "Meados do século XIX",
    title: "Jovens mineiras (13-16 anos)",
    description: "Burton, viajando pelo sul do Brasil, encanta-se com as jovens mineiras (13-16 anos), notando que adquiriam encantos femininos sem passar pela fase da puberdade como na Europa.",
    category: EventCategory.SOCIAL,
    characters: ["Burton"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 160,
    year: 1845,
    title: "Banalização da sífilis no Brasil",
    description: "Lassance Cunha escreve em 1845 sobre a banalização da sífilis no Brasil, considerada quase hereditária e não temida pela população.",
    category: EventCategory.SOCIAL,
    characters: ["Lassance Cunha"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 161,
    year: 1885,
    title: "Beleza precoce das jovens brasileiras",
    description: "Von den Steinen visita o Brasil em 1885 e se encanta com a beleza precoce das jovens brasileiras, comparando-as a botões de rosa europeus.",
    category: EventCategory.SOCIAL,
    characters: ["Von den Steinen"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 162,
    year: 1869,
    title: "\"O Brasil e a Oceania\"",
    description: "Publicação de 'O Brasil e a Oceania' (1869) por Gonçalves Dias, que critica a ação dissolvente do sistema jesuítico sobre os laços familiares e a independência dos indígenas.",
    category: EventCategory.INTELLECTUAL,
    characters: ["Gonçalves Dias"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 163,
    year: 1906,
    title: "\"A Língua Nacional\"",
    description: "João Ribeiro publica 'A Língua Nacional' (1906), discutindo as particularidades do português falado no Brasil, como a suavidade de certas construções gramaticais.",
    category: EventCategory.INTELLECTUAL,
    characters: ["João Ribeiro"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 164,
    year: 1900,
    title: "\"1900 brasileiro\"",
    description: "Análise do '1900 brasileiro' e das atitudes da primeira geração após a Lei do Ventre Livre e a Abolição (1888), relacionando as reações antimonárquicas, a busca por carreiras liberais e o funcionalismo público com a herança da escravidão e da monocultura.",
    category: EventCategory.SOCIAL,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 165,
    century: "Início do século XX",
    title: "Concentração de terras e latifúndio",
    description: "Roy Nash se surpreende com a concentração de terras no Brasil, com propriedades maiores que países inteiros, e com a persistência do latifúndio e da monocultura, gerando um proletariado com condições de vida piores que as dos antigos escravos.",
    category: EventCategory.ECONOMIC,
    characters: ["Roy Nash"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 166,
    year: 1914,
    title: "Dramas passionais no Brasil agrário-patriarcal",
    description: "Alfredo Brandão escreve sobre os dramas passionais no Brasil agrário-patriarcal, mencionados pelas muitas cruzes encontradas em caminhos e matas.",
    category: EventCategory.SOCIAL,
    characters: ["Alfredo Brandão"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 167,
    year: 1916,
    title: "Inquérito sobre colonização agrícola",
    description: "Inquérito promovido por Carlos Malheiros Dias no Rio de Janeiro sobre a aptidão do português para a colonização agrícola, com opiniões divergentes entre brasileiros e portugueses.",
    category: EventCategory.ECONOMIC,
    characters: ["Carlos Malheiros Dias"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 168,
    year: 1919,
    title: "Metabolismo basal do homem tropical",
    description: "A. Osório de Almeida publica os primeiros resultados de suas pesquisas sobre o metabolismo basal do homem tropical de raça branca, verificando um metabolismo inferior aos padrões europeus e americanos.",
    category: EventCategory.INTELLECTUAL,
    characters: ["A. Osório de Almeida"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 169,
    year: 1920,
    endYear: 1921,
    title: "Condições patológicas em São Paulo e Rio de Janeiro",
    description: "Martius escreve sobre as condições patológicas mais frequentes em São Paulo (doenças reumáticas e inflamatórias) em comparação com o Rio de Janeiro (doenças gástricas), atribuindo a diferença a fatores climáticos e constituição dos habitantes.",
    category: EventCategory.SOCIAL,
    characters: ["Martius"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 170,
    year: 1925,
    title: "\"O Doutor Gerôncio de Noruega\"",
    description: "Luís Cedro publica 'O Doutor Gerôncio de Noruega', mencionando o arquivo de família do engenho Noruega como fonte de documentos para o estudo da economia escravocrata e da vida patriarcal.",
    category: EventCategory.INTELLECTUAL,
    characters: ["Luís Cedro"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 171,
    year: 1930,
    endYear: 1940,
    title: "Influência do patriarcado monocultor e escravocrata",
    description: "Referências a estudos de diversos autores sobre a influência do patriarcado monocultor e escravocrata em diferentes regiões do Brasil, como a Amazônia, o Rio Grande do Sul, Minas Gerais e Mato Grosso, indicando um sistema transregional de cultura.",
    category: EventCategory.CULTURAL,
    source: "Casa-Grande & Senzala"
  },
  {
    id: 172,
    year: 1933,
    title: "\"A Língua Nacional\" (1933)",
    description: "João Ribeiro publica 'A Língua Nacional', abordando as características do português do Brasil. O próprio autor acolhe o ensaio de Gilberto Freyre em sua seção de crítica.",
    category: EventCategory.INTELLECTUAL,
    characters: ["João Ribeiro"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 173,
    year: 1939,
    title: "Proibição da macumba no Rio de Janeiro em 1830",
    description: "Manuel Querino registra a proibição do uso da macumba pela Câmara do Rio de Janeiro em 1830.",
    category: EventCategory.REPRESSION,
    characters: ["Manuel Querino"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 174,
    year: 1940,
    title: "\"Ensaios de geografia humana brasileira\"",
    description: "Pierre Monbeig publica 'Ensaios de geografia humana brasileira', incluindo estudos sobre a paisagem de núcleos coloniais.",
    category: EventCategory.INTELLECTUAL,
    characters: ["Pierre Monbeig"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 175,
    year: 1941,
    title: "\"Psicologia do cafuné\"",
    description: "Sérgio Milliet publica 'Psicologia do cafuné'. Antônio Sérgio publica sua 'História de Portugal, tomo I'.",
    category: EventCategory.INTELLECTUAL,
    characters: ["Sérgio Milliet", "Antônio Sérgio"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 176,
    year: 1942,
    title: "\"Feudal and capitalistic elements in the Portuguese settlement of Brazil\"",
    description: "Alexandre Marchant publica 'Feudal and capitalistic elements in the Portuguese settlement of Brazil'.",
    category: EventCategory.INTELLECTUAL,
    characters: ["Alexandre Marchant"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 177,
    year: 1945,
    title: "\"Áreas alimentares do Brasil\"",
    description: "Josué de Castro publica 'Áreas alimentares do Brasil'.",
    category: EventCategory.INTELLECTUAL,
    characters: ["Josué de Castro"],
    source: "Casa-Grande & Senzala"
  },
  {
    id: 178,
    year: 1948,
    title: "Artigos sobre ciência agrobiológica soviética",
    description: "Referências a artigos de A. Mitine sobre a ciência agrobiológica soviética.",
    category: EventCategory.INTELLECTUAL,
    characters: ["A. Mitine"],
    source: "Casa-Grande & Senzala"
  }
];

export const casaGrandePeriods: TimelinePeriod[] = [
  {
    id: 8,
    startYear: 1400,
    endYear: 1500,
    title: "Século XV",
    description: "Portugal no século XV: jurisprudência, costumes e expansão marítima.",
    source: "Casa-Grande & Senzala"
  },
  {
    id: 9,
    startYear: 1500,
    endYear: 1600,
    title: "Século XVI",
    description: "Colonização do Brasil no século XVI: sífilis, costumes indígenas, economia mercantil e trabalho indígena.",
    source: "Casa-Grande & Senzala"
  },
  {
    id: 10,
    startYear: 1600,
    endYear: 1700,
    title: "Século XVII",
    description: "Brasil colonial no século XVII: Inquisição, economia açucareira, vida social e saúde.",
    source: "Casa-Grande & Senzala"
  },
  {
    id: 11,
    startYear: 1700,
    endYear: 1800,
    title: "Século XVIII",
    description: "Brasil no século XVIII: concentração de terras, escassez de alimentos, miscigenação e costumes.",
    source: "Casa-Grande & Senzala"
  },
  {
    id: 12,
    startYear: 1800,
    endYear: 1900,
    title: "Século XIX",
    description: "Brasil no século XIX: comércio de escravos, sífilis banalizada e beleza precoce.",
    source: "Casa-Grande & Senzala"
  },
  {
    id: 13,
    startYear: 1900,
    endYear: 1948,
    title: "Virada do Século XIX para o XX",
    description: "Brasil na virada do século XIX para o XX: herança da escravidão, latifúndio, metabolismo tropical e estudos sociológicos.",
    source: "Casa-Grande & Senzala"
  }
];

export const casaGrandeCharacters: Character[] = [
  {
    id: "gilberto_freyre",
    name: "Gilberto Freyre",
    description: "Autor de 'Casa-Grande & Senzala', obra fundamental para a sociologia brasileira.",
    relatedEvents: [],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "d_dinis",
    name: "D. Dinis",
    description: "Rei de Portugal no século XV, promulgou lei em 1453 sobre punições religiosas.",
    relatedEvents: [127],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "trom",
    name: "Trom",
    description: "Embaixador veneziano que descreveu Lisboa no final do século XV.",
    relatedEvents: [129],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "lippomani",
    name: "Lippomani",
    description: "Embaixador veneziano que descreveu Lisboa no final do século XV.",
    relatedEvents: [129],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "gabriel_soares_de_sousa",
    name: "Gabriel Soares de Sousa",
    description: "Cronista do século XVI, descreveu costumes indígenas e o 'índio sarará'.",
    relatedEvents: [131, 134, 142],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "padre_nobrega",
    name: "Padre Nóbrega",
    description: "Missionário jesuíta, alarmado com a poligamia indígena.",
    relatedEvents: [131],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "americo_vespucio",
    name: "Américo Vespúcio",
    description: "Navegador, descreveu costumes sexuais indígenas em carta.",
    relatedEvents: [132],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "lorenzo_dei_mediei",
    name: "Lorenzo dei Mediei",
    description: "Destinatário da carta de Américo Vespúcio sobre costumes indígenas.",
    relatedEvents: [132],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "d_manuel_i",
    name: "D. Manuel I",
    description: "Rei de Portugal, facilitou naturalização de cristãos-novos.",
    relatedEvents: [133],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "d_sebastiao",
    name: "D. Sebastião",
    description: "Rei de Portugal, mística do 'Portugal opulento de D. Sebastião vivo'.",
    relatedEvents: [137],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "teodoro_sampaio",
    name: "Teodoro Sampaio",
    description: "Mencionou palavras tupi no português do Brasil.",
    relatedEvents: [140],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "conde_de_nassau",
    name: "Conde de Nassau",
    description: "Governador do Brasil Holandês, tentou resolver escassez de víveres.",
    relatedEvents: [144],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "joam_ferreyra_da_rosa",
    name: "Joam Ferreyra da Rosa",
    description: "Autor de 'Trattado único da constituiçam pestilencial de Pernambuco'.",
    relatedEvents: [148],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "senhor_da_torre",
    name: "Senhor da Torre",
    description: "Família proprietária de terras na Bahia.",
    relatedEvents: [149],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "antonio_guedes_de_brito",
    name: "Antônio Guedes de Brito",
    description: "Família proprietária de terras na Bahia.",
    relatedEvents: [149],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "vilhena_professor_regio",
    name: "Vilhena",
    description: "Professor régio na Bahia, debateu causas da sensualidade na colônia.",
    relatedEvents: [152],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "barao_de_alvaesar",
    name: "Barão de Alvaesar",
    description: "Manuel Vieira da Silva, escreveu sobre clima e saúde no Rio de Janeiro.",
    relatedEvents: [155, 157],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "harry_johnston",
    name: "Harry Johnston",
    description: "Sir Harry Johnston, informou sobre comércio de escravos Bahia-África.",
    relatedEvents: [156],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "padre_miguel_sacramento_lopes_gama",
    name: "Padre Miguel do Sacramento Lopes Gama",
    description: "Autor de 'O Carapuceiro', sobre a língua portuguesa no Brasil.",
    relatedEvents: [158],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "burton_viajante",
    name: "Burton",
    description: "Viajante, encantado com jovens mineiras e costumes brasileiros.",
    relatedEvents: [159],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "lassance_cunha",
    name: "Lassance Cunha",
    description: "Escreveu sobre banalização da sífilis no Brasil.",
    relatedEvents: [160],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "von_den_steinen",
    name: "Von den Steinen",
    description: "Visitante, encantado com beleza precoce de jovens brasileiras.",
    relatedEvents: [161],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "goncalves_dias",
    name: "Gonçalves Dias",
    description: "Autor de 'O Brasil e a Oceania', crítico dos jesuítas.",
    relatedEvents: [162],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "joao_ribeiro_linguista",
    name: "João Ribeiro",
    description: "Autor de 'A Língua Nacional', sobre o português do Brasil.",
    relatedEvents: [163, 172],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "roy_nash",
    name: "Roy Nash",
    description: "Surpreendeu-se com concentração de terras no Brasil.",
    relatedEvents: [165],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "alfredo_brandao",
    name: "Alfredo Brandão",
    description: "Escreveu sobre dramas passionais no Brasil agrário-patriarcal.",
    relatedEvents: [166],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "carlos_malheiros_dias",
    name: "Carlos Malheiros Dias",
    description: "Promoveu inquérito sobre colonização agrícola.",
    relatedEvents: [167],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "a_osorio_de_almeida",
    name: "A. Osório de Almeida",
    description: "Pesquisou metabolismo basal do homem tropical.",
    relatedEvents: [168],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "martius_cientista",
    name: "Martius",
    description: "Cientista, comparou condições patológicas em SP e RJ.",
    relatedEvents: [169],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "luis_cedro",
    name: "Luís Cedro",
    description: "Autor de 'O Doutor Gerôncio de Noruega'.",
    relatedEvents: [170],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "manuel_querino",
    name: "Manuel Querino",
    description: "Registrou proibição da macumba no Rio de Janeiro.",
    relatedEvents: [173],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "pierre_monbeig",
    name: "Pierre Monbeig",
    description: "Autor de 'Ensaios de geografia humana brasileira'.",
    relatedEvents: [174],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "sergio_milliet",
    name: "Sérgio Milliet",
    description: "Autor de 'Psicologia do cafuné'.",
    relatedEvents: [175],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "antonio_sergio",
    name: "Antônio Sérgio",
    description: "Autor de 'História de Portugal, tomo I'.",
    relatedEvents: [175],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "alexandre_marchant",
    name: "Alexandre Marchant",
    description: "Autor de 'Feudal and capitalistic elements in the Portuguese settlement of Brazil'.",
    relatedEvents: [176],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "josue_de_castro",
    name: "Josué de Castro",
    description: "Autor de 'Áreas alimentares do Brasil'.",
    relatedEvents: [177],
    source: "Casa-Grande & Senzala"
  },
  {
    id: "a_mitine",
    name: "A. Mitine",
    description: "Autor de artigos sobre ciência agrobiológica soviética.",
    relatedEvents: [178],
    source: "Casa-Grande & Senzala"
  }
];
