import type { Lang } from '../i18n/ui';

export const categories = [
  'actuaria-para-todos',
  'proyectos-y-analisis',
  'herramientas',
  'mercado-mexicano',
] as const;

export type Category = (typeof categories)[number];

export const categoryLabels: Record<Lang, Record<Category, string>> = {
  es: {
    'actuaria-para-todos': 'Actuaria para todos',
    'proyectos-y-analisis': 'Proyectos y analisis',
    'herramientas': 'Herramientas',
    'mercado-mexicano': 'Mercado mexicano',
  },
  en: {
    'actuaria-para-todos': 'Actuarial for everyone',
    'proyectos-y-analisis': 'Projects & analysis',
    'herramientas': 'Tools',
    'mercado-mexicano': 'Mexican market',
  },
};
