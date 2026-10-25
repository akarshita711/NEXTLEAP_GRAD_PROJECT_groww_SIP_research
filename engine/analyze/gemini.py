import json, os, re, threading, time, requests
KEY = os.environ.get("GEMINI_API_KEY")
MODELS = os.environ.get("MODELS", "gemini-3.5-flash-lite,gemini-3.1-flash-lite,gemini-3.5-flash").split(",")   # primary first, then fallbacks
RPM = 13                                                                          # free tier is 15 requests/min/model; stay under it
_lock, _last, _dead = threading.Lock(), {}, set()   # _dead = models whose daily free quota is spent

def _wait(model):
    """Per-model spacing so concurrent workers never exceed the free-tier RPM."""
    with _lock:
        gap = 60.0 / RPM; now = time.time(); t = max(now, _last.get(model, 0) + gap); _last[model] = t
    time.sleep(max(0, t - now))

def call(prompt, schema=None, models=MODELS, temperature=0.0, retries=8):
    body = {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"temperature": temperature}}
    if schema: body["generationConfig"].update({"responseMimeType": "application/json", "responseSchema": schema})
    last = None
    for attempt in range(retries):
        live = [x for x in models if x not in _dead]
        if not live: raise RuntimeError("DAILY QUOTA exhausted on all models")
        m = live[attempt % len(live)] if attempt else live[0]
        _wait(m)
        try:
            r = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent",
                              headers={"x-goog-api-key": KEY, "Content-Type": "application/json"}, json=body, timeout=120)
            if r.status_code == 200:
                t = r.json()["candidates"][0]["content"]["parts"][0]["text"]
                return (json.loads(t) if schema else t), m
            last = f"{r.status_code} {r.text[:200]}"
            if r.status_code == 429 and "PerDay" in r.text: _dead.add(m); continue
        except RuntimeError: raise
        except Exception as e: last = str(e)
        time.sleep(min(2 ** attempt, 20))
    raise RuntimeError(last)
