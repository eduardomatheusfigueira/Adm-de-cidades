import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';

export const evolucaoPoliticaBrasilSource: SourceInfo = {
  id: "evolucao_politica_brasil",
  name: "Evolução Política do Brasil",
  author: "Caio Prado Júnior",
  color: "#D4AC0D",
  description: "Análise do desenvolvimento histórico do Brasil desde o período colonial até o final do Império."
};

export const evolucaoPoliticaBrasilEvents: TimelineEvent[] = [
  {
    id: 201,
    century: "XV",
    title: "Ascensão da Burguesia Comercial Portuguesa",
    description: "Impulsiona as grandes navegações em busca de rotas para as Índias, visando o lucro com especiarias, tecidos e madeiras raras.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 202,
    year: 1500,
    title: "Chegada de Cabral ao Brasil",
    description: "Chegada de navegadores portugueses liderados por Cabral a um território vasto e parcamente habitado, posteriormente denominado Brasil.",
    category: EventCategory.EXPLORATION,
    source: "Evolução Política do Brasil"
  },
  {
    id: 203,
    startYear: 1530,
    endYear: 1680,
    title: "Implementação do Sistema de Capitanias Hereditárias",
    description: "Tentativa inicial de colonização através da doação de grandes extensões de terra a donatários. O sistema enfrenta dificuldades e, com exceção de Pernambuco e São Vicente, não prospera.",
    category: EventCategory.COLONIZATION,
    source: "Evolução Política do Brasil"
  },
  {
    id: 204,
    year: 1534,
    title: "Natureza Feudal Inicial das Capitanias",
    description: "Os donatários não possuíam direitos plenos sobre a terra, sendo-lhes vedada a posse de mais de dez léguas.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 205,
    year: 1549,
    title: "Instituição do Governo Geral",
    description: "A Coroa Portuguesa inicia o resgate das capitanias doadas, centralizando a administração da colônia. Salvador, na Bahia, torna-se a sede do novo governo.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 206,
    startYear: 1549,
    endYear: 1761,
    title: "Recuperação das Capitanias pela Coroa",
    description: "Ao longo do tempo, a Coroa recupera diversas capitanias, como Bahia (1549), Pernambuco (após a guerra dos holandeses), Espírito Santo, São Vicente e Santo Amaro (que se uniram para formar São Paulo), Paraíba do Sul (1753), Porto Seguro (1759) e Ilhéus (1761).",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 207,
    title: "Distribuição de Sesmarias",
    description: "As terras eram distribuídas aos moradores em sesmarias, uma forma de apropriação jurídica que conferia propriedade alodial (plena), sujeita apenas ao pagamento do dízimo e a certas restrições reais. As terras eram alienáveis e não criavam laços de dependência pessoal.",
    category: EventCategory.LEGISLATION,
    source: "Evolução Política do Brasil"
  },
  {
    id: 208,
    title: "Obrigação de Aproveitamento das Sesmarias",
    description: "Os beneficiários das sesmarias eram obrigados a aproveitar a terra dentro de um prazo determinado.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 209,
    title: "Concentração Fundiária",
    description: "A vastidão do território leva a uma concentração de terras, impulsionada pelas possibilidades materiais e pela habilidade individual de aproveitar e valorizar a terra, independentemente das preferências da Coroa ou dos donatários.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 210,
    title: "Economia Colonial Primária",
    description: "Predomínio da grande exploração agrícola e pecuária, subordinadas à posse fundiária. A mão de obra escrava (indígena e africana) é a base do trabalho.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 211,
    title: "Pequena Propriedade em São Vicente e no Norte",
    description: "Em contraste com a grande propriedade predominante, observa-se a existência de menor propriedade em algumas áreas, como São Vicente e o Norte.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 212,
    title: "Latifúndios no Nordeste",
    description: "A pecuária no sertão nordestino caracteriza-se pelo regime de grandes latifúndios, pertencentes a poucas famílias poderosas.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 213,
    startYear: 1530,
    endYear: 1680,
    title: "Economia Urbana Praticamente Inexistente",
    description: "Durante o primeiro século e meio, a vida da colônia concentra-se no meio rural, com uma economia urbana incipiente, carente de indústria e comércio significativos.",
    category: EventCategory.URBANIZATION,
    source: "Evolução Política do Brasil"
  },
  {
    id: 214,
    startYear: 1530,
    endYear: 1680,
    title: "Sociedade Colonial Hierarquizada",
    description: "A sociedade colonial reflete a base econômica agrária, com o senhor rural monopolizando riqueza, prestígio e poder.",
    category: EventCategory.SOCIAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 215,
    startYear: 1530,
    endYear: 1680,
    title: "Escravidão Indígena e Africana",
    description: "A mão de obra escrava é fundamental. Os indígenas são categorizados como \"cativos em guerra justa\" ou \"prisioneiros resgatados\" (escravos de pleno direito) e \"peças forras\" ou \"administrados\" (formalmente livres, mas submetidos à exploração dos colonos).",
    category: EventCategory.SOCIAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 216,
    startYear: 1530,
    endYear: 1680,
    title: "Poder Local das Câmaras Municipais",
    description: "As câmaras municipais, dominadas pelos proprietários rurais (\"homens bons\"), constituem a principal administração da colônia, exercendo um poder considerável que, muitas vezes, se sobrepõe à autoridade dos governadores e delegados régios.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 217,
    startYear: 1530,
    endYear: 1680,
    title: "Interesses dos Colonos como Motor da Legislação",
    description: "Durante este período, a legislação metropolitana, com raras exceções, é influenciada e frequentemente ditada pelos interesses da classe dos colonos abastados.",
    category: EventCategory.LEGISLATION,
    source: "Evolução Política do Brasil"
  },
  {
    id: 218,
    startYear: 1680,
    endYear: 1800,
    title: "Desenvolvimento Econômico Notável",
    description: "O Brasil atinge um certo grau de desenvolvimento econômico, com exportações significativas e crescimento da receita fiscal.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 219,
    year: 1690,
    title: "Descoberta das Minas de Ouro",
    description: "Abre novas e vastas possibilidades para a economia da colônia.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 220,
    startYear: 1680,
    endYear: 1800,
    title: "Crise Econômica em Portugal",
    description: "O império colonial português enfrenta dificuldades, com a perda de bases econômicas importantes e a crescente dependência do Brasil.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 221,
    startYear: 1680,
    endYear: 1800,
    title: "Crescente Relevância Econômica do Brasil para Portugal",
    description: "A colônia americana torna-se a principal base colonial para a atividade mercantil do Reino, suportando o ônus do parasitismo lusitano.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 222,
    startYear: 1680,
    endYear: 1800,
    title: "Intervencionismo Metropolitano na Economia Colonial",
    description: "A Coroa Portuguesa intensifica o controle sobre a economia brasileira para proteger seus interesses.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 223,
    year: 1605,
    title: "Medidas Restritivas ao Comércio",
    description: "São implementadas proibições de comércio com nações inimigas de Portugal (como os holandeses em 1605).",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 224,
    startYear: 1647,
    endYear: 1682,
    title: "Sistema de Companhias Privilegiadas",
    description: "A metrópole adota o sistema de companhias com monopólio sobre o comércio exterior da colônia (importação e exportação), como a Companhia Geral do Comércio para o Estado do Brasil (1647) e a Companhia para o Estado do Maranhão (1682).",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 225,
    century: "XVII",
    title: "Aumento da Opressão Colonial",
    description: "Ao longo do século XVII, novas formas de tributação e controle são impostas à colônia, restringindo seu livre desenvolvimento.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 226,
    year: 1729,
    title: "Regime Opressivo das Minas",
    description: "Após a descoberta do ouro e dos diamantes (1729), a metrópole intensifica sua interferência na vida dos colonos, implementando um regime de mineração extremamente opressivo, com controle rigoroso sobre a entrada e saída das áreas de mineração e alta tributação.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 227,
    year: 1785,
    title: "Proibição de Manufaturas",
    description: "Portugal proíbe quaisquer manufaturas no Brasil, exceto tecidos grosseiros de algodão, atendendo aos interesses dos comerciantes e industriais do Reino.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 228,
    startYear: 1680,
    endYear: 1800,
    title: "Monopólio Comercial Português",
    description: "Os comerciantes portugueses estabelecidos no Brasil excluem os naturais da terra das posições mercantis.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 229,
    startYear: 1680,
    endYear: 1800,
    title: "Endividamento dos Proprietários Rurais",
    description: "A lavoura enfrenta dificuldades, levando ao endividamento dos proprietários junto aos comerciantes e banqueiros.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 230,
    startYear: 1680,
    endYear: 1800,
    title: "Emergência da Burguesia Comercial",
    description: "A burguesia comercial busca maior participação na administração municipal, até então dominada pelos proprietários rurais.",
    category: EventCategory.SOCIAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 231,
    startYear: 1710,
    endYear: 1711,
    title: "Guerra dos Mascates",
    description: "Conflito em Pernambuco entre os grandes proprietários rurais (geralmente nativos) de Olinda e os comerciantes portugueses (os \"mascates\") de Recife, que buscavam ascensão política.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 232,
    startYear: 1680,
    endYear: 1800,
    title: "Declínio da Autoridade das Câmaras Municipais",
    description: "A autoridade dos governadores e outros funcionários reais aumenta, enquanto as atribuições das câmaras municipais são cerceadas, marcando uma crescente afirmação do poder da metrópole sobre a colônia.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 233,
    startYear: 1780,
    endYear: 1808,
    title: "Interesse da Inglaterra no Comércio Brasileiro",
    description: "A Inglaterra busca acesso ao mercado brasileiro, até então restrito pelo pacto colonial português.",
    category: EventCategory.INTERNATIONAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 234,
    year: 1654,
    title: "Tratado de 1654 com a Inglaterra",
    description: "Concede parcialmente aos navios ingleses o direito de comerciar com o Brasil, mas com muitas limitações.",
    category: EventCategory.INTERNATIONAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 235,
    year: 1808,
    title: "Abertura dos Portos às Nações Amigas",
    description: "Com a transferência da Corte Portuguesa para o Brasil, o Príncipe Regente D. João VI decreta a abertura dos portos ao comércio das \"nações amigas\", beneficiando principalmente a Inglaterra. Este ato é considerado um marco na emancipação econômica do Brasil.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 236,
    year: 1808,
    title: "Transferência da Corte para o Brasil",
    description: "Constitui praticamente a realização da Independência, pois o Brasil passa a ter uma administração própria em um momento em que Portugal estava enfraquecido.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 237,
    startYear: 1821,
    endYear: 1822,
    title: "Atuação do \"Partido Brasileiro\"",
    description: "Grupo que visava a autonomia do Brasil e encontrou em D. Pedro um instrumento para seus objetivos.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 238,
    startYear: 1821,
    endYear: 1822,
    title: "José Bonifácio como Figura Central",
    description: "Desempenha um papel crucial na articulação da Independência.",
    category: EventCategory.POLITICAL,
    characters: ["José Bonifácio de Andrada e Silva"],
    source: "Evolução Política do Brasil"
  },
  {
    id: 239,
    startYear: 1821,
    endYear: 1822,
    title: "Independência como Resultado da Diferenciação de Interesses",
    description: "A Independência reflete a crescente distinção e oposição entre os interesses nacionais brasileiros, ligados ao desenvolvimento econômico, e os interesses da metrópole.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 240,
    startYear: 1821,
    endYear: 1822,
    title: "Papel Ocasional de D. Pedro",
    description: "Sua atuação é vista como um instrumento dos interesses nacionalistas.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro I"],
    source: "Evolução Política do Brasil"
  },
  {
    id: 241,
    year: 1824,
    title: "Elaboração da Constituição de 1824",
    description: "As ideias constitucionais refletem, em parte, as reivindicações do Terceiro Estado na Europa, mas no Brasil são adotadas pelos proprietários rurais contra a burguesia mercantil.",
    category: EventCategory.LEGISLATION,
    source: "Evolução Política do Brasil"
  },
  {
    id: 242,
    year: 1824,
    title: "Exclusão da População Trabalhadora da Cidadania Ativa",
    description: "A Constituição estabelece critérios de renda que excluem grande parte da população livre, incluindo trabalhadores e escravos, do direito ao voto.",
    category: EventCategory.LEGISLATION,
    source: "Evolução Política do Brasil"
  },
  {
    id: 243,
    startYear: 1822,
    endYear: 1831,
    title: "Oposição ao Poder de D. Pedro",
    description: "Após a Independência, surge uma oposição liderada pelos \"nativistas\" contra a crescente influência dos portugueses e o autoritarismo de D. Pedro.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro I"],
    source: "Evolução Política do Brasil"
  },
  {
    id: 244,
    startYear: 1822,
    endYear: 1831,
    title: "Atuação dos Andradas",
    description: "Inicialmente importantes na Independência, José Bonifácio e seus irmãos perdem apoio devido a suas posições ambíguas e tentativas de exercer um quase absolutismo sob D. Pedro.",
    category: EventCategory.POLITICAL,
    characters: ["José Bonifácio de Andrada e Silva"],
    source: "Evolução Política do Brasil"
  },
  {
    id: 245,
    startYear: 1822,
    endYear: 1831,
    title: "Críticas ao Comércio Estrangeiro",
    description: "A Comissão de Fazenda da Câmara queixa-se do domínio do comércio por estrangeiros, em detrimento da agricultura.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 246,
    startYear: 1823,
    endYear: 1824,
    title: "Dissolução da Assembleia Constituinte e Outorga da Constituição",
    description: "D. Pedro dissolve a Assembleia e impõe uma Constituição com forte poder centralizado.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro I"],
    source: "Evolução Política do Brasil"
  },
  {
    id: 247,
    year: 1831,
    title: "Crise Política e Abdicação de D. Pedro I",
    description: "A insatisfação com o governo de D. Pedro I, marcada por medidas autoritárias e a crescente influência da facção portuguesa, culmina em sua abdicação.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro I"],
    source: "Evolução Política do Brasil"
  },
  {
    id: 248,
    startYear: 1831,
    endYear: 1840,
    title: "Instabilidade Política no Período Regencial",
    description: "Período marcado por revoltas e disputas entre diferentes grupos políticos.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 249,
    startYear: 1831,
    endYear: 1840,
    title: "Atuação do Padre Diogo Antônio Feijó",
    description: "Ministro da Justiça que se destaca na repressão das revoltas e na consolidação da reação conservadora.",
    category: EventCategory.POLITICAL,
    characters: ["Diogo Antônio Feijó"],
    source: "Evolução Política do Brasil"
  },
  {
    id: 250,
    year: 1835,
    title: "Revolta dos Malês",
    description: "Revolta de escravos muçulmanos na Bahia, reprimida com violência.",
    category: EventCategory.REPRESSION,
    source: "Evolução Política do Brasil"
  },
  {
    id: 251,
    startYear: 1838,
    endYear: 1841,
    title: "Balaiada",
    description: "Revolta popular no Maranhão, com participação de diferentes camadas sociais, incluindo escravos (\"balaios\"), vaqueiros e elementos mais abastados (\"bem-te-vis\").",
    category: EventCategory.SOCIAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 252,
    startYear: 1837,
    endYear: 1838,
    title: "Sabinada",
    description: "Movimento autonomista na Bahia, liderado por Francisco Sabino Álvares da Rocha Vieira.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 253,
    startYear: 1835,
    endYear: 1845,
    title: "Guerra dos Farrapos",
    description: "Longa revolta republicana no Rio Grande do Sul, liderada por Bento Gonçalves da Silva e outros.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 254,
    startYear: 1831,
    endYear: 1840,
    title: "Criação da Guarda Nacional",
    description: "Utilizada principalmente para reprimir as revoltas.",
    category: EventCategory.LEGISLATION,
    source: "Evolução Política do Brasil"
  },
  {
    id: 255,
    year: 1832,
    title: "Fundação da Sociedade Conservadora",
    description: "Núcleo do partido restaurador (\"caramuru\"), que defendia a volta de D. Pedro I ou a antecipação da maioridade de D. Pedro II.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 256,
    year: 1840,
    title: "Maioridade de D. Pedro II",
    description: "Antecipação da maioridade com o objetivo de estabilizar o país e superar o período de instabilidade regencial.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro II"],
    source: "Evolução Política do Brasil"
  },
  {
    id: 257,
    startYear: 1840,
    endYear: 1889,
    title: "Governos Conservadores no Segundo Reinado",
    description: "Os governos que se sucedem após a Maioridade tendem a ser conservadores.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro II"],
    source: "Evolução Política do Brasil"
  },
  {
    id: 258,
    startYear: 1840,
    endYear: 1889,
    title: "Questão do Tráfico Negreiro",
    description: "A Inglaterra pressiona o Brasil a abolir o tráfico de escravos.",
    category: EventCategory.INTERNATIONAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 259,
    startYear: 1840,
    endYear: 1889,
    title: "Leis Abolicionistas",
    description: "Apesar de tratados anteriores, o tráfico continua intenso. A Inglaterra promulga o Bill Aberdeen (1845), permitindo a perseguição de navios negreiros brasileiros em águas brasileiras, gerando forte reação no Brasil.",
    category: EventCategory.LEGISLATION,
    source: "Evolução Política do Brasil"
  },
  {
    id: 260,
    startYear: 1840,
    endYear: 1889,
    title: "Intensificação da Atividade Comercial",
    description: "A suspensão do tráfico negreiro, apesar das tentativas de burlá-lo, e outros fatores levam a um período de prosperidade comercial e aos primeiros grandes empreendimentos materiais (ferrovias).",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 261,
    startYear: 1840,
    endYear: 1889,
    title: "Crescimento das Emissões Bancárias",
    description: "Sinal da intensificação da atividade econômica.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 262,
    startYear: 1840,
    endYear: 1889,
    title: "Investimentos Estrangeiros",
    description: "O capital inglês tem um papel importante no financiamento dos novos empreendimentos.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 263,
    startYear: 1840,
    endYear: 1889,
    title: "Críticas ao Sistema Bancário e ao Endividamento",
    description: "Observadores da época expressam preocupação com a especulação financeira e o endividamento do país.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 264,
    startYear: 1840,
    endYear: 1889,
    title: "Expansão da Cultura do Café",
    description: "Concentrada nas províncias do Sul (Rio de Janeiro e São Paulo), impulsiona um deslocamento de escravos para essas regiões.",
    category: EventCategory.ECONOMIC,
    source: "Evolução Política do Brasil"
  },
  {
    id: 265,
    startYear: 1840,
    endYear: 1889,
    title: "Movimento Abolicionista",
    description: "Crescente pressão pela abolição da escravidão, com destaque para a atuação do Norte (Ceará e Amazonas decretam a abolição antes da lei nacional).",
    category: EventCategory.SOCIAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 266,
    year: 1888,
    title: "Abolição da Escravidão (Lei Áurea)",
    description: "Marco importante, mas que não resolve os problemas sociais e econômicos da população negra.",
    category: EventCategory.LEGISLATION,
    source: "Evolução Política do Brasil"
  },
  {
    id: 267,
    startYear: 1880,
    endYear: 1889,
    title: "Crise do Império",
    description: "O último decênio do Império é marcado por decomposição política. D. Pedro II é visto como um instrumento de manutenção do status quo, resistindo a mudanças.",
    category: EventCategory.POLITICAL,
    characters: ["D. Pedro II"],
    source: "Evolução Política do Brasil"
  },
  {
    id: 268,
    startYear: 1880,
    endYear: 1889,
    title: "Descontentamento com o Império",
    description: "A Abolição, embora um avanço, não fortalece as instituições imperiais, que já estavam fragilizadas. A confiança no regime estava abalada.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  },
  {
    id: 269,
    startYear: 1880,
    endYear: 1889,
    title: "Crescimento da Ideia Republicana",
    description: "Embora a opinião republicana ainda fosse minoritária, começava a ganhar força.",
    category: EventCategory.POLITICAL,
    source: "Evolução Política do Brasil"
  }
];

