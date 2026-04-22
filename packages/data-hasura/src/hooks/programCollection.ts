import { gql, useQuery } from '@apollo/client'
import { sum, uniq } from 'ramda'
import { useMemo } from 'react'
import { notEmpty } from '@lodestar/helpers'
import * as hasura from '@lodestar/graphql/hasura'
import { getProgramCollectionQuery } from '@lodestar/graphql/queries'
import { PeriodType, ProductRole } from '@lodestar/types/data'
import {
  ProductCurrentPriceSource,
  ProductCustomSource,
  ProductPublishedAtSource,
  ProductRecentWatchedSource,
} from '@lodestar/types/options'
import { ProgramCollectionItem } from '@lodestar/types/program'

export type ProgramCollectionSource =
  | ProductCustomSource
  | ProductPublishedAtSource
  | ProductCurrentPriceSource
  | ProductRecentWatchedSource
  | ProductPublishedAtSource<'popular'>

export type ProgramCollectionContext = {
  currentMemberId?: string | null
  enrolledProgramIds?: string[]
}

export type UseProgramCollectionResult = {
  data: ProgramCollectionItem[]
  loading: boolean
  error?: Error
}

const programFields = gql`
  fragment programFields on program {
    id
    cover_url
    cover_mobile_url
    cover_thumbnail_url
    title
    abstract
    list_price
    sale_price
    sold_at
    is_enrolled_count_visible
    views
    label
    label_color_type
    program_categories(order_by: { position: asc }) {
      category {
        id
        name
        position
      }
    }
    program_roles(where: { name: { _eq: "instructor" } }, order_by: { created_at: asc }) {
      id
      name
      member {
        id
        picture_url
        name
      }
    }
    program_plans(where: { published_at: { _is_null: false } }, order_by: [{ position: asc }, { created_at: asc }]) {
      id
      type
      title
      description
      gains
      currency {
        id
        label
        unit
        name
      }
      list_price
      sale_price
      sold_at
      discount_down_price
      period_amount
      period_type
      started_at
      ended_at
      is_participants_visible
      published_at
      auto_renewed
      is_primary
      published_at
      position
    }
    program_content_sections {
      program_contents {
        duration
      }
      program_contents_aggregate {
        aggregate {
          sum {
            duration
          }
        }
      }
    }
    program_statistics {
      program_id
      program_plan_enrolled_count
      program_package_plan_enrolled_count
    }
    review_publics_aggregate {
      aggregate {
        avg {
          score
        }
        count
      }
    }
  }
`

const PROGRAM_COLLECTION_QUERY = getProgramCollectionQuery(programFields)

const ENROLLED_PROGRAMS_QUERY = gql`
  query GET_ENROLLED_PROGRAMS($memberId: String) {
    program_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: program_id) {
      program_id
    }
    program_plan_enrollment(where: { member_id: { _eq: $memberId } }) {
      program_plan {
        id
        program_id
      }
    }
    program_content_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: program_id) {
      program_id
    }
  }
`

type ProgramNode = hasura.GET_PROGRAM_COLLECTION['program'][number]
type ProgramPlanNode = ProgramNode['program_plans'][number]

// Codegen for `GET_PROGRAM_COLLECTION` does not include `position` on
// `program_plan` despite the fragment selecting it, so widen structurally
// rather than resorting to `as any` at the read site.
type ProgramPlanWithPosition = ProgramPlanNode & { position?: number | null }

const composeCollectionData = (data: hasura.GET_PROGRAM_COLLECTION): ProgramCollectionItem[] =>
  data.program.map(p => ({
    id: p.id,
    title: p.title,
    abstract: p.abstract || '',
    coverUrl: p.cover_url || null,
    coverMobileUrl: p.cover_mobile_url || null,
    coverThumbnailUrl: p.cover_thumbnail_url || null,
    totalDuration: sum(
      p.program_content_sections.map(pcs => pcs.program_contents_aggregate.aggregate?.sum?.duration || 0),
    ),
    label: p.label || '',
    labelColorType: p.label_color_type || '',
    roles: p.program_roles.map(pr => ({
      id: pr.id,
      name: pr.name as ProductRole['name'],
      member: {
        id: pr.member?.id || '',
        name: pr.member?.name || '',
        pictureUrl: pr.member?.picture_url || null,
      },
    })),
    listPrice: p.list_price || 0,
    salePrice: p.sale_price,
    soldAt: p.sold_at ? new Date(p.sold_at) : null,
    isEnrolledCountVisible: p.is_enrolled_count_visible,
    plans: p.program_plans
      .filter(pp => pp.published_at)
      .map(pp => {
        const planWithPosition = pp as ProgramPlanWithPosition
        return {
          id: pp.id,
          listPrice: pp.list_price ?? null,
          salePrice: pp.sale_price ?? null,
          soldAt: pp.sold_at ? new Date(pp.sold_at) : null,
          publishedAt: pp.published_at ? new Date(pp.published_at) : null,
          autoRenewed: pp.auto_renewed || false,
          period:
            pp.period_amount && pp.period_type
              ? {
                  amount: Number(pp.period_amount),
                  type: pp.period_type as PeriodType,
                }
              : null,
          isPrimary: pp.is_primary,
          position: planWithPosition.position ?? 0,
        }
      }),
    categories: p.program_categories.map(pc => ({
      id: pc.category.id,
      name: pc.category.name,
      position: pc.category.position,
    })),
    historicalProgramPlanBuyers: p?.program_statistics?.program_plan_enrolled_count ?? null,
    historicalProgramPackagePlanBuyers: p?.program_statistics?.program_package_plan_enrolled_count ?? null,
    reviewAverageScore: p?.review_publics_aggregate.aggregate?.avg?.score || 0,
    reviewCount: p?.review_publics_aggregate.aggregate?.count || 0,
  }))

