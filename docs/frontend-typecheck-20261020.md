# 前端型別與 production build 修正（2026-10-20）

## 結果與根因

在原編譯器／測試型別修正後，使用者擴大範圍要求清除既有建置阻擋。本次完整型別診斷從 12 個降至 0；不更改 strict、不排除來源或測試、不略過 CRA 型別檢查。

原 TypeScript 4.4.3 無法解析 SWR 2.2.5 的 inline type export；app 另有 react-reader。根編譯器已升為 4.9.5，符合 CRA 4 的 ^3.2.1 || ^4 peer range，補 @types/jest 26.0.24 與 Promise mocks。剩餘業務錯誤可在基準以相同工具重現；auth 新增的錯誤只在測試型別，已修正。先前「只列既有業務錯誤」的範圍已由本次修正取代。

- 原基準：`af1c663e156c8c0abcfac36b388122c65ae6f610`。
- 原 auth HEAD：`ec131da33d98cdc1933d73f9f4461ea4834a4481`（[#142](https://github.com/urfit-tech/lodestar-app-element/pull/142)）。
- 前輪 fresh subagent review 僅涵蓋編譯器／測試型別 commit；本輪新增業務修正經主 agent 複查，仍待同事 review。

## 本輪變更

- CustomRatioImage 的 className 改為 optional，符合 styled-components 注入 class 與既有呼叫方式。
- Activity／Post／Project 集合改用 Pick 與明確的巢狀 Pick，避免 DeepPick 把 Date 方法拆壞，同時移除這幾處舊 ts-ignore。
- Card 的 shouldForwardProp 補正參數型別；Craftize 明確保留 generic P、customStyle 與 backgroundImages。styled-components 的 Omit 泛型邊界保留一處有說明的 unknown assertion，不放寬呼叫端 props；SSR 測試確認 mobile props、media styles、className 傳遞。
- Coupon API 的數字字串／null 最低消費轉為 number；API 未提供的 count／remaining 改為 optional，不捏造庫存數值，新增正規化測試。

## 驗證

- Node 18.20.8／Yarn 1.22.22／TypeScript 4.9.5。
- `tsc --noEmit --pretty false`：通過，0 diagnostics。
- 全部 9 suites／47 tests 通過，包括原 auth 測試。
- production build：通過。保留既有 ESLint／Browserslist 警告，沒有透過新增忽略設定消除錯誤；CI=false 是原 build script 行為。
- 本輪未更動 element 的 package.json 或 yarn.lock；沿用前輪已驗證的 frozen install。型別／測試／demo build 在隔離 worktree 執行，依賴 overlay 使用既有套件，根 TypeScript 為 4.9.5。
- 另實跑套件的 CRA demo production build；這不等於已發布 tag。repo 的 Volta Node 14 設定沒有更動，本輪實測 Node 18.20.8。
- 前輪以 CRA 4 的 webpack 4.44.2／fork-ts-checker 4.1.6 實測 TS 4.9.5：合法 fixture 通過、故意錯誤可被攔下、修復後恢復通過。@typescript-eslint 4.33 宣告支援範圍 <4.5，實測成功不代表所有 parser 行為受官方保證。

## 依賴與部署順序

本 PR [#143](https://github.com/urfit-tech/lodestar-app-element/pull/143) 的 base 為 `master`，包含原 auth PR 的 ancestry。原 auth PR 未合併前，GitHub diff 會包含 auth 變更。先合併原 auth PR，再處理本 PR；如果採 squash／rebase merge，以原 auth HEAD `ec131da33d98cdc1933d73f9f4461ea4834a4481` 為界，只把後續修正 rebase 到新 base，確認 diff 後重跑驗證，避免重複引入 auth commits。

此處是同事 review 後的計畫，這輪沒有 merge、部署或 tag：

1. app #749 → #750；admin #764 → #766，各自的 auth 與建置修正作為同一部署單位。先部署這兩個前端。
2. 再部署 backend #426，沿用 doc §8、§10、§12 的契約。此輪不改 retryAfter、60 秒冷卻、每會員每小時 5 封或既有同 IP 15 分鐘 200 次登入限流。
3. element #142 → #143 之後另外發 tag；目前 app／admin 的 patch 固定於舊版 element，不需要先更新套件。未來升級 tag 時，確認上游已包含相同修正，再移除本地 patch；auth 本地相容副本／replacement 也要另驗證後才能移除。

新前端＋舊後端：仍處理既有成功／拒絕回應，缺少 retryAfter 時使用 60 秒 fallback。新前端＋新後端：顯示對應拒絕訊息及實際 retryAfter。舊前端＋新後端：仍可能忽略 retryAfter、顯示 Axios 原始錯誤或卡載入，因此維持前端先部署。此次型別／建置修正不改這些相容性規則。

## CI

推送後檢查新 HEAD 的 CodeQL；CodeQL 不取代本地 typecheck／production build。 最新 HEAD／結果記錄於 PR 描述。
