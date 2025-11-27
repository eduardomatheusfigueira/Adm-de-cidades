import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawCatalogPath = path.join(__dirname, 'complete_databases_catalog.json');
const currentCatalogPath = path.join(__dirname, 'src/data/catalog.json');

const rawCatalog = JSON.parse(fs.readFileSync(rawCatalogPath, 'utf-8'));
const currentCatalog = JSON.parse(fs.readFileSync(currentCatalogPath, 'utf-8'));

const validKeywords = [
    "Sistema", "Portal", "Base de Dados", "Banco de Dados", "Cadastro",
    "Censo", "Anuário", "Índice", "Mapa", "Plataforma", "Painel",
    "Repositório", "Biblioteca", "Séries Temporais", "Observatório"
];

const excludeKeywords = [
    "Dados sobre", "Estatísticas de", "Informações sobre", "Resultados de",
    "Relatórios de", "Tabelas de", "Demonstrações", "Links para", "Como utilizar",
    "Acesse", "Baixe", "Consulte", "Veja", "Confira"
];

function isRealDatabase(name) {
    if (!name) return false;

    // Must contain at least one valid keyword
    const hasValidKeyword = validKeywords.some(keyword => name.includes(keyword));
    if (!hasValidKeyword) return false;

    // Must NOT start with exclude keywords
    const startsWithExclude = excludeKeywords.some(keyword => name.startsWith(keyword));
    if (startsWithExclude) return false;

    return true;
}

let restoredCount = 0;

for (const category in rawCatalog.brazilian_databases) {
    const rawItems = rawCatalog.brazilian_databases[category];

    if (!currentCatalog.brazilian_databases[category]) {
        currentCatalog.brazilian_databases[category] = [];
    }

    rawItems.forEach(item => {
        // Only look at items we previously filtered out (original_brazilian_list)
        if (item.source === 'original_brazilian_list') {
            if (isRealDatabase(item.name)) {
                // Check if it already exists in the current catalog
                const exists = currentCatalog.brazilian_databases[category].some(
                    existing => existing.name === item.name || existing.name.includes(item.name)
                );

                if (!exists) {
                    // Add it, but mark it as 'restored' so we know
                    const newItem = { ...item, source: 'restored_original' };
                    // Try to fix empty URLs if possible (placeholder)
                    if (!newItem.url) newItem.url = "https://www.google.com/search?q=" + encodeURIComponent(newItem.name);

                    currentCatalog.brazilian_databases[category].push(newItem);
                    restoredCount++;
                }
            }
        }
    });
}

// Update metadata
currentCatalog.metadata.date = new Date().toISOString().split('T')[0];
currentCatalog.metadata.total_databases = Object.values(currentCatalog.brazilian_databases).reduce((acc, curr) => acc + curr.length, 0) + (currentCatalog.international_databases ? currentCatalog.international_databases.length : 0);

fs.writeFileSync(currentCatalogPath, JSON.stringify(currentCatalog, null, 2));

console.log(`Restored ${restoredCount} valid databases.`);
console.log('Total databases:', currentCatalog.metadata.total_databases);