const buildVariables = (
  source: ProgramCollectionSource,
  context: ProgramCollectionContext,
): hasura.GET_PROGRAM_COLLECTIONVariables => {
  switch (source.from) {
    case 'custom': {
      return {
        limit: undefined,
        orderByClause: [],
        whereClause: {
          id: { _in: (source.idList || []).filter(id => id !== '') },
          is_private: { _eq: false },
          published_at: { _lt: 'now()' },
        },
      }
    }
    case 'popular': {
      return {
        limit: source.limit,
        orderByClause: [
          { views: (source.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
          { published_at: 'desc_nulls_last' as hasura.order_by },
        ],
        whereClause: {
          is_private: { _eq: false },
          published_at: { _lt: 'now()' },
          program_categories: source.defaultCategoryIds?.length
            ? { category_id: { _in: source.defaultCategoryIds } }
            : undefined,
          program_tags: source.defaultTagNames?.length
            ? { tag_name: { _in: source.defaultTagNames } }
            : undefined,
        },
      }
    }
    case 'currentPrice': {
      return {
        limit: source.limit,
        orderByClause: [
          { sale_price: (source.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
          { list_price: (source.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
        ],
        whereClause: {
          is_private: { _eq: false },
          published_at: { _lt: 'now()' },
          program_categories: source.defaultCategoryIds?.length
            ? { category_id: { _in: source.defaultCategoryIds } }
            : undefined,
          program_tags: source.defaultTagNames?.length
            ? { tag_name: { _in: source.defaultTagNames } }
            : undefined,
          _or: [
            {
              _and: [
                { _or: [{ sold_at: { _lte: 'now()' } }, { sold_at: { _is_null: true } }] },
                { list_price: { _gte: source.min, _lte: source.max } },
              ],
            },
            {
              _and: [
                { sold_at: { _gt: 'now()' } },
                { sale_price: { _gte: source.min, _lte: source.max } },
              ],
            },
          ],
        },
      }
    }
    case 'recentWatched': {
      return {
        limit: source.limit,
        orderByClause: [
          {
            program_content_progress_enrollments_aggregate: {
              max: { updated_at: (source.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
            },
          },
        ],
        whereClause: {
          id: { _in: context.enrolledProgramIds ?? [] },
          is_private: { _eq: false },
          published_at: { _lt: 'now()' },
          program_content_progress_enrollments: {
            member_id: { _eq: context.currentMemberId ?? '' },
          },
          program_categories: source.defaultCategoryIds?.length
            ? { category_id: { _in: source.defaultCategoryIds } }
            : undefined,
          program_tags: source.defaultTagNames?.length
            ? { tag_name: { _in: source.defaultTagNames } }
            : undefined,
        },
      }
    }
    case 'publishedAt':
    default: {
      return {
        limit: source.limit,
        orderByClause: [
          { published_at: (source.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
        ],
        whereClause: {
          is_private: { _eq: false },
          published_at: { _lt: 'now()' },
          program_categories: source.defaultCategoryIds?.length
            ? { category_id: { _in: source.defaultCategoryIds } }
            : undefined,
          program_tags: source.defaultTagNames?.length
            ? { tag_name: { _in: source.defaultTagNames } }
            : undefined,
        },
      }
    }
  }
}

export const useProgramCollection = (
  source: ProgramCollectionSource,
  context: ProgramCollectionContext = {},
): UseProgramCollectionResult => {
  const variables = useMemo(() => buildVariables(source, context), [source, context])
  const { data: rawData, loading, error } = useQuery<
    hasura.GET_PROGRAM_COLLECTION,
    hasura.GET_PROGRAM_COLLECTIONVariables
  >(PROGRAM_COLLECTION_QUERY, { variables })

  const composed = useMemo(() => {
    if (!rawData) return []
    // `custom` source: preserve the caller-supplied idList order (matches
    // the original collectCustomCollection behaviour — the query itself
    // returns rows in arbitrary order).
    if (source.from === 'custom') {
      const ordered: hasura.GET_PROGRAM_COLLECTION = {
        ...rawData,
        program: (source.idList || [])
          .map(id => rawData.program.find(p => p.id === id))
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

export type UseEnrolledProgramIdsResult = {
  enrolledProgramIds: string[]
  loadingProgramIds: boolean
  errorProgramIds?: Error
  refetchProgramIds: () => void
}

export const useEnrolledProgramIds = (
  memberId: string | null | undefined,
  options: { skip?: boolean } = {},
): UseEnrolledProgramIdsResult => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_PROGRAMS,
    hasura.GET_ENROLLED_PROGRAMSVariables
  >(ENROLLED_PROGRAMS_QUERY, {
    skip: options.skip || !memberId,
    variables: { memberId: memberId ?? null },
    fetchPolicy: 'no-cache',
  })

  const enrolledProgramIds = useMemo(
    () =>
      loading || error || !data
        ? []
        : uniq([
            ...data.program_enrollment.map(e => e.program_id),
            ...data.program_plan_enrollment.map(e => e.program_plan?.program_id || ''),
            ...data.program_content_enrollment.map(e => e.program_id),
          ]),
    [data, loading, error],
  )

  return {
    enrolledProgramIds,
    errorProgramIds: error && new Error(error.message),
    loadingProgramIds: loading,
    refetchProgramIds: () => {
      refetch()
    },
  }
}
