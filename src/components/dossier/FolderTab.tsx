'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FolderConfig } from '@/types/dossier';

interface FolderTabProps {
  folder: FolderConfig;
  isActive?: boolean;
  onClick: () => void;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FolderTab: React.FC<FolderTabProps> = ({
  folder,
  isActive = false,
  onClick,
  orientation = 'horizontal',
  size = 'md',
  className = '',
}) => {
  if (orientation === 'vertical') {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ x: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          backgroundColor: folder.folderColor,
          color: folder.textColor,
        }}
        className={`group relative flex items-center justify-between text-left px-3 py-3 rounded-l-md font-sans text-xs sm:text-sm font-bold tracking-wide shadow-md transition-all border-l border-t border-b border-white/20 ${
          isActive ? 'ring-2 ring-white/60 shadow-xl z-20 translate-x-0' : 'opacity-90 hover:opacity-100 z-10'
        } ${className}`}
      >
        <span className="truncate pr-2 uppercase font-mono tracking-wider text-[11px]">
          {folder.label}
        </span>
        <span className="text-[9px] font-mono opacity-70 px-1 py-0.5 rounded bg-black/20">
          {folder.indexNumber}
        </span>
      </motion.button>
    );
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm sm:text-base',
    lg: 'px-6 py-3.5 text-base sm:text-lg',
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ y: 0 }}
      style={{
        backgroundColor: folder.folderColor,
        color: folder.textColor,
      }}
      className={`relative inline-flex items-center gap-2.5 font-sans font-bold tracking-wide rounded-t-xl shadow-md transition-all border-t border-l border-r border-white/25 select-none ${
        sizeClasses[size]
      } ${
        isActive
          ? 'z-30 shadow-2xl brightness-105 ring-1 ring-white/40'
          : 'opacity-95 hover:opacity-100 hover:brightness-110 z-10'
      } ${className}`}
    >
      <span className="font-mono text-[10px] sm:text-xs opacity-75 px-1.5 py-0.5 rounded bg-black/25">
        {folder.indexNumber}
      </span>
      <span className="tracking-wide">{folder.label}</span>

      {/* Die-cut right slope visual curve */}
      <span
        className="absolute -right-3 bottom-0 w-3 h-full pointer-events-none"
        style={{
          backgroundColor: 'inherit',
          clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
        }}
      />
    </motion.button>
  );
};
