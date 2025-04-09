import React from 'react';
import '../styles/DataSourceInfo.css';

const WelcomeView = () => {
  return (
    <div className="data-source-info-environment">
      <div className="data-source-info-header">
        <h1>Bem-vindo ao Sistema de Administração de Cidades</h1>
      </div>
      <div className="data-source-info-content">
        <h2>Introdução</h2>
        <p>
          Este aplicativo foi desenvolvido para facilitar a análise, visualização e gestão de dados municipais.
          Você pode importar dados, explorar indicadores, visualizar mapas temáticos e realizar transformações nos dados.
        </p>
        <p>
          Use as abas acima para navegar entre as funcionalidades:
        </p>
        <ul>
          <li><strong>Início:</strong> Acesso às bases de dados e formatos de importação.</li>
          <li><strong>Visualização de Municípios:</strong> Mapa interativo com dados municipais.</li>
          <li><strong>Visualização de Indicadores:</strong> Análise detalhada de indicadores.</li>
          <li><strong>Processos de Transformação:</strong> Ferramentas para preparar e transformar seus dados.</li>
          <li><strong>Calculadora BSE:</strong> Cálculo de indicadores específicos.</li>
        </ul>
        <p>
          Para começar, escolha uma das abas no menu superior.
        </p>
      </div>
    </div>
  );
};

export default WelcomeView;
