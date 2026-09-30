// Malhas municipais do IBGE embutidas no app (geradas por scripts/build-malhas.mjs)
// e tabela base com os municípios do Brasil.
import Papa from 'papaparse';
import { feature } from 'topojson-client';

const BASE = `${import.meta.env.BASE_URL || '/'}data/`;
const cache = new Map();

const fetchJson = async (url) => {
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then(r => {
      if (!r.ok) throw new Error(`Não foi possível baixar ${url} (HTTP ${r.status})`);
      return r.json();
    }).catch(e => { cache.delete(url); throw e; }));
  }
  return cache.get(url);
};

// { ufs: [{ uf, codigo_uf, nome, regiao, municipios, arquivo, bytes }], fonte }
export const loadMalhaIndex = () => fetchJson(`${BASE}malhas/index.json`);

// Feições (GeoJSON) dos municípios das UFs pedidas (códigos IBGE de 2 dígitos)
export async function loadMunicipiosGeometry(codigosUf) {
  const index = await loadMalhaIndex();
  const wanted = index.ufs.filter(u => codigosUf.includes(u.codigo_uf));
  const parts = await Promise.all(wanted.map(async (u) => {
    const topo = await fetchJson(`${BASE}malhas/${u.arquivo}`);
    return feature(topo, topo.objects[Object.keys(topo.objects)[0]]).features;
  }));
  return parts.flat();
}

// Contornos dos estados (para mapa de localização, contexto etc.)
export async function loadUfsGeometry() {
  const topo = await fetchJson(`${BASE}malhas/ufs.json`);
  return feature(topo, topo.objects[Object.keys(topo.objects)[0]]);
}

// Tabela base: 1 linha por município, no formato de municípios do app
let baseRowsPromise = null;
export function loadBaseMunicipios() {
  if (!baseRowsPromise) {
    baseRowsPromise = fetch(`${BASE}municipios-base.csv`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
      .then(text => Papa.parse(text, { header: true, delimiter: ';', skipEmptyLines: true }).data)
      .catch(e => { baseRowsPromise = null; throw e; });
  }
  return baseRowsPromise;
}

// Normaliza um código de município: aceita 7 dígitos (IBGE) ou 6 (sem o dígito verificador,
// como em bases do DATASUS). Devolve { code7, code6 }.
export const normalizeMunCode = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length === 7) return { code7: digits, code6: digits.slice(0, 6) };
  if (digits.length === 6) return { code7: null, code6: digits };
  return { code7: null, code6: null };
};
