# Phase B-0 — ActivityCollection Prototype (UI props-only)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 ActivityCollection 當 prototype，把 `@lodestar/ui` 中「元件自抓資料」的模式改成「pure UI + data hook + Connected wrapper」三層。跑通整條流水線後，B-1 / B-2 套同樣手法。

**Architecture（請先讀 meta-plan §2）：**
- `@lodestar/ui` 只留 pure presentational + `Craftize` HOC
- `@lodestar/data-hasura` 出 data hooks
- `apps/element-demo/src/craft/` 組 Connected wrapper + Craftize 註冊

**Tech Stack:** pnpm workspaces, TypeScript project references, Vite 6, Apollo Client 3.7, Craft.js, React 17.

**Spec:** `docs/superpowers/specs/2026-04-21-ui-data-decoupling-design.md`
**Meta-plan:** `docs/superpowers/plans/2026-04-23-phase-b-meta-plan.md`

---

## File Structure (B-0 結束狀態)

### 新建

- `packages/types/src/activity.ts` — collection-view 專用的 `ActivityCollectionItem` 型別
- `packages/data-hasura/src/hooks/activity.ts` — `usePublishedActivities` + `useCustomActivities`
- `apps/element-demo/src/craft/CraftActivityCollection.tsx` — connected wrapper + `Craftize`
- `apps/element-demo/src/craft/index.ts` — 匯出 craft 元件（日後 B-1/B-2 會往這裡加）

### 修改

- `packages/ui/src/components/collections/ActivityCollection.tsx` — 改成 props-only，移除所有 apollo / graphql import
- `packages/ui/src/components/common/CraftElement.tsx` — 移除 `CraftActivityCollection` export（其餘 craftize 暫留）
- `packages/data-hasura/src/index.ts` — 加入 `export * from './hooks/activity'`
- `apps/element-demo/src/App.tsx` — resolver map 改為「ui 的 CraftElement + 自家 craft/」合併
- `apps/element-demo/src/pages/ActivityPage.tsx` — import path 指向 `../craft/CraftActivityCollection`

### 不動

- `packages/graphql/src/queries.ts:59` 的 `getActivityCollectionQuery`（hook 內照用）
- `packages/ui/src/components/cards/ActivityCard.tsx`（本身就是 pure UI，props-only）
- 其他 6 個 collection、4 個 modal/selector（留給 B-1 / B-2）

---

## Task 1: 抽 `ActivityCollectionItem` 型別到 `@lodestar/types/src/activity.ts`

**動機：** 現在 `ActivityCollection.tsx:21` 用 `DeepPick<Activity, ...>` 推出 shape，但 `composeCollectionData` 實際回傳的欄位結構較簡（`sessions: {startedAt, endedAt}[]`、`tickets: {limit, price}[]`、`categories: {id, name}[]`），DeepPick 帶的冗餘欄位會讓 props-only UI 的型別不準。抽一份明確型別。

**Files:**
- Create: `packages/types/src/activity.ts`

- [ ] **Step 1: 建立 `packages/types/src/activity.ts`**

```ts
export type ActivityCollectionSession = {
  startedAt: Date | string
  endedAt: Date | string
}

export type ActivityCollectionTicket = {
  limit: number
  price: number
}

export type ActivityCollectionCategory = {
  id: string
  name: string
}

export type ActivityCollectionItem = {
  id: string
  title: string
  coverUrl: string | null
  isParticipantVisible: boolean
  organizerId: string
  sessions: ActivityCollectionSession[]
  tickets: ActivityCollectionTicket[]
  categories: ActivityCollectionCategory[]
  totalParticipants: number
}
```

- [ ] **Step 2: 確認 `packages/types/src/index.ts` 是否需要 re-export**

Run: `cat packages/types/src/index.ts`

若是 barrel export，視結構加入 `export * from './activity'`；若沒 barrel，略過（consumer 直接 `@lodestar/types/activity` import）。

- [ ] **Step 3: Typecheck types package**

Run: `pnpm --filter @lodestar/types exec tsc --noEmit`

Expected: PASS。

---

## Task 2: 建立 `@lodestar/data-hasura/src/hooks/activity.ts`

