# Adm-de-Cidades: Plataforma de Inteligência e Visualização de Dados Municipais Brasileiros

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Visão Geral

O **Adm-de-Cidades** (também conhecido internamente como SisInfo) é uma plataforma web interativa desenvolvida em React para visualização, análise e gestão de dados de municípios brasileiros. A aplicação integra um extenso catálogo de dados brutos provenientes de fontes oficiais (IBGE, FINBRA, DATASUS, SNIS, etc.) e os transforma em visualizações acessíveis, permitindo que gestores, pesquisadores e cidadãos explorem indicadores socioeconômicos e geográficos de maneira imersiva.

A plataforma combina mapas interativos (Mapbox GL JS) com ferramentas robustas de visualização de dados (Recharts, D3.js) e módulos de processamento (ETL), oferecendo um raio-X completo da administração pública em escala municipal.

## Arquitetura do Sistema

O projeto adota uma arquitetura baseada em componentes funcionais do React, gerenciando o estado global através de múltiplos Contexts:

*   **`DataContext`**: Coração da aplicação para dados. Gerencia o carregamento, parsing (usando `Papaparse`) e armazenamento de arquivos CSV (indicadores e informações dos municípios) e GeoJSON (geometrias). Ele também lida com o estado dos filtros ativos e o processamento de importação de novas geometrias.
*   **`MapContext`**: Controla o ciclo de vida e o estado do mapa do Mapbox GL JS. É responsável por renderizar os *layers* de municípios (polígonos e pontos), sincronizar as coordenadas da *viewport* e calcular as cores dinamicamente com base nos dados e nas configurações de visualização utilizando escalas D3.
*   **`UIContext`**: Gerencia o estado da interface de usuário, incluindo o "ambiente" ativo (Catálogo, Mapa, Visualização de Dados, ETL), as cores selecionadas, os perfis de cidades abertos, e a configuração da legenda.

## Funcionalidades Principais (Implementadas)

### 1. Mapa Interativo e Exploração Geoespacial (`MapContext`, `DataVisualizationEnvironment`)
*   **Renderização Dinâmica**: Utiliza Mapbox GL JS para renderizar o mapa do Brasil e sobrepor *layers* vetoriais gerados dinamicamente a partir dos dados em CSV e GeoJSON.
*   **Coloração por Atributo ou Indicador**: O mapa atualiza suas cores (Choropleth map) com base na seleção do usuário (ex: PIB, População, IDH). A escala de cores é calculada *on-the-fly* via D3.js.
*   **City Search (`CitySearch.jsx`)**: Barra de pesquisa para localizar municípios rapidamente com recurso de "fly-to" (movimentação de câmera no mapa).

### 2. Painéis de Visualização de Dados
*   **Visualizações Múltiplas**: Gráficos e tabelas interativas utilizando Recharts para exibir:
    *   **RankingView**: Tabelas ordenáveis e gráficos de barras com o ranking dos municípios.
    *   **TimeSeriesView**: Gráficos de linha mostrando a evolução temporal de indicadores selecionados.
    *   **IndicatorComparisonBarChart**: Gráfico de barras horizontais comparando o desempenho relativo dos indicadores de uma cidade.
    *   **RadarChart**: Análise multivariada de indicadores de uma ou mais cidades.

### 3. Perfil Detalhado do Município (`CityInfoBottomBar.jsx`, `CityProfileSummary.jsx`)
*   Ao clicar em um município no mapa, uma barra inferior expansível é exibida contendo um dossiê com os dados gerais e os indicadores específicos daquela cidade, separados por abas (Overview, Indicadores, Séries Temporais, Comparação).

### 4. Pipeline de Processamento de Dados (Módulo ETL - `ETLEnvironment.jsx`)
*   Um ambiente dedicado à transformação de dados de diversas bases públicas (IBGE, SNIS, FINBRA, IPEADATA, DATASUS).
*   Permite formatar tabelas brutas nestes padrões para alimentar o motor do sistema.

