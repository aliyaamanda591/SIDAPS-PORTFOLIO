# Peta source

Peta modul terverifikasi 16 November 2026. Panduan awal yang lebih ringkas ada di `AGENTS.md`; mulai dari sana tanpa memindai katalog/aset.

## Modul hasil pemecahan

| Perangkai | Modul yang dirangkai |
| --- | --- |
| `lib/landing-html.ts` | `lib/landing/{head,hero,market-before,features,tutorial-faq-footer}.ts` dan `lib/market-board-html.js` |
| `lib/login-html.ts` | `lib/login/{head,backdrop,auth-card,auth-script}.ts` |
| `lib/portfolio-html.ts` | `lib/portfolio/styles-*.ts`, `head-links.ts`, `views/`, `scripts/`, `usage-guide.ts` |
| `lib/email-auth.ts` | `lib/auth/{account-handlers,reset-handlers,session-helpers}.ts` |

Dashboard: `views/{shell-dashboard,transactions-assets,developer-footer}.ts` mengatur struktur halaman. `scripts/core-state.ts` menyimpan state; `trades-profile.ts` menangani transaksi/profil; `render-overview.ts` dan `render-prices.ts` merender ringkasan/aset. Cari fungsi terkait di file itu dahulu. Katalog terpisah di `scripts/{catalog-stocks,catalog-crypto,platform-catalog}.ts`; jangan dibaca massal.

Login server Firebase berada di `lib/firebase-auth.ts`, identitas Google di `lib/firebase-google.ts`; config publik di `lib/firebase-web-config.json`. UI pemulihan: `app/reset-password/route.ts`, `lib/auth/reset-handlers.ts`, `public/recovery-otp.js`. Nama OTP historis dipertahankan walaupun UI kini menggunakan tautan email.

`lib/email-auth-client.js` dan `lib/google-auth-client.js` memiliki bagian script yang juga ada di shell; cocokkan keduanya bila mengubah auth. Jangan memindahkan scope script atau mengubah urutan perangkai sembarangan.

## Perintah verifikasi

- `npm test`: 25 regresi offline, jaringan dimatikan; Firebase/email memakai transport sintetis dan D1 memakai SQLite memori.
- `npm run verify:project`: referensi aset, sintaks inline/public JS, identitas config Firebase.
- `node node_modules/typescript/bin/tsc --noEmit --incremental false`
- `npm run build`

Loader tes memerlukan Node >=22.15 (`registerHooks`), diverifikasi pada 26.7. `scripts/tests/helpers/templates.mjs` mengimpor HTML hasil perangkai secara langsung; tidak mem-parsing source sebagai JSON atau menambal pembacaan file. Sembilan skrip tambahan di luar suite offline memerlukan fixture/layanan HTTP khusus; jangan diarahkan ke produksi. Laporan batasan operasional: `PHASE4-VERIFICATION.md`.

## Tampilan

| Bagian | File utama |
| --- | --- |
| Landing page | `lib/landing-html.ts`, `public/landing.css`, `public/landing.js` |
| Login | `lib/login-html.ts`, `lib/simple-login.css`, `lib/google-auth-client.js` |
| Aplikasi utama | `lib/portfolio-html.ts` |
| Tema dan responsive | `public/theme.*`, `public/responsive-system.css`, `public/phone-readability.css` |
| Navigasi akun | `public/account-menu.*` |
| Ringkasan dan grafik | `public/dashboard-clean.*`, `public/portfolio-insights.js`, `public/dashboard-ihsg.*` |
| Daftar HP | `public/mobile-asset-list.*`, `public/mobile-records.*`, `public/mobile-tables.*` |
| Kontrol formulir dan tabel | `public/controls-polish.*` |
| Foto profil | `public/profile-photos.css`, `lib/portfolio/scripts/trades-profile.ts` |

Shell aplikasi menggunakan HTML yang disimpan sebagai string. Berkas CSS/JavaScript publik melengkapi shell tersebut; urutan pemuatannya penting. Jangan menggabungkan atau menghapus lapisan tema tanpa memeriksa hasil di HP dan desktop.

## Data dan layanan

- `app/api/auth/`, `lib/email-auth.ts`, `lib/identity.ts`: sesi dan akun.
- `lib/firebase-google.ts`, `lib/google-account-link.ts`, `lib/profile-photo.js`: identitas Google dan metadata foto.
- `app/api/state/`, `lib/account-store.ts`, `lib/state-validation.ts`: portofolio per akun dan pemeriksaan revisi.
- `app/api/admin/accounts/`: metadata akun dan dukungan; bukan akses ke transaksi pengguna lain.
- `app/api/prices/`, `lib/retail-gold.ts`: sumber harga.
- `app/api/market-board/`, `lib/market-board.ts`: harga publik dan IHSG.
- `drizzle/`: urutan migrasi yang sudah digunakan; jangan mengganti nama migrasi lama.

## Infrastruktur

`vite.config.ts`, `worker/`, `.openai/hosting.json`, `scripts/vite/`, dan `scripts/connector-preview/` merupakan bagian runtime/build. `vendor/` masih menyimpan stylesheet dan lisensi yang dirujuk `app/globals.css`. Komponen UI, hook sidebar, dan contoh D1 bawaan template yang tidak dipakai aplikasi dihapus pada Fase 2.

`scripts/tests/` berisi pengujian. `scripts/dev/` dan `scripts/fixtures/` khusus simulasi lokal. Semua perintah skrip dijalankan dari root repositori.
