// Builds NL_Groww.pptx: 10-slide problem-framing deck (no fellow name anywhere).
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";                         // 13.33 x 7.5 in
pres.author = "";
pres.company = "";
pres.title = "First-time SIP retention on Groww: problem framing, MVP and success metrics";

// ---------- palette: Groww brand, four colours only: white, Caribbean Green, Groww Blue, black ----------
// Green is used for shapes and lines (too light for text on white); text is black, headings and links blue.
const GREEN = "00D09C", BLUE = "5367F5", BLACK = "000000", PURE = "FFFFFF", RED = "EB5B3C";   // red only for falling-graph art
const BG = PURE, CARD = PURE, CARD2 = PURE, WHITE = BLACK, SOFT = BLACK, DARK = BLACK;   // old names kept so slide code is unchanged
const Y = GREEN, O = GREEN, S = BLUE, G = GREEN, P = BLUE;
const ART = "art/";
// every slide: green text becomes blue so it stays readable on white
const _addSlide = pres.addSlide.bind(pres);
const txt = c => (c === GREEN ? BLUE : c);
const fixRuns = r => { if (Array.isArray(r)) r.forEach(x => { if (x && x.options) { if (x.options.color) x.options.color = txt(x.options.color); if (x.options.underline && x.options.underline.color) x.options.underline.color = txt(x.options.underline.color); } }); };
pres.addSlide = (...a) => { const s = _addSlide(...a); const at = s.addText.bind(s);
  s.addText = (t, o = {}) => { if (o.keepGreen) delete o.keepGreen; else { fixRuns(t); if (o.color) o.color = txt(o.color); } return at(t, o); }; return s; };
const wm = (s, file, x, y, w, h) => s.addImage({ path: ART + file, x, y, w, h, altText: "Watermark art" });   // faint background art
const HEAD = "Arial", BODY = "Calibri";
const ENGINE = "https://nextleapgradprojectgrowwsipresearch.vercel.app/";

const BRAND = [
  { rect: { x: 0, y: 0, w: 0.12, h: 3.75, fill: { color: BLUE }, line: { color: BLUE } } },
  { rect: { x: 0, y: 3.75, w: 0.12, h: 3.75, fill: { color: GREEN }, line: { color: GREEN } } },
  { image: { x: 0.12, y: 7.27, w: 12.74, h: 0.2, path: ART + "ribbon.png" } },
  { image: { x: 12.93, y: 7.1, w: 0.32, h: 0.32, path: ART + "groww_logo.png" } },
];
pres.defineSlideMaster({
  title: "CONTENT", background: { color: BG },
  objects: [...BRAND, { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.28, w: 12.33, h: 1.05, fontFace: HEAD, fontSize: 27, bold: true, color: GREEN, valign: "middle", margin: 0 }, text: "" } }],
});
pres.defineSlideMaster({ title: "COVER", background: { color: BG }, objects: BRAND.slice(0, 3) });

function blobs() {}                                   // the brand bar, ribbon and logo now live on the slide master
function newSlide(title) {
  const s = pres.addSlide({ masterName: "CONTENT" });
  blobs(s);
  s.addText(title, { placeholder: "title" });
  return s;
}
const card = (s, x, y, w, h, fill = CARD, line = null, name = "card") =>
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.18, fill: { color: fill, transparency: fill === PURE ? 100 : 0 }, line: line ? { color: line, width: 2 } : { color: BLACK, width: 1 }, objectName: name });
const badge = (s, n, x, y, color, d = 0.5) => {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { color }, objectName: "badge-" + n });
  s.addText(String(n), { x, y, w: d, h: d, align: "center", valign: "middle", fontFace: HEAD, fontSize: 18, bold: true, color: color === BLUE ? PURE : BLACK, margin: 0, isTextBox: true });
};
const T = (s, runs, o) => s.addText(runs, Object.assign({ fontFace: BODY, fontSize: 15, color: WHITE, margin: 0, valign: "top", isTextBox: true }, o));
const link = (text, url, color = Y) => ({ text, options: { hyperlink: { url, tooltip: url }, color, underline: { style: "sng", color }, bold: true } });

// =====================================================================================================================
// 1. COVER
// =====================================================================================================================
{
  const s = pres.addSlide({ masterName: "COVER" });
  s.addImage({ path: ART + "groww_logo.png", x: 0.7, y: 0.55, w: 0.62, h: 0.62, altText: "Groww logo" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.5, y: 0.61, w: 6.2, h: 0.5, rectRadius: 0.25, fill: { color: PURE }, line: { color: BLUE, width: 1.5 }, objectName: "kicker" });
  T(s, "NextLeap graduation project  |  Growth PM case: Groww", { x: 1.5, y: 0.61, w: 6.2, h: 0.5, fontSize: 16, bold: true, color: BLUE, align: "center", valign: "middle" });
  T(s, "Cracking the 12-Month Horizon: Re-Engineering First-Time Investor Retention on Groww", { x: 0.7, y: 1.4, w: 7.15, h: 2.15, fontFace: HEAD, fontSize: 33, bold: true, valign: "middle", color: GREEN, keepGreen: true });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.72, y: 3.62, w: 1.4, h: 0.09, fill: { color: BLUE }, line: { color: BLUE }, objectName: "title-underline" });
  T(s, "A case study on why first-time investors stop their SIP when returns fall, and how to keep them invested through year one", { x: 0.7, y: 3.85, w: 7.1, h: 0.95, fontSize: 19 });
  s.addImage({ path: ART + "cover_art.png", x: 7.95, y: 0.55, w: 4.9, h: 4.0, altText: "Art: a SIPal sprout on a stack of rupee coins beside a rising green line, green and blue candles and a dashed blue line that falls and recovers" });
  card(s, 0.7, 4.95, 12.13, 0.95, PURE, GREEN, "north-star");
  T(s, [{ text: "North-star metric: ", options: { bold: true, color: BLUE } }, { text: "percentage of first-time mutual fund investors who still have an active SIP 12 months after starting their first one." }], { x: 0.95, y: 4.98, w: 11.6, h: 0.9, fontSize: 19, valign: "middle" });
  T(s, [{ text: "11,711", options: { bold: true, color: BLUE } }, { text: " conversations analysed  |  " }, { text: "8,871", options: { bold: true, color: BLUE } }, { text: " about real SIP journeys  |  " },
        { text: "19", options: { bold: true, color: BLUE } }, { text: "-person survey  |  " }, { text: "4", options: { bold: true, color: BLUE } }, { text: " interviews  |  " }, link("Discovery engine", ENGINE, BLUE), { text: "  |  " }, link("SIPal MVP", "https://nextleapgradprojectgrowwsipresearch.vercel.app/sipal/", BLUE)], { x: 0.7, y: 6.12, w: 12.1, h: 0.4, fontSize: 15 });
  T(s, "Independent study. Not affiliated with Groww; Groww logo shown for identification only. Not investment advice. Mutual fund investments are subject to market risks.", { x: 0.7, y: 6.62, w: 12.1, h: 0.5, fontSize: 14 });
  s.addNotes("Title slide. North-star metric as given in the brief. Numbers: 11,711 conversations analysed by the discovery engine, 8,871 judged relevant to a person's own mutual fund SIP (v3 labelling prompt); survey of 19 unique respondents; 4 interviews. Name of the fellow intentionally not shown.");
}

