import { UserComponent } from '@craftjs/core'
import React, { useMemo } from 'react'
import ProgramContentCollection, {
  ProgramContentCollectionProps,
} from '@lodestar/ui/components/collections/ProgramContentCollection'
import Craftize, { PropsWithCraft } from '@lodestar/ui/components/common/Craftize'
import {
  ProgramContentCollectionSource,
  useProgramContentCollection,
} from '@lodestar/data-hasura/hooks/programContentCollection'

export type CraftProgramContentCollectionProps = Omit<
  ProgramContentCollectionProps,
  'programContents' | 'isFetching' | 'fetchError' | 'defaultCategoryIds'
> & {
  source?: ProgramContentCollectionSource
}

const DEFAULT_SOURCE: ProgramContentCollectionSource = { from: 'recentWatched' }

const ConnectedProgramContentCollection: React.FC<CraftProgramContentCollectionProps> = ({
  source,
  ...rest
}) => {
  // Memoize the resolved source so that `useProgramContentCollection` doesn't
  // see a fresh object on every render (which would thrash its `useMemo` deps
  // and churn the composed result). `source` from Craft.js is stable per node;
  // when it is undefined we lock onto the module-level default.
  const resolvedSource = useMemo<ProgramContentCollectionSource>(
    () => source ?? DEFAULT_SOURCE,
    [source],
  )
  const { data, loading, error } = useProgramContentCollection(resolvedSource)
  const defaultCategoryIds =
    resolvedSource.from === 'recentWatched' ? resolvedSource.defaultCategoryIds : undefined

  return (
    <ProgramContentCollection
      {...rest}
      programContents={data}
      isFetching={loading}
      fetchError={error}
      defaultCategoryIds={defaultCategoryIds}
    />
  )
}

// Explicit `UserComponent<PropsWithCraft<...>>` annotation anchors the type
// locally. Without it, TypeScript tries to name Craftize's inferred return
// type via `../../../../packages/ui/node_modules/@craftjs/core/lib`, which is
// non-portable across workspace boundaries (TS2742).
export const CraftProgramContentCollection: UserComponent<
  PropsWithCraft<CraftProgramContentCollectionProps>
> = Craftize(ConnectedProgramContentCollection)
