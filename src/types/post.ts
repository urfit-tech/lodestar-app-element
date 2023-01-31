import { Category } from './data'

export type PostRole = {
  id: string
  postId: string
  memberId: string
  name: string // creator | author
}

export type Post = {
  id: string
  title: string
  coverUrl: string | null
  videoUrl: string | null
  publishedAt: Date | null
  abstract: string | null
  description: string | null
  views: number
  position: number
  isDeleted: boolean
  createdAt: Date | null
  codeName: string | null
  source: string | null
  metaTag: MetaTag
  pinnedAt: Date | null
  categories: Category[]
  author: Pick<PostRole, 'id' | 'memberId' | 'name'>
}
