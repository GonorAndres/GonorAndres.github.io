# Portfolio To-Do

Last updated: 2026-03-24

Read this at the start of every session. Update it when tasks are completed or new ones are discovered.
Tasks are organized by type — a project may appear in multiple lists.

---

## Proyect waiting for pusblish

Posts that do not exist yet. But we need to create after proyect goes to golden phase or completed enteirely.

- [ ] `actuarial-suite` — Suite Actuarial Mexicana (Python, LISF, CNSF, tablas EMSSA-09)
- [x] `cartera-autos` — Cartera de Seguro de Autos (R, Shiny, AMIS, siniestralidad sintética) — DONE 2026-03-19: blog posts (ES+EN), project card updated, deployed to Cloud Run
- [x] `lisf-agent` — DONE: deployed on Cloud Run, blog post `regulation-agent-rag.md` (ES+EN) published
- [x] `pension-simulator` — DONE: blog post `pension-simulator.md` (ES+EN) published
- [ ] `flight-analytics` — Análisis de vuelos SQL (PostgreSQL, 2.5GB, aerolíneas rusas)
- [ ] `eruption-forecasting` — Pronóstico de erupciones volcánicas (ARIMA, séries de tiempo, UNAM)
- [ ] `b-tree-explorer` (implementation) — concept post `b-trees-optimization.md` exists; this one is about the Rust + WASM build itself
- [x] `insurance-pricing-ml` — DONE: project card exists in projects.ts (slug `insurance-pricing-ml`, tier 2) with blogSlug `actuarial-ml-pricing`

---

## Blog Posts to Review

Posts that exist but need content alignment or structural fixes.

- [ ] `proust-attention-machine.md` — accent fixes done 2026-03-15; review framing and whether it reflects your actual perspective on what the project taught you about LLMs
- [x] `soa-probability-foundations.md` — DONE 2026-03-24: removed self-referential exam reflections, kept study guide purpose
- [x] `insurance-claims-dashboard.md` — DONE 2026-03-24: full standalone post, redirect banner replaced with cross-reference to data-analyst-portfolio
- [x] `analytics-dashboards.md` — DONE 2026-03-24: same, redirect banner replaced with cross-reference

---

## Screenshots to Add

Files go in `public/screenshots/`. None of these exist yet.

- [ ] `actuarial-suite.png`
- [ ] `cartera-autos.png` — Shiny dashboard Resumen tab (deployed on Cloud Run, needs screenshot capture)
- [ ] `proust-attention.png` — generated text sample or training loss curve
- [ ] `pension-simulator.png` — Shiny app UI
- [ ] `lisf-agent.png` — chatbot answering a LISF question (do after URL is live)
- [ ] `b-tree-explorer.png` — WASM visualization running in browser
- [ ] `flight-analytics.png` — SQL results or delay analysis chart
- [ ] `eruption-forecasting.png` — ARIMA forecast plot

---

## Links to Fix

Confirmed broken or placeholder URLs in `src/data/projects.ts`.

- [x] `lisf-agent` — DONE: URL updated to `https://actuarial-regulation-agent-d3qj5vwxtq-uc.a.run.app/`
- [ ] `insurance-claims` — URL points to blog post; update to deployed dashboard URL when live
- [ ] `analytics-dashboards` — same; URL points to blog post; update when Vercel deploy is live

---

## Links to Audit

Not confirmed broken — need manual verification.

- [ ] Drive PDF links in `src/data/notes.ts` — open each and confirm file is publicly shared (not restricted)
- [ ] SOA study material Drive links in `src/content/blog/es/soa-*.md` and matching EN files
- [ ] All `relatedTo` slugs in `src/data/projects.ts` — verify each slug exists as an actual project entry
- [ ] External GitHub repo links — verify repos are public and not renamed
- [ ] Internal blog cross-links — `[text](/blog/slug)` references throughout blog posts

---

## Project Dev Status (what's blocking the portfolio entry)

For context when writing posts or deciding priority.

| Project | Dev complete? | Deployed? | Blocker |
|---------|--------------|-----------|---------|
| `actuarial-suite` | Check repo (6 phases planned) | No | Blog post, screenshot |
| `cartera-autos` | Yes (R + Shiny) | Yes (Cloud Run) | Screenshot pending |
| `proust-attention` | Yes | No (GitHub only) | Screenshot |
| `pension-simulator` | Yes (R Shiny) | Yes (Cloud Run) | Screenshot pending |
| `lisf-agent` | Yes | Yes (Cloud Run) | Screenshot pending |
| `b-tree-explorer` | Partial (WASM status unknown) | No | Screenshot, optional impl blog post |
| `flight-analytics` | Yes (SQL analysis) | No | Blog post, screenshot |
| `eruption-forecasting` | Yes (Python notebooks) | No | Blog post, screenshot |
