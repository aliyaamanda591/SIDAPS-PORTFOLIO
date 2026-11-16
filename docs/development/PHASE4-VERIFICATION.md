# Fase 4 — verifikasi akhir, 16 November 2026

## Keadaan yang benar-benar diperiksa

Dasar pemeriksaan: main `fad76a6` (Fase 2). Tidak ada commit Fase 3 terpisah setelah itu. Pemecahan landing/login/dashboard dan handler auth sudah terdapat pada main sebelumnya; verifikasi ini memeriksa struktur modular yang ada, bukan mengklaim refactor tambahan telah dilakukan.

Peta modul/nama file dan lokasi fitur diperbarui pada `AGENTS.md` dan `SOURCE-MAP.md`. Katalog, logo, font, lockfile, build/cache dan backup pribadi tetap dikecualikan dari pembacaan AI rutin. Data katalog tetap diperlukan aplikasi; tidak dihapus demi mengurangi konteks.

## Hasil verifikasi repositori

| Pemeriksaan | Hasil |
| --- | --- |
| TypeScript, tanpa emit/incremental | Lulus |
| Build produksi Vinext/Vite | Lulus; tujuh route tetap tersedia |
| `npm test` | **25/25 lulus** dengan jaringan dimatikan |
| `npm run verify:project` | Lulus: 70 referensi aset, 3 script inline, 20 script publik |
| Worker lokal hasil build | Landing/login/demo/reset 200; state/admin/prices 401 tanpa sesi; logo/katalog 200 |
| Proteksi source/config | 1.111 file runtime/config diperiksa SHA-256 per file sebelum/sesudah: identik |
| Dependensi dan lockfile | Tidak berubah; package.json hanya menambah perintah tes/verifikasi |

Build masih mengeluarkan peringatan deprecation `module.register()` dari toolchain; build berhasil. Tidak menyatakan dependensi eksternal bebas peringatan.

## Lima tes lama dan loader

- Loader permanen Node untuk import TS/JSON tanpa ekstensi, termasuk parameter properties TypeScript. HTML diimpor langsung dari perangkai yang digunakan aplikasi. Adapter sementara Fase 2 dan monkey-patch `fs` tidak digunakan.
- Fast login memeriksa kebijakan 8 karakter yang memang dipakai frontend/backend sekarang, termasuk penolakan 7 karakter dan penerimaan batas 8 karakter.
- Login experience tetap menguji replay/skip/reduced motion/race/navigation; pencocokan callback disesuaikan dengan handler saat ini.
- Mobile login mengekstrak fungsi request melalui syntax tree, bukan batas nama fungsi lama yang sudah hilang; timeout dan pembersihan timer tetap diuji.
- Password reset menguji kompatibilitas OTP lama secara terisolasi, serta jalur Firebase saat ini: signup, login, email reset, verifikasi, konfirmasi, dan penolakan kode invalid/kedaluwarsa memakai HTTP sintetis.
- Recovery UI diperbarui mengikuti tautan email: login/registrasi tetap diteruskan, gagal kirim, cooldown/resend, kembali login, verifikasi token/Firebase code, validasi sandi, gagal reset/retry dan navigasi berhasil.

Tidak ada assertion lama dimatikan untuk memaksa lulus. Ekspektasi yang sudah tidak sesuai produk diperbarui secara eksplisit. Transport Firebase/email palsu dan SQLite memori memastikan tidak ada akun, email atau transaksi produksi yang dibuat. Sembilan skrip tambahan memerlukan fixture/HTTP khusus dan bukan bagian suite 25 offline; laporan ini tidak mengklaim semuanya telah dijalankan.

## Konfigurasi dan temuan operasional yang belum selesai

Firebase Web Config, project ID `sidaps-portfolio`, auth domain, D1 binding/database ID, migrasi, site identity, cookie dan alias lama **tidak diubah**. Cabang pengaman `safety/firebase-wip-2026-11-16` / `4e18ef5` tetap terpisah dari main. DNS/Firebase Console/database produksi tidak dimodifikasi.

Pemeriksaan baca-saja layanan publik pada 16 November:

- `https://sidaps.online/` dan `/?login=1` merespons 200.
- Config login yang tayang cocok dengan project dan Web Config pada main.
- `/api/state` merespons 401 tanpa sesi, tidak membuka data portofolio.
- Endpoint konfigurasi publik Firebase merespons 200, tetapi **`sidaps.online` belum tercantum pada Authorized Domains**. Daftar masih berisi localhost, domain Firebase, alamat Sites dan alias Workers lama.

Karena itu, **kode dan suite regresi lulus, tetapi kesiapan login Google pada domain sidaps.online belum dapat dinyatakan selesai**. Tindakan konfigurasi eksternal yang diperlukan: Firebase Console → proyek sidaps-portfolio → Authentication → Settings → Authorized domains → tambahkan `sidaps.online` (tanpa protokol/path), pertahankan semua domain yang masih dipakai; tambahkan `www.sidaps.online` hanya jika alamat itu memang dipakai. Setelah itu verifikasi OAuth nyata pada domain tersebut. Pemeriksaan ini tidak masuk ke akun Google nyata atau mengirim email sungguhan.

Tidak dilakukan deployment manual. Commit source ke main dapat memicu pipeline hosting yang sudah ada; tidak mengubah konfigurasi domain Firebase secara otomatis.
