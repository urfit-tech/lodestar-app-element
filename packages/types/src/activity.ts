export type ActivityCollectionSession = {
  startedAt: Date | string
  endedAt: Date | string
}

export type ActivityCollectionTicket = {
  limit: number
  price: number
}

export type ActivityCollectionCategory = {
  id: string
  name: string
}

export type ActivityCollectionItem = {
  id: string
  title: string
  coverUrl: string | null
  isParticipantVisible: boolean
  organizerId: string
  sessions: ActivityCollectionSession[]
  tickets: ActivityCollectionTicket[]
  categories: ActivityCollectionCategory[]
  totalParticipants: number
}
