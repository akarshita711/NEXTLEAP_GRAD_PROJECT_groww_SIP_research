# Groww SIP Retention: AI discovery engine + MVP (PM fellowship project)

Independent study. Not affiliated with Groww. Not investment advice.

## Layout
- `webapp/`  the deployable discovery engine (static page + one serverless function). Deploy steps in `webapp/DEPLOY.md`.
- `engine/collect/`  collectors (Play Store, Reddit archive, YouTube comments), corpus builder, seeded Reddit sampling
- `engine/analyze/`  extraction schema + prompts (v1, v2), batched Gemini client with rate limiting, theme/finding builders, golden-set tools
- `engine/data/processed/`  corpus, extraction outputs, themes, Evidence-Log statistics (`evidence_log_part1_data.md`)
- `research/`  Google Form screener (questions + Apps Script)
- `part2_metric_decomposition.md`  the metric decomposition draft
- `golden_set_labelling_sheet.xlsx`  blind 20-item sheet to label by hand

## Run locally
```
pip install google-play-scraper requests openpyxl
# .env at project root:  GEMINI_API_KEY=...   YOUTUBE_API_KEY=...
cd engine
python collect/playstore.py groww 40000
python collect/reddit.py && python collect/reddit_comments.py
YOUTUBE_API_KEY=... python collect/youtube.py
python collect/build_corpus.py
bash run_remaining.sh            # extraction (resumable) + rebuilds webapp/findings.json
```
Raw scraped data (`engine/data/raw/`) is not in the zip (re-collectable, ~40 MB).

## Golden-set evaluation (after you label the sheet)
`cd engine/analyze && python evaluate.py ../../golden_set_labelling_sheet_LABELLED.xlsx`
(needs `engine/data/processed/golden_engine_labels.json`, which I keep out of the zip until you finish labelling so your labels stay blind).

## Two prompt versions
- v1: used for the first 4,860 items. Known fault: marked ULIP / PPF / insurance "SIPs" as relevant.
- v2: scope fix. Used for later items and by the web app. `run_remaining.sh` re-checks every v1-relevant item under v2.

## Sampling notes
Reddit: all r/IndiaInvestments SIP posts; seeded hash-sampling of the larger subreddits (`collect/sampling.py`). Reddit comments: random sample of 3,000 (seed 5) of 14,211 in corpus.
