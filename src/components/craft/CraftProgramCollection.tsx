import { useQuery } from '@apollo/react-hooks'
import { SimpleGrid } from '@chakra-ui/react'
import { useEditor, useNode, UserComponent } from '@craftjs/core'
import gql from 'graphql-tag'
import { repeat, sum } from 'ramda'
import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { DeepPick } from 'ts-deep-pick'
import { getProgramCollectionQuery } from '../../graphql/queries'
import hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import { CraftCollectionBaseOptions } from '../../types/craft'
import { Program, ProgramRole } from '../../types/program'
import { PlanPeriod } from '../../types/shared'
import ProgramCard from '../cards/ProgramCard'
import { CraftRefBlock } from '../common'

export type CraftProgramCollectionProps = CraftCollectionBaseOptions & {
  options:
    | {
        source: 'custom'
        idList: string[]
      }
    | {
        source: 'publishedAt'
        limit?: number
        asc?: boolean
        defaultTagNames?: string[]
        defaultCategoryIds?: string[]
      }
    | {
        source: 'currentPrice'
        limit?: number
        asc?: boolean
        min?: number
        max?: number
        defaultTagNames?: string[]
        defaultCategoryIds?: string[]
      }
  withSelector?: boolean
}
const CraftProgramCollection: UserComponent<CraftProgramCollectionProps> = ({
  options,
  gutter = 4,
  columns = [1, 2, null, 4],
  withSelector,
  children,
}) => {
  const { formatMessage } = useIntl()
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled,
  }))
  const {
    connectors: { connect },
    selected,
    hovered,
  } = useNode(node => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }))
  const { loading, programs } = useProgramCollection(options)
  return (
    <SimpleGrid columns={columns} spacing={gutter}>
      {loading && repeat(<ProgramCard loading />, 12)}
      {programs.map(program => (
        <CraftRefBlock
          ref={ref => ref && connect(ref)}
          style={{
            width: '100%',
            marginBottom: '30px',
          }}
          events={{ hovered, selected }}
          options={{ enabled }}
        >
          <ProgramCard
            craftEnabled={enabled}
            id={program.id}
            title={program.title}
            abstract={program.abstract || ''}
            totalDuration={program.totalDuration || 0}
            coverUrl={program.coverUrl}
            instructorIds={program.roles.map(programRole => programRole.member.id)}
            listPrice={program.listPrice || 0}
            salePrice={program.salePrice}
            soldAt={program.soldAt}
            period={program.plans[0]?.period || null}
          />
        </CraftRefBlock>
      ))}
    </SimpleGrid>
  )
}

const programFields = gql`
  fragment programFields on program {
    id
    cover_url
    title
    abstract
    list_price
    sale_price
    sold_at
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
const useProgramCollection = (options: CraftProgramCollectionProps['options']) => {
  const variables: hasura.GET_PROGRAM_COLLECTIONVariables = {
    limit: undefined,
    orderByClause: [],
    whereClause: {
      is_private: { _eq: false },
      published_at: { _is_null: false },
    },
  }
  switch (options.source) {
    case 'publishedAt':
      variables.limit = options.limit
      variables.orderByClause = [
        ...(variables.orderByClause || []),
        { published_at: (options.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
      ]
      variables.whereClause = {
        ...variables.whereClause,
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
      }
      break
    case 'currentPrice':
      variables.limit = options.limit
      variables.orderByClause = [
        ...(variables.orderByClause || []),
        { sale_price: (options.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
        { list_price: (options.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by },
      ]
      variables.whereClause = {
        ...variables.whereClause,
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
      }
      break
    case 'custom':
      variables.whereClause = {
        ...variables.whereClause,
        id: { _in: options.idList },
      }
      break
  }

  const { data: queryResult, loading } = useQuery<
    hasura.GET_PROGRAM_COLLECTION,
    hasura.GET_PROGRAM_COLLECTIONVariables
  >(getProgramCollectionQuery(programFields), { variables })

  const programs: DeepPick<
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
    | 'plans'
  >[] = useMemo(() => {
    const data =
      options.source === 'custom'
        ? {
            ...queryResult,
            program: options.idList
              .filter(programId => queryResult?.program.find(p => p.id === programId))
              .map(programId => queryResult?.program.find(p => p.id === programId))
              .filter(notEmpty),
          }
        : queryResult
    return (
      data?.program.map(p => ({
        id: p.id,
        title: p.title,
        abstract: p.abstract || '',
        coverUrl: p.cover_url,
        totalDuration: sum(
          p.program_content_sections.map(pcs => pcs.program_contents_aggregate.aggregate?.sum?.duration || 0),
        ),
        roles: p.program_roles.map(pr => ({
          id: pr.id,
          name: pr.name as ProgramRole['name'],
          member: { id: pr.member_id },
        })),
        listPrice: p.list_price,
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
              ? ({
                  amount: pp.period_amount,
                  type: pp.period_type,
                } as PlanPeriod)
              : null,
        })),
      })) || []
    )
  }, [options, queryResult])
  return { loading, programs }
}

const withReviews = (options?: {}) => <T extends object>(WrappedComponent: React.VFC<T & { reviews: string[] }>) => {
  const ComponentWithReviews: React.VFC<T> = props => {
    return React.createElement(WrappedComponent, { ...props, reviews: [] })
  }
  return ComponentWithReviews
}

const PowerfulProgramCard = withReviews()(ProgramCard)
const Foo = () => {
  return <PowerfulProgramCard loading />
}

export default CraftProgramCollection
