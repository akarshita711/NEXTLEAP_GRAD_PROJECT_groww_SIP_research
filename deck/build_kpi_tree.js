// KPI tree slide for "12-month SIP continuation for first-time investors" (deck style; every text >= 14pt).
// Evidence numbers come from kpi_numbers.json, computed from the engine outputs by kpi_numbers.py.
const pptxgen = require("pptxgenjs");
const N = require("./kpi_numbers.json");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = ""; pres.company = "";
pres.title = "KPI tree: 12-month SIP continuation for first-time investors";

const BG = "140F3D", CARD = "251D70", CARD2 = "33288F", WHITE = "FFFFFF", SOFT = "DAD5FF", EDGE = "8C84D6", DARK = "140F3D";
const Y = "F0E442", O = "FFB000", S = "56B4E9", G = "3DDBB0", P = "F08DC0";
const HEAD = "Arial", BODY = "Calibri";

pres.defineSlideMaster({
  title: "CONTENT", background: { color: BG },
  objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.22, w: 12.33, h: 1.0, fontFace: HEAD, fontSize: 26, bold: true, color: WHITE, valign: "middle", margin: 0 }, text: "" } }],
});
const s = pres.addSlide({ masterName: "CONTENT" });
s.addShape(pres.shapes.OVAL, { x: -2.6, y: -2.9, w: 4.6, h: 4.6, fill: { color: P, transparency: 72 }, line: { color: P, transparency: 100 }, objectName: "glow-1" });
s.addText("KPI tree: continuation rises most when a moment of doubt gets a trusted, clear answer in the app instead of ending in a stop", { placeholder: "title" });

// ---------- columns ----------
const COL = { A: [0.35, 1.7], B: [2.4, 1.9], C: [4.85, 2.25], D: [7.55, 2.45], E: [10.45, 2.5] };
const heads = [["A", "North star"], ["B", "Product outcomes"], ["C", "Where investors are lost"], ["D", "User behaviours"], ["E", "Product levers"]];
heads.forEach(([c, t]) => s.addText(t, { x: COL[c][0], y: 1.28, w: COL[c][1], h: 0.32, fontFace: BODY, fontSize: 14, bold: true, color: SOFT, margin: 0, isTextBox: true }));

