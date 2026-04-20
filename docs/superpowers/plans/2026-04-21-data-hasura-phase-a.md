# UI/Data Decoupling — Phase A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 `@lodestar/data-hasura` package，把所有 graphql 相關的 hook 檔、Context Provider、Apollo helper 從 `@lodestar/hooks` / `@lodestar/contexts` / `@lodestar/helpers` 搬進去，API 不破壞，element-demo 仍 15/15 路由渲染正常。

**Architecture:** 按 dependency direction 整理：`data-hasura` 依賴 `contexts`/`helpers`/`types`/`graphql`，反向不依賴。`AppContext` 拆成 Context 本體（留 contexts，pure）+ `AppProvider`（進 data-hasura，有 useQuery）。`LodestarAppProvider` 搬到 element-demo 自己組裝。Phase A 過程中 `@lodestar/ui` 對 `@lodestar/data-hasura` 會有暫時的直接依賴（Phase B 會解除），其他 package.json 的 graphql 相依在 Phase C 清洗。

**Tech Stack:** pnpm workspaces, TypeScript project references, moon, Vite 6, Apollo Client 3.7, React 17.

**Spec:** `docs/superpowers/specs/2026-04-21-ui-data-decoupling-design.md`

---

## File Structure (Phase A 結束狀態)

### 新建

- `packages/data-hasura/package.json` — 新 package 宣告
- `packages/data-hasura/tsconfig.json` — TS project config
- `packages/data-hasura/moon.yml` — moon typecheck task
- `packages/data-hasura/src/index.ts` — 對外匯出
- `packages/data-hasura/src/apollo.ts` — 從 `@lodestar/helpers/apollo.ts` 搬來
- `packages/data-hasura/src/contexts/ApiProvider.tsx` — 從 `@lodestar/contexts/ApiContext.tsx` 搬來
- `packages/data-hasura/src/contexts/AppProvider.tsx` — 從 `@lodestar/contexts/AppContext.tsx` 抽出 Provider 部分
- `packages/data-hasura/src/hooks/{card,common,data,giftPlan,member,program,resource,review,tracking}.ts` — 從 `@lodestar/hooks/src/*.ts` 搬 9 個檔
- `apps/element-demo/src/LodestarAppProvider.tsx` — consumer 端自己組 provider tree
- `packages/types/src/resource.ts` — 抽 `ResourceType` 出來（解除 util.ts 對 resource.ts 的循環）

### 修改

- `packages/helpers/src/apollo.ts` — 刪除（內容搬走）
- `packages/helpers/src/index.ts` — 移除 apollo 相關 re-export
- `packages/helpers/package.json` — 暫不動 deps（Phase C 清）
- `packages/contexts/src/ApiContext.tsx` — 刪除
- `packages/contexts/src/AppContext.tsx` — 改為只含 Context + `useApp()` + types + defaults，無 `AppProvider`
- `packages/contexts/src/LodestarAppContext.tsx` — 刪除（搬去 element-demo）
- `packages/contexts/src/index.ts` — 移除 ApiContext、LodestarAppContext 的 export；AppContext 保留（只剩 consumer API）
- `packages/contexts/package.json` — 移除 `@lodestar/graphql` 依賴（仍需 `@apollo/client`？ 無，split 完就沒了；暫留到 Phase C 確認）
- `packages/hooks/src/{card,common,data,giftPlan,member,program,resource,review,tracking}.ts` — 刪除
- `packages/hooks/src/util.ts` — `ResourceType` 改從 `@lodestar/types/resource` import
- `packages/hooks/src/index.ts` — 只保留 `util`、`checkout` 的 barrel export
- `apps/element-demo/src/App.tsx` — 改用本地 `LodestarAppProvider`
- `apps/element-demo/package.json` — 加 `@lodestar/data-hasura` 依賴
- `packages/ui/package.json` — 加 `@lodestar/data-hasura` 依賴（temp，Phase B 會拔）
- `packages/ui/src/**/*.tsx` — 需要 import moved hooks/contexts 的檔案，更新 import path
- `tsconfig.json` — 加 `packages/data-hasura` 到 references
- `packages/data-hasura/moon.yml`（新檔）— typecheck deps: types/helpers/contexts/graphql

---

## Task 1: 建立 `@lodestar/data-hasura` package skeleton

**Files:**
- Create: `packages/data-hasura/package.json`
- Create: `packages/data-hasura/tsconfig.json`
- Create: `packages/data-hasura/moon.yml`
- Create: `packages/data-hasura/src/index.ts`
- Modify: `tsconfig.json`

- [ ] **Step 1: 建立 package.json**

Create `packages/data-hasura/package.json`:

