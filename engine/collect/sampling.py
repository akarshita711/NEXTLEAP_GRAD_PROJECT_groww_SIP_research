"""Deterministic, seeded sampling of Reddit posts so the corpus is reproducible and fits the free LLM quota.
r/IndiaInvestments: all SIP-related posts. Larger subs: hash-based random sample at the rates below (documented in Evidence Log)."""
import hashlib, re
STRICT = re.compile(r"\b(sip|sips|systematic investment)\b", re.I)
RATES = {"mutualfunds": 0.07, "personalfinanceindia": 0.19, "IndianStockMarket": 0.20, "FIREIndia": 1.0, "IndiaPersonalFinance": 1.0}
def include_post(p):
    txt = p["title"] + " " + p["text"]
    if p["sub"] == "IndiaInvestments": return True                       # already collected + extracted in full (any MF/SIP mention)
    if not STRICT.search(txt) or len(p["text"].split()) < 25: return False
    h = int(hashlib.md5(("seed7" + p["id"]).encode()).hexdigest(), 16) % 1000
    return h < RATES.get(p["sub"], 0) * 1000
