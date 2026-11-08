# Login akun website

## Masuk dengan Google

Tombol **Lanjutkan dengan Google** memakai Firebase proyek `sidaps-portfolio`. Pengguna memilih akun Google sendiri. Server memverifikasi tanda tangan token, proyek, penyedia Google, waktu berlaku, dan status email terverifikasi sebelum membuat sesi website. Jika email cocok dengan akun yang sudah ada, portofolio dan password website yang lama tetap dipertahankan. Email berbeda mendapatkan akun Anggota baru dengan portofolio kosong.

Akun Google yang belum mempunyai password website boleh mengaktifkan password khusus website di Keamanan akun setelah masuk. Password Google/Gmail tidak diminta atau disimpan oleh website. Registrasi email/password yang dijelaskan di bawah tetap menggunakan sistem akun website yang sudah berjalan; password lama tidak dipindahkan ke Firebase. Konfigurasi Firebase dan batas integrasinya dijelaskan di `FIREBASE-SETUP.md`.

Pengguna baru memilih **Buat akun baru**, mengisi nama tampilan, email, dan password khusus website (minimal 12 karakter). Password menggunakan bcrypt cost 12 dan tidak dikembalikan oleh API. Pendaftaran memberi kode pemulihan 192-bit yang hanya ditampilkan sekali; server menyimpan digest-nya.

Login utama memakai sesi HttpOnly/Secure/SameSite=Lax selama tujuh hari. Token acak 256-bit disimpan di database sebagai digest. Penggantian password atau pemulihan merotasi versi kredensial sehingga sesi website lama tidak berlaku. Kode pemulihan lama ikut diganti. Permintaan autentikasi dan perubahan data dibatasi per IP/email dan diperiksa origin-nya.

## Akun lama dan pemilik

Login platform lama tetap tersedia di **Hubungkan akun lama / verifikasi identitas**. Setelah masuk dengan email yang sama, buka **Keamanan akun** dan aktifkan password website. Identitas portofolio tetap dipakai; akun tidak dibuat ulang dan data tidak disalin ke pengguna lain. Email pemilik di `OWNER_EMAIL` tidak dapat diklaim melalui pendaftaran publik. Hak pemilik memerlukan identitas terverifikasi, termasuk kredensial yang diaktifkan melalui jalur akun lama.

## Pemulihan

**Lupa password?** menerima email, kode pemulihan, dan password baru. Tidak ada pengiriman email verifikasi/reset pada konfigurasi ini. Bila kode hilang, pemilik email dapat memverifikasi identitas melalui login platform dengan email yang sama, lalu mengaktifkan password baru. Password website tidak mengubah password Gmail/Google.

Admin dapat mencari metadata akun dan mencatat bantuan. Tidak tersedia API admin untuk membaca hash, memilih password pengguna, atau membuka/mengubah portofolio pengguna lain.

## Pemeriksaan lokal

- `node scripts/test-email-auth.mjs`: pratinjau lokal tanpa konfigurasi pemilik untuk akun simulasi.
- `node scripts/test-owner-email.mjs`: pratinjau lokal dengan `OWNER_EMAIL=seedy@sites.test` pada `.dev.vars` yang diabaikan Git.
- Hapus `.dev.vars` uji sebelum selesai. Konfigurasi pemilik produksi tetap dikelola sebagai secret Sites.
