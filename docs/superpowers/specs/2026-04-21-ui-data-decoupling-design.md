# UI / Data Layer Decoupling — `@lodestar/ui` 完全去 graphql 化

**日期：** 2026-04-21
**分支：** refactor/v1
**相關：** `MIGRATION_PROGRESS.md` 遷移後待辦「UI 與資料層解耦（@lodestar/ui 不應直接依賴 @lodestar/graphql）」
**前提：** 階段 3 已封口（`2026-04-21-element-demo-parity-report.md`），element-demo 作為驗證基準可用

## 背景與動機

目前 `@lodestar/ui` 同時承擔 presentational UI 與資料抓取兩個職責 — 12 個元件檔案直接 `import { useQuery } from '@apollo/client'` + `import hasura from '@lodestar/graphql/hasura'`。`@lodestar/contexts` 與 `@lodestar/hooks` 同樣混入 graphql 相依。

三個動機（user 確認三者皆要）：
- **A. 資料源可替換** — 未來可能要支援 REST / mock / 不同 schema
- **B. 視覺測試可獨立** — Storybook 與 unit test 不該需要真實 apollo client
- **C. 模組邊界清楚** — UI package 就該只管 UI

## 終點架構

```
@lodestar/ui            ← 純 presentational，props-only，零 graphql/apollo
@lodestar/contexts      ← 純 context（Auth/Theme/Language/AuthModal/LodestarApp），零 graphql
@lodestar/hooks         ← 純 utility hooks（util, checkout），零 graphql
@lodestar/data-hasura   ← 新 package：所有 data hooks + ApolloProvider + AppContext
@lodestar/helpers       ← 純 helpers（如 settings），apollo helper 搬去 data-hasura
```

Consumer（element-demo / 未來 web / admin）自己 wire up：

```tsx
// 舊
<CraftProgramCollection variant="card" source={{...}} />

// 新
const programs = usePublishedPrograms(source)  // from @lodestar/data-hasura
<ProgramList programs={programs} variant="card" />

// 或若要保留 craft editor 整合，可以在 consumer 寫 wrapper：
const CraftProgramCollection = Craftize(props => {
  const programs = usePublishedPrograms(props.source)
  return <ProgramList {...props} programs={programs} />
})
```

## 非目標

- **不**實作其他 data source（REST、mock）— 只建立架構，之後需要時再加 `@lodestar/data-rest`
- **不**動 `@lodestar/ui` 的 styling / Chakra / Craft.js 部分
- **不**做 CI/CD（下一輪獨立 brainstorm）
- **不**動 `apps/playground`（獨立沙盒）
- **不**拆 `Auth/AuthModal/AppTheme/Language/LodestarApp` contexts（已經是 pure）
- **不**改動 GraphQL schema / `@lodestar/graphql` 套件本身

## 要搬動的檔案清單

### `@lodestar/ui/src/`（11 個）— 改 props-only，graphql 部分抽到 data-hasura

| 檔案 | useQuery 次數 | 行數 |
|---|---|---|
| components/collections/ProgramCollection.tsx | 5 | 674 |
| components/collections/ProgramContentCollection.tsx | 5 | 229 |
| components/collections/ProgramPackageCollection.tsx | 5 | 295 |
| components/collections/ActivityCollection.tsx | 5 | 266 |
| components/collections/PostCollection.tsx | 6 | 310 |
| components/collections/MemberCollection.tsx | 5 | 171 |
| components/collections/ProjectCollection.tsx | 6 | 307 |
| components/modals/CheckoutProductModal.tsx | 5 | 854 |
| components/order/OrderDetailDrawer.tsx | 3 | 315 |
| components/selectors/PaymentSelector.tsx | 2 | 144 |
| components/selectors/CreditCardSelector.tsx | 2 | 89 |

全部都是 query（無 mutation）。`components/common/Tracking.tsx` 當初誤判，實際只用 `useQueryParam`（URL 參數），不在範圍內。

每個元件拆法：
1. 留下純 presentational 部分（收 `data`, `loading`, `error` 等 props）
2. 每個 `useQuery` 變成一個 named hook（e.g. `usePublishedPrograms`），搬到 `@lodestar/data-hasura`
3. 若元件內部有 source 策略 branching（如 ProgramCollection），**branching 邏輯留在 consumer 層**（由 consumer 呼叫對應 hook 餵資料），UI 端只收最終的 `programs` 陣列。這讓 UI 真正 props-only，不需知道「source 型別」這種 data fetching 概念

### `@lodestar/hooks/src/` → 搬到 `@lodestar/data-hasura/src/hooks/`（9 個）

`data.ts, tracking.ts, giftPlan.ts, program.ts, common.ts, card.ts, review.ts, member.ts, resource.ts`

**留在 `@lodestar/hooks`：** `util.ts`（含 `parsePayload`、`decodeJwtPayload` 等純 utility）、`checkout.ts`、`index.ts`

