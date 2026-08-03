# CLAUDE.md -- CV

Guidance for Claude Code when working inside `cv/`.

## What This Is

LaTeX sources for Andrés González Ortega's CV -- actuarial science graduate from UNAM (Facultad de Ciencias). Primary language is Spanish; English variants mirror the ES content. Each month forks the previous month (e.g. `may_2026.tex` forked `april_2026.tex`).

This folder holds **sources only**. It is versioned inside the portfolio site repo so the CV and the portfolio stay in sync -- the same projects, the same wording, one place to edit.

### THIS REPO IS PUBLIC

`GonorAndres.github.io` is a public GitHub repo. Everything committed under `cv/` is world-readable. Consequences:

- **Never commit compiled PDFs.** `.gitignore` excludes `cv/**/*.pdf`. The public CV lives on the Drive permanent link; that is the only PDF anyone should be handed.
- **Never commit job postings** (`*_job.md`), **application emails**, **cover letters**, or **any variant named after an employer**. Which companies Andrés applied to is private. Those live in the private `claude-job` repo (see below).
- **Never commit exam proofs, transcripts, or interview prep.** `docs/preliminar_soa.pdf` and similar stay private.
- Contact details (email, phone, portfolio links) inside the `.tex` are fine -- they already appear on the public CV PDF and on the live site.

If a task needs any of the above, do it in the private repo, not here.

### Private counterpart

`github.com/GonorAndres/claude-job` (private) holds the working material that must not be public: compiled PDFs, job postings, employer-specific variants, application emails, validation reports, SOA proofs, interview prep. It stays as the private workbench. This folder is a curated copy of the reusable sources.

## Bootstrap on a new machine

```bash
# TeX Live (Debian/Ubuntu)
sudo apt install texlive-latex-recommended texlive-fonts-recommended texlive-lang-spanish
# The two user-mode packages the preamble needs:
tlmgr --repository https://ftp.math.utah.edu/pub/tex/historic/systems/texlive/2023/tlnet-final/ install fontawesome5 sourcesanspro

# Smoke test
cd cv && ./build.sh may_2026.tex
# Expect: 1 page, 0 overfull warnings.
```

## Professional Identity -- Key Differentiators (May 2026)

These are Andrés's core differentiators. Every CV variant should signal them through evidence, not through trait claims:

1. **Continuous learning, documented** -- He doesn't just learn; he publishes what he learns (blog, production projects, technical notes). The website IS the evidence. Never claim "aprendo rapido" -- show the blog with 22 bilingual posts and 25+ live projects.
2. **Production-ready mindset** -- Projects are not notebooks or exercises; they run on GCP with CI/CD, tests, and live URLs. The pipeline goes from raw data to deployed API. Highlight deployed systems, not POCs.
3. **Optimization and cost-consciousness** -- The GCP platform at <$10/mo vs $2,000+ conventional is the canonical example. He designs for efficiency and defends trade-offs with numbers.
4. **Risk, contingent scenarios, and stress testing** -- Actuarial foundation applied beyond insurance: Monte Carlo, VaR/TVaR, Weibull renewal processes for rare events, pandemic-impact quantification on mortality drift. Not just "I know risk" -- he models tail events.
5. **Multi-disciplinary interests and collaboration** -- Iterates with marketing/web/operations at Grupo Gigante, co-authors with geophysicists at IGF-UNAM, builds tools for non-technical users (LISF Agent, Pension Simulator). The CV should show range without scattering focus.
6. **Organized and systematic** -- 240 automated tests on SIMA, 52 pytest on the data platform, star-schema warehouse design, Pydantic-validated APIs. Signal through structure, not by saying "soy organizado."

**CV language rule**: convert each differentiator into a concrete fact or project outcome. Never write the trait name; write the evidence that implies it.

## Narrative Guideline

The CV shows the work and lets the reader draw conclusions. It never states "I'm a fast learner," "I know how to find the right tools," or any explicit claim about character or potential.

