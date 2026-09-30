import { describe, it, expect } from 'vitest';
import path from 'node:path';
import readXlsxFile from 'read-excel-file/node';
import { cellToText, sheetRowsToTable } from '../tableImport';
import { parseNumberBR } from '../colorUtils';

const FIXTURE = path.join(__dirname, 'fixtures', 'planilha-ibge.xlsx');

describe('cellToText', () => {
  it('converte números para o formato brasileiro sem milhar', () => {
    expect(cellToText(22.516)).toBe('22,516');
    expect(cellToText(3550308)).toBe('3550308');
    expect(cellToText(0.0000001)).toBe('0,0000001');
    expect(parseNumberBR(cellToText(22.516), true)).toBeCloseTo(22.516);
  });
  it('datas, vazios e booleanos', () => {
    expect(cellToText(new Date(Date.UTC(2022, 7, 1)))).toBe('01/08/2022');
    expect(cellToText(null)).toBe('');
    expect(cellToText(true)).toBe('Sim');
  });
});

describe('sheetRowsToTable (planilha real)', () => {
  it('acha o cabeçalho abaixo do título, renomeia repetidos e ignora linhas vazias', async () => {
    const sheets = await readXlsxFile(FIXTURE);
    expect(sheets.map(s => s.sheet)).toEqual(['Notas', 'Dados']);
    const dados = sheets.find(s => s.sheet === 'Dados');
    const t = sheetRowsToTable(dados.data);
    expect(t.headerRow).toBe(4);
    expect(t.headers).toEqual(['Código IBGE', 'Município', 'Taxa (%)', 'População', 'Data', 'Código IBGE (2)']);
    expect(t.rows).toHaveLength(4); // 3 municípios + linha de total
    expect(t.rows[0]).toMatchObject({ 'Código IBGE': '3550308', 'Taxa (%)': '96,9', 'População': '11451999', Data: '01/08/2022' });
    expect(t.rows[1]['Taxa (%)']).toBe('97,25');
    expect(t.rows[2]['Taxa (%)']).toBe('');
    expect(t.rows[2]['Código IBGE']).toBe('354980');
  });
  it('aba sem tabela não tem linhas', async () => {
    const sheets = await readXlsxFile(FIXTURE);
    expect(sheetRowsToTable(sheets[0].data).rows).toHaveLength(0);
  });
});
