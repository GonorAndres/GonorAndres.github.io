# Portfolio Project Guidelines

## Session Start Checklist

At the start of every session, read `to-do.md` in the repo root before proposing or starting any work.
It tracks: missing blog posts, missing screenshots, broken/placeholder links, and development status for the 8 priority projects.
Update `to-do.md` when tasks are completed (check off items, add new ones as discovered).

## Content Tone -- NEVER Homework Style

When writing or editing any content for this portfolio (blog posts, project descriptions, section text):

- NEVER use assignment framing: "the objective was...", "the professor asked...", "for this project we had to..."
- ALWAYS lead with the problem and why it matters in the real world
- ALWAYS include limitations, assumptions chosen and WHY, and what you'd do differently with more data/time
- ALWAYS end technical pieces with a "so what" -- what decision does this analysis support?
- When describing actuarial work, reference regulatory context (CNSF, LISF, CUSF) where applicable
- When presenting models, include sensitivity analysis or at minimum acknowledge what parameters drive uncertainty

## Connection Between Projects

Every project should reference at least one other project in the portfolio where relevant. The portfolio tells a story -- isolated pieces look like coursework, connected pieces look like a body of work.

Key connections to maintain:
- Michoacan mortality data <-> life insurance pricing
- Data cleaning methodology <-> any project involving data preparation
- Quantitative finance (Black-Scholes/FRA/IRS) <-> portfolio optimization
- A/B testing decision framework <-> credit model (both are decision-making under uncertainty)
- SIMA engine <-> all insurance technical notes (SIMA is the implementation of the theory)

## Blog i18n Filename Convention

All blog posts MUST use the **English slug** as the filename in both `src/content/blog/es/` and `src/content/blog/en/`. The LanguageSwitcher toggles URLs by adding/removing the `/en` prefix, so both language versions of a post must produce the same slug.

- Correct: `es/welcome.md` + `en/welcome.md` (same filename, Spanish content inside the ES file)
- Wrong: `es/bienvenida.md` + `en/welcome.md` (different filenames = 404 on language switch)

The title, description, and body content are fully localized -- only the filename must match.

## Notes / Shared PDFs Metadata

Every note in `src/data/notes.ts` must include:
- `createdDate: string` -- YYYY-MM-DD format, sourced from the Google Drive file's `createdTime` field.
- `version: string` -- sourced from the Google Drive file's `version` field (internal revision counter that increments on every save).

Both fields are fetched via the Drive API v3. The API requires the `x-goog-user-project` header set to the GCP project ID:
```bash
TOKEN=$(gcloud auth application-default print-access-token)
PROJECT=$(gcloud config get-value project)
curl -s "https://www.googleapis.com/drive/v3/files/{FILE_ID}?fields=name,createdTime,version" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-goog-user-project: $PROJECT"
```

When adding a new note:
1. Upload the PDF to the appropriate MisApuntes subfolder in Google Drive
2. Fetch `createdTime` and `version` via the API call above
3. Fill in `keywords` (5 terms per language, SEO-oriented)
4. Set `relatedNotes` to at least one other note slug

When updating an existing note's PDF, re-fetch the `version` field from Drive to keep it in sync.

The version and creation date are displayed on individual note pages (`/notes/[slug]/`).

## Writing Standards

- **No double-dash em-dashes**: Never use `--` as punctuation in blog posts or descriptions. This is a known AI writing pattern and reads unnaturally. Instead, use proper punctuation: commas, semicolons, colons, or restructure the sentence. For example:
  - Wrong: "Not formulas to memorize -- the mental toolkit an actuary uses"
  - Right: "Not formulas to memorize, but the mental toolkit an actuary uses"
  - Right: "Not formulas to memorize; they are the mental toolkit an actuary uses"
- **Spanish diacritics are mandatory**: Every Spanish text (blog posts, descriptions, i18n strings, data files) MUST use proper accents (á, é, í, ó, ú) and tildes (ñ). Missing accents change meaning ("año" vs "ano", "está" vs "esta", "cómo" vs "como") and make the portfolio look unprofessional. When writing or editing Spanish content, always verify accents on: words ending in -ción/-sión, interrogatives (qué, cómo, cuál, dónde, cuándo), past tense verbs (empezó, decidió, construí), and common words (más, también, aquí, así, México, análisis).
- Bilingual: all major content should exist in both ES and EN
- Professional but accessible -- imagine the reader is a hiring manager at an insurance company or consultancy who has 2 minutes
- Technical depth is good but must serve a point, not just demonstrate you can do math
- Every PDF or document linked should have a 2-3 sentence description explaining what it demonstrates and what skills it shows