```json
{
  "name": "@lodestar/data-hasura",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./apollo": "./src/apollo.ts",
    "./contexts/ApiProvider": "./src/contexts/ApiProvider.tsx",
    "./contexts/AppProvider": "./src/contexts/AppProvider.tsx",
    "./hooks/*": "./src/hooks/*.ts"
  },
  "dependencies": {
    "@lodestar/types": "workspace:*",
    "@lodestar/helpers": "workspace:*",
    "@lodestar/graphql": "workspace:*",
    "@lodestar/contexts": "workspace:*",
    "@apollo/client": "^3.7.11",
    "@chakra-ui/react": "1.8.9",
    "@fingerprintjs/fingerprintjs": "^3.3.6",
    "ajv": "^8.11.2",
    "axios": "0.21.4",
    "dayjs": "^1.11.7",
    "graphql": "^16.6.0",
    "graphql-ws": "^5.12.1",
    "js-cookie": "^3.0.5",
    "moment": "^2.29.1",
    "query-string": "7.0.1",
    "ramda": "^0.30.1",
    "react-ga": "3.3.0",
    "react-intl": "5.20.9",
    "styled-components": "5.1.1",
    "ts-deep-pick": "0.2.2",
    "uuid": "8.3.2"
  },
  "devDependencies": {
    "@types/js-cookie": "^3.0.3",
    "@types/node": "^18.0.0",
    "@types/ramda": "^0.30.1",
    "@types/react": "17.0.0",
    "@types/styled-components": "5.1.14",
    "@types/uuid": "8.3.1"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0"
  }
}
```

- [ ] **Step 2: 建立 tsconfig.json**

Create `packages/data-hasura/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src"
  },
  "include": ["src", "../../global.d.ts"]
}
```

- [ ] **Step 3: 建立 moon.yml**

Create `packages/data-hasura/moon.yml`:

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
```

- [ ] **Step 4: 建立 src/index.ts 骨架**

Create `packages/data-hasura/src/index.ts`:

```ts
// Barrel re-exports; individual files are filled in by later tasks.
export {}
```

- [ ] **Step 5: 加入 root tsconfig.json references**

Modify `tsconfig.json`:

```json
{
  "references": [
    { "path": "packages/types" },
    { "path": "packages/helpers" },
    { "path": "packages/graphql" },
    { "path": "packages/contexts" },
    { "path": "packages/hooks" },
    { "path": "packages/data-hasura" },
    { "path": "packages/ui" },
    { "path": "apps/element-demo" },
    { "path": "apps/playground" }
  ]
}
```

- [ ] **Step 6: 執行 pnpm install 讓 workspace 註冊新 package**

Run: `pnpm install`

Expected: no errors, `packages/data-hasura/node_modules` 建立，symlink 指向其他 workspace packages。

- [ ] **Step 7: Commit**

```bash
git add packages/data-hasura tsconfig.json pnpm-lock.yaml
git commit -m "chore(data-hasura): scaffold empty package for graphql data layer"
```

---

## Task 2: 抽 `ResourceType` 出來到 `@lodestar/types/resource`

**Files:**
- Create: `packages/types/src/resource.ts`
- Modify: `packages/hooks/src/util.ts:12`

- [ ] **Step 1: 先看原本 ResourceType 定義**

Run: `grep -A3 "export type ResourceType\|export type Resource" packages/hooks/src/resource.ts | head -10`

Expected: 看到 `export type ResourceType = 'program' | 'activity' | ...`。記下完整定義，下一步要用。

- [ ] **Step 2: 建立 packages/types/src/resource.ts**

依前一步抓到的定義，create `packages/types/src/resource.ts`：

```ts
// 內容為前一步 grep 到的 ResourceType 完整 union 定義，加上相關的 type
// e.g.:
export type ResourceType =
  | 'program'
  | 'activity_ticket'
  // ... (依 grep 結果完整照抄)