**Files:**
- Create: `packages/data-hasura/src/hooks/activity.ts`

**設計決策：** 不拆成 `usePublishedActivities` + `useCustomActivities` 兩個 hook。兩種 variant 打的都是同一個 `GET_ACTIVITY_COLLECTION` document，只差 `whereClause` 與後處理。統一成 `useActivityCollection(source)`，hook 內用 `useMemo` 算變數，消費者單次呼叫即可 —— 避免 Connected wrapper 要用「兩個 hook + skip」去繞 React rules-of-hooks。

- [ ] **Step 1: 建立檔案**

從 `packages/ui/src/components/collections/ActivityCollection.tsx` 把 `collectPublishedAtCollection`、`collectCustomCollection`、`composeCollectionData`、`activityFields` 四塊搬過來，合併成一個 hook。

```ts
import { gql, useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { notEmpty } from '@lodestar/helpers'
import * as hasura from '@lodestar/graphql/hasura'
import { getActivityCollectionQuery } from '@lodestar/graphql/queries'
import { ActivityCollectionItem } from '@lodestar/types/activity'
import { ProductCustomSource, ProductPublishedAtSource } from '@lodestar/types/options'

export type ActivityCollectionSource = ProductPublishedAtSource | ProductCustomSource

export type UseActivityCollectionResult = {
  data: ActivityCollectionItem[]
  loading: boolean
  error?: Error
}

const activityFields = gql`
  fragment activityFields on activity {
    id
    cover_url
    title
    published_at
    is_participants_visible
    organizer_id
    activity_categories {
      category {
        id
        name
      }
    }
    activity_enrollments_aggregate {
      aggregate {
        count
      }
    }
    activity_sessions {
      started_at
      ended_at
    }
    activity_tickets {
      count
      price
    }
  }
`

const composeCollectionData = (data: hasura.GET_ACTIVITY_COLLECTION): ActivityCollectionItem[] =>
  data.activity.map(a => ({
    id: a.id,
    title: a.title,
    coverUrl: a.cover_url || null,
    isParticipantVisible: a.is_participants_visible,
    organizerId: a.organizer_id,
    sessions: a.activity_sessions.map(as => ({
      startedAt: as.started_at,
      endedAt: as.ended_at,
    })),
    tickets: a.activity_tickets.map(at => ({
      limit: at.count,
      price: at.price,
    })),
    categories: a.activity_categories.map(ac => ({
      id: ac.category.id,
      name: ac.category.name,
    })),
    totalParticipants: 0, // TODO: wire activity_enrollments_aggregate once ui needs it
  }))

const buildVariables = (source: ActivityCollectionSource): hasura.GET_ACTIVITY_COLLECTIONVariables => {
  if (source.from === 'custom') {
    return {
      limit: undefined,
      orderByClause: [],
      whereClause: {
        id: { _in: source.idList || [] },
        published_at: { _lt: 'now()' },
        is_private: { _eq: false },
      },
    }
  }
  return {
    whereClause: {
      activity_categories: source.defaultCategoryIds?.length
        ? { category_id: { _in: source.defaultCategoryIds } }
        : undefined,
      activity_tags: source.defaultTagNames?.length
        ? { tag_name: { _in: source.defaultTagNames } }
        : undefined,
      published_at: { _lt: 'now()' },
      is_private: { _eq: false },
    },
    orderByClause: [{ published_at: (source.asc ? 'asc' : 'desc') as hasura.order_by }],
    limit: source.limit,
  }
}

export const useActivityCollection = (source: ActivityCollectionSource): UseActivityCollectionResult => {
  const variables = useMemo(() => buildVariables(source), [source])
  const { data: rawData, loading, error } = useQuery<
    hasura.GET_ACTIVITY_COLLECTION,
    hasura.GET_ACTIVITY_COLLECTIONVariables
  >(getActivityCollectionQuery(activityFields), { variables })

  const composed = useMemo(() => {
    if (!rawData) return []
    // `custom` source: preserve the caller-supplied idList order (matches
    // the original collectCustomCollection behaviour — the query itself
    // returns rows in arbitrary order).
    if (source.from === 'custom') {
      const ordered: hasura.GET_ACTIVITY_COLLECTION = {
        ...rawData,
        activity: (source.idList || [])
          .map(id => rawData.activity.find(a => a.id === id))
          .filter(notEmpty),
      }
      return composeCollectionData(ordered)
    }
    return composeCollectionData(rawData)
  }, [rawData, source])

  return {
    data: composed,
    loading,
    error: error && new Error(error.message),
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @lodestar/data-hasura exec tsc --noEmit 2>&1 | head -20`

