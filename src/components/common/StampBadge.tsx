import React from 'react';

interface StampBadgeProps {
  text: string;
  variant?: 'red' | 'blue' | 'green' | 'amber' | 'black';
  rotate?: number;
  className?: string;
}

export const StampBadge: React.FC<StampBadgeProps> = ({
  text,
  variant = 'red',
  rotate = -3,
  className = '',
}) => {
  const variantStyles = {
    red: 'text-red-700 border-red-700 bg-red-500/5',
    blue: 'text-blue-700 border-blue-700 bg-blue-500/5',
    green: 'text-emerald-700 border-emerald-700 bg-emerald-500/5',
    amber: 'text-amber-700 border-amber-700 bg-amber-500/5',
    black: 'text-zinc-900 border-zinc-900 bg-zinc-500/5',
  };

  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block px-3 py-1 border-2 font-mono text-xs font-bold tracking-widest uppercase rounded select-none pointer-events-none ${variantStyles[variant]} ${className}`}
    >
      <span className="opacity-90">{text}</span>
    </div>
  );
};
