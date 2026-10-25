"""Assemble the retrieval files for the web app from whatever is available (no API calls):
  rag_meta.json  - short text + extracted fields per conversation
  rag_bm25.json  - compact BM25 inverted index (keyword search over ALL conversations)
  rag_vec.bin + rag_vec_ids.json - int8 embeddings for the conversations embedded so far (dense search, optional)"""
import json, math, re, os, collections as C
def load(p):
    try: return [json.loads(l) for l in open(p)]
    except FileNotFoundError: return []
m = {r["uid"]: r for r in load("../data/processed/extracted.jsonl") if r.get("x")}
m.update({r["uid"]: r for r in load("../data/processed/extracted_v2.jsonl") if r.get("x")})
p2 = {r["uid"]: r["p2"] for r in load("../data/processed/extracted_p2.jsonl") if r.get("p2")}
rel = sorted([r for r in m.values() if r["x"]["relevant"] and r["x"]["quote_verbatim"] and r["x"]["confidence"] >= 3], key=lambda r: r["uid"])
cache = {}
for l in load("../data/processed/rag_cache.jsonl"): cache[l["uid"]] = l["v"]
SRC = {"playstore": "ps", "reddit": "rp", "reddit_comment": "rc", "youtube": "yt"}
STOP = set("a an the and or but if of to in on at for with by from is are was were be been am i me my we our you your it its this that these those as so not no do does did have has had will would can could should just very also than then there their they them he she his her what which who when where why how about into over after before up out all any more most some such only own same too s t don now get got".split())
def stem(t): return re.sub(r"(ing|ed|es|s)$", "", t) if len(t) > 4 else t
def toks(text): return [stem(t) for t in re.findall(r"[a-z0-9]+|[ऀ-ॿ]+", text.lower()) if t not in STOP and len(t) > 1]
meta, dl, post = [], [], C.defaultdict(list)
for i, r in enumerate(rel):
    x = r["x"]; p = p2.get(r["uid"]) or {}; t = r["text"]
    meta.append({"s": SRC[r["source"]], "st": x["investor_stage"], "ev": x["sip_event"], "tr": x["trigger"], "nd": x["unmet_need"], "em": x["emotion"],
                 "mo": p.get("motivation", ""), "ex": p.get("expectation", ""), "ac": [a for a in p.get("app_confusion", []) if a != "none"],
                 "bc": p.get("behaviour_change", ""), "oa": [a for a in x.get("outside_app", []) if a != "none"], "ck": [a for a in x.get("what_they_check", []) if a != "none"], "cf": p.get("check_frequency", ""),
                 "ag": p.get("age_band", ""), "ms": p.get("money_source", ""), "is": x.get("income_stability", ""), "wi": x.get("who_influenced", ""), "t": t[:340] + ("…" if len(t) > 340 else "")})
    tf = C.Counter(toks(t[:1500])); dl.append(sum(tf.values()))
    for term, c in tf.items(): post[term].append([i, c])
out = {"n": len(rel), "avgdl": round(sum(dl) / len(dl), 2), "dl": dl, "post": {k: v for k, v in post.items() if len(v) <= len(rel) * 0.6}}
json.dump(out, open("../../webapp/api/rag_bm25.json", "w"), separators=(",", ":"))
json.dump(meta, open("../../webapp/api/rag_meta.json", "w"), ensure_ascii=False, separators=(",", ":"))
ids = [i for i, r in enumerate(rel) if r["uid"] in cache]
open("../../webapp/api/rag_vec.bin", "wb").write(b"".join(bytes(b & 0xFF for b in cache[rel[i]["uid"]]) for i in ids))
json.dump(ids, open("../../webapp/api/rag_vec_ids.json", "w"))
for f in ("rag_meta.json", "rag_bm25.json", "rag_vec.bin"): print(f, os.path.getsize("../../webapp/api/" + f) // 1024, "KB")
print("passages", len(rel), "with embeddings", len(ids))
