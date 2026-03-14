---
title: "Insurance Pricing with ML: What Mexico Can Learn from Europe's Actuarial Data Science Revolution"
description: "Frequency-severity pricing models on freMTPL2: Poisson GLM vs XGBoost vs LightGBM with SHAP explainability, fairness audits, and a cross-border analysis of what European ML pricing techniques mean for Mexico's 70% uninsured auto market."
date: "2026-03-14"
category: "proyectos-y-analisis"
lang: "en"
tags: ["pricing", "GLM", "XGBoost", "LightGBM", "SHAP", "freMTPL2", "actuarial", "frequency-severity", "Optuna", "MLflow", "fairness"]
---

Mexico is the only OECD country without mandatory federal auto liability insurance. Roughly 30% of vehicles carry any coverage at all. The remaining 70% is not a data point; it is 35 million uninsured cars on the road, a market failure with direct consequences for accident victims who have no recourse and for insurers who price conservatively to compensate for adverse selection. The pricing methods used by most Mexican carriers are still traditional: manual rating tables with a handful of variables, actuarial judgment over algorithmic precision, and limited use of the predictive modeling techniques that have reshaped European and North American insurance over the past decade.

This project asks a specific question: what can Mexico's auto insurance market learn from Europe's actuarial data science revolution? Not in theory, but demonstrated on the same dataset that the global actuarial community uses as its benchmark.

## Why freMTPL2 matters

The dataset is called freMTPL2. It contains 677,991 real motor third-party liability policies from a French insurer: claim counts, exposure, vehicle characteristics, driver demographics, and geographic density. It is the dataset that Noll, Salzmann, and Wuthrich used in their foundational 2020 paper to prove that gradient boosting machines outperform GLMs on claim frequency prediction. It is the dataset that scikit-learn uses in its official Tweedie regression tutorial. It is the dataset that the Casualty Actuarial Society, the German Actuarial Association, and Imperial College London's Insurance Pricing Game all reference as the standard.

Building on freMTPL2 is not a shortcut; it is a deliberate choice. When you benchmark against the same data that the published literature uses, your results are directly comparable. A Gini coefficient of 0.28 on freMTPL2 means something specific and verifiable. A Gini of 0.28 on a proprietary dataset means whatever you claim it means.

## The actuarial decomposition

Insurance pricing is not a single prediction problem. It is two: how often do claims happen (frequency), and when they happen, how much do they cost (severity). The pure premium that determines the technical price is the product of expected frequency and expected severity. This frequency-severity decomposition is not a modeling trick; it is the actuarial standard, codified in regulatory frameworks from Solvency II in Europe to the LISF in Mexico.

For frequency, the natural model is Poisson regression with a log link and exposure as an offset. For severity, conditional on a claim occurring, the Gamma distribution with a log link captures the right-skewed, strictly positive cost distribution. These are the GLMs that every auto insurer in the world uses as their regulatory baseline. They are transparent, auditable, and backed by decades of actuarial theory.

The question is not whether GLMs work. They do. The question is whether they leave predictive accuracy on the table by failing to capture non-linear interactions between features, and if so, whether the improvement from machine learning models is large enough to justify the added complexity.

## What the models show

The answer, consistent with the published benchmarks, is yes. On this dataset:

The **Poisson GLM** achieves a Gini coefficient around 0.23 and a D-squared of approximately 0.043. BonusMalus (the no-claims discount coefficient) dominates the coefficient table, with young drivers and urban areas showing the expected positive relativities. The model is interpretable by design: every coefficient maps directly to a multiplicative factor on the baseline frequency.

**XGBoost** with Poisson objective, tuned via Optuna over 100 Bayesian optimization trials, reaches a Gini around 0.27 and substantially lower deviance. **LightGBM** edges slightly further to approximately 0.28. The improvement is not marginal; it represents materially better risk discrimination, particularly in the tails of the distribution where the most and least risky policyholders sit.

The critical insight from the double-lift analysis is where the GLM fails. When you bin policyholders by GLM prediction and compare the GBM's view of the same bins, the divergence reveals systematic cross-subsidization: the GLM overprices safe suburban drivers and underprices risky urban profiles. That is not a statistical curiosity; it is money. An insurer that prices more accurately attracts better risks and repels the worst, creating a competitive advantage that compounds over time.

## The explainability problem

A black-box model that outperforms a GLM is useless if the regulator cannot inspect it and the actuary cannot sign off on it. This is not hypothetical. The EU AI Act, which took effect in 2024, classifies insurance pricing as high-risk AI. The Colorado AI Act takes effect in February 2026. Mexico has no specific AI regulation for insurance yet, but the CNSF requires technical notes (notas tecnicas) for all tariff filings, and a general AI law is expected in 2026.

SHAP (SHapley Additive exPlanations) solves this. TreeSHAP on the fitted GBM produces, for every policyholder, an additive decomposition of the prediction into feature contributions. The global SHAP summary confirms what actuaries already know: BonusMalus is the dominant predictor, followed by driver age and vehicle age. But the SHAP dependence plots reveal what the GLM's linear structure cannot capture: the effect of driver age on frequency is U-shaped (young and elderly drivers are riskier), and the effect of BonusMalus accelerates non-linearly above 100. These non-linearities are real effects, not artifacts, and they explain the GBM's superior discriminatory power.

Kuo and Lupton's 2023 paper in the Variance journal formalized this: SHAP combined with partial dependence plots provides the interpretability layer that regulators need to approve ML-based pricing models. The technique is not speculative; it is the emerging standard.

