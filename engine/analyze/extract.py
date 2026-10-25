"""Batched structured extraction over corpus.jsonl -> extracted.jsonl (resumable, rate-limited)."""
import json, sys, os, concurrent.futures as cf
from schema import batch_schema, BATCH_PROMPT, BATCH_PROMPT_V2
from gemini import call
BATCH = int(os.environ.get("BATCH", 12))
VER = os.environ.get("PROMPT_VER", "v2")
TEMPLATE = BATCH_PROMPT_V2 if VER == "v2" else BATCH_PROMPT

def run(inp, out, limit=None, workers=int(os.environ.get("WORKERS", 4))):
    done = set()
    if os.path.exists(out): done = {json.loads(l)["uid"] for l in open(out) if json.loads(l).get("x")}
    rows = [json.loads(l) for l in open(inp)]
    rows = [r for r in rows if r["uid"] not in done][:limit]
    chunks = [rows[i:i + BATCH] for i in range(0, len(rows), BATCH)]
    schema = batch_schema()
    def work(chunk):
        items = "\n\n".join(f'[{i}] """{r["text"][:1500]}"""' for i, r in enumerate(chunk))
        try:
            res, model = call(TEMPLATE.format(n=len(chunk), items=items), schema)
        except Exception as e:
            return [{**r, "x": None, "error": str(e)[:200]} for r in chunk]
        by = {x.get("idx"): x for x in res if isinstance(x, dict)}
        outp = []
        for i, r in enumerate(chunk):
            x = by.get(i)
            if x is None: outp.append({**r, "x": None, "error": "missing in batch output"}); continue
            q = x.get("evidence_quote", "")
            x["quote_verbatim"] = (q == "") or (q.strip().lower()[:80] in r["text"].lower())
            outp.append({**r, "x": x, "model": model, "prompt": VER})
        return outp
    n = 0
    with open(out, "a") as f, cf.ThreadPoolExecutor(workers) as ex:
        for res in ex.map(work, chunks):
            for r in res: f.write(json.dumps(r, ensure_ascii=False) + "\n")
            f.flush(); n += len(res); print(n, "/", len(rows), flush=True)

if __name__ == "__main__":
    run(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else None)
