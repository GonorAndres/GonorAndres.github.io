# Portfolio To-Do

Last updated: 2026-03-19

Read this at the start of every session. Update it when tasks are completed or new ones are discovered.
Tasks are organized by type — a project may appear in multiple lists.

---

## Proyect waiting for pusblish

Posts that do not exist yet. But we need to create after proyect goes to golden phase or completed enteirely.

- [ ] `actuarial-suite` — Suite Actuarial Mexicana (Python, LISF, CNSF, tablas EMSSA-09)
- [x] `cartera-autos` — Cartera de Seguro de Autos (R, Shiny, AMIS, siniestralidad sintética) — DONE 2026-03-19: blog posts (ES+EN), project card updated, deployed to Cloud Run
- [ ] `lisf-agent` — Agente LISF regulatorio (Claude SDK, FastAPI, GCP) — WAIT until public URL is live
- [ ] `pension-simulator` — Simulador pensión IMSS + Fondo Bienestar (R Shiny, Ley 73/97)
- [ ] `flight-analytics` — Análisis de vuelos SQL (PostgreSQL, 2.5GB, aerolíneas rusas)
- [ ] `eruption-forecasting` — Pronóstico de erupciones volcánicas (ARIMA, séries de tiempo, UNAM)
- [ ] `b-tree-explorer` (implementation) — concept post `b-trees-optimization.md` exists; this one is about the Rust + WASM build itself
- [ ] `insurance-pricing-ml` project card — blog posts (ES + EN) exist since 2026-03-14 but the project card in `src/data/projects.ts` is still missing

---

## Blog Posts to Review

Posts that exist but need content alignment or structural fixes.

- [ ] `proust-attention-machine.md` — accent fixes done 2026-03-15; review framing and whether it reflects your actual perspective on what the project taught you about LLMs
- [ ] `soa-probability-foundations.md` — accent fixes done; check tone is professional insight, not study guide
- [ ] `insurance-claims-dashboard.md` — currently a stub that redirects to `data-analyst-portfolio`; decide: expand into standalone post or remove and redirect
- [ ] `analytics-dashboards.md` — same situation as above

---

## Screenshots to Add

Files go in `public/screenshots/`. None of these exist yet.

- [ ] `actuarial-suite.png`
- [ ] `cartera-autos.png` — Shiny dashboard Resumen tab (pending Cloud Run deploy + screenshot capture)
- [ ] `proust-attention.png` — generated text sample or training loss curve
- [ ] `pension-simulator.png` — Shiny app UI
- [ ] `lisf-agent.png` — chatbot answering a LISF question (do after URL is live)
- [ ] `b-tree-explorer.png` — WASM visualization running in browser
- [ ] `flight-analytics.png` — SQL results or delay analysis chart
- [ ] `eruption-forecasting.png` — ARIMA forecast plot

---

## Links to Fix

Confirmed broken or placeholder URLs in `src/data/projects.ts`.

- [ ] `lisf-agent` — URL is `#`; expose GCP VM port publicly then update
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
| `pension-simulator` | Yes (R Shiny) | No | Blog post, screenshot |
| `lisf-agent` | Yes | No (VM only, port closed) | Public URL, then blog post + screenshot |
| `b-tree-explorer` | Partial (WASM status unknown) | No | Screenshot, optional impl blog post |
| `flight-analytics` | Yes (SQL analysis) | No | Blog post, screenshot |
| `eruption-forecasting` | Yes (Python notebooks) | No | Blog post, screenshot |
