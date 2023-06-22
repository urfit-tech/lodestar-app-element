// Reference
// https://support.google.com/analytics/answer/9267735?hl=zh-Hant
// https://developers.google.com/analytics/devguides/collection/ga4/reference/events?hl=zh-tw&client_type=gtm

import { Currency } from './app'
import { UserRole } from './member'

/** GA */

export enum GATrackingEventName {
  LOGIN = 'login',
  SEARCH = 'search',
  SELECT_CONTENT = 'select_content',
  SHARE = 'share',
  SIGN_UP = 'sign_up',
  TUTORIAL_BEGIN = 'tutorial_begin',
  TUTORIAL_COMPLETE = 'tutorial_complete',
  EARN_VIRTUAL_CURRENCY = 'earn_virtual_currency',
  SPEND_VIRTUAL_CURRENCY = 'spend_virtual_currency',
  JOIN_GROUP = 'join_group',
  LEVEL_START = 'level_start',
  LEVEL_END = 'level_end',
  LEVEL_UP = 'level_up',
  POST_SCORE = 'post_score',
  UNLOCK_ACHIEVEMENT = 'unlock_achievement',
  PURCHASE = 'purchase',
  ADD_TO_CART = 'add_to_cart',
  ADD_TO_WISHLIST = 'add_to_wishlist',
  VIEW_ITEM_LIST = 'view_item_list',
  VIEW_ITEM = 'view_item',
  VIEW_PROMOTION = 'view_promotion',
  SELECT_PROMOTION = 'select_promotion',
  REMOVE_FROM_CART = 'remove_from_cart',
  BEGIN_CHECKOUT = 'begin_checkout',
  ADD_SHIPPING_INFO = 'add_shipping_info',
  ADD_PAYMENT_INFO = 'add_payment_info',
  GENERATE_LEAD = 'generate_lead',
  REFUND = 'refund',
  SELECT_ITEM = 'select_item',
  VIEW_CART = 'view_cart',
}

export type GATrackingEventValue = {
  value: number
  currency: Currency
}
export type GATrackingEventItem = ({ item_id: string } | { item_name: string }) & {
  affiliation?: string
  coupon?: string
  discount?: number
  index?: number
  item_brand?: string
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
  item_list_id?: string
  item_list_name?: string
  item_variant?: string
  location_id?: string
  price?: number
  quantity?: number
}

export type GATrackingLoginEvent = {
  name: GATrackingEventName.LOGIN
  method: string
  member: {
    id: string
    role: UserRole
    username: string
    email: string
    options?: { [key: string]: any }
  }
}

export type GATrackingSearchEvent = {
  name: GATrackingEventName.SEARCH
  search_term: string
}

export type GATrackingSelectContentEvent = {
  name: GATrackingEventName.SELECT_CONTENT
  content_type?: string
  content_id?: string
}

export type GATrackingShareEvent = {
  name: GATrackingEventName.SHARE
  method?: string
  content_type?: string
  item_id?: string
}

export type GATrackingSignUpEvent = {
  name: GATrackingEventName.SIGN_UP
  method?: string
}

export type GATrackingTutorialBeginEvent = {
  name: GATrackingEventName.TUTORIAL_BEGIN
}

export type GATrackingTutorialCompleteEvent = {
  name: GATrackingEventName.TUTORIAL_COMPLETE
}

export type GATrackingEarnVirtualCurrencyEvent = {
  name: GATrackingEventName.EARN_VIRTUAL_CURRENCY
  virtual_currency_name?: string
  value?: number
}

export type GATrackingSpendVirtualCurrencyEvent = {
  name: GATrackingEventName.SPEND_VIRTUAL_CURRENCY
  value: number
  virtual_currency_name: string
  item_name?: string
}

export type GATrackingJoinGroupEvent = {
  name: GATrackingEventName.JOIN_GROUP
  group_id?: string
}

export type GATrackingLevelStartEvent = {
  name: GATrackingEventName.LEVEL_START
  level_name?: string
}

export type GATrackingLevelEndEvent = {
  name: GATrackingEventName.LEVEL_END
  level_name?: string
  success?: boolean
}

export type GATrackingLevelUpEvent = {
  name: GATrackingEventName.LEVEL_UP
  level?: number
  character?: string
}

export type GATrackingPostScoreEvent = {
  name: GATrackingEventName.POST_SCORE
  score: number
  level?: number
  character?: string
}

export type GATrackingUnlockAchievementEvent = {
  name: GATrackingEventName.UNLOCK_ACHIEVEMENT
  achievement_id: string
}

export type GATrackingPurchaseEvent = {
  name: GATrackingEventName.PURCHASE
  transaction_id: string
  items: GATrackingEventItem[]
  coupon?: string
  shipping?: number
  tax?: number
} & GATrackingEventValue

