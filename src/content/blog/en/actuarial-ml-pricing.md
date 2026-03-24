---
title: "Insurance Pricing with ML: What Mexico Can Learn from Europe's Actuarial Data Science Revolution"
description: "Frequency-severity pricing models on freMTPL2: Poisson GLM vs XGBoost vs LightGBM with SHAP explainability, fairness audits, and a cross-border analysis of what European ML pricing techniques mean for Mexico's 70% uninsured auto market."
date: "2026-03-14"
lastModified: "2026-03-19"
category: "proyectos-y-analisis"
lang: "en"
tags: ["pricing", "GLM", "XGBoost", "LightGBM", "SHAP", "freMTPL2", "actuarial", "frequency-severity", "Optuna", "MLflow", "fairness"]
---

Mexico is the only OECD country without mandatory federal auto liability insurance. Roughly 30% of vehicles carry any coverage at all. The remaining 70% represents 35 million uninsured cars on the road; a market failure that cuts two ways. Accident victims have no recourse. Insurers price conservatively to compensate for the adverse selection they face. And the methods used by most Mexican carriers remain traditional: manual rating tables with a handful of variables, actuarial judgment weighted over algorithmic precision, limited use of predictive modeling techniques that have already reshaped European and North American insurance.

This project asks a specific question: what can Mexico's auto insurance market learn from Europe's actuarial data science revolution? Not in theory, but demonstrated on the same dataset that the global actuarial community uses as its benchmark.

## Why freMTPL2 matters

The dataset is called freMTPL2. It contains 677,991 real motor third-party liability policies from a French insurer: claim counts, exposure, vehicle characteristics, driver demographics, and geographic density. It is the dataset that Noll, Salzmann, and Wuthrich used in their foundational 2020 paper to prove that gradient boosting machines outperform GLMs on claim frequency prediction. It is the dataset that scikit-learn uses in its official Tweedie regression tutorial. It is the dataset that the Casualty Actuarial Society, the German Actuarial Association, and Imperial College London's Insurance Pricing Game all reference as the standard.

Building on freMTPL2 is a deliberate choice, not a shortcut. When you benchmark against data that the published literature uses, your results become directly comparable. A Gini coefficient of 0.28 on freMTPL2 is something specific and verifiable. On a proprietary dataset, it means only what you claim.

## The actuarial decomposition

Insurance pricing reduces to two interlinked prediction problems: how often claims happen (frequency) and how much they cost when they do (severity). The pure premium—which determines the technical price—equals the product of expected frequency and expected severity. This frequency-severity decomposition is the actuarial standard, codified in regulatory frameworks from Solvency II in Europe to Mexico's LISF. It is not a modeling trick; it is mandatory structure.

For frequency, Poisson regression with a log link and exposure as an offset is the standard. For severity, the Gamma distribution with a log link captures the right-skewed, strictly positive cost distribution once a claim occurs. These GLMs form the regulatory baseline across every auto insurer globally, chosen for three reasons: transparency, auditability, and decades of actuarial theory behind them.

GLMs work; the question is whether they leave predictive accuracy on the table. Do they fail to capture non-linear interactions between features? And if they do, is the improvement from machine learning models large enough to justify the added complexity?

## What the models show

The answer, consistent with the published benchmarks, is yes. On this dataset:

The **Poisson GLM** achieves a Gini coefficient around 0.23 with a D-squared of approximately 0.043. BonusMalus dominates the coefficient table (the no-claims discount is the strongest signal), while young drivers and urban areas show the expected positive relativities. The interpretability here is built-in: each coefficient maps directly to a multiplicative factor on baseline frequency.

**XGBoost** with Poisson objective, tuned via Optuna over 100 Bayesian optimization trials, reaches a Gini around 0.27 with substantially lower deviance. **LightGBM** edges to approximately 0.28. This is not marginal improvement. It represents materially better risk discrimination, particularly at the distribution's tails where the safest and riskiest policyholders sit.

The double-lift analysis exposes where the GLM fails. Bin policyholders by GLM prediction, then compare the GBM's assessment of those same bins. The divergence is striking: the GLM overprices safe suburban drivers and underprices risky urban profiles. This is systematic cross-subsidization, and it is not a statistical curiosity. It is money. An insurer pricing more accurately attracts better risks and repels the worst, building a competitive advantage that compounds over time.

## The explainability problem

A black-box model that outperforms a GLM has no value if regulators cannot inspect it and actuaries cannot sign off on it. This is not hypothetical. The EU AI Act (effective 2024) classifies insurance pricing as high-risk. Colorado's AI Act takes effect in February 2026. Mexico has not yet issued AI-specific insurance regulation, but the CNSF requires technical notes for all tariff filings, and a general AI law is expected in 2026.

SHAP (SHapley Additive exPlanations) is the answer. TreeSHAP decomposes the fitted GBM's prediction for each policyholder into additive feature contributions. The global SHAP summary confirms what actuaries already know: BonusMalus dominates, followed by driver age and vehicle age. The SHAP dependence plots show the U-shaped effect of driver age (young and elderly drivers are riskier) and the non-linear acceleration of BonusMalus above 100. These are real effects, not statistical artifacts, and they explain why the GBM's risk discrimination is superior.

