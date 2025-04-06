// etlWorker.js - Web Worker for background data processing

// Import necessary libraries (adjust path/method based on build setup)
// Using importScripts for classic workers. If using module workers, use import.
try {
    // Assuming libraries are available globally or via importScripts
    // You might need to copy these library files to the public folder or configure your build tool
    importScripts('https://unpkg.com/papaparse@5.3.2/papaparse.min.js'); // For CSV parsing
    importScripts('https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js'); // For Excel parsing
} catch (e) {
    console.error("Failed to import scripts:", e);
    // Post error back to main thread if imports fail
    self.postMessage({ type: 'error', error: 'Worker initialization failed: Could not load required libraries.' });
}

self.onmessage = function(event) {
    const { type, payload } = event.data;

    if (type === 'process') {
        const { files, sourceType } = payload;
        console.log(`Worker received process request for source type: ${sourceType}`);

        try {
            if (!self.Papa || !self.XLSX) {
                 throw new Error("Required parsing libraries (PapaParse, SheetJS) not loaded.");
            }

            // --- Data Processing Logic ---
            let allProcessedData = [];

            files.forEach(file => {
                console.log(`Processing file: ${file.name}`);
                let parsedData = [];

                // Determine file type and parse accordingly
                if (file.name.toLowerCase().endsWith('.csv')) {
                    // Use PapaParse for CSV
                    // Need to convert ArrayBuffer back to string for PapaParse
                    const csvString = new TextDecoder("latin1").decode(new Uint8Array(file.content)); // Assuming latin1 based on python script, might need adjustment
                     const parseResult = Papa.parse(csvString, {
                        header: true, // Assuming header row
                        skipEmptyLines: true,
                        delimiter: ';', // Assuming semicolon based on python script
                        // encoding: "Latin-1" // PapaParse might not support encoding directly this way, handle via TextDecoder
                    });
                     if (parseResult.errors.length > 0) {
                        console.error("CSV Parsing Errors:", parseResult.errors);
                        // Decide if partial data is acceptable or throw error
                        // throw new Error(`CSV parsing errors in ${file.name}`);
                    }
                    parsedData = parseResult.data;

                } else if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
                    // Use SheetJS (XLSX) for Excel
                    const workbook = XLSX.read(file.content, { type: 'array' });
                    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
                    const worksheet = workbook.Sheets[sheetName];
                    const rawExcelData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false }); // Read as array of arrays, skip blank rows

                    // Find header row (assuming it's the first non-empty row)
                    let headerRowIndex = 0;
                    while (headerRowIndex < rawExcelData.length && (!rawExcelData[headerRowIndex] || rawExcelData[headerRowIndex].length === 0)) {
                        headerRowIndex++;
                    }

                    if (headerRowIndex >= rawExcelData.length) {
                        throw new Error(`Could not find header row in Excel file: ${file.name}`);
                    }

                    const headers = rawExcelData[headerRowIndex].map(h => String(h).trim());
                    const dataRows = rawExcelData.slice(headerRowIndex + 1);

                    // Convert rows to objects
                    parsedData = dataRows.map(row => {
                        const obj = {};
                        headers.forEach((header, index) => {
                            obj[header] = row[index];
                        });
                        return obj;
                    });
                    console.log(`Successfully parsed Excel file ${file.name} into ${parsedData.length} objects.`);

                } else {
                    throw new Error(`Unsupported file type: ${file.name}`);
                }

                // --- Source-Specific Transformation ---
                let transformedData = transformData(parsedData, sourceType, file.name);

                // --- Combine results from multiple files ---
                allProcessedData = allProcessedData.concat(transformedData);
            });

             // --- Calculate Positional Index and Rank ---
            // This needs to be done *after* all files for a given indicator/year are combined
            // For now, placeholder - requires grouping logic similar to the python script
            let finalData = calculateRankings(allProcessedData);


            // --- Post Success Message ---
            self.postMessage({ type: 'success', payload: finalData });

        } catch (err) {
            console.error("Error during processing in worker:", err);
            self.postMessage({ type: 'error', error: err.message || 'An unknown error occurred in the worker.' });
        }
    }
};

// --- Helper Functions ---

