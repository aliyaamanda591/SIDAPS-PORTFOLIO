import { OFFICIAL_PORTFOLIO_ORIGIN } from './canonical-url';
import { SITE_NAME, SITE_ALTERNATE_NAME, SITE_ABOUT_URL } from './site-seo';

export const ABOUT_TITLE = 'Tentang Sidaps Portfolio — Aplikasi Catatan Investasi Indonesia';
export const ABOUT_DESCRIPTION = 'Kenali Sidaps Portfolio di sidaps.online: aplikasi catatan saham Indonesia, kripto, dan emas untuk memantau modal, nilai aset, serta profit/loss.';
const structuredData = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': SITE_ABOUT_URL,
  url: SITE_ABOUT_URL,
  name: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  inLanguage: 'id-ID',
  isPartOf: { '@id': OFFICIAL_PORTFOLIO_ORIGIN + '/#website' },
  mainEntity: {
    '@type': 'SoftwareApplication',
    '@id': OFFICIAL_PORTFOLIO_ORIGIN + '/#application',
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAME,
    url: OFFICIAL_PORTFOLIO_ORIGIN,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    inLanguage: 'id-ID',
    countriesSupported: 'ID',
  },
}).replaceAll('<', '\\u003c');

export const aboutHtml = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${ABOUT_TITLE}</title><meta name="description" content="${ABOUT_DESCRIPTION}"><meta name="robots" content="index, follow">
<link rel="canonical" href="${SITE_ABOUT_URL}"><meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}"><meta property="og:locale" content="id_ID">
<meta property="og:title" content="${ABOUT_TITLE}"><meta property="og:description" content="${ABOUT_DESCRIPTION}"><meta property="og:url" content="${SITE_ABOUT_URL}">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${ABOUT_TITLE}"><meta name="twitter:description" content="${ABOUT_DESCRIPTION}">
<link rel="icon" href="/sidaps-mark.svg"><link rel="stylesheet" href="/blog.css?v=1"><script type="application/ld+json">${structuredData}</script></head>
<body><a class="skip" href="#tentang">Langsung ke isi</a><header><a class="brand" href="https://sidaps.online"><img src="/sidaps-mark.svg" width="36" height="36" alt="Logo Sidaps"><span>Sidaps Portfolio</span></a><a class="demo" href="https://sidaps.online/?demo=1">Coba demo</a></header>
<main id="tentang"><article><div class="eyebrow">KENALI SIDAPS</div><h1>Sidaps Portfolio, ruang catatan investasimu.</h1>
<p><strong>Sidaps Portfolio</strong>, juga disebut <strong>Sidaps</strong>, adalah aplikasi catatan investasi saham, kripto, dan emas untuk pengguna di Indonesia. Alamat website Sidaps Portfolio adalah <a href="https://sidaps.online">sidaps.online</a>. Kamu dapat menggunakannya melalui browser di komputer maupun smartphone.</p>
<p>Tujuannya sederhana: membantu memahami modal yang sudah dicatat, aset yang masih dimiliki, dan perubahan nilainya. Catatan dari beberapa platform bisa disusun dalam satu portofolio pribadi agar kamu tidak perlu menghitung ulang semuanya setiap kali ingin melihat posisi investasi.</p>
<h2>Apa yang bisa kamu catat di Sidaps?</h2>
<h3>Saham Indonesia, kripto, dan emas</h3>
<p>Tambahkan aset pilihanmu dari katalog. Catat saham dalam lembar, kripto dalam satuan koin, serta emas berdasarkan gram dan kadar. Setiap aset baru dimulai dari nol unit dan nol modal sampai kamu mengisi catatannya sendiri.</p>
<h3>Pembelian, penjualan, dan hasilnya</h3>
<p>Isi jumlah unit, total pembelian, tanggal, dan platform tempat bertransaksi. Saat menjual, gunakan pencatatan penjualan agar kepemilikan serta modal aset tersisa ikut berkurang. Dashboard memisahkan profit/loss aset yang masih dimiliki dari profit/loss penjualan.</p>
<h2>Bagaimana membaca ringkasan portofolio?</h2>
<p>Nilai aset dihitung dari jumlah kepemilikan dan harga acuan yang tersedia. Profit/loss aset menunjukkan selisih nilai tersebut dengan modal aset tersisa. Harga bisa tertunda atau tidak tersedia; periksa sumber, waktu pembaruan, dan keterangan harga pada setiap aset.</p>
<p>Grafik IHSG memberi konteks pasar saham Indonesia. Komposisi aset membantu melihat porsi kepemilikan, sedangkan riwayat transaksi membantu menelusuri catatan pembelian dan penjualan. Angka pada demo dan ilustrasi tidak menggambarkan akun pribadi pengguna.</p>
<h2>Mulai dari demo, lalu buat catatanmu sendiri</h2>
<p>Kamu dapat membuka <a href="https://sidaps.online/?demo=1">demo Sidaps tanpa mendaftar</a> untuk mencoba dari portofolio kosong. Perubahan pada demo tidak disimpan ketika halaman dimuat ulang. Setelah memahami alurnya, gunakan <a href="https://sidaps.online/?login=1">akun pribadi</a> untuk mencatat aset milikmu.</p>
<p>Fitur sembunyikan saldo membantu menjaga nominal dari pandangan orang di sekitar. Backup JSON menyediakan salinan catatan yang bisa kamu simpan sendiri. Cocokkan catatan secara berkala dengan bukti transaksi dari platform yang digunakan.</p>
<h2>Pencatatan yang jelas, keputusan tetap di tanganmu</h2>
<p>Sidaps Portfolio merupakan alat bantu pencatatan, bukan tempat mengeksekusi pembelian atau penjualan investasi. Transaksi tetap dilakukan melalui platform pilihanmu. Estimasi nilai dan profit/loss bukan jaminan keuntungan atau harga yang pasti diterima ketika menjual.</p>
<p>Untuk contoh perhitungan dan langkah awal, baca <a href="/blog/cara-mencatat-portofolio-investasi">panduan mencatat dan memantau portofolio saham, kripto, dan emas</a>. Mulai dari satu aset, periksa unit dan modalnya, lalu lanjutkan dengan kebiasaan mencatat yang konsisten.</p>
</article></main><footer><a href="https://sidaps.online">Kembali ke Sidaps Portfolio</a><p>Catatan investasi saham Indonesia, kripto, dan emas.</p></footer></body></html>`;
