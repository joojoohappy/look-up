# 60-second demo

## Setup

Use one tested phone, a real photo ready to take or pick, and a short note. Seed WORLD with clearly marked examples only if useful. Confirm the data path works without manual refresh/restart.

## Script

1. Open **LOOK UP**. Say: “Every day looks the same until you start looking.”
2. Tap **Look up**; take or choose a photo from today.
3. Preview it, type a short note, choose **Leave this in the world**.
4. Submit. Show success, then WORLD with **the exact new photo** beside clearly marked demo examples.
5. Explain: “WORLD has no likes, views, follows, comments, or ranking. The full product also keeps a private diary and daily limits; today we built the core interaction.”

## 必須說出口的限制

這三句不是免責聲明，是誠實。被問到就答，沒被問也在步驟 5 帶過：

- **「今天拍的照片」目前只是 UI 提示，我們沒有驗證拍攝日期。** 可靠的 metadata 驗證與舊照只能 private 是 post-MVP。不要說「系統會檢查」。
- **資料只存在這一次 app session 的記憶體裡，重開就消失。** 不只是沒有資料庫 —— 我們存的是相簿給的 URI 而不是照片本身，所以要真的留下來得先把檔案複製進 app 私有目錄。那是 post-MVP。
- **沒有跨裝置共享。** 另一支手機看不到這支投稿的內容。
- WORLD 裡帶 `DEMO EXAMPLE` 標記的三張是示範用的既有照片，**不是剛才的即時投稿**，也不是其他使用者。

## Known issues（不擋 demo）

- Android Gboard 在 note 達到 50 字後仍會繼續顯示組字中的文字，但欄位已截斷、提交也被擋下，計數正常。成因是 `maxLength` 與 `onChangeText` 的 slice 重複把關。

## Acceptance checklist

- [ ] Real photo can be selected or captured and previewed on phone.
- [ ] Note can be blank; maximum 50 characters enforced.
- [ ] Public submission succeeds; same photo and note appear in WORLD.
- [ ] Private submission is absent from WORLD.
- [ ] No engagement counters or social actions.
- [ ] Any unimplemented today-photo verification is stated honestly.
- [ ] Main path succeeds three consecutive times after demo freeze.

If the network or camera fails, state the limitation and show the last successful on-device run without claiming a fake live submission.
