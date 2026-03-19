---
title: "Why an Actuary Builds Data Platforms (and How to Do It for $10 a Month)"
description: "6 GCP projects that demonstrate how data engineering transforms actuarial work. Built a dimensional claims warehouse in BigQuery, orchestration with Dagster and Cloud Run, streaming intake with Pub/Sub and Apache Beam, infrastructure as code with Terraform, and pricing with Tweedie GLM. The entire platform runs for under $10/month; conventional architectures cost $1,000+."
date: "2026-03-18"
category: "proyectos-y-analisis"
lang: "en"
tags: ["BigQuery", "Terraform", "Pub/Sub", "Apache Beam", "Dagster", "Cloud Run", "DuckDB", "Tweedie GLM", "GCP", "actuarial"]
---

Actuarial models are only as trustworthy as the data that feeds them. At most Mexican insurers, that data arrives in CSVs attached to emails, gets loaded into Excel by hand, transformed through formulas no one fully understands, and fed into pricing models that produce the numbers someone signs off on. When the CNSF asks for a quarterly solvency report, the entire process restarts from scratch. <a href="/en/blog/sima/">SIMA</a> showed that an actuary can build the calculation engine: mortality graduation, Lee-Carter projection, commutation functions, reserves, SCR. But a calculation engine without data infrastructure is a Formula 1 engine bolted to a bicycle frame. This project answers the next question. Can an actuary build the data platform that makes those engines production-grade? Learning an entirely new discipline to answer that question resulted in six interconnected projects forming a complete data platform on Google Cloud.

## The real problem

Insurance companies in Mexico run actuarial workflows on spreadsheets. Claims data arrives in CSVs from adjusters, gets manually loaded into Excel, transformed through formulas that reference other spreadsheets, and fed into pricing templates. When a number looks wrong, the actuary traces it back through three or four files, hoping nobody touched the intermediate ones since last quarter.

Spreadsheets scale to 500 claims. At 50,000 claims across six coverage types, the system breaks. Add regulatory requirement for auditable data lineage, and the timing pressure (pricing actuary needs loss triangles from yesterday, not last month), and spreadsheets become unworkable. Data engineering solves this: automated, tested, version-controlled pipelines that move data from source to decision.

## The platform: six projects, one architecture

### P01: Claims data warehouse

The foundation is a star schema with four dimensions (policyholder, policy, date, coverage) and two fact tables (claims and payments). The dimensional model reflects how actuaries actually query claims data: "show me incurred losses by coverage type and accident quarter" maps directly to a join between `fct_claims`, `dim_coverage`, and `dim_date`.

DuckDB runs locally for free, providing iteration speed no cloud service can match. BigQuery handles production queries. Dataform manages the SQL-based ELT pipeline across four transformation layers: staging (ingestion, type casting, naming conventions); intermediate (business logic, deduplication); marts (analytical tables); and reports (dashboard-ready views). This is dbt's layered approach, but implemented with Google's native tooling.

The warehouse builds loss triangles and claim frequency analyses; these are the two artifacts in every actuarial reserve review. Fifty-two pytest tests verify schema integrity, referential consistency, and business rules (negative amounts rejected, date logic enforced, orphaned payments caught). The data is Mexican: `es_MX` locale names, INEGI state codes, MXN currency, coverage types reflecting the Mexican P&C market.

The claims dashboard is deployed on Cloud Run: <a href="https://claims-dashboard-451451662791.us-central1.run.app" target="_blank" rel="noopener">claims-dashboard-451451662791.us-central1.run.app</a>. Monthly cost: under \$1, because BigQuery's free tier handles the query volume and Cloud Run scales to zero when nobody is looking at the dashboard.

### P02: Orchestrated ELT pipeline

The first real infrastructure decision: orchestration. The industry standard is Apache Airflow, deployed via Cloud Composer on GCP. Composer manages Airflow and costs \$400+ per month minimum. A pipeline that runs once daily, ingests a few thousand records, and executes five linear steps with no fan-out or branching: that cost becomes indefensible.

Cloud Run plus Cloud Scheduler is the alternative. Scheduler fires cron, Cloud Run wakes up, executes the pipeline, sleeps. Total cost: \$0.10 per month. The pipeline produces identical results. That is a 4,000x cost difference. You trade Airflow's DAG visualization, retry policies, and SLA monitoring; for a linear pipeline, those are overhead, not necessities.

For local development, Dagster provides a superior developer experience: software-defined assets, free UI, type-checked IO managers, built-in observability. A reference Airflow DAG is also included, implementing the same pipeline with task decorators and XCom. An employer running Airflow can see that I understand their tool; the deployed version demonstrates the cost-conscious alternative.

CI/CD flows through GitHub Actions: Docker build, push to Artifact Registry, deploy to Cloud Run. The deployment lesson surfaced quickly: Cloud Run expects an HTTP server listening on `$PORT`. The initial Dockerfile CMD executed the pipeline as a batch script and exited. Cloud Run saw the exit, health-checked the non-responsive container, and killed it. The fix: add an HTTP entrypoint that triggers batch execution on request.

### P03: Streaming claims intake

