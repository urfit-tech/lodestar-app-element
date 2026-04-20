# Playground Gap Analysis — 視覺化遷移剩餘工作量

**日期：** 2026-04-21
**分支：** refactor/v1
**相關文件：**
- `docs/superpowers/specs/2026-03-14-monorepo-migration-design.md`
- `docs/superpowers/plans/2026-03-14-monorepo-migration.md`
- `MIGRATION_PROGRESS.md`

## 背景

`lodestar-app-element` 正在從單一 CRA 專案遷移到 pnpm monorepo。遷移分階段：

- 階段 1–3（已完成）：pnpm workspace、packages/* 拆分、`apps/element-demo` 建立
- 階段 4（進行中）：`apps/playground` 使用**新技術棧**（React 19 + Tailwind + TanStack Start）重現舊版所有頁面
- 最終目標：`playground` 以新 stack 呈現的視覺/功能效果與 `origin/master` 舊版一致

目前 `apps/playground` 是未 commit 的早期實驗（conference demo），尚未覆蓋 lodestar-app-element 的任何實際頁面。本次任務目的是**量化尚未完成的頁面遷移工作量**。

## 目標

產出一份 **gap analysis 報告**，回答以下問題：

1. `origin/master` 的 15 條路由各自在 `playground` 的實作狀態為何？（不存在 / 部分 / 完整）
2. 舊版每條路由的視覺參考截圖？
3. 哪些頁面優先？（依舊版 UI 複雜度與依賴）

## 非目標

- 不修改任何程式碼
- 不實作 playground 缺失頁面
- 不處理 element-demo 與 master 的差異（element-demo 是中間產物，非遷移終點）

## 架構

### 環境隔離

```
~/urfit/
├── lodestar-app-element/                  ← 當前 (refactor/v1, pnpm)
│   └── apps/playground/                    ← 新 stack demo
└── lodestar-app-element-master/            ← 新增 worktree (origin/master, yarn)
```

用 `git worktree` 保持兩個結構完全隔離，避免 node_modules、lockfile、Node 版本衝突。

### 版本管理（mise）

舊版 worktree 根目錄新增 `.mise.toml`：

```toml
[tools]
node = "16"
yarn = "1"
```

`mise install` 會自動安裝對應版本；`direnv` 或 `mise activate` 進入目錄即切換。

### 環境變數

舊版需要 `REACT_APP_*` 系列變數（見 `.env.development.encrypted`）。使用 `sops -d` 解密後寫入 worktree 的 `.env.development`，CRA 會自動載入。`REACT_APP_ID=demo` 已確認有效。

### Port 分配

| App | Port | 套件管理 |
|---|---|---|
| master (CRA) | 3001 | yarn 1 |
| playground (Vite + TanStack Start) | 3000 | npm |

## 執行步驟

1. **建立 worktree**
   - `git worktree add ../lodestar-app-element-master origin/master`
2. **配置 worktree 環境**
   - 寫入 `.mise.toml`（Node 16 + yarn 1）
   - `sops -d .env.development.encrypted > ../lodestar-app-element-master/.env.development`
   - `mise install`
3. **啟動 master**
   - 在 worktree 內 `yarn install`
   - `PORT=3001 yarn start`（背景執行）
   - 驗證 http://localhost:3001 可載入 Home
4. **啟動 playground**
   - 在當前目錄 `cd apps/playground && npm install && npm run dev`（背景執行）
   - 驗證 http://localhost:3000 可載入 Home
5. **Chrome MCP 對比**
   - 開兩個 tab
   - 對 master 的 15 條路由逐一 navigate + 截圖
   - 對照 playground 是否有對應頁
   - 記錄視覺差異、錯誤、功能完整度
6. **產出報告** `docs/superpowers/specs/2026-04-21-playground-gap-analysis.md`
   - 表格格式：`| Route | Master Screenshot | Playground Status | Notes |`

## 待對比的路由清單（來自 `origin/master:src/App.tsx`）

1. `/` (Home)
2. `/auth` (AuthPage)
3. `/member` (MemberElementPage)
4. `/programs` (ProgramElementPage)
5. `/program-contents` (ProgramContentCollectionPage)
6. `/program-package` (ProgramPackagePage)
7. `/project` (ProjectElementPage)
8. `/activity` (ActivityPage)
9. `/layout` (LayoutPage)
10. `/text` (TextPage)
11. `/carousel` (CarouselPage)
12. `/image` (ImagePage)
13. `/checkout` (CheckoutPage)
14. `/ai-bot` (AIBotPage)
15. `/event` (MemberEventCalendarBlock)

## 風險與中止條件

**已知風險（會記錄進報告，不中止）：**
- 舊版後端 API 指向 `*-dev.kolable.com`，可能遇 CORS / 認證 / 資料不全問題 → 仍可觀察元件 layout、空狀態、error fallback
- `REACT_APP_ID=demo` 可能對應的是 dev DB 中某個 demo tenant，若該 tenant 資料被清理，部分頁面會空白
- 部分路由（`/member`、`/checkout`）需要登入態才能渲染完整內容 → 記錄為「需登入後續驗證」

**硬中止條件：**
- 任一 app 啟動失敗連續 3 次嘗試（含 diagnose），停下來回報 root cause，不盲目 retry
- `sops` 解密失敗（表示 age key 不在本機）→ 回報並請 user 補 key

## 產出物

1. `../lodestar-app-element-master/` — git worktree（留存供後續使用或手動清理）
2. `docs/superpowers/specs/2026-04-21-playground-gap-analysis.md` — gap 報告
3. 截圖檔案存於 `docs/superpowers/specs/assets/2026-04-21-playground-gap/`，Markdown 用相對路徑引用

## 後續步驟

本 spec 不涵蓋實作修補。Gap 報告將成為下一輪 planning 的輸入：

- 依優先度排序 playground 要實作的路由
- 設計 playground 如何 port 舊版元件（沿用 `@lodestar/ui`? 重寫 Tailwind 版?）
- 新一份 `docs/superpowers/plans/YYYY-MM-DD-playground-port-*.md` 逐頁實作
