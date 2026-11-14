# Tema Zamrud & Emas

Pembaruan 14 November 2026 mengikuti konsep pratinjau yang disetujui pengguna. Tema terang memakai latar putih hangat #F4F7F4, kartu putih, teks hijau tua #173C2D, dan sidebar zamrud #0B281E. Tema gelap memakai latar #071B16, kartu #0D261E, serta teks putih hangat. Aksi utama menggunakan emas lembut #CFB376–#E4CEA1; aksen emas pada teks terang dibuat lebih gelap #87672E agar terbaca. Untung/rugi tetap memakai hijau/merah semantik.

Kartu modal menjadi jangkar zamrud dengan nominal putih. Kartu lain, tabel, dialog, form, profil, dropdown, papan pasar, tutorial dan landing memakai palet yang sama. Sidebar tetap zamrud pada kedua tema. Landing serta login/daftar tetap terang tanpa kontrol tema publik; pengaturan terang/gelap/otomatis tetap tersedia di akun. Preferensi perangkat/pengguna tidak direset.

Implementasi terpusat di public/emerald-gold.css, dimuat terakhir pada shell aplikasi, login dan landing, dengan root id sidaps-portfolio. Override memakai cakupan root agar aturan lama yang memiliki !important tidak mengubah kontras. public/theme.js hanya memperbarui warna browser, dan palette donut pada public/portfolio-insights.js dibuat lebih tenang. Tidak mengganti navigasi, responsivitas, API, penghitungan, autentikasi atau model penyimpanan.

Semua logo tetap berasal dari renderer dan sumber yang sudah tersedia. Tidak ada logo yang diganti monogram baru, difilter, diputihkan atau dihapus. Pemeriksaan sumber memastikan seluruh inline script aplikasi/auth/finance dan sumber gambar tetap identik. Tes brand memvalidasi 839 SVG saham dan 130 pemetaan platform. Browser mengonfirmasi logo BBCA/BMRI/BTC/SOL pada kartu dan pencarian, serta Growin/Indodax pada dropdown.

QA browser lokal:
- Dashboard pada 320, 360, 375, 390, 414, 430, 768, 1024, dan 1440px: tidak ada overflow halaman atau nominal keluar dari kartu.
- Screenshot terang/gelap HP, desktop dan tablet. Menu HP, portofolio, pencarian saham/kripto/emas, transaksi/pilihan platform, akun serta dialog profil diperiksa.
- Login dan daftar diperiksa melalui pratinjau statis form saat browser QA memiliki sesi akun uji. Field tidak keluar layar dan tombol menggunakan palet baru; tidak melakukan sign-in atau membuat akun.
- Landing, hero, papan pasar dan warna teks diperiksa. Dua konflik cascade pada nominal modal serta heading papan pasar ditemukan dan diperbaiki.
- Tidak ada error JavaScript pada sesi demo.

Kontras pasangan warna utama melebihi 4,5:1: teks terang 12,20:1; teks sekunder 5,47:1; aksen teks emas 5,24:1; teks gelap 14,20:1; nominal modal putih 8,88:1; tombol emas 6,41:1. Tes tema, brand, foto profil, ringkasan/perdagangan, demo, login dan performa login lolos; TypeScript dan build lolos.
