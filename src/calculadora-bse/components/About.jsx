import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const About = () => {
  return (
    <Container fluid className="p-4">
      <Row className="mb-4 justify-content-center">
        <Col xs={12} className="text-center">
          <h1>Calculadora de Retornos de Investimentos em Saneamento</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Visão Geral</h2>
          <p>
            <strong>Calculadora de Benefícios do Saneamento</strong> é uma aplicação web interativa e intuitiva, desenvolvida para estimar os retornos sobre investimentos em projetos de saneamento. Esta ferramenta foi criada para auxiliar gestores, planejadores e stakeholders a compreenderem de forma clara e objetiva os múltiplos benefícios que o saneamento adequado pode trazer para a sociedade. Ao calcular os retornos sobre o investimento em saneamento, a aplicação considera uma variedade de indicadores sociais, econômicos e de saúde, proporcionando uma visão holística e abrangente dos impactos positivos gerados.
          </p>
          <p>
            A aplicação permite aos usuários inserir dados de investimento e selecionar diferentes tipos de intervenção em saneamento, adaptando-se a diversos cenários e contextos. Com uma interface amigável, mesmo usuários sem conhecimento técnico especializado podem facilmente operar a calculadora e interpretar os resultados. Além disso, a ferramenta oferece funcionalidades de gerenciamento de coeficientes, permitindo que usuários avançados personalizem e ajustem os parâmetros de cálculo para refletir condições locais específicas ou dados mais precisos.
          </p>

          <h3>Intenção do Aplicativo</h3>
          <p>
            O principal objetivo desta calculadora é fornecer uma ferramenta prática e acessível para a avaliação de projetos de saneamento. Tradicionalmente, a análise de custo-benefício em saneamento pode ser complexa e exigir conhecimentos técnicos específicos. Esta aplicação simplifica esse processo, oferecendo uma interface intuitiva que permite aos usuários:
          </p>
          <ul>
            <li><strong>Quantificar os benefícios do saneamento:</strong>  Transformar os investimentos em saneamento em valores tangíveis de retorno social, econômico e de saúde.</li>
            <li><strong>Tomar decisões informadas:</strong>  Auxiliar gestores e planejadores a priorizar investimentos em saneamento com base em dados concretos sobre os retornos esperados.</li>
            <li><strong>Comunicar o valor do saneamento:</strong>  Fornecer uma ferramenta de comunicação eficaz para demonstrar aos stakeholders e à sociedade em geral os múltiplos benefícios do saneamento adequado.</li>
            <li><strong>Adaptar a diferentes contextos:</strong> Permitir a personalização dos coeficientes de cálculo para refletir as particularidades de diferentes regiões e projetos.</li>
          </ul>

          {/* Restante do conteúdo do README, formatado para JSX */}
          <h3>Estrutura do Aplicativo</h3>
          <p>O aplicativo é construído utilizando uma arquitetura frontend moderna, baseada em componentes reutilizáveis e gerenciada pela biblioteca React. A estrutura do projeto é organizada da seguinte forma:</p>
          <ul>
            <li><strong><code>public/</code></strong>: Contém arquivos estáticos que são servidos diretamente pelo servidor web, como o arquivo <code>index.html</code>.</li>
            <li>
              <strong><code>src/</code></strong>:  Diretório principal do código fonte da aplicação.
              <ul>
                <li><strong><code>assets/</code></strong>: Armazena recursos estáticos como imagens e logos.</li>
                <li><strong><code>components/</code></strong>:  Destinado a componentes React reutilizáveis.</li>
                <li><strong><code>CalculadoraBSEPage.jsx</code></strong>: Componente React principal que orquestra a interface do usuário e a lógica da aplicação da calculadora. Define a estrutura das seções, formulários, gráficos e tabelas.</li>
                <li><strong><code>calculator.js</code></strong>: Módulo JavaScript que contém toda a lógica de cálculo dos benefícios do saneamento. Define os coeficientes e a função <code>calculateBenefits.calculate()</code> que realiza os cálculos.</li>
                <li><strong><code>index.css</code></strong>: Arquivo CSS para estilos específicos da calculadora.</li>
                {/* main.jsx is not part of the integrated component */}
              </ul>
            </li>
            <li><strong><code>index.html</code></strong>: Arquivo HTML principal que define a estrutura básica da página web e inclui o ponto de montagem para a aplicação React (<code><div id="root"></div></code>).</li>
            <li><strong><code>package.json</code></strong>: Arquivo de manifesto do Node.js que lista as dependências do projeto (React, react-bootstrap, react-chartjs-2, chart.js, vite, etc.) e define scripts para executar tarefas como iniciar o servidor de desenvolvimento (<code>npm run dev</code>).</li>
            <li><strong><code>README.md</code></strong>: Arquivo de documentação do projeto, que fornece informações sobre o aplicativo, como utilizá-lo, a pilha tecnológica, etc.</li>
          </ul>

          <h3>Banco de Coeficientes</h3>
          <p>O "banco de coeficientes" é, na verdade, um conjunto de dados embutido diretamente no código fonte da aplicação, no arquivo <code>src/calculadora-bse/calculator.js</code>. Ele é estruturado como objetos JavaScript que armazenam os valores dos coeficientes utilizados nos cálculos de benefícios.</p>

          <p>Existem dois conjuntos principais de coeficientes:</p>
          <ol>
            <li>
              <strong><code>calculateBenefits.coeficientes</code></strong>: Este objeto contém coeficientes relacionados aos benefícios sociais e de saúde do saneamento, como "Aumento na Escolaridade Média", "Redução no Atraso Escolar", "Economia nos Custos com Saúde", etc. A estrutura é hierárquica:
              <ul>
                <li>O primeiro nível são os <strong>indicadores principais</strong> (ex: "Aumento na Escolaridade Média").</li>
                <li>O segundo nível são os <strong>sub-indicadores</strong> ou <strong>tipos de intervenção</strong> (ex: "Acesso à rede de esgoto", "Acesso à água tratada", "Disponibilidade de banheiro").</li>
                <li>
                  Para cada combinação de indicador principal e sub-indicador, há um objeto que define:
                  <ul>
                    <li><code>coefficient</code>: O valor numérico do coeficiente.</li>
                    <li><code>inputUnit</code>: A unidade de medida da entrada (ex: "%" para percentual).</li>
                    <li><code>outputUnit</code>: A unidade de medida da saída (ex: "%", "R$", "casos/1.000 habitantes").</li>
                  </ul>
                </li>
              </ul>
              <p>Exemplo:</p>
              <pre>
                <code>{`
"Aumento na Escolaridade Média": {
  "Acesso à rede de esgoto": { coefficient: 0.181, inputUnit: "%", outputUnit: "%" },
  // ... outros sub-indicadores
},
// ... outros indicadores principais
                `}</code>
              </pre>
            </li>
            <li>
              <strong><code>calculateBenefits.coeficientes_empregos</code></strong>: Este objeto contém coeficientes relacionados à geração de empregos e renda a partir de investimentos em saneamento. A estrutura é mais simples:
              <ul>
                <li>O primeiro nível são os <strong>indicadores de emprego/renda</strong> (ex: "Empregos Diretos na Construção Civil", "Total de Empregos Gerados por Investimentos").</li>
                <li>
                  Para cada indicador, há um objeto que define:
                  <ul>
                    <li><code>coefficient</code>: O valor numérico do coeficiente.</li>
                    <li><code>inputUnit</code>: A unidade de medida da entrada (ex: "R$1M" para R$1 milhão).</li>
                    <li><code>outputUnit</code>: A unidade de medida da saída (ex: "empregos").</li>
                  </ul>
                </li>
              </ul>
              <p>Exemplo:</p>
              <pre>
                <code>{`
"Empregos Diretos na Construção Civil": { coefficient: 7.588, inputUnit: "R$1M", outputUnit: "empregos" },
// ... outros indicadores de emprego
                `}</code>
              </pre>
            </li>
          </ol>

          <p><strong>Gerenciamento de Coeficientes:</strong></p>
          <p>A aplicação oferece uma interface de usuário na seção "Coeficientes" que permite visualizar, editar, adicionar e excluir coeficientes. As modificações feitas na interface são aplicadas diretamente aos objetos <code>calculateBenefits.coeficientes</code> e <code>calculateBenefits.coeficientes_empregos</code> em memória. <strong>É importante notar que, como esta é uma aplicação frontend sem backend, as alterações nos coeficientes não são persistentes após o fechamento ou recarregamento da página.</strong>  Se a persistência de dados for necessária, seria preciso implementar um backend e um banco de dados para armazenar e recuperar os coeficientes.</p>

          <h3>Funcionamento da Calculadora</h3>
          <p>A calculadora opera com base nos coeficientes definidos no "banco de coeficientes" e nas entradas fornecidas pelo usuário na seção "Calculadora". O processo de cálculo segue os seguintes passos:</p>

          <ol>
            <li>
              <strong>Entrada de Dados do Usuário:</strong>
              <ul>
                <li>O usuário seleciona o "Tipo de Intervenção":
                  <ul>
                    <li>"Aumento Percentual da Cobertura de Saneamento" (para esgoto, água ou banheiro).</li>
                    <li>"Investimento Monetário Direto em Saneamento".</li>
                  </ul>
                </li>
                <li>O usuário insere o "Valor da Intervenção":
                  <ul>
                    <li>Um valor percentual (se o tipo de intervenção for "Aumento Percentual...").</li>
                    <li>Um valor monetário em Reais (R$) se o tipo de intervenção for "Investimento Monetário Direto...").</li>
                  </ul>
                </li>
                <li>O usuário seleciona os "Indicadores" que deseja incluir no cálculo. Os indicadores disponíveis são filtrados com base no tipo de intervenção selecionado.</li>
              </ul>
            </li>
            <li>
              <strong>Cálculo dos Benefícios (Função <code>calculateBenefits.calculate()</code>):</strong>
              <ul>
                <li>A função <code>calculateBenefits.calculate(interventionType, coverageIncrease, investment, selectedIndicators)</code> é chamada com os dados de entrada do usuário.</li>
                <li>A função itera sobre os <code>selectedIndicators</code>.</li>
                <li>
                  Para cada indicador selecionado, ela verifica o <code>interventionType</code>:
                  <ul>
                    <li>
                      <strong>Se <code>interventionType</code> for "Aumento Percentual..."</strong>:
                      <ul>
                        <li>Ela busca o coeficiente correspondente no objeto <code>calculateBenefits.coeficientes</code>, com base no <code>selectedIndicator</code> e no tipo de saneamento (esgoto, água ou banheiro) derivado do <code>interventionType</code>.</li>
                        <li>O retorno é calculado multiplicando o <code>coefficient</code> pelo <code>coverageIncrease</code> (valor percentual inserido pelo usuário).</li>
                        <li>O resultado é formatado com a <code>outputUnit</code> correspondente.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Se <code>interventionType</code> for "Investimento Monetário Direto..."</strong>:
                      <ul>
                        <li>Para alguns indicadores de emprego (presentes em <code>calculateBenefits.coeficientes_empregos</code>), o retorno é calculado multiplicando o <code>coefficient</code> pelo <code>investment</code> (valor monetário inserido pelo usuário), possivelmente com alguma conversão de unidades (ex: converter investimento para milhões de Reais).</li>
                        <li>Para indicadores de renda (como "Renda Total Gerada na Economia"), são aplicados multiplicadores de renda pré-definidos (<code>calculateBenefits.multiplicador_renda</code>).</li>
                        <li>Para indicadores específicos como "Geração de Empregos Diretos" e "Total de Salários Gerados", são utilizadas fórmulas ou coeficientes específicos baseados no investimento total.</li>
                        <li>O resultado é formatado com a <code>outputUnit</code> correspondente (ex: "empregos", "R$").</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <strong>Exibição dos Resultados:</strong>
              <ul>
                <li>Os resultados calculados para cada indicador são armazenados em um array de objetos (<code>results</code>).</li>
                <li>
                  Os resultados são exibidos de duas formas:
                  <ul>
                    <li><strong>Gráfico de Barras:</strong> Um gráfico de barras interativo (gerado com <code>react-chartjs-2</code>) que visualiza os retornos para cada indicador. As barras são coloridas em verde para retornos positivos e vermelho para retornos negativos (embora, no contexto atual, todos os retornos devam ser positivos).</li>
                    <li><strong>Cards de Resultados:</strong> Cards responsivos que exibem o valor formatado do retorno e o nome do indicador para cada resultado calculado.</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ol>

          <p>Em resumo, a calculadora funciona aplicando coeficientes pré-definidos (armazenados no código) aos valores de investimento inseridos pelo usuário, de acordo com o tipo de intervenção e os indicadores selecionados. Ela simplifica a análise de benefícios do saneamento, fornecendo resultados visuais e numéricos de forma clara e acessível.</p>

          <h2>Pilha Tecnológica Robusta e Moderna</h2>
          <ul>
            <li>
              <strong>Frontend:</strong>
              <ul>
                <li><strong>React:</strong> Biblioteca JavaScript para construção de interfaces de usuário reativas e componentizadas.</li>
                <li><strong>Chart.js (via react-chartjs-2):</strong> Biblioteca para criação de gráficos interativos e visualmente atraentes.</li>
                <li><strong>Bootstrap (via react-bootstrap):</strong> Framework CSS para desenvolvimento rápido e responsivo, garantindo uma interface consistente e agradável.</li>
              </ul>
            </li>
            <li>
              <strong>Ferramenta de Build:</strong>
              <ul>
                <li><strong>Vite:</strong> Ferramenta de build extremamente rápida e eficiente para desenvolvimento frontend, otimizando o desempenho e a experiência de desenvolvimento.</li>
              </ul>
            </li>
          </ul>

          <h2>Estrutura do Projeto Organizada (Integrada)</h2>
          <pre>
            <code>{`
Adm-de-cidades/
├── ... (outros arquivos e diretórios de Adm-de-cidades)
├── src/
│   ├── ... (outros diretórios e arquivos de Adm-de-cidades)
│   ├── calculadora-bse/  # Código da calculadora integrado aqui
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Abacus.jsx
│   │   │   └── About.jsx
│   │   ├── CalculadoraBSEPage.jsx # Componente principal da calculadora
│   │   ├── calculator.js          # Lógica de cálculo
│   │   └── index.css              # Estilos específicos da calculadora
│   ├── App.jsx           # Componente principal de Adm-de-cidades (modificado para renderizar CalculadoraBSEPage)
│   ├── components/
│   │   └── VisualizationMenu.jsx # Modificado para adicionar link para Calculadora
│   └── main.jsx          # Ponto de entrada de Adm-de-cidades (modificado para importar Bootstrap CSS)
├── package.json        # Atualizado com dependências mescladas
└── ...
            `}</code>
          </pre>

          <h2>Guia de Uso Detalhado (Integrado)</h2>
          <p>A Calculadora de Retornos agora está acessível como uma seção dentro do aplicativo Adm-de-cidades.</p>
          <ol>
            <li>
              <strong>Navegação:</strong>
              <ul>
                <li>Utilize o menu principal do Adm-de-cidades (provavelmente o `VisualizationMenu`) para selecionar a seção "Calculadora BSE" (ou nome similar).</li>
              </ul>
            </li>
             <li>
              <strong>Seção "Calculadora":</strong> (Dentro da Calculadora BSE)
              <ul>
                <li><strong>Entrada de Investimento:</strong> Insira o valor total do investimento planejado no campo "Valor do Investimento".</li>
                <li>
                  <strong>Tipo de Intervenção:</strong> Selecione o tipo de intervenção no menu suspenso "Tipo de Intervenção". As opções são:
                  <ul>
                    <li>"Aumento Percentual da Cobertura de Saneamento": Escolha esta opção se o seu projeto visa aumentar a porcentagem da população com acesso a saneamento.</li>
                    <li>"Investimento Monetário Direto em Saneamento": Selecione esta opção se você possui um valor de investimento fixo e deseja calcular os benefícios a partir desse montante.</li>
                  </ul>
                </li>
                <li><strong>Seleção de Indicadores:</strong> Marque as caixas de seleção ao lado dos indicadores que você deseja incluir no cálculo. Os indicadores disponíveis mudarão dependendo do tipo de intervenção selecionado.</li>
                <li><strong>Botão "Calcular":</strong> Após inserir os dados e selecionar os indicadores, clique neste botão para realizar o cálculo dos benefícios.</li>
                <li>
                  <strong>Visualização dos Resultados:</strong> Os resultados serão exibidos em duas formas:
                  <ul>
                    <li><strong>Gráfico:</strong> Um gráfico interativo mostrará a distribuição dos benefícios entre os diferentes indicadores.</li>
                    <li><strong>Cards:</strong> Cards detalhados apresentarão os valores calculados para cada indicador selecionado.</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <strong>Seção "Coeficientes":</strong> (Dentro da Calculadora BSE)
              <ul>
                <li><strong>Visualizar Coeficientes:</strong> A tabela nesta seção exibe todos os coeficientes utilizados nos cálculos.</li>
                <li><strong>Editar Coeficiente:</strong> Modifique um coeficiente existente clicando em "Editar".</li>
                <li><strong>Excluir Coeficiente:</strong> Remova um coeficiente clicando em "Excluir".</li>
                <li><strong>Adicionar Coeficiente:</strong> Adicione um novo coeficiente clicando em "Adicionar Coeficiente".</li>
                <li><strong>Nota:</strong> As alterações nos coeficientes não são persistentes.</li>
              </ul>
            </li>
             <li>
              <strong>Seção "Ábaco":</strong> (Dentro da Calculadora BSE)
              <ul>
                 <li>Visualize e interaja com o ábaco que reflete as relações entre os indicadores.</li>
              </ul>
            </li>
             <li>
              <strong>Seção "Sobre":</strong> (Dentro da Calculadora BSE)
              <ul>
                 <li>Leia informações detalhadas sobre a Calculadora de Retornos.</li>
              </ul>
            </li>
          </ol>

          <h2>Contribuições são Bem-vindas!</h2>
          <p>Se você tem interesse em contribuir para o desenvolvimento e melhoria desta ferramenta, suas contribuições são muito bem-vindas!</p>

          <h2>Licença</h2>
          <p>[Adicionar informações sobre a licença sob a qual o projeto é distribuído. Exemplo: MIT License]</p>

          <h2>Contato</h2>
          <p>Desenvolvido por Itaipu Parquetec, Itaipu Binacional e Sanepar.</p>
          <p>Para questões, sugestões ou informações adicionais, entre em contato: contato@itaipuparquetec.com.br</p>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
