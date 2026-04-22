import { UserComponent } from '@craftjs/core'
import React, { useEffect, useMemo, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
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

// `collectionsMessages` lives at
// `packages/ui/src/components/collections/translation.ts`, but the
// `@lodestar/ui` package.json exports only map `./components/*` to
// `./src/components/*.tsx` — a `.ts` helper is not reachable from consumer
// code through the workspace export boundary. Inlining the single message
// key we actually consume (keeping the original `id` + `defaultMessage` so
// no translation catalog entry is lost) is cheaper than broadening the
// public surface of `@lodestar/ui` for one Craft wrapper.
const craftProgramCollectionMessages = defineMessages({
  recentWatchedEmpty: {
    id: 'collections.ProgramCollection.recentWatchedEmpty',
    defaultMessage: '尚未開始觀看任何課程',
  },
})

export type CraftProgramCollectionProps = Omit<
  ProgramCollectionProps,
  | 'programs'
  | 'isFetching'
  | 'fetchError'
  | 'defaultCategoryIds'
  | 'sourceFrom'
  | 'onSourceFromChange'
  | 'emptyText'
> & {
  source?: ProgramCollectionSource
}

const DEFAULT_SOURCE: ProgramCollectionSource = { from: 'publishedAt' }

const ConnectedProgramCollection: React.FC<CraftProgramCollectionProps> = ({ source, ...rest }) => {
  // Memoize the resolved source so downstream hooks don't see a fresh
  // object on every render (which would thrash their `useMemo` deps and
  // churn the composed result). `source` from Craft.js is stable per node;
  // when it is undefined we lock onto the module-level default.
  const resolvedSource = useMemo<ProgramCollectionSource>(
    () => source ?? DEFAULT_SOURCE,
    [source],
  )

  const [sourceFrom, setSourceFrom] = useState(resolvedSource.from)
  useEffect(() => {
    // Sync when the outer `source.from` changes (e.g. Craft.js editor
    // toolbar edit). Matches master's
    //   useEffect(() => { if (source.from !== sourceFrom) setSourceFrom(...) })
    // but keyed on `resolvedSource` so the dep is stable.
    setSourceFrom(resolvedSource.from)
  }, [resolvedSource.from])

  const { currentMemberId } = useAuth()
  const { enrolledProgramIds, loadingProgramIds } = useEnrolledProgramIds(currentMemberId, {
    skip: sourceFrom !== 'recentWatched',
  })

  // Construct the effective source from the current `sourceFrom` state
  // while preserving the user-supplied filters (`defaultCategoryIds`,
  // limit, etc.) on the outer source. When the user toggled the
  // OrderSelector away from a `custom` source, master substitutes
  // `{ from: sourceFrom, limit: 4 }`, discarding `idList` — replicated
  // here so the hook receives a shape that actually makes sense for the
  // active `sourceFrom` discriminator.
  const effectiveSource = useMemo<ProgramCollectionSource>(() => {
    if (resolvedSource.from === 'custom' && sourceFrom !== 'custom') {
      // `sourceFrom` is driven by `OrderSelector`, whose options are a
      // statically enumerated subset of the `ProgramCollectionSource`
      // union's `from` literals — narrow with a cast rather than
      // widening the hook signature.
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
      ? formatMessage(craftProgramCollectionMessages.recentWatchedEmpty)
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

// Explicit `UserComponent<PropsWithCraft<...>>` annotation anchors the type
// locally. Without it, TypeScript tries to name Craftize's inferred return
// type via `../../../../packages/ui/node_modules/@craftjs/core/lib`, which is
// non-portable across workspace boundaries (TS2742).
export const CraftProgramCollection: UserComponent<
  PropsWithCraft<CraftProgramCollectionProps>
> = Craftize(ConnectedProgramCollection)
