// MapLibre GL v6 (ESM): o worker é procurado ao lado do bundle, e o Vite não o emite
// sozinho. Empacotamos o worker (com as dependências dele) e informamos a URL.
import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

maplibregl.setWorkerUrl(workerUrl);

export default maplibregl;
