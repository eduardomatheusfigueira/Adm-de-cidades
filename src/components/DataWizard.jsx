import React, { useContext, useEffect, useMemo, useState } from 'react';
import { X, Map as MapIcon, Upload, FileUp, Table, Check, CircleCheck, TriangleAlert, CircleX, KeyRound, Hash, ChevronRight } from 'lucide-react';
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
// onShowMap: chamado quando o assistente termina e o aluno deve ver o mapa (no celular, o
// painel lateral é recolhido para o mapa aparecer)
export default function DataWizard({ mode, onClose, onShowMap }) {
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
      setTimeout(() => { onShowMap?.(); onClose(); }, 900);
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
    await lerArquivo(file);
  };

  // (Re)lê o arquivo; em planilhas com várias abas, `aba` escolhe qual
  const lerArquivo = async (file, aba) => {
    setBusy(true);
    try {
      const t = await readTableFile(file, aba);
      setTable({ ...t, name: file.name, file });
      setCodeColumn(guessCodeColumn(t.headers, t.rows) || '');
    } catch (err) { setError(err.message); setTable(null); }
    setBusy(false);
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
    if (colorBy) handleVisualizationConfigChange({ type: 'attribute', attribute: colorBy, renderMode: 'filled', fillOpacity: 0.85, borderWidth: 2 });
    setActiveEnvironment?.('map');
    onShowMap?.();
    onClose();
  };

  const etapa = !table ? 1 : !report ? 2 : 3;
  const ETAPAS = ['Arquivo', 'Colunas', 'Ver no mapa'];
  const ehNumerica = (col) => table && isNumericValues(table.rows.map(r => r[col]));

  return (
    <div className="modal-overlay data-wizard-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="data-wizard" role="dialog" aria-modal="true" aria-labelledby="dw-titulo">
        <div className="data-wizard-header">
          <div>
            <h2 id="dw-titulo">{tab === 'malha' ? 'Mapa do Brasil (IBGE)' : 'Juntar minha tabela'}</h2>
            <p>{tab === 'malha'
              ? 'Escolha os estados. Os limites dos municípios já vêm com o app.'
              : 'Ligue uma planilha sua aos municípios pelo código IBGE.'}</p>
          </div>
          <button type="button" className="data-wizard-close" onClick={onClose} aria-label="Fechar">
            <X size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="abas data-wizard-tabs" role="tablist" aria-label="Origem dos dados">
          <button type="button" role="tab" aria-selected={tab === 'malha'} onClick={() => setTab('malha')}>
            <MapIcon size={16} strokeWidth={1.75} aria-hidden="true" /> Mapa do Brasil
          </button>
          <button type="button" role="tab" aria-selected={tab === 'tabela'} onClick={() => setTab('tabela')}>
            <Upload size={16} strokeWidth={1.75} aria-hidden="true" /> Juntar minha tabela
          </button>
        </div>

        {error && (
          <div className="aviso aviso-erro data-wizard-aviso" role="alert">
            <CircleX size={18} strokeWidth={1.75} aria-hidden="true" /><span>{error}</span>
          </div>
        )}

        {tab === 'malha' && (
          <>
            <div className="data-wizard-body">
              {!index ? <p className="data-wizard-help">Carregando a lista de estados…</p> : (
                <>
                  <div className="data-wizard-quick" role="group" aria-label="Seleção rápida">
                    <button type="button" onClick={() => setSelected(new Set(index.ufs.map(u => u.codigo_uf)))}>Brasil inteiro</button>
                    {REGIOES.map(r => <button type="button" key={r.sigla} onClick={() => selectRegion(r.sigla)}>{r.nome}</button>)}
                    <button type="button" className="data-wizard-limpar" onClick={() => setSelected(new Set())}>Limpar</button>
                  </div>
                  <div className="data-wizard-ufs">
                    {index.ufs.map(u => (
                      <label key={u.codigo_uf} className={selected.has(u.codigo_uf) ? 'checked' : ''} title={`${u.nome} — ${u.municipios} municípios`}>
                        <input type="checkbox" checked={selected.has(u.codigo_uf)} onChange={() => toggleUf(u.codigo_uf)} />
                        <span>{u.uf}</span>
                      </label>
                    ))}
                  </div>
                  {done && (
                    <div className="aviso aviso-sucesso" role="status">
                      <CircleCheck size={18} strokeWidth={1.75} aria-hidden="true" /><span>{done}</span>
                    </div>
                  )}
                  <p className="data-wizard-source">Fonte: {index.fonte}</p>
                </>
              )}
            </div>
            <div className="data-wizard-footer">
              <span className="data-wizard-status">
                {selected.size ? `${selected.size} ${selected.size === 1 ? 'estado' : 'estados'} · ${selectedInfo.municipios.toLocaleString('pt-BR')} municípios · ${kb(selectedInfo.bytes)}` : 'Nenhum estado selecionado'}
              </span>
              <button type="button" className="btn btn-primary" disabled={!selected.size || busy} onClick={loadMalha}>
                {busy ? 'Carregando…' : 'Carregar no mapa'}
              </button>
            </div>
          </>
        )}

        {tab === 'tabela' && (
          <>
            <ol className="data-wizard-etapas" aria-label="Etapas">
              {ETAPAS.map((nome, i) => {
                const n = i + 1;
                const estado = n < etapa ? 'feita' : n === etapa ? 'atual' : 'futura';
                return (
                  <React.Fragment key={nome}>
                    {i > 0 && <li className="data-wizard-etapa-linha" aria-hidden="true" />}
                    <li className={`data-wizard-etapa ${estado}`} aria-current={estado === 'atual' ? 'step' : undefined}>
                      <span className="data-wizard-etapa-num">{estado === 'feita' ? <Check size={14} strokeWidth={2.5} aria-hidden="true" /> : n}</span>
                      {nome}
                    </li>
                  </React.Fragment>
                );
              })}
            </ol>

            <div className="data-wizard-body">
              {!table && (
                <>
                  <label className="data-wizard-soltar">
                    <input type="file" accept=".csv,.txt,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={onFile} className="sr-only" />
                    <FileUp size={30} strokeWidth={1.5} aria-hidden="true" />
                    <span><strong>Escolha uma planilha (.xlsx) ou um arquivo CSV</strong></span>
                    <span className="data-wizard-soltar-sub">Uma coluna com o código IBGE do município (7 dígitos, ou 6 como no DATASUS) e as colunas com os seus dados.</span>
                  </label>
                  <ul className="data-wizard-dicas">
                    <li><Check size={15} strokeWidth={2} aria-hidden="true" /> Excel (.xlsx) ou CSV com separador <code>;</code> ou <code>,</code></li>
                    <li><Check size={15} strokeWidth={2} aria-hidden="true" /> Título e notas acima do cabeçalho são ignorados</li>
                    <li><Check size={15} strokeWidth={2} aria-hidden="true" /> Números como <code>1.234,5</code> ou <code>1234.5</code></li>
                    <li><Check size={15} strokeWidth={2} aria-hidden="true" /> Os municípios e seus limites entram no mapa automaticamente</li>
                  </ul>
                </>
              )}

              {table && !report && (
                <>
                  <div className="data-wizard-arquivo">
                    <span className="data-wizard-arquivo-icone"><Table size={20} strokeWidth={1.75} aria-hidden="true" /></span>
                    <div>
                      <strong>{table.name}</strong>
                      <span>{table.rows.length.toLocaleString('pt-BR')} linhas · {table.headers.length} colunas · {table.sheets
                        ? <>planilha Excel{table.headerRow > 1 ? ` · cabeçalho na linha ${table.headerRow}` : ''}</>
                        : <>separador “{table.delimiter === '\t' ? 'tab' : table.delimiter}” · {table.encoding}</>}</span>
                    </div>
                    <label className="btn btn-ghost btn-sm data-wizard-trocar">
                      Trocar arquivo
                      <input type="file" accept=".csv,.txt,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={onFile} className="sr-only" />
                    </label>
                  </div>

                  {table.sheets?.length > 1 && (
                    <div className="campo">
                      <label htmlFor="dw-aba">Aba da planilha</label>
                      <select id="dw-aba" className="selecao" value={table.sheet} disabled={busy} onChange={e => lerArquivo(table.file, e.target.value)}>
                        {table.sheets.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="campo">
                    <label htmlFor="dw-code">Coluna com o código IBGE</label>
                    <select id="dw-code" className="selecao data-wizard-mono" value={codeColumn} onChange={e => setCodeColumn(e.target.value)}>
                      <option value="">Escolha a coluna…</option>
                      {table.headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    {codeColumn
                      ? <span className="data-wizard-ok-linha"><CircleCheck size={14} strokeWidth={2} aria-hidden="true" /> Os códigos serão procurados na coluna “{codeColumn}”.</span>
                      : <span className="data-wizard-warn-linha"><TriangleAlert size={14} strokeWidth={2} aria-hidden="true" /> Não encontrei uma coluna de códigos IBGE sozinho. Escolha a coluna acima.</span>}
                  </div>

                  <div className="data-wizard-preview">
                    <div className="data-wizard-preview-topo">
                      <span>Prévia</span>
                      <span>{Math.min(4, table.rows.length)} de {table.rows.length.toLocaleString('pt-BR')} linhas</span>
                    </div>
                    <div className="data-wizard-preview-tabela">
                      <table>
                        <thead>
                          <tr>
                            {table.headers.slice(0, 6).map(h => (
                              <th key={h} className={h === codeColumn ? 'chave' : ''}>
                                <span className="data-wizard-col">{h}</span>
                                {h === codeColumn
                                  ? <span className="data-wizard-papel chave"><KeyRound size={11} strokeWidth={2} aria-hidden="true" /> Código IBGE</span>
                                  : ehNumerica(h)
                                    ? <span className="data-wizard-papel numero"><Hash size={11} strokeWidth={2} aria-hidden="true" /> Número</span>
                                    : <span className="data-wizard-papel">Texto</span>}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>{table.rows.slice(0, 4).map((r, i) => <tr key={i}>{table.headers.slice(0, 6).map(h => <td key={h}>{r[h]}</td>)}</tr>)}</tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {report && (
                <>
                  <div className={`aviso ${report.matched ? 'aviso-sucesso' : 'aviso-erro'}`} role="status">
                    {report.matched ? <CircleCheck size={18} strokeWidth={1.75} aria-hidden="true" /> : <CircleX size={18} strokeWidth={1.75} aria-hidden="true" />}
                    <span>
                      <strong>{report.matched.toLocaleString('pt-BR')} de {report.total.toLocaleString('pt-BR')} linhas encontradas</strong>
                      {report.added ? ` · ${report.added.toLocaleString('pt-BR')} municípios adicionados ao mapa` : ''}
                    </span>
                  </div>
                  {report.unmatched.length > 0 && (
                    <div className="aviso aviso-atencao">
                      <TriangleAlert size={18} strokeWidth={1.75} aria-hidden="true" />
                      <span>
                        Códigos não encontrados ({report.unmatched.length}): {report.unmatched.slice(0, 15).join(', ')}{report.unmatched.length > 15 ? '…' : ''}.
                        Confira se são códigos IBGE de município (ex.: 3550308 = São Paulo) e se não há linhas de total.
                      </span>
                    </div>
                  )}
                  {report.newColumns.length > 0 && (
                    <div className="campo">
                      <label htmlFor="dw-color">Pintar o mapa por</label>
                      <select id="dw-color" className="selecao data-wizard-mono" value={colorBy} onChange={e => setColorBy(e.target.value)}>
                        {report.newColumns.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="data-wizard-footer">
              <span className="data-wizard-status">{table ? `Etapa ${etapa} de 3` : 'Etapa 1 de 3'}</span>
              <div className="data-wizard-footer-acoes">
                {table && !report && <button type="button" className="btn btn-secondary" onClick={() => setTable(null)}>Voltar</button>}
                {table && !report && (
                  <button type="button" className="btn btn-primary" disabled={!codeColumn || busy} onClick={doJoin}>
                    {busy ? 'Juntando…' : 'Juntar ao mapa'} <ChevronRight size={17} strokeWidth={2} aria-hidden="true" />
                  </button>
                )}
                {report && <button type="button" className="btn btn-secondary" onClick={() => { setReport(null); setTable(null); }}>Juntar outra tabela</button>}
                {report && (
                  <button type="button" className="btn btn-primary" onClick={applyColor}>
                    Ver no mapa <ChevronRight size={17} strokeWidth={2} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
