"""Build per-question evidence packs (numbers + verbatim quotes + caveats) for the nine research questions -> webapp/evidence.json and webapp/api/evidence.json"""
import json, re, random, collections as C
random.seed(21)
def load(p):
    try: return [json.loads(l) for l in open(p)]
    except FileNotFoundError: return []
m = {r["uid"]: r for r in load("../data/processed/extracted.jsonl") if r.get("x")}
m.update({r["uid"]: r for r in load("../data/processed/extracted_v2.jsonl") if r.get("x")})
p2 = {r["uid"]: r["p2"] for r in load("../data/processed/extracted_p2.jsonl") if r.get("p2")}
rel = [r for r in m.values() if r["x"]["relevant"] and r["x"]["quote_verbatim"] and r["x"]["confidence"] >= 3]
for r in rel: r["p2"] = p2.get(r["uid"])
DROP = {"paused", "reduced", "stopped", "failed_instalment", "considering_stopping"}
CONT = {"continuing"}
fy = lambda r: r["x"]["investor_stage"] in ("started_0_3m", "early_3_12m") or (r["x"]["months_since_start"] is not None and 0 <= r["x"]["months_since_start"] <= 12)
drop = [r for r in rel if r["x"]["sip_event"] in DROP]; cont = [r for r in rel if r["x"]["sip_event"] in CONT]
withp2 = [r for r in rel if r["p2"]]
SKIP = {"not_stated", "none_or_not_stated", "none", "unclear", "unknown"}
N = lambda s: s.replace("_", " ")
def dist(rs, get, lst=False, skip=SKIP, top=8, base=None):
    c = C.Counter(v for r in rs for v in ((get(r) if lst else [get(r)]) or []) if v not in skip)
    n = base if base is not None else len(rs)
    return {"base": n, "rows": [[N(k), v, round(100 * v / n, 1) if n else 0] for k, v in c.most_common(top)]}
def stated(rs, get, skip=SKIP):          # base = items where the field was actually stated
    return [r for r in rs if get(r) not in skip]
BR = json.load(open("../../webapp/api/engine_config.json"))["branch"]
BN = {"S1": "SIP broke (payment / mandate / app)", "S2a": "money or life event", "S2b": "understanding & expectation", "S2c": "pulled elsewhere", "S3": "silent drift"}
PII = re.compile(r"(\+?\d[\d\s-]{8,}|[\w.]+@[\w.]+|https?://)")
SRC = {"playstore": "Play Store", "reddit": "Reddit post", "reddit_comment": "Reddit comment", "youtube": "YouTube"}
def quotes(rs, getq, k=5, pred=lambda r: True):
    pool = []
    for r in rs:
        q = (getq(r) or "").strip()
        if 45 <= len(q) <= 200 and not PII.search(q) and pred(r): pool.append((r, q))
    random.shuffle(pool); out, seen = [], C.Counter()
    for r, q in pool:                                            # diversify by source
        if seen[r["source"]] >= 2: continue
        seen[r["source"]] += 1; out.append({"q": q, "s": SRC[r["source"]], "tag": N(r["x"]["sip_event"]) + (", first year" if fy(r) else "")})
        if len(out) == k: break
    return out
xq = lambda r: r["x"]["evidence_quote"]; pq = lambda r: ((r["p2"] or {}).get("evidence_quote", "") if (r["p2"] or {}).get("quote_verbatim") else "")
def stage_name(r): return {"started_0_3m": "0-3 months in", "early_3_12m": "3-12 months in", "established_12m_plus": "12+ months in", "considering": "considering a SIP"}.get(r["x"]["investor_stage"], "stage unclear")

Q = []
def add(i, question, stats, qs, caveats, headline=""):
    Q.append({"id": i, "question": question, "headline": headline, "stats": stats, "quotes": qs, "caveats": caveats})

# 1 why start / expect
s1 = stated(withp2, lambda r: r["p2"]["motivation"]); s1e = stated(withp2, lambda r: r["p2"]["expectation"])
infl = [r for r in rel if r["x"]["who_influenced"] != "unknown"]
add(1, "Why do people start a SIP, and what do they expect to happen?",
    [{"label": f"Stated reason for starting (n={len(s1)} items that say why)", **dist(s1, lambda r: r["p2"]["motivation"], base=len(s1))},
     {"label": f"What they expect (n={len(s1e)} items that say)", **dist(s1e, lambda r: r["p2"]["expectation"], base=len(s1e))},
     {"label": f"Who influenced them (n={len(infl)} items that say)", **dist(infl, lambda r: r["x"]["who_influenced"], base=len(infl))}],
    quotes(s1 + s1e, pq, 5), ["Only a minority of posts say why the person started or what they expected, so shares are among those who said.", "Public posts skew to people who are already asking questions."])
