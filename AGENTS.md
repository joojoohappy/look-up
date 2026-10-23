# Rules for AI agents in this repo

1. **Spec first.** `docs/SPEC.md` decides what the product does. Do not add features, flows or data it does not describe; if a task needs a product decision, stop and ask the owner. `docs/hackathon/` is history, not current scope.
2. **Inspect before changing.** Read the spec section (F-xx) and the GitHub issue you are working on, `docs/ARCHITECTURE.md`, and the code you will touch. Check `git status` and open PRs first.
3. **One issue, one branch, one PR.** Branch from `main`, name it after the issue (`f03-compose-location`), link the issue in the PR. Never push to `main` directly. Do not edit files another open PR is changing without coordinating.
4. **Keep CI green.** Run `npm run check` before pushing. Add or update tests with every behaviour change. Never weaken a test or a check to make it pass.
5. **Dependencies.** Add Expo-managed packages with `npx expo install`; commit `package-lock.json`; npm only.
6. **Privacy and safety are product rules** (SPEC principles, F-07, F-11, F-12): no precise location, strip photo metadata before upload, no analytics, no secrets in the repo.
7. **Report honestly.** In the PR: what changed, how it was verified (CI run, device, simulator), what was not verified. Do not call something device-verified without a device run recorded in `docs/engineering/DEVICE_CHECKS.md`.
8. **Records.** Update `docs/engineering/ISSUES.md` for defects and `.harness/SESSION_LOG.md` at the end of a session.
