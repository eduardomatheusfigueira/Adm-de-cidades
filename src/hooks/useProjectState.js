import { useCallback, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { UIContext } from '../contexts/UIContext';
import { AnnotationContext } from '../contexts/AnnotationContext';
import { MapContext } from '../contexts/MapContext';
import { sanitizeReferenceLayers } from '../utils/referenceLayers';

// Estado completo de um trabalho (dados, simbologia, anotações, páginas do Estúdio, mapa base
// e enquadramento). Usado por "Salvar/Carregar Perfil" e pelo salvamento automático.
export const PROFILE_VERSION = 3;

export function useProjectState() {
  const {
    csvData, setCsvData, setFilteredCsvData, csvHeaders, setCsvHeaders,
    indicadoresData, setIndicadoresData, geojsonData, setGeojsonData, ensureGeometryForUfs,
  } = useContext(DataContext);
  const {
    colorAttribute, setColorAttribute, visualizationConfig, setVisualizationConfig,
    legendConfigByKey, updateLegendConfig, exportPages, setExportPages,
  } = useContext(UIContext);
  const {
    annotations, setAnnotations, visualizations, setVisualizations,
    activeVisualizationId, setActiveVisualizationId,
  } = useContext(AnnotationContext);
  const { map, mapStyle, handleMapStyleChange, referenceLayers, setReferenceLayers } = useContext(MapContext);

  const getCamera = useCallback(() => {
    const m = map?.current;
    if (!m) return null;
    const c = m.getCenter();
    return { center: [c.lng, c.lat], zoom: m.getZoom(), bearing: m.getBearing(), pitch: m.getPitch() };
  }, [map]);

  const buildProfile = useCallback(() => {
    // Geometrias da malha embutida viram só a lista de UFs (perfil bem menor);
    // geometrias importadas pelo aluno continuam dentro do perfil
    const features = geojsonData?.features || [];
    const malhaUfs = [...new Set(features.filter(f => f.properties?.__base).map(f => String(f.properties.CD_MUN).slice(0, 2)))];
    const own = features.filter(f => !f.properties?.__base);
    return {
    version: PROFILE_VERSION,
    // Dados
    municipios: csvData,
    csvHeaders,
    indicadores: indicadoresData,
    geometrias: { type: 'FeatureCollection', features: own },
    malhaUfs,
    // Camadas de referência do aluno (SHP, KML, GeoJSON…)
    camadas: referenceLayers,
    // Visualização
    colorAttribute,
    visualizationConfig,
    legendConfigByKey,
    // Anotações
    annotations,
    visualizationsAnnot: visualizations,
    activeVisualizationId,
    // Estúdio
    exportPages,
    // Mapa
    mapStyle,
    camera: getCamera(),
  };
  }, [csvData, csvHeaders, indicadoresData, geojsonData, colorAttribute, visualizationConfig, legendConfigByKey,
    annotations, visualizations, activeVisualizationId, exportPages, mapStyle, getCamera, referenceLayers]);

  const applyProfile = useCallback((profile) => {
    if (!profile || typeof profile !== 'object') throw new Error('Perfil inválido');

    // Dados
    if (profile.municipios) {
      setCsvData(profile.municipios);
      setFilteredCsvData(profile.municipios);
      setCsvHeaders(profile.csvHeaders || Object.keys(profile.municipios[0] || {}));
    }
    if (profile.indicadores) setIndicadoresData(profile.indicadores);
    setReferenceLayers(sanitizeReferenceLayers(profile.camadas));
    if (profile.geometrias) setGeojsonData(profile.geometrias);
    // Malha embutida referenciada pelo perfil (carregada depois das geometrias próprias)
    if (Array.isArray(profile.malhaUfs) && profile.malhaUfs.length) {
      setTimeout(() => { ensureGeometryForUfs(profile.malhaUfs, true).catch(e => console.warn('Malha do perfil:', e)); }, 0);
    }

    if (profile.version >= 2) {
      if (profile.colorAttribute) setColorAttribute(profile.colorAttribute);
      if (profile.visualizationConfig !== undefined) setVisualizationConfig(profile.visualizationConfig);
      if (profile.legendConfigByKey) {
        Object.entries(profile.legendConfigByKey).forEach(([key, config]) => updateLegendConfig(key, config));
      }
      // Anotações — substitui tudo (sem duplicatas por id)
      const anns = profile.annotations ? [...new Map(profile.annotations.map(a => [a.id, a])).values()] : [];
      setAnnotations(anns);
      if (profile.visualizationsAnnot) {
        const uniqueViz = [...new Map(profile.visualizationsAnnot.map(v => [v.id, v])).values()];
        setVisualizations(uniqueViz);
        if (uniqueViz.length > 0) {
          // Ativar a visualização salva como ativa; senão, a primeira que tem anotações
          // (perfis antigos podem ter uma visualização vazia duplicada no início).
          const saved = uniqueViz.find(v => v.id === profile.activeVisualizationId);
          const withAnns = uniqueViz.find(v => anns.some(a => a.visualizationId === v.id));
          setActiveVisualizationId((saved || withAnns || uniqueViz[0]).id);
        }
      } else {
        setVisualizations([]);
      }
      if (Array.isArray(profile.exportPages)) setExportPages(profile.exportPages);
    }

    // Mapa base e enquadramento (versão 3+)
    if (profile.mapStyle) handleMapStyleChange(profile.mapStyle);
    if (profile.camera?.center) {
      const cam = profile.camera;
      // O carregamento dos dados reenquadra o mapa; aplicar o enquadramento salvo depois dele
      setTimeout(() => { try { map?.current?.jumpTo(cam); } catch (e) { /* ignore */ } }, 1500);
    }
  }, [setCsvData, setFilteredCsvData, setCsvHeaders, setIndicadoresData, setGeojsonData, setColorAttribute,
    setVisualizationConfig, updateLegendConfig, setAnnotations, setVisualizations, setActiveVisualizationId,
    setExportPages, handleMapStyleChange, map, ensureGeometryForUfs, setReferenceLayers]);

  return { buildProfile, applyProfile };
}
