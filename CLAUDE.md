# Portfolio Project Guidelines

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

## Writing Standards

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

## Future Scope

### High Priority
1. **Convert actuarial technical notes to blog posts** -- Life insurance, property insurance, collective insurance notes from PortafolioPDF/Escolares/Matematicas_Actuariales. Rewrite from homework tone to professional with sensitivity analysis and regulatory context (see docs/portfolio-review-recommendations.md)
2. **Michoacan demographic analysis blog post** -- Connect the mortality tables to life insurance pricing. This turns two school assignments into one meaningful actuarial analysis
3. **GMM Explorer blog post** -- Technical breakdown of pricing methodology, already planned in docs/future-plans.md
4. **Research article blog post** -- Non-technical summary of data science internship paper

### Medium Priority
5. **Redo Markowitz portfolio in Python** -- Currently Excel-only, should show scipy.optimize efficient frontier + compare VaR methods
6. **SIMA web platform** -- Phase 2 engine complete, needs frontend (see docs/future-plans.md item 5)
7. **Reserving project with CNSF data** -- Chain-ladder and Bornhuetter-Ferguson on public siniestralidad data. Single most impressive project for Mexican actuarial employers
8. **TIIE/CETES interactive dashboard** -- Banxico API, planned in docs/future-plans.md item 1

### Low Priority
9. **Mortality table visualizer** -- Interactive CONAPO/INEGI explorer, planned in docs/future-plans.md item 2
10. **Promote second-tier MisApuntes** -- Concave vs Convex and Evolution of Probability could become blog posts with more context
11. **SOA exam P exercises** -- There's a subfolder with practice material that could become a study resource blog series

### Content to NOT Share Standalone
- Amortizador/Instrucciones_Examen.pdf (exam instructions, not original work)
- Formulario_MetodosCuantitativosParcial1.pdf (cheat sheet)
- Covarianza_Regresion.pdf (2-page proof, too brief)
- EticaActuarialEnsayo.pdf (opinion essay, not technical)

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
   - `category` must be one of: `actuaria-para-todos`, `proyectos-y-analisis`, `herramientas`, `mercado-mexicano`
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

Four persistent agents are defined for periodic maintenance. Claude auto-delegates based on task context, or you can invoke them by name.

- **data-architect** -- Maintains `src/data/` (projects, notes, skills, education, categories). Use when adding/editing/removing data entries or updating TypeScript interfaces.
- **project-organizer** -- Manages how projects appear to visitors: categories, grid layout, narrative order, visual prominence, cross-project connections. Use when rethinking project display or adding new categories.
- **blog-organizer** -- Maintains the blog section: adding posts, managing categories, fixing structure, ensuring ES/EN parity. Use when creating blog posts or fixing blog issues.
- **code-quality** -- Handles SEO, accessibility, performance, bug fixes, TypeScript safety, and dead code removal. Use for technical health checks, meta tag updates, or fixing broken behavior.

All agents save work reports to `subagents_outputs/`.

## Technical Preferences

- Framework: Astro 5 + Tailwind + React islands + MDX
- Deployment: GitHub Pages (GonorAndres.github.io)
- i18n: ES (default, no prefix) / EN (/en/)
- Blog categories: actuaria-para-todos, proyectos-y-analisis, herramientas, mercado-mexicano
- Color palette: cream (#EDE6DD), header (#E8E0D7), navy (#1B2A4A), amber (#D4A574), terracotta (#C17654), sage (#7A8B6F)
- Fonts: Lora (headings), Inter (body)

## File Organization

- PDFs for download go in public/docs/
- Blog content in src/content/blog/es/ and src/content/blog/en/
- Subagent outputs go to repositorio/subagents_outputs/
- Planning and reference docs go in docs/
