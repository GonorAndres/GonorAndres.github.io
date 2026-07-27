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
push  ──►  dev  ──PR──►  main  ──► gonor.me
            │             │
            │             └── deploy.yml: build + Playwright gate + GitHub Pages
            └── Cloudflare Pages rebuilds gonorpage-dev.pages.dev on every push
```

There is exactly one pull request in this model, and it is `dev` → `main`.
Everything before that is ordinary pushing.

Rules, in order of importance:

1. **Never push directly to `main`.** Production changes arrive only through a
   pull request. Enforced by the `main is production` repository ruleset.
2. **A PR into `main` may only come from `dev`.** Enforced by
   `.github/workflows/guard-main.yml`, which fails the check on any other head
   branch. Merging `feature/x` straight into `main` would skip the dev
   environment, which is the whole point of having one.
3. **Pushing straight to `dev` is fine and expected.** No PR, no review, no
   ceremony. Cloudflare rebuilds the dev environment on every push, so the way
   you check your work is to push and reload the dev URL. `dev` is deliberately
   unprotected.
4. Feature branches remain available and are still built by Cloudflare, but they
   are optional: use one when you want a preview that does not disturb the dev
   environment, or when you want a diff to look at before it lands. Merge it
   into `dev` however you like, including a plain fast-forward.
5. `dev` may be ahead of production, but it is not a scratch branch: it should
   always build. If `dev` is red, fix it before opening `dev` → `main`. Nothing
   enforces this, which is exactly why it is written down.

### Everyday work

```bash
git checkout dev && git pull
# ... work ...
git commit && git push
```

Then reload https://gonorpage-dev.pages.dev after a minute or two.

### Promoting dev to production

```bash
git checkout dev && git pull
gh pr create --base main --head dev --title "Release: <summary>"
```

Then check that `PR into main must come from dev` passes, and merge. Merging is
the deploy: `deploy.yml` runs on push to `main`, builds the site, runs the
Playwright deploy-gate tests, and publishes `dist/` to GitHub Pages only if they
pass.

### Optional: an isolated preview

```bash
git checkout dev && git pull
git checkout -b preview/<something>
git push -u origin preview/<something>
```

Cloudflare builds it at `https://preview-<something>.gonorpage-dev.pages.dev`,
and comments the URL on any PR you open from it.

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
  branches **except `main`**, PR comments enabled.
- **`main` is explicitly excluded from Cloudflare builds**
  (`preview_branch_excludes: ["main"]`). Without this, Cloudflare treats `main`
  as just another branch and builds it as a "Preview" deployment, since `dev`
  (not `main`) is the project's production branch. That produces a second,
  publicly reachable, purposeless copy of production content — gonor.me is
  already served by GitHub Pages, not Cloudflare. If `main` starts appearing in
  the Pages deployment list again, check this setting first.
- Because the settings are outside version control, this table is the record of
  them. If you change them in the dashboard, update this file in the same PR.
- **Builds are fully automatic.** Every push to `dev` redeploys the dev
  environment; every push to any other branch produces a preview deployment.
  Nothing is triggered by hand, and no GitHub Actions workflow is involved in
  either. A build normally finishes in one to two minutes.

### Preview and dev URLs are public

A Pages deployment is reachable by anyone who knows its URL. The dev
environment is at a fixed, guessable address, branch previews are at
`https://<branch>.gonorpage-dev.pages.dev`, and Cloudflare posts those URLs as
comments on pull requests in a public repository.

`X-Robots-Tag: noindex` keeps them out of search results; it is not access
control. Treat anything pushed to a branch as published. To actually restrict
them, put a Cloudflare Access policy in front of the preview and dev hostnames
from the Zero Trust dashboard; the free tier covers a single-user policy. That
is not configured today.

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
