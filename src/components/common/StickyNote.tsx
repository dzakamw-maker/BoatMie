import React from 'react';
import { TapeStrip } from './TapeStrip';

interface StickyNoteProps {
  title?: string;
  children: React.ReactNode;
  color?: 'yellow' | 'pink' | 'blue' | 'green';
  rotate?: number;
  className?: string;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  title,
  children,
  color = 'yellow',
  rotate = 1.5,
  className = '',
}) => {
  const colorMap = {
    yellow: 'bg-[#fef08a] text-[#713f12] shadow-[#ca8a04]/20',
    pink: 'bg-[#fbcfe8] text-[#831843] shadow-[#db2777]/20',
    blue: 'bg-[#bae6fd] text-[#0369a1] shadow-[#0284c7]/20',
    green: 'bg-[#bbf7d0] text-[#14532d] shadow-[#16a34a]/20',
  };

  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`relative p-5 shadow-lg rounded-sm transition-transform hover:rotate-0 hover:scale-105 duration-200 ${colorMap[color]} ${className}`}
    >
      {/* Tape on top center */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <TapeStrip rotate={-1} width="w-20" />
      </div>

      {title && (
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider mb-2 border-b border-current/20 pb-1">
          {title}
        </h4>
      )}
      <div className="font-mono text-xs leading-relaxed">{children}</div>
    </div>
  );
};
