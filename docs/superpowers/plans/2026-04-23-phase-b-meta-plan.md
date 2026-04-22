# Phase B Meta-Plan — `@lodestar/ui` Props-Only Decoupling

> **狀態：** draft，等使用者 review。
> **相關：**
> - Spec: `docs/superpowers/specs/2026-04-21-ui-data-decoupling-design.md`（階段 B 章節）
> - Phase A plan: `docs/superpowers/plans/2026-04-21-data-hasura-phase-a.md`（已完成）
> - 進度表: `MIGRATION_PROGRESS.md`

## 1. 目標

把 `@lodestar/ui` 11 個元件改成 props-only：UI 不再呼叫 `useQuery`，由 consumer 透過 `@lodestar/data-hasura` 的 hook 把資料餵進來。每個 hook 搬出後，`@lodestar/ui` 少一個 `@apollo/client` / `@lodestar/graphql` 的依賴來源，為 Phase C 清 `package.json` 鋪路。

## 2. 架構決策（執行前對齊）

### 2.1 三層分工

| 層 | Package | 職責 | 依賴方向 |
|---|---|---|---|
| Presentational | `@lodestar/ui` | 純 UI 元件（`ActivityCollection` 等）、`Craftize` HOC 本體 | 不得依賴 `@lodestar/data-hasura` / `@lodestar/graphql` / `@apollo/client` |
| Data | `@lodestar/data-hasura` | 每個 query 一個 named hook（`usePublishedActivities` 等），回傳 `{ data, loading, error }` | 可依賴 `@lodestar/types` / `@lodestar/graphql` |
| Wiring | `apps/element-demo/src/craft/` | Connected wrapper（呼叫 hook，把結果餵純 UI）＋ `Craftize` 註冊 | 依賴 ui + data-hasura |

> **Craftize 不能再套 HOC**（Survey 確認：`useNode` / `useEditor` 會被外層 re-wrap 打斷）。解法：Connected wrapper 本身當作 function component 傳進 `Craftize`，例如：
> ```tsx
> const ConnectedActivityCollection: React.FC<CraftProps> = props => {
>   const { data, loading, error } = usePublishedActivities(props.source)
>   return <ActivityCollection {...props} data={data} loading={loading} error={error} />
> }
> export const CraftActivityCollection = Craftize(ConnectedActivityCollection)
> ```

### 2.2 為什麼 wiring 放 `apps/element-demo` 而不是新 package

spec 裡明示「consumer 自己 wire up」。目前唯一 consumer 是 element-demo；未來 apps/web、apps/admin 加進來之後若出現重複，再抽成 `@lodestar/element-registry` 之類的 shared package。**現在不提前建 package，避免推測性抽象。**

### 2.3 已純 UI 的 Craftized 元件怎麼處理

`CraftElement.tsx` 現在除了 data-driven 的 collection 之外，還匯出 Text / Image / Button / 版面之類的**純**craftized 元件。這些**留在 `@lodestar/ui`**（放在 `packages/ui/src/components/craft/` 或類似路徑），因為它們完全不碰 data layer，放元件庫是對的。

Phase B 結束時 `packages/ui/src/components/common/CraftElement.tsx` 只留非 data-driven 的 craftize 匯出；data-driven 的那幾個搬去 element-demo。

## 3. 成功標準（本 Phase 所有子任務完成時）

1. `grep -rn "@apollo\|@lodestar/graphql\|\buseQuery\b" packages/ui/src` 為空。
2. `packages/ui/package.json` 仍可有 `@lodestar/data-hasura`（Phase A 留的 temp dep；Phase C 再移除）但不能有新 graphql 相關 dep。
3. `pnpm -r exec tsc --noEmit` 全綠（每個子任務結束都要驗證）。
4. element-demo 15/15 路由視覺 + 行為與 master 一致（對照 `docs/superpowers/specs/2026-04-21-element-demo-parity-report.md`）。
5. craft editor 模式（`/edit-mode` 或 element-demo 的 editor 入口）drag / hover toolbar / device switching 仍可運作。

## 4. 子任務切分

每個子任務都是獨立的 plan，用 `superpowers:writing-plans` 展開成 step，再用 `superpowers:subagent-driven-development` 執行。

---

### **B-0 — Prototype：ActivityCollection end-to-end**

Spec 推薦做 prototype；只有 2 個 useQuery、266 行，風險最低。

