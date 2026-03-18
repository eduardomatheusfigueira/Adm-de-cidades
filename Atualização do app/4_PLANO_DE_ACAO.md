# 4. Plano de Ação e Transição

**Plataforma: SisInfo / GeoIntel (Inteligência Territorial e Analítica)**

---

Este documento delineia os passos necessários para realizar a transição do estado atual do aplicativo (V1 - Protótipo Client-Side) para a versão alvo (V2 - Enterprise-Ready).

## Fase 1: Fundação do Backend e Banco de Dados (Semanas 1-3)

A primeira etapa foca em remover a dependência de arquivos CSV e GeoJSON estáticos em memória.

*   **1.1. Configuração da Infraestrutura:** Subir uma instância de PostgreSQL com a extensão PostGIS habilitada.
*   **1.2. Modelagem do Banco:** Criar os schemas básicos para `Municipios` e `Indicadores`, baseando-se no contrato de dados do Documento 3.
*   **1.3. Ingestão Inicial (ETL MVP):** Criar scripts Python iniciais para ler os arquivos `municipios.csv`, `indicadores.csv` e `brasil_municipios.json` atualmente no projeto, e realizar o *seed* no banco PostGIS.
*   **1.4. API Base:** Iniciar o projeto backend (FastAPI/NestJS) e criar endpoints de leitura REST para os dados (`/api/municipios`, `/api/indicadores`).

## Fase 2: Transição do Servidor de Mapas (Semanas 4-5)

Migrar da renderização cliente pesada para Vector Tiles.

*   **2.1. Configuração do Tile Server:** Subir uma instância do Martin (ou Tegola) conectada ao banco PostGIS da Fase 1.
*   **2.2. Criação das Views Espaciais:** Criar `views` ou funções no PostGIS que unam a tabela de geometrias com os indicadores (calculando cores ou enviando dados puros para o tile) de forma eficiente.
*   **2.3. Validação dos Tiles:** Testar endpoints MVT (ex: `http://localhost:3000/public.vw_municipios/{z}/{x}/{y}.pbf`) com clientes locais (ex: QGIS).

## Fase 3: Modernização do Frontend (Semanas 6-9)

Reescrever o aplicativo React focando na nova arquitetura, estado e design system.

*   **3.1. Setup do Novo Repositório:** Inicializar o projeto (Vite/Next.js) com TypeScript e Tailwind CSS.
*   **3.2. Configuração do Design System:** Traduzir o Documento 2 em variáveis CSS/Tailwind (Cores `#14213d`, tipografia Inter).
*   **3.3. Refatoração do Gerenciador de Estado:** Substituir o uso pesado da Context API pelo Zustand. Criar *stores* para UI (`useUIStore`), Mapas (`useMapStore`) e Dados (`useDataStore`), conectando-os aos endpoints criados na Fase 1, abandonando o `PapaParse`.
*   **3.4. Migração do Mapa Core (MapLibre):** Substituir o Mapbox GL JS atual pelo MapLibre GL JS, configurando-o para consumir as Vector Tiles da Fase 2, ao invés de carregar o arquivo GeoJSON estático.
*   **3.5. Componentização UI/UX:** Construir o *Floating UI* (Painéis laterais flutuantes com blur), o *Bottom Sheet* para detalhes de municípios e os Cards Analíticos.

## Fase 4: Implementação dos Módulos Analíticos (Semanas 10-12)

Com o núcleo do mapa e dados estabilizados, focar nos submódulos secundários descritos no Documento 2.

*   **4.1. Módulo 2 (Dashboard):** Criar os gráficos com Recharts integrados à API. Implementar a lógica do "Dock de Comparação" (seleção múltipla de localidades).
*   **4.2. Módulo 3 (Relatórios):** Estruturar a página baseada no layout A4 (`@media print`) para exportação limpa.
*   **4.3. Módulo 4 (Catálogo de Dados):** Consumir a documentação dinâmica de indicadores e fontes do backend.

## Fase 5: Autenticação, Módulo de Administração e ETL Contínuo (Semanas 13-16)

Habilitar recursos de edição para usuários administradores.

*   **5.1. Sistema de Auth:** Integrar JWT no backend e frontend.
*   **5.2. Módulo 5 (City Editor/Bulk Import):** Criar a UI de edição de tabelas para indicadores, com requisições POST/PUT protegidas, substituindo o conceito de edição local da versão atual.
*   **5.3. Automação do ETL:** Migrar os scripts isolados da Fase 1 para *DAGs* do Apache Airflow, conectando às APIs externas (IBGE, DATASUS) para automação periódica.

---
*Este cronograma serve como macro-guia. As fases devem ser conduzidas sob metodologias ágeis com validações frequentes.*