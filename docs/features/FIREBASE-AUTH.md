# Firebase Authentication — panduan SIDAPS

## Tempat memasukkan Firebase Config

**Pilihan paling mudah: `config/firebase.web.json`.** File ini sudah berisi Web Config proyek SIDAPS yang sebelumnya dipakai untuk Google. Tidak perlu mengirim ulang config di chat. Jika ingin menggantinya, ambil Web Config dari Firebase Console → Project settings → General → Your apps → Web app → SDK setup and configuration → Config.

Tempel **objek JSON saja**, bukan `const firebaseConfig =`, bukan seluruh tag `<script>`. Contoh bentuknya:

```json
{
  "apiKey": "API_KEY_WEB_ANDA",
  "authDomain": "nama-proyek.firebaseapp.com",
  "projectId": "nama-proyek",
  "appId": "APP_ID_WEB_ANDA",
  "storageBucket": "nama-proyek.firebasestorage.app",
  "messagingSenderId": "SENDER_ID_ANDA"
}
```

**Alternatif untuk hosting: environment variable `FIREBASE_WEB_CONFIG`.** Isinya objek JSON yang sama dalam satu nilai. Ini menimpa file default untuk backend dan frontend sekaligus. Di Cloudflare: Workers & Pages → sidaps-portfolio → Settings → Variables and Secrets → Add → `FIREBASE_WEB_CONFIG` → isi JSON → simpan dan deploy. Untuk hosting Sites lama, pasang nilai itu melalui pengaturan environment Sites; kedua hosting memiliki konfigurasi terpisah. Contoh nama variabel ada di `.env.example` pada GitHub. Untuk preview lokal, gunakan `.dev.vars` yang tidak diunggah:

```dotenv
FIREBASE_WEB_CONFIG='{"apiKey":"...","authDomain":"nama-proyek.firebaseapp.com","projectId":"nama-proyek","appId":"..."}'
```

Web Config Firebase memang digunakan di browser dan bukan kunci Admin rahasia. Sistem hanya mengeluarkan field config yang dibutuhkan melalui `/api/auth/config`. **Jangan tempel service-account JSON, `private_key`, sandi Gmail, atau API key Resend di sini.** Config yang mengandung service-account ditolak. Tidak perlu SMTP, Resend, atau Firebase Admin private key.

Jangan berpindah ke proyek Firebase berbeda sembarangan: UID dan daftar pengguna berbeda antarproyek. Untuk website ini, pertahankan proyek `sidaps-portfolio` agar akun yang sudah ada tetap dikenali.

## Yang diaktifkan di Firebase Console

1. Authentication → Sign-in method: aktifkan **Google** dan **Email/Password**. Tidak perlu Email link/passwordless atau SMS OTP.
2. Authentication → Settings → Authorized domains: pastikan `sidaps-portfolio.sidaps.workers.dev` tercantum tanpa `https://`, tanpa garis miring, dan tanpa titik di akhir. Tambahkan `localhost` hanya untuk pengujian lokal yang dibutuhkan. Pertahankan domain hosting lama bila masih digunakan.
3. Authentication → Templates: periksa template **Email address verification** dan **Password reset**. Firebase yang mengirim email; pengiriman dapat dibatasi kuota atau masuk Spam. Gunakan handler email bawaan Firebase kecuali memang sudah menyiapkan handler kustom.
4. Sesuaikan Password policy Firebase bila ingin minimum 12 karakter juga berlaku pada formulir reset sandi bawaan Firebase. Formulir pendaftaran SIDAPS memakai minimum 12 karakter.
5. Di Cloudflare D1 produksi yang terikat ke Worker, terapkan `drizzle/0004_unusual_loki.sql` sekali jika belum diterapkan. Migrasi ini hanya menambah pemetaan UID Firebase → akun SIDAPS; jangan menghapus tabel atau mengubah `user_id` portofolio. Hosting Sites menerapkan migrasi saat publikasi, sedangkan Cloudflare mandiri memerlukan migrasi terpisah.

## Alur yang sekarang digunakan