# 2 behaviour change by stage
bc = stated(withp2, lambda r: r["p2"]["behaviour_change"])
st = [{"label": f"How behaviour changes after starting (n={len(bc)} items that say)", **dist(bc, lambda r: r["p2"]["behaviour_change"], base=len(bc))}]
for name in ("0-3 months in", "3-12 months in", "12+ months in"):
    g = [r for r in rel if stage_name(r) == name]
    st.append({"label": f"What happens to the SIP, {name} (n={len(g)})", **dist(g, lambda r: r["x"]["sip_event"], base=len(g), top=6)})
add(2, "What changes in their behaviour in the months after starting?", st, quotes(bc, pq, 5, lambda r: r["p2"]["behaviour_change"] != "stayed_consistent"),
    ["Stage is stated for a minority of posts. The early months are thin in public data, so this is a pattern to test in interviews."])
# 3 what leads to pause/reduce/stop
dd = [r for r in drop if r["x"]["trigger"] not in ("none", "unclear")]
brc = C.Counter(BR.get(r["x"]["trigger"], "other") for r in dd)
add(3, "What leads investors to pause, reduce or stop a SIP?",
    [{"label": f"Stated reason among drop-off signals (n={len(dd)} that state one; {len(drop)} drop-offs in total)", "base": len(dd), "rows": [[BN[k], v, round(100 * v / len(dd), 1)] for k, v in brc.most_common() if k in BN]},
     {"label": "Specific triggers", **dist(drop, lambda r: r["x"]["trigger"], base=len(dd), top=9)},
     {"label": f"First-year only (n={len([r for r in dd if fy(r)])})", **dist([r for r in dd if fy(r)], lambda r: r["x"]["trigger"], base=len([r for r in dd if fy(r)]), top=6)}],
    quotes(dd, xq, 6), ["Reasons are only what people say publicly. Silent lapses are invisible, so their cause is unknown here.", "Market falls are one trigger among several, not the whole story."])
# 4 what they check and how often
ck = [r for r in rel if "none" not in r["x"]["what_they_check"] and r["x"]["what_they_check"]]
cf = stated(withp2, lambda r: r["p2"]["check_frequency"])
add(4, "What do investors check, and how often, once they have started?",
    [{"label": f"What they say they look at (n={len(ck)} items that say)", **dist(ck, lambda r: r["x"]["what_they_check"], lst=True, base=len(ck))},
     {"label": f"How often they look (n={len(cf)} items that say)", **dist(cf, lambda r: r["p2"]["check_frequency"], base=len(cf))}],
    quotes(ck, xq, 4, lambda r: any(w in xq(r).lower() for w in ("check", "see", "look", "xirr", "return", "nav"))), ["Check frequency is rarely stated. Treat these as indicative, and confirm in interviews."])
# 5 confusion / worry in app
ac = [r for r in withp2 if any(v != "none" for v in r["p2"]["app_confusion"])]
add(5, "What confuses or worries them inside the app?",
    [{"label": f"What confuses them (n={len(ac)} items)", **dist(ac, lambda r: r["p2"]["app_confusion"], lst=True, base=len(ac), top=10)},
     {"label": f"First-year only (n={len([r for r in ac if fy(r)])})", **dist([r for r in ac if fy(r)], lambda r: r["p2"]["app_confusion"], lst=True, base=len([r for r in ac if fy(r)]), top=6)},
     {"label": "How they feel (all relevant items)", **dist(rel, lambda r: r["x"]["emotion"], base=len(rel), skip={"neutral"})}],
    quotes(ac, pq, 6), ["Counts are of mentions, so one post can add to several rows."])
# 6 outside the app
oa = [r for r in rel if any(v != "none" for v in r["x"]["outside_app"])]
add(6, "What do they do outside the app when they feel unsure?",
    [{"label": f"Where they go (n={len(oa)} items that say)", **dist(oa, lambda r: r["x"]["outside_app"], lst=True, base=len(oa))},
     {"label": f"Among drop-off signals (n={len([r for r in drop if r in oa])})", **dist([r for r in drop if r in oa], lambda r: r["x"]["outside_app"], lst=True, base=len([r for r in drop if r in oa]))}],
    quotes(oa, xq, 4), ["Posting on Reddit or commenting on YouTube is itself outside-app behaviour, so those sources over-represent it."])
