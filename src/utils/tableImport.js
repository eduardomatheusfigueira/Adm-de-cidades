// Leitura de tabelas (CSV) enviadas pelos alunos, com detecção de separador e de codificação.
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

export async function readTableFile(file) {
  const name = file.name || '';
  if (/\.(xlsx?|ods)$/i.test(name)) {
    throw new Error('Planilhas do Excel/LibreOffice precisam ser salvas como CSV antes (Arquivo → Salvar como → CSV).');
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
