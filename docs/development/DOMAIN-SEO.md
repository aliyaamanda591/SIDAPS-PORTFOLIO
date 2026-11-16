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
- `public/sitemap.xml`: hanya URL canonical beranda. Fitur, panduan, privasi dan FAQ saat ini berupa bagian/anchor beranda, bukan halaman terpisah. URL login, demo, query duplikat, reset dan data privat tidak dimasukkan. Tambahkan URL hanya setelah halaman publik terpisah benar-benar tersedia.
- Respons login/demo/reset/portofolio privat mendapat X-Robots-Tag noindex/follow; landing publik tetap indexable.

WebSite structured data memberi Google preferensi nama situs; sitemap mencantumkan URL canonical yang ingin diindeks. Ini tidak menjamin posisi atau waktu indeks. Setelah versi tayang, sitemap dapat dikirim melalui Google Search Console dan beranda dimintakan crawl ulang. [Nama situs Google](https://developers.google.com/search/docs/appearance/site-names), [panduan sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Pemeriksaan

`npm test` mencakup aturan host/301, path/query, loop/localhost/spoofing, entry Worker sebelum binding, serving aset, fallback SDK, tautan CTA, canonical/Open Graph, parsing JSON-LD serta robots/sitemap. `npm run verify:project`, TypeScript dan build tetap wajib. Uji HTTP hasil build memastikan content type XML/text, redirect dan halaman utama tidak loop.

Tidak mengubah project/config Firebase, provider, DNS, D1 ID, migrasi, format backup, session cookie, data akun atau cabang pengaman. Login pada domain utama tetap memerlukan Authorized Domains Firebase yang sesuai; commit source tidak menambahkan izin Console tersebut. Periksa layanan nyata sebelum menyatakan OAuth siap.

Pemeriksaan publik ulang saat pengerjaan ini: endpoint konfigurasi Firebase merespons 200 dan kini mencantumkan `sidaps.online` sebagai Authorized Domain. Tidak dilakukan OAuth akun nyata atau perubahan Console. Temuan domain belum diizinkan pada laporan Fase 4 adalah keadaan pemeriksaan sebelumnya.

Hasil validasi patch: TypeScript/build lulus, 25/25 tes offline lulus, verifikasi 70 referensi aset/sintaks lulus. HTTP build lokal dengan Host Workers lama membuktikan 301 pada login/reset/API/robots/sitemap/favicon dan path/query tetap. Host localhost memberi 200 untuk beranda dan file SEO dengan content type XML/text yang benar, noindex pada login/demo/reset, serta 401 pada state tanpa sesi. Sitemap XML juga berhasil diparse sebagai dokumen XML.

Commit/push main mengikuti pipeline hosting GitHub yang sudah ada. Keberhasilan build lokal/source push harus dibedakan dari bukti deployment produksi; cek status/Location dari alamat lama dan robots/sitemap pada domain utama setelah pipeline selesai.
