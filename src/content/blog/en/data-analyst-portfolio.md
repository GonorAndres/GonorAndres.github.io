---
title: "Data Analyst Portfolio: 7 End-to-End Projects"
description: "From business question to actionable insight. 7 data analysis projects covering e-commerce, insurance, finance, A/B testing, executive KPIs, and operational efficiency. SQL, Python, Streamlit, Next.js, and Power BI."
date: "2026-03-13"
category: "proyectos-y-analisis"
lang: "en"
tags: ["portfolio", "data-analyst", "SQL", "Python", "Streamlit", "Next.js", "Power BI"]
---

<img src="/screenshots/data-analyst-portafolio.png" alt="Data Analyst Portfolio" style="width:100%;border-radius:0.75rem;margin-bottom:2rem;box-shadow:0 4px 16px rgba(0,0,0,0.08);" />

A data analyst's job is not to produce charts. It is to convert a business question into an informed decision. Every project in this portfolio follows that full arc: a stakeholder has a question, the data exists in some inconvenient format, the analysis produces a finding, and that finding gets delivered in a format the audience can act on.

I built these 7 projects during my transition from actuarial science to hybrid data analyst roles. Actuarial training provides statistical rigor (Kaplan-Meier, severity distributions, reserving methods), but DA roles demand different tools: fluent SQL, interactive dashboards, storytelling for non-technical audiences, and the ability to move across domains without losing depth. These projects demonstrate exactly that.

The connecting thread is methodological: careful ETL, exploratory analysis before any conclusion, segmentation as a recurring tool, and delivery in whatever format the stakeholder needs, whether that is an interactive dashboard, an automated PDF, or a Streamlit app.

## The 7 projects

### 00 - Airbnb CDMX: market analysis

**Business question:** How is Mexico City's short-term rental market structured, and how concentrated is supply?

The Inside Airbnb dataset for CDMX contains 27,051 listings across 79 columns. The ETL pipeline cleans prices (arrive as strings with currency symbols), handles nulls, and segments hosts into enterprise vs. casual operators. The central finding: 7% of hosts control 40% of supply. Blueground, Mr. W, and Clau are not individuals sharing their apartment; they are hospitality companies operating at industrial scale. Cuauhtemoc concentrates 46% of listings, while peripheral boroughs like Tlalpan (MXN 2,493 average) show premium pricing with thin supply.

Dashboard built with Next.js and Recharts, static architecture (precomputed JSON, zero backend).

**Status:** Complete | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/00-demo-aestehtics" target="_blank" rel="noopener">GitHub</a>

### 01 - P&C actuarial reserves: IBNR and loss experience

**Business question:** Of the 6 lines of business in the portfolio, which are profitable and what is the total IBNR the insurer must reserve?

Reserve analysis on NAIC Schedule P regulatory data using Chain-Ladder and Bornhuetter-Ferguson methods. The dataset includes ~50K synthetic claims with actuarially realistic distributions (lognormal severity, Poisson frequency, exponential report lag). The result: only Private Passenger Auto and Product Liability are profitable. Medical Malpractice shows a loss ratio of ~280%, a clear signal of structurally inadequate pricing. Total portfolio IBNR is ~$20.4M, disproportionately concentrated in long-tail lines.

Interactive dashboard with Next.js and FastAPI: loss triangle heatmap, IBNR waterfall, frequency-severity and combined ratio trend.

**Status:** Complete | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/01-insurance-claims-dashboard" target="_blank" rel="noopener">GitHub</a>

### 02 - E-Commerce cohorts: retention, RFM, and LTV

**Business question:** What differentiates the 3% of Olist customers who repurchase from the 97% who never return?

The Brazilian E-Commerce Public Dataset has ~99K orders across 9 CSVs. The critical caveat: only ~3% of customers are repeat buyers, which transforms classic cohort analysis into an investigation of what makes that 3% different. The pipeline uses `customer_unique_id` (not `customer_id`) to avoid counting duplicates. The analysis includes retention matrices, Kaplan-Meier survival curves, RFM segmentation, and LTV estimation.

Streamlit app deployed on Cloud Run with full technical pipeline visible (notebooks converted to HTML embedded in the app).

**Status:** Complete | <a href="https://da-cohort-streamlit-451451662791.us-central1.run.app/" target="_blank" rel="noopener">Live app</a> | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/02-ecommerce-cohort-analysis" target="_blank" rel="noopener">GitHub</a>

### 03 - A/B Testing: frequentist, Bayesian, and Simpson's Paradox

**Business question:** If we run a conversion A/B test, which statistical approach gives us the most reliable answer and why can aggregated results lie?

Conversion rate evaluation using three approaches: classic frequentist testing, Bayesian inference with Beta distribution and PyMC, and sequential monitoring. The project includes an explicit analysis of Simpson's Paradox: how aggregated test results can reverse when segmented by subgroup, a real risk in any product experiment.

Interactive Next.js dashboard for exploring each statistical approach, calculating test power, and visualizing Bayesian convergence.

**Status:** In progress | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/03-ab-test-analysis" target="_blank" rel="noopener">GitHub</a>

### 04 - Executive KPI Report: automated SaaS metrics

**Business question:** How to automate monthly executive report generation with anomaly detection and key metric forecasting?

Automated pipeline generating executive PDF reports from SaaS metrics (MRR, churn, CAC, LTV). Includes time series anomaly detection and metric forecasting for the next quarter. The output is a bilingual PDF (Spanish/English) ready for C-suite delivery, with Plotly visualizations exported as images.

5 notebooks covering data generation through report automation. Complementary Next.js dashboard.

