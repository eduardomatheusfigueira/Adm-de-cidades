import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from 'react';
import {
  Map as MapIcon, Upload, ChevronLeft, MapPin, Spline, Pentagon, Ruler, Scan, Save, FolderOpen, Globe,
  Check, Search, RotateCcw, GraduationCap,
} from 'lucide-react';
import '../styles/MapPanel.css';
import { DataContext } from '../contexts/DataContext';
import { MapContext } from '../contexts/MapContext';
import { UIContext } from '../contexts/UIContext';
import { AnnotationContext } from '../contexts/AnnotationContext';
import { BASEMAPS, BASEMAP_LAYER_CATEGORIES, isStyleReady, isAppLayer, getGeoJSONSourceData, resolveBasemapStyle } from '../utils/basemaps';
import {
  isNumericValues, getColorScale, getLegendKey, isNoDataMarker, buildLegendItems,
  makeVizValueGetter, normalizedLabel, rotuloAtributo, NOMES_REGIOES,
} from '../utils/colorUtils';
import { DEFAULT_SYMBOLOGY } from '../utils/palettes';
import SymbologyPanel from './SymbologyPanel';
import { generateExportHtml } from '../utils/exportMap';
import { useProjectState } from '../hooks/useProjectState';

const NOMES_UF = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal',
  ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
  PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
};

