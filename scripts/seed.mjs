import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. FILE-01: ABOUT ME
const ABOUT_DATA = {
  name: 'Dzaka',
  alias: 'BoatMie Architect',
  avatarUrl: '/media/profile/avatar.png',
  role: 'Full-stack Web Ecosystem Developer & PPLG/IT Student',
  status: 'Ready for High-Impact Collaborations',
  location: 'West Java, Indonesia (UTC+7)',
  classification: 'UNRESTRICTED / PUBLIC DOSSIER',
  caseSummary:
    'Dzaka is an aspiring software engineer specializing in modern web ecosystem architecture, reactive user interfaces, and robust cloud services. Driven by a deep appreciation for tactile digital design, high-performance web standards, and developer experience.',
  fieldDirective:
    '"A clean, responsive interface is not an afterthought — it is the foundation of user trust. Build minimal, build durable, make it tactile."',
  stats: [
    { label: 'Core Focus', value: 'Full-Stack Web & Applied AI' },
    { label: 'Academic Path', value: 'PPLG / Software Engineering' },
    { label: 'Architecture', value: 'Next.js, Node.js, Cloud Services' },
    { label: 'Philosophy', value: 'Form Follows Function & Tactile Simplicity' },
  ],
  bioParagraphs: [
    'Building for the web should feel like crafting a physical instrument — precise, responsive, and grounded in purposeful mechanics. As a software engineering (PPLG) student, my approach marries clean foundational code with dynamic, memorable user experiences.',
    'Beyond conventional frontend layers, my focus spans resilient backend pipelines, pragmatic cloud integration (Vercel, Firebase, Google Cloud), and harnessing AI tooling as a force multiplier for human workflows.',
    'When I’m not coding, you’ll find me hunting cozy coffee spots with friends, exploring highland trails across West Java, grinding ranks on Mobile Legends, or doing rhythmic laps in the pool to stay sharp and refreshed.',
  ],
};

// 2. FILE-02: INTERESTS
const INTERESTS_DATA = [
  {
    id: 'nongkrong',
    title: 'Hangouts & Coffee Sessions',
    tagline: 'Good Coffee, Late-Night Brainstorms & Unfiltered Banter',
    badge: 'SOCIAL & VIBES',
    imageUrl: '/media/interests/nongkrong.jpg',
    content:
      'Nothing beats the laid-back vibe of catching up with a friend on a quiet afternoon. Finding a peaceful spot somewhere in West Java, away from the busy crowds, creates the perfect space for an uninterrupted conversation. Whether we are casually talking about life or diving into our usual discussions about tech and music, its the ultimate reset button where genuine connections and fresh ideas just flow naturally.',
    details: [
      'Coffee shop hunting: Scouting cozy spots with great iced americanos and lo-fi tunes',
      'Deep chats & tech banter: Exchanging crazy startup ideas, gaming strategies, and life stories',
      'Mental decompression: Stepping away from the IDE to recharge social batteries and stay grounded',
    ],
    fieldNotes: [
      'FIELD LOG: "The most creative breakthroughs rarely happen staring at a screen — they happen over a cup of iced coffee with good company."',
      'FAVORITE VIBES: Warm ambient lighting, open terrace air, cold brews, and acoustic playlists.',
    ],
  },
  {
    id: 'ekspedisi',
    title: 'Outdoor Expeditions & Roadtrips',
    tagline: 'Wandering Through Misty Ridges, High Elevations & Hidden Trails',
    badge: 'EXPEDITION LOG',
    imageUrl: '/media/interests/ekspedisi.jpg',
    content:
      'Hitting the open asphalt and chasing the highland breeze across West Java’s winding mountain roads. Whether riding through the tea hills of Pangalengan, exploring pine forests, or camping under clear starry skies, spontaneous outdoor adventures keep life exciting and give a fresh perspective beyond the desk.',
    details: [
      'Scenic roadtrips: Navigating misty highland mountain passes and winding coastal roads',
      'Campfire & stargazing: Cooking instant noodles at 1,500m elevation with crisp mountain air',
      'Off-the-beaten-path: Discovering quiet waterfalls and local roadside eateries along the way',
    ],
    fieldNotes: [
      'FIELD LOG: "Heading out into the wild is the fastest way to declutter your mind. Fresh altitude, zero notifications."',
      'GEAR ON DECK: Windbreaker, trail shoes, compact camera, thermos of hot coffee, and a full tank of fuel.',
    ],
  },
  {
    id: 'mobile-legends',
    title: 'Mobile Legends & Tactical MOBA',
    tagline: 'Rank Grinds, Split Pushes & High-Stakes Macro Play',
    badge: 'TACTICAL GAMING',
    imageUrl: '/media/interests/mobile-legends.jpg',
    content:
      'When it’s game time, it’s all about high-intensity teamwork and split-second decisions on the Land of Dawn. Grinding mythic ranks with the squad, executing clutch teamfights, tracking enemy cooldowns, and timing objective steals. It is fast-paced, competitive, and sharpens strategic instincts under pressure.',
    details: [
      'Macro map awareness: Controlling vision, jungle rotations, and predicting enemy ganks',
      'Clutch teamfight execution: Coordinating crowd control chains and peel-and-dive combos',
      'Squad synergy: Communicating fast on voice chat to turn losing games into epic comebacks',
    ],
    fieldNotes: [
      'FIELD LOG: "MOBA macro is just distributed systems in disguise: split-second latency, role synchronization, and defending the base at all costs."',
      'PREFERRED ROLES: Midlane burst & Roam initiator — setting up the plays and dictating the tempo.',
    ],
  },
  {
    id: 'renang',
    title: 'Swimming & Hydro Recovery',
    tagline: 'Rhythmic Laps, Full-Body Endurance & Quiet Mental Clarity',
    badge: 'HYDRO RECOVERY',
    imageUrl: '/media/interests/renang.jpg',
    content:
      'Gliding through cool water is the most therapeutic physical workout. Focusing on steady breathing, smooth strokes, and rhythmic laps washes away all mental fatigue. It builds stamina, fixes posture after long hours at the keyboard, and puts the body into a meditative flow state.',
    details: [
      'Freestyle & breaststroke drills: Maintaining continuous glide efficiency and steady pacing',
      'Full-body recovery: Low-impact resistance training that relieves spine and joint tension',
      'Mindful disconnection: Complete sensory calm underwater where the only sound is your breath',
    ],
    fieldNotes: [
      'FIELD LOG: "Water resets everything. 30 minutes in the pool does more for mental clarity than three extra cups of espresso."',
      'SESSION GOAL: 1,000m endurance sets followed by floating and deep breathing.',
    ],
  },
];

