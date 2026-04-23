# Lodestar App Element

A pnpm-workspace monorepo of the presentational pieces powering Lodestar apps. The package graph is layered so every component can be used either as a Craft.js draggable block or as a plain React component, and so the data layer is swappable without rewriting the UI.

## Packages

| Package | Role |
|---|---|
| `@lodestar/types` | Shared TypeScript view types (no runtime code) |
| `@lodestar/helpers` | Pure utilities (formatting, error helpers, translation message dictionaries) — no GraphQL, no Apollo |
| `@lodestar/graphql` | Hasura codegen output + query factories. Only `@lodestar/data-hasura` consumes it |
| `@lodestar/data-hasura` | All data-fetching hooks (`useActivityCollection`, `useCheckoutFlow`, `useOrderDetail`, …) + ApolloProvider / AppProvider. The single chokepoint where Apollo lives |
| `@lodestar/contexts` | Pure React contexts (`AuthContext`, `LanguageContext`, `AuthModalContext`, `AppThemeContext`) — no GraphQL |
| `@lodestar/hooks` | Pure utility hooks (`util`, `checkout`) — no GraphQL |
| `@lodestar/ui` | Presentational components + `Craftize` HOC. Accepts data via props; never calls `useQuery` |
| `apps/element-demo` | Vite demo app that wires `@lodestar/ui` + `@lodestar/data-hasura` together for every route |
| `apps/playground` | **Not part of the migration.** A tech-stack sandbox (React 19 + TanStack Start + Apollo v4) used for future-tech evaluation |

The `@lodestar/ui` package is **props-only** (Phase B/C of the migration — see `docs/superpowers/specs/2026-04-21-ui-data-decoupling-design.md`). A lint rule in `.oxlintrc.json` enforces this by forbidding `@apollo/client` / `graphql` / `graphql-ws` / `@lodestar/graphql` imports inside `packages/{ui,contexts,hooks,helpers}/src`. CI runs it on every PR.

Consumer apps (`apps/element-demo` today, `apps/web` / `apps/admin` later) do the "connected" wiring themselves: call a hook from `@lodestar/data-hasura`, feed the result into a pure UI component, and optionally wrap in `Craftize` to expose the thing as a Craft.js draggable block. See `apps/element-demo/src/craft/` for seven canonical examples.

## Getting Started

### Prerequisites

