import { useState } from 'react';
import type { ProjectCategory } from '../../data/projects';

interface ProjectData {
  slug: string;
  title: string;
  description: string;
  url: string;
  platform: string;
  category: ProjectCategory;
  tags: string[];
  variant: 'standard' | 'tall' | 'wide';
  screenshot?: string;
  relatedTo?: string[];
  relatedNames: string[];
}

interface Props {
  projects: ProjectData[];
  labels: {
    viewProject: string;
    seeAlso: string;
    showAll: string;
    showLess: string;
    gridView: string;
    listView: string;
    categories: Record<ProjectCategory, string>;
  };
}

const INITIAL_COUNT = 6;

/**
 * Interleave projects so wide (8-col) cards always pair with
 * a standard/tall (4-col) card on the same row. Without this,
 * consecutive wide cards each leave a 4-col gap.
 */
function interleaveForGrid(items: ProjectData[]): ProjectData[] {
  const wide: ProjectData[] = [];
  const narrow: ProjectData[] = []; // standard + tall
  for (const p of items) {
    if (p.variant === 'wide') wide.push(p);
    else narrow.push(p);
  }

  const result: ProjectData[] = [];
  let wi = 0;
  let ni = 0;

  while (wi < wide.length || ni < narrow.length) {
    // Place a wide card, then a narrow card to fill the row
    if (wi < wide.length) {
      result.push(wide[wi++]);
      if (ni < narrow.length) {
        result.push(narrow[ni++]);
      }
    } else {
      // Only narrow cards left — push them in groups of 3
      result.push(narrow[ni++]);
    }
  }

  return result;
}

const categoryColors: Record<ProjectCategory, string> = {
  'actuarial': 'bg-[#C17654]/10 border-[#C17654]/20',
  'data-science': 'bg-[#7A8B6F]/10 border-[#7A8B6F]/20',
  'quant-finance': 'bg-[#D4A574]/10 border-[#D4A574]/20',
  'applied-math': 'bg-[#1B2A4A]/10 border-[#1B2A4A]/20',
};

const categoryBadgeColors: Record<ProjectCategory, string> = {
  'actuarial': 'bg-[#C17654]/20 text-[#C17654]',
  'data-science': 'bg-[#7A8B6F]/20 text-[#7A8B6F]',
  'quant-finance': 'bg-[#D4A574]/20 text-[#D4A574]',
  'applied-math': 'bg-[#1B2A4A]/20 text-[#1B2A4A]',
};

const placeholderGradients: Record<ProjectCategory, string> = {
  'actuarial': 'from-[#C17654]/20 via-[#C17654]/10 to-[#D4A574]/5',
  'data-science': 'from-[#7A8B6F]/20 via-[#7A8B6F]/10 to-[#1B2A4A]/5',
  'quant-finance': 'from-[#D4A574]/20 via-[#D4A574]/10 to-[#C17654]/5',
  'applied-math': 'from-[#1B2A4A]/20 via-[#1B2A4A]/10 to-[#7A8B6F]/5',
};

const categoryIconPaths: Record<ProjectCategory, string> = {
  'actuarial': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  'data-science': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'quant-finance': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  'applied-math': 'M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0A17.926 17.926 0 0021 12a17.926 17.926 0 00-1.871-8M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
};

