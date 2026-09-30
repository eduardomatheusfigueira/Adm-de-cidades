import React, { useState, useMemo, useEffect, useContext } from 'react';
import { Download, Map as MapIcon, Search, ArrowDownWideNarrow, ArrowUpNarrowWide, TriangleAlert } from 'lucide-react';
import Papa from 'papaparse';
import { UIContext } from '../../contexts/UIContext';
import { DataContext } from '../../contexts/DataContext';
import { isNumericValues, makeNumberParser, rotuloAtributo, CORES_REGIOES, NOMES_REGIOES } from '../../utils/colorUtils';
import '../../styles/data-visualization/RankingView.css';

const EXCLUIDOS = new Set(['Codigo_Municipio', 'Longitude_Municipio', 'Latitude_Municipio', 'Nome_Municipio']);
const semAcento = (t) => (t || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const ehCapital = (c) => String(c?.Capital).trim().toLowerCase() === 'true';
const fmt = (v) => (Number.isFinite(v) ? v.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : '—');
const POR_PAGINA = 50;

// Ranking de municípios por atributo do cadastro (ex.: área) ou por indicador importado
const RankingView = ({ indicadoresData, csvData }) => {
  const { csvHeaders } = useContext(DataContext);
  const { handleVisualizationConfigChange, setActiveEnvironment, selectedCityInfo } = useContext(UIContext);

  // Fontes disponíveis: atributos numéricos e indicadores
  const atributos = useMemo(() => (csvHeaders || []).filter(h => !EXCLUIDOS.has(h)).filter(h => {
    const vals = (csvData || []).map(r => r?.[h]).filter(v => v !== undefined && v !== null && `${v}`.trim() !== '');
    return vals.length > 0 && isNumericValues(vals);
  }), [csvHeaders, csvData]);
  const indicadores = useMemo(() => [...new Set((indicadoresData || []).map(d => d.Nome_Indicador))].filter(Boolean).sort(), [indicadoresData]);

  const [fonte, setFonte] = useState('');
  const [ano, setAno] = useState('');
  const [recorte, setRecorte] = useState('all');
  const [regiao, setRegiao] = useState('all');
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState('desc');
  const [limite, setLimite] = useState(POR_PAGINA);

  useEffect(() => {
    const valida = fonte && ((fonte.startsWith('attr:') && atributos.includes(fonte.slice(5))) || (fonte.startsWith('ind:') && indicadores.includes(fonte.slice(4))));
    if (!valida) setFonte(atributos.length ? `attr:${atributos.includes('Area_Municipio') ? 'Area_Municipio' : atributos[0]}` : indicadores.length ? `ind:${indicadores[0]}` : '');
  }, [atributos, indicadores, fonte]);

  const ehIndicador = fonte.startsWith('ind:');
  const nomeFonte = fonte.slice(ehIndicador ? 4 : 5);
  const anos = useMemo(() => ehIndicador
    ? [...new Set((indicadoresData || []).filter(d => d.Nome_Indicador === nomeFonte).map(d => d.Ano_Observacao))].sort((a, b) => b - a)
    : [], [indicadoresData, ehIndicador, nomeFonte]);
  useEffect(() => { if (ehIndicador && !anos.includes(ano)) setAno(anos[0] || ''); }, [anos, ano, ehIndicador]);
  useEffect(() => { setLimite(POR_PAGINA); }, [fonte, ano, recorte, regiao, busca, ordem]);

  const regioes = useMemo(() => [...new Set((csvData || []).map(c => c.Sigla_Regiao))].filter(Boolean).sort(), [csvData]);

  // Linhas com valor
  const { linhas, semDado } = useMemo(() => {
    if (!fonte || !csvData) return { linhas: [], semDado: [] };
    let municipios = csvData;
    if (recorte === 'capital') municipios = municipios.filter(ehCapital);
    else if (recorte === 'non-capital') municipios = municipios.filter(c => !ehCapital(c));
    if (regiao !== 'all') municipios = municipios.filter(c => c.Sigla_Regiao === regiao);

    let valorDe;
    if (ehIndicador) {
      const doAno = (indicadoresData || []).filter(d => d.Nome_Indicador === nomeFonte && d.Ano_Observacao === ano);
      const parse = makeNumberParser(doAno.map(d => d.Valor));
      const porCodigo = new Map(doAno.map(d => [String(d.Codigo_Municipio), parse(d.Valor)]));
      valorDe = (c) => porCodigo.get(String(c.Codigo_Municipio));
    } else {
      const parse = makeNumberParser(csvData.map(r => r[nomeFonte]));
      valorDe = (c) => parse(c[nomeFonte]);
    }
    const com = []; const sem = [];
    municipios.forEach(c => {
      const v = valorDe(c);
      (Number.isFinite(v) ? com : sem).push({ ...c, valor: v });
    });
    com.sort((a, b) => (ordem === 'desc' ? b.valor - a.valor : a.valor - b.valor));
    com.forEach((c, i) => { c.posicao = i + 1; });
    return { linhas: com, semDado: sem };
  }, [fonte, csvData, indicadoresData, ehIndicador, nomeFonte, ano, recorte, regiao, ordem]);

  const visiveis = useMemo(() => {
    const termo = semAcento(busca.trim());
    if (!termo) return linhas;
    return linhas.filter(c => semAcento(c.Nome_Municipio).includes(termo) || String(c.Codigo_Municipio).startsWith(termo));
  }, [linhas, busca]);

  const maxAbs = useMemo(() => Math.max(1e-9, ...linhas.map(c => Math.abs(c.valor))), [linhas]);
  const resumo = useMemo(() => {
    if (!linhas.length) return null;
    const ord = [...linhas].sort((a, b) => b.valor - a.valor);
    const med = ord[Math.floor(ord.length / 2)];
    return { maior: ord[0], menor: ord[ord.length - 1], mediana: med.valor };
  }, [linhas]);
  const porRegiao = useMemo(() => {
    const cont = {};
    linhas.forEach(c => { if (c.Sigla_Regiao) cont[c.Sigla_Regiao] = (cont[c.Sigla_Regiao] || 0) + 1; });
    return Object.keys(NOMES_REGIOES).filter(r => cont[r]).map(r => ({ r, n: cont[r] }));
  }, [linhas]);

  const selecionado = String(selectedCityInfo?.properties?.CD_MUN ?? selectedCityInfo?.properties?.Codigo_Municipio ?? '');
  const linhaSelecionada = selecionado ? linhas.find(c => String(c.Codigo_Municipio) === selecionado) : null;
  const mostradas = visiveis.slice(0, limite);
  const fixarSelecionada = linhaSelecionada && !mostradas.includes(linhaSelecionada) && !busca;

  const titulo = ehIndicador ? `${nomeFonte}${ano ? ` (${ano})` : ''}` : rotuloAtributo(nomeFonte);
  const recorteTexto = recorte === 'capital' ? 'das capitais' : recorte === 'non-capital' ? 'dos municípios que não são capitais' : 'dos municípios';

  const verNoMapa = () => {
    handleVisualizationConfigChange(ehIndicador
      ? { type: 'indicator', indicator: nomeFonte, year: ano, valueType: 'value', renderMode: 'filled', fillOpacity: 0.85 }
      : { type: 'attribute', attribute: nomeFonte, renderMode: 'filled', fillOpacity: 0.85 });
    setActiveEnvironment('map');
  };

  const exportarCsv = () => {
    const csv = Papa.unparse(visiveis.map(c => ({
      Posicao: c.posicao, Codigo_Municipio: c.Codigo_Municipio, Municipio: c.Nome_Municipio, UF: c.Sigla_Estado,
      Regiao: NOMES_REGIOES[c.Sigla_Regiao] || c.Sigla_Regiao, [titulo]: c.valor,
    })), { delimiter: ';' });
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'ranking_municipios.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  const Linha = ({ c, destaque }) => {
    const largura = Math.max(2, Math.round((Math.abs(c.valor) / maxAbs) * 100));
    return (
      <tr className={destaque ? 'ranking-destaque' : ''}>
        <td className="ranking-pos">{c.posicao}º</td>
        <td className="ranking-nome">{destaque && <span className="ranking-ponto" aria-hidden="true" />}{c.Nome_Municipio}</td>
        <td>{c.Sigla_Estado}</td>
        <td className="ranking-regiao">
          {c.Sigla_Regiao && <><span className="ranking-amostra" style={{ background: CORES_REGIOES[c.Sigla_Regiao] || 'var(--papel-500)' }} />{NOMES_REGIOES[c.Sigla_Regiao] || c.Sigla_Regiao}</>}
        </td>
        <td className="ranking-valor">{fmt(c.valor)}</td>
        <td className="ranking-barra-cel" aria-hidden="true">
          <span className={`ranking-barra ${c.valor < 0 ? 'negativa' : ''}`} style={{ width: `${largura}%` }} />
        </td>
      </tr>
    );
  };

  return (
    <div className="ranking fade-in">
      <div className="ranking-topo">
        <div>
          <h1>Ranking de municípios</h1>
          <p>{fonte ? `${titulo} ${recorteTexto}, ${ordem === 'desc' ? 'do maior para o menor' : 'do menor para o maior'}` : 'Nenhum dado numérico carregado ainda.'}</p>
        </div>
        <div className="ranking-acoes">
          <button type="button" className="btn btn-secondary" onClick={exportarCsv} disabled={!visiveis.length}>
            <Download size={16} strokeWidth={1.75} aria-hidden="true" /> Exportar CSV
          </button>
          <button type="button" className="btn btn-primary" onClick={verNoMapa} disabled={!fonte}>
            <MapIcon size={16} strokeWidth={1.75} aria-hidden="true" /> Ver no mapa
          </button>
        </div>
      </div>

      <div className="ranking-filtros">
        <div className="campo ranking-fonte">
          <label htmlFor="rk-fonte">Indicador ou atributo</label>
          <select id="rk-fonte" className="selecao" value={fonte} onChange={(e) => setFonte(e.target.value)} disabled={!atributos.length && !indicadores.length}>
            {atributos.length > 0 && <optgroup label="Atributos do município">{atributos.map(a => <option key={a} value={`attr:${a}`}>{rotuloAtributo(a)}</option>)}</optgroup>}
            {indicadores.length > 0 && <optgroup label="Indicadores importados">{indicadores.map(i => <option key={i} value={`ind:${i}`}>{i}</option>)}</optgroup>}
          </select>
        </div>
        {ehIndicador && (
          <div className="campo">
            <label htmlFor="rk-ano">Ano</label>
            <select id="rk-ano" className="selecao" value={ano} onChange={(e) => setAno(e.target.value)}>
              {anos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        )}
        <div className="campo">
          <span className="campo-rotulo">Recorte</span>
          <div className="segmentado" role="group" aria-label="Recorte">
            <button type="button" aria-pressed={recorte === 'all'} onClick={() => setRecorte('all')}>Todos</button>
            <button type="button" aria-pressed={recorte === 'capital'} onClick={() => setRecorte('capital')}>Capitais</button>
            <button type="button" aria-pressed={recorte === 'non-capital'} onClick={() => setRecorte('non-capital')}>Não capitais</button>
          </div>
        </div>
        <div className="campo">
          <label htmlFor="rk-regiao">Região</label>
          <select id="rk-regiao" className="selecao" value={regiao} onChange={(e) => setRegiao(e.target.value)}>
            <option value="all">Todas</option>
            {regioes.map(r => <option key={r} value={r}>{NOMES_REGIOES[r] || r}</option>)}
          </select>
        </div>
        <div className="campo ranking-busca">
          <label htmlFor="rk-busca">Buscar</label>
          <div className="ranking-busca-caixa">
            <Search size={18} strokeWidth={1.75} aria-hidden="true" />
            <input id="rk-busca" type="search" className="entrada" placeholder="Nome ou código IBGE" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="ranking-corpo">
        <div className="ranking-tabela-caixa">
          {visiveis.length > 0 ? (
            <table className="ranking-tabela">
              <thead>
                <tr>
                  <th scope="col">Posição</th>
                  <th scope="col">Município</th>
                  <th scope="col">UF</th>
                  <th scope="col">Região</th>
                  <th scope="col" className="ranking-valor">
                    <button type="button" className="ranking-ordem" onClick={() => setOrdem(o => (o === 'desc' ? 'asc' : 'desc'))} aria-label={`Ordenar ${ordem === 'desc' ? 'do menor para o maior' : 'do maior para o menor'}`}>
                      {ehIndicador ? 'Valor' : rotuloAtributo(nomeFonte)}
                      {ordem === 'desc' ? <ArrowDownWideNarrow size={15} strokeWidth={1.75} aria-hidden="true" /> : <ArrowUpNarrowWide size={15} strokeWidth={1.75} aria-hidden="true" />}
                    </button>
                  </th>
                  <th scope="col"><span className="sr-only">Barra proporcional ao valor</span></th>
                </tr>
              </thead>
              <tbody>
                {mostradas.map(c => <Linha key={c.Codigo_Municipio} c={c} destaque={String(c.Codigo_Municipio) === selecionado} />)}
                {fixarSelecionada && <Linha c={linhaSelecionada} destaque />}
              </tbody>
            </table>
          ) : (
            <p className="ranking-vazio">{fonte ? 'Nenhum município encontrado com esses filtros.' : 'Carregue municípios no mapa ou junte uma tabela para montar um ranking.'}</p>
          )}
          {visiveis.length > 0 && (
            <div className="ranking-rodape">
              <span>
                Mostrando {Math.min(limite, visiveis.length).toLocaleString('pt-BR')} de {visiveis.length.toLocaleString('pt-BR')}
                {fixarSelecionada && ` · ${linhaSelecionada.Nome_Municipio} fixado por estar selecionado no mapa`}
              </span>
              {limite < visiveis.length && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setLimite(l => l + POR_PAGINA)}>Mostrar mais</button>
              )}
            </div>
          )}
        </div>

        <aside className="ranking-lateral" aria-label="Resumo">
          {resumo && (
            <section className="ranking-cartao">
              <h2>Resumo</h2>
              <div className="ranking-kpi"><span className="rotulo">Maior</span><strong>{fmt(resumo.maior.valor)}</strong><span>{resumo.maior.Nome_Municipio} ({resumo.maior.Sigla_Estado})</span></div>
              <div className="ranking-kpi"><span className="rotulo">Mediana</span><strong>{fmt(resumo.mediana)}</strong></div>
              <div className="ranking-kpi"><span className="rotulo">Menor</span><strong>{fmt(resumo.menor.valor)}</strong><span>{resumo.menor.Nome_Municipio} ({resumo.menor.Sigla_Estado})</span></div>
            </section>
          )}
          {porRegiao.length > 0 && (
            <section className="ranking-cartao">
              <h2>Municípios por região</h2>
              <div className="ranking-regioes-barra" aria-hidden="true">
                {porRegiao.map(({ r, n }) => <span key={r} style={{ flexGrow: n, background: CORES_REGIOES[r] }} />)}
              </div>
              <ul className="ranking-regioes-lista">
                {porRegiao.map(({ r, n }) => (
                  <li key={r}><span className="ranking-amostra" style={{ background: CORES_REGIOES[r] }} />{NOMES_REGIOES[r]} · {n.toLocaleString('pt-BR')}</li>
                ))}
              </ul>
            </section>
          )}
          {semDado.length > 0 && (
            <div className="aviso aviso-atencao" role="note">
              <TriangleAlert size={18} strokeWidth={1.75} aria-hidden="true" />
              <div>
                <strong>{semDado.length.toLocaleString('pt-BR')} {semDado.length === 1 ? 'município sem dado' : 'municípios sem dado'}</strong>
                <p>{semDado.slice(0, 3).map(c => `${c.Nome_Municipio} (${c.Sigla_Estado})`).join(', ')}{semDado.length > 3 ? '…' : ''} ficam fora do ranking e aparecem como “Sem dados” no mapa.</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default RankingView;
