import { useState, useMemo } from 'react';

interface PostData {
  title: string;
  description: string;
  slug: string;
  date: string;
  category: string;
  categoryLabel: string;
  lang: 'es' | 'en';
}

interface Labels {
  searchPlaceholder: string;
  allYears: string;
  noResults: string;
  readMore: string;
  articleSingular: string;
  articlePlural: string;
}

interface Props {
  posts: PostData[];
  labels: Labels;
}

function PostCard({ post, labels }: { post: PostData; labels: Labels }) {
  const href = post.lang === 'es' ? `/blog/${post.slug}/` : `/en/blog/${post.slug}/`;
  const formattedDate = new Date(post.date + 'T12:00:00').toLocaleDateString(
    post.lang === 'es' ? 'es-MX' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <article className="group p-6 rounded-2xl border border-[#D4A574]/20 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#7A8B6F]/15 text-[#7A8B6F] font-medium">
          {post.categoryLabel}
        </span>
        <time className="text-xs text-[#1B2A4A]/40">{formattedDate}</time>
      </div>
      <h3 className="font-serif text-lg font-bold text-[#1B2A4A] mb-2 group-hover:text-[#C17654] transition-colors">
        <a href={href}>{post.title}</a>
      </h3>
      <p className="text-sm text-[#1B2A4A]/60 mb-3">{post.description}</p>
      <a href={href} className="text-sm font-medium text-[#C17654] hover:text-[#C17654]/80 transition-colors">
        {labels.readMore} &rarr;
      </a>
    </article>
  );
}

export default function BlogSearch({ posts, labels }: Props) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');

  const years = useMemo(() => {
    return [...new Set(posts.map((p) => new Date(p.date + 'T12:00:00').getFullYear()))]
      .sort((a, b) => b - a);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchesYear =
        year === 'all' ||
        new Date(p.date + 'T12:00:00').getFullYear().toString() === year;
      return matchesQuery && matchesYear;
    });
  }, [posts, query, year]);

  return (
    <div>
      {/* Search + year filter */}
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

        {/* Year dropdown */}
        <div className="relative shrink-0">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-[#1B2A4A]/10 bg-white/70 text-sm text-[#1B2A4A] focus:outline-none focus:border-[#C17654]/40 focus:ring-1 focus:ring-[#C17654]/20 transition-colors cursor-pointer"
          >
            <option value="all">{labels.allYears}</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>{y}</option>
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
        {filtered.length} {filtered.length === 1 ? labels.articleSingular : labels.articlePlural}
      </p>

      {/* Post list */}
      {filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} labels={labels} />
          ))}
        </div>
      ) : (
        <p className="text-[#1B2A4A]/50 text-center py-12">{labels.noResults}</p>
      )}
    </div>
  );
}
