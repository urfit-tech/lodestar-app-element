import { Project } from './data'

export type ProjectCollectionCategory = {
  id: string
  name: string
}

export type ProjectCollectionTarget = {
  amount: number
  unit: Project['target']['unit']
}

export type ProjectCollectionItem = {
  id: string
  title: string
  abstract: string
  coverUrl: string | null
  coverType: Project['coverType']
  previewUrl: string | null
  type: Project['type']
  target: ProjectCollectionTarget
  expiredAt: Date | null
  isParticipantsVisible: boolean
  isCountdownTimerVisible: boolean
  totalSales: number
  enrollmentCount: number
  categories: ProjectCollectionCategory[]
  creatorId: string | null
  authorId?: string | null
}
