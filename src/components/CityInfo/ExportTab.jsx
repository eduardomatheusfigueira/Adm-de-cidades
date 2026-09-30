import React from 'react';
import Papa from 'papaparse';
import { Download } from 'lucide-react';

const ExportTab = ({ cityData, indicators }) => {
    const handleDownload = () => {
        if (!indicators || indicators.length === 0) {
            alert('Não há indicadores deste município para exportar.');
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
                <p>
                    Baixe os indicadores de <strong>{cityData?.Nome_Municipio}</strong> em CSV, com todos os anos disponíveis.
                </p>
                <p className="export-stats">{(indicators?.length || 0).toLocaleString('pt-BR')} registros</p>
                <button type="button" className="btn btn-primary" onClick={handleDownload} disabled={!indicators || indicators.length === 0}>
                    <Download size={17} strokeWidth={1.75} aria-hidden="true" /> Baixar CSV
                </button>
            </div>
        </div>
    );
};

export default ExportTab;
