# Deployment and branching model

This repository has two hosts and three kinds of environment. Production and
development never share infrastructure, so a broken dev build cannot take
gonor.me down.

## Environments

| Environment | Branch | Host | URL | Indexed by search engines |
|---|---|---|---|---|
| Production | `main` | GitHub Pages | https://gonor.me | Yes |
| Development | `dev` | Cloudflare Pages | https://gonorpage-dev.pages.dev | No |
| Local | working tree | `astro dev` | http://localhost:4321 | n/a |

Cloudflare builds **only** `dev`. Every other branch, including `main` and any
`feature/*` branch, is invisible to Cloudflare: no build, no URL, no dashboard
row (`preview_deployment_setting: none`). This keeps the dashboard to one
deployment at a time and removes the recurring cleanup of orphaned preview
deployments left behind by deleted branches. The tradeoff: a feature branch has
no isolated preview of its own; test it by merging into `dev` first.

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
4. Feature branches are still fine to use for an isolated diff, but Cloudflare
   will not build them — there is no preview URL for a branch other than `dev`.
   Merge it into `dev` however you like, including a plain fast-forward, then
   check it on the dev URL.
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

## How Cloudflare Pages is wired

The Pages project is `gonorpage-dev`, connected to `GonorAndres/GonorPage`
through Cloudflare's **GitHub App** (Git integration), not through a GitHub
Actions workflow. Consequences worth knowing:

- **There are no Cloudflare secrets in this repository.** Nothing to rotate, no
  `CLOUDFLARE_API_TOKEN` in GitHub Actions secrets. Cloudflare pulls the code
  itself and builds it on its own runners.
- Build settings live in the Cloudflare dashboard, not in this repo. Current
  values: build command `npm run build`, output directory `dist`, root
  directory empty, production branch `dev`, **preview deployments disabled**
  (`preview_deployment_setting: "none"`), PR comments enabled (moot while
  preview deployments are off).
- **Only `dev` is built.** No other branch — `main`, any `feature/*` branch,
  anything — triggers a Cloudflare build, produces a URL, or shows up in the
  Pages dashboard. This was a deliberate simplification: an earlier setup built
  every branch as a "Preview" (including `main`, redundantly, since it's
  already served by GitHub Pages) and left orphaned deployments behind every
  time a feature branch was deleted. If a feature branch needs checking,
  merge it into `dev` and look at the dev URL.
- Because the settings are outside version control, this table is the record of
  them. If you change them in the dashboard, update this file in the same PR.
- **Builds are fully automatic.** Every push to `dev` redeploys
  `gonorpage-dev.pages.dev`. Nothing is triggered by hand, and no GitHub
  Actions workflow is involved. A build normally finishes in one to two
  minutes.

### The dev URL is public

A Pages deployment is reachable by anyone who knows its URL, and
`gonorpage-dev.pages.dev` is a fixed, guessable address. `X-Robots-Tag: noindex`
keeps it out of search results; it is not access control. Treat anything pushed
to `dev` as published. To actually restrict it, put a Cloudflare Access policy
in front of the hostname from the Zero Trust dashboard; the free tier covers a
single-user policy. That is not configured today.

To inspect or change the project from the CLI (the API token already lives in
this machine's environment):

```bash
npx wrangler pages project list
npx wrangler pages deployment list --project-name gonorpage-dev
```

### Old dev deployments accumulate too

With preview deployments off, the only new rows are from pushes to `dev`
itself, but each push still leaves the previous one behind as history — it
just doesn't get rebuilt or served, only the newest does. The dashboard's
"Production" tag on a row means it was built from `dev`, not that it's the
deployment currently being served.

To clean up old ones, delete by ID:

```bash
npx wrangler pages deployment list --project-name gonorpage-dev
npx wrangler pages deployment delete <deployment-id> --project-name gonorpage-dev --force
```

or via the API (`DELETE /accounts/{account_id}/pages/projects/gonorpage-dev/deployments/{id}?force=true`).
Keep the current live deployment; deleting an old one has no effect on
production or on `dev` itself, since Cloudflare rebuilds from the branch on the
next push regardless.

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
