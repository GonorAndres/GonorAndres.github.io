import { useState } from 'react';

interface NoteUrl {
  label: string;
  url: string;
}

interface NoteData {
  title: string;
  description: string;
  urls: NoteUrl[];
  tags: string[];
}

interface NoteGroup {
  category: string;
  label: string;
  notes: NoteData[];
}

interface Labels {
  gridView: string;
  listView: string;
}

interface Props {
  groups: NoteGroup[];
  labels: Labels;
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

// ── Grid card — current card style, full description ──────────────────────────
function GridNote({ note }: { note: NoteData }) {
  return (
    <div className="p-5 rounded-lg border border-[#D4A574]/20 hover:border-[#D4A574]/50 hover:shadow-sm transition-all duration-300 group">
      <h4 className="font-serif text-lg font-bold text-[#1B2A4A] group-hover:text-[#C17654] transition-colors mb-1">
        {note.title}
      </h4>
      <p className="text-[#1B2A4A]/70 text-sm leading-relaxed">{note.description}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {note.tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[#7A8B6F]/20 text-[#7A8B6F]">{tag}</span>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        {note.urls.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C17654] hover:text-[#C17654]/80 transition-colors">
            <DownloadIcon />
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── List row — compact layout, full description always visible ────────────────
function ListNote({ note }: { note: NoteData }) {
  return (
    <div className="flex gap-4 py-4 border-b border-[#1B2A4A]/8 last:border-b-0 group">
      {/* Icon */}
      <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-lg bg-[#D4A574]/10 items-center justify-center mt-0.5">
        <svg className="w-5 h-5 text-[#1B2A4A]/25" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h4 className="font-serif text-base font-bold text-[#1B2A4A] group-hover:text-[#C17654] transition-colors leading-snug">
            {note.title}
          </h4>
          {/* Tags on the right, desktop only */}
          <div className="hidden md:flex flex-wrap gap-1.5 shrink-0">
            {note.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#7A8B6F]/15 text-[#7A8B6F] font-medium whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* Full description — no clamp */}
        <p className="text-sm text-[#1B2A4A]/65 mb-2 leading-relaxed">{note.description}</p>
        <div className="flex flex-wrap gap-3">
          {note.urls.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#C17654] hover:text-[#C17654]/80 transition-colors">
              <DownloadIcon />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function NotesGrid({ groups, labels }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      {/* Toggle */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center bg-[#1B2A4A]/5 rounded-lg p-1 gap-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'grid' ? 'bg-white text-[#1B2A4A] shadow-sm' : 'text-[#1B2A4A]/50 hover:text-[#1B2A4A]/70'
            }`}
            aria-label={labels.gridView}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
      </div>

      {/* Category groups */}
      <div className="space-y-10">
        {groups.map((group) => (
          <div key={group.category}>
            <h3 className="text-lg font-bold text-[#C17654] mb-4">{group.label}</h3>
            {viewMode === 'grid' ? (
              <div className="space-y-4">
                {group.notes.map((note) => (
                  <GridNote key={note.title} note={note} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-[#D4A574]/20 px-5 py-1">
                {group.notes.map((note) => (
                  <ListNote key={note.title} note={note} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