Expected: PASS。若 `@lodestar/types/activity` 無法解析，檢查 Task 1 是否完成並 pnpm install。

---

## Task 3: 把 `activity.ts` 加入 data-hasura barrel

**Files:**
- Modify: `packages/data-hasura/src/index.ts`

- [ ] **Step 1: 加入 export**

在現有 `export * from './hooks/coupon'` 那一段附近加：

```ts
export * from './hooks/activity'
```

維持字母序。

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @lodestar/data-hasura exec tsc --noEmit`

Expected: PASS（barrel 內無名稱衝突）。

---

## Task 4: 重寫 `ActivityCollection.tsx` 成 props-only

**Files:**
- Modify: `packages/ui/src/components/collections/ActivityCollection.tsx`

- [ ] **Step 1: 重寫整個檔案**

**Prop 命名設計：** 為避免撞到 `ElementComponent<P>` 自帶的 `loading?: boolean` / `errors?: Error[]`（parent-driven 的「不要 render」語意），query 狀態改用明確命名：
- `activities: ActivityCollectionItem[]` — 查詢結果
- `isFetching: boolean` — query loading
- `fetchError?: Error` — query error

`ElementComponent` 的 `loading` / `errors` 保留原語意（parent 要求 hide），不動。

檔案改為：

```tsx
import moment from 'moment'
import { sum, uniqBy } from 'ramda'
import { useHistory } from 'react-router'
import { StringParam } from 'serialize-query-params'
import { useQueryParam } from 'use-query-params'
import { convertPathName } from '@lodestar/helpers'
import { ActivityCollectionCategory, ActivityCollectionItem } from '@lodestar/types/activity'
import { ElementComponent } from '@lodestar/types/element'
import ActivityCard from '../cards/ActivityCard'
import { BaseCarouselProps } from '../common/BaseCarousel'
import CategorySelector from '../common/CategorySelector'
import Collection, { CollectionLayout } from './Collection'
import CollectionCarousel from './CollectionCarousel'

export type ActivityCollectionProps = {
  name?: string
  activities?: ActivityCollectionItem[]
  isFetching?: boolean
  fetchError?: Error
  defaultCategoryIds?: string[]
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
}

const ActivityCollection: ElementComponent<ActivityCollectionProps> = props => {
  const history = useHistory()
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)

  const {
    activities = [],
    isFetching,
    fetchError,
    defaultCategoryIds,
    children,
    loading: parentLoading,
    errors: parentErrors,
  } = props

  if (parentLoading || parentErrors) {
    return null
  }

  const collectionName = props.name || convertPathName(window.location.pathname)
  const EntityElement = props.variant === 'card' ? ActivityCard : ActivityCard
  const ElementCollection =
    props.collectionVariant === 'carousel'
      ? CollectionCarousel(collectionName, 'activity', EntityElement)
      : Collection(collectionName, 'activity', EntityElement)

  const categories: ActivityCollectionCategory[] = isFetching || fetchError
    ? []
    : uniqBy(
        (category: ActivityCollectionCategory) => category.id,
      )(
        activities
          .flatMap(d => d.categories)
          .filter(category => !defaultCategoryIds || !defaultCategoryIds.includes(category.id)),
      )

  const filterByActiveCategory = (d: ActivityCollectionItem) =>
    !props.withSelector ||
    !activeCategoryId ||
    d.categories.map(category => category.id).includes(activeCategoryId)

  return (
    <div className={props.className}>
      {props.withSelector && (
        <CategorySelector
          categories={categories}
          activeCategoryId={activeCategoryId || null}
          onActive={categoryId => setActive(categoryId)}
        />
      )}
      {children}
      {isFetching ? (
        <ElementCollection layout={props.layout} carouselProps={props.carousel} loading />
      ) : fetchError ? (
        <ElementCollection layout={props.layout} carouselProps={props.carousel} errors={[fetchError]} />
      ) : (
        <ElementCollection
          layout={props.layout}
          carouselProps={props.carousel}
          data={activities.filter(filterByActiveCategory)}
          renderElement={({ data: activity, ElementComponent: ActivityElement, onClick }) => (
            <ActivityElement
              editing={props.editing}
              id={activity.id}
              coverUrl={activity.coverUrl}
              title={activity.title}
              isParticipantsVisible={activity.isParticipantVisible}
              startedAt={moment.min(activity.sessions.map(session => moment(session.startedAt as any))).toDate()}
              endedAt={moment.max(activity.sessions.map(session => moment(session.endedAt as any))).toDate()}
              participantCount={activity.totalParticipants}
              totalSeats={sum(activity.tickets.map(ticket => ticket.limit))}
              categories={activity.categories}
              onClick={() => {
                onClick?.()
                !props.editing && history.push(`/activities/${activity.id}`)
              }}
            />
          )}
        />
      )}
    </div>
  )
}

