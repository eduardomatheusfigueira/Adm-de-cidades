import React from 'react';

const TransformacaoMunicipios = () => {
  const CodeBlock = ({ children }) => <pre><code>{children}</code></pre>;

  return (
    <div className="transformation-details">
      <h2>Documentação: Preparação do Arquivo Cadastral de Municípios</h2>

      <h3>Finalidade no Aplicativo</h3>
      <p>
        O arquivo <code>municipios.csv</code> é a espinha dorsal para a identificação e contextualização dos municípios dentro do aplicativo. Ele contém as informações essenciais que permitem ao sistema:
      </p>
      <ul>
        <li>Identificar unicamente cada município através do seu código IBGE.</li>
        <li>Exibir o nome correto e a localização geográfica (Estado, Região).</li>
        <li>Fornecer dados básicos como área territorial e se é uma capital.</li>
        <li>Potencialmente posicionar municípios em mapas ou realizar análises espaciais básicas usando as coordenadas da sede.</li>
      </ul>
      <p>Sem um arquivo <code>municipios.csv</code> correto e completo, muitas funcionalidades do aplicativo podem não operar como esperado.</p>

      <h3>Formato Exigido para Importação (<code>municipios.csv</code>)</h3>
      <p>
        Para garantir a compatibilidade com o aplicativo, o arquivo <strong>deve</strong> seguir rigorosamente as seguintes especificações:
      </p>
      <ul>
        <li><strong>Tipo de Arquivo:</strong> CSV (Comma Separated Values)</li>
        <li><strong>Separador de Colunas:</strong> Ponto e vírgula (<code>;</code>)</li>
        <li><strong>Separador Decimal para Números:</strong> Ponto (<code>.</code>)</li>
        <li><strong>Codificação de Texto:</strong> UTF-8 (altamente recomendado para evitar problemas com acentuação)</li>
        <li><strong>Cabeçalho:</strong> A primeira linha deve conter os nomes exatos das colunas listadas abaixo.</li>
      </ul>
      <h4>Colunas Obrigatórias (Nome Exato e Tipo Esperado):</h4>
      <ul className="column-list">
        <li><code>Codigo_Municipio</code> (Texto): Código IBGE completo (7 dígitos). Ex: <code>"4106902"</code></li>
        <li><code>Nome_Municipio</code> (Texto): Nome oficial. Ex: <code>"Curitiba"</code></li>
        <li><code>Sigla_Estado</code> (Texto): Sigla da UF (2 caracteres maiúsculos). Ex: <code>"PR"</code></li>
        <li><code>Sigla_Regiao</code> (Texto): Sigla da Região Geográfica (N, NE, SE, S, CO). Ex: <code>"S"</code></li>
        <li><code>Area_Municipio</code> (Número): Área em km². Ex: <code>434.892</code></li>
        <li><code>Capital</code> (Booleano): <code>true</code> ou <code>false</code> (sem aspas). Ex: <code>true</code></li>
        <li><code>Longitude_Municipio</code> (Número): Longitude em graus decimais. Ex: <code>-49.2776</code></li>
        <li><code>Latitude_Municipio</code> (Número): Latitude em graus decimais. Ex: <code>-25.4296</code></li>
        <li><code>Altitude_Municipio</code> (Número): Altitude em metros. Ex: <code>934</code></li>
      </ul>
      <p><strong>Atenção:</strong> A ordem das colunas no arquivo CSV não importa, mas os nomes dos cabeçalhos devem ser idênticos aos especificados.</p>

      <h3>Como Construir o Arquivo: Guia Conceitual</h3>
      <p>
        A criação deste arquivo envolve coletar e organizar dados de fontes oficiais e confiáveis.
      </p>
      <ol>
        <li>
          <strong>Passo 1: Obter a Lista Base de Municípios:</strong>
          <p>Utilize uma fonte oficial (como IBGE ou IPEADATA) para obter a lista completa e atualizada de municípios brasileiros, garantindo que você tenha o <strong>Código IBGE de 7 dígitos</strong> e o <strong>Nome Oficial</strong> de cada um.</p>
        </li>
        <li>
          <strong>Passo 2: Coletar Dados Adicionais:</strong>
          <p>Para cada município na sua lista base, busque as seguintes informações em fontes confiáveis (IBGE, IPEADATA, portais estaduais):</p>
          <ul>
            <li>Sigla do Estado (UF)</li>
            <li>Área Territorial (km²)</li>
            <li>Status de Capital (Sim/Não)</li>
            <li>Coordenadas Geográficas da Sede (Latitude, Longitude)</li>
            <li>Altitude da Sede (Metros)</li>
          </ul>
        </li>
        <li>
          <strong>Passo 3: Padronizar e Formatar:</strong>
          <p>Reúna todos os dados em uma tabela única (planilha ou DataFrame).</p>
          <ul>
            <li>Converta o Status de Capital para os valores literais <code>true</code> ou <code>false</code>.</li>
            <li>Derive a Sigla da Região a partir da Sigla do Estado (ex: PR {'->'} S, SP {'->'} SE).</li>
            <li>Certifique-se de que todos os valores numéricos (Área, Lat, Lon, Alt) usem <strong>ponto</strong> como separador decimal. Remova separadores de milhar.</li>
            <li>Garanta que o Código IBGE seja tratado como texto (para preservar zeros à esquerda, se houver).</li>
            <li>Verifique se não há dados ausentes nas colunas obrigatórias.</li>
          </ul>
        </li>
        <li>
          <strong>Passo 4: Renomear Colunas e Exportar:</strong>
          <p>Renomeie os cabeçalhos das colunas para que correspondam <strong>exatamente</strong> aos nomes definidos na seção "Formato Requerido".</p>
          <p>Exporte a tabela final como um arquivo CSV, configurando o separador de colunas para ponto e vírgula (<code>;</code>).</p>
          <CodeBlock>{`# Exemplo Conceitual (pandas)
# Supondo que df_consolidado contém os dados formatados
df_consolidado = df_consolidado.rename(columns={'IBGE7': 'Codigo_Municipio', 'Nome': 'Nome_Municipio', ...})
colunas_finais = ['Codigo_Municipio', 'Nome_Municipio', 'Sigla_Estado', ...] # Lista completa
df_final = df_consolidado[colunas_finais]
df_final.to_csv('municipios.csv', index=False, sep=';', decimal='.')`}</CodeBlock>
        </li>
      </ol>
      <p>Manter este arquivo atualizado, especialmente após a criação de novos municípios ou mudanças territoriais, é fundamental para a integridade dos dados no aplicativo.</p>
    </div>
  );
};

export default TransformacaoMunicipios;
