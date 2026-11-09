# Login exchange reminder

The login card shows a friendly BEI reminder based on the existing `idxSession()` schedule and `Asia/Jakarta` time. Regular session I/II use a green status and encouragement; lunch, preopening, closing phases, weekends, and configured 2026 exchange holidays use their own messages. After the final session, the copy reads “Mau lihat apa? Bursa sedang tutup”. Users can always sign in; crypto remains available 24 hours.

This is a **scheduled reminder**, not an exchange connectivity feed or an indicator of trading halts for individual stocks. It reuses the asset-card schedule and holiday list. A year outside the configured calendar is explicitly marked as missing holiday coverage. Source: https://www.idx.id/id/produk-layanan/jam-dan-mekanisme-perdagangan

The UI refreshes every 15 seconds while visible and immediately when focus/visibility returns. It never fetches account data or submits the login form. Announcements update only when their text changes; the clock is outside the live region, and the small status animation respects reduced-motion settings. The existing scrolling login card accommodates smaller screens.

Run `node scripts/test-login-market.mjs` for Jakarta time, phase boundaries, Friday lunch, weekends, holidays, unknown calendar years, update hooks, and preservation of login controls. Run the broader regression from the workspace root with `node verify-investasi.cjs`.
