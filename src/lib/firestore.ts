import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  ProjectItem,
  CertificateItem,
  SkillCategory,
  InterestItem,
  ContactMessage,
  ContactInfo,
  AboutData,
} from '@/types/dossier';

import {
  ABOUT_DATA,
  CONTACT_DATA,
  INTERESTS_DATA,
  SKILL_CATEGORIES,
  PROJECTS_DATA,
  CERTIFICATES_DATA,
} from '@/data/dossierData';

// ==========================================
// 1. FILE-01: ABOUT ME (Table: `about`)
// ==========================================
export async function fetchAbout(): Promise<AboutData> {
  try {
    const docRef = doc(db, 'about', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const d = docSnap.data();
      return {
        name: d.name || ABOUT_DATA.name,
        alias: d.alias || ABOUT_DATA.alias,
        avatarUrl: normalizeImageUrl(d.avatarUrl || d.avatar_url || ABOUT_DATA.avatarUrl),
        avatarPosX: typeof d.avatarPosX === 'number' ? d.avatarPosX : (typeof d.avatar_pos_x === 'number' ? d.avatar_pos_x : (ABOUT_DATA.avatarPosX ?? 50)),
        avatarPosY: typeof d.avatarPosY === 'number' ? d.avatarPosY : (typeof d.avatar_pos_y === 'number' ? d.avatar_pos_y : (ABOUT_DATA.avatarPosY ?? 50)),
        avatarScale: typeof d.avatarScale === 'number' ? d.avatarScale : (typeof d.avatar_scale === 'number' ? d.avatar_scale : (ABOUT_DATA.avatarScale ?? 100)),
        role: d.role || ABOUT_DATA.role,
        status: d.status || ABOUT_DATA.status,
        location: d.location || ABOUT_DATA.location,
        classification: d.classification || ABOUT_DATA.classification,
        caseSummary: d.caseSummary || d.case_summary || ABOUT_DATA.caseSummary,
        stats: d.stats || ABOUT_DATA.stats,
        bioParagraphs: d.bioParagraphs || d.bio_paragraphs || ABOUT_DATA.bioParagraphs,
        fieldDirective: d.fieldDirective || d.field_directive,
      };
    }
  } catch (err) {
    console.warn('Firestore fetch about fallback to static data:', err);
  }
  return ABOUT_DATA;
}

export async function saveAbout(data: Partial<AboutData>): Promise<{ success: boolean; error?: string }> {
  try {
    await setDoc(doc(db, 'about', 'main'), {
      ...data,
      updated_at: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menyimpan data About.';
    console.error('Error saving about:', err);
    return { success: false, error: msg };
  }
}

// ==========================================
// 2. FILE-02: INTERESTS (Table: `interests`)
// ==========================================
export async function fetchInterests(): Promise<InterestItem[]> {
  try {
    const q = query(collection(db, 'interests'), orderBy('sort_order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          title: d.title || '',
          tagline: d.tagline || '',
          badge: d.badge || '',
          imageUrl: normalizeImageUrl(d.imageUrl || d.image_url || ''),
          imagePosX: typeof d.imagePosX === 'number' ? d.imagePosX : (typeof d.image_pos_x === 'number' ? d.image_pos_x : 50),
          imagePosY: typeof d.imagePosY === 'number' ? d.imagePosY : (typeof d.image_pos_y === 'number' ? d.image_pos_y : 50),
          imageScale: typeof d.imageScale === 'number' ? d.imageScale : (typeof d.image_scale === 'number' ? d.image_scale : 100),
          content: d.content || '',
          details: d.details || [],
          fieldNotes: d.fieldNotes || d.field_notes || [],
          sort_order: d.sort_order ?? 0,
        } as InterestItem;
      });
    }
  } catch (err) {
    console.warn('Firestore fetch interests fallback to static data:', err);
  }
  return INTERESTS_DATA;
}

