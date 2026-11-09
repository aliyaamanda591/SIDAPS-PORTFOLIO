# Automatic K15 retailer prices

K15 uses the published **buyback price per gram** of 15K jewelry, not a theoretical K24 spot price multiplied by 15/24. Value is `published K15 IDR/gram × grams held`; the existing cost basis and profit formulas use that value. Retailers may quote different prices, so the active source is always displayed.

## Independent sources

1. I Love Emas: https://iloveemas.co.id/harga/ — “Harga Kami Beli”, “Perhiasan Emas”, exact K15 row.
2. Super Emas: https://www.superemas.id/ — buyback table, exact K15 row and table update time.
3. Halo Mas: https://haloemas.co.id/ — “Harga Beli Perhiasan Emas”, exact K15 row. WITA timestamps are converted correctly.

The authenticated server endpoint `/api/prices/gold15` tries these sources in order. A missing/invalid price, changed markup, bad date, HTTP failure, or 2.3-second source deadline triggers the next source. Quotes older than 36 hours cause the remaining sources to be checked. No portfolio amounts, identities, or transactions are sent to any retailer. Requests only use fixed source URLs.

Valid prices are cached for five minutes; concurrent requests share a fetch. If all sources fail, the server retains its last known quote and original timestamp, marked `stale`, while clients also retain their cached quote. Isolate eviction can clear the server cache; client cache still covers returning browsers. With no previous usable quote, the UI says the price is unavailable and keeps the recorded asset value. It never inserts the old Rp1.232.000 fixed reference. Automatic price fetching requires the hosted backend; the standalone local HTML does not provide the server proxy.

Source date and retrieval time are separate. A fallback retailer is identified as “sumber cadangan”. Unavailable/stale updates show “HARGA TERSIMPAN”, rather than claiming a new live quote. Store price updates depend on the retailer; a five-minute fetch does not guarantee the store changes its price every five minutes. A source format change may require a parser update, but failure of one source no longer blocks the other two.

## Verification

- `node scripts/test-retail-gold.mjs`: exact K15 rows, price/date validation, WIB/WITA, cache, three-source failover, stale dates, unchanged last-good timestamps, all-source failure, format changes.
- `node scripts/test-retail-gold.mjs --live`: read and parse all three current public sources.
- `node scripts/test-retail-api.mjs`: with the local server at port 5178, create a local test account and check the authenticated Worker endpoint, real retailer response, cache timestamp, and anonymous access denial.
- Workspace-root `node verify-investasi.cjs`: K15 valuation, fallback-source label, last quote after offline reload, account/privacy and other app regressions.
