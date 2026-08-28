export type FolderId = 'about' | 'interests' | 'skills' | 'projects' | 'certificates' | 'contact';

export interface FolderConfig {
  id: FolderId;
  label: string;
  category: string;
  categoryDesc: string;
  folderColor: string;
  folderDarkColor: string;
  textColor: string;
  badgeBg: string;
  indexNumber: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  caseStudy: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  imagePosX?: number;
  imagePosY?: number;
  imageScale?: number;
  featured?: boolean;
  date: string;
  metrics?: { label: string; value: string }[];
  status: 'Deployed' | 'Active Development' | 'Archived';
}

export type CertificateCategory =
  | 'Kompetensi'
  | 'Pelatihan'
  | 'Bahasa'
  | 'Organisasi'
  | 'Magang'
  | 'Kejuaraan'
  | 'Lainnya'
  | (string & {});

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  category: CertificateCategory;
  description: string;
  skills: string[];
  verificationUrl?: string;
  imageUrl?: string;
  imagePosX?: number;
  imagePosY?: number;
  imageScale?: number;
}

export interface SkillCategory {
  title: string;
  code: string;
  description: string;
  skills: {
    name: string;
    level: string; // e.g. "Core", "Advanced", "Proficient"
    tags: string[];
  }[];
}

export interface InterestItem {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  content: string;
  details: string[];
  fieldNotes: string[];
  imageUrl?: string;
  imagePosX?: number;
  imagePosY?: number;
  imageScale?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  is_read?: boolean;
  created_at?: any;
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
  location: string;
  availability: string;
  quickMemo?: string;
}

export interface AboutData {
  name: string;
  alias: string;
  avatarUrl: string;
  avatarPosX?: number;
  avatarPosY?: number;
  avatarScale?: number;
  role: string;
  status: string;
  location: string;
  classification: string;
  caseSummary: string;
  stats: { label: string; value: string }[];
  bioParagraphs: string[];
  fieldDirective?: string;
}


