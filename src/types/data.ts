export type UserRole = 'app-owner' | 'content-creator' | 'general-member' | 'anonymous'
export type ProductRole<R = 'owner' | 'instructor'> = {
  id: string
  name: R
  member: Pick<Member, 'id' | 'name' | 'pictureUrl'>
}

export type Category = {
  id: string
  name: string
  position?: number
}

export type PeriodType = 'H' | 'm' | 'D' | 'W' | 'M' | 'Y'

export type ProductPlan = {
  id: string
  title: string
  listPrice: number
  salePrice: number | null
  soldAt: Date | null
  period: {
    amount: number
    type: PeriodType
  } | null
  autoRenewed: boolean
  isPrimary: boolean
  publishedAt: Date | null
}

export type MemberProvider = 'google' | 'facebook' | 'line' | 'cw' | 'parenting' | 'commonhealth'
export type Member = {
  id: string
  role: UserRole
  name: string
  username: string
  email: string
  pictureUrl: string | null
  title: string | null
  abstract: string | null
  description: string | null
  categories: Category[]
  provider: Record<MemberProvider, any>
  options: { [key: string]: any }
  isBusiness?: boolean | null
}

export type PodcastProgram = {
  id: string
  title: string
  coverUrl: string | null
  totalDuration: number
  roles: ProductRole[]
} & ProductPlan

export type Project = {
  id: string
  title: string
  abstract: string
  coverUrl: string | null
  coverType: 'image' | 'video'
  previewUrl: string | null
  type: 'on-sale' | 'pre-order' | 'funding' | 'portfolio'
  target: {
    amount: number
    unit: 'funds' | 'participants'
  }
  expiredAt: Date | null
  isParticipantsVisible: boolean
  isCountdownTimerVisible: boolean
  totalSales: number
  enrollmentCount: number
  categories: Category[]
  creatorId: string | null
  authorId?: string | null
}

export type Program = {
  id: string
  title: string
  coverUrl: string | null
  coverMobileUrl: string | null
  coverThumbnailUrl: string | null
  abstract: string
  publishedAt: Date | null
  isPrivate: boolean
  listPrice: number
  salePrice: number | null
  soldAt: Date | null
  totalDuration: number
  isEnrolledCountVisible: boolean
  roles: ProductRole[]
  plans: ProductPlan[]
  contentSections: Omit<ProgramContentSection, 'program'>[]
  categories: Category[]
  label: string
  labelColorType: string
}

export type ProgramContentSection = {
  id: string
  title: string
  program: Program
  contents: Omit<ProgramContent, 'contentSection'>[]
}

export type ProgramContent = {
  id: string
  title: string
  duration: number
  progress: number
  lastProgress: number
  contentSection: ProgramContentSection
  videos: Attachment[]
  attachments: Attachment[]
}

export type ProgramPackage = {
  id: string
  title: string
  coverUrl: string | null
  programs: Program[]
  plans: ProductPlan[]
  createdAt: Date
  publishedAt: Date | null
  categories: Category[]
}

export type Attachment = {
  id: string
  name: string
  size: number
  duration: number
}

export type Activity = {
  id: string
  title: string
  coverUrl: string | null
  isParticipantVisible: boolean
  publishedAt: Date | null
  categories: Category[]
  sessions: ActivitySession[]
  tickets: ActivityTicket[]
  totalParticipants: number
  organizerId: string
}

export type ActivitySession = {
  id: string
  startedAt: Date
  endedAt: Date
  totalParticipants: number
}

export type ActivityTicket = {
  id: string
  sessions: ActivitySession[]
  participants: Member[]
  limit: number
  price: number
}
