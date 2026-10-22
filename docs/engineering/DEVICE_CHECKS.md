# Device checks

CI 只證明程式能安裝、型別正確、測試通過、能打包。**手機上的實際行為只能用手機確認**。每項做完把結果（✅／❌、手機型號、iOS/Android 版本、Expo Go 版本、日期）寫到最下面的紀錄表。

## 0. 一次性準備（Windows 電腦）

1. 安裝 [Node.js 24 LTS](https://nodejs.org/) 和 [Git for Windows](https://git-scm.com/download/win)。
2. iPhone 從 App Store 安裝 **Expo Go**。打開 Expo Go，若已登入任何帳號，先**登出**（見 BUILD-PLAN.md 第 1 步）。
3. 電腦和 iPhone 連**同一個 Wi-Fi**。

## 1. 在電腦上啟動

```bash
git clone https://github.com/joojoohappy/look-up.git
cd look-up
git checkout upgrade/expo-sdk-58      # SDK 58 版
npm ci
npm start
```

- 第一次執行時 Windows 會跳出防火牆視窗，對 Node.js 勾選「**私人網路**」並允許。
- 終端機會顯示一個 QR code。

## 2. 用 iPhone 開啟

1. 打開 iPhone 內建**相機**，對準終端機的 QR code，點跳出的「在 Expo Go 中打開」。
2. 第一次會問「Expo Go 想要尋找並連接區域網路上的裝置」→ **允許**。
   - 如果之前按過不允許：設定 → 隱私權與安全性 → 區域網路 → 打開 Expo Go。
3. 看到錯誤時：
   - **"Project is incompatible with this version of Expo Go"** → App Store 的 Expo Go 還不支援 SDK 58。在電腦按 `Ctrl+C`，改測 SDK 57 版：
     `git checkout qa/baseline-and-fixes && npm ci && npm start`，再掃一次。
   - **一直轉圈或 "Could not connect to development server"** → 電腦按 `Ctrl+C`，改用 `npm run start:tunnel` 再掃一次（Wi-Fi 是公用／公司網路時常見）。

## 3. iPhone：WORLD 返回按鈕（LU-1）

| # | 動作 | 應該看到 |
| --- | --- | --- |
| 1 | 首頁點 **Look up ↑** | 「What did you notice?」 |
| 2 | 點 **Choose today’s photo**，選一張照片 | 照片預覽 |
| 3 | 文字框輸入 `test 1` | 右上計數 `6/50` |
| 4 | 保持「Leave this in the world」，點 **Leave in WORLD →** | 進到 WORLD，最上面是剛才的照片和 `test 1` |
| 5 | 看 WORLD 標題右邊 | 有一顆 **Look up ↑** 圓角按鈕（舊版沒有，iPhone 會卡在這頁） |
| 6 | 點它 | 回到首頁 ✅ |
| 7 | 重做 1–4，文字 `test 2` | WORLD 最上面是 `test 2`，`test 1` 還在下面 |
| 8 | 再做一次，第 4 步改選 **Keep this for myself**，文字 `private`，點 **Save for myself** | 「Saved for you.」 |
| 9 | 點 **Back to Look Up**，再公開投一則 `test 3` | WORLD 有 `test 3`，**沒有** `private` |

順便確認（SDK 58 版才有的修正）：

- WORLD 的標題沒有被動態島或狀態列蓋住；捲到最底，最後一張卡片沒有被底部橫條蓋住（LU-4）。
- 文字框輸入 `🌤🌤🌤`，計數顯示 `3/50`（LU-8）。

失敗時請截圖手機畫面，並複製電腦終端機最後 30 行。

## 4. Pixel 10：Gboard 50 字（LU-9）

用 Gboard 注音或拼音持續輸入超過 50 字：組字中的文字不應該顯示在第 50 字之後，計數停在 `50/50`。

## 紀錄

| 日期 | 項目 | 手機 / 系統 | Expo Go | Branch | 結果 | 備註 |
| --- | --- | --- | --- | --- | --- | --- |
| | LU-1 | | | | | |
| | LU-4 | | | | | |
| | LU-8 | | | | | |
| | LU-9 | | | | | |
