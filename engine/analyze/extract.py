"""Run structured extraction over corpus.jsonl -> extracted.jsonl (resumable, concurrent)."""
import json, sys, os, concurrent.futures as cf
from schema import gemini_schema, PROMPT
from gemini import call

def run(inp, out, limit=None, workers=8):
    done = set()
    if os.path.exists(out): done = {json.loads(l)["uid"] for l in open(out)}
    rows = [json.loads(l) for l in open(inp)]
    rows = [r for r in rows if r["uid"] not in done][:limit]
    schema = gemini_schema()
    def work(r):
        try:
            x = call(PROMPT.format(text=r["text"][:3000]), schema)
            q = x.get("evidence_quote", "")
            x["quote_verbatim"] = (q == "") or (q.strip().lower()[:80] in r["text"].lower())   # hallucination check
            return {**r, "x": x}
        except Exception as e:
            return {**r, "x": None, "error": str(e)}
    with open(out, "a") as f, cf.ThreadPoolExecutor(workers) as ex:
        for i, res in enumerate(ex.map(work, rows), 1):
            f.write(json.dumps(res, ensure_ascii=False) + "\n"); f.flush()
            if i % 50 == 0: print(i, "/", len(rows), flush=True)

if __name__ == "__main__":
    run(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else None)
