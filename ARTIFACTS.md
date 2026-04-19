# Artifacts

Pattern for embedding self-contained HTML artifacts (interactive pieces, scrollytelling, visualizations) into the portfolio. This doc locks the convention so future artifacts integrate predictably.

Two distinct concepts share the `/artifacts/` URL prefix — keep them straight:
- **Catalog routes** (`/artifacts/`, `/artifacts/<note-slug>/`, `/artifacts/categoria/<cat>/`) — Astro-generated pages that list entries from `src/data/notes.ts` and show metadata.
- **Live artifact files** (`/artifacts/<folder>/index.html`) — static HTML served from `public/artifacts/`. The folder name lives in the same namespace as the note slugs, so make sure folder names and note slugs NEVER collide. Convention: use the note slug as the folder name too, so the launch URL `/artifacts/<slug>/` and the detail URL `/artifacts/<slug>/` are the same page (not a conflict — it means the static `index.html` in `public/` overrides the Astro-generated one for that slug if they collide). For current artifacts this is NOT the case (note slug `bias-variance-tradeoff`, asset folder `yuminari-bow`), so the detail page and the live artifact are at separate URLs.

## What counts as an artifact

An artifact is a single HTML file that:
- Stands on its own (self-contained, no build step, external JS only for fonts/analytics if needed)
- Has a distinct aesthetic that may differ completely from the portfolio's
- Lives in the portfolio repo and is served as a static page
- Is listed in the notes index like any other note, but typed `'artifact'` instead of `'note'`

Example: `public/artifacts/yuminari-bow/index.html` — the bias-variance scrollytelling piece.

## Folder convention

```
public/artifacts/<slug>/index.html
```

- `<slug>` matches the note's `slug` field in `src/data/notes.ts` (kebab-case, unique, stable — don't rename after publishing)
- Exactly one `index.html` per artifact folder; any supporting assets (images, fonts) go alongside it
- URL served: `https://<site>/artifacts/<slug>/`

## Registering the artifact in notes.ts

Add an entry to `src/data/notes.ts` with `type: 'artifact'` and an internal URL (must start with `/`):

```ts
{
  slug: 'bias-variance-tradeoff',
  category: 'stats',           // 'actuarial' | 'quant' | 'stats'
  type: 'artifact',            // <-- this is what flips the UI affordances
  createdDate: '2026-04-18',
  version: '1',
  title:       { es: '...', en: '...' },
  description: { es: '...', en: '...' },
  urls: [
    { label: { es: 'Abrir artefacto', en: 'Open artifact' }, url: '/artifacts/bias-variance-tradeoff/' },
  ],
  tags:     { es: [...], en: [...] },
  keywords: { es: [...], en: [...] },
  relatedNotes: [...],
}
```

What `type: 'artifact'` changes in the UI, automatically:
- The note card shows an `Interactivo / Interactive` chip next to the category badge
- Internal URLs get a launch icon (arrow) instead of a download icon, and open in the same tab
- The note detail page renders `Artefacto interactivo / Interactive artifact` as the section header
- Portfolio-side links append `?lang=es|en` so the artifact can auto-match the visitor's language

## Required inside every artifact

Two contracts every artifact HTML must honor. Both are aesthetic-agnostic — they don't impose a look, they just guarantee the visitor can return home and reads content in their language.

### 1. Universal back-pill

A fixed top-left pill linking back to the portfolio notes index. Neutral design (white translucent, thin border, monospace-ish system font) so it reads as browser chrome regardless of the artifact's aesthetic. Copy this block verbatim into any new artifact:

```html
<!-- At the start of <body>, above all other content -->
<a href="/artifacts/" class="artifact-home" id="artifactHome" aria-label="Back to portfolio">
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
  <span class="lang-en">Portfolio</span>
  <span class="lang-es">Portafolio</span>
</a>
```

