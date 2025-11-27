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
                    type="text"
                    placeholder="Buscar indicador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button
                    className="sort-button"
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                >
                    Ordem: {sortOrder === 'asc' ? 'Melhor -> Pior' : 'Pior -> Melhor'}
                </button>
            </div>
            <div className="indicators-list">
                {filteredIndicators.map((ind, index) => (
                    <div key={index} className="indicator-item">
                        <div className="indicator-info">
                            <span className="indicator-name">{ind.Nome_Indicador}</span>
                            <span className="indicator-unit">({ind.Unidade_Medida})</span>
                        </div>
                        <div className="indicator-stats">
                            <span className="indicator-value">
                                {new Intl.NumberFormat('pt-BR').format(ind.Valor)}
                            </span>
                            <span className={`indicator-rank ${parseFloat(ind.Indice_Posicional) <= 0.5 ? 'good' : 'bad'}`}>
                                Índice: {parseFloat(ind.Indice_Posicional).toFixed(4)}
                            </span>
                        </div>
                    </div>
                ))}
                {filteredIndicators.length === 0 && (
                    <div className="no-results">Nenhum indicador encontrado.</div>
                )}
            </div>
        </div>
    );
};

export default IndicatorsTab;
