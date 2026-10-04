# LOOK UP

**Every day looks the same until you start looking.**

LOOK UP 是兩人、120 分鐘 Hackathon 的 mobile app functional prototype。它邀請人先觀察真實世界，再拍下一個 moment、留下最多 50 字，並透過 WORLD 看見其他人的當下。AI 只協助開發，不是使用者功能。

## 開始前

1. 兩位開發者一起讀 [PROJECT.md](PROJECT.md)、[MVP.md](MVP.md)、[AGENTS.md](AGENTS.md)。
2. 檢查 repo；若仍只有文件，依兩人熟悉度決定 mobile stack、實機測試方式與資料方案，於開發前 freeze，記入 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。不要讓 AI 自行選陌生 framework。
3. 10 分鐘內確認唯一的 Moment contract 位置與提交介面，記入 [docs/DATA-MODEL.md](docs/DATA-MODEL.md)。
4. Person A 與 B 各用自己的 [prompt](prompts/)，各自分支或 worktree 開發；依 integration prompt 合併，最後 freeze demo。

## 文件導覽

- [PROJECT.md](PROJECT.md)：目的與原則
- [MVP.md](MVP.md)：120 分鐘範圍與完成定義，開發時優先
- [AGENTS.md](AGENTS.md)：AI 協作和檔案 ownership
- [docs/PRODUCT.md](docs/PRODUCT.md)：長期產品規格
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)：待 freeze 的技術決策和整合邊界
- [docs/DATA-MODEL.md](docs/DATA-MODEL.md)：唯一 contract 規則
- [docs/DEMO.md](docs/DEMO.md)：60 秒展示及驗收
- [prompts/](prompts/)：Person A、Person B、整合、demo freeze

本 repo 目前是開發文件，尚未選定 framework 或實作 app。
