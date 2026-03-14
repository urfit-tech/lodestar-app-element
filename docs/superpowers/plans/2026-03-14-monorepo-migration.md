# Monorepo 遷移實作計畫

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 lodestar-app-element 轉換為 pnpm + moon monorepo，按功能層拆分為 @lodestar/* packages，並建立 Vite demo app。

**Architecture:** 在現有 repo 內建立 monorepo 骨架，按依賴順序由底層往上將 src/ 下的程式碼搬移至 packages/，最後建立 apps/element-demo 作為開發入口。使用 TypeScript project references 讓 packages 間直接引用 source。

**Tech Stack:** pnpm workspaces, moon, mise, direnv, sops, oxfmt, Vite, React 17, TypeScript, Apollo Client, Craft.js

**Spec:** `docs/superpowers/specs/2026-03-14-monorepo-migration-design.md`

---

## Chunk 0: 前置準備

### Task 0: 建立基線與前置檢查

- [ ] **Step 1: 確認當前分支並建立遷移分支**

```bash
git checkout -b refactor/monorepo-migration
```

- [ ] **Step 2: 確認現有專案可正常運作（建立基線）**

```bash
yarn install && yarn start
```
Expected: 開發伺服器正常啟動

- [ ] **Step 3: 更新 .gitignore**

在 `.gitignore` 中加入 monorepo 相關的忽略項目：

```
# moon
.moon/cache/

# Package dist
packages/*/dist/
apps/*/dist/

# pnpm
node_modules/
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: update .gitignore for monorepo structure"
```

---

## Chunk 1: Monorepo 骨架建立

### Task 1: 初始化 pnpm + root package.json

**Files:**
- Create: `pnpm-workspace.yaml`
- Modify: `package.json` (轉為 root workspace package)
- Delete: `yarn.lock` (遷移至 pnpm)

- [ ] **Step 1: 安裝 pnpm（若尚未安裝）**

```bash
corepack enable && corepack prepare pnpm@latest --activate
```

- [ ] **Step 2: 建立 pnpm-workspace.yaml**

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

- [ ] **Step 3: 修改 root package.json**

將現有 `package.json` 修改為 root workspace package：
- 設定 `"private": true`
- 移除 `"homepage"`, `"browserslist"` 等 CRA 專屬欄位
- 保留共用的 devDependencies（oxfmt, typescript 等）
- 移除 app-specific dependencies（這些會移到各 package）
- 移除 `"scripts"` 中的 CRA 指令（start, build, test, eject）
- 加入 workspace-level scripts

```json
{
  "name": "lodestar",
  "private": true,
  "scripts": {
    "format": "oxfmt .",
    "typecheck": "moon run :typecheck"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^22.0.0"
  },
  "packageManager": "pnpm@10.x"
}
```

- [ ] **Step 4: 使用 pnpm import 遷移 lockfile，然後刪除 yarn.lock**

```bash
pnpm import
rm yarn.lock
pnpm install
```

`pnpm import` 會從 `yarn.lock` 匯入精確的依賴解析，避免版本漂移。

- [ ] **Step 5: 驗證**

```bash
pnpm install
```
Expected: 安裝成功，產生 `pnpm-lock.yaml`

- [ ] **Step 6: Commit**

```bash
git add pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc
git rm yarn.lock
git commit -m "chore: initialize pnpm workspace"
```

---

### Task 2: 設定 mise + direnv + sops

**Files:**
- Create: `.mise.toml`
- Create: `.envrc`
- Create: `.sops.yaml`

- [ ] **Step 1: 建立 .mise.toml**

```toml
[tools]
node = "22"
```

- [ ] **Step 2: 建立 .envrc**

```bash
use mise
```

- [ ] **Step 3: 建立 .sops.yaml**

```yaml
creation_rules:
  - path_regex: \.env\.encrypted$
    age: '<your-age-public-key>'
```

注意：需要替換為實際的 age public key。如果尚未建立 age key，先執行：
```bash
age-keygen -o ~/.config/sops/age/keys.txt
```

- [ ] **Step 4: 啟用 direnv**

```bash
direnv allow
```

- [ ] **Step 5: 驗證 Node 版本**

```bash
node --version
```
Expected: `v22.x.x`

- [ ] **Step 6: Commit**

```bash
git add .mise.toml .envrc .sops.yaml
git commit -m "chore: add mise + direnv + sops configuration"
```

---

### Task 3: 設定 moon

**Files:**
- Create: `.moon/workspace.yml`

- [ ] **Step 1: 安裝 moon（透過 mise）**

更新 `.mise.toml`：
```toml
[tools]
node = "22"
moon = "latest"
```

```bash
mise install
```

- [ ] **Step 2: 建立 .moon/workspace.yml**

注意：moon v1.20+ 已將 toolchain 配置合併至 workspace.yml。

```yaml
$schema: 'https://moonrepo.dev/schemas/workspace.json'

projects:
  - 'packages/*'
  - 'apps/*'

vcs:
  manager: git
  defaultBranch: master

node:
  version: '22'
  packageManager: 'pnpm'
```

- [ ] **Step 4: 驗證**

```bash
moon check --all
```
Expected: 無 projects 可檢查（尚未建立 moon.yml）

- [ ] **Step 5: Commit**

```bash
git add .moon/
git commit -m "chore: add moon workspace configuration"
```

---

### Task 4: 建立共用 tsconfig.base.json

**Files:**
- Create: `tsconfig.base.json`
- Modify: `tsconfig.json` → 保留為 root level reference config

- [ ] **Step 1: 建立 tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  }
}
```

注意：`composite: true` 是 TypeScript project references 正常運作的必要條件。不設 `noEmit`，因為 composite 模式需要能產生 declaration files（各 package 可在自己的 tsconfig 中 override `noEmit: true` 做 typecheck-only）。

- [ ] **Step 2: 更新 root tsconfig.json 為 project references 結構**

```json
{
  "files": [],
  "references": []
}
```

（references 會隨著 packages 建立逐步加入）

- [ ] **Step 3: Commit**

```bash
git add tsconfig.base.json tsconfig.json
git commit -m "chore: add shared tsconfig.base.json"
```

---

### Task 5: 設定 oxfmt 並移除 prettier

**Files:**
- Delete: `.prettierrc.js`
- Modify: `package.json` (移除 prettier 相關 devDependencies)

- [ ] **Step 1: 移除 prettier 相關套件和設定**

```bash
rm .prettierrc.js
```

從 root `package.json` 的 devDependencies 移除：
- `prettier`
- `lint-staged` (若只用於 prettier)

- [ ] **Step 2: 設定 oxfmt**

依照 oxfmt 的設定方式建立配置（例如 `oxfmt.toml` 或在 `package.json` 中配置）。

- [ ] **Step 3: Commit**

```bash
git rm .prettierrc.js
git add package.json
git commit -m "chore: replace prettier with oxfmt"
```

---

### Task 6: 建立 MIGRATION_PROGRESS.md

**Files:**
- Create: `MIGRATION_PROGRESS.md`

- [ ] **Step 1: 建立進度追蹤文件**

```markdown
# Monorepo 遷移進度

> 設計文件：docs/superpowers/specs/2026-03-14-monorepo-migration-design.md
> 實作計畫：docs/superpowers/plans/2026-03-14-monorepo-migration.md

## 第一階段：建立 monorepo 骨架

- [ ] pnpm workspace 初始化
- [ ] mise + direnv 設定
- [ ] moon 配置
- [ ] tsconfig.base.json
- [ ] oxfmt 取代 prettier
- [ ] MIGRATION_PROGRESS.md 建立

## 第二階段：拆分 packages

- [ ] @lodestar/types
- [ ] @lodestar/helpers
- [ ] @lodestar/graphql
- [ ] @lodestar/contexts
- [ ] @lodestar/hooks
- [ ] @lodestar/ui

## 第三階段：建立 demo app

- [ ] apps/element-demo (Vite + React)
- [ ] 驗證所有元件正常運作

## 第四階段：整合其他 repo（之後處理）

- [ ] lodestar-app → apps/web
- [ ] lodestar-app-admin → apps/admin

## 待辦（遷移後）

- [ ] UI 與資料層解耦（@lodestar/ui 不應直接依賴 @lodestar/graphql）
- [ ] CI/CD 建置
```

- [ ] **Step 2: Commit**

```bash
git add MIGRATION_PROGRESS.md
git commit -m "chore: add migration progress tracking"
```

---

## Chunk 2: 拆分 packages（底層 → 上層）

### Task 7: 建立 @lodestar/types

**Files:**
- Create: `packages/types/package.json`
- Create: `packages/types/tsconfig.json`
- Create: `packages/types/moon.yml`
- Move: `src/types/*.ts` → `packages/types/src/`
- Create: `packages/types/src/index.ts` (barrel export)

- [ ] **Step 1: 建立 package 目錄結構**

```bash
mkdir -p packages/types/src
```

- [ ] **Step 2: 建立 packages/types/package.json**

```json
{
  "name": "@lodestar/types",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/*.ts"
  }
}
```

- [ ] **Step 3: 建立 packages/types/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 4: 建立 packages/types/moon.yml**

```yaml
tasks:
  typecheck:
    command: 'tsc --noEmit'
    inputs:
      - 'src/**/*'
