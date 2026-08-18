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
  featured?: boolean;
  date: string;
  metrics?: { label: string; value: string }[];
  status: 'Deployed' | 'Active Development' | 'Archived';
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  category: 'Competition' | 'AI & ML' | 'Fullstack' | 'IT Fundamentals';
  description: string;
  skills: string[];
  verificationUrl?: string;
  imageUrl?: string;
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
}


