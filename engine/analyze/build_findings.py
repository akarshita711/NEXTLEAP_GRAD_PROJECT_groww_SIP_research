"""Aggregate extracted.jsonl into webapp/findings.json (no usernames/URLs; only short verbatim evidence quotes)."""
import json, re, collections as C, glob, sys
sys.path.insert(0, ".")
cfg = json.load(open("../../webapp/api/engine_config.json"))
BR, OP = cfg["branch"], cfg["opp"]
def load(p):
    try: return [json.loads(l) for l in open(p)]
    except FileNotFoundError: return []
v2 = {r["uid"]: r for r in load("../data/processed/extracted_v2.jsonl") if r.get("x")}
v1 = {r["uid"]: r for r in load("../data/processed/extracted.jsonl") if r.get("x")}
merged = {**v1, **v2}                      # one record per uid; v2 overrides v1 (earlier failed runs left duplicate error rows, which are ignored)
rows = list(merged.values())
ok = [r for r in rows if r.get("x")]
rel = [r for r in ok if r["x"]["relevant"] and r["x"]["quote_verbatim"] and r["x"]["confidence"] >= 3]
DROP = {"paused", "reduced", "stopped", "failed_instalment", "considering_stopping"}
def first_year(r):
    x = r["x"]; m = x["months_since_start"]
    return x["investor_stage"] in ("started_0_3m", "early_3_12m") or (m is not None and 0 <= m <= 12)
drop = [r for r in rel if r["x"]["sip_event"] in DROP]; fy = [r for r in rel if first_year(r)]; fyd = [r for r in drop if first_year(r)]
def dist(rs, key, lst=False):
    c = C.Counter(v for r in rs for v in (r["x"][key] if lst else [r["x"][key]])); return [[k, v] for k, v in c.most_common()]
def branch_dist(rs):
    c = C.Counter(BR.get(r["x"]["trigger"], "unstated") for r in rs); return [[k, c[k]] for k in ["S1", "S2a", "S2b", "S2c", "S3", "unstated"]]
def opp_dist(rs):
    c = C.Counter(OP.get(r["x"]["unmet_need"], "none") for r in rs); return [[k, c[k]] for k in ["O1", "O2", "O3", "O4", "none"]]
def n_lines(p): return sum(1 for _ in open(p))
PII = re.compile(r"(\+?\d[\d\s-]{8,}|[\w.]+@[\w.]+|https?://)")
quotes = []
for r in sorted(rel, key=lambda r: (-(r["x"]["sip_event"] in DROP), -r["x"]["confidence"])):
    q = r["x"]["evidence_quote"].strip()
    if len(q) < 25 or PII.search(q): continue
    quotes.append({"s": r["source"], "stage": r["x"]["investor_stage"], "ev": r["x"]["sip_event"], "tr": r["x"]["trigger"],
                   "br": BR.get(r["x"]["trigger"], "unstated"), "need": r["x"]["unmet_need"], "emo": r["x"]["emotion"], "fy": first_year(r), "q": q[:200]})
import random; random.seed(11)
head = [q for q in quotes if q["ev"] in DROP]; tail = [q for q in quotes if q["ev"] not in DROP]
def mix(lst):                                   # interleave sources so the browser is not dominated by Play Store
    by = C.defaultdict(list)
    for q in lst: by[q["s"]].append(q)
    for v in by.values(): random.shuffle(v)
    out_, i = [], 0
    while any(by.values()):
        for k in sorted(by):
            if by[k]: out_.append(by[k].pop())
    return out_
quotes = mix(head)[:500] + random.sample(tail, min(150, len(tail)))
out = {
 "collected": {"playstore_reviews": n_lines("../data/raw/playstore_groww.jsonl"), "youtube_comments": n_lines("../data/raw/youtube.jsonl"),
               "reddit_posts_sip_or_mf": n_lines("../data/raw/reddit.jsonl"), "reddit_comments": n_lines("../data/raw/reddit_comments.jsonl") - sum(1 for l in open("../data/raw/reddit_comments.jsonl") if '"marker"' in l)},
 "corpus": json.load(open("../data/processed/corpus_stats.json")),
 "analysed": len(ok), "relevant": len(rel), "drop": len(drop), "first_year": len(fy), "first_year_drop": len(fyd),
 "by_source_relevant": dict(C.Counter(r["source"] for r in rel)), "by_source_analysed": dict(C.Counter(r["source"] for r in ok)),
 "branch_by_source": {s: branch_dist([r for r in drop if r["source"] == s]) for s in ("playstore", "reddit", "reddit_comment", "youtube")},
 "branch_all_drop": branch_dist(drop), "branch_first_year_drop": branch_dist(fyd),
 "opp_all_drop": opp_dist(drop), "opp_first_year_all": opp_dist(fy), "opp_first_year_drop": opp_dist(fyd),
 "trigger_drop": dist(drop, "trigger"), "event_all": dist(rel, "sip_event"), "emotion_drop": dist(drop, "emotion"),
 "outside_drop": dist(drop, "outside_app", True), "check_all": dist(rel, "what_they_check", True),
 "stage_drop": dist(drop, "investor_stage"), "need_first_year": dist(fy, "unmet_need"),
 "prompt_versions": dict(C.Counter(r.get("prompt", "v1") for r in ok)),
 "quality": {"quote_verbatim_pct": round(100 * sum(r["x"]["quote_verbatim"] for r in ok) / len(ok), 1), "mean_confidence": round(sum(r["x"]["confidence"] for r in ok) / len(ok), 2)},
 "quotes": quotes,
}
import os
gp = "../data/processed/golden_eval.json"
if os.path.exists(gp):
    g = json.load(open(gp)); v = g["v2"]
    out["golden"] = [["Golden set size (hand-labelled)", "20 items"], ["Relevance accuracy", f"{v['relevance_acc']}% (precision {v['precision']}%, recall {v['recall']}%)"],
                     ["Agreement: SIP event / trigger / unmet need", f"{v['fields']['sip_event']}% / {v['fields']['trigger']}% / {v['fields']['unmet_need']}%"]]
json.dump(out, open("../../webapp/findings.json", "w"), ensure_ascii=False)
print({k: out[k] for k in ("collected", "analysed", "relevant", "drop", "first_year", "first_year_drop")}, len(quotes))
