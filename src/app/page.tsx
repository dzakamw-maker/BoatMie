'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FolderId } from '@/types/dossier';
import { FOLDERS_CONFIG } from '@/data/dossierData';
import { FolderDeckView } from '@/components/dossier/FolderDeckView';
import { FolderCaseView } from '@/components/dossier/FolderCaseView';

export default function Home() {
  const [viewMode, setViewMode] = useState<'deck' | 'case'>('deck');
  const [activeFolderId, setActiveFolderId] = useState<FolderId>('about');

  // Sync with URL hash on load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as FolderId;
      const validFolder = FOLDERS_CONFIG.find((f) => f.id === hash);
      if (validFolder) {
        setActiveFolderId(validFolder.id);
        setViewMode('case');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewMode('deck');
        window.history.pushState(null, '', ' ');
      }

      if (viewMode === 'case') {
        const currentIndex = FOLDERS_CONFIG.findIndex((f) => f.id === activeFolderId);
        if (e.key === 'ArrowRight') {
          const nextIndex = (currentIndex + 1) % FOLDERS_CONFIG.length;
          handleSelectFolder(FOLDERS_CONFIG[nextIndex].id);
        } else if (e.key === 'ArrowLeft') {
          const prevIndex = (currentIndex - 1 + FOLDERS_CONFIG.length) % FOLDERS_CONFIG.length;
          handleSelectFolder(FOLDERS_CONFIG[prevIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, activeFolderId]);

  const handleSelectFolder = (folderId: FolderId) => {
    setActiveFolderId(folderId);
    setViewMode('case');
    window.location.hash = folderId;
  };

  const handleBackToDeck = () => {
    setViewMode('deck');
    window.history.pushState(null, '', ' ');
  };

  return (
    <div className="min-h-screen bg-[#121316] text-[#f4efe6]">
      <AnimatePresence mode="wait">
        {viewMode === 'deck' ? (
          <motion.div
            key="deck-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25 }}
          >
            <FolderDeckView onSelectFolder={handleSelectFolder} />
          </motion.div>
        ) : (
          <motion.div
            key="case-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28 }}
          >
            <FolderCaseView
              activeFolderId={activeFolderId}
              onSelectFolder={handleSelectFolder}
              onBackToDeck={handleBackToDeck}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
