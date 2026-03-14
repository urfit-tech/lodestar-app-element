import { InvoiceProps } from './invoice'

export type OrderProduct = {
  id: string
  name: string
  price: number
  startedAt: Date | null
  endedAt: Date | null
  deliveredAt: Date | null
  product: {
    id: string
    type: string
  }
  quantity: number
  options: any
}

export type OrderDiscount = {
  id: string
  name: string
  description: string | null
  price: number
  type: string
  target: string
  options: any
}

export type OrderLog = {
  id: string
  createdAt: Date
  status: string
  shipping: any
  name: string
  email: string
  totalPrice: number
  expiredAt: Date
  paymentMethod: string | null
  orderProducts: OrderProduct[]
  orderDiscounts: OrderDiscount[]
  orderExecutors: { ratio: string; name: string }[]
  options?: {
    ip?: string
    country?: string
    countryCode?: string
    installmentPlans?: { price: number; index: number }[]
  }
  invoiceOptions?: InvoiceProps
  invoiceIssuedAt?: Date
}

export type PaymentLog = {
  no: string
  createdAt: Date | null
  status: string
  price: number
  gateway: string
  paidAt: Date | null
  method: string
  customNo: string | null
  invoice_options?: InvoiceProps
  options?: any
}
