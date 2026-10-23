# Look up

**Every day looks the same until you start looking.**
每天看起來都一樣，直到你開始抬頭看。

Look up 是一個免費、免註冊的 iOS app：抬頭看看天空，拍下來，留一句話，然後看看世界各地的人此刻眼中的天空。沒有按讚、追蹤、留言或排名，只有大家各自看見的當下。

*Look up is a free, account-free iOS app for noticing the sky: take a photo, leave a few words, and see what people around the world are looking up at right now. No likes, follows, comments or rankings.*

## 現況

| | |
| --- | --- |
| 階段 | v1 開發中。2026-10 的黑客松原型已完成並在 iPhone 上驗證；正式版目標 2026 年 12 月下旬送審 App Store |
| 規格 | [docs/SPEC.md](docs/SPEC.md) |
| 進度 | [GitHub milestones](https://github.com/joojoohappy/look-up/milestones)、[issues](https://github.com/joojoohappy/look-up/issues) |
| 品質 | 每次 push 都跑 CI：型別檢查、lint、單元與元件測試、Android/iOS 打包、相依套件檢查 |

## 核心體驗

1. **WORLD**：打開就看到今天世界各地的天空，可以按日期回顧、按天空種類篩選。
2. **分享**：拍一張今天的天空，選填一句話（50 字內）、城市、標籤、一個社群連結，選擇公開或只留給自己。
3. **我的**：自己的天空紀錄；私人的只存在自己的手機。

完整功能、隱私原則與「不做什麼」見 [規格](docs/SPEC.md)。

## 技術

Expo SDK 58 · React Native 0.88 · TypeScript · Firebase（v1 開發中）· Jest + React Native Testing Library · GitHub Actions

## 在手機上執行

```bash
git clone https://github.com/joojoohappy/look-up.git
cd look-up
npm ci
npm start   # 用 Expo Go 掃 QR code
```

iPhone 需要電腦和 Expo Go 登入同一個 Expo 帳號。完整步驟：[docs/engineering/DEVICE_CHECKS.md](docs/engineering/DEVICE_CHECKS.md)。

開發檢查：`npm run check`（型別、lint、測試、打包）。

## 文件

| 文件 | 給誰 |
| --- | --- |
| [docs/SPEC.md](docs/SPEC.md) | 產品規格，所有功能以此為準 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 目前程式架構與版本 |
| [docs/engineering/](docs/engineering/) | 品質紀錄：問題清單、測試報告、穩定性、實機測試步驟 |
| [docs/hackathon/](docs/hackathon/) | 2026-10 黑客松原型的範圍、分工與簡報（歷史紀錄） |
| [AGENTS.md](AGENTS.md) | 給在這個 repo 工作的 AI 助手的規則 |
