import { PeriodType } from './data'

export type Target = {
  id: string
  productType: ProductType | null
  title: string
  isSubscription: boolean
  coverUrl?: string | null
  listPrice?: number
  isOnSale?: boolean
  salePrice?: number
  saleAmount?: number
  discountDownPrice?: number
  currencyId?: string
  periodAmount?: number
  periodType?: PeriodType
  startedAt?: Date
  endedAt?: Date
  variant?: 'default' | 'simple' | 'cartProduct' | 'simpleCartProduct' | 'checkout'
  isLimited?: boolean
  isPhysical?: boolean
  isCustomized?: boolean
  groupBuyingPeople?: number
  categories?: string[]
  roles?: string[]
  expiredAt?: Date
}

export type ProductType =
  | 'ProgramPlan'
  | 'ProgramContent'
  | 'ProgramPackagePlan'
  | 'ProjectPlan'
  | 'Card'
  | 'ActivityTicket'
  | 'Merchandise'
  | 'MerchandiseSpec'
  | 'PodcastProgram'
  | 'PodcastPlan'
  | 'AppointmentPlan'
  | 'PodcastAlbum'
  | 'VoucherPlan'
  | 'Token'
  | 'Estimator'
  | 'CouponPlan'
