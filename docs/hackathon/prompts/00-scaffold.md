# Copy this prompt once, before A and B split

```text
Prepare the shared LOOK UP mobile app baseline. We have two first-time app developers and a 120-minute hackathon.

Read README.md, MVP.md, AGENTS.md, docs/BUILD-PLAN.md, docs/ARCHITECTURE.md, and docs/DATA-MODEL.md. Inspect the current repo and git status. This repository already contains valuable Markdown files; preserve them. Use Expo + React Native + TypeScript and Expo Go as specified in BUILD-PLAN.md. Create exactly one Expo app in this repository, using a safe scaffold method that does not overwrite the documents. Do not create a second repo or parallel app.

Install expo-image-picker using the Expo-recommended compatible version. Remove unused template examples. Make the default app open on the target physical phone through Expo Go. Record the actual Expo/React Native/Node versions, target phone, setup/run commands, chosen app entry/navigation file, and any setup issue in docs/ARCHITECTURE.md. Do not build product screens yet.

Create the directories needed by the ownership table. Agree the exact src/types/moment.ts contract and src/data/moments.ts API with both developers; Person B should commit the contract once. Commit the working scaffold to main. Both developers must pull that same commit before creating their capture and world branches.

Report the baseline commit SHA, exact files created, phone run result, the shared contract path, and whether both developers can start from this same state. Stop if the phone cannot open the baseline; do not claim the scaffold is ready.
```