export type GATrackingAddToCartEvent = {
  name: GATrackingEventName.ADD_TO_CART
  items: GATrackingEventItem[]
} & GATrackingEventValue

export type GATrackingAddToWishlistEvent = {
  name: GATrackingEventName.ADD_TO_WISHLIST
  items: GATrackingEventItem[]
} & GATrackingEventValue

export type GATrackingViewItemListEvent = {
  name: GATrackingEventName.VIEW_ITEM_LIST
  item_list_id?: string
  item_list_name?: string
  items: GATrackingEventItem[]
}
export type GATrackingViewItemEvent = {
  name: GATrackingEventName.VIEW_ITEM
  items: GATrackingEventItem[]
} & GATrackingEventValue

export type GATrackingViewPromotionEvent = {
  name: GATrackingEventName.VIEW_PROMOTION
  creative_name?: string
  creative_slot?: string
  promotion_id?: string
  promotion_name?: string
  items?: GATrackingEventItem[] // The items array is expected to have a single element, representing the item associated with the promotion. If multiple elements are provided, only the first element in items will be used.
}
export type GATrackingSelectPromotionEvent = {
  name: GATrackingEventName.SELECT_PROMOTION
  creative_name?: string
  creative_slot?: string
  promotion_id?: string
  promotion_name?: string
  items?: GATrackingEventItem[] // The items array is expected to have a single element, representing the item associated with the promotion. If multiple elements are provided, only the first element in items will be used.
}
export type GATrackingRemoveFromCartEvent = {
  name: GATrackingEventName.REMOVE_FROM_CART
  items: GATrackingEventItem[]
} & GATrackingEventValue

export type GATrackingBeginCheckoutEvent = {
  name: GATrackingEventName.BEGIN_CHECKOUT
  coupon?: string
  items: GATrackingEventItem[]
} & GATrackingEventValue
export type GATrackingAddShippingInfoEvent = {
  name: GATrackingEventName.ADD_SHIPPING_INFO
  coupon?: string
  shipping_tier?: string
  items: GATrackingEventItem[]
} & GATrackingEventValue

export type GATrackingAddPaymentInfoEvent = {
  name: GATrackingEventName.ADD_PAYMENT_INFO
  coupon?: string
  payment_type?: string
  items: GATrackingEventItem[]
} & GATrackingEventValue

export type GATrackingGenerateLeadEvent = {
  name: GATrackingEventName.GENERATE_LEAD
} & GATrackingEventValue

export type GATrackingRefundEvent = {
  name: GATrackingEventName.REFUND
  transaction_id: string
  coupon?: string
  shipping?: number
  tax?: number
  items?: GATrackingEventItem[] // Note: We recommend that you include item information in your refund event to see item-level refund metrics in Analytics.
} & GATrackingEventValue

export type GATrackingSelectItemEvent = {
  name: GATrackingEventName.SELECT_ITEM
  item_list_id?: string
  item_list_name?: string
  items: GATrackingEventItem[] // The items array is expected to have a single element, representing the selected item. If multiple elements are provided, only the first element in items will be used.
}
export type GATrackingViewCartEvent = {
  name: GATrackingEventName.VIEW_CART
  items: GATrackingEventItem[]
} & GATrackingEventValue

export type GATrackingEvent =
  | GATrackingAddPaymentInfoEvent
  | GATrackingAddShippingInfoEvent
  | GATrackingAddToCartEvent
  | GATrackingAddToWishlistEvent
  | GATrackingBeginCheckoutEvent
  | GATrackingEarnVirtualCurrencyEvent
  | GATrackingGenerateLeadEvent
  | GATrackingJoinGroupEvent
  | GATrackingLevelEndEvent
  | GATrackingLevelStartEvent
  | GATrackingLevelUpEvent
  | GATrackingLoginEvent
  | GATrackingPostScoreEvent
  | GATrackingPurchaseEvent
  | GATrackingRefundEvent
  | GATrackingRemoveFromCartEvent
  | GATrackingSearchEvent
  | GATrackingSelectContentEvent
  | GATrackingSelectItemEvent
  | GATrackingSelectPromotionEvent
  | GATrackingShareEvent
  | GATrackingSignUpEvent
  | GATrackingSpendVirtualCurrencyEvent
  | GATrackingTutorialBeginEvent
  | GATrackingTutorialCompleteEvent
  | GATrackingUnlockAchievementEvent
  | GATrackingViewCartEvent
  | GATrackingViewItemEvent
  | GATrackingViewItemListEvent
  | GATrackingViewPromotionEvent

/** Facebook Pixel */

