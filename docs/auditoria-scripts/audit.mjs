// Auditoria em execução real — SisInfo / Adm-de-cidades
// Uso: node audit.mjs <desktop|iphone13|android>
import fs from 'node:fs';
import path from 'node:path';
import { launch, newPage, shot, audit, mapInfo, BASE, SP, sleep, pngSize, PROFILES } from './lib.mjs';

const profile = process.argv[2] || 'desktop';
const isTouch = !!PROFILES[profile].hasTouch;
const R = { profile, steps: [] };
const step = (name, data) => { R.steps.push({ name, ...data }); console.log(`\n== ${name}\n`, JSON.stringify(data, null, 1).slice(0, 3000)); };

const browser = await launch();
const { page, ctx, consoleMsgs, dialogs, stats } = await newPage(browser, profile);
const cdp = await ctx.newCDPSession(page);

async function press(locator, label) {
  try {
    await locator.first().scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
    if (isTouch) await locator.first().tap({ timeout: 5000 });
    else await locator.first().click({ timeout: 5000 });
    return { ok: true };
  } catch (e) {
    // record what's covering it
    let cover = null;
    try {
      const bb = await locator.first().boundingBox();
      if (bb) cover = await page.evaluate(({ x, y }) => { const el = document.elementFromPoint(x, y); return el ? `${el.tagName}.${el.className}`.slice(0, 120) : null; }, { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2 });
      let forced = false;
      if (process.env.FORCE) { try { await locator.first().dispatchEvent('click'); forced = true; } catch {} }
      return { ok: false, label, err: e.message.split('\n')[0].slice(0, 200), bb, cover, forcedClickViaJS: forced };
    } catch { return { ok: false, label, err: e.message.split('\n')[0].slice(0, 200) }; }
  }
}

async function tapAt(x, y) { if (isTouch) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y); }

async function touchDrag(x1, y1, x2, y2, steps = 8) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y: y1 }] });
  for (let i = 1; i <= steps; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x1 + (x2 - x1) * i / steps, y: y1 + (y2 - y1) * i / steps }] });
    await sleep(30);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}
async function previewInfo() {
  return page.evaluate(() => {
    const frame = document.querySelector('.studio-preview-frame');
    if (!frame) return { err: 'no frame' };
    const key = Object.keys(frame).find(k => k.startsWith('__reactFiber$'));
    let f = frame[key]; let pm = null; let legend = null;
    while (f && !pm) {
      let h = f.memoizedState; let guard = 0;
      while (h && guard++ < 400) {
        const v = h.memoizedState;
        if (v && v.current && typeof v.current.getStyle === 'function' && v.current.getContainer && v.current.getContainer().closest('.studio-preview-frame')) pm = v.current;
        if (v && typeof v === 'object' && Array.isArray(v.items) && typeof v.title === 'string') legend = v;
        h = h.next;
      }
      f = f.return;
    }
    if (!pm) return { err: 'preview map not found' };
    const c = pm.getCenter();
    let rendered = null; try { rendered = pm.queryRenderedFeatures({ layers: ['sectors-fill-layer', 'sectors-point-layer'].filter(l => pm.getLayer(l)) }).length; } catch (e) { rendered = 'err ' + e.message; }
    return { zoom: pm.getZoom(), center: [c.lng, c.lat], rendered, fill: pm.getLayer('sectors-fill-layer') ? JSON.stringify(pm.getPaintProperty('sectors-fill-layer', 'fill-color')).slice(0, 300) : null, legend: legend ? { title: legend.title, items: legend.items.map(i => `${i.value}=${i.color}`) } : null, layers: (pm.getStyle()?.layers || []).length };
  });
}
async function mouseDrag(x1, y1, x2, y2) {
  await page.mouse.move(x1, y1); await page.mouse.down();
  for (let i = 1; i <= 8; i++) { await page.mouse.move(x1 + (x2 - x1) * i / 8, y1 + (y2 - y1) * i / 8); await sleep(20); }
  await page.mouse.up();
}

