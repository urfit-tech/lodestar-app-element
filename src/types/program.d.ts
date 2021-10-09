import { Category } from './data'
import { Member, PlanPeriod } from './shared'

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
  roles: ProgramRole[]
  plans: ProgramPlan[]
  contentSections: ProgramContentSection[]
  categories: Category[]
}

export type ProgramContentSection = {
  id: string
  title: string
  contents: ProgramContent[]
}

export type ProgramContent = {
  id: string
  title: string
  duration: number
}

export type ProgramRole = {
  id: string
  name: 'owner' | 'instructor'
  member: Member
}

export type ProgramPlan = {
  id: string
  listPrice: number
  salePrice: number | null
  soldAt: Date | null
  autoRenewed: boolean
  period: PlanPeriod | null
}
