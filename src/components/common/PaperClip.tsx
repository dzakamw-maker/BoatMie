import React from 'react';

interface PaperClipProps {
  className?: string;
  color?: string;
}

export const PaperClip: React.FC<PaperClipProps> = ({
  className = 'w-6 h-14',
  color = '#94a3b8',
}) => {
  return (
    <div className={`relative inline-block pointer-events-none drop-shadow-md ${className}`}>
      <svg
        viewBox="0 0 28 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M10 14V48C10 54.6274 15.3726 60 22 60C28.6274 60 34 54.6274 34 48V8C34 3.58172 30.4183 0 26 0C21.5817 0 18 3.58172 18 8V44C18 46.2091 19.7909 48 22 48C24.2091 48 26 46.2091 26 44V14"
          transform="translate(-6, 0)"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Metal shine highlight */}
        <path
          d="M11 16V48C11 53 15 57 21 57"
          transform="translate(-6, 0)"
          stroke="#f8fafc"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};
