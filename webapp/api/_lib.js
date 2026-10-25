// Shared helpers for the serverless functions (files starting with "_" are not exposed as endpoints).
const MODELS = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.5-flash"];
const hits = new Map(); const day = {};            // best-effort, per warm instance
function limited(ip, bucket, perHour, perDay) {
  const now = Date.now(), d = new Date().toISOString().slice(0, 10);
  const k = bucket + d; day[k] = day[k] || 0;
  if (day[k] >= perDay) return "daily";
  const key = bucket + ip, arr = (hits.get(key) || []).filter(t => now - t < 3600e3);
  if (arr.length >= perHour) return "hourly";
  arr.push(now); hits.set(key, arr); day[k]++; return null;
}
async function gemini(prompt, schema, timeoutMs = 25000) {
  let last = "";
  for (const m of MODELS) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: "POST", headers: { "x-goog-api-key": process.env.GEMINI_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0, responseMimeType: "application/json", responseSchema: schema } }),
        signal: AbortSignal.timeout(timeoutMs) });
      if (r.ok) { const j = await r.json(); return { x: JSON.parse(j.candidates[0].content.parts[0].text), model: m }; }
      last = `${m}:${r.status}`;
    } catch (e) { last = `${m}:${e.name}`; }
  }
  const err = new Error("capacity"); err.detail = last; throw err;
}
module.exports = { MODELS, limited, gemini };
