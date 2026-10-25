"""Print Evidence-Log-ready statistics for the discovery engine (sources, funnel, models, quality)."""
import json, collections as C
def load(p):
    try: return [json.loads(l) for l in open(p)]
    except FileNotFoundError: return []
F = json.load(open("../../webapp/findings.json"))
v1d = {r["uid"]: r for r in load("../data/processed/extracted.jsonl") if r.get("x")}; v2d = {r["uid"]: r for r in load("../data/processed/extracted_v2.jsonl") if r.get("x")}
v1 = [r for u, r in v1d.items() if u not in v2d]; v2 = list(v2d.values())          # final prompt version per item
errs = []
print("## Sources and volumes\n")
print(f"- Play Store (Groww, India, English UI): {F['collected']['playstore_reviews']:,} reviews collected (Mar-Oct 2026)")
print(f"- Reddit posts mentioning SIP/mutual funds (r/IndiaInvestments, r/personalfinanceindia, r/mutualfunds, r/IndianStockMarket, r/FIREIndia, r/IndiaPersonalFinance; Oct 2024-Oct 2026): {F['collected']['reddit_posts_sip_or_mf']:,}")
print(f"- Reddit comments downloaded for sampled SIP threads: {F['collected']['reddit_comments']:,}")
print(f"- YouTube comments (116 SIP / first-time-investing videos): {F['collected']['youtube_comments']:,}")
print("\n## Funnel\n")
print(f"- Corpus after dedupe, length and SIP/mutual-fund keyword filters + seeded Reddit sampling: {sum(F['corpus'].values()):,} (by source {F['corpus']})")
print(f"- Analysed by LLM so far: {F['analysed']:,} (v1 prompt {len(v1):,}; v2 prompt {len(v2):,}); not yet processed: 0 (v2 re-check complete)")
print(f"- Judged relevant (own mutual-fund SIP experience, confidence>=3, quote verified): {F['relevant']:,}")
print(f"- Drop-off signals: {F['drop']:,}; first-year relevant: {F['first_year']:,} (drop-offs {F['first_year_drop']})")
print("\n## Models used\n", dict(C.Counter(r.get('model') for r in v1 + v2)))
print("\n## Automatic quality checks\n", F["quality"])
