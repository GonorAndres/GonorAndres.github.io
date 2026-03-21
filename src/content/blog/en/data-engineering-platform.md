---
title: "Why an Actuary Builds Data Platforms (and How to Do It for $10 a Month)"
description: "6 GCP projects that demonstrate how data engineering transforms actuarial work. Built a dimensional claims warehouse in BigQuery, orchestration with Dagster and Cloud Run, streaming intake with Pub/Sub and Apache Beam, infrastructure as code with Terraform, and pricing with Tweedie GLM. The entire platform runs for under $10/month; conventional architectures cost $1,000+."
date: "2026-03-18"
lastModified: "2026-03-21"
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

The core idea is to organize data so that an actuary can ask questions directly: "show me incurred losses by coverage type and accident quarter." A star schema does exactly that: four dimensions (policyholder, policy, date, coverage) surround two fact tables (claims and payments). Instead of hunting through spreadsheets, you write a query and get the answer.

Raw data flows through four transformation layers managed by Dataform: first it gets cleaned and standardized (staging), then joined and enriched with reference catalogs (intermediate), then aggregated into metrics like loss triangles and claim frequency (marts), and finally shaped into dashboard-ready views (reports). Each layer feeds the next, and errors get caught before reaching the model. Everything uses Mexican locale names, INEGI state codes, and MXN currency, because a warehouse that reflects the real domain demonstrates business understanding, not just the ability to move columns around.

For local development, DuckDB runs directly on your machine with no servers to install or pay for. The valuable part: the same SQL runs on BigQuery without changes, so what works locally works in production. Fifty-two pytest tests verify that the schema is correct, that references between tables are consistent, and that business rules hold (positive amounts, coherent dates, sums that balance across layers).

The claims dashboard is deployed on Cloud Run: <a href="https://claims-dashboard-451451662791.us-central1.run.app" target="_blank" rel="noopener">claims-dashboard</a>. Monthly cost: under \$1, because BigQuery's free tier handles the query volume and Cloud Run scales to zero when nobody is looking at the dashboard.

### P02: Orchestrated ELT pipeline

The first real infrastructure decision: orchestration. The industry standard is Apache Airflow, deployed via Cloud Composer on GCP. Composer manages Airflow and costs \$400+ per month minimum. A pipeline that runs once daily, ingests a few thousand records, and executes five linear steps with no fan-out or branching: that cost becomes indefensible.

The alternative is Cloud Run + Cloud Scheduler: a container that wakes up when scheduled, runs the pipeline, and goes back to sleep. Like an employee who shows up, does the job, and leaves, instead of sitting idle 24 hours waiting for instructions. Total cost: \$0.10 per month. The logic is identical, the results are identical, 4,000 times cheaper. This pattern works for any small-to-medium pipeline that runs on a predictable schedule.

For local development, Dagster offers something Cloud Run does not: a visual interface where you can see your data flow, track what ran and when, and debug failures without reading terminal logs. A reference Airflow DAG is also included in the repository, so that an employer using Airflow can see I understand their tool. The decision not to deploy it is economic, not technical.

The deployment lesson illustrates what happens when local assumptions meet cloud reality. Cloud Run expects an HTTP server listening permanently. The original Dockerfile executed the pipeline as a batch script that exited when finished. Cloud Run interpreted that exit as a crash and restarted in a loop. The fix was adding an HTTP endpoint that triggers execution on demand. A simple error, but exactly the kind of problem that only surfaces in production.

### P03: Streaming claims intake

In practice, claims do not wait for someone to run a process at the end of the day. One adjuster files a report at 3pm, another at 3:15, another at 4. The question is: can the system react to each claim as it arrives, instead of waiting for them to accumulate?

Pub/Sub works like a mailbox that never loses a letter. Each claim becomes a message with its coverage type, deductible, status, and amount. A Cloud Run service receives each message, checks that all fields are present and valid, enriches it with catalog information (coverage type, state code), and writes it to the warehouse. If a message arrives malformed, it gets routed to a separate queue for review instead of contaminating the data.

Apache Beam groups those events into time windows: how many claims arrived this hour? What is the total amount by coverage this shift? How many open cases by state today? The important detail: the code is written with the same logic a real-time system would use, but runs in batch to save costs. Streaming Dataflow costs \$1,000+ per month continuously. In batch, it costs pennies per run. The code is identical; switching to real-time means changing a configuration parameter, not rewriting anything. Monthly cost: \$1 to \$5.

### P04: GCP infrastructure with Terraform

What happens if the entire platform disappears? Can you rebuild it? Terraform answers that question. It is a tool that lets you describe all your infrastructure in text files: instead of going into the Google Cloud console and creating resources one by one through clicks, you write what you need (databases, storage, services, permissions) and Terraform creates it for you. If something gets deleted or breaks, a single command (`terraform apply`) rebuilds it in minutes.

