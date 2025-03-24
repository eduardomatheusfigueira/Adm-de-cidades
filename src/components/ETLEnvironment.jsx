import React, { useState } from 'react';
import '../styles/DataVisualizationEnvironment.css';
import '../styles/ETLEnvironment.css';

const ETLEnvironment = () => {
  const [selectedETL, setSelectedETL] = useState('municipios');
  const [etlStatus, setEtlStatus] = useState('idle');
  const [logMessages, setLogMessages] = useState([]);
  const [inputFiles, setInputFiles] = useState({
    populacao: null,
    altitude: null,
    longitude: null,
    latitude: null,
    geometria: null,
    snis: null, // Novo estado para o arquivo SNIS
  });
  const [outputFolder, setOutputFolder] = useState('./data');
  const [outputFilename, setOutputFilename] = useState('municipios');

  const regioesPorEstado = {
    'RO': 'N', 'AC': 'N', 'AM': 'N', 'RR': 'N', 'PA': 'N', 'AP': 'N', 'TO': 'N',
    'MA': 'NE', 'PI': 'NE', 'CE': 'NE', 'RN': 'NE', 'PB': 'NE', 'PE': 'NE', 'AL': 'NE', 'SE': 'NE', 'BA': 'NE',
    'MG': 'SE', 'ES': 'SE', 'RJ': 'SE', 'SP': 'SE',
    'PR': 'S', 'SC': 'S', 'RS': 'S',
    'MS': 'CO', 'MT': 'CO', 'GO': 'CO', 'DF': 'CO'
  };

  const addLogMessage = (message) => {
    setLogMessages(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  };

  const handleFileChange = (fileType, event) => {
    const file = event.target.files[0];
    if (file) {
      setInputFiles(prev => ({ ...prev, [fileType]: file }));
      addLogMessage(`Arquivo ${file.name} selecionado para ${fileType}`);
    }
  };

  // Nova função para lidar com a seleção do arquivo SNIS
  const handleSNISFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setInputFiles(prev => ({ ...prev, snis: file }));
      addLogMessage(`Arquivo SNIS ${file.name} selecionado`);
    }
  };

  const simulateETLProcess = async () => {
    const requiredFiles = ['populacao', 'altitude', 'longitude', 'latitude', 'geometria'];
    const missingFiles = requiredFiles.filter(fileType => !inputFiles[fileType]);

    if (missingFiles.length > 0) {
      alert(`Por favor, selecione todos os arquivos necessários. Faltando: ${missingFiles.join(', ')}`);
      return;
    }

    setEtlStatus('running');
    addLogMessage('Iniciando processo ETL para geração de dados de municípios...');

    // Simulação do processamento do arquivo SNIS
    if (inputFiles.snis) {
      addLogMessage('Iniciando processamento do arquivo SNIS...');
      await simulateStep('Lendo e limpando o arquivo SNIS (simulação)...', 1000);
      await simulateStep('Reestruturando os dados do SNIS (simulação)...', 1500);
      await simulateStep('Convertendo os dados para o formato desejado (simulação)...', 1200);
      await simulateStep('Arquivo SNIS processado com sucesso (simulação)!', 1000);
    }

    const fullOutputPathCSV = `${outputFolder}/${outputFilename}.csv`;
    const fullOutputPathGeoJSON = `${outputFolder}/${outputFilename}.geojson`;

    await simulateStep('Limpando e processando arquivo CSV de população...', 1000);
    await simulateStep('Carregando dados de territórios...', 1500);
    await simulateStep('Associando dados de população ao dataframe de territórios...', 800);
    await simulateStep('Carregando e processando dados de altitude, longitude e latitude...', 1200);
    await simulateStep('Associando dados geográficos ao dataframe de territórios...', 1000);
    await simulateStep('Criando coluna de regiões baseada nos estados...', 500);
    await simulateStep('Carregando GeoJSON com geometrias dos municípios...', 1800);
    await simulateStep('Realizando merge entre dados de territórios e geometrias...', 1500);
    await simulateStep(`Exportando CSV sem geometria para ${fullOutputPathCSV}`, 1000);
    await simulateStep(`Exportando GeoJSON com geometria para ${fullOutputPathGeoJSON}`, 1200);

    addLogMessage('Processo ETL concluído com sucesso!');
    setEtlStatus('completed');
  };

  const simulateStep = async (message, delay) => {
    addLogMessage(message);
    return new Promise(resolve => setTimeout(resolve, delay));
  };

  const handleRunETL = () => {
    if (etlStatus === 'running') {
      alert('Um processo ETL já está em execução. Aguarde a conclusão.');
      return;
    }

    simulateETLProcess();
  };

  const handleClearLog = () => {
    setLogMessages([]);
    setEtlStatus('idle');
  };

  return (
    <div className="data-visualization-environment etl-environment">
      <div className="data-visualization-header">
        <h1>Ambiente ETL</h1>
        <div className="view-selector">
          <button
            className={`view-button ${selectedETL === 'municipios' ? 'active' : ''}`}
            onClick={() => setSelectedETL('municipios')}
          >
            ETL Municípios
          </button>
          <button
            className={`view-button ${selectedETL === 'indicadores' ? 'active' : ''}`}
            onClick={() => setSelectedETL('indicadores')}
          >
            ETL Indicadores
          </button>
        </div>
      </div>

      <div className="data-visualization-container">
        <div className="data-visualization-sidebar">
          <h3>Configuração ETL</h3>

          {selectedETL === 'municipios' && (
            <div className="etl-config-section">
              <h4>ETL de Municípios</h4>
              <p>Esta função processa dados de municípios brasileiros, combinando informações geográficas e administrativas, incluindo dados do SNIS.</p>

              <div className="file-input-group">
                <label>Arquivo de População:</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange('populacao', e)}
                />
                <span className="file-status">
                  {inputFiles.populacao ? '✓' : '⨯'}
                </span>
              </div>

              <div className="file-input-group">
                <label>Arquivo de Altitude:</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange('altitude', e)}
                />
                <span className="file-status">
                  {inputFiles.altitude ? '✓' : '⨯'}
                </span>
              </div>

              <div className="file-input-group">
                <label>Arquivo de Longitude:</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange('longitude', e)}
                />
                <span className="file-status">
                  {inputFiles.longitude ? '✓' : '⨯'}
                </span>
              </div>

              <div className="file-input-group">
                <label>Arquivo de Latitude:</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange('latitude', e)}
                />
                <span className="file-status">
                  {inputFiles.latitude ? '✓' : '⨯'}
                </span>
              </div>

              <div className="file-input-group">
                <label>Arquivo de Geometria (GeoJSON):</label>
                <input
                  type="file"
                  accept=".geojson,.json"
                  onChange={(e) => handleFileChange('geometria', e)}
                />
                <span className="file-status">
                  {inputFiles.geometria ? '✓' : '⨯'}
                </span>
              </div>

              {/* Campo de entrada para o arquivo SNIS */}
              <div className="file-input-group">
                <label>Arquivo SNIS:</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleSNISFileChange}
                />
                <span className="file-status">
                  {inputFiles.snis ? '✓' : '⨯'}
                </span>
              </div>

              <div className="output-path-group">
                <label>Diretório de Saída:</label>
                <input
                  type="text"
                  value={outputFolder}
                  onChange={(e) => setOutputFolder(e.target.value)}
                />
              </div>

              <div className="output-path-group">
                <label>Nome do Arquivo de Saída (sem extensão):</label>
                <input
                  type="text"
                  value={outputFilename}
                  onChange={(e) => setOutputFilename(e.target.value)}
                />
              </div>
            </div>
          )}

          {selectedETL === 'indicadores' && (
            <div className="etl-config-section">
              <h4>ETL de Indicadores</h4>
              <p>Funcionalidade em desenvolvimento. Esta função processará dados de indicadores para municípios.</p>
            </div>
          )}

          <div className="etl-actions">
            <button
              onClick={handleRunETL}
              disabled={etlStatus === 'running'}
              className={etlStatus === 'running' ? 'running' : ''}
            >
              {etlStatus === 'running' ? 'Executando...' : 'Executar ETL'}
            </button>
            <button onClick={handleClearLog}>Limpar Log</button>
          </div>
        </div>

        <div className="data-visualization-content">
          <div className="etl-content">
            <h2>Log de Execução ETL</h2>

            <div className="etl-status-bar">
              <span className="status-label">Status:</span>
              <span className={`status-value status-${etlStatus}`}>
                {etlStatus === 'idle' ? 'Pronto' :
                  etlStatus === 'running' ? 'Em execução' :
                    'Concluído'}
              </span>
            </div>

            <div className="etl-log">
              {logMessages.length === 0 ? (
                <p className="empty-log">Nenhuma atividade registrada. Clique em "Executar ETL" para iniciar o processo.</p>
              ) : (
                logMessages.map((log, index) => (
                  <div key={index} className="log-entry">
                    <span className="log-time">[{log.time}]</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))
              )}
            </div>

            <div className="etl-note">
              <p>
                <b>Observação:</b> Esta é uma simulação do processo ETL. No ambiente real, o script Python
                utilizaria bibliotecas como <code>pandas</code>, <code>geopandas</code> e <code>ipeadatapy</code>
                para processar os dados, incluindo a padronização dos dados do SNIS. Devido às limitações do WebContainer, estamos simulando o fluxo de trabalho.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETLEnvironment;
