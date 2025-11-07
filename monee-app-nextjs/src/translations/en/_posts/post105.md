---
title: "How to Choose Time‑of‑Use vs. Standard Electricity Pricing with a Weighted Usage‑Shift Matrix"
excerpt: "Use a weighted usage‑shift matrix to decide between time‑of‑use and standard electricity pricing. Clarify values, map your utility’s peak windows, estimate shiftable loads, and stress‑test the choice before committing."
keywords: "time-of-use, TOU, standard rates, dynamic pricing, peak hours, off-peak, usage-shift matrix, EV charging, heat pump water heater, fixed charge, utility rates, decision matrix, energy budgeting"
---
Deciding between time‑of‑use (TOU) and a standard (flat) electricity rate isn’t about finding a perfect answer—it’s about fit. TOU can reward you for running flexible loads away from evening peaks (often around 4–9 p.m.), while a flat rate keeps pricing simple. Your best choice depends on your household’s ability and willingness to shift usage, the local price spread between on‑ and off‑peak, and any fixed monthly charges or rate‑specific rules.

As your scenario planner, I’ll guide you through a simple, weighted usage‑shift matrix. We’ll translate your values and habits into numbers you can compare, stress‑test, and act on confidently.

Values warm‑up (pick what matters most)
- When do I most need flexibility—early evening, late night, or midday?
- What am I okay shifting to timers or automation (EV charging, water heating, laundry)?
- Which matters more this year: predictable bills or trying to reduce costs by experimenting?

