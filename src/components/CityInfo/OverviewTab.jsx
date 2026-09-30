import React, { useContext, useMemo } from 'react';
import { Upload, Info } from 'lucide-react';
import { DataContext } from '../../contexts/DataContext';
import { UIContext } from '../../contexts/UIContext';
import { CORES_REGIOES, NOMES_REGIOES, parseNumberBR, rotuloAtributo } from '../../utils/colorUtils';

// Colunas do cadastro base; o que sobrar em csvHeaders veio de uma tabela juntada pelo usuário
const COLUNAS_BASE = new Set(['Codigo_Municipio', 'Nome_Municipio', 'Sigla_Estado', 'Sigla_Regiao', 'Area_Municipio', 'Capital',
  'Altitude_Municipio', 'Longitude_Municipio', 'Latitude_Municipio', 'Descricao', 'geometry']);

const fmt = (v, casas) => (Number.isFinite(v) ? v.toLocaleString('pt-BR', casas !== undefined ? { minimumFractionDigits: casas, maximumFractionDigits: casas } : undefined) : '—');

const OverviewTab = ({ cityData, indicators }) => {
    const { csvData, csvHeaders } = useContext(DataContext);
    const { setDataWizardMode } = useContext(UIContext);

    const area = parseNumberBR(cityData?.Area_Municipio);
    const areaValida = Number.isFinite(area) && area > 0;

    // Posição do município no estado pela área territorial
    const posicao = useMemo(() => {
        if (!areaValida || !cityData?.Sigla_Estado) return null;
        const doEstado = (csvData || [])
            .filter(c => c.Sigla_Estado === cityData.Sigla_Estado)
            .map(c => parseNumberBR(c.Area_Municipio))
            .filter(v => Number.isFinite(v) && v > 0);
        const maiores = doEstado.filter(v => v > area).length;
        return { lugar: maiores + 1, total: doEstado.length };
    }, [csvData, cityData, area, areaValida]);

    const seusDados = useMemo(() => (csvHeaders || [])
        .filter(h => !COLUNAS_BASE.has(h) && cityData?.[h] !== undefined && `${cityData[h]}`.trim() !== ''), [csvHeaders, cityData]);

    if (!cityData) return null;

    const lat = parseNumberBR(cityData.Latitude_Municipio);
    const lon = parseNumberBR(cityData.Longitude_Municipio);
    const regiao = cityData.Sigla_Regiao;

    return (
        <div className="overview-tab">
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Área</span>
                    {areaValida
                        ? <span className="stat-value">{fmt(area, 1)} <small>km²</small></span>
                        : <span className="stat-value stat-sem-dado">Sem dados</span>}
                </div>
                {posicao && (
                    <div className="stat-card">
                        <span className="stat-label">Posição em área no estado</span>
                        <span className="stat-value">{posicao.lugar}º <small>de {posicao.total}</small></span>
                    </div>
                )}
                {regiao && (
                    <div className="stat-card">
                        <span className="stat-label">Região</span>
                        <span className="stat-value stat-regiao">
                            <span className="stat-amostra" style={{ background: CORES_REGIOES[regiao] || 'var(--papel-500)' }} />
                            {NOMES_REGIOES[regiao] || regiao}
                        </span>
                    </div>
                )}
                {Number.isFinite(lat) && Number.isFinite(lon) && (
                    <div className="stat-card">
                        <span className="stat-label">Coordenadas</span>
                        <span className="stat-value stat-coordenadas">{fmt(lat)}<br />{fmt(lon)}</span>
                    </div>
                )}
                {seusDados.map(col => (
                    <div key={col} className="stat-card">
                        <span className="stat-label">{rotuloAtributo(col)}</span>
                        <span className="stat-value stat-valor-livre">{cityData[col]}</span>
                    </div>
                ))}
            </div>

            {(!indicators || indicators.length === 0) && (
                <div className="aviso aviso-info cib-vazio">
                    <Info size={18} strokeWidth={1.75} aria-hidden="true" />
                    <div>
                        <p>Nenhum indicador importado para {cityData.Nome_Municipio || 'este município'} ainda.</p>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDataWizardMode('tabela')}>
                            <Upload size={15} strokeWidth={1.75} aria-hidden="true" /> Juntar minha tabela
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewTab;
