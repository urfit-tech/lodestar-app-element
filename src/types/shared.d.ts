export type PlanPeriod = {
  amount: number
  type: 'D' | 'W' | 'M' | 'Y'
}

export type Member = {
  id: string
  name: string
  username: string
  email: string
  pictureUrl: string | null
}
