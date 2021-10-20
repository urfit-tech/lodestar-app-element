import { useApolloClient } from '@apollo/react-hooks'
import { useEditor } from '@craftjs/core'
import gql from 'graphql-tag'
import moment from 'moment'
import { sum, uniqBy } from 'ramda'
import { useState } from 'react'
import { DeepPick } from 'ts-deep-pick/lib'
import { StringParam, useQueryParam } from 'use-query-params'
import { getActivityCollectionQuery } from '../../graphql/queries'
import * as hasura from '../../hasura'
import { Activity, Category } from '../../types/data'
import { ActivityElementProps } from '../../types/element'
import Collection, { CollectionBaseProps } from '../collections/Collection'
import CategorySelector from '../common/CategorySelector'

export type ActivityCollectionOptions =
  | {
      source: 'custom'
      idList: string[]
      withSelector?: boolean
    }
  | {
      source: 'publishedAt'
      limit?: number
      asc?: boolean
      defaultTagNames?: string[]
      defaultCategoryIds?: string[]
      withSelector?: boolean
    }

export type ActivityCollectionProps = CollectionBaseProps<ActivityCollectionOptions> & {
  element: React.ElementType<ActivityElementProps>
}

const ActivityCollection: React.FC<ActivityCollectionProps> = ({
  element,
  layout = { columns: [1, 2, 4], gap: 8, gutter: 8 },
  options,
  children,
}) => {
  const [activeCategoryId = null, setActive] = useQueryParam('active', StringParam)
  const { loading, activities } = useActivityCollection(options)
  const { editing } = useEditor(state => ({
    editing: state.options.enabled,
  }))

  const filteredActivities = activities.filter(
    activity =>
      !options.withSelector ||
      !activeCategoryId ||
      activity.categories.map(category => category.id).includes(activeCategoryId),
  )
  const categories = uniqBy((category: Category) => category.id)(
    activities
      .flatMap(activity => activity.categories)
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
        propsList: filteredActivities.map(activity => ({
          id: activity.id,
          coverUrl: activity.coverUrl,
          title: activity.title,
          isParticipantsVisible: activity.isParticipantVisible,
          startedAt: moment.min(activity.sessions.map(session => moment(session.startedAt))).toDate(),
          endedAt: moment.max(activity.sessions.map(session => moment(session.endedAt))).toDate(),
          participantCount: activity.totalParticipants,
          totalSeats: sum(activity.tickets.map(ticket => ticket.limit)),
          categories: activity.categories,
          editing,
        })),
      })}
    </div>
  )
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
const useActivityCollection = (options: ActivityCollectionOptions) => {
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<
    DeepPick<
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
    >[]
  >([])
  const apolloClient = useApolloClient()
  switch (options.source) {
    case 'publishedAt':
      apolloClient
        .query<hasura.GET_ACTIVITY_COLLECTION, hasura.GET_ACTIVITY_COLLECTIONVariables>({
          query: getActivityCollectionQuery(activityFields),
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
        })
        .then(({ data }) =>
          setActivities(
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
            })) || [],
          ),
        )
        .finally(() => setLoading(false))
      break
    case 'custom':
      apolloClient
        .query<hasura.GET_ACTIVITY_COLLECTION, hasura.GET_ACTIVITY_COLLECTIONVariables>({
          query: getActivityCollectionQuery(activityFields),
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
          setActivities(
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
            })) || [],
          ),
        )
        .finally(() => setLoading(false))
      break
  }

  return { loading, activities }
}

export default ActivityCollection
