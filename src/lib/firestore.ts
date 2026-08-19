import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
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