```

- [ ] **Step 3: 改 util.ts 的 import**

Modify `packages/hooks/src/util.ts` 第 12 行：

```ts
// before
import { ResourceType } from './resource'
// after
import { ResourceType } from '@lodestar/types/resource'
```

- [ ] **Step 4: Typecheck**

Run: `pnpm --filter @lodestar/hooks exec tsc --noEmit`

Expected: PASS。若失敗，檢查 `packages/types/src/resource.ts` 內容是否完整。

- [ ] **Step 5: Commit**

```bash
git add packages/types/src/resource.ts packages/hooks/src/util.ts
git commit -m "refactor(types): extract ResourceType so util hook doesn't depend on data hooks"
```

---

## Task 3: 搬 `apollo.ts` 從 helpers 到 data-hasura

**Files:**
- Create: `packages/data-hasura/src/apollo.ts`
- Delete: `packages/helpers/src/apollo.ts`
- Modify: `packages/helpers/src/index.ts`

- [ ] **Step 1: 複製檔案到新位置**

Run:
```bash
cp packages/helpers/src/apollo.ts packages/data-hasura/src/apollo.ts
```

- [ ] **Step 2: 刪除舊檔**

Run:
```bash
rm packages/helpers/src/apollo.ts
```

- [ ] **Step 3: 檢查 helpers index.ts 是否有 re-export**

Run: `grep "apollo" packages/helpers/src/index.ts`

Expected: 若有 `export * from './apollo'` 之類，下一步要刪掉；若無則略過下一步。

- [ ] **Step 4: 如 Step 3 有匹配，刪除 index 中的 apollo re-export**

修改 `packages/helpers/src/index.ts` 刪除相關行。

- [ ] **Step 5: 全域搜尋 `@lodestar/helpers/apollo` 的 import**

Run: `grep -rn "@lodestar/helpers/apollo" packages apps 2>&1 | grep -v node_modules`

Expected: 應看到在 `packages/contexts/src/ApiContext.tsx` 或其他地方。全部更新成 `@lodestar/data-hasura/apollo`。

- [ ] **Step 6: 更新每個 grep 結果的 import path**

對每個命中的檔案，把 `from '@lodestar/helpers/apollo'` 改成 `from '@lodestar/data-hasura/apollo'`。

- [ ] **Step 7: 更新 data-hasura 的 index.ts 匯出 apollo helper**

Modify `packages/data-hasura/src/index.ts`:

```ts
export * from './apollo'
```

- [ ] **Step 8: Typecheck workspace**

Run: `pnpm -r exec tsc --noEmit`

Expected: 不因 apollo 移動報錯。若 `@lodestar/contexts/ApiContext.tsx` 報錯（下個 Task 會搬它），可以暫時接受；記下錯誤項目但先不處理。

- [ ] **Step 9: Commit**

```bash
git add packages/data-hasura/src/apollo.ts packages/helpers/src packages/contexts/src/ApiContext.tsx
git commit -m "refactor(data-hasura): move apollo client helper from @lodestar/helpers"
```

---

## Task 4: 搬 `ApiContext` 從 contexts 到 data-hasura（改名 `ApiProvider`）

**Files:**
- Create: `packages/data-hasura/src/contexts/ApiProvider.tsx`
- Delete: `packages/contexts/src/ApiContext.tsx`
- Modify: `packages/contexts/src/index.ts`

- [ ] **Step 1: 建立目錄並複製檔案**

Run:
```bash
mkdir -p packages/data-hasura/src/contexts
cp packages/contexts/src/ApiContext.tsx packages/data-hasura/src/contexts/ApiProvider.tsx
```

- [ ] **Step 2: 更新新檔的 import**

Modify `packages/data-hasura/src/contexts/ApiProvider.tsx` 的 import：

```tsx
// before
import { ApolloClientOptions, createApolloClient } from '@lodestar/helpers/apollo'
import { useAuth } from './AuthContext'
// after
import { ApolloClientOptions, createApolloClient } from '../apollo'
import { useAuth } from '@lodestar/contexts/AuthContext'
```

- [ ] **Step 3: 刪除舊檔**

Run: `rm packages/contexts/src/ApiContext.tsx`

- [ ] **Step 4: 更新 contexts/src/index.ts**

Modify `packages/contexts/src/index.ts` 移除 `export * from './ApiContext'`。

- [ ] **Step 5: 更新 data-hasura/src/index.ts 匯出 ApiProvider**

Modify `packages/data-hasura/src/index.ts`:

```ts
export * from './apollo'
export * from './contexts/ApiProvider'
```

- [ ] **Step 6: 全域搜尋 `@lodestar/contexts/ApiContext` 的 import**

Run: `grep -rn "@lodestar/contexts/ApiContext\|from '@lodestar/contexts'" packages apps 2>&1 | grep -v node_modules | grep -i "api"`

對每個命中行，把 import 改成從 `@lodestar/data-hasura/contexts/ApiProvider` 匯入（或從 `@lodestar/data-hasura`）。

- [ ] **Step 7: Typecheck**

Run: `pnpm -r exec tsc --noEmit 2>&1 | head -30`

Expected: 沒有 `Cannot find module '@lodestar/contexts/ApiContext'` 錯誤。其他（如 AppContext 相關）下個 Task 處理。

- [ ] **Step 8: Commit**

```bash
git add packages/data-hasura packages/contexts
git commit -m "refactor(data-hasura): move ApiContext (ApolloProvider wrapper) out of @lodestar/contexts"
```

---

## Task 5: 拆 `AppContext` — Context 留 contexts，Provider 搬 data-hasura

**Files:**
- Modify: `packages/contexts/src/AppContext.tsx`
- Create: `packages/data-hasura/src/contexts/AppProvider.tsx`

- [ ] **Step 1: 把 `AppProvider` 部分獨立成新檔**

Create `packages/data-hasura/src/contexts/AppProvider.tsx`。內容為原 `AppContext.tsx` 的 **Provider 部分**（line 39 以後 `export const AppProvider` 到檔末），加上必要的 import。最後結構：

```tsx
import { gql, useQuery } from '@apollo/client'
import { useEffect, useMemo } from 'react'
import hasura from '@lodestar/graphql/hasura'
import { AppProps, NavProps } from '@lodestar/types/app'
import { useAuth } from '@lodestar/contexts/AuthContext'
import { AppContext, defaultAppContextProps, type AppContextProps } from '@lodestar/contexts/AppContext'

