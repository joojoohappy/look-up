# Copy this prompt for Person B's AI agent

```text
We are building LOOK UP as a mobile app functional prototype with two developers and 120 minutes.

Before editing: read README.md, PROJECT.md, MVP.md, AGENTS.md, docs/BUILD-PLAN.md, docs/ARCHITECTURE.md, and docs/DATA-MODEL.md. Inspect git status, current branch, shared Expo scaffold, and src/types/moment.ts. If the common scaffold has not been committed and opened on the target phone, stop coding and identify that blocker. Never initialize a second app.

My ownership is the one Moment contract, submission/persistence, public query, WORLD UI, and clearly labeled seed data. Create exactly one implementation contract file at the agreed path. Define a simple submitMoment and listPublicMoments interface with Person A before either side codes against it. Preserve the selected image so WORLD can display the exact submitted photo. listPublicMoments must exclude private records. Show a sensible empty/error state. Use small seed examples only if they are visibly demo examples; they must never substitute for the live submitted photo.

Own src/types/moment.ts, src/data/moments.ts, src/screens/WorldScreen.tsx, and B-only seed data. Commit the contract to main first so A starts from the same baseline; then work on branch world. P0 uses an in-memory same-session store. Do not claim restart persistence or cross-device sharing. Do not edit App.tsx, the Expo Router entry, or package.json after the shared scaffold freeze; the integrator owns them.

Person A owns landing, camera/gallery, preview, note, visibility, and submission UI. Do not edit A-owned files. Coordinate any shared entry/navigation/config change and nominate one integrator. Work on your own branch/worktree.

MVP.md outranks PRODUCT.md. Do not add accounts, daily quota, replace, MINE, notifications, ranking, engagement metrics, AI user features, or complex geographic distribution. Do not claim cross-device sharing unless implemented and tested.

First report files you will own, contract path, submit/query signatures, and blockers. Then implement your slice and validate a public record appears in WORLD while a private record does not. Report exact changes and remaining P0 risks.
```
