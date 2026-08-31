'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CERTIFICATES_DATA } from '@/data/dossierData';
import { fetchCertificates, sortCertificatesByDate, formatCertificateDisplayDate, normalizeImageUrl, parseCertificateDate, sanitizeUrl } from '@/lib/firestore';
import { CertificateItem } from '@/types/dossier';
import { StampBadge } from '../common/StampBadge';
import { TapeStrip } from '../common/TapeStrip';
import { PaperClip } from '../common/PaperClip';
import {
  Award,
  ShieldCheck,
  CheckCircle,
  FileCheck,
  Bookmark,
  Scroll,
  Search,
  X,
  Filter,
  ArrowUpRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Eye,
  ZoomIn,
  Maximize2,
} from 'lucide-react';

interface CertificatesSectionProps {
  previewCertificates?: CertificateItem[];
  initialSelectedId?: string;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  previewCertificates,
  initialSelectedId,
}) => {
  const initialSorted = useMemo(
    () => sortCertificatesByDate(previewCertificates || CERTIFICATES_DATA),
    [previewCertificates]
  );
  const [certificates, setCertificates] = useState<CertificateItem[]>(initialSorted);
  const [selectedCertId, setSelectedCertId] = useState<string>(
    initialSelectedId || initialSorted[0]?.id || ''
  );
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState<boolean>(false);
  const [detailModalCert, setDetailModalCert] = useState<CertificateItem | null>(null);
  const [lightboxData, setLightboxData] = useState<{ url: string; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalCategoryFilter, setModalCategoryFilter] = useState<string>('ALL');
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  const [detailImageLoadError, setDetailImageLoadError] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sertifikat Terbaru untuk tampilan depan (Maksimal 4 terbaru)
  const latestCertificates = useMemo(() => {
    return certificates.slice(0, 4);
  }, [certificates]);

  const selectedCert =
    latestCertificates.find((c) => c.id === selectedCertId) ||
    certificates.find((c) => c.id === selectedCertId) ||
    latestCertificates[0] ||
    certificates[0] ||
    CERTIFICATES_DATA[0];

  useEffect(() => {
    setImageLoadError(false);
  }, [selectedCert?.id, selectedCert?.imageUrl]);

  useEffect(() => {
    setDetailImageLoadError(false);
  }, [detailModalCert?.id, detailModalCert?.imageUrl]);

  useEffect(() => {
    if (previewCertificates) {
      const sorted = sortCertificatesByDate(previewCertificates);
      setCertificates(sorted);
      if (initialSelectedId) {
        setSelectedCertId(initialSelectedId);
      } else if (sorted.length > 0) {
        setSelectedCertId(sorted[0].id);
      }
      return;
    }
    fetchCertificates().then((data) => {
      if (data && data.length > 0) {
        const sorted = sortCertificatesByDate(data);
        setCertificates(sorted);
        if (initialSelectedId) {
          setSelectedCertId(initialSelectedId);
        } else {
          setSelectedCertId(sorted[0].id);
        }
      }
    });
  }, [previewCertificates, initialSelectedId]);

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxData) {
          setLightboxData(null);
        } else if (detailModalCert) {
          setDetailModalCert(null);
        } else if (isLedgerModalOpen) {
          setIsLedgerModalOpen(false);
        }
      }
    };
    if (isLedgerModalOpen || detailModalCert || lightboxData) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isLedgerModalOpen, detailModalCert, lightboxData]);

  // Unique categories for ledger filter pills
  const ledgerCategories = useMemo(() => {
    const set = new Set(certificates.map((c) => c.category));
    return ['ALL', ...Array.from(set)];
  }, [certificates]);

  // Filtered certificates for Ledger Modal
  const modalFilteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const matchesCategory =
        modalCategoryFilter === 'ALL' || c.category === modalCategoryFilter;
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.credentialId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [certificates, searchQuery, modalCategoryFilter]);

  const handleImageErrorFallback = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    setError?: (v: boolean) => void
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
    if (setError) setError(true);
    else target.style.display = 'none';
  };

  return (
    <div className="space-y-8 text-neutral-900">
      {/* Dossier Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-neutral-300 pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
            DOSSIER #05
          </span>
          <span className="text-neutral-500">SUBJECT: CREDENTIALS & SCANNED ACCREDITATIONS</span>
        </div>
        <div className="flex items-center gap-2">
          <StampBadge text="AUTHENTICATED // OFFICIAL" variant="amber" rotate={-1} />
        </div>
      </div>

      {/* Intro Header & Ledger Vault Modal Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide text-neutral-950 leading-tight">
            SERTIFIKAT & PENCAPAIAN
          </h1>
          <p className="font-serif text-base sm:text-lg text-neutral-700 max-w-2xl leading-relaxed">
            Dokumentasi sertifikasi resmi, olimpiade sains kompetitif (ISQO), penguasaan rekayasa AI, serta verifikasi kompetensi standar kejuruan perangkat lunak.
          </p>
        </div>

        {/* Modal Opener Button */}
        <button
          onClick={() => setIsLedgerModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-800 hover:bg-amber-900 text-white font-mono text-xs font-bold uppercase rounded shadow-md hover:shadow-lg transition-all shrink-0 active:scale-95 border border-amber-900 cursor-pointer"
        >
          <Scroll className="w-4 h-4 text-amber-300" />
          <span>LIHAT SEMUA SERTIFIKAT ({certificates.length})</span>
        </button>
      </div>

      {/* Grid of Latest Credentials (Maksimal 4 Terbaru) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {latestCertificates.map((cert) => {
          const isSelected = cert.id === selectedCertId;
          return (
            <button
              key={cert.id}
              onClick={() => setSelectedCertId(cert.id)}
              className={`p-5 rounded-md text-left transition-all border relative flex flex-col justify-between min-h-[160px] cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-600 shadow-md ring-2 ring-amber-500/50 translate-y-[-2px]'
                  : 'bg-white text-neutral-900 border-neutral-300 hover:border-amber-400 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-amber-900 mb-2">
                  <span className="px-2 py-0.5 bg-amber-100 rounded font-bold uppercase">
                    {cert.category}
                  </span>
                  <span className="text-neutral-500 font-bold">{formatCertificateDisplayDate(cert.issueDate)}</span>
                </div>

                <h3 className="font-sans text-lg sm:text-xl text-neutral-950 uppercase tracking-wide leading-tight mb-1.5">
                  {cert.title}
                </h3>
                <p className="font-serif text-xs text-neutral-700 mb-3">
                  Issuer: <span className="font-medium text-neutral-900">{cert.issuer}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between font-mono text-[11px] text-neutral-500">
                <span className="truncate max-w-[200px]">REF: {cert.credentialId}</span>
                <span className="text-amber-800 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Certificate Scanned Document Display (Option 3: Archival Desk & Inspection Mat Showcase) */}
      <div className="relative bg-[#fffdfa] p-6 sm:p-10 rounded shadow-xl border-4 border-double border-amber-800/30 space-y-8">
        {/* Paperclip clipping */}
        <div className="absolute -top-6 left-10 z-20 pointer-events-none hidden sm:block">
          <PaperClip className="w-8 h-16" color="#78350f" />
        </div>

        {/* Scanned watermarks & tape */}
        <div className="absolute -top-3 right-10 pointer-events-none">
          <TapeStrip rotate={-2} width="w-28" />
        </div>

        {/* Certificate Header Banner */}
        <div className="text-center space-y-2 border-b-2 border-amber-900/20 pb-6 pt-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-800 mb-1 border border-amber-300 shadow-2xs">
            <Award className="w-6 h-6" />
          </div>
          <div className="font-mono text-xs tracking-widest text-amber-800 font-bold uppercase">
            DOSSIER #05 // CERTIFICATE OF OFFICIAL ATTAINMENT
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide leading-snug text-neutral-950 max-w-3xl mx-auto">
            {selectedCert.title}
          </h2>
          <p className="font-serif text-base sm:text-lg text-neutral-600">
            Conferred officially by <span className="font-semibold text-neutral-900">{selectedCert.issuer}</span>
          </p>
        </div>

        {/* CENTERPIECE: Archival Polaroid Inspection Mat (Large Landscape Certificate Showcase) */}
        {selectedCert.imageUrl && !imageLoadError && (
          <div className="relative max-w-4xl mx-auto">
            <div
              onClick={() =>
                setLightboxData({
                  url: normalizeImageUrl(selectedCert.imageUrl!),
                  title: selectedCert.title,
                })
              }
              className="group relative aspect-[16/10] sm:aspect-[16/10] max-h-[520px] w-full rounded-md border-2 border-amber-900/30 bg-neutral-900 overflow-hidden shadow-2xl cursor-zoom-in transition-all duration-300 hover:border-amber-600 hover:shadow-2xl ring-1 ring-amber-400/30"
              title="Klik untuk melihat resolusi penuh (Zoom)"
            >
              {/* Subtle corner tape strips */}
              <div className="absolute -top-2 -left-2 z-20 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
                <TapeStrip rotate={-45} width="w-16" />
              </div>
              <div className="absolute -top-2 -right-2 z-20 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
                <TapeStrip rotate={45} width="w-16" />
              </div>

              {/* Scanned Image */}
              <img
                key={`${selectedCert.id}-${selectedCert.imageUrl}`}
                src={normalizeImageUrl(selectedCert.imageUrl)}
                alt={selectedCert.title}
                referrerPolicy="no-referrer"
                style={{
                  objectPosition: `${selectedCert.imagePosX ?? 50}% ${selectedCert.imagePosY ?? 50}%`,
                  transformOrigin: `${selectedCert.imagePosX ?? 50}% ${selectedCert.imagePosY ?? 50}%`,
                  transform: `scale(${(selectedCert.imageScale ?? 100) / 100})`,
                }}
                className="w-full h-full object-contain sm:object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                onError={(e) => handleImageErrorFallback(e, setImageLoadError)}
              />

              {/* Hover Inspection Overlay */}
              <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-2xs">
                <div className="px-4 py-2 rounded bg-amber-950/95 border border-amber-400/60 shadow-xl flex items-center gap-2 text-white font-mono text-xs uppercase font-bold tracking-wider transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <ZoomIn className="w-4 h-4 text-amber-300" />
                  <span>KLIK UNTUK INSPEKSI PENUH (ZOOM)</span>
                </div>
              </div>

              {/* Resolution tag */}
              <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-1 rounded bg-black/75 text-white font-mono text-[10px] uppercase flex items-center gap-1.5 backdrop-blur-xs pointer-events-none border border-white/10">
                <Maximize2 className="w-3 h-3 text-amber-300" />
                <span>INSPECTION MAT // SCANNED ARTIFACT</span>
              </div>
            </div>
          </div>
        )}

        {/* Narrative & Accreditation Plaque */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 border-t border-amber-900/15">
          {/* Left Column: Accreditation Narrative & Skills */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2.5">
                ACCREDITATION STATEMENT & SCOPE
              </h4>
              <p className="font-serif text-base sm:text-lg text-neutral-800 leading-relaxed">
                {selectedCert.description}
              </p>
            </div>

            <div className="pt-2">
              <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2.5">
                VERIFIED SKILLSETS & COMPETENCY
              </h5>
              <div className="flex flex-wrap gap-2">
                {(selectedCert.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-xs px-3 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 font-semibold shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Physical Accreditation Verification Box */}
          <div className="lg:col-span-5 bg-amber-50/70 p-5 rounded border border-amber-200/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-amber-200">
                <span className="font-mono text-[10px] uppercase text-neutral-500 font-bold tracking-wider">
                  AUTHENTICATION REGISTRY
                </span>
                <span className="text-amber-800 font-bold font-mono text-xs flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  VERIFIED
                </span>
              </div>

              <div className="font-mono text-xs space-y-2 text-neutral-700">
                <div className="flex justify-between items-center py-1 border-b border-amber-100">
                  <span className="text-neutral-500 uppercase text-[11px]">REGISTRY ID:</span>
                  <span className="font-bold text-neutral-900 truncate max-w-[180px]">{selectedCert.credentialId}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-amber-100">
                  <span className="text-neutral-500 uppercase text-[11px]">DATE ISSUED:</span>
                  <span className="font-bold text-neutral-900">{formatCertificateDisplayDate(selectedCert.issueDate)}</span>
                </div>
                {selectedCert.expiryDate ? (
                  <div className="flex justify-between items-center py-1 border-b border-amber-100">
                    <span className="text-neutral-500 uppercase text-[11px]">VALID UNTIL:</span>
                    <span className={`font-bold ${parseCertificateDate(selectedCert.expiryDate) > 0 && parseCertificateDate(selectedCert.expiryDate) < Date.now() ? 'text-rose-700' : 'text-neutral-900'}`}>
                      {formatCertificateDisplayDate(selectedCert.expiryDate)}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center py-1 border-b border-amber-100">
                    <span className="text-neutral-500 uppercase text-[11px]">EXPIRATION:</span>
                    <span className="font-bold text-neutral-800">SEUMUR HIDUP</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1 border-b border-amber-100">
                  <span className="text-neutral-500 uppercase text-[11px]">CATEGORY:</span>
                  <span className="font-bold text-amber-900">{selectedCert.category}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-neutral-500 uppercase text-[11px]">STATUS:</span>
                  {selectedCert.expiryDate && parseCertificateDate(selectedCert.expiryDate) > 0 && parseCertificateDate(selectedCert.expiryDate) < Date.now() ? (
                    <span className="font-bold text-rose-700">KEDALUWARSA (EXPIRED)</span>
                  ) : (
                    <span className="font-bold text-emerald-700">VALID & OFFICIALLY VERIFIED</span>
                  )}
                </div>
              </div>
            </div>

            {selectedCert.verificationUrl && (
              <a
                href={sanitizeUrl(selectedCert.verificationUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-mono text-xs uppercase font-bold rounded shadow-xs transition-colors cursor-pointer"
              >
                <span>Verifikasi Kredensial Resmi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Accreditation Ledger Vault Modal (Katalog Buku Register Lengkap) */}
      {mounted && isLedgerModalOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-neutral-950/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsLedgerModalOpen(false)}
        >
          <div
            className="relative bg-[#fffdfa] text-neutral-900 w-full max-w-5xl max-h-[90vh] rounded shadow-2xl border-4 border-double border-amber-800/40 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Tab Bar */}
            <div className="bg-amber-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-amber-900">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-amber-800 rounded border border-amber-600">
                  <Scroll className="w-4 h-4 text-amber-200" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-amber-300 uppercase tracking-widest">
                    OFFICIAL ACCREDITATION VAULT // DOSSIER #05
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl uppercase tracking-wide leading-none text-white">
                    BUKU REGISTER LENGKAP SERTIFIKAT & PENCAPAIAN
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsLedgerModalOpen(false)}
                className="p-1.5 text-amber-300 hover:text-white hover:bg-amber-800 rounded transition-colors cursor-pointer"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Category Filter Toolbar */}
            <div className="p-4 bg-white border-b border-neutral-200 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari sertifikat berdasarkan nama, penerbit, nomor registrasi, atau kompetensi..."
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded font-mono text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 font-mono text-xs cursor-pointer"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Category Filter Pills in Modal */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="font-mono text-[11px] text-neutral-500 uppercase flex items-center gap-1 shrink-0">
                  <Filter className="w-3 h-3" />
                  Kategori:
                </span>
                {ledgerCategories.map((cat) => {
                  const isActive = modalCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setModalCategoryFilter(cat)}
                      className={`px-3 py-1 rounded font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors border cursor-pointer ${
                        isActive
                          ? 'bg-amber-800 text-white border-amber-950 font-bold shadow-2xs'
                          : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
                      }`}
                    >
                      {cat === 'ALL' ? 'SEMUA KATEGORI' : cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Body: Grid of All Registered Certificates with Image Previews */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-paper-texture space-y-4">
              {modalFilteredCertificates.length === 0 ? (
                <div className="py-12 text-center space-y-2 bg-white/70 rounded border border-neutral-200 p-6">
                  <Award className="w-10 h-10 text-neutral-400 mx-auto" />
                  <h4 className="font-sans text-lg uppercase tracking-wide text-neutral-800">
                    KREDENSIAL TIDAK DITEMUKAN
                  </h4>
                  <p className="font-serif text-sm text-neutral-600 max-w-md mx-auto">
                    Tidak ada sertifikat yang cocok dengan pencarian &quot;{searchQuery}&quot;.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modalFilteredCertificates.map((cert) => {
                    return (
                      <div
                        key={cert.id}
                        className="p-4 rounded border bg-white flex flex-col justify-between transition-all hover:shadow-md relative border-neutral-200 hover:border-amber-400 group"
                      >
                        <div>
                          {/* Certificate Card Image Thumbnail Preview */}
                          {cert.imageUrl ? (
                            <div className="relative aspect-[16/10] w-full rounded border border-amber-200/80 overflow-hidden bg-neutral-100 mb-3 shadow-2xs group-hover:border-amber-400 transition-colors">
                              <img
                                src={normalizeImageUrl(cert.imageUrl)}
                                alt={cert.title}
                                referrerPolicy="no-referrer"
                                style={{
                                  objectPosition: `${cert.imagePosX ?? 50}% ${cert.imagePosY ?? 50}%`,
                                  transformOrigin: `${cert.imagePosX ?? 50}% ${cert.imagePosY ?? 50}%`,
                                  transform: `scale(${(cert.imageScale ?? 100) / 100})`,
                                }}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => handleImageErrorFallback(e)}
                              />
                            </div>
                          ) : (
                            <div className="relative aspect-[16/10] w-full rounded border border-dashed border-amber-300 bg-amber-50/60 flex flex-col items-center justify-center text-amber-800/70 mb-3">
                              <Award className="w-8 h-8 mb-1 text-amber-700" />
                              <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
                                DOKUMEN RESMI
                              </span>
                            </div>
                          )}

                          {/* Category & Date */}
                          <div className="flex items-center justify-between font-mono text-[10px] text-amber-900 mb-2 gap-1">
                            <span className="px-2 py-0.5 bg-amber-100 rounded font-bold uppercase truncate">
                              {cert.category}
                            </span>
                            <span className="text-neutral-500 font-bold shrink-0">
                              {formatCertificateDisplayDate(cert.issueDate)}
                              {cert.expiryDate ? ` - ${formatCertificateDisplayDate(cert.expiryDate)}` : ''}
                            </span>
                          </div>

                          {/* Certificate Title & Issuer */}
                          <h4 className="font-sans text-base uppercase tracking-wide text-neutral-950 mb-1 leading-tight line-clamp-2">
                            {cert.title}
                          </h4>
                          <p className="font-serif text-xs text-neutral-600 mb-3 line-clamp-1">
                            Issuer: <span className="font-medium text-neutral-900">{cert.issuer}</span>
                          </p>

                          {/* Skills Badges */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {cert.skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200"
                              >
                                {skill}
                              </span>
                            ))}
                            {cert.skills.length > 3 && (
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-semibold">
                                +{cert.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Button: Open Pop-Up Detail */}
                        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-neutral-500 truncate max-w-[110px]">
                            REF: {cert.credentialId}
                          </span>
                          <button
                            onClick={() => setDetailModalCert(cert)}
                            className="px-3 py-1.5 rounded font-mono text-xs font-bold uppercase transition-colors inline-flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-white shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-200" />
                            <span>LIHAT DETAIL</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="p-3.5 bg-neutral-100 border-t border-neutral-200 flex flex-wrap items-center justify-between text-neutral-600 font-mono text-xs gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>TOTAL REGISTER: {modalFilteredCertificates.length} DARI {certificates.length} KREDENSIAL</span>
              </div>
              <span className="text-neutral-500">KLIK &apos;LIHAT DETAIL&apos; UNTUK POP-UP DOKUMEN LENGKAP</span>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Detail Pop-up Page / Modal for Certificates (Option 3: Polaroid Inspection Mat in Foreground) */}
      {mounted && detailModalCert && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-sm animate-fadeIn"
          onClick={() => setDetailModalCert(null)}
        >
          <div
            className="relative bg-[#fffdfa] text-neutral-900 w-full max-w-4xl max-h-[92vh] rounded shadow-2xl border-4 border-double border-amber-800 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pop-up Top Header Bar */}
            <div className="bg-amber-950 text-white px-4 sm:px-5 py-3 flex items-center justify-between border-b border-amber-900 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 truncate">
                <button
                  onClick={() => setDetailModalCert(null)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-900 hover:bg-amber-800 border border-amber-700 text-amber-200 hover:text-white font-mono text-[11px] font-bold uppercase transition-colors shrink-0 cursor-pointer"
                  title="Kembali ke Buku Register"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
                <div className="h-4 w-px bg-amber-800 shrink-0" />
                <span className="font-mono text-[10px] text-amber-300 uppercase tracking-widest font-bold truncate">
                  DOSSIER #05 // {detailModalCert.title.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setDetailModalCert(null)}
                className="p-1.5 text-amber-300 hover:text-white hover:bg-amber-800 rounded transition-colors shrink-0 cursor-pointer"
                title="Tutup Berkas (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pop-up Scrollable Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-[#fffdfa] relative space-y-6">
              {/* Paperclip clipping */}
              <div className="absolute -top-6 left-10 z-20 pointer-events-none hidden sm:block">
                <PaperClip className="w-8 h-16" color="#78350f" />
              </div>

              {/* Tape decor */}
              <div className="absolute -top-3 right-10 pointer-events-none">
                <TapeStrip rotate={-2} width="w-28" />
              </div>

              {/* Certificate Header Banner */}
              <div className="text-center space-y-2 border-b-2 border-amber-900/20 pb-6 pt-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-800 mb-1 border border-amber-300 shadow-2xs">
                  <Award className="w-6 h-6" />
                </div>
                <div className="font-mono text-xs tracking-widest text-amber-800 font-bold uppercase">
                  CERTIFICATE OF OFFICIAL ATTAINMENT
                </div>
                <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide leading-snug text-neutral-950 max-w-3xl mx-auto">
                  {detailModalCert.title}
                </h2>
                <p className="font-serif text-base sm:text-lg text-neutral-600">
                  Conferred officially by <span className="font-semibold text-neutral-900">{detailModalCert.issuer}</span>
                </p>
              </div>

              {/* Pop-up Centerpiece: Large Scanned Image Mat */}
              {detailModalCert.imageUrl && !detailImageLoadError && (
                <div className="relative max-w-4xl mx-auto">
                  <div
                    onClick={() =>
                      setLightboxData({
                        url: normalizeImageUrl(detailModalCert.imageUrl!),
                        title: detailModalCert.title,
                      })
                    }
                    className="group relative aspect-[16/10] sm:aspect-[16/10] max-h-[480px] w-full rounded-md border-2 border-amber-900/30 bg-neutral-900 overflow-hidden shadow-2xl cursor-zoom-in transition-all duration-300 hover:border-amber-600 hover:shadow-2xl ring-1 ring-amber-400/30"
                    title="Klik untuk melihat resolusi penuh (Zoom)"
                  >
                    <div className="absolute -top-2 -left-2 z-20 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
                      <TapeStrip rotate={-45} width="w-16" />
                    </div>
                    <div className="absolute -top-2 -right-2 z-20 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
                      <TapeStrip rotate={45} width="w-16" />
                    </div>

                    <img
                      key={`detail-cert-${detailModalCert.id}-${detailModalCert.imageUrl}`}
                      src={normalizeImageUrl(detailModalCert.imageUrl)}
                      alt={detailModalCert.title}
                      referrerPolicy="no-referrer"
                      style={{
                        objectPosition: `${detailModalCert.imagePosX ?? 50}% ${detailModalCert.imagePosY ?? 50}%`,
                        transformOrigin: `${detailModalCert.imagePosX ?? 50}% ${detailModalCert.imagePosY ?? 50}%`,
                        transform: `scale(${(detailModalCert.imageScale ?? 100) / 100})`,
                      }}
                      className="w-full h-full object-contain sm:object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      onError={(e) => handleImageErrorFallback(e, setDetailImageLoadError)}
                    />

                    {/* Hover Inspection Overlay */}
                    <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-2xs">
                      <div className="px-4 py-2 rounded bg-amber-950/95 border border-amber-400/60 shadow-xl flex items-center gap-2 text-white font-mono text-xs uppercase font-bold tracking-wider transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <ZoomIn className="w-4 h-4 text-amber-300" />
                        <span>KLIK UNTUK INSPEKSI PENUH (ZOOM)</span>
                      </div>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-1 rounded bg-black/75 text-white font-mono text-[10px] uppercase flex items-center gap-1.5 backdrop-blur-xs pointer-events-none border border-white/10">
                      <Maximize2 className="w-3 h-3 text-amber-300" />
                      <span>INSPECTION MAT // SCANNED ARTIFACT</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Certificate Details & Accreditation Plaque */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 border-t border-amber-900/15">
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2.5">
                      ACCREDITATION STATEMENT & SCOPE
                    </h4>
                    <p className="font-serif text-base sm:text-lg text-neutral-800 leading-relaxed">
                      {detailModalCert.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 pb-1 mb-2.5">
                      VERIFIED SKILLSETS & COMPETENCY
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {(detailModalCert.skills || []).map((skill) => (
                        <span
                          key={skill}
                          className="font-mono text-xs px-3 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 font-semibold shadow-2xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-amber-50/70 p-5 rounded border border-amber-200/80 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2.5 border-b border-amber-200">
                      <span className="font-mono text-[10px] uppercase text-neutral-500 font-bold tracking-wider">
                        AUTHENTICATION REGISTRY
                      </span>
                      <span className="text-amber-800 font-bold font-mono text-xs flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        VERIFIED
                      </span>
                    </div>

                    <div className="font-mono text-xs space-y-2 text-neutral-700">
                      <div className="flex justify-between items-center py-1 border-b border-amber-100">
                        <span className="text-neutral-500 uppercase text-[11px]">REGISTRY ID:</span>
                        <span className="font-bold text-neutral-900 truncate max-w-[180px]">{detailModalCert.credentialId}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-amber-100">
                        <span className="text-neutral-500 uppercase text-[11px]">DATE ISSUED:</span>
                        <span className="font-bold text-neutral-900">{formatCertificateDisplayDate(detailModalCert.issueDate)}</span>
                      </div>
                      {detailModalCert.expiryDate ? (
                        <div className="flex justify-between items-center py-1 border-b border-amber-100">
                          <span className="text-neutral-500 uppercase text-[11px]">VALID UNTIL:</span>
                          <span className={`font-bold ${parseCertificateDate(detailModalCert.expiryDate) > 0 && parseCertificateDate(detailModalCert.expiryDate) < Date.now() ? 'text-rose-700' : 'text-neutral-900'}`}>
                            {formatCertificateDisplayDate(detailModalCert.expiryDate)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center py-1 border-b border-amber-100">
                          <span className="text-neutral-500 uppercase text-[11px]">EXPIRATION:</span>
                          <span className="font-bold text-neutral-800">SEUMUR HIDUP</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-1 border-b border-amber-100">
                        <span className="text-neutral-500 uppercase text-[11px]">CATEGORY:</span>
                        <span className="font-bold text-amber-900">{detailModalCert.category}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-neutral-500 uppercase text-[11px]">STATUS:</span>
                        {detailModalCert.expiryDate && parseCertificateDate(detailModalCert.expiryDate) > 0 && parseCertificateDate(detailModalCert.expiryDate) < Date.now() ? (
                          <span className="font-bold text-rose-700">KEDALUWARSA (EXPIRED)</span>
                        ) : (
                          <span className="font-bold text-emerald-700">VALID & OFFICIALLY VERIFIED</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {detailModalCert.verificationUrl && (
                    <a
                      href={sanitizeUrl(detailModalCert.verificationUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-mono text-xs uppercase font-bold rounded shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Verifikasi Kredensial Resmi</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Pop-up Footer Bar */}
            <div className="p-3.5 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between font-mono text-xs">
              <span className="text-neutral-500">DOSSIER FILE ID: {detailModalCert.id.toUpperCase()}</span>
              <button
                onClick={() => setDetailModalCert(null)}
                className="px-4 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded font-bold uppercase transition-colors cursor-pointer"
              >
                TUTUP DOKUMEN (KEMBALI KE BUKU REGISTER)
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Fullscreen Lightbox Inspection Modal (Zoom Mode) */}
      {mounted && lightboxData && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxData(null)}
        >
          <div
            className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Top Bar */}
            <div className="w-full flex items-center justify-between text-white pb-3 font-mono text-xs gap-3">
              <span className="font-bold uppercase tracking-wider text-amber-300 truncate max-w-lg">
                INSPEKSI RESOLUSI PENUH // {lightboxData.title}
              </span>
              <button
                onClick={() => setLightboxData(null)}
                className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded border border-neutral-600 flex items-center gap-1.5 cursor-pointer font-bold uppercase transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
                <span>Tutup (Esc)</span>
              </button>
            </div>

            {/* Lightbox Full Size Image Frame */}
            <div className="relative max-h-[82vh] w-full flex items-center justify-center overflow-auto rounded border-2 border-neutral-700 bg-neutral-950 p-2 shadow-2xl">
              <img
                src={lightboxData.url}
                alt={lightboxData.title}
                referrerPolicy="no-referrer"
                className="max-h-[80vh] w-auto max-w-full object-contain rounded shadow-lg"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

