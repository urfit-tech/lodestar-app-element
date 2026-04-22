# Phase B-1f — ProgramCollection Refactor

> **Reference patterns:** B-0 (`3a15b69`, `954c641`) establishes the three-layer split. B-1a–B-1e apply it to 5 simpler collections. This sub-task takes the most complex collection (674 lines, 5 source branches, internal `useState`-driven `sourceFrom`, a pre-emptive `useEnrolledProgramIds` query). The architecture decisions below exist because ProgramCollection doesn't fit the vanilla B-0 mold.

## Architecture decisions

### Decision 1 — `sourceFrom` state lives in the **Connected wrapper**, not the pure UI

The master component holds an internal `useState(source.from)` that the `OrderSelector` can mutate. After the refactor:
- **Pure UI receives** `sourceFrom: string` + `onSourceFromChange?: (next: string) => void` as props
- **Connected wrapper owns** `const [sourceFrom, setSourceFrom] = useState(source.from)` and the `useEffect` that syncs when the external `source.from` changes

Reason: the pure UI must not own state that drives a network call; network concerns belong in the data layer.

### Decision 2 — `useEnrolledProgramIds` moves to `@lodestar/data-hasura` as its own hook

Master defines it inline. It's a separate query from `GET_PROGRAM_COLLECTION` (fetches enrolled program IDs), used only by the `recentWatched` branch. Lift it out as `useEnrolledProgramIds(memberId, { skip? })` in `packages/data-hasura/src/hooks/programCollection.ts` (same file as `useProgramCollection` — they're both program-collection-related).

### Decision 3 — `useProgramCollection(source, context?)` — single hook, 5 variable branches

All 5 sources (`publishedAt`, `popular`, `currentPrice`, `recentWatched`, `custom`) hit the same `GET_PROGRAM_COLLECTION` document. Branching happens in a `buildVariables(source, context)` helper inside the hook. The `recentWatched` branch requires `context.enrolledProgramIds` + `context.currentMemberId`; other branches ignore context.

### Decision 4 — `effectiveSource` is computed, not user-facing

Master's switch uses `sourceFrom` (state) to pick which collect* to run, but constructs the options object by mixing `source` (prop) and `sourceFrom` (state) — essentially `{ ...source, from: sourceFrom }`. When `source.from === 'custom'` but `sourceFrom !== 'custom'` (user toggled OrderSelector away from custom), master explicitly substitutes `{ from: sourceFrom, limit: 4 }` (ignoring the custom idList). Replicate this in the Connected wrapper's `useMemo` for `effectiveSource`.

### Decision 5 — `useAuth` stays in the Connected wrapper

Pure UI must not call `useAuth()` (auth is a data-layer dependency). The Connected wrapper calls `useAuth()`, passes `currentMemberId` down to `useEnrolledProgramIds` and `useProgramCollection`'s context.

---

## File Structure (B-1f end state)

### New files

- `packages/types/src/program.ts` — `ProgramCollectionItem` type (and sub-types: `ProgramCollectionPlan`, `ProgramCollectionCategory`, `ProgramCollectionRole`). Infer shape from master's `composeCollectionData`.
- `packages/data-hasura/src/hooks/programCollection.ts` — `useProgramCollection(source, context?)` + `useEnrolledProgramIds(memberId, options?)` + `ProgramCollectionSource` union + `UseProgramCollectionResult` type + module-level `PROGRAM_COLLECTION_QUERY` / `ENROLLED_PROGRAMS_QUERY` constants.
- `apps/element-demo/src/craft/CraftProgramCollection.tsx` — Connected wrapper + `Craftize` + explicit `UserComponent<PropsWithCraft<…>>` annotation.

### Modified files

- `packages/types/src/index.ts` — add `export * from './program'` (or named re-export if there's a collision with an existing `program` export; check and adapt).
- `packages/data-hasura/src/index.ts` — add `export * from './hooks/programCollection'` alphabetically (after `./hooks/programContentCollection`, before `./hooks/programPackageCollection`).
- `packages/ui/src/components/collections/ProgramCollection.tsx` — rewrite as props-only.
- `packages/ui/src/components/common/CraftElement.tsx` — delete the two ProgramCollection lines.
- `apps/element-demo/src/craft/index.ts` — add `export * from './CraftProgramCollection'` alphabetically.
- `apps/element-demo/src/pages/ProgramElementPage.tsx` — switch import to `../craft/CraftProgramCollection`. Preserve the active JSX instance verbatim; don't touch the commented-out blocks below (they're out of scope).

