import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { sum, uniqBy } from 'ramda'
import { StringParam } from 'serialize-query-params'
import { DeepPick } from 'ts-deep-pick/lib'
import { useQueryParam } from 'use-query-params'
import { getProjectCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { convertPathName, notEmpty } from '../../helpers'
import { Category, Project } from '../../types/data'
import { ElementComponent } from '../../types/element'
import { ProductCustomSource, ProductPublishedAtSource } from '../../types/options'
import ProjectCard from '../cards/ProjectCard'
import { BaseCarouselProps } from '../common/BaseCarousel'
import CategorySelector from '../common/CategorySelector'
import Collection, { CollectionLayout, ContextCollection } from './Collection'
import CollectionCarousel from './CollectionCarousel'

type ProjectData = DeepPick<
  Project,
  | 'id'
  | 'title'
  | 'abstract'
  | 'coverUrl'
  | 'previewUrl'
  | 'type'
  | 'target'
  | 'expiredAt'
  | 'isParticipantsVisible'
  | 'isCountdownTimerVisible'
  | 'totalSales'
  | 'enrollmentCount'
  | 'categories'
>

type ProjectContextCollection = ContextCollection<ProjectData>

export type ProjectCollectionProps = {
  name?: string
  source?: ProductCustomSource | ProductPublishedAtSource
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
}
const ProjectCollection: ElementComponent<ProjectCollectionProps> = props => {
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)

  const { loading, errors, children, source = { from: 'publishedAt' } } = props
  if (loading || errors) {
    return null
  }

  const collectionName = props.name || convertPathName(window.location.pathname)
  const EntityElement = ProjectCard
  const ElementCollection =
    props.collectionVariant === 'carousel'
      ? CollectionCarousel(collectionName, 'project', EntityElement)
      : Collection(collectionName, 'project', EntityElement)

  let ContextCollection: ProjectContextCollection
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
        const filter = (d: ProjectData) =>
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
                renderElement={({ data: project, ElementComponent: ProjectElement }) => (
                  <ProjectElement
                    editing={props.editing}
                    id={project.id}
                    title={project.title}
                    abstract={project.abstract}
                    coverUrl={project.coverUrl}
                    previewUrl={project.previewUrl}
                    type={project.type}
                    targetAmount={project.target.amount}
                    targetUnit={project.target.unit}
                    expiredAt={project.expiredAt}
                    isParticipantsVisible={project.isParticipantsVisible}
                    isCountdownTimerVisible={project.isCountdownTimerVisible}
                    totalSales={project.totalSales}
                    enrollmentCount={project.enrollmentCount}
                  />
                )}
              />
            )}
          </div>
        )
      }}
    </ContextCollection>
  )
}

const collectCustomCollection = (options: ProductCustomSource) => {
  const ProjectElementCollection: ProjectContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_PROJECT_COLLECTION, hasura.GET_PROJECT_COLLECTIONVariables>(
      getProjectCollectionQuery(projectFields),
      {
        variables: {
          limit: undefined,
          orderByClause: [],
          whereClause: {
            id: { _in: options.idList || [] },
            published_at: { _lt: 'now()' },
          },
        },
      },
    )
    const orderedData = {
      ...data,
      project: (options.idList || [])
        .filter(projectId => data?.project.find(p => p.id === projectId))
        .map(projectId => data?.project.find(p => p.id === projectId))
        .filter(notEmpty),
    }
    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: data && composeCollectionData(orderedData),
    })
  }
  return ProjectElementCollection
}

const collectPublishedAtCollection = (options: ProductPublishedAtSource) => {
  const ProjectElementCollection: ProjectContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_PROJECT_COLLECTION, hasura.GET_PROJECT_COLLECTIONVariables>(
      getProjectCollectionQuery(projectFields),
      {
        variables: {
          limit: options.limit,
          orderByClause: [{ published_at: (options.asc ? 'asc_nulls_last' : 'desc_nulls_last') as hasura.order_by }],
          whereClause: {
            published_at: { _lt: 'now()' },
            project_categories: options.defaultCategoryIds?.length
              ? {
                  category_id: {
                    _in: options.defaultCategoryIds,
                  },
                }
              : undefined,
          },
        },
      },
    )
    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: data && composeCollectionData(data),
    })
  }
  return ProjectElementCollection
}

const composeCollectionData = (data: hasura.GET_PROJECT_COLLECTION): ProjectData[] =>
  data.project.map(p => ({
    id: p.id,
    title: p.title,
    abstract: p.abstract || '',
    coverUrl: p.cover_url,
    previewUrl: p.preview_url,
    type: p.type as ProjectData['type'],
    target: {
      amount: p.target_amount,
      unit: p.target_unit,
    } as ProjectData['target'],
    expiredAt: p.expired_at,
    isParticipantsVisible: p.is_participants_visible,
    isCountdownTimerVisible: p.is_countdown_timer_visible,
    totalSales: p.project_sales?.total_sales || 0,
    enrollmentCount: sum(p.project_plans.map(pp => pp.project_plan_enrollments_aggregate.aggregate?.count || 0)),
    categories: p.project_categories.map(pc => pc.category),
  }))

const projectFields = gql`
  fragment projectFields on project {
    id
    title
    abstract
    cover_url
    preview_url
    type
    target_amount
    target_unit
    expired_at
    is_participants_visible
    is_countdown_timer_visible
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

export default ProjectCollection
