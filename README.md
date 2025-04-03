# Jogo de Administração e Eleições do Brasil

## Descrição

Este projeto visa criar um jogo de simulação da administração pública e eleições no Brasil. O jogo utilizará dados públicos para modelar cidades, estados e o país, permitindo aos jogadores tomar decisões administrativas e participar de eleições simuladas.

## Funcionalidades Atuais

- **Mapa Interativo:** Visualização do mapa do Brasil com setores censitários, utilizando Mapbox GL JS.
- **Editor de Cidades:** Interface para editar atributos de cidades diretamente no mapa.
  - Edição de nome, população, economia, descrição e geometria (JSON).
  - **Layout do Editor de Cidades Refatorado:** Interface de usuário redesenhada com layout aprimorado utilizando CSS Grid para melhor organização e usabilidade. Exibição de atributos e dados em tabela em uma única janela formatada.
- **Dados CSV:** Integração de dados de arquivos CSV para enriquecer as informações das cidades.

## Próximos Passos

- Finalizar ajustes no layout do Editor de Cidades e garantir responsividade.
- Implementar regras básicas do jogo e lógica de administração municipal.
- Desenvolver sistema de eleições simuladas.
- Adicionar mais dados e indicadores ao jogo.

## Roadmap Detalhado

O roadmap completo e atualizado do projeto pode ser encontrado em [roadmaps/roadmap_revision_8.txt](roadmaps/roadmap_revision_8.txt). As revisões anteriores do roadmap também estão disponíveis na pasta `roadmaps/`.

## Tecnologias Utilizadas

- **Frontend:** React, Mapbox GL JS, HTML, CSS, JavaScript, Vite
- **Backend:** (A definir, possivelmente Node.js ou Python para etapas futuras, dependendo da necessidade de processamento de dados mais complexo - atualmente frontend-centric)
- **Dados:** Dados públicos do governo brasileiro (IBGE, TSE, etc.), GeoJSON, CSV

## Como Contribuir

Contribuições são bem-vindas! Se você tiver ideias, sugestões de melhorias ou quiser ajudar no desenvolvimento, por favor, entre em contato ou envie um pull request.

## Instalação e Execução

Para executar o jogo localmente, siga os seguintes passos:

1.  **Clone o repositório:** (Este passo assume que você já tem o código no seu ambiente WebContainer)

    ```bash
    git clone [URL do repositório]
    cd brazil-game-frontend
    ```

2.  **Instale as dependências:** Utilize o npm para instalar as dependências listadas no arquivo `package.json`.

    ```bash
    npm install
    ```

3.  **Execute o servidor de desenvolvimento:** Inicie o servidor de desenvolvimento Vite para rodar o jogo no seu navegador.

    ```bash
    npm run dev
    ```

4.  **Acesse o jogo no navegador:** O Vite iniciará um servidor de desenvolvimento local. Abra o URL fornecido no seu navegador (geralmente `http://localhost:5173`) para visualizar e interagir com o Jogo de Administração e Eleições do Brasil.

### Observações sobre o Ambiente WebContainer

Este projeto foi desenvolvido para rodar em um ambiente WebContainer, que possui algumas características importantes:

-   **Ambiente emulador:** O WebContainer emula um sistema Linux no navegador, mas não é um sistema Linux completo.
-   **Restrições de bibliotecas Python:**  A execução de Python é limitada à biblioteca padrão. Não é possível instalar bibliotecas de terceiros com `pip`.
-   **Ausência de compiladores C/C++:** Não há compiladores C/C++ disponíveis, o que impede a execução de binários nativos ou compilação de código C/C++.
-   **Servidor web:** O WebContainer pode executar servidores web utilizando Node.js e npm packages como Vite.
-   **Git não disponível:** O Git não está disponível no ambiente WebContainer.
-   **Scripts Node.js preferíveis:** Para tarefas de script, prefira Node.js em vez de shell scripts devido a limitações no suporte a shell scripts.

Certifique-se de seguir estas instruções para configurar e executar o ambiente de desenvolvimento corretamente.

## Licença

[MIT License](LICENSE)

---
**Última atualização:** 2024-08-08
