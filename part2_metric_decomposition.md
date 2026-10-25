# Part 2: Breaking down "12-month SIP continuation for first-time investors"

*Draft v2, built from the discovery engine (8,832 items analysed; 4,040 relevant; 546 drop-off signals). Numbers are directional, not statistically solid. Interviews will confirm or kill each branch.*

## 1. The metric, defined precisely

- **Cohort:** users whose *first-ever* mutual fund SIP was set up in month M0.
- **Success at month 12:** at least one successful instalment in the last 30 days (any SIP on the platform).
- **Choice to make explicit:** if a user stops SIP-A and starts SIP-B, they count as *retained*. We track "SIP-level survival" separately so we do not miss users who churn between funds.

## 2. The equation

```
12-month continuation  =  A  x  S

A = Activation   : SIP set up AND first instalment actually debits
S = Survival     : still receiving successful instalments through months 1-12
                 = product over months of (1 - monthly exit rate)
monthly exit rate = involuntary exits + voluntary exits + silent exits - recoveries
```

Everything we can do to the metric moves A, shrinks one of the three exit routes, or raises recoveries (people who lapse and come back).

## 3. The tree

```
12-month SIP continuation (first-time investors)
|
+-- A. ACTIVATION: setup completes and first instalment succeeds
|      * mandate/autopay registered, KYC clean, first debit works
|
+-- S. SURVIVAL through months 1-12
|    |
|    +-- S1. INVOLUNTARY EXITS: user wanted to continue, SIP broke
|    |      * instalment fails (balance, bank limit, mandate expiry, KYC error)
|    |      * user never notices, or cannot fix it, so SIP lapses
|    |      Product outcomes: failure rate; detection time; % recovered in 7 days
|    |
|    +-- S2. VOLUNTARY EXITS: user decides to pause / reduce / stop
|    |      S2a. Money and life (cash tight, bonus gone, life event)
|    |            -> only "stop" or "continue" on offer; no middle path
|    |      S2b. Understanding and expectation (returns look small/negative,
|    |            numbers confusing, "is this normal?")
|    |            -> decides without knowing what is typical at month N
|    |      S2c. Pulled elsewhere (friend/creator suggests another option)
|    |
|    +-- S3. SILENT EXITS: no decision, just drift (stops opening the app,
|    |       lets a failure stand, never checks again)
|    |       Product outcomes: days since last app open; reactions to statements
|    |
|    +-- R.  RECOVERY: lapsed or paused users who restart within 90 days
|
+-- Timing lens (where in the first year each branch bites)
       M0-1  setup and first instalment  -> A, S1
       M2-6  "first statements look small" window -> S2b, S2a, S3
       M7-12 habit vs. drift             -> S3, S2c, R
```

## 4. What the engine says about each branch

Drop-off signals = pause, reduce, stop, considering stopping, or failed instalment. Grouped from the extracted "trigger" field. Updated after analysing 8,832 items (4,040 relevant; 546 drop-off signals; 861 first-year relevant items, 79 of them drop-offs).

| Branch | All drop-offs (n=546) | Share where a reason was stated (n=402) | First-year only (n=79) | Representative evidence |
|---|---|---|---|---|
| S1 Involuntary (payment/mandate/app failure) | 14% | 20% | 14% | "my sip is not processed since over a month now"; "auto payment fails ... no retry done by the app" |
| S2a Money/life | 20% | 28% | 15% | "i can not do sip because i don't have fixed income every month" |
| S2b Understanding/expectation | **30%** | **40%** | **39%** | "SIPs in loss, confused if I should continue or stop" |
| S2c Pulled elsewhere | 9% | 12% | 5% | better alternative / advice from others |
| S3 Silent drift | 0% | 0% | 0% | not observable in public text (see below) |
| Reason not stated | 26% | n/a | 27% | |

**Source matters.** The branch mix depends on where people write. Play Store drop-off signals are mostly S1 (31 of 50): app and payment reliability. Reddit posts are mostly S2b and S2a (114 and 68 of 277): "is this normal?" and cash-flow questions. YouTube comments mostly do not state a reason. The headline mix therefore partly reflects our sample: 497 Play Store items against 3,549 Reddit posts. Only 497 of 40,000 reviews were SIP-relevant.

Among all **first-year relevant items** (n=861) the biggest group of unmet needs is "is this normal?": reassurance 20%, expectation-setting 17%, plain-language explanation 12%, trusted help 5% (together with simple returns view and goal progress, 55% fall under opportunity O3). Pause/reduce is 3% and failed-payment alerts 1% of all first-year items, but among first-year drop-offs they rise to 14% and 10%.

## 5. What the engine cannot see (and why interviews matter)

1. **Silent drift is invisible by construction.** People who quietly lapse do not write reviews or posts. The 0% in S3 is a data gap, not evidence that it is small.
2. **The first-year voice is thin.** Only 67 of the 546 drop-off signals come from people 0-12 months in (months 3-12: 37); most come from experienced investors.
3. **Segment data is mostly missing.** Income stability was stated in only a few dozen drop-off signals; age and source of money almost never. Segment cuts must come from the screener and interviews.
4. **We have not seen Groww's internal data.** A real team would validate with: failure rate by month, pause/stop reason selections, and days-since-last-open before lapse.

## 6. Candidate opportunity areas (scored as hypotheses)

Scale 1-5. Evidence = strength of signals so far. Reach = share of first-year investors it could touch. Metric link = how directly it moves 12-month continuation. Fit = respects "no fund recommendations, no fear/FOMO/urgency". AI value = whether AI does something static content or rules cannot.

| # | Opportunity | Evidence | Reach | Metric link | Fit | AI value | Notes |
|---|---|---|---|---|---|---|---|
| O1 | Detect and fix failed or missed instalments quickly (S1) | 4 (strong in Play Store, 31 of 50 signals) | 3 | **5** | 5 | 2 | Mostly deterministic notifications and recovery flows. Strong, but AI adds little. Need to check what Groww already notifies. |
| O2 | A middle path: pause, reduce, or skip instead of stopping (S2a) | 3 | 3 | 4 | 5 | 3 | Product/flow change. AI can help the user choose a sensible reduced amount. Need to check what Groww already offers. |
| O3 | Explain, in plain language, "what am I looking at and is this normal at month N?" (S2b) | **4** | **5** | 3 | 5 | **5** | Applies to every investor in months 2-6. Personalised, Hinglish-capable, must never advise. Natural fit for an eval-gated AI feature. |
| O4 | Re-engage drifting investors without pressure (S3, R) | 1 (invisible) | ? | 4 | 3 | 3 | Highest uncertainty, risk of sliding into nudges. Needs interviews to size. |

**Current leaning (to be tested, not decided):** O3 for the first-year, months 2-6 window, with O2 as its natural companion. O1 stays as a baseline fix to recommend regardless. If interviews show silent drift is dominated by something else (for example, a bank-side issue the user never saw), the choice changes.

## 7. Questions interviews must answer to choose between branches

- Did the person ever see an instalment fail, and how did they find out?
- Which moment first made them doubt (first statement, a market dip, a cash crunch, something they heard)?
- When they felt unsure, who or what did they turn to, and did it help or push them further away?
- Did they know pausing or reducing was possible? Would they have used it?
- For those who stopped or paused: what, exactly, would have made continuing the easier option?

## 8. To verify on the live app (I cannot access it)

- Does Groww currently notify users when an instalment fails, and how?
- Does it offer pause/skip/reduce for SIPs, and where in the app?
- What does the SIP screen show at month 1-6 (absolute returns, XIRR, graph)?