- **Project descriptions are problem-first, in a problem -> solution paradigm with intuitive phrasing that a non-technical reader can follow**. Each bullet has two halves joined by a period:
   1. **The problem**, stated as a short everyday observation -- what goes wrong if you don't solve it, or why the obvious approach fails. Use plain language with concrete images (a correo, una cirugía, una red, manos que tocan el dato), not jargon. Examples: *"Los modelos de riesgo tratan a cada cliente como si estuviera solo, pero los clientes se respaldan entre sí."* / *"No cuesta lo mismo una consulta que una cirugía, pero la industria los mete en un mismo precio."* / *"Un dato tarda más mientras más manos lo tocan."* / *"Al probar dos versiones de algo, la forma de leer el resultado cambia cuál gana."*
   2. **The solution**, stated as what the project actually does in plain Spanish -- also readable by a non-technical stakeholder. End with the tools/keywords only in italic at the very end. Do NOT sprinkle tech names, acronyms, or `\hl{}` highlights inside the prose. Examples: *"Dibuja el portafolio como red de conexiones y revela grupos de riesgo que no se ven uno por uno. Python, Neo4j."* / *"Separa 5.1 millones de reclamaciones en tres niveles de gravedad y estima un precio para cada uno. Python, Next.js."* / *"Automatiza el recorrido del evento al tablero para que los equipos vean información fresca. GCP, Python."*

   Rules:
   - Lead with the pain the project removes, not the tool.
   - Narrative in plain Spanish; a recruiter without a DS background should get it on first read.
   - **Use each project's native domain vocabulary, not generic placeholders.** Plain language != generic language. The nouns inside the bullet should be the real things the project touches -- that's what signals competence and keeps the description specific. Swap generic words for their domain counterpart:
     - Credit / risk -> *préstamo, garantías cruzadas, concentración accionaria, cartera, exposición*. Not *cuenta, cliente, evento*.
     - Insurance platforms / pipelines -> *siniestro, aviso, colisión menor, robo total, tarifa, reservas, prima*. Not *evento, dato, insight, tablero*.
     - Health/GMM pricing -> *consulta médica, cirugía, reclamación hospitalaria, prima pura, frecuencia-severidad*. Not *caso, evento, registro*.
     - Retail / customer analytics -> *cohorte de compras, conversión, ticket, propensión, campaña, CRM*. Not *usuario, cliente*.
     - Data engineering -> name the real input (*siniestro, vuelo, transacción, sesión web*) and the real output (*modelo de tarifa, reporte regulatorio, tablero de operación*). Not *evento -> insight*.
     The problem and solution halves should each contain at least one concrete domain noun; otherwise the bullet reads as a stock template that any analyst could have written.
   - Keywords (languages, frameworks, cloud, libraries) appear **only at the end** in italic, 2-4 items. No mid-sentence tool drops, no `\hl{}` on inline tech names.
   - `\hl{}` can still highlight a concrete *result* number (e.g., `\hl{13x-1,300x}`) or a domain anchor that the reader needs to notice (e.g., `\hl{A/B}` in a customer analytics context), but use sparingly.
   - No generic LinkedIn copy, no jargon soup, no feature-list bullets.

   Canonical wordings live in `../src/data/projects.ts` (same repo, one level up) and on the live site at `https://gonor.me/#proyectos` -- start from those for the domain vocabulary, then translate the phrasing to plain language before using.
- **"Sobre mí"** is a professional summary, first-person throughout ("Soy…", "He construido…", "Escribo…"). Ban: "Me apasiona…", motivation statements, anything that reads like a cover-letter opening.
- **Highlight the outliers, not the expected**. Reserves and pricing are standard for an actuary. A transformer on Proust, a GCP data platform, and a RAG agent over regulation are not.

## Directory Layout

```
cv/
  CLAUDE.md                # this file
  README.md
  build.sh                 # compile helper (2 passes + overfull/page check)
  awesome-cv.cls           # class file
  qr_portfolio.png         # QR for header

  may_2026.tex             # current base
  may_2026/                # current cycle variants (13 canonical)
  april_2026.tex           # previous base
  april_2026/              # previous cycle variants (13 canonical + 4 legacy generics)
  archive/                 # older months (agosto, feb_2026, march_2026 + generics)
```

