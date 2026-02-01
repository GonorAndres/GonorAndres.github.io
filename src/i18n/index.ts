import es from './es';
import en from './en';
import type { Lang } from './ui';

const translations = { es, en } as const;

export function t(lang: Lang, key: keyof typeof es): string {
  return translations[lang][key] ?? key;
}

export { getLangFromUrl, useTranslatedPath, defaultLang, languages } from './ui';
export type { Lang } from './ui';
