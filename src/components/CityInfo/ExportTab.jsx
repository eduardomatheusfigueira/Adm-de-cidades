import React from 'react';
import Papa from 'papaparse';

const ExportTab = ({ cityData, indicators }) => {
    const handleDownload = () => {
        if (!indicators || indicators.length === 0) {
            alert('Sem dados para exportar.');
            return;
        }

        // Prepare data for CSV
        const csvData = indicators.map(ind => ({
            Municipio: cityData.Nome_Municipio,
            Estado: cityData.Sigla_Estado,
            Indicador: ind.Nome_Indicador,
            Ano: ind.Ano_Observacao,
            Valor: ind.Valor,
            Unidade: ind.Unidade_Medida,
            Indice_Posicional: ind.Indice_Posicional
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `dados_${cityData.Nome_Municipio}_${new Date().getFullYear()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="export-tab">
            <div className="export-content">
                <h3>Exportar Dados</h3>
                <p>
                    Baixe todos os indicadores disponíveis para <strong>{cityData?.Nome_Municipio}</strong> em formato CSV.
                    O arquivo incluirá dados históricos e atuais.
                </p>
                <div className="export-stats">
                    <span>Total de Registros: <strong>{indicators?.length || 0}</strong></span>
                </div>
                <button className="download-button" onClick={handleDownload}>
                    <span className="icon">⬇️</span> Download CSV
                </button>
            </div>
        </div>
    );
};

export default ExportTab;