## Blog Posts from Academic Work

When converting academic notes to blog posts:
1. Reframe the motivation (real-world problem, not course requirement)
2. Add context the original didn't have (regulatory, market, practical applications)
3. Include sensitivity analysis if the original lacks it
4. Connect to other portfolio projects
5. Add a "what I'd do differently" or "next steps" section
6. Link the original PDF as supplementary material, not as the main content

## Session Log -- 2026-02-02

### What Was Done
- Explored Google Drive (G:\Mi unidad\PortafolioPDF and G:\Mi unidad\01_educacion\Apuntes\MisApuntes) via PowerShell from WSL
- Read and assessed all PDFs for portfolio relevance
- Created "Notas para Compartir" / "Worth Sharing Notes" section with 7 documents: Black-Scholes/FRA/IRS exam, Delhi time series, A/B testing (ES+EN), GLM actuarial models, Black-Scholes log-normal, parametric returns fitting, volcanic eruption forecasting
- Added 3 DataCamp certificate links under Education section
- Created English blog category route (was missing, caused 404s on /en/blog/categoria/)
- Fixed English blog index category links (pointed to wrong URL pattern)
- Added email to Contact section, changed to 2x2 grid layout
- Updated hero: name split into two lines (Andres / Gonzalez Ortega), personalized description
- Adjusted background color to #EDE6DD with header contrast at #E8E0D7
- Changed GMM Explorer from recreational to academic category
- Cleaned footer: removed duplicate contact links, added academic folder + apuntes sueltos Drive links
- Created docs/portfolio-review-recommendations.md with full honest assessment
- Created project-level CLAUDE.md with content guidelines
- All descriptions written in hook-style prose, not homework tone

### Current State
- Branch: new-design (2 commits pushed to origin)
- Homepage sections: Hero -> Projects (12) -> SharedNotes (7) -> Skills -> Education (+ certs) -> Contact -> Footer
- Blog: 1 post per language + interactive math visualizations page + category routes for ES and EN
- All Drive PDF links are direct file links (not folder links)

### Known Issues
- Node 18.19.1 (system default) is too old for Astro 5 -- must use `nvm use 22` before dev/build
- The `new-design` branch has not been merged to main yet

## Session Log -- 2026-02-07

- Added editorial blog styling and rewrote Proust Attention Machine post as personal essay
- Added bilingual blog post for Proust Attention Machine project

## Session Log -- 2026-02-15

- Fixed blog language switcher 404s: stripped es/en directory prefixes from slugs in route files and BlogPostPreview
- Renamed es/bienvenida.md to es/welcome.md to enforce shared English slug convention
- Added "Blog i18n Filename Convention" section to CLAUDE.md
- All blog posts now use matching filenames across languages so the LanguageSwitcher works correctly

## Session Log -- 2026-02-18

### What Was Done
- **DiscoverPostCard**: Created `src/components/ui/DiscoverPostCard.astro` -- shows random (build-time shuffled) blog posts excluding the 3 newest. Added below LatestPostCard in Hero with `md:flex-col md:gap-4` stacking. i18n keys: `hero.discoverPosts` in both langs.
- **SOA blog post Drive links**: Added "Material de estudio" / "Study materials" sections to all 6 SOA blog post files (3 ES + 3 EN) with Google Drive download links to study PDFs.
- **Uploaded exam_p_reference.pdf to Drive**: Uploaded `/home/andtega349/soa_exams/p/exam_p_reference.pdf` as `exam_p_basic_guide_v2.pdf` to MisApuntes/SOA_P__resources folder.
- **Google Drive API access established**: Set up persistent ADC credentials with Drive scope on this VM. See agent memory `drive-files.md` for full Drive file ID mapping.
- **SharedNotes reorganization**: Expanded from 7 flat notes to 10 notes organized in 3 categories (Actuarial 4, Quant Finance 3, Statistics 3). Added `NoteCategory` type, `getNotesByCategory()` function, and category group rendering in `SharedNotes.astro`. New notes added: SOA Exam P v2 reference, Eve's Law, Lee-Carter Mortality.
- **Agent memory**: Created `MEMORY.md` and `drive-files.md` in agent memory directory with project context and Drive ID mappings.

