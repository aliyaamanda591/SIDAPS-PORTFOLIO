# Portfolio summary calculations

## Current asset profit/loss

The **PROFIT / LOSS ASET** card shows the difference between the displayed current asset value and displayed remaining capital:

`current asset value − remaining asset capital`

Both displayed amounts are rounded to whole rupiah before taking the difference, matching the values the user can see. The number, gain/loss color, and summary caption use this same result and update when quotes change.

For example, a current value of Rp28.864.174 and remaining capital of Rp30.099.500 produce **−Rp1.235.326**. A recorded realized sale gain of Rp680.000 does not offset this card. Sale profit/loss is displayed separately and is still preserved in the transaction history.

## Realized sales

Tracked sales record their proceeds, proportional released cost basis, quantity change, and realized profit/loss. The separate sale figure sums the stored realized results; this display fix does not rewrite earlier sales or infer a different cost basis. Total lifetime return including realized and unrealized results is a different measure from the current-asset card.

## Validation

`node scripts/test-portfolio-summary.mjs` checks the example above, independent realized sale results, live quote changes, gain/loss colors, privacy masking, unchanged records, whole-rupiah consistency, and empty accounts.
