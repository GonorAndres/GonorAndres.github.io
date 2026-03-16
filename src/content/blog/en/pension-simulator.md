---
title: "IMSS Pension Simulator: Ley 73, Ley 97, and Fondo Bienestar in One Tool"
description: "An R Shiny app that calculates Mexican retirement pensions under all three active IMSS regimes. Implements the Article 167 salary bracket table for Ley 73, the tiered DOF 2020 reform contribution rates for Ley 97, and the Fondo de Pensiones para el Bienestar supplement (2024). With AFORE projection under three return scenarios, sensitivity analysis, and downloadable PDF report. 126 unit tests, Docker + Cloud Run."
date: "2026-03-16"
category: "proyectos-y-analisis"
lang: "en"
tags: ["R", "Shiny", "IMSS", "AFORE", "Pensions", "Ley 73", "Ley 97", "Fondo Bienestar", "social security", "CONSAR"]
---

Since July 1997, Mexico has had two IMSS pension systems running in parallel. Workers who started contributing before that date retire under Ley 73 (Law 73), a defined-benefit formula based on salary and weeks contributed. Those who started after fall under Ley 97 (Law 97), with individual AFORE accounts whose accumulated balance determines the pension. In May 2024, the government published the Fondo de Pensiones para el Bienestar (Welfare Pension Fund) decree in the DOF (Official Gazette), a third layer that supplements the pension for Ley 97 workers earning below the average IMSS salary. The result is a system where three sets of rules coexist, each with its own formulas, eligibility requirements, and assumptions. This simulator calculates all three in one place, with rates updated to 2025.

## Two laws, three scenarios

