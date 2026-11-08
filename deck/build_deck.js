// Builds NL_Groww.pptx: 10-slide problem-framing deck (no fellow name anywhere).
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";                         // 13.33 x 7.5 in
pres.author = "";
pres.company = "";
pres.title = "First-time SIP retention on Groww: problem framing, MVP and success metrics";

// ---------- palette: Groww brand, four colours only: white, Caribbean Green, Groww Blue, black ----------
// Green is used for shapes and lines (too light for text on white); text is black, headings and links blue.
const GREEN = "00D09C", BLUE = "5367F5", BLACK = "000000", PURE = "FFFFFF";
const BG = PURE, CARD = PURE, CARD2 = PURE, WHITE = BLACK, SOFT = BLACK, DARK = BLACK;   // old names kept so slide code is unchanged
const Y = GREEN, O = GREEN, S = BLUE, G = GREEN, P = BLUE;
const ART = "art/";
// every slide: green text becomes blue so it stays readable on white
const _addSlide = pres.addSlide.bind(pres);
const txt = c => (c === GREEN ? BLUE : c);
const fixRuns = r => { if (Array.isArray(r)) r.forEach(x => { if (x && x.options) { if (x.options.color) x.options.color = txt(x.options.color); if (x.options.underline && x.options.underline.color) x.options.underline.color = txt(x.options.underline.color); } }); };
pres.addSlide = (...a) => { const s = _addSlide(...a); const at = s.addText.bind(s);
  s.addText = (t, o = {}) => { fixRuns(t); if (o.color) o.color = txt(o.color); return at(t, o); }; return s; };
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
  objects: [...BRAND, { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.28, w: 12.33, h: 1.05, fontFace: HEAD, fontSize: 27, bold: true, color: BLACK, valign: "middle", margin: 0 }, text: "" } }],
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
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.18, fill: { color: fill }, line: line ? { color: line, width: 2 } : { color: BLACK, width: 1 }, objectName: name });
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
  T(s, "Helping first-time Groww investors stay invested through year one", { x: 0.7, y: 1.45, w: 7.1, h: 2.1, fontFace: HEAD, fontSize: 40, bold: true, valign: "top" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.72, y: 3.62, w: 1.4, h: 0.09, fill: { color: GREEN }, line: { color: GREEN }, objectName: "title-underline" });
  T(s, "Why early-career salaried investors wobble in months 2 to 12, and an AI check-in that steadies them without giving advice", { x: 0.7, y: 3.85, w: 7.1, h: 0.95, fontSize: 19 });
  s.addImage({ path: ART + "cover_art.png", x: 7.95, y: 0.55, w: 4.9, h: 4.0, altText: "Art: a SIPal sprout on a stack of rupee coins beside a rising green line, green and blue candles and a dashed blue line that falls and recovers" });
  card(s, 0.7, 4.95, 12.13, 0.95, PURE, GREEN, "north-star");
  T(s, [{ text: "North-star metric: ", options: { bold: true, color: BLUE } }, { text: "percentage of first-time mutual fund investors who still have an active SIP 12 months after starting their first one." }], { x: 0.95, y: 4.98, w: 11.6, h: 0.9, fontSize: 19, valign: "middle" });
  T(s, [{ text: "11,711", options: { bold: true, color: BLUE } }, { text: " conversations analysed   |   " }, { text: "4,952", options: { bold: true, color: BLUE } }, { text: " about real SIP journeys   |   " },
        { text: "18", options: { bold: true, color: BLUE } }, { text: "-person survey   |   " }, link("Try the live AI discovery engine", ENGINE, BLUE)], { x: 0.7, y: 6.12, w: 12, h: 0.4, fontSize: 16 });
  T(s, "Independent study. Not affiliated with Groww; Groww logo shown for identification only. Not investment advice. Mutual fund investments are subject to market risks.", { x: 0.7, y: 6.62, w: 12.1, h: 0.5, fontSize: 14 });
  s.addNotes("Title slide. North-star metric as given in the brief. Numbers: 11,711 conversations analysed by the discovery engine, 4,952 judged relevant to a person's own mutual fund SIP; survey n=18. Name of the fellow intentionally not shown.");
}

