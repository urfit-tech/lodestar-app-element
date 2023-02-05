import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'
import { pipe, prop, sortBy, sum, uniq, uniqBy } from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import { StringParam } from 'serialize-query-params'
import { DeepPick } from 'ts-deep-pick/lib'
import { useQueryParam } from 'use-query-params'
import { useAuth } from '../../contexts/AuthContext'
import { getProgramCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { convertPathName, notEmpty } from '../../helpers'
import { Category, PeriodType, ProductRole, Program } from '../../types/data'
import { ElementComponent } from '../../types/element'
import {
  ProductCurrentPriceSource,
  ProductCustomSource,
  ProductPublishedAtSource,
  ProductRecentWatchedSource,
} from '../../types/options'
import ProgramPrimaryCard from '../cards/ProgramPrimaryCard'
import ProgramSecondaryCard from '../cards/ProgramSecondaryCard'
import Collection, { CollectionLayout, ContextCollection } from '../collections/Collection'
import { BaseCarouselProps } from '../common/BaseCarousel'
import CategorySelector from '../common/CategorySelector'
import OrderSelector from '../common/OrderSelector'
import CollectionCarousel from './CollectionCarousel'
import collectionsMessages from './translation'

// @ts-ignore
type ProgramData = DeepPick<
  Program,
  | 'id'
  | 'title'
  | 'abstract'
  | 'coverUrl'
  | 'coverMobileUrl'
  | 'coverThumbnailUrl'
  | 'totalDuration'
  | 'isEnrolledCountVisible'
  | 'roles.[].name'
  | 'roles.[].member.id'
  | 'listPrice'
  | 'salePrice'
  | 'soldAt'
  | 'plans.[].!title'
  | 'categories'
>
type ProgramContextCollection = ContextCollection<ProgramData>

export type ProgramCollectionProps = {
  name?: string
  source?:
    | ProductCustomSource
    | ProductPublishedAtSource
    | ProductCurrentPriceSource
    | ProductRecentWatchedSource
    | ProductPublishedAtSource<'popular'>
  variant?: 'primary' | 'secondary'
  layout?: CollectionLayout
  withSelector?: boolean
  withOrderSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
}
const ProgramCollection: ElementComponent<ProgramCollectionProps> = props => {
  const history = useHistory()
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)
  const { currentMemberId } = useAuth()
  const { formatMessage } = useIntl()
  const { loading, errors, children, source = { from: 'publishedAt' } } = props
  const [sourceFrom, setSourceFrom] = useState(source.from)
  const { enrolledProgramIds, loadingProgramIds } = useEnrolledProgramIds(currentMemberId, {
    skip: source.from !== 'recentWatched',
  })

  useEffect(() => {
    if (source.from !== sourceFrom) {
      setSourceFrom(source.from)
    }
  }, [source])

  if (loading || errors) {
    return null
  }

  const collectionName = props.name || convertPathName(window.location.pathname)
  const EntityElement =
    props.variant === 'primary'
      ? ProgramPrimaryCard
      : props.variant === 'secondary'
      ? ProgramSecondaryCard
      : ProgramPrimaryCard
  let emptyText = ''
  switch (source.from) {
    case 'recentWatched':
      emptyText = formatMessage(collectionsMessages.ProgramCollection.recentWatchedEmpty)
      break
  }
  const ElementCollection =
    props.collectionVariant === 'carousel'
      ? CollectionCarousel(collectionName, 'program', EntityElement)
      : Collection(collectionName, 'program', EntityElement, emptyText)
  let ContextCollection: ProgramContextCollection
  switch (sourceFrom) {
    case 'publishedAt':
      if (source.from === 'custom') {
        ContextCollection = collectPublishedAtCollection({ from: sourceFrom, limit: 4 })
      } else {
        ContextCollection = collectPublishedAtCollection({ ...source, from: sourceFrom })
      }
      break
    case 'popular':
      if (source.from === 'custom') {
        ContextCollection = collectPopularCollection({ from: sourceFrom, limit: 4 })
      } else {
        ContextCollection = collectPopularCollection({ ...source, from: sourceFrom })
      }
      break
    case 'currentPrice':
      if (source.from === 'custom') {
        ContextCollection = collectCurrentPriceCollection({ from: sourceFrom, limit: 4 })
      } else {
        ContextCollection = collectCurrentPriceCollection({ ...source, from: sourceFrom })
      }
      break
    case 'recentWatched':
      if (source.from === 'custom') {
        ContextCollection = collectRecentWatchedCollection({
          ...source,
          from: sourceFrom,
          limit: 4,
          enrolledProgramIds,
          currentMemberId: currentMemberId || '',
        })
      } else {
        ContextCollection = collectRecentWatchedCollection({
          ...source,
          from: sourceFrom,
          enrolledProgramIds,
          currentMemberId: currentMemberId || '',
        })
      }
      break
    case 'custom':
      ContextCollection = collectCustomCollection({ ...source, from: sourceFrom })
      break
    default:
      if (source.from === 'custom') {
        ContextCollection = collectPublishedAtCollection({ from: sourceFrom, limit: 4 })
      } else {
        ContextCollection = collectPublishedAtCollection({ ...source, from: sourceFrom, limit: source?.limit || 4 })
      }
      break
  }

  return (
    <ContextCollection>
      {ctx => {
        const categories =
          ctx.loading || ctx.errors
            ? []
            : pipe(
                uniqBy((category: Category) => category.id),
                sortBy(prop('position')),
              )(
                ctx.data
                  ?.flatMap(d => d.categories)
                  .filter(category => source.from === 'custom' || !source.defaultCategoryIds?.includes(category.id)) ||
                  [],
              )

        const programFilter = (d: ProgramData) =>
          !props.withSelector ||
          !activeCategoryId ||
          d.categories.map(category => category.id).includes(activeCategoryId)

        return (
          <div className={props.className}>
            <div className="d-flex justify-content-between">
              <div>
                {props.withSelector && (
                  <CategorySelector
                    categories={categories}
                    activeCategoryId={activeCategoryId || null}
                    onActive={categoryId => setActive(categoryId)}
                  />
                )}
              </div>
              <div>
                {props.withOrderSelector && (
                  <OrderSelector
                    sourceFrom={sourceFrom}
                    withOrderSelector={props.withOrderSelector}
                    onChange={sourceFrom => setSourceFrom(sourceFrom)}
                  />
                )}
              </div>
            </div>
            {children}
            {ctx.loading || loadingProgramIds ? (
              <ElementCollection layout={props.layout} carouselProps={props.carousel} loading />
            ) : ctx.errors ? (
              <ElementCollection layout={props.layout} carouselProps={props.carousel} errors={ctx.errors} />
            ) : (
              <ElementCollection
                layout={props.layout}
                carouselProps={props.carousel}
                data={ctx.data?.filter(programFilter) || []}
                renderElement={({ data: program, ElementComponent: ProgramElement, onClick }) => {
                  const primaryProgramPlan = program.plans[0] || null
                  return (
                    <ProgramElement
                      editing={props.editing}
                      id={program.id}
                      title={program.title}
                      abstract={program.abstract || ''}
                      totalDuration={program.totalDuration || 0}
                      coverUrl={program.coverThumbnailUrl || program.coverMobileUrl || program.coverUrl}
                      instructorIds={program.roles.map(programRole => programRole.member.id)}
                      salePrice={
                        typeof primaryProgramPlan?.salePrice === 'number' &&
                        primaryProgramPlan?.soldAt &&
                        moment() < moment(primaryProgramPlan.soldAt)
                          ? primaryProgramPlan.salePrice
                          : undefined
                      }
                      listPrice={primaryProgramPlan?.listPrice}
                      period={primaryProgramPlan?.period || undefined}
                      isEnrolledCountVisible={program.isEnrolledCountVisible}
                      categories={program.categories}
                      onClick={() => {
                        onClick?.()
                        !props.editing && history.push(`/programs/${program.id}`)
                      }}
                    />
                  )
                }}
              />
            )}
          </div>
        )
      }}
    </ContextCollection>
  )
}

