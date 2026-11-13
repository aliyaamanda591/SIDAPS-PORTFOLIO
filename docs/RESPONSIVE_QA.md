# Responsive redesign verification

Verified on 13 November 2026 against local disposable portfolio fixtures. No production account, authentication configuration, database schema, or financial record was modified during verification.

## Design

- Black Emerald surfaces, limited Gold accents, and an accessible light appearance.
- Fixed navigation sidebar at 1200px and above; hamburger drawer below 1200px.
- Drawer overlay, close button, Escape handling, focus containment, focus restoration, and inert background.
- Compact two-column summary where space permits; single-column fallback at 320px.
- Existing phone record cards for tables, with desktop tables retained and scrolling contained by wrappers.
- Read-only asset allocation and monthly transaction charts from existing portfolio state. No generated performance/projection values or new market requests.
- Public pages retain a light appearance and do not expose the account theme controls.

## Browser viewport matrix

Each page below was inspected at **320, 360, 375, 390, 414, 430, 768, 1024, and 1440px**, for 72 viewport/page combinations.

| Page | Horizontal page overflow | Visible field overflow |
| --- | --- | --- |
| Landing | None observed | Not applicable |
| Login | None observed | None observed |
| Register | None observed | None observed |
| Password recovery | None observed | None observed |
| Dashboard / insights | None observed | None observed |
| Transactions | None observed | None observed |
| Portfolio / holdings | None observed | None observed |
| Account and settings | None observed | None observed |

Dashboard money values were inspected for clipping using a local fixture with eight-digit rupiah balances. No summary metric clipping was observed at these widths. Chart SVG heights were 220px on phones, 240px on tablets, and 250px on wide desktop.

## Dialog and interaction verification

- Purchase form bounds and visible input sizes checked at 320, 375, 390, 430, 768, 1024, and 1440px. Inputs remained 16px and dialogs stayed inside the viewport.
- Asset picker, sale, holdings adjustment, and profile dialogs checked at 320, 375, 390, 430, 768, and 1440px. No dialog or field escaped the viewport.
- Total dialog/viewport checks: **31**.
- Drawer closes with its close button, Escape, and backdrop; Escape restores focus to the hamburger. Shift+Tab wraps within the drawer. The main content is inert while open and restored afterward.
- Account navigation still opens the existing panels; dialogs were canceled without saving trades or changing profile data.
- Privacy mode removes the allocation values and transaction SVG from the rendered chart panels and replaces them with privacy notices. Restoring visibility redraws the charts.
- Transaction chart period selector changes between 6 and 12 months using existing recorded transactions.
- Existing gain/loss, archived holdings, empty-account, rounding, proportional sale, and authentication behavior regression tests passed.

## Automated checks

- JavaScript syntax checks for account navigation and portfolio insights.
- Responsive CSS parsed using PostCSS.
- TypeScript type check.
- `test-themes.mjs`, `test-fast-login.mjs`, `test-mobile-login.mjs`, `test-landing.mjs`, and `test-portfolio-summary.mjs`.
- Git whitespace validation.

## Scope and limits

Browser checks used Chromium responsive viewport emulation, not physical iOS/Android devices. Native mobile keyboard and OS-specific browser chrome were not simulated. OAuth provider configuration was unchanged.

The current product has no separate Goals page. Analytics is represented by the dashboard insights panels; no unavailable page is reported as tested. Existing source, accounts, storage, authorization, and calculation code are retained.

## Dashboard clarity follow-up (13 November 2026)
- Restored the existing Sidaps SVG mark at every breakpoint.
- Moved original formula, market schedule, KPI explanations and optional Google Sheets settings into a native modal dialog; IDs and event handlers remain intact.
- Condensed realized P/L to an expandable row; its summary mirrors the privacy-masked rendered amount.
- Browser checked exact CSS widths 320, 360, 375, 390, 414, 430, 768, 1024 and 1440: logo visible, no page overflow, dialog within viewport.
- Verified dialog Escape restores focus and privacy masks both original and condensed sale amounts. Financial regression and TypeScript checks, syntax and production build passed.

## Controls and contrast follow-up (13 November 2026)
- Replaced chart-period and transaction-type native dropdowns with grouped buttons that drive the original select values/events.
- Added theme-aware searchable platform/asset selectors, keyboard navigation, Escape and disabled-option handling. Unsupported popover browsers retain native controls.
- Fixed public market-board title contrast; spaced FAQ disclosure cards and standardized table amounts, status badges and destructive actions.
- Chromium checked exact 320/360/375/390/414/430/768/1024/1440 CSS widths for transaction-table overflow, dropdown viewport bounds and landing-market layout.
- Verified mouse and keyboard platform selection, form reset, 12-month chart state, purchase-modal platform changes, light/dark appearance, FAQ expansion. Test fixture only; no financial records added.
- Syntax, TypeScript, theme, fast-login, mobile-login, landing and financial-summary regressions passed. Production build passed.

## Mobile asset scanning follow-up (13 November 2026)
- Assets now use compact disclosure rows on phones (through 760px), showing logo, name, units, current value and P/L. Original financial details and action buttons remain inside the expanded row; only one row opens at a time.
- Six local test assets measured 568px combined at 390px (88px rows with 8px gaps). Desktop retains full cards.
- Chromium checks at exact 320/360/375/390/414/430/768/1024/1440 CSS widths passed without page overflow.
- Verified single-open behavior, masked amounts/units after privacy toggle, and original purchase-modal opening from expanded details. Local test fixture only.
- Syntax, TypeScript and financial-summary regressions passed; production build passed.
