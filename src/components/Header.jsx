import React from 'react';
import { House, Map, ChartColumn, Database } from 'lucide-react';
import Logo, { Simbolo } from './brand/Logo';
import CitySearch from './CitySearch';
import '../styles/Header.css';

export const NAV_ITEMS = [
    { id: 'dataSourceInfo', label: 'Início', Icon: House },
    { id: 'map', label: 'Mapa', Icon: Map },
    { id: 'data', label: 'Indicadores', Icon: ChartColumn },
    { id: 'etl', label: 'ETL e dados', Icon: Database },
];

const Header = ({ activeEnvironment, onNavigate, onSearchCity }) => (
    <header className="app-header">
        <button
            type="button"
            className="header-logo"
            onClick={() => onNavigate('dataSourceInfo')}
            aria-label="SisInfo — ir para o início"
        >
            <span className="header-logo-full"><Logo tamanho={30} variante="negativa" /></span>
            <span className="header-logo-compact"><Simbolo tamanho={28} variante="negativa" /></span>
        </button>

        <nav className="header-nav" aria-label="Principal">
            {NAV_ITEMS.map(({ id, label, Icon }) => {
                const active = activeEnvironment === id;
                return (
                    <button
                        key={id}
                        type="button"
                        className={`nav-item ${active ? 'active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => onNavigate(id)}
                    >
                        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                        <span>{label}</span>
                    </button>
                );
            })}
        </nav>

        <div className="header-actions">
            <CitySearch variant="header" onCitySelect={onSearchCity} />
        </div>
    </header>
);

export default Header;
