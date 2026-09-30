#!/usr/bin/env node
// Teste de fumaça do fluxo do aluno, no navegador de verdade (Playwright + Chromium):
// abrir o app → Mapa → juntar uma tabela → legenda com "Sem dados" → Estúdio → exportar PNG →
// recarregar e retomar o trabalho salvo. Roda no computador (1440 px) e no celular (390 px).
//
// Uso: npm run build && npm run smoke
//   CHROMIUM_PATH=/caminho/do/chromium  usa um Chromium já instalado (senão, o do Playwright)
//
// Os mapas base e as fontes vêm de servidores externos; aqui eles são substituídos por
// respostas vazias, para o teste não depender da rede (o app cai no fundo liso).
import { chromium, devices } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const CSV = path.join(ROOT, 'tests', 'fixtures', 'sp-populacao.csv');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.csv': 'text/csv', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff' };

// Servidor estático do dist/ (SPA: rotas desconhecidas → index.html)
async function serve() {
  const server = createServer(async (req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(DIST, url);
    if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
    try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); }
    catch { file = path.join(DIST, 'index.html'); }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}

const falhas = [];
const ok = (cond, msg) => { if (cond) console.log(`  ✓ ${msg}`); else { console.log(`  ✗ ${msg}`); falhas.push(msg); } };

async function fluxo(browser, base, nome, contextOpts) {
  console.log(`\n${nome}`);
  const ctx = await browser.newContext({ ...contextOpts, acceptDownloads: true });
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', e => erros.push(e.message));
  page.on('dialog', d => d.accept());
  await page.route('**/*', r => {
    const u = r.request().url();
    if (u.startsWith(base) || u.startsWith('data:') || u.startsWith('blob:')) return r.continue();
    return r.fulfill({ status: 204, body: '' });
  });

  await page.goto(base, { waitUntil: 'load' });
  // Navegação: cabeçalho no computador, barra de abas embaixo no celular
  await page.locator('header nav button, header nav a, .mobile-tabbar button').filter({ hasText: /^Mapa$/ }).locator('visible=true').first().click();
  await page.waitForSelector('.maplibregl-canvas', { timeout: 20000 });
  ok(true, 'mapa aberto');

  // No celular o painel começa recolhido (folha que sobe de baixo)
  const abrirPainel = page.locator('.mapa-abrir-painel');
  if (await abrirPainel.isVisible().catch(() => false)) await abrirPainel.click();
  await page.locator('.painel-juntar').click();
  await page.locator('.data-wizard input[type=file]').first().setInputFiles(CSV);
  await page.getByRole('button', { name: /Juntar ao mapa/ }).click();
  await page.getByText(/linhas encontradas/).first().waitFor({ timeout: 20000 });
  const relatorio = await page.locator('.data-wizard-body').innerText();
  ok(/80 de 80 linhas encontradas/.test(relatorio), 'tabela juntada (80 de 80 municípios)');
  await page.getByRole('button', { name: /Ver no mapa/ }).click();

  const legenda = page.locator('.legend-color-sem-dados').first();
  await legenda.waitFor({ state: 'attached', timeout: 20000 }).catch(() => {});
  ok(await legenda.count() > 0, 'legenda com o item "Sem dados" hachurado');

  await page.getByRole('button', { name: 'Exportar imagem' }).first().click();
  await page.waitForSelector('.studio-export-btn', { timeout: 20000 });
  await page.waitForTimeout(2500);
  // No computador o download é direto; no celular aparece a imagem com "Compartilhar / Baixar"
  const baixou = page.waitForEvent('download', { timeout: 90000 });
  await page.locator('.studio-export-btn').click();
  if (contextOpts.isMobile) {
    const baixar = page.getByRole('button', { name: /^Baixar$/ });
    await baixar.waitFor({ timeout: 90000 });
    ok(true, 'imagem pronta com "Compartilhar / Baixar"');
    await baixar.click();
  }
  const download = await baixou;
  const png = await readFile(await download.path());
  ok(png.length > 30000 && png.subarray(1, 4).toString() === 'PNG', `PNG exportado (${Math.round(png.length / 1024)} kB)`);
  await page.keyboard.press('Escape').catch(() => {});

  // Salvamento automático: recarregar e retomar
  await page.waitForTimeout(2500);
  await page.reload({ waitUntil: 'load' });
  const retomar = page.getByRole('button', { name: /Retomar|Continuar/ }).first();
  await retomar.waitFor({ timeout: 10000 }).catch(() => {});
  ok(await retomar.count() > 0, 'trabalho salvo oferecido ao recarregar');

  ok(erros.length === 0, `sem erros de JavaScript${erros.length ? `: ${erros[0].slice(0, 160)}` : ''}`);
  await ctx.close();
}

const { server, base } = await serve();
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});
try {
  await fluxo(browser, base, 'Computador (1440 × 900)', { viewport: { width: 1440, height: 900 } });
  await fluxo(browser, base, 'Celular (iPhone 13, 390 px)', { ...devices['iPhone 13'] });
} catch (e) {
  falhas.push(e.message.split('\n')[0]);
  console.log(`  ✗ ${e.message.split('\n')[0]}`);
} finally {
  await browser.close();
  server.close();
}
console.log(falhas.length ? `\n${falhas.length} falha(s)` : '\nTudo certo');
process.exit(falhas.length ? 1 : 0);
