# Two-person first-build plan

## Stack

For this hackathon, use **Expo + React Native + TypeScript** and test with **Expo Go** on the target phone. Use **expo-image-picker** for camera and gallery. This is the repo's default decision; if both developers choose differently, update this file **before coding**. Do not switch frameworks mid-build.

Official guides: [create project](https://docs.expo.dev/get-started/create-a-project/), [run on a phone](https://docs.expo.dev/tutorial/create-your-first-app/), [image picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/).

P0 uses one in-app, in-memory moment store. A genuinely selected photo must appear in WORLD in the **same running app**. Restart persistence, image upload, and cross-device WORLD are post-MVP; do not claim them in the demo. Seed entries must be labeled demo examples.

## Order of work

1. Together install Node.js LTS and Expo Go. **The CLI needs no Expo account, but Expo Go must not be signed in to a different one.** A LAN dev server is reached by URL; a signed-out Expo Go opens it anonymously, which is how this project ran its whole build with the CLI logged out. A signed-in Expo Go instead demands the CLI be signed in to that same account and refuses otherwise — fix it by signing out of Expo Go on the phone, which beats putting someone else's account on the host machine. Accounts only matter for EAS builds and publishing. On iOS, Expo Go has no scanner of its own: use the Camera app on the QR, or Expo Go's *Enter URL manually* with `exp://<your-LAN-IP>:8081`. A second phone can join the same server at any time — each device keeps its own in-memory store, so they will not see each other's submissions. Open a default Expo app on the target phone before dividing work.
2. One person uses `prompts/00-scaffold.md` to create the Expo app **once in this repo**, preserving the existing documents, installs `expo-image-picker`, runs it on the phone, and commits the scaffold to `main`. Record actual commands, versions and device in docs/ARCHITECTURE.md. Do not let both AIs create separate apps.
3. Agree `src/types/moment.ts` and the API below. Person B commits the single contract to `main`. Both developers pull this same commit before creating separate `capture` and `world` branches/worktrees.
4. Give each AI only its own prompt: `prompts/person-a-capture.md` or `prompts/person-b-world.md`. Never write concurrently in one working directory.
5. At minute 75, one integrator merges the branches and uses `prompts/integration.md`. Only the integrator edits shared navigation/entry. The owner resolves conflicts in owned files.
6. At minute 110, use `prompts/demo-freeze.md` and stop feature work.

## File ownership

| Owner | Files |
| --- | --- |
| Person A | `src/screens/LandingScreen.tsx`, `src/screens/CaptureScreen.tsx`, A-only components |
| Person B | `src/types/moment.ts`, `src/data/moments.ts`, `src/screens/WorldScreen.tsx`, B-only seed data |
| Integrator only | `App.tsx` or the selected Expo Router entry/navigation, `package.json`, shared config |

If the actual scaffold uses different paths, both developers update this table before starting branches. A receives `onSubmit` as a prop. B exports the store. The integrator wires them together. Neither A nor B independently edits the app entry.

## Frozen interface

`src/types/moment.ts` is the **only** Moment definition. B owns it:

```ts
export type Visibility = 'public' | 'private';
export type CreateMomentInput = {
  imageUri: string;
  note: string;
  visibility: Visibility;
};
export type Moment = CreateMomentInput & {
  id: string;
  createdAt: string;
  location: string;
};
```

`src/data/moments.ts` exports `submitMoment(input: CreateMomentInput): Promise<Moment>` and `listPublicMoments(): Promise<Moment[]>`. The latter excludes private records. A imports the contract and calls the injected `onSubmit`; A must not create another type or write directly to the store. The integrator passes `onSubmit={submitMoment}` and makes WORLD reload after a successful submission.

## Integration gate

Each AI reports its changed paths and commit. Check one Moment type, one app entry, no overlapping edits, no hidden backend dependency, and the same chosen photo visible in WORLD. The demo gate is the target phone, not a browser preview. Gallery today-photo verification remains post-MVP; state that limit honestly.
