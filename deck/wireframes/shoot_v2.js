// Build sipal_v2.html from the shared style and icon parts, then render each phone to its own PNG.
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const D = __dirname;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>SIPal wireframes v2</title>
${fs.readFileSync(path.join(D, "style.part"), "utf8")}</head><body style="flex-wrap:wrap;width:1500px">
${fs.readFileSync(path.join(D, "symbols.part"), "utf8")}
${fs.readFileSync(path.join(D, "v2_body.html"), "utf8")}
</body></html>`;
fs.writeFileSync(path.join(D, "sipal_v2.html"), html);
const NAMES = { a0: "set1_1_weekly_notification", a1: "set1_2_explore_entry", a2: "set1_3_checkin_down_week", a3: "set1_4_checkin_up_week",
                b1: "set2_1_due_reminder", b2: "set2_2_pay_less_this_month", b3: "set2_3_confirmed" };
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1500, height: 1900 }, deviceScaleFactor: 3 });
  await page.goto("file://" + path.join(D, "sipal_v2.html"));
  await page.waitForTimeout(300);
  for (const [id, name] of Object.entries(NAMES)) {
    // overflow check: lowest content bottom vs the screen bottom (home indicator area is 26px)
    const gap = await page.$eval(`#${id} .screen`, s => {
      const sb = s.getBoundingClientRect().bottom; let low = 0;
      s.querySelectorAll("*").forEach(e => { if (!e.classList.contains("home-ind")) { const b = e.getBoundingClientRect().bottom; if (b > low) low = b; } });
      return Math.round(sb - low);
    });
    await (await page.$("#" + id)).screenshot({ path: path.join(D, name + ".png"), omitBackground: true });
    console.log(name, "space left at bottom (px):", gap);
  }
  await browser.close();
})();
