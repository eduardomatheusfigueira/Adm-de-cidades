
const fs = require('fs');

const completePath = 'd:/repos/Adm-de-cidades/complete_databases_catalog.json';
const srcPath = 'd:/repos/Adm-de-cidades/src/data/catalog.json';

const completeCatalog = JSON.parse(fs.readFileSync(completePath, 'utf8'));
const srcCatalog = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

const srcNames = new Set();
// Populate srcNames
for (const cat in srcCatalog.brazilian_databases) {
    srcCatalog.brazilian_databases[cat].forEach(item => srcNames.add(item.name));
}

const candidates = [];
const garbage = [];

const garbageStarts = ["Acesse", "Use", "Baixe", "Consulte", "Filtre", "Visualize", "Exporte", "Defina", "Gere", "Selecione", "Navegue", "Clique", "Utilize"];

for (const cat in completeCatalog.brazilian_databases) {
    const items = completeCatalog.brazilian_databases[cat];
    items.forEach(item => {
        if (!srcNames.has(item.name)) {
            // Check for garbage
            let isGarbage = false;
            const firstWord = item.name.split(' ')[0];
            if (garbageStarts.includes(firstWord)) isGarbage = true;
            if (item.name.length > 100) isGarbage = true; // Heuristic: very long names are often sentences
            if (item.name === item.description) isGarbage = true;

            if (isGarbage) {
                garbage.push(item.name);
            } else {
                candidates.push({ category: cat, item: item });
            }
        }
    });
}

console.log(`Candidates to add: ${candidates.length}`);
console.log(`Garbage detected: ${garbage.length}`);
console.log('First 5 candidates:', candidates.slice(0, 5).map(c => c.item.name));
console.log('First 5 garbage:', garbage.slice(0, 5));
