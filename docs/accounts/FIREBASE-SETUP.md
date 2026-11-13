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
