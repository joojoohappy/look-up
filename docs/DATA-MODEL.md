# Single Moment contract

**Only one implementation file may define Moment:** `src/types/moment.ts`. Person B creates and owns it; A imports it. Follow [BUILD-PLAN.md](BUILD-PLAN.md) for the frozen P0 contract. This document is explanatory, not a second code type.

P0 shape:

```ts
export type Visibility = 'public' | 'private';
export type CreateMomentInput = {
  imageUri: string;
  note: string; // empty allowed; max 50 characters
  visibility: Visibility;
};
export type Moment = CreateMomentInput & {
  id: string;
  createdAt: string; // ISO timestamp
  location: string; // prototype may use 'Taipei'
};
```

Use `submitMoment(input: CreateMomentInput): Promise<Moment>` and `listPublicMoments(): Promise<Moment[]>` from B-owned `src/data/moments.ts`. P0 uses one in-memory app session; the selected image URI must still render in WORLD after submit. The public query **must** filter visibility. Seed records must be distinguishable from a live submitted record; do not present demo examples as live users.

For the full product, add capturedAt, capture date/timezone, owner ID, replacement linkage, durable image storage and a reliable eligibility decision. Those are post-MVP and must not silently expand the prototype contract.
