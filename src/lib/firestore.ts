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
} from '@/types/dossier';

import {
  ABOUT_DATA,
  CONTACT_DATA,
  INTERESTS_DATA,
  SKILL_CATEGORIES,
  PROJECTS_DATA,
  CERTIFICATES_DATA,
} from '@/data/dossierData';

// --- Contact Form Message Submission ---
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

// --- Data Fetchers with Fallbacks ---

export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const q = query(collection(db, 'projects'), orderBy('sort_order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ProjectItem));
    }
  } catch (err) {
    console.warn('Firestore fetch projects fallback to static data:', err);
  }
  return PROJECTS_DATA;
}

export async function fetchCertificates(): Promise<CertificateItem[]> {
  try {
    const q = query(collection(db, 'certificates'), orderBy('sort_order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as CertificateItem));
    }
  } catch (err) {
    console.warn('Firestore fetch certificates fallback to static data:', err);
  }
  return CERTIFICATES_DATA;
}

export async function fetchSkillCategories(): Promise<SkillCategory[]> {
  try {
    const q = query(collection(db, 'skill_categories'), orderBy('sort_order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => docSnap.data() as SkillCategory);
    }
  } catch (err) {
    console.warn('Firestore fetch skills fallback to static data:', err);
  }
  return SKILL_CATEGORIES;
}

export async function fetchInterests(): Promise<InterestItem[]> {
  try {
    const q = query(collection(db, 'interests'), orderBy('sort_order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as InterestItem));
    }
  } catch (err) {
    console.warn('Firestore fetch interests fallback to static data:', err);
  }
  return INTERESTS_DATA;
}

export async function fetchProfile() {
  try {
    const docRef = doc(db, 'profile', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (err) {
    console.warn('Firestore fetch profile fallback to static data:', err);
  }
  return { about: ABOUT_DATA, contact: CONTACT_DATA };
}

// --- One-click Database Seeder ---
export async function seedInitialData(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Seed Profile
    await setDoc(doc(db, 'profile', 'main'), {
      ...ABOUT_DATA,
      contact: CONTACT_DATA,
      updated_at: serverTimestamp(),
    });

    // 2. Seed Projects
    for (let i = 0; i < PROJECTS_DATA.length; i++) {
      const proj = PROJECTS_DATA[i];
      await setDoc(doc(db, 'projects', proj.id), {
        ...proj,
        sort_order: i + 1,
        updated_at: serverTimestamp(),
      });
    }

    // 3. Seed Certificates
    for (let i = 0; i < CERTIFICATES_DATA.length; i++) {
      const cert = CERTIFICATES_DATA[i];
      await setDoc(doc(db, 'certificates', cert.id), {
        ...cert,
        sort_order: i + 1,
        updated_at: serverTimestamp(),
      });
    }

    // 4. Seed Skill Categories
    for (let i = 0; i < SKILL_CATEGORIES.length; i++) {
      const cat = SKILL_CATEGORIES[i];
      const docId = cat.code.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await setDoc(doc(db, 'skill_categories', docId), {
        ...cat,
        sort_order: i + 1,
        updated_at: serverTimestamp(),
      });
    }

    // 5. Seed Interests
    for (let i = 0; i < INTERESTS_DATA.length; i++) {
      const item = INTERESTS_DATA[i];
      await setDoc(doc(db, 'interests', item.id), {
        ...item,
        sort_order: i + 1,
        updated_at: serverTimestamp(),
      });
    }

    return { success: true, message: 'Data initial berhasil di-seed ke Firestore!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Error seeding data to Firestore:', err);
    return { success: false, message: `Gagal seeding data: ${msg}` };
  }
}

// --- Admin CRUD Operations ---

// Projects CRUD
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

// Certificates CRUD
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

// Messages (Contact Inbox) CRUD
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

// Profile CRUD
export async function saveProfile(data: any): Promise<{ success: boolean; error?: string }> {
  try {
    await setDoc(doc(db, 'profile', 'main'), {
      ...data,
      updated_at: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menyimpan profil.';
    console.error('Error saving profile:', err);
    return { success: false, error: msg };
  }
}

// Skill Categories CRUD
export async function saveSkillCategory(cat: SkillCategory): Promise<{ success: boolean; error?: string }> {
  try {
    const docId = cat.code.toLowerCase().replace(/[^a-z0-9]/g, '-');
    await setDoc(doc(db, 'skill_categories', docId), {
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
    await deleteDoc(doc(db, 'skill_categories', docId));
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menghapus kategori skill.';
    console.error('Error deleting skill category:', err);
    return { success: false, error: msg };
  }
}

// Interests CRUD
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