Compiled PDFs, `.aux`/`.log`, job postings and employer variants are gitignored -- see the public-repo section above.

## Role Variants

| File | Target | Habilidades emphasis |
|---|---|---|
| `<month>.tex` (A1) / `occ_general.tex` (OCC) | BASE -- general OCC | **Ciencia Actuarial leads (2nd bullet), packed**: Tarificación (GLM, frecuencia-severidad, credibilidad), Reservas (BEL, IBNR, Chain Ladder, BF), Lee-Carter, RCS/SCR bajo LISF/CUSF, EMSSA-09, Reaseguro, CONAPO/HMD, Pensiones IMSS |
| `a2_general_en.tex` | EN general | Same as A1 in English |
| `b1_data_scientist.tex` / `b2_en` | Data Scientist / ML | DS & ML first; actuarial last |
| `c1_risk_management.tex` / `c2_en` | Risk Analyst / Quant Risk | Riesgo Cuantitativo second line |
| `d1_insurance.tex` / `d2_en` | Actuarial / Insurance | Ciencia Actuarial deep (Whittaker-Henderson, EMSSA-09, Bühlmann-Straub, Ley 73/97, Fondo Bienestar) |
| `e1_data_analyst_de.tex` / `e2_en` | Data Analyst / Data Engineer | Data Engineering second line (Dagster, Beam, Terraform, PySpark, Databricks, DuckDB) |
| `f1_financial.tex` / `f2_en` | Finance / Quant Finance | Finanzas Cuantitativas (Markowitz, Black-Scholes, derivados, cópulas, EVT, series de tiempo) |
| `g1_insurtech.tex` / `g2_en` | Insurtech (May 2026 onward) | Insurance + product/platform engineering |
| `actuarial_analyst_us_insurer.tex` | USI -- actuarial EN for US-parent insurers | Actuarial Science first; credibility/Bühlmann-Straub emphasized |

**What changes per variant:** Sobre mí closing, Habilidades bullet order and content, Proyectos (6 role-matched).
**What stays fixed:** preamble, header (modulo contact-line paragraph break), experience bullets (ATS), education, certs structure.

## CV Sections (order in the base file)

1. **Header** -- name, CDMX, email, phone (+52 55 4834 4672), portfolio link "Mi web(25+ proyectos)", GitHub. QR + date in top-right margin.
2. **Sobre mí** -- professional summary. **Three-part structure (strict)**:
   1. **Fact opening**: UNAM + SOA P + Grupo Gigante + **IGF-UNAM** -- all four in the first sentence. IGF-UNAM co-authorship is a required differentiator and must appear in every variant's opening (it's been missed in past iterations on B1/B2/E1/E2/F1/F2).
   2. **Role hook**: one concrete problem/solution clause naming what the person DOES (pricing, reservas, capital; ML models; quant risk; pipelines; etc.) and ending with tech anchors (model, pipeline, API, dashboard / GCP / LISF / Neo4j).
   3. **Fact+preference split (canonical)** -- then blog close:
      - ES: *"Practico la formación continua y disfruto el trabajo colaborativo con equipos multidisciplinarios. En mi página web comparto lo que aprendo y construyo."*
      - EN: *"I practice continuing formation and enjoy collaborative work with multidisciplinary teams. On my website I share what I learn and build."*
      - Shorter EN variant for tight fits: *"I practice continuing formation and enjoy multidisciplinary collaborative work."*
