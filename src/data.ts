import { CategoryInfo, EventCategory, SourceInfo } from './types';

// Informações sobre as fontes
export const sources: SourceInfo[] = [
  {
    id: "invencao_trabalhismo",
    name: "A Invenção do Trabalhismo",
    author: "Angela de Castro Gomes",
    color: "#3182CE",
    description: "Análise sobre a construção da identidade política da classe trabalhadora no Brasil entre 1890 e 1945."
  },
  {
    id: "raizes_brasil",
    name: "Raízes do Brasil",
    author: "Sérgio Buarque de Holanda",
    color: "#E53E3E",
    description: "Obra clássica sobre a formação da sociedade brasileira, abordando desde o período colonial até o início do século XX."
  },
  {
    id: "capitaes_brasil",
    name: "Capitães do Brasil",
    author: "Eduardo Bueno",
    color: "#C6797E",
    description: "Explora os primeiros anos da colonização portuguesa no Brasil, sistema de capitanias, interação com indígenas e economia colonial."
  },
  {
    id: "casa_grande_senzala",
    name: "Casa-Grande & Senzala",
    author: "Gilberto Freyre",
    color: "#A0AEC0",
    description: "Explora a formação da sociedade brasileira colonial, analisando as influências do sistema escravista, da cultura portuguesa, indígena e africana."
  },
  {
    id: "naufragos_traficantes",
    name: "Náufragos, traficantes e degredados",
    author: "Eduardo Bueno",
    color: "#9F7AEA", // Example color, please choose a better one if needed
    description: "Livro sobre as primeiras expedições no Brasil, explorando o período inicial da presença europeia e as interações com os nativos."
  },
  {
    id: "urbanizacao_brasil",
    name: "A Urbanização Brasileira",
    author: "Milton Santos",
    color: "#F6AD55",
    description: "Análise da transformação do Brasil em uma sociedade e território urbanizados, explorando a evolução e as dinâmicas da urbanização brasileira."
  },
  {
    id: "reinaldo_jose_lopes",
    name: "Reinaldo Jose Lopes",
    author: "Reinaldo Jose Lopes",
    color: "#A21CAF", // Example color
    description: "Fonte: Reinaldo Jose Lopes"
  },
  {
    id: "darcy_ribeiro",
    name: "Darcy Ribeiro",
    author: "Darcy Ribeiro",
    color: "#EA580C", // Example color
    description: "Fonte: Darcy Ribeiro"
  },
  {
    id: "o_povo_brasileiro",
    name: "O Povo Brasileiro",
    author: "Darcy Ribeiro",
    color: "#2F4F4F",
    description: "Exploração da formação histórica e cultural do Brasil, examinando a interação entre indígenas, africanos e europeus."
  },
  {
    id: "evolucao_politica_brasil",
    name: "Evolução Política do Brasil",
    author: "Caio Prado Júnior",
    color: "#D4AC0D",
    description: "Análise do desenvolvimento histórico do Brasil: Colônia e Império."
  },
  {
    id: "historia_constitucional",
    name: "História Constitucional do Brasil",
    author: "Aurelino Leal e Diários da Assembleia Constituinte",
    color: "#81E6D9",
    description: "Análise da história constitucional do Brasil, desde as ideias constitucionais de 1820 até a Constituição de 1891, baseada na obra de Aurelino Leal e nos diários da Assembleia Constituinte."
  },
  {
    id: "eduardo_bueno",
    name: "Eduardo Bueno",
    author: "Eduardo Bueno",
    color: "#059669", // Example color
    description: "Fonte: Eduardo Bueno"
  },
  {
    id: "sergio_buarque",
    name: "Sérgio Buarque de Holanda",
    author: "Sérgio Buarque de Holanda",
    color: "#06B6D4", // Example color
    description: "Fonte: Sérgio Buarque de Holanda"
  },
  {
    id: "formacao_economica_brasil",
    name: "Formação Econômica do Brasil",
    author: "Celso Furtado",
    color: "#EAB308",
    description: "Análise da constituição histórica da economia brasileira, desde o período colonial até meados do século XX."
  }
];

export const categoryColors: Record<EventCategory, string> = {
  [EventCategory.POLITICAL]: "#3182CE",
  [EventCategory.LABOR_MOVEMENT]: "#E53E3E",
  [EventCategory.LEGISLATION]: "#38A169",
  [EventCategory.INTERNATIONAL]: "#805AD5",
  [EventCategory.SOCIAL]: "#DD6B20",
  [EventCategory.REPRESSION]: "#718096",
  // Novas categorias para Raízes do Brasil
  [EventCategory.COLONIZATION]: "#D69E2E",
  [EventCategory.ECONOMIC]: "#319795",
  [EventCategory.CULTURAL]: "#B83280",
  [EventCategory.INTELLECTUAL]: "#6B46C1",
  [EventCategory.URBANIZATION]: "#4A5568",
  // New category for Náufragos, traficantes e degredados
  [EventCategory.EXPLORATION]: "#9F7AEA"
};

export const categoryNames: Record<EventCategory, string> = {
  [EventCategory.POLITICAL]: "Eventos Políticos",
  [EventCategory.LABOR_MOVEMENT]: "Movimento Operário",
  [EventCategory.LEGISLATION]: "Legislação",
  [EventCategory.INTERNATIONAL]: "Eventos Internacionais",
  [EventCategory.SOCIAL]: "Eventos Sociais",
  [EventCategory.REPRESSION]: "Repressão",
  // Novas categorias para Raízes do Brasil
  [EventCategory.COLONIZATION]: "Colonização",
  [EventCategory.ECONOMIC]: "Economia",
  [EventCategory.CULTURAL]: "Cultura",
  [EventCategory.INTELLECTUAL]: "Intelectual",
  [EventCategory.URBANIZATION]: "Urbanização",
   // New category for Náufragos, traficantes e degredados
  [EventCategory.EXPLORATION]: "Exploração"
};
