// Builds NL_Groww.pptx: 10-slide problem-framing deck (no fellow name anywhere).
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";                         // 13.33 x 7.5 in
pres.author = "";
pres.company = "";
pres.title = "First-time SIP retention on Groww: problem framing, MVP and success metrics";

// ---------- palette: vibrant on deep indigo, colour-blind-safe (blue / orange / yellow / pink / teal; meaning never relies on colour alone) ----------
const BG = "140F3D", CARD = "251D70", CARD2 = "33288F", WHITE = "FFFFFF", SOFT = "DAD5FF", DARK = "140F3D";
const Y = "F0E442", O = "FFB000", S = "56B4E9", G = "3DDBB0", P = "F08DC0";
const HEAD = "Arial", BODY = "Calibri";
const ENGINE = "https://nextleapgradprojectgrowwsipresearch.vercel.app/";

pres.defineSlideMaster({
  title: "CONTENT", background: { color: BG },
  objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.28, w: 12.33, h: 1.05, fontFace: HEAD, fontSize: 27, bold: true, color: WHITE, valign: "middle", margin: 0 }, text: "" } }],
});
pres.defineSlideMaster({ title: "COVER", background: { color: BG } });

function blobs(s, a = S, b = P) {                    // soft decorative glows (behind content)
  s.addShape(pres.shapes.OVAL, { x: -1.6, y: -1.8, w: 4.6, h: 4.6, fill: { color: b, transparency: 68 }, line: { color: b, transparency: 100 }, objectName: "glow-1" });
  s.addShape(pres.shapes.OVAL, { x: 11.1, y: 5.6, w: 4.2, h: 4.2, fill: { color: a, transparency: 70 }, line: { color: a, transparency: 100 }, objectName: "glow-2" });
}
function newSlide(title) {
  const s = pres.addSlide({ masterName: "CONTENT" });
  blobs(s);
  s.addText(title, { placeholder: "title" });
  return s;
}
const card = (s, x, y, w, h, fill = CARD, line = null, name = "card") =>
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.18, fill: { color: fill }, line: line ? { color: line, width: 2 } : { color: fill, width: 0.5 }, objectName: name });
const badge = (s, n, x, y, color, d = 0.5) => {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { color }, objectName: "badge-" + n });
  s.addText(String(n), { x, y, w: d, h: d, align: "center", valign: "middle", fontFace: HEAD, fontSize: 18, bold: true, color: DARK, margin: 0, isTextBox: true });
};
const T = (s, runs, o) => s.addText(runs, Object.assign({ fontFace: BODY, fontSize: 15, color: WHITE, margin: 0, valign: "top", isTextBox: true }, o));
const link = (text, url, color = Y) => ({ text, options: { hyperlink: { url, tooltip: url }, color, underline: { style: "sng", color }, bold: true } });

// =====================================================================================================================
// 1. COVER
// =====================================================================================================================
{
  const s = pres.addSlide({ masterName: "COVER" });
  blobs(s, S, P);
  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 0.2, w: 4.6, h: 4.6, fill: { color: G, transparency: 80 }, line: { color: G, transparency: 100 }, objectName: "glow-3" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 0.6, w: 6.9, h: 0.5, rectRadius: 0.25, fill: { color: CARD2 }, line: { color: Y, width: 1.5 }, objectName: "kicker" });
  T(s, "NextLeap graduation project  |  Growth PM case: Groww", { x: 0.7, y: 0.6, w: 6.9, h: 0.5, fontSize: 16, bold: true, color: Y, align: "center", valign: "middle" });
  T(s, "Helping first-time Groww investors stay invested through year one", { x: 0.7, y: 1.55, w: 11.6, h: 2.0, fontFace: HEAD, fontSize: 46, bold: true, valign: "top" });
  T(s, "Why early-career salaried investors wobble in months 2 to 12, and an AI check-in that steadies them without giving advice", { x: 0.7, y: 3.65, w: 10.8, h: 1.0, fontSize: 22, color: SOFT });
  card(s, 0.7, 4.85, 11.9, 1.0, CARD, O, "north-star");
  T(s, [{ text: "North-star metric: ", options: { bold: true, color: O } }, { text: "percentage of first-time mutual fund investors who still have an active SIP 12 months after starting their first one." }], { x: 0.95, y: 4.9, w: 11.4, h: 0.9, fontSize: 19, valign: "middle" });
  T(s, [{ text: "11,711", options: { bold: true, color: S } }, { text: " conversations analysed   |   " }, { text: "4,952", options: { bold: true, color: G } }, { text: " about real SIP journeys   |   " },
        { text: "18", options: { bold: true, color: P } }, { text: "-person survey   |   " }, link("Try the live AI discovery engine", ENGINE)], { x: 0.7, y: 6.1, w: 12, h: 0.4, fontSize: 16 });
  T(s, "Independent study. Not affiliated with Groww. Not investment advice. Mutual fund investments are subject to market risks.", { x: 0.7, y: 6.7, w: 12, h: 0.4, fontSize: 14, color: SOFT });
  s.addNotes("Title slide. North-star metric as given in the brief. Numbers: 11,711 conversations analysed by the discovery engine, 4,952 judged relevant to a person's own mutual fund SIP; survey n=18. Name of the fellow intentionally not shown.");
}

