export type Category = {
  id: string
  name: string
}

export type UserRole = 'app-owner' | 'content-creator' | 'general-member' | 'anonymous'

export type PeriodType = 'D' | 'W' | 'M' | 'Y'

export type ProjectType = 'on-sale' | 'pre-order' | 'funding'

export type MemberPublicProps = {
  id: string
  pictureUrl: string | null
  name: string | null
}

export type ActivityProps = {
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

export type ActivityCollection = {
  type: 'newest' | 'custom'
  ids: (string | null)[]
}

export type PodcastProgramBriefProps = {
  id: string
  coverUrl: string | null
  title: string
  listPrice: number
  salePrice: number | null
  durationSecond: number
  instructor: {
    id: string
    avatarUrl: string | null
    name: string
  } | null
}

export type ProgramBriefProps = {
  id: string
  coverUrl: string | null
  title: string
  abstract: string | null
  publishedAt: Date | null
  isSubscription: boolean
  isPrivate: boolean
  listPrice: number | null
  salePrice: number | null
  soldAt: Date | null
  totalDuration?: number
}

export type ProgramRoleProps = {
  id: string
  memberId: string
}

export type ProgramPlanProps = {
  id: string
  listPrice: number
  salePrice: number | null
  soldAt: Date | null
  periodAmount: number
  periodType: PeriodType
}

export type ProjectBasicProps = {
  id: string
  type: string
  title: string
  coverUrl: string | null
  previewUrl: string | null
  abstract: string | null
  targetAmount: number
  targetUnit: 'funds' | 'participants'
  expiredAt: Date | null
  isParticipantsVisible: boolean
  isCountdownTimerVisible: boolean
  totalSales: number
  enrollmentCount: number
}

export type Module =
  | 'activity'
  | 'activity_online'
  | 'appointment'
  | 'approval'
  | 'attend'
  | 'blog'
  | 'coin'
  | 'contract'
  | 'coupon_scope'
  | 'creator_display'
  | 'currency'
  | 'customer_review'
  | 'exercise'
  | 'group_buying'
  | 'invoice'
  | 'learning_statistics'
  | 'learning_statistics_advanced'
  | 'locale'
  | 'member_assignment'
  | 'member_card'
  | 'member_note'
  | 'member_note_demo'
  | 'member_property'
  | 'member_rejection'
  | 'member_task'
  | 'merchandise'
  | 'merchandise_customization'
  | 'merchandise_virtualness'
  | 'order_contact'
  | 'permission'
  | 'podcast'
  | 'podcast_recording'
  | 'point'
  | 'practice'
  | 'private_appointment_plan'
  | 'program_content_material'
  | 'program_package'
  | 'project'
  | 'qrcode'
  | 'referrer'
  | 'search'
  | 'sharing_code'
  | 'sms_verification'
  | 'social_connect'
  | 'tempo_delivery'
  | 'voucher'
  | 'xuemi_pt'
