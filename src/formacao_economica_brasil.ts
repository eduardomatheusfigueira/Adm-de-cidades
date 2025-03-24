import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';

export const formacaoEconomicaBrasilSource: SourceInfo = {
  id: "formacao_economica_brasil",
  name: "Formação Econômica do Brasil",
  author: "Celso Furtado",
  color: "#EAB308",
  description: "Análise da constituição histórica da economia brasileira, desde o período colonial até meados do século XX."
};

export const formacaoEconomicaBrasilEvents: TimelineEvent[] = [
  {
    id: 40001,
    century: "Século XVI",
    title: "Início da ocupação econômica",
    description: "Portugal inicia a ocupação econômica do território brasileiro em resposta à pressão de outras nações europeias.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40002,
    century: "Século XVI",
    title: "Primeira expedição francesa",
    description: "Franceses organizam a primeira expedição para criar uma colônia de povoamento na costa setentrional do Brasil.",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40003,
    century: "Século XVI",
    title: "Reação portuguesa",
    description: "Portugal acompanha de perto os movimentos franceses e tenta desviá-los do Brasil.",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40004,
    century: "Século XVI",
    title: "Crescente ameaça e decisão portuguesa",
    description: "Portugal percebe que a posse das terras americanas seria perdida sem ocupação permanente.",
    category: EventCategory.POLITICAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40005,
    century: "Século XVI",
    title: "Miragem do ouro",
    description: "A perspectiva de encontrar ouro no interior do Brasil influencia a decisão portuguesa de ocupar as terras.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40006,
    century: "Século XVI",
    title: "Limitações portuguesas e estratégia espanhola",
    description: "Portugal dispõe de recursos limitados para a ocupação, contrastando com a estratégia espanhola.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40007,
    century: "Século XVI",
    title: "Escasso interesse econômico do interior",
    description: "Fora da mineração espanhola, o continente americano apresenta pouco interesse econômico imediato.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40008,
    century: "Século XVI",
    title: "Comércio de peles e madeiras",
    description: "Desenvolve-se um comércio limitado de peles e madeiras com indígenas na costa oriental.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40009,
    century: "Século XVI",
    title: "Lutas por territórios",
    description: "O primeiro século americano é marcado por disputas territoriais de pouco valor econômico imediato.",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40010,
    century: "Século XVI",
    title: "Defesa espanhola",
    description: "Espanha concentra defesa no eixo produtor de metais preciosos (México-Peru).",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40011,
    century: "Século XVI",
    title: "Tarefa portuguesa",
    description: "Portugal busca exploração econômica além de metais preciosos para cobrir custos de defesa.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40012,
    century: "Século XVI",
    title: "Início da exploração agrícola",
    description: "Medidas políticas iniciam a exploração agrícola no Brasil, transformando a economia colonial.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40013,
    year: 1579,
    title: "Independência das Províncias Unidas (Holanda)",
    description: "As sete províncias do norte dos Países Baixos conquistam independência da Espanha (União de Utrecht).",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40014,
    century: "Século XVI",
    title: "Proibição do comércio holandês",
    description: "Após independência holandesa e ocupação espanhola de Portugal, comércio luso-holandês é abandonado.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40015,
    century: "Início do Século XVII",
    title: "Ascensão comercial holandesa",
    description: "Holanda estabelece monopólio prático sobre transporte e comércio europeu.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40016,
    century: "Início do Século XVII",
    title: "Penetração holandesa no Império Português",
    description: "Holandeses abrem brechas no império português nas Índias Orientais e continuam a obter açúcar em Lisboa.",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40017,
    startYear: 1609,
    endYear: 1621,
    title: "Trégua de Doze Anos",
    description: "Penetração holandesa aumenta, estendendo-se ao comércio direto com o Brasil.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40018,
    century: "Século XVII",
    title: "Início da ocupação militar holandesa",
    description: "Holandeses iniciam ocupação militar da colônia açucareira brasileira.",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40019,
    century: "Século XVII",
    title: "Surgimento de economia concorrente",
    description: "Surge economia concorrente no mercado de produtos tropicais no Hemisfério Norte.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40020,
    century: "Século XVII",
    title: "Debilitação da Espanha",
    description: "Debilitação do poder militar espanhol é notada por Holanda, França e Inglaterra.",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40021,
    century: "Século XVII",
    title: "Colonização militar nas Antilhas",
    description: "Inglaterra e França ocupam ilhas estratégicas do Caribe para colônias militares.",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40022,
    century: "Século XVII",
    title: "Monopólio açucareiro brasileiro inicial",
    description: "Inicialmente, assume-se monopólio brasileiro do açúcar, Antilhas para outros produtos.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40023,
    century: "Século XVII",
    title: "Pressão econômica e mudança nas Antilhas",
    description: "Objetivos de grandes núcleos europeus nas Antilhas são abandonados sob pressão econômica.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40024,
    century: "Século XVII",
    title: "Desenvolvimento de economia agrícola não especializada",
    description: "Desenvolvimento de economia agrícola não especializada nas Antilhas.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40025,
    startYear: 1580,
    endYear: 1640,
    title: "Portugal sob domínio espanhol",
    description: "Portugal perde entrepostos orientais e parte da colônia americana sob domínio espanhol.",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40026,
    year: 1640,
    title: "Restauração da independência portuguesa",
    description: "Portugal recupera independência, mas em posição débil.",
    category: EventCategory.POLITICAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40027,
    century: "Século XVII",
    title: "Aliança luso-inglesa",
    description: "Portugal alia-se à Inglaterra para sobreviver como metrópole colonial.",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40028,
    century: "Século XVII",
    title: "Crescente influência inglesa em Portugal",
    description: "Privilégios transformam comerciantes ingleses em grupo poderoso em Portugal.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40029,
    century: "Século XVII",
    title: "Concessões portuguesas e promessas inglesas",
    description: "Portugal faz concessões econômicas por garantias políticas inglesas.",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40030,
    year: 1661,
    title: "Cláusula secreta de 1661",
    description: "Inglaterra promete defender colônias portuguesas contra inimigos.",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40031,
    century: "Século XVII",
    title: "Crise do açúcar",
    description: "Baixa nos preços do açúcar impacta rentabilidade da colônia.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40032,
    year: 1621,
    title: "Criação do Estado do Maranhão",
    description: "Governo português cria colônia distinta do Ceará ao Amazonas, ligada a Lisboa.",
    category: EventCategory.POLITICAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40033,
    century: "Século XVII e XVIII",
    title: "Penetração jesuítica na Amazônia",
    description: "Ação jesuítica evolui para exploração servil, expandindo território no Maranhão.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40034,
    century: "Século XVII",
    title: "Dificuldades fiscais e econômicas em Portugal",
    description: "Queda nas exportações de açúcar e desvalorizações cambiais causam dificuldades em Portugal.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40035,
    century: "Século XVII",
    title: "Impacto das desvalorizações na colônia",
    description: "Desvalorizações cambiais aliviam exportadores de açúcar, mas agravam regiões pobres.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40036,
    century: "Século XVII",
    title: "Reversão à economia de subsistência",
    description: "Regiões pobres revertem à subsistência com manufaturas importadas mais caras.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40037,
    century: "Século XVII",
    title: "Expansão da pecuária no Nordeste",
    description: "Economia pecuária dependente surge no Nordeste, separada da economia açucareira.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40038,
    century: "Século XVIII",
    title: "Ciclo do ouro",
    description: "Economia luso-brasileira articula-se ao sistema econômico inglês em expansão no ciclo do ouro.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40039,
    century: "Século XVIII",
    title: "Expansão demográfica com o ouro",
    description: "Ouro financia expansão demográfica no Brasil, alterando estrutura populacional.",
    category: EventCategory.SOCIAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40040,
    century: "Século XVIII",
    title: "Migração europeia para a mineração",
    description: "Mineração atrai nova migração europeia para a colônia.",
    category: EventCategory.SOCIAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40041,
    century: "Século XVIII",
    title: "Crescimento da população colonial",
    description: "População colonial de origem europeia decuplica no século da mineração.",
    category: EventCategory.SOCIAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40042,
    century: "Século XVIII",
    title: "Diferenças sociais na mineração",
    description: "Mineração oferece mais ascensão social para homens livres que economia açucareira.",
    category: EventCategory.SOCIAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40043,
    century: "Século XVIII",
    title: "Mobilidade da empresa mineira",
    description: "Mineração permite deslocamento rápido da empresa, concentrando recursos na extração.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40044,
    century: "Século XVIII",
    title: "Mercado para animais de carga",
    description: "Mineração cria mercado para animais de carga, impulsionando criação de muares.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40045,
    century: "Século XVIII",
    title: "Integração do Sul com a mineração",
    description: "Mineração integra regiões do sul especializadas em pecuária.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40046,
    year: 1760,
    title: "Apogeu da exportação de ouro",
    description: "Exportação de ouro atinge pico por volta de 1760.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40047,
    year: 1703,
    title: "Acordo de Methuen",
    description: "Acordo de Methuen concede privilégios a vinhos portugueses na Inglaterra em troca de tecidos ingleses em Portugal.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40048,
    year: 1684,
    startYear: 1684,
    endYear: 1704,
    title: "Política manufatureira portuguesa",
    description: "Portugal fomenta manufaturas e abole importações de tecidos por duas décadas.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40049,
    century: "Século XVIII",
    title: "Impacto do ouro brasileiro no Acordo de Methuen",
    description: "Ouro do Brasil permite a Portugal pagar importações inglesas sob Acordo de Methuen.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40050,
    century: "Século XVIII",
    title: "Dependência econômica portuguesa da Inglaterra",
    description: "Portugal consolida dependência econômica da Inglaterra.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40051,
    century: "Século XVIII",
    title: "Expansão territorial no Maranhão",
    description: "Luta por mão de obra indígena e ação jesuítica expandem território no Maranhão.",
    category: EventCategory.EXPLORATION,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40052,
    century: "Século XVIII",
    title: "Articulação regional da economia",
    description: "Economia brasileira articula-se em sistemas ao redor de açúcar e ouro.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40053,
    century: "Século XVIII",
    title: "Decadência do sistema jesuítico",
    description: "Sistema econômico jesuítico no Pará entra em decadência.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40054,
    year: 1808,
    title: "Transferência da corte portuguesa para o Brasil",
    description: "Corte portuguesa transfere-se para o Brasil sob proteção inglesa.",
    category: EventCategory.POLITICAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40055,
    year: 1808,
    title: "Abertura dos portos",
    description: "Portos brasileiros são abertos ao comércio com nações amigas.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40056,
    year: 1822,
    title: "Independência do Brasil",
    description: "Independência do Brasil é alcançada.",
    category: EventCategory.POLITICAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40057,
    century: "Século XIX",
    title: "Manutenção dos privilégios ingleses",
    description: "Privilégios ingleses em Portugal são transferidos para o Brasil independente.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40058,
    year: 1810,
    title: "Acordos de 1810",
    description: "Acordos de 1810 transferem privilégios ingleses e concedem tarifa preferencial.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40059,
    year: 1827,
    title: "Tratado de 1827",
    description: "Tratado de 1827 com Inglaterra visa abolição do tráfico e envolve concessões econômicas.",
    category: EventCategory.LEGISLATION,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40060,
    year: 1842,
    title: "Fim da tarifa preferencial inglesa",
    description: "Brasil resiste à pressão inglesa e uniformiza tarifa em 15% ad valorem.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40061,
    century: "Século XIX",
    title: "Expansão do café",
    description: "Café aumenta importância na economia brasileira e relações com os EUA.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40062,
    century: "Século XIX",
    title: "Consolidação da independência",
    description: "Café e solidariedade continental firmam independência do Brasil em relação à Inglaterra.",
    category: EventCategory.POLITICAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40063,
    year: 1842,
    title: "Aumento da tarifa (pós-1842)",
    description: "Brasil eleva tarifa, aumentando poder financeiro do governo central.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40064,
    century: "Século XIX",
    title: "Persistência da estrutura econômica colonial",
    description: "Estrutura econômica colonial baseada no escravo persiste, atrasando industrialização.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40065,
    century: "Século XIX",
    title: "Transição política e econômica",
    description: "Primeira metade do séc. XIX é transição política, expansão cafeeira é transição econômica.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40066,
    century: "Século XIX",
    title: "Crise da economia cafeeira e sistema autônomo",
    description: "Crise cafeeira gera elementos de um sistema econômico autônomo.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40067,
    century: "Início do Século XVII",
    title: "Renda concentrada na produção de açúcar",
    description: "Renda da economia açucareira concentra-se em proprietários de engenhos e plantações.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40068,
    century: "Início do Século XVII",
    title: "Importações de luxo",
    description: "Parte da renda açucareira é gasta em bens de consumo importados de luxo.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40069,
    century: "Início do Século XVII",
    title: "Capitalização na economia açucareira",
    description: "Economia açucareira permite grande capitalização apesar de importações.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40070,
    century: "Início do Século XVII",
    title: "Rentabilidade da indústria açucareira",
    description: "Indústria açucareira é rentável para autofinanciar duplicação da capacidade produtiva.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40071,
    century: "Início do Século XVII",
    title: "Controle da comercialização do açúcar",
    description: "Decisões fundamentais na economia açucareira são tomadas na comercialização.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40072,
    century: "Início do Século XVII",
    title: "Tráfico de escravos",
    description: "Tráfico de escravos é central na economia, com lucros para traficantes e custos de reposição.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40073,
    century: "Início do Século XVII",
    title: "Natureza da unidade escravista",
    description: "Unidade escravista é especialização econômica extrema voltada ao mercado externo.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40074,
    century: "Início do Século XVII",
    title: "Impacto da economia açucareira antilhana",
    description: "Economia açucareira antilhana estimula colônias do norte dos EUA.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40075,
    century: "Início do Século XVII",
    title: "Desvio do impulso dinâmico do açúcar",
    description: "Impulso dinâmico do açúcar é desviado para o exterior por interesses e política.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40076,
    century: "Início do Século XVII",
    title: "Expansão da pecuária e custos",
    description: "Expansão da pecuária no Nordeste enfrenta aumento de custos de transporte.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40077,
    century: "Início do Século XVII",
    title: "Baixa rentabilidade inicial da pecuária",
    description: "Rentabilidade inicial da pecuária nordestina é pequena comparada ao açúcar.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40078,
    century: "Início do Século XVII",
    title: "Expansão territorial da pecuária",
    description: "Disponibilidade de terras no sertão impulsiona expansão territorial da pecuária.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40079,
    century: "Século XVII",
    title: "Invasões holandesas",
    description: "Invasões holandesas interrompem economia açucareira, prejudicando mais Portugal.",
    category: EventCategory.INTERNATIONAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40080,
    century: "Século XVII",
    title: "Declínio dos preços do açúcar",
    description: "Perda do monopólio do açúcar leva à baixa de preços e rentabilidade da colônia.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40081,
    century: "Século XVII",
    title: "Crescimento dos setores de subsistência",
    description: "Setores de subsistência crescem, dificultando transferência de impostos para Portugal.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40082,
    century: "Século XVIII",
    title: "Economia mineira e a mão de obra livre",
    description: "Economia mineira oferece mais chances de ascensão social para homens livres.",
    category: EventCategory.SOCIAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40083,
    century: "Século XIX",
    title: "Mercado interno e a economia cafeeira",
    description: "Mercado interno em crescimento na região cafeeira impacta setor de subsistência e café.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40084,
    century: "Século XIX",
    title: "Desenvolvimento do cacau na Bahia",
    description: "Produção de cacau para exportação surge como alternativa econômica na Bahia.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40085,
    century: "Século XIX",
    title: "Recuperação do fumo na Bahia",
    description: "Fumo na Bahia se recupera com mercado crescente na Europa após fim do tráfico.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40086,
    century: "Meados/Final do Século XIX",
    title: "Crescimento populacional e da renda per capita por região",
    description: "Crescimento populacional e da renda per capita variam por região no Brasil.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40087,
    century: "Século XX",
    title: "Divisão da renda e gastos de consumo",
    description: "Renda é dividida entre assalariados (consumo) e proprietários (capitalização).",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40088,
    century: "Século XX",
    title: "Multiplicação da renda pelas exportações",
    description: "Renda de exportações se multiplica na economia em termos monetários e reais.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40089,
    century: "Século XIX",
    title: "Teoria monetária do padrão-ouro",
    description: "Teoria do padrão-ouro predomina no século XIX, baseada em estabilidade cambial.",
    category: EventCategory.INTELLECTUAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40090,
    century: "Século XIX",
    title: "Inaplicabilidade do padrão-ouro no Brasil",
    description: "Padrão-ouro não se aplica à realidade brasileira com moeda inconversível e déficits.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40091,
    year: 1898,
    title: "Adoção de política monetária autônoma",
    description: "Brasil adota política monetária autônoma com Murtinho visando equilíbrio externo.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40092,
    century: "Final do Século XIX e Início do XX",
    title: "Expansão da borracha",
    description: "Expansão da borracha melhora balança de pagamentos brasileira.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40093,
    century: "Início do Século XX",
    title: "Tendência de baixa nos preços do café",
    description: "Preços do café têm tendência de baixa a longo prazo devido à oferta.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40094,
    century: "Início do Século XX",
    title: "Controle da oferta de café pelo Brasil",
    description: "Brasil controla oferta mundial de café, possibilitando manipulação de preços.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40095,
    century: "Início do Século XX",
    title: "Política de valorização do café",
    description: "Estados cafeicultores implementam política de valorização para sustentar preços.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40096,
    year: 1906,
    title: "Convênio de Taubaté",
    description: "Convênio de Taubaté estabelece bases para política de valorização do café.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40097,
    century: "Início do Século XX",
    title: "Resistência à valorização do café",
    description: "Burguesia urbana, financistas e comerciantes opõem-se à valorização do café.",
    category: EventCategory.POLITICAL,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40098,
    century: "Início do Século XX",
    title: "Sucesso inicial e consequências da valorização",
    description: "Valorização do café tem sucesso inicial, governo federal assume responsabilidade.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40099,
    year: 1929,
    title: "Vulnerabilidade da valorização na crise de 1929",
    description: "Crise de 1929 encontra valorização do café vulnerável devido à superprodução.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40100,
    century: "Década de 1920",
    title: "Impacto limitado da expansão econômica internacional no consumo de café",
    description: "Consumo de café se mantém estável apesar da prosperidade nos anos 1920.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40101,
    century: "Década de 1920",
    title: "Financiamento dos estoques de café e pressão inflacionária",
    description: "Financiamento de estoques de café leva à expansão monetária e inflação.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40102,
    century: "Final da Década de 1920",
    title: "Política de conversibilidade",
    description: "Governo adota política de conversibilidade, facilitando fuga de capitais na crise de 1929.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40103,
    year: 1929,
    title: "Resposta à crise de 1929: abandono, estoques ou destruição",
    description: "Crise do café leva a discussões sobre abandonar, estocar ou destruir café.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40104,
    year: 1929,
    title: "Intervenção estatal no mercado de café",
    description: "Governo intervém comprando e destruindo café para sustentar preços.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40105,
    year: 1929,
    title: "Manutenção da renda monetária do setor exportador",
    description: "Política de defesa do café mantém procura monetária no setor exportador.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40106,
    year: 1929,
    title: "Expansão da produção algodoeira",
    description: "Preços do algodão estimulam grande aumento da produção algodoeira no Brasil.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40107,
    year: 1929,
    title: "Mercado interno como fator dinâmico",
    description: "Mercado interno torna-se principal fator dinâmico da economia pós-1929.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40108,
    year: 1937,
    title: "Política cambial pós-1937",
    description: "Governo adota política de múltiplas taxas de câmbio.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40109,
    century: "Segunda Guerra Mundial",
    title: "Acumulação de reservas cambiais durante a Segunda Guerra Mundial",
    description: "Brasil acumula reservas cambiais devido à dificuldade de importar na guerra.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40110,
    century: "Segunda Guerra Mundial",
    title: "Controles diretos na economia durante a guerra",
    description: "Governo implementa controles diretos para orientar recursos na guerra.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40111,
    year: 1930,
    startYear: 1930,
    endYear: 1937,
    title: "Recuperação econômica brasileira nos anos 1930",
    description: "Brasil se recupera da crise de 1929 por suas próprias forças.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40112,
    year: 1940,
    century: "Anos 1940",
    title: "Inflação durante a Segunda Guerra Mundial",
    description: "Tensão na economia a partir de 1940 leva à alta de preços (inflação).",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40113,
    century: "Anos 1940",
    title: "Fixação da taxa de câmbio e seus efeitos",
    description: "Fixação do câmbio protege exportadores, mas impulsiona inflação.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40114,
    century: "Anos 1940",
    title: "Subversão do nível relativo de preços",
    description: "Disparidade de preços internos/importados subverte nível de preços.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40115,
    year: 1947,
    title: "Debate sobre a desvalorização cambial em 1947",
    description: "Discute-se desvalorização cambial diante do crescente desequilíbrio.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40116,
    year: 1949,
    title: "Elevação dos preços do café em 1949",
    description: "Alta brusca nos preços do café gera lucros e transfere renda real.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40117,
    year: 1949,
    title: "Impacto da alta do café sobre o mercado interno",
    description: "Alta do café influencia preços internos e pode prejudicar produção interna.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40118,
    century: "Anos 1940/1950",
    title: "Saturação do processo de capitalização",
    description: "Elevação de preços internos deixa de estimular capitalização.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40119,
    century: "Anos 1940/1950",
    title: "Inflação e o sistema bancário",
    description: "Inflação é propagada por sistema bancário passivo, não é só fenômeno monetário.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40120,
    century: "Século XX",
    title: "Articulação regional da economia no século XX",
    description: "Crescente articulação regional da economia brasileira no século XX.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40121,
    century: "Século XX",
    title: "Desafios futuros da integração econômica",
    description: "Integração futura exige superar exploração arcaica e visão integrada de recursos.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  },
  {
    id: 40122,
    century: "Século XX",
    title: "Projeções para o futuro",
    description: "Projeções indicam disparidade entre desenvolvimento e potencial de recursos no Brasil.",
    category: EventCategory.ECONOMIC,
    source: "Formação Econômica do Brasil"
  }
];

export const formacaoEconomicaBrasilPeriods: TimelinePeriod[] = [];

export const formacaoEconomicaBrasilCharacters: Character[] = [
  {
    id: "celso_furtado",
    name: "Celso Furtado",
    description: "Autor da obra 'Formação Econômica do Brasil', importante economista brasileiro.",
    relatedEvents: [],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "damiao_de_gois",
    name: "Damião de Góis",
    description: "Humanista português do século XVI.",
    relatedEvents: [40001],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "holandeses_feb",
    name: "Holandeses",
    description: "Nação comercial e militar que competiu com Portugal e Espanha na América.",
    relatedEvents: [40013, 40016, 40017, 40018, 40079],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "c_h_wilson",
    name: "C. H. Wilson",
    description: "Historiador econômico que descreveu o domínio comercial holandês.",
    relatedEvents: [40015],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "c_r_boxer",
    name: "C. R. Boxer",
    description: "Historiador de 'The Dutch in Brazil', sobre comércio holandês no Brasil.",
    relatedEvents: [40017],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "franceses_feb",
    name: "Franceses",
    description: "Potência europeia que contestou domínio ibérico e buscou colônias.",
    relatedEvents: [40002],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "ingleses_feb",
    name: "Ingleses",
    description: "Potência europeia que contestou domínio ibérico e buscou colônias.",
    relatedEvents: [40021, 40027, 40028, 40029, 40030, 40054, 40057, 40058, 40059, 40060],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "luis_xiv",
    name: "Luís XIV",
    description: "Rei da França durante colonização francesa nas Antilhas.",
    relatedEvents: [40021],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "v_t_harlow",
    name: "V. T. Harlow",
    description: "Autor citado sobre fornecimento de produtos da Nova Inglaterra às Antilhas.",
    relatedEvents: [40024],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "espanha_feb",
    name: "Espanha",
    description: "Potência ibérica que reivindicou terras americanas e enfrentou competição.",
    relatedEvents: [40006, 40009, 40010, 40013, 40014, 40020, 40025],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "portugueses_feb",
    name: "Portugueses",
    description: "Nação colonizadora do Brasil, focada em exploração e agricultura.",
    relatedEvents: [40001, 40003, 40004, 40005, 40006, 40011, 40012, 40016, 40025, 40026, 40027, 40029, 40032, 40034, 40054],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "padre_antonio_vieira",
    name: "Padre Antônio Vieira",
    description: "Jesuíta com atuação no Maranhão, inicialmente defensor dos indígenas.",
    relatedEvents: [40033],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "roberto_simonsen",
    name: "Roberto Simonsen",
    description: "Pesquisador da história econômica do Brasil, base para dados no texto.",
    relatedEvents: [40086],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "nicolau_de_nassau",
    name: "Nicolau de Nassau",
    description: "Governador do Brasil Holandês (Maurício de Nassau).",
    relatedEvents: [40018],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "antonil",
    name: "Antonil",
    description: "Jesuíta e autor de 'Cultura e Opulência do Brasil pelas Drogas e Minas'.",
    relatedEvents: [40082],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "visconde_de_strangford",
    name: "Visconde de Strangford",
    description: "Representante inglês influente na política econômica brasileira.",
    relatedEvents: [40054],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "principe_regente_d_joao_vi",
    name: "Príncipe Regente (D. João VI)",
    description: "Monarca português que transferiu a corte para o Brasil.",
    relatedEvents: [40054, 40055],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "jose_da_silva_lisboa_visconde_de_cairu",
    name: "José da Silva Lisboa (Visconde de Cairu)",
    description: "Defensor da abertura dos portos em 1808.",
    relatedEvents: [40055],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "mr_hill",
    name: "Mr. Hill",
    description: "Representante inglês insatisfeito com a abertura dos portos.",
    relatedEvents: [40055],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "adam_smith",
    name: "Adam Smith",
    description: "Economista escocês, ideias debatidas na abertura dos portos.",
    relatedEvents: [40055],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "napoleao_bonaparte",
    name: "Napoleão Bonaparte",
    description: "Imperador francês, invasões impactaram relações internacionais.",
    relatedEvents: [40054, 40058],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "imperador_d_pedro_i",
    name: "Imperador (D. Pedro I)",
    description: "Primeiro imperador do Brasil, firmou Tratado de 1827.",
    relatedEvents: [40059],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "belisario",
    name: "Belisário",
    description: "Mencionado em reforma tributária de 1886.",
    relatedEvents: [40060],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "joaquim_murtinho",
    name: "Joaquim Murtinho",
    description: "Ministro da Fazenda, implementou política monetária autônoma.",
    relatedEvents: [40091],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "campos_salles",
    name: "Campos Salles",
    description: "Presidente do Brasil durante atuação de Murtinho.",
    relatedEvents: [40091],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "j_p_wileman",
    name: "J. P. Wileman",
    description: "Autor de 'Brazilian Exchange', influenciou política de Murtinho.",
    relatedEvents: [40091],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "lord_rothschild",
    name: "Lord Rothschild",
    description: "Banqueiro internacional contra valorização do café.",
    relatedEvents: [40097],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "washington_luis",
    name: "Washington Luís",
    description: "Presidente do Brasil, estabeleceu paridade do mil-réis.",
    relatedEvents: [40102],
    source: "Formação Econômica do Brasil"
  },
  {
    id: "getulio_vargas",
    name: "Getúlio Vargas",
    description: "Presidente do Brasil durante crise de 1929 e defesa do café.",
    relatedEvents: [40104],
    source: "Formação Econômica do Brasil"
  }
];
