import moment from 'moment'
import { sum, uniqBy } from 'ramda'
import { useHistory } from 'react-router'
import { StringParam } from 'serialize-query-params'
import { useQueryParam } from 'use-query-params'
import { convertPathName } from '@lodestar/helpers'
import { ActivityCollectionCategory, ActivityCollectionItem } from '@lodestar/types/activity'
import { ElementComponent } from '@lodestar/types/element'
import ActivityCard from '../cards/ActivityCard'
import { BaseCarouselProps } from '../common/BaseCarousel'
import CategorySelector from '../common/CategorySelector'
import Collection, { CollectionLayout } from './Collection'
import CollectionCarousel from './CollectionCarousel'

export type ActivityCollectionProps = {
  name?: string
  activities?: ActivityCollectionItem[]
  isFetching?: boolean
  fetchError?: Error
  defaultCategoryIds?: string[]
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
  collectionVariant?: 'grid' | 'carousel'
  carousel?: BaseCarouselProps
}

const ActivityCollection: ElementComponent<ActivityCollectionProps> = props => {
  const history = useHistory()
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)

  const {
    activities = [],
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
  const EntityElement = props.variant === 'card' ? ActivityCard : ActivityCard
  const ElementCollection =
    props.collectionVariant === 'carousel'
      ? CollectionCarousel(collectionName, 'activity', EntityElement)
      : Collection(collectionName, 'activity', EntityElement)

  const categories: ActivityCollectionCategory[] = isFetching || fetchError
    ? []
    : uniqBy(
        (category: ActivityCollectionCategory) => category.id,
      )(
        activities
          .flatMap(d => d.categories)
          .filter(category => !defaultCategoryIds || !defaultCategoryIds.includes(category.id)),
      )

  const filterByActiveCategory = (d: ActivityCollectionItem) =>
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
      {isFetching ? (
        <ElementCollection layout={props.layout} carouselProps={props.carousel} loading />
      ) : fetchError ? (
        <ElementCollection layout={props.layout} carouselProps={props.carousel} errors={[fetchError]} />
      ) : (
        <ElementCollection
          layout={props.layout}
          carouselProps={props.carousel}
          data={activities.filter(filterByActiveCategory)}
          renderElement={({ data: activity, ElementComponent: ActivityElement, onClick }) => (
            <ActivityElement
              editing={props.editing}
              id={activity.id}
              coverUrl={activity.coverUrl}
              title={activity.title}
              isParticipantsVisible={activity.isParticipantVisible}
              startedAt={moment.min(activity.sessions.map(session => moment(session.startedAt as any))).toDate()}
              endedAt={moment.max(activity.sessions.map(session => moment(session.endedAt as any))).toDate()}
              participantCount={activity.totalParticipants}
              totalSeats={sum(activity.tickets.map(ticket => ticket.limit))}
              categories={activity.categories}
              onClick={() => {
                onClick?.()
                !props.editing && history.push(`/activities/${activity.id}`)
              }}
            />
          )}
        />
      )}
    </div>
  )
}

export default ActivityCollection
