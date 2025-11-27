import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="footer-content-simple">
                <span>SisInfo &copy; {currentYear} Todos os direitos reservados</span>
                <span className="separator">|</span>
                <span>Eduardo Matheus Figueira</span>
                <span className="separator">|</span>
                <span>eduardomatheusfigueira@gmail.com</span>
            </div>
        </footer>
    );
};

export default Footer;