// =====================================================================================================================
// 2. KPI TREE (business metric decomposition)
// =====================================================================================================================
{
  const s = newSlide("KPI tree: the 12-month active SIP rate comes down to whether each monthly instalment is paid, adjusted or recovered");
  wm(s, "wm_rise.png", 3.2, 1.7, 9.6, 4.1);
  require("./kpi_tree_v3.js")(pres, s, { CARD, CARD2, WHITE, SOFT, DARK, Y, O, BODY });
}

// =====================================================================================================================
// 3. DISCOVERY ENGINE FINDINGS + USER RESEARCH INSIGHTS
// =====================================================================================================================
{
  const s = newSlide("Discovery and user research: across 8,871 real SIP conversations, falling returns are the biggest reason first-timers stop");
  wm(s, "wm_rise.png", 0.6, 1.5, 12.2, 5.2);
  const SIPAL = "https://nextleapgradprojectgrowwsipresearch.vercel.app/sipal/";
  // left: how the engine works
  card(s, 0.5, 1.45, 3.95, 5.72, PURE, BLUE, "engine");
  T(s, "How the AI discovery engine works", { x: 0.68, y: 1.53, w: 3.6, h: 0.36, fontSize: 16, bold: true, color: BLUE });
  const steps = [["110K", "public reviews, Reddit posts and comments, YouTube comments collected"], ["21,073", "kept after removing spam, ads and duplicates"],
    ["11,711", "read and labelled by Gemini: what happened, why, feeling, need"], ["8,871", "about a real person's own mutual fund SIP"], ["334", "show a SIP stopping, pausing or failing; 230 say why"]];
  steps.forEach((st, i) => {
    const y = 1.98 + i * 0.74;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.68, y, w: 1.05, h: 0.6, rectRadius: 0.08, fill: { color: i === 4 ? GREEN : PURE }, line: { color: GREEN, width: 1.5 }, objectName: "funnel-step" });
    T(s, st[0], { x: 0.68, y, w: 1.05, h: 0.6, fontSize: 15, bold: true, align: "center", valign: "middle", color: BLACK });
    T(s, st[1], { x: 1.83, y: y - 0.02, w: 2.5, h: 0.66, fontSize: 14, valign: "middle" });
  });
  T(s, [{ text: "Checked: ", options: { bold: true, color: BLUE } }, { text: "97.8% of quotes word for word; a 20-post golden set labelled by hand. " }, link("Ask the live engine", ENGINE, BLUE)],
    { x: 0.68, y: 5.72, w: 3.6, h: 1.38, fontSize: 14 });
  // middle: where SIPs break
  card(s, 4.6, 1.45, 4.05, 5.72, PURE, GREEN, "where-break");
  T(s, "Why SIPs stop: 230 stated reasons", { x: 4.78, y: 1.53, w: 3.7, h: 0.36, fontSize: 16, bold: true, color: BLUE });
  const bars = [["Low returns, wrong expectations or confusing numbers", 33], ["A missed or failed instalment (payment, autopay, app)", 24], ["Money pressure or a life event (loan, job, move)", 23], ["A better option elsewhere or others' advice", 19]];
  bars.forEach((b, i) => {
    const y = 2.0 + i * 0.98;
    T(s, b[0], { x: 4.78, y, w: 3.7, h: 0.48, fontSize: 14 });
    s.addShape(pres.shapes.RECTANGLE, { x: 4.78, y: y + 0.5, w: 2.9 * b[1] / 33, h: 0.32, fill: { color: i === 0 ? GREEN : PURE }, line: { color: GREEN, width: 1.5 }, objectName: "bar-" + i });
    T(s, b[1] + "%", { x: 4.82 + 2.9 * b[1] / 33, y: y + 0.47, w: 0.7, h: 0.38, fontSize: 15, bold: true, valign: "middle" });
  });
  T(s, [{ text: "33% ", options: { bold: true, color: BLUE } }, { text: "is the single biggest reason: low returns, wrong expectations or numbers they can't read (solid bar)." }],
    { x: 4.78, y: 5.98, w: 3.72, h: 1.1, fontSize: 14 });
  // right: insights with real quotes
  card(s, 8.8, 1.45, 4.03, 5.72, PURE, BLUE, "insights");
  T(s, "What investors are telling us", { x: 8.98, y: 1.53, w: 3.7, h: 0.36, fontSize: 16, bold: true, color: BLUE });
  T(s, [
    { text: "82% ", options: { bold: true, color: BLUE } }, { text: "of 1,061 posts about falling or confusing returns sound confused, anxious or frustrated.", options: { breakLine: true } },
    { text: "1  Unsure", options: { bold: true, color: BLUE, breakLine: true } }, { text: "\u201CShould I Stop My SIP in a Small-Cap Fund Underperforming the Benchmark?\u201D", options: { italic: true, breakLine: true } },
    { text: "2  Panicking", options: { bold: true, color: BLUE, breakLine: true } }, { text: "\u201CSip band kar do kyun ki market aur gire ga.\u201D", options: { italic: true, breakLine: true } },
    { text: "3  Shaken", options: { bold: true, color: BLUE, breakLine: true } }, { text: "\u201C\u2026I am scared to jump back in\u201D", options: { italic: true, breakLine: true } },
    { text: "4  Confused by the numbers", options: { bold: true, color: BLUE, breakLine: true } }, { text: "\u201C\u2026my dashboard is showing less than 50% of my invested amount.\u201D", options: { italic: true, breakLine: true } },
    { text: "5  Giving up at the low", options: { bold: true, color: BLUE, breakLine: true } }, { text: "\u201CThat\u2019s was kinda my reason of stopping sips. My portfolio is the lowest point now.\u201D", options: { italic: true } }],
    { x: 8.98, y: 1.93, w: 3.72, h: 5.18, fontSize: 14, paraSpaceAfter: 2 });
  s.addNotes("Discovery engine (v3 labelling prompt): collected 40,000 Play Store reviews, 38,517 Reddit posts, 15,862 Reddit comments and 15,799 YouTube comments; 21,073 kept after cleaning and seeded sampling; 11,711 analysed; 8,871 relevant to a person's own mutual fund SIP; 334 drop-off signals, 230 with a stated reason. " +
    "Stated reasons: low or negative returns 37, failed payment or mandate 34, cash-flow pressure 32, better alternative 25, app issue 22, expectation mismatch 22, life event 21, others' advice 19, confusion about numbers 18. Grouped: low returns, expectations or confusing numbers 33%; missed or failed instalment (payment, mandate, app) 24%; money pressure or life event 23%; better option or advice 19%. " +
    "First-year posts: trusted help is the main need in 421 of 774 (54%). Quotes are real public excerpts, shown without usernames. Golden set: 20 posts labelled by hand; label agreement 63 to 67 of 100 after prompt fixes (in-sample).");
}

