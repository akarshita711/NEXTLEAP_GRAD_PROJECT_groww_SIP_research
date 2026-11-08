// Render each phone in sipal.html to a transparent PNG for the deck.
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 960 }, deviceScaleFactor: 3 });
  await page.goto("file://" + path.join(__dirname, "sipal.html"));
  await page.waitForTimeout(300);
  for (const id of ["s0", "s1", "s2"]) {
    const el = await page.$("#" + id);
    await el.screenshot({ path: path.join(__dirname, `sipal_${id}.png`), omitBackground: true });
    // report overflow inside the screen, if any
    const over = await page.$eval(`#${id} .screen`, s => s.scrollHeight - s.clientHeight);
    console.log(id, "overflow px:", over);
  }
  await browser.close();
})();
