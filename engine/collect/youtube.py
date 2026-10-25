"""Collect YouTube comments from Indian SIP / first-time-investing videos. Needs YOUTUBE_API_KEY in env."""
import json, os, requests, sys, time
KEY = os.environ["YOUTUBE_API_KEY"]
QUERIES = ["SIP for beginners India", "why I stopped my SIP", "SIP kaise start kare", "SIP returns negative first year", "should I pause my SIP",
           "mutual fund SIP mistakes beginners", "SIP 1 year review", "SIP stop kare ya nahi", "Groww SIP", "SIP not giving returns"]
API = "https://www.googleapis.com/youtube/v3"

def api(path, **p):
    r = requests.get(f"{API}/{path}", params={**p, "key": KEY}, timeout=30)
    if r.status_code != 200: print(r.status_code, r.text[:200], file=sys.stderr); return {}
    return r.json()

vids = {}
for q in QUERIES:
    d = api("search", part="snippet", q=q, type="video", maxResults=15, regionCode="IN", relevanceLanguage="en")
    for it in d.get("items", []): vids[it["id"]["videoId"]] = it["snippet"]["title"]
print(len(vids), "videos", flush=True)
with open("data/raw/youtube.jsonl", "w") as f:
    for vid, title in vids.items():
        tok, n = None, 0
        while n < 400:
            d = api("commentThreads", part="snippet", videoId=vid, maxResults=100, order="relevance", textFormat="plainText", **({"pageToken": tok} if tok else {}))
            for it in d.get("items", []):
                s = it["snippet"]["topLevelComment"]["snippet"]
                f.write(json.dumps({"source": "youtube", "video_id": vid, "video_title": title, "id": it["id"], "date": s["publishedAt"],
                                    "text": s["textDisplay"], "likes": s["likeCount"]}, ensure_ascii=False) + "\n"); n += 1
            tok = d.get("nextPageToken")
            if not tok: break
        print(vid, n, flush=True)
