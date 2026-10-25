"""Single source of truth: export the extraction schema/prompt/mappings to JSON for the web app's serverless function."""
import json
from schema import ENUMS, LISTS, gemini_schema, PROMPT, PROMPT_V2
BRANCH = {  # trigger -> decomposition branch (Part 2)
 "failed_payment_or_mandate": "S1", "app_issue": "S1",
 "cash_flow_pressure": "S2a", "life_event": "S2a",
 "low_or_negative_returns": "S2b", "expectation_mismatch": "S2b", "confusion_about_numbers": "S2b",
 "better_alternative": "S2c", "advice_from_others": "S2c", "lost_interest_or_forgot": "S3"}
BRANCH_NAMES = {"S1": "Involuntary: SIP broke (payment, mandate, app)", "S2a": "Voluntary: money / life event",
 "S2b": "Voluntary: understanding & expectation", "S2c": "Voluntary: pulled elsewhere", "S3": "Silent drift"}
OPP = {"failed_payment_alerts": "O1", "flexible_pause_or_reduce": "O2", "plain_language_explanation": "O3", "reassurance_whats_normal": "O3",
       "expectation_setting": "O3", "simple_returns_view": "O3", "goal_progress_view": "O3", "trusted_human_help": "O4"}
OPP_NAMES = {"O1": "Fix failed/missed instalments fast", "O2": "A middle path: pause / reduce / skip", "O3": "Explain 'what am I looking at, is this normal?'", "O4": "Trusted help / re-engagement"}
json.dump({"enums": ENUMS, "lists": LISTS, "schema": gemini_schema(), "prompt_v1": PROMPT.split("TEXT:")[0].strip(), "prompt": PROMPT_V2.split("TEXT:")[0].strip(),
           "branch": BRANCH, "branch_names": BRANCH_NAMES, "opp": OPP, "opp_names": OPP_NAMES},
          open("../../webapp/api/engine_config.json", "w"), ensure_ascii=False, indent=1)
print("ok")
