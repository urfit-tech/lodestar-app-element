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
  | 'currency'
  | 'invoice'
  | 'locale'
  | 'search'
  | 'social_connect'
  | 'permission'
  | 'customer_review'
  | 'creator_display'
  | 'xuemi_pt'
  | 'sms_verification'
  | 'line'
  | 'craft_page'
  | 'xuemi'
  | 'coin'
  | 'coupon_scope'
  | 'member_card'
  | 'point'
  | 'voucher'
  | 'sharing_code'
  | 'referrer'
  | 'group_buying'
  | 'learning_statistics'
  | 'member_note'
  | 'member_property'
  | 'member_task'
  | 'member_assignment'
  | 'attend'
  | 'member_rejection'
  | 'member_note_demo'
  | 'learning_statistics_advanced'
  | 'commonhealth_login'
  | 'contract'
  | 'sku'
  | 'sales'
  | 'permission_group'
  | 'activity'
  | 'appointment'
  | 'approval'
  | 'blog'
  | 'merchandise'
  | 'podcast'
  | 'podcast_recording'
  | 'program_package'
  | 'project'
  | 'qrcode'
  | 'tempo_delivery'
  | 'merchandise_customization'
  | 'merchandise_virtualness'
  | 'order_contact'
  | 'practice'
  | 'program_content_material'
  | 'exercise'
  | 'private_appointment_plan'
  | 'activity_online'
  | 'zoom'
  | 'fb_pixel'
  | 'ga'
  | 'gtm'
  | 'hotjar'
  | 'tappay'
  | 'spgateway'
  | 'parenting'
  | 'paypal'
  | 'line_login'
  | 'google_login'
  | 'fb_login'
  | 'commonhealth'
  | 'parenting_login'