Ley 73 uses a 23-bracket salary table (Article 167 of the LSS, Mexico's Social Security Law) that assigns each range a base percentage (cuantia basica) and an increment for each year contributed beyond 500 weeks. A worker earning 1.77 times the minimum wage with 1,500 weeks has 19 years of increments above the base, producing a total percentage of ~73%. Retiring at 65 gives the full amount; at 60, only 75% (cesantia factor). The minimum pension is one monthly minimum wage ($8,474 MXN in 2025). The mechanism is deterministic: same inputs, same result.

Ley 97 operates under a different logic. Worker and employer contribute monthly to an AFORE account (Mexico's private pension fund administrators), and the balance grows at the real return minus the administrator's fee. At retirement, the pension equals the accumulated balance divided by the months of remaining life expectancy (retiro programado, or scheduled withdrawal). The outcome depends critically on three variables nobody can predict with certainty: the AFORE's real return, the contribution density (what percentage of months the worker actually contributed), and the administrator's commission. If the projected balance yields a pension below 2.5 monthly UMAs ($8,598 MXN in 2025), the government guarantees that minimum.

The Fondo Bienestar enters as a supplement for Ley 97 workers meeting four conditions: Ley 97 regime, minimum age of 65, at least 1,000 contributed weeks, and salary below the Fund threshold (~$17,364/month in 2025, indexed to average IMSS salary). For eligible workers, the Fund covers the gap between the AFORE pension and 100% of their last salary, capped at the threshold.

## The reform that changes the math

The December 2020 DOF reform increased employer retirement contributions gradually between 2023 and 2030. The most significant change is that the CEAV (Cesantia en Edad Avanzada y Vejez) employer rates are no longer flat: they are tiered across 8 salary brackets measured in UMAs (Mexico's inflation-indexed reference unit). For the highest bracket (4.01+ UMAs, salaries above ~$13,600/month), the employer CEAV rate rises from 4.241% in 2023 to 11.875% in 2030. The worker rate (1.125%) and the employer retirement base (2%) remain unchanged.

This tiering has a direct implication for AFORE balance projections: using a flat contribution rate for the entire projection underestimates the final balance by 15% to 25%, depending on the salary bracket and years to retirement. The simulator applies the correct rate for each projection year using DOF data, with all 8 transition tables from 2023 to 2030, and the final 2030 rate for subsequent years.

The same reform changed the minimum weeks required for a Ley 97 pension: from 750 in 2021, increasing by 25 per year, up to 1,000 in 2031. For 2025, the requirement is 850 weeks. This transitional schedule is independent of the 1,000-week minimum that the Fondo Bienestar requires.

## The Fondo de Pensiones para el Bienestar

The May 1, 2024 decree created the Fund in response to a concrete problem: projected replacement rates for Ley 97 workers are low, typically between 20% and 40% of last salary for those who do not make voluntary contributions. The Fund aims to close that gap for low- and middle-income workers.

The formula is straightforward: complement = min(salary, threshold) - AFORE pension. If your AFORE pension is $5,000 and your salary was $12,000, the complement is $7,000, for a total pension of $12,000 (100% replacement). If your salary exceeded the threshold, the complement is calculated using the threshold as a cap.

Transparency about the risks is essential. The Fund is financed from the federal budget, with no dedicated tax or constituted reserve. Its fiscal viability over 20 or 30 years depends on future political decisions that nobody can guarantee. The simulator presents the Fund as a possible scenario, with explicit warnings that it is a projection under current assumptions, and that conditions may change. Treating the complement as a certainty would be irresponsible; presenting it as an educational scenario is the right approach.

## What the numbers reveal

For a Ley 73 worker earning $15,000/month with 1,500 contributed weeks, the simulator calculates a pension of $11,245/month (75% replacement) at age 65. With Modalidad 40 (5 years contributing at the maximum SBC), the pension rises to $17,694, at a cost of $6,939/month with a 14-month payback period. The mechanism is predictable: same inputs, same result, no variability from market returns.

For a Ley 97 worker with the same salary, $300,000 current AFORE balance, 800 weeks, and a base 4% real return, the projected balance at age 65 is $1,624,910. The retiro programado (scheduled withdrawal) yields $7,965/month (balance divided by 204 months of male life expectancy). That amount falls below the minimum guaranteed pension of $8,598/month (2.5 monthly UMAs), so the legal floor applies. With the Fondo Bienestar, the pension rises to $15,000/month: the $6,401 complement covers the gap between the guaranteed minimum and the full salary.

The gender effect is quantifiable. A woman earning $12,000/month with $150,000 in AFORE balance and 600 weeks projects a balance of $1,011,005 at age 65. But because female life expectancy is higher (240 months vs. 204 for men), the retiro programado drops to $4,212/month for the same type of calculation. The Fondo Bienestar supplements up to the $12,000 salary, but without it, the gender gap in pension is nearly 50% for the same balance.

The sensitivity analysis across conservative (3%), base (4%), and optimistic (5%) scenarios produces a 30-40% range in projected balance. But the variable that moves the result most for Ley 97 is the contribution reform, which nearly triples employer CEAV rates between 2023 and 2030. The cesantia factor works as expected: at age 62, the Ley 73 pension is 85% of the age-65 calculation ($10,588 vs. ~$12,456 implied at full factor).

One finding from the validation: the simulator originally did not reject weeks below 500 for Ley 73. With 300 weeks, it produced a calculation that fell to the minimum floor ($8,485), when in reality a worker with fewer than 500 weeks has no pension right under Ley 73, only a lump-sum withdrawal. This is exactly what a CI/CD pipeline with 126 tests is for: the bug was identified, fixed, and deployed in the same cycle. The validation is now live in production.

## Engineering decisions

The architecture separates calculation from presentation. The formulas live in `R/calculations.R` (777 lines) for Ley 73/97 and `R/fondo_bienestar.R` (505 lines) for the supplement, with no Shiny dependency whatsoever. The modules can be executed and tested from the terminal with `testthat`, which enabled maintaining 126 unit tests that verify the Article 167 table, cesantia factors, AFORE projection with variable rates, Fund complement calculation, and edge cases (insufficient weeks, salary above cap, zero return).

Regulatory constants (UMA 2025: $113.14 daily, minimum wage: $278.80, Fund threshold: $17,364) are centralized in `R/constants.R`, outside any Shiny context, so a fiscal year change requires updating a single file. The DOF 2020 reform rates are read from a CSV with all 8 brackets and columns for 2023-2030, not hardcoded.

The interface is a 4-step wizard built with `bslib` (Bootstrap 5 for R Shiny) and navigation controlled by `shinyjs`. Balance trajectory charts use Plotly for interactivity. Users can download a PDF report generated with `rmarkdown` that includes all assumptions and calculation results. Deployment is Docker on Google Cloud Run with CI/CD via GitHub Actions and Workload Identity Federation.

## What I learned

The variable that moves the result most for a Ley 97 worker is the 2020 reform contribution schedule, above the return rate or the AFORE commission. The reason is that CEAV rates practically triple between 2023 and 2030 for high salary brackets, and that increase compounds over the remaining working life.

The Fondo Bienestar threshold extrapolation is a modeling decision, not a calculation. The 2025 threshold ($17,364) is the published average IMSS salary; for future years, the simulator assumes 3.5% annual growth, calibrated to the observed trend. Any other growth rate produces significantly different results. The simulator documents this as an assumption, because that is what it is.

One detail that connects to other portfolio projects: the Ley 97 retiro programado pension divides the balance by remaining life expectancy. That life expectancy comes from simplified CONAPO tables (17 years for men at 65, 20 for women). In a more rigorous actuarial context, those tables would be projected with mortality models to capture the secular improvement in longevity, which would modify the resulting pensions.

The application is deployed on <a href="https://simulador-pension-d3qj5vwxtq-uc.a.run.app/" target="_blank" rel="noopener">Google Cloud Run</a> and the source code is on <a href="https://github.com/GonorAndres/seguridad-social/tree/main/fondo_bienestar" target="_blank" rel="noopener">GitHub</a>.
