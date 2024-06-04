import { gql, useApolloClient, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { sum, uniq } from 'ramda'
import { useEffect, useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { convertPathName, notEmpty } from '../helpers'
import { Member } from '../types/data'
import { EcItem } from '../types/general'
import { getResourceCollection, Resource, ResourceType } from './resource'
import { getCookie } from './util'

const convertProductType: (originalType: ResourceType, toMetaProduct: boolean) => ResourceType = (
  originalType: ResourceType,
  toMetaProduct: boolean = true,
) => {
  switch (originalType) {
    case 'program_content':
      return toMetaProduct ? ('program' as ResourceType) : originalType
    case 'program_plan':
      return toMetaProduct ? ('program' as ResourceType) : originalType
    case 'program_package_plan':
      return toMetaProduct ? ('program_package' as ResourceType) : originalType
    case 'activity_ticket':
      return toMetaProduct ? ('activity' as ResourceType) : originalType
    case 'merchandise_spec':
      return toMetaProduct ? ('merchandise' as ResourceType) : originalType
    case 'project_plan':
      return toMetaProduct ? ('project' as ResourceType) : originalType
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

type CwCardEnrollment = {
  card_id: string
  card: {
    title: string
  }
  member: {
    order_logs: {
      order_products: {
        product_id: string
        ended_at: string | null
        delivered_at: string | null
      }[]
    }[]
  }
}[]

type CwMemberShipCardDetails = {
  id: string
  title: string
  ended_at: string | null
  delivered_at: string | null
}[]

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
  const { settings, currencyId: appCurrencyId, id: appId } = useApp()
  const brand = settings['name'] || document.title
  const enabledGA4 = Boolean(Number(settings['tracking.ga4.enabled']))
  const enabledCW = Boolean(Number(settings['tracking.cw.enabled']))
  const apolloClient = useApolloClient()
  const EC_ITEM_MAP_KEY_PREFIX = `ga.event.item`

  // clear localStorage cache
  for (const key in localStorage) {
    if (key.startsWith(EC_ITEM_MAP_KEY_PREFIX) && key.endsWith('.expired_at')) {
      const itemId = key.split('.')[3]
      const expiredAt = dayjs(localStorage[key])
      if (dayjs() > expiredAt) {
        localStorage.removeItem(key)
        localStorage.removeItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`)
      }
    }
  }

  const UAview = (
    currentMember: Pick<Member, 'id' | 'name' | 'username' | 'email' | 'pictureUrl' | 'role' | 'options'> | null,
    options?: {
      ignore?: 'EEC' | 'CUSTOM'
      utmSource?: string
    },
  ) => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    !currentMember && (window as any).dataLayer.push({ event: 'clearMember', member: null })
    currentMember &&
      (window as any).dataLayer.push({
        event: 'updateMember',
        member: {
          id: currentMember.id,
          email: currentMember.email,
        },
      })
  }
  const CustomView = (
    currentMember: Pick<Member, 'id' | 'name' | 'username' | 'email' | 'pictureUrl' | 'role' | 'options'>,
    options?: {
      ignore?: 'EEC' | 'CUSTOM'
      utmSource?: string
    },
    memberShipCardDetails?: CwMemberShipCardDetails,
  ) => {
    const memberType = '會員'
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ memberData: null })
    ;(window as any).dataLayer.push({
      event: 'cwData',
      memberData: {
        member_type: memberType,
        id: currentMember.options[appId]?.id || '',
        social_id: currentMember.options[appId]?.social_id || '',
        uid: currentMember.options[appId]?.uid || '',
        uuid: currentMember.options[appId]?.uuid || '',
        env:
          window.location.href.includes('local') ||
          window.location.href.includes('dev') ||
          window.location.href.includes('127.0.0.1')
            ? 'develop'
            : 'prod',
        email: currentMember.email,
        dmp_id: getCookie('__eruid'),
        salesforce_id: currentMember.options[appId]?.salesforce_id || '',
        utm_source: options?.utmSource,
        memberShipCardDetails,
      },
    })
  }
  const EECImpress = (
    resources: (Resource | null)[],
    options?: {
      collection?: string
      ignore?: 'EEC' | 'CUSTOM'
      utmSource?: string
    },
  ) => {
    const impressionsWithProducts = resources.reduce<
      {
        id: string
        name: string
        price: number
        brand: string
        category?: string
        variant?: string
        quantity: number
        list: string
        position: number
      }[]
    >((prev, curr, index) => {
      const flattenedResources = curr?.products?.filter(r => r?.type !== 'program_content') ?? [curr]
      const products =
        flattenedResources
          ?.map(product =>
            product
              ? {
                  id: product.sku || product.id,
                  name: product.title,
                  price: product.price || 0,
                  brand,
                  category: product.categories?.join(trackingOptions.separator),
                  variant: uniq(product.owners?.map(member => member.name)).join(trackingOptions.separator),
                  quantity: 1, // TODO: use the inventory
                  list: options?.collection || convertPathName(window.location.pathname),
                  position: index + 1,
                }
              : null,
          )
          .filter(notEmpty) || []
      return [...prev, ...products]
    }, [])

    if (impressionsWithProducts.length > 0) {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'productImpression',
        label: impressionsWithProducts.map(impression => impression.name).join('|'),
        value: sum(impressionsWithProducts.map(impression => impression.price || 0)),
        ecommerce: {
          type: 'ua',
          currencyCode: appCurrencyId,
          impressions: impressionsWithProducts,
        },
      })
    }
  }
  const CustomImpress = (
    resources: (Resource | null)[],
    options?: {
      collection?: string
      ignore?: 'EEC' | 'CUSTOM'
      utmSource?: string
    },
  ) => {
    const cwProducts = resources.map(r => (r ? convertCwProduct(r, options?.utmSource) : null)).filter(notEmpty)
    if (cwProducts.length > 0) {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ itemData: { products: null, program: null, article: null } })
      ;(window as any).dataLayer.push({
        event: 'cwData',
        itemData: {
          products: cwProducts,
          program: cwProducts,
          article: cwProducts,
        },
      })
    }
  }
  const EECClick = (
    resource: Resource,
    options?: {
      collection?: string
      position?: number
      ignore?: 'EEC' | 'CUSTOM'
    },
  ) => {
    const resourceOrProducts = resource.products?.filter(r => r?.type !== 'program_content') ?? [resource]
    const products = resourceOrProducts
      .map(resource =>
        resource
          ? {
              id: resource.sku || resource.id,
              name: resource.title,
              price: resource.price,
              brand,
              category: resource.categories?.join(trackingOptions.separator),
              variant: uniq(resource.owners?.map(member => member.name)).join(trackingOptions.separator),
              position: options?.position,
            }
          : null,
      )
      .filter(notEmpty)
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: 'productClick',
      label: resource.title,
      value: resource.price,
      ecommerce: {
        type: 'ua',
        currencyCode: appCurrencyId,
        click: {
          actionField: { list: options?.collection || convertPathName(window.location.pathname) },
          products,
        },
      },
    })
  }
  const EECDetail = async (
    resource: Resource,
    options?: {
      collection?: string
      ignore?: 'EEC' | 'CUSTOM'
      utmSource?: string
    },
  ) => {
    if (options?.ignore !== 'EEC') {
      const resourceOrProducts = resource.products?.filter(r => r?.type !== 'program_content') ?? [resource]
      const products = resourceOrProducts
        .map(resource =>
          resource
            ? {
                id: resource.sku || resource.id,
                name: resource.title,
                price: resource.price,
                brand: settings['name'] || document.title,
                category: resource.categories?.join(trackingOptions.separator),
                variant: uniq(resource.owners?.map(member => member.name)).join(trackingOptions.separator),
              }
            : null,
        )
        .filter(notEmpty)
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'productDetail',
        label: resource.title,
        value: resource.price,
        ecommerce: {
          type: 'ua',
          currencyCode: appCurrencyId,
          detail: {
            actionField: { list: options?.collection || convertPathName(window.location.pathname) },
            products,
          },
        },
      })
    }
  }
  const CustomDetail = async (
    resource: Resource,
    options?: {
      collection?: string
      ignore?: 'EEC' | 'CUSTOM'
      utmSource?: string
    },
  ) => {
    const isProgramContent = resource.type === 'program_content'
    let products = resource.products?.filter(r => r?.type !== 'program_content')
    if (isProgramContent && resource.metaId) {
      const metaProducts = await getResourceCollection(apolloClient, [resource.metaId], true)
      products = metaProducts[0]?.products?.filter(p => p?.type === 'program_plan')
    }
    const targetResource = resource && convertCwProduct(resource, options?.utmSource)
    const subResources = products && products.filter(notEmpty).map(p => convertCwProduct(p, options?.utmSource))

    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ itemData: { products: null, program: null, article: null } })

    if (subResources) {
      ;(window as any).dataLayer.push({
        event: 'cwData',
        itemData: {
          products: subResources.map(r => ({ ...targetResource, ...r })),
          program: { ...targetResource, ...subResources[0] },
          article: { ...targetResource, ...subResources[0] },
        },
      })
      return
    }

    ;(window as any).dataLayer.push({
      event: 'cwData',
      itemData: {
        products: [targetResource],
        program: targetResource,
        article: targetResource,
      },
    })
  }
  const EECAddToCart = (
    resource: Resource,
    options?: {
      direct?: boolean
      quantity?: number
    },
  ) => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: 'addToCart',
      label: resource.title,
      value: resource.price,
      ecommerce: {
        type: 'ua',
        currencyCode: appCurrencyId,
        add: {
          direct: options?.direct,
          products: [
            {
              id: resource.sku || resource.id,
              name: resource.title,
              price: resource.price,
              brand,
              category: resource.categories?.join(trackingOptions.separator),
              variant: uniq(resource.owners?.map(member => member.name)).join(trackingOptions.separator),
              quantity: options?.quantity || 1, // TODO: use the inventory
            },
          ],
        },
      },
    })
  }
  const EECRemoveFromCart = (
    resource: Resource,
    options?: {
      quantity?: number
    },
  ) => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: 'removeFromCart',
      label: resource.title,
      value: resource.price,
      ecommerce: {
        type: 'ua',
        currencyCode: appCurrencyId,
        remove: {
          products: [
            {
              id: resource.sku || resource.id,
              name: resource.title,
              price: resource.price,
              brand: settings['name'] || document.title,
              category: resource.categories?.join(trackingOptions.separator),
              variant: uniq(resource.owners?.map(member => member.name)).join(trackingOptions.separator),
              quantity: options?.quantity || 1, // TODO: use the inventory
            },
          ],
        },
      },
    })
  }
  const EECCheckout = (
    resources: Resource[],
    options?: {
      step?: number
      ignore?: 'EEC' | 'CUSTOM'
      utmSource?: string
    },
  ) => {
    const ecProducts = resources
      .map(resource =>
        resource
          ? {
              id: resource.sku || resource.id,
              name: resource.title,
              price: resource.price,
              brand,
              category: resource.categories?.join(trackingOptions.separator),
              variant: uniq(resource.owners?.map(member => member.name)).join(trackingOptions.separator),
              quantity: resource.options?.quantity || 1, // TODO: use the cart product
            }
          : null,
      )
      .filter(notEmpty)
    if (ecProducts.length > 0) {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'checkout',
        label: resources.map(resource => resource.title).join('|'),
        value: sum(resources.map(resource => resource.price || 0)),
        ecommerce: {
          type: 'ua',
          currencyCode: appCurrencyId,
          checkout: {
            actionField: { step: options?.step || 1 },
            products: ecProducts,
          },
        },
      })
    }
  }
  const CustomCheckout = (
    resources: Resource[],
    options?: {
      step?: number
      ignore?: 'EEC' | 'CUSTOM'
      utmSource?: string
    },
  ) => {
    const cwProducts = resources
      .map(resource => (resource ? convertCwProduct(resource, options?.utmSource) : null))
      .filter(notEmpty)
    if (cwProducts.length > 0) {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ itemData: { products: null, program: null, article: null } })
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
  const EECAddPaymentInfo = (options?: { step?: number; gateway?: string; method?: string }) => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
    ;(window as any).dataLayer.push({
      event: 'checkoutOption',
      label: options?.gateway,
      value: 0,
      ecommerce: {
        type: 'ua',
        currencyCode: appCurrencyId,
        checkout_option: {
          actionField: {
            step: options?.step || 2,
            option: `${options?.gateway || 'unknown'}.${options?.method || 'unknown'}`,
          },
        },
      },
    })
  }
  const EECPurchase = (
    orderId: string,
    orderProducts: (Resource & { quantity: number })[],
    orderDiscounts: { name: string; price: number }[],
    options?: {
      step?: number
      ignore?: 'EEC' | 'CUSTOM'
      utmSource?: string
    },
  ) => {
    const ecProducts =
      orderProducts.map(product => ({
        id: product.sku || product.id,
        name: product.title,
        price: product.price,
        brand,
        category: product.categories?.join(trackingOptions.separator),
        variant: uniq(product.owners?.map(member => member.name)).join(trackingOptions.separator),
        quantity: product.quantity,
      })) || []
    if (ecProducts.length > 0) {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'purchase',
        label: orderProducts.map(orderProduct => orderProduct.title).join('|'),
        value: sum(orderProducts.map(orderProduct => orderProduct.price || 0)),
        ecommerce: {
          type: 'ua',
          currencyCode: appCurrencyId,
          purchase: {
            actionField: {
              id: orderId,
              affiliation: settings['name'] || document.title,
              revenue: sum(orderProducts.map(v => v.price || 0)) - sum(orderDiscounts.map(v => v.price)),
              coupon: orderDiscounts.map(v => v.name).join(trackingOptions.separator),
            },
            products: ecProducts,
          },
        },
      })
    }
  }
  const CustomPurchase = (
    orderId: string,
    orderProducts: (Resource & { quantity: number })[],
    orderDiscounts: { name: string; price: number }[],
    options?: {
      step?: number
      ignore?: 'EEC' | 'CUSTOM'
      utmSource?: string
    },
  ) => {
    const cwProducts =
      orderProducts.map(product => {
        return {
          ...convertCwProduct(product, options?.utmSource),
          order_number: orderId,
        }
      }) || []
    if (cwProducts.length > 0) {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ itemData: { products: null, program: null, article: null } })
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

  return {
    view: (
      currentMember: Pick<Member, 'id' | 'name' | 'username' | 'email' | 'pictureUrl' | 'role' | 'options'> | null,
      options?: {
        ignore?: 'EEC' | 'CUSTOM'
        utmSource?: string
      },
      memberShipCardDetails?: CwMemberShipCardDetails,
    ) => {
      UAview(currentMember, options)
      if (currentMember && enabledCW && options?.ignore !== 'CUSTOM')
        CustomView(currentMember, options, memberShipCardDetails)
    },
    impress: (
      resources: (Resource | null)[],
      options?: {
        collection?: string
        ignore?: 'EEC' | 'CUSTOM'
        utmSource?: string
      },
    ) => {
      if (enabledCW && options?.ignore !== 'CUSTOM') CustomImpress(resources, options)
      if (options?.ignore !== 'EEC') {
        if (enabledGA4) {
          const items: EcItem[] = resources.reduce<EcItem[]>((prev, curr, index) => {
            const flattenedResources = curr?.products?.filter(r => r?.type !== 'program_content') ?? [curr]
            const products =
              flattenedResources
                ?.map(product => {
                  const itemId = product?.sku || product?.id || ''
                  const cachedItem =
                    dayjs() < dayjs(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`))
                      ? JSON.parse(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '')
                      : {}
                  const item = product
                    ? {
                        ...cachedItem,
                        item_id: itemId,
                        item_name: product.title,
                        currency: appCurrencyId,
                        price: product.price || 0,
                        quantity: 1,
                        item_brand: brand,
                        item_category: product.categories?.join(trackingOptions.separator),
                        index: index + 1,
                        item_list_id: options?.collection || convertPathName(window.location.pathname),
                        item_list_name: options?.collection || convertPathName(window.location.pathname),
                        item_variant: uniq(product.owners?.map(member => member.name)).join(trackingOptions.separator),
                      }
                    : null
                  // update localStorage cache
                  localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item))
                  localStorage.setItem(
                    `${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`,
                    dayjs().add(1, 'day').toString(),
                  )
                  return item
                })
                .filter(notEmpty) || []
            return [...prev, ...products]
          }, [])

          if (items.length > 0) {
            ;(window as any).dataLayer = (window as any).dataLayer || []
            ;(window as any).dataLayer.push({ ecommerce: null })
            ;(window as any).dataLayer.push({
              event: 'view_item_list',
              label: items.map(item => item.item_name).join('|'),
              value: sum(items.map(item => item.price || 0)),
              ecommerce: {
                type: 'ga4',
                items,
              },
            })
          }
        } else EECImpress(resources, options)
      }
    },
    click: (
      resource: Resource,
      options?: {
        collection?: string
        position?: number
        ignore?: 'EEC' | 'CUSTOM'
      },
    ) => {
      if (options?.ignore !== 'EEC') {
        if (enabledGA4) {
          const resourceOrProducts = resource.products?.filter(r => r?.type !== 'program_content') ?? [resource]
          const items: EcItem[] = resourceOrProducts
            .map(resource => {
              const itemId = resource?.sku || resource?.id || ''
              const cachedItem =
                dayjs() < dayjs(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`))
                  ? JSON.parse(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '')
                  : {}

              const item = resource
                ? {
                    ...cachedItem,
                    item_id: itemId,
                    item_name: resource.title,
                    currency: appCurrencyId,
                    price: resource.price || 0,
                    item_brand: brand,
                    item_category: resource.categories?.join(trackingOptions.separator),
                    index: options?.position,
                    item_variant: uniq(resource.owners?.map(member => member.name)).join(trackingOptions.separator),
                  }
                : null
              // update localStorage cache
              localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item))
              localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`, dayjs().add(1, 'day').toString())

              return item
            })
            .filter(notEmpty)
          ;(window as any).dataLayer = (window as any).dataLayer || []
          ;(window as any).dataLayer.push({ ecommerce: null })
          ;(window as any).dataLayer.push({
            event: 'select_item',
            label: resource.title,
            value: resource.price,
            ecommerce: {
              type: 'ga4',
              currency: appCurrencyId,
              value: resource.price,
              items,
            },
          })
        } else EECClick(resource, options)
      }
    },
    detail: async (
      resource: Resource,
      options?: {
        collection?: string
        ignore?: 'EEC' | 'CUSTOM'
        utmSource?: string
      },
    ) => {
      if (enabledCW && options?.ignore !== 'CUSTOM') CustomDetail(resource, options)
      if (options?.ignore !== 'EEC') {
        if (enabledGA4) {
          const resourceOrProducts = resource.products?.filter(r => r?.type !== 'program_content') ?? [resource]
          const items: EcItem[] = resourceOrProducts
            .map(resource => {
              const itemId = resource?.sku || resource?.id || ''
              const cachedItem =
                dayjs() < dayjs(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`))
                  ? JSON.parse(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '')
                  : {}

              const item = resource
                ? {
                    ...cachedItem,
                    item_id: itemId,
                    item_name: resource.title,
                    currency: appCurrencyId,
                    price: resource.price,
                    item_brand: brand,
                    item_category: resource.categories?.join(trackingOptions.separator),
                    item_variant: uniq(resource.owners?.map(member => member.name)).join(trackingOptions.separator),
                  }
                : null
              // update localStorage cache
              localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item))
              localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`, dayjs().add(1, 'day').toString())

              return item
            })
            .filter(notEmpty)
          ;(window as any).dataLayer = (window as any).dataLayer || []
          ;(window as any).dataLayer.push({ ecommerce: null })
          ;(window as any).dataLayer.push({
            event: 'view_item',
            label: resource.title,
            value: resource.price,
            ecommerce: {
              type: 'ga4',
              currency: appCurrencyId,
              value: resource.price,
              items,
            },
          })
        } else EECDetail(resource, options)
      }
    },
    addToCart: (
      resource: Resource,
      options?: {
        direct?: boolean
        quantity?: number
      },
    ) => {
      if (enabledGA4) {
        const itemId = resource.sku || resource.id
        const cachedItem =
          dayjs() < dayjs(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`))
            ? JSON.parse(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '')
            : {}

        const item: EcItem = {
          ...cachedItem,
          item_id: itemId,
          item_name: resource.title,
          price: resource.price,
          quantity: options?.quantity || 1, // TODO: use the inventory
          item_brand: brand,
          item_category: resource.categories?.join(trackingOptions.separator),
        }
        // update localStorage cache
        localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item))
        localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`, dayjs().add(1, 'day').toString())
        ;(window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
        ;(window as any).dataLayer.push({
          event: 'add_to_cart',
          label: resource.title,
          value: resource.price,
          ecommerce: {
            type: 'ga4',
            currency: appCurrencyId,
            value: resource.price,
            items: [item],
          },
        })
      } else EECAddToCart(resource, options)
    },
    removeFromCart: (
      resource: Resource,
      options?: {
        quantity?: number
      },
    ) => {
      if (enabledGA4) {
        const itemId = resource.sku || resource.id

        const cachedItem =
          dayjs() < dayjs(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`))
            ? JSON.parse(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '')
            : {}

        const item: EcItem = {
          ...cachedItem,
          item_id: itemId,
          item_name: resource.title,
          price: resource.price,
          quantity: options?.quantity || 1, // TODO: use the inventory
          item_brand: brand,
          item_category: resource.categories?.join(trackingOptions.separator),
        }
        // update localStorage cache
        localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item))
        localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`, dayjs().add(1, 'day').toString())
        ;(window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
        ;(window as any).dataLayer.push({
          event: 'remove_from_cart',
          label: resource.title,
          value: resource.price,
          ecommerce: {
            type: 'ga4',
            currency: appCurrencyId,
            value: resource.price,
            items: [item],
          },
        })
      } else EECRemoveFromCart(resource, options)
    },
    viewCart: (
      resources: Resource[],
      options?: {
        step?: number
        ignore?: 'EEC' | 'CUSTOM'
        utmSource?: string
      },
    ) => {
      if (options?.ignore !== 'EEC') {
        if (enabledGA4) {
          const items: EcItem[] = resources
            .map(resource => {
              const itemId = resource.sku || resource.id
              const cachedItem =
                dayjs() < dayjs(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`))
                  ? JSON.parse(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '')
                  : {}

              const item = resource
                ? {
                    ...cachedItem,
                    item_id: itemId,
                    item_name: resource.title,
                    price: resource.price,
                    quantity: resource.options?.quantity || 1, // TODO: use the cart product
                    item_brand: brand,
                    item_category: resource.categories?.join(trackingOptions.separator),
                    item_variant: uniq(resource.owners?.map(member => member.name)).join(trackingOptions.separator),
                  }
                : null
              // update localStorage cache
              localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item))
              localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`, dayjs().add(1, 'day').toString())

              return item
            })
            .filter(notEmpty)
          if (items.length > 0) {
            ;(window as any).dataLayer = (window as any).dataLayer || []
            ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
            ;(window as any).dataLayer.push({
              event: 'view_cart',
              label: resources.map(resource => resource.title).join('|'),
              value: sum(resources.map(resource => resource.price || 0)),
              ecommerce: {
                type: 'ga4',
                currency: appCurrencyId,
                value: sum(resources.map(resource => resource.price || 0)),
                items,
              },
            })
          }
        }
      }
    },
    checkout: (
      resources: Resource[],
      coupon: { id: string; title: string; amount: number } | null,
      options?: {
        step?: number
        ignore?: 'EEC' | 'CUSTOM'
        utmSource?: string
      },
    ) => {
      if (enabledCW && options?.ignore !== 'CUSTOM') CustomCheckout(resources, options)
      if (options?.ignore !== 'EEC') {
        if (enabledGA4) {
          const items: EcItem[] = resources
            .map(resource => {
              const itemId = resource.sku || resource.id
              const cachedItem =
                dayjs() < dayjs(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`))
                  ? JSON.parse(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '')
                  : {}

              const item = resource
                ? {
                    ...cachedItem,
                    item_id: itemId,
                    item_name: resource.title,
                    price: resource.price,
                    quantity: resource.options?.quantity || 1, // TODO: use the cart product
                    item_brand: brand,
                    item_category: resource.categories?.join(trackingOptions.separator),
                    item_variant: uniq(resource.owners?.map(member => member.name)).join(trackingOptions.separator),
                  }
                : null
              // update localStorage cache
              localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item))
              localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`, dayjs().add(1, 'day').toString())

              return item
            })
            .filter(notEmpty)
          if (items.length > 0) {
            ;(window as any).dataLayer = (window as any).dataLayer || []
            ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
            ;(window as any).dataLayer.push({
              event: 'begin_checkout',
              label: resources.map(resource => resource.title).join('|'),
              value: sum(resources.map(resource => resource.price || 0)),
              ecommerce: {
                type: 'ga4',
                currency: appCurrencyId,
                value: sum(resources.map(resource => resource.price || 0)),
                coupon: coupon?.title || null,
                items,
              },
            })
          }
        } else EECCheckout(resources, options)
      }
    },
    // TODO: add resource argument
    addPaymentInfo: (options?: { step?: number; gateway?: string; method?: string }) => {
      EECAddPaymentInfo(options)
      // ;(window as any).dataLayer = (window as any).dataLayer || []
      // ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      // ;(window as any).dataLayer.push({
      //   event: 'add_payment_info',
      //   label: resources.map(resource => resource.title).join('|'),
      //   value: sum(resources.map(resource => resource.price || 0)),
      //   ecommerce: {
      // type: 'ga4',
      //     currency: appCurrencyId,
      //     value: sum(resources.map(resource => resource.price || 0)),
      //     items: ecProducts.map((product, index) => ({
      //       item_id: product.id,
      //       item_name: product.name,
      //       currency: appCurrencyId,
      //       price: product.price,
      //       quantity: product.quantity,
      //       item_brand: product.brand,
      //       item_category: product.category?.split(',')[0],
      //       item_category2: product.category?.split(',')[1],
      //       item_category3: product.category?.split(',')[2],
      //       item_category4: product.category?.split(',')[3],
      //       item_category5: product.category?.split(',')[4],
      //       index,
      //       item_variant: product.variant,
      //     })),
      //   },
      // })
    },
    purchase: (
      orderId: string,
      orderProducts: (Resource & { quantity: number })[],
      orderDiscounts: { name: string; price: number }[],
      options?: {
        step?: number
        ignore?: 'EEC' | 'CUSTOM'
        utmSource?: string
      },
    ) => {
      if (enabledCW && options?.ignore !== 'CUSTOM') CustomPurchase(orderId, orderProducts, orderDiscounts, options)
      if (options?.ignore !== 'EEC') {
        if (enabledGA4) {
          const items: EcItem[] =
            orderProducts.map(product => {
              const itemId = product.sku || product.id
              const cachedItem =
                dayjs() < dayjs(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`))
                  ? JSON.parse(localStorage.getItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '')
                  : {}

              const item = {
                ...cachedItem,
                item_id: product.sku || product.id,
                item_name: product.title,
                price: product.price,
                quantity: product.quantity,
                item_brand: brand,
                item_category: product.categories?.join(trackingOptions.separator),
                item_variant: uniq(product.owners?.map(member => member.name)).join(trackingOptions.separator),
              }
              // update localStorage cache
              localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item))
              localStorage.setItem(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}.expired_at`, dayjs().add(1, 'day').toString())

              return item
            }) || []
          if (items.length > 0) {
            ;(window as any).dataLayer = (window as any).dataLayer || []
            ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
            ;(window as any).dataLayer.push({
              event: 'purchase',
              label: orderProducts.map(orderProduct => orderProduct.title).join('|'),
              value: sum(orderProducts.map(orderProduct => orderProduct.price || 0)),
              ecommerce: {
                type: 'ga4',
                currency: appCurrencyId,
                value: sum(orderProducts.map(v => v.price || 0)) - sum(orderDiscounts.map(v => v.price)),
                transaction_id: orderId,
                coupon: orderDiscounts.map(v => v.name).join(trackingOptions.separator),
                items,
              },
            })
          }
        } else EECPurchase(orderId, orderProducts, orderDiscounts, options)
      }
    },
    login: () => {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({
        event: 'login',
      })
    },
  }
}

