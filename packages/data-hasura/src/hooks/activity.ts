import { gql, useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { notEmpty } from '@lodestar/helpers'
import * as hasura from '@lodestar/graphql/hasura'
import { getActivityCollectionQuery } from '@lodestar/graphql/queries'
import { ActivityCollectionItem } from '@lodestar/types/activity'
import { ProductCustomSource, ProductPublishedAtSource } from '@lodestar/types/options'

export type ActivityCollectionSource = ProductPublishedAtSource | ProductCustomSource

export type UseActivityCollectionResult = {
  data: ActivityCollectionItem[]
  loading: boolean
  error?: Error
}

const activityFields = gql`
  fragment activityFields on activity {
    id
    cover_url
    title
    published_at
    is_participants_visible
    organizer_id
    activity_categories {
      category {
        id
        name
      }
    }
    activity_enrollments_aggregate {
      aggregate {
        count
      }
    }
    activity_sessions {
      started_at
      ended_at
    }
    activity_tickets {
      count
      price
    }
  }
`

const composeCollectionData = (data: hasura.GET_ACTIVITY_COLLECTION): ActivityCollectionItem[] =>
  data.activity.map((a) => ({
    id: a.id,
    title: a.title,
    coverUrl: a.cover_url || null,
    isParticipantVisible: a.is_participants_visible,
    organizerId: a.organizer_id,
    sessions: a.activity_sessions.map((as) => ({
      startedAt: as.started_at,
      endedAt: as.ended_at,
    })),
    tickets: a.activity_tickets.map((at) => ({
      limit: at.count,
      price: at.price,
    })),
    categories: a.activity_categories.map((ac) => ({
      id: ac.category.id,
      name: ac.category.name,
    })),
    totalParticipants: 0, // TODO: wire activity_enrollments_aggregate once ui needs it
  }))

const buildVariables = (source: ActivityCollectionSource): hasura.GET_ACTIVITY_COLLECTIONVariables => {
  if (source.from === 'custom') {
    return {
      limit: undefined,
      orderByClause: [],
      whereClause: {
        id: { _in: source.idList || [] },
        published_at: { _lt: 'now()' },
        is_private: { _eq: false },
      },
    }
  }
  return {
    whereClause: {
      activity_categories: source.defaultCategoryIds?.length
        ? { category_id: { _in: source.defaultCategoryIds } }
        : undefined,
      activity_tags: source.defaultTagNames?.length ? { tag_name: { _in: source.defaultTagNames } } : undefined,
      published_at: { _lt: 'now()' },
      is_private: { _eq: false },
    },
    orderByClause: [{ published_at: (source.asc ? 'asc' : 'desc') as hasura.order_by }],
    limit: source.limit,
  }
}

export const useActivityCollection = (source: ActivityCollectionSource): UseActivityCollectionResult => {
  const variables = useMemo(() => buildVariables(source), [source])
  const {
    data: rawData,
    loading,
    error,
  } = useQuery<hasura.GET_ACTIVITY_COLLECTION, hasura.GET_ACTIVITY_COLLECTIONVariables>(
    getActivityCollectionQuery(activityFields),
    { variables },
  )

  const composed = useMemo(() => {
    if (!rawData) return []
    // `custom` source: preserve the caller-supplied idList order (matches
    // the original collectCustomCollection behaviour — the query itself
    // returns rows in arbitrary order).
    if (source.from === 'custom') {
      const ordered: hasura.GET_ACTIVITY_COLLECTION = {
        ...rawData,
        activity: (source.idList || []).map((id) => rawData.activity.find((a) => a.id === id)).filter(notEmpty),
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