- **Daftar:** `createUserWithEmailAndPassword` → simpan nama di Firebase → `sendEmailVerification`. Pengguna membuka tautan di inbox/Spam, kembali ke SIDAPS, lalu menekan **Sudah verifikasi, lanjutkan**. Portofolio belum dapat diakses sebelum email terverifikasi.
- **Masuk email/sandi:** `signInWithEmailAndPassword`. Sandi dikirim langsung ke Firebase melalui SDK, bukan ke endpoint login SIDAPS.
- **Google:** `signInWithPopup` dengan GoogleAuthProvider. Email Google harus terverifikasi.
- **Lupa sandi:** `sendPasswordResetEmail`. Firebase mengirim tautan reset sandi, bukan kode OTP 6 digit. Mengubah sandi SIDAPS tidak mengubah sandi Gmail/Google.
- **Keamanan akun:** tombol kirim tautan ubah sandi memakai Firebase yang sama.
- **Sesi:** Firebase menyimpan status masuk melalui persistence SDK. Token ID terverifikasi dipasang sebagai cookie HttpOnly/Secure/SameSite; token diperbarui melalui SDK. Backend memeriksa tanda tangan, proyek, penyedia, email terverifikasi, dan status akun Firebase. Status pencabutan/penonaktifan diperiksa dengan cache maksimal 30 detik. Tidak ada refresh token atau sandi Firebase di D1.
- **Keluar:** perubahan portofolio disimpan dahulu melalui alur lama, lalu cookie website dibersihkan dan SDK Firebase sign-out. Bila SDK gagal sign-out, penanda lokal mencegah pemulihan sesi otomatis pada kunjungan berikutnya.

## Akun dan data lama

**Data portofolio tetap di D1 dan tidak dipindahkan ke Firestore.** Firebase mengelola autentikasi, sedangkan UID Firebase dipetakan ke `user_id` SIDAPS yang sudah ada. Email yang sama dan sudah diverifikasi dapat terhubung ke portofolio lama. Konflik UID atau perubahan email tidak otomatis menggabungkan catatan keuangan.

Pengguna Google yang sudah terdaftar di proyek yang sama cukup masuk dengan Google. Untuk akun email/sandi lokal lama yang **belum terdaftar di Firebase**, pilih **Akun lama? Hubungkan dengan email yang sama**, daftar sekali dengan email yang sama, lalu verifikasi email. Sandi lama tidak otomatis menjadi sandi Firebase. Jika Firebase menyatakan email sudah digunakan, pilih Masuk, Google, atau Lupa sandi, bukan membuat email lain.

Sesi lokal lama dibiarkan selama masa transisi agar pengguna tidak langsung kehilangan akses. Setelah akun dihubungkan ke Firebase, sandi/kode pemulihan lokal dinonaktifkan dan sesi lama akun tersebut dicabut. Endpoint pendaftaran, login sandi, dan OTP kustom lama ditutup (HTTP 410). Migrasi SQL historis tetap dipertahankan; tabel OTP lama tidak dipakai lagi.

## Pemeriksaan setelah pemasangan

Uji memakai akun milik sendiri: daftar → email verifikasi → masuk → logout → login kembali → Lupa sandi. Uji Google juga. Pastikan portofolio lama muncul hanya ketika email yang sama berhasil diverifikasi. Jangan memakai email pelanggan untuk pengujian dan jangan membagikan tautan verifikasi/reset kepada admin.

Pengujian otomatis memakai token bertanda tangan sintetis, SQLite lokal, dan SDK/REST mock; tidak mengirim email atau membuat akun Firebase sungguhan. Pengiriman email nyata perlu diuji dengan akun pemilik setelah konfigurasi provider aktif.

Rujukan resmi: [Mengelola pengguna dan email verifikasi/reset](https://firebase.google.com/docs/auth/web/manage-users), [Verifikasi ID token](https://firebase.google.com/docs/auth/admin/verify-id-tokens), [REST account lookup](https://firebase.google.com/docs/reference/rest/auth#section-get-account-info).
