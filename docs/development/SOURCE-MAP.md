# Peta source

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
| Foto profil | `public/profile-photos.css`, fungsi profil di `lib/portfolio-html.ts` |

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

`vite.config.ts`, `worker/`, `.openai/hosting.json`, `scripts/vite/`, dan `scripts/connector-preview/` merupakan bagian runtime/build. Folder `components/`, `hooks/`, `vendor/`, dan `examples/` menyimpan komponen serta contoh pengembangan. Keberadaannya tidak berarti semua komponen tampil di dashboard.

`scripts/tests/` berisi pengujian. `scripts/dev/` dan `scripts/fixtures/` khusus simulasi lokal. Semua perintah skrip dijalankan dari root repositori.
