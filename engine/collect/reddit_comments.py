"""Fetch comment threads for SIP-related Reddit posts (public Arctic Shift archive). Resumable."""
import json, os, re, sys, time, requests, concurrent.futures as cf
from sampling import include_post, STRICT
S = re.compile(r"\b(sip|sips|systematic investment)\b", re.I)
OUT = "data/raw/reddit_comments.jsonl"

def fetch(pid):
    for i in range(6):
        try:
            j = requests.get("https://arctic-shift.photon-reddit.com/api/comments/search", params={"link_id": pid, "limit": 100}, timeout=60).json()
            if j.get("data") is not None: return j["data"]
        except Exception: pass
        time.sleep(2 + 2 * i)
    return None

def main():
    done = set(json.loads(l)["post_id"] for l in open(OUT)) if os.path.exists(OUT) else set()
    posts = [json.loads(l) for l in open("data/raw/reddit.jsonl")]
    posts = [p for p in posts if include_post(p) and STRICT.search(p["title"] + " " + p["text"]) and p["id"] not in done]
    print(len(posts), "posts to fetch", flush=True)
    def work(p): return p, fetch(p["id"])
    with open(OUT, "a") as f, cf.ThreadPoolExecutor(4) as ex:
        for i, (p, cs) in enumerate(ex.map(work, posts), 1):
            if cs is None: continue
            for c in cs:
                f.write(json.dumps({"post_id": p["id"], "sub": p["sub"], "thread_title": p["title"], "id": c["id"], "parent_id": c.get("parent_id"),
                                    "date": c["created_utc"], "text": c.get("body", ""), "score": c.get("score")}, ensure_ascii=False) + "\n")
            f.write(json.dumps({"post_id": p["id"], "marker": True, "text": ""}) + "\n")   # marks post as done even if 0 comments
            f.flush()
            if i % 50 == 0: print(i, flush=True)
main()
