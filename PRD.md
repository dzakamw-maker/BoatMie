# 📄 Product Requirements Document (PRD): BoatMie

## 1. Ikhtisar Proyek
**BoatMie** adalah sebuah situs web portofolio pribadi interaktif dengan antarmuka bergaya *dossier* (map arsip). Pengguna akan menavigasi situs melalui tab folder fisik maya yang tumpang tindih, memberikan pengalaman visual yang taktil, klasik, namun tetap mengandalkan performa web modern.

## 2. Tech Stack & Arsitektur
*   **Frontend:** Next.js (App Router), React, Tailwind CSS (untuk *styling utility-first*).
*   **Animasi & Interaksi:** Framer Motion (untuk transisi antar folder, efek *hover* pada tab, dan kemunculan konten).
*   **Backend:** Next.js Server Actions / API Routes (untuk penanganan form dan pengambilan data dengan aman).
*   **Database:** Firebase Cloud Firestore (sebagai penyimpanan data dinamis).
*   **Deployment:** Vercel.

## 3. Arsitektur Informasi & Fitur Halaman (Routing)
Sistem navigasi menggunakan tab folder yang persisten (selalu terlihat di atas atau samping halaman). Urutan tab dari paling depan ke belakang:

1.  **About Me (Folder Biru):** 
    *   Halaman pendaratan (*landing page*). 
    *   Berisi pengenalan singkat: Dzaka, mahasiswa PPLG/IT, dan fokus sebagai pengembang ekosistem web *full-stack*.
2.  **Interests (Folder Merah):** 
    *   "Catatan Lapangan". 
    *   Menampilkan sisi personal: Nongkrong & Late Night Coffee Sessions, Ekspedisi Alam & Roadtrips Jawa Barat, Mobile Legends & Tactical MOBA gaming, serta Renang & Hydro Recovery.
3.  **Skills (Folder Hijau):** 
    *   Menyerupai cetak biru (*blueprint*) teknis. 
    *   Memuat daftar penguasaan teknologi (Frontend, Backend, Cloud/AI, Deployment).
4.  **Projects (Folder Ungu):** 
    *   Galeri karya (Acrepar, CodeChronicle, Warung AI, dll).
    *   Data diambil secara dinamis dari Firebase agar mudah diperbarui.
5.  **Certificates (Folder Kuning):** 
    *   Menampilkan pencapaian (misal: ISQO, program AI) dengan tata letak visual ala dokumen resmi yang dipindai.
6.  **Contact (Folder Hitam):** 
    *   Menyediakan tautan profesional (LinkedIn, GitHub, Email).
    *   Formulir kontak langsung yang terhubung ke integrasi *backend* (Firebase).

## 4. Spesifikasi Desain & Interaksi (Framer Motion)
*   **Layouting:** Menggunakan *CSS Grid* atau *Flexbox* dari Tailwind untuk memastikan proporsi tumpukan folder tetap konsisten dan responsif di berbagai ukuran perangkat.
*   **Animasi Tab:**
    *   `whileHover`: Tab folder memberikan respons visual (sedikit terangkat atau pergeseran warna) saat kursor mendekat.
    *   `initial` & `animate`: Transisi `spring` saat tab diklik, memindahkan folder aktif ke lapisan terdepan (`z-index` tertinggi) agar terasa natural dan membal layaknya map fisik.
    *   `exit`: Efek memudar (*fade out*) atau *slide-down* pada konten di dalam folder saat pengguna berpindah halaman.
*   **Tipografi:** Judul tab menggunakan font *sans-serif* tebal untuk keterbacaan, dipadukan dengan font *serif* atau *monospace* (ala mesin tik) untuk isi teks demi mempertahankan estetika arsip.

## 5. Struktur Data (Firebase Firestore)
Rekomendasi skema database untuk konten yang membutuhkan pembaruan dinamis tanpa pengubahan kode sumber:

*   **Collection `projects`:**
    *   `title` (string)
    *   `description` (string)
    *   `tech_stack` (array of strings)
    *   `image_url` (string)
    *   `repo_link` / `live_link` (string)
*   **Collection `messages` (Dari Contact Form):**
    *   `name` (string)
    *   `email` (string)
    *   `message` (string)
    *   `created_at` (timestamp)