// ---------- 1. Tela inicial ----------
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await sleep(3000);
step('01-inicio', { shot: await shot(page, profile, '01-inicio'), audit: await audit(page),
  header: await page.evaluate(() => { const h = document.querySelector('.app-header'); const n = document.querySelector('.header-nav'); return { headerH: h?.getBoundingClientRect().height, headerScrollW: h?.scrollWidth, headerClientW: h?.clientWidth, navRect: n?.getBoundingClientRect().toJSON(), navItems: [...document.querySelectorAll('.nav-item')].map(b => ({ t: b.textContent.trim(), r: b.getBoundingClientRect().toJSON() })), faLoaded: getComputedStyle(document.querySelector('.nav-item i') || document.body, '::before').content } }) });

// full-page shot for home on mobile
try { await page.screenshot({ path: path.join(SP, 'shots', `${profile}-01b-inicio-full.png`), fullPage: true }); } catch {}

// ---------- 2. Ir para o mapa ----------
const navRes = await press(page.locator('button.nav-item', { hasText: 'Mapa' }), 'nav Mapa');
await sleep(4500);
const mi0 = await mapInfo(page);
step('02-mapa', { navRes, shot: await shot(page, profile, '02-mapa'), audit: await audit(page), mapInfo: { ...mi0, layers: undefined, layerOrder: mi0.layers?.filter(l => /sectors|annotations-fill|annotations-point-layer/.test(l)) },
  navControlCovered: await page.evaluate(() => { const b = document.querySelector('.mapboxgl-ctrl-zoom-in'); if (!b) return 'no zoom-in'; const r = b.getBoundingClientRect(); const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { zoomInRect: r.toJSON(), topElement: el ? `${el.tagName}.${el.className}` : null, covered: !b.contains(el) }; }),
  overlays: await page.evaluate(() => ['.filter-menu', '.visualization-menu', '.city-search-container, .city-search', '.legend', '.annotation-legend', '.north-arrow, .north-arrow-container', '.scale-bar, .scale-bar-container'].map(s => { const e = document.querySelector(s); return e ? { s, r: e.getBoundingClientRect().toJSON() } : { s, missing: true }; })) });

// ---------- 2b. Atributo numérico com 1 município (classes com limiares repetidos) ----------
let r2b = {};
try {
  const before = consoleMsgs.length;
  await press(page.locator('button.visualization-menu-toggle-icon'), 'toggle viz');
  await sleep(500);
  const selects = page.locator('.visualization-menu-content select.visualization-dropdown');
  await selects.nth(1).selectOption('Altitude_Municipio');
  r2b.apply = await press(page.locator('button.apply-visualization-button'), 'Aplicar Visualização');
  await sleep(1500);
  const m = await mapInfo(page);
  r2b.fillColor = m.fillColor;
  r2b.newConsole = consoleMsgs.slice(before);
  r2b.legend = await page.locator('.legend').first().innerText().catch(() => null);
  r2b.shot = await shot(page, profile, '02b-atributo-numerico-1-municipio');
} catch (e) { r2b.err = e.message.split('\n')[0]; }
step('02b-numerico-1-municipio', r2b);
await page.keyboard.press('Escape').catch(() => {});
await tapAt(PROFILES[profile].viewport.width / 2, PROFILES[profile].viewport.height - 20).catch(() => {});
await sleep(300);

// ---------- 3. Menu de dados (FilterMenu) ----------
const fmRes = await press(page.locator('button.filter-menu-toggle-icon'), 'toggle FilterMenu');
await sleep(600);
step('03-menu-dados', { fmRes, shot: await shot(page, profile, '03-menu-dados'), audit: await audit(page),
  panel: await page.evaluate(() => { const c = document.querySelector('.filter-menu-content'); if (!c) return null; const r = c.getBoundingClientRect(); return { r: r.toJSON(), scrollH: c.scrollHeight, clientH: c.clientHeight, overflowY: getComputedStyle(c).overflowY, cls: c.className }; }) });

// 3a. Importar Municípios (CSV de teste com códigos que batem com municipios-geo.json)
let r3a = {};
try {
  const [fc] = await Promise.all([page.waitForEvent('filechooser', { timeout: 8000 }), press(page.locator('button', { hasText: 'Importar Municípios' }), 'Importar Municípios')]);
  r3a.accept = await fc.element().getAttribute('accept').catch(() => null);
  await fc.setFiles(path.join(SP, 'municipios_teste.csv'));
  await sleep(1500);
  r3a.ok = true;
} catch (e) { r3a.err = e.message.split('\n')[0]; }
r3a.dialogs = [...dialogs];
step('03a-importar-municipios', r3a);

