import { PeriodType } from './data'

export type ProgramPackageCollectionCategory = {
  id: string
  name: string
}

export type ProgramPackageCollectionPlanPeriod = {
  amount: number
  type: PeriodType
} | null

export type ProgramPackageCollectionPlan = {
  listPrice: number
  salePrice: number | null
  soldAt: Date | null
  publishedAt: Date | null
  period: ProgramPackageCollectionPlanPeriod
  position: number
}

export type ProgramPackageCollectionProgramRole = {
  id: string
  name: 'owner' | 'instructor'
  member: { id: string }
}

export type ProgramPackageCollectionProgram = {
  roles: ProgramPackageCollectionProgramRole[]
  totalDuration: number
}

export type ProgramPackageCollectionItem = {
  id: string
  title: string
  coverUrl: string | null
  categories: ProgramPackageCollectionCategory[]
  plans: ProgramPackageCollectionPlan[]
  programs: ProgramPackageCollectionProgram[]
}
