# Documento de Especificação de Produto (PRD) e Arquitetura

**Plataforma: SisInfo / GeoIntel (Inteligência Territorial e Analítica)**

---

## 1. Visão Geral do Projeto

O SisInfo (ou GeoIntel) é uma plataforma Web "GovTech" de alto nível focada em análise de dados, inteligência territorial e indicadores socioeconômicos. O sistema visa consolidar, processar e visualizar dados de diversas fontes oficiais (IBGE, DATASUS, FINBRA, etc.) em diferentes recortes espaciais (municípios, estados, regiões).

**Objetivo desta versão (V2 - Ideal):**
Reconstruir a aplicação do zero, migrando de um protótipo Client-Side (baseado em arquivos estáticos CSV/GeoJSON em memória) para uma plataforma Enterprise-Ready. A nova versão exige um backend robusto, banco de dados geoespacial, renderização de mapas via Vector Tiles e um pipeline de dados (ETL) automatizado.

---

## 3. Arquitetura do Sistema (A Versão Ideal)

A equipe de desenvolvimento deve adotar a seguinte stack de tecnologias:

### 3.1. Frontend (Client)

*   **Framework:** React com TypeScript (Next.js ou Vite). TypeScript é obrigatório para garantir a tipagem rigorosa dos dados estatísticos.
*   **Gerenciamento de Estado:** Zustand ou Redux Toolkit (abandonar a passagem excessiva de Context API para dados pesados).
*   **Map Engine:** MapLibre GL JS e Martin.
*   **DataViz:** Recharts (para gráficos UI) e D3.js (para cálculos de escalas e cores do mapa).
*   **Estilização:** Tailwind CSS.

### 3.2. Backend (API & BFF)

*   **Linguagem/Framework:** Python (FastAPI) - altamente recomendado devido à facilidade com bibliotecas de dados (Pandas/GeoPandas) - OR Node.js (NestJS).
*   **Autenticação:** JWT via OAuth2 (Controle de Acesso Baseado em Roles - RBAC, essencial para diferenciar visualizadores de editores de dados).

### 3.3. Banco de Dados & Geoespacial

*   **Database:** PostgreSQL com extensão PostGIS (Obrigatório). Os dados não residirão mais em arquivos estáticos.
*   **Servidor de Mapas (Tile Server):** Martin ou Tegola. Em vez de enviar megabytes de GeoJSON para o browser, o backend deve servir Vector Tiles (MVT), garantindo 60fps ao renderizar todos os municípios do Brasil simultaneamente.

### 3.4. Engenharia de Dados (ETL)

*   **Orquestração:** Apache Airflow ou Prefect.
*   **Função:** Scripts automatizados que buscam dados em APIs públicas (IBGE, etc.), limpam, normalizam e inserem no PostGIS periodicamente.

---

## 5. Requisitos Não Funcionais (RNFs) e Engenharia

*   **Performance de Renderização (Critical):** O mapa não deve sofrer engasgos (jank). O uso de Vector Tiles (MVT) é obrigatório para evitar o travamento do navegador (UI Thread) que ocorre ao manipular GeoJSONs massivos no cliente.
*   **Responsividade (Mobile-first nas views de leitura):** Enquanto o Mapa Interativo, o Dashboard Analítico e o Editor de Cidades demandam telas maiores (Desktop/Tablet), os Relatórios e o Catálogo de Metadados devem ser perfeitamente fluidos em smartphones.
*   **Segurança e Privacidade:** Endpoints da API devem ser protegidos. Ações de alteração de dados (City Editor, Bulk Import) devem validar tokens JWT e exigir permissão de role ADMIN.
*   **Testes:** Configurar CI/CD. Exigência de testes unitários (Jest/Vitest) para todas as funções utilitárias que calculam métricas estatísticas e cores do mapa.
*   **Caching:** Implementar estratégias de cache robustas no Frontend (ex: React Query/SWR) e no Backend (Redis) para que consultas repetidas a dados geográficos idênticos não sobrecarreguem o banco de dados.

---
*Este documento serve como contrato arquitetural para as equipes de Engenharia e Banco de Dados.*