function transformData(parsedData, sourceType, fileName) {
    // Placeholder for source-specific cleaning and restructuring logic
    console.log(`Transforming data for source: ${sourceType}, file: ${fileName}`);
    // This function needs to implement the logic from the Python scripts (cleaning, melting)
    // based on the sourceType. It should return data in the format:
    // [{ Codigo_Municipio, Nome_Indicador, Ano_Observacao, Valor }, ...]

    // Example structure - NEEDS ACTUAL IMPLEMENTATION PER SOURCE
    let transformed = [];
    switch (sourceType) {
        case 'snis_agua_esgoto': {
            console.log(`Applying SNIS transformation logic...`);
            const meltedData = [];
            const idColumnsLower = ['código do município', 'município', 'ano de referência', 'código do ibge"', 'estado', 'prestadores', 'serviços', 'natureza jurídica', 'id']; // Columns to ignore during melt

            parsedData.forEach((row, rowIndex) => {
                // Identify Municipio Code and Year, handling potential variations
                const codigoMunicipio = row['Código do Município'] || row['Código do IBGE"'] || row['Codigo_Municipio'];
                const anoReferencia = row['Ano de Referência'] || row['Ano_Observacao'];

                if (!codigoMunicipio || !anoReferencia || String(codigoMunicipio).trim() === '' || String(anoReferencia).trim() === '') {
                    console.warn(`Skipping row ${rowIndex + 1} due to missing Código do Município or Ano de Referência:`, row);
                    return; // Skip rows without essential IDs
                }

                const codigoMunicipioStr = String(codigoMunicipio).trim();
                const anoReferenciaStr = String(anoReferencia).trim();

                Object.keys(row).forEach(columnName => {
                    const lowerColName = columnName.toLowerCase().trim();
                    // Check if the column is NOT one of the known non-indicator columns
                    if (!idColumnsLower.includes(lowerColName)) {
                        const rawValue = row[columnName];
                        let cleanedValue = null;

                        // Clean and convert value only if it's not empty/null
                        if (rawValue !== null && rawValue !== undefined && String(rawValue).trim() !== '') {
                            try {
                                // Handle potential thousands separators (.) and decimal comma (,)
                                const valueString = String(rawValue).replace(/\./g, '').replace(',', '.');
                                cleanedValue = parseFloat(valueString);
                                if (isNaN(cleanedValue)) {
                                    // console.warn(`Value "${rawValue}" in column "${columnName}" is not a valid number after cleaning. Row:`, row);
                                    cleanedValue = null; // Set to null if conversion fails
                                }
                            } catch (e) {
                                console.warn(`Could not parse value "${rawValue}" for ${columnName} in row ${rowIndex + 1}:`, e);
                                cleanedValue = null;
                            }
                        }

                        // Only add if value is a valid number
                        if (cleanedValue !== null) {
                            meltedData.push({
                                Codigo_Municipio: codigoMunicipioStr,
                                Nome_Indicador: columnName.trim(), // Use original column name as indicator name
                                Ano_Observacao: anoReferenciaStr,
                                Valor: cleanedValue
                            });
                        }
                    }
                });
            });
            transformed = meltedData;
            console.log(`SNIS transformation complete. ${transformed.length} rows generated.`);
            break;
        }
        case 'finbra_receitas': {
            console.log(`Applying FINBRA Receitas transformation logic...`);
            const transformedFinbra = [];
            // Attempt to extract year from filename (e.g., _2013.csv)
            const yearMatch = fileName.match(/_(\d{4})\.csv$/i);
            const anoObservacao = yearMatch ? yearMatch[1] : null;

            if (!anoObservacao) {
                console.error(`Could not extract year from FINBRA filename: ${fileName}. Skipping file.`);
                // Optionally throw an error or return empty array depending on desired behavior
                // throw new Error(`Could not extract year from FINBRA filename: ${fileName}`);
                transformed = []; // Skip processing this file
                break;
            }
            console.log(`Extracted year ${anoObservacao} for FINBRA file ${fileName}`);

            parsedData.forEach((row, rowIndex) => {
                // Check for essential columns (adjust names based on actual CSV header)
                const codIbge = row['Cod.IBGE'] || row['Cod IBGE']; // Handle variations
                const coluna = row['Coluna'];
                const conta = row['Conta'];
                const valorRaw = row['Valor'];

                if (!codIbge || !coluna || !conta || valorRaw === undefined || valorRaw === null) {
                    // console.warn(`Skipping FINBRA row ${rowIndex + 1} due to missing required columns (Cod.IBGE, Coluna, Conta, Valor):`, row);
                    return; // Skip rows with missing essential data
                }

                const codigoMunicipioStr = String(codIbge).trim();
                const nomeIndicador = `${String(coluna).trim()} em ${String(conta).trim()}`;
                let cleanedValue = null;

                // Clean and convert value
                 if (String(valorRaw).trim() !== '') {
                    try {
                        const valueString = String(valorRaw).replace(/\./g, '').replace(',', '.');
                        cleanedValue = parseFloat(valueString);
                        if (isNaN(cleanedValue)) {
                            cleanedValue = null; // Set to null if conversion fails
                        }
                    } catch (e) {
                         console.warn(`Could not parse FINBRA value "${valorRaw}" for ${nomeIndicador} in row ${rowIndex + 1}:`, e);
                        cleanedValue = null;
                    }
                }

                // Only add if value is a valid number and Codigo_Municipio is present
                if (cleanedValue !== null && codigoMunicipioStr !== '') {
                    transformedFinbra.push({
                        Codigo_Municipio: codigoMunicipioStr,
                        Nome_Indicador: nomeIndicador,
                        Ano_Observacao: anoObservacao, // Use extracted year
                        Valor: cleanedValue
                    });
                }
            });
            transformed = transformedFinbra;
            console.log(`FINBRA transformation complete. ${transformed.length} rows generated.`);
            break;
        }
        case 'ibge_pib_2010_2021':
        case 'ibge_pib_2002_2009': {
            console.log(`Applying IBGE PIB transformation logic for ${sourceType}...`);
            const meltedData = [];
            // Define potential ID columns based on Python script and common Excel formats
            const idColumnsLower = ['código da grande região', 'nome da grande região', 'sigla da unidade da federação', 'código da unidade da federação', 'nome da unidade da federação', 'código do município', 'nome do município', 'ano'];

            parsedData.forEach((row, rowIndex) => {
                // Identify Municipio Code and Year
                const codigoMunicipio = row['Código do Município']; // Adjust if header name differs
                const anoObservacao = row['Ano']; // Adjust if header name differs

                if (!codigoMunicipio || !anoObservacao || String(codigoMunicipio).trim() === '' || String(anoObservacao).trim() === '') {
                    // console.warn(`Skipping IBGE row ${rowIndex + 1} due to missing Código do Município or Ano:`, row);
                    return; // Skip rows without essential IDs
                }

                const codigoMunicipioStr = String(codigoMunicipio).trim();
                const anoObservacaoStr = String(anoObservacao).trim();

                Object.keys(row).forEach(columnName => {
                    const lowerColName = columnName.toLowerCase().trim();
                    // Check if the column is NOT one of the known non-indicator columns
                    if (!idColumnsLower.includes(lowerColName)) {
                        const rawValue = row[columnName];
                        let cleanedValue = null;

                        // Clean and convert value only if it's not empty/null/non-numeric marker like '-'
                        if (rawValue !== null && rawValue !== undefined && String(rawValue).trim() !== '' && String(rawValue).trim() !== '-') {
                            try {
                                // IBGE values are typically numbers already, might not need complex cleaning
                                cleanedValue = parseFloat(rawValue);
                                if (isNaN(cleanedValue)) {
                                    cleanedValue = null; // Set to null if conversion fails
                                }
                            } catch (e) {
                                console.warn(`Could not parse IBGE value "${rawValue}" for ${columnName} in row ${rowIndex + 1}:`, e);
                                cleanedValue = null;
                            }
                        }

                        // Only add if value is a valid number
                        if (cleanedValue !== null) {
                            meltedData.push({
                                Codigo_Municipio: codigoMunicipioStr,
                                Nome_Indicador: columnName.trim(), // Use original column name as indicator name
                                Ano_Observacao: anoObservacaoStr,
                                Valor: cleanedValue
                            });
                        }
                    }
                });
            });
            transformed = meltedData;
            console.log(`IBGE PIB transformation complete. ${transformed.length} rows generated.`);
            break;
        }
        case 'ipeadata': {
            console.log(`Applying IPEADATA transformation logic...`);
            const transformedIpea = [];
            let valueColumnName = null; // To store the specific 'VALUE (...)' column name

            // Find the 'VALUE (...)' column name from the first data row's keys
            if (parsedData.length > 0) {
                const firstRowKeys = Object.keys(parsedData[0]);
                valueColumnName = firstRowKeys.find(key => key.toUpperCase().startsWith('VALUE'));
            }

            if (!valueColumnName) {
                 console.error(`Could not find 'VALUE (...)' column in IPEADATA file: ${fileName}. Skipping file.`);
                 transformed = [];
                 break;
            }
             console.log(`Found IPEADATA value column: ${valueColumnName}`);

            parsedData.forEach((row, rowIndex) => {
                // Optional filtering based on NIVNOME if present
                if (row['NIVNOME'] && String(row['NIVNOME']).trim().toLowerCase() !== 'municípios') {
                    return; // Skip if not at the municipality level
                }

                // Identify key columns (handle case variations)
                const tercodigo = row['TERCODIGO'];
                const year = row['YEAR'];
                const valorRaw = row[valueColumnName]; // Use the dynamically found value column name

                if (!tercodigo || !year || valorRaw === undefined || valorRaw === null) {
                    // console.warn(`Skipping IPEADATA row ${rowIndex + 1} due to missing TERCODIGO, YEAR, or Value:`, row);
                    return; // Skip rows with missing essential data
                }

                const codigoMunicipioStr = String(tercodigo).trim();
                const anoObservacaoStr = String(year).trim();
                const nomeIndicador = valueColumnName; // Use the actual value column name as indicator
                let cleanedValue = null;

                // Clean and convert value
                if (String(valorRaw).trim() !== '') {
                    try {
                        // IPEADATA values might use '.' as decimal separator already
                        const valueString = String(valorRaw).replace(',', '.'); // Ensure decimal point
                        cleanedValue = parseFloat(valueString);
                        if (isNaN(cleanedValue)) {
                            cleanedValue = null;
                        } else {
                            // Multiply by 1000 as per Python script logic
                            cleanedValue *= 1000;
                        }
                    } catch (e) {
                        console.warn(`Could not parse IPEADATA value "${valorRaw}" for ${nomeIndicador} in row ${rowIndex + 1}:`, e);
                        cleanedValue = null;
                    }
                }

                // Only add if value is valid and Codigo_Municipio is present
                if (cleanedValue !== null && codigoMunicipioStr !== '') {
                    transformedIpea.push({
                        Codigo_Municipio: codigoMunicipioStr,
                        Nome_Indicador: nomeIndicador,
                        Ano_Observacao: anoObservacaoStr,
                        Valor: cleanedValue
                    });
                }
            });
            transformed = transformedIpea;
            console.log(`IPEADATA transformation complete. ${transformed.length} rows generated.`);
            break;
        }
        default:
            throw new Error(`Unknown source type for transformation: ${sourceType}`);
    }
    // Return standardized format [{ Codigo_Municipio, Nome_Indicador, Ano_Observacao, Valor }, ...]
    // Ensure correct column names and data types
    return transformed; // Return placeholder for now
}