Insurance claims are events. Policyholder calls adjuster; adjuster files report; report enters the system. In a spreadsheet workflow, it sits in an inbox until batch processing. In event-driven architecture, it becomes a Pub/Sub message immediately.

Pub/Sub serves as the event bus. A Cloud Run push subscriber receives each claim event and validates schema (fields required, coverage type valid, amount positive), enriches with dimensional lookups, and writes to the warehouse. Invalid messages route to a dead-letter topic for inspection.

Apache Beam handles windowed aggregations: claim counts and amounts grouped by time window. Critical decision: Beam runs in batch mode, not streaming. API is identical; only difference is the `--streaming` flag. Batch Beam costs \$0.01 per run. Streaming Dataflow costs \$1,000+ per month. The portfolio demonstrates the pattern; production would flip that flag. Code remains unchanged. Monthly cost: \$1 to \$5.

### P04: GCP infrastructure with Terraform

Every GCP resource is defined in Terraform: 24 resources across 6 modules (IAM, BigQuery, GCS, Pub/Sub, Cloud Run, Cloud Scheduler). Nothing was created through the console. If the entire project were deleted, `terraform apply` rebuilds it in minutes.

Workload Identity Federation enables keyless authentication from GitHub Actions. No service account keys in repository secrets, no JSON credentials committed. The CI/CD pipeline runs `terraform plan` on every pull request (showing changes before they happen) and `terraform apply` on merge to main.

The deployment lesson is the state bucket bootstrap paradox. Terraform stores state in a GCS bucket, but `terraform init` requires that bucket to exist first. The solution is two-phase: create the bucket with local state, then migrate state into it via `terraform init -migrate-state`. It is documented, but only surfaces when you actually deploy.

### P05: True streaming pipeline (local only)

P03 demonstrates streaming patterns in batch mode. P05 implements true streaming: watermarks tracking event-time, composite triggers (AfterWatermark with early and late firings), accumulating mode (results update as late data arrives), one-hour allowed lateness, and BagState deduplication ensuring exactly-once processing per window.

The distinction matters. P03 uses discarding mode (each output is independent, no late data). P05 uses accumulating mode (each output contains all prior data, with explicit late-arrival policies). P03 answers "how many claims arrived in this batch?" P05 answers "how many claims belong to this window, including late arrivals?"

P05 is not deployed because streaming Dataflow costs \$50 to \$100 per day. The code is Dataflow-ready; only the deployment target changes. The code proves the competency; the economics do not justify the deployment.

### P06: Insurance pricing ML pipeline

The final project closes the loop from data platform back to actuarial decision-making. SQL-based feature engineering transforms raw data through three layers: exposure calculations, categorical encodings, and interaction terms. The feature SQL is BigQuery-compatible, so the same queries run on DuckDB during development and BigQuery in production.

The model is a Tweedie GLM with power parameter $p = 1.5$. The Tweedie distribution is the actuarial standard for pure premium modeling because it handles a property unique to insurance data: the point mass at zero. Most policyholders in a given period file zero claims. Among those who do file, the cost is continuous and positive. The Tweedie distribution with $p \in (1, 2)$ models both behaviors simultaneously. At $p = 1$ it reduces to Poisson (frequency only); at $p = 2$ it reduces to Gamma (severity only). The intermediate value captures the compound Poisson-Gamma process that defines insurance losses: Pure Premium $= E[\text{Frequency}] \times E[\text{Severity}]$, estimated in a single regression pass.

Model evaluation uses actuarial metrics: the Gini coefficient for discriminatory power, lift curves across predicted risk deciles, and the actual-to-expected (A/E) ratio by coverage type. An A/E ratio materially different from 1.0 means the tariff is inadequate for that segment, exactly the diagnostic the CNSF expects in a premium sufficiency technical note.

Why Tweedie GLM instead of XGBoost? Interpretability and regulatory compliance. The <a href="/en/blog/actuarial-ml-pricing/">insurance pricing ML project</a> demonstrates that gradient boosting outperforms GLMs on discriminatory power. But the CNSF requires explainable pricing models. A Tweedie GLM produces multiplicative relativities for a tariff table: "urban policyholders pay 1.3x the base rate, comprehensive coverage pays 1.8x." A black-box model requires SHAP values to achieve equivalent interpretability, adding complexity not every regulatory reviewer is prepared to evaluate.

## The cost strategy

| Project | Monthly cost | Conventional equivalent |
|---|---|---|
| P01: Claims warehouse | < $1 (BigQuery free tier + GCS) | Enterprise data warehouse: $500+/mo |
| P02: Orchestrated ELT | $0.10 (Cloud Run + Scheduler) | Cloud Composer: $400+/mo |
| P03: Streaming intake | $1-5 (Pub/Sub + Cloud Run + batch Beam) | Streaming Dataflow: $1,000+/mo |
| P04: Terraform IaC | $0 (GCS state bucket: pennies) | Manual console provisioning: hours of engineer time |
| P05: Streaming pipeline | $0 (local only) | Streaming Dataflow: $1,500+/mo |
| P06: Pricing ML | < $1 (DuckDB local + BigQuery free tier) | Vertex AI + managed endpoints: $200+/mo |
| **Total** | **< $10/mo** | **$3,600+/mo** |