// =====================================================================================================================
// 2. KPI TREE (business metric decomposition)
// =====================================================================================================================
{
  const s = newSlide("KPI tree: the 12-month active SIP rate comes down to whether each monthly instalment is paid, adjusted or recovered");
  require("./kpi_tree_v3.js")(pres, s, { CARD, CARD2, WHITE, SOFT, DARK, Y, O, BODY });
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
  const line = (x, y, w, hh) => s.addShape(pres.shapes.LINE, { x, y, w, h: hh, line: { color: BLACK, width: 1.25 }, objectName: "seg-connector" });
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
// 4. HOW THE EVIDENCE WAS BUILT (moved from the end)
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
  T(s, [{ text: "Next: ", options: { bold: true, color: Y } }, { text: "4 interviews with salaried first-time investors then tested what the public data showed: personas and hypothesis follow. " }, link("Try the live engine", ENGINE)], { x: 0.7, y: 5.98, w: 11.9, h: 0.72, fontSize: 16, valign: "middle" });
  T(s, "Free-tier stack: Gemini models, Vercel hosting. Data: public reviews, posts and comments shown as short excerpts without usernames.", { x: 0.5, y: 6.82, w: 12.3, h: 0.45, fontSize: 14, color: SOFT });
  s.addNotes("One-slide explanation of the discovery engine, as required. Collected: Play Store 40,000; Reddit posts 38,517 and comments 15,862; YouTube comments 15,799. After filters and seeded sampling the corpus is 21,073; 11,711 items analysed by Gemini in two passes; 4,952 judged relevant to a person's own mutual fund SIP. First prompt over-counted relevant items (ULIP, PPF, insurance): 510 of 1,804 flipped under the stricter prompt. Golden-set agreement numbers to be added once the hand-labelled set is scored.");
}

// =====================================================================================================================
// 5. PERSONAS (two interviewees, answers as given)
// =====================================================================================================================
{
  const s = newSlide("Personas: one missed SIPs, one faced low returns and a layoff; neither had guidance on what to do next");
  require("./persona_slide.js")(pres, s, { CARD, SOFT, WHITE, DARK, S, O, Y, HEAD, BODY });
}

