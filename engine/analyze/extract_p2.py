"""Pass 2 extraction over RELEVANT items only -> data/processed/extracted_p2.jsonl (resumable). Drop-offs and first-year items first."""
import json, os, sys, concurrent.futures as cf
from schema import p2_schema, P2_PROMPT, P2_ENUMS, P2_LISTS
from gemini import call
def load(p):
    try: return [json.loads(l) for l in open(p)]
    except FileNotFoundError: return []
merged = {r["uid"]: r for r in load("../data/processed/extracted.jsonl") if r.get("x")}
merged.update({r["uid"]: r for r in load("../data/processed/extracted_v2.jsonl") if r.get("x")})
rel = [r for r in merged.values() if r["x"]["relevant"] and r["x"]["confidence"] >= 3]
DROP = {"paused", "reduced", "stopped", "failed_instalment", "considering_stopping"}
def pri(r):
    x = r["x"]; fy = x["investor_stage"] in ("started_0_3m", "early_3_12m", "considering")
    return (0 if x["sip_event"] in DROP else 1 if fy else 2)
rel.sort(key=pri)
OUT = "../data/processed/extracted_p2.jsonl"
done = {r["uid"] for r in load(OUT) if r.get("p2")}
todo = [r for r in rel if r["uid"] not in done]
BATCH = 12; chunks = [todo[i:i + BATCH] for i in range(0, len(todo), BATCH)]; schema = p2_schema()
def work(chunk):
    items = "\n\n".join(f'[{i}] """{r["text"][:1500]}"""' for i, r in enumerate(chunk))
    try: res, model = call(P2_PROMPT.format(n=len(chunk), items=items), schema)
    except Exception as e: return [{"uid": r["uid"], "p2": None, "error": str(e)[:150]} for r in chunk]
    by = {x.get("idx"): x for x in res if isinstance(x, dict)}; out = []
    for i, r in enumerate(chunk):
        x = by.get(i)
        if not x: out.append({"uid": r["uid"], "p2": None, "error": "missing"}); continue
        q = x.get("evidence_quote", ""); x["quote_verbatim"] = q == "" or q.strip().lower()[:80] in r["text"].lower()
        out.append({"uid": r["uid"], "p2": x, "model": model})
    return out
n = 0
with open(OUT, "a") as f, cf.ThreadPoolExecutor(4) as ex:
    for res in ex.map(work, chunks):
        for r in res: f.write(json.dumps(r, ensure_ascii=False) + "\n")
        f.flush(); n += len(res); print(n, "/", len(todo), flush=True)
