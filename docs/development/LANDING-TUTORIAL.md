# Tutorial landing dan caption hero

- `public/landing-tutorial.js`: lima adegan terisolasi—mulai dari akun kosong, pembelian saham BBCA, kripto BTC, emas K24, dan pemeriksaan ringkasan/transaksi/portofolio. Kursor bergerak, sorotan klik, isian bertahap, menu platform, konfirmasi simpan, lalu ringkasan berubah. Harga/angka hanya ilustrasi.
- `public/landing-tutorial.css`: bingkai HP dengan status bar dan indikator bawah, pilihan Monitor, kartu compact, tema terang/gelap Emerald–Gold, serta penyesuaian HP. Aset/platform memakai logo lokal yang sudah tersedia.
- `lib/landing/tutorial-faq-footer.ts`: perangkat HP/Monitor, kategori Saham/Kripto/Emas, jeda/putar/ulang dan keterangan simulasi. Anchor `#tutorial` dan CTA “Lihat cara kerjanya” tetap dipertahankan.
- `public/landing-cinema.js`: kini hanya contoh ringkasan publik yang terpisah; pemutaran tutorial tidak bercampur dengan pergantian kategori contoh tersebut.
- Autoplay saat tutorial terlihat atau CTA diklik; jeda ketika keluar viewport/tab disembunyikan. Pengguna bisa memilih bab/kategori/perangkat dan menjeda atau mengulang. Reduced motion menghentikan autoplay dan efek gerak; pengguna masih bisa memulai adegan secara eksplisit.
- Tutorial memakai string DOM sintetis. Tidak memanggil API akun, fungsi transaksi nyata, penyimpanan browser, atau data pengguna. Form yang terlihat bukan formulir akun sebenarnya. Kuantitas BTC memakai titik desimal seperti input angka aplikasi.
- Handler perangkat hanya dipasang pada `button[data-tutorial-device]`, bukan kontainer yang memiliki atribut serupa, agar klik yang merambat tidak me-reset adegan atau membatalkan pause.
- `lib/landing/hero.ts`: tautan “Lihat gambar asli ukuran penuh” dihapus; caption ringkas dan model asli dua HP tetap dipertahankan. Aturan CSS tautan yang sudah tidak dipakai dibersihkan.
- Regresi pada `scripts/tests/test-landing-cinema.mjs` mencakup ketiga pembelian, nilai/unit/platform berbeda, logo, review, perangkat, pause/replay, timer cleanup, reduced motion dan pemisahan dari state akun. `test-landing.mjs` memastikan link gambar tidak muncul lagi dan struktur tutorial tetap tersedia.

Build/typecheck serta suite offline harus tetap lulus. Perubahan tidak menyentuh auth, session, database, backend API, ledger atau dashboard pengguna.

Verifikasi browser: tema gelap memakai permukaan hijau gelap dan teks terang, pause tetap pada adegan yang dipilih, 320/375/390/430/768/1024/1440 px tanpa overflow body, dan caption hero tidak memiliki link gambar lagi. Kartu review dipadatkan agar tiga aset tetap masuk layar.
