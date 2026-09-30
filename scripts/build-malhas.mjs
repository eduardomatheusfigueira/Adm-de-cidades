#!/usr/bin/env node
// Gera as malhas municipais embutidas no app (public/data/malhas/) e a tabela base de municípios.
//
// Fontes:
//   - Perímetros municipais por UF (IBGE), projeto geodata-br — CC0 1.0 (domínio público)
//     https://github.com/tbrugz/geodata-br
//   - Lista de municípios com coordenadas e capitais, projeto municipios-brasileiros — MIT
//     https://github.com/kelvins/municipios-brasileiros
//
// Uso: node scripts/build-malhas.mjs   (requer internet; usa o mapshaper das devDependencies)
//
// Saída:
//   public/data/malhas/municipios-XX.json   TopoJSON simplificado por UF (código IBGE de 2 dígitos)
//   public/data/malhas/ufs.json             TopoJSON dos estados (dissolvido a partir dos municípios)
//   public/data/malhas/index.json           lista de UFs, arquivos e tamanhos
//   public/data/municipios-base.csv         5.570 municípios no formato do app (separador ;)

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'data', 'malhas');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'malhas-'));
const MAPSHAPER = path.join(ROOT, 'node_modules', '.bin', 'mapshaper');

const GEO_URL = (cod) => `https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-${cod}-mun.json`;
const MUN_URL = 'https://raw.githubusercontent.com/kelvins/municipios-brasileiros/main/csv/municipios.csv';
const UF_URL = 'https://raw.githubusercontent.com/kelvins/municipios-brasileiros/main/csv/estados.csv';

// Simplificação: mantém ~6% dos vértices (suficiente para mapas temáticos em tela e impressão A4)
const SIMPLIFY = '6%';

const REGIAO_SIGLA = { Norte: 'N', Nordeste: 'NE', Sudeste: 'SE', Sul: 'S', 'Centro-Oeste': 'CO' };

const fetchText = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return (await res.text()).replace(/^﻿/, '');
};

const parseCsv = (text) => {
  const [header, ...rows] = text.trim().split(/\r?\n/);
  const cols = header.split(',');
  return rows.map(r => {
    const v = r.split(',');
    return Object.fromEntries(cols.map((c, i) => [c.trim(), (v[i] ?? '').trim()]));
  });
};

const mapshaper = (args) => execFileSync(MAPSHAPER, args, { stdio: ['ignore', 'pipe', 'pipe'] });

// Área (km²) de cada município calculada pelo mapshaper (área esférica, com buracos e partes
// identificados pela geometria — os anéis da fonte nem sempre vêm na ordem padrão do GeoJSON)
const areasKm2 = (srcFile) => {
  const out = path.join(TMP, `area-${path.basename(srcFile)}`);
  // this.area tem sinal conforme o sentido do anel; o valor absoluto é a área
  mapshaper(['-i', srcFile, '-each', 'AREA_KM2 = Math.abs(this.area) / 1e6', '-o', out, 'format=json']);
  return Object.fromEntries(JSON.parse(fs.readFileSync(out, 'utf8')).map(r => [String(r.CD_MUN), r.AREA_KM2]));
};

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const ufs = parseCsv(await fetchText(UF_URL));
  const municipios = parseCsv(await fetchText(MUN_URL));
  const ufByCode = Object.fromEntries(ufs.map(u => [u.codigo_uf, u]));
  console.log(`${municipios.length} municípios, ${ufs.length} UFs`);

  const areaByCode = {};
  const index = [];
  const allSimplified = [];

  for (const uf of ufs.sort((a, b) => a.uf.localeCompare(b.uf))) {
    const cod = uf.codigo_uf;
    const raw = JSON.parse(await fetchText(GEO_URL(cod)));
    // Propriedades padronizadas: CD_MUN (7 dígitos), NM_MUN, SIGLA_UF
    raw.features.forEach(f => {
      f.properties = { CD_MUN: String(f.properties.id), NM_MUN: f.properties.name, SIGLA_UF: uf.uf };
    });
    const src = path.join(TMP, `src-${cod}.json`);
    fs.writeFileSync(src, JSON.stringify(raw));
    Object.assign(areaByCode, areasKm2(src));

    const dest = path.join(OUT, `municipios-${cod}.json`);
    mapshaper(['-i', src, 'name=municipios', '-simplify', SIMPLIFY, 'keep-shapes', 'planar',
      '-o', dest, 'format=topojson', 'quantization=100000', 'precision=0.00001']);
    const size = fs.statSync(dest).size;
    index.push({ uf: uf.uf, codigo_uf: cod, nome: uf.nome, regiao: REGIAO_SIGLA[uf.regiao] || uf.regiao, municipios: raw.features.length, arquivo: `municipios-${cod}.json`, bytes: size });
    console.log(`${uf.uf}: ${raw.features.length} municípios, ${(size / 1024).toFixed(0)} kB`);

    // versão simplificada em GeoJSON para dissolver os estados
    const simp = path.join(TMP, `simp-${cod}.json`);
    mapshaper(['-i', src, '-simplify', SIMPLIFY, 'keep-shapes', 'planar', '-o', simp, 'format=geojson']);
    allSimplified.push(simp);
  }

  // Estados: dissolve dos municípios de cada UF
  const merged = path.join(TMP, 'brasil.json');
  mapshaper(['-i', ...allSimplified, 'combine-files', '-merge-layers', 'force', '-o', merged, 'format=geojson']);
  const ufsOut = path.join(OUT, 'ufs.json');
  mapshaper(['-i', merged, '-dissolve', 'SIGLA_UF', '-simplify', '40%', 'keep-shapes', 'planar',
    '-rename-layers', 'ufs', '-o', ufsOut, 'format=topojson', 'quantization=100000']);
  console.log(`ufs.json: ${(fs.statSync(ufsOut).size / 1024).toFixed(0)} kB`);

  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({
    fonte: 'IBGE — perímetros municipais via github.com/tbrugz/geodata-br (CC0); lista de municípios via github.com/kelvins/municipios-brasileiros (MIT)',
    simplificacao: SIMPLIFY,
    ufs: index,
  }, null, 1));

  // Tabela base no formato de municípios do app
  const header = ['Codigo_Municipio', 'Nome_Municipio', 'Sigla_Estado', 'Sigla_Regiao', 'Area_Municipio', 'Capital', 'Altitude_Municipio', 'Longitude_Municipio', 'Latitude_Municipio'];
  const lines = municipios
    .sort((a, b) => a.codigo_ibge.localeCompare(b.codigo_ibge))
    .map(m => {
      const uf = ufByCode[m.codigo_uf];
      const area = areaByCode[m.codigo_ibge];
      return [m.codigo_ibge, m.nome, uf.uf, REGIAO_SIGLA[uf.regiao] || uf.regiao,
        area ? area.toFixed(1) : '', m.capital === '1' ? 'True' : 'False', '', m.longitude, m.latitude].join(';');
    });
  fs.writeFileSync(path.join(ROOT, 'public', 'data', 'municipios-base.csv'), [header.join(';'), ...lines].join('\n') + '\n');
  const semGeometria = municipios.filter(m => !areaByCode[m.codigo_ibge]).map(m => `${m.codigo_ibge} ${m.nome}`);
  console.log(`municipios-base.csv: ${lines.length} linhas; sem geometria: ${semGeometria.length} ${semGeometria.slice(0, 10).join(', ')}`);

  fs.rmSync(TMP, { recursive: true, force: true });
}

main().catch(e => { console.error(e); process.exit(1); });