The philosophy is consistent: DuckDB locally for zero-cost development iteration, Cloud Run with scale-to-zero for production (pay only when handling a request), Beam in batch mode for streaming patterns at a fraction of the cost, BigQuery on the free tier for analytical queries.

This is not about being cheap. It is about understanding what you are paying for. Cloud Composer costs \$400/month because it runs a persistent Kubernetes cluster with Airflow webserver, scheduler, and workers. If your pipeline needs that (complex DAGs, SLA monitoring, dynamic task generation), Composer is the right tool. If your pipeline is five sequential steps on a cron schedule, you are paying for infrastructure you do not use.

## Key decisions and trade-offs

| Decision | Choice | Alternative | Rationale |
|---|---|---|---|
| Local database | DuckDB | PostgreSQL | Zero-install, in-process, columnar. Fast enough for development data volumes. |
| Orchestrator (local) | Dagster | Airflow | Free UI, software-defined assets, type-safe IO. Reference Airflow DAG included for employers who use it. |
| Orchestrator (cloud) | Cloud Run + Scheduler | Cloud Composer | 4,000x cost difference for a linear pipeline with no fan-out. |
| Streaming approach | Beam batch mode | Beam streaming on Dataflow | 1,000x cost difference. Identical API surface. Code is deployment-target agnostic. |
| Pricing model | Tweedie GLM | XGBoost / LightGBM | Interpretability for CNSF regulatory compliance. Gradient boosting explored in the data science portfolio. |
| Infrastructure provisioning | Terraform | Console / gcloud CLI | Reproducibility. If the project is deleted, `terraform apply` rebuilds everything. |
| CI/CD authentication | Workload Identity Federation | Service account keys | Keyless. No credentials to rotate, no secrets to leak. |

## The connection to actuarial work

This is not a generic data engineering portfolio. Every dataset uses insurance domain data. The warehouse builds loss triangles. The ML pipeline prices coverage with frequency-severity decomposition. The Pub/Sub topic carries claim events with coverage types, deductibles, and Mexican state codes. The Dataform layers (staging, intermediate, marts) map to how actuarial teams actually organize data.

A traditional actuarial team receives a CSV, opens Excel, and starts building formulas. This platform receives a claim event, validates it, routes invalid messages to a dead-letter queue, enriches valid ones with dimensional lookups, stores them in a star-schema warehouse, materializes loss triangles through SQL, and feeds the results to a pricing model. All automatically. All tested. All version-controlled.

That is what cloud infrastructure does for actuarial work. It does not replace the actuary's judgment about graduation methods or projection models. It makes that judgment trustworthy because the data pipeline underneath is trustworthy. When the CNSF asks how you arrived at a number, the answer is a Git commit hash, a CI/CD pipeline log, and 52 passing tests.

<a href="/en/blog/sima/">SIMA</a> is the calculation engine this platform feeds. The <a href="/en/blog/actuarial-ml-pricing/">insurance pricing ML project</a> uses the same frequency-severity decomposition as P06, applied to freMTPL2 with gradient boosting and SHAP explainability. The <a href="/en/blog/data-analyst-portfolio/">data analyst portfolio</a> is the analysis layer on top of this infrastructure. Together, these four bodies of work cover the full pipeline from raw data to regulatory filing.

## What I would change

The most significant limitation is the synthetic data. Every project generates claims with calibrated distributions (lognormal severity, Poisson frequency, exponential report lag), but synthetic data lacks real correlations, seasonality, and tail behavior. Next iteration: replace with freMTPL2, the French motor third-party liability dataset used as the actuarial benchmark. It is public, realistic, and comparable against published benchmarks.

P05's streaming pipeline should run on Dataflow as a short demo, even for a few hours at \$5 to \$10. Local execution proves the code works; Dataflow run proves deployment works. That difference matters: employers need to know the candidate operates in production, not just passes local tests.

Data quality monitoring is the missing layer. Great Expectations or a similar framework between ingestion and transformation would catch schema drift and distribution shifts before they propagate to the warehouse. And a Looker Studio dashboard connecting all six projects into a single executive view would demonstrate the platform as a coherent system rather than six independent repositories.

## So what?

An actuary who understands data engineering is not a data engineer who learned actuarial formulas. The value is different. It is knowing that loss triangles require accident-quarter granularity and building the warehouse schema for it from day one. Knowing that CNSF technical notes demand auditable lineage and implementing Dataform transformations to deliver it. Knowing that Tweedie GLMs need exposure offsets and writing the feature SQL to include them.

The six projects in this platform are not exercises. They are the infrastructure layer that makes actuarial work scalable, reproducible, and defensible. And they run for less than \$10 a month.

The code, tests, and infrastructure definitions are on <a href="https://github.com/GonorAndres/data-engineer-path" target="_blank" rel="noopener">GitHub</a>. The claims dashboard is live on <a href="https://claims-dashboard-451451662791.us-central1.run.app" target="_blank" rel="noopener">Cloud Run</a>.
