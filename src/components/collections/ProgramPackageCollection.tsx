import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { sum } from 'ramda'
import { DeepPick } from 'ts-deep-pick/lib'
import { getProgramPackageCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { findCheapestPlan, getCurrentPrice, notEmpty } from '../../helpers'
import { ProductPlan, ProgramPackage } from '../../types/data'
import { ProgramPackageElementProps } from '../../types/element'
import { CustomSourceOptions, PublishedAtSourceOptions } from '../../types/options'
import Collection, { ElementCollection } from '../collections/Collection'

type ProgramPackageData = DeepPick<
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
>
type ProgramPackageCollectionData = ProgramPackageData[]
type ProgramPackageCollection<T> = (
  Element: React.ElementType<ProgramPackageElementProps>,
) => (options: T) => ProgramPackageElementCollection
export type ProgramPackageElementCollection = ElementCollection<ProgramPackageData>

export const CustomProgramPackageCollection: ProgramPackageCollection<CustomSourceOptions> = Element => options => {
  const ProgramPackageElementCollection: ProgramPackageElementCollection = props => {
    const { data: rawData, loading } = useQuery<
      hasura.GET_PROGRAM_PACKAGE_COLLECTION,
      hasura.GET_PROGRAM_PACKAGE_COLLECTIONVariables
    >(getProgramPackageCollectionQuery(programPackageFields), {
      variables: {
        limit: undefined,
        orderByClause: [],
        whereClause: {
          id: { _in: options.idList },
          published_at: { _is_null: false },
        },
      },
    })
    const data = {
      ...rawData,
      program_package: options.idList
        .filter(programPackageId => rawData?.program_package.find(p => p.id === programPackageId))
        .map(programPackageId => rawData?.program_package.find(p => p.id === programPackageId))
        .filter(notEmpty),
    }
    const ElementCollection = Collection({
      Element,
      data: data ? mapQueryToData(data) : [],
      mapDataToProps: programPackage => (loading ? { loading } : mapProgramPackageToProps(programPackage)),
    })
    return <ElementCollection {...props} />
  }
  return ProgramPackageElementCollection
}

export const PublishedAtProgramPackageCollection: ProgramPackageCollection<PublishedAtSourceOptions> =
  Element => options => {
    const ProgramPackageElementCollection: ProgramPackageElementCollection = props => {
      const { data, loading } = useQuery<
        hasura.GET_PROGRAM_PACKAGE_COLLECTION,
        hasura.GET_PROGRAM_PACKAGE_COLLECTIONVariables
      >(getProgramPackageCollectionQuery(programPackageFields), {
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
      const ElementCollection = Collection({
        Element,
        data: data ? mapQueryToData(data) : [],
        mapDataToProps: programPackage => (loading ? { loading } : mapProgramPackageToProps(programPackage)),
      })
      return <ElementCollection {...props} />
    }
    return ProgramPackageElementCollection
  }

const mapQueryToData = (data: hasura.GET_PROGRAM_PACKAGE_COLLECTION) =>
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
  })) || []

const mapProgramPackageToProps = (programPackage: ProgramPackageData) => {
  const cheapestPlan = findCheapestPlan(programPackage.plans)
  return {
    id: programPackage.id,
    coverUrl: programPackage.coverUrl || undefined,
    title: programPackage.title,
    link: `/program-packages/${programPackage.id}`,
    totalPrograms: programPackage.programs.length,
    totalDuration: sum(programPackage.programs.map(program => program.totalDuration)),
    currentPrice: cheapestPlan ? getCurrentPrice(cheapestPlan) : 0,
  }
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
