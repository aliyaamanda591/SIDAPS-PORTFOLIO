# Katalog kadar emas dan harga toko

Diperbarui 13 November 2026.

Tab Emas pada Tambah aset ke portofolio memiliki 25 pilihan: EMAS K24 lama dengan acuan spot, dua varian perhiasan K24 (99,9% dan 99%), serta K23 sampai K2. K15 tetap memakai identitas lama sehingga transaksi dan kepemilikan yang sudah ada tidak dipindahkan. Semua tambahan dimulai dari 0 gram dan Rp0 modal.

Varian baru menggunakan `kind: goldRetail` dan simbol terpisah `XAU_RETAIL_Kxx`. Penyimpanan menerima hanya simbol kadar yang didukung, satuan gram dan harga manual kosong. Tidak ada migrasi akun/database. Nilai aset tetap harga per gram × gram; profit/loss aset tetap nilai sekarang − modal tersisa.

Harga diambil dari baris kadar yang tepat di tabel buyback perhiasan [I Love Emas](https://iloveemas.co.id/harga/), dengan sumber cadangan [Super Emas](https://www.superemas.id/) dan [Halo Mas](https://haloemas.co.id/). Satu pengambilan halaman melayani seluruh kadar, bukan satu permintaan per aset. Sumber, tanggal toko, status cadangan dan ketertinggalan dipertahankan per kadar. Sumber cadangan yang tidak memuat kadar tertentu tidak boleh memakai K15 atau kadar lain sebagai pengganti.

Pemeriksaan harga mengikuti interval lima menit. Jika sumber tidak tersedia, harga terakhir dan waktu aslinya dipertahankan dengan penanda; tidak ada harga tetap dari screenshot maupun perhitungan spot × kadar. Harga toko adalah acuan buyback toko tersebut, bukan jaminan harga di semua toko.

Pengujian: 24 parser kadar yang tepat, batas kadar, cache satu halaman, sumber mati, tanggal lama, parser cadangan tidak menukar kadar, validasi simpan/muat 25 pilihan, kompatibilitas K24/K15 lama. Browser lokal menguji tambah K23, harga toko yang benar, simpan dan reload; modal diuji pada 320/390/430/1024px. Kolom kode saham disembunyikan dalam tab Emas.
