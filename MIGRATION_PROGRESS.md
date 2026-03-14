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
- [ ] 驗證所有元件正常運作
- [x] 清理 src/ 殘留檔案

## 第四階段：整合其他 repo（之後處理）

- [ ] lodestar-app → apps/web
- [ ] lodestar-app-admin → apps/admin

## 待辦（遷移後）

- [ ] UI 與資料層解耦（@lodestar/ui 不應直接依賴 @lodestar/graphql）
- [ ] CI/CD 建置
- [ ] 解決 barrel export 名稱衝突（types/index.ts, ui/index.ts 中的重複 export）
- [ ] oxfmt 完整設定
