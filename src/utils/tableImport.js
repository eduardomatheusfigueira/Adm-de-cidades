// Leitura de tabelas (CSV ou planilha .xlsx) enviadas pelos alunos, com detecção de separador,
// de codificação e da linha de cabeçalho.
import Papa from 'papaparse';
import { normalizeMunCode } from './malhas';

// Arquivos do IBGE/DATASUS/Excel no Windows costumam vir em Latin-1 (windows-1252)
const decodeText = (buffer) => {
  try {
    return { text: new TextDecoder('utf-8', { fatal: true }).decode(buffer), encoding: 'UTF-8' };
  } catch (e) {
    return { text: new TextDecoder('windows-1252').decode(buffer), encoding: 'Latin-1 (Windows)' };
  }
};

// Célula de planilha → texto no formato que o resto do app já entende (o mesmo de um CSV
// brasileiro): 22.516 → "22,516", 3550308 → "3550308", datas → "dd/mm/aaaa"
export const cellToText = (v) => {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) return '';
    return v.toLocaleString('pt-BR', { useGrouping: false, maximumFractionDigits: 12 });
  }
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return '';
    const d = String(v.getUTCDate()).padStart(2, '0'), m = String(v.getUTCMonth() + 1).padStart(2, '0');
    return `${d}/${m}/${v.getUTCFullYear()}`;
  }
  if (typeof v === 'boolean') return v ? 'Sim' : 'Não';
  return String(v).trim();
};

// Linhas (arrays) de uma planilha → { headers, rows }. Planilhas do IBGE e do DATASUS costumam
// ter título e notas acima do cabeçalho: ele é a primeira linha "cheia" entre as primeiras 30.
export function sheetRowsToTable(data) {
  const text = (data || []).map(r => (r || []).map(cellToText));
  const filled = (r) => r.filter(c => c !== '').length;
  const maxFilled = Math.max(0, ...text.slice(0, 30).map(filled));
  const headerIdx = text.findIndex((r, i) => i < 30 && filled(r) >= Math.max(2, Math.ceil(maxFilled * 0.6)));
  if (headerIdx < 0) return { headers: [], rows: [] };
  const seen = new Map();
  const headers = text[headerIdx].map((h, i) => {
    let name = h || `Coluna ${i + 1}`;
    const n = seen.get(name) || 0;
    seen.set(name, n + 1);
    if (n) name = `${name} (${n + 1})`;
    return name;
  });
  const rows = text.slice(headerIdx + 1)
    .filter(r => filled(r) > 0)
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
  return { headers, rows, headerRow: headerIdx + 1 };
}

async function readSpreadsheet(file, sheetName) {
  const { default: readXlsxFile } = await import('read-excel-file/browser');
  let sheets;
  try { sheets = await readXlsxFile(file); }
  catch (e) { throw new Error('Não consegui ler a planilha. Confira se o arquivo é .xlsx e não está protegido por senha.'); }
  const names = sheets.map(s => s.sheet);
  const chosen = sheets.find(s => s.sheet === sheetName)
    || sheets.find(s => sheetRowsToTable(s.data).rows.length > 0)
    || sheets[0];
  const { headers, rows, headerRow } = sheetRowsToTable(chosen?.data);
  if (!headers.length || !rows.length) throw new Error(`A aba “${chosen?.sheet ?? ''}” não tem linhas de dados.`);
  return { headers, rows, delimiter: null, encoding: 'Excel', sheets: names, sheet: chosen.sheet, headerRow };
}

// Lê CSV/TXT ou planilha .xlsx. `sheetName` escolhe a aba (planilhas com várias abas).
export async function readTableFile(file, sheetName) {
  const name = file.name || '';
  if (/\.xlsx$/i.test(name)) return readSpreadsheet(file, sheetName);
  if (/\.(xls|ods|numbers)$/i.test(name)) {
    throw new Error('Este formato de planilha não é lido diretamente. Salve como .xlsx (Excel) ou CSV (Arquivo → Salvar como) e envie de novo.');
  }
  const { text, encoding } = decodeText(await file.arrayBuffer());
  const parsed = Papa.parse(text.replace(/^\uFEFF/, ''), {
    header: true,
    skipEmptyLines: 'greedy',
    delimitersToGuess: [';', ',', '\t', '|'],
    transformHeader: (h) => h.trim(),
  });
  const headers = (parsed.meta.fields || []).filter(Boolean);
  if (!headers.length || !parsed.data.length) throw new Error('Não encontrei linhas de dados no arquivo.');
  return { headers, rows: parsed.data, delimiter: parsed.meta.delimiter, encoding };
}

// Adivinha a coluna com o código IBGE do município (7 ou 6 dígitos)
export function guessCodeColumn(headers, rows) {
  const sample = rows.slice(0, 200);
  const score = (h) => {
    const vals = sample.map(r => r[h]).filter(v => v !== undefined && `${v}`.trim() !== '');
    if (!vals.length) return 0;
    return vals.filter(v => normalizeMunCode(v).code6).length / vals.length;
  };
  const byName = headers.filter(h => /(^|[_\s])(c[oó]d|codigo|código|ibge|geoc[oó]d|cd_?mun|id_?mun)/i.test(h));
  const candidates = [...byName, ...headers.filter(h => !byName.includes(h))];
  let best = null, bestScore = 0;
  for (const h of candidates) {
    const s = score(h) + (byName.includes(h) ? 0.05 : 0);
    if (s > bestScore) { best = h; bestScore = s; }
  }
  return bestScore >= 0.6 ? best : null;
}
