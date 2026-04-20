# Playground Gap Analysis 報告

**日期：** 2026-04-21
**設計文件：** `docs/superpowers/specs/2026-04-21-playground-gap-analysis-design.md`
**驗證環境：**
- Master（舊版基準）：`origin/master` worktree @ `../lodestar-app-element-master`，Node 16 + yarn 1，port 3001
- Playground（新 stack 目標）：當前 `refactor/v1` 的 `apps/playground`，React 19 + TanStack Start，port 3000

## 執行摘要

**結論：playground 目前對 lodestar-app-element 的元件覆蓋率 = 0%**

`apps/playground` 目前是一個完全獨立的 **「Haute Pâtisserie」糕點研討會 demo**（speakers/talks/schedule），用來驗證新 tech stack（React 19 + Tailwind + TanStack Start + Apollo v4）可行性。尚未開始 port 任何 lodestar element 頁面。

Master 的 15 條路由 demo 了整個 element 庫（課程、活動、會員、金流、AI bot 等），這些在 playground 中 **完全沒有對應實作**。

## Master（origin/master）路由清單

以 http://localhost:3001 觀察到的實際渲染內容：

| # | Route | 用途 | 渲染摘要（DOM 節點數） |
|---|---|---|---|
| 1 | `/` | Home（導航清單） | 15 條連結 (51 nodes) |
| 2 | `/auth` | AuthPage | Login 表單 (56 nodes) |
| 3 | `/member` | MemberElementPage | 會員元件（需登入才有內容） (185 nodes) |
| 4 | `/programs` | ProgramElementPage | 課程清單：「admin 測試OG」「test1 指定方案的未發布課程」「版型三」等 (176 nodes) |
| 5 | `/program-contents` | ProgramContentCollectionPage | 課程內容 collection（無登入空內容） (52 nodes) |
| 6 | `/program-package` | ProgramPackagePage | 課程包：「設計師核心能力 3 堂課 約 1240 分鐘」 (74 nodes) |
| 7 | `/project` | ProjectElementPage | 募資專案元件（無資料空容器） (155 nodes) |
| 8 | `/activity` | ActivityPage | 活動分類：「全部分類 --- --- ---」 (98 nodes) |
| 9 | `/layout` | LayoutPage | Craft.js 版型 demo：「1 2 3 4 5 test」 (66 nodes) |
| 10 | `/text` | TextPage | 富文字元件（空） (57 nodes) |
| 11 | `/carousel` | CarouselPage | Carousel demo：「A B C D 1 2 3」 (135 nodes) |
| 12 | `/image` | ImagePage | Image 元件（空） (71 nodes) |
| 13 | `/checkout` | CheckoutPage | 結帳：「免費 自動訂閱結帳產品模組 結帳產品模組」 (57 nodes) |
| 14 | `/ai-bot` | AIBotPage | AI Bot 申請表單：「你的名字、想申請的公司名稱、職位名稱、送出」 (72 nodes) |
| 15 | `/event` | MemberEventCalendarBlock | 會員行事曆（空） (52 nodes) |

技術棧：React 17、Chakra UI 1.x、Craft.js、react-router-dom v5、react-intl、styled-components、LodestarAppProvider（Apollo 3 + REST）。

## Playground 現況（refactor/v1）

以 http://localhost:3000 觀察到的實際狀態：

| Route | 內容 | 與 lodestar-app-element 關聯 |
|---|---|---|
| `/` | Haute Pâtisserie 會議首頁（hero + featured speakers/talks） | ❌ 無關 |
| `/about` | 會議 about 頁 | ❌ 無關 |
| `/speakers` + `/speakers/$slug` | 講者列表與詳情 | ❌ 無關 |
| `/talks` + `/talks/$slug` | 演講列表與詳情 | ❌ 無關 |
| `/schedule` | 會議排程 | ❌ 無關 |
| `/demo/store` | TanStack Store demo | ❌ 技術 POC |
| `/demo/tanstack-query` | TanStack Query demo | ❌ 技術 POC |
| `/demo/i18n` | Paraglide i18n demo | ❌ 技術 POC |
| `/demo/apollo-client` | Apollo Client demo（**目前仍 500**，需 GraphQL endpoint 配置；import bug 已修） | ❌ 技術 POC |

技術棧：React 19、Tailwind 4、TanStack Start/Router/Query/Store、Apollo v4、content-collections、Paraglide、Vite 7。

## Gap 對照表

