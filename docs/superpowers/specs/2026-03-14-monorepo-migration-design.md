# Monorepo 遷移設計文件

> 日期：2026-03-14
> 狀態：已確認

## 目標

將 `lodestar-app-element`、`lodestar-app`、`lodestar-app-admin` 三個 repo 整合為一個 monorepo，
並將 `lodestar-app-element` 按功能層拆分為獨立 packages。

## 工具選擇

| 用途 | 工具 |
|---|---|
| 套件管理 + workspace | pnpm workspaces |
| 任務編排 + 建置快取 | moon |
| Runtime 版本管理 | mise |
| 環境變數自動載入 | direnv |
| 機密管理 | sops |
| Formatter | oxfmt |
| Node 版本 | 22 |

## 目錄結構

```
lodestar/
├── .moon/
│   └── workspace.yml
├── pnpm-workspace.yaml
├── package.json                  # root (private)
├── tsconfig.base.json
├── .mise.toml
├── .envrc
├── MIGRATION_PROGRESS.md
│
├── packages/
│   ├── types/                    # @lodestar/types
│   ├── helpers/                  # @lodestar/helpers
│   ├── graphql/                  # @lodestar/graphql
│   ├── contexts/                 # @lodestar/contexts
│   ├── hooks/                    # @lodestar/hooks
│   └── ui/                       # @lodestar/ui
│
├── apps/
│   └── element-demo/             # Vite + React demo app
│
└── docs/
    └── superpowers/
        └── specs/
```

## Package 拆分對應

### @lodestar/types (無內部依賴)

- `src/types/` — 所有 TypeScript 型別定義 (element, data, checkout, order, member, program, product, app, general, invoice, certificate, event, post, merchandise, metaProduct, questionLibrary, token, conversionApi, options)

### @lodestar/helpers → types

- `src/helpers/` — apollo, conversionApi, adaptObject, translation, error, index

### @lodestar/graphql → types

- `src/graphql/` — fragments, queries
- `codegen.ts` — GraphQL code generation 配置
- `src/hasura.d.ts` — 生成的 Hasura 型別

### @lodestar/contexts → types, helpers

- `src/contexts/` — LodestarAppContext, AppContext, AuthContext, AuthModalContext, ApiContext, AppThemeContext, LanguageContext

### @lodestar/hooks → types, graphql, helpers

- `src/hooks/` — card, checkout, common, data, giftPlan, member, program, resource, review, tracking, utility

### @lodestar/ui → types, helpers, graphql, contexts, hooks

- `src/components/` — common (Craftize, CraftElement, 37 元件), collections, cards, blocks, buttons, forms, modals, order, event, inputs, labels, selectors, collapses
- `src/translations/` — 8 語言的翻譯檔
- `src/fonts/`, `src/images/` — 靜態資源

### apps/element-demo (Vite + React)

- `src/pages/` — 14 個 demo pages
- `src/App.tsx`, `src/index.tsx` — 現有 entry points
- `public/` — 靜態資源

## Package 依賴圖

```
apps/element-demo
  └── @lodestar/ui
        ├── @lodestar/contexts
        ├── @lodestar/hooks
        ├── @lodestar/graphql
        ├── @lodestar/helpers
        └── @lodestar/types

@lodestar/contexts → @lodestar/types, @lodestar/helpers
@lodestar/hooks → @lodestar/types, @lodestar/graphql, @lodestar/helpers
@lodestar/graphql → @lodestar/types
@lodestar/helpers → @lodestar/types
@lodestar/types → (無內部依賴)
```

## 建置配置

### TypeScript

- 共用 `tsconfig.base.json`，各 package 繼承
- 使用 TypeScript project references
- Package 間透過 source 直接引用（不需獨立編譯產出）
- 未來若需發布到 npm，再加入 tsup 做打包

### Demo App

- Vite + @vitejs/plugin-react
- 保留現有 demo pages 和路由結構

## 遷移階段

### 第一階段：建立 monorepo 骨架

1. 初始化 pnpm workspace + moon 配置
2. 設定 mise (`.mise.toml`) + direnv (`.envrc`) + sops
3. 建立 `tsconfig.base.json`
4. 設定 oxfmt 取代 prettier
5. 建立 `MIGRATION_PROGRESS.md`

### 第二階段：拆分 packages

按依賴順序由底層往上拆：

1. `packages/types`
2. `packages/helpers`
3. `packages/graphql`
4. `packages/contexts`
5. `packages/hooks`
6. `packages/ui`

### 第三階段：建立 demo app

1. 建立 `apps/element-demo` (Vite + React)
2. 將現有 pages、App.tsx 移入
3. 驗證所有元件可正常運作

### 第四階段：整合其他 repo（之後處理）

1. 將 `lodestar-app` 移入 `apps/web`
2. 將 `lodestar-app-admin` 移入 `apps/admin`
3. 改為 workspace 內部引用 `@lodestar/*`

## 已知限制

- **`@lodestar/ui` 暫時為耦合狀態** — 拆分後 `@lodestar/ui` 仍依賴所有其他 packages（contexts, hooks, graphql, helpers, types）。這是因為現有元件直接包含資料取得邏輯。Phase 2 先維持此狀態以降低遷移風險，解耦作為後續獨立任務處理。
- **Node 14 → 22 升級** — Demo app 使用 Vite 可直接運行於 Node 22，不受 CRA 4 相容性限制。Phase 4 整合 `lodestar-app` 和 `lodestar-app-admin` 時需處理 CRA 4 與 Node 22 的不相容問題（屆時可能也遷移至 Vite）。

## 各階段驗證標準

| 階段 | 驗證標準 |
|---|---|
| 第一階段 | `pnpm install` 成功、`moon check` 無錯誤、mise/direnv 正確載入 Node 22 |
| 第二階段 | 每個 package 完成後執行 `moon run <pkg>:typecheck` 通過、所有 import paths 正確解析 |
| 第三階段 | `apps/element-demo` 可啟動、所有 demo pages 可正常渲染 |
| 第四階段 | 各 app 可獨立 build、workspace 內部引用正確 |

## Git 歷史策略

- **Phase 1-3（lodestar-app-element 拆分）**：在同一 repo 內重組目錄，git history 自然保留
- **Phase 4（合併其他 repo）**：使用 `git subtree add --prefix=apps/web` 和 `git subtree add --prefix=apps/admin` 保留完整 commit history

## 待辦事項（遷移後）

- [ ] **UI 與資料層解耦** — `@lodestar/ui` 目前直接依賴 `@lodestar/graphql` 和 data hooks，應該透過 props / dependency injection 解耦，使 UI 成為純展示層
- [ ] **Node 14 → 22 相容性** — Phase 4 整合其他 app 時檢查並升級不相容的依賴
- [ ] **CRA → Vite 遷移** — 未來 web/admin apps 也從 CRA 遷移到 Vite
- [ ] **CI/CD 建置** — 設定 GitHub Actions 或其他 CI，透過 moon 編排 lint、typecheck、build 任務
