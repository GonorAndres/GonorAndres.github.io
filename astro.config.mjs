import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://gonor.me',
  integrations: [
    tailwind(),
    mdx(),
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es', en: 'en' },
      },
    }),
  ],
  output: 'static',
  // Local-only: lets `astro dev`/`astro preview` be reached through the exe.dev
  // HTTPS proxy (https://<vm>.exe.xyz:<port>/). Vite rejects unknown Host
  // headers otherwise. Astro feeds this to both servers, so it must live here
  // and not under `vite.preview`. No effect on the GitHub Pages or Cloudflare builds.
  server: {
    allowedHosts: ['.exe.xyz'],
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-light',
    },
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Legacy /notes/* URLs redirect to /artifacts/* after the 2026-04 rename.
  redirects: {
    '/notes/': '/artifacts/',
    '/notes/[slug]': '/artifacts/[slug]',
    '/notes/categoria/[cat]': '/artifacts/categoria/[cat]',
    '/en/notes/': '/en/artifacts/',
    '/en/notes/[slug]': '/en/artifacts/[slug]',
    '/en/notes/categoria/[cat]': '/en/artifacts/categoria/[cat]',
  },
});