```

- [ ] **Step 5: 搬移所有 type 檔案**

```bash
mv src/types/app.ts packages/types/src/
mv src/types/certificate.ts packages/types/src/
mv src/types/checkout.ts packages/types/src/
mv src/types/conversionApi.ts packages/types/src/
mv src/types/data.ts packages/types/src/
mv src/types/element.ts packages/types/src/
mv src/types/event.ts packages/types/src/
mv src/types/general.ts packages/types/src/
mv src/types/invoice.ts packages/types/src/
mv src/types/lodestar.window.ts packages/types/src/
mv src/types/member.ts packages/types/src/
mv src/types/merchandise.ts packages/types/src/
mv src/types/metaProduct.ts packages/types/src/
mv src/types/options.ts packages/types/src/
mv src/types/order.ts packages/types/src/
mv src/types/post.ts packages/types/src/
mv src/types/product.ts packages/types/src/
mv src/types/program.d.ts packages/types/src/
mv src/types/questionLibrary.ts packages/types/src/
mv src/types/token.ts packages/types/src/
```

- [ ] **Step 6: 建立 barrel export (packages/types/src/index.ts)**

```typescript
export * from './app'
export * from './certificate'
export * from './checkout'
export * from './conversionApi'
export * from './data'
export * from './element'
export * from './event'
export * from './general'
export * from './invoice'
export * from './member'
export * from './merchandise'
export * from './metaProduct'
export * from './options'
export * from './order'
export * from './post'
export * from './product'
export * from './questionLibrary'
export * from './token'
```

注意：`lodestar.window.ts` 和 `program.d.ts` 為 ambient declarations，不需要從 index 匯出，但需包含在 tsconfig include 中。

- [ ] **Step 7: 更新 root tsconfig.json references**

```json
{
  "files": [],
  "references": [
    { "path": "packages/types" }
  ]
}
```

- [ ] **Step 8: 驗證**

```bash
cd packages/types && pnpm tsc --noEmit
```
Expected: 無錯誤（或僅有可接受的外部依賴錯誤待後續修復）

- [ ] **Step 9: Commit**

```bash
git add packages/types/
git add tsconfig.json
git commit -m "feat: create @lodestar/types package"
```

---

### Task 8: 建立 @lodestar/helpers

**Files:**
- Create: `packages/helpers/package.json`
- Create: `packages/helpers/tsconfig.json`
- Create: `packages/helpers/moon.yml`
- Move: `src/helpers/*.ts(x)` → `packages/helpers/src/`
- Create: `packages/helpers/src/index.ts`

- [ ] **Step 1: 建立 package 目錄結構**

```bash
mkdir -p packages/helpers/src
```

- [ ] **Step 2: 建立 packages/helpers/package.json**

```json
{
  "name": "@lodestar/helpers",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/*.ts"
  },
  "dependencies": {
    "@lodestar/types": "workspace:*"
  }
}
```

- [ ] **Step 3: 建立 packages/helpers/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"],
  "references": [
    { "path": "../types" }
  ]
}
```

- [ ] **Step 4: 建立 packages/helpers/moon.yml**

```yaml
tasks:
  typecheck:
    command: 'tsc --noEmit'
    inputs:
      - 'src/**/*'
    deps:
      - 'types:typecheck'
