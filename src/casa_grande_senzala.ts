import { TimelineEvent, TimelinePeriod, Character, EventCategory, SourceInfo } from './types';

export const casaGrandeSenzalaSource: SourceInfo = {
  id: "casa_grande_senzala",
  name: "Casa-Grande & Senzala",
  author: "Gilberto Freyre",
  color: "#A0AEC0",
  description: "Explora a formação da sociedade brasileira colonial, analisando as influências do sistema escravista, da cultura portuguesa, indígena e africana."
};

export const casaGrandeSenzalaEvents: TimelineEvent[] = [
  {
    id: 80001,
    century: "Século XVI",
    title: "Formação da Sociedade Patriarcal e Escravista",
    description: "Início da formação da sociedade brasileira com base no sistema patriarcal e escravista, centrado na figura do senhor de engenho.",
    category: EventCategory.SOCIAL,
    source: "casa_grande_senzala"
  },
  {
    id: 80002,
    century: "Século XVI",
    title: "Influência da Família Patriarcal",
    description: "A família patriarcal como núcleo central da sociedade colonial, com poder e autoridade concentrados na figura masculina.",
    category: EventCategory.SOCIAL,
    source: "casa_grande_senzala"
  },
  {
    id: 80003,
    century: "Século XVI",
    title: "Escravidão Africana como Base Econômica",
    description: "Utilização da mão de obra escrava africana como principal força de trabalho na economia açucareira e em outras atividades.",
    category: EventCategory.ECONOMIC,
    source: "casa_grande_senzala"
  },
  {
    id: 80004,
    century: "Século XVI",
    title: "Casa-Grande como Centro de Poder",
    description: "A casa-grande como espaço de moradia do senhor de engenho e sua família, símbolo de poder e centro da vida social e econômica.",
    category: EventCategory.SOCIAL,
    source: "casa_grande_senzala"
  },
  {
    id: 80005,
    century: "Século XVI",
    title: "Senzala como Espaço de Sofrimento",
    description: "A senzala como local de moradia dos escravos, representando condições precárias e sofrimento físico e social.",
    category: EventCategory.SOCIAL,
    source: "casa_grande_senzala"
  },
  {
    id: 80006,
    century: "Século XVI",
    title: "Mestiçagem e Formação Cultural",
    description: "Processo de mestiçagem entre portugueses, indígenas e africanos, contribuindo para a formação de uma cultura brasileira singular.",
    category: EventCategory.CULTURAL,
    source: "casa_grande_senzala"
  },
  {
    id: 80007,
    century: "Século XVI",
    title: "Hibridismo Religioso",
    description: "Sincretismo religioso, com a融合 de elementos do catolicismo, religiões africanas e crenças indígenas.",
    category: EventCategory.CULTURAL,
    source: "casa_grande_senzala"
  },
  {
    id: 80008,
    century: "Século XVI",
    title: "Alimentação e Costumes",
    description: "Formação de hábitos alimentares e costumes brasileiros, influenciados pelas três culturas.",
    category: EventCategory.CULTURAL,
    source: "casa_grande_senzala"
  },
  {
    id: 80009,
    century: "Século XVII",
    title: "Consolidação do Sistema Escravista",
    description: "Consolidação e expansão do sistema escravista no Brasil, com o aumento do tráfico negreiro e da produção açucareira.",
    category: EventCategory.ECONOMIC,
    source: "casa_grande_senzala"
  },
  {
    id: 80010,
    century: "Século XVII",
    title: "Resistência Escrava",
    description: "Formas de resistência escrava, como fugas, quilombos e revoltas, em busca de liberdade e melhores condições de vida.",
    category: EventCategory.SOCIAL,
    source: "casa_grande_senzala"
  },
  {
    id: 80011,
    century: "Século XVIII",
    title: "Ciclo do Ouro e Mudanças Sociais",
    description: "O Ciclo do Ouro provoca mudanças sociais e econômicas, com o surgimento de uma sociedade mais urbana e diversificada.",
    category: EventCategory.ECONOMIC,
    source: "casa_grande_senzala"
  },
  {
    id: 80012,
    century: "Século XIX",
    title: "Abolição Gradual da Escravidão",
    description: "Processo gradual de abolição da escravidão, marcado por leis abolicionistas e pressões internas e externas.",
    category: EventCategory.LEGISLATION,
    source: "casa_grande_senzala"
  },
  {
    id: 80013,
    year: 1888,
    title: "Abolição da Escravidão",
    description: "Abolição da escravidão no Brasil com a Lei Áurea, marcando o fim do sistema escravista, mas não das desigualdades raciais.",
    category: EventCategory.LEGISLATION,
    source: "casa_grande_senzala"
  }
];

export const casaGrandeSenzalaPeriods: TimelinePeriod[] = [
  {
    id: 90001,
    startYear: 1500,
    endYear: 1888,
    title: "Período Colonial e Escravista",
    description: "Long