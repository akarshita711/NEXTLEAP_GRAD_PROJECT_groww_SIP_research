// Render the deck artwork (SVG, four brand colours only) to transparent PNGs.
const { chromium } = require("playwright"), fs = require("fs"), path = require("path");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ deviceScaleFactor: 3 });
  for (const [f, w, h] of [["cover_art", 490, 400], ["ribbon", 1270, 24], ["icon_fall", 120, 80], ["icon_rise", 120, 80], ["wm_fall", 1300, 560], ["wm_rise", 1300, 560], ["wm_risefall", 1300, 560], ["wm_sprout", 120, 120]]) {
    const svg = fs.readFileSync(path.join(__dirname, f + ".svg"), "utf8");
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${w}" height="${h}" `)}</body></html>`);
    await (await p.$("svg")).screenshot({ path: path.join(__dirname, f + ".png"), omitBackground: true });
  }
  await b.close(); console.log("art rendered");
})();
