# Mobile dashboard and login

Pada layar HP hingga 760px, navigasi tersedia melalui hamburger/drawer. Daftar aset, transaksi, dan portofolio memakai baris ringkas yang dapat dibuka untuk melihat detail serta tindakan. Ringkasan nilai menggunakan dua kolom jika ruang mencukupi; layar sangat sempit memakai satu kolom. Input memakai ukuran yang nyaman disentuh, label grafik mempertahankan ukuran sekitar 12px, dan halaman diuji tanpa overflow horizontal.

Riwayat transaksi dashboard dibatasi tingginya; gulir otomatis dijeda pada HP. Tabel portofolio tambahan dibuka melalui tombol Lihat portofolio. Sumber serta waktu harga tersedia pada rincian aset. Label HARGA TERTUNDA membedakan data tertunda dari harga real-time. Perhitungan, mode privasi saldo, dan penyimpanan per akun tetap terpisah.

Mobile/coarse-pointer and reduced-motion login views skip the canvas/coins/ticker JavaScript and use a lightweight static background. The hosted anonymous view does not request private price endpoints. Transaction auto-scroll does not run its normal animation loop while login is locked, the document is hidden, or the dashboard is inactive. Unchanged platform options are not rebuilt on every price render, preserving active form selections. Decorative desktop tickers contain symbols only, with no invented price changes.

Email and Google session exchanges have a 15-second request deadline and retryable errors. Successful Google session exchange reloads immediately without waiting for temporary SDK sign-out. Firebase still uses memory persistence; reload clears its temporary state. Password hashing, cookie security, token checks and authorization are unchanged. Network/provider speed still affects actual sign-in time.

Checks: `node scripts/tests/test-mobile-login.mjs`, `node scripts/tests/test-portfolio-summary.mjs`, dan build produksi. Catatan pemeriksaan layar tersedia di [RESPONSIVE_QA.md](../RESPONSIVE_QA.md).
