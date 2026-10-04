# AI collaboration rules

適用於所有在此 repo 工作的 AI agent。

1. **先 inspect 再改。** 先讀 README.md、PROJECT.md、MVP.md、docs/ARCHITECTURE.md、docs/DATA-MODEL.md，查看 repo、現有 stack、git status、檔案 ownership 和現有 contract。不可假設 repo 已有 app。
2. **Scope 順序：** MVP.md 高於長期 docs/PRODUCT.md。只做被指派的 P0；不要擅自加入產品功能、帳號、AI 使用者功能或重設 architecture。
3. **雙人 ownership：** Person A 負責 landing、camera/gallery、preview、note、visibility、submission UI。Person B 負責唯一 Moment contract、data persistence、WORLD UI、seed data、public query。
4. **共享 contract 只有一份。** 先共同 freeze docs/DATA-MODEL.md 所指定的路徑與 API。Person B 建立／維護該檔；A 匯入使用。禁止各自建立 competing Moment types 或臨時改欄位。變更需兩人先同步並一起更新文件。
5. 不修改另一人的 owned files。必須碰共享 entry point、navigation、dependency 或 config 時，先在雙方對話中標明路徑與預期改動，指定一人整合；不能兩個 agent 同時改同一檔。
6. 兩人用獨立 branch 或 worktree，避免同一 working tree 並發寫入。各自提交 owned changes，整合階段才合併；合併衝突按 ownership 由檔案 owner 解決。
7. 先讀 docs/BUILD-PLAN.md。預設 stack 是 Expo + React Native + TypeScript；一人只建立一次共同 scaffold 並實機驗證，再由 B 提交唯一 contract，兩人從同一 commit 分支。若改 stack，兩人須在開發前一起更新 docs/ARCHITECTURE.md，不可各自初始化 app。
8. 修改前說明要動哪些檔；修改後回報做了什麼、如何驗證、剩餘 P0 風險。不要以 seed data 假冒真正投稿成功。
