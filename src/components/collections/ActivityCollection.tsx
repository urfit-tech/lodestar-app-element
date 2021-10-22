import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'
import { sum } from 'ramda'
import { DeepPick } from 'ts-deep-pick/lib'
import { getActivityCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { notEmpty } from '../../helpers'
import { Activity } from '../../types/data'
import { ActivityElementProps } from '../../types/element'
import { CustomSourceOptions, PublishedAtSourceOptions } from '../../types/options'
import Collection, { ElementCollection } from '../collections/Collection'

export type ActivityData = DeepPick<
  Activity,
  | 'id'
  | 'coverUrl'
  | 'title'
  | 'isParticipantVisible'
  | 'totalParticipants'
  | 'sessions.[].startedAt'
  | 'sessions.[].endedAt'
  | 'tickets.[].limit'
  | 'categories'
>
type ActivityCollectionData = ActivityData[]
type ActivityCollection<T> = (
  Element: React.ElementType<ActivityElementProps>,
) => (options: T) => ActivityElementCollection
export type ActivityElementCollection = ElementCollection<ActivityData>

export const CustomActivityCollection: ActivityCollection<CustomSourceOptions> = Element => options => {
  const ActivityElementCollection: ActivityElementCollection = props => {
    const { data: rawData, loading } = useQuery<
      hasura.GET_ACTIVITY_COLLECTION,
      hasura.GET_ACTIVITY_COLLECTIONVariables
    >(getActivityCollectionQuery(activityFields), {
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
      activity: options.idList
        .filter(activityId => rawData?.activity.find(p => p.id === activityId))
        .map(activityId => rawData?.activity.find(p => p.id === activityId))
        .filter(notEmpty),
    }
    const activityCollectionData: ActivityCollectionData =
      data?.activity.map(a => ({
        id: a.id,
        title: a.title,
        coverUrl: a.cover_url,
        isParticipantVisible: a.is_participants_visible,
        sessions: a.activity_sessions.map(as => ({
          startedAt: as.started_at,
          endedAt: as.ended_at,
        })),
        tickets: a.activity_tickets.map(at => ({
          limit: at.count,
        })),
        categories: a.activity_categories.map(ac => ({
          id: ac.category.id,
          name: ac.category.name,
        })),
        totalParticipants: 0, // TODO
      })) || []
    const ElementCollection = Collection({
      Element,
      data: activityCollectionData,
      mapDataToProps: activity =>
        loading
          ? { loading: true }
          : {
              id: activity.id,
              coverUrl: activity.coverUrl,
              title: activity.title,
              isParticipantsVisible: activity.isParticipantVisible,
              startedAt: moment.min(activity.sessions.map(session => moment(session.startedAt))).toDate(),
              endedAt: moment.max(activity.sessions.map(session => moment(session.endedAt))).toDate(),
              participantCount: activity.totalParticipants,
              totalSeats: sum(activity.tickets.map(ticket => ticket.limit)),
              categories: activity.categories,
            },
    })
    return <ElementCollection {...props} />
  }
  return ActivityElementCollection
}

export const PublishedAtActivityCollection: ActivityCollection<PublishedAtSourceOptions> = Element => options => {
  const ActivityElementCollection: ActivityElementCollection = props => {
    const { data, loading } = useQuery<hasura.GET_ACTIVITY_COLLECTION, hasura.GET_ACTIVITY_COLLECTIONVariables>(
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
    const activityCollectionData: ActivityCollectionData =
      data?.activity.map(a => ({
        id: a.id,
        title: a.title,
        coverUrl: a.cover_url,
        isParticipantVisible: a.is_participants_visible,
        sessions: a.activity_sessions.map(as => ({
          startedAt: as.started_at,
          endedAt: as.ended_at,
        })),
        tickets: a.activity_tickets.map(at => ({
          limit: at.count,
        })),
        categories: a.activity_categories.map(ac => ({
          id: ac.category.id,
          name: ac.category.name,
        })),
        totalParticipants: 0, // TODO
      })) || []
    const ElementCollection = Collection({
      Element,
      data: activityCollectionData,
      mapDataToProps: activity =>
        loading
          ? { loading: true }
          : {
              id: activity.id,
              coverUrl: activity.coverUrl,
              title: activity.title,
              isParticipantsVisible: activity.isParticipantVisible,
              startedAt: moment.min(activity.sessions.map(session => moment(session.startedAt))).toDate(),
              endedAt: moment.max(activity.sessions.map(session => moment(session.endedAt))).toDate(),
              participantCount: activity.totalParticipants,
              totalSeats: sum(activity.tickets.map(ticket => ticket.limit)),
              categories: activity.categories,
            },
    })
    return <ElementCollection {...props} />
  }
  return ActivityElementCollection
}

const activityFields = gql`
  fragment activityFields on activity {
    id
    cover_url
    title
    published_at
    is_participants_visible
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
    }
  }
`
