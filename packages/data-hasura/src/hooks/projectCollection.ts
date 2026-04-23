import { gql, useQuery } from '@apollo/client'
import { sum } from 'ramda'
import { useMemo } from 'react'
import { notEmpty } from '@lodestar/helpers'
import * as hasura from '@lodestar/graphql/hasura'
import { getProjectCollectionQuery } from '@lodestar/graphql/queries'
import { Project } from '@lodestar/types/data'
import { ProductCustomSource, ProductPublishedAtSource } from '@lodestar/types/options'
import { ProjectCollectionItem } from '@lodestar/types/project'

export type ProjectCollectionSource =
  | ProductPublishedAtSource
  | ProductPublishedAtSource<'popular'>
  | ProductCustomSource

export type UseProjectCollectionOptions = {
  // `type` filters the Hasura `where.type` clause for all three source
  // branches. It is threaded as a hook option rather than folded into the
  // `ProjectCollectionSource` union because it is orthogonal to the source
  // discriminator and matches how the original UI read `props.type` from a
  // separate top-level prop before branching on `source.from`.
  type?: Project['type']
}

export type UseProjectCollectionResult = {
  data: ProjectCollectionItem[]
  loading: boolean
  error?: Error
}

const projectFields = gql`
  fragment projectFields on project {
    id
    title
    abstract
    cover_url
    cover_type
    preview_url
    type
    target_amount
    target_unit
    expired_at
    is_participants_visible
    is_countdown_timer_visible
    creator_id
    author: project_roles(where: { identity: { name: { _eq: "author" } } }) {
      id
      member {
        id
      }
    }
    project_sales {
      total_sales
    }
    project_plans {
      project_plan_enrollments_aggregate {
        aggregate {
          count
        }
      }
    }
    project_categories {
      category {
        id
        name
      }
    }
  }
`

const PROJECT_COLLECTION_QUERY = getProjectCollectionQuery(projectFields)

type ProjectNode = hasura.GET_PROJECT_COLLECTION['project'][number]

const composeProjectItem = (p: ProjectNode): ProjectCollectionItem => ({
  id: p.id,
  title: p.title,
  abstract: p.abstract || '',
  coverUrl: p.cover_url || null,
  coverType: (p.cover_type as ProjectCollectionItem['coverType']) ?? 'image',
  previewUrl: p.preview_url || null,
  type: p.type as ProjectCollectionItem['type'],
  target: {
    amount: p.target_amount,
    unit: p.target_unit as ProjectCollectionItem['target']['unit'],
  },
  expiredAt: p.expired_at ? new Date(p.expired_at) : null,
  isParticipantsVisible: p.is_participants_visible,
  isCountdownTimerVisible: p.is_countdown_timer_visible,
  totalSales: p.project_sales?.total_sales || 0,
  enrollmentCount: sum(p.project_plans.map((pp) => pp.project_plan_enrollments_aggregate.aggregate?.count || 0)),
  categories: p.project_categories.map((pc) => ({
    id: pc.category.id,
    name: pc.category.name,
  })),
  creatorId: p.creator_id || null,
  authorId: p.author[0]?.member?.id,
})

const composeCollectionData = (data: hasura.GET_PROJECT_COLLECTION): ProjectCollectionItem[] =>
  data.project.map(composeProjectItem)

const buildVariables = (
  source: ProjectCollectionSource,
  type: Project['type'] | undefined,
): hasura.GET_PROJECT_COLLECTIONVariables => {
  if (source.from === 'custom') {
    return {
      limit: undefined,
      orderByClause: [],
      whereClause: {
        id: { _in: source.idList || [] },
        type: { _eq: type },
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
        type: { _eq: type },
        published_at: { _lt: 'now()' },
        project_categories: source.defaultCategoryIds?.length
          ? { category_id: { _in: source.defaultCategoryIds } }
          : undefined,
      },
    }
  }
  return {
    limit: source.limit,
    orderByClause: [{ published_at: (source.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by }],
    whereClause: {
      type: { _eq: type },
      published_at: { _lt: 'now()' },
      project_categories: source.defaultCategoryIds?.length
        ? { category_id: { _in: source.defaultCategoryIds } }
        : undefined,
    },
  }
}

export const useProjectCollection = (
  source: ProjectCollectionSource,
  options?: UseProjectCollectionOptions,
): UseProjectCollectionResult => {
  const type = options?.type
  const variables = useMemo(() => buildVariables(source, type), [source, type])
  const {
    data: rawData,
    loading,
    error,
  } = useQuery<hasura.GET_PROJECT_COLLECTION, hasura.GET_PROJECT_COLLECTIONVariables>(PROJECT_COLLECTION_QUERY, {
    variables,
  })

  const composed = useMemo(() => {
    if (!rawData) return []
    // `custom` source: preserve the caller-supplied idList order (matches
    // the original collectCustomCollection behaviour — the query itself
    // returns rows in arbitrary order).
    if (source.from === 'custom') {
      const ordered: hasura.GET_PROJECT_COLLECTION = {
        ...rawData,
        project: (source.idList || []).map((id) => rawData.project.find((p) => p.id === id)).filter(notEmpty),
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
