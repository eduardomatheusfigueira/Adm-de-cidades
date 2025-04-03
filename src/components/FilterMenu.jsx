import React, { useState, useEffect, useRef } from 'react';
import '../styles/FilterMenu.css';

const FilterMenu = ({
  onImportIndicators,
  onImportMunicipios,
  onImportGeometry,
  onSaveProfile,
  onLoadProfile
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    console.log("toggleMenu chamado - antes do set", isOpen);
    setIsOpen(!isOpen);
    console.log("toggleMenu chamado - depois do set", !isOpen);
  };

  // Effect to handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, isOpen, setIsOpen]); // Depend on menuRef and isOpen

  console.log("FilterMenu renderizando com isOpen:", isOpen);

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
              onClick={onImportIndicators}
              title="Importar Indicadores"
            >
              Importar Indicadores
            </button>

            <button
              className="control-button import-button"
              onClick={onImportMunicipios}
              title="Importar Municípios"
            >
              Importar Municípios
            </button>

            <button
              className="control-button import-geometry-button"
              onClick={onImportGeometry}
              title="Importar Geometria dos Municípios"
            >
              Importar Geometria
            </button>

            <button
              className="control-button save-profile-button"
              onClick={onSaveProfile}
              title="Salvar Perfil"
            >
              Salvar Perfil
            </button>

            <button
              className="control-button load-profile-button"
              onClick={onLoadProfile}
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
