import React, { createContext, useState, useCallback } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  // Estados de UI e Seleções do Usuário (movidos de App.jsx)
  const [selectedCityInfo, setSelectedCityInfo] = useState(null);
  const [colorAttribute, setColorAttribute] = useState('Sigla_Regiao'); // Default
  const [visualizationConfig, setVisualizationConfig] = useState(null);
  const [activeEnvironment, setActiveEnvironment] = useState('dataSourceInfo'); // Default
  const [legendConfigByKey, setLegendConfigByKey] = useState({});

  const [showAttributeLegend, setShowAttributeLegend] = useState(true);
  const [showAnnotationLegend, setShowAnnotationLegend] = useState(true);
  const [showNorthArrow, setShowNorthArrow] = useState(true);
  const [showScaleBar, setShowScaleBar] = useState(true);
  const [showGraticule, setShowGraticule] = useState(false);
  const [graticuleStyle, setGraticuleStyle] = useState({
    fontSize: 9,
    bold: false,
    italic: false,
    textColor: '#ffffff',
    showHalo: true,
    haloColor: '#000000',
    haloWidth: 0.5,
    lineColor: 'rgba(120, 140, 170, 0.45)',
    lineWidth: 0.8,
    lineOpacity: 0.45,
  });
  const [northArrowStyle, setNorthArrowStyle] = useState({
    type: 'noun', // 'noun', 'classic', 'minimal', 'compass'
    showBg: true,
    color: '#00242D',
  });
  const [showMeasurements, setShowMeasurements] = useState(true); // Alternar exibição de medidas no mapa
  const [showImageStudio, setShowImageStudio] = useState(false);
  // Assistente de dados aberto de qualquer tela: 'malha' | 'tabela' | null
  const [dataWizardMode, setDataWizardMode] = useState(null);
  const [exportPages, setExportPages] = useState([]);

  // Função para lidar com a aplicação de filtros (parte que estava em App.jsx)
  // A outra parte (applyFiltersToCsvData) está no DataContext
  const handleFilterSettingsChange = useCallback((newColorAttribute) => {
    setColorAttribute(newColorAttribute);
    setVisualizationConfig(null); // Resetar config de visualização ao aplicar filtros gerais
    console.log("[UIContext] Filter settings changed, new colorAttribute:", newColorAttribute);
  }, []);

  // Função para mudar a configuração de visualização (movida de App.jsx)
  const handleVisualizationConfigChange = useCallback((config) => {
    console.log("[UIContext] Configuração de visualização aplicada:", config);
    setVisualizationConfig(config);
    // Se a visualização for por atributo, atualiza o colorAttribute também
    if (config && config.type === 'attribute' && config.attribute) {
      setColorAttribute(config.attribute);
    }
    // Se for por indicador, o MapContext usará 'visualization_value' e o colorAttribute aqui não é o primário para cor.
    // Mas pode ser útil manter o último atributo selecionado se o usuário voltar para visualização por atributo.
  }, []);

  const updateLegendConfig = useCallback((legendKey, config) => {
    if (!legendKey) return;
    setLegendConfigByKey(prev => ({
      ...prev,
      [legendKey]: config
    }));
  }, []);

  const clearLegendConfig = useCallback((legendKey) => {
    if (!legendKey) return;
    setLegendConfigByKey(prev => {
      const next = { ...prev };
      delete next[legendKey];
      return next;
    });
  }, []);

  const value = {
    selectedCityInfo,
    setSelectedCityInfo,
    colorAttribute,
    setColorAttribute, // Expor diretamente se necessário
    visualizationConfig,
    setVisualizationConfig, // Expor diretamente se necessário
    activeEnvironment,
    setActiveEnvironment,
    legendConfigByKey,
    updateLegendConfig,
    clearLegendConfig,
    showAttributeLegend,
    setShowAttributeLegend,
    showAnnotationLegend,
    setShowAnnotationLegend,
    showNorthArrow,
    setShowNorthArrow,
    showScaleBar,
    setShowScaleBar,
    showGraticule,
    setShowGraticule,
    graticuleStyle,
    setGraticuleStyle,
    northArrowStyle,
    setNorthArrowStyle,
    showMeasurements,
    setShowMeasurements,
    showImageStudio,
    setShowImageStudio,
    dataWizardMode,
    setDataWizardMode,
    exportPages,
    setExportPages,
    handleFilterSettingsChange, // Chamado pelo MapPanel/App.jsx
    handleVisualizationConfigChange, // Chamado pelo MapPanel/App.jsx
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
