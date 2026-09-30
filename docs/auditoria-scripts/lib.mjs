import { chromium } from '/home/user/Adm-de-cidades/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

export const SP = '/tmp/claude-0/-home-user-Adm-de-cidades/0b9e7e8e-1caa-5b32-98ce-d1c315df912a/scratchpad';
export const SHOTS = path.join(SP, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });
export const BASE = 'http://localhost:5199';

const STUB_STYLE = JSON.stringify({
  version: 8, name: 'stub', sources: {},
  layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#dfe7ef' } }],
  glyphs: 'http://localhost:5199/__glyphs/{fontstack}/{range}.pbf',
});
const MAPBOX_CSS = fs.readFileSync('/home/user/Adm-de-cidades/node_modules/mapbox-gl/dist/mapbox-gl.css');

export async function launch() {
  return chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
  });
}

export const PROFILES = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  iphone13: {
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  },
  android: {
    viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-A125F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  },
};

export async function newPage(browser, profileName, log) {
  const ctx = await browser.newContext({ ...PROFILES[profileName], acceptDownloads: true, locale: 'pt-BR' });
  const page = await ctx.newPage();
  const stats = { styleReq: 0, blocked: 0 };
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (url.includes('/styles/v1/')) {
      stats.styleReq++;
      const sid = (url.match(/styles\/v1\/([^?]+)/) || [])[1] || 'x';
      const body = STUB_STYLE.replace('{range}.pbf', '{range}.pbf?s=' + encodeURIComponent(sid)).replace('"name":"stub"', '"name":"stub-' + sid + '"');
      return route.fulfill({ status: 200, contentType: 'application/json', body, headers: { 'access-control-allow-origin': '*' } });
    }
    if (url.includes('mapbox-gl.css')) return route.fulfill({ status: 200, contentType: 'text/css', body: MAPBOX_CSS });
    if (/fonts\.(googleapis|gstatic)\.com/.test(url)) return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
    if (url.includes('/__glyphs/')) return route.fulfill({ status: 200, contentType: 'application/x-protobuf', body: Buffer.from([0x0a, 0x03, 0x0a, 0x01, 0x78]), headers: { 'access-control-allow-origin': '*' } });
    if (/mapbox\.com/.test(url)) { stats.blocked++; return route.fulfill({ status: 204, body: '', headers: { 'access-control-allow-origin': '*' } }); }
    if (url.startsWith(BASE) || url.startsWith('data:') || url.startsWith('blob:')) return route.continue();
    stats.blocked++;
    return route.fulfill({ status: 204, body: '' });
  });
  const consoleMsgs = [];
  page.on('console', async (m) => {
    if (!['error', 'warning'].includes(m.type())) return;
    let extra = '';
    try { if (m.text() === 'Error' && m.args()[0]) extra = ' :: ' + String(await m.args()[0].evaluate(e => e && (e.message || String(e)))).slice(0, 200); } catch {}
    consoleMsgs.push(`[${m.type()}] ${m.text().slice(0, 400)}${extra}`);
  });
  page.on('pageerror', (e) => consoleMsgs.push(`[pageerror] ${String(e.message).slice(0, 400)}`));
  const dialogs = [];
  page.on('dialog', async (d) => { dialogs.push(`${d.type()}: ${d.message().slice(0, 300)}`); try { if (d.type() === 'prompt') await d.accept(d.defaultValue()); else await d.accept(); } catch {} });
  return { ctx, page, consoleMsgs, dialogs, stats };
}

export async function shot(page, profile, name) {
  const p = path.join(SHOTS, `${profile}${process.env.FORCE ? '-F' : ''}-${name}.png`);
  await page.screenshot({ path: p });
  return p;
}

// Measure horizontal overflow and small tap targets
export async function audit(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const scrollW = document.documentElement.scrollWidth;
    const bodyScrollW = document.body.scrollWidth;
    const small = [];
    const offscreen = [];
    const els = [...document.querySelectorAll('button, a, [role=button], input[type=checkbox], input[type=color], input[type=range], select, input[type=text], input[type=number]')];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none') continue;
      // is it actually visible in an ancestor chain?
      let hidden = false; let a = el;
      while (a) { const s = getComputedStyle(a); if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') { hidden = true; break; } a = a.parentElement; }
      if (hidden) continue;
      const label = (el.getAttribute('title') || el.getAttribute('aria-label') || el.textContent || el.className || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40);
      const inViewport = r.right > 0 && r.bottom > 0 && r.left < vw && r.top < window.innerHeight;
      if (!inViewport) { offscreen.push(`${el.tagName.toLowerCase()} "${label}" @(${Math.round(r.left)},${Math.round(r.top)})`); continue; }
      if (r.width < 44 || r.height < 44) small.push(`${el.tagName.toLowerCase()} "${label}" ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
    return { vw, vh: window.innerHeight, scrollW, bodyScrollW, hOverflow: scrollW > vw, small, offscreen };
  });
}

// Access the main mapbox map instance via React fiber (read-only diagnostics)
export async function mapInfo(page, which = 'main') {
  return page.evaluate((which) => {
    const container = document.querySelector('.map-container');
    if (!container) return { err: 'no .map-container' };
    const key = Object.keys(container).find(k => k.startsWith('__reactFiber$'));
    let f = container[key];
    let ctxVal = null;
    while (f) {
      const v = f.memoizedProps?.value;
      if (v && v.map && 'mapLoaded' in v && 'flyToCity' in v) { ctxVal = v; break; }
      f = f.return;
    }
    if (!ctxVal) return { err: 'MapContext not found' };
    const m = ctxVal.map.current;
    if (!m) return { err: 'map null', mapLoaded: ctxVal.mapLoaded };
    const src = m.getSource('sectors');
    const data = src?._data;
    const feats = data?.features || [];
    const types = {};
    feats.forEach(ft => { types[ft.geometry?.type] = (types[ft.geometry?.type] || 0) + 1; });
    const c = m.getCenter();
    const canvas = m.getCanvas();
    return {
      mapLoaded: ctxVal.mapLoaded, zoom: m.getZoom(), center: [c.lng, c.lat],
      sectorsFeatures: feats.length, geomTypes: types,
      layers: (m.getStyle()?.layers || []).map(l => l.id),
      fillColor: m.getLayer('sectors-fill-layer') ? JSON.stringify(m.getPaintProperty('sectors-fill-layer', 'fill-color')).slice(0, 300) : null,
      canvas: { w: canvas.width, h: canvas.height, cssW: canvas.clientWidth, cssH: canvas.clientHeight },
      annotations: m.getSource('annotations-source')?._data?.features?.length ?? null,
    };
  }, which);
}

export function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.slice(1, 4).toString() === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), bytes: b.length, type: 'png' };
  // JPEG: scan SOF
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xFF) { i++; continue; }
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (marker >= 0xC0 && marker <= 0xC3) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7), bytes: b.length, type: 'jpeg' };
    i += 2 + len;
  }
  return { bytes: b.length, type: 'unknown' };
}

export const sleep = (ms) => new Promise(r => setTimeout(r, ms));
