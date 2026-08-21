'use client';

import React, { useState, useEffect } from 'react';
import { CONTACT_DATA } from '@/data/dossierData';
import { submitMessage, fetchContact } from '@/lib/firestore';
import { ContactInfo } from '@/types/dossier';
import { StampBadge } from '../common/StampBadge';
import { StickyNote } from '../common/StickyNote';
import { Mail, Github, Linkedin, Instagram, Send, CheckCircle2, MapPin, Terminal, AlertCircle, ArrowUpRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [contact, setContact] = useState<ContactInfo>(CONTACT_DATA);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    category: 'Project Collaboration',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [honeypot, setHoneypot] = useState<string>('');

  useEffect(() => {
    fetchContact().then((data) => {
      if (data && data.email) {
        setContact(data);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check: If invisible field is filled, silently block bot
    if (honeypot) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 500);
      return;
    }

    if (!formState.name || !formState.email || !formState.message) {
      setError('Harap isi semua kolom transmisi sebelum mengirim.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await submitMessage(formState);
      if (res.success) {
        setIsSubmitted(true);
      } else {
        setError(res.error || 'Gagal mengirim transmisi ke server.');
      }
    } catch {
      setError('Terjadi kesalahan koneksi jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 text-neutral-900">
      {/* Dossier Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-neutral-300 pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest text-neutral-800 bg-neutral-200 px-2 py-0.5 rounded">
            DOSSIER #06
          </span>
          <span className="text-neutral-500">SUBJECT: DIRECT MEMO & COLLABORATION DISPATCH</span>
        </div>
        <div className="flex items-center gap-2">
          <StampBadge text="ENCRYPTED DISPATCH" variant="black" rotate={2} />
        </div>
      </div>

      {/* Intro Header */}
      <div className="space-y-2">
        <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide text-neutral-950 leading-tight">
          KIRIM PESAN & TRANSMISI
        </h1>
        <p className="font-serif text-base sm:text-lg text-neutral-700 max-w-3xl leading-relaxed">
          Saluran komunikasi langsung untuk diskusi rekayasa web, peluang kolaborasi teknis, pemesanan host/MC panggung, atau konsultasi ide.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Links & Coordinates (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coordinates Box */}
          <div className="p-6 bg-neutral-900 text-white rounded shadow-md border border-neutral-800 space-y-4 font-mono">
            <div className="flex items-center gap-2 text-neutral-400 border-b border-neutral-800 pb-3 text-xs">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>COORDINATES & COMMS HUB</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-neutral-300">{contact.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-neutral-300 hover:text-white underline underline-offset-2"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-emerald-400 border-t border-neutral-800">
              STATUS: {contact.availability}
            </div>
          </div>

          {/* Social Channels List */}
          <div className="space-y-2 font-mono text-xs">
            <a
              href={contact.github || 'https://github.com/dzakamw-maker'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-white rounded border border-neutral-200 hover:border-neutral-900 transition-colors shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <Github className="w-4 h-4 text-neutral-900" />
                <span className="font-bold uppercase tracking-wider">GitHub Repository</span>
              </div>
              <span className="text-neutral-400 group-hover:text-neutral-900 inline-flex items-center gap-1">
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </a>

            <a
              href={contact.linkedin || 'https://www.linkedin.com/in/dzaka/'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-white rounded border border-neutral-200 hover:border-blue-600 transition-colors shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span className="font-bold uppercase tracking-wider">LinkedIn Professional</span>
              </div>
              <span className="text-neutral-400 group-hover:text-blue-600 inline-flex items-center gap-1">
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </a>

            <a
              href={contact.instagram || 'https://www.instagram.com/dzakaharja/'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-white rounded border border-neutral-200 hover:border-pink-600 transition-colors shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span className="font-bold uppercase tracking-wider">Instagram Stage & Life</span>
              </div>
              <span className="text-neutral-400 group-hover:text-pink-600 inline-flex items-center gap-1">
                <span>Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>

          <StickyNote title="QUICK MEMO" color="green" rotate={-1}>
            {contact.quickMemo ||
              '"Inquiries regarding high-speed web applications, web development orders, or technology discussions will be received and responded to within 24 hours."'}
          </StickyNote>
        </div>

        {/* Right Column: Interactive Direct Transmission Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded shadow-md border border-neutral-200">
          <div className="border-b border-neutral-200 pb-4 mb-6">
            <h3 className="font-sans text-xl font-black uppercase text-neutral-900">
              FORMULIR MEMO LANGSUNG
            </h3>
            <p className="font-serif text-xs text-neutral-500">
              Formulir terstruktur siap sinkronisasi Firebase Firestore
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 bg-emerald-50 border-2 border-emerald-500 rounded text-center space-y-3 font-mono">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-sans text-xl font-black uppercase text-emerald-950">
                TRANSMISI BERHASIL DICATAT
              </h4>
              <p className="font-serif text-sm text-emerald-800 max-w-md mx-auto">
                Terima kasih, <strong>{formState.name}</strong>. Pesan Anda telah diarsipkan ke dalam log komunikasi. Konfirmasi akan segera dikirim ke <em>{formState.email}</em>.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormState({ name: '', email: '', category: 'Project Collaboration', message: '' });
                }}
                className="mt-4 px-4 py-2 bg-emerald-700 text-white text-xs uppercase font-bold rounded hover:bg-emerald-800 transition-colors"
              >
                Kirim Memo Baru
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              {/* Invisible Honeypot field for bot protection */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block font-bold text-neutral-700 uppercase">
                    Nama / Instansi *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. John Doe / Studio X"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded focus:border-neutral-900 focus:bg-white outline-hidden transition-all text-neutral-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block font-bold text-neutral-700 uppercase">
                    Alamat Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="name@organization.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded focus:border-neutral-900 focus:bg-white outline-hidden transition-all text-neutral-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="category" className="block font-bold text-neutral-700 uppercase">
                  Kategori Perihal
                </label>
                <select
                  id="category"
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded focus:border-neutral-900 focus:bg-white outline-hidden transition-all text-neutral-900"
                >
                  <option value="Project Collaboration">Web App Development / Project Collaboration</option>
                  <option value="Festival MC / Event Booking">Live MC / Festival Stage Booking</option>
                  <option value="Fullstack Role / Internship">Fullstack Engineering Inquiry</option>
                  <option value="General Conversation">General Question & Greetings</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="block font-bold text-neutral-700 uppercase">
                  Isi Memo / Detail Pesan *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Tuliskan pesan, brief kebutuhan, atau rincian kolaborasi..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded focus:border-neutral-900 focus:bg-white outline-hidden transition-all text-neutral-900 font-sans text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-neutral-950 text-white font-mono uppercase font-bold text-xs tracking-wider rounded shadow-md hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>MENGIRIM TRANSMISI...</span>
                  </>
                ) : (
                  <>
                    <span>DISPATCH MEMO SEKARANG</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
