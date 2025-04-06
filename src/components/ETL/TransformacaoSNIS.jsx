import React from 'react';

const TransformacaoSNIS = () => {
  const CodeBlock = ({ children }) => <pre><code>{children}</code></pre>;

  return (
    <div className="transformation-details">
      <h2>Documentação: Preparação de Dados de Indicadores (Exemplo SNIS)</h2>

      <h3>Finalidade no Aplicativo</h3>
      <p>
        O aplicativo exibe e compara diversos indicadores municipais ao longo do tempo. Para que isso seja possível, os dados de diferentes fontes (como SNIS, IBGE, IPEADATA, etc.) precisam ser consolidados em um formato padronizado, conhecido como formato "longo" ou "tidy".
      </p>
      <p>
        Este formato facilita a filtragem, agregação e visualização dos dados no aplicativo. Fontes como o SNIS frequentemente disponibilizam dados em formato "largo" (onde cada indicador ou ano ocupa uma coluna diferente), exigindo uma transformação antes da importação.
      </p>
      <p>
        Esta página descreve o processo conceitual para converter dados do SNIS (ou fontes similares em formato largo) para o formato longo exigido pelo arquivo <code>indicadores.csv</code>.
      </p>

      <h3>Formato Requerido para Importação (<code>indicadores.csv</code>)</h3>
      <p>
        O arquivo de importação de indicadores deve seguir estas especificações:
      </p>
       <ul>
        <li><strong>Tipo de Arquivo:</strong> CSV</li>
        <li><strong>Separador de Colunas:</strong> Ponto e vírgula (<code>;</code>)</li>
        <li><strong>Separador Decimal para Números:</strong> Ponto (<code>.</code>)</li>
        <li><strong>Codificação de Texto:</strong> UTF-8 (recomendado)</li>
        <li><strong>Cabeçalho:</strong> A primeira linha deve conter os nomes exatos das colunas listadas abaixo.</li>
      </ul>
      <h4>Colunas Obrigatórias (Nome Exato e Tipo Esperado):</h4>
      <ul className="column-list">
        <li><code>Codigo_Municipio</code> (Texto): Código IBGE de 7 dígitos.</li>
        <li><code>Nome_Indicador</code> (Texto): Nome descritivo e único do indicador. Este nome será usado nas legendas e seletores do aplicativo.</li>
        <li><code>Ano_Observacao</code> (Número): Ano a que o valor se refere (formato YYYY).</li>
        <li><code>Valor</code> (Número): O valor numérico do indicador.</li>
        <li><code>Indice_Posicional</code> (Número): Valor normalizado entre 0 e 1, calculado posteriormente (veja documentação específica).</li>
      </ul>
      <p><strong>Importante:</strong> Cada linha neste arquivo representa uma única observação de um indicador para um município em um ano específico.</p>

      <h3>Como Construir o Arquivo a partir de Dados Largos (Ex: SNIS): Guia Conceitual</h3>
      <ol>
        <li>
          <strong>Passo 1: Limpeza e Carregamento dos Dados de Origem:</strong>
          <p>Obtenha os dados da fonte (ex: exportação do SNIS - Sistema Nacional de Informações sobre Saneamento). A série histórica pode ser acessada através do portal <a href="https://app4.cidades.gov.br/serieHistorica/" target="_blank" rel="noopener noreferrer">SNIS - Série Histórica</a>. Verifique a codificação do arquivo (frequentemente 'latin1' para exportações mais antigas) e limpe quaisquer caracteres inválidos (bytes nulos, BOMs) que possam impedir o carregamento correto.</p>
          <p>Carregue os dados limpos em uma estrutura tabular (ex: DataFrame).</p>
        </li>
        <li>
          <strong>Passo 2: Seleção e Renomeação Inicial:</strong>
          <p>Identifique as colunas essenciais:</p>
          <ul>
            <li>A coluna que contém o Código IBGE do município (7 dígitos). Renomeie-a temporariamente se necessário (ex: para <code>Codigo_Municipio_Temp</code>).</li>
            <li>A coluna que contém o Ano de Referência. Renomeie-a para <code>Ano_Observacao</code>.</li>
            <li>Todas as colunas que contêm os valores dos indicadores que você deseja importar (ex: "AG001 - ...", "FN015 - ...").</li>
          </ul>
          <p>Descarte colunas desnecessárias (nomes de municípios, estados, etc., pois estes virão do arquivo <code>municipios.csv</code>).</p>
        </li>
        <li>
          <strong>Passo 3: Transformação para Formato Longo (Melt/Unpivot):</strong>
          <p>Esta é a etapa crucial. Utilize uma função de "melt" ou "unpivot" para transformar as colunas de indicadores em linhas. O objetivo é ter uma linha para cada combinação de município, ano e indicador.</p>
          <CodeBlock>{`# Exemplo Conceitual (pandas)
# df_largo: DataFrame com Codigo_Municipio_Temp, Ano_Observacao, IndicadorA, IndicadorB, ...
# colunas_indicadores = ['IndicadorA', 'IndicadorB', ...]

df_longo = pd.melt(df_largo,
                   id_vars=['Codigo_Municipio_Temp', 'Ano_Observacao'],
                   value_vars=colunas_indicadores,
                   var_name='Nome_Indicador', # Nome da nova coluna que conterá os nomes dos indicadores
                   value_name='Valor')       # Nome da nova coluna que conterá os valores`}</CodeBlock>
          <p>O resultado (<code>df_longo</code>) terá as colunas: <code>Codigo_Municipio_Temp</code>, <code>Ano_Observacao</code>, <code>Nome_Indicador</code>, <code>Valor</code>.</p>
        </li>
        <li>
          <strong>Passo 4: Limpeza Final e Padronização:</strong>
          <ul>
            <li>Renomeie <code>Codigo_Municipio_Temp</code> para <code>Codigo_Municipio</code>.</li>
            <li>Garanta que <code>Codigo_Municipio</code> seja tratado como texto.</li>
            <li>Garanta que <code>Ano_Observacao</code> seja um número inteiro.</li>
            <li>Limpe a coluna <code>Nome_Indicador</code> (remova espaços extras, padronize nomes se necessário).</li>
            <li>Limpe e converta a coluna <code>Valor</code> para número, usando ponto como decimal. Remova quaisquer linhas onde o valor não seja válido ou não possa ser convertido.</li>
            <CodeBlock>{`# Exemplo Conceitual (pandas)
# df_longo['Valor'] = df_longo['Valor'].astype(str)... # Limpeza de strings
# df_longo['Valor'] = pd.to_numeric(df_longo['Valor'], errors='coerce')
# df_longo = df_longo.dropna(subset=['Valor'])`}</CodeBlock>
          </ul>
        </li>
        <li>
          <strong>Passo 5: Preparação para Cálculo do Índice:</strong>
          <p>Neste ponto, o DataFrame contém as colunas <code>Codigo_Municipio</code>, <code>Nome_Indicador</code>, <code>Ano_Observacao</code>, <code>Valor</code>, prontas para a próxima etapa: o cálculo do Índice Posicional.</p>
          <p>Salve este DataFrame intermediário se desejar, ou prossiga diretamente para o cálculo do índice.</p>
        </li>
      </ol>
       <p><strong>Próximo Passo Essencial:</strong> O arquivo gerado até aqui está <strong>incompleto</strong> para importação. É fundamental prosseguir para o cálculo e adição da coluna <code>Indice_Posicional</code>, conforme descrito na documentação "Processo de Cálculo: Índice Posicional".</p>
    </div>
  );
};

export default TransformacaoSNIS;
