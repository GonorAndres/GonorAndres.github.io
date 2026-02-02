# Portfolio Review & Recommendations

## Core Problems Identified

### 1. Homework Tone
Most actuarial notes and academic reports read like assignment submissions following a professor's rubric. They lack independent analysis, assumption justification, and real-world contextualization. A recruiter at an insurance company or consultancy will recognize this immediately.

**What "homework tone" looks like:**
- "Se calculo la prima neta usando la formula..." (just applying a formula)
- No discussion of WHY certain assumptions were chosen over alternatives
- No sensitivity analysis (what if mortality +10%? what if interest rate drops?)
- No comparison to how the product would actually work in the Mexican market
- No mention of CNSF, LISF, or any regulatory framework

**What "professional tone" looks like:**
- "We selected Gompertz mortality because the insured population is 25-65; for younger cohorts, Makeham would be more appropriate because..."
- Sensitivity tables showing premium changes under stress scenarios
- References to actual regulatory requirements the product would need to meet
- Discussion of limitations and what additional data would improve the analysis

### 2. No Connection Between Projects
Each project exists in isolation. The Michoacan mortality tables don't connect to life insurance pricing. The Black-Scholes work doesn't connect to the portfolio optimization. The data cleaning exercise doesn't feed into any model. This makes the portfolio look like a collection of unrelated assignments rather than a coherent body of work.

**How to fix this:**
- The Michoacan mortality analysis should feed into the life insurance technical note (price the product using state-specific vs national mortality)
- The data cleaning methodology should be referenced when discussing data preparation in the credit model or time series project
- The quantitative finance report (Black-Scholes, FRA, IRS) should connect to the portfolio optimization (derivatives as hedging tools for portfolio risk)
- The A/B testing project should reference the credit model as another example of decision-making under uncertainty

---

## Specific Weaknesses by Area

### Actuarial Work
| Gap | Why It Matters |
|---|---|
| No reserving project (chain-ladder, Bornhuetter-Ferguson) | Reserving is the most common entry-level actuarial task in Mexico |
| No CNSF/regulatory context in any insurance note | Shows disconnect from professional practice |
| No sensitivity analysis on any pricing model | Every real actuarial report includes this |
| Collective insurance note is too brief | Needs loss distribution justification and experience data discussion |

### Data & Programming
| Gap | Why It Matters |
|---|---|
| Zero projects using real Mexican data (CNSF, Banxico, INEGI, CONAPO) | Mexican employers want to see you can work with local data sources |
| R skills have weak evidence (only Delhi time series) | DataCamp certificates without substantial R projects look hollow |
| No end-to-end pipeline (raw data -> model -> business recommendation) | Shows you can do pieces but not the full workflow |
| Excel-only portfolio optimization in 2026 | Contradicts Python/R skills claim on CV |

### Positioning
| Issue | Impact |
|---|---|
| Profile sits between "data analyst" and "actuary" without committing | Dilutes both narratives |
| No blog content beyond welcome post | Blog system exists but is empty -- looks abandoned |
| Future plans doc has 5 ambitious projects but zero are started | Plans without execution don't help |

---

## Recommendations (Prioritized)

### Quick Wins -- Improve Existing Content

1. **Add sensitivity analysis to each insurance technical note**
   - Vary mortality (+/- 10%, 20%), interest rate (+/- 1%, 2%), expenses (+/- 15%)
   - Present results in a table showing premium impact
   - Add 1 paragraph of interpretation per scenario

2. **Connect Michoacan mortality to life insurance pricing**
   - Use the mortality tables from the demographic analysis as input to the life insurance note
   - Compare premiums: Michoacan-specific vs EMSSA-2009 vs national CONAPO
   - This turns two school assignments into one meaningful actuarial analysis

3. **Rewrite project descriptions to remove homework tone**
   - Replace "the professor asked us to..." / "the objective of this assignment was..." framing
   - Lead with the problem and why it matters
   - End with limitations and what you'd do differently

4. **Redo Markowitz portfolio in Python**
   - scipy.optimize for efficient frontier
   - Compare parametric VaR vs historical VaR vs Monte Carlo VaR
   - Keep the Excel version as supplementary material

### Medium Effort -- New Content

5. **Build a reserving project with public CNSF data**
   - Download siniestralidad/development triangles from CNSF
   - Apply chain-ladder and Bornhuetter-Ferguson
   - Compare methods and discuss which is more appropriate for which lines
   - This single project would be more impressive than half the current portfolio for Mexican actuarial employers

6. **Create one project using Banxico or INEGI real data**
   - Example: model Mexican inflation vs pension fund real returns
   - Or: analyze TIIE term structure and build a simple yield curve model
   - This directly maps to the TIIE/CETES dashboard in future-plans.md

7. **Write the GMM Explorer blog post**
   - Already planned in future-plans.md, content exists in your head
   - Demonstrates bilingual technical communication
   - Creates the "actuary who can explain" narrative

### Strategic

8. **Pick a lane or explicitly show both tracks**
   - If targeting actuarial roles: prioritize items 1, 2, 5, and SIMA
   - If targeting data science roles: prioritize a stronger ML project and the end-to-end pipeline
   - If both: organize the portfolio with clear sections for each track

---

## Drive Resources -- Organization

### "Worth Sharing Notes" Section (homepage)
Documents ready to feature with description + Drive link:
- Black-Scholes, Portfolio, FRA, IRS report -- strong quantitative finance work
- Delhi Temperature Time Series -- clean R analysis
- A/B Testing summaries (ES + EN) -- bilingual, professional format
- Data Cleaning CDMX Debt report -- practical methodology

### Blog Posts (need rewriting from homework to professional tone)
- Nota Tecnica Seguro de Vida + Presentacion + Calculo Primas -> 1 blog post
- Nota Tecnica Seguro Danos + Presentacion -> 1 blog post
- Nota Tecnica Seguro Colectivo -> 1 blog post
- Analisis Demografico Michoacan -> 1 blog post (connect to life insurance pricing)

### Education Subsection (certificate download links)
- Associate Data Analyst (SQL) -- DataCamp
- Associate Data Scientist R -- DataCamp
- Data Scientist in R -- DataCamp

### Google Sheets (link to Drive alongside parent project)
- All .gsheet files linked as supplementary material in their respective blog post or project page

### Skip
- Amortizador/Instrucciones_Examen.pdf -- exam instructions, not your work
- desktop.ini files -- system files, ignore