```

- [ ] **Step 5: 搬移所有 helper 檔案**

```bash
mv src/helpers/adaptObject.tsx packages/helpers/src/
mv src/helpers/apollo.ts packages/helpers/src/
mv src/helpers/conversionApi.ts packages/helpers/src/
mv src/helpers/error.ts packages/helpers/src/
mv src/helpers/translation.ts packages/helpers/src/
```

- [ ] **Step 5.5: 處理 src/helpers/index.ts**

檢查 `src/helpers/index.ts` 的內容。若為 barrel export，直接刪除（會用新的 index 取代）。若包含工具函式邏輯，搬移到 `packages/helpers/src/index.ts` 並合併。

```bash
cat src/helpers/index.ts
rm src/helpers/index.ts
rmdir src/helpers  # 確認目錄已清空
```

- [ ] **Step 6: 建立 packages/helpers/src/index.ts**

```typescript
export * from './adaptObject'
export * from './apollo'
export * from './conversionApi'
export * from './error'
export * from './translation'
```

- [ ] **Step 7: 將外部依賴加入 package.json**

檢查 helpers 中使用的外部依賴（如 `@apollo/client`, `axios`, `xss`, `mustache` 等），加入 `packages/helpers/package.json` 的 dependencies。

- [ ] **Step 8: 更新 root tsconfig.json references**

在 references 陣列加入：`{ "path": "packages/helpers" }`

- [ ] **Step 9: 驗證**

```bash
cd packages/helpers && pnpm tsc --noEmit
```

- [ ] **Step 10: Commit**

```bash
git add packages/helpers/
git add tsconfig.json
git commit -m "feat: create @lodestar/helpers package"
```

---

### Task 9: 建立 @lodestar/graphql

**Files:**
- Create: `packages/graphql/package.json`
- Create: `packages/graphql/tsconfig.json`
- Create: `packages/graphql/moon.yml`
- Move: `src/graphql/*.ts` → `packages/graphql/src/`
- Move: `codegen.ts` → `packages/graphql/codegen.ts`
- Move: `src/hasura.d.ts` → `packages/graphql/src/hasura.d.ts`
- Create: `packages/graphql/src/index.ts`

- [ ] **Step 1: 建立 package 目錄結構**

```bash
mkdir -p packages/graphql/src
```

- [ ] **Step 2: 建立 packages/graphql/package.json**

```json
{
  "name": "@lodestar/graphql",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/*.ts"
  },
  "scripts": {
    "typegen": "graphql-codegen --config codegen.ts"
  },
  "dependencies": {
    "@lodestar/types": "workspace:*",
    "@apollo/client": "^3.7.11",
    "graphql": "^16.6.0"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^3.3.0",
    "@graphql-codegen/client-preset": "^3.0.0"
  }
}
```

- [ ] **Step 3: 建立 packages/graphql/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"],
  "references": [
    { "path": "../types" }
  ]
}
```

- [ ] **Step 4: 建立 packages/graphql/moon.yml**

```yaml
tasks:
  typecheck:
    command: 'tsc --noEmit'
    inputs:
      - 'src/**/*'
    deps:
      - 'types:typecheck'
  typegen:
    command: 'pnpm typegen'
    inputs:
      - 'codegen.ts'