// =====================================================================================================================
// 6. HYPOTHESIS (validated with 4 interviews)
// =====================================================================================================================
{
  const s = newSlide("Validated hypothesis: SIPs stop because first-timers get no proper guidance when they miss a SIP or returns are low");
  const SEGN = require("./segment_numbers.json");
  T(s, [{ text: "Target segment: ", options: { bold: true, color: O } }, { text: `salaried, 22-30, the largest group at ${SEGN.share.early}% of first-time investors who state age or income` }],
    { x: 0.5, y: 1.4, w: 12.3, h: 0.32, fontSize: 15, color: SOFT });
  const steps = [
    ["1  Starts with intent", "Own goal or a friend's nudge; expects 10% to 15%+ a year", S, false],
    ["2  Trigger moment", "Misses a SIP (forgot, layoff, a move) or sees low returns", P, false],
    ["3  Root cause: no proper guidance", "No one explains what a miss leads to, or what to do at low returns", O, true],
    ["4  Doesn't know what to do", "Asks a friend, advisors, Reddit, or does nothing", G, false],
    ["5  The SIP breaks", "Missed, stopped, or cancelled and redeemed", Y, false],
  ];
  const cw = 2.25, cg = 0.27, cy0 = 1.85, ch = 1.6;
  steps.forEach((st, i) => {
    const x = 0.5 + i * (cw + cg);
    card(s, x, cy0, cw, ch, st[3] ? CARD2 : CARD, st[2], "hyp-step-" + (i + 1));
    if (st[3]) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cy0, w: cw, h: ch, rectRadius: 0.18, fill: { color: CARD2, transparency: 100 }, line: { color: O, width: 3.5 }, objectName: "root-cause-highlight" });
    T(s, [{ text: st[0], options: { bold: true, color: st[2], fontSize: 15, breakLine: true } }, { text: st[1], options: { fontSize: 14 } }], { x: x + 0.14, y: cy0 + 0.1, w: cw - 0.28, h: ch - 0.2, fontSize: 14 });
    if (i < steps.length - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + cw + 0.04, y: cy0 + ch / 2 - 0.13, w: 0.19, h: 0.26, fill: { color: SOFT }, line: { color: SOFT }, objectName: "hyp-arrow-" + (i + 1) });
  });
  T(s, "With no guidance at a missed SIP or a low-returns moment, investors don't know what to do, and the SIP stops.", { x: 0.5, y: 3.55, w: 12.3, h: 0.45, fontSize: 18, bold: true, color: Y, valign: "middle" });
  card(s, 0.5, 4.15, 6.05, 2.85, CARD, S, "hyp-evidence");
  T(s, "What 4 interviews showed", { x: 0.7, y: 4.22, w: 5.7, h: 0.38, fontSize: 17, bold: true, color: S, valign: "middle" });
  T(s, [
    { text: "Missed SIP: none of the 4 knew what several misses lead to", options: { bullet: true, breakLine: true, paraSpaceAfter: 3 } },
    { text: "Low returns: 2 of 4 thought of quitting, unsure what else to do", options: { bullet: true, breakLine: true, paraSpaceAfter: 3 } },
    { text: "With no guide, they asked a friend, advisors or Reddit, or did nothing", options: { bullet: true, breakLine: true, paraSpaceAfter: 3 } },
    { text: "Asked for it: “a proper guide to first time SIP investors”; found GR-1 only later", options: { bullet: true, breakLine: true, paraSpaceAfter: 3 } },
    { text: "4 of 4 named a gentler path: move the date, pay less, skip a month", options: { bullet: true } }],
    { x: 0.7, y: 4.62, w: 5.7, h: 2.3, fontSize: 14 });
  card(s, 6.75, 4.15, 6.08, 2.85, CARD, G, "hyp-test");
  T(s, "How we got here, and where it points", { x: 6.95, y: 4.22, w: 5.7, h: 0.38, fontSize: 17, bold: true, color: G, valign: "middle" });
  T(s, [
    { text: "Started with: ", options: { bold: true, color: P } }, { text: "a doubt goes unanswered in the app.", options: { breakLine: true } },
    { text: "Sharpened to: ", options: { bold: true, color: G } }, { text: "the gap is guidance at two moments, a missed SIP and low returns. Consistent with all 4 interviews.", options: { breakLine: true } },
    { text: "Points to: ", options: { bold: true, color: Y } }, { text: "an in-app guide at those two moments: what a miss leads to, the gentler options, and why returns move in year one. It explains; it never recommends funds." }],
    { x: 6.95, y: 4.62, w: 5.7, h: 2.3, fontSize: 14, paraSpaceAfter: 6 });
  s.addNotes("Hypothesis validated with 4 interviews (all salaried; answers as given). Root cause: no proper guidance when a SIP is missed or returns are low, so investors do not know what to do. " +
    "Missed SIP: none of the 4 knew what several missed instalments lead to; Akshata missed 2 to 3 instalments by forgetting, did nothing when worried, asked for 'a proper guide to first time SIP investors' and only later found GR-1, which now guides her on whether to continue. " +
    "Low returns: Praveen thought of stopping over 'low returns and wrong decisions, and poor knowledge about market' and wants the app to 'make some analysis'; Darshan found notification wording too technical ('in simple terms life would have been easy') and was drawn to ETFs and bonds. " +
    "Sudhanva (0 to 3 months) has had neither moment yet but did not know skip, change date or lower amount exist. Gentler paths named: move the date (Sudhanva), short bridge (Darshan), pay less and postpone (Praveen), skip next month (Akshata). " +
    "The hypothesis began as 'a doubt goes unanswered in the app' and was sharpened after the interviews; further interviews are its independent check. Guidance here means explanation, never fund recommendations.");
}

