# Smartphone melayang pada landing

- Struktur: `lib/landing/hero.ts`; stylesheet terbatas landing: `public/landing-phones.css`, dimuat setelah lapisan tema melalui `lib/landing/head.ts`.
- Arsip dua screenshot pengguna disalin byte-for-byte ke `public/landing-phones/dashboard-light.png` (488×907, 90.717 byte) dan `dashboard-dark.png` (481×906, 90.153 byte). Tidak di-resize, digambar ulang, digabung, dikompresi ulang, atau diganti gambar AI. Revisi model kemudian memakai showcase asli sebagai sumber dua lapisan terpisah, seperti dijelaskan di bawah.
- Model revisi memakai kontur SVG yang menampilkan piksel bodi asli, bukan bingkai CSS baru. Wrapper hanya translateY; perspektif berasal langsung dari foto. Durasi 7,8 dan 9,4 detik dengan fase berbeda; amplitudo 13px desktop dan 8px HP. Shadow statis, tanpa canvas/render-loop/library baru.
- Animasi otomatis berulang; pause saat hero di luar viewport atau tab tersembunyi mengikuti mekanisme landing yang sudah ada. `prefers-reduced-motion: reduce` mematikan gerakan. Dimensi intrinsik gambar dicantumkan untuk menghindari layout shift; gambar tidak diperbesar melewati ukuran sumber.
- Contoh dashboard interaktif kini selalu terlihat dalam section dua kolom “Sentuh asetnya. Kenali cara kerjanya.” di bawah hero/strip aset, tanpa disclosure. ID, kategori, grafik dan event handler tidak diganti; bukan halaman demo baru.
- Referensi Google AI Studio dilihat melalui pratinjau pengguna: diambil perubahan kecil berupa penutup Emerald–Gold, pesan nyaman dipakai di HP/laptop, dan CTA demo tambahan. Tidak menyalin proyek lain atau mengganti tutorial/backend/autentikasi.
- Uji browser: 320, 360, 375, 390, 430, 768, 1024, 1440 px tanpa overflow body; dua aset berhasil dimuat. Timing animasi berbeda/running; membuka contoh lama dan memilih Kripto masih menghasilkan angka kategori yang sesuai. Aturan reduced-motion diverifikasi pada stylesheet dan regresi.
- Regresi `scripts/tests/test-landing.mjs` mengunci hash screenshot sumber dan mempertahankan contoh interaktif. Source aplikasi akun, database, auth, API, transaksi dan dashboard privat tidak disentuh.

## Revisi detail model dan logo

- Sumber model: public/landing-phones/showcase-original.png, 1672×941, disalin byte-for-byte dari gambar pengguna. SHA-256: 65468e46968b282b274715432e89cc5eab09049aec711986e627c7a52d8919e8. Dua inline SVG memakai clipPath terpisah dan animasi berbeda; yang ditampilkan setiap lapisan hanya satu ponsel. Tidak menggunakan satu gambar gabungan sebagai elemen hero tunggal. Bagian layar/bodi yang saling menutupi mengikuti foto sumber; tidak direka ulang.
- CSS tidak memberi filter blur atau rotasi tambahan pada model raster. Komposisi diperbesar, dan tautan gambar asli ukuran penuh tersedia untuk melihat detail. Ketajaman tetap dibatasi resolusi sumber, bukan dijanjikan detail baru yang tidak ada pada gambar.
- Contoh interaktif selalu terbuka; semua enam aset memakai logo lokal. BBCA/BMRI memakai logo saham existing, BTC/SOL disimpan dari URL katalog aplikasi yang sudah dipakai (static.indodax.com), K24/K15 memakai ikon batang emas yang mengikuti SVG aplikasi. Tidak ada permintaan logo ke server eksternal ketika pengguna membuka contoh.
- public/landing-demo-data.js hanya data sintetis publik; public/landing-cinema.js memperbarui ikon footer contoh sesuai kategori. Tidak menyentuh akun/data transaksi asli.
