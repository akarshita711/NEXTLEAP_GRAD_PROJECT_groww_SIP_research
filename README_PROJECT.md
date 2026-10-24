# Groww SIP Retention: discovery engine + MVP (PM fellowship project)

Independent study, not affiliated with Groww. Not investment advice.

## Layout
- `engine/collect/`  data collectors (Play Store, Reddit archive, YouTube) + corpus builder
- `engine/analyze/`  Gemini extraction schema, client and runner
- `research/`        Google Form screener (questions + Apps Script)

## Run on your own machine
```
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install google-play-scraper requests
```
Create a `.env` file (never commit it):
```
YOUTUBE_API_KEY=...
GEMINI_API_KEY=...
```
Then from `engine/`:
```
python collect/playstore.py groww 40000
python collect/reddit.py
python collect/youtube.py
python collect/build_corpus.py
cd analyze && python extract.py ../data/processed/corpus.jsonl ../data/processed/extracted.jsonl
```
(On Windows load .env with `set` / PowerShell `$env:GEMINI_API_KEY="..."` before running.)