3. **Experiencia** -- **single-column, dates inline**: `Becario Ciencia de Datos -- Grupo Gigante\quad{\small\color{gray}\textit{Septiembre 2025 -- Presente}}`. Uses `\begin{onecolentry}`, NOT `twocolentry`. **Job title must say "Becario Ciencia de Datos" / "Data Science Intern" (full)** -- never the short form "Becario de datos" / "Data Intern" except in USI where the lead is "Actuarial analyst" and the title is intentionally shortened.
4. **Habilidades** -- 6 bullets. A1/OCC/A2 lead with Ciencia Actuarial as the second bullet (right after Lenguajes). Spoken languages is its own bullet (`\item \textit{Idiomas:} ...` / `\item \textit{Languages:} ...`), not pipe-joined.
5. **Educación** -- one line: `Pasante (100\% de créditos cubiertos); titulación por exámenes profesionales SOA (Society of Actuaries).` EN: `Degree requirements completed (100\% of coursework); graduating via SOA exam track.` **Always escape `%` as `\%`.**
6. **Certificaciones** -- SOA P (Exam P, Aprobado Marzo 2026, linked) + 3 DataCamp certs + Databricks Fundamentals as **separate items**, each with its own link:
   - Associate Data Analyst (DataCamp) -> Drive `1-QUuVH3zPBPsl6RhUvuUWxpZkP1i8TYb`
   - Associate Data Scientist in R (DataCamp) -> Drive `1xVLk15A1LBbyXH1fZnd4eBTaJ4d8FLLO`
   - Data Scientist Professional with R (DataCamp) -> Drive `1Woe6xqxofloFZ9uM2f5VsdGxY-WQWCRI`
   - **Databricks Fundamentals** (Databricks Academy, Abr 2026, no expiry) -> `https://credentials.databricks.com/45f31d0f-ca80-4e3a-80c1-ede89826f6ce`
   FM and SRM removed (scheduled exams != certifications).
7. **Proyectos** -- 6 projects using `twocolentrynarrow` (2.2cm right column for links). Problem-first descriptions.

## Style Rules

### Sobre mí -- banned phrasing (user-authorized overrides)

The general rule against "I'm a fast learner" character claims still holds, but the user has explicitly authorized a **formal professional-development phrasing** in Sobre mí that carries the adaptive-learning signal without the trait claim. Rules:

- **Use**: "Practico la formación continua" / "I practice continuing formation" (fact, verifiable CPD vocabulary).
- **Use**: "disfruto el trabajo colaborativo con equipos multidisciplinarios" / "enjoy collaborative work with multidisciplinary teams" (preference verb + collaboration signal).
- **Reject**: "Aprendo rápido…" / "Me adapto rápido…" / "I learn fast" / "I adapt fast" -- user explicitly rejected both as too casual / too trait-claim.
- **Reject**: "fast learner", "quick learner" (explicit trait claims).
- **Reject**: using "aprender" / "learn" twice in the Sobre mí paragraph -- the blog close already says "comparto lo que aprendo" / "share what I learn", so the soft-skill sentence must use synonyms (colaborativo, multidisciplinary teams, etc.) to avoid word repetition.
- **Reject**: em-dash punctuation (`--`) as sentence connector. Use commas, semicolons, or colons. `-` only for hyphenated compound words (rare-event, RBC-analog, Lee-Carter, IBNR/BEL, etc.).

Blog close (uniform across all canonical variants, never rephrase):
- ES: *"En mi página web comparto lo que aprendo y construyo."*
- EN: *"On my website I share what I learn and build."*

### General

- **First-person throughout Sobre mí**: "Soy", "He construido", "mi página web" -- never third-person. Check every verb when copying across variants.
- **Full month names in Spanish**: Enero, Febrero, …, Diciembre. ES variants never use "Sept" etc.; EN variants use short forms ("Sept 2025") which are fine.
- **Primary color**: RGB(217, 119, 87) -- Claude orange-red (`#D97757`). A few variants have individual colors (USI=blue `#004F90`, OCC=purple `#5C4B8A`).
- **Font**: Source Sans Pro (type1).
- **ATS parsable**: `glyphtounicode` enabled; use `\%` for literal percent; never split ATS-critical strings across `%` line-continuations.
- **Phone**: E.164 href, human-readable display:
  `\hrefWithoutArrow{tel:+525548344672}{...+52 55 4834 4672}`. Do NOT write `tel:+52 55 48344672` -- Workday/Greenhouse drop spaces inside tel: URIs.
