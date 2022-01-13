import { useApolloClient } from '@apollo/react-hooks'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import { sum } from 'ramda'
import { useEffect } from 'react'
import ReactPixel from 'react-facebook-pixel'
import { hotjar } from 'react-hotjar'
import { useApp } from '../contexts/AppContext'
import hasura from '../hasura'
import { notEmpty } from '../helpers'

export type TrackingInstance = {
  type:
    | 'program_package'
    | 'program_package_plan'
    | 'program'
    | 'program_content'
    | 'program_plan'
    | 'activity'
    | 'activity_ticket'
    | 'podcast_album'
    | 'podcast_plan'
    | 'podcast_program'
    | 'member_shop'
    | 'merchandise'
    | 'merchandise_spec'
    | 'project'
    | 'post'
    | 'member'
  id: string
}

export const useTracking = (trackingOptions = { separator: '|', currencyId: 'TWD' }) => {
  const { settings, currencyId: appCurrencyId, id: appId } = useApp()
  const apolloClient = useApolloClient()
  const currencyId = appCurrencyId || trackingOptions.currencyId
  const enabledCW = Boolean(Number(settings['tracking.cw.enabled']))
  const enabledPixel = settings['tracking.fb_pixel_id']
  const enabledHotjar = settings['tracking.hotjar_id'] && settings['tracking.hotjar_sv']
  // initialize
  useEffect(() => {
    try {
      enabledPixel && ReactPixel.init(settings['tracking.fb_pixel_id'])
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.error('cannot initialize facebook pixel', error)
    }
    try {
      enabledHotjar &&
        hotjar.initialize(parseInt(settings['tracking.hotjar_id']), parseInt(settings['tracking.hotjar_sv']))
    } catch (error) {
      process.env.NODE_ENV === 'development' && console.error('cannot initialize hotjar', error)
    }
  }, [enabledHotjar, enabledPixel, settings])

  return {
    view: async () => {},
    impress: async (
      instances: TrackingInstance[],
      options?: {
        collection?: string
      },
    ) => {
      const trackingPayload = await getTrackingInstancesPayload(appId, apolloClient, instances)
      // EEC -> GTM dataLayer
      ;(window as any).dataLayer = (window as any).dataLayer || []
      const impressions = trackingPayload
        .map((payload, idx) =>
          payload
            ? {
                id: payload.sku || payload.id,
                name: payload.title,
                price: payload.price,
                brand: document.title,
                category: payload.categories?.join(trackingOptions.separator),
                variant: payload.variants?.join(trackingOptions.separator),
                quantity: 1, // TODO: use the inventory
                list: options?.collection,
                position: idx,
              }
            : null,
        )
        .filter(notEmpty)
      if (impressions.length > 0) {
        ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
        ;(window as any).dataLayer.push({
          event: 'productImpression',
          ecommerce: {
            currencyCode: currencyId,
            impressions,
          },
        })
      }
    },
    click: async (
      instance: TrackingInstance,
      options?: {
        collection?: string
        position?: number
      },
    ) => {
      const trackingPayload = await getTrackingInstancesPayload(appId, apolloClient, [instance])
      // EEC -> GTM dataLayer
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'productClick',
        ecommerce: {
          currencyCode: currencyId,
          click: {
            actionField: { list: options?.collection },
            products: trackingPayload
              .map(payload =>
                payload
                  ? {
                      id: payload.sku || payload.id,
                      name: payload.title,
                      price: payload.price,
                      brand: document.title,
                      category: payload.categories?.join(trackingOptions.separator),
                      variant: payload.variants?.join(trackingOptions.separator),
                      position: options?.position,
                    }
                  : null,
              )
              .filter(notEmpty),
          },
        },
      })
    },
    detail: async (
      instance: TrackingInstance,
      options?: {
        collection?: string
      },
    ) => {
      const trackingPayload = await getTrackingInstancesPayload(appId, apolloClient, [instance])
      // EEC -> GTM dataLayer
      ;(window as any).dataLayer = (window as any).dataLayer || []
      const ecProducts = trackingPayload
        .map(payload =>
          payload
            ? {
                id: payload.sku || payload.id,
                name: payload.title,
                price: payload.price,
                brand: document.title,
                category: payload.categories?.join(trackingOptions.separator),
                variant: payload.variants?.join(trackingOptions.separator),
              }
            : null,
        )
        .filter(notEmpty)
      if (ecProducts.length > 0) {
        ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
        ;(window as any).dataLayer.push({
          event: 'detail',
          ecommerce: {
            currencyCode: currencyId,
            detail: {
              actionField: { list: options?.collection },
              products: ecProducts,
            },
          },
        })
      }

      if (enabledCW) {
        const cwProducts = trackingPayload
          .map(payload =>
            payload
              ? {
                  id: payload.id,
                  type: payload.type,
                  item: payload?.sku,
                  title: payload?.title,
                  url: window.location.href,
                  price: payload?.price,
                  authors: payload.variants?.map(v => ({ name: v })),
                  channels: {
                    master: {
                      id: payload.categories?.join(trackingOptions.separator),
                    },
                  },
                  keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
                }
              : null,
          )
          .filter(notEmpty)
        if (cwProducts.length > 0) {
          ;(window as any).dataLayer.push({
            event: 'cwData',
            itemData: {
              products: cwProducts,
              program: cwProducts[0],
              article: cwProducts[0],
            },
          })
        }
      }
    },
    addToCart: async (
      instance: TrackingInstance,
      options?: {
        direct?: boolean
        quantity?: number
      },
    ) => {
      const trackingPayload = await getTrackingInstancesPayload(appId, apolloClient, [instance])
      // EEC -> GTM dataLayer
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: options?.direct ? 'addToCartNow' : 'addToCart',
        ecommerce: {
          currencyCode: currencyId,
          add: {
            products: trackingPayload
              .map(payload =>
                payload
                  ? {
                      id: payload.sku || payload.id,
                      name: payload.title,
                      price: payload.price,
                      brand: document.title,
                      category: payload.categories?.join(trackingOptions.separator),
                      variant: payload.variants?.join(trackingOptions.separator),
                      quantity: 1, // TODO: use the inventory
                    }
                  : null,
              )
              .filter(notEmpty),
          },
        },
      })
    },
    removeFromCart: async (
      instance: TrackingInstance,
      options?: {
        quantity?: number
      },
    ) => {
      const trackingPayload = await getTrackingInstancesPayload(appId, apolloClient, [instance])
      // EEC -> GTM dataLayer
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'removeFromCart',
        ecommerce: {
          currencyCode: currencyId,
          remove: {
            products: trackingPayload
              .map(payload =>
                payload
                  ? {
                      id: payload.sku || payload.id,
                      name: payload.title,
                      price: payload.price,
                      brand: document.title,
                      category: payload.categories?.join(trackingOptions.separator),
                      variant: payload.variants?.join(trackingOptions.separator),
                      quantity: 1, // TODO: use the inventory
                    }
                  : null,
              )
              .filter(notEmpty),
          },
        },
      })
    },
    checkout: async (
      instances: TrackingInstance[],
      options?: {
        step?: number
      },
    ) => {
      const trackingPayload = await getTrackingInstancesPayload(appId, apolloClient, instances)
      // EEC -> GTM dataLayer
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'checkout',
        ecommerce: {
          currencyCode: currencyId,
          checkout: {
            actionField: { step: options?.step || 1 },
            products: trackingPayload
              .map((payload, idx) =>
                payload
                  ? {
                      id: payload.sku || payload.id,
                      name: payload.title,
                      price: payload.price,
                      brand: document.title,
                      category: payload.categories?.join(trackingOptions.separator),
                      variant: payload.variants?.join(trackingOptions.separator),
                      quantity: 1, // TODO: use the cart product
                    }
                  : null,
              )
              .filter(notEmpty),
          },
        },
      })
      if (enabledCW) {
        const cwProducts = trackingPayload
          .map(payload =>
            payload
              ? {
                  id: payload.id,
                  type: payload.type,
                  item: payload?.sku,
                  title: payload?.title,
                  url: window.location.href,
                  price: payload?.price,
                  authors: payload.variants?.map(v => ({ name: v })),
                  channels: {
                    master: {
                      id: payload.categories?.join(trackingOptions.separator),
                    },
                  },
                  keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
                }
              : null,
          )
          .filter(notEmpty)
        ;(window as any).dataLayer.push({
          event: 'cwData',
          itemData: {
            products: cwProducts,
            program: cwProducts[0],
            article: cwProducts[0],
          },
        })
      }
    },
    addPaymentInfo: async (
      paymentNo: string,
      options?: {
        step?: number
      },
    ) => {
      const { data } = await apolloClient.query<hasura.GET_PAYMENT, hasura.GET_PAYMENTVariables>({
        query: gql`
          query GET_PAYMENT($paymentNo: numeric!) {
            payment_log_by_pk(no: $paymentNo) {
              gateway
              options
            }
          }
        `,
        variables: {
          paymentNo: Number(paymentNo),
        },
      })
      // EEC -> GTM dataLayer
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'checkoutOption',
        ecommerce: {
          checkout_option: {
            actionField: {
              step: options?.step || 2,
              option: `${data.payment_log_by_pk?.gateway || 'unknown'}_${
                data.payment_log_by_pk?.options.paymentMethod
              }`,
            },
          },
        },
      })
    },
    purchase: async (
      orderId: string,
      options?: {
        step?: number
      },
    ) => {
      const { data } = await apolloClient.query<hasura.GET_ORDER, hasura.GET_ORDERVariables>({
        query: gql`
          query GET_ORDER($orderId: String!) {
            order_log_by_pk(id: $orderId) {
              order_products {
                product_id
                name
                price
                options
              }
              order_discounts {
                name
                price
              }
            }
          }
        `,
        variables: {
          orderId,
        },
      })
      const trackingPayload = await getTrackingInstancesPayload(
        appId,
        apolloClient,
        data.order_log_by_pk?.order_products.map(v => {
          const [type, id] = v.product_id.split('_')
          return { type, id } as TrackingInstance
        }) || [],
      )
      // EEC -> GTM dataLayer
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'purchase',
        ecommerce: {
          purchase: {
            actionField: {
              id: orderId,
              affiliation: document.title,
              revenue:
                sum(data.order_log_by_pk?.order_products.map(v => v.price) || []) -
                sum(data.order_log_by_pk?.order_discounts.map(v => v.price) || []),
              coupon: data.order_log_by_pk?.order_discounts.map(v => v.name).join(trackingOptions.separator),
            },
            products: trackingPayload
              .map(payload =>
                payload
                  ? {
                      id: payload.sku || payload.id,
                      name: payload.title,
                      price: payload.price,
                      brand: document.title,
                      category: payload.categories?.join(trackingOptions.separator),
                      variant: payload.variants?.join(trackingOptions.separator),
                      quantity: 1, // TODO: use the inventory
                    }
                  : null,
              )
              .filter(notEmpty),
          },
        },
      })
      if (enabledCW) {
        const cwProducts = trackingPayload
          .map(payload =>
            payload
              ? {
                  id: payload.id,
                  type: payload.type,
                  item: payload?.sku,
                  title: payload?.title,
                  url: window.location.href,
                  price: payload?.price,
                  authors: payload.variants?.map(v => ({ name: v })),
                  channels: {
                    master: {
                      id: payload.categories?.join(trackingOptions.separator),
                    },
                  },
                  keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
                }
              : null,
          )
          .filter(notEmpty)
        ;(window as any).dataLayer.push({
          event: 'cwData',
          itemData: {
            products: cwProducts,
            program: cwProducts[0],
            article: cwProducts[0],
          },
        })
      }
    },
  }
}

