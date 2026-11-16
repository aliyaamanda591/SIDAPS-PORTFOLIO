import { SITE_TITLE, SITE_DESCRIPTION, SITE_JSON_LD } from '../site-seo';

export const landingHeadHtml = `<!doctype html><html id="sidaps-portfolio" lang="id" data-sidaps-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#263544">
<title>${SITE_TITLE.replaceAll('&', '&amp;')}</title>
<meta name="description" content="${SITE_DESCRIPTION}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://sidaps.online" />
<meta property="og:type" content="website">
<meta property="og:site_name" content="Sidaps Portfolio">
<meta property="og:title" content="${SITE_TITLE.replaceAll('&', '&amp;')}">
<meta property="og:description" content="${SITE_DESCRIPTION}">
<meta property="og:url" content="https://sidaps.online">
<script type="application/ld+json">${SITE_JSON_LD}</script>
<link rel="icon" href="/favicon.svg">
<link rel="stylesheet" href="/landing.css?v=4">
<link rel="stylesheet" href="/market-board.css?v=1">
<link rel="stylesheet" href="/theme.css?v=2">
<link rel="stylesheet" href="/readability.css?v=1">
<link rel="stylesheet" href="/aqua-theme.css?v=1">
<link rel="stylesheet" href="/responsive-system.css?v=1">
<link rel="stylesheet" href="/controls-polish.css?v=1">
<link rel="stylesheet" href="/landing-cinema.css?v=2">
<link rel="stylesheet" href="/demo-mode.css?v=1">
<link rel="stylesheet" href="/emerald-gold.css?v=2">
<link rel="stylesheet" href="/landing-phones.css?v=1">
<style>
html body.landing-page main section.closing.wrap h2{color:#fff7e0!important;-webkit-text-fill-color:#fff7e0!important;background:none!important;text-shadow:0 2px 18px rgba(0,0,0,.35)}
html body.landing-page main section.closing.wrap p{color:#e3e9f0!important}
</style>
</head>
<body class="landing-page">
`;
