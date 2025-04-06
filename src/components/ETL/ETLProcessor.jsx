import React, { useState, useRef, useEffect } from 'react';

// Placeholder for styles if needed later
// import './ETLProcessor.css';

const ETLProcessor = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sourceType, setSourceType] = useState('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const workerRef = useRef(null);

  // TODO: Define available source types based on plan/data
  const SOURCE_TYPES = [
    { value: '', label: 'Select Data Source Type...' },
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
        setError(workerError || 'An unknown error occurred during processing.');
        setResults(null);
      }
    };

    // Handle errors from the worker itself
    workerRef.current.onerror = (err) => {
      console.error("Worker Error:", err);
      setError(`Worker error: ${err.message}`);
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
      setError("Please select file(s) and a source type.");
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
            reader.onerror = (e) => reject(`Error reading file ${file.name}: ${e.target.error}`);
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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>ETL Processor - Data Transformation</h2>
      <p>Upload raw data files, select the source type, and process them into the standard format for the application.</p>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="file-upload" style={{ display: 'block', marginBottom: '5px' }}>Select File(s):</label>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={processing}
        />
        {selectedFiles.length > 0 && (
          <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.9em', color: '#555' }}>
            {selectedFiles.map(file => <li key={file.name}>- {file.name}</li>)}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="source-type" style={{ display: 'block', marginBottom: '5px' }}>Source Type:</label>
        <select
          id="source-type"
          value={sourceType}
          onChange={handleSourceTypeChange}
          disabled={processing}
          style={{ padding: '5px' }}
        >
          {SOURCE_TYPES.map(option => (
            <option key={option.value} value={option.value} disabled={option.value === ''}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleProcessClick}
        disabled={processing || !selectedFiles.length || !sourceType}
        style={{ padding: '10px 15px', cursor: 'pointer' }}
      >
        {processing ? 'Processing...' : 'Process Files'}
      </button>

      {error && (
        <div style={{ marginTop: '15px', color: 'red', border: '1px solid red', padding: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {results && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h3>Processing Complete</h3>
          <p>Successfully processed {results.length} rows.</p>
          {/* Optionally display a preview of the results */}
          {/* <pre style={{ maxHeight: '200px', overflowY: 'auto', background: '#f0f0f0', padding: '10px' }}>
            {JSON.stringify(results.slice(0, 10), null, 2)}
          </pre> */}
          <button
            onClick={handleDownloadClick}
            style={{ padding: '10px 15px', cursor: 'pointer', marginTop: '10px' }}
          >
            Download Formatted CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default ETLProcessor;
