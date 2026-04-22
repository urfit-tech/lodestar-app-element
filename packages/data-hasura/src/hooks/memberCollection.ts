import { gql, useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { notEmpty } from '@lodestar/helpers'
import * as hasura from '@lodestar/graphql/hasura'
import { getMemberCollectionQuery } from '@lodestar/graphql/queries'
import { MemberCollectionItem } from '@lodestar/types/member'
import { ProductCustomSource, ProductRoleSource } from '@lodestar/types/options'

export type MemberCollectionSource = ProductRoleSource | ProductCustomSource

export type UseMemberCollectionResult = {
  data: MemberCollectionItem[]
  loading: boolean
  error?: Error
}

const memberFields = gql`
  fragment memberFields on member_public {
    id
    name
    title
    abstract
    description
    picture_url
  }
`

const MEMBER_COLLECTION_QUERY = getMemberCollectionQuery(memberFields)

const composeCollectionData = (data: hasura.GET_MEMBER_COLLECTION): MemberCollectionItem[] =>
  data.member_public.map(m => ({
    id: m.id || '',
    name: m.name || '',
    title: m.title || null,
    abstract: m.abstract || null,
    pictureUrl: m.picture_url || null,
    description: m.description || null,
  }))

const buildVariables = (source: MemberCollectionSource): hasura.GET_MEMBER_COLLECTIONVariables => {
  if (source.from === 'custom') {
    return {
      limit: undefined,
      orderByClause: [],
      whereClause: {
        id: { _in: source.idList || [] },
      },
    }
  }
  return {
    limit: source.limit || 100,
    orderByClause: [{ name: 'asc_nulls_last' as hasura.order_by }],
    whereClause: {
      role: { _eq: source.role },
    },
  }
}

export const useMemberCollection = (source: MemberCollectionSource): UseMemberCollectionResult => {
  const variables = useMemo(() => buildVariables(source), [source])
  const { data: rawData, loading, error } = useQuery<
    hasura.GET_MEMBER_COLLECTION,
    hasura.GET_MEMBER_COLLECTIONVariables
  >(MEMBER_COLLECTION_QUERY, { variables })

  const composed = useMemo(() => {
    if (!rawData) return []
    // `custom` source: preserve the caller-supplied idList order (matches
    // the original collectCustomCollection behaviour — the query itself
    // returns rows in arbitrary order).
    if (source.from === 'custom') {
      const ordered: hasura.GET_MEMBER_COLLECTION = {
        ...rawData,
        member_public: (source.idList || [])
          .map(id => rawData.member_public.find(m => m.id === id))
          .filter(notEmpty),
      }
      return composeCollectionData(ordered)
    }
    return composeCollectionData(rawData)
  }, [rawData, source])

  return {
    data: composed,
    loading,
    error: error && new Error(error.message),
  }
}
