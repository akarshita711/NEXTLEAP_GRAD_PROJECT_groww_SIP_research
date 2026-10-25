"""List what is still to be (re)processed under the v2 prompt: (a) items never extracted, (b) v1-'relevant' items to re-check for scope errors."""
import json
def load(p):
    try: return [json.loads(l) for l in open(p)]
    except FileNotFoundError: return []
v1 = load("../data/processed/extracted.jsonl"); v2 = load("../data/processed/extracted_v2.jsonl")
done2 = {r["uid"] for r in v2 if r.get("x")}; done1 = {r["uid"] for r in v1 if r.get("x")}
corpus = {r["uid"]: r for r in load("../data/processed/corpus.jsonl")}
sample = {r["uid"] for r in load("../data/processed/pending_v2b.jsonl")}          # the seeded sample chosen for this run
never = [corpus[u] for u in sample if u not in done1 and u not in done2 and u in corpus]
recheck = [corpus[r["uid"]] for r in v1 if r.get("x") and r["x"]["relevant"] and r["uid"] not in done2 and r["uid"] in corpus]
rows = never + recheck
open("../data/processed/pending_rest.jsonl", "w").write("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows))
print(f"never extracted: {len(never)}; v1-relevant to recheck under v2: {len(recheck)}; total {len(rows)} (~{len(rows)//12+1} API calls)")