// =====================================================================================================================
// 4. IMPACT MAPPING + SEGMENTS
// =====================================================================================================================
{
  const s = newSlide("Chosen target segment: of about 2 to 3 million first-time Groww SIP investors a year, we choose salaried 22 to 30, the largest group");
  wm(s, "wm_rise.png", 0.4, 1.5, 8.6, 3.7);
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
  const line = (x, y, w, hh) => s.addShape(pres.shapes.LINE, { x, y, w, h: hh, line: { color: BLACK, width: 1.25 }, objectName: "seg-connector" });
  line(cx, fBottom, 0, busY - fBottom); line(sx0 + sw / 2, busY, 3 * (sw + sg), 0);
  segs.forEach(([key, name, col], i) => {
    const x = sx0 + i * (sw + sg), hot = key === top[0], sh_ = SEGN.share[key];
    line(x + sw / 2, busY, 0, sy - busY);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: sy, w: sw, h: sh, rectRadius: 0.12, fill: { color: hot ? GREEN : CARD }, line: { color: hot ? BLACK : col, width: hot ? 2 : 1.75 }, objectName: "segment-" + key });
    const amt = v => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${Math.round(v / 1e4) * 10}K`);
    const size = `~${amt(sh_ * 2e4)}-${amt(sh_ * 3e4)} a year`;
    T(s, (hot ? [{ text: "Chosen segment", options: { bold: true, color: BLACK, fontSize: 14, breakLine: true } }] : []).concat([
        { text: name, options: { bold: true, fontSize: 14, breakLine: true } }, { text: `${sh_}% of first-timers`, options: { color: hot ? BLACK : col, bold: true, fontSize: 14, breakLine: true } },
        { text: size, options: { color: SOFT, fontSize: 14 } }]),
      { x: x + 0.1, y: sy + 0.03, w: sw - 0.2, h: sh - 0.06, valign: "middle", align: "center", fontSize: 14 });
  });
  card(s, 9.05, 1.45, 3.78, 1.6, CARD, S, "why-door");
  T(s, [{ text: "The entry door\n", options: { bold: true, color: S, fontSize: 16 } }, { text: "36% of new Groww users start with a SIP (Q2 FY26, up 7 points on last year). For many, the first SIP is their first product on Groww." }], { x: 9.22, y: 1.54, w: 3.45, h: 1.46, fontSize: 14.5 });
  card(s, 9.05, 3.2, 3.78, 1.65, CARD, O, "why-leak");
  T(s, [{ text: "The leak\n", options: { bold: true, color: O, fontSize: 16 } }, { text: "SIP stoppage ratio 78.5% in Sep 2026: 63.26 lakh new SIPs vs 49.68 lakh closed or completed. Acquisition works; keeping SIPs alive is the gap." }], { x: 9.22, y: 3.29, w: 3.45, h: 1.5, fontSize: 14.5 });
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
// 5. HYPOTHESIS (one segment, one moment: falling returns)
// =====================================================================================================================
{
  const s = newSlide("Hypothesis: when returns fall, first-timers get no calm, plain explanation in the app, so they stop their SIP");
  const SEGN = require("./segment_numbers.json");
  T(s, [{ text: "Segment: ", options: { bold: true, color: BLUE } }, { text: `salaried first-time SIP investors, 22-30, in year one (${SEGN.share.early}% of first-timers)` },
        { text: "      Moment: ", options: { bold: true, color: BLUE } }, { text: "the week their returns fall" }],
    { x: 0.5, y: 1.38, w: 12.33, h: 0.34, fontSize: 15 });
  card(s, 0.5, 1.8, 12.33, 1.22, PURE, GREEN, "hypothesis-statement");
  T(s, [{ text: "We believe ", options: { bold: true, color: BLUE } }, { text: "salaried first-time investors stop their SIP when their returns fall, " },
        { text: "because ", options: { bold: true, color: BLUE } }, { text: "nothing in the app calmly explains, in plain words, why their value fell and whether that is normal, so stopping feels like the only way to avoid losing more. " },
        { text: "If ", options: { bold: true, color: BLUE } }, { text: "SIPal explains their own numbers at the dip and offers a gentler step than stopping (pay less this month), " },
        { text: "then ", options: { bold: true, color: BLUE } }, { text: "more of them will stay invested." }],
    { x: 0.7, y: 1.84, w: 11.95, h: 1.14, fontSize: 16, valign: "middle" });
  const steps = [
    ["1  Starts hopeful", "Expects steady growth of 10% to 15%+ a year"],
    ["2  Returns fall", "A red week; value dips below what was invested"],
    ["3  Root cause", "No calm answer: the app shows the loss, not why or if it's normal"],
    ["4  Fear of losing more", "Asks Reddit, friends or influencers, or freezes"],
    ["5  Stops the SIP", "Cancels or redeems, often at a low point"]];
  const cw = 2.25, cg = 0.27, cy = 3.14, ch = 1.18;
  steps.forEach((st, i) => {
    const x = 0.5 + i * (cw + cg), root = i === 2;
    card(s, x, cy, cw, ch, PURE, root ? GREEN : BLUE, "hyp-step-" + (i + 1));
    if (root) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cy, w: cw, h: ch, rectRadius: 0.18, fill: { color: PURE, transparency: 100 }, line: { color: GREEN, width: 3.5 }, objectName: "root-cause-highlight" });
    T(s, [{ text: st[0], options: { bold: true, color: BLUE, fontSize: 15, breakLine: true } }, { text: st[1], options: { fontSize: 14 } }], { x: x + 0.12, y: cy + 0.07, w: cw - 0.24, h: ch - 0.12, fontSize: 14 });
    if (i < 4) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + cw + 0.04, y: cy + ch / 2 - 0.13, w: 0.19, h: 0.26, fill: { color: BLACK }, line: { color: BLACK }, objectName: "hyp-arrow-" + (i + 1) });
  });
  s.addImage({ path: ART + "icon_fall.png", x: 4.38, y: 3.19, w: 0.5, h: 0.33, altText: "Falling graph in red" });
  card(s, 0.5, 4.45, 6.05, 2.77, PURE, BLUE, "hyp-evidence");
  T(s, [{ text: "Why we believe it (discovery engine)", options: { bold: true, color: BLUE, fontSize: 16, breakLine: true } },
    { text: "Low returns, wrong expectations or confusing numbers: 33% of stated drop-off reasons, the largest group", options: { bullet: true, breakLine: true } },
    { text: "82% of 1,061 posts about falling returns sound confused, anxious or frustrated", options: { bullet: true, breakLine: true } },
    { text: "65% of them ask for a plain explanation, \u201Cis this normal?\u201D or realistic expectations", options: { bullet: true, breakLine: true } },
    { text: "62 of 77 returns-driven drop-offs had already stopped; 74% sounded anxious, frustrated or confused (54% for other reasons)", options: { bullet: true, breakLine: true } },
    { text: "Plain answers come from Reddit and YouTube, not the app", options: { bullet: true } }],
    { x: 0.68, y: 4.5, w: 5.72, h: 2.66, fontSize: 14, paraSpaceAfter: 2 });
  card(s, 6.75, 4.45, 6.08, 2.77, PURE, GREEN, "hyp-test");
  T(s, [{ text: "How we will test it, and why \u201Cpay less\u201D", options: { bold: true, color: BLUE, fontSize: 16, breakLine: true } },
    { text: "Test: ", options: { bold: true } }, { text: "A/B test in the next down week with salaried 22-30 first-timers: SIPal's check-in vs today's app.", options: { breakLine: true } },
    { text: "Right if: ", options: { bold: true } }, { text: "fewer open stop after the dip (stop-intent down) and more who do pay less instead (stop-to-adjust up).", options: { breakLine: true } },
    { text: "Wrong if: ", options: { bold: true } }, { text: "investors who understand the dip still stop as often.", options: { breakLine: true } },
    { text: "Pay less: ", options: { bold: true } }, { text: "a gentler step than stopping that keeps the SIP alive; it does not shrink a loss already shown.", options: { breakLine: true } },
    { text: "Guardrail: ", options: { bold: true } }, { text: "cancel stays one tap away, and no alert uses fear or urgency." }],
    { x: 6.93, y: 4.52, w: 5.75, h: 2.64, fontSize: 14, paraSpaceAfter: 5 });
  s.addNotes("One segment, one moment, one root cause. Segment: salaried first-time SIP investors aged 22-30 in the first year of their SIP (the largest first-timer group). Moment: a week or month when returns fall. Root cause: the app shows the loss but nothing calmly explains, in plain words, why the value fell and whether it is normal, so stopping feels like the only way to avoid losing more. " +
    "Evidence: discovery engine, 230 stated drop-off reasons: low or negative returns, expectation mismatch and confusing numbers 33% (the largest group); in the target segment, 84% of those who state an expectation expect steady long-term growth (378 of 450), and trusted, plain answers come from Reddit and YouTube rather than the app. Survey n=19: 10 thought of stopping or pausing (6 yes, 4 maybe); reasons included market-fall news 5 and low profit 2; 9 did nothing next. " +
    "Interviews: Praveen thought of quitting over low returns and poor market knowledge; Darshan found notifications too technical ('if they had given information in simple terms life would have been easy') and was drawn to ETFs and bonds; none of the 4 turned to the app when worried (brother, Reddit, friend, nothing). " +
    "On pay less: paying less does not reduce losses on units already held, and in a dip each rupee buys more units, so SIPal offers pay-less only as a gentler alternative to stopping, never as a way to avoid losses (that would be market timing and investment advice). Measured by the stop-to-adjust rate from the KPI tree.");
}

// =====================================================================================================================
// 6. SURVEY + INTERVIEWS + PERSONAS
// =====================================================================================================================
{
  const s = newSlide("Survey and interviews: 10 of 19 thought of stopping, and when returns felt low, none of 4 interviewees turned to the app");
  const SV = require("./survey_numbers.json");
  const thought = (SV.q7_thought_stop.Yes || 0) + (SV.q7_thought_stop.Maybe || 0);
  T(s, "Validation of hypothesis", { x: 0.5, y: 1.36, w: 12.33, h: 0.32, fontSize: 17, bold: true, color: BLUE, valign: "middle" });
  card(s, 0.5, 1.72, 6.1, 2.42, PURE, GREEN, "survey");
  T(s, `Survey snapshot (n=${SV.n})`, { x: 0.68, y: 1.76, w: 5.7, h: 0.34, fontSize: 15, bold: true, color: BLUE });
  const tiles = [[`${thought} of ${SV.n}`, `thought of stopping or pausing (${SV.q7_thought_stop.Yes} yes, ${SV.q7_thought_stop.Maybe} maybe)`],
    [`${SV.q9_next["I did nothing"]} of ${SV.n}`, `did nothing next; ${SV.q9_next["Discussed with a friend"]} asked a friend, ${Object.entries(SV.q9_next).find(([k]) => k.startsWith("Looked for"))[1]} followed influencers`],
    [`${SV.q8_reason["News about the market falling"]} and ${SV.q8_reason["The profit was low"]}`, "cited news of the market falling, or low profit"],
    [`${SV.q9_next["Discussed with a friend"] + 3} of ${SV.n}`, "turned to a friend or influencers; none to the app"]];
  tiles.forEach((t, i) => {
    const x = 0.68 + (i % 2) * 2.92, y = 2.1 + Math.floor(i / 2) * 1.0;
    T(s, [{ text: t[0], options: { bold: true, fontSize: 20, color: BLUE, breakLine: true } }, { text: t[1], options: { fontSize: 14 } }], { x, y, w: 2.8, h: 1.05 });
  });
  card(s, 6.75, 1.72, 6.08, 2.42, PURE, BLUE, "interviews");
  T(s, "Interview findings (4 salaried SIP investors)", { x: 6.93, y: 1.76, w: 5.7, h: 0.34, fontSize: 15, bold: true, color: BLUE });
  T(s, [
    { text: "2 of 4 thought of quitting over low returns or jargon", options: { bullet: true, breakLine: true } },
    { text: "0 of 4 turned to the app when worried: brother, Reddit, friend, or nothing", options: { bullet: true, breakLine: true } },
    { text: "3 of 4 expected 10% or more a year, or \u201Cexponential\u201D growth", options: { bullet: true, breakLine: true } },
    { text: "4 of 4 named a gentler step than stopping: pay less, skip, move the date", options: { bullet: true, breakLine: true } },
    { text: "All 4 want help as a notification, in plain words", options: { bullet: true } }],
    { x: 6.93, y: 2.1, w: 5.75, h: 2.0, fontSize: 14, paraSpaceAfter: 1 });
  const P2 = [
    { x: 0.5, col: BLUE, ini: "P", name: "Praveen, 34", tag: "Watches the graph, nearly quit", rows: [
      ["Demographics", "salaried; first-ever SIP about 4 months ago, mid-month date"],
      ["App usage", "checks the graph every morning; has used skip and lowered the amount"],
      ["Key goals", "make money, at least 10% a year; wants the app to explain his portfolio"],
      ["Core friction", "low returns and little market knowledge made him think of quitting; asked a friend"]] },
    { x: 6.75, col: GREEN, ini: "D", name: "Darshan, 27", tag: "Lost in jargon, eyed other options", rows: [
      ["Demographics", "salaried; first-ever SIP in 2022; 3 to 4 SIPs, Rs 5,000 a month"],
      ["App usage", "opened the app daily in year one (\u201Cadrenaline\u201D); read FAQs to use skip"],
      ["Key goals", "steady, organic growth, \u201Cnot too over excited\u201D; simple explanations"],
      ["Core friction", "notifications full of jargon he had to Google; ETFs and bonds looked better"]] }];
  T(s, "Respondent personas", { x: 0.5, y: 4.2, w: 12.33, h: 0.32, fontSize: 17, bold: true, color: BLUE, valign: "middle" });
  P2.forEach((p, i) => {
    card(s, p.x, 4.56, i ? 6.08 : 6.1, 2.66, PURE, p.col, "persona-" + (i + 1));
    s.addShape(pres.shapes.OVAL, { x: p.x + 0.18, y: 4.64, w: 0.5, h: 0.5, fill: { color: p.col }, line: { color: p.col }, objectName: "avatar-" + (i + 1) });
    T(s, p.ini, { x: p.x + 0.18, y: 4.64, w: 0.5, h: 0.5, fontSize: 18, bold: true, align: "center", valign: "middle", color: p.col === BLUE ? PURE : BLACK });
    T(s, [{ text: p.name, options: { bold: true, color: BLUE } }, { text: "  ·  " + p.tag, options: { bold: true } }], { x: p.x + 0.8, y: 4.66, w: 5.1, h: 0.46, fontSize: 16, valign: "middle" });
    T(s, p.rows.flatMap((r, k) => [{ text: r[0] + ": ", options: { bold: true, color: BLUE } }, { text: r[1], options: { breakLine: k < 3 } }]), { x: p.x + 0.2, y: 5.18, w: 5.72, h: 1.98, fontSize: 14, paraSpaceAfter: 1 });
  });
  s.addNotes(`Survey: ${SV.n} unique respondents (one duplicate removed, latest answer kept); 18 have started a SIP. Thought of stopping or pausing: ${SV.q7_thought_stop.Yes} yes, ${SV.q7_thought_stop.Maybe} maybe. Reasons (multi-select): needed money ${SV.q8_reason["I needed money"]}, market-fall news ${SV.q8_reason["News about the market falling"]}, low profit ${SV.q8_reason["The profit was low"] || 0}, other funds better ${SV.q8_reason["Other funds are doing better"] || 0}. ` +
    `What next: did nothing ${SV.q9_next["I did nothing"]}, friend ${SV.q9_next["Discussed with a friend"]}, influencers 3, Google ${SV.q9_next["Searched in Google"] || 0}, family ${SV.q9_next["Asked a family member"] || 0}. First platform: Groww ${SV.q4_platform.Groww} of ${SV.n}. ` +
    "Interviews: Sudhanva, Darshan, Praveen, Akshata (all salaried); answers as given. Personas are two of the interviewees whose doubt came from returns: Praveen (thought of quitting over low returns and little market knowledge; aged 34, just above the 22-30 band, but in his first year) and Darshan (27; in his first year opened the app daily, later found notifications full of jargon and was drawn to ETFs and bonds; his first SIP was in 2022).");
}

// =====================================================================================================================
// 7. PROBLEM FRAMING CANVAS (aligned to the validated hypothesis)
// =====================================================================================================================
{
  const s = newSlide("Problem: when returns fall, first-timers get no calm, plain explanation in the app, so a dip turns into a stop");
  wm(s, "wm_fall.png", 0.4, 1.45, 12.4, 5.4);
  s.addImage({ path: ART + "icon_fall.png", x: 4.0, y: 1.53, w: 0.84, h: 0.56, altText: "Falling graph in red" });
  const KN = require("./kpi_numbers.json"), SEGN = require("./segment_numbers.json");
  const box = (n, title, color, x, y, w, h, body, size = 15) => {
    card(s, x, y, w, h, CARD, color, "canvas-" + n);
    badge(s, n, x + 0.15, y + 0.12, color, 0.46);
    T(s, title, { x: x + 0.75, y: y + 0.12, w: w - 0.9, h: 0.46, fontSize: 16, bold: true, color, valign: "middle" });
    T(s, body, { x: x + 0.2, y: y + 0.68, w: w - 0.4, h: h - 0.78, fontSize: size });
  };
  const bl = (t, last) => ({ text: t, options: last ? { bullet: true } : { bullet: true, breakLine: true, paraSpaceAfter: 4 } });
  box(1, "What is the true problem?", S, 0.5, 1.45, 4.45, 2.95,
    "First-timers start a SIP expecting steady growth. When returns fall, the app shows a red number but nothing explains, in plain words, why it fell or whether a dip is normal in year one. Read as a loss that will grow, the dip turns into a stop or a redemption, often at a low point.", 14.5);
  box(2, "Who faces it?", O, 5.1, 1.45, 3.35, 2.95,
    `Salaried first-time investors, 22 to 30, in their first 12 months: ${SEGN.share.early}% of first-timers who state age or income, about 1.0 to 1.5 million a year on Groww (estimate). Personas: Praveen and Darshan.`, 14);
  box(3, "How do we know it is real?", P, 8.6, 1.45, 4.23, 2.95, [
    bl(`Low returns, wrong expectations or confusing numbers: ${KN.S2b}% of stated drop-off reasons, the largest group (n=${KN.stated})`),
    bl("Survey: 10 of 19 thought of stopping; market-fall news and low profit among the reasons"),
    bl("Interviews: 2 of 4 nearly quit over returns; 0 of 4 asked the app", true)], 14);
  box(4, "What value does solving it create?", G, 0.5, 4.55, 6.0, 2.7, [
    { text: "For investors: ", options: { bold: true, color: G } }, { text: "in a down week, a calm answer to “why did it fall, is this normal, what can I do” with their own numbers, and a gentler step than stopping.", options: { breakLine: true } },
    { text: "For Groww: ", options: { bold: true, color: G } }, { text: "fewer stops after dips and a higher 12-month active-SIP rate. Each +1 point keeps roughly 20,000 to 30,000 first-time investors a year (estimate).", options: { breakLine: true } },
    { text: "Why AI: ", options: { bold: true, color: G } }, { text: "every dip is personal (own funds, own week), so one fixed FAQ cannot explain it; a checked AI can, for millions." }], 14.5);
  box(5, "Why solve it now?", Y, 6.65, 4.55, 6.18, 2.7, [
    bl("Acquisition works, retention lags: record Rs 32,490 crore monthly SIPs, yet a 78.5% stoppage ratio (Sep 2026)"),
    bl("36% of new Groww users start SIP-first, so every market dip now reaches more first-timers"),
    bl("Groww already shows each return and has an AI assistant (GR-1), but nothing explains a dip at the moment it happens", true)], 15);
  s.addNotes("One problem, aligned to the hypothesis on slide 5: when returns fall, first-timers get no calm, plain explanation in the app, so a dip turns into a stop. " +
    `Public-data numbers, discovery engine v3: of ${KN.stated} drop-off posts that state a reason, low or negative returns, expectation mismatch and confusing numbers are ${KN.S2b}%, the largest group (missed or broken SIPs ${KN.S1}%, money pressure or a life event ${KN.S2a}%, a better alternative or others' advice ${KN.S2c}% are out of scope here). Trusted help is the main need in ${KN.O4_fy}% of ${KN.first_year} first-year posts. ` +
    "Survey n=19: 10 thought of stopping or pausing; reasons included market-fall news 5 and low profit 2. Interviews: Praveen and Darshan thought of quitting over returns or jargon; none of the 4 turned to the app when worried. The 20,000 to 30,000 per point figure is 1% of the estimated 2 to 3 million first-time SIP investors a year and must be checked against Groww cohort data. " +
    "Record monthly SIP flows Rs 32,490 crore and stoppage ratio 78.53% are for September 2026 (AMFI via media reports).");
}

