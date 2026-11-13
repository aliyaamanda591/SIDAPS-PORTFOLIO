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
```

## Pemeriksaan integrasi lokal

Skrip HTTP, akun, dan direktori tertentu membutuhkan server pada `http://127.0.0.1:5178` serta fixture/konfigurasi pemilik yang sesuai. Baca skrip sebelum menjalankannya karena beberapa membuat atau mengubah akun simulasi. Jangan mengarahkannya ke produksi.

```sh
npm run dev -- --port 5178
node scripts/tests/test-email-auth.mjs
```

`scripts/dev/create-mobile-preview.mjs` membuat akun simulasi pada alamat lokal tersebut. `scripts/fixtures/directory-fixture.sql` adalah data uji lokal, bukan backup pengguna atau migrasi produksi. Pengujian harga dengan opsi `--live` memerlukan koneksi ke penyedia pasar; pengujian biasa menggunakan fixture terkontrol.
