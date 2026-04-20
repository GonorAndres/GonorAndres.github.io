import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://GonorAndres.github.io',
  integrations: [tailwind(), mdx(), react()],
  output: 'static',
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
    '/notes': '/artifacts',
    '/notes/': '/artifacts/',
    '/notes/[slug]': '/artifacts/[slug]',
    '/notes/categoria/[cat]': '/artifacts/categoria/[cat]',
    '/en/notes': '/en/artifacts',
    '/en/notes/': '/en/artifacts/',
    '/en/notes/[slug]': '/en/artifacts/[slug]',
    '/en/notes/categoria/[cat]': '/en/artifacts/categoria/[cat]',
  },
});
