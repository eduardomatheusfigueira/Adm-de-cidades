# Auditoria do módulo de confecção e exportação de mapas — SisInfo / Adm-de-cidades

> **Público:** professor responsável pelo projeto.
> **Data:** 30/09/2026.
> **Escopo:** React 18 + Vite 4, Mapbox GL JS 2.15, `src/contexts/MapContext.jsx`, `src/components/ImageExportStudio.jsx`, `src/utils/exportMap.js`, contextos de dados, UI e anotações, componentes cartográficos (Legend, NorthArrow, ScaleBar, Graticule, AnnotationToolbar, AnnotationLegend, FilterMenu, VisualizationMenu) e CSS.
> **Método:** 10 auditorias temáticas (motor do mapa, Estúdio parte 1 e 2, elementos cartográficos e HTML, anotações, dados e importação, shell e mobile, execução real com Playwright, plataforma e deploy, benchmark cartográfico). Todo achado *critical* ou *high* passou por verificação adversarial: outro auditor tentou refutá-lo lendo o código e, quando possível, `node_modules`. Os achados verificados estão marcados com **[V]**. Os demais (*medium/low*) são de um único auditor e não foram reverificados.
> **Nenhum código foi alterado.** O único arquivo criado foi este.
> **Convenção:** as capturas da execução real e as imagens exportadas estão em `docs/auditoria-capturas/`. Referências a `SP/` (scripts e JSONs de execução) apontam para o ambiente temporário da auditoria e não foram versionadas.

---

## 1. Resumo executivo

### Veredito

**Não. Hoje o app não está pronto para a turma, nem no computador nem, muito menos, no celular.**

- **Desktop, com token Mapbox válido e rede liberada:** o fluxo completo roda. Importar CSV e GeoJSON, colorir, anotar, abrir o Estúdio e exportar PNG em 1920×1080, 4K ou 8000×6000 foi confirmado em execução real.
- **O resultado cartográfico, porém, sai errado com frequência:**
  - a escala gráfica do PNG tem comprimento fixo. Medindo o erro como (distância real representada pela barra ÷ distância do rótulo) − 1, a execução real mostrou +45% (zoom 5,12), +47% (zoom 15) e +140% (zoom 3,39). A simulação vai de cerca de −32% (zoom 16, lat −33°) a +232% (zoom 3, lat −3°), com +221% em zoom 3 e lat −15° (ver A2);
  - a do HTML sai 2× errada;
  - municípios sem dado aparecem como "classe mais baixa";
  - números com vírgula decimal são truncados ou pintados de preto;
  - a legenda não corresponde ao mapa quando há filtro;
  - o Estúdio exporta outra variável e ignora a legenda editada;
  - com poucos municípios ou empates, o mapa simplesmente não é colorido.
- **No celular o fluxo quebra logo na tela do mapa.** A caixa de busca cobre os dois menus. Linhas e polígonos só fecham com duplo clique. Nada no Estúdio se arrasta com o dedo. A prévia aloca canvas acima do limite do iOS. Nada é salvo automaticamente.

### Bloqueadores principais (precisam ser resolvidos antes de liberar)

| # | Bloqueador | Onde |
|---|---|---|
| B1 | **Dependência frágil do Mapbox.** Sem token o app fica em branco (inclusive o catálogo). Com token inválido, rede escolar bloqueando `api.mapbox.com` ou 4G ruim, o spinner "Carregando mapa..." nunca termina e todas as ferramentas e o Estúdio ficam indisponíveis, sem mensagem. **No Mapbox GL v2 nenhum estilo local contorna a falta de token ou um token inválido:** a verificação de sessão apaga o canvas e o painter deixa de desenhar (ver C1). | `MapContext.jsx:40-74`, `App.jsx:185-196,259`, `index.html:9`; `node_modules/mapbox-gl/src/ui/map.js:3431-3448`, `src/render/painter.js:529` |
| B2 | **No celular (360–430 px em retrato) a busca cobre os botões de Dados e Visualização.** Não dá para importar, colorir, desenhar nem salvar. | `styles/CitySearch.css:2-10` × `index.css:178-196`; `auditoria-capturas/android-02-mapa.png` |
| B3 | **Perda de trabalho.** Não há salvamento automático e o `localStorage` antigo é apagado ao abrir. Recarregar a página, o iOS descartar a aba ou uma exceção (não existe ErrorBoundary) apaga anotações, legendas e páginas do Estúdio. | `AnnotationContext.jsx:6-17`, `UIContext.jsx:40`, `main.jsx:6-10` |
| B4 | **Não há dados nem malha embutidos.** São 1 município, 0 indicadores e geometria vazia. Um GeoJSON importado só aparece se houver uma linha num CSV de 9 colunas com o mesmo código. | `DataContext.jsx:5-6,70`, `MapContext.jsx:159-165` |
| B5 | **Classificação quebra com poucos municípios ou empates.** A expressão `step` fica inválida, o mapa não é colorido e a legenda mostra "164 – 164" cinco vezes. Com o dado embutido, a falha acontece assim que se escolhe qualquer atributo numérico (o padrão `Sigla_Regiao`, em `UIContext.jsx:11`, é categórico e usa `match`); em recortes pequenos ou com empates, acontece com dados reais. | `utils/colorUtils.js:42-55`, `MapContext.jsx:274-303` |
| B6 | **Escala gráfica errada nas exportações.** No PNG a barra tem sempre 340 px, qualquer que seja a distância do rótulo. No HTML usa a constante de tiles de 256 px (erro de 2×). | `ImageExportStudio.jsx:196`, `utils/exportMap.js:495` |
| B7 | **O Estúdio exporta um mapa diferente do preparado.** Começa em `Sigla_Regiao`, ignora a legenda personalizada, pinta polígonos e pontos com variáveis diferentes, e os filtros não filtram. | `ImageExportStudio.jsx:719,1190-1280,1543` |
| B8 | **O Estúdio não funciona no celular.** O preview e o canvas de sobreposição têm o tamanho da saída × devicePixelRatio (18,7 MP em HD num iPhone, acima do limite de 16,7 MP do iOS). Arrastar e redimensionar só funciona com mouse. O download revoga o blob no mesmo tick. | `ImageExportStudio.jsx:594-659,1580-1650,1711-1716,2298` |

### O que precisa acontecer antes de liberar para a turma (resumo da Fase 0, detalhada na §9)

1. Mapa que não fique em branco nem com spinner eterno: **token Mapbox válido, rotacionado e restrito por URL**, validado na abertura, com mensagem clara em pt-BR quando faltar ou for recusado, `map.on('error')`, timeout e ErrorBoundary. O "fundo liso" local só resolve rede bloqueada ou tiles indisponíveis, **não** token ausente ou inválido (no Mapbox v2 a autenticação desliga a renderização; ver C1). Se não houver como garantir o token no ambiente da turma, a migração para **MapLibre** (esforço M) entra na Fase 0 em vez da Fase 1 (§10.1).
2. Salvamento automático em IndexedDB com "Retomar trabalho".
3. Malha IBGE simplificada e dados de exemplo embutidos, e desenho de qualquer GeoJSON mesmo sem CSV.
4. Uma única função de classificação: limiares sem repetição, classe "Sem dados", leitura de número pt-BR, e a mesma saída para mapa, legenda, Estúdio e HTML.
5. Escala gráfica calculada (`largura = distância / metros-por-pixel`) em tela, PNG e HTML.
6. Estúdio herda a visualização e a legenda do mapa principal, com prévia do tamanho da tela e exportação com pixelRatio controlado.
7. Shell mobile mínimo: busca que não cobre os menus, Pointer Events no Estúdio, botões "Concluir/Desfazer/Cancelar" no desenho, download via `navigator.share` com revogação adiada.

Sem os itens 1–5 o professor recebe trabalhos com mapas errados. Sem os itens 6–7 os alunos no celular não conseguem entregar.

---

## 2. Propósito e escopo do módulo de mapas

O módulo de mapas deve permitir que o aluno:

1. **Carregue dados municipais**: CSV de municípios (atributos), CSV de indicadores (formato longo: código, indicador, ano, valor) e malha GeoJSON unida pelo código IBGE.
2. **Produza um mapa temático**: coroplético por atributo ou indicador, com filtros por região, UF e capital.
3. **Estilize e anote**: mapa base, opacidade, modo preenchido/borda, legenda editável, pontos, linhas e polígonos numerados, medições de distância e área.
4. **Componha uma prancha** no Estúdio de Exportação: título, subtítulo, norte, escala, legenda de cores, legenda de anotações, grade de coordenadas, textos e formas livres, várias páginas.
5. **Exporte** a prancha em PNG ou JPEG (HD, 2K, 4K ou personalizado) ou como HTML interativo, e **salve ou carregue um "perfil"** em JSON com todo o projeto.

Fica fora do escopo atual: PDF, papel/DPI, mapa de localização, símbolos proporcionais, rótulos de feições, projeções alternativas e camadas genéricas (bairros, pontos por latitude/longitude).

---

## 3. Como funciona hoje — fluxo ponta a ponta

```mermaid
flowchart TD
  A[data/municipios.csv ?raw<br/>1 município] --> DC[DataContext<br/>csvData / filteredCsvData]
  B[data/indicadores.csv ?raw<br/>0 linhas] --> DC
  U1[Importar CSV ';' Papa.parse<br/>DataContext.jsx:95-217] --> DC
  U2[Importar GeoJSON + modal CD_MUN<br/>App.jsx:67-91 / DataContext.jsx:219-280] --> DC
  DC --> LMD[MapContext.loadMapData 122-358<br/>join por CD_MUN exato<br/>polígono + ponto por município]
  VM[VisualizationMenu<br/>atributo/indicador/filtros] -->|visualizationConfig| LMD
  LMD --> CS[colorUtils.getColorScale<br/>5 quantis Reds / Category10]
  CS --> SRC[(fonte 'sectors'<br/>fill + line + circle)]
  LEG[Legend.jsx<br/>recalcula a escala por conta própria] -. diverge .- CS
  AN[AnnotationContext<br/>click/dblclick] --> ANL[(annotations-source ~13 camadas)]
  GR[gratícula por zoomend<br/>MapContext 884-1025] --> MAP
  SRC --> MAP[mapboxgl.Map principal<br/>outdoors-v12, token VITE_MAPBOX_TOKEN]
  ANL --> MAP
  MAP -->|getStyle() clonado| ST[ImageExportStudio<br/>2º mapa = preview no tamanho da saída]
  ST -->|applyPreviewVisualization<br/>recalcula cor, ignora legenda| ST
  ST --> OV[canvas 2D: título, norte,<br/>escala 340 px fixa, legendas, formas]
  ST -->|handleExport| HID[3º mapa oculto targetW×targetH×DPR<br/>idle + 2 s]
  HID --> PNG[canvas → toBlob → a.download<br/>revoke imediato]
  MAP --> HTML[FilterMenu → exportMap.js<br/>HTML com token embutido]
  DC & AN & ST --> PERF[Salvar Perfil JSON manual<br/>FilterMenu.jsx:96-143]
```

**Passo a passo, com arquivos:**

1. **Inicialização.**
   - `main.jsx` monta `DataProvider → UIProvider → AnnotationProvider → MapProvider` (`App.jsx:319-331`).
   - O ambiente inicial é o catálogo `dataSourceInfo` (`UIContext.jsx:13`). Mesmo assim o contêiner do mapa fica sempre montado e escondido com `display:none` (`App.jsx:176`), e o `Map` é criado imediatamente (`MapContext.jsx:51-99`) com `preserveDrawingBuffer:true`, sem `projection` e sem handler de erro.
2. **Dados.**
   - Os CSVs embutidos são lidos com `?raw` e um split manual (`DataContext.jsx:5-6,33-54`).
   - As importações usam Papa com `';'` fixo, sem conversão de tipos e sem declarar encoding (`DataContext.jsx:116-119,170-175`).
   - O GeoJSON é lido com `FileReader` + `JSON.parse` na thread principal (`App.jsx:74-88`). O campo-código escolhido é copiado para `CD_MUN` (`DataContext.jsx:236-249`).
3. **Mapa temático.** `loadMapData` (`MapContext.jsx:122-358`):
   - indexa o CSV filtrado;
   - só desenha feições com par no CSV (159-165);
   - gera **também** um ponto para todo município (190, 196-229);
   - busca indicadores com `find` linear (179-180);
   - calcula a cor com `getColorScale` (242);
   - aplica cores da legenda por posição (248-272);
   - chama `setData` e `fitBounds` a cada mudança (233-238, 275).
4. **Estilização.**
   - O `VisualizationMenu` escolhe atributo ou indicador, modo, opacidade, mapa base e camadas (`VisualizationMenu.jsx:45-102,369-488`).
   - Trocar o mapa base chama `setStyle` (`MapContext.jsx:111-119`). As camadas próprias só são recriadas se `isStyleLoaded()` for verdadeiro (`MapContext.jsx:125,463,934`), o que depende de timing. Na execução real, as anotações sumiram e o coroplético voltou (ver A13).
5. **Anotações.**
   - Clique adiciona vértice; **duplo clique** conclui (`AnnotationContext.jsx:64-169`, `MapContext.jsx:383-420`).
   - As medidas são calculadas por Haversine ou área esférica (`geoUtils.js`) e desenhadas em cerca de 13 camadas (`MapContext.jsx:462-876`).
6. **Estúdio.**
   - Abre pelo botão 📷 de 30×30 px (`App.jsx:258-270`).
   - Clona o estilo do mapa num 2º mapa do tamanho da saída (`ImageExportStudio.jsx:1575-1627, 2298`) e desenha as sobreposições em canvas (`drawOverlays` 564-591).
   - Arrasto por `DragHandle` só com mouse (594-659).
   - As páginas ficam em `UIContext.exportPages`, só em memória.
7. **Exportação.**
   - **PNG/JPEG** (`ImageExportStudio.jsx:1678-1720`): cria um 3º mapa oculto, espera `idle` + 2 s, usa `drawImage` e as sobreposições, gera `toBlob` e faz `<a download>` fora do DOM com `revokeObjectURL` imediato.
   - **HTML** (`FilterMenu.jsx:289-343` → `utils/exportMap.js`): gera um template string com CDN do Mapbox, token em texto puro e GeoJSON lido de `source._data`.
8. **Persistência.** Só existe o "Salvar/Carregar Perfil" manual (`FilterMenu.jsx:96-223`). Ao montar, `AnnotationContext` **apaga** o `localStorage` legado (6-13).

---

## 4. Inventário de elementos

Legenda: ✅ ok · 🟡 parcial · 🔴 quebrado · ⚪ ausente

### 4.1 Motor do mapa

