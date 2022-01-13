import { useApolloClient } from '@apollo/react-hooks'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import { sum } from 'ramda'
import { useEffect } from 'react'
import ReactPixel from 'react-facebook-pixel'
import { hotjar } from 'react-hotjar'
import { useApp } from '../contexts/AppContext'
import { activityFamilyFields, programFamilyFields } from '../graphql/fragments'
import { getActivityFamilyQuery, getProgramFamilyQuery, getProgramPackageFamilyQuery } from '../graphql/queries'
import hasura from '../hasura'
import { getCurrentPrice, notEmpty } from '../helpers'

export type TrackingInstance = {
  type:
    | 'ProgramPackage'
    | 'ProgramPackagePlan'
    | 'Program'
    | 'ProgramContent'
    | 'ProgramPlan'
    | 'Activity'
    | 'ActivityTicket'
    | 'PodcastAlbum'
    | 'PodcastPlan'
    | 'PodcastProgram'
    | 'MemberShop'
    | 'Merchandise'
    | 'MerchandiseSpec'
    | 'Project'
    | 'Post'
    | 'Member'
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
      const trackingPayload = await getTrackingInstancesPayload(apolloClient, instances)
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
      const trackingPayload = await getTrackingInstancesPayload(apolloClient, [instance])
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
      const trackingPayload = await getTrackingInstancesPayload(apolloClient, [instance])
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
                  type:
                    payload.type === 'Program' || payload.type === 'ProgramPlan'
                      ? 'program'
                      : payload.type === 'ProgramPackage' || payload.type === 'ProgramPackagePlan'
                      ? 'program_package'
                      : payload.type === 'Activity' || payload.type === 'ActivityTicket'
                      ? 'activity'
                      : 'other',
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
      const trackingPayload = await getTrackingInstancesPayload(apolloClient, [instance])
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
      const trackingPayload = await getTrackingInstancesPayload(apolloClient, [instance])
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
      const trackingPayload = await getTrackingInstancesPayload(apolloClient, instances)
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
                  type:
                    payload.type === 'Program' || payload.type === 'ProgramPlan'
                      ? 'program'
                      : payload.type === 'ProgramPackage' || payload.type === 'ProgramPackagePlan'
                      ? 'program_package'
                      : payload.type === 'Activity' || payload.type === 'ActivityTicket'
                      ? 'activity'
                      : 'other',
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
                  type:
                    payload.type === 'Program' || payload.type === 'ProgramPlan'
                      ? 'program'
                      : payload.type === 'ProgramPackage' || payload.type === 'ProgramPackagePlan'
                      ? 'program_package'
                      : payload.type === 'Activity' || payload.type === 'ActivityTicket'
                      ? 'activity'
                      : 'other',
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

const getTrackingInstancesPayload = async (
  apolloClient: ApolloClient<object>,
  trackingInstances: TrackingInstance[],
) => {
  const productMap = await getProductMap(
    apolloClient,
    trackingInstances.map(instance => `${instance.type}_${instance.id}`),
  )
  const programRolesMap = await getProgramRolesMap(
    apolloClient,
    trackingInstances.map(instance => instance.id),
  )
  type TrackingInstancePayload = {
    id: string
    type: string
    title: string
    sku?: string
    price?: number
    categories?: string[]
    variants?: string[]
  }
  const promises: Promise<TrackingInstancePayload | null>[] = trackingInstances.map(instance => {
    const sku = productMap[`${instance.type}_${instance.id}`]?.sku || undefined
    switch (instance.type) {
      case 'ProgramPackage':
        return apolloClient
          .query<hasura.GET_PROGRAM_PACKAGE_FAMILY, hasura.GET_PROGRAM_PACKAGE_FAMILYVariables>({
            query: getProgramPackageFamilyQuery(programFamilyFields),
            variables: { programPackageId: instance.id },
          })
          .then(({ data }) => {
            const programPackageData = data.program_package[0]
            const programPackagePlanData = programPackageData?.program_package_plans[0]
            return programPackageData
              ? {
                  sku,
                  id: instance.id,
                  type: instance.type,
                  title: programPackageData.title,
                  price: programPackagePlanData && getCurrentPrice(programPackagePlanData),
                  categories: programPackageData.program_package_categories.map(v => v.category.name),
                  variants: programPackageData.program_package_programs
                    .flatMap(v =>
                      programRolesMap[v.program_id]
                        ?.filter(programRole => programRole.role === 'instructor')
                        .map(programRole => programRole.name),
                    )
                    .filter(notEmpty),
                }
              : null
          })
      case 'ProgramPackagePlan':
        return apolloClient
          .query<hasura.GET_PROGRAM_PACKAGE_FAMILY, hasura.GET_PROGRAM_PACKAGE_FAMILYVariables>({
            query: getProgramPackageFamilyQuery(programFamilyFields),
            variables: { programPackagePlanId: instance.id },
          })
          .then(({ data }) => {
            const programPackageData = data.program_package[0]
            const programPackagePlanData = programPackageData?.program_package_plans[0]
            return programPackageData && programPackagePlanData
              ? {
                  sku,
                  id: instance.id,
                  type: instance.type,
                  title: programPackageData.title,
                  price: programPackagePlanData && getCurrentPrice(programPackagePlanData),
                  categories: programPackageData.program_package_categories.map(v => v.category.name),
                  variants: programPackageData.program_package_programs
                    .flatMap(v =>
                      programRolesMap[v.program_id]
                        ?.filter(programRole => programRole.role === 'instructor')
                        .map(programRole => programRole.name),
                    )
                    .filter(notEmpty),
                }
              : null
          })

      case 'Program':
        return apolloClient
          .query<hasura.GET_PROGRAM_FAMILY, hasura.GET_PROGRAM_FAMILYVariables>({
            query: getProgramFamilyQuery(programFamilyFields),
            variables: { programId: instance.id },
          })
          .then(({ data }) => {
            const programData = data.program[0]
            const programPlanData = programData?.program_plans[0]
            return programData
              ? {
                  sku,
                  id: instance.id,
                  type: instance.type,
                  title: programData.title,
                  price: programPlanData && getCurrentPrice(programPlanData),
                  categories: programData.program_categories.map(v => v.category.name),
                  variants: programRolesMap[programData.id]
                    ?.filter(programRole => programRole.role === 'instructor')
                    .map(programRole => programRole.name)
                    .filter(notEmpty),
                }
              : null
          })

      case 'ProgramPlan':
        return apolloClient
          .query<hasura.GET_PROGRAM_FAMILY, hasura.GET_PROGRAM_FAMILYVariables>({
            query: getProgramFamilyQuery(programFamilyFields),
            variables: { programPlanId: instance.id },
          })
          .then(({ data }) => {
            const programData = data.program[0]
            const programPlanData = programData?.program_plans[0]
            return programData && programPlanData
              ? {
                  sku,
                  id: instance.id,
                  type: instance.type,
                  title: programData.title,
                  price: programPlanData && getCurrentPrice(programPlanData),
                  categories: programData.program_categories.map(v => v.category.name),
                  variants: programRolesMap[programData.id]
                    ?.filter(programRole => programRole.role === 'instructor')
                    .map(programRole => programRole.name)
                    .filter(notEmpty),
                }
              : null
          })

      case 'Activity':
        return apolloClient
          .query<hasura.GET_ACTIVITY_FAMILY, hasura.GET_ACTIVITY_FAMILYVariables>({
            query: getActivityFamilyQuery(activityFamilyFields),
            variables: { activityId: instance.id },
          })
          .then(({ data }) => {
            const activityData = data.activity[0]
            const activityTicketData = activityData?.activity_tickets[0]
            return activityData
              ? {
                  sku,
                  id: instance.id,
                  type: instance.type,
                  title: activityData.title,
                  price: activityTicketData && getCurrentPrice(activityTicketData),
                  categories: activityData.activity_categories.map(v => v.category.name),
                  variants: [activityData.organizer?.name].filter(notEmpty),
                }
              : null
          })

      case 'ActivityTicket':
        return apolloClient
          .query<hasura.GET_ACTIVITY_FAMILY, hasura.GET_ACTIVITY_FAMILYVariables>({
            query: getActivityFamilyQuery(activityFamilyFields),
            variables: { activityTicketId: instance.id },
          })
          .then(({ data }) => {
            const activityData = data.activity[0]
            const activityTicketData = activityData?.activity_tickets[0]
            return activityData && activityTicketData
              ? {
                  sku,
                  id: instance.id,
                  type: instance.type,
                  title: activityTicketData.title,
                  price: activityTicketData && getCurrentPrice(activityTicketData),
                  categories: activityData.activity_categories.map(v => v.category.name),
                  variants: [activityData.organizer?.name].filter(notEmpty),
                }
              : null
          })

      default:
        break
    }
    return Promise.resolve(null)
  })
  const result = await Promise.allSettled(promises)
  return result.map(res => (res.status === 'fulfilled' ? res.value : null))
}

const getProductMap = async (apolloClient: ApolloClient<object>, productIds: string[]) => {
  const { data } = await apolloClient.query<hasura.GET_PRODUCT_COLLECTION, hasura.GET_PRODUCT_COLLECTIONVariables>({
    query: gql`
      query GET_PRODUCT_COLLECTION($productIds: [String!]!) {
        product(where: { id: { _in: $productIds } }) {
          id
          sku
        }
      }
    `,
    variables: { productIds },
  })
  const productMap = data.product.reduce((accum, p) => {
    if (p) {
      accum[p.id] = { sku: p.sku }
    }
    return accum
  }, {} as { [productId: string]: { sku: string | null } })
  return productMap
}

const getProgramRolesMap = async (apolloClient: ApolloClient<object>, programIds: string[]) => {
  const { data } = await apolloClient.query<
    hasura.GET_PROGRAM_ROLE_COLLECTION,
    hasura.GET_PROGRAM_ROLE_COLLECTIONVariables
  >({
    query: gql`
      query GET_PROGRAM_ROLE_COLLECTION($programIds: [uuid!]!) {
        program_role(where: { program_id: { _in: $programIds } }) {
          name
          program_id
          member_id
          member {
            name
          }
        }
      }
    `,
    variables: { programIds },
  })
  const programRolesMap = data.program_role.reduce((accum, v) => {
    if (!accum[v.program_id]) {
      accum[v.program_id] = []
    }
    accum[v.program_id].push({ role: v.name, name: v.member?.name || '', id: v.member_id })
    return accum
  }, {} as { [programId: string]: { role: string; name: string; id: string }[] })
  return programRolesMap
}