// ---------- nodes: id -> [col, centreY, height, name, evidence, style] ----------
const pct = n => `${n}%`;
const NODES = {
  ns:     ["A", 3.2, 1.3, "12-month active SIP rate", "first-time investors", "north"],
  act:    ["B", 2.12, 0.86, "First instalment succeeds", "autopay + first debit", "plain"],
  stay:   ["B", 4.45, 0.62, "Stays active, months 1-12", "", "path"],
  breaks: ["C", 2.95, 0.6, "Lost: SIP breaks", `${pct(N.S1)} of stated reasons`, "plain"],
  stops:  ["C", 4.45, 0.6, "Lost: investor stops", `${pct(N.S2a + N.S2b + N.S2c)} of stated reasons`, "path"],
  drift:  ["C", 6.06, 0.6, "Lost: silent drift", "9 of 18 did nothing", "plain"],
  back:   ["C", 6.8, 0.5, "Won back: restarts", "", "plain"],
  fail:   ["D", 2.62, 0.6, "Instalment fails", "3 of 18 missed one", "plain"],
  unfix:  ["D", 3.3, 0.6, "Not fixed in 7 days", "", "plain"],
  doubt:  ["D", 4.0, 0.6, "Doubt moments", "9 of 18 surveyed had one", "plain"],
  dstop:  ["D", 4.78, 0.6, "Doubt ends in a stop", `${pct(N.S2b)}: understanding gap`, "path"],
  idle:   ["D", 5.72, 0.6, "No app open in 60 days", "not seen in public posts", "plain"],
  unseen: ["D", 6.4, 0.6, "Lapse goes unnoticed", "", "plain"],
  alert:  ["E", 3.3, 0.6, "Alert seen and fixed", `${pct(N.O1_drop)} of drop-off needs`, "plain"],
  under:  ["E", 4.1, 0.6, "Understands the numbers", `${pct(N.O3_fy)} of first-year needs`, "path"],
  answer: ["E", 4.78, 0.6, "Gets a trusted answer in-app", `${pct(N.O4_fy)} of first-year needs`, "path"],
  flex:   ["E", 5.46, 0.6, "Can pause or reduce", `${pct(N.O2_drop)} of drop-off needs`, "plain"],
};
const geo = id => { const [c, cy, h] = NODES[id]; const [x, w] = COL[c]; return { x, w, cy, h, y: cy - h / 2 }; };
function node(id) {
  const [, , , name, ev, style] = NODES[id], g = geo(id);
  const fill = style === "north" ? CARD2 : style === "path" ? CARD2 : CARD;
  const line = style === "north" ? { color: Y, width: 2.5 } : style === "path" ? { color: O, width: 2.5 } : { color: EDGE, width: 1 };
  const runs = ev ? [{ text: name, options: { bold: true, breakLine: true } }, { text: ev, options: { color: style === "path" ? O : Y, fontSize: 14 } }] : [{ text: name, options: { bold: true } }];
  s.addText(runs, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x: g.x, y: g.y, w: g.w, h: g.h, fill: { color: fill }, line, fontFace: BODY, fontSize: style === "north" ? 16 : 14,
    color: WHITE, align: style === "north" ? "center" : "left", valign: "middle", margin: style === "north" ? 6 : [2, 6, 2, 6], objectName: "node-" + id });
}
// ---------- connectors ----------
const seg = (x1, y1, x2, y2, color, width) => {
  const x = Math.min(x1, x2), y = Math.min(y1, y2), w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
  s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color, width }, objectName: "edge" });
};
function elbow(from, to, hot) {
  const a = geo(from), b = geo(to), x1 = a.x + a.w, xm = x1 + (b.x - x1) / 2, x2 = b.x, color = hot ? O : EDGE, width = hot ? 2.25 : 1.25;
  seg(x1, a.cy, xm, a.cy, color, width); if (Math.abs(a.cy - b.cy) > 0.001) seg(xm, a.cy, xm, b.cy, color, width); seg(xm, b.cy, x2, b.cy, color, width);
  return xm;
}
function op(x, y, sym, hot) {
  s.addText(sym, { shape: pres.shapes.OVAL, x: x - 0.19, y: y - 0.19, w: 0.38, h: 0.38, fill: { color: BG }, line: { color: hot ? O : EDGE, width: 1.5 },
    fontFace: HEAD, fontSize: 14, bold: true, color: hot ? O : WHITE, align: "center", valign: "middle", margin: 0, objectName: "op" });
}
const OPS = [];
let xm = 0;
elbow("ns", "act", false); xm = elbow("ns", "stay", true); OPS.push([xm, geo("ns").cy, "×", true]);
// Stays active = 100% - losses + won back (sign chips sit on each child's connector)
[["breaks", "−", false], ["stops", "−", true], ["drift", "−", false], ["back", "+", false]].forEach(([id, sym, hot]) => { elbow("stay", id, hot); OPS.push([geo(id).x - 0.24, geo(id).cy, sym, hot]); });
// each loss = one behaviour x another
xm = elbow("breaks", "fail", false); elbow("breaks", "unfix", false); OPS.push([xm, geo("breaks").cy, "×", false]);
xm = elbow("stops", "doubt", false); elbow("stops", "dstop", true); OPS.push([xm, geo("stops").cy, "×", true]);
xm = elbow("drift", "idle", false); elbow("drift", "unseen", false); OPS.push([xm, geo("drift").cy, "×", false]);
// levers that lower a behaviour
elbow("unfix", "alert", false);
elbow("dstop", "under", true); elbow("dstop", "answer", true); elbow("dstop", "flex", false);
Object.keys(NODES).forEach(node);
OPS.forEach(([x, y, sym, hot]) => op(x, y, sym, hot));

// rank badges on the opportunity nodes (1 = highest potential)
[["under", 1, O], ["answer", 1, O], ["alert", 2, S], ["flex", 3, P], ["drift", 4, G]].forEach(([id, n, c]) => {
  const g = geo(id);
  s.addText(String(n), { shape: pres.shapes.OVAL, x: g.x + g.w - 0.2, y: g.y - 0.17, w: 0.34, h: 0.34, fill: { color: c }, line: { color: c }, fontFace: HEAD, fontSize: 14, bold: true, color: DARK, align: "center", valign: "middle", margin: 0, objectName: "rank-" + id });
});
s.addText([{ text: "Orange", options: { bold: true, color: O } }, { text: " = highest-potential path, the MVP target  |  numbers = opportunity rank  |  " },
  { text: `evidence: discovery engine (${N.stated} stated drop-off reasons) and survey n=18`, options: { color: SOFT } }],
  { x: 0.35, y: 7.1, w: 12.6, h: 0.3, fontFace: BODY, fontSize: 14, color: WHITE, margin: 0, isTextBox: true });

s.addNotes(`12-month active SIP rate = first instalment succeeds x stays active in months 1-12. Stays active = 100% minus investors lost to a broken SIP, to stopping, and to silent drift, plus those won back. Each loss = a user behaviour x a second behaviour. Shares are of the ${N.stated} drop-off signals that state a reason (engine, prompt v3). Ranking: 1 a trusted answer and understanding at the doubt moment (understanding gap is the largest stated reason at ${N.S2b}%; ${N.O4_fy}% of first-year needs ask for trusted help and ${N.O3_fy}% for explanation; AI fits); 2 failed-instalment recovery (${N.S1}% of stated reasons, deterministic fix); 3 a middle path (pause or reduce, ${N.O2_drop}% of drop-off needs); 4 silent drift (size unknown, invisible in public text; 9 of 18 surveyed did nothing after doubt). Activation is not ranked: public posts say little about it.`);
pres.writeFile({ fileName: "KPI_tree.pptx" }).then(f => console.log("written", f));