// 3. FILE-03: SKILLS
const SKILL_CATEGORIES = [
  {
    title: 'Core Languages & Scripting',
    code: 'MOD-LANG-01',
    description: 'Foundational programming languages, strong typing systems, markup standards, and shell scripting.',
    skills: [
      { name: 'TypeScript', level: 'Advanced', tags: ['Strict Typing', 'Generics', 'Interfaces', 'ESNext'] },
      { name: 'JavaScript', level: 'Advanced', tags: ['ES6+', 'Async/Await', 'DOM APIs', 'Event Loop'] },
      { name: 'HTML5', level: 'Advanced', tags: ['Semantic Markup', 'Web Standards', 'Accessibility', 'Forms'] },
      { name: 'CSS3', level: 'Advanced', tags: ['Flexbox', 'CSS Grid', 'Custom Properties', 'Animations'] },
      { name: 'PHP', level: 'Proficient', tags: ['OOP', 'Modern PHP 8+', 'Server-Side Logic', 'REST APIs'] },
      { name: 'Python', level: 'Proficient', tags: ['Scripting', 'Automation', 'Data Processing', 'Backend'] },
      { name: 'Kotlin', level: 'Working Knowledge', tags: ['Android Development', 'Modern JVM', 'Coroutines'] },
      { name: 'Bash Script', level: 'Proficient', tags: ['Shell Pipelines', 'Linux CLI', 'Script Automation'] },
      { name: 'PowerShell', level: 'Proficient', tags: ['Windows Scripting', 'CLI Automation', 'Admin Tasks'] },
      { name: 'Markdown', level: 'Advanced', tags: ['Technical Writing', 'Documentation', 'README Standards'] },
      { name: 'LaTeX', level: 'Advanced', tags: ['Scientific Typesetting', 'Formulas', 'Document Formatting'] },
    ],
  },
  {
    title: 'Frontend & Mobile Ecosystem',
    code: 'MOD-FE-02',
    description: 'Component-driven reactive user interfaces, meta-frameworks, styling engines, and mobile architectures.',
    skills: [
      { name: 'React', level: 'Advanced', tags: ['Hooks', 'Virtual DOM', 'Context API', 'Component Architecture'] },
      { name: 'Next.js', level: 'Advanced', tags: ['App Router', 'Server Actions', 'SSR / RSC', 'Static Export'] },
      { name: 'Vue.js', level: 'Proficient', tags: ['Composition API', 'Single-File Components', 'Reactivity'] },
      { name: 'Astro', level: 'Proficient', tags: ['Islands Architecture', 'Content-Driven SSG', 'Zero JS Default'] },
      { name: 'React Native', level: 'Proficient', tags: ['Cross-Platform Mobile', 'Mobile UI Components', 'Native APIs'] },
      { name: 'Tailwind CSS', level: 'Advanced', tags: ['Utility-First', 'Design Tokens', 'Fluid Layouts', 'Custom Themes'] },
      { name: 'Vite', level: 'Advanced', tags: ['Lightning Fast HMR', 'ESM Bundler', 'Build Optimization', 'Dev Server'] },
    ],
  },
  {
    title: 'Backend, Database & Auth',
    code: 'MOD-BE-03',
    description: 'Server runtimes, web frameworks, cloud & relational databases, and stateless auth protocols.',
    skills: [
      { name: 'Node.js', level: 'Proficient', tags: ['V8 Engine Runtime', 'REST APIs', 'Express', 'Async I/O'] },
      { name: 'Bun', level: 'Proficient', tags: ['High-Performance JS/TS Runtime', 'Native Bundler', 'Package Execution'] },
      { name: 'Laravel', level: 'Proficient', tags: ['PHP MVC Framework', 'Eloquent ORM', 'Artisan CLI', 'Blade'] },
      { name: 'Firebase', level: 'Proficient', tags: ['Firestore NoSQL', 'Realtime DB', 'Firebase Auth', 'Cloud Storage'] },
      { name: 'MySQL', level: 'Proficient', tags: ['Relational Database', 'SQL Queries', 'Indexing', 'Schema Design'] },
      { name: 'Apache', level: 'Proficient', tags: ['Web Server Config', 'Virtual Hosts', 'Rewrite Rules', '.htaccess'] },
      { name: 'JWT', level: 'Advanced', tags: ['JSON Web Tokens', 'Stateless Auth', 'Bearer Headers', 'Token Security'] },
    ],
  },
  {
    title: 'DevOps, Tooling & Networking',
    code: 'MOD-DEV-04',
    description: 'Deployment infrastructure, package managers, network protocols, and developer toolchains.',
    skills: [
      { name: 'Vercel', level: 'Advanced', tags: ['Serverless Edge Deployment', 'CI/CD Automation', 'Edge Functions'] },
      { name: 'NPM', level: 'Advanced', tags: ['Package Registry', 'Dependency Management', 'Scripts'] },
      { name: 'PNPM', level: 'Advanced', tags: ['Disk Space Efficient', 'Hard Links', 'Fast Monorepo Installs'] },
      { name: 'Yarn', level: 'Advanced', tags: ['Deterministic Lockfiles', 'Workspaces', 'Dependency Resolution'] },
      { name: 'Gradle', level: 'Working Knowledge', tags: ['Android Build Tooling', 'Task Automation', 'JVM Builds'] },
      { name: 'Cisco', level: 'Working Knowledge', tags: ['Routing & Switching', 'Network Protocols', 'IP Subnetting'] },
      { name: 'Windows Terminal', level: 'Advanced', tags: ['Multi-Shell Tabs', 'WSL2 Profiles', 'Terminal Customization'] },
      { name: 'Prettier', level: 'Advanced', tags: ['Automated Code Formatting', 'AST Formatting Rules', 'Style Enforcement'] },
      { name: 'Notion', level: 'Advanced', tags: ['Engineering Documentation', 'Project Kanban', 'Knowledge Base'] },
    ],
  },
];

