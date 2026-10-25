"""Quantify extracted signals: what breaks continuation, for whom, and what is unmet. Writes data/processed/themes.json"""
import json, sys, collections as C
inp = sys.argv[1] if len(sys.argv) > 1 else "../data/processed/extracted.jsonl"
def load(p):
    try: return [json.loads(l) for l in open(p)]
    except FileNotFoundError: return []
merged = {r["uid"]: r for r in load(inp) if r.get("x")}                                   # v1, one record per item
merged.update({r["uid"]: r for r in load("../data/processed/extracted_v2.jsonl") if r.get("x")})  # v2 overrides
rows = list(merged.values())
ok = rows
rel = [r for r in ok if r["x"]["relevant"] and r["x"]["quote_verbatim"] and r["x"]["confidence"] >= 3]
DROP = {"paused", "reduced", "stopped", "failed_instalment", "considering_stopping"}
drop = [r for r in rel if r["x"]["sip_event"] in DROP]
pct = lambda n, d: round(100 * n / d, 1) if d else 0
def dist(rs, key, lst=False):
    c = C.Counter(v for r in rs for v in (r["x"][key] if lst else [r["x"][key]]))
    return {k: [v, pct(v, len(rs))] for k, v in c.most_common()}
out = {
  "volumes": {"analysed": len(rows), "extraction_ok": len(ok), "relevant_high_conf": len(rel), "drop_signals": len(drop),
              "by_source_relevant": dict(C.Counter(r["source"] for r in rel)), "by_source_analysed": dict(C.Counter(r["source"] for r in rows))},
  "sip_event_all_relevant": dist(rel, "sip_event"),
  "trigger_among_drop": dist(drop, "trigger"),
  "unmet_need_among_drop": dist(drop, "unmet_need"),
  "unmet_need_all_relevant": dist(rel, "unmet_need"),
  "emotion_among_drop": dist(drop, "emotion"),
  "outside_app_among_drop": dist([r for r in drop], "outside_app", True),
  "outside_app_all": dist(rel, "outside_app", True),
  "what_they_check_all": dist(rel, "what_they_check", True),
  "stage_among_drop": dist(drop, "investor_stage"),
  "income_among_drop_known": dist([r for r in drop if r["x"]["income_stability"] != "unknown"], "income_stability"),
  "influence_known": dist([r for r in rel if r["x"]["who_influenced"] != "unknown"], "who_influenced"),
  "months_since_start_drop": sorted(r["x"]["months_since_start"] for r in drop if r["x"]["months_since_start"] is not None),
  "trigger_x_event": {e: dist([r for r in rel if r["x"]["sip_event"] == e], "trigger") for e in DROP},
  "quality": {"quote_verbatim_rate": pct(sum(r["x"]["quote_verbatim"] for r in ok), len(ok)), "mean_confidence": round(sum(r["x"]["confidence"] for r in ok) / max(1, len(ok)), 2)},
}
quotes = C.defaultdict(list)
for r in sorted(drop, key=lambda r: -r["x"]["confidence"]):
    k = r["x"]["trigger"]
    if len(quotes[k]) < 6: quotes[k].append({"uid": r["uid"], "source": r["source"], "event": r["x"]["sip_event"], "quote": r["x"]["evidence_quote"]})
out["sample_quotes_by_trigger"] = quotes
json.dump(out, open("../data/processed/themes.json", "w"), indent=1, ensure_ascii=False)
v = out["volumes"]; print(v)
for k in ("sip_event_all_relevant", "trigger_among_drop", "unmet_need_among_drop"): print(k, {a: b for a, b in list(out[k].items())[:8]})
