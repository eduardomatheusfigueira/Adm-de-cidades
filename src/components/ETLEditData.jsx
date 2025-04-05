import React, { useState, useEffect } from 'react';
import '../styles/ETLEditData.css'; // We'll create this CSS file later

const ETLEditData = ({
  initialMunicipalitiesData,
  initialIndicatorsData,
  municipalitiesHeaders: initialMunicipalitiesHeaders, // Rename props for clarity
  indicatorsHeaders: initialIndicatorsHeaders
}) => {
  // State to hold the editable data, initialized from props
  const [municipalitiesData, setMunicipalitiesData] = useState([]);
  const [indicatorsData, setIndicatorsData] = useState([]);
  const [municipalitiesHeaders, setMunicipalitiesHeaders] = useState([]);
  const [indicatorsHeaders, setIndicatorsHeaders] = useState([]);
  // No need for isLoading or error state here, as data comes from props

  // Effect to update internal state when props change
  useEffect(() => {
    console.log("ETLEditData: Props received/updated.");
    // Deep copy the arrays to prevent modifying the original state in App.jsx directly
    setMunicipalitiesData(initialMunicipalitiesData ? JSON.parse(JSON.stringify(initialMunicipalitiesData)) : []);
    setIndicatorsData(initialIndicatorsData ? JSON.parse(JSON.stringify(initialIndicatorsData)) : []);
    setMunicipalitiesHeaders(initialMunicipalitiesHeaders || []);
    setIndicatorsHeaders(initialIndicatorsHeaders || []);
  }, [initialMunicipalitiesData, initialIndicatorsData, initialMunicipalitiesHeaders, initialIndicatorsHeaders]);

  const handleEditMunicipality = (rowIndex, field, value) => {
    const updatedData = [...municipalitiesData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };
    setMunicipalitiesData(updatedData);
  };

   const handleEditIndicator = (rowIndex, field, value) => {
    const updatedData = [...indicatorsData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };
    setIndicatorsData(updatedData);
  };

  const handleDeleteMunicipality = (rowIndex) => {
    if (window.confirm(`Tem certeza que deseja excluir a linha ${rowIndex + 1} dos municípios?`)) {
        setMunicipalitiesData(municipalitiesData.filter((_, index) => index !== rowIndex));
    }
  };

  const handleDeleteIndicator = (rowIndex) => {
     if (window.confirm(`Tem certeza que deseja excluir a linha ${rowIndex + 1} dos indicadores?`)) {
        setIndicatorsData(indicatorsData.filter((_, index) => index !== rowIndex));
     }
  };

  // Placeholder for saving - could generate CSV text
  const generateCSV = (headers, data) => {
      const headerRow = headers.join(',');
      const dataRows = data.map(row => headers.map(header => row[header] ?? '').join(','));
      return [headerRow, ...dataRows].join('\n');
  }

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { // Feature detection
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up
    } else {
        alert("Seu navegador não suporta o download automático. O conteúdo CSV foi logado no console.");
        console.log(`--- Conteúdo para ${filename} ---`);
        console.log(content);
    }
  };

  const handleSaveChanges = () => {
    console.log("Generating files for download...");
    try {
        if (municipalitiesData.length > 0 && municipalitiesHeaders.length > 0) {
            const munCSV = generateCSV(municipalitiesHeaders, municipalitiesData);
            downloadFile('municipios_editado.csv', munCSV);
        } else {
            console.log("Nenhum dado de município para salvar.");
        }

        if (indicatorsData.length > 0 && indicatorsHeaders.length > 0) {
            const indCSV = generateCSV(indicatorsHeaders, indicatorsData);
            downloadFile('indicadores_editado.csv', indCSV);
        } else {
             console.log("Nenhum dado de indicador para salvar.");
        }
        alert("Arquivos CSV editados estão sendo baixados (municipios_editado.csv e/ou indicadores_editado.csv).");

    } catch (error) {
        console.error("Erro ao gerar arquivos para download:", error);
        alert("Ocorreu um erro ao tentar gerar os arquivos para download. Verifique o console.");
    }
  };

  // isLoading and error checks removed as data now comes from props.

  // Determine which columns are numeric for input type='number'
  // This is a basic heuristic, might need refinement
  const numericColumns = new Set(['populacao', 'latitude', 'longitude', 'altitude', 'pib', 'area']); // Add known numeric cols
  if (municipalitiesData.length > 0) {
      municipalitiesHeaders.forEach(h => {
          if (!isNaN(parseFloat(municipalitiesData[0][h]))) {
              numericColumns.add(h);
          }
      });
  }
   if (indicatorsData.length > 0) {
      indicatorsHeaders.forEach(h => {
          if (!isNaN(parseFloat(indicatorsData[0][h]))) {
              numericColumns.add(h);
          }
      });
  }


  return (
    <div className="etl-edit-data-container">
      <h2>Editar Dados de Municípios e Indicadores</h2>
      <p>Selecione, edite ou exclua municípios e indicadores para criar um perfil personalizado.</p>

      {/* Municipalities Table */}
      <h3>Municípios ({municipalitiesData.length})</h3>
      {municipalitiesData.length > 0 ? (
        <div className="editable-table-placeholder">
          <table>
            <thead>
              <tr>
                {municipalitiesHeaders.map(header => <th key={header}>{header}</th>)}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {municipalitiesData.map((mun, index) => (
                <tr key={`mun-${index}`}>
                  {municipalitiesHeaders.map(header => (
                    <td key={header}>
                      <input
                        type={numericColumns.has(header) ? 'number' : 'text'}
                        value={mun[header] ?? ''} // Use value for controlled component
                        onChange={(e) => handleEditMunicipality(index, header, e.target.value)}
                      />
                    </td>
                  ))}
                  <td>
                    <button onClick={() => handleDeleteMunicipality(index)} className="delete-button">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !isLoading && <p>Nenhum dado de município carregado ou encontrado.</p>}


      {/* Indicators Table */}
      <h3>Indicadores ({indicatorsData.length})</h3>
       {indicatorsData.length > 0 ? (
        <div className="editable-table-placeholder">
          <table>
            <thead>
              <tr>
                {indicatorsHeaders.map(header => <th key={header}>{header}</th>)}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {indicatorsData.map((ind, index) => (
                <tr key={`ind-${index}`}>
                   {indicatorsHeaders.map(header => (
                    <td key={header}>
                      <input
                        type={numericColumns.has(header) ? 'number' : 'text'}
                        value={ind[header] ?? ''} // Use value for controlled component
                        onChange={(e) => handleEditIndicator(index, header, e.target.value)}
                      />
                    </td>
                  ))}
                  <td>
                    <button onClick={() => handleDeleteIndicator(index)} className="delete-button">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       ) : !isLoading && <p>Nenhum dado de indicador carregado ou encontrado.</p>}


      <div className="edit-actions">
        <button onClick={handleSaveChanges} className="save-button">Salvar Perfil Editado</button>
      </div>
    </div>
  );
};

export default ETLEditData;
