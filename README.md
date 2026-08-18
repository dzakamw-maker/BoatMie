# 📁 BoatMie — Interactive Physical Dossier Web Portfolio

A tactile, archive-inspired personal web portfolio designed with the physical metaphor of classified dossier folders, paper artifacts, binder rings, and fluid physics-based interactions.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?style=flat-square&logo=framer)

---

## ✨ Features & Concept

- **📂 6-Tier Dossier Deck System**: Multi-colored die-cut folder tabs representing key portfolio sections:
  1. `FILE-01` — **About Me**: Identity, engineering background, and core philosophy.
  2. `FILE-02` — **Interests**: Hobbies, outdoor expeditions, coffee hangouts, and gaming.
  3. `FILE-03` — **Skills**: Categorized technical stacks (Languages, Frontend, Backend, DevOps).
  4. `FILE-04` — **Projects**: Curated production systems & live case studies.
  5. `FILE-05` — **Certificates**: Badges, national olympiads (ISQO), and credentials.
  6. `FILE-06` — **Contact**: Secure direct dispatch and professional networks.
- **📑 Tactile Paper Aesthetics**: Die-cut tab geometry, realistic binder ring holes, tape strips, and stamp badges.
- **⚡ Spring Physics Transitions**: Dynamic layout transitions and animations powered by Framer Motion.
- **🗂️ Local Media Directory**: Simplified asset structure under `public/media/` for zero-database overhead.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI & State**: [React 19](https://react.dev/)
- **Animation Engine**: [Framer Motion 12](https://motion.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dzakast/boatmie.git
   cd boatmie
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

---

## 📁 Project Structure

```text
├── public/
│   └── media/            # Profile, projects, certificates & interest images
├── src/
│   ├── app/              # Next.js App Router (layout.tsx, page.tsx, globals.css)
│   ├── components/
│   │   ├── common/       # Visual artifacts (BinderHoles, TapeStrip, StampBadge, etc.)
│   │   ├── dossier/      # Folder deck & case views
│   │   └── sections/     # Section content components (About, Skills, Projects, etc.)
│   ├── data/
│   │   └── dossierData.ts # Centralized portfolio content & configuration
│   └── types/
│       └── dossier.ts    # TypeScript definitions
├── tailwind.config.js    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Developed with ☕ by [Dzaka](https://github.com/dzakast).