| Elemento | Como funciona hoje | Como deveria funcionar | Status |
|---|---|---|---|
| Inicialização / token / erros (`MapContext.jsx:40-99`) | Sem token, só dá `console.warn`, e o construtor lança exceção, deixando o app em branco. Sem `on('error')`, timeout nem checagem de WebGL. CSS vem do CDN (`index.html:9`). | Detectar token, rede e WebGL; mensagem clara e botão "tentar novamente"; fundo liso de reserva (no Mapbox v2 só ajuda com rede bloqueada; sem token exige MapLibre); CSS empacotado. | 🔴 |
| Mapa base (`MapContext.jsx:20`; `VisualizationMenu.jsx:461-467`) | 5 estilos Mapbox. O padrão é o topográfico `outdoors-v12`. Não há opção "sem mapa base". | Padrão neutro (cinza claro), opção "fundo liso" e mapas base abertos sem token. | 🟡 |
| Projeção (`MapContext.jsx:56-62`) | Nenhuma definida; os estilos v12 podem ativar *globe* em zoom baixo (não verificado, rede bloqueada). | Projeção explícita, com Mercator e Albers para o Brasil como opções. | ⚪ |
| Recriação após troca de estilo (`MapContext.jsx:111-119,125,463,934`) | Coroplético, anotações e gratícula abortam se `isStyleLoaded()` for falso, e não tentam de novo. Em execução, as anotações sumiram e o coroplético voltou (dependente de timing). | Função única `restoreCustomLayers()` em todo `style.load`/`idle`. | 🔴 |
| Junção dados × geometria (`MapContext.jsx:144-229`) | Igualdade exata de string. Feição sem linha no CSV é descartada sem aviso. | Geometria primeiro; chave normalizada (6/7 dígitos, `.0`); relatório de casados e não casados. | 🟡 |
| Camadas fill/line/circle (`MapContext.jsx:278-303`) | Contorno fixo `#000` de 1 px, sem `beforeId` (cobre os rótulos da base), pontos duplicados sobre os polígonos. | Contorno configurável, inserido abaixo dos rótulos, pontos opcionais. | 🟡 |
| Enquadramento (`MapContext.jsx:233-238`) | `fitBounds` a cada recarga, até ao mudar a cor da legenda. | Só na primeira carga ou num botão "Enquadrar dados". | 🟡 |
| Rótulos de municípios | Não existem. | Camada `symbol` configurável (nome/valor, halo, colisão). | ⚪ |
| Interação (`MapContext.jsx:305-318`) | Toque abre um painel de 45vh e o hit-test é de 1 px. Não há destaque nem tooltip. Durante o desenho, o toque também abre o painel. | Tooltip, `feature-state`, área de toque ±12 px, seleção desativada durante o desenho. | 🟡 |
| Desempenho (`MapContext.jsx:65-69,1043-1049`) | `setState` a cada frame de *move*; o `value` do contexto não é memoizado; o app inteiro re-renderiza. | Câmera fora do estado React; `setPaintProperty` para mudanças de simbologia. | 🟡 |

### 4.2 Classificação, paletas e legenda

| Elemento | Hoje | Deveria | Status |
|---|---|---|---|
| Classificação numérica (`colorUtils.js:29-55`) | Sempre 5 quantis por índice. Limiares repetidos produzem uma expressão `step` inválida. | Quantis, intervalos iguais, Jenks, manual; 3–9 classes; limiares validados; histograma. | 🔴 |
| Valores nulos (`colorUtils.js:52`, `MapContext.jsx:186,225`) | `to-number(null)` vira 0 e cai na 1ª classe. | Classe "Sem dados" em cinza ou hachura, com contagem na legenda. | 🔴 |
| Números pt-BR (`colorUtils.js:29,32`; `MapContext.jsx:182`) | `parseFloat('1.234,56')` dá 1.234; `'590,3'` sai preto no mapa. | Normalizar na importação e guardar como `Number`. | 🔴 |
| Paletas (`colorUtils.js:15-16,62-66`) | Reds fixa; Category10 e Turbo (ruins para daltônicos). | ColorBrewer/Viridis/Okabe-Ito, inverter, divergente. | ⚪ |
| Normalização / símbolos proporcionais | Não existem; `circle-radius: 6` fixo. | "Dividir por" área ou população; círculos proporcionais. | ⚪ |
| Legenda na tela (`Legend.jsx:39-106`) | Recalcula com conjunto de valores diferente do mapa; rótulos "a - b" ambíguos; título técnico. | Uma fonte única de verdade; formato "≥ a e < b"; unidade; nomes amigáveis. | 🔴 |
| Editor de legenda (`Legend.jsx:110-216`; `MapContext.jsx:248-272`) | Troca só as cores, por posição; os textos não mudam as quebras; adicionar ou remover itens desalinha as classes. | Editor de classes de verdade (quebras + cor + rótulo); categórico mapeado valor → cor. | 🔴 |
| Filtros (`VisualizationMenu.jsx:147-159`) | "Apenas Capitais" compara com `'true'`, mas os dados têm `'True'`. Aplicar um filtro zera a visualização (`UIContext.jsx:50-54`). | Booleanos normalizados; filtro separado da simbologia. | 🟡 |

### 4.3 Elementos cartográficos

| Elemento | Hoje | Deveria | Status |
|---|---|---|---|
| Norte na tela (`NorthArrow.jsx`) | 4 estilos, gira com o bearing, arrastável por toque (react-rnd); centro de rotação deslocado. | Idem, com `transform-origin` correto e tamanho ajustável. | ✅ |
| Norte no PNG (`ImageExportStudio.jsx:18-194`) | Correto, mas com tamanho fixo de 120 px e sobreposto ao título no layout padrão HD. | Tamanho ajustável e layout sem colisão. | 🟡 |
| Escala na tela (`ScaleBar.jsx:74-111`) | Fórmula correta (512 px), mas a largura é limitada a 180–400 px sem recalcular o rótulo (erro de até cerca de 20%). Arrasto só com mouse. | Escolher o passo que cabe, sem limitar; Pointer Events. | 🟡 |
| Escala no PNG (`ImageExportStudio.jsx:196`) | Barra sempre com 340 px. Barra representa +45% a +140% do rótulo (medido) e de −32% a +232% (simulado); ver A2. | `largura = passo / mpp`. | 🔴 |
| Escala no HTML (`exportMap.js:495`) | Constante de 256 px; erro sistemático de 2×. | 78271.5168 ou `ScaleControl` nativo. | 🔴 |
| Escala numérica 1:N | Não existe. | Calculada a partir do papel e do DPI. | ⚪ |
| Gratícula (`MapContext.jsx:884-1025`; Estúdio 1011-1043, 1468-1516) | Intervalo mínimo de 0,5° (some em escala municipal); rótulos "25.5° S" ao longo das linhas; código triplicado; não é recalculada no Estúdio. | Intervalos em graus-minutos-segundos, rótulos na moldura, recálculo a cada movimento. | 🟡 |
| Título/subtítulo (`ImageExportStudio.jsx:388-420`) | Uma linha só; alça de 500 px fixos; alinhamento só dentro da caixa. | Quebra automática; âncora na prancha. | 🟡 |
| Fonte / autor / data / datum | Não existem; "Web Mercator" fixo na escala. | Bloco técnico preenchido automaticamente (SIRGAS 2000). | ⚪ |
| Atribuição © Mapbox © OSM | `attributionControl:false` (1587, 1692) e nada desenhado. | Sempre desenhada na exportação. | ⚪ |
| Mapa de localização (inset) | Não existe. | Mini-mapa do Brasil ou da UF com retângulo da área. | ⚪ |
| Moldura e margens | Não existem; o mapa ocupa 100% da imagem. | Quadro do mapa com margens em mm. | ⚪ |

### 4.4 Anotações

| Elemento | Hoje | Deveria | Status |
|---|---|---|---|
| Ponto (`AnnotationContext.jsx:69-84`) | Funciona, inclusive no toque; número preto fixo. | Símbolos, rótulo no mapa, arrastar. | 🟡 |
| Linha / polígono / medições | Concluem só com `dblclick`. No toque, o duplo toque dá zoom e acrescenta vértices. | Botões Concluir/Desfazer; fechar o polígono tocando no 1º vértice. | 🔴 |
| Medida ao vivo (`AnnotationToolbar.jsx:32`) | Vazia: `cursorPosition` é array, mas é lido como objeto. | Corrigir; unidades km/ha/km². | 🔴 |
| Unidades (`geoUtils.js:60-71`) | Sempre m e m². | Automáticas. | 🟡 |
| Painel "Informações do Mapa" (`AnnotationLegend.jsx:87-181`) | Abre em x=280 (fora da tela no celular); os botões do cabeçalho não respondem ao toque. | Bottom sheet; `cancel` no Rnd. | 🔴 |
| Edição / desfazer | Inexistentes; excluir é imediato. | Edição de vértices; undo/redo. | ⚪ |
| Texto, seta e ícone georreferenciados | Não existem (só no Estúdio, em coordenadas de tela). | Ferramentas georreferenciadas. | ⚪ |
| Ordem das camadas | As anotações podem ficar por baixo do coroplético (sem `beforeId`). | Anotações sempre por cima. | 🟡 |

### 4.5 Estúdio (prancha, formatos, DPI)

| Elemento | Hoje | Deveria | Status |
|---|---|---|---|
| Prancha e resolução (`ImageExportStudio.jsx:11-15`) | HD/2K/4K/personalizado em px. Aumentar a resolução **amplia a área** e encolhe os elementos. Personalizado sem validação. | A4/A3/Carta, retrato/paisagem, margens em mm, DPI 96/150/300 com o mesmo layout. | 🔴 |
| Prévia (`2298`, `1580-1650`) | Mapa WebGL e canvas 2D do tamanho da saída × DPR. | Prévia do tamanho da tela e exportação com pixelRatio controlado. | 🔴 |
| Herança da visualização (`719, 1543, 1190-1280`) | Começa em `Sigla_Regiao`; ignora `legendConfigByKey`; `circle-color` nunca é atualizado. | WYSIWYG em relação ao mapa principal. | 🔴 |
| Filtros por página (`1206-1226`) | Só alteram as quebras, não escondem municípios. | `setFilter` ou "esmaecer os demais". | 🔴 |
| Arrastar / redimensionar (`594-659`) | Só com mouse; alça de 12 px. | Pointer Events, alças ≥ 44 px, campos X/Y. | 🔴 |
| Ordem de camadas (`843-854, 1951-1977`) | Funciona no desktop; botões de cerca de 9 px. | Botões maiores. | 🟡 |
| Texto livre (`1991`) | `<input>` de uma linha só. | `textarea` com altura automática. | 🟡 |
| Páginas (`895-1186`) | Só em memória; exporta uma de cada vez; autosave incompleto; renomear via `prompt()`. | Persistência; exportar todas em PDF/ZIP. | 🟡 |
| Desfazer/refazer | Não existe. | Histórico com botões. | ⚪ |
| Modelos de layout | Só as posições padrão, que colidem. | 3–5 modelos acadêmicos. | ⚪ |

### 4.6 Exportação

| Elemento | Hoje | Deveria | Status |
|---|---|---|---|
| PNG/JPEG (`1678-1720`) | Funciona no desktop. Sem limpeza em caso de erro. Nome fixo `mapa_export_WxH`. | `finally`, nome a partir do título, limite por dispositivo. | 🟡 |
| Download no celular (`1711-1716`) | `<a>` fora do DOM, `revokeObjectURL` imediato, sem `navigator.share`; mensagem de sucesso sempre exibida. | Web Share API; revogação adiada; alternativa "toque e segure". | 🔴 |
| PDF / SVG / todas as páginas | Não existem. | jsPDF A4/A3 com várias páginas. | ⚪ |
| HTML interativo (`exportMap.js`) | ReferenceError `labelData` (linha 540); escala 2×; token embutido; injeção via perfil; arrasto só com mouse. | Corrigir ou despriorizar. | 🔴 |

### 4.7 Dados e importação

| Elemento | Hoje | Deveria | Status |
|---|---|---|---|
| Dados embutidos (`DataContext.jsx:5-6,70`) | 1 município, 0 indicadores, geometria vazia. `municipios-geo.json` nunca é usado. | Malha IBGE simplificada + atributos básicos. | 🔴 |
| CSV (`DataContext.jsx:95-217`) | `';'` fixo; UTF-8 fixo; 9 colunas obrigatórias; concatena sem deduplicar; `alert()`. | Detectar separador e encoding; mapear colunas; relatório de importação. | 🟡 |
| GeoJSON (`App.jsx:67-91`) | Só FeatureCollection; parse na thread principal; sem CRS nem simplificação. | GeoJSON/TopoJSON/SHP/KML em Worker. | 🟡 |
| Formato longo/largo | Indicadores só no formato longo, com nomes exatos. | Assistente de mapeamento e unpivot. | 🔴 |

### 4.8 Projeto salvar/carregar

| Elemento | Hoje | Deveria | Status |
|---|---|---|---|
| Autosave | Não existe; o `localStorage` é apagado ao abrir. | IndexedDB + "Retomar". | ⚪ |
| Perfil manual (`FilterMenu.jsx:96-223`) | JSON completo com dados. Não inclui mapa base, câmera, filtros nem estilos do norte e da gratícula. Não valida o esquema. Ao carregar, ativa uma visualização vazia (`FilterMenu.jsx:199-204`). | Esquema versionado e validado; abrir modelo do professor por link. | 🟡 |

### 4.9 Mobile

| Elemento | Hoje | Deveria | Status |
|---|---|---|---|
| Shell (`MainLayout.css:4`, `Header.css`, `Footer.css`) | 100vh; header transborda (scrollWidth de 603 px); rodapé de 112 px; ícones Font Awesome nunca carregam. | 100dvh, safe-area, barra inferior de abas, sem rodapé no mapa. | 🔴 |
| Menus do mapa | Cobertos pela busca; painéis de 300 px fixos saem da tela. | Bottom sheets. | 🔴 |
| Tela inicial (`Sidebar.css:2`) | Sidebar de 260 px; o texto quebra letra a letra. | Abas horizontais ou drawer. | 🔴 |
| Estúdio | Barra lateral de 40vh; prévia de 350×197 px; nada se move com toque. | Prévia em tela cheia, bottom sheet com abas. | 🔴 |
| Voltar do Android | Sai do app (não há history). | Rotas por hash e popstate. | 🔴 |

---

## 5. Problemas verificados, por severidade

Achados repetidos entre auditores foram fundidos (entre parênteses, quantos auditores os levantaram). **[V]** indica que o achado passou por verificação adversarial. Esforço: **P** = horas até 1 dia · **M** = 2–5 dias · **G** = mais de 1 semana.

### 5.1 Crítico

**C1 · Sem token, com token inválido ou com rede bloqueada: tela branca ou spinner eterno, sem alternativa [V] (7 auditores)**
- **Arquivo:** `src/contexts/MapContext.jsx:20,40-74,111-119`; `App.jsx:185-196,259`; `index.html:9`; `main.jsx:6-10`.
- **Evidência:**
  - Sem token há só `console.warn` (41-46). Em seguida `new mapboxgl.Map` (56) lança de forma síncrona "An API access token is required" (`node_modules/mapbox-gl/src/util/mapbox.js:213-214`) dentro de um `useEffect`, sem ErrorBoundary. Como o contêiner fica sempre montado (`App.jsx:176`), o **app inteiro fica em branco**, inclusive o catálogo.
  - Com token inválido ou restrito, ou com `api.mapbox.com` bloqueado, `style.load` nunca dispara e o spinner fica para sempre.
  - Ferramentas, legendas e Estúdio dependem de `mapLoaded`.
  - Trocar o estilo faz `setMapLoaded(false)` sem recuperação (115).
  - Existe `.env.example`, mas não há `.env` e o README não cita o token.
  - **Um estilo local não contorna a falta de token no Mapbox GL v2.** Depois do `load`, `_authenticate` (`node_modules/mapbox-gl/src/ui/map.js:3431-3448`) chama `getMapSessionAPI`. Sem token, ele devolve `NO_ACCESS_TOKEN` direto (`src/util/mapbox.js:547-551`; constante na linha 42). Com token inválido, a resposta é 401. Nos dois casos o código chama `storeAuthState(gl,false)` e `gl.clear(...)`, e o painter para de renderizar (`if (!isMapAuthenticated(gl)) return`, `src/render/painter.js:529`). Resultado: mesmo com um estilo `{version:8,...}` sem nenhuma URL `mapbox://`, o canvas fica em branco. O estilo de reserva só ajuda quando a rede bloqueia `api.mapbox.com` **sem** devolver 401 (a chamada de sessão falha com erro de rede e não aciona o ramo acima), e mesmo esse caso precisa ser validado num teste.
- **Contradição resolvida:**
  - Um auditor falou em "spinner" e outro em "tela branca". Os dois estão certos, em cenários diferentes: token **ausente** gera tela branca; token **inválido ou rede bloqueada** gera spinner eterno.
  - O verificador de plataforma rebaixou este item para *high*, porque a correção é de configuração (pôr um token válido no deploy). Mantive **crítico**: um deploy sem token ou com token inválido bloqueia a turma toda, e hoje não há mensagem nenhuma que permita ao professor ou ao aluno entender o que houve.
