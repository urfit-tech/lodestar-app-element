import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'
import { sum } from 'ramda'
import { DeepPick } from 'ts-deep-pick/lib'
import { getProgramCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import { PeriodType, ProductRole, Program } from '../../types/data'
import { ProgramElementProps } from '../../types/element'
import { CurrentPriceSourceOptions, CustomSourceOptions, PublishedAtSourceOptions } from '../../types/options'
import Collection, { ElementCollection } from '../collections/Collection'

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
type ProgramCollectionData = ProgramData[]
type ProgramCollection<T> = (
  Element: React.ElementType<ProgramElementProps>,
) => (options: T) => ProgramElementCollection
export type ProgramElementCollection = ElementCollection<ProgramData>

export const CustomProgramCollection: ProgramCollection<CustomSourceOptions> = Element => options => {
  const ProgramElementCollection: ProgramElementCollection = props => {
    const { data, loading } = useQuery<hasura.GET_PROGRAM_COLLECTION, hasura.GET_PROGRAM_COLLECTIONVariables>(
      getProgramCollectionQuery(programFields),
      {
        variables: {
          limit: undefined,
          orderByClause: [],
          whereClause: {
            id: { _in: options.idList },
            is_private: { _eq: false },
            published_at: { _is_null: false },
          },
        },
      },
    )
    const orderedData = {
      ...data,
      program: options.idList
        .filter(programId => data?.program.find(p => p.id === programId))
        .map(programId => data?.program.find(p => p.id === programId))
        .filter(notEmpty),
    }
    const ElementCollection = Collection({
      Element,
      data: data ? composeCollectionData(orderedData) : [],
      mapDataToProps: program => (loading ? { loading } : mapProgramToProps(program)),
    })
    return <ElementCollection {...props} />
  }
  return ProgramElementCollection
}

export const PublishedAtProgramCollection: ProgramCollection<PublishedAtSourceOptions> = Element => options => {
  const ProgramElementCollection: ProgramElementCollection = props => {
    const { data, loading } = useQuery<hasura.GET_PROGRAM_COLLECTION, hasura.GET_PROGRAM_COLLECTIONVariables>(
      getProgramCollectionQuery(programFields),
      {
        variables: {
          limit: options.limit,
          orderByClause: [{ published_at: (options.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by }],
          whereClause: {
            is_private: { _eq: false },
            published_at: { _is_null: false },
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
    const ElementCollection = Collection({
      Element,
      data: data ? composeCollectionData(data) : [],
      mapDataToProps: program => (loading ? { loading } : mapProgramToProps(program)),
    })
    return <ElementCollection {...props} />
  }
  return ProgramElementCollection
}

export const CurrentPriceProgramCollection: ProgramCollection<CurrentPriceSourceOptions> = Element => options => {
  const ProgramElementCollection: ProgramElementCollection = props => {
    const { data, loading } = useQuery<hasura.GET_PROGRAM_COLLECTION, hasura.GET_PROGRAM_COLLECTIONVariables>(
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
            published_at: { _is_null: false },
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
    const ElementCollection = Collection({
      Element,
      data: data ? composeCollectionData(data) : [],
      mapDataToProps: program => (loading ? { loading } : mapProgramToProps(program)),
    })
    return <ElementCollection {...props} />
  }
  return ProgramElementCollection
}

const composeCollectionData = (data: hasura.GET_PROGRAM_COLLECTION): ProgramCollectionData =>
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
    soldAt: p.sold_at,
    plans: p.program_plans.map(pp => ({
      id: pp.id,
      listPrice: pp.list_price,
      salePrice: pp.sale_price,
      soldAt: pp.sold_at,
      autoRenewed: pp.auto_renewed || false,
      period:
        pp.period_amount && pp.period_type
          ? {
              amount: Number(pp.period_amount),
              type: pp.period_type as PeriodType,
            }
          : null,
    })),
    categories: p.program_categories.map(pc => ({ id: pc.category.id, name: pc.category.name })),
  }))

const mapProgramToProps = (program: ProgramData) => ({
  id: program.id,
  title: program.title,
  abstract: program.abstract || '',
  totalDuration: program.totalDuration || 0,
  coverUrl: program.coverUrl,
  instructorIds: program.roles.map(programRole => programRole.member.id),
  listPrice: program.soldAt && moment() < moment(program.soldAt) ? program.listPrice : undefined,
  currentPrice: program.soldAt && moment() < moment(program.soldAt) ? program.salePrice || 0 : program.listPrice,
  period: program.plans[0]?.period || undefined,
})

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
    program_roles(where: { name: { _eq: "instructor" } }) {
      id
      name
      member_id
    }
    program_plans(order_by: { created_at: asc }, limit: 1) {
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
      program_plan_enrollments_aggregate {
        aggregate {
          count
        }
      }
    }
    program_enrollments_aggregate {
      aggregate {
        count
      }
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
