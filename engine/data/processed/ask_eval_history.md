*Free Gemini tier. Pipeline: LLM query rewrite and field focus -> hybrid keyword + field-filtered + dense retrieval -> LLM re-ranking of the top 40 -> answer -> four built-in checks. Judge: Gemini scores retrieved passages for relevance (P@5) and checks every claim against the retrieved passages and counts (grounded). "NO" under Handled in some runs means a safe refusal on a segment question the evidence could not support, not a wrong answer.*

## Run history (same 19 questions; add a row after every run)
| Run | Embedded conversations | Re-ranking | Handled | P@5 | Grounded |
|---|---|---|---|---|---|
| 25 Oct | 930 / 4,952 | no | 18/19 | 43% | 11/12 |
| 26 Oct | 1,830 / 4,952 | yes | 17/19 | 71% | 10/10 |
| 27 Oct | 2,730 / 4,952 | yes | 18/19 | 62% | 10/11 |
| 28 Oct | 3,630 / 4,952 | yes | 19/19 | 67% | 12/12 |
| 29 Oct | 4,590 / 4,952 | yes | 19/19 | 75% | 11/12 |

P@5 varies run to run with the LLM judge and with which passages survive re-ranking (range 43-75% across five runs); report it as a range, not one number. The 27 Oct grounded miss: an answer about continuing vs dropping off quoted counts ("25 stopped, 20 continued") that the judge could not match to the retrieved passages.

## Latest run