- **Impacto:** um deploy mal configurado, uma rede escolar filtrada ou a cota esgotada impedem **toda** a turma de trabalhar, sem nenhuma mensagem.
- **Recomendação:**
  - garantir um token **válido, rotacionado e restrito por URL** no deploy (F0.3), e validá-lo antes de criar o mapa;
  - `try/catch`, `map.on('error')` (que recebe o `ErrorEvent` de autenticação disparado em `map.js:3444`) e timeout de 12 s, com mensagem em pt-BR ("mapa base indisponível: token ausente/recusado" ou "rede bloqueou o servidor de mapas");
  - estilo de reserva local (`{version:8,sources:{},layers:[{id:'bg',type:'background'}]}`) **apenas** para rede bloqueada ou tiles indisponíveis;
  - importar `mapbox-gl.css` no bundle;
  - para ambientes onde não se pode garantir o token, antecipar a migração para MapLibre (API quase idêntica, sem token; §10.1).
- **Esforço:** P (token + mensagem + reserva para rede) / M (MapLibre).

**C2 · No celular a busca cobre os dois botões de menu (Dados e Visualização) [V] (5 auditores, confirmado em execução)**
- **Arquivo:** `src/styles/CitySearch.css:2-10` (z-index 20, width 400px, max-width 90%) × `src/index.css:178-196` (z-index 10); irmãos em `App.jsx:177-183`.
- **Evidência:** em 360 px a busca vai de x=18 a x=342 e cobre 38 dos 40 px de cada botão. No Playwright, `elementFromPoint` no centro dos botões retorna `INPUT.city-search-input` e o toque não abre o menu. Capturas: `auditoria-capturas/iphone13-02-mapa.png`, `auditoria-capturas/android-02-mapa.png`.
- **Contradição resolvida:** um verificador rebaixou para *high* porque em paisagem (≥ 512 px) o problema some. Mantive **crítico** porque, em retrato, todo o fluxo de dados, cor, desenho e salvamento fica inacessível, e o aluno não tem como saber que deve girar o aparelho.
- **Impacto:** no celular só é possível ver o mapa com 1 município e abrir o Estúdio.
- **Recomendação:** abaixo de 600 px, recolher a busca num ícone (ou `left:64px; right:64px; transform:none; width:auto`); em seguida, bottom sheets (Fase 1). Criar um teste Playwright com `elementFromPoint`.
- **Esforço:** P.

**C3 · Nenhuma persistência automática: recarregar a página, a aba ser descartada ou um erro de runtime apagam o trabalho [V] (8 auditores)**
- **Arquivo:** `src/contexts/AnnotationContext.jsx:6-17` (`localStorage.removeItem` ao montar; estado vazio); `UIContext.jsx:12-40` (`exportPages`, `legendConfigByKey` só em memória); `DataContext.jsx:63-70`; `main.jsx:6-10` (sem ErrorBoundary).
- **Evidência:**
  - Um grep em `src/` por `indexedDB|sessionStorage|beforeunload|visibilitychange` não encontra nada.
  - Em execução real, recarregar levou de 9 feições para 1 e de 9 anotações para 0, sem nenhum diálogo.
  - O único contorno é o "Salvar Perfil" manual, escondido no menu que a busca cobre (C2). No iOS ele cai no download de Blob e não guarda mapa base, câmera, filtros nem estilos do norte e da gratícula.
- **Contradição resolvida:** as severidades variaram (critical, high e medium, este último porque "existe perfil manual"). Mantive **crítico** pela régua ("perde trabalho"): o descarte de abas em segundo plano no iOS é rotineiro (basta abrir o WhatsApp ou o seletor de arquivos).
- **Impacto:** o aluno perde a aula inteira sem aviso.
- **Recomendação:**
  - autosave com debounce (~1 s) em IndexedDB (`idb-keyval`) do projeto completo (dados, simbologia, anotações, páginas, câmera);
  - "Retomar trabalho" ao abrir;
  - aviso em `beforeunload`;
  - ErrorBoundary com "Salvar projeto de emergência";
  - remover o `removeItem`.
- **Esforço:** M.

**C4 · Limiares de quantil repetidos geram uma expressão `step` inválida: o mapa não é colorido e o aluno não vê mensagem [V] (6 auditores)**
- **Arquivo:** `src/utils/colorUtils.js:42-55`; `MapContext.jsx:242,274-303,328-355`.
- **Evidência:**
  - `numericValues[Math.floor(n/k*i)]` não remove repetidos. Com 1 valor, os limiares ficam `[v,v,v,v]`; com `['1','2','3']`, ficam `[1,2,2,3]`.
  - O style-spec do mapbox-gl 2.15 retorna "must be arranged … in strictly ascending order".
  - `addLayer` rejeita a expressão; como a fonte já existe (274), a camada **nunca mais é criada**. Um `setPaintProperty` inválido mantém as cores antigas enquanto a legenda mostra "164 – 164" cinco vezes (`auditoria-capturas/desktop-02b-atributo-numerico-1-municipio.png`).
  - Só o Estúdio remove os repetidos (`ImageExportStudio.jsx:1227-1239`).
- **Impacto:** com o dado embutido (1 município), a falha acontece assim que se escolhe qualquer atributo numérico (o padrão `Sigla_Regiao`, `UIContext.jsx:11`, é categórico e usa `match`, então não falha). Recortes pequenos (microrregião) e variáveis com empates (zeros, contagens, índices) geram mapas vazios ou coloridos pela variável anterior.
- **Recomendação:**
  - deduplicar os limiares e reduzir `k` ao número de valores distintos;
  - validar a expressão antes de aplicar;
  - `map.on('error')` com aviso;
  - criar as camadas uma vez com cor neutra e aplicar a classificação por `setPaintProperty`;
  - testes Vitest para `getColorScale`.
- **Esforço:** P.

**C5 · O Estúdio aloca WebGL e canvas do tamanho da saída × devicePixelRatio, com 3 contextos simultâneos: provável falha no celular [V] (6 auditores)**
- **Arquivo:** `src/components/ImageExportStudio.jsx:2297-2298` (quadro com targetW×targetH em px CSS, reduzido só com `scale()`), `1580-1588` (mapa de preview com `preserveDrawingBuffer`), `1641-1650` (canvas 2D = w×dpr, `getContext` sem checar null em 1652-1654), `1687-1692` (3º mapa oculto), `1693/1712/1719` (vazamento no erro); `node_modules/mapbox-gl/src/ui/map.js:2960-2965` (DPR sem teto).
- **Evidência:**
  - iPhone com DPR 3 no preset padrão HD: 5760×3240 = 18,7 MP por canvas, acima do limite de área de canvas do iOS (16,7 MP). No 4K: 11520×6480 = 74,6 MP.
  - Medido em emulação: canvas de 5754×3234 (HD) e 11514×6474 (4K).
  - No catch, no timeout e com blob nulo, o mapa oculto e o div nunca são removidos.
- **Contradição resolvida:** 3 auditores deram *critical* e 3 deram *high* porque não houve teste em aparelho real (no Chromium emulado os PNGs foram gerados). Classifiquei como **crítico provável**: o preset padrão já excede o limite documentado do iOS, e a falha de `getContext('2d')` sem ErrorBoundary derruba o app (A29; e, sem autosave, o trabalho se perde: C3). **Confirmar num iPhone real é a primeira tarefa da Fase 0.**
- **Impacto:** aba recarregando (perdendo tudo), sobreposições em branco ou exportação vazia no iPhone.
- **Recomendação:**
  - prévia no tamanho da tela, com os elementos escalados (as posições já são frações);
  - exportar com `window.devicePixelRatio` sobrescrito temporariamente (ou `pixelRatio` no MapLibre) = alvo/CSS, limitado por `gl.MAX_RENDERBUFFER_SIZE` e por 16 MP no iOS;
  - no overlay, `dpr = min(dpr, sqrt(16.7e6/(w*h)))`;
  - destruir o preview antes de exportar e fazer a limpeza em `finally`.
- **Esforço:** M.

### 5.2 Alto

**A1 · Sem malha nem dados embutidos; GeoJSON importado só aparece se houver linha num CSV de 9 colunas [V] (9 auditores)**
- **Arquivo:** `DataContext.jsx:5-6,10-20,70`; `MapContext.jsx:129-136,159-165`; `DataContext.jsx:274-276` (alert enganoso).
- **Evidência:**
  - `municipios.csv` tem 1 linha, `indicadores.csv` só o cabeçalho, `municipios.geojson` tem 1 byte, e `municipios-geo.json` (4 polígonos, 3 fictícios) nunca é importado.
  - Em execução real, importar o GeoJSON mostrou "4 novos adicionados", mas o mapa continuou com 0 polígonos.
  - Além disso, as propriedades do GeoJSON não aparecem como variáveis (`VisualizationMenu.jsx:183-184`).
- **Impacto:** nenhum mapa temático pode ser feito "de fábrica". No celular, o preparo dos dados é inviável.
- **Recomendação:**
  - `/public` com a malha IBGE 2022 simplificada (mapshaper ~2–5%, TopoJSON por UF) e CSV base (código, nome, UF, região, população do Censo 2022, área, capital);
  - modelo "geometria primeiro": toda feição desenhada, "Sem dados" em cinza, propriedades do GeoJSON como variáveis;
  - relatório "N desenhadas / M com dados / K sem par".
- **Contorno já disponível (sem código):** o perfil JSON carrega municípios, indicadores e geometrias de uma vez (`FilterMenu.jsx:160-176`; o salvamento grava `municipios` e `geometrias` em `FilterMenu.jsx:98-103`). O professor pode preparar **um único perfil `.json`** (recorte da UF ou região; linhas de município com `Codigo_Municipio` idêntico ao `CD_MUN` das feições, pois a junção é por igualdade de string em `MapContext.jsx:144,161-163`; GeoJSON simplificado no mapshaper) e distribuí-lo; os alunos usam "Carregar Perfil". Cuidados: manter o arquivo pequeno para o celular (alvo de poucos MB); o carregamento não valida o esquema (M19); e, se o perfil trouxer anotações, o bug A27 (visualização vazia ativa) precisa ser corrigido antes ou o professor deve distribuir o perfil **sem** anotações.
- **Esforço:** M (contorno por perfil: P, trabalho do professor).

**A2 · Escala gráfica do PNG com comprimento fixo de 340 px [V] (7 auditores)**
- **Arquivo:** `ImageExportStudio.jsx:196,423,581,1661,1704`.
- **Evidência:** `bW = w*0.85`, independente de `best/mpp`.
  - **Métrica única usada neste relatório:** erro = (distância real representada pela barra ÷ distância do rótulo) − 1. Positivo = a barra cobre mais terreno do que o rótulo diz.
  - **Medido em execução:** zoom 5,12 → +45%; zoom 15 → +47%; zoom 3,39 → +140% (rótulo de 1.000 km para 2.399 km reais). Exportações em `auditoria-capturas/desktop-mapa_export_1920x1080.png` e `auditoria-capturas/iphone13-F-mapa_export_1920x1080.png`.
  - **Simulado** (mesma fórmula de `ImageExportStudio.jsx:196`, lat −3° a −33°, zoom 3 a 18): de cerca de −32% (zoom 16, lat −33°) a +232% (zoom 3, lat −3°); +221% em zoom 3 com lat −15°; −18% em zoom 6 com lat −10°.
- **Contradição resolvida:** os intervalos citados pelos auditores (−20% a +221%, −31% a −58%, −41% a +70%) misturavam duas convenções de sinal (rótulo/real − 1 e real/rótulo − 1) e casos medidos e simulados. Recalculei tudo na métrica acima. Todos derivam do mesmo defeito.
- **Impacto:** toda imagem exportada traz uma escala falsa, num elemento obrigatório do mapa.
- **Recomendação:** `barPx = best/mpp`, escolhendo `best` para caber na largura; STEPS até 5.000 km; um util `scale.js` único, com teste, usado na tela, no PNG e no HTML.
- **Esforço:** P.

**A3 · HTML exportado: escala com constante de 256 px (2× errada) [V] (5 auditores)**
- **Arquivo:** `utils/exportMap.js:495` (`156543.03392`), em contraste com `ScaleBar.jsx:79-80` (78271.5168). O commit 2c635d5 corrigiu só a tela e o PNG.
- **Recomendação:** usar o util único ou `mapboxgl.ScaleControl`. **Esforço:** P.

**A4 · HTML exportado não desenha nenhuma anotação (ReferenceError `labelData`) [V] (5 auditores)**
- **Arquivo:** `utils/exportMap.js:540`, a única ocorrência de `labelData` no repositório. As camadas 541-548 nunca são criadas, mas o painel "Informações" lista os itens.
- **Recomendação:** remover a linha e criar um teste que gere o HTML e o execute com mock ou Playwright. **Esforço:** P.

**A5 · Municípios sem dado pintados como a classe mais baixa; não existe classe "Sem dados" [V] (7 auditores)**
- **Arquivo:** `colorUtils.js:50-55`; `MapContext.jsx:186,225,241`; `Legend.jsx:84-101`; `ImageExportStudio.jsx:1261-1276`.
- **Evidência:** `to-number(null)` = 0 (`mapbox-gl-unminified.js:4485-4487`). O ramo categórico usa `#ccc`, mas sem item na legenda.
- **Impacto:** falta de dado aparece como "pior valor", o que é um erro conceitual grave.
- **Recomendação:** `['case',['==',['typeof',['get',a]],'number'], <step>, '#d9d9d9']`; item "Sem dados (n)" na legenda e na exportação. **Esforço:** P.

**A6 · Vírgula decimal e ponto de milhar lidos errado [V] (5 auditores)**
- **Arquivo:** `colorUtils.js:29,32,52`; `MapContext.jsx:170-172,182-183`; `Legend.jsx:63`; `DataContext.jsx:116-119,170-175`; `ETL/ETLProcessor.jsx:115-116` (o próprio ETL exporta com vírgula).
- **Evidência:** `parseFloat('1.234,56')` = 1.234. No modo atributo, `'590,3'` faz `to-number` falhar e o polígono sai **preto**. `parseCoord` (150-154) já trata vírgula, mas só nas coordenadas.
- **Recomendação:** um `parseNumberBR` único, aplicado na importação, que guarda `Number` e informa as células inválidas. **Esforço:** P.

**A7 · Uma célula vazia ou `'-'` transforma a variável numérica em categórica só no mapa [V] (3 auditores)**
- **Arquivo:** `MapContext.jsx:241` (filtra só null/undefined); `colorUtils.js:27-29,59-83`; `Legend.jsx:67-70`; `DataContext.jsx:123-125`.
- **Impacto:** o mapa fica com dezenas de cores Turbo e a legenda com 5 classes vermelhas. Os valores decimais em `match` provavelmente também são inválidos no Mapbox (não verificado).
- **Recomendação:** tipar as colunas na importação e tratar `'' '-' '...' 'X'` como ausentes. **Esforço:** P.

**A8 · Legenda e mapa classificam conjuntos diferentes [V] (4 auditores)**
- **Arquivo:** `Legend.jsx:57-70`; `MapContext.jsx:129,144,189-190,196-229,241`; `FilterMenu.jsx:228-284`.
- **Evidência:**
  - A legenda do indicador usa **todos** os registros, sem filtro de UF.
  - O mapa conta duas vezes os municípios com polígono, porque eles também viram ponto (o `csvDataMap.delete` está comentado).
  - O HTML repete a lógica da legenda.
- **Recomendação:** calcular `{método, quebras, cores, rótulos, contagens}` uma vez, publicar no contexto e fazer legenda, Estúdio e HTML apenas lerem esse objeto. **Esforço:** M.

**A9 · "Editar legenda" troca só cores por posição; os textos não alteram as classes [V] (3 auditores)**
- **Arquivo:** `MapContext.jsx:245-272`; `Legend.jsx:116,128-137`; `colorUtils.js:3-11` (a chave ignora filtros).
- **Recomendação:** editor de classes (quebras manuais com cor e rótulo); mapeamento valor → cor no categórico. **Esforço:** M.

