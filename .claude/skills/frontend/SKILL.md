# /frontend -- Portfolio Design System Enforcer

## Purpose
Generate and modify Astro components/pages for GonorAndres.github.io while strictly enforcing the visual identity. This portfolio belongs to an actuary and data analyst -- the design must feel **personal, warm, and intentional**, never like a template.

## Palette (MANDATORY -- no other colors)
| Token       | Hex       | Usage                        |
|-------------|-----------|------------------------------|
| cream       | #FFF8F0   | Page backgrounds             |
| navy        | #1B2A4A   | Body text, dark sections     |
| amber       | #D4A574   | Accents, decorative elements |
| terracotta  | #C17654   | CTAs, warm highlights        |
| sage        | #7A8B6F   | Secondary text, tags, badges |

Any Tailwind class referencing a color NOT in this table is a build error. Fix immediately.

## Typography
- **Headings**: `font-serif` (Lora) -- always
- **Body**: `font-sans` (Inter) -- always
- Fonts are self-hosted in `public/fonts/` as woff2. No Google Fonts CDN links.

## Layout Anti-Patterns (REJECT these)
1. **Uniform 3-card grids** -- Never render N items in identical equal-width columns. Use asymmetric grids with `col-span-2`, `row-span-2`, varied card sizes (standard/tall/wide).
2. **Centered-everything** -- Avoid centering all section headings and content blocks. Offset headings with `md:ml-8`, `md:mr-16`, `md:text-right` to create visual rhythm.
3. **Generic hero** -- No stock-photo hero, no massive centered headline with two centered buttons. Use asymmetric grid (7-col + 4-col offset), organic blobs, staggered fade-ups.
4. **Cookie-cutter sections** -- Each section must feel different: alternate dark/light backgrounds, vary heading alignment (left, right-aligned, offset), use decorative SVGs between sections.
5. **Empty whitespace without texture** -- Use `OrganicBlob` and `Squiggle` components between and within sections. They add organic warmth.
6. **Blue/purple/gradient defaults** -- Only the 5-color palette above. No `bg-blue-*`, `text-purple-*`, or CSS gradients with off-palette colors.

## Layout Identity Patterns (ENFORCE these)
- **Asymmetric grids**: `grid-cols-12` with unequal column spans
- **Offset text blocks**: Headings with `md:ml-12` or `md:mr-16`
- **Decorative SVG blobs**: `<OrganicBlob>` placed with `absolute` positioning, low opacity (0.15-0.3), large size (300-500px)
- **Squiggly dividers**: `<Squiggle>` between sections instead of plain `<hr>`
- **Staggered animations**: `.fade-up` class on elements, triggered by IntersectionObserver
- **Card variants**: ProjectCard accepts `variant="standard|tall|wide"` -- always mix them in grids
- **Dark/light alternation**: Skills section uses `bg-navy text-cream`, other sections use `bg-cream text-navy`

## Component Inventory
| Component | Path | Notes |
|-----------|------|-------|
| BaseLayout | `src/layouts/BaseLayout.astro` | Wraps all pages, includes Header+Footer |
| BlogPost | `src/layouts/BlogPost.astro` | Blog post layout with prose styles |
| Header | `src/components/layout/Header.astro` | Sticky, backdrop-blur, mobile menu |
| Footer | `src/components/layout/Footer.astro` | Dark navy, 3-col grid |
| LanguageSwitcher | `src/components/layout/LanguageSwitcher.astro` | Toggles /en/ prefix |
| Hero | `src/components/sections/Hero.astro` | Asymmetric, blobs, no stock photo |
| FeaturedProjects | `src/components/sections/FeaturedProjects.astro` | Asymmetric grid, all 11 projects |
| Skills | `src/components/sections/Skills.astro` | Dark section, offset 2-col |
| Education | `src/components/sections/Education.astro` | Timeline with dot indicator |
| Contact | `src/components/sections/Contact.astro` | Card-style links |
| ProjectCard | `src/components/ui/ProjectCard.astro` | 3 variants: standard/tall/wide |
| BlogPostPreview | `src/components/ui/BlogPostPreview.astro` | Blog listing card |
| CategoryBadge | `src/components/ui/CategoryBadge.astro` | Sage rounded pill |
| WarmButton | `src/components/ui/WarmButton.astro` | Primary/secondary CTA |
| OrganicBlob | `src/components/decorations/OrganicBlob.astro` | 4 path variants, color + opacity |
| Squiggle | `src/components/decorations/Squiggle.astro` | Wavy SVG line divider |

## i18n
- Spanish = root `/`, English = `/en/`
- Translations in `src/i18n/es.ts` and `src/i18n/en.ts`
- Use `t(lang, 'key')` for UI strings
- Content collections use `lang` field to filter

## Blog Categories
- `actuaria-para-todos`
- `proyectos-y-analisis`
- `herramientas`
- `mercado-mexicano`

## When generating new components or pages:
1. Import from the existing component inventory first
2. Never introduce colors outside the palette
3. Always add `.fade-up` to content blocks
4. Place at least one `OrganicBlob` per section for texture
5. Vary heading alignment -- don't center everything
6. If adding a new grid, make it asymmetric
7. Use `Squiggle` between major sections
8. Spanish content first, English second
9. Test with `npm run build` -- zero errors required

## Checklist before submitting any frontend change:
- [ ] No off-palette Tailwind classes
- [ ] No uniform equal-column grids
- [ ] Headings are NOT all centered
- [ ] At least one decorative SVG element present
- [ ] `.fade-up` on content that should animate in
- [ ] Both `/` and `/en/` routes work
- [ ] `npm run build` passes with zero errors
