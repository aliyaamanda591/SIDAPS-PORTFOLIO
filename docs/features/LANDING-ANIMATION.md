# Animasi landing page

Pembaruan 14 November 2026.

Tombol Lihat cara kerjanya kini menuju `#tutorial`, pemutar animasi dalam bagian Cara pakai. Tiga bab mengikuti konsep landing: membuat akun pribadi, memilih aset/mencatat pembelian, dan melihat ringkasan portofolio. Pemutar memakai contoh Google/email, pilihan BBCA, jumlah 100 lembar, nominal 500000, tanggal contoh dan platform contoh. Kursor, pengetikan bertahap, tanda klik dan hasil tersimpan hanya mengubah DOM simulasi.

Setiap bab berlangsung enam detik. Tutorial mulai saat setidaknya seperempat pemutar terlihat, atau ketika pengguna menekan Lihat cara kerjanya/bab/Putar. Tombol Jeda dan Ulang tersedia. Memilih bab atau memutar ulang menggulir pemutar ke layar, terutama pada HP. Tiga adegan memiliki tinggi tetap agar tombol kontrol tidak bergeser saat notifikasi contoh muncul. Langkah tertulis tetap tersedia melalui Baca langkah lengkap dan tidak membutuhkan JavaScript.

Kartu contoh pada hero mengganti jenis aset secara berkala dan menggambar ulang grafik ilustrasi dengan bentuk berbeda untuk saham/kripto/emas. Pilihan manual tetap berfungsi dan menunda pergantian otomatis selama sembilan detik. Tidak ada perubahan modal contoh, klaim harga pasar atau hasil investasi nyata.

Animasi menggunakan HTML/CSS, SVG dan JavaScript lokal (`public/landing-cinema.js/css`), tanpa unduhan video besar atau SDK autentikasi tambahan. Kedua rangkaian berhenti menjadwalkan pekerjaan saat berada di luar layar atau tab disembunyikan. Preferensi reduced-motion menonaktifkan autoplay/gerak; pengguna tetap dapat membuka bab secara manual. Pemutar tidak membaca akun, penyimpanan browser atau API transaksi.

Verifikasi: navigasi #tutorial, pengetikan jumlah/nominal, pilihan platform, hasil contoh, jeda/ulang/bab, siklus grafik, penutupan tab, reduced-motion dan pemisahan akun melalui unit tests. Browser lokal memeriksa 320/375/390/430/768/1024/1440px. Tidak ditemukan overflow halaman; adegan muat dalam area tetap 400px. Login, backend dan data portofolio tidak diubah.
