import { uniqBy } from 'ramda'
import { StringParam } from 'serialize-query-params'
import { useQueryParam } from 'use-query-params'
import { convertPathName } from '@lodestar/helpers'
import { ElementComponent } from '@lodestar/types/element'
import { ProjectCollectionCategory, ProjectCollectionItem } from '@lodestar/types/project'
import ProjectCard from '../cards/ProjectCard'
import { BaseCarouselProps } from '../common/BaseCarousel'
import CategorySelector from '../common/CategorySelector'
import Collection, { CollectionLayout } from './Collection'
import CollectionCarousel from './CollectionCarousel'

export type ProjectCollectionProps = {
  name?: string
  projects?: ProjectCollectionItem[]
  isFetching?: boolean
  fetchError?: Error
  defaultCategoryIds?: string[]
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
}

const ProjectCollection: ElementComponent<ProjectCollectionProps> = (props) => {
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)

  const {
    projects = [],
    isFetching,
    fetchError,
    defaultCategoryIds,
    children,
    loading: parentLoading,
    errors: parentErrors,
  } = props

  if (parentLoading || parentErrors) {
    return null
  }

  const collectionName = props.name || convertPathName(window.location.pathname)
  const EntityElement = ProjectCard
  const ElementCollection =
    props.collectionVariant === 'carousel'
      ? CollectionCarousel(collectionName, 'project', EntityElement)
      : Collection(collectionName, 'project', EntityElement)

  const categories =
    isFetching || fetchError
      ? []
      : uniqBy((category: ProjectCollectionCategory) => category.id)(
          projects
            .flatMap((d) => d.categories)
            .filter((category) => !defaultCategoryIds || !defaultCategoryIds.includes(category.id)),
        )

  const filterByActiveCategory = (d: ProjectCollectionItem) =>
    !props.withSelector || !activeCategoryId || d.categories.map((category) => category.id).includes(activeCategoryId)

  return (
    <div className={props.className}>
      {props.withSelector && (
        <CategorySelector
          categories={categories}
          activeCategoryId={activeCategoryId || null}
          onActive={(categoryId) => setActive(categoryId)}
        />
      )}
      {children}
      {isFetching ? (
        <ElementCollection layout={props.layout} carouselProps={props.carousel} loading />
      ) : fetchError ? (
        <ElementCollection layout={props.layout} carouselProps={props.carousel} errors={[fetchError]} />
      ) : (
        <ElementCollection
          layout={props.layout}
          carouselProps={props.carousel}
          data={projects.filter(filterByActiveCategory)}
          renderElement={({ data: project, ElementComponent: ProjectElement }) => (
            <ProjectElement
              editing={props.editing}
              id={project.id}
              title={project.title}
              abstract={project.abstract}
              coverUrl={project.coverUrl}
              coverType={project.coverType}
              previewUrl={project.previewUrl}
              type={project.type}
              targetAmount={project.target.amount}
              targetUnit={project.target.unit}
              expiredAt={project.expiredAt}
              isParticipantsVisible={project.isParticipantsVisible}
              isCountdownTimerVisible={project.isCountdownTimerVisible}
              totalSales={project.totalSales}
              enrollmentCount={project.enrollmentCount}
              creatorId={project.creatorId}
              authorId={project.authorId}
            />
          )}
        />
      )}
    </div>
  )
}

export default ProjectCollection