安裝 [mise](https://mise.jdx.dev/)（會自動管理 node, pnpm, sops, age, direnv, moon）：

```bash
curl https://mise.run | sh
```

### Setup

```bash
# 1. 進入專案目錄，mise 會自動安裝所有工具
cd lodestar-app-element
mise install

# 2. 啟用 direnv（自動載入環境變數）
direnv allow

# 3. 安裝依賴
pnpm install
```

完成後，每次 `cd` 進專案目錄，direnv 會自動解密並載入環境變數。

### 環境變數管理（sops + age）

環境變數使用 [sops](https://github.com/getsops/sops) + [age](https://github.com/FiloSottile/age) 加密，存放在 `.env.<環境>.encrypted` 中。

#### 首次設定 age key

如果你是新加入的開發者，需要向團隊取得 age private key，放到：

```bash
mkdir -p ~/.config/sops/age
# 將取得的 key 寫入 ~/.config/sops/age/keys.txt
```

#### 檔案結構

```
.env.development.encrypted   # 開發環境（加密，commit 到 git）
.env.staging.encrypted        # Staging（加密，commit 到 git）
.env.production.encrypted     # Production（加密，commit 到 git）
.sops.yaml                    # sops 加密規則
.envrc                        # direnv 設定，自動解密載入
```

#### 編輯環境變數

```bash
# 編輯開發環境（會開啟編輯器，存檔時自動重新加密）
sops .env.development.encrypted

# 編輯 staging
sops .env.staging.encrypted
```

#### 新增環境

```bash
# 建立明文 env 檔
cat > .env.myenv <<EOF
REACT_APP_API_BASE_ROOT=https://...
VITE_APP_ID=my-app
EOF

# 複製為 .encrypted 並加密
cp .env.myenv .env.myenv.encrypted
sops --encrypt --in-place .env.myenv.encrypted

# 刪除明文檔
rm .env.myenv
```

#### 切換環境

```bash
# 預設載入 development
direnv reload

# 切換到 staging
export APP_ENV=staging && direnv reload

# 切換到 production
export APP_ENV=production && direnv reload
```

#### 新增開發者

1. 新開發者產生自己的 age key：`age-keygen -o ~/.config/sops/age/keys.txt`
2. 將 public key 加入 `.sops.yaml`
3. 用 `sops updatekeys .env.development.encrypted` 重新加密給新的 key

---

## Development

```bash
# 啟動 demo app
moon run element-demo:dev

# Type check
pnpm typecheck

# Lint
pnpm lint
pnpm lint:fix

# Format
pnpm format
pnpm format:check
```

## Architecture

### Three-layer composition

Every data-driven UI element in `apps/element-demo/src/craft/` follows the same shape:

```tsx
// packages/data-hasura/src/hooks/activity.ts
export const useActivityCollection = (source: ActivityCollectionSource) => { … }

// packages/ui/src/components/collections/ActivityCollection.tsx  (pure)
export type ActivityCollectionProps = {
  activities?: ActivityCollectionItem[]
  isFetching?: boolean
  fetchError?: Error
  …other presentational props
}
const ActivityCollection: ElementComponent<ActivityCollectionProps> = props => { … }

// apps/element-demo/src/craft/CraftActivityCollection.tsx  (consumer glue)
const ConnectedActivityCollection = props => {
  const resolvedSource = useMemo(() => props.source ?? DEFAULT_SOURCE, [props.source])
  const { data, loading, error } = useActivityCollection(resolvedSource)
  return <ActivityCollection {...props} activities={data} isFetching={loading} fetchError={error} />
}
export const CraftActivityCollection: UserComponent<PropsWithCraft<…>> =
  Craftize(ConnectedActivityCollection)
```

Key points:

- `Craftize` cannot be composed with another HOC (it registers the wrapped function directly with Craft.js). Put the data-fetching function component **inside** `Craftize`, not outside.
- Re-bind the Craft export with an explicit `UserComponent<PropsWithCraft<…>>` annotation — otherwise TypeScript tries to emit a declaration reaching into `node_modules/@craftjs/core` and fails with TS2742.
- Memoize the resolved source so `useActivityCollection`'s `useMemo` deps stay stable when callers omit `source`.

### ElementComponent — what the pure UI surface expects

```ts
const Component: ElementComponent<Props> = props => { … }
```

An `ElementComponent<P>` is `React.FC<P & ElementBaseProps>` where `ElementBaseProps` includes:

- `className?`, `editing?`, `children?` — standard
- `loading?: boolean` / `errors?: Error[]` — parent-driven "I'm loading, hide me" signals

The convention matters because `Craftize` attaches the same base props. Don't name query-state props `loading` / `error` — they'd collide with these parent-driven ones. Use something more specific (`isFetching`, `fetchError`, etc.) inside each component.

### Pure Craftize catalog

`packages/ui/src/components/common/CraftPureElements.tsx` exports the Craftize'd versions of the non-data-driven components (Layout, Section, Text, Title, Paragraph, Button, Image, Card, RichCard, Carousel, Collapse, Embedded, AIBot). Each consumer app spreads this plus its own `src/craft/` bag into Craft.js's `resolver` map:

```tsx
// apps/element-demo/src/App.tsx
import * as UiCraftResolvers from '@lodestar/ui/components/common/CraftPureElements'
import * as LocalCraftResolvers from './craft'
const craftResolvers = { ...UiCraftResolvers, ...LocalCraftResolvers }
<Editor resolver={craftResolvers}> … </Editor>
```

### Further reading

- Migration specs + plans: `docs/superpowers/specs/`, `docs/superpowers/plans/`
- Migration progress dashboard: [`MIGRATION_PROGRESS.md`](./MIGRATION_PROGRESS.md)
- Manual verification checklist for the decoupling work: `docs/superpowers/plans/2026-04-23-phase-b-manual-verification.md`
