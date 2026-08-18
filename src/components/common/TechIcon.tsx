import React from 'react';
import {
  Terminal,
  Code2,
  FileCode,
  Layers,
  Database,
  Server,
  Cloud,
  Cpu,
  Package,
  Wrench,
  Sparkles,
  BookOpen,
  Boxes,
  Network,
  Binary,
} from 'lucide-react';

interface TechIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const TechIcon: React.FC<TechIconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  const normalized = name.toLowerCase().replace(/[\s\.\-_]/g, '');

  // SVG vectors for specific tech stacks
  switch (normalized) {
    case 'html5':
    case 'html':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 3L5.5 19.5L12 21.5L18.5 19.5L20 3H4Z" fill="#E34F26" />
          <path d="M12 4.5V19.8L17.2 18.2L18.4 4.5H12Z" fill="#EF652A" />
          <path d="M12 8.5H8.2L8.5 11.5H12V8.5ZM12 14.5L9.6 13.8L9.5 12.8H7.5L7.7 15.3L12 16.5V14.5Z" fill="#EBEBEB" />
          <path d="M12 8.5V11.5H15.6L15.3 14.5L12 15.4V17.5L16.4 16.3L16.8 11.5L17 8.5H12Z" fill="#FFFFFF" />
        </svg>
      );

    case 'css3':
    case 'css':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 3L5.5 19.5L12 21.5L18.5 19.5L20 3H4Z" fill="#1572B6" />
          <path d="M12 4.5V19.8L17.2 18.2L18.4 4.5H12Z" fill="#33A9DC" />
          <path d="M12 8.5H8.2L8.5 11.5H12V8.5ZM12 14.5L9.6 13.8L9.5 12.8H7.5L7.7 15.3L12 16.5V14.5Z" fill="#EBEBEB" />
          <path d="M12 8.5V11.5H15.6L15.3 14.5L12 15.4V17.5L16.4 16.3L16.8 11.5L17 8.5H12Z" fill="#FFFFFF" />
        </svg>
      );

    case 'javascript':
    case 'js':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="3" fill="#F7DF1E" />
          <path d="M6 14.5V17C6 18.1 6.8 19 8 19C9.2 19 9.8 18.2 9.8 17V12H8.2V17C8.2 17.4 8 17.6 7.8 17.6C7.6 17.6 7.4 17.4 7.4 17V14.5H6ZM13.8 14.8C14.2 14.4 14.8 14 15.8 14C17 14 17.8 14.6 17.8 15.6C17.8 16.6 17.2 17 16.2 17.4L15.6 17.6C15 17.8 14.8 18 14.8 18.4C14.8 18.8 15.2 19 15.8 19C16.6 19 17.2 18.6 17.6 18.2L18.4 19.2C17.8 19.8 16.8 20.2 15.8 20.2C14.2 20.2 13.2 19.4 13.2 18.2C13.2 17.2 13.8 16.6 14.8 16.2L15.4 16C16 15.8 16.2 15.6 16.2 15.2C16.2 14.8 15.8 14.6 15.4 14.6C14.8 14.6 14.4 14.8 14.2 15.2L13.8 14.8Z" fill="#000000" />
        </svg>
      );

    case 'typescript':
    case 'ts':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="3" fill="#3178C6" />
          <path d="M5.5 9.5H11.5V11H9.3V18H7.7V11H5.5V9.5ZM13.2 15C13.6 14.6 14.2 14.2 15.2 14.2C16.4 14.2 17.2 14.8 17.2 15.8C17.2 16.8 16.6 17.2 15.6 17.6L15 17.8C14.4 18 14.2 18.2 14.2 18.6C14.2 19 14.6 19.2 15.2 19.2C16 19.2 16.6 18.8 17 18.4L17.8 19.4C17.2 20 16.2 20.4 15.2 20.4C13.6 20.4 12.6 19.6 12.6 18.4C12.6 17.4 13.2 16.8 14.2 16.4L14.8 16.2C15.4 16 15.6 15.8 15.6 15.4C15.6 15 15.2 14.8 14.8 14.8C14.2 14.8 13.8 15 13.6 15.4L13.2 15Z" fill="#FFFFFF" />
        </svg>
      );

    case 'php':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <ellipse cx="12" cy="12" rx="10.5" ry="6.5" fill="#777BB4" />
          <text x="12" y="14" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">PHP</text>
        </svg>
      );

    case 'python':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M11.8 3C8.5 3 6.6 4.5 6.6 6.5V8H12V8.8H4.4C2.5 8.8 2 10.7 2 12.5C2 14.5 3.3 16 5.5 16H6.6V14.3C6.6 12.6 8 11.2 9.7 11.2H14.3C15.6 11.2 16.6 10.1 16.6 8.8V6.5C16.6 4.5 14.8 3 11.8 3ZM9.2 4.8C9.7 4.8 10.1 5.2 10.1 5.7C10.1 6.2 9.7 6.6 9.2 6.6C8.7 6.6 8.3 6.2 8.3 5.7C8.3 5.2 8.7 4.8 9.2 4.8Z" fill="#3776AB" />
          <path d="M12.2 21C15.5 21 17.4 19.5 17.4 17.5V16H12V15.2H19.6C21.5 15.2 22 13.3 22 11.5C22 9.5 20.7 8 18.5 8H17.4V9.7C17.4 11.4 16 12.8 14.3 12.8H9.7C8.4 12.8 7.4 13.9 7.4 15.2V17.5C7.4 19.5 9.2 21 12.2 21ZM14.8 19.2C14.3 19.2 13.9 18.8 13.9 18.3C13.9 17.8 14.3 17.4 14.8 17.4C15.3 17.4 15.7 17.8 15.7 18.3C15.7 18.8 15.3 19.2 14.8 19.2Z" fill="#FFD43B" />
        </svg>
      );

    case 'kotlin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M22 2H2V22H22L12 12L22 2Z" fill="#7F52FF" />
          <path d="M2 22L12 12L2 2V22Z" fill="#0095D5" />
          <path d="M12 12L2 22H22L12 12Z" fill="#E44857" />
        </svg>
      );

    case 'bashscript':
    case 'bash':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#293138" />
          <path d="M6 8L10 12L6 16M12 16H18" stroke="#4EAA25" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'powershell':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#1B2838" />
          <path d="M6 7L13 12L6 17M12 17H18" stroke="#5391FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'latex':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#008080" />
          <text x="12" y="15" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="serif">LᴬTᴇX</text>
        </svg>
      );

    case 'markdown':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="3" fill="#083FA1" />
          <path d="M4 7H20V17H4V7Z" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
          <path d="M7 14V10L9 12L11 10V14M17 12L15 10V14M15 12L17 14" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'react':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
        </svg>
      );

    case 'next':
    case 'nextjs':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="11" fill="#000000" stroke="#333333" strokeWidth="1" />
          <path d="M8 8V16M16 8L9.5 16.5M16 8V14" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'vuejs':
    case 'vue':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M2 4H6L12 14L18 4H22L12 21L2 4Z" fill="#41B883" />
          <path d="M6.5 4H10L12 7.5L14 4H17.5L12 13.5L6.5 4Z" fill="#34495E" />
        </svg>
      );

    case 'astro':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="11" fill="#BC52EE" />
          <path d="M9 16L12 6L15 16M10.2 13.5H13.8" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="18" r="1" fill="#FF5D01" />
        </svg>
      );

    case 'reactnative':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#20232A" />
          <ellipse cx="12" cy="12" rx="8" ry="3" stroke="#61DAFB" strokeWidth="1" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="8" ry="3" stroke="#61DAFB" strokeWidth="1" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="8" ry="3" stroke="#61DAFB" strokeWidth="1" transform="rotate(150 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="#61DAFB" />
        </svg>
      );

    case 'tailwindcss':
    case 'tailwind':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M6 10C6.5 8 8 7 10 7C12.5 7 13 8.5 14.5 9C15.5 9.3 16.5 9 17.5 8C17 10 15.5 11 13.5 11C11 11 10.5 9.5 9 9C8 8.7 7 9 6 10ZM2 15C2.5 13 4 12 6 12C8.5 12 9 13.5 10.5 14C11.5 14.3 12.5 14 13.5 13C13 15 11.5 16 9.5 16C7 16 6.5 14.5 5 14C4 13.7 3 14 2 15Z" fill="#06B6D4" />
        </svg>
      );

    case 'vite':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M19.5 4.5L12.5 21L3.5 5.5L19.5 4.5Z" fill="#646CFF" />
          <path d="M14.5 3L8.5 13H12.5L9.5 19L17.5 9.5H13.5L14.5 3Z" fill="#FFD62E" />
        </svg>
      );

    case 'nodejs':
    case 'node':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 2L21 7.2V16.8L12 22L3 16.8V7.2L12 2Z" fill="#339933" />
          <text x="12" y="14" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">JS</text>
        </svg>
      );

    case 'bun':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#18181B" />
          <circle cx="12" cy="12" r="7" fill="#FBF0DF" />
          <circle cx="9.5" cy="11.5" r="1" fill="#18181B" />
          <circle cx="14.5" cy="11.5" r="1" fill="#18181B" />
          <path d="M10 14.5C11 15.5 13 15.5 14 14.5" stroke="#18181B" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );

    case 'laravel':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#FF2D20" />
          <path d="M7 6L17 10L14 18L5 13L7 6Z" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
          <path d="M10 9L15 11" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      );

    case 'firebase':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4.5 16.5L7.5 4L11 9L8 16.5H4.5Z" fill="#FFA000" />
          <path d="M19.5 16.5L14.5 6L11 10L16 16.5H19.5Z" fill="#F57C00" />
          <path d="M4.5 16.5L12 21L19.5 16.5L12 11.5L4.5 16.5Z" fill="#FFCA28" />
        </svg>
      );

    case 'mysql':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#4479A1" />
          <text x="12" y="14.5" fill="#FFFFFF" fontSize="6.5" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">SQL</text>
        </svg>
      );

    case 'apache':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#D22128" />
          <path d="M12 4C10 7 8 11 8 16C9 18 11 19 12 20C13 19 15 18 16 16C16 11 14 7 12 4Z" fill="#FFFFFF" />
        </svg>
      );

    case 'jwt':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#000000" />
          <circle cx="8" cy="12" r="2.5" fill="#D63AFF" />
          <circle cx="16" cy="12" r="2.5" fill="#00B9F1" />
          <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
        </svg>
      );

    case 'vercel':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="11" fill="#000000" />
          <path d="M12 5L20 18H4L12 5Z" fill="#FFFFFF" />
        </svg>
      );

    case 'npm':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="3" fill="#CB3837" />
          <path d="M5 7H19V17H12V10H8.5V17H5V7Z" fill="#FFFFFF" />
        </svg>
      );

    case 'pnpm':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="3" fill="#F69220" />
          <rect x="5" y="5" width="4" height="4" fill="#FFFFFF" />
          <rect x="10" y="5" width="4" height="4" fill="#FFFFFF" />
          <rect x="15" y="5" width="4" height="4" fill="#FFFFFF" />
          <rect x="10" y="10" width="4" height="4" fill="#FFFFFF" />
          <rect x="15" y="10" width="4" height="4" fill="#FFFFFF" />
          <rect x="10" y="15" width="4" height="4" fill="#FFFFFF" />
        </svg>
      );

    case 'yarn':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#2C8EBB" />
          <circle cx="12" cy="12" r="6" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M12 6V18M6 12H18" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      );

    case 'gradle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="11" fill="#02303A" />
          <path d="M7 14C8 11 11 9 14 10C16 11 17 13 17 15C16 17 14 18 12 18C9 18 7 16 7 14Z" fill="#01C18D" />
        </svg>
      );

    case 'cisco':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#1BA0D7" />
          <path d="M4 14V17M7 11V17M10 8V17M13 11V17M16 8V17M19 11V17M22 14V17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'windowsterminal':
    case 'terminal':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#4D4D4D" />
          <path d="M6 8L11 12L6 16M12 16H18" stroke="#00D8D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'prettier':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#1A2B34" />
          <circle cx="8" cy="8" r="2.5" fill="#F7B93E" />
          <circle cx="15" cy="9" r="2.5" fill="#EA5E5E" />
          <circle cx="10" cy="15" r="2.5" fill="#56B3B4" />
          <circle cx="16" cy="16" r="2.5" fill="#BF85BF" />
        </svg>
      );

    case 'notion':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="4" fill="#000000" />
          <text x="12" y="16" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">N</text>
        </svg>
      );

    default:
      return <Code2 className={className} />;
  }
};
