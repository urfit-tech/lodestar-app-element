import { gql, useQuery } from '@apollo/client'
import moment from 'moment'
import { sum, uniqBy } from 'ramda'
import { useHistory } from 'react-router'
import { StringParam } from 'serialize-query-params'
import { DeepPick } from 'ts-deep-pick/lib'
import { useQueryParam } from 'use-query-params'
import { getProgramPackageCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { convertPathName, findCheapestPlan, notEmpty } from '../../helpers'
import { Category, ProductPlan, ProductRole, ProgramPackage } from '../../types/data'
import { ElementComponent } from '../../types/element'
import { ProductCustomSource, ProductPublishedAtSource } from '../../types/options'
import ProgramPackageCard from '../cards/ProgramPackageCard'
import { BaseCarouselProps } from '../common/BaseCarousel'
import CategorySelector from '../common/CategorySelector'
import Collection, { CollectionLayout, ContextCollection } from './Collection'
import CollectionCarousel from './CollectionCarousel'

// @ts-ignore
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
  | 'plans.[].publishedAt'
  | 'programs.[].roles.[].name'
  | 'programs.[].roles.[].member.id'
  | 'programs.[].totalDuration'
>
type ProgramPackageContextCollection = ContextCollection<ProgramPackageData>

export type ProgramPackageCollectionProps = {
  name?: string
  source?: ProductCustomSource | ProductPublishedAtSource
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
}
const ProgramPackageCollection: ElementComponent<ProgramPackageCollectionProps> = props => {
  const history = useHistory()
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)

  const { loading, errors, children, source = { from: 'publishedAt' } } = props
  if (loading || errors) {
    return null
  }

  const collectionName = props.name || convertPathName(window.location.pathname)
  const EntityElement = props.variant === 'card' ? ProgramPackageCard : ProgramPackageCard
  const ElementCollection =
    props.collectionVariant === 'carousel'
      ? CollectionCarousel(collectionName, 'program_package', EntityElement)
      : Collection(collectionName, 'program_package', EntityElement)

  let ContextCollection: ProgramPackageContextCollection
  switch (source.from) {
    case 'publishedAt':
      ContextCollection = collectPublishedAtCollection(source)
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
        const filter = (d: ProgramPackageData) =>
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
              <ElementCollection layout={props.layout} carouselProps={props.carousel} loading />
            ) : ctx.errors ? (
              <ElementCollection layout={props.layout} carouselProps={props.carousel} errors={ctx.errors} />
            ) : (
              <ElementCollection
                layout={props.layout}
                carouselProps={props.carousel}
                data={ctx.data?.filter(filter) || []}
                renderElement={({ data: programPackage, ElementComponent: ProgramPackageElement, onClick }) => {
                  const cheapestPlan = findCheapestPlan(programPackage.plans)
                  return (
                    <ProgramPackageElement
                      editing={props.editing}
                      coverUrl={programPackage.coverUrl || undefined}
                      title={programPackage.title}
                      link={`/program-packages/${programPackage.id}`}
                      totalPrograms={programPackage.programs.length}
                      totalDuration={sum(programPackage.programs.map(program => program.totalDuration))}
                      salePrice={
                        cheapestPlan?.soldAt && moment() < moment(cheapestPlan.soldAt)
                          ? cheapestPlan?.salePrice
                          : undefined
                      }
                      listPrice={cheapestPlan?.listPrice}
                      onClick={() => {
                        onClick?.()
                        !props.editing && history.push(`/program-packages/${programPackage.id}`)
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
  const ProgramPackageElementCollection: ProgramPackageContextCollection = ({ children }) => {
    const {
      data: rawData,
      loading,
      error,
    } = useQuery<hasura.GET_PROGRAM_PACKAGE_COLLECTION, hasura.GET_PROGRAM_PACKAGE_COLLECTIONVariables>(
      getProgramPackageCollectionQuery(programPackageFields),
      {
        variables: {
          limit: undefined,
          orderByClause: [],
          whereClause: {
            id: { _in: options.idList || [] },
            published_at: { _lt: 'now()' },
            is_private: { _eq: false },
          },
        },
      },
    )
    const data = {
      ...rawData,
      program_package: (options.idList || [])
        .filter(programPackageId => rawData?.program_package.find(p => p.id === programPackageId))
        .map(programPackageId => rawData?.program_package.find(p => p.id === programPackageId))
        .filter(notEmpty),
    }
    const composedData = data ? composeCollectionData(data) : []

    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: composedData,
    })
  }
  return ProgramPackageElementCollection
}

const collectPublishedAtCollection = (options: ProductPublishedAtSource) => {
  const ProgramPackageElementCollection: ProgramPackageContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<
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
          published_at: { _lt: 'now()' },
          is_private: { _eq: false },
        },
        orderByClause: [{ published_at: (options.asc ? 'asc' : 'desc') as hasura.order_by }],
        limit: options.limit,
      },
    })
    const composedData = data ? composeCollectionData(data) : []

    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: composedData,
    })
  }
  return ProgramPackageElementCollection
}

const composeCollectionData = (data: hasura.GET_PROGRAM_PACKAGE_COLLECTION): ProgramPackageData[] =>
  data?.program_package.map(pp => ({
    id: pp.id,
    title: pp.title,
    coverUrl: pp.cover_url || null,
    categories: pp.program_package_categories.map(ppc => ({
      id: ppc.category.id,
      name: ppc.category.name,
    })),
    plans: pp.program_package_plans.map(ppp => ({
      listPrice: ppp.list_price,
      salePrice: ppp.sale_price,
      soldAt: ppp.sold_at && new Date(ppp.sold_at),
      publishedAt: ppp.published_at && new Date(ppp.published_at),
      period: {
        amount: ppp.period_amount,
        type: ppp.period_type,
      } as ProductPlan['period'],
    })),
    programs: pp.program_package_programs.map(ppp => ({
      roles: ppp.program?.program_roles.map(pr => ({
        id: pr.id,
        name: pr.name as ProductRole['name'],
        member: { id: pr.member_id },
      })),
      totalDuration: sum(
        ppp.program.program_content_sections.flatMap(
          pcs => pcs.program_contents_aggregate.aggregate?.sum?.duration || 0,
        ),
      ),
    })),
  })) || []

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
    program_package_plans {
      list_price
      sale_price
      sold_at
      period_amount
      period_type
      published_at
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

export default ProgramPackageCollection
