import { useState } from 'react';
import type { ProjectCategory } from '../../data/projects';

interface ProjectData {
  slug: string;
  title: string;
  description: string;
  url: string;
  repo?: string;
  platform: string;
  category: ProjectCategory;
  tags: string[];
  variant: 'standard' | 'tall' | 'wide';
  screenshot?: string;
  relatedTo?: string[];
  relatedNames: string[];
  blogUrl?: string;
  tier: number;
  creation_date: string;
  last_modification_date?: string;
}

interface Props {
  projects: ProjectData[];
  labels: {
    viewProject: string;
    viewRepo: string;
    viewDrive: string;
    viewDetails: string;
    viewLive: string;
    seeAlso: string;
    showAll: string;
    showLess: string;
    gridView: string;
    listView: string;
    filterAll: string;
    sortTier: string;
    sortNewest: string;
    sortOldest: string;
    sortUpdated: string;
    sortLabel: string;
    filterLabel: string;
    categories: Record<ProjectCategory, string>;
  };
}


const INITIAL_COUNT = 6;
const STORAGE_KEY = 'projects-grid-expanded';

function readExpanded(): boolean {
  try { return sessionStorage.getItem(STORAGE_KEY) === 'true'; }
  catch { return false; }
}

function writeExpanded(expanded: boolean) {
  try {
    if (expanded) sessionStorage.setItem(STORAGE_KEY, 'true');
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch { /* Safari private mode or storage disabled */ }
}

// Category accent colors — one clear color per category, used for the top bar and badges
const categoryAccent: Record<ProjectCategory, string> = {
  'actuarial':    '#C17654', // terracotta
  'data-science': '#7A8B6F', // sage
  'data-engineering': '#5B7B9A', // steel blue
  'quant-finance':'#D4A574', // amber
  'applied-math': '#1B2A4A', // navy
};

const categoryBadge: Record<ProjectCategory, string> = {
  'actuarial':    'bg-[#C17654]/15 text-[#C17654]',
  'data-science': 'bg-[#7A8B6F]/15 text-[#7A8B6F]',
  'data-engineering': 'bg-[#5B7B9A]/15 text-[#5B7B9A]',
  'quant-finance':'bg-[#D4A574]/25 text-[#8a5e1a]',
  'applied-math': 'bg-[#1B2A4A]/10 text-[#1B2A4A]',
};

const placeholderGradients: Record<ProjectCategory, string> = {
  'actuarial':    'from-[#C17654]/15 via-[#D4A574]/8 to-transparent',
  'data-science': 'from-[#7A8B6F]/15 via-[#7A8B6F]/8 to-transparent',
  'data-engineering': 'from-[#5B7B9A]/15 via-[#5B7B9A]/8 to-transparent',
  'quant-finance':'from-[#D4A574]/20 via-[#D4A574]/8 to-transparent',
  'applied-math': 'from-[#1B2A4A]/12 via-[#1B2A4A]/6 to-transparent',
};

const categoryIconPaths: Record<ProjectCategory, string> = {
  'actuarial':    'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  'data-science': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'data-engineering': 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
  'quant-finance':'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  'applied-math': 'M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0A17.926 17.926 0 0021 12a17.926 17.926 0 00-1.871-8M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
};

// --- Grid Card ---
function GridCard({ project, labels }: { project: ProjectData; labels: Props['labels'] }) {
  const accent = categoryAccent[project.category];

  return (
    <article className="group flex flex-col h-full bg-[#F5F0EA] rounded-xl border border-[#1B2A4A]/10 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Category accent bar */}
      <div className="h-1 w-full shrink-0" style={{ backgroundColor: accent }} />

      {/* Visual area */}
      <a href={project.url}
        {...(!project.url.startsWith('/') && { target: '_blank', rel: 'noopener noreferrer' })}
        className="block relative overflow-hidden h-44">
        {project.screenshot ? (
          <div className="w-full h-full flex items-center justify-center bg-[#F8F5F1] p-3">
            <img src={project.screenshot} alt={project.title}
              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 rounded-sm" loading="lazy" />
          </div>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br flex items-center justify-center relative ${placeholderGradients[project.category]}`}>
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <svg className="w-12 h-12 text-[#1B2A4A]/15 transition-transform duration-500 group-hover:scale-110"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={categoryIconPaths[project.category]} />
            </svg>
          </div>
        )}
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${project.screenshot ? 'bg-white/85 text-[#1B2A4A]/75' : categoryBadge[project.category]}`}>
            {labels.categories[project.category]}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-white/70 text-[#1B2A4A]/55 backdrop-blur-sm">
            {project.platform}
          </span>
        </div>
      </a>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-serif text-lg font-bold text-[#1B2A4A] mb-2 group-hover:text-[#C17654] transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="text-sm text-[#1B2A4A]/55 flex-1 mb-3 leading-relaxed line-clamp-5">
          {project.description}
        </p>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[#EDE6DD] text-[#1B2A4A]/60 font-medium">{tag}</span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-xs text-[#1B2A4A]/30 self-center">+{project.tags.length - 4}</span>
            )}
          </div>
        )}
        {/* 3-slot button footer */}
        <div className="grid grid-cols-3 gap-1 mt-auto pt-3 border-t border-[#1B2A4A]/8">
          {/* LEFT — source: GitHub or Drive */}
          <div className="flex justify-start">
            {(project.repo || project.platform === 'GitHub' || project.platform === 'Drive') && (
              <a
                href={project.repo ?? project.url}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B2A4A]/45 hover:text-[#1B2A4A]/75 transition-colors duration-200"
              >
                {project.platform === 'Drive' ? (
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                )}
                {project.platform === 'Drive' ? labels.viewDrive : labels.viewRepo}
              </a>
            )}
          </div>
          {/* CENTER — blog post */}
          <div className="flex justify-center">
            {project.blogUrl && (
              <a
                href={project.blogUrl}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B2A4A]/45 hover:text-[#1B2A4A]/75 transition-colors duration-200"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {labels.viewDetails}
              </a>
            )}
          </div>
          {/* RIGHT — live site */}
          <div className="flex justify-end">
            {project.platform !== 'GitHub' && project.platform !== 'Drive' && (
              <a
                href={project.url}
                {...(!project.url.startsWith('/') && { target: '_blank', rel: 'noopener noreferrer' })}
                className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200"
                style={{ color: accent }}
              >
                {labels.viewLive}
                <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// --- List Row ---
function ListRow({ project, labels }: { project: ProjectData; labels: Props['labels'] }) {
  const accent = categoryAccent[project.category];

  return (
    <article
      className="group relative flex items-center gap-4 md:gap-6 bg-[#F5F0EA] rounded-xl border border-[#1B2A4A]/10 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ borderLeftColor: accent, borderLeftWidth: '3px' }}>

      {/* Stretched primary link covers the whole card */}
      <a
        href={project.url}
        {...(!project.url.startsWith('/') && { target: '_blank', rel: 'noopener noreferrer' })}
        className="absolute inset-0 rounded-xl z-0"
        aria-label={project.title}
        tabIndex={0}
      />

      {/* Icon */}
      <div className={`hidden sm:flex shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br items-center justify-center ${placeholderGradients[project.category]}`}>
        {project.screenshot ? (
          <img src={project.screenshot} alt="" className="w-full h-full object-cover rounded-lg" loading="lazy" />
        ) : (
          <svg className="w-6 h-6 text-[#1B2A4A]/25" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={categoryIconPaths[project.category]} />
          </svg>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-serif text-base font-bold text-[#1B2A4A] group-hover:text-[#C17654] transition-colors truncate">
            {project.title}
          </h3>
          <span className={`hidden md:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${categoryBadge[project.category]}`}>
            {labels.categories[project.category]}
          </span>
        </div>
        <p className="text-sm text-[#1B2A4A]/50 line-clamp-1">{project.description}</p>
      </div>

      {/* Tags */}
      <div className="hidden lg:flex items-center gap-1.5 shrink-0">
        {project.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE6DD] text-[#1B2A4A]/55 font-medium">{tag}</span>
        ))}
      </div>

      {/* 3-slot compact icon actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* LEFT — source */}
        {(project.repo || project.platform === 'GitHub' || project.platform === 'Drive') ? (
          <a
            href={project.repo ?? project.url}
            target="_blank" rel="noopener noreferrer"
            className="relative z-10 text-[#1B2A4A]/30 hover:text-[#1B2A4A]/65 transition-colors"
            aria-label={project.platform === 'Drive' ? labels.viewDrive : labels.viewRepo}
          >
            {project.platform === 'Drive' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            )}
          </a>
        ) : <span className="w-4 h-4" />}
        {/* CENTER — blog post */}
        {project.blogUrl ? (
          <a
            href={project.blogUrl}
            className="relative z-10 text-[#1B2A4A]/30 hover:text-[#1B2A4A]/65 transition-colors"
            aria-label={labels.viewDetails}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </a>
        ) : <span className="w-4 h-4" />}
        {/* RIGHT — live site */}
        {project.platform !== 'GitHub' && project.platform !== 'Drive' ? (
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={{ color: accent }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        ) : <span className="w-4 h-4" />}
      </div>
    </article>
  );
}

// --- Main Component ---
type SortMode = 'tier' | 'newest' | 'oldest' | 'updated';
type FilterCat = ProjectCategory | 'all';

const CATEGORY_ORDER: ProjectCategory[] = ['actuarial', 'data-science', 'data-engineering', 'quant-finance', 'applied-math'];

export default function ProjectsGrid({ projects, labels }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAll, setShowAll] = useState(readExpanded);
  const [activeCategory, setActiveCategory] = useState<FilterCat>('all');
  const [sortMode, setSortMode] = useState<SortMode>('tier');

  const handleCategoryChange = (cat: FilterCat) => {
    setActiveCategory(cat);
    setShowAll(false);
    writeExpanded(false);
  };
  const handleSortChange = (mode: SortMode) => { setSortMode(mode); };

  const presentCategories = CATEGORY_ORDER.filter(c => projects.some(p => p.category === c));

  const filtered = activeCategory === 'all' ? projects : projects.filter(p => p.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === 'tier') {
      if (a.tier !== b.tier) return a.tier - b.tier;
      const aDate = a.last_modification_date ?? a.creation_date;
      const bDate = b.last_modification_date ?? b.creation_date;
      return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
    }
    if (sortMode === 'newest') return a.creation_date < b.creation_date ? 1 : a.creation_date > b.creation_date ? -1 : 0;
    if (sortMode === 'oldest') return a.creation_date > b.creation_date ? 1 : a.creation_date < b.creation_date ? -1 : 0;
    const aDate = a.last_modification_date ?? a.creation_date;
    const bDate = b.last_modification_date ?? b.creation_date;
    return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
  });

  const visible = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);
  const hasMore = sorted.length > INITIAL_COUNT;

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
            activeCategory === 'all'
              ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
              : 'bg-transparent text-[#1B2A4A]/60 border-[#1B2A4A]/20 hover:border-[#1B2A4A]/40 hover:text-[#1B2A4A]/80'
          }`}
        >{labels.filterAll}</button>
        {presentCategories.map((cat) => {
          const accent = categoryAccent[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border"
              style={isActive
                ? { backgroundColor: accent, color: 'white', borderColor: accent }
                : { color: accent, borderColor: `${accent}40`, backgroundColor: 'transparent' }
              }
            >{labels.categories[cat]}</button>
          );
        })}
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center bg-[#1B2A4A]/5 rounded-lg p-1 gap-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'grid' ? 'bg-white text-[#1B2A4A] shadow-sm' : 'text-[#1B2A4A]/50 hover:text-[#1B2A4A]/70'
            }`}
            aria-label={labels.gridView}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="hidden sm:inline">{labels.gridView}</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'list' ? 'bg-white text-[#1B2A4A] shadow-sm' : 'text-[#1B2A4A]/50 hover:text-[#1B2A4A]/70'
            }`}
            aria-label={labels.listView}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline">{labels.listView}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#1B2A4A]/40 hidden sm:inline">{labels.sortLabel}</span>
            <select
              value={sortMode}
              onChange={(e) => handleSortChange(e.target.value as SortMode)}
              className="text-xs text-[#1B2A4A]/70 bg-transparent border border-[#1B2A4A]/15 rounded-md px-2 py-1 focus:outline-none focus:border-[#1B2A4A]/30 cursor-pointer"
            >
              <option value="tier">{labels.sortTier}</option>
              <option value="newest">{labels.sortNewest}</option>
              <option value="oldest">{labels.sortOldest}</option>
              <option value="updated">{labels.sortUpdated}</option>
            </select>
          </div>
          <span className="text-xs text-[#1B2A4A]/40">
            {visible.length}/{sorted.length}
          </span>
        </div>
      </div>

      {/* Grid view — clean 2-col */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visible.map((project) => (
            <GridCard key={project.slug} project={project} labels={labels} />
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <div className="flex flex-col gap-3">
          {visible.map((project) => (
            <ListRow key={project.slug} project={project} labels={labels} />
          ))}
        </div>
      )}

      {/* Show all / show less */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              const next = !showAll;
              setShowAll(next);
              writeExpanded(next);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#1B2A4A]/15 text-sm font-medium text-[#1B2A4A]/70 hover:text-[#1B2A4A] hover:border-[#1B2A4A]/30 hover:shadow-sm transition-all duration-200"
          >
            {showAll ? labels.showLess : labels.showAll}
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
