## Sources and volumes

- Play Store (Groww, India, English UI): 40,000 reviews collected (Mar-Oct 2026)
- Reddit posts mentioning SIP/mutual funds (r/IndiaInvestments, r/personalfinanceindia, r/mutualfunds, r/IndianStockMarket, r/FIREIndia, r/IndiaPersonalFinance; Oct 2024-Oct 2026): 38,517
- Reddit comments downloaded for sampled SIP threads: 15,862
- YouTube comments (116 SIP / first-time-investing videos): 15,799

## Funnel

- Corpus after dedupe, length and SIP/mutual-fund keyword filters + seeded Reddit sampling: 21,073 (by source {'playstore': 497, 'reddit': 3549, 'reddit_comment': 14211, 'youtube': 2816})
- Analysed by LLM so far: 11,711 (v1 prompt 3,056; v2 prompt 8,655); not yet processed: 0 (v2 re-check complete)
- Judged relevant (own mutual-fund SIP experience, confidence>=3, quote verified): 4,952
- Drop-off signals: 696; first-year relevant: 1,063 (drop-offs 122)

## Models used
 {'gemini-3.5-flash-lite': 7579, 'gemini-3.1-flash-lite': 4111, 'gemini-3.8-flash': 9, 'gemini-3.5-flash': 12}

## Automatic quality checks
 {'quote_verbatim_pct': 98.5, 'mean_confidence': 4.9}

## Ask engine (RAG) quality, final run 30 Oct 2026
- Index: all 4,952 relevant conversations embedded (gemini-embedding-001, 256 dims) + BM25 keyword index + extracted-field filters; LLM query rewrite and LLM re-ranking of the top 40; answer of 2-3 sentences with four automatic checks (real citations, <=3 sentences, numbers from computed counts, no advice language).
- Fixed 19-question test: handled correctly 19/19 (9 research questions, 3 further answerable, 3 advice requests declined, 2 off-topic refused, 2 prompt-injection attempts resisted).
- Retrieval precision@5 (Gemini judge): 78% on the final run; 43-78% across six runs as the index grew and re-ranking was added.
- Groundedness (Gemini judge, all claims vs retrieved passages and counts): 11/12 answers fully supported on the final run; 12/12 saved answers pass the same judge.
- Free tier only. Daily limits: 1,000 embeddings, 500 generations per model.
- Run history table: ask_eval_history.md. Rejected AI headlines: ai_headline_review.md.
