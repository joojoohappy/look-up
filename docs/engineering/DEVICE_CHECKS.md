# Device checks

CI 只證明程式能安裝、型別正確、測試通過、能打包。**手機上的實際行為只能用手機確認**。每項做完，把結果寫到最下面的紀錄表：✅／❌、手機型號、iOS/Android 版本、Expo Go 版本、日期。

## 0. 一次性準備（Windows 電腦）

1. 安裝 [Node.js 24 LTS](https://nodejs.org/) 和 [Git for Windows](https://git-scm.com/download/win)。
2. iPhone 從 App Store 安裝 **Expo Go**。打開 Expo Go，若已登入任何帳號，先**登出**（見 BUILD-PLAN.md 第 1 步）。
3. 電腦和 iPhone 連**同一個 Wi-Fi**。

## 1. 在電腦上啟動

在「命令提示字元」或 PowerShell 執行：

```bash
git clone https://github.com/joojoohappy/look-up.git
cd look-up
npm ci
npm start
```

- 這是 `main`（目前是 Expo SDK 57），App Store 上的 Expo Go 現在就能開。
- 之前已經 clone 過的話，改成在 `look-up` 資料夾裡執行 `git checkout main`、`git pull`、`npm ci`、`npm start`。
- 第一次執行時 Windows 會跳出防火牆視窗：對 Node.js 勾選「**私人網路**」並允許。
- 終端機會顯示一個 QR code。

## 2. 用 iPhone 開啟

1. 打開 iPhone 內建**相機**，對準終端機的 QR code，點跳出的「在 Expo Go 中打開」。
2. 第一次會問「Expo Go 想要尋找並連接區域網路上的裝置」→ **允許**。
   - 如果之前按過不允許：設定 → 隱私權與安全性 → 區域網路 → 打開 Expo Go。
3. 一直轉圈，或出現 **"Could not connect to development server"**：在電腦按 `Ctrl+C`，改用 `npm run start:tunnel` 再掃一次。Wi-Fi 是公用或公司網路時很常見。

## 3. iPhone：WORLD 返回按鈕（LU-1）

| # | 動作 | 應該看到 |
| --- | --- | --- |
| 1 | 首頁點 **Look up ↑** | 「What did you notice?」 |
| 2 | 點 **Choose today’s photo**，選一張照片 | 照片預覽 |
| 3 | 文字框輸入 `test 1` | 計數 `6/50` |
| 4 | 保持「Leave this in the world」，點 **Leave in WORLD →** | 進到 WORLD，最上面是剛才的照片和 `test 1` |
| 5 | 看 WORLD 標題右邊 | 有一顆 **Look up ↑** 圓角按鈕（舊版沒有，iPhone 會卡在這頁） |
| 6 | 點它 | 回到首頁 ✅ |
| 7 | 重做 1–4，文字改成 `test 2` | WORLD 最上面是 `test 2`，`test 1` 還在下面 |
| 8 | 再做一次，第 4 步改選 **Keep this for myself**，文字 `private`，點 **Save for myself** | 「Saved for you.」 |
| 9 | 點 **Back to Look Up**，再公開投一則 `test 3` | WORLD 有 `test 3`，**沒有** `private` |
| 10 | 文字框輸入 `🌤🌤🌤` | 計數 `3/50`（LU-8） |

失敗時請截圖手機畫面，並複製電腦終端機最後 30 行。

## 4. Pixel 10：Gboard 50 字（LU-9）

用 Gboard 注音或拼音持續輸入超過 50 字：第 50 字之後不應該再出現組字中的文字，計數停在 `50/50`。

## 5. 測 SDK 58 版（PR #3，合併前）

```bash
git fetch origin
git checkout upgrade/expo-sdk-58
npm ci
npm start
```

- 出現 **"Project is incompatible with this version of Expo Go"**：商店版 Expo Go 還不支援 SDK 58，先不要合併 PR #3。執行 `git checkout main && npm ci` 回到可用版本，過幾天再試。
- 能開的話，重做第 3、4 節，再加看一項（LU-4）：WORLD 的標題沒有被動態島或狀態列蓋住；捲到最底，最後一張卡片沒有被底部橫條蓋住。

## 紀錄

| 日期 | 項目 | 手機 / 系統 | Expo Go | Branch | 結果 | 備註 |
| --- | --- | --- | --- | --- | --- | --- |
| | LU-1 | | | main | | |
| | LU-8 | | | main | | |
| | LU-9 | | | main | | |
| | LU-1/4/8/9 | | | upgrade/expo-sdk-58 | | |