**範圍：**
- 新增 `packages/data-hasura/src/hooks/activity.ts`
  - `usePublishedActivities({ defaultCategoryIds, defaultTagNames, limit, asc })` → `{ data: ActivityData[], loading, error }`
  - `useCustomActivities(idList: string[])` → 同上
  - Query 文件從 `@lodestar/graphql/queries` 搬過來（或直接在 hook 裡 inline `gql`，待 plan 細化時決定）
- `packages/types/src/activity.ts`（新）或在 `types/src/index.ts` 擴充：把 `ActivityData`（含 `id, title, coverUrl, sessions[], tickets[], categories[], ...`）抽成明確型別
- 重寫 `packages/ui/src/components/collections/ActivityCollection.tsx`：
  - 移除 `@apollo/client` / `@lodestar/graphql` import
  - 接收 `data: ActivityData[] | undefined`, `loading: boolean`, `error?: Error` + 原本的 presentational props
  - 將 loading / error / empty-state UI 顯式化
  - 保留 selector / carousel / variant 分支（純 UI）
- 新增 `apps/element-demo/src/craft/CraftActivityCollection.tsx`：
  - `ConnectedActivityCollection` → 依 `props.source.from` 呼叫對應 hook → 把結果餵 pure UI
  - `CraftActivityCollection = Craftize(ConnectedActivityCollection)`
- 更新 `apps/element-demo/src/pages/ActivityPage.tsx` import path（從 `@lodestar/ui/...CraftElement` 改為 `../craft/CraftActivityCollection`）

**不動：** `packages/ui/src/components/common/CraftElement.tsx` 的其他 export 暫時保留；B-3 再清。

**驗收：**
- `pnpm --filter @lodestar/ui exec tsc --noEmit` 無 apollo 相關 import 殘留於 ActivityCollection.tsx
- `pnpm -r exec tsc --noEmit` PASS
- element-demo `/activity-element` 路由 ①view 模式 ②editor 模式 兩種跑起來都跟 master 一致
- `source={{ from: 'publishedAt', limit: 3 }}` 與 `source={{ from: 'custom', idList: [...] }}` 兩 variant 都正常

---

### **B-1 — 搬 6 個其他 collection**

**清單（按複雜度排序，先易後難）：**
1. MemberCollection (171 行, 5 useQuery)
2. ProgramContentCollection (229 行, 5 useQuery)
3. ProgramPackageCollection (295 行, 5 useQuery)
4. ProjectCollection (307 行, 6 useQuery)
5. PostCollection (310 行, 6 useQuery)
6. ProgramCollection (674 行, 5 useQuery **加 source 策略分支**) ← 若過大就獨立切 B-1f

對每個檔案套用 B-0 同樣的 pattern。每搬完 1 個：
- typecheck 綠
- element-demo 對應路由跑一次

**Trigger 分拆 B-1f：** 做 ProgramCollection 時若 plan 步驟超過 15 step 或一個 session 做不完，獨立出 `docs/superpowers/plans/...-phase-b-1f-program-collection.md`。

**驗收：** 六個檔案皆無 apollo import；element-demo 6 條對應路由通過 parity。

---

### **B-2 — 搬 4 個 modal / selector**

| 檔案 | 行數 | useQuery | 備註 |
|---|---|---|---|
| CheckoutProductModal.tsx | 854 | 5 | Phase A 收尾已 rebind chakra 元件，檔案已有 context；可能需再切子任務 |
| OrderDetailDrawer.tsx | 315 | 3 | |
| PaymentSelector.tsx | 144 | 2 | |
| CreditCardSelector.tsx | 89 | 2 | |

這幾個**不是 Craftize 元件**（是其他元件內部使用），搬法簡單：抽 hook → 搬 `@lodestar/data-hasura` → UI 改收 props → caller（通常是其他 ui 元件或 page）餵資料。caller 本身就在 `@lodestar/ui`，因此這些 caller 也會同步改成呼叫 hook。

**Trigger 分拆 B-2a：** `CheckoutProductModal.tsx` 本身若過大就獨立一個 sub-plan。

**驗收：** 四個檔案皆無 apollo import；所有 caller 改完後 ui package tsc 綠；element-demo 相關 checkout / order / payment 路由通過 smoke test。

---

### **B-3 — `CraftElement.tsx` 終態整理**

