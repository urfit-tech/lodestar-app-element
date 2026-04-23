# Phase B — Manual Verification Log

> **Scope:** This file is the running log of visual / runtime parity checks that Phase B code-level work postpones to a human reviewer. All items here are AFTER successful `pnpm -r exec tsc --noEmit` + `find … -name "*.tsbuildinfo" -delete` automation. Items are ordered by the sub-task that produced them.

## How to verify each item

1. Start both servers side-by-side:
   - master (port 3001): `cd <master checkout> && pnpm dev` or equivalent
   - refactor/v1 (port 3002): `lsof -iTCP:3002 -sTCP:LISTEN -t | xargs -r kill; cd apps/element-demo && pnpm exec vite --port 3002 --force`
2. Open both ports in two browser windows side-by-side
3. Check each route listed below for visual parity and interactive behaviour
4. For **editor mode** items, tick the "Editing" checkbox at the top of the page before visiting the route

Record outcome inline (`[ ]` → `[x]` for pass; append notes for anything surprising).

---

## B-0 — ActivityCollection (commits `3a15b69`, `954c641`)

### Required checks

- [ ] `/activity` view mode — `source={{ from: 'publishedAt', limit: 3 }}` renders identical cards to master (count, titles, cover images, timestamps)
- [ ] `/activity` view mode — category selector (`withSelector`) filters correctly when a chip is clicked
- [ ] `/activity` editor mode — hover on the `CraftActivityCollection` node shows Craft.js toolbar (drag handle, edit, copy, delete)
- [ ] `/activity` editor mode — drag-and-drop still works
- [ ] `/activity` device switch in editor — mobile / tablet / desktop toggles behave identically
- [ ] **Custom variant:** temporarily edit `apps/element-demo/src/pages/ActivityPage.tsx` to `<CraftActivityCollection source={{ from: 'custom', idList: ['<real-activity-uuid>'] }} />` — visited route shows only the requested activities in idList order. Revert when done.

### Mechanical checks (auto-verified, kept for reference)
- [x] `pnpm -r exec tsc --noEmit` passes after `.tsbuildinfo` wipe
- [x] `grep -rn "@apollo\|@lodestar/graphql\|gql\|useQuery" packages/ui/src/components/collections/ActivityCollection.tsx` is empty
- [x] `GET http://localhost:3002/` → 200
- [x] `GET http://localhost:3002/activity` → 200

### Known deviations from master
- `totalParticipants` still hardcoded to `0` in `composeCollectionData` — matches master's in-line TODO at `packages/ui/src/components/collections/ActivityCollection.tsx:233` (pre-Phase-A). Revisit if parity requires the real `activity_enrollments_aggregate` count.

---

## B-1a — MemberCollection (commits `9da87ed`, `ac5b30f`)

### Required checks

- [ ] `/member` view mode — `<CraftMemberCollection source={{ from: 'role', limit: 10 }} />` renders identical member cards to master (count, names, titles, avatars, abstracts). Variant defaults to `primary`.
- [ ] `/member` view mode — `<CraftMemberCollection variant="secondary" source={{ from: 'role', role: 'app-owner' }} />` renders only `app-owner` members using the secondary card style.
- [ ] `/member` view mode — `<CraftMemberCollection source={{ from: 'role', role: 'content-creator' }} />` renders only `content-creator` members (primary card style).
- [ ] `/member` editor mode — hovering each of the three `CraftMemberCollection` nodes shows the Craft.js toolbar (drag handle, edit, copy, delete).
- [ ] `/member` editor mode — drag-and-drop on a `CraftMemberCollection` node works.
- [ ] `/member` editor mode — device switch (mobile / tablet / desktop) behaves identically to master.
- [ ] **Custom variant:** temporarily edit `apps/element-demo/src/pages/MemberElementPage.tsx` to swap one instance for `<CraftMemberCollection source={{ from: 'custom', idList: ['<real-member-uuid-a>', '<real-member-uuid-b>'] }} />` — rendered route shows exactly those members in the supplied `idList` order. Revert when done.

### Mechanical checks (auto-verified, kept for reference)
- [x] `pnpm --filter @lodestar/ui exec tsc --noEmit` passes
- [x] `pnpm --filter @lodestar/element-demo exec tsc --noEmit` passes
- [x] `pnpm -r exec tsc --noEmit` passes after `.tsbuildinfo` wipe
- [x] `grep -rn "@apollo/client\|@lodestar/graphql\|\bgql\b\|\buseQuery\b" packages/ui/src/components/collections/MemberCollection.tsx` is empty

