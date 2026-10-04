# Copy this prompt for Person A's AI agent

```text
We are building LOOK UP as a mobile app functional prototype with two developers and 120 minutes.

Before editing: read README.md, PROJECT.md, MVP.md, AGENTS.md, docs/ARCHITECTURE.md, and docs/DATA-MODEL.md. Inspect the repository, existing app stack, git status, files, and shared interface. If the repository is documentation-only, ask the two developers to freeze a familiar mobile stack, device run method, persistence plan, and unique contract path before implementation. Do not choose an unfamiliar framework yourself.

My ownership is the contribution journey: LOOK UP landing → camera OR today's gallery selection → photo preview → optional note of at most 50 characters → public/private visibility → submission UI. Make phone interactions usable. The public path must pass the actual chosen photo to the agreed submit interface and navigate to WORLD after success. Show honest loading/error states.

Person B owns the single Moment contract, persistence, WORLD UI, seed data, and public query. Import B's one contract; never create a competing Moment type. Do not edit B-owned files. If a shared entry, navigation, dependency or config file needs changing, name it and coordinate one integrator before editing. Use your own branch/worktree.

Follow MVP.md over long-term PRODUCT.md. The app should say that public gallery photos are from today, but reliable date validation, old-photo rules, MINE, quotas, replace, notifications, accounts, and AI user features are post-MVP. Do not add them. Do not fake a successful upload.

First report the files you will own, the submit interface you expect, and any blocker. Then implement only your slice. Run the app or the strongest available check. Report exact changes, validation, and remaining P0 risks for integration.
```
