// Render the deck artwork (SVG, four brand colours only) to transparent PNGs.
const { chromium } = require("playwright"), fs = require("fs"), path = require("path");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ deviceScaleFactor: 4 });
  for (const [f, w, h] of [["cover_art", 490, 400], ["ribbon", 1270, 24]]) {
    const svg = fs.readFileSync(path.join(__dirname, f + ".svg"), "utf8");
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${w}" height="${h}" `)}</body></html>`);
    await (await p.$("svg")).screenshot({ path: path.join(__dirname, f + ".png"), omitBackground: true });
  }
  await b.close(); console.log("art rendered");
})();
