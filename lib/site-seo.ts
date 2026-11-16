import { OFFICIAL_PORTFOLIO_ORIGIN } from './canonical-url';

export const SITE_TITLE = 'Sidaps Portfolio — Aplikasi Catatan Investasi Saham, Kripto & Emas';
export const SITE_DESCRIPTION = 'Sidaps Portfolio adalah aplikasi catatan investasi saham, kripto, dan emas. Pantau modal, nilai aset, serta profit/loss portofolio pribadimu.';

// Public product identity only: no account data, invented ratings or market prices.
export const SITE_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': OFFICIAL_PORTFOLIO_ORIGIN + '/#website',
      name: 'Sidaps',
      alternateName: 'Sidaps Portfolio',
      url: OFFICIAL_PORTFOLIO_ORIGIN,
      inLanguage: 'id',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': OFFICIAL_PORTFOLIO_ORIGIN + '/#application',
      name: 'Sidaps',
      alternateName: 'Sidaps Portfolio',
      url: OFFICIAL_PORTFOLIO_ORIGIN,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description: SITE_DESCRIPTION,
    },
  ],
};

export const SITE_JSON_LD = JSON.stringify(SITE_STRUCTURED_DATA).replaceAll('<', '\\u003c');
