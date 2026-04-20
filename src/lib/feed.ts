import { getCollection } from 'astro:content';
import type { Lang } from '../i18n';
import { categoryLabels } from '../data/categories';
import type { Category } from '../data/categories';
import { getNotes, noteCategoryLabels } from '../data/notes';

export type FeedKind = 'blog' | 'note' | 'artifact';

export interface FeedItem {
  kind: FeedKind;
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  href: string;
}

const KIND_LABEL: Record<Lang, Record<FeedKind, string>> = {
  es: { blog: 'Blog', note: 'Apunte', artifact: 'Artefacto' },
  en: { blog: 'Blog', note: 'Note', artifact: 'Artifact' },
};

export function kindLabel(lang: Lang, kind: FeedKind): string {
  return KIND_LABEL[lang][kind];
}

export async function getFeedItems(lang: Lang): Promise<FeedItem[]> {
  const posts = (await getCollection('blog')).filter((p) => p.data.lang === lang);
  const blogItems: FeedItem[] = posts.map((p) => {
    const slug = p.id.replace(/^(es|en)\//, '');
    return {
      kind: 'blog',
      slug,
      title: p.data.title,
      description: p.data.description,
      date: p.data.date,
      category: categoryLabels[lang][p.data.category as Category] ?? p.data.category,
      href: lang === 'es' ? `/blog/${slug}/` : `/en/blog/${slug}/`,
    };
  });

  const notes = getNotes(lang);
  const noteItems: FeedItem[] = notes.map((n) => ({
    kind: n.type,
    slug: n.slug,
    title: n.title,
    description: n.description,
    date: n.createdDate,
    category: noteCategoryLabels[lang][n.category] ?? n.category,
    href: lang === 'es' ? `/artifacts/${n.slug}/` : `/en/artifacts/${n.slug}/`,
  }));

  return [...blogItems, ...noteItems].sort((a, b) => b.date.localeCompare(a.date));
}