export async function saveInterest(item: InterestItem): Promise<{ success: boolean; error?: string }> {
  try {
    const id = item.id || item.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    await setDoc(doc(db, 'interests', id), {
      ...item,
      id,
      updated_at: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menyimpan catatan minat.';
    console.error('Error saving interest:', err);
    return { success: false, error: msg };
  }
}

export async function deleteInterest(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, 'interests', id));
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus catatan minat.';
    console.error('Error deleting interest:', err);
    return { success: false, error: msg };
  }
}

// ==========================================
// 3. FILE-03: SKILLS (Table: `skills`)
// ==========================================
export async function fetchSkills(): Promise<SkillCategory[]> {
  try {
    const q = query(collection(db, 'skills'), orderBy('sort_order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => docSnap.data() as SkillCategory);
    }
  } catch (err) {
    console.warn('Firestore fetch skills fallback to static data:', err);
  }
  return SKILL_CATEGORIES;
}

export const fetchSkillCategories = fetchSkills;

export async function saveSkillCategory(cat: SkillCategory): Promise<{ success: boolean; error?: string }> {
  try {
    const docId = cat.code.toLowerCase().replace(/[^a-z0-9]/g, '-');
    await setDoc(doc(db, 'skills', docId), {
      ...cat,
      updated_at: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menyimpan kategori skill.';
    console.error('Error saving skill category:', err);
    return { success: false, error: msg };
  }
}

export async function deleteSkillCategory(code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const docId = code.toLowerCase().replace(/[^a-z0-9]/g, '-');
    await deleteDoc(doc(db, 'skills', docId));
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus kategori skill.';
    console.error('Error deleting skill category:', err);
    return { success: false, error: msg };
  }
}

// ==========================================
// 4. FILE-04: PROJECTS (Table: `projects`)
// ==========================================
export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const q = query(collection(db, 'projects'), orderBy('sort_order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          title: d.title || '',
          subtitle: d.subtitle || '',
          category: d.category || '',
          description: d.description || '',
          caseStudy: d.caseStudy || d.case_study || '',
          techStack: d.techStack || d.tech_stack || [],
          repoUrl: d.repoUrl || d.repo_url || d.repo_link || '',
          liveUrl: d.liveUrl || d.live_url || d.live_link || '',
          imageUrl: normalizeImageUrl(d.imageUrl || d.image_url || ''),
          imagePosX: typeof d.imagePosX === 'number' ? d.imagePosX : (typeof d.image_pos_x === 'number' ? d.image_pos_x : 50),
          imagePosY: typeof d.imagePosY === 'number' ? d.imagePosY : (typeof d.image_pos_y === 'number' ? d.image_pos_y : 50),
          imageScale: typeof d.imageScale === 'number' ? d.imageScale : (typeof d.image_scale === 'number' ? d.image_scale : 100),
          featured: d.featured ?? false,
          date: d.date || '',
          metrics: d.metrics || [],
          status: d.status || 'Deployed',
          sort_order: d.sort_order ?? 0,
        } as ProjectItem;
      });
    }
  } catch (err) {
    console.warn('Firestore fetch projects fallback to static data:', err);
  }
  return PROJECTS_DATA;
}

export async function saveProject(project: ProjectItem): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const id = project.id || doc(collection(db, 'projects')).id;
    await setDoc(doc(db, 'projects', id), {
      ...project,
      id,
      updated_at: serverTimestamp(),
    }, { merge: true });
    return { success: true, id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menyimpan proyek.';
    console.error('Error saving project:', err);
    return { success: false, error: msg };
  }
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, 'projects', id));
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus proyek.';
    console.error('Error deleting project:', err);
    return { success: false, error: msg };
  }
}

