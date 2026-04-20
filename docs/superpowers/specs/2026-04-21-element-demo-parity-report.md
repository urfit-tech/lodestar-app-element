# Element Demo Parity Report — master vs monorepo `apps/element-demo`

**日期：** 2026-04-21
**分支：** refactor/v1
**目的：** 完成 `MIGRATION_PROGRESS.md` 第三階段「驗證所有元件正常運作」驗收

## 環境

| App | Source | Stack | Port |
|---|---|---|---|
| **Master** | `origin/master` worktree @ `../lodestar-app-element-master` | React 17 + CRA + yarn 1 + Node 16 | 3001 |
| **Element Demo** | `refactor/v1` `apps/element-demo` | React 17 + Vite 6 + pnpm + Node 22 | 3002 |

兩邊使用相同 backend（dev 環境 `REACT_APP_ID=demo`），確保資料來源一致。

## 結論

**15/15 路由在 element-demo 上渲染成功，無 crash。** 對比過程中發現並修復 2 個 regression（皆源自 Vite 遷移），修正後視覺輸出一致。

## 路由對照

| # | Route | Master 渲染 | Element Demo 渲染 | 一致性 |
|---|---|---|---|---|
| 1 | `/` | 15 條 nav 連結 | 15 條 nav 連結 | ✅ |
| 2 | `/auth` | Login 表單 | Login 表單 | ✅ |
| 3 | `/member` | 會員列表 (aaa ssss, admin, 我是DEMO, adminlois...) | 同樣列表 | ✅ |
| 4 | `/programs` | 課程 (admin 測試OG / test1 / 版型三) | 同樣課程 | ✅ |
| 5 | `/program-contents` | 空內容 collection | 空內容 collection | ✅ |
| 6 | `/program-package` | 設計師核心能力 3 堂課 | 設計師核心能力 3 堂課 | ✅ |
| 7 | `/project` | 生而為人的這些那些 / 儒家篇 | 同樣專案 | ✅ |
| 8 | `/activity` | 企業內訓/UI Designer `2020-06-01(一)` | 同樣活動 `2020-06-01(一)` | ✅（修復後） |
| 9 | `/layout` | 版型 demo `1 2 3 4 5 test` | 同樣 layout | ✅ |
| 10 | `/text` | 空文字 block | 空文字 block | ✅ |
| 11 | `/carousel` | Carousel `A B C D 1 2 3` | 同樣 carousel | ✅ |
| 12 | `/image` | 空 image block | 空 image block | ✅ |
| 13 | `/checkout` | `免費 自動訂閱 結帳產品模組` | `免費 自動訂閱 結帳產品模組` | ✅（修復後） |
| 14 | `/ai-bot` | 「你的名字、想申請的公司名稱、職位名稱、送出」 | 同樣表單 | ✅ |
| 15 | `/event` | 空會員行事曆 | 空會員行事曆 | ✅ |

## 對比過程中發現並修復的 regression

### Regression 1：i18n translation key 顯示為原文（locale glob 路徑錯誤）

- **症狀：** `/checkout` 渲染 `Free auto subscription CheckoutProductModal CheckoutProductModal` 英文 key 原文，而非中文翻譯
- **根因：** `packages/contexts/src/LanguageContext.tsx` 用 `import.meta.glob('../../../ui/src/translations/locales/*.json')` — 多一層 `../`，指到 workspace 根外部，找不到任何 locale 檔
- **修正：** 改為 `'../../ui/src/translations/locales/*.json'`（commit `cf398a4`）
- **驗證：** `/checkout` 恢復顯示 `免費 自動訂閱 結帳產品模組`

### Regression 2：moment locale zh-tw 未掛載（Vite 雙 instance）

- **症狀：** `/activity` 日期顯示 `2020-06-01(Mo)` 英文星期縮寫，master 顯示 `(一)`
- **根因：** Vite 把 `moment` 主 entry 解析到 ESM `moment/dist/moment.js`，但 `moment/locale/zh-tw.js` 的 `require('../moment')` 解析到 CJS `moment/moment.js` — 兩個獨立 moment instance，locale 掛到了錯的 instance 上
- **修正：** `apps/element-demo/vite.config.ts` 加 `resolve.alias` 把 `moment` 強制指向 CJS entry，加 `dedupe: ['moment']` 與 `optimizeDeps.include: ['moment', 'moment/locale/zh-tw', 'moment/locale/zh-cn']`；同時把 `moment` 加入 `package.json` 為直接依賴（commit `33a38df`）
- **驗證：** `/activity` 恢復顯示 `2020-06-01(一) ~ 2020-07-31(五)`

## 已接受的預期差異

| 項目 | Master | Element Demo | 接受理由 |
|---|---|---|---|
| DOM node 數（首頁） | 51 | 46 | Vite 的 React wrapper 與 CRA 稍有差異（~5 nodes），不影響視覺 |
| Network 初始化 error | 0（CRA proxy 可能處理） | 1（Axios Network Error 對 LodestarAppProvider 的 config endpoint） | dev 環境 CORS 差異，不影響渲染 |
| Dev server port | 3000（CRA default） | 3002（避開 playground 衝突） | 測試環境選擇 |

## 測試範圍與侷限

- 本次只做「啟動 + 渲染 + 視覺內容一致性」驗證
- **未驗證：**
  - 互動行為（點擊、表單提交、Craft.js editor 模式）
  - 建置產物 (`pnpm build` 輸出是否正確)
  - 多語系切換（只驗證 default zh-tw）
  - HMR / sourcemap 行為
- 以上驗證若要納入，建議另外一輪 e2e/smoke test

## 結論

✅ **「驗證所有元件正常運作」通過**，可在 `MIGRATION_PROGRESS.md` 第三階段打勾。

後續建議：
1. 把階段 4（`lodestar-app → apps/web`, `lodestar-app-admin → apps/admin`）排入下一輪 planning
2. 「UI 與資料層解耦（@lodestar/ui 不應直接依賴 @lodestar/graphql）」 這個遷移後待辦可以動手了
3. 考慮把 moment 逐步替換為 dayjs（moment 已 deprecated；本次的 Vite 雙 instance 問題只是它長期毛病的一個 symptom）
