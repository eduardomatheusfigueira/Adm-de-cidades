# Jogo de Administração e Eleições do Brasil

## Visão Geral

Este projeto visa criar um jogo de simulação focado na administração e eleições de cidades no Brasil, utilizando dados públicos históricos. O jogo permitirá aos jogadores administrar municípios, tomar decisões políticas e administrativas, participar de eleições simuladas e analisar o impacto de suas decisões com base em dados reais.

## Tecnologias

- **Frontend Framework**: React com Vite
- **Visualização de Mapas**: Mapbox GL JS
- **Dados Geográficos**: GeoJSON do IBGE
- **Dados Demográficos e Socioeconômicos**: CSVs de fontes públicas (simulados por enquanto)

## Estrutura do Projeto

```
brazil-game/
├── data/            # Arquivos GeoJSON e CSV
├── src/             # Código fonte React
│   ├── components/  # Componentes React reutilizáveis
│   ├── styles/      # Folhas de estilo CSS
│   ├── App.jsx      # Componente principal da aplicação
│   ├── main.jsx     # Ponto de entrada da aplicação
│   └── index.css    # Estilos globais
├── index.html       # HTML principal
├── package.json     # Arquivo de configuração do NPM
├── vite.config.js   # Configuração do Vite
├── roadmaps/        # Histórico de roadmaps
├── roadmap.txt      # Plano de desenvolvimento atual
├── README.md        # Este arquivo
└── notes.txt        # Notas de desenvolvimento e informações úteis
```

## Como Iniciar

1. **Instale as dependências:**
   Navegue até a pasta raiz do projeto (`/home/project`) e execute:
   ```sh
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   Execute o seguinte comando na pasta raiz do projeto:
   ```sh
   npm run dev
   ```

3. **Acesse o jogo:**
   O jogo será aberto automaticamente no seu navegador ou você pode acessá-lo através do URL local fornecido no terminal.

## Roadmap do Projeto

O arquivo `roadmap.txt` contém o plano de desenvolvimento detalhado e o progresso atual do projeto. Consulte-o para obter informações sobre as próximas funcionalidades e etapas.

## Notas de Desenvolvimento

Informações adicionais, como tokens de API e links para fontes de dados, podem ser encontradas no arquivo `notes.txt`.

## Contribuições

Contribuições são bem-vindas! Se você tiver ideias para melhorar o jogo ou encontrou algum problema, por favor, abra uma issue ou envie um pull request.
