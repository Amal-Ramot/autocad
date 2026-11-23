// Renders each .shot in mockups.html to images/<id>.png
// Usage: node mockups/render.js
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1.5, viewport: { width: 1100, height: 900 } });
  await page.goto('file://' + path.join(__dirname, 'mockups.html'));
  const ids = await page.$$eval('.shot', els => els.map(e => e.id));
  for (const id of ids) {
    const out = path.join(__dirname, '..', 'images', id + '.png');
    await page.locator('[id="' + id + '"]').screenshot({ path: out });
    console.log('wrote', out);
  }
  await browser.close();
})();
