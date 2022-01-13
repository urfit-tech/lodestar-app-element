import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'
import { sum, uniqBy } from 'ramda'
import { StringParam } from 'serialize-query-params'
import { DeepPick } from 'ts-deep-pick/lib'
import { useQueryParam } from 'use-query-params'
import { getActivityCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import { useTracking } from '../../hooks/tracking'
import { Activity, Category } from '../../types/data'
import { ElementComponent } from '../../types/element'
import { ProductCustomSource, ProductPublishedAtSource } from '../../types/options'
import ActivityCard from '../cards/ActivityCard'
import CategorySelector from '../common/CategorySelector'
import Collection, { CollectionLayout, ContextCollection } from './Collection'

// @ts-ignore
type ActivityData = DeepPick<
  Activity,
  | 'id'
  | 'coverUrl'
  | 'title'
  | 'organizerId'
  | 'isParticipantVisible'
  | 'totalParticipants'
  | 'sessions.[].startedAt'
  | 'sessions.[].endedAt'
  | 'tickets.[].limit'
  | 'tickets.[].price'
  | 'categories'
>
type ActivityContextCollection = ContextCollection<ActivityData>

export type ActivityCollectionProps = {
  source?: ProductCustomSource | ProductPublishedAtSource
  variant?: 'card' | 'tile'
  layout?: CollectionLayout
  withSelector?: boolean
}
const ActivityCollection: ElementComponent<ActivityCollectionProps> = props => {
  const tracking = useTracking()
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)

  const { loading, errors, children, source = { from: 'publishedAt' } } = props
  if (loading || errors) {
    return null
  }

  const ElementCollection = Collection('Activity', props.variant === 'card' ? ActivityCard : ActivityCard)
  let ContextCollection: ActivityContextCollection
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
        const filter = (d: ActivityData) =>
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
                data={ctx.data?.filter(filter) || []}
                renderElement={(activity, ActivityElement) => (
                  <ActivityElement
                    editing={props.editing}
                    id={activity.id}
                    coverUrl={activity.coverUrl}
                    title={activity.title}
                    isParticipantsVisible={activity.isParticipantVisible}
                    startedAt={moment.min(activity.sessions.map(session => moment(session.startedAt))).toDate()}
                    endedAt={moment.max(activity.sessions.map(session => moment(session.endedAt))).toDate()}
                    participantCount={activity.totalParticipants}
                    totalSeats={sum(activity.tickets.map(ticket => ticket.limit))}
                    categories={activity.categories}
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
  const ActivityElementCollection: ActivityContextCollection = ({ children }) => {
    const {
      data: rawData,
      loading,
      error,
    } = useQuery<hasura.GET_ACTIVITY_COLLECTION, hasura.GET_ACTIVITY_COLLECTIONVariables>(
      getActivityCollectionQuery(activityFields),
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
    const data = {
      ...rawData,
      activity: (options.idList || [])
        .filter(activityId => rawData?.activity.find(p => p.id === activityId))
        .map(activityId => rawData?.activity.find(p => p.id === activityId))
        .filter(notEmpty),
    }
    const composedData = data ? composeCollectionData(data) : []

    return children({
      loading,
      errors: error && [new Error(error.message)],
      data: composedData,
    })
  }
  return ActivityElementCollection
}

const collectPublishedAtCollection = (options: ProductPublishedAtSource) => {
  const ActivityElementCollection: ActivityContextCollection = ({ children }) => {
    const { data, loading, error } = useQuery<hasura.GET_ACTIVITY_COLLECTION, hasura.GET_ACTIVITY_COLLECTIONVariables>(
      getActivityCollectionQuery(activityFields),
      {
        variables: {
          whereClause: {
            activity_categories: options.defaultCategoryIds?.length
              ? {
                  category_id: {
                    _in: options.defaultCategoryIds,
                  },
                }
              : undefined,
            activity_tags: options.defaultTagNames?.length
              ? {
                  tag_name: {
                    _in: options.defaultTagNames,
                  },
                }
              : undefined,
          },
          orderByClause: [{ published_at: (options.asc ? 'asc' : 'desc') as hasura.order_by }],
          limit: options.limit,
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
  return ActivityElementCollection
}

const composeCollectionData = (data: hasura.GET_ACTIVITY_COLLECTION): ActivityData[] =>
  data?.activity.map(a => ({
    id: a.id,
    title: a.title,
    coverUrl: a.cover_url,
    isParticipantVisible: a.is_participants_visible,
    organizerId: a.organizer_id,
    sessions: a.activity_sessions.map(as => ({
      startedAt: as.started_at,
      endedAt: as.ended_at,
    })),
    tickets: a.activity_tickets.map(at => ({
      limit: at.count,
      price: at.price,
    })),
    categories: a.activity_categories.map(ac => ({
      id: ac.category.id,
      name: ac.category.name,
    })),
    totalParticipants: 0, // TODO
  })) || []

const activityFields = gql`
  fragment activityFields on activity {
    id
    cover_url
    title
    published_at
    is_participants_visible
    organizer_id
    activity_categories {
      category {
        id
        name
      }
    }
    activity_enrollments_aggregate {
      aggregate {
        count
      }
    }
    activity_sessions {
      started_at
      ended_at
    }
    activity_tickets {
      count
      price
    }
  }
`

export default ActivityCollection
