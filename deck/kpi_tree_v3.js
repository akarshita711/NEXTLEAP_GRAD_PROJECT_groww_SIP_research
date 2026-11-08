// KPI tree v3 (left to right): business metric -> product metrics -> input metrics.
// Pure metric logic, drawn before any research: no research numbers and no solution names. Every text >= 14pt.
module.exports = function addKpiTreeV3(pres, s, C) {
  const { CARD, CARD2, WHITE, SOFT, DARK, Y, O, BODY } = C;
  const EDGE = "8C84D6";
  const COL = [[0.5, 1.6], [2.53, 1.9], [4.86, 1.95], [7.24, 2.25], [9.9, 2.93]];   // [x, w] per column
  const box = (c, y, h, title, sub, o = {}) => {
    const [x, w] = COL[c];
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: o.fill || CARD },
      line: { color: o.line || EDGE, width: o.lw || 1.25 }, objectName: o.name || "kpi-node" });
    s.addText([{ text: title, options: { bold: true, color: o.tc || WHITE, breakLine: true } }, { text: sub, options: { color: SOFT } }],
      { x: x + 0.06, y, w: w - 0.12, h, fontFace: BODY, fontSize: 14, align: "center", valign: "middle", margin: 0 });
    return { l: x, r: x + w, cy: y + h / 2, y, h, x, w };
  };
  const ln = (x1, y1, x2, y2) => s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color: EDGE, width: 1.25 } });
  const op = (cx, cy, sym) => {
    const d = 0.3;
    s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: Y }, line: { color: Y }, objectName: "op" });
    s.addText(sym, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fontFace: "Arial", fontSize: 15, bold: true, color: DARK, align: "center", valign: "middle", margin: 0 });
  };
  // parent -> children elbow connector, with the operator drawn on the bus between each pair of siblings
  const link = (p, kids, sym) => {
    const xm = (p.r + kids[0].l) / 2;
    ln(p.r, p.cy, xm, p.cy);
    ln(xm, Math.min(p.cy, ...kids.map(k => k.cy)), xm, Math.max(p.cy, ...kids.map(k => k.cy)));
    kids.forEach(k => ln(xm, k.cy, k.l, k.cy));
    for (let i = 0; i < kids.length - 1; i++) op(xm, (kids[i].y + kids[i].h + kids[i + 1].y) / 2, sym);
  };
  const badge = (b, letter) => {
    const d = 0.36;
    s.addShape(pres.shapes.OVAL, { x: b.x + b.w - d * 0.6, y: b.y - d * 0.45, w: d, h: d, fill: { color: Y }, line: { color: DARK, width: 1 }, objectName: "pick-" + letter });
    s.addText(letter, { x: b.x + b.w - d * 0.6, y: b.y - d * 0.45, w: d, h: d, fontFace: "Arial", fontSize: 15, bold: true, color: DARK, align: "center", valign: "middle", margin: 0 });
  };

  // column headers
  ["Business metric", "Definition", "Product outcomes", "Monthly product metrics", "Input metrics"].forEach((t, i) =>
    s.addText(t, { x: COL[i][0], y: 1.36, w: COL[i][1], h: 0.32, fontFace: BODY, fontSize: 14, bold: true, color: SOFT, align: "center", valign: "middle", margin: 0 }));

  // input metrics (column 5): three pairs
  const H = 0.6, G = 0.22, Y0 = 1.78;
  const ey = i => Y0 + i * (H + G);
  const E = [
    box(4, ey(0), H, "Autopay active rate", "working autopay ÷ SIPs due"),
    box(4, ey(1), H, "First-try debit success", "successful debits ÷ debits tried", { line: Y, lw: 3, name: "metric-debit-success" }),
    box(4, ey(2), H, "Stop-intent rate", "opened stop or cancel ÷ SIPs due"),
    box(4, ey(3), H, "Stop-to-adjust rate", "adjusted ÷ opened stop or cancel", { line: Y, lw: 3, name: "metric-stop-to-adjust" }),
    box(4, ey(4), H, "Debit failure rate", "failed debits ÷ SIPs due"),
    box(4, ey(5), H, "Fix rate", "paid within 7 days ÷ failed"),
  ];
  // monthly product metrics (column 4), each centred on its pair
  const mid = (a, b) => (a.y + b.y + b.h) / 2 - H / 2;
  const D = [
    box(3, mid(E[0], E[1]), H, "Paid on time", "paid as planned ÷ due", { line: O, lw: 2.5 }),
    box(3, mid(E[2], E[3]), H, "Adjusted, not stopped", "skip, lower, move ÷ due", { line: O, lw: 2.5 }),
    box(3, mid(E[4], E[5]), H, "Recovered after failing", "paid within 7 days ÷ due"),
  ];
  link(D[0], [E[0], E[1]], "×"); link(D[1], [E[2], E[3]], "×"); link(D[2], [E[4], E[5]], "×");
  // product outcomes (column 3)
  const C2 = box(2, D[1].cy - 0.4, 0.8, "Monthly continuation", "multiplied over months 2-12", { line: O, lw: 2.5 });
  const C1 = box(2, D[0].cy - 0.4, 0.8, "First instalment paid", "first debit worked");
  link(C2, D, "+");
  // definition (column 2): active at month 12 = first instalment paid x monthly continuation (months 2-12)
  const B1 = box(1, (C1.cy + C2.cy) / 2 - 0.4, 0.8, "Active at month 12", "paid in the last 30 days");
  const B2 = box(1, D[2].y, H, "Started a first SIP", "first-time investors");
  link(B1, [C1, C2], "×");
  // business metric (column 1) = B1 / B2
  const A = box(0, (B1.cy + B2.cy) / 2 - 0.45, 0.9, "12-month active SIP rate", "first-time investors", { line: Y, lw: 3, fill: CARD2, name: "north-star" });
  link(A, [B1, B2], "÷");

  // the pick
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 6.62, w: 12.33, h: 0.66, rectRadius: 0.1, fill: { color: CARD2 }, line: { color: Y, width: 2 }, objectName: "pick" });
  s.addText([
    { text: "Steady SIP continuity can be increased by ", options: { bold: true } },
    { text: "the first-try debit success rate ", options: { bold: true, color: Y } }, { text: "and ", options: { bold: true } },
    { text: "the stop-to-adjust rate.", options: { bold: true, color: Y } }],
    { x: 0.7, y: 6.62, w: 11.93, h: 0.66, fontFace: BODY, fontSize: 17, color: WHITE, valign: "middle", margin: 0 });
  s.addNotes(
    "Business metric: 12-month active SIP rate = first-timers active at month 12 (at least one successful instalment in the last 30 days) / first-timers who started a first SIP. " +
    "Active at month 12 = first-timers whose first instalment was paid x the monthly continuation rate, multiplied over months 2 to 12. " +
    "Monthly continuation rate = paid on time + adjusted instead of stopped + recovered after a failed debit (each as a share of SIPs due that month; the three are mutually exclusive). " +
    "Paid on time = autopay active rate x first-try debit success. Adjusted, not stopped = stop-intent rate x stop-to-adjust rate (skip, lower amount or new date instead of cancelling). Recovered = debit failure rate x fix rate within 7 days. " +
    "Why these two: first-try debit success touches every instalment every month and keeps money flowing without the investor having to act; stop-to-adjust is the one point where an investor actively decides to leave, and turning a stop into a smaller step keeps the SIP alive. Both are moments the app controls.");
};
