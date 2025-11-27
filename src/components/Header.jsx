import React from 'react';
import '../styles/Header.css';

const Header = ({ activeEnvironment, onNavigate }) => {
    const navItems = [
        { id: 'dataSourceInfo', label: 'Início', icon: 'fa-home' },
        { id: 'map', label: 'Mapa', icon: 'fa-map-marked-alt' },
        { id: 'data', label: 'Indicadores', icon: 'fa-chart-bar' },
        { id: 'etl', label: 'ETL & Transformação', icon: 'fa-database' },
    ];

    return (
        <header className="app-header">
            <div className="header-logo">
                <img src="/logo_white.png" alt="Logo SisInfo" className="logo-image" />
                <span className="logo-text">SisInfo</span>
            </div>

            <nav className="header-nav">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeEnvironment === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <i className={`fas ${item.icon}`}></i>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="header-actions">
                {/* Placeholder for user profile or settings */}
                <button className="icon-btn" aria-label="Configurações">
                    <i className="fas fa-cog"></i>
                </button>
            </div>
        </header>
    );
};

export default Header;