export default ActivityCollection
```

**重點差異：**
- 移除 `import { gql, useQuery } from '@apollo/client'`、`import * as hasura`、`import { getActivityCollectionQuery }`、`import { DeepPick }`、`import { notEmpty }`、`import ContextCollection`
- 移除 `collectPublishedAtCollection` / `collectCustomCollection` / `composeCollectionData` / `activityFields`（已搬去 Task 2）
- 新 props: `activities`, `isFetching`, `fetchError`, `defaultCategoryIds`（取代原本從 source 裡讀的部分）
- `source` 整個刪掉 —— 資料源決策留給 Connected wrapper
- `loading` / `errors` 保留（來自 `ElementComponent` 基底，parent-driven「hide」語意）

- [ ] **Step 2: 驗證 ui 不再引用 apollo**

Run: `grep -n "@apollo\|@lodestar/graphql\|\bgql\b\|\buseQuery\b" packages/ui/src/components/collections/ActivityCollection.tsx`

Expected: 無輸出。

- [ ] **Step 3: Typecheck ui**

Run: `pnpm --filter @lodestar/ui exec tsc --noEmit 2>&1 | tail -20`

Expected: PASS。若 Collection 相關型別報錯（例如 `ContextCollection` 被移除後其他匯出可能壞），讀錯誤訊息修。

---

## Task 5: 從 `CraftElement.tsx` 移除 `CraftActivityCollection`

**Files:**
- Modify: `packages/ui/src/components/common/CraftElement.tsx`

- [ ] **Step 1: 刪除相關行**

刪除兩行：
```tsx
import ActivityCollection from '../collections/ActivityCollection'
```
與
```tsx
export const CraftActivityCollection = Craftize(ActivityCollection)
```

其餘保留（B-1 / B-2 再搬）。

- [ ] **Step 2: Typecheck ui**

Run: `pnpm --filter @lodestar/ui exec tsc --noEmit`

Expected: PASS（`ActivityCollection` 檔案本身仍在 ui，純被消費者用 `@lodestar/ui/components/collections/ActivityCollection`；Craftize 包裝搬去 element-demo）。

---

## Task 6: 建立 `apps/element-demo/src/craft/CraftActivityCollection.tsx`

**Files:**
- Create: `apps/element-demo/src/craft/CraftActivityCollection.tsx`
- Create: `apps/element-demo/src/craft/index.ts`

- [ ] **Step 1: 建立 `apps/element-demo/src/craft/CraftActivityCollection.tsx`**

```tsx
import React from 'react'
import ActivityCollection, { ActivityCollectionProps } from '@lodestar/ui/components/collections/ActivityCollection'
import Craftize from '@lodestar/ui/components/common/Craftize'
import { ActivityCollectionSource, useActivityCollection } from '@lodestar/data-hasura/hooks/activity'

export type CraftActivityCollectionProps = Omit<
  ActivityCollectionProps,
  'activities' | 'isFetching' | 'fetchError' | 'defaultCategoryIds'
