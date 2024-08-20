import { Moment } from 'moment'
import { any, curry } from 'ramda'
import { RRule } from 'rrule'

export type ResourceType = 'member' | 'physical_space'

export type FetchedResource = {
  id: string
  type: ResourceType
  target: string
  appId: string
}

const isKeyNullish = curry((object: object, key: keyof object) => !!object?.[key])
const areSomeKeysNullish = (object: object) => any(isKeyNullish(object) as any)

export const isFetchedResource = (fetchedResource: any) =>
  fetchedResource && !areSomeKeysNullish(fetchedResource)(['id', 'type', 'target'])

export type EventRequest = {
  app_id: string
  title?: string
  description?: string
  started_at: Date
  ended_at: Date
  metadata?: object
  published_at?: Date
  deleted_at?: Date
} & (
  | {
      rrule: string
      until: Date
    }
  | {
      rrule?: undefined
      until?: undefined
    }
) &
  (
    | {
        source_type: string
        source_target: string
      }
    | {
        source_type?: undefined
        source_target?: undefined
      }
  )

export type EventResource = {
  temporally_exclusive_resource_id: string
  metadata?: object
  deleted_at?: Date
  role?: string
  is_exclusive?: boolean
}

export type ModalDefaultEventForBasicMode = {
  started_at: Moment
  ended_at: Moment
}

export type ModalDefaultEventForBasicModeWithSource = ModalDefaultEventForBasicMode & {
  source_type: string
  source_target: string
}

export type ModalDefaultEventForEditMode = ModalDefaultEventForBasicMode & {
  event_id: string
  temporally_exclusive_resource_id: string
  title?: string
  description?: string
  event_metadata?: object
  role?: string
  is_exclusive: boolean
  is_attending?: string
  published_at?: Date
  deleted_at?: Date
}

export type ModalDefaultEventForEditModeAndRecurring = ModalDefaultEventForEditMode & {
  rrule: RRule
  until: Date
}

export type GeneralModalDefaultEventForEditMode = (
  | ModalDefaultEventForEditMode
  | ModalDefaultEventForEditModeAndRecurring
) &
  ({} | ModalDefaultEventForBasicModeWithSource)

export const isModalDefaultEventForBasicModeWithSource = (
  event: ModalDefaultEventForBasicMode,
): event is ModalDefaultEventForBasicModeWithSource => {
  return ['source_type', 'source_target'].every(key => key in event)
}

export const isModalDefaultEventForEditMode = (
  event: ModalDefaultEventForBasicMode | ModalDefaultEventForEditMode,
): event is ModalDefaultEventForEditMode => {
  return ['event_id', 'temporally_exclusive_resource_id'].every(key => key in event)
}

export const isModalDefaultEventForEditModeAndRecurring = (
  event: ModalDefaultEventForBasicMode | ModalDefaultEventForEditMode,
): event is ModalDefaultEventForEditModeAndRecurring => {
  return ['rrule', 'until'].every(key => key in event)
}

export type FetchedResourceEvent = {
  event_id: string
  started_at: string
  ended_at: string
  title?: string
  description?: string
  event_metadata?: object
  temporally_exclusive_resource_id: string
  role?: string
  is_exclusive: boolean
  is_attending?: boolean
  published_at?: string
  event_deleted_at?: string
} & (
  | {
      rrule: string
      until: string
    }
  | {
      rrule?: undefined
      until?: undefined
    }
) &
  (
    | {
        source_type: string
        source_target: string
      }
    | {
        source_type?: undefined
        source_target?: undefined
      }
  )

export type Resource = {
  id: string
  type: string
  target: string
  app_id: string
}
