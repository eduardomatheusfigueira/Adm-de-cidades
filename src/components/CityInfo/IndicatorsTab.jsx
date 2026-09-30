import React, { useState, useMemo } from 'react';

const IndicatorsTab = ({ indicators }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc' based on rank

    const filteredIndicators = useMemo(() => {
        if (!indicators) return [];
        return indicators
            .filter(ind =>
                ind.Nome_Indicador.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const rankA = parseFloat(a.Indice_Posicional);
                const rankB = parseFloat(b.Indice_Posicional);
                return sortOrder === 'asc' ? rankA - rankB : rankB - rankA;
            });
    }, [indicators, searchTerm, sortOrder]);

    return (
        <div className="indicators-tab">
            <div className="indicators-controls">
                <input
                    type="search"
                    placeholder="Buscar indicador"
                    aria-label="Buscar indicador"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="entrada"
                />
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                >
                    Índice: {sortOrder === 'asc' ? 'menor → maior' : 'maior → menor'}
                </button>
            </div>
            <div className="indicators-list">
                {filteredIndicators.map((ind, index) => (
                    <div key={index} className="indicator-item">
                        <div className="indicator-info">
                            <span className="indicator-name">{ind.Nome_Indicador}</span>
                            {ind.Unidade_Medida && <span className="indicator-unit">{ind.Unidade_Medida} · {ind.Ano_Observacao}</span>}
                        </div>
                        <div className="indicator-stats">
                            <span className="indicator-value">
                                {new Intl.NumberFormat('pt-BR').format(ind.Valor)}
                            </span>
                            {!Number.isNaN(parseFloat(ind.Indice_Posicional)) && (
                                <span className="indicator-rank">
                                    Índice {parseFloat(ind.Indice_Posicional).toLocaleString('pt-BR', { maximumFractionDigits: 3 })}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                {filteredIndicators.length === 0 && (
                    <div className="no-data-placeholder">{indicators && indicators.length ? 'Nenhum indicador encontrado.' : 'Nenhum indicador importado para este município.'}</div>
                )}
            </div>
        </div>
    );
};

export default IndicatorsTab;
