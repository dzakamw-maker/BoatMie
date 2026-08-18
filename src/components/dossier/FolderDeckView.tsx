'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FOLDERS_CONFIG } from '@/data/dossierData';
import { FolderId, FolderConfig } from '@/types/dossier';
import { FolderTab } from './FolderTab';
import { ChevronDown, ChevronUp, ArrowRight, Sparkles, FolderArchive, Layers, Info } from 'lucide-react';

interface FolderDeckViewProps {
  onSelectFolder: (folderId: FolderId) => void;
  onOpenAboutModal?: () => void;
}

export const FolderDeckView: React.FC<FolderDeckViewProps> = ({
  onSelectFolder,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<FolderId | null>(null);
  const [showQuickInfo, setShowQuickInfo] = useState(false);

  const toggleCategory = (id: FolderId) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#121316] text-[#f4efe6] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-12 selection:bg-blue-600 selection:text-white">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between border-b border-neutral-800 pb-4 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300">
            <FolderArchive className="w-4 h-4" />
          </div>
          <div>
            <span className="font-sans font-black text-sm uppercase tracking-widest text-white">
              BOATMIE ARCHIVES
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-mono text-neutral-500">
              SYS-DOSSIER v2.6
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQuickInfo((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-mono text-xs uppercase tracking-wider transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Archive Info</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto my-8 space-y-10">
        {/* Title & Introduction (Editorial Bold Style matching Mosby's Files) */}
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>INTERACTIVE TACTILE PORTFOLIO // WEST JAVA</span>
          </div>

          <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-none">
            DZAKA&apos;S DOSSIER
          </h1>

          <p className="font-serif text-lg sm:text-2xl text-neutral-300 leading-relaxed max-w-3xl">
            Situs portofolio pribadi bergaya map arsip fisik bertumpuk. Jelajahi catatan lapangan, cetak biru keahlian teknis, dan arsip karya digital melalui tab folder interaktif di bawah ini.
          </p>
        </div>

        {/* Quick Info Collapsible Modal/Drawer */}
        <AnimatePresence>
          {showQuickInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-neutral-900 border border-neutral-700 p-5 rounded font-mono text-xs space-y-3"
            >
              <div className="flex items-center justify-between text-blue-400 font-bold border-b border-neutral-800 pb-2">
                <span>[SYSTEM DIRECTIVE & INTERFACE GUIDE]</span>
                <button
                  onClick={() => setShowQuickInfo(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  ✕ CLOSE
                </button>
              </div>
              <p className="font-serif text-neutral-300 text-sm leading-relaxed">
                Portofolio BoatMie mengadopsi estetika berkas fisik (*tactile dossier*). Setiap tab folder mewakili domain spesifik. Klik tab mana pun untuk membuka lembaran arsip lengkap, atau gunakan tombol preview untuk membaca intisari kategori.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Physical Stacked Folders Deck */}
        <div className="pt-4 space-y-3 sm:space-y-4">
          {FOLDERS_CONFIG.map((folder, index) => {
            const isExpanded = expandedCategory === folder.id;

            return (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative rounded-t-xl sm:rounded-t-2xl shadow-xl transition-all overflow-hidden border-t border-l border-r border-white/20"
                style={{
                  backgroundColor: folder.folderColor,
                }}
              >
                {/* Folder Header Row */}
                <div className="flex flex-wrap items-center justify-between p-3 sm:p-4 gap-3">
                  {/* Left: Tab & Primary Button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectFolder(folder.id)}
                      className="group flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/15 hover:bg-white/25 rounded-lg border border-white/30 text-white font-sans font-black text-lg sm:text-2xl uppercase tracking-wide transition-all shadow-inner hover:scale-[1.01]"
                    >
                      <span className="font-mono text-xs opacity-75 px-1.5 py-0.5 rounded bg-black/30">
                        {folder.indexNumber}
                      </span>
                      <span>{folder.label}</span>
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>

                  {/* Right: Category Label & Expand Button */}
                  <div className="flex items-center gap-3">
                    <span className="hidden md:inline-block font-mono text-xs uppercase tracking-widest text-white/80">
                      {folder.category}
                    </span>

                    <button
                      onClick={() => toggleCategory(folder.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-black/25 hover:bg-black/40 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                      aria-expanded={isExpanded}
                      aria-label={`Toggle details for ${folder.label}`}
                    >
                      <span>{isExpanded ? 'Ringkas' : 'Pratinjau'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Accordion Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-black/30 backdrop-blur-xs p-4 sm:p-6 border-t border-white/20 text-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <p className="font-serif text-sm sm:text-base max-w-3xl leading-relaxed text-white/95">
                        {folder.categoryDesc}
                      </p>

                      <button
                        onClick={() => onSelectFolder(folder.id)}
                        className="self-start md:self-auto px-5 py-2 rounded bg-white text-neutral-950 font-mono text-xs uppercase font-bold tracking-wider hover:bg-neutral-200 transition-colors shrink-0 flex items-center gap-2"
                      >
                        <span>Buka Dossier Penuh</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 pt-6 max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between text-neutral-500 font-mono text-xs gap-4">
        <div>
          © 2026 BOATMIE // DZAKA. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-4">
          <span>BUILT WITH NEXT.JS & FRAMER MOTION</span>
          <span>ESTETIKA DOSSIER ARSIP</span>
        </div>
      </footer>
    </div>
  );
};
