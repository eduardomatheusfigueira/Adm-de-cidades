import React, { createContext, useState, useContext, useCallback } from 'react';
import { DataContext } from './DataContext'; // Para chamar processGeometryImportInternal

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const { processGeometryImportInternal } = useContext(DataContext);

  // Estados de UI e Seleções do Usuário (movidos de App.jsx)
  const [selectedCityInfo, setSelectedCityInfo] = useState(null);
  const [colorAttribute, setColorAttribute] = useState('Sigla_Regiao'); // Default
  const [visualizationConfig, setVisualizationConfig] = useState(null);
  const [activeEnvironment, setActiveEnvironment] = useState('dataSourceInfo'); // Default

  // Estados para o modal de importação de geometria
  const [showGeometryImportModal, setShowGeometryImportModal] = useState(false);
  const [geometryImportData, setGeometryImportData] = useState(null); // Dados do arquivo GeoJSON importado
  const [municipalityCodeField, setMunicipalityCodeField] = useState(''); // Campo selecionado no modal

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

  // Função para abrir o modal de importação de geometria (parte de handleImportGeometry de App.jsx)
  const openGeometryImportModal = useCallback((fileData) => {
    setGeometryImportData(fileData); // Salva os dados do arquivo lido
    setShowGeometryImportModal(true);  // Abre o modal
  }, []);

  // Função para processar a importação de geometria após submissão do modal
  // (anteriormente processGeometryImport em App.jsx)
  const submitGeometryImport = useCallback(() => {
    if (geometryImportData && municipalityCodeField) {
      processGeometryImportInternal(geometryImportData, municipalityCodeField);
      setShowGeometryImportModal(false);
      setGeometryImportData(null);
      setMunicipalityCodeField('');
    } else {
      alert('Por favor, selecione o arquivo de geometria e o campo de código do município.');
    }
  }, [geometryImportData, municipalityCodeField, processGeometryImportInternal]);

  const value = {
    selectedCityInfo,
    setSelectedCityInfo,
    colorAttribute,
    setColorAttribute, // Expor diretamente se necessário
    visualizationConfig,
    setVisualizationConfig, // Expor diretamente se necessário
    activeEnvironment,
    setActiveEnvironment,
    showGeometryImportModal,
    setShowGeometryImportModal, // Expor para App.jsx controlar o modal
    geometryImportData,
    // setGeometryImportData, // Gerenciado por openGeometryImportModal e submitGeometryImport
    municipalityCodeField,
    setMunicipalityCodeField, // Expor para App.jsx controlar o campo do modal
    handleFilterSettingsChange, // Chamado por VisualizationMenu/App.jsx
    handleVisualizationConfigChange, // Chamado por VisualizationMenu/App.jsx
    openGeometryImportModal, // Chamado por FilterMenu/App.jsx
    submitGeometryImport,  // Chamado pelo modal dentro de App.jsx (ou futuramente um componente Modal dedicado)
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
