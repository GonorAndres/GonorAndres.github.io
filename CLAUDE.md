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

## Technical Preferences

- Framework: Astro 5 + Tailwind + React islands + MDX
- Deployment: GitHub Pages (GonorAndres.github.io)
- i18n: ES (default, no prefix) / EN (/en/)
- Blog categories: actuaria-para-todos, proyectos-y-analisis, herramientas, mercado-mexicano
- Color palette: cream (#FFF8F0), navy (#1B2A4A), amber (#D4A574), terracotta (#C17654), sage (#7A8B6F)
- Fonts: Lora (headings), Inter (body)

## File Organization

- PDFs for download go in public/docs/
- Blog content in src/content/blog/es/ and src/content/blog/en/
- Subagent outputs go to repositorio/subagents_outputs/
- Planning and reference docs go in docs/
