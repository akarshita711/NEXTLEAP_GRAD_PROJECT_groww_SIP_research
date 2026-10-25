"""Write a one-paragraph headline per research question with Gemini, constrained to the evidence pack, and keep it only if it passes the same checks the live engine applies."""
import json, re
from gemini import call
ADVICE = re.compile(r"\b(you should|i recommend|we recommend|consider (buying|investing in)|best fund)\b", re.I)
SCHEMA = {"type": "OBJECT", "required": ["headline"], "properties": {"headline": {"type": "STRING"}}}
E = json.load(open("../../webapp/evidence.json"))
def pack_text(q):
    L = [f"QUESTION {q['id']}: {q['question']}"]
    for s in q["stats"]: L.append(f"- {s['label']}: " + "; ".join(f"{r[0]} {r[1]} ({r[2]}%)" for r in s["rows"]))
    L.append("Caveats: " + " ".join(q["caveats"])); return "\n".join(L)
def allowed_numbers(q):
    a = set()
    for s in q["stats"]:
        a |= set(re.findall(r"\d[\d,.]*\d|\d", s["label"].replace(",", ""))); a.add(str(s["base"]))
        for r in s["rows"]:
            for v in r[1:]:
                if isinstance(v, (int, float)): a |= {str(v), str(round(v)), f"{v:.1f}"}
    return {x.rstrip(".") for x in a}
ok = 0
for q in E["questions"]:
    prompt = f"""Write a headline answer of at most 60 words to the research question, using ONLY the evidence. Plain language, no jargon. Use only numbers present in the evidence, exactly as written, and say who they refer to. If a group has fewer than 30 items, say the evidence is thin and give no percentage for it. Never give advice or recommendations.

{pack_text(q)}"""
    try:
        x, model = call(prompt, SCHEMA); h = x["headline"].strip()
        bad = [n for n in re.findall(r"\d[\d,]*\.?\d*", h) if (float(n.replace(",", "").rstrip(".")) >= 10) and n.replace(",", "").rstrip(".") not in allowed_numbers(q) and str(round(float(n.replace(",", "").rstrip(".")))) not in allowed_numbers(q)]
        if bad or ADVICE.search(h): print(f"Q{q['id']} REJECTED numbers={bad}: {h[:120]}"); q["headline"] = ""; q["headline_status"] = "rejected"
        else: q["headline"] = h; q["headline_status"] = "verified"; ok += 1
    except Exception as e: print(f"Q{q['id']} error {e}"); q["headline"] = ""; q["headline_status"] = "error"
json.dump(E, open("../../webapp/evidence.json", "w"), ensure_ascii=False); json.dump(E, open("../../webapp/api/evidence.json", "w"), ensure_ascii=False)
print(f"{ok}/{len(E['questions'])} headlines verified")