// =====================================================================================================================
// 7. PROBLEM FRAMING CANVAS (aligned to the validated hypothesis)
// =====================================================================================================================
{
  const s = newSlide("Problem: when first-timers miss a SIP or see low returns, nothing guides them on what to do, so the SIP stops");
  const KN = require("./kpi_numbers.json"), SEGN = require("./segment_numbers.json");
  const box = (n, title, color, x, y, w, h, body, size = 15) => {
    card(s, x, y, w, h, CARD, color, "canvas-" + n);
    badge(s, n, x + 0.15, y + 0.12, color, 0.46);
    T(s, title, { x: x + 0.75, y: y + 0.12, w: w - 0.9, h: 0.46, fontSize: 16, bold: true, color, valign: "middle" });
    T(s, body, { x: x + 0.2, y: y + 0.68, w: w - 0.4, h: h - 0.78, fontSize: size });
  };
  const bl = (t, last) => ({ text: t, options: last ? { bullet: true } : { bullet: true, breakLine: true, paraSpaceAfter: 4 } });
  box(1, "What is the true problem?", S, 0.5, 1.45, 4.45, 2.95,
    "Year one has two make-or-break moments: a missed instalment (forgot, laid off, moved) and a low-returns month. At both, first-timers don't know what a miss leads to, whether the returns are normal, or that they can skip, lower or move the SIP. Nothing in the app guides them then, so they ask friends or Reddit, freeze, or cancel.", 14.5);
  box(2, "Who faces it?", O, 5.1, 1.45, 3.35, 2.95,
    `Salaried first-time investors, 22 to 30, in their first 12 months. ${SEGN.share.early}% of first-timers who state age or income; about 1.0 to 1.5 million a year on Groww (estimate). Personas: Akshata and Praveen.`, 14.5);
  box(3, "How do we know it is real?", P, 8.6, 1.45, 4.23, 2.95, [
    bl("Hypothesis validated in 4 interviews: 0 of 4 knew what several misses lead to; 4 of 4 named a gentler path"),
    bl(`${KN.S1 + KN.S2b}% of stated drop-off reasons sit at these two moments: missed SIPs ${KN.S1}%, low returns or confusing numbers ${KN.S2b}% (n=${KN.stated})`),
    bl(`A trusted answer is the top need in ${KN.O4_fy}% of first-year posts`, true)], 14);
  box(4, "What value does solving it create?", G, 0.5, 4.55, 6.0, 2.7, [
    { text: "For investors: ", options: { bold: true, color: G } }, { text: "at a missed SIP or a low-returns month, a clear answer to “what happens now, is this normal, what can I do”, and a gentler option than cancel.", options: { breakLine: true } },
    { text: "For Groww: ", options: { bold: true, color: G } }, { text: "a higher 12-month active-SIP rate. Each +1 point keeps roughly 20,000 to 30,000 first-time investors a year (estimate), with fewer support contacts." }], 15);
  box(5, "Why solve it now?", Y, 6.65, 4.55, 6.18, 2.7, [
    bl("Acquisition works, retention lags: record Rs 32,490 crore monthly SIPs, yet a 78.5% stoppage ratio (Sep 2026)"),
    bl("36% of new Groww users start SIP-first, so more first-timers reach these moments"),
    bl("The pieces exist (skip, lower amount, GR-1) but don't appear at the moment: Akshata found GR-1 only later", true)], 15);
  s.addNotes("Canvas aligned to the validated hypothesis (slide 6): the root cause is the absence of guidance at two moments, a missed SIP and a low-returns month. " +
    `Public-data numbers, discovery engine v3: of ${KN.stated} drop-off posts that state a reason, missed or broken SIPs (failed payment or mandate, app issue) are ${KN.S1}%; low or negative returns, expectation mismatch and confusing numbers are ${KN.S2b}%; ` +
    `money pressure or a life event ${KN.S2a}%, a better alternative or others' advice ${KN.S2c}%. Trusted help is the main need in ${KN.O4_fy}% of ${KN.first_year} first-year posts. ` +
    "Interviews: 4 salaried Groww SIP investors, answers as given. The 20,000 to 30,000 per point figure is 1% of the estimated 2 to 3 million first-time SIP investors a year and must be checked against Groww cohort data. " +
    "Record monthly SIP flows Rs 32,490 crore and stoppage ratio 78.53% are for September 2026 (AMFI via media reports).");
}

// =====================================================================================================================
// 8-9. MVP: SIPal, two flows with wireframes
// =====================================================================================================================
function sipalSlide(title, left, shots, caps, notes, opt = {}) {
  const s = newSlide(title);
  const LW = opt.leftW || 4.25;
  let y = 1.45;
  left.forEach((c, i) => {
    card(s, 0.5, y, LW, c.h, i === 0 ? CARD2 : CARD, c.color, "sipal-left-" + (i + 1));
    T(s, [{ text: c.head, options: { bold: true, color: c.color, fontSize: 16, breakLine: true } }, ...c.body],
      { x: 0.68, y: y + 0.08, w: LW - 0.33, h: c.h - 0.14, fontSize: 14 });
    y += c.h + 0.12;
  });
  const PH_H = opt.phH || 5.2, PH_W = PH_H * 412 / 866, X0 = 0.5 + LW + 0.2, n = shots.length;
  const GAP = n > 1 ? Math.min(0.22, (12.83 - X0 - n * PH_W) / (n - 1)) : 0, PY = opt.phY || 1.42;
  shots.forEach((f, i) => {
    const x = X0 + i * (PH_W + GAP);
    s.addImage({ path: `wireframes/${f}.png`, x, y: PY, w: PH_W, h: PH_H, altText: "Wireframe: " + caps[i][2] });
    T(s, [{ text: caps[i][0] + "  ", options: { bold: true, color: caps[i][3] } }, { text: caps[i][1] }], { x: x - 0.1, y: PY + PH_H + 0.06, w: PH_W + 0.2, h: 0.36, fontSize: 14, align: "center", valign: "middle" });
  });
  s.addNotes(notes);
}
const bl = (t, last) => ({ text: t, options: last ? { bullet: true } : { bullet: true, breakLine: true, paraSpaceAfter: 3 } });
const it = (t) => ({ text: t, options: { italic: true, breakLine: true } });

