import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
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
  }),
});

export const collections = { blog };
