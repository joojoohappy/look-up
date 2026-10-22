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
