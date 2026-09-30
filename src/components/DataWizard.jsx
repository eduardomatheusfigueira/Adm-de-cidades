import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DataContext } from '../contexts/DataContext';
import { UIContext } from '../contexts/UIContext';
import { loadMalhaIndex } from '../utils/malhas';
import { readTableFile, guessCodeColumn } from '../utils/tableImport';
import { isNumericValues } from '../utils/colorUtils';
import '../styles/DataWizard.css';

const REGIOES = [
  { sigla: 'N', nome: 'Norte' }, { sigla: 'NE', nome: 'Nordeste' }, { sigla: 'CO', nome: 'Centro-Oeste' },
  { sigla: 'SE', nome: 'Sudeste' }, { sigla: 'S', nome: 'Sul' },
];

const kb = (bytes) => bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} kB`;

// Assistente de dados: "Mapa do Brasil (IBGE)" e "Juntar minha tabela".
// mode: 'malha' | 'tabela'
export default function DataWizard({ mode, onClose }) {
  const { loadBaseMap, joinTable } = useContext(DataContext);
  const { handleVisualizationConfigChange, setActiveEnvironment } = useContext(UIContext);
  const [tab, setTab] = useState(mode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // --- Malha ---
  const [index, setIndex] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [done, setDone] = useState('');
  useEffect(() => {
    loadMalhaIndex().then(setIndex).catch(e => setError(`Não foi possível ler a lista de malhas: ${e.message}`));
  }, []);
  const toggleUf = (cod) => setSelected(prev => { const n = new Set(prev); n.has(cod) ? n.delete(cod) : n.add(cod); return n; });
  const selectRegion = (sigla) => setSelected(new Set(index.ufs.filter(u => u.regiao === sigla).map(u => u.codigo_uf)));
  const selectedInfo = useMemo(() => {
    if (!index) return { municipios: 0, bytes: 0 };
    return index.ufs.filter(u => selected.has(u.codigo_uf))
      .reduce((a, u) => ({ municipios: a.municipios + u.municipios, bytes: a.bytes + u.bytes }), { municipios: 0, bytes: 0 });
  }, [index, selected]);

  const loadMalha = async () => {
    setBusy(true); setError(''); setDone('');
    try {
      const r = await loadBaseMap([...selected]);
      setDone(`Pronto: ${r.municipios} municípios carregados.`);
      setActiveEnvironment?.('map');
      setTimeout(onClose, 900);
    } catch (e) { setError(`Erro ao carregar a malha: ${e.message}`); }
    setBusy(false);
  };

  // --- Tabela ---
  const [table, setTable] = useState(null);
  const [codeColumn, setCodeColumn] = useState('');
  const [report, setReport] = useState(null);
  const [colorBy, setColorBy] = useState('');

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(''); setReport(null);
    if (file.size > 50 * 1024 * 1024) { setError('O arquivo passa de 50 MB.'); return; }
    try {
      const t = await readTableFile(file);
      setTable({ ...t, name: file.name });
      setCodeColumn(guessCodeColumn(t.headers, t.rows) || '');
    } catch (err) { setError(err.message); setTable(null); }
  };

  const doJoin = async () => {
    setBusy(true); setError('');
    try {
      const r = await joinTable({ rows: table.rows, headers: table.headers, codeColumn });
      setReport(r);
      const numeric = r.newColumns.find(c => isNumericValues(table.rows.map(row => row[c])));
      setColorBy(numeric || r.newColumns[0] || '');
    } catch (e) { setError(`Erro ao juntar a tabela: ${e.message}`); }
    setBusy(false);
  };

  const applyColor = () => {
    if (colorBy) handleVisualizationConfigChange({ type: 'attribute', attribute: colorBy, renderMode: 'filled', fillOpacity: 0.75, borderWidth: 2 });
    setActiveEnvironment?.('map');
    onClose();
  };

  return (
    <div className="modal-overlay data-wizard-overlay" role="dialog" aria-modal="true">
      <div className="modal-content data-wizard">
        <div className="data-wizard-header">
          <div className="data-wizard-tabs">
            <button type="button" className={tab === 'malha' ? 'active' : ''} onClick={() => setTab('malha')}>🗺️ Mapa do Brasil</button>
            <button type="button" className={tab === 'tabela' ? 'active' : ''} onClick={() => setTab('tabela')}>📊 Juntar minha tabela</button>
          </div>
          <button type="button" className="data-wizard-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        {error && <div className="data-wizard-error">{error}</div>}

        {tab === 'malha' && (
          <div className="data-wizard-body">
            <p className="data-wizard-help">
              Escolha os estados. Os limites dos municípios (IBGE) já vêm com o app — não é preciso baixar nada.
            </p>
            {!index ? <p>Carregando lista…</p> : (
              <>
                <div className="data-wizard-quick">
                  <button type="button" onClick={() => setSelected(new Set(index.ufs.map(u => u.codigo_uf)))}>Brasil inteiro</button>
                  {REGIOES.map(r => <button type="button" key={r.sigla} onClick={() => selectRegion(r.sigla)}>{r.nome}</button>)}
                  <button type="button" onClick={() => setSelected(new Set())}>Limpar</button>
                </div>
                <div className="data-wizard-ufs">
                  {index.ufs.map(u => (
                    <label key={u.codigo_uf} className={selected.has(u.codigo_uf) ? 'checked' : ''} title={`${u.nome} — ${u.municipios} municípios`}>
                      <input type="checkbox" checked={selected.has(u.codigo_uf)} onChange={() => toggleUf(u.codigo_uf)} />
                      <span>{u.uf}</span>
                    </label>
                  ))}
                </div>
                <div className="data-wizard-footer">
                  <span>{selected.size ? `${selectedInfo.municipios} municípios · ${kb(selectedInfo.bytes)}` : 'Nenhum estado selecionado'}</span>
                  <button type="button" className="data-wizard-primary" disabled={!selected.size || busy} onClick={loadMalha}>
                    {busy ? 'Carregando…' : 'Carregar no mapa'}
                  </button>
                </div>
                {done && <div className="data-wizard-ok">{done}</div>}
                <p className="data-wizard-source">Fonte: {index.fonte}</p>
              </>
            )}
          </div>
        )}

        {tab === 'tabela' && (
          <div className="data-wizard-body">
            {!report && (
              <>
                <p className="data-wizard-help">
                  Envie uma tabela <strong>CSV</strong> com uma coluna de <strong>código IBGE do município</strong> (7 dígitos,
                  ou 6 como no DATASUS) e as colunas com os seus dados. Separador <code>;</code> ou <code>,</code> e números
                  como <code>1.234,5</code> são aceitos. Os municípios e seus limites entram no mapa automaticamente.
                </p>
                <label className="data-wizard-file">
                  <input type="file" accept=".csv,.txt,text/csv" onChange={onFile} />
                  <span>{table ? `📄 ${table.name}` : '📂 Escolher arquivo CSV'}</span>
                </label>
                {table && (
                  <>
                    <p className="data-wizard-meta">
                      {table.rows.length} linhas · {table.headers.length} colunas · separador “{table.delimiter === '\t' ? 'tab' : table.delimiter}” · {table.encoding}
                    </p>
                    <div className="data-wizard-row">
                      <label htmlFor="dw-code">Coluna com o código IBGE:</label>
                      <select id="dw-code" value={codeColumn} onChange={e => setCodeColumn(e.target.value)}>
                        <option value="">Selecione…</option>
                        {table.headers.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                    {!codeColumn && <p className="data-wizard-warn">Não encontrei uma coluna de códigos IBGE. Escolha a coluna acima.</p>}
                    <div className="data-wizard-preview">
                      <table>
                        <thead><tr>{table.headers.slice(0, 6).map(h => <th key={h}>{h}</th>)}</tr></thead>
                        <tbody>{table.rows.slice(0, 4).map((r, i) => <tr key={i}>{table.headers.slice(0, 6).map(h => <td key={h}>{r[h]}</td>)}</tr>)}</tbody>
                      </table>
                    </div>
                    <div className="data-wizard-footer">
                      <span />
                      <button type="button" className="data-wizard-primary" disabled={!codeColumn || busy} onClick={doJoin}>
                        {busy ? 'Juntando…' : 'Juntar ao mapa'}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
            {report && (
              <>
                <div className={report.matched ? 'data-wizard-ok' : 'data-wizard-error'}>
                  {report.matched} de {report.total} linhas encontradas
                  {report.added ? ` · ${report.added} municípios adicionados ao mapa` : ''}
                </div>
                {report.unmatched.length > 0 && (
                  <p className="data-wizard-warn">
                    Códigos não encontrados ({report.unmatched.length}): {report.unmatched.slice(0, 15).join(', ')}{report.unmatched.length > 15 ? '…' : ''}.
                    Confira se são códigos IBGE de município (ex.: 3550308 = São Paulo) e se não há linhas de total.
                  </p>
                )}
                {report.newColumns.length > 0 && (
                  <div className="data-wizard-row">
                    <label htmlFor="dw-color">Colorir o mapa por:</label>
                    <select id="dw-color" value={colorBy} onChange={e => setColorBy(e.target.value)}>
                      {report.newColumns.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
                <div className="data-wizard-footer">
                  <button type="button" onClick={() => { setReport(null); setTable(null); }}>Juntar outra tabela</button>
                  <button type="button" className="data-wizard-primary" onClick={applyColor}>Ver no mapa</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
