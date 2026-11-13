# Firebase Authentication — Sidaps Portfolio

Project checked in the Firebase Console: `sidaps-portfolio` (SIDAPS PORTFOLIO), web application **Sidaps Portfolio Web**.

Email/Password and Google sign-in providers were enabled in the actual console on 8 November 2026. Google public application name is Sidaps Portfolio. The registered web configuration is in `lib/firebase-web-config.json`; it contains the public Firebase web API key, not a service-account credential. No Google client secret or service-account private key belongs in this repository.

## Website integration

- The Google button loads the official modular Firebase Auth SDK, uses an account-selection popup, and sends its ID token to the same-origin `/api/auth/google` endpoint.
- The server verifies the RS256 signature using Google's fixed public key endpoint, the exact Firebase project audience/issuer, expiry, recent sign-in, the `google.com` provider, and verified email. Client-submitted email or roles are never trusted.
- A verified Google email links to the existing website account for that email. Its portfolio and role logic remain unchanged. A new email gets a new empty account and ordinary member permissions unless it matches the hosting's verified owner identity.
- The Firebase browser session uses memory persistence; the website exchanges it for its own HttpOnly/Secure/SameSite session and signs out the temporary SDK session.
- Existing website email/password registration, recovery codes, password changes, and existing accounts continue to work. **Existing password hashes are not migrated into Firebase.** Email/password on this website still uses the existing server account system; enabling the Firebase Email/Password provider does not itself transfer those accounts.
- A Google-only account may optionally create a separate website password from its account security settings, using its verified website session.

## Database

User accounts and private portfolios continue to use the existing production Cloudflare D1 binding `DB` (`accounts`, `credentials`, `sessions`, `portfolios`, and `auth_limits`). This change does not migrate or copy financial records into Firestore, and does not grant the owner access to another user's portfolio. Firebase is the Google identity provider for the existing application backend.

## Authorized domains

The current live website must be present in Firebase Authentication → Settings → Authorized domains:

`catatan-investasi-denny.fruityhen1.chatgpt.site`

Only explicit development hosts should be added for local tests. Changing hosting to another origin requires authorizing that exact host before Google popup login can complete.

## Checks

- `node scripts/tests/test-google-tokens.mjs`: cryptographic signature and claim validation.
- `node scripts/tests/test-email-auth.mjs`: existing email login, signup, recovery, sessions, role protection, and data isolation (local preview).
- Google popup sign-in needs a person to choose their own Google account; automated checks must not approve that authentication on their behalf.

## Login domain verification — 13 November 2026

Live Identity Toolkit getProjectConfig confirmed `sidaps-portfolio.sidaps.workers.dev` in the project's authorizedDomains. A createAuthUri request for Google using that exact continue origin returned HTTP 200 with an accounts.google.com URL. No provider or authorization setting was changed. The currently open Chrome tab on that origin already had an authenticated session; the original screenshot's failing origin was not included. Do not infer that an arbitrary additional domain or another person's end-to-end sign-in was verified.

If an existing SDK instance reports unauthorized-domain, the client now rechecks the public project's authorized domains. When the current hostname is already allowed, it offers a full-page reload to discard stale in-memory SDK state. Otherwise it offers the verified official login URL. A failed domain recheck never bypasses Firebase validation or exchanges an unverified token. All current signature, issuer, audience, verified-email, provider, origin checks and account isolation remain unchanged.

The error panel provides explicit reload/official-origin actions. Unknown errors no longer expose raw provider internals. No passwords, email addresses or tokens are sent with the public domain recheck. `scripts/tests/test-google-domain.mjs` covers current-authorized, wrong-origin and unavailable-config cases. Real account selection remains a user action.

Confirmed cause: the user supplied `https://sidaps-portfolio.sidaps.workers.dev./?login=1`, with a trailing DNS dot. Firebase authorizes the undotted origin, not this distinct browser origin. The root route now issues a 308 to the exact known undotted host before identity lookup, preserving the path/query. The Google client also redirects that exact dotted host before SDK initialization or popup invocation, covering already-served pages once refreshed. No additional Firebase domain or permission was added. `scripts/tests/test-canonical-login.mjs` checks canonicalization, unchanged queries, unknown-host rejection and SDK ordering.