// =====================================================================================================================
// 8. SOLUTION RATIONALE (three ideas scored with RICE)
// =====================================================================================================================
{
  const s = newSlide("Solution rationale: a calm alert in the week returns fall scores highest on RICE and meets the root cause");
  const hdr = ["Idea", "Reach", "Impact", "Confidence", "Effort", "RICE", "Fixes the root cause at the moment?"].map(t => ({ text: t, options: { bold: true, color: PURE, fill: { color: BLUE }, align: "center", valign: "middle" } }));
  const row = (cells, chosen) => cells.map((t, i) => ({ text: t, options: { fill: { color: chosen ? GREEN : PURE }, color: BLACK, bold: chosen && i === 0, align: i === 0 || i === 6 ? "left" : "center", valign: "middle" } }));
  const rows = [hdr,
    row(["1  Alerts with a calm guide: what happened, is it normal, what you can do", "90%", "2", "80%", "3", "48", "Yes: reaches investors in the week their returns fall"], true),
    row(["2  AI voice bot in the Dashboards tab", "10%", "1", "30%", "4", "0.8", "No: the investor has to go and ask"], false),
    row(["3  SIPal guidebook with AI videos in Explore", "20%", "0.5", "50%", "5", "1.0", "Partly: general learning, not their moment"], false)];
  s.addTable(rows, { x: 0.5, y: 1.45, w: 12.33, colW: [3.75, 0.95, 0.95, 1.25, 0.95, 0.95, 3.53], fontFace: BODY, fontSize: 14, border: { type: "solid", pt: 1, color: BLACK }, rowH: [0.42, 0.72, 0.6, 0.6] });
  T(s, "RICE = Reach x Impact x Confidence / Effort. Reach: share of the target segment touched in a quarter. Impact: 0.5 low to 3 massive. Effort: person-months. All values are estimates.",
    { x: 0.5, y: 3.88, w: 12.33, h: 0.5, fontSize: 14 });
  const C3 = [
    ["Why idea 1 wins", GREEN, "It is the only idea that comes to the investor in the week returns fall, instead of waiting to be found. Low returns are the largest stated drop-off reason (33%), none of the 4 interviewees turned to the app when worried, and all 4 asked for a notification. It also scores far higher on RICE: 48, against 1.0 and 0.8."],
    ["How it was refined", BLUE, "Combined: a calm check-in that explains the dip with the investor's own funds and the week's economic reasons, plus a gentler step than stopping (pay less this month), offered again in daily reminders before the debit. Weekly, not daily; never advice; pay less is never pitched as loss protection."],
    ["How this helps", BLUE, "Investors get a calm, plain answer in the week their returns fall: why their own funds moved, whether a dip is normal in year one, and a gentler step than stopping. Groww keeps more first-timers investing through dips, measured by lower stop-intent and higher stop-to-adjust."]];
  C3.forEach((c, i) => {
    const x = 0.5 + i * 4.18;
    card(s, x, 4.48, 3.98, 2.72, PURE, c[1], "why-" + i);
    T(s, [{ text: c[0], options: { bold: true, color: BLUE, fontSize: 16, breakLine: true } }, { text: c[2] }], { x: x + 0.18, y: 4.56, w: 3.62, h: 2.58, fontSize: 14.5 });
  });
  s.addNotes("Three ideas proposed by the Fellow: (1) performance alerts that open one calm screen (what happened, is it normal, what you can do, returns, why the amount moved, how the market is doing); (2) an AI voice bot in the Dashboards tab; (3) a SIPal guidebook icon in Explore with AI-generated animated videos. " +
    "RICE inputs (estimates): reach as the share of salaried 22-30 first-timers touched per quarter (push alerts reach almost everyone with an active SIP; voice and guidebook rely on the investor going to look); impact on the 12-month active rate; confidence from evidence (interviews 4/4 want notifications; nobody asked for voice; one interviewee asked for a guide); effort in person-months (videos need generation and compliance review). " +
    "Refinements: weekly rather than daily because frequent return checks raise loss-focused behaviour (myopic loss aversion) and notifications get lost; numbers and reasons come from data; fund names only for the investor's own holdings.");
}

