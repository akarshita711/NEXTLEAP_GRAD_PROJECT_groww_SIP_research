# Golden set: hand labels vs the AI engine

20 items drawn at random (seed 42) across Play Store, Reddit and YouTube; labelled by hand with no sight of any AI output; then compared with the AI's labels.

## 1. Is the item about a mutual-fund SIP? (relevance)
| Prompt | Agrees with human | Precision | Recall | Wrongly kept | Wrongly dropped |
|---|---|---|---|---|---|
| v1 (first 4,860 items) | 16/20 (80%) | 93% | 81% | 1 | 3 |
| v2 (stricter; later items and the web app) | 16/20 (80%) | 100% | 75% | 0 | 4 |

## 2. Do the labels match? (16 items the human marked relevant; an item the AI wrongly dropped counts as a miss)
| Field | v1 exact | v2 exact | v1 coarse | v2 coarse |
|---|---|---|---|---|
| sip_event | 7/16 (44%) | 7/16 (44%) | 12/16 (75%) | 11/16 (69%) |
| trigger | 3/16 (19%) | 5/16 (31%) | 6/16 (38%) | 7/16 (44%) |
| unmet_need | 5/16 (31%) | 2/16 (12%) | 7/16 (44%) | 5/16 (31%) |
| investor_stage | 9/16 (56%) | 6/16 (38%) | 12/16 (75%) | 10/16 (62%) |
| emotion | 7/16 (44%) | 4/16 (25%) | 13/16 (81%) | 11/16 (69%) |

Coarse = the groupings the deck actually reports: drop-off signal vs not; reason branch (SIP broke / money or life / understanding / pulled elsewhere / unstated); opportunity area (O1 to O4); first year vs later; doubt feeling vs calm.

## 3. Item by item (human | v1 | v2). 'drop' = item judged not relevant
| ID | rel (H/v1/v2) | sip_event | trigger | unmet_need | stage | emotion |
|---|---|---|---|---|---|---|
| G01 | Y/Y/N | continuing \| continuing \| drop | better alternative \| none \| drop | none \| none \| drop | established 12m plus \| established 12m plus \| drop | confident \| neutral \| drop |
| G02 | Y/Y/Y | switched platform \| continuing \| continuing | expectation mismatch \| confusion about numbers \| confusion about numbers | trusted human help \| plain language explanation \| plain language explanation | unclear \| established 12m plus \| established 12m plus | anxious \| anxious \| confused |
| G03 | Y/Y/N | continuing \| started \| drop | none \| cash flow pressure \| drop | trusted human help \| none \| drop | unclear \| established 12m plus \| drop | neutral \| neutral \| drop |
| G04 | Y/N/Y | started \| drop \| none | confusion about numbers \| drop \| none | trusted human help \| drop \| plain language explanation | considering \| drop \| considering | confused \| drop \| neutral |
| G05 | N/N/N | - \| drop \| drop | - \| drop \| drop | - \| drop \| drop | - \| drop \| drop | - \| drop \| drop |
| G06 | N/N/N | - \| drop \| drop | - \| drop \| drop | - \| drop \| drop | - \| drop \| drop | - \| drop \| drop |
| G07 | Y/Y/Y | continuing \| reduced \| reduced | none \| cash flow pressure \| cash flow pressure | none \| flexible pause or reduce \| flexible pause or reduce | established 12m plus \| established 12m plus \| established 12m plus | confident \| content \| content |
| G08 | Y/Y/Y | stopped \| considering stopping \| considering stopping | unclear \| none \| none | flexible pause or reduce \| plain language explanation \| plain language explanation | unclear \| unclear \| considering | confused \| confused \| confused |
| G09 | Y/Y/Y | continuing \| continuing \| continuing | confusion about numbers \| confusion about numbers \| confusion about numbers | trusted human help \| plain language explanation \| simple returns view | unclear \| established 12m plus \| established 12m plus | anxious \| confused \| confused |
| G10 | Y/Y/Y | started \| started \| started | advice from others \| none \| none | trusted human help \| trusted human help \| reassurance whats normal | started 0 3m \| started 0 3m \| started 0 3m | confident \| neutral \| neutral |
| G11 | Y/Y/N | none \| none \| drop | advice from others \| none \| drop | trusted human help \| trusted human help \| drop | considering \| considering \| drop | confused \| confused \| drop |
| G12 | Y/Y/Y | switched platform \| continuing \| continuing | app issue \| none \| app issue | expectation setting \| simple returns view \| simple returns view | unclear \| unclear \| established 12m plus | disappointed \| frustrated \| frustrated |
| G13 | Y/Y/Y | continuing \| continuing \| continuing | confusion about numbers \| expectation mismatch \| confusion about numbers | reassurance whats normal \| expectation setting \| simple returns view | unclear \| early 3 12m \| established 12m plus | anxious \| confused \| frustrated |
| G14 | Y/N/N | continuing \| drop \| drop | none \| drop \| drop | none \| drop \| drop | unclear \| drop \| drop | content \| drop \| drop |
| G15 | Y/Y/Y | started \| continuing \| started | better alternative \| none \| none | plain language explanation \| none \| reassurance whats normal | unclear \| unclear \| started 0 3m | anxious \| anxious \| anxious |
| G16 | Y/Y/Y | none \| none \| none | advice from others \| advice from others \| expectation mismatch | trusted human help \| trusted human help \| trusted human help | considering \| considering \| considering | confused \| confused \| confused |
| G17 | N/N/N | - \| drop \| drop | - \| drop \| drop | - \| drop \| drop | - \| drop \| drop | - \| drop \| drop |
| G18 | N/Y/N | - \| none \| drop | - \| none \| drop | - \| none \| drop | - \| established 12m plus \| drop | - \| confident \| drop |
| G19 | Y/Y/Y | started \| started \| started | none \| none \| none | none \| none \| reassurance whats normal | started 0 3m \| started 0 3m \| started 0 3m | neutral \| neutral \| neutral |
| G20 | Y/N/Y | none \| drop \| none | none \| drop \| none | none \| drop \| none | unclear \| drop \| unclear | confident \| drop \| neutral |