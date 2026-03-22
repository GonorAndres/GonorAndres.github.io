---
title: "Mexican Actuarial Suite: the full insurance operating cycle in one Python library"
description: "Mid-sized Mexican insurers price in one spreadsheet, reserve in another, and fill the RCS by hand. This library unifies that cycle: EMSSA-09 mortality tables, life products, three reinsurance strategies, reserves with explicit uncertainty, and regulatory compliance under LISF and CUSF, backed by 307 tests and Decimal precision throughout."
date: "2026-03-19"
lastModified: "2026-03-22"
category: "proyectos-y-analisis"
lang: "en"
tags: ["Python", "Pydantic", "LISF", "CUSF", "CNSF", "RCS", "Reservas", "Chain Ladder", "Reaseguro", "Streamlit", "EMSSA-09", "SAT"]
---

In the technical department of a typical Mexican insurer, the quarterly operating cycle is fragmented across spreadsheets that do not talk to each other. One actuary prices products with an EMSSA-09 table pasted into Excel, another calculates reserves using a separate development triangle, a third fills in the RCS regulatory form by hand, and at the end someone tries to reconcile everything for the report filed with the CNSF. Every quarter, the same manual reconciliation exercise.

The **Mexican Actuarial Suite** unifies those workflows into a single Python library. It covers everything from the EMSSA-09 mortality table to the quarterly CNSF report, including life product pricing, three reinsurance strategies, advanced reserving methods, and SAT tax validations.

<img src="/screenshots/actuarial-suite.png" alt="Mexican Actuarial Suite dashboard showing life product calculators, regulatory compliance, and technical reserves" style="max-width: 100%; border: 1px solid #d4d4d4; border-radius: 4px; margin: 1rem 0;" />

## The problem: why an actuarial suite in Python

The Mexican insurance market operates under the LISF and the CUSF, a regulatory framework that imposes requirements that do not exist in any other jurisdiction: country-specific mortality tables (EMSSA-09), quarterly report formats with a structure defined by the CNSF, a Solvency Capital Requirement (RCS) calibrated to the Mexican market, and tax deductibility rules that depend on Mexico's income tax law (LISR).

Open-source actuarial software in Python does exist: `chainladder` for reserving, `lifelines` for survival analysis. But none of it integrates Mexican regulatory requirements. There is no library that knows what an EMSSA-09 table is, that computes the RCS as defined by the LISF, or that validates premium deductibility under Article 151 of the LISR. For mid-sized and small insurers, that gap means spreadsheets with formulas no one audits, and errors discovered at the regulatory exam.

Two design decisions define the suite. The first is Pydantic v2 as a domain guard: every piece of data entering the system is validated before it touches a formula. An insured with a negative age or a technical rate of 200% simply cannot enter. The second is `Decimal` instead of `float` throughout the entire calculation chain. Across portfolios of thousands of policies, rounding differences compound; arithmetic precision is not an academic luxury.

## Life products

All three products inherit from an abstract base class that fixes the calculation sequence through Template Method: validate insurability, compute net premium, apply loadings, build result. Each concrete product implements its own actuarial formula.

The **EMSSA-09** (Experiencia Mexicana de Seguridad Social 2009) is the regulatory mortality table for life insurance in Mexico. The suite loads it from a CSV and wraps it in a model that supports interpolation for intermediate ages and validates that every `qx` falls between 0 and 1. Pricing follows the equivalence principle: the actuarial present value of future benefits equals the actuarial present value of future premiums. The technical interest rate is 5.5%, the maximum the CNSF allows for traditional life products.

**Term insurance** is pure risk: no payout if the insured survives the policy period. **Whole life** is guaranteed: the payout will happen, it is only a matter of when. **Endowment** combines protection with savings: it pays the sum assured on death or on survival at maturity. A 35-year-old male with a MXN \$1,000,000 sum assured on a 20-year term policy pays roughly \$5,900 per year using the EMSSA-09 at 5.5%.

<a href="/blog/sima/" style="color: #C17654; text-decoration: underline;">SIMA</a> builds its own mortality model from raw INEGI data via Lee-Carter. This suite uses the regulatory EMSSA-09 directly. They are complementary approaches: one constructs the demographics from the source, the other applies the table the regulator requires in the technical note.

## Reinsurance

Reinsurance is insurance for insurers. The suite implements three strategies with domain validation throughout.

**Quota Share** cedes a fixed percentage of every policy: premiums and claims alike. Simple and predictable, with the drawback that you cede the same proportion of profitable risks and unprofitable ones.

**Excess of Loss** protects against individual large claims. The reinsurer only steps in when a single claim exceeds the cedant's retention. A "500 xs 200" contract means the cedant retains the first \$200,000 and the reinsurer pays up to an additional \$500,000. The implementation includes reinstatements: reinstating the limit after it has been used in exchange for an additional premium. A `model_validator` verifies that the limit is greater than the retention; in editable spreadsheet cells, that condition gets violated more often than anyone would like to admit.

**Stop Loss** protects the entire portfolio. It activates when total loss experience exceeds a threshold (attachment point). If claims on a \$10M premium portfolio reach 90% and the contract is "80% xs 20%", the reinsurer pays \$1M of the excess.

