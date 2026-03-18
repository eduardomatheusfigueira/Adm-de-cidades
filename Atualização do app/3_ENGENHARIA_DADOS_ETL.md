# 3. Engenharia de Dados e ETL

**Plataforma: SisInfo / GeoIntel (Inteligência Territorial e Analítica)**

---

## 6. Padrões de Integração e Engenharia de Dados (ETL)

Para garantir a correta integração, normalização e ingestão dos dados no sistema através do pipeline de ETL, os arquivos de origem devem seguir rigorosamente as especificações detalhadas abaixo. É obrigatório o uso da codificação UTF-8 e separadores de coluna baseados em ponto e vírgula (`;`).

---

### 6.1. Dados Cadastrais de Municípios (`municipios.csv`)

A espinha dorsal para identificação no aplicativo. Sem um arquivo de municípios correto, muitas funcionalidades espaciais podem não operar como esperado.

#### Estrutura de Colunas:

| Nome da Coluna | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `Codigo_Municipio` | Texto | Sim | Código IBGE completo (7 dígitos). Tratado como texto para preservar zeros. Ex: "4106902" |
| `Nome_Municipio` | Texto | Sim | Nome oficial. Ex: "Curitiba" |
| `Sigla_Estado` | Texto | Sim | Sigla da UF (2 caracteres maiúsculos). Ex: "PR" |
| `Sigla_Regiao` | Texto | Sim | Sigla da Região Geográfica (N, NE, SE, S, CO). Ex: "S" |
| `Area_Municipio` | Número | Sim | Área em km². Ex: 434.892 |
| `Capital` | Booleano | Sim | `true` ou `false` (sem aspas). Ex: `true` |
| `Longitude_Municipio` | Número | Sim | Longitude em graus decimais. Ex: -49.2776 |
| `Latitude_Municipio` | Número | Sim | Latitude em graus decimais. Ex: -25.4296 |
| `Altitude_Municipio` | Número | Sim | Altitude em metros. Ex: 934 |

**Atenção:** A ordem das colunas não importa, mas os nomes dos cabeçalhos devem ser idênticos.

**Guia Conceitual de Construção:** Obtenha os dados no IBGE/SIDRA ou IPEADATA, converta o Status de Capital para booleano literal, derive a região a partir da UF e garanta o uso de ponto (`.`) como separador decimal.

---

### 6.2. Dados de Indicadores (`indicadores.csv`)

Este arquivo centraliza as observações históricas de cada métrica consolidada no formato "longo" ou "tidy". Cada linha representa uma observação única para um município, indicador e ano.

#### Estrutura de Colunas:

| Nome da Coluna | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `Codigo_Municipio` | Texto | Sim | Código IBGE de 7 dígitos do município. |
| `Nome_Indicador` | Texto | Sim | Nome descritivo e único do indicador (ex: "PIB per Capita"). |
| `Ano_Observacao` | Número | Sim | Ano de referência do dado (ex: 2020). |
| `Valor` | Número (Decimal) | Sim | Valor numérico do indicador (separador decimal `.`). |
| `Indice_Posicional` | Número (0-1) | Sim* | *Calculado após a consolidação via ETL (Ver 6.5.1). Normaliza os dados para rankings. |

---

### 6.3. Geometrias e Fronteiras (GeoJSON)

O sistema de mapas (Martin/Mapbox) utilizará a propriedade identificadora para cruzar com o PostGIS.

*   **Obrigatório:** Coleção do tipo `FeatureCollection` contendo `Polygon` ou `MultiPolygon`.
*   **Property Chave:** `CD_MUN` ou similar, contendo o Código IBGE de 7 dígitos.
*   **Projeção:** WGS84 (EPSG:4326).

---

### 6.4. Guias Estratégicos de ETL por Fonte de Dados

O aplicativo consolida dados em formatos complexos. A equipe de Engenharia de Dados deve seguir os fluxos abaixo para garantir a conformidade com o formato "longo" exigido por `indicadores.csv`.

#### 6.4.1. Dados Largos (Exemplo: SNIS)

Fontes como o SNIS costumam ter "indicadores como colunas". A etapa crucial é o Melt/Unpivot.

