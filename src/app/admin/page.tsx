'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ProjectItem,
  CertificateItem,
  SkillCategory,
  InterestItem,
  ContactMessage,
} from '@/types/dossier';
import {
  fetchProjects,
  saveProject,
  deleteProject,
  fetchCertificates,
  saveCertificate,
  deleteCertificate,
  fetchSkillCategories,
  saveSkillCategory,
  deleteSkillCategory,
  fetchInterests,
  saveInterest,
  deleteInterest,
  fetchProfile,
  saveProfile,
  fetchMessagesAdmin,
  markMessageRead,
  deleteMessage,
  seedInitialData,
} from '@/lib/firestore';
import {
  ABOUT_DATA,
  CONTACT_DATA,
} from '@/data/dossierData';
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
} from 'lucide-react';

const DEFAULT_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || 'boatmie2026';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'profile' | 'interests' | 'skills' | 'projects' | 'certificates' | 'messages' | 'database'
  >('profile');

  // Loading & notification states
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data states
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [interests, setInterests] = useState<InterestItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [profileData, setProfileData] = useState<any>({ ...ABOUT_DATA, contact: CONTACT_DATA });

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
    issueDate: '2026',
    credentialId: '',
    category: 'Fullstack',
    description: '',
    skillsRaw: '',
    verificationUrl: '',
    imageUrl: '',
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
    content: '',
    detailsRaw: '',
    fieldNotesRaw: '',
    sortOrder: 0,
  };
  const [interestForm, setInterestForm] = useState(initialInterestForm);

  // Check existing session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('boatmie_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
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
      const [projData, certData, skillData, interestData, profData, msgData] = await Promise.all([
        fetchProjects(),
        fetchCertificates(),
        fetchSkillCategories(),
        fetchInterests(),
        fetchProfile(),
        fetchMessagesAdmin(),
      ]);
      setProjects(projData || []);
      setCertificates(certData || []);
      setSkillCategories(skillData || []);
      setInterests(interestData || []);
      if (profData) {
        setProfileData(profData);
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === DEFAULT_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('boatmie_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Passcode otorisasi salah. Akses ditolak.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('boatmie_admin_auth');
    setPinInput('');
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
      featured: projectForm.featured ?? false,
      date: projectForm.date || '2026',
      metrics: metricsArray,
      status: (projectForm.status as 'Deployed' | 'Active Development' | 'Archived') || 'Deployed',
    };

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

  const handleEditProject = (item: ProjectItem) => {
    setEditingProjectId(item.id);
    setProjectForm({
      ...item,
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
      issueDate: certForm.issueDate || '2026',
      credentialId: certForm.credentialId || '',
      category: (certForm.category as 'Competition' | 'AI & ML' | 'Fullstack' | 'IT Fundamentals') || 'Fullstack',
      description: certForm.description || '',
      skills: skillsArray,
      verificationUrl: certForm.verificationUrl || '',
      imageUrl: certForm.imageUrl || '',
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
  // HANDLERS: PROFILE
  // -------------------------------------------------------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await saveProfile(profileData);
    if (res.success) {
      showNotification('success', 'Data Profil & Kontak berhasil diperbarui!');
      await loadAllData();
    } else {
      showNotification('error', res.error || 'Gagal menyimpan profil.');
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
      detailsRaw: item.details.join('\n'),
      fieldNotesRaw: item.fieldNotes.join('\n'),
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
              Masukkan security PIN untuk mengakses konsol kontrol arsip portofolio.
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
              <label htmlFor="pin" className="block text-neutral-400 uppercase font-bold">
                SECURITY PIN / PASSCODE
              </label>
              <input
                id="pin"
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded text-white text-center text-lg tracking-widest placeholder:text-neutral-600 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                autoFocus
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
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-md font-bold uppercase transition-all ${
              activeTab === 'profile'
                ? 'bg-blue-900 text-white border-t-2 border-blue-400 shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil & Kontak</span>
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
            <span>Interests ({interests.length})</span>
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
            <span>Skills ({skillCategories.length})</span>
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
            <span>Katalog Proyek ({projects.length})</span>
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
            <span>Sertifikat ({certificates.length})</span>
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
            <span>Inbox Transmisi ({messages.filter((m) => !m.is_read).length} Baru)</span>
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
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-purple-400" />
                  <h3 className="font-sans text-lg font-bold uppercase text-white">
                    {editingProjectId ? 'EDIT BERKAS PROYEK' : 'TAMBAH PROYEK BARU'}
                  </h3>
                </div>
                {editingProjectId && (
                  <button
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm(initialProjectForm);
                    }}
                    className="font-mono text-xs text-neutral-400 hover:text-white underline"
                  >
                    Batal Edit
                  </button>
                )}
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
                      type="text"
                      value={projectForm.date || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })}
                      placeholder="e.g. Q1 2026 / 2025"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Media Image Link Field */}
                <div className="space-y-1.5 p-3.5 bg-neutral-900/80 rounded border border-neutral-800">
                  <label className="block text-purple-400 font-bold uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Link Foto / Screenshot Proyek (URL)</span>
                  </label>
                  <input
                    type="url"
                    value={projectForm.imageUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... atau https://i.imgur.com/..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:border-purple-500 focus:outline-hidden"
                  />
                  <p className="text-[10px] text-neutral-500">
                    Masukkan URL gambar langsung (bisa dari Imgur, Cloudinary, Unsplash, GitHub Raw, dll).
                  </p>

                  {projectForm.imageUrl && (
                    <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center gap-3">
                      <div className="w-20 h-12 bg-neutral-950 rounded border border-neutral-700 overflow-hidden shrink-0">
                        <img
                          src={projectForm.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget.parentElement as HTMLElement).innerHTML = '<div class="text-[9px] text-red-400 p-1 text-center">Invalid Link</div>';
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono">
                        ✓ Pratinjau Link Foto Terdeteksi
                      </span>
                    </div>
                  )}
                </div>

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
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="text-neutral-300 font-bold uppercase">Proyek Unggulan (Featured)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold uppercase rounded shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingProjectId ? 'SIMPAN PERUBAHAN PROYEK' : 'ARSIPKAN PROYEK KE DATABASE'}</span>
                </button>
              </form>
            </div>

            {/* Existing Projects List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
                  DAFTAR PROYEK TERDAFTAR ({projects.length})
                </h3>
              </div>

              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {projects.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#181920] border border-neutral-800 rounded-lg space-y-3 hover:border-purple-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-purple-400 uppercase font-bold">
                          {item.category}
                        </span>
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
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
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
                      <div className="flex items-center gap-2">
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
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <h3 className="font-sans text-lg font-bold uppercase text-white">
                    {editingCertId ? 'EDIT SERTIFIKAT' : 'TAMBAH SERTIFIKAT BARU'}
                  </h3>
                </div>
                {editingCertId && (
                  <button
                    onClick={() => {
                      setEditingCertId(null);
                      setCertForm(initialCertForm);
                    }}
                    className="font-mono text-xs text-neutral-400 hover:text-white underline"
                  >
                    Batal Edit
                  </button>
                )}
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
                    <select
                      value={certForm.category || 'Fullstack'}
                      onChange={(e) =>
                        setCertForm({
                          ...certForm,
                          category: e.target.value as 'Competition' | 'AI & ML' | 'Fullstack' | 'IT Fundamentals',
                        })
                      }
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden"
                    >
                      <option value="Competition">Competition</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="Fullstack">Fullstack</option>
                      <option value="IT Fundamentals">IT Fundamentals</option>
                    </select>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      Tahun / Tanggal Terbit
                    </label>
                    <input
                      type="text"
                      value={certForm.issueDate || ''}
                      onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                      placeholder="e.g. 2024 / Mei 2025"
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden"
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

                {/* Media Image Link Field for Certificate */}
                <div className="space-y-1.5 p-3.5 bg-neutral-900/80 rounded border border-neutral-800">
                  <label className="block text-amber-400 font-bold uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Link Foto / Dokumen Sertifikat (URL)</span>
                  </label>
                  <input
                    type="url"
                    value={certForm.imageUrl || ''}
                    onChange={(e) => setCertForm({ ...certForm, imageUrl: e.target.value })}
                    placeholder="https://drive.google.com/... atau https://i.imgur.com/..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden"
                  />
                  <p className="text-[10px] text-neutral-500">
                    Masukkan URL gambar langsung dari hasil scan dokumen atau sertifikat digital.
                  </p>

                  {certForm.imageUrl && (
                    <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center gap-3">
                      <div className="w-20 h-14 bg-neutral-950 rounded border border-neutral-700 overflow-hidden shrink-0">
                        <img
                          src={certForm.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget.parentElement as HTMLElement).innerHTML = '<div class="text-[9px] text-red-400 p-1 text-center">Invalid Link</div>';
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-amber-400 font-mono">
                        ✓ Pratinjau Dokumen Terdeteksi
                      </span>
                    </div>
                  )}
                </div>

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

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Urutan Tampil (Sort Order)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={certForm.sortOrder || 0}
                    onChange={(e) => setCertForm({ ...certForm, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold uppercase rounded shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingCertId ? 'SIMPAN PERUBAHAN SERTIFIKAT' : 'SIMPAN SERTIFIKAT KE DATABASE'}</span>
                </button>
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
                {certificates.map((item) => (
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
                        {item.issueDate}
                      </span>
                    </div>

                    {item.imageUrl && (
                      <div className="w-full h-24 bg-neutral-900 rounded overflow-hidden border border-neutral-800">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
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
        {/* TAB 3: PROFILE & IDENTITY MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl bg-[#181920] p-6 sm:p-8 rounded-lg border border-neutral-800 shadow-xl space-y-6">
            <div className="border-b border-neutral-800 pb-3">
              <h3 className="font-sans text-lg font-bold uppercase text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                <span>IDENTITAS DOSSIER & KONTAK (ABOUT & CONTACT)</span>
              </h3>
              <p className="font-serif text-xs text-neutral-400 mt-1">
                Data utama yang tampil pada tab Dossier #01 (About Me) dan Dossier #06 (Contact).
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.name || ''}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Alias / Kode Panggilan
                  </label>
                  <input
                    type="text"
                    value={profileData.alias || ''}
                    onChange={(e) => setProfileData({ ...profileData, alias: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Avatar URL Link */}
              <div className="space-y-1.5 p-3.5 bg-neutral-900/80 rounded border border-neutral-800">
                <label className="block text-blue-400 font-bold uppercase flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Link Foto Profil / Avatar (URL)</span>
                </label>
                <input
                  type="url"
                  value={profileData.avatarUrl || ''}
                  onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
                  placeholder="https://... atau /media/profile/avatar.png"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                />

                {profileData.avatarUrl && (
                  <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center gap-3">
                    <div className="w-14 h-14 bg-neutral-950 rounded-full border border-neutral-700 overflow-hidden shrink-0">
                      <img
                        src={profileData.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget.parentElement as HTMLElement).innerHTML = '<div class="text-[9px] text-red-400 p-2 text-center">Invalid</div>';
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-blue-400 font-mono">
                      ✓ Pratinjau Avatar Terdeteksi
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Peran / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.role || ''}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Status Ketersediaan (Availability)
                  </label>
                  <input
                    type="text"
                    value={profileData.status || ''}
                    onChange={(e) => setProfileData({ ...profileData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={profileData.location || ''}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Email Kontak Utama
                  </label>
                  <input
                    type="email"
                    value={profileData.contact?.email || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        contact: { ...profileData.contact, email: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Social Channels Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-neutral-900/80 rounded border border-neutral-800">
                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={profileData.contact?.github || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        contact: { ...profileData.contact, github: e.target.value },
                      })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profileData.contact?.linkedin || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        contact: { ...profileData.contact, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={profileData.contact?.instagram || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        contact: { ...profileData.contact, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-neutral-400 font-bold uppercase">
                  Ringkasan Kasus / Case Summary (About Me)
                </label>
                <textarea
                  rows={3}
                  value={profileData.caseSummary || ''}
                  onChange={(e) => setProfileData({ ...profileData, caseSummary: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden font-sans text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-neutral-400 font-bold uppercase">
                  Klasifikasi Dossier
                </label>
                <input
                  type="text"
                  value={profileData.classification || ''}
                  onChange={(e) => setProfileData({ ...profileData, classification: e.target.value })}
                  placeholder="e.g. UNRESTRICTED / PUBLIC DOSSIER"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-neutral-400 font-bold uppercase">
                  Bio Paragraf (1 paragraf per baris, pisahkan dengan Enter)
                </label>
                <textarea
                  rows={5}
                  value={(profileData.bioParagraphs || []).join('\n')}
                  onChange={(e) => setProfileData({ ...profileData, bioParagraphs: e.target.value.split('\n') })}
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
                  value={(profileData.stats || []).map((s: any) => `${s.label} | ${s.value}`).join('\n')}
                  onChange={(e) => setProfileData({
                    ...profileData,
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Ketersediaan / Availability (Contact)
                  </label>
                  <input
                    type="text"
                    value={profileData.contact?.availability || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        contact: { ...profileData.contact, availability: e.target.value },
                      })
                    }
                    placeholder="Available for Web Projects, Fullstack Roles, ..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Lokasi Kontak (Contact)
                  </label>
                  <input
                    type="text"
                    value={profileData.contact?.location || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        contact: { ...profileData.contact, location: e.target.value },
                      })
                    }
                    placeholder="West Java, Indonesia"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Field Directive (Sticky Note di About)
                  </label>
                  <input
                    type="text"
                    value={profileData.fieldDirective || ''}
                    onChange={(e) => setProfileData({ ...profileData, fieldDirective: e.target.value })}
                    placeholder="Kutipan atau arahan yang tampil di About section"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-400 font-bold uppercase">
                    Quick Memo (Quote di Contact)
                  </label>
                  <input
                    type="text"
                    value={profileData.contact?.quickMemo || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        contact: { ...profileData.contact, quickMemo: e.target.value },
                      })
                    }
                    placeholder="Kutipan singkat yang tampil di Contact section"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold uppercase rounded shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>SIMPAN PERUBAHAN PROFIL & KONTAK</span>
              </button>
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
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-sans text-lg font-bold uppercase text-white">
                    {editingSkillCode ? 'EDIT KATEGORI SKILL' : 'TAMBAH KATEGORI SKILL'}
                  </h3>
                </div>
                {editingSkillCode && (
                  <button
                    onClick={() => {
                      setEditingSkillCode(null);
                      setSkillForm(initialSkillForm);
                    }}
                    className="font-mono text-xs text-neutral-400 hover:text-white underline"
                  >
                    Batal Edit
                  </button>
                )}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold uppercase rounded shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SIMPAN KATEGORI SKILL</span>
                </button>
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
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-red-400" />
                  <h3 className="font-sans text-lg font-bold uppercase text-white">
                    {editingInterestId ? 'EDIT CATATAN MINAT' : 'TAMBAH CATATAN MINAT BARU'}
                  </h3>
                </div>
                {editingInterestId && (
                  <button
                    onClick={() => {
                      setEditingInterestId(null);
                      setInterestForm(initialInterestForm);
                    }}
                    className="font-mono text-xs text-neutral-400 hover:text-white underline"
                  >
                    Batal Edit
                  </button>
                )}
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

                {/* Media Image Link Field for Interest */}
                <div className="space-y-1.5 p-3.5 bg-neutral-900/80 rounded border border-neutral-800">
                  <label className="block text-red-400 font-bold uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Link Foto Kegiatan / Dokumentasi (URL)</span>
                  </label>
                  <input
                    type="url"
                    value={interestForm.imageUrl || ''}
                    onChange={(e) => setInterestForm({ ...interestForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... atau https://i.imgur.com/..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:border-red-500 focus:outline-hidden"
                  />

                  {interestForm.imageUrl && (
                    <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center gap-3">
                      <div className="w-20 h-14 bg-neutral-950 rounded border border-neutral-700 overflow-hidden shrink-0">
                        <img
                          src={interestForm.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget.parentElement as HTMLElement).innerHTML = '<div class="text-[9px] text-red-400 p-1 text-center">Invalid Link</div>';
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-red-400 font-mono">
                        ✓ Pratinjau Foto Terdeteksi
                      </span>
                    </div>
                  )}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-red-700 hover:bg-red-600 text-white font-bold uppercase rounded shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SIMPAN CATATAN MINAT</span>
                </button>
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
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
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
    </div>
  );
}
