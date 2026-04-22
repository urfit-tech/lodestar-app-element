import { UserComponent } from '@craftjs/core'
import React, { useMemo } from 'react'
import ProjectCollection, {
  ProjectCollectionProps,
} from '@lodestar/ui/components/collections/ProjectCollection'
import Craftize, { PropsWithCraft } from '@lodestar/ui/components/common/Craftize'
import {
  ProjectCollectionSource,
  useProjectCollection,
} from '@lodestar/data-hasura/hooks/projectCollection'
import { Project } from '@lodestar/types/data'

export type CraftProjectCollectionProps = Omit<
  ProjectCollectionProps,
  'projects' | 'isFetching' | 'fetchError' | 'defaultCategoryIds'
> & {
  source?: ProjectCollectionSource
  type?: Project['type']
}

const DEFAULT_SOURCE: ProjectCollectionSource = { from: 'publishedAt' }

const ConnectedProjectCollection: React.FC<CraftProjectCollectionProps> = ({
  source,
  type,
  ...rest
}) => {
  // Memoize the resolved source so that `useProjectCollection` doesn't see a
  // fresh object on every render (which would thrash its `useMemo` deps and
  // churn the composed result). `source` from Craft.js is stable per node;
  // when it is undefined we lock onto the module-level default.
  const resolvedSource = useMemo<ProjectCollectionSource>(
    () => source ?? DEFAULT_SOURCE,
    [source],
  )
  const { data, loading, error } = useProjectCollection(resolvedSource, { type })
  const defaultCategoryIds =
    resolvedSource.from === 'publishedAt' || resolvedSource.from === 'popular'
      ? resolvedSource.defaultCategoryIds
      : undefined

  return (
    <ProjectCollection
      {...rest}
      projects={data}
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
export const CraftProjectCollection: UserComponent<
  PropsWithCraft<CraftProjectCollectionProps>
> = Craftize(ConnectedProjectCollection)