做完 B-0/B-1/B-2 之後，`packages/ui/src/components/common/CraftElement.tsx` 的 data-driven Craftized 匯出已全部搬去 element-demo。剩下的純 UI Craftized（Text / Image / Button / 版面之類）要決定留哪：

- **方案 P1**：留在 ui package，檔名從 `CraftElement.tsx` 改為 `CraftPureElements.tsx`，只含非 data-driven 的 Craftize 包裝。
- **方案 P2**：全部搬去 `apps/element-demo/src/craft/`，讓 ui 完全不含 Craftize 相關（只留 `Craftize` HOC 本身供 consumer 用）。

Plan 寫到 B-3 時再用 brainstorming 確定；目前傾向 P1，保留作為元件庫對 Craft.js 的 built-in support。

同時更新 `packages/ui/src/index.ts` barrel，把 Craft 元件 export 調整到對應新檔名。

**驗收：** ui 裡仍導出的 Craftized 元件都不含 useQuery；element-demo 所有 page 都 import 自 `apps/element-demo/src/craft/` 或 `@lodestar/ui`（視方案）。

---

### **B-4 — Phase B 封口：15/15 parity + 文件**

- 跑 `docs/superpowers/specs/2026-04-21-element-demo-parity-report.md` 裡的 15 路由比對，確認 Phase B 完工後沒有 regression
- 跑 `grep` 套一次成功標準第 1-2 條
- 更新 `MIGRATION_PROGRESS.md`：
  - Phase B 打勾
  - 補記 CraftElement.tsx 的最終處置（P1 或 P2）
- 在 spec 加上「Phase B completed」日期戳記

**不屬於 Phase B：** `@lodestar/ui/package.json` 等 package.json 依賴清洗 → Phase C。B-4 只驗證 feature parity。

---

## 5. 執行順序與並行性

```
B-0 ─► B-1 ─► B-2 ─► B-3 ─► B-4
```

B-0 必須先完成，確立 pattern。B-1 / B-2 的 6+4 個檔雖然互不相關，但**不建議並行**：
- 每個搬動都會更新 `@lodestar/data-hasura` barrel、`apps/element-demo/src/craft/` 登記、element-demo page
- 多個 subagent 同時改這些共享檔案一定衝突

正確做法：B-0 做完後，在 B-1 階段用 **subagent-driven-development** 一次派一個 subagent 做一個檔案，controller 保持在同一個 session 內序列化。

## 6. 風險與降險（跨所有子任務）

| 風險 | 降險 |
|---|---|
| Craftize 與 connected wrapper 組合在 editor 模式下失效（drag / toolbar 不 work） | B-0 把 editor 模式驗證列為驗收項；B-1/B-2 每搬完做同樣檢查 |
| ProgramCollection 的 source 策略太複雜，硬搬會破功能 | B-1 先做其他 5 個，把 pattern 練熟再碰；觸發時切 B-1f |
| `@lodestar/hooks` 仍有元件呼叫的 hook 混雜 | Phase A 已搬；若 B 期間發現遺漏，開子任務處理 |
| element-demo 裡的 craft 元件註冊列表（若 Craft.js 需要 `resolver` map）沒更新 → editor 載入壞掉 | B-0 調查 element-demo 的 craft editor 啟動流程，確認每加 1 個 Craftized 都要註冊 |
| Hook 查詢變數的預設值或 fallback 行為跟原 inline useQuery 不一致 | 每個 hook 都用 master 同條 query 的 variables 做差異比對；B-0 做 snapshot test |

## 7. 決定事項（請使用者確認）

1. **B-3 方案選 P1（ui 留純 Craftized）還是 P2（全部搬去 element-demo）？** 預設 P1。
2. **B-0 prototype 驗收時，editor 模式要手動測還是要寫 smoke test？** 目前規劃手動測，自動化留給後續 CI brainstorm。
3. **B-1 / B-2 碰到的子任務拆分條件（> 15 step 或單 session 做不完）是否合理？** 可調。
4. **每個子任務完成是否都要獨立 commit 成一連串小 commit？** 預設每個檔案 1 commit（共 ~11 commit）加上 barrel / page 同步的附帶 commit。

---

## 8. 下一步

對齊這份 meta-plan 後，由 controller（我）展開 `B-0` 的完整 step plan（`docs/superpowers/plans/2026-04-XX-phase-b-0-activity-collection.md`），再用 subagent-driven-development 執行。Plan 要先讓 `superpowers:brainstorming` 檢查一次邊界再交付實作。
