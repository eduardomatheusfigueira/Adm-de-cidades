import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawCatalogPath = path.join(__dirname, 'complete_databases_catalog.json');
const rawData = fs.readFileSync(rawCatalogPath, 'utf-8');
const rawCatalog = JSON.parse(rawData);

const potentialCandidates = [];
const garbage = [];

const instructionKeywords = [
    "Acesse", "Como utilizar", "Baixe", "Use", "Consulte", "Filtre", "Gere",
    "Defina", "Exporte", "Visualize", "Leia", "Escolha", "Faça", "Busque",
    "Selecione", "Acompanhe", "Utilize", "Clique", "Navegue", "Entenda", "Verifique"
];

const genericKeywords = [
    "Dados sobre", "Estatísticas de", "Informações sobre", "Resultados de",
    "Séries históricas", "Indicadores de", "Relatórios de", "Tabelas de",
    "Demonstrações", "Cadastros de", "Mapas de", "Monitoramento de",
    "Microdados", "Bases de dados", "Levantamentos", "Censos", "Pesquisas"
];

function isValidName(name) {
    if (!name) return false;

    // Check for instructions
    if (instructionKeywords.some(keyword => name.startsWith(keyword))) return false;

    // Check for generic descriptions (unless they look like a proper title)
    if (genericKeywords.some(keyword => name.startsWith(keyword))) {
        // Exception: if it has a dash or looks like a title with an acronym
        if (!name.includes("-") && !name.match(/[A-Z]{2,}/)) return false;
    }

    // Must be at least 3 words or have an acronym
    if (name.split(' ').length < 3 && !name.match(/[A-Z]{2,}/)) return false;

    return true;
}

for (const category in rawCatalog.brazilian_databases) {
    const items = rawCatalog.brazilian_databases[category];
    items.forEach(item => {
        if (item.source === 'original_brazilian_list') {
            if (isValidName(item.name)) {
                potentialCandidates.push({ category, name: item.name });
            } else {
                garbage.push(item.name);
            }
        }
    });
}

console.log("Potential Candidates Found:", potentialCandidates.length);
console.log(JSON.stringify(potentialCandidates, null, 2));
