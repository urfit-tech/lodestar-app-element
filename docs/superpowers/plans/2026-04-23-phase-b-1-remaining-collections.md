# Phase B-1 — Remaining Collection Refactors

> **Reference pattern:** Phase B-0 commits `3a15b69` (hook + type) + `954c641` (ui props-only + element-demo wiring). Apply the same three-layer structure per file: pure UI in `packages/ui/src/components/collections/`, typed hooks in `packages/data-hasura/src/hooks/`, Connected + Craftize wrapper in `apps/element-demo/src/craft/`.

> **Scope:** 5 collection files executed sequentially. `ProgramCollection` is excluded — split out to **B-1f** because its 674-line file has conditional `useState` + `useEffect` driven `sourceFrom` switching that doesn't fit the B-0 mold cleanly.

> **Files processed in order:**
> 1. B-1a `MemberCollection` (171 lines, 2 queries: role, custom)
> 2. B-1b `ProgramContentCollection` (229 lines, 2 queries: recentWatched, custom)
> 3. B-1c `ProgramPackageCollection` (295 lines, 2 queries: publishedAt, custom)
> 4. B-1d `ProjectCollection` (307 lines, 3 queries: publishedAt, custom, popular)
> 5. B-1e `PostCollection` (310 lines, 3 queries: publishedAt, custom, popular)

---

## Shared conventions (all B-1 sub-tasks)

For each collection `X` the subagent must produce:

### 1. Types
- Check whether `packages/types/src/` already has a collection-view type for `X`. If not, add `packages/types/src/<x>.ts` exporting `<X>CollectionItem` (and any helper shapes) that matches the actual composed data used by the UI, not the raw Hasura response. Mirror the `ActivityCollectionItem` style from `packages/types/src/activity.ts`.
- Add `export * from './<x>'` to `packages/types/src/index.ts` in alphabetical position.

