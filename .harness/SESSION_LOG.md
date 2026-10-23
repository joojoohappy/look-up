# Session log

## 2026-10-22 — QA baseline and first fixes (branch `qa/baseline-and-fixes`, from `main` @ `cb89c37`)

**Goal:** audit the repo, establish a reproducible baseline, fix real P0/P1 defects, add a test and CI foundation, leave records a later session can resume from.

**Changed**
- `src/screens/WorldScreen.tsx` — header shows the existing `onLookUp` route ("Look up ↑"); empty state no longer carries its own button; uses `src/lib/time.ts`. (Owner waived file ownership on 2026-10-22: "不要理 person B".)
- `src/lib/time.ts` — new pure `timeAgo(createdAt, now)`; returns `null` for bad input.
- `package.json` — scripts `typecheck`, `test`, `bundle:check`, `check`. Dependencies untouched; lockfile untouched.
- `tsconfig.test.json`, `tests/*.js` — 15 tests on the RN-free modules, Node built-in runner.
- `.github/workflows/ci.yml` — install, typecheck, test, bundle; dependency-health job.
- `.gitignore` — `.test-build/`, `.bundle-check/`.
- `docs/engineering/{BASELINE,ISSUES,TEST_REPORT,RELIABILITY}.md`, this log; pointer in `docs/ARCHITECTURE.md`.

**Decisions**
- No new dependencies: the sandbox could not reach the npm registry, and adding packages without regenerating `package-lock.json` would break `npm ci` for everyone. Hence Node's test runner instead of Jest.
- LU-1 fixed by rendering an already-approved prop, not by adding a flow.
- LU-2 (SDK 58) and LU-4 (Android insets) left as proposals: both need dependency changes and a device.
- Repo docs treated as the approved spec; the separate Firebase "Sky" design was not imported.

**Verification** — see `docs/engineering/TEST_REPORT.md`. Executed: syntax check (all files), strict `tsc` of pure modules, 15/15 tests, mutation check. Not executed: full typecheck, bundle, audit, CI, any device.

**Status**
| Item | State |
| --- | --- |
| LU-1 WORLD exit on iOS | implemented; not typechecked against RN; not device-tested |
| LU-7 time label | implemented; unit-tested |
| CI | written; never run |
| Deployed / production | nothing deployed; no production exists |

**Problems:** npm registry blocked (public: not allowlisted; internal mirror: E401). GitHub push not possible — the owner's GitHub account is not linked to Claude, so this work exists as a local branch and a patch.

**Human intervention needed**
1. Push the branch (or apply the patch) and look at the first CI run.
2. Decide LU-2: upgrade to SDK 58 vs. hold Expo Go updates.
3. On an iPhone, verify LU-1; on the failing phone, follow RELIABILITY.md#startup-runbook and record the error for LU-3.

**Open issues:** LU-2, LU-3, LU-4, LU-5, LU-6, LU-8–LU-11 (ISSUES.md).

**Possible harness lessons (candidates only)**
- When the sandbox cannot install packages, test what is pure with tools already in the lockfile rather than adding dependencies blind.
- Empty-state-only navigation is invisible when seed data guarantees a non-empty list; check reachability of every exit per platform.
- Check the Expo Go store SDK window before any device-dependent investigation.

## 2026-10-22 (session 2) — close everything, upgrade to SDK 58

**Owner instructions:** "不要理 person B 了一次做完" (ownership waived; fix all open issues) and "升級到 58".

**Changed**
- `qa/baseline-and-fixes` (+1 commit, stays SDK 57 for device testing now): `src/lib/note.ts` code-point counting shared by store and Capture (LU-8); `maxLength` removed (LU-9); image-picker permission texts in `app.json` (LU-6); `start:tunnel`; 5 tests.
- `upgrade/expo-sdk-58` (from the above): `.github/expo-sdk-target`, `scripts/sync-deps.sh`, `.github/workflows/sync-deps.yml` (LU-2); safe-area-context in App/Landing/Capture/WORLD (LU-4); ESLint + jest-expo + RNTL, 12 component/journey tests, CI lint + component steps (LU-5); docs (ARCHITECTURE, README, ISSUES, TEST_REPORT, new DEVICE_CHECKS).

