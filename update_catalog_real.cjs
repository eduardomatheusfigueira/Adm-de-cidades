
const fs = require('fs');

const completePath = 'd:/repos/Adm-de-cidades/complete_databases_catalog.json';
const srcPath = 'd:/repos/Adm-de-cidades/src/data/catalog.json';

const completeCatalog = JSON.parse(fs.readFileSync(completePath, 'utf8'));
const srcCatalog = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

const srcNames = new Set();
for (const cat in srcCatalog.brazilian_databases) {
    if (Array.isArray(srcCatalog.brazilian_databases[cat])) {
        srcCatalog.brazilian_databases[cat].forEach(item => srcNames.add(item.name));
    }
}

const garbageStarts = ["Acesse", "Use", "Baixe", "Consulte", "Filtre", "Visualize", "Exporte", "Defina", "Gere", "Selecione", "Navegue", "Clique", "Utilize"];

let addedCount = 0;

for (const cat in completeCatalog.brazilian_databases) {
    const items = completeCatalog.brazilian_databases[cat];

    // Ensure category exists in src
    if (!srcCatalog.brazilian_databases[cat]) {
        srcCatalog.brazilian_databases[cat] = [];
    }

    items.forEach(item => {
        if (!srcNames.has(item.name)) {
            // Check for garbage
            let isGarbage = false;
            const firstWord = item.name.split(' ')[0];
            if (garbageStarts.includes(firstWord)) isGarbage = true;
            if (item.name.length > 100) isGarbage = true;
            if (item.name === item.description) isGarbage = true;

            if (!isGarbage) {
                srcCatalog.brazilian_databases[cat].push(item);
                addedCount++;
            }
        }
    });
}

// Update metadata
srcCatalog.metadata.total_databases = 0;
for (const cat in srcCatalog.brazilian_databases) {
    srcCatalog.metadata.total_databases += srcCatalog.brazilian_databases[cat].length;
}
srcCatalog.metadata.date = new Date().toISOString().split('T')[0];

fs.writeFileSync(srcPath, JSON.stringify(srcCatalog, null, 2));

console.log(`Successfully added ${addedCount} items to src/data/catalog.json`);
console.log(`New total databases: ${srcCatalog.metadata.total_databases}`);
