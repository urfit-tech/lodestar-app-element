import { UserComponent } from '@craftjs/core'
import React, { useMemo } from 'react'
import MemberCollection, { MemberCollectionProps } from '@lodestar/ui/components/collections/MemberCollection'
import Craftize, { PropsWithCraft } from '@lodestar/ui/components/common/Craftize'
import { MemberCollectionSource, useMemberCollection } from '@lodestar/data-hasura/hooks/memberCollection'

export type CraftMemberCollectionProps = Omit<MemberCollectionProps, 'members' | 'isFetching' | 'fetchError'> & {
  source?: MemberCollectionSource
}

const DEFAULT_SOURCE: MemberCollectionSource = { from: 'role' }

const ConnectedMemberCollection: React.FC<CraftMemberCollectionProps> = ({ source, ...rest }) => {
  // Memoize the resolved source so that `useMemberCollection` doesn't see a
  // fresh object on every render (which would thrash its `useMemo` deps and
  // churn the composed result). `source` from Craft.js is stable per node;
  // when it is undefined we lock onto the module-level default.
  const resolvedSource = useMemo<MemberCollectionSource>(() => source ?? DEFAULT_SOURCE, [source])
  const { data, loading, error } = useMemberCollection(resolvedSource)

  return <MemberCollection {...rest} members={data} isFetching={loading} fetchError={error} />
}

// Explicit `UserComponent<PropsWithCraft<...>>` annotation anchors the type
// locally. Without it, TypeScript tries to name Craftize's inferred return
// type via `../../../../packages/ui/node_modules/@craftjs/core/lib`, which is
// non-portable across workspace boundaries (TS2742).
export const CraftMemberCollection: UserComponent<PropsWithCraft<CraftMemberCollectionProps>> =
  Craftize(ConnectedMemberCollection)