// 4. FILE-04: PROJECTS
const PROJECTS_DATA = [
  {
    id: 'acrepar',
    title: 'Acrepar',
    subtitle: 'Smart Asset & Resource Management System',
    category: 'Full-Stack Web App',
    description:
      'A comprehensive asset tracking and operational resource management platform designed for rapid cataloging, lifecycle tracking, and inventory audits.',
    caseStudy:
      'Built to eliminate manual spreadsheet inefficiencies in tracking institutional equipment. Features real-time state synchronization, automated condition grading, audit trail logging, and interactive QR/barcode verification.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Firebase Firestore', 'Lucide Icons'],
    repoUrl: 'https://github.com/dzakast/acrepar',
    liveUrl: 'https://acrepar.vercel.app',
    imageUrl: '/media/projects/acrepar.jpg',
    featured: true,
    date: '2025–2026',
    metrics: [
      { label: 'Audit Speed', value: '4x Faster' },
      { label: 'Record Accuracy', value: '99.8%' },
    ],
    status: 'Deployed',
  },
  {
    id: 'code-chronicle',
    title: 'CodeChronicle',
    subtitle: 'Developer Micro-Journaling & Snippet Ecosystem',
    category: 'Web Application & Dev Tool',
    description:
      'A streamlined knowledge base and engineering log for developers to capture technical breakthroughs, debugging steps, and reusable code patterns.',
    caseStudy:
      'Engineered with markdown parsing, syntax highlighting, tagged indexing, and instant fuzzy search. Designed with a distraction-free keyboard-first interface to maximize developer documentation speed.',
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Vercel'],
    repoUrl: 'https://github.com/dzakast/code-chronicle',
    liveUrl: 'https://codechronicle.vercel.app',
    imageUrl: '/media/projects/code-chronicle.png',
    featured: true,
    date: '2025',
    metrics: [
      { label: 'Search Latency', value: '< 25ms' },
      { label: 'Snippet Storage', value: 'Instant Sync' },
    ],
    status: 'Deployed',
  },
  {
    id: 'warung-ai',
    title: 'Warung AI',
    subtitle: 'Localized SME Inventory & Predictive Assistant',
    category: 'Applied AI & Business Tool',
    description:
      'An accessible AI-powered operational assistant helping micro-retailers in Indonesia forecast restock demands and generate instant promo messaging.',
    caseStudy:
      'Integrates large language model reasoning via the Gemini API with structured local inventory datasets. Offers voice and text prompt interfaces tailored to everyday Indonesian retail vocabulary.',
    techStack: ['Next.js', 'TypeScript', 'Google Gemini API', 'Tailwind CSS', 'Cloud Functions'],
    repoUrl: 'https://github.com/dzakast/warung-ai',
    liveUrl: 'https://warung-ai.vercel.app',
    imageUrl: '/media/projects/warung-ai.png',
    featured: true,
    date: '2025–2026',
    metrics: [
      { label: 'Forecast Help', value: 'Daily Auto-Picks' },
      { label: 'Language', value: 'ID Conversational' },
    ],
    status: 'Active Development',
  },
  {
    id: 'boatmie-dossier',
    title: 'BoatMie Archive',
    subtitle: 'Interactive Physical Dossier Web Portfolio',
    category: 'Tactile Web Experience',
    description:
      'This tactile, archive-inspired portfolio system featuring overlapping die-cut folder tabs, paper document aesthetics, and spring physics navigation.',
    caseStudy:
      'Crafted with custom Framer Motion physics, die-cut clip-path folder geometry, binder hole artifacts, and structured Firebase Firestore data modeling readiness.',
    techStack: ['Next.js 15', 'React 19', 'Framer Motion', 'Tailwind CSS', 'TypeScript'],
    repoUrl: 'https://github.com/dzakast/boatmie',
    liveUrl: '#',
    imageUrl: '/media/projects/boatmie.png',
    featured: true,
    date: '2026',
    metrics: [
      { label: 'Theme Style', value: 'Physical Dossier' },
      { label: 'Interaction', value: '6-Tier Folder Deck' },
    ],
    status: 'Deployed',
  },
];

