import { PeriodType, ProductRole } from './data'

export type ProgramCollectionPlan = {
  id: string
  listPrice: number | null
  salePrice: number | null
  soldAt: Date | null
  publishedAt: Date | null
  autoRenewed: boolean
  period: { amount: number; type: PeriodType } | null
  isPrimary: boolean
  position: number
}

export type ProgramCollectionCategory = {
  id: string
  name: string
  position: number
}

export type ProgramCollectionRoleMember = {
  id: string
  name: string
  pictureUrl: string | null
}

export type ProgramCollectionRole = {
  id: string
  name: ProductRole['name']
  member: ProgramCollectionRoleMember
}

export type ProgramCollectionItem = {
  id: string
  title: string
  abstract: string
  coverUrl: string | null
  coverMobileUrl: string | null
  coverThumbnailUrl: string | null
  totalDuration: number
  label: string
  labelColorType: string
  roles: ProgramCollectionRole[]
  listPrice: number
  salePrice: number | null
  soldAt: Date | null
  isEnrolledCountVisible: boolean
  plans: ProgramCollectionPlan[]
  categories: ProgramCollectionCategory[]
  historicalProgramPlanBuyers: number | null
  historicalProgramPackagePlanBuyers: number | null
  reviewAverageScore: number
  reviewCount: number
}
