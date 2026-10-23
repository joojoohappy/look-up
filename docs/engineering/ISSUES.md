# Issues

Severity: P0 blocks startup/core journey/privacy · P1 important failure · P2 degraded/maintainability · P3 polish.
Status words: **fixed (code)** = changed and unit-tested where possible; **device-unverified** = not yet run on a phone.

## P1

### LU-1 — WORLD is a dead end on iOS · fixed (code), device-unverified
- **Evidence (code, deterministic):** `WorldScreen` rendered its only "Look up" control inside `ListEmptyComponent`. `SEED_MOMENTS` always contains 3 public records, so the list is never empty and the control never renders. The only other exit is Android's `BackHandler` in `App.tsx`; iOS has no hardware back.
- **Impact:** on iPhone, after one submission the user cannot capture again without killing the app, which erases the in-memory store. Breaks the "three consecutive runs" acceptance check on iOS. Android (demo device) unaffected.
- **Fix:** `WorldScreen` header now renders the existing `onLookUp` prop ("Look up ↑", 44pt target). No new prop, no flow change: it reaches the same landing screen as Android's back gesture.
- **Verify on device:** iPhone → submit public → WORLD → tap "Look up ↑" → landing → second run.

### LU-2 — Expo Go is about to drop SDK 57 · fixed on `upgrade/expo-sdk-58` (owner decision 2026-10-22), CI-verified, device-unverified
- **Evidence (external):** Expo SDK 58 went stable on 2026-10-15; store builds of Expo Go will support only SDK 58 "within a few weeks" (expo.dev/changelog/sdk-58).
- **Impact:** once a phone's Expo Go auto-updates, this project will refuse to open on it — on any platform. This would also look exactly like "works on one phone, fails on another".
- **Options:** (a) upgrade: `npx expo install expo@^58.0.0 --fix` on a branch, CI, then both phones; (b) short-term: turn off auto-update for Expo Go on demo phones; (c) longer-term: a development build (iOS needs an Apple Developer account).
- **Decision:** owner chose (a) on 2026-10-22.
- **How:** the cloud sandbox and the owner's linked PC both block the npm registry, so the lockfile cannot be regenerated locally. `.github/expo-sdk-target` = `58`; `.github/workflows/sync-deps.yml` runs `scripts/sync-deps.sh` (the official `npx expo install expo@^58.0.0 --fix`, then `expo install --fix` / `--check`), commits `package.json` + `package-lock.json` to the branch and runs every gate. No version number was typed by hand.
- **Code impact reviewed against the SDK 58 notes:** no deep `react-native/Libraries/*` imports, no `InteractionManager`, `Touchable`, `ImageBackground`, `Modal animated` or `StatusBar backgroundColor/translucent` use, no Expo Router. Nothing else needed changing.
- **Result:** Expo 58.0.17, React Native 0.88.0, React 19.3.0, expo-image-picker 58.0.10, react-native-safe-area-context 5.10.1 (lockfile). CI 39767859131 green.
- **Caveat:** until the store Expo Go ships SDK 58, an SDK 58 project will not open in it. `qa/baseline-and-fixes` stays on SDK 57 for device testing in the meantime (DEVICE_CHECKS.md step 2).

### LU-3 — App opened on one collaborator's phone but not another · explained (iOS Expo Go sign-in rule), documented
- No logs from the failing device exist in the repo. Ranked hypotheses and the diagnostic runbook are in `RELIABILITY.md#startup-runbook`.
- **Likely root cause found 2026-10-23 (device evidence):** on a physical **iPhone**, Expo Go requires Expo CLI and Expo Go to be signed in to the same Expo account — even when neither is signed in it refuses ("You need to be signed in to Expo Go and Expo CLI"). Android is exempt. A Pixel opening and an iPhone failing fits exactly. Fix and Windows login workaround: DEVICE_CHECKS.md step 0. Confirmed on the owner's iPhone after signing both sides in.
- Not causes: no backend, no `localhost` URLs, no env vars, no network calls in app code.
- What changed to make the next failure diagnosable: `npm run start:tunnel` for networks that block phone↔PC traffic, and DEVICE_CHECKS.md step 2 maps each Expo Go error to its fix. Cannot be closed without the failing phone's error screen.

