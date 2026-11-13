# Portfolio summary calculations

## Current asset profit/loss

The **PROFIT / LOSS ASET** card shows the difference between the displayed current asset value and displayed remaining capital:

`current asset value − remaining asset capital`

Both displayed amounts are rounded to whole rupiah before taking the difference, matching the values the user can see. The number, gain/loss color, and summary caption use this same result and update when quotes change.

For example, a current value of Rp28.864.174 and remaining capital of Rp30.099.500 produce **−Rp1.235.326**. A recorded realized sale gain of Rp680.000 does not offset this card. Sale profit/loss is displayed separately and is still preserved in the transaction history.

## Realized sales

The **PROFIT / LOSS PENJUALAN** panel is a separate panel below the asset summary cards. It shows net sale proceeds, released cost basis, sale count, and realized profit/loss: `displayed net sale proceeds − displayed released cost basis`. Totals are rounded to whole rupiah before taking the difference. Only records created as tracked sales (`trade: sell`) contribute; ordinary withdrawals do not. Archived assets' sales remain included.

Tracked sales record their net proceeds, proportional released cost basis, quantity change, and realized profit/loss. This display change does not rewrite earlier sales or infer a different cost basis. Total lifetime return including realized and unrealized results is a different measure from the current-asset card. All monetary fields and outcome captions respect balance privacy.

## New accounts

New cloud accounts start with no transactions, zero units, and zero capital/value/profit. There is no owner portfolio copied to the account. The first purchase increases units and capital by the entered total cost. Current value uses the available unit price times remaining units, with recorded value as fallback when a quote is unavailable.

For each sale, released cost basis is `remaining capital before sale × units sold ÷ units held before sale`. Remaining capital falls by that released basis; realized profit/loss is `net proceeds − released basis`. A later purchase increases remaining capital and units, so the next sale uses the updated average basis. Full sale leaves zero current units/capital/value while retaining realized results in the separate panel.

Example: buy 100 units for Rp500.000; sell 40 for net Rp260.000. Released basis is Rp200.000, remaining capital Rp300.000, and realized gain Rp60.000. At a Rp6.000 quote, 60 remaining units are worth Rp360.000 and have a separate unrealized gain Rp60.000.

## Validation

`node scripts/tests/test-portfolio-summary.mjs` checks screenshot arithmetic, separate sale totals, live quotes, colors, privacy, unchanged records, whole-rupiah consistency, and first-time cloud accounts through purchase, partial sale, repurchase, full sale, archive, account reload, and deletion. Ordinary withdrawals are excluded from realized sales.
