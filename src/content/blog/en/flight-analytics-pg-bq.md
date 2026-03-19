---
title: "What 5.74 Million Flights Taught Me About PostgreSQL, BigQuery, and Knowing When to Use Each"
description: "A deep dive into building production-grade SQL analytics on real airline data, migrating to BigQuery via Python ETL, and the honest trade-offs between both systems: real timing, real costs, and real query plans."
date: "2026-03-18"
category: "proyectos-y-analisis"
lang: "en"
tags: ["PostgreSQL", "BigQuery", "Python", "ETL", "EXPLAIN ANALYZE", "Docker", "GIS", "Plotly", "Folium", "data-engineering"]
---

Every data engineer eventually faces the same question: should this workload live in a relational database or an analytical warehouse? The textbook answer is correct but useless: "use PostgreSQL for OLTP, BigQuery for OLAP." It doesn't tell you *where the crossover point is*, *how the query plans differ*, or *what you lose when you migrate*. This project answers those questions with real data, real timing, and real infrastructure decisions.

## The dataset: 5.74 million rows of Russian airline operations

The <a href="https://postgrespro.com/community/demodb" target="_blank" rel="noopener">PostgresPro Airlines demo database</a> contains real flight schedules across 104 Russian airports: bookings, tickets, flights, boarding passes, seat maps, and aircraft specs. Eight tables, 5.74 million rows, JSONB for multilingual names, a `point` type for airport coordinates, and timestamps with timezone awareness. It's the kind of messy, real-world schema that exposes the differences between databases far better than any toy example.

The first question I asked was simple: **which routes lose the most time to delays, and how does revenue concentrate across the network?**

## Phase 1: SQL analytics with real metrics

Every analysis started with a business question, not a technique. The delays script asks "which routes have the highest delay rate?" and discovers that the Voronezh-to-Pulkovo route leads at 11.1% (10 of 90 flights delayed by 15+ minutes). The revenue script reveals something more surprising: Economy class captures 70.8% of revenue from 88% of tickets, while Business commands 26.5% from just 10%. That concentration has direct pricing implications.

The utilization analysis uncovered something striking: Boeing 777-300s operate at 72.8% average load factor, while Cessna 208 Caravans run at just 16%. That's not a small plane problem; it's a network design problem. Those Cessnas serve routes where boarding passes simply aren't being issued in the dataset, suggesting either data incompleteness or genuinely underutilized regional routes.

Each finding is backed by a runnable SQL script in the `analysis/` directory. No placeholders, no "example findings." Run the query, get the number.

## Phase 2: Understanding the PostgreSQL engine

Knowing SQL syntax is table stakes. Understanding *why* a query takes 1,283 milliseconds instead of 2.6 milliseconds is what separates a developer from an engineer.

The `internals/` directory contains six scripts that go deep into PostgreSQL's engine:

**EXPLAIN ANALYZE** was enlightening. A simple filter on `flights WHERE departure_airport = 'SVO' AND status = 'Arrived'` was scanning all 65,664 rows with a Sequential Scan (33.9ms). I created a composite index on `(departure_airport, status)`, and the same query switched to a Bitmap Index Scan and finished in 2.6ms. That's a **13x improvement** from a single `CREATE INDEX` statement.

**Materialized views** delivered the most dramatic result. A route delay summary that took 174ms from raw tables? Served in 0.13ms from the materialized view. That's **1,300x faster**. The catch is staleness: you must `REFRESH MATERIALIZED VIEW CONCURRENTLY` to update the data without blocking reads.

**Partitioning** shows another win for smart schema design. Range-partitioning the flights table by month enables partition pruning: a query for July 2017 flights scans only the July partition instead of the entire table. The EXPLAIN output explicitly shows "Partitions selected: 1 of 5."

