# 🎨 Roadmap de UI/UX e Modernização de Interface (Design System 2.0)

Este documento estabelece o plano de ação detalhado para a evolução e modernização visual da plataforma Adm-de-Cidades (SisInfo). Baseado nos protótipos de alta fidelidade ("Target State"), este plano descreve como migraremos do layout atual para uma interface avançada, profissional e padronizada (*Enterprise-grade*).

---

## 1. O Novo Design System Global

A mudança mais significativa será a adoção de um novo *Design System* estrito, abandonando estilos isolados (CSS puro e descentralizado) em favor de um *utility-first framework* moderno.

### 1.1 Cores e Tipografia (Theme Core)
- **Framework de Estilo:** Migração completa para **Tailwind CSS**.
- **Tipografia:** Adoção da fonte `Inter` como padrão absoluto (substituindo padrões legados), garantindo legibilidade para dados (fontes monoespaçadas para números).
- **Paleta de Cores Principal:**
  - `primary`: **#14213d** (Azul profundo/Marinho) – Utilizado em Sidebars, Headers e textos de ênfase.
  - `accent`: **#fca311** (Laranja/Dourado) – Utilizado em Call-to-actions, ícones ativos e destaques de gráficos.
  - `background-light`: **#f6f7f8** (Cinza/Prata muito claro) – Fundo padrão para reduzir o contraste excessivo do branco puro.
- **Iconografia:** Substituição de ícones aleatórios pela biblioteca **Material Symbols Outlined** da Google (consistência visual).

### 1.2 Padrões de Layout (Componentes Estruturais)
- **Glassmorphism:** Uso estratégico de *backdrop-blur* em cabeçalhos (Headers) fixos e painéis flutuantes por cima do mapa (Mapbox).
- **Cards e Containers:** Bordas suaves (`rounded-xl`), delineadas por bordas muito finas (`border-slate-200`) e sombras projetadas sutis (`shadow-sm` ou `shadow-lg` para flutuantes).
- **Layout Base:** Transição de layouts "soltos" para estruturas rígidas de *Flexbox* (Sidebar fixa + Conteúdo Flexível) em telas de módulos, e *Absolute Overlay* na tela do Mapa.

---

## 2. Planos de Evolução por Módulo (Situação Atual vs. Ideal)

Abaixo estão as descrições detalhadas e as imagens do "Estado Futuro Alvo" (Print Screens do design planejado) para cada um dos 5 módulos centrais.

### 2.1 Módulo de Inteligência Espacial (Mapa Interativo)

**Situação Atual:**
O mapa preenche a tela, mas os controles (filtros, barra lateral) são painéis genéricos, opacos ou que quebram a imersão espacial. A barra inferior (`CityInfoBottomBar`) é funcional, mas domina muito a tela quando aberta.

**Estado Ideal (Ação de Desenvolvimento):**
A interface do mapa deve ser **fluida e flutuante**. O mapa (Mapbox) dominará 100% do *viewport*.
1.  **Header Flutuante (Glassmorphism):** Um header superior semi-transparente (`bg-primary/95 backdrop-blur-md`) contendo a busca unificada e o perfil do usuário.
2.  **Painel Lateral Esquerdo (Filtros Espaciais):** Deixará de empurrar o layout. Será um painel suspenso (`fixed top-20 left-6`) com cantos arredondados, fundo escuro e tipografia clara (Dark Mode forçado no painel) para contrastar com o mapa claro.
3.  **Controles de Mapa à Direita:** Ícones de estilo (*layers*, *zoom*, ferramentas de desenho) empilhados verticalmente em botões flutuantes brancos/claros com sombras.
4.  **Bottom Sheet (Perfil da Cidade):** A `CityInfoBottomBar` será transformada em um *Bottom Sheet* estilo mobile/Google Maps. Ela entra na tela de baixo para cima (`translate-y`), exibindo cartões de KPIs (População, Renda, Score) organizados em um *grid* responsivo (4 colunas), gráficos minimalistas e uma tabela de comparação (Métrica vs. Média Local).

**Visão Alvo (Print Screen):**
![Inteligência Espacial - Mapa](screenshots/map.png)

---

### 2.2 Módulo Gerador de Relatórios (Executive Intelligence)

**Situação Atual:**
Os dados são exibidos primariamente na tela, sem uma visão otimizada para "leitura executiva" ou impressão formal.

**Estado Ideal (Ação de Desenvolvimento):**
Criação de uma "Página de Documento" estruturada como um relatório impresso (Fundo branco puro, largura contida `max-w-5xl`, layout centrado).
1.  **Header de Impressão:** Botões de Exportar (PDF) visíveis na tela, mas ocultos em `@media print`.
2.  **KPIs em Destaque:** Os indicadores globais da cidade ou estado exibidos no topo (Score Global, Eficiência, ROI) com grandes tipografias e setas de tendência.
3.  **Sumário Executivo:** Seção textual de destaque.
4.  **Data Visualization (Gráficos Nativos):** Inclusão de um Gráfico Radar (para comparar pilares: Qualidade, Inovação, Sustentabilidade) e Gráficos de Área empilhada.
5.  **Tabela Analítica e Rodapé Institucional:** Tabelas formatadas com estilo estrito (bordas horizontais simples) e um rodapé contendo espaços para "Assinaturas Digitais", conferindo ar oficial ao documento.

