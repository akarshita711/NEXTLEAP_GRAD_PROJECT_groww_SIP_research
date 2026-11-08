## Sources and volumes

- Play Store (Groww, India, English UI): 40,000 reviews collected (Mar-Oct 2026)
- Reddit posts mentioning SIP/mutual funds (r/IndiaInvestments, r/personalfinanceindia, r/mutualfunds, r/IndianStockMarket, r/FIREIndia, r/IndiaPersonalFinance; Oct 2024-Oct 2026): 38,517
- Reddit comments downloaded for sampled SIP threads: 15,862
- YouTube comments (116 SIP / first-time-investing videos): 15,799

## Funnel

- Corpus after dedupe, length and SIP/mutual-fund keyword filters + seeded Reddit sampling: 21,073 (by source {'playstore': 497, 'reddit': 3549, 'reddit_comment': 14211, 'youtube': 2816})
- Analysed by LLM so far: 11,711 (final labels: v3 prompt 11,711; v2 0; v1 0); not yet processed: 0 (v2 re-check complete)
- Judged relevant (own mutual-fund SIP experience, confidence>=3, quote verified): 8,871
- Drop-off signals: 334; first-year relevant: 774 (drop-offs 28)

## Models used
 {'gemini-3.1-flash-lite': 6792, 'gemini-flash-lite-latest': 2579, 'gemini-3.5-flash-lite': 2340}

## Automatic quality checks
 {'quote_verbatim_pct': 97.8, 'mean_confidence': 4.89}