### 2. Data hook
- Create `packages/data-hasura/src/hooks/<x>.ts` with:
  - Exported `<X>CollectionSource` = union of supported source types (copy whatever sources the UI's original `switch (source.from)` handled; DO NOT invent new ones)
  - Exported `Use<X>CollectionResult = { data: <X>CollectionItem[]; loading: boolean; error?: Error }`
  - A single hook `use<X>Collection(source: <X>CollectionSource): Use<X>CollectionResult` that:
    - Uses a module-level `gql` fragment and `useMemo` for variables
    - Branches the variables shape inside a `buildVariables(source)` helper (not in the hook body)
    - Preserves `idList` order post-query when `source.from === 'custom'`, matching the original `collectCustomCollection` behaviour
    - Returns `composeCollectionData(rawData)` where `composeCollectionData` is a pure module-level function
- Add `export * from './hooks/<x>'` to `packages/data-hasura/src/index.ts` in alphabetical position.
- Module-level constant: `const <X>_COLLECTION_QUERY = get<X>CollectionQuery(<x>Fields)` — hoist so gql parsing runs once per module load, not per hook call.

### 3. Pure UI refactor
- Rewrite `packages/ui/src/components/collections/<X>Collection.tsx`:
  - Remove imports: `@apollo/client`, `@lodestar/graphql/*`, `gql`, `useQuery`, any `DeepPick` used for graphql typing, `notEmpty` if only used for graphql postprocessing
  - Remove the `collect*Collection` + `composeCollectionData` + gql-fragment constants (now in data-hasura)
  - New prop names avoiding `ElementComponent<P>`'s `loading`/`errors` (which keep their "parent-driven hide" meaning):
    - `<entity>: <X>CollectionItem[]` — the data (use a specific noun, not `data`)
    - `isFetching?: boolean`
    - `fetchError?: Error`
    - `defaultCategoryIds?: string[]` — if the original UI used `source.defaultCategoryIds` for category filtering, surface this as a first-class prop
  - Remove `source` from `<X>CollectionProps` — resolution moves to Connected wrapper

### 4. CraftElement.tsx cleanup (in ui)
- Delete the `import X from '../collections/X'` line **and** the `export const CraftX = Craftize(X)` line.
- Leave the rest of `packages/ui/src/components/common/CraftElement.tsx` untouched.

### 5. Connected + Craftize in element-demo
- Create `apps/element-demo/src/craft/Craft<X>Collection.tsx` mirroring `CraftActivityCollection.tsx`:
  - Module-level `DEFAULT_SOURCE` constant (usually the first/default branch)
  - `ConnectedX` wraps `useMemo<XCollectionSource>(() => source ?? DEFAULT_SOURCE, [source])` → hook → pure UI
  - **Explicit export annotation:** `export const CraftX: UserComponent<PropsWithCraft<CraftXCollectionProps>> = Craftize(ConnectedX)` — required to avoid TS2742 (cross-workspace generic leak). Imports: `UserComponent` from `@craftjs/core`, `PropsWithCraft` from `@lodestar/ui/components/common/Craftize`.
- Add the file to `apps/element-demo/src/craft/index.ts` barrel.

### 6. Page update
- Update the element-demo page that uses `CraftXCollection` (see per-file section below) to import from `../craft/CraftXCollection` instead of `@lodestar/ui/components/common/CraftElement`.
- **Do not change the JSX** other than the import; preserve the exact `source`, `variant`, etc. the page currently passes.

### 7. Verification
```bash
pnpm --filter @lodestar/ui exec tsc --noEmit
pnpm --filter @lodestar/element-demo exec tsc --noEmit
find packages apps -name "*.tsbuildinfo" -delete
pnpm -r exec tsc --noEmit
```
All must exit clean. Then grep:
```bash
grep -rn "@apollo/client\|@lodestar/graphql\|\bgql\b\|\buseQuery\b" packages/ui/src/components/collections/<X>Collection.tsx
```
Must be empty.

### 8. Commit structure
Two commits per collection (mirror B-0):
1. `feat(data-hasura): add use<X>Collection hook and <X>CollectionItem type` — adds types + hook + barrel entry only. Typechecks clean standalone.
2. `refactor(ui,element-demo): make <X>Collection props-only and wire it up from element-demo` — everything else together. Typechecks clean.

Both commits must carry the `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer.

### 9. Manual verification log update
After the commits, append a new section to `docs/superpowers/plans/2026-04-23-phase-b-manual-verification.md` with:
- Sub-task heading (`## B-1a — MemberCollection (commits <sha1>, <sha2>)`)
- The view/editor/variant checklist items specific to this collection's page routes
- Any deviations from master noted (like B-0's `totalParticipants: 0` TODO)

---

## Per-file specifics

### B-1a — MemberCollection

- Source types used: `ProductRoleSource`, `ProductCustomSource`
- Query: `GET_MEMBER_COLLECTION` via `getMemberCollectionQuery(memberFields)` (check `packages/graphql/src/queries.ts` for fragment name)
- Composed item: infer from existing `composeCollectionData` in `packages/ui/src/components/collections/MemberCollection.tsx`; typical shape: `{ id, name, pictureUrl, abstract?, roles?, ... }`
- Page: `apps/element-demo/src/pages/MemberElementPage.tsx` — imports `CraftMemberCollection` from `@lodestar/ui/components/common/CraftElement`. Three instances: `source={{ from: 'role', limit: 10 }}`, `source={{ from: 'role', role: 'app-owner' }}`, `source={{ from: 'role', role: 'content-creator' }}`.
- Hook name: `useMemberCollection`
- Source type alias: `MemberCollectionSource = ProductRoleSource | ProductCustomSource`
- DEFAULT_SOURCE: `{ from: 'role' }` (matches implicit default at line 59 of the original)

### B-1b — ProgramContentCollection

- Source types used: `ProductRecentWatchedSource`, `ProductCustomSource`
- Query: `GET_PROGRAM_CONTENT_COLLECTION`
- Hook name: `useProgramContentCollection`
- Page: `apps/element-demo/src/pages/ProgramContentCollectionPage.tsx` — currently all commented out. Uncomment only the single `<CraftProgramContentCollection variant="card" source={{ from: 'recentWatched', limit: 3 }} />` after the refactor lands; if leaving commented causes no manual-verification step, leave as-is but note it in the verification log. Suggested: uncomment so the route has something to look at.
- DEFAULT_SOURCE: `{ from: 'recentWatched' }`

### B-1c — ProgramPackageCollection

- Source types used: `ProductPublishedAtSource`, `ProductCustomSource`
- Query: `GET_PROGRAM_PACKAGE_COLLECTION`
- Hook name: `useProgramPackageCollection`
- Page: `apps/element-demo/src/pages/ProgramPackagePage.tsx` — the `<CraftProgramPackageCollection variant="card" source={{ source: 'publishedAt' }} />` is currently commented out. Notice `source: 'publishedAt'` looks suspicious (probably should be `from: 'publishedAt'`); when uncommenting, fix to `{ from: 'publishedAt' }` to match the type. Flag this inconsistency in the report.
- DEFAULT_SOURCE: `{ from: 'publishedAt' }`

### B-1d — ProjectCollection

- Source types used: `ProductPublishedAtSource`, `ProductCustomSource`, `ProductPublishedAtSource<'popular'>` (popular is a discriminated variant of publishedAt).
- Query: `GET_PROJECT_COLLECTION`
- Hook name: `useProjectCollection`
- **Extra wrinkle:** the `switch (source.from)` feeds `type` through to the query (see `collectPublishedAtCollection({ ...source, type: props.type })` at original line 68). `type` is a `ProjectCollection`-specific prop used by the query's `where.type`. Keep it in `ProjectCollectionSource` as an optional discriminator, or keep `type` as a separate param to the hook — pick whichever is cleaner after reading the original 307-line file. Document the decision in the commit message.
- Page: `apps/element-demo/src/pages/ProjectElementPage.tsx` — `<CraftProjectCollection />` (no props, falls through to defaults). DEFAULT_SOURCE: `{ from: 'publishedAt' }`.

### B-1e — PostCollection

- Source types used: `ProductPublishedAtSource`, `ProductCustomSource`, `ProductPublishedAtSource<'popular'>`
- Query: `GET_POST_COLLECTION`
- Hook name: `usePostCollection`
- Page: there is no `PostCollectionPage` in `apps/element-demo/src/pages/`. `CraftPostCollection` exists in `CraftElement.tsx` but is not rendered by any demo page. Still perform the refactor + create `apps/element-demo/src/craft/CraftPostCollection.tsx` + register it in `app.tsx` resolver map; note in the manual-verification log that visual parity cannot be checked without a demo page, and suggest adding a `PostPage` route as a follow-up.
- DEFAULT_SOURCE: `{ from: 'publishedAt' }`

---

## Ordering and branch discipline

- Execute B-1a through B-1e **sequentially** (each subagent runs to completion + commits before the next starts); they share the `apps/element-demo/src/craft/index.ts` barrel and the `apps/element-demo/src/App.tsx` resolver merge, which cannot be safely edited in parallel.
- Each sub-task produces exactly 2 commits + 1 manual-verification log update commit (or fold the doc update into commit 2). Keep the commit boundaries tight so `git bisect` remains useful.
- If a subagent reports `BLOCKED` or `DONE_WITH_CONCERNS` with a real issue, the controller fixes the plan before dispatching the next sub-task. Do not plough ahead on a broken pattern.

## Out of scope for B-1

- `ProgramCollection` — deferred to **B-1f**, separate plan
- Modals / selectors — **B-2**
- `CraftElement.tsx` final shape — **B-3**
- `@lodestar/ui/package.json` dependency cleanup — Phase C
