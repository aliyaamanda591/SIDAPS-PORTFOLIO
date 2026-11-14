# Animasi landing page

Pembaruan 14 November 2026: demo mengikuti susunan dashboard Sidaps, bukan form generik.

Tutorial memperagakan login dengan logo Google berwarna, navigasi menu, akun kosong, pencarian BBCA, pemilihan aset, kartu dengan 0 unit/modal, pembelian 100 lembar senilai Rp500.000, pemilihan Stockbit, dan hasil tersimpan. Bab Pantau membuka rincian aset, halaman Transaksi, halaman Portofolio, lalu kembali ke Dashboard. Semua tindakan hanya mengubah DOM simulasi. Tidak membaca atau mengubah akun, penyimpanan, maupun API transaksi.

Durasi tiga bab: 6,2 / 10 / 9 detik. Kursor, sorotan emas, cincin klik, pengetikan dan transisi memperjelas target. Autoplay ketika terlihat; Jeda, Ulang dan pemilihan bab tetap tersedia. Saat tab tersembunyi atau pemutar di luar layar, timer berhenti. Reduced motion menonaktifkan autoplay.

Hero memakai data contoh publik terpisah di public/landing-demo-data.js. Saham: modal Rp1.980.000, nilai Rp1.970.000. Kripto: modal Rp5.900.000, nilai Rp5.800.000. Emas: modal Rp5.500.000, nilai Rp5.650.000. Nilai dihitung dari unit × harga contoh; profit/loss = nilai − modal. Baris aset, satuan, rincian dan bentuk grafik berubah per kategori. Baris rincian terbuka bergantian otomatis, juga dapat diklik. Pilihan manual menunda rotasi agar dapat dibaca. Angka bukan harga pasar maupun data portofolio pengguna.

Pengujian otomatis meliputi urutan pembelian, angka/unit per kategori, rincian otomatis, kontrol putar/jeda, penghentian timer, reduced motion dan isolasi akun. Browser lokal: 320px dan 390px pada HP serta 1440px desktop; memeriksa kartu, form, menu, rincian, dan tidak adanya overflow halaman. Grafik disembunyikan sementara ketika rincian tutorial terbuka agar seluruh baris terlihat dalam pemutar. Build, TypeScript, dan tes regresi login lolos.
