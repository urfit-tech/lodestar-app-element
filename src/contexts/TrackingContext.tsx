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

type TrackingPayload = {
  id: string
  type: 'program' | 'activity' | 'program_package' | 'project' | 'post'
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
  const impress = async (list: string, trackingPayload: TrackingPayload[], eventName = 'productImpression') => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: eventName,
      ecommerce: {
        currencyCode: app.currencyId || options.currencyId,
        impressions: trackingPayload.map(metaProduct => ({
          id: metaProduct.options?.sku || metaProduct.id,
          name: metaProduct.title,
          price: metaProduct.price,
          brand: document.title,
          category: metaProduct.categories.join(options.separator),
          variant: metaProduct.variants.join(options.separator),
          quantity: metaProduct.quantity,
          list,
          position: metaProduct.position,
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
          products: trackingPayload.map(metaProduct => ({
            id: metaProduct.options?.sku || metaProduct.id,
            name: metaProduct.title,
            price: metaProduct.price,
            brand: document.title,
            category: metaProduct.categories.join(options.separator),
            variant: metaProduct.variants.join(options.separator),
            position: metaProduct.position,
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
          products: trackingPayload.map(metaProduct => ({
            id: metaProduct.options?.sku || metaProduct.id,
            name: metaProduct.title,
            price: metaProduct.price,
            brand: document.title,
            category: metaProduct.categories.join(options.separator),
            variant: metaProduct.variants.join(options.separator),
          })),
        },
      },
    })
    if (Boolean(Number(app.settings['tracking.cw.enabled']))) {
      const cwProducts = trackingPayload.map(metaProduct => ({
        id: metaProduct.options?.sku || metaProduct.id,
        type: metaProduct.type,
        item: metaProduct.options?.['sku'],
        title: metaProduct.title,
        url: window.location.href,
        price: metaProduct.price,
        authors: metaProduct.options?.authors || [],
        channels: {
          master: {
            id: metaProduct.categories,
          },
        },
        keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
        content_id: metaProduct.options?.contentId || '',
        content_name: metaProduct.options?.contentName || '',
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
          products: trackingPayload.map(metaProduct => ({
            id: metaProduct.options?.sku || metaProduct.id,
            name: metaProduct.title,
            price: metaProduct.price,
            brand: document.title,
            category: metaProduct.categories.join(options.separator),
            variant: metaProduct.variants.join(options.separator),
            quantity: metaProduct.quantity,
          })),
        },
      },
    })
  }
  const removeFromCart = async (trackingPayload: TrackingPayload[], eventName = 'removeFromCart') => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: eventName,
      ecommerce: {
        remove: {
          products: trackingPayload.map(metaProduct => ({
            id: metaProduct.options?.sku || metaProduct.id,
            name: metaProduct.title,
            price: metaProduct.price,
            brand: document.title,
            category: metaProduct.categories.join(options.separator),
            variant: metaProduct.variants.join(options.separator),
            quantity: metaProduct.quantity,
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
          products: trackingPayload.map(metaProduct => ({
            id: metaProduct.options?.sku || metaProduct.id,
            name: metaProduct.title,
            price: metaProduct.price,
            brand: document.title,
            category: metaProduct.categories.join(options.separator),
            variant: metaProduct.variants.join(options.separator),
            quantity: metaProduct.quantity,
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
          products: trackingPayload.map(metaProduct => ({
            id: metaProduct.options?.sku || metaProduct.id,
            name: metaProduct.title,
            price: metaProduct.price,
            brand: document.title,
            category: metaProduct.categories.join(options.separator),
            variant: metaProduct.variants.join(options.separator),
            quantity: metaProduct.quantity,
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
  return { impress, click, detail, addToCart, removeFromCart, checkout, addPaymentInfo, purchase, loggedIn }
}

export default TrackingContext
