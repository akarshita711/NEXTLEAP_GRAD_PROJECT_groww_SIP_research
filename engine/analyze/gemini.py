import json, os, time, requests
KEY = os.environ.get("GEMINI_API_KEY")
MODELS = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.5-flash"]   # primary first, then fallbacks

def call(prompt, schema=None, models=MODELS, temperature=0.0, retries=6):
    body = {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"temperature": temperature}}
    if schema: body["generationConfig"].update({"responseMimeType": "application/json", "responseSchema": schema})
    last = None
    for attempt in range(retries):
        m = models[min(attempt // 2, len(models) - 1)]
        try:
            r = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent",
                              headers={"x-goog-api-key": KEY, "Content-Type": "application/json"}, json=body, timeout=90)
            if r.status_code == 200:
                t = r.json()["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(t) if schema else t
            last = f"{r.status_code} {r.text[:150]}"
        except Exception as e: last = str(e)
        time.sleep(2 ** min(attempt, 4))
    raise RuntimeError(last)
