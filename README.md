# LOOK UP

**Every day looks the same until you start looking.**

LOOK UP 是兩人、120 分鐘 Hackathon 的 mobile app functional prototype。它邀請人先觀察真實世界，再拍下一個 moment、留下最多 50 字，並透過 WORLD 看見其他人的當下。AI 只協助開發，不是使用者功能。

## 開始前

1. 兩位開發者一起讀 [PROJECT.md](PROJECT.md)、[MVP.md](MVP.md)、[AGENTS.md](AGENTS.md)。
2. 先照 [docs/BUILD-PLAN.md](docs/BUILD-PLAN.md) 用 Expo + React Native + TypeScript 建立**一次**可在手機跑的共同基底；若兩人要換 stack，開發前一起修改決策。
3. 10 分鐘內確認唯一的 Moment contract 位置與提交介面，記入 [docs/DATA-MODEL.md](docs/DATA-MODEL.md)。
4. 先使用 [scaffold prompt](prompts/00-scaffold.md) 建立一次共同基底；Person A 與 B 再各用自己的 [prompt](prompts/)，各自分支或 worktree 開發；依 integration prompt 合併，最後 freeze demo。

## 文件導覽

- [PROJECT.md](PROJECT.md)：目的與原則
- [MVP.md](MVP.md)：120 分鐘範圍與完成定義，開發時優先
- [AGENTS.md](AGENTS.md)：AI 協作和檔案 ownership
- [docs/PRODUCT.md](docs/PRODUCT.md)：長期產品規格
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)：待 freeze 的技術決策和整合邊界
- [docs/BUILD-PLAN.md](docs/BUILD-PLAN.md)：App 新手的 stack、檔案邊界和分支順序
- [docs/DATA-MODEL.md](docs/DATA-MODEL.md)：唯一 contract 規則
- [docs/DEMO.md](docs/DEMO.md)：60 秒展示及驗收
- [prompts/](prompts/)：共同 scaffold、Person A、Person B、整合、demo freeze

共同 Expo scaffold 已建立並提交到 `main`（Expo SDK 57 + React Native 0.86 + TypeScript，含 `expo-image-picker`），**已在實機 Expo Go 開啟驗證通過**。唯一的 Moment contract 也在 `main`。實際版本與執行指令見 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

WORLD 與 `App.tsx` 的整合也已在 `main`：submit 會自動讓 WORLD 重載。**Person B 是 integrator**，只有 B 修改 `App.tsx`、`index.ts`、`package.json` 與 shared config。

三個畫面都已接上：landing → capture → WORLD，全在 `App.tsx` 的 state machine 裡，無 navigation library。Demo 機是 **Pixel 10**；Android 返回手勢已接管，不會中途退出 app 清掉 in-memory store。

**端對端驗收已於 Pixel 10 通過**：拍真實照片 → 預覽 → 寫 note → 公開提交 → 同一張照片出現在 WORLD 最上方；同一輪的 private 投稿確認**不會**出現在 WORLD。剩下的是 demo freeze 與連續三次實機演練，見 [docs/DEMO.md](docs/DEMO.md)。
