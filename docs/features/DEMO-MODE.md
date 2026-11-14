# Demo tanpa daftar

Mode publik `/?demo=1` membuka dashboard Sidaps yang sama tanpa Google, email, password, atau pembuatan akun. Tersedia dari landing page dan halaman login.

Data contoh mencakup BBCA, BMRI, Bitcoin, Solana, dan emas K24; seluruh angka dibuat khusus untuk demo. Pengunjung dapat mencoba tambah aset, pembelian/penjualan, riwayat, pengaturan jumlah, privasi saldo, tema, dan panduan. Harga portofolio diberi label HARGA DEMO dan tetap agar latihan konsisten. IHSG tetap merupakan informasi pasar publik, terpisah dari kepemilikan fiktif.

Setiap halaman memiliki state di memori sendiri. Tidak ada akun demo bersama, kredensial bersama, cookie demo, tabel baru, atau data demo di D1. Muat ulang, tombol Ulang demo, atau membuka tab baru mengembalikan contoh awal. Perubahan tidak dibawa ke akun pribadi ketika pengunjung mendaftar. Pengunjung perlu membuat akun sendiri untuk menyimpan portofolionya.

Route demo diproses sebelum resolveIdentity/readState. Renderer memakai shell aplikasi yang telah disanitasi dan bootstrap khusus dengan peran guest. Harga demo, penyimpanan dalam memori, dan keluar demo hanya diterapkan pada respons demo; shell akun pribadi tetap utuh. Pemanggilan account API (/api/state, /api/auth, /api/admin) diblokir dalam demo, termasuk ketika browser memiliki sesi asli. Keluar demo tidak menghapus sesi akun asli. Form password serta impor backup pribadi digantikan/disembunyikan. Endpoint server tetap meminta autentikasi seperti sebelumnya.

Implementasi: lib/demo-portfolio.ts, public/demo-mode.js/css, app/route.ts dan tombol pada landing/login. Tidak mengubah backend autentikasi, skema database, akun, atau portofolio tersimpan.

Verifikasi: test-demo-mode.mjs menguji fixture independen, tidak adanya identitas/data pemilik, pemisahan route, blokir API akun, penyimpanan lokal dalam memori, keluar tanpa logout asli, label demo, serta tombol masuk. Tes login, performa login, landing, TypeScript dan build lolos. Browser lokal memeriksa 320/390px dan desktop 1440px; pembelian 100 lembar BBCA Rp960.000 menambah unit, modal dan riwayat, lalu muat ulang mengembalikan angka awal. Tombol demo di login diuji melalui pratinjau form statis karena browser QA sudah memiliki sesi akun uji; tombol menuju route demo yang sama. Tidak ditemukan overflow halaman maupun error JavaScript pada demo.