const useEnrolledProgramIds = (memberId: string | null, options?: { skip?: boolean }) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_PROGRAMS,
    hasura.GET_ENROLLED_PROGRAMSVariables
  >(
    gql`
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
    `,
    {
      skip: options?.skip || !memberId,
      variables: { memberId },
      fetchPolicy: 'no-cache',
    },
  )

  const enrolledProgramIds =
    loading || error || !data
      ? []
      : uniq([
          ...data.program_enrollment.map(enrollment => enrollment.program_id),
          ...data.program_plan_enrollment.map(enrollment => enrollment.program_plan?.program_id || ''),
          ...data.program_content_enrollment.map(enrollment => enrollment.program_id),
        ])

  return {
    enrolledProgramIds: loading || error ? [] : enrolledProgramIds,
    errorProgramIds: error,
    loadingProgramIds: loading,
    refetchProgramIds: refetch,
  }
}

const collectCustomCollection = (options: ProductCustomSource) => {
  const idList = (options.idList || []).filter(id => id !== '')
  const ProgramElementCollection: ProgramContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_PROGRAM_COLLECTION, hasura.GET_PROGRAM_COLLECTIONVariables>(
      getProgramCollectionQuery(programFields),
      {
        variables: {
          limit: undefined,
          orderByClause: [],
          whereClause: {
            id: { _in: idList },
            is_private: { _eq: false },
            published_at: { _lt: 'now()' },
          },
        },
      },
    )
    const programCollectionData =
      data &&
      composeCollectionData({
        ...data,
        program: (options.idList || [])
          .filter(programId => data?.program.find(p => p.id === programId))
          .map(programId => data?.program.find(p => p.id === programId))
          .filter(notEmpty),
      })

    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: programCollectionData,
    })
  }
  return ProgramElementCollection
}

