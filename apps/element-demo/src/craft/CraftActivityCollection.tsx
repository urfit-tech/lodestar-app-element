import { UserComponent } from '@craftjs/core'
import React, { useMemo } from 'react'
import ActivityCollection, { ActivityCollectionProps } from '@lodestar/ui/components/collections/ActivityCollection'
import Craftize, { PropsWithCraft } from '@lodestar/ui/components/common/Craftize'
import { ActivityCollectionSource, useActivityCollection } from '@lodestar/data-hasura/hooks/activity'

export type CraftActivityCollectionProps = Omit<
  ActivityCollectionProps,
  'activities' | 'isFetching' | 'fetchError' | 'defaultCategoryIds'
> & {
  source?: ActivityCollectionSource
}

const DEFAULT_SOURCE: ActivityCollectionSource = { from: 'publishedAt' }

const ConnectedActivityCollection: React.FC<CraftActivityCollectionProps> = ({ source, ...rest }) => {
  // Memoize the resolved source so that `useActivityCollection` doesn't see a
  // fresh object on every render (which would thrash its `useMemo` deps and
  // churn the composed result). `source` from Craft.js is stable per node;
  // when it is undefined we lock onto the module-level default.
  const resolvedSource = useMemo<ActivityCollectionSource>(
    () => source ?? DEFAULT_SOURCE,
    [source],
  )
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

// Explicit `UserComponent<PropsWithCraft<...>>` annotation anchors the type
// locally. Without it, TypeScript tries to name Craftize's inferred return
// type via `../../../../packages/ui/node_modules/@craftjs/core/lib`, which is
// non-portable across workspace boundaries (TS2742).
export const CraftActivityCollection: UserComponent<PropsWithCraft<CraftActivityCollectionProps>> = Craftize(
  ConnectedActivityCollection,
)
