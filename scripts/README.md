# Skrip proyek

Jalankan perintah dari root repositori, bukan dari folder `scripts/`.

| Lokasi | Kegunaan |
| --- | --- |
| `scripts/tests/` | Pemeriksaan fitur dan integrasi |
| `scripts/dev/` | Pembuatan akun/data pratinjau lokal |
| `scripts/fixtures/` | SQL simulasi untuk pengujian |
| `scripts/vite/` | Integrasi build Vite/Sites |
| `scripts/connector-preview/` | Dukungan connector pada pratinjau lokal |
| Skrip lain di folder ini | Instalasi, pemilihan runtime, dan build |

## Pemeriksaan tanpa server

```sh
node scripts/tests/test-portfolio-summary.mjs
node scripts/tests/test-profile-photos.mjs
node scripts/tests/test-google-tokens.mjs
node scripts/tests/test-google-account-link.mjs
node scripts/tests/test-market-board.mjs
node scripts/tests/test-themes.mjs
node scripts/tests/test-fast-login.mjs
node scripts/tests/test-mobile-login.mjs
node scripts/tests/test-landing.mjs
node scripts/tests/test-audit-regressions.mjs
```

## Pemeriksaan integrasi lokal

Skrip HTTP, akun, dan direktori tertentu membutuhkan server pada `http://127.0.0.1:5178` serta fixture/konfigurasi pemilik yang sesuai. Baca skrip sebelum menjalankannya karena beberapa membuat atau mengubah akun simulasi. Jangan mengarahkannya ke produksi.

```sh
npm run dev -- --port 5178
node scripts/tests/test-email-auth.mjs
```

`scripts/dev/create-mobile-preview.mjs` membuat akun simulasi pada alamat lokal tersebut. `scripts/fixtures/directory-fixture.sql` adalah data uji lokal, bukan backup pengguna atau migrasi produksi. Pengujian harga dengan opsi `--live` memerlukan koneksi ke penyedia pasar; pengujian biasa menggunakan fixture terkontrol.

## Batas autentikasi produksi dan regresi data

Login aplikasi memakai sesi server email/Google. Header identitas proxy lama tidak lagi diterima sebagai bukti login, termasuk untuk aktivasi password. Akun dan portofolio yang sudah ada tetap memakai ID tersimpan; Google memverifikasi kepemilikan email. Penautan email yang sebelumnya belum terverifikasi mencabut password/kode pemulihan/sesi lama, tanpa menghapus data portofolio. Password yang sudah terverifikasi tetap dipertahankan.

`test-audit-regressions.mjs` memakai VM dan data sintetis untuk menguji penghapusan pembelian lama, validasi saham, cache harga per akun, impor atomik, backup versi 2, kompatibilitas backup lama, ekspor CSV dan kontras logo. Browser importer dan server memakai fungsi validasi keuangan yang sama dari `lib/financial-validation.js`; tes memeriksa keduanya tetap identik.

`test-production-auth-boundary.mjs` wajib dijalankan pada Worker hasil build dengan database lokal **terpisah**, bukan hanya server pengembangan. Skrip ini menolak host selain loopback dan membuat akun sintetis. Gunakan `SIDAPS_TEST_ORIGIN=http://127.0.0.1:5189` untuk mengarahkan tes HTTP/akun/email/Google ke Worker lokal itu. Jangan memakai database pratinjau akun pribadi atau database produksi.

Backup versi 2 mencakup aset, transaksi, profil/foto, log aktivitas, pengaturan sumber harga, serta preferensi saldo/tema. Backup tidak pernah menyertakan password, kode pemulihan atau token sesi. Harga terakhir disimpan di perangkat dengan kunci per akun; sesi demo tetap hanya dalam memori.
