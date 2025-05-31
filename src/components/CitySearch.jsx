import React, { useState, useMemo, useContext } from 'react'; // Adicionado useContext
import { DataContext } from '../contexts/DataContext'; // Importado DataContext

function CitySearch({
  // cities = [], // Removido - virá do context
  onCitySelect
}) {
  const { csvData: cities } = useContext(DataContext); // Obtendo cities (csvData) do DataContext

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const cityNames = useMemo(() =>
    (cities || []).map(city => ({ // Adicionado fallback para cities ser undefined/null inicialmente
    name: city.Nome_Municipio || 'Nome Indisponível',
    code: city.Codigo_Municipio,
    lat: parseFloat(city.Latitude_Municipio),
    lng: parseFloat(city.Longitude_Municipio)
  })).filter(city => city.name && city.code && !isNaN(city.lat) && !isNaN(city.lng)), [cities]); // Adicionado city.code no filter

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 1) {
      const filteredSuggestions = cityNames
        .filter(city =>
          city.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (city) => {
    setSearchTerm(city.name);
    setSuggestions([]);
    if (onCitySelect) {
      onCitySelect(city);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <div className="city-search-container">
      <input
        type="text"
        placeholder="Pesquisar cidade..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="city-search-input"
      />
      {suggestions.length > 0 && (
        <ul className="city-search-suggestions">
          {suggestions.map((city) => (
            <li
              key={city.code}
              onClick={() => handleSuggestionClick(city)}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitySearch;
