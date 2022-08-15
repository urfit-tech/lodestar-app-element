export type Certificate = {
  id: string
  title: string
  description: string | null
  code: string | null
  template: string | null
  templateImage: string | null
  qualification: string | null
  periodType: string | null
  periodAmount: string | null
  createdAt: Date
}

export type MemberCertificate = {
  id: string
  number: string
  values: any
  expiredAt: Date | null
  deliveredAt: Date
  memberId: string
  certificate: Certificate
}
