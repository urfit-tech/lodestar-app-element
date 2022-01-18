import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'
import { sum, uniqBy } from 'ramda'
import { useHistory } from 'react-router'
import { StringParam } from 'serialize-query-params'
import { DeepPick } from 'ts-deep-pick/lib'
import { useQueryParam } from 'use-query-params'
import { getProgramCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import { Category, PeriodType, ProductRole, Program } from '../../types/data'
import { ElementComponent } from '../../types/element'
import { ProductCurrentPriceSource, ProductCustomSource, ProductPublishedAtSource } from '../../types/options'
import ProgramCard from '../cards/ProgramCard'
import ProgramSecondaryCard from '../cards/ProgramSecondaryCard'
import Collection, { CollectionLayout, ContextCollection } from '../collections/Collection'
import CategorySelector from '../common/CategorySelector'

// @ts-ignore
type ProgramData = DeepPick<
  Program,
  | 'id'
  | 'title'
  | 'abstract'
  | 'coverUrl'
  | 'totalDuration'
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
  source?: ProductCustomSource | ProductPublishedAtSource | ProductCurrentPriceSource
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
}
const ProgramCollection: ElementComponent<ProgramCollectionProps> = props => {
  const history = useHistory()
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)

  const { loading, errors, children, source = { from: 'publishedAt' } } = props
  if (loading || errors) {
    return null
  }

  const ElementCollection = Collection('program', props.variant === 'card' ? ProgramCard : ProgramSecondaryCard)
  let ContextCollection: ProgramContextCollection
  switch (source.from) {
    case 'publishedAt':
      ContextCollection = collectPublishedAtCollection(source)
      break
    case 'currentPrice':
      ContextCollection = collectCurrentPriceCollection(source)
      break
    case 'custom':
      ContextCollection = collectCustomCollection(source)
      break
    default:
      ContextCollection = collectPublishedAtCollection(source)
  }

  return (
    <ContextCollection>
      {ctx => {
        const categories =
          ctx.loading || ctx.errors
            ? []
            : uniqBy((category: Category) => category.id)(
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
            {props.withSelector && (
              <CategorySelector
                categories={categories}
                activeCategoryId={activeCategoryId || null}
                onActive={categoryId => setActive(categoryId)}
              />
            )}
            {children}
            {ctx.loading ? (
              <ElementCollection layout={props.layout} loading />
            ) : ctx.errors ? (
              <ElementCollection layout={props.layout} errors={ctx.errors} />
            ) : (
              <ElementCollection
                layout={props.layout}
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
                      coverUrl={program.coverUrl}
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

const collectCustomCollection = (options: ProductCustomSource) => {
  const ProgramElementCollection: ProgramContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_PROGRAM_COLLECTION, hasura.GET_PROGRAM_COLLECTIONVariables>(
      getProgramCollectionQuery(programFields),
      {
        variables: {
          limit: undefined,
          orderByClause: [],
          whereClause: {
            id: { _in: options.idList || [] },
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

const composeCollectionData = (data: hasura.GET_PROGRAM_COLLECTION): ProgramData[] =>
  data.program.map(p => ({
    id: p.id,
    title: p.title,
    abstract: p.abstract || '',
    coverUrl: p.cover_url,
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
    plans: p.program_plans
      .filter(pp => pp.published_at)
      .map(pp => ({
        id: pp.id,
        listPrice: pp.list_price,
        salePrice: pp.sale_price,
        soldAt: pp.sold_at && new Date(pp.sold_at),
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
    categories: p.program_categories.map(pc => ({ id: pc.category.id, name: pc.category.name })),
  }))

const programFields = gql`
  fragment programFields on program {
    id
    cover_url
    title
    abstract
    list_price
    sale_price
    sold_at
    program_categories {
      category {
        id
        name
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
