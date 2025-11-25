
const fs = require('fs');

const completePath = 'd:/repos/Adm-de-cidades/complete_databases_catalog.json';
const srcPath = 'd:/repos/Adm-de-cidades/src/data/catalog.json';

const completeCatalog = JSON.parse(fs.readFileSync(completePath, 'utf8'));
const srcCatalog = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

const completeItems = new Set();
const srcItems = new Set();

function extractItems(catalog, set) {
    const db = catalog.brazilian_databases || {};
    for (const category in db) {
        if (Array.isArray(db[category])) {
            db[category].forEach(item => {
                if (item.name) set.add(item.name);
            });
        }
    }
}

extractItems(completeCatalog, completeItems);
extractItems(srcCatalog, srcItems);

const inSrcNotInComplete = [...srcItems].filter(x => !completeItems.has(x));
const inCompleteNotInSrc = [...completeItems].filter(x => !srcItems.has(x));

console.log(`Items in Src: ${srcItems.size}`);
console.log(`Items in Complete: ${completeItems.size}`);
console.log(`In Src but NOT in Complete: ${inSrcNotInComplete.length}`);
console.log(`In Complete but NOT in Src: ${inCompleteNotInSrc.length}`);

if (inSrcNotInComplete.length > 0) {
    console.log('Examples in Src but NOT in Complete:', inSrcNotInComplete.slice(0, 5));
}
if (inCompleteNotInSrc.length > 0) {
    console.log('Examples in Complete but NOT in Src:', inCompleteNotInSrc.slice(0, 5));
}
