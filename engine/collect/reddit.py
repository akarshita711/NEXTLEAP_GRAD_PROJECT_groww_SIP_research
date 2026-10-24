"""Collect Indian investing Reddit posts + comments via the public Arctic Shift archive.
Strategy: list all posts per subreddit in a time window (the text-search endpoint is flaky), keep SIP-relevant ones locally,
then fetch their comment trees."""
import json, re, sys, time, requests

BASE = "https://arctic-shift.photon-reddit.com/api"
SUBS = ["IndiaInvestments", "personalfinanceindia", "IndianStockMarket", "mutualfunds", "Indiainvestor", "IndiaPersonalFinance", "FIREIndia"]
SIP_RE = re.compile(r"\b(sip|sips|systematic investment|mutual fund|mutual funds|mf|groww|zerodha coin|indmoney|nav|xirr|instal?lment)\b", re.I)
SINCE = int(time.mktime((2024, 10, 1, 0, 0, 0, 0, 0, 0)))

def get(path, **params):
    for i in range(6):
        try:
            r = requests.get(f"{BASE}/{path}", params=params, timeout=60)
            j = r.json()
            if j.get("data") is not None: return j["data"]
        except Exception as e: pass
        time.sleep(2 + 2 * i)
    return []

def posts(sub):
    before, out = None, []
    while True:
        p = dict(subreddit=sub, limit=100, sort="desc", after=SINCE)
        if before: p["before"] = before
        batch = get("posts/search", **p)
        if not batch: break
        out += batch; before = batch[-1]["created_utc"]
        print(sub, len(out), flush=True)
        if len(batch) < 100: break
    return out

if __name__ == "__main__":
    with open("data/raw/reddit.jsonl", "w") as f:
        for sub in SUBS:
            for p in posts(sub):
                txt = f"{p.get('title','')} {p.get('selftext','')}"
                if not SIP_RE.search(txt): continue
                f.write(json.dumps({"source": "reddit_post", "sub": sub, "id": p["id"], "date": p["created_utc"], "title": p.get("title"),
                                    "text": p.get("selftext", ""), "score": p.get("score"), "num_comments": p.get("num_comments")}, ensure_ascii=False) + "\n")