### Files Modified
- `src/i18n/es.ts`, `src/i18n/en.ts` -- added `hero.discoverPosts` and `sharedNotes.cat.*` keys
- `src/components/ui/DiscoverPostCard.astro` -- NEW
- `src/components/sections/Hero.astro` -- added DiscoverPostCard import and flex-col wrapper
- `src/components/sections/SharedNotes.astro` -- category-grouped rendering
- `src/data/notes.ts` -- 10 notes with category system, `getNotesByCategory()`
- `src/content/blog/{es,en}/soa-probability-foundations.md` -- added study materials section
- `src/content/blog/{es,en}/soa-random-variables-insurance.md` -- added study materials, removed broken local PDF link
- `src/content/blog/{es,en}/soa-multivariate-clt.md` -- added 5 study material links

## Session Log -- 2026-03-05

### What Was Done
- **Scanned `data-analyst-path/projects/`**: Assessed 7 projects (00-06). Two completed (00-demo Airbnb CDMX, 01-insurance-claims), one in progress (02-ecommerce), four planned only.
- **Added insurance-claims project to portfolio**: New entry in `src/data/projects.ts` with slug `insurance-claims`, category `actuarial`, variant `wide`. GitHub URL as primary link; TODO comment for deployed dashboard URL once live.
- **Created blog posts**: ES + EN blog post pair at `src/content/blog/{es,en}/insurance-claims-dashboard.md` covering reserving methodology, findings, and dashboard features.
- **Cross-references updated**: SIMA and GMM Explorer now link back to `insurance-claims` via `relatedTo`.
- **Added analytics-dashboards project to portfolio**: Airbnb CDMX + Olist E-Commerce dual dashboard. New entry in `src/data/projects.ts` with slug `analytics-dashboards`, category `data-science`, variant `wide`. GitHub URL; TODO for deployed URL.
- **Created blog posts for analytics dashboards**: ES + EN blog post pair at `src/content/blog/{es,en}/analytics-dashboards.md`. Editorial angle: why React (Next.js + Recharts) beats traditional BI tools for production-grade analytical reports.

### Pending / In Progress
- **Deploy insurance dashboard**: Next.js + FastAPI dashboard needs deployment (Vercel + Cloud Run or similar). Once live, update `url` in projects.ts and change `platform` from `'GitHub'` to `'Vercel'` or `'GCP'`.
- **Airbnb CDMX + Olist project (00-demo)**: Added to portfolio as `analytics-dashboards`. Deploy pending -- once live, update `url` in projects.ts and change `platform` to `'Vercel'`.
- **E-commerce cohort analysis (02)**: In progress (notebook 01 started, Streamlit scaffold exists). Not portfolio-ready yet.
- **Projects 03-06**: Planned only, no code. 03 (A/B test) overlaps existing portfolio project. 05 (financial tracker) overlaps Markowitz.

### data-analyst-path Repository
- Repo: `https://github.com/GonorAndres/data-analyst-path`
- All projects under `projects/` directory
- Shared architecture: Next.js 14 + FastAPI backend with proxy pattern, Recharts, dark/light mode

## Future Scope

### Blog Posts: use blog-writer agent for all of these
Invoke with: "use blog-writer to write a post about [slug or topic]"