**A10 · O Estúdio não herda a visualização do mapa principal e descarta a legenda personalizada [V] (6 auditores; confirmado em execução)**
- **Arquivo:** `ImageExportStudio.jsx:719` (padrão `'Sigla_Regiao'`), `1535-1548` (a página 1 é criada sem `loadPage`), `1604-1624`, `1221-1225`, `1242-1253` (não atualiza `circle-color`), `1276-1278` (sobrescreve a legenda do DOM). No arquivo não há referência a `legendConfigByKey` nem a `visualizationConfig`.
- **Evidência em execução:** polígonos coloridos por Sigla_Regiao, pontos por População, legenda "Atributo: Sigla_Regiao" (`auditoria-capturas/iphone13-F-mapa_export_1920x1080.png`).
- **Recomendação:** inicializar a página a partir de `visualizationConfig`, `filteredCsvData` e `legendConfigByKey`; aplicar a mesma expressão a fill, line e circle; usar a fonte única do A8. **Esforço:** M.

**A11 · Modo "Por Indicador" do Estúdio pinta com o valor do indicador do mapa principal [V] (3 auditores)**
- **Arquivo:** `ImageExportStudio.jsx:1215-1225,1277`; `MapContext.jsx:176-187`.
- **Evidência:** as quebras vêm do indicador escolhido no Estúdio, mas as cores usam `visualization_value` do mapa principal (ou null). Com o ano vazio, o título fica "Indicador ()" e as cores são por atributo.
- **Recomendação:** `setData` da fonte do preview com o valor recalculado, ou `feature-state`; bloquear a aplicação sem ano. **Esforço:** M.

**A12 · Filtros do Estúdio não filtram, só alteram as quebras [V] (4 auditores)**
- **Arquivo:** `ImageExportStudio.jsx:1206-1226,1242-1253`. Um grep por `setFilter` em `src` não retorna nada.
- **Evidência em execução:** Região=N deu 10 feições antes e depois; as demais ficaram em `#ccc`.
- **Recomendação:** `setFilter` nas camadas `sectors-*` ou a opção explícita "esmaecer os demais" com item na legenda. **Esforço:** P.

**A13 · Trocar o mapa base apaga as anotações (e provavelmente a gratícula); o coroplético depende de timing (guarda `isStyleLoaded()` sem nova tentativa) [V] (4 auditores; anotações perdidas confirmadas em execução)**
- **Arquivo:** `MapContext.jsx:111-119,125,463,934`; `node_modules/mapbox-gl/src/style/style.js:427-442`. Em contraste, o Estúdio já usa `once('style.load')+idle` (`ImageExportStudio.jsx:1081-1098`).
- **Evidência:**
  - **Confirmado em execução** (`SP/result-extra.json`, bloco `trocaEstilo`): depois de trocar para "Escuro", `annotations-source` ficou null e `annotations-fill-layer` sumiu; o Estúdio abriu com 0 camadas de anotação.
  - **O coroplético voltou no teste:** as camadas `sectors-fill/line/point-layer` e as 9 feições estavam presentes depois da troca. Como `loadMapData` aborta se `isStyleLoaded()` for falso (`MapContext.jsx:125`), o resultado depende de timing e pode falhar em rede lenta (inferência, não reproduzida).
  - **Gratícula:** pela leitura do código (`MapContext.jsx:934`, mesma guarda) provavelmente some; não reproduzido.
- **Recomendação:** `restoreCustomLayers()` idempotente em `style.load` → `idle`, com ordem fixa: base < coroplético < contornos < rótulos < anotações. **Esforço:** P.

**A14 · Estúdio: reabrir ou trocar o estilo perde setas e rótulos de medida; "Rótulos" oculta as medidas [V] (5 auditores)**
- **Arquivo:** `ImageExportStudio.jsx:678` (`OWN_LAYERS` incompleta), `1066-1090`, `1374-1409`, `1617` (compara uma URL com o *nome* do estilo, o que é sempre verdadeiro e força a recarga a cada reabertura), `670`; `VisualizationMenu.jsx:57,67-72`.
- **Recomendação:** identificar camadas próprias por prefixo (`annotations-`, `sectors-`, `graticule-`); comparar URL com URL. **Esforço:** P.

**A15 · No toque não dá para concluir linha, polígono ou medição [V] (6 auditores; confirmado em execução)**
- **Arquivo:** `MapContext.jsx:394-400,402-406,410`; `AnnotationContext.jsx:86-90,96-169`; `AnnotationToolbar.jsx:52-81`; `styles/AnnotationToolbar.css:127` (`nowrap`); `node_modules/mapbox-gl/src/ui/handler/tap_zoom.js:45-62`.
- **Evidência em execução (360×740):** 3 toques, depois duplo toque: o contador foi para "4 vértices", houve zoom e o polígono não fechou. A faixa cresceu para 463 px e o ✕ ficou fora da tela (`auditoria-capturas/iphone13-F-05b-anotacao-medida.png`).
- **Recomendação:** botões ≥ 44 px "Concluir / Desfazer ponto / Cancelar"; fechar o polígono ao tocar a < 20 px do 1º vértice; `map.doubleClickZoom.disable()` durante o desenho; texto que quebra linha. **Esforço:** P/M.

**A16 · Tocar no mapa durante o desenho abre o painel da cidade (45vh) a cada vértice [V]**
- **Arquivo:** `MapContext.jsx:309-317` (não consulta `drawingModeRef`), `433-459` (bloqueio ineficaz); `styles/CityInfoBottomBar.css:3-10`.
- **Recomendação:** `if (drawingModeRef.current) return;` no handler da camada. **Esforço:** P.

**A17 · No Estúdio, arrastar e redimensionar só funciona com mouse [V] (7 auditores; confirmado em execução)**
- **Arquivo:** `ImageExportStudio.jsx:594-659` (`onMouseDown` em 641 e 649; alça de 12 px), `1338-1349` (pan com botão do meio ou Ctrl), `1674-1675` (a posição só muda arrastando); `ScaleBar.jsx:35-68,148`; `Graticule.jsx:12-46`; `exportMap.js:451-473`.
- **Evidência em execução:** um arrasto por toque (CDP) deixou o título em 2%/2%; com mouse ele foi para 15,7%/21,5% (`auditoria-capturas/iphone13-07c-estudio-apos-arrastar.png`).
- **Correção de evidência:** Legend, NorthArrow e AnnotationLegend do mapa ao vivo usam react-rnd e **aceitam** toque. O problema está no Estúdio, na ScaleBar, na Graticule e no HTML.
- **Recomendação:** Pointer Events + `setPointerCapture` + `touch-action:none`; alças ≥ 44 px de tela (dividir pelo `viewZoom`); campos X/Y e âncoras de canto. **Esforço:** M.

**A18 · Layout padrão do Estúdio já sai com defeito: norte sobre o título (HD) e legendas cortadas em retrato [V]**
- **Arquivo:** `ImageExportStudio.jsx:760-764` (repetido em 1156 e 1547), `399`, `18-35`, `607-608` (limite de 0,95 sem considerar a largura do elemento).
- **Evidência:** cerca de 31 px de sobreposição em HD. Em retrato com 1080 px, a legenda vai até 1165 px e a legenda de anotações até 1204 px. Captura: `auditoria-capturas/android-07-estudio.png`.
- **Recomendação:** posicionar por âncora e margem a partir do tamanho real; limitar a `1 − w/W`; avisar sobre colisão ou corte antes de exportar. **Esforço:** P.

**A19 · Download frágil no iOS e em navegadores embutidos [V] (8 auditores)**
- **Arquivo:** `ImageExportStudio.jsx:1711-1716`: `<a>` fora do DOM, `click()` e `revokeObjectURL` no mesmo tick, depois de `idle + 2 s` (fora do gesto do usuário). A mensagem de sucesso aparece sempre.
- **Contraste:** `FilterMenu.jsx:137-141,339-341` já faz do jeito certo (anexa o link e revoga depois de 3–5 s).
- **Contradição resolvida:** um verificador rebaixou para *medium* por não haver prova de falha. Mantive **alto** porque este é o único caminho de entrega do trabalho e o risco no WebKit é conhecido.
- **Recomendação:** depois de gerar o blob, mostrar um modal com a imagem e os botões "Compartilhar/Salvar" (`navigator.canShare({files})` → `navigator.share`) e "Baixar" (anexar ao DOM e revogar em 60 s), com a dica "toque e segure". Detectar navegadores embutidos (WhatsApp, Instagram, Facebook; por exemplo, `/Instagram|FBAN|FBAV|WhatsApp/` no `navigator.userAgent`), onde download e seletor de arquivos costumam falhar, e mostrar "Abra este link no Safari/Chrome" com botão para copiar o endereço. **Esforço:** P.

**A20 · Sidebar fixa de 260 px torna ilegíveis Início, Indicadores e ETL no celular [V] (3 auditores)**
- **Arquivo:** `styles/Sidebar.css:1-9`. Captura: `auditoria-capturas/iphone13-01-inicio.png` (texto "Be / vi / ao / Si").
- **Recomendação:** `@media (max-width:768px)` com coluna e abas horizontais. **Esforço:** P.

**A21 · Legenda e editor de legenda inacessíveis no celular [V]**
- **Arquivo:** `Legend.jsx:146-156,196-215`; `MainLayout.css:1-16` (100vh + overflow hidden); `Footer.jsx:8`. Capturas: `auditoria-capturas/iphone13-04b-visualizacao-aplicada.png` e `auditoria-capturas/iphone13-F-04d-editor-legenda.png` (só aparece "Título").
- **Recomendação:** editor em bottom sheet; esconder o rodapé no ambiente Mapa; usar 100dvh. **Esforço:** M.

**A22 · Botões do cabeçalho do painel de anotações não respondem ao toque; depois do 💾 o aluno fica preso no modo visualização [V]**
- **Arquivo:** `AnnotationLegend.jsx:68,87-108,167-181`; `node_modules/react-draggable/build/cjs/DraggableCore.js:105` (`preventDefault` no touchstart dentro do handle).
- **Recomendação:** `cancel=".annotation-legend-header-actions, button, input, select"` no `<Rnd>`; não forçar o modo visualização ao salvar. **Esforço:** P.

**A23 · Barra de desenho e painel de anotações não cabem em 360–414 px; alvos minúsculos; inputs < 16 px disparam zoom no iOS [V]**
- **Arquivo:** `styles/AnnotationToolbar.css:3-8,115-160`; `AnnotationLegend.jsx:88,168` (default `x:280`); `styles/AnnotationLegend.css:70-80,289-435`.
- **Recomendação:** bottom sheet; inputs ≥ 16 px; botões ≥ 44 px. **Esforço:** M.

**A24 · Arquivos em Latin-1/Windows-1252 (Excel pt-BR, DATASUS) corrompem nomes; o worker ETL força latin1 [V]**
- **Arquivo:** `DataContext.jsx:116-119,170-174`; `public/etlWorker.js:39`.
- **Correção de evidência:** `App.jsx:88` (JSON lido como UTF-8) está correto e não é defeito.
- **Recomendação:** ler como ArrayBuffer, tentar `TextDecoder('utf-8',{fatal:true})` e, se falhar, `windows-1252`. **Esforço:** P.

**A25 · Reimportar um arquivo corrigido não atualiza o indicador (concatena; `find` pega o registro antigo) [V]**
- **Arquivo:** `DataContext.jsx:133,149,193-194`; `MapContext.jsx:178-180`. Não existe botão de limpar.
- **Recomendação:** conjuntos nomeados com substituir/atualizar (upsert por código+indicador+ano); índice em Map. **Esforço:** M.

**A26 · Tabelas rígidas: indicadores só no formato longo com nomes exatos; municípios com 9 colunas obrigatórias; sem mapeamento de colunas [V]**
- **Arquivo:** `DataContext.jsx:10-20,116-125,177-191`.
- **Recomendação:** assistente de mapeamento de colunas, formato largo com unpivot automático, só a chave obrigatória. **Esforço:** M.

**A27 · Ao carregar um perfil, as anotações salvas não aparecem (visualização vazia duplicada fica ativa) [V]**
- **Arquivo:** `FilterMenu.jsx:86-88` (`createVisualization` + `startDrawing` com closure antiga criam 2 visualizações), `199-204` (ativa a primeira, que está vazia); `AnnotationContext.jsx:39-54`.
- **Recomendação:** remover a criação duplicada; ativar a visualização que tem anotações. **Esforço:** P.

**A28 · Botão ou gesto Voltar do Android sai do app [V]**
- **Arquivo:** `UIContext.jsx:13,39`; `Header.jsx:24`; `DataSourceInfo.jsx:61` (define um hash que nada escuta).
- **Recomendação:** rotas por hash e `pushState` ao abrir o Estúdio ou uma sheet, com `popstate` para fechar. **Esforço:** P.

**A29 · Nenhum ErrorBoundary: qualquer exceção em efeito derruba o app [V]**
- **Arquivo:** `main.jsx:6-10`. Gatilhos confirmados: token ausente (C1); `ctx.roundRect` sem verificação em Safari < 16 (`ImageExportStudio.jsx:196,245,314,404`).
- **Recomendação:** ErrorBoundary global e por ambiente, em pt-BR, com "salvar projeto de emergência". **Esforço:** P.

**A30 · Shell sem responsividade: header transborda, 100vh e inputs < 16 px [V]**
- **Arquivo:** `MainLayout.css:4-6`; `Header.css:3-53` (scrollWidth de 603 px medido); `ImageStudio.css:169-199`; `index.html:7`.
- **Recomendação:** 100dvh + safe-area; barra de abas inferior; inputs de 16 px. **Esforço:** M.

### 5.3 Médio

Achados relevantes que têm contorno. Os que passaram por verificação estão marcados com [V]. Os demais foram apontados por um único auditor.