> & {
  source?: ActivityCollectionSource
}

const ConnectedActivityCollection: React.FC<CraftActivityCollectionProps> = ({ source, ...rest }) => {
  const resolvedSource: ActivityCollectionSource = source ?? { from: 'publishedAt' }
  const { data, loading, error } = useActivityCollection(resolvedSource)
  const defaultCategoryIds =
    resolvedSource.from === 'publishedAt' ? resolvedSource.defaultCategoryIds : undefined

  return (
    <ActivityCollection
      {...rest}
      activities={data}
      isFetching={loading}
      fetchError={error}
      defaultCategoryIds={defaultCategoryIds}
    />
  )
}

export const CraftActivityCollection = Craftize(ConnectedActivityCollection)
```

**單一 hook 呼叫：** Task 2 已把兩種 source 合併成 `useActivityCollection(source)`，Connected wrapper 不用處理 React rules-of-hooks 的條件呼叫問題，也不需要 `skip` flag。

- [ ] **Step 2: 建立 `apps/element-demo/src/craft/index.ts`**

```ts
export * from './CraftActivityCollection'
```

- [ ] **Step 3: Typecheck element-demo**

Run: `pnpm --filter @lodestar/element-demo exec tsc --noEmit 2>&1 | tail -20`

Expected: PASS。

---

## Task 7: 更新 `App.tsx` resolver map

**Files:**
- Modify: `apps/element-demo/src/App.tsx`

- [ ] **Step 1: 合併兩邊的 craft resolver**

替換：
```tsx
import * as CraftResolvers from '@lodestar/ui/components/common/CraftElement'
...
const craftResolvers = { ...CraftResolvers }
```
為：
```tsx
import * as UiCraftResolvers from '@lodestar/ui/components/common/CraftElement'
import * as LocalCraftResolvers from './craft'
...
const craftResolvers = { ...UiCraftResolvers, ...LocalCraftResolvers }
```

**註：** `LocalCraftResolvers` 後綴覆蓋 `UiCraftResolvers` —— 這是刻意，之後 B-1 / B-2 繼續把元件從 ui 搬到 local 時，若還沒同步從 ui 裡清掉，合併仍以 local 為準。

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @lodestar/element-demo exec tsc --noEmit`

Expected: PASS。

---

## Task 8: 更新 `ActivityPage.tsx` import path

**Files:**
- Modify: `apps/element-demo/src/pages/ActivityPage.tsx`

- [ ] **Step 1: 改 import**

從：
```tsx
import { CraftActivityCollection } from '@lodestar/ui/components/common/CraftElement'
```
改為：
```tsx
import { CraftActivityCollection } from '../craft/CraftActivityCollection'
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @lodestar/element-demo exec tsc --noEmit`

Expected: PASS。

---

## Task 9: Workspace-wide typecheck

**Files:** 無修改。

- [ ] **Step 1: 清 incremental cache 後全面 typecheck**

Run: `find packages apps -name "*.tsbuildinfo" -delete && pnpm -r exec tsc --noEmit 2>&1 | tail -20`

Expected: 無輸出（全 PASS）。若有錯誤，回 Task 2/4/6 修。

---

## Task 10: Runtime parity verification

**Files:** 無修改。

- [ ] **Step 1: 啟動 element-demo dev server**

Run:
```bash
lsof -iTCP:3002 -sTCP:LISTEN -t 2>/dev/null | xargs kill 2>/dev/null
cd apps/element-demo && pnpm exec vite --port 3002 --force > /tmp/element-demo-dev.log 2>&1 &
cd -
```

等 `tail -n 5 /tmp/element-demo-dev.log` 看到 `VITE ... ready in`。

- [ ] **Step 2: 首頁 200**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3002/`
Expected: `200`

- [ ] **Step 3: `/activity` 路由**

用 Chrome MCP（或瀏覽器）打開 `http://localhost:3002/activity`，比對：

- 預設 `source={{ from: 'publishedAt', limit: 3 }}`：3 個活動卡片渲染，與 master（port 3001）相同
- loading 狀態切換正常
- `withSelector` category 切換可篩選

