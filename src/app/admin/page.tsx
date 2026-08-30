'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ProjectItem,
  CertificateItem,
  SkillCategory,
  InterestItem,
  ContactMessage,
  AboutData,
  ContactInfo,
} from '@/types/dossier';
import {
  fetchProjects,
  saveProject,
  deleteProject,
  fetchCertificates,
  sortCertificatesByDate,
  formatDateForInput,
  formatCertificateDisplayDate,
  normalizeImageUrl,
  saveCertificate,
  deleteCertificate,
  fetchSkillCategories,
  saveSkillCategory,
  deleteSkillCategory,
  fetchInterests,
  saveInterest,
  deleteInterest,
  fetchAbout,
  saveAbout,
  fetchContact,
  saveContact,
  fetchMessagesAdmin,
  markMessageRead,
  deleteMessage,
  seedInitialData,
} from '@/lib/firestore';
import {
  ABOUT_DATA,
  CONTACT_DATA,
} from '@/data/dossierData';
import { AboutSection } from '@/components/sections/AboutSection';
import { InterestsSection } from '@/components/sections/InterestsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CertificatesSection } from '@/components/sections/CertificatesSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { BinderHoles } from '@/components/common/BinderHoles';
import { PaperClip } from '@/components/common/PaperClip';
import {
  Unlock,
  FolderGit2,
  Award,
  Inbox,
  Database,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Image as ImageIcon,
  Shield,
  Eye,
  LogOut,
  User,
  Code2,
  Compass,
  X,
  Sparkles,
  Send,
  Mail,
  Star,
} from 'lucide-react';

interface ImageFramingInputProps {
  label: string;
  themeColor: 'blue' | 'purple' | 'amber' | 'red';
  imageUrl: string;
  placeholder?: string;
  helpText?: string;
  onImageUrlChange: (url: string) => void;
  posX?: number;
  posY?: number;
  scale?: number;
  onPositionChange: (posX: number, posY: number, scale: number) => void;
  aspectRatio?: 'square' | 'video' | '4/3';
  showGrayscalePreview?: boolean;
}

const CERT_CATEGORY_OPTIONS = [
  'Kompetensi',
  'Pelatihan',
  'AI & ML',
  'Fullstack',
  'Web Development',
  'Cloud & DevOps',
  'IT Fundamentals',
  'Kejuaraan',
  'Bahasa',
  'Organisasi',
  'Magang',
  'Lainnya',
];

const THEME_STYLES = {
  blue: {
    label: 'text-blue-400',
    borderFocus: 'focus:border-blue-500',
    accent: 'accent-blue-500',
    btnActive: 'bg-blue-950 text-blue-300 border-blue-800',
    textCoord: 'text-blue-400',
    frameBorder: 'border-blue-500/60',
  },
  purple: {
    label: 'text-purple-400',
    borderFocus: 'focus:border-purple-500',
    accent: 'accent-purple-500',
    btnActive: 'bg-purple-950 text-purple-300 border-purple-800',
    textCoord: 'text-purple-400',
    frameBorder: 'border-purple-500/60',
  },
  amber: {
    label: 'text-amber-400',
    borderFocus: 'focus:border-amber-500',
    accent: 'accent-amber-500',
    btnActive: 'bg-amber-950 text-amber-300 border-amber-800',
    textCoord: 'text-amber-400',
    frameBorder: 'border-amber-500/60',
  },
  red: {
    label: 'text-red-400',
    borderFocus: 'focus:border-red-500',
    accent: 'accent-red-500',
    btnActive: 'bg-red-950 text-red-300 border-red-800',
    textCoord: 'text-red-400',
    frameBorder: 'border-red-500/60',
  },
};

