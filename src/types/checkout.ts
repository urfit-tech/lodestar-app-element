export type OrderProductProps = {
  productId: string
  name: string
  description: string
  price: number
  endedAt: Date | null
  startedAt: Date | null
  autoRenewed: boolean
  options?: {
    quantity?: number
    amount?: number
    currencyId?: string
    currencyPrice?: number
  }
}
export type OrderDiscountProps = {
  name: string
  type: string | null
  target: string | null
  description: string | null
  price: number
  options: { [key: string]: any } | null
}
export type ShippingOptionProps = {
  id: string
  fee: number
  days: number
  enabled: boolean
}
export type CheckProps = {
  orderProducts: OrderProductProps[]
  orderDiscounts: OrderDiscountProps[]
  shippingOption: ShippingOptionProps | null
}
export type CouponProps = {
  id: string
  status: {
    used: boolean
    outdated: boolean
  }
  couponCode: {
    code: string
    couponPlan: {
      id: string
      startedAt: Date | null
      endedAt: Date | null
      type: 'cash' | 'percent'
      constraint: number
      amount: number
      title: string
      description: string | null
      count: number
      remaining: number
      scope: string[] | null
      productIds?: string[]
    }
  }
}
export type ShippingOptionIdType = 'sevenEleven' | 'familyMart' | 'okMart' | 'sendByPost' | 'homeDelivery'
export type PaymentMethodType =
  | 'credit'
  | 'vacc'
  | 'cvs'
  | 'instflag'
  | 'unionpay'
  | 'webatm'
  | 'barcode'
  | 'androidpay'
  | 'samsungpay'
  | 'creditred'
  | 'cvscom'
  | 'alipay'
  | 'ezpay'
  | 'esumwallet'
  | 'taiwanpay'
  | 'linepay'
  | 'atome'
  | 'cash'
  | 'bankTransfer'
  | 'physicalCredit'
  | 'physicalRemoteCredit'
  | 'applepay'

export type PaymentGatewayType =
  | 'spgateway'
  | 'tappay'
  | 'parenting'
  | 'paypal'
  | 'commonhealth'
  | 'atome'
  | 'spgateway2'
  | 'physical'

export type ShippingProps = {
  name?: string
  phone?: string
  zipCode?: string
  city?: string
  district?: string
  address?: string
  isOutsideTaiwanIsland?: string
  shippingMethod?: string
  specification?: string
  storeId?: string
  storeName?: string
}

export type InvoiceProps = {
  name: string
  phone: string
  email: string
  phoneBarCode?: string
  citizenCode?: string
  uniformNumber?: string
  uniformTitle?: string
  donationCode?: string
  postCode?: string
  address?: string
  referrerEmail?: string
}
export type PaymentProps =
  | {
      gateway: Extract<PaymentGatewayType, 'spgateway'>
      method: PaymentMethodType
    }
  | {
      gateway: Exclude<PaymentGatewayType, 'spgateway' | 'atome'>
      method: Extract<PaymentMethodType, 'credit'>
    }
  | { gateway: 'atome'; method: 'atome' }
  | {
      gateway: 'physical'
      method?: Extract<PaymentMethodType, 'cash' | 'bankTransfer' | 'physicalCredit' | 'physicalRemoteCredit'>
    }
  | {
      gateway: PaymentGatewayType
      method: PaymentMethodType
    }

export type ContactInfo = { name: string; phone: string; email: string }
