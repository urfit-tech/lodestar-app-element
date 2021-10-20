import { Category } from './data'

export type Activity = {
  id: string
  coverUrl: string | null
  title: string
  isParticipantsVisible: boolean
  startedAt: Date | null
  endedAt: Date | null
  participantCount?: number
  totalSeats?: number
  categories: Category[]
}

export type ActivityProps =
  | { loading: true }
  | {
      loading?: never
      id: string
      coverUrl: string | null
      title: string
      isParticipantsVisible: boolean
      startedAt: Date | null
      endedAt: Date | null
      participantCount?: number
      totalSeats?: number
      categories: Category[]
      editing?: boolean
    }