- [ ] **Step 4: 測 editor 模式**

在 element-demo 首頁勾「Editing」checkbox，切到 `/activity`，驗證：

- Craft.js toolbar 出現於 hover 時
- Drag handle 有反應
- 取消 editing 後恢復 view 模式

- [ ] **Step 5: 測 custom source variant**

暫時修改 `apps/element-demo/src/pages/ActivityPage.tsx`，把 source 換成 `{ from: 'custom', idList: ['<實際活動 id>'] }`（取自 master 同 appId 的活動）。驗證渲染出指定活動 + `idList` 順序維持。驗完改回 `publishedAt`。

- [ ] **Step 6: 停 dev server**

Run: `lsof -iTCP:3002 -sTCP:LISTEN -t 2>/dev/null | xargs kill 2>/dev/null`

---

## Task 11: Commit

**Files:** 無修改，僅 commit。

- [ ] **Step 1: 檢視 staged 狀態**

Run: `git status`

- [ ] **Step 2: 分 2 commit**

拆 2 個而非 4 個：中間狀態也保持 typecheck 綠，`git bisect` 友善（為了 open-source 的歷史品質）。

```bash
# (1) 純加：types + data-hasura hook — 雙方獨立 typecheck 綠
git add packages/types/src/activity.ts packages/types/src/index.ts \
        packages/data-hasura/src/hooks/activity.ts packages/data-hasura/src/index.ts
git commit -m "feat(data-hasura): add useActivityCollection hook and ActivityCollectionItem type"

# (2) 切換：ui props-only + CraftElement 清理 + element-demo 接線
#     這組改動互相耦合（ActivityCollection.tsx 換 props 後，同次改 CraftElement 移除
#     舊 Craftize、element-demo 新增 Connected+Craftize、page 重新 import、App resolver
#     合併兩邊 craft 來源），一起進才不會有中間 typecheck 紅的 commit。
git add packages/ui/src/components/collections/ActivityCollection.tsx \
        packages/ui/src/components/common/CraftElement.tsx \
        apps/element-demo/src/craft/ \
        apps/element-demo/src/App.tsx \
        apps/element-demo/src/pages/ActivityPage.tsx
git commit -m "refactor(ui,element-demo): make ActivityCollection props-only and wire it up from element-demo"
```

---

## Acceptance Criteria (B-0 完工標準)

1. `packages/ui/src/components/collections/ActivityCollection.tsx` 不含任何 `@apollo/client` / `@lodestar/graphql` / `gql` / `useQuery` 參照
2. `packages/data-hasura/src/hooks/activity.ts` 匯出單一 `useActivityCollection(source)` hook 與 `ActivityCollectionSource`、`ActivityCollectionItem`（後者透過 `@lodestar/types/activity` re-export 亦可）
3. `apps/element-demo/src/craft/CraftActivityCollection.tsx` 組 Connected wrapper + Craftize
4. `apps/element-demo/src/App.tsx` 的 Craft.js resolver map 同時來自 ui + local craft/
5. `pnpm -r exec tsc --noEmit` 全 PASS
6. element-demo `/activity` 路由 view + editor 兩種模式與 master 一致；editor 模式能透過 `CraftActivityCollection` 的 toolbar 設定 `source`（`source` 是 Craftize wrap 對外暴露的 prop，會存入 Craft.js node data）
7. `{ from: 'publishedAt' }` 與 `{ from: 'custom' }` 兩 variant 都可正常渲染
8. 兩 commit 均可單獨 typecheck 綠（`git bisect` 友善）

## 尚未處理（留給 B-1 / B-2 / B-3）

- 其他 6 個 collection（B-1）
- 4 個 modal / selector（B-2）
- `packages/ui/src/components/common/CraftElement.tsx` 整體終態（B-3；屆時會剩哪些 Craftize 匯出依 B-0 的決策延伸）
- `@lodestar/ui/package.json` 的 graphql 相關 dep（Phase C）
- `totalParticipants` 目前 hardcode 0 —— master 裡似乎也是這樣（ActivityCollection.tsx:233 的 `TODO`），保留現狀；若 B-4 parity 驗證時發現 master 有真資料，回頭補
