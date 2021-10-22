import { Category, PeriodType, Project } from './data'

type ElementProps<P> = PropsWithUiState<P>
export type PropsWithUiState<P> =
  | { loading: true; errors?: never }
  | { loading?: never; errors: Error[] }
  | (P & { loading?: never; errors?: never; editing?: boolean })

export type ProgramElementProps = ElementProps<{
  id: string
  title: string
  abstract: string
  totalDuration: number
  coverUrl: string | null
  instructorIds: string[]
  currentPrice: number
  listPrice?: number
  period?: {
    amount: number
    type: PeriodType
  }
}>

export type ProgramContentElementProps = ElementProps<{
  title: string
  type: 'video' | 'text' | null
  coverUrl: string | null
  duration: number
  progress: number
}>

export type ProgramPackageElementProps = ElementProps<{
  title: string
  totalPrograms: number
  totalDuration: number
  currentPrice: number
  link?: string
  coverUrl?: string
  listPrice?: number
  period?: {
    amount: number
    type: PeriodType
  }
}>

export type PodcastProgramElementProps = ElementProps<{
  id: string
  title: string
  coverUrl: string | null
  durationSecond: number
  instructor: {
    name: string
    avatarUrl: string | null
  }
  listPrice: number | null
  currentPrice: number
}>

export type ProjectElementProps = ElementProps<{
  id: string
  title: string
  abstract: string
  coverUrl: string | null
  previewUrl: string | null
  type: Project['type']
  targetAmount: number
  targetUnit: Project['target']['unit']
  expiredAt: Date | null
  isParticipantsVisible: boolean
  isCountdownTimerVisible: boolean
  totalSales: number
  enrollmentCount: number
}>

export type ActivityElementProps = ElementProps<{
  id: string
  coverUrl: string | null
  title: string
  isParticipantsVisible: boolean
  startedAt: Date | null
  endedAt: Date | null
  participantCount?: number
  totalSeats?: number
  categories: Category[]
}>
