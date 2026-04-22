import { gql, useQuery } from '@apollo/client'
import { sum } from 'ramda'
import { useMemo } from 'react'
import { notEmpty } from '@lodestar/helpers'
import * as hasura from '@lodestar/graphql/hasura'
import { getProgramPackageCollectionQuery } from '@lodestar/graphql/queries'
import { PeriodType } from '@lodestar/types/data'
import { ProductCustomSource, ProductPublishedAtSource } from '@lodestar/types/options'
import {
  ProgramPackageCollectionItem,
  ProgramPackageCollectionPlan,
  ProgramPackageCollectionProgramRole,
} from '@lodestar/types/programPackage'

export type ProgramPackageCollectionSource = ProductPublishedAtSource | ProductCustomSource

export type UseProgramPackageCollectionResult = {
  data: ProgramPackageCollectionItem[]
  loading: boolean
  error?: Error
}

const programPackageFields = gql`
  fragment programPackageFields on program_package {
    id
    title
    cover_url
    program_package_programs {
      program {
        program_roles(where: { name: { _eq: "instructor" } }, order_by: { created_at: asc }) {
          id
          name
          member_id
        }
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
    program_package_plans(
      where: { published_at: { _is_null: false } }
      order_by: [{ position: asc }, { created_at: asc }]
    ) {
      list_price
      sale_price
      sold_at
      period_amount
      period_type
      published_at
      position
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

const PROGRAM_PACKAGE_COLLECTION_QUERY = getProgramPackageCollectionQuery(programPackageFields)

type ProgramPackageNode = hasura.GET_PROGRAM_PACKAGE_COLLECTION['program_package'][number]
type ProgramPackagePlanNode = ProgramPackageNode['program_package_plans'][number]

// The selected `position` column is present in the GraphQL fragment but is
// not reflected in the generated Hasura typings (pre-existing codegen gap).
// Widen the row shape locally instead of falling back to `any`.
type ProgramPackagePlanNodeWithPosition = ProgramPackagePlanNode & {
  position?: number | null
}

const composePlan = (ppp: ProgramPackagePlanNode): ProgramPackageCollectionPlan => {
  const withPosition = ppp as ProgramPackagePlanNodeWithPosition
  return {
    listPrice: ppp.list_price,
    salePrice: ppp.sale_price ?? null,
    soldAt: ppp.sold_at ? new Date(ppp.sold_at) : null,
    publishedAt: ppp.published_at ? new Date(ppp.published_at) : null,
    period:
      ppp.period_amount != null && ppp.period_type != null
        ? {
            amount: ppp.period_amount,
            type: ppp.period_type as PeriodType,
          }
        : null,
    position: withPosition.position ?? 0,
  }
}

const composeProgramPackageItem = (pp: ProgramPackageNode): ProgramPackageCollectionItem => ({
  id: pp.id,
  title: pp.title,
  coverUrl: pp.cover_url ?? null,
  categories: pp.program_package_categories.map(ppc => ({
    id: ppc.category.id,
    name: ppc.category.name,
  })),
  plans: pp.program_package_plans.map(composePlan),
  programs: pp.program_package_programs.map(ppp => ({
    roles: ppp.program.program_roles.map(
      (pr): ProgramPackageCollectionProgramRole => ({
        id: pr.id,
        name: pr.name as ProgramPackageCollectionProgramRole['name'],
        member: { id: pr.member_id },
      }),
    ),
    totalDuration: sum(
      ppp.program.program_content_sections.flatMap(
        pcs => pcs.program_contents_aggregate.aggregate?.sum?.duration || 0,
      ),
    ),
  })),
})

const composeCollectionData = (
  data: hasura.GET_PROGRAM_PACKAGE_COLLECTION,
): ProgramPackageCollectionItem[] => data.program_package.map(composeProgramPackageItem)

const buildVariables = (
  source: ProgramPackageCollectionSource,
): hasura.GET_PROGRAM_PACKAGE_COLLECTIONVariables => {
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
      program_package_categories: source.defaultCategoryIds?.length
        ? { category_id: { _in: source.defaultCategoryIds } }
        : undefined,
      published_at: { _lt: 'now()' },
      is_private: { _eq: false },
    },
    orderByClause: [{ published_at: (source.asc ? 'asc' : 'desc') as hasura.order_by }],
    limit: source.limit,
  }
}

export const useProgramPackageCollection = (
  source: ProgramPackageCollectionSource,
): UseProgramPackageCollectionResult => {
  const variables = useMemo(() => buildVariables(source), [source])
  const { data: rawData, loading, error } = useQuery<
    hasura.GET_PROGRAM_PACKAGE_COLLECTION,
    hasura.GET_PROGRAM_PACKAGE_COLLECTIONVariables
  >(PROGRAM_PACKAGE_COLLECTION_QUERY, { variables })

  const composed = useMemo(() => {
    if (!rawData) return []
    // `custom` source: preserve the caller-supplied idList order (matches
    // the original collectCustomCollection behaviour — the query itself
    // returns rows in arbitrary order).
    if (source.from === 'custom') {
      const ordered: hasura.GET_PROGRAM_PACKAGE_COLLECTION = {
        ...rawData,
        program_package: (source.idList || [])
          .map(id => rawData.program_package.find(pp => pp.id === id))
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
