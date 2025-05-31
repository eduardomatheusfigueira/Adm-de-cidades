import React, { useState, useEffect, useRef, useContext } from 'react'; // Adicionado useContext
import '../styles/FilterMenu.css';
import { DataContext } from '../contexts/DataContext'; // Importado DataContext

const FilterMenu = ({
  // onImportIndicators, // Removido - virá do context
  // onImportMunicipios, // Removido - virá do context
  onImportGeometry, // Mantido, pois App.jsx ainda controla o modal
  // onSaveProfile, // Removido - virá do context
  // onLoadProfile // Removido - virá do context
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Obtendo funções do DataContext
  const {
    handleImportIndicators,
    handleImportMunicipios,
    // processGeometryImportInternal, // Não usado diretamente aqui, App.jsx/UIContext chamará
    handleSaveProfile,
    handleLoadProfile
  } = useContext(DataContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]); // Removido isOpen e setIsOpen das dependências, não são necessárias aqui

  return (
    <div className="filter-menu top-right" ref={menuRef}>
      <button className="filter-menu-toggle-icon" onClick={toggleMenu} aria-label={isOpen ? 'Ocultar Menu' : 'Mostrar Menu'}>
        <i className="menu-icon"></i>
      </button>

      <div className={`filter-menu-content ${isOpen ? 'open' : ''}`}>
        <div className="filter-section">
          <h3>Menu</h3>

          <div className="filter-actions import-export-buttons">
            <button
              className="control-button import-button"
              onClick={handleImportIndicators} // Usando função do context
              title="Importar Indicadores"
            >
              Importar Indicadores
            </button>

            <button
              className="control-button import-button"
              onClick={handleImportMunicipios} // Usando função do context
              title="Importar Municípios"
            >
              Importar Municípios
            </button>

            <button
              className="control-button import-geometry-button"
              onClick={onImportGeometry} // Ainda usa prop de App.jsx para o modal
              title="Importar Geometria dos Municípios"
            >
              Importar Geometria
            </button>

            <button
              className="control-button save-profile-button"
              onClick={handleSaveProfile} // Usando função do context
              title="Salvar Perfil"
            >
              Salvar Perfil
            </button>

            <button
              className="control-button load-profile-button"
              onClick={handleLoadProfile} // Usando função do context
              title="Carregar Perfil"
            >
              Carregar Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;