// 3b. Importar Geometria (data/municipios-geo.json)
let r3b = {};
try {
  if (!(await page.locator('.filter-menu-content.open').count())) await press(page.locator('button.filter-menu-toggle-icon'), 'reabrir menu');
  await sleep(400);
  const [fc] = await Promise.all([page.waitForEvent('filechooser', { timeout: 8000 }), press(page.locator('button', { hasText: 'Importar Geometria' }), 'Importar Geometria')]);
  await fc.setFiles('/home/user/Adm-de-cidades/data/municipios-geo.json');
  await sleep(1200);
  r3b.modalVisible = await page.locator('.modal-overlay').isVisible();
  r3b.modalShot = await shot(page, profile, '03b-modal-geometria');
  r3b.options = await page.locator('#municipality-code-field option').allTextContents();
  await page.selectOption('#municipality-code-field', 'CD_MUN');
  r3b.importBtn = await press(page.locator('.modal-content button.import-button'), 'Importar (modal)');
  await sleep(2500);
  r3b.ok = true;
} catch (e) { r3b.err = e.message.split('\n')[0]; }
r3b.dialogs = [...dialogs];
const mi1 = await mapInfo(page);
r3b.mapInfo = { ...mi1, layers: undefined };
r3b.shot = await shot(page, profile, '03c-apos-importar');
step('03b-importar-geometria', r3b);

// ---------- 4. Visualização / cores ----------
let r4 = {};
r4.toggle = await press(page.locator('button.visualization-menu-toggle-icon'), 'toggle VisualizationMenu');
await sleep(700);
r4.shotOpen = await shot(page, profile, '04-menu-visualizacao');
r4.audit = await audit(page);
r4.panel = await page.evaluate(() => { const c = document.querySelector('.visualization-menu-content'); if (!c) return null; const r = c.getBoundingClientRect(); return { r: r.toJSON(), scrollH: c.scrollHeight, clientH: c.clientHeight, overflowY: getComputedStyle(c).overflowY, cls: c.className }; });
try {
  const selects = page.locator('.visualization-menu-content select.visualization-dropdown');
  r4.attrOptions = await selects.nth(1).locator('option').allTextContents();
  await selects.nth(1).selectOption('Populacao').catch(async () => { await selects.nth(1).selectOption({ index: 0 }); });
  r4.applyBtn = await press(page.locator('button.apply-visualization-button'), 'Aplicar Visualização');
  await sleep(1500);
} catch (e) { r4.err = e.message.split('\n')[0]; }
const mi2 = await mapInfo(page);
r4.mapInfo = { sectorsFeatures: mi2.sectorsFeatures, geomTypes: mi2.geomTypes, fillColor: mi2.fillColor, zoom: mi2.zoom, center: mi2.center };
r4.legendText = await page.locator('.legend').first().innerText().catch(() => null);
r4.shot = await shot(page, profile, '04b-visualizacao-aplicada');
// 4b: filtro "Apenas Capitais" (CSV usa "True"/"False")
try {
  if (!(await page.locator('.visualization-menu-content.open').count())) await press(page.locator('button.visualization-menu-toggle-icon'), 'reabrir viz');
  await sleep(400);
  await page.locator('.visualization-menu-content select.filter-dropdown').first().selectOption('capital');
  await press(page.locator('button.apply-filters-button'), 'Aplicar Filtros');
  await sleep(1200);
  const m = await mapInfo(page); r4.capitalFilterFeatures = m.sectorsFeatures;
  await page.locator('.visualization-menu-content select.filter-dropdown').first().selectOption('all').catch(() => {});
  await press(page.locator('button.reset-filters-button'), 'Limpar Filtros');
  await sleep(800);
  // restore Populacao visualization
  const selects = page.locator('.visualization-menu-content select.visualization-dropdown');
  await selects.nth(1).selectOption('Populacao').catch(() => {});
  await press(page.locator('button.apply-visualization-button'), 'Aplicar Visualização');
  await sleep(1200);
} catch (e) { r4.filterErr = e.message.split('\n')[0]; }
step('04-visualizacao', r4);

