import React from 'react';

const TransformacaoDATASUS = () => {
  const CodeBlock = ({ children }) => <pre><code>{children}</code></pre>;

  return (
    <div className="transformation-details">
      <h2>Documentação: Preparação de Indicadores do DATASUS (Ex: Morbidade)</h2>

      <h3>Finalidade no Aplicativo</h3>
      <p>
        O DATASUS, através de ferramentas como o TABNET, é uma fonte primária de dados de saúde pública no Brasil. Frequentemente, os dados exportados do TABNET vêm em formato "largo", com anos ou categorias em colunas separadas.
      </p>
      <p>
        Esta documentação descreve o processo conceitual para transformar esses dados (usando dados de morbidade como exemplo) no formato "longo" padronizado exigido pelo arquivo <code>indicadores.csv</code> do aplicativo.
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

      <h3>Como Construir o Arquivo a partir de Dados DATASUS (Ex: Morbidade): Guia Conceitual</h3>
      <p>O processo geralmente envolve tratar arquivos CSV exportados do TABNET.</p>
      <ol>
        <li>
          <strong>Passo 1: Exportação e Limpeza Inicial:</strong>
          <p>Exporte os dados desejados do <a href="https://datasus.saude.gov.br/informacoes-de-saude-tabnet/" target="_blank" rel="noopener noreferrer">DATASUS/TABNET</a>, geralmente um arquivo por indicador ou grupo de indicadores. Configure a exportação para ter "Município" nas linhas e "Ano" (ou outra categoria) nas colunas. Salve como CSV.</p>
          <p>Carregue o CSV em sua ferramenta de análise (ex: pandas). Esteja atento à codificação (pode ser 'latin1' ou 'utf-8') e trate valores que representam "não disponível" ou "zero" (frequentemente <code>-</code> no TABNET), substituindo-os por <code>0</code> ou <code>NaN</code> conforme apropriado.</p>
           <CodeBlock>{`# Exemplo Conceitual (pandas)
# Tentar ler com UTF-8, se falhar, tentar latin1
try:
    df_bruto = pd.read_csv('datasus_export.csv', sep=';', encoding='utf-8')
except UnicodeDecodeError:
    df_bruto = pd.read_csv('datasus_export.csv', sep=';', encoding='latin1')

# Substituir '-' por 0 (ou np.nan se preferir tratar ausência diferente de zero)
df_bruto = df_bruto.replace('-', 0)`}</CodeBlock>
        </li>
        <li>
          <strong>Passo 2: Transformação para Formato Longo (Pivot/Melt):</strong>
          <p>O objetivo é transformar as colunas de ano (ex: '2010', '2011', ...) em linhas. Identifique a(s) coluna(s) que identificam o município e use uma função "melt" (ou similar) para pivotar os dados.</p>
          <CodeBlock>{`# Exemplo Conceitual (pandas)
# Assumindo que a coluna de município se chama 'Município'
# e as colunas de ano são strings como '2010', '2011', ...
anos_colunas = [col for col in df_bruto.columns if col.isdigit() and len(col) == 4] # Identifica colunas de ano
df_longo = pd.melt(df_bruto,
                   id_vars=['Município'], # Coluna(s) identificadora(s)
                   value_vars=anos_colunas,
                   var_name='Ano_Observacao',
                   value_name='Valor')`}</CodeBlock>
        </li>
        <li>
          <strong>Passo 3: Extrair Código do Município e Formatar Dados:</strong>
          <p>A coluna 'Município' do TABNET geralmente contém o código e o nome juntos (ex: "410010 Abatiá"). Extraia o código de 7 dígitos e o nome.</p>
          <p>Converta <code>Ano_Observacao</code> para número inteiro e <code>Valor</code> para número (float), tratando separadores decimais (geralmente vírgula no DATASUS).</p>
          <CodeBlock>{`# Exemplo Conceitual (pandas)
# Extrair código e nome (ajuste o regex se o formato for diferente)
df_longo[['Codigo_Municipio', 'Nome_Municipio_Temp']] = df_longo['Município'].str.extract(r'^(\d{6,7})\s+(.*)$')

# Limpar e converter Valor
df_longo['Valor'] = df_longo['Valor'].astype(str).str.replace('.', '', regex=False).str.replace(',', '.', regex=False)
df_longo['Valor'] = pd.to_numeric(df_longo['Valor'], errors='coerce')

# Converter Ano
df_longo['Ano_Observacao'] = pd.to_numeric(df_longo['Ano_Observacao'], errors='coerce').astype('Int64')

# Remover linhas com valores inválidos ou onde a extração falhou
df_longo = df_longo.dropna(subset=['Codigo_Municipio', 'Ano_Observacao', 'Valor'])

# Garantir código como texto
df_longo['Codigo_Municipio'] = df_longo['Codigo_Municipio'].astype(str).str.zfill(7) # Garante 7 dígitos com zero à esquerda
`}</CodeBlock>
        </li>
        <li>
          <strong>Passo 4: Adicionar Nome do Indicador:</strong>
          <p>Crie a coluna <code>Nome_Indicador</code> e preencha-a com o nome descritivo correspondente aos dados do arquivo que você está processando (ex: "Despesas com Amebíase", "Casos de Dengue Confirmados"). Este nome deve ser consistente e claro para o usuário final no aplicativo.</p>
          <CodeBlock>{`# Exemplo Conceitual (pandas)
nome_indicador_atual = "Despesas com Amebíase" # Definir para cada arquivo processado
df_longo['Nome_Indicador'] = nome_indicador_atual`}</CodeBlock>
        </li>
        <li>
          <strong>Passo 5: Selecionar Colunas Finais e Concatenar (se aplicável):</strong>
          <p>Selecione as colunas no formato final: <code>Codigo_Municipio</code>, <code>Nome_Indicador</code>, <code>Ano_Observacao</code>, <code>Valor</code>.</p>
          <p>Se você processou múltiplos arquivos (um para cada tipo de morbidade, por exemplo), concatene os DataFrames resultantes de cada arquivo em um único DataFrame consolidado.</p>
          <CodeBlock>{`# Exemplo Conceitual (pandas)
df_final_datasus = df_longo[['Codigo_Municipio', 'Nome_Indicador', 'Ano_Observacao', 'Valor']]

# Se processou múltiplos arquivos (df1, df2, ...):
# df_consolidado_datasus = pd.concat([df1, df2, ...], ignore_index=True)
`}</CodeBlock>
        </li>
         <li>
          <strong>Passo 6 (Opcional, mas Recomendado): Padronizar Nomes de Municípios:</strong>
          <p>Para garantir consistência com outras fontes, você pode mesclar (<code>merge</code>) seus dados processados com o arquivo <code>municipios.csv</code> (usando <code>Codigo_Municipio</code> como chave) para obter o <code>Nome_Municipio</code> padronizado.</p>
        </li>
      </ol>
       <p><strong>Próximo Passo Essencial:</strong> Após consolidar os dados formatados do DATASUS e de outras fontes, o próximo passo é calcular e adicionar a coluna <code>Indice_Posicional</code>, conforme descrito na documentação "Processo de Cálculo: Índice Posicional", antes de gerar o arquivo <code>indicadores.csv</code> final para importação.</p>
    </div>
  );
};

export default TransformacaoDATASUS;