export const AppProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const { authToken, refreshToken } = useAuth()
  // ...（原 AppProvider 內容，app useMemo 的 return 從 defaultAppContextProps 來）
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>
}
```

- [ ] **Step 2: 簡化 contexts/src/AppContext.tsx — 只留 Context 與 consumer API**

Replace `packages/contexts/src/AppContext.tsx` 整個檔案為：

```tsx
import { createContext, useContext } from 'react'
import { AppProps } from '@lodestar/types/app'

export type AppContextProps = AppProps & {
  loading: boolean
  error?: Error
  refetch?: () => void
}

export const defaultAppContextProps: AppContextProps = {
  id: '',
  orgId: null,
  name: '',
  title: null,
  description: null,
  host: '',
  hosts: [],
  enabledModules: {},
  appPlanId: '',
  navs: [],
  settings: {},
  secrets: {},
  currencyId: 'TWD',
  currencies: {},
  loading: true,
  options: {
    video_duration: 0,
    watched_seconds: 0,
  },
  endedAt: null,
}

export const AppContext = createContext<AppContextProps>(defaultAppContextProps)
export const useApp = () => useContext(AppContext)
```

- [ ] **Step 3: 更新 data-hasura/src/index.ts 匯出 AppProvider**

Modify `packages/data-hasura/src/index.ts`:

```ts
export * from './apollo'
export * from './contexts/ApiProvider'
export * from './contexts/AppProvider'
```

- [ ] **Step 4: Typecheck**

Run: `pnpm -r exec tsc --noEmit 2>&1 | grep -E "AppContext|AppProvider" | head -15`

Expected: 沒有 AppContext/AppProvider 相關錯誤。若有錯誤說 `export AppProvider missing`，檢查 data-hasura AppProvider.tsx 是否有 export。

- [ ] **Step 5: Commit**

```bash
git add packages/contexts/src/AppContext.tsx packages/data-hasura/src/contexts/AppProvider.tsx packages/data-hasura/src/index.ts
git commit -m "refactor(data-hasura): split AppContext provider (useQuery side) from consumer API"
```

---

## Task 6: 搬 9 個 hook 檔 `data.ts` 到 data-hasura

**Files:**
- Create: `packages/data-hasura/src/hooks/data.ts`
- Delete: `packages/hooks/src/data.ts`

- [ ] **Step 1: 複製檔案**

Run:
```bash
mkdir -p packages/data-hasura/src/hooks
cp packages/hooks/src/data.ts packages/data-hasura/src/hooks/data.ts
```

- [ ] **Step 2: 刪除舊檔**

Run: `rm packages/hooks/src/data.ts`

- [ ] **Step 3: 新檔如有相對 import `./xxx`，改為絕對 `@lodestar/data-hasura/hooks/xxx`**

Run: `grep "from '\\.\\/" packages/data-hasura/src/hooks/data.ts`

若 grep 命中，用編輯器修改每個 `from './xxx'` → `from '@lodestar/data-hasura/hooks/xxx'`（注意：其他還沒搬過去的檔案這次還不改，下個 Task 再處理當下搬的檔）。若 grep 無命中則略過。

- [ ] **Step 4: 更新 hooks/src/index.ts**

Modify `packages/hooks/src/index.ts`：把 `export * from './data'` 刪掉。

- [ ] **Step 5: 更新 data-hasura/src/index.ts**

Modify `packages/data-hasura/src/index.ts` 加入：

```ts
export * from './hooks/data'
```

- [ ] **Step 6: Commit**

```bash
git add packages/data-hasura packages/hooks/src
git commit -m "refactor(data-hasura): move data hook file from @lodestar/hooks"
```

---

## Task 7: 搬 `tracking.ts`

**Files:**
- Create: `packages/data-hasura/src/hooks/tracking.ts`
- Delete: `packages/hooks/src/tracking.ts`

- [ ] **Step 1: 搬檔**

Run:
```bash
cp packages/hooks/src/tracking.ts packages/data-hasura/src/hooks/tracking.ts
rm packages/hooks/src/tracking.ts
```

- [ ] **Step 2: 修新檔內的相對 import**

Run: `grep "from '\\.\\/" packages/data-hasura/src/hooks/tracking.ts`

對每個命中行，改為 `from '@lodestar/data-hasura/hooks/<name>'`。

- [ ] **Step 3: 更新 barrel**

Modify `packages/hooks/src/index.ts`：刪除 `export * from './tracking'`。
Modify `packages/data-hasura/src/index.ts`：加入 `export * from './hooks/tracking'`。

- [ ] **Step 4: Commit**

```bash
git add packages/data-hasura packages/hooks/src
git commit -m "refactor(data-hasura): move tracking hook from @lodestar/hooks"
```

---

## Task 8: 搬 `giftPlan.ts`

**Files:**
- Create: `packages/data-hasura/src/hooks/giftPlan.ts`
- Delete: `packages/hooks/src/giftPlan.ts`

- [ ] **Step 1: 搬檔**

Run:
```bash
cp packages/hooks/src/giftPlan.ts packages/data-hasura/src/hooks/giftPlan.ts
rm packages/hooks/src/giftPlan.ts
```

- [ ] **Step 2: 修新檔相對 import**

同 Task 7 Step 2。

- [ ] **Step 3: 更新 barrel**

Modify `packages/hooks/src/index.ts`：刪除 `export * from './giftPlan'`。
Modify `packages/data-hasura/src/index.ts`：加入 `export * from './hooks/giftPlan'`。

- [ ] **Step 4: Commit**

```bash
git add packages/data-hasura packages/hooks/src
git commit -m "refactor(data-hasura): move giftPlan hook from @lodestar/hooks"
```

---

## Task 9: 搬 `program.ts`

**Files:**
- Create: `packages/data-hasura/src/hooks/program.ts`
- Delete: `packages/hooks/src/program.ts`

- [ ] **Step 1: 搬檔**

Run:
```bash
cp packages/hooks/src/program.ts packages/data-hasura/src/hooks/program.ts
rm packages/hooks/src/program.ts
```

- [ ] **Step 2: 修新檔相對 import**

同 Task 7 Step 2。

- [ ] **Step 3: 更新 barrel**

Modify `packages/hooks/src/index.ts`：刪除 `export * from './program'`。
Modify `packages/data-hasura/src/index.ts`：加入 `export * from './hooks/program'`。

- [ ] **Step 4: Commit**

```bash
git add packages/data-hasura packages/hooks/src
git commit -m "refactor(data-hasura): move program hook from @lodestar/hooks"
```

---

## Task 10: 搬 `common.ts`

**Files:**
- Create: `packages/data-hasura/src/hooks/common.ts`
- Delete: `packages/hooks/src/common.ts`

- [ ] **Step 1: 搬檔**

Run:
```bash
cp packages/hooks/src/common.ts packages/data-hasura/src/hooks/common.ts
rm packages/hooks/src/common.ts
```

- [ ] **Step 2: 修新檔相對 import**

同 Task 7 Step 2。

- [ ] **Step 3: 更新 barrel**

Modify `packages/hooks/src/index.ts`：刪除 `export * from './common'`。
Modify `packages/data-hasura/src/index.ts`：加入 `export * from './hooks/common'`。

- [ ] **Step 4: Commit**

```bash
git add packages/data-hasura packages/hooks/src
git commit -m "refactor(data-hasura): move common hook from @lodestar/hooks"
```

---

## Task 11: 搬 `card.ts`

**Files:**
- Create: `packages/data-hasura/src/hooks/card.ts`
- Delete: `packages/hooks/src/card.ts`

- [ ] **Step 1: 搬檔**

Run:
```bash
cp packages/hooks/src/card.ts packages/data-hasura/src/hooks/card.ts
rm packages/hooks/src/card.ts
```

- [ ] **Step 2: 修新檔相對 import**

同 Task 7 Step 2。

- [ ] **Step 3: 更新 barrel**

Modify `packages/hooks/src/index.ts`：刪除 `export * from './card'`。
Modify `packages/data-hasura/src/index.ts`：加入 `export * from './hooks/card'`。

- [ ] **Step 4: Commit**

```bash
git add packages/data-hasura packages/hooks/src
git commit -m "refactor(data-hasura): move card hook from @lodestar/hooks"
```

---

## Task 12: 搬 `review.ts`

**Files:**
- Create: `packages/data-hasura/src/hooks/review.ts`
- Delete: `packages/hooks/src/review.ts`

- [ ] **Step 1: 搬檔**

Run:
```bash
cp packages/hooks/src/review.ts packages/data-hasura/src/hooks/review.ts
rm packages/hooks/src/review.ts
```

- [ ] **Step 2: 修新檔相對 import**

同 Task 7 Step 2。

- [ ] **Step 3: 更新 barrel**

Modify `packages/hooks/src/index.ts`：刪除 `export * from './review'`。
Modify `packages/data-hasura/src/index.ts`：加入 `export * from './hooks/review'`。

- [ ] **Step 4: Commit**

```bash
git add packages/data-hasura packages/hooks/src
git commit -m "refactor(data-hasura): move review hook from @lodestar/hooks"
```

---

## Task 13: 搬 `member.ts`

**Files:**
- Create: `packages/data-hasura/src/hooks/member.ts`
- Delete: `packages/hooks/src/member.ts`

- [ ] **Step 1: 搬檔**

Run:
```bash
cp packages/hooks/src/member.ts packages/data-hasura/src/hooks/member.ts
rm packages/hooks/src/member.ts
```

- [ ] **Step 2: 修新檔相對 import**

同 Task 7 Step 2。

- [ ] **Step 3: 更新 barrel**

Modify `packages/hooks/src/index.ts`：刪除 `export * from './member'`。
Modify `packages/data-hasura/src/index.ts`：加入 `export * from './hooks/member'`。

- [ ] **Step 4: Commit**

```bash
git add packages/data-hasura packages/hooks/src
git commit -m "refactor(data-hasura): move member hook from @lodestar/hooks"
```

---

## Task 14: 搬 `resource.ts`

**Files:**
- Create: `packages/data-hasura/src/hooks/resource.ts`
- Delete: `packages/hooks/src/resource.ts`

- [ ] **Step 1: 搬檔**

Run:
```bash
cp packages/hooks/src/resource.ts packages/data-hasura/src/hooks/resource.ts
rm packages/hooks/src/resource.ts
```

- [ ] **Step 2: 修新檔相對 import**

同 Task 7 Step 2。**且**：若 `packages/data-hasura/src/hooks/resource.ts` 還 `export type ResourceType`（Task 2 抽到 types 後，這邊應該改成 `export type { ResourceType } from '@lodestar/types/resource'` 或完全移除此 export），檢查並同步。

- [ ] **Step 3: 更新 barrel**

Modify `packages/hooks/src/index.ts`：刪除 `export * from './resource'`。
Modify `packages/data-hasura/src/index.ts`：加入 `export * from './hooks/resource'`。

- [ ] **Step 4: Commit**

```bash
git add packages/data-hasura packages/hooks/src
git commit -m "refactor(data-hasura): move resource hook from @lodestar/hooks"
```

---

## Task 15: 修正 data-hasura 內部檔案間的 import

**Files:**
- Modify: `packages/data-hasura/src/hooks/*.ts`（9 個）

- [ ] **Step 1: 找出仍用 `'./xxx'` 相對路徑的 import（那些在 Task 6-14 修錯的）**

Run: `grep -rn "from '\\.\\.\\?/" packages/data-hasura/src/hooks/ 2>&1`

Expected: 多數應該都是 Task 6-14 修過的合法 `../apollo` 或類似路徑，或是 `./otherHook`。如果有 `'./otherHook'` 指向其他搬過來的 hook 檔，保持 `./` 相對路徑即可（不用改絕對路徑，因為現在都在同一個 `hooks/` 目錄下，相對 import 正確）。

- [ ] **Step 2: 檢查 hook 檔互相 import 是否完整**

Run: `pnpm --filter @lodestar/data-hasura exec tsc --noEmit 2>&1 | head -40`

Expected: 看是否有 `Cannot find module` 錯誤。若有，按錯誤訊息修正。

若無錯，略過 Step 3。

- [ ] **Step 3: 修補任何 Cannot find module 錯誤**

按 Step 2 輸出逐一修正。

- [ ] **Step 4: Commit（若有修正）**

```bash
git add packages/data-hasura/src/hooks
git commit -m "fix(data-hasura): repair cross-hook imports after move"
```

若 Step 3 無改動，略過。

---

## Task 16: 更新 `@lodestar/ui` 內引用已搬走 hook / context 的檔案

**Files:**
- Modify: `packages/ui/src/**/*.tsx`（用 grep 找到的所有命中檔）
- Modify: `packages/ui/package.json`

- [ ] **Step 1: 找出所有引用舊路徑的檔案**

Run:
```bash
grep -rn "from '@lodestar/hooks/\\(card\\|common\\|data\\|giftPlan\\|member\\|program\\|resource\\|review\\|tracking\\)'\\|from '@lodestar/contexts/ApiContext'\\|from '@lodestar/contexts/LodestarAppContext'" packages/ui/src 2>&1 | head -50
```

Expected: 列出所有命中行。記下檔案清單。

- [ ] **Step 2: 對每個命中檔，把 import path 改為 `@lodestar/data-hasura/hooks/<name>` 或 `@lodestar/data-hasura/contexts/ApiProvider`**

使用編輯器逐一修改。原則：
- `from '@lodestar/hooks/common'` → `from '@lodestar/data-hasura/hooks/common'`
- `from '@lodestar/hooks/data'` → `from '@lodestar/data-hasura/hooks/data'`
- （以此類推 9 個檔名）
- `from '@lodestar/contexts/ApiContext'` → `from '@lodestar/data-hasura/contexts/ApiProvider'`

**注意：** `from '@lodestar/contexts/AppContext'` **不要改**（useApp 還留在 contexts）。

- [ ] **Step 3: 加 `@lodestar/data-hasura` 到 packages/ui/package.json**

Modify `packages/ui/package.json` 的 `dependencies`，加：

```json
    "@lodestar/data-hasura": "workspace:*",
