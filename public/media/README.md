# Local Media & Photos Directory

Semua file gambar/foto dan media portofolio disimpan secara lokal di dalam folder `public/media/` ini (bukan di database):

## Struktur Folder:

```
public/
  └── media/
      ├── profile/
      │   └── avatar.jpg          (Foto profil Dossier #01 About Me)
      │
      ├── projects/
      │   ├── acrepar.png         (Screenshot proyek Acrepar)
      │   ├── code-chronicle.png  (Screenshot proyek CodeChronicle)
      │   ├── warung-ai.png       (Screenshot proyek Warung AI)
      │   └── boatmie.png         (Screenshot proyek BoatMie)
      │
      ├── certificates/
      │   ├── isqo.jpg            (Scan dokumen sertifikat ISQO)
      │   ├── ai-prompt.jpg       (Scan dokumen sertifikat AI)
      │   ├── fullstack.jpg       (Scan sertifikat Fullstack)
      │   └── cloud.jpg           (Scan sertifikat Cloud)
      │
      └── interests/
          ├── festival-mc.jpg     (Foto event/festival MC)
          ├── media-gear.jpg      (Foto gear/kamera)
          ├── formula-one.jpg     (Foto F1 telemetry/mobil)
          └── west-java-trail.jpg (Foto alam/kuliner Jabar)
```

## Cara Penggunaan:
1. Masukkan file foto/gambar Anda ke folder yang sesuai di atas.
2. Path foto diatur di berkas `src/data/dossierData.ts` dengan awalan `/media/...`.
   - Contoh: `avatarUrl: '/media/profile/avatar.jpg'`
   - Contoh: `imageUrl: '/media/projects/acrepar.png'`
3. Next.js akan langsung menyajikan gambar tersebut secara otomatis tanpa perlu koneksi database.
