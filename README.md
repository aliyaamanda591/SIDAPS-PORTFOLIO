# SIDAPS PORTFOLIO

Aplikasi catatan portofolio saham, kripto, dan emas. Pengguna masuk dengan email/password dan memiliki data portofolio pribadi masing-masing. Hak admin/developer mengelola metadata akun tanpa membuka transaksi pengguna lain.

Login **Google melalui Firebase** juga tersedia. Email Google yang terverifikasi menghubungkan pengguna ke akun website dengan email yang sama; pengguna baru mendapat portofolio kosong. Email/password dan penyimpanan portofolio tetap menggunakan backend website yang sudah berjalan. Lihat [konfigurasi Firebase](docs/accounts/FIREBASE-SETUP.md) dan [panduan akun](docs/accounts/ACCOUNT-LOGIN.md).

[Buka website](https://sidaps-portfolio.sidaps.workers.dev/) · [Dokumentasi](docs/README.md) · [Panduan pengembangan](DEVELOPMENT.md)

## Fitur

- Dashboard portofolio, tombol mata untuk menyembunyikan saldo, dan profil foto.
- Grafik IHSG dengan sumber/waktu data, serta grafik arus transaksi pribadi yang terpisah.
- Tampilan HP dengan daftar aset dan riwayat ringkas yang bisa diperluas.
- Pembelian/penjualan termasuk pecahan kripto, perhitungan modal, profit/loss, dan arsip aset.
- Pencarian 843 saham dan 438 pasangan kripto IDR pada snapshot katalog.
- Pilihan 168 platform dengan nama platform tambahan milik masing-masing akun.
- Pemeriksaan harga setiap lima menit; sumber cadangan ditampilkan secara jelas.
- Login, kode pemulihan, pembatasan percobaan, dan data akun terpisah.

## Menjalankan lokal

Gunakan Node.js >=22.13, kemudian:

```sh
npm ci
npm run dev
```

Buka alamat lokal yang tercetak di terminal. Build produksi: `npm run build`. Runtime produksi memakai Cloudflare Worker dan D1; ini bukan situs HTML statis untuk GitHub Pages.

## Struktur repositori

| Folder | Isi |
| --- | --- |
| `app/` | Halaman, autentikasi, dan endpoint API |
| `lib/` | Logika akun, data, harga, dan shell halaman |
| `public/` | CSS, JavaScript browser, ikon, dan katalog publik |
| `drizzle/` | Migrasi serta metadata database |
| `db/`, `worker/` | Koneksi database dan runtime Worker |
| `vendor/` | Stylesheet vendor dan lisensi yang masih dirujuk |
| `scripts/tests/` | Pengujian source dan integrasi |
| `scripts/dev/`, `scripts/fixtures/` | Alat serta data simulasi lokal |
| `docs/` | Panduan akun, fitur, pengembangan, dan hasil pemeriksaan |

File konfigurasi build tetap di root. Identitas proyek Sites tetap berada pada `.openai/hosting.json`. Lihat [peta source](docs/development/SOURCE-MAP.md) untuk memilih file yang perlu diedit, dan [panduan skrip](scripts/README.md) untuk menjalankan pengujian.

Komponen UI dan contoh D1 bawaan template yang tidak dirujuk aplikasi dibersihkan pada Fase 2. Logo, katalog, source fitur aktif, konfigurasi Firebase/D1, serta migrasi tetap dipertahankan. Pekerjaan Firebase yang belum selesai diamankan terpisah pada branch `safety/firebase-wip-2026-11-16`; branch itu belum digabung ke main.

## Data dan konfigurasi

Repository ini menyimpan source aplikasi, bukan isi database akun, saldo, transaksi pribadi, password, atau backup pribadi. Nilai `OWNER_EMAIL` produksi dikelola melalui secret hosting; contoh konfigurasi tersedia di `.env.example`. Jangan masukkan file `.env`, `.dev.vars`, database lokal, atau token ke Git.

Menyimpan source ke GitHub tidak memindahkan database atau mengganti hosting yang sedang berjalan. Data produksi tetap berada pada penyimpanan hosting sebelumnya.

## Pemulihan OTP email

Alur OTP sudah tersedia, tetapi pengiriman memerlukan konfigurasi layanan email dan pengirim terverifikasi. Lihat [panduan pemasangan OTP](docs/features/EMAIL-OTP-RECOVERY.md). Kode pemulihan lama dan login Google tetap tersedia sebagai cadangan.
