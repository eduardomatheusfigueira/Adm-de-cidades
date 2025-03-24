import React from 'react';
import '../styles/CityProfileSummary.css';

const CityProfileSummary = ({ cityData }) => {
  console.log("CityProfileSummary: cityData received:", cityData); // Log the entire object

  if (!cityData) {
    console.log("CityProfileSummary: cityData is null or undefined");
    return <div className="city-profile-summary">No city data available.</div>;
  }

  let cityName = null;

  if (cityData.Nome_Municipio) { // Check for Nome_Municipio first
    cityName = cityData.Nome_Municipio;
  } else if (cityData.NM_MUN) {
    cityName = cityData.NM_MUN;
  } else if (cityData.properties && cityData.properties.NM_MUN) {
    cityName = cityData.properties.NM_MUN;
  } else {
    console.log("CityProfileSummary: NM_MUN and Nome_Municipio not found directly or in properties. Checking other keys...");
    // Iterate through keys and log them
    for (const key in cityData) {
      if (typeof cityData[key] !== 'object') { // Avoid logging nested objects for now
        console.log(`CityProfileSummary: cityData[${key}] = ${cityData[key]}`);
      }
    }
     if (cityData.properties) {
        for (const key in cityData.properties) {
            if (typeof cityData.properties[key] !== 'object') {
                console.log(`CityProfileSummary: cityData.properties[${key}] = ${cityData.properties[key]}`);
            }
        }
     }
  }


  return (
    <div className="city-profile-summary">
      <div className="info-line">
        <b>Nome:</b> {cityName || 'City Name Not Found'}
      </div>
      <div className="info-line">
        <b>Código:</b> {cityData.CD_MUN}
      </div>
      <div className="info-line">
        <b>Estado:</b> {cityData.Sigla_Estado}
      </div>
      <div className="info-line">
        <b>Região:</b> {cityData.Sigla_Regiao}
      </div>
      <div className="info-line">
        <b>Área:</b> {cityData.Area_Municipio}
      </div>
    </div>
  );
};

export default CityProfileSummary;