```

- [ ] **Step 5: 搬移檔案**

```bash
mv src/graphql/fragments.ts packages/graphql/src/
mv src/graphql/queries.ts packages/graphql/src/
mv codegen.ts packages/graphql/
mv src/hasura.d.ts packages/graphql/src/
```

- [ ] **Step 6: 建立 packages/graphql/src/index.ts**

```typescript
export * from './fragments'
export * from './queries'
```

- [ ] **Step 7: 更新 codegen.ts 中的路徑**

將 `codegen.ts` 中的輸出路徑和 document scan 路徑更新為相對於 `packages/graphql/` 的路徑。

- [ ] **Step 8: 更新 root tsconfig.json references**

在 references 陣列加入：`{ "path": "packages/graphql" }`

- [ ] **Step 9: 驗證**

```bash
cd packages/graphql && pnpm tsc --noEmit
```

- [ ] **Step 10: Commit**

```bash
git add packages/graphql/
git add tsconfig.json
git commit -m "feat: create @lodestar/graphql package"
```

---

### Task 10: 建立 @lodestar/contexts

**Files:**
- Create: `packages/contexts/package.json`
- Create: `packages/contexts/tsconfig.json`
- Create: `packages/contexts/moon.yml`
- Move: `src/contexts/*.ts(x)` → `packages/contexts/src/`
- Create: `packages/contexts/src/index.ts`

- [ ] **Step 1: 建立 package 目錄結構**

```bash
mkdir -p packages/contexts/src
```

- [ ] **Step 2: 建立 packages/contexts/package.json**

```json
{
  "name": "@lodestar/contexts",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/*.tsx"
  },
  "dependencies": {
    "@lodestar/types": "workspace:*",
    "@lodestar/helpers": "workspace:*"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0"
  }
}
```

- [ ] **Step 3: 建立 packages/contexts/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"],
  "references": [
    { "path": "../types" },
    { "path": "../helpers" }
  ]
}
```

- [ ] **Step 4: 建立 packages/contexts/moon.yml**

```yaml
tasks:
  typecheck:
    command: 'tsc --noEmit'
    inputs:
      - 'src/**/*'
    deps:
      - 'types:typecheck'
      - 'helpers:typecheck'