| # | Título | Arquivo:linha | Recomendação | Esf. |
|---|---|---|---|---|
| M1 [V] | Aplicar filtros zera a visualização (indicador, modo, opacidade) e o menu mostra o contrário | `UIContext.jsx:50-54`; `App.jsx:62-65`; `VisualizationMenu.jsx:28-43` | Separar filtro de simbologia e sincronizar o menu com o estado global | P |
| M2 [V] | `fitBounds` a cada recarga desfaz o enquadramento (mudar cor, opacidade ou estilo) | `MapContext.jsx:233-238,358,361-365` | Enquadrar só na 1ª carga ou quando o recorte mudar; botão "Enquadrar dados"; bbox das geometrias | P |
| M3 [V] | Projeção não definida; rótulo fixo "Web Mercator"; *globe* possível em zoom baixo (não verificado, rede bloqueada) | `MapContext.jsx:56-62`; `ScaleBar.jsx:80,187`; `ImageExportStudio.jsx:196,1582`; `exportMap.js:430` | `projection:'mercator'` explícita; rótulo a partir de `getProjection()`; Albers como opção | M |
| M4 [V] | Estado de câmera a cada frame re-renderiza a árvore | `MapContext.jsx:65-69,99,1043-1049`; `App.jsx:36-42` | Câmera fora do React; `useMemo` no value; `React.memo` | P |
| M5 [V] | Busca de indicadores O(N×M) e `setData` completo a cada ajuste de estilo | `MapContext.jsx:179-180,218-219,275,358` | Índice `Map` por `cod\|ind\|ano`; simbologia via `setPaintProperty` | P |
| M6 [V] | Só mapeia municípios casados com o CSV; propriedades do GeoJSON não viram variáveis; `LEVEL` fixo "Municípios" | `MapContext.jsx:159-175`; `VisualizationMenu.jsx:183-184` | Modo "camada livre" | G |
| M7 [V] | Sem método, número de classes e paleta; Category10/Turbo inadequados | `colorUtils.js:15-21,42-44,62-66` | Painel de simbologia (ver §8) | M |
| M8 [V] | "2K/4K" amplia a área em vez da nitidez; não há papel nem DPI | `ImageExportStudio.jsx:11-15,423,1298-1301,1661,1685,1704` | Layout em mm + DPI; pixelRatio = DPI/96; sobreposições com `scale=k` | M |
| M9 [V] | `ctx.roundRect` sem fallback derruba o app em iOS 15 | `ImageExportStudio.jsx:196,245,314,404` | Helper com `arcTo` + ErrorBoundary | P |
| M10 [V] | Menus flutuantes de 300 px saem da tela e ficam atrás da rosa dos ventos e dos botões 🌐/📷 | `FilterMenu.css:27-44`; `VisualizationMenu.css:27-44`; `NorthArrow.jsx:31-49` | Bottom sheet; camadas de z-index explícitas | P |
| M11 [V] | Tela inicial é o catálogo; os cards "Mapa Interativo" e "ETL" não levam a lugar nenhum | `DataSourceInfo.jsx:57,61`; `UIContext.jsx:13` | Tela "Criar novo mapa" | M |
| M12 [V] | Gratícula invisível em escala municipal; rótulos decimais; código triplicado | `MapContext.jsx:886-916`; `ImageExportStudio.jsx:1011-1036,1469-1516` | Intervalos em graus-minutos-segundos para o bbox visível; util único | M |
| M13 [V] | Token do Mapbox em texto puro em todo HTML exportado; token `pk` hardcoded no histórico git (commit f8cdf91) | `exportMap.js:427`; `FilterMenu.jsx:314` | **Rotacionar o token agora**; restringir por URL; HTML sem token (MapLibre) | P |
| M14 [V] | mapbox-gl v2 é proprietário e cobra por carga; o app cria 1 mapa por visita + 1 por abertura do Estúdio + 1 por PNG | `package.json:16`; `App.jsx:176`; `ImageExportStudio.jsx:1580,1692` | Migrar para MapLibre (§10) | M |
| M15 [V] | CSV separado por vírgula (Google Sheets) é rejeitado sem explicação | `DataContext.jsx:118,172` | `delimitersToGuess` + prévia | P |
| M16 [V] | Junção sem normalização (6↔7 dígitos, `.0`, espaços) e sem relatório | `MapContext.jsx:144,162-164`; `DataContext.jsx:240-242` | Normalizar chaves; tela "casou/não casou" | M |
| M17 [V] | Documentação "Formatos de Importação" contradiz o importador (o exemplo oficial é rejeitado) | `DataSourceInfo.jsx:211,278-297` vs `DataContext.jsx:10-20` | Gerar a documentação a partir do esquema; planilhas-modelo | P |
| M18 [V] | Filtro de capital compara com `'true'` (os dados têm `'True'`) | `VisualizationMenu.jsx:150-151`; `ImageExportStudio.jsx:1208`; `MapContext.jsx:171,210` | Normalizar booleanos | P |
| M19 [V] | Perfil não reproduz o mapa (sem mapa base, câmera, filtros, estilos) e mostra "sucesso" sem validar | `FilterMenu.jsx:96-214` | Esquema versionado e completo, com validação (zod) | M |
| M20 [V] | Formatos limitados: sem TopoJSON, SHP, KML, XLSX; o modal não lê chaves de arrays | `App.jsx:70`; `DataContext.jsx:227-234`; `UIContext.jsx:73` | Importador universal em Worker | M |
| M21 [V] | Faltam texto, seta e ícones georreferenciados | `AnnotationToolbar.jsx:6-12` | Ferramentas georreferenciadas | G |
| M22 [V] | Sem desfazer/refazer nem editar vértices; excluir é imediato | `AnnotationContext.jsx:171-200`; `AnnotationLegend.jsx:231` | Histórico; confirmação | M |
| M23 [V] | Painel "Informações do Mapa" abre fora da tela (x=280) | `AnnotationLegend.jsx:88,168` | Posição relativa; bottom sheet | P |
| M24 [V] | Mapa de localização (inset) inexistente | `ImageExportStudio.jsx:771,785-790` | Elemento automático com malha de UFs | M |
| M25 | Listeners de camada duplicados a cada `setStyle` | `MapContext.jsx:305-318` | Registrar uma vez | P |
| M26 | Trocar o mapa base desmonta legenda, norte, escala e Estúdio (perde posição) | `App.jsx:190-196` | Flag separada só para as camadas | P |
| M27 | Pontos desenhados sobre todo polígono e duplicados na classificação | `MapContext.jsx:190,196-229,293-303` | Ponto só quando não houver polígono | P |
| M28 | Contorno fixo `#000` e `line-offset` com sentido imprevisível (anéis com orientação mista) | `MapContext.jsx:281,338,348` | Contorno configurável; `turf.rewind` | P |
| M29 | Opacidade 0,6 sobre base topográfica; amostras da legenda opacas | `MapContext.jsx:20,324`; `Legend.jsx:185` | Base neutra; opacidade 0,85–1 | P |
| M30 | Sem `beforeId`: coroplético cobre os rótulos da base e às vezes as anotações | `MapContext.jsx:278`, `650-873` | Ordem fixa com `moveLayer` | P |
| M31 | Rotação e inclinação acidentais no toque; escala e norte ignoram o pitch | `MapContext.jsx:56`; `ImageExportStudio.jsx:1589,1683` | `dragRotate/touchPitch:false`; botão "Norte para cima" | P |
| M32 | Cores categóricas mudam conforme o filtro | `colorUtils.js:58-73` | Mapeamento estável valor → cor | P |
| M33 | Seleção por toque de 1 px; sem tooltip nem destaque | `MapContext.jsx:307-311` | bbox ±12 px; `feature-state` | P |
| M34 | 100vh / 80vh / 45vh sem dvh nem safe-area | `MainLayout.css:4`; `CityInfoBottomBar.css:10` | 100dvh + `env(safe-area-inset-*)` | P |
| M35 | Medida ao vivo vazia (`cursorPosition` array × objeto) | `AnnotationToolbar.jsx:32`; `MapContext.jsx:404` | `cursorPosition[0]/[1]` | P |
| M36 | GeoJSON grande: várias cópias, parse na thread principal, limite de 50 MB | `App.jsx:74-88`; `ImageExportStudio.jsx:1579` | Worker, simplificação, `maxzoom`/`tolerance` | M |
| M37 | Sem mapa base neutro; visão inicial em Foz do Iguaçu com zoom 12 | `MapContext.jsx:14-20` | "Em branco"/"Cinza"; abrir no Brasil | P |
| M38 | Não há rótulos de municípios | `MapContext.jsx:278-303` | Camada `symbol` | M |
| M39 | Só coroplético: sem símbolos proporcionais nem normalização | `MapContext.jsx:293-297`; `VisualizationMenu.jsx:403-407` | "Dividir por"; círculos ∝ √valor; alerta sobre contagens | M |
| M40 | Guarda `isStyleLoaded()` no Estúdio descarta mudanças enquanto os tiles carregam | `ImageExportStudio.jsx:1436,1453,1194,1292` | Checar `getLayer`; aplicar em `idle` | P |
| M41 | Autosave de página incompleto; excluir página descarta a atual | `ImageExportStudio.jsx:909-927,1165-1186` | Reducer único; confirmação | P |
| M42 | `currentPageIdx` fora do intervalo após carregar perfil: edições nunca salvas | `ImageExportStudio.jsx:1118,1533` | Limitar o índice | P |
| M43 | Trava `isLoadingPageRef` pode ficar presa sem `error` nem timeout | `ImageExportStudio.jsx:937,1081-1107` | Timeout de 10 s + `pm.on('error')` | P |
| M44 | Vazamento do mapa oculto em erro ou timeout | `ImageExportStudio.jsx:1693,1712,1719` | `try/finally` | P |
| M45 | Norte, escala e legenda sem redimensionar nem ajustar tipografia | `ImageExportStudio.jsx:423,1982,2322` | Modelo comum `{x,y,w,h,fontSize}` | M |
| M46 | Modo preenchido sem limites visíveis (outline = cor do preenchimento) | `ImageExportStudio.jsx:1247` | Contorno configurável | P |
| M47 | Legenda do Estúdio sem "Sem dados"; faixas ambíguas; títulos técnicos; Nome_Municipio gera milhares de itens | `ImageExportStudio.jsx:1261-1277,2224` | Rótulos amigáveis; "Outros" | P |
| M48 | PNG sem atribuição © Mapbox © OpenStreetMap | `ImageExportStudio.jsx:1587,1692` | Desenhar sempre | P |
| M49 | Arrasto re-renderiza 2.383 linhas e redesenha o canvas inteiro | `ImageExportStudio.jsx:607-608,1672` | `transform` durante o arrasto; rAF | M |
| M50 | Sem pan nem pinça no workspace do Estúdio; controles do Mapbox com 5 px | `ImageExportStudio.jsx:1320-1350,1589` | Pointer Events; modos "mapa"/"layout" | M |
| M51 | Alvos de toque minúsculos no Estúdio e no mapa (15 de 16 elementos < 44 px em 360 px) | `ImageStudio.css:935-951`; `App.jsx:205-264` | `@media (pointer:coarse)` ≥ 44 px | P |
| M52 | Resolução personalizada sem validação (0, NaN, 50000) | `ImageExportStudio.jsx:1779-1781` | Limitar no blur; limite de área por dispositivo | P |
| M53 | Sem desfazer/refazer no Estúdio | `ImageExportStudio.jsx:793-854` | Histórico | M |
| M54 | Faltam fonte, autor, data e datum; texto livre de uma linha | `ImageExportStudio.jsx:786-791,1991` | Bloco de créditos automático | P |
| M55 | Só PNG/JPEG da página atual; sem PDF; nome genérico | `ImageExportStudio.jsx:1714,1796-1799` | jsPDF sob demanda; ZIP; nome a partir do título | M |
| M56 | Escala da tela limitada a 180–400 px sem recalcular o rótulo | `ScaleBar.jsx:103` | Escolher o passo que caiba | P |
| M57 | Escala numérica 1:N inexistente | — | Calcular a partir de papel e DPI | M |
| M58 | Amostras da legenda não representam o símbolo (modo borda, pontos) | `Legend.jsx:185` | Amostra fiel | P |
| M59 | Rótulos da gratícula ao longo das linhas, sem moldura | `MapContext.jsx:968-977` | Graus-minutos-segundos na moldura | M |
| M60 | HTML exportado: anotações sempre pretas e com espessura fixa | `exportMap.js:32,541-542` | Levar o estilo às `properties` | P |
| M61 | HTML exportado inutilizável no celular e offline | `exportMap.js:205-207,395,452-473` | Priorizar PNG/PDF | M |
| M62 | Injeção de HTML/JS no HTML exportado a partir de perfil malicioso | `exportMap.js:103,119,133,524,529,430` | Validar e escapar; dados via JSON seguro | P |
| M63 | Quatro implementações de legenda e três de escala/norte (causa raiz das divergências) | `FilterMenu.jsx:228-284`; `Legend.jsx`; `ImageExportStudio.jsx:1213-1278` | Módulo `src/cartography/` | M |
| M64 | Rótulos de medida em todas as linhas e polígonos, não só nas medições | `MapContext.jsx:536-590`; `UIContext.jsx:38` | Só em `isMeasurement` | P |
| M65 | Modo visualização com ferramenta ativa gera "desenho fantasma" | `AnnotationLegend.jsx:179`; `AnnotationToolbar.jsx:26` | `cancelDrawing()` ao entrar | P |
| M66 | Sem importação/exportação de GeoJSON, KML ou CSV das anotações | `FilterMenu.jsx:96` | Adicionar | M |
| M67 | Legenda de anotações lista item a item, sem categorias | `AnnotationLegend.jsx:118` | Categorias | M |
| M68 | Editor de dados nunca recebe dados; CityEditor não é usado | `App.jsx:278`; `ETLEnvironment.jsx:175-182` | Tabela de atributos real | M |
| M69 | "ETL de Municípios" é simulação que anuncia sucesso | `ETLEnvironment.jsx:33-47` | Remover | P |
| M70 | Worker ETL baixa xlsx@0.18.5 (CVE-2023-30533) e PapaParse do unpkg; caminho absoluto | `public/etlWorker.js:8-9,39`; `ETLProcessor.jsx:28` | Empacotar; SheetJS ≥ 0.19.3 | P |
| M71 | Seletores de arquivo criados fora do DOM com `accept` só por extensão (iOS pode desabilitar `.geojson`; não verificado) | `App.jsx:68-70`; `DataContext.jsx:96-99` | `<input>` real; MIME types | P |
| M72 | Modal de geometria sem autodetecção de campo nem checagem de CRS (UTM "some") | `UIContext.jsx:73`; `DataContext.jsx:274-276` | Detectar 7 dígitos e bbox | P |
| M73 | Validação e mensagens pobres (`alert`); rejeições sem motivo | `DataContext.jsx:122-147,187-191` | Relatório de importação | P |
| M74 | Rodapé ocupa ~15% da tela e expõe o e-mail pessoal | `Footer.css:2-12`; `Footer.jsx:10-14` | Esconder no mapa e no celular | P |
| M75 | Interface depende de hover e `title` | `ScaleBar.css:39-45`; `NorthArrow.css:57-64`; `App.jsx:204-266` | Rótulos visíveis; `@media (hover:hover)` | P |
| M76 | Barra do município: abas escondidas; fechar com 21×19 px | `CityInfoBottomBar.css:3-109` | Bottom sheet | P |
| M77 | Bundle único de 2 MB (578 kB gzip); Recharts carregado para 2 abas | `App.jsx:1-18` | `React.lazy` (inicial ≈ 365 kB gz) | P |
| M78 | CSVs embutidos no JS via `?raw` com parser ingênuo | `DataContext.jsx:5-6,33-54` | `/public` + fetch + Worker | P |
| M79 | Gratícula gera cerca de 127 mil vértices do mundo a cada `zoomend` | `MapContext.jsx:884-916,1010-1025` | Só o bbox visível | P |
| M80 | `preserveDrawingBuffer` permanente e cópias profundas do estilo com GeoJSON | `MapContext.jsx:61`; `ImageExportStudio.jsx:1579,1587` | Só no mapa de exportação | P |
| M81 | ✅ Resolvido (Vite 5.4, sem `fs.allow`). Vite 4 sem suporte, 16 vulnerabilidades (9 altas, de build) e `server.fs.allow ['..']` | `vite.config.js:9-12`; `package.json` | Vite atual; não servir a turma pelo `dev` | P |
| M82 | Sem testes, lint ou CI | `package.json:10` | Vitest + Playwright + Actions | M |
| M83 | Nada preparado para deploy (README sem token, caminhos absolutos, `public/etl.html` quebrado, `public/index.html` antigo) | `README.md:62-84`; `Header.jsx:15`; `ETLProcessor.jsx:28` | Vercel/Netlify; `BASE_URL` | P |
| M84 | Acessibilidade básica (lang="en", poucos aria, divs clicáveis) | `index.html:2`; `App.jsx:199-304` | lang pt-BR; `<button>`; `<dialog>` | M |
| M85 | Sem modelos de layout nem moldura | `ImageExportStudio.jsx:760-764,1696-1698` | 3–5 modelos acadêmicos | M |
| M86 | Filtro "Apenas Capitais" no Estúdio, e filtros do Estúdio no modo indicador, ignorados | `ImageExportStudio.jsx:1208,1217-1220` | Coberto por A12/M18 | P |
| M87 | Cabeçalho transborda e ícones Font Awesome nunca carregam | `Header.jsx:5-36` | SVG embutidos; menu | P |
| M88 | Painel de visualização no celular extravasa e é sobreposto pelo norte e pela busca | `VisualizationMenu.jsx:305,510` | Bottom sheet | M |
| M89 | Anotações por baixo do coroplético (ordem confirmada em execução) | `MapContext.jsx:653` | Coberto por M30 | P |

### 5.4 Baixo (polimento)

