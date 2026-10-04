# Architecture decisions and boundaries

## Freeze before coding

本 repo 起始只有文件。兩位開發者應依**已熟悉的工具**決定 mobile framework、目標平台、實機啟動方式、資料持久化與是否多機共享；在下方填入決策，不由 AI 自行挑選陌生框架。

| Decision | Frozen choice |
| --- | --- |
| Mobile framework / version | TBD by developers |
| Target device / run command | TBD by developers |
| Image storage and URI lifecycle | TBD by developers |
| Moment persistence / public query | TBD by developers |
| Unique contract file | TBD; single path owned by B |
| Shared submit/query interface | TBD by A and B |
| Shared entry point / navigation integrator | TBD; one owner |

## Ownership boundary

Person A owns capture journey UI: landing → camera/gallery → preview → note → visibility → submit call. Person B owns Moment contract, storage/repository, seed data, public query, WORLD UI. A calls the agreed submit interface and navigates to WORLD after success. WORLD reads the same repository, filtering public; seed data stays distinguishable from live moments.

Before parallel coding, agree exact paths, return/error behavior, image URI treatment, and the single person who edits app entry/navigation/config. Do not create duplicate model definitions. Use separate branches/worktrees; integrate at minute 75.

## Prototype data flow

`photo URI + optional note + visibility` → `submitMoment` → persistence → `listPublicMoments` → WORLD. Public submission must produce a visible new record on the demo device. A private submission must not appear in the public query.
