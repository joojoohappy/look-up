# 120-minute MVP scope

本次交付是 **mobile functional prototype**，不是完整產品。當本文件與 PRODUCT.md 衝突，以本文件為準。

## P0，必須真的能操作

1. LOOK UP landing：一句邀請與明確入口。
2. 透過手機拍照或從相簿選照片；在編輯畫面預覽。UI 說明公開投稿應是「今天拍攝的照片」。
3. 可輸入可留白、最多 50 字的 note；超過時阻止提交或輸入，顯示計數。
4. 可選 public / private；**展示主路徑是 public submit**。
5. Public submit 成功後進 WORLD，新投稿的真實照片和 note 必須出現；WORLD 只查 public moments，不能顯示 private。
6. WORLD 可混入清楚標示為 demo seed 的少量範例，主路徑不能只是假資料。

## 最小實作約束

- Person A 把選到的本機照片與 note、visibility 交給共享提交介面；Person B 實作保存與公開查詢。依選定 stack 決定本機或共用 persistence，且必須支持同一支測試手機的完整 demo。
- 若時間允許再測兩支手機共享；不要讓部署阻斷單機主路徑。
- 地點可暫用 Taipei；時間用提交時刻。不要宣稱 seed 是真實即時投稿。
- 相簿「拍攝日期等於今天才能公開」是長期規則；本次 UI 提示即可，可靠 metadata 驗證及舊照 private 限制屬 post-MVP。不得假稱已驗證。
- Private 可保存並顯示簡單成功訊息；MINE 畫面不在 P0。

## Post-MVP，本次不主動實作

每天最多 3 moments、每天 1 次 replace、依拍攝日期回填舊照片、可靠相簿日期驗證、帳號、跨裝置身份與權限、MINE、weekly record、通知、社群外連、地理分發演算法、AI 圖像檢測、正式 moderation 與正式部署。WORLD 永遠不加人氣指標。

## 時間盒

- 0–15 分：inspect、選熟悉的 stack、freeze contract 和檔案邊界。
- 15–75 分：A/B 並行。
- 75–95 分：整合；實機走 public 主路徑並檢查 private 不出現在 WORLD。
- 95–110 分：只修阻斷 demo 的問題與必要文案。
- 110–120 分：停止新功能，實機連跑三次。

## 完成定義

實機可從 landing 選或拍一張真實照片，寫一句 ≤50 字的話，公開提交後在 WORLD 看見**同一張**照片；重開需要 persistence 時應符合已 freeze 的方案。若某個 P0 未完成，直接在 demo 說明限制。
