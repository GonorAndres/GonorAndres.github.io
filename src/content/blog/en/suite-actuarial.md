---
title: "Mexican Actuarial Suite: four insurance lines in one Python library"
description: "The operating cycle of a Mexican insurer is fragmented across spreadsheets that don't talk to each other. This library unifies pricing, reserves, reinsurance, and regulatory compliance for life, property, health, and pensions under a single framework with Pydantic domain validation and Decimal precision. The result is a modular base that enables building more complex actuarial systems without rewriting core logic from scratch."
date: "2026-03-19"
lastModified: "2026-03-22"
category: "proyectos-y-analisis"
lang: "en"
shape: "case-study"
ficha:
  rol: "Autor único"
  año: "2026"
  stack: "Python · Pydantic · FastAPI · Streamlit"
  datos: "EMSSA-09 · AMIS · parámetros CNSF"
  regulacion: "LISF · CUSF · CNSF (RCS) · SAT (ISR) · Circular S-11.4"
  estado: "Finalizado"
  repositorio: "https://github.com/GonorAndres/Analisis_Seguros_Mexico"
  live: "https://suite-actuarial-d3qj5vwxtq-uc.a.run.app"
tags: ["Python", "Pydantic", "LISF", "CUSF", "CNSF", "RCS", "Reservas", "Chain Ladder", "Reaseguro", "Streamlit", "EMSSA-09", "SAT", "FastAPI", "GMM", "IMSS"]
---

In the technical department of a typical Mexican insurer, the quarterly operating cycle is fragmented across spreadsheets that don't talk to each other. One actuary prices products with an EMSSA-09 table pasted into Excel, another calculates reserves using a separate development triangle, a third fills in the RCS regulatory form by hand, and at the end someone tries to reconcile everything for the report filed with the CNSF. Every quarter, the same manual reconciliation exercise.

The **Mexican Actuarial Suite** unifies those workflows into a single Python library. It covers four lines of the Mexican insurance market (life, property, health, and pensions), with cross-cutting modules for reinsurance, reserves, and regulatory compliance. Every piece of data entering the system is validated by Pydantic v2 before touching a formula, and the entire calculation chain uses `Decimal` instead of `float` so that rounding differences don't compound across portfolios of thousands of policies.

<img src="/screenshots/actuarial-suite.png" alt="Mexican Actuarial Suite interactive examples showing life product calculators, regulatory compliance, and technical reserves" style="max-width: 100%; border: 1px solid #d4d4d4; border-radius: 4px; margin: 1rem 0;" />

## The problem

The Mexican insurance market operates under the LISF and the CUSF, a regulatory framework that imposes requirements found in no other jurisdiction: country-specific mortality tables (EMSSA-09), quarterly report formats with a structure defined by the CNSF, a Solvency Capital Requirement (RCS) calibrated to the Mexican market, and tax deductibility rules that depend on Mexico's income tax law (LISR). Open-source actuarial software exists in Python (`chainladder`, `lifelines`), but none of it integrates Mexican regulatory requirements. There is no library that knows what an EMSSA-09 table is or that computes the RCS as defined by the LISF.

## The four domains

### Life

Three products (term, whole life, and endowment) built on the EMSSA-09 table with equivalence principle pricing at a 5.5% technical rate. Each product inherits from a base class that fixes the calculation sequence: validate insurability, compute net premium, apply loadings, build result. A 35-year-old male with a MXN \$1,000,000 sum assured on a 20-year term policy pays roughly \$5,900 per year.

### Property and casualty

Auto insurance pricing calibrated with AMIS data: base frequency, average severity, target loss ratio. The module includes frequency-severity models and a Bonus-Malus system that adjusts the premium based on the driver's claims history.

### Health

Major Medical Expenses (GMM) with age-band pricing, accident and illness coverage, and adjustments for deductible and coinsurance. The module reflects the structure of GMM products as marketed in the Mexican insurance sector.

### Pensions

Pension calculations under IMSS Ley 73 and Ley 97, life annuities, and commutation functions. This module shares actuarial logic with the <a href="/blog/pension-simulator/" style="color: #C17654; text-decoration: underline;">pension simulator</a>, but integrated as part of a library that can connect with the other domains.

## Cross-cutting modules

**Reinsurance.** Three strategies with domain validation: Quota Share (proportional cession), Excess of Loss (large-claim protection with reinstatements), and Stop Loss (aggregate portfolio protection). A `model_validator` checks that the limit exceeds retention; in editable spreadsheet cells, that condition gets violated more often than anyone would like to admit.

**Reserves.** Chain Ladder, Bornhuetter-Ferguson, and Bootstrap. What sets this implementation apart is that Bootstrap returns a full distribution of possible reserves, not just a point estimate. If P50 = \$2.5M and P75 = \$3.1M, there is a 25% probability that the required reserve is at least \$600,000 higher than the median. That difference is directly relevant to how much capital to hold.

**Regulatory compliance.** The RCS computes three risk modules (life, non-life, investment) and aggregates them with a correlation matrix that avoids linear summation. SAT validations determine what portion of each premium is tax-deductible. Circular S-11.4 defines technical reserves. No other public library implements these calculations for the Mexican market.

## The API

Beyond the interactive Streamlit examples, the suite exposes all its functionality as a REST API via FastAPI. This allows integrating actuarial calculations into other systems without depending on the visual interface: a quoting system can call the pricing endpoint, a batch process can compute reserves for an entire portfolio, or a data pipeline can run regulatory validations as part of an automated workflow.

## What it makes possible

The most important consequence of having this suite is not the suite itself, but what it enables you to build on top of it. <a href="/blog/sima/" style="color: #C17654; text-decoration: underline;">SIMA</a>, for instance, builds its mortality pipeline from raw INEGI data via Lee-Carter, implementing its own commutation and pricing logic. With the suite as a module, that same pipeline could be rewritten with cleaner, shorter code, reusing the commutation functions, life products, and RCS calculation that are already validated and tested. Instead of reimplementing, you import.

The same applies to any new actuarial project: the suite eliminates the need to rewrite core logic every time. A health pricing project can import the GMM module and focus on analysis, not infrastructure. A solvency model can use the RCS module directly. The <a href="/blog/regulation-agent-rag/" style="color: #C17654; text-decoration: underline;">regulation agent</a> navigates the LISF and CUSF to find the relevant provisions; this suite implements the math those provisions define.

The library has hundreds of unit tests covering all four domains, with Decimal precision on every calculation and Pydantic validation on every input. The dependency flow is unidirectional with no cycles, allowing any module to be tested in isolation.

<div style="margin-top: 2rem; padding: 1rem 1.5rem; border-left: 4px solid #C17654; background-color: #f9f6f2;">
  <p style="margin: 0 0 0.5rem 0;"><strong>Repository:</strong> <a href="https://github.com/GonorAndres/Analisis_Seguros_Mexico" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">github.com/GonorAndres/Analisis_Seguros_Mexico</a></p>
  <p style="margin: 0;"><strong>Live app:</strong> <a href="https://suite-actuarial-d3qj5vwxtq-uc.a.run.app" target="_blank" rel="noopener" style="color: #C17654; text-decoration: underline;">suite-actuarial on Cloud Run</a></p>
</div>
