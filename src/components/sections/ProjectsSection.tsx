import React, { useState, useMemo, useEffect } from 'react';
import { PROJECTS_DATA } from '@/data/dossierData';
import { fetchProjects } from '@/lib/firestore';
import { ProjectItem } from '@/types/dossier';
import { StampBadge } from '../common/StampBadge';
import { TapeStrip } from '../common/TapeStrip';
import { PaperClip } from '../common/PaperClip';
import {
  ExternalLink,
  Github,
  Layers,
  Sparkles,
  FolderGit2,
  ArrowUpRight,
  Archive,
  Search,
  X,
  FileText,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(PROJECTS_DATA);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS_DATA[0].id);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchProjects().then((data) => {
      if (data && data.length > 0) {
        setProjects(data);
      }
    });
  }, []);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || PROJECTS_DATA[0];

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsArchiveModalOpen(false);
      }
    };
    if (isArchiveModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isArchiveModalOpen]);

  // Unique categories for filter pills
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [projects]);

  // Filtered projects for the Archive Modal
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        activeCategoryFilter === 'ALL' || p.category === activeCategoryFilter;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projects, searchQuery, activeCategoryFilter]);

  const handleSelectProjectFromModal = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsArchiveModalOpen(false);
  };

  return (
    <div className="space-y-8 text-neutral-900">
      {/* Dossier Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-neutral-300 pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
            DOSSIER #04
          </span>
          <span className="text-neutral-500">SUBJECT: PRODUCTION CASE FILES & DEPLOYMENTS</span>
        </div>
        <div className="flex items-center gap-2">
          <StampBadge text="DEPLOYED ARTIFACTS" variant="blue" rotate={1} />
        </div>
      </div>

      {/* Intro Header & View All Catalog Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide text-neutral-950 leading-tight">
            GALERI KARYA & ARSIP
          </h1>
          <p className="font-serif text-base sm:text-lg text-neutral-700 max-w-2xl leading-relaxed">
            Koleksi proyek nyata dan eksperimen web interaktif yang dibangun dengan fokus pada kegunaan nyata, arsitektur data efisien, dan estetika visual taktil.
          </p>
        </div>

        {/* Modal Opener Button */}
        <button
          onClick={() => setIsArchiveModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-900 hover:bg-purple-950 text-white font-mono text-xs font-bold uppercase rounded shadow-md hover:shadow-lg transition-all shrink-0 active:scale-95 border border-purple-950"
        >
          <Archive className="w-4 h-4 text-purple-300" />
          <span>KATALOG SEMUA ARSIP ({projects.length})</span>
        </button>
      </div>

      {/* Projects Grid Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((project, idx) => {
          const isSelected = project.id === selectedProjectId;
          const displayStatus = project.status === 'Active Development' ? 'ACTIVE DEV' : project.status;
          return (
            <button
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className={`p-4 rounded-md text-left transition-all border relative flex flex-col justify-between min-h-[180px] ${
                isSelected
                  ? 'bg-purple-900 text-white border-purple-950 shadow-lg translate-y-[-2px] ring-2 ring-purple-400/50'
                  : 'bg-white text-neutral-900 border-neutral-300 hover:border-purple-400 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider mb-2 gap-1">
                  <span className={`shrink-0 font-semibold ${isSelected ? 'text-purple-200' : 'text-neutral-500'}`}>
                    CASE FILE
                  </span>
                  <span
                    className={`shrink-0 px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${
                      isSelected ? 'bg-purple-800 text-purple-200' : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {displayStatus}
                  </span>
                </div>
                <h3
                  className={`font-sans text-lg sm:text-xl uppercase tracking-wide leading-tight mb-1.5 ${
                    isSelected ? 'text-white' : 'text-neutral-950'
                  }`}
                >
                  {project.title}
                </h3>
                <p className={`font-serif text-xs leading-relaxed line-clamp-2 ${isSelected ? 'text-purple-100' : 'text-neutral-600'}`}>
                  {project.subtitle}
                </p>
              </div>

              <div
                className={`flex items-center gap-1.5 mt-4 pt-3 border-t font-mono text-[11px] ${
                  isSelected ? 'border-purple-800 text-purple-200' : 'border-neutral-200 text-neutral-500'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{project.category}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Project Case File Card */}
      <div className="relative bg-white p-6 sm:p-8 rounded-sm shadow-md border border-neutral-200 space-y-6">
        {/* Paperclip clipping the case sheet */}
        <div className="absolute -top-6 left-10 z-20">
          <PaperClip className="w-8 h-16" color="#475569" />
        </div>

        {/* Tape on top right */}
        <div className="absolute -top-3 right-8">
          <TapeStrip rotate={-2} width="w-24" />
        </div>

        {/* Case File Metadata Header */}
        <div className="border-b border-neutral-200 pb-4 pt-2 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-purple-700 font-bold uppercase mb-1">
              <span>{selectedProject.category}</span>
              <span>•</span>
              <span>TIMELINE: {selectedProject.date}</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl text-neutral-950 uppercase tracking-wide leading-tight">
              {selectedProject.title}
            </h2>
            <p className="font-serif text-base text-neutral-600 italic">
              {selectedProject.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {selectedProject.liveUrl && selectedProject.liveUrl !== '#' && (
              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white font-mono text-xs uppercase font-bold rounded shadow-sm hover:bg-purple-800 transition-colors"
              >
                <span>Live System</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {selectedProject.repoUrl && (
              <a
                href={selectedProject.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white font-mono text-xs uppercase font-bold rounded shadow-sm hover:bg-neutral-800 transition-colors"
              >
                <span>Source Code</span>
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Narrative & Case Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {selectedProject.imageUrl && (
              <div className="relative aspect-video w-full rounded border border-neutral-300 overflow-hidden bg-neutral-100 shadow-inner group mb-2">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-800 border-b border-neutral-200 pb-1">
              SYSTEM OVERVIEW & BACKGROUND
            </h4>
            <p className="font-serif text-base sm:text-lg text-neutral-800 leading-relaxed">
              {selectedProject.description}
            </p>

            <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-800 border-b border-neutral-200 pb-1 pt-2">
              ENGINEERING ARCHITECTURE & EXECUTION
            </h4>
            <p className="font-serif text-base sm:text-lg text-neutral-800 leading-relaxed">
              {selectedProject.caseStudy}
            </p>
          </div>

          {/* Right Column: Stack Pills & Performance Metrics */}
          <div className="lg:col-span-4 space-y-5 bg-neutral-50 p-5 rounded border border-neutral-200">
            <div>
              <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                INTEGRATED STACK
              </h5>
              <div className="flex flex-wrap gap-2">
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs px-2.5 py-1 rounded bg-white text-purple-900 border border-purple-200 font-semibold shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {selectedProject.metrics && (
              <div className="pt-3 border-t border-neutral-200">
                <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                  FIELD IMPACT & METRICS
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  {selectedProject.metrics.map((m) => (
                    <div key={m.label} className="bg-white p-3 rounded border border-neutral-200 text-center">
                      <div className="font-sans font-black text-lg text-purple-700 uppercase">
                        {m.value}
                      </div>
                      <div className="font-mono text-[10px] text-neutral-500 uppercase">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Archive Catalog Popup Modal */}
      {isArchiveModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsArchiveModalOpen(false)}
        >
          <div
            className="relative bg-[#faf8f3] text-neutral-900 w-full max-w-5xl max-h-[90vh] rounded shadow-2xl border-2 border-purple-900/40 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Tab Bar */}
            <div className="bg-purple-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-purple-900">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-purple-800 rounded border border-purple-600">
                  <Archive className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-purple-300 uppercase tracking-widest">
                    CENTRAL ARCHIVE REGISTRY // DOSSIER #04
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl uppercase tracking-wide leading-none text-white">
                    KATALOG LENGKAP SEMUA BERKAS PROYEK
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsArchiveModalOpen(false)}
                className="p-1.5 text-purple-300 hover:text-white hover:bg-purple-800 rounded transition-colors"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Category Filter Toolbar */}
            <div className="p-4 bg-white border-b border-neutral-200 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama proyek, deskripsi, atau teknologi (e.g. Next.js, AI, Firebase)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded font-mono text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 font-mono text-xs"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="font-mono text-[11px] text-neutral-500 uppercase flex items-center gap-1 shrink-0">
                  <Filter className="w-3 h-3" />
                  Kategori:
                </span>
                {categories.map((cat) => {
                  const isActive = activeCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategoryFilter(cat)}
                      className={`px-3 py-1 rounded font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors border ${
                        isActive
                          ? 'bg-purple-900 text-white border-purple-950 font-bold shadow-2xs'
                          : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
                      }`}
                    >
                      {cat === 'ALL' ? 'SEMUA KATEGORI' : cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Body: Grid of All Filtered Project Files */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-paper-texture space-y-4">
              {filteredProjects.length === 0 ? (
                <div className="py-12 text-center space-y-2 bg-white/70 rounded border border-neutral-200 p-6">
                  <FileText className="w-10 h-10 text-neutral-400 mx-auto" />
                  <h4 className="font-sans text-lg uppercase tracking-wide text-neutral-800">
                    BERKAS TIDAK DITEMUKAN
                  </h4>
                  <p className="font-serif text-sm text-neutral-600 max-w-md mx-auto">
                    Tidak ada proyek yang sesuai dengan kriteria pencarian &quot;{searchQuery}&quot;. Coba gunakan kata kunci lain.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => {
                    const isSelected = project.id === selectedProjectId;
                    const displayStatus =
                      project.status === 'Active Development' ? 'ACTIVE DEV' : project.status;
                    return (
                      <div
                        key={project.id}
                        className={`p-4 rounded border bg-white flex flex-col justify-between transition-all hover:shadow-md relative ${
                          isSelected
                            ? 'ring-2 ring-purple-600 border-purple-500 bg-purple-50/40'
                            : 'border-neutral-200 hover:border-purple-300'
                        }`}
                      >
                        <div>
                          {/* Card Top Meta */}
                          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider mb-2 gap-1">
                            <span className="text-neutral-500 font-semibold">{project.category}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${
                                displayStatus === 'Deployed'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {displayStatus}
                            </span>
                          </div>

                          {/* Card Title & Subtitle */}
                          <h4 className="font-sans text-lg uppercase tracking-wide text-neutral-950 mb-1 leading-tight">
                            {project.title}
                          </h4>
                          <p className="font-serif text-xs text-neutral-600 leading-snug mb-3 line-clamp-2">
                            {project.subtitle}
                          </p>

                          {/* Tech Stack Badges */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.techStack.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 4 && (
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 font-semibold">
                                +{project.techStack.length - 4}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-neutral-500">
                            {project.date}
                          </span>
                          <button
                            onClick={() => handleSelectProjectFromModal(project.id)}
                            className={`px-3 py-1.5 rounded font-mono text-xs font-bold uppercase transition-colors inline-flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-purple-800 text-white'
                                : 'bg-neutral-900 hover:bg-purple-900 text-white'
                            }`}
                          >
                            <span>{isSelected ? 'SEDANG DIBUKA' : 'BUKA BERKAS'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="p-3.5 bg-neutral-100 border-t border-neutral-200 flex flex-wrap items-center justify-between text-neutral-600 font-mono text-xs gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>TOTAL ARSIP: {filteredProjects.length} DARI {projects.length} BERKAS</span>
              </div>
              <span className="text-neutral-500">TEKAN ESC ATAU KLIK DI LUAR UNTUK MENUTUP</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
