import { createContext, useEffect } from 'react'
import ReactPixel from 'react-facebook-pixel'
import { hotjar } from 'react-hotjar'
import { getCookie } from '../hooks/util'
import { PaymentGatewayType, PaymentMethodType } from '../types/checkout'
import { Member, MemberProvider } from '../types/data'
import { useApp } from './AppContext'

const TrackingContext = createContext(null)
export const TrackingProvider: React.FC = ({ children }) => {
  const { settings } = useApp()

  // initialize
  useEffect(() => {
    try {
    } catch (error) {
      if (settings['tracking.fb_pixel_id']) {
        ReactPixel.init(settings['tracking.fb_pixel_id'])
      }
      process.env.NODE_ENV === 'development' && console.error('cannot initialize facebook pixel', error)
    }
    try {
      settings['tracking.hotjar_id'] &&
        settings['tracking.hotjar_sv'] &&
        hotjar.initialize(parseInt(settings['tracking.hotjar_id']), parseInt(settings['tracking.hotjar_sv']))
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.error('cannot initialize hotjar', error)
    }
  }, [settings])
  return <TrackingContext.Provider value={null}>{children}</TrackingContext.Provider>
}

export type TrackingPayload = {
  id: string
  type: 'program' | 'activity' | 'program_package' | 'project' | 'post' | 'other'
  title: string
  price: number
  categories: string[]
  variants: string[]
  quantity: number
  position: number
  options?: {
    sku?: string
    authors?: { id: string; name: string }[]
    contentId?: string
    contentName?: string
  }
}

