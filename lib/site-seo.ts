import { OFFICIAL_PORTFOLIO_ORIGIN } from './canonical-url';

export const SITE_TITLE = 'Sidaps Portfolio — Catatan Investasi Saham, Kripto & Emas';
export const SITE_DESCRIPTION = 'Sidaps adalah aplikasi catatan investasi untuk pengguna Indonesia. Pantau portofolio saham, kripto, dan emas, modal, nilai aset, serta profit/loss di satu tempat.';
export const SITE_IMAGE = OFFICIAL_PORTFOLIO_ORIGIN + '/landing-phones/showcase-original.png';
export const SITE_IMAGE_ALT = 'Contoh dashboard Sidaps Portfolio dalam mode terang dan gelap, bukan data akun pengguna';
export const SITE_NAME = 'Sidaps Portfolio';
export const SITE_ALTERNATE_NAME = 'Sidaps';
export const SITE_ABOUT_URL = OFFICIAL_PORTFOLIO_ORIGIN + '/tentang-sidaps';

// Public product identity only: no account data, invented ratings or market prices.
export const SITE_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': OFFICIAL_PORTFOLIO_ORIGIN + '/#website',
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
      url: OFFICIAL_PORTFOLIO_ORIGIN,
      inLanguage: 'id-ID',
      about: { '@id': OFFICIAL_PORTFOLIO_ORIGIN + '/#application' },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': OFFICIAL_PORTFOLIO_ORIGIN + '/#application',
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
      url: OFFICIAL_PORTFOLIO_ORIGIN,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description: SITE_DESCRIPTION,
      inLanguage: 'id-ID',
      countriesSupported: 'ID',
      browserRequirements: 'Memerlukan browser web modern dan koneksi internet.',
      image: SITE_IMAGE,
      subjectOf: { '@type': 'AboutPage', '@id': SITE_ABOUT_URL, url: SITE_ABOUT_URL },
      featureList: [
        'Pencatatan portofolio saham Indonesia, kripto, dan emas',
        'Ringkasan modal, nilai aset, dan profit/loss',
        'Riwayat pembelian dan penjualan yang dicatat pengguna',
        'Demo tanpa pendaftaran dan backup JSON',
      ],
    },
  ],
};

export const SITE_JSON_LD = JSON.stringify(SITE_STRUCTURED_DATA).replaceAll('<', '\\u003c');