function ImageFramingInput({
  label,
  themeColor,
  imageUrl,
  placeholder,
  helpText,
  onImageUrlChange,
  posX = 50,
  posY = 50,
  scale = 100,
  onPositionChange,
  aspectRatio = 'square',
  showGrayscalePreview = false,
}: ImageFramingInputProps) {
  const t = THEME_STYLES[themeColor];
  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-video w-44'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3] w-36'
      : 'aspect-square w-32';

  const [isValid, setIsValid] = useState(true);
  const [previewSrc, setPreviewSrc] = useState(normalizeImageUrl(imageUrl));
  const [fallbackAttempted, setFallbackAttempted] = useState(false);

  useEffect(() => {
    setIsValid(true);
    setPreviewSrc(normalizeImageUrl(imageUrl));
    setFallbackAttempted(false);
  }, [imageUrl]);

  return (
    <div className="space-y-3 p-4 bg-neutral-900/90 rounded border border-neutral-800">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className={`block ${t.label} font-bold uppercase flex items-center gap-1.5 text-xs`}>
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{label}</span>
        </label>
        {imageUrl && (
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Live Framing Aktif
          </span>
        )}
      </div>

      <div>
        <input
          type="text"
          value={imageUrl || ''}
          onChange={(e) => onImageUrlChange(normalizeImageUrl(e.target.value))}
          placeholder={placeholder || 'https://... atau /media/...'}
          className={`w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white ${t.borderFocus} focus:outline-hidden text-xs`}
        />
        {helpText && <p className="text-[10px] text-neutral-400 mt-1">{helpText}</p>}
      </div>

      {imageUrl && (
        <div className="pt-3 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Live Framing Preview */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-neutral-950/90 rounded border border-neutral-800">
            <span className="text-[10px] uppercase font-mono text-neutral-400 mb-2">Live Dossier Frame</span>
            <div className={`relative ${aspectClass} bg-neutral-900 rounded-sm border-2 ${t.frameBorder} overflow-hidden shadow-inner flex items-center justify-center`}>
              {isValid && previewSrc ? (
                <img
                  src={previewSrc}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  style={{
                    objectPosition: `${posX}% ${posY}%`,
                    transformOrigin: `${posX}% ${posY}%`,
                    transform: `scale(${scale / 100})`,
                  }}
                  className={`w-full h-full object-cover transition-all duration-150 ${
                    showGrayscalePreview ? 'grayscale contrast-110' : ''
                  }`}
                  onError={() => {
                    // Try alternate Google Drive endpoints if one fails
                    const fileIdMatch = previewSrc.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{20,})/i);
                    const fileId = fileIdMatch ? fileIdMatch[1] : null;
                    if (fileId && !fallbackAttempted) {
                      setFallbackAttempted(true);
                      if (previewSrc.includes('thumbnail')) {
                        setPreviewSrc(`https://lh3.googleusercontent.com/d/${fileId}`);
                      } else {
                        setPreviewSrc(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`);
                      }
                      return;
                    }
                    setIsValid(false);
                  }}
                />
              ) : (
                <div className="text-[9px] text-red-400 p-2 text-center leading-tight font-sans">
                  <span className="font-bold block mb-0.5">URL Tidak Dapat Dimuat</span>
                  <span className="text-[8px] text-neutral-400 font-mono">Pastikan izin Google Drive: &quot;Siapa saja yang memiliki link&quot;</span>
                </div>
              )}
            </div>
            <span className="text-[9px] text-neutral-400 font-mono mt-2 text-center">
              X: {posX}% | Y: {posY}% | Zoom: {scale}%
            </span>
          </div>

          {/* Controls (Presets & Sliders) */}
          <div className="md:col-span-8 space-y-3 font-mono text-xs">
            {/* Presets */}
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1.5">
                Preset Posisi Cepat:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onPositionChange(50, 50, scale)}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[10px] border border-neutral-700 transition-colors"
                >
                  Tengah
                </button>
                <button
                  type="button"
                  onClick={() => onPositionChange(50, 15, scale)}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[10px] border border-neutral-700 transition-colors"
                >
                  Fokus Atas
                </button>
                <button
                  type="button"
                  onClick={() => onPositionChange(50, 85, scale)}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[10px] border border-neutral-700 transition-colors"
                >
                  Fokus Bawah
                </button>
                <button
                  type="button"
                  onClick={() => onPositionChange(15, 50, scale)}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[10px] border border-neutral-700 transition-colors"
                >
                  Fokus Kiri
                </button>
                <button
                  type="button"
                  onClick={() => onPositionChange(85, 50, scale)}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[10px] border border-neutral-700 transition-colors"
                >
                  Fokus Kanan
                </button>
                <button
                  type="button"
                  onClick={() => onPositionChange(50, 50, 100)}
                  className={`px-2.5 py-1 ${t.btnActive} rounded text-[10px] border transition-colors`}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Slider X */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-neutral-300">Posisi Horizontal (Kiri ↔ Kanan):</span>
                <span className={`${t.textCoord} font-bold`}>{posX}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={posX}
                onChange={(e) => onPositionChange(Number(e.target.value), posY, scale)}
                className={`w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer ${t.accent}`}
              />
              <div className="flex justify-between text-[9px] text-neutral-400">
                <span>0% (Kiri)</span>
                <span>50% (Tengah)</span>
                <span>100% (Kanan)</span>
              </div>
            </div>

            {/* Slider Y */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-neutral-300">Posisi Vertikal (Atas ↔ Bawah):</span>
                <span className={`${t.textCoord} font-bold`}>{posY}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={posY}
                onChange={(e) => onPositionChange(posX, Number(e.target.value), scale)}
                className={`w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer ${t.accent}`}
              />
              <div className="flex justify-between text-[9px] text-neutral-400">
                <span>0% (Paling Atas)</span>
                <span>50% (Tengah)</span>
                <span>100% (Paling Bawah)</span>
              </div>
            </div>

            {/* Slider Zoom */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-neutral-300">Zoom / Skala Foto:</span>
                <span className={`${t.textCoord} font-bold`}>{scale}%</span>
              </div>
              <input
                type="range"
                min={100}
                max={200}
                step={5}
                value={scale}
                onChange={(e) => onPositionChange(posX, posY, Number(e.target.value))}
                className={`w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer ${t.accent}`}
              />
              <div className="flex justify-between text-[9px] text-neutral-400">
                <span>100% (Normal)</span>
                <span>150% (Zoom 1.5x)</span>
                <span>200% (Zoom 2x)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'about' | 'interests' | 'skills' | 'projects' | 'certificates' | 'contact' | 'messages' | 'database'
  >('about');

  // Loading & notification states
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data states
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [interests, setInterests] = useState<InterestItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [aboutData, setAboutData] = useState<AboutData>(ABOUT_DATA);
  const [contactData, setContactData] = useState<ContactInfo>(CONTACT_DATA);

  // Editing states
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editingSkillCode, setEditingSkillCode] = useState<string | null>(null);
  const [editingInterestId, setEditingInterestId] = useState<string | null>(null);

  // --- Project Form State ---
  const initialProjectForm: Partial<ProjectItem> & { techStackRaw?: string; metricsRaw?: string; sortOrder?: number } = {
    id: '',
    title: '',
    subtitle: '',
    category: 'Full-Stack Web App',
    description: '',
    caseStudy: '',
    techStackRaw: '',
    repoUrl: '',
    liveUrl: '',
    imageUrl: '',
    imagePosX: 50,
    imagePosY: 50,
    imageScale: 100,
    featured: false,
    date: '2026',
    status: 'Deployed',
    metricsRaw: '',
    sortOrder: 0,
  };
  const [projectForm, setProjectForm] = useState(initialProjectForm);

  // --- Certificate Form State ---
  const initialCertForm: Partial<CertificateItem> & { skillsRaw?: string; sortOrder?: number } = {
    id: '',
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    category: 'Kompetensi',
    description: '',
    skillsRaw: '',
    verificationUrl: '',
    imageUrl: '',
    imagePosX: 50,
    imagePosY: 50,
    imageScale: 100,
    sortOrder: 0,
  };
  const [certForm, setCertForm] = useState(initialCertForm);

  // --- Skill Category Form State ---
  const initialSkillForm: Partial<SkillCategory> & { skillsRaw?: string; sortOrder?: number } = {
    title: '',
    code: 'SKILL-01',
    description: '',
    skillsRaw: '',
    sortOrder: 0,
  };
  const [skillForm, setSkillForm] = useState(initialSkillForm);

  // --- Interest Form State ---
  const initialInterestForm: Partial<InterestItem> & { detailsRaw?: string; fieldNotesRaw?: string; sortOrder?: number } = {
    id: '',
    title: '',
    tagline: '',
    badge: 'EXPEDITION LOG',
    imageUrl: '',
    imagePosX: 50,
    imagePosY: 50,
    imageScale: 100,
    imageUrl2: '',
    imagePosX2: 50,
    imagePosY2: 50,
    imageScale2: 100,
    content: '',
    detailsRaw: '',
    fieldNotesRaw: '',
    sortOrder: 0,
  };
  const [interestForm, setInterestForm] = useState(initialInterestForm);

  // --- Preview Modal State ---
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<
    'about' | 'interests' | 'skills' | 'projects' | 'certificates' | 'contact'
  >('about');

  // Handle ESC key to close preview modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewModalOpen) {
        setPreviewModalOpen(false);
      }
    };
    if (previewModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [previewModalOpen]);

  const handleOpenPreview = (tab?: 'about' | 'interests' | 'skills' | 'projects' | 'certificates' | 'contact') => {
    if (tab) {
      setPreviewTab(tab);
    } else {
      switch (activeTab) {
        case 'about':
          setPreviewTab('about');
          break;
        case 'interests':
          setPreviewTab('interests');
          break;
        case 'skills':
          setPreviewTab('skills');
          break;
        case 'projects':
          setPreviewTab('projects');
          break;
        case 'certificates':
          setPreviewTab('certificates');
          break;
        case 'contact':
          setPreviewTab('contact');
          break;
        default:
          setPreviewTab('about');
          break;
      }
    }
    setPreviewModalOpen(true);
  };

  const getPreviewFolderColor = (tab: string) => {
    switch (tab) {
      case 'about':
        return '#2563eb';
      case 'interests':
        return '#dc2626';
      case 'skills':
        return '#059669';
      case 'projects':
        return '#7c3aed';
      case 'certificates':
        return '#d97706';
      case 'contact':
        return '#334155';
      default:
        return '#2563eb';
    }
  };

  const getPreviewModalTitle = (tab: string) => {
    switch (tab) {
      case 'about':
        return 'DOSSIER #01 // ABOUT ME & PROFIL';
      case 'interests':
        return 'DOSSIER #02 // CATATAN LAPANGAN (INTERESTS)';
      case 'skills':
        return 'DOSSIER #03 // CETAK BIRU TEKNIS (SKILLS)';
      case 'projects':
        return 'DOSSIER #04 // KATALOG PROYEK (PROJECTS)';
      case 'certificates':
        return 'DOSSIER #05 // SERTIFIKAT & PENCAPAIAN';
      case 'contact':
        return 'DOSSIER #06 // TRANSMISI & KONTAK';
      default:
        return 'DOSSIER PRATINJAU';
    }
  };

  const getPreviewFolderIndex = (tab: string) => {
    switch (tab) {
      case 'about':
        return 'FILE-01';
      case 'interests':
        return 'FILE-02';
      case 'skills':
        return 'FILE-03';
      case 'projects':
        return 'FILE-04';
      case 'certificates':
        return 'FILE-05';
      case 'contact':
        return 'FILE-06';
      default:
        return 'FILE-01';
    }
  };

  const getPreviewFolderCategory = (tab: string) => {
    switch (tab) {
      case 'about':
        return 'IDENTIFIKASI AGEN // ABOUT ME';
      case 'interests':
        return 'OBSERVASI & MINAT // FIELD LOG';
      case 'skills':
        return 'CETAK BIRU TEKNIS // SPEC-VERIFIED';
      case 'projects':
        return 'GALERI ARSIP KARYA // DEPLOYED';
      case 'certificates':
        return 'AKREDITASI & KREDENSIAL // OFFICIAL';
      case 'contact':
        return 'JARINGAN TRANSMISI // DIRECT MEMO';
      default:
        return 'DOSSIER';
    }
  };

  // Draft Data Constructors for real-time preview
  const getDraftAboutData = () => {
    const bioArray = Array.isArray(aboutData.bioParagraphs)
      ? aboutData.bioParagraphs
      : typeof aboutData.bioParagraphs === 'string'
      ? (aboutData.bioParagraphs as string).split('\n')
      : [];
    const statsArray = Array.isArray(aboutData.stats) ? aboutData.stats : [];
    return {
      ...aboutData,
      avatarPosX: aboutData.avatarPosX ?? 50,
      avatarPosY: aboutData.avatarPosY ?? 50,
      avatarScale: aboutData.avatarScale ?? 100,
      name: aboutData.name || '',
      alias: aboutData.alias || '',
      avatarUrl: aboutData.avatarUrl || '',
      role: aboutData.role || '',
      status: aboutData.status || 'Active',
      location: aboutData.location || '',
      classification: aboutData.classification || 'IDENTIFICATION & CORE SUMMARY',
      caseSummary: aboutData.caseSummary || '',
      fieldDirective: aboutData.fieldDirective || '',
      bioParagraphs: bioArray,
      stats: statsArray,
    };
  };

  const getDraftContactData = () => {
    return contactData || CONTACT_DATA;
  };

  const getDraftProjectsList = () => {
    const techArray = projectForm.techStackRaw
      ? projectForm.techStackRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : projectForm.techStack || [];

    const metricsArray = projectForm.metricsRaw
      ? projectForm.metricsRaw.split('\n').filter(Boolean).map((line) => {
          const [label, value] = line.split('|').map((s) => s.trim());
          return { label: label || '', value: value || '' };
        })
      : projectForm.metrics || [];

    const draftProject: ProjectItem = {
      id: projectForm.id?.trim() || editingProjectId || 'draft-preview-project',
      title: projectForm.title || 'Judul Proyek (Preview Draft)',
      subtitle: projectForm.subtitle || 'Tagline atau ringkasan proyek...',
      category: projectForm.category || 'Web Application',
      description: projectForm.description || 'Deskripsi ringkasan proyek yang sedang diketik...',
      caseStudy: projectForm.caseStudy || 'Rincian studi kasus dan implementasi arsitektur...',
      techStack: techArray.length > 0 ? techArray : ['Next.js', 'React', 'TypeScript'],
      repoUrl: projectForm.repoUrl || '',
      liveUrl: projectForm.liveUrl || '',
      imageUrl: projectForm.imageUrl || '',
      imagePosX: projectForm.imagePosX ?? 50,
      imagePosY: projectForm.imagePosY ?? 50,
      imageScale: projectForm.imageScale ?? 100,
      featured: projectForm.featured ?? false,
      date: projectForm.date || '2026',
      status: (projectForm.status as any) || 'Deployed',
      metrics: metricsArray,
    };

    if (editingProjectId) {
      return projects.map((p) => (p.id === editingProjectId ? draftProject : p));
    }
    return [draftProject, ...projects];
  };

  const getDraftCertificatesList = () => {
    const skillsArray = certForm.skillsRaw
      ? certForm.skillsRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : certForm.skills || [];

    const draftCert: CertificateItem = {
      id: certForm.id?.trim() || editingCertId || 'draft-preview-cert',
      title: certForm.title || 'Nama Sertifikat (Preview Draft)',
      issuer: certForm.issuer || 'Instansi Penerbit',
      issueDate: certForm.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: certForm.expiryDate || '',
      credentialId: certForm.credentialId || 'REF-PREVIEW-001',
      category: (certForm.category as any) || 'Kompetensi',
      description: certForm.description || 'Pernyataan akreditasi dan verifikasi kompetensi...',
      skills: skillsArray.length > 0 ? skillsArray : ['Web Development', 'TypeScript'],
      verificationUrl: certForm.verificationUrl || '',
      imageUrl: certForm.imageUrl || '',
      imagePosX: certForm.imagePosX ?? 50,
      imagePosY: certForm.imagePosY ?? 50,
      imageScale: certForm.imageScale ?? 100,
    };

    const list = editingCertId
      ? certificates.map((c) => (c.id === editingCertId ? draftCert : c))
      : [draftCert, ...certificates];
    return sortCertificatesByDate(list);
  };

  const getDraftSkillsList = () => {
    const parsedSkills = skillForm.skillsRaw
      ? skillForm.skillsRaw.split('\n').filter(Boolean).map((line) => {
          const parts = line.split('|').map((s) => s.trim());
          const name = parts[0] || 'Skill';
          const level = parts[1] || 'Proficient';
          const tags = parts[2] ? parts[2].split(',').map((t) => t.trim()) : [];
          return { name, level, tags };
        })
      : skillForm.skills || [];

    const draftCategory: SkillCategory = {
      code: skillForm.code || 'SKILL-01',
      title: skillForm.title || 'Kategori Skill (Preview Draft)',
      description: skillForm.description || 'Deskripsi modul keahlian teknologi...',
      skills: parsedSkills.length > 0 ? parsedSkills : [{ name: 'React', level: 'Core', tags: ['Frontend', 'SSR'] }],
    };

    if (editingSkillCode) {
      return skillCategories.map((cat) => (cat.code === editingSkillCode ? draftCategory : cat));
    }
    return [draftCategory, ...skillCategories];
  };

  const getDraftInterestsList = () => {
    const detailsArray = interestForm.detailsRaw
      ? interestForm.detailsRaw.split('\n').map((s) => s.trim()).filter(Boolean)
      : interestForm.details || [];

    const fieldNotesArray = interestForm.fieldNotesRaw
      ? interestForm.fieldNotesRaw.split('\n').map((s) => s.trim()).filter(Boolean)
      : interestForm.fieldNotes || [];

    const draftInterest: InterestItem = {
      id: interestForm.id?.trim() || editingInterestId || 'draft-preview-interest',
      title: interestForm.title || 'Judul Minat (Preview Draft)',
      tagline: interestForm.tagline || 'Tagline catatan lapangan...',
      badge: interestForm.badge || 'EXPEDITION LOG',
      imageUrl: interestForm.imageUrl || '',
      imagePosX: interestForm.imagePosX ?? 50,
      imagePosY: interestForm.imagePosY ?? 50,
      imageScale: interestForm.imageScale ?? 100,
      imageUrl2: interestForm.imageUrl2 || '',
      imagePosX2: interestForm.imagePosX2 ?? 50,
      imagePosY2: interestForm.imagePosY2 ?? 50,
      imageScale2: interestForm.imageScale2 ?? 100,
      content: interestForm.content || 'Uraian cerita, pengalaman, dan observasi...',
      details: detailsArray.length > 0 ? detailsArray : ['Poin observasi utama'],
      fieldNotes: fieldNotesArray.length > 0 ? fieldNotesArray : ['FIELD LOG: Catatan lapangan draft'],
    };

    if (editingInterestId) {
      return interests.map((item) => (item.id === editingInterestId ? draftInterest : item));
    }
    return [draftInterest, ...interests];
  };

  const renderPreviewContent = () => {
    switch (previewTab) {
      case 'about':
        return <AboutSection previewData={getDraftAboutData()} />;
      case 'contact':
        return <ContactSection previewContact={getDraftContactData()} />;
      case 'interests': {
        const list = getDraftInterestsList();
        return (
          <InterestsSection
            previewInterests={list}
            initialSelectedId={editingInterestId || interestForm.id || list[0]?.id}
          />
        );
      }
      case 'skills':
        return (
          <SkillsSection
            previewCategories={getDraftSkillsList()}
            initialActiveIndex={0}
          />
        );
      case 'projects': {
        const list = getDraftProjectsList();
        return (
          <ProjectsSection
            previewProjects={list}
            initialSelectedId={editingProjectId || projectForm.id || list[0]?.id}
          />
        );
      }
      case 'certificates': {
        const list = getDraftCertificatesList();
        return (
          <CertificatesSection
            previewCertificates={list}
            initialSelectedId={editingCertId || certForm.id || list[0]?.id}
          />
        );
      }
      default:
        return <AboutSection previewData={getDraftAboutData()} />;
    }
  };

  // Check existing session via secure server-side API (HttpOnly Cookie)
  useEffect(() => {
    import('firebase/auth').then(({ getAuth, onAuthStateChanged }) => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
        setCheckingSession(false);
      });
      return () => unsubscribe();
    });
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [projData, certData, skillData, interestData, abData, conData, msgData] = await Promise.all([
        fetchProjects(),
        fetchCertificates(),
        fetchSkillCategories(),
        fetchInterests(),
        fetchAbout(),
        fetchContact(),
        fetchMessagesAdmin(),
      ]);
      setProjects(projData || []);
      setCertificates(certData || []);
      setSkillCategories(skillData || []);
      setInterests(interestData || []);
      if (abData) {
        setAboutData(abData);
      }
      if (conData) {
        setContactData(conData);
      }
      setMessages(msgData || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
      showNotification('error', 'Gagal memuat data dari Firestore.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const [emailInput, setEmailInput] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, emailInput, pinInput);
      
      setIsAuthenticated(true);
      setPinInput('');
      setEmailInput('');
      setAuthError('');
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        setAuthError('Terlalu banyak percobaan login. Coba lagi nanti.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setAuthError('Email/Password provider belum diaktifkan di Firebase Console.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Format email tidak valid.');
      } else if (err.code === 'auth/network-request-failed') {
        setAuthError('Gagal terhubung ke Firebase. Periksa koneksi internet Anda.');
      } else {
        setAuthError('Email atau Password salah / User belum didaftarkan di Firebase.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { getAuth, signOut } = await import('firebase/auth');
      await signOut(getAuth());
    } catch (err) {
      console.error('Error during logout:', err);
    }
    setIsAuthenticated(false);
    setPinInput('');
    setEmailInput('');
  };

  // -------------------------------------------------------------
  // HANDLERS: PROJECTS
  // -------------------------------------------------------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      showNotification('error', 'Harap isi minimal Judul dan Deskripsi proyek.');
      return;
    }

    setLoading(true);
    const techArray = projectForm.techStackRaw
      ? projectForm.techStackRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : projectForm.techStack || [];

    const metricsArray = projectForm.metricsRaw
      ? projectForm.metricsRaw.split('\n').filter(Boolean).map((line) => {
          const [label, value] = line.split('|').map((s) => s.trim());
          return { label: label || '', value: value || '' };
        })
      : projectForm.metrics || [];

    const projectPayload: ProjectItem = {
      id: projectForm.id?.trim() || projectForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      title: projectForm.title,
      subtitle: projectForm.subtitle || '',
      category: projectForm.category || 'Web Application',
      description: projectForm.description,
      caseStudy: projectForm.caseStudy || '',
      techStack: techArray,
      repoUrl: projectForm.repoUrl || '',
      liveUrl: projectForm.liveUrl || '',
      imageUrl: projectForm.imageUrl || '',
      imagePosX: projectForm.imagePosX ?? 50,
      imagePosY: projectForm.imagePosY ?? 50,
      imageScale: projectForm.imageScale ?? 100,
      featured: projectForm.featured ?? false,
      date: projectForm.date || '2026',
      metrics: metricsArray,
      status: (projectForm.status as 'Deployed' | 'Active Development' | 'Archived') || 'Deployed',
    };

    // Validasi batas maksimal 4 proyek unggulan jika ditandai featured
    if (projectPayload.featured) {
      const currentFeaturedCount = projects.filter(
        (p) => p.featured && p.id !== (editingProjectId || projectPayload.id)
      ).length;

      if (currentFeaturedCount >= 4) {
        showNotification(
          'error',
          'Slot proyek unggulan sudah penuh (maksimal 4 proyek). Harap batalkan salah satu proyek unggulan terlebih dahulu.'
        );
        setLoading(false);
        return;
      }
    }

    const res = await saveProject({ ...projectPayload, sort_order: projectForm.sortOrder || 0 } as any);
    if (res.success) {
      showNotification('success', `Proyek "${projectPayload.title}" berhasil disimpan!`);
      setProjectForm(initialProjectForm);
      setEditingProjectId(null);
      await loadAllData();
    } else {
      showNotification('error', res.error || 'Gagal menyimpan proyek.');
    }
    setLoading(false);
  };

  const handleToggleFeatured = async (item: ProjectItem) => {
    const isCurrentlyFeatured = !!item.featured;
    const currentFeaturedCount = projects.filter((p) => p.featured).length;

    if (!isCurrentlyFeatured && currentFeaturedCount >= 4) {
      showNotification(
        'error',
        'Slot proyek unggulan sudah penuh (maksimal 4 proyek). Harap batalkan salah satu proyek unggulan terlebih dahulu.'
      );
      return;
    }

    setLoading(true);
    const updatedProject: ProjectItem = {
      ...item,
      featured: !isCurrentlyFeatured,
    };

    const res = await saveProject({ ...updatedProject, sort_order: (item as any).sort_order || 0 } as any);
    if (res.success) {
      showNotification(
        'success',
        !isCurrentlyFeatured
          ? `Proyek "${item.title}" berhasil dijadikan Proyek Unggulan (Tampil di Depan)!`
          : `Proyek "${item.title}" dicabut dari Proyek Unggulan.`
      );
      await loadAllData();
    } else {
      showNotification('error', res.error || 'Gagal mengubah status unggulan proyek.');
    }
    setLoading(false);
  };

  const handleEditProject = (item: ProjectItem) => {
    setEditingProjectId(item.id);
    setProjectForm({
      ...item,
      imagePosX: item.imagePosX ?? 50,
      imagePosY: item.imagePosY ?? 50,
      imageScale: item.imageScale ?? 100,
      techStackRaw: item.techStack.join(', '),
      metricsRaw: (item.metrics || []).map((m) => `${m.label} | ${m.value}`).join('\n'),
      sortOrder: (item as any).sort_order || 0,
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Hapus berkas proyek "${title}" dari database?`)) return;
    setLoading(true);
    const res = await deleteProject(id);
    if (res.success) {
      showNotification('success', `Proyek "${title}" telah dihapus.`);
      await loadAllData();
    } else {
      showNotification('error', res.error || 'Gagal menghapus proyek.');
    }
    setLoading(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: CERTIFICATES
  // -------------------------------------------------------------
  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) {
      showNotification('error', 'Harap isi minimal Judul dan Penerbit sertifikat.');
      return;
    }

    setLoading(true);
    const skillsArray = certForm.skillsRaw
      ? certForm.skillsRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : certForm.skills || [];

    const certPayload: CertificateItem = {
      id: certForm.id?.trim() || certForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      title: certForm.title,
      issuer: certForm.issuer,
      issueDate: certForm.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: certForm.expiryDate || '',
      credentialId: certForm.credentialId || '',
      category: (certForm.category as any) || 'Kompetensi',
      description: certForm.description || '',
      skills: skillsArray,
      verificationUrl: certForm.verificationUrl || '',
      imageUrl: certForm.imageUrl || '',
      imagePosX: certForm.imagePosX ?? 50,
      imagePosY: certForm.imagePosY ?? 50,
      imageScale: certForm.imageScale ?? 100,
    };

    const res = await saveCertificate({ ...certPayload, sort_order: certForm.sortOrder || 0 } as any);
    if (res.success) {
      showNotification('success', `Sertifikat "${certPayload.title}" berhasil disimpan!`);
      setCertForm(initialCertForm);
      setEditingCertId(null);
      await loadAllData();
    } else {
      showNotification('error', res.error || 'Gagal menyimpan sertifikat.');
    }
    setLoading(false);
  };

  const handleEditCertificate = (item: CertificateItem) => {
    setEditingCertId(item.id);
    setCertForm({
      ...item,
      expiryDate: item.expiryDate || '',
      imagePosX: item.imagePosX ?? 50,
      imagePosY: item.imagePosY ?? 50,
      imageScale: item.imageScale ?? 100,
      skillsRaw: item.skills.join(', '),
      sortOrder: (item as any).sort_order || 0,
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteCertificate = async (id: string, title: string) => {
    if (!confirm(`Hapus sertifikat "${title}" dari database?`)) return;
    setLoading(true);
    const res = await deleteCertificate(id);
    if (res.success) {
      showNotification('success', `Sertifikat "${title}" telah dihapus.`);
      await loadAllData();
    } else {
      showNotification('error', res.error || 'Gagal menghapus sertifikat.');
    }
    setLoading(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: ABOUT ME (FILE-01)
  // -------------------------------------------------------------
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await saveAbout(aboutData);
    if (res.success) {
      showNotification('success', 'Data Dossier About Me (#01) berhasil diperbarui!');
      await loadAllData();
    } else {
      showNotification('error', res.error || 'Gagal menyimpan data About Me.');
    }
    setLoading(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: CONTACT & SOCIALS (FILE-06)
  // -------------------------------------------------------------
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await saveContact(contactData);
    if (res.success) {
      showNotification('success', 'Data Kontak & Sosmed (#06) berhasil diperbarui!');
      await loadAllData();
    } else {
      showNotification('error', res.error || 'Gagal menyimpan data Kontak.');
    }
    setLoading(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: SKILL CATEGORIES
  // -------------------------------------------------------------
  const handleSaveSkillCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.title || !skillForm.code) {
      showNotification('error', 'Harap isi Judul Kategori dan Kode Kategori.');
      return;
    }

    setLoading(true);
    // Parse skills from raw text (e.g. "React (Core), TypeScript (Advanced)")
    const parsedSkills = skillForm.skillsRaw
      ? skillForm.skillsRaw.split('\n').filter(Boolean).map((line) => {
          const parts = line.split('|').map((s) => s.trim());
          const name = parts[0] || '';
          const level = parts[1] || 'Proficient';
          const tags = parts[2] ? parts[2].split(',').map((t) => t.trim()) : [];
          return { name, level, tags };
        })
      : skillForm.skills || [];

    const skillPayload: SkillCategory = {
      title: skillForm.title,
      code: skillForm.code,
      description: skillForm.description || '',
      skills: parsedSkills,
    };

    const res = await saveSkillCategory({ ...skillPayload, sort_order: skillForm.sortOrder || 0 } as any);
    if (res.success) {
      showNotification('success', `Kategori skill "${skillPayload.title}" berhasil disimpan!`);
      setSkillForm(initialSkillForm);
      setEditingSkillCode(null);
      await loadAllData();
    } else {
      showNotification('error', res.error || 'Gagal menyimpan kategori skill.');
    }
    setLoading(false);
  };

  const handleEditSkillCategory = (item: SkillCategory) => {
    setEditingSkillCode(item.code);
    const skillsRaw = item.skills
      .map((s) => `${s.name} | ${s.level} | ${s.tags.join(', ')}`)
      .join('\n');
    setSkillForm({
      ...item,
      skillsRaw,
      sortOrder: (item as any).sort_order || 0,
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteSkillCategory = async (code: string, title: string) => {
    if (!confirm(`Hapus kategori skill "${title}" (${code}) dari database?`)) return;
    setLoading(true);
    const res = await deleteSkillCategory(code);
    if (res.success) {
      showNotification('success', `Kategori skill "${title}" telah dihapus.`);
      await loadAllData();
    } else {
      showNotification('error', res.error || 'Gagal menghapus kategori skill.');
    }
    setLoading(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: INTERESTS
  // -------------------------------------------------------------
  const handleSaveInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestForm.title || !interestForm.content) {
      showNotification('error', 'Harap isi Judul dan Konten catatan minat.');
      return;
    }

    setLoading(true);
    const detailsArray = interestForm.detailsRaw
      ? interestForm.detailsRaw.split('\n').map((s) => s.trim()).filter(Boolean)
      : interestForm.details || [];

    const fieldNotesArray = interestForm.fieldNotesRaw
      ? interestForm.fieldNotesRaw.split('\n').map((s) => s.trim()).filter(Boolean)
      : interestForm.fieldNotes || [];

    const interestPayload: InterestItem = {
      id: interestForm.id?.trim() || interestForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      title: interestForm.title,
      tagline: interestForm.tagline || '',
      badge: interestForm.badge || 'EXPEDITION LOG',
      imageUrl: interestForm.imageUrl || '',
      imagePosX: interestForm.imagePosX ?? 50,
      imagePosY: interestForm.imagePosY ?? 50,
      imageScale: interestForm.imageScale ?? 100,
      imageUrl2: interestForm.imageUrl2 || '',
      imagePosX2: interestForm.imagePosX2 ?? 50,
      imagePosY2: interestForm.imagePosY2 ?? 50,
      imageScale2: interestForm.imageScale2 ?? 100,
      content: interestForm.content,
      details: detailsArray,
      fieldNotes: fieldNotesArray,
    };

    const res = await saveInterest({ ...interestPayload, sort_order: interestForm.sortOrder || 0 } as any);
    if (res.success) {
      showNotification('success', `Catatan minat "${interestPayload.title}" berhasil disimpan!`);
      setInterestForm(initialInterestForm);
      setEditingInterestId(null);
      await loadAllData();
    } else {
      showNotification('error', res.error || 'Gagal menyimpan catatan minat.');
    }
    setLoading(false);
  };

  const handleEditInterest = (item: InterestItem) => {
    setEditingInterestId(item.id);
    setInterestForm({
      ...item,
      imagePosX: item.imagePosX ?? 50,
      imagePosY: item.imagePosY ?? 50,
      imageScale: item.imageScale ?? 100,
      imageUrl2: item.imageUrl2 || '',
      imagePosX2: item.imagePosX2 ?? 50,
      imagePosY2: item.imagePosY2 ?? 50,
      imageScale2: item.imageScale2 ?? 100,
      detailsRaw: (item.details || []).join('\n'),
      fieldNotesRaw: (item.fieldNotes || []).join('\n'),
      sortOrder: (item as any).sort_order || 0,
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteInterest = async (id: string, title: string) => {
    if (!confirm(`Hapus catatan minat "${title}" dari database?`)) return;
    setLoading(true);
    const res = await deleteInterest(id);
    if (res.success) {
      showNotification('success', `Catatan minat "${title}" telah dihapus.`);
      await loadAllData();
    } else {
      showNotification('error', res.error || 'Gagal menghapus catatan minat.');
    }
    setLoading(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: MESSAGES & SEED
  // -------------------------------------------------------------
  const handleToggleReadMessage = async (msg: ContactMessage) => {
    const newStatus = !msg.is_read;
    const res = await markMessageRead(msg.id, newStatus);
    if (res.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: newStatus } : m))
      );
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Hapus transmisi pesan ini?')) return;
    const res = await deleteMessage(id);
    if (res.success) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showNotification('success', 'Pesan berhasil dihapus.');
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm('Ini akan mengisi Firestore dengan data default dari dossierData.ts. Lanjutkan?')) return;
    setLoading(true);
    const res = await seedInitialData();
    if (res.success) {
      showNotification('success', res.message);
      await loadAllData();
    } else {
      showNotification('error', res.message);
    }
    setLoading(false);
  };

  // -------------------------------------------------------------
  // RENDER: Lock Screen if not authenticated
  // -------------------------------------------------------------
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#0f1013] text-[#f4efe6] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 font-mono text-xs text-neutral-400">
          <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
          <span>MEMVERIFIKASI OTORISASI SESI...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f1013] text-[#f4efe6] flex items-center justify-center p-4 selection:bg-purple-600 selection:text-white">
        <div className="w-full max-w-md bg-[#18191f] border-2 border-neutral-800 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-500/40 text-purple-400 mx-auto flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div className="font-mono text-xs text-purple-400 tracking-widest uppercase">
              RESTRICTED DOSSIER PROTOCOL
            </div>
            <h1 className="font-sans text-2xl font-black uppercase text-white tracking-wide">
              CLASSIFIED ACCESS
            </h1>
            <p className="font-serif text-xs text-neutral-400">
              Masukkan Email dan Password akun Firebase Admin Anda.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-300 rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-neutral-400 uppercase font-bold">
                ADMIN EMAIL
              </label>
              <input
                id="email"
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded text-white text-center text-lg tracking-widest placeholder:text-neutral-600 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pin" className="block text-neutral-400 uppercase font-bold">
                PASSWORD
              </label>
              <input
                id="pin"
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded text-white text-center text-lg tracking-widest placeholder:text-neutral-600 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold uppercase rounded shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>BUKA KONSOL ADMIN</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-neutral-800">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Portofolio Utama</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Authenticated Admin Dashboard
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#111216] text-[#f4efe6] flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#17181f]/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-950 rounded border border-purple-800 text-purple-300">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono text-[10px] text-purple-400 uppercase tracking-widest">
                BOATMIE CONTROL CENTER
              </div>
              <h1 className="font-sans text-lg sm:text-xl uppercase font-black tracking-wide text-white">
                CLASSIFIED DOSSIER CONSOLE
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="p-2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Quick Live Preview Button */}
            {activeTab !== 'database' && activeTab !== 'messages' && (
              <button
                onClick={() => handleOpenPreview()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-600 shadow-sm transition-all hover:scale-105 active:scale-95"
                title="Buka Pratinjau Dossier Tab Saat Ini"
              >
                <Eye className="w-3.5 h-3.5 text-purple-300" />
                <span className="font-bold">Preview Dossier</span>
              </button>
            )}

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat Portofolio</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Status Notification Toast */}
      {statusMessage && (
        <div className="fixed top-16 right-4 z-50 animate-bounce">
          <div
            className={`p-4 rounded-md shadow-2xl flex items-center gap-3 font-mono text-xs border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-emerald-500'
                : 'bg-red-950 text-red-200 border-red-500'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs — ordered to match Dossier FILE-01 through FILE-06 */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-md font-bold uppercase transition-all ${
              activeTab === 'about'
                ? 'bg-blue-900 text-white border-t-2 border-blue-400 shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>#01 About Me</span>
          </button>

          <button
            onClick={() => setActiveTab('interests')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-md font-bold uppercase transition-all ${
              activeTab === 'interests'
                ? 'bg-red-900 text-white border-t-2 border-red-400 shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>#02 Interests ({interests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-md font-bold uppercase transition-all ${
              activeTab === 'skills'
                ? 'bg-emerald-900 text-white border-t-2 border-emerald-400 shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>#03 Skills ({skillCategories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-md font-bold uppercase transition-all ${
              activeTab === 'projects'
                ? 'bg-purple-900 text-white border-t-2 border-purple-400 shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>#04 Proyek ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-md font-bold uppercase transition-all ${
              activeTab === 'certificates'
                ? 'bg-amber-900 text-white border-t-2 border-amber-400 shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>#05 Sertifikat ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-md font-bold uppercase transition-all ${
              activeTab === 'contact'
                ? 'bg-slate-800 text-white border-t-2 border-slate-400 shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>#06 Kontak & Sosmed</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-md font-bold uppercase transition-all ${
              activeTab === 'messages'
                ? 'bg-indigo-900 text-white border-t-2 border-indigo-400 shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Inbox Pesan ({messages.filter((m) => !m.is_read).length} Baru)</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-md font-bold uppercase transition-all ${
              activeTab === 'database'
                ? 'bg-neutral-800 text-white border-t-2 border-neutral-400 shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database Tools</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PROJECTS MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Project Form (7 cols) */}
            <div className="lg:col-span-7 bg-[#181920] p-6 rounded-lg border border-neutral-800 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-purple-400" />
                  <h3 className="font-sans text-lg font-bold uppercase text-white">
                    {editingProjectId ? 'EDIT BERKAS PROYEK' : 'TAMBAH PROYEK BARU'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPreview('projects')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-700 font-mono text-xs font-bold transition-all shadow-xs"
                    title="Pratinjau Dossier #04 dengan input form saat ini"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Dossier #04</span>
                  </button>
                  {editingProjectId && (
                    <button
                      onClick={() => {
                        setEditingProjectId(null);
                        setProjectForm(initialProjectForm);
                      }}
                      className="font-mono text-xs text-neutral-400 hover:text-white underline ml-2"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      ID Dokumen (Slug)
                    </label>
                    <input
                      type="text"
                      value={projectForm.id || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, id: e.target.value })}
                      placeholder="e.g. acrepar-app (otomatis jika kosong)"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Kategori Proyek *
                    </label>
                    <input
                      type="text"
                      required
                      value={projectForm.category || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      placeholder="e.g. Full-Stack Web App / AI Solution"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Judul Proyek *
                    </label>
                    <input
                      type="text"
                      required
                      value={projectForm.title || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. Acrepar"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={projectForm.subtitle || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                      placeholder="e.g. Platform Pengaduan Sarana Sekolah"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Status Proyek
                    </label>
                    <select
                      value={projectForm.status || 'Deployed'}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          status: e.target.value as 'Deployed' | 'Active Development' | 'Archived',
                        })
                      }
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden"
                    >
                      <option value="Deployed">Deployed (Live)</option>
                      <option value="Active Development">Active Development</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Timeline / Tanggal
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(projectForm.date)}
                      onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Media Image Link & Framing Controls for Projects */}
                <ImageFramingInput
                  label="Link Foto / Screenshot Proyek & Posisi Framing (URL)"
                  themeColor="purple"
                  imageUrl={projectForm.imageUrl || ''}
                  placeholder="https://images.unsplash.com/... atau https://i.imgur.com/..."
                  helpText="Masukkan URL gambar langsung (Imgur, Cloudinary, Firebase, Unsplash, dsb) atau path lokal."
                  posX={projectForm.imagePosX ?? 50}
                  posY={projectForm.imagePosY ?? 50}
                  scale={projectForm.imageScale ?? 100}
                  onImageUrlChange={(url) => setProjectForm({ ...projectForm, imageUrl: url })}
                  onPositionChange={(posX, posY, scale) =>
                    setProjectForm({ ...projectForm, imagePosX: posX, imagePosY: posY, imageScale: scale })
                  }
                  aspectRatio="video"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={projectForm.liveUrl || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      placeholder="https://project.vercel.app"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Source Code (GitHub) URL
                    </label>
                    <input
                      type="url"
                      value={projectForm.repoUrl || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                      placeholder="https://github.com/username/repo"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Tech Stack (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={projectForm.techStackRaw || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, techStackRaw: e.target.value })}
                    placeholder="Next.js, React, Tailwind CSS, Firebase, TypeScript"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Ringkasan Sistem (Description) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={projectForm.description || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Penjelasan gambaran umum dan tujuan sistem..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Detail Arsitektur (Case Study)
                  </label>
                  <textarea
                    rows={3}
                    value={projectForm.caseStudy || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, caseStudy: e.target.value })}
                    placeholder="Rincian teknis, tantangan, dan solusi implementasi..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Metrics / Dampak Proyek (Label | Nilai, per baris)
                  </label>
                  <textarea
                    rows={3}
                    value={projectForm.metricsRaw || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, metricsRaw: e.target.value })}
                    placeholder={"Response Time | < 200ms\nUptime | 99.9%\nUsers | 500+"}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden font-sans text-xs"
                  />
                  <p className="text-[10px] text-neutral-500">
                    Format: Label | Nilai (satu per baris). Contoh: Response Time | {'<'} 200ms
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Urutan Tampil (Sort Order)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={projectForm.sortOrder || 0}
                      onChange={(e) => setProjectForm({ ...projectForm, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-neutral-900 border border-neutral-700 rounded hover:border-purple-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={projectForm.featured ?? false}
                      onChange={(e) => {
                        const isChecking = e.target.checked;
                        if (isChecking) {
                          const currentFeaturedCount = projects.filter(
                            (p) => p.featured && p.id !== (editingProjectId || projectForm.id)
                          ).length;
                          if (currentFeaturedCount >= 4) {
                            showNotification(
                              'error',
                              'Slot proyek unggulan sudah penuh (maksimal 4 proyek). Harap batalkan salah satu proyek unggulan terlebih dahulu.'
                            );
                            return;
                          }
                        }
                        setProjectForm({ ...projectForm, featured: isChecking });
                      }}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-300 font-bold uppercase">Proyek Unggulan (Tampil Depan)</span>
                      <span className="text-[10px] text-purple-400 font-mono font-bold">
                        ({projects.filter((p) => p.featured).length}/4)
                      </span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:flex-1 py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold uppercase rounded shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingProjectId ? 'SIMPAN PERUBAHAN PROYEK' : 'ARSIPKAN PROYEK KE DATABASE'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenPreview('projects')}
                    className="w-full sm:w-auto px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-purple-300 font-bold uppercase rounded border border-neutral-700 hover:border-purple-600 transition-all flex items-center justify-center gap-2 shrink-0"
                    title="Pratinjau Dossier #04"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Pratinjau Dossier</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Projects List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                  DAFTAR PROYEK TERDAFTAR ({projects.length})
                </h3>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                  UNGGULAN: {projects.filter((p) => p.featured).length}/4
                </span>
              </div>

              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {projects.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 bg-[#181920] border rounded-lg space-y-3 transition-colors ${
                      item.featured
                        ? 'border-purple-500/80 bg-purple-950/20 shadow-xs'
                        : 'border-neutral-800 hover:border-purple-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-purple-400 uppercase font-bold">
                            {item.category}
                          </span>
                          {item.featured && (
                            <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                              ⭐ UNGGULAN
                            </span>
                          )}
                        </div>
                        <h4 className="font-sans text-base font-bold text-white uppercase">
                          {item.title}
                        </h4>
                        <p className="font-serif text-xs text-neutral-400 line-clamp-2">
                          {item.subtitle || item.description}
                        </p>
                      </div>

                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-neutral-800 text-neutral-300 shrink-0">
                        {item.status}
                      </span>
                    </div>

                    {item.imageUrl && (
                      <div className="w-full h-24 bg-neutral-900 rounded overflow-hidden border border-neutral-800">
                        <img
                          src={normalizeImageUrl(item.imageUrl)}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          style={{
                            objectPosition: `${item.imagePosX ?? 50}% ${item.imagePosY ?? 50}%`,
                            transform: `scale(${(item.imageScale ?? 100) / 100})`,
                          }}
                          className="w-full h-full object-cover transition-all duration-150 origin-center"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src.includes('lh3.googleusercontent.com/d/')) {
                              const fileId = target.src.split('lh3.googleusercontent.com/d/')[1];
                              if (fileId) {
                                target.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
                                return;
                              }
                            }
                            (target.parentElement as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 font-mono text-[10px] text-neutral-500">
                      {item.techStack.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800 font-mono text-xs">
                      <span className="text-neutral-500 text-[11px]">{item.date}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(item)}
                          className={`px-2 py-1 rounded font-mono text-[10px] font-bold uppercase transition-all flex items-center gap-1 border ${
                            item.featured
                              ? 'bg-purple-900 text-purple-200 border-purple-500 hover:bg-purple-800 shadow-xs'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white hover:border-purple-500'
                          }`}
                          title={item.featured ? 'Batalkan unggulan' : 'Jadikan unggulan (Tampil di depan)'}
                        >
                          <Star className={`w-3 h-3 ${item.featured ? 'text-amber-400 fill-amber-400' : 'text-neutral-400'}`} />
                          <span>{item.featured ? 'UNGGULAN' : 'UNGGULKAN'}</span>
                        </button>

                        <button
                          onClick={() => handleEditProject(item)}
                          className="p-1.5 text-purple-300 hover:text-white bg-purple-950 rounded border border-purple-800 transition-colors"
                          title="Edit Proyek"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(item.id, item.title)}
                          className="p-1.5 text-red-300 hover:text-white bg-red-950 rounded border border-red-800 transition-colors"
                          title="Hapus Proyek"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: CERTIFICATES MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'certificates' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Certificate Form (7 cols) */}
            <div className="lg:col-span-7 bg-[#181920] p-6 rounded-lg border border-neutral-800 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <h3 className="font-sans text-lg font-bold uppercase text-white">
                    {editingCertId ? 'EDIT SERTIFIKAT' : 'TAMBAH SERTIFIKAT BARU'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPreview('certificates')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700 font-mono text-xs font-bold transition-all shadow-xs"
                    title="Pratinjau Dossier #05 dengan input form saat ini"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Dossier #05</span>
                  </button>
                  {editingCertId && (
                    <button
                      onClick={() => {
                        setEditingCertId(null);
                        setCertForm(initialCertForm);
                      }}
                      className="font-mono text-xs text-neutral-400 hover:text-white underline ml-2"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveCertificate} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      ID Dokumen (Slug)
                    </label>
                    <input
                      type="text"
                      value={certForm.id || ''}
                      onChange={(e) => setCertForm({ ...certForm, id: e.target.value })}
                      placeholder="e.g. isqo-gold-2024 (otomatis jika kosong)"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Kategori Sertifikat
                    </label>
                    <div className="space-y-2">
                      <select
                        value={
                          CERT_CATEGORY_OPTIONS.includes(certForm.category || '')
                            ? certForm.category
                            : 'Lainnya'
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Lainnya') {
                            setCertForm({
                              ...certForm,
                              category:
                                certForm.category && !CERT_CATEGORY_OPTIONS.includes(certForm.category)
                                  ? certForm.category
                                  : 'Lainnya',
                            });
                          } else {
                            setCertForm({ ...certForm, category: val as any });
                          }
                        }}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden"
                      >
                        {CERT_CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                        {certForm.category && !CERT_CATEGORY_OPTIONS.includes(certForm.category) && (
                          <option value={certForm.category}>
                            {certForm.category} (Kategori Khusus)
                          </option>
                        )}
                      </select>

                      {(!certForm.category || !CERT_CATEGORY_OPTIONS.slice(0, -1).includes(certForm.category)) && (
                        <input
                          type="text"
                          value={certForm.category === 'Lainnya' ? '' : certForm.category || ''}
                          onChange={(e) => setCertForm({ ...certForm, category: e.target.value || 'Lainnya' })}
                          placeholder="Ketik nama kategori khusus (e.g. AI & ML / Sains)..."
                          className="w-full px-3 py-1.5 bg-neutral-950 border border-amber-500/50 rounded text-xs text-amber-200 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-hidden"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Nama / Judul Sertifikat *
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.title || ''}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder="e.g. Indonesian Science & Olympiad (ISQO)"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Penerbit (Issuer) *
                    </label>
                    <input
                      type="text"
                      required
                      value={certForm.issuer || ''}
                      onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                      placeholder="e.g. Dikti / Coursera / Kemdikbud"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Tanggal Terbit
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(certForm.issueDate)}
                      onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden [color-scheme:dark]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-neutral-400 font-bold uppercase">
                        Tanggal Berakhir (Opsional)
                      </label>
                      {certForm.expiryDate && (
                        <button
                          type="button"
                          onClick={() => setCertForm({ ...certForm, expiryDate: '' })}
                          className="text-[10px] text-amber-400 hover:text-amber-300 font-mono underline"
                          title="Hapus tanggal berakhir (Set Seumur Hidup)"
                        >
                          Kosongkan
                        </button>
                      )}
                    </div>
                    <input
                      type="date"
                      value={formatDateForInput(certForm.expiryDate)}
                      onChange={(e) => setCertForm({ ...certForm, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Nomor Kredensial / Registry ID
                    </label>
                    <input
                      type="text"
                      value={certForm.credentialId || ''}
                      onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                      placeholder="e.g. CERT-ISQO-2024-098"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Link Verifikasi URL
                    </label>
                    <input
                      type="url"
                      value={certForm.verificationUrl || ''}
                      onChange={(e) => setCertForm({ ...certForm, verificationUrl: e.target.value })}
                      placeholder="https://verify.cert.com/id/123"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Media Image Link & Framing Controls for Certificates */}
                <ImageFramingInput
                  label="Link Foto / Dokumen Sertifikat & Posisi Framing (URL)"
                  themeColor="amber"
                  imageUrl={certForm.imageUrl || ''}
                  placeholder="https://drive.google.com/... atau https://i.imgur.com/..."
                  helpText="Masukkan URL gambar langsung dari hasil scan dokumen atau sertifikat digital."
                  posX={certForm.imagePosX ?? 50}
                  posY={certForm.imagePosY ?? 50}
                  scale={certForm.imageScale ?? 100}
                  onImageUrlChange={(url) => setCertForm({ ...certForm, imageUrl: url })}
                  onPositionChange={(posX, posY, scale) =>
                    setCertForm({ ...certForm, imagePosX: posX, imagePosY: posY, imageScale: scale })
                  }
                  aspectRatio="4/3"
                />

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Kompetensi / Skills Terverifikasi (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={certForm.skillsRaw || ''}
                    onChange={(e) => setCertForm({ ...certForm, skillsRaw: e.target.value })}
                    placeholder="Algoritma, Deep Learning, Next.js, API Integration"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Pernyataan Akreditasi / Deskripsi
                  </label>
                  <textarea
                    rows={3}
                    value={certForm.description || ''}
                    onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                    placeholder="Penjelasan capaian, peringkat, atau materi yang diuji..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden font-sans text-xs"
                  />
                </div>

                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-400 font-mono flex items-center gap-2">
                  <span className="text-amber-400 font-bold">ℹ️ Urutan Otomatis:</span>
                  <span>Sertifikat otomatis disortir per tanggal (terbaru di paling depan).</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:flex-1 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold uppercase rounded shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingCertId ? 'SIMPAN PERUBAHAN SERTIFIKAT' : 'SIMPAN SERTIFIKAT KE DATABASE'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenPreview('certificates')}
                    className="w-full sm:w-auto px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold uppercase rounded border border-neutral-700 hover:border-amber-600 transition-all flex items-center justify-center gap-2 shrink-0"
                    title="Pratinjau Dossier #05"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Pratinjau Dossier</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Certificates List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                  DAFTAR SERTIFIKAT TERDAFTAR ({certificates.length})
                </h3>
              </div>

              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {sortCertificatesByDate(certificates).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#181920] border border-neutral-800 rounded-lg space-y-3 hover:border-amber-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-amber-400 uppercase font-bold">
                          {item.category}
                        </span>
                        <h4 className="font-sans text-base font-bold text-white uppercase">
                          {item.title}
                        </h4>
                        <p className="font-serif text-xs text-neutral-400">
                          Penerbit: <span className="text-neutral-200">{item.issuer}</span>
                        </p>
                      </div>

                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-neutral-800 text-neutral-300 shrink-0">
                        {formatCertificateDisplayDate(item.issueDate)}
                        {item.expiryDate ? ` - ${formatCertificateDisplayDate(item.expiryDate)}` : ' (Seumur Hidup)'}
                      </span>
                    </div>

                    {item.imageUrl && (
                      <div className="w-full h-24 bg-neutral-900 rounded overflow-hidden border border-neutral-800">
                        <img
                          src={normalizeImageUrl(item.imageUrl)}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          style={{
                            objectPosition: `${item.imagePosX ?? 50}% ${item.imagePosY ?? 50}%`,
                            transform: `scale(${(item.imageScale ?? 100) / 100})`,
                          }}
                          className="w-full h-full object-cover transition-all duration-150 origin-center"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src.includes('lh3.googleusercontent.com/d/')) {
                              const fileId = target.src.split('lh3.googleusercontent.com/d/')[1];
                              if (fileId) {
                                target.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
                                return;
                              }
                            }
                            (target.parentElement as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 font-mono text-[10px] text-neutral-500">
                      {item.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800 font-mono text-xs">
                      <span className="text-neutral-500 text-[11px]">REF: {item.credentialId}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCertificate(item)}
                          className="p-1.5 text-amber-300 hover:text-white bg-amber-950 rounded border border-amber-800 transition-colors"
                          title="Edit Sertifikat"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCertificate(item.id, item.title)}
                          className="p-1.5 text-red-300 hover:text-white bg-red-950 rounded border border-red-800 transition-colors"
                          title="Hapus Sertifikat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: FILE-01 ABOUT ME */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'about' && (
          <div className="max-w-4xl bg-[#181920] p-6 sm:p-8 rounded-lg border border-neutral-800 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 pb-3 gap-3">
              <div>
                <h3 className="font-sans text-lg font-bold uppercase text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  <span>DOSSIER #01 // IDENTIFIKASI AGEN (ABOUT ME)</span>
                </h3>
                <p className="font-serif text-xs text-neutral-400 mt-1">
                  Data utama identitas, bio editorial, directive sticky note, dan ringkasan kasus (Tabel <code>about</code>).
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPreview('about')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-700 font-mono text-xs font-bold transition-all shadow-xs"
                title="Pratinjau Dossier #01: About Me"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview About (#01)</span>
              </button>
            </div>

            <form onSubmit={handleSaveAbout} className="space-y-5 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={aboutData.name || ''}
                    onChange={(e) => setAboutData({ ...aboutData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Alias / Kode Panggilan
                  </label>
                  <input
                    type="text"
                    value={aboutData.alias || ''}
                    onChange={(e) => setAboutData({ ...aboutData, alias: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Avatar URL Link & Framing Controls */}
              <ImageFramingInput
                label="Link Foto Profil / Avatar & Kontrol Posisi (URL)"
                themeColor="blue"
                imageUrl={aboutData.avatarUrl || ''}
                placeholder="https://... atau /media/profile/avatar.png"
                helpText="Bisa berupa link URL langsung (Google Drive direct, Imgur, Firebase, Cloudinary, dll.) atau path lokal."
                posX={aboutData.avatarPosX ?? 50}
                posY={aboutData.avatarPosY ?? 50}
                scale={aboutData.avatarScale ?? 100}
                onImageUrlChange={(url) => setAboutData({ ...aboutData, avatarUrl: url })}
                onPositionChange={(posX, posY, scale) =>
                  setAboutData({ ...aboutData, avatarPosX: posX, avatarPosY: posY, avatarScale: scale })
                }
                aspectRatio="square"
                showGrayscalePreview={true}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Peran / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={aboutData.role || ''}
                    onChange={(e) => setAboutData({ ...aboutData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Status Ketersediaan (Availability)
                  </label>
                  <input
                    type="text"
                    value={aboutData.status || ''}
                    onChange={(e) => setAboutData({ ...aboutData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Lokasi Asal
                  </label>
                  <input
                    type="text"
                    value={aboutData.location || ''}
                    onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
                    placeholder="West Java, Indonesia (UTC+7)"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Klasifikasi Dossier
                  </label>
                  <input
                    type="text"
                    value={aboutData.classification || ''}
                    onChange={(e) => setAboutData({ ...aboutData, classification: e.target.value })}
                    placeholder="e.g. UNRESTRICTED / PUBLIC DOSSIER"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-neutral-400 font-bold uppercase">
                  Field Directive (Sticky Note di About Me)
                </label>
                <input
                  type="text"
                  value={aboutData.fieldDirective || ''}
                  onChange={(e) => setAboutData({ ...aboutData, fieldDirective: e.target.value })}
                  placeholder="Kutipan atau arahan kerja yang tampil pada sticky note kuning di About"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-neutral-400 font-bold uppercase">
                  Ringkasan Kasus / Case Summary (About Me)
                </label>
                <textarea
                  rows={3}
                  value={aboutData.caseSummary || ''}
                  onChange={(e) => setAboutData({ ...aboutData, caseSummary: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden font-sans text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-neutral-400 font-bold uppercase">
                  Bio Paragraf (1 paragraf per baris, pisahkan dengan Enter)
                </label>
                <textarea
                  rows={5}
                  value={(aboutData.bioParagraphs || []).join('\n')}
                  onChange={(e) => setAboutData({ ...aboutData, bioParagraphs: e.target.value.split('\n') })}
                  placeholder={"Paragraf pertama bio...\nParagraf kedua bio...\nParagraf ketiga bio..."}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden font-sans text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-neutral-400 font-bold uppercase">
                  Stats / Info Cards (Label | Nilai, per baris)
                </label>
                <textarea
                  rows={4}
                  value={(aboutData.stats || []).map((s: any) => `${s.label} | ${s.value}`).join('\n')}
                  onChange={(e) => setAboutData({
                    ...aboutData,
                    stats: e.target.value.split('\n').filter(Boolean).map((line: string) => {
                      const [label, value] = line.split('|').map((s: string) => s.trim());
                      return { label: label || '', value: value || '' };
                    }),
                  })}
                  placeholder={"Core Focus | Full-Stack Web & Applied AI\nAcademic Path | PPLG / Software Engineering"}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden font-sans text-xs"
                />
                <p className="text-[10px] text-neutral-500">
                  Format: Label | Nilai (satu per baris)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold uppercase rounded shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SIMPAN PERUBAHAN ABOUT ME (#01)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenPreview('about')}
                  className="w-full sm:w-auto px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-blue-300 font-bold uppercase rounded border border-neutral-700 hover:border-blue-600 transition-all flex items-center justify-center gap-2"
                  title="Pratinjau Dossier #01: About Me"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview About</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: FILE-06 CONTACT & SOCIALS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'contact' && (
          <div className="max-w-4xl bg-[#181920] p-6 sm:p-8 rounded-lg border border-neutral-800 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 pb-3 gap-3">
              <div>
                <h3 className="font-sans text-lg font-bold uppercase text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span>DOSSIER #06 // TRANSMISI & KONTAK (CONTACT)</span>
                </h3>
                <p className="font-serif text-xs text-neutral-400 mt-1">
                  Koordinat email, tautan profil sosial media, status availability, dan memo transmisi (Tabel <code>contact</code>).
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPreview('contact')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs font-bold transition-all shadow-xs"
                title="Pratinjau Dossier #06: Contact Memo"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Contact (#06)</span>
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-5 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Email Kontak Utama *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactData.email || ''}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-slate-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Lokasi Kontak / Base
                  </label>
                  <input
                    type="text"
                    value={contactData.location || ''}
                    onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                    placeholder="West Java, Indonesia"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-slate-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-neutral-400 font-bold uppercase">
                  Status Ketersediaan Kolaborasi (Availability)
                </label>
                <input
                  type="text"
                  value={contactData.availability || ''}
                  onChange={(e) => setContactData({ ...contactData, availability: e.target.value })}
                  placeholder="Available for Web Projects, Fullstack Roles, & Live MC Bookings"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-slate-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-neutral-400 font-bold uppercase">
                  Quick Memo (Sticky Note Transmisi di Contact)
                </label>
                <textarea
                  rows={3}
                  value={contactData.quickMemo || ''}
                  onChange={(e) => setContactData({ ...contactData, quickMemo: e.target.value })}
                  placeholder="Kutipan atau catatan singkat yang tampil di Contact section"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-slate-500 focus:outline-hidden font-sans text-xs"
                />
              </div>

              {/* Social Channels Coordinates */}
              <div className="space-y-3 p-4 bg-neutral-900/80 rounded border border-neutral-800">
                <span className="font-bold text-slate-300 uppercase tracking-wider block border-b border-neutral-800 pb-2">
                  Tautan Sosial Media & Saluran Eksternal
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={contactData.github || ''}
                      onChange={(e) => setContactData({ ...contactData, github: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:border-slate-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={contactData.linkedin || ''}
                      onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:border-slate-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={contactData.instagram || ''}
                      onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:border-slate-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold uppercase rounded shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SIMPAN PERUBAHAN KONTAK (#06)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenPreview('contact')}
                  className="w-full sm:w-auto px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-slate-300 font-bold uppercase rounded border border-neutral-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
                  title="Pratinjau Dossier #06: Contact Memo"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Contact</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: SKILL CATEGORIES MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Skill Category Form (7 cols) */}
            <div className="lg:col-span-7 bg-[#181920] p-6 rounded-lg border border-neutral-800 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-sans text-lg font-bold uppercase text-white">
                    {editingSkillCode ? 'EDIT KATEGORI SKILL' : 'TAMBAH KATEGORI SKILL'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPreview('skills')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 font-mono text-xs font-bold transition-all shadow-xs"
                    title="Pratinjau Dossier #03 dengan input form saat ini"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Dossier #03</span>
                  </button>
                  {editingSkillCode && (
                    <button
                      onClick={() => {
                        setEditingSkillCode(null);
                        setSkillForm(initialSkillForm);
                      }}
                      className="font-mono text-xs text-neutral-400 hover:text-white underline ml-2"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveSkillCategory} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Kode Kategori *
                    </label>
                    <input
                      type="text"
                      required
                      value={skillForm.code || ''}
                      onChange={(e) => setSkillForm({ ...skillForm, code: e.target.value })}
                      placeholder="e.g. SKILL-01 atau FRONTEND"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Nama Kategori *
                    </label>
                    <input
                      type="text"
                      required
                      value={skillForm.title || ''}
                      onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })}
                      placeholder="e.g. Modern Frontend Architecture"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Deskripsi Kategori
                  </label>
                  <textarea
                    rows={2}
                    value={skillForm.description || ''}
                    onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                    placeholder="Penjelasan fokus keahlian pada kategori ini..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-emerald-500 focus:outline-hidden font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Daftar Skill (Format: Nama | Level | Tag1, Tag2)
                  </label>
                  <textarea
                    rows={6}
                    value={skillForm.skillsRaw || ''}
                    onChange={(e) => setSkillForm({ ...skillForm, skillsRaw: e.target.value })}
                    placeholder={`React / Next.js | Core | SSR, App Router\nTypeScript | Advanced | Type-Safety, Generics\nTailwind CSS | Proficient | Utility-first`}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-emerald-500 focus:outline-hidden font-mono text-xs"
                  />
                  <p className="text-[10px] text-neutral-500">
                    Tulis 1 skill per baris dengan pemisah pipa (|). Contoh: <code>Next.js | Core | SSR, Routing</code>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Urutan Tampil (Sort Order)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={skillForm.sortOrder || 0}
                    onChange={(e) => setSkillForm({ ...skillForm, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:flex-1 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold uppercase rounded shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SIMPAN KATEGORI SKILL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenPreview('skills')}
                    className="w-full sm:w-auto px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-emerald-300 font-bold uppercase rounded border border-neutral-700 hover:border-emerald-600 transition-all flex items-center justify-center gap-2 shrink-0"
                    title="Pratinjau Dossier #03"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Pratinjau Dossier</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Skill Categories List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                  DAFTAR KATEGORI SKILL ({skillCategories.length})
                </h3>
              </div>

              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {skillCategories.map((cat) => (
                  <div
                    key={cat.code}
                    className="p-4 bg-[#181920] border border-neutral-800 rounded-lg space-y-3 hover:border-emerald-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold">
                          {cat.code}
                        </span>
                        <h4 className="font-sans text-base font-bold text-white uppercase">
                          {cat.title}
                        </h4>
                        <p className="font-serif text-xs text-neutral-400 line-clamp-2">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 font-mono text-[10px] text-neutral-300">
                      {cat.skills.map((s) => (
                        <span key={s.name} className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-700">
                          {s.name} <em className="text-emerald-400">({s.level})</em>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800 font-mono text-xs">
                      <span className="text-neutral-500 text-[11px]">{cat.skills.length} skills</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSkillCategory(cat)}
                          className="p-1.5 text-emerald-300 hover:text-white bg-emerald-950 rounded border border-emerald-800 transition-colors"
                          title="Edit Kategori Skill"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkillCategory(cat.code, cat.title)}
                          className="p-1.5 text-red-300 hover:text-white bg-red-950 rounded border border-red-800 transition-colors"
                          title="Hapus Kategori Skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: INTERESTS MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'interests' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interest Form (7 cols) */}
            <div className="lg:col-span-7 bg-[#181920] p-6 rounded-lg border border-neutral-800 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-red-400" />
                  <h3 className="font-sans text-lg font-bold uppercase text-white">
                    {editingInterestId ? 'EDIT CATATAN MINAT' : 'TAMBAH CATATAN MINAT BARU'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPreview('interests')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-700 font-mono text-xs font-bold transition-all shadow-xs"
                    title="Pratinjau Dossier #02 dengan input form saat ini"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Dossier #02</span>
                  </button>
                  {editingInterestId && (
                    <button
                      onClick={() => {
                        setEditingInterestId(null);
                        setInterestForm(initialInterestForm);
                      }}
                      className="font-mono text-xs text-neutral-400 hover:text-white underline ml-2"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveInterest} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      ID Dokumen (Slug)
                    </label>
                    <input
                      type="text"
                      value={interestForm.id || ''}
                      onChange={(e) => setInterestForm({ ...interestForm, id: e.target.value })}
                      placeholder="e.g. nongkrong (otomatis jika kosong)"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-red-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Badge Kategori
                    </label>
                    <input
                      type="text"
                      value={interestForm.badge || ''}
                      onChange={(e) => setInterestForm({ ...interestForm, badge: e.target.value })}
                      placeholder="e.g. SOCIAL & VIBES / EXPEDITION LOG"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-red-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Judul Minat *
                    </label>
                    <input
                      type="text"
                      required
                      value={interestForm.title || ''}
                      onChange={(e) => setInterestForm({ ...interestForm, title: e.target.value })}
                      placeholder="e.g. Hangouts & Coffee Sessions"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-red-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-neutral-400 font-bold uppercase">
                      Tagline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={interestForm.tagline || ''}
onChange={(e) => setInterestForm({ ...interestForm, tagline: e.target.value })}
                      placeholder="e.g. Good Coffee, Late-Night Brainstorms"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-red-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Media Image Link & Framing Controls for Interests (Photo 1 & Photo 2) */}
                <div className="space-y-4 pt-1">
                  <ImageFramingInput
                    label="Link Foto Utama (#1) / Dokumentasi & Posisi Framing (URL)"
                    themeColor="red"
                    imageUrl={interestForm.imageUrl || ''}
                    placeholder="https://images.unsplash.com/... atau https://i.imgur.com/..."
                    helpText="Masukkan URL foto utama kegiatan (Snapshot 01)."
                    posX={interestForm.imagePosX ?? 50}
                    posY={interestForm.imagePosY ?? 50}
                    scale={interestForm.imageScale ?? 100}
                    onImageUrlChange={(url) => setInterestForm({ ...interestForm, imageUrl: url })}
                    onPositionChange={(posX, posY, scale) =>
                      setInterestForm({ ...interestForm, imagePosX: posX, imagePosY: posY, imageScale: scale })
                    }
                    aspectRatio="4/3"
                  />

                  <ImageFramingInput
                    label="Link Foto Tambahan (#2) / Dokumentasi & Posisi Framing (URL)"
                    themeColor="red"
                    imageUrl={interestForm.imageUrl2 || ''}
                    placeholder="https://images.unsplash.com/... atau https://i.imgur.com/..."
                    helpText="Masukkan URL foto kedua kegiatan (Snapshot 02) — opsional."
                    posX={interestForm.imagePosX2 ?? 50}
                    posY={interestForm.imagePosY2 ?? 50}
                    scale={interestForm.imageScale2 ?? 100}
                    onImageUrlChange={(url) => setInterestForm({ ...interestForm, imageUrl2: url })}
                    onPositionChange={(posX, posY, scale) =>
                      setInterestForm({ ...interestForm, imagePosX2: posX, imagePosY2: posY, imageScale2: scale })
                    }
                    aspectRatio="4/3"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Isi Catatan Lapangan (Content) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={interestForm.content || ''}
                    onChange={(e) => setInterestForm({ ...interestForm, content: e.target.value })}
                    placeholder="Uraian cerita, pengalaman, atau kebiasaan..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-red-500 focus:outline-hidden font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Poin Detail (1 per baris)
                  </label>
                  <textarea
                    rows={3}
                    value={interestForm.detailsRaw || ''}
                    onChange={(e) => setInterestForm({ ...interestForm, detailsRaw: e.target.value })}
                    placeholder={`Coffee shop hunting: Scouting cozy spots...\nDeep chats & tech banter: Exchanging ideas...`}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-red-500 focus:outline-hidden font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Field Notes / Catatan Tambahan (1 per baris)
                  </label>
                  <textarea
                    rows={3}
                    value={interestForm.fieldNotesRaw || ''}
                    onChange={(e) => setInterestForm({ ...interestForm, fieldNotesRaw: e.target.value })}
                    placeholder={`FIELD LOG: "Breakthroughs happen over coffee..."\nFAVORITE VIBES: Warm ambient lighting...`}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-red-500 focus:outline-hidden font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Urutan Tampil (Sort Order)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={interestForm.sortOrder || 0}
                    onChange={(e) => setInterestForm({ ...interestForm, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-red-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{editingInterestId ? 'Simpan Perubahan Minat' : 'Tambah Minat Baru'}</span>
                      </>
                    )}
                  </button>

                  {editingInterestId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingInterestId(null);
                        setInterestForm(initialInterestForm);
                      }}
                      className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded uppercase font-bold transition-colors"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Interests List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                  DAFTAR MINAT TERDAFTAR ({interests.length})
                </h3>
              </div>

              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {interests.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#181920] border border-neutral-800 rounded-lg space-y-3 hover:border-red-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-red-400 uppercase font-bold">
                          {item.badge}
                        </span>
                        <h4 className="font-sans text-base font-bold text-white uppercase">
                          {item.title}
                        </h4>
                        <p className="font-serif text-xs text-neutral-400 line-clamp-2">
                          {item.tagline || item.content}
                        </p>
                      </div>
                    </div>

                    {item.imageUrl && (
                      <div className="w-full h-24 bg-neutral-900 rounded overflow-hidden border border-neutral-800">
                        <img
                          src={normalizeImageUrl(item.imageUrl)}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          style={{
                            objectPosition: `${item.imagePosX ?? 50}% ${item.imagePosY ?? 50}%`,
                            transform: `scale(${(item.imageScale ?? 100) / 100})`,
                          }}
                          className="w-full h-full object-cover transition-all duration-150 origin-center"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src.includes('lh3.googleusercontent.com/d/')) {
                              const fileId = target.src.split('lh3.googleusercontent.com/d/')[1];
                              if (fileId) {
                                target.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
                                return;
                              }
                            }
                            (target.parentElement as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800 font-mono text-xs">
                      <span className="text-neutral-500 text-[11px]">ID: {item.id}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditInterest(item)}
                          className="p-1.5 text-red-300 hover:text-white bg-red-950 rounded border border-red-800 transition-colors"
                          title="Edit Catatan Minat"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteInterest(item.id, item.title)}
                          className="p-1.5 text-red-300 hover:text-white bg-red-950 rounded border border-red-800 transition-colors"
                          title="Hapus Catatan Minat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: CONTACT MESSAGES INBOX */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                LOG TRANSMISI DARI FORMULIR KONTAK ({messages.length} PESAN)
              </h3>
            </div>

            {messages.length === 0 ? (
              <div className="p-12 text-center bg-[#181920] border border-neutral-800 rounded-lg space-y-2">
                <Inbox className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="font-mono text-xs text-neutral-400">
                  Belum ada transmisi pesan masuk dari formulir kontak.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-lg border transition-all space-y-3 ${
                      msg.is_read
                        ? 'bg-[#181920] border-neutral-800 opacity-80'
                        : 'bg-[#1e1f29] border-blue-600 shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                              msg.is_read
                                ? 'bg-neutral-800 text-neutral-400'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            {msg.is_read ? 'SUDAH DIBACA' : 'PESAN BARU'}
                          </span>
                          <span className="font-mono text-[11px] text-neutral-400">
                            {msg.created_at}
                          </span>
                        </div>
                        <h4 className="font-sans text-base font-bold text-white">
                          {msg.name}
                        </h4>
                        <a
                          href={`mailto:${msg.email}`}
                          className="font-mono text-xs text-blue-400 hover:underline"
                        >
                          {msg.email}
                        </a>
                      </div>

                      <span className="font-mono text-[10px] text-neutral-400 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                        {msg.category}
                      </span>
                    </div>

                    <div className="p-3 bg-neutral-900 rounded border border-neutral-800 font-serif text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800 font-mono text-xs">
                      <button
                        onClick={() => handleToggleReadMessage(msg)}
                        className="text-neutral-400 hover:text-white transition-colors"
                      >
                        {msg.is_read ? 'Tandai Belum Dibaca' : 'Tandai Selesai / Dibaca'}
                      </button>

                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Hapus Pesan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: DATABASE TOOLS & SEEDER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'database' && (
          <div className="max-w-2xl bg-[#181920] p-6 rounded-lg border border-neutral-800 shadow-xl space-y-6">
            <div className="border-b border-neutral-800 pb-3">
              <h3 className="font-sans text-lg font-bold uppercase text-white">
                DATABASE SYNC & INITIAL SEEDER
              </h3>
              <p className="font-serif text-xs text-neutral-400 mt-1">
                Gunakan alat ini untuk menginisialisasi atau mereset data default ke Firebase Cloud Firestore.
              </p>
            </div>

            <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded space-y-2 font-mono text-xs text-amber-200">
              <div className="font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>PERHATIAN (SEED DATA)</span>
              </div>
              <p className="font-serif text-xs text-amber-300 leading-relaxed">
                Menjalankan seeder akan mengunggah data bawaan dari <code>dossierData.ts</code> (Profil, Proyek, Sertifikat, Kategori Skill, dan Interests) ke Firestore.
              </p>
            </div>

            <button
              onClick={handleSeedDatabase}
              disabled={loading}
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold uppercase rounded shadow-lg transition-colors flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              <span>{loading ? 'MENYINKRONKAN...' : 'SINKRONKAN / SEED INITIAL DATA'}</span>
            </button>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* DOSSIER LIVE PREVIEW MODAL */}
      {/* ------------------------------------------------------------- */}
      {previewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-neutral-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewModalOpen(false)}
        >
          <div
            className="relative bg-[#16171d] text-[#f4efe6] w-full max-w-6xl max-h-[94vh] rounded-xl shadow-2xl border border-neutral-700 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="bg-[#121316] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full shadow-xs"
                    style={{ backgroundColor: getPreviewFolderColor(previewTab) }}
                  />
                  <span className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    {getPreviewModalTitle(previewTab)}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
                  ● DRAFT FORM AKTIF
                </span>
              </div>

              {/* 6-File Dossier Selector Toggles in Preview Modal */}
              <div className="flex flex-wrap items-center gap-1 bg-neutral-900 p-1 rounded border border-neutral-800 font-mono text-[11px]">
                <button
                  onClick={() => setPreviewTab('about')}
                  className={`px-2.5 py-1 rounded transition-colors font-bold uppercase ${
                    previewTab === 'about'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  #01 About
                </button>
                <button
                  onClick={() => setPreviewTab('interests')}
                  className={`px-2.5 py-1 rounded transition-colors font-bold uppercase ${
                    previewTab === 'interests'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  #02 Interests
                </button>
                <button
                  onClick={() => setPreviewTab('skills')}
                  className={`px-2.5 py-1 rounded transition-colors font-bold uppercase ${
                    previewTab === 'skills'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  #03 Skills
                </button>
                <button
                  onClick={() => setPreviewTab('projects')}
                  className={`px-2.5 py-1 rounded transition-colors font-bold uppercase ${
                    previewTab === 'projects'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  #04 Projects
                </button>
                <button
                  onClick={() => setPreviewTab('certificates')}
                  className={`px-2.5 py-1 rounded transition-colors font-bold uppercase ${
                    previewTab === 'certificates'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  #05 Certs
                </button>
                <button
                  onClick={() => setPreviewTab('contact')}
                  className={`px-2.5 py-1 rounded transition-colors font-bold uppercase ${
                    previewTab === 'contact'
                      ? 'bg-slate-600 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  #06 Contact
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded font-mono text-xs transition-colors border border-neutral-700"
                  title="Tutup Pratinjau (Esc)"
                >
                  <X className="w-4 h-4" />
                  <span>Tutup (Esc)</span>
                </button>
              </div>
            </div>

            {/* Modal Body: Physical Dossier Envelope & Paper Sheet */}
            <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-[#0f1013]">
              <div
                className="rounded-t-2xl sm:rounded-t-3xl shadow-2xl p-2 sm:p-4 md:p-6 transition-colors duration-300 relative border-t-2 border-l-2 border-r-2 border-white/25"
                style={{ backgroundColor: getPreviewFolderColor(previewTab) }}
              >
                {/* Physical Folder Die-cut Tab Top Header */}
                <div className="flex items-center justify-between pb-3 px-2 text-white">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
                    <span className="px-2 py-0.5 rounded bg-black/30 font-bold">
                      {getPreviewFolderIndex(previewTab)}
                    </span>
                    <span className="font-bold text-sm tracking-wide">
                      {getPreviewFolderCategory(previewTab)}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] opacity-80 hidden sm:inline-block">
                    BOATMIE ARCHIVAL SYSTEM // 2026 [ADMIN PREVIEW MODE]
                  </span>
                </div>

                {/* Inner Paper Sheet */}
                <div className="bg-paper-texture text-neutral-900 rounded-sm sm:rounded-md shadow-2xl relative p-4 sm:p-8 lg:p-10 min-h-[550px] border border-neutral-300/80">
                  {/* 3-Ring Binder Holes (Left margin) */}
                  <div className="hidden sm:block absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    <BinderHoles count={3} />
                  </div>

                  {/* Top Paperclip Decor */}
                  <div className="absolute -top-7 right-12 z-20 hidden sm:block pointer-events-none">
                    <PaperClip className="w-8 h-16" color="#334155" />
                  </div>

                  {/* Section Content with binder indentation */}
                  <div className="sm:pl-8 lg:pl-10">
                    {renderPreviewContent()}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Footer */}
            <div className="bg-[#121316] px-4 sm:px-6 py-2.5 border-t border-neutral-800 flex flex-wrap items-center justify-between text-neutral-400 font-mono text-xs gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Pratinjau merender data dari form yang sedang Anda ketik. Tekan tombol Simpan di form admin untuk menyimpan ke Firestore.</span>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-neutral-300 hover:text-white underline font-bold"
              >
                Kembali ke Edit Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
