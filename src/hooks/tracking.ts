import { useApolloClient } from '@apollo/client'
import Cookies from 'js-cookie'
import { sum, uniq } from 'ramda'
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
  const enabledCW = Boolean(Number(settings['tracking.cw.enabled']))
  const apolloClient = useApolloClient()
  const EC_ITEM_MAP_KEY_PREFIX = `ga.event.item`
  return {
    view: (
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
      if (currentMember && enabledCW && options?.ignore !== 'CUSTOM') {
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
          },
        })
      }
    },
    impress: (
      resources: (Resource | null)[],
      options?: {
        collection?: string
        ignore?: 'EEC' | 'CUSTOM'
        utmSource?: string
      },
    ) => {
      if (options?.ignore !== 'EEC') {
        const items: EcItem[] = resources.reduce<EcItem[]>((prev, curr, index) => {
          const flattenedResources = curr?.products?.filter(r => r?.type !== 'program_content') ?? [curr]
          const products =
            flattenedResources
              ?.map(product => {
                const itemId = product?.sku || product?.id || ''
                const item = product
                  ? {
                      ...JSON.parse(Cookies.get(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '{}'),
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
                // update cookie cache
                Cookies.set(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item), { expires: 1 })
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
            ecommerce: { items },
          })
        }
      }

      if (enabledCW && options?.ignore !== 'CUSTOM') {
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
        const resourceOrProducts = resource.products?.filter(r => r?.type !== 'program_content') ?? [resource]
        const items: EcItem[] = resourceOrProducts
          .map(resource => {
            const itemId = resource?.sku || resource?.id || ''
            const item = resource
              ? {
                  ...JSON.parse(Cookies.get(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '{}'),
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
            // update cookie cache
            Cookies.set(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item), { expires: 1 })
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
            currency: appCurrencyId,
            value: resource.price,
            items,
          },
        })
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
      if (options?.ignore !== 'EEC') {
        const resourceOrProducts = resource.products?.filter(r => r?.type !== 'program_content') ?? [resource]
        const items: EcItem[] = resourceOrProducts
          .map(resource => {
            const itemId = resource?.sku || resource?.id || ''
            const item = resource
              ? {
                  ...JSON.parse(Cookies.get(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '{}'),
                  item_id: itemId,
                  item_name: resource.title,
                  currency: appCurrencyId,
                  price: resource.price,
                  item_brand: brand,
                  item_category: resource.categories?.join(trackingOptions.separator),
                  item_variant: uniq(resource.owners?.map(member => member.name)).join(trackingOptions.separator),
                }
              : null
            // update cookie cache
            Cookies.set(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item), { expires: 1 })
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
            currency: appCurrencyId,
            value: resource.price,
            items,
          },
        })
      }
      if (enabledCW && options?.ignore !== 'CUSTOM') {
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
    },
    addToCart: (
      resource: Resource,
      options?: {
        direct?: boolean
        quantity?: number
      },
    ) => {
      const itemId = resource.sku || resource.id
      const item: EcItem = {
        ...JSON.parse(Cookies.get(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '{}'),
        item_id: itemId,
        item_name: resource.title,
        price: resource.price,
        quantity: options?.quantity || 1, // TODO: use the inventory
        item_brand: brand,
        item_category: resource.categories?.join(trackingOptions.separator),
      }
      // update cookie cache
      Cookies.set(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item), { expires: 1 })
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'add_to_cart',
        label: resource.title,
        value: resource.price,
        ecommerce: {
          currency: appCurrencyId,
          value: resource.price,
          items: [item],
        },
      })
    },
    removeFromCart: (
      resource: Resource,
      options?: {
        quantity?: number
      },
    ) => {
      const itemId = resource.sku || resource.id
      const item: EcItem = {
        ...JSON.parse(Cookies.get(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '{}'),
        item_id: itemId,
        item_name: resource.title,
        price: resource.price,
        quantity: options?.quantity || 1, // TODO: use the inventory
        item_brand: brand,
        item_category: resource.categories?.join(trackingOptions.separator),
      }
      // update cookie cache
      Cookies.set(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item), { expires: 1 })
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      ;(window as any).dataLayer.push({
        event: 'remove_from_cart',
        label: resource.title,
        value: resource.price,
        ecommerce: {
          currency: appCurrencyId,
          value: resource.price,
          items: [item],
        },
      })
    },
    checkout: (
      resources: Resource[],
      options?: {
        step?: number
        ignore?: 'EEC' | 'CUSTOM'
        utmSource?: string
      },
    ) => {
      const items: EcItem[] = resources
        .map(resource => {
          const itemId = resource.sku || resource.id
          const item = resource
            ? {
                ...JSON.parse(Cookies.get(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '{}'),
                item_id: itemId,
                item_name: resource.title,
                price: resource.price,
                quantity: resource.options?.quantity || 1, // TODO: use the cart product
                item_brand: brand,
                item_category: resource.categories?.join(trackingOptions.separator),
                item_variant: uniq(resource.owners?.map(member => member.name)).join(trackingOptions.separator),
              }
            : null
          // update cookie cache
          Cookies.set(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item), { expires: 1 })
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
            currency: appCurrencyId,
            value: sum(resources.map(resource => resource.price || 0)),
            items,
          },
        })
      }
      if (enabledCW && options?.ignore !== 'CUSTOM') {
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
    },
    // TODO: add resource argument
    addPaymentInfo: (options?: { step?: number; gateway?: string; method?: string }) => {
      // ;(window as any).dataLayer = (window as any).dataLayer || []
      // ;(window as any).dataLayer.push({ ecommerce: null }) // Clear the previous ecommerce object.
      // ;(window as any).dataLayer.push({
      //   event: 'add_payment_info',
      //   label: resources.map(resource => resource.title).join('|'),
      //   value: sum(resources.map(resource => resource.price || 0)),
      //   ecommerce: {
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
      const items: EcItem[] =
        orderProducts.map(product => {
          const itemId = product.sku || product.id
          const item = {
            ...JSON.parse(Cookies.get(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`) || '{}'),
            item_id: product.sku || product.id,
            item_name: product.title,
            price: product.price,
            quantity: product.quantity,
            item_brand: brand,
            item_category: product.categories?.join(trackingOptions.separator),
            item_variant: uniq(product.owners?.map(member => member.name)).join(trackingOptions.separator),
          }
          // update cookie cache
          Cookies.set(`${EC_ITEM_MAP_KEY_PREFIX}.${itemId}`, JSON.stringify(item), { expires: 1 })
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
            currency: appCurrencyId,
            value: sum(orderProducts.map(orderProduct => orderProduct.price || 0)),
            transaction_id: orderId,
            items,
          },
        })
      }
      if (enabledCW && options?.ignore !== 'CUSTOM') {
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
    },
    login: () => {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({
        event: 'login',
      })
    },
  }
}