# 7 continue vs drop
def prof(rs, name):
    return {"label": f"{name} (n={len(rs)})", **dist(rs, lambda r: r["x"]["emotion"], base=len(rs), top=4, skip={"neutral"})}
add(7, "What separates investors who continue from those who quietly drop off?",
    [{"label": f"People continuing (n={len(cont)}): where they go when unsure", **dist(cont, lambda r: r["x"]["outside_app"], lst=True, base=len(cont), top=5)},
     {"label": f"Visible drop-offs (n={len(drop)}): where they go when unsure", **dist(drop, lambda r: r["x"]["outside_app"], lst=True, base=len(drop), top=5)},
     {"label": f"People continuing: what they check", **dist(cont, lambda r: r["x"]["what_they_check"], lst=True, base=len(cont), top=5)},
     {"label": f"Visible drop-offs: what they check", **dist(drop, lambda r: r["x"]["what_they_check"], lst=True, base=len(drop), top=5)},
     prof(cont, "Continuing: feelings"), prof(drop, "Drop-offs: feelings"),
     {"label": "Continuing: expectation stated", **dist([r for r in cont if r["p2"]], lambda r: r["p2"]["expectation"], base=len([r for r in cont if r["p2"]]), top=4)},
     {"label": "Drop-offs: expectation stated", **dist([r for r in drop if r["p2"]], lambda r: r["p2"]["expectation"], base=len([r for r in drop if r["p2"]]), top=4)}],
    quotes(cont, xq, 3, lambda r: r["x"]["emotion"] in ("content", "confident")) + quotes(drop, xq, 3), ["The comparison is between continuing investors and visible drop-offs. People who quietly lapse never appear, so this cannot show what separates them. That is a main reason for the interviews."])
# 8 segments
seg_st = []
for label, get in (("Income stability", lambda r: r["x"]["income_stability"]), ("Who influenced them", lambda r: r["x"]["who_influenced"]),
                   ("Age band", lambda r: (r["p2"] or {}).get("age_band", "not_stated")), ("Source of money", lambda r: (r["p2"] or {}).get("money_source", "not_stated"))):
    g = C.defaultdict(list)
    for r in rel:
        v = get(r)
        if v not in SKIP: g[v].append(r)
    rows = [[N(k), len(v), round(100 * sum(1 for r in v if r["x"]["sip_event"] in DROP) / len(v), 1)] for k, v in sorted(g.items(), key=lambda kv: -len(kv[1]))]
    seg_st.append({"label": f"{label}: items that state it, and the share showing a drop-off signal", "base": sum(len(v) for v in g.values()), "rows": rows, "cols": ["Segment", "Items", "% with drop-off signal"]})
add(8, "How do these patterns differ across user segments (income stability, age, source of money, who influenced them)?", seg_st, quotes([r for r in rel if r["x"]["income_stability"] in ("irregular", "variable_pay")], xq, 3),
    ["Segment details are stated in only a small share of public posts, so differences are indicative only. Rows with fewer than about 30 items should not be trusted. The screener and interviews are the real source for segment cuts."])
# 9 unmet needs
add(9, "What unmet needs emerge consistently across conversations?",
    [{"label": f"All relevant items (n={len(rel)})", **dist(rel, lambda r: r["x"]["unmet_need"], base=len(rel), top=8)},
     {"label": f"First-year items (n={len([r for r in rel if fy(r)])})", **dist([r for r in rel if fy(r)], lambda r: r["x"]["unmet_need"], base=len([r for r in rel if fy(r)]), top=8)},
     {"label": f"Drop-off signals (n={len(drop)})", **dist(drop, lambda r: r["x"]["unmet_need"], base=len(drop), top=8)}],
    quotes(rel, xq, 6, lambda r: r["x"]["unmet_need"] != "none"), ["Needs are the engine's reading of the most important unmet need in each post."])


# ---------- deterministic headlines (numbers only; AI-written headlines were reviewed and rejected, see data/processed/ai_headline_review.md) ----------
def row(q, si, name):
    for r in Q[q - 1]["stats"][si]["rows"]:
        if r[0] == name: return r
    return [name, 0, 0.0]