// 8. Flow 1: weekly portfolio check-in
sipalSlide("SIPal flow 1: a weekly check-in shows how the SIP did and why the market moved, in a good week or a bad one",
  [ { head: "The pitch", color: Y, h: 2.32, body: [{ text: "“A calm guide that comes to you every week, when your SIP misses a payment or your returns dip, and tells you what happened, whether it's normal, and what you can do.”", options: { italic: true } }] },
    { head: "How it works", color: S, h: 3.13, body: [bl("A weekly notification or the Explore entry opens it"), bl("Own numbers, why the market moved, is it normal"), bl("AI words facts from data; checked, or a safe fallback"), { text: "Numbers in the screens are illustrative.", options: { color: SOFT } }] } ],
  ["set1_1_weekly_notification", "set1_2_explore_entry", "set1_3_checkin_down_week", "set1_4_checkin_up_week"],
  [["1", "Weekly notification", "lock-screen notification that the weekly SIP check-in is ready, with no amounts shown", S], ["2", "Or: Explore entry", "Mutual Funds Explore tab with the SIPal entry above Popular Funds", O], ["3", "Down week", "weekly check-in in a down week, with why the market fell", P], ["4", "Up week", "weekly check-in in an up week, with why the market rose", G]],
  "Flow 1, weekly check-in. Two ways in: a weekly lock-screen notification (no amounts on the lock screen, for privacy) or the SIPal entry in the Mutual Funds Explore tab above Popular Funds. The check-in shows the investor's own SIP value, invested amount, change this week and overall, and each fund by category (no fund names). " +
  "'Why did it fall/rise' explains the market move in one sentence (index move plus the main driver) and links it to the investor's funds. 'Is this normal' gives year-one context without predicting returns. 'What can you do' says when no action is needed. " +
  "All numbers and market reasons in the screens are illustrative. Weekly, not daily, because frequent return checks raise loss-focused behaviour (myopic loss aversion). Evidence link: Praveen thought of quitting over low returns; Darshan found notification wording too technical.",
  { leftW: 2.75, phH: 4.75, phY: 1.5 });

// 9. Flow 2: reminder before the next debit
sipalSlide("SIPal flow 2: three days before the debit, SIPal asks if this month is OK and lets them pay less just once",
  [ { head: "Fixes the missed-SIP moment", color: P, h: 1.95, body: [bl("A reminder 3 days ahead, while a change can still go through"), bl("Pay less this month only; next month goes back on its own"), bl("Says what changes: SIP stays active, no penalty", true)] },
    { head: "Built from what users asked for", color: O, h: 1.72, body: [it("“A proper reminder a day before the due date” (Akshata)"), it("“Pay less and postpone the SIP” (Praveen)"), { text: "“Prior notification… to manage money better” (Sudhanva)", options: { italic: true } }] },
    { head: "Calm, not pushy", color: Y, h: 1.66, body: [bl("One reminder per instalment, no countdowns or red alerts"), bl("“Yes, all set” closes it in one tap"), bl("Skip and cancel stay visible and easy", true)] } ],
  ["set2_1_due_reminder", "set2_2_pay_less_this_month", "set2_3_confirmed"],
  [["1", "Reminder, 3 days before", "lock-screen reminder three days before the SIP debit with two actions", S], ["2", "Pay less this month", "asks if the investor can pay this month and offers a smaller amount for November only", P], ["3", "Confirmed", "confirmation that November is set to a lower amount and December returns to the usual amount", G]],
  "Flow 2, before the next debit. Three days ahead, a reminder asks whether this month is OK for the usual amount, with two actions: 'Yes, all set' or 'Pay less this month'. The SIPal screen offers a smaller amount for this month only (or skip, or move the date), explains what changes (SIP stays active, no penalty, fewer units bought), and confirms that the next month goes back to the usual amount. " +
  "Feasibility: a one-month lower amount is a proposed feature; it needs the change to reach the fund house before its cut-off (hence 3 days ahead) and works within the existing auto-debit mandate. Evidence link: Akshata missed instalments by forgetting and asked for a reminder the day before; Praveen would have paid less and postponed; Sudhanva wanted a notice before the SIP date. Numbers are illustrative.");

