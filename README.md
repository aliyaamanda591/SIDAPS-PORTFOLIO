# SIDAPS PORTFOLIO

Aplikasi catatan portofolio saham, kripto, dan emas. Pengguna masuk dengan email/password dan memiliki data portofolio pribadi masing-masing. Hak admin/developer mengelola metadata akun tanpa membuka transaksi pengguna lain.

Login **Google melalui Firebase** juga tersedia. Email Google yang terverifikasi menghubungkan pengguna ke akun website dengan email yang sama; pengguna baru mendapat portofolio kosong. Email/password dan penyimpanan portofolio tetap menggunakan backend website yang sudah berjalan. Lihat [FIREBASE-SETUP.md](FIREBASE-SETUP.md) dan [ACCOUNT-LOGIN.md](ACCOUNT-LOGIN.md) untuk konfigurasi serta perilaku akun.

## Fitur

- Dashboard portofolio, tombol mata untuk menyembunyikan saldo, dan profil foto.
- Pembelian/penjualan termasuk pecahan kripto, perhitungan modal, profit/loss, dan arsip aset.
- Pencarian 843 saham dan 438 pasangan kripto IDR pada snapshot katalog.
- Pilihan 160 platform dengan nama platform tambahan milik masing-masing akun.
- Pemeriksaan harga setiap lima menit; sumber cadangan ditampilkan secara jelas.
- Login, kode pemulihan, pembatasan percobaan, dan data akun terpisah.

## Menjalankan lokal

Gunakan Node.js >=22.13, kemudian:

```sh
npm ci
npm run dev
```

Buka alamat lokal yang tercetak di terminal. Build produksi: `npm run build`. Runtime produksi memakai Cloudflare Worker dan D1; ini bukan situs HTML statis untuk GitHub Pages.

## Struktur utama

- `lib/portfolio-html.ts`: antarmuka aplikasi lengkap yang sudah disanitasi.
- `app/api/`: autentikasi, data portofolio, pengelolaan akun, dan proxy harga.
- `lib/account-store.ts`, `lib/email-auth.ts`: isolasi data dan autentikasi.
- `drizzle/`: migrasi database.
- `scripts/test-*.mjs`: pemeriksaan integrasi lokal.
- `ACCOUNT-LOGIN.md`: perilaku login dan pemulihan.
- `DEVELOPMENT.md`: dokumentasi runtime dan hosting.
- `.openai/hosting.json`: identitas hosting Sites yang sudah digunakan.

## Data dan konfigurasi

Repository ini menyimpan source aplikasi, bukan isi database akun, saldo, transaksi pribadi, password, atau backup pribadi. Nilai `OWNER_EMAIL` produksi dikelola melalui secret hosting; contoh konfigurasi tersedia di `.env.example`. Jangan masukkan file `.env`, `.dev.vars`, database lokal, atau token ke Git.

Menyimpan source ke GitHub tidak memindahkan database atau mengganti hosting yang sedang berjalan. Data produksi tetap berada pada penyimpanan hosting sebelumnya.
