import { gql, useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { notEmpty } from '@lodestar/helpers'
import * as hasura from '@lodestar/graphql/hasura'
import { getPostCollectionQuery } from '@lodestar/graphql/queries'
import { ProductCustomSource, ProductPublishedAtSource } from '@lodestar/types/options'
import { PostCollectionItem } from '@lodestar/types/post'

export type PostCollectionSource =
  | ProductPublishedAtSource
  | ProductPublishedAtSource<'popular'>
  | ProductCustomSource

export type UsePostCollectionResult = {
  data: PostCollectionItem[]
  loading: boolean
  error?: Error
}

const postFields = gql`
  fragment postFields on post {
    id
    title
    cover_url
    video_url
    published_at
    views
    code_name
    pinned_at
    post_roles(where: { name: { _eq: "author" } }, order_by: { position: desc }) {
      id
      member {
        id
        name
      }
    }
    post_categories(order_by: { position: asc }) {
      id
      category {
        id
        name
        position
      }
    }
  }
`

const POST_COLLECTION_QUERY = getPostCollectionQuery(postFields)

type PostNode = hasura.GET_POST_COLLECTION['post'][number]

const composePostItem = (p: PostNode): PostCollectionItem => ({
  id: p.id,
  title: p.title,
  codeName: p.code_name || null,
  coverUrl: p.cover_url || null,
  videoUrl: p.video_url || null,
  publishedAt: p.published_at ? new Date(p.published_at) : null,
  views: Number(p.views),
  pinnedAt: p.pinned_at ? new Date(p.pinned_at) : null,
  author: {
    id: p.post_roles?.[0]?.id || '',
    memberId: p.post_roles?.[0]?.member?.id || '',
    name: p.post_roles?.[0]?.member?.name || '',
  },
  categories: p.post_categories.map(pc => ({
    id: pc.category.id,
    name: pc.category.name,
    position: pc.category.position,
  })),
})

const composeCollectionData = (data: hasura.GET_POST_COLLECTION): PostCollectionItem[] =>
  data.post.map(composePostItem)

const buildVariables = (source: PostCollectionSource): hasura.GET_POST_COLLECTIONVariables => {
  if (source.from === 'custom') {
    return {
      limit: undefined,
      orderByClause: [],
      whereClause: {
        id: { _in: source.idList || [] },
        published_at: { _lt: 'now()' },
      },
    }
  }
  if (source.from === 'popular') {
    return {
      limit: source.limit,
      orderByClause: [
        { views: (source.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
        { published_at: 'desc_nulls_last' as hasura.order_by },
      ],
      whereClause: {
        is_deleted: { _eq: false },
        published_at: { _lt: 'now()' },
        post_categories: source.defaultCategoryIds?.length
          ? { category_id: { _in: source.defaultCategoryIds } }
          : undefined,
        post_tags: source.defaultTagNames?.length
          ? { tag_name: { _in: source.defaultTagNames } }
          : undefined,
      },
    }
  }
  return {
    limit: source.limit,
    orderByClause: [
      { published_at: (source.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
    ],
    whereClause: {
      is_deleted: { _eq: false },
      published_at: { _lt: 'now()' },
      post_categories: source.defaultCategoryIds?.length
        ? { category_id: { _in: source.defaultCategoryIds } }
        : undefined,
      post_tags: source.defaultTagNames?.length
        ? { tag_name: { _in: source.defaultTagNames } }
        : undefined,
    },
  }
}

export const usePostCollection = (source: PostCollectionSource): UsePostCollectionResult => {
  const variables = useMemo(() => buildVariables(source), [source])
  const { data: rawData, loading, error } = useQuery<
    hasura.GET_POST_COLLECTION,
    hasura.GET_POST_COLLECTIONVariables
  >(POST_COLLECTION_QUERY, { variables })

  const composed = useMemo(() => {
    if (!rawData) return []
    // `custom` source: preserve the caller-supplied idList order (matches
    // the original collectCustomCollection behaviour — the query itself
    // returns rows in arbitrary order).
    if (source.from === 'custom') {
      const ordered: hasura.GET_POST_COLLECTION = {
        ...rawData,
        post: (source.idList || [])
          .map(id => rawData.post.find(p => p.id === id))
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
