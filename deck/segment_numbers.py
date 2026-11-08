"""Share of first-time (first-year) investors by segment, from engine labels (v3 where available) + pass-2 age/money fields."""
import json, collections as C
P = "/home/user/groww-project/engine/data/processed/"
def load(p):
    try: return [json.loads(l) for l in open(P + p)]
    except FileNotFoundError: return []
m = {r["uid"]: r for r in load("extracted.jsonl") if r.get("x")}
for f in ("extracted_v2.jsonl", "extracted_v3.jsonl"): m.update({r["uid"]: r for r in load(f) if r.get("x")})
p2 = {r["uid"]: r["p2"] for r in load("extracted_p2.jsonl") if r.get("p2")}
rel = [r for r in m.values() if r["x"]["relevant"] and r["x"]["quote_verbatim"] and r["x"]["confidence"] >= 3]
fy = [r for r in rel if r["x"]["investor_stage"] in ("started_0_3m", "early_3_12m") or (r["x"]["months_since_start"] is not None and 0 <= r["x"]["months_since_start"] <= 12)]
def seg(r):
    x, p = r["x"], p2.get(r["uid"]) or {}
    inc, age, ms = x["income_stability"], p.get("age_band", "not_stated"), p.get("money_source", "not_stated")
    if inc in ("irregular", "variable_pay") or ms == "side_income_or_freelance": return "variable"
    if age == "under_22" or inc == "student_or_dependent" or ms == "family_allowance": return "student"
    if age in ("22_25", "26_30"): return "early"
    if age in ("31_35", "36_plus"): return "mid"
    if inc == "fixed_salary" or ms == "monthly_salary": return "early_or_mid_salaried"
    return None
c = C.Counter(seg(r) for r in fy if seg(r))
known = sum(v for k, v in c.items() if k != "early_or_mid_salaried")
out = {"first_year": len(fy), "with_p2": sum(1 for r in fy if r["uid"] in p2), "counts": dict(c), "assigned_by_age_or_income": known,
       "share": {k: round(100 * c[k] / known) for k in ("student", "early", "variable", "mid")}}
json.dump(out, open("/home/user/groww-project/deck/segment_numbers.json", "w"), indent=1); print(out)
