import React, { useState, useRef, useEffect } from 'react';
import { FileUp, Play, Download, CircleCheck, CircleX } from 'lucide-react';

const ETLProcessor = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sourceType, setSourceType] = useState('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const workerRef = useRef(null);

  // TODO: Define available source types based on plan/data
  const SOURCE_TYPES = [
    { value: '', label: 'Escolha a fonte dos dados…' },
    { value: 'snis_agua_esgoto', label: 'SNIS - Água e Esgoto (.csv)' },
    { value: 'finbra_receitas', label: 'FINBRA - Receitas Orçamentárias (.csv)' },
    { value: 'ibge_pib_2010_2021', label: 'IBGE - PIB (2010-2021) (.xlsx)' },
    { value: 'ibge_pib_2002_2009', label: 'IBGE - PIB (2002-2009) (.xlsx)' },
    { value: 'ipeadata', label: 'IPEADATA (.csv)' },
    // Add more types as implementation progresses
  ];

  useEffect(() => {
    // Initialize the Web Worker
    // Note: Worker script needs to be in the public folder or handled by the build process
    workerRef.current = new Worker('/etlWorker.js'); // Assuming etlWorker.js is in the public folder

    // Handle messages from the worker
    workerRef.current.onmessage = (event) => {
      const { type, payload, error: workerError } = event.data;
      setProcessing(false);

      if (type === 'success') {
        setResults(payload); // Payload should be the processed data array
        setError(null);
      } else if (type === 'error') {
        setError(workerError || 'Ocorreu um erro inesperado no processamento.');
        setResults(null);
      }
    };

    // Handle errors from the worker itself
    workerRef.current.onerror = (err) => {
      console.error("Worker Error:", err);
      setError(`Erro no processamento em segundo plano: ${err.message}`);
      setProcessing(false);
      setResults(null);
    };

    // Cleanup worker on component unmount
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
    setResults(null); // Clear previous results
    setError(null);
  };

  const handleSourceTypeChange = (event) => {
    setSourceType(event.target.value);
  };

  const handleProcessClick = () => {
    if (!selectedFiles.length || !sourceType || processing) {
      setError('Escolha pelo menos um arquivo e a fonte dos dados.');
      return;
    }
    setError(null);
    setResults(null);
    setProcessing(true);

    // Send file(s) and source type to the worker
    // We need to read the file content first
    const fileReadPromises = selectedFiles.map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({ name: file.name, content: e.target.result });
            reader.onerror = (e) => reject(`Não foi possível ler o arquivo ${file.name}: ${e.target.error}`);
            // Read as ArrayBuffer for SheetJS compatibility with Excel files
            reader.readAsArrayBuffer(file);
        });
    });

    Promise.all(fileReadPromises)
        .then(fileContents => {
            workerRef.current.postMessage({
                type: 'process',
                payload: {
                    files: fileContents,
                    sourceType: sourceType,
                },
            });
        })
        .catch(readError => {
            setError(readError);
            setProcessing(false);
        });
  };

  const handleDownloadClick = () => {
    if (!results || !results.length) return;

    const header = "Codigo_Municipio;Nome_Indicador;Ano_Observacao;Valor;Indice_Posicional;Posicao";
    // Ensure consistent order and handle potential null/undefined values
    const csvRows = results.map(row => {
        const codigo = row.Codigo_Municipio ?? '';
        const nome = row.Nome_Indicador ?? '';
        const ano = row.Ano_Observacao ?? '';
        // Format numbers consistently, potentially using locale-specific settings if needed
        const valor = row.Valor !== null && row.Valor !== undefined ? String(row.Valor).replace('.', ',') : ''; // Use comma for decimal
        const indice = row.Indice_Posicional !== null && row.Indice_Posicional !== undefined ? String(row.Indice_Posicional).replace('.', ',') : '';
        const posicao = row.Posicao ?? '';
        return `${codigo};${nome};${ano};${valor};${indice};${posicao}`;
    });

    const csvString = `${header}\n${csvRows.join('\n')}`;

    // Create a Blob and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'indicadores_processados.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the object URL
  };

  return (
    <div className="etl-view-container fade-in">
      <div className="etl-cabecalho">
        <p className="etl-trilha">ETL e dados › Indicadores</p>
        <h1>Processar arquivos brutos</h1>
        <p className="description-text">Envie os arquivos baixados da fonte oficial, escolha de onde eles vêm e baixe o resultado no formato de indicadores do SisInfo.</p>
      </div>

      <div className="etl-grid">
        <div className="etl-etapas">
          <section className="etl-etapa">
            <h2><span className="etl-num">1</span>Arquivos de entrada</h2>
            <label className="etl-soltar" htmlFor="file-upload">
              <FileUp size={26} strokeWidth={1.5} aria-hidden="true" />
              <span><strong>Escolha os arquivos</strong> (CSV ou planilha Excel)</span>
              <input id="file-upload" type="file" multiple onChange={handleFileChange} disabled={processing} className="sr-only" />
            </label>
            {selectedFiles.length > 0 && (
              <ul className="etl-arquivos">
                {selectedFiles.map(file => <li key={file.name}>{file.name}</li>)}
              </ul>
            )}
          </section>

          <section className="etl-etapa">
            <h2><span className="etl-num">2</span>Fonte dos dados</h2>
            <div className="campo">
              <label htmlFor="source-type">De onde vêm os arquivos</label>
              <select id="source-type" className="selecao" value={sourceType} onChange={handleSourceTypeChange} disabled={processing}>
                {SOURCE_TYPES.map(option => (
                  <option key={option.value} value={option.value} disabled={option.value === ''}>{option.label}</option>
                ))}
              </select>
            </div>
          </section>
        </div>

        <div className="etl-lateral">
          <button type="button" className="btn btn-primary btn-lg" onClick={handleProcessClick} disabled={processing || !selectedFiles.length || !sourceType}>
            <Play size={18} strokeWidth={1.75} aria-hidden="true" /> {processing ? 'Processando…' : 'Processar arquivos'}
          </button>
          {!selectedFiles.length && <p className="etl-dica">Escolha os arquivos na etapa 1 para começar.</p>}

          {error && (
            <div className="aviso aviso-erro" role="alert">
              <CircleX size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {results && (
            <div className="aviso aviso-sucesso" role="status">
              <CircleCheck size={18} strokeWidth={1.75} aria-hidden="true" />
              <div className="etl-resultado">
                <strong>Processamento concluído</strong>
                <span>{results.length.toLocaleString('pt-BR')} linhas no formato de indicadores.</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleDownloadClick}>
                  <Download size={15} strokeWidth={1.75} aria-hidden="true" /> Baixar CSV
                </button>
              </div>
            </div>
          )}

          <section className="etl-formato">
            <h2>Formato de saída</h2>
            <dl>
              <div><dt>Codigo_Municipio</dt><dd>texto</dd></div>
              <div><dt>Nome_Indicador</dt><dd>texto</dd></div>
              <div><dt>Ano_Observacao</dt><dd>número</dd></div>
              <div><dt>Valor</dt><dd>número</dd></div>
              <div><dt>Indice_Posicional</dt><dd>0 a 1</dd></div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ETLProcessor;