*   **Limpeza:** Ler arquivo (frequentemente `latin1`).
*   **Melt:** Converter as N colunas de indicadores para as linhas `Nome_Indicador` e `Valor`.

```python
# Conceito: Pandas Melt
df_longo = pd.melt(df_largo, id_vars=['Codigo_Municipio', 'Ano_Observacao'],
                   value_vars=colunas_indicadores,
                   var_name='Nome_Indicador', value_name='Valor')
```

#### 6.4.2. IPEADATA (API e Lotes)

Para baixar massivamente do IPEADATA, use a API OData (`http://www.ipeadata.gov.br/api/odata4/...`).

*   **Filtragem:** Após consolidar os lotes retornados via `ThreadPoolExecutor`, mantenha apenas `NIVNOME == 'Municípios'`.
*   **Padronização:** Converta `VALDATA` para Ano numérico, extraia `TERCODIGO` para Município e aplique os mapeamentos corretos para descrever o `SERCODIGO` no campo `Nome_Indicador`. Certifique-se de compatibilizar a métrica para as unidades padrão.

#### 6.4.3. DATASUS (Morbidade / TABNET)

Arquivos exportados do TABNET vêm com o Ano ou Categorias nas colunas e podem ter dados mascarados (`-` para zeros).

*   **Limpeza inicial:** `df_bruto.replace('-', 0)`
*   **Melt:** Pivotar os anos (ex: '2010', '2011') que estão dispostos em colunas.
*   **Split de String:** O município muitas vezes aparece concatenado ("410010 Abatiá"). Utilize RegEx para desmembrar o código de 7 dígitos.
*   **Formatação Decimal:** Substitua vírgulas por pontos antes do `pd.to_numeric`.

#### 6.4.4. FINBRA (SICONFI)

Arquivos separados por relatório e por ano, com diversas rubricas contábeis.

*   **Parser Rigoroso:** Utilize `skiprows=3` e encode `latin1`.
*   **Identificador:** Concatenar colunas "Conta" e "Coluna" para gerar o `Nome_Indicador` unívoco. Atribuir dinamicamente a coluna `Ano_Observacao` com base no contexto do arquivo lido.

#### 6.4.5. IBGE (SIDRA)

No portal SIDRA, ao extrair CSVs como o Censo Agropecuário:

*   **Tratamento de Ausentes:** Substitua marcações proprietárias do IBGE como `...`, `X`, ou `-` por `np.nan`.
*   **Unpivot Parcial:** Se os dados trouxerem múltiplas variáveis no topo, execute a transposição e consolide a string extraindo os 7 dígitos do Município.

---

### 6.5. Processamentos e Cálculos Especiais Pós-Ingestão

#### 6.5.1. Cálculo do Índice Posicional

Mandatório antes de injetar os indicadores na aplicação. O Índice normaliza a posição do município entre 0 e 1, permitindo comparações justas no mapa coroplético independentemente de grandezas monetárias vs percentuais.

*   **Lógica:** Determinar direção do indicador (Maior é melhor = ex: IDH; Menor é melhor = ex: Mortalidade). Usar rankeamento com média de empates (`method='average'`).
*   **Fórmula:** `Indice_Posicional = (N - rank) / (N - 1)` (onde N é o total de municípios com dados válidos).

```python
# Abordagem utilizando Pandas groupby
grupo['rank'] = grupo['Valor'].rank(method='average', ascending=nao_maior_melhor)
grupo['Indice_Posicional'] = (N - grupo['rank']) / (N - 1)
```

#### 6.5.2. Correção de Código IBGE (6 para 7 Dígitos)

Dados extraídos do DATASUS ou fontes legadas frequentemente cortam o Dígito Verificador (DV), reduzindo o IBGE para 6 dígitos. É mandatório restaurá-lo cruzando os 6 dígitos iniciais com o `municipios.csv` homologado.

*   **Implementação Conceptual:**
    1.  Construir dicionário O(1) lendo o `municipios.csv`: `{ "410690": "4106902" }`.
    2.  Percorrer o dado legado. Se `len(codigo) >= 6`, extraia o prefixo e recupere o de 7 dígitos pelo dict.
    3.  Aplicar essa correção ANTES de calcular o Índice Posicional.

---
*Este documento serve como contrato de integração de dados e guia estratégico para a Engenharia de Dados.*