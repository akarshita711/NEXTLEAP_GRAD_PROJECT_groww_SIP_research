# Golden set: how the AI engine compares with hand labels

## How the golden set was made
- 20 items drawn at random (seed 42) from the analysed conversations: 7 Reddit posts, 6 Reddit comments, 4 Play Store reviews, 3 YouTube comments.
- Labelled by hand, with no sight of any AI output, on six fields: relevant (Y/N), sip_event, trigger, unmet_need, investor_stage, emotion. Rules were in the sheet's Guide tab.
- The AI side: the engine (Gemini) read each text on its own and filled the same fields from fixed lists, told to use "unclear" or "none" rather than guess. Two prompt versions were scored: v1 (labelled the first 4,860 items) and v2 (stricter scope; used for later items and the web app).
- Scoring: exact match per field over the 16 items the human marked relevant. If the AI wrongly dropped an item as not relevant, it counts as a miss on every field. "Coarse" match uses the groupings reported in the deck.

## Results (human = truth)
**Relevance (is it about a mutual-fund SIP?)**
| | Agrees | Precision | Recall | Wrongly kept | Wrongly dropped |
|---|---|---|---|---|---|
| v1 | 16/20 (80%) | 93% | 81% | 1 | 3 |
| v2 | 16/20 (80%) | 100% | 75% | 0 | 4 |

**Labels (16 relevant items)**
| Field | v1 exact | v2 exact | v1 coarse | v2 coarse |
|---|---|---|---|---|
| sip_event | 44% | 44% | 75% (drop-off vs not) | 69% |
| trigger | 19% | 31% | 38% (reason branch) | 44% |
| unmet_need | 31% | 12% | 44% (opportunity area) | 31% |
| investor_stage | 56% | 38% | 75% (first year vs later) | 62% |
| emotion | 44% | 25% | 81% (doubt vs calm) | 69% |

Full item-by-item comparison: golden_set_comparison.xlsx (green = match, orange = mismatch).

## Where the AI failed
1. **It guesses the investor stage.** The human marked stage "unclear" for 9 of 16 items; v1 said unclear on only 3 of them and guessed "established 12m plus" for three (G02, G03, G09) and "3 to 12 months" for one (G13); v2 guessed more (G08, G12, G13, G15). This breaks the instruction not to guess, and the first-year counts in the deck depend on this field.
2. **It misses advice-seeking.** The human labelled 7 of 16 items `trusted_human_help` (people asking for a review, a suggestion or an advisor) and 3 as trigger `advice_from_others`. v1 chose `trusted_human_help` on 3, and often `plain_language_explanation` or `none` instead. The share of this need in the dataset (about 6%) is probably an undercount.
3. **It over-reads weak cues.** G07 is a praise post that mentions withdrawing "out of compulsion"; the AI labelled it as a reduced SIP caused by cash-flow pressure and a need for pause/reduce. G03 (portfolio question) was given cash-flow pressure.
4. **It under-reads confidence and anxiety.** Human "confident" (4 items) became "neutral" or "content"; human "anxious" (G09, G13) became "confused".
5. **Relevance errors in both directions.** v1 kept G18 (father sold an apartment, land investing) and dropped G04, G14, G20. v2 removes the wrong keep but drops G01, G03, G11, G14: people who are considering a SIP, asking for advice, or praising the app. The scope fix traded precision for recall.

## Where the disagreement is partly about definitions
The human sometimes read a label more broadly than the guide's wording: `switched_platform` for people who use a different app (G02, G12); `better_alternative` for "a better way" or another app (G01, G15); `advice_from_others` for people asking for advice (G10, G11, G16). Scores use the human labels exactly as given; none were changed. These cases explain part of the low trigger and sip_event agreement, but not the stage, advice-seeking and over-reading failures above.
No second human labelled the set, so human-to-human agreement is unknown and the true ceiling is below 100%.

## What was rejected or corrected (Evidence Log entries)
1. **Relevance prompt v1 to v2.** v1 called ULIP, PPF and insurance "SIP" posts relevant; on the full corpus 28% of v1-relevant items (510 of 1,804) flipped under v2. On the golden set v2 removed the wrong keep (precision 93% to 100%) but lowered recall (81% to 75%).
2. **AI-written headlines rejected.** All nine passed the automatic number check; several still misread the data (for example "1,365 of 1,874 people continued after 12 months"). Replaced by headlines built directly from the counts (ai_headline_review.md).
3. **Stage field downgraded.** Because of failure 1, first-year numbers are reported as directional; coarse groupings are used in the deck.
4. **Checking the checker.** The first groundedness judge scored answers 1 of 12 because it could not see the computed counts the writer is allowed to use; after fixing the judge (and keeping the stricter version) the answer set scored 10/10 to 12/12.

## What this means
- Fine-grained single-item labels are unreliable (12 to 56% exact agreement); coarse groupings are better (31 to 81%) but still modest.
- Headline percentages in the deck are directional signals from public text, not precise measurements.
- The MVP should not rely on fine labels. Use coarse routing (doubt vs calm, advice-seeking vs explanation-seeking) and a safe fallback for advice requests.
