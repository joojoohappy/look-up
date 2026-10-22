# Issues

Severity: P0 blocks startup/core journey/privacy · P1 important failure · P2 degraded/maintainability · P3 polish.
Status words: **fixed (code)** = changed and unit-tested where possible; **device-unverified** = not yet run on a phone.

## P1

### LU-1 — WORLD is a dead end on iOS · fixed (code), device-unverified
- **Evidence (code, deterministic):** `WorldScreen` rendered its only "Look up" control inside `ListEmptyComponent`. `SEED_MOMENTS` always contains 3 public records, so the list is never empty and the control never renders. The only other exit is Android's `BackHandler` in `App.tsx`; iOS has no hardware back.
- **Impact:** on iPhone, after one submission the user cannot capture again without killing the app, which erases the in-memory store. Breaks the "three consecutive runs" acceptance check on iOS. Android (demo device) unaffected.
- **Fix:** `WorldScreen` header now renders the existing `onLookUp` prop ("Look up ↑", 44pt target). No new prop, no flow change: it reaches the same landing screen as Android's back gesture.
- **Verify on device:** iPhone → submit public → WORLD → tap "Look up ↑" → landing → second run.

### LU-2 — Expo Go is about to drop SDK 57 · open, needs owner decision
- **Evidence (external):** Expo SDK 58 went stable on 2026-10-15; store builds of Expo Go will support only SDK 58 "within a few weeks" (expo.dev/changelog/sdk-58).
- **Impact:** once a phone's Expo Go auto-updates, this project will refuse to open on it — on any platform. This would also look exactly like "works on one phone, fails on another".
- **Options:** (a) upgrade: `npx expo install expo@^58.0.0 --fix` on a branch, CI, then both phones; (b) short-term: turn off auto-update for Expo Go on demo phones; (c) longer-term: a development build (iOS needs an Apple Developer account).
- **Why not done here:** needs registry access and device testing; a framework upgrade is a decision for the owners.

### LU-3 — App opened on one collaborator's phone but not another · open, root cause unconfirmed
- No logs from the failing device exist in the repo. Ranked hypotheses and the diagnostic runbook are in `RELIABILITY.md#startup-runbook`.
- Only cause with repo evidence: a **signed-in** Expo Go refuses an anonymous CLI (commit `f298882`, BUILD-PLAN.md step 1).
- Not causes: no backend, no `localhost` URLs, no env vars, no network calls in app code.

## P2

### LU-4 — Capture/landing have no top inset on Android · open, not reproduced
- `LandingScreen` and `CaptureScreen` rely on React Native's `SafeAreaView`, which only pads on iOS. With SDK 57's Android edge-to-edge, Capture's "← Look Up" control has no top padding and may sit under the status bar. `WorldScreen` already compensates with `StatusBar.currentHeight + 16`, which suggests its author saw this.
- Proposed fix: adopt `react-native-safe-area-context` (bundled in Expo Go; needs `npx expo install` to update the lockfile) for all three screens, replacing the hand-rolled `TOP_INSET`. Do it with a device in hand.

### LU-5 — No lint, no component/E2E tests · open
- ESLint, jest-expo and React Native Testing Library are not in the lockfile; adding them needs a lockfile update (`npx expo lint`, `npx expo install jest-expo jest @testing-library/react-native -- --save-dev`). Maestro is a reasonable fit for the Expo Go E2E path later.

### LU-6 — Standalone builds will need camera permission text · open, post-MVP
- Expo Go supplies its own permission strings. For a first EAS build, add `expo-image-picker` to `app.json` `plugins` with a `cameraPermission` message and confirm the iOS prompt.

## P3

### LU-7 — "NaN d ago" for an unparseable timestamp · fixed (code), unit-tested
- Reproduced with the original function: `timeAgo('not a date')` → `"NaN d ago"`. Moved to `src/lib/time.ts`, returns `null`; the card then shows only the location. Regression test in `tests/time.test.js`. Future timestamps (clock skew) now read "just now" explicitly.

### LU-8 — Note length counts UTF-16 code units · open, product question
- An emoji counts as 2 of the 50, and `text.slice(0, 50)` can cut a surrogate pair in half. Whether "50 字" means characters as seen (graphemes) is for the owners to decide; CJK characters already count as one each (tested).

### LU-9 — Gboard keeps showing composing text past 50 · open, already documented in DEMO.md

### LU-10 — Android back during an in-flight submit leaves without confirmation · open
- The store write completes (it's synchronous in practice), but the user lands on the landing screen with no message. Tiny window; acceptable for the prototype.

### LU-11 — 23 transitive npm advisories (recorded 2026-10-04) · open
- Could not re-run here. The CI `dependency-health` job fails on any **critical** advisory.