// 5. FILE-05: CERTIFICATES
const CERTIFICATES_DATA = [
  {
    id: 'isqo-olympiad',
    title: 'ISQO (Indonesian Science & Quality Olympiad)',
    issuer: 'Indonesian Science & Olympiad Committee',
    issueDate: '2024',
    credentialId: 'ISQO-REG-8829-ID',
    category: 'Competition',
    imageUrl: '/media/certificates/isqo.jpg',
    description:
      'Prestigious national academic olympiad recognizing excellence in analytical problem solving, logical deduction, and scientific reasoning.',
    skills: ['Analytical Thinking', 'Complex Problem Solving', 'Mathematics & Logic'],
  },
  {
    id: 'ai-prompt-mastery',
    title: 'AI Engineering & Prompt Architecture Certification',
    issuer: 'Google & Developer Ecosystem Program',
    issueDate: '2025',
    credentialId: 'GDEV-AI-9941-CERT',
    category: 'AI & ML',
    imageUrl: '/media/certificates/ai-prompt.jpg',
    description:
      'Mastery of multi-modal generative AI pipelines, structured function calling with Gemini API, and system prompt engineering.',
    skills: ['Gemini API', 'Structured Outputs', 'LLM Workflow Optimization'],
  },
  {
    id: 'fullstack-web-pro',
    title: 'Fullstack Web Application Development Certification',
    issuer: 'National PPLG / Vocational Competency Standards',
    issueDate: '2025',
    credentialId: 'VOC-PPLG-4421-FS',
    category: 'Fullstack',
    imageUrl: '/media/certificates/fullstack.jpg',
    description:
      'Certified competency in end-to-end web engineering: relational databases, secure authentication, reactive SPAs, and production deployment.',
    skills: ['Next.js', 'Node.js', 'REST Architecture', 'Database Security'],
  },
  {
    id: 'cloud-devops-fundamentals',
    title: 'Cloud Computing & Infrastructure Fundamentals',
    issuer: 'Cloud Practitioner Track',
    issueDate: '2025',
    credentialId: 'CLD-INF-3312-VCL',
    category: 'IT Fundamentals',
    imageUrl: '/media/certificates/cloud.jpg',
    description:
      'Comprehensive verification in serverless architecture, CI/CD automated test workflows, domain routing, and web edge performance.',
    skills: ['Vercel Edge', 'GitHub Actions', 'Serverless Functions', 'DNS & SSL'],
  },
];

