'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { FolderId, FolderConfig } from '@/types/dossier';
import { FOLDERS_CONFIG } from '@/data/dossierData';
import { BinderHoles } from '../common/BinderHoles';
import { PaperClip } from '../common/PaperClip';
import { AboutSection } from '../sections/AboutSection';
import { InterestsSection } from '../sections/InterestsSection';
import { SkillsSection } from '../sections/SkillsSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { CertificatesSection } from '../sections/CertificatesSection';
import { ContactSection } from '../sections/ContactSection';
import { ArrowLeft, ArrowRight, FolderArchive, Layers, Share2 } from 'lucide-react';

interface FolderCaseViewProps {
  activeFolderId: FolderId;
  onSelectFolder: (folderId: FolderId) => void;
  onBackToDeck: () => void;
}

export const FolderCaseView: React.FC<FolderCaseViewProps> = ({
  activeFolderId,
  onSelectFolder,
  onBackToDeck,
}) => {
  const currentFolderIndex = FOLDERS_CONFIG.findIndex((f) => f.id === activeFolderId);
  const currentFolder = FOLDERS_CONFIG[currentFolderIndex] || FOLDERS_CONFIG[0];

  const nextFolderIndex = (currentFolderIndex + 1) % FOLDERS_CONFIG.length;
  const nextFolder = FOLDERS_CONFIG[nextFolderIndex];

  // Scroll to top whenever active folder changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeFolderId]);

  const renderSectionContent = () => {
    switch (activeFolderId) {
      case 'about':
        return (
          <AboutSection
            onOpenProjects={() => onSelectFolder('projects')}
            onOpenContact={() => onSelectFolder('contact')}
          />
        );
      case 'interests':
        return <InterestsSection />;
      case 'skills':
        return <SkillsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'certificates':
        return <CertificatesSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <AboutSection onOpenProjects={() => onSelectFolder('projects')} onOpenContact={() => onSelectFolder('contact')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#121316] text-[#f4efe6] flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Fixed / Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#121316]/95 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Back to Stack Overview Button */}
          <button
            onClick={onBackToDeck}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-mono text-xs uppercase tracking-wider transition-all hover:translate-x-[-2px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SEMUA MAP / OVERVIEW</span>
            <span className="sm:hidden">STACK</span>
          </button>

          {/* Current Case Header Badge */}
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shadow-xs"
              style={{ backgroundColor: currentFolder.folderColor }}
            />
            <span className="font-sans font-black text-sm sm:text-base uppercase tracking-wider text-white">
              {currentFolder.indexNumber} // {currentFolder.label}
            </span>
          </div>

          {/* Jump to Next Folder button in header */}
          <button
            onClick={() => onSelectFolder(nextFolder.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-mono text-xs uppercase tracking-wider transition-colors"
          >
            <span className="hidden sm:inline">NEXT:</span>
            <span>{nextFolder.label}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Dossier Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 relative">
        {/* Physical Colored Folder Envelope */}
        <div
          className="flex-1 rounded-t-2xl sm:rounded-t-3xl shadow-2xl p-2 sm:p-4 md:p-6 transition-colors duration-500 relative border-t-2 border-l-2 border-r-2 border-white/25"
          style={{ backgroundColor: currentFolder.folderColor }}
        >
          {/* Physical Folder Die-cut Tab Top Header */}
          <div className="flex items-center justify-between pb-3 px-2 text-white">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
              <span className="px-2 py-0.5 rounded bg-black/30 font-bold">
                {currentFolder.indexNumber}
              </span>
              <span className="font-bold text-sm tracking-wide">{currentFolder.category}</span>
            </div>
            <span className="font-mono text-[11px] opacity-80 hidden sm:inline-block">
              BOATMIE ARCHIVAL SYSTEM // 2026
            </span>
          </div>

          {/* Inner Paper Sheet (The Dossier Document) */}
          <motion.div
            key={activeFolderId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="bg-paper-texture text-neutral-900 rounded-sm sm:rounded-md shadow-2xl relative p-4 sm:p-8 lg:p-12 min-h-[750px] border border-neutral-300/80"
          >
            {/* 3-Ring Binder Holes (Left margin) */}
            <div className="hidden sm:block absolute left-2 top-1/2 -translate-y-1/2 z-10">
              <BinderHoles count={3} />
            </div>

            {/* Top Paperclip Decor */}
            <div className="absolute -top-7 right-12 z-20 hidden sm:block">
              <PaperClip className="w-8 h-16" color="#334155" />
            </div>

            {/* Render Active Folder Content (Indented slightly for binder margin) */}
            <div className="sm:pl-8 lg:pl-10">
              {renderSectionContent()}
            </div>

            {/* Bottom Next Dossier Teaser Banner */}
            <div className="mt-16 pt-8 border-t-2 border-dashed border-neutral-300 sm:pl-8 lg:pl-10">
              <div
                onClick={() => onSelectFolder(nextFolder.id)}
                className="group cursor-pointer p-6 rounded-lg shadow-md transition-all hover:shadow-xl hover:scale-[1.01] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white"
                style={{ backgroundColor: nextFolder.folderColor }}
              >
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest opacity-80 mb-1">
                    NEXT FILE IN SEQUENCE
                  </div>
                  <h4 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight">
                    {nextFolder.indexNumber} // {nextFolder.label}
                  </h4>
                  <p className="font-serif text-sm opacity-90 mt-1 max-w-xl">
                    {nextFolder.categoryDesc}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded bg-white text-neutral-950 font-mono text-xs uppercase font-bold tracking-wider group-hover:bg-neutral-100 transition-colors shrink-0">
                  <span>Buka {nextFolder.label}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right-Side Persistent Tab Rail (Desktop & Tablet) */}
        <aside className="lg:w-48 shrink-0 flex flex-col gap-2 z-30">
          <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 px-1 mb-1 hidden lg:block">
            DOSSIER INDEX
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
            {FOLDERS_CONFIG.map((folder) => {
              const isSelected = folder.id === activeFolderId;
              return (
                <button
                  key={folder.id}
                  onClick={() => onSelectFolder(folder.id)}
                  style={{
                    backgroundColor: folder.folderColor,
                  }}
                  className={`p-3 rounded text-left transition-all text-white border border-white/20 shadow-md ${
                    isSelected
                      ? 'ring-2 ring-white shadow-xl translate-x-1 brightness-110 font-bold'
                      : 'opacity-85 hover:opacity-100 hover:brightness-105 hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] font-bold opacity-80 uppercase mb-1">
                    <span>{folder.indexNumber}</span>
                    {isSelected && (
                      <span className="font-bold text-[9px] bg-black/30 px-1.5 py-0.5 rounded tracking-wider">
                        ● ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="font-sans text-base sm:text-lg uppercase tracking-wider leading-tight text-white drop-shadow-xs">
                    {folder.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Info Box on Right Sidebar */}
          <div className="mt-4 p-3.5 bg-neutral-900 rounded border border-neutral-800 font-mono text-[11px] text-neutral-400 space-y-2 hidden lg:block">
            <div className="font-bold text-neutral-200 uppercase">KEYBOARD SHORTCUTS</div>
            <div>[ESC] Overview Stack</div>
            <div>[← / →] Prev / Next File</div>
            <div className="pt-2 border-t border-neutral-800">
              <Link
                href="/admin"
                className="text-neutral-600 hover:text-neutral-300 transition-colors text-[10px] block"
                title="Classified Dossier Console"
              >
                [🔒 CLASSIFIED // ACCESS]
              </Link>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