Kuo and Lupton (2023, Variance journal) formalized this result: SHAP combined with partial dependence plots provides the interpretability layer regulators need to approve ML-based pricing models. It is not speculative; it is the emerging standard.

## The fairness question

The Area variable in freMTPL2 encodes population density from A (rural) to F (dense urban). Density is actuarially sound: urban areas face more traffic, more accidents, higher repair costs. Density also correlates with socioeconomic status. France monitors this under GDPR and the EU Gender Directive. Mexico's income inequality between Mexico City and rural Oaxaca is an order of magnitude larger, which makes the same question much sharper.

The fairness audit compares predicted frequencies across Area segments for each model. If the GBM exploits density as a proxy for something regulators consider discriminatory, the divergence surfaces: the model's area-level predictions diverge from the actuarially justified actual loss experience. The analysis does not resolve the ethical question, but it makes it empirically answerable, which is the prerequisite for any regulatory discussion.

## Connections to the rest of the portfolio

This project occupies a specific position in the insurance technical pipeline. The [P&C reserves dashboard](/en/blog/insurance-claims-dashboard) answered the backward-looking question: what happens after claims occur (development patterns, IBNR, loss ratios by line of business). This one answers the forward-looking counterpart: given a policyholder's characteristics, what premium should they pay before any claim happens?

The connection is direct. Predicted frequency from the pricing model feeds into the reserve model's expected loss inputs. If the pricing model systematically underestimates frequency for a segment (as the GLM does for certain urban profiles in the double-lift analysis), the reserve model will eventually show adverse development. The two projects are consecutive stages of a single actuarial cycle.

[SIMA](https://sima-451451662791.us-central1.run.app/) implements the regulatory calculation layer for Mexico: LISF/CUSF-compliant reserves, Lee-Carter mortality projection, and CNSF-mandated capital adequacy. The technical premiums from this project's pricing models feed into SIMA's reserve modules downstream. Different products (auto vs. life), same regulatory logic: the CNSF requires technical notes that demonstrate actuarial adequacy, and ML pricing with SHAP explainability delivers exactly that.

The [GMM Explorer](https://gmm-explorer.vercel.app/contexto) addresses the severity distribution: given a claim portfolio, what mixture of distributions best describes the cost? This is the severity side of the frequency-severity decomposition that this project handles on the frequency side.

## What this means for Mexico

The gap is not theoretical. Only 15–20% of Mexican insurers use any form of AI or ML in pricing. Qualitas (33% auto market share) still uses traditional methods. Crabi is the only tech-native auto insurer licensed in Mexico in 25 years. Mexico has 68 insurtechs, the second-largest ecosystem in Latin America, yet pricing methodology disruption has barely begun.

The regulatory environment is paradoxically more permissive than Europe's. The CNSF requires technical notes for tariff filings but not prior rate approval. No AI-specific regulation exists comparable to the EU AI Act. A Mexican insurer could adopt ML pricing with SHAP explainability today: file the technical note demonstrating actuarial adequacy and deploy it, sidestepping the multi-year approval process European carriers face.

The business case is direct: risk-adequate ML premiums mean lower prices for good drivers and more accurate prices for bad ones. In a market where 70% of vehicles are uninsured, cheaper insurance for the population majority is not just competitive advantage; it expands the market itself. Mexico's 96.5% mobile penetration adds another layer: the infrastructure for smartphone-based telematics (UBI), the natural next step once traditional features have proven ML pricing works.

## Limitations and what comes next

This project uses European data to demonstrate techniques relevant to Mexico. The limitation is clear: French driving patterns, vehicle fleets, and geographic risk profiles differ from Mexico's. A Nissan March in Guadalajara faces different risks than a Renault Clio in Lyon. The methodology transfers; the parameters do not.

What Mexico lacks is a centralized, anonymized claims database equivalent to freMTPL2. France has one. The UK has one. Mexico does not. AMIS (the Mexican insurers' association) could build this, with transformative results: a Mexican freMTPL2 that enables all insurers, not just the largest, to build data-driven pricing models.

On the modeling side, CatBoost and Explainable Boosting Machines (EBMs) would extend the comparison. A Tweedie GLM modeling pure premium directly (skipping the frequency-severity split) is the natural baseline extension. Bootstrap confidence intervals on Gini and deviance would convert point estimates into ranges that reflect honest uncertainty.

## Academic foundation

The four papers that ground this project:

Noll, Salzmann, and Wuthrich (2020) established the freMTPL2 benchmark and showed GBM superiority for claim frequency. Colella and Jones (2023, CAS E-Forum) confirmed no single model dominates universally, validating the comparative approach. MDPI Risks (2024) showed a hybrid GLM+ANN model outperforms all individual models, pointing toward ensemble strategies as the likely future of actuarial pricing. Kuo and Lupton (2023, Variance) formalized the explainability framework that makes ML pricing regulatorily viable.

The PDFs are available in the project repository under `docs/references/`.

## Study materials

- <a href="https://github.com/GonorAndres/data-science-path/tree/main/projects/insurance-pricing" target="_blank" rel="noopener">GitHub repository</a>: Complete ML pipeline (Poisson/Gamma GLMs, XGBoost, LightGBM with Optuna tuning and MLflow tracking), SHAP analysis, fairness audit, FastAPI backend, and Next.js interactive dashboard with 4 tabs.
