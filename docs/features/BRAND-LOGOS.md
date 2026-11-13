# Brand logos and exchange-neutral asset labels

Updated 13 November 2026.

- 839 stock SVGs are served locally from `public/logos/stocks/`. Symbol-to-logo IDs come from the [TradingView Indonesia scanner](https://scanner.tradingview.com/indonesia/scan); exact image URLs are recorded in `public/logos/sources.json`.
- Platform icons are stored locally under `public/logos/platforms/`. Favicons were retrieved for known official app/provider domains, including domains in the [CFX member directory](https://www.cfx.co.id/en/exchanges-and-participants/members). Bank labels use their corresponding stock issuer logos. The manifest currently maps 64 platform values, including aliases, to images.
- Unknown platforms, custom user names, or unavailable images retain a clearly readable initials fallback. Initials are not represented as an official logo. Brands/images belong to their respective owners; no affiliation is implied.
- Transaction, purchase and sale dropdowns display platform icons. Previously used values show a `Riwayat` badge, while the existing selection check marks the current choice. History means the account recorded that platform previously; it is not a claim that units remain held there.
- Transaction-history platform cells show the same icon. Initials use CSS-generated content, so mobile record summaries do not acquire duplicate text.
- Crypto labels display BTC, ETH, SOL, etc. without an exchange suffix. Internal keys such as `BTC INDODAX`, exact price pair IDs, user-entered transaction descriptions, platform values and quote-source disclosures remain unchanged. The native asset selector submits the original stored key even when its visible label is neutral.
- No accounts, holdings, price logic, database schema or authentication configuration are changed.

`public/brand-logos.js` loads before the application shell. `public/brand-ui.js` adds platform images and the existing custom selector uses that renderer. Stock images are lazy-loaded only when their items are rendered; the complete image library is not requested at startup. `scripts/tests/test-brand-display.mjs` checks the manifest, safe SVG content and legacy-key preservation.

## Pembaruan logo dan kadar emas — 13 November 2026

Pilihan Aset dalam formulir transaksi kini menggunakan logo saham, kripto dan ikon kadar emas yang sama dengan kartu. Dropdown aset tetap mengirim identitas tersimpan yang asli.

Logo sekuritas tambahan diambil dari [direktori Indonesia SIPF](https://indonesiasipf.co.id/anggota-dpp) berdasarkan kode broker, disimpan lokal dan dirapikan margin gambarnya. Manifest kini mencakup 130 nilai platform/alias. Nama custom BIBIK tidak dipetakan ke Bibit: BIBIK memakai inisial, sementara BIBIT memakai logonya sendiri. Tidak ada penggantian nama transaksi lama atau penyamaan platform custom secara otomatis.