- NavigationControl do Mapbox coberto pelo botão de Visualização no desktop (`MapContext.jsx:75`; `index.css:188-196`). Mover para `bottom-right`.
- Ocultar "Rótulos" da base também esconde as medições (`VisualizationMenu.jsx:67`).
- Distâncias e áreas sempre em m e m² (`geoUtils.js:60-71`). Usar unidade automática em pt-BR.
- Gratícula em decimal com ponto (`MapContext.jsx:901`); fonte "DIN Pro Regular Italic" provavelmente inexistente (`MapContext.jsx:927`, não verificado).
- Contêiner do Mapbox recebe filhos React, o que gera aviso (`App.jsx:184`).
- Código morto, logs em caminho quente, `map.remove()` nunca chamado, efeito de criação com dependências `[lng,lat,zoom]` (`MapContext.jsx:78-99,123,147,231`).
- Glifo "⬡" no rótulo de área provavelmente ausente das fontes (`MapContext.jsx:586`, não verificado).
- Recarga desnecessária do estilo e `setTimeout` fixos no Estúdio (`ImageExportStudio.jsx:1590,1617-1624`).
- Título: alinhamento só dentro da caixa, sem quebra de linha, alça de 500 px (`ImageExportStudio.jsx:398-418,2306`).
- Texto do Estúdio de uma linha com altura de 40 px (`ImageExportStudio.jsx:467,787,1991`).
- Alças de arrasto fora da ordem de `elementsStack`; pontas de seta deslocadas 7 px (`ImageExportStudio.jsx:643,2324,2334`).
- Efeitos colaterais dentro de updaters de estado; ids por `Date.now()` (`ImageExportStudio.jsx:794,809-819`; `DataContext.jsx:195,274`).
- Estilo do norte e da gratícula global, não por página; `incMeasurements` não é serializado (`ImageExportStudio.jsx:695,915,1821-1928`).
- Pontos de município ligados por padrão no Estúdio (`ImageExportStudio.jsx:747`).
- Estilo por URL personalizada sem tratamento de erro (`ImageExportStudio.jsx:2155-2165`).
- Fontes do canvas sem `document.fonts.ready`; pesos e itálico ausentes (`ImageExportStudio.jsx:1701`).
- Sobreposições redesenhadas só em `moveend` (`ImageExportStudio.jsx:1601`).
- "Exibir Medidas" só afeta a legenda (`ImageExportStudio.jsx:297,1867`).
- CSS duplicado, classes mortas e `html2canvas`/`@turf/turf` declarados sem uso (`ImageStudio.css:596-662`; `package.json`).
- Estúdio no bundle inicial (`App.jsx:10`).
- Seta de norte gira em torno do ponto errado (`NorthArrow.jsx:83`).
- Rótulos da escala com ponto decimal (`ScaleBar.jsx:139`).
- Mensagem "(Escala de cores dinâmica)" aparece quando não há dados (`Legend.jsx:181`).
- HTML embute `_data` completo, com duplicatas (`FilterMenu.jsx:302`); estilo do norte não é passado ao HTML (`FilterMenu.jsx:307`).
- Símbolo do ponto na legenda diferente do mapa; número preto de baixo contraste (`MapContext.jsx:480,741`).
- Cor padrão branca das anotações (`AnnotationContext.jsx:25`); `borderLeftColor` sempre preto por precedência de operadores (`AnnotationLegend.jsx:217`).
- Prévia de medida com rótulos no vértice inicial (`MapContext.jsx:609`); `mousemove` re-renderiza a árvore (`AnnotationContext.jsx:243`).
- Numeração compartilhada entre linhas e medições (`AnnotationContext.jsx:115`); polígono com menos de 3 vértices sai do modo sem aviso (`AnnotationContext.jsx:138`).
- Perfil malformado derruba o app (`FilterMenu.jsx:193`); widgets do HTML só arrastam com mouse (`exportMap.js:455`).
- Seletores de cor ocultos de 16–18 px (`AnnotationLegend.css:338`); legenda de medições com emoji e espessura limitada (`AnnotationLegend.jsx:20,149`).
- Excluir a visualização ativa esconde o painel (`AnnotationLegend.jsx:66`); abrir o Estúdio durante um desenho leva a prévia para a imagem (`ImageExportStudio.jsx:1579`).
- Ferramentas de desenho escondidas 3 níveis dentro do menu hambúrguer; nome "Linha Livre" enganoso (`FilterMenu.jsx:364-402`).
- Busca de cidade sem normalizar acentos e sem tratar vírgula nas coordenadas (`CitySearch.jsx:17-31`).
- Links mortos na tela inicial (`DataSourceInfo.jsx:56-61`); importar municípios zera o filtro; Nome_Municipio oferecido como variável de cor (`DataContext.jsx:195`; `VisualizationMenu.jsx:176-180`).
- Clique-fora baseado em `mousedown` (`App.jsx:168`); escala cobre a atribuição do Mapbox (`ScaleBar.css:3-7`).
- `lang="en"`, CSS do CDN, sem manifest (`index.html:2-12`); favicon de 281 kB; sem PWA.
- Idioma misto ("Fit", "Viewport") e nome de arquivo que troca acentos por `_` (`ImageExportStudio.jsx:2287-2291`; `FilterMenu.jsx:325`).
- Enquadramento inicial deslocado (fitBounds antes do resize, `MapContext.jsx:101-109`); avisos recorrentes no console (`MapContext.jsx:606-680`).
- README declara MIT sem arquivo LICENSE, dependendo de SDK proprietário (`README.md:3`).
- Pitch liberado no preview invalida a escala (`ImageExportStudio.jsx:1683`); estilo padrão "Exterior" poluído (`MapContext.jsx:20`); exportação só da página atual.

### 5.5 Contagem (após deduplicação)

| Severidade | Quantidade |
|---|---|
| Crítico | 5 (todos [V]) |
| Alto | 30 (todos [V]) |
| Médio | 89 (24 [V]: M1–M24; os demais sem verificação adversarial registrada, embora alguns, como M29 e M44, também apareçam em achados de outros auditores) |
| Baixo | ~45 itens de polimento |

---

## 6. Auditoria mobile (360–430 px, toque, iOS/Android)

### 6.1 Observado em execução real

Playwright + Chromium (SwiftShader) em três perfis: iPhone 13 (390×844, DPR 3, toque), Android pequeno (360×800, DPR 2, toque) e desktop 1440×900. O Mapbox foi substituído por um estilo stub, porque a rede bloqueia `api.mapbox.com`.

| Etapa | Resultado no celular | Captura |
|---|---|---|
| Tela inicial | Sidebar de 260 px; texto quebrado letra a letra; header com scrollWidth de 603 px; "ETL" e "Configurações" fora da tela; ícones Font Awesome vazios | `auditoria-capturas/iphone13-01-inicio.png`, `auditoria-capturas/android-01-inicio.png` |
| Mapa | Busca por cima dos dois menus e do zoom (`elementFromPoint` = INPUT); **o fluxo real parou aqui** | `auditoria-capturas/iphone13-02-mapa.png`, `auditoria-capturas/android-02-mapa.png` |
| Menu Visualização (clique forçado por JS) | Painel em x=−6, com 640 px de altura para 1476 px de conteúdo; coberto pela busca e pela rosa dos ventos | `auditoria-capturas/android-F-04-menu-visualizacao.png` |
| Legenda / editor | Legenda atrás da escala e do rodapé; do editor só aparece "Título" | `auditoria-capturas/iphone13-04b-visualizacao-aplicada.png`, `auditoria-capturas/iphone13-F-04d-editor-legenda.png` |
| Medir distância | Duplo toque não conclui ("2 vértices"); ✕ fora da tela; painel de anotações com botões em x=489–520 | `auditoria-capturas/iphone13-F-05b-anotacao-medida.png` |
| Estúdio | Barra lateral limitada a 40vh (337 px para 1049 px de conteúdo); prévia de 350×197 px (18%); NavigationControl de 5×5 px | `auditoria-capturas/iphone13-07-estudio.png`, `auditoria-capturas/android-07-estudio.png` |
| Arrastar título | Não move com toque (2%/2%); no desktop move | `auditoria-capturas/iphone13-07c-estudio-apos-arrastar.png`, `auditoria-capturas/android-07c-estudio-apos-arrastar.png` |
| Exportar | PNG 1920×1080 e 3840×2160 gerados no Chromium emulado (8–10 s no 4K); norte sobre o título; legenda "Sigla_Regiao" com pontos por população | `auditoria-capturas/iphone13-F-mapa_export_1920x1080.png`, `auditoria-capturas/android-4k-mapa_export_3840x2160.png` |
| Canvas da prévia | 5754×3234 (HD) e 11514×6474 (4K) com DPR 3 | medido em execução |
| Recarregar | Tudo perdido, sem aviso | — |

Os testes de desktop estão em `docs/auditoria-capturas/` (apenas as citadas foram versionadas). O preset 4K mostra quatro vezes a área (`auditoria-capturas/desktop-07e-estudio-4k.png`).

### 6.2 O que quebra (síntese)

- **Toque**
  - Desenho só conclui com `dblclick` (A15).
  - Nada se arrasta no Estúdio, na ScaleBar, na Graticule nem no HTML (A17).
  - Botões dentro do handle do react-rnd não respondem (A22).
  - Voltar do Android sai do app (A28).
  - `mousedown` usado como "clique fora".
- **Telas pequenas**
  - Busca cobre os menus (C2).
  - Sidebar de 260 px (A20).
  - Painéis de 300 px e posições iniciais fixas em px (M10, M23).
  - Rodapé de 112 px (M74).
  - `nowrap` na barra de desenho.
- **iOS**
  - 100vh esconde o rodapé e os controles (M34).
  - Inputs < 16 px disparam zoom (A23, A30).
  - `roundRect` inexistente no iOS 15 (M9).
  - Download de blob revogado imediatamente e sem `navigator.share` (A19); o arquivo vai para "Arquivos", não para "Fotos".
  - `.geojson` pode aparecer desabilitado no seletor (M71, não verificado).
- **Memória e canvas**
  - Prévia e exportação com tamanho de saída × DPR, 3 contextos WebGL e `preserveDrawingBuffer` (C5).
  - Vazamento em erro (M44).
  - GeoJSON grande em várias cópias (M36).
- **Rede**: Mapbox e CDNs de CSS e fontes; sem PWA (C1, M83).

**Não reproduzível aqui, precisa de aparelho físico:** comportamento real do Safari iOS com o download de blob, o limite de 16,7 MP e a perda de contexto WebGL, e o disparo de `dblclick` no toque. **Recomendo testar nos aparelhos da matriz abaixo antes de liberar.**

### 6.3 Matriz de testes e critérios de aceite

Aparelhos e navegadores mínimos:

| Aparelho | SO / navegador | Por que entra |
|---|---|---|
| iPhone antigo (SE 2ª geração, 8 ou similar) | iOS 15, Safari | sem `ctx.roundRect` (M9); pouca memória |
| iPhone recente (12–15) | iOS 16+ ou 17+, Safari | DPR 3; limite de canvas de 16,7 MP (C5) |
| Android intermediário (2–4 GB de RAM) | Android 11+, Chrome | caso mais comum na turma |
| Qualquer um dos anteriores | navegador embutido do WhatsApp e do Instagram | link recebido pelo grupo da turma; download e seletor de arquivos costumam falhar (A19) |
| Computador da escola | Chrome/Edge atuais, rede escolar | filtro de rede sobre `api.mapbox.com` (C1) |

Fluxos e critério de aceite (cada fluxo deve passar em todos os aparelhos acima, em retrato):

| Fluxo | Critério de aceite |
|---|---|
| Abrir o app | Mapa visível em até 10 s, ou mensagem clara em pt-BR (token, rede); nunca tela branca nem spinner eterno |
| Importar perfil do professor | Arquivo selecionável; municípios desenhados; contagem "N desenhados / M com dados" |
| Colorir por atributo numérico | Mapa colorido, legenda com as mesmas classes, "Sem dados" em cinza |
| Desenhar polígono | Concluir com botão; nenhum painel de cidade abre durante o desenho; medida em km² |
| Abrir o Estúdio | Prévia igual ao mapa principal (variável, cores, legenda); sem recarregar a aba |
| Mover o título com o dedo | Posição muda e é mantida ao trocar de página |
| Exportar HD | PNG 1920×1080 com escala correta (±5% do rótulo) e atribuição; sem travar a aba |
| Compartilhar/salvar | Imagem chega a Fotos (iOS) ou Galeria/Downloads (Android) pelo menu de compartilhar ou pelo "Baixar" |
| Recarregar e restaurar | Após recarregar (ou o iOS descartar a aba), "Retomar trabalho" traz dados, simbologia, anotações e páginas |
| Voltar do Android | Fecha a sheet ou o Estúdio, sem sair do app |

---

## 7. Correção cartográfica

### O que está certo
- **Metros por pixel na tela**: `78271.5168·cos(lat)/2^z` está correto para os tiles de 512 px (`ScaleBar.jsx:79-80`).
- **Medidas geodésicas**: Haversine e área esférica (Chamberlain–Duquette, R = 6.371.008,8 m) são adequadas para uso didático (`geoUtils.js:8-147`). A diferença para a área elipsoidal deve ficar abaixo de 0,5% (estimativa não verificada).
- **Norte**: gira com o bearing; em Web Mercator, o norte de quadrícula coincide com o norte verdadeiro. **Válido com pitch 0 e projeção Mercator; com pitch (inclinação, M31) ou em *globe* em zoom baixo (M3, não verificado), não.**
- **Gratícula**: as linhas estão na posição correta (retas em Mercator).
- **Legenda de anotações**: símbolos, espessura e tracejado são coerentes (com ressalvas menores).

### O que está errado
| Elemento | Erro | Ref. |
|---|---|---|
| Escala no PNG | Comprimento fixo; a barra representa de +45% a +140% do rótulo nos casos medidos e de −32% a +232% na simulação | A2 |
| Escala no HTML | 2× (constante de 256 px) | A3 |
| Escala na tela | Até cerca de 20% por limitar a largura; ignora o pitch; válida só na latitude do centro, sem aviso | M56, M31 |
| Escala numérica | Não existe | M57 |
| Projeção | Rótulo fixo "Web Mercator"; possível *globe* em zoom baixo (não verificado); sem opção de área equivalente | M3 |
| Classificação | Limiares repetidos invalidam o mapa; quantis fixos; primeira classe frequentemente vazia; faixas "a–b / b–c" ambíguas | C4, M7, M47 |
| Dados ausentes | Pintados como valor mínimo | A5 |
| Números pt-BR | Truncados ou pretos | A6 |
| Legenda × mapa | Conjuntos diferentes; edição por posição; o Estúdio ignora a personalização | A8, A9, A10 |
| Valores absolutos | Coroplético sem normalização nem símbolos proporcionais (erro clássico induzido pelo app) | M39 |
| Paletas | Category10/Turbo pouco acessíveis a daltônicos; sem divergente | M7 |
| Gratícula | Some em escala municipal; rótulos decimais com ponto; sem moldura | M12, M59 |
| Metadados | Sem fonte, autor, data, datum SIRGAS 2000 nem atribuição da base | M48, M54 |
| Pontos sobre polígonos | Poluem o mapa e entram em dobro nos quantis | M27 |
| Contorno em modo "borda" | O sentido do `line-offset` depende da orientação do anel | M28 |
| Limites municipais no Estúdio | No modo preenchido, o contorno recebe a mesma cor do preenchimento e os limites entre municípios da mesma classe desaparecem | M46 |
| Cores categóricas | Mudam conforme o filtro: a mesma região pode ter cores diferentes em dois mapas da mesma turma | M32 |
| Amostras da legenda | Opacas, enquanto o mapa usa opacidade 0,6 sobre base topográfica: as cores do mapa não batem com as da legenda | M29, M58 |
| Ordem das camadas | Anotações podem ficar abaixo do coroplético (confirmado em execução) | M30, M89 |
| Variável de nomes | `Nome_Municipio` é oferecido como variável de cor e gera milhares de classes | M47 |
| Escala em Mercator | Válida só na latitude do centro. Ao longo do Brasil (≈ 5°N a 33°S) o fator cos(lat) varia de 0,996 a 0,839, cerca de 16%; áreas visuais variam cerca de 30% (fator ao quadrado). Recomendar o aviso "escala válida na latitude central" na barra e, para mapas do Brasil inteiro, Albers (Fase 2) | M3, M56 |