#### Cards exist, blog post missing
- [ ] `lisf-agent`: Claude SDK + LISF regulatory chatbot. Also needs public GCP URL in projects.ts (currently `#`).
- [ ] `b-tree-explorer`: Rust + WASM visualization. Concept post done (b-trees-optimization); this one should focus on the implementation itself.
- [ ] `flight-analytics`: PostgreSQL airline delay analysis. GitHub: https://github.com/GonorAndres/learning-posgre
- [ ] `eruption-forecasting`: Time series volcanic forecasting. GitHub: https://github.com/GonorAndres/forecasting
- [ ] `actuarial-suite`: 6-phase Python actuarial library. GitHub: https://github.com/GonorAndres/Analisis_Seguros_Mexico
- [x] `cartera-autos`: Synthetic auto insurance portfolio. GitHub: https://github.com/GonorAndres/CarteraSeguroAutos — DONE 2026-03-19
- [ ] `proust-attention`: Transformer trained on Proust. GitHub: https://github.com/GonorAndres/proust-attention
- [ ] `pension-simulator`: IMSS + Fondo Bienestar R Shiny app. GitHub: https://github.com/GonorAndres/seguridad-social

#### Concept / actuarial posts (high priority)
- [ ] Life insurance technical note: rewrite from homework tone, add regulatory context (LISF/CUSF)
- [ ] Property insurance technical note: same treatment, CNSF data angle
- [ ] Michoacan demographic analysis: connect mortality tables to life insurance pricing
- [x] GMM Explorer: pricing methodology breakdown -- DONE 2026-03-21

#### Other posts
- [ ] Research article: non-technical summary of data science internship paper
- [ ] SOA exam P: frame as professional insight on probabilistic thinking, not study guide

### Project improvements
- [ ] `lisf-agent`: expose GCP VM port publicly, update url in projects.ts
- [ ] `data-analyst-portfolio`: update url when dashboards are deployed (currently links to blog post)
- [ ] Redo Markowitz in Python: scipy.optimize efficient frontier + VaR comparison
- [ ] SIMA web platform: Phase 2 engine done, needs frontend
- [ ] TIIE/CETES interactive dashboard: Banxico API

### Low Priority
- [ ] Mortality table visualizer: interactive CONAPO/INEGI explorer
- [ ] Concave vs Convex and Evolution of Probability: could become blog posts with more context

### Content to NOT Share Standalone
- Amortizador/Instrucciones_Examen.pdf (exam instructions, not original work)
- Formulario_MetodosCuantitativosParcial1.pdf (cheat sheet)
- Covarianza_Regresion.pdf (2-page proof, too brief)
- EticaActuarialEnsayo.pdf (opinion essay, not technical)

## Session Log -- 2026-03-14

### What Was Done
- **Created blog posts for insurance pricing ML project**: ES + EN pair at `src/content/blog/{es,en}/actuarial-ml-pricing.md`. Editorial angle: cross-border analysis of what European ML pricing techniques mean for Mexico's 70% uninsured auto market. Covers frequency-severity decomposition, GLM vs GBM comparison, SHAP explainability, fairness audits, and regulatory comparison (CNSF vs EU AI Act).
- **Cross-references**: Links to insurance-claims-dashboard (reserving is backward-looking, pricing is forward-looking), SIMA (regulatory layer), GMM Explorer (severity distribution).
- **Source**: Project lives in `data-science-path` repo at `projects/insurance-pricing/`. Academic PDFs in `docs/references/`.

### Pending
- **Add `insurance-pricing-ml` project card to `src/data/projects.ts`**: slug `insurance-pricing-ml`, category `actuarial` or `data-science`, variant `wide`. GitHub URL: `https://github.com/GonorAndres/data-science-path/tree/main/projects/insurance-pricing`. Once dashboard is deployed, update URL.
- **Deploy pricing dashboard**: Next.js (port 3060) + FastAPI (port 2060). Same Cloud Run pattern as other dashboards.

## How to Add a Blog Post

1. **Pick an English slug** for the filename (e.g. `credit-risk-model`). Both languages use the same filename.

2. **Create two files** with identical names:
   - `src/content/blog/es/<slug>.md` -- Spanish content
   - `src/content/blog/en/<slug>.md` -- English content

3. **Frontmatter** (required fields):
   ```yaml
   ---
   title: "Your Title Here"
   description: "2-3 sentence summary."
   date: "2026-03-01"
   category: "proyectos-y-analisis"
   lang: "es"
   tags: ["optional", "tags"]
   ---
   ```
   - `category` must be one of: `actuaria-para-todos`, `fundamentos-actuariales`, `proyectos-y-analisis`, `herramientas`, `mercado-mexicano`
   - `lang` must match the directory (`es` or `en`)
   - `date` format: `YYYY-MM-DD` as a quoted string

