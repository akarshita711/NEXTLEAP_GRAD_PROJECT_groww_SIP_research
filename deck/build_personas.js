// Standalone user-persona slide (deck style). Content lives in persona_slide.js, shared with the main deck.
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = ""; pres.company = "";
pres.title = "User personas: first-time SIP investors";

const C = { BG: "140F3D", CARD: "251D70", SOFT: "DAD5FF", WHITE: "FFFFFF", DARK: "140F3D",
  Y: "F0E442", O: "FFB000", S: "56B4E9", G: "3DDBB0", P: "F08DC0", HEAD: "Arial", BODY: "Calibri" };

pres.defineSlideMaster({
  title: "CONTENT", background: { color: C.BG },
  objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.22, w: 12.33, h: 1.0, fontFace: C.HEAD, fontSize: 26, bold: true, color: C.WHITE, valign: "middle", margin: 0 }, text: "" } }],
});
const s = pres.addSlide({ masterName: "CONTENT" });
s.addShape(pres.shapes.OVAL, { x: -2.6, y: -2.9, w: 4.6, h: 4.6, fill: { color: C.P, transparency: 72 }, line: { color: C.P, transparency: 100 }, objectName: "glow-1" });
s.addText("Personas: one missed SIPs, one faced low returns and a layoff; neither had guidance on what to do next", { placeholder: "title" });
require("./persona_slide.js")(pres, s, C);
pres.writeFile({ fileName: "Personas.pptx" }).then(f => console.log("written", f));
