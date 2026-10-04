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

## Agreed behaviour（A 與 B 同步後的細節）

- `src/types/moment.ts` 另外匯出 `NOTE_MAX_LENGTH = 50`。A 的字數限制與計數請匯入這個常數，不要自己寫死 50。
- `submitMoment` 成功時 resolve 已儲存的 `Moment`；`imageUri` 為空或 `note` 超過 `NOTE_MAX_LENGTH` 時 **reject** 一個 `Error`。A 應 `await`、catch 後顯示 `error.message` 並留在表單，成功才導向 WORLD。
- `imageUri` 原樣保存，不複製、不轉檔，因此 WORLD 顯示的就是當下送出的那張照片；也因此只在同一次 app session 有效。
- `listPublicMoments` 回傳 newest-first，且只含 `visibility === 'public'`。Seed 範例永遠排在真實投稿之後。
- `location` 由 B 在提交時填入 `'Taipei'`，`createdAt` 用提交時刻；A 不需要傳這兩個欄位。

## A 的畫面會收到的 props（integrator 已在 `App.tsx` 接好）

A 不直接 import `src/data/moments.ts`，一律透過注入的 props：

```ts
type LandingScreenProps = {
  onStart: () => void;                 // 進入 capture
};

type CaptureScreenProps = {
  onSubmit: (input: CreateMomentInput) => Promise<Moment>;  // 已含 WORLD 重載
  onDone: () => void;                  // 導向 WORLD，由 A 決定何時呼叫
  onCancel: () => void;                // 回 landing
};
```

`onSubmit` 會儲存並讓 WORLD 重新載入，但**不會自己換畫面**；導航仍由 A 控制，所以 private 投稿可以留在原畫面顯示成功訊息，不必跳到 WORLD。檔名請用 `src/screens/LandingScreen.tsx` 與 `src/screens/CaptureScreen.tsx`，default export，integrator 才接得上。

For the full product, add capturedAt, capture date/timezone, owner ID, replacement linkage, durable image storage and a reliable eligibility decision. Those are post-MVP and must not silently expand the prototype contract.
