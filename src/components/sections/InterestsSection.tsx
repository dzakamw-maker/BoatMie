'use client';

import React, { useState } from 'react';
import { INTERESTS_DATA } from '@/data/dossierData';
import { StampBadge } from '../common/StampBadge';
import { TapeStrip } from '../common/TapeStrip';
import { StickyNote } from '../common/StickyNote';
import { Coffee, Compass, Gamepad2, Waves, Disc3, Sparkles, CheckCircle2 } from 'lucide-react';

export const InterestsSection: React.FC = () => {
  const [activeInterestId, setActiveInterestId] = useState<string>(INTERESTS_DATA[0].id);
  const activeInterest = INTERESTS_DATA.find((item) => item.id === activeInterestId) || INTERESTS_DATA[0];

  const getInterestIcon = (id: string) => {
    switch (id) {
      case 'nongkrong':
        return <Coffee className="w-5 h-5" />;
      case 'ekspedisi':
        return <Compass className="w-5 h-5" />;
      case 'mobile-legends':
        return <Gamepad2 className="w-5 h-5" />;
      case 'renang':
        return <Waves className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 text-neutral-900">
      {/* Dossier Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-neutral-300 pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest text-red-800 bg-red-100 px-2 py-0.5 rounded">
            DOSSIER #02
          </span>
          <span className="text-neutral-500">SUBJECT: FIELD NOTES & PERSONAL PURSUITS</span>
        </div>
        <div className="flex items-center gap-2">
          <StampBadge text="FIELD REPORT // OBSERVATION" variant="red" rotate={2} />
        </div>
      </div>

      {/* Intro Header */}
      <div className="space-y-2">
        <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide text-neutral-950 leading-tight">
          CATATAN LAPANGAN
        </h1>
        <p className="font-serif text-base sm:text-lg text-neutral-700 max-w-3xl leading-relaxed">
          From late-night coffee brainstorms and scenic highland roadtrips to competitive Mobile Legends squad grinds and restorative laps in the pool.
        </p>
      </div>

      {/* Interactive Tabs / Index Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {INTERESTS_DATA.map((item) => {
          const isSelected = item.id === activeInterestId;
          return (
            <button
              key={item.id}
              onClick={() => setActiveInterestId(item.id)}
              className={`p-4 rounded-md border text-left transition-all flex flex-col justify-between min-h-[105px] ${
                isSelected
                  ? 'bg-red-600 text-white border-red-700 shadow-md translate-y-[-2px] ring-2 ring-red-400/40'
                  : 'bg-white text-neutral-900 border-neutral-300 hover:border-red-400 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`${isSelected ? 'text-white' : 'text-red-600'}`}>
                    {getInterestIcon(item.id)}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                      isSelected ? 'text-red-100' : 'text-neutral-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
                <h4
                  className={`font-sans text-sm sm:text-base leading-tight uppercase tracking-wide ${
                    isSelected ? 'text-white' : 'text-neutral-950'
                  }`}
                >
                  {item.title.split('&')[0].trim()}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Area: Active Interest Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white/60 p-6 rounded-sm border border-neutral-200 shadow-sm">
        {/* Left Side: Editorial & Field Notes (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-red-700 font-bold">
              {activeInterest.badge} // CASE LOG
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide text-neutral-950 leading-tight">
              {activeInterest.title}
            </h2>
            <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
              {activeInterest.tagline}
            </p>
          </div>

          <p className="font-serif text-base sm:text-lg text-neutral-800 leading-relaxed drop-cap">
            {activeInterest.content}
          </p>

          {/* Key Bullet Observations */}
          <div className="space-y-3 pt-2">
            <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-700 border-b border-neutral-200 pb-1">
              OBSERVATION METRICS & CORE PRINCIPLES
            </h4>
            <div className="space-y-2">
              {activeInterest.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-red-600 mt-1 shrink-0" />
                  <span className="font-serif text-sm sm:text-base text-neutral-800 leading-snug">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Cassette / Polaroid / Field Note Artifact (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {activeInterest.imageUrl && (
            <div className="relative bg-white p-3 rounded shadow-md border border-neutral-200 group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <TapeStrip rotate={2} width="w-16" />
              </div>
              <div className="aspect-[4/3] w-full bg-neutral-100 rounded overflow-hidden">
                <img
                  src={activeInterest.imageUrl}
                  alt={activeInterest.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget.parentElement?.parentElement as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="mt-2 font-mono text-[10px] text-neutral-500 uppercase tracking-widest text-center truncate">
                FIELD SNAPSHOT // {activeInterest.badge}
              </div>
            </div>
          )}

          {/* Audio / Visual Field Recording Box */}
          <div className="relative bg-neutral-900 text-white p-5 rounded shadow-lg border border-neutral-800">
            <div className="absolute -top-3 right-6">
              <TapeStrip rotate={-3} width="w-20" />
            </div>

            <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <Disc3 className="w-4 h-4 text-red-500 animate-spin" />
                <span className="font-mono text-[10px] tracking-widest text-red-400 uppercase">
                  FIELD AUDIO CASSETTE
                </span>
              </div>
              <span className="font-mono text-[10px] text-neutral-400">REC [●]</span>
            </div>

            {/* Cassette reel mockup */}
            <div className="bg-neutral-950 p-4 rounded border border-neutral-800 space-y-3">
              <div className="flex justify-around items-center py-2">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-red-500/50 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-neutral-800" />
                </div>
                <div className="h-1 flex-1 mx-4 bg-neutral-800 rounded relative overflow-hidden">
                  <div className="h-full bg-red-600 w-2/3 animate-pulse" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-red-500/50 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-neutral-800" />
                </div>
              </div>
              <div className="font-mono text-[10px] sm:text-[11px] text-neutral-300 text-center tracking-wider px-1">
                TAPE REF: {activeInterest.id.toUpperCase().replace('-', '_')}.WAV
              </div>
            </div>
          </div>

          {/* Sticky Note: Field Log Quotes */}
          <StickyNote title="FIELD LOG ARCHIVE" color="pink" rotate={2}>
            {activeInterest.fieldNotes.map((note, idx) => (
              <div key={idx} className="mb-2 last:mb-0">
                {note}
              </div>
            ))}
          </StickyNote>
        </div>
      </div>
    </div>
  );
};
