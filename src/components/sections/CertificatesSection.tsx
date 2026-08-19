'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CERTIFICATES_DATA } from '@/data/dossierData';
import { fetchCertificates } from '@/lib/firestore';
import { CertificateItem } from '@/types/dossier';
import { StampBadge } from '../common/StampBadge';
import { TapeStrip } from '../common/TapeStrip';
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
  Sparkles,
} from 'lucide-react';

export const CertificatesSection: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>(CERTIFICATES_DATA);
  const [selectedCertId, setSelectedCertId] = useState<string>(CERTIFICATES_DATA[0].id);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalCategoryFilter, setModalCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchCertificates().then((data) => {
      if (data && data.length > 0) {
        setCertificates(data);
      }
    });
  }, []);

  const selectedCert =
    certificates.find((c) => c.id === selectedCertId) || certificates[0] || CERTIFICATES_DATA[0];

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLedgerModalOpen(false);
      }
    };
    if (isLedgerModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isLedgerModalOpen]);

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

  const handleSelectFromModal = (certId: string) => {
    setSelectedCertId(certId);
    setIsLedgerModalOpen(false);
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
          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-800 hover:bg-amber-900 text-white font-mono text-xs font-bold uppercase rounded shadow-md hover:shadow-lg transition-all shrink-0 active:scale-95 border border-amber-900"
        >
          <Scroll className="w-4 h-4 text-amber-300" />
          <span>LIHAT SEMUA SERTIFIKAT ({certificates.length})</span>
        </button>
      </div>

      {/* Grid of Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => {
          const isSelected = cert.id === selectedCertId;
          return (
            <button
              key={cert.id}
              onClick={() => setSelectedCertId(cert.id)}
              className={`p-5 rounded-md text-left transition-all border relative flex flex-col justify-between min-h-[160px] ${
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
                  <span className="text-neutral-500 font-bold">{cert.issueDate}</span>
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

      {/* Selected Certificate Scanned Document Display */}
      <div className="relative bg-[#fffdfa] p-6 sm:p-10 rounded shadow-xl border-4 border-double border-amber-800/30 space-y-6">
        {/* Scanned watermarks & tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <TapeStrip rotate={0} width="w-32" />
        </div>

        <div className="text-center space-y-2 border-b-2 border-amber-900/20 pb-6 pt-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-800 mb-1 border border-amber-300">
            <Award className="w-6 h-6" />
          </div>
          <div className="font-mono text-xs tracking-widest text-amber-800 font-bold uppercase">
            CERTIFICATE OF OFFICIAL ATTAINMENT
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide leading-snug text-neutral-950 max-w-3xl mx-auto">
            {selectedCert.title}
          </h2>
          <p className="font-serif text-sm sm:text-base text-neutral-600">
            Conferred by <span className="font-semibold text-neutral-900">{selectedCert.issuer}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-700">
              ACCREDITATION STATEMENT
            </h4>
            <p className="font-serif text-base sm:text-lg text-neutral-800 leading-relaxed">
              {selectedCert.description}
            </p>

            <div className="pt-2">
              <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                VERIFIED SKILLSETS & COMPETENCY
              </h5>
              <div className="flex flex-wrap gap-2">
                {selectedCert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-xs px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-amber-50/50 rounded border border-amber-200 text-center space-y-3">
            {selectedCert.imageUrl && (
              <div className="w-full aspect-[4/3] rounded border border-amber-300/80 overflow-hidden bg-white shadow-xs mb-1">
                <img
                  src={selectedCert.imageUrl}
                  alt={selectedCert.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <StampBadge text="OFFICIAL SEAL // VERIFIED" variant="amber" rotate={-4} />
            <div className="font-mono text-[11px] text-neutral-600 space-y-1">
              <div>REGISTRY: {selectedCert.credentialId}</div>
              <div>YEAR: {selectedCert.issueDate}</div>
              <div>STATUS: VALID & ACTIVE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Accreditation Ledger Vault Modal (Ide 2) */}
      {isLedgerModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/80 backdrop-blur-xs animate-fadeIn"
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
                className="p-1.5 text-amber-300 hover:text-white hover:bg-amber-800 rounded transition-colors"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 font-mono text-xs"
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
                      className={`px-3 py-1 rounded font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors border ${
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

            {/* Modal Body: Grid of All Registered Certificates */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modalFilteredCertificates.map((cert) => {
                    const isSelected = cert.id === selectedCertId;
                    return (
                      <div
                        key={cert.id}
                        className={`p-4 rounded border bg-white flex flex-col justify-between transition-all hover:shadow-md ${
                          isSelected
                            ? 'ring-2 ring-amber-600 border-amber-500 bg-amber-50/40'
                            : 'border-neutral-200 hover:border-amber-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between font-mono text-[10px] text-amber-900 mb-2">
                            <span className="px-2 py-0.5 bg-amber-100 rounded font-bold uppercase">
                              {cert.category}
                            </span>
                            <span className="text-neutral-500 font-bold">{cert.issueDate}</span>
                          </div>

                          <h4 className="font-sans text-lg uppercase tracking-wide text-neutral-950 mb-1 leading-tight">
                            {cert.title}
                          </h4>
                          <p className="font-serif text-xs text-neutral-600 mb-3">
                            Issuer: <span className="font-medium text-neutral-900">{cert.issuer}</span>
                          </p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {cert.skills.map((skill) => (
                              <span
                                key={skill}
                                className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-neutral-500">
                            REF: {cert.credentialId}
                          </span>
                          <button
                            onClick={() => handleSelectFromModal(cert.id)}
                            className={`px-3 py-1.5 rounded font-mono text-xs font-bold uppercase transition-colors inline-flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-amber-800 text-white'
                                : 'bg-neutral-900 hover:bg-amber-800 text-white'
                            }`}
                          >
                            <span>{isSelected ? 'SEDANG DIBUKA' : 'BUKA DOKUMEN'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
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
              <span className="text-neutral-500">TEKAN ESC ATAU KLIK DI LUAR UNTUK MENUTUP</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

