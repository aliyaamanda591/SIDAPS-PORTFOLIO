# Pengembangan SIDAPS Portfolio

Jalankan perintah dari folder utama repositori menggunakan Node.js >=22.13.

```sh
npm ci
npm run dev
```

Build produksi dengan `npm run build`. Aplikasi menggunakan Cloudflare Worker dan D1, bukan hosting HTML statis.

- [Runtime, instalasi, build, dan migrasi](docs/development/RUNTIME.md) — dokumentasi teknis lengkap yang dipertahankan dari setup proyek.
- [Peta source dan konfigurasi](docs/development/SOURCE-MAP.md).
- [Pengujian dan fixture lokal](scripts/README.md).
- [Konfigurasi login Google](docs/accounts/FIREBASE-SETUP.md).
- [Hasil pemeriksaan responsive](docs/RESPONSIVE_QA.md).

Source produksi harus tetap memakai binding database dan identitas hosting yang sudah dikonfigurasi. Jangan mengganti ID D1 atau `.openai/hosting.json` ketika merapikan file. Jangan mengunggah `.env`, `.dev.vars`, database, backup pribadi, dependensi, atau hasil build ke Git.

File uji telah dikelompokkan ke `scripts/tests/`. Contoh:

```sh
node scripts/tests/test-portfolio-summary.mjs
node scripts/tests/test-profile-photos.mjs
node scripts/tests/test-google-tokens.mjs
```