What TOU vs. standard really means
- TOU rates price electricity higher during peak hours and lower off‑peak; they sometimes add a super off‑peak period that’s even cheaper. In California, regulators describe TOU as most beneficial for customers who can shift usage, like EV owners, and emphasize afternoon/evening peaks with seasonal differences [CPUC Electric Rates explainer](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates).
- Many utilities publish clear peak windows. Examples include: SDG&E’s daily 4–9 p.m. peak with distinct off/super off‑peak periods and a base‑service charge context [SDG&E TOU pricing](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters); PG&E’s common 4–9 p.m. or 5–8 p.m. peaks and options that pair lower per‑kWh with a monthly base charge for electrified homes [PG&E TOU plans](https://www.pge.com/en_US/small-medium-business/your-account/rates-and-rate-options/time-of-use-rates.page); APS’s published on‑peak hours and winter super off‑peak, including a “TOU with demand” option [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans).
- Regional changes happen. For instance, Xcel Energy highlights peaks like 3–7 p.m. and moves Colorado to 5–9 p.m. year‑round; pilot results show most customers’ bills decreased slightly or stayed the same with basic behavior changes [Xcel newsroom](https://newsroom.xcelenergy.com/news/xcel-energy-s-new-time-of-use-rates-give-customers-a-new-opportunity-to-save-MCEETSXIRD5ND7DEDLQ3HOBIFZ6E).
- New fixed‑charge decisions can shift the math. California’s approved fixed monthly charge lowers per‑kWh rates but adds a set cost; electrified or higher‑use homes may still benefit overall [AP News on fixed charge](https://apnews.com/article/034a3e1713a744c4151b05e4c4eacaf1).
- Utilities increasingly test dynamic hourly or critical peak add‑ons; CPUC guidance points to optional dynamic rates that align with grid conditions and can layer on top of TOU in coming years [CPUC dynamic hourly guidance](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates).

How to build your weighted usage‑shift matrix
1) Collect your intervals and rates
- Pull the last 12 months of hourly usage from your utility portal. If unavailable, use NREL’s end‑use profiles to approximate patterns by region and appliance [NREL EULP](https://www.nrel.gov/buildings/end-use-load-profiles.html).
- List major end‑uses: EV charging, heat pump water heater (HPWH), laundry, dishwasher, pool pump, HVAC, lighting, and always‑on. EIA data confirm HVAC and water heating are large drivers in many homes—weight them appropriately [EIA RECS](https://www.eia.gov/emeu/recs/).
- Map your utility’s TOU periods and the cents/kWh spread between on‑ and off‑peak (and super off‑peak, if offered). Use your utility’s pages (SDG&E, PG&E, APS, Seattle City Light) or the OpenEI Utility Rate Database to locate your exact tariff and windows [SDG&E TOU pricing](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters) [PG&E TOU plans](https://www.pge.com/en_US/small-medium-business/your-account/rates-and-rate-options/time-of-use-rates.page) [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans) [Seattle City Light TOU](https://www.seattle.gov/city-light/residential-services/billing-information/time-of-use) [OpenEI URDB](https://openei.org/USURDB/rate/view/67c229523a832dfd74041ea8).

2) Score shiftability and estimate realistic shifted kWh/month
- Assign each end‑use a shiftability score (0–5). Typical patterns: EV, HPWH, laundry, dishwasher, and pool pumps are high; HVAC is moderate with precooling/thermal mass; lighting/always‑on are low. This is consistent with utility and DOE guidance to move flexible loads off‑peak and enable EV smart charging [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs).
- Apply a “compliance factor” (often 50–80%) to account for real‑life follow‑through; automation (EV chargers, thermostats, timers) can raise compliance. This approach mirrors practical planning guidance and utility tool usage; SCE’s comparison tool can validate modeled savings from your matrix [SCE rate comparison](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool).

3) Compute potential monthly savings
- Savings = shifted kWh × (on‑peak minus off‑peak spread) − any added fixed or base charges on the TOU plan.
- Include seasonal weighting if your utility varies periods by season (e.g., APS, SRP) [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans) [SRP TOU](https://www.srpnet.com/price-plans/residential-electric/time-of-use).
- If you’re evaluating “TOU with demand,” add a risk cost for coincident appliance stacking during the demand window; if you want simplicity, consider standard TOU first [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans).
- Where available, bill‑protection or trial periods can reduce risk. SRP notes a 90‑day bill‑protection credit if TOU costs more and reports average ~4.8% annual bill savings among TOU customers—a conservative benchmark rather than a guarantee [SRP TOU](https://www.srpnet.com/price-plans/residential-electric/time-of-use).

Blank weighted decision matrix (fill this in)
- Weights (1–5) reflect importance; Scores (1–5) reflect fit of each option. Keep scores neutral and honest; the goal is clarity, not perfection.

| Criterion (example)           | Weight (1–5) | TOU Score (1–5) | TOU Weighted | Standard Score (1–5) | Standard Weighted |
|------------------------------|--------------|------------------|--------------|----------------------|-------------------|
| Savings potential            | 5            |                  |              |                      |                   |
| Lifestyle flexibility        | 4            |                  |              |                      |                   |
| Automation readiness         | 4            |                  |              |                      |                   |
| Risk/complexity tolerance    | 3            |                  |              |                      |                   |
| Values fit (predictability)  | 3            |                  |              |                      |                   |
| Seasonal variability impact  | 2            |                  |              |                      |                   |
| Total                        | —            |                  |              |                      |                   |

- Quick guidance for entries:
  - Savings potential: Based on your shifted kWh × spread minus fixed charges [SDG&E TOU pricing](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters) [AP News fixed charge](https://apnews.com/article/034a3e1713a744c4151b05e4c4eacaf1).
  - Lifestyle flexibility: How okay you are shifting 4–9 p.m. activities (typical evening peaks) [CPUC Electric Rates](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates).
  - Automation readiness: EV smart charging, HPWH timers, programmable thermostats increase compliance and savings reliability [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs).
  - Risk/complexity tolerance: Consider demand‑charge variants and learning curve [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans).
  - Seasonal variability impact: If your utility has different summer/winter hours or super off‑peak periods (e.g., SRP midday super off‑peak) [SRP manage demand](https://www.srpnet.com/price-plans/residential-electric/manage-demand-5-10-pm-and-save).

Make the trade‑offs explicit
- What we’re okay giving up: For TOU, perhaps running the dryer after 9 p.m. and scheduling EV charging overnight; for standard, giving up some potential savings to keep evenings fully flexible.
- Where evidence points: Meta‑analysis and simulations from LBNL suggest rate design changes often shift bills modestly compared to efficiency and electrification gains—so pair any TOU choice with load reductions and smart controls [LBNL meta‑analysis](https://emp.lbl.gov/publications/different-prices-difference-slices) [LBNL bill impacts study](https://emp.lbl.gov/news/new-berkeley-lab-study-quantifies-residential-customer-bill-impacts-energy-efficiency).
- Pull past patterns: If you track utilities or related categories, look for evening spikes or seasonal surges; those patterns inform your “shiftable kWh” input. Apps focused on simple, ad‑free budgeting like Monee can help you notice recurring utility patterns without complexity.

Stress‑test the decision
- Swap two weights. Example: Switch “Lifestyle flexibility” (4) with “Savings potential” (5). Recompute weighted totals. If your winner flips, your choice is sensitive—consider more automation or a trial period if available.
- Model announced changes. If your utility is shifting peak windows (e.g., Xcel moving to 5–9 p.m.), rerun the matrix under both current and future periods [Xcel newsroom](https://newsroom.xcelenergy.com/news/xcel-energy-s-new-time-of-use-rates-give-customers-a-new-opportunity-to-save-MCEETSXIRD5ND7DEDLQ3HOBIFZ6E).
- Validate with tools. Use your utility’s rate comparison/calculator to check your result against actual interval data (e.g., SCE’s tool; Seattle City Light’s calculator/insights where available) [SCE rate comparison](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool) [Seattle City Light TOU](https://www.seattle.gov/city-light/residential-services/billing-information/time-of-use).

Decision rules you can trust
- If net monthly savings are positive by a comfortable margin and the lifestyle/automation scores are high, choose TOU.
- If the matrix tilts toward simplicity, or savings are marginal after fixed charges, stay on standard—or test TOU only with a bill‑protection window if your utility offers one (e.g., SRP’s 90‑day protection) [SRP TOU](https://www.srpnet.com/price-plans/residential-electric/time-of-use).
- Considering add‑ons: Critical peak pricing or dynamic hourly pilots can reward extra flexibility on a few days; keep an eye on new offerings per CPUC guidance [CPUC dynamic hourly guidance](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates).

Commitment language
- “I’m choosing ______ because my matrix shows the best fit for my priorities this year. I accept the trade‑offs I named, and I’ll revisit if my usage or rate structure changes.”

De‑risking plan (30‑day starter)
- Week 1: Gather 12 months of hourly data; confirm your TOU windows and on/off‑peak spreads; pull your exact tariff via your utility page or OpenEI URDB [OpenEI URDB](https://openei.org/USURDB/rate/view/67c229523a832dfd74041ea8).
- Week 2: Set EV and HPWH timers; schedule dishwasher and laundry away from 4–9 p.m.; enable thermostat setbacks/precooling where reasonable [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs).
- Week 3: Recalculate shifted kWh with a realistic compliance factor; rerun the matrix. Use a utility comparison tool (e.g., SCE) to validate modeled results [SCE rate comparison](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool).
- Week 4: Make the switch if the matrix still points to TOU; otherwise, stay standard and consider selective CPP add‑ons or revisit when new dynamic options arrive [CPUC dynamic hourly guidance](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates).

If a particular detail (like your exact cents/kWh or whether a bill‑protection program exists) isn’t on your utility’s site or in the links here, note the gap and proceed with the matrix using the best available published rates and windows, then validate with your utility’s comparison tool.

## Sources:
- [CPUC dynamic hourly guidance](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates)
- [CPUC Electric Rates explainer](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates)
- [SDG&E TOU pricing](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters)
- [PG&E TOU plans](https://www.pge.com/en_US/small-medium-business/your-account/rates-and-rate-options/time-of-use-rates.page)
- [SCE rate comparison](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool)
- [SRP TOU](https://www.srpnet.com/price-plans/residential-electric/time-of-use)
- [SRP manage demand](https://www.srpnet.com/price-plans/residential-electric/manage-demand-5-10-pm-and-save)
- [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans)
- [Xcel newsroom](https://newsroom.xcelenergy.com/news/xcel-energy-s-new-time-of-use-rates-give-customers-a-new-opportunity-to-save-MCEETSXIRD5ND7DEDLQ3HOBIFZ6E)
- [Seattle City Light TOU](https://www.seattle.gov/city-light/residential-services/billing-information/time-of-use)
- [OpenEI URDB](https://openei.org/USURDB/rate/view/67c229523a832dfd74041ea8)
- [LBNL meta‑analysis](https://emp.lbl.gov/publications/different-prices-difference-slices)
- [LBNL bill impacts study](https://emp.lbl.gov/news/new-berkeley-lab-study-quantifies-residential-customer-bill-impacts-energy-efficiency)
- [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs)
- [NREL EULP](https://www.nrel.gov/buildings/end-use-load-profiles.html)
- [EIA RECS](https://www.eia.gov/emeu/recs/)
- [AP News fixed charge](https://apnews.com/article/034a3e1713a744c4151b05e4c4eacaf1)
