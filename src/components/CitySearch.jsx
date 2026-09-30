import React, { useState, useMemo, useContext, useId, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { DataContext } from '../contexts/DataContext';
import '../styles/CitySearch.css';

const normalizar = (texto) => (texto || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Busca de município por nome (sem acento) ou código IBGE.
// variant: 'header' (fundo escuro, no cabeçalho) | 'floating' (sobre o mapa)
function CitySearch({ onCitySelect, variant = 'floating', placeholder = 'Buscar município ou código IBGE' }) {
  const { csvData: cities } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();
  const boxRef = useRef(null);

  const cityList = useMemo(() =>
    (cities || []).map(city => ({
      name: city.Nome_Municipio || 'Nome indisponível',
      uf: city.Sigla_Estado || '',
      code: city.Codigo_Municipio,
      lat: parseFloat(city.Latitude_Municipio),
      lng: parseFloat(city.Longitude_Municipio),
      key: normalizar(city.Nome_Municipio),
    })).filter(city => city.code && !isNaN(city.lat) && !isNaN(city.lng)), [cities]);

  const suggestions = useMemo(() => {
    const termo = normalizar(searchTerm.trim());
    if (termo.length < 2) return [];
    const porCodigo = /^\d+$/.test(termo);
    const encontrados = cityList.filter(city => porCodigo ? String(city.code).startsWith(termo) : city.key.includes(termo));
    // Quem começa com o termo vem primeiro
    encontrados.sort((a, b) => (b.key.startsWith(termo) - a.key.startsWith(termo)) || a.name.localeCompare(b.name, 'pt-BR'));
    return encontrados.slice(0, 7);
  }, [searchTerm, cityList]);

  useEffect(() => { setActiveIndex(0); }, [suggestions]);

  useEffect(() => {
    const fechar = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, []);

  const choose = (city) => {
    setSearchTerm(city.name);
    setOpen(false);
    if (onCitySelect) onCitySelect(city);
  };

  const handleKeyDown = (event) => {
    if (!suggestions.length) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); setActiveIndex(i => (i + 1) % suggestions.length); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex(i => (i - 1 + suggestions.length) % suggestions.length); }
    else if (event.key === 'Enter') { event.preventDefault(); choose(suggestions[activeIndex] || suggestions[0]); }
    else if (event.key === 'Escape') { setOpen(false); }
  };

  const showList = open && suggestions.length > 0;
  const semResultado = open && searchTerm.trim().length >= 2 && suggestions.length === 0;

  return (
    <div className={`city-search city-search--${variant}`} ref={boxRef}>
      <Search className="city-search-icon" size={18} strokeWidth={1.75} aria-hidden="true" />
      <input
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList ? `${listId}-${activeIndex}` : undefined}
        aria-label={placeholder}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => { setSearchTerm(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="city-search-input"
        autoComplete="off"
        spellCheck={false}
      />
      {searchTerm && (
        <button type="button" className="city-search-clear" aria-label="Limpar busca" onClick={() => { setSearchTerm(''); setOpen(false); }}>
          <X size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
      {showList && (
        <ul className="city-search-suggestions" id={listId} role="listbox">
          {suggestions.map((city, i) => (
            <li
              key={city.code}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={i === activeIndex ? 'active' : ''}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => choose(city)}
            >
              <span className="city-search-name">{city.name}{city.uf && <span className="city-search-uf"> · {city.uf}</span>}</span>
              <span className="city-search-code">{city.code}</span>
            </li>
          ))}
        </ul>
      )}
      {semResultado && (
        <div className="city-search-suggestions city-search-empty" role="status">
          Nenhum município encontrado. Confira a grafia ou busque pelo código IBGE.
        </div>
      )}
    </div>
  );
}

export default CitySearch;
