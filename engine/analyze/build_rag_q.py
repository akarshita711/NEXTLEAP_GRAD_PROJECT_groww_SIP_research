"""Embed the nine research questions (RETRIEVAL_QUERY) -> webapp/api/rag_q.json {id: int8 vector}. Used to route a question to the closest saved evidence pack."""
import json, os, math, requests, time
KEY = os.environ["GEMINI_API_KEY"]; E = json.load(open("../../webapp/evidence.json")); out = {}
for q in E["questions"]:
    for a in range(6):
        r = requests.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent", headers={"x-goog-api-key": KEY},
                          json={"content": {"parts": [{"text": q["question"]}]}, "taskType": "RETRIEVAL_QUERY", "outputDimensionality": 256}, timeout=60)
        if r.status_code == 200: break
        time.sleep(5 * (a + 1))
    v = r.json()["embedding"]["values"]; n = math.sqrt(sum(x * x for x in v)); out[q["id"]] = [round(127 * x / n) for x in v]; time.sleep(1)
json.dump(out, open("../../webapp/api/rag_q.json", "w")); print("ok", len(out))
