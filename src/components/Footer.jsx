import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <span>
                Malha municipal: IBGE, via geodata-br (CC0) · Lista de municípios: municipios-brasileiros (MIT) · Mapas base: OpenFreeMap
            </span>
            <span className="app-footer-autoria">
                SisInfo © {currentYear} · Eduardo Matheus Figueira · eduardomatheusfigueira@gmail.com
            </span>
        </footer>
    );
};

export default Footer;
