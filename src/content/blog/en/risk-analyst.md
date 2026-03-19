---
title: "Risk Analyst: 13 Quantitative Risk Analysis Projects"
description: "From VaR and Monte Carlo simulation to deep hedging and graph neural networks for systemic contagion. A complete financial risk curriculum with 192 tests and full LaTeX documentation."
date: "2026-03-19"
category: "proyectos-y-analisis"
lang: "en"
tags: ["Python", "Financial Risk", "VaR", "Monte Carlo", "Machine Learning", "Deep Hedging", "Copulas", "EVT"]
---

How do you go from a VaR number on a spreadsheet to a system that a risk desk actually trusts? You build it yourself, piece by piece. This project is 13 modules that walk from the foundations (portfolio VaR, Monte Carlo engines) through regulatory-grade tools (stress testing, EVT tail risk) into research territory (deep hedging, graph neural networks for systemic contagion). Each one pairs LaTeX theory with typed Python, automated tests, and results you can reproduce. Not textbook exercises; implementations that reflect how risks get measured and managed in practice.

## Three tiers

The three tiers reflect how risk knowledge actually accumulates. You start with the tools everyone needs (VaR, Monte Carlo, credit scoring, GARCH). Then you confront the problems that regulation and portfolio management throw at you (extreme tails, copula dependence, stress scenarios). Then you reach the frontier, where machine learning meets open questions.

### Tier 1: Foundations (P01 to P04)

**P01. Portfolio Risk Dashboard.** Three ways to compute VaR (historical, parametric, Monte Carlo), three ways to know when it is wrong (Kupiec, Christoffersen, Basel traffic-light). The dashboard shows rolling VaR and CVaR at multiple confidence levels; the interesting part is the rolling backtesting, which catches exactly when the model starts underestimating losses. Every test checks a mathematical property, not just that the code runs: CVaR must exceed VaR, both must grow with confidence level, Monte Carlo must converge to the analytical answer under normality.

**P02. Monte Carlo Simulation Engine.** Correlated geometric Brownian motion via Cholesky, with three variance reduction techniques to make the simulations converge in reasonable time. Antithetic variates cut variance by 60%; control variates cut it by 85%. The engine prices European options against Black-Scholes with less than 1% error on 100,000 paths.

**P03. Credit Scoring with ML.** Logistic regression, XGBoost, and LightGBM on the same credit dataset. Feature selection uses Weight of Evidence and Information Value; calibration uses Platt scaling and isotonic regression; explainability uses SHAP. AUC above 0.85. The calibration tests matter most: they verify that when the model says "5% default probability," roughly 5% of those borrowers actually default.

**P04. Volatility Modeling.** The full GARCH family (GARCH(1,1), GJR-GARCH, EGARCH, APARCH), HAR-RV for realized volatility, and Markov switching for regime detection. The Markov model is the most revealing: it identifies transitions between calm and turbulent regimes with filtered probabilities, producing a conditional VaR that knows whether the market is in crisis or not.

### Tier 2: Intermediate to Advanced (P05 to P07)

**P05. EVT for Tail Risk.** Extreme value theory through two lenses: block maxima (GEV) and peaks-over-threshold (GPD), with automatic threshold selection via mean residual life plots. The key result is sobering: VaR at 99.9% under GPD runs 40 to 60% higher than the Gaussian estimate. Financial return tails are heavier than the normal distribution predicts, and the gap widens precisely at the confidence levels regulators care about.

**P06. Copula Dependency Modeling.** Five copula families (Gaussian, t, Clayton, Gumbel, Frank) fitted on GARCH-filtered marginals. The t-copula tells the story regulators worry about: when markets fall, assets correlate more than linear correlation suggests. Portfolio VaR under the t-copula runs 15 to 25% higher than under Gaussian, which means any risk model using linear correlation is systematically optimistic about diversification.

**P07. Stress Testing Framework.** DFAST/CCAR-inspired scenarios (baseline, adverse, severely adverse) transmitted to the portfolio via factor regression. The reverse stress testing module inverts the usual question: instead of asking "what happens if GDP drops 5%?", it asks "what macro combination produces an unacceptable loss?" That inversion is often more useful for risk committees.

