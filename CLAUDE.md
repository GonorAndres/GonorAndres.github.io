# Portfolio Project Guidelines

## Git Workflow -- NEVER Push to Main Directly

**NEVER push commits directly to `main`.** All changes go through pull requests.

- Work is always done on a feature branch (e.g. `march2`, `fix/something`)
- To "deploy", open a PR from the feature branch into `main` and let the user merge it
- The only exception is if the user explicitly says "push to main" in that specific message
- This applies even when the user asks to "deploy" or "go live" -- create a PR, don't push

## Session Start Checklist

At the start of every session, read `to-do.md` in the repo root before proposing or starting any work.
It tracks: missing blog posts, missing screenshots, broken/placeholder links, and development status for the 8 priority projects.
Update `to-do.md` when tasks are completed (check off items, add new ones as discovered).

## Core Narrative -- Emerges from the Work, Never Stated

The portfolio's message is never declared explicitly. No section, paragraph, or sentence should say "I'm learning," "I know what I don't know," or any variation of "although I lack X, I have Y." The reader arrives at their own conclusions by moving through the projects, posts, and notes.

Guidelines for all content:
- Show the work. The reader infers the rest.
- The natural arc of honest technical writing is: real problem, approach, failure, understanding why it failed, retry with adjustments, satisfactory result. Not every post needs every step, but when the work involved iteration, show it. That's what makes the writing credible.
- Different content carries different weight. Some posts (pension-simulator, SIMA, regulation-agent) naturally show the full arc. Others (math-visualizations, b-trees) are tools posts and don't need to carry narrative.
- The blog is also a resource for others, not just a portfolio showcase. Study guides (SOA posts) help readers learn; that purpose is valid on its own.

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
- **Blog post descriptions: problem, approach, implication**: The `description` field in blog frontmatter follows three beats: (1) the real-world problem, (2) the key approach with only the most important technical terms, (3) what that approach makes possible. Present tense. Don't list every tool or technique; name only the ones that matter most and explain what they enable. Save raw numbers and full stack details for the post body.
  - Wrong: "This post explains why RAG is the right approach for regulatory documents."
  - Wrong (too many technical terms): "...FTS5 con BM25 ponderado, grafo de referencias cruzadas, palabras clave enriquecidas por pipeline Sonnet/Opus, backend FastAPI en GCP..."
  - Wrong (LinkedIn-style hook): "Over a thousand articles. Two laws. One Ctrl+F that fails you when it matters most. This project builds the search infrastructure Mexican actuarial regulation needed." Avoid punchy, inspirational, or engagement-bait phrasing.
  - Right: "Interpretar la LISF y la CUSF exige navegar entre artículos que se referencian mutuamente entre leyes. Este agente usa RAG para indexar cada artículo con un grafo de referencias cruzadas, eliminando las alucinaciones de citas y permitiendo que el modelo razone solo sobre texto real de la ley. El resultado es un asistente que amplifica la memoria del actuario sin sustituir su criterio."

## Blog Posts from Academic Work

When converting academic notes to blog posts:
1. Reframe the motivation (real-world problem, not course requirement)
2. Add context the original didn't have (regulatory, market, practical applications)
3. Include sensitivity analysis if the original lacks it
4. Connect to other portfolio projects
5. Add a "what I'd do differently" or "next steps" section
6. Link the original PDF as supplementary material, not as the main content

## PDFs: Content to NOT Share Standalone

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
   lastModified: "2026-03-21"  # optional, add when editing an existing post
   ---
   ```
   - `category` must be one of: `actuaria-para-todos`, `fundamentos-actuariales`, `proyectos-y-analisis`, `herramientas`, `mercado-mexicano`
   - `lang` must match the directory (`es` or `en`)
   - `date` format: `YYYY-MM-DD` as a quoted string. **This is the publication date and must NEVER be changed after a post is first published.**
   - `lastModified`: optional. When editing an existing post, add or update this field with today's date (`YYYY-MM-DD`). Internal metadata only, not displayed in UI.

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