export const useMemberShipCardDetails = (memberId: string | undefined) => {
  const { loading, data: memberShipCardDetails } = useQuery(
    gql`
      query memberShipCardDetails($memberId: String!) {
        card_enrollment(where: { member_id: { _eq: $memberId } }) {
          card_id
          card {
            title
          }
          member {
            order_logs(where: { status: { _eq: "SUCCESS" } }) {
              order_products(where: { product_id: { _ilike: "Card%" } }) {
                product_id
                ended_at
                delivered_at
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        memberId: memberId ?? '',
      },
    },
  )
  dayjs.extend(utc)
  dayjs.extend(timezone)

  const [transformedMemberShipCardDetails, setTransformedMemberShipCardDetails] = useState<CwMemberShipCardDetails>([])
  useEffect(() => {
    if (loading) return

    const userTimezone = dayjs.tz.guess()
    const transFormatDate = (date: string | null, target: 'endedAt' | 'deliveredAt') => {
      if (!date && target === 'endedAt') return 'Infinite Date'
      if (!date && target === 'deliveredAt') return 'Not Yet Delivered'
      if (!dayjs(date).isValid()) return 'Invalid Date'
      return dayjs.utc(date).tz(userTimezone).format()
    }

    const filteredAndUniqueData: CwMemberShipCardDetails = []
    const cardIdToDatesMap = new Map()
    ;(memberShipCardDetails?.card_enrollment as CwCardEnrollment)?.forEach(cardEnrollment => {
      const cardId = cardEnrollment.card_id
      const cardTitle = cardEnrollment.card.title

      cardEnrollment.member.order_logs.forEach(orderLog => {
        orderLog.order_products.forEach(orderProduct => {
          if (!orderProduct.product_id.endsWith(cardId)) return
          const { ended_at, delivered_at } = orderProduct

          if (!cardIdToDatesMap.has(cardId)) {
            cardIdToDatesMap.set(cardId, [])
          }

          const dateList = cardIdToDatesMap.get(cardId)
          const dateString = `ended_at:${ended_at}-delivered_at:${delivered_at}` //Date unique key
          if (!dateList.includes(dateString)) {
            dateList.push(dateString)

            filteredAndUniqueData.push({
              id: cardId,
              title: cardTitle,
              ended_at: transFormatDate(ended_at, 'endedAt'),
              delivered_at: transFormatDate(delivered_at, 'deliveredAt'),
            })
          }
        })
      })
    })

    setTransformedMemberShipCardDetails(filteredAndUniqueData)
  }, [loading, memberShipCardDetails])

  return transformedMemberShipCardDetails
}
