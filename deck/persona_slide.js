// Two user personas, each one real interviewee (names used with the Fellow's consent), answers as given.
// Shared by the standalone file and the main deck. Every text >= 14pt.
module.exports = function addPersonas(pres, s, C) {
  const { CARD, SOFT, WHITE, DARK, S, O, Y, HEAD, BODY } = C;
  const PERSONAS = [
    {
      x: 0.5, col: S, ini: "A", name: "Akshata, 26", tag: "Missed it, never meant to stop",
      quote: "“I did turn on the mandate auto debit because I kept forgetting to pay.”",
      demo: "26, salaried, salary on the 1st · first-ever mutual fund investment, first SIP in 2025 · one SIP of Rs 1,000 on the 1st",
      app: [
        "Opens Groww only when the SIP payment is due",
        "Paid by hand at first; turned on autopay after missing",
        "Uses GR-1 to read the portfolio and trusts it fully",
        "Knows amount or date can change; has never used it",
      ],
      goals: [
        "Long-term returns; expects more than 15% a year",
        "Keep the SIP going without having to remember it",
      ],
      fric: [
        "Forgot to pay: missed 2 to 3 instalments (not in a row)",
        "The one reminder gets lost among other notifications",
        "Did not know what several missed instalments lead to",
      ],
    },
    {
      x: 6.78, col: O, ini: "P", name: "Praveen, 34", tag: "Laid off, nearly quit",
      quote: "“Pay less and postpone the SIP to next month.” (what would have helped)",
      demo: "34, salaried · first-ever mutual fund investment, first SIP about 4 months ago · SIP mid-month; salary date never a problem",
      app: [
        "Opens Groww every morning to check the graph",
        "Has used skip (no confusion) and lowered the amount",
        "After the layoff, looked up how to stop the SIP",
        "Asks a friend or advisors; no AI, unaware of GR-1",
      ],
      goals: [
        "Make money: expects at least 10% a year",
        "Wants the app to analyse and explain the portfolio",
      ],
      fric: [
        "Laid off and needed the money: the SIP nearly stopped",
        "Low returns and poor market knowledge made quitting tempting",
        "Did not know what several missed instalments lead to",
      ],
    },
  ];
  const y0 = 1.38, w = 6.05, h = 5.5;
  PERSONAS.forEach((p, i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: p.x, y: y0, w, h, rectRadius: 0.15, fill: { color: CARD }, line: { color: p.col, width: 2 }, objectName: "persona-" + (i + 1) });
    s.addShape(pres.shapes.OVAL, { x: p.x + 0.2, y: y0 + 0.17, w: 0.72, h: 0.72, fill: { color: p.col }, line: { color: p.col }, objectName: "persona-avatar-" + (i + 1) });
    s.addText(p.ini, { x: p.x + 0.2, y: y0 + 0.17, w: 0.72, h: 0.72, fontFace: HEAD, fontSize: 24, bold: true, color: DARK, align: "center", valign: "middle", margin: 0 });
    s.addText([{ text: p.name, options: { color: "5367F5" } }, { text: "  ·  " + p.tag, options: { color: p.col } }],
      { x: p.x + 1.08, y: y0 + 0.1, w: w - 1.25, h: 0.4, fontFace: BODY, fontSize: 18, bold: true, valign: "middle", margin: 0 });
    s.addText(p.quote, { x: p.x + 1.08, y: y0 + 0.5, w: w - 1.25, h: 0.52, fontFace: BODY, fontSize: 14, italic: true, color: SOFT, valign: "top", margin: 0 });
    s.addShape(pres.shapes.LINE, { x: p.x + 0.2, y: y0 + 1.08, w: w - 0.4, h: 0, line: { color: p.col, width: 1, transparency: 40 }, objectName: "persona-rule-" + (i + 1) });
    const runs = [];
    const head = (t, first) => runs.push({ text: t, options: { bold: true, color: p.col, fontSize: 15, breakLine: true, paraSpaceBefore: first ? 0 : 7 } });
    const bul = (arr) => arr.forEach(t => runs.push({ text: t, options: { bullet: { indent: 14 }, breakLine: true, color: WHITE } }));
    head("Demographics", true); runs.push({ text: p.demo, options: { breakLine: true, color: WHITE } });
    head("App usage"); bul(p.app);
    head("Key goals"); bul(p.goals);
    head("Core friction points"); bul(p.fric);
    runs[runs.length - 1].options.breakLine = false;
    s.addText(runs, { x: p.x + 0.2, y: y0 + 1.16, w: w - 0.4, h: h - 1.24, fontFace: BODY, fontSize: 14, valign: "top", margin: 0, paraSpaceAfter: 1 });
  });
  s.addText([
    { text: "Shared by all 4 interviewees: ", options: { bold: true, color: Y } },
    { text: "none knew what several missed instalments lead to; all 4 named a gentler path they would have taken", options: { color: SOFT } }],
    { x: 0.5, y: 6.97, w: 12.33, h: 0.38, fontFace: BODY, fontSize: 14, valign: "middle", margin: 0 });
  s.addNotes("Two personas, each one real interviewee; answers as given. Akshata (26, salaried, first SIP 2025, one SIP of Rs 1,000 on the 1st, paid by hand): " +
    "missed 2 to 3 instalments by forgetting, then turned on autopay; never thought of stopping; opened Cancel only to restart with more money; did not know what several misses lead to; " +
    "uses GR-1 and trusts it; when worried does nothing; wants a reminder the day before and a guide for first-time SIP investors; would skip next month. " +
    "Praveen (34, salaried, first SIP about 4 months ago, mid-month): laid off and needed money; looked up how to stop and talked to advisors; thought of stopping over low returns, wrong decisions and poor market knowledge; " +
    "has used skip and lowered the amount; did not know what several misses lead to; asks a friend; no AI; would pay less and postpone to next month; wants notifications. " +
    "Praveen is just above the 22-30 band but is a first-year investor and matches the money-moment path. The other two interviewees (Sudhanva, Darshan) are summarised on the hypothesis slide.");
};
