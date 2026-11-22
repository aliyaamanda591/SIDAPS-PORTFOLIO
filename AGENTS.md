# Sidaps Portfolio — panduan kerja AI

## Aturan utama

- Domain publik pengguna: `sidaps.online`. Pertahankan domain, DNS, Authorized Domains Firebase, cookie, dan alamat alias lama sampai ada perubahan migrasi yang memang diminta dan diverifikasi.
- Simpan perubahan website yang sudah selesai ke `https://github.com/aliyaamanda591/SIDAPS-PORTFOLIO`. Ambil perubahan remote sebelum memperbarui; jangan force-push.
- Kerjakan per fase sesuai instruksi pengguna. Setelah satu fase dilaporkan, tunggu "Lanjut". Jangan memulai refactor atau deployment hanya karena sedang membersihkan repositori.
- Jangan menyalin seluruh source lokal lama ke main: source kerja dan main dapat berbeda. Periksa diff, import, dan identitas proyek sebelum sinkronisasi.
- Branch `safety/firebase-wip-2026-11-16` menyimpan pekerjaan Firebase yang belum selesai (commit `4e18ef5`). Branch itu arsip pengaman, bukan implementasi yang sudah digabung ke main atau siap deploy.

## Peta arsitektur — terverifikasi 16 November 2026

Teknologi: TypeScript, Vinext/Vite, route Next.js, Cloudflare Worker + D1. Root aplikasi adalah checkout ini; source lokal lama di workspace bukan salinan main yang identik.

| Fitur | Lokasi awal yang dibaca |
| --- | --- |
| Pemilih landing/login/demo/dashboard | `app/route.ts` |
| Domain utama/redirect 301 | `lib/canonical-url.ts`, `worker/index.ts`; `vite.config.ts` menjalankan Worker sebelum aset |
| SEO publik | `lib/site-seo.ts`, `lib/landing/head.ts`, `app/layout.tsx`, `public/{robots.txt,sitemap.xml}` |
| Landing aktif dan konten SEO | `lib/landing-html.ts` → `lib/landing-wealth-html.ts` (hero/teks publik aktif); jangan mengubah modul hero lama untuk mengganti halaman tayang |
| Artikel pemula | `lib/content/portfolio-guide.ts` (isi/meta), `lib/blog-html.ts`, `app/blog/cara-mencatat-portofolio-investasi/route.ts`, `public/blog.css`; tanpa akses akun |
| Route API | `app/api/{auth/[action],state,admin/accounts,prices/[source],market-board}/route.ts` |
| Halaman reset | `app/reset-password/route.ts` |
| Landing | `lib/landing-html.ts` → `lib/landing/{head,hero,market-before,features,tutorial-faq-footer}.ts` |
| Tutorial landing | `public/landing-tutorial.{js,css}` (5 adegan, HP/Monitor), `lib/landing/tutorial-faq-footer.ts`; seluruh transaksi hanya mock DOM |
| Smartphone hero / warna penutup | `lib/landing/hero.ts`, `public/landing-phones.css`, `public/landing-phones/`; model asli ditampilkan lewat dua kontur SVG; contoh dashboard selalu terbuka, logo lokal di `public/demo-icons/` |
| Login | `lib/login-html.ts` → `lib/login/{head,backdrop,auth-card,auth-script}.ts` |
| Perangkai dashboard | `lib/portfolio-html.ts`; urutan concatenation/scope script wajib dipertahankan |
| Struktur dashboard/form/akun | `lib/portfolio/views/{shell-dashboard,transactions-assets,developer-footer}.ts` |
| Tampilan dasar/responsive | `lib/portfolio/{styles-base,styles-components,styles-responsive,head-links}.ts` |
| State, transaksi, rumus, backup | `lib/portfolio/scripts/{core-state,trades-profile,render-overview}.ts`; validasi server `lib/{state-validation.ts,financial-validation.js}` |
| Render aset/harga | `lib/portfolio/scripts/render-prices.ts` |
| Katalog browser | `lib/portfolio/scripts/{catalog-stocks,catalog-crypto,platform-catalog}.ts`; cari ticker dahulu |
| Auth browser | `lib/portfolio/scripts/hosted-auth.ts`, `lib/{email-auth-client,google-auth-client}.js` |
| Auth server | `lib/email-auth.ts` → `lib/auth/{account-handlers,reset-handlers,session-helpers}.ts` |
| Firebase/identitas | `lib/{firebase-auth,firebase-google,google-account-link,identity}.ts` |
| Data privat/revisi | `lib/{database,account-store}.ts`, `db/schema.ts`, `drizzle/` |
| Pasar/IHSG/emas | `lib/{market-board,retail-gold,market-catalog}.ts`; route harga di atas |
| Grafik/tema/navigasi/HP | `public/{portfolio-insights.js,dashboard-ihsg.*,theme.*,account-menu.*,mobile-*}` |
| Panduan/demo | `lib/portfolio/usage-guide.ts`, `lib/demo-portfolio.ts`, `public/{usage-demo,landing-tutorial,landing-cinema,landing-demo-data}.js` |
| Reset UI | `public/recovery-otp.js` (nama historis; sekarang tautan reset), `lib/auth/reset-handlers.ts` |
| Hosting/build | `worker/`, `vite.config.ts`, `.openai/hosting.json`, `scripts/{vite,connector-preview}/` |
| Tes | `scripts/tests/run-offline.mjs` (28 tes); `helpers/templates.mjs` membaca HTML hasil modul langsung |

