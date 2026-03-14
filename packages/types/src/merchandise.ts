export type ShippingMethodType =
  | 'seven-eleven'
  | 'family-mart'
  | 'hi-life'
  | 'ok-mart'
  | 'home-delivery'
  | 'send-by-post'
  | 'other'

export type ShippingMethodProps = {
  id: ShippingMethodType
  enabled: boolean
  fee: number
  days: number
}