### 5. Catálogo de Bases de Dados (`DataSourceInfo.jsx`)
*   Painel acessível na tela inicial (`SisInfo`) documentando e catalogando bases de dados brasileiras e internacionais, fornecendo URLs (ou links gerados via Google Search) para obtenção dos arquivos originais.
*   Inclui as especificações técnicas e de formato aceitos pelo sistema para arquivos CSV e GeoJSON.

## Funcionalidades Parciais e Resquícios no Código

Durante a evolução do projeto, algumas funcionalidades foram planejadas ou parcialmente desenvolvidas, cujos códigos ainda residem no projeto:

*   **Edição Direta de Dados (`CityEditor.jsx`)**: Existe um componente robusto com interface (abas) para edição direta de geometrias, atributos gerais e adição/remoção de indicadores de uma cidade específica. Esta funcionalidade é referenciada como "em desenvolvimento", e embora o componente exista e pareça lidar com o estado temporário das edições, a persistência no backend/arquivo estático não ocorre em ambiente de produção (rodando *client-side* puro). Há botões como "Salvar", "Excluir Cidade" e lógicas de atualização de estado no `App.jsx` (`handleCityUpdateInApp`, `handleCityDeleteInApp`), mas sem persistência em disco na versão empacotada.

## Tecnologias e Dependências Técnicas

As principais tecnologias declaradas no `package.json` são:

*   **React & Vite**: Frontend framework base para construção de UI e o bundler/dev-server de alta performance.
*   **Mapbox GL JS (`mapbox-gl`)**: Biblioteca principal para renderização WebGL do mapa interativo.
*   **D3.js (`d3`)**: Utilizado especificamente pelas suas funções de escala (ex: `scaleLinear`, `scaleQuantile`) e formatação de cores (`colorUtils.js`) para geração dos mapas de calor.
*   **Recharts (`recharts`)**: Biblioteca de componentes React baseada em D3 para a construção dos gráficos interativos nos painéis de análise.
*   **Turf.js (`@turf/turf`)**: Biblioteca de análise geoespacial avançada em JavaScript (disponível no projeto para uso futuro/análise de geometrias).
*   **Papa Parse (`papaparse`)**: Biblioteca para parsing performático de arquivos CSV na camada cliente.
*   **React Select (`react-select`)**: Componentes de select/dropdown customizados e avançados.

## Começando (Getting Started)

O projeto requer o Node.js instalado no sistema.

1.  **Clone o Repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd Adm-de-cidades
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Execute o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```

4.  **Acesse a Aplicação:** Abra o navegador e acesse o endereço padrão fornecido pelo Vite (geralmente `http://localhost:5173`).

## Como Contribuir

Contribuições para estender as capacidades analíticas, adicionar novos indicadores ou finalizar a implementação do editor de cidades são bem-vindas.