export enum FBTrackingEventName {
  ADD_PAYMENT_INFO = 'AddPaymentInfo',
  ADD_TO_CART = 'AddToCart',
  ADD_TO_WISHLIST = 'AddToWishlist',
  COMPLETE_REGISTRATION = 'CompleteRegistration',
  CONTACT = 'Contact',
  CUSTOMIZE_PRODUCT = 'CustomizeProduct',
  DONATE = 'Donate',
  FIND_LOCATION = 'FindLocation',
  INITIATE_CHECKOUT = 'InitiateCheckout',
  LEAD = 'Lead',
  PURCHASE = 'Purchase',
  SCHEDULE = 'Schedule',
  SEARCH = 'Search',
  START_TRIAL = 'StartTrial',
  SUBMIT_APPLICATION = 'SubmitApplication',
  SUBSCRIBE = 'Subscribe',
  VIEW_CONTENT = 'ViewContent',
}

export type FBTrackingEventItem = {
  content_ids?: string[]
  contents?: {
    id: string
    quantity: number
  }[]
}
export type FBTrackingEventValue = {
  currency?: Currency
  value?: number
}

export type FBTrackingAddPaymentInfoEvent = {
  name: FBTrackingEventName.ADD_PAYMENT_INFO
} & FBTrackingEventValue &
  FBTrackingEventItem

export type FBTrackingAddToCartEvent = {
  name: FBTrackingEventName.ADD_TO_CART
  content_name?: string
  content_type: 'product' | 'product_group'
} & FBTrackingEventValue &
  FBTrackingEventItem

export type FBTrackingAddToWishlistEvent = {
  name: FBTrackingEventName.ADD_TO_WISHLIST
  content_name?: string
  content_type: 'product' | 'product_group'
} & FBTrackingEventValue &
  FBTrackingEventItem

export type FBTrackingCompleteRegistrationEvent = {
  name: FBTrackingEventName.COMPLETE_REGISTRATION
  content_name?: string
  status?: boolean
} & FBTrackingEventValue

export type FBTrackingContactEvent = {
  name: FBTrackingEventName.CONTACT
}
export type FBTrackingCustomizeProductEvent = {
  name: FBTrackingEventName.CUSTOMIZE_PRODUCT
}
export type FBTrackingDonateEvent = {
  name: FBTrackingEventName.DONATE
}
export type FBTrackingFindLocationEvent = {
  name: FBTrackingEventName.FIND_LOCATION
}
export type FBTrackingInitiateCheckoutEvent = {
  name: FBTrackingEventName.INITIATE_CHECKOUT
  content_category?: string
  content_name?: string
  num_items?: number
} & FBTrackingEventValue &
  FBTrackingEventItem

export type FBTrackingLeadEvent = {
  name: FBTrackingEventName.LEAD
  content_category?: string
  content_name?: string
} & FBTrackingEventValue

export type FBTrackingPurchaseEvent = {
  name: FBTrackingEventName.PURCHASE
  content_name?: string
  content_type: 'product' | 'product_group'
  num_items?: number
} & Required<FBTrackingEventValue> &
  FBTrackingEventItem

export type FBTrackingScheduleEvent = {
  name: FBTrackingEventName.SCHEDULE
}
export type FBTrackingSearchEvent = {
  name: FBTrackingEventName.SEARCH
  content_category?: string
  content_type: 'product' | 'product_group'
  search_string?: string
} & FBTrackingEventValue &
  FBTrackingEventItem

export type FBTrackingStartTrialEvent = {
  name: FBTrackingEventName.START_TRIAL
  predicted_ltv?: number
} & FBTrackingEventValue

export type FBTrackingSubmitApplicationEvent = {
  name: FBTrackingEventName.SUBMIT_APPLICATION
}
export type FBTrackingSubscribeEvent = {
  name: FBTrackingEventName.SUBSCRIBE
  predicted_ltv?: number
} & FBTrackingEventValue

export type FBTrackingViewContentEvent = {
  name: FBTrackingEventName.VIEW_CONTENT
  content_name?: string
  content_category?: string
  content_type: 'product' | 'product_group'
} & FBTrackingEventValue &
  FBTrackingEventItem

export type FBTrackingEvent =
  | FBTrackingAddPaymentInfoEvent
  | FBTrackingAddToCartEvent
  | FBTrackingAddToWishlistEvent
  | FBTrackingCompleteRegistrationEvent
  | FBTrackingContactEvent
  | FBTrackingCustomizeProductEvent
  | FBTrackingDonateEvent
  | FBTrackingFindLocationEvent
  | FBTrackingInitiateCheckoutEvent
  | FBTrackingLeadEvent
  | FBTrackingPurchaseEvent
  | FBTrackingScheduleEvent
  | FBTrackingSearchEvent
  | FBTrackingStartTrialEvent
  | FBTrackingSubmitApplicationEvent
  | FBTrackingSubscribeEvent
  | FBTrackingViewContentEvent