// ---------- 4c. Reenquadramento forçado: mover o mapa e reaplicar visualização ----------
let r4c = {};
try {
  const mc = await page.locator('.map-container canvas.mapboxgl-canvas').boundingBox();
  const c0 = (await mapInfo(page)).center;
  if (isTouch) await touchDrag(mc.x + mc.width * 0.5, mc.y + mc.height * 0.6, mc.x + mc.width * 0.2, mc.y + mc.height * 0.3, 12);
  else await mouseDrag(mc.x + mc.width * 0.5, mc.y + mc.height * 0.6, mc.x + mc.width * 0.2, mc.y + mc.height * 0.3);
  await sleep(1200);
  const c1 = (await mapInfo(page)).center;
  if (!(await page.locator('.visualization-menu-content.open').count())) await press(page.locator('button.visualization-menu-toggle-icon'), 'viz');
  await sleep(400);
  await press(page.locator('button.apply-visualization-button'), 'Aplicar Visualização');
  await sleep(2000);
  const c2 = (await mapInfo(page)).center;
  r4c = { centroInicial: c0, aposArrastar: c1, aposReaplicar: c2, resetou: Math.abs(c2[0] - c0[0]) < 1e-3 && Math.abs(c1[0] - c0[0]) > 1e-3 };
} catch (e) { r4c.err = e.message.split('\n')[0]; }
step('04c-reenquadramento', r4c);