### Known deviations from master
- Original `MemberCollection` declared `useQueryParam('active', ...)` and a `withSelector` prop but neither a `CategorySelector` nor the `activeCategoryId` value was ever rendered/consumed in the component body (dead code inherited from earlier iterations). The props-only rewrite drops the unused `useQueryParam` hook call while preserving the `withSelector?: boolean` prop in `MemberCollectionProps` for API shape compatibility. No visible behaviour change expected.

---

## B-1b — ProgramContentCollection (commits `12d6209`, `4e951cb`)

### Required checks

- [ ] `/program-contents` view mode — `<CraftProgramContentCollection variant="card" source={{ from: 'recentWatched', limit: 3 }} />` renders three program-content cards matching master (titles, cover images, duration formatting, `video`/`text` icon). **Caveat:** `recentWatched` reads `program_content_progress` for the current viewer; if the demo account has no watch history both master and refactor render empty — the check only exercises parity when the logged-in account actually has recently watched items. Sign in to a demo account with prior progress before capturing the result.
- [ ] `/program-contents` editor mode — hovering the `CraftProgramContentCollection` node shows the Craft.js toolbar (drag handle, edit, copy, delete).
- [ ] `/program-contents` editor mode — drag-and-drop on the node works.
- [ ] `/program-contents` editor mode — device switch (mobile / tablet / desktop) behaves identically to master.
- [ ] **Custom variant:** temporarily edit `apps/element-demo/src/pages/ProgramContentCollectionPage.tsx` to `<CraftProgramContentCollection variant="card" source={{ from: 'custom', idList: ['<real-program-content-uuid>'] }} />` — rendered route shows exactly the requested program contents in `idList` order. Revert when done.

### Mechanical checks (auto-verified, kept for reference)
- [x] `pnpm --filter @lodestar/ui exec tsc --noEmit` passes
- [x] `pnpm --filter @lodestar/element-demo exec tsc --noEmit` passes
- [x] `pnpm -r exec tsc --noEmit` passes after `.tsbuildinfo` wipe
- [x] `grep -rn "@apollo/client\|@lodestar/graphql\|\bgql\b\|\buseQuery\b" packages/ui/src/components/collections/ProgramContentCollection.tsx` is empty
- [x] Commit `12d6209` (types + hook only) typechecks clean standalone before commit `4e951cb` layers on top.

### Known deviations from master
- Original `ProgramContentCollection` declared `useQueryParam('active', ...)` plus a `withSelector` prop, neither of which was rendered or consumed anywhere in the component body (no `CategorySelector`, no category filtering — same dead-code pattern as `MemberCollection` before B-1a). The props-only rewrite drops the unused `useQueryParam` hook call while preserving `withSelector?: boolean` and now adding `defaultCategoryIds?: string[]` to `ProgramContentCollectionProps` for API shape compatibility; neither is consumed by the body. `CraftProgramContentCollection` still forwards `source.defaultCategoryIds` when `source.from === 'recentWatched'` so that plumbing is ready when the UI later grows a selector.
- `ProgramContentCollectionItem.duration` is typed as `number` (defaulting null/undefined Hasura values to `0`) rather than the raw `number | null | undefined` the original component passed through; `ProgramContentCard`'s `duration` prop is a required `number`, so coercing at the hook boundary avoids a widening leak into consumers while matching the behaviour `durationFormatter(null/undefined)` would have rendered as `---` in the previous card skeleton path.
- The hook issues both `useQuery` calls unconditionally (one per `source.from` branch) and `skip`s the inactive one. React's rules-of-hooks require a stable call order, and the two branches hit different Hasura queries (`GET_PROGRAM_CONTENT_COLLECTION` vs the inline `GET_RECENT_PROGRAM_PROGRESS`) — this mirrors the original component's branching without breaking hook order when `source.from` is toggled at runtime.

## B-1c — ProgramPackageCollection (commits `141ee16`, `177872a`)

### Required checks

- [ ] `/program-package` view mode — `<CraftProgramPackageCollection variant="card" source={{ from: 'publishedAt' }} />` renders identical program-package cards to master (count, titles, cover images, total duration, total programs count, list/sale price handling).
- [ ] `/program-package` view mode — the pre-existing `<ProgramPackageCard loading />` skeleton card and the static demo `<ProgramPackageCard title={…} …/>` rendered above the collection are **unrelated** (not driven by the collection hook) and are intentionally untouched by this refactor; they should match master exactly.
- [ ] `/program-package` editor mode — hovering the `CraftProgramPackageCollection` node shows the Craft.js toolbar (drag handle, edit, copy, delete).
- [ ] `/program-package` editor mode — drag-and-drop on the `CraftProgramPackageCollection` node works.
- [ ] `/program-package` editor mode — device switch (mobile / tablet / desktop) behaves identically to master.
- [ ] **Custom variant:** temporarily edit `apps/element-demo/src/pages/ProgramPackagePage.tsx` to `<CraftProgramPackageCollection variant="card" source={{ from: 'custom', idList: ['<real-program-package-uuid-a>', '<real-program-package-uuid-b>'] }} />` — rendered route shows exactly those program packages in the supplied `idList` order. Revert when done.

