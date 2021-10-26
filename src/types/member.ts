import { InvoiceProps, PaymentProps, ShippingProps } from './checkout'

export type UserRole = 'app-owner' | 'content-creator' | 'general-member' | 'anonymous'

export type MemberProps = {
  id: string
  role: UserRole
  username: string
  name: string | null
  email: string
  pictureUrl: string | null
  shipping: ShippingProps | null
  invoice: InvoiceProps | null
  payment: PaymentProps | null
  description: string | null
  createdAt: Date
  loginedAt: Date
  facebookUserId: string | null
  googleUserId: string | null
  youtubeChannelIds: string[] | null
  phone?: string
}
