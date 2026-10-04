# Single Moment contract

**Only one implementation file may define Moment.** Before coding, A and B agree its path in docs/ARCHITECTURE.md. Person B creates and owns it; A imports it. This document is the source for freeze discussion, not a second code type.

Minimum proposed shape, adjusted only during the first 10 minutes to fit the chosen familiar stack:

```ts
type Moment = {
  id: string;
  imageUri: string;
  note?: string; // 0–50 characters
  createdAt: string; // ISO timestamp
  location?: string; // prototype may use "Taipei"
  visibility: "public" | "private";
};
```

Agree one API equivalent to `submitMoment(input): Promise<Moment>` and `listPublicMoments(): Promise<Moment[]>`. Define whether imageUri is copied/persisted before return; otherwise WORLD may show a broken image. The public query **must** filter visibility. Seed records must be distinguishable from a live submitted record in the demo data source or UI; do not present demo examples as live users.

For the full product, add capturedAt, capture date/timezone, owner ID, replacement linkage and a reliable eligibility decision. Those are post-MVP and must not silently expand the prototype contract.
