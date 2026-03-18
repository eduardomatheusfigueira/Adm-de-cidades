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
