export type ConversionApiEvent = {
    eventName?: ConversionApiEventName
    sourceUrl: string
    purchaseData?: { value?: number; currency?: string; contentName?: string; contentType?: string }
    eventData?: { eventId?: string }
    testEventCode?: string
  }
  export type ConversionApiContent = { id: string; quantity: number; title?: string }
  
  export type ConversionApiUserData = {
    emails?: string[]
    phones?: string[]
    fbp?: string
    fbc?: string
    clientIpAddress?: string
    clientUserAgent?: string
  }
  
  export type ConversionApiData = {
    userData: ConversionApiUserData
    contents?: ConversionApiContent[]
    event: ConversionApiEvent
  }
  
  export type ConversionApiEventName =  //these strings are from facebook meta pixel standard events
  | 'Purchase'
  | 'AddToCart'
  | 'AddPaymentInfo'
  | 'AddToWishlist'
  | 'CompleteRegistration'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'InitiateCheckout'
  | 'Lead'
  | 'Schedule'
  | 'Search'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe'
  | 'ViewContent'