## The fairness question

The Area variable in freMTPL2 encodes population density from A (rural) to F (dense urban). Density is actuarially justified: urban areas have more traffic, more accidents, higher repair costs. But density also correlates with socioeconomic status. In France, this is monitored under GDPR and the EU Gender Directive framework. In Mexico, where income inequality between Mexico City and rural Oaxaca is an order of magnitude larger, the question is even more pointed.

The fairness audit in this project compares predicted frequencies across Area segments for each model. If the GBM exploits density as a proxy for something the regulator considers discriminatory, that exploitation shows up as divergence between the model's area-level predictions and the actuarially justified actual loss experience. The analysis does not resolve the ethical question, but it makes the question empirically answerable, which is the prerequisite for any regulatory discussion.

## Connections to the rest of the portfolio

This project occupies a specific position in the insurance technical pipeline. The [P&C reserves dashboard](/en/blog/insurance-claims-dashboard) analyzed what happens after claims occur: development patterns, IBNR estimation, loss ratios by line of business. That is the backward-looking question. This project is the forward-looking counterpart: given a policyholder's characteristics, what premium should they pay before any claim happens?

The pricing model's predicted frequency feeds directly into the reserve model's expected loss inputs. If the pricing model systematically underestimates frequency for a segment (as the double-lift analysis shows the GLM does for certain urban profiles), the reserve model will eventually show adverse development for that segment. The two projects are consecutive stages of the same actuarial cycle.

[SIMA](https://sima-451451662791.us-central1.run.app/) implements the regulatory calculation layer for the Mexican market: LISF/CUSF-compliant reserve calculations, Lee-Carter mortality projection, and the capital adequacy framework that the CNSF requires. The pricing models in this project produce the technical premiums that SIMA's reserve modules then process downstream. Different products (auto vs. life), but the same regulatory logic applies: the CNSF requires that technical notes demonstrate the actuarial adequacy of the tariff, and ML pricing with SHAP explainability provides exactly that demonstration.

The [GMM Explorer](https://gmm-explorer.vercel.app/contexto) addresses the severity distribution side: given a portfolio of claims, what mixture of distributions best describes the cost? That is the severity component of the frequency-severity decomposition that this project implements for the frequency side.

## What this means for Mexico

The gap is not theoretical. Only 15 to 20% of Mexican insurers use any form of AI or ML in their pricing processes. Qualitas, the market leader with 33% share in auto, prices with traditional methods. Crabi is the only tech-native auto insurer licensed in Mexico in the last 25 years. There are 68 insurtechs in the country (second largest ecosystem in Latin America), but the actual disruption of pricing methodology has barely begun.

The regulatory environment is, paradoxically, more permissive than Europe's. The CNSF requires technical notes for tariff filings but does not require prior rate approval. There is no AI-specific regulation equivalent to the EU AI Act. That means a Mexican insurer could adopt ML pricing with SHAP explainability today, file the technical note with the demonstration of actuarial adequacy, and deploy it, without the multi-year regulatory approval process that European carriers face.

The business case is direct: risk-adequate premiums based on ML pricing mean lower prices for good drivers and more accurate prices for bad ones. In a market where 70% of vehicles are uninsured, making insurance cheaper for the majority of the population is not just a competitive advantage; it is a path to expanding the market itself. With 96.5% mobile penetration, Mexico also has the infrastructure for smartphone-based telematics (UBI), the natural evolution after demonstrating that traditional features already support ML pricing.

## Limitations and what comes next

This project uses European data to demonstrate techniques relevant to Mexico. The obvious limitation is that French driving patterns, vehicle fleets, and geographic risk profiles differ from Mexican ones. A Nissan March in Guadalajara and a Renault Clio in Lyon face different risks. The methodology transfers; the parameters do not.

What Mexico lacks, and what this project implicitly argues for, is a centralized, anonymized claims database equivalent to freMTPL2. France has one. The UK has one. Mexico does not. AMIS (the Mexican insurers' association) could lead this effort, and the result would be transformative: a Mexican freMTPL2 that enables every insurer, not just the largest ones, to build data-driven pricing models.

On the modeling side, CatBoost and Explainable Boosting Machines (EBMs) would extend the comparison. A Tweedie GLM that models pure premium directly (bypassing the frequency-severity split) is the natural baseline extension. And bootstrap confidence intervals on the Gini and deviance metrics would convert point estimates into ranges that carry honest uncertainty.

## Academic foundation

The four papers that ground this project:

Noll, Salzmann, and Wuthrich (2020) established the freMTPL2 benchmark and demonstrated GBM superiority over GLM for claim frequency. Colella and Jones (2023) in the CAS E-Forum confirmed that no single model dominates universally, validating the comparative approach. The MDPI Risks paper (2024) showed that a hybrid GLM+ANN model outperforms all individual models, pointing toward the ensemble strategies that are the likely future of actuarial pricing. And Kuo and Lupton (2023) in Variance formalized the explainability framework that makes ML pricing regulatorily viable.

The PDFs are available in the project repository under `docs/references/`.

## Study materials

- <a href="https://github.com/GonorAndres/data-science-path/tree/main/projects/insurance-pricing" target="_blank" rel="noopener">GitHub repository</a>: Complete ML pipeline (Poisson/Gamma GLMs, XGBoost, LightGBM with Optuna tuning and MLflow tracking), SHAP analysis, fairness audit, FastAPI backend, and Next.js interactive dashboard with 4 tabs.
