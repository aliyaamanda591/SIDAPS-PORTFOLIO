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

## Compact history and portfolio records (13 November 2026)
- Transaction and portfolio table rows become compact disclosure rows on phones. Original cells/actions stay in place, desktop tables retain their columns.
- Dashboard history is capped at 280px; each collapsed transaction measured 78–80px. Mobile automatic scrolling is paused while desktop behavior is restored on leaving the mobile breakpoint.
- Duplicate dashboard portfolio table starts closed behind Lihat portofolio; expanded records retain original purchase/sale/archive actions.
- Exact Chromium widths 320/360/375/390/414/430/768/1024/1440 passed page-overflow checks. Verified three local transactions, six local assets, one-open-row behavior, purchase action, privacy masking, and table disclosure.
- Syntax, CSS parsing, TypeScript, portfolio calculation regressions and production build passed. Tests used local synthetic records only.

## Phone chart typography and contrast (13 November 2026)
- Chart drawing width now follows its actual container, retaining 12px axis labels instead of scaling down a fixed desktop SVG. Month-label spacing adapts to width; all monthly data points remain present.
- Added ResizeObserver redraw on width changes, clearer mobile secondary text and native system font stack. Preserved compact records and privacy behavior.
- Fixed realized-P/L summary retaining a stale light-theme text color when changing themes; it now inherits current theme and gain/loss classes.
- Chromium checks at 320/360/375/390/414/430/768/1024/1440: no page overflow; rendered chart-label size approximately 12 CSS pixels. Verified 12-month points, 6-month switch, hidden chart in privacy mode, and text colors in light/dark themes.
- Physical device rendering still requires user review. Syntax, TypeScript, theme/calculation regression checks and production build passed.

## Google and custom profile photos (13 November 2026)
- Verified Firebase Google ID-token picture claims seed the user's own Google avatar metadata. Only HTTPS Google avatar hosts are accepted; no server-side URL fetch or database migration is introduced.
- Photo metadata merges use revision checks/retries and preserve custom photo selection, deliberate removal, names, transactions, holdings and unrelated profile fields. Photo metadata failure does not block authentication.
- Profile editor supports Google default, custom JPG/PNG/WebP uploads, returning to Google and initials. Existing uploaded photos remain selected. Broken images fall back to initials; avatar requests omit the referrer.
- Local Chromium verified upload, save/reload persistence, removal/reload, and editor bounds without page overflow at 320/375/390/430/768/1440. Synthetic local image/account only.
- Tests cover signed picture claims, unsafe URL rejection, new empty account, custom/removal preservation, CAS conflicts, isolation, legacy profiles, and rendering. Login/calculation regressions, TypeScript and production build passed.
- Existing Google sessions acquire provider avatar metadata on the next Google sign-in. Actual provider image availability depends on the Google account; no production user's authentication or financial data was changed during QA.

## Dashboard IHSG chart (13 November 2026)
- Added IHSG / Arus transaksi selector in the existing chart card, with IHSG as initial view and existing 6/12-month personal transaction charts retained.
- Reuses the public index-only market-board endpoint. Displays actual provider history in index points, percent change, source, timestamp, manual refresh and five-minute checks. Cached/error and absent-history states remain explicit; no fabricated points.
- Public index stays visible in balance privacy mode; personal charts redact immediately on body privacy-state changes, including background tabs where animation frames may be delayed.
- Chromium loaded live provider index/history locally and checked 320/360/375/390/414/430/768/1024/1440 CSS widths: no page overflow and 12px axis labels. Verified both chart tabs, 12-month selector and privacy redaction/public index behavior.
- Syntax, TypeScript, market-board/calculation/profile-photo regression checks and production build passed. Market availability depends on providers; no private financial state sent by the index component.

## Asset picker recording and platform expansion (13 November 2026)
- Reviewed the supplied local video. Asset category selection now uses visible Semua/Saham/Kripto/Emas buttons rather than the problematic dropdown. Search autofill is disabled and lengthy source help is collapsed.
- Generic menus scroll their own list instead of scrolling all ancestors, attach within the active modal, and reposition rather than close on viewport resize or external scroll.
- Added eight named stock applications (168 unique platform values total), preserving historical values. Direct Platform lain controls are available in transaction, purchase and sale forms.
- Chromium checked category buttons at 320/360/375/390/414/430/768/1024/1440 without page overflow. Verified stock/crypto/gold filters, BIONS/HOTS/MotionTrade selections, menu persistence after resize, and custom-name focus in transaction/sale forms.
- New platform tests cover uniqueness, all three custom-name forms, escaping, legacy values and account-local choices. Integration catalog test now requests the app with its existing test session instead of the anonymous landing page; it passed, with public-source fallback clearly identified.
- Syntax, TypeScript, financial summary, fast-login and production build passed. No production records changed during QA.
