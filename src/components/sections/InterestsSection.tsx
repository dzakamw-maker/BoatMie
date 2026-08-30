'use client';

import React, { useState, useEffect } from 'react';
import { INTERESTS_DATA } from '@/data/dossierData';
import { fetchInterests, normalizeImageUrl } from '@/lib/firestore';
import { InterestItem } from '@/types/dossier';
import { StampBadge } from '../common/StampBadge';
import { TapeStrip } from '../common/TapeStrip';
import { Coffee, Compass, Gamepad2, Waves, Sparkles, CheckCircle2 } from 'lucide-react';

interface InterestsSectionProps {
  previewInterests?: InterestItem[];
  initialSelectedId?: string;
}

export const InterestsSection: React.FC<InterestsSectionProps> = ({
  previewInterests,
  initialSelectedId,
}) => {
  const [interests, setInterests] = useState<InterestItem[]>(previewInterests || INTERESTS_DATA);
  const [activeInterestId, setActiveInterestId] = useState<string>(
    initialSelectedId || previewInterests?.[0]?.id || INTERESTS_DATA[0].id
  );

  useEffect(() => {
    if (previewInterests) {
      setInterests(previewInterests);
      if (initialSelectedId) {
        setActiveInterestId(initialSelectedId);
      } else if (previewInterests.length > 0 && !previewInterests.some((i) => i.id === activeInterestId)) {
        setActiveInterestId(previewInterests[0].id);
      }
      return;
    }
    fetchInterests().then((data) => {
      if (data && data.length > 0) {
        setInterests(data);
        if (!activeInterestId) setActiveInterestId(data[0].id);
      }
    });
  }, [previewInterests, initialSelectedId]);

  const [imageLoadError1, setImageLoadError1] = useState<boolean>(false);
  const [imageLoadError2, setImageLoadError2] = useState<boolean>(false);

  const activeInterest = interests.find((item) => item.id === activeInterestId) || interests[0] || INTERESTS_DATA[0];

  useEffect(() => {
    setImageLoadError1(false);
    setImageLoadError2(false);
  }, [activeInterest?.id, activeInterest?.imageUrl, activeInterest?.imageUrl2]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    setError: (val: boolean) => void
  ) => {
    const target = e.currentTarget;
    const currentSrc = target.src;
    const fileIdMatch = currentSrc.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{20,})/i);
    const fileId = fileIdMatch ? fileIdMatch[1] : null;
    if (fileId) {
      if (currentSrc.includes('lh3.googleusercontent.com')) {
        target.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
        return;
      } else if (currentSrc.includes('thumbnail')) {
        target.src = `https://drive.google.com/uc?export=view&id=${fileId}`;
        return;
      }
    }
    setError(true);
  };

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
        {interests.map((item) => {
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
      <div className="bg-white/70 p-6 sm:p-8 rounded-sm border border-neutral-200 shadow-sm space-y-8">
        {/* Top Content: Editorial Text & Observation Metrics (Full Width) */}
        <div className="space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {(activeInterest.details || []).map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded bg-white/60 border border-neutral-200/80">
                  <CheckCircle2 className="w-4 h-4 text-red-600 mt-1 shrink-0" />
                  <span className="font-serif text-sm sm:text-base text-neutral-800 leading-snug">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Photographic Field Evidence (2 Photos) */}
        <div className="pt-6 border-t border-neutral-300/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-neutral-800">
                FIELD PHOTOGRAPHIC EVIDENCE // ARCHIVED SNAPSHOTS
              </h3>
            </div>
            <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
              ATTACHMENTS: 02 SLOTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-stretch">
            {/* Photo 1: Primary Snapshot */}
            <div className="relative bg-white p-3.5 sm:p-4 rounded shadow-md border border-neutral-200 group flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <TapeStrip rotate={-2} width="w-20" />
              </div>
              <div className="aspect-[16/10] sm:aspect-[4/3] w-full bg-neutral-100 rounded overflow-hidden relative">
                {activeInterest.imageUrl && !imageLoadError1 ? (
                  <img
                    key={`photo1-${activeInterest.id}-${activeInterest.imageUrl}`}
                    src={normalizeImageUrl(activeInterest.imageUrl)}
                    alt={`${activeInterest.title} - Snapshot 01`}
                    referrerPolicy="no-referrer"
                    style={{
                      objectPosition: `${activeInterest.imagePosX ?? 50}% ${activeInterest.imagePosY ?? 50}%`,
                      transformOrigin: `${activeInterest.imagePosX ?? 50}% ${activeInterest.imagePosY ?? 50}%`,
                      transform: `scale(${(activeInterest.imageScale ?? 100) / 100})`,
                    }}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.03]"
                    onError={(e) => handleImageError(e, setImageLoadError1)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-neutral-400 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded">
                    <Sparkles className="w-8 h-8 text-neutral-300 mb-2" />
                    <span className="font-mono text-xs uppercase font-bold text-neutral-500">
                      PHOTO 01 // NO IMAGE ATTACHED
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-neutral-600 uppercase tracking-wider px-1">
                <span className="font-bold text-neutral-800">FIELD SNAPSHOT #01</span>
                <span className="text-neutral-500 text-[10px]">{activeInterest.badge}</span>
              </div>
            </div>

            {/* Photo 2: Secondary Snapshot */}
            <div className="relative bg-white p-3.5 sm:p-4 rounded shadow-md border border-neutral-200 group flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <TapeStrip rotate={2} width="w-20" />
              </div>
              <div className="aspect-[16/10] sm:aspect-[4/3] w-full bg-neutral-100 rounded overflow-hidden relative">
                {activeInterest.imageUrl2 && !imageLoadError2 ? (
                  <img
                    key={`photo2-${activeInterest.id}-${activeInterest.imageUrl2}`}
                    src={normalizeImageUrl(activeInterest.imageUrl2)}
                    alt={`${activeInterest.title} - Snapshot 02`}
                    referrerPolicy="no-referrer"
                    style={{
                      objectPosition: `${activeInterest.imagePosX2 ?? 50}% ${activeInterest.imagePosY2 ?? 50}%`,
                      transformOrigin: `${activeInterest.imagePosX2 ?? 50}% ${activeInterest.imagePosY2 ?? 50}%`,
                      transform: `scale(${(activeInterest.imageScale2 ?? 100) / 100})`,
                    }}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.03]"
                    onError={(e) => handleImageError(e, setImageLoadError2)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-neutral-50/90 border-2 border-dashed border-neutral-300 rounded hover:bg-neutral-100/60 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-neutral-200/80 flex items-center justify-center mb-2 shadow-xs">
                      <Sparkles className="w-5 h-5 text-neutral-600" />
                    </div>
                    <span className="font-mono text-xs uppercase font-bold text-neutral-700 mb-1">
                      FIELD SNAPSHOT #02 [SLOT TERSEDIA]
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500 max-w-[220px]">
                      Siap diisi tautan foto kedua di Panel Admin
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-neutral-600 uppercase tracking-wider px-1">
                <span className="font-bold text-neutral-800">FIELD SNAPSHOT #02</span>
                <span className="text-neutral-500 text-[10px]">
                  {activeInterest.imageUrl2 ? activeInterest.badge : 'PENDING ATTACHMENT'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
