# Domain utama dan SEO Sidaps

Domain resmi: **https://sidaps.online**.

## Pengalihan

- `lib/canonical-url.ts`: host yang berakhiran `.workers.dev` (termasuk trailing DNS dot) → domain utama HTTPS, status 301, pathname/query tetap. Alamat utama HTTP/dotted dinormalisasi. Localhost, loopback dan host lain tidak diarahkan; URL dengan suffix penyerang atau header forwarded palsu tidak dipercaya.
- `worker/index.ts`: redirect terjadi sebelum akses connector/session/database dan sebelum framework. Berlaku juga untuk API, reset password, serta permintaan aset yang mencapai Worker ini. Perubahan ini tidak mengendalikan Worker lain di akun orang lain.
- `app/route.ts`: fallback aturan yang sama sebelum identitas akun dibaca.
- `vite.config.ts`: `assets.run_worker_first: true` dan binding ASSETS memastikan aset juga melewati pemeriksaan host. Pada host utama/lokal, file statis tetap dilayani binding aset tanpa memulai autentikasi. Ini sengaja membuat permintaan aset melewati Worker untuk memenuhi aturan semua request. [Dokumentasi Cloudflare](https://developers.cloudflare.com/workers/static-assets/binding/).
- Redirect memakai `Cache-Control: no-store` karena query dapat memuat bukti pemulihan satu kali; status HTTP tetap 301.
- Tombol utama landing, demo, kembali beranda, bantuan login dan tautan developer menuju domain utama. API dan aset internal tetap menggunakan path relatif; tautan anchor panduan/FAQ tetap berada pada halaman yang sama. SDK memiliki fallback host yang sejalan dengan server.

## Identitas SEO

- `lib/site-seo.ts`: title/deskripsi publik dan JSON-LD WebSite + SoftwareApplication. Keduanya memakai nama Sidaps, alternateName Sidaps Portfolio, URL resmi. Tidak memuat akun, harga ilustrasi, rating atau ulasan buatan.
- `lib/landing/head.ts`: title/deskripsi, canonical, Open Graph, robots index/follow dan JSON-LD.
- `app/layout.tsx`: metadata dasar memakai konstanta yang sama untuk konsistensi.
- `public/robots.txt`: mengizinkan crawling beranda, menunjuk sitemap resmi; API dan reset tidak dirayapi. Ini bukan pengganti autentikasi.
- `public/sitemap.xml`: URL canonical beranda dan artikel publik yang tersedia. Fitur, panduan interaktif, privasi dan FAQ berupa bagian/anchor beranda, bukan halaman terpisah. URL login, demo, query duplikat, reset dan data privat tidak dimasukkan. Tambahkan URL hanya setelah halaman publik terpisah benar-benar tersedia.
- Respons login/demo/reset/portofolio privat mendapat X-Robots-Tag noindex/follow; landing publik tetap indexable.

WebSite structured data memberi Google preferensi nama situs; sitemap mencantumkan URL canonical yang ingin diindeks. Ini tidak menjamin posisi atau waktu indeks. Setelah versi tayang, sitemap dapat dikirim melalui Google Search Console dan beranda dimintakan crawl ulang. [Nama situs Google](https://developers.google.com/search/docs/appearance/site-names), [panduan sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Pemeriksaan

`npm test` mencakup aturan host/301, path/query, loop/localhost/spoofing, entry Worker sebelum binding, serving aset, fallback SDK, tautan CTA, canonical/Open Graph, parsing JSON-LD serta robots/sitemap. `npm run verify:project`, TypeScript dan build tetap wajib. Uji HTTP hasil build memastikan content type XML/text, redirect dan halaman utama tidak loop.

Tidak mengubah project/config Firebase, provider, DNS, D1 ID, migrasi, format backup, session cookie, data akun atau cabang pengaman. Login pada domain utama tetap memerlukan Authorized Domains Firebase yang sesuai; commit source tidak menambahkan izin Console tersebut. Periksa layanan nyata sebelum menyatakan OAuth siap.

Pemeriksaan publik ulang saat pengerjaan ini: endpoint konfigurasi Firebase merespons 200 dan kini mencantumkan `sidaps.online` sebagai Authorized Domain. Tidak dilakukan OAuth akun nyata atau perubahan Console. Temuan domain belum diizinkan pada laporan Fase 4 adalah keadaan pemeriksaan sebelumnya.

Hasil validasi patch: TypeScript/build lulus, 25/25 tes offline lulus, verifikasi 70 referensi aset/sintaks lulus. HTTP build lokal dengan Host Workers lama membuktikan 301 pada login/reset/API/robots/sitemap/favicon dan path/query tetap. Host localhost memberi 200 untuk beranda dan file SEO dengan content type XML/text yang benar, noindex pada login/demo/reset, serta 401 pada state tanpa sesi. Sitemap XML juga berhasil diparse sebagai dokumen XML.

Commit/push main mengikuti pipeline hosting GitHub yang sudah ada. Keberhasilan build lokal/source push harus dibedakan dari bukti deployment produksi; cek status/Location dari alamat lama dan robots/sitemap pada domain utama setelah pipeline selesai.

## Penguatan merek Indonesia — 22 November 2026

- Landing aktif sekarang `lib/landing-wealth-html.ts`, dirangkai `lib/landing-html.ts`. `lib/landing/head.ts` lama tetap memakai metadata bersama, tetapi bukan body beranda aktif.
- Title: **Sidaps Portfolio — Catatan Investasi Saham, Kripto & Emas**. Deskripsi menjelaskan aplikasi untuk pengguna Indonesia; tidak mengulang kata kunci secara berlebihan.
- Open Graph memakai nama merek Sidaps, locale `id_ID`, canonical resmi, dan gambar showcase yang memang tersedia. Kartu berbagi menyebut gambar sebagai contoh dashboard; tidak menampilkan data pribadi. Metadata layout selaras.
- WebSite dan SoftwareApplication memakai identitas Sidaps/Sidaps Portfolio, bahasa `id-ID`, kategori FinanceApplication, negara dukungan ID, serta daftar fungsi aktual. Tidak menambahkan rating, ulasan, sertifikasi, identitas perusahaan legal atau harga layanan yang tidak diverifikasi. JSON-LD membantu pengenalan entitas, bukan bukti sertifikasi resmi Google dan bukan jaminan rich result/ranking.
- H1 aktif: **Sidaps, catatan investasimu. Saham, kripto, dan emas.** Paragraf pembuka menyebut pengguna Indonesia dan fungsi pencatatan. H2 memperjelas ringkasan portofolio, cara mencatat aset, serta modal/profit-loss. Heading pembuka animasi menjadi H2 dengan gaya visual yang sama agar dokumen hanya mempunyai satu H1 utama.
- Artikel publik: `/blog/cara-mencatat-portofolio-investasi`. Isi dan meta di `lib/content/portfolio-guide.ts` (841 kata), template di `lib/blog-html.ts`, route publik tersendiri, CSS ringkas tanpa JavaScript/SDK atau akses akun. Artikel ditautkan dari footer dan sitemap. Tidak mengubah transaksi, autentikasi, config Firebase, D1 atau data pengguna.
- Meta artikel: **Cara Mencatat Portofolio Saham, Kripto & Emas | Sidaps**. Deskripsi: **Panduan pemula mencatat portofolio saham, kripto, dan emas: hitung modal, nilai aset, serta profit/loss dengan rapi bersama Sidaps.**

### Langkah eksternal setelah publikasi

1. Di Google Search Console, gunakan properti `sidaps.online` yang telah diverifikasi pemiliknya; kirim `https://sidaps.online/sitemap.xml`, periksa URL beranda/artikel, lalu minta pengindeksan bila diperlukan. Jangan membuat verifikasi DNS/token tanpa izin atau menyatakan sudah terindeks hanya karena URL 200.
2. Pantau kueri `sidaps` dan `sidaps portfolio`, impresi, klik, CTR dan posisi rata-rata untuk Indonesia melalui laporan Performance. Belum ada baseline Search Console yang diakses pada tugas ini; posisi pengguna bukan hasil audit peringkat independen.
3. Saat Instagram dibuat, gunakan nama tampilan **Sidaps Portfolio**, logo asli dan tautan `https://sidaps.online`. Jelaskan fungsi catatan saham/kripto/emas dalam bio, lalu bagikan tutorial dan tautan artikel yang relevan. Jangan menambahkan `sameAs` atau URL Instagram rekaan sebelum akun resmi tersedia.
4. Terbitkan konten berguna yang akurat secara bertahap; hindari tautan berbayar/spam dan janji keuntungan. Tidak ada jaminan peringkat 1–2 atau waktu pengindeksan tertentu.

Rujukan: [nama situs Google](https://developers.google.com/search/docs/appearance/site-names), [title links](https://developers.google.com/search/docs/appearance/title-link), [SoftwareApplication](https://developers.google.com/search/docs/appearance/structured-data/software-app). Google menggunakan lebih dari metadata dan dapat menulis ulang title/snippet; SoftwareApplication rich results juga memerlukan properti tambahan seperti rating/ulasan asli. Jangan mengarangnya demi kelulusan alat rich results.

Validasi 22 November: 28/28 tes offline, TypeScript, build dan verifikasi aset/sintaks lulus. HTTP build lokal: beranda, artikel, sitemap XML dan CSS 200. Browser: artikel diuji pada 320/390/430/1440px, tanpa overflow horizontal; Hero diperiksa pada 390px. Tidak ada OAuth nyata, perubahan DNS/Firebase atau akses akun pribadi.

## Identitas merek dan audit lanjutan — 22 November 2026

- Pemeriksaan HTTP publik: beranda/artikel/robots/sitemap 200; beranda untuk User-Agent Googlebot 200 tanpa `noindex`; HTTP serta host Workers lama 301 ke canonical; URL acak 404. Tidak ditemukan blok crawling pada pemeriksaan ini. Ini bukan bukti hasil indeks atau laporan Search Console. Host `www.sidaps.online` belum mempunyai resolusi DNS; alamat resmi non-www berfungsi. DNS tidak diubah pada tugas ini.
- Search Console belum berhasil diakses. Pemeriksaan Chrome sebelumnya menunjukkan hasil dipersonalisasi dengan konteks lokasi Sri Lanka, sehingga pengamatan tersebut bukan ukuran ranking pengguna Indonesia. Jangan mengklaim peringkat global atau kenaikan ranking dari source push.
- Nama pilihan konsisten sekarang **Sidaps Portfolio**, alias **Sidaps**, di WebSite, SoftwareApplication, Open Graph dan H1. Title sebelumnya tetap dipertahankan. Pemilihan nama lengkap membedakan produk secara alami dari merek lain yang memakai nama pendek sama.
- `/tentang-sidaps` adalah AboutPage publik yang menjelaskan tujuan, aset, cara membaca nilai, demo dan batas fungsi pencatatan. Tautan berasal dari FAQ/footer beranda dan atribusi artikel; sitemap memuat URL tersebut. AboutPage dan SoftwareApplication memakai entity ID yang sama lintas halaman. Konten HTML tersedia tanpa JavaScript atau login.
- Tidak membuat ulasan, rating, sertifikasi atau akun sosial rekaan; tidak membuat halaman kata kunci massal, membeli backlink, memanipulasi klik, mengubah lokasi Google pengguna, atau menghubungkan merek dengan perusahaan lain. Tidak mengubah backend akun, Firebase, session, D1 atau transaksi.
- Minta recrawl melalui Search Console hanya setelah akses properti terverifikasi tersedia. Perubahan ini membantu menjelaskan identitas situs; bukan cara mengunci urutan hasil Google atau mengganti Ringkasan AI secara langsung.

Verifikasi penguatan identitas: 28/28 tes offline, TypeScript, build dan 78 referensi aset/sintaks lulus. Halaman About diperiksa pada 320/390/1440px tanpa overflow. Tidak ada perubahan pada source autentikasi, konfigurasi Firebase/D1, rumus atau data akun.