**Visão Alvo (Print Screen):**
![Gerador de Relatórios](screenshots/reports.png)

---

### 2.3 Repositório de Metadados e Catálogo de Bases (`DataSourceInfo.jsx`)

**Situação Atual:**
O `DataSourceInfo.jsx` (Catálogo) é uma grade básica com cartões que abrem links externos ou procuram no Google. Falta "corpo" de ferramenta de governança de dados.

**Estado Ideal (Ação de Desenvolvimento):**
Evoluir de um simples "lista de links" para um **DataStack Metadados** profissional.
1.  **Layout com Sidebar de Filtros (Padrão E-commerce de Dados):** Sidebar esquerda (`w-64`) para filtrar por Instituição (IBGE, DATASUS) e Frequência de atualização.
2.  **Hero View (Base de Dados em Foco):** O topo do conteúdo principal deve exibir a "Base Selecionada" com uma caixa de destaque imponente, mostrando a descrição, tags (`Selecionado`, `Fonte Certificada`), metadados em grid (Fonte, Atualização, Periodicidade) e botões CTA grandes de ação (Conectar via API, Baixar RAW).
3.  **Cartões de Bases (Cards):** Grade (`grid-cols-2`) exibindo as demais bases. Os cartões usarão ícones grandes (`payments`, `school`, `medical_services`) representativos do tema, com um *hover state* sutil revelando bordas com a cor `primary`.

**Visão Alvo (Print Screen):**
![Catálogo de Bases](screenshots/catalog.png)

---

### 2.4 Documentação e Wiki Institucional

**Situação Atual:**
Informações do projeto atualmente residem apenas em arquivos de código ou README.md crus no repositório.

**Estado Ideal (Ação de Desenvolvimento):**
Criação de uma interface de "Wiki/Knowledge Base" embutida no sistema.
1.  **Estrutura de 3 Colunas:**
    *   **Coluna Esquerda (Navegação):** Menu Sidebar com o tema `primary` (fundo azul escuro, texto claro). Links organizados por categorias (Introdução, Metodologia, Administração). Link ativo ganha barra lateral de destaque.
    *   **Coluna Central (Leitura / Prose):** Utilização do plugin `@tailwindcss/typography` (o `prose`) para renderizar Markdown/HTML com espaçamento automático, títulos h1/h2 coloridos (azul) e imagens legíveis com bordas arredondadas e *captions*.
    *   **Coluna Direita (Table of Contents - TOC):** "Nesta Página" flutuante (Table of contents dinâmica baseada nos h2/h3) acompanhada de um *card* CTA para o "Suporte Técnico".

**Visão Alvo (Print Screen):**
![Wiki Documentação](screenshots/wiki.png)

---

### 2.5 Visualização Analítica e Dashboards Comparativos (Monitor)

**Situação Atual:**
Gráficos avulsos (`RankingView`, `TimeSeriesView`) na barra inferior ou em abas simples. A comparação entre cidades é trabalhosa.

**Estado Ideal (Ação de Desenvolvimento):**
Um módulo dedicado de *Analytics* robusto para a visão transversal e gerencial (comparando MÚLTIPLOS municípios simultaneamente).
1.  **Sidebar Fina (Navegação de Módulo):** Menu colapsável ou enxuto à esquerda, cor `primary`.
2.  **Painel Superior (Top Bar de Ferramentas):** Header branco tradicional de dashboards B2B, com barra de busca global central.
3.  **Cards de Visão Geral (Bento Grid):** KPIs globais no topo (Média de Performance, Municípios Ativos, Cluster de Destaque). O grid deve misturar diferentes tamanhos de gráficos (`col-span-8` vs `col-span-4`).
4.  **Matriz de Comparação Horizontal:** O rodapé da tela principal funcionará como uma "Barra de Carrinho", mostrando quais municípios estão sendo comparados simultaneamente (ex: Curitiba, Florianópolis, Vitória) no gráfico de linha mista ("Evolução Temporal").
5.  **Micro-interações:** Uso extensivo de barras de progresso (ex: "Comparativo por Pilar de Gestão") para facilitar a leitura visual de percentuais em tabelas (estilo *Bullet Charts*).

**Visão Alvo (Print Screen):**
![Dashboard Analítico](screenshots/dashboard.png)

---

## 3. Próximos Passos de Execução (Plano de Trabalho)

1.  **Configuração da Base Frontend:** Instalar dependências estruturais (`tailwindcss`, `@headlessui/react` para acessibilidade/modais complexos, `lucide-react` ou continuar com o Google Material Fonts).
2.  **Criação de Componentes UI Universais:** Desenvolver a pasta `/src/components/ui/` contendo a nova fundação (Button.jsx, Card.jsx, Sidebar.jsx, Modal.jsx) consumindo o tema Tailwind.
3.  **Refatoração Gradual:** Iniciar pela modernização do `DataSourceInfo.jsx` (Catálogo), por ser uma tela mais isolada.
4.  **Refatoração do Mapa:** O passo mais complexo. Envolverá mover os controles absolutos sobre a camada do Mapbox e reescrever a barra de perfil inferior (`CityInfoBottomBar`) para o formato flutuante e modular, utilizando portais React se necessário para controle de z-index.
