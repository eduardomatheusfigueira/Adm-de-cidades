import React from 'react';

const TransformacaoIPEADATA = () => {
  const CodeBlock = ({ children }) => <pre><code>{children}</code></pre>;

  return (
    <div className="transformation-details">
      <h2>Documentação: Preparação de Indicadores do IPEADATA (Método de Download em Lote)</h2>

      <h3>Finalidade no Aplicativo</h3>
      <p>
        O IPEADATA é uma fonte rica de dados, e este método descreve como obter grandes volumes de dados por temas (Regional, Macroeconômico, Social) usando acesso direto à API do IPEA. O objetivo final é preparar esses dados para o formato de importação de indicadores (<code>indicadores.csv</code>) do aplicativo.
      </p>
      <p>
        <strong>Importante:</strong> Este método baixa dados brutos que incluem todos os níveis territoriais e requerem um <strong>processamento significativo</strong> após o download para serem utilizáveis no aplicativo.
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

      <h3>Processo de Download em Lote e Preparação: Guia Conceitual</h3>

      <h4>Etapa 1: Download em Lote por Tema</h4>
      <p>Esta etapa foca em obter os dados brutos da API do IPEADATA.</p>
      <ol>
        <li>
          <strong>Listar Códigos de Séries do Tema:</strong>
          <p>Use <code>ipeadatapy.metadata(big_theme='SeuTema')</code> para obter a lista de todos os códigos de séries (`SERCODIGO`) dentro de um tema (ex: 'Regional').</p>
          <CodeBlock>{`import ipeadatapy
# Exemplo para tema Regional
metadados_tema = ipeadatapy.metadata(big_theme='Regional')
lista_codigos = metadados_tema['CODE'].tolist()
`}</CodeBlock>
        </li>
        <li>
          <strong>Baixar Dados em Lotes:</strong>
          <p>Para cada código de série na lista, faça uma requisição à API OData do IPEA (<code>http://www.ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='CODIGO_DA_SERIE')</code>). É recomendado fazer isso em lotes e usar processamento paralelo (como `ThreadPoolExecutor` em Python) para eficiência.</p>
          <CodeBlock>{`import requests
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm # Para barra de progresso

def fetch_serie_data(codigo):
    url = f"http://www.ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='{codigo}')"
    try:
        response = requests.get(url, timeout=30) # Adiciona timeout
        if response.status_code == 200:
            return response.json().get('value', []) # Retorna lista de valores da série
        else:
            # print(f"Erro {response.status_code} para {codigo}")
            return []
    except requests.exceptions.RequestException as e:
        # print(f"Erro de requisição para {codigo}: {e}")
        return []

# Exemplo de processamento de um lote de códigos
codigos_lote = lista_codigos[0:100] # Exemplo com os primeiros 100 códigos
dados_brutos_lote = []
with ThreadPoolExecutor(max_workers=10) as executor: # Ajuste max_workers
    resultados = list(tqdm(executor.map(fetch_serie_data, codigos_lote), total=len(codigos_lote)))
    for result in resultados:
        dados_brutos_lote.extend(result)

# Converter dados brutos do lote para DataFrame
df_bruto_lote = pd.DataFrame(dados_brutos_lote)
# Salvar lote bruto (opcional, mas recomendado)
# df_bruto_lote.to_csv(f'Regional_lote_1_bruto.csv', index=False, sep=';')
`}</CodeBlock>
          <p>Repita este passo para todos os lotes de códigos do tema.</p>
        </li>
        <li>
          <strong>Salvar Dados Brutos:</strong>
          <p>Converta os dados JSON recebidos de cada lote em um DataFrame pandas e salve-o como um arquivo CSV bruto (ex: <code>Regional_lote_1_bruto.csv</code>). Estes arquivos conterão todas as colunas da API (<code>SERCODIGO</code>, <code>VALDATA</code>, <code>VALVALOR</code>, <code>NIVNOME</code>, <code>TERCODIGO</code>, etc.) e dados de todos os níveis territoriais.</p>
          <CodeBlock>{`# Conceito: Converter lista de dicts JSON para DataFrame e salvar
# df_bruto_lote = pd.DataFrame(lista_de_resultados_json_do_lote)
# df_bruto_lote.to_csv(f'Tema_lote_N_bruto.csv', index=False, sep=';')`}</CodeBlock>
        </li>
      </ol>

      <h4>Etapa 2: Pós-Processamento para Formato do Aplicativo</h4>
      <p>Esta etapa é <strong>essencial</strong> e transforma os dados brutos baixados no formato longo exigido pelo <code>indicadores.csv</code>.</p>
      <ol>
        <li>
          <strong>Consolidar Dados Brutos:</strong>
          <p>Carregue e concatene todos os arquivos CSV brutos baixados na Etapa 1 em um único DataFrame pandas.</p>
        </li>
        <li>
          <strong>Filtrar Nível Municipal:</strong>
          <p>Mantenha apenas as linhas onde a coluna de nível (geralmente <code>NIVNOME</code>) indica 'Municípios'.</p>
          <CodeBlock>{`df_municipal = df_bruto_consolidado[df_bruto_consolidado['NIVNOME'] == 'Municípios'].copy()`}</CodeBlock>
        </li>
        <li>
          <strong>Selecionar Indicadores de Interesse:</strong>
          <p>Filtre o DataFrame para manter apenas as linhas correspondentes aos códigos de série (<code>SERCODIGO</code>) que você realmente deseja incluir no aplicativo.</p>
          <CodeBlock>{`codigos_desejados = ['PIB', 'POP', 'IDHM', ...] # Sua lista de SERCODIGO
df_filtrado = df_municipal[df_municipal['SERCODIGO'].isin(codigos_desejados)]`}</CodeBlock>
        </li>
        <li>
          <strong>Extrair e Formatar Colunas Essenciais:</strong>
          <ul>
            <li><strong>Ano:</strong> Extraia o ano (YYYY) da coluna de data (<code>VALDATA</code>) e converta para número inteiro. Nomeie como <code>Ano_Observacao</code>.</li>
            <li><strong>Código do Município:</strong> Selecione a coluna <code>TERCODIGO</code>, converta para texto/string e nomeie como <code>Codigo_Municipio</code>.</li>
            <li><strong>Valor:</strong> Selecione a coluna <code>VALVALOR</code>, converta para número (float) e nomeie como <code>Valor</code>.</li>
          </ul>
          <CodeBlock>{`df_processado = df_filtrado.copy()
df_processado['Ano_Observacao'] = pd.to_datetime(df_processado['VALDATA']).dt.year
df_processado['Codigo_Municipio'] = df_processado['TERCODIGO'].astype(str)
df_processado['Valor'] = pd.to_numeric(df_processado['VALVALOR'], errors='coerce')`}</CodeBlock>
        </li>
         <li>
          <strong>Mapear Nome do Indicador:</strong>
          <p>Crie a coluna <code>Nome_Indicador</code> usando os metadados do IPEA (obtidos no início ou via <code>ipeadatapy.metadata()</code>) para mapear cada <code>SERCODIGO</code> ao nome descritivo desejado para exibição no aplicativo.</p>
           <CodeBlock>{`# Exemplo conceitual de mapeamento e adição do nome
# metadados_tema = ipeadatapy.metadata(big_theme='Regional')
# mapa_nomes = metadados_tema.set_index('CODE')['NAME'].to_dict() # Ou carregar de arquivo
# df_processado['Nome_Indicador'] = df_processado['SERCODIGO'].map(mapa_nomes)
# Verifique se todos os SERCODIGO foram mapeados`}</CodeBlock>
        </li>
        <li>
          <strong>Ajustar Unidades de Medida:</strong>
          <p><strong>Fundamental:</strong> Verifique a unidade original de cada indicador nos metadados do IPEA (ex: Mil Reais, %, por 1000 hab.). Aplique as conversões necessárias na coluna <code>Valor</code> para que todos os indicadores estejam na unidade desejada para o aplicativo (ex: multiplicar valores em "Mil Reais" por 1000).</p>
        </li>
        <li>
          <strong>Limpeza Final e Seleção:</strong>
          <p>Remova linhas onde <code>Valor</code> ou <code>Ano_Observacao</code> sejam inválidos (NaN). Selecione apenas as colunas finais necessárias para a próxima etapa: <code>Codigo_Municipio</code>, <code>Nome_Indicador</code>, <code>Ano_Observacao</code>, <code>Valor</code>.</p>
          <CodeBlock>{`df_final_ipea = df_processado[['Codigo_Municipio', 'Nome_Indicador', 'Ano_Observacao', 'Valor']].copy()
df_final_ipea = df_final_ipea.dropna()`}</CodeBlock>
        </li>
        <li>
          <strong>Concatenar com Outras Fontes (se houver):</strong>
          <p>Combine este DataFrame (<code>df_final_ipea</code>) com dados processados de outras fontes (SNIS, etc.) em um único DataFrame consolidado.</p>
        </li>
      </ol>
       <p><strong>Próximo Passo Essencial:</strong> Após consolidar os dados formatados de <strong>todas</strong> as fontes desejadas, o próximo passo é calcular e adicionar a coluna <code>Indice_Posicional</code>, conforme descrito na documentação "Processo de Cálculo: Índice Posicional", antes de gerar o arquivo <code>indicadores.csv</code> final para importação.</p>
    </div>
  );
};

export default TransformacaoIPEADATA;
