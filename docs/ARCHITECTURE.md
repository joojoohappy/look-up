# Architecture decisions and boundaries

## Freeze before coding

兩位開發者都沒有 App 經驗，預設採用 [BUILD-PLAN.md](BUILD-PLAN.md) 的 Expo + React Native + TypeScript。先由一人建立並實機跑通共同 scaffold，再分支；若要改選，必須在開發前雙方共同更新本表。

| Decision | Frozen choice |
| --- | --- |
| Mobile framework / version | Expo + React Native + TypeScript；初始化時記錄實際版本 |
| Target device / run command | TBD by developers |
| Image storage and URI lifecycle | P0 使用 picker URI，僅保證同一 app session 可顯示 |
| Moment persistence / public query | P0 單一 in-memory store；無跨裝置共享或 durable persistence |
| Unique contract file | `src/types/moment.ts`，B 維護 |
| Shared submit/query interface | `src/data/moments.ts`，B 維護；見 BUILD-PLAN.md |
| Shared entry point / navigation integrator | 兩人先指定一位 integrator，只有該人修改 |

## Ownership boundary

Person A owns capture journey UI: landing → camera/gallery → preview → note → visibility → submit call. Person B owns Moment contract, storage/repository, seed data, public query, WORLD UI. A calls the agreed submit interface and navigates to WORLD after success. WORLD reads the same repository, filtering public; seed data stays distinguishable from live moments.

Before parallel coding, agree exact paths, return/error behavior, image URI treatment, and the single person who edits app entry/navigation/config. Do not create duplicate model definitions. Use separate branches/worktrees; integrate at minute 75.

## Prototype data flow

`photo URI + optional note + visibility` → `submitMoment` → persistence → `listPublicMoments` → WORLD. Public submission must produce a visible new record on the demo device. A private submission must not appear in the public query.
