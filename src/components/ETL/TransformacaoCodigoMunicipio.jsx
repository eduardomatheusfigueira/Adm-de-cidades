import React from 'react';

const TransformacaoCodigoMunicipio = () => {
  const CodeBlock = ({ children }) => <pre><code>{children}</code></pre>;

  return (
    <div className="transformation-details">
      <h2>Documentação: Correção de Código de Município (6 para 7 Dígitos)</h2>

      <h3>Problema Comum e Finalidade</h3>
      <p>
        Algumas fontes de dados, especialmente sistemas mais antigos ou certas exportações do DATASUS/TABNET, podem fornecer o código do município com apenas 6 dígitos, omitindo o dígito verificador final. No entanto, o padrão IBGE oficial e o código utilizado internamente pelo aplicativo para identificação única é o de <strong>7 dígitos</strong>.
      </p>
      <p>
        É <strong>essencial</strong> corrigir quaisquer códigos de 6 dígitos para o formato completo de 7 dígitos antes de importar o arquivo <code>indicadores.csv</code>. Caso contrário, os indicadores não serão associados corretamente aos municípios no aplicativo.
      </p>
      <p>
        Esta página descreve um método para realizar essa correção utilizando o arquivo <code>municipios.csv</code> (que contém os códigos corretos de 7 dígitos) como referência.
      </p>

      <h3>Pré-requisitos</h3>
      <ul>
        <li>Um arquivo de indicadores já processado no formato "longo", mas com a coluna <code>Codigo_Municipio</code> potencialmente contendo códigos de 6 dígitos (ex: <code>indicadores_6digitos.csv</code>).</li>
        <li>O arquivo <code>municipios.csv</code> padrão do aplicativo, contendo a coluna <code>Codigo_Municipio</code> com os códigos corretos de 7 dígitos.</li>
      </ul>

      <h3>Lógica da Correção</h3>
      <p>A estratégia consiste em usar os 6 primeiros dígitos de um código para encontrar o código completo de 7 dígitos correspondente no arquivo de referência.</p>
      <ol>
        <li>
          <strong>Criar um Mapa de Correção:</strong> Ler a coluna <code>Codigo_Municipio</code> do arquivo <code>municipios.csv</code> (7 dígitos). Criar uma estrutura de mapeamento (como um dicionário Python) onde a chave é os 6 primeiros dígitos do código e o valor é o código completo de 7 dígitos.
        </li>
        <li>
          <strong>Iterar e Corrigir:</strong> Ler o arquivo de indicadores com códigos de 6 dígitos. Para cada linha:
          <ul>
            <li>Obtenha o código de 6 dígitos da coluna <code>Codigo_Municipio</code>.</li>
            <li>Verifique se ele tem pelo menos 6 dígitos (após converter para string, se necessário).</li>
            <li>Use os 6 primeiros dígitos como chave para buscar no mapa de correção criado no passo 1.</li>
            <li>Se uma correspondência for encontrada no mapa, substitua o código original de 6 dígitos pelo código completo de 7 dígitos do mapa.</li>
            <li>Se não houver correspondência ou o código original for inválido (ex: NaN, menos de 6 dígitos), mantenha o valor original ou trate como erro, conforme a necessidade.</li>
          </ul>
        </li>
        <li>
          <strong>Salvar Resultado:</strong> Salve o arquivo de indicadores com a coluna <code>Codigo_Municipio</code> agora corrigida para 7 dígitos.
        </li>
      </ol>

      <h3>Implementação Conceitual (Python/pandas)</h3>
      <CodeBlock>{`import pandas as pd

def corrigir_codigo_municipio(df_a_corrigir, df_referencia_7digitos,
                              col_cod_corrigir='Codigo_Municipio',
                              col_cod_ref='Codigo_Municipio'):
    """
    Corrige códigos de município de 6 para 7 dígitos em um DataFrame.
    """
    print("Iniciando correção de códigos...")
    # Garantir que a coluna de referência é string
    df_referencia_7digitos[col_cod_ref] = df_referencia_7digitos[col_cod_ref].astype(str)

    # 1. Criar mapa 6 -> 7 dígitos
    mapa_6_para_7 = {}
    for codigo_7 in df_referencia_7digitos[col_cod_ref].unique():
        if pd.notna(codigo_7) and len(codigo_7) >= 6:
             # Pega os 6 primeiros dígitos como chave, valor é o código completo
            mapa_6_para_7[codigo_7[:6]] = codigo_7

    print(f"Mapa de correção criado com {len(mapa_6_para_7)} entradas.")

    # 2. Função para aplicar a correção linha a linha
    def aplicar_correcao(codigo_original):
        if pd.isna(codigo_original):
            return codigo_original # Mantém NaN

        # Tenta converter para string e remover '.0' se for número
        try:
            codigo_str = str(int(float(codigo_original)))
        except (ValueError, TypeError):
             codigo_str = str(codigo_original) # Usa como string se não for número

        if len(codigo_str) >= 6:
            prefixo = codigo_str[:6]
            # Retorna o código de 7 dígitos do mapa, ou o original se não encontrar
            return mapa_6_para_7.get(prefixo, codigo_original)
        else:
            # Retorna original se for menor que 6 dígitos
            return codigo_original

    # 3. Aplicar a função de correção
    coluna_original = df_a_corrigir[col_cod_corrigir].copy()
    df_a_corrigir[col_cod_corrigir] = coluna_original.apply(aplicar_correcao)

    # Contar quantos códigos foram alterados (opcional)
    alterados = (df_a_corrigir[col_cod_corrigir] != coluna_original).sum()
    print(f"Correção aplicada. {alterados} códigos foram potencialmente alterados.")

    return df_a_corrigir

# --- Exemplo de Uso ---
path_indicadores_6dig = 'path/to/indicadores_6digitos.csv'
path_municipios_7dig = 'path/to/municipios.csv' # Arquivo de referência

try:
    # Ler garantindo que códigos sejam lidos como texto (object/string)
    df_indicadores = pd.read_csv(path_indicadores_6dig, sep=';', dtype={ 'Codigo_Municipio': str })
    df_municipios_ref = pd.read_csv(path_municipios_7dig, sep=';', dtype={ 'Codigo_Municipio': str })

    # Aplicar a correção
    df_corrigido = corrigir_codigo_municipio(df_indicadores, df_municipios_ref)

    # Salvar o resultado
    path_output = 'path/to/indicadores_7digitos_corrigido.csv'
    df_corrigido.to_csv(path_output, sep=';', index=False)
    print(f"Arquivo corrigido salvo em: {path_output}")

except FileNotFoundError:
    print("Erro: Verifique os caminhos dos arquivos de entrada.")
except Exception as e:
    print(f"Ocorreu um erro: {e}")

`}</CodeBlock>

      <h3>Considerações Importantes</h3>
      <ul>
        <li><strong>Qualidade da Referência:</strong> A eficácia da correção depende da qualidade e completude do arquivo <code>municipios.csv</code> de referência (7 dígitos).</li>
        <li><strong>Códigos Inválidos:</strong> Códigos no arquivo de origem que não tenham pelo menos 6 dígitos ou cujo prefixo de 6 dígitos não exista na referência não serão corrigidos. É importante verificar esses casos após a execução.</li>
        <li><strong>Performance:</strong> Para arquivos de indicadores muito grandes, a aplicação linha a linha (`.apply()`) pode ser lenta. Abordagens mais vetorizadas (como merge) podem ser consideradas para otimização, embora a lógica de mapeamento por prefixo seja um pouco mais complexa de vetorizar diretamente.</li>
        <li><strong>Quando Aplicar:</strong> Realize esta correção <strong>antes</strong> de calcular o Índice Posicional, pois o cálculo do índice depende da correta identificação dos municípios.</li>
      </ul>
    </div>
  );
};

export default TransformacaoCodigoMunicipio;
