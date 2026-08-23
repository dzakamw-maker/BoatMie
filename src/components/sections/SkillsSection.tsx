'use client';

import React, { useState, useEffect } from 'react';
import { SKILL_CATEGORIES } from '@/data/dossierData';
import { fetchSkillCategories } from '@/lib/firestore';
import { SkillCategory } from '@/types/dossier';
import { StampBadge } from '../common/StampBadge';
import { TechIcon } from '../common/TechIcon';
import { Cpu, Terminal, Database, Cloud, Layers } from 'lucide-react';

interface SkillsSectionProps {
  previewCategories?: SkillCategory[];
  initialActiveIndex?: number;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  previewCategories,
  initialActiveIndex = 0,
}) => {
  const [categories, setCategories] = useState<SkillCategory[]>(previewCategories || SKILL_CATEGORIES);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(initialActiveIndex);

  useEffect(() => {
    if (previewCategories) {
      setCategories(previewCategories);
      if (initialActiveIndex !== undefined && initialActiveIndex >= 0) {
        setActiveCategoryIndex(initialActiveIndex);
      }
      return;
    }
    fetchSkillCategories().then((data) => {
      if (data && data.length > 0) {
        setCategories(data);
      }
    });
  }, [previewCategories, initialActiveIndex]);

  const activeCategory = categories[activeCategoryIndex] || categories[0] || SKILL_CATEGORIES[0];

  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Terminal className="w-5 h-5" />;
      case 1:
        return <Layers className="w-5 h-5" />;
      case 2:
        return <Database className="w-5 h-5" />;
      case 3:
        return <Cloud className="w-5 h-5" />;
      default:
        return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 text-neutral-900">
      {/* Dossier Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-neutral-300 pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            DOSSIER #03
          </span>
          <span className="text-neutral-500">SUBJECT: TECHNICAL BLUEPRINTS & MASTERED STACK</span>
        </div>
        <div className="flex items-center gap-2">
          <StampBadge text="BLUEPRINT // SPEC-VERIFIED" variant="green" rotate={-2} />
        </div>
      </div>

      {/* Intro Header */}
      <div className="space-y-2">
        <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 uppercase">
          CETAK BIRU TEKNIS
        </h1>
        <p className="font-serif text-base sm:text-lg text-neutral-700 max-w-3xl leading-relaxed">
          Katalog spesifikasi 34 teknologi yang dikuasai secara mendalam — terbagi ke dalam modul bahasa pemrograman, arsitektur antarmuka frontend, rekayasa backend & basis data, hingga alur kerja DevOps & infrastruktur.
        </p>
      </div>

      {/* Blueprint Mode Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((cat, idx) => {
          const isSelected = idx === activeCategoryIndex;
          return (
            <button
              key={cat.code}
              onClick={() => setActiveCategoryIndex(idx)}
              className={`p-4 rounded-md text-left transition-all border flex flex-col justify-between min-h-[115px] ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-md translate-y-[-2px] ring-2 ring-emerald-400/40'
                  : 'bg-white text-neutral-900 border-neutral-300 hover:border-emerald-400 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`${isSelected ? 'text-white' : 'text-emerald-700'}`}>
                    {getCategoryIcon(idx)}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                      isSelected ? 'text-emerald-200' : 'text-neutral-500'
                    }`}
                  >
                    {cat.code}
                  </span>
                </div>
                <h4
                  className={`font-sans text-sm sm:text-base leading-tight uppercase tracking-wide ${
                    isSelected ? 'text-white' : 'text-neutral-950'
                  }`}
                >
                  {cat.title}
                </h4>
              </div>
              <div className={`font-mono text-[11px] mt-2 pt-1.5 border-t ${isSelected ? 'border-emerald-600 text-emerald-100' : 'border-neutral-200 text-neutral-500'}`}>
                {cat.skills.length} Technologies
              </div>
            </button>
          );
        })}
      </div>

      {/* Blueprint Visual Canvas */}
      <div className="bg-blueprint-grid text-white p-6 sm:p-8 rounded-sm shadow-xl border-2 border-emerald-500/40 relative overflow-hidden">
        {/* Technical Blueprint Corner Decals */}
        <div className="absolute top-3 left-4 font-mono text-[10px] text-cyan-300/80 tracking-widest">
          SYS-SCHEMATIC // REV: 2026.04 // GRID: 20x20mm
        </div>
        <div className="absolute top-3 right-4 font-mono text-[10px] text-cyan-300/80 tracking-widest hidden sm:block">
          STATUS: PRODUCTION-READY
        </div>

        <div className="pt-6 space-y-6">
          {/* Active Category Header */}
          <div className="border-b border-cyan-500/30 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs text-cyan-300 tracking-widest uppercase">
                {activeCategory.code} SPECIFICATION
              </span>
              <h3 className="font-sans text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
                {activeCategory.title}
              </h3>
              <p className="font-mono text-xs text-cyan-200/70 mt-1 max-w-2xl">
                {activeCategory.description}
              </p>
            </div>
            <div className="px-3 py-1 bg-cyan-950/80 border border-cyan-400/40 rounded font-mono text-xs text-cyan-300">
              MODULES: {(activeCategory.skills || []).length} UNITS
            </div>
          </div>

          {/* Blueprint Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeCategory.skills || []).map((skill) => (
              <div
                key={skill.name}
                className="p-4 bg-slate-900/85 backdrop-blur-xs rounded border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-900/95 transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-800/90 border border-cyan-500/30 flex items-center justify-center p-1.5 group-hover:border-cyan-400 group-hover:bg-slate-800 transition-colors shadow-xs shrink-0">
                      <TechIcon name={skill.name} className="w-full h-full object-contain" size={20} />
                    </div>
                    <h5 className="font-sans text-sm sm:text-base text-white uppercase tracking-wide group-hover:text-cyan-200 transition-colors">
                      {skill.name}
                    </h5>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider shrink-0">
                    {skill.level}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-cyan-900/50">
                  {(skill.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Blueprint Footer Schematics */}
          <div className="pt-4 border-t border-cyan-500/30 flex flex-wrap items-center justify-between text-cyan-300/70 font-mono text-[11px] gap-2">
            <span>DESIGNED UNDER THE YAGNI & CLEAN ARCHITECTURE STANDARD</span>
            <span>TOTAL MASTERED STACK: 34 TECHNOLOGIES</span>
          </div>
        </div>
      </div>
    </div>
  );
};


