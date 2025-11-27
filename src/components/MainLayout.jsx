import React, { useContext } from 'react';
import Header from './Header';
import Footer from './Footer';
import { UIContext } from '../contexts/UIContext';
import '../styles/MainLayout.css';

const MainLayout = ({ children }) => {
    const { activeEnvironment, setActiveEnvironment } = useContext(UIContext);

    return (
        <div className="main-layout">
            <Header
                activeEnvironment={activeEnvironment}
                onNavigate={setActiveEnvironment}
            />
            <main className="main-content-wrapper">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