```

（按字母順序插入）

- [ ] **Step 4: Typecheck ui package**

Run: `pnpm install && pnpm --filter @lodestar/ui exec tsc --noEmit 2>&1 | head -40`

Expected: 沒有 `Cannot find module '@lodestar/hooks/...'` 或相關錯誤。

- [ ] **Step 5: Commit**

```bash
git add packages/ui pnpm-lock.yaml
git commit -m "refactor(ui): point graphql-using imports at @lodestar/data-hasura"
```

---

## Task 17: 把 `LodestarAppProvider` 搬到 element-demo

**Files:**
- Create: `apps/element-demo/src/LodestarAppProvider.tsx`
- Delete: `packages/contexts/src/LodestarAppContext.tsx`
- Modify: `packages/contexts/src/index.ts`
- Modify: `apps/element-demo/src/App.tsx`
- Modify: `apps/element-demo/package.json`

- [ ] **Step 1: 建立 element-demo 本地 provider**

Create `apps/element-demo/src/LodestarAppProvider.tsx`：

```tsx
import { ThemeOverride } from '@chakra-ui/react'
import { createContext } from 'react'
import {
  AppThemeProvider,
  AuthProvider,
  LanguageProvider,
} from '@lodestar/contexts'
import { ApiProvider, AppProvider } from '@lodestar/data-hasura'