// ---------- 4d. Editar legenda (cor personalizada) ----------
let r4d = {};
try {
  await page.keyboard.press('Escape').catch(() => {});
  r4d.edit = await press(page.locator('.legend button.legend-action-btn', { hasText: 'Editar legenda' }), 'Editar legenda');
  await sleep(400);
  r4d.shotEditor = await shot(page, profile, '04d-editor-legenda');
  const colorIn = page.locator('.legend-editor-row input[type=color]').first();
  await colorIn.evaluate((el) => { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(el, '#00ff00'); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.locator('#legend-title-input').fill('Legenda Personalizada Auditoria');
  r4d.save = await press(page.locator('.legend-editor button.legend-action-btn', { hasText: 'Salvar' }), 'Salvar legenda');
  await sleep(1200);
  r4d.mainFill = (await mapInfo(page)).fillColor;
  r4d.legendText = await page.locator('.legend').first().innerText().catch(() => null);
} catch (e) { r4d.err = e.message.split('\n')[0]; }
step('04d-legenda-personalizada', r4d);

// ---------- 5. Anotações (ponto + medir distância) ----------
let r5 = {};
try {
  // Zoom to a nice extent: fly the map to polygon B via fiber (diagnostic only)
  await press(page.locator('button.filter-menu-toggle-icon'), 'toggle FilterMenu');
  await sleep(500);
  r5.openDraw = await press(page.locator('button.annotation-button'), 'Inserir Informação');
  await sleep(300);
  r5.pointBtn = await press(page.locator('button.draw-tool-btn', { hasText: 'Ponto' }), 'Ponto');
  await sleep(500);
  const mc = await page.locator('.map-container canvas.mapboxgl-canvas').boundingBox();
  r5.mapCanvasBox = mc;
  const cx = mc.x + mc.width * 0.5, cy = mc.y + mc.height * 0.55;
  await tapAt(cx, cy);
  await sleep(800);
  r5.afterPoint = (await mapInfo(page)).annotations;
  r5.toolbarText = await page.locator('.annotation-toolbar').innerText().catch(() => null);
  r5.shotPoint = await shot(page, profile, '05-anotacao-ponto');
  // measure line
  await press(page.locator('button.filter-menu-toggle-icon'), 'toggle FilterMenu');
  await sleep(400);
  if (!(await page.locator('button.draw-tool-btn').count())) await press(page.locator('button.annotation-button'), 'Inserir Informação');
  await sleep(300);
  r5.measureBtn = await press(page.locator('button.draw-tool-btn', { hasText: 'Medir Distância' }), 'Medir Distância');
  await sleep(500);
  await tapAt(mc.x + mc.width * 0.3, mc.y + mc.height * 0.7);
  await sleep(400);
  await tapAt(mc.x + mc.width * 0.6, mc.y + mc.height * 0.75);
  await sleep(400);
  r5.toolbarDuring = await page.locator('.annotation-toolbar').innerText().catch(() => null);
  const zBefore = (await mapInfo(page)).zoom;
  // finalize: desktop dblclick; mobile double-tap
  if (isTouch) { await page.touchscreen.tap(mc.x + mc.width * 0.75, mc.y + mc.height * 0.72); await sleep(60); await page.touchscreen.tap(mc.x + mc.width * 0.75, mc.y + mc.height * 0.72); }
  else await page.mouse.dblclick(mc.x + mc.width * 0.75, mc.y + mc.height * 0.72);
  await sleep(1500);
  const mAfter = await mapInfo(page);
  r5.zoomBeforeAfterFinalize = [zBefore, mAfter.zoom];
  r5.annotationFeaturesAfterLine = mAfter.annotations;
  r5.toolbarAfter = await page.locator('.annotation-toolbar').innerText().catch(() => null);
  r5.annLegendText = await page.locator('.annotation-legend').first().innerText().catch(() => null);
  r5.shotLine = await shot(page, profile, '05b-anotacao-medida');
  // cancel drawing mode
  r5.cancel = await press(page.locator('.status-cancel-btn'), 'Cancelar desenho');
  await sleep(400);
} catch (e) { r5.err = e.message.split('\n')[0]; }
step('05-anotacoes', r5);

// ---------- 6. Exportação HTML (FilterMenu) ----------
let r6 = {};
try {
  r6.hasShowSaveFilePicker = await page.evaluate(() => typeof window.showSaveFilePicker);
  // Force fallback path to observe download (simulates browsers sem File System Access, ex. iOS/Android)
  await page.evaluate(() => { try { delete window.showSaveFilePicker; window.showSaveFilePicker = undefined; } catch {} });
  await press(page.locator('button.filter-menu-toggle-icon'), 'toggle FilterMenu');
  await sleep(400);
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), press(page.locator('button.export-map-button'), 'Exportar Mapa HTML')]);
  const f = path.join(SP, `${profile}${process.env.FORCE ? "-F" : ""}-export.html`);
  await dl.saveAs(f);
  const html = fs.readFileSync(f, 'utf8');
  r6.file = f; r6.bytes = html.length; r6.suggested = dl.suggestedFilename();
  r6.containsToken = html.includes('pk.eyJ1IjoiYXVkaXQiLCJhIjoiYXVkaXQifQ.audit');
  r6.cdn = [...new Set((html.match(/https:\/\/[a-z0-9.\-]+\/[^"' )]+/g) || []).map(u => u.split('/').slice(0, 3).join('/')))];
} catch (e) { r6.err = e.message.split('\n')[0]; }
step('06-export-html', r6);

// ---------- 7. Estúdio de exportação ----------
let r7 = {};
try {
  // close menus by pressing Escape / tapping header
  await page.keyboard.press('Escape').catch(() => {});
  r7.openBtn = await press(page.locator('button[title="Exportar Imagem em Alta Resolução"]'), 'abrir estudio');
  await sleep(4000);
  r7.visible = await page.locator('.image-studio-overlay').isVisible();
  r7.shot = await shot(page, profile, '07-estudio');
  r7.audit = await audit(page);
  r7.layout = await page.evaluate(() => {
    const q = (s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().toJSON() : null; };
    const frame = document.querySelector('.studio-preview-frame');
    const prevCanvas = frame?.querySelector('canvas.mapboxgl-canvas');
    return { sidebar: q('.studio-sidebar'), preview: q('.studio-preview-area'), wrapper: q('.studio-preview-wrapper'), frame: q('.studio-preview-frame'), actions: q('.studio-actions'), exportBtn: q('.studio-export-btn'), pageBar: q('.studio-page-bar'), toolbar: q('.studio-preview-toolbar'),
      toolbarScrollW: document.querySelector('.studio-preview-toolbar')?.scrollWidth,
      previewCanvas: prevCanvas ? { w: prevCanvas.width, h: prevCanvas.height } : null,
      overlayCanvas: (() => { const c = frame?.querySelector('canvas:not(.mapboxgl-canvas)'); return c ? { w: c.width, h: c.height } : null; })(),
      transform: frame?.parentElement?.style.transform, dpr: window.devicePixelRatio };
  });
  r7.previewMap = await previewInfo();
  // Sidebar scroll within 40vh
  r7.sidebarScroll = await page.evaluate(() => { const s = document.querySelector('.studio-sidebar'); return s ? { scrollH: s.scrollHeight, clientH: s.clientHeight } : null; });

  // 7a. Título
  await press(page.locator('.studio-section-title', { hasText: 'Título do Mapa' }), 'abrir secao titulo');
  await sleep(300);
  const tIn = page.locator('.studio-section input.studio-text-input[placeholder="Título"]');
  await tIn.scrollIntoViewIfNeeded().catch(() => {});
  await tIn.fill('Mapa de População — Teste da Auditoria');
  await sleep(500);

  // 7b. Adicionar elemento de texto
  await press(page.locator('.studio-section-title', { hasText: 'Detalhes e Camadas' }), 'abrir detalhes');
  await sleep(300);
  r7.addText = await press(page.locator('button.studio-add-btn', { hasText: 'Texto' }), 'add texto');
  await sleep(500);
  r7.shotAfterAdd = await shot(page, profile, '07b-estudio-elementos');

  // 7c. Mover o título (drag handle) — mouse no desktop, toque real (CDP) no mobile
  const handles = page.locator('.studio-preview-frame > div[title="Clique para selecionar / Arraste para mover"]');
  r7.handleCount = await handles.count();
  const titleHandle = handles.first();
  const pvBeforeDrag = await previewInfo();
  const before = await titleHandle.evaluate(e => ({ left: e.style.left, top: e.style.top }));
  const bb = await titleHandle.boundingBox();
  r7.titleHandleBox = bb;
  if (bb) {
    const sx = bb.x + Math.min(bb.width / 2, 20), sy = bb.y + Math.min(bb.height / 2, 10);
    if (isTouch) await touchDrag(sx, sy, sx + 60, sy + 80); else await mouseDrag(sx, sy, sx + 150, sy + 120);
  }
  await sleep(500);
  const after = await titleHandle.evaluate(e => ({ left: e.style.left, top: e.style.top }));
  const pvAfterDrag = await previewInfo();
  r7.dragTitle = { before, after, moved: before.left !== after.left || before.top !== after.top, method: isTouch ? 'touch (CDP touchStart/Move/End)' : 'mouse', previewCenterBefore: pvBeforeDrag.center, previewCenterAfter: pvAfterDrag.center };
  // pinch/pan inside preview on touch: does the page scroll instead?
  r7.shotAfterDrag = await shot(page, profile, '07c-estudio-apos-arrastar');

  // 7d. Legenda — verificar dados da legenda desenhada
  r7.legendHandleVisible = await handles.nth(3).isVisible().catch(() => null);

  // 7d2. Filtro de Região no estúdio (deveria esconder municípios de outras regiões)
  try {
    await press(page.locator('.studio-section-title', { hasText: 'Visualização e Filtros' }), 'secao viz/filtros');
    await sleep(300);
    const regionSel = page.locator('.studio-section select.studio-select').filter({ has: page.locator('option', { hasText: 'Todas' }) }).first();
    r7.regionOptions = await regionSel.locator('option').allTextContents();
    const pBefore = await previewInfo();
    await regionSel.selectOption('N');
    await sleep(1500);
    const pAfter = await previewInfo();
    r7.studioRegionFilter = { antes: pBefore.rendered, depois: pAfter.rendered, fillDepois: pAfter.fill, legendItems: pAfter.legend };
    await regionSel.selectOption('all');
    await sleep(800);
  } catch (e) { r7.studioRegionFilterErr = e.message.split('\n')[0]; }
  // 7d3. Escala: comparar rótulo do canvas com a distância real
  try {
    const pv = await previewInfo();
    const mpp = 78271.5168 * Math.cos(pv.center[1] * Math.PI / 180) / Math.pow(2, pv.zoom);
    const STEPS = [1,2,5,10,20,50,100,200,500,1000,2000,5000,10000,20000,50000,100000,200000,500000,1000000];
    let best = STEPS[0]; for (const st of STEPS) { const px = st / mpp; if (px >= 200 && px <= 300) { best = st; break; } if (px > 300) { best = st; break; } best = st; }
    const barPx = 400 * 0.85;
    r7.escalaExport = { zoom: pv.zoom, lat: pv.center[1], metrosPorPixel: mpp, rotulo_m: best, larguraBarra_px: barPx, distanciaReal_m: Math.round(barPx * mpp), erroPercentual: Math.round((best / (barPx * mpp) - 1) * 100) };
  } catch (e) { r7.escalaErr = e.message; }

  // 7e. Exportar (HD padrão)
  const exportBtn = page.locator('button.studio-export-btn');
  r7.exportBtnInViewport = await exportBtn.evaluate(e => { const r = e.getBoundingClientRect(); return { r: r.toJSON(), inVp: r.bottom <= window.innerHeight && r.top >= 0 && r.right <= window.innerWidth }; });
  const t0 = Date.now();
  const dlP = page.waitForEvent('download', { timeout: 90000 });
  r7.exportPress = await press(exportBtn, 'Exportar Imagem');
  const progressSamples = [];
  const iv = setInterval(async () => { try { progressSamples.push(await page.locator('.studio-progress, .studio-actions').first().innerText()); } catch {} }, 1500);
  try {
    const dl = await dlP;
    const f = path.join(SP, `${profile}${process.env.FORCE ? "-F" : ""}-${dl.suggestedFilename()}`);
    await dl.saveAs(f);
    r7.download = { file: f, suggested: dl.suggestedFilename(), ms: Date.now() - t0, ...pngSize(f) };
  } catch (e) { r7.downloadErr = e.message.split('\n')[0]; }
  clearInterval(iv);
  r7.progressSamples = [...new Set(progressSamples)].slice(0, 10);
  await sleep(1500);
  r7.shotAfterExport = await shot(page, profile, '07d-estudio-apos-exportar');

  // 7f. Exportar 4K (stress, esp. mobile com DPR alto)
  await press(page.locator('.studio-section-title', { hasText: 'Resolução' }), 'secao resolucao').catch(() => {});
  await sleep(200);
  if (!(await page.locator('button.studio-preset-btn', { hasText: '4K' }).isVisible().catch(() => false))) await press(page.locator('.studio-section-title', { hasText: 'Resolução' }), 'secao resolucao');
  r7.preset4k = await press(page.locator('button.studio-preset-btn', { hasText: '4K' }), '4K');
  await sleep(3000);
  r7.layout4k = await page.evaluate(() => { const frame = document.querySelector('.studio-preview-frame'); const c = frame?.querySelector('canvas.mapboxgl-canvas'); return { frame: frame?.getBoundingClientRect().toJSON(), previewCanvas: c ? { w: c.width, h: c.height, cssW: c.style.width, cssH: c.style.height } : null, transform: frame?.parentElement?.style.transform }; });
  r7.shot4k = await shot(page, profile, '07e-estudio-4k');
  const t1 = Date.now();
  const dlP2 = page.waitForEvent('download', { timeout: 120000 });
  r7.exportPress4k = await press(exportBtn, 'Exportar 4K');
  try {
    const dl = await dlP2;
    const f = path.join(SP, `${profile}${process.env.FORCE ? "-F" : ""}-4k-${dl.suggestedFilename()}`);
    await dl.saveAs(f);
    r7.download4k = { file: f, ms: Date.now() - t1, ...pngSize(f) };
  } catch (e) { r7.download4kErr = e.message.split('\n')[0]; }
  r7.statusAfter4k = await page.locator('.studio-actions').innerText().catch(() => null);
} catch (e) { r7.err = e.message.split('\n')[0]; }
step('07-estudio', r7);

// ---------- 8. Perda de trabalho ao recarregar ----------
let r8 = {};
try {
  await page.locator('button.studio-cancel-btn').click({ timeout: 3000 }).catch(() => {});
  await sleep(500);
  const beforeReload = await mapInfo(page);
  r8.before = { sectors: beforeReload.sectorsFeatures, annotations: beforeReload.annotations };
  let beforeUnloadPrompt = false;
  page.once('dialog', d => { if (d.type() === 'beforeunload') beforeUnloadPrompt = true; });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await sleep(2500);
  await press(page.locator('button.nav-item', { hasText: 'Mapa' }), 'nav Mapa');
  await sleep(4000);
  const afterReload = await mapInfo(page);
  r8.after = { sectors: afterReload.sectorsFeatures, annotations: afterReload.annotations };
  r8.beforeUnloadPrompt = beforeUnloadPrompt;
} catch (e) { r8.err = e.message.split('\n')[0]; }
step('08-recarregar', r8);

R.console = consoleMsgs;
R.dialogs = dialogs;
R.netStats = stats;
fs.writeFileSync(path.join(SP, `result-${profile}${process.env.FORCE ? '-forced' : ''}.json`), JSON.stringify(R, null, 1));
console.log('\nCONSOLE:', consoleMsgs.length, JSON.stringify([...new Set(consoleMsgs)].slice(0, 40), null, 1));
console.log('DIALOGS:', dialogs);
await browser.close();
