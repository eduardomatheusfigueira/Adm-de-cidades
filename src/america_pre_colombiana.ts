import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';

export const americaPreColombianaSource: SourceInfo = {
  id: 'america_pre_colombiana',
  name: 'América Pré-colombiana',
  author: 'Ciro Flamarion Cardoso',
  color: '#6415FF',
  description: 'História detalhada dos eventos e personagens da América Pré-colombiana, conforme texto de Ciro Flamarion Cardoso.'
};

export const americaPreColombianaEvents: TimelineEvent[] = [
  {
    id: 30021,
    startYear: -40000,
    endYear: -30000,
    title: 'Primeira Onda de Povoamento (Rota Costeira)',
    description: 'Possível primeira onda de povoamento da América através de rota costeira durante fase glacial de Farmdale. Migração do sul de Bering ou Aleutas até Alasca e costa oeste dos EUA.',
    category: EventCategory.EXPLORATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30022,
    startYear: -40000,
    endYear: -20000,
    title: 'Antiguidade Máxima Estimada para Povoamento',
    description: 'Consenso atual sobre antiguidade máxima do povoamento da América, baseado em achados como Tlapacoya (México) e Pikimachay (Peru).',
    category: EventCategory.EXPLORATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30023,
    startYear: -15000,
    endYear: -14000,
    title: 'Segunda Onda de Povoamento (Rota Interior)',
    description: 'Possível segunda onda de povoamento por rota interior durante fase glacial de New Haven. Caçadores avançados com pontas de pedra pelo corredor Mackenzie.',
    category: EventCategory.EXPLORATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30024,
    startYear: -11000,
    endYear: -7000,
    title: 'Paleolítico Superior Americano',
    description: 'Período com tecnologia lítica e pontas de projétil. Caça à megafauna do Pleistoceno (mamutes, bisões, etc.).',
    category: EventCategory.SOCIAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30025,
    year: -10000,
    title: 'Difusão da Tradição Llano',
    description: 'Centro de difusão de pontas de projétil especializadas (Clóvis, Folsom, etc.) na América do Norte, espalhando-se até a América do Sul.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30026,
    startYear: -14400,
    endYear: -12300,
    title: 'Sítio de Muaco e Pontas de Projétil',
    description: 'Datas do sítio de Muaco (Venezuela), possível origem sul-americana das primeiras pontas de projétil.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30027,
    year: -10000,
    title: 'Homem de Lagoa Santa',
    description: 'Datação aproximada do "homem de Lagoa Santa" (Brasil), com características não mongolóides, indicando povoamento heterogêneo.',
    category: EventCategory.SOCIAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30028,
    startYear: -8800,
    endYear: -7000,
    title: 'Fim do Último Período Glacial',
    description: 'Fim do último período glacial e início da transição Pleistoceno-Holoceno na América.',
    category: EventCategory.SOCIAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30029,
    year: -6000,
    title: 'Retirada das Geleiras e Fase Quente/Seca',
    description: 'Completa retirada das geleiras e início de fase quente e seca até 3.000 a.C.',
    category: EventCategory.SOCIAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30030,
    year: -2500,
    title: 'Clima Semelhante ao Atual',
    description: 'Clima torna-se muito semelhante ao atual.',
    category: EventCategory.SOCIAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30031,
    year: -3000,
    title: 'Elevação do Nível do Mar',
    description: 'Elevação gradual do nível do mar, criando ambiente favorável a recursos marinhos.',
    category: EventCategory.ECONOMIC,
    source: americaPreColombianaSource.name
  },
  {
    id: 30032,
    year: -7000,
    title: 'Extinção da Megafauna do Pleistoceno',
    description: 'Processo avançado de extinção da megafauna do Pleistoceno.',
    category: EventCategory.SOCIAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30033,
    startYear: -7000,
    endYear: -3000,
    title: 'Diversificação Cultural e Regionalização',
    description: 'Recuo da grande caça, diversificação cultural e regionalização dos modos de vida. Exploração de recursos aquáticos e coleta vegetal.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30034,
    year: -5000,
    title: 'Micrólitos nas Regiões Árticas',
    description: 'Aparecimento de "micrólitos" (Mesolítico europeu) nas regiões árticas da América.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30035,
    year: -5000,
    title: 'Predomínio da Caça Especializada no Canadá',
    description: 'Predomínio da caça especializada nos planaltos do Canadá até aproximadamente 5.000 a.C.',
    category: EventCategory.ECONOMIC,
    source: americaPreColombianaSource.name
  },
  {
    id: 30036,
    year: -1500,
    title: 'Continuação da Caça na Patagônia',
    description: 'Continuação da caça especializada na Patagônia até a chegada dos europeus.',
    category: EventCategory.ECONOMIC,
    source: americaPreColombianaSource.name
  },
  {
    id: 30037,
    year: -9000,
    title: 'Sambaquis e Exploração de Moluscos',
    description: 'Datação de sambaquis indicando exploração especializada de moluscos.',
    category: EventCategory.ECONOMIC,
    source: americaPreColombianaSource.name
  },
  {
    id: 30038,
    startYear: -5000,
    endYear: -4000,
    title: 'Pesca Especializada',
    description: 'Estabelecimento da pesca especializada.',
    category: EventCategory.ECONOMIC,
    source: americaPreColombianaSource.name
  },
  {
    id: 30039,
    startYear: -7000,
    endYear: -1000,
    title: 'Transição para Agricultura em Tamaulipas',
    description: 'Transição gradual para agricultura em Tamaulipas (México).',
    category: EventCategory.ECONOMIC,
    source: americaPreColombianaSource.name
  },
  {
    id: 30040,
    year: -7000,
    title: 'Aldeias Neolíticas no Oriente Próximo Asiático',
    description: 'Aldeias plenamente neolíticas no antigo Oriente Próximo Asiático.',
    category: EventCategory.SOCIAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30041,
    year: -2000,
    title: 'Aldeias Agrícolas Sedentárias Generalizadas',
    description: 'Generalização de aldeias agrícolas sedentárias nas regiões avançadas da América (Mesoamérica e Andes Centrais).',
    category: EventCategory.URBANIZATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30042,
    year: -5000,
    title: 'Início da Domesticação de Plantas',
    description: 'Início da domesticação de plantas na América: abóbora, milho, feijão, abacate (Mesoamérica); batata, quinoa, lhama (Andes Centrais); mandioca (possivelmente noroeste da América do Sul).',
    category: EventCategory.ECONOMIC,
    source: americaPreColombianaSource.name
  },
  {
    id: 30043,
    year: -2000,
    title: 'Uso de Metal (Cobre Martelado)',
    description: 'Uso de instrumentos de metal (cobre martelado) por caçadores nos Grandes Lagos norte-americanos.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30044,
    year: -3200,
    title: 'Cerâmica Mais Antiga da América (Valdivia)',
    description: 'Cerâmica mais antiga conhecida na América, em Valdivia (Equador).',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30045,
    year: -2440,
    title: 'Cerâmica Mais Antiga da Mesoamérica (Puerto Marquez)',
    description: 'Cerâmica mais antiga conhecida na Mesoamérica (Puerto Marquez).',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30046,
    year: -1750,
    title: 'Introdução da Cerâmica no Peru',
    description: 'Introdução da cerâmica no Peru.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30047,
    startYear: -2500,
    endYear: -900,
    title: 'Difusão de Aldeias e Centros Cerimoniais Andinos',
    description: 'Difusão de aldeias e surgimento de templos e centros cerimoniais nos Andes Centrais. Centros: La Florida, Las Haldas, Kotosh.',
    category: EventCategory.URBANIZATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30048,
    startYear: -2000,
    endYear: -1500,
    title: 'Generalização de Aldeias Sedentárias e Diferenciação Cultural',
    description: 'Generalização do habitat em aldeias sedentárias e diferenciação entre "área nuclear" (Mesoamérica/Andes) e "culturas marginais".',
    category: EventCategory.SOCIAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30049,
    startYear: -1200,
    endYear: -900,
    title: 'Florescimento de San Lorenzo (Olmeca)',
    description: 'Florescimento do centro olmeca de San Lorenzo.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30050,
    startYear: -1000,
    endYear: -600,
    title: 'Florescimento de La Venta (Olmeca)',
    description: 'Florescimento do centro olmeca de La Venta.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30051,
    year: -600,
    title: 'Importância de Tres Zapotes (Olmeca)',
    description: 'Importância de Tres Zapotes como centro olmeca posterior a La Venta.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30052,
    startYear: -1200,
    endYear: 0,
    title: 'Período Geral da Cultura Olmeca',
    description: 'Período geral da cultura olmeca na Costa do Golfo do México.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30053,
    year: -1000,
    title: 'Estilo Tlatilco',
    description: 'Desenvolvimento do estilo de Tlatilco (México), com cerâmica característica e influência olmecóide.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30054,
    startYear: -1500,
    endYear: 0,
    title: 'Culturas Formativas Maias',
    description: 'Surgimento de culturas formativas baseadas em aldeias agrícolas e milho na área maia (Ocos, Kaminaljuyu, Las Charcas).',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30055,
    century: 'Século V a.C.',
    title: 'Cerâmica Mamom (Maia)',
    description: 'Surgimento da cerâmica de Mamom na região guatemalteca de Petén.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30056,
    year: -600,
    title: 'Ocupação de Tikal (Maia)',
    description: 'Ocupação do sítio de Tikal.',
    category: EventCategory.URBANIZATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30057,
    startYear: -300,
    endYear: -200,
    title: 'Templos de Tijolos (Maia)',
    description: 'Surgimento de templos de tijolos em Tikal, Uaxactun e Kaminaljuyu.',
    category: EventCategory.URBANIZATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30058,
    year: -200,
    title: 'Influência Olmeca via Izapa (Maia)',
    description: 'Influência olmeca (indireta) na civilização maia através da cultura de Izapa (Chiapas).',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30059,
    startYear: -900,
    endYear: -200,
    title: 'Cultura Chavín Inter-Regional',
    description: 'Primeira cultura inter-regional, estilo Chavín, expandindo-se pela costa e terras altas do Peru. Centro: Chavín de Huántar. Difusão de milho produtivo, irrigação e metalurgia.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30060,
    year: 100,
    title: 'Fase Urbana de Teotihuacan',
    description: 'Entrada em fase urbana de Teotihuacan, primeira grande cidade mesoamericana.',
    category: EventCategory.URBANIZATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30061,
    startYear: 450,
    endYear: 650,
    title: 'Apogeu de Teotihuacan',
    description: 'Apogeu populacional de Teotihuacan (85.000 habitantes). Expansão de influência.',
    category: EventCategory.URBANIZATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30062,
    startYear: 200,
    endYear: 900,
    title: 'Apogeu da Civilização Maia (Período Clássico)',
    description: 'Apogeu da civilização maia: cidades-estados, arquitetura, escrita, matemática, astronomia, sistema religioso e calendário.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30063,
    year: 900,
    title: 'Colapso dos Centros Maias Centrais',
    description: 'Colapso dos principais centros maias da região central (Tierras Bajas).',
    category: EventCategory.SOCIAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30064,
    startYear: -200,
    endYear: 600,
    title: 'Intermédio Inicial Andino: Desenvolvimento Tecnológico e Estados',
    description: 'Desenvolvimento tecnológico e artístico. Estados organizados. Urbanismo andino (Tiahuanaco, Pucara, Huari). Irrigação e terraços. Tecelagem e metalurgia.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30065,
    startYear: 200,
    endYear: 600,
    title: 'Cultura Mochica',
    description: 'Apogeu da cultura Mochica (Peru): agricultura irrigada, pesca, sociedade militarizada, cerâmica rica.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30066,
    startYear: 200,
    endYear: 600,
    title: 'Civilização de Tiahuanaco',
    description: 'Civilização urbana de Tiahuanaco (Bolívia): agricultura de batata/quinoa, pastoreio de lhamas, centro religioso.',
    category: EventCategory.URBANIZATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30067,
    startYear: 200,
    endYear: 600,
    title: 'Cidades nos Vales Costeiros Meridionais Andinos',
    description: 'Surgimento de pequenas cidades nos vales da costa meridional (Pisco, Ica, Nazca, Acari).',
    category: EventCategory.URBANIZATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30068,
    startYear: 600,
    endYear: 1000,
    title: 'Império Huari',
    description: 'Expansão de Huari, formando império nos Andes Centrais. Difusão de estilos e urbanismo. Desintegração rápida.',
    category: EventCategory.POLITICAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30069,
    startYear: 600,
    endYear: 1000,
    title: 'Santuário de Pachacamac',
    description: 'Desenvolvimento do santuário e cidade de Pachacamac (Peru).',
    category: EventCategory.URBANIZATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30070,
    startYear: 900,
    endYear: 1519,
    title: 'Pós-Clássico Mesoamericano: Militarismo e Urbanização',
    description: 'Encontro de agricultores e guerreiros nômades (chichimecas). Militarismo. Fusão cultural (Teotihuacan/Mixteca-Puebla). Urbanização e agricultura irrigada.',
    category: EventCategory.URBANIZATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30071,
    startYear: 900,
    endYear: 1168,
    title: 'Cultura Tolteca',
    description: 'Cultura Tolteca (capital Tula). Influência no México central.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30072,
    year: 1168,
    title: 'Destruição de Tula (Tolteca - Primeira)',
    description: 'Destruição de Tula (primeira fase).',
    category: EventCategory.POLITICAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30073,
    year: 1224,
    title: 'Destruição Total de Tula (Tolteca - Final)',
    description: 'Destruição total de Tula, vácuo de poder no México central, cidades-estados em conflito.',
    category: EventCategory.POLITICAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30074,
    startYear: 900,
    endYear: 1519,
    title: 'Mixtecas em Oaxaca e Cholula',
    description: 'Mixtecas em Oaxaca e Cholula: urbanismo mesoamericano final, metalurgia, cerâmica policroma, códices.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30075,
    year: 1325,
    title: 'Fundação de Tenochtitlan (Asteca)',
    description: 'Fundação de Tenochtitlan (cidade Asteca) no Lago Texcoco.',
    category: EventCategory.URBANIZATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30076,
    startYear: 1434,
    endYear: 1519,
    title: 'Ascensão dos Aztecas e Tríplice Aliança',
    description: 'Ascensão dos Aztecas: alianças (Tríplice Aliança), conquistas sob Moctezuma I. "Império" mosaico em 1519.',
    category: EventCategory.POLITICAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30077,
    startYear: 900,
    endYear: 1519,
    title: 'Maias Pós-Clássicos',
    description: 'Maias no Pós-Clássico: cidades-estados menores no Yucatán, tradições culturais, comércio marítimo.',
    category: EventCategory.CULTURAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30078,
    startYear: 1000,
    endYear: 1476,
    title: 'Intermédio Tardio Andino: Estados Regionais',
    description: 'Descentralização após Huari, estados regionais independentes. Cobre e bronze. Urbanismo planejado (Chimú/Incas). Irrigação e terraços. Crescimento populacional.',
    category: EventCategory.URBANIZATION,
    source: americaPreColombianaSource.name
  },
  {
    id: 30079,
    startYear: 1000,
    endYear: 1476,
    title: 'Reino Chimú',
    description: 'Reino Chimú (costa norte do Peru, capital Chan-Chan): irrigação, administração, tributos, cerâmica negra, metalurgia.',
    category: EventCategory.POLITICAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30080,
    startYear: 1476,
    endYear: 1534,
    title: 'Império Inca (Horizonte Tardio)',
    description: 'Expansão e consolidação do Império Inca (Tawantinsuyu) sob Pachakuti, Tupa Yupanki, Wayna Kápak. Capital Cusco. Estradas, correios, quipos. Ayllu, ayni, mita. Agricultura sofisticada. Culto ao Sol. Quíchua.',
    category: EventCategory.POLITICAL,
    source: americaPreColombianaSource.name
  },
  {
    id: 30081,
    year: 1531,
    title: 'Início da Conquista Espanhola (Inca)',
    description: 'Início da conquista espanhola, interrompendo o Império Inca.',
    category: EventCategory.COLONIZATION,
    source: americaPreColombianaSource.name
  }
];