type TrackingInstancePayload = {
  id: string
  urn: string
  type: string
  title: string
  sku?: string
  price?: number
  categories?: string[]
  variants?: string[]
}
const getTrackingInstancesPayload = async (
  appId: string,
  apolloClient: ApolloClient<object>,
  trackingInstances: TrackingInstance[],
): Promise<TrackingInstancePayload[]> => {
  const trackingResourceIds = trackingInstances.map(instance => `${appId}:${instance.type}:${instance.id}`)
  const { data } = await apolloClient.query<hasura.GET_RESOURCE_COLLECTION, hasura.GET_RESOURCE_COLLECTIONVariables>({
    query: gql`
      query GET_RESOURCE_COLLECTION($resourceIds: [String!]!) {
        resource(where: { id: { _in: $resourceIds } }) {
          id
          name
          price
          categories
          variants
          sku
        }
      }
    `,
    variables: { resourceIds: trackingResourceIds },
  })
  return trackingResourceIds
    .map((trackingResourceId, idx) => {
      const resourceData = data.resource.find(resource => (resource.id = trackingResourceId))
      console.log(resourceData)
      return resourceData
        ? {
            id: trackingInstances[idx].id,
            type: trackingInstances[idx].id,
            urn: resourceData.id || '',
            title: resourceData.name || '',
            price: resourceData.price || undefined,
            categories: resourceData.categories || [],
            variants: resourceData.variants || [],
            sku: resourceData.sku || undefined,
          }
        : null
    })
    .filter(notEmpty)
}