```css
/* In <style> */
.artifact-home {
  position: fixed;
  top: 14px;
  left: 18px;
  z-index: 210;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px 6px 11px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #1f1f1f;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(10px) saturate(1.2);
  -webkit-backdrop-filter: blur(10px) saturate(1.2);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease;
}
.artifact-home:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}
.artifact-home:focus-visible { outline: 2px solid #2060df; outline-offset: 2px; }
.artifact-home svg { flex-shrink: 0; opacity: 0.7; }
@media (max-width: 480px) {
  .artifact-home { top: 10px; left: 12px; font-size: 11px; padding: 5px 11px 5px 9px; }
}
@media (prefers-reduced-motion: reduce) {
  .artifact-home, .artifact-home:hover { transition: none; transform: none; }
}
```

Do not restyle the pill per-artifact. Its job is to be consistent across all artifacts so the visitor always recognizes "the way home" even if the artifact's aesthetic is wildly different.

### 2. Language auto-detect

Artifacts that are bilingual must auto-switch language based on where the visitor came from. Portfolio pages append `?lang=es|en` to artifact URLs, and direct visitors can also use the referrer fallback.

Assumes an existing `setLang(lang)` function in the artifact (sets `body.dataset.lang`, updates any toggle UI). Add this block after the toggle init:

```js
// Auto-detect language: ?lang= param > referrer pathname > default
(function detectLang() {
  const params = new URLSearchParams(window.location.search);
  const paramLang = params.get('lang');
  if (paramLang === 'es' || paramLang === 'en') { setLang(paramLang); return; }
  const ref = document.referrer;
  if (!ref) return;
  try {
    const u = new URL(ref);
    if (u.pathname.startsWith('/en/')) setLang('en');
    else if (u.hostname.toLowerCase().includes('gonorandres')) setLang('es');
  } catch (_) {}
})();
```

Also update `setLang` to keep the back-link's href in sync with the current language:

```js
function setLang(lang) {
  document.body.dataset.lang = lang;
  document.documentElement.lang = lang;
  // ... existing toggle UI updates ...
  const home = document.getElementById('artifactHome');
  if (home) home.href = lang === 'en' ? '/en/artifacts/' : '/artifacts/';
}
```

## Adding a new artifact — checklist

1. Place the HTML at `public/artifacts/<slug>/index.html`
2. Add the universal back-pill (HTML + CSS) at the top of `<body>`
3. Wire language auto-detection + back-link href sync into the artifact's JS
4. Confirm the artifact is self-contained (no relative paths pointing outside its folder)
5. Add a note entry in `src/data/notes.ts` with `type: 'artifact'`, a URL starting with `/artifacts/<folder>/`, and bilingual metadata
6. Run `npm run build` — confirm the detail page builds at `/artifacts/<slug>/`
7. Test manually:
   - Open `/artifacts/<folder>/?lang=es` → Spanish renders
   - Open `/artifacts/<folder>/?lang=en` → English renders
   - Click through from `/artifacts/` (ES catalog) → artifact opens in ES
   - Click through from `/en/artifacts/` → artifact opens in EN
   - Click the back-pill → returns to the correct locale of the artifacts catalog
   - Resize to 390px → pill remains visible and tappable
   - Enable `prefers-reduced-motion` → no transforms on hover

## Aesthetic freedom vs. contract

Each artifact is its own world — the portfolio does not impose colors, typography, or layout on artifacts. The contract is narrow:

- Back-pill (always neutral, always top-left)
- Language behavior (auto-detect + toggleable)
- Self-contained delivery (one folder, no external build pipeline)

Everything else — the viz, palette, typography, copy voice, motion design — is free to match the artifact's subject.

## Current artifacts

| Slug                      | Category | Folder                                     | Aesthetic                            |
|---------------------------|----------|--------------------------------------------|--------------------------------------|
| `bias-variance-tradeoff`  | stats    | `public/artifacts/yuminari-bow/`           | Sumi-e ink on washi paper, Latin-only |
| `greedy-split-search`     | stats    | `public/artifacts/greedy-node/`            | Cream panels, serif prose, amber accents |

*(Update this table when adding new artifacts.)*