// ==========================================
// 5. FILE-05: CERTIFICATES (Table: `certificates`)
// ==========================================
export function parseCertificateDate(dateStr?: string): number {
  if (!dateStr) return 0;
  const raw = dateStr.trim();
  if (!raw) return 0;

  const parsed = Date.parse(raw);
  if (!isNaN(parsed)) {
    return parsed;
  }

  const indonesianMonths: Record<string, string> = {
    januari: 'Jan', jan: 'Jan',
    februari: 'Feb', feb: 'Feb',
    maret: 'Mar', mar: 'Mar',
    april: 'Apr', apr: 'Apr',
    mei: 'May',
    juni: 'Jun', jun: 'Jun',
    juli: 'Jul', jul: 'Jul',
    agustus: 'Aug', agu: 'Aug', ags: 'Aug',
    september: 'Sep', sep: 'Sep',
    oktober: 'Oct', okt: 'Oct',
    november: 'Nov', nov: 'Nov',
    desember: 'Dec', des: 'Dec',
  };

  let normalized = raw;
  for (const [idm, enm] of Object.entries(indonesianMonths)) {
    normalized = normalized.replace(new RegExp(`\\b${idm}\\b`, 'gi'), enm);
  }

  const idParsed = Date.parse(normalized);
  if (!isNaN(idParsed)) {
    return idParsed;
  }

  const years = raw.match(/\b(19\d\d|20\d\d)\b/g);
  if (years && years.length > 0) {
    const maxYear = Math.max(...years.map(Number));
    return new Date(maxYear, 0, 1).getTime();
  }

  return 0;
}

export function formatDateForInput(dateStr?: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{4}$/.test(trimmed)) {
    return `${trimmed}-01-01`;
  }
  const ts = parseCertificateDate(trimmed);
  if (ts > 0) {
    const d = new Date(ts);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return '';
}

export function formatCertificateDisplayDate(dateStr?: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (/^\d{4}$/.test(trimmed) || /^\d{4}[–-]\d{4}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  }
  return trimmed;
}

export function normalizeImageUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Google Drive file view links e.g. drive.google.com/file/d/FILE_ID/view...
  const gDriveFileMatch = trimmed.match(/(?:drive|docs)\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (gDriveFileMatch && gDriveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveFileMatch[1]}`;
  }

  // Google Drive query links e.g. drive.google.com/open?id=FILE_ID or drive.google.com/uc?id=FILE_ID
  const gDriveQueryMatch = trimmed.match(/(?:drive|docs)\.google\.com\/(?:open|uc|thumbnail)\?(?:[^&]*&)*id=([a-zA-Z0-9_-]+)/i);
  if (gDriveQueryMatch && gDriveQueryMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveQueryMatch[1]}`;
  }

  // Google usercontent links e.g. lh3.googleusercontent.com/d/FILE_ID
  const lh3Match = trimmed.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/i);
  if (lh3Match && lh3Match[1]) {
    return `https://lh3.googleusercontent.com/d/${lh3Match[1]}`;
  }

  // Dropbox links (convert ?dl=0 to ?raw=1)
  if (trimmed.includes('dropbox.com')) {
    return trimmed.replace(/\?dl=0/i, '?raw=1').replace(/&dl=0/i, '&raw=1');
  }

  return trimmed;
}

export function sortCertificatesByDate(certs: CertificateItem[]): CertificateItem[] {
  return [...certs].sort((a, b) => {
    const timeA = parseCertificateDate(a.issueDate);
    const timeB = parseCertificateDate(b.issueDate);
    if (timeB !== timeA) {
      return timeB - timeA;
    }
    return (a.title || '').localeCompare(b.title || '');
  });
}

export async function fetchCertificates(): Promise<CertificateItem[]> {
  try {
    const q = query(collection(db, 'certificates'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const items = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          title: d.title || '',
          issuer: d.issuer || '',
          issueDate: d.issueDate || d.issue_date || '',
          credentialId: d.credentialId || d.credential_id || '',
          category: d.category || 'Kompetensi',
          description: d.description || '',
          skills: d.skills || [],
          verificationUrl: d.verificationUrl || d.verification_url || '',
          imageUrl: normalizeImageUrl(d.imageUrl || d.image_url || ''),
          imagePosX: typeof d.imagePosX === 'number' ? d.imagePosX : (typeof d.image_pos_x === 'number' ? d.image_pos_x : 50),
          imagePosY: typeof d.imagePosY === 'number' ? d.imagePosY : (typeof d.image_pos_y === 'number' ? d.image_pos_y : 50),
          imageScale: typeof d.imageScale === 'number' ? d.imageScale : (typeof d.image_scale === 'number' ? d.image_scale : 100),
          sort_order: d.sort_order ?? 0,
        } as CertificateItem;
      });
      return sortCertificatesByDate(items);
    }
  } catch (err) {
    console.warn('Firestore fetch certificates fallback to static data:', err);
  }
  return sortCertificatesByDate(CERTIFICATES_DATA);
}

