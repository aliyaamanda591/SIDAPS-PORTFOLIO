# Platform recording catalog

The base catalog was checked 8 November 2026. On 13 November 2026, eight named stock applications were added, for 168 categorized choices shared by the transaction, purchase, and sale forms.

- Securities company names/codes: https://web.ksei.co.id/services/participants/brokers?setLocale=id-ID
- Mutual-fund selling agents: https://web.ksei.co.id/services/participants/mutual-agents?setLocale=id-ID
- Crypto brands: https://www.cfx.co.id/en/exchanges-and-participants/members (pages 1–3), https://www.tokocrypto.com/
- Retail names/products: https://bibit.id/, https://www.bareksa.com/, https://www.indopremier.com/, https://pegadaian.co.id/tring/beli-emas, https://www.logammulia.com/id/pages/how-to-buy, https://www.lakuemas.com/

These are recording choices, not investment recommendations or a live licensing registry. Categories are for navigation; multi-asset providers can be used with any supported asset. The catalog cannot guarantee every provider or local shop is listed. The custom-name option handles other platforms without a code change.

New accounts have no preselected platform. Buy/sell suggestions come only from that account's latest transaction for the same asset. Legacy values such as GROWIN, BIBIK, and INDODAX are preserved in existing records. A user's historical custom names appear only in their own list. Custom values are trimmed, limited to 100 characters, escaped for display, and stored in the existing account-owned transaction data; there is no global user-platform registry or schema migration.

## Asset catalog and crypto pricing

The asset picker includes a checked snapshot of 438 IDR pairs from https://indodax.com/api/pairs and 843 four-letter BEI stock codes (TradingView Indonesia stock scan plus retained supported codes). Search and type filters keep the initial result list bounded. Custom four-letter BEI codes remain supported.

Indodax's public API documentation: https://github.com/btcid/indodax-official-api-docs/blob/master/Public-RestAPI.md . Crypto prices use a single https://indodax.com/api/tickers request per refresh, with authenticated same-origin proxies in the hosted app and a five-minute server cache. This reads public market prices and does not connect to a user's trading account. New coins retain the exact Indodax ticker ID, including aliases whose display symbol differs from the pair ID. Invalid, missing, non-IDR, or stale quotes cannot overwrite cached prices. CoinGecko's multi-ID simple-price endpoint is the fallback for coins with a verified CoinGecko ID from the Indodax pairs response. Its source and difference from Indodax are explicitly disclosed. Historical BTC names/symbols and transactions are preserved; new crypto cards use a distinct `CODE INDODAX` name so they cannot collide with four-letter stock codes.

Crypto logos use the corresponding official Indodax image URL with a symbol fallback. New cards start with zero holdings/capital. Fractional crypto purchases and sales use the existing portfolio accounting and remain account-owned.

Local integration verification: Indodax returns HTTP 403 to the Worker runtime while its public endpoint works from Node. The authenticated CoinGecko fallback returned real IDR quotes for BTC, ETH, and SOL after adding the descriptive application User-Agent requested by CoinGecko. If a coin has no fallback ID and Indodax is unavailable, it keeps its previous quote or reports price unavailable; no substitute price is invented. This limitation does not affect manually recorded holdings/transactions.


## Stock application names added 13 November 2026

Existing broker/platform values and historical user records are retained. Aplikasi saham groups recognizable app names; broker choices remain available separately. The direct Platform lain button opens the existing per-account custom-name field.

| Application | Provider reference |
| --- | --- |
| BIONS | [BNI Sekuritas](https://www.bions.id/pages/detail/1/produk) |
| HOTS | [Mirae Asset Sekuritas](https://sekuritas.miraeasset.co.id/id/hots) |
| MotionTrade | [MNC Sekuritas](https://www.mncsekuritas.id/pages/online-trading/en/) |
| BRIGHTS | [BRI Danareksa Sekuritas](https://www.brights.id/id/produk-dan-layanan) |
| SimInvest | [Official support](https://help.siminvest.id/cara-menghubungi-siminvest/) |
| BEST | [BCA Sekuritas](https://webcrp.lnc.bcasekuritas.co.id/help/faq/bagaimana-cara-pembukaan-rekening-bcas-1) |
| POEMS | [Phillip official user guide](https://www.poems.web.id/htm/download/poems_user_guide.pdf) |
| RHB TradeSmart | [RHB Sekuritas](https://www.rhbtradesmart.co.id/faq) |

These are labels for recording transactions, including legacy products; no broker connection is created. Availability/branding can change independently.

## Exchange-neutral display and logos

Crypto exchange suffixes are hidden in asset labels while their legacy storage keys and pricing remain intact. See [Brand logos](BRAND-LOGOS.md) for local stock/platform images, source provenance and fallbacks.
