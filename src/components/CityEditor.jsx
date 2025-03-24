import React, { useState, useEffect, useRef } from 'react';
import '../styles/CityEditor.css';
import CityProfileSummary from './CityProfileSummary'; // Import CityProfileSummary

const CityEditor = ({ city, geoCities, csvCities, indicadoresData: propIndicadoresData, onClose, onSave, onDelete }) => {
  const [selectedCity, setSelectedCity] = useState(city || (geoCities.length > 0 ? geoCities[0] : null));
  const [cityData, setCityData] = useState({
    name: '',
    description: '',
    geometry: '',
    codigo_municipio: '',
    nome_municipio: '',
    sigla_estado: '',
    sigla_regiao: '',
    area_municipio: '',
    capital: '',
    altitude_municipio: '',
    longitude_municipio: '',
    latitude_municipio: ''
  });
  const [fullCsvData, setFullCsvData] = useState(csvCities);
  const [csvData, setCsvData] = useState([]);
  const [indicadoresData, setIndicadoresData] = useState(propIndicadoresData);
  const [cityIndicators, setCityIndicators] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [indicatorFilter, setIndicatorFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [appliedIndicatorFilter, setAppliedIndicatorFilter] = useState('');
  const [appliedYearFilter, setAppliedYearFilter] = useState('');
  const [appliedSearchFilter, setAppliedSearchFilter] = useState('');
  const [uniqueIndicatorNames, setUniqueIndicatorNames] = useState([]);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [newIndicator, setNewIndicator] = useState({
    Nome_Indicador: '',
    Ano_Observacao: '',
    Valor: '',
    Indice_Posicional: '',
    Posicao: ''
  });
  const [editingIndicator, setEditingIndicator] = useState(null); // State for editing indicator
  const [editedIndicatorData, setEditedIndicatorData] = useState({ // State for edited indicator data
    Nome_Indicador: '',
    Ano_Observacao: '',
    Valor: '',
    Indice_Posicional: '',
    Posicao: ''
  });

  const editorRef = useRef(null);

  useEffect(() => {
    setIndicadoresData(propIndicadoresData);
  }, [propIndicadoresData]);

  useEffect(() => {
    if (indicadoresData && indicadoresData.length > 0) {
      const indicatorNames = [...new Set(indicadoresData.map(item => item.Nome_Indicador))];
      setUniqueIndicatorNames(indicatorNames);
      const years = [...new Set(indicadoresData.map(item => item.Ano_Observacao))].sort();
      setUniqueYears(years);
    }
  }, [indicadoresData]);


  useEffect(() => {
    if (selectedCity) {
      setCityData({
        name: selectedCity.properties.name || selectedCity.properties.Nome_Municipio || '',
        description: selectedCity.properties.custom_description || selectedCity.properties.description || '',
        geometry: JSON.stringify(selectedCity.geometry.coordinates),
        codigo_municipio: selectedCity.properties.CD_MUN || selectedCity.properties.Codigo_Municipio || selectedCity.properties.SETOR || '',
        nome_municipio: selectedCity.properties.NAME || selectedCity.properties.Nome_Municipio || '',
        sigla_estado: selectedCity.properties.ESTADO || selectedCity.properties.Sigla_Estado || '',
        sigla_regiao: selectedCity.properties.REGIAO || selectedCity.properties.Sigla_Regiao || '',
        area_municipio: selectedCity.properties.AREA || selectedCity.properties.Area_Municipio || '',
        capital: selectedCity.properties.CAPITAL !== undefined ? String(selectedCity.properties.CAPITAL) : String(selectedCity.properties.Capital) !== undefined ? String(selectedCity.properties.Capital) : '',
        altitude_municipio: selectedCity.properties.ALTITUDE || selectedCity.properties.Altitude_Municipio || '',
        longitude_municipio: selectedCity.properties.LONGITUDE || selectedCity.properties.Longitude_Municipio || '',
        latitude_municipio: selectedCity.properties.LATITUDE || selectedCity.properties.Latitude_Municipio || ''
      });

      if (fullCsvData.length > 0) {
        const codigoMunicipio = selectedCity.properties.CD_MUN || selectedCity.properties.Codigo_Municipio || selectedCity.properties.SETOR || '';
        const filteredCsvData = fullCsvData.filter(row =>
          row.Codigo_Municipio === codigoMunicipio ||
          row.Nome_Municipio === selectedCity.properties.Nome_Municipio
        );
        setCsvData(filteredCsvData);
      }
    }
  }, [selectedCity, fullCsvData]);

  useEffect(() => {
    if (indicadoresData && selectedCity) {
      const codigoMunicipio = selectedCity.properties.CD_MUN || selectedCity.properties.Codigo_Municipio || selectedCity.properties.SETOR || '';
      let filteredIndicadores = indicadoresData.filter(row =>
        row.Codigo_Municipio === codigoMunicipio
      );

      if (appliedIndicatorFilter) {
        filteredIndicadores = filteredIndicadores.filter(indicator => indicator.Nome_Indicador === appliedIndicatorFilter);
      }
      if (appliedYearFilter) {
        filteredIndicadores = filteredIndicadores.filter(indicator => indicator.Ano_Observacao === appliedYearFilter);
      }
      if (appliedSearchFilter) {
        const normalizedSearch = appliedSearchFilter.toLowerCase();
        filteredIndicadores = filteredIndicadores.filter(indicator =>
          indicator.Nome_Indicador.toLowerCase().includes(normalizedSearch)
        );
      }
      setCityIndicators(filteredIndicadores);
    }
  }, [indicadoresData, selectedCity, appliedIndicatorFilter, appliedYearFilter, appliedSearchFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);


  const handleCitySelect = (e) => {
    const cityId = e.target.value;
    const newSelectedCity = geoCities.find(c => c.properties.CD_MUN === cityId || c.properties.Codigo_Municipio === cityId || c.properties.SETOR === cityId);
    setSelectedCity(newSelectedCity);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCityData({
      ...cityData,
      [name]: value
    });
  };

  const handleGeometryChange = (e) => {
    setCityData({
      ...cityData,
      geometry: e.target.value
    });
  };

  const handleSave = () => {
    if (!selectedCity) return;

    let parsedGeometry;
    try {
      parsedGeometry = JSON.parse(cityData.geometry);
    } catch (e) {
      alert("Geometria inválida. Por favor, insira um JSON de coordenadas válido.");
      return;
    }

    const updatedCity = {
      ...selectedCity,
      properties: {
        ...selectedCity.properties,
        NAME: cityData.name,
        description: cityData.description,
        CD_MUN: cityData.codigo_municipio,
        Nome_Municipio: cityData.nome_municipio,
        Sigla_Estado: cityData.sigla_estado,
        Sigla_Regiao: cityData.sigla_regiao,
        Area_Municipio: cityData.area_municipio,
        Capital: cityData.capital === 'true',
        Altitude_Municipio: cityData.altitude_municipio,
        Longitude_Municipio: cityData.longitude_municipio,
        Latitude_Municipio: cityData.latitude_municipio,
        custom_description: cityData.description
      },
      geometry: {
        type: "Polygon",
        coordinates: parsedGeometry
      }
    };

    console.log("Salvando cidade:", updatedCity);
    onSave(updatedCity);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleIndicatorFilterChange = (e) => {
    setIndicatorFilter(e.target.value);
  };

  const handleYearFilterChange = (e) => {
    setYearFilter(e.target.value);
  };

  const handleSearchFilterChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const handleApplyFilters = () => {
    setAppliedIndicatorFilter(indicatorFilter);
    setAppliedYearFilter(yearFilter);
    setAppliedSearchFilter(searchFilter);
  };

  const handleNewIndicatorChange = (e) => {
    const { name, value } = e.target;
    setNewIndicator({
      ...newIndicator,
      [name]: value
    });
  };

  const handleAddIndicator = () => {
    if (selectedCity) {
      const codigoMunicipio = selectedCity.properties.CD_MUN || selectedCity.properties.Codigo_Municipio || selectedCity.properties.SETOR || '';
      const indicatorToAdd = {
        ...newIndicator,
        Codigo_Municipio: codigoMunicipio
      };
      onSave({ ...selectedCity, newIndicator: indicatorToAdd }); // Send newIndicator to parent
      setNewIndicator({ // Reset new indicator form
        Nome_Indicador: '',
        Ano_Observacao: '',
        Valor: '',
        Indice_Posicional: '',
        Posicao: ''
      });
      alert('Indicador adicionado com sucesso!');
    } else {
      alert('Por favor, selecione uma cidade para adicionar o indicador.');
    }
  };

  const handleEditIndicator = (indicator) => {
    setEditingIndicator(indicator);
    setEditedIndicatorData({ ...indicator });
  };

  const handleCancelEditIndicator = () => {
    setEditingIndicator(null);
    setEditedIndicatorData({ // Reset edited indicator form
      Nome_Indicador: '',
      Ano_Observacao: '',
      Valor: '',
      Indice_Posicional: '',
      Posicao: ''
    });
  };

  const handleEditedIndicatorChange = (e) => {
    const { name, value } = e.target;
    setEditedIndicatorData({
      ...editedIndicatorData,
      [name]: value
    });
  };

  const handleSaveEditedIndicator = () => {
    if (selectedCity && editingIndicator) {
      const updatedIndicator = { ...editedIndicatorData, Codigo_Municipio: editingIndicator.Codigo_Municipio };
      onSave({ ...selectedCity, updatedIndicator: updatedIndicator });
      setEditingIndicator(null);
      setEditedIndicatorData({ // Reset edited indicator form
        Nome_Indicador: '',
        Ano_Observacao: '',
        Valor: '',
        Indice_Posicional: '',
        Posicao: ''
      });
      alert('Indicador atualizado com sucesso!');
    } else {
      alert('Erro ao atualizar indicador.');
    }
  };


  const handleDeleteIndicator = (indicatorToDelete) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o indicador "${indicatorToDelete.Nome_Indicador}" de ${selectedCity.properties.NAME || selectedCity.properties.Nome_Municipio}?`);
    if (confirmDelete) {
      onSave({ ...selectedCity, deletedIndicator: indicatorToDelete });
      alert('Indicador excluído com sucesso!');
    }
  };

  const handleDeleteCity = () => {
    if (selectedCity) {
      const confirmDelete = window.confirm(`Tem certeza que deseja excluir a cidade ${selectedCity.properties.NAME || selectedCity.properties.Nome_Municipio}? Esta ação é irreversível.`);
      if (confirmDelete) {
        onDelete(selectedCity);
      }
    } else {
      alert('Por favor, selecione uma cidade para excluir.');
    }
  };


  if (!geoCities.length) {
    return (
      <div className="city-editor-overlay">
        <div className="city-editor sidebar-editor">
          <h2>Editor de Cidades</h2>
          <p>Nenhuma cidade disponível para edição.</p>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="city-editor-overlay">
      <div className="city-editor sidebar-editor" ref={editorRef}>
        <h2>Editor de Cidades</h2>

        <div className="city-selector">
          <label htmlFor="city-select">Selecione a cidade:</label>
          <select
            id="city-select"
            value={selectedCity ? (selectedCity.properties.SETOR || selectedCity.properties.Codigo_Municipio || selectedCity.properties.CD_MUN) : ''}
            onChange={handleCitySelect}
          >
            {geoCities.map(city => (
              <option key={city.properties.SETOR || city.properties.Codigo_Municipio || city.properties.CD_MUN} value={city.properties.SETOR || city.properties.Codigo_Municipio || city.properties.CD_MUN}>
                {city.properties.name || city.properties.Nome_Municipio || city.properties.NAME || city.properties.SETOR || city.properties.Codigo_Municipio || city.properties.CD_MUN}
              </option>
            ))}
          </select>
        </div>

        <CityProfileSummary cityData={cityData} /> {/* City Profile Summary here */}

        <div className="tab-headers">
          <button
            className={`tab-header-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => handleTabChange('info')}
          >
            Dados Gerais
          </button>
          <button
            className={`tab-header-button ${activeTab === 'indicators' ? 'active' : ''}`}
            onClick={() => handleTabChange('indicators')}
          >
            Indicadores
          </button>
          <button
            className={`tab-header-button ${activeTab === 'manage-indicators' ? 'active' : ''}`}
            onClick={() => handleTabChange('manage-indicators')}
          >
            Gerenciar Indicadores
          </button>
        </div>

        {activeTab === 'info' && (
          <div className="city-info">
            <section>
              <h3>Informações Básicas</h3>
              <div className="form-group">
                <label htmlFor="description">Descrição:</label>
                <textarea id="description" name="description" value={cityData.description} onChange={handleInputChange} />
              </div>
            </section>

            <section>
              <h3>Informações Geográficas</h3>
              <div className="form-group">
                <label htmlFor="geometry">Geometria (JSON):</label>
                <textarea id="geometry" name="geometry" value={cityData.geometry} placeholder='Formato JSON esperado: [[longitude, latitude], ...]' onChange={handleGeometryChange} />
              </div>
              <div className="form-group">
                <label htmlFor="latitude_municipio">Latitude:</label>
                <input type="text" id="latitude_municipio" name="latitude_municipio" value={cityData.latitude_municipio} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="longitude_municipio">Longitude:</label>
                <input type="text" id="longitude_municipio" name="longitude_municipio" value={cityData.longitude_municipio} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="altitude_municipio">Altitude:</label>
                <input type="text" id="altitude_municipio" name="altitude_municipio" value={cityData.altitude_municipio} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="area_municipio">Área do Município:</label>
                <input type="text" id="area_municipio" name="area_municipio" value={cityData.area_municipio} onChange={handleInputChange} />
              </div>
            </section>

            <section>
              <h3>Informações Administrativas</h3>
              <div className="form-group">
                <label htmlFor="codigo_municipio">Código Município:</label>
                <input type="text" id="codigo_municipio" name="codigo_municipio" value={cityData.codigo_municipio} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="nome_municipio">Nome Município:</label>
                <input type="text" id="nome_municipio" name="nome_municipio" value={cityData.nome_municipio} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="sigla_estado">Sigla Estado:</label>
                <input type="text" id="sigla_estado" name="sigla_estado" value={cityData.sigla_estado} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="sigla_regiao">Sigla Região:</label>
                <input type="text" id="sigla_regiao" name="sigla_regiao" value={cityData.sigla_regiao} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="capital">Capital:</label>
                <select id="capital" name="capital" value={cityData.capital} onChange={handleInputChange}>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'indicators' && (
          <div className="city-indicators">
            <div className="filters">
              <div className="filter-group">
                <label htmlFor="indicator-filter">Indicador:</label>
                <select
                  id="indicator-filter"
                  value={indicatorFilter}
                  onChange={handleIndicatorFilterChange}
                >
                  <option value="">Todos</option>
                  {uniqueIndicatorNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="year-filter">Ano:</label>
                <select
                  id="year-filter"
                  value={yearFilter}
                  onChange={handleYearFilterChange}
                >
                  <option value="">Todos</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="search-filter">Pesquisar Indicador:</label>
                <input
                  type="text"
                  id="search-filter"
                  placeholder="Pesquisar por nome"
                  value={searchFilter}
                  onChange={handleSearchFilterChange}
                />
              </div>
              <button className="apply-filters-button" onClick={handleApplyFilters}>
                Aplicar
              </button>
            </div>


            {isLoading ? (
              <p>Carregando indicadores...</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Nome do Indicador</th>
                      <th>Ano</th>
                      <th>Valor</th>
                      <th>Índice Posicional</th>
                      <th>Posição</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cityIndicators.map((indicator, index) => (
                      <tr key={index}>
                        <td>{indicator.Nome_Indicador}</td>
                        <td>{indicator.Ano_Observacao}</td>
                        <td>{indicator.Valor}</td>
                        <td>{indicator.Indice_Posicional}</td>
                        <td>{indicator.Posicao}</td>
                        <td>
                          <button
                            className="edit-indicator-button"
                            onClick={() => handleEditIndicator(indicator)}
                            title="Editar Indicador"
                          >
                            Editar
                          </button>
                          <button
                            className="delete-indicator-button"
                            onClick={() => handleDeleteIndicator(indicator)}
                            title="Excluir Indicador"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                    {editingIndicator && (
                      <tr>
                        <td>
                          <input type="text" name="Nome_Indicador" value={editedIndicatorData.Nome_Indicador} onChange={handleEditedIndicatorChange} />
                        </td>
                        <td>
                          <input type="text" name="Ano_Observacao" value={editedIndicatorData.Ano_Observacao} onChange={handleEditedIndicatorChange} />
                        </td>
                        <td>
                          <input type="text" name="Valor" value={editedIndicatorData.Valor} onChange={handleEditedIndicatorChange} />
                        </td>
                        <td>
                          <input type="text" name="Indice_Posicional" value={editedIndicatorData.Indice_Posicional} onChange={handleEditedIndicatorChange} />
                        </td>
                        <td>
                          <input type="text" name="Posicao" value={editedIndicatorData.Posicao} onChange={handleEditedIndicatorChange} />
                        </td>
                        <td>
                          <button className="save-indicator-button" onClick={handleSaveEditedIndicator}>Salvar</button>
                          <button className="cancel-indicator-button" onClick={handleCancelEditIndicator}>Cancelar</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'manage-indicators' && (
          <div className="manage-indicators">
            <h3>Adicionar Novo Indicador</h3>
            <div className="form-group">
              <label htmlFor="Nome_Indicador">Nome do Indicador:</label>
              <input type="text" id="Nome_Indicador" name="Nome_Indicador" value={newIndicator.Nome_Indicador} onChange={handleNewIndicatorChange} />
            </div>
            <div className="form-group">
              <label htmlFor="Ano_Observacao">Ano de Observação:</label>
              <input type="text" id="Ano_Observacao" name="Ano_Observacao" value={newIndicator.Ano_Observacao} onChange={handleNewIndicatorChange} />
            </div>
            <div className="form-group">
              <label htmlFor="Valor">Valor:</label>
              <input type="text" id="Valor" name="Valor" value={newIndicator.Valor} onChange={handleNewIndicatorChange} />
            </div>
            <div className="form-group">
              <label htmlFor="Indice_Posicional">Índice Posicional:</label>
              <input type="text" id="Indice_Posicional" name="Indice_Posicional" value={newIndicator.Indice_Posicional} onChange={handleNewIndicatorChange} />
            </div>
            <div className="form-group">
              <label htmlFor="Posicao">Posição:</label>
              <input type="text" id="Posicao" name="Posicao" value={newIndicator.Posicao} onChange={handleNewIndicatorChange} />
            </div>
            <button className="add-indicator-button" onClick={handleAddIndicator}>Adicionar Indicador</button>
          </div>
        )}

        <div className="button-group">
          <button className="save-button" onClick={handleSave}>Salvar</button>
          <button className="cancel-button" onClick={onClose}>Cancelar</button>
          <button className="delete-city-button" onClick={handleDeleteCity}>Excluir Cidade</button>
        </div>
      </div>
    </div>
  );
};

export default CityEditor;