def base(q, si): return Q[q - 1]["stats"][si]["base"]
def top(q, si, k=3): return Q[q - 1]["stats"][si]["rows"][:k]
fmt = lambda r: f"{r[0]} ({r[2]:.0f}%)"
def drop_share(rs): return round(100 * sum(1 for r in rs if r["x"]["sip_event"] in DROP) / max(1, len(rs)))
NEG = ("confused", "anxious", "frustrated", "disappointed")
neg = lambda rs: round(100 * sum(1 for r in rs if r["x"]["emotion"] in NEG) / max(1, len(rs)))
cs = [r for r in cont if r["p2"] and r["p2"]["expectation"] != "not_stated"]; ds = [r for r in drop if r["p2"] and r["p2"]["expectation"] != "not_stated"]
steady = lambda rs: round(100 * sum(1 for r in rs if r["p2"]["expectation"] == "steady_long_term_growth") / max(1, len(rs)))
stage_groups = {n: [r for r in rel if stage_name(r) == n] for n in ("0-3 months in", "3-12 months in", "12+ months in")}
H = {
 1: f"Among the {base(1,0):,} items that say why the person started, the most common reasons are {fmt(top(1,0)[0])} and {fmt(top(1,0)[1])}. Among the {base(1,1):,} that say what they expected, {fmt(top(1,1)[0])} leads, followed by {fmt(top(1,1)[1])} and {fmt(top(1,1)[2])}.",
 2: f"Among {base(2,0):,} items that describe a change after starting, {fmt(top(2,0)[0])}, {fmt(top(2,0)[1])} and {fmt(top(2,0)[2])} lead. Items showing a drop-off signal make up {drop_share(stage_groups['0-3 months in'])}% of 0-3 month posts, {drop_share(stage_groups['3-12 months in'])}% of 3-12 month posts and {drop_share(stage_groups['12+ months in'])}% of 12+ month posts, but few posts state the stage, so treat this as a pattern to test.",
 3: f"Among {base(3,0):,} drop-off signals that give a reason: {', '.join(fmt(r) for r in top(3,0,4))}. Falling returns matter, but they are one reason among several.",
 4: f"Among {base(4,0):,} items that say what they look at, the most common are {', '.join(fmt(r) for r in top(4,0,3))}. How often they look is stated in only {base(4,1):,} items ({fmt(top(4,1)[0])} lead), so frequency is indicative at best.",
 5: f"Among {base(5,0):,} items that mention something confusing, the most common are {', '.join(fmt(r) for r in top(5,0,3))}. For first-year investors ({base(5,1):,} items) the top is {fmt(top(5,1)[0])}.",
 6: f"Among {base(6,0):,} items that say where the person goes when unsure: {', '.join(fmt(r) for r in top(6,0,4))}.",
 7: f"Visible drop-offs show more confusion, anxiety or frustration than people who continue ({neg(drop)}% vs {neg(cont)}%). Among those who state an expectation, {steady(cs)}% of continuing investors expect steady long-term growth, against {steady(ds)}% of drop-offs. People who lapse silently never appear in public text, so this contrast cannot show what separates them.",
 8: f"Differences are small and rest on few items. Share showing a drop-off signal: irregular income {row(8,0,'irregular')[2]}% (n={row(8,0,'irregular')[1]}), variable pay {row(8,0,'variable pay')[2]}% (n={row(8,0,'variable pay')[1]}), fixed salary {row(8,0,'fixed salary')[2]}% (n={row(8,0,'fixed salary')[1]}). Only about {round(100*sum(s['base'] for s in Q[7]['stats'][:1])/max(1,len(rel)))}% of items state income at all.",
 9: f"Across {base(9,0):,} relevant items the biggest unmet needs are {', '.join(fmt(r) for r in top(9,0,3))}. Among first-year items: {', '.join(fmt(r) for r in top(9,1,3))}. Among drop-off signals: {', '.join(fmt(r) for r in top(9,2,3))}.",
}
for q in Q: q["headline"] = H[q["id"]]

meta = {"analysed": len(m), "relevant": len(rel), "drop": len(drop), "continuing": len(cont), "first_year": len([r for r in rel if fy(r)]), "pass2_items": len(withp2)}
out = {"meta": meta, "questions": Q}
json.dump(out, open("../../webapp/evidence.json", "w"), ensure_ascii=False)
json.dump(out, open("../../webapp/api/evidence.json", "w"), ensure_ascii=False)
print(meta)
for q in Q: print(q["id"], len(q["stats"]), "stats", len(q["quotes"]), "quotes")
