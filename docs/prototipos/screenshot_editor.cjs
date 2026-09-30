const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const files = ['editor_import.html', 'editor_indicators.html', 'editor_geometry.html'];

  for (const file of files) {
    const fileUrl = `file://${path.resolve(process.cwd(), file)}`;
    console.log(`Taking screenshot of ${file}...`);
    await page.goto(fileUrl, { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 1440, height: 900 });
    // Adding a slight delay to ensure fonts/icons are loaded
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `screenshots/${file.replace('.html', '.png')}`, fullPage: true });
  }

  await browser.close();
  console.log('Screenshots completed.');
})();