### Mechanical checks (auto-verified, kept for reference)
- [x] `pnpm --filter @lodestar/ui exec tsc --noEmit` passes
- [x] `pnpm --filter @lodestar/element-demo exec tsc --noEmit` passes
- [x] `pnpm -r exec tsc --noEmit` passes after `.tsbuildinfo` wipe
- [x] `grep -rn "@apollo/client\|@lodestar/graphql\|\bgql\b\|\buseQuery\b" packages/ui/src/components/collections/ProgramPackageCollection.tsx` is empty
- [x] Commit `141ee16` (types + hook only) typechecks clean standalone before commit `177872a` layers on top.

### Source-key typo fix (pre-existing)
- The master JSX in `ProgramPackagePage.tsx` was fully commented out and carried `source={{ source: 'publishedAt' }}` — the inner key was wrong (should be `from:` per `ProductPublishedAtSource`). When this refactor uncommented the JSX it corrected the key to `source={{ from: 'publishedAt' }}`, matching the `ProgramPackageCollectionSource` union. Manual verification should confirm the collection actually renders (not an empty grid) after the refactor.
- The stale `// import CraftProgramPackageCollection from '@lodestar/ui/components/craft/CraftProgramPackageCollection'` comment at the top of the page was removed; the new import is from `../craft/CraftProgramPackageCollection`.
- A similar commented-out `<CraftProgramPackageCollection variant="card" source={{ source: 'publishedAt' }} />` line still lives in `apps/element-demo/src/pages/ProjectElementPage.tsx`. It is out of scope for B-1c (that file is B-1d's concern) and is intentionally left untouched; if future work revives it, the same `source:` → `from:` fix should be applied.

### Known deviations from master
- Previous UI code read `position` via `(ppp as any).position ?? 0` because the generated `GET_PROGRAM_PACKAGE_COLLECTION` hasura type does not include `position` on `program_package_plans` (the fragment selects it, but codegen dropped it). The new hook replaces the `any` cast with a local structural widening (`ProgramPackagePlanNode & { position?: number | null }`) so no fresh `any` is introduced. Runtime behaviour is unchanged — still defaults to `0` when absent.
- `ProgramPackageCollectionItem.plans[i].period` is normalised at the hook boundary: it is `null` when either `period_amount` or `period_type` is null/undefined (previously the UI produced an object with `undefined` fields cast to `ProductPlan['period']`). `findPrimaryPlan` + `ProgramPackageCard` only read `salePrice` / `soldAt` / `listPrice`, so this normalisation has no user-visible effect.
- Unlike B-1a / B-1b, ProgramPackageCollection's `CategorySelector` + `useQueryParam('active', …)` path was actively rendered (not dead code) and is **preserved** — `defaultCategoryIds` is now surfaced as a first-class prop on the UI, and `CraftProgramPackageCollection` forwards `source.defaultCategoryIds` when `source.from === 'publishedAt'`.

## B-1d — ProjectCollection (commits `36195bc`, `00c1b97`)

### Required checks

- [ ] `/project` view mode — `<CraftProjectCollection />` (no props, falls through to `DEFAULT_SOURCE = { from: 'publishedAt' }`) renders identical project cards to master: count, titles, cover images, abstracts, `type` badge (`on-sale` / `pre-order` / `funding` / `portfolio`), target progress circle, enrolment / total-sales counts, and countdown timer (when `isCountdownTimerVisible` and `expiredAt` are set).
- [ ] `/project` view mode — the standalone `<ProjectCard loading />` skeleton above the collection is **unrelated** (not collection-driven, intentionally untouched). It should match master pixel-for-pixel.
- [ ] `/project` editor mode — hovering the `CraftProjectCollection` node shows the Craft.js toolbar (drag handle, edit, copy, delete).
- [ ] `/project` editor mode — drag-and-drop on the `CraftProjectCollection` node works.
- [ ] `/project` editor mode — device switch (mobile / tablet / desktop) behaves identically to master.
- [ ] **Popular variant:** temporarily edit `apps/element-demo/src/pages/ProjectElementPage.tsx` to `<CraftProjectCollection source={{ from: 'popular', limit: 6 }} />` — rendered route orders project cards by `views desc`, falling back to `published_at desc` for ties. `ProductPublishedAtSource<'popular'>` accepts the same `{ limit, asc, defaultCategoryIds, defaultTagNames }` shape as the default `publishedAt` branch, so `limit` / `asc` / `defaultCategoryIds` can be added to exercise those paths. Revert when done.
- [ ] **Custom variant:** temporarily edit `apps/element-demo/src/pages/ProjectElementPage.tsx` to `<CraftProjectCollection source={{ from: 'custom', idList: ['<real-project-uuid-a>', '<real-project-uuid-b>'] }} />` — rendered route shows exactly those projects in the supplied `idList` order. Revert when done.
- [ ] **Type filter:** temporarily edit the page to `<CraftProjectCollection type="funding" />` (or another valid `Project['type']`) — rendered route restricts the collection to projects with matching `project.type`. Verifies the hook option threading for all three source branches (`publishedAt` default, or combined with the popular / custom swaps above). Revert when done.

### Mechanical checks (auto-verified, kept for reference)
- [x] `pnpm --filter @lodestar/ui exec tsc --noEmit` passes
- [x] `pnpm --filter @lodestar/element-demo exec tsc --noEmit` passes
- [x] `pnpm -r exec tsc --noEmit` passes after `.tsbuildinfo` wipe
- [x] `grep -rn "@apollo/client\|@lodestar/graphql\|\bgql\b\|\buseQuery\b" packages/ui/src/components/collections/ProjectCollection.tsx` is empty
- [x] Commit `36195bc` (types + hook only) typechecks clean standalone before commit `00c1b97` layers on top.

### Page cleanup (pre-existing)
- `ProjectElementPage.tsx` previously carried a commented-out `// import CraftProgramPackageCollection from '@lodestar/ui/components/craft/CraftProgramPackageCollection'` and a commented-out `<CraftProgramPackageCollection variant="card" source={{ source: 'publishedAt' }} />` block. Both were leftover noise from a prior iteration: ProgramPackage already has its own `ProgramPackagePage.tsx` fully wired up by B-1c, and the commented `source:` key was the same mistyped discriminant B-1c flagged. This refactor removes both dead lines. The `source:` → `from:` mis-key flagged in the B-1c log section is now resolved (no other copies remain in element-demo pages).

### Known deviations from master
- `type` is relocated out of `ProjectCollectionProps` entirely. In master it lived as a top-level component prop threaded into every `collect*Collection({ ...source, type: props.type })` call; in the refactor it is an option on `useProjectCollection(source, { type })` and a separate prop on `CraftProjectCollection` (outside the `source` discriminated union). The UI layer never reads `type` itself — it only rendered `project.type` from the hook data — so dropping it from the UI prop shape is behaviour-preserving. Callers that previously set `<CraftProjectCollection type="funding" />` continue to compile and run identically because `CraftProjectCollection` still exposes `type` at the wrapper level.
- `ProjectCollectionItem.expiredAt` is normalised to `Date | null` at the hook boundary (master's original `collectPublishedAtCollection` passed through the raw string with an `as any` cast into `ProjectElementProps`). `ProjectCard` reads `expiredAt` via `moment(props.expiredAt)` which accepts both forms, so user-visible behaviour is unchanged — the normalisation just removes the `as any` escape hatch.
- The `defaultCategoryIds` filter in the UI is now gated purely by the presence of a non-empty `defaultCategoryIds` prop rather than `source.from === 'custom'`: `ProjectCollection` no longer knows the source shape, so the Craft wrapper forwards `defaultCategoryIds` only when `source.from === 'publishedAt'` or `source.from === 'popular'` (matching master, where `custom` branches did not expose `defaultCategoryIds`). Behaviour is equivalent.
- `ProjectCollectionSource` is a type alias for `ProductPublishedAtSource | ProductPublishedAtSource<'popular'> | ProductCustomSource`. The popular branch discriminates purely on `from: 'popular'` (no additional required fields beyond the shared `ProductPublishedAtSource` shape), so its manual-verification JSX is the typed literal `{ from: 'popular', limit: 6 }` above — no `as any` cast needed. If a future follow-up introduces popular-only required fields, update that verification line to include them.

## B-1e — PostCollection (commits `895ac56`, `7988802`)

### No demo page — mechanical checks only

- `apps/element-demo/src/pages/` has no `PostPage.tsx` / `PostCollectionPage.tsx` — no route renders `CraftPostCollection`. Master did not ship a demo page either (`CraftPostCollection` was previously exported from `@lodestar/ui/.../CraftElement.tsx` but never referenced by any `element-demo` page). Visual parity against master therefore cannot be checked at this sub-task; the refactor is verified only against the shared mechanical bar below.
- `CraftPostCollection` is still registered via `apps/element-demo/src/craft/index.ts` into the `craftResolvers` merge in `App.tsx` (`{ ...UiCraftResolvers, ...LocalCraftResolvers }`). The resolver map is load-bearing only when an element of that type is actually instantiated inside a `<Frame>` — since no route does, the entry is inert but safe, and it is in place for the follow-up below.

### Mechanical checks (auto-verified)
- [x] `pnpm --filter @lodestar/ui exec tsc --noEmit` passes
- [x] `pnpm --filter @lodestar/element-demo exec tsc --noEmit` passes
- [x] `pnpm -r exec tsc --noEmit` passes after `.tsbuildinfo` wipe
- [x] `grep -rn "@apollo/client\|@lodestar/graphql\|\bgql\b\|\buseQuery\b" packages/ui/src/components/collections/PostCollection.tsx` is empty
- [x] Commit `895ac56` (types + hook only) typechecks clean standalone before commit `7988802` layers on top.

### Follow-up — add a demo page (TODO)

- Add `apps/element-demo/src/pages/PostPage.tsx` (one route registration in `App.tsx`) plus a `<CraftPostCollection source={{ from: 'publishedAt', limit: 3 }} />` default render. Choosing a test app's post content is out of scope for B-1e and requires picking a `VITE_APP_ID` that actually has published posts — defer to whoever owns the demo env.
- Once that page exists, add the usual view / editor / variant parity checks (analogous to B-1d):
  - [ ] `/post` view mode — `<CraftPostCollection source={{ from: 'publishedAt', limit: 3 }} />` renders identical post cards to master (count, titles, cover images, code names, author names, `publishedAt` formatting).
  - [ ] `/post` editor mode — Craft.js toolbar + drag-and-drop + device switch behave identically to master.
  - [ ] **Popular variant:** `<CraftPostCollection source={{ from: 'popular', limit: 6 }} />` orders posts by `views desc` falling back to `published_at desc`.
  - [ ] **Custom variant:** `<CraftPostCollection source={{ from: 'custom', idList: ['<real-post-uuid-a>', '<real-post-uuid-b>'] }} />` renders only those posts in `idList` order.
  - [ ] **`withSelector`:** adding `withSelector` renders a `CategorySelector` chip row driven by the collection's aggregated categories, and selecting a chip filters the rendered posts.
- Land this before the Phase B-4 parity sweep so PostCollection is not a blind spot in the final check.

### Known deviations from master
- The `post.publishedAt as any` cast that master threaded into `<PostElement publishedAt={…} />` is dropped. `PostElementProps.publishedAt` is already typed `Date | null` and the hook normalises the raw Hasura string through `new Date(...)` (or `null`), so the `any` was a vestigial escape hatch rather than real type divergence.
- `PostCollectionSource` is a type alias for `ProductPublishedAtSource | ProductPublishedAtSource<'popular'> | ProductCustomSource`. The popular branch discriminates purely on `from: 'popular'` (no additional required fields beyond the shared `ProductPublishedAtSource` shape). No `type` side-channel was carried through the original `collect*Collection` calls (unlike `ProjectCollection`), so `usePostCollection` has a single-parameter signature with no `UsePostCollectionOptions`.
- `defaultCategoryIds` is now a first-class UI prop gated purely by its own emptiness rather than by `source.from !== 'custom'`. The Craft wrapper forwards it only when `source.from === 'publishedAt'` or `source.from === 'popular'` (matching master, where `custom` branches did not expose it). Behaviour is equivalent.

## B-1f — ProgramCollection (commits `94f8143`, `8a25a06`)

### Required checks

- [ ] `/programs` view mode — the page's active JSX (`<CraftProgramCollection withSelector variant="primary" source={{ from: 'publishedAt', limit: 3 }} collectionVariant="carousel" carousel={{ slidesToShow: 3, arrows: true, dots: true, infinite: true }} customStyle={{ '.program .content': { backgroundColor: 'red' } }} />`) renders an identical 3-card carousel to master: same titles / cover images / instructor chips / price + period, the `.program .content` background override paints red, and the carousel arrows / dots / infinite loop all behave identically.
- [ ] `/programs` editor mode — hovering the `CraftProgramCollection` node shows the Craft.js toolbar (drag handle, edit, copy, delete).
- [ ] `/programs` editor mode — drag-and-drop on the `CraftProgramCollection` node works.
- [ ] `/programs` editor mode — device switch (mobile / tablet / desktop) behaves identically to master.
- [ ] **OrderSelector interaction** — the current page setup does not pass `withOrderSelector`, so no `<OrderSelector />` chip renders. To exercise the sync-useEffect + `sourceFrom` state path, temporarily add `withOrderSelector` to the active JSX and confirm: (a) switching the dropdown from `publishedAt` → `popular` re-queries and re-orders cards by views, (b) switching to `currentPrice` re-orders by price, (c) the outer `source={{ from: 'publishedAt', ... }}` stays the base shape (the `useEffect` re-syncs if the toolbar edits `source.from`). Revert when done.
- [ ] **`popular` source:** temporarily swap the page's source to `{ from: 'popular', limit: 3 }` — cards ordered by views desc (published_at desc tiebreak). Revert.
- [ ] **`currentPrice` source:** temporarily swap to `{ from: 'currentPrice', min: 0, max: 1000000, limit: 3 }` — cards ordered by sale/list price. Revert.
- [ ] **`recentWatched` source:** requires logged-in account with watch history. Swap to `{ from: 'recentWatched', limit: 3 }` — cards are the member's recently-watched programs, ordered by latest watch desc. If the demo account has no history both master and refactor render the `recentWatchedEmpty` empty-state string (`尚未開始觀看任何課程`) — parity only meaningful when there's history. Revert.
- [ ] **`custom` source:** swap to `{ from: 'custom', idList: ['<real-program-uuid-1>', '<real-program-uuid-2>'] }` — exactly those programs render in `idList` order. Revert.
- [ ] **`custom → !custom` OrderSelector fallback:** with `withOrderSelector` and `source={{ from: 'custom', idList: [...] }}`, toggle the dropdown off `custom` → off-`custom` branch should query `{ from: <selected>, limit: 4 }` (idList is discarded, as in master). Confirm the rendered list changes from the 2 custom-picked programs to the first 4 programs ordered by the new sourceFrom. Revert.

### Mechanical checks (auto-verified, kept for reference)
- [x] `pnpm --filter @lodestar/types exec tsc --noEmit` passes
- [x] `pnpm --filter @lodestar/data-hasura exec tsc --noEmit` passes
- [x] `pnpm --filter @lodestar/ui exec tsc --noEmit` passes
- [x] `pnpm --filter @lodestar/element-demo exec tsc --noEmit` passes
- [x] `pnpm -r exec tsc --noEmit` passes after `.tsbuildinfo` wipe
- [x] `grep -rn "@apollo/client\|@lodestar/graphql\|\bgql\b\|\buseQuery\b" packages/ui/src/components/collections/ProgramCollection.tsx` is empty
- [x] Commit `94f8143` (types + hooks only) typechecks clean standalone before commit `8a25a06` layers on top.

### Known deviations from master

- `collectionsMessages.ProgramCollection.recentWatchedEmpty` is **inlined** into `apps/element-demo/src/craft/CraftProgramCollection.tsx` as a `defineMessages({ recentWatchedEmpty: { id: 'collections.ProgramCollection.recentWatchedEmpty', defaultMessage: '尚未開始觀看任何課程' } })` literal. The source file `packages/ui/src/components/collections/translation.ts` is a `.ts` helper that is **not reachable** through `@lodestar/ui`'s package `exports` map (only `./components/*.tsx` is mapped). Inlining with the original `id` + `defaultMessage` preserves the translation-catalog entry. If a future UI-level barrel exports `collectionsMessages`, swap the inline back to an import.
- `sourceFrom` state moved **out of the UI** into the Craft wrapper (Decision 1). The `useEffect(() => setSourceFrom(resolvedSource.from), [resolvedSource.from])` sync in the wrapper reproduces master's `useEffect(() => { if (source.from !== sourceFrom) setSourceFrom(source.from) }, [source])` modulo two tweaks: (a) the dep is keyed on the stable `resolvedSource.from` literal rather than the `source` object, and (b) the conditional guard is dropped because `setSourceFrom` is idempotent on equal values in React 18 — no behaviour change.
- `effectiveSource` `useMemo` (Decision 4) narrows with `as ProgramCollectionSource` for the `custom → !custom` fallback branch and the spread branch. `sourceFrom` is driven by `OrderSelector` whose options are a statically enumerated subset of the union's `from` literals — the cast is documented as a narrow assertion, not a broader escape. No `any` / `as unknown as X` anywhere.
- `useEnrolledProgramIds` is lifted out of the UI file (Decision 2) into `@lodestar/data-hasura/hooks/programCollection.ts`. The `skip` predicate is driven by the wrapper's current `sourceFrom` state (`sourceFrom !== 'recentWatched'`) rather than the outer `source.from`, so the enrolled-ids query fires as soon as the user toggles the OrderSelector to `recentWatched` even if the outer `source.from` is still something else. This is a tiny behavioural broadening over master (master's `skip` was keyed on the outer `source.from`, so toggling to `recentWatched` via OrderSelector while the outer source was `publishedAt` would have rendered an empty list because `enrolledProgramIds` was `[]`). The refactor now fires the needed query — confirm during manual verification whether this is user-visible.
- `useProgramCollection`'s `context` arg always supplies `currentMemberId` / `enrolledProgramIds`, but only the `recentWatched` branch consumes them in `buildVariables`. The other four branches ignore context entirely, so the orchestration hook shape stays uniform without leaking auth state into non-auth-branch variables.
- Master widened `(pp as any).position` inline. The refactor replaces this with a local structural widening at the hook site (`ProgramPlanNode & { position?: number | null }`) — no fresh `any` introduced. Runtime behaviour is unchanged (still defaults to `0` when Hasura omits the field).
- `findPrimaryPlan(program.plans as any)` was replaced with `program.plans[0]`. `findPrimaryPlan` is literally `plans[0] || null` — the `as any` in master was only needed because the old inline `ProgramData` shape didn't structurally match `Partial<ProductPlan>[]`. Reading index 0 directly is equivalent and removes one `as any` without behavioural change.
- `historicalProgramPlanBuyers` / `historicalProgramPackagePlanBuyers` now use `??` rather than `||` inside `composeCollectionData`, preserving a genuine `0` count instead of rewriting it to `null`. Matches how master's original aggregation treated these fields in the card layer (cards already display `0` fine).

## B-2a — OrderDetailDrawer (commits `a909694`, `d91ecb2`)

### No visible parity check possible

`OrderDetailDrawer` is barrel-exported from `packages/ui/src/index.ts` but has no active non-barrel caller and no element-demo route renders it. Only mechanical checks are possible at this sub-task; visual parity against master must wait for the follow-up below.

### Mechanical checks (auto-verified)
- [x] `pnpm --filter @lodestar/ui exec tsc --noEmit` passes
- [x] `pnpm --filter @lodestar/element-demo exec tsc --noEmit` passes
- [x] `pnpm -r exec tsc --noEmit` passes after `.tsbuildinfo` wipe
- [x] `grep -rn "@apollo/client\|@lodestar/graphql\|\bgql\b\|\buseQuery\b\|\buseMutation\b" packages/ui/src/components/order/OrderDetailDrawer.tsx` is empty
- [x] Commit `a909694` (types + hooks only) typechecks clean standalone before commit `d91ecb2` layers on top.

### Follow-up — add a demo page (TODO)

- Add `apps/element-demo/src/pages/OrderPage.tsx` (one route registration in `App.tsx`) with a seed `orderId` from a real test app, plus the wiring below, so `OrderDetailDrawer` has an exercisable route before the Phase B-4 parity sweep:

```tsx
// apps/element-demo/src/pages/OrderPage.tsx (sketch)
const { data: orderDetail, loading: loadingOrderDetail } = useOrderDetail(orderLogId)
const paths = orderDetail.orderProducts.map(p => p.options?.from).filter((p): p is string => !!p)
const { data: sharingCodes, loading: loadingSharingCode } = useSharingCodes(paths)
<OrderDetailDrawer
  orderLogId={orderLogId}
  onClose={onClose}
  orderDetail={orderDetail}
  sharingCodes={sharingCodes}
  loadingOrderDetail={loadingOrderDetail}
  loadingSharingCode={loadingSharingCode}
/>
```

- Once that page exists, add the view-mode parity checks (drawer opens, order info / other info / invoice info / payment info sections render identical to master; sharing code / executor / installment display paths exercised). Since `OrderDetailDrawer` is not Craftize'd, the usual editor-mode / toolbar / drag-and-drop checks do not apply.

### Known deviations from master

- The `useOrderDetail` internal composer (originally defined at the bottom of `OrderDetailDrawer.tsx`) was promoted into `@lodestar/data-hasura/hooks/orderDetail.ts` and split into two named exports: `useOrderDetail(orderLogId)` (returns the composed `OrderDetailView`) and `useSharingCodes(paths)` (returns the joined `sharingCode` / `sharingNote` strings). Master fused both queries into one internal hook; the refactor separates them so callers can skip the sharing-codes query independently if desired.
- The props-only UI now takes both `orderDetail: OrderDetailView` and `sharingCodes: SharingCodes` — empty-state shapes are returned by the hooks before data arrives, so the component never receives `undefined` and its existing `orderLog.shipping?.xxx` optional-chaining paths are unchanged. `loadingOrderDetail` / `loadingSharingCode` are optional with `false` defaults to keep ad-hoc usage frictionless.
- `totalPrice` is computed inside the data hook (same formula as master: `max(productPrice - discountPrice + shippingFee)`); the UI just formats it. No user-visible change.
- The unused `errorOrderDetail` / `errorSharingCode` fields that master's internal hook returned (but the UI never consumed) are dropped; the new hooks still surface `error?: Error` in the standard `{ data, loading, error? }` shape so a future caller can wire error UI if needed.
- `packages/types/src/order.ts` gains three additions: `OrderExecutor`, `SharingCodes`, and `OrderDetailView` (the aggregate the hook emits). These are view shapes the UI already consumed inline — no raw hasura shape is re-exported.

## B-2b — Checkout cluster (commits `d16bdef`, `584df34`)

### Required checks

- [ ] `/checkout` view mode — all four `<ConnectedCheckoutProductModal …/>` instances in `CheckoutPage.tsx` open their respective modals (ProgramPlan / ProjectPlan / ProgramPlan / ProgramPlan product ids) with identical contents to master. Verify: product item, quantity controls, discount card, coupon modal, shipping form (when applicable), invoice form, payment selector, credit card selector (including add-new-card flow via TapPay).
- [ ] `/checkout` view mode — Button (if an appId with a Button element exists) triggers `<ConnectedCheckoutProductModal …/>` via `packages/ui/src/components/buttons/Button.tsx`.
- [ ] Coupon insertion — type a real coupon code in the coupon-selection modal; after successful insert the list refreshes.
- [ ] Credit card — selecting an existing card updates state; adding a new card via TapPay goes through (DESTRUCTIVE: only on throwaway appId/account).
- [ ] Payment method — selecting each offered method changes the payment summary accordingly.
- [ ] Submit flow — click the submit button; an order is created, the page navigates to the order page as in master (DESTRUCTIVE: only on throwaway appId/account).
- [ ] Coin deduction — if the app enables coin module, `remainingCoins` is read and the checkout UI reflects the coin balance identically to master.

### Mechanical checks (auto-verified)

- [x] `pnpm --filter @lodestar/ui exec tsc --noEmit` passes
- [x] `pnpm --filter @lodestar/element-demo exec tsc --noEmit` passes
- [x] `pnpm -r exec tsc --noEmit` passes after `.tsbuildinfo` wipe
- [x] `grep` for `@apollo/client | gql | useQuery | useMutation | @lodestar/graphql` in `CheckoutProductModal.tsx` / `PaymentSelector.tsx` / `CreditCardSelector.tsx` is empty
- [x] Commit `d16bdef` (hooks only) typechecks clean standalone before commit `584df34` layers on top.

### Known deviations / Phase-C follow-ups

- `@lodestar/ui` still imports `@lodestar/data-hasura` inside `ConnectedCheckoutProductModal.tsx`, `PaymentSelector.tsx` chain (via the Connected wrapper), and transitively through the modal's non-Apollo hooks (`useMember`, `useSimpleProduct`, `useCheck`, `useResourceCollection`, `useTracking`, `useUpdateMemberMetadata`). These remain as the B-2 "pragmatic scope" carve-out; Phase C evaluates whether to pull each of them one layer further up (into Connected wrappers / consumer pages).
- `@lodestar/ui/package.json` still declares `@lodestar/data-hasura` / `@apollo/client` / `graphql` / `graphql-ws` deps — unchanged in Phase B. Phase C strips these once all call sites are converted.
- The original `useMemberCreditCards` export in `CreditCardSelector.tsx` was an inline internal hook; moving it to `@lodestar/data-hasura/hooks/checkoutFlow.ts` means any external import path like `import { useMemberCreditCards } from '@lodestar/ui/components/selectors/CreditCardSelector'` needs to be redirected to the data-hasura path. Grep in the current workspace is clean; external consumers (lodestar-app / lodestar-app-admin) will need the same fix once they integrate into the monorepo.
- `CheckoutProductModal`'s pre-existing `styled(Checkbox as any)` at `CheckoutProductModal.tsx:111` is inherited from master and was left alone; untangling it is a chakra-typing task orthogonal to B-2. No new `any` was introduced.

<!-- B-1 / B-2 / B-3 append their items below as sub-tasks land -->
