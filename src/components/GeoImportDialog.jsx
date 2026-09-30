import React, { useContext, useMemo, useState } from 'react';
import { X, FileUp, Layers, Check, CircleX, CircleCheck, TriangleAlert, MapPinned, ChevronRight } from 'lucide-react';
import { DataContext } from '../contexts/DataContext';
import { MapContext } from '../contexts/MapContext';
import { readGeoFiles, GEO_ACCEPT } from '../utils/geoImport';
import { guessCodeColumn } from '../utils/tableImport';
import '../styles/DataWizard.css';

const descreverTipos = ({ poligonos, linhas, pontos }) => [
  poligonos && `${poligonos.toLocaleString('pt-BR')} polígono(s)`,
  linhas && `${linhas.toLocaleString('pt-BR')} linha(s)`,
  pontos && `${pontos.toLocaleString('pt-BR')} ponto(s)`,
].filter(Boolean).join(' · ');

// Importa um arquivo geográfico (GeoJSON, TopoJSON, KML/KMZ, Shapefile) como camada de
// referência sobre o mapa, ou como limites de municípios (com código IBGE).
export default function GeoImportDialog({ onClose }) {
  const { processGeometryImportInternal } = useContext(DataContext);
  const { addReferenceLayer } = useContext(MapContext);
  const [arquivo, setArquivo] = useState(null);
  const [erro, setErro] = useState('');
  const [busy, setBusy] = useState(false);
  const [uso, setUso] = useState('camada');
  const [nome, setNome] = useState('');
  const [campoCodigo, setCampoCodigo] = useState('');

  const campos = useMemo(() => {
    const keys = new Set();
    (arquivo?.features || []).slice(0, 50).forEach(f => Object.keys(f.properties || {}).forEach(k => keys.add(k)));
    return [...keys];
  }, [arquivo]);

  const onFiles = async (e) => {
    const files = e.target.files;
    setErro('');
    if (!files?.length) return;
    setBusy(true);
    try {
      const r = await readGeoFiles(files);
      setArquivo(r);
      setNome(r.nome);
      const props = r.features.slice(0, 200).map(f => f.properties || {});
      const cod = guessCodeColumn(Object.keys(props[0] || {}), props);
      setCampoCodigo(cod || '');
      setUso(cod && r.tipos.poligonos ? 'municipios' : 'camada');
    } catch (err) { setErro(err.message); setArquivo(null); }
    e.target.value = '';
    setBusy(false);
  };

  const importar = () => {
    if (uso === 'camada') {
      addReferenceLayer({ ...arquivo, nome: nome.trim() || arquivo.nome });
    } else {
      processGeometryImportInternal({ type: 'FeatureCollection', features: arquivo.features }, campoCodigo);
    }
    onClose();
  };

  return (
    <div className="modal-overlay data-wizard-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="data-wizard" role="dialog" aria-modal="true" aria-labelledby="gi-titulo">
        <div className="data-wizard-header">
          <div>
            <h2 id="gi-titulo">Importar arquivo geográfico</h2>
            <p>Bairros, rios, rotas, pontos de escolas… desenhados por cima do seu mapa.</p>
          </div>
          <button type="button" className="data-wizard-close" onClick={onClose} aria-label="Fechar">
            <X size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        {erro && (
          <div className="aviso aviso-erro data-wizard-aviso" role="alert">
            <CircleX size={18} strokeWidth={1.75} aria-hidden="true" /><span>{erro}</span>
          </div>
        )}

        <div className="data-wizard-body">
          {!arquivo && (
            <>
              <label className="data-wizard-soltar">
                <input type="file" multiple accept={GEO_ACCEPT} onChange={onFiles} className="sr-only" />
                <FileUp size={30} strokeWidth={1.5} aria-hidden="true" />
                <span><strong>{busy ? 'Lendo o arquivo…' : 'Escolha o arquivo'}</strong></span>
                <span className="data-wizard-soltar-sub">GeoJSON, TopoJSON, KML ou KMZ (Google Earth / My Maps) e Shapefile: o .zip ou os arquivos .shp, .dbf e .prj juntos.</span>
              </label>
              <ul className="data-wizard-dicas">
                <li><Check size={15} strokeWidth={2} aria-hidden="true" /> Coordenadas em latitude/longitude (WGS 84 ou SIRGAS 2000); shapefiles em UTM são convertidos pelo .prj</li>
                <li><Check size={15} strokeWidth={2} aria-hidden="true" /> Até 50 MB; arquivos grandes podem ser simplificados em mapshaper.org</li>
              </ul>
            </>
          )}

          {arquivo && (
            <>
              <div className="data-wizard-arquivo">
                <span className="data-wizard-arquivo-icone"><Layers size={20} strokeWidth={1.75} aria-hidden="true" /></span>
                <div>
                  <strong>{arquivo.nome}</strong>
                  <span>{arquivo.formato} · {descreverTipos(arquivo.tipos)}</span>
                </div>
                <label className="btn btn-ghost btn-sm data-wizard-trocar">
                  Trocar arquivo
                  <input type="file" multiple accept={GEO_ACCEPT} onChange={onFiles} className="sr-only" />
                </label>
              </div>

              <fieldset className="campo gi-uso">
                <legend className="campo-rotulo">Como usar</legend>
                <label className={`gi-opcao ${uso === 'camada' ? 'ativa' : ''}`}>
                  <input type="radio" name="gi-uso" value="camada" checked={uso === 'camada'} onChange={() => setUso('camada')} />
                  <Layers size={18} strokeWidth={1.75} aria-hidden="true" />
                  <span><strong>Camada de referência</strong><small>Desenhada por cima do mapa, com uma cor. Aparece no Estúdio e na imagem exportada.</small></span>
                </label>
                <label className={`gi-opcao ${uso === 'municipios' ? 'ativa' : ''}`}>
                  <input type="radio" name="gi-uso" value="municipios" checked={uso === 'municipios'} onChange={() => setUso('municipios')} disabled={!arquivo.tipos.poligonos} />
                  <MapPinned size={18} strokeWidth={1.75} aria-hidden="true" />
                  <span><strong>Limites de municípios</strong><small>Substitui ou acrescenta polígonos de municípios, ligados pelo código IBGE.</small></span>
                </label>
              </fieldset>

              {uso === 'camada' ? (
                <div className="campo">
                  <label htmlFor="gi-nome">Nome da camada (aparece na legenda do painel)</label>
                  <input id="gi-nome" className="entrada" type="text" value={nome} onChange={e => setNome(e.target.value)} maxLength={80} />
                </div>
              ) : (
                <div className="campo">
                  <label htmlFor="gi-cod">Propriedade com o código IBGE do município</label>
                  <select id="gi-cod" className="selecao data-wizard-mono" value={campoCodigo} onChange={e => setCampoCodigo(e.target.value)}>
                    <option value="">Escolha…</option>
                    {campos.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {campoCodigo
                    ? <span className="data-wizard-ok-linha"><CircleCheck size={14} strokeWidth={2} aria-hidden="true" /> Os municípios serão ligados pela propriedade “{campoCodigo}”.</span>
                    : <span className="data-wizard-warn-linha"><TriangleAlert size={14} strokeWidth={2} aria-hidden="true" /> Escolha a propriedade com o código de 7 (ou 6) dígitos.</span>}
                </div>
              )}
            </>
          )}
        </div>

        <div className="data-wizard-footer">
          <span className="data-wizard-status">{arquivo ? `${arquivo.features.length.toLocaleString('pt-BR')} feições` : ''}</span>
          <div className="data-wizard-footer-acoes">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-primary" disabled={!arquivo || busy || (uso === 'municipios' && !campoCodigo)} onClick={importar}>
              Colocar no mapa <ChevronRight size={17} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