// =====================================================================================================================
// 10. MVP RISKS AND MITIGATION (with the success target on top)
// =====================================================================================================================
{
  const s = newSlide("Risks: SIPal's main risks are advice drift, wrong explanations and pushy nudges, and each has a built-in safeguard");
  const SIPAL = "https://nextleapgradprojectgrowwsipresearch.vercel.app/sipal/";
  card(s, 0.5, 1.45, 12.33, 0.62, CARD2, Y, "success-strip");
  T(s, [{ text: "Success: ", options: { bold: true, color: Y } }, { text: "+2 to +4 points on the 12-month active SIP rate (estimate), tracked by first-try debit success and the stop-to-adjust rate." }],
    { x: 0.7, y: 1.45, w: 11.9, h: 0.62, fontSize: 15, valign: "middle" });
  const R = [
    ["Read as investment advice", S, "Advice and prediction requests get a fixed decline and a pointer to a SEBI-registered adviser. No fund names; “not investment advice” on every screen.", "17/17 safety tests; 20/20 golden answers advice-free"],
    ["Wrong or invented explanations", O, "The AI only words the facts and rules it is given. Every number must match them; a failed check shows the standard text instead.", "Gap: checks numbers and phrases, not every paraphrase"],
    ["Too cautious to be useful", P, "If unsure, SIPal points to an official source instead of guessing. Fallback rate is tracked; the golden set is re-run after every prompt change.", "19/20 golden-set match; one tip wrongly declined"],
    ["Pushy or too many alerts", G, "Weekly, not daily. One reminder per instalment, “Not now” and mute. Urgency words are blocked; skip and cancel are never hidden.", "Guardrail: mute rate and time to cancel"],
    ["Demo data, not real accounts", Y, "SIP numbers and market moves are labelled sample data. Launch needs Groww's portfolio data, a vetted market feed and fund-house support for paying less.", "Next: pilot on real data, behind a flag"],
    ["Privacy and free-tier limits", S, "No login and no PAN; personal details are refused and nothing is stored. Rate limits, caching and fixed fallback text keep it working if the AI is down.", "PAN test refused; fallback works if the AI is down"],
  ];
  R.forEach((r, i) => {
    const x = 0.5 + (i % 3) * 4.18, y = 2.18 + Math.floor(i / 3) * 2.32, w = 3.98, h = 2.24;
    card(s, x, y, w, h, CARD, r[1], "risk-" + (i + 1));
    badge(s, i + 1, x + 0.15, y + 0.13, r[1], 0.44);
    T(s, r[0], { x: x + 0.72, y: y + 0.08, w: w - 0.85, h: 0.55, fontSize: 16, bold: true, color: r[1], valign: "middle" });
    T(s, [{ text: "Mitigation: ", options: { bold: true } }, { text: r[2], options: { color: WHITE, breakLine: true } }, { text: r[3], options: { color: SOFT, italic: true } }],
      { x: x + 0.2, y: y + 0.68, w: w - 0.4, h: h - 0.74, fontSize: 14, paraSpaceAfter: 4 });
  });
  T(s, [{ text: "Live MVP: ", options: { bold: true, color: Y } }, link("Try SIPal", SIPAL, S), { text: "   Release gate: golden-set match 80%+, every shown answer advice-free, every advice request declined.", options: { color: SOFT } }],
    { x: 0.5, y: 6.82, w: 12.33, h: 0.4, fontSize: 14 });
  s.addNotes("Risks of the SIPal MVP and how each is handled. Evaluation (engine/sipal_eval): the 20 hand-labelled golden-set posts from the Evidence Log were sent to Ask SIPal; expected behaviour came from the hand labels. First run 16/20; after two general prompt fixes (do not treat a forgotten password as personal data; point to support, scheme documents or an adviser on tax, charge and own-case questions) 19/20, measured on the same set, so in-sample. " +
    "20/20 shown answers advice-free; 7/7 advice-seeking posts referred to an adviser or official source; 4/4 off-topic posts declined. 17/17 safety tests (advice and prediction traps, an instruction to break the rules, a pasted PAN, rule questions, own numbers, Hinglish, off-topic). " +
    "A rejected draft example: an up-week check-in was blocked because the advice check read 'returns are not guaranteed' as a guarantee; the check was fixed to allow negations. Success target and metrics follow the KPI tree on slide 2.");
}

pres.writeFile({ fileName: "NL_Groww.pptx" }).then(f => console.log("written", f));
