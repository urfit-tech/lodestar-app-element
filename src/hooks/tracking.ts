import dayjs from 'dayjs'
import { useApp } from '../contexts/AppContext'
import { FBTrackingEvent, GATrackingEvent } from '../types/tracking'
import { Resource, ResourceType } from './resource'

export const sendEventToDataLayer = (
  data: any,
  callbacks?: { beforeSend?: (dataLayer: any[]) => void; afterSend?: (dataLayer: any[]) => void },
) => {
  ;(window as any).dataLayer = (window as any).dataLayer || []
  callbacks?.beforeSend?.((window as any).dataLayer)
  ;(window as any).dataLayer.push(data)
  callbacks?.afterSend?.((window as any).dataLayer)
}

const sendEventToGA = (event: GATrackingEvent) => {
  ;(window as any).gtag = (window as any).gtag || null
  const { name, ...options } = event
  ;(window as any).gtag('event', name, options)
}

const sendEventToFB = (event: FBTrackingEvent) => {
  ;(window as any).fbq = (window as any).fbq || null
  const { name, ...options } = event
  ;(window as any).fbq('track', name, options)
}

const convertProductType: (originalType: ResourceType, toMetaProduct: boolean) => ResourceType = (
  originalType: ResourceType,
  toMetaProduct: boolean = true,
) => {
  switch (originalType) {
    case 'program_content':
      return toMetaProduct ? ('program' as const) : originalType
    case 'program_plan':
      return toMetaProduct ? ('program' as const) : originalType
    case 'program_package_plan':
      return toMetaProduct ? ('program_package' as const) : originalType
    case 'activity_ticket':
      return toMetaProduct ? ('activity' as const) : originalType
    case 'merchandise_spec':
      return toMetaProduct ? ('merchandise' as const) : originalType
    case 'project_plan':
      return toMetaProduct ? ('project' as const) : originalType
    default:
      return originalType
  }
}

type CwProductBaseType = {
  id: string
  type: string
  item: string | null
  title: string
  url: string
  authors: { id: string; name: string }[] | null
  channels: { master: { id: string[] } }
  keywords: string
  price?: number
  utmSource?: string
}

type CwProductContentType = CwProductBaseType & {
  content_id: string
  content_name: string
}

type CwProductSalesType = CwProductBaseType & {
  price: number
}

const convertCwProduct: (
  resource: Resource,
  utmSource?: string,
  options?: { separator: string },
) => CwProductBaseType | CwProductContentType | CwProductSalesType = (
  resource: Resource,
  utmSource: string | undefined,
  options: { separator: string } = { separator: '|' },
) => {
  const baseProduct = {
    id: resource.id,
    type: convertProductType(resource.type, true),
    target: resource.metaId?.split(':')[2] || '',
    title: resource.title,
    item: resource.sku || null,
    url: window.location.href,
    authors: resource.owners,
    channels: {
      master: {
        id: resource.categories || [],
      },
    },
    keywords:
      resource?.tags?.join(options.separator) ||
      document.querySelector('meta[name="keywords"]')?.getAttribute('content') ||
      '',
    utm_source: utmSource || '',
  }
  switch (resource.type) {
    case 'program_content':
      return {
        ...baseProduct,
        id: (resource.metaId && resource.metaId.split(':')[2]) || '',
        title: resource.variants?.join(options.separator) || '',
        content_id: resource.id,
        content_name: resource.title,
      }
    case 'post':
      return baseProduct
    default:
      return {
        ...baseProduct,
        price: resource.price,
      }
  }
}

export const useTracking = (trackingOptions = { separator: '|' }) => {
  const { settings, currencyId: appCurrencyId, id: appId, loading: isAppLoading } = useApp()
  const brand = settings['name'] || document.title
  const EC_ITEM_MAP_KEY_PREFIX = `ga.event.item`

  // clear localStorage cache
  for (const key in localStorage) {
    if (key.startsWith(EC_ITEM_MAP_KEY_PREFIX) && key.endsWith('.expired_at')) {
      const itemId = key.split('.')[3]
      const expiredAt = dayjs(localStorage[key]).add(1, 'day')
      if (dayjs() > expiredAt) {
        localStorage.removeItem(key)
        localStorage.removeItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`)
      }
    }
  }

  return {
    login: () => {
      console.log('login')
      // const gaEvent: GATrackingLoginEvent = {}
      // sendEventToDataLayer({ event: gaEvent.name, ...gaEvent })
      // sendEventToGA(gaEvent)
      // sendEventToFB
    },
    search: () => {
      console.log('search')
    },
    selectContent: () => {
      console.log('selectContent')
    },
    share: () => {
      console.log('share')
    },
    signUp: () => {
      console.log('signUp')
      // fb: completeRegistration
    },
    tutorialBegin: () => {
      console.log('tutorialBegin')
    },
    tutorialComplete: () => {
      console.log('tutorialComplete')
    },
    earnVirtualCurrency: () => {
      console.log('earnVirtualCurrency')
    },
    spendVirtualCurrency: () => {
      console.log('spendVirtualCurrency')
    },
    joinGroup: () => {
      console.log('joinGroup')
    },
    levelStart: () => {
      console.log('levelStart')
    },
    levelEnd: () => {
      console.log('levelEnd')
    },
    levelUp: () => {
      console.log('levelUp')
    },
    postScore: () => {
      console.log('postScore')
    },
    unlockAchievement: () => {
      console.log('unlockAchievement')
    },
    purchase: () => {
      console.log('purchase')
    },
    addToCart: () => {
      console.log('addToCart')
      // sendToDataLayer('add_to_cart', {}, { beforeSend: dataLayer => dataLayer.push({ ecommerce: null }) })
    },
    addToWishlist: () => {
      console.log('addToWishlist')
    },
    viewItemList: () => {
      console.log('viewItemList')
    },
    viewItem: () => {
      console.log('viewItem')
      // fb: viewContent
    },
    viewPromotion: () => {
      console.log('viewPromotion')
    },
    selectPromotion: () => {
      console.log('selectPromotion')
    },
    removeFromCart: () => {
      console.log('removeFromCart')
    },
    beginCheckout: () => {
      console.log('beginCheckout')
      // fb: initiateCheckout
    },
    addShippingInfo: () => {
      console.log('addShippingInfo')
    },
    addPaymentInfo: () => {
      console.log('addPaymentInfo')
      // fb: submitApplication
    },
    generateLead: () => {
      console.log('generateLead')
      // fb: lead
    },
    refund: () => {
      console.log('refund')
    },
    selectItem: () => {
      console.log('selectItem')
    },
    viewCart: () => {
      console.log('viewCart')
    },
    contact: () => {
      console.log('contact')
    },
    customizeProduct: () => {
      console.log('customizeProduct')
    },
    donate: () => {
      console.log('donate')
    },
    subscribe: () => {
      console.log('subscribe')
    },
    findLocation: () => {
      console.log('findLocation')
    },
    schedule: () => {
      console.log('schedule')
    },
    startTrial: () => {
      console.log('startTrial')
    },
  }
}