// --- Grid Card ---
function GridCard({ project, labels }: { project: ProjectData; labels: Props['labels'] }) {
  const isWide = project.variant === 'wide';
  const maxTags = isWide ? 6 : 4;

  return (
    <div className={
      isWide ? 'md:col-span-8' : project.variant === 'tall' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-4'
    }>
      <article className={`group relative flex flex-col h-full rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${categoryColors[project.category]}`}>
        {/* Visual area */}
        <a href={project.url} target="_blank" rel="noopener noreferrer"
          className={`block relative overflow-hidden ${isWide ? 'h-48 md:h-56' : 'h-40 md:h-44'}`}>
          {project.screenshot ? (
            <div className="w-full h-full flex items-center justify-center bg-white/60 p-3">
              <img src={project.screenshot} alt={project.title}
                className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 rounded-sm shadow-sm" loading="lazy" />
            </div>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br flex items-center justify-center relative ${placeholderGradients[project.category]}`}>
              <div className="absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <svg className="w-12 h-12 text-[#1B2A4A]/20 transition-transform duration-500 group-hover:scale-110 group-hover:text-[#1B2A4A]/30"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={categoryIconPaths[project.category]} />
              </svg>
            </div>
          )}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${project.screenshot ? 'bg-white/80 text-[#1B2A4A]/80' : categoryBadgeColors[project.category]}`}>
              {labels.categories[project.category]}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${project.screenshot ? 'bg-white/60 text-[#1B2A4A]/60 backdrop-blur-sm' : 'bg-white/40 text-[#1B2A4A]/50'}`}>
              {project.platform}
            </span>
          </div>
        </a>

        {/* Content area */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="font-serif text-lg font-bold text-[#1B2A4A] mb-2 group-hover:text-[#C17654] transition-colors leading-snug">
            {project.title}
          </h3>
          <p className={`text-sm text-[#1B2A4A]/60 flex-1 mb-3 leading-relaxed ${isWide ? 'line-clamp-3' : 'line-clamp-4'}`}>
            {project.description}
          </p>
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.slice(0, maxTags).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[#7A8B6F]/15 text-[#7A8B6F] font-medium">{tag}</span>
              ))}
              {project.tags.length > maxTags && (
                <span className="text-xs text-[#1B2A4A]/30 self-center">+{project.tags.length - maxTags}</span>
              )}
            </div>
          )}
          {project.relatedNames.length > 0 && (
            <p className="text-xs text-[#1B2A4A]/35 mb-3 italic leading-relaxed">
              {labels.seeAlso} {project.relatedNames.join(', ')}
            </p>
          )}
          <a href={project.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C17654] hover:text-[#C17654]/80 transition-colors mt-auto">
            {labels.viewProject}
            <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </article>
    </div>
  );
}

// --- List Row ---
function ListRow({ project, labels }: { project: ProjectData; labels: Props['labels'] }) {
  return (
    <a href={project.url} target="_blank" rel="noopener noreferrer"
      className={`group flex items-center gap-4 md:gap-6 rounded-xl border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${categoryColors[project.category]}`}>

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
          <span className={`hidden md:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${categoryBadgeColors[project.category]}`}>
            {labels.categories[project.category]}
          </span>
        </div>
        <p className="text-sm text-[#1B2A4A]/50 line-clamp-1">{project.description}</p>
      </div>

      {/* Tags (desktop only) */}
      <div className="hidden lg:flex items-center gap-1.5 shrink-0">
        {project.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#7A8B6F]/15 text-[#7A8B6F] font-medium">{tag}</span>
        ))}
      </div>

      {/* Arrow */}
      <svg className="w-4 h-4 text-[#C17654] shrink-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  );
}

// --- Main Component ---
export default function ProjectsGrid({ projects, labels }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAll, setShowAll] = useState(false);

  const gridOrder = interleaveForGrid(projects);
  const visible = showAll ? gridOrder : gridOrder.slice(0, INITIAL_COUNT);
  const hasMore = projects.length > INITIAL_COUNT;

  return (
    <div>
      {/* Controls bar */}
      <div className="flex items-center justify-between mb-8">
        {/* View toggle */}
        <div className="flex items-center bg-[#1B2A4A]/5 rounded-lg p-1 gap-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-white text-[#1B2A4A] shadow-sm'
                : 'text-[#1B2A4A]/50 hover:text-[#1B2A4A]/70'
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
              viewMode === 'list'
                ? 'bg-white text-[#1B2A4A] shadow-sm'
                : 'text-[#1B2A4A]/50 hover:text-[#1B2A4A]/70'
            }`}
            aria-label={labels.listView}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline">{labels.listView}</span>
          </button>
        </div>

        {/* Project count */}
        <span className="text-xs text-[#1B2A4A]/40">
          {visible.length}/{projects.length}
        </span>
      </div>

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-auto">
          {visible.map((project) => (
            <GridCard key={project.slug} project={project} labels={labels} />
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <div className="flex flex-col gap-3">
          {(showAll ? projects : projects.slice(0, INITIAL_COUNT)).map((project) => (
            <ListRow key={project.slug} project={project} labels={labels} />
          ))}
        </div>
      )}

      {/* Show all / show less */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
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