## Reserves: Chain Ladder, Bornhuetter-Ferguson, Bootstrap

IBNR estimation is one of the central problems in casualty actuarial practice. The suite implements Chain Ladder and Bornhuetter-Ferguson, but the distinguishing piece is the Bootstrap module.

Chain Ladder produces a point estimate. Bornhuetter-Ferguson complements it by weighting against an a priori loss ratio expectation, which makes it more stable for recent origin years with little development. But neither answers the most important question: how wrong could this estimate be?

Bootstrap answers with a full distribution. It computes Pearson residuals on the original triangle, resamples them to generate 1,000 synthetic triangles, runs Chain Ladder on each, and extracts percentiles from the resulting distribution. If P50 = \$2.5M and P75 = \$3.1M, there is a 25% probability that the required reserve is at least \$600,000 higher than the median. That difference is directly relevant to how much capital to hold. The <a href="/blog/insurance-claims-dashboard/" style="color: #C17654; text-decoration: underline;">Insurance Claims Dashboard</a> explores this mechanic in more detail from a portfolio analysis perspective.

## Regulatory compliance

This is what sets the suite apart from any other open-source actuarial package. To the best of my knowledge, no public library implements the Mexican RCS calculation, the rules of Circular S-11.4, or the SAT's tax validations for insurance premiums.

The **RCS** computes three risk modules: life underwriting (mortality, longevity, disability, expenses), non-life underwriting (premium risk and reserve risk), and investment (market, credit, concentration). Aggregation uses a correlation matrix that avoids summing risks linearly. The life-to-non-life correlation is 0.00 because mortality and auto claims are statistically independent. The life-to-investment and non-life-to-investment correlation is 0.25 because a financial crisis affects the ability to meet both types of obligations through the investment portfolio. With life RCS \$28M, non-life \$30M, and investment \$35M, a straight sum would give \$93M; the correlation-based aggregation gives \$75M. Those \$18M in difference are capital the insurer can invest rather than hold idle.

**Circular S-11.4** defines how technical reserves must be calculated. The module implements the mathematical reserve using the prospective method and the unearned premium reserve for short-term products, both with a sufficiency validator.

**SAT tax validations** determine what portion of each premium is deductible for income tax purposes, given the insurance type and the policyholder's tax regime. The `ValidadorPrimasDeducibles` takes the current annual UMA, computes limits in pesos, and returns the deductible amount with the exact legal basis: Article 151 of the LISR for individuals, Article 25 for legal entities.

The <a href="/blog/regulation-agent-rag/" style="color: #C17654; text-decoration: underline;">regulation agent</a> navigates the LISF and CUSF to locate the relevant provisions. This suite implements the math those provisions define. They are complementary tools: one finds the article, the other runs the calculation.

## Engineering decisions

The suite has 34 production modules across 7 subpackages and 307 tests at 87% coverage. Dependency flow is unidirectional: `core` imports from nobody; `products`, `reinsurance`, `reservas`, and `regulatorio` import from `core`; `reportes` imports from `regulatorio`. No cycles, so any module can be tested in isolation.

Every Pydantic model includes `json_schema_extra` with concrete examples that double as executable documentation. Validation error messages are written for the actuary, not the developer: "Total loadings (115%) exceed 100%" communicates the problem immediately.

The Streamlit dashboard has three pages built with Plotly: a life product calculator with sensitivity analysis, a regulatory compliance monitor with RCS calculators and SAT validations, and a technical reserves view with development triangles and method comparison.

## What I learned

The hardest part was not Chain Ladder or the life insurance formulas, which are standard in any jurisdiction. It was Mexican regulatory specificity: the EMSSA-09 as the pricing base table, Circular S-11.4 for technical reserves, the deductibility rules of Article 151 of the LISR, the CNSF report formats with their date and quarter validations. Those modules required the most research hours, with the fewest implementation references available anywhere.

The second lesson involves the RCS correlation matrix. The aggregation formula is straightforward vector algebra. The hard part is not implementing it but understanding why the CNSF chose those specific correlations. The numbers encode the regulator's view of how risks interact in the Mexican market. Implementing a formula without understanding the logic behind the parameters is typing, not actuarial engineering.

A real limitation worth naming: the dashboard is demonstrative, not production-ready. An insurer wanting to adopt it would need to integrate their own data, validate tables and parameters against their CNSF-approved technical notes, and run an actuarial audit on the outputs. The suite solves the fragmentation problem; it does not solve the legacy integration problem.

<div style="margin-top: 2rem; padding: 1rem 1.5rem; border-left: 4px solid #C17654; background-color: #f9f6f2;">
  <p style="margin: 0 0 0.5rem 0;"><strong>Repository:</strong> <a href="https://github.com/GonorAndres/Analisis_Seguros_Mexico" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">github.com/GonorAndres/Analisis_Seguros_Mexico</a></p>
  <p style="margin: 0;"><strong>Live app:</strong> <a href="https://suite-actuarial-d3qj5vwxtq-uc.a.run.app" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">suite-actuarial on Cloud Run</a></p>
</div>
