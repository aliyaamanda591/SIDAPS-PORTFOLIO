# Fase 2 — pembersihan terkontrol

Dilaksanakan 16 November 2026 berdasarkan audit Fase 1. Source dasar main: `187cfb31e036d16b096c85b26b61a032eb5d67a5`.

## Pengamanan pekerjaan Firebase

- Seluruh perubahan tracked/untracked Firebase yang belum tersimpan di source kerja diamankan terlebih dahulu dalam commit `4e18ef5` pada branch GitHub `safety/firebase-wip-2026-11-16`.
- Branch pengaman tersebut belum digabung ke main. Implementasinya berbeda dari main terbaru dan harus ditinjau ketika melanjutkan pekerjaan autentikasi. Jangan menyalinnya secara massal ke main.
- Source kerja `sites/catatan-investasi` tetap berada di branch pengaman; pembersihan dilakukan pada checkout GitHub terbaru.
- Tidak ada perubahan provider Firebase, Authorized Domains, DNS `sidaps.online`, secret hosting, database produksi, atau data portofolio pada Fase 2.

## Yang dibersihkan

Tidak ditemukan import dari `app/`, `lib/`, `worker/`, atau skrip runtime ke kandidat template berikut:

| Kelompok | File | Byte source |
| --- | ---: | ---: |
| `components/` (termasuk 61 komponen UI dan connector-error yang tidak dipakai) | 62 | 214.987 |
| `hooks/use-mobile.ts` (pemakai hanya sidebar template) | 1 | 565 |
| Contoh `examples/d1/` | 2 | 2.070 |
| **Total** | **65** | **217.622** |

`.gitignore` diperketat untuk cache/build tambahan, log, file sementara, private key/service-account, SQLite sidecar dan arsip lokal. `AGENTS.md` diberi peta arsitektur, pembatasan pembacaan katalog/aset untuk AI, aturan privasi, serta aturan perubahan bertahap.

Logo, font, katalog, migrasi lama, dependensi/lockfile, integrasi Worker/Sites, dan alur kompatibilitas akun tetap dipertahankan. Backup HTML pribadi di luar repositori tidak dihapus atau diunggah. Belum ada pemecahan modul atau penggabungan stylesheet pada fase ini.

## Bukti perlindungan source aktif

1.112 file aktif/config dipindai sebelum dan sesudah pembersihan: seluruh `app/`, `lib/`, `public/`, `db/`, `drizzle/`, `worker/`, `vendor/`, package/lockfile, konfigurasi build, `.env.example`, dan `.openai/hosting.json`.

SHA-256 gabungan identik sebelum dan sesudah:

`e149e878fab207704b7b8964b2c716abad9b4586750dfac25b1fc313717e8884`

Hash dihitung dari urutan path tersortir, diikuti byte setiap file. Ini mencakup Firebase Web Config, identitas proyek Firebase, binding D1, alamat canonical/alias lama, logo, rumus keuangan dan backup JSON. Tidak ada perubahan pada 1.112 file tersebut.

## Verifikasi dan batasnya

- TypeScript `--noEmit --incremental false`: lulus sebelum dan sesudah pembersihan.
- Build produksi: lulus sebelum dan sesudah pembersihan; daftar route tetap sama.
- Worker lokal: landing, login, demo, dan halaman reset merespons HTTP 200; state/admin/harga berproteksi merespons 401 tanpa sesi; logo/favicon/katalog tersedia. Script inline pada halaman yang diperiksa berhasil diparse.
- Regresi inti: kalkulasi modal/profit/sale, backup/impor JSON, pemisahan data, cache harga, demo, katalog IHSG/saham/kripto, emas, tema, profil, logo, serta verifikasi token dan penghubungan akun Google diuji memakai fixture/sesi sintetis.
- Beberapa tes upstream masih mengharapkan shell berupa satu literal JSON dan import Node tanpa ekstensi. Baseline langsung sudah memiliki kegagalan ini sebelum file template dihapus. Untuk memeriksa perilaku HTML yang benar-benar dihasilkan modul, adapter fixture **lokal saja** merangkai HTML aktual dan menyajikannya dalam format fixture lama. Tidak ada assertion tes yang dihapus atau diubah.
- Dengan adapter lokal tersebut, **20 dari 25** skrip offline lulus. Lima tes masih memerlukan penyesuaian terhadap upstream: `test-fast-login.mjs` (minimum sandi 8 vs harapan lama 12), `test-login-experience.mjs` (pencocokan teks callback), `test-mobile-login.mjs` (batas ekstraksi fungsi), `test-password-reset.mjs` (lingkungan `cloudflare:`), dan `test-recovery-otp-ui.mjs` (versi/struktur UI pemulihan lama). Masalah ini tidak ditutupi dengan melemahkan assertion atau mengubah auth produksi.
- Adapter dan hasil detail lokal berada di `outputs/phase2/`; bukan source produksi dan tidak diunggah. Penyesuaian permanen loader tes menjadi pekerjaan verifikasi saat Fase 3 disetujui.
- Tidak ada login Google sungguhan, pengiriman email, atau transaksi produksi yang dilakukan untuk uji Fase 2. Pemeriksaan ini tidak menyatakan seluruh tes atau seluruh skenario login nyata sudah lulus.

Fase 3 belum dimulai; tunggu instruksi pengguna berikutnya.
