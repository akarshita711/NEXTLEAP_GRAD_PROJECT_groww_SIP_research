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
