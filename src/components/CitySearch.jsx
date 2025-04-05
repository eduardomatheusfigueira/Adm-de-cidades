import React, { useState, useMemo } from 'react';

function CitySearch({ cities = [], onCitySelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Memoize city names for efficient searching
  const cityNames = useMemo(() => cities.map(city => ({
    name: city.Nome_Municipio || 'Nome Indisponível', // Handle potential missing names
    code: city.Codigo_Municipio,
    lat: parseFloat(city.Latitude_Municipio),
    lng: parseFloat(city.Longitude_Municipio)
  })).filter(city => city.name && !isNaN(city.lat) && !isNaN(city.lng)), [cities]); // Filter out invalid entries

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 1) { // Start suggesting after 2 characters
      const filteredSuggestions = cityNames
        .filter(city =>
          city.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5); // Limit suggestions
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (city) => {
    setSearchTerm(city.name); // Set input field to selected city name
    setSuggestions([]); // Clear suggestions
    if (onCitySelect) {
      onCitySelect(city); // Trigger the callback with selected city data
    }
  };

  // Basic handling for Enter key (select first suggestion or trigger search if needed)
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
    // Add more sophisticated search trigger logic if needed (e.g., search button)
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
              key={city.code} // Use city code as key
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
