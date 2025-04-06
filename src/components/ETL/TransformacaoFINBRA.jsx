import React from 'react';

const TransformacaoFINBRA = () => {
  const CodeBlock = ({ children }) => <pre><code>{children}</code></pre>;

  return (
    <div className="transformation-details">
      <h2>Documentação: Preparação de Indicadores do FINBRA</h2>

      <h3>Finalidade no Aplicativo</h3>
      <p>
        O FINBRA (Finanças do Brasil), gerenciado pelo Tesouro Nacional Transparente, disponibiliza dados contábeis detalhados dos municípios brasileiros (Receitas, Despesas, Balanços, etc.). Esses dados são valiosos para análises financeiras e orçamentárias no aplicativo.
      </p>
      <p>
        Os arquivos do FINBRA geralmente vêm estruturados por ano e por tipo de relatório/anexo, contendo múltiplas contas e colunas descritivas. Esta documentação descreve como transformar esses dados no formato "longo" padronizado exigido pelo arquivo <code>indicadores.csv</code> do aplicativo.
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

      <h3>Como Construir o Arquivo a partir de Dados FINBRA: Guia Conceitual</h3>
      <p>O processo envolve tratar cada arquivo FINBRA relevante individualmente e depois consolidar os resultados.</p>
      <ol>
        <li>
          <strong>Passo 1: Identificação e Download dos Arquivos FINBRA:</strong>
          <p>Acesse o portal do <a href="https://siconfi.tesouro.gov.br/" target="_blank" rel="noopener noreferrer">SICONFI (Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro)</a>, que hospeda os dados do FINBRA, ou o portal do <a href="https://www.tesourotransparente.gov.br/publicacoes/finbra-dados-contabeis-dos-municipios/2023/117" target="_blank" rel="noopener noreferrer">Tesouro Transparente</a> para baixar os arquivos CSV correspondentes aos relatórios (ex: Receitas Orçamentárias Anexo I-C, Despesas Orçamentárias Anexo I-E) e aos anos de interesse.</p>
          <p>Observe que cada arquivo geralmente representa um ano específico.</p>
        </li>
        <li>
          <strong>Passo 2: Leitura e Limpeza Inicial (por arquivo):</strong>
          <p>Para cada arquivo CSV baixado:</p>
          <ul>
            <li>Carregue o arquivo em uma ferramenta de análise (ex: pandas). Preste atenção a:
                <ul>
                    <li><strong>Encoding:</strong> Frequentemente é 'latin1'.</li>
                    <li><strong>Linhas a Ignorar:</strong> Arquivos FINBRA costumam ter linhas de cabeçalho ou notas no início que precisam ser puladas (ex: `skiprows=3`).</li>
                    <li><strong>Separador:</strong> Geralmente é ponto e vírgula (<code>;</code>).</li>
                </ul>
            </li>
            <li>Inspecione as colunas disponíveis. Você precisará identificar as colunas que contêm:
                <ul>
                    <li>Código IBGE do Município (ex: <code>Cod.IBGE</code>).</li>
                    <li>O valor numérico da conta/indicador (ex: <code>Valor</code>).</li>
                    <li>Informações descritivas que formarão o nome do indicador (ex: <code>Conta</code>, <code>Coluna</code>).</li>
                </ul>
            </li>
          </ul>
          <CodeBlock>{`# Exemplo Conceitual (pandas) para UM arquivo FINBRA (ex: Receitas 2013)
import pandas as pd

arquivo_finbra = 'path/to/finbra_receitas_2013.csv'
ano_do_arquivo = 2013 # Extraído do nome do arquivo ou contexto

try:
    df_bruto = pd.read_csv(arquivo_finbra, sep=';', encoding='latin1', skiprows=3)
    print(f"Arquivo {arquivo_finbra} carregado.")
except Exception as e:
    print(f"Erro ao carregar {arquivo_finbra}: {e}")
    # Tratar erro ou pular arquivo
`}</CodeBlock>
        </li>
        <li>
          <strong>Passo 3: Mapeamento e Criação das Colunas Padrão (por arquivo):</strong>
          <p>Transforme as colunas do arquivo FINBRA bruto para o formato intermediário do aplicativo:</p>
          <ul>
            <li><strong><code>Codigo_Municipio</code>:</strong> Mapeie a coluna de código IBGE (ex: <code>Cod.IBGE</code>) e garanta que seja texto/string de 7 dígitos.</li>
            <li><strong><code>Nome_Indicador</code>:</strong> Crie um nome descritivo e único combinando informações das colunas de descrição (ex: <code>Conta</code> e <code>Coluna</code>). Seja consistente na nomenclatura entre diferentes anos e arquivos.</li>
            <li><strong><code>Ano_Observacao</code>:</strong> Atribua o ano correspondente a este arquivo específico.</li>
            <li><strong><code>Valor</code>:</strong> Mapeie a coluna de valor. Limpe-a (remova separadores de milhar, substitua vírgula decimal por ponto) e converta para tipo numérico (float).</li>
          </ul>
          <CodeBlock>{`# Exemplo Conceitual (pandas) - Continuação
if 'df_bruto' in locals() and not df_bruto.empty:
    df_processado = pd.DataFrame() # Criar DataFrame vazio para os resultados
    df_processado['Codigo_Municipio'] = df_bruto['Cod.IBGE'].astype(str).str.zfill(7)
    # Combina 'Conta' e 'Coluna' para criar um nome único e descritivo
    df_processado['Nome_Indicador'] = df_bruto['Conta'] + ' - ' + df_bruto['Coluna']
    df_processado['Ano_Observacao'] = ano_do_arquivo
    # Limpeza do valor (EXEMPLO, ajuste conforme necessário)
    df_processado['Valor'] = df_bruto['Valor'].astype(str).str.replace('.', '', regex=False).str.replace(',', '.', regex=False)
    df_processado['Valor'] = pd.to_numeric(df_processado['Valor'], errors='coerce')

    # Remover linhas onde a conversão falhou ou dados essenciais faltam
    df_processado = df_processado.dropna(subset=['Codigo_Municipio', 'Ano_Observacao', 'Valor', 'Nome_Indicador'])

    # Selecionar apenas as colunas necessárias
    df_processado = df_processado[['Codigo_Municipio', 'Nome_Indicador', 'Ano_Observacao', 'Valor']]
else:
    df_processado = pd.DataFrame() # Garante que df_processado existe mesmo se o carregamento falhar
`}</CodeBlock>
        </li>
        <li>
          <strong>Passo 4: Repetir e Concatenar:</strong>
          <p>Repita os Passos 2 e 3 para <strong>todos</strong> os arquivos FINBRA (diferentes anos, diferentes relatórios) que contêm os indicadores desejados.</p>
          <p>Após processar cada arquivo individualmente, concatene todos os DataFrames resultantes (<code>df_processado</code> de cada arquivo) em um único DataFrame consolidado.</p>
          <CodeBlock>{`# Exemplo Conceitual (pandas)
# Supondo que você processou Receitas 2013 (df_rec13), Receitas 2014 (df_rec14), Despesas 2013 (df_des13)...
lista_dfs_finbra = [df_rec13, df_rec14, df_des13, ...]
df_consolidado_finbra = pd.concat(lista_dfs_finbra, ignore_index=True)

# Este df_consolidado_finbra pode ser concatenado com dados de outras fontes (SNIS, IPEA, etc.)
# antes de calcular o Índice Posicional.
`}</CodeBlock>
        </li>
      </ol>
       <p><strong>Próximo Passo Essencial:</strong> Após consolidar os dados formatados do FINBRA e de outras fontes, o próximo passo é calcular e adicionar a coluna <code>Indice_Posicional</code>, conforme descrito na documentação "Processo de Cálculo: Índice Posicional", antes de gerar o arquivo <code>indicadores.csv</code> final para importação.</p>
    </div>
  );
};

export default TransformacaoFINBRA;
