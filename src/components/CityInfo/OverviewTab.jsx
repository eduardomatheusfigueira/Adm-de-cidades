import React from 'react';

const OverviewTab = ({ cityData }) => {
    if (!cityData) return null;

    const formatNumber = (val) => {
        if (val === undefined || val === null) return '-';
        return new Intl.NumberFormat('pt-BR').format(val);
    };

    const stats = [
        { label: 'População', value: cityData.Populacao_Estimada, unit: 'hab.' },
        { label: 'Área', value: cityData.Area_Municipio, unit: 'km²' },
        { label: 'Densidade', value: cityData.Densidade_Demografica, unit: 'hab/km²' },
        { label: 'PIB per Capita', value: cityData.PIB_per_Capita, unit: 'R$' },
        { label: 'IDHM', value: cityData.IDHM, unit: '' },
        { label: 'Escolarização', value: cityData.Escolarizacao, unit: '%' },
    ];

    return (
        <div className="overview-tab">
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <span className="stat-label">{stat.label}</span>
                        <span className="stat-value">
                            {formatNumber(stat.value)} <small>{stat.unit}</small>
                        </span>
                    </div>
                ))}
            </div>
            {/* Placeholder for a brief description if available in the future */}
            <div className="city-description">
                <p>
                    <strong>{cityData.Nome_Municipio} - {cityData.Sigla_Estado}</strong>.
                    Região {cityData.Sigla_Regiao}.
                </p>
            </div>
        </div>
    );
};

export default OverviewTab;