const collectPublishedAtCollection = (options: ProductPublishedAtSource) => {
  const ProgramElementCollection: ProgramContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_PROGRAM_COLLECTION, hasura.GET_PROGRAM_COLLECTIONVariables>(
      getProgramCollectionQuery(programFields),
      {
        variables: {
          limit: options.limit,
          orderByClause: [{ published_at: (options.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by }],
          whereClause: {
            is_private: { _eq: false },
            published_at: { _lt: 'now()' },
            program_categories: options.defaultCategoryIds?.length
              ? {
                  category_id: {
                    _in: options.defaultCategoryIds,
                  },
                }
              : undefined,
            program_tags: options.defaultTagNames?.length
              ? {
                  tag_name: {
                    _in: options.defaultTagNames,
                  },
                }
              : undefined,
          },
        },
      },
    )
    const composedData = data ? composeCollectionData(data) : []

    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: composedData,
    })
  }
  return ProgramElementCollection
}

const collectPopularCollection = (options: ProductPublishedAtSource<'popular'>) => {
  const ProgramElementCollection: ProgramContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_PROGRAM_COLLECTION, hasura.GET_PROGRAM_COLLECTIONVariables>(
      getProgramCollectionQuery(programFields),
      {
        variables: {
          limit: options.limit,
          orderByClause: [
            { views: (options.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
            { published_at: 'desc_nulls_last' as hasura.order_by },
          ],
          whereClause: {
            is_private: { _eq: false },
            published_at: { _lt: 'now()' },
            program_categories: options.defaultCategoryIds?.length
              ? {
                  category_id: {
                    _in: options.defaultCategoryIds,
                  },
                }
              : undefined,
            program_tags: options.defaultTagNames?.length
              ? {
                  tag_name: {
                    _in: options.defaultTagNames,
                  },
                }
              : undefined,
          },
        },
      },
    )
    const composedData = data ? composeCollectionData(data) : []

    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: composedData,
    })
  }
  return ProgramElementCollection
}