export const LodestarAppProvider: React.FC<{
  appId: string
  extend?: { chakraTheme?: ThemeOverride }
}> = ({ appId, children, extend }) => {
  const LodestarAppContext = createContext({ appId })
  return (
    <LodestarAppContext.Provider value={{ appId }}>
      <AuthProvider appId={appId}>
        <ApiProvider appId={appId}>
          <AppProvider appId={appId}>
            <LanguageProvider>
              <AppThemeProvider extendChakraTheme={extend?.chakraTheme}>{children}</AppThemeProvider>
            </LanguageProvider>
          </AppProvider>
        </ApiProvider>
      </AuthProvider>
    </LodestarAppContext.Provider>
  )
}
```

- [ ] **Step 2: 更新 App.tsx 的 import**

Modify `apps/element-demo/src/App.tsx`：

```tsx
// before
import { LodestarAppProvider } from '@lodestar/contexts/LodestarAppContext'
// after
import { LodestarAppProvider } from './LodestarAppProvider'
```

- [ ] **Step 3: 加 `@lodestar/data-hasura` 到 element-demo package.json**

Modify `apps/element-demo/package.json` `dependencies`，加：

```json
    "@lodestar/data-hasura": "workspace:*",
```

（按字母順序）

- [ ] **Step 4: 刪除 contexts 內舊檔**

Run: `rm packages/contexts/src/LodestarAppContext.tsx`

- [ ] **Step 5: 更新 contexts/src/index.ts**

Modify `packages/contexts/src/index.ts` 移除 `export * from './LodestarAppContext'`。

- [ ] **Step 6: pnpm install**

Run: `pnpm install`

Expected: element-demo 取得 `@lodestar/data-hasura` symlink。

- [ ] **Step 7: Typecheck**

Run: `pnpm --filter @lodestar/element-demo exec tsc --noEmit 2>&1 | head -30`

Expected: 沒有錯誤。

- [ ] **Step 8: Commit**

```bash
git add apps/element-demo packages/contexts pnpm-lock.yaml
git commit -m "refactor(element-demo): assemble LodestarAppProvider locally from context + data packages"
```

---

## Task 18: Workspace-wide typecheck

**Files:** 無修改，驗證用。

- [ ] **Step 1: 跑整個 workspace typecheck**

Run: `pnpm -r exec tsc --noEmit 2>&1 | tee /tmp/typecheck.log | tail -40`

Expected: PASS 或輸出為空。若有錯誤，用下一步修。

- [ ] **Step 2: 修復任何剩餘 typecheck 錯誤**

讀 `/tmp/typecheck.log`，逐一修正。常見：
- 舊 import 路徑漏改：用 grep 搜尋 + 更新
- 循環依賴：檢查 data-hasura → contexts → data-hasura 有無不小心發生
- 未 export：data-hasura/src/index.ts 可能需要補 re-export

- [ ] **Step 3: 重跑 typecheck 直到 PASS**

Run: `pnpm -r exec tsc --noEmit`

Expected: 無 output（全 PASS）。

- [ ] **Step 4: Commit（若有修）**

```bash
git add -A
git commit -m "fix(data-hasura): resolve remaining typecheck errors after migration"
```

若無修，略過。

---

## Task 19: Runtime parity verification

**Files:** 無修改，驗證用。前置：master 仍在 port 3001 運作，element-demo 需重啟後在 port 3002。

- [ ] **Step 1: 重啟 element-demo dev server**

Run:
```bash
lsof -iTCP:3002 -sTCP:LISTEN -t 2>/dev/null | xargs kill 2>/dev/null
cd apps/element-demo && pnpm exec vite --port 3002 --force > /tmp/element-demo-dev.log 2>&1 &
cd -
```

等 `tail -n 5 /tmp/element-demo-dev.log` 看到 `VITE ... ready in`。

- [ ] **Step 2: 確認 element-demo 首頁回 200**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3002/`

