'use client';

import React, { useState } from 'react';
import { CERTIFICATES_DATA } from '@/data/dossierData';
import { StampBadge } from '../common/StampBadge';
import { TapeStrip } from '../common/TapeStrip';
import { Award, ShieldCheck, CheckCircle, FileCheck, Bookmark } from 'lucide-react';

export const CertificatesSection: React.FC = () => {
  const [selectedCertId, setSelectedCertId] = useState<string>(CERTIFICATES_DATA[0].id);
  const selectedCert = CERTIFICATES_DATA.find((c) => c.id === selectedCertId) || CERTIFICATES_DATA[0];

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

      {/* Intro Header */}
      <div className="space-y-2">
        <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide text-neutral-950 leading-tight">
          SERTIFIKAT & PENCAPAIAN
        </h1>
        <p className="font-serif text-base sm:text-lg text-neutral-700 max-w-3xl leading-relaxed">
          Dokumentasi sertifikasi resmi, olimpiade sains kompetitif (ISQO), penguasaan rekayasa AI, serta verifikasi kompetensi standar kejuruan perangkat lunak.
        </p>
      </div>

      {/* Grid of Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CERTIFICATES_DATA.map((cert) => {
          const isSelected = cert.id === selectedCertId;
          return (
            <button
              key={cert.id}
              onClick={() => setSelectedCertId(cert.id)}
              className={`p-5 rounded-md text-left transition-all border relative flex flex-col justify-between ${
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
    </div>
  );
};