```

- [ ] **Step 5: 搬移所有 context 檔案**

```bash
mv src/contexts/ApiContext.tsx packages/contexts/src/
mv src/contexts/AppContext.tsx packages/contexts/src/
mv src/contexts/AppThemeContext.tsx packages/contexts/src/
mv src/contexts/AuthContext.tsx packages/contexts/src/
mv src/contexts/AuthModalContext.tsx packages/contexts/src/
mv src/contexts/LanguageContext.tsx packages/contexts/src/
mv src/contexts/LodestarAppContext.tsx packages/contexts/src/
mv src/contexts/translation.ts packages/contexts/src/
```

- [ ] **Step 6: 建立 packages/contexts/src/index.ts**

```typescript
export * from './ApiContext'
export * from './AppContext'
export * from './AppThemeContext'
export * from './AuthContext'
export * from './AuthModalContext'
export * from './LanguageContext'
export * from './LodestarAppContext'
```

- [ ] **Step 7: 加入外部依賴**

檢查 contexts 中使用的外部依賴（如 `@apollo/client`, `react-intl`, `@chakra-ui/react`, `js-cookie` 等），加入 dependencies。

- [ ] **Step 8: 更新 root tsconfig.json references**

在 references 陣列加入：`{ "path": "packages/contexts" }`

- [ ] **Step 9: 驗證**

```bash
cd packages/contexts && pnpm tsc --noEmit
```

- [ ] **Step 10: Commit**

```bash
git add packages/contexts/
git add tsconfig.json
git commit -m "feat: create @lodestar/contexts package"
```

---

### Task 11: 建立 @lodestar/hooks

**Files:**
- Create: `packages/hooks/package.json`
- Create: `packages/hooks/tsconfig.json`
- Create: `packages/hooks/moon.yml`
- Move: `src/hooks/*.ts` → `packages/hooks/src/`
- Create: `packages/hooks/src/index.ts`

- [ ] **Step 1: 建立 package 目錄結構**

```bash
mkdir -p packages/hooks/src
```

- [ ] **Step 2: 建立 packages/hooks/package.json**

```json
{
  "name": "@lodestar/hooks",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/*.ts"
  },
  "dependencies": {
    "@lodestar/types": "workspace:*",
    "@lodestar/helpers": "workspace:*",
    "@lodestar/graphql": "workspace:*"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0"
  }
}
```

- [ ] **Step 3: 建立 packages/hooks/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"],
  "references": [
    { "path": "../types" },
    { "path": "../helpers" },
    { "path": "../graphql" }
  ]
}
```

- [ ] **Step 4: 建立 packages/hooks/moon.yml**

```yaml
tasks:
  typecheck:
    command: 'tsc --noEmit'
    inputs:
      - 'src/**/*'
    deps:
      - 'types:typecheck'
      - 'helpers:typecheck'
      - 'graphql:typecheck'
