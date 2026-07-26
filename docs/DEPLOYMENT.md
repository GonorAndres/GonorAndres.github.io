# Deployment and branching model

This repository has two hosts and three kinds of environment. Production and
development never share infrastructure, so a broken dev build cannot take
gonor.me down.

## Environments

| Environment | Branch | Host | URL | Indexed by search engines |
|---|---|---|---|---|
| Production | `main` | GitHub Pages | https://gonor.me | Yes |
| Development | `dev` | Cloudflare Pages | https://gonorpage-dev.pages.dev | No |
| Preview | any other branch / PR | Cloudflare Pages | `<hash>.gonorpage-dev.pages.dev` | No |
| Local | working tree | `astro dev` | http://localhost:4321 | n/a |

## The only path to production

```
feature/*  ──PR──►  dev  ──PR──►  main  ──► gonor.me
   │                 │              │
   │                 │              └── deploy.yml: build + Playwright gate + GitHub Pages
   │                 └── Cloudflare Pages: stable dev URL
   └── Cloudflare Pages: per-PR preview URL, posted as a PR comment
```

Rules, in order of importance:

1. **Never push directly to `main`.** Production changes arrive only through a
   pull request.
2. **A PR into `main` may only come from `dev`.** Enforced by
   `.github/workflows/guard-main.yml`, which fails the check on any other head
   branch. Merging `feature/x` straight into `main` would skip the dev
   environment, which is the whole point of having one.
3. **Never push directly to `dev` either, once work is non-trivial.** Branch off
   `dev`, open a PR, look at the preview URL, then merge.
4. `dev` is disposable in the sense that it may be ahead of production, but it
   is not a scratch branch: it should always build. If `dev` is red, fix it
   before opening `dev` → `main`.

### Promoting dev to production

```bash
git checkout dev && git pull
gh pr create --base main --head dev --title "Release: <summary>"
```

Then check that both `Guard main` and `Deploy to GitHub Pages` pass, and merge.
Merging is the deploy: `deploy.yml` runs on push to `main`, builds the site,
runs the Playwright deploy-gate tests, and publishes `dist/` to GitHub Pages.

### Starting new work

```bash
git checkout dev && git pull
git checkout -b feature/<something>
# ... work ...
gh pr create --base dev --head feature/<something>
```

Cloudflare comments the preview URL on the PR within a couple of minutes.

## How Cloudflare Pages is wired

The Pages project is `gonorpage-dev`, connected to `GonorAndres/GonorPage`
through Cloudflare's **GitHub App** (Git integration), not through a GitHub
Actions workflow. Consequences worth knowing:

- **There are no Cloudflare secrets in this repository.** Nothing to rotate, no
  `CLOUDFLARE_API_TOKEN` in GitHub Actions secrets. Cloudflare pulls the code
  itself and builds it on its own runners.
- Build settings live in the Cloudflare dashboard, not in this repo. Current
  values: build command `npm run build`, output directory `dist`, root
  directory empty, production branch `dev`, preview deployments enabled for all
  branches, PR comments enabled.
- Because the settings are outside version control, this table is the record of
  them. If you change them in the dashboard, update this file in the same PR.

To inspect or change the project from the CLI (the API token already lives in
this machine's environment):

```bash
npx wrangler pages project list
npx wrangler pages deployment list --project-name gonorpage-dev
```

## Why dev is not indexed

`public/_headers` sends `X-Robots-Tag: noindex, nofollow` for every path.
Cloudflare Pages honours `_headers`; GitHub Pages does not implement it and
serves the file as an inert static asset. So the same commit is noindexed on
`gonorpage-dev.pages.dev` and fully indexable on `gonor.me`, with no build-time
branching.

This also means the canonical URLs and `sitemap-index.xml` generated on dev
still point at `https://gonor.me`, because `site` in `astro.config.mjs` is a
constant. That is intentional: dev exists to check rendering and behaviour, not
to be a second public copy of the site. Do not submit the dev URL to any search
console.

**If production ever moves to Cloudflare Pages**, remove or scope the
`_headers` rule before switching, or gonor.me will be deindexed.

## Analytics in dev

GA4 and PostHog are disabled on localhost by the code itself. On Cloudflare, the
`PUBLIC_POSTHOG_KEY` environment variable is deliberately left unset, so
PostHog does not initialise and dev traffic never pollutes production metrics.
The variable is set only in GitHub Actions, from repository secrets, for the
production build.

## Repository files that implement this

| File | Role |
|---|---|
| `.github/workflows/deploy.yml` | Production: build, test gate, publish to GitHub Pages on push to `main` |
| `.github/workflows/guard-main.yml` | Rejects any PR into `main` that does not come from `dev` |
| `public/_headers` | Keeps Cloudflare (dev/preview) out of search indexes |
| `playwright.ci.config.ts` | The deploy-gate test suite run before production publishes |
| `docs/DEPLOYMENT.md` | This document |
