# Monorepo 遷移進度

> 設計文件：docs/superpowers/specs/2026-03-14-monorepo-migration-design.md
> 實作計畫：docs/superpowers/plans/2026-03-14-monorepo-migration.md

## 第一階段：建立 monorepo 骨架

- [x] pnpm workspace 初始化
- [x] mise + direnv + sops 設定
- [x] moon 配置
- [x] tsconfig.base.json
- [x] prettier 移除（oxfmt 待設定）
- [x] MIGRATION_PROGRESS.md 建立

## 第二階段：拆分 packages

- [x] @lodestar/types
- [x] @lodestar/helpers
- [x] @lodestar/graphql
- [x] @lodestar/contexts
- [x] @lodestar/hooks
- [x] @lodestar/ui
- [x] 更新所有跨 package import paths

## 第三階段：建立 demo app

- [x] apps/element-demo (Vite + React)
- [x] 驗證所有元件正常運作（見 `docs/superpowers/specs/2026-04-21-element-demo-parity-report.md`，15/15 路由視覺一致；過程中修好 i18n glob path 與 moment locale 兩個 Vite regression）
- [x] 清理 src/ 殘留檔案

> **關於 `apps/playground`：** 這是一個獨立的 tech stack 沙盒（React 19 + Tailwind + TanStack Start + Apollo v4），**不是本遷移的目標**，也不屬於任何階段的產物。內容是 Haute Pâtisserie 會議 demo，用途是驗證未來可能採用的新技術棧可行性，與 master 的元件庫無關聯。詳見 `docs/superpowers/specs/2026-04-21-playground-gap-analysis.md`（該報告初始前提誤把 playground 視為遷移目標，結論保留作為此誤解的存證）。

## 第四階段：整合其他 repo（之後處理）

- [ ] lodestar-app → apps/web
- [ ] lodestar-app-admin → apps/admin

## 待辦（遷移後）

- [ ] UI 與資料層解耦（@lodestar/ui 不應直接依賴 @lodestar/graphql）
  - 設計：`docs/superpowers/specs/2026-04-21-ui-data-decoupling-design.md`
  - [x] Phase A: 建立 `@lodestar/data-hasura`，搬 9 個 hook 檔 + ApiProvider/AppProvider + apollo helper（見 `docs/superpowers/plans/2026-04-21-data-hasura-phase-a.md`；element-demo 15/15 路由仍一致）
  - [ ] Phase B: `@lodestar/ui` 改 props-only
  - [ ] Phase C: 清洗 package.json 依賴
- [ ] CI/CD 建置
- [x] 解決 barrel export 名稱衝突（types/index.ts, ui/index.ts 中的重複 export）
- [x] oxfmt + oxlint 完整設定
