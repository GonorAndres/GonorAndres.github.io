import { useState, useMemo } from 'react';

interface NoteUrl {
  label: string;
  url: string;
}

interface NoteData {
  slug: string;
  category: string;
  type: 'note' | 'artifact';
  title: string;
  description: string;
  urls: NoteUrl[];
  tags: string[];
  lang: 'es' | 'en';
}

interface CategoryOption {
  value: string;
  label: string;
}

interface Labels {
  searchPlaceholder: string;
  noResults: string;
  noteSingular: string;
  notePlural: string;
  allCategories: string;
  viewPdf: string;
  details: string;
}

interface Props {
  notes: NoteData[];
  labels: Labels;
  categoryOptions: CategoryOption[];
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function LaunchIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function NoteCard({ note, labels }: { note: NoteData; labels: Labels }) {
  const href = note.lang === 'es' ? `/artifacts/${note.slug}/` : `/en/artifacts/${note.slug}/`;

  return (
    <article className="group p-6 rounded-2xl border border-[#D4A574]/20 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#7A8B6F]/15 text-[#7A8B6F] font-medium">
          {note.category}
        </span>
        {note.type === 'artifact' && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#C17654]/12 text-[#C17654] font-medium border border-[#C17654]/25">
            {note.lang === 'es' ? 'Interactivo' : 'Interactive'}
          </span>
        )}
      </div>
      <h3 className="font-serif text-lg font-bold text-[#1B2A4A] mb-2 group-hover:text-[#C17654] transition-colors">
        <a href={href}>{note.title}</a>
      </h3>
      <p className="text-sm text-[#1B2A4A]/60 mb-3 leading-relaxed">{note.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {note.tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[#7A8B6F]/20 text-[#7A8B6F]">{tag}</span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <a href={href}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B2A4A] text-white text-sm font-medium hover:bg-[#1B2A4A]/90 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {labels.details}
        </a>
        {note.urls.map((link) => {
          const isInternal = link.url.startsWith('/');
          const href = isInternal
            ? `${link.url}${link.url.includes('?') ? '&' : '?'}lang=${note.lang}`
            : link.url;
          return (
            <a key={link.url} href={href}
              {...(!isInternal && { target: '_blank', rel: 'noopener noreferrer' })}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#C17654] text-[#C17654] text-sm font-medium hover:bg-[#C17654]/10 transition-colors">
              {isInternal ? <LaunchIcon /> : <DownloadIcon />}
              {link.label}
            </a>
          );
        })}
      </div>
    </article>
  );
}

export default function NotesSearch({ notes, labels, categoryOptions }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return notes.filter((n) => {
      const matchesQuery =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = category === 'all' || n.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [notes, query, category]);

  return (
    <div>
      {/* Search + category filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search input */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B2A4A]/30 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1B2A4A]/10 bg-white/70 text-sm text-[#1B2A4A] placeholder:text-[#1B2A4A]/30 focus:outline-none focus:border-[#C17654]/40 focus:ring-1 focus:ring-[#C17654]/20 transition-colors"
          />
        </div>

        {/* Category dropdown */}
        <div className="relative shrink-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-[#1B2A4A]/10 bg-white/70 text-sm text-[#1B2A4A] focus:outline-none focus:border-[#C17654]/40 focus:ring-1 focus:ring-[#C17654]/20 transition-colors cursor-pointer"
          >
            <option value="all">{labels.allCategories}</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1B2A4A]/30 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-[#1B2A4A]/40 mb-6">
        {filtered.length} {filtered.length === 1 ? labels.noteSingular : labels.notePlural}
      </p>

      {/* Note list */}
      {filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map((note) => (
            <NoteCard key={note.slug} note={note} labels={labels} />
          ))}
        </div>
      ) : (
        <p className="text-[#1B2A4A]/50 text-center py-12">{labels.noResults}</p>
      )}
    </div>
  );
}
