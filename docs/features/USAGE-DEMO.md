# Demo panduan dengan kursor

Pembaruan 13 November 2026.

Panduan Bantuan dibuka oleh pengguna melalui tombol Bantuan. Sesuai permintaan terbaru, demo langsung diputar dari langkah pertama setiap kali panel dibuka, tanpa menekan Putar terlebih dahulu. Enam langkah sekarang menampilkan simulasi dashboard, pencarian BBCA, pemilihan hasil, tambah aset, pembelian, pengisian jumlah/nominal/tanggal/platform, lalu hasil tersimpan. Kursor bergerak ke elemen sasaran, sorotan emas menandai lokasi klik, dan lingkaran klik muncul saat tindakan dijalankan. Isian diketik bertahap dan dropdown platform dibuka sebelum contoh pilihan diterapkan.

Durasi langkah dikurangi dari 6 menjadi 4,8 detik (sekitar 29 detik untuk keseluruhan demo). Jeda menghentikan tindakan yang sedang berjalan tanpa menghapus nilai yang sudah terlihat. Putar mengulang animasi langkah saat ini, tombol panah berpindah langkah, dan Ulang memulai dari awal. Area demo diposisikan kembali ke layar ketika pemutaran dimulai agar tombol kontrol yang diklik tidak membuat adegan terpotong di atas.

Seluruh adegan berada dalam DOM mock `usageTourScreen`. Tidak ada pemanggilan pembelian, penjualan, simpan akun, API transaksi, penyimpanan browser, atau perubahan portofolio dari renderer demo. Tanggal/nominal/platform hanyalah contoh, bukan data akun atau rekomendasi. Layar mock tidak membuat kontrol formulir sungguhan yang mengganggu navigasi keyboard; judul dan keterangan langkah tetap di luar visual simulasi.

Menutup panduan atau menyembunyikan tab membatalkan aksi yang dijadwalkan. Preferensi reduced-motion menonaktifkan gerak kursor dan efek lingkaran; isian ditampilkan sekaligus. Panduan tertulis tetap tersedia di bawahnya.

Verifikasi: autoplay saat membuka, kembali ke langkah pertama saat membuka ulang, jeda/tutup tetap menghentikan timer, serta pengujian teks/cursor/dropdown/hasil/cleanup dan isolasi mock; browser lokal dengan akun sintetis pada tema terang dan gelap, 320/390/430/1024px. Tidak ada overflow halaman; demo ditutup dengan timer berhenti. Demo runtime dan stylesheet berada di `public/usage-demo.js` dan `public/usage-demo.css`.