---

## Task 1 — `packages/types/src/program.ts`

Create the collection item type. Master's `composeCollectionData` builds this shape (see master `ProgramCollection.tsx:536-586`):

```ts
import { PeriodType, ProductRole } from './data'

export type ProgramCollectionPlan = {
  id: string
  listPrice: number | null
  salePrice: number | null
  soldAt: Date | null
  publishedAt: Date | null
  autoRenewed: boolean
  period: { amount: number; type: PeriodType } | null
  isPrimary: boolean
  position: number
}

export type ProgramCollectionCategory = {
  id: string
  name: string
  position: number
}

export type ProgramCollectionRoleMember = {
  id: string
  name: string
  pictureUrl: string | null
}

export type ProgramCollectionRole = {
  id: string
  name: ProductRole['name']
  member: ProgramCollectionRoleMember
}

export type ProgramCollectionItem = {
  id: string
  title: string
  abstract: string
  coverUrl: string | null
  coverMobileUrl: string | null
  coverThumbnailUrl: string | null
  totalDuration: number
  label: string
  labelColorType: string
  roles: ProgramCollectionRole[]
  listPrice: number
  salePrice: number | null
  soldAt: Date | null
  isEnrolledCountVisible: boolean
  plans: ProgramCollectionPlan[]
  categories: ProgramCollectionCategory[]
  historicalProgramPlanBuyers: number | null
  historicalProgramPackagePlanBuyers: number | null
  reviewAverageScore: number
  reviewCount: number
}
```

Add to `packages/types/src/index.ts`. Check for name collisions with existing `./data` Program export.

**Commit 1 candidate.**

---

## Task 2 — `packages/data-hasura/src/hooks/programCollection.ts`

Move `useEnrolledProgramIds` (master lines 270-313) out of the UI. Define `useProgramCollection(source, context?)` that wraps `GET_PROGRAM_COLLECTION` with per-branch variables.

Shape:

```ts
import { gql, useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { sum, uniq } from 'ramda'
import * as hasura from '@lodestar/graphql/hasura'
import { getProgramCollectionQuery } from '@lodestar/graphql/queries'
import { notEmpty } from '@lodestar/helpers'
import { PeriodType, ProductRole } from '@lodestar/types/data'
import { ProgramCollectionItem, ProgramCollectionPlan } from '@lodestar/types/program'
import {
  ProductCurrentPriceSource,
  ProductCustomSource,
  ProductPublishedAtSource,
  ProductRecentWatchedSource,
} from '@lodestar/types/options'

export type ProgramCollectionSource =
  | ProductCustomSource
  | ProductPublishedAtSource
  | ProductCurrentPriceSource
  | ProductRecentWatchedSource
  | ProductPublishedAtSource<'popular'>

export type ProgramCollectionContext = {
  currentMemberId?: string | null
  enrolledProgramIds?: string[]
}

export type UseProgramCollectionResult = {
  data: ProgramCollectionItem[]
  loading: boolean
  error?: Error
}

const programFields = gql`
  fragment programFields on program { ... }   // copy from master ProgramCollection.tsx:588-672
`

const PROGRAM_COLLECTION_QUERY = getProgramCollectionQuery(programFields)

const ENROLLED_PROGRAMS_QUERY = gql`
  query GET_ENROLLED_PROGRAMS($memberId: String) { ... }   // copy from master lines 275-290