---

## 8. Lacunas frente a uma ferramenta profissional (checklist)

| Recurso esperado | Status |
|---|---|
| Título / subtítulo com quebra de linha | 🟡 |
| Legenda fiel ao mapa, editável por classe, com "Sem dados" | 🔴 |
| Escala gráfica correta | 🔴 |
| Escala numérica 1:N | ⚪ |
| Norte | ✅ |
| Fonte / elaboração / data / projeção / datum | ⚪ |
| Grade de coordenadas em graus-minutos-segundos na moldura | 🟡 |
| Mapa de localização (inset) | ⚪ |
| Moldura e margens | ⚪ |
| Atribuição da base | ⚪ |
| Métodos de classificação (quantis, intervalos iguais, Jenks, manual) | ⚪ |
| 3–9 classes | ⚪ |
| Paletas ColorBrewer/Viridis, divergente, inversão, daltonismo | ⚪ |
| Normalização (densidade, per capita, %) | ⚪ |
| Símbolos proporcionais | ⚪ |
| Rótulos de feições | ⚪ |
| Projeção de área equivalente (Albers Brasil) | ⚪ |
| Papel A4/A3 + DPI | ⚪ |
| Exportação PDF, várias páginas | ⚪ |
| PNG/JPEG | 🟡 |
| Compartilhamento nativo no celular | ⚪ |
| Elementos livres (texto, formas, seta) | ✅ (texto de uma linha) |
| Ordem de camadas do layout | ✅ |
| Desfazer/refazer | ⚪ |
| Modelos de layout | ⚪ |
| Salvamento automático / projetos | ⚪ |
| Abrir modelo do professor | ⚪ |
| Dados de exemplo (IBGE) | ⚪ |
| Importar SHP/KML/TopoJSON/CSV lat-lon | ⚪ |
| Camadas genéricas | ⚪ |
| Desenho por toque com edição de vértices | 🔴 |
| Unidades automáticas (km, ha, km²) | 🟡 |
| Mapa base sem token / fundo liso | ⚪ |
| Checklist de elementos obrigatórios antes de exportar | ⚪ |
| Uso no celular | 🔴 |

---

## 9. Roteiro priorizado

### 9.0 Orientações provisórias para a turma (enquanto a Fase 0 não sai)

Regras que evitam os defeitos conhecidos. Cada uma contorna um achado:

1. **Use o computador para montar e exportar o mapa.** O celular serve só para consulta (C2, C5, A15, A17).
2. **Comece carregando o perfil `.json` preparado pelo professor** ("Carregar Perfil"), em vez de importar CSV e GeoJSON soltos (A1, B4).
3. **Salve o perfil com frequência** ("Salvar Perfil", a cada 10–15 min e antes de fechar a aba). Recarregar a página apaga tudo (C3).
4. **Escolha o mapa base antes de desenhar e não troque depois de anotar.** A troca apaga as anotações (A13, A14).
5. **Aplique o filtro (região/UF) antes de escolher a variável.** O filtro zera a visualização (M1). **Enquadre o mapa por último**, pois mudar cor ou opacidade refaz o enquadramento (M2).
6. **Nos CSVs, use ponto como separador decimal e não use separador de milhar** (A6). **Não deixe células vazias nem com "-"** numa coluna numérica; prefira remover a linha (A5, A7).
7. **Se o mapa não colorir, escolha outra variável ou um recorte maior.** Poucos municípios ou muitos valores iguais quebram a classificação (C4).
8. **No Estúdio, escolha de novo a variável e confira as cores e a legenda com o mapa principal** antes de exportar (A10, A11). Não use os filtros do Estúdio (A12).
9. **Exporte em HD (1920×1080).** 2K/4K só aumentam a área e encolhem os elementos (M8); 4K no celular pode travar a aba (C5).
10. **Não confie na escala gráfica exportada.** Até F0.6, substitua-a por uma frase como "escala aproximada" ou remova-a e informe a escala no texto (A2, A3).
11. **Abra o link no Safari ou no Chrome**, não dentro do WhatsApp ou do Instagram (A19).

### Fase 0-mínima — "Dá para usar na semana que vem" (≈ 2–3 dias úteis de 1 pessoa)

> **Status (implementado):** todas as tarefas F0m.1–F0m.11 foram feitas. F0m.1 foi resolvida pela migração para MapLibre (§10.1), sem token.
> - **Classificação** (`utils/colorUtils.js`): limiares sem repetição, com menos classes quando há poucos valores distintos; `parseNumberBR` com formato decidido por coluna (vírgula decimal, ponto de milhar, "-", vazio); cor e item de legenda "Sem dados (n)"; legendas da tela, do Estúdio e do HTML geradas por uma única função (`buildLegendItems`).
> - **Escala do PNG:** calculada pela distância real.
> - **Sem `labelData`** no HTML exportado.
> - **Desenho:** o toque durante o desenho não abre mais o painel da cidade, e os listeners das camadas são registrados uma única vez.
> - **Celular:** a busca abaixo de 600 px fica entre os botões de menu.
> - **Painel de anotações:** os botões respondem ao toque e a posição inicial cabe na tela.
> - **Exportação:** `try/finally` e mensagens de erro em português.
> - **Perfis:** sem visualização duplicada; o perfil salva e restaura a visualização ativa.
> - **Erros:** ErrorBoundary global.
> - **Extras:** polyfill de `roundRect` para Safari < 16 (A29); seta de norte fora da área do título por padrão.

Só tarefas P, de alto retorno e baixo risco, somadas às orientações da §9.0:

| # | Tarefa | Resolve | Onde |
|---|---|---|---|
| F0m.1 | Token Mapbox válido, rotacionado e restrito por URL no deploy; mensagem clara em pt-BR com `map.on('error')` + timeout quando faltar ou for recusado | C1, M13 | `MapContext.jsx:40-74`; painel Mapbox |
| F0m.2 | ErrorBoundary global | A29 | `main.jsx:6-10` |
| F0m.3 | Remover `labelData` | A4 | `exportMap.js:540` |
| F0m.4 | Escala correta (`barPx = best/mpp`) no PNG e constante 78271.5168 no HTML | A2, A3 | `ImageExportStudio.jsx:196`; `exportMap.js:495` |
| F0m.5 | Deduplicar limiares e reduzir `k`; `case` para nulos com cor "Sem dados"; `parseNumberBR` | C4, A5, A6 | `colorUtils.js:29-55`; `MapContext.jsx:182,241` |
| F0m.6 | `if (drawingModeRef.current) return;` no clique da camada | A16 | `MapContext.jsx:309-317` |
| F0m.7 | Busca recolhida em ícone abaixo de 600 px | C2 | `CitySearch.css:2-10` |
| F0m.8 | `cancel` no `<Rnd>` do painel de anotações | A22 | `AnnotationLegend.jsx:87-108` |
| F0m.9 | Download com `<a>` anexado ao DOM e revogação adiada (padrão de `FilterMenu.jsx:137-141`) | A19 | `ImageExportStudio.jsx:1711-1716` |
| F0m.10 | `try/finally` na exportação (remover mapa oculto e div) | M44, C5 | `ImageExportStudio.jsx:1687-1720` |
| F0m.11 | Corrigir a duplicação de visualização ao carregar perfil (para o perfil do professor funcionar com anotações) | A27 | `FilterMenu.jsx:86-88,199-204` |

O restante da Fase 0 (F0.4 autosave, F0.5 classificação única, F0.7 malha, F0.8 Estúdio WYSIWYG, F0.9 Estúdio no celular, F0.12 desenho por toque) fica na **Fase 0b**.

### Fase 0 — "Liberar para a turma" (≈ 15–25 dias úteis de 1 pessoa; F0.7 completo tende a G)

> **Status (implementado na Fase 0b):**
> - **F0.4 — salvamento automático:** IndexedDB com "Continuar de onde parou?".
> - **F0.5 — classificação única e segura:** `utils/colorUtils.js`.
> - **F0.6 — escala correta:** tela, PNG e HTML usam `utils/scale.js`.
> - **F0.7 — malha IBGE embutida:** `public/data/malhas/`, com "Mapa do Brasil" e "Juntar minha tabela".
> - **F0.8 — Estúdio herda a visualização:** cores, legenda e filtros reais.
> - **F0.9/F0.10 — Estúdio no celular:** arraste com o dedo, "Compartilhar/Salvar", nome do arquivo pelo título e aviso de navegador embutido.
> - **F0.11 — layout mobile:** cabeçalho, abas, 100dvh e rodapé.
> - **F0.12 — desenho por toque:** botões Concluir/Desfazer e fechar no 1º ponto.
> - **F0.13 — camadas recriadas a cada troca de mapa base.**
> - **F0.14 — itens concluídos:**
>   - bloco "Fonte / Elaboração / Data";
>   - atribuição do mapa base no PNG;
>   - booleanos de capital;
>   - `fitBounds` só quando os dados mudam.
> - **Pendentes:**
>   - F0.1: testar em aparelhos reais;
>   - F0.3: publicar (Vercel/Netlify);
>   - F0.15: teste automatizado no repositório/CI.

A estimativa anterior (5–8 dias) não fechava com a escala do próprio relatório: são 5 tarefas M (F0.4, F0.5, F0.7, F0.8, F0.9, de 2–5 dias cada, ou 10–25 dias) e 10 tarefas P. Por isso a Fase 0 foi dividida em Fase 0-mínima (acima) e Fase 0b (o restante da tabela abaixo).

Objetivo: o aluno faz um mapa temático **correto** e o entrega pelo computador e pelo celular, sem perder trabalho.

| # | Tarefa | Resolve | Arquivos | Esf. |
|---|---|---|---|---|
| F0.1 | Testar num iPhone e num Android reais o fluxo atual (confirmar C5 e A19) | C5, A19 | — | P |
| F0.2 | Robustez do mapa: validar o token; `try/catch`; `map.on('error')` + timeout, com mensagem que distingue token ausente/recusado de rede bloqueada; estilo de reserva "fundo liso" **só para rede bloqueada ou tiles indisponíveis** (no Mapbox v2, sem token ou com token inválido o canvas fica em branco mesmo com estilo local: `map.js:3431-3448`, `mapbox.js:547-551`, `painter.js:529`); importar `mapbox-gl.css`; ErrorBoundary global. Se o token não puder ser garantido, trocar por MapLibre já nesta fase (M) | C1, A29 | `MapContext.jsx:40-119`; `main.jsx`; `index.html:9`; `App.jsx:185-196` | P (M com MapLibre) |
| F0.3 | Rotacionar o token Mapbox (está no histórico git); restringir por URL; documentar `VITE_MAPBOX_TOKEN` no README; deploy estático (Vercel/Netlify) | M13, M83 | `README.md`, painel Mapbox | P |
| F0.4 | Autosave em IndexedDB (dados, simbologia, anotações, páginas, câmera) + "Retomar trabalho" + `beforeunload`; remover o `localStorage.removeItem` | C3 | `AnnotationContext.jsx:6-17`; `UIContext.jsx`; `DataContext.jsx`; novo `src/utils/projectStore.js` | M |
| F0.5 | Classificação única e segura em `src/cartography/classify.js`: `parseNumberBR`, vazios como "Sem dados", limiares sem repetição (reduzir `k`), `case` para nulos, item "Sem dados", saída `{quebras, cores, rótulos, expressão}` consumida pelo mapa, Legend, Estúdio e FilterMenu; testes Vitest | C4, A5, A6, A7, A8 | `colorUtils.js`; `MapContext.jsx:241-272`; `Legend.jsx:39-106`; `FilterMenu.jsx:228-284`; `ImageExportStudio.jsx:1190-1280` | M |
| F0.6 | Escala correta com util único `scale.js` (`barPx = best/mpp`) na tela, no PNG e no HTML | A2, A3, M56 | `ScaleBar.jsx:74-111`; `ImageExportStudio.jsx:196`; `exportMap.js:495` | P |
| F0.7 | Dados base: malha IBGE **Malhas Territoriais 2022** (shapefile de municípios por UF, SIRGAS 2000) → `mapshaper -i BR_Municipios_2022.shp -filter 'SIGLA_UF=="XX"' -simplify 3% keep-shapes -o format=topojson quantization=1e5` → TopoJSON por UF em `/public/data/malhas/` (alvo: ≤ 300–500 kB por UF; conferir o tamanho real de SP e MG); CSV base com os 5.570 municípios; declarar `topojson-client` no `package.json` (hoje só está em `node_modules` como dependência transitiva); desenhar qualquer GeoJSON mesmo sem CSV; propriedades do GeoJSON como variáveis; relatório de junção. **Contorno imediato:** perfil `.json` preparado pelo professor (A1) | A1, M6, M16 | `DataContext.jsx:5-6,70`; `MapContext.jsx:129-229`; `VisualizationMenu.jsx:183`; `public/data/`; `package.json` | M/G |
| F0.8 | Estúdio WYSIWYG: inicializar a partir de `visualizationConfig` e `legendConfigByKey`; aplicar `circle-color`; filtros com `setFilter`; indicador recalculado; `OWN_LAYERS` por prefixo; comparar URL com URL | A10, A11, A12, A14 | `ImageExportStudio.jsx:678,719,1190-1280,1535-1627` | M |
| F0.9 | Estúdio no celular (mínimo): prévia do tamanho da tela; exportação com DPR limitado: no Mapbox v2, antes de criar o mapa oculto, `Object.defineProperty(window,'devicePixelRatio',{configurable:true,get:()=>k})`, com `k = alvo/CSS` limitado por `gl.MAX_RENDERBUFFER_SIZE` e por 16,7 MP de área, restaurando o descritor original num `finally` (o mapa lê o DPR em `node_modules/mapbox-gl/src/ui/map.js:2960-2965`); `finally` também para remover o mapa oculto; Pointer Events no DragHandle; layout padrão sem colisão | C5, A17, A18, M44 | `ImageExportStudio.jsx:594-659,760-764,1580-1720,2298` | M |
| F0.10 | Entrega no celular: modal "Compartilhar / Baixar" com `navigator.share`, `<a>` anexado ao DOM, revogação em 60 s, dica "toque e segure"; nome de arquivo a partir do título; detectar navegador embutido (WhatsApp/Instagram) e mostrar "Abra no Safari/Chrome" | A19 | `ImageExportStudio.jsx:1711-1716` | P |
| F0.11 | Shell mobile mínimo: busca como ícone em < 600 px; `@media` para Sidebar; 100dvh; ocultar o rodapé no Mapa; inputs de 16 px | C2, A20, A21, A30, M34, M74 | `CitySearch.css`; `index.css:178-196`; `Sidebar.css`; `MainLayout.css`; `Footer`; `ImageStudio.css` | P |
| F0.12 | Desenho no toque: botões Concluir/Desfazer/Cancelar; `doubleClickZoom.disable()` durante o desenho; fechar no 1º vértice; bloquear o clique de cidade durante o desenho; corrigir `cursorPosition`; `cancel` no Rnd do painel de anotações | A15, A16, A22, M35 | `AnnotationToolbar.jsx`; `MapContext.jsx:305-420`; `AnnotationLegend.jsx:87-181` | P |
| F0.13 | Recriar camadas após troca de mapa base (`style.load` → `idle`) com ordem fixa. Prioridade: anotações (perda confirmada em execução) e gratícula; o coroplético voltou no teste, mas a recriação deve ser garantida porque depende de timing | A13, M30 | `MapContext.jsx:111-125,463,934` | P |
| F0.14 | Correções pontuais: remover `labelData` (exportMap:540); duplicação de visualizações no perfil; booleanos de capital; `fitBounds` só na primeira carga; bloco "Fonte / Elaboração / Data" + atribuição no PNG | A4, A27, M18, M2, M48, M54 | `exportMap.js:540`; `FilterMenu.jsx:86-88,199-204`; `MapContext.jsx:170,237`; `ImageExportStudio.jsx:564-591` | P |
| F0.15 | Teste de fumaça Playwright em 360/390 px (sem sobreposição de controles, exportar HD, recarregar e restaurar), reaproveitando os scripts da auditoria: `docs/auditoria-scripts/lib.mjs:41-50` (`page.route` com stub do estilo e dos recursos do Mapbox, CSS e fontes) e `docs/auditoria-scripts/audit.mjs`; os fluxos da matriz da §6.3 viram os casos de teste | regressões | `tests/` novo; CI | P |

