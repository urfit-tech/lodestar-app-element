import { UserComponent } from '@craftjs/core'
import React, { useMemo } from 'react'
import ProgramPackageCollection, {
  ProgramPackageCollectionProps,
} from '@lodestar/ui/components/collections/ProgramPackageCollection'
import Craftize, { PropsWithCraft } from '@lodestar/ui/components/common/Craftize'
import {
  ProgramPackageCollectionSource,
  useProgramPackageCollection,
} from '@lodestar/data-hasura/hooks/programPackageCollection'

export type CraftProgramPackageCollectionProps = Omit<
  ProgramPackageCollectionProps,
  'programPackages' | 'isFetching' | 'fetchError' | 'defaultCategoryIds'
> & {
  source?: ProgramPackageCollectionSource
}

const DEFAULT_SOURCE: ProgramPackageCollectionSource = { from: 'publishedAt' }

const ConnectedProgramPackageCollection: React.FC<CraftProgramPackageCollectionProps> = ({ source, ...rest }) => {
  // Memoize the resolved source so that `useProgramPackageCollection` doesn't
  // see a fresh object on every render (which would thrash its `useMemo` deps
  // and churn the composed result). `source` from Craft.js is stable per node;
  // when it is undefined we lock onto the module-level default.
  const resolvedSource = useMemo<ProgramPackageCollectionSource>(() => source ?? DEFAULT_SOURCE, [source])
  const { data, loading, error } = useProgramPackageCollection(resolvedSource)
  const defaultCategoryIds = resolvedSource.from === 'publishedAt' ? resolvedSource.defaultCategoryIds : undefined

  return (
    <ProgramPackageCollection
      {...rest}
      programPackages={data}
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
export const CraftProgramPackageCollection: UserComponent<PropsWithCraft<CraftProgramPackageCollectionProps>> =
  Craftize(ConnectedProgramPackageCollection)