const collectCurrentPriceCollection = (options: ProductCurrentPriceSource) => {
  const ProgramElementCollection: ProgramContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_PROGRAM_COLLECTION, hasura.GET_PROGRAM_COLLECTIONVariables>(
      getProgramCollectionQuery(programFields),
      {
        variables: {
          limit: options.limit,
          orderByClause: [
            { sale_price: (options.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
            { list_price: (options.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
          ],
          whereClause: {
            is_private: { _eq: false },
            published_at: { _lt: 'now()' },
            program_categories: options.defaultCategoryIds?.length
              ? {
                  category_id: {
                    _in: options.defaultCategoryIds,
                  },
                }
              : undefined,
            program_tags: options.defaultTagNames?.length
              ? {
                  tag_name: {
                    _in: options.defaultTagNames,
                  },
                }
              : undefined,
            _or: [
              {
                _and: [
                  { _or: [{ sold_at: { _lte: 'now()' } }, { sold_at: { _is_null: true } }] },
                  { list_price: { _gte: options.min, _lte: options.max } },
                ],
              },
              { _and: [{ sold_at: { _gt: 'now()' } }, { sale_price: { _gte: options.min, _lte: options.max } }] },
            ],
          },
        },
      },
    )
    const composedData = data ? composeCollectionData(data) : []

    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: composedData,
    })
  }
  return ProgramElementCollection
}

const collectRecentWatchedCollection = (options: ProductRecentWatchedSource) => {
  const ProgramElementCollection: ProgramContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_PROGRAM_COLLECTION, hasura.GET_PROGRAM_COLLECTIONVariables>(
      getProgramCollectionQuery(programFields),
      {
        variables: {
          limit: options.limit,
          orderByClause: [
            {
              program_content_progress_enrollments_aggregate: {
                max: { updated_at: (options.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
              },
            },
          ],
          whereClause: {
            id: { _in: options.enrolledProgramIds },
            is_private: { _eq: false },
            published_at: { _lt: 'now()' },
            program_content_progress_enrollments: {
              member_id: { _eq: options.currentMemberId },
            },
            program_categories: options.defaultCategoryIds?.length
              ? {
                  category_id: {
                    _in: options.defaultCategoryIds,
                  },
                }
              : undefined,
            program_tags: options.defaultTagNames?.length
              ? {
                  tag_name: {
                    _in: options.defaultTagNames,
                  },
                }
              : undefined,
          },
        },
      },
    )
    const composedData = data ? composeCollectionData(data) : []

    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: composedData,
    })
  }
  return ProgramElementCollection
}

const composeCollectionData = (data: hasura.GET_PROGRAM_COLLECTION): ProgramData[] =>
  data.program.map(p => ({
    id: p.id,
    title: p.title,
    abstract: p.abstract || '',
    coverUrl: p.cover_url,
    coverMobileUrl: p.cover_mobile_url,
    coverThumbnailUrl: p.cover_thumbnail_url,
    totalDuration: sum(
      p.program_content_sections.map(pcs => pcs.program_contents_aggregate.aggregate?.sum?.duration || 0),
    ),
    roles: p.program_roles.map(pr => ({
      id: pr.id,
      name: pr.name as ProductRole['name'],
      member: { id: pr.member_id },
    })),
    listPrice: p.list_price || 0,
    salePrice: p.sale_price,
    soldAt: p.sold_at && new Date(p.sold_at),
    isEnrolledCountVisible: p.is_enrolled_count_visible,
    plans: p.program_plans
      .filter(pp => pp.published_at)
      .map(pp => ({
        id: pp.id,
        listPrice: pp.list_price,
        salePrice: pp.sale_price,
        soldAt: pp.sold_at && new Date(pp.sold_at),
        publishedAt: pp.published_at && new Date(pp.published_at),
        autoRenewed: pp.auto_renewed || false,
        period:
          pp.period_amount && pp.period_type
            ? {
                amount: Number(pp.period_amount),
                type: pp.period_type as PeriodType,
              }
            : null,
        isPrimary: pp.is_primary,
      })),
    categories: p.program_categories.map(pc => ({
      id: pc.category.id,
      name: pc.category.name,
      position: pc.category.position,
    })),
  }))

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
      member_id
    }
    program_plans {
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
  }
`

export default ProgramCollection
