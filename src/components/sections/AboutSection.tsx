'use client';

import React, { useState, useEffect } from 'react';
import { ABOUT_DATA } from '@/data/dossierData';
import { fetchAbout } from '@/lib/firestore';
import { AboutData } from '@/types/dossier';
import { PaperClip } from '../common/PaperClip';
import { StampBadge } from '../common/StampBadge';
import { StickyNote } from '../common/StickyNote';
import { TapeStrip } from '../common/TapeStrip';
import { Terminal, Compass, Sparkles, Code2, Layers, Cpu, ArrowUpRight } from 'lucide-react';

interface AboutSectionProps {
  onOpenProjects?: () => void;
  onOpenContact?: () => void;
  previewData?: AboutData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenProjects,
  onOpenContact,
  previewData,
}) => {
  const [about, setAbout] = useState<AboutData>(previewData || ABOUT_DATA);

  useEffect(() => {
    if (previewData) {
      setAbout(previewData);
      return;
    }
    fetchAbout().then((data) => {
      if (data && data.name) {
        setAbout(data);
      }
    });
  }, [previewData]);
  return (
    <div className="space-y-8 text-neutral-900">
      {/* Top Dossier Memo Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-neutral-300 pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
            DOSSIER #01
          </span>
          <span className="text-neutral-500">SUBJECT: IDENTIFICATION & CORE SUMMARY</span>
        </div>
        <div className="flex items-center gap-2">
          <StampBadge text="AUTHENTIC RECORD" variant="blue" rotate={-1} />
        </div>
      </div>

      {/* Main Grid: Left Identity Card + Right Bio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: ID Badge & Quick Specs (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Physical ID / Photo Artifact */}
          <div className="relative bg-white p-5 rounded-sm shadow-md border border-neutral-200">
            {/* Paperclip clipping the ID card */}
            <div className="absolute -top-6 left-6 z-20">
              <PaperClip className="w-7 h-14" color="#64748b" />
            </div>

            {/* Tape on top corner */}
            <div className="absolute -top-2 right-4">
              <TapeStrip rotate={5} width="w-16" />
            </div>

            {/* Avatar / Portrait Photo */}
            <div className="relative aspect-square w-full bg-gradient-to-br from-neutral-800 to-neutral-950 rounded-sm overflow-hidden flex flex-col items-center justify-center text-white text-center shadow-inner border border-neutral-700 group">
              {about.avatarUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={about.avatarUrl}
                    alt={about.name}
                    className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                      const fallback = document.getElementById('avatar-fallback');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div id="avatar-fallback" style={{ display: 'none' }} className="w-full h-full flex flex-col items-center justify-center p-4">
                    <div className="w-20 h-20 rounded-full bg-blue-600/20 border-2 border-blue-400 flex items-center justify-center mb-3 shadow-lg">
                      <Terminal className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="font-sans text-xl font-black tracking-wider uppercase">{about.name}</h3>
                    <p className="font-mono text-[11px] text-blue-300 tracking-widest uppercase mt-0.5">
                      {about.alias}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="w-20 h-20 rounded-full bg-blue-600/20 border-2 border-blue-400 flex items-center justify-center mb-3 shadow-lg">
                    <Terminal className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="font-sans text-xl font-black tracking-wider uppercase">{about.name}</h3>
                  <p className="font-mono text-[11px] text-blue-300 tracking-widest uppercase mt-0.5">
                    {about.alias}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Summary Badge below photo */}
            <div className="mt-4 pt-3 border-t border-neutral-200 font-mono text-[11px] space-y-1.5 text-neutral-600">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 uppercase">Status:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 uppercase">Focus:</span>
                <span className="text-neutral-900 font-bold">Full-Stack & Applied AI</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 uppercase">Location:</span>
                <span className="text-neutral-900">{about.location}</span>
              </div>
            </div>
          </div>

          {/* Sticky Note: Personal Directive */}
          <StickyNote title="FIELD DIRECTIVE" color="yellow" rotate={-2}>
            {about.fieldDirective ||
              '"A clean, responsive interface is not an afterthought — it is the foundation of user trust. Build minimal, build durable, make it tactile."'}
          </StickyNote>
        </div>

        {/* Right Column: Editorial Bio & Focus Areas (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-neutral-950 leading-none mb-3">
              DZAKA
            </h1>
            <p className="font-mono text-sm sm:text-base text-blue-700 font-bold uppercase tracking-wider">
              {about.role}
            </p>
          </div>

          {/* Lead Editorial Paragraph with Drop Cap */}
          <div className="prose prose-neutral max-w-none">
            {about.bioParagraphs?.[0] && (
              <p className="font-serif text-lg sm:text-xl text-neutral-800 leading-relaxed drop-cap mb-4">
                {about.bioParagraphs[0]}
              </p>
            )}
            {about.bioParagraphs?.[1] && (
              <p className="font-serif text-base sm:text-lg text-neutral-700 leading-relaxed mb-4">
                {about.bioParagraphs[1]}
              </p>
            )}
            {about.bioParagraphs?.[2] && (
              <p className="font-serif text-base sm:text-lg text-neutral-700 leading-relaxed">
                {about.bioParagraphs[2]}
              </p>
            )}
            {(!about.bioParagraphs || about.bioParagraphs.length === 0) && (
              <p className="font-serif text-base sm:text-lg text-neutral-500 italic">
                Belum ada paragraf bio yang dimasukkan.
              </p>
            )}
          </div>

          {/* Core Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
            <div className="p-4 bg-white/70 rounded border border-neutral-200 hover:border-blue-400 transition-colors">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Code2 className="w-5 h-5" />
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide text-neutral-900">
                  Modern Reactive Frontends
                </h4>
              </div>
              <p className="font-serif text-xs text-neutral-600 leading-relaxed">
                Specialized in Next.js 15 App Router, TypeScript, and Framer Motion spring choreographies that feel natural and fluid.
              </p>
            </div>

            <div className="p-4 bg-white/70 rounded border border-neutral-200 hover:border-emerald-400 transition-colors">
              <div className="flex items-center gap-2 text-emerald-700 mb-2">
                <Layers className="w-5 h-5" />
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide text-neutral-900">
                  Scalable Backend Services
                </h4>
              </div>
              <p className="font-serif text-xs text-neutral-600 leading-relaxed">
                Pragmatic REST & serverless architectures with Firebase Firestore, Node.js, and SQL databases designed for zero bloat.
              </p>
            </div>

            <div className="p-4 bg-white/70 rounded border border-neutral-200 hover:border-purple-400 transition-colors">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <Cpu className="w-5 h-5" />
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide text-neutral-900">
                  Applied AI Integration
                </h4>
              </div>
              <p className="font-serif text-xs text-neutral-600 leading-relaxed">
                Leveraging Google Gemini & LLM APIs to build intuitive contextual tooling for micro-businesses and developer productivity.
              </p>
            </div>

            <div className="p-4 bg-white/70 rounded border border-neutral-200 hover:border-red-400 transition-colors">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide text-neutral-900">
                  Tactile UX & Stage Energy
                </h4>
              </div>
              <p className="font-serif text-xs text-neutral-600 leading-relaxed">
                Bringing the energy of live festival hosting and the precision of tactical gaming into digital design — keeping every interaction engaging, responsive, and intuitive.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onOpenProjects}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white font-mono text-xs uppercase tracking-wider font-bold rounded shadow-md hover:bg-neutral-800 transition-colors"
            >
              <span>Inspect Projects Archive</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-mono text-xs uppercase tracking-wider font-bold rounded shadow-md hover:bg-blue-700 transition-colors"
            >
              <span>Dispatch Contact Memo</span>
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
