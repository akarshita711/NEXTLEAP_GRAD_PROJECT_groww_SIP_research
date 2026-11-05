# Golden-set evaluation
Items: 20 (relevant per human: 16). Model for v2 re-run: gemini-3.1-flash-lite.

| Prompt | Relevance accuracy | Precision | Recall | sip_event agreement | trigger agreement | unmet_need agreement | investor_stage agreement | emotion agreement |
|---|---|---|---|---|---|---|---|---|
| v1 prompt (used for first 4,860 items) | 80% | 93% | 81% | 44% | 19% | 31% | 56% | 44% |
| v2 prompt (scope fix; used by the web app) | 80% | 100% | 75% | 44% | 31% | 12% | 38% | 25% |

## Failures: v1 prompt (used for first 4,860 items)
| ID | Failure | Text (start) | Human | Engine |
|---|---|---|---|---|
| G01 | trigger mismatch | [Thread: The New Year is coming and I want to share a strong investment tip I practiced in 2025 and learnt fro | human=better_alternative | engine=none |
| G01 | emotion mismatch | [Thread: The New Year is coming and I want to share a strong investment tip I practiced in 2025 and learnt fro | human=confident | engine=neutral |
| G02 | sip_event mismatch | Why Zerodha uses different payment source for different mutual funds?. I have 5 MFs in my portfolio. I’ve obse | human=switched_platform | engine=continuing |
| G02 | trigger mismatch | Why Zerodha uses different payment source for different mutual funds?. I have 5 MFs in my portfolio. I’ve obse | human=expectation_mismatch | engine=confusion_about_numbers |
| G02 | unmet_need mismatch | Why Zerodha uses different payment source for different mutual funds?. I have 5 MFs in my portfolio. I’ve obse | human=trusted_human_help | engine=plain_language_explanation |
| G02 | investor_stage mismatch | Why Zerodha uses different payment source for different mutual funds?. I have 5 MFs in my portfolio. I’ve obse | human=unclear | engine=established_12m_plus |
| G03 | sip_event mismatch | [Thread: Is 10 mutual fund in a portfolio a lot? Total expense ratio is around 0.52. please review and any fee | human=continuing | engine=started |
| G03 | trigger mismatch | [Thread: Is 10 mutual fund in a portfolio a lot? Total expense ratio is around 0.52. please review and any fee | human=none | engine=cash_flow_pressure |
| G03 | unmet_need mismatch | [Thread: Is 10 mutual fund in a portfolio a lot? Total expense ratio is around 0.52. please review and any fee | human=trusted_human_help | engine=none |
| G03 | investor_stage mismatch | [Thread: Is 10 mutual fund in a portfolio a lot? Total expense ratio is around 0.52. please review and any fee | human=unclear | engine=established_12m_plus |
| G04 | missed relevant item | [Thread: Daily VS Weekly VS Monthly S.I.P] How does brokerage and taxes differ for daily vs monthly SIPs ? |  |  |
| G07 | sip_event mismatch | If you want to save money, this is the right place. Through this platform, you can invest your money very well | human=continuing | engine=reduced |
| G07 | trigger mismatch | If you want to save money, this is the right place. Through this platform, you can invest your money very well | human=none | engine=cash_flow_pressure |
| G07 | unmet_need mismatch | If you want to save money, this is the right place. Through this platform, you can invest your money very well | human=none | engine=flexible_pause_or_reduce |
| G07 | emotion mismatch | If you want to save money, this is the right place. Through this platform, you can invest your money very well | human=confident | engine=content |
| G08 | sip_event mismatch | SIP cancel karne k baad autopay automatically band ho jate hai kya? | human=stopped | engine=considering_stopping |
| G08 | trigger mismatch | SIP cancel karne k baad autopay automatically band ho jate hai kya? | human=unclear | engine=none |
| G08 | unmet_need mismatch | SIP cancel karne k baad autopay automatically band ho jate hai kya? | human=flexible_pause_or_reduce | engine=plain_language_explanation |
| G09 | unmet_need mismatch | Why is there a massive discrepancy in returns between Direct and Regular Mutual Fund (Quant Small Cap), while  | human=trusted_human_help | engine=plain_language_explanation |
| G09 | investor_stage mismatch | Why is there a massive discrepancy in returns between Direct and Regular Mutual Fund (Quant Small Cap), while  | human=unclear | engine=established_12m_plus |
| G09 | emotion mismatch | Why is there a massive discrepancy in returns between Direct and Regular Mutual Fund (Quant Small Cap), while  | human=anxious | engine=confused |
| G10 | trigger mismatch | Review my mutual fund mix – What to keep, trim, or switch?. Hey folks, I’m 23, have a long-term horizon (\~15  | human=advice_from_others | engine=none |
| G10 | emotion mismatch | Review my mutual fund mix – What to keep, trim, or switch?. Hey folks, I’m 23, have a long-term horizon (\~15  | human=confident | engine=neutral |
| G11 | trigger mismatch | I’m 18 and saved ₹1 lakh from freelancing, what should I do with it?. Hey, I’m a first year law student. I’ve  | human=advice_from_others | engine=none |
| G12 | sip_event mismatch | User interface is excellent, but App takes more Time in Showing Daily Gain/Loss of Mutual Funds. I have to kee | human=switched_platform | engine=continuing |
| G12 | trigger mismatch | User interface is excellent, but App takes more Time in Showing Daily Gain/Loss of Mutual Funds. I have to kee | human=app_issue | engine=none |
| G12 | unmet_need mismatch | User interface is excellent, but App takes more Time in Showing Daily Gain/Loss of Mutual Funds. I have to kee | human=expectation_setting | engine=simple_returns_view |
| G12 | emotion mismatch | User interface is excellent, but App takes more Time in Showing Daily Gain/Loss of Mutual Funds. I have to kee | human=disappointed | engine=frustrated |
| G13 | trigger mismatch | Your Returns Calculator for Mid150 Index fund is showing wrong calculation. While it is showing +40% in ETF in | human=confusion_about_numbers | engine=expectation_mismatch |
| G13 | unmet_need mismatch | Your Returns Calculator for Mid150 Index fund is showing wrong calculation. While it is showing +40% in ETF in | human=reassurance_whats_normal | engine=expectation_setting |
| G13 | investor_stage mismatch | Your Returns Calculator for Mid150 Index fund is showing wrong calculation. While it is showing +40% in ETF in | human=unclear | engine=early_3_12m |
| G13 | emotion mismatch | Your Returns Calculator for Mid150 Index fund is showing wrong calculation. While it is showing +40% in ETF in | human=anxious | engine=confused |
| G14 | missed relevant item | The Groww app is an exceptional choice for Gen Z, millennials, and first-time retail investors looking to buil |  |  |
| G15 | sip_event mismatch | Sir ky hum upstox app par SIP kar rahe hai to agar uska id ya password bhul gaye to koi dikkat to nahi hoga | human=started | engine=continuing |
| G15 | trigger mismatch | Sir ky hum upstox app par SIP kar rahe hai to agar uska id ya password bhul gaye to koi dikkat to nahi hoga | human=better_alternative | engine=none |
| G15 | unmet_need mismatch | Sir ky hum upstox app par SIP kar rahe hai to agar uska id ya password bhul gaye to koi dikkat to nahi hoga | human=plain_language_explanation | engine=none |
| G18 | false positive (marked relevant) | [Thread: Father sold apartment, now don't know where to invest the amount.] Fk everything find a piece of land |  |  |
| G20 | missed relevant item | Whoever told you to stop SIP block that person or double the Sip amount |  |  |

## Failures: v2 prompt (scope fix; used by the web app)
| ID | Failure | Text (start) | Human | Engine |
|---|---|---|---|---|
| G01 | missed relevant item | [Thread: The New Year is coming and I want to share a strong investment tip I practiced in 2025 and learnt fro |  |  |
| G02 | sip_event mismatch | Why Zerodha uses different payment source for different mutual funds?. I have 5 MFs in my portfolio. I’ve obse | human=switched_platform | engine=continuing |
| G02 | trigger mismatch | Why Zerodha uses different payment source for different mutual funds?. I have 5 MFs in my portfolio. I’ve obse | human=expectation_mismatch | engine=confusion_about_numbers |
| G02 | unmet_need mismatch | Why Zerodha uses different payment source for different mutual funds?. I have 5 MFs in my portfolio. I’ve obse | human=trusted_human_help | engine=plain_language_explanation |
| G02 | investor_stage mismatch | Why Zerodha uses different payment source for different mutual funds?. I have 5 MFs in my portfolio. I’ve obse | human=unclear | engine=established_12m_plus |
| G02 | emotion mismatch | Why Zerodha uses different payment source for different mutual funds?. I have 5 MFs in my portfolio. I’ve obse | human=anxious | engine=confused |
| G03 | missed relevant item | [Thread: Is 10 mutual fund in a portfolio a lot? Total expense ratio is around 0.52. please review and any fee |  |  |
| G04 | sip_event mismatch | [Thread: Daily VS Weekly VS Monthly S.I.P] How does brokerage and taxes differ for daily vs monthly SIPs ? | human=started | engine=none |
| G04 | trigger mismatch | [Thread: Daily VS Weekly VS Monthly S.I.P] How does brokerage and taxes differ for daily vs monthly SIPs ? | human=confusion_about_numbers | engine=none |
| G04 | unmet_need mismatch | [Thread: Daily VS Weekly VS Monthly S.I.P] How does brokerage and taxes differ for daily vs monthly SIPs ? | human=trusted_human_help | engine=plain_language_explanation |
| G04 | emotion mismatch | [Thread: Daily VS Weekly VS Monthly S.I.P] How does brokerage and taxes differ for daily vs monthly SIPs ? | human=confused | engine=neutral |
| G07 | sip_event mismatch | If you want to save money, this is the right place. Through this platform, you can invest your money very well | human=continuing | engine=reduced |
| G07 | trigger mismatch | If you want to save money, this is the right place. Through this platform, you can invest your money very well | human=none | engine=cash_flow_pressure |
| G07 | unmet_need mismatch | If you want to save money, this is the right place. Through this platform, you can invest your money very well | human=none | engine=flexible_pause_or_reduce |
| G07 | emotion mismatch | If you want to save money, this is the right place. Through this platform, you can invest your money very well | human=confident | engine=content |
| G08 | sip_event mismatch | SIP cancel karne k baad autopay automatically band ho jate hai kya? | human=stopped | engine=considering_stopping |
| G08 | trigger mismatch | SIP cancel karne k baad autopay automatically band ho jate hai kya? | human=unclear | engine=none |
| G08 | unmet_need mismatch | SIP cancel karne k baad autopay automatically band ho jate hai kya? | human=flexible_pause_or_reduce | engine=plain_language_explanation |
| G08 | investor_stage mismatch | SIP cancel karne k baad autopay automatically band ho jate hai kya? | human=unclear | engine=considering |
| G09 | unmet_need mismatch | Why is there a massive discrepancy in returns between Direct and Regular Mutual Fund (Quant Small Cap), while  | human=trusted_human_help | engine=simple_returns_view |
| G09 | investor_stage mismatch | Why is there a massive discrepancy in returns between Direct and Regular Mutual Fund (Quant Small Cap), while  | human=unclear | engine=established_12m_plus |
| G09 | emotion mismatch | Why is there a massive discrepancy in returns between Direct and Regular Mutual Fund (Quant Small Cap), while  | human=anxious | engine=confused |
| G10 | trigger mismatch | Review my mutual fund mix – What to keep, trim, or switch?. Hey folks, I’m 23, have a long-term horizon (\~15  | human=advice_from_others | engine=none |
| G10 | unmet_need mismatch | Review my mutual fund mix – What to keep, trim, or switch?. Hey folks, I’m 23, have a long-term horizon (\~15  | human=trusted_human_help | engine=reassurance_whats_normal |
| G10 | emotion mismatch | Review my mutual fund mix – What to keep, trim, or switch?. Hey folks, I’m 23, have a long-term horizon (\~15  | human=confident | engine=neutral |
| G11 | missed relevant item | I’m 18 and saved ₹1 lakh from freelancing, what should I do with it?. Hey, I’m a first year law student. I’ve  |  |  |
| G12 | sip_event mismatch | User interface is excellent, but App takes more Time in Showing Daily Gain/Loss of Mutual Funds. I have to kee | human=switched_platform | engine=continuing |
| G12 | unmet_need mismatch | User interface is excellent, but App takes more Time in Showing Daily Gain/Loss of Mutual Funds. I have to kee | human=expectation_setting | engine=simple_returns_view |
| G12 | investor_stage mismatch | User interface is excellent, but App takes more Time in Showing Daily Gain/Loss of Mutual Funds. I have to kee | human=unclear | engine=established_12m_plus |
| G12 | emotion mismatch | User interface is excellent, but App takes more Time in Showing Daily Gain/Loss of Mutual Funds. I have to kee | human=disappointed | engine=frustrated |
| G13 | unmet_need mismatch | Your Returns Calculator for Mid150 Index fund is showing wrong calculation. While it is showing +40% in ETF in | human=reassurance_whats_normal | engine=simple_returns_view |
| G13 | investor_stage mismatch | Your Returns Calculator for Mid150 Index fund is showing wrong calculation. While it is showing +40% in ETF in | human=unclear | engine=established_12m_plus |
| G13 | emotion mismatch | Your Returns Calculator for Mid150 Index fund is showing wrong calculation. While it is showing +40% in ETF in | human=anxious | engine=frustrated |
| G14 | missed relevant item | The Groww app is an exceptional choice for Gen Z, millennials, and first-time retail investors looking to buil |  |  |
| G15 | trigger mismatch | Sir ky hum upstox app par SIP kar rahe hai to agar uska id ya password bhul gaye to koi dikkat to nahi hoga | human=better_alternative | engine=none |
| G15 | unmet_need mismatch | Sir ky hum upstox app par SIP kar rahe hai to agar uska id ya password bhul gaye to koi dikkat to nahi hoga | human=plain_language_explanation | engine=reassurance_whats_normal |
| G15 | investor_stage mismatch | Sir ky hum upstox app par SIP kar rahe hai to agar uska id ya password bhul gaye to koi dikkat to nahi hoga | human=unclear | engine=started_0_3m |
| G16 | trigger mismatch | [Thread: Advice on Mutual Fund Portfolio and Education Loan Repayment] I’ve been reading all over Reddit and t | human=advice_from_others | engine=expectation_mismatch |
| G19 | unmet_need mismatch | Sr maine insta se video dekhker 100 rs Ki sip start krdi | human=none | engine=reassurance_whats_normal |
| G20 | emotion mismatch | Whoever told you to stop SIP block that person or double the Sip amount | human=confident | engine=neutral |