// =====================================================================================================================
// 2. KPI TREE (business metric decomposition)
// =====================================================================================================================
{
  const s = newSlide("KPI tree: continuation rises most when a moment of doubt gets a trusted, clear answer in the app instead of ending in a stop");
  require("./kpi_tree_slide.js")(pres, s, require("./kpi_numbers.json"), 0.06);
}

// =====================================================================================================================
// 3. IMPACT MAPPING + SEGMENTS
// =====================================================================================================================
{
  const s = newSlide("Impact mapping: of about 2 to 3 million first-time Groww SIP investors a year, early-career salaried 22 to 30 are the largest group");
  const rows = [
    ["India's population", "~1.4 billion", "", S],
    ["Mobile internet users", "~958 million", "68% of population  |  IAMAI 2025", O],
    ["Fintech app users", "500M+ UPI users", "~52% of internet users  |  NPCI-BCG 2025", P],
    ["Groww active users", "16.7 million", "~3% of UPI users  |  Groww Q4 FY26 letter", G],
    ["First-time SIP investors on Groww", "~2 to 3 million a year (estimate)", "", Y],
  ];
  const widths = [8.3, 7.5, 6.7, 5.9, 5.1], cx = 4.65, h = 0.7, gap = 0.07, top0 = 1.45;
  rows.forEach((r, i) => {
    const y = top0 + i * (h + gap), w = widths[i], last = i === 4;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx - w / 2, y, w, h, rectRadius: 0.14, fill: { color: last ? CARD2 : CARD }, line: { color: r[3], width: last ? 3 : 2 }, objectName: "funnel-" + (i + 1) });
    const head = last ? [{ text: r[0], options: { bold: true, fontSize: 16, breakLine: true } }, { text: r[1], options: { bold: true, color: r[3], fontSize: 18 } }]
                      : [{ text: r[0] + "   ", options: { bold: true, fontSize: 16 } }, { text: r[1], options: { bold: true, color: r[3], fontSize: 18, breakLine: !!r[2] } }].concat(r[2] ? [{ text: r[2], options: { fontSize: 14, color: SOFT } }] : []);
    T(s, head, { x: cx - w / 2 + 0.15, y, w: w - 0.3, h, valign: "middle", align: "center", fontSize: 16 });
  });
  // ---- the last level split into four first-time investor segments (shares from the engine; sizes = share x 2-3M) ----
  const SEGN = require("./segment_numbers.json");
  const segs = [["student", "Students, under 22", S], ["early", "Salaried, 22-30", O], ["variable", "Variable income", P], ["mid", "Mid-career, 31+", G]];
  const top = segs.reduce((a, b) => (SEGN.share[b[0]] > SEGN.share[a[0]] ? b : a));
  const sw = 1.95, sg = 0.17, sy = 5.5, sh = 1.12, sx0 = 0.5, fBottom = top0 + 5 * h + 4 * gap, busY = fBottom + 0.13;
  const line = (x, y, w, hh) => s.addShape(pres.shapes.LINE, { x, y, w, h: hh, line: { color: "8C84D6", width: 1.25 }, objectName: "seg-connector" });
  line(cx, fBottom, 0, busY - fBottom); line(sx0 + sw / 2, busY, 3 * (sw + sg), 0);
  segs.forEach(([key, name, col], i) => {
    const x = sx0 + i * (sw + sg), hot = key === top[0], sh_ = SEGN.share[key];
    line(x + sw / 2, busY, 0, sy - busY);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: sy, w: sw, h: sh, rectRadius: 0.12, fill: { color: hot ? CARD2 : CARD }, line: { color: hot ? Y : col, width: hot ? 3.5 : 1.75 }, objectName: "segment-" + key });
    const amt = v => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${Math.round(v / 1e4) * 10}K`);
    const size = `~${amt(sh_ * 2e4)}-${amt(sh_ * 3e4)} a year`;
    T(s, (hot ? [{ text: "Largest group", options: { bold: true, color: Y, fontSize: 14, breakLine: true } }] : []).concat([
        { text: name, options: { bold: true, fontSize: 14, breakLine: true } }, { text: `${sh_}% of first-timers`, options: { color: hot ? Y : col, bold: true, fontSize: 14, breakLine: true } },
        { text: size, options: { color: SOFT, fontSize: 14 } }]),
      { x: x + 0.1, y: sy + 0.03, w: sw - 0.2, h: sh - 0.06, valign: "middle", align: "center", fontSize: 14 });
  });
  card(s, 9.05, 1.45, 3.78, 1.6, CARD, S, "why-door");
  T(s, [{ text: "The entry door\n", options: { bold: true, color: S, fontSize: 16 } }, { text: "36% of new Groww users start with a SIP (Q2 FY26, up 7 points on last year)." }], { x: 9.22, y: 1.56, w: 3.45, h: 1.4, fontSize: 16 });
  card(s, 9.05, 3.2, 3.78, 1.65, CARD, O, "why-leak");
  T(s, [{ text: "The leak\n", options: { bold: true, color: O, fontSize: 16 } }, { text: "SIP stoppage ratio 78.5% in Sep 2026: 63.26 lakh new SIPs vs 49.68 lakh closed or completed." }], { x: 9.22, y: 3.31, w: 3.45, h: 1.45, fontSize: 16 });
  card(s, 9.05, 5.0, 3.78, 1.62, CARD, Y, "why-estimate");
  T(s, [{ text: "Estimate logic\n", options: { bold: true, color: Y, fontSize: 16 } }, { text: "~10M of 16.7M users hold mutual funds; 20-30% assumed to start a first SIP in a year. Segment shares: engine, first-year posts stating age or income." }], { x: 9.22, y: 5.08, w: 3.45, h: 1.5, fontSize: 14.5 });
  T(s, [{ text: "Sources: " },
        link("IAMAI 2025", "https://yourstory.com/2026/01/indias-internet-user-base-crosses-950-million-2025-iamai-report", S), { text: "  |  " },
        link("NPCI-BCG", "https://assets.thehansindia.com/business/upi-crosses-500-million-users-sets-global-benchmark-for-digital-payments-bcgnpci-report-1013164", S), { text: "  |  " },
        link("Groww letter Q4 FY26", "https://nsearchives.nseindia.com/corporate/BILLIONBRAINS_20042026132113_ShareholdrsLetterSigned.pdf", S), { text: "  |  " },
        link("Groww letter Q2 FY26", "https://resources.groww.in/web-assets/media-library/2025/11/Q2%20FY26%20Shareholders%27%20Letter.pdf", S), { text: "  |  " },
        link("SIP stoppage Sep 2026", "https://www.angelone.in/news/mutual-funds/sip-stoppage-ratio-falls-for-5th-straight-month-to-78-53-in-september-2026", S)],
    { x: 0.5, y: 6.82, w: 12.3, h: 0.4, fontSize: 14, color: SOFT });
  s.addNotes("Funnel: 1.4B population; ~958M active internet users (IAMAI Internet in India 2025); 500M+ UPI consumers (NPCI-BCG 2025) used as the fintech-app proxy; 16.7M Groww active users and 60% mutual-fund attach (Groww Q4 FY26 shareholder letter); 36% of new users are SIP-first (Q2 FY26 letter). The final level is an estimate, not a reported figure: ~10M MF users x 20-30% assumed to have started their first SIP in the last 12 months. Validate with Groww internal data. SIP stoppage ratio is stoppages plus completions over new registrations, so it is not the share of investors who quit. Segment shares: discovery engine (prompt v3), first-year investors whose posts state age, occupation or income; sizes = share x the 2 to 3 million estimate. Directional: only a minority of posts state these details.");
}

// =====================================================================================================================
// 4. HYPOTHESIS (one strong hypothesis for the target segment)
// =====================================================================================================================
{
  const s = newSlide("Hypothesis: salaried 22-30 first-timers stop because their first doubt goes unanswered in the app, not because markets fall");
  const SEGN = require("./segment_numbers.json");
  T(s, [{ text: "Target segment: ", options: { bold: true, color: O } }, { text: `salaried, 22-30, the largest group at ${SEGN.share.early}% of first-time investors who state age or income` }],
    { x: 0.5, y: 1.4, w: 12.3, h: 0.32, fontSize: 15, color: SOFT });
  const steps = [
    ["1  Starts with intent", "Long-term wealth; expects steady growth", S, false],
    ["2  Doubt moment, months 2-12", "A small or negative number, or a tight month (EMI, loan)", P, false],
    ["3  Root cause: no trusted answer", "Nothing in the app explains their own case; no in-between option", O, true],
    ["4  Asks outside or freezes", "Reddit, YouTube, friends, or does nothing", G, false],
    ["5  The SIP breaks", "Stops, pauses or quietly lapses", Y, false],
  ];
  const cw = 2.25, cg = 0.27, cy0 = 1.85, ch = 1.6;
  steps.forEach((st, i) => {
    const x = 0.5 + i * (cw + cg);
    card(s, x, cy0, cw, ch, st[3] ? CARD2 : CARD, st[2], "hyp-step-" + (i + 1));
    if (st[3]) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cy0, w: cw, h: ch, rectRadius: 0.18, fill: { color: CARD2, transparency: 100 }, line: { color: O, width: 3.5 }, objectName: "root-cause-highlight" });
    T(s, [{ text: st[0], options: { bold: true, color: st[2], fontSize: 15, breakLine: true } }, { text: st[1], options: { fontSize: 14 } }], { x: x + 0.14, y: cy0 + 0.1, w: cw - 0.28, h: ch - 0.2, fontSize: 14 });
    if (i < steps.length - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + cw + 0.04, y: cy0 + ch / 2 - 0.13, w: 0.19, h: 0.26, fill: { color: SOFT }, line: { color: SOFT }, objectName: "hyp-arrow-" + (i + 1) });
  });
  T(s, "The SIP breaks because the doubt goes unanswered, not because the market fell or the money ran out.", { x: 0.5, y: 3.55, w: 12.3, h: 0.45, fontSize: 19, bold: true, color: Y, valign: "middle" });
  card(s, 0.5, 4.15, 6.05, 2.85, CARD, S, "hyp-evidence");
  T(s, "Why we believe it", { x: 0.7, y: 4.22, w: 5.7, h: 0.38, fontSize: 17, bold: true, color: S, valign: "middle" });
  T(s, [
    { text: "84% of those who say expect steady long-term growth (378 of 450)", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "They watch current value (43%) and returns % (28%); confused by taxes, charges and XIRR", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "55% of their posts ask for a trusted answer about their own case (712 of 1,303)", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Answers come from outside the app: Reddit 51%, YouTube 34%", options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Survey (n=18): 9 did nothing after doubting; top triggers market-fall news (5) and needing money (4)", options: { bullet: true } }],
    { x: 0.7, y: 4.62, w: 5.7, h: 2.3, fontSize: 14 });
  card(s, 6.75, 4.15, 6.08, 2.85, CARD, G, "hyp-test");
  T(s, "How 5 to 6 interviews will test it", { x: 6.95, y: 4.22, w: 5.7, h: 0.38, fontSize: 17, bold: true, color: G, valign: "middle" });
  T(s, [
    { text: "Supported if ", options: { bold: true, color: G } }, { text: "4 of 6 describe a doubt moment, no trusted in-app answer, and outside help or freezing; and 3 of 6 say a clear explanation or an in-between option would have changed what they did", options: { breakLine: true } },
    { text: "Wrong if ", options: { bold: true, color: P } }, { text: "most who stopped understood what was happening and simply needed the money, or found a clear answer in the app and still stopped", options: { breakLine: true } },
    { text: "Weakest point: only 27 of this segment's posts show a drop-off, and they lean to money pressure.", options: { color: SOFT } }],
    { x: 6.95, y: 4.62, w: 5.7, h: 2.3, fontSize: 14, paraSpaceAfter: 6 });
  s.addNotes("One hypothesis for the target segment, replacing the earlier three. Evidence: discovery engine with the v3 labelling prompt, salaried 22-30 segment (1,303 relevant posts; segment assigned from stated age, income or source of money): 84% of the 450 who state an expectation expect steady long-term growth; of those who say what they check, current value 43% and returns 28%; top confusions taxes, charges and exit load, XIRR vs absolute returns; trusted help is the main unmet need in 712 of 1,303 posts (55%); outside sources named: Reddit 51%, YouTube 34%. Among the segment's 27 drop-off posts, cash-flow pressure and life events lead (52%), pause or reduce is the need for 22%. Survey n=18: 9 did nothing after a doubt; reasons market-fall news 5, needing money 4. Note: the segment's drop-off rate (2.0%) is not the highest (variable-income earners 6.2%, but only 225 posts); it is chosen because it is the largest group.");
}

// =====================================================================================================================
// 5. PAIN POINTS
// =====================================================================================================================
{
  const s = newSlide("Pain points: investors cannot tell if what they see is normal, and the app gives no middle path");
  card(s, 0.5, 1.5, 5.3, 5.05, CARD, null, "survey-panel");
  badge(s, 1, 0.65, 1.62, S, 0.46);
  T(s, "Survey snapshot (n=18)", { x: 1.28, y: 1.62, w: 4.3, h: 0.46, fontSize: 17, bold: true, color: S, valign: "middle" });
  [["9 of 18", "thought of stopping or pausing", S], ["3 of 18", "missed an instalment (all on Groww)", O], ["9 of 18", "did nothing next", P]].forEach((k, i) => {
    T(s, [{ text: k[0], options: { bold: true, color: k[2], fontSize: 22 } }, { text: "\n" + k[1], options: { fontSize: 14, color: SOFT } }], { x: 0.7 + i * 1.7, y: 2.25, w: 1.6, h: 1.05, fontSize: 14, align: "left" });
  });
  T(s, "What they did after a moment of doubt (people)", { x: 0.7, y: 3.38, w: 4.9, h: 0.35, fontSize: 14, bold: true });
  s.addChart(pres.charts.BAR, [{ name: "People", labels: ["Did nothing", "Asked a friend", "Followed influencers", "Asked family", "Searched Google"], values: [9, 4, 3, 1, 1] }], {
    x: 0.6, y: 3.7, w: 5.1, h: 2.8, barDir: "bar", chartColors: [P, S, S, S, S], showLegend: false, showTitle: false, legendFontSize: 14, titleFontSize: 14, valAxisLabelFontSize: 14, valAxisLabelColor: WHITE, showValue: true, dataLabelPosition: "outEnd", dataLabelColor: WHITE, dataLabelFontSize: 14, dataLabelFontFace: BODY,
    catAxisLabelColor: WHITE, catAxisLabelFontSize: 14, catAxisLabelFontFace: BODY, catAxisOrientation: "maxMin", valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, valAxisMaxVal: 11, valAxisMinVal: 0, barGapWidthPct: 45,
  });
  card(s, 6.0, 1.5, 6.83, 5.05, CARD, null, "pain-panel");
  T(s, "Top five pain points and blockers", { x: 6.2, y: 1.58, w: 6.4, h: 0.45, fontSize: 17, bold: true, color: Y, valign: "middle" });
  const P5 = [
    [S, "No baseline for \"is this normal?\"", "Reassurance, expectation-setting and plain-language needs make up 48% of first-year needs (n=1,063)."],
    [O, "Screens that are hard to read", "First-year confusion: SIP dates and status 30%, autopay mandate 18%, returns vs invested 14%."],
    [P, "No middle path", "22% of drop-off signals ask to pause or reduce; cash-flow pressure leads for salaried investors."],
    [G, "Failed instalments go unseen", "18% of stated drop reasons are broken SIPs (payment, mandate, app); 3 of 18 survey respondents missed one."],
    [Y, "Help lives outside the app", "YouTube 38%, Reddit 32%; visible drop-offs sound confused, anxious or frustrated 62% vs 27% of continuers."],
  ];
  P5.forEach((p, i) => {
    const y = 2.1 + i * 0.89;
    badge(s, i + 1, 6.2, y + 0.07, p[0], 0.44);
    T(s, [{ text: p[1] + "\n", options: { bold: true, color: p[0], fontSize: 16 } }, { text: p[2], options: { fontSize: 14.5 } }], { x: 6.82, y, w: 5.85, h: 0.85, fontSize: 14.5 });
  });
  T(s, "Sources: discovery engine on 11,711 conversations; survey n=18 (screener to be repeated with interviews).", { x: 0.5, y: 6.72, w: 12.3, h: 0.45, fontSize: 14, color: SOFT });
  s.addNotes("Engine numbers: first-year relevant conversations n=1,063; first-year confusion shares among 299 conversations that mention confusion; 22% from drop-off signals (n=696); 18% of 512 stated drop-off reasons are involuntary breaks; outside-app shares among 394 conversations that name a source; emotion comparison: drop-offs vs continuing investors (confused, anxious, frustrated or disappointed). Survey: Q7 thought of stopping yes 6 + maybe 3; Q9 did nothing 9, friend 4, influencers 3, family 1, Google 1; Q5 missed an instalment 3, all on Groww.");
}

// =====================================================================================================================
// 6. PROBLEM FRAMING CANVAS
// =====================================================================================================================
{
  const s = newSlide("True problem: at the wobble moment, investors cannot read what they see or act on what they feel");
  const box = (n, title, color, x, y, w, h, body, size = 14.5) => {
    card(s, x, y, w, h, CARD, color, "canvas-" + n);
    badge(s, n, x + 0.15, y + 0.12, color, 0.46);
    T(s, title, { x: x + 0.75, y: y + 0.12, w: w - 0.9, h: 0.46, fontSize: 16, bold: true, color, valign: "middle" });
    T(s, body, { x: x + 0.2, y: y + 0.68, w: w - 0.4, h: h - 0.78, fontSize: size });
  };
  box(1, "What is the true problem?", S, 0.5, 1.45, 4.55, 2.95,
    "Between months 2 and 12, a small or negative number, a tight month or a scary headline triggers doubt. Investors cannot tell if it is normal, the app offers only keep paying or cancel, and help sits on YouTube, Reddit and friends. Continuation breaks at the decision moment, not at the decision to start.", 16);
  box(2, "Who faces it?", O, 5.2, 1.45, 3.75, 2.95,
    "Early-career salaried first-time investors, 22 to 30, three to twelve months into a SIP paid from monthly salary. 60% of posts that state age; 63% of first-year ones; an estimated 2 to 3 million a year on Groww.", 16);
  box(3, "How do we know it is real?", P, 9.1, 1.45, 3.73, 2.95,
    [{ text: "43% of stated drop reasons are about understanding and expectations (n=512)", options: { bullet: true, breakLine: true, paraSpaceAfter: 3 } },
     { text: "9 of 18 surveyed considered stopping; 9 did nothing", options: { bullet: true, breakLine: true, paraSpaceAfter: 3 } },
     { text: "Industry SIP stoppage ratio 78.5% (Sep 2026)", options: { bullet: true } }], 15);
  box(4, "What value does solving it create?", G, 0.5, 4.55, 7.0, 2.7, [
    { text: "For investors: ", options: { bold: true, color: G } }, { text: "calm clarity at the wobble moment, a baseline for what is normal, a reversible option instead of a cliff, fewer silent lapses.\n", options: { breakLine: false } },
    { text: "For Groww: ", options: { bold: true, color: G } }, { text: "a higher 12-month active-SIP rate. Each +1 point keeps roughly 20,000 to 30,000 investors a year (estimate), with more lifetime assets and fees, fewer support contacts and compounding trust." }], 16);
  box(5, "Why solve it now?", Y, 7.65, 4.55, 5.18, 2.7, [
    { text: "Acquisition works, retention lags: record Rs 32,490 crore monthly SIPs yet a 78.5% stoppage ratio", options: { bullet: true, breakLine: true, paraSpaceAfter: 3 } },
    { text: "36% of new Groww users start SIP-first", options: { bullet: true, breakLine: true, paraSpaceAfter: 3 } },
    { text: "AI can now answer from real conversations with built-in checks", options: { bullet: true } }], 16);
  s.addNotes("Canvas follows the five questions in the brief. The problem is deliberately not 'investors stop when markets fall': a market-fall headline is the trigger, the root cause is the missing bridge between what investors see and what they can understand or do. The 20,000 to 30,000 figure is 1% of the estimated 2 to 3 million first-time SIP investors a year and must be validated with Groww cohort data. Record monthly SIP flows Rs 32,490 crore and stoppage ratio 78.53% are for September 2026 (AMFI via media reports).");
}

// =====================================================================================================================
// 7. MVP
// =====================================================================================================================
{
  const s = newSlide("MVP: SIP Check-in, an eval-gated AI that explains what investors see and never what to buy");
  const steps = [
    ["1  Trigger", "Opens from the month 2 to 6 statement or when an investor taps pause or cancel", S],
    ["2  Inputs", "Months in, amount band, return shown, what worries them (chips). English, Hindi or Hinglish", O],
    ["3  AI answer", "2 to 3 calm sentences: what the number means and what similar investors said or did, cited from real conversations", P],
    ["4  Quality gate", "Grounded, no advice, numbers verified. If any check fails: safe fallback with AMFI, SEBI and Groww support links", G],
  ];
  steps.forEach((st, i) => {
    const x = 0.5 + i * 3.12, w = 2.9;
    card(s, x, 1.5, w, 2.15, i === 3 ? CARD2 : CARD, st[2], "mvp-step-" + (i + 1));
    T(s, st[0], { x: x + 0.15, y: 1.58, w: w - 0.3, h: 0.4, fontSize: 17, bold: true, color: st[2] });
    T(s, st[1], { x: x + 0.15, y: 2.02, w: w - 0.3, h: 1.6, fontSize: 15.5 });
    if (i < 3) T(s, ">", { x: x + w - 0.02, y: 2.35, w: 0.25, h: 0.5, fontSize: 24, bold: true, color: Y, align: "center", valign: "middle" });
  });
  const C3 = [
    ["Where AI earns its place", S, "It reads the investor's own numbers and worry in their language, retrieves similar real cases, and writes a calm explanation at the exact moment of doubt."],
    ["What a non-AI version misses", O, "A static FAQ cannot tailor to month, amount and worry. Rules can compute returns but not tell cash stress from confusion. Advisors do not scale to millions."],
    ["Eval gate before launch", G, "Ships only if the golden set shows 95%+ grounded answers, zero advice or return-prediction language, and 100% refusal of fund-pick and injection tests. Engine today: 19/19 tricky questions handled, 11/12 answers grounded."],
  ];
  C3.forEach((c, i) => {
    const x = 0.5 + i * 4.18, w = 3.98;
    card(s, x, 3.85, w, 2.2, CARD, c[1], "mvp-card-" + (i + 1));
    T(s, c[0], { x: x + 0.18, y: 3.93, w: w - 0.36, h: 0.4, fontSize: 17, bold: true, color: c[1] });
    T(s, c[2], { x: x + 0.18, y: 4.35, w: w - 0.36, h: 1.65, fontSize: 15 });
  });
  card(s, 0.5, 6.2, 12.33, 0.55, CARD2, Y, "mvp-disclaimer");
  T(s, "Not investment advice. No fund names, no return predictions, no fear or urgency. Pause and cancel are never blocked.", { x: 0.7, y: 6.2, w: 11.9, h: 0.55, fontSize: 15, bold: true, color: Y, valign: "middle", align: "center" });
  T(s, [{ text: "Retrieval core already live: " }, link("discovery engine", ENGINE, S)], { x: 0.5, y: 6.88, w: 12.3, h: 0.4, fontSize: 14, color: SOFT });
  s.addNotes("MVP idea built on the same retrieval-augmented engine already deployed. Safe fallback: decline, express uncertainty, or point to AMFI, SEBI investor education and Groww support. The gate runs four checks on every answer (real citations, at most three sentences, numbers from computed counts, no advice language). Golden-set agreement on the extraction labels is measured separately once the hand-labelled set is returned. Release thresholds are proposals to be agreed with compliance.");
}

// =====================================================================================================================
// 8. SUCCESS METRICS
// =====================================================================================================================
{
  const s = newSlide("Success: lift 12-month active SIPs, tracked by leading indicators, guardrails and AI quality gates");
  card(s, 0.5, 1.45, 12.33, 0.95, CARD2, Y, "north-star-card");
  T(s, [{ text: "North star: ", options: { bold: true, color: Y } }, { text: "% of first-time investors with at least one successful instalment in the last 30 days, 12 months after their first SIP. Target: +2 to +3 points vs a control group (set from Groww baseline)." }], { x: 0.7, y: 1.45, w: 11.9, h: 0.95, fontSize: 17, valign: "middle" });
  const cols = [
    ["Leading indicators", "Move in weeks, not 12 months", S, [
      ["Wobble-to-continue:", "% who open Check-in at a pause or cancel moment and still have an active SIP 30 days later"],
      ["Month-6 survival:", "% of the cohort with an active SIP at month 6"],
      ["Middle-path use:", "% of SIP changes made by pause or reduce rather than cancel"],
      ["Clarity rate:", "% answering yes to 'did this make things clearer?' (goal 70%+)"]]],
    ["Guardrails", "Make sure we do no harm", O, [
      ["Advice language:", "0 advice or return-prediction phrases per 1,000 outputs"],
      ["Cancel stays easy:", "cancel rate and time to cancel not worse than control"],
      ["Support load:", "contacts and complaints do not rise"],
      ["No pressure:", "average SIP amount not pushed up by the feature"]]],
    ["AI output quality", "Measured on the golden set, weekly", G, [
      ["Grounded:", "95%+ of claims supported by cited sources (today 11 of 12 answers)"],
      ["Retrieval precision@5:", "75%+ (today 43 to 78% across runs)"],
      ["Label agreement:", "85%+ relevance, 70%+ reason and need (hand labels pending)"],
      ["Safe fallback:", "100% refusal on advice and injection tests (today 19/19)"]]],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 4.18, w = 3.98;
    card(s, x, 2.55, w, 4.15, CARD, c[2], "metrics-col-" + (i + 1));
    T(s, [{ text: c[0] + "\n", options: { bold: true, color: c[2], fontSize: 19 } }, { text: c[1], options: { color: SOFT, fontSize: 14 } }], { x: x + 0.18, y: 2.62, w: w - 0.36, h: 0.7, fontSize: 14 });
    T(s, c[3].flatMap((m, k) => [{ text: m[0] + " ", options: { bold: true, color: c[2], breakLine: false } }, { text: m[1], options: { breakLine: k < c[3].length - 1, paraSpaceAfter: 5 } }]),
      { x: x + 0.18, y: 3.4, w: w - 0.36, h: 3.25, fontSize: 15.5 });
  });
  T(s, "Each leading metric sits on the path to the north star; each guardrail guards a way the feature could hurt investors.", { x: 0.5, y: 6.8, w: 12.3, h: 0.45, fontSize: 14, color: SOFT });
  s.addNotes("Business metric as given: increase the percentage of first-time mutual fund investors with an active SIP 12 months after starting. Active SIP = at least one successful instalment in the last 30 days. Targets are proposals pending Groww baseline data. Current AI numbers come from the engine evaluation: 19/19 tricky questions handled, retrieval precision 43-78% across six runs, 11 of 12 answers grounded in the final run.");
}

// =====================================================================================================================
// 9. RISKS
// =====================================================================================================================
{
  const s = newSlide("Risks: advice drift, wrong answers and pressure nudges matter most, and each has a built-in safeguard");
  const R = [
    ["Read as investment advice", S, "No fund or stock names, no return predictions, 'not advice' on every output, refusal tests, legal review before launch."],
    ["Wrong or invented answers", O, "Answers only from retrieved sources, numbers checked by code, golden-set release gate, failed checks fall back to AMFI and SEBI links, kill switch."],
    ["Retention pressure harms people who need cash", P, "No urgency or fear. Pause, reduce and cancel stay one tap away. Guardrail on cancel rate and time."],
    ["Biased evidence", G, "Public posts skew to vocal, experienced users and miss silent lapsers. Add 5 to 6 interviews and Groww cohort data, state the bias, A/B test against control."],
    ["Low adoption or extra friction", Y, "Show only at wobble moments, test wording, track opens and drop-off, never block the flow."],
    ["Privacy and free-tier limits", S, "No PAN, account or portfolio data; inputs are bands and percentages, not stored. Saved verified answers, caching and fallbacks cover quota limits."],
  ];
  R.forEach((r, i) => {
    const x = 0.5 + (i % 3) * 4.18, y = 1.5 + Math.floor(i / 3) * 2.62, w = 3.98, h = 2.48;
    card(s, x, y, w, h, CARD, r[1], "risk-" + (i + 1));
    badge(s, i + 1, x + 0.15, y + 0.13, r[1], 0.44);
    T(s, r[0], { x: x + 0.72, y: y + 0.08, w: w - 0.85, h: 0.55, fontSize: 16, bold: true, color: r[1], valign: "middle" });
    T(s, [{ text: "Mitigation: ", options: { bold: true } }, { text: r[2], options: { color: SOFT } }], { x: x + 0.2, y: y + 0.75, w: w - 0.4, h: h - 0.85, fontSize: 16 });
  });
  T(s, "Known limit today: the engine's strict judge still flags occasional over-generalised answers, so unverified answers are hidden, not shown.", { x: 0.5, y: 6.78, w: 12.3, h: 0.45, fontSize: 14, color: SOFT });
  s.addNotes("Risk ranking by severity: (1) regulatory and advice risk, (2) hallucination, (3) harm from retention pressure. Evidence bias is the main research risk: public text under-represents silent drop-offs, which is why interviews and Groww cohort data are required before launch. In the engine evaluation, one 'continue vs drop off' answer was flagged by the judge in two runs for over-generalising; the saved version passes.");
}

// =====================================================================================================================
// 10. HOW THE EVIDENCE WAS BUILT
// =====================================================================================================================
{
  const s = newSlide("How the evidence was built: an AI discovery engine reads 11,711 real conversations and is tested against a golden set");
  const st = [
    ["Collect", "40,000 Play Store reviews, 38.5K Reddit posts and 15.9K comments, 15.8K YouTube comments", S],
    ["Filter and sample", "Remove duplicates, keep SIP and mutual-fund talk, seeded sampling: 21,073 items", O],
    ["AI extraction", "Gemini codes each item: what happened, why, feeling, needs, why started, confusion, age. 11,711 analysed, 4,952 relevant", P],
    ["Check", "Quotes must appear word for word (98.5%). A stricter prompt removed 28% false 'relevant' items such as ULIP and PPF", G],
    ["Answer (RAG)", "Question, search terms, keyword and meaning search, AI re-rank, 2 to 3 sentence answer, four self-checks", Y],
    ["Evaluate", "19/19 tricky questions handled; precision@5 43 to 78%; 11/12 answers grounded; hand-labelled golden set to score extraction", S],
  ];
  st.forEach((c, i) => {
    const x = 0.5 + (i % 3) * 4.18, y = 1.5 + Math.floor(i / 3) * 2.2, w = 3.98, h = 2.05;
    card(s, x, y, w, h, CARD, c[2], "pipeline-" + (i + 1));
    badge(s, i + 1, x + 0.15, y + 0.13, c[2], 0.44);
    T(s, c[0], { x: x + 0.72, y: y + 0.1, w: w - 0.85, h: 0.5, fontSize: 16, bold: true, color: c[2], valign: "middle" });
    T(s, c[1], { x: x + 0.2, y: y + 0.7, w: w - 0.4, h: h - 0.8, fontSize: 16 });
  });
  card(s, 0.5, 5.98, 12.33, 0.72, CARD2, Y, "next-steps");
  T(s, [{ text: "Next: ", options: { bold: true, color: Y } }, { text: "5 to 6 interviews with early-career salaried first-time investors to confirm or kill the hypothesis, then build and test the MVP. " }, link("Try the live engine", ENGINE)], { x: 0.7, y: 5.98, w: 11.9, h: 0.72, fontSize: 16, valign: "middle" });
  T(s, "Free-tier stack: Gemini models, Vercel hosting. Data: public reviews, posts and comments shown as short excerpts without usernames.", { x: 0.5, y: 6.82, w: 12.3, h: 0.45, fontSize: 14, color: SOFT });
  s.addNotes("One-slide explanation of the discovery engine, as required. Collected: Play Store 40,000; Reddit posts 38,517 and comments 15,862; YouTube comments 15,799. After filters and seeded sampling the corpus is 21,073; 11,711 items analysed by Gemini in two passes; 4,952 judged relevant to a person's own mutual fund SIP. First prompt over-counted relevant items (ULIP, PPF, insurance): 510 of 1,804 flipped under the stricter prompt. Golden-set agreement numbers to be added once the hand-labelled set is scored.");
}

pres.writeFile({ fileName: "NL_Groww.pptx" }).then(f => console.log("written", f));
