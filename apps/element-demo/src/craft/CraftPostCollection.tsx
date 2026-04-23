import { UserComponent } from '@craftjs/core'
import React, { useMemo } from 'react'
import PostCollection, { PostCollectionProps } from '@lodestar/ui/components/collections/PostCollection'
import Craftize, { PropsWithCraft } from '@lodestar/ui/components/common/Craftize'
import { PostCollectionSource, usePostCollection } from '@lodestar/data-hasura/hooks/postCollection'

export type CraftPostCollectionProps = Omit<
  PostCollectionProps,
  'posts' | 'isFetching' | 'fetchError' | 'defaultCategoryIds'
> & {
  source?: PostCollectionSource
}

const DEFAULT_SOURCE: PostCollectionSource = { from: 'publishedAt' }

const ConnectedPostCollection: React.FC<CraftPostCollectionProps> = ({ source, ...rest }) => {
  // Memoize the resolved source so that `usePostCollection` doesn't see a
  // fresh object on every render (which would thrash its `useMemo` deps and
  // churn the composed result). `source` from Craft.js is stable per node;
  // when it is undefined we lock onto the module-level default.
  const resolvedSource = useMemo<PostCollectionSource>(() => source ?? DEFAULT_SOURCE, [source])
  const { data, loading, error } = usePostCollection(resolvedSource)
  const defaultCategoryIds =
    resolvedSource.from === 'publishedAt' || resolvedSource.from === 'popular'
      ? resolvedSource.defaultCategoryIds
      : undefined

  return (
    <PostCollection
      {...rest}
      posts={data}
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
export const CraftPostCollection: UserComponent<PropsWithCraft<CraftPostCollectionProps>> =
  Craftize(ConnectedPostCollection)
