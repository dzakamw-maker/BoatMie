import React from 'react';

interface TapeStripProps {
  className?: string;
  rotate?: number;
  width?: string;
}

export const TapeStrip: React.FC<TapeStripProps> = ({
  className = '',
  rotate = 2,
  width = 'w-24',
}) => {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`h-5 ${width} bg-amber-100/60 backdrop-blur-xs border-x border-dashed border-amber-300/40 shadow-xs pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};
