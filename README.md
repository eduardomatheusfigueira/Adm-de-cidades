# Linha do Tempo Interativa da História do Brasil

## Descrição do Projeto

Este projeto apresenta uma linha do tempo interativa e visualmente moderna da história do Brasil, abrangendo eventos de 8000 a.C. até 1945. O objetivo principal é oferecer uma ferramenta intuitiva e responsiva para explorar a história brasileira através de múltiplas fontes bibliográficas renomadas. A interface foi completamente redesenhada para proporcionar uma experiência de usuário otimizada e contemporânea, mantendo todas as funcionalidades existentes e adicionando melhorias visuais e de usabilidade.

## Funcionalidades

*   **Interface Moderna e Responsiva:** Design contemporâneo e arrojado, otimizado para diferentes dispositivos e tamanhos de tela, proporcionando uma experiência de usuário consistente e agradável.
*   **Visualização Abrangente:** Apresenta eventos e períodos históricos de 8000 a.C. até 1945, cobrindo a história do Brasil desde os tempos pré-coloniais até meados do século XX.
*   **Múltiplas Fontes Integradas:** Combina dados de "A Invenção do Trabalhismo", "Raízes do Brasil", "1499: O Brasil antes de Cabral", "Casa-Grande & Senzala" e "A Urbanização Brasileira", oferecendo uma visão multifacetada da história.
*   **Filtros Interativos:** Permite filtrar eventos por fonte bibliográfica e personagens históricos, facilitando a exploração de temas e perspectivas específicas.
*   **Categorização de Eventos:** Eventos são categorizados (Política, Social, Econômico, Cultural, etc.) e codificados por cores para fácil identificação e análise.
*   **Tooltips Detalhados:** Exibe tooltips informativos e visualmente aprimorados ao passar o mouse sobre eventos e períodos, fornecendo descrições detalhadas e contexto histórico.
*   **Zoom e Navegação:** Funcionalidades de zoom e navegação horizontal intuitivas, permitindo explorar a linha do tempo em diferentes níveis de detalhe e focar em períodos específicos.
*   **Legenda Detalhada:** Inclui legendas para categorias de eventos e fontes bibliográficas, auxiliando na compreensão da visualização.
*   **Lista de Personagens:** Apresenta uma lista de personagens históricos relevantes, com possibilidade de filtro e destaque de eventos relacionados.
*   **Filtro por Período:** Permite focar em períodos históricos específicos como Pré-Colonial, Colonial, Imperial e Republicano.
*   **Desempenho Otimizado:** Animações e transições suaves, scrollbars personalizados e layout responsivo contribuem para uma experiência de uso fluida e eficiente.
*   **Modo Escuro Automático:** Detecção automática das preferências do sistema para modo claro ou escuro, proporcionando conforto visual em diferentes ambientes.

## Fontes de Dados

Os dados para esta linha do tempo foram extraídos e adaptados das seguintes obras:

*   **1499: O Brasil antes de Cabral** de Reinaldo José Lopes
*   **A Casa-Grande & Senzala** de Gilberto Freyre
*   **A Invenção do Trabalhismo** de Angela de Castro Gomes
*   **As Raízes do Brasil** de Sérgio Buarque de Holanda
*   **A Urbanização Brasileira** de Milton Santos

## Tecnologias Utilizadas

*   **TypeScript:** Linguagem de programação principal para desenvolvimento da aplicação, garantindo tipagem estática e melhor organização do código.
*   **D3.js:** Biblioteca JavaScript poderosa para manipulação de documentos baseados em dados e criação de visualizações dinâmicas e interativas.
*   **Vite:** Ferramenta de build e servidor de desenvolvimento extremamente rápido, otimizada para aplicações web modernas, proporcionando um ambiente de desenvolvimento ágil.
*   **HTML & CSS:** Para a estrutura e estilização da página web, com CSS moderno e variáveis para fácil manutenção e customização do design.

## Como Executar o Projeto

1.  **Instalar dependências:**
    ```shell
    npm install
    ```
2.  **Iniciar o servidor de desenvolvimento:**
    ```shell
    npm run dev
    ```
3.  **Visualizar no navegador:**
    O projeto estará disponível em `http://localhost:5173` ou no endereço fornecido pelo Vite no terminal.

## Utilização

Ao abrir a aplicação no navegador, você verá a linha do tempo da história do Brasil com a nova interface visual.

*   **Navegação Horizontal:** Clique e arraste na linha do tempo para navegar horizontalmente pelos anos. A navegação foi aprimorada para ser mais intuitiva e responsiva.
*   **Zoom:** Utilize os botões '+' e '-' para aumentar e diminuir o zoom da linha do tempo. O botão "Resetar Zoom" restaura o zoom original.
*   **Filtro por Período:** Selecione um período no menu dropdown "Período" para focar em uma era específica da história do Brasil.
*   **Filtro por Fonte:** Utilize a lista "Filtrar por Fonte" para selecionar ou desmarcar fontes bibliográficas e visualizar apenas os eventos relacionados a fontes específicas. A interface dos filtros foi modernizada para melhor usabilidade.
*   **Lista de Personagens:** Explore a lista "Personagens Históricos" para selecionar personagens e destacar os eventos relacionados a eles na linha do tempo. Clique em um personagem para ativar/desativar o filtro. A apresentação da lista de personagens foi visualmente melhorada.
*   **Tooltips:** Passe o mouse sobre os eventos e períodos na linha do tempo para ver informações detalhadas em tooltips com design renovado e melhor legibilidade.
*   **Legenda:** Consulte a legenda para entender as categorias de eventos e as cores associadas às fontes bibliográficas. A legenda foi reorganizada e estilizada para melhor clareza.
*   **Modo Escuro:** A aplicação agora suporta modo escuro automático, adaptando-se às preferências de tema do seu sistema operacional para uma visualização mais confortável em diferentes condições de iluminação.

## Customização

*   **Dados:** Os dados da linha do tempo estão localizados nos arquivos dentro do diretório `src/`. Para adicionar ou modificar eventos e períodos, edite os arquivos `.ts` correspondentes.
*   **Estilos:** Os estilos da aplicação foram completamente revisados e podem ser modificados no arquivo `src/style.css`. Variáveis CSS foram amplamente utilizadas para facilitar a customização e manutenção do tema visual.
*   **Configuração:** A configuração do projeto (como template do Vite) está no arquivo `config.json`.

## Créditos

*   Desenvolvido por Eduardo Matheus Figueira
*   Baseado em dados e informações das obras listadas em "Fontes de Dados".
*   Utiliza a biblioteca D3.js (d3js.org) para visualização de dados.
*   Desenvolvido com Vite (vitejs.dev).

## Licença

[Caso deseje adicionar uma licença, como MIT License, especifique aqui]

---
