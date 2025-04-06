import React from 'react';

const TransformacaoIBGE = () => {
  const CodeBlock = ({ children }) => <pre><code>{children}</code></pre>;

  return (
    <div className="transformation-details">
      <h2>Documentação: Preparação de Indicadores do IBGE (Ex: Censo Agropecuário via SIDRA)</h2>

      <h3>Finalidade no Aplicativo</h3>
      <p>
        O IBGE (Instituto Brasileiro de Geografia e Estatística) é a principal fonte de dados estatísticos oficiais do Brasil, cobrindo demografia, economia, agropecuária, e muito mais. A plataforma <a href="https://sidra.ibge.gov.br/" target="_blank" rel="noopener noreferrer">SIDRA (Sistema IBGE de Recuperação Automática)</a> permite consultar e baixar tabelas de diversas pesquisas, como o Censo Agropecuário.
      </p>
      <p>
        Esta documentação descreve o processo conceitual para transformar dados exportados do SIDRA (ou outras fontes IBGE) para o formato "longo" padronizado exigido pelo arquivo <code>indicadores.csv</code> do aplicativo.
      </p>

      <h3>Formato Requerido para Importação (<code>indicadores.csv</code>)</h3>
      <p>
        Lembre-se, o arquivo final para importação no aplicativo deve ser um CSV (separador <code>;</code>, decimal <code>.</code>, UTF-8) com as colunas:
      </p>
      <ul className="column-list">
        <li><code>Codigo_Municipio</code> (Texto)</li>
        <li><code>Nome_Indicador</code> (Texto)</li>
        <li><code>Ano_Observacao</code> (Número)</li>
        <li><code>Valor</code> (Número)</li>
        <li><code>Indice_Posicional</code> (Número, calculado ao final)</li>
      </ul>

      <h3>Como Construir o Arquivo a partir de Dados IBGE/SIDRA: Guia Conceitual</h3>
      <p>O processo geralmente envolve configurar e baixar tabelas do SIDRA.</p>
      <ol>
        <li>
          <strong>Passo 1: Seleção e Download no SIDRA:</strong>
          <ul>
            <li>Acesse o <a href="https://sidra.ibge.gov.br/" target="_blank" rel="noopener noreferrer">SIDRA</a> e navegue até a pesquisa desejada (ex: Censo Agropecuário).</li>
            <li>Selecione as variáveis (indicadores) de interesse.</li>
            <li>Configure a tabela: coloque "Município" nas linhas e "Ano" (ou outra classificação relevante que represente o tempo) nas colunas. Adicione as variáveis selecionadas como "Valor".</li>
            <li>Filtre para o(s) ano(s) e territórios desejados (todos os municípios do Brasil ou um subconjunto).</li>
            <li>Exporte a tabela resultante como CSV. Preste atenção às opções de exportação (separador, cabeçalhos, etc.).</li>
          </ul>
        </li>
        <li>
          <strong>Passo 2: Leitura e Limpeza Inicial do CSV:</strong>
          <p>Carregue o arquivo CSV exportado do SIDRA em sua ferramenta de análise (ex: pandas). Considere:</p>
          <ul>
            <li><strong>Encoding:</strong> Verifique a codificação (pode ser 'latin1', 'utf-8', ou outra).</li>
            <li><strong>Linhas a Ignorar:</strong> Exportações do SIDRA podem ter linhas de título ou notas no início/fim (`skiprows`, `skipfooter`).</li>
            <li><strong>Separador:</strong> Geralmente vírgula (<code>,</code>) ou ponto e vírgula (<code>;</code>).</li>
            <li><strong>Tratamento de Ausentes/Especiais:</strong> O SIDRA usa códigos como '...' ou 'X' para dados não disponíveis ou confidenciais. Substitua-os por <code>NaN</code> (Not a Number) para facilitar o processamento numérico.</li>
          </ul>
          <CodeBlock>{`# Exemplo Conceitual (pandas)
import pandas as pd
import numpy as np

arquivo_sidra = 'path/to/sidra_export.csv'

try:
    # Ajuste skiprows, sep, encoding conforme a exportação do SIDRA
    df_bruto = pd.read_csv(arquivo_sidra, sep=',', encoding='utf-8', skiprows=4, skipfooter=2, engine='python')
    # Substituir códigos especiais do IBGE por NaN
    df_bruto = df_bruto.replace(['...', 'X', '-'], np.nan)
    print(f"Arquivo {arquivo_sidra} carregado.")
except Exception as e:
    print(f"Erro ao carregar {arquivo_sidra}: {e}")
    # Tratar erro
`}</CodeBlock>
        </li>
        <li>
          <strong>Passo 3: Identificar e Renomear Colunas Chave:</strong>
          <p>Localize as colunas que representam:</p>
          <ul>
            <li><strong>Município:</strong> Geralmente contém código e nome (ex: "Município (Código)"). Renomeie temporariamente (ex: <code>Municipio_Raw</code>).</li>
            <li><strong>Ano:</strong> Se o ano estava nas colunas, esta etapa será feita durante o "melt". Se já for uma coluna, renomeie para <code>Ano_Observacao</code>.</li>
            <li><strong>Valores dos Indicadores:</strong> As colunas que contêm os valores numéricos das variáveis selecionadas.</li>
          </ul>
        </li>
        <li>
          <strong>Passo 4: Transformação para Formato Longo (Melt/Unpivot - se necessário):</strong>
          <p>Se a sua exportação do SIDRA colocou anos ou variáveis diferentes em colunas separadas, use a função "melt" para transformar os dados para o formato longo, similar ao processo descrito para SNIS ou FINBRA.</p>
          <CodeBlock>{`# Exemplo Conceitual (pandas) - Se anos/variáveis estão em colunas
# colunas_valor = ['2017 - Var A', '2017 - Var B', ...] # Identificar colunas de valor
# df_longo = pd.melt(df_bruto,
#                    id_vars=['Municipio_Raw'], # Coluna(s) identificadora(s)
#                    value_vars=colunas_valor,
#                    var_name='Indicador_Ano_Raw', # Coluna temporária com 'Ano - Variável'
#                    value_name='Valor')
# # Seria necessário processar 'Indicador_Ano_Raw' para separar Ano e Nome_Indicador
`}</CodeBlock>
          <p>Se a exportação já estiver semi-longa (ex: uma coluna por variável, com ano e município nas linhas), esta etapa pode ser mais simples ou desnecessária.</p>
        </li>
        <li>
          <strong>Passo 5: Extrair Código, Nome do Indicador e Formatar Dados:</strong>
          <ul>
            <li><strong>Código do Município:</strong> Extraia o código IBGE de 7 dígitos da coluna de município (ex: de "410010 Abatiá (PR)", extrair "410010"). Garanta que seja texto/string. Nomeie como <code>Codigo_Municipio</code>.</li>
            <li><strong>Nome do Indicador:</strong> Se você usou "melt", processe a coluna resultante para obter o nome descritivo final do indicador. Se as variáveis já eram colunas, use o nome da coluna original (ou um nome mais claro) como <code>Nome_Indicador</code>.</li>
            <li><strong>Ano:</strong> Garanta que a coluna <code>Ano_Observacao</code> seja numérica (inteiro).</li>
            <li><strong>Valor:</strong> Limpe e converta a coluna <code>Valor</code> para número (float), usando ponto como decimal. Remova linhas com valores inválidos.</li>
          </ul>
        </li>
        <li>
          <strong>Passo 6: Concatenar e Preparar para Índice:</strong>
          <p>Se você processou múltiplas tabelas ou variáveis do SIDRA separadamente, concatene os resultados. O DataFrame resultante deve ter as colunas <code>Codigo_Municipio</code>, <code>Nome_Indicador</code>, <code>Ano_Observacao</code>, <code>Valor</code>.</p>
        </li>
      </ol>
       <p><strong>Próximo Passo Essencial:</strong> Após consolidar os dados formatados do IBGE/SIDRA e de outras fontes, o próximo passo é calcular e adicionar a coluna <code>Indice_Posicional</code>, conforme descrito na documentação "Processo de Cálculo: Índice Posicional", antes de gerar o arquivo <code>indicadores.csv</code> final para importação.</p>
    </div>
  );
};

export default TransformacaoIBGE;