Expected: `200`

- [ ] **Step 3: 用 Chrome MCP 檢查 15 條路由是否 render**

開 tab 載入 http://localhost:3002/ ，逐一 pushState 走 15 條路由，比對內容與 master（port 3001）。參照 `docs/superpowers/specs/2026-04-21-element-demo-parity-report.md` 的表格。

Expected: 15/15 仍一致，沒有新的 regression。

**Acceptance：** 若任一路由變空白、報錯、或文字不符（如 i18n 又掉、moment locale 又掉），立刻停下查 root cause；不要 retry。

- [ ] **Step 4: Commit 最後的 progress update**

如果驗證通過，更新 `MIGRATION_PROGRESS.md`：

Modify `MIGRATION_PROGRESS.md` 的「待辦（遷移後）」區塊：

```markdown
- [ ] UI 與資料層解耦（@lodestar/ui 不應直接依賴 @lodestar/graphql）
  - [x] Phase A: 建立 @lodestar/data-hasura，搬 hooks + contexts + apollo helper（見 `docs/superpowers/plans/2026-04-21-data-hasura-phase-a.md`）
  - [ ] Phase B: @lodestar/ui 改 props-only
  - [ ] Phase C: 清洗 package.json 依賴
```

```bash
git add MIGRATION_PROGRESS.md
git commit -m "docs: mark phase A of UI/data decoupling complete"
```

