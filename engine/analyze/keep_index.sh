#!/usr/bin/env bash
# Keep the resumable embedding indexer running until rag_vec.bin is complete.
cd "$(dirname "$0")"
set -a; . /tmp/claude-0/-home-user/779284cc-7a02-54b6-aae1-84847c82d446/scratchpad/.env; set +a
while [ ! -f ../../webapp/api/rag_vec.bin ]; do
  if ! pgrep -f "build_rag_index.py" > /dev/null; then python3 build_rag_index.py >> ../data/processed/rag_index2.log 2>&1; fi
  sleep 20
done
echo INDEX_COMPLETE; ls -la ../../webapp/api/rag_vec.bin