const EXCLUIDOS = new Set(['Codigo_Municipio', 'Longitude_Municipio', 'Latitude_Municipio']);
const PADRAO_VIZ = { type: 'attribute', renderMode: 'filled', fillOpacity: 0.85, borderWidth: 2, symbology: DEFAULT_SYMBOLOGY, labels: false, valueType: 'value' };
const semAcento = (t) => (t || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const ehCapital = (city) => String(city?.Capital).trim().toLowerCase() === 'true';

const Switch = ({ checked, onChange, label }) => (
  <button type="button" role="switch" aria-checked={checked} className="painel-switch" onClick={() => onChange(!checked)}>
    <span className="painel-switch-rotulo">{label}</span>
    <span className="painel-switch-trilho" aria-hidden="true"><span className="painel-switch-botao" /></span>
  </button>
);

const MapPanel = ({ aberto, onFechar, onFiltersApplied, onImportGeometry }) => {
  const { csvData, filteredCsvData, indicadoresData, csvHeaders, handleImportIndicators, handleImportMunicipios } = useContext(DataContext);
  const { map, mapLoaded, mapStyle, handleMapStyleChange, lng, lat, zoom } = useContext(MapContext);
  const {
    colorAttribute, visualizationConfig, handleVisualizationConfigChange, setDataWizardMode, legendConfigByKey,
    showAttributeLegend, setShowAttributeLegend, showAnnotationLegend, setShowAnnotationLegend,
    showNorthArrow, setShowNorthArrow, showScaleBar, setShowScaleBar, showGraticule, setShowGraticule,
    showMeasurements, setShowMeasurements,
  } = useContext(UIContext);
  const { startDrawing, currentColor, setCurrentColor, visualizations, activeVisualizationId, getActiveAnnotations } = useContext(AnnotationContext);
  const { buildProfile, applyProfile } = useProjectState();

  const [aba, setAba] = useState('visualizacao');

  // ── Resumo dos dados carregados ────────────────────────────────────────────
  const resumo = useMemo(() => {
    const ufs = [...new Set((csvData || []).map(c => c.Sigla_Estado).filter(Boolean))];
    const n = (csvData || []).length;
    let nome = 'Nenhum dado carregado';
    if (n) nome = ufs.length === 1 ? (NOMES_UF[ufs[0]] || ufs[0]) : ufs.length >= 27 ? 'Brasil' : `${ufs.length} estados`;
    return { n, nome };
  }, [csvData]);

  // ── Visualização (aplicada na hora) ────────────────────────────────────────
  const comSimbologia = (config) => ({ ...config, symbology: { ...DEFAULT_SYMBOLOGY, ...(config?.symbology || {}) } });
  const [viz, setViz] = useState(() => comSimbologia({ ...PADRAO_VIZ, attribute: colorAttribute || 'Sigla_Regiao', ...(visualizationConfig || {}) }));
  useEffect(() => {
    // Mudança vinda de fora (assistente de dados, perfil carregado): o painel acompanha
    if (visualizationConfig) setViz(v => comSimbologia({ ...v, ...visualizationConfig }));
  }, [visualizationConfig]);

  const { categoricos, numericos } = useMemo(() => {
    const attrs = (csvHeaders || []).filter(h => !EXCLUIDOS.has(h));
    const cat = []; const num = [];
    attrs.forEach(a => {
      const vals = (csvData || []).map(r => r?.[a]).filter(v => v !== undefined && v !== null && `${v}`.trim() !== '');
      (vals.length && a !== 'Nome_Municipio' && isNumericValues(vals) ? num : cat).push(a);
    });
    const porRotulo = (x, y) => rotuloAtributo(x).localeCompare(rotuloAtributo(y), 'pt-BR');
    return { categoricos: cat.sort(porRotulo), numericos: num.sort(porRotulo) };
  }, [csvHeaders, csvData]);

  const indicadores = useMemo(() => [...new Set((indicadoresData || []).map(i => i.Nome_Indicador))].filter(Boolean).sort(), [indicadoresData]);
  const anos = useMemo(() => viz.indicator
    ? [...new Set((indicadoresData || []).filter(i => i.Nome_Indicador === viz.indicator).map(i => i.Ano_Observacao))].sort((a, b) => b - a)
    : [], [indicadoresData, viz.indicator]);

  const ehNumerico = viz.type === 'indicator' || numericos.includes(viz.attribute);
  // Símbolos proporcionais só fazem sentido para atributos numéricos (contagens, totais)
  const podeSimbolos = viz.type === 'attribute' && numericos.includes(viz.attribute);

  // Valores da variável escolhida, para a prévia da classificação (os mesmos que vão para o mapa)
  const valoresSimbologia = useMemo(() => {
    if (viz.type === 'indicator') {
      if (!viz.indicator || !viz.year) return [];
      return (indicadoresData || [])
        .filter(r => r.Nome_Indicador === viz.indicator && r.Ano_Observacao === viz.year)
        .map(r => (viz.valueType === 'position' ? r.Indice_Posicional : r.Valor));
    }
    if (!viz.attribute) return [];
    const getter = makeVizValueGetter(csvData, viz.attribute, viz.symbology);
    return (filteredCsvData || csvData || []).map(getter.get);
  }, [viz.type, viz.indicator, viz.year, viz.valueType, viz.attribute, viz.symbology, indicadoresData, filteredCsvData, csvData]);

  const aplicar = useCallback((proxima) => {
    const pronto = proxima.type === 'attribute' ? !!proxima.attribute : !!(proxima.indicator && proxima.year);
    if (!pronto) return;
    const config = {
      type: proxima.type, renderMode: proxima.renderMode, borderWidth: proxima.borderWidth, fillOpacity: proxima.fillOpacity,
      symbology: proxima.symbology, labels: !!proxima.labels,
      ...(proxima.type === 'attribute'
        ? { attribute: proxima.attribute }
        : { indicator: proxima.indicator, year: proxima.year, valueType: proxima.valueType || 'value' }),
    };
    handleVisualizationConfigChange(config);
  }, [handleVisualizationConfigChange]);

  const mudar = (parcial) => {
    const n = { ...viz, ...parcial };
    // Trocou para uma variável de categorias: símbolos proporcionais não se aplicam
    if (n.renderMode === 'symbols' && !(n.type === 'attribute' && numericos.includes(n.attribute))) n.renderMode = 'filled';
    setViz(n); aplicar(n);
  };

  // Controles deslizantes: o mapa é redesenhado quando o movimento para
  const timerRef = useRef(null);
  const mudarDeslizando = (parcial) => {
    const n = { ...viz, ...parcial };
    setViz(n);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => aplicar(n), 250);
  };
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const escolherIndicador = (indicator) => {
    const ultimos = [...new Set((indicadoresData || []).filter(i => i.Nome_Indicador === indicator).map(i => i.Ano_Observacao))].sort((a, b) => b - a);
    mudar({ indicator, year: ultimos[0] || '' });
  };

  const restaurar = () => {
    const attribute = (csvHeaders || []).includes('Sigla_Regiao') ? 'Sigla_Regiao' : (categoricos[0] || numericos[0] || '');
    const n = { ...PADRAO_VIZ, attribute };
    setViz(n); aplicar(n);
  };

  // Camadas do mapa base
  const [camadas, setCamadas] = useState(() => Object.fromEntries(BASEMAP_LAYER_CATEGORIES.map(c => [c.key, true])));
  useEffect(() => { setCamadas(Object.fromEntries(BASEMAP_LAYER_CATEGORIES.map(c => [c.key, true]))); }, [mapStyle]);
  const alternarCamada = (key) => {
    if (!map?.current || !mapLoaded || !isStyleReady(map.current)) return;
    const cat = BASEMAP_LAYER_CATEGORIES.find(c => c.key === key);
    const visivel = !camadas[key];
    (map.current.getStyle().layers || []).forEach(layer => {
      if (isAppLayer(layer.id) || !cat.match(layer)) return;
      try { map.current.setLayoutProperty(layer.id, 'visibility', visivel ? 'visible' : 'none'); } catch (e) { /* camada sem layout */ }
    });
    setCamadas(p => ({ ...p, [key]: visivel }));
  };

  // ── Filtros ────────────────────────────────────────────────────────────────
  const [tipo, setTipo] = useState('all');
  const [regiao, setRegiao] = useState('all');
  const [estado, setEstado] = useState('all');
  const [selecionados, setSelecionados] = useState(new Set());
  const [buscaMun, setBuscaMun] = useState('');

  const regioes = useMemo(() => [...new Set((csvData || []).map(c => c.Sigla_Regiao))].filter(Boolean).sort(), [csvData]);
  const estados = useMemo(() => [...new Set((csvData || [])
    .filter(c => regiao === 'all' || c.Sigla_Regiao === regiao).map(c => c.Sigla_Estado))].filter(Boolean).sort(), [csvData, regiao]);
  useEffect(() => { if (estado !== 'all' && !estados.includes(estado)) setEstado('all'); }, [estados, estado]);

  const listaMunicipios = useMemo(() => {
    const termo = semAcento(buscaMun.trim());
    if (!termo) return [];
    return (csvData || []).filter(c => semAcento(c.Nome_Municipio).includes(termo) || String(c.Codigo_Municipio).startsWith(termo))
      .sort((a, b) => (a.Nome_Municipio || '').localeCompare(b.Nome_Municipio || '', 'pt-BR')).slice(0, 60);
  }, [csvData, buscaMun]);
  const nomesSelecionados = useMemo(() => (csvData || []).filter(c => selecionados.has(c.Codigo_Municipio)), [csvData, selecionados]);
  const alternarMunicipio = (code) => setSelecionados(prev => { const n = new Set(prev); n.has(code) ? n.delete(code) : n.add(code); return n; });

  const atributoAtual = viz.type === 'attribute' ? viz.attribute : colorAttribute;
  const aplicarFiltros = () => {
    if (!csvData) return;
    let dados = [...csvData];
    if (tipo === 'capital') dados = dados.filter(ehCapital);
    else if (tipo === 'non-capital') dados = dados.filter(c => !ehCapital(c));
    if (regiao !== 'all') dados = dados.filter(c => c.Sigla_Regiao === regiao);
    if (estado !== 'all') dados = dados.filter(c => c.Sigla_Estado === estado);
    if (selecionados.size) dados = dados.filter(c => selecionados.has(c.Codigo_Municipio));
    onFiltersApplied(dados, atributoAtual);
    aplicar(viz); // filtrar não desfaz a visualização escolhida
  };
  const limparFiltros = () => {
    setTipo('all'); setRegiao('all'); setEstado('all'); setSelecionados(new Set()); setBuscaMun('');
    if (csvData) { onFiltersApplied(csvData, atributoAtual); aplicar(viz); }
  };

  // ── Ferramentas: perfil e exportação HTML ─────────────────────────────────
  const baixar = async (conteudo, nome, tipoMime, descricao, extensao) => {
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({ suggestedName: nome, types: [{ description: descricao, accept: { [tipoMime]: [extensao] } }] });
        const w = await handle.createWritable(); await w.write(conteudo); await w.close();
        return;
      } catch (err) { if (err.name === 'AbortError') return; }
    }
    const url = URL.createObjectURL(new Blob([conteudo], { type: tipoMime }));
    const a = document.createElement('a'); a.href = url; a.download = nome;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const salvarPerfil = () => baixar(JSON.stringify(buildProfile()), 'perfil_completo.json', 'application/json', 'Perfil JSON', '.json');

  // Modelo para a turma: perfil com título e instruções, aberto pelos alunos via ?modelo=
  const salvarModelo = async () => {
    const titulo = window.prompt('Título do modelo (aparece para os alunos):', 'Mapa da atividade');
    if (titulo === null) return;
    const instrucoes = window.prompt('Instruções para os alunos (opcional):', 'Complete o mapa: escreva o título, sua fonte e seu nome, e exporte em PDF.') || '';
    const nome = (titulo || 'modelo').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'modelo';
    const perfil = { ...buildProfile(), modelo: { titulo, instrucoes, criadoEm: new Date().toISOString() } };
    await baixar(JSON.stringify(perfil), `${nome}.json`, 'application/json', 'Perfil JSON', '.json');
    window.alert(
      `Modelo salvo como "${nome}.json".\n\nPara a turma abrir:\n` +
      `1) Coloque o arquivo na pasta public/modelos/ do repositório (o deploy publica automaticamente) e envie o link:\n` +
      `${window.location.origin}/?modelo=${nome}\n\n` +
      `2) Ou hospede o arquivo em um endereço público (que permita acesso de outros sites) e use:\n` +
      `${window.location.origin}/?modelo=https://endereco/do/arquivo.json`
    );
  };

  const carregarPerfil = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try { applyProfile(JSON.parse(e.target.result)); alert('Perfil carregado.'); }
        catch (error) { console.error('[MapPanel] Erro ao carregar o perfil:', error); alert('Não foi possível ler o arquivo de perfil. Confira se é um .json salvo pelo SisInfo.'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const legendaParaExportar = () => {
    const legendKey = getLegendKey(visualizationConfig, colorAttribute);
    if (!legendKey) return null;
    let attribute = colorAttribute;
    let title = rotuloAtributo(colorAttribute);
    if (visualizationConfig?.type === 'indicator') {
      attribute = 'visualization_value';
      title = `${visualizationConfig.indicator} (${visualizationConfig.year})`;
    } else if (visualizationConfig?.type === 'attribute' && visualizationConfig.attribute) {
      attribute = visualizationConfig.attribute;
      title = rotuloAtributo(visualizationConfig.attribute);
    }
    if (!attribute) return null;
    let values;
    let missing = 0;
    if (visualizationConfig?.type === 'indicator') {
      const { indicator, year, valueType } = visualizationConfig;
      values = (indicadoresData || []).filter(r => r.Nome_Indicador === indicator && r.Ano_Observacao === year)
        .map(r => (valueType === 'position' ? r.Indice_Posicional : r.Valor)).filter(v => !isNoDataMarker(v));
    } else {
      // mesmo valor exibido no mapa (inclusive normalizado), com o formato da coluna inteira
      const getter = makeVizValueGetter(csvData, attribute, visualizationConfig?.symbology);
      if (getter.normalized) title = normalizedLabel(attribute, visualizationConfig.symbology);
      const linhas = filteredCsvData || [];
      values = linhas.map(getter.get).filter(v => v !== null && v !== undefined);
      missing = linhas.length - values.length;
    }
    const expr = getColorScale(attribute, values, visualizationConfig?.symbology);
    let items = buildLegendItems(expr, values, missing).items;
    const custom = legendConfigByKey[legendKey];
    if (custom?.items?.length) { title = custom.title || title; items = custom.items; }
    return { title, items };
  };

  const exportarHtml = async () => {
    const m = map.current;
    let center = [lng, lat]; let z = zoom;
    if (m) { const c = m.getCenter(); center = [c.lng, c.lat]; z = m.getZoom(); }
    let munGeoJson = null; let colorExpr = null;
    if (m && m.getSource('sectors')) {
      const src = getGeoJSONSourceData(m.getSource('sectors'));
      if (src?.features?.length) munGeoJson = src;
      if (m.getLayer('sectors-fill-layer')) colorExpr = m.getPaintProperty('sectors-fill-layer', 'fill-color');
    }
    const vizAtiva = visualizations.find(v => v.id === activeVisualizationId);
    const html = generateExportHtml({
      annotations: getActiveAnnotations(),
      vizName: vizAtiva?.name || 'Mapa SisInfo',
      mapCenter: center, mapZoom: z, mapBearing: m ? m.getBearing() : 0,
      mapStyle: resolveBasemapStyle(mapStyle),
      municipalityGeoJson: munGeoJson, municipalityColorExpression: colorExpr,
      colorLegend: legendaParaExportar(),
      renderMode: visualizationConfig?.renderMode || 'filled',
      fillOpacity: visualizationConfig?.fillOpacity ?? 0.85,
      borderWidth: visualizationConfig?.borderWidth || 2,
    });
    const nome = (vizAtiva?.name || 'mapa').replace(/[^a-zA-Z0-9_ -]/g, '_');
    baixar(html, `${nome}.html`, 'text/html;charset=utf-8', 'Arquivo HTML', '.html');
  };

  const ferramentas = [
    { tipo: 'point', rotulo: 'Ponto', Icon: MapPin },
    { tipo: 'line', rotulo: 'Linha', Icon: Spline },
    { tipo: 'polygon', rotulo: 'Polígono', Icon: Pentagon },
    { tipo: 'measure_line', rotulo: 'Medir distância', Icon: Ruler },
    { tipo: 'measure_polygon', rotulo: 'Medir área', Icon: Scan },
  ];

  const abas = [
    { id: 'visualizacao', rotulo: 'Visualização' },
    { id: 'filtros', rotulo: 'Filtros' },
    { id: 'ferramentas', rotulo: 'Ferramentas' },
  ];

  return (
    <aside className={`painel-mapa ${aberto ? 'aberto' : ''}`} aria-label="Dados e visualização do mapa">
      <div className="painel-mapa-alca" aria-hidden="true" />
      <div className="painel-mapa-topo">
        <div className="painel-mapa-linha">
          <span className="rotulo">Dados no mapa</span>
          <button type="button" className="painel-icone" onClick={onFechar} aria-label="Recolher painel" title="Recolher painel">
            <ChevronLeft className="painel-icone-desktop" size={20} strokeWidth={1.75} aria-hidden="true" />
            <span className="painel-icone-celular">Fechar</span>
          </button>
        </div>
        <div className="painel-mapa-dados">
          <span className="painel-mapa-dados-icone"><MapIcon size={20} strokeWidth={1.75} aria-hidden="true" /></span>
          <div className="painel-mapa-dados-texto">
            <strong>{resumo.nome}</strong>
            <span>{resumo.n ? `${resumo.n.toLocaleString('pt-BR')} municípios` : 'Escolha um recorte ou junte uma tabela'}</span>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDataWizardMode('malha')}>Trocar</button>
        </div>
        <button type="button" className="painel-juntar" onClick={() => setDataWizardMode('tabela')}>
          <Upload size={17} strokeWidth={1.75} aria-hidden="true" /> Juntar minha tabela (CSV)
        </button>
        <details className="painel-avancado">
          <summary>Importação avançada</summary>
          <div className="painel-avancado-botoes">
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleImportIndicators}>Indicadores (CSV)</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleImportMunicipios}>Municípios (CSV)</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onImportGeometry}>Geometria (GeoJSON)</button>
          </div>
        </details>
      </div>

      <div className="abas painel-abas" role="tablist" aria-label="Painel do mapa">
        {abas.map(a => (
          <button key={a.id} type="button" role="tab" aria-selected={aba === a.id} onClick={() => setAba(a.id)}>{a.rotulo}</button>
        ))}
      </div>

      <div className="painel-mapa-corpo" role="tabpanel">
        {aba === 'visualizacao' && (
          <>
            <div className="campo">
              <span className="campo-rotulo">Pintar por</span>
              <div className="segmentado" role="group" aria-label="Pintar por">
                <button type="button" aria-pressed={viz.type === 'attribute'} onClick={() => mudar({ type: 'attribute' })}>Atributo</button>
                <button type="button" aria-pressed={viz.type === 'indicator'} onClick={() => mudar({ type: 'indicator' })}>Indicador</button>
              </div>
            </div>

            {viz.type === 'attribute' ? (
              <div className="campo">
                <label htmlFor="mp-atributo">Atributo</label>
                <select id="mp-atributo" className="selecao" value={viz.attribute || ''} onChange={(e) => mudar({ attribute: e.target.value })} disabled={!categoricos.length && !numericos.length}>
                  {categoricos.length > 0 && <optgroup label="Categorias">{categoricos.map(a => <option key={a} value={a}>{rotuloAtributo(a)}</option>)}</optgroup>}
                  {numericos.length > 0 && <optgroup label="Números">{numericos.map(a => <option key={a} value={a}>{rotuloAtributo(a)}</option>)}</optgroup>}
                </select>
              </div>
            ) : indicadores.length === 0 ? (
              <div className="aviso aviso-info">
                <span>Nenhum indicador importado ainda. Junte uma tabela ou importe um arquivo de indicadores para pintar o mapa por eles.</span>
              </div>
            ) : (
              <>
                <div className="campo">
                  <label htmlFor="mp-indicador">Indicador</label>
                  <select id="mp-indicador" className="selecao" value={viz.indicator || ''} onChange={(e) => escolherIndicador(e.target.value)}>
                    <option value="">Escolha um indicador</option>
                    {indicadores.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="painel-dupla">
                  <div className="campo">
                    <label htmlFor="mp-ano">Ano</label>
                    <select id="mp-ano" className="selecao" value={viz.year || ''} onChange={(e) => mudar({ year: e.target.value })} disabled={!anos.length}>
                      {!anos.length && <option value="">—</option>}
                      {anos.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="campo">
                    <label htmlFor="mp-valor">Valor</label>
                    <select id="mp-valor" className="selecao" value={viz.valueType || 'value'} onChange={(e) => mudar({ valueType: e.target.value })}>
                      <option value="value">Valor</option>
                      <option value="position">Índice posicional</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {viz.renderMode !== 'symbols' && <SymbologyPanel
              rawValues={valoresSimbologia}
              symbology={viz.symbology}
              onChange={(symbology) => mudarDeslizando({ symbology })}
              attribute={viz.type === 'attribute' ? viz.attribute : null}
              normalizeOptions={numericos.filter(a => a !== viz.attribute)}
              attributeIsNumeric={numericos.includes(viz.attribute)}
            />}
            {!ehNumerico && viz.attribute === 'Sigla_Regiao' && viz.symbology?.categoricalPalette === 'SisInfo' && (
              <p className="painel-nota">As regiões têm sempre a mesma cor ({Object.values(NOMES_REGIOES).join(', ')}).</p>
            )}

            <div className="campo">
              <span className="campo-rotulo">Desenho</span>
              <div className="segmentado" role="group" aria-label="Desenho">
                <button type="button" aria-pressed={viz.renderMode !== 'border' && viz.renderMode !== 'symbols'} onClick={() => mudar({ renderMode: 'filled' })}>Preenchido</button>
                <button type="button" aria-pressed={viz.renderMode === 'border'} onClick={() => mudar({ renderMode: 'border' })}>Contorno</button>
                {podeSimbolos && (
                  <button type="button" aria-pressed={viz.renderMode === 'symbols'} onClick={() => mudar({ renderMode: 'symbols' })}>Círculos</button>
                )}
              </div>
            </div>
            {viz.renderMode === 'symbols' ? (
              <p className="painel-nota">Um círculo por município, com área proporcional ao valor original: o jeito certo de mostrar contagens como população ou casos.</p>
            ) : viz.renderMode === 'border' ? (
              <div className="campo">
                <label htmlFor="mp-borda">Espessura do contorno · {viz.borderWidth} px</label>
                <input id="mp-borda" type="range" className="painel-range" min="1" max="10" step="0.5" value={viz.borderWidth} onChange={(e) => mudarDeslizando({ borderWidth: parseFloat(e.target.value) })} />
              </div>
            ) : (
              <div className="campo">
                <label htmlFor="mp-opacidade">Opacidade · {Math.round((viz.fillOpacity ?? 0.85) * 100)}%</label>
                <input id="mp-opacidade" type="range" className="painel-range" min="0.05" max="1" step="0.05" value={viz.fillOpacity ?? 0.85} onChange={(e) => mudarDeslizando({ fillOpacity: parseFloat(e.target.value) })} />
              </div>
            )}

            <Switch checked={!!viz.labels} onChange={(labels) => mudar({ labels })} label="Mostrar nomes dos municípios" />

            <div className="campo">
              <label htmlFor="mp-base">Mapa base</label>
              <select id="mp-base" className="selecao" value={mapStyle} onChange={(e) => handleMapStyleChange(e.target.value)}>
                {BASEMAPS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                {!BASEMAPS.some(b => b.id === mapStyle) && <option value={mapStyle}>Personalizado</option>}
              </select>
            </div>
            <details className="painel-avancado">
              <summary>Camadas do mapa base</summary>
              <div className="painel-checks">
                {BASEMAP_LAYER_CATEGORIES.map(cat => (
                  <label key={cat.key}>
                    <input type="checkbox" checked={!!camadas[cat.key]} onChange={() => alternarCamada(cat.key)} />
                    {cat.label}
                  </label>
                ))}
              </div>
            </details>
          </>
        )}

        {aba === 'filtros' && (
          <>
            <div className="campo">
              <span className="campo-rotulo">Municípios</span>
              <div className="segmentado" role="group" aria-label="Tipo de município">
                <button type="button" aria-pressed={tipo === 'all'} onClick={() => setTipo('all')}>Todos</button>
                <button type="button" aria-pressed={tipo === 'capital'} onClick={() => setTipo('capital')}>Capitais</button>
                <button type="button" aria-pressed={tipo === 'non-capital'} onClick={() => setTipo('non-capital')}>Não capitais</button>
              </div>
            </div>
            <div className="painel-dupla">
              <div className="campo">
                <label htmlFor="mp-regiao">Região</label>
                <select id="mp-regiao" className="selecao" value={regiao} onChange={(e) => setRegiao(e.target.value)} disabled={!regioes.length}>
                  <option value="all">Todas</option>
                  {regioes.map(r => <option key={r} value={r}>{NOMES_REGIOES[r] || r}</option>)}
                </select>
              </div>
              <div className="campo">
                <label htmlFor="mp-estado">Estado</label>
                <select id="mp-estado" className="selecao" value={estado} onChange={(e) => setEstado(e.target.value)} disabled={!estados.length}>
                  <option value="all">Todos</option>
                  {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
            </div>
            <div className="campo">
              <label htmlFor="mp-busca-mun">Escolher municípios</label>
              <div className="painel-busca">
                <Search size={17} strokeWidth={1.75} aria-hidden="true" />
                <input id="mp-busca-mun" type="search" className="entrada" placeholder="Nome ou código IBGE" value={buscaMun} onChange={(e) => setBuscaMun(e.target.value)} />
              </div>
              {nomesSelecionados.length > 0 && (
                <div className="painel-chips">
                  {nomesSelecionados.map(c => (
                    <button key={c.Codigo_Municipio} type="button" className="painel-chip" onClick={() => alternarMunicipio(c.Codigo_Municipio)} aria-label={`Remover ${c.Nome_Municipio}`}>
                      {c.Nome_Municipio} · {c.Sigla_Estado} <span aria-hidden="true">×</span>
                    </button>
                  ))}
                </div>
              )}
              {listaMunicipios.length > 0 && (
                <div className="painel-lista" role="group" aria-label="Resultados">
                  {listaMunicipios.map(c => (
                    <label key={c.Codigo_Municipio}>
                      <input type="checkbox" checked={selecionados.has(c.Codigo_Municipio)} onChange={() => alternarMunicipio(c.Codigo_Municipio)} />
                      <span>{c.Nome_Municipio}</span><span className="painel-lista-uf">{c.Sigla_Estado}</span>
                    </label>
                  ))}
                </div>
              )}
              {buscaMun.trim() && listaMunicipios.length === 0 && <p className="campo-ajuda">Nenhum município encontrado.</p>}
            </div>
            <div className="painel-acoes">
              <button type="button" className="btn btn-primary" onClick={aplicarFiltros}>Aplicar filtros</button>
              <button type="button" className="btn btn-secondary" onClick={limparFiltros}>Limpar</button>
            </div>
            <p className="painel-nota">
              {(filteredCsvData || []).length.toLocaleString('pt-BR')} de {resumo.n.toLocaleString('pt-BR')} municípios no mapa.
            </p>
          </>
        )}

        {aba === 'ferramentas' && (
          <>
            <section className="painel-grupo" aria-labelledby="mp-desenhar">
              <h3 id="mp-desenhar" className="rotulo">Desenhar e medir</h3>
              <div className="painel-ferramentas">
                {ferramentas.map(({ tipo: t, rotulo, Icon }) => (
                  <button key={t} type="button" onClick={() => startDrawing(t)}>
                    <Icon size={20} strokeWidth={1.75} aria-hidden="true" />{rotulo}
                  </button>
                ))}
              </div>
              <label className="painel-cor">
                <span>Cor do desenho</span>
                <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} />
              </label>
              <Switch checked={showMeasurements} onChange={setShowMeasurements} label="Mostrar medidas no mapa" />
            </section>

            <section className="painel-grupo" aria-labelledby="mp-elementos">
              <h3 id="mp-elementos" className="rotulo">Elementos do mapa</h3>
              <Switch checked={showAttributeLegend} onChange={setShowAttributeLegend} label="Legenda de cores" />
              <Switch checked={showAnnotationLegend} onChange={setShowAnnotationLegend} label="Informações do mapa" />
              <Switch checked={showNorthArrow} onChange={setShowNorthArrow} label="Indicador de norte" />
              <Switch checked={showScaleBar} onChange={setShowScaleBar} label="Barra de escala" />
              <Switch checked={showGraticule} onChange={setShowGraticule} label="Paralelos e meridianos" />
            </section>

            <section className="painel-grupo" aria-labelledby="mp-projeto">
              <h3 id="mp-projeto" className="rotulo">Projeto</h3>
              <div className="painel-acoes painel-acoes-coluna">
                <button type="button" className="btn btn-secondary" onClick={salvarPerfil}><Save size={17} strokeWidth={1.75} aria-hidden="true" />Salvar perfil (.json)</button>
                <button type="button" className="btn btn-secondary" onClick={carregarPerfil}><FolderOpen size={17} strokeWidth={1.75} aria-hidden="true" />Carregar perfil</button>
                <button type="button" className="btn btn-secondary" onClick={salvarModelo}><GraduationCap size={17} strokeWidth={1.75} aria-hidden="true" />Salvar como modelo para a turma</button>
                <button type="button" className="btn btn-secondary" onClick={exportarHtml}><Globe size={17} strokeWidth={1.75} aria-hidden="true" />Exportar mapa interativo (.html)</button>
              </div>
            </section>
          </>
        )}
      </div>

      {aba === 'visualizacao' && (
        <div className="painel-mapa-rodape">
          <span><Check size={14} strokeWidth={2} aria-hidden="true" /> Aplicado na hora</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={restaurar}><RotateCcw size={14} strokeWidth={2} aria-hidden="true" />Restaurar padrão</button>
        </div>
      )}
    </aside>
  );
};

export default MapPanel;
