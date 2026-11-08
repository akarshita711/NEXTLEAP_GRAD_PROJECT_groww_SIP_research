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

require("./kpi_tree_slide.js")(pres, s, N, 0);
pres.writeFile({ fileName: "KPI_tree.pptx" }).then(f => console.log("written", f));
