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
def embed(texts, task):
    for attempt in range(8):
        try:
            r = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:batchEmbedContents", headers={"x-goog-api-key": KEY},
                json={"requests": [{"model": f"models/{MODEL}", "content": {"parts": [{"text": t}]}, "taskType": task, "outputDimensionality": DIM} for t in texts]}, timeout=120)
            if r.status_code == 200: return [e["values"] for e in r.json()["embeddings"]]
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
todo = [r for r in rel if r["uid"] not in cache]
B = 30
with open(CACHE, "a") as cf:
    for i in range(0, len(todo), B):
        chunk = todo[i:i + B]
        vs = embed([r["text"][:700] for r in chunk], "RETRIEVAL_DOCUMENT")
        for r, v in zip(chunk, vs): cache[r["uid"]] = q8(v); cf.write(json.dumps({"uid": r["uid"], "v": cache[r["uid"]]}) + "\n")
        cf.flush(); print(len(cache), "/", len(rel), flush=True); time.sleep(20)
meta, vecs = [], bytearray()
for r in rel:
    x = r["x"]; p = p2.get(r["uid"]) or {}
    t = r["text"]; t = t[:340] + ("…" if len(t) > 340 else "")
    meta.append({"s": SRC[r["source"]], "st": x["investor_stage"], "ev": x["sip_event"], "tr": x["trigger"], "nd": x["unmet_need"], "em": x["emotion"],
                 "mo": p.get("motivation", ""), "ex": p.get("expectation", ""), "ac": [a for a in p.get("app_confusion", []) if a != "none"], "t": t})
    vecs += bytes(b & 0xFF for b in cache[r["uid"]])
open("../../webapp/api/rag_meta.json", "w").write(json.dumps(meta, ensure_ascii=False, separators=(",", ":")))
open("../../webapp/api/rag_vec.bin", "wb").write(bytes(vecs))
print("done", len(meta), os.path.getsize("../../webapp/api/rag_meta.json") // 1024, "KB meta;", len(vecs) // 1024, "KB vectors")