### `@lodestar/contexts/src/` → 搬到 `@lodestar/data-hasura/src/contexts/`（2 個）

- `ApiContext.tsx`（ApolloProvider 包裝）
- `AppContext.tsx`（`useQuery(GET_APP)` 拿 app settings）

**留在 `@lodestar/contexts`：** `AppThemeContext`, `AuthContext`, `AuthModalContext`, `LanguageContext`, `LodestarAppContext`

### `@lodestar/helpers/src/apollo*` → 搬到 `@lodestar/data-hasura/src/apollo*`

（`createApolloClient`, `ApolloClientOptions` 等）

### Package.json 清洗

**移除下列依賴：**

| Package | 移除 |
|---|---|
| `@lodestar/ui` | `@apollo/client`, `graphql`, `graphql-ws`, `@lodestar/graphql` |
| `@lodestar/contexts` | `@apollo/client`, `@lodestar/graphql` |
| `@lodestar/hooks` | `@apollo/client`, `@lodestar/graphql` |
| `@lodestar/helpers` | `@apollo/client`（如果有的話） |

**`@lodestar/data-hasura` 新增這些依賴。**

## 執行策略（3 階段）

### 階段 A：建立 `@lodestar/data-hasura` 並搬 hooks + contexts + apollo helper（**內容搬移 + 保留對外 API**）

- 建 `packages/data-hasura/`，package.json、tsconfig、moon.yml、src/index.ts
- 加入 workspace（pnpm-workspace、tsconfig.json references、moon）
- 搬 9 個 hook 檔、2 個 context 檔、apollo helper
- `@lodestar/hooks`、`@lodestar/contexts` 的 `src/index.ts` 先保留 re-export（從新 package 轉出），以不破壞 `@lodestar/ui` 目前依賴
- 更新 element-demo 的 LodestarAppProvider 組裝順序（把 ApiContext/AppContext 從 contexts 換成 data-hasura import）
- **驗證：** element-demo 15 條路由一致（用既有 parity script）

### 階段 B：`@lodestar/ui` 改 props-only（**真正的 decoupling**）

- 每個 ui 檔案：
  1. 抽 useQuery 出去 → 成為 `@lodestar/data-hasura` 的 hook 匯出
  2. 本體改 props-only，明確宣告需要的資料型別
  3. 刪掉 apollo import
- 更新 `CraftElement.tsx`：craft wrapper 轉成 "connected" 形式（在 craft layer 呼叫 hook 後餵 pure ui）
- 更新 element-demo 的頁面（如 `ProgramElementPage`）適應新 API
- **驗證：** 每搬完 1 個元件，跑 element-demo 對應路由 smoke test；全部完成後跑 15 條路由對比

### 階段 C：package.json 清洗 + 移除 re-export shim

- `@lodestar/ui/package.json` 移除 4 個 graphql 相關依賴
- `@lodestar/contexts/package.json` 移除 2 個
- `@lodestar/hooks/package.json` 移除 2 個
- 把階段 A 加的 re-export 清掉，強制 consumer 直接 import `@lodestar/data-hasura`
- `pnpm install` + `pnpm typecheck` + 跑 element-demo 最終驗證
- 更新 `MIGRATION_PROGRESS.md` 打勾「UI 與資料層解耦」

## 風險與降險

| 風險 | 降險 |
|---|---|
| ProgramCollection 內部 source 策略過於複雜，拆成 hook 後 consumer 要寫一堆 branching | 先 prototype 一個 collection（建議 ActivityCollection — 較單純），跑通後再推 ProgramCollection |
| `CraftElement.tsx` 的 `Craftize()` 與 Craft.js 編輯模式耦合，改成 connected 時可能壞掉 | 階段 B 每搬一個就實測 editor 模式（`?editing=1`） |
| TypeScript references 更新後 project references 失敗 | 參照階段 3 剛驗證過的結構，加 data-hasura 到 tsconfig.json references |
| `@lodestar/hooks` 的 `index.ts` 目前可能 barrel export 所有 hook；搬出去會斷 | 階段 A 先把 index.ts 改 re-export form new package 避免斷 |
| element-demo 跑不起來 | 每階段完成都跑 parity verification（可重用既有 DOM 擷取 script） |

## 成功標準

1. `@lodestar/ui`, `@lodestar/contexts`, `@lodestar/hooks` 的 package.json **完全沒有** `@apollo/client`、`graphql`、`graphql-ws`、`@lodestar/graphql`
2. `grep -r "@apollo\|@lodestar/graphql" packages/ui/src packages/contexts/src packages/hooks/src` 結果為空
3. element-demo 在完成後仍 15/15 路由視覺一致（對照 master）
4. 新 `@lodestar/data-hasura` 對外匯出所有原本 ui 內用的 data hooks

## 後續

完成後開下一輪 brainstorm：CI/CD（可在 pipeline 加入「禁止 @lodestar/ui 引用 @apollo/client」的 eslint 規則防回流）。