---

## Acceptance Criteria (Phase A 完工標準)

1. `packages/data-hasura/` 存在且 typecheck PASS
2. `packages/hooks/src/` 只剩 `util.ts`, `checkout.ts`, `index.ts`
3. `packages/contexts/src/` 無 `ApiContext.tsx`、`LodestarAppContext.tsx`；`AppContext.tsx` 不含 `AppProvider`
4. `packages/helpers/src/apollo.ts` 已刪除
5. `pnpm -r exec tsc --noEmit` 全 PASS
6. element-demo `http://localhost:3002` 啟動正常，15/15 路由視覺與 master 一致
7. `MIGRATION_PROGRESS.md` Phase A 勾選

## 尚未處理（留給 Phase B / C）

- `@lodestar/ui` 仍直接依賴 `@lodestar/data-hasura`（Phase B 拆 props-only 後移除）
- `@lodestar/ui/package.json` 的 `@apollo/client`、`graphql`、`graphql-ws`、`@lodestar/graphql` 仍在（Phase C 清）
- `@lodestar/contexts/package.json` 的 `@apollo/client`、`@lodestar/graphql` 仍在（Phase C 清）
- `@lodestar/hooks/package.json` 的 `@apollo/client`、`@lodestar/graphql` 仍在（Phase C 清）
- `@lodestar/helpers/package.json` 的 graphql/@apollo/client 仍在（Phase C 清）