// =====================================================================================================================
// 9. MVP AND USER TESTING
// =====================================================================================================================
{
  const s = newSlide("MVP and user testing: SIPal is live, every AI answer is checked before it shows, and 3 users' feedback is built in");
  const SIPAL = "https://nextleapgradprojectgrowwsipresearch.vercel.app/sipal/";
  card(s, 0.5, 1.45, 4.25, 1.9, PURE, GREEN, "what");
  T(s, [{ text: "What SIPal is", options: { bold: true, color: BLUE, fontSize: 16, breakLine: true } },
        { text: "A calm in-app guide for the week returns fall: a check-in that explains your own funds and why the market moved, in plain words, and a gentler step than stopping (pay less this month), offered again in reminders before the debit." }],
    { x: 0.68, y: 1.52, w: 3.92, h: 1.8, fontSize: 14 });
  card(s, 0.5, 3.45, 4.25, 2.42, PURE, BLUE, "gate");
  T(s, [{ text: "AI with a quality gate", options: { bold: true, color: BLUE, fontSize: 16, breakLine: true } },
        { text: "AI only words the facts it is given. Each answer is checked (numbers, no advice, no fund tips, calm tone, a source), or a safe fallback shows. Golden set 18/20; advice-free 20/20; safety tests 17/17.", options: { breakLine: true } },
        { text: "Where AI earns its place: ", options: { bold: true } }, { text: "answering each investor's own question, in their own words." }],
    { x: 0.68, y: 3.51, w: 3.92, h: 2.32, fontSize: 14 });
  card(s, 0.5, 5.97, 4.25, 1.23, PURE, GREEN, "link");
  T(s, [{ text: "Try it live: ", options: { bold: true, color: BLUE } }, link("SIPal MVP", SIPAL, BLUE), { text: "\nnextleapgradprojectgrowwsipresearch.vercel.app/sipal", options: { fontSize: 14 } },
        { text: "\nSample data, no login. Not investment advice.", options: { fontSize: 14 } }], { x: 0.68, y: 6.0, w: 3.95, h: 1.16, fontSize: 15 });
  const shots = [["set1_1_weekly_notification", "Weekly alert"], ["set1_3_checkin_down_week", "Why it fell"], ["set1_5_checkin_options", "Pay less option"], ["set2_3_proceed_to_pay", "Proceed to pay?"], ["set3_ask_sipal_quality_check", "Advice declined"]];
  const PH_H = 2.62, PH_W = PH_H * 412 / 842, GAPX = (7.88 - 5 * PH_W) / 4;
  shots.forEach((sh, i) => {
    const x = 4.95 + i * (PH_W + GAPX);
    s.addImage({ path: "wireframes/" + sh[0] + ".png", x, y: 1.45, w: PH_W, h: PH_H, altText: "SIPal screen: " + sh[1] });
    T(s, [{ text: (i + 1) + " ", options: { bold: true, color: BLUE } }, { text: sh[1], options: { bold: true } }], { x: x - 0.2, y: 4.1, w: PH_W + 0.4, h: 0.3, fontSize: 14, align: "center", valign: "middle" });
  });
  T(s, "User testing: what 3 first-time investors found, and what we changed", { x: 4.95, y: 4.44, w: 7.9, h: 0.32, fontSize: 15, bold: true, color: BLUE });
  const th = ["Tester", "What they found", "What we changed"].map(t => ({ text: t, options: { bold: true, color: PURE, fill: { color: BLUE }, align: "center", valign: "middle" } }));
  const tr = (a, b, c, own) => [a, b, c].map((t, k) => ({ text: t, options: { color: BLACK, bold: k === 0, italic: !!own && k === 0, valign: "middle" } }));
  s.addTable([th,
    tr("User 1", "Tabs didn't open; Popular Funds stuck loading; too many suggestions", "Tabs work; fund cards shown; suggestions only in Ask SIPal"),
    tr("User 2", "\u201CYes, all set\u201D did nothing; no fund minimum or custom amount", "\u201CProceed to pay?\u201D screen; minimum-amount note; custom amount"),
    tr("User 3", "The SIPal explanation took half the screen", "Intro cut to one line; tasks as compact buttons"),
    tr("Own review", "Zooming on phones; Enter hard in chat; no logo; one reminder only", "Fits the screen; multi-line chat box; Groww logo; daily reminders", true)],
    { x: 4.95, y: 4.8, w: 7.88, colW: [1.12, 3.33, 3.43], fontFace: BODY, fontSize: 14, border: { type: "solid", pt: 1, color: BLACK }, rowH: [0.34, 0.5, 0.5, 0.5, 0.5], margin: [2, 5, 2, 5] });
  s.addNotes("SIPal MVP, live at " + SIPAL + ". Screens are captured from the live app. Tasks for testers: (1) open the weekly check-in, find why the SIP rose or fell and whether that is normal, ask one follow-up; (2) the SIP is due in 3 days and money is tight: pay a smaller amount this month and check what changes; (3) Ask SIPal: ask anything about the SIP in your own words (including a fund tip, which SIPal declines because it is a guide, not an adviser). " +
    "User testing (3 first-time investors, feedback as reported by the Fellow): User 1 could not open the Dashboard, SIPs and Watchlist tabs, saw Popular Funds as placeholders that looked like loading, and found suggestion buttons on every page unnecessary. User 2 found that \u201CYes, all set\u201D led nowhere and asked for the fund house minimum and a custom amount, each followed by a \u201CProceed to pay?\u201D confirmation. User 3 found the SIPal explanation took half the screen. Own review: pages needed zooming on phones (inputs under 16px make iOS zoom), Enter was hard to use in chat, the Task 2 name clashed with another project, and the per-answer quality box in chat was not needed (safe-fallback notes remain). All were fixed and deployed. " +
    "Evaluation: the 20 hand-labelled golden-set posts from the Evidence Log, latest run 18/20 (first run 16/20, then 19/20 after two general prompt fixes, in-sample; 18/20 after the rules update, the extra miss is a post sharing a new SIP that was declined as off-topic); every shown answer advice-free 20/20; safety tests 17/17. What a non-AI version would miss: a fixed FAQ cannot answer questions phrased in unplanned ways or in Hinglish, and cannot tell an explanation request from an advice request.");
}

