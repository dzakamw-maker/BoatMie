import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "BoatMie // Dzaka's Archive Dossier",
  description: 'Interactive physical dossier portfolio of Dzaka — Full-stack Web Ecosystem Developer & PPLG/IT Student.',
  keywords: ['Dzaka', 'BoatMie', 'Portfolio', 'Fullstack Developer', 'Next.js', 'React', 'Dossier Archive', 'Mosby Style'],
  authors: [{ name: 'Dzaka' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-[#121316] text-[#f4efe6] antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
