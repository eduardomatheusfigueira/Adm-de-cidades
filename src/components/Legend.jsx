import React, { useContext } from 'react'; // Adicionado useContext
import '../styles/Legend.css';
import { UIContext } from '../contexts/UIContext'; // Importado UIContext
// Para uma legenda dinâmica completa, precisaríamos também do DataContext e getColorScale
// import { DataContext } from '../contexts/DataContext';
// import { getColorScale } from '../utils/colorUtils';

const Legend = () => { // Removida a prop colorAttribute
  const { colorAttribute, visualizationConfig } = useContext(UIContext);
  // const { filteredCsvData } = useContext(DataContext); // Seria necessário para calcular stops dinamicamente

  let title = "Legenda";
  let legendItems = []; // Para armazenar itens da legenda como { value, color }
  let isDynamicScale = false; // Flag para indicar se é uma escala de gradiente

  if (visualizationConfig && visualizationConfig.type === 'indicator') {
    title = `Indicador: ${visualizationConfig.indicator} (${visualizationConfig.year})`;
    // Para indicadores, a escala é dinâmica e MapContext usa 'visualization_value'.
    // A legenda aqui precisaria recalcular os stops ou o MapContext precisaria expô-los.
    // Por simplicidade, vamos apenas mostrar o nome do indicador.
    isDynamicScale = true; // Assumindo que indicadores usam uma escala contínua
  } else if (colorAttribute) {
    title = `Atributo: ${colorAttribute}`;
    // Se não for indicador, é um atributo.
    // A lógica para gerar items para atributos categóricos (ex: Sigla_Regiao)
    // ou uma escala para numéricos precisaria ser implementada aqui.
    // Exemplo placeholder para Sigla_Regiao:
    if (colorAttribute === 'Sigla_Regiao') {
        legendItems = [
            { value: 'Norte', color: 'rgba(255,0,0,0.6)' }, // Cores de exemplo com opacidade
            { value: 'Nordeste', color: 'rgba(0,255,0,0.6)' },
            { value: 'Sudeste', color: 'rgba(0,0,255,0.6)' },
            { value: 'Sul', color: 'rgba(255,255,0,0.6)' },
            { value: 'Centro-Oeste', color: 'rgba(255,0,255,0.6)' },
        ];
    } else {
        // Para outros atributos, poderia ser uma escala numérica ou outras categorias.
        // Por ora, indicamos que a legenda detalhada será específica.
        isDynamicScale = true; // Assumindo que outros atributos podem ser numéricos
    }
  } else {
    return null; // Não renderiza nada se não houver atributo de cor ou config de visualização
  }

  // Nota: A lógica real para gerar `colorStops` dinamicamente com base em `filteredCsvData`
  // e `colorAttribute` (usando `getColorScale`) não está implementada aqui para manter
  // este passo focado na integração do UIContext.
  // Uma implementação completa exigiria acesso ao DataContext e à função getColorScale.

  return (
    <div className="legend">
      <div className="legend-title">{title}</div>
      {isDynamicScale && legendItems.length === 0 && (
         <p style={{ fontSize: '0.8em', color: '#555', marginTop: '5px', fontStyle: 'italic' }}>
           (Escala de cores dinâmica)
         </p>
      )}
      {!isDynamicScale && legendItems.map((item) => (
        <div key={item.value} className="legend-item">
          <span className="legend-color" style={{ backgroundColor: item.color }}></span>
          <span className="legend-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