- **Project links**: one link per project. Priority: live app > blog > GitHub. Text: "app live" for deployed, "blog" for posts, "repo" for GitHub.
- **Project descriptions**: problem-first, ~150-230 chars, ending with italic tools.
- **Experience entries**: single-column (`onecolentry`), date inline after role as `\quad{\small\color{gray}\textit{DATE}}`. No `twocolentry` for experience anymore.
- **Project entries**: `twocolentrynarrow` with 2.2cm right column for the link. Keep them.
- **Footer**: `Andrés Ortega -- Página X de Y` (ES) / `Page X of Y` (EN). **No variant code** (`[A1] General`, etc.) -- strip before sending.
- **QR block**: anchored at `(paperwidth-0.3cm, paperheight-0.2cm)`, width 1.3cm. Sits in right margin, above the centered header's horizontal reach. Do not move it into a wider position or it will collide with the GitHub link.
- **Compact-preamble variants (b1/c1/d1/e1/f1)**: the header MUST have a blank line between `\textbf{Andrés González Ortega}` and `\vspace{0.15 cm}`, otherwise the contact line renders on the same line as the name.
- **QR image path**: `qr_portfolio.png` in the base files, `../qr_portfolio.png` in variants under `april_2026/` and `may_2026/`.

## LaTeX Environments

| Environment | Purpose |
|---|---|
| `header` | Centered name + contact info |
| `onecolentry` | Full-width block (**used for Experience and Education**) |
| `twocolentrynarrow{link}` | Projects -- 2.2cm right column |
| `twocolentry{right}` | Legacy 4.0cm right column -- still used for Education dates only |
| `highlights` | Indented bullet list |
| `highlightsforbulletentries` | Bullet list without left margin (skills) |

`\vspace{0.02 cm}` between experience entries; project entries have NO vspace between them (inline) to save vertical room.

## Build

```bash
./build.sh may_2026.tex              # base
./build.sh may_2026/d1_insurance.tex # variant
./build.sh --all may_2026            # every .tex in a cycle
```

`build.sh` runs `pdflatex` twice (lastpage needs the second pass), then reports page count and overfull boxes. Verify: **1 page, 0 overfull**. Any overfull > 1pt must be fixed before exporting.

Output PDFs land next to the source and are gitignored. Move the deliverable out of the repo (or into the private `claude-job` checkout) before sending it anywhere.

## Tailoring for Job Postings

Do employer-specific tailoring in the **private** `claude-job` repo, not here. Copy the closest canonical variant out, tailor it there, and keep the posting text with it. Only bring a change back into `cv/` if it improves a canonical variant.

### ATS Pass + Technical Depth

The CV must clear the ATS filter AND survive scrutiny from a technical reviewer.
- **ATS layer**: echo the JD's vocabulary exactly where possible.
- **Technical layer**: name the algorithm, dataset size, regulatory framework, metric. Vague bullets fail technical review even if they pass ATS.

### Skill Integrity Rules (strict)

**Never add a skill not backed by a real project, even if the JD asks for it.** Every keyword must be defensible in interview.

- Reframe real experience in the JD's words -- don't invent tools.
- If a required skill has no backing project, flag to Andrés instead of silently adding it.

### Mexican actuarial job market -- hot keywords (researched April 2026)

**Safe to claim (backed by current projects):**
Tarificación, GLM, GLM Tweedie, frecuencia-severidad, credibilidad (Bühlmann-Straub), Reservas (BEL, IBNR, Chain Ladder, BF), Lee-Carter, Whittaker-Henderson, RCS/SCR, LISF/CUSF, EMSSA-09, Reaseguro, Tablas CONAPO/HMD, Pensiones IMSS (Ley 73, Ley 97, Fondo Bienestar), Procesos de renovación Weibull, SOA P.

