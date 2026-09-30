import React, { useContext } from 'react';
import Header, { NAV_ITEMS } from './Header';
import Footer from './Footer';
import { UIContext } from '../contexts/UIContext';
import '../styles/MainLayout.css';

// Barra de abas do celular: a navegação principal desce para perto do polegar.
const MobileTabBar = ({ activeEnvironment, onNavigate }) => (
    <nav className="mobile-tabbar" aria-label="Principal">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeEnvironment === id;
            return (
                <button
                    key={id}
                    type="button"
                    className={`mobile-tab ${active ? 'active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onNavigate(id)}
                >
                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                    <span>{id === 'etl' ? 'Dados' : label}</span>
                </button>
            );
        })}
    </nav>
);

const MainLayout = ({ children, onSearchCity }) => {
    const { activeEnvironment, setActiveEnvironment } = useContext(UIContext);

    return (
        <div className={`main-layout env-${activeEnvironment}`}>
            <Header
                activeEnvironment={activeEnvironment}
                onNavigate={setActiveEnvironment}
                onSearchCity={onSearchCity}
            />
            <main className="main-content-wrapper">
                {children}
            </main>
            <Footer />
            <MobileTabBar activeEnvironment={activeEnvironment} onNavigate={setActiveEnvironment} />
        </div>
    );
};

export default MainLayout;
