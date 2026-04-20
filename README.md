# Lodestar App Element

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

## Craft.js

> every changes will break the application
> we have to do our best not to revise the interface

## Element Component

each component should be `ElementComponent` so that it can be converted to Craft Element.
To convert to Craft element, simply use:

```ts
Craftize(ElementComponent)
```

for an element component, you will get the following props:

1. className: after crafting, you will get the styled className
2. loading: you will get partial props for loading
3. errors: you will get partial props for errors
4. editing: craft editor state
5. other props you set

### Why do we keep loading/errors/data at once?

when the state changed into loading, the data/error state should still exist.
also, when the state changed into error, the original UI should be kept.

## Context Collection

### Why do we use context?

1. Custom hook: not suitable for development
2. useState: not suitable for graphql
3. Conditional render: not suitable for flexible UI component
   we focus on data processing instead of passing through annoying arguments