export const useEvent = (options = { separator: '|', currencyId: 'TWD' }) => {
  const app = useApp()
  const viewPage = async () => {}
  const impress = async (list: string, trackingPayload: TrackingPayload[], eventName = 'productImpression') => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: eventName,
      ecommerce: {
        currencyCode: app.currencyId || options.currencyId,
        impressions: trackingPayload.map(payload => ({
          id: payload.options?.sku || payload.id,
          name: payload.title,
          price: payload.price,
          brand: document.title,
          category: payload.categories.join(options.separator),
          variant: payload.variants.join(options.separator),
          quantity: payload.quantity,
          list,
          position: payload.position,
        })),
      },
    })
  }
  const click = async (list: string, trackingPayload: TrackingPayload[], eventName = 'productClick') => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: eventName,
      ecommerce: {
        currencyCode: app.currencyId || options.currencyId,
        click: {
          actionField: { list },
          products: trackingPayload.map(payload => ({
            id: payload.options?.sku || payload.id,
            name: payload.title,
            price: payload.price,
            brand: document.title,
            category: payload.categories.join(options.separator),
            variant: payload.variants.join(options.separator),
            position: payload.position,
          })),
        },
      },
    })
  }
  const detail = async (list: string, trackingPayload: TrackingPayload[], eventName = 'detail') => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: eventName,
      ecommerce: {
        detail: {
          actionField: { list },
          products: trackingPayload.map(payload => ({
            id: payload.options?.sku || payload.id,
            name: payload.title,
            price: payload.price,
            brand: document.title,
            category: payload.categories.join(options.separator),
            variant: payload.variants.join(options.separator),
          })),
        },
      },
    })
    if (Boolean(Number(app.settings['tracking.cw.enabled']))) {
      const cwProducts = trackingPayload.map(payload => ({
        id: payload.options?.sku || payload.id,
        type: payload.type,
        item: payload.options?.['sku'],
        title: payload.title,
        url: window.location.href,
        price: payload.price,
        authors: payload.options?.authors || [],
        channels: {
          master: {
            id: payload.categories,
          },
        },
        keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
        content_id: payload.options?.contentId || '',
        content_name: payload.options?.contentName || '',
      }))
      ;(window as any).dataLayer.push({ itemData: null }) // Clear the previous item object.
      ;(window as any).dataLayer.push({
        event: 'cwData',
        itemData: {
          products: cwProducts,
          article: cwProducts[0],
          program: cwProducts[0],
        },
      })
    }
  }
  const addToCart = async (trackingPayload: TrackingPayload[], eventName = 'addToCart') => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: eventName,
      ecommerce: {
        currencyCode: app.currencyId || options.currencyId,
        add: {
          products: trackingPayload.map(payload => ({
            id: payload.options?.sku || payload.id,
            name: payload.title,
            price: payload.price,
            brand: document.title,
            category: payload.categories.join(options.separator),
            variant: payload.variants.join(options.separator),
            quantity: payload.quantity,
          })),
        },
      },
    })
    trackingPayload.forEach(payload => {
      ReactPixel.track('AddToCart', {
        content_name: payload.title,
        value: payload.price,
        currency: app.currencyId || options.currencyId,
      })
    })
  }
  const removeFromCart = async (trackingPayload: TrackingPayload[], eventName = 'removeFromCart') => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: eventName,
      ecommerce: {
        remove: {
          products: trackingPayload.map(payload => ({
            id: payload.options?.sku || payload.id,
            name: payload.title,
            price: payload.price,
            brand: document.title,
            category: payload.categories.join(options.separator),
            variant: payload.variants.join(options.separator),
            quantity: payload.quantity,
          })),
        },
      },
    })
  }
  const checkout = async (trackingPayload: TrackingPayload[], eventName = 'checkout', step = 1) => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: eventName,
      ecommerce: {
        checkout: {
          actionField: { step },
          products: trackingPayload.map(payload => ({
            id: payload.options?.sku || payload.id,
            name: payload.title,
            price: payload.price,
            brand: document.title,
            category: payload.categories.join(options.separator),
            variant: payload.variants.join(options.separator),
            quantity: payload.quantity,
          })),
        },
      },
    })
  }
  const addPaymentInfo = async (
    payment: { gateway: PaymentGatewayType; method: PaymentMethodType },
    eventName = 'checkoutOption',
    step = 2,
  ) => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: eventName,
      ecommerce: {
        checkout_option: {
          actionField: { step, option: `${payment.gateway}.${payment.method}` },
        },
      },
    })
  }
  const purchase = async (
    trackingPayload: TrackingPayload[],
    metaOrder: { id: string; price: number; coupons: string[] },
    eventName = 'purchase',
  ) => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: eventName,
      ecommerce: {
        purchase: {
          actionField: {
            id: metaOrder.id,
            affiliation: document.title,
            revenue: metaOrder.price.toString(),
            coupon: metaOrder.coupons.join(options.separator),
          },
          products: trackingPayload.map(payload => ({
            id: payload.options?.sku || payload.id,
            name: payload.title,
            price: payload.price,
            brand: document.title,
            category: payload.categories.join(options.separator),
            variant: payload.variants.join(options.separator),
            quantity: payload.quantity,
          })),
        },
      },
    })
  }
  const loggedIn = async (member: Pick<Member, 'id' | 'email' | 'provider'>, eventName = 'loggedIn') => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({
      event: eventName,
      member: {
        id: member.id,
        email: member.email,
        provider: member.provider,
      },
    })
    if (Boolean(Number(app.settings['tracking.cw.enabled']))) {
      const provider = member.provider[app.id as MemberProvider] || {}
      ;(window as any).dataLayer.push({ memberData: null }) // Clear the previous item object.
      ;(window as any).dataLayer.push({
        event: 'cwData',
        memberData: {
          social_id: provider.social_id || '',
          uid_id: provider.uid || '',
          uuid: provider.uuid || '',
          env: process.env.NODE_ENV === 'production' ? 'prod' : 'develop',
          email: member.email,
          dmp_id: getCookie('__eruid'),
        },
      })
    }
  }
  return { viewPage, impress, click, detail, addToCart, removeFromCart, checkout, addPaymentInfo, purchase, loggedIn }
}

export default TrackingContext