1.  Faça um Fork do projeto.
2.  Crie uma Branch para sua feature (`git checkout -b feature/MinhaFeature`).
3.  Faça o Commit de suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`).
4.  Faça o Push para a Branch (`git push origin feature/MinhaFeature`).
5.  Abra um Pull Request.

## 🚀 Roadmap de Evolução e Correções (Situação Atual vs. Ideal)

Este documento descreve uma visão técnica e estratégica detalhada para levar o **Adm-de-Cidades** do seu estado atual (MVP avançado / Protótipo) para uma plataforma de nível de produção (*Enterprise/GovTech ready*).

> **Novo:** Confira também o nosso [**Roadmap de UI/UX e Modernização de Interface (Design System 2.0)**](ROADMAP_UI_UX.md) detalhando a evolução visual de cada página com protótipos de alta fidelidade!

---

### 1. Arquitetura e Gerenciamento de Estado

**Situação Atual:**
*   A aplicação depende fortemente do React Context API (`DataContext`, `MapContext`, `UIContext`) para gerenciar dados volumosos (CSVs, GeoJSONs) e estados complexos.
*   Isso frequentemente leva a re-renderizações desnecessárias (performance bottleneck) e dificulta o rastreamento de mudanças em objetos profundos.
*   Acoplamento alto entre a lógica de negócio e os componentes da interface.

**Situação Ideal (Evolução & Correções):**
*   **Migração de Estado Global (Redux Toolkit / Zustand):** Adotar um gerenciador de estado mais robusto e otimizado para lidar com grandes volumes de dados de forma reativa e seletiva. O Zustand é altamente recomendado pela sua simplicidade e baixo overhead, ou Redux Toolkit para uma estrutura mais rígida e *time-travel debugging*.
*   **Data Fetching & Caching (React Query / SWR):** Delegar a responsabilidade do `DataContext` de buscar e processar dados remotos para ferramentas especializadas. Isso proverá cache out-of-the-box, background fetching, e states de `loading/error` nativos, tornando a UI muito mais resiliente.
*   **Web Workers para Processamento Intensivo:** A carga computacional do *parsing* do CSV (`PapaParse`) e processamento geoespacial pesado (Turf.js) deve ser movida para *Web Workers*. Atualmente, processar milhares de geometrias na thread principal bloqueia a UI (congelamento de tela).
*   **Separação de Preocupações (Clean Architecture):** Extrair a lógica de cálculo (ex: `colorUtils.js`) e manipulação de mapas para *services* ou *hooks* customizados puros, mantendo os componentes React estritamente voltados à apresentação.

---

### 2. Tratamento e Persistência de Dados (O Editor de Cidades)

**Situação Atual:**
*   A arquitetura é primariamente *Client-Side*. Os dados são lidos em memória via arquivos estáticos.
*   Funcionalidades como o `CityEditor.jsx` geram falsas expectativas, pois os dados mutados (inseridos, alterados, excluídos) não são persistidos. Ao recarregar a página, as edições são perdidas.
*   Falta de tipagem estrita para os dados de entrada.

**Situação Ideal (Evolução & Correções):**
*   **Backend e Banco de Dados Real (BFF / API Gateway):** Implementar um *Backend for Frontend* (BFF) em Node.js (NestJS ou Express) ou Python (FastAPI).
*   **Banco de Dados Geoespacial (PostGIS):** Migrar de arquivos estáticos (GeoJSON/CSV) para um banco de dados relacional (PostgreSQL + PostGIS). Isso permite queries espaciais ultra-rápidas (ex: "encontre todos os municípios neste raio com PIB > X"), agregações no lado do servidor, e resolve o problema de persistência do `CityEditor`.
*   **Integração com TypeScript:** Refatorar o projeto de JavaScript (`.jsx`) para TypeScript (`.tsx`). Isso eliminará milhares de potenciais erros de *runtime* relacionados ao formato inconsistente das bases de dados públicas brasileiras (strings no lugar de números, valores nulos, etc).
*   **Autenticação e Autorização (RBAC):** Para habilitar o módulo de edição de dados em produção, será fundamental um sistema de login (JWT / OAuth2), garantindo que apenas administradores autenticados alterem a base.

---

### 3. Engine de Mapas e Geoespacial (Mapbox e Turf.js)

**Situação Atual:**
*   Uso competente do Mapbox GL JS, porém as geometrias completas do Brasil (milhares de polígonos complexos) são carregadas frequentemente do cliente para o motor do Mapbox via `addSource`.
*   Problemas de performance em dispositivos móveis ou com hardware inferior quando muitos *layers* são ligados.

**Situação Ideal (Evolução & Correções):**
*   **Vector Tiles Dinâmicos (Martin / Tegola / Mapbox Studio):** A evolução mais crítica para a UI. Em vez de enviar megabytes de GeoJSON para o browser, o servidor deve servir *Vector Tiles* (MVT). A aplicação apenas requisitará os *tiles* visíveis na tela atual. Isso permite renderizar milhões de pontos e polígonos a 60 FPS.
*   **Clustering Avançado (Supercluster):** Para bases de dados baseadas em pontos (ex: escolas, hospitais do DATASUS), implementar clusterização dinâmica nativa da engine do mapa baseada no nível de zoom.
*   **Camadas Base (Basemaps) Customizadas:** Aumentar as opções de estilo de mapa (Satélite, Dark Mode, Topográfico), controladas pelo `UIContext`.

---

### 4. Engenharia de Dados (ETL) e Automação de Ingestão

**Situação Atual:**
*   O painel de ETL e Catálogo atua mais como documentação (redirecionando para buscas no Google ou links manuais). O usuário precisa baixar os dados, formatá-los no padrão "SysInfo" e injetar na aplicação manualmente.

**Situação Ideal (Evolução & Correções):**
*   **Pipeline de Ingestão Automatizada (Apache Airflow / Prefect):** O módulo ETL deve ser desacoplado do Frontend. Um sistema de orquestração externo deve periodicamente (mensal/anual) bater nas APIs do IBGE, FINBRA e DATASUS, realizar o download, limpeza, transformação (*cleaning, deduplication, normalization*) e popular automaticamente o banco de dados (PostGIS).
*   **Padronização Dinâmica (Schema Mapping):** Se a carga de CSV manual permanecer, a interface do ETL deve possuir uma ferramenta visual de "De-Para" (mapeamento de colunas), permitindo que o usuário envie um CSV do IBGE puro e aponte visualmente qual coluna é o código IBGE, qual é o valor e qual é o ano, sem precisar editar o arquivo no Excel antes.

---

### 5. Qualidade de Código, Testes e CI/CD

**Situação Atual:**
*   Conforme o `package.json`, **"No automated tests configured"**. A confiabilidade da plataforma se baseia puramente em testes manuais ("olhar e ver se funciona").
*   Falta de padronização rígida de código.

**Situação Ideal (Evolução & Correções):**
*   **Testes Unitários (Vitest / Jest + React Testing Library):** Cobertura obrigatória para funções críticas de utilidade (ex: `colorUtils.js`, parsers de CSV) e componentes de UI essenciais. A regra de negócio não pode quebrar.
*   **Testes E2E (Playwright / Cypress):** Testes de ponta-a-ponta validando fluxos críticos: "Usuário abre o sistema -> Clica em São Paulo -> Verifica se o painel lateral abriu e carregou o PIB".
*   **Linter e Formatador Rigorosos:** Implementação de ESLint e Prettier integrados aos *Git Hooks* (Husky) para garantir que código fora do padrão nunca seja comitado.
*   **CI/CD Pipeline (GitHub Actions / GitLab CI):** Automação total: a cada *push*, o código é compilado, tipado (se TS for adotado), os testes rodam e o *build* (Vite) é gerado e publicado em *staging*.

---

### 6. UI/UX e Visualização de Dados (DataViz)

**Situação Atual:**
*   Telas funcionais usando Recharts e D3.js, mas o layout pode parecer sobrecarregado (muita informação simultânea na barra inferior) e a paleta de cores pode gerar problemas de acessibilidade (daltonismo).

**Situação Ideal (Evolução & Correções):**
*   **Acessibilidade (a11y) e Paletas Colorblind-Safe:** As escalas do D3.js devem obrigatoriamente adotar paletas `colorblind-safe` (ex: Viridis, Cividis ou paletas do ColorBrewer projetadas para acessibilidade). Elementos do DOM devem ter atributos ARIA para leitores de tela.
*   **Storytelling de Dados (Scrollytelling):** Transformar *dashboards* estáticos em narrativas. Exemplo: Uma seção onde o usuário rola a tela e o mapa foca automaticamente nas capitais, explicando anomalias do PIB.
*   **Exportação de Relatórios e Gráficos:** Implementar capacidade de gerar PDFs consolidados ou baixar os gráficos do Recharts como imagens (PNG/SVG) para que pesquisadores possam anexar facilmente em seus estudos.
*   **Responsividade Extrema:** Garantir que todos os modais, tabelas flutuantes e botões de controle sobre o mapa funcionem e sejam ergonomicamente agradáveis em telas de smartphones (Touch-first UI).
