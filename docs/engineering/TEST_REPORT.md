# Test report

## How to run

```bash
npm test             # compiles RN-free modules (tsconfig.test.json) and runs node --test
npm run check        # typecheck + tests + Android/iOS JS bundle
```

Tests use only what the lockfile already has (TypeScript + Node's built-in runner, Node ≥ 22). They cover the modules without React Native imports; screens are covered by `typecheck` and `bundle:check`, and by hand on a phone.

## Coverage

| File | What it protects |
| --- | --- |
| `tests/moments.test.js` (9) | submit stores input verbatim, sets `createdAt`/`location`; **private never in WORLD**; unknown visibility fails closed; newest-first; live always ahead of seed; unique ids; empty note OK; 50 OK / 51 rejected and nothing stored; missing photo rejected; 50 CJK characters accepted |
| `tests/seed.test.js` (3) | every seed public, detectable by `isSeedMoment`, labelled "Demo example", bundled as data URI (no network), unique ids, newest-first |
| `tests/time.test.js` (3) | relative-time buckets, clock skew, **regression LU-7** |
| `tests/note.test.js` (5) | code-point counting, no split emoji, store accepts 50 emoji / rejects 51, **regression LU-8** |
| `__tests__/journey.test.tsx` (3) | real `App` + store: public reaches WORLD with the picked URI; **LU-1** second run via WORLD header; private never in WORLD |
| `__tests__/CaptureScreen.test.tsx` (7) | submit disabled without photo; 50 cap + counter; emoji = 1; exact input sent once on double tap; rejected submit keeps form and retries; camera denied → Settings; picker cancel |
| `__tests__/WorldScreen.test.tsx` (2) | 3 badged seeds, no engagement words; header exit (**LU-1**) |

## Results — 2026-10-22, cloud sandbox (Node 22.22.0, TypeScript 6.0.3)

| Run | Result |
| --- | --- |
| 12 data/seed tests on **unmodified** `main` code | 12 pass, 0 fail |
| Mutation: privacy filter changed to return everything | tests 2 and 3 fail (as intended); source restored |
| LU-7 reproduction with the original `timeAgo` | `"NaN d ago"` |
| Full suite after fixes (`npm test`) | 15 pass, 0 fail |
| Syntax check, all 11 `.ts/.tsx` files after fixes | 0 diagnostics |
| Session 2: `npm run test:unit` after LU-8/9 | 20 pass, 0 fail |
| Session 2: mutation — `noteLength`/`clampNote` reverted to UTF-16 | 3 fail (as intended); source restored |

## Results — GitHub Actions (ubuntu-latest, Node 24)

| Run | Branch @ commit | Result |
| --- | --- | --- |
| CI 39767842417 | `qa/baseline-and-fixes` @ `b6680a5` (SDK 57.0.31) | **all green**: `npm ci`, full typecheck incl. screens, unit tests, Android + iOS JS bundle, `expo install --check`, `npm audit --audit-level=critical` |
| CI 39767859131 | `upgrade/expo-sdk-58` @ `e2105f2` (Expo 58.0.17, RN 0.88.0, React 19.3.0) | **all green**: `npm ci`, typecheck incl. tests, `expo lint`, 20 unit tests, 12 jest component/journey tests, Android + iOS JS bundle, `expo install --check`, expo-doctor, `npm audit --audit-level=critical` |
| Sync dependencies 39766800489 / 39767307753 | `upgrade/expo-sdk-58` | official `npx expo install expo@^58.0.0 --fix` succeeded and committed the lockfile; first gates found: TS 6 does not auto-load `@types/jest` (tests now import `@jest/globals`), tooling saved under `dependencies` (script moves it), 1 lint error (LU-13) |
| CI 39766886308 | same branch @ `6e70b28` | first real typecheck + bundle: green; `expo install --check` red (`expo@57.0.26, expected ~57.0.31`) → fixed by `ac081d0` (LU-12) |

## Not executed — do not read as passed

- Nothing runs on a phone in CI. Device status: DEVICE_CHECKS.md.
- Any device run: no phone or simulator available. LU-1 is device-unverified.
