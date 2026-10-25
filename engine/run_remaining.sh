#!/usr/bin/env bash
# Finish the extraction when Gemini quota is available (enable billing, or run again after the daily reset).
# Usage: put GEMINI_API_KEY in ../.env  then:  bash run_remaining.sh
set -e
cd "$(dirname "$0")/analyze"
set -a; [ -f ../../.env ] && . ../../.env; set +a
python3 make_pending.py
PROMPT_VER=v2 python3 extract.py ../data/processed/pending_rest.jsonl ../data/processed/extracted_v2.jsonl
python3 build_findings.py