export const americaPreColombianaCharacters: Character[] = [
  {
    id: 'ales_hrdlicka',
    name: 'Aleš Hrdlička',
    description: 'Sábio do início do século XX que defendia povoamento recente da América (5.000 anos) e origem mongolóide única.',
    relatedEvents: []
  },
  {
    id: 'william_h_holmes',
    name: 'William H. Holmes',
    description: 'Sábio do início do século XX que, com Hrdlička, defendia povoamento americano recente e homogêneo.',
    relatedEvents: []
  },
  {
    id: 'pw_lund',
    name: 'P. W. Lund',
    description: 'Naturalista dinamarquês que descobriu o "homem de Lagoa Santa" (Brasil), com características não mongolóides.',
    relatedEvents: [30027]
  },
  {
    id: 's_hansen',
    name: 'S. Hansen',
    description: 'Estudou o "homem de Lagoa Santa" em 1888, reforçando características não mongolóides.',
    relatedEvents: [30027]
  },
  {
    id: 'paul_rivet',
    name: 'Paul Rivet',
    description: 'Defendeu povoamento heterogêneo da América em ondas migratórias (asiática, australiana, melanésia, polinésia).',
    relatedEvents: []
  },
  {
    id: 'ca_chard',
    name: 'C. A. Chard',
    description: 'Sugeriu duas rotas de povoamento: costeira antiga e interior recente, ligadas a fases glaciais.',
    relatedEvents: [30021, 30023]
  },
  {
    id: 'cj_heusser',
    name: 'C. J. Heusser',
    description: 'Sugeriu duas rotas de povoamento: costeira antiga e interior recente, ligadas a fases glaciais.',
    relatedEvents: [30021, 30023]
  },
  {
    id: 'p_bosch_gimpera',
    name: 'P. Bosch Gimpera',
    description: 'Sugeriu duas rotas de povoamento: costeira antiga e interior recente, ligadas a fases glaciais.',
    relatedEvents: [30021, 30023]
  },
  {
    id: 'dd_anderson',
    name: 'D. D. Anderson',
    description: 'Arqueólogo do sítio de Onion Portage (Alasca), com antiguidade de 15.000 anos.',
    relatedEvents: [30023]
  },
  {
    id: 'cruxent',
    name: 'Cruxent',
    description: 'Postulou invenção sul-americana de pontas de projétil (sítio de Muaco, Venezuela).',
    relatedEvents: [30026]
  },
  {
    id: 'brennan',
    name: 'Brennan',
    description: 'Postulou invenção sul-americana de pontas de projétil (sítio de Muaco, Venezuela).',
    relatedEvents: [30026]
  },
  {
    id: 'v_gordon_childe',
    name: 'V. Gordon Childe',
    description: 'Popularizou "revolução neolítica": domesticação, cerâmica, polimento, tecelagem.',
    relatedEvents: [30040]
  },
  {
    id: 'l_binford',
    name: 'L. Binford',
    description: 'Agricultura surge por pressão demográfica e escassez de recursos pré-agrícolas.',
    relatedEvents: [30041, 30042]
  },
  {
    id: 'k_flannery',
    name: 'K. Flannery',
    description: 'Sedentarismo como longo processo, papel do milho no aumento de recursos.',
    relatedEvents: [30041, 30042]
  },
  {
    id: 'jt_meyers',
    name: 'J. T. Meyers',
    description: 'Integrou hipóteses de Braidwood, Binford e Flannery para agricultura no vale de Tehuacan (México).',
    relatedEvents: [30039]
  },
  {
    id: 'tc_patterson',
    name: 'T. C. Patterson',
    description: 'Modelo de Meyers não se aplica à costa do Peru, recursos marítimos importantes, causas regionais da agricultura.',
    relatedEvents: [30038]
  },
  {
    id: 'b_meggers',
    name: 'B. Meggers',
    description: 'Defendeu origem asiática transpacífica para cerâmica de Valdivia (Equador), semelhanças com Jomon japonês.',
    relatedEvents: [30044]
  },
  {
    id: 'jc_evans',
    name: 'J. C. Evans',
    description: 'Defendeu origem asiática transpacífica para cerâmica de Valdivia (Equador), semelhanças com Jomon japonês.',
    relatedEvents: [30044]
  },
  {
    id: 'e_estrada',
    name: 'E. Estrada',
    description: 'Defendeu origem asiática transpacífica para cerâmica de Valdivia (Equador), semelhanças com Jomon japonês.',
    relatedEvents: [30044]
  },
  {
    id: 'pierre_chaunu',
    name: 'Pierre Chaunu',
    description: 'Distinção de três áreas na América pré-colombiana (século XV) por agricultura e povoamento.',
    relatedEvents: [30080]
  },
  {
    id: 'angel_palerm',
    name: 'Angel Palerm',
    description: 'Classificação de sistemas agrícolas e povoamento na Mesoamérica: coivara, pousio, regadio, densidade populacional.',
    relatedEvents: [30070]
  },
  {
    id: 'g_willey',
    name: 'G. Willey',
    description: 'Periodização mesoamericana (pré-clássico, clássico, pós-clássico) baseada em critérios estéticos.',
    relatedEvents: [30048, 30062, 30070]
  },
  {
    id: 'p_phillips',
    name: 'P. Phillips',
    description: 'Periodização mesoamericana (pré-clássico, clássico, pós-clássico) baseada em critérios estéticos.',
    relatedEvents: [30048, 30062, 30070]
  },
  {
    id: 'rene_millon',
    name: 'René Millón',
    description: 'Estudou Teotihuacan, estimou apogeu populacional e extensão territorial.',
    relatedEvents: [30061]
  },
  {
    id: 'p_armillas',
    name: 'P. Armillas',
    description: 'Irrigação como base econômica de Teotihuacan, mas evidências arqueológicas escassas.',
    relatedEvents: [30060]
  },
  {
    id: 'f_katz',
    name: 'F. Katz',
    description: 'Sociedade de Teotihuacan com estratificação social avançada (guerreiros, sacerdotes, mercadores).',
    relatedEvents: [30061]
  },
  {
    id: 'j_paddock',
    name: 'J. Paddock',
    description: 'Considera os Mixtecas pais do urbanismo mesoamericano final.',
    relatedEvents: [30074]
  },
  {
    id: 'a_caso',
    name: 'A. Caso',
    description: 'Demonstrou que os Mixtecas reutilizaram tumbas Zapotecas.',
    relatedEvents: [30074]
  },
  {
    id: 'manuel_m_moreno',
    name: 'Manuel M. Moreno',
    description: 'Classificação de formas de propriedade da terra entre os Aztecas (comunal, nobres, pública).',
    relatedEvents: [30076]
  },
  {
    id: 'p_carrasco',
    name: 'P. Carrasco',
    description: 'Acesso à terra Azteca como concessão do Estado por serviços, caráter revogável.',
    relatedEvents: [30076]
  },
  {
    id: 'john_murra',
    name: 'John Murra',
    description: 'Conceito de "arquipélagos verticais" nos Andes para controle de nichos ecológicos e recursos.',
    relatedEvents: [30078]
  },
  {
    id: 'd_menzel',
    name: 'D. Menzel',
    description: 'Pesquisas ampliaram conhecimento sobre o império Huari nos Andes Centrais.',
    relatedEvents: [30068]
  },
  {
    id: 'louis_baudin',
    name: 'Louis Baudin',
    description: 'Descreveu o Império Inca como "império socialista" (interpretação contestada por marxistas).',
    relatedEvents: [30080]
  },
  {
    id: 'f_engels',
    name: 'F. Engels',
    description: 'Explicação marxista de sociedades tribais pré-urbanas ("comunidade primitiva", hordas, clãs), baseado em L. Morgan.',
    relatedEvents: []
  },
  {
    id: 'l_morgan',
    name: 'L. Morgan',
    description: 'Trabalhos sobre sociedades primitivas base para análise de Engels sobre evolução social.',
    relatedEvents: []
  },
  {
    id: 'm_weber',
    name: 'M. Weber',
    description: 'Mercado como critério de definição da cidade.',
    relatedEvents: [30060]
  },
  {
    id: 'k_wittfogel',
    name: 'K. Wittfogel',
    description: 'Hipótese "hidráulica": Estados despóticos surgem do controle de irrigação.',
    relatedEvents: [30070]
  },
  {
    id: 'perry_anderson',
    name: 'Perry Anderson',
    description: 'Defende abandonar "modo de produção asiático" como categoria analítica.',
    relatedEvents: []
  }
];

