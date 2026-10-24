"""Extraction schema. Closed enums keep outputs comparable and easy to score against the golden set."""
ENUMS = {
 "investor_stage": ["considering", "started_0_3m", "early_3_12m", "established_12m_plus", "unclear"],
 "sip_event": ["none", "started", "continuing", "paused", "reduced", "stopped", "failed_instalment", "switched_platform", "considering_stopping", "unclear"],
 "trigger": ["cash_flow_pressure", "low_or_negative_returns", "expectation_mismatch", "confusion_about_numbers", "failed_payment_or_mandate",
             "better_alternative", "lost_interest_or_forgot", "life_event", "advice_from_others", "app_issue", "none", "unclear"],
 "emotion": ["anxious", "confused", "disappointed", "frustrated", "neutral", "content", "confident"],
 "income_stability": ["fixed_salary", "variable_pay", "irregular", "student_or_dependent", "unknown"],
 "who_influenced": ["friend_colleague", "family", "creator_social", "workplace", "app_prompt", "self_research", "unknown"],
 "unmet_need": ["reassurance_whats_normal", "plain_language_explanation", "flexible_pause_or_reduce", "failed_payment_alerts", "expectation_setting",
                "goal_progress_view", "simple_returns_view", "trusted_human_help", "none"],
}
LISTS = {
 "what_they_check": ["current_value", "returns_percent", "xirr", "nav", "units", "sip_date_status", "statement", "market_news", "none"],
 "outside_app": ["youtube", "reddit_forums", "friends_family", "advisor", "google_search", "whatsapp_telegram", "compare_other_platform", "none"],
}

def gemini_schema():
    props = {"relevant": {"type": "BOOLEAN"}, "months_since_start": {"type": "INTEGER", "nullable": True},
             "confidence": {"type": "INTEGER"}, "evidence_quote": {"type": "STRING"}}
    for k, v in ENUMS.items(): props[k] = {"type": "STRING", "enum": v}
    for k, v in LISTS.items(): props[k] = {"type": "ARRAY", "items": {"type": "STRING", "enum": v}}
    return {"type": "OBJECT", "properties": props, "required": list(props)}

PROMPT = """You analyse one public post/comment/review by an Indian retail investor about mutual fund SIPs (Systematic Investment Plans).
Extract ONLY what the text explicitly states or very strongly implies. Never guess: use "unclear"/"unknown"/"none" when not stated.

- relevant: true only if the author describes THEIR OWN or a specific person's SIP/mutual-fund investing experience, expectations, doubts or behaviour. False for pure app bugs, stock/IPO/F&O trading, generic praise ("nice app"), promotions, or pure Q&A about unrelated topics.
- months_since_start: integer months since they began their SIP, only if stated or computable; else null.
- sip_event: what happened to THEIR SIP (paused/reduced/stopped/failed_instalment/considering_stopping/switched_platform/continuing/started/none).
- trigger: the main stated reason behind the event or worry.
- what_they_check: things the author says they look at in the app/statement. outside_app: where they go when unsure.
- income_stability / who_influenced: only if explicitly stated.
- unmet_need: the single most important unmet need that the text reveals.
- evidence_quote: an EXACT verbatim substring of the text (max 200 chars) supporting your sip_event/trigger. Empty string if not relevant.
- confidence: 1 (low) to 5 (high) in your overall extraction.
Posts may be in English, Hindi or Hinglish. Do not provide investment advice.

TEXT:
\"\"\"{text}\"\"\""""
