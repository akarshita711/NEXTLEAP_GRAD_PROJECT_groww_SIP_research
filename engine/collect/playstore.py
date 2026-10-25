"""Collect Play Store reviews for Groww (and comparison apps). Public data only."""
import json, sys, time
from google_play_scraper import reviews, Sort

APPS = {"groww": "com.nextbillion.groww", "zerodha_coin": "com.zerodha.coin", "indmoney": "in.indwealth"}

def pull(app_key, target, out):
    pkg, token, n = APPS[app_key], None, 0
    with open(out, "w") as f:
        while n < target:
            try:
                batch, token = reviews(pkg, lang="en", country="in", sort=Sort.NEWEST, count=200, continuation_token=token)
            except Exception as e:
                print("retry", e, file=sys.stderr); time.sleep(3); continue
            for r in batch:
                f.write(json.dumps({"source": "playstore", "app": app_key, "id": r["reviewId"], "date": r["at"].isoformat(),
                                    "rating": r["score"], "text": r["content"], "thumbs_up": r["thumbsUpCount"],
                                    "app_version": r["appVersion"]}, ensure_ascii=False) + "\n")
            n += len(batch); print(app_key, n, flush=True)
            if not token or not batch: break
            time.sleep(0.3)

if __name__ == "__main__":
    pull(sys.argv[1], int(sys.argv[2]), f"data/raw/playstore_{sys.argv[1]}.jsonl")
