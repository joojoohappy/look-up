# Architecture decisions and boundaries

## Freeze before coding

兩位開發者都沒有 App 經驗，預設採用 [BUILD-PLAN.md](BUILD-PLAN.md) 的 Expo + React Native + TypeScript。先由一人建立並實機跑通共同 scaffold，再分支；若要改選，必須在開發前雙方共同更新本表。

| Decision | Frozen choice |
| --- | --- |
| Mobile framework / version | Expo SDK 57.0.26 + React Native 0.86.3 + React 19.2.3 + TypeScript 6.0.3 |
| Target device / run command | 實機 + Expo Go；`npm start` 後掃 QR（手機與電腦需同一 Wi-Fi）。無模擬器：此機器沒有 Xcode 或 Android Studio |
| Image storage and URI lifecycle | P0 使用 picker URI，僅保證同一 app session 可顯示 |
| Moment persistence / public query | P0 單一 in-memory store；無跨裝置共享或 durable persistence |
| Unique contract file | `src/types/moment.ts`，B 維護 |
| Shared submit/query interface | `src/data/moments.ts`，B 維護；見 BUILD-PLAN.md |
| App entry / navigation | `App.tsx`（`index.ts` → `registerRootComponent`）。無 Expo Router、無 navigation library；三個畫面用 App.tsx 內的 state 切換 |
| Shared entry point / navigation integrator | **Person B 擔任 integrator**；只有 B 修改 `App.tsx`、`index.ts`、`package.json` 與 shared config |

## Baseline as built

一次性 scaffold 已建立於本 repo（非第二個 app）。實際狀態：

| Item | Value |
| --- | --- |
| Node | v24.21.0（nvm，user-local；`~/.nvm`） |
| Package manager | **npm 11.19.0，唯一** —— 只提交 `package-lock.json`。不要用 pnpm 或 yarn：demo 機的 `node_modules` 是 npm 裝的並已實機驗證，`npx expo install` 也只寫 `package-lock.json`。`pnpm-lock.yaml` 已從 repo 移除並列入 `.gitignore` |
| Template | `create-expo-app@latest --template blank-typescript` |
| Scaffold method | 先在 repo 外建立，再只複製 `App.tsx`、`index.ts`、`app.json`、`package.json`、`tsconfig.json`、`.gitignore`、`assets/`，保留原有 Markdown |
| Image picker | `expo-image-picker@~57.0.20`（`npx expo install` 選定的 SDK 57 相容版本） |
| Typecheck | `npx tsc --noEmit` 通過 |
| Target phone | **已通過** — 2026-10-04 實機 Expo Go 開啟 baseline 成功（裝置型號待補） |

Setup / run：

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"   # 新 shell 需先載入 nvm
npm install
npm start                                           # Expo Go 掃 QR
npx tsc --noEmit                                    # typecheck
```

已知問題：此機器原本沒有 Node、Homebrew 或 nvm，Node 以 nvm 安裝，安裝程式已在 `~/.zshrc` 附加 nvm 載入片段。`npm audit` 回報 23 個 transitive 相依套件弱點，屬 Expo 模板預設狀態，P0 不處理。

## Ownership boundary

Person A owns capture journey UI: landing → camera/gallery → preview → note → visibility → submit call. Person B owns Moment contract, storage/repository, seed data, public query, WORLD UI. A calls the agreed submit interface and navigates to WORLD after success. WORLD reads the same repository, filtering public; seed data stays distinguishable from live moments.

Before parallel coding, agree exact paths, return/error behavior, image URI treatment, and the single person who edits app entry/navigation/config. Do not create duplicate model definitions. Use separate branches/worktrees; integrate at minute 75.

## Prototype data flow

`photo URI + optional note + visibility` → `submitMoment` → persistence → `listPublicMoments` → WORLD. Public submission must produce a visible new record on the demo device. A private submission must not appear in the public query.
