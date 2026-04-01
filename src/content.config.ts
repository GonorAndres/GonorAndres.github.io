import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.enum([
      'actuaria-para-todos',
      'fundamentos-actuariales',
      'proyectos-y-analisis',
      'herramientas',
      'mercado-mexicano',
    ]),
    lang: z.enum(['es', 'en']),
    tags: z.array(z.string()).optional(),
    lastModified: z.string().optional(),
  }),
});

export const collections = { blog };
