# CV -- LaTeX sources

Sources for Andrés González Ortega's CV, versioned alongside the portfolio site so the
CV wording and `src/data/projects.ts` stay in sync.

```bash
./build.sh may_2026.tex               # current base
./build.sh may_2026/d1_insurance.tex  # one variant
./build.sh --all may_2026             # the whole cycle
```

Target for every variant: **1 page, 0 overfull boxes**.

Requires TeX Live plus two user-mode packages:

```bash
tlmgr --repository https://ftp.math.utah.edu/pub/tex/historic/systems/texlive/2023/tlnet-final/ \
  install fontawesome5 sourcesanspro
```

## Layout

| Path | Contents |
|---|---|
| `may_2026.tex` + `may_2026/` | Current cycle: base + 13 canonical role variants |
| `april_2026.tex` + `april_2026/` | Previous cycle |
| `archive/` | Older months |
| `awesome-cv.cls`, `qr_portfolio.png` | Build dependencies |
| `CLAUDE.md` | Full editorial rules: narrative, style, ATS, skill integrity |

## This repo is public

Compiled PDFs, job postings, employer-specific variants and exam proofs are **gitignored
and must stay that way**. They live in the private `GonorAndres/claude-job` repo. Read the
first section of `CLAUDE.md` before adding files here.

The public CV PDF is served from the Drive permanent link that `src/components/sections/Hero.astro`
and `Contact.astro` point at.