This matters for three concrete reasons. Reproducibility: anyone with access to the repository can stand up the complete platform from scratch. Auditability: every infrastructure change is recorded in Git, just like code. Collaboration: changes are reviewed in pull requests before being applied, with `terraform plan` showing exactly what will change before it happens.

The platform has 24 resources organized in 6 modules (permissions, database, storage, messaging, services, and scheduling). For automated deployment, GitHub Actions connects to GCP without storing passwords or service account keys: it uses Workload Identity Federation, which generates short-lived temporary tokens. In practice, this means nobody holds credentials that could leak.

The lesson learned: Terraform stores infrastructure state in a remote file (a GCS bucket). But that bucket is part of the infrastructure Terraform should create. You cannot initialize Terraform without the bucket, and you cannot create the bucket without Terraform. The solution is to create the bucket first with local state on disk, then migrate. A paradox that seems trivial, but that you only discover when you actually deploy.

### P05: True streaming pipeline (local only)

P03 answers "what happened today?" after the fact. P05 answers "what is happening right now?" as it unfolds. The difference matters in production: fraud detection needs seconds, not hours. Monitoring reserve adequacy benefits from seeing claim surges as they happen, not the next day.

What does true streaming give you that batch does not? Three things. First: late-arriving data is handled correctly. A claim registered 40 minutes late gets incorporated into the right time window instead of being lost or double-counted. Second: results update as new information arrives. Instead of a single final number at end of day, you get estimates that refine hour by hour. Third: guaranteed deduplication, each event is processed exactly once per window, regardless of whether the message was resent.

Technically, P03 uses discarding mode (each result is independent, no late data). P05 uses accumulating mode (each result includes everything before it), accepts data up to one hour after window close, and guarantees exactly-once processing through state-based deduplication.

P05 is not deployed because streaming Dataflow costs \$50 to \$100 per day, since it requires workers running permanently. The code is Dataflow-ready; only the deployment target changes. Not deploying it is a cost decision, not a technical limitation. A two-hour demo would cost under \$10 if needed to prove it works in production.

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

Actuarial work, at its core, is about taking large volumes of uncertain events (claims, payments, recoveries) and turning them into reliable numbers: reserves, premiums, capital requirements. A data platform does exactly the same thing, but automated.

Think of it this way: claims arrive one by one (streaming), get grouped by period (warehouse), get aggregated into development triangles (marts), and feed pricing models. That flow is the actuarial process. The difference is that instead of relying on someone copying columns correctly between files, every step is automated, verified with tests, and recorded in Git. When the CNSF asks how you arrived at a number, the answer is a commit hash, a pipeline execution log, and 52 passing tests.

The connections to the rest of the portfolio are natural. <a href="/en/blog/sima/">SIMA</a> computes graduated mortality, commutation functions, and capital requirements under LISF; all of that needs clean data as input, exactly what this platform produces. The <a href="/en/blog/actuarial-ml-pricing/">insurance pricing ML project</a> uses the same frequency-severity decomposition as P06, but explores more complex models to compare against the regulatory baseline. The <a href="/en/blog/data-analyst-portfolio/">data analyst portfolio</a> is the analysis layer on top of this infrastructure: dashboards and reports that consume what the marts produce.

When data infrastructure is reliable, actuarial judgment can focus on what actually matters: choosing assumptions, calibrating models, interpreting results. Not cleaning data.

## What I would change

The most significant limitation is the synthetic data. Every project generates claims with calibrated distributions (lognormal severity, Poisson frequency, exponential report lag), but synthetic data lacks real correlations, seasonality, and tail behavior. Next iteration: replace with freMTPL2, the French motor third-party liability dataset used as the actuarial benchmark. It is public, realistic, and comparable against published benchmarks.

P05's streaming pipeline should run on Dataflow as a short demo, even for a few hours at \$5 to \$10. Local execution proves the code works; Dataflow run proves deployment works. That difference matters: employers need to know the candidate operates in production, not just passes local tests.

Data quality monitoring is the missing layer. Great Expectations or a similar framework between ingestion and transformation would catch schema drift and distribution shifts before they propagate to the warehouse. And a Looker Studio dashboard connecting all six projects into a single executive view would demonstrate the platform as a coherent system rather than six independent repositories.

## So what?

An actuary who understands data engineering is not a data engineer who learned actuarial formulas. The value is different. It is knowing that loss triangles require accident-quarter granularity and building the warehouse schema for it from day one. Knowing that CNSF technical notes demand auditable lineage and implementing Dataform transformations to deliver it. Knowing that Tweedie GLMs need exposure offsets and writing the feature SQL to include them.

The six projects in this platform are not exercises. They are the infrastructure layer that makes actuarial work scalable, reproducible, and defensible. And they run for less than \$10 a month.

The code, tests, and infrastructure definitions are on <a href="https://github.com/GonorAndres/data-engineer-path" target="_blank" rel="noopener">GitHub</a>. The claims dashboard is live on <a href="https://claims-dashboard-451451662791.us-central1.run.app" target="_blank" rel="noopener">Cloud Run</a>.
