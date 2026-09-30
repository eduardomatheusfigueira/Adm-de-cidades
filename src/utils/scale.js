// Escala gráfica: escolhe uma distância "redonda" (1, 2 ou 5 × 10^n metros) que caiba em
// `maxBarPx` e devolve o comprimento exato da barra em pixels (barra = distância / metros-por-pixel).
// MapLibre usa tiles de 512 px: metros por pixel no equador em z0 = 40075016.686 / 512.
export const metersPerPixel = (zoom, lat) => 78271.5168 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);

export function pickScaleDistance(maxBarPx, zoom, lat) {
  const mpp = metersPerPixel(zoom, lat);
  const maxMeters = maxBarPx * mpp;
  const pow = Math.pow(10, Math.floor(Math.log10(maxMeters)));
  const meters = [5, 2, 1].map(m => m * pow).find(v => v <= maxMeters) || pow;
  return { meters, barPx: meters / mpp, mpp };
}