**VACUUM tuning** exposed the mechanics of MVCC. After updating 50,000 rows, the table held 50,000 dead tuples consuming disk space. Standard VACUUM marks that space as reusable (but doesn't shrink the file); VACUUM FULL rewrites the entire table to reclaim space but demands an exclusive lock.

**WAL and checkpoints** revealed trade-offs I hadn't fully appreciated. A bulk operation generating 100,000 inserts and 100,000 updates produces measurable WAL volume. Setting `synchronous_commit = off` can speed up writes, but you lose the last ~600ms of commits on a crash. That's acceptable for analytics; never for financial transactions.

These aren't academic exercises. They're the exact decisions you make when tuning a production PostgreSQL instance on Cloud SQL.

## Phase 3: Migration to BigQuery

The migration pipeline is four Python files: `extract.py` reads from PostgreSQL using batched cursors (56,000 rows/second), `transform.py` flattens JSONB columns and converts the `point` type to `latitude`/`longitude` floats, and `load.py` pushes DataFrames to BigQuery using Application Default Credentials. The full pipeline moves 5.74 million rows in 102 seconds.

The schema translation exposed every difference between the two systems. PostgreSQL's `JSONB` column `airport_name` (storing `{"en": "Sheremetyevo", "ru": "..."}`) became two flat columns: `airport_name_en` and `airport_name_ru`. The `point` type for coordinates became separate `longitude` and `latitude` FLOAT64 columns. Fixed-length `character(3)` fields needed trailing whitespace stripped. Every `timestamptz` was normalized to UTC (BigQuery stores all timestamps in UTC).

The pipeline uses `gcloud` Application Default Credentials: no service account JSON files, no credential management. On this VM, `gcloud auth` is already configured, so the Python BigQuery client authenticates automatically.

## Phase 4: PostgreSQL vs BigQuery, honestly

I ran the same business queries on both systems and recorded actual timing:

| Query | PostgreSQL (indexed) | BigQuery |
|:------|:--------------------|:---------|
| Route delay analysis (49K rows, 2 JOINs) | 111ms | ~1.5s |
| Revenue by fare class (2.3M rows) | 1,635ms | ~1.2s |
| Point lookup (1 flight by ID) | 2.6ms | ~800ms |
| Materialized view query | 0.13ms | N/A |

**PostgreSQL wins on point lookups.** With a proper index, a single-row lookup takes 2.6ms. BigQuery's minimum query time is ~500ms due to job scheduling overhead. For an API backend serving individual flight records, PostgreSQL is 300x faster.

**BigQuery wins on full-table analytics.** The revenue query scanning 2.3 million rows of `ticket_flights` ran faster on BigQuery (1.2s vs 1.6s) without any index design. BigQuery's columnar storage and parallel execution handle large aggregations naturally.

**Cost tells the real story.** For this 500MB dataset with analytical queries, BigQuery costs ~$0.25/month (pay-per-query at $5/TB). The smallest Cloud SQL instance costs ~$7/month. At scale, the gap widens further: BigQuery charges for what you scan, Cloud SQL charges for what you provision.

The conclusion isn't "BigQuery is better." It's "use PostgreSQL for OLTP and point lookups, BigQuery for OLAP and ad-hoc analytics, and build a pipeline between them." This project implements exactly that pattern.

## Phase 5: Geospatial analysis and visualization

Airport coordinates enabled a geospatial layer that demonstrates both systems' GIS capabilities. In PostgreSQL, I wrote a PL/pgSQL haversine function to calculate great-circle distances from the `point` type. In BigQuery, the same calculation uses `ST_GEOGPOINT()` and `ST_DISTANCE()`, built-in with no custom functions needed.

The distance analysis surfaced an unexpected pattern: delay rates don't correlate linearly with route length. Short routes (<500km) and very long routes (4,000km+) show similar delay percentages. The worst performance clusters in the 500-2,000km range, where turnaround pressure is highest and crews don't have time to fully recover.

A Jupyter notebook ties everything together: interactive plotly charts (delay heatmaps, revenue Pareto curves, load factor rankings, before/after optimization comparisons) plus folium maps showing the route network colored by delay severity. The route map is the visual centerpiece: 104 airports connected by lines that shift from green to red as delays increase, making network stress immediately apparent.

## What this project demonstrates

This isn't a "learning SQL" project. It's a complete data engineering workflow:

1. **PostgreSQL at production depth**: not just queries, but EXPLAIN ANALYZE, index strategy, partitioning, VACUUM, WAL, and Cloud SQL-modeled configuration
2. **Python ETL**: extract with batched cursors, transform JSONB and geospatial types, load to BigQuery with ADC auth
3. **BigQuery migration**: schema translation, syntax differences, real performance comparison
4. **Informed trade-off analysis**: not "which is better" but "which is better *for this specific workload*"
5. **Visualization**: interactive charts and maps that make data patterns immediately visible
6. **GIS in both systems**: PL/pgSQL haversine vs BQ `ST_DISTANCE`, same questions, different implementations

The full source is at <a href="https://github.com/GonorAndres/learning-posgre" target="_blank" rel="noopener">github.com/GonorAndres/learning-posgre</a>. Every script is runnable, every metric is real, and the pipeline can be reproduced with `docker compose up` and a GCP project.
