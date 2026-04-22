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

<!-- B-1 / B-2 / B-3 append their items below as sub-tasks land -->