### Tier 3: Frontier (P08 to P13)

**P08. Deep Hedging.** Neural networks that learn hedging strategies from scratch, including transaction costs, without assuming any particular market model. When transaction costs are significant, the learned strategies outperform classical delta hedging because they internalize the cost of rebalancing instead of ignoring it.

**P09. CVA Counterparty Risk.** Credit valuation adjustment from first principles: bootstrap hazard rates from CDS spreads, simulate exposure profiles (EE, PFE), then model wrong-way risk, the scenario where your exposure to a counterparty increases precisely when that counterparty is most likely to default.

**P10. GNN Credit Contagion.** Graph neural networks on interbank networks, modeling how one bank's failure cascades through the system. DebtRank quantifies each node's systemic importance; the GNN predicts which nodes are most vulnerable to contagion before it happens. Systemic risk metrics (CoVaR, SRISK) come directly from graph topology.

**P11. Conformal Risk Prediction.** Conformal prediction applied to VaR and ES bands. The guarantee is striking: nominal coverage regardless of the underlying distribution, no parametric assumptions required. The intervals adapt automatically to the volatility regime.

**P12. Climate Risk Scenarios.** NGFS scenarios (Net Zero, Delayed Transition, Current Policies) translated into portfolio impact: Climate VaR, stranded asset exposure, WACI. Sobol sensitivity indices reveal which climate assumptions actually drive the uncertainty, a question most climate risk reports leave unanswered.

**P13. RL for Portfolio Risk.** Reinforcement learning agents (PPO, SAC) that optimize risk-adjusted returns under a CVaR constraint. The agent learns when to rebalance and by how much, reducing maximum drawdown by 30 to 40% versus equal-weight without giving up expected returns.

## The numbers

| Metric | Value |
|--------|-------|
| Projects | 13 |
| Lines of typed Python | 25,000+ |
| Automated tests (pytest) | 192 |
| LaTeX theory documents | 13 PDFs |
| Compiled showcase | 31 pages |
| Risk techniques implemented | VaR, CVaR, EVT, GARCH, copulas, stress testing, deep hedging, CVA, GNN, conformal, climate VaR, RL |

Every test checks a mathematical property, not just that the code executes. VaR must increase with confidence level. CVaR must exceed VaR. Monte Carlo must converge to the analytical answer. Calibrated probabilities must match observed frequencies. If a test passes, it means the implementation respects the theory.

## Technical stack

The project uses Python exclusively, with clear separation between data, models, risk measures, simulation, and visualization:

- **Risk and finance:** QuantLib, riskfolio-lib, arch (GARCH), pyextremes (EVT), copulae
- **Machine learning:** scikit-learn, XGBoost, LightGBM, PyTorch, PyTorch Geometric, SHAP
- **Simulation:** custom Monte Carlo engine with variance reduction (antithetic, control variates, importance sampling)
- **Data:** yfinance, FRED, pandas
- **Documentation:** LaTeX (texlive) for theory, Jupyter for interactive walkthroughs

## Connection to the rest of the portfolio

This project builds directly on work already in the portfolio. The <a href="/en/blog/cartera-autos/">auto insurance portfolio</a> uses loss triangles and reserves for a single line of business; here those ideas generalize to portfolio-level risk measures across asset classes. The <a href="https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Evaluaci%C3%B3nDerivadosDivisas">derivatives</a> and <a href="https://drive.google.com/drive/folders/1Dz54zcTpa9quMFCkgddBN5GWQfy6CIXv">Markowitz</a> projects introduced pricing and optimization at a foundational level; P02 (Monte Carlo engine) and P08 (deep hedging) take them to the state of the art. The <a href="https://github.com/GonorAndres/Proyectos_Aprendizaje/tree/main/Credit_Risk_Model">credit model</a> started as a basic scorer; P03 adds SHAP, calibration, and WoE/IV, while P10 scales the same problem to contagion networks with GNNs.

The code, tests, and complete documentation are on <a href="https://github.com/GonorAndres/risk-analyst" target="_blank" rel="noopener">GitHub</a>.