**Status:** In progress | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/04-executive-kpi-report" target="_blank" rel="noopener">GitHub</a>

### 05 - Financial Portfolio: Monte Carlo and efficient frontier

**Business question:** Given a portfolio of assets, what is its risk-return profile and how does it compare against the efficient frontier?

Portfolio analysis with Monte Carlo simulation, Markowitz efficient frontier calculation, risk metrics (VaR, CVaR, Sharpe, Sortino), and return attribution. The Streamlit app lets users define their portfolio and see in real time how it positions relative to the efficient frontier and benchmarks.

4 notebooks covering data acquisition, portfolio construction, performance analysis, and risk analytics.

**Status:** In progress | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/05-financial-portfolio-tracker" target="_blank" rel="noopener">GitHub</a>

### 06 - Operational Efficiency: NYC 311, process mining, and SLA

**Business question:** What inefficiency patterns exist in NYC 311 service requests and where are SLAs systematically violated?

Operational efficiency analysis on NYC 311 data (public service requests). Includes process mining to identify bottlenecks, SLA compliance analysis by agency and request type, and geographic segmentation of response times.

Next.js dashboard with process flow visualizations, SLA heatmaps, and agency rankings.

**Status:** In progress | <a href="https://github.com/GonorAndres/data-analyst-path/tree/main/projects/06-operational-efficiency" target="_blank" rel="noopener">GitHub</a>

## Architecture decisions

The choice of delivery tool is not arbitrary. It depends on three factors: who is the audience, how interactive does the output need to be, and what is the update cycle.

**Next.js** (projects 00, 01, 03, 04, 06) when the dashboard is a finished product that needs full control over aesthetics, dark mode, mobile responsiveness, and reusable components across projects. The cost is higher: it requires knowledge of React, TypeScript, and a build pipeline. It is justified when the dashboard has a long shelf life or when components are genuinely reused (KPICard, ChartContainer, and ThemeToggle are shared across all Next.js dashboards).

**Streamlit** (projects 02, 05) when the analysis lives in Python and the priority is moving from notebook to interactive app with minimal overhead. Streamlit is the right choice when the analyst maintaining the app is the same person who wrote the analysis and the Python stack is already established. The notebook-in-Streamlit pattern (converting notebooks to HTML and embedding them as a technical process page) adds portfolio value: the viewer sees the complete code behind every visualization without leaving the app.

**Power BI** appears in the plan for projects 04 and 06 as a complementary format, aimed at stakeholders who already work in the Microsoft ecosystem and expect drag-and-drop segmentation filters.

The decision between **static JSON** (Airbnb, zero backend) and **FastAPI backend** (Olist, Insurance) depends on whether user filters change the underlying computation. If the data fits in memory and aggregations are fixed, static JSON eliminates all infrastructure complexity. If cohort analysis or loss triangles depend on applied filters, the backend is necessary.

## Cross-project learnings

After building 7 projects across different domains, the recurring patterns are more instructive than any individual finding.

**ETL consumes most of the actual time.** In every project, data cleaning and transformation took more time than the analysis itself. Airbnb prices arrive as strings with currency symbols and commas. Olist timestamps need careful parsing to build correct cohorts. NAIC Schedule P data requires cross-table validation before building reliable triangles. NYC 311 data has agency-level inconsistencies in how request types are recorded. The methodology transfers: type validation, explicit null handling, logging of discarded records.

**Percentile-based segmentation appears in every domain.** Classifying Airbnb hosts as enterprise vs. casual (by listing count), segmenting Olist customers into RFM clusters (by recency, frequency, and monetary value), classifying insurance lines by tail profile, segmenting NYC agencies by SLA compliance. The pattern is identical: define thresholds on a distribution, assign labels, measure differences between groups, make decisions based on the heterogeneity.

**Olist's 3% repurchase rate changes how you frame cohort analysis.** When the vast majority of customers are one-time buyers, the question is not "how well do we retain" but "what differentiates those who return." That reframing applies in insurance (what differentiates policies that renew), in SaaS (what differentiates users who don't churn), and in any business with high attrition.

**Actuarial statistical rigor applies directly to product analytics.** Kaplan-Meier for customer survival curves. Severity distributions for modeling LTV. Bornhuetter-Ferguson as an example of combining observed data with a prior when experience is sparse. These are not insurance-exclusive methods; they are statistical tools that most product analysts do not use because they have not encountered them.

## Connections to the actuarial portfolio

This DA portfolio does not exist in isolation. The actuarial projects in the main portfolio directly complement the work here:

- **SIMA** (Integrated Actuarial Modeling System) shares reserve calculation logic with project 01, though for life products rather than P&C. The same discount factors and development patterns that appear in the NAIC triangles live as modular functions in SIMA's engine.
- **GMM Explorer** connects to the segmentation across this portfolio: defining groups from Major Medical Expenses claim distributions is the same percentile-classification pattern that appears in RFM, host segmentation, and SLA analysis.
- The **insurance technical notes** (life and property) provide the regulatory reference: the CNSF frameworks governing how reserves are calculated in the Mexican market. Project 01's methodology is analogous, adapted to the US regulatory context (NAIC).

## Reference materials

- <a href="https://github.com/GonorAndres/data-analyst-path" target="_blank" rel="noopener">Main GitHub repository</a>: Complete source code for all 7 projects, numbered notebooks, SQL queries, ETL pipelines, and deployment configuration.
- <a href="https://da-cohort-streamlit-451451662791.us-central1.run.app/" target="_blank" rel="noopener">E-Commerce Cohort Analysis (Live app)</a>: Streamlit deployed on Cloud Run with full technical pipeline.
