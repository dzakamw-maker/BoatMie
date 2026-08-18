'use client';

import React, { useState } from 'react';
import { PROJECTS_DATA } from '@/data/dossierData';
import { ProjectItem } from '@/types/dossier';
import { StampBadge } from '../common/StampBadge';
import { TapeStrip } from '../common/TapeStrip';
import { PaperClip } from '../common/PaperClip';
import { ExternalLink, Github, Layers, Sparkles, FolderGit2, ArrowUpRight } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS_DATA[0].id);
  const selectedProject = PROJECTS_DATA.find((p) => p.id === selectedProjectId) || PROJECTS_DATA[0];

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

      {/* Intro Header */}
      <div className="space-y-2">
        <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 uppercase">
          GALERI KARYA & ARSIP
        </h1>
        <p className="font-serif text-base sm:text-lg text-neutral-700 max-w-3xl leading-relaxed">
          Koleksi proyek nyata dan eksperimen web interaktif yang dibangun dengan fokus pada kegunaan nyata, arsitektur data efisien, dan estetika visual taktil.
        </p>
      </div>

      {/* Projects Grid Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROJECTS_DATA.map((project, idx) => {
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
    </div>
  );
};
