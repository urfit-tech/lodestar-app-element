export type UserRole = 'app-owner' | 'content-creator' | 'general-member' | 'anonymous'
export type ProductRole<R = 'owner' | 'instructor'> = {
  id: string
  name: R
  member: Member
}

export type Category = {
  id: string
  name: string
}

export type PeriodType = 'D' | 'W' | 'M' | 'Y'
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
}

export type Member = {
  id: string
  name: string
  username: string
  email: string
  pictureUrl: string | null
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
  previewUrl: string | null
  type: 'on-sale' | 'pre-order' | 'funding'
  target: {
    amount: number
    unit: 'funds' | 'participants'
  }
  expiredAt: Date | null
  isParticipantsVisible: boolean
  isCountdownTimerVisible: boolean
  totalSales: number
  enrollmentCount: number
}

export type Program = {
  id: string
  title: string
  coverUrl: string | null
  abstract: string
  publishedAt: Date | null
  isPrivate: boolean
  listPrice: number
  salePrice: number | null
  soldAt: Date | null
  totalDuration: number
  roles: ProductRole[]
  plans: ProductPlan[]
  contentSections: Omit<ProgramContentSection, 'program'>[]
  categories: Category[]
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

export type Attachment = {
  id: string
  name: string
  size: number
  duration: number
}