// =====================================================================================================================
// 10. SUCCESS METRICS + RISKS AND MITIGATIONS
// =====================================================================================================================
{
  const s = newSlide("Success and risks: SIPal aims for +2 to +4 points by keeping first-timers invested through dips; each risk has a mitigation");
  wm(s, "wm_risefall.png", 0.5, 3.75, 12.33, 3.45);
  const top = [
    ["North star and target", GREEN, [["Metric: ", "% of first-time investors with an active SIP 12 months after starting"], ["Target: ", "+2 to +4 points for salaried 22-30 first-timers vs a control group (estimate)"]]],
    ["Product metrics that move it", BLUE, [["Stop-intent after a dip: ", "opened stop or cancel / SIPs in a down week"], ["Stop-to-adjust rate: ", "paid less, skipped or moved / opened stop"], ["Check-in reach: ", "share opening the down-week check-in"]]],
    ["Guardrails", BLUE, [["No pressure: ", "cancel stays one tap; time to cancel not worse"], ["No nagging: ", "one reminder a day, stops once answered; mute rate watched"], ["AI gate: ", "95%+ grounded, 0 advice phrases"]]]];
  top.forEach((c, i) => {
    const x = 0.5 + i * 4.18;
    card(s, x, 1.42, 3.98, 1.88, PURE, c[1], "success-" + i);
    T(s, [{ text: c[0], options: { bold: true, color: BLUE, fontSize: 16, breakLine: true } }, ...c[2].flatMap((m, k) => [{ text: m[0], options: { bold: true } }, { text: m[1], options: { breakLine: k < c[2].length - 1 } }])],
      { x: x + 0.18, y: 1.47, w: 3.65, h: 1.8, fontSize: 14, paraSpaceAfter: 1 });
  });
  T(s, "Risks and Mitigations", { x: 0.5, y: 3.37, w: 6, h: 0.36, fontSize: 16, bold: true, color: BLUE });
  s.addImage({ path: ART + "icon_rise.png", x: 3.0, y: 3.33, w: 0.66, h: 0.44, altText: "Rising graph in green" });
  s.addImage({ path: ART + "icon_fall.png", x: 3.75, y: 3.33, w: 0.66, h: 0.44, altText: "Falling graph in red" });
  const R = [
    ["Read as investment advice", "an answer sounds like a tip to buy, sell or stop.", "advice requests get a fixed decline and a SEBI-adviser pointer; \u201Cnot advice\u201D on every screen."],
    ["Wrong or invented explanations", "the AI gets a number or a market reason wrong.", "AI only words given facts; every number is checked; a failed check shows standard text."],
    ["Pushy or too many alerts", "nudges feel like pressure, or get muted and ignored.", "weekly check-ins; due reminders once a day for 3 days, stopping once answered; no urgency words."],
    ["Pay less read as loss-cutting", "investors think paying less protects them from the fall.", "worded as a gentler step than stopping; SIPal says a dip buys more units and never pitches pay-less as protection."],
    ["Small research samples", "4 interviews and 19 survey answers may not represent everyone.", "A/B test against a control group; re-run the golden set after every change."],
    ["Demo data and privacy", "sample numbers differ from a real portfolio; someone types personal data.", "label sample data; no login or PAN, nothing stored; launch only with Groww's data and a vetted market feed."]];
  R.forEach((r, i) => {
    const x = 0.5 + (i % 3) * 4.18, y = 3.78 + Math.floor(i / 3) * 1.74, w = 3.98, h = 1.66;
    card(s, x, y, w, h, PURE, i % 2 ? GREEN : BLUE, "risk-" + (i + 1));
    T(s, [{ text: (i + 1) + "  " + r[0], options: { bold: true, color: BLUE, breakLine: true } },
          { text: "Risk: ", options: { bold: true } }, { text: r[1], options: { breakLine: true } },
          { text: "Mitigation: ", options: { bold: true, color: BLUE } }, { text: r[2] }],
      { x: x + 0.15, y: y + 0.05, w: w - 0.3, h: h - 0.08, fontSize: 14, paraSpaceAfter: 2 });
  });
  s.addNotes("Success: business metric as given in the brief. Uplift estimate: about 1.2 million salaried 22-30 first-timers a year; about half hit a missed-SIP or low-returns moment; assume 40% of those would stop without help and SIPal turns 10 to 20% of them to pay less, skip or continue: 24,000 to 48,000 more investors active at month 12, +2 to +4 points. " +
    "Product metrics follow the KPI tree (slide 2). Risks and mitigations: each card names the risk and the step that reduces it. Evidence: 17/17 safety tests (advice and prediction traps, a pasted PAN); golden set 18/20 in the latest run, scored in-sample; every shown answer advice-free 20/20. Known gap: the gate checks numbers and phrases, not every paraphrase. Market reasons in the demo are sample data.");
}

pres.writeFile({ fileName: "NL_Groww.pptx" }).then(f => console.log("written", f));
