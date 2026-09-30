// Armazenamento local do trabalho em IndexedDB (sem dependências).
// Cada parte do projeto fica numa chave própria, para que dados grandes (geometrias,
// indicadores) só sejam regravados quando mudam — o restante é pequeno e gravado sempre.

const DB_NAME = 'sisinfo';
const STORE = 'projeto';

let dbPromise = null;
const openDb = () => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('IndexedDB indisponível')); return; }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  dbPromise.catch(() => { dbPromise = null; });
  return dbPromise;
};

const tx = async (mode, fn) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const store = t.objectStore(STORE);
    const result = fn(store);
    t.oncomplete = () => resolve(result?.result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
};

export const storeGet = (key) => tx('readonly', s => s.get(key));
export const storeSetMany = (entries) => tx('readwrite', s => { Object.entries(entries).forEach(([k, v]) => s.put(v, k)); });
export const storeClear = () => tx('readwrite', s => s.clear());

// Partes grandes do perfil gravadas separadamente
export const BIG_KEYS = ['municipios', 'indicadores', 'geometrias'];

export async function loadAutosave() {
  const meta = await storeGet('meta');
  if (!meta?.savedAt) return null;
  const state = (await storeGet('state')) || {};
  const big = {};
  for (const k of BIG_KEYS) {
    const v = await storeGet(k);
    if (v !== undefined) big[k] = v;
  }
  return { savedAt: meta.savedAt, profile: { ...state, ...big } };
}