export const evolucaoPoliticaBrasilPeriods: TimelinePeriod[] = [
  {
    id: 301,
    startYear: 1530,
    endYear: 1680,
    title: "Primeiro Século e Meio da Colonização",
    source: "Evolução Política do Brasil"
  },
  {
    id: 302,
    startYear: 1680,
    endYear: 1800,
    title: "Final do Século XVII e Século XVIII",
    source: "Evolução Política do Brasil"
  },
  {
    id: 303,
    startYear: 1780,
    endYear: 1822,
    title: "Final do Século XVIII e Início do Século XIX",
    source: "Evolução Política do Brasil"
  },
  {
    id: 304,
    startYear: 1822,
    endYear: 1831,
    title: "Primeiro Reinado",
    source: "Evolução Política do Brasil"
  },
  {
    id: 305,
    startYear: 1831,
    endYear: 1840,
    title: "Período Regencial",
    source: "Evolução Política do Brasil"
  },
  {
    id: 306,
    startYear: 1840,
    endYear: 1889,
    title: "Segundo Reinado",
    source: "Evolução Política do Brasil"
  }
];

export const evolucaoPoliticaBrasilCharacters: Character[] = [
  {
    id: "caio_prado_junior",
    name: "Caio Prado Júnior",
    description: "Autor da obra \"Evolução Política do Brasil - Colônia e Império\", da qual os excertos foram retirados.",
    relatedEvents: [],
    source: "Evolução Política do Brasil"
  },
  {
    id: "joaquim_nabuco_epb",
    name: "Joaquim Nabuco",
    description: "Intelectual e político abolicionista.",
    relatedEvents: [],
    source: "Evolução Política do Brasil"
  },
  {
    id: "duque_de_caxias",
    name: "Duque de Caxias",
    description: "Importante figura militar do Império Brasileiro.",
    relatedEvents: [],
    source: "Evolução Política do Brasil"
  },
  {
    id: "pedro_alvares_cabral_epb",
    name: "Pedro Álvares Cabral",
    description: "Navegador português creditado pela chegada dos portugueses ao Brasil em 1500.",
    relatedEvents: [202],
    source: "Evolução Política do Brasil"
  },
  {
    id: "fundador_dinastia_avis",
    name: "Fundador da Dinastia de Avis",
    description: "Responsável pelo impulso marítimo português no século XV.",
    relatedEvents: [201],
    source: "Evolução Política do Brasil"
  },
  {
    id: "visconde_de_asseca",
    name: "Visconde de Asseca",
    description: "Donatário de uma extensa sesmaria em Campos (atual estado do Rio de Janeiro).",
    relatedEvents: [],
    source: "Evolução Política do Brasil"
  },
  {
    id: "antonio_guedes_de_brito",
    name: "Antônio Guedes de Brito",
    description: "Proprietário de vastos latifúndios no sertão da Bahia.",
    relatedEvents: [212],
    source: "Evolução Política do Brasil"
  },
  {
    id: "familia_da_torre",
    name: "Família da Torre",
    description: "Poderosa família proprietária de extensos latifúndios no sertão da Bahia.",
    relatedEvents: [212],
    source: "Evolução Política do Brasil"
  },
  {
    id: "domingos_afonso_sertao",
    name: "Domingos Afonso Sertão",
    description: "Famosos sertanistas proprietários de imensas extensões de terra no Piauí.",
    relatedEvents: [209],
    source: "Evolução Política do Brasil"
  },
  {
    id: "bernardo_vieira_ravasco",
    name: "Bernardo Vieira Ravasco",
    description: "Famosos sertanistas proprietários de imensas extensões de terra no Piauí.",
    relatedEvents: [209],
    source: "Evolução Política do Brasil"
  },
  {
    id: "domingos_jorge_velho",
    name: "Domingos Jorge Velho",
    description: "Famosos sertanistas proprietários de imensas extensões de terra no Piauí.",
    relatedEvents: [209],
    source: "Evolução Política do Brasil"
  },
  {
    id: "cronistas_da_colonia",
    name: "Cronistas da Colônia",
    description: "Suas observações sobre a distribuição de terras, a economia e a sociedade colonial são citadas.",
    relatedEvents: [214],
    source: "Evolução Política do Brasil"
  },
  {
    id: "euclides_da_cunha",
    name: "Euclides da Cunha",
    description: "Autor de \"Os Sertões\", citado em relação à descrição da vida dos senhores de engenho.",
    relatedEvents: [214],
    source: "Evolução Política do Brasil"
  },
  {
    id: "rodrigo_cesar_de_meneses",
    name: "Rodrigo César de Meneses",
    description: "Governador que demonstra a mudança na atitude dos representantes da Coroa no século XVIII.",
    relatedEvents: [232],
    source: "Evolução Política do Brasil"
  },
  {
    id: "rui_de_siqueira",
    name: "Rui de Siqueira",
    description: "Governador do Maranhão que, em 1662, afirma a autoridade da Coroa sobre as câmaras municipais.",
    relatedEvents: [216],
    source: "Evolução Política do Brasil"
  },
  {
    id: "marques_de_pombal",
    name: "Marquês de Pombal",
    description: "Ministro português do século XVIII conhecido por suas reformas e pelo fortalecimento do poder régio.",
    relatedEvents: [232],
    source: "Evolução Política do Brasil"
  },
  {
    id: "pedro_ii_rei_portugal",
    name: "Pedro II (Rei de Portugal)",
    description: "Seu reinado é mencionado em relação às demandas dos comerciantes por participação política.",
    relatedEvents: [230],
    source: "Evolução Política do Brasil"
  },
  {
    id: "d_joao_vi",
    name: "D. João VI",
    description: "Príncipe Regente e posteriormente Rei de Portugal e Brasil. Abertura dos Portos.",
    relatedEvents: [235, 236],
    source: "Evolução Política do Brasil"
  },
  {
    id: "inglaterra_epb",
    name: "Inglaterra",
    description: "Governo e Comerciantes Ingleses, interesse no mercado brasileiro.",
    relatedEvents: [233, 234, 258, 259],
    source: "Evolução Política do Brasil"
  },
  {
    id: "jose_bonifacio_de_andrada_e_silva_epb",
    name: "José Bonifácio de Andrada e Silva",
    description: "Figura central no processo de Independência do Brasil, articulador do \"Partido Brasileiro\".",
    relatedEvents: [238, 244],
    source: "Evolução Política do Brasil"
  },
  {
    id: "d_pedro_i_epb",
    name: "D. Pedro I",
    description: "Príncipe Regente e Imperador do Brasil. Tendências absolutistas e abdicação.",
    relatedEvents: [240, 243, 246, 247, 255],
    source: "Evolução Política do Brasil"
  },
  {
    id: "legisladores_constituicao_1824",
    name: "Legisladores da Constituição de 1824",
    description: "Influenciados pela filosofia francesa do século XVIII e pelas reivindicações do Terceiro Estado na Europa.",
    relatedEvents: [241, 242],
    source: "Evolução Política do Brasil"
  },
  {
    id: "partido_portugues",
    name: "Partido Português",
    description: "Grupo que buscou manter influência e poder no Brasil após a Independência.",
    relatedEvents: [247],
    source: "Evolução Política do Brasil"
  },
  {
    id: "comissao_de_fazenda_da_camara",
    name: "Comissão de Fazenda da Câmara",
    description: "Órgão que expressou preocupação com o domínio do comércio por estrangeiros.",
    relatedEvents: [245],
    source: "Evolução Política do Brasil"
  },
  {
    id: "diogo_antonio_feijo_epb",
    name: "Diogo Antônio Feijó",
    description: "Ministro da Justiça durante a Regência, repressão das revoltas.",
    relatedEvents: [249],
    source: "Evolução Política do Brasil"
  },
  {
    id: "andradas_epb",
    name: "Andradas (Irmãos)",
    description: "Atuação política ambígua após a Independência.",
    relatedEvents: [244],
    source: "Evolução Política do Brasil"
  },
  {
    id: "d_pedro_ii_epb",
    name: "D. Pedro II",
    description: "Imperador do Brasil, Maioridade, governos conservadores, crise do império.",
    relatedEvents: [256, 257, 267],
    source: "Evolução Política do Brasil"
  },
  {
    id: "gladstone",
    name: "Gladstone",
    description: "Figura política britânica, pressão pelo fim do tráfico negreiro.",
    relatedEvents: [259],
    source: "Evolução Política do Brasil"
  },
  {
    id: "tavares_bastos",
    name: "Tavares Bastos",
    description: "Observador da sociedade brasileira do século XIX, deslocamento de escravos.",
    relatedEvents: [264],
    source: "Evolução Política do Brasil"
  },
  {
    id: "nabuco_epb",
    name: "Nabuco (Aurélio Rodrigues Viana)",
    description: "Desabafo do espírito conservador sobre questões econômicas e sociais no Segundo Reinado.",
    relatedEvents: [],
    source: "Evolução Política do Brasil"
  },
  {
    id: "olavo_bilac",
    name: "Olavo Bilac (possível ref)",
    description: "Artigo sobre o \"fado do nosso escravo feliz\", críticas a visões romantizadas da escravidão.",
    relatedEvents: [],
    source: "Evolução Política do Brasil"
  },
  {
    id: "benjamin_constant",
    name: "Benjamin Constant",
    description: "Figura republicana, influência no exército, Proclamação da República.",
    relatedEvents: [269],
    source: "Evolução Política do Brasil"
  }
];