```

- [ ] **Step 5: 搬移所有 hook 檔案**

```bash
mv src/hooks/card.ts packages/hooks/src/
mv src/hooks/checkout.ts packages/hooks/src/
mv src/hooks/common.ts packages/hooks/src/
mv src/hooks/data.ts packages/hooks/src/
mv src/hooks/giftPlan.ts packages/hooks/src/
mv src/hooks/member.ts packages/hooks/src/
mv src/hooks/program.ts packages/hooks/src/
mv src/hooks/resource.ts packages/hooks/src/
mv src/hooks/review.ts packages/hooks/src/
mv src/hooks/tracking.ts packages/hooks/src/
mv src/hooks/util.ts packages/hooks/src/
```

- [ ] **Step 6: 建立 packages/hooks/src/index.ts**

```typescript
export * from './card'
export * from './checkout'
export * from './common'
export * from './data'
export * from './giftPlan'
export * from './member'
export * from './program'
export * from './resource'
export * from './review'
export * from './tracking'
export * from './util'
```

- [ ] **Step 7: 加入外部依賴**

檢查 hooks 中使用的外部依賴（如 `@apollo/client`, `swr`, `axios`, `react-intl` 等），加入 dependencies。

- [ ] **Step 8: 更新 root tsconfig.json references**

在 references 陣列加入：`{ "path": "packages/hooks" }`

- [ ] **Step 9: 驗證**

```bash
cd packages/hooks && pnpm tsc --noEmit
```

- [ ] **Step 10: Commit**

```bash
git add packages/hooks/
git add tsconfig.json
git commit -m "feat: create @lodestar/hooks package"
```

---

### Task 12: 建立 @lodestar/ui

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/moon.yml`
- Move: `src/components/**/*` → `packages/ui/src/components/`
- Move: `src/translations/` → `packages/ui/src/translations/`
- Move: `src/fonts/` → `packages/ui/src/fonts/`
- Move: `src/images/` → `packages/ui/src/images/`
- Move: `src/styles.scss` → `packages/ui/src/styles.scss`
- Create: `packages/ui/src/index.ts`

- [ ] **Step 1: 建立 package 目錄結構**

```bash
mkdir -p packages/ui/src
```

- [ ] **Step 2: 建立 packages/ui/package.json**

```json
{
  "name": "@lodestar/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./components/*": "./src/components/*/index.ts",
    "./styles.scss": "./src/styles.scss"
  },
  "dependencies": {
    "@lodestar/types": "workspace:*",
    "@lodestar/helpers": "workspace:*",
    "@lodestar/graphql": "workspace:*",
    "@lodestar/contexts": "workspace:*",
    "@lodestar/hooks": "workspace:*"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0"
  }
}
```

- [ ] **Step 3: 建立 packages/ui/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"],
  "references": [
    { "path": "../types" },
    { "path": "../helpers" },
    { "path": "../graphql" },
    { "path": "../contexts" },
    { "path": "../hooks" }
  ]
}
```

- [ ] **Step 4: 建立 packages/ui/moon.yml**

```yaml
tasks:
  typecheck:
    command: 'tsc --noEmit'
    inputs:
      - 'src/**/*'
    deps:
      - 'types:typecheck'
      - 'helpers:typecheck'
      - 'graphql:typecheck'
      - 'contexts:typecheck'
      - 'hooks:typecheck'
```

- [ ] **Step 5: 搬移 components 目錄**

```bash
mv src/components packages/ui/src/
```

- [ ] **Step 6: 搬移 translations、fonts、images、styles**

```bash
mv src/translations packages/ui/src/
mv src/fonts packages/ui/src/
mv src/images packages/ui/src/
mv src/styles.scss packages/ui/src/
```

- [ ] **Step 7: 建立 packages/ui/src/index.ts**

```typescript
// Common / Craft elements
export * from './components/common'

// Feature components
export * from './components/blocks/GridOptionsBlock'
export * from './components/blocks/ListsOptionsBlock'
export * from './components/blocks/MembershipCardBlock'

export * from './components/buttons/Button'
export * from './components/buttons/FetchButton'

export * from './components/cards/Card'
// ... 其他 card exports

export * from './components/collections/Collection'
// ... 其他 collection exports

export * from './components/collapses/AccordionSingle'
export * from './components/collapses/Collapse'

export * from './components/event/MemberEventCalendarBlock'

export * from './components/forms/CheckoutGroupBuyingForm'
export * from './components/forms/TapPayForm'

