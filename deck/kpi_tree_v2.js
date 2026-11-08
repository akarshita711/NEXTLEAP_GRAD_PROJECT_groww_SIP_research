// KPI tree v2 (top-down), aligned to the validated hypothesis and the two SIPal flows.
// Rate = active / started (÷); active = sum of four groups (+); each kept group = faced x kept rate x still active (x);
// each kept rate = product of the SIPal levers (x). Every text >= 14pt.
module.exports = function addKpiTreeV2(pres, s, C, N) {
  const { CARD, CARD2, WHITE, SOFT, DARK, Y, O, S, G, P, BODY } = C;
  const EDGE = "8C84D6";
  const box = (x, y, w, h, title, sub, o = {}) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: o.fill || CARD },
      line: { color: o.line || EDGE, width: o.lw || 1.25, dashType: o.dash ? "dash" : "solid" }, objectName: o.name || "kpi-node" });
    s.addText([{ text: title, options: { bold: true, color: o.tc || WHITE, breakLine: true } }, { text: sub, options: { color: o.sc || SOFT } }],
      { x: x + 0.05, y, w: w - 0.1, h, fontFace: BODY, fontSize: o.fs || 14, align: "center", valign: "middle", margin: 0 });
    return { cx: x + w / 2, top: y, bot: y + h };
  };
  const line = (x1, y1, x2, y2) => s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color: EDGE, width: 1.25 } });
  const tree = (p, kids, busY) => { line(p.cx, p.bot, p.cx, busY); line(Math.min(...kids.map(k => k.cx)), busY, Math.max(...kids.map(k => k.cx)), busY); kids.forEach(k => line(k.cx, busY, k.cx, k.top)); };
  const op = (cx, cy, sym) => {
    const d = 0.3;
    s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: Y }, line: { color: Y }, objectName: "op-" + sym });
    s.addText(sym, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fontFace: "Arial", fontSize: 15, bold: true, color: DARK, align: "center", valign: "middle", margin: 0 });
  };
  const pct = (a, b) => Math.round(100 * a / b);

  // Row A: north star
  const A = box(4.8, 1.38, 4.6, 0.6, "12-month active SIP rate", "North star: the brief's goal", { line: Y, lw: 3, fill: CARD2, name: "north-star" });
  // Row B: rate = active / started
  const yB = 2.14, hB = 0.74;
  const B1 = box(3.4, yB, 3.2, hB, "First-timers active at month 12", "1+ instalment in the last 30 days", { name: "active-m12" });
  const B2 = box(7.6, yB, 3.2, hB, "First-timers who started a SIP", "about 2-3 million a year (estimate)", { name: "started" });
  tree(A, [B1, B2], 2.06); op(7.1, yB + hB / 2, "÷");
  // Row C: active = never at risk + kept after missed SIP + kept after low returns + other
  const yC = 3.16, hC = 0.78;
  const missed = N.S1 + N.S2a;   // missed or failed SIPs + money pressure or life events
  const C1 = box(0.5, yC, 1.42, hC, "Never at risk", "still active", { name: "never-at-risk" });
  const C2 = box(2.25, yC, 2.44, hC, "Kept after a missed SIP", `${missed}% of drop reasons`, { line: O, lw: 3, sc: O, name: "kept-missed" });
  const C3 = box(8.64, yC, 2.44, hC, "Kept after low returns", `${N.S2b}% of drop reasons`, { line: O, lw: 3, sc: O, name: "kept-lowret" });
  const C4 = box(11.41, yC, 1.42, hC, "Other moments", `${N.S2c}%, out of scope`, { dash: true, name: "other-moments" });
  tree(B1, [C1, C2, C3, C4], 3.02);
  [2.085, 6.665, 11.245].forEach(x => op(x, yC + hC / 2, "+"));
  // Rows D and E: per moment, faced x kept rate x still active; kept rate = product of SIPal levers
  const XS = [[0.5, 2.58, 4.66], [6.89, 8.97, 11.05]], W = 1.78, yD = 4.22, hD = 0.78, yE = 5.36, hE = 0.78;
  const groups = [
    { parent: C2, col: P,
      D: [["Faced a tight month", "or forgot to pay"], ["Kept at the moment", "paid, less or skip"], ["Active at month 12", "after being kept"]],
      E: [["Saw the reminder", "3 days before debit"], ["Chose a gentle path", "4 of 4 named one"], ["Debit went through", "as they chose"]] },
    { parent: C3, col: S,
      D: [["Saw a down month", "in year one"], ["Stayed through it", "did not stop"], ["Active at month 12", "after staying"]],
      E: [["Opened the check-in", "weekly"], ["Understood the dip", "why + is it normal"], ["Kept investing", "30 days after a dip"]] },
  ];
  groups.forEach((g, gi) => {
    const D = g.D.map((t, i) => box(XS[gi][i], yD, W, hD, t[0], t[1], i === 1 ? { line: O, lw: 2.5, name: "rate-" + gi } : { name: "factor-" + gi + i }));
    tree(g.parent, D, 4.08);
    const E = g.E.map((t, i) => box(XS[gi][i], yE, W, hE, t[0], t[1], { line: g.col, lw: 2, name: "lever-" + gi + i }));
    tree(D[1], E, 5.22);
    [XS[gi][0] + W + 0.15, XS[gi][1] + W + 0.15].forEach(x => { op(x, yD + hD / 2, "×"); op(x, yE + hE / 2, "×"); });
  });
  // Lever captions and legend
  s.addText("Levers: SIPal flow 2, reminder before the debit", { x: 0.5, y: 6.2, w: 5.94, h: 0.34, fontFace: BODY, fontSize: 14, bold: true, color: P, align: "center", valign: "middle", margin: 0 });
  s.addText("Levers: SIPal flow 1, weekly check-in", { x: 6.89, y: 6.2, w: 5.94, h: 0.34, fontFace: BODY, fontSize: 14, bold: true, color: S, align: "center", valign: "middle", margin: 0 });
  s.addText([
    { text: "+ ", options: { bold: true, color: Y } }, { text: "add up   " }, { text: "× ", options: { bold: true, color: Y } }, { text: "multiply   " },
    { text: "÷ ", options: { bold: true, color: Y } }, { text: "divide   " }, { text: "dashed ", options: { bold: true, color: Y } }, { text: "= out of scope   " },
    { text: "% ", options: { bold: true, color: Y } }, { text: `= share of ${N.stated} drop-off reasons stated in public posts` }],
    { x: 0.5, y: 6.66, w: 12.33, h: 0.4, fontFace: BODY, fontSize: 14, color: SOFT, align: "center", valign: "middle", margin: 0 });
  s.addNotes(
    "Formula: 12-month active SIP rate = first-timers active at month 12 / first-timers who started a SIP. " +
    "Active at month 12 = never hit a risk moment and still active + kept after a missed-SIP moment + kept after a low-returns moment + kept after other moments (out of scope). " +
    "Kept after a moment = first-timers who faced it x share kept at the moment x share still active at month 12. " +
    "Kept at a missed-SIP moment = saw the reminder in time x chose a gentle path (pay full, pay less, skip, move the date) x the debit went through as chosen (SIPal flow 2). " +
    "Stayed through a down month = opened the weekly check-in x understood the dip x kept investing 30 days later (SIPal flow 1). " +
    `Evidence: of ${N.stated} drop-off posts that state a reason, missed or failed SIPs ${N.S1}% plus money pressure or life events ${N.S2a}% make the missed-SIP moment (${missed}%); low returns, wrong expectations or confusing numbers ${N.S2b}%; a better alternative or others' advice ${N.S2c}% (out of scope). ` +
    "Survey n=18: 3 missed an instalment, 9 thought of stopping, 9 did nothing. Interviews: 0 of 4 knew what several misses lead to; 4 of 4 named a gentler path; 2 of 4 thought of quitting over low returns. " +
    "The kept rates are what SIPal moves; the target is +2 to +4 points on the north star for salaried 22-30 first-timers (estimate).");
};
