"""Merge raw sources into one corpus.jsonl: dedupe, drop empty/very short, keyword pre-filter (cheap) before LLM relevance check."""
import json, re, hashlib, glob, datetime, sys
sys.path.insert(0, "collect")
from sampling import include_post
KW = re.compile(r"\b(sip|sips|systematic|mutual funds?|instal+ments?|autopay|mandate|nach|xirr|nav|units?|paus\w*|stopp?\w*|redeem|redemption|returns?|invest\w*)\b|एसआईपी|sip band|म्यूचुअल", re.I)
SIP = re.compile(r"\b(sip|sips|systematic investment|mutual funds?)\b|एसआईपी|म्यूचुअल", re.I)
seen, out, stats = set(), [], {}
def add(src, uid, text, date, meta, need_kw=True, min_words=8):
    t = re.sub(r"\s+", " ", (text or "")).strip()
    h = hashlib.md5(t.lower().encode()).hexdigest()
    if len(t.split()) < min_words or h in seen: return
    if t in ("[deleted]", "[removed]"): return
    if need_kw and not SIP.search(t): return          # must mention SIP / mutual funds (comments inherit it from their SIP thread)
    seen.add(h); stats[src] = stats.get(src, 0) + 1
    out.append({"uid": f"{src}:{uid}", "source": src, "date": date, "text": t, "meta": meta})
for l in open("data/raw/playstore_groww.jsonl"):
    r = json.loads(l); add("playstore", r["id"], r["text"], r["date"][:10], {"rating": r["rating"]})
try:
    for l in open("data/raw/reddit.jsonl"):
        r = json.loads(l)
        if not include_post(r): continue
        d = datetime.datetime.utcfromtimestamp(r["date"]).strftime("%Y-%m-%d")
        add("reddit", r["id"], f"{r['title']}. {r['text']}", d, {"sub": r["sub"], "score": r["score"], "num_comments": r["num_comments"]})
except FileNotFoundError: pass
try:
    for l in open("data/raw/reddit_comments.jsonl"):
        r = json.loads(l)
        if r.get("marker"): continue
        d = datetime.datetime.utcfromtimestamp(r["date"]).strftime("%Y-%m-%d")
        add("reddit_comment", r["id"], f"[Thread: {r['thread_title']}] {r['text']}", d, {"sub": r["sub"], "post_id": r["post_id"], "score": r["score"]}, need_kw=False, min_words=14)
except FileNotFoundError: pass
for l in open("data/raw/youtube.jsonl"):
    r = json.loads(l); add("youtube", r["id"], r["text"], r["date"][:10], {"video": r["video_title"], "likes": r["likes"]})
json.dump(stats, open("data/processed/corpus_stats.json", "w"), indent=1)
with open("data/processed/corpus.jsonl", "w") as f:
    for r in out: f.write(json.dumps(r, ensure_ascii=False) + "\n")
print(stats, len(out))