| Master Route | Playground 狀態 | Notes |
|---|---|---|
| `/` | ❌ 不存在對應 element demo 列表 | playground 有自己的 `/` 但內容完全不同（會議 hero），需要新增一個 element demo index 頁 |
| `/auth` | ❌ 不存在 | 需 port AuthContext / Login UI |
| `/member` | ❌ 不存在 | 需 port MemberElementPage 相關元件 + 登入態 |
| `/programs` | ❌ 不存在 | 需 port ProgramCollection、ProgramCard 等多個 @lodestar/ui 元件 |
| `/program-contents` | ❌ 不存在 | 需 port ProgramContentCollection 相關元件 |
| `/program-package` | ❌ 不存在 | 需 port ProgramPackageCard、ProgramPackagePage |
| `/project` | ❌ 不存在 | 需 port ProjectElement（募資） |
| `/activity` | ❌ 不存在 | 需 port ActivityCollection、ActivityCard |
| `/layout` | ❌ 不存在 | 需要決定：Tailwind 版 Craft.js 整合策略 |
| `/text` | ❌ 不存在 | 富文字 block（braft-editor 依賴 React 16，需換） |
| `/carousel` | ❌ 不存在 | Carousel block port |
| `/image` | ❌ 不存在 | Image block port |
| `/checkout` | ❌ 不存在 | 最複雜：CheckoutProductModal、PaymentGateway logic、金流設定 |
| `/ai-bot` | ❌ 不存在 | AI Bot form（含表單邏輯） |
| `/event` | ❌ 不存在 | MemberEventCalendarBlock |

**覆蓋率：0/15（0%）**

## 已識別的 porting 阻礙

1. **基礎設施層未建立**
   - `LodestarAppProvider`（@lodestar/contexts）目前綁 Apollo 3；playground 已用 Apollo v4，provider 需重寫或抽象層
   - `i18n` 從 `react-intl` 改 Paraglide（translation key 格式不同，需遷移）
   - `styled-components` 與 `Chakra UI 1.x` 在 playground 中不存在（Tailwind），多數元件視覺需重寫
2. **Craft.js 整合**
   - `/layout` `/carousel` `/image` `/text` 都依賴 Craft.js editor 模式
   - Craft.js v0.1.0-beta.20 peer deps 鎖 React 16，playground 用 React 19 → 需升級或換方案
3. **依賴版本不相容**
   - `braft-editor`、`react-responsive`、`framer-motion@2` 等都鎖 React 16
   - 多個 @lodestar/ui 元件依賴這些套件 → port 時需全面升級或替換
4. **`@lodestar/*` packages 目前未被 playground 引用**
   - playground 沒有任何 `@lodestar/*` import
   - 要嘛 playground 重寫所有元件（保留共用商業邏輯），要嘛 @lodestar/ui 先完成 React 19 / Tailwind 適配再被 playground 引用

## 建議後續步驟

1. **決策點：playground 的角色定位**
   - (a) 成為新 stack 的 production app，取代 element-demo → 需完整 port 15 個頁面
   - (b) 保持為 tech stack 沙盒，另開 `apps/element-demo-v2` 做正式遷移目標
2. **若選 (a)：**
   - 以 `/carousel` / `/image` / `/layout` 等靜態簡單 block 為第一批（不需 backend）
   - 再做 `/auth` / `/member` 建立登入態
   - `/checkout` / `/ai-bot` 放最後（依賴最多）
3. **基礎設施先行：**
   - 在 @lodestar/ui 建立 Tailwind 版變體（漸進取代 Chakra）
   - LodestarAppProvider 支援 Apollo v4
   - Craft.js 升級評估或替代方案（可能完全不需要，若 playground 不做 editor 模式）
4. **撰寫 `docs/superpowers/plans/YYYY-MM-DD-playground-port-phase1.md`** 挑出第一批要 port 的頁面與路徑

## 附註

- 本次執行過程中修了 `apps/playground/src/routes/demo.apollo-client.tsx` 一行 import（Apollo v4 把 `TypedDocumentNode` 與 `gql` 從根 export 搬到 `/core`），這是 playground 本身的 bug，不是 port 工作
- `/demo/apollo-client` 仍回 500，是因為該路由在 loader 中呼叫 `preloadQuery` 但未配置實際 GraphQL endpoint — 與本次分析無關
- Master worktree 保留在 `../lodestar-app-element-master`，後續分析可繼續使用；欲清理執行 `git worktree remove ../lodestar-app-element-master`
