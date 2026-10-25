"""Run the live Ask handler on the nine research questions (and a few common variants) and save the answers that pass all four checks.
These are served instantly (no Gemini calls) so the most likely demo questions cannot fail on free-tier quota.
Usage: python3 build_answer_cache.py   (needs GEMINI_API_KEY and quota)"""
import json, os, subprocess, re
Q = json.load(open("../../webapp/evidence.json"))["questions"]
QUESTIONS = [q["question"] for q in Q] + ["Why do first-year investors stop their SIP?", "What do first-year investors need most?", "Why do investors pause their SIP?"]
js = r'''
const h = require("/home/user/groww-project/webapp/api/ask.js");
(async () => { const out = {};
for (const q of JSON.parse(process.argv[1])) {
  const res = { status() { return this; }, setHeader() {}, json(o) { this.o = o; return this; } };
  await h({ method: "POST", body: { question: q }, headers: {} }, res); out[q] = res.o; await new Promise(r => setTimeout(r, 2500));
} console.log(JSON.stringify(out)); })();'''
r = subprocess.run(["node", "-e", js, json.dumps(QUESTIONS)], capture_output=True, text=True, env={**os.environ, "RAG_DIR": "../../webapp/api"}, timeout=1200)
res = json.loads(r.stdout.strip().splitlines()[-1])
norm = lambda s: re.sub(r"[^a-z0-9 ]", "", s.lower()).strip()
cache, bad = {}, []
for q, o in res.items():
    if o.get("status") == "ok" and all(c["ok"] for c in o["checks"]):
        o = {k: v for k, v in o.items() if k not in ("model",)}; o["cached"] = True; cache[norm(q)] = o
    else: bad.append((q, o.get("status") or o.get("error")))
json.dump(cache, open("../../webapp/api/answer_cache.json", "w"), ensure_ascii=False)
print(f"cached {len(cache)}/{len(res)} answers"); [print("  not cached:", b) for b in bad]
