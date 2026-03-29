# Portfolio To-Do

Last updated: 2026-03-25

Read this at the start of every session. Update it when tasks are completed or new ones are discovered.
Tasks are organized by type — a project may appear in multiple lists.

---

## Proyect waiting for pusblish

Posts that do not exist yet. But we need to create after proyect goes to golden phase or completed enteirely.

- [x] `actuarial-suite` — DONE: blog post `suite-actuarial.md` (ES+EN) published
- [x] `cartera-autos` — Cartera de Seguro de Autos (R, Shiny, AMIS, siniestralidad sintética) — DONE 2026-03-19: blog posts (ES+EN), project card updated, deployed to Cloud Run
- [x] `lisf-agent` — DONE: deployed on Cloud Run, blog post `regulation-agent-rag.md` (ES+EN) published
- [x] `pension-simulator` — DONE: blog post `pension-simulator.md` (ES+EN) published
- [x] `flight-analytics` — DONE: blog post `flight-analytics-pg-bq.md` (ES+EN) published
- [ ] `eruption-forecasting` — Pronóstico de erupciones volcánicas (ARIMA, séries de tiempo, UNAM)
- [ ] `b-tree-explorer` (implementation) — concept post `b-trees-optimization.md` exists; this one is about the Rust + WASM build itself
- [x] `insurance-pricing-ml` — DONE: project card exists in projects.ts (slug `insurance-pricing-ml`, tier 2) with blogSlug `actuarial-ml-pricing`
- [ ] `micro-insurance` — MicroInsurance.jl: life insurance pricing for Mexico's informal economy via proxy signals + credibility theory. Julia. Phase 1 not started. Needs: project card, blog post (ES+EN), methodology diagram. Tier 1 candidate.

---

## Blog Posts to Review

Posts that exist but need content alignment or structural fixes.

- [ ] `proust-attention-machine.md` — accent fixes done 2026-03-15; review framing and whether it reflects your actual perspective on what the project taught you about LLMs
- [x] `soa-probability-foundations.md` — DONE 2026-03-24: removed self-referential exam reflections, kept study guide purpose
- [x] `insurance-claims-dashboard.md` — DONE 2026-03-24: full standalone post, redirect banner replaced with cross-reference to data-analyst-portfolio
- [x] `analytics-dashboards.md` — DONE 2026-03-24: same, redirect banner replaced with cross-reference

---

## Screenshots to Add

Files go in `public/screenshots/`.

- [x] `actuarial-suite.png` — exists (176 KB)
- [x] `cartera-autos.png` — exists (161 KB)
- [ ] `proust-attention.png` — MISSING: no screenshot, no `screenshot` field in projects.ts
- [x] `pension-simulator.png` — exists (231 KB)
- [x] `lisf-agent.png` — exists (76 KB)
- [ ] `b-tree-explorer.png` — MISSING: no screenshot, no `screenshot` field in projects.ts
- [x] `flight-analytics-pg-bq.png` — exists (101 KB)
- [ ] `eruption-forecasting.png` — MISSING: no screenshot, no `screenshot` field in projects.ts
- [ ] `micro-insurance.png` — MISSING: no project card yet. Methodology flowchart would work (no UI to screenshot).

---

## Links to Fix

Confirmed broken or placeholder URLs in `src/data/projects.ts`.

- [x] `lisf-agent` — DONE: URL updated to `https://actuarial-regulation-agent-d3qj5vwxtq-uc.a.run.app/`
- [x] `insurance-claims` — resolved: no project card needed, blog post belongs under `data-analyst-portfolio` project card
- [x] `analytics-dashboards` — resolved: same, blog post belongs under `data-analyst-portfolio` project card

---

## Links to Audit (verified 2026-03-24 via HTTP + Playwright MCP)

- [x] Drive PDF links in `src/data/notes.ts` — all 11 links return 200 OK, publicly accessible
- [x] SOA study material Drive links in `src/content/blog/es/soa-*.md` — all 4 additional PDFs return 200 OK
- [x] All `relatedTo` slugs in `src/data/projects.ts` — all 56 cross-references point to existing project slugs
- [x] External GitHub repo links — 3 repos made public (proust-attention, b-trees, learning-posgre). `forecasting` stays private; URL set to `#` in projects.ts.
- [x] Internal blog cross-links — all 14 cross-links verified on local preview (200 OK ES+EN)
- [x] Drive folder links (6 project folders) — all return 200 OK
- [x] Live app URLs — SIMA, GMM Explorer, Data Analyst, LISF Agent, Pension Simulator all return 200 OK
- [x] Colab notebook (euler-method) — returns 200 OK

---

## Project Dev Status (what's blocking the portfolio entry)

For context when writing posts or deciding priority.

| Project | Dev complete? | Deployed? | Blocker |
|---------|--------------|-----------|---------|
| `actuarial-suite` | Yes | No | Done: blog + screenshot exist |
| `cartera-autos` | Yes (R + Shiny) | Yes (Cloud Run) | Done: blog + screenshot exist |
| `proust-attention` | Yes | No (GitHub only) | Screenshot missing, no `screenshot` field in projects.ts |
| `pension-simulator` | Yes (R Shiny) | Yes (Cloud Run) | Done: blog + screenshot exist |
| `lisf-agent` | Yes | Yes (Cloud Run) | Done: blog + screenshot exist |
| `b-tree-explorer` | Yes (WASM build in `/home/andtega349/b-trees/pkg/`) | No | Screenshot missing, optional impl blog post |
| `flight-analytics` | Yes (SQL analysis) | No | Done: blog + screenshot exist |
| `eruption-forecasting` | Yes (Python notebooks) | No | Blog post missing, screenshot missing |
| `micro-insurance` | No (Phase 1 not started) | No | Everything missing: project card, blog, screenshot. Highest actuarial ROI in portfolio. |