export const americaPreColombianaPeriods: TimelinePeriod[] = [
  {
    id: 40001,
    startYear: -40000,
    endYear: 1492,
    title: 'Período Pré-colombiano',
    source: americaPreColombianaSource.name
  },
  {
    id: 40002,
    startYear: -40000,
    endYear: -7000,
    title: 'Paleolítico Americano',
    description: 'Povoamento inicial e desenvolvimento de tecnologias líticas de caça.',
    source: americaPreColombianaSource.name
  },
  {
    id: 40003,
    startYear: -8800,
    endYear: -3000,
    title: 'Mesolítico Americano',
    description: 'Fim da glaciação, diversificação cultural, exploração de recursos aquáticos e vegetais.',
    source: americaPreColombianaSource.name
  },
  {
    id: 40004,
    startYear: -7000,
    endYear: -900,
    title: 'Sociedades Agrícolas Pré-Urbanas (Neolítico Americano)',
    description: 'Transição para agricultura, aldeias sedentárias, domesticação de plantas e cerâmica.',
    source: americaPreColombianaSource.name
  },
  {
    id: 40005,
    startYear: -1200,
    endYear: 0,
    title: 'Período Pré-Clássico ou Formativo (Mesoamérica)',
    description: 'Cultura Olmeca, centros cerimoniais, culturas formativas maias.',
    source: americaPreColombianaSource.name
  },
  {
    id: 40006,
    startYear: 100,
    endYear: 900,
    title: 'Período Clássico (Mesoamérica)',
    description: 'Teotihuacan, apogeu maia, cidades-estados, escrita, matemática, astronomia.',
    source: americaPreColombianaSource.name
  },
  {
    id: 40007,
    startYear: -200,
    endYear: 600,
    title: 'Intermédio Inicial (Andes Centrais)',
    description: 'Desenvolvimento tecnológico, estados organizados, Mochica, Tiahuanaco.',
    source: americaPreColombianaSource.name
  },
  {
    id: 40008,
    startYear: 600,
    endYear: 1000,
    title: 'Horizonte Médio ou Intermédio Médio (Andes Centrais)',
    description: 'Império Huari, expansão e desintegração, santuário de Pachacamac.',
    source: americaPreColombianaSource.name
  },
  {
    id: 40009,
    startYear: 900,
    endYear: 1519,
    title: 'Período Pós-Clássico (Mesoamérica)',
    description: 'Militarismo, urbanização, cultura Tolteca, Mixtecas, ascensão Azteca.',
    source: americaPreColombianaSource.name
  },
  {
    id: 40010,
    startYear: 1000,
    endYear: 1476,
    title: 'Intermédio Tardio (Andes Centrais)',
    description: 'Estados regionais, reino Chimú, urbanismo planejado.',
    source: americaPreColombianaSource.name
  },
  {
    id: 40011,
    startYear: 1476,
    endYear: 1534,
    title: 'Horizonte Tardio (Andes Centrais)',
    description: 'Império Inca, expansão, Cusco, sistema administrativo e cultural.',
    source: americaPreColombianaSource.name
  }
];