// ... 其他 component exports
```

注意：完整的 index.ts 需要根據實際元件的 export 結構來建立。

- [ ] **Step 8: 加入外部依賴**

檢查 components 中使用的外部依賴，加入 dependencies。主要包括：
- `@craftjs/core`
- `@chakra-ui/react`, `@emotion/react`, `@emotion/styled`
- `styled-components`
- `antd`
- `react-intl`
- `react-router-dom`
- `@fullcalendar/*`
- `braft-editor`
- `react-simplemde-editor`
- `framer-motion`
- `react-color`
- `react-responsive`
- `moment` / `dayjs`
- `ramda`
- `rc-progress`
- 其他

- [ ] **Step 9: 更新 root tsconfig.json references**

在 references 陣列加入：`{ "path": "packages/ui" }`

- [ ] **Step 10: 驗證**

```bash
cd packages/ui && pnpm tsc --noEmit
```

- [ ] **Step 11: Commit**

```bash
git add packages/ui/
git add tsconfig.json
git commit -m "feat: create @lodestar/ui package"
```

---

## Chunk 3: 更新 import paths + Demo App

### Task 13: 更新所有 packages 內的 import paths

**Files:**
- Modify: `packages/*/src/**/*.ts(x)` — 所有內部 import 路徑

- [ ] **Step 1: 更新 @lodestar/helpers 的 imports**

將 `packages/helpers/src/` 中的：
- `'../types/...'` 或 `'../../types/...'` → `'@lodestar/types'` 或 `'@lodestar/types/...'`

- [ ] **Step 2: 更新 @lodestar/graphql 的 imports**

將 `packages/graphql/src/` 中的 types imports 更新。

- [ ] **Step 3: 更新 @lodestar/contexts 的 imports**

將 `packages/contexts/src/` 中的：
- types imports → `'@lodestar/types'`
- helpers imports → `'@lodestar/helpers'`

- [ ] **Step 4: 更新 @lodestar/hooks 的 imports**

將 `packages/hooks/src/` 中的：
- types imports → `'@lodestar/types'`
- graphql imports → `'@lodestar/graphql'`
- helpers imports → `'@lodestar/helpers'`

- [ ] **Step 5: 更新 @lodestar/ui 的 imports**

將 `packages/ui/src/` 中的：
- types imports → `'@lodestar/types'`
- helpers imports → `'@lodestar/helpers'`
- graphql imports → `'@lodestar/graphql'`
- contexts imports → `'@lodestar/contexts'`
- hooks imports → `'@lodestar/hooks'`

注意：`@lodestar/ui` 內部元件之間的相對 import 保持不變。

- [ ] **Step 6: 驗證無殘留的相對 import**

使用 ripgrep 確認所有跨 package 的相對 import 已更新：

```bash
# 搜尋殘留的 ../types/, ../helpers/, ../contexts/, ../hooks/, ../graphql/ imports
rg "from ['\"]\.\./(types|helpers|contexts|hooks|graphql)" packages/ --type ts --type tsx
```
Expected: 無結果（所有跨 package import 應已改為 `@lodestar/*`）

- [ ] **Step 7: 執行全域 typecheck 驗證**

```bash
moon run :typecheck
```
Expected: 所有 packages 通過 typecheck

- [ ] **Step 8: Commit**

```bash
git add packages/
git commit -m "refactor: update import paths to use @lodestar/* packages"
```

---

### Task 14: 建立 apps/element-demo

**Files:**
- Create: `apps/element-demo/package.json`
- Create: `apps/element-demo/tsconfig.json`
- Create: `apps/element-demo/moon.yml`
- Create: `apps/element-demo/vite.config.ts`
- Create: `apps/element-demo/index.html`
- Move: `src/pages/` → `apps/element-demo/src/pages/`
- Move: `src/App.tsx` → `apps/element-demo/src/App.tsx`
- Create: `apps/element-demo/src/main.tsx`
- Move: `public/` → `apps/element-demo/public/`

- [ ] **Step 1: 建立目錄結構**

```bash
mkdir -p apps/element-demo/src
```

- [ ] **Step 2: 建立 apps/element-demo/package.json**

```json
{
  "name": "@lodestar/element-demo",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@lodestar/ui": "workspace:*",
    "@lodestar/types": "workspace:*",
    "@lodestar/helpers": "workspace:*",
    "@lodestar/graphql": "workspace:*",
    "@lodestar/contexts": "workspace:*",
    "@lodestar/hooks": "workspace:*",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-router-dom": "^5.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^6.0.0",
    "sass": "^1.66.1"
  }
}
```

- [ ] **Step 3: 建立 apps/element-demo/vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 3000,
  },
})
```

- [ ] **Step 4: 建立 apps/element-demo/index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lodestar Element Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: 建立 apps/element-demo/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"],
  "references": [
    { "path": "../../packages/types" },
    { "path": "../../packages/helpers" },
    { "path": "../../packages/graphql" },
    { "path": "../../packages/contexts" },
    { "path": "../../packages/hooks" },
    { "path": "../../packages/ui" }
  ]
}
```

- [ ] **Step 6: 建立 apps/element-demo/moon.yml**

```yaml
tasks:
  dev:
    command: 'pnpm dev'
    local: true
  build:
    command: 'pnpm build'
    inputs:
      - 'src/**/*'
      - 'index.html'
      - 'vite.config.ts'
    deps:
      - 'ui:typecheck'
  typecheck:
    command: 'tsc --noEmit'
    inputs:
      - 'src/**/*'
    deps:
      - 'ui:typecheck'