**Se o prazo apertar**, faça a Fase 0-mínima e distribua as orientações da §9.0 e o perfil do professor (A1). Depois, na Fase 0b, a ordem é: F0.4 → F0.5 → F0.8 → F0.7 → F0.10 → F0.11 → F0.9 → F0.12. Até F0.9 e F0.12 ficarem prontas, a turma deve usar o **computador** para compor e exportar, e o celular só para consulta.

### Fase 1 — "Ferramenta sólida" (3–5 semanas)

> **Status (implementado):**
> - **MapLibre:** concluído.
> - **Prancha real:** A4/A3/Carta a 96/150/300 DPI, margem e moldura, 3 modelos, PDF e DPI gravado no PNG; resolução agora é densidade (M8).
> - **Painel de simbologia:** quantis, Jenks, intervalos iguais e manual; 2–9 classes; ColorBrewer, Viridis e Okabe-Ito; inverter; histograma.
> - **Normalização:** alerta de contagem absoluta, símbolos proporcionais e rótulos de municípios.
> - **Elementos:** mapa de localização, escala numérica, bloco de créditos e desfazer/refazer.
> - **Modelo do professor por link** (`?modelo=`); perfis leves (referência às UFs da malha).
> - **Qualidade:**
>   - ESLint;
>   - Vitest (28 testes);
>   - CI no GitHub Actions;
>   - code-splitting (bundle inicial de 2,17 MB para 1,55 MB).
> - **Pendentes:**
>   - barra inferior e bottom sheets mobile-first;
>   - importador de SHP/KML/TopoJSON e formato largo;
>   - esquema de projeto validado (zod) e lista de projetos;
>   - dividir `ImageExportStudio.jsx`;
>   - gratícula em graus-minutos-segundos na moldura;
>   - remover código morto da raiz.

- **Migração para MapLibre GL** + OpenFreeMap/CARTO + satélite com atribuição; `pixelRatio` nativo; HTML sem token (§10). Arquivos: `MapContext`, `ImageExportStudio`, `VisualizationMenu`, `exportMap`, `package.json`.
- **Prancha real**: A4/A3/Carta, retrato/paisagem, margens em mm, DPI 96/150/300, quadro do mapa com moldura, 3–5 modelos acadêmicos, PDF (jsPDF) com várias páginas. Resolve M8, M55, M85.
- **Painel de simbologia**: quantis, intervalos iguais, Jenks (simple-statistics), manual; 3–9 classes; ColorBrewer/Viridis/Okabe-Ito; inverter; histograma; editor de classes de verdade. Resolve M7, A9.
- **Normalização e símbolos proporcionais** com alerta pedagógico (M39); **rótulos de municípios** (M38).
- **UI mobile-first**: barra inferior (Dados | Estilo | Desenhar | Elementos | Exportar) e bottom sheets; rotas por hash (A28); alvos de 44 px (M51); workspace do Estúdio com pinça e pan (M50).
- **Importador universal** em Web Worker: detectar separador, encoding e número pt-BR; mapeamento de colunas; formato largo; TopoJSON/SHP/KML/CSV lat-lon; conjuntos substituíveis. Resolve A24, A25, A26, M15, M20.
- **Elementos**: bloco técnico completo (SIRGAS 2000), gratícula em graus-minutos-segundos na moldura, mapa de localização, escala numérica, textarea, redimensionar todos os elementos, desfazer/refazer. Resolve M12, M24, M45, M53, M57.
- **Projeto**: esquema versionado e validado (zod), "Abrir modelo do professor" por link (`?modelo=`), lista de projetos. Resolve M19.
- **Qualidade**: ESLint, Vitest, Playwright no CI; code-splitting (M77); dividir `ImageExportStudio.jsx` em módulos; remover código morto.

### Fase 2 — "Avançado"

- Albers equivalente para o Brasil/UF e grade UTM SIRGAS 2000 (proj4).
- Camadas genéricas com painel de camadas (visibilidade, opacidade, ordem, bloqueio).
- Ferramentas georreferenciadas de texto, seta, ícones temáticos; edição de vértices; snapping (Turf).
- Pequenos múltiplos por ano ou região; slider temporal; mapa bivariado 3×3.
- PWA offline com cache das malhas (PMTiles para o mapa base).
- Checklist didático e "modo avaliação" para o professor; galeria de exemplos "mapa bom × mapa enganoso".
- Integração com as APIs do IBGE (Localidades, Malhas v3, SIDRA). Confirmar CORS e limites antes.

---

## 10. Decisões técnicas recomendadas

### 10.1 Mapbox GL 2.15 × MapLibre GL + mapa base gratuito

> **Status (implementado):** o app foi migrado para **MapLibre GL** (5.24; em setembro de 2026, 6.11 com Vite 5 — corrige o alerta crítico GHSA-jrc7-96c5-q579; o HTML exportado segue na 5.24, que tem build UMD) com mapas base do OpenFreeMap/Esri e fundos 100% locais (`src/utils/basemaps.js`). Não há mais token nem conta. Se um mapa base remoto não carregar, o app troca sozinho para o fundo liso e mostra um aviso. A prévia e a exportação do Estúdio usam `pixelRatio: 1`, então o PNG sai exatamente no tamanho escolhido também no celular (resolve a parte de memória do B8/C5). O download adia a revogação do blob, e a escala do HTML exportado usa a constante de tiles de 512 px (A3). Isso resolve B1 e C1. A análise abaixo fica como registro da decisão.

| | Mapbox GL 2.15 (atual) | MapLibre GL 4/5 |
|---|---|---|
| Licença | Proprietária; só com produtos Mapbox (`node_modules/mapbox-gl/LICENSE.txt`) | BSD-3 |
| Token / conta / cobrança | Obrigatórios; cada `new Map` conta como carga (o app cria 1 por visita + 1 por Estúdio + 1 por PNG) | Não precisa |
| Rede escolar | Depende de `api.mapbox.com` | Pode usar OpenFreeMap/CARTO ou tiles próprios (PMTiles) |
| `pixelRatio` na exportação | Não configurável (contorno: sobrescrever `window.devicePixelRatio`) | Opção nativa |
| Custo de migração | — | API quase idêntica; trocar os estilos, as fontes (`DIN Pro` → `Noto Sans`), os ids em `LAYER_CATEGORIES` e o uso de `_data` |

**Atenção:** no Mapbox GL v2, sem token ou com token inválido o mapa **não desenha nada, nem um estilo local**. A autenticação de sessão (`node_modules/mapbox-gl/src/ui/map.js:3431-3448`; `src/util/mapbox.js:547-551`) marca o contexto como não autenticado e o painter retorna antes de desenhar (`src/render/painter.js:529`). Um "fundo liso" local só serve de reserva para rede bloqueada ou tiles indisponíveis.

**Recomendação:** migrar para **MapLibre** na Fase 1 (esforço M). Na Fase 0 há duas saídas:
- **(a) padrão:** manter o Mapbox com token **válido, rotacionado e restrito por URL**, mensagem clara quando faltar ou for recusado, e o "fundo liso" só como reserva para rede bloqueada;
- **(b) se não houver como garantir o token** no ambiente da turma (deploy por terceiros, cota, filtro que devolve 401): antecipar a migração para MapLibre para a Fase 0 (mesmo esforço M). Para mapa temático escolar, o **padrão deveria ser "fundo liso/cinza claro"**, e não `outdoors-v12`.

### 10.2 Hospedagem

**Recomendação:** Vercel, Netlify ou Cloudflare Pages (build `npm run build`, saída `dist`, variável de ambiente configurada), com preview por PR e uma URL fixa para a turma.

- **GitHub Pages** exige `base` e `import.meta.env.BASE_URL`: hoje `/logo_white.png` e `/etlWorker.js` quebram em subcaminho.
- **Nunca** servir a turma com `npm run dev -- --host`: o Vite 4 tem vulnerabilidades e `fs.allow ['..']` está ativo.
- Remover `public/index.html` (antigo) e `public/etl.html` (quebrado em produção).

### 10.3 Geometrias base do IBGE embutidas

| Opção | Prós | Contras |
|---|---|---|
| GeoJSON nacional único | Simples | Dezenas de MB; mata o celular |
| **TopoJSON simplificado por UF (mapshaper 2–5%) + UFs/regiões num arquivo pequeno** | Poucos MB, carregados sob demanda; funciona offline com cache | Pré-processamento no build |
| PMTiles / vector tiles | Escala para o Brasil inteiro em qualquer zoom | Mais complexo; exige MapLibre |
| API de Malhas v3 do IBGE em tempo real | Sempre atualizada | Depende de rede e CORS (a confirmar) |

**Recomendação:** TopoJSON por UF em `/public/data/malhas/` (malha 2022, EPSG:4674, compatível com WGS84 nessa escala), CSV base com os 5.570 municípios (código de 7 e de 6 dígitos, nome, UF, região, área, população do Censo 2022, capital) e cache em IndexedDB. PMTiles na Fase 2.

### 10.4 Formato de projeto salvo

**Recomendação:** JSON versionado (`{ schema: 3, meta:{autor,turma,data}, dataRefs, data, symbology, annotations, layout:{pages}, camera, basemap }`), validado com zod, com migração de versões anteriores e gravado:

- automaticamente em **IndexedDB**, com vários projetos e "Retomar";
- como arquivo `.sisinfo.json` para entrega. Quando os dados vierem da base embutida, guardar **referências** em vez de copiar a malha, para manter o arquivo leve. Opcionalmente comprimir com `CompressionStream` (gzip).
- "Abrir modelo do professor" por URL `?modelo=` ou por arquivo.

### 10.5 Arquitetura cartográfica

**Recomendação:** criar `src/cartography/` com `classify.js`, `scale.js`, `north.js` (SVG único), `graticule.js` e `layers.js` (recriação idempotente e ordem fixa), consumidos pela tela, pelo Estúdio, pelo HTML e pelo PDF, com testes unitários. É a causa raiz de A2/A3/A8/A10/M63.

### 10.6 Exportação HTML interativa

**Recomendação:** despriorizar. A entrega escolar deve ser PNG/PDF. Na Fase 0, só remover a linha 540 e trocar a constante da escala. Na Fase 1, com MapLibre, gerar o HTML sem token, com os dados em JSON escapado.

---

## 11. Apêndice

### 11.1 Limpeza do repositório

- **Protótipos na raiz, fora do build:** `map.html`, `dashboard.html`, `catalog.html`, `editor_*.html`, `reports.html`, `wiki.html` e `screenshots/` (Tailwind CDN, imagens remotas). Mover para `docs/prototipos/` ou remover.
- **Arquivos soltos:** `old_DataSourceInfo.jsx`, `original_DataSourceInfo.jsx`, `temp_old_bar.jsx/.css`, `line17.txt`, `readme` (7 bytes), `config.json`, **`.git_disabled/` versionado**.
- **Código morto em `src`** (≈ 13 mil linhas pelo grafo de imports):
  - os `.ts` da "Linha do Tempo" (`main.ts`, `timeline.ts`, `counter.ts`…) e `style.css`;
  - `CityEditor.jsx` (578 linhas), `WelcomeView`, `BottomBarPages`, `RadarChart`, `IndicatorComparisonBarChart`, `etl_main.jsx`;
  - `handleSaveProfile/handleLoadProfile` duplicados em `DataContext.jsx:283-344`;
  - `handleCityUpdateInApp/DeleteInApp` em `App.jsx:93-142`.
- **Dados sem uso:** `complete_databases_catalog.json` (645 kB), `candidates.json`, `data/simulated_sectors.geojson`, `data/municipios.geojson` (1 byte), `public/data/*.csv` (divergentes).
- **Dependências sem import:** `html2canvas`, `@turf/turf` (ou passar a usar turf de forma modular).
- **Publicação:** `public/index.html` antigo e `public/etl.html` quebrado.
- **Repositório:** adicionar `LICENSE`; confirmar que `.env` continua ignorado (o `.gitignore` já lista `.env`, `.env.local` e `.env.*.local`, linhas 12-16); o problema real é o token já presente no histórico (commit f8cdf91), que precisa ser **rotacionado**.
- Adicionar knip ou ts-prune no CI.

### 11.2 Achados refutados na verificação adversarial

**Nenhum achado foi refutado por completo** (os 10 auditores retornaram `refuted: []`). A verificação, porém, **rebaixou severidades** e **corrigiu evidências**, o que registro aqui por transparência:

- **Rebaixados:**
  - persistência (C3): três verificadores (dados, execução e benchmark) a rebaixaram para *high* e um auditor a classificou como *medium* por existir perfil manual; mantida em crítico nesta consolidação ("perde trabalho");
  - sem token / tela branca (C1): o verificador de plataforma rebaixou para *high* por ser correção de configuração; mantido em crítico porque um deploy sem token ou com token inválido bloqueia a turma toda sem nenhuma mensagem;
  - malha e dados embutidos (A1): rebaixado de *critical* para *high* por vários verificadores (há contorno por importação e por perfil);
  - GeoJSON que só aparece com CSV (fundido no A1): rebaixado de *critical* para *high*;
  - `labelData` no HTML (A4): rebaixado de *critical* para *high* (o HTML não é o caminho principal de entrega);
  - desenho por toque (A15): rebaixado de *critical* para *high* (pontos funcionam e o computador é contorno);
  - busca cobrindo os menus: um verificador pôs *high* por causa do contorno em paisagem; mantida em crítico;
  - canvas gigante: três verificadores puseram *high* por falta de teste em aparelho; mantida como crítico provável, a confirmar;
  - download no iOS: um verificador pôs *medium*; mantido em alto;
  - fitBounds, filtros zerando a visualização, projeção, performance de câmera, O(N×M), "2K/4K", `roundRect`, token no HTML, licença Mapbox, gratícula, menus flutuantes, tela inicial, CSV com vírgula, junção por código, documentação, capitais e perfil incompleto: todos rebaixados de *high* para *medium*.
- **Evidências corrigidas:**
  - existe `.env.example` (mas não há `.env`, e o README não cita o token);
  - token **ausente** causa tela branca, token **inválido** causa spinner eterno;
  - Legend, NorthArrow e AnnotationLegend (react-rnd) **aceitam** toque no mapa ao vivo;
  - `App.jsx:88` (JSON como UTF-8) não é defeito;
  - o exemplo em `DataSourceInfo.jsx:225-227` não tem espaços no início das linhas (o JSX colapsa tudo numa linha só);
  - `FilterMenu.jsx:137-141,339-341` já usa o padrão correto de download (o problema está só no Estúdio);
  - no Mapbox v2 **é possível** exportar em alta resolução sobrescrevendo `window.devicePixelRatio`;
  - "Apenas Capitais" funciona com `true` minúsculo (o formato documentado) e falha com `True`, que é o formato do dado embutido e do pandas;
  - o arquivo `ETLProcessor.jsx` fica em `src/components/ETL/`;
  - o `nowrap` da barra de desenho está em `AnnotationToolbar.css:127`;
  - são 9 `@media` no projeto, não 5, e nenhum cobre o shell.
- **Não verificado** (rede bloqueada ou sem aparelho): se os estilos v12 estão em *globe*; o glifo "⬡"; a fonte "DIN Pro Regular Italic"; o comportamento real do iOS com blob, o limite de canvas e o `dblclick`; `.geojson` desabilitado no seletor do iOS.