// 6. FILE-06: CONTACT
const CONTACT_DATA = {
  email: 'dzakamw@gmail.com',
  github: 'https://github.com/dzakamw-maker',
  linkedin: 'https://www.linkedin.com/in/dzaka/',
  instagram: 'https://www.instagram.com/dzakaharja/',
  location: 'West Java, Indonesia',
  availability: 'Available for Web Projects, Fullstack Roles, & Live MC Bookings',
  quickMemo:
    '"Inquiries regarding high-speed web applications, web development orders, or technology discussions will be received and responded to within 24 hours."',
};

async function runSeed() {
  console.log('🚀 Starting 6-Table Firestore Seeder for BoatMie...\n');

  try {
    // 1. FILE-01: Table `about` (Doc: `main`)
    console.log('📂 [1/6] FILE-01: Seeding table `about` (doc: main)...');
    await setDoc(doc(db, 'about', 'main'), {
      ...ABOUT_DATA,
      updated_at: serverTimestamp(),
    });
    console.log('  ✅ Table `about` ready.');

    // 2. FILE-02: Table `interests`
    console.log('📂 [2/6] FILE-02: Seeding table `interests`...');
    for (let i = 0; i < INTERESTS_DATA.length; i++) {
      const item = INTERESTS_DATA[i];
      await setDoc(doc(db, 'interests', item.id), {
        ...item,
        sort_order: i + 1,
        updated_at: serverTimestamp(),
      });
      console.log(`  ✅ Interest: ${item.title}`);
    }

    // 3. FILE-03: Table `skills`
    console.log('📂 [3/6] FILE-03: Seeding table `skills`...');
    for (let i = 0; i < SKILL_CATEGORIES.length; i++) {
      const cat = SKILL_CATEGORIES[i];
      const docId = cat.code.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await setDoc(doc(db, 'skills', docId), {
        ...cat,
        sort_order: i + 1,
        updated_at: serverTimestamp(),
      });
      console.log(`  ✅ Skill Category: ${cat.title}`);
    }

    // 4. FILE-04: Table `projects`
    console.log('📂 [4/6] FILE-04: Seeding table `projects`...');
    for (let i = 0; i < PROJECTS_DATA.length; i++) {
      const proj = PROJECTS_DATA[i];
      await setDoc(doc(db, 'projects', proj.id), {
        ...proj,
        sort_order: i + 1,
        updated_at: serverTimestamp(),
      });
      console.log(`  ✅ Project: ${proj.title}`);
    }

    // 5. FILE-05: Table `certificates`
    console.log('📂 [5/6] FILE-05: Seeding table `certificates`...');
    for (let i = 0; i < CERTIFICATES_DATA.length; i++) {
      const cert = CERTIFICATES_DATA[i];
      await setDoc(doc(db, 'certificates', cert.id), {
        ...cert,
        sort_order: i + 1,
        updated_at: serverTimestamp(),
      });
      console.log(`  ✅ Certificate: ${cert.title}`);
    }

    // 6. FILE-06: Table `contact` (Doc: `main`)
    console.log('📂 [6/6] FILE-06: Seeding table `contact` (doc: main)...');
    await setDoc(doc(db, 'contact', 'main'), {
      ...CONTACT_DATA,
      updated_at: serverTimestamp(),
    });
    console.log('  ✅ Table `contact` ready.');

    console.log('\n🎉 SEMUA 6 TABEL BERHASIL DIBUAT & DISINKRONISASI KE FIRESTORE!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ ERROR SAAT SEEDING DATA:', err);
    process.exit(1);
  }
}

runSeed();
