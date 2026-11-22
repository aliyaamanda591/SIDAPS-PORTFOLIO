import { OFFICIAL_PORTFOLIO_ORIGIN } from './canonical-url';
import { SITE_NAME, SITE_ABOUT_URL } from './site-seo';
import { portfolioGuide as article } from './content/portfolio-guide';

const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
export const portfolioGuideUrl = OFFICIAL_PORTFOLIO_ORIGIN + article.slug;
const schema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  '@id': portfolioGuideUrl + '#article',
  headline: article.title,
  description: article.description,
  url: portfolioGuideUrl,
  mainEntityOfPage: portfolioGuideUrl,
  inLanguage: 'id-ID',
  datePublished: article.published + 'T00:00:00+07:00',
  dateModified: article.published + 'T00:00:00+07:00',
  author: { '@type': 'Organization', name: SITE_NAME, url: SITE_ABOUT_URL },
}).replaceAll('<', '\\u003c');

export const blogHtml = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(article.metaTitle)}</title>
<meta name="description" content="${escape(article.description)}">
<meta name="robots" content="index, follow"><link rel="canonical" href="${portfolioGuideUrl}">
<meta property="og:type" content="article"><meta property="og:site_name" content="${SITE_NAME}"><meta property="og:locale" content="id_ID">
<meta property="og:title" content="${escape(article.metaTitle)}"><meta property="og:description" content="${escape(article.description)}"><meta property="og:url" content="${portfolioGuideUrl}">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escape(article.metaTitle)}"><meta name="twitter:description" content="${escape(article.description)}">
<link rel="icon" href="/sidaps-mark.svg"><link rel="stylesheet" href="/blog.css?v=1">
<script type="application/ld+json">${schema}</script></head>
<body><a class="skip" href="#artikel">Langsung ke artikel</a>
<header><a class="brand" href="https://sidaps.online"><img src="/sidaps-mark.svg" alt="Logo Sidaps" width="36" height="36"><span>Sidaps Portfolio</span></a><a class="demo" href="https://sidaps.online/?demo=1">Coba demo</a></header>
<main id="artikel"><article><div class="eyebrow">PANDUAN INVESTASI UNTUK PEMULA</div><h1>${article.title}</h1>
<p class="byline">Oleh <a href="/tentang-sidaps">Sidaps Portfolio</a> · <time datetime="${article.published}">22 November 2026</time> · Edukasi pencatatan</p>
<nav class="toc" aria-label="Daftar isi"><strong>Dalam panduan ini</strong><a href="#modal">Modal dan profit/loss</a><a href="#harga">Sumber harga</a><a href="#sidaps">Mencatat dengan Sidaps</a></nav>
${article.body.replace('<h2>3.', '<h2 id="modal">3.').replace('<h2>5.', '<h2 id="harga">5.').replace('<h2>7.', '<h2 id="sidaps">7.')}
</article></main><footer><a href="https://sidaps.online">Kembali ke Sidaps Portfolio</a><p>Catatan investasi saham, kripto, dan emas untuk pengguna Indonesia.</p></footer></body></html>`;
