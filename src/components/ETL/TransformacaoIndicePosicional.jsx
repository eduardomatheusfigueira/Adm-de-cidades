import React from 'react';

const TransformacaoIndicePosicional = () => {
  const CodeBlock = ({ children }) => <pre><code>{children}</code></pre>;

  return (
    <div className="transformation-details">
      <h2>Documentação: Processo de Cálculo do Índice Posicional</h2>

      <h3>Finalidade no Aplicativo</h3>
      <p>
        O <strong>Índice Posicional</strong> é uma métrica crucial utilizada no aplicativo para permitir comparações justas entre municípios em diferentes indicadores, independentemente de suas escalas originais (ex: comparar um índice que varia de 0 a 1 com um valor de despesa em milhões de reais).
      </p>
      <p>
        Ele representa a posição relativa de um município (normalizada entre 0 e 1) em relação a todos os outros municípios para os quais há dados daquele indicador específico, naquele ano específico. A interpretação do índice depende da natureza do indicador:
      </p>
      <ul>
        <li><strong>Para indicadores onde "maior é melhor" (ex: IDH):</strong>
            <ul>
                <li>Valor próximo de 1: Melhor desempenho relativo.</li>
                <li>Valor próximo de 0: Pior desempenho relativo.</li>
            </ul>
        </li>
         <li><strong>Para indicadores onde "menor é melhor" (ex: Taxa de Mortalidade Infantil):</strong>
            <ul>
                <li>Valor próximo de 1: Melhor desempenho relativo (menor taxa).</li>
                <li>Valor próximo de 0: Pior desempenho relativo (maior taxa).</li>
            </ul>
        </li>
        <li><strong>Valor próximo de 0.5:</strong> Indica um desempenho mediano em ambos os casos.</li>
      </ul>
      <p>Este índice é a base para rankings e algumas visualizações comparativas no aplicativo, permitindo uma análise mais equitativa do desempenho municipal.</p>

      <h3>Quando Calcular?</h3>
      <p>
        O Índice Posicional deve ser calculado como a <strong>etapa final</strong> da preparação do arquivo <code>indicadores.csv</code>. É necessário que você já tenha:
      </p>
      <ol>
        <li>Coletado os dados de <strong>todas</strong> as fontes de indicadores desejadas (SNIS, IPEADATA, IBGE, etc.).</li>
        <li>Transformado esses dados para o formato "longo" exigido, resultando em uma tabela (ou DataFrame) com as colunas: <code>Codigo_Municipio</code>, <code>Nome_Indicador</code>, <code>Ano_Observacao</code>, <code>Valor</code>.</li>
      </ol>
      <p>O cálculo do índice adicionará a quinta coluna obrigatória, <code>Indice_Posicional</code>, ao seu conjunto de dados consolidado.</p>

      <h3>Lógica do Cálculo</h3>
      <p>O cálculo é realizado independentemente para cada grupo formado pela combinação única de <code>Nome_Indicador</code> e <code>Ano_Observacao</code>:</p>
      <ol>
        <li>
          <strong>Definição da Ordenação Desejada:</strong> Para cada <code>Nome_Indicador</code>, determine se um valor maior representa um melhor desempenho (ex: IDH, Receita) ou se um valor menor representa um melhor desempenho (ex: Mortalidade, Desemprego). Esta definição é crucial.
        </li>
        <li>
          <strong>Ordenação dos Municípios no Grupo:</strong> Dentro de um grupo específico (ex: todos os dados de 'IDH Municipal' para o ano '2010'), ordene os municípios com base na coluna <code>Valor</code>, seguindo a direção definida no passo anterior (ascendente para "menor é melhor", descendente para "maior é melhor"). Municípios sem valor (NaN) para aquele indicador/ano são ignorados no cálculo do índice para esse grupo.
        </li>
        <li>
          <strong>Atribuição de Posição (Ranking):</strong> Atribua uma posição (rank) a cada município dentro do grupo ordenado. É importante definir como lidar com empates (municípios com o mesmo <code>Valor</code>). A abordagem mais comum é atribuir a posição média aos empatados (ex: se dois municípios empatam na 2ª e 3ª posição, ambos recebem o rank 2.5).
        </li>
        <li>
          <strong>Normalização para Índice (0 a 1):</strong> Converta o rank obtido em um índice normalizado entre 0 e 1. Uma fórmula comum, que atribui 1 ao melhor rank e 0 ao pior, é:
          <CodeBlock>{`Indice_Posicional = (N - rank) / (N - 1)`}</CodeBlock>
          Onde:
          <ul>
            <li><code>N</code> é o número total de municípios com dados válidos naquele grupo (indicador/ano).</li>
            <li><code>rank</code> é a posição (média, em caso de empate) do município no grupo ordenado (começando em 1 para o melhor).</li>
          </ul>
          <em>(Casos especiais: Se N=1, o índice pode ser definido como 0.5. Se N=0, não há índice.)</em>
        </li>
      </ol>

      <h3>Implementação Conceitual (Python/pandas)</h3>
      <p>A aplicação dessa lógica geralmente envolve agrupar o DataFrame consolidado e aplicar uma função customizada que incorpore a lógica de ordenação e normalização.</p>
      <CodeBlock>{`import pandas as pd
import numpy as np

# --- Função de Cálculo para um Grupo (Indicador/Ano) ---
def calcular_indice_para_grupo(grupo, maior_melhor=True):
    grupo = grupo.dropna(subset=['Valor']).copy()
    N = len(grupo)
    if N == 0: return None # Ou retornar uma série vazia

    ascending_order = not maior_melhor # Se maior é melhor, ordena descendente (ascending=False)

    # Usar rank para lidar com empates mais facilmente
    # method='average' calcula a média das posições para empates
    grupo['rank'] = grupo['Valor'].rank(method='average', ascending=ascending_order)

    if N > 1:
         # Fórmula do índice: (N - rank_médio) / (N - 1)
        grupo['Indice_Posicional'] = (N - grupo['rank']) / (N - 1)
    else: # N == 1
        grupo['Indice_Posicional'] = 0.5 # Ou outra convenção para único valor

    return grupo[['Indice_Posicional']] # Retorna só a coluna calculada

# --- Aplicação ao DataFrame Consolidado ---
# df_consolidado: DataFrame com ['Codigo_Municipio', 'Nome_Indicador', 'Ano_Observacao', 'Valor']

# 1. Definir a ordenação para cada indicador
ordenacao_indicadores = {
    'IDH Municipal': True, # Maior é melhor
    'Taxa de Mortalidade Infantil': False, # Menor é melhor
    # ... Adicionar TODOS os indicadores presentes em df_consolidado
}

# 2. Função para aplicar o cálculo usando a ordenação correta
def aplicar_calculo_com_ordenacao(grupo):
    nome_indicador = grupo['Nome_Indicador'].iloc[0]
    # Default para True (maior é melhor) se indicador não estiver no dict
    maior_melhor = ordenacao_indicadores.get(nome_indicador, True)
    return calcular_indice_para_grupo(grupo, maior_melhor=maior_melhor)

# 3. Agrupar por Indicador/Ano e aplicar a função
indices_calculados = df_consolidado.groupby(['Nome_Indicador', 'Ano_Observacao'], group_keys=False)\
                                   .apply(aplicar_calculo_com_ordenacao)

# 4. Juntar os índices calculados ao DataFrame original
df_final_para_importar = df_consolidado.join(indices_calculados)

# 5. Verificar e tratar possíveis NaNs em 'Indice_Posicional' (se necessário)
#    Ex: df_final_para_importar = df_final_para_importar.dropna(subset=['Indice_Posicional'])

# 6. Exportar o DataFrame final para CSV (formato indicadores.csv)
# df_final_para_importar.to_csv('indicadores.csv', index=False, sep=';', decimal='.')
`}</CodeBlock>

      <h3>Considerações Importantes</h3>
      <ul>
        <li><strong>Definição da Ordenação:</strong> A etapa mais crítica é definir corretamente se "maior é melhor" ou "menor é melhor" para <strong>cada</strong> indicador. Um erro aqui inverte completamente o significado do índice.</li>
        <li><strong>Abrangência dos Dados:</strong> O índice é relativo ao conjunto de municípios presentes *naquele grupo específico (indicador/ano)*. Se faltarem muitos municípios nos dados de origem, o índice pode não refletir a posição nacional real.</li>
        <li><strong>Consistência:</strong> Calcule o índice sobre o conjunto de dados *completo* que será importado, não sobre subconjuntos ou fontes separadas, para garantir a comparabilidade.</li>
      </ul>
    </div>
  );
};

export default TransformacaoIndicePosicional;
