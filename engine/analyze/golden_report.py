"""Side-by-side human vs AI labels on the golden set + coarse-level agreement. Writes data/processed/golden_set_report.md"""
import json, sys, openpyxl
cfg = json.load(open("../../webapp/api/engine_config.json")); BR, OP = cfg["branch"], cfg["opp"]
wb = openpyxl.load_workbook("../data/processed/golden_set_HAND_LABELLED.xlsx", data_only=True); ws = wb["Label"]
hdr = [c.value for c in ws[1]]; col = {h: i for i, h in enumerate(hdr)}
F = ["sip_event", "trigger", "unmet_need", "investor_stage", "emotion"]
H = {}
for r in ws.iter_rows(min_row=2, values_only=True):
    if r[0]: H[r[0]] = {"rel": str(r[col["relevant (Y/N)"]] or "").upper() == "Y", "text": r[col["Text (read fully)"]], "note": r[col["Notes (optional)"]] or "", **{f: r[col[f]] or "" for f in F}}
V1 = {k: v["x"] for k, v in json.load(open("../data/processed/golden_engine_labels.json")).items()}
V2 = json.load(open("../data/processed/golden_engine_labels_v2.json"))["labels"]
DROP = {"paused", "reduced", "stopped", "failed_instalment", "considering_stopping"}
coarse = {
 "sip_event": lambda v: "drop-off signal" if v in DROP else "no drop-off signal",
 "trigger": lambda v: BR.get(v, "unstated"),
 "unmet_need": lambda v: OP.get(v, "none"),
 "investor_stage": lambda v: "first year / considering" if v in ("started_0_3m", "early_3_12m", "considering") else "later or unclear",
 "emotion": lambda v: "doubt (anxious/confused/frustrated/disappointed)" if v in ("anxious", "confused", "frustrated", "disappointed") else "calm or positive",
}
def agree(E, level):
    out = {}
    hr = [k for k in H if H[k]["rel"]]
    both = [k for k in hr if E[k]["relevant"]]
    for f in F:
        g = coarse[f] if level == "coarse" else (lambda v: v)
        out[f] = (sum(1 for k in hr if E[k]["relevant"] and g(E[k][f]) == g(H[k][f])), len(hr), sum(1 for k in both if g(E[k][f]) == g(H[k][f])), len(both))
    return out
res = {n: {lv: agree(E, lv) for lv in ("exact", "coarse")} for n, E in (("v1", V1), ("v2", V2))}
rel_stats = {}
for n, E in (("v1", V1), ("v2", V2)):
    tp = sum(1 for k in H if H[k]["rel"] and E[k]["relevant"]); fp = sum(1 for k in H if not H[k]["rel"] and E[k]["relevant"]); fn = sum(1 for k in H if H[k]["rel"] and not E[k]["relevant"]); tn = sum(1 for k in H if not H[k]["rel"] and not E[k]["relevant"])
    rel_stats[n] = (tp, fp, fn, tn)
L = ["# Golden set: hand labels vs the AI engine", "", "20 items drawn at random (seed 42) across Play Store, Reddit and YouTube; labelled by hand with no sight of any AI output; then compared with the AI's labels.", ""]
L += ["## 1. Is the item about a mutual-fund SIP? (relevance)", "| Prompt | Agrees with human | Precision | Recall | Wrongly kept | Wrongly dropped |", "|---|---|---|---|---|---|"]
for n, name in (("v1", "v1 (first 4,860 items)"), ("v2", "v2 (stricter; later items and the web app)")):
    tp, fp, fn, tn = rel_stats[n]; L.append(f"| {name} | {tp + tn}/20 ({round(100 * (tp + tn) / 20)}%) | {round(100 * tp / max(1, tp + fp))}% | {round(100 * tp / max(1, tp + fn))}% | {fp} | {fn} |")
L += ["", "## 2. Do the labels match? (16 items the human marked relevant; an item the AI wrongly dropped counts as a miss)", "| Field | v1 exact | v2 exact | v1 coarse | v2 coarse |", "|---|---|---|---|---|"]
for f in F:
    a, b, c, d = res["v1"]["exact"][f], res["v2"]["exact"][f], res["v1"]["coarse"][f], res["v2"]["coarse"][f]
    L.append(f"| {f} | {a[0]}/{a[1]} ({round(100*a[0]/a[1])}%) | {b[0]}/{b[1]} ({round(100*b[0]/b[1])}%) | {c[0]}/{c[1]} ({round(100*c[0]/c[1])}%) | {d[0]}/{d[1]} ({round(100*d[0]/d[1])}%) |")
L += ["", "Coarse = the groupings the deck actually reports: drop-off signal vs not; reason branch (SIP broke / money or life / understanding / pulled elsewhere / unstated); opportunity area (O1 to O4); first year vs later; doubt feeling vs calm.", "",
      "## 3. Item by item (human | v1 | v2). 'drop' = item judged not relevant", "| ID | rel (H/v1/v2) | sip_event | trigger | unmet_need | stage | emotion |", "|---|---|---|---|---|---|---|"]
short = lambda v: str(v or "-").replace("_", " ")
for k in H:
    row = [k, "/".join("Y" if x else "N" for x in (H[k]["rel"], V1[k]["relevant"], V2[k]["relevant"]))]
    for f in F:
        h = short(H[k][f]) if H[k]["rel"] else "-"; a = short(V1[k][f]) if V1[k]["relevant"] else "drop"; b = short(V2[k][f]) if V2[k]["relevant"] else "drop"
        mark = "" if (h == a == b) else ""
        row.append(f"{h} \\| {a} \\| {b}")
    L.append("| " + " | ".join(row) + " |")
open("../data/processed/golden_set_report.md", "w").write("\n".join(L))
print("\n".join(L[:30]))
