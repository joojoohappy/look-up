# Engineering baseline

Recorded 2026-10-22 by the autonomous QA session (see `.harness/SESSION_LOG.md`).

## Which spec governs

At the time of this baseline (2026-10-22), authoritative in order: `MVP.md` → `docs/DATA-MODEL.md` → `docs/ARCHITECTURE.md` → `docs/PRODUCT.md` (now under `docs/hackathon/`). **Since 2026-10-23 the product spec is `docs/SPEC.md`.**
`Lookup.pdf` (added 2026-10-17, the newest commit) is a concept/pitch deck; it changes no product rule.

**Conflict noted, not resolved:** an older "Sky" design (Firebase, anonymous auth, sky tags, 7 languages, no note) exists outside this repo. The owner pointed at this repo as the current code, so this repo's docs were treated as approved. Nothing from the Sky design was added.

## Repository state at start

| Item | Value |
| --- | --- |
| Branch / commit | `main` @ `cb89c37` ("Add files via upload", Lookup.pdf) |
| Working tree | clean |
| Other branches | `origin/capture` @ `97fa8fd`, fully merged into `main` |
| Stack | Expo SDK 57.0.26, React Native 0.86.3, React 19.2.3, TypeScript 6.0.3, expo-image-picker 57.0.20 (lockfile v3, root deps in sync with package.json) |
| Navigation | state machine in `App.tsx`, no navigation library |
| Data | single in-memory store `src/data/moments.ts`; no backend, no network calls, no env vars, no secrets |
| Tests / lint / CI | none |
| Scripts | `start`, `android`, `ios`, `web` only |

## Environment of this session

| Item | Value |
| --- | --- |
| Machine | Linux cloud sandbox (no phone, no simulator, no Xcode/Android SDK) |
| Node / npm | v22.22.0 / 10.9.4 (repo standard is Node 24 / npm 11) |
| TypeScript | global 6.0.3 (same version as the lockfile) |

## Commands and results

| Command | Result | Evidence |
| --- | --- | --- |
| `npm ci` | **Blocked by environment.** `registry.npmjs.org` is not on the sandbox allowlist (ENOTFOUND direct, 403 via proxy); the internal mirror returns E401. Offline install: ENOTCACHED. | npm debug logs, 2026-10-22 03:44 UTC |
| `npm run typecheck` (full app) | **Not executed** — needs `node_modules` for React Native types. | — |
| `expo export` (bundle) | **Not executed** — same reason. | — |
| `npm audit` | **Not executed** — audit endpoint blocked (403). Previously recorded: 23 transitive advisories (ARCHITECTURE.md). | — |
| Syntax check of every `.ts/.tsx` (TypeScript `transpileModule`, isolatedModules) | pass, 0 diagnostics, 10 files | session log |
| Strict typecheck of RN-free modules (`tsc -p tsconfig.test.json`) | pass | session log |
| Data-layer tests on **unmodified** code (12 tests) | 12/12 pass | `docs/engineering/TEST_REPORT.md` |
| Mutation check (privacy filter broken on purpose) | 2 tests fail as expected; source restored | TEST_REPORT.md |

## Known limitations of this baseline

- Screens (`App.tsx`, `src/screens/*`) were reviewed by reading only. Their type correctness against React Native 0.86 is unverified until CI (`.github/workflows/ci.yml`) or a developer runs `npm run check`.
- No device or simulator was available. Nothing here verifies on-device behaviour; the README's Pixel 10 pass (2026-10-04) is the last device evidence and predates this session's change.

## Reproduce on a developer machine

```bash
npm ci
npm run check        # typecheck + unit tests + Android/iOS bundle
npm start            # then Expo Go on the phone, see docs/engineering/DEVICE_CHECKS.md
```
