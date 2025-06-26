import { Category, PeriodType, Project } from './data'
import { PostRole } from './post'

export type PropsWithState<P> = { editing?: boolean } & (
  | ({ loading: true; errors?: never } & Partial<P>)
  | ({ loading?: never; errors: Error[] } & Partial<P>)
  | ({ loading?: never; errors?: never } & P)
)
export type ElementBaseProps<P> = P & { className?: string; children?: React.ReactNode; onClick?: () => void }
export type ElementProps<P> = ElementBaseProps<PropsWithState<P>>
export type ElementComponent<P = {}> = React.ComponentType<ElementProps<P>>

export type TextElementProps = ElementProps<{ content: string; as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }>

export type ProgramElementProps = ElementProps<{
  id: string
  title: string
  abstract: string
  totalDuration: number
  coverUrl: string | null
  instructorIds: string[]
  salePrice?: number
  listPrice?: number
  categories: Category[]
  isEnrolledCountVisible: boolean
  period?: {
    amount: number
    type: PeriodType
  }
  label: string
  labelColorType: string
  roles: {
    id: string
    name: string
    member: {
      id: string
      name: string
      pictureUrl: string | null
    }
  }[]
  historicalProgramPlanBuyers?: number
  historicalProgramPackagePlanBuyers?: number
  reviewAverageScore?: number
  reviewCount?: number
}>

export type ProgramContentElementProps = ElementProps<{
  title: string
  link?: string
  type: 'video' | 'text' | null
  coverUrl: string | null
  duration: number
  progress: number
}>

export type ProgramPackageElementProps = ElementProps<{
  title: string
  totalPrograms: number
  totalDuration: number
  salePrice?: number | null
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
  coverType: 'image' | 'video'
  previewUrl: string | null
  type: Project['type']
  targetAmount: number
  targetUnit: Project['target']['unit']
  expiredAt: Date | null
  isParticipantsVisible: boolean
  isCountdownTimerVisible: boolean
  totalSales: number
  enrollmentCount: number
  creatorId: string | null
  authorId?: string | null
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

export type MemberElementProps = ElementProps<{
  id: string
  name: string
  title: string | null
  abstract: string | null
  avatarUrl: string | null
  description: string | null
}>

export type PostElementProps = ElementProps<{
  id: string
  codeName: string | null
  title: string
  coverUrl: string
  videoUrl: string
  publishedAt: Date | null
  categories: Category[]
  author: Pick<PostRole, 'id' | 'memberId' | 'name'>
}>
