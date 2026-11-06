"""Score a prompt version on the hand-labelled golden set (exact and coarse agreement). Usage: python3 eval_version.py v3 [run_tag]"""
import json, sys
from schema import batch_schema, BATCH_PROMPT_V2, BATCH_PROMPT_V3
from gemini import call
ver, tag = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "")
ns = {}; exec(open("golden_report.py").read().split("res = {n:")[0], ns)
H, F, coarse = ns["H"], ns["F"], ns["coarse"]
ids = list(H)
tmpl = {"v2": BATCH_PROMPT_V2, "v3": BATCH_PROMPT_V3}[ver]
items = "\n\n".join(f'[{i}] """{H[k]["text"][:1500]}"""' for i, k in enumerate(ids))
res, model = call(tmpl.format(n=len(ids), items=items), batch_schema())
E = {ids[x["idx"]]: x for x in res if 0 <= x.get("idx", -1) < len(ids)}
json.dump({"model": model, "labels": E}, open(f"../data/processed/golden_engine_labels_{ver}{tag}.json", "w"), indent=1, ensure_ascii=False)
hr = [k for k in ids if H[k]["rel"]]
tp = sum(1 for k in ids if H[k]["rel"] and E[k]["relevant"]); fp = sum(1 for k in ids if not H[k]["rel"] and E[k]["relevant"]); fn = len(hr) - tp; tn = len(ids) - len(hr) - fp
print(f"{ver}{tag} ({model}): relevance {tp + tn}/20, precision {round(100 * tp / max(1, tp + fp))}%, recall {round(100 * tp / len(hr))}%")
ex = co = 0
for f in F:
    e = sum(1 for k in hr if E[k]["relevant"] and E[k][f] == H[k][f]); c = sum(1 for k in hr if E[k]["relevant"] and coarse[f](E[k][f]) == coarse[f](H[k][f])); ex += e; co += c
    print(f"  {f:15} exact {e}/16  coarse {c}/16")
print(f"  pooled detailed: exact {ex}/80 ({round(100 * ex / 80)}%), coarse {co}/80 ({round(100 * co / 80)}%); overall exact incl. relevance {tp + tn + ex}/100")
