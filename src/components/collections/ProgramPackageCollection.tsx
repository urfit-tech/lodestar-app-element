import { useApolloClient } from '@apollo/react-hooks'
import { useEditor } from '@craftjs/core'
import gql from 'graphql-tag'
import { sum, uniqBy } from 'ramda'
import { useState } from 'react'
import { DeepPick } from 'ts-deep-pick/lib'
import { StringParam, useQueryParam } from 'use-query-params'
import { getProgramPackageCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { findCheapestPlan, getCurrentPrice } from '../../helpers'
import { Category, ProductPlan, ProgramPackage } from '../../types/data'
import { ProgramPackageElementProps } from '../../types/element'
import CategorySelector from '../common/CategorySelector'
import Collection, { CollectionBaseProps } from './Collection'

export type ProgramPackageCollectionOptions =
  | {
      source: 'custom'
      idList: string[]
      withSelector?: boolean
    }
  | {
      source: 'publishedAt'
      limit?: number
      asc?: boolean
      defaultCategoryIds?: string[]
      withSelector?: boolean
    }

type ProgramPackageCollectionProps = CollectionBaseProps<ProgramPackageCollectionOptions> & {
  element: React.ElementType<ProgramPackageElementProps>
}
const ProgramPackageCollection: React.FC<ProgramPackageCollectionProps> = ({
  element,
  layout = { columns: [1, 2, 4], gap: 8, gutter: 8 },
  options,
  children,
}) => {
  console.log('render program package collection')
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)
  const { loading, data: programPackages } = useProgramPackageCollection(options)
  const { editing } = useEditor(state => ({
    editing: state.options.enabled,
  }))

  const filteredActivities = programPackages.filter(
    programPackage =>
      !options.withSelector ||
      !activeCategoryId ||
      programPackage.categories.map(category => category.id).includes(activeCategoryId),
  )
  const categories = uniqBy((category: Category) => category.id)(
    programPackages
      .flatMap(programPackage => programPackage.categories)
      .filter(category => options.source === 'custom' || !options.defaultCategoryIds?.includes(category.id)),
  )
  return (
    <div>
      {options.withSelector && (
        <CategorySelector
          categories={categories}
          activeCategoryId={activeCategoryId || null}
          onActive={categoryId => setActive(categoryId)}
        />
      )}
      {children}
      {Collection(element)({
        loading,
        layout,
        propsList: filteredActivities.map(programPackage => {
          const cheapestPlan = !loading && findCheapestPlan(programPackage.plans)
          return {
            id: programPackage.id,
            coverUrl: programPackage.coverUrl || undefined,
            title: programPackage.title,
            link: `/program-packages/${programPackage.id}`,
            totalPrograms: programPackage.programs.length,
            totalDuration: sum(programPackage.programs.map(program => program.totalDuration)),
            currentPrice: cheapestPlan ? getCurrentPrice(cheapestPlan) : 0,
            editing,
          }
        }),
      })}
    </div>
  )
}

const programPackageFields = gql`
  fragment programPackageFields on program_package {
    id
    title
    cover_url
    program_package_programs {
      program {
        program_content_sections {
          program_contents_aggregate {
            aggregate {
              sum {
                duration
              }
            }
          }
        }
      }
    }
    program_package_plans {
      list_price
      sale_price
      sold_at
      period_amount
      period_type
    }
    program_package_categories {
      category {
        id
        name
      }
    }
    published_at
  }
`
const useProgramPackageCollection = (options: ProgramPackageCollectionOptions) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<
    DeepPick<
      ProgramPackage,
      | 'id'
      | 'title'
      | 'coverUrl'
      | 'categories'
      | 'plans.[].listPrice'
      | 'plans.[].salePrice'
      | 'plans.[].soldAt'
      | 'plans.[].period'
      | 'programs.[].totalDuration'
    >[]
  >([])
  const apolloClient = useApolloClient()
  switch (options.source) {
    case 'publishedAt':
      apolloClient
        .query<hasura.GET_PROGRAM_PACKAGE_COLLECTION, hasura.GET_PROGRAM_PACKAGE_COLLECTIONVariables>({
          query: getProgramPackageCollectionQuery(programPackageFields),
          variables: {
            whereClause: {
              program_package_categories: options.defaultCategoryIds?.length
                ? {
                    category_id: {
                      _in: options.defaultCategoryIds,
                    },
                  }
                : undefined,
            },
            orderByClause: [{ published_at: (options.asc ? 'asc' : 'desc') as hasura.order_by }],
            limit: options.limit,
          },
        })
        .then(({ data }) =>
          setData(
            data?.program_package.map(pp => ({
              id: pp.id,
              title: pp.title,
              coverUrl: pp.cover_url,
              categories: pp.program_package_categories.map(ppc => ({
                id: ppc.category.id,
                name: ppc.category.name,
              })),
              plans: pp.program_package_plans.map(ppp => ({
                listPrice: ppp.list_price,
                salePrice: ppp.sale_price,
                soldAt: ppp.sold_at,
                period: {
                  amount: ppp.period_amount,
                  type: ppp.period_type,
                } as ProductPlan['period'],
              })),
              programs: pp.program_package_programs.map(ppp => ({
                totalDuration: sum(
                  ppp.program.program_content_sections.flatMap(
                    pcs => pcs.program_contents_aggregate.aggregate?.sum?.duration || 0,
                  ),
                ),
              })),
            })) || [],
          ),
        )
        .finally(() => setLoading(false))
      break
    case 'custom':
      apolloClient
        .query<hasura.GET_PROGRAM_PACKAGE_COLLECTION, hasura.GET_PROGRAM_PACKAGE_COLLECTIONVariables>({
          query: getProgramPackageCollectionQuery(programPackageFields),
          variables: {
            limit: undefined,
            orderByClause: [],
            whereClause: {
              id: { _in: options.idList },
              published_at: { _is_null: false },
            },
          },
        })
        .then(({ data }) =>
          setData(
            data?.program_package.map(pp => ({
              id: pp.id,
              title: pp.title,
              coverUrl: pp.cover_url,
              categories: pp.program_package_categories.map(ppc => ({
                id: ppc.category.id,
                name: ppc.category.name,
              })),
              plans: pp.program_package_plans.map(ppp => ({
                listPrice: ppp.list_price,
                salePrice: ppp.sale_price,
                soldAt: ppp.sold_at,
                period: {
                  amount: ppp.period_amount,
                  type: ppp.period_type,
                } as ProductPlan['period'],
              })),
              programs: pp.program_package_programs.map(ppp => ({
                totalDuration: sum(
                  ppp.program.program_content_sections.flatMap(
                    pcs => pcs.program_contents_aggregate.aggregate?.sum?.duration || 0,
                  ),
                ),
              })),
            })) || [],
          ),
        )
        .finally(() => setLoading(false))
      break
  }

  return { loading, data }
}

export default ProgramPackageCollection