**Skip unless/until a project backs them** (all hot in postings but not in Andrés's repo):
- **Prophet / MoSes / GGY AXIS / PathWise** -- vendor valuation software; licensed on the job, not self-taught.
- **IFRS 17 / NIIF 17** -- highest-demand gap. Quick win: add an IFRS 17 mini-module to SIMA (CSM unlocking + LIC/LRC split).
- **Embedded Value / MCEV** -- add EV projection to SIMA.
- **US GAAP / STAT reserves / LDTI** -- narrow employer universe (MetLife, Chubb, AIG subs).
- **Solvency II (Europe)** -- 80% isomorphic to LISF; claim only if targeting European multinationals, and qualify as "LISF/CUSF (Solvency II-inspired)".
- **Options and guarantees / GMxB** -- requires stochastic projection + vendor software.
- **VBA, SAS, Looker Studio** -- pick up only if a specific target requires it.

Adding any of these to the CV breaks the defensibility rule.

## Version Tracking

Permanent public link (never create a new file; always update in place):
https://drive.google.com/file/d/16cdRmnzf0drNv9c5848N6ZedgYX9WhwV/view?usp=drive_link

This is the same ID the site's Hero and Contact CV buttons point at (`../src/components/sections/Hero.astro`, `Contact.astro`). If it ever changes, both components change too.

**Workflow:**
1. Edit `.tex`, compile with `build.sh`.
2. Validate all hrefs (Playwright -- 200 OK).
3. **Ask the user for confirmation** before updating the permanent Drive file. Do NOT auto-push intermediate versions.
4. On explicit approval, update the permanent PDF in place:

```python
from google.auth import default
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
creds, _ = default(scopes=['https://www.googleapis.com/auth/drive'])
service = build('drive', 'v3', credentials=creds)
media = MediaFileUpload('<compiled>.pdf', mimetype='application/pdf')
service.files().update(fileId='16cdRmnzf0drNv9c5848N6ZedgYX9WhwV', media_body=media).execute()
```

- Drive file: `CV_GonzalezAndres.pdf` (ID: `16cdRmnzf0drNv9c5848N6ZedgYX9WhwV`)
- Parent folder: `PortafolioPDF/MisDocumentos/` (ID: `1-QUuVH3zPBPsl6RhUvuUWxpZkP1i8TYb`)

Requires Google Cloud application-default credentials (`gcloud auth application-default login`). Without them, upload the PDF to Drive manually.

## Grupo Gigante ML Context (for retail/e-commerce tailoring)

The internship covers three distinct ML workstreams:

| Workstream | What it is | Surface when targeting |
|---|---|---|
| **Churn** | Classification models per brand | Retail DS/ML |
| **Cross-brand propensity** | Cross-sell/upsell across brands (enabled by identity resolution) | Retail, CRM, customer analytics |
| **Web behavior** | Clickstream and session models | E-commerce, growth, product analytics |

Base bullet covers all three at a high level. For retail-targeted variants, expand explicitly.

**CDP ownership phrasing**: Andrés is an intern -- use "Contribuyo al CDP" / "I contribute to the group's CDP", NOT "Desarrollo el CDP" / "I develop the CDP". Ownership claims raise red flags in tech screens.

## Portfolio Content Map -- now in the same repo

The portfolio site is the single source of truth for project descriptions, skills, certificates, and blog writeups. It now sits one level up, so read it directly:

| Path | Use |
|---|---|
| `../src/data/projects.ts` | Canonical descriptions + live URLs per project |
| `../src/data/skills.ts` | 7 skill groups (bilingual) |
| `../src/data/education.ts` | UNAM degree + certificates with dates |
| `../src/data/notes.ts` | Academic PDF metadata |
| `../src/content/blog/es/` (mirrored in `en/`) | Richest source for CV bullet content -- frontmatter `description` is a 2-3 sentence summary; the body has the full technical narrative |

**When a project's wording changes in `projects.ts`, the CV bullet should follow, and vice versa.** That sync is the reason these live in one repo.

### Priority projects (most solid, prioritize when tailoring)

| Project | Blog (ES) | Key tech |
|---|---|---|
| **SIMA** | `sima.md` | Lee-Carter, BEL, RCS bajo LISF, Python/FastAPI/React/GCP |
| **LISF Agent** | `regulation-agent-rag.md` | RAG over 1,000+ articles, FTS5/BM25, Claude Agent SDK |
| **GMM Explorer** | `gmm-explorer.md` | 5.1M CNSF claims, frequency-severity, credibility, Next.js/Vercel |
| **CreditGraph** | `credit-graph-topological-risk.md` | Neo4j, PySpark/Databricks, LightGBM+Platt. **Describe without metrics** (no AUC, no record counts). |
| **Cartera Autos** | `cartera-autos.md` | GLM pricing, IBNR (Chain Ladder + BF), Monte Carlo VaR/TVaR, fraud, R Shiny |
| **Suite Actuarial** | `actuarial-suite.md` | LISF/RCS/CNSF/EMSSA-09, 4 ramos, Pydantic, Streamlit/GCP |
| **Pension IMSS** | `imss-pension-simulator.md` | R Shiny, Ley 73/97, Fondo Bienestar |
| **DA Portfolio** | (on site) | 7 projects, dashboards, SQL/Python/Streamlit/Power BI |
| **Flight Analytics** | `flight-analytics.md` | Postgres -> BQ ETL, 5.74M rows, WebGL map |
| **Proust** | `proust-attention-machine.md` | **URL slug is `proust-attention-machine`, not `proust-attention`.** Transformer from scratch |
| **Risk Analyst** | `risk-analyst.md` | 13 projects, VaR/CVaR to systemic contagion |
| **Insurance ML Pricing** | `actuarial-ml-pricing.md` | **URL slug is `actuarial-ml-pricing/`, not `insurance-ml-pricing`.** GLM vs XGBoost with SHAP |
| **Data Platform GCP** | `data-engineering-platform.md` | Pub/Sub + Beam, BigQuery, Dagster, Terraform, GLM Tweedie |

### GMM tech stack (standardized)

`\textit{Python, Next.js, Vercel.}` -- NOT "TypeScript, Astro, Vercel" (old template error). Applies to all variants showing GMM.

## Common Pitfalls (learned the hard way)

- **`100%` in LaTeX is a comment marker**. Always write `100\%` or the rest of the line disappears silently.
- **Workday/Greenhouse strip spaces in `tel:` URIs** -- use `tel:+525548344672`, not `tel:+52 55 48344672`.
- **ATS parses the first item of a bulleted line**. Don't `\textbullet`-join multiple certs on one line; split into separate `\item`s.
- **ATS sees programming "Languages" and spoken "Languages" as the same field**. In EN variants rename the programming bullet to "Programming" and keep "Languages" for spoken -- otherwise one overrides the other.
- **The 1.3cm QR will collide with a wide header contact line** if anchored any further left than `paperwidth-0.3cm`. The centered header's right edge caps at ~`paperwidth-3.3cm`, so a 1.3cm QR in the right 0.3-1.6cm zone clears it.
- **Compact-preamble variants need a blank line** between name and contact info in the header block -- otherwise the full contact row sits on the same line as the name.
- **`Bornhuetter-Ferguson` is an unbreakable long word**. Abbreviate to `BF` if a skills line overflows by < 2pt.
- **Scheduled exams are not certifications**. FM and SRM should never appear under Certifications until passed.
- **Drive link on the personal CV is a permanent ID** -- never create a new file, always `files().update(fileId=..., media_body=...)` in place.
- **IGF-UNAM must appear in every variant's Sobre mí opening**. It's the strongest differentiator (co-authored scientific paper on Popocatépetl rare-event modeling) and ATS/HR readers need it in the first sentence. Past validation passes have caught B1/B2/E1/E2/F1/F2 missing it -- always check.
- **"Becario Ciencia de Datos" full title** -- never abbreviate to "Becario de datos" in any variant (except USI which leads with "Actuarial analyst" and can legitimately shorten).
- **Sobre mí word-repeat trap**: the blog close "comparto lo que aprendo / I share what I learn" uses the word `aprender/learn`. Do NOT use `aprender/learn` anywhere else in Sobre mí -- instead use `formación continua`, `colaborativo`, `multidisciplinary teams`.
- **Em-dash `--` as sentence punctuation in Sobre mí is banned**. Use commas, colons, or semicolons. Hyphens inside compound words (Lee-Carter, rare-event, IBNR/BEL) stay.
- **This repo is public.** Before `git add`, check that nothing employer-specific, no PDF, and no exam proof is in the diff.
