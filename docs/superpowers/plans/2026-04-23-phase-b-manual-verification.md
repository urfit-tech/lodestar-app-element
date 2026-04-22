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

<!-- B-1 / B-2 / B-3 append their items below as sub-tasks land -->