## P2

### LU-4 — Capture/landing have no top inset on Android · fixed on `upgrade/expo-sdk-58`, typecheck/bundle-verified, device-unverified
- `LandingScreen` and `CaptureScreen` rely on React Native's `SafeAreaView`, which only pads on iOS. With SDK 57's Android edge-to-edge, Capture's "← Look Up" control has no top padding and may sit under the status bar. `WorldScreen` already compensates with `StatusBar.currentHeight + 16`, which suggests its author saw this.
- Fix: `react-native-safe-area-context` (added by sync-deps): `SafeAreaProvider` in `App.tsx`, its `SafeAreaView` in Landing/Capture, `useSafeAreaInsets` for WORLD's top and bottom padding. Removes the hard-coded iOS 64pt and React Native's deprecated `SafeAreaView`. Check on both phones (DEVICE_CHECKS.md).

### LU-5 — No lint, no component/E2E tests · fixed on `upgrade/expo-sdk-58` (lint + component + journey), CI-verified
- `eslint.config.js` (eslint-config-expo flat) + `npm run lint`; jest-expo + React Native Testing Library with `__tests__/`: the full demo journey through the real `App` and store (public reaches WORLD with the same photo URI; private never does; LU-1 second run), Capture validation/double tap/failed submit/permission denial/cancel, WORLD seed badges and header exit. Only the native picker and safe-area are mocked (`jest.setup.js`).
- Device-level E2E (Maestro) deliberately not added: Maestro needs a simulator or a USB-attached phone in CI, which is paid macOS minutes for iOS. Revisit when there is a development build.

### LU-6 — Standalone builds will need camera permission text · fixed (config)
- `app.json` now configures the `expo-image-picker` plugin with camera and photo-library texts and `microphonePermission: false` (images only). Expo Go ignores these and shows its own; they take effect in the first EAS/development build.

## P3

### LU-7 — "NaN d ago" for an unparseable timestamp · fixed (code), unit-tested
- Reproduced with the original function: `timeAgo('not a date')` → `"NaN d ago"`. Moved to `src/lib/time.ts`, returns `null`; the card then shows only the location. Regression test in `tests/time.test.js`. Future timestamps (clock skew) now read "just now" explicitly.

### LU-8 — Note length counted UTF-16 units · fixed (code), unit-tested
- An emoji counted as 2 of the 50 and `text.slice(0, 50)` could cut one in half. Owner asked for all issues to be closed, so the rule is now **Unicode code points** (`src/lib/note.ts`, shared by store and screen; DATA-MODEL.md updated). ZWJ emoji sequences still count as several — Hermes has no `Intl.Segmenter`. Regression tests in `tests/note.test.js`; reverting to `.length` fails 3 of them.

### LU-9 — Gboard keeps showing composing text past 50 · fixed (code), device-unverified
- DEMO.md attributed it to two gates (`maxLength` + slice). `maxLength` is removed (it also counted UTF-16, contradicting LU-8); `clampNote` is the single gate. Retest on the Pixel 10 with Gboard.

### LU-10 — Android back during an in-flight submit · won't fix (no reachable window)
- `submitMoment` has no `await` before it stores, so the promise settles in the same tick as the tap; there is no frame in which a back gesture can land mid-submit. Revisit when submission goes over the network.

### LU-11 — 23 transitive npm advisories (recorded 2026-10-04) · gated, CI-verified
- `npm audit --audit-level=critical` passes on both branches (CI 39767842417 SDK 57, CI 39767859131 SDK 58). Lower-severity advisories stay visible in the job output; not triaged individually.

### LU-12 — Expo SDK 57 patch drift · fixed (CI-verified)
- `expo install --check` (first CI run): `expo@57.0.26 - expected version: ~57.0.31`, inherited from `main`. A one-off workflow ran `npx expo install --fix` on GitHub Actions (commit `ac081d0`) and was removed (`b6680a5`). CI 39767842417 green.

### LU-13 — WORLD set state synchronously in an effect; stale loads could apply · fixed (code), lint-verified
- Found by `react-hooks/set-state-in-effect` in the first lint run. The mount/reload effect now applies the result in the promise callback behind a cancellation flag, so a load finishing after unmount or after a newer reload is dropped.