**Decisions**
- Lockfile regeneration moved to GitHub Actions: the npm registry is blocked from the sandbox and from the owner's linked PC (proxy 403). No dependency version was typed by hand.
- Two branches, because the store Expo Go may not run SDK 58 yet: SDK 57 branch for immediate iPhone testing, SDK 58 branch on top.
- LU-10 closed as won't-fix (no reachable window). LU-3 stays open: needs the failing phone's error.

**Verification:** syntax check of every TS/TSX/JS file, `bash -n`, YAML parse, unit tests 20/20, mutation check for LU-8. **Not run:** jest tests, lint, typecheck with RN types, bundle, sync-deps, CI, any device.

**Status:** both branches local only; GitHub not linked, nothing pushed, nothing deployed.

**Human intervention:** link GitHub (and install the Claude GitHub App on `joojoohappy/look-up`); then device checks per DEVICE_CHECKS.md.

**Next session:** push both branches → watch sync-deps → fix lint/jest/typecheck failures until green → open PRs (`qa/baseline-and-fixes` → `main`, then `upgrade/expo-sdk-58`).

**Possible harness lessons (candidates only)**
- When no machine in reach can install packages, delegate lockfile changes to CI with the official command instead of hand-writing versions.
- Keep a pre-upgrade branch while store builds of a runtime (Expo Go) lag the SDK.

## 2026-10-22 (session 2, continued) — GitHub linked, pushed, CI to green

**Changed:** pushed `qa/baseline-and-fixes` (PR #2 → `main`) and `upgrade/expo-sdk-58`. `scripts/ci-run.sh` republishes failing step output as annotations (raw job logs are not reachable from the sandbox). actions/checkout and setup-node v5. Tests import `@jest/globals` (TypeScript 6 no longer auto-loads `@types/*`). sync-deps moves tooling to devDependencies. WORLD load effect fixed (LU-13). One-off `expo install --fix` for SDK 57 drift (LU-12), workflow removed after it ran.

**Verification (executed, GitHub Actions):** CI 39767842417 SDK 57 all green; CI 39767859131 SDK 58 all green: typecheck, lint, 20 unit + 12 component/journey tests, Android + iOS bundle, expo install --check, expo-doctor, critical audit.

**Status:** CI-verified on both branches. Not device-verified. Not merged, not deployed.

**Human intervention:** review/merge PR #2, then the SDK 58 PR; device checks per DEVICE_CHECKS.md (iPhone LU-1/LU-4/LU-8, Pixel LU-9); LU-3 needs the failing phone's error screen.

**Possible harness lessons (candidates only)**
- When CI logs are unreachable, make every step publish its own failure tail as an annotation; it turned three blind failures into one-line fixes.
- TypeScript 6 `types` default is `[]`: import test globals explicitly instead of relying on `@types/*`.

## 2026-10-23 (session 3) — device test, merge, unified spec

**Device (owner, iPhone, Expo Go SDK 58):** DEVICE_CHECKS section 3 passed on `upgrade/expo-sdk-58`; PR #3 merged. Found: iPhone Expo Go requires Expo CLI and Expo Go signed in to the same account (likely LU-3 root cause); Windows `npx expo login` crashes opening the browser (`&` in URL) — use `-u` or `EXPO_TOKEN`.

**Owner feedback:** the prototype forces capture before viewing WORLD, lacks location and social link; wants a full v1, public repo for a hackathon portfolio, launch in 1–2 months.

**Decisions:** owner chose features row by row in the decision doc (claude.ai artifact 7DXtEHeTKfeiCq73tRFYbb): Sky features (feed-first, city location, social link, tags, date browsing, report, 7 languages, anonymous Firebase) + Look up rules (name, 50-char note, private MINE, 3/day, today-photo via EXIF). Delete refunds quota. Publish time always shown. Visual style: compare 2–3 directions. Dashboard updated by Claude when work happens (no schedule).

**Changed:** `docs/SPEC.md` (v1 spec, F-01…F-13); README rewritten for visitors; AGENTS.md rewritten (spec-first, issue/branch/PR rules); hackathon docs, prompts, pitch deck and seed photos moved to `docs/hackathon/`; Expo login rule recorded.

**Not found:** the September Sky code (`sky-app.zip`) is not in the owner's Documents, Downloads or Desktop; v1 is built from the spec.