`

const composeCollectionData = (data: hasura.GET_PROGRAM_COLLECTION): ProgramCollectionItem[] => {
  // copy from master 536-586
}

const buildVariables = (
  source: ProgramCollectionSource,
  context: ProgramCollectionContext,
): hasura.GET_PROGRAM_COLLECTIONVariables => {
  switch (source.from) {
    case 'custom': { /* master 318-330 logic */ return { ... } }
    case 'popular': { /* master 393-422 logic */ return { ... } }
    case 'currentPrice': { /* master 436-473 logic */ return { ... } }
    case 'recentWatched': { /* master 488-523 logic, uses context */ return { ... } }
    case 'publishedAt':
    default: { /* master 353-378 logic */ return { ... } }
  }
}

export const useProgramCollection = (
  source: ProgramCollectionSource,
  context: ProgramCollectionContext = {},
): UseProgramCollectionResult => {
  const variables = useMemo(() => buildVariables(source, context), [source, context])
  const { data: rawData, loading, error } = useQuery<
    hasura.GET_PROGRAM_COLLECTION,
    hasura.GET_PROGRAM_COLLECTIONVariables
  >(PROGRAM_COLLECTION_QUERY, { variables })

  const composed = useMemo(() => {
    if (!rawData) return []
    if (source.from === 'custom') {
      // preserve idList order; see master 332-340
      const ordered: hasura.GET_PROGRAM_COLLECTION = {
        ...rawData,
        program: (source.idList || [])
          .map(id => rawData.program.find(p => p.id === id))
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

export type UseEnrolledProgramIdsResult = {
  enrolledProgramIds: string[]
  loadingProgramIds: boolean
  errorProgramIds?: unknown
  refetchProgramIds: () => void
}

export const useEnrolledProgramIds = (
  memberId: string | null | undefined,
  options: { skip?: boolean } = {},
): UseEnrolledProgramIdsResult => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_PROGRAMS,
    hasura.GET_ENROLLED_PROGRAMSVariables
  >(ENROLLED_PROGRAMS_QUERY, {
    skip: options.skip || !memberId,
    variables: { memberId: memberId ?? null },
    fetchPolicy: 'no-cache',
  })

  const enrolledProgramIds = useMemo(
    () =>
      loading || error || !data
        ? []
        : uniq([
            ...data.program_enrollment.map(e => e.program_id),
            ...data.program_plan_enrollment.map(e => e.program_plan?.program_id || ''),
            ...data.program_content_enrollment.map(e => e.program_id),
          ]),
    [data, loading, error],
  )

  return {
    enrolledProgramIds,
    errorProgramIds: error,
    loadingProgramIds: loading,
    refetchProgramIds: refetch,
  }
}
```

Add barrel entry. **Commit 1 candidate.** Verify `pnpm --filter @lodestar/data-hasura exec tsc --noEmit` clean standalone.

---

## Task 3 — `packages/ui/src/components/collections/ProgramCollection.tsx` props-only rewrite

Strip to pure UI. New props:

```ts
export type ProgramCollectionProps = {
  name?: string
  programs?: ProgramCollectionItem[]
  isFetching?: boolean
  fetchError?: Error
  defaultCategoryIds?: string[]
  variant?: 'primary' | 'secondary'
  layout?: CollectionLayout
  withSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
  withOrderSelector?: boolean
  sourceFrom?: string
  onSourceFromChange?: (next: string) => void
  emptyText?: string
}
```

Body:

- Keep `useHistory`, `useQueryParam('active')`, `useIntl` — these are UI concerns.
- Drop `useAuth`, `useState(sourceFrom)`, `useEffect` sync, `useEnrolledProgramIds` invocation, all `collect*Collection` helpers, `programFields`, `composeCollectionData`, the switch-to-pick-ContextCollection block.
- Render from `props.programs` directly (like B-0 does with `activities`).
- `OrderSelector` becomes `{props.withOrderSelector && <OrderSelector sourceFrom={props.sourceFrom} withOrderSelector onChange={next => props.onSourceFromChange?.(next)} />}`.
- `loadingProgramIds` check goes away (it's a data concern); just use `isFetching`.
- `emptyText` comes from props; default to `''`.

**All graphql imports and apollo references MUST be gone.** Grep check at the end.

Preserve the JSX render structure for `ElementCollection` / `CategorySelector` / `OrderSelector` layout exactly as master does — only change data source.

---

## Task 4 — `packages/ui/src/components/common/CraftElement.tsx`

Remove `import ProgramCollection from '../collections/ProgramCollection'` and `export const CraftProgramCollection = Craftize(ProgramCollection)`.

---

## Task 5 — `apps/element-demo/src/craft/CraftProgramCollection.tsx`

Connected wrapper with all the orchestration pulled out of master UI:

```tsx
import { UserComponent } from '@craftjs/core'
import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useAuth } from '@lodestar/contexts/AuthContext'
import {
  ProgramCollectionSource,
  useEnrolledProgramIds,
  useProgramCollection,
} from '@lodestar/data-hasura/hooks/programCollection'
import ProgramCollection, {
  ProgramCollectionProps,
} from '@lodestar/ui/components/collections/ProgramCollection'
import Craftize, { PropsWithCraft } from '@lodestar/ui/components/common/Craftize'
import collectionsMessages from '@lodestar/ui/components/collections/translation'
// (if `collectionsMessages` isn't re-exported, inline a small `collectionMessages`
//  literal here or move to translations; document choice in Commit 2 body.)

export type CraftProgramCollectionProps = Omit<
  ProgramCollectionProps,
  'programs' | 'isFetching' | 'fetchError' | 'defaultCategoryIds' | 'sourceFrom' | 'onSourceFromChange' | 'emptyText'
> & {
  source?: ProgramCollectionSource
}

const DEFAULT_SOURCE: ProgramCollectionSource = { from: 'publishedAt' }

const ConnectedProgramCollection: React.FC<CraftProgramCollectionProps> = ({ source, ...rest }) => {
  const resolvedSource = useMemo<ProgramCollectionSource>(() => source ?? DEFAULT_SOURCE, [source])
  const [sourceFrom, setSourceFrom] = useState(resolvedSource.from)
  useEffect(() => {
    // Sync when the outer source.from changes (e.g. Craft.js editor toolbar edit).
    setSourceFrom(resolvedSource.from)
  }, [resolvedSource.from])

  const { currentMemberId } = useAuth()
  const { enrolledProgramIds, loadingProgramIds } = useEnrolledProgramIds(currentMemberId, {
    skip: sourceFrom !== 'recentWatched',
  })

  // Construct the effective source from the current sourceFrom state while
  // keeping the user-supplied filters (defaultCategoryIds, etc.) when possible.
  // When the user toggled OrderSelector away from a `custom` source, master
  // substitutes { from: sourceFrom, limit: 4 }, discarding idList.
  const effectiveSource = useMemo<ProgramCollectionSource>(() => {
    if (resolvedSource.from === 'custom' && sourceFrom !== 'custom') {
      return { from: sourceFrom, limit: 4 } as ProgramCollectionSource
    }
    return { ...resolvedSource, from: sourceFrom } as ProgramCollectionSource
  }, [resolvedSource, sourceFrom])

  const { data, loading, error } = useProgramCollection(effectiveSource, {
    currentMemberId,
    enrolledProgramIds,
  })

  const { formatMessage } = useIntl()
  const emptyText =
    sourceFrom === 'recentWatched'
      ? formatMessage(collectionsMessages.ProgramCollection.recentWatchedEmpty)
      : ''

  const defaultCategoryIds =
    'defaultCategoryIds' in effectiveSource ? effectiveSource.defaultCategoryIds : undefined

  return (
    <ProgramCollection
      {...rest}
      programs={data}
      isFetching={loading || loadingProgramIds}
      fetchError={error}
      defaultCategoryIds={defaultCategoryIds}
      sourceFrom={sourceFrom}
      onSourceFromChange={setSourceFrom}
      emptyText={emptyText}
    />
  )
}

export const CraftProgramCollection: UserComponent<PropsWithCraft<CraftProgramCollectionProps>> = Craftize(
  ConnectedProgramCollection,
)
```

> **Note on `collectionsMessages`:** master imports it from `@lodestar/ui/components/collections/translation`. Confirm this file is importable from consumer code (its default export shape matches). If it isn't publicly exposed, inline a minimal `defineMessages` literal with the single `recentWatchedEmpty` key in the Craft wrapper instead. Document in Commit 2 body.

Add to `apps/element-demo/src/craft/index.ts`.

---

## Task 6 — `apps/element-demo/src/pages/ProgramElementPage.tsx`

Change:
```tsx
import { CraftProgramCollection } from '@lodestar/ui/components/common/CraftElement'
```
to:
```tsx
import { CraftProgramCollection } from '../craft/CraftProgramCollection'
```

The JSX below stays exactly as-is.

---

## Task 7 — Verification

```bash
pnpm --filter @lodestar/types exec tsc --noEmit
pnpm --filter @lodestar/data-hasura exec tsc --noEmit
pnpm --filter @lodestar/ui exec tsc --noEmit
pnpm --filter @lodestar/element-demo exec tsc --noEmit
find packages apps -name "*.tsbuildinfo" -delete
pnpm -r exec tsc --noEmit
```
All must exit 0 with empty output. **Verify Commit 1 alone** (`.tsbuildinfo` wipe → `pnpm -r exec tsc --noEmit`) before making Commit 2.

Grep check:
```bash
grep -rn "@apollo/client\|@lodestar/graphql\|\bgql\b\|\buseQuery\b" packages/ui/src/components/collections/ProgramCollection.tsx
```
Must be empty.

---

## Task 8 — Commit structure

Three commits (same pattern as B-1a–B-1e):

1. `feat(data-hasura): add useProgramCollection and useEnrolledProgramIds hooks`
   - Files: `packages/types/src/program.ts`, `packages/types/src/index.ts`, `packages/data-hasura/src/hooks/programCollection.ts`, `packages/data-hasura/src/index.ts`
   - Body should call out Decision 2 (lifting `useEnrolledProgramIds` out) and Decision 3 (single hook, 5 branches).

2. `refactor(ui,element-demo): make ProgramCollection props-only and wire it up from element-demo`
   - Files: `packages/ui/src/components/collections/ProgramCollection.tsx`, `packages/ui/src/components/common/CraftElement.tsx`, `apps/element-demo/src/craft/CraftProgramCollection.tsx`, `apps/element-demo/src/craft/index.ts`, `apps/element-demo/src/pages/ProgramElementPage.tsx`
   - Body should call out Decision 1 (Connected wrapper owns `sourceFrom`) and Decision 4 (`effectiveSource` replicates master's `custom→!custom` fallback).

3. `docs: log B-1f ProgramCollection manual verification items`
   - File: `docs/superpowers/plans/2026-04-23-phase-b-manual-verification.md`

Each commit carries `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`. Use HEREDOC.

---

## Task 9 — Manual verification log append

Append `## B-1f — ProgramCollection (commits <sha1>, <sha2>)` before the sentinel comment. Items:

- `/programs` view mode — `<CraftProgramCollection withSelector variant="primary" source={{ from: 'publishedAt', limit: 3 }} collectionVariant="carousel" carousel={{ slidesToShow: 3, arrows: true, dots: true, infinite: true }} customStyle={{ '.program .content': { backgroundColor: 'red' } }} />` renders identical carousel to master (3 program cards, red `.content` override, arrows/dots).
- Editor mode (toolbar, drag, device switch).
- **OrderSelector interaction:** if an OrderSelector ships with the current page setup, click through its options and confirm the grid re-orders; if not, flag as a TODO to uncomment the test block in the page and retest.
- **Source-variant checks** — temporarily swap the page's source to each of:
  - `{ from: 'popular', limit: 3 }` — cards ordered by views desc
  - `{ from: 'currentPrice', min: 0, max: 1000000, limit: 3 }` — cards ordered by sale/list price
  - `{ from: 'recentWatched', limit: 3 }` — requires logged-in account with watch history; cards are the member's recently-watched programs
  - `{ from: 'custom', idList: ['<real-program-uuid-1>', '<real-program-uuid-2>'] }` — exactly those programs in idList order
- Mechanical checks (tsc PASS, grep empty).
- **Known deviations:** whatever came up (e.g. `collectionsMessages` import decision, position cast, etc.).

---

## Hard rules

- **No `any` / `as any`.** The one `as ProgramCollectionSource` cast in the `effectiveSource` memo is a narrow assertion (the union is statically covered by the sourceFrom string), OK if documented with a comment. Anything broader is off-limits.
- **`TS2742` annotation mandatory** on `CraftProgramCollection` export.
- **Single-query pattern** — all 5 source branches hit `GET_PROGRAM_COLLECTION`; branching lives in `buildVariables`. The second query (`GET_ENROLLED_PROGRAMS`) is a separate hook, not dispatch-within-hook.
- **Report BLOCKED** if typecheck fails unexpectedly or if master's behaviour has a wrinkle the plan didn't anticipate (e.g., if `collectionsMessages` isn't externally importable, decide inline-or-alternative in the report, not in the code).
- **Preserve master's ordering for `custom` idList** — same `filter(notEmpty).map(find)` dance as B-0 activity.
- **Don't touch** other collection files / Craft wrappers / pages.

## Report format

Status, files created/modified, tsc outputs (empty strings paste anyway), grep output, three commit SHAs, deviations with rationale, concerns. Include a note on the `collectionsMessages` import decision if you made one.

Work from `/home/eddy/urfit/lodestar-app-element`.
