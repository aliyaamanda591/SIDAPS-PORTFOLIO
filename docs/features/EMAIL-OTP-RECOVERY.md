# Pemulihan sandi melalui OTP email

## Status pemasangan

Alur pemulihan OTP sudah disiapkan. Pengiriman **belum aktif** sampai pengelola memasang layanan email dan memverifikasi alamat pengirim. Jangan menampilkan pesan "email terkirim" jika provider belum dikonfigurasi atau menolak pengiriman.

OTP dikirim ke **email yang sudah terdaftar**, termasuk alamat Gmail. Ini mengubah sandi website SIDAPS, bukan sandi akun Google/Gmail. Login Google tetap menggunakan tombol Google. Akun dan portofolio tidak dipindahkan atau dibuat ulang.

## Yang perlu dilakukan pengelola

1. Buat akun pada [Resend](https://resend.com), lalu verifikasi domain pengirim di menu Domains. Domain pengirim harus milik sendiri; alamat `workers.dev` atau `gmail.com` bukan domain yang dapat diverifikasi sendiri. Panduan: [Verified domains](https://resend.com/docs/dashboard/domains/introduction).
2. Buat API key dengan izin **sending** untuk domain tersebut. Jangan kirim API key atau sandi Gmail di chat, jangan masukkan ke JavaScript, GitHub, atau file publik.
3. Di Cloudflare: **Workers & Pages → sidaps-portfolio → Settings → Variables and Secrets**. Tambahkan:
   - `RESEND_API_KEY` sebagai **Secret**: API key Resend.
   - `AUTH_EMAIL_FROM` sebagai variabel: alamat pengirim yang diverifikasi, misalnya `SIDAPS Portfolio <login@domain-anda.id>`.
4. Terapkan migrasi tambahan `drizzle/0003_absent_abomination.sql` ke D1 produksi yang terikat ke Worker, jika belum diterapkan. Migrasi hanya menambah tabel OTP dan indeks; jangan menghapus tabel akun/portofolio. Hosting Sites menerapkan migrasi saat publikasi; deployment GitHub/Cloudflare mandiri memerlukan migrasi D1 tersendiri.
5. Deploy ulang Worker bila diminta oleh Cloudflare. Untuk hosting Sites lama, pasang kedua nilai melalui pengaturan environment Sites juga; konfigurasi dua hosting terpisah.
6. Uji dengan email milik pengelola: Lupa sandi → Kirim OTP → periksa inbox/Spam → masukkan OTP dan sandi baru → masuk kembali. Jangan gunakan alamat pelanggan untuk uji coba. Periksa log delivery di Resend bila email tidak tiba; respons API diterima provider tidak menjamin inbox.

Tidak diperlukan sandi Gmail pengguna, akses inbox pengguna, atau izin membaca transaksi. Tanpa layanan email, pilihan kode pemulihan lama tetap tersedia. Untuk Gmail, pengguna dapat mencoba login Google dengan **email yang sama**; penghubungan akun terverifikasi yang sudah ada tetap dipertahankan.

## Alur pengguna

- Halaman Lupa sandi awalnya hanya meminta email.
- Setelah permintaan diterima, tampil kolom OTP 6 digit dan sandi baru. Pesan tidak membocorkan apakah alamat itu terdaftar.
- OTP berlaku 10 menit, maksimal 5 percobaan. Pengiriman ulang tersedia setelah 60 detik dan membatalkan kode sebelumnya.
- OTP terikat pada permintaan di halaman/browser tersebut. Jika halaman dimuat ulang atau ditutup, minta OTP baru.
- Setelah berhasil, sandi lama dan sesi lama tidak berlaku. Pengguna masuk kembali dengan sandi baru; data portofolio tetap sama.

## Keamanan dan pengujian

Endpoint POST `request-otp` dan `reset-otp` tetap dilindungi pemeriksaan Origin dan batas ukuran JSON yang sama. Batas tambahan per IP/email membatasi pengiriman dan tebakan. OTP dihasilkan dengan kriptografi dan tidak ditulis ke log atau dikembalikan oleh API. D1 hanya menyimpan hash OTP yang terikat ke rahasia permintaan 256-bit, hash permintaan, batas waktu, jumlah percobaan, dan versi kredensial.

Penggantian sandi menggunakan kondisi atomik pada versi kredensial dan OTP aktif, sehingga replay atau dua permintaan serentak tidak dapat mengganti sandi dua kali. OTP yang belum diterima layanan pengiriman belum dapat digunakan. Sandi yang diganti melalui cara lain juga membatalkan OTP sebelumnya. Pemulihan OTP memverifikasi kepemilikan email dan menonaktifkan kode pemulihan lama.

`node scripts/tests/test-password-reset.mjs` menguji database SQLite lokal dengan provider tiruan; tidak mengirim email sungguhan. `node scripts/tests/test-recovery-otp-ui.mjs` menguji langkah UI dan fallback. Uji pengiriman nyata tetap wajib setelah konfigurasi provider.

Referensi API pengiriman: [Send email](https://resend.com/docs/api-reference/emails/send-email).
