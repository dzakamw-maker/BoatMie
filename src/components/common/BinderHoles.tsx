import React from 'react';

interface BinderHolesProps {
  count?: number;
  className?: string;
}

export const BinderHoles: React.FC<BinderHolesProps> = ({
  count = 3,
  className = '',
}) => {
  return (
    <div className={`flex flex-col justify-between py-12 px-3 pointer-events-none select-none ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-4 h-4 rounded-full bg-[#121316] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.7)] my-12"
          aria-hidden="true"
        />
      ))}
    </div>
  );
};
