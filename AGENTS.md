# Sidaps Portfolio — panduan kerja AI

## Aturan utama

- Domain publik pengguna: `sidaps.online`. Pertahankan domain, DNS, Authorized Domains Firebase, cookie, dan alamat alias lama sampai ada perubahan migrasi yang memang diminta dan diverifikasi.
- Simpan perubahan website yang sudah selesai ke `https://github.com/aliyaamanda591/SIDAPS-PORTFOLIO`. Ambil perubahan remote sebelum memperbarui; jangan force-push.
- Kerjakan per fase sesuai instruksi pengguna. Setelah satu fase dilaporkan, tunggu "Lanjut". Jangan memulai refactor atau deployment hanya karena sedang membersihkan repositori.
- Jangan menyalin seluruh source lokal lama ke main: source kerja dan main dapat berbeda. Periksa diff, import, dan identitas proyek sebelum sinkronisasi.
- Branch `safety/firebase-wip-2026-11-16` menyimpan pekerjaan Firebase yang belum selesai (commit `4e18ef5`). Branch itu arsip pengaman, bukan implementasi yang sudah digabung ke main atau siap deploy.

## Peta arsitektur

- Teknologi: TypeScript, Vinext/Vite, route handler bergaya Next.js, Cloudflare Worker dan D1.
- `app/route.ts`: memilih landing, login, demo, atau portofolio; `app/api/`: auth, state, admin, dan harga.
- `lib/{landing,login,portfolio}-html.ts`: perangkai string HTML. Isi halaman berada di `lib/landing/`, `lib/login/`, `lib/portfolio/`. Urutan concatenation dan scope script browser penting.
- `lib/auth/`, `lib/firebase-auth.ts`, `lib/firebase-google.ts`, `lib/identity.ts`: autentikasi dan sesi. Main saat Fase 2 masih memiliki jalur kompatibilitas lama; jangan menghapusnya hanya berdasarkan nama.
- `lib/account-store.ts`, `lib/state-validation.ts`, `lib/financial-validation.js`: kepemilikan data, revisi, validasi dan perhitungan transaksi.
- `lib/market-board.ts`, `lib/retail-gold.ts`, `app/api/prices/`: sumber harga IHSG, saham, kripto, dan emas.
- `public/`: modul browser, stylesheet, logo dan aset. `scripts/tests/`: regresi; `scripts/fixtures/`: data sintetis, bukan data produksi.
- `db/`, `drizzle/`, `worker/`, `.openai/hosting.json`, `scripts/vite/`, `scripts/connector-preview/`: penyimpanan, migrasi dan integrasi hosting/build.

## Keamanan dan kompatibilitas

- Jangan unggah `.env`, `.dev.vars`, service-account/private key, database, token, atau backup portofolio pribadi. `.env.example` hanya berisi contoh aman.
- Firebase Web Config publik berada di `lib/firebase-web-config.json` pada main. Jangan menggantinya dengan config dari branch pengaman tanpa meninjau keseluruhan alur autentikasinya.
- Jangan mengganti proyek Firebase, ID database D1, `.openai/hosting.json`, atau `OWNER_EMAIL` demi pembersihan. Web Config bukan service-account credential.
- Setiap akun hanya boleh membaca/menulis portofolionya sendiri. UI admin/developer hanya mengelola metadata dan bantuan, bukan catatan keuangan orang lain.
- Pertahankan akun, holdings, revisi, format backup JSON, kunci storage lama, logo, dan nama migrasi yang sudah diterapkan. Jangan mengubah kata `denny_` atau nama hosting lama secara massal.
- Jangan mengklaim provider/domain terhubung atau email terkirim sebelum konfigurasi/hasil sebenarnya diperiksa.

## Hemat konteks — jangan dibaca massal

- Mulai dengan `rg --files` dan `rg -n` pada fitur terkait; baca bagian kecil, bukan semua file.
- Abaikan secara default: `node_modules/`, `.git/`, `dist/`, `.next/`, `.vinext/`, `.wrangler/`, `.sites-runtime/`, `outputs/`, `coverage/`, cache, dan arsip.
- Jangan memuat seluruh `public/logos/`, `public/shell-assets/`, `public/logos/sources.json`, font, SVG, PNG, atau katalog hanya untuk memperbaiki tampilan.
- Baca katalog hanya jika tugas membutuhkan: `lib/market-catalog.ts`, `public/market-catalog.json`, `lib/portfolio/scripts/catalog-*.ts`, `lib/portfolio/scripts/platform-catalog.ts`, `public/brand-logos.js`. Cari kode aset/platform yang relevan dahulu.
- `package-lock.json` wajib dipertahankan, tetapi jangan dibaca rutin. Baca hanya bagian yang dibutuhkan saat dependensi berubah.
- File besar belum tentu sampah. Jangan menghapus aset/data yang diminta pengguna atau menulis ulang modul lain di luar lingkup tugas.

## Verifikasi

- Gunakan database lokal terpisah dan data sintetis; jangan arahkan skrip pembelian, registrasi atau reset sandi ke produksi.
- Beberapa pengujian lama masih menganggap shell HTML berupa satu literal JSON. Bedakan kegagalan loader/fixture lama dari regresi aplikasi; jangan melemahkan assertion agar tampak lulus.
- Jalankan build/typecheck dan regresi yang relevan. Saat mengubah struktur halaman berikutnya, perbarui loader tes beserta referensi import secara terkontrol.
- Pertahankan nama route dan field data; pakai nama deskriptif sesuai modul yang ada. Jangan mengganti nama proyek/domain/storage tanpa kebutuhan fitur yang jelas.
