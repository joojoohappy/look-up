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

## Results — 2026-10-22, cloud sandbox (Node 22.22.0, TypeScript 6.0.3)

| Run | Result |
| --- | --- |
| 12 data/seed tests on **unmodified** `main` code | 12 pass, 0 fail |
| Mutation: privacy filter changed to return everything | tests 2 and 3 fail (as intended); source restored |
| LU-7 reproduction with the original `timeAgo` | `"NaN d ago"` |
| Full suite after fixes (`npm test`) | 15 pass, 0 fail |
| Syntax check, all 11 `.ts/.tsx` files after fixes | 0 diagnostics |

## Results — GitHub Actions (ubuntu-latest, Node 24)

| Run | Branch @ commit | Result |
| --- | --- | --- |
| CI 39767842417 | `qa/baseline-and-fixes` @ `b6680a5` (SDK 57.0.31) | **all green**: `npm ci`, full typecheck incl. screens, unit tests, Android + iOS JS bundle, `expo install --check`, `npm audit --audit-level=critical` |
| CI 39766886308 | same branch @ `6e70b28` | first real typecheck + bundle: green; `expo install --check` red (`expo@57.0.26, expected ~57.0.31`) → fixed by `ac081d0` (LU-12) |

## Not executed — do not read as passed

- Nothing runs on a phone in CI. Device steps and results: [DEVICE_CHECKS.md](DEVICE_CHECKS.md).
- Any device run: no phone or simulator available. LU-1 is device-unverified.
