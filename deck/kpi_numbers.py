"""Evidence numbers for the KPI tree, computed from the engine outputs (webapp/findings.json, webapp/evidence.json)."""
import json
F = json.load(open("/home/user/groww-project/webapp/findings.json"))
E = json.load(open("/home/user/groww-project/webapp/evidence.json"))
br = dict(F["branch_all_drop"]); stated = sum(v for k, v in br.items() if k != "unstated")
pc = lambda a, b: round(100 * a / b) if b else 0
opp_fy, opp_drop = dict(F["opp_first_year_all"]), dict(F["opp_all_drop"])
q6 = [s for q in E["questions"] if q["id"] == 6 for s in q["stats"]][0]
src = {r[0]: r[2] for r in q6["rows"]}
N = {
  "relevant": F["relevant"], "drop": F["drop"], "first_year": F["first_year"], "stated": stated,
  "S1": pc(br.get("S1", 0), stated), "S2a": pc(br.get("S2a", 0), stated), "S2b": pc(br.get("S2b", 0), stated), "S2c": pc(br.get("S2c", 0), stated),
  "O3_fy": pc(opp_fy.get("O3", 0), F["first_year"]), "O4_fy": pc(opp_fy.get("O4", 0), F["first_year"]), "O2_drop": pc(opp_drop.get("O2", 0), F["drop"]), "O1_drop": pc(opp_drop.get("O1", 0), F["drop"]),
  "yt": round(src.get("youtube", 0)), "reddit": round(src.get("reddit forums", 0)), "outside_n": q6["base"],
}
json.dump(N, open("/home/user/groww-project/deck/kpi_numbers.json", "w"), indent=1); print(N)
