// Hachura "Sem dados" do guia de identidade: fundo #E4DFD5 + traços #CCC7BC a 45°.
// A cor de fundo vem da camada de preenchimento; esta camada desenha só os traços por cima.
export const HATCH_ID = 'sem-dados-hachura';
export const HATCH_COLOR = '#CCC7BC';
export const HATCH_LAYER = 'sectors-nodata-hatch';

const SIZE = 8; // px lógicos por repetição do padrão

// Padrão RGBA (traços diagonais de ~1,5 px), no formato aceito por map.addImage
export function hatchImage(pixelRatio = 2) {
  const n = Math.round(SIZE * pixelRatio);
  const data = new Uint8ClampedArray(n * n * 4);
  const [r, g, b] = [0xCC, 0xC7, 0xBC];
  const w = 0.75 * pixelRatio; // meia espessura do traço
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      // distância à diagonal x + y ≡ 0 (mod n), que se repete sem emendas
      const d = ((x + y) % n + n) % n;
      const dist = Math.min(d, n - d) / Math.SQRT2;
      const a = Math.max(0, Math.min(1, w + 0.5 - dist));
      const i = (y * n + x) * 4;
      data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = Math.round(a * 255);
    }
  }
  return { width: n, height: n, data };
}

// Registra o padrão no mapa (e de novo sempre que um estilo novo pedir por ele)
export function ensureHatchPattern(map) {
  if (!map || map.__hatchBound) return;
  map.__hatchBound = true;
  const add = () => {
    try { if (!map.hasImage(HATCH_ID)) map.addImage(HATCH_ID, hatchImage(2), { pixelRatio: 2 }); } catch (e) { /* estilo ainda carregando */ }
  };
  map.on('styleimagemissing', (e) => { if (e.id === HATCH_ID) add(); });
  map.on('style.load', add);
  add();
}

// Hachura desenhada num canvas 2D (legenda da prancha exportada)
export function drawHatch(ctx, x, y, w, h, spacing = 5) {
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.strokeStyle = HATCH_COLOR; ctx.lineWidth = Math.max(1, spacing * 0.22);
  for (let k = -h; k < w + h; k += spacing) {
    ctx.beginPath(); ctx.moveTo(x + k, y + h); ctx.lineTo(x + k + h, y); ctx.stroke();
  }
  ctx.restore();
}