export async function saveCertificate(cert: CertificateItem): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const id = cert.id || doc(collection(db, 'certificates')).id;
    await setDoc(doc(db, 'certificates', id), {
      ...cert,
      id,
      updated_at: serverTimestamp(),
    }, { merge: true });
    return { success: true, id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menyimpan sertifikat.';
    console.error('Error saving certificate:', err);
    return { success: false, error: msg };
  }
}

export async function deleteCertificate(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, 'certificates', id));
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus sertifikat.';
    console.error('Error deleting certificate:', err);
    return { success: false, error: msg };
  }
}

// ==========================================
// 6. FILE-06: CONTACT (Table: `contact` & `messages`)
// ==========================================
export async function fetchContact(): Promise<ContactInfo> {
  try {
    const docRef = doc(db, 'contact', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const d = docSnap.data();
      return {
        email: d.email || CONTACT_DATA.email,
        github: d.github || CONTACT_DATA.github,
        linkedin: d.linkedin || CONTACT_DATA.linkedin,
        instagram: d.instagram || CONTACT_DATA.instagram,
        location: d.location || CONTACT_DATA.location,
        availability: d.availability || CONTACT_DATA.availability,
        quickMemo: d.quickMemo || d.quick_memo || CONTACT_DATA.quickMemo,
      };
    }
  } catch (err) {
    console.warn('Firestore fetch contact fallback to static data:', err);
  }
  return CONTACT_DATA;
}

export async function saveContact(data: Partial<ContactInfo>): Promise<{ success: boolean; error?: string }> {
  try {
    await setDoc(doc(db, 'contact', 'main'), {
      ...data,
      updated_at: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menyimpan info kontak.';
    console.error('Error saving contact:', err);
    return { success: false, error: msg };
  }
}

// Combined Profile Helper (for Admin Panel compatibility)
export async function fetchProfile(): Promise<any> {
  try {
    const [aboutData, contactData] = await Promise.all([
      fetchAbout(),
      fetchContact(),
    ]);
    return {
      ...aboutData,
      contact: contactData,
    };
  } catch (err) {
    console.warn('Firestore fetch profile error:', err);
  }
  return { ...ABOUT_DATA, contact: CONTACT_DATA };
}

export async function saveProfile(data: any): Promise<{ success: boolean; error?: string }> {
  try {
    const aboutPromise = setDoc(doc(db, 'about', 'main'), {
      name: data.name || ABOUT_DATA.name,
      alias: data.alias || ABOUT_DATA.alias,
      avatarUrl: data.avatarUrl || data.avatar_url || ABOUT_DATA.avatarUrl,
      role: data.role || ABOUT_DATA.role,
      status: data.status || ABOUT_DATA.status,
      location: data.location || ABOUT_DATA.location,
      classification: data.classification || ABOUT_DATA.classification,
      caseSummary: data.caseSummary || data.case_summary || ABOUT_DATA.caseSummary,
      bioParagraphs: data.bioParagraphs || data.bio_paragraphs || ABOUT_DATA.bioParagraphs,
      stats: data.stats || ABOUT_DATA.stats,
      fieldDirective: data.fieldDirective || data.field_directive,
      updated_at: serverTimestamp(),
    }, { merge: true });

    const contactPromise = setDoc(doc(db, 'contact', 'main'), {
      email: data.contact?.email || data.email || CONTACT_DATA.email,
      github: data.contact?.github || data.github || CONTACT_DATA.github,
      linkedin: data.contact?.linkedin || data.linkedin || CONTACT_DATA.linkedin,
      instagram: data.contact?.instagram || data.instagram || CONTACT_DATA.instagram,
      location: data.contact?.location || data.location || CONTACT_DATA.location,
      availability: data.contact?.availability || data.availability || CONTACT_DATA.availability,
      quickMemo: data.contact?.quickMemo || data.quickMemo || CONTACT_DATA.quickMemo,
      updated_at: serverTimestamp(),
    }, { merge: true });

    await Promise.all([aboutPromise, contactPromise]);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menyimpan profil.';
    console.error('Error saving profile:', err);
    return { success: false, error: msg };
  }
}

// Contact Form Message Submission
export interface ContactSubmission {
  name: string;
  email: string;
  category: string;
  message: string;
}

export async function submitMessage(data: ContactSubmission): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...data,
      is_read: false,
      created_at: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Gagal mengirim pesan.';
    console.error('Error submitting message to Firestore:', err);
    return { success: false, error: errorMsg };
  }
}