function calculateRankings(data) {
    console.log(`Starting ranking calculation for ${data.length} rows...`);
    if (!data || data.length === 0) {
        return [];
    }

    // 1. Group data by Nome_Indicador and Ano_Observacao
    const groups = data.reduce((acc, item) => {
        const key = `${item.Nome_Indicador}|${item.Ano_Observacao}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push({ ...item }); // Push a copy to avoid modifying original data during sort
        return acc;
    }, {});

    const rankedData = [];

    // 2. Process each group
    Object.values(groups).forEach(group => {
        const N = group.length;
        if (N === 0) return;

        // 2a. Sort by Valor (descending assumed, handle nulls/undefined safely)
        group.sort((a, b) => (b.Valor ?? -Infinity) - (a.Valor ?? -Infinity));

        // 2b. Calculate initial Indice_Posicional (linear space 1 to 0)
        // Handle N=1 case separately to avoid division by zero or NaN
        if (N === 1) {
            group[0].Indice_Posicional = 1.0; // Assign 1 for single item group
        } else {
            group.forEach((item, index) => {
                // Linear interpolation from 1 (highest rank) down to 0 (lowest rank)
                item.Indice_Posicional = 1 - (index / (N - 1));
            });
        }


        // 2d. Identify ties and average Indice_Posicional
        const valueGroups = group.reduce((acc, item, index) => {
            const valueKey = String(item.Valor); // Group by value
            if (!acc[valueKey]) {
                acc[valueKey] = { indices: [], sumIndices: 0, count: 0 };
            }
            acc[valueKey].indices.push(index); // Store original index in sorted group
            acc[valueKey].sumIndices += item.Indice_Posicional;
            acc[valueKey].count++;
            return acc;
        }, {});

        Object.values(valueGroups).forEach(tieGroup => {
            if (tieGroup.count > 1) {
                const averageIndex = tieGroup.sumIndices / tieGroup.count;
                tieGroup.indices.forEach(originalIndex => {
                    group[originalIndex].Indice_Posicional = averageIndex;
                });
            }
        });

        // 2f. Calculate Posicao
        group.forEach(item => {
            // Formula from Python script: total * (1 - indice_posicional) + indice_posicional
            // Ensure Indice_Posicional is a number
            const indice = typeof item.Indice_Posicional === 'number' ? item.Indice_Posicional : 0;
            const posicao = N * (1 - indice) + indice;
            item.Posicao = Math.round(posicao);
        });

        // Add processed group to final results
        rankedData.push(...group);
    });

    console.log(`Ranking calculation complete. ${rankedData.length} rows processed.`);
    return rankedData;
}

console.log("ETL Worker script loaded and ready.");
