import { EventInput } from '@fullcalendar/core'
import moment from 'moment'
import { map, pipe, project } from 'ramda'
import { rrulestr } from 'rrule'
import { adaptValue, inertTransform, renameKey } from '../../helpers/adaptObject'
import { FetchedResourceEvent } from '../../types/event'

const eventKeysMap = {
  id: 'event_id',
  start: 'started_at',
  end: 'ended_at',
}

const eventKeysMapForRecurring = {
  ...eventKeysMap,
  startRecur: 'started_at',
  endRecur: 'until',
}

const keysMapSelector = (event: { [key: string]: any }) => (event?.rrule ? eventKeysMapForRecurring : eventKeysMap)

const fetchedEventValuesAdaptorMap: { [K in keyof FetchedResourceEvent]?: Function } = {
  started_at: inertTransform(moment),
  ended_at: inertTransform(moment),
  published_at: inertTransform(moment),
  event_deleted_at: inertTransform(moment),
  rrule: inertTransform(rrulestr),
  until: inertTransform((string: string) => new Date(string)),
}

export const adaptEventsToCalendar: (events: Array<FetchedResourceEvent>) => Array<EventInput> = pipe(
  map((event: { [key: string]: any }) => (event ? renameKey(keysMapSelector(event))(event) : undefined)),
  project(['id', 'title', 'start', 'end', 'rrule', 'duration']),
)

export const adaptEventToModal = adaptValue(fetchedEventValuesAdaptorMap)