export async function fetchMessagesAdmin(): Promise<ContactMessage[]> {
  try {
    const q = query(collection(db, 'messages'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        let formattedDate = 'Baru saja';
        if (data.created_at?.toDate) {
          formattedDate = data.created_at.toDate().toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
          });
        }
        return {
          id: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          category: data.category || 'General',
          message: data.message || '',
          is_read: !!data.is_read,
          created_at: formattedDate,
        } as ContactMessage;
      });
    }
  } catch (err) {
    console.warn('Firestore fetch messages error:', err);
  }
  return [];
}

export async function markMessageRead(id: string, is_read = true): Promise<{ success: boolean; error?: string }> {
  try {
    await setDoc(doc(db, 'messages', id), { is_read }, { merge: true });
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal mengubah status pesan.';
    return { success: false, error: msg };
  }
}

export async function deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, 'messages', id));
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus pesan.';
    return { success: false, error: msg };
  }
}

// ==========================================
// 🚀 ALL-IN-ONE DATABASE SEEDER (6 TABLES)
// ==========================================
export async function seedInitialData(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. FILE-01: Table `about`
    await setDoc(doc(db, 'about', 'main'), {
      ...ABOUT_DATA,
      updated_at: serverTimestamp(),
    });

    // 2. FILE-02: Table `interests`
    for (let i = 0; i < INTERESTS_DATA.length; i++) {
      const item = INTERESTS_DATA[i];
      await setDoc(doc(db, 'interests', item.id), {
        ...item,
        sort_order: i + 1,
        updated_at: serverTimestamp(),
      });
    }

    // 3. FILE-03: Table `skills`
    for (let i = 0; i < SKILL_CATEGORIES.length; i++) {
      const cat = SKILL_CATEGORIES[i];
      const docId = cat.code.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await setDoc(doc(db, 'skills', docId), {
        ...cat,
        sort_order: i + 1,
        updated_at: serverTimestamp(),
      });
    }

    // 4. FILE-04: Table `projects`
    for (let i = 0; i < PROJECTS_DATA.length; i++) {
      const proj = PROJECTS_DATA[i];
      await setDoc(doc(db, 'projects', proj.id), {
        ...proj,
        sort_order: i + 1,
        updated_at: serverTimestamp(),
      });
    }

    // 5. FILE-05: Table `certificates`
    for (let i = 0; i < CERTIFICATES_DATA.length; i++) {
      const cert = CERTIFICATES_DATA[i];
      await setDoc(doc(db, 'certificates', cert.id), {
        ...cert,
        sort_order: i + 1,
        updated_at: serverTimestamp(),
      });
    }

    // 6. FILE-06: Table `contact`
    await setDoc(doc(db, 'contact', 'main'), {
      ...CONTACT_DATA,
      updated_at: serverTimestamp(),
    });

    return { success: true, message: 'Semua 6 tabel berhasil di-seed ke Firestore!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Error seeding data to Firestore:', err);
    return { success: false, message: `Gagal seeding data: ${msg}` };
  }
}
