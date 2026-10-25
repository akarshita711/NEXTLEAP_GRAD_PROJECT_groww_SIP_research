"""Embed every relevant conversation (gemini-embedding-001, 256 dims, int8) so the Ask feature can retrieve the passages that match a question.
Outputs: webapp/api/rag_meta.json (compact metadata + short text) and webapp/api/rag_vec.bin (int8 vectors) + question vectors."""
import json, os, time, math, struct, requests, sys
KEY = os.environ["GEMINI_API_KEY"]; DIM = 256; MODEL = "gemini-embedding-001"
def load(p):
    try: return [json.loads(l) for l in open(p)]
    except FileNotFoundError: return []
m = {r["uid"]: r for r in load("../data/processed/extracted.jsonl") if r.get("x")}
m.update({r["uid"]: r for r in load("../data/processed/extracted_v2.jsonl") if r.get("x")})
p2 = {r["uid"]: r["p2"] for r in load("../data/processed/extracted_p2.jsonl") if r.get("p2")}
rel = [r for r in m.values() if r["x"]["relevant"] and r["x"]["quote_verbatim"] and r["x"]["confidence"] >= 3]
rel.sort(key=lambda r: r["uid"])
class DailyCap(Exception): pass
def embed(texts, task):
    for attempt in range(8):
        try:
            r = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:batchEmbedContents", headers={"x-goog-api-key": KEY},
                json={"requests": [{"model": f"models/{MODEL}", "content": {"parts": [{"text": t}]}, "taskType": task, "outputDimensionality": DIM} for t in texts]}, timeout=120)
            if r.status_code == 200: return [e["values"] for e in r.json()["embeddings"]]
            if r.status_code == 429 and "PerDay" in r.text: raise DailyCap()
            print("retry", r.status_code, r.text[:120], file=sys.stderr)
        except Exception as e: print("retry", e, file=sys.stderr)
        time.sleep(min(2 ** attempt, 30))
    raise RuntimeError("embedding failed")
def q8(v):
    n = math.sqrt(sum(x * x for x in v)) or 1.0
    return [max(-127, min(127, round(127 * x / n))) for x in v]
SRC = {"playstore": "ps", "reddit": "rp", "reddit_comment": "rc", "youtube": "yt"}
CACHE = "../data/processed/rag_cache.jsonl"
cache = {}
if os.path.exists(CACHE):
    for l in open(CACHE):
        try: d = json.loads(l); cache[d["uid"]] = d["v"]
        except Exception: pass
DROPS = {"paused", "reduced", "stopped", "failed_instalment", "considering_stopping"}
def priority(r):                       # embed the most decision-relevant conversations first (free tier allows ~1,000 embeddings per day)
    x = r["x"]; p = p2.get(r["uid"]) or {}
    if x["sip_event"] in DROPS: return 0
    if x["investor_stage"] in ("started_0_3m", "early_3_12m", "considering"): return 1
    if p.get("motivation", "not_stated") != "not_stated" or p.get("expectation", "not_stated") != "not_stated" or any(a != "none" for a in p.get("app_confusion", [])): return 2
    return 3
todo = sorted([r for r in rel if r["uid"] not in cache], key=lambda r: (priority(r), r["uid"]))
B = 30
LIMIT = int(os.environ.get("EMBED_LIMIT", 900))        # leave a little daily quota for live questions
done_today = 0
with open(CACHE, "a") as cf:
    for i in range(0, len(todo), B):
        if done_today >= LIMIT: print("daily budget reached"); break
        chunk = todo[i:i + B]
        try: vs = embed([r["text"][:700] for r in chunk], "RETRIEVAL_DOCUMENT")
        except DailyCap: print("free daily embedding quota reached; resume tomorrow"); break
        done_today += len(chunk)
        for r, v in zip(chunk, vs): cache[r["uid"]] = q8(v); cf.write(json.dumps({"uid": r["uid"], "v": cache[r["uid"]]}) + "\n")
        cf.flush(); print(len(cache), "/", len(rel), flush=True); time.sleep(20)
print("embedded so far:", len(cache), "of", len(rel))
import subprocess; subprocess.run([sys.executable, "build_rag_files.py"], check=True)
