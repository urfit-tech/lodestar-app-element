import { EventInput } from '@fullcalendar/core'
import moment from 'moment'
import { map, pipe, project } from 'ramda'
import { rrulestr } from 'rrule'
import { adaptValue, inertTransform, renameKey } from '@lodestar/helpers/adaptObject'
import { FetchedResourceEvent, ModalDefaultEvent } from '@lodestar/types/event'

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

const keysMapSelector = (event: FetchedResourceEvent) =>
  event?.rrule ? eventKeysMapForRecurring : eventKeysMap

const fetchedEventValuesAdaptorMap: { [K in keyof FetchedResourceEvent]?: (val: FetchedResourceEvent[K]) => unknown } = {
  started_at: inertTransform(moment),
  ended_at: inertTransform(moment),
  published_at: inertTransform(moment),
  event_deleted_at: inertTransform(moment),
  rrule: inertTransform(rrulestr),
  until: inertTransform((string: string) => new Date(string)),
}

export const adaptEventsToCalendar: (events: Array<FetchedResourceEvent>) => Array<EventInput> = pipe(
  map((event: FetchedResourceEvent) =>
    event ? renameKey<EventInput>(keysMapSelector(event))(event) : undefined,
  ),
  project(['id', 'title', 'start', 'end', 'rrule', 'duration']),
)

export const adaptEventToModal: (event: FetchedResourceEvent) => ModalDefaultEvent = adaptValue<
  FetchedResourceEvent,
  ModalDefaultEvent
>(fetchedEventValuesAdaptorMap)