Peta lengkap: `docs/development/SOURCE-MAP.md`. Jangan memindai seluruh repo jika lokasi fitur sudah tercantum.

## Keamanan dan kompatibilitas

- Jangan unggah `.env`, `.dev.vars`, service-account/private key, database, token, atau backup portofolio pribadi. `.env.example` hanya berisi contoh aman.
- Firebase Web Config publik berada di `lib/firebase-web-config.json` pada main. Jangan menggantinya dengan config dari branch pengaman tanpa meninjau keseluruhan alur autentikasinya.
- Jangan mengganti proyek Firebase, ID database D1, `.openai/hosting.json`, atau `OWNER_EMAIL` demi pembersihan. Web Config bukan service-account credential.
- Setiap akun hanya boleh membaca/menulis portofolionya sendiri. UI admin/developer hanya mengelola metadata dan bantuan, bukan catatan keuangan orang lain.
- Pertahankan akun, holdings, revisi, format backup JSON, kunci storage lama, logo, dan nama migrasi yang sudah diterapkan. Jangan mengubah kata `denny_` atau nama hosting lama secara massal.
- Jangan mengklaim provider/domain terhubung atau email terkirim sebelum konfigurasi/hasil sebenarnya diperiksa.

## Hemat konteks — jangan dibaca massal

- Mulai dengan `rg --files` dan `rg -n` pada fitur terkait; baca bagian kecil, bukan semua file.
- Abaikan secara default: `node_modules/`, `.git/`, `dist/`, `.next/`, `.vinext/`, `.wrangler/`, `.sites-runtime/`, `outputs/`, `coverage/`, cache, dan arsip.
- Jangan memuat seluruh `public/logos/`, `public/shell-assets/`, `public/logos/sources.json`, font, SVG, PNG, atau katalog hanya untuk memperbaiki tampilan.
- Baca katalog hanya jika tugas membutuhkan: `lib/market-catalog.ts`, `public/market-catalog.json`, `lib/portfolio/scripts/catalog-*.ts`, `lib/portfolio/scripts/platform-catalog.ts`, `public/brand-logos.js`. Cari kode aset/platform yang relevan dahulu.
- `package-lock.json` wajib dipertahankan, tetapi jangan dibaca rutin. Baca hanya bagian yang dibutuhkan saat dependensi berubah.
- File besar belum tentu sampah. Jangan menghapus aset/data yang diminta pengguna atau menulis ulang modul lain di luar lingkup tugas.

## Verifikasi

- Dari root checkout: `npm test` (28 regresi offline), `npm run verify:project` (aset/sintaks/config), `node node_modules/typescript/bin/tsc --noEmit --incremental false`, `npm run build`.
- Tes Node memerlukan `registerHooks` (Node >=22.15; diverifikasi pada 26.7). Runner memasang `helpers/register.mjs` untuk import TypeScript/JSON. Tidak ada monkey-patch pembacaan file.
- Stub `cloudflare:workers` hanya dalam tes offline dan melempar bila env produksi diakses. Gunakan transport Firebase/email palsu dan database SQLite memori; jangan jalankan skrip registrasi HTTP ke produksi.
- Sembilan skrip integrasi HTTP/katalog tambahan bukan bagian dari 25 tes offline; jalankan hanya dengan environment lokal yang sesuai. Jangan mengklaim login Google nyata sudah diuji oleh suite offline.
- Nama recovery/OTP lama tetap dipertahankan untuk kompatibilitas, bukan instruksi mengaktifkan OTP kustom.
- Pemeriksaan Fase 4 semula menemukan domain belum diizinkan. Pemeriksaan publik ulang saat migrasi domain/SEO mengonfirmasi `sidaps.online` sudah tercantum di Authorized Domains Firebase. Pengaturan itu tidak diubah oleh patch SEO; OAuth akun nyata belum diuji. Laporan historis: `docs/development/PHASE4-VERIFICATION.md`; keadaan migrasi terbaru: `docs/development/DOMAIN-SEO.md`.
- Pertahankan route, field data, migrasi dan identitas hosting. Cabang pengaman Firebase tetap terpisah dari main.
- Migrasi domain diminta pengguna: semua host `*.workers.dev` yang mencapai Worker diarahkan 301 ke `https://sidaps.online`, path/query dipertahankan; localhost tidak dialihkan. Jangan memakai Host/X-Forwarded-Host dari header sebagai tujuan redirect.
- Sitemap hanya berisi halaman publik canonical yang benar-benar ada; login/demo/reset/data akun bukan halaman SEO. `lib/site-seo.ts` adalah sumber title, description dan JSON-LD; jangan membuat rating/ulasan palsu.
