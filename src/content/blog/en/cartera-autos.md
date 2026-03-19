---
title: "Auto Insurance Claims Platform: GLM Pricing, IBNR Reserves, and Fraud Detection in One Dashboard"
description: "R Shiny dashboard with 140,000 synthetic policies calibrated to the Mexican market. Two-part GLM pricing engine, IBNR reserves via Chain Ladder and Bornhuetter-Ferguson, Monte Carlo stress testing with VaR/TVaR, and Mahalanobis-based fraud detection. 17 modules, bslib architecture, deployed on Cloud Run."
date: "2026-03-19"
category: "proyectos-y-analisis"
lang: "en"
tags: ["R", "Shiny", "GLM", "IBNR", "Monte Carlo", "bslib", "CONDUSEF", "AMIS", "fraud", "auto"]
---

In Mexico, roughly 70% of vehicles circulate without insurance. For the insurers covering the remaining 30%, the central question is always the same: how much to charge, how much to reserve, and where the risk lies. This project builds a complete actuarial platform to answer those three questions using synthetic data calibrated to real Mexican market parameters.

## The data: 140,000 policies over five years

The dataset covers the 2020-2024 period with 140,385 policies, 11,762 claims, and 24,900 development payments distributed across five development years (0-4). The generation starts with 12,000 new policies per year with an 82% renewal rate, producing the organic growth a real portfolio would show.

Calibration parameters come from public sources: 8.5% base frequency (CONDUSEF), \$24,000 MXN average severity (AMIS), 75% target loss ratio (AMIS sector average). The claims distribution follows the typical Mexican auto pattern: collision 65%, damage 20%, partial theft 10%, total theft 4%, fire 1%. The development pattern uses the short tail characteristic of auto: 60% paid in the accident year, 85% at first development, 95% at second, 99% at third, 100% at fourth.

The portfolio covers 13 Mexican states, 18 models from 10 brands (Nissan, Volkswagen, Chevrolet, Toyota, Ford, Honda, Hyundai, Mazda, Kia, Seat), and three vehicle types. The achieved KPIs are consistent with the market: 71.1% loss ratio (target 75%), 8.38% frequency (target 8.5%), \$29,396 severity (target \$24,000; the deviation reflects 4% annual inflation compounded over five years).

## GLM pricing engine

The pricing uses a two-part model that is the industry standard for auto insurance. The first part models frequency with a Poisson GLM (log link) where the response is the claim count per policy with exposure as an offset. The second part models severity with a Gamma GLM (log link) on individual claim amounts.

Predictors include driver age (four brackets: under 25, 25-35, 35-50, 50+), gender, vehicle type, geographic risk zone (high, medium, low), sales channel, and credit score segment. The risk factors capture known patterns in the Mexican market: drivers under 25 at 1.35x surcharge, SUVs at 1.15x, high-risk zones like CDMX and Estado de Mexico at 1.30x.

The module includes an interactive quoter that calculates the pure premium in real time based on the insured's profile, relativity tables by factor, waterfall premium decomposition, and model diagnostics (residuals, Q-Q plots, observed vs. predicted by factor).

## IBNR reserves

Reserves are estimated using two methodologies: Chain Ladder and Bornhuetter-Ferguson. The Chain Ladder implementation calculates volume-weighted link ratios, cumulative development factors (CDFs) to ultimate, and Mack standard error. The IBNR is the difference between the projected ultimate and the amount paid to date.

Bornhuetter-Ferguson blends the Chain Ladder projection with an a priori loss ratio expectation (75% default, adjustable between 60% and 90%). The method is more stable for immature accident years, where Chain Ladder link ratios can be volatile due to low data volume.

The interface shows the development triangle (incremental and cumulative), the link ratios table, CDFs, and an IBNR comparison by accident year between both methods. This connects directly to SIMA, where reserves are for life insurance: Chain Ladder and Bornhuetter-Ferguson are identical in mechanics, but the development tail is radically different. In auto, four development years suffice; in life, payments can extend decades.

## Monte Carlo stress testing

The scenario module implements a collective risk model where aggregate frequency follows a Poisson and individual severity follows a Gamma. The simulation generates 1,000 to 50,000 realizations of aggregate loss, applying stress multipliers to both frequency (0.5x to 2.0x) and severity (0.5x to 2.0x).

The computed risk measures include VaR at 95%, 99%, and 99.5%, TVaR at the same levels, mean, and standard deviation. The visual output compares the baseline loss density against the stressed scenario, with an exceedance curve and impact table. TVaR is particularly relevant for Mexican regulation, where the CNSF uses it as the risk measure for solvency capital requirement (RCS) calculations.

## Fraud detection

The fraud module combines two approaches. The first is anomaly detection via Mahalanobis distance, stratified by claim type, over three variables: claim amount, days to report, and deductible. The distance is converted to a percentile for global comparison, using a regularized covariance matrix to handle singular matrices.

The second is a heuristic flag system with five rules: multiple claims on the same policy within 60 days, claim within 30 days of policy inception, amount exceeding 3x the type median, report delay over 10 days, and amount exceeding 90% of the sum insured. The composite score weights 40% Mahalanobis and 60% flags, with a 0.7 threshold for flagging.

## Engineering decisions

The application has 17 R modules organized in three layers: 13 interface modules (one per tab), 4 utility modules (metrics, theme, data, export). The architecture uses bslib with Bootstrap 5 for responsiveness. Charts use Plotly for interactivity, tables use DT for filtering and sorting.

The separation between calculation and presentation is strict: actuarial functions live in utility modules with no Shiny dependency, enabling isolated testing. Deployment is Docker on Google Cloud Run with CI/CD via GitHub Actions and Workload Identity Federation authentication, the same pattern used in the pension simulator and SIMA.

## What I learned

The variable that most affects pricing in the Mexican auto market is the geographic zone, above driver age or vehicle type. CDMX and Estado de Mexico concentrate the highest frequency and severity, which aligns with AMIS theft data.

The practical difference between Chain Ladder and Bornhuetter-Ferguson appears in immature years: Chain Ladder amplifies the volatility of early link ratios, while BF smooths it with the a priori expectation. For an auto portfolio with short development, the difference is smaller than in long-tail lines like liability.

An important limitation: the data is synthetic. The correlation patterns between variables (e.g., geographic zone and vehicle type) are defined in the generation, not discovered in real data. With AMIS or CONDUSEF data, the GLMs would capture interactions that do not exist here. The next step would be calibrating with CONDUSEF public data or building a data-sharing agreement with an insurer.

The application is deployed on <a href="https://cartera-autos-451451662791.us-central1.run.app" target="_blank" rel="noopener">Google Cloud Run</a> and the source code is on <a href="https://github.com/GonorAndres/CarteraSeguroAutos" target="_blank" rel="noopener">GitHub</a>.
