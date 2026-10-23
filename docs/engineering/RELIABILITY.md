# Reliability, privacy and monitoring

## Current shape (facts)

- No backend, no network calls, no analytics, no logging of user content. Photos stay as picker URIs in memory for one app session; nothing leaves the phone.
- Privacy boundary is one line: `listPublicMoments` filters `visibility === 'public'`. It fails closed for unknown values. Covered by tests and a mutation check.
- Location is the constant `'Taipei'`; no location permission is requested.
- Seed photos are bundled data URIs (~230 KB of JS) — no network needed for WORLD.

## Monitoring

| Layer | What exists | Notes |
| --- | --- | --- |
| Development | `npm run check` | run before every push |
| CI | `.github/workflows/ci.yml` on push to `main` and every PR | not yet run; turn on branch protection requiring `verify` once it is green |
| Production | none — there is no production app | proposal below |

Nothing monitors this app after a session ends. No scheduled jobs exist.

**Minimal proposal for when there is a real release** (owners decide): Sentry's free tier via `@sentry/react-native` for crash reports only, with `sendDefaultPii: false`, no breadcrumbs from text inputs and no image URIs in events. No product analytics — WORLD has no engagement metrics by design.

## Startup runbook

Use when the app opens on one phone and not another (LU-3). Record what you see in ISSUES.md.

1. **Read the exact error on the failing phone.** Screenshot it. Also copy the Metro terminal output from the moment the phone connects.
2. **"Project is incompatible with this version of Expo Go"** → SDK mismatch (LU-2). Compare Expo Go's supported SDK (Expo Go → Settings/About) with SDK 57.
3. **"You need to be signed in to Expo Go and Expo CLI"** (iPhone only) → sign both into the same Expo account; see DEVICE_CHECKS.md step 0 (includes the Windows `npx expo login` workaround).
4. **Spins, then "Could not connect to development server" / timeout**:
   - Same Wi-Fi as the computer? Guest/office/school networks often block device-to-device traffic.
   - iPhone: Settings → Privacy & Security → **Local Network** → Expo Go must be on. If it was denied once, iOS will not ask again.
   - Try `exp://<computer-LAN-IP>:8081` manually in Expo Go.
   - Still failing → `npx expo start --tunnel` (bypasses the LAN; first run downloads ngrok support).
5. **Red screen with a JS error** → bundle problem: `npx expo start --clear`, and run `npm run check` on the computer.
6. **Camera works on one phone only** → permission was denied once; the app shows "Open Settings".

## Known reliability risks

See ISSUES.md: LU-2 (Expo Go SDK cutover) is the most likely thing to break the demo next.