4. **Write the body** in standard Markdown. For inline HTML (buttons, styled links), use inline `style=""` attributes -- Tailwind classes are purged from markdown content.

5. **Verify**: run `npx astro build` from the project root. The new post should appear in the page count.

The post will automatically show up in:
- The blog index (`/blog/` and `/en/blog/`)
- Its category page (`/blog/categoria/<category>/`)
- The "Latest posts" card in the Hero section (if it's recent enough)
- The language switcher will work as long as both filenames match

## Claude Code Agents (`.claude/agents/`)

Five persistent agents are defined for periodic maintenance. Claude auto-delegates based on task context, or you can invoke them by name.

- **data-architect** -- Maintains `src/data/` (projects, notes, skills, education, categories). Use when adding/editing/removing data entries or updating TypeScript interfaces.
- **project-organizer** -- Manages how projects appear to visitors: categories, grid layout, narrative order, visual prominence, cross-project connections. Use when rethinking project display or adding new categories.
- **blog-organizer** -- Maintains the blog section: adding posts, managing categories, fixing structure, ensuring ES/EN parity. Use when creating blog posts or fixing blog issues.
- **blog-writer** -- Writes new blog posts from scratch (project slug, topic, or source material). Drafts both ES and EN versions with natural, honest voice. Use when you want to go from "I have this project/topic" to two ready-to-publish markdown files.
- **code-quality** -- Handles SEO, accessibility, performance, bug fixes, TypeScript safety, and dead code removal. Use for technical health checks, meta tag updates, or fixing broken behavior.

All agents save work reports to `subagents_outputs/`.

## Local Testing with Playwright MCP

After making changes, use the Playwright MCP browser tools to verify rendering before committing:

1. Build the site: `npx astro build` (must pass with no errors)
2. Start preview: `npx astro preview --host 0.0.0.0` (runs on port 4321)
3. Use `mcp__playwright__browser_navigate` to load `http://localhost:4321/`
4. Use `mcp__playwright__browser_snapshot` to inspect the DOM (better than screenshots for verifying text content, links, and structure)
5. Use `mcp__playwright__browser_click` to expand sections (e.g., "Ver todos los proyectos" button) and verify new project cards
6. Navigate to specific pages (`/blog/<slug>/`, `/en/blog/<slug>/`) to verify blog post rendering
7. Check for: KaTeX math rendering issues (currency `$` signs parsed as math), broken links, missing i18n keys, correct category badges
8. Kill the preview server when done: `pkill -f "astro preview"`

Common issue: `$` followed by a digit in blog prose (e.g., `$10`, `$400`) gets parsed as inline math by remark-math. Fix by escaping: `\$10`, `\$400`. Actual math expressions like `$p = 1.5$` should NOT be escaped.

## Project Categories

- `actuarial`: terracotta (#C17654)
- `data-science`: sage (#7A8B6F)
- `data-engineering`: steel blue (#5B7B9A)
- `quant-finance`: amber (#D4A574)
- `applied-math`: navy (#1B2A4A)

Adding a new category requires changes in: `src/data/projects.ts` (type), `src/components/ui/ProjectsGrid.tsx` (accent, badge, gradient, icon), `src/i18n/es.ts` + `en.ts` (translation key), `src/components/sections/FeaturedProjects.astro` (labels object).

## Technical Preferences

- Framework: Astro 5 + Tailwind + React islands + MDX
- Deployment: GitHub Pages (GonorAndres.github.io)
- i18n: ES (default, no prefix) / EN (/en/)
- Blog categories: actuaria-para-todos, fundamentos-actuariales, proyectos-y-analisis, herramientas, mercado-mexicano
- Color palette: cream (#EDE6DD), header (#E8E0D7), navy (#1B2A4A), amber (#D4A574), terracotta (#C17654), sage (#7A8B6F), steel blue (#5B7B9A)
- Fonts: Lora (headings), Inter (body)

## File Organization

- PDFs for download go in public/docs/
- Blog content in src/content/blog/es/ and src/content/blog/en/
- Subagent outputs go to repositorio/subagents_outputs/
- Planning and reference docs go in docs/