```

- [ ] **Step 7: 搬移 pages、App 和 index**

```bash
mv src/pages apps/element-demo/src/
mv src/App.tsx apps/element-demo/src/
```

注意：`src/index.tsx` 是 CRA 的 entry point，不搬移。其中的初始化邏輯（如有）提取到 `main.tsx` 中，`src/index.tsx` 會在 Task 15 清理階段刪除。

- [ ] **Step 8: 建立 apps/element-demo/src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
```

- [ ] **Step 9: 搬移 public 資源**

```bash
mv public apps/element-demo/
```

- [ ] **Step 10: 更新 App.tsx 中的 import paths**

將所有 relative imports 更新為 `@lodestar/*` package imports。

- [ ] **Step 11: 更新 pages 中的 import paths**

將所有 pages 中的 relative imports 更新為 `@lodestar/*` package imports。

- [ ] **Step 12: 更新 root tsconfig.json references**

在 references 陣列加入：`{ "path": "apps/element-demo" }`

- [ ] **Step 13: Commit**

```bash
git add apps/element-demo/
git add tsconfig.json
git commit -m "feat: create element-demo app with Vite"
```

---

### Task 15: 清理殘留檔案並最終驗證

**Files:**
- Delete: `src/` (應僅剩 `index.tsx`, `react-app-env.d.ts` 等 CRA 產物)
- Delete: `tsconfig.build.json` (不再需要)
- Delete: `.intl.babelrc` (i18n extraction 配置移至 ui package)
- Delete: `manageTranslations.js` (同上)
- Modify: `MIGRATION_PROGRESS.md` (更新進度)

- [ ] **Step 1: 確認 src/ 目錄僅剩 CRA 產物**

```bash
ls -la src/
```
Expected: 僅剩 `index.tsx`、`react-app-env.d.ts` 等不再需要的檔案

- [ ] **Step 2: 刪除殘留檔案**

```bash
rm -rf src/
rm -f tsconfig.build.json
rm -f .intl.babelrc
rm -f manageTranslations.js
```

- [ ] **Step 3: pnpm install**

```bash
pnpm install
```

- [ ] **Step 4: 全域 typecheck**

```bash
moon run :typecheck
```
Expected: 所有 packages 和 apps 通過

- [ ] **Step 5: 啟動 demo app 驗證**

```bash
moon run element-demo:dev
```
Expected: Vite dev server 啟動，瀏覽器可正常載入 demo pages

- [ ] **Step 6: 更新 MIGRATION_PROGRESS.md**

將第一、二、三階段的所有項目標記為完成。

- [ ] **Step 7: Commit**

```bash
git rm -r src/
git rm -f tsconfig.build.json .intl.babelrc manageTranslations.js
git add MIGRATION_PROGRESS.md
git commit -m "chore: clean up legacy files, complete phase 1-3 migration"
```

---

## 驗證總結

完成所有任務後，最終狀態應為：

1. `pnpm install` 成功
2. `moon run :typecheck` 全部通過
3. `moon run element-demo:dev` 可啟動 demo app
4. 所有 demo pages 可正常渲染
5. `MIGRATION_PROGRESS.md` 第一至三階段全部勾選完成
6. `src/` 目錄已移除
7. 無 yarn.lock、無 prettier